#!/usr/bin/env node
// scripts/evidence/archive.mjs -- the evidence archive (AI_DEVELOPMENT.md Amendment 2 §E,
// AUTONOMY.md §12, verbatim there): compresses a campaign's evidence directories into
// `evidence-<campaign>-<date>.zip`, writes a manifest of SHA-256 per file plus the archive's own
// hash, and (unless --dry-run) attaches the zip to a GitHub release/tag with `gh release upload`.
//
// Node standard library only -- no dependency is added here (AUTONOMY.md's own PLAN.yaml rule:
// "no dependency is added -- dependency additions are the human's"). The zip writer below is a
// minimal STORE-only (no compression) implementation of the PKZIP local-file-header / central-
// directory / end-of-central-directory record layout; Node has no zip writer in its standard
// library, so this is the ~80-line subset a plain evidence bundle needs: no zip64, no encryption,
// no DEFLATE (STORE keeps files verbatim, so no compressor is needed either). Its CRC-32 comes
// from `node:zlib`'s own `crc32()` (Node >= 22.2, present here), also standard library.
//
// Round-trip-tested (2026-09-13, off-tree, not committed) by building a two-file/one-subdirectory
// zip with this exact writer and extracting it with PowerShell's `Expand-Archive`: extraction
// succeeded with no error and every extracted file was byte-identical to its source. See
// scripts/evidence/README.md for the record of that test.

import { createHash } from "node:crypto";
import { crc32 } from "node:zlib";
import { execFileSync } from "node:child_process";
import {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";

function usage(msg) {
  if (msg) console.error(`error: ${msg}`);
  console.error(
    "usage: node scripts/evidence/archive.mjs <campaign> <tag> [--dir <path>]... [--out <path>] [--dry-run]"
  );
  process.exit(1);
}

function parseArgs(argv) {
  const dirs = [];
  let out = null;
  let dryRun = false;
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") {
      if (argv[i + 1] == null) usage("--dir needs a path");
      dirs.push(argv[++i]);
    } else if (a === "--out") {
      if (argv[i + 1] == null) usage("--out needs a path");
      out = argv[++i];
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a.startsWith("--")) {
      usage(`unknown flag ${a}`);
    } else {
      positional.push(a);
    }
  }
  const [campaign, tag] = positional;
  if (!campaign || !tag) usage("<campaign> and <tag> are required");
  if (dirs.length === 0) dirs.push("frontends/shell/e2e/out");
  return { campaign, tag, dirs, out, dryRun };
}

// "default the scratchpad or target/evidence/" (this piece's brief): a checked-in script cannot
// hardcode a Claude Code session's own ephemeral scratchpad path (it differs per session and is
// not a documented public environment variable), so the hook point is an explicit override,
// EVIDENCE_ARCHIVE_OUT -- set it to the session's scratchpad directory to use that; unset, the
// default is the repo-local, gitignored target/evidence/ (README.md documents this choice).
function defaultOutDir() {
  return process.env.EVIDENCE_ARCHIVE_OUT || "target/evidence/";
}

function walk(dir, files) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, files);
    else if (entry.isFile()) files.push(abs);
  }
}

function sha256Hex(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

// -- ZIP (STORE only) -------------------------------------------------------

function dosDateTime(date) {
  const time =
    ((date.getHours() & 0x1f) << 11) |
    ((date.getMinutes() & 0x3f) << 5) |
    ((date.getSeconds() >> 1) & 0x1f);
  const dosDate =
    (((date.getFullYear() - 1980) & 0x7f) << 9) |
    (((date.getMonth() + 1) & 0xf) << 5) |
    (date.getDate() & 0x1f);
  return { time, date: dosDate };
}

function buildZip(entries) {
  // entries: [{ name: string (forward-slash path), data: Buffer }]
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;
  const { time, date } = dosDateTime(new Date());
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data) >>> 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // local file header signature
    local.writeUInt16LE(20, 4); // version needed to extract
    local.writeUInt16LE(0x0800, 6); // general purpose flag: bit 11 = UTF-8 name
    local.writeUInt16LE(0, 8); // compression method: 0 = STORE
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18); // compressed size == uncompressed (STORE)
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28); // extra field length
    localChunks.push(local, nameBuf, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); // central directory header signature
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6); // version needed to extract
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt16LE(0, 30); // extra length
    central.writeUInt16LE(0, 32); // comment length
    central.writeUInt16LE(0, 34); // disk number start
    central.writeUInt16LE(0, 36); // internal attributes
    central.writeUInt32LE(0, 38); // external attributes
    central.writeUInt32LE(offset, 42); // offset of local header
    centralChunks.push(central, nameBuf);

    offset += local.length + nameBuf.length + data.length;
  }
  const centralStart = offset;
  const centralBuf = Buffer.concat(centralChunks);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); // end of central directory signature
  end.writeUInt16LE(0, 4); // this disk
  end.writeUInt16LE(0, 6); // disk with central directory start
  end.writeUInt16LE(entries.length, 8); // entries on this disk
  end.writeUInt16LE(entries.length, 10); // total entries
  end.writeUInt32LE(centralBuf.length, 12); // size of central directory
  end.writeUInt32LE(centralStart, 16); // offset of central directory
  end.writeUInt16LE(0, 20); // comment length
  return Buffer.concat([...localChunks, centralBuf, end]);
}

// -- citation line ------------------------------------------------------

function originOwnerRepo() {
  try {
    const url = execFileSync("git", ["config", "--get", "remote.origin.url"], {
      encoding: "utf8",
    }).trim();
    const m = url.match(/[/:]([^/:]+)\/([^/]+?)(?:\.git)?$/);
    if (m) return { owner: m[1], repo: m[2] };
  } catch {
    // no remote configured, or git unavailable -- fall through to placeholder
  }
  return null;
}

function todayYMD() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function main() {
  const { campaign, tag, dirs, out, dryRun } = parseArgs(process.argv.slice(2));
  const outDir = resolve(out || defaultOutDir());
  mkdirSync(outDir, { recursive: true });

  const files = [];
  for (const d of dirs) {
    const abs = resolve(d);
    try {
      const st = statSync(abs);
      if (!st.isDirectory()) {
        usage(`--dir ${d} is not a directory`);
      }
    } catch {
      usage(`--dir ${d} does not exist (resolved: ${abs})`);
    }
    walk(abs, files);
  }
  files.sort();

  const cwd = resolve(".");
  const entries = [];
  const manifestFiles = [];
  for (const abs of files) {
    const data = readFileSync(abs);
    const relPath = relative(cwd, abs).split("\\").join("/");
    const hash = sha256Hex(data);
    entries.push({ name: relPath, data });
    manifestFiles.push({ path: relPath, bytes: data.length, sha256: hash });
  }

  const zipBuf = buildZip(entries);
  const zipName = `evidence-${campaign}-${todayYMD()}.zip`;
  const zipPath = join(outDir, zipName);
  writeFileSync(zipPath, zipBuf);
  const archiveHash = sha256Hex(zipBuf);

  const manifest = {
    campaign,
    tag,
    generated_at: new Date().toISOString(),
    source_dirs: dirs,
    archive: { name: zipName, bytes: zipBuf.length, sha256: archiveHash },
    files: manifestFiles,
  };
  const manifestName = `evidence-${campaign}-${todayYMD()}.manifest.json`;
  const manifestPath = join(outDir, manifestName);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  console.log(`files archived: ${manifestFiles.length}`);
  console.log(`archive: ${zipPath} (${zipBuf.length} bytes)`);
  console.log(`archive sha256: ${archiveHash}`);
  console.log(`manifest: ${manifestPath}`);

  if (dryRun) {
    console.log("--dry-run: no upload attempted.");
  } else {
    execFileSync("gh", ["release", "upload", tag, zipPath, "--clobber"], {
      stdio: "inherit",
    });
  }

  const or = originOwnerRepo();
  const assetUrl = or
    ? `https://github.com/${or.owner}/${or.repo}/releases/download/${tag}/${zipName}`
    : `https://github.com/<owner>/<repo>/releases/download/${tag}/${zipName}`;
  console.log("");
  console.log("Citation line for RESULTS.md:");
  console.log(`Evidence: ${assetUrl} (SHA-256 ${archiveHash})`);
}

main();
