# Ported source files — the registry of code ported from outside projects

*Built under `renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md` (with its Amendment 1) and ADR-030's note of 2026-10-09 (reopen 4). These files are **notice-generation inputs**, not a licensing layer of this repository — the same non-layer role `LICENSES/MIT.txt`, `BSD-3-Clause.txt`, `MPL-2.0.txt` and `Apache-2.0.txt` already play (`LICENSES/README.md`) and `LICENSES/third-party/duckdb-1.5.5/` plays for DuckDB's bundled works. The layers table (ADR-009) is unchanged by anything here.*

**The registry is empty.** `MANIFEST.json` reads `{"schema": 1, "works": []}`: nothing has been ported into this repository, so no file in this directory carries an upstream text yet, and every generated NOTICE is byte-identical to what it was before the registry existed. The first port is its own piece, under the human's typed word.

## What this directory is for

A file ported from an outside project into this repository's own source is a third-party work that no build manifest reports as third-party. The bundle viewer's esbuild metafile lists it as first-party input, the shell's Vite plugin keeps no first-party module at all, and Cargo sees only first-party crates. Build tools strip comments and compile Rust, so the file's own header does not ship either. This registry is the fifth notice set (ADR-030): it names each ported file, and pins the upstream licence and notice texts that must travel with it.

## What counts as a port

The human's definition of a port, of "read", and of a fresh write is `state/directives/2026-10-09-rulings-on-the-eight-forms.md:58 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:90a08ffc78a712b58b284283eaabd47256203df4d16d9ecc26f3af85c2aa7c98`. It is not restated here. **Paraphrase, not a quotation:** a fresh write is not registered here; a port always is, and every port needs the human's typed word, which `adopted_by` records.

## The method, in the order a port performs it

1. **Pin the commit.** Name the upstream repository and the 40-hex commit the files are taken from. Record both on the work's entry (`upstream_repository`, `upstream_commit`).
2. **Fetch the texts once, by hand.** Every licence and notice file the upstream ships at that commit goes in `LICENSES/third-party/ported/<work>/`, fetched from the pinned commit. The build never fetches (no network in the reader, the generator or the check). Record each file's `upstream_path`, `bytes` and `sha256` in `texts[]`.
3. **Verify where upstream gives a second hash.** Where the host reports a git blob SHA-1 for the path at the pinned commit, recompute it locally (`sha1("blob " + length + "\0" + bytes)`) and compare, as the DuckDB README's step 5 does. This is a pin-time check that the build does not repeat.
4. **The eol rule.** `.gitattributes` marks `LICENSES/third-party/ported/*/*` as `-text`, so pinned upstream bytes are never converted. The pattern also catches an Apache `NOTICE` file, which the `NOTICES*` pattern of the DuckDB route does not. `MANIFEST.json` and this README are repository-authored text and stay on the default handling.
5. **The licence id.** Record `license_id` and its basis: `self-declared` when the upstream text names its own SPDX id, `read-from-body` when the id is read from the text's operative clauses. No id is attributed to an upstream that declared none (ADR-030).
6. **Register the files.** Each ported file gets an entry in `files[]` with its repository-relative `path` (forward slashes), its `upstream_path` and the upstream copyright lines, exact. `adopted_by` is the human's typed word adopting the port: a tracked `state/directives/*.md` path, or `round <n>, item <m>`.
7. **Put the header on each file** (see below).

## The allowed upstream licences

`ALLOWED_UPSTREAM_LICENSE_IDS` in `renderer/bundle-viewer/portedNotices.mjs` is exactly `0BSD`, `Apache-2.0`, `BSD-2-Clause`, `BSD-3-Clause`, `BSL-1.0`, `ISC`, `MIT` and `Zlib`, compared case-sensitively (Amendment 1 (a), the human's ruling at `state/directives/2026-10-09-rulings-on-the-eight-forms.md:55 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:e39d049ba2ff172b60f05af003641e13082960ba5c5ce14b187ae03feb3dda16`). Any other licence needs a per-port ruling of the human's, which brings its own change; this route has no exception mechanism.

**Apache-2.0 carries a condition that no check reads:** any NOTICE file the upstream ships must be pinned with the licence text. That is the porter's duty, and the port piece's gate checks it.

## The header of a ported file

In the file's first twelve lines, in its comment syntax (`//`, `#`, `/*`, `*` or `<!--`):

```
SPDX-License-Identifier: AGPL-3.0-or-later AND <license_id>
Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
<each upstream copyright line, exact>
Ported-From: <upstream_repository> @ <upstream_commit> <upstream_path>
```

Under `docs/` the first id is `CC-BY-4.0`. The containing package's `license` field does not change, and no check reads or enforces it.

## What the build verifies, and what is only recorded

Three checks do the verifying, and they run in different places:

- `readPortedRegistry` reads the registry and re-hashes the pinned texts. It runs in every NOTICE generation (`notice()`, so the viewer's build and the shell's prebuild), in `npm run check:dist-notice`, in the repository check and in the shell's prebuild check.
- `checkPortedFiles` checks the tree against the registry. It runs only in the repository check (`node scripts/check-ported-notices.mjs`) and in the shell's prebuild check (`frontends/shell/scripts/generateNotice.mjs`, through `portedPrebuildCheck`). The viewer's build and `check:dist-notice` do not run it.
- `portedSectionFindings` checks the built text against the registry. It runs in `npm run check:dist-notice` only.

| Field | Checked by | How |
|---|---|---|
| `texts[].sha256`, `bytes` | `readPortedRegistry` | recomputed from the pinned file; the UTF-8 round trip must lose nothing |
| `work`, `upstream_commit`, `license_id_basis`, `retrieved`, the shape of every entry | `readPortedRegistry` | schema checks; a fault throws. `upstream_repository` and `license_id` are checked there only as non-empty strings |
| `license_id` | `checkPortedFiles` | on the allowlist above; the repository check and the prebuild check |
| `files[].path` | `checkPortedFiles` | the file carries the header above in its header window; the repository check and the prebuild check. In a git checkout the path must also be a tracked file. Outside a checkout (no `.git` entry at the root) the tracked test cannot run, and the check reads the file from the disk instead, so it must exist there |
| `adopted_by` | `checkPortedFiles` | well-formed, in the repository check and the prebuild check. In a git checkout a directive path must also be a tracked file; outside a checkout only its form is checked |

**Recorded, not re-verified:** `upstream_repository`, `upstream_commit` and `retrieved` name where the texts came from. Re-deriving them needs the network the build never touches.

In a git checkout, `node scripts/check-ported-notices.mjs` (CI: `ported-notices.yml`) and the packaged build's `prebuild` also fail on a marked file with no entry. A build from a source archive that is not a git checkout (no `.git` entry at the root) checks the registry side only and prints one NOTE line saying that unregistered markers were not searched.

## What this route does not do

- **It does not detect an unmarked copy.** A file pasted under the project's own header with no `Ported-From:` line cannot be told apart mechanically. Review and the DCO's clause (b) cover it.
- **It does not claim the pinned texts are the upstream's complete obligations.** The porter pins what upstream ships at the pinned commit.
- **It is not a claim of legal sufficiency.** That is counsel's question (ADR-009's caveat).
- **It does not search a tree that is not a git checkout.**
- **It does not scan every file type.** The header scan covers `.rs .ts .tsx .mts .cts .js .mjs .cjs .css .html .py .sh .ps1`, outside `LICENSES/`.

## The notice wording is latent

The headings and intros that `renderer/bundle-viewer/notice.mjs` renders for this set, and the entry shapes and the end sentinel, are the worker's draft, and each carries a comment calling it latent (Amendment 1 (c)). Nothing renders while the registry is empty. **The human sights the wording in the first port piece, which does not merge before they have.**
