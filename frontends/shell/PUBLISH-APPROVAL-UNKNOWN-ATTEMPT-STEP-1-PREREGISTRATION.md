# The unknown attempt, step 1: the prepare-to-execute time in every e2e export step, and a TTL expiry INCONCLUSIVE — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this step has been seen says so in its first line. PLAN node publish-approval-unknown-attempt-under-load, its first step, in slot 1. Drafted by the architect at main e54e4af241908a6cd205b4412ed981987cf8807c. Every pin below is historical: for the code, the branch's tree is authoritative; for what this form read, the pin is. The cause and the product question are later steps of this node; this step changes no product code and not the TTL. Single combined reviewer gate (§21b). §21a's "property currently under test" is not touched by the reading in §1.7.*

```
Authority: PLAN node publish-approval-unknown-attempt-under-load, its first step; the human's rulings of 2026-10-17, the first message's item 7 (state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:25 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:4f9c8ea88e5c559aba812808885c5191562fb53ee13ccd00f9cd52c04cd12fe1) and the second message's item 4 (state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md:16 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:138d9351d249f0ff7f538983bad48ae68cc78d84adfdc61a78652ec3132f5e61), each with its RULED block in DECISIONS-PENDING.md; the machine rules (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1); the port-5400 harness approval (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:99a0e4c3f7c9278ef1871b5222638b97b46d6a6dce7f11718f3ea54b2f48fb84). Evidence (runs, cited for what they reported): state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md and state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, each with exit code 1, for pending attempt `No prior art recorded for "pending attempt". Research it before planning an implementation.` and for approval expiry `No prior art recorded for "approval expiry". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: this form (frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md); frontends/shell/e2e/exportElapsed.mjs (new); frontends/shell/e2e/exportElapsed.test.mjs (new); frontends/shell/package.json (one script added, the verify chain extended); frontends/shell/e2e/publish.mjs; frontends/shell/e2e/selection.mjs; frontends/shell/e2e/README.md (the publish and selection entries, written after PR #225 merges); .github/workflows/product-ci-shell.yml (the verify comment only); 8 files; declared line budget <= 150 changed lines by §21c's counting, this form excluded (estimate about 135); no PLAN or generated file on the branch.
Change: every e2e export step that prepares and executes (§0 F6) prints on its own line, for each of its pairs, the prepare-to-execute elapsed time on the driver's monotonic clock (§1.1), and an execute that returns `unknown-attempt` reads INCONCLUSIVE, never a pass, when more than PENDING_ATTEMPT_TTL as read from publish.rs may have passed between the prepare's send and the execute's answer, and FAIL otherwise (§1.4); no product code changes.
Tests+mutation: new frontends/shell/e2e/exportElapsed.test.mjs (`npm run test:export-elapsed`, joined to `npm run verify`), cases T1 to T4 (§2.1), T2 over the two runs' real lines byte-copied by script; mutation M1, the verdict's TTL comparison replaced by `true`, fails T2's E-EXPORT case by name, observed by applying it at the final code commit, running the test, recording the failure by name with that commit id and reverting it; then the custodian's e2e at the head, R1 to R3 (§2.2), R3 a scratch 121 s wait that shows a real expiry read INCONCLUSIVE.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file; no product code (nothing under frontends/shell/src/ or frontends/shell/src-tauri/, protocol/, engine/ or kernel/); PENDING_ATTEMPT_TTL unchanged; no SKP or MCP surface; no step's PASS condition changes, since a run that passed a step before passes it now and every other run still does not pass (§1.7); the CI file's change is a comment; no dependency, exposure surface or string the app shows.
```

## §0. The code and the records as read

- F1. The TTL is 120 s and bounds how long a prepared attempt waits for the operator's confirmation: frontends/shell/src-tauri/src/publish.rs:62-68 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:c13b47922c72b9fd7eb1f6eab63bdcd0e5d7ea446f6449ca2b3dcfbdaac4e1c9. The grant minted beside it has the same lifetime: frontends/shell/src-tauri/src/publish.rs:587-597 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:4fcf67a7dfd21d0d2e500f01449b537ab9d52348dc1f3352a83115730c8d4b37.
- F2. The attempt's clock starts when it is stashed, at the end of the host's prepare, on `Instant`: frontends/shell/src-tauri/src/publish.rs:643-661 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:24204eb646a9eae41aa38aa1e26558a80d37913c7fe042f8a656a2cb2c2af5dd.
- F3. Past the TTL the attempt is gone. `take` removes it and returns none when its elapsed time exceeds the TTL: frontends/shell/src-tauri/src/publish.rs:216-225 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:83920b5d37686caf498197a9768591ec36e75a845028a7fcd539938a9e4ed8c5. The next prepare's insert drops every entry past the TTL: frontends/shell/src-tauri/src/publish.rs:207-214 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:b55076fdee8e106fca966f4f8a94c0fc08f6e86e5fec25c249447e6a4978f711. Execute answers `UnknownAttempt` on a miss: frontends/shell/src-tauri/src/publish.rs:725-727 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:28adabfa7db23e8d7fbc4f7ba539f175a51a32480f799bc4bda1f102dd0ac449. The variant covers an id already executed, expired or never issued: frontends/shell/src-tauri/src/publish.rs:356-359 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:4eaa9b21273b5d4e6a9622e0c9cffadf7d952d973539916fa999aa0d4c28bee9. A second execute under an id already running also gets it: frontends/shell/src-tauri/src/commands.rs:458-460 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:25211778ee7cab5d8e9f35d4d4f5f036409d9f72afa7830e18e75b249b501431.
- F4. The panel's execute hook can answer by itself.
  - It returns `unknown-attempt` itself, with no host call, when it holds no current attempt: frontends/shell/src/publish/PublishPanel.tsx:532-536 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:73ed77cda9bfb97c36193c10e15d7330df46b19e35b9b572351a37a7b1f55827. It learns the attempt from an effect after the dialog state renders: frontends/shell/src/publish/PublishPanel.tsx:519-522 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:2fdff5cbbf04d3dcff5468ae6acb6616c5586583ecc5ef73385f032bd59bf2ee.
  - The dialog's Submit takes the state's own attempt id instead: frontends/shell/src/publish/PublishPanel.tsx:598 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:2047610e34514437e4cbf422059bd029bec58f1934e17ed768149d89fdfafcf5 and frontends/shell/src/publish/PublishPanel.tsx:723-727 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:b0c893715ec39ac8f7392d270590ebe41f9ec20c5da9fc309f5f0f53c8f232bd.
  - The outcome has one shape, with no field: frontends/shell/src/publish/types.ts:87 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:b44995b04764caf02cdfa90212b79ea8ed23504445ac2851040476fbde8ceab3. So the outcome alone does not tell F3's cases and F4's apart.
  - No audit record exists for an attempt the host does not take, because the log opens after the take: frontends/shell/src-tauri/src/publish.rs:779 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:648f47a6c6d450a306d2c5f9b8972f0031d99133d9b690cc886f601c75dae656.
  - The console's row for the execute is recorded only when the panel calls the host: frontends/shell/src/publish/client.ts:61-66 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:2fd336e8695f3f676f691daf8895c652811144d199b0008a00018367264f2a2e. The row carries no time: frontends/shell/src/console/recorder.ts:96-103 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:08a7514c526557b0d807d3ca1c8b862a89f7541b5cf38df2d980ef6faa3d5939.
  - Neither side writes a log line at prepare or execute (a search of src-tauri/src and src/publish at e54e4af2).
- F5. A step's only clock is therefore the driver's. The host's interval, from F2's stash to F3's take, lies inside two driver intervals:
  - from the prompt's arrival to the execute's send (a lower bound);
  - from the prepare's send to the execute's answer (an upper bound).
- F6. The export steps that prepare and execute:
  - publish.mjs: APPROVED' (frontends/shell/e2e/publish.mjs:282-289 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:876d313642bb0185d490bf81135b593c131c519e6a2c5c84644eacc781c23212 and frontends/shell/e2e/publish.mjs:353-360 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:9786dd79bba528ff0d3474255c6fbfdcb557c7092089ca54fb828aff5fc32c7e), REFUSED' (frontends/shell/e2e/publish.mjs:409-426 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:2b9f5e09a69a9d7937f673290cadd3b70af9f6f149270395c61fe7d574569bfc) and FILTERED' (frontends/shell/e2e/publish.mjs:474-498 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:0d67d7225917edfca2751d5553427f87029cf907e1d0f660c42e5640d0f16d59).
  - selection.mjs: E-EXPORT, two pairs (frontends/shell/e2e/selection.mjs:580-583 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:64f32d0023499e1710b969b27264da171c1b76d8c3b1e8043b01a23f1f7ba304); E-SCOPE (frontends/shell/e2e/selection.mjs:597-603 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:aea5e9fbbcdd92b12b1ae4eba83c06049e3efec6d5e2e01ea74380a2422acf46); E-ASK (two pairs), E-ASK-STATEMENT (one) and E-ASK-TWO's first, all through `startExportThenOpen` (frontends/shell/e2e/selection.mjs:616-629 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:627717e68052150239a9b29adcdd4724f3f269da63845dde3559b8350a3d4e92); E-ASK-TWO's second (frontends/shell/e2e/selection.mjs:723-726 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:caf1a0928a88149abbeb139c2010bf2b9afd75e8330ea455e6f9068102e7f31e).
  - The shared prepare and execute helpers: frontends/shell/e2e/selection.mjs:556-564 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:bb56b7bea94069db3da2204fc8e679407cd5a40e1b46fdad7fd0ae344fc87d8c.
  - Eight steps and eleven pairs in all.
- F7. Excluded, because they have no execute and so no prepare-to-execute interval:
  - export-view.mjs abandons every prompt: frontends/shell/e2e/export-view.mjs:12 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:db44194141787e607db1c15fa12f858e3009bc29a2be7242ed94ffa1b517c1b5 and frontends/shell/e2e/export-view.mjs:78 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:eaee01eb95d6952a61cefaee79a3267ba6ce26fb18ace379b663f0e7007fcb4c.
  - console.mjs's CLASSB' only prepares: frontends/shell/e2e/console.mjs:544-553 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:cb753e6e0852101ea92c47c45dd0c2a0be2245aa588d57ac466448ebabf30fe6.
  - selection.mjs's EXPORT-TODAY is skipped and asserts nothing: frontends/shell/e2e/selection.mjs:14-18 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:c7a2958d15f22beb9a89e39e6b7f936a2b7d92492a304fb314bafe8d29ba7ab6 and frontends/shell/e2e/selection.mjs:880-881 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:0f542dd6679f163f2e3d222484f34ccb1a94d1187ffaff5f0b4cd154b45147cf.
- F8. Each step's line and each suite's exit code:
  - `runStep` prints the step's id, status and whole duration on `Date.now()`: frontends/shell/e2e/selection.mjs:820-835 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:9ee3bc5d4b39559046874e78ddd77c65dfbeab695f19aa40803da6ed4fca9dcc and frontends/shell/e2e/publish.mjs:593-604 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:78ed69070bd0e47c8235f292a2e2e1148b7dad3f112b532f026b64c93be9c5a6.
  - The summaries: frontends/shell/e2e/selection.mjs:868 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:c6da8bf0b4e2194579baefc3032f60213e856cbcfdc155ebcae8495c1fcea6c8 and frontends/shell/e2e/publish.mjs:647 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:ec0206557186e7a8ea79685ac7d724c7ec71aacd75c3b74a6306375403c59e06.
  - selection.mjs's existing class-2 INCONCLUSIVE is a FAIL line carrying the word: frontends/shell/e2e/selection.mjs:55 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:dc1605147c1668f954e088a54334dd2f488bd6baf127f17aaa626f1197602971 and frontends/shell/e2e/selection.mjs:627 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:f2373244aa36c0202c4cd68d6560d7ff6edab03fe539c86d879cbd1aa6db271d.
- F9. The two runs:
  - E-EXPORT came back unknown-attempt in a step that lasted 16 077 ms: state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md:10 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:4e66b074e8fa92858b176103368c95cbcd7eacceda8bc43f54bfadf0ccb560ff. The three ask steps read class-2 INCONCLUSIVE, the export already ended: state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md:11-13 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:8f7f33f44f22eb1159e3b783a3989aa016ba3b8c570d20e143f632a570ea5a4d.
  - E-ASK-TWO's second export came back unknown-attempt in a step of 12 200 ms: state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md:15 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:c4d9fcfc3a0ea10a09b991b17b805f6a5104e4e98ae59103551ad994edc84c2a.
  - Each pair ran inside its step's timed window (F8). So by the driver's clock neither pair spanned 120 s, unless that clock was stepped by more than 100 s during the step.
  - The records do not show whether the execute reached the host (F4). This step grades no cause.
- F10. A shared e2e module with a plain-Node test in `verify` has a precedent: frontends/shell/package.json:17 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:6af34cbd8bcf7d8d27ea4cbca3df8e7fdcc0ddf02cc396567e3bdaed551c8a5d and frontends/shell/package.json:39-40 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:5eda9d28459bdef2f9f3374b9e957539e550b70b3adc7abf2469637efb298d2c.
- F11. The README's publish entry (frontends/shell/e2e/README.md:212-215 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:78ae75bf2525042387759520986d536ebda37d431d653bd307be7777b5be7bfb) and selection entry (frontends/shell/e2e/README.md:771 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:6da77c9c4dbb5dae1d1679841770791db8ceaac162845e8742248cba51f932f2, PR #225's line; frontends/shell/e2e/README.md:775 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:aaea2844e8cac545942f546a9d881d0b7cac8cfcd70cfaab04986d5e3a1b001b). The selection entry's sentences are not the human's wording: frontends/shell/e2e/README.md:767 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:48c3b20ddfc9bf30cf0fb566fc09dcf8341da5a95734ceb8c580a5063b4b6f8c.
- F12. CI's comment lists the verify chain, and lacks `verify:adr-index` at this base: `.github/workflows/product-ci-shell.yml` lines 203 to 206 at e54e4af241908a6cd205b4412ed981987cf8807c, sha256 f85fefca424042d4c3a03b8c45c94a00814447b607d694cabe8b58c2e0c52f54.

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
- **Under load.** An export step that meets `unknown-attempt` in a shared run is not recorded as a failure (state/directives/2026-10-06-machine-script-adopted.md:20 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:678460c8f7dfa9e08653c2371aa5c7ef6659eab4b081f4d05035a0cdee329e22). The custodian re-runs it alone, and its line is kept as the cause step's evidence.
- **Stops.** The TTL line cannot be read, or differs between the exe and the checkout (§1.3). The machine script exits 96 to 99. The build fails.

The closing record is references and hashes (the record cap).

## §3. Overlap (rule 00)

- **PR #225** edits the selection entry's line of e2e/README.md. This piece's README lines wait for its merge, and this PR is not marked ready before then.
- **cut/search-ignore-historical**: a root `.ignore`, scripts/plan/measure-reads.mjs and its test, two probe files, an AUTONOMY.md append. No shared path.
- **source-changed-post-route-s5d-race, step 1** runs source-changed.mjs unedited. lib.mjs and source-changed.mjs are untouched here. This piece's shared-hold runs are never placed inside its exclusive hold.
- **shell-migration-milestone-3** starts its code after this merges: frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:818 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:72d751757587b675b0a42f817e7da6fa4bc8c17ada14d10f8a1655f4d77539f1. It then adds e2e/command-bar.mjs and edits e2e/README.md. Its suite sweeps (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:759-764 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:525b33b5b193269b225968e67e68cf43fc0fc89a15da542ed90f6f5a83746196) will meet the INCONCLUSIVE status and exit 3. How it reads them belongs to its own record.
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

### Amendment 1 — the human's rulings on OPEN-1 and OPEN-2 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-s5d-o3-ordered-watcher-visible-placed-unknown-attempt-open-1-2-a-flake-full-form-225-226.md`, item 2). References only.*

1. **OPEN-1 (A)** and **OPEN-2 (A)**, as built at 80890488: the step records the time and the TTL reading, and the cause step owns the rest; only §1.4's reading prints the INCONCLUSIVE status, and `selection.mjs`'s existing class-2 throws keep their FAIL lines.
2. **OPEN-2's (B)** is its own tests-lane piece later, if it is wanted at all. No node is added for it now.
3. **Still to do:** the README lines of §1.8 (PR #225 has merged), then the single reviewer gate at the final head.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — the README lines written; §7 over its ceiling (class 6); both gates

*Written by the custodian after the README commit was seen. References only.*

1. **Main merged in** at 71b71372 (a merge commit on the branch, no rebase), so §1.8's lines are written on the tree after PR #225.
2. **The README lines** at 39dc2c8e: `frontends/shell/e2e/README.md`'s publish and selection entries, 3 lines in and 3 out, by one worker; the words are the worker's, each clause given with its line in the worker's report.
3. **§7 (class 6):** 154 changed lines over 7 files by `git diff --numstat origin/main...39dc2c8e`, this form excluded, over the declared 150. No other file was trimmed to fit. §7 is not edited.
4. **The gates:** by §21b, a size overrun closes the single-gate route, so both the reviewer and the architect gate PR #227, each blocking only on Correctness or Evidence.
5. **The e2e at 80890488** (R1 to R3, the custodian's record) stand: the later commits are the main merge and the README lines, and neither changes an e2e script or the exe's sources.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 3 — gate 1: both PASS WITH NOTES; three deviations (class 3); the words chosen

*Written by the custodian after both gate 1 reports were seen, at the head 39dc2c8e. References only. The reports: the architect `state/consults/gates/2026-10-17-publish-approval-unknown-attempt-step-1-gate1-architect.md` (gate-log 536) and the reviewer `state/consults/gates/2026-10-17-publish-approval-unknown-attempt-step-1-gate1-reviewer.md` (gate-log 537).*

1. **Gate 1:** both PASS WITH NOTES, with no Correctness or Evidence finding.
2. **Three deviations (class 3), the architect's D3:** (a) the figure ends the line `runStep` prints, by §1.5, and not a line of its own, as the Change line says; §1.5 governs. (b) `publish.mjs`'s summary is a table whose export rows carry the figure, so §1.5's byte-identical summary holds for `selection.mjs`'s line only. (c) §2.2's exe was built at be6aa620, the head's base, not at the head; the branch changes no exe source (the reviewer's Evidence 4).
3. **The words, with no re-gate:** the README's publish and selection entries take the architect's D1 and D2, which cover the reviewer's D1 and D2; the comments take the reviewer's D3 to D6; the PR body takes the reviewer's D7. One worker applies the words in one commit; the custodian checks them byte for byte against the reports.
4. **M1:** the permission classifier refused the reviewer's re-run, so M1 rests on the worker's recorded observation at dcaed6ed, the observation of record by the human's ruling of this date; the custodian re-observes it once, or records the gap, in the closing amendment.
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 4 — the words applied; §7 at 160 (class 6); M1 re-observed by the custodian

*Written by the custodian at the head 6a00d6a8, before the human's merge click. References only.*

1. **The words** at 6a00d6a8, one commit by one worker (`state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-words-worker-report.md`): the architect's D1 and D2 in the README's publish and selection entries, the reviewer's D3 to D6 in `selection.mjs`'s and `exportElapsed.mjs`'s comments. The custodian's check, by script: the nine spans taken from the two reports and applied to 39dc2c8e give the head's three files byte for byte, no other file changed, and each changed `.mjs` line is a comment.
2. **§7 (class 6):** 160 changed lines (129 in, 31 out) over 7 files by `git diff --numstat origin/main...6a00d6a8`, this form excluded: the 6 above Amendment 2's 154 are the gates' words, applied with no re-gate (Amendment 3 item 3). §7 is not edited.
3. **M1, re-observed once by the custodian** at 6a00d6a8 (`state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-m1-custodian-run.md`, sha256 fcccca5039cdb8a836ec9a0026d4259f90fe644803ccd448a88c9b9374279134): with the mutation applied alone, `npm run test:export-elapsed` exits 1, and T2's E-EXPORT test fails by name, with T2's E-ASK-TWO and T3; reverted, the tree is clean and the five pass. The worker's observation at dcaed6ed stays the observation of record.
4. **The e2e at 80890488** (R1 to R3) stand: the words change README text and comments only.
5. **The PR body** takes the reviewer's D7.
6. **Next:** PR #227 goes to the human for the merge click; the closing record follows the merge.
7. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 5 — closing record of step 1: PR #227 merged

*Written by the custodian after the merge. References only.*

1. **Merged** by the human at 2026-10-18T08:09:04Z, merge commit 4e03f85a1d99e2dc6722b89f5d2949a7f5800a30 (two parents: main a006d128 and the branch head 6a00d6a8).
2. **The worker's reports**, each with its sha256 from line 5 to the end: the build `state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-worker-report.md` (89c29dc2b4c7742bead76f456827227faca7a65d44927842ffc3e6a0348cd86c); the README lines `state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-readme-worker-report.md` (a028f0532c9c087a4981ccc7fa33a56ae3fb79cddaf35f23663c50e34b9c3a6b); the words `state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-words-worker-report.md` (ccc4aa8c965770c14932ab9d89ba9453e708e005c5de46c84ffa0b2fcf11560d).
3. **Gate 1:** both PASS WITH NOTES (gate log 536 and 537): `state/consults/gates/2026-10-17-publish-approval-unknown-attempt-step-1-gate1-architect.md` (sha256 fa8ce9d55dd8838b7821be2366eca4a64ba83af0290a70b0b7e2139d21631bf2) and `state/consults/gates/2026-10-17-publish-approval-unknown-attempt-step-1-gate1-reviewer.md` (sha256 753f24477ac17fb8680b8f3bda28a0c972568c98cd3c9101433479c60e0ba356).
4. **The custodian's records:** the e2e R1 to R3 `state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-e2e-custodian-runs.md` (sha256 8942a220a1bc3bd2093a801f036fb77c1b385de759422da30fa2f9720273bec0) and M1 re-observed `state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-m1-custodian-run.md` (sha256 fcccca5039cdb8a836ec9a0026d4259f90fe644803ccd448a88c9b9374279134), as Amendment 4 item 3.
5. **PLAN:** step 1 is done; the node stays open, because the cause and the product question are its later steps (this form's head). Its next step waits on the human. Milestone 3's dependency on this node, which stood for step 1 (the human's ruling of 2026-10-17, its item 4), is met and removed.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 6 — the cause step: (a) (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-19-229-merged-rotation-230-ready-watcher-visible-i2-a-one-consult-r2-a-unknown-attempt-cause-a.md`, item 3). References only.*

1. **The cause step: (a).** It waits for the next unknown attempt in any run. Every export step now prints its prepare-to-execute time (step 1, PR #227), and that time shows whether the attempt's TTL elapsed. No reproduction step is made.
2. **The product step** stays open behind the cause.
3. **PLAN:** the node is unscheduled while it waits, so it is never queued; the first unknown attempt seen in any run is recorded against this form.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 7 — the first unknown attempt since step 1: the TTL is excluded (class 1)

*Written by the custodian after the run was seen, under Amendment 6 item 3. References only. The record: `state/consults/2026-10-19-shell-migration-milestone-3-re-sweep-2-custodian.md`, §4 and §5, sha256 08632629bf97a57fec7acd99742d49725408b168a7ef2eb36362a519734aa9b8.*

1. **The observation.** The custodian's shared series at milestone 3's code base 564aadae, the selection suite, run 2026-10-19T16:52:27Z to 16:56:52Z: E-EXPORT's execute returned `unknown-attempt`, with L 0 ms, U 92 ms and T 120,000 ms. The line is byte-copied in the record.
2. **The reading, by §1.4:** FAIL, not INCONCLUSIVE. U is within T, so the TTL did not end this attempt: the first of the node's two causes is excluded for it.
3. **What this run cannot tell.** The outcome has one shape (§0 F4), so it does not say whether the host lost the attempt or the panel's execute hook answered by itself before its effect held the attempt (§0 F4). L of 0 ms, the execute sent as soon as the prepare answered, is consistent with either. The run kept no app stderr and no console ledger, the row that would show whether the host was called (§0 F4).
4. **Alone,** selection passed 18 of 18 twice in an exclusive hold (the record's §5): the attempt came under load, as the node's title has it.
5. **Next, the human's:** what follows this observation. The node is blocked on that ruling.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.
