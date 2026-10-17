*Custodian's filing note (2026-10-17): the architect's drafting consult for `source-changed-post-route-s5d-race`'s five-line form, read at main c5f86b20. The run 2026-10-17T07:50:46Z to 2026-10-17T08:05:35Z by its transcript (Grep 29, Read 34, Glob 3; no write-capable call); its one SubagentHandback call, at 08:05:34Z. Byte-copied by script from that call's message; one final newline added; nothing else changed. Its sha256 from line 5 to the end is 56e98760dbec163088f94f53079d1a288c802275a88de0f275613a2154acd2ac. The form committed beside it is the fenced block of section 2, with each HASH-TBD replaced by the hash the custodian computed at c5f86b20.*

---

Reviewed: main @ c5f86b2033537c4e8af58a9048709cc9c88c2cef · Verdict: none. This is a drafting consult, not a gate.

## 1. Which form, and why

The human asked for a five-line form. A five-line form can honestly carry step 1 only. Whatever S5d change follows cannot go on it.

- **Step 1 changes no tracked code or test.** It is the custodian's runs and a record, so its Out-of-scope line can truthfully say that none of the four categories is touched (§21b).
- **The change after step 1 alters what S5d asserts.** S5d is the post-check half of G-A2, which is a property currently under test, and that is a §21a category. Under round 25, item 2 (e), a piece whose Out-of-scope line would have to name that category takes the full form from dispatch. The architect's form `E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md` set the precedent: an e2e step fix went to the full form for this reason (its line 8).
- **Size is not the problem.** The likely O1 change is about 100 to 150 lines over 3 files, close to §21c's line bound but under it. The category is what rules out the short form.
- **The change's shape depends on step 1.** Of the five outcomes, only O1 leads straight to a test change. The others stop for the human.

So I drafted route (A): the five-line form for step 1. Each follow-on change gets its own form after the record. The full-form alternative is OPEN-1.

**A finding that shapes the form (Evidence, on main, outside this diff).** S5d's pass is weaker than its pass note says.
- Every kernel route that ends a generation sends `dataset_session_ended`: the pre-check, the post-check and the watcher alike. In the tiled arm that event reaches the tile manager's `endSession` and logs `tile-session-ended-source-changed` with no refusal line (F6 and F7 below).
- So S5d passing shows only that no refusal was logged. It does not show that the post-check ended the session. The pass note at `source-changed.mjs:1280-1281` and the comment at `:1243-1244` claim more than that.
- Step 1's outcome O3 tests exactly this.

## 2. The draft form

````markdown
# source-changed.mjs's post route, S5d: the race reproduced alone and under load, with timing, and each failure placed — five-line short form (`AUTONOMY.md` §21d)

*Committed before step 1 runs. Append-only once committed; an amendment written after any run of step 1 has been seen says so in its first line. PLAN node source-changed-post-route-s5d-race, at the tail of slot 2 after engine-clause-composition-properties. Drafted by the architect at main c5f86b2033537c4e8af58a9048709cc9c88c2cef. Every pin below is historical: for step 1's runs the tree at its base is authoritative, and for what this form read, the pin is. This short form carries step 1 only, which changes no tracked code or test. A change to what S5d asserts touches a property currently under test (§21a), so by round 25, item 2 (e) it is not built under this form (OPEN-1). Single combined reviewer gate (§21b).*

```
Authority: PLAN node source-changed-post-route-s5d-race; the human's ruling of 2026-10-16 on S5d (state/directives/2026-10-16-222-adr-022-route-a-restore-and-reappend-reset-line-p6-s5d-own-item.md:12 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD) and of 2026-10-17, item 1 (state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:10 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD), each with its RULED block in DECISIONS-PENDING.md; the machine rules (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD). Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for source changed, `No prior art recorded for "source changed". Research it before planning an implementation.` and, for race, `No prior art recorded for "race". Research it before planning an implementation.`, each with exit code 1; two misses, noted, not blocking.
Scope: this form (frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md); step 1's record (state/consults/<date by date -u +%F>-source-changed-post-route-s5d-race-step-1-custodian-runs.md, new); PLAN.yaml (this node's record); 3 files; 0 changed lines of non-generated code or tests. The load script and every run's output stay in the custodian's scratch folder and in e2e/out (gitignored), and are never committed.
Change: no tracked code changes; the custodian runs frontends/shell/e2e/source-changed.mjs, unedited, on its post route at the piece's base, 16 times, alternately alone and under this project's own load (§1); records each run's stamps and log lines, byte-copied by script; places every run in §1.5's classes; and names the one outcome §1.6 gives, which decides §2's next step.
Tests+mutation: none added or changed: S5d (frontends/shell/e2e/source-changed.mjs:1246-1283 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD) runs as it stands, so no mutation is owed; the reviewer recomputes the record's hashes, checks each row's class against its byte-copied lines and §1.5's rules, and checks that the outcome named is the one §1.6's order gives.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, engine/ or kernel/, no product code, no test, assertion or string the app shows; S5d's assertion runs unchanged, and any change to it belongs to OPEN-1's route, never to this form.
```

## §0. The code as read

- F1. On the post route the driver touches the scratch copy's mtime, and changes no byte, the instant it sees the first new `stream-issued` entry. It sets the mtime to its own clock plus 120 000 ms: frontends/shell/e2e/source-changed.mjs:546-551 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD. The touch instant is therefore the copy's mtime less 120 000 ms. It is read after the run and before the next run copies the fixture over the copy (frontends/shell/e2e/source-changed.mjs:594 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).
- F2. S5d fails on any `tile-stream-mint-refused` line after its baseline, of any code. It fails first if no `tile-session-ended-source-changed` line appears: frontends/shell/e2e/source-changed.mjs:1258-1279 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD. Its pass note names the terminal (post-check) route: frontends/shell/e2e/source-changed.mjs:1280-1281 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F3. The header note declares the route's limit: frontends/shell/e2e/source-changed.mjs:177-186 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F4. Each session-log line is `<unix-ms> <level> <message>`, stamped by the host when it appends: frontends/shell/src-tauri/src/state.rs:47-56 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F5. On the pre-check's route into the tile manager, the refusal is logged before the session is ended, in the same catch: frontends/shell/src/streaming/tileViewportStreamManager.ts:944 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD and frontends/shell/src/streaming/tileViewportStreamManager.ts:955-957 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD. The end logs `tile-session-ended-source-changed` once, behind a latch: frontends/shell/src/streaming/tileViewportStreamManager.ts:736-743 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F6. Every kernel route that ends a generation goes through one emission point. It sends `dataset_session_ended` before it cancels the generation's tickets: kernel/src/skp.rs:914-926 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD. Its three callers:
  - the pre-check, on the refusal that detects the change: kernel/src/skp.rs:1449-1455 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD;
  - the post-check: kernel/src/lib.rs:623-624 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD;
  - the watcher's sink: kernel/src/skp.rs:1161-1168 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F7. In the tiled arm the shell's event listener reaches the tile manager's end. The detail it passes names the advisory watcher for every observed-change end, whichever kernel route made it:
  - frontends/shell/src/App.tsx:1369-1375 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD;
  - frontends/shell/src/App.tsx:1588-1589 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD;
  - frontends/shell/src/App.tsx:750-769 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD;
  - frontends/shell/src/App.tsx:729-732 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD;
  - frontends/shell/src/streaming/tileViewportStreamManager.ts:763-765 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.

  So the session-ended line, and the status message built from the same detail (frontends/shell/src/App.tsx:697 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD), tell which way into the shell came first. They do not tell which kernel route ended the generation.
- F8. A refusal that only reports an already-ended generation carries one of two fixed details: kernel/src/skp.rs:1619-1624 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD (the live-generation check) and kernel/src/skp.rs:1501-1505 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD (the attribute arm). The refusal that detects the change carries the engine's descriptor finding instead. The pre route's recorded line shows that form: frontends/shell/e2e/source-changed.mjs:70-71 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F9. The kernel writes stderr lines at two points:
  - one when a stream's post-check found the change, after it ends the generation: kernel/src/lib.rs:609-616 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD and kernel/src/lib.rs:635-639 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD;
  - one when the watcher signals, before it ends the generation: kernel/src/skp.rs:1161-1167 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.

  The harness sends the launched app's stdout and stderr to e2e/out/app.log, opened for append: frontends/shell/e2e/lib.mjs:190-197 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F10. Each console entry in the run's report carries the driver's receive time: frontends/shell/e2e/lib.mjs:320-322 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD. The report holds S5d's evidence, the status block and the trace: frontends/shell/e2e/source-changed.mjs:1255-1265 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD, frontends/shell/e2e/source-changed.mjs:1030-1032 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD and frontends/shell/e2e/source-changed.mjs:1322-1331 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.
- F11. Each scenario needs its own fresh launch: frontends/shell/e2e/README.md:234-238 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD.

## §1. Step 1: the reproduction (the custodian's)

1.1 **Build and harness.**
- The exe is built at the piece's base B (main when step 1 starts, after engine-clause-composition-properties has merged), in a shared hold.
- While port 5180 stays excluded, the runs use the port-5400 harness on its approval's terms (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD). The record discloses it.
- Every run sets `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` and uses a fresh app launched by the run (F11), with `launched: true` read from its report. Each run is checked for the fixtures unchanged, as in run 4's record.

1.2 **Holds and load.**
- **The hold.** The series runs in one exclusive hold of the custodian's. No other project's load is in it, so every failure is seen either alone or under this project's own load, never in a shared run (state/directives/2026-10-06-machine-script-adopted.md:20 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).
- **Arm A** adds no load.
- **Arm B** runs a scratch Node script of the custodian's, never committed. It keeps 6 busy worker threads from before the run's launch until after the run's report is written, then exits. The number 6 is chosen, not derived.
- **The pin.** The spinner and the app inherit the session's pin to cores 0 to 7. The custodian records both processes' affinity once per series. If either is not 0 to 7, the series stops before its first counted run. The load acts on no process this project did not start.
- **Length.** The hold is estimated at under 30 minutes, so no booking is needed. The extension, if needed, gets its own hold.

1.3 **The runs.**
- First, one pre-flight run (arm A, not counted). It checks that the app's stderr capture (F9, or the destination the harness discloses) gains lines from that launch. If it gains none, STOP before the series: §1.6's O3 could not be read.
- Then 16 counted runs, in the order A1 B1 A2 B2 … A8 B8.
- If fewer than 3 of the 16 fail S5d, one more series of 16 runs in the same order. That is decided now, never a third series.

1.4 **Each run's row.** Lines are byte-copied by script, whole, never cut.
- the arm, the hold, the build commit, the report's file name, `launched`, and the app's PID and exe path;
- every step's verdict;
- t_touch (F1);
- the first new `stream-issued` entry in S4: its receive time and its text; and the count of such entries in S4;
- from the session log after S5d's baseline: every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`, with its stamp;
- the status block's message (F7, F10);
- from the stderr capture after the run's launch offset: each post-check line and each watcher line (F9), in order;
- the gaps, in ms:
  - the session-ended stamp less t_touch;
  - each refusal's stamp less the session-ended stamp;
  - t_touch less the `stream-issued` receive time.

The gaps join two receive points on one machine's wall clock: the host's append and the driver's receipt. They are ordering evidence for §1.5, not a measurement: no p50 or p95, no docs/08 budget, no claim about speed. The two arms are not compared. Samples of this size do not separate them, as run 4b's record says of its own (state/consults/2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md:122 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).

1.5 **Classes.**
- **For every run, the stderr reading:**
  - P: a post-check line after the run's offset.
  - W: a watcher line.
  - Without P, no stream's post-check found the change in that run (F9).
- **For each S5d failure on its refusal condition (F2):**
  - C1, consequence: every refusal is `engine.source_changed` with one of F8's two fixed details. It reports an end that another route had already made.
  - C2, a sibling's pre-check: at least one refusal is `engine.source_changed` with another detail. A sibling's own pre-check found the change, which is the limit F3 declares.
  - C3, unplaced: any other set of refusals.

1.6 **Outcomes.** The first match wins. Each carries its registered prediction.
- **O4, the route shown wrong, or a failure no class places.** Any run in which:
  - S5a, S5b or S5c fails; or
  - S5d fails on its first condition after S4 passed; or
  - a session-ended line appears with none of P, W or a C2 refusal; or
  - an S5d failure is C3.

  Predicted: not seen. S5d alone failed in each failing run of runs 4 and 4b (state/consults/2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md:103 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).
- **O3, the watcher shares the route.** Any run, passing or failing, with W and without P. That session was ended by the watcher or by a pre-check, whatever S5d reported.

  Not predicted either way. The watcher's share on this route is unobserved (PLAN node source-changed-post-reopen-routes-watcher-visible, its summary).
- **O2, the declared limit.** Any C2 run, with no O3 or O4.

  Predicted not to be the result. In all nine failing runs the refusal follows the session-ended line by 11 to 15 ms (run 4's record, line 122, pinned above). A sibling whose pre-check detects the change logs its refusal before the end, in the same task (F5), and can follow the end only when the kernel's event (F6, F7) reaches the shell first.
- **O1, the step counts a consequence.** Every failing run is C1, and every run has P.

  Predicted: O1 or O3, on the same nine runs. An outcome other than the one predicted is a recorded deviation (class 2), and this prediction is never edited.
- **O5, not reproduced.** Fewer than 3 failing runs after the extension.

  Predicted: not expected. Run 4b failed S5d in 6 of 12 runs, and run 4 in 3 of 3, the third run alone in an exclusive hold (run 4's record, lines 60 and 121: state/consults/2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md:60 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).

1.7 **Stops before results.**
- The pre-flight capture is missing.
- The affinity is not 0 to 7.
- The machine script exits 96 to 99. That is reported and the run is not attempted another way (state/directives/2026-10-06-machine-script-adopted.md:19 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).
- The build fails.

## §2. What follows each outcome

- **O1, a race in the step.** The follow-on change gets its own form under OPEN-1's route, drafted by the architect from the record.
  - **The change.** S5d fails by name on a C2 refusal, on P absent, or on no session-ended line. It records C1 refusals in its evidence as consequences. Its pass note and its comment state what it then proves.
  - **Stale cites.** The step's stale code cites point at tileViewportStreamManager.ts lines and names that have since moved (F5): frontends/shell/e2e/source-changed.mjs:166-170 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD and frontends/shell/e2e/source-changed.mjs:1239-1244 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD. They are class-3 fixes inside that form's Scope.
  - **Tests and mutations, declared now.**
    - The classification becomes a pure function in the e2e folder.
    - A node test runs it over lines byte-copied from step 1's record, which is the real shape: one C1 run, one C2 run, and one real capture with its P line removed.
    - M1: F8's detail check removed. The C1 case fails by name.
    - M2: the P condition removed. The P-absent case fails by name.
    - Then the post route runs 8 times alone at the follow-on's head. A C1 run passes S5d; a C2 run fails it by name.
- **O2, a race in the step, at the driver's declared limit.** STOP to the human with the rows. The remedy changes what a run can prove, so the architect drafts the follow-on with two options:
  - (a) S5d reports a C2 run as inconclusive, never a pass, in the shape of the human's 2026-10-17 item 7 for a TTL expiry (state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:25 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD). Its mutation: the inconclusive branch counted as a pass, which fails the C2 case by name.
  - (b) S4's gesture narrowed, so that one tile is planned and no sibling mint exists.
- **O3.** STOP to the human. The post route's S5d cannot confirm the post-check route while its touch is one the watcher sees. This node and source-changed-post-reopen-routes-watcher-visible therefore cannot be kept apart, and the human orders or joins them. S5d's pass note on main (F2) states a route that such a run did not show.
- **O4.** STOP to the human with the rows. No test-side change is made under this node, and the human grades.
- **O5.** STOP. The rows are recorded, and the human grades.

Whatever the outcome, this form's closing record is references and hashes only (the record cap), and the node's summary names the outcome.

## §3. Overlap (rule 00)

- **Step 1** edits no tracked path but this form, its record and PLAN.yaml, and nothing under protocol/. It shares no path with cut/search-ignore-historical (a root `.ignore` and an AUTONOMY.md append), cut/engine-clause-composition-properties (engine tests) or cut/known-limitations-item-44 (KNOWN-LIMITATIONS.md), nor with any PR awaiting merge then. Its exclusive hold keeps the other slots' heavy runs off the machine for its length. The custodian places it between their heavy runs.
- **shell-migration-milestone-3** adds e2e/command-bar.mjs and edits e2e/README.md. It edits no existing suite (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:316-318 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).
  - Step 1 shares no path with it.
  - Its sweeps run this route and read a failure of S5d alone as this node (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:764 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:HASH-TBD).
  - A follow-on that edits source-changed.mjs shares no path with it either, but it changes what those sweeps read. Its PR body says so, and it leaves e2e/README.md alone while milestone 3 is open.
- **source-changed-post-reopen-routes-watcher-visible** is proposed, not placed. It works on the same driver and owns the route's touch (S4's on the post route, R4's on the reopen route) and Part N's N6 and N8. This node changes none of them. O3 is where the two meet.

## §4. Gates

- Proportional gates (state/directives/2026-10-05-product-first-direction.md, section 2).
- One reviewer gate on the record (§21b). It blocks only on Correctness or Evidence. A documentation finding must be fixed before the merge.
- The reviewer recomputes every hash.
- Under OPEN-1 (B): reviewer and architect, from dispatch.

## §5. OPEN items

- **OPEN-1 (the human's): the route.**
  - (A) As drafted. Step 1 alone goes on this five-line form. Whichever change §2 names afterwards takes its own form, full from dispatch where it changes what S5d asserts (§21a; round 25, item 2 (e)).
  - (B) One full form now (docs/PREREGISTRATION-TEMPLATE.md). Step 1 is its first section, and §2's changes are declared ahead for each outcome. Reviewer and architect from dispatch.
  - The architect recommends (A). The O1 change fits §21c's size (about 100 to 150 lines over 3 files) but not its category, and its shape depends on step 1.

### Amendments

*(Opens empty; append-only.)*
````

## 3. Clause check: each sentence the form states as a fact of the code

- **F1.** `touchOnFirstNewStreamIssued` sets `later = new Date(Date.now() + 120_000)` and then calls `utimesSync(scratchPath, later, later)` (548-551). The post route calls it only in S4 (972, and 986 on the zoom rung only when the pan gave no result). `copyFileSync(FIXTURE_100K, SCRATCH_COPY)` is at 594. Holds.
- **F2.** The two filters are at 1258-1259. The first throw is on `sessionEnded.length === 0` (1266-1271). The second is on `mintRefused.length > 0`, and the regex has no code filter (1272-1279). The pass text is at 1280-1281. Holds.
- **F3.** Lines 177-186 hold the WHAT THIS DOES NOT GUARANTEE paragraph. Holds.
- **F4.** `append` formats `{ms} {level} {message}` from `SystemTime::now()` (state.rs:50-56), and `binding_log_session_event` calls it (commands.rs:184-186). Holds.
- **F5.** `logMintRefused(tileKey, err)` is at 944, and `if (isSessionEndedRefusal(err)) { this.endSession(...)` follows at 955-957. Both are in one catch, in one task. `endSession` latches at 736-737 and logs at 743. Holds.
- **F6.** `end_generation` runs record, then enqueue (the `try_send` of the event), then cancel (914-926). The pre-check calls `self.end_generation` on `SourceChanged` (1451-1452), which goes through `SkpHost::end_generation` to the invalidator (1533-1538). The post-check calls `invalidator.end_generation` (lib.rs:623-624). The watcher's sink calls it at skp.rs:1168. Holds.
- **F7.** The tiled arm sets `managerRef.current = null` and `candidateManagerRef.current = session.manager` (App.tsx:1588-1589). The listener goes through `routeDatasetSessionEndedEvent` to `endSessionForReason` and then `dispatchSessionEndedToOwner`. With baseline null, that calls `candidate.notifySessionEnded(detail)` (760-766), whose detail comes from `buildSessionEndedOwnerDetail`. That function maps `observed-change` to the watcher-naming placeholder (729-732), and `EndReason` comes from `end_reason_of(report.reason)`, which is `ObservedChange` for all three routes (skp.rs:66, lib.rs:624, skp.rs:1537). `notifySessionEnded` calls `endSession` (763-765). `handleSessionEnded` sets `formatTerminalRefusal(detail)` (App.tsx:697), which splits off the `engine.` code and keeps the rest as the message (formatTerminalRefusal.ts:33-45). Holds.
- **F8.** `require_live`'s `ObservedChange` arm has its fixed detail (1620-1624), and the attribute arm has its own (1501-1505). The descriptor-detected form `{"detail":"{mtime}"}` comes from the pre route's recorded observation (source-changed.mjs:70-71). That line is a record of a run, so F8's last clause says the record shows the form and does not claim it as code. Holds as worded.
- **F9.** `end_session_if_source_changed` returns early if this source has already ended or has no source-changed finding (609-616). It calls `end_generation` and then `eprintln!` (623-639). `invalidator` is `Some` for viewport-query sources (skp.rs:1470). The watcher's `eprintln!` runs before its `end_generation`, unconditionally on the signal (1161-1168). `attachOrLaunch` opens app.log with `"a"` and passes it as stdout and stderr (lib.mjs:190-197).
  - Limit: under the port-5400 harness's npx shim, I did not verify where stderr goes. §1.3's pre-flight check exists for that reason.
- **F10.** `onConsole` pushes `at: Date.now()` (lib.mjs:321). The report writes `observation`, `renderTrace` and `allConsoleEntries` (source-changed.mjs:1322-1331). `postCheckLogEvidence` is at 1260-1265, and `observation.status` at 1031-1032. Holds.
- **F11.** README 234-238 says each scenario needs its own fresh launch. Holds.
- **§2, the stale cites.**
  - The header (166-170) names `:1096`, `:1093` and `:1094-1095`. The tree has `startStream` at 1096, `traceStreamIssued` at 1099 and the comment at 1097-1098.
  - The S5d comment (1239-1244) names `isSourceChangedRefusal` at `:952-954`, `isSourceChangedTerminal` at `:1081-1083` and the latch at `:733`. The tree has `isSessionEndedRefusal` at 955-957, `isSessionEndedTerminal` at 1084-1086 and the latch at 736.
  - The cite `:273-280` still resolves.
  - Holds: the lines and names have moved.
- **§1.6 O3's inference** (no P means no post-check ended the session) rests on F9. The post-check's line prints after every `end_generation` call it makes, including a no-op one, so its absence excludes the post-check. W's presence alone does not show that the watcher came first, which is why O3 requires W and no P. Holds.

Every sentence above is the architect's, none is the human's. Under item 2(d) of the 2026-10-11 directive, the worker applies these words with no re-gate.

## 4. OPEN items

- **OPEN-1, the route.**
  - (A) As drafted: the five-line form covers step 1 only, and each follow-on change gets its own form, full where it changes S5d's assertion.
  - (B) One full form now.
  - The architect recommends (A). The reasons are in §1 above.

**Not OPEN in this form, but for the human's attention.**
- **The event route's placeholder sentence** (App.tsx:729-732). It reaches the operator's status message (App.tsx:697) and names the advisory watcher for every observed-change end. When the event reaches the shell before the terminal or the refusal does, it says the watcher ended a session that the post-check or the pre-check ended. It is a string the app shows, so it falls under P6. It belongs on the custodian's P6 sight list.
- **S5d's pass note on main** (source-changed.mjs:1280-1281). It claims the post-check route on evidence that does not exclude the event route. That is an Evidence finding on main. Step 1's O3 tests it, and O1's follow-on corrects it.

## 5. Files read (all at c5f86b2033537c4e8af58a9048709cc9c88c2cef in C:\dev\spatial-ide)

- C:\dev\spatial-ide\state\directives\2026-10-16-222-adr-022-route-a-restore-and-reappend-reset-line-p6-s5d-own-item.md
- C:\dev\spatial-ide\state\directives\2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md
- C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md
- C:\dev\spatial-ide\state\directives\2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md
- C:\dev\spatial-ide\PLAN.yaml (nodes source-changed-post-route-s5d-race, source-changed-post-reopen-routes-watcher-visible, engine-clause-composition-properties, governance-search-ignore-historical, connection-reuse-recycled-interrupt-flake)
- C:\dev\spatial-ide\state\consults\2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md
- C:\dev\spatial-ide\state\consults\2026-10-16-shell-migration-milestone-3-e2e-custodian-base-run.md
- C:\dev\spatial-ide\frontends\shell\e2e\source-changed.mjs (1-1339)
- C:\dev\spatial-ide\frontends\shell\e2e\lib.mjs (140-347)
- C:\dev\spatial-ide\frontends\shell\e2e\README.md (225-274)
- C:\dev\spatial-ide\frontends\shell\src\streaming\tileViewportStreamManager.ts (260-339, 720-779, 880-1110)
- C:\dev\spatial-ide\frontends\shell\src\streaming\liveTicketSet.ts (58-117)
- C:\dev\spatial-ide\frontends\shell\src\streaming\formatTerminalRefusal.ts (33-45)
- C:\dev\spatial-ide\frontends\shell\src\diagnostics\log.ts (20-31)
- C:\dev\spatial-ide\frontends\shell\src\diagnostics\renderTrace.ts (trace function signatures)
- C:\dev\spatial-ide\frontends\shell\src\App.tsx (660-802, 1330-1399, manager-ref assignments)
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\state.rs
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\commands.rs (170-194)
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\lib.rs (285-324)
- C:\dev\spatial-ide\kernel\src\skp.rs (870-1009, 1120-1179, 1425-1549, 1610-1633)
- C:\dev\spatial-ide\kernel\src\lib.rs (600-640)
- C:\dev\spatial-ide\engine\src\watch.rs (module header and item list)
- C:\dev\spatial-ide\AUTONOMY.md (§21 to §21d, §25, §31)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (100-178)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (300-329, 470-509, 750-774)
- C:\dev\spatial-ide\frontends\shell\E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md (1-40), the precedent for taking the full form
- C:\dev\spatial-ide\frontends\shell\PUBLISH-PANEL-RS-REGEX-LAYOUT-PREREGISTRATION.md and C:\dev\spatial-ide\frontends\shell\E2E-README-STATUS-BAR-STEPS-PREREGISTRATION.md, five-line precedents
