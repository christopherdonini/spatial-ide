// Tests for cfg-boundary.mjs (PORT-1-LINUX-L1-PREREGISTRATION.md section 4, T1 to T7). Each test
// spawns the shipped CLI (process.execPath), either on the repository itself or on a fresh temporary
// git repository removed in `finally`. No timing, no network, no symlink, no drive letter, and no
// test is ignored on any platform.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const SCRIPT = join(HERE, "cfg-boundary.mjs");

function childEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  delete env.GIT_DIR;
  delete env.GIT_WORK_TREE;
  delete env.GIT_INDEX_FILE;
  return env;
}

function run(cwd, args = [], env = {}) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd,
    encoding: "utf8",
    env: childEnv(env),
  });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}

function fromHead(path) {
  const r = spawnSync("git", ["-C", ROOT, "show", `HEAD:${path}`], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  assert.equal(r.status, 0, `git show HEAD:${path} failed: ${r.stderr}`);
  return r.stdout;
}

// A fresh temporary git repository holding `files` (path -> text), tracked but not committed.
function withRepo(files, body) {
  const dir = mkdtempSync(join(tmpdir(), "cfg-boundary-"));
  try {
    const init = spawnSync("git", ["init", "-q"], { cwd: dir, env: childEnv() });
    assert.equal(init.status, 0);
    for (const [path, text] of Object.entries(files)) {
      const full = join(dir, ...path.split("/"));
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, text);
    }
    const add = spawnSync("git", ["add", "-A"], { cwd: dir, env: childEnv() });
    assert.equal(add.status, 0);
    return body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const NONE = "cfg-boundary: 0 sites in 0 files, 0 outside every boundary\n";

test("the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site", () => {
  // RECORDED MUTATION: the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site
  // (M1, engine/src/lod.rs dropped from the allowlist): TO BE RECORDED
  const r = run(ROOT);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.stderr, "");
  const lines = r.stdout.split("\n").filter((l) => l !== "");
  const siteLines = lines.slice(0, -1);
  assert.equal(siteLines.length, 18);
  for (const l of siteLines) assert.doesNotMatch(l, /outside every boundary/);
  assert.equal(lines.at(-1), "cfg-boundary: 18 sites in 6 files, 0 outside every boundary");
  const perFile = {};
  for (const l of siteLines) {
    const m = /^cfg-boundary: (\S+):\d+ /.exec(l);
    assert.ok(m, l);
    perFile[m[1]] = (perFile[m[1]] ?? 0) + 1;
  }
  assert.deepEqual(perFile, {
    "engine/src/lod.rs": 2,
    "engine/src/watch.rs": 3,
    "frontends/shell/src-tauri/src/origin.rs": 2,
    "kernel/src/permission/audit/log.rs": 3,
    "kernel/src/permission/audit/normalize.rs": 2,
    "kernel/src/publish/error.rs": 6,
  });
});

test("a_planted_cfg_windows_in_a_shared_engine_module_fails_by_path", () => {
  // RECORDED MUTATION: a_planted_cfg_windows_in_a_shared_engine_module_fails_by_path
  // (M2, attribute forms are not matched, only cfg!): TO BE RECORDED
  const original = fromHead("engine/src/predicate.rs");
  const lines = original.split("\n");
  const at = lines.findIndex((l) => /^pub (fn|struct|enum) /.test(l));
  assert.ok(at >= 0, "no top-level pub item found to plant above");
  lines.splice(at, 0, "#[cfg(windows)]");
  withRepo({ "engine/src/predicate.rs": lines.join("\n") }, (dir) => {
    const r = run(dir);
    assert.equal(r.status, 1);
    assert.equal(
      r.stdout,
      `cfg-boundary: engine/src/predicate.rs:${at + 1} outside every boundary\n` +
        "cfg-boundary: 1 sites in 1 files, 1 outside every boundary\n",
    );
  });
});

test("a_cfg_inside_a_cfg_test_module_is_test_code_and_one_after_it_is_not", () => {
  // RECORDED MUTATION: a_cfg_inside_a_cfg_test_module_is_test_code_and_one_after_it_is_not
  // (M3, the test-module exclusion is removed): TO BE RECORDED
  const path = "kernel/src/permission/boundary.rs";
  const original = fromHead(path);
  withRepo({ [path]: original }, (dir) => {
    const r = run(dir);
    assert.equal(r.status, 0, r.stdout);
    assert.equal(r.stdout, NONE);
  });
  const appended = original + "\n#[cfg(unix)] fn after() {}\n";
  const plantedLine = original.split("\n").length - 1 + 2;
  withRepo({ [path]: appended }, (dir) => {
    const r = run(dir);
    assert.equal(r.status, 1);
    assert.equal(
      r.stdout,
      `cfg-boundary: ${path}:${plantedLine} outside every boundary\n` +
        "cfg-boundary: 1 sites in 1 files, 1 outside every boundary\n",
    );
  });
});

test("cfg_text_in_comments_and_string_literals_is_not_a_site", () => {
  // RECORDED MUTATION: cfg_text_in_comments_and_string_literals_is_not_a_site
  // (M4, blanking is skipped): TO BE RECORDED
  const src = [
    "/// Docs may say #[cfg(windows)] and cfg!(unix) freely.",
    "// So may a line comment: #[cfg(target_os = \"linux\")]",
    "/* and a block comment /* nested #[cfg(unix)] */ still inside */",
    "fn f() -> (&'static str, &'static str) {",
    "    let a = \"#[cfg(windows)] and \\\" cfg!(unix)\";",
    "    let b = r#\"cfg!(target_family = \"unix\") with a quote \" inside\"#;",
    "    let c = '\"';",
    "    (a, b)",
    "}",
    "",
  ].join("\n");
  withRepo({ "engine/src/shared.rs": src }, (dir) => {
    const r = run(dir);
    assert.equal(r.status, 0, r.stdout);
    assert.equal(r.stdout, NONE);
  });
});

test("every_cfg_form_naming_an_os_is_a_site", () => {
  // RECORDED MUTATION: every_cfg_form_naming_an_os_is_a_site
  // (M5, target_os is removed from the token set): TO BE RECORDED
  const src = [
    "fn a() -> bool {",
    "    cfg!(target_os = \"macos\")",
    "}",
    "#[cfg_attr(unix, derive(Debug))]",
    "struct S;",
    "#[cfg(any(",
    "    windows,",
    "    target_family = \"wasm\"",
    "))]",
    "fn b() {}",
    "#![cfg(not(windows))]",
    "#[cfg(feature = \"x\")]",
    "#[cfg_attr(test, allow(dead_code))]",
    "#![cfg_attr(not(debug_assertions), windows_subsystem = \"windows\")]",
    "",
  ].join("\n");
  withRepo({ "engine/src/shared.rs": src }, (dir) => {
    const r = run(dir);
    assert.equal(r.status, 1);
    const want = [2, 4, 6, 11].map((n) => `cfg-boundary: engine/src/shared.rs:${n} outside every boundary`);
    assert.equal(r.stdout, want.join("\n") + "\ncfg-boundary: 4 sites in 1 files, 4 outside every boundary\n");
  });
});

test("test_targets_and_excluded_crates_are_not_scanned", () => {
  // RECORDED MUTATION: test_targets_and_excluded_crates_are_not_scanned
  // (M6, the tests/ segment exclusion is removed): TO BE RECORDED
  const planted = "#[cfg(windows)]\nfn x() {}\n";
  withRepo(
    {
      "engine/tests/x.rs": planted,
      "kernel/benches/b.rs": planted,
      "spikes/s/src/lib.rs": planted,
      "protocol/transport-bakeoff/src/m.rs": planted,
    },
    (dir) => {
      const r = run(dir);
      assert.equal(r.status, 0, r.stdout);
      assert.equal(r.stdout, NONE);
    },
  );
});

test("a_missing_file_list_or_an_argument_exits_2_with_the_fact_line", () => {
  // RECORDED MUTATION: a_missing_file_list_or_an_argument_exits_2_with_the_fact_line
  // (M7, a failed git ls-files is read as an empty list): TO BE RECORDED
  const dir = mkdtempSync(join(tmpdir(), "cfg-boundary-norepo-"));
  try {
    const r = run(dir, [], { GIT_CEILING_DIRECTORIES: dirname(dir) });
    assert.equal(r.status, 2);
    assert.equal(r.stdout, "");
    assert.equal(r.stderr, "cfg-boundary: no file list (git ls-files failed)\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  const a = run(ROOT, ["--help"]);
  assert.equal(a.status, 2);
  assert.equal(a.stdout, "");
  assert.equal(a.stderr, "cfg-boundary: takes no arguments\n");
});
