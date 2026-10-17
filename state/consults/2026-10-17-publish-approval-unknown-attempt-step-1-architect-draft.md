*Custodian's filing note (2026-10-17): the architect's draft of the five-line form for `publish-approval-unknown-attempt-under-load`, read at main e54e4af2; the run 2026-10-17T17:10:05Z to 2026-10-17T17:24:44Z by its transcript (Read 34, Grep 23, Glob 4; no write-capable call); its one SubagentHandback call, at 17:24:43Z. Byte-copied by script from that call; one final newline added; nothing else changed. The form is committed from its fenced block at `frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md`, with its 53 HASH-TBD pin(s) computed by the custodian at e54e4af2 and its 1 pin(s) into `.github/` written in words with the same rev and hash (verify-quotes reads no path that starts with a dot), and nothing else changed. The message's sha256 as handed back is d270dcd5b7df7a74867e25e649276ab0fa0daab38e486230158954aced7a824f.*

---

Reviewed: main @ e54e4af241908a6cd205b4412ed981987cf8807c

## 1. Form choice and why

The five-line short form (§21b/§21d) fits, with little room to spare. My estimate is about 135 changed lines over 8 files (this form included) against §21c's limit of 150 lines and 8 files. If it runs over, it is a class 6 amendment, and §21b's mid-piece clause then closes the single-gate route (reviewer plus architect).

The piece has no new dependency, no exposure surface and nothing a user of the app sees. I tested it against all four §21a categories:
- **ADR, security, wire:** no ADR file, no product code, no SKP or MCP surface.
- **Guarantee, "any property currently under test":** this one needs care. My S5d form put a change to what S5d asserts under §21a. Here, no step's PASS condition changes. A run that passed before still passes. Every other run still does not pass: INCONCLUSIVE is never a pass, and the suite exits non-zero. The change only relabels an outcome that was already not a pass. The form says this in §1.7, so the reviewer can check the Out-of-scope line against it first.

No route OPEN item is needed.

**Design choices made in the form:**
- **One shared helper**, `e2e/exportElapsed.mjs`. There are 11 prepare-and-execute pairs across two suites and five call sites. One helper gives one definition of the four stamps and the verdict, and lets the verdict be tested as a pure function without a browser. Precedent: `residencyTrace.mjs` and its test, already in `verify`.
- **The clock.** The stamps are taken on the driver's monotonic clock (`performance.now()`). That is the only clock a step has: the host writes no stamp at prepare or execute (F4).
- **The verdict reads the upper bound.** The bound is from the prepare's send to the execute's answer. This way no TTL expiry is ever named a failure. The cost is a band about one round trip wide where an attempt lost for another reason reads INCONCLUSIVE. That band is named in the form and is never a pass.
- **A third status.** INCONCLUSIVE gets its own line status and exit code 3. A FAIL line carrying the word would contradict the human's "not a failure".

## 2. The draft form

````markdown
# The unknown attempt, step 1: the prepare-to-execute time in every e2e export step, and a TTL expiry INCONCLUSIVE — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this step has been seen says so in its first line. PLAN node publish-approval-unknown-attempt-under-load, its first step, in slot 1. Drafted by the architect at main e54e4af241908a6cd205b4412ed981987cf8807c. Every pin below is historical: for the code, the branch's tree is authoritative; for what this form read, the pin is. The cause and the product question are later steps of this node; this step changes no product code and not the TTL. Single combined reviewer gate (§21b). §21a's "property currently under test" is not touched by the reading in §1.7.*

```
Authority: PLAN node publish-approval-unknown-attempt-under-load, its first step; the human's rulings of 2026-10-17, the first message's item 7 (state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:25 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) and the second message's item 4 (state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md:16 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD), each with its RULED block in DECISIONS-PENDING.md; the machine rules (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD); the port-5400 harness approval (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD). Evidence (runs, cited for what they reported): state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md and state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, each with exit code 1, for pending attempt `No prior art recorded for "pending attempt". Research it before planning an implementation.` and for approval expiry `No prior art recorded for "approval expiry". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: this form (frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md); frontends/shell/e2e/exportElapsed.mjs (new); frontends/shell/e2e/exportElapsed.test.mjs (new); frontends/shell/package.json (one script added, the verify chain extended); frontends/shell/e2e/publish.mjs; frontends/shell/e2e/selection.mjs; frontends/shell/e2e/README.md (the publish and selection entries, written after PR #225 merges); .github/workflows/product-ci-shell.yml (the verify comment only); 8 files; declared line budget <= 150 changed lines by §21c's counting, this form excluded (estimate about 135); no PLAN or generated file on the branch.
Change: every e2e export step that prepares and executes (§0 F6) prints on its own line, for each of its pairs, the prepare-to-execute elapsed time on the driver's monotonic clock (§1.1), and an execute that returns `unknown-attempt` reads INCONCLUSIVE, never a pass, when more than PENDING_ATTEMPT_TTL as read from publish.rs may have passed between the prepare's send and the execute's answer, and FAIL otherwise (§1.4); no product code changes.
Tests+mutation: new frontends/shell/e2e/exportElapsed.test.mjs (`npm run test:export-elapsed`, joined to `npm run verify`), cases T1 to T4 (§2.1), T2 over the two runs' real lines byte-copied by script; mutation M1, the verdict's TTL comparison replaced by `true`, fails T2's E-EXPORT case by name, observed by applying it at the final code commit, running the test, recording the failure by name with that commit id and reverting it; then the custodian's e2e at the head, R1 to R3 (§2.2), R3 a scratch 121 s wait that shows a real expiry read INCONCLUSIVE.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file; no product code (nothing under frontends/shell/src/ or frontends/shell/src-tauri/, protocol/, engine/ or kernel/); PENDING_ATTEMPT_TTL unchanged; no SKP or MCP surface; no step's PASS condition changes, since a run that passed a step before passes it now and every other run still does not pass (§1.7); the CI file's change is a comment; no dependency, exposure surface or string the app shows.
```

## §0. The code and the records as read

- F1. The TTL is 120 s and bounds how long a prepared attempt waits for the operator's confirmation: frontends/shell/src-tauri/src/publish.rs:62-68 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. The grant minted beside it has the same lifetime: frontends/shell/src-tauri/src/publish.rs:587-597 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F2. The attempt's clock starts when it is stashed, at the end of the host's prepare, on `Instant`: frontends/shell/src-tauri/src/publish.rs:643-661 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F3. Past the TTL the attempt is gone. `take` removes it and returns none when its elapsed time exceeds the TTL: frontends/shell/src-tauri/src/publish.rs:216-225 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. The next prepare's insert drops every entry past the TTL: frontends/shell/src-tauri/src/publish.rs:207-214 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. Execute answers `UnknownAttempt` on a miss: frontends/shell/src-tauri/src/publish.rs:725-727 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. The variant covers an id already executed, expired or never issued: frontends/shell/src-tauri/src/publish.rs:356-359 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. A second execute under an id already running also gets it: frontends/shell/src-tauri/src/commands.rs:458-460 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F4. The panel's execute hook can answer by itself.
  - It returns `unknown-attempt` itself, with no host call, when it holds no current attempt: frontends/shell/src/publish/PublishPanel.tsx:532-536 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. It learns the attempt from an effect after the dialog state renders: frontends/shell/src/publish/PublishPanel.tsx:519-522 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - The dialog's Submit takes the state's own attempt id instead: frontends/shell/src/publish/PublishPanel.tsx:598 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/src/publish/PublishPanel.tsx:723-727 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - The outcome has one shape, with no field: frontends/shell/src/publish/types.ts:87 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. So the outcome alone does not tell F3's cases and F4's apart.
  - No audit record exists for an attempt the host does not take, because the log opens after the take: frontends/shell/src-tauri/src/publish.rs:779 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - The console's row for the execute is recorded only when the panel calls the host: frontends/shell/src/publish/client.ts:61-66 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. The row carries no time: frontends/shell/src/console/recorder.ts:96-103 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - Neither side writes a log line at prepare or execute (a search of src-tauri/src and src/publish at e54e4af2).
- F5. A step's only clock is therefore the driver's. The host's interval, from F2's stash to F3's take, lies inside two driver intervals:
  - from the prompt's arrival to the execute's send (a lower bound);
  - from the prepare's send to the execute's answer (an upper bound).
- F6. The export steps that prepare and execute:
  - publish.mjs: APPROVED' (frontends/shell/e2e/publish.mjs:282-289 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/e2e/publish.mjs:353-360 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD), REFUSED' (frontends/shell/e2e/publish.mjs:409-426 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) and FILTERED' (frontends/shell/e2e/publish.mjs:474-498 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD).
  - selection.mjs: E-EXPORT, two pairs (frontends/shell/e2e/selection.mjs:580-583 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD); E-SCOPE (frontends/shell/e2e/selection.mjs:597-603 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD); E-ASK (two pairs), E-ASK-STATEMENT (one) and E-ASK-TWO's first, all through `startExportThenOpen` (frontends/shell/e2e/selection.mjs:616-629 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD); E-ASK-TWO's second (frontends/shell/e2e/selection.mjs:723-726 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD).
  - The shared prepare and execute helpers: frontends/shell/e2e/selection.mjs:556-564 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - Eight steps and eleven pairs in all.
- F7. Excluded, because they have no execute and so no prepare-to-execute interval:
  - export-view.mjs abandons every prompt: frontends/shell/e2e/export-view.mjs:12 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/e2e/export-view.mjs:78 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - console.mjs's CLASSB' only prepares: frontends/shell/e2e/console.mjs:544-553 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - selection.mjs's EXPORT-TODAY is skipped and asserts nothing: frontends/shell/e2e/selection.mjs:14-18 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/e2e/selection.mjs:880-881 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F8. Each step's line and each suite's exit code:
  - `runStep` prints the step's id, status and whole duration on `Date.now()`: frontends/shell/e2e/selection.mjs:820-835 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/e2e/publish.mjs:593-604 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - The summaries: frontends/shell/e2e/selection.mjs:868 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/e2e/publish.mjs:647 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - selection.mjs's existing class-2 INCONCLUSIVE is a FAIL line carrying the word: frontends/shell/e2e/selection.mjs:55 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/e2e/selection.mjs:627 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F9. The two runs:
  - E-EXPORT came back unknown-attempt in a step that lasted 16 077 ms: state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md:10 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. The three ask steps read class-2 INCONCLUSIVE, the export already ended: state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md:11-13 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - E-ASK-TWO's second export came back unknown-attempt in a step of 12 200 ms: state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md:15 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
  - Each pair ran inside its step's timed window (F8). So by the driver's clock neither pair spanned 120 s, unless that clock was stepped by more than 100 s during the step.
  - The records do not show whether the execute reached the host (F4). This step grades no cause.
- F10. A shared e2e module with a plain-Node test in `verify` has a precedent: frontends/shell/package.json:17 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD and frontends/shell/package.json:39-40 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F11. The README's publish entry (frontends/shell/e2e/README.md:212-215 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) and selection entry (frontends/shell/e2e/README.md:771 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD, PR #225's line; frontends/shell/e2e/README.md:775 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD). The selection entry's sentences are not the human's wording: frontends/shell/e2e/README.md:767 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.
- F12. CI's comment lists the verify chain, and lacks `verify:adr-index` at this base: .github/workflows/product-ci-shell.yml:203-206 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD.

## §1. The design

1.1 **The figure.** The stamps are four readings of Node's `performance.now()` in the suite's process:
- p0, before the prepare's evaluate is sent;
- p1, when its outcome is in hand;
- e0, before the execute's evaluate is sent;
- e1, when the execute's outcome is in hand.

The prepare-to-execute elapsed time is L = e0 − p1, in whole ms. The upper bound is U = e1 − p0. In the ask steps, e1 is when the driver reads the outcome, so U is looser there and still an upper bound (F5). Both are readings for the triage, not measurements under docs/08: no p50 or p95, no budget, no claim about speed.

1.2 **One shared helper,** frontends/shell/e2e/exportElapsed.mjs. It gives one definition for eleven pairs in two suites, and its verdict is testable without a browser (F10). It provides:
- the TTL read;
- the verdict, a pure function;
- a per-step list of pairs. `runStep` begins the list. A pair is opened around the prepare, takes e0 at the execute's send, and is checked when the execute's outcome is in hand.

Both suites import it. No call site gains a parameter.

1.3 **The TTL as the code defines it.** The helper reads PENDING_ATTEMPT_TTL's line (F1) from the checkout's publish.rs and turns its seconds into ms. A line it cannot read stops the suite with a harness failure, by name. Each run's record names the exe's build commit and the checkout's commit. If the TTL line differs between the two, STOP.

1.4 **The verdict,** for an execute outcome, its U and the TTL T:
- **Not `unknown-attempt`:** no verdict. The step's own assertions judge, unchanged, a `refused` outcome included.
- **`unknown-attempt` and U ≤ T:** FAIL. The host's interval is under U (F5), and the host expires an attempt only past T (F3), so the TTL did not end it. The message names the outcome, L, U and T.
- **`unknown-attempt` and U > T:** INCONCLUSIVE, never a pass. A TTL expiry is not excluded. The message names L, U and T.

Named gaps, recorded and not handled:
- An attempt lost another way (F3, F4) with L ≤ T < U reads INCONCLUSIVE. U − L spans the prepare's and the execute's own round trips, plus, in the ask steps, the poll before the outcome is read.
- A grant that expired in the instants between its minting and the stash refuses as `refused`, not `unknown-attempt` (F1, F2). That window lies inside the host's own prepare call.

1.5 **Where it is printed.**
- Each step's PASS note, FAIL message or INCONCLUSIVE message ends with `prepare-to-execute`, then each pair's L in ms in pair order, on the line `runStep` prints (F8).
- INCONCLUSIVE is a third status, printed as `[<id>] INCONCLUSIVE (<ms>ms): …`.
- Each summary counts it. The summary line is byte-identical to today's when no step is INCONCLUSIVE.
- A suite exits 1 if any step FAILs, else 3 if any step is INCONCLUSIVE, else 0.
- selection.mjs's existing class-2 INCONCLUSIVE throws keep their FAIL lines (F8; OPEN-2).

1.6 **Where the verdict is checked.**
- Every execute outcome that `executeExport` or a publish.mjs step reads is checked before the step's own assertion on it.
- In `startExportThenOpen`, when the export has ended before the ask is read, the outcome is read and checked first. An `unknown-attempt` then reads by §1.4. The class-2 INCONCLUSIVE stays for any other outcome.
- Named gap: an `unknown-attempt` the ask steps read later, after seeing the ask standing, is not checked and goes on as today. It needs the run to end inside one request round trip after the ask showed.

1.7 **What does not change.**
- No product code, and not PENDING_ATTEMPT_TTL.
- No step's PASS condition. The verdict gives nothing for an outcome other than `unknown-attempt`, and every step already fails an `unknown-attempt` it checks today (each asserts `success` or `refused`). The only exception is §1.6's late read, which stays as it is.
- So a run that passed a step before passes it now, and every other run still does not pass.

1.8 **Documents in Scope.**
- The README's publish and selection entries (F11) each say what the figure is and when an export step reads INCONCLUSIVE. The selection entry's inconclusive sentence is narrowed to §1.6. Its sentence on millisecond figures is adjusted to the figure, a reading and not a bound on waiting.
- These README edits are written after PR #225 merges, on the tree then. None of them is the human's wording.
- The CI comment (F12) lists package.json's verify chain as it stands at the head.

## §2. Tests, the mutation and the runs

2.1 **The node test,** frontends/shell/e2e/exportElapsed.test.mjs (`npm run test:export-elapsed`, joined to `verify` after `test:citation-integrity`):
- **T1.** The TTL read from the real publish.rs is 120 000 ms. It changes with the TTL, by design.
- **T2.** The real shape. The two lines F9 pins are byte-copied by script into the test, each with its pin. The outcome is the JSON each line carries, and U is the step's printed duration (F9). Each reads FAIL.
- **T3.** That outcome with U = T + 1 reads INCONCLUSIVE; with U = T it reads FAIL.
- **T4.** A `success` outcome and a `refused` outcome, each with U = 10 × T, give no verdict.
- **M1.** The comparison U > T is replaced by `true`. T2's E-EXPORT case fails by name. It is observed by applying it at the final code commit, running the test, recording the failure by name with that commit id, and reverting it (round 25, item 2 (c)). Until merge, the closing record names a test-text span by its branch commit id in words, with no hash (round 25, item 2 (d)).

2.2 **The e2e at the head,** run by the custodian:
- **Setup.** The port-5400 harness on its approval's terms, disclosed in the record. A shared hold under the machine rules. The exe built at the head. A fresh app per suite. Lines byte-copied by script.
- **R1.** `npm run e2e:publish` once. APPROVED', REFUSED' and FILTERED' pass, each line carrying one figure.
- **R2.** `npm run e2e:selection` once. These pass with their figures: E-EXPORT (two), E-SCOPE (one), E-ASK (two), E-ASK-STATEMENT (one) and E-ASK-TWO (two). Every other step reads as at the base.
- **R3.** A real expiry, observed. A scratch patch, never committed, waits 121 000 ms before APPROVED''s execute, and R1 runs again. Expected:
  - `[APPROVED'] INCONCLUSIVE`, with L and U both over 120 000 ms;
  - REFUSED' and FILTERED' pass;
  - exit code 3.

  Then the patch is reverted and the checkout is proven clean.
- **Under load.** An export step that meets `unknown-attempt` in a shared run is not recorded as a failure (state/directives/2026-10-06-machine-script-adopted.md:20 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD). The custodian re-runs it alone, and its line is kept as the cause step's evidence.
- **Stops.** The TTL line cannot be read, or differs between the exe and the checkout (§1.3). The machine script exits 96 to 99. The build fails.

The closing record is references and hashes (the record cap).

## §3. Overlap (rule 00)

- **PR #225** edits the selection entry's line of e2e/README.md. This piece's README lines wait for its merge, and this PR is not marked ready before then.
- **cut/search-ignore-historical**: a root `.ignore`, scripts/plan/measure-reads.mjs and its test, two probe files, an AUTONOMY.md append. No shared path.
- **source-changed-post-route-s5d-race, step 1** runs source-changed.mjs unedited. lib.mjs and source-changed.mjs are untouched here. This piece's shared-hold runs are never placed inside its exclusive hold.
- **shell-migration-milestone-3** starts its code after this merges: frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:818 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD. It then adds e2e/command-bar.mjs and edits e2e/README.md. Its suite sweeps (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:759-764 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:HASH-TBD) will meet the INCONCLUSIVE status and exit 3. How it reads them belongs to its own record.
- Nothing here touches protocol/.

## §4. Gates

- Proportional gates (state/directives/2026-10-05-product-first-direction.md, section 2).
- One reviewer gate (§21b). The reviewer checks the Out-of-scope line first, runs `npm run test:export-elapsed` and recomputes every hash. It blocks only on Correctness or Evidence; a documentation finding is fixed before the merge.
- A size overrun is a class 6 amendment, and the single-gate route then closes (§21b).

## §5. OPEN items

- **OPEN-1 (the human's): this step's reach.**
  - By the runs' own step durations, the TTL did not end either attempt (F9).
  - The outcome cannot tell the host's miss from the panel hook's own answer, given with no attempt held (F4). That answer is reachable through the dev hook only, never through the dialog's Submit.
  - (A) As drafted: this step records the time and the TTL reading, and the cause step owns the rest.
  - (B) This step also prints, for each `unknown-attempt`, whether the execute reached the host, by reading the console's execute row before and after. That is a scope addition of about 15 lines. It opens the console during the steps, which changes the layout under the steps after it.
  - The architect recommends (A).
- **OPEN-2 (the human's): one INCONCLUSIVE form or two.**
  - (A) As drafted: only §1.4's reading prints the INCONCLUSIVE status, and selection.mjs's existing class-2 throws keep their FAIL lines.
  - (B) Those throws also print the status, a scope addition of about 8 lines.
  - The architect recommends (A), with (B) as its own tests-lane piece.

### Amendments

*(Opens empty; append-only.)*
````

## 3. Clause check (each sentence the form states as a fact of the code, at e54e4af2)

| Clause | Checked against | Result |
|---|---|---|
| F1: 120 s; bounds the wait for the operator's confirmation; the grant has the same lifetime | publish.rs:62-68; publish.rs:595-597 passes the TTL to `PublishGrant::new` | holds |
| F2: stashed at the end of prepare, on `Instant` | publish.rs:643-659 (`created_at: Instant::now()` at 657), returned at 661; `Instant` is imported at line 47 | holds |
| F3: `take` drops the attempt past the TTL (strict); insert prunes; execute miss gives `UnknownAttempt`; the variant's doc; a concurrent execute | publish.rs:220-223 (`elapsed() > PENDING_ATTEMPT_TTL`); publish.rs:212 (`retain … <= TTL`); publish.rs:725-726; publish.rs:356-359; commands.rs:458-460 | holds |
| F4: hook answers with no host call; the ref is set by an effect; Submit uses the state's id | PublishPanel.tsx:533-535 returns before `executeInStagedScope`; :520-522; :598 and :724-727 (`attemptId={state.attemptId}`, `execute={execute}`) | holds |
| F4: one outcome shape with no field | types.ts:87 | holds |
| F4: no audit record without a take | publish.rs:779 `AuditLog::open_for` comes after the take at 725 | holds |
| F4: console row only when the host is called; no time on the row | client.ts:62 records before `invoke`, and runExecute's early return never reaches it; recorder.ts:96-103 has fields seq, kind, command and outcome only | holds |
| F4: no log line at prepare or execute | search of src-tauri/src (eprintln, tracing, log:: and session-event hits only in lib.rs and commands.rs:184) and src/publish (no session-log call) | holds, by search at e54e4af2 |
| F5: host interval inside the driver bounds | the stash (F2) happens before prepare returns; the take is execute's first statement (725), after the command is invoked | holds; no host interval exists on F4's path, which F5's "the host's interval" does not claim |
| F6: eight steps, eleven pairs; no other suite executes | the pins; `publishExecute` appears in e2e only in publish.mjs and selection.mjs (grep) | holds |
| F7: no execute in export-view, CLASSB' or EXPORT-TODAY's run | export-view.mjs:12 and :78; console.mjs:544-553; selection.mjs:14-18 and :880-881 (behind `SELECTION_EXPORT_TODAY`) | holds |
| F8: `runStep` lines, `Date.now`, summaries, exit codes, class-2 convention | selection.mjs:821/826/829-830, :868; publish.mjs:594-602, :647; selection.mjs:55, :627 | holds |
| F9: 16 077 ms and 12 200 ms; each pair inside its step's window | h3-order.md:10; run-2.md:15; stepExport (580-583) and stepAskTwo (723-726) run inside `runStep`'s window (821 to 829) | holds; the wall-clock qualifier is stated |
| F10: precedent in `verify` | package.json:17 and :39 | holds |
| F11/F12: README lines; not the human's wording; CI comment lacks `verify:adr-index` | README.md:212-215, :767, :771, :775; product-ci-shell.yml:203-206 compared with package.json:17 | holds |
| §1.4 FAIL reasoning: U ≤ T means not expired | U is larger than the host's interval (F5), and expiry needs elapsed > T (F3) | holds |
| §1.4 grant gap: the refusal is `refused` | grant minted at 587-597, before the stash at 657; publish.rs:791-796 says a grant that is not found refuses at the boundary's step 4 | holds; the window lies inside one host call, so it is named and not handled |
| §1.7: no PASS condition changes | each checked execute is asserted `success` (selection.mjs:583, :651, :673, :722, :726; publish.mjs:358, :496) or `refused` (selection.mjs:603; publish.mjs:424) | holds; E-ASK's cancel half (selection.mjs:661-664) accepts any outcome after the ask showed, and §1.6 leaves that late read unchanged, so the PASS set is unchanged |

**Wording:** none of the form's sentences is the human's wording. The README edits in Scope are worker text, checked by the reviewer, and README.md:767 says the selection entry is not the human's.

## 4. OPEN items

Both are in the form's §5. OPEN-1 asks whether this step stays at the time and the TTL reading (A, recommended) or also records whether the execute reached the host (B, a scope addition that opens the console during the steps). OPEN-2 asks whether only the TTL reading gets the INCONCLUSIVE status (A, recommended) or the existing class-2 throws do too (B). Nothing else waits for the human.

**Things the custodian should know (none of them changes this form):**
- **The TTL is already ruled out for both runs.** By the two records' step durations (F9), the TTL did not end either attempt, so this step's INCONCLUSIVE would not have fired for either run.
- **A third cause, not in the human's two.** The likeliest lead for the cause step is the dev hook. Its execute reads the current attempt through an effect that runs after the dialog state renders (PublishPanel.tsx:519-522). An execute sent right after the prepare's promise resolves can find no attempt there and get the hook's own `unknown-attempt` with no host call. This is a hypothesis, not tested. If it holds, the cause is in the dev hook, not the product's Submit, and it is neither of the human's two causes.
- **The dialog does show a figure.** For the product question: the dialog shows a static "grant remaining" figure in seconds, taken at prepare time and not counting down (PublishDialog.tsx:247-249). The human's premise that it shows no expiry is right that nothing counts down or names the attempt's expiry, but a figure is shown.
- **Milestone 3 will meet the new status.** Its sweeps will see INCONCLUSIVE and exit code 3 from these two suites. Its record will need a line on how it reads them.

## 5. Files read (all at main e54e4af2)

- C:\dev\spatial-ide\state\directives\2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md
- C:\dev\spatial-ide\state\directives\2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md
- C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md
- C:\dev\spatial-ide\state\directives\2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md
- C:\dev\spatial-ide\state\consults\2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md
- C:\dev\spatial-ide\state\consults\2026-10-14-shell-status-bar-one-height-e2e-h3-order.md
- C:\dev\spatial-ide\PLAN.yaml (the node, lines 5445-5461)
- C:\dev\spatial-ide\AUTONOMY.md (§21 to §22)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (the five-line form; Round 25 additions)
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\publish.rs (1-380, 580-860, 1010-1210)
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\commands.rs (405-594)
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx (240-660, 720-730)
- C:\dev\spatial-ide\frontends\shell\src\publish\client.ts
- C:\dev\spatial-ide\frontends\shell\src\publish\types.ts (60-89)
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishDialog.tsx (200-251)
- C:\dev\spatial-ide\frontends\shell\src\console\recorder.ts (60-367)
- C:\dev\spatial-ide\frontends\shell\src\e2e-test-surface.ts (135-174)
- C:\dev\spatial-ide\frontends\shell\e2e\selection.mjs (1-80, 540-915)
- C:\dev\spatial-ide\frontends\shell\e2e\publish.mjs
- C:\dev\spatial-ide\frontends\shell\e2e\export-view.mjs
- C:\dev\spatial-ide\frontends\shell\e2e\console.mjs (525-594)
- C:\dev\spatial-ide\frontends\shell\e2e\residencyTrace.test.mjs (1-40)
- C:\dev\spatial-ide\frontends\shell\e2e\README.md (178-217, 758-782)
- C:\dev\spatial-ide\frontends\shell\package.json
- C:\dev\spatial-ide\.github\workflows\product-ci-shell.yml (195-219)
- C:\dev\spatial-ide\frontends\shell\SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md
- C:\dev\spatial-ide\engine\CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md (1-40)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (745-774, plus a grep)
- Greps only: admission-remediation.mjs, regression.mjs, the e2e exit codes, src-tauri logging, src/publish session-log calls.
