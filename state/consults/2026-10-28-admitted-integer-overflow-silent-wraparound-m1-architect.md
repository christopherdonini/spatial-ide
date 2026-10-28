*Custodian's filing note (2026-10-28): the architect's read-only consult on O1's M1, filed at the REPORT PATH its brief named. Its answer: the cheap sefd run as the human described it does not count as M1 (the probe worktree's old tree with an untracked copy of the test is not a commit a gate can resolve); with two config entries, M1 is both entries removed (the MSVC build main ships); T-A as worded panics before the T-o cells, so T-o under M1 would go unobserved unless T-A collects every cell's terminal first; the words take a class 4 amendment. The custodian's settlement, by the human's own OPEN-5 words (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md`: if the architect shows that run does not count, book the MSVC build on the custodian's estimate): M1 runs on the form's dedicated MSVC target, not on sefd; T-A collects every cell's terminal before it asserts. Both go into the form's Amendment 4. The run 10:00:04Z to 10:03:19Z by its transcript (Read 10, Grep 2; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 4fcdab1952c5861d51f8b8b1990ee2ff7e23b8dd16041cfae12c2af8bbbcda3d.*

---

Answered: O1 M1, architect. Read at main @ 958c986d (the session's start snapshot; I have no shell, so I could not confirm HEAD or compute any sha256, including the brief's). This is a consult, not a gate, so it has no verdict. Everything outside quotation marks is my own wording. Each quotation is copied byte for byte from the line cited beside it.

Short names: F = engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md · DA = state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md · DD = state/directives/2026-10-27-o1-route-a-continues-duckdb-export-decorations-off-by-the-header-switch.md · LR = state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-reading-lead-data.md · R1 = state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-run-tester-high-report.md · R2 = state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-second-run-tester-high-report.md · R0 = state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-run-tester-high-report.md · T = docs/PREREGISTRATION-TEMPLATE.md.

## (1) The sefd run with both entries absent

**The build: yes, it is the build M1 needs.**
- M1 is "**M1:** the `[env]` line removed from `.cargo/config.toml`, in a dedicated MSVC target, a Windows rebuild (OPEN-5)." (F:182). It was written when the config had one entry (F:77-85).
- Amendment 2 added the define (F:409-416). With both entries absent, the tree builds as main ships today: cl.exe, no define, libduckdb-sys 1.10505.0.
- That is the "MSVC" build the words name. It is the build whose wrong rows founded the defect: L1 delivered 0 rows against X = 2048 (R0:347), and the S cells wrapped (R0:335-343).
- sefd can hold no other DuckDB build that compiled:
  - clang-cl without the define does not build (R1:46-59);
  - clang-cl with the define was built only on the o1-clang target (R2:84);
  - cl.exe with the define was never configured anywhere.
- One caveat: on sefd the compiler is inferred from behaviour, not named in the log (R0:363-364).

**The run as the human described it: no, it does not count.** DA:19 describes it as "the pinned test alone against the existing MSVC build in the probe worktree on sefd, no config change in that worktree, so nothing rebuilds". The probe worktree is at fb361420 (R0:16), so the test file would be copied onto a tree that is not the piece's.
- T:172 requires the observation of record to be "applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it". F:188 says the same.
- fb361420 plus an untracked copy of the test is not a commit. Its engine tree and lockfile are also not the piece's: main has merged engine work since 2026-10-25.
- So the observation would be of a different program, against no commit a gate can resolve.

**What counts, at the human's cost:**
1. Detach the probe worktree (it lives outside `.claude/worktrees/`) at the piece's branch commit that holds the pinned test.
2. Delete the tracked `.cargo/config.toml`. Deleting it is M1 itself. The worktree then holds no config, as it does today, which keeps to DA:19's "no config change" in effect. Also check that no `CXX_*` or `CXXFLAGS_*` variable is set in the process environment.
3. Run `cargo test -v -p spatial-engine --locked --test admitted_integer_overflow` on sefd, in a shared hold.
4. Record:
   - the commit;
   - T-A, T-C and T-E failing by name at the cells F:182, F:184 and F:186 predict;
   - whether the `-v` log shows libduckdb-sys as `Fresh` or `Compiling`.
5. Restore the file.

Only path crates should recompile, since the lockfile's duckdb version is unchanged (F:65). If libduckdb-sys does recompile because a rerun-tracked variable differs, it still builds both-absent, so the observation stands. It has then spent the booked build's cost on a shared target, and the record says so.

One more condition: no other dispatch builds on sefd during the run. A path-crate rlib from another worktree can reach a shared target; this is the risk F:238 guards against.

**A gap in M1's claim, independent of the target.**
- F:182 says: "The same run is the first behavioural observation of the one-sided hole on MSVC; whether T-o wraps there is recorded as a result."
- But T-A is predicted to fail at the first W cell, S-ar-n P1 (F:182). A test that panics there never runs the T-o cells.
- Either T-A collects every cell's terminal before it asserts and prints them in its failure message (test text only, no `pub` item), or the record states that T-o under M1 was unobserved, in the terms of OPEN-5 (B) (F:318).

## (2) Removing one entry only
- **The define alone removed (clang-cl, no define):** not M1. It is not an MSVC build, and the words say "MSVC target". It has been observed: it is P0's first attempt, and the build fails (R1:46-59). A build failure is not a named test failure, so it cannot be a mutation observation.
- **The CXX line alone removed (cl.exe with `-DDUCKDB_STATIC_BUILD`):** a third build that the form never registers. Nobody has observed it. That the define changes only export decorations is a source reading (R2:50-54), not a behavioural observation. It is a different mutation from the one the words name.
- The words, read for their purpose, name the build that existed before the piece. With two entries, that means both removed. LR:149 raises the same reading.

## (3) What M1 should say, in the form's own terms
"M1: both `[env]` entries removed from `.cargo/config.toml` (the MSVC build main ships: cl.exe, no define), observed at the piece's commit that holds the test."
- The target is sefd, on the human's OPEN-5 answer (DA:19; the settlement at F:388), in the shape given in (1).
- If that shape cannot be met, the target is the dedicated `D:/wt-targets/o1-msvc` (F:279).

Cost of the booked fallback, under the machine rules:
- one cold MSVC DuckDB build plus one short test run, in one shared hold;
- disk: 10–16 GB of target (F:261), with D: at 155 GB free (R2:80);
- time: the form's reference figures are about 18 min, 25–35 min and 41 min cold on CI (F:331). These are not measurements. The pinned test's own run is seconds, judging by the probe runs (R2:99).

## (4) Amendment class
- **Class 4** (T:115-118): a mutation mis-described since Amendment 2, corrected on the architect's call that Amendment 3 names (F:429). Its first line says it was written after P0's results were seen (F:3, F:11).
- It should cite the human's OPEN-5 answer by the directive's path, so that F:182 ("dedicated MSVC target") and §8 item 1 (F:238: "Any P0 step committed, or P0 or M1 run on a shared cargo target (sefd or any other).") are not read against the sefd run. That is a record item and must be fixed before the merge. It does not block.
- The observation itself is recorded later, with its commit, as T:172 has it.
- Neither class 5 nor class 9 fits: nothing is narrowed and no work is added. I wrote no amendment text.

Files: C:/dev/spatial-ide/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md, C:/dev/spatial-ide/state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md, C:/dev/spatial-ide/state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-reading-lead-data.md, C:/dev/spatial-ide/state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-second-run-tester-high-report.md, C:/dev/spatial-ide/state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-run-tester-high-report.md, C:/dev/spatial-ide/state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-run-tester-high-report.md, C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
