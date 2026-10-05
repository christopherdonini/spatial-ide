*Custodian's filing note (2026-10-05): PR #175's gate 1, the architect, for PLAN node `timing-assertions-under-contention`, under the tag node:timing-assertions-under-contention@g1. Reviewed: cut/timing-assertions-under-contention @ ede20044ba29918fe1f2433fdfcee98e3abba4af (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 667ee0f3afe78e78042372b6fa0f11da1bb7887893d99f198a4cf1d1eac5648e. Write audit PASS: zero write calls (Read 26, Grep 16, Glob 2, the hand-back 1); the run lasted 00:23:35Z to 00:28:54Z. C3: the run made no write, but the main checkout's porcelain did change during it, by the custodian's own uncommitted filing of the human's 2026-10-05 direction (DECISIONS-PENDING.md, PLAN.yaml, the queue and site, the window draft, the ledger); main did not move from 4398a779. The architect read the code from the read-only export `C:/dev/wt/tauc-head-ede20044` while the reviewer ran mutations in the worktree. Profile paths redacted at filing: none.*

---

Reviewed: cut/timing-assertions-under-contention @ ede20044ba29918fe1f2433fdfcee98e3abba4af

**Verdict: PASS.** Gate 1, architect, PR #175, node `timing-assertions-under-contention`, full gating. No S1, one S2, six notes.

**How I read it.** I have no Bash, so I computed no hash, ran no suite and ran no mutation. I confirmed the branch's shape from the reflog at `.git/worktrees/tauc/logs/HEAD`. The branch starts at acb3d035, which is main with the consult and Amendment 2. It has two commits: 5bb2b104 changes code (`kernel/tests/end_to_end.rs` only), and ede20044 changes `kernel/README.md` only. Amendment 3 and worker report 1 exist only on main, at 4398a779. The export holds only the two changed files plus `adapter_ws.rs`, so I could not check from it that `engine/tests/slice.rs` and the paths under §8 item 4 are untouched. That rests on the custodian's numstat (two files, 35 insertions and 13 deletions) and the reviewer's full diff. Branch lines are named in words at ede20044, with no hash (round 25, item 2 (d)). Main files are read at 4398a779. Nothing below is a quotation; all of it is my paraphrase.

## S1 (blocking)
None.

## S2 (should fix; the PASS stands)

**S2-1. Amendment 3's first line does not say it was written after an outcome had been seen.** The form's header rule (the Append-only line) requires that statement. Amendment 3 was written at 4398a779, after the Phase R consult (acb3d035) and after the code outcome (5bb2b104). Its first line says only that it followed round 53's answer. Amendment 2's first line does make the statement.
- Fix: one sentence in the closing amendment, in round 12 (d)'s form: the defect, the reference (Amendment 3, by amendment), and the proof (acb3d035 is an ancestor of 4398a779). Amendment 3 is not edited.
- This is not on any fail-by-name list.

## N (notes)

**N-1. Ordering assertion: sound.** I checked it against the stamp's real interface (`adapter_ws.rs`, unchanged; first stamp wins at `transport.rs` lines 186-190 at 4398a779). Four other paths also stamp observe_cancel:
- a malformed control frame;
- a receive error;
- a send error;
- peer close.

The first three end in a non-Cancelled terminal. Both tests assert TERM_CANCELLED before ordering: h2_a at line 464 before 473, and h2 at line 412 before 417, of `kernel/tests/end_to_end.rs` at ede20044. Peer close cannot happen before sent_at, because the client closes last. Same clock: the file's header, lines 12-14 at ede20044.

**N-2. h2's kept 5 s message names no start instant** (lines 431-434 at ede20044). That bound, message included, is the span §0.1 pins as the sibling's 5 s bound, and §5 declares it unchanged. So §8 item 5 does not reach it: it is a failure text of a bound declared unchanged, not a report.

**N-3. Amendment 3 cites round 53 with no item number.** Round 53's RULED block has one item, labelled OPEN-1, and the directive's filing note says to cite it as round 53. The cite resolves uniquely.

**N-4. Order line vs code timing.** The A1/A2 code (5bb2b104) came before round 53's row. §8 item 3 applies part by part. A1 and A2 were selected by Amendment 1, and Amendment 1's Unchanged row and round 52 item 2's Applied text let them land after the consult and routing record, which they did. Part B's row selects no code. No breach.

**N-5. The consult names its runner as the tester agent (Sonnet).** §2 and the custodian's brief to me say tester-high. No §5 invalidator depends on which tier ran it. The closing record should name the runner the way the consult does.

**N-6. §7 file count.** The five files §7 names are the form, the README, PLAN, the consult and `end_to_end.rs`. Worker report 1, the ledger, the directives and the gate reports are the custodian's process records, read outside §7's count as #174's gate 1 read its four files. So there is no class-8 overrun. The `RECORDED MUTATION` / `// Mutation:` lines record §4's declared mutations at their tests. They are not a scope addition (no class 9), and they are inside the line ceilings.

## Checklist (form §9, Architect)

**§21a and the form choice.** Full form, correct from dispatch and still correct after the outcome. The piece covers a cancellation guarantee and a property under test (ADR-018), and docs/08:8's enforcement, kept under B-keep. No five-line form exists.

**ADR-018 vocabulary (§8 item 5).**
- Both REPORT lines name the pair (client pre-send → adapter receipt) and say the figure is not cancel_observed. These are lines 423-426 and 479-482 at ede20044.
- The comments above them (lines 421-422 and 477-478) say it is not ADR-018's pair, and that docs/08:8 scores that pair on the producer's clock.
- h2_a's liveness message names its pair (client pre-send → terminal) and says it is not the docs/08 budget (line 467).
- No client→adapter figure is called cancel_observed or a docs/08 result. Pass.

**§8 item 6, and the 5 s bound.**
- The new assertions are ordering and liveness only. Both 100 ms assertions are gone, and no 100 ms literal is left in the file.
- The 5 s bound is a `Duration::from_secs(5)` literal at its site: line 466, and line 432 kept, with no new constant (§7).
- h2_a's wording calls it a liveness bound.
- The human's chosen option for round 52, item 2 names that 5 s liveness bound (`state/questions/round-52.md`, item 2, option 1). So it is ruled, not an undeclared budget under round 25, item 1 (a).

**Round and item cites, each resolved against its RULED block.**
- Round 5, item 3: ordered slice.rs's budgeted-pair assertion.
- Round 25, item 1 (a): the slice.rs precedent rule.
- Round 25, item 2 (a), (c), (d): classes 8 and 9, the mutation wording, and the branch test-text rule, in the template's Round 25 additions.
- Round 31, item 1: placement.
- Round 43, item 2: drafting returns to the architect.
- Round 52, items 1 to 4: hold for Phase R; No; the typed OPEN-3 ruling; propose the harness node.
- Round 53: B-keep, typed.
- The code comment on line 385 at ede20044 cites round 52, item 3.
- All resolve. There is no line cite into `DECISIONS-PENDING.md`.

**§8, item by item.**
1. Pass: Phase R ran at 201f833e, the commit that adds the form.
2. Pass: the code (5bb2b104) descends from acb3d035, which has the consult and Amendment 2. No STOP.
3. Pass: rows at 09827e41 come before the code. §7's command gives 48 lines. By hunk, A1 is 28 (ceiling 40) and A2 is 20 (ceiling 30); I recounted that split from the diff.
4. Pass on the export and the custodian's numstat. The reviewer confirms with the full diff.
5. Pass (above).
6. Pass (above).
7. Not applicable: no W.
8. Pass: each row has its diff and commit, the loaded rows have the loader times, nothing failed, and the void row's logs are filed verbatim. The reviewer checks row by row.
9. Pass: the consult's §10 resolves S1 to S10.
10. Pass: worker report 1 records real applications at 5bb2b104, not `verify-mutation` runs, and the consult disclaims test-of-record status.
11. Pass so far: no record pins branch text by hash.
12. Pass: there is no scope addition.

**Ruling rows against the parts they select.**
- A1 (round 52, item 2): it matches the chosen option's text item by item. The 100 ms assert is removed. TERM_CANCELLED, zero batches and observed are kept. Ordering is added, and so is the 5 s liveness bound. The pair is printed.
- A2 (round 52, item 3, typed): same file, same interval, the same treatment. The name is kept. The one-line comment on line 385 at ede20044 says the name predates the re-aim, which satisfies the typed text. docs/07:21 at 4398a779 still names both functions unchanged.
- B-keep (round 53): Amendment 3 selects no code, and refers to the re-run practice without restating it. On the custodian's numstat, `engine/tests/slice.rs` is untouched; its assertion is at line 816 at 4398a779.

**Amendment 2 against the consult under §5.**
- STOP, W and C: none triggered. This matches the consult's §7.
- R-2 0/20 failed, class 2: matches.
- R-4 H-W untested (largest 43.529 ms, registry_empty true), class 2: matches.
- R-5 to R-7 route nothing: matches.
- The consult's whole-file sha256 is for the reviewer to recompute.

**Round 25, item 2 fail-by-name list.** No §7 overrun, and §7 is unedited. No scope addition. No `verify-mutation` wording. No branch test-text pinned by hash. No five-line form. Nothing trips.

## Closing-record list (D-5), after the merge

References and hashes only. Use full ids from `git rev-parse`; every rev must be on main (round 15 (e)). Merge with a merge commit, as PLAN's `merge: merge-commit` says, so 5bb2b104 stays reachable. That keeps README's Last verified at, and the pins below, on main. A squash would orphan both.

1. The amendment's first line says it was written after the outcome. Class 1.
2. D-1: Amendment 2, by amendment. It already carries the consult's whole-file hash, so do not restate it.
3. D-2: Amendment 2, by amendment. No W node.
4. D-3: Amendments 1 and 3, by amendment (round 52, items 1 to 4; round 53).
5. D-4, the tests:
   - `kernel/tests/end_to_end.rs::h2_a_cancel_before_the_first_batch_still_stops_the_query` and `::h2_cancellation_is_observed_by_the_producer_inside_the_budget`.
   - Spans pinned `kernel/tests/end_to_end.rs:<a>-<b> @ 5bb2b104… sha256:<hex>`, each written on one line.
6. D-4, the mutations: M-A1a on h2_a, M-A1b on h2_a, and M-A1b on h2, observed at 5bb2b104.
   - Worker report 1: `state/consults/2026-10-04-timing-assertions-under-contention-worker-report-1.md` @ 4398a779 sha256:<whole file>.
   - The reviewer's gate report, by path, for its own observations.
7. §7: 48 lines by §7's command at ede20044, against ceilings of 40 + 30, and 5 files. No class 8.
8. S2-1's one-sentence correction.
9. PR #175's merge commit id, and `kernel/README.md` by file @ that merge commit.
10. Both gate reports, by path under `state/consults/gates/`.

**Done commit (PLAN.yaml):** status done, dates.done, and evidence `{pr}` only in that commit. Then re-check the status of the dependants `slice-budgets-cancel-cells-on-trace-pair` and `data-plane-terminal-without-credit`.

**Files:**
- `C:\dev\spatial-ide\kernel\TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`
- `C:\dev\wt\tauc-head-ede20044\kernel\tests\end_to_end.rs`
- `C:\dev\wt\tauc-head-ede20044\kernel\README.md`
- `C:\dev\wt\tauc-head-ede20044\protocol\data-plane\src\adapter_ws.rs`
- `C:\dev\spatial-ide\state\consults\2026-10-04-timing-assertions-under-contention-reproduction.md`
- `C:\dev\spatial-ide\state\consults\2026-10-04-timing-assertions-under-contention-worker-report-1.md`
- `C:\dev\spatial-ide\PLAN.yaml` (node `timing-assertions-under-contention`)
