# Licenses — which text applies where

ADR-009 (Accepted 2026-08-07) sets four licensing layers. This directory holds the verbatim texts;
this file records **which layer each part of the tree is in**.

> **Update, 2026-08-18 (ADR-009 pre-public checklist pass):** both texts named "missing" below were
> fetched the same day this file was written (`PRE-PUBLIC-CHECKLIST.md`'s "Custodian completion
> note — 2026-08-07"), but this file's own prose was never updated to say so — a documentation
> staleness, not a state fact. Verified present now: `LICENSES/AGPL-3.0-or-later.txt` (34,523 B,
> sha256 `0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0`, canonical
> `GNU AFFERO GENERAL PUBLIC LICENSE` header) and `LICENSES/CC-BY-4.0.txt` (18,657 B, sha256
> `9ba9550ad48438d0836ddab3da480b3b69ffa0aac7b7878b5a0039e7ab429411`, canonical `Attribution 4.0
> International` header). `LICENSE` and `docs/LICENSE` no longer carry a trailing missing-text
> notice (confirmed by reading both). The "what was searched" record below is retained as-is — it
> is a historical record of the no-downloads session, not a current-state claim; the table above it
> and the surrounding prose are corrected in place.

## The layers, and where they live today

| Layer (ADR-009) | License | Where it lives in this tree | Text |
|---|---|---|---|
| Core | `AGPL-3.0-or-later` | `kernel/` `engine/` `renderer/` `protocol/` `frontends/` `spikes/` and every other source file | `AGPL-3.0-or-later.txt` ✅ |
| Spec and documentation | `CC-BY-4.0` | `docs/` (including `docs/10`, the SKP protocol specification) | `CC-BY-4.0.txt` ✅ |
| Client SDKs, generated bindings, example integrations | `Apache-2.0` | **no member yet** — see "The Apache-2.0 layer is empty" below | `Apache-2.0.txt` ✅ |
| Commercial products | separate works, separately licensed | not in this repository | n/a |

The root `LICENSE` carries the core grant. `docs/LICENSE` carries the documentation grant.

**Not every file in this directory is a layer.** `MIT.txt`, `BSD-3-Clause.txt` and `MPL-2.0.txt` are
notice-generation INPUTS — template texts embedded under OTHER projects' crates in a generated
notice — and none of those three ids appears in the table above, because nothing in this tree is
licensed under any of them. See "`MIT.txt`, `BSD-3-Clause.txt` and `MPL-2.0.txt` — provenance" below.

**Neither is the `third-party/` subdirectory.** `third-party/duckdb-1.5.5/` holds 27 files: the
upstream licence and notice texts of the 26 third-party works embedded in DuckDB's amalgamated
source tree, which the data engine compiles into the packaged application. They are
notice-generation INPUTS in exactly the same sense — other projects' licences, embedded verbatim
under those projects' own names in a generated notice — and **none of them licenses anything in this
tree**. The layers table above is unchanged by their presence. See
"`third-party/duckdb-1.5.5/` — the DuckDB amalgamation's licence texts" below.

## Two texts were missing at first, and that was deliberate rather than an oversight

`AGPL-3.0-or-later.txt` and `CC-BY-4.0.txt` were **not in this directory** when this file was first
written. Both are present now (see the 2026-08-18 update note above); the record of why they were
absent and how they were later verified is kept below for provenance.

The session that set up this directory was working under a binding **no-downloads** constraint (the
operator was on a bandwidth-constrained connection: no installs, no fetches, no toolchain or browser downloads).
Both texts were searched for on the machine and **neither exists on it**. They were therefore
recorded as *deferred with reason* — the constraint's stated fallback — rather than fetched.

**They were deliberately not written from memory.** A license is a legal instrument; an
approximately-transcribed one is worse than one that is honestly marked absent, because it looks
like the real thing. This applies with particular force to AGPL-3.0: the GPL-3.0 text *is* present
on this machine (Inkscape ships it), and AGPL-3.0 is **not** GPL-3.0 with an edit — it differs in
its title, in a preamble paragraph, and in the whole of section 13, and reconstructing one from the
other would be fabrication with a plausible surface.

### What was searched, so this can be re-checked rather than retaken on trust

Searched on 2026-08-07, on the reference machine:

- `~/.cargo/registry/src` — by filename, and by content for `GNU AFFERO GENERAL PUBLIC LICENSE` and
  `Creative Commons Attribution 4.0 International`. No hit for either.
- `~/.rustup` — no hit.
- `C:\Program Files` and `C:\Program Files (x86)` — by filename for `*GPL*` and `COPYING*`, and by
  content for `AFFERO` across `*.txt`, `COPYING*`, `LICENSE*`, `*.md`. **No hit for `AFFERO`.**
  Found and rejected as the wrong license: `GPL-3.0.txt`, `GPL-2.0.txt`, `LGPL-2.1.txt` (Inkscape),
  `GPL.txt` (Stellarium), `COPYING` (QGIS), `LGPL.TXT` (PotPlayer).
- This repository's `node_modules` trees — permissive licenses only (MIT, Apache-2.0, BSD, 0BSD,
  ISC); no AGPL, no CC-BY.

### Retrieving them — done, 2026-08-07

The commands below are kept for reference/reproducibility, not as an outstanding step:

```sh
curl -o LICENSES/AGPL-3.0-or-later.txt https://www.gnu.org/licenses/agpl-3.0.txt
curl -o LICENSES/CC-BY-4.0.txt          https://creativecommons.org/licenses/by/4.0/legalcode.txt
```

The trailing notices in `LICENSE` and `docs/LICENSE` were deleted the same day.

**Both files exist; ADR-009 pre-public checklist item 1's license-text sub-item is discharged.**
`PRE-PUBLIC-CHECKLIST.md` and `CUT-STATE-ADR-009-checklist.md` track the checklist's remaining
items.

## `Apache-2.0.txt` — provenance, so it is verifiable rather than trusted

Copied from `~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/ahash-0.8.12/LICENSE-APACHE`.

- `sha256` `a60eea817514531668d7e00765731449fe14d059d3249e0bc93b36de45f759f2`
- 201 lines, 10 847 bytes, including the `APPENDIX: How to apply the Apache License to your work`.

**Why this copy is trustworthy without a download:** 95 crates in the local registry — independently
published, by unrelated authors — ship a file with **exactly this hash**. It is the most common of
the variants present by a wide margin; the runners-up (33 and 11 copies) are the appendix-less
excerpt and a `https://`-URL variant. Byte-identity across 95 independent upstreams is a stronger
provenance argument than a single fetch would have been.

## `MIT.txt`, `BSD-3-Clause.txt` and `MPL-2.0.txt` — provenance, and why these are notice-generation INPUTS, not a repository layer

Added release-cut fix batch, MUST-FIX 2 (`frontends/shell/scripts/rustCrateNotices.mjs`'s
`buildCanonicalLicenseTexts`). Twelve Rust crates statically linked into the packaged shell's own
binary declare an SPDX license id but ship no `LICENSE`/`NOTICE`/`COPYING` file in their own
registry source (`DEPENDENCY-LICENSES.md`'s dated block names all twelve). Before this fix, the
generator borrowed a license text from a DIFFERENT linked crate that happened to declare the same
id and ship its own file -- wrong for MIT and BSD-3-Clause specifically, because both licenses'
own canonical body embeds a "Copyright (c) &lt;year&gt; &lt;holder&gt;" line, so the borrowed text
carried that OTHER crate's real copyright notice into a crate that never wrote it. These three files
are this repository's own vetted copies, fetched from the SPDX license list — **not** the way
`Apache-2.0.txt` above was obtained, which was copied from a local crate's own bundled file and
argued trustworthy by 95-way byte-identity across independent upstreams; that argument does not
transfer to MIT or BSD-3-Clause, since every crate's own copy of those two differs from every
other's in exactly the copyright line at issue, so there is no byte-identical majority to appeal to
and a real fetch of the template is the only honest source. Where a placeholder exists it is left
exactly as SPDX's own UNFILLED placeholder -- the same shape `Apache-2.0.txt`'s own appendix already
carries (`Copyright [yyyy] [name of copyright owner]`), never a specific name.

**All three are the PLAIN-TEXT variant, deliberately** (coordinator follow-up to the fix batch,
item 2). SPDX publishes two forms of some licenses: a plain text, and a *matching template* carrying
`<<var;name=…;original=…;match=…>>` markup that defines which substitutions still count as the same
license. The template form is a specification for tooling, not a licence text for a human reader,
and embedding it in a shipped NOTICE would put that markup in front of a recipient. Every file below
is checked to contain no `<<var` sequence.

- **`MIT.txt`** — fetched `https://spdx.org/licenses/MIT.txt`, retrieved 2026-09-08, `sha256`
  `c3b1b78bc8bd3ea13aa4bc9778442d16560270afa235006d816e5e88cef24db4`, 1077 bytes. That endpoint
  serves MIT's plain text directly (`Copyright (c) <year> <copyright holders>`), so it is used
  as-is; unchanged by the follow-up.
- **`BSD-3-Clause.txt`** — fetched
  `https://raw.githubusercontent.com/spdx/license-list-data/main/text/BSD-3-Clause.txt`, retrieved
  2026-09-08, `sha256` `5a93d5831e1297ab10fe643e1a631e83be392896da14ee2951285a79012df69d`, 1460
  bytes. Placeholders are plain angle-bracket text (`Copyright (c) <year> <owner>.`, and
  "Neither the name of the copyright holder"). **A different host from the other two, and that is
  the honest record rather than a tidier one — stated as the dated observation it is, not as a claim
  about the host:** on **2026-09-08**, `https://spdx.org/licenses/BSD-3-Clause.txt` — the URL the
  other two use, and the one this file recorded until that date — returned the `<<var…>>` matching
  template for this license (`sha256`
  `0fe4dd6931c4c2fc418940de41074fa3c506cad24bfd891743ea7f2fcfe631ef`, 1693 bytes, the text this
  file previously stored), not a plain text. The plain text was therefore taken that same day from
  `license-list-data`, SPDX's own published data repository and the source that host renders from.
  What that URL serves on any other date is not asserted here; what is asserted is the URL recorded
  above, which is the one that reproduces the hash above.
- **`MPL-2.0.txt`** — fetched `https://spdx.org/licenses/MPL-2.0.txt`, retrieved 2026-09-08,
  `sha256` `66c10535a495f4cd8115607e890f8116d657064b98557f660c51e123b3f3fee6`, 15190 bytes. MPL-2.0
  carries **no** copyright placeholder at all — the licence's body is the same text for every
  work that uses it — so here the template and the text are one thing and no placeholder question
  arises. Added by the coordinator follow-up (item 1): `selectors 0.36.1` declares `MPL-2.0` and
  ships no license file, and without this template the generated notice carried an explicit
  "no canonical text available" entry for it — a one-crate attribution gap, which is the opposite
  of what ADR-030 (a) is for.

**These three files are notice-generation INPUTS, not a layer of this repository.** The layers table
above (ADR-009) is unchanged by their presence: nothing in this tree is MIT-, BSD-3-Clause- or
MPL-2.0-licensed, no source file here carries any of those SPDX headers, and none of the three ids
appears in the layers table. They exist solely so `buildCanonicalLicenseTexts` has a vetted,
citable text to embed under OTHER PROJECTS' crates in a GENERATED notice
(`frontends/shell/src/generated/NOTICE.txt`) -- the same non-layer role `Apache-2.0.txt` above
already plays for the twelve gap crates that declare `Apache-2.0` (directly, or as one atom of an
`OR` expression, e.g. `flatbuffers`, and the `unic-*` crates' `MIT/Apache-2.0`). Offering a
template for more than one atom of a declared `OR` expression (a crate declaring
`MIT/Apache-2.0`, say) is informational, never an election of one license over the other on that
crate's behalf -- `notice.mjs`'s own rendered text says so directly, beside the texts themselves.

**Removing one of these files breaks the build on purpose.** `buildCanonicalLicenseTexts` fails
closed: a gap crate declaring an id this directory carries no `<id>.txt` for makes the generator
THROW, naming the id, rather than emitting a placeholder into a shipped notice. Their content is
also pinned by `sha256` in `frontends/shell/src/notices/noticeByteIdentity.test.ts`, so a silent
edit to any of them fails a test rather than silently changing the licence text this application
conveys.

## `third-party/duckdb-1.5.5/` — the DuckDB amalgamation's licence texts

*Added 2026-09-08 on the human's ruling, DECISIONS-PENDING entry 62 = (a). Full method, the tag, the
retrieval date and every URL: `third-party/duckdb-1.5.5/README.md`. The record of the gap this
closes, and its dated closure: `DEPENDENCY-LICENSES.md`'s packaged-app block.*

`engine/Cargo.toml` depends on `duckdb` with the `bundled` feature, so `libduckdb-sys 1.10505.0`
compiles **DuckDB's own amalgamated C/C++ source tree** into the packaged application. That tree
embeds 26 further third-party works under its `third_party/` directory and carries **no licence,
notice or copying file at all** — and no Cargo manifest names those works individually, so
`scripts/rustCrateNotices.mjs`, which reads `Cargo.lock`, structurally cannot reach them. Until this
directory existed, the packaged application's `NOTICE.txt` named the 26 and stated outright that
their licence texts were not carried.

**Provenance, so this is verifiable rather than trusted.** The texts were fetched once with `curl`
on **2026-09-08** from DuckDB's own source tree at tag **`v1.5.5`** (commit
`d8cdaa33fda8df955cc76ef58a280f68f4cd43fa`, whose short form is the `DUCKDB_SOURCE_ID` the compiled
tarball itself carries — an identity of the **declared** revision plus a directory-set match, and
expressly not byte-identity of the amalgamation's sources with the tag's tree; the pinned directory's
own `README.md` states the reach exactly, under "The method, in the order it was performed", step 2).
`MANIFEST.json` records, per file, the URL, the upstream path, the byte count, the `sha256`, and the
**git blob SHA-1 that the tag's own tree reports for that path** — all 27 recomputed locally and
matched, which proves the pinned bytes are the exact blobs the tag names. Every one of the 26 ships
a `LICENSE` upstream, so nothing here was reconstructed from a source header or written by hand.

**Line endings are pinned differently from the four files above, deliberately.** `.gitattributes`
marks **the 27 pinned upstream licence files** `-text` (no conversion in either direction) rather
than `text eol=lf` — two filename patterns, `LICENSES/third-party/*/*/LICENSE*` and
`LICENSES/third-party/*/*/NOTICES*`, cover exactly those 27 and not the directory as a whole, so
`MANIFEST.json` and that directory's `README.md` keep the repository's default handling; a third
pattern, `COPYING*`, matches nothing at this pin and is there for a re-pin that fetches one. The
reason for `-text` is that
**`miniz/LICENSE`'s upstream bytes genuinely contain CRLF**: normalising it would rewrite a licence
text this application conveys and break both hashes recorded for it. `-text` preserves all 27
byte-for-byte on every platform, which is what the `eol=lf` pins are reaching for.

**Editing anything here breaks the build on purpose, and so does a DuckDB upgrade that changes the
set.** `scripts/duckdbAmalgamationNotices.mjs` runs **three** guards, at notice generation and again
at `npm run check:dist-notice`: every pinned file's `sha256` is re-verified against the bytes on disk
(with the UTF-8 round-trip, and the pinned directory's name checked against the manifest's version);
the linked `libduckdb-sys` name and version are compared against the ones the manifest pins; and the
manifest's work list is compared, in both directions, against the `third_party/` listing inside that
crate's own `duckdb.tar.gz`, together with that archive's recorded `sha256` and directory count. All
three throw rather than degrade; all three are covered by
`frontends/shell/src/notices/duckdbAmalgamation.test.ts`. Re-pinning for a new DuckDB
version means a new `third-party/duckdb-<version>/` directory produced by the recorded method.

## The Apache-2.0 layer is empty, and that is a finding rather than a gap

ADR-009 item 4 puts **client SDKs, generated bindings and example integrations** under Apache-2.0.
No such module exists in this tree yet, so **nothing is declared Apache-2.0 today**. The text is
placed here anyway because ADR-009 item 1 of the checklist asks for it where the layer lives, and
this directory is where it will live the moment the layer has a first member.

**One judgement call is flagged for the human rather than made here.** `frontends/canvas-probe/` is
described in its own `package.json` as a "minimal canvas consumer for the first engine slice", and
`protocol/transport-bakeoff/web/` is a browser consumer built as decision evidence. Either could be
read as an "example integration" and therefore as the Apache-2.0 layer's first member. **Both are
declared `AGPL-3.0-or-later` here**, on the conservative reading, because:

- ADR-009 names the SDK layer by its *purpose* — "plugin authors link the SDK, not the core" — and
  neither of these is something a plugin author links. They are consumers of the slice, built to
  demonstrate and to measure it.
- The direction of the mistake is not symmetric. The copyright holder can still relicense their own
  AGPL code outward to Apache-2.0 at any time (there are no external contributions yet, so ADR-009
  item 9's permanent lock has nothing to bite on). Publishing something as Apache-2.0 and later
  wishing it were AGPL does not un-publish it.

If the intent is that either directory *is* the Apache-2.0 layer, that is a one-line change to its
package manifest and its SPDX headers — and it is the human's call, not this file's.

## Third-party *data*: the EPSG Geodetic Parameter Dataset, © IOGP

*Repository-level acknowledgement, entry 51 (2026-09-07). Grepped first for an existing shell/app
notice or about surface (`frontends/shell/src` — nothing under "About" or "third-party" naming
one); none exists, so this file is the repository-level place per the piece's own instruction.
Full record, the verbatim terms quotes, and the numeric-equivalence verification:
`DEPENDENCY-LICENSES.md`, "Third-party data terms (not a package): the EPSG Geodetic Parameter
Dataset (IOGP)".*

Two CRS definitions in this repository's pinned catalog (`engine/src/crs-catalog.json`'s
`epsg-2056` and `epsg-3857` entries — the second added by the item-8 3857 piece, 2026-09-08), both
compiled into the engine binary, and each carried in a published bundle's manifest when it is that
bundle's source definition (`kernel/src/bundle/mod.rs`'s `crs_source_definition`, a single
`Option<String>` field written once per manifest). The repository also holds fixture and spike
renderings of these same definitions (`engine/tests/data/`, `spikes/entry51-epsg2056-equivalence/`,
and the EPSG:4326 renderings pinned for DECISIONS-PENDING entry 59, which are not catalog entries,
in `spikes/item8-crs-catalog-extension/`); those are covered by `DEPENDENCY-LICENSES.md`'s EPSG
block (its dated correction and Verification (3b), appended 2026-09-08 at PR #32's landing). These two are derived from the
**EPSG Geodetic Parameter Dataset, © IOGP** (International Association of Oil & Gas Producers),
used under the EPSG Terms of Use: <https://epsg.org/terms-of-use.html>.

This acknowledges IOGP's ownership of that dataset, and informs anyone reading this file — as a
repository reader or as the recipient of a published bundle whose `viewer/NOTICE.txt` repeats
this same acknowledgement (`renderer/bundle-viewer/notice.mjs`'s `notice()`) — of those Terms of
Use, per the terms' own "Ownership… must be acknowledged in any publication or transmission…" and
"You are obliged to inform anyone… of these Terms of Use" clauses (quoted verbatim in
`DEPENDENCY-LICENSES.md`).
