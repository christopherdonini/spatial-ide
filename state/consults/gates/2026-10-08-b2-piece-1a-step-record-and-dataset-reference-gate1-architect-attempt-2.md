# PR #190 gate 1 — architect, attempt 2
Reviewed: cut/b2-piece-1a-step-record-and-dataset-reference @ 14acee0bb3589d8b610e98bb7865b22637b0d393

**Verdict: pass, with three Documentation findings (§22 Documentation).** C-1 and C-2 are resolved as Amendment 5 states, in ADR-036 and in the code and tests. The reviewer's D1 and D2 are fixed. The fix adds no new Correctness or Evidence problem. Each Documentation finding below must be fixed in this PR before the merge. None needs a re-gate.

**Excluded, as briefed.** The reviewer's C1, the missing `getrandom` edge in `frontends/shell/src-tauri/Cargo.lock`, waits for the human's typed ruling. I did not count the red shell CI jobs against this re-gate. §9's "CI green at the reviewed commit" is still unmet, so the merge waits for that ruling and its class 9 amendment.

**What I read:**
- the branch in `C:/dev/wt/1a` at 14acee0b. I took the head from the branch ref and the worktree reflog;
- main's records in `C:/dev/spatial-ide`.

I had no shell, so the reviewer recomputes the ADR equality, every hash and the §7 count.

## Correctness / Evidence

None.

## Resolved and holding

**C-1, the ADR text.** I compared each of Amendment 5's fenced blocks, de-indented, with ADR-036 at 14acee0b, line by line.
- Item 1 (a) is the whole `project-relative` bullet in §5.
- Item 1 (b) sits after the line beginning "Locators are built and resolved in the kernel only.", with one blank line before it. It holds the carrying rule, the containment rule (canonical form kept separate from resolved-target containment) and the 1c sentence. The original blank line before `observed` is kept.
- Item 5 (a) replaces the whole `observed` paragraph.
- Item 5 (b) sits after the bullet beginning "The claim is recorded rather than inferred again", with one blank line before it.

Nothing else differs from the text that attempt 1 checked against Amendments 1 and 2. Status is Proposed. The worker's script reports 16,354 bytes, byte-equal; the reviewer recomputes it.

**C-1, the code.**
- `stays_inside_the_project_folder` is now `in_canonical_form`, with the same body, the same `Malformed` variant at the `at` path, and an error detail that states canonical form.
- The doc says the check is on the string alone and that containment belongs to 1c's resolver.
- The `Locator::ProjectRelative` doc says the locator is checked for canonical form only.
- The function is private, and no `pub` item or error variant was added (§8 item 7).
- The exception to §8 item 1 holds: no path type is used and nothing is joined.

**C-1, R7.** R7 is renamed `a_project_relative_locator_outside_canonical_form_is_refused`. It still has nine cases, and every case asserts `Malformed` at the `at` path. Its note names `in_canonical_form` and gives 507838e2 as the observation commit.

**C-1, routing (item 8).** `PLAN.yaml`'s `b2-piece-1c-save-and-reopen` summary carries the carrying rule, the containment rule and the required tests: a link out, and on Windows a junction out, a device name, and a trailing dot or space.

**C-2, the code.**
- `expect_state` keeps the closed key set and the closed word.
- It accepts the basis through the bounded, non-blank `claim` helper and drops it. The fixed-text comparison is gone.
- The comment above the constants, `expect_state`'s doc and the module header's new bullet all say the word is closed and the basis is this writer's.
- `to_json` and `parse_observed` are unchanged.
- `parse_observed`'s minimal-decimal round trip refuses a sign or a leading zero, and its hex check requires 64 lowercase characters. Both now match the amended `observed` paragraph, so no reader strictness remains outside the ADR on word, basis or spelling.

**C-2, K1.** The added code is the seam test from the real shape.
- It takes the bundle's own `source.source_revision` from a real `publish_unguarded` manifest.
- It asserts that the two basis texts differ, that the entry parses, and that it writes back to this writer's text.
- The consuming side's interface is the bundle's `NamedState` with free-text basis, which the test reads from emitted bytes, not from an imagined shape.
- The failure recorded for the added mutation is the old fixed-text refusal at `$.resource.source_revision.basis`, which is the right site.

**C-2, R8.** `a_named_states_basis_is_free_text_and_its_word_is_closed` covers all four named-state paths with all four checks Amendment 5 item 7 names: another basis parses and writes back; a blank basis is `Malformed` at `.basis`; an over-long basis is `OverCeiling` at `.basis`; another word is `UnknownState` at `.state`. Its mutation (`claim` becomes `bounded`) fails at the blank case.

**Mutations.** The record calls none of them a `verify-mutation` run; all were applied by hand (round 25, item 2).
- The failing lines in worker report 3's table are 785, 845 and 211. They match the tree at 507838e2, before 14acee0b's comment lines were added; at 14acee0b the same assertions are at 784, 849 and 217.
- That fits observation at 507838e2, as recorded.

**Reviewer D1 and D2.**
- The module header now says "absolute path".
- The stale "neither built nor interpreted here" text is gone from `Locator::ProjectRelative`.

**Other checks:**
- §8 items 1 to 13: no change from attempt 1. The fix touches only the ADR, `kernel/src/dataset_ref.rs` and `kernel/tests/dataset_ref.rs`. It adds no I/O, no `pub` item and no frontend or protocol file.
- ADR-005 and ADR-006: unchanged.
- No quote of the human is marked verbatim. The amendment, the ADR text and the code comments quote nothing of theirs.
- Round 7: Amendment 5's items are statements of work, not discharge claims. Worker report 3's "done" points to named tests and commits.

## Documentation (must be fixed in this PR before the merge; no re-gate)

**D-4 — The indexes' "Last verified at" lines are stale. Location: `kernel/README.md` and `engine/README.md` on the branch, each index's "Last verified at" line (still 1251fc3c).**
- The form's §2.8, and Amendment 4 item 1's practice, refresh this line at the last commit that changes code. That commit is now 507838e2, and 14acee0b changes test text.
- No pointer is stale; the public names are unchanged.
- Fix: re-verify the pointers and set both lines to 14acee0b.

**D-5 — The closing record owes the fix head's records. Location: §9's closing record. Each item is owed by Amendment 5 or by round 25, item 2.**
- **(a) §7 as class 8, under Amendment 5 item 9.** The worker counted from the merge base db7c88d0 at 14acee0b: kernel product 876 against 760 and kernel tests 541 against 520. The total is 2,010 over 10 files, exactly at its ceiling and not over it. The reviewer recounts. §7 is not edited.
- **(b) The observation commits.** R7, K1's added mutation and R8 were observed at 507838e2. R7's earlier observation, at 1e637d55, is superseded.
- **(c) The test-text row, named with its commit ids** (round 25, item 2: a test-text span is named with its commit id). This is worker report 3's class 3 row: R7's old recorded-mutation note, added on the branch at 1251fc3c and replaced at 14acee0b. The reviewer confirms the commit that added it. It is not pinned by hash at a branch commit.
- **(d) Attempt 1's D-1 to D-3, as briefed.** The test-text rows and the count's head belong in the PR body. The hash pins and their revisions at commits on main belong in the closing record.

**D-6 — An unresolvable reference in Amendment 5 item 2. Location: Amendment 5, item 2, the "Why it does not grow" bullet, "(see the custodian's notes)".**
- The reference names no path. The notes are in my draft, `state/consults/2026-10-08-b2-piece-1a-amendment-5-architect-draft.md` on main, below its amendment text. This is my drafting defect.
- Fix: the closing record names that path. The amendment is append-only and is not edited.

## Notes (no fix owed in this PR)

- **N-7, mutation timing.** The worktree reflog puts 507838e2 and 14acee0b 89 seconds apart, so three hand-applied mutation runs fit into a tight window. The line-number evidence above supports observation at 507838e2. The reviewer's own re-runs of R7, K1's added mutation and R8 are the proof; the reviewer should record them.
- **N-8, the blank-basis detail.** A blank basis is refused with the `claim` helper's detail, "an empty claim is not recorded" (`kernel/src/dataset_ref.rs` at 14acee0b, in `claim`), but a basis is not a claim. The variant and the path are as Amendment 5 states, and the worker disclosed it. Reword it when the module is next touched.
- **N-9, attempt 1's N-3 still stands for acceptance.** The reader's ceilings (8 locators, 4,096 bytes per string) are still not in ADR-036. Against docs/14's "fully specified", the ADR should state them or delegate them before the human accepts it. Attempt 1's N-2 (the Snapshot column's version) and S2 (integers above 2^53 − 1) also stay acceptance items.
- **N-10, docs written ahead of 1c.** The code docs say containment "is checked by piece 1c's resolver". That is a design statement routed to 1c's PLAN node, not a claim about 1a's code, so it is not an unsupported guarantee. 1c's form must make it true.
- **N-11, PR body not read.** I had no shell, so I did not read the PR body. The custodian confirms the PR-body half of D-5 (d).
