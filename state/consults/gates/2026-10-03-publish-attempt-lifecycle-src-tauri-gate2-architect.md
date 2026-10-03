VERDICT: PASS
Reviewed cut/publish-attempt-lifecycle-src-tauri @ bfd68af. PR #165, gate 2, architect.

Everything below about a cited span is paraphrase. I quote nothing. Spans that exist only on the branch are named in words, with their commit. I computed no hash. The branch ref and its origin ref both read bfd68af. The worktree HEAD is that branch.

## S1 (blocking)

None.

## S2 (not blocking; each is carried by the closing record or the routed node, as Judgment 4 sets out)

1. **Amendment 1, item 4: the class-8 Reason does not reconcile with its own figures.**
   - The bullet says the round adds 55 lines to the 694 that gate 1 counted. Read that way the total is 749, but the Final bullet gives 715.
   - Numstat over ff57832...HEAD nets out the round's edits to lines the piece had already added. The round's own diff against 4d92733 is 55 lines; its net effect on §7's count is 21.
   - The Declared and Final figures and the named commit meet class 8 (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions, class 8). §7 is unedited at bfd68af. So this is not round 25's named failure. It is a Reason a gate cannot verify (the record cap).
   - Fix it in the closing record as a correction of at most three sentences (round 12 (d)): the defect, the reviewer's gate-2 recount as the reference, and the two numstat ranges as the proof.
2. **M4's recorded text was corrected without a pin on its superseded span.** The change at 0391787 alters a claim in a test comment: a quote with an unmarked elision became a paraphrase. Round 14's named exception makes that class 3, recorded by row with the superseded span pinned.
   - Amendment 1 files it under class 4. That class does fit a mis-described mutation, so the label is defensible. But nothing pins the superseded span.
   - That span is in `publish.rs` at 4d92733, which is on main through 4e3c8a8, so it can be pinned now. The replacement exists only at 0391787, a branch commit. Amendment 1 rightly names it in words, with no hash (round 15 (e), round 25 item 2 (d)).
   - Both pins belong in the closing record (Judgment 4).
3. **KNOWN-LIMITATIONS 30 says nothing about an execute that registers after the drain began** (my gate-1 S2-2; the reviewer's S2-1). Its frame is a publish running when the last window closes. Inside that frame, the ceiling sentence's claim that the publish was cancelled is true, because `on_exit_requested` cancels before `prevent_exit`.
   - A publish whose `try_insert` lands after `cancel_all` falls outside the frame and is never cancelled. The window is tiny: `binding_publish_execute` does only synchronous setup before `run_exclusive`.
   - The routed node `publish-lifecycle-drain-followups`, item 1, removes the case. Its preregistration should list KNOWN-LIMITATIONS 30 among the sentences its fix makes exact, or add the case to the item.
4. **The HTML comment under KL 30 attributes a phrase to the form in quotation marks**, calling it the form's own not-verified for macOS and Linux.
   - The form has that phrase only with a capital N, and only in the R3 table's macOS logout cell (§2 item 5). Its rule for the platforms is R5: nothing is claimed off Windows.
   - The phrase was already on main at 4d92733, and this round only appended to that line. It sits in a doc comment, not an amendment, so the verbatim rule's named failure does not apply.
   - Route a class-3 fix to the next piece that touches KL 30 (`publish-lifecycle-drain-followups`): cite §2 item 5, R5, without quotation marks.

## Judgments

**1. Gate-1 S1-1, S2-1 and S2-3: each is discharged.**
- **S1-1.** At bfd68af, lines 310-311 of `KNOWN-LIMITATIONS.md` put the 30-second case in its own sentences: cancelled, not finished stopping, and the process exits anyway. Lines 308-310 list only the undrained exits. The after-any-of-these clause (lines 311-315) covers both. Proof: the `on_exit_requested` body at bfd68af (publish.rs lines 1144-1155) and T6.
- **KL 30 against the form.** It is now facts only against:
  - §1: the fourth may-claim, and the last may-not-claim with the paragraph beneath it;
  - §2 item 3, where the drain cancels first;
  - §2 item 4, which needs facts only;
  - §2 item 5's Exit rows;
  - condition (b) of the exit-drain ruling (`state/directives/2026-10-03-exit-drain-ruling.md`): the item says why the app cannot record unknown and what the audit shows instead.
  
  The cancel-after-the-last-check sentence is the reviewer's S2-6, and its fact is the reviewer's gate-1 reading. S2-3 above is a silence, not a false statement.
- **"(item 1)".** It reads correctly once merged. On main, item 1 carries #162's per-platform levels: Linux is L1 for the Cargo workspace only, and not the Tauri shell; macOS has no level yet.
  - The branch does not touch item 1, so a three-way merge keeps main's text. The reviewer should confirm this on the merged tree.
  - Before the merge, the branch's item 1 says the platforms are not built, not validated and not claimed, which supports the same sentence.
  - The sentence points to item 1 rather than carrying a level itself, so the portability directive's R5, under which only item 1 carries levels, holds.
- **The macOS and Linux qualifier is enough.** The sentence is now marked as a reading of the pinned sources, not an observation, so no level is implied upward (R5).
  - Condition (a) binds the form, and §2 item 5's R3 table meets it unchanged.
  - The macOS Quit and SIGTERM entries in the no-drain list are declared reductions, not guarantees (R4), and need no qualifier.
- **My gate-1 N1 is withdrawn, and the sentence stands.** At merge, src-tauri's tests, T1-T6 included, run only on Windows CI (product-ci-shell). Nothing has run off Windows, so the sentence is true as written.
  - It does not say the window close itself was exercised. R1 is the proof of that, and Part R says R1 is discharged only when run.
  - Any added precision is for the human's sight (§8 item 14), not a gate requirement.
- **S2-1.** At bfd68af, the comment at publish.rs lines 804-805 says the `None` is unreachable and gives the reason. Kernel `GrantSet::add`'s only refusal is the `MAX_GRANTS` ceiling (`kernel/src/permission/grant.rs` lines 379-388, unchanged by this piece), and the new set is empty. True; behaviour is unchanged.
- **S2-3.** Row R1 at bfd68af (`frontends/shell/MANUAL-WALKTHROUGH.md` line 1543) drops the larger-viewport advice. It now says to close during `verifying-source`, which re-hashes the whole source at any viewport. True (my gate-1 citation of the kernel's re-hash).

**2. The reviewer's items: no new comment or doc claims anything false or new.**
- **S2-2.** The `on_exit_requested` doc (publish.rs lines 1139-1143) states that the drain's own exit is the only permitted exit caller during a drain. This is a constraint on future code, and its behavioural half (a second request answers Proceed) matches the once-flag.
- **S2-5.** As S2-1 above.
- **S2-6.** As Judgment 1.
- **S2-7.** The `DrainOutcome` doc (lines 1067-1068) says only tests read it. True: the drain task in `lib.rs` (lines 571-574 at bfd68af) discards `wait_idle`'s value and calls `app.exit(0)`.
- **N1.** The prepare doc in `commands.rs` (lines 247-256 at bfd68af) now says the execute registers only when its key is absent and removes only its own key. True of `run_exclusive`.
  - The leftover word SAME now modifies the progress event, which execute also uses. True.
  - The `insert` and `with_registered_cancel` docs say only the prepare phase replaces. True: the only product call of `RunningPublishes::insert` is inside `with_registered_cancel`.
- **N2.** M4's comment (lines 3045-3046 at bfd68af) is now unquoted and true of `panic!("got {outcome:?}")`. It names c92b17b and d0184eb. Commit ids in a test comment are not hash pins. This holds only if the merge keeps d0184eb reachable, which PLAN's `merge: merge-commit` requires.
- **N4.** The new Before-R1 bullet (line 1538) points to Part F's build command, which is at line 278 of the same file. True.

**3. Amendment 1 as a record.**
- **Classes and first line.** Classes 8, 1 and 4 are right.
  - The heading and the first body line both carry the class-8 words.
  - The first body line also declares the amendment post-result (class 1).
  - A correction round on a piece that already merged is a post-result record (round 15 (g)).
  - Class 8's Declared and Final figures and its named commit are met, and §7 is unedited. The Reason is S2-1.
- **References only.** Met, with S2-1 as the one sentence that fails to reconcile.
  - Every cited file is tracked on main.
  - There is no bare line cite, no line cite into the form, and no hash at a branch commit.
  - No clause says "discharged" or "done", and nothing calls a `verify-mutation` run an observation.
- **Routing.** Matches PLAN.yaml's proposed node `publish-lifecycle-drain-followups`, whose summary names the reviewer's S2-1, S2-4 and S2-8 and my S2-2.
  - Routing the late-registration change rather than adding it here is correct: adding it here would be class 9 with its code after the declaration.
  - The S2-9 sentence matches my gate-1 judgment on condition (c).
- **Superseded index.** It is present and anchored at 4d92733, which is on main, and its replacements are named in words by branch commit. This meets round 12 (e) and round 25 item 2 (d), except for the missing M4 pin (S2-2).
- **T4 under class 4.** Acceptable.
  - The reviewer's gate-1 S2-3 found T4's asserted value dependent on wall time.
  - At d0184eb, T4 joins first and asserts `Drained` at `Duration::ZERO`. That is deterministic because `wait_for` checks the current value at once, and T5 still proves the wake path.
  - M4 was re-observed at d0184eb by apply, run and revert, recorded in the test comment and in worker report 2. That is an observation of record under round 25 item 2 (c). The reviewer's own gate-2 M4 run, if made, joins it.
  - The time-free change also clears §8 item 9.

**4. What node 8's closing record on main must carry after #165 merges.** References and hashes only; no prose restating them.
- Merge facts:
  - #163's merge commit 4e3c8a8, at head 4d92733, recorded before any gate report;
  - #165's merge commit, at head bfd68af;
  - both PRs merged by merge commit, so 4d92733, b125721, d0184eb, 0391787 and bfd68af are reachable from main.
- The four gate reports by path under `state/consults/gates/`: gate 1 for both roles, and gate 2 for both roles.
- The §7 figure, by the reviewer's gate-2 recount at bfd68af, by reference. A correction of Amendment 1 item 4's Reason, at most three sentences (S2-1).
- One class-3 row for M4's recorded text:
  - the superseded span as `frontends/shell/src-tauri/src/publish.rs:<a>-<b> @ 4d92733 sha256:<hex>`;
  - the replacement as the same path and lines `@ bfd68af sha256:<hex>`, written only once bfd68af is on main.
  
  The reviewer recomputes both hashes, and each reference is contiguous on one line (round 15 (d)).
- If the record supersedes Amendment 1 item 4, a superseded index naming it (round 12 (e)).
- §8 item 14: the human's sight of KL 30 as revised, cited by question round and item. Gate 1 could not tell whether the #163 click was a sight, so do not infer it from a merge click.
- Row R1 is queued and unrun. Name its queue entry. Neither the S3 seam (question round 40, item 3) nor Part R may be called discharged until R1's result log is filled.
- Routed nodes by id:
  - `publish-lifecycle-drain-followups`, carrying S2-3 and S2-4 above as well;
  - `audit-unknown-outcome-at-exit`;
  - `shell-macos-last-window-convention`;
  - the prepare-key sibling, `prepare-cancel-key-per-dataset`.
- PLAN: `evidence {pr}` is set only in the done commit and names #165, with #163 referenced as well if the schema allows.

## N

1. KL 30's bold heading now covers only exits the app does not drain, while its body also covers the ceiling. This is true but narrower than the item, so it is for the human's sight.
2. I cannot read PR #165's body. The reviewer should confirm that it shows KL 30 byte-identical to bfd68af (Amendment 1 item 6) and asks for a merge commit, never a squash (round 25 item 2 (d)).
3. Gate-1 N3 (`try_insert` and `cancel_all` could be private) still stands. It is not a violation.
4. No §21a head, seam or caller-rule change in this round: comments, docs and one test only. The reviewer confirms the numstat stays inside §7's five files.

## ADR skeleton

None; no decision is missing.
