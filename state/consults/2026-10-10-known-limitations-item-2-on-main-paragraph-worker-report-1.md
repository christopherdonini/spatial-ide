*Custodian's filing note (2026-10-10): the docs lane's piece c (`known-limitations-item-2-on-main-paragraph`) worker report 1, the worker run 23:23:24Z to 23:26:59Z by its transcript, on `cut/known-limitations-item-2-on-main-paragraph`, head dd01801e811a521c5c4583499ca1cca428b9b018, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8e574eea2889671572b5d45d1d2ba2751875ef3429d199d83f0d0d064ca1745a.*

---

Piece c is built and pushed. It is two commits on `cut/known-limitations-item-2-on-main-paragraph`, only `KNOWN-LIMITATIONS.md` changed, no pull request opened. Every clause of the paragraph is true at the base, so nothing goes to the human.

**Base.** The branch was at 496fdd7f, one commit behind origin/main. I fast-forwarded it to 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23, which is the base you named. `git merge-base origin/main HEAD` now returns that commit. No rebase, no force.

**Commits**
- `a2caf2a9` docs: item 2 gains the human's on-main paragraph.
- `dd01801e` docs: items 19, 20 and 22 source-comment cites become pins at 4fd3259a.

**Paragraph, byte-copy method.**
- `sed -n 9p state/directives/2026-10-10-drift-sweep-area-e-instructions.md` went into a temp file. A script spliced it in after line 58, with one blank line before it.
- Line 58 is item 2's last source comment, the axis-order one. It is now line 60 of the file, and the item 3 blank line follows it.
- Nothing in item 2 above it changed, and the quote of the crs_undeclared message is untouched.
- The committed line hashes the same as the directive's line 9: `846786d76d40004eea476f77aecc0c531fa71046736393675fde31d05863cd23`.
- It keeps its three leading spaces. I did not reproduce the paragraph here, and the file has it.

**Clauses against the code at 4fd3259a (all true)**
- **Pinned versions 1.0.0 and 1.1.0:** `engine/src/geoparquet.rs:37` (`PINNED_SPEC_VERSIONS`), tested at `engine/src/geoparquet.rs:509`.
- **Absent key opens as OGC:CRS84, recorded `crs:format-default`:**
  - Default CRS: `engine/src/geoparquet.rs:44` (`FORMAT_DEFAULT_CRS`).
  - Absent key with a pinned version: `engine/src/geoparquet.rs:556-571` (R-C2).
  - Provenance string: `engine/src/geoparquet.rs:95`.
- **Latitude-first CRS gets the format's order, recorded `axis:format-override`:**
  - The R-C4 branch: `engine/src/geoparquet.rs:531-540`.
  - Provenance string: `engine/src/geoparquet.rs:114`.
  - Order mapping: `engine/src/geoparquet.rs:599-604`.
- **Declared order kept as a recorded fact, no coordinate transformed:** `engine/src/geoparquet.rs:537` and `engine/src/geoparquet.rs:597-598`.
- **Still refused, `crs` key present and `null`:** `engine/src/geoparquet.rs:555` (the explicit-null state yields no CRS), whatever the version.
- **Still refused, latitude-first CRS you assert yourself:** `engine/src/dataset.rs:422-426`, with the asserted axis read at `engine/src/dataset.rs:380-390`. The comment at `engine/src/dataset.rs:416-421` states both refusals.
- **Still refused, either case in any other version:**
  - Absent key, unpinned version: `engine/src/geoparquet.rs:572-581`, then `engine/src/dataset.rs:398-404`.
  - Declared latitude-first, unpinned version: `engine/src/geoparquet.rs:541-552`, then `engine/src/dataset.rs:422`.

**Replaced cites** (the before is each cite as it stood in the item's source comment; the after is the pin as committed, shown without the `@ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23` base commit that every pin carries)

| Item | Before | After | sha256 |
|---|---|---|---|
| 19 | `engine/src/error.rs:342-347` | `engine/src/error.rs:377-382` (SourceChanged Display) | de466f1bb052884badf75dc68f04b0a4c5087aa5941af42238d5ddf51ccddf21 |
| 20 | `engine/src/dataset.rs:283-291` | `engine/src/dataset.rs:319-327` (gate and its comment) | a2f4bac2379da21f4080168616428bb0058620d1f5b4c7458c20b4d90d7e0c6a |
| 20 | `engine/src/dataset.rs:1356-1396` | `engine/src/dataset.rs:1646-1686` (`partitioned_source_detail`) | 05998a177303e5596c5b39cae3a2b45611ecc4575a8830bd40e526cffb47c853 |
| 20 | `engine/src/error.rs:348-352` | `engine/src/error.rs:383-388` (Display) | 26ebfe880888e518236a7338f573806b639a7a585a25aa1612b4217c48fdf6d4 |
| 20 | `kernel/src/skp.rs:1187-1189` | `kernel/src/skp.rs:2092-2095` (wire code) | 071d32c0539426e6222c45f08077e7ac1745f9c7c439809e419b72cea51c5beb |
| 22 | `engine/src/dataset.rs:1021-1038` | `engine/src/dataset.rs:1206-1223` (`rule` and `convicts`) | 096b34566fe80e09617f8d982c4147c2e0db358d1a1f74801809faa342a0c9a0 |
| 22 | `engine/src/dataset.rs:1162-1171` | `engine/src/dataset.rs:1352-1362` (`convict_or_record`'s non-convicting branch) | 8b1fc1c77a0398aa83c8cfaa720a60846b6b96cc324c2ad82a093a89eeb6b576 |
| 22 | `engine/src/dataset.rs:981-1031` | `engine/src/dataset.rs:1166-1217` (`sanity_check` doc comment through the NotChecked branch) | c36185021699ae274f501be19777ea03fe23f0ab9d04039aa86d71e9eba89d42 |

- I re-derived every line at the base. The numbers match finding 6's, except that I pinned whole spans rather than the single lines it names.
- I recomputed the first hash independently with `git show 4fd3259a:engine/src/error.rs | sed -n 377,382p | sha256sum`, and it matches.
- The other cites in items 19, 20 and 22 are untouched, including `engine/src/geoparquet.rs:499-508`, which still lands on the R-C4 text.
- The base-commit placement is mine: the pins sit on the item's own line, in place of the old cite.

**Checks**
- `node scripts/plan/verify-cites.mjs` at head: PASS, "every rooted (in-tree) path:line reference across 1685 file(s) resolves. (49 loose reference(s) advised above.)", exit 0.
- `node scripts/plan/verify-quotes.mjs` at head: PASS, "121 checked, 90 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors", exit 0.
- With `--show-cites KNOWN-LIMITATIONS.md` it also exits 0. I did not read its cite-content listing line by line; I checked the paragraph's byte-copy by hash and each pin by recomputation.
- `git diff --numstat 4fd3259a HEAD -- KNOWN-LIMITATIONS.md`: 5 insertions, 3 deletions, so 8 changed lines against the 30 allowed. Nothing trimmed.
- `git diff --stat 4fd3259a HEAD`: one file changed.

**Pre-gate self-check**
- **Cross-module interfaces:** nothing was written across a module boundary. These are documents only, and every cite was read at the base.
- **Completion claims:** each points at the hash or line above.
- **User-facing messages:** none added. The quoted crs_undeclared message is untouched.
- **Tests:** none required.
- **Model:** I observe myself as Sonnet 5.5, with no override and no context handoff.

**Off-scope, not done:** the existing cites in item 2's comments, such as `engine/src/dataset.rs:303-306`, were not in the brief. I did not check them against the base.

**Final state:** `git status --porcelain` is empty, HEAD is `dd01801e811a521c5c4583499ca1cca428b9b018`, and the branch is pushed.

*Custodian's correction (2026-10-11), on the human's ruling (state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:8 @ e9beffe99d2c055845f3d4c230e0fd18c5ea5acc sha256:b1b504a205e5b032e6593a71fe5a636697cd46dd8f94fccb16a7178a614ad53a): this report's statement that every clause of the paragraph is true at the base, and its list headed as all true, do not hold. The reviewer's gate 1 found the format-default contradiction refusal, `engine.format_default_contradicted`, missing from the paragraph's still-refused cases (`state/consults/gates/2026-10-10-known-limitations-item-2-on-main-paragraph-gate1-reviewer.md`, C-1). The human ruled C-1 (A) and appended two sentences of their own (the five-line form's Amendment 1). Nothing above this note is edited.*
