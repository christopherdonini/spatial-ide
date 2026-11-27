Reviewed: branch cut/colour-by-refill-keeps-the-view at 2095a7ac471d2441fd8e054a448d334c7bcde455, PR 365 (draft), in the branch worktree C:/dev/wt/cbr, where it made its mutations by Bash; the records at main a2d58940d283be8eb050730216f0e90b6084a0fd in C:/dev/wt/read-1123ag (the custodian's filing note, 2026-11-24: the reviewer's build gate, node:colour-by-refill-keeps-the-view@build-gate-reviewer-1, dispatched at 2026-11-23T22:38:52Z; its run: Bash 84, Read 9, Grep 1, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-opus-5-5, from 2026-11-23T22:38:58Z to 2026-11-23T23:16:34Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 17979 bytes, sha256 fb70422f011462bc882603dcc1b44a400ca3eeb7b60f65bbcdd8de780bbcfbe6, byte for byte, nothing masked; 1 path of a file not on main, cited with a line, written as the file name alone by the custodian: `frontends/shell/e2e/colour-refill.mjs` to `colour-refill.mjs`, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; P0 observed again (RK-C1, RK-S1 and RK-A1 red as predicted, the guards green); M-C1 to M-C5, M-S1 to M-S3, M-A1 to M-A3, RF10 and M-F1 observed at 2095a7ac, each failing its register set; D-1 to D-6 Documentation, the worker words, to fix in PR 365; D-7 for the closing amendment (RF10 red at da55b7a6, a class 2); D-8 the PR body; the section 7 count 925 lines over 12 files; the PR checks 14 of 14 pass by its report; a backup of the fixture written on D: outside the scratch folder and deleted, by its own disclosure; E-RK1 left to the tester.)

---

Verdict: PASS WITH NOTES (cut/colour-by-refill-keeps-the-view @ 2095a7ac471d2441fd8e054a448d334c7bcde455)
Reviewed: C:/dev/wt/cbr @ 2095a7ac471d2441fd8e054a448d334c7bcde455
REPORT PATH: state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-build-gate-reviewer.md

No Correctness finding and no Evidence finding. There are eight Documentation findings, D-1 to D-8. Each must be fixed in this PR before the merge. None of them asks for another gate attempt (ADV-2026-11-21-20). Every cite below is read at 2095a7ac unless it names another commit.

## Correctness — none

- **The change (§2.2 (i) to (iv)), checked at the head.**
  - `WorkingCanvas.tsx:1665-1669`: `if (options?.keepCamera !== true) hasAutoFitRef.current = false;`. The anchor (:1666) and `lastQueriedRef` (:1668) are still cleared unconditionally. Without the option the method does what it did before.
  - `candidateArmSession.ts:1770` passes `options`. Nothing else in `reissueUnrestricted` changes.
  - `App.tsx:1058` adds the type's fourth parameter. `:1803` is the candidate binding and passes it on. The baseline binding at `:1960` (`issueViewportQuery`) takes three arguments and is not edited.
  - `:2147` is the Colour-by effect. It is the only call that passes `{ keepCamera: true }`.
- **Calls that pass nothing:** `applyFilterWith` (:1127), the open's first look (:1836), and both `queryWithFilter` hooks (:1813, :1975-1992).
- **The Colour-by path resets the fit only in the session.** `reportViewportOutcome` (:1599) and the retry wrapper make no fit call.
- **Caller grep.** The option's one product caller is `App.tsx:2147`. There is no test-only caller and no new `pub` item.
- **Orderings §2.4 (a) to (h)** are as declared. (i) is named in the source comments (`App.tsx:2139`, `candidateArmSession.ts:256`).
- **`hasAutoFitRef` writers:** only `WorkingCanvas.tsx:1022`, :1588, :1654, :1667 and :1823.
- **Seams.**
  - App to session and session to canvas: I read both sides at the head.
  - RK-A1 drives the real App and the real session. Its stand-in is typed as `WorkingCanvasHandle`, and the build's `tsc --noEmit` typechecks it (`npm run verify`, exit 0).
  - `e2e/colour-refill.mjs` to `e2e/lib.mjs`: `attachOrLaunch`, `attachConsole`, `waitForSettle`, `canvasRect`, `doWheel` and `CDP_PORT` all exist with the shapes the script uses. The `residentCounts` and `openPath` hooks exist (`App.tsx:1376`). The DOM selectors exist (`App.tsx:2549`, `StylePanel.tsx:242/318/327`, `WorkingCanvas.tsx:2446`). The `view-state` regex is the one `layout.mjs` and `regression.mjs` already use.
- **The rest of the checklist:** no JSON on a data path, no CRS handling, no float32, no claim of performance, and no app string changed.

## Evidence — none

**P0, observed again** (the three product files from 8329a53c; the three test files run).
- Result: `Tests 3 failed | 25 passed (28)`. The red set is exactly the prediction:
  - RK-C1: "the view, bit for bit: expected false to be true" (`WorkingCanvas.wiring.test.tsx:535`).
  - RK-S1: "with the option: expected [] to deeply equal [ { keepCamera: true } ]" (`refillKeepsView.test.ts:192`).
  - RK-A1: "before it: the clear, then the reset with keepCamera" (`App.colourRefill.test.tsx:221`).
- The guards RK-C2 to RK-C5, RK-S2, RK-S3 and RK-A2 are green.
- Restored with `git checkout HEAD --`. Porcelain was empty, and all three sha256 values equal the head's.

**Mutations, made again.** Each was one anchored `perl -i` command. Each run was `npx vitest run --reporter=verbose <file(s)>`, with exit 1 for every mutation. Each file was restored with `git checkout --`; porcelain was then empty and the file's sha256 equalled its head value. Every failing set equals the register's. No mutation failed a test outside its set, and none failed nothing.

| Mutation | Line changed | Failed |
|---|---|---|
| M-C1 | WC:1667 → plain clear | RK-C1 ("the view, bit for bit") |
| M-C2 | WC:1666 anchor kept under keepCamera | RK-C2 ("B's anchor is its own extent") |
| M-C3 | WC:1668 lastQueriedRef kept under keepCamera | RK-C3 ("no area is asked for after the reset") |
| M-C4 | WC:1667 `else hasAutoFitRef.current = true` | RK-C4 ("batch B fits: … 2 times, but got 1") |
| M-C5 | WC:1667 → `void options;` | RK-C4, RK-C5 |
| M-S1 | CAS:1770 no argument; both files | RK-S1, RK-A1 |
| M-S2 | CAS:1774 conditional | RK-S2 ("one planned line, the shown box: expected []") |
| M-S3 | CAS:1783 conditional | RK-S3, part (b) ("(b) no frame line") |
| M-A1 | App:2147 drops the option | RK-A1 |
| M-A2 | App:1803 drops the fourth argument | RK-A1 |
| M-A3 | App:1803 always passes keepCamera | RK-A2 ("an Apply: a plain reset: expected { keepCamera: true } to be undefined") |
| RF10 (Amendment 7 item 2) | WC:1668 deleted; `WorkingCanvas.test.ts` run | RF10 by name, "expected 'resetFitForNewGeneration(options) {\n…' to contain 'lastQueriedRef.current = null;'" — `Tests 1 failed \| 40 passed (41)`. No stop to the advisor. |
| M-F1 (da55b7a6) | rs:841 `FEATURES` = 200_000; `cargo test … generate_the_colour_refill_fixture -- --ignored --nocapture` in a hold | exit 101. It panicked at `manual_walkthrough_fixtures.rs:866`, "the text column alone must pass the attribute ceiling", the expected failure. The run wrote a 200,000-row file (219,446,317 bytes) over the E-RK1 fixture. I had backed the fixture up to D: first and restored it after: sha256 `2ce715fd1a9e797099bcbe252b462069a523f390fd7561a99de813818830af84`, 328,242,802 bytes, the same as Amendment 7 item 4 (a). Only its mtime changed. The backup is deleted. |

E-RK1 and M-A1's E-RK1 half are the tester's; I did not run them.

**§7.** `git diff --numstat e4e6493d...2095a7ac` over the 11 paths plus `WorkingCanvas.test.ts` (Amendment 7) counts 909 added and 16 deleted: 925 lines of the 980 ceiling, over 12 files. Nothing outside those paths changed. There is no class 8.

**§8, item by item.** Each item is clear:
- Every option has a product caller.
- The plain reset is unchanged.
- `applyFilterWith` and the open pass nothing.
- The baseline arm and `tileViewportStreamManager.ts` are untouched.
- No test encodes an interface the head does not have.
- No mutation is recorded from a `verify-mutation` run. The da55b7a6 comment says "Not observed in this commit", and the reports call verify-mutation a check.
- Amendment 7's Scope addition is not on a standing rule, so class 9 does not apply. It was committed at 06dde5c0 (20:41:26Z), before commit 5 (21:25:47Z).
- No test-text span is pinned by hash at a branch commit.
- The words landed only in 95d9621c. Item 51's, item 61's and AC12's text equal the form's §2.6 drafts as D3, D4 and D5 amend them, byte for byte (`grep -c -F` = 1 each).
- No app string changed.
- AC12 on origin/main (8dad2a6c) is unchanged since the base, so the merge-time check has nothing to act on yet.

**The two deviations (ADV-2026-11-23-23 item 2).** The closing amendment can record both as the ruling says:
- (a) At the head the fixture's bytes and sha256 are exactly as recorded. The 43,501 MB free after it is the worker's own reading; it cannot be checked again now.
- (b) da55b7a6 adds a 2-line comment to path 9 and changes nothing else (`+2/-0`), inside Scope.

**CI.** I read `gh pr checks 365` at 2026-11-23T22:55:57Z and again at 23:13:48Z: 14 of 14 pass, none pending. Every run is on head 2095a7ac, both the pull_request and the push events.

## Documentation — must fix before the merge

None of these sentences is the human's wording. D-1 to D-6 are the worker's drafts in comments, the README and the e2e script. The worker applies the words below with no re-gate, and the PR body lists them (AUTONOMY §31). Item 51, item 61 and AC12 pass their clause check as they landed; no words are given for them.

**D-1** `frontends/shell/src/canvas/WorkingCanvas.tsx:165`. The doc's first sentence is untrue for the keepCamera call. Clause check: the anchor is cleared at :1666 always; the flag is cleared at :1667 only without keepCamera.
```text
   * Clears BOTH the fit anchor (`fitAnchorRef`) and the one-shot auto-fit flag (`hasAutoFitRef`) --
```
```text
   * Clears the fit anchor (`fitAnchorRef`) and, unless `{ keepCamera: true }` is passed (below), the one-shot auto-fit flag (`hasAutoFitRef`) --
```

**D-2** `WorkingCanvas.tsx:193-195`. The list of when the canvas waits leaves out a card change and a refused Apply's re-issue (form D3). It also says "where the operator put it" where the camera may stand at the fit or at a saved view. Four spans, each occurring once in the file:
```text
so a refill after the first look has fitted does
```
```text
so a refill after the camera was fitted or set from a saved view does
```
```text
not fit again and the camera stays where the operator put it;
```
```text
not fit again and the camera stays where it stands;
```
```text
(the flag false: an open, an Apply
```
```text
(the flag false: after an open, an Apply, a Clear, a card change or a refused Apply's re-issue,
```
```text
   * or a Clear whose first batch has not arrived) stays waiting
```
```text
   * until a batch with an extent has arrived) stays waiting
```
Clause check:
- The flag is set true only by a fit (:1588, :1823) or by `applyView` (:1654).
- With the flag true, the fit blocks (:1587, :1822) do not run.
- Plain resets come from:
  - the open (App:1836 → CAS:1770);
  - `applyFilterWith`, for an Apply, a Clear and a card change (App:1127 and :1140; card change at :2170);
  - the refused Apply's recovery (App:378).
- The fit's condition is `!hasAutoFitRef.current && residentExtentRef.current`.

**D-3** `frontends/shell/src/residency/candidateArmSession.ts:254`. The clause is untrue when the canvas is still waiting to fit. Clause check: the option goes on at CAS:1770; the flag is kept at WC:1667; the fit happens only with the flag false (WC:1822).
```text
so the camera is not refitted by the first batch of this look;
```
```text
so the first batch of this look refits the camera only when the canvas was still waiting to fit (after an open or a change of the filter whose first batch with an extent has not arrived);
```

**D-4** `frontends/shell/src/App.tsx:2139`. The same omission as D-2. The comment also states the fill for both arms. The baseline arm is reached only by a dev-only switch, so under §31 it is named here and does not block.
```text
unless the canvas was still waiting to fit the first batch of an open, an Apply or a Clear, which it then does.
```
```text
unless the canvas was still waiting to fit the first batch of an open or of a change of the filter (an Apply, a Clear, a card change or a refused Apply's re-issue), which it then does. This is the candidate arm's: the dev-only baseline arm's binding ignores the option (issueViewportQuery), and nothing here is claimed of its fill.
```
Clause check: the candidate binding passes the option (App:1803 → CAS:1770); the plain resets are D-2's list; `issueQueryRef.current = issueViewportQuery` (App:1960) takes three arguments.

**D-5** `frontends/shell/e2e/README.md:916` and `colour-refill.mjs:21` and `:135`.
- The README and the script's header say the run records "the fixture's feature count". What the script prints is the constant `FEATURES` (:40), restated from the generator, not read from the file. That figure is wrong under `--fixture` with another file.
- The README's list of VOID causes reads as complete. The script also exits 2 at :194, :201, :116, :70, :75, :122 and :187, and on any fatal error (:214).
```text
It records the zoom steps taken and the fixture's feature count.
```
```text
It records the zoom steps taken, the generator's feature count (300,000, restated in the script, not read from the file) and the fixture's sha256, before and after the run.
```
```text
2 when the run is VOID (the not-held status never stands, the pre-view is not away from the fit, input reaches the canvas after the Colour by, or the client size changes).
```
```text
2 when the run is VOID, with its reason printed: among others, when the fixture is missing, an app already listens on the debug port, the open is not admitted, a wait or a settle runs out, the not-held status never stands, the pre-view is not away from the fit, input reaches the canvas after the Colour by, the client size changes, or the fixture's sha256 changes during the run.
```
```text
// Recorded: the zoom steps taken, the fixture's feature count, both boxes and both client sizes.
```
```text
// Recorded: the zoom steps taken, the generator's feature count (restated, not read from the file), the fixture's sha256, the boxes and the client sizes.
```
```text
the fixture's feature count: ${FEATURES};
```
```text
the generator's feature count (restated, not read from the file): ${FEATURES};
```
The last pair changes a log label in the e2e script, so the custodian may want the reviewer's narrow read on it before the merge check.

**D-6** `frontends/shell/src/canvas/WorkingCanvas.test.ts:854`. The new record comment says "OBSERVED AT da55b7a6". At da55b7a6, RF10 searches for `resetFitForNewGeneration() {` and fails with no mutation at all ("expected '' to contain"). The failure the comment quotes needs the present search text (:856). Commit 5's report confirms the run was made after the line was changed. My run at 2095a7ac is the observation at a commit.
```text
OBSERVED AT da55b7a608369030a88182955840c6b33b9cebcf:
```
```text
OBSERVED on the tree of da55b7a608369030a88182955840c6b33b9cebcf with the search text below already changed to its present form:
```

**D-7** The closing amendment.
- §5's falsification line "any declared-unchanged test goes red" fired: RF10 went red at da55b7a6. Record it as class 2 (a missed §5 prediction), with ADV-2026-11-23-23 item 1 as its cause and resolution.
- It also cites this gate's observations by file: P0, the 11 mutations, RF10 at 2095a7ac, and M-F1 now observed. Those runs are this gate's; no record calls a verify-mutation run an observation.

**D-8** The PR body. Amendment 6 item 1 says the PR body lists N-1 to N-4, the attempt-3 gate's replacement words carried into the form (AUTONOMY §31). The body does not. It must list them, and also D-1 to D-6 once they are applied.

## Notes (not findings)

- The comment on the fixture generator says the file reaches the not-held fact ("so the status bar says…"). That rests on arithmetic until E-RK1 runs. If E-RK1 voids on that precondition (I5), the comment and the README's steps go back.
- The KNOWN-LIMITATIONS item 51 comment pins code at the branch commit 39d096e9 (recomputed: 9423a852… and 6531c723…, both equal at 2095a7ac). They stay resolvable only if the PR merges by a merge commit, which is the repository's practice, and not by a squash.
- C: had 41,461 MB free at 23:13Z, 501 MB above the floor. E-RK1's scratch store goes under TMP; set TMP to D:.
- `cargo test --locked -p spatial-kernel --test manual_walkthrough_fixtures` ran 0 tests (all 23 are `#[ignore]`). It is a compile check.
- Disclosures:
  - The commit-5 report is not in the read checkout at a2d58940. I read it with `git show 8dad2a6c:<path>` from that checkout's object store, without moving the checkout.
  - I ran `git fetch -q origin main` in C:/dev/wt/cbr to check the merge base. It moved only the remote-tracking ref.
  - The fixture backup was a file outside `<S>`, at `D:/wt-data/cbr`, written and then deleted. C: was too close to the floor to hold a second copy.
  - Two of my wait loops were moved to the background by the harness after 180 s.
  - The worktree is clean at the head.

## Runs relied on

All runs ended by 23:13:40Z. Every hold had one `MACHINE_HOLD shared project=<m> … also=<m>` and its `MACHINE_RELEASED`, with `MACHINE_WAITING` lines (values `<m>`). There was no MACHINE_ERROR and no exit code from 96 to 99.

| Run | Exit | Output file |
|---|---|---|
| sha256 at the head | — | `<S>/cbrr-head-sha256.txt` |
| P0 vitest, three files | 1 (as predicted) | `<S>/cbrr-p0.out` |
| Each mutation | 1 each; M-F1 101 | `<S>/cbrr-mut-{M-C1..M-C5,M-S1..M-S3,M-A1..M-A3,RF10,M-F1}.out` |
| `cargo test --locked -p spatial-kernel --test manual_walkthrough_fixtures` (hold) | 0 | `<S>/cbrr-cargo-fixtures.out` |
| `npm run verify` in `frontends/shell` (hold): 128 files, 1609 tests passed, the four trailing scripts pass | 0 | `<S>/cbrr-npm-verify.out` |
| `cargo fmt --all -- --check` | 0 | `<S>/cbrr-cargo-fmt.out` (empty) |
| `node scripts/plan/verify-mutation.mjs --base e4e6493d --head 2095a7ac`: 11/11 recorded; a check, not an observation | 0 | `<S>/cbrr-verify-mutation.out` |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (hold): 623 pass, 0 fail | 0 | `<S>/cbrr-node-test.out` |
| The §7 count | — | `<S>/cbrr-s7-count.out` |

## Files read

- `<S>/brief-cbr-rev-1.md`, `<S>/cbr-diff-2095a7ac.txt` (sha256 equal to `git diff e4e6493d...2095a7ac`), `<S>/report-cbr-build.md`
- C:/dev/wt/read-1123ag:
  - `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md` (whole, Amendments 1 to 7)
  - `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-18-*.md`, `-23-*.md`, `-25-*.md`
  - `docs/PREREGISTRATION-TEMPLATE.md` (the Round 25 additions)
  - `state/consults/2026-11-23-colour-by-refill-keeps-the-view-commit-5-worker-report.md` @ 8dad2a6c, via `git show`
- C:/dev/wt/cbr @ 2095a7ac:
  - `frontends/shell/src/App.tsx`, `src/canvas/WorkingCanvas.tsx`, `src/canvas/WorkingCanvas.test.ts`, `src/residency/candidateArmSession.ts`, `src/diagnostics/renderTrace.ts`
  - `e2e/lib.mjs`, `e2e/colour-refill.mjs`, `e2e/README.md`, `package.json`, `vitest.config.ts`
  - `kernel/tests/manual_walkthrough_fixtures.rs`, `engine/src/fixture.rs` (`text_for`, `parcel`)
  - `scripts/plan/verify-mutation.mjs` (header)
  - `KNOWN-LIMITATIONS.md` (items 51 and 61), `frontends/shell/MANUAL-WALKTHROUGH.md` (AC12)
- PR 365: its body and checks.

Model: Claude Opus 5.5 (claude-opus-5-5).
