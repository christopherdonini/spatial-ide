*Custodian's filing note (2026-10-20): the architect's draft of S5d's step 2 amendment, for `source-changed-post-route-s5d-race`, under its form's Amendment 3 item 2. The run 2026-10-20T10:31:30Z to 10:40:47Z by its transcript (Read 27, Grep 7, Glob 1; no write and no shell); its one SubagentHandback call, at 10:40:46Z. Extracted by script; one final newline added if absent; nothing else changed. The custodian's checks before appending (its "For the custodian" items 1 to 3): the 18 `sha256:⟨fill⟩` hashes computed by script at d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 over whole lines, LF bytes, and each span read against its item; no `console.` or stdout or stderr write inside `repointOnFirstNewStreamIssued`, `askRepointHelper` or `repoint`, with a positive self-test (the driver holds such calls elsewhere); and the item 1 path list from be6aa620 to 93914ae4 prints two paths, `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md` and `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md`, documents only, so by item 1 the exe is rebuilt at B in a shared hold. The draft is appended as the form's Amendment 4 with those hashes filled and nothing else changed.*

---

Drafted: source-changed-post-route-s5d-race, step 2's amendment, at main d7dfb18e

```markdown
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
   - **What no longer exists.** §0 F1's touch instant has no source on this route, because b's mtime is set at layout time (WV §2.9): `frontends/shell/e2e/source-changed.mjs:285-293 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D6). t_touch is not read.
   - **What the route does:**
     - When the driver sees the first new `stream-issued` entry, it writes one target line to the helper and awaits its answer: `frontends/shell/e2e/source-changed.mjs:703-710 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D1) and `frontends/shell/e2e/source-changed.mjs:393-398 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D2).
     - The helper reads the line, rewrites the junction, then writes its answer: `frontends/shell/e2e/source-changed.mjs:342 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D4).
     - S4 fails by name unless the answer is `ok` and the open path resolves inside `b`: `frontends/shell/e2e/source-changed.mjs:421-433 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D3) and `frontends/shell/e2e/source-changed.mjs:1143-1150 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D5).
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
     10. The helper's exit line: `frontends/shell/e2e/source-changed.mjs:416 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D7).
   - **The gaps, in ms:**
     - the session-ended stamp less t_repoint;
     - each refusal's stamp less the session-ended stamp;
     - t_repoint less the `stream-issued` receipt.
   - **What the gaps are.** §1.4's closing paragraph applies to them unchanged: they are ordering evidence for §1.5, not a measurement. There is no p50 or p95, no docs/08 budget and no claim about speed, and the arms are not compared.
     - t_repoint is the file system's stamp. It is a third point, beside the host's append (§0 F4) and the driver's receipt (§0 F10), all on one machine's wall clock. No resolution is claimed for any of the three.
     - The repoint can land some time after the trigger. That delay is neither bounded nor measured (WV Amendment 3 item 8; ADR-018's terms).

3. **§1.5 on the new route.**
   - **P and W** are read as §1.5 states (§0 F9). On this route a W line is not a class; it is the first outcome in item 4.
   - **R, the re-read detail, read on its own** (WV §2.9, H2). R is a refusal or a P line whose detail is the one both checks give when the source cannot be read at all: `engine/src/descriptor.rs:334-336 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (E1) for the pre-check, and WV R53 for the post-check. A refusal that carries it is R, never C2.
   - **Classes for each S5d failure on its refusal condition (§0 F2).** Every `tile-stream-mint-refused` line after S5d's baseline is read by its code and detail alone:
     - **C1:** every refusal is `engine.source_changed` with one of §0 F8's two fixed details.
     - **C2:** at least one refusal is `engine.source_changed` with a detail that is neither F8's nor R's. That detail is the pre-check's own descriptor finding: `{mtime}` in every C2 line of step 1 and round 2.
       - The kernel runs that pre-check only after the live check has passed: `kernel/src/skp.rs:1436 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (K1), then §0 F6's pre-check pin. So a sibling's own pre-check found the change while the generation was live at that sibling's live check.
       - C2 does not show which route made the end. The end is idempotent (§0 F6).
     - **C3:** any other set of refusals.
   - **A refusal logged after the session-ended line is classed by its detail, exactly as one logged before it.**
     - The shell logs every refused mint first and unconditionally, even after the session has ended (§0 F5; gate 1 architect, section 4 (d)).
     - The line's position shows only which way into the shell came first (§0 F7). The row records the position as a gap, and the position decides nothing.
     - So round 2's six failures are each C2, with P present. Each shows the session-ended line, then one `{mtime}` refusal, with one P line counting 0 cancelled (gate 1 architect, section 4 (c)). One of them: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:130-132 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (Rec4).
   - **Recorded beside P, not a class: the P line's count.**
     - A call that finds the generation already ended returns 0 without a report: `kernel/src/skp.rs:914-917 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (K2). So a count above 0 comes only from the post-check call that made the end. A count of 0 shows neither way.
     - In round 2, each passing run has a P line with a count above 0: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:120-121 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (Rec2) and `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:169-170 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (Rec3). Each failing run has one P line counting 0 (Rec4; section 4 (c)).

4. **§1.6 for step 2.**
   - **How the outcomes are read.** The first match below wins. W and R are read from each run's capture before the next run starts.
   - **Nothing is pooled.** By gate 1 architect, section 4 (b), step 2 pools no run with WV's round 1, WV's round 2 or step 1. Those runs ground the predictions below and count toward no outcome (WV §2.9).
   - **O3** does not apply to step 2.
   - **I1-late: the watcher on the route.** Any run with a W line. This is WV's I1 (WV §5) found after its merge, not O3 (WV §2.9).
     - It stops the series at that run. No outcome below is named, S5d's race is not judged, and the node goes to the human with the rows.
     - Predicted: not seen. The prediction rests on these data:
       - none of round 2's 8 post runs has a W line: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md:31-38 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (Rec1);
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
     - in the pre-flight, the repoint helper does not start: `frontends/shell/e2e/source-changed.mjs:770-779 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D10);
     - a W or R line (item 4).

6. **§2, mapped to step 2's outcomes.**
   - **I1-late and R-late:** STOP to the human with the rows. No S5d follow-on is drafted. The human rules on WV's I1 or I2, found after its merge.
   - **O4 and O5:** as §2.
   - **O2:** as §2. That is a STOP to the human, and the architect drafts options (a) and (b). Section 4 (d) adds one thing to both options:
     - S5d's block comment states that only the first route's lines are observable: `frontends/shell/e2e/source-changed.mjs:1388-1397 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D9).
     - Its refusal-failure message states that the change lost the race to a pre-check rather than landing on the post-check route: `frontends/shell/e2e/source-changed.mjs:1418-1431 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D8).
     - A C2 run does not show either (item 3). The follow-on corrects both texts, which WV §2.2 left to it.
     - Each C2 run's P count (item 3) goes to the human with the rows. The suite cannot read it (WV §0.1 W8).
   - **O1:** as §2, with section 4 (d) applied to its declared change:
     1. The classification reads each refusal's detail, never its position against the session-ended line.
     2. Its node test takes its real shape from two records: one C1 run from step 2's record, and round 2's C2 run in Rec4, whose refusal is logged after the session-ended line. The third case is one real capture with its P line removed.
     3. A third mutation, M3: the classification is made positional, so a refusal after the session-ended line is read as a consequence whatever its detail. The C2 case must then fail by name.
     4. D8's clause and D9's comment are corrected, as under O2.
     5. The stale cites §2 names are now in the header's post-check note, `frontends/shell/e2e/source-changed.mjs:168-172 @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 sha256:⟨fill⟩` (D11), and in D9.

7. Generation: the node's generation goes up by one.

Nothing above is edited.
```

**For the custodian**

1. **Hashes.** I have no shell, so every `sha256:⟨fill⟩` is a placeholder; I computed none of the 18 hashes. Filling them by script is the only change the draft needs. Compute each one at d7dfb18e94fdc63e23d87530c1c8c56f4fa37023 with `git show d7dfb18e…:<path> | sed -n '<a>,<b>p' | sha256sum`, using LF bytes. Then re-read each span against what its item says. I read the working tree on main, which had only untracked files, so a span that does not match d7dfb18e's bytes means STOP.
2. **The no-print claim, by script.** Item 2 says D1, D2 and D3 print nothing. Confirm that with a script that runs a positive self-test first: no `console.` call inside `repointOnFirstNewStreamIssued`, `askRepointHelper` or `repoint`.
3. **The path list in item 1.** It is wider than your brief's fact (Rust sources and src-tauri). I added root `Cargo.toml`, `Cargo.lock`, `protocol` and `renderer`, read from `Cargo.toml`'s members and exclude. `renderer` may hold non-Rust files, and a change there would force a rebuild for nothing. Confirm the list prints nothing for be6aa620..d7dfb18e before you dispatch.
4. **Item 4 changes two of §1.6's outcomes.** O1 now needs at least one failing run; read literally, §1.6's O1 also matched a series with no failures. S4 now joins O4. The reviewer should judge both as class 1 changes made before any step 2 run.
5. **Cross-file references.**
   - WV R19 and R53 are WV's Appendix R pins at 28163cb6; R19 covers step 1's summary.
   - "section 4 (a) to (e)" and "Checks item 1 / item 5" are the gate reports' own headings.
   - Nothing cites `DECISIONS-PENDING.md`. The 2026-10-19 ruling is cited by date and item only.
6. **Self-references.** Inside this form, references are by section, amendment and item only. No bare `:line` points into this form.
7. **A record wording I did not touch (out of scope).** Round 2's "Against the form" P3 bullet and its "For S5d's step 2" bullet state that the change lost the race to a pre-check and that S5d took the post-check. Section 4 (d), and item 3 above, show that S5d does not read either. The round 2 record is frozen and this amendment does not edit it. It is noted here so the gate does not read those lines as current.
8. **The draft's heading.** I took its class 1 and its first-line words from your brief.

Files read (absolute):
- C:\dev\spatial-ide\frontends\shell\SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-10-17-source-changed-post-route-s5d-race-step-1-custodian-runs.md
- C:\dev\spatial-ide\frontends\shell\SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-10-19-source-changed-post-reopen-routes-watcher-visible-i2-architect-consult.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-architect.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-reviewer.md
- C:\dev\spatial-ide\state\consults\2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md
- C:\dev\spatial-ide\frontends\shell\e2e\source-changed.mjs, C:\dev\spatial-ide\frontends\shell\e2e\lib.mjs
- C:\dev\spatial-ide\kernel\src\skp.rs, C:\dev\spatial-ide\kernel\src\lib.rs, C:\dev\spatial-ide\engine\src\descriptor.rs, C:\dev\spatial-ide\engine\src\stream.rs
- C:\dev\spatial-ide\frontends\shell\src\streaming\tileViewportStreamManager.ts
- C:\dev\spatial-ide\docs\adr\ADR-018-what-cancellation-acknowledged-means.md
- C:\dev\spatial-ide\state\directives\2026-10-19-229-merged-rotation-230-ready-watcher-visible-i2-a-one-consult-r2-a-unknown-attempt-cause-a.md, C:\dev\spatial-ide\state\directives\2026-10-20-230-231-233-merged-232-strikes-rule-d1-a-not-i1-profile-path-redact-unknown-attempt-a.md
