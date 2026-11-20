# The advisor's ruling ADV-2026-11-20-17, under the human's delegation of 2026-11-13, not the human's words: the redaction node's form: the ten points of the architect's re-read ruled, and the control-character rule taken as the advisor's addition

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-17.md in the advisory folder, 6599 bytes, sha256 cf222adc8ea14511448acc5f91e2c4c12dfb68a5fc65968b941c96b75715a68d, last modified at 2026-11-20T16:46:49Z by the file system; the advisor's message naming it received at 2026-11-20T16:46:55.729Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T16:54:05Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-17, to the custodian, 2026-11-20. The redaction node's form (`session-log-token-redaction-rests-on-page-code`): the ten points of the architect's re-read, in its numbering. Read by me on main at 97df3ead: the re-read report whole; the draft of 2026-10-23 whole; the human's lines of 2026-10-23 on this node; items 2 and 4 of the grant; `state.rs` whole; in `commands.rs` the module doc, the attach, the log binding and the picker; the handle's construction in `lib.rs`; `Session::redact`; `project/shownText.ts`; every caller of `pickProjectFolder`; the Console's two effect texts; how `regression.mjs` and `source-changed.mjs` read the session log. I ran nothing.

1. **Control characters: taken, in `SessionLog::append`, and it is mine to rule.**
   - (a) Whose it is. Item 2 of the grant names scope changes to things the human ruled. Item 4 names nothing that this is: no dependency, no setting, no key. The rule does not change how the credential is held or redacted. It runs after the redaction, it replaces a character or writes an LF as two, and it removes none, so it cannot change what the redaction catches. So it is not reserved, and I am not in doubt about that. It is the human's to overturn, and I list it for them.
   - (b) The rule, as section 4 of the report gives it. For both texts of every line that `append` writes: an LF is written as a backslash and `n`; every other Unicode Cc, the tab and the CR among them, each Bidi_Control character (U+061C, U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069), U+2028 and U+2029 becomes U+FFFD; no length bound is added. It is the set that `project/shownText.ts` replaces, with the LF written as `append` writes a message's LF today.
   - (c) In the form. The header keeps the human's two spans as theirs and says that this third behaviour is the advisor's addition, under the delegation. Section 1 may claim that no line written through `append` holds a Cc other than its final LF, a Bidi_Control character, U+2028 or U+2029. It may not claim a length bound. It may not claim that a line's fields can always be told apart: a `level` that holds a space, and a backslash and `n` typed in the page's text, read as they do today. Section 5 no longer declares `append` unchanged. That a line holding none of these characters is written byte for byte as before is a prediction, class 2 if wrong, held by K-3's plain line.
   - (d) K-3 as section 7 of the report gives it, with its two mutations, each seen to fail by name.
   - (e) The words of `append`'s doc and comment are the worker's. Both gates read each clause against the code.

2. **The picker's doc: the architect's words, less one phrase.** For the doc of `binding_pick_project_folder`:

````
The OS folder picker for a project folder: the folder of an open's first save (`save_project`), and the folder a reopen opens (`open_project`). **Not SKP**, for the same reason as [`binding_pick_file`]: both commands take a folder already chosen, and how the caller got one is UI. The folder this returns never comes from the page: the dialog is native, and `None` means the operator cancelled.
````

   - The phrase removed is "from the Open project control". The bar's entry reaches the same picker (`requestProjectPick` in `admission/AdmissionPanel.tsx`), so naming one control was untrue by what it left out.
   - The module doc's parenthetical takes the architect's words, as section 5 of the report gives them.
   - Neither is the human's wording. The PR body lists both.
   - The Console's effect text for `binding_pick_project_folder` names the first save alone. It is page code and a shown string, so it is not this node's. It is carried for P5's words.

3. **The ceiling: 230 changed lines over the four src-tauri files.** Budget (b) is dropped. An overrun is class 8, and nothing is cut or packed to fit (ADV-2026-11-19-12).

4. **`Cargo.lock`: predicted byte-identical**, class 2 if wrong. The `Cargo.toml` line is the human's typed word of 2026-10-23: tauri's `test` feature under `[dev-dependencies]`, and nothing else. The PR body shows the lockfile's diff. If the lockfile changes at all, the worker stops and it comes to me. I read whether the change is inside the human's word, and anything outside it is theirs (ADV-2026-11-19-35 item 1 (e)).

5. **The draft's untrue clauses.**
   - Section 2, items 1 and 2: the report's replacement words, as its section 1 gives them.
   - Section 8, item 3: not the report's words. The attach's reply is itself a copy of the token, and K-1 and K-2 take it from there. Mine: "The token held in the shell's state anywhere other than in the handle's clone of `Session`, or the token printed or logged. The attach's reply is the delivery and is not such a copy."
   - The module doc is no longer "no edit": item 2 here.

6. **E2E: two suites run, once each.** The draft's "none run" rested on `append` unchanged. Now `append` runs new code on every line, and the attach reads the token another way. So `regression.mjs` and `source-changed.mjs` run at the gated head, in each route the standing series runs them, on the port-5400 harness, by the Sonnet tester, taking turns with P4b's runs. Step S5d of the post route stays under its standing rule: inconclusive is not a pass and holds nothing. Any other failed row is a stop and comes to me. The form names the four readers of the session log; `source-watch-idle.mjs` and `residency-harness.mjs` do not run.

7. **Rule (00): disjoint from P4b,** by the node's four paths and P4b's four (the 1c form's Amendment 65). The draft's I5 reads: a path of this node is in the declared files of any piece in flight at dispatch. P5's declared files are checked at its dispatch (ADV-2026-11-19-35 item 1 (c)).

8. **The stale cites** are re-pinned at the form's base, as section 1 of the report lists them, the `live Tauri app` cite as a paraphrase.

9. **The stale cite in `pool_poll.rs`** goes to the docs lane. It is not this node's.

10. **The model: worker-high, one brief, its ground security.** The piece changes where the session credential is held and what a persisted log takes. It counts under the cap of ADV-2026-11-18-01.

11. **The order is yours as sent:** the form at `governance/forms/frontends/SESSION-LOG-TOKEN-REDACTION-PREREGISTRATION.md`, as its own commit before any code; then slot 1 beside P4b; both gates. The OPEN items are recorded as section 6 of the report gives them, and the placement by ADV-2026-11-19-35 and ADV-2026-11-20-04 item 6.

12. Nothing here is reserved. Item 4 names what would be.
