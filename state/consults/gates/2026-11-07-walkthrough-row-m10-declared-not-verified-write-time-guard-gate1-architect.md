Reviewed: PR #293 at 2abc75cc503ed4af163e1706c050fe9a8040513f (base 0bd29263), gate 1, architect

Verdict: PASS WITH NOTES

Branch reviewed: `cut/walkthrough-row-m10-declared-not-verified-write-time-guard @ 2abc75cc503ed4af163e1706c050fe9a8040513f`, read in `C:/dev/wt/m10`. I have no shell. I could not confirm that the worktree's HEAD is 2abc75cc, I could not compute the packet's sha256 (fe7509946c65…), and I could not run `git diff`, `git log` or `gh`. My evidence is the Read and Grep calls in this transcript, plus the packet and the worker report where I say so. I leave no background shell.

## Findings by class

- **Correctness:** none.
- **Evidence:** none.
- **Documentation (must-fix before the merge):** none.
- **Notes (my words; preferences, not acceptance conditions; Part 1 item 6):**
  - **N-1 (for the human, at the click).** The unchanged sentence right after the span is out of Scope (rule 2.0 (a)). It begins "**By design, this refusal produces NO audit record at all**" (byte-copied from line 884), and it means the preflight `ReaderCeilingExceeded` refusal. The new span now puts a second refusal just before it, and that write-time refusal is audited. `kernel/tests/publish_identity_tier.rs:565-571 @ 2abc75cc…` asserts one intent and one `refused` outcome of kind `CeilingExceeded`. A reader could take "this refusal" to mean the write-time one. Nothing in the span is untrue, and the residual is not exercised in this step, so this does not block. If the human wants the point made, a word in the span such as "(that refusal is audited)" would rest on that test. That is a scope change for the human, not this gate's to require.
  - **N-2 (named case, not reachable in ordinary use).** In the partition loop, `MAX_PUBLISH_PARTITIONS` (100,000) is checked before `MAX_FEATURES` (`kernel/src/publish/mod.rs:826-837 @ 2abc75cc…`; `engine/src/stream.rs:174 @ 2abc75cc…`). A `DeclaredNotVerified` source whose partitions average 20 rows or fewer (byte-target cut, `engine/src/stream.rs:131`) would be refused for partitions first. It would carry the same code, `publish.ceiling_exceeded`, but not "by the write-time `MAX_FEATURES` check". No product route opens such a dataset (clause 9 below), so ordinary use cannot reach it. Under §31 it is named here for the source comment, not blocked.
  - **N-3 (Guarantee: what no test pins).** Three clauses are true of the code but not pinned by any test:
    - "before the partition that would cross the ceiling is written": moving the call after `write_partition` would survive K-U10b, because staging is removed either way.
    - "can still reach the approval dialog": no shell test drives a `DeclaredNotVerified` dataset through `prepare_with_progress`.
    - "no product route …": this is an absence shown by Grep, not by a test.

## Check 1: the clause table at the head

Rule 2.0 (d): the code was re-read at the head, and each site was found by its content. All line numbers below are `@ 2abc75cc…`.

| # | Clause (byte-copied from line 884) | Code at the head | Holds |
|---|---|---|---|
| 1 | "its pin still runs" | `kernel/src/publish/ceilings.rs:172-177` (`verified_rows` `None` gives `None`); `:144` (refuses only on `Some`); `kernel/src/publish/mod.rs:574-578`; shell `frontends/shell/src-tauri/src/publish.rs:455` (`preflight_pinless`), then `:468` (`ensure_pinned_with_progress`); kernel statement `mod.rs:418-421`; test `publish_identity_tier.rs:535,542` | yes |
| 2 | "the attempt can still reach the approval dialog" | shell `publish.rs:581-592` (`preflight` refuses nothing on features for `None`); doc `publish.rs:411-413` | yes |
| 3 | "over the ceiling it is refused only once the publish runs" | `ceilings.rs:144`; the guard is in `run_inner` at `mod.rs:837`, reached via `publish_prepared` `:645-663` and `run` `:696-705`; shell execute path `publish.rs:863,891-893` | yes |
| 4 | "by the write-time `MAX_FEATURES` check (`ceilings::check_streamed_features`, in the partition loop)" | `ceilings.rs:187-201`; call at `mod.rs:837`, inside the partition loop | yes (N-2 names the edge) |
| 5 | "as `publish.ceiling_exceeded` and not `publish.reader_ceiling_exceeded`" | `ceilings.rs:194-198` (`CeilingExceeded`); `error.rs:298-299`; `refusal_detail` `error.rs:312-314`; shell `publish.rs:891-893`; test `publish_identity_tier.rs:546-556` | yes |
| 6 | "before the partition that would cross the ceiling is written" | `ceilings.rs:192-193` (`saw > max_features`); `mod.rs:837` before `write_partition` at `:839`; `rows_total` increased at `:846` | yes (untested, N-3) |
| 7 | "with nothing left at the destination" | `mod.rs:656-661` (the destination must not exist; staging created); `:1542` (staging beside the destination); `:663-677` (removed, or `StagingNotRemoved`); destination only by `finalize` `:1703-1709`; test `no_side_effect` `publish_identity_tier.rs:174-190`, called at `:557` | yes |
| 8 | "no product route opens a dataset `DeclaredNotVerified` — the wire carries no skip-uniqueness field" | `kernel/src/skp.rs:1726-1738`; `engine/src/identity.rs:176-183` (`false`); Grep of `*.rs` for `skip_uniqueness_check` set `true`: 5 files, all under `kernel/tests/` or `engine/tests/`; Grep of `protocol/` for `skip_uniqueness`: no files; `frontends/` has a comment only (`publish.rs:405`); kernel statement `mod.rs:1495-1498` | yes |
| 9 | "so ordinary use does not reach this" | follows from clause 8 | yes |
| R | retained context: "has no predictable feature count either way", "`parcels-5gb.parquet`'s `NativeUnique` identity …" | `mod.rs:412-414`; `ceilings.rs:119-121`, `:172-177` | yes |

The span at the head matches section 2.1's new span byte for byte: a Grep of the full span as a regex finds 1 occurrence in the file. A Grep of the span together with its retained neighbours (the lead-in "has no predictable feature count either way — " and the "`parcels-5gb.parquet`'s … **By design, this refusal produces NO audit record at all**" tail) also finds 1. A Grep of the old span with the same neighbours finds it at line 884 on main, where the file is unchanged since the base (per the packet). No clause is untrue, so no replacement words are needed. The span is an agent's wording, not the human's.

## Check 2: whose words (§31)

- The worker report (`state/consults/2026-11-07-walkthrough-row-m10-declared-not-verified-write-time-guard-worker-report.md`, its Built section) says `git log -L` over line 884 at the base names f8e2d43ab136bf3407587fd9a0333dd2336d3b92 as the one commit that wrote the old span. It says the commit's trailer is Co-Authored-By: Claude Fable 5.1, and that `git log -S` on the full span returns only that commit.
- Rule 2.0 (e) is met on that evidence: the span is not the human's typed words, so nothing is held.
- I could not read the PR body (no `gh`), and I could not re-run `git log -L`. The reviewer's run is the check of record.

## Check 3: block-on-sight (§8), against the head

1. **No hunk in the result log or a run record:** holds. The first `## Result log` is at line 987, and the edit is at line 884. The numstat from the packet and the worker report is 1/1.
2. **No edit outside the file or outside M10's span:** holds. The packet's numstat names one file, and the neighbour Grep above (count 1) shows the rest of the line unchanged around the span. I rely on the worker's full-line equality script for the rest of the line.
3. **No line added or removed:** holds (numstat 1/1; the worker reports 2006 = 2006 lines).
4. **No timing or figure in the new span:** holds. `MAX_FEATURES` is named, and no number is given.
5. **No clause without a code cite:** holds (see the table).
6. **No verbatim quote that fails to byte-match:** holds. The span carries no quotation, and the form's "Old" span matches line 884 at main.
7. **No line cite into `governance/DECISIONS-PENDING.md`:** holds. The span has none. The unchanged "entry 7" is an entry number.
8. **No bare self-line in the form:** holds. The form's short cites (`:367`, `:468` and the like) continue cites into other files. The form is not in this diff.
9. **No edit to the human's span without the §31 answer:** holds (check 2).
- Round 25 items: no §7 overrun (2 lines against a ceiling of 10); no scope addition; no test-text span; no five-line dispatch.

## Check 4: constitution

- **docs/01:** no conflict. The span names a residual honestly (principle 8) and claims no undo (derived rule 6).
- **docs/09:** no conflict. The span is not security posture.
- **ADR-025** (Accepted: refuse, typed, at preflight): the span states the case preflight cannot predict, as the code names it (`mod.rs:410-423`, `ceilings.rs:117-125`). It changes no ADR text and claims no preflight refusal for that case.
- **ADR-016 §5:** consistent with clause 8.
- **Guarantee (touched):** the span restates the write-time refusal truly. The refusal kind, the ceiling, the limit, saw > limit, and the absence of destination and staging are pinned by `an_unverified_file_above_the_ceiling_is_refused_by_the_write_time_guard_and_leaves_nothing` (`kernel/tests/publish_identity_tier.rs:516`, `#[ignore]`d, run by hand in release, not in CI, as the form's Gating says). The `>` boundary is pinned by `ceilings.rs:358` and `:367`. The span claims no limit or measurement beyond the code. The clauses no test pins are listed in N-3.

## For the human

- N-1: the wording of the adjacent audit sentence, at the click.
- The span's words are an agent's, and you see them at the click (Part 1 item 1).

## Packet gaps

- The PR body's text, needed for check 2's "from the PR body". I have no `gh`.
- Whether the code files changed between fbc905ec, the form's pins, and the head. I found every site by content instead.
- Nothing stated that the worker report lives on main only. It is absent from `C:/dev/wt/m10`, and I read it at `C:/dev/spatial-ide`.

Files read: `C:/dev/wt/m10/governance/forms/frontends/WALKTHROUGH-ROW-M10-DECLARED-NOT-VERIFIED-WRITE-TIME-GUARD-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/2026-11-07-walkthrough-row-m10-declared-not-verified-write-time-guard-worker-report.md`, `C:/dev/wt/m10/frontends/shell/MANUAL-WALKTHROUGH.md`, `C:/dev/wt/m10/kernel/src/publish/{ceilings.rs,mod.rs,error.rs}`, `C:/dev/wt/m10/kernel/tests/publish_identity_tier.rs`, `C:/dev/wt/m10/frontends/shell/src-tauri/src/publish.rs`, `C:/dev/wt/m10/kernel/src/skp.rs`, `C:/dev/wt/m10/engine/src/{identity.rs,stream.rs}`.
