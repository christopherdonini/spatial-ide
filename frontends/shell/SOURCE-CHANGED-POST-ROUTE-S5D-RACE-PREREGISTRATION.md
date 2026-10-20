# source-changed.mjs's post route, S5d: the race reproduced alone and under load, with timing, and each failure placed — five-line short form (`AUTONOMY.md` §21d)

*Committed before step 1 runs. Append-only once committed; an amendment written after any run of step 1 has been seen says so in its first line. PLAN node source-changed-post-route-s5d-race, at the tail of slot 2 after engine-clause-composition-properties. Drafted by the architect at main c5f86b2033537c4e8af58a9048709cc9c88c2cef. Every pin below is historical: for step 1's runs the tree at its base is authoritative, and for what this form read, the pin is. This short form carries step 1 only, which changes no tracked code or test. A change to what S5d asserts touches a property currently under test (§21a), so by round 25, item 2 (e) it is not built under this form (OPEN-1). Single combined reviewer gate (§21b).*

```
Authority: PLAN node source-changed-post-route-s5d-race; the human's ruling of 2026-10-16 on S5d (state/directives/2026-10-16-222-adr-022-route-a-restore-and-reappend-reset-line-p6-s5d-own-item.md:12 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:0c76defc198618cebfacc6e7a802724796df1b61f23319c9b630bd6eed834011) and of 2026-10-17, item 1 (state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:10 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:e4d340da46fa10c6ad5212c017c6a8da4d9712fccc4222bc366abd3bfd52cb8f), each with its RULED block in DECISIONS-PENDING.md; the machine rules (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1). Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for source changed, `No prior art recorded for "source changed". Research it before planning an implementation.` and, for race, `No prior art recorded for "race". Research it before planning an implementation.`, each with exit code 1; two misses, noted, not blocking.
Scope: this form (frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md); step 1's record (state/consults/<date by date -u +%F>-source-changed-post-route-s5d-race-step-1-custodian-runs.md, new); PLAN.yaml (this node's record); 3 files; 0 changed lines of non-generated code or tests. The load script and every run's output stay in the custodian's scratch folder and in e2e/out (gitignored), and are never committed.
Change: no tracked code changes; the custodian runs frontends/shell/e2e/source-changed.mjs, unedited, on its post route at the piece's base, 16 times, alternately alone and under this project's own load (§1); records each run's stamps and log lines, byte-copied by script; places every run in §1.5's classes; and names the one outcome §1.6 gives, which decides §2's next step.
Tests+mutation: none added or changed: S5d (frontends/shell/e2e/source-changed.mjs:1246-1283 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:d4a12d0682553dc672c5507b9335c5208836cd202ad11f66b66f291c3d5a96ba) runs as it stands, so no mutation is owed; the reviewer recomputes the record's hashes, checks each row's class against its byte-copied lines and §1.5's rules, and checks that the outcome named is the one §1.6's order gives.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, engine/ or kernel/, no product code, no test, assertion or string the app shows; S5d's assertion runs unchanged, and any change to it belongs to OPEN-1's route, never to this form.
```

## §0. The code as read

- F1. On the post route the driver touches the scratch copy's mtime, and changes no byte, the instant it sees the first new `stream-issued` entry. It sets the mtime to its own clock plus 120 000 ms: frontends/shell/e2e/source-changed.mjs:546-551 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:3819a7617dd34941242c19aff4705d0e694f855822acc480301934cb855ce219. The touch instant is therefore the copy's mtime less 120 000 ms. It is read after the run and before the next run copies the fixture over the copy (frontends/shell/e2e/source-changed.mjs:594 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:eb736c588760b597f0f96b71943c5b5cd63f482dca35fd1bc843412b209d86a4).
- F2. S5d fails on any `tile-stream-mint-refused` line after its baseline, of any code. It fails first if no `tile-session-ended-source-changed` line appears: frontends/shell/e2e/source-changed.mjs:1258-1279 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:bfbd54b64f66552743c13943382175eca089445b895ac49eb056a04d1105eab7. Its pass note names the terminal (post-check) route: frontends/shell/e2e/source-changed.mjs:1280-1281 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:ef8ad66c0ac2aa579e546933c98bdcfb75edc6e4b9a3f03f4cfaf97730291101.
- F3. The header note declares the route's limit: frontends/shell/e2e/source-changed.mjs:177-186 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:79716fa3e6506fc9109ee8e3f6360ef597b04658c9de84a92af372a3a1dc0baa.
- F4. Each session-log line is `<unix-ms> <level> <message>`, stamped by the host when it appends: frontends/shell/src-tauri/src/state.rs:47-56 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:5df8f7938692081ad7130af75e3a44463c081add50d541d2cd13b930af1e149b.
- F5. On the pre-check's route into the tile manager, the refusal is logged before the session is ended, in the same catch: frontends/shell/src/streaming/tileViewportStreamManager.ts:944 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:ca06d866c1a21e3be7cda4e52c09c907258c1e16d24b60bf79ffe9e7b6fe8285 and frontends/shell/src/streaming/tileViewportStreamManager.ts:955-957 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:22de1df320e3cedc706ae92a38e0fa1566ab4f5017bc9d529a666dd121d79f5b. The end logs `tile-session-ended-source-changed` once, behind a latch: frontends/shell/src/streaming/tileViewportStreamManager.ts:736-743 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:e04a6b3f7d1b4a6e907ca5476842bbb68814606e247e2a8217ae23a03ddc75f3.
- F6. Every kernel route that ends a generation goes through one emission point. It sends `dataset_session_ended` before it cancels the generation's tickets: kernel/src/skp.rs:914-926 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:c6f9be8cf603fa8dc178181c2348e084f75790f2ebd54fc3bd7d33448fc41b11. Its three callers:
  - the pre-check, on the refusal that detects the change: kernel/src/skp.rs:1449-1455 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:e9c1fc2216056c966e6e70b08bd19c9fa03f628aebda3d4d58b133c7185fe810;
  - the post-check: kernel/src/lib.rs:623-624 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:45fb01bef7e00b0013c540076c1b80fa10d04e6c8eaea837d59bce86f198b88d;
  - the watcher's sink: kernel/src/skp.rs:1161-1168 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:e3ae20f96dffe1206ab2c540b1324f2394f27306d91a21fa11af0efcd88f637a.
- F7. In the tiled arm the shell's event listener reaches the tile manager's end. The detail it passes names the advisory watcher for every observed-change end, whichever kernel route made it:
  - frontends/shell/src/App.tsx:1369-1375 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:381061fa43a65c3bcb8c67bb19c6be4d99b3d69c899b61b7cfcf5813c39d4342;
  - frontends/shell/src/App.tsx:1588-1589 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:af52f1a4bffa172998b98f9830d9e5def0be56c45311e3bfe9e69e1de390d312;
  - frontends/shell/src/App.tsx:750-769 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:02ee2a656d80e43b011dc53bc497b8b6ff4ad836e4345aa140987f1fe164fc5a;
  - frontends/shell/src/App.tsx:729-732 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:9d31ee575b2fcf26364a90bacce043989897940837d167bb8dbec7ed171e1185;
  - frontends/shell/src/streaming/tileViewportStreamManager.ts:763-765 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:c96744add11f272ff9384287e754acccb2a65649fb8516400534225ad8a285ae.

  So the session-ended line, and the status message built from the same detail (frontends/shell/src/App.tsx:697 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:239c627e27cb585402ec4dc6e8d9a8c0c26d9a188e9bf143a876e83081451418), tell which way into the shell came first. They do not tell which kernel route ended the generation.
- F8. A refusal that only reports an already-ended generation carries one of two fixed details: kernel/src/skp.rs:1619-1624 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:6d29289bcca58605cd44d12c2b871c049f923f5a467ea5672a65b4638bb7e158 (the live-generation check) and kernel/src/skp.rs:1501-1505 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:9c1e1ce63923fcd9cac3c20b6b6b9e5f29fdfa6528895b0fa781f8a216386dbc (the attribute arm). The refusal that detects the change carries the engine's descriptor finding instead. The pre route's recorded line shows that form: frontends/shell/e2e/source-changed.mjs:70-71 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:e299115ff886cb9fea13a394fe859dd2251b4ca523d7d33b07fe1787dc32974d.
- F9. The kernel writes stderr lines at two points:
  - one when a stream's post-check found the change, after it ends the generation: kernel/src/lib.rs:609-616 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:bb5dc98834e7f1ccfb558cab12daf5d3057be76db0c197abf7ce9e4f11bd7ebf and kernel/src/lib.rs:635-639 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:71c8cf0e15f6558eae79c5573770d3c622ac404625ae43e60239089894f94136;
  - one when the watcher signals, before it ends the generation: kernel/src/skp.rs:1161-1167 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:f697cbc8caf6bdee8df15afca4c16b08217bc6fd367f098b25a44d9ee0ed125c.

  The harness sends the launched app's stdout and stderr to e2e/out/app.log, opened for append: frontends/shell/e2e/lib.mjs:190-197 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:6497491ce455d2780b4b037f1b9905d51845b6a7db881f3b7f4573785c51d4b6.
- F10. Each console entry in the run's report carries the driver's receive time: frontends/shell/e2e/lib.mjs:320-322 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:12d0bfd861e5927c809884a2f743e5c9bfe004f0c781fdbc196bcdfebd4a24a9. The report holds S5d's evidence, the status block and the trace: frontends/shell/e2e/source-changed.mjs:1255-1265 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:8f20ec99fe7c6170d246c96ef5aa25c873ee6943616394fb24acb9d12fa6b982, frontends/shell/e2e/source-changed.mjs:1030-1032 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:21db49b8a5268b10ad51907721a49fd116214cf6b7eefede28bec84076863781 and frontends/shell/e2e/source-changed.mjs:1322-1331 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:ff3fe29bada31c2a93c178abb12e11be519acd66cdbad4be778d9f6421a40bc2.
- F11. Each scenario needs its own fresh launch: frontends/shell/e2e/README.md:234-238 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:caedca9829dc9a3bbc5b3a9e141394ad976f25354744f43ea1d0385c62f3710d.

## §1. Step 1: the reproduction (the custodian's)

1.1 **Build and harness.**
- The exe is built at the piece's base B (main when step 1 starts, after engine-clause-composition-properties has merged), in a shared hold.
- While port 5180 stays excluded, the runs use the port-5400 harness on its approval's terms (state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-10 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:99a0e4c3f7c9278ef1871b5222638b97b46d6a6dce7f11718f3ea54b2f48fb84). The record discloses it.
- Every run sets `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` and uses a fresh app launched by the run (F11), with `launched: true` read from its report. Each run is checked for the fixtures unchanged, as in run 4's record.

1.2 **Holds and load.**
- **The hold.** The series runs in one exclusive hold of the custodian's. No other project's load is in it, so every failure is seen either alone or under this project's own load, never in a shared run (state/directives/2026-10-06-machine-script-adopted.md:20 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:678460c8f7dfa9e08653c2371aa5c7ef6659eab4b081f4d05035a0cdee329e22).
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

The gaps join two receive points on one machine's wall clock: the host's append and the driver's receipt. They are ordering evidence for §1.5, not a measurement: no p50 or p95, no docs/08 budget, no claim about speed. The two arms are not compared. Samples of this size do not separate them, as run 4b's record says of its own (state/consults/2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md:122 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:ab9faa7172d18a5631d137e9ee7c8fd027036da7f7eb746e7aaf121d05f0d7e4).

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

  Predicted: not seen. S5d alone failed in each failing run of runs 4 and 4b (state/consults/2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md:103 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:3f5e0f0c78b9cd8ab84b6024e67463637d60afc479ae7fde64881b3258027fc3).
- **O3, the watcher shares the route.** Any run, passing or failing, with W and without P. That session was ended by the watcher or by a pre-check, whatever S5d reported.

  Not predicted either way. The watcher's share on this route is unobserved (PLAN node source-changed-post-reopen-routes-watcher-visible, its summary).
- **O2, the declared limit.** Any C2 run, with no O3 or O4.

  Predicted not to be the result. In all nine failing runs the refusal follows the session-ended line by 11 to 15 ms (run 4's record, line 122, pinned above). A sibling whose pre-check detects the change logs its refusal before the end, in the same task (F5), and can follow the end only when the kernel's event (F6, F7) reaches the shell first.
- **O1, the step counts a consequence.** Every failing run is C1, and every run has P.

  Predicted: O1 or O3, on the same nine runs. An outcome other than the one predicted is a recorded deviation (class 2), and this prediction is never edited.
- **O5, not reproduced.** Fewer than 3 failing runs after the extension.

  Predicted: not expected. Run 4b failed S5d in 6 of 12 runs, and run 4 in 3 of 3, the third run alone in an exclusive hold (run 4's record, lines 60 and 121: state/consults/2026-10-16-b2-piece-1b-recording-e2e-custodian-run-4.md:60 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:e822ff1d8a0754c667eff18a6b556465c99147966aca4a8297571d8e55df9213).

1.7 **Stops before results.**
- The pre-flight capture is missing.
- The affinity is not 0 to 7.
- The machine script exits 96 to 99. That is reported and the run is not attempted another way (state/directives/2026-10-06-machine-script-adopted.md:19 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:072d50f76964a9843534b1210c2a2bc6cb1dc566f012aad57115abc31ff6e321).
- The build fails.

## §2. What follows each outcome

- **O1, a race in the step.** The follow-on change gets its own form under OPEN-1's route, drafted by the architect from the record.
  - **The change.** S5d fails by name on a C2 refusal, on P absent, or on no session-ended line. It records C1 refusals in its evidence as consequences. Its pass note and its comment state what it then proves.
  - **Stale cites.** The step's stale code cites point at tileViewportStreamManager.ts lines and names that have since moved (F5): frontends/shell/e2e/source-changed.mjs:166-170 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:528e0e17c24f46d40ba5af3e7c4c5da23bbcec4899295141880ee0345aec1fec and frontends/shell/e2e/source-changed.mjs:1239-1244 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:e1b4244ec010e3616ba585512eacb780dc09e726db94f40d6e49d50700e28173. They are class-3 fixes inside that form's Scope.
  - **Tests and mutations, declared now.**
    - The classification becomes a pure function in the e2e folder.
    - A node test runs it over lines byte-copied from step 1's record, which is the real shape: one C1 run, one C2 run, and one real capture with its P line removed.
    - M1: F8's detail check removed. The C1 case fails by name.
    - M2: the P condition removed. The P-absent case fails by name.
    - Then the post route runs 8 times alone at the follow-on's head. A C1 run passes S5d; a C2 run fails it by name.
- **O2, a race in the step, at the driver's declared limit.** STOP to the human with the rows. The remedy changes what a run can prove, so the architect drafts the follow-on with two options:
  - (a) S5d reports a C2 run as inconclusive, never a pass, in the shape of the human's 2026-10-17 item 7 for a TTL expiry (state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:25 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:4f9c8ea88e5c559aba812808885c5191562fb53ee13ccd00f9cd52c04cd12fe1). Its mutation: the inconclusive branch counted as a pass, which fails the C2 case by name.
  - (b) S4's gesture narrowed, so that one tile is planned and no sibling mint exists.
- **O3.** STOP to the human. The post route's S5d cannot confirm the post-check route while its touch is one the watcher sees. This node and source-changed-post-reopen-routes-watcher-visible therefore cannot be kept apart, and the human orders or joins them. S5d's pass note on main (F2) states a route that such a run did not show.
- **O4.** STOP to the human with the rows. No test-side change is made under this node, and the human grades.
- **O5.** STOP. The rows are recorded, and the human grades.

Whatever the outcome, this form's closing record is references and hashes only (the record cap), and the node's summary names the outcome.

## §3. Overlap (rule 00)

- **Step 1** edits no tracked path but this form, its record and PLAN.yaml, and nothing under protocol/. It shares no path with cut/search-ignore-historical (a root `.ignore` and an AUTONOMY.md append), cut/engine-clause-composition-properties (engine tests) or cut/known-limitations-item-44 (KNOWN-LIMITATIONS.md), nor with any PR awaiting merge then. Its exclusive hold keeps the other slots' heavy runs off the machine for its length. The custodian places it between their heavy runs.
- **shell-migration-milestone-3** adds e2e/command-bar.mjs and edits e2e/README.md. It edits no existing suite (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:316-318 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:a03d41e400b12cdb909236d34a43b67cee23dec9284df8e6e4e26035f3314e3a).
  - Step 1 shares no path with it.
  - Its sweeps run this route and read a failure of S5d alone as this node (frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:764 @ c5f86b2033537c4e8af58a9048709cc9c88c2cef sha256:17eadad884087dab19a599aea1d57bffc5c3c4f6e08a604bf1841a784aae620d).
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

### Amendment 1 — the human's ruling on OPEN-1 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md`, item 5), before any run of step 1. References only.*

1. **OPEN-1 (A):** step 1 alone is on this five-line form, as drafted. A new form follows, written from what the runs show (§2).
2. **Gates:** §4's single reviewer gate on the record.
3. **The base:** B is main after engine-clause-composition-properties merged (PR #224, merge commit 46e56dc9aba8c63eff8c08fe8ddb14a4af0cee8d), or the main commit step 1 starts from, which the record names.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — written after step 1's first pre-flight run was seen: §1.2's pin corrected to the exclusive hold's grant (class 3)

*Written by the custodian after the first attempt's pre-flight run, before any counted run. References only.*

1. **What happened.** The first attempt ran at B = be6aa6203a196f553ec08f697d678dfa08a78bd4, the exe built there. Its exclusive hold was granted with all cores; the script's line for this project reads `MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:51024 also=bash.exe:34024 (commands started from now on inherit it; release when done)`. The pre-flight run (arm A, not counted) started at 2026-10-17T17:53:27Z. The app it launched read affinity 65535, so §1.7's stop fired after the pre-flight and before the spinner's reading and any counted run, and the hold was released. That run's artifacts are kept for the record. Its result is not counted.
2. **§1.2's pin, corrected (class 3).** An exclusive hold grants all of the machine's cores to the commands started inside it, as check 4 showed on 2026-10-06 (65535 inside the hold, 255 after its release). So the spinner and the app inherit the hold's grant, not the session's pin to cores 0 to 7. §1.2's check now reads: the custodian records both processes' affinity once per series, and the series stops before its first counted run if either differs from the hold's grant. The arms are unchanged. Arm B still runs 6 busy threads, as §1.2 chose them; the machine has 16 logical cores, all granted to both the spinner and the app, and the record names that count.
3. **The series runs again from its pre-flight,** in a new exclusive hold and under a new label. The first attempt's summary is kept beside it.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 3 — the human's ruling on O3: ordered, not joined (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-s5d-o3-ordered-watcher-visible-placed-unknown-attempt-open-1-2-a-flake-full-form-225-226.md`, item 1). References only.*

1. **The order:** `source-changed-post-reopen-routes-watcher-visible` is placed in this node's slot, S3, before it, and this node depends on it. That piece moves the post and reopen routes to a change the watcher cannot see, corrects S5d's pass note, and covers Part N's N6 and N8.
2. **Step 2:** when that piece has merged, the series re-runs at its merge base, by §1 with Amendment 2, and only then is S5d's race judged. Step 2's procedure, its base and anything the new route changes in §1 are written in an amendment before its first run.
3. **Step 1's record stands as filed** (`state/consults/2026-10-17-source-changed-post-route-s5d-race-step-1-custodian-runs.md`, its second version, gate-log 534).
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 4 — step 2's procedure, base and classes on the watcher-blind route (class 1; written after step 1's runs and the watcher-visible piece's runs were seen)

*Sources: this form's Amendments 2 and 3; `frontends/shell/SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md` ("WV" below: its §0.1 W8, §2.2, §2.9, §5, Amendments 3 to 6, and its Appendix R pins by R-number); its I2 consult `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-i2-architect-consult.md`; its gate 1 reports `state/consults/gates/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-architect.md` ("gate 1 architect") and `state/consults/gates/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-reviewer.md` ("gate 1 reviewer"); its round 2 runs `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md` ("round 2"); step 1's record `state/consults/2026-10-17-source-changed-post-route-s5d-race-step-1-custodian-runs.md`; the driver, kernel and engine at main d7dfb18e94fdc63e23d87530c1c8c56f4fa37023. References only. Each pin is labelled at its first use and cited by its label after that.*

1. **The base and the build (§1.1).**
   - B is the main commit step 2 starts from. The record gives its full hash.
   - **The exe** is step 1's, built at be6aa6203a196f553ec08f697d678dfa08a78bd4 (step 1's record, Setup, Base B). The record states the sha256 it read before the pre-flight, and that sha256 equals the one step 1's Setup states.
   - **The fact the record must show** is the output of `git diff --name-only be6aa6203a196f553ec08f697d678dfa08a78bd4 <B> -- Cargo.toml Cargo.lock engine protocol renderer kernel frontends/shell/src-tauri`, byte-copied with its exit code, and that output is empty. The paths are the workspace's members and root files and the shell's own crate.
   - If it lists a path, the exe is rebuilt at B in a shared hold, as §1.1 orders. The record then names the new exe and its sha256.
   - **The checkout.** The frontend is served from the e2e checkout, detached at B, and the driver runs from it. `git status --porcelain` is empty there before the pre-flight and after the last run.
   - **The frontend's own changes.** The record also lists `git diff --name-only be6aa6203a196f553ec08f697d678dfa08a78bd4 <B> -- frontends/shell/src`. Where that list is not empty, the frontend is neither step 1's nor round 2's (item 4: nothing is pooled).
   - **The harness** is §1.1's, as step 1's record disclosed it.

2. **§1.4 on the new route: t_repoint replaces t_touch.**
   - **What no longer exists.** §0 F1's touch instant has no source on this route, because b's mtime is set at layout time (WV §2.9): `frontends/shell/e2e/source-changed.mjs:285-293 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:9c0b57a3a1fd324bef775fef26e5fc51b9ce8904ba7312bdac7813897cb734d4` (D6). t_touch is not read.
   - **What the route does:**
     - When the driver sees the first new `stream-issued` entry, it writes one target line to the helper and awaits its answer: `frontends/shell/e2e/source-changed.mjs:703-710 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:0120463fdc53cb408b4f32406e2aeba8d9f1a15e5e8473bda2fa6f4c2063384b` (D1) and `frontends/shell/e2e/source-changed.mjs:393-398 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:62dc40e1e7d888d0930a3b4016978ac6487b9fee5e632997e1c8639135906f5e` (D2).
     - The helper reads the line, rewrites the junction, then writes its answer: `frontends/shell/e2e/source-changed.mjs:342 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:48c94f21ddaa2b0afcf5565fa8602792277a50100554907755de69ec728a6691` (D4).
     - S4 fails by name unless the answer is `ok` and the open path resolves inside `b`: `frontends/shell/e2e/source-changed.mjs:421-433 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:a4b38674193ba38f27241ddb0fd7ec50f3c4e126fa6a30a228e8f669630194ad` (D3) and `frontends/shell/e2e/source-changed.mjs:1143-1150 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:45fa8d9306304b2d9430beb3c6a124f065fd573c032f25094b0b63ac2b5d58c1` (D5).
     - D1, D2 and D3 print nothing. The report's `raced` field carries a count and no time (D1). So neither the request nor the answer has a stamp.
   - **t_repoint** is the junction's `ctimeMs` (WV Amendment 3 item 5).
     - It is read with `lstatSync` on the checkout's `frontends/shell/e2e/out/source-changed-link`, after the run's report is written and before the next run's layout re-creates the junction (D6).
     - By D4, the rewrite falls after the helper reads the request and before it writes the answer.
     - If t_repoint is earlier than the first new `stream-issued` receipt, it did not record the repoint, because the request is written only after that entry is seen (D1). The row then records t_repoint as unread, and the gaps that use it are not written.
   - **Each run's row, in this order:**
     1. §1.4's first bullet. Its build commit is now two: be6aa620 for the exe and B for the checkout.
     2. Every step's verdict, under the ids at B: `S3-retarget-junction` (INFO) and `S4-issue-one-query-and-retarget-on-mint`.
     3. The first new `stream-issued` entry: its receive time, its text and S4's count of such entries (§0 F10).
     4. The request, recorded as "not stamped".
     5. The answer, recorded as "not stamped", with S4's verdict and note.
     6. t_repoint.
     7. The session-log lines as §1.4 names them.
     8. The status block's message.
     9. The stderr capture's P, W and R lines (item 3), in order.
     10. The helper's exit line: `frontends/shell/e2e/source-changed.mjs:416 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:c91729d1f34fc7acd4351c901c66f3f5fe3e1b9aa1176617f681cc46a8261a29` (D7).
   - **The gaps, in ms:**
     - the session-ended stamp less t_repoint;
     - each refusal's stamp less the session-ended stamp;
     - t_repoint less the `stream-issued` receipt.
   - **What the gaps are.** §1.4's closing paragraph applies to them unchanged: they are ordering evidence for §1.5, not a measurement. There is no p50 or p95, no docs/08 budget and no claim about speed, and the arms are not compared.
     - t_repoint is the file system's stamp. It is a third point, beside the host's append (§0 F4) and the driver's receipt (§0 F10), all on one machine's wall clock. No resolution is claimed for any of the three.
     - The repoint can land some time after the trigger. That delay is neither bounded nor measured (WV Amendment 3 item 8; ADR-018's terms).

3. **§1.5 on the new route.**
   - **P and W** are read as §1.5 states (§0 F9). On this route a W line is not a class; it is the first outcome in item 4.
   - **R, the re-read detail, read on its own** (WV §2.9, H2). R is a refusal or a P line whose detail is the one both checks give when the source cannot be read at all: `engine/src/descriptor.rs:334-336 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:0f39c051236da114a752f29c03c50725a2b4a49875e9eb31223d9939263a704e` (E1) for the pre-check, and WV R53 for the post-check. A refusal that carries it is R, never C2.
   - **Classes for each S5d failure on its refusal condition (§0 F2).** Every `tile-stream-mint-refused` line after S5d's baseline is read by its code and detail alone:
     - **C1:** every refusal is `engine.source_changed` with one of §0 F8's two fixed details.
     - **C2:** at least one refusal is `engine.source_changed` with a detail that is neither F8's nor R's. That detail is the pre-check's own descriptor finding: `{mtime}` in every C2 line of step 1 and round 2.
       - The kernel runs that pre-check only after the live check has passed: `kernel/src/skp.rs:1436 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:8a3283c12d21190899182ea9cb8d0a1318ef878ed1df250f3a6a72eb269eb7d5` (K1), then §0 F6's pre-check pin. So a sibling's own pre-check found the change while the generation was live at that sibling's live check.
       - C2 does not show which route made the end. The end is idempotent (§0 F6).
     - **C3:** any other set of refusals.
   - **A refusal logged after the session-ended line is classed by its detail, exactly as one logged before it.**
     - The shell logs every refused mint first and unconditionally, even after the session has ended (§0 F5; gate 1 architect, section 4 (d)).
     - The line's position shows only which way into the shell came first (§0 F7). The row records the position as a gap, and the position decides nothing.
     - So round 2's six failures are each C2, with P present. Each shows the session-ended line, then one `{mtime}` refusal, with one P line counting 0 cancelled (gate 1 architect, section 4 (c)). One of them: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:130-132 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:917ef67825ef05d11ca291938e3a68ad18658b5b4b44352ea18c071a060d155e` (Rec4).
   - **Recorded beside P, not a class: the P line's count.**
     - A call that finds the generation already ended returns 0 without a report: `kernel/src/skp.rs:914-917 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:e9ce6033a6ada54b77f5f0db32acb57e8449d1f5b6fdbec8692a84ba39f850d2` (K2). So a count above 0 comes only from the post-check call that made the end. A count of 0 shows neither way.
     - In round 2, each passing run has a P line with a count above 0: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:120-121 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:a7364ceeb57d9d02a1a34b7290f4cedbbc367d623669b58e06ca48bf1f0de0d9` (Rec2) and `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:169-170 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:3f86a7c7d2263088831c4574d48f3b7064c486acbabe0a0599815986bf6a2593` (Rec3). Each failing run has one P line counting 0 (Rec4; section 4 (c)).

4. **§1.6 for step 2.**
   - **How the outcomes are read.** The first match below wins. W and R are read from each run's capture before the next run starts.
   - **Nothing is pooled.** By gate 1 architect, section 4 (b), step 2 pools no run with WV's round 1, WV's round 2 or step 1. Those runs ground the predictions below and count toward no outcome (WV §2.9).
   - **O3** does not apply to step 2.
   - **I1-late: the watcher on the route.** Any run with a W line. This is WV's I1 (WV §5) found after its merge, not O3 (WV §2.9).
     - It stops the series at that run. No outcome below is named, S5d's race is not judged, and the node goes to the human with the rows.
     - Predicted: not seen. The prediction rests on these data:
       - none of round 2's 8 post runs has a W line: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:31-38 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:4ef7e2021644663527cfe6c75a14e49ccd6837ca8c1047325de33c0f503054c7` (Rec1);
       - those captures were shown live (gate 1 architect, Checks item 1, its §4 and §5 bullet);
       - the consult's 1(c).
   - **R-late: the re-read gap on the route.** Any run with R. This is WV's I2 found after its merge.
     - WV's IN PLACE outcome rests on a reading that no Windows document states (WV Amendment 5 item 5). The consult names the detail's return as I2 again (its section 3).
     - It stops the series as I1-late does.
     - On 2026-10-19 (item 1) the human set an INCONCLUSIVE class for the fallback that was not reached. Whether such a run is INCONCLUSIVE for S5d is the human's decision. By gate 1 architect, section 4 (e), no such class is in force.
     - Predicted: not seen. The data: round 2 shows the detail in no run (WV Amendment 4 item 1), and the probe at gate 1 had no failed stat or open (gate 1 reviewer, Checks item 5).
   - **O4,** as §1.6, with two changes:
     - S4 joins its first condition: S4's answer or resolve check failing (D3, D5), an I4 answer among them.
     - W is read as above.
     - Predicted: not seen. The data: in round 2, S1 to S5c passed and no invalidator fired (WV Amendment 4 item 1), and every post run has a P line (Rec1). Step 1's outcome was O3, which O4 precedes, so none of its 30 runs with known classes matched O4 (WV R19).
   - **O2,** as §1.6. Predicted: **this is the result.** The data: each of round 2's six failures is C2 by item 3 (section 4 (c); Rec4), and step 1's B13 and B16 were C2 (WV R19).
   - **O1,** as §1.6, and it needs at least one failing run; with none, O5 applies. Predicted: not the result, on O2's data.
   - **O5,** as §1.6. Predicted: not the result. Round 2 failed S5d in 6 of 8 post runs on this route (Rec1).
   - An outcome other than O2 is a recorded deviation (class 2), and these predictions are never edited.

5. **§1.2, §1.3 and §1.7.**
   - **What stands, with Amendment 2:**
     - one exclusive hold;
     - both processes' affinity recorded once per series, and a stop before the first counted run if either differs from the hold's grant;
     - arm A with no load, and arm B with 6 busy threads;
     - one pre-flight run (arm A, not counted) whose capture must gain lines from its own launch; otherwise STOP before the series, because P, W and R could not be read;
     - 16 counted runs, A1 B1 … A8 B8;
     - one extension of 16 runs in the same order if fewer than 3 runs fail S5d, and never a third series.
   - **Two procedure additions** (step 1's record, Deviations 4 to 6):
     - The series script names each run's artifacts from its arm and run number alone, refuses to overwrite one, and is not edited between the pre-flight and the last run.
     - It reads W and R from each run's capture before the next run starts (item 4).
   - **§1.7's stops stand.** The build stop is read as item 1's check. Three stops are added:
     - the checkout is not at B, or is not clean;
     - in the pre-flight, the repoint helper does not start: `frontends/shell/e2e/source-changed.mjs:770-779 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:9f3880d981852e7614dd80d0a1fa23bf3ea972382531f59b9435dfc243732406` (D10);
     - a W or R line (item 4).

6. **§2, mapped to step 2's outcomes.**
   - **I1-late and R-late:** STOP to the human with the rows. No S5d follow-on is drafted. The human rules on WV's I1 or I2, found after its merge.
   - **O4 and O5:** as §2.
   - **O2:** as §2. That is a STOP to the human, and the architect drafts options (a) and (b). Section 4 (d) adds one thing to both options:
     - S5d's block comment states that only the first route's lines are observable: `frontends/shell/e2e/source-changed.mjs:1388-1397 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:a0f0d4a039a876e55e204e8a4d34aac6d80aa103342ef5a92d449fbde1d6892c` (D9).
     - Its refusal-failure message states that the change lost the race to a pre-check rather than landing on the post-check route: `frontends/shell/e2e/source-changed.mjs:1418-1431 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:0456296286a3be14d7a05de5a5dfa9e737642c9b721413af85e9227234b029ad` (D8).
     - A C2 run does not show either (item 3). The follow-on corrects both texts, which WV §2.2 left to it.
     - Each C2 run's P count (item 3) goes to the human with the rows. The suite cannot read it (WV §0.1 W8).
   - **O1:** as §2, with section 4 (d) applied to its declared change:
     1. The classification reads each refusal's detail, never its position against the session-ended line.
     2. Its node test takes its real shape from two records: one C1 run from step 2's record, and round 2's C2 run in Rec4, whose refusal is logged after the session-ended line. The third case is one real capture with its P line removed.
     3. A third mutation, M3: the classification is made positional, so a refusal after the session-ended line is read as a consequence whatever its detail. The C2 case must then fail by name.
     4. D8's clause and D9's comment are corrected, as under O2.
     5. The stale cites §2 names are now in the header's post-check note, `frontends/shell/e2e/source-changed.mjs:168-172 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:528e0e17c24f46d40ba5af3e7c4c5da23bbcec4899295141880ee0345aec1fec` (D11), and in D9.

7. Generation: the node's generation goes up by one.

Nothing above is edited.
