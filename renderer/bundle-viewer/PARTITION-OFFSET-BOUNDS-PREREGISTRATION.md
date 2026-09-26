# Preregistration — bundle viewer: partition offsets bounded before the walk (wave-1 A3 3(b), with 3(a))

*Drafted 2026-09-26 by the architect agent on the custodian's brief, from the inputs disclosed in §0, reading the working tree at main 0fa8119. Committed by the custodian on `viewer/partition-offset-bounds` BEFORE any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line and states what work it touches or invalidates.*

**Authority:** PLAN node `bundle-viewer-partition-offset-bounds`; RULED 2026-09-26, question round 24, item 1. Paraphrase, not a quote: A3 3(b) is an S1 cut, independent of the other two; it carries a KNOWN-LIMITATIONS line for bundles already published; A3 3(a)'s S2 rides along.
**Form and gating:** full form, full gating (`AUTONOMY.md` §21a). The piece adds new user-visible behaviour: a crafted bundle shows a refusal banner where it stalled, and KNOWN-LIMITATIONS gains a line. That crosses §21c's no-new-user-visible-behaviour bound. It also strengthens a stated contract, ADR-017 §14's named failure state on decode.
**Scope:** `renderer/bundle-viewer/src/partition.ts`; new `renderer/bundle-viewer/scripts/partition-bounds.test.mjs` (tests and the fixture builder); new `renderer/bundle-viewer/scripts/partition-entry.mjs` (a two-line single-bundle entry); `KNOWN-LIMITATIONS.md` (one inserted item); this file.

## §0. Disclosure

- **The finding:** `state/cloud/wave1/A3.md`, unproven observation 3, and its section "Custodian triage update, 2026-09-25 about 22:30Z":
  - (a), reproduced: a flat geometry column raises a raw `TypeError` that `main.ts`'s `load().catch` routes to `unhandled-error`.
  - (b), mechanism reproduced: out-of-range ring and polygon offsets decode without an exception. The loop grows with the offset.
  - The severity rule is `state/cloud/wave1-prompts.md` §4, S1: a hang reachable from untrusted input, a bundle named.
  - The triage's timings are evidence of the defect only. This piece restates none of them (§8 item 1).
- **The reproduction harness** was untracked scratch in the triage worktree. The drafter read it for technique only: crafted `valueOffsets` through the viewer's own `apache-arrow`, and one esbuild bundle re-exporting `decodePartition` and `BundleFailure` so that `instanceof` is meaningful. It is evidence, not Authority. Nothing tracked cites it, and §3 re-derives the technique in tracked code.
- **Tool claims, apache-arrow 18.1.0** (the version in `renderer/bundle-viewer/package-lock.json`, as installed under its `node_modules`):
  - The IPC writer rewrites a list's first offset to 0 and writes exactly `length + 1` offsets (`visitor/vectorassembler.mjs`, `assembleListVector`). §3's F5 and F6 therefore patch bytes after writing.
  - `Table.getChildAt` fills in an empty chunk when a stream carries no record batch (`table.mjs`), so `geomVector.data[0]` is always present.
- **The drafter has no shell.** No hash, count or run result in this document was computed by the drafter. Every value not computed is a marked `[[…]]` placeholder.
- **Hypotheses**, each with its discriminator:
  - **H1:** a geometry column one list level short, or with a flat coordinate level, raises a raw `TypeError` at the coordinate-values lookup. Discriminator: T8 and T10 on the pre-fix code.
  - **H2:** a 64-bit-integer coordinate leaf raises a raw `TypeError` when a `bigint` is written into `bboxes`. Discriminator: T9 on the pre-fix code.
  - **H3:** bounds without monotonicity still admit a walk whose work grows as rings × coordinate pairs. This is arithmetic from the loop structure, not measured, and no figure is claimed. Discriminator: T2 and T4's fixtures sit inside every bound and are still refused only by the monotonicity clauses.
- **Fixture-drive confound (§15a):** does not apply. Nothing is measured.

## §1. What this preregistration may and may not claim

**May claim:**
- Every offset the geometry walk reads is inside the array it indexes before any loop runs.
- The walk's iterations are bounded by the partition's own array lengths. This is structural (§2c), not measured.
- Every new refusal is `partition-decode-failed`, a `BundleFailure`.
- The four crafted shapes of §3 no longer reach `unhandled-error`.

**May not claim:**
- Any duration, rate, speed-up or docs/08 row.
- That any already-published bundle changed or is safe.
- That this project's publisher never wrote such offsets. That is not proven here.
- That the reader verifies Arrow types. ADR-017 §14 keeps that out of a reader's claims. G1–G3 are decode preconditions: the walk's lookups resolve to the arrays `Partition` declares, `ringOffsets` and `polygonOffsets` as `Int32Array` and `coords` as `Float64Array`. They are reported as a decode failure, which §14 lists under must verify.

No ADR is amended. The ADRs cited are ADR-017 §4, §14 and §16, and ADR-010 rule 7 (the viewer's declared recovery policy `none`, unchanged). Principles: docs/01 principle 7 and its derived rule never-block-the-canvas, and principle 8. The wording of every user-visible string (§2e, §2h) is the human's.

## §2. The change

### §2a. Shape preconditions (A3 3(a)) — in `decodePartition`, at the geometry walk's lookup site, before any array is read

- **G1 — the polygon level is a list.** `polys.valueOffsets instanceof Int32Array` and `polys.children[0] !== undefined`.
- **G2 — the ring level is a list.** The same two conditions on `rings`.
- **G3 — the coordinate values are float64.** `(rings.children[0]).children[0]?.values instanceof Float64Array`. The optional chain is part of the clause.

A failing clause throws `new BundleFailure('partition-decode-failed', asset.path, <detail §2e>)`.

### §2b. Offset bounds (A3 3(b)) — immediately after the existing row-count check, before the attribute projection and the per-feature loop; nothing between them reads an offset

Definitions: `F = features`, which equals `asset.rows` there and is ≥ 0 because `parseManifest` admits only non-negative integers. `ringCount = ringOffsets.length - 1`. `pairCount = Math.floor(coords.length / 2)`. `r0 = polygonOffsets[0]` and `r1 = polygonOffsets[F]`.

The checks run in this order, because each check's reads are bounded by the ones before it:
- **B1:** `polygonOffsets[0] >= 0`, and `polygonOffsets[f] <= polygonOffsets[f + 1]` for every `f < F`.
- **B2:** `polygonOffsets[F] <= ringCount`.
- **B3:** `ringOffsets[r0] >= 0`, and `ringOffsets[r] <= ringOffsets[r + 1]` for every `r` in `[r0, r1)`.
- **B4:** `ringOffsets[r1] <= pairCount`.

Every comparison is written to fail closed: `!(a <= b)` and `!(a >= 0)`, never `a > b`. A failing clause throws `partition-decode-failed` as in §2a.

### §2c. Why these suffice

After B1–B4 hold, every index the walk computes stays inside the array it reads:
- ring indices fall in `[r0, r1) ⊆ [0, ringCount)`;
- vertex indices fall in `[ringOffsets[r0], ringOffsets[r1]) ⊆ [0, pairCount)`;
- the highest coordinate read, `coords[2v + 1]`, is below `coords.length`.

The loop's iterations are at most `F + ringCount + pairCount`, and the checks cost `F + (r1 - r0)`. Both are linear in the partition's own arrays. `render.ts`'s `drawAll`, `pick` and `containsEvenOdd` walk the same `Partition` arrays over the same ranges, and only `decodePartition` constructs a `Partition` (its only caller is `main.ts` `load()`). So the same bound covers every later redraw and hover with no change to `render.ts`.

### §2d. Checks not needed, and why

| Not checked | Why |
|---|---|
| first offset equal to 0 | Bounds and monotonicity are enough for safety. Requiring 0 would refuse a validly sliced stream for no gain |
| ring offsets outside `[r0, r1]` | No walk reads them |
| the coordinate level's list kind or pair width | No index escapes, because B4 bounds against `coords.length / 2`. A wrong width draws a wrong picture, as today. Checking it would be an Arrow-type check that §14 keeps out of a reader's claims |
| a missing `geomVector.data[0]` | apache-arrow 18.1.0 fills in an empty chunk (§0) |
| a second record batch, validity bitmaps | ADR-017 §4 declares one batch and non-null geometry. Unchanged; the row-count check already compares |
| a size ceiling, watchdog, time budget or worker offload | The walk becomes linear. `ceilings.json` and ADR-010 rule 7's policy are unchanged |
| the `id` column's type or length | Not in the finding and not examined by this piece. Analysis only and unreproduced: it may be a separate observation for the custodian's triage |
| a try/catch around the walk | Rejected. It would label a viewer bug as a decode failure (principle 8) |

### §2e. Detail strings — engine facts, no consequences (the banner's consequence line stays `failure.ts`'s). Drafts; the human's wording

- **G1:** `geometry column: the polygon level is not a list`
- **G2:** `geometry column: the ring level is not a list`
- **G3:** `geometry column: the coordinate values are not float64`
- **B1:**
  - `polygon offsets start at ${v}, below 0`
  - `polygon offsets decrease at feature ${f}: ${a} then ${b}`
- **B2:** `polygon offsets end at ${v}, past the ring count ${ringCount}`
- **B3:**
  - `ring offsets start at ${v}, below 0`
  - `ring offsets decrease at ring ${r}: ${a} then ${b}`
- **B4:** `ring offsets end at ${v}, past the coordinate-pair count ${pairCount}`

The tests assert these words: `polygon level`, `ring level`, `coordinate values`, and `polygon offsets` or `ring offsets` together with `below 0`, `decrease` or `past`. If the human rewords a string, the matching tests change with it.

### §2f. The doc comment

`partition.ts`'s module doc, "Verification order", is updated to the code's actual order: decode, envelope, geometry shape, row count, offsets bounded, projection.

### §2g. Unchanged sites

`main.ts`, `failure.ts` (no new `FailureState`), `render.ts`, `manifest.ts`, `index.html`, `ceilings.json`, `build.mjs`, `package.json` and `package-lock.json` stay byte-identical.

### §2h. The KNOWN-LIMITATIONS line

**Placement:** the v0.1.0 section, directly after item 16 (the other line about every bundle already published). It takes the next free item number at merge time, `[[KL-N]]`: 29 if the watcher branch's items 24–28 land first. No existing item is renumbered or edited, because items refer to each other by number. The custodian merges this branch's single insertion with the watcher's edits. `[[V010-CHECK]]`: before merge, the custodian confirms that v0.1.0's `partition.ts` has the unchecked walk and its `main.ts` has the same catch routing; otherwise "including every v0.1.0 bundle" is struck.

**Text** (lands as DRAFT, for the human's sight):

```
[[KL-N]]. **In every bundle already published — including every v0.1.0 bundle — a partition whose
    offsets point past its own arrays can hold the viewer's page in a loop bounded only by those
    offsets, and a geometry column of the wrong shape is reported as `unhandled-error` rather than
    `partition-decode-failed`; neither is fixable in place.** A bundle is untrusted input to whoever
    opens it: a partition's content hash proves its bytes are the bytes the manifest lists, not who
    wrote the manifest, so a bundle rebuilt with consistent hashes passes every check this viewer
    makes before it decodes. A published bundle's viewer is a frozen copy of whatever build produced
    it, so no already-published bundle can pick up a later viewer fix. Fixed for every bundle
    published by a build that includes [[PR]] or later: its viewer checks the geometry column's
    shape, and each offset its geometry walk reads against the array that offset indexes, before
    drawing, and refuses a partition that fails either check as `partition-decode-failed`.
    <!-- DRAFT wording for the human's sight, not the human's own wording (renderer/bundle-viewer/PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md §2h). Sources: state/cloud/wave1/A3.md, unproven observation 3 and its custodian triage update of 2026-09-25 (the Windows reproduction, cited as evidence); state/cloud/wave1-prompts.md §4 (S1); RULED 2026-09-26, question round 24, item 1; renderer/bundle-viewer/src/partition.ts decodePartition (the checks, from [[PR]]); docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md §14 (a bundle's viewer cannot verify itself); renderer/bundle-viewer/ZOOM-ANCHOR-PREREGISTRATION.md §5 (a published viewer is a frozen copy). Scope line, not a retirement: it stands for every bundle published before the fix. -->
```

## §3. Fixtures — built in memory by `scripts/partition-bounds.test.mjs` with the viewer's own `apache-arrow`; no committed binary

Every fixture carries the full envelope (`frame`, `crs` = `EPSG:2056`, `axis_order`, `geometry_encoding`, `attribute_columns` = `[]`). The manifest stub is `{crsSource: 'EPSG:2056', attributeColumns: []}`, and `asset.rows` = the fixture's feature count.

**Self-check, replacing a file hash:** before use, each fixture is re-read with `tableFromIPC`, and its polygon offsets, ring offsets and coordinate count are asserted equal to the declared values below. A fixture that fails its self-check fails its test by name.

**F5 and F6 are patched by differential location.** Build A, and build B, which differs only in the entry after the one to patch. Assert that exactly one byte differs. Write −1 as Int32 LE four bytes before it. Then re-read and assert that the patched value reads back. No byte position is hard-coded.

| # | Shape | Polygon offsets / ring offsets / coordinate pairs | Clause that must fire | Pre-fix outcome (predicted) |
|---|---|---|---|---|
| F0 | valid: feature 0 a square with a square hole (5 + 5 closed points), feature 1 a triangle (4 points) | `[0,2,3]` / `[0,5,10,14]` / 14 | none — decodes; ends exactly at B2's and B4's bounds | decodes |
| F1 | ring end one past the coordinates | `[0,1]` / `[0,5]` / 4 | B4 | decodes, no exception |
| F2 | ring offsets decrease, all within bounds | `[0,3]` / `[0,4,2,6]` / 6 | B3 monotone | decodes |
| F3 | polygon end past the rings | `[0,2]` / `[0,4]` / 4 | B2 | decodes |
| F4 | polygon offsets decrease, all within bounds | `[0,2,1,3]` / `[0,4,8,12]` / 12 | B1 monotone | decodes |
| F5 | polygon start negative (patched; B = `[0,2,2]`) | `[-1,1,2]` / `[0,4,8]` / 8 | B1 start | decodes |
| F6 | ring start negative (patched; B = `[0,5,8]`) | `[0,1,2]` / `[-1,4,8]` / 8 | B3 start | decodes |
| F7 | flat `Float64` geometry column (3(a) as reproduced) | — | G1 | raw `TypeError` (reproduced in the triage) |
| F8 | `List<FixedSizeList<Float64>[2]>` (one list level short) | — | G2 | raw `TypeError` (H1) |
| F9 | `List<List<FixedSizeList<Uint64>[2]>>` | — | G3 | raw `TypeError` (H2) |
| F10 | `List<List<Float64>>` (flat coordinate level) | — | G3 (the optional-chain half) | raw `TypeError` (H1) |

**The real shape:** the external `100k-happy-path` bundle, published by the kernel, at the path `e2e/zoom-anchor.mjs` declares. Its data is served with this checkout's freshly built `dist/` as `viewer/`, composed the way that file does it. The manifest sha256 is recorded before the run, `[[MANIFEST-SHA256]]`, and passed as `--expect-manifest-hash`.

## §4. Tests, and the mutation per test

All tests are in `scripts/partition-bounds.test.mjs`. They import `decodePartition` and `BundleFailure` through `importModule('scripts/partition-entry.mjs')`: one esbuild bundle, so `instanceof` means what it means in `dist/app.js`.

A refusal test asserts, with `assert.throws` and a validation function, that `e instanceof BundleFailure`, `e.state === 'partition-decode-failed'`, `e.asset` = the fixture's path, and that the §2e words appear in the detail. No test asserts or bounds a duration, and no test uses a timeout.

| Test | Fixture | Mutation, which must fail that test by name |
|---|---|---|
| T0 `decodes a well-formed partition, with offsets ending exactly at their bounds` (asserts `features`, `ids`, exact `bboxes`, and the offsets returned) | F0 | M0: B4 written with `<` instead of `<=` |
| T1 `refuses ring offsets that end past the coordinate pairs` | F1 | M1: delete B4 |
| T2 `refuses ring offsets that decrease` | F2 | M2: delete B3's monotone loop |
| T3 `refuses polygon offsets that end past the rings` | F3 | M3: delete B2 |
| T4 `refuses polygon offsets that decrease` | F4 | M4: delete B1's monotone loop |
| T5 `refuses polygon offsets that start below 0` | F5 | M5: delete B1's start clause |
| T6 `refuses ring offsets that start below 0` | F6 | M6: delete B3's start clause |
| T7 `refuses a flat geometry column as partition-decode-failed, not a raw TypeError` | F7 | M7: delete G1 |
| T8 `refuses a geometry column one list level short` | F8 | M8: delete G2 |
| T9 `refuses coordinate values that are not float64` | F9 | M9: G3 reduced to a presence check |
| T10 `refuses a geometry column whose coordinate level carries no values` | F10 | M10: G3's `?.` replaced by `.` |

**Commit order:**
1. This file.
2. The tests and `partition-entry.mjs`, red, with the pre-fix run recorded.
3. The fix, green.
4. The KNOWN-LIMITATIONS item.

Each mutation is run against commit 3 and reverted, and its failing test name is recorded in the closing amendment.

## §5. Registered predictions · declared unchanged · invalidators · falsification

**Predictions**, a wrong one being a result:
- **Pre-fix, at commit 2:** T0 passes. T1–T6 fail with no exception thrown. T7 fails with `TypeError` on `children`. T8 and T10 fail with `TypeError` on `values` (H1). T9 fails with a `TypeError` on BigInt conversion (H2).
- **Post-fix, at commit 3:** all eleven pass, and each mutation M0–M10 fails exactly its row's test.
- **The real-shape acceptance run:** no failure banner, and every partition verified and drawn.

**Declared unchanged:**
- Every partition that reaches a typed refusal today reaches the same state. G1–G3 sit where today's walk would throw; B1–B4 follow the row-count check.
- Every well-formed partition decodes to the same `Partition` (T0 and the real-shape run).
- The bundle format, ADR-017, the manifest schema, the kernel, engine, protocol, frontends, and every file in §2g.
- **One deliberate exception:** a partition whose coordinate leaf is not float64 is now refused. ADR-017 §4 excludes such a leaf and no conforming publisher writes one. Today it either draws, for float32, or throws, for a 64-bit integer (H2).
- `dist/app.js` bytes change for future builds. Already-published bundles do not change (§2h).

**Invalidators — STOP and return to the custodian:**
- the fix needs any edit to a §2g file;
- the fix needs a new dependency or a new `FailureState`;
- a fixture cannot be built as declared. Record a class-2 deviation and rebuild the fixture so it keeps the declared property; never weaken an assertion.

**Falsification:**
- The real-shape run refuses a kernel-published partition. Then the reading of ADR-017 §4 against the publisher is wrong: STOP, and never loosen a check to pass.
- T7 does not raise a raw `TypeError` before the fix. That contradicts the triage.
- Any of T1–T6 throws before the fix. The defect model is then wrong.

## §6. Instruments

Every quantity is an assertion: a typed outcome, exact array values, or a banner present or absent. There is no measurement, and there is no p50/p95.

## §7. Declared values and budget

**No new constant.** The bounds are the partition's own array lengths. ADR-010 rule 6 is not engaged, and `ceilings.json` is not edited.

**Budget.** PLAN `budget_minutes` is 120. Planning figures, counted as insertions plus deletions:
- `partition.ts`: ≤ 70;
- the two scripts: ≤ 350;
- `KNOWN-LIMITATIONS.md`: ≤ 12;
- 4 files besides this one.

A deviation is recorded as class 2 with the final figure. This section is never edited.

## §8. Block-on-sight

1. Any duration, rate or timing figure anywhere: code, comment, test name, commit message, KNOWN-LIMITATIONS or amendment. This includes the triage's own figures, and any test timeout used as an assertion.
2. Any edit to a §2g file, or anywhere outside Scope.
3. A new `FailureState`, or a new check refusing under any state other than `partition-decode-failed`.
4. A try/catch that converts arbitrary exceptions in the walk.
5. A check placed after any loop reads an offset. The §2f doc comment disagreeing with the code order.
6. A new `src/` export with only a test caller. Any test surface reaching `dist/`.
7. A fixture without its §3 self-check, or a patch at a hard-coded byte position.
8. A detail string stating a consequence: what was lost, that the map is incomplete, or that the bundle is malicious.
9. The KNOWN-LIMITATIONS item merged into item 16, any existing item renumbered or edited, the item landing without its DRAFT marker, or any text claiming published bundles are fixed or safe.
10. A claim that the reader verifies Arrow types, or that this project's publisher could never have written such offsets.
11. The real-shape run missing or unfiled.

## §9. Gates

- **Architect:** ADR-017 §4, §14 and §16; ADR-010 rule 7; docs/01 principles 7 and 8. §8 checked one item at a time.
- **Reviewer:** the full diff.
- **Suites:** `npm run verify` in `renderer/bundle-viewer` green at commit 3. The commit-2 red run recorded against §5. M0–M10 recorded by name. The repository's governance checks green on the branch.
- **The seam across modules** (the kernel's published partitions going into this decode): one operator-run `scripts/run-acceptance.mjs` pass on the composed real-shape bundle of §3, with `--expect-manifest-hash`. Its JSON artifact is filed as evidence, cited for what it reported, and its sha256 recorded, `[[ACCEPTANCE-ARTIFACT-SHA256]]`.
- **No crafted-bundle end-to-end test through `load()`:** the consumer, `main.ts` `load().catch`, is unchanged and already routes every `BundleFailure` by its own state. The tests' single esbuild bundle gives the same one-class `instanceof` that `dist/app.js` has. `partition.ts` → `main.ts` is a seam within one module.
- **Operator:** no walkthrough row, since no path from a well-formed bundle changes. The human reads §2e's strings and §2h's text at the PR click.

## §10. Amendments — opens empty, append-only

*Classes per `docs/PREREGISTRATION-TEMPLATE.md` §10. The closing amendment is references and hashes only (the record cap, 2026-09-18). Record-round target: zero.*
