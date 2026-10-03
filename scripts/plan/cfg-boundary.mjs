#!/usr/bin/env node
// cfg-boundary.mjs -- PORTABILITY R2, as PORT-1-LINUX-L1-PREREGISTRATION.md section 2 item 3 builds it.
//
// Every cfg form that names an operating system (an identifier `windows`, `unix`, `target_os` or
// `target_family` in the predicate of `cfg(...)`, `cfg!(...)` or the first argument of
// `cfg_attr(...)`) in product Rust source must sit in a file the allowlist below names, with the
// boundary it belongs to. Anything else is reported, by path and line, and the exit status is 1.
//
// It reads `git ls-files -z -- '*.rs'` in the working directory and takes no arguments. It drops
// spikes/, protocol/transport-bakeoff/ and any path with a tests/, benches/ or examples/ directory
// segment. In each file it blanks comments, string literals and char literals (newlines kept, so
// line numbers hold), and it drops the body of each `#[cfg(test)] mod name { ... }`.
//
// It does not see: test code, Cargo.toml target tables, runtime checks such as
// `std::env::consts::OS`, or separator and case assumptions that carry no cfg. Those stay the
// gates' to read. A green result says no OS-naming cfg sits outside a boundary, not that the code
// is portable.
//
// The allowlist is the table of the portability plan's section 2, as the preregistration carries
// it. An entry is added only by an architect-reviewed change.
//
// Output, exit codes: see the preregistration's section 7. Node standard library only.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ALLOWLIST = new Map([
  ["engine/src/watch.rs", "file watching"],
  ["engine/src/lod.rs", "application directories and free space"],
  ["kernel/src/permission/audit/log.rs", "application directories and filesystem case policy"],
  ["kernel/src/permission/audit/normalize.rs", "filesystem case policy"],
  ["kernel/src/publish/error.rs", "OS error classification"],
]);
const ALLOWED_PREFIXES = [["frontends/shell/src-tauri/", "native integration and packaging"]];

const OS_TOKENS = new Set(["windows", "unix", "target_os", "target_family"]);

function labelsFor(path) {
  if (ALLOWLIST.has(path)) return ALLOWLIST.get(path);
  for (const [prefix, label] of ALLOWED_PREFIXES) if (path.startsWith(prefix)) return label;
  return null;
}

function isExcluded(path) {
  if (path.startsWith("spikes/") || path.startsWith("protocol/transport-bakeoff/")) return true;
  const segments = path.split("/").slice(0, -1);
  return segments.some((s) => s === "tests" || s === "benches" || s === "examples");
}

// Replace comments, strings and char literals with spaces, keeping newlines.
function blank(src) {
  const out = src.split("");
  const n = src.length;
  const wipe = (from, to) => {
    for (let k = from; k < to; k++) if (out[k] !== "\n") out[k] = " ";
  };
  let i = 0;
  while (i < n) {
    const c = src[i];
    if (c === "/" && src[i + 1] === "/") {
      let j = i;
      while (j < n && src[j] !== "\n") j++;
      wipe(i, j);
      i = j;
    } else if (c === "/" && src[i + 1] === "*") {
      let depth = 1;
      let j = i + 2;
      while (j < n && depth > 0) {
        if (src[j] === "/" && src[j + 1] === "*") {
          depth++;
          j += 2;
        } else if (src[j] === "*" && src[j + 1] === "/") {
          depth--;
          j += 2;
        } else j++;
      }
      wipe(i, j);
      i = j;
    } else if (c === '"' || ((c === "r" || c === "b") && startsString(src, i))) {
      const j = stringEnd(src, i);
      wipe(i, j);
      i = j;
    } else if (c === "'") {
      const j = charEnd(src, i);
      if (j > i) {
        wipe(i, j);
        i = j;
      } else i++;
    } else if (/[A-Za-z0-9_]/.test(c)) {
      // Skip a whole identifier so an `r` or `b` inside one is never read as a string prefix.
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      i = j;
    } else i++;
  }
  return out.join("");
}

// At src[i] a lone `r`, `b`, `br`, `r#...`, `b"`: does a string literal start here?
function startsString(src, i) {
  let j = i;
  if (src[j] === "b") j++;
  if (src[j] === "r") {
    j++;
    while (src[j] === "#") j++;
    return src[j] === '"' && (j > i + 1 || src[i] === "r");
  }
  return src[i] === "b" && src[j] === '"';
}

function stringEnd(src, i) {
  const n = src.length;
  let j = i;
  if (src[j] === "b") j++;
  if (src[j] === "r") {
    j++;
    let hashes = 0;
    while (src[j] === "#") {
      hashes++;
      j++;
    }
    j++; // opening quote
    const close = '"' + "#".repeat(hashes);
    const at = src.indexOf(close, j);
    return at < 0 ? n : at + close.length;
  }
  j++; // opening quote
  while (j < n) {
    if (src[j] === "\\") j += 2;
    else if (src[j] === '"') return j + 1;
    else j++;
  }
  return n;
}

// End of a char literal starting at src[i], or i when it is a lifetime.
function charEnd(src, i) {
  if (src[i + 1] === "\\") {
    const at = src.indexOf("'", i + 3);
    return at < 0 ? i : at + 1;
  }
  const cp = src.codePointAt(i + 1);
  if (cp === undefined) return i;
  const w = cp > 0xffff ? 2 : 1;
  return src[i + 1 + w] === "'" ? i + 2 + w : i;
}

function matchClose(text, open, o, c) {
  let depth = 0;
  for (let k = open; k < text.length; k++) {
    if (text[k] === o) depth++;
    else if (text[k] === c && --depth === 0) return k;
  }
  return -1;
}

const TEST_MOD =
  /#\s*\[\s*cfg\s*\(\s*test\s*\)\s*\]\s*(?:#\s*\[[^\]]*\]\s*)*(?:pub(?:\([^)]*\))?\s+)?mod\s+\w+\s*\{/g;

function dropTestModules(text) {
  const out = text.split("");
  let m;
  TEST_MOD.lastIndex = 0;
  while ((m = TEST_MOD.exec(text)) !== null) {
    const open = m.index + m[0].length - 1;
    const close = matchClose(text, open, "{", "}");
    const end = close < 0 ? text.length : close + 1;
    for (let k = open; k < end; k++) if (out[k] !== "\n") out[k] = " ";
    TEST_MOD.lastIndex = end;
  }
  return out.join("");
}

// Every OS-naming cfg site in one file's source: an array of 1-based line numbers, one per site.
function sitesIn(src) {
  const text = dropTestModules(blank(src));
  const lines = [];
  const re = /\b(cfg_attr|cfg)\s*(!\s*)?\(/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const open = m.index + m[0].length - 1;
    const close = matchClose(text, open, "(", ")");
    if (close < 0) continue;
    let predicate = text.slice(open + 1, close);
    if (m[1] === "cfg_attr") {
      let depth = 0;
      for (let k = 0; k < predicate.length; k++) {
        const ch = predicate[k];
        if (ch === "(") depth++;
        else if (ch === ")") depth--;
        else if (ch === "," && depth === 0) {
          predicate = predicate.slice(0, k);
          break;
        }
      }
    }
    const idents = predicate.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
    if (!idents.some((t) => OS_TOKENS.has(t))) continue;
    lines.push(text.slice(0, m.index).split("\n").length);
  }
  return lines;
}

function main() {
  if (process.argv.length > 2) {
    process.stderr.write("cfg-boundary: takes no arguments\n");
    return 2;
  }
  const ls = spawnSync("git", ["ls-files", "-z", "--", "*.rs"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (ls.error || ls.status !== 0) {
    process.stderr.write("cfg-boundary: no file list (git ls-files failed)\n");
    return 2;
  }
  const files = ls.stdout.split("\0").filter((p) => p !== "" && !isExcluded(p));
  let sites = 0;
  let filesWithSites = 0;
  let outside = 0;
  const out = [];
  for (const path of files) {
    let src;
    try {
      src = readFileSync(path, "utf8");
    } catch {
      continue; // listed but absent from the working tree
    }
    const lines = sitesIn(src);
    if (lines.length === 0) continue;
    filesWithSites++;
    const label = labelsFor(path);
    for (const line of lines) {
      sites++;
      if (label === null) outside++;
      out.push(`cfg-boundary: ${path}:${line} ${label ?? "outside every boundary"}`);
    }
  }
  out.push(`cfg-boundary: ${sites} sites in ${filesWithSites} files, ${outside} outside every boundary`);
  process.stdout.write(out.join("\n") + "\n");
  return outside > 0 ? 1 : 0;
}

process.exitCode = main();
