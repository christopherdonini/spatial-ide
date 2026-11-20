*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 50528 bytes, sha256 dbe5dd9d3c8a2a029a2a6e27b947f5fc8cc7b31e64805f240b52351522ec8dbe, below the rule as it came, with its one final newline; calls Read 56, Grep 46, Glob 10, one errored (a Read of the form past the tool's size limit), from 2026-11-20T05:40:53Z to 2026-11-20T05:59:07Z. A draft, read only, at main 2377a2a3; nothing in it is ruled by its filing, and the advisor rules its packet, P-1 to P-14, before P4's code. The custodian checked its sums: item 2's tables (about 745, 625 and 440 for P4a, 1,810 in all, and 385 for P4b), item 3's ceilings (1,995 and 425) and item 4's rows (6,850 before P4, about 9,045 after) add up. The base form's step 2 table gives group ceilings that sum to 5,070, against its own Total of 5,170; the draft uses the Total.*

---

main @ 2377a2a3c5baa0a7f77132705468b6f52b519128. Verdict: none. This is a drafting consult, not a gate, so nothing is blocked. Its findings are design points, declared in the amendment below.

## 1. The amendment

````markdown
## Amendment 54 — the reopen's P4, the shell, declared before its code as two parts, P4a (the client, the reply's three members in the admission run, the workspace applied, the strings' places, E-REOPEN and E-CHANGED) and P4b (the second process, E-SECOND and E-CRASH-UNLOCK): basis, size and split, ceilings, the step's totals, the design, the lock after a close, tests, mutations, the suites, producers, the carried items, the strings' places, regions, stops, gates and records; files outside §2.11's and §4's lists (class 9)

*Drafted by the architect, read only, at main `2377a2a3c5baa0a7f77132705468b6f52b519128`, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is also the architect's recommendation, it says so. Rulings are cited by id and item; this form by section, amendment and item; code by path and symbol at that commit. Every figure is an estimate from what is known now, and shows its working.*

1. **Basis.**
   - P4 is the shell's part of ADV-2026-11-16-10 R1 (a). It is the client call that reaches the `open_project` binding (`frontends/shell/src-tauri/src/commands.rs`), the question and re-link UI, a second open after a close while the lock may still be held, and what the shell shows and logs of text read back from a project file.
   - It is full class, with both gates, for each part (ADV-2026-11-16-10 R1 (b); ADV-2026-11-16-06 item 2 (a): concurrency, security, seams, over 260 lines).
   - Its rules:
     - §2.8, §2.12 and §5;
     - Amendment 1 item 5 (V3, M1, M2);
     - Amendment 30 item 3 (O-9 to O-20);
     - Amendment 36 items 1 and 8;
     - Amendment 43 items 1, 9 (c), 12 and 20 (P-11);
     - Amendment 45 items 4 and 9;
     - R2 (a) to (d).
   - **Its wait** (ADV-2026-11-16-10 R1 (c)). By the continuity block of `state/CUT-STATE.md` at this main, PR B and the first-look node have merged. The worker confirms both at P4a's base. The regions are computed there by a real diff (item 14).
   - **Not P4's:** item 18.

2. **Size, from the code on main, and the split** (the architect's recommendation; packet P-1).
   - **The rates.**
     - `frontends/shell/src/project/saveProject.ts` is 113 non-blank lines, and its test is 125. The saver has one call, one picker, seven notices and one set of saved datasets.
     - `frontends/shell/e2e/project.mjs` (E-SAVE, twelve steps) is 500 lines.
     - `frontends/shell/e2e/lib.mjs` is 660 lines.
     - The reopen has three reply members, two re-calls (an answer, a re-link), a cancel rule, the workspace applied in four members, and about twenty owner places. That is about 1.5 times the saver's branches for `project/openProject.ts`.
   - **P4a, shell product, about 745 lines:**

     | File | Lines |
     |---|---|
     | `skp/types.ts` (the §12.2 types) | ~60 |
     | `skp/client.ts` (`openProject`) | ~15 |
     | `console/surfaceRegistry.ts` (the eighth class-A row, and its doc) | ~6 |
     | `project/openProject.ts`, new | ~140 |
     | `project/reopenNotices.ts`, new (the strings group) | ~80 |
     | `project/shownText.ts`, new (the bound of item 5 (j)) | ~25 |
     | `admission/admitDataset.ts` | ~15 |
     | `admission/AdmissionPanel.tsx` (the reopen arms of `runAdmitPath`, the question, the re-link prompt and the hooks) | ~150 |
     | `App.tsx` | ~110 |
     | `canvas/WorkingCanvas.tsx` (O-17) | ~35 |
     | `style/document.ts` (O-18) | ~60 |
     | `project/saveProject.ts` (O-11 and O-9) | ~20 |
     | O-19's places | ~20 |
     | `e2e-test-surface.ts` | ~8 |

   - **P4a, shell tests, about 625 lines:**

     | File | Lines |
     |---|---|
     | `skp/client.test.ts` | ~25 |
     | `project/openProject.test.ts`, new | ~170 |
     | `admission/AdmissionPanel.test.ts` | ~130 |
     | `project/reopenNotices.test.ts`, new (with the bound's cases) | ~80 |
     | the style reader's tests | ~50 |
     | the camera write's test | ~40 |
     | the workspace apply's tests | ~90 |
     | `project/saveProject.test.ts` | ~35 |
     | `console/surfaceCompleteness.test.ts` (its derived set) | ~5 |

   - **P4a, e2e, about 440 lines:** `e2e/reopen.mjs`, new, about 420, and `e2e/README.md`, about 20.
   - **P4b, e2e, about 385 lines:**
     - `e2e/lib.mjs`, about 90: a second launcher, added beside the existing ones, with no existing function edited;
     - `e2e/second-open.mjs`, new, about 280;
     - `e2e/README.md`, about 15.
   - **P4b, every other group:** 0.
   - **The split.**
     - P4a holds the whole reply in the shell, with its seam test E-REOPEN.
     - P4b holds the two-process harness and its two suites. It has no product code.
     - P4b is cut from main after P4a merges, because both edit `e2e/README.md`.
   - **P4a stays over 800 lines (about 1,810), for three reasons.**
     - (a) If the reply's three members landed apart, main would hold a reopen that dead-ends. A `question` or a `not_found` with no answer path is one case. An `opened` whose saved workspace is not applied is the other, and it drops saved state without a word (docs/01, no silent change).
     - (b) A client call without its UI has no product caller (R2 (d)). A seam lands with its end-to-end test from the real shape (the seam rule of the gate), so E-REOPEN lands with `openProject`.
     - (c) About 1,065 of its lines are tests and e2e. The product is about 745.
   - **P4b is apart** because its risk is the harness (item 6, packet P-8), not the product.

3. **Ceilings, in both numstat columns, by §2.11's groups** (for the advisor to rule). Neither §2.11 nor §7 is edited. An overrun is class 8 in the part's closing amendment. A worker that finds a ceiling too small finishes, reports the count and says so (ADV-2026-11-19-12 item 6).

   | Part | Group | Ceiling |
   |---|---|---|
   | P4a | shell product (the strings file within it, at most 90) | 820 |
   | P4a | shell tests | 690 |
   | P4a | e2e | 485 |
   | P4a | src-tauri, protocol, fixtures, literal, kernel, records | 0 |
   | P4b | e2e | 425 |
   | P4b | every other group | 0 |

   - **Totals:** P4a 1,995 lines in about 27 files; P4b 425 lines in 3 files.
   - The reviewer recounts with §2.11's command, its excludes set to this form's present path (`governance/forms/kernel/...`).

4. **The step's totals after P4.** The step's ceilings are not touched by this amendment.

   | Group | Before P4 | P4a | P4b | After P4 | Step ceiling |
   |---|---|---|---|---|---|
   | kernel product | 1,885 | 0 | 0 | 1,885 (485 over) | 1,400 |
   | kernel tests | 3,571 | 0 | 0 | 3,571 (2,271 over) | 1,300 |
   | protocol | 485 | 0 | 0 | 485 (165 over) | 320 |
   | fixtures | 632 | 0 | 0 | 632 (372 over) | 260 |
   | literal | 176 | 0 | 0 | 176 (46 over) | 130 |
   | src-tauri | 87 | 0 | 0 | 87 | 100 |
   | shell product | 0 | ~745 | 0 | ~745 (~225 over) | 520 |
   | shell tests | 0 | ~625 | 0 | ~625 (~175 over) | 450 |
   | e2e | 0 | ~440 | ~385 | ~825 (~375 over) | 450 |
   | records | 14 | 0 | 0 | 14 | 140 |
   | **All groups** | **6,850** | **~1,810** | **~385** | **~9,045 (~3,875 over)** | **5,170** |

   - **The working for Before P4.**
     - Kernel product: 1,453 (Amendment 42 item 10), 92 (Amendment 48 item 3) and 340 (Amendment 51 item 4), so 1,885.
     - Kernel tests: 2,621, 234 and 716, so 3,571.
     - Protocol: 5 and 480, so 485.
     - Those three groups total 5,941.
     - Fixtures 632 and literal 176 are P3b-2's (Amendment 51 item 4). No earlier part touched `protocol/` beyond 5 lines (Amendment 43 item 4).
     - src-tauri: 31 and 56, so 87.
     - Records: 8 (P3a-2's ADR-036) and 6, so 14.
     - The shell groups are 0 by the closings read. P3b-2's shell lines are the literal's.
   - The reviewer gives every group, and the step's files against 75, by §2.11's command over the step's range at P4a's base.

5. **The design** (each point is the custodian's declaration; the recommendations are marked).
   - **(a) The client.**
     - `openProject(folder, cancelKey, answer, relink)` (a working name) goes in `frontends/shell/src/skp/client.ts`. It goes through `call("open_project", …)`, which is the console's one capture site (`console/soleCaptureSite.test.ts`).
     - Its types go in `skp/types.ts` as §12.2 gives them. Each is a closed union:
       - the request `{skp, folder, cancel_key, answer, relink}`, with `answer` and `relink` always present;
       - the externally tagged reply `opened | question | not_found`;
       - `view`, `check` and the two lineage facts, with `refused`.
     - `console/surfaceRegistry.ts` gains `open_project` as its eighth class-A row. Its doc's count of seven moves to eight, and `console/surfaceCompleteness.test.ts`'s derived set changes with it, as that doc requires (class 9; I3 declared).
   - **(b) The run.**
     - The reopen is an admission run through `runAdmitPath` (`admission/AdmissionPanel.tsx`), with its own `admit`. That `admit` calls `openProject` and then `describe` (§2.8). So the liveness line, Cancel and the refusal UI are the existing ones.
     - `AdmissionOutcome` (`admission/admitDataset.ts`) gains `question` and `not_found`, and each ends the run (O-14).
     - The run's options for a reopen hold `answer` and `relink`.
     - The reopen-only member of the outcome is read by a new App handler beside `handleAdmitted` (O-15).
     - **A reopen never re-enters `admitDataset` or `open_dataset`.** A reopen refusal sets the form family to none, so no CRS or identity form opens: the claims are the project file's (item 5 (g)).
   - **(c) The question.**
     - `question` shows S8 with two choices, copy and same, and a third that ends the run.
     - A choice re-enters `runAdmitPath` with the answer and a fresh cancel key (O-14).
     - Nothing is held between the calls. That matches SKP-V0.md §12.3: two calls, no state between them.
   - **(d) Not found, and the re-link.**
     - `not_found` shows S11 with `file_name` through item 5 (j)'s bound, or S11's no-location variant when it is `null`.
     - Its choice opens the file picker (`binding_pick_file`, unchanged). A pick re-enters the run with `relink` and with the answer the run already gave, so an answered question is not asked again (the kernel's O5 path). A dismissed picker ends the run at the existing cancelled note.
     - The shell sends a `relink` only after a `not_found` (SKP-V0.md §12.3; Amendment 43 item 9 (c)).
   - **(e) Cancellation** (docs/01).
     - The reopen is cancellable through the existing Cancel, with its own key. It reports liveness, not progress. That is SKP-V0.md §12.3's contract, and the same as `open_dataset`'s. No progress claim is made.
     - **A `question` or a `not_found` that arrives after the user pressed Cancel for that key is dropped.** The run ends at the existing cancelled note, and no question or picker is shown. Nothing is held between calls, so nothing is lost. This is the architect's recommendation, against ADV-2026-11-20-01 item 9's first point.
     - An `opened` after a Cancel is a cancel the kernel did not see (SKP-V0.md §12.3). It is applied as any `opened` is, as the existing run applies a late admission. This is timing inside one round trip: named for the source comment, not covered (packet P-13).
   - **(f) The order at a same-window reopen** (ADV-2026-11-19-30 item 5; Amendment 49 item 4 (b), its second point; the architect's recommendation, packet P-2 (i)).
     - The order stays: the shell opens the new handle before it closes the old one (App's close effect over `selectClosable`).
     - A reopen of the project this window holds is refused as `skp.project_open_elsewhere`. The shell shows S9's own-window place when the refusal's `project` equals the identity this window holds. The shell keeps that identity from `SaveProjectResponse.project` and `opened.project`.
     - The window's open, and its unsaved edits, stay.
     - Under this order the shell cannot make two live opens of one project in one process (Amendment 36 item 9).
   - **(g) Refusals.**
     - Every reopen refusal shows in the existing refusal block, with the owner's place for its code (item 12), and no remediation form.
     - An engine refusal (`engine.*`) at a reopen also shows the owner's line R-ENG: the claims it names are the ones the project file recorded, not the user's.
     - `refusalGuidance` (`admission/formatRefusal.ts`) is not shown at a reopen for a code whose guidance names the user's own assertion. One case is `engine.crs_assertion_conflict`. The worker lists each such code at step 0.
     - This meets Amendment 45 item 4's first point and Amendment 52 item 2 (packet P-6).
     - `skp.unknown_dataset` from the reopen's own check keeps its named clause (Amendment 52 item 2). Its owner place states only that the reopen did not stand.
   - **(h) The workspace applied** (§2.8).
     - **O-16.** The filter and its clauses are set in the same synchronous turn as the admission, so the first look runs under the saved filter. App's first-look arms read `activeFilterRef.current`, and `handleAdmitted`'s reset writes it. They go through the existing reducer transitions (`workspace/viewTransitions.ts` is read only, unless I1).
     - **O-18.** The style is read back by a new reader in `style/document.ts`, the inverse of `toStyleDocument`. A Colour by match whose column the reopened data no longer offers is not applied. The rest applies, the fill takes its literal, and the O-18 place says that Colour by was not restored.
     - **O-17.** The camera write is a new optional member of `WorkingCanvasHandle`, beside `currentView` and the first look's `shownViewportBbox`. It goes through `fitToExtent`'s frame-origin path (ADR-010 rule 1: the centre is a dataset-space point at the boundary). It marks the one-shot fit done, and it does not report the viewport.
     - **V3.** It applies only when `view.state` is `applies`. Otherwise the fit runs, and S19 shows the owner's consequence, with `basis` behind it through item 5 (j)'s bound.
     - The saved view must come back through the camera write and `currentView` bit for bit (T-17; stop 7).
     - No view is reprojected (docs/01: CRS is a type).
   - **(i) The saver, told** (O-11). App tells `createProjectSaver`'s saver about the reopened dataset and its identity (`adopt`, a working name). The next save sends `folder: null` and opens no picker.
   - **(j) The bound on text from a file, in the shell** (Amendment 45 item 9's third point; ADV-2026-11-20-01 item 3; N-5; packet P-4, the architect's recommendation (i)).
     - It is one helper, `project/shownText.ts` (a working name). It replaces every control character (Unicode Cc) and every Bidi_Control format character (U+061C, U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069) with U+FFFD. Then it cuts past 1,024 UTF-16 code units, on a code-point boundary, marked with the cut mark of item 12.
     - It applies, at a reopen, to each of these when it is shown or logged:
       - an engine refusal's message and fields, whole (ADV-2026-11-20-01 item 3);
       - every refusal's message and fields;
       - `file_name`;
       - `basis`;
       - the Colour by column named in O-18's place;
       - each other field of item 12 marked as a file's or a path.
     - The kernel's bound is left as it is.
     - The console row is not changed (packet P-14).
     - The doc of `formatRefusal`, which says nothing is truncated, gains the reopen's exception, in the worker's words, read by both gates.
   - **(k) The workspace's own text** (Amendment 50 item 6; ADV-2026-11-19-32 item 10; packet P-5, the architect's recommendation (i)).
     - The filter, the clauses and the style's text members apply whole, as the reader accepted them (ADV-2026-11-19-32 item 3: a cut value would not be the one saved). The next save writes them back unchanged.
     - When any of them holds a control or Bidi_Control character, the W-TEXT place names the member or members. The text in the filter panel is the saved text.
     - No workspace text is written to the session log.
   - **(l) The session log** (Amendment 43 item 20, P-11).
     - The reopen's own refusal line is one `logSessionEvent` call, the code with the message through item 5 (j)'s bound, beside `admitDataset`'s `admission-refused` line. That line itself is not changed.
     - `binding_log_session_event` and `diagnostics/log.ts` are not changed. That region is the redaction node's (ADV-2026-11-19-35 item 1 (b)).
     - Every place the shell writes a reopen refusal's message, read at this main:
       - the refusal block (`RefusalBlock.tsx`, through `formatRefusal`);
       - the console's refusal on the class-A row (`console/recorder.ts` `resolveRefused`, the view model's `refusal`);
       - the reopen's log line;
       - the global handlers in `diagnostics/errorHandlers.ts`, for a failure that is not a typed refusal (the reopen rethrows those, as `admitDataset` does);
       - a later save's S4 (`notSavedNotice`, whole).
   - **(m) The Open project control** (O-19; packet P-11, the architect's recommendation): a control beside Open GeoParquet in `AdmissionPanel.tsx`, and a bar entry in `actionRegistry.ts`, as the save has (S1, S22).
   - **(n) The folder picker** (packet P-10, the architect's recommendation): the existing `binding_pick_project_folder`, with its S2 title. P4 changes no src-tauri line.
   - **(o) Classes** (ADR-006). The reopen's writes are the kernel's, to the machine store and, after a copy, to the folder. The shell shows no undo for a reopen and records no step for it.

6. **The lock after a close (E-SECOND)** (Amendment 47 item 10; Amendment 49 item 4 (b), its first point; the architect's recommendation).
   - **The product does not poll.** A refused reopen shows S9 and ends its run, with no liveness and no Cancel left. The user tries again.
   - S9's words promise no time, because the lock can be held after the other window's close replies. `close_dataset` hands the release to a thread of its own, and if that thread cannot start, the lock is freed only by a later close or reopen in that process (`close_dataset`'s doc).
   - **E-SECOND polls.** After app A has closed the project's open:
     - app B calls the reopen through its hook every 250 ms, for at most 40 tries (10 s);
     - each refused try must show S9's other-window place and end its run;
     - the first `opened` ends the poll;
     - the suite reports the tries and the elapsed time as evidence. They are not a measurement claim (docs/08).
   - **At the bound** the suite fails by name, with the last code. It also gives whether app A's log (`e2e/out/` of A's launch) holds the release thread's line: `close_dataset` writes that to standard error, which the launcher's log receives.
   - **Why 10 s.** The release waits only on the `saved` mutex, and the suite has no save in flight. A pass well inside the bound is expected, and nothing rests on the figure.

7. **P4a.**
   - **Where it is built:** branch `cut/b2-piece-1c-p4a`, worktree `C:/dev/wt/1c-p4a`, build folder `D:/wt-targets/1c-p4a`, and test data folder `D:/wt-data/1c-p4a`. It is cut from main after this amendment and the advisor's ruling.
   - **(a) Files.**
     - Shell product: item 2's list, in `frontends/shell/src/`. `skp/types.ts`, `skp/client.ts`, `console/surfaceRegistry.ts`, `admission/admitDataset.ts`, `canvas/WorkingCanvas.tsx`, `style/document.ts`, `project/saveProject.ts`, `actionRegistry.ts` and `e2e-test-surface.ts` join §2.11's list (class 9). So do the new files `project/reopenNotices.ts` and `project/shownText.ts`.
     - Shell tests: item 2's list.
     - E2e: `e2e/reopen.mjs`, new; `e2e/README.md`, its entry.
     - The DEV-only hooks, registered only in an instrumented build, as `e2eSaveProjectToFolder` is:
       - the reopen folder's slot, `e2eOpenProjectFolder`;
       - the re-link file's slot;
       - a read of the applied workspace: filter text, clauses, style state, and `currentView`.
       Each supplies the picker's answer once, or reads. Each runs the same product code as a click.
   - **(b) Tests and mutations.** The round-25 rule applies: apply the mutation, run the named test, record its failure by name with the commit, and revert. A `verify-mutation` run is not called an observation. Each test fails at its base by a missing symbol unless the row says otherwise.

     | Id | Test | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | T-1 | `openProject sends the eighth command through the one capture site` | the request's members, `answer` and `relink` null; the console records it as `open_project` | `invoke` called directly: red at the recorder |
     | T-2 | `reopen goes through runAdmitPath and shows liveness and Cancel` (§4) | the run's states; Cancel reaches the run's key | `admit` bypassed: red |
     | T-3 | `question re-calls with the answer` (§4) | S8's place; each choice re-calls with its answer and a fresh key; the third ends the run | the answer dropped: red at the second request |
     | T-4 | `not_found offers the re-link and the second call carries relink and the run's answer` (Amendment 43 item 9 (c)) | the first call's `relink` null; after `not_found` and a pick, `relink` and the earlier answer are sent; a dismissed pick ends at the cancelled note | (a) the answer dropped on the re-link call: red; (b) `relink` sent on the first call: red |
     | T-5 | `a question or not_found after Cancel asks nothing and ends at the cancelled note` | both cases end at the cancelled note; no S8, no S11, no picker | the cancel ignored: red at S8 |
     | T-6 | `the changed-file notice names each component` (§4) | S10 lists each of `check.observed` and `check.admission`, apart; S12 after a re-link | the components joined into one word: red |
     | T-7 | `a view saved in another space is not applied and the owner says so` (Amendment 1 item 5, V3) | no camera write; the fit runs; S19 with `basis` bounded | the view applied regardless: red |
     | T-8 | `the saved filter and clauses apply in the admission's turn, so the first look runs under them` (O-16) | the first query's filter is the saved one | the filter applied in a later effect: red at the first query |
     | T-9 | `the style document reads back; a Colour by whose column is gone keeps the rest and says so` (O-18) | the state is member for member; O-18's place names the column, bounded | the reader drops the match's cases: red |
     | T-10 | `a save after a reopen sends folder null and opens no picker` (O-11) | the request's `folder` null; no picker | `adopt` not called: red at the picker |
     | T-11 | `a reopen refusal opens no remediation form, and an engine refusal carries the owner's line` (Amendment 45 item 4) | form family none for `engine.crs_unknown` and an identity code; R-ENG's place; no user-assertion guidance | `formFamilyForCode` applied at a reopen: red |
     | T-12 | `text from a file is shown and logged through the bound` (N-5; ADV-2026-11-20-01 item 3) | for U+202E, U+0007 and a 2,000-unit path: the refusal block, each notice and the log line hold no Cc or Bidi_Control character and at most the bound and the mark | the helper returns its input: red |
     | T-13 | `workspace text with a control or format character applies whole and the owner names the member` (Amendment 50 item 6) | the filter text equals the file's; W-TEXT names `filter`; a save writes it back unchanged | the text passed through the helper: red at the round trip |
     | T-14 | `each lineage fact maps to its place and no rule text is shown` (Amendment 36 item 8; Amendment 34 item 9) | P-7's table; a refused fact shows its reason word and line alone | every fact mapped to S16: red |
     | T-15 | `surfaceCompleteness`'s derived set (edited, class 9) | `open_project` is a class-A row | the row removed: red (fails at its base by assertion) |
     | T-16 | `a through-link save shows its notice` (O-9) | O-9's place for `project_relative: through-link` | the notice removed: red (fails at its base by assertion) |
     | T-17 | `the camera write applies the saved view through the frame origin and marks the fit done` (O-17) | `currentView` after the write equals the saved centre and zoom bit for bit; no auto-fit after it; no viewport report | the origin not subtracted: red |
     | T-18 | `a refusal of the project this window holds shows the own-window place` (item 5 (f)) | S9's own-window place when the `project` field matches; the other-window place otherwise; the window's open kept | the identity not compared: red |

8. **P4b.**
   - **Where it is built:** branch `cut/b2-piece-1c-p4b`, worktree `C:/dev/wt/1c-p4b`, build folder `D:/wt-targets/1c-p4b`, and test data folder `D:/wt-data/1c-p4b`. It is cut from main after P4a merges.
   - **(a) Files:** `e2e/lib.mjs` (class 9; a new launcher, with no existing function edited); `e2e/second-open.mjs`, new; `e2e/README.md`, its entry.
   - **(b) Step 0, a probe, before any suite code** (packet P-8). Two app processes run at once with one machine store, each with its own CDP port. That needs:
     - a WebView2 data folder for each;
     - a second process that does not start a second dev server on 5180;
     - and, because the debug binary carries the overlay's CDP port (`writeConfigOverlay`'s doc), a launch whose port is not that one.
     The worker reports what works, with nothing committed. A failure is stop 9.
   - **(c) The rows:**

     | Id | Suite step | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | E-SECOND | A saves P; B reopens P; A switches to another file; B polls (item 6) | B's first try: `skp.project_open_elsewhere` and S9's other-window place, the run ended; then `opened` within the bound | `close_dataset`'s release not started (by Bash, uncommitted): red at the bound |
     | E-CRASH-UNLOCK | A reopens P; A's process tree killed; B reopens P | `opened`, within item 6's bound | none in the product: the kill replaced by a graceful stop and A's open kept (the suite's own control): red |

9. **The e2e suites** (the human's directive of 2026-11-16, item 2: the app window, on the laptop).
   - **Port.** Vite's 5180 (ruled 2026-11-09, by the continuity block). App A uses CDP 9223 (`lib.mjs`'s `CDP_PORT`). App B, in P4b, uses the port step 0 settles.
   - **Data folder.** Each suite sets `LOCALAPPDATA` to a fresh scratch store before its launch, as `e2e/project.mjs` does, and removes it at the end. Its folders are made under the OS temp folder, and the series sets that to the part's test data folder (item 7, item 8). No two workers share one (the same directive, item 2).
   - **E-REOPEN** (`e2e/reopen.mjs`; one app process; F1 in folder P with a project-relative locator; F1 in folder P2 with data outside it, machine-recorded only):
     - R1, open F1 in P;
     - R2, a filter with two clauses (one disabled), a fill colour, a camera move;
     - R3, save through the hook;
     - R4, the same-window reopen: S9's own-window place, the run ended, the open kept;
     - R5, open another file; the first handle's close is seen on the console before R6;
     - R6, reopen P: `opened`; the applied workspace equals the file's on disk, member for member; the console shows `open_project` with `answer` and `relink` null;
     - R7, a save right after: no picker slot used; the file's workspace is unchanged;
     - R8, P copied by hand to Q; reopen Q: S8; the page's same choice clicked: `opened`; the store's `folders.json` lists both;
     - R9, P2 saved, its data moved; reopen P2: S11 with the file's last name; the re-link slot: `opened`.
   - **E-CHANGED** (same file): F4, which is F1 with its mtime moved 60 s later (§3's F4 row as Amendment 52 item 1 corrects its word). The reopen gives `opened`, and S10 names `mtime` alone.
   - **E-SECOND, E-CRASH-UNLOCK:** item 8 (c).
   - **The runs.** Focused while building. The full suites run once per part, on its final candidate.
     - At P4a, every e2e suite runs, since §5 declares their outcomes unchanged and P4a changes `App.tsx`, `AdmissionPanel.tsx` and `WorkingCanvas.tsx`.
     - At P4b, the reviewer confirms by diff that no existing function of `lib.mjs` changed. If so, the series is E-SAVE, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK. Otherwise every suite runs.
     - One series report per PR (ADV-2026-11-16-06).

10. **Producers and their consumers** (R2).

    | Producer | Consumer | Seam's end-to-end test |
    |---|---|---|
    | the `open_project` binding (P3b-2) | `openProject`, through the reopen's `admit`, from the Open project control | E-REOPEN R6 to R9 (P4a) |
    | `check_inside` and `Projects::open_project` (Amendment 36 item 8) | the binding | E-REOPEN R6 |
    | the lineage reader's two facts (Amendment 36 item 8) | T-14's mapping | T-14 |
    | the camera write member, the style reader, the saver's `adopt` and the bound helper (P4a) | App's reopen handler and the reopen's places | T-17, T-9, T-10, T-12; E-REOPEN R6 and R7 |
    | `Projects::release_ended` in the shipped `close_dataset` (P3b-1) | another process's reopen | E-SECOND (P4b) |
    | `ProjectLock` (Amendment 36 item 8) | a reopen after a kill | E-CRASH-UNLOCK (P4b) |

    - The DEV hooks are test surface, registered only in an instrumented build, as `e2eSaveProjectToFolder` is.
    - Every other exported item is a gate finding (R2 (d)).
    - All of these are named in each PR body and in the node's plan summary.
    - The node is not done until each seam's test has passed on main (R2 (c)).

11. **The carried items, each met.**
    - Amendment 34 item 9 (Damaged's rule text): T-14. No rule text crosses (`lineage_refusal_of`).
    - Amendment 38 items 7 and 13 (the first save's `open.lock: ` detail): item 12, row S4-LOCK.
    - Amendment 43 item 1: items 7 and 8. Item 9 (c): T-4. Item 12: item 10. Item 20 (P-11): item 5 (l).
    - Amendment 45 item 4, its first point: item 5 (g), T-11 and packet P-6. Item 9: item 12, item 5 (j) and packet P-4.
    - Amendment 47 item 10: item 6.
    - Amendment 49 item 4 (b): item 6 and item 5 (f) (packet P-2).
    - Amendment 50 item 6: item 5 (k), T-13 and packet P-5.
    - Amendment 51 item 7, by line:
      - the two live opens: unreachable from the shell under item 5 (f), still not covered in the kernel;
      - `PathNotUnicode`: the shell sends UTF-8 strings alone;
      - a cancel after the engine's open: item 5 (e), not covered;
      - on CI's Linux, the cut of `file_name`: not covered, since the app-window suites run on Windows alone;
      - a recorded path refused other than as not found: packet P-3;
      - the N4 close: the shell cannot close a handle it has not received;
      - `opened_of`'s panic sites: S-PANIC's words claim no free lock (item 12);
      - N-1: item 5 (j).
    - Amendment 51 item 9: ADV-2026-11-19-34 item 6, in packet P-3 and item 5 (j); ADV-2026-11-20-01 item 3's bound, in item 5 (j); its item 9's first point, in item 5 (e) and T-5; Amendment 49 item 4 (b) and Amendment 50 item 6, as above.
    - Amendment 52 item 2: item 5 (g).
    - Amendment 53 item 2 (N-5): item 5 (j) and T-12.
    - The rulings: ADV-2026-11-19-30 item 5, item 5 (f); ADV-2026-11-19-32 items 3 and 10, item 5 (k); ADV-2026-11-19-35 item 1, items 5 (l) and 14; ADV-2026-11-20-03 item 3 (a), item 5 (j); ADV-2026-11-19-10 item 2, item 16; ADV-2026-11-19-12 item 6, item 3; ADV-2026-11-18-02 item 2, item 16; ADV-2026-11-16-10 R1 (b) and (c), items 1 and 14.

12. **The strings' places.** Each is an owner placeholder in `project/reopenNotices.ts`, unless the row says otherwise. Shown text carries the shell's `[P6 placeholder] ` marking. No words are drafted here. The advisor's words come in one strings ruling before P4a's code. The worker copies them byte for byte from the filed ruling, and no test asserts a place's words.

    | Id | Place | Shows | Bound |
    |---|---|---|---|
    | O-19a | Open project control, `AdmissionPanel.tsx` | idle, and opening | fixed |
    | O-19b | the bar's word, `actionRegistry.ts` (as S22) | — | fixed; typed after the slash |
    | S2 (kept) | the folder picker's title, `binding_pick_project_folder` | — | fixed; serves the save and the reopen (packet P-10) |
    | S8 | the question and its three choices | `question {kind: copy-or-same}` | fixed; no file text |
    | S9-own | refusal block | `skp.project_open_elsewhere`, the project this window holds | fixed; no time promise |
    | S9-other | refusal block | the same code, another holder; `project` | the identity (validated by the reader); no time promise (item 6) |
    | S10 | notice | `check` non-empty after a reopen without a re-link; `{components}` | closed words, listed apart |
    | S11, S11-none | notice and its choice | `not_found`; `{file_name}`, or `null` | the kernel's 262 bytes, then item 5 (j) |
    | S12 | notice | `check` non-empty after a re-link; `{components}` | closed words |
    | S16, S17 | notices | the lineage facts, by packet P-7 | closed words and a line number |
    | S19 | notice | `view` `saved-in-another-space`; `basis` behind it | the kernel's bound per identifier, then item 5 (j) |
    | S20 | refusal block | `skp.project_known_folders_full`; `project`, `count` | identity and integer |
    | S21 | refusal block | `skp.project_machine_record_refused`; `file`, `rule` | a fixed name; `rule` the kernel's 262 bytes, then item 5 (j) |
    | R-ENG | beside an `engine.*` refusal at a reopen | the engine's message and fields | item 5 (j); the message can name a path at any length (ADV-2026-11-19-34 item 6) |
    | R-CODE | one owner line per other reopen code where the consequence differs; else none | `project_file_unreadable` (OS text), `project_file_refused` (bounded `path`, `rule`), `project_machine_store_failed` (a fixed name and OS text, or the binding's fixed text), `project_target_unresolvable` (the `folder` as sent: a path, any length; or `locator` and a bounded `segment`; or no field), `project_target_through_link`, `project_target_wrong_kind`, `project_file_unwritable` (a copy's replace; its text may name the folder), `cancel_key_in_use` (the client's key), `skp.unknown_dataset` (item 5 (g)) | item 5 (j) on each message and field |
    | S-PANIC | refusal block | `skp.open_project_panicked`; the join error's text | item 5 (j); claims no free lock (ADV-2026-11-20-01 item 5) |
    | W-TEXT | notice | a workspace member holding a control or Bidi_Control character | names the member alone; shows none of its text |
    | O-18 | notice | Colour by not restored; the column | the file's text, through item 5 (j) |
    | O-9 | save notice, `saveProject.ts` | `project_relative: through-link` | fixed |
    | S4-LOCK | S4's `{message}` at a first save, `project_file_unwritable` with `open.lock: ` (Amendment 38 item 7) | the OS error, or the fixed held text | whole, as S4 is; or a place of its own if the advisor gives one |
    | CUT | the mark of item 5 (j)'s cut | — | fixed (packet P-4) |
    | (kept) | the cancelled note | a Cancel, a late `question` or `not_found`, a dismissed re-link pick | the existing text |

    - Each place states the owner's consequence and repeats no engine or kernel fact. Engine messages state engine facts; owners state consequences.
    - S8's behaviour is the human's ruling (round 70, OPEN-2), and §2.12 marks S8 as the human's words. Its words wait for the human at P6, and until then it carries a placeholder (packet P-9).

13. **Not covered, by name, with the reason.**
    - A cancel after the engine's open: the reply is `opened`, and it is applied. This is timing inside one round trip, named for the source comment.
    - A reopen whose request reaches the host before the previous handle's close: S9 shows. This is timing inside one round trip, named for the source comment.
    - The release thread failing to start: the operating system must refuse a thread. Item 6 names it at the bound.
    - The app-window suites on macOS and Linux: they run on Windows alone.
    - The console row shows a reopen refusal whole, its format characters included (packet P-14 (i)).
    - Amendment 36 item 9 in the kernel; two users' stores (P5).

14. **Regions.**
    - P4 touches no path under `protocol/`, `kernel/`, `engine/` or `frontends/shell/src-tauri/` (I7).
    - P4 does not touch `binding_log_session_event` or `diagnostics/log.ts`. That is the redaction node's region, and that node goes after P4's merge (ADV-2026-11-19-35 item 1).
    - P4a and P4b run in sequence (item 2).
    - `WorkingCanvas.tsx`'s handle holds the first look's `shownViewportBbox`. P4a's member goes beside it, as a region computed by a real diff at P4a's base.
    - Rule (00) at each dispatch holds over the pieces in progress and those awaiting merge, the e2e README's suite entries counted as paths of their own.
    - Each part takes main in before its gate (ADV-2026-11-16-06 item 4).
    - The reviewer recomputes each file list with git.

15. **Stops.** The worker stops and reports, alone, when any of these happens:
    1. A file or region outside item 7 (a) or 8 (a) is needed.
    2. Any line under `protocol/`, `kernel/`, `engine/` or `frontends/shell/src-tauri/` is needed.
    3. An existing test needs an edit other than T-15's set (I3), or a dependency or a lock file changes (I6).
    4. A declared test passes at its base (other than T-15 and T-16, which fail there by assertion), or a mutation does not turn its test red.
    5. A reopen path reaches `admitDataset`, `open_dataset` or a remediation form.
    6. A text of item 5 (j)'s list is shown or logged without the bound.
    7. The saved view does not come back bit for bit through the camera write (T-17). The worker reports the difference.
    8. A lineage fact's meaning, read at step 0 in `read_lineage` and in the save's `LineageNotKept` condition, differs from packet P-7's table.
    9. P4b's step 0 fails (packet P-8).
    10. E-SECOND or E-CRASH-UNLOCK does not pass three runs in a row within item 6's bound.
    11. Code is begun before the advisor's ruling on this packet, or a place's words are written before the strings ruling.
    12. A product export has no product caller (R2 (d)).

16. **Class, gates, pushing, lints and the model.**
    - **Class.** Full class, both gates, for each part (item 1).
    - **Pushing** (ADV-2026-11-19-10 item 2).
      - The tests' commit is its own commit, before the code.
      - It is pushed together with the code commit that makes it pass.
      - Its failure before code is shown by the worker's local run: the exit code and the failing names, at the tests' commit.
      - A stop still pushes (item 3 of the same ruling).
      - A test correction found once the code runs is committed after the product commit, and says so (ADV-2026-11-19-33 item 2 (v)).
      - A worker does not fetch, and the push's own output shows the remote head (ADV-2026-11-19-33 item 5).
    - **Lints.** The reviewer runs them at the gated head, in a hold, on the changed package, `frontends/shell`. It runs `npm ci` there and in `renderer/bundle-viewer`, then `npm run verify` whole, since the shell has no lint script of its own (as ADV-2026-11-16-15 ruled for the S1 form, followed here). No Rust package changes, so no Rust lint applies. A worker does not silence a lint on code it did not write (ADV-2026-11-19-33 item 3).
    - **The worker's model:** P4a in two briefs, one branch, in sequence. First the standard worker, for the types, the client, the registry row, the style reader, the camera member, the notices' places and E-REOPEN and E-CHANGED. Then worker-high on the strongest model (its ground: cancellation, the lock's order, and text read from a file), for `openProject`'s run, `runAdmitPath`'s reopen arms, the bound, the refusal routing and App's handler. P4b goes to the standard worker.

17. **Records.**
    - Each part's closing amendment holds references and hashes only, with the counts in both columns and a class 8 row for each overrun.
    - The PR body and the node's plan summary name item 10's producers and consumers, and item 12's places under P6, the advisor's words named as the advisor's.

18. **What P4 leaves to P5, by name.**
    - KNOWN-LIMITATIONS K-2, K-3 and K-4 (§2.12; Amendment 16 item 2), and item 62 (ADV-2026-11-19-21 item 2).
    - ADV-2026-11-20-01 item 9's second point, two users' stores.
    - ADV-2026-11-20-03 item 1, section 12's sentence on the machine.
    - §9's operator Part, P0 and OP1 to OP6, as §9 orders it after the step's code.
    - Not P5's but after P4: the redaction node (ADV-2026-11-19-35 item 1). P4 declares no src-tauri path. The `opened_of` node (ADV-2026-11-20-01 item 5). The `folder` check (Amendment 53 item 2).

19. **Superseded index.**
    - §2.11's step-2 shell list gains item 7 (a)'s files, and its e2e list gains `e2e/reopen.mjs`, `e2e/second-open.mjs` and `e2e/lib.mjs` (class 9).
    - §4's step-2 tables gain T-1 to T-18 and E-REOPEN's steps (class 9).
    - §4's E-SECOND row, two app processes: contingent on packet P-8.
    - §2.12 gains item 12's places O-19a, O-19b, S9-own, S9-other, S11-none, R-ENG, R-CODE, S-PANIC, W-TEXT, S4-LOCK and CUT.
    - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.
````

## 2. The packet for the advisor

**The ceilings and the step's totals.**

| Part | Group | Ceiling |
|---|---|---|
| P4a | shell product (the strings file within it, at most 90) | 820 |
| P4a | shell tests | 690 |
| P4a | e2e | 485 |
| P4a | every other group | 0 |
| P4b | e2e | 425 |
| P4b | every other group | 0 |

- After P4, the step stands at about:
  - shell product 745 of 520;
  - shell tests 625 of 450;
  - e2e 825 of 450;
  - every group 9,045 of 5,170 (about 3,875 over).
- Before P4, every group stands at 6,850, and the three named groups at 5,941 (that figure is confirmed).
- src-tauri stays at 87 of 100. Records stay at 14 of 140, before P5.
- The working is in amendment items 2 and 4.

**The strings' places.** These are amendment item 12, each with its place, what it shows and its bound. They come to you as O-9, O-18 and O-19 (ADV-2026-11-16-10 item 5), with the others. Words are needed for every row except S2 (kept), S8 and the cancelled note.

**Carried items that need a ruling.**

- **P-1, the split.**
  - (i) P4a and P4b, as in amendment item 2.
  - (ii) One part of about 2,195 lines.
  - (iii) P4a split again, with the question and re-link UI moved to a later part.
  - I recommend (i). Option (iii) would leave a shipped reopen on main whose `question` and `not_found` dead-end, and code that a later part replaces.
- **P-2, the order at a same-window reopen** (ADV-2026-11-19-30 item 5).
  - (i) Keep the order, and show S9's own-window place.
  - (ii) Close the window's open first.
  - I recommend (i). Under (ii), a reopen that then fails (`not_found` then a dismissed pick, a refusal, a Cancel) leaves the window empty, and its unsaved edits gone. The shell has no unsaved-changes guard, and P4 adds none.
- **P-3, a re-link after a refusal at the recorded path** (ADV-2026-11-19-34 item 6). This covers an `engine.*` refusal at the recorded path, and also the resolver's `project_target_unresolvable` for data inside the folder that has gone missing: that is not `not_found`, so as built no re-link is offered.
  - (i) No re-link offer. The refusal shows, bounded.
  - (ii) Offer the re-link after those codes too.
  - I recommend (i) for P4. SKP-V0.md §12.3 says a client sends a `relink` after `not_found`, and widening that is a contract change for P5's words or a node.
- **P-4, the shell's bound** (Amendment 45 item 9; ADV-2026-11-20-01 item 3; N-5).
  - (i) One helper. It replaces Cc and Bidi_Control characters, cuts past 1,024 UTF-16 code units with a mark, and applies at a reopen to every shown or logged text of amendment item 5 (j).
  - (ii) Replace only, with no cut.
  - (iii) Nothing.
  - I recommend (i). The figure 1,024 is mine and rests on nothing measured. The mark: I recommend the kernel's own for one meaning, which is a string for you.
- **P-5, the workspace's own text** (Amendment 50 item 6; ADV-2026-11-19-32 item 10).
  - (i) Apply it whole, with W-TEXT naming the member.
  - (ii) Hold the filter until the user confirms it.
  - (iii) Apply it whole, with no notice.
  - I recommend (i). A cut or replaced value would not be the one saved, and the next save writes it back.
- **P-6, the clause on the caller's assertion** (Amendment 45 item 4; Amendment 52 item 2).
  - (i) R-ENG on every `engine.*` refusal at a reopen, with guidance that names the user's assertion not shown.
  - (ii) R-ENG on the CRS and identity codes alone.
  - I recommend (i). Every claim at a reopen is the project file's.
- **P-7, the lineage facts' places** (S16, S17). This was not settled by reading. My reading:
  - S16 for `not-the-recorded-one`, of either file;
  - S17 for `recorded` and `recorded-with-lines-after` where the save would refuse with `LineageNotKept`, and for any `refused`;
  - no place for `absent`, `not-read`, `used` or `null`.
  - I recommend this table, with stop 8 to check it at step 0.
- **P-8, E-SECOND's harness.**
  - (i) Two app processes, after step 0's probe.
  - (ii) The measure exe as app B.
  - (iii) App A, with a kernel rig process as the other holder.
  - I recommend (i), with stop 9 sending (iii) to you. Option (iii) changes §4's row, and OP5 keeps the two-window UI for the operator.
- **P-9, S8.** §2.12's heading says none of its strings is the human's, and its S8 line says S8 is the human's words (round 70, OPEN-2).
  - (i) A placeholder of yours until the human's words at P6.
  - (ii) No placeholder: S8 waits for the human.
  - I recommend (i), so that the question exists end to end.
- **P-10, the folder picker.**
  - (i) Reuse `binding_pick_project_folder` and S2.
  - (ii) A new binding with its own title. That is about 20 src-tauri lines, over the 13 left.
  - I recommend (i).
- **P-11, O-19's place.**
  - (i) A control beside Open GeoParquet, and a bar entry.
  - (ii) A control in the frame (`StudioLayout.tsx`).
  - I recommend (i). It needs no layout file.
- **P-12, E-REOPEN's file.**
  - (i) A new `e2e/reopen.mjs`, with `project.mjs` unchanged.
  - (ii) Steps added to `project.mjs`.
  - I recommend (i), so that E-SAVE's outcome stays as merged (§5).
- **P-13, an `opened` after Cancel.**
  - (i) Apply it.
  - (ii) Close it at once.
  - I recommend (i), the same as a late admission today. This is timing inside one round trip, named.
- **P-14, the console row.**
  - (i) Unchanged: an instrument shows the wire exactly.
  - (ii) The bound applied to `open_project`'s refusal there.
  - I recommend (i), named as not covered.

**My open items.** These are the items marked not settled in "For the custodian" below, each to be settled at step 0 or by a stop.

## For the custodian

**Line counts and the split.** P4a is about 1,810 lines: shell product 745 (strings 80 of it), shell tests 625 and e2e 440, in about 27 files. P4b is about 385 lines, all e2e, in 3 files. P4 is about 2,195 lines in all, against the 2026-11-16 read's 1,420; the difference is mostly e2e, plus the cancel, question and re-link states. The rates are the line counts I read on main (by grep count):

| File | Lines |
|---|---|
| `saveProject.ts` (non-blank) | 113 |
| `saveProject.test.ts` (non-blank) | 125 |
| `e2e/project.mjs` | 500 |
| `e2e/lib.mjs` | 660 |

**Checked by reading:**
- The 5,941 figure is correct.
- PR B and the first look have merged, read from the continuity block, not from PLAN.yaml.

**Not settled by reading:**
- **(a) Two app processes at once (P4b, step 0).** Whether WebView2 under wry accepts a separate data folder per process, while the machine store is shared through `LOCALAPPDATA`. Also how a second process avoids a second dev server, and the CDP port that the overlay compiles into the debug binary.
- **(b) What the lineage facts mean** (P-7).
- **(c) The hooks E-REOPEN needs.** I did not read `e2e-test-surface.ts`, so I have not checked whether DEV hooks for setting the filter, the clauses, the style and the camera already exist.
- **(d) The camera round trip.** Whether the saved view comes back through the frame origin bit for bit (T-17, stop 7).
- **(e) `ProjectUri`.** Whether the reader's grammar fixes its length.
- **(f) A copy's failed write.** Whether `SaveError`'s text in a copy's `project_file_unwritable` names the folder path.
- **(g) Files I did not read.** For these, the figures are rates, not reads:
  - `ConsolePanel.tsx`'s refusal render;
  - `RefusalBlock.tsx`;
  - `StudioLayout.tsx` and `actionRegistry.ts`;
  - `style/document.ts` beyond its exports;
  - `workspace/viewTransitions.ts`;
  - `e2e/README.md`.
- **(h) The step's file count so far.**

**Three points on main for the brief.** None of these is a gate finding.
- `runAdmitPath`'s remediation forms re-enter `admitDataset` with the run's path. For a reopen that path would be a folder, so P4 must keep the forms shut (stop 5).
- `admitDataset` already logs `code: message` whole for `open_dataset`. That is outside P4's region and inside the redaction node's.
- `formatRefusal`'s doc says nothing is truncated. Under P-4 (i) that would be untrue for a reopen, so the worker's doc words must cover the reopen's case (amendment item 5 (j)).

**Files cited:**
- C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md
- C:/dev/spatial-ide/kernel/src/project/mod.rs
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/commands.rs
- C:/dev/spatial-ide/frontends/shell/src/admission/AdmissionPanel.tsx
- C:/dev/spatial-ide/frontends/shell/src/admission/admitDataset.ts
- C:/dev/spatial-ide/frontends/shell/src/admission/formatRefusal.ts
- C:/dev/spatial-ide/frontends/shell/src/App.tsx
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx
- C:/dev/spatial-ide/frontends/shell/src/console/surfaceRegistry.ts
- C:/dev/spatial-ide/frontends/shell/e2e/lib.mjs
- C:/dev/spatial-ide/frontends/shell/e2e/project.mjs
- C:/dev/spatial-ide/protocol/skp/SKP-V0.md
- C:/dev/spatial-ide/protocol/skp/src/v0/error.rs
- C:/dev/spatial-ide/state/directives/ (ADV-2026-11-19-30, -32, -34 and -35; ADV-2026-11-20-01 and -03; the human's directive of 2026-11-16; round 70)
