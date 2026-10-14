*Custodian's filing note (2026-10-14): the architect's draft of the status-bar form's Amendment 3, correction round 1 of PR #218 (E-STATUS-HEIGHT inconclusive at G1 in every run; state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md); read at the branch head e1f92a97 in C:/dev/wt/sb1h; the run 2026-10-14T12:09:17Z to 2026-10-14T12:19:29Z by its transcript (Read 33, Grep 14; zero writes); its one SubagentHandback call, at 12:19:28Z. Extracted by script; every rooted path:line cite de-rooted (branch pins carry no hash) and one final newline added; nothing else changed. The message's sha256 as handed back is 296d0b5c0c4e6aa5ca798cc44e2e4a0b25679087367246a8ff7ad3461d946c72; this file's, from line 5 to the end, is a71af9dbc8add697c674876f323166e30758a29493688db8c9791e6b41a56b68. The amendment is appended to the form from the message as handed back, with the run record's path filled in where the draft asked for it, and its one main evidence pin given its revision and sha256 by script. None of it is the human's wording.*

---

cut/shell-status-bar-one-height @ e1f92a974aa9ce77150be0b057160cec755bb910. Verdict: not a gate; this is the draft of Amendment 3. One premise in the brief does not hold, and the step is redesigned around it (finding 1).

**Findings on the brief (for the custodian, not part of the amendment)**

1. **Bullet 1 of the brief cannot be built: no poll can wait for the residency item in S1.** After a reopen, the residency item is not merely late. Under the code, it does not come back at all until the camera changes:
   - The reopen clears it: App.tsx:241-244 and residencyStatus.ts:202-205.
   - For a dataset within the render budget, the candidate arm emits nothing until a tile plan has run: residencyStatus.ts:330-333; candidateArmSession.ts:369, :772-804 and :832.
   - A plan runs only from a real viewport change: candidateArmSession.ts:1456-1483. The open's own fit does not trigger one: candidateArmSession.ts:60-76.
   - S1 changes nothing about the camera (selection.mjs:765-769).
   - So in every run, B holds only the watcher and the notice. They take 999.19 px of the bar's 1256, which is why G1 failed every time. This also means I3 has fired, since G1 was unmet in two or more runs at the native window.
   - The fix: pick a width at which the wrap does not need the residency item.
   - Alternative rejected: 1200 px plus a Zoom to layer in S1 before the wait. It stays above the 1024 floor, but it adds a camera change and a tile plan to B, and it ties the wrap to a residency text whose length depends on the fill state.
2. **Do not hash the `@ e1f92a97` pins.** The brief says the custodian hashes them, but e1f92a97 is a branch commit. Round 15 (e) forbids a hash pin at a branch commit in an append-only record. Round 25, item 2 forbids it for test text on an unmerged branch. The form's own §0.3 already followed this rule for d59f1a6a. Under the proportional-gates rule this is a Documentation finding; the draft below follows the rule. The one main-tracked evidence pin is hashed at main, by script.
3. **The form's header requires an amendment made after outcomes were seen to say so in its first line.** The draft's first line does.
4. **On the pan-anchor `setCam` defect:** it has no direct bearing. E-STATUS-HEIGHT reads DOM boxes and readTab by polling, never the view-state log. Two indirect points do bear on it:
   - pan-anchor never puts the window back after resizing it (pan-anchor.mjs:285-288). A selection run attached to an app that pan-anchor already ran in starts at 1400 × 900, not 1280 × 800 (lib.mjs:149-165 reuses a running app).
   - pan-anchor's `resizeWindow` waits a fixed 700 ms (pan-anchor.mjs:185), the same kind of fixed wait as `setCam`'s.
   - The draft therefore sets both dimensions, polls until the size has taken, and restores the window afterwards.

---

### Amendment 3 — E-STATUS-HEIGHT sets the window to 880 × 800 and restores it, so the notice needs a second line with or without the residency item (class 1; correction round 1 of the piece)

*This amendment was made after outcomes were seen. The custodian's E-STATUS-HEIGHT runs at e1f92a97 (PR #218) were INCONCLUSIVE at G1 in every run, so I3 fired, and a diagnostic run read each footer item's box. The architect drafted it from the branch `cut/shell-status-bar-one-height` @ e1f92a974aa9ce77150be0b057160cec755bb910, read in the worktree C:/dev/wt/sb1h; that worktree's uncommitted state was not checked. Every `@ e1f92a97` pin is a branch pin and carries no hash (round 15 (e); round 25, item 2); each is re-pinned on main when the piece merges. The item widths come from the diagnostic run and are evidence: [custodian: path of the run record]. Nothing above is edited.*

1. **Why G1 is unmet at 1280 × 800.**
   - s1 In B the bar holds only the watcher and the notice. The reopen clears the residency item, and for a dataset within the render budget the candidate arm shows no residency item again until a camera change has planned tiles.
   - s2 The watcher and the notice need 274.47 + 12 + 712.72 = 999.19 px. The bar gives its items 1280 − 24 = 1256 px, so the two share one line.
   - s3 Waiting in S1 for the residency item would time out, because S1 changes nothing about the camera.
   - Check:
     - s1: The clear is line 241-244 of frontends/shell/src/App.tsx (at e1f92a97), with line 202-205 of frontends/shell/src/residency/residencyStatus.ts (at e1f92a97). The item renders only while a status stands: line 2195-2199 of frontends/shell/src/App.tsx (at e1f92a97). The within-budget branch emits only once settled: line 772-804 of frontends/shell/src/residency/candidateArmSession.ts (at e1f92a97) and :832. Settled needs `hasPlanned`: line 330-333 of frontends/shell/src/residency/residencyStatus.ts (at e1f92a97). `hasPlanned` starts false (candidateArmSession.ts:369) and is set only by a plan (:1483, inside `handleViewportChange` at :1456). Planning starts at the next real viewport change, and the open's fit does not notify one: :60-76. Item A's text is the candidate arm's within-budget line: residencyStatus.ts:463.
     - s2: The widths are the diagnostic's. The bar has 0.75rem of padding on each side and a 0.75rem gap between items: line 167-168 of frontends/shell/src/styles.css (at e1f92a97). The status row spans the whole window: styles.css:41.
     - s3: S1 is the reopen, a notice poll and two frames: line 765-769 of frontends/shell/e2e/selection.mjs (at e1f92a97). `openFixture` waits only on the render trace: selection.mjs:201-205.

2. **The step's window.**
   - s1 Before S0, the step sets the app window to 880 × 800 with CDP `Browser.setWindowBounds`, the call pan-anchor's `resizeWindow` makes. It does this through a CDP session that it opens and detaches the way E-CLICK-FAST does.
   - s2 It then polls with `pollUntil`, bounded at 5 s, until `window.innerWidth` is 880 and `window.innerHeight` is 800. If the call throws, or the poll ends unmet, the step is INCONCLUSIVE (class 2, never a pass), and the message names the size read. pan-anchor's fallback (measuring at the host's size) and its fixed sleep are not copied.
   - s3 A, B and C are all read at that size.
   - s4 In a `finally`, the step sets the window back to the bounds `Browser.getWindowBounds` returned before the resize, and polls until the inner size has come back. A restore that does not take fails the step and names both sizes, without hiding any earlier failure. E-DBLCLICK therefore runs at the size it always has.
   - s5 The step sets both dimensions, so it does not depend on whatever size an earlier suite left on a reused app.
   - s6 The present body is not re-indented. A new outer `stepStatusHeight` sets the size, calls the present body under a new name, and restores the size.
   - Check:
     - s1: line 180-191 of frontends/shell/e2e/pan-anchor.mjs (at e1f92a97) (the call is at :184). The session pattern is selection.mjs:309-323. Evidence that the call sets the inner size exactly: line 146 of state/consults/2026-10-08-shell-migration-milestone-1-worker-report-3.md (at e1f92a97) @ <main commit, full id> sha256:<by script> (evidence, not Authority). The window call changes the real window and overrides no device metrics, unlike `page.setViewportSize` (line 245 of frontends/shell/e2e/layout.mjs (at e1f92a97), :280). The step therefore never has to show that it forces no scale factor, which matters because the form runs none (Amendment 1, item 3, §6).
     - s2: `pollUntil` is selection.mjs:131-140. The fallback is pan-anchor.mjs:187-189 and the sleep is :185.
     - s3: S0 to C are selection.mjs:755-779.
     - s4: E-DBLCLICK runs next: selection.mjs:836-837. The app starts at 1280 × 800: line 17-18 of frontends/shell/src-tauri/tauri.conf.json (at e1f92a97).
     - s5: pan-anchor leaves the window at 1400 × 900: pan-anchor.mjs:285-288. A running app is reused: line 149-165 of frontends/shell/e2e/lib.mjs (at e1f92a97).
     - s6: A declaration about the edit. The present body is selection.mjs:742-786.

3. **Why 880 wide.** At a window width W, the bar gives its items W − 24 px. At 880 that is 856.
   - s1 In A the items stay on one line. The residency and watcher items need 248.25 + 12 + 274.47 = 534.72 px of the 856, a margin of 321.28.
   - s2 In B the items need two lines without the residency item: the watcher and the notice need 999.19 px, 143.19 more than the 856 available. Any further item only adds width.
   - s3 B never needs a third line, because the notice alone needs 712.72 px of the 856, a margin of 143.28.
   - s4 The wrap holds for any W below 1023.19, and the notice stays on one line for any W at or above 736.72. 880 makes the two margins equal.
   - s5 Each width is the text's character count times 7.04 px, plus 16 px for the padded items, so the widths do not depend on the window. This is derived from the diagnostic, not measured separately.
   - s6 880 is below the frame's 1024 floor, where the map minimum is not claimed. The step asserts nothing about the map's size beyond the canvas being the same in A, B and C.
   - s7 At 880 both side columns are fitted to their minimum widths, so the canvas is predicted at 388 × 712 in A, B and C.
   - Check:
     - s1 to s4: The widths are the diagnostic's. Padding and gap: styles.css:167-168. The bar wraps: :165. The item order, with the residency item first and the notice last: line 49-55 of frontends/shell/src/layout/contributions.ts (at e1f92a97).
     - s5: The three texts and their lengths:
       - the residency text, 33 characters at N = 2000: residencyStatus.ts:463;
       - the watcher text, 39 characters in state watching: line 32 of frontends/shell/src/layout/statusItems.ts (at e1f92a97);
       - the notice, 99 characters for one feature dropped because a dataset was opened: line 73-75 of frontends/shell/src/feature/FeatureTab.tsx (at e1f92a97).

       The arithmetic: 274.47 / 39, (248.25 − 16) / 33 and (712.72 − 16) / 99 each give 7.04. The padded items' 0.5rem on each side is styles.css:565 and :645. Their font sizes are :569 and :649. The watcher inherits the bar's font size from :169; its own rule is :179-181.
     - s6: line 14-17 of frontends/shell/src/layout/layoutConstants.ts (at e1f92a97), and line 117 of frontends/shell/src/layout/layoutState.ts (at e1f92a97). The step's assertions are selection.mjs:783-784. Precedent below the floor: pan-anchor runs the app at 820 × 640 (pan-anchor.mjs:285). Outside the canvas, the step clicks only the tool switch. The switch sits at the top bar's left end, after the app name (line 230-233 of frontends/shell/src/layout/StudioLayout.tsx (at e1f92a97)), and the bar clips at its right end (styles.css:63, :74).
     - s7: At 880 the fit's excess is 212 and its slack is 120 (layoutState.ts:126-136). Layers goes to 200 and the Inspector to 280 (layoutConstants.ts:27, :29). So 880 − 200 − 280 − 12 = 388 (layoutState.ts:147), whatever widths an earlier step left. The columns are set from the fit (StudioLayout.tsx:194-198), and the fit reads the window's inner size (:81-86). The height is 712 = 800 − 40 − 48 (layoutConstants.ts:34, :36), with the strip empty and Activity closed, as Amendment 1's §1 check gives.

4. **S1, restated.**
   - s1 The step calls `openFixture` again, polls until `statusItem` is not null, waits two animation frames and reads B.
   - s2 B also records whether `.residency-status` is present. It is predicted absent (item 1).
   - s3 The step does not wait for the residency item (item 1, s3).
   - s4 G1's probe is unchanged. Whichever item comes first in the footer is on line 1, and the notice, last in the order, is on line 2 (item 3).
   - Check:
     - s1: selection.mjs:765-769.
     - s2: the read is selection.mjs:743-753, and the field is added at :750.
     - s4: The probe is selection.mjs:749 and :771. Items with no text render nothing: line 207 of frontends/shell/src/layout/regionParts.tsx (at e1f92a97) and :219. The order is contributions.ts:49-55.

5. **What stays and what changes.**
   - s1 G1 (the ruling's guard) and G2 stay as Amendment 1 gives them, and so does the mutation.
   - s2 S3 is unchanged: the canvas is equal in A, B and C, and the bar is 48 in all three. Neither depends on the width.
   - s3 Recorded, not asserted:
     - A's canvas, predicted 388 × 712;
     - B's scrollHeight against its clientHeight (H2), unchanged;
     - whether the residency item is present in B (new);
     - the inner size after the resize and after the restore (new).
   - s4 Amendment 1's §1 figure, 712 at 1280 × 800, stands as the declared consequence at that window. The step now reads the height at 880 × 800, where the same arithmetic gives 712, because the arithmetic does not use the width. The custodian's diagnostic read 668 × 712 at 1280 × 800; that is evidence, not the step's result.
   - s5 §3's mutation prediction is unchanged. Under the mutation, A has one line (bar 24 px, canvas 736) and B has two (canvas about 715.45, from run 5), at 880 as at 1280.
   - s6 I3 becomes: G1 is unmet in two runs at the step's 880 × 800 window.
   - s7 The first line of the proofs becomes: E-STATUS-HEIGHT proves the human's property on the real app, with the real notice, at a real window of 880 × 800 set over CDP.
   - s8 §2.10 and §8 item 15 hold. The edit stays inside E-STATUS-HEIGHT in e2e/selection.mjs. E-DBLCLICK stays last and runs at the restored size.
   - s9 Part Z is unchanged.
   - Check:
     - s2: The bar's height is `var(--status-h)` (styles.css:162), set from a constant (StudioLayout.tsx:203).
     - s3: The PASS note is selection.mjs:785.
     - s4 and s5: Amendment 1, item 3 (§1's check gives 712 = 800 − 40 − 0 − 48, a sum with no width term).
     - s8: selection.mjs:836-837.

6. **§7.**
   - s1 selection.mjs is at 52 of its 90 (Amendment 1, item 2, §7 restated).
   - s2 This change is predicted at no more than 36 lines by §7's numstat command. That covers the window constant, the window helper, the outer function, one renamed line, B's residency field, and the PASS note.
   - s3 selection.mjs then stands at no more than 88 of 90, and group E's margin is not used.
   - s4 Going past 90 is class 8, and §7 is not edited.
   - Check: s1 is the custodian's count at e1f92a97. s2 to s4 are declarations. The amendment requires no re-indentation (item 2, s6) because numstat would count every re-indented line twice.

7. **Superseded index.**
   - Amendment 1, item 2, §4: S1 → item 4. The Recorded line and the first line of the proofs → item 5.
   - Amendment 1, item 3, §5: I3 → item 5.
   - Not superseded: S0, S2, S3, G1, G2, the mutation, and §7's table.

Nothing above is edited.

---

**Risks the custodian should know about:**
- The step's correctness rests on the 2026-10-08 worker report's evidence that `Browser.setWindowBounds` sets the inner size exactly. If that does not hold on a given machine, the step is INCONCLUSIVE rather than wrong.
- At 880 the top bar's toggles may be clipped on the right. The step never clicks them.
- Follow-up, not this piece: the deferred README node `e2e-readme-status-bar-steps` should name the step's 880 × 800 window when it lists the step.

Key files:
- C:/dev/spatial-ide/frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md
- C:/dev/wt/sb1h/frontends/shell/e2e/selection.mjs
- C:/dev/wt/sb1h/frontends/shell/e2e/pan-anchor.mjs
- C:/dev/wt/sb1h/frontends/shell/src/residency/candidateArmSession.ts
- C:/dev/wt/sb1h/frontends/shell/src/residency/residencyStatus.ts
- C:/dev/wt/sb1h/frontends/shell/src/styles.css
- C:/dev/wt/sb1h/frontends/shell/src/layout/layoutState.ts
