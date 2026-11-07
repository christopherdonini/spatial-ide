# shell docs: walkthrough row M10, the declared-not-verified tier and the write-time guard — full preregistration

*Committed before any change. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node walkthrough-row-m10-declared-not-verified-write-time-guard, the docs lane, placed by the human's message of 2026-11-06 (15:59Z), line 14 (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`), which joined M10 to walkthrough-rows-stale-against-main-sweep-area-b. The form, its notes, its rule (00) table, the OPEN items and what could not be settled are the architect's draft (`state/consults/2026-11-07-walkthrough-row-m10-declared-not-verified-write-time-guard-form-architect-draft.md`, read only at main fbc905ec; extracted sha256 0577409325c17eafd74ec0f1540ac9da5907c6dbbf69ab37542a54b949bf519a), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ fbc905ec…` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (18 pins; 0 by a file name that resolves to one tracked path at that commit; 0 kept as written; cites without a commit and bare line numbers kept as written, section 2.1 reading them at fbc905ec); this title and lead line added; the draft's opening lines and its closing path list dropped; the custodian's settlement added, with 1 pin of its own, and the Amendments heading at the end. The new span in section 2.1 is the architect's words, checked against the code by both gates under the human's Part 1, item 1 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`), and seen by the human at the click. Form path: `governance/forms/frontends/WALKTHROUGH-ROW-M10-DECLARED-NOT-VERIFIED-WRITE-TIME-GUARD-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The form (full form): `governance/forms/frontends/WALKTHROUGH-ROW-M10-DECLARED-NOT-VERIFIED-WRITE-TIME-GUARD-PREREGISTRATION.md`

**Path:** `governance/README.md:23 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:1a043fffd97b3db90f07c55a43d498dbda72f522eca034adc375ab8ebd153978` puts a form in the `governance/forms/` folder named by the first path segment of the code it is about, which here is `frontends`. `scripts/plan/forms-layout.mjs:37 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:718eb7f003d6c7c0122883f9a0498b3dba290527652b950b2eb2c407b9659c9e` accepts that path. The template places it nowhere else.

**Authority**
- **The human's placement:** `state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:14 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:9bbe57ea71e74eb64170839cc40eacb0414961a792f44b4a7b794869d6aba36f`. It joins M10 to area B. Area B was done before the ruling (#283), so this node takes the row in area B's place, by the custodian's reading in U1's form, Amendment 1, item M10.
- **The node:** `governance/PLAN.yaml:6736-6752 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:f7a77ffb1f9dabcc0a444c9911455737f434ce102eeeac96e57818f589977ad4`.
- **The finding:** N-1 of U1's gate 1 reviewer report, `state/consults/gates/2026-11-06-publish-session-tier-identity-gate1-reviewer.md:51 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:d43f2fab6c30a0412dc264a5b70d315d169d171d4b075df4416325dc592d4d52`. It is a report and evidence, not Authority.
- **The human's gate-round rulings:** `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`, Part 1, items 1 to 9, by reference. Item 1 governs the row: its words are written from the code and checked clause by clause.
- **OPEN items that are not red lines** are taken under the direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), which holds until 2026-11-09.
- **The precedent:** `governance/forms/frontends/WALKTHROUGH-ROWS-STALE-AGAINST-MAIN-SWEEP-AREA-B-PREREGISTRATION.md`, followed section by section.
- **The reuse index missed both queries:** no prior art is recorded. Its output, byte for byte from the brief:
```text
$ node tools/reuse.mjs walkthrough row write-time guard   (exit 1)
No prior art recorded for "walkthrough row write-time guard". Research it before planning an implementation.
$ node tools/reuse.mjs declared not verified ceiling   (exit 1)
No prior art recorded for "declared not verified ceiling". Research it before planning an implementation.
```

**Drafted by:** the architect, read only, at fbc905ecc704380a640e59f4f874d2c9e10d8f0c.

**Whose words:** the new span is mine. Whether the old span is the human's typed wording is not established. The worker settles it at B with `git log -L` before any edit (OPEN-3).

**Committed before any change:** by the custodian, on main.

**Gating: full, both gates (architect, then reviewer)** (OPEN-1 (B)).
- The new span states where and how the write-time `MAX_FEATURES` refusal fires for a `DeclaredNotVerified` dataset. That property is under test:
  - `an_unverified_file_above_the_ceiling_is_refused_by_the_write_time_guard_and_leaves_nothing` (`kernel/tests/publish_identity_tier.rs:516 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:e675fbff9fe3fbe5f0f00e3a1621c4d23580ec784087327e814457089f2c69ca`, `#[ignore]`d, release, run by hand);
  - the unit tests `a_batch_that_brings_the_total_to_the_ceiling_is_not_refused` and `a_batch_that_would_cross_the_ceiling_is_refused_with_the_total_it_would_make` (`kernel/src/publish/ceilings.rs:358 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:572e70018554884e525d8d3b9487441cbe2ada000d4b9577da47e48dbbd9cfbc`, `:367`).
- Area B read a walkthrough row that restates a property under test as touching §21a's fourth category (area B's form, "Gating"). So §25(e) closes the five-line form at dispatch.
- The size is inside §21c's bounds (§7). That does not decide the route.

### §0 Disclosure
- The piece edits one physical line of `frontends/shell/MANUAL-WALKTHROUGH.md`: Part M's M10 row, one span of its Expected outcome cell. It edits nothing else.
- It does not touch code, tests, e2e scripts, strings the app shows, any result log or run record, the sitting script under `state/drafts/`, or any other row.
- The PLAN node's status changes are the custodian's, on main.

### §1 May claim / may not claim
**May claim:** at the dispatch commit, each clause of the new span states what the code does, as §2.1 checks.

**May not claim:**
- anything observed live (no run is made);
- any timing;
- that the case is reachable in ordinary use. The new span says it is not.

### §2 Rules and the row
**2.0 Rules**
- (a) Edit only the span in 2.1. Everything else stays byte-identical, the rest of line 884 included.
- (b) No hunk at or after the `Result log` heading, located by its heading text.
- (c) The edit replaces text within one physical line. It adds no line, so no line below it moves.
- (d) Every clause of the new span resolves against the code cites in 2.1, re-read at the dispatch commit. If code has moved, the clause is re-checked, not carried.
- (e) If `git log -L` shows the old span to be the human's typed words, it is held for the human under §31 (OPEN-3).

**2.1 The row: Part M, M10** (`frontends/shell/MANUAL-WALKTHROUGH.md:884 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:7e76791af084b3e942241d7ac7e3aa88f1541536a07c8cfc2a35aaa74ec3f6b9`), Expected outcome column.

**Old** (byte-copied from my Read of that line):
> its pin still runs and only the bundled viewer's own load-time check catches it over ceiling;

**New (mine):**
> its pin still runs and the attempt can still reach the approval dialog; over the ceiling it is refused only once the publish runs, by the write-time `MAX_FEATURES` check (`ceilings::check_streamed_features`, in the partition loop), as `publish.ceiling_exceeded` and not `publish.reader_ceiling_exceeded`, before the partition that would cross the ceiling is written, with nothing left at the destination (no product route opens a dataset `DeclaredNotVerified` — the wire carries no skip-uniqueness field — so ordinary use does not reach this);

**Clause check (every cite is @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c):**
- **"its pin still runs":**
  - The prediction for this tier is `None`: `kernel/src/publish/ceilings.rs:172-177` (`verified_rows` `None` gives `None`). So `check_reader_ceilings` does not refuse on features (`kernel/src/publish/ceilings.rs:144`), called at `kernel/src/publish/mod.rs:574-578`.
  - The shell then pins: `frontends/shell/src-tauri/src/publish.rs:455` (`preflight_pinless`), then `:468` (`ensure_pinned_with_progress`).
  - The kernel says the same in `kernel/src/publish/mod.rs:410-421`.
- **"can still reach the approval dialog":** `frontends/shell/src-tauri/src/publish.rs:411-413`. `prepare_with_query`'s `preflight` makes the same empty prediction.
- **"refused only once the publish runs":**
  - Preflight refuses features only on `Some` (`kernel/src/publish/ceilings.rs:144`).
  - The guard is in `run_inner` (`kernel/src/publish/mod.rs:837`), reached through `publish_prepared` (`kernel/src/publish/mod.rs:645-663`) and `run` (`:696-705`).
- **"the write-time `MAX_FEATURES` check (`ceilings::check_streamed_features`, in the partition loop)":** `kernel/src/publish/ceilings.rs:187-201`; its call at `kernel/src/publish/mod.rs:833-837`, inside the partition loop.
- **"as `publish.ceiling_exceeded` and not `publish.reader_ceiling_exceeded`":**
  - The guard returns `CeilingExceeded` (`kernel/src/publish/ceilings.rs:194-198`).
  - Its code is at `kernel/src/publish/error.rs:298`, and `refusal_detail` is at `kernel/src/publish/error.rs:312-314`.
  - The shell's mapping is described at `frontends/shell/src-tauri/src/publish.rs:413-415`.
- **"before the partition that would cross the ceiling is written":** `saw > max_features` (`kernel/src/publish/ceilings.rs:192-193`). The guard is at `kernel/src/publish/mod.rs:837`, before `write_partition` at `:839`.
- **"nothing left at the destination":**
  - The destination must not exist, and staging is created beside it (`kernel/src/publish/mod.rs:656-661`; the path is at `:1542`).
  - Staging is removed on any error, or `StagingNotRemoved` is reported (`:663-677`).
  - The destination is created only by `finalize` (`:1703`).
- **"no product route opens a dataset `DeclaredNotVerified` — the wire carries no skip-uniqueness field":**
  - `kernel/src/skp.rs:1726-1736` (the host mints through `IdentityDeclaration::new`);
  - `engine/src/identity.rs:176-183` (`skip_uniqueness_check: false`);
  - a Grep of `*.rs` for `skip_uniqueness_check` finds it set `true` only under `engine/tests/` and `kernel/tests/`.
  - The kernel's own statement is at `kernel/src/publish/mod.rs:1495-1498`.
- **"so ordinary use does not reach this":** follows from the clause before it.
- **The retained clauses of the sentence:**
  - "has no predictable feature count either way" is true at `kernel/src/publish/mod.rs:412-414` and `kernel/src/publish/ceilings.rs:119-121`.
  - "`parcels-5gb.parquet`'s `NativeUnique` identity means this walkthrough step does not exercise that residual" is true: a whole-file scope with a verified count is predicted `Some` (`kernel/src/publish/ceilings.rs:172-177`).

**2.2 Overlap.** Under rule (00), each walkthrough Part is its own path. This piece's paths are:
- `frontends/shell/MANUAL-WALKTHROUGH.md`, Part M only;
- this form.

**2.3 Portability.** No new platform claim.

### §3 Fixtures
None.

### §4 Evidence (the worker runs these at H against B = the dispatch base, three-dot)
1. `git diff -U0 B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` shows exactly one hunk, `-884`/`+884`.
2. Byte-identical outside the span: line 884 at H, with the new span replaced by the old, equals line 884 at B. Every other line equals B.
3. Content at H: `check_streamed_features` and `publish.ceiling_exceeded` each appear exactly once in the file, and each appears 0 times at B.
4. Absence at H: `only the bundled viewer's own load-time check` counts 0.
5. Positive self-test at B: pattern 4 counts 1 at B, and the script's exit code is checked. A pattern that finds nothing at B is a broken scan, not a pass.
6. `git diff --name-only B...H` lists only `frontends/shell/MANUAL-WALKTHROUGH.md`.
7. Records: `node scripts/plan/verify.mjs --offline`, `node scripts/plan/verify-cites.mjs`, `node scripts/plan/verify-quotes.mjs`, `node scripts/plan/verify-test-claims.mjs`, and `node --test` over the scripts suite. Each exits 0 before the push.

### §5 Predictions
- **E1:** one hunk on line 884.
- **E2:** the absence pattern goes from 1 at B to 0 at H.
- **E3:** numstat 1/1, within §7.

**Declared unchanged:**
- every other row and Part, the rest of M10 included;
- the result log;
- all code, tests and e2e scripts;
- the sitting script.

**Invalidators:**
- a clause in 2.1 fails against the code at the dispatch commit;
- `git log -L` shows the old span is the human's typed words;
- a hunk outside the span.

### §6 Instruments
`git`, `rg`/`grep` with exit codes checked, and the Read tool. Nothing is built or run.

### §7 Counting
`git diff --numstat B...H`, added plus deleted lines.
- **Ceiling:** 10 lines in 1 file. My estimate is 2 (one physical line replaced).
- **Overrun:** recorded as class 8. This §7 line is never edited to match.

### §8 Block on sight
1. Any hunk in the result log or a run record.
2. Any edit outside `frontends/shell/MANUAL-WALKTHROUGH.md` on the branch, or outside M10's span.
3. A line added or removed (rule 2.0 (c)).
4. A new span stating a timing or a figure.
5. A clause with no code cite behind it.
6. A quote marked verbatim that does not byte-match its source.
7. A line cite into `governance/DECISIONS-PENDING.md`.
8. A bare self-line in this form.
9. An edit to a span shown by `git log -L` to be the human's, without the human's §31 answer.

### §9 Gates
1. Architect gate.
2. Reviewer gate at the reviewed head, with §4 run by the reviewer.
- The PR body records the applied words and whose words the old span was (§31).
- Out-of-scope categories:
  - ADR: none.
  - Wire: none.
  - Security: none.
  - Guarantee: touched. The span restates the write-time refusal, a property under test (see Gating).
- Operator: none added. M10 is already a row of the unrun Part M.

### §10 Amendments
Classes as in `docs/PREREGISTRATION-TEMPLATE.md` §10 and its Round 25 additions:
- class 8 for a §7 overrun;
- class 9 for a scope addition on a standing rule.

### §11 Open items
OPEN-1 to OPEN-4 below.

---

## Notes (mine)

1. **The untrue clause.** "only the bundled viewer's own load-time check catches it over ceiling" (byte-copied). Three things make it untrue at main:
   - The write-time guard refuses first: `kernel/src/publish/mod.rs:833-837 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:7cc4f5b085b3f6aaa91d1fa3b10468c24b189b912c85017ad73d760cfc40cdad`, using `kernel/src/publish/ceilings.rs:187-201 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:9f28779c83b88beb9197e26b7de97ce1159059edef090cbf2318a0debcb58458`.
   - The manifest's row count is `rows_total` (`kernel/src/publish/mod.rs:926 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:b7df7cc12edcb0e7cfeaa61dd7298009ca914b1b5fdb0fd8170305baae8b0e66`). So a bundle this kernel writes can never trip the viewer's own `manifest.rows > MAX_FEATURES` check (`renderer/bundle-viewer/src/main.ts:489-495 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:d5d3b069388e5173bb6f0b2d6acd69ac60aca861c643406f81f5b9efb10c8502`).
   - The viewer's check still exists, but it is no longer the one that catches this case.
2. **Siblings.**
   - No other clause of M10 makes the claim. I re-checked the rest of M10 against the code: the pre-pin ordering, `Some(3300000)`, the `ReaderCeilingExceeded` Display quote against `kernel/src/publish/error.rs:453-458` and `kernel/src/publish/ceilings.rs:97-99`, and the no-audit-record clause. All are true at main.
   - No other Part M row makes the claim. M8, M9 and M11 to M18 do not, and neither do the Part M text at `frontends/shell/MANUAL-WALKTHROUGH.md:846 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:d28e5e92f31a088f2a23e9ca8aaa89a57f4907346bfe80dcab7cbaa466d7ceeb`, `:853-855` or `:895`. A Grep of `frontends/shell` for `DeclaredNotVerified`, `load-time check` and `skip-uniqueness` finds line 884 only.
   - The pointer at `frontends/shell/MANUAL-WALKTHROUGH.md:466 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:c3c1ae149a2a12baf0552b681b683e353a36d1c8eefe311ab1d6f082d81424dd` stays true.
3. **A sibling outside the ruling's words, not in Scope.**
   - Part H's H8 (`frontends/shell/MANUAL-WALKTHROUGH.md:459 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:bf874b1c25b2645bfdc2ad1a9a271076a6594c28c1aa0e877db81a04d74d8b31`) says there is no publish-side refusal above the reader's ceilings and that only the reference viewer refuses at load.
   - That has been untrue since RELEASE-0.1 items 3e and 10, and more so since U1.
   - H is a run-record Part kept as run, and its 2026-09-08 pointer covers H6 only.
   - It is the custodian's to place, for example as a dated pointer in a later docs piece. It is not widened in here.
4. **Whose words, and red lines.**
   - Area B decided that every new span is the architect's, written into the form from code already built. The gates check each clause against the code. The worker runs `git log -L` per old span at B, and any span that is the human's is held under §31. The human sees the words at the click (area B's form, "Whose words", OPEN-6).
   - `frontends/shell/MANUAL-WALKTHROUGH.md:853-855 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:bafe97db7cec915e825f5556048589016a473f58dfa2fa473126afe9bd81851d` says the item-10 branch rewrote M10. That points to a worker's words, but only `git log -L` settles it.
   - The span is not red-line text. It is not a string the app shows (it names codes, and the Display it quotes elsewhere in the row is unchanged), not security posture, and not an ADR's words.
5. **No sitting copy.**
   - Neither `state/drafts/sitting-script-2026-10-23.md` nor `state/drafts/part-m-prep-pack.md` copies M10's sentence. A Grep of the repository for "load-time check catches" finds `frontends/shell/MANUAL-WALKTHROUGH.md`, plus the node's title in `governance/PLAN.yaml` and `governance/CUSTODIAN-QUEUE.md`, which are descriptions and not copies.
   - No script reads M10's text: the code mentions of `MANUAL-WALKTHROUGH` are comments, for example `frontends/shell/src-tauri/src/publish.rs:1306 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:6b3703dc2bb483981130d2fd42c0cdeced9dc2c5a708b4fa4d8bbf8055d5e686`, which stays true.
6. **Pins into line 884.** U1's form §5 pins `frontends/shell/MANUAL-WALKTHROUGH.md:884 @ 2c72923e…`. That is a historical pin at its own commit, and the tree is authoritative after this piece. Because the edit adds no line, unpinned cites to later lines do not shift.
7. **What the gate re-runs:**
   - **Reviewer:** §4 items 1 to 6 and each clause of 2.1 against the code at the head.
   - **Architect:** the Out-of-scope line, the red-line scan and the block-on-sight items.
   - Both read the PR body's `git log -L` result. The CI that runs for this path, and governance CI, must be green before the merge.
8. **Must not change:** code, tests, strings the app shows, every other row and the rest of line 884, the result log, and the files of the in-flight branches.

## Rule (00) at fbc905ecc704380a640e59f4f874d2c9e10d8f0c (from the brief's name lists)

| In flight | Touches Part M of MANUAL-WALKTHROUGH.md? |
|---|---|
| `cut/e2e-readme-security-posture-measure-build` (#292) | no (e2e/README.md, e2e/lib.mjs, e2e-test-surface.ts) |
| `cut/shell-comments-drift-sweep-area-a` | no (8 files under `frontends/shell/src/`) |
| `cut/port-2-macos-l1-and-app-dirs` | no (nothing under `frontends/`) |
| `cut/b2-piece-1c-save-and-reopen` | no (nothing under `frontends/`) |
| b1-shell-half PR B (not in the brief's list; no branch known to me) | its form claims Part F's location words and the new Part AC (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:474 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:5460a6825cdead1f9adadbcce5c44d79170fddebec644e411fef249127a2c062`, `:1274`), which are disjoint Parts |

Nothing touches `protocol/`, wire fixtures, `Cargo.lock` or `package-lock.json`. The custodian checks again at dispatch.

## OPEN items

**OPEN-1. The form's shape and the gates.** Not a red line: the five-line form is the custodian's reading, and line 14 names no form.
- **(A)** A five-line form with a single reviewer gate. Its Out-of-scope line would assert that no category is touched, on area A's reading ("the comments are brought into line with code that does not change").
  - Five lines, if taken (mine):
    - **Authority:** the node, and the placement at the directive's line 14.
    - **Scope:** 1 file, `frontends/shell/MANUAL-WALKTHROUGH.md`, M10's span only; budget 10 lines.
    - **Change:** M10's residual sentence states the write-time refusal in place of "only the viewer catches it".
    - **Tests+mutation:** none; §4's evidence.
    - **Out-of-scope:** none of ADR / security / wire / guarantee.
  - Risk: under area B's reading that Out-of-scope line is false, which is a block-on-sight.
- **(B)** The full form above, with both gates. It matches area B's reading of §21a's fourth category, and the human's literal placement into area B, which was itself a full-form piece gated by both gates.
- **(C)** A five-line form with both gates. §25(e) forbids a five-line form once a category is touched. If none is touched, the second gate is unneeded.
- **Recommend (B).** Area B is the nearest precedent: the same file, the same kind of row, and the piece the human named. The two precedents conflict on whether a sentence restating a tested property "touches" it. The conflict is named here for the human's review on return.

**OPEN-2. Who writes the words.** Not a red line.
- (a) My words, in the form (2.1). The worker applies them byte for byte, and the gates check them clause by clause.
- (b) The form states what the span must cover, and the worker writes it.
- **Recommend (a).** The code merged in #289, so these words are written after the code and from it. That is the area B precedent, which passed both gates.

**OPEN-3. Whose the old span is (§31).** Not a red line unless `git log -L` shows the span is the human's.
- (a) The worker runs `git log -L` on the span at B and records the result in the PR body. If the span is the human's, it is held for the human's §31 answer.
- (b) Hold the span for the human, who returns on 2026-11-09.
- **Recommend (a)**, area B's OPEN-6 (a).

**OPEN-4. Whether to mark the correction.** Not a red line.
- (a) In place, unmarked, one physical line.
- (b) In place, with a dated "[CORRECTED <date>: …]" bracket inside the row. It is still one line.
- (c) A dated pointer paragraph after the table. This adds lines and shifts every later line.
- **Recommend (a).** It is the smallest record. Part M is an unrun Part whose rows are instructions, and git history carries the change.

## What I could not settle
- Whether the working tree equals fbc905ecc704380a640e59f4f874d2c9e10d8f0c (no shell). I also could not check the brief's sha256 or produce any hash; the custodian expands the cites by script.
- Whether the old span is the human's typed words (OPEN-3).
- That U1 merged on 2026-11-07. The recent-commit list shows 3295bf37 as #289's merge, but I could not check its date.
- Whether verify-cites treats any unpinned cite into line 884 as a content check. I did not read its rules; §4 item 7 runs it.
- A `StagingNotRemoved` failure would leave staging debris beside the destination, reported. The new span claims only that nothing is left at the destination, which still holds in that case.
- H8 (Note 3) is outside Scope and was not re-checked clause by clause.

## The custodian's settlement (class 1, before any change)

- **OPEN-1: (B)**, the full form with both gates, taken on 2026-11-07 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
  - The custodian's brief told the architect that the human had asked for a five-line form. The human's words name no form (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:14 @ fbc905ecc704380a640e59f4f874d2c9e10d8f0c sha256:9bbe57ea71e74eb64170839cc40eacb0414961a792f44b4a7b794869d6aba36f). The five-line shape was the custodian's reading, in U1's form (Amendment 1, item M10) and in this node's summary: the custodian's error in the brief, which the draft names. The custodian tells the human in the closing message.
- **OPEN-2: (a)**, **OPEN-3: (a)** and **OPEN-4: (a)**, each taken on 2026-11-07 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
  - OPEN-2 (a): the worker applies section 2.1's new span byte for byte. Both gates check it clause by clause against the code (the human's Part 1, item 1, `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`), and the human sees the words at the click.
  - OPEN-3 (a): the worker runs `git log -L` on the old span at the base and records the result in the PR body. A span that is the human's typed words is held for the human under §31.
- **Note 3 (Part H's H8)** goes to the human in the custodian's closing message, as a candidate for a later docs piece. It is not in Scope, and nothing here touches Part H.
- **The draft's quotations and section 4's base counts,** checked by script at fbc905ec:
  - The 4 phrases it quotes from line 884 (the old span, the clause its Note 1 quotes, and the two retained clauses) are each found there byte for byte, once.
  - In `frontends/shell/MANUAL-WALKTHROUGH.md`, section 4's absence pattern counts 1, and `check_streamed_features` and `publish.ceiling_exceeded` count 0 each.
  - The 3 test names its Gating paragraph names are each found as a function in the file it cites.
- **The read commit and main:** `git diff --name-only fbc905ec 2dacb6ec` over the files the pins name lists only `governance/PLAN.yaml`, whose change since is the custodian's own notes in node summaries; the pins keep the read commit's lines (12 files).
- **Rule (00)** was checked at main 2dacb6ec with `git diff --name-only origin/main...<branch>` over the branches in flight: the e2e README (#292) (`cut/e2e-readme-security-posture-measure-build`), area A (`cut/shell-comments-drift-sweep-area-a`), port-2 (`cut/port-2-macos-l1-and-app-dirs`), 1c (`cut/b2-piece-1c-save-and-reopen`). None touches `frontends/shell/MANUAL-WALKTHROUGH.md`. b1-shell-half PR B has no branch. Rule (00) is checked again at dispatch.

## Amendments (opens empty; append-only)
