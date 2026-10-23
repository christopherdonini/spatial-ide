*Custodian's filing note (2026-10-22): the architect's draft of milestone 4 PR A's re-sweep amendment (the form's Amendment 2), read only at main c6de9b48. The run 16:18:55Z to 16:25:43Z by its transcript (Read 25, Grep 29, Glob 3; no Write, Edit or Bash). The custodian's decisions on its findings: F1 (a), the three scriptless drivers run at B by a tester before the amendment is committed; F2 accepted, PR A does not merge before #243 and `carries no attributes` joins the first text check; F3 accepted, its words for client.ts's comment; F4 a note; F5 outside the piece. The amendment is committed with its pins by script after F1's results, with those rows added. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is d3484a306258919facd39c2ffcb131f807810eb14bc5a978965a504d7fe35de4.*

---

Drafted: b1-shell-half, PR A's re-sweep amendment, at main c6de9b48
Reviewed: main @ c6de9b48cde727684de7fec7bb44323fe24d0a02. PR A's base B is 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. #243's head was read at b24e5281aef6da8b744de3ca840e9ffc10503cb6, the head of `cut/stale-assertion-messages-and-product-comments`, through the read-only worktree `C:/dev/wt/samc`.

There are no sha256 values in this draft because I have no shell. The custodian's script pins each path:line below at the commit named before the amendment is committed. Where I write `@ 55618ab5`, I read the file in the main checkout and B's text is confirmed by the re-sweep's steps 1, 2 or 5. Branch facts are named by commit id only, with no line pin.

---

### Amendment 2 — PR A's re-sweep at B 55618ab5, written after the re-sweep's and the base series' results were seen: no pin moved and no invalidator; four class-3 rows (the text check's wrap, a test title, `document.ts`'s words, the fifth positive at b24e5281); the Part and the numbers; the base's suites and rule 00 (class 1)

*Written after the re-sweep's and the base e2e series' results were seen, before any PR A code. The architect drafted it read-only at main c6de9b48cde727684de7fec7bb44323fe24d0a02. It is references only, and nothing below is a quotation. The re-sweep is `state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md`, sha256 from its line 5 `<as its filing note gives; copied by the custodian's script>`. The series is `state/consults/2026-10-22-b1-shell-half-pr-a-base-e2e-tester-report.md`, sha256 from its line 5 `<likewise>`. B is 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. Every `@ 4b26d279` pin is historical (§0.3). For the work, the tree at B is authoritative.*

1. **The pins.** None moved and none changed (the re-sweep's step 1). The §0.2 interfaces read at B as §0.2 states them (its step 2), so I4 does not fire. Every PR A file in §2.6 exists at B, and its six new files do not (its step 2, last paragraph).

2. **The re-sweep's four notes (class 3).**
   - **(a) The wrapped text check.** `Proposed, so it binds nothing` runs across `frontends/shell/src/workspace/viewTransitions.ts:6-7 @ 55618ab5`. A line-by-line search finds nothing at B, so §4's second check fails its own self-test (re-sweep note 1).
     - §2.2 (g)'s sixth bullet is read as that two-line span.
     - §4's text-check paragraph reads: **Text checks at PR A's head**, by script. Each pattern is searched twice in each file named: once line by line, and once over the file's text with each line's leading whitespace, leading comment marker (`//!`, `//` or `*`) and trailing whitespace removed and the lines joined by one space. Each pattern is self-tested positive at the base in at least one of the two runs. At the head it has zero matches in both runs:
       - `requests none`, `requests no projection` and `gains no parameter` in `frontends/shell/src` and `renderer/tests`;
       - `Proposed, so it binds nothing` in `frontends/shell/src/workspace/viewTransitions.ts`.
     - The self-test at B:
       - `requests no projection` is positive at `frontends/shell/src/skp/client.ts:122 @ 55618ab5` and `frontends/shell/src/skp/client.test.ts:43 @ 55618ab5`;
       - `gains no parameter` is positive at `frontends/shell/src/skp/types.ts:262 @ 55618ab5`;
       - `requests none` is positive at `frontends/shell/src/style/document.ts:20 @ 55618ab5` and `renderer/tests/style_shell_agreement.rs:39 @ 55618ab5`;
       - `Proposed, so it binds nothing` is positive in the joined run only, over lines 6 and 7.
   - **(b) The test title in `frontends/shell/src/skp/client.test.ts`.** The check reaches the title at `frontends/shell/src/skp/client.test.ts:43 @ 55618ab5` (re-sweep note 2). That file is a PR A test file (§2.6), so this is a test-text fix.
     - The title reads: `sends columns: null as an explicit null when the caller passes null, never omitted`.
     - The test's call passes `null` for `columns`. Its body, its doc comment and its recorded mutation (omit the key) stay as they are.
     - Clause check against the body as it stands at `frontends/shell/src/skp/client.test.ts:44-48 @ 55618ab5`:
       - "explicit null" is the `toBeNull` assertion;
       - "never omitted" is the `toHaveProperty("columns")` assertion;
       - "when the caller passes null" is the call's argument once §2.2 (b) makes `columns` required.
     - These are not the human's words. The edit fits A-T's `client 50` (§7).
   - **(c) `document.ts`'s bullet after the clause comes out.** Removing the clause from `frontends/shell/src/style/document.ts:18-22 @ 55618ab5` leaves a lowercase "so" after a full stop, and "not a wire restriction" loses its antecedent (re-sweep note 3).
     - The bullet reads, wrapped as the file wraps:
       ```
        * - **Literal-only.** `StyleDocumentV0`'s type has no `match` variant at all -- there is no field to
        *   set that would produce one. So categorical/match styling is still unavailable live. The wire
        *   does not prevent it: the shell's `viewport_query` calls carry the open's projection set
        *   (`projectionFor`; `null` when no column is projectable). There is no wider model here.
       ```
     - Clause check at PR A's head:
       - The type has no `match` variant: `frontends/shell/src/style/document.ts:109-118 @ 55618ab5`, which PR A does not edit (§2.6, comment only).
       - Unavailable live: the canvas passes one `fillColor` (`frontends/shell/src/canvas/buildLayers.ts:447 @ 55618ab5`, `frontends/shell/src/canvas/buildLayers.ts:470 @ 55618ab5`), and PR A touches only that file's comment.
       - The calls carry the open's set: §2.2 (a) and (b), asserted by PA-U1 and PA-U7.
       - "There is no wider model here" is unchanged.
     - These are not the human's words. ADR-023's B1 condition (1) asks for exactly this correction in the piece (RULED 2026-09-14, question set D, item D2, condition 1; carried at `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:144 @ c6de9b48`).
   - **(d) The fifth positive at b24e5281.** At b24e5281, `frontends/shell/src/canvas/buildLayers.ts`'s doc comment on `ResolvedDrawParams` carries `requests none`. That branch commit is named here with no line pin (re-sweep note 4 and step 5). The other positives there match §2.2 (g)'s list.
     - §4's text checks are run at the PR A head that goes to the gate, after main with #243's merge has been merged into PR A's branch (§2.9).
     - At that head the first bullet's runs also reach `buildLayers.ts`. Its self-test is the positive at b24e5281, and its zero follows §2.2 (g)'s fifth bullet (item 5).

3. **The Part and the numbers.**
   - **The Part is AC.** The last Part at B is AB (`frontends/shell/MANUAL-WALKTHROUGH.md:1927 @ 55618ab5`). No branch in flight adds a Part (re-sweep step 3).
   - **KL-4 is item 51 and KL-7 is item 52.**
     - The highest item at B is 46 (`KNOWN-LIMITATIONS.md:407 @ 55618ab5`).
     - #241's item is 47, a branch fact at 2fc01f59.
     - 1c places its items after it and withdraws K-1 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:513-514 @ c6de9b48`), so its K-2 to K-4 take 48 to 50 (re-sweep step 4).
     - The numbers are read again at PR A's KNOWN-LIMITATIONS commit. A change there is class 3, with the tree authoritative.

4. **The base series (class 1).**
   - **Result.** The 14 `e2e:` scripts in `frontends/shell/package.json` other than `e2e:debug` each ended rc 0 at B, on an exe built at B. `e2e:residency-harness` was read by its exit code only.
   - **Fixtures.** They were hash-identical before and after, nothing was regenerated, and the 5 GB fixture was not used.
   - **The harness** ran under §9's port-5400 approval:
     - the overlay through `TAURI_CONFIG`;
     - vite with `--strictPort`;
     - the npx shim on PATH, and for `recording` its waiting variant;
     - one shared hold for each run;
     - a cargo target outside the worktree.
   - **Four attempts failed on harness causes,** each disclosed in the series:
     - publish twice, its deadline spent on a cargo build of its verify example;
     - the first exe build, before the shell's generated notice file existed;
     - recording once: the stock shim leaves the app detached, so the suite's stop released nothing, and its RECORD step met a live lock after OPEN, APPLY, STYLE and RESET had passed.
   - **None is I3.**
     - In each case the series shows the cause in the launcher or the build.
     - Each suite then passed at the same commit, with no product change, on the corrected harness: publish with its example built, and recording with the waiting shim.
     - The exe build is not a suite.
     - The reading, class 1: under I3, a failure whose recorded cause is the harness, and which passes at the same commit on the corrected harness, is not an e2e failure. The correction is carried into every later run of this piece. That means the waiting shim for `recording`, and publish's verify example built before its deadline starts.
     - The custodian judged the same.

5. **§2.2 (g)'s `buildLayers.ts` bullet against #243 (class 3).**
   - After main with #243's merge has been merged into PR A's branch, PR A removes the clause naming `viewport_query`'s projection since `skp/0.6` and the shell requesting none, and re-wraps (re-sweep step 5).
   - The comment's sentence reads:
     ```
      * `0..1` opacity). The shell's style documents are literal-only (`style/document.ts`'s
      * `StyleDocumentV0` has no `match` variant), so this is exactly ONE colour for a whole style, not
      * a per-feature table -- a plain array, deck.gl's own "constant attribute" shape, is what this
      * type carries and what `buildLayers` below passes straight through unchanged. */
     ```
   - Clause check at PR A's head:
     - "Literal-only" and "no `match` variant": `frontends/shell/src/style/document.ts:109-118 @ 55618ab5`, not edited by PR A.
     - "Exactly ONE colour": `frontends/shell/src/canvas/buildLayers.ts:447 @ 55618ab5` and `frontends/shell/src/canvas/buildLayers.ts:470 @ 55618ab5`, with PR A editing that file's comment only (§2.6, ceiling 6).
     - "A plain array … is what this type carries": the `fillColor` tuple at `frontends/shell/src/canvas/buildLayers.ts:36 @ c6de9b48`.
     - The sentence does not say that the shell requests no projection, or that `viewport_query` carries no attributes.
   - These are not the human's words. The worker applies them, and the PR body lists them.

6. **Rule 00 at B (class 1)** (re-sweep step 6; §2.9; Amendment 1 item 4):
   - 1c's branch is at B, with no commit and none of the six shared files.
   - The docs lane is at b24e5281. It shares `buildLayers.ts` only, as §2.9 says.
   - #241 is at 2fc01f59 and is disjoint.
   - `verify-quotes-round-item-cites` is at b08a1fec and is disjoint.
   - The F7 piece edits Part F only.
   - PR A's Part AC and its items 51 and 52 are separate paths.

7. **Next:** PR A's code from B, by one worker-high, on `cut/b1-shell-half-pr-a`.
8. **Generation:** the node's generation goes up by one.

Read the last amendment first.

Nothing above is edited.

---

## Findings (not in the amendment; the form does not yet carry them)

**F1. The series ran 14 suites. The three e2e drivers that have no package script were not run (§0.3, H2, I3).**
- Milestone 3 defined "every existing e2e suite" to include `pan-anchor.mjs`, `source-watch-idle.mjs` and `source-changed.mjs`, the last on both routes (milestone 3's form, Amendment 3 item 12).
- All three are present at `frontends/shell/e2e/` @ c6de9b48. The series names none of them.
- PR A changes decode, the managers, the first look and the clear path (PA-U6). `source-changed.mjs` reads resident counts across a clear.
- This is an Evidence matter for the gate, not for this record. Choose one of these before PR A's code:
  - (a) Run the three drivers at B, and add a row: "4b. The scriptless drivers `pan-anchor.mjs`, `source-watch-idle.mjs` and `source-changed.mjs` (both routes) at B: <results>, under item 4's reading."
  - (b) Append: "§0.3's and H2's suites are the 14 `e2e:` scripts other than `e2e:debug`; the three scriptless drivers are outside them because <reason>." That would narrow H2 and needs a reason.
- I recommend (a). The amendment's item 4 says "the 14 scripts", so it does not over-claim either way.

**F2. B's `buildLayers.ts` sentence is false at a PR A head that has not merged #243, and no §4 pattern catches it.**
- At B the comment says `viewport_query` carries no attributes (`frontends/shell/src/canvas/buildLayers.ts:31 @ 55618ab5`).
- From PR A on, the batch carries the projected attributes (§2.2 (c)).
- ADR-023's B1 condition (1) (RULED 2026-09-14, question set D, item D2) bars leaving that assertion false. §2.9's condition 1 implies, but does not state, that PR A's merge waits for #243.
- Proposed row, for the custodian to append if accepted:
  - "PR A does not merge before #243. If #243 is dropped, PR A edits B's sentence in its place, and that edit is class 3."
  - Add `carries no attributes` to §4's first text-check bullet, positive at B at `frontends/shell/src/canvas/buildLayers.ts:31 @ 55618ab5`.
- An untrue in-code claim of what the wire carries would be a Correctness finding at the gate.

**F3. §2.2 (g)'s first bullet (`frontends/shell/src/skp/client.ts:122-123 @ 55618ab5`) names the comment but gives it no new words.**
- Proposed words, replacing both lines once line 124 sends the parameter:
  ```
      // `skp/0.6`: the caller's projection set, sent as given (`projectionFor`'s list, or `null`
      // when no column is projectable); `null` is sent as `null`, never omitted.
  ```
- Clause check:
  - "Sent as given" and "never omitted" are PA-U2.
  - "`projectionFor`'s list or `null`" is §2.2 (a) and (b), asserted by PA-U1 and PA-U7.
- These are not the human's words. The worker applies them, with no re-gate.

**F4. The stock shim and `recording`.** The series says the stock shim cannot run `recording`. That claim is about an untracked script and names no commit (round 15, item (c)). It is evidence from this run only. The custodian's milestone 3 PR B series passed `recording` on the port-5400 harness (`state/consults/2026-10-20-shell-migration-milestone-3-pr-b-e2e-custodian-runs.md:22 @ c6de9b48`). That record does not say which launcher it used, and I cannot reconcile the two. Item 4 records only this series' cause and its re-run.

**F5. Outside this piece.** At B the walkthrough has two Part P headings, and X comes before W (re-sweep step 3). This predates the piece and is not PR A's to fix. Part AC is still the next unused letter.

## What I could not settle

- Whether any file the amendment cites changed from 55618ab5 to c6de9b48. I read the main checkout, and every `@ 55618ab5` text is confirmed by the re-sweep. The custodian can check by script with `git diff --stat 55618ab5 c6de9b48 -- <the cited paths>` before pinning.
- Every sha256: the record hashes and the pins. I have no shell.
- Whether the `C:/dev/wt/samc` worktree is clean. Its branch ref reads b24e5281aef6da8b744de3ca840e9ffc10503cb6, and its `buildLayers.ts` lines 31-35 match the re-sweep's byte-copy from b24e5281 via `git show`.
- F1's choice and F2's merge ordering. Both are the custodian's to decide before PR A's code; F2's ordering goes to the human only if it is read as changing §2.9.

Files read:
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md
- C:/dev/spatial-ide/state/consults/2026-10-22-b1-shell-half-pr-a-base-e2e-tester-report.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md
- C:/dev/wt/samc/frontends/shell/src/canvas/buildLayers.ts
