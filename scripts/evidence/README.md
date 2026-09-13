# The evidence archive

`archive.mjs` implements AUTONOMY.md §12 (also recorded, verbatim, in `AI_DEVELOPMENT.md`
Amendment 2 §E): it compresses a campaign's evidence directories into a zip, writes a manifest of
SHA-256 hashes, and — unless `--dry-run` — attaches the zip to a GitHub release or tag with
`gh release upload`.

## Usage

```
node scripts/evidence/archive.mjs <campaign> <tag> [--dir <path>]... [--out <path>] [--dry-run]
```

- `<campaign>` — a short name for the evidence set (e.g. `polish-87-88-89`); becomes part of the
  zip's filename.
- `<tag>` — the git tag or release the archive is cited against; used only for the `gh release
  upload` target and the printed citation line, never read from the filesystem.
- `--dir <path>` — an evidence directory to include; repeatable. Defaults to
  `frontends/shell/e2e/out` when no `--dir` is given at all (AUTONOMY §12's own default). Every
  file under each declared directory, recursively, is included.
- `--out <path>` — where the zip and its manifest are written. Defaults to `target/evidence/`
  (gitignored, alongside the repo's other `target/*` data directories), or to
  `EVIDENCE_ARCHIVE_OUT` if that environment variable is set. (This piece's brief says "default the
  scratchpad or `target/evidence/`" — a committed script cannot hardcode a Claude Code session's own
  ephemeral scratchpad path, since it is per-session and not a documented public environment
  variable, so `EVIDENCE_ARCHIVE_OUT` is the hook: a custodian session that wants archives written
  to its own scratchpad sets it to that path before invoking the script.)
- `--dry-run` — build the zip and manifest, print the same summary and citation line, but never
  call `gh release upload`. **No network call and no repository-visible side effect happens under
  `--dry-run`.**

Output (both modes): file count, the zip's path and byte size, the zip's own SHA-256, the
manifest's path, and — last — the citation line for `RESULTS.md`:

```
Evidence: https://github.com/<owner>/<repo>/releases/download/<tag>/evidence-<campaign>-<date>.zip (SHA-256 <hash>)
```

The owner/repo pair is read from `git config --get remote.origin.url`; if no remote is configured
the line prints `<owner>/<repo>` literally so the placeholder is visible rather than silently wrong.

## The manifest

`evidence-<campaign>-<YYYY-MM-DD>.manifest.json`, written beside the zip:

```json
{
  "campaign": "…",
  "tag": "…",
  "generated_at": "ISO-8601",
  "source_dirs": ["…"],
  "archive": { "name": "…", "bytes": N, "sha256": "…" },
  "files": [{ "path": "…", "bytes": N, "sha256": "…" }, "…"]
}
```

Each file's `path` is its path relative to the current working directory at invocation time (forward
slashes), not relative to the `--dir` it came from — this keeps entries unambiguous when more than
one `--dir` is given, at the cost of a longer name than the bare filename.

## Why a hand-written zip, and why STORE only

Node's standard library has no zip writer (this script adds no dependency — `AUTONOMY.md`'s
`PLAN.yaml` rule is explicit that "dependency additions are the human's", and the same restraint
applies here). `archive.mjs` implements the minimal subset of the PKZIP format a plain evidence
bundle needs: a local file header before each file's bytes, a central directory after all of them,
and an end-of-central-directory record — no zip64, no encryption, and no DEFLATE compressor, because
**STORE** (compression method 0) keeps every file's bytes verbatim, so no compressor is needed
either, only each file's CRC-32 (from `node:zlib`'s own `crc32()`, itself standard library, present
from Node 22.2 — this repo runs Node 24). That keeps the implementation to the ZIP-writing function
itself at roughly 80 lines, per this piece's brief.

**Round-trip test (2026-09-13, run off-tree, not committed as a test file — the piece's brief
scoped this task to the two files in this directory):** a two-entry zip (one top-level file, one
file in a subdirectory) built with this exact writer was extracted with PowerShell's
`Expand-Archive -Path … -DestinationPath … -Force`. Extraction completed with no error, and every
extracted file's bytes were identical to its source (`diff` against the original, exit 0). The same
writer was then run for real against the main checkout's `frontends/shell/e2e/out` (409 files,
81,989,422-byte archive, `--dry-run`) and that archive was also extracted cleanly with
`Expand-Archive`, recovering all 409 files. On the strength of both round-trips, STORE-only zip was
kept rather than falling back to `tar.exe`.

## Never on a dry run

`--dry-run` is the only mode this piece's own task ran. Nothing was uploaded to any release, and no
file inside the main checkout (`C:\dev\spatial-ide`, as opposed to this governance worktree) was
written — only `frontends/shell/e2e/out` was read from there, and the zip/manifest went to a
scratch directory outside the repository. The dry run reported 409 files and an 81,989,422-byte
(~78.2 MiB) archive for that directory as it stood on 2026-09-13.
