VERDICT: PASS
Reviewed cut/port-1-linux-l1 @ eddcb28. PR #162, gate 1, architect.

## S1 (blocking)

None.

## S2 (fix in this PR, comment-only, inside §7's file list; this gate does not need to re-run)

1. **The cfg-boundary.mjs header states a rule that nobody ruled.** Lines 19-20 of `scripts/plan/cfg-boundary.mjs` at eddcb28 say an allowlist entry is added "never by the piece that needs it". The form's §2 item 3(e) asks the header to say only that an entry is added by an architect-reviewed change. I10 limits allowlist growth for this piece alone. PORTABILITY §6 scope 2 (`state/directives/PORTABILITY-2026-09-30.md:119-133 @ d310206`, the form's pin) says the list grows only by an architect-reviewed change. The extra clause would also contradict the directive's own PORT-2 row (§3 there): that piece replaces the two resolvers with one application-directory boundary, and it is the piece that needs the new entry. Delete the clause.
2. **The product-ci-rust comments claim more than §1 allows.** In `.github/workflows/product-ci-rust.yml` at eddcb28:
   - Lines 37-39 say the pin exists "so that the image does not move under the entry". §1's may-not-claim (the `ubuntu-24.04` image keeping its contents after E1) disclaims exactly that. Say that the OS release is pinned and the image contents still change.
   - Lines 39-41 say the Linux entry "catches" separator and case assumptions. It catches only those the suite exercises. Restore the conditional.
3. **A comment now sits above the wrong step.** In product-ci-rust at eddcb28, the build-step comment (lines 212-215) is now above `Runner profile (Linux)` instead of `Build the workspace and every test target`. Move the profile step above the comment, or the comment down to the build step.

## Judgments per §9

- **Gating line:** correct.
  - §21c binds: about 600 lines over 13 files, against the 150-line / 8-file threshold.
  - Not wire.
  - No posture change: the new job runs under the workflow-level `contents: read` with `persist-credentials: false` and uses no `secrets.`.
  - The guarantee head is engaged by KNOWN-LIMITATIONS 1.
- **Round 33, items 6 and 7, and round 39, item 1:**
  - The Linux entry is `ubuntu-24.04` (round 39, item 1).
  - KNOWN-LIMITATIONS 1 gives Windows 10/11 x64, Ubuntu 24.04 x64 for L1 (workspace) only, and macOS with no level. This matches item 7's adopted profiles (`state/questions/round-33.md:45-47 @ d310206`, the form's pin) and claims nothing beyond L1 for Linux.
  - Item 6 (PORT-1 now) is satisfied.
- **PORTABILITY §6, scope 1 to 5:** all present.
  - Scope 1 is pinned per round 39. The job name carries the level, and the list step is there.
  - Scope 2 is the check. Scope 3 is the comment. Scope 4 is the KNOWN-LIMITATIONS paragraph. Scope 5 is the template line.
- **PORTABILITY §6 acceptance:** met, per Amendment 1 items 1, 2 and 4 and the worker's P4 and E3b record (the reviewer re-reads them by run id).
  - The Linux job is green with 0 failed.
  - Every Linux-only ignore names its boundary (P2).
  - The Windows lists are unchanged (P4).
  - The check is green on the tree and red on the planted `engine/src/predicate.rs` (E3b).
  - The KNOWN-LIMITATIONS scope is right, and there is no new dependency.
  - "Passes on main" is E4's, after the merge.
- **R1 to R6:**
  - R1 and R2: clean.
  - The normalize.rs conversion is R2's permitted test form, inside `#[cfg(test)] mod tests`.
  - R3: this is not an OS-dependent feature, and §2 item 10 answers it anyway.
  - R4: no exclusion is added.
  - R5: the levels are not implied upward.
  - R6: all 15 reasons name their boundary, and both entries print the list.
  - The normalize.rs ignore has no deferral record. That is correct, because nothing is deferred: Linux's case-sensitive compare is the policy. The macOS case belongs to PORT-2 (directive 1c-2).
  - **The R3 template line against its pin** (`state/directives/PORTABILITY-2026-09-30.md:49-54 @ d310206`, its hash in the template line): the line is a paraphrase that covers the boundary, the three platforms in three grades, tests and deferrals, and KNOWN-LIMITATIONS. It reproduces nothing.
- **Point (d), the allowlist:**
  - It matches the directive's §2 table (`state/directives/PORTABILITY-2026-09-30.md:31-65 @ d310206`) row for row and label for label, as §2 item 3(e) gives them. Prepare (not built) is rightly absent, and `tauri.conf.json` is not `.rs`.
  - The `frontends/shell/src-tauri/` prefix follows the table's directory-level entry.
  - No additions from me.
  - Consequence (a note): the check cannot see anything inside src-tauri, and R4 there stays with the gates (PORT-3).
- **Intake table:** each disposition is sound. Routing EDQUOT/EPERM and SIGTERM out is correct: one is a user-visible error class, and the other falls under ADR-018.
- **Seam reading and caller rule:**
  - The CLI has no export, flag or option.
  - Its only product caller is the `cfg-boundary` job, landed in the same PR.
  - The tests spawn the real CLI on the real tree and on `HEAD` files.
  - The end-to-end runs from the real shape are E1, E2 and E3b.
- **Round 7, operator-visible text:** the three messages (outside every boundary; no file list, git ls-files failed; takes no arguments) state the check's own facts and no other module's consequence.
- **Round 25, item 2:**
  - (a) No overrun: 600 of 750 lines, 13 of 13 files. The reviewer recounts.
  - (a) No scope addition.
  - (c) Wording is correct: the hand-back says verify-mutation found the mutations recorded, and each `RECORDED MUTATION` names its observation commit, 824d561.
  - (d) No test-text span in any record.
  - (e) No five-line form.
- **Point (a), one line per site:** the custodian's reading is the form's own text.
  - §7 declares stdout per site, and §0 counts `origin.rs` as 2. S1's "18 site lines" and T1's per-file assertion agree with both.
  - Hand-back 1's premise was wrong: printing per site gives 18 lines, one of them repeated, not 17.
  - No amendment is owed. The reading changes no text, and no §10 class fits a reading. The template forbids inventing a class (`docs/PREREGISTRATION-TEMPLATE.md:96-99 @ d310206`).
  - No §8 item touches it.
  - §2 item 0's "re-derived … and recorded before any code" is met by hand-back 1. It came before a886894 and is filed on main (e2bba91). The closing record should cite it by path.
- **Point (b), the template line:** it conforms.
  - §2 item 8, §7 (estimate 1) and §8 item 9 require exactly one appended line, and a blank separator would be a second line.
  - The reason for appending at the end (no cited line moves) is met.
  - In rendered Markdown it merges into round 25 (e)'s paragraph, under the Round 25 heading. That placement follows from the form, which I drafted. The line's own parenthetical carries its real source (R3, PLAN node).
  - Not a finding. A note follows in N.
- **Point (c), Amendment 1, P3 and I7:**
  - **I7's reading is right.** I7 carries its own disposition: record as class 2, report the unlisted compile-out. "Stops the piece" means the piece holds until that disposition is done, and the gates now judge it.
  - **No falsification line fires.** "Green with a test excluded" has to be read as covering only an exclusion this piece adds. On that reading the three disclosed watcher targets already pass, and these two tests are the same kind, and older than this piece.
  - **On the boundary in the sense of R2 and R4: yes.** `#[cfg(windows)] mod windows_watch` (`engine/src/watch.rs`, line 103 at eddcb28) is the file-watching boundary's Windows mechanism. Both tests call its private functions over `windows_sys` types and have nothing to test off Windows.
    - R4's declared-limitation clause covers it, via KNOWN-LIMITATIONS 24.
    - R6's last clause (a whole module excluded so a platform passes) does not apply. The module is the explicit platform implementation R2 asks for, not an exclusion made for Linux.
  - **KNOWN-LIMITATIONS 1's Linux line holds.** It states a gap, not a capability, and the two tests are the file watcher's own tests. It claims no more than the evidence.
  - **Owed beyond the report:** nothing.
    - The report is information for the human. It needs no question item, since under R4 this is not a finding.
    - The closing record references Amendment 1 item 3.
- **§8, item by item:**
  - 1: the Windows name is byte-identical (P5). The commands, toolchain, cache key (`${{ matrix.os }}-workspace`) and timeout 90 are unchanged.
  - 2: none present. `--list --ignored` is the declared list command.
  - 3: no install. The actions in use are checkout, rust-toolchain, rust-cache and setup-node only.
  - 4: product-ci-rust's triggers, paths and concurrency are unchanged, and so is the `plan` job. The new job has no permissions and no `secrets.`.
  - 5: no test added, removed or renamed. The only platform ignore is §2 item 6. All 18 reasons are §7's strings.
  - 6: no product source change. The new `cfg_attr` sits inside `#[cfg(test)] mod tests`.
  - 7: the allowlist is the table. No flag, export, dependency or network call. A git failure exits 2.
  - 8: clean, and only item 1 is edited (the reviewer confirms with the diff).
  - 9: one line appended.
  - 10: §7's files plus the form.
  - 11: no force-push is recorded. The probe is deleted and not at the head.
  - 12: pending, merge-commit.
  - 13: none.
  - 14: none new. Each `RECORDED MUTATION` gives the program's output, not a source text.
  - 15: clean.
  - 16: clean.
  - 17: clean.
    - Amendment 1's heading and first line say post-result, in WORKSPACE-RUSTFMT Amendment 1's shape.
    - It carries run ids and commit ids, with no hash at a branch commit and no bare self-line.
    - Its superseded index is present.

## N

1. The `RECORDED MUTATION` text for M4 and M6 (test file, at eddcb28) says "with the message" and then gives wording that is not the message. 6c3cd63 reworded those two to avoid verify-cites. The text carries no quotation marks, so the round 10 rule does not apply. If the file is touched again, "reporting" would be the accurate word.
2. Governance-ci at eddcb28, which adds only the form, should be read green before the click. E2 is at 6c3cd63.
3. The next template append should open its own heading, so it does not sit under round 25's attribution. This is a note, not a clause (record cap).
4. For PORT-2's form: derive P3 from a sorted `--list` set difference at P1, not from greps of test targets. That would have caught the two unit tests. This is a note only.
5. T1 pins the tree's exact site counts. Any architect-approved boundary edit (PORT-2) must update T1 in the same PR. This is by design (S1).
6. The comment block in governance-ci that says the filters are "deliberately not widened to the whole tree" is now partly overtaken by `**/*.rs`. The new header line discloses the effect.

## ADR

None needed.
