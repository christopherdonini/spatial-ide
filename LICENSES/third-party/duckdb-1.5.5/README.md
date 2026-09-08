# DuckDB v1.5.5 — the license texts of the works embedded in its amalgamated source tree

*Pinned 2026-09-08, on the human's ruling of that date (DECISIONS-PENDING entry 62 = (a); preregistered
in `RELEASE-0.1.md` Amendment 10, "Preregistration — the entry-62 piece"). These files are
**notice-generation inputs**, not a licensing layer of this repository — the same non-layer role
`LICENSES/MIT.txt`, `BSD-3-Clause.txt`, `MPL-2.0.txt` and `Apache-2.0.txt` already play
(`LICENSES/README.md`). Nothing in this tree is licensed under any of them.*

## What this directory is, and the gap it closes

`engine/Cargo.toml` depends on `duckdb` with the `bundled` feature, so `libduckdb-sys 1.10505.0`
compiles **DuckDB's own amalgamated C/C++ source tree** into the packaged application. That tree
(`duckdb.tar.gz`, inside the crate's own registry source) embeds **26 further third-party works**
under its `third_party/` directory — and carries **no license, notice or copying file at all**,
anywhere:

```sh
tar -tzf duckdb.tar.gz | grep -c '^duckdb/third_party/[^/]*/$'                 # -> 26
tar -tzf duckdb.tar.gz | grep -ciE 'licen[cs]e|copying|notice'                 # -> 0
```

No Cargo manifest names any of those 26 works individually either — `duckdb` and `libduckdb-sys`
are the only crates `frontends/shell/scripts/rustCrateNotices.mjs` can see — so the Rust crate
section of the generated notice, which is read from `Cargo.lock`, structurally cannot reach them.
Until this directory existed, the packaged application's `NOTICE.txt` named those 26 directories and
stated outright that their license texts were not carried. This directory carries them.

## The method, in the order it was performed (2026-09-08)

**1. The DuckDB version the crate pins.** Two independent readings, which agree:

- `libduckdb-sys`'s own encoding, from its `build.rs` (`duckdb_version_from_pkg_version`, whose own
  comment reads *"duckdb-rs uses 1.MAJOR_MINOR_PATCH.x, e.g. DuckDB 1.5.0 => duckdb-rs 1.10500.x"*):
  crate `1.10505.0` → `10505` → major `10505/10000 = 1`, minor `(10505/100) % 100 = 5`, patch
  `10505 % 100 = 5` → **DuckDB 1.5.5**.
- The tarball's own baked-in constants, `duckdb/src/function/table/version/pragma_version.cpp`:
  `#define DUCKDB_VERSION "v1.5.5"` and `#define DUCKDB_SOURCE_ID "d8cdaa33fd"`.

**2. The upstream tag, proven rather than assumed.** `GET
https://api.github.com/repos/duckdb/duckdb/git/ref/tags/v1.5.5` resolves the tag to commit
`d8cdaa33fda8df955cc76ef58a280f68f4cd43fa`. Its short form is **exactly** the `DUCKDB_SOURCE_ID` the
amalgamation tarball carries, so the tarball this machine compiles and the upstream tree these texts
come from are the same source revision.

*What that identity is, stated precisely (architect advisory A3, 2026-09-09).* It is an identity of
the **declared revision** — the `DUCKDB_SOURCE_ID` the tarball's own `pragma_version.cpp` carries,
quoted in step 1 above — **plus a directory-set match** between the tarball's
`third_party/` listing and the pinned one (step 3, re-checked on every run by
`assertTarballMatchesManifest()`). It is **not** byte-identity of the tarball's sources with the
tag's own tree: the amalgamation is a generated, concatenated artifact, nothing here diffs its C/C++
against the upstream files, and no claim that it does should be read into the word "identity". What
the pin does establish byte-for-byte is narrower and is the part that matters for a notice — every
one of the 27 licence texts in this directory is the exact upstream blob at that tag (step 5).

**3. The enumeration — from the upstream tree, intersected with what the amalgamation carries.**
`third_party/` at tag `v1.5.5` holds **30** directories; the amalgamation tarball carries **26** of
them. The four upstream-only directories are `catch`, `imdb`, `jemalloc` and `snowball` — none is in
the tarball, so none is conveyed by this application and none is pinned here. The 26 pinned are
exactly the tarball's own listing:

```sh
tar -tzf duckdb.tar.gz | grep '^duckdb/third_party/[^/]*/$' \
  | sed 's#^duckdb/third_party/##;s#/$##' | sort
```

**4. The fetch.** The `third_party` tree at that tag was listed once
(`GET https://api.github.com/repos/duckdb/duckdb/git/trees/f42ee908782a676735ecaa2fdb0937ec6f5b5ec0?recursive=1`,
`"truncated": false`, 952 entries), every blob whose filename matches `LICENSE*`, `COPYING*` or
`NOTICE*` under one of the 26 was selected, and each was fetched with `curl` from

```
https://raw.githubusercontent.com/duckdb/duckdb/v1.5.5/third_party/<upstream path>
```

**Every one of the 26 ships a `LICENSE` file upstream.** No library needed the fallback the
preregistration allowed (*"where a library ships none upstream, the license header from its main
source file"*), so no license text here was reconstructed from a source header, and none was
written by hand. One library ships a second file: `tdigest/NOTICES`. 27 files in total. The exact
URL, byte count and `sha256` of each is in `MANIFEST.json`; the retrieval date is 2026-09-08.

**5. The verification — stronger than the fetch.** For each fetched file the **git blob SHA-1** was
recomputed locally (`sha1("blob " + length + "\0" + bytes)`) and compared against the SHA the tag's
own tree API reports for that path. **27 of 27 matched.** That proves the bytes on disk here are the
exact blobs `refs/tags/v1.5.5` names — independently of the transport, of the CDN, and of anything
this session could have got wrong while copying. Both hashes are recorded per file in
`MANIFEST.json` (`sha256` and `git_blob_sha1`).

**6. No new dependency.** `curl` was run once, at pin time, by hand — the entry-51 discipline. The
build never fetches: `frontends/shell/scripts/duckdbAmalgamationNotices.mjs` reads only the files in
this directory, and re-verifies every `sha256` in `MANIFEST.json` against them each time it runs,
failing closed on any mismatch.

## Which `MANIFEST.json` fields the build VERIFIES, and which are pinned records

A recorded hash that nothing reads looks, to anyone auditing this directory, exactly like a verified
one. So the split is stated outright (reviewer should-fix S4, 2026-09-09). **Verified on every
notice generation and every `npm run check:dist-notice`**, each against bytes on this disk, with no
network:

| Field | How it is verified |
|---|---|
| `works[].files[].sha256` | recomputed from the pinned file's own bytes (`readAmalgamationManifest`) |
| `works[].files[].bytes`, `git_blob_sha1` | recomputed in `duckdbAmalgamation.test.ts` (the blob SHA-1 by git's own formula) |
| `duckdb_version` | must equal the pinned directory's own name, `duckdb-<version>` |
| `crate.name`, `crate.version` | must equal the `libduckdb-sys` crate this build actually links, as `cargo metadata`/`cargo tree` report it — **the version guard** |
| `crate_tarball.file`, `.sha256` | the archive is located by the recorded name and hashed; it must equal the recorded `sha256` |
| `crate_tarball.third_party_dir_count` | recomputed from the archive's own listing |
| `works[].lib` (the set) | compared against that same listing, in both directions |

**Recorded provenance, NOT re-verified by the build:** `upstream_third_party_tree_sha`
(`f42ee908782a676735ecaa2fdb0937ec6f5b5ec0`). It names a git *tree object* inside DuckDB's
repository, and re-deriving it requires the network this build deliberately never touches. Its
derivation, performed once at pin time: tag `v1.5.5` → the commit that tag resolves to
(`d8cdaa33fda8df955cc76ef58a280f68f4cd43fa`, step 2) → that commit's root tree → its `third_party`
subtree, which is the sha listed by the trees API call in step 4 above. The tests assert only that it
is present and 40 hex characters; nothing in this repository claims it was re-checked offline. The
same holds for `duckdb_tag`, `duckdb_commit`, `upstream_repository`, `retrieved` and every
`files[].url`/`upstream_path` — they are the record of where these bytes came from, and the *bytes*
are what the hashes above prove.

## How each license id was decided

**DuckDB declares no SPDX id for these works.** There is no per-library license index anywhere in the
upstream tree at this tag (the root holds one `LICENSE` — DuckDB's own, an MIT-bodied grant reading
"Copyright 2018-2025 Stichting DuckDB Foundation", which does not speak for its vendored third-party
code). So `MANIFEST.json`'s `license_id` is not a quotation of an
upstream declaration, and does not pretend to be. Each entry carries a `license_id_basis` saying
which of two things it is:

- **`self-declared`** — the pinned text names its own license in its own words (for example
  `httplib/LICENSE` opens *"The MIT License (MIT)"*; `ska_sort/LICENSE` says *"Distributed under the
  Boost Software License, Version 1.0"*; `mbedtls/LICENSE` is the only one that names SPDX ids
  outright, as a dual `Apache-2.0` **OR** `GPL-2.0-or-later`).
- **`read-from-body`** — the text does not name itself, and the id was determined by reading its
  operative clauses (for example `lz4/LICENSE` has two redistribution conditions and no
  "neither the name … endorse" clause, making it BSD-2-Clause rather than BSD-3-Clause).

**In every case the pinned text itself is the authority, and the notice embeds that text verbatim.**
The id is a label for a reader's convenience; it is never substituted for the text, and no text is
summarised, normalised or shortened anywhere in the pipeline.

## What is deliberately *not* pinned here, named rather than omitted silently

- **`re2/AUTHORS`.** It exists upstream (`third_party/re2/AUTHORS`) and is not fetched. **The
  substantive reason first, the rule second** (architect advisory, 2026-09-09): `AUTHORS` is an
  enumeration of the holders — it is not part of what BSD-3-Clause requires a redistributor to
  reproduce. What that licence requires is "the above copyright notice, this list of conditions and
  the following disclaimer", and all three are inside the pinned `re2/LICENSE`: the copyright line
  (*"Copyright (c) 2009 The RE2 Authors. All rights reserved."*, which names the holder as a body),
  the three conditions, and the disclaimer. That whole file is conveyed verbatim. The filename-class
  rule points the same way — the preregistration names `LICENSE*`, `COPYING*` and `NOTICE*`, and
  `AUTHORS` is outside those three — but it is the mechanical restatement of the decision, not the
  ground for it.
- **The four upstream-only directories** (`catch`, `imdb`, `jemalloc`, `snowball`) — not in the
  amalgamation, therefore not conveyed, therefore not pinned. See step 3.
- **`snappy`'s differently-licensed benchmark data.** `snappy/LICENSE` records that some data in
  snappy's own upstream `testdata/` directory is under CC-BY-3.0 and MIT. No `testdata/` path exists
  anywhere under `third_party/` in the pinned crate tarball (checked), so none of it is conveyed.

## Line endings

`.gitattributes` marks **the 27 pinned licence files** `-text` — **no** end-of-line conversion in
either direction. That is deliberate and differs from the `text eol=lf` pin the four `LICENSES/*.txt`
template files carry: **`miniz/LICENSE`'s upstream bytes genuinely contain CRLF**, and `eol=lf` would
silently rewrite them on commit, changing the license text this application conveys and breaking both
hashes recorded for it. `-text` preserves all 27 files byte-for-byte on every platform, which is what
a hash-pinned, verbatim-conveyed corpus needs.

The two patterns are `LICENSES/third-party/*/*/LICENSE*` and `LICENSES/third-party/*/*/NOTICES*`, not
the whole directory (reviewer should-fix S3, 2026-09-09). `MANIFEST.json` and this `README.md` are
repo-authored text, hashed by nothing, and take the repository's default handling like any other text
file here; only the upstream bytes are pinned against conversion. `git ls-files --eol
LICENSES/third-party/` shows the split directly: 27 files `attr/-text` (one of them `i/crlf w/crlf`,
which is `miniz/LICENSE`), and the two authored files with no eol attribute at all.

## Changing anything in this directory

Every `sha256` here is re-checked at notice-generation time and again by
`frontends/shell/src/notices/duckdbAmalgamation.test.ts`, and the library list is compared against
the crate tarball's own `third_party/` listing at check time. Editing a pinned file, or adding or
removing a library, fails the build rather than quietly changing what a recipient reads.

**Bumping the crate is itself a re-pin, and the build now says so.** The version guard
(`assertCrateVersionMatchesManifest`) compares the linked `libduckdb-sys` version against
`crate.version` above and refuses when they differ, naming both — because the tag, the commit and
this directory's own path that the notice PRINTS are properties of the pinned version only, and a
bump that happens to keep the same 26 `third_party/` directories passes every other check here.
Re-pinning for a new DuckDB version therefore means a new `duckdb-<version>/` directory produced by
the method above, recorded the same way, and the old one removed (`resolvePinnedDir()` refuses two).
