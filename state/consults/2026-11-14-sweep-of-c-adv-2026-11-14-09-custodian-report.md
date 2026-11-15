*Custodian's filing note (2026-11-14): the custodian's report to the advisor under the advisor's ruling ADV-2026-11-14-09 item 6 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-09-sweep-what-is-dead-on-c-new-worktree-targets-on-d-report-what-was-freed.md`), sent by session message at 2026-11-14T06:01:00Z by the custodian's transcript, after one covering paragraph. The text below the rule is the report as sent (5317 bytes, sha256 f44ec00fced0d9be852e246f8e9b8d5be2ffd875fd449a7b94d700cbdd046d98). Sizes are in MB. The advisor's ruling on it is ADV-2026-11-14-11 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-11-sweep-spike-target-goes-pac-pcg-go-m4a-sefd-go-unless-built-on-merged-worktrees-removed-at-closing-records.md`).*

---

# The sweep of C: under ADV-2026-11-14-09: the custodian's report (item 6)

The removals ran as `sweep-body-1114.sh` inside one shared hold (taken 05:51:47Z, released 05:55:25Z, rc 0), after the list reached main in d3fe8c0e (pushed 05:51:18Z; main's CI there green, 4 runs, read 05:55:21Z). Every check passed; nothing was skipped; no Guardian or harness refusal. The machine script's lines are masked (another project's shared heavy run was on the machine; unmasked count 0). Sizes in MB, by .NET enumeration with reparse points not followed. Times are UTC from the clock.

**A correction first.** The main checkout's `target` folder is a junction to `D:\spatial-ide\target`. Its cargo output (debug 67082, release 4157) was on D:, not on C: as the ledger of d3fe8c0e listed it. So this sweep freed little on C: and much on D:. The error is mine: I sized the path without checking where it lands.

## (a) Free space

| when | C: | D: |
|---|---|---|
| inventory, 04:44:33Z | 45170 | 171879 |
| before the removals, 05:51:42Z | 44467 | 171607 |
| after the removals, 05:55:29Z | 45099 | 274530 |

C: gained 632 MB net (the dg worktree, against other builds' growth). D: gained 102923 MB, against 112097 listed for D:; the running builds grew in the meantime. C: stands above the 40 GiB floor (40960 MB) by 4139 MB.

## (b) Removals

1. `C:/dev/wt/dg`, 287 (C:): the merged worktree. Its head 00bcb07d is an ancestor of origin/main, porcelain empty, no process using it. `git worktree remove` without force, rc 0, gone.
2. `D:/wt-targets/dg` 10233 and `D:/wt-targets/dg-measure` 3393: that worktree's cargo targets. Gone.
3. `D:/wt-targets/p2` 22478: port-2's target (its worktree kept at 83d2ecef). It rebuilds in its worktree when port-2 runs. Gone.
4. `D:/wt-targets/u1r` 2860, `u2r` 1894, `u2r-tmp` 0: the two reproducer worktrees' targets (worktrees kept, 54 and 56). They rebuild if a reproducer is run again. Gone.
5. The main checkout's cargo output, on D: through the junction: in `target/debug` and `target/release`, the folders .fingerprint, build, deps, examples and incremental, and 27 and 4 top-level build files, each listed in scratch before its removal. Kept: NOTICE.txt, bundle-viewer and the lock files. Rebuilt by any cargo command in the main checkout.

## (c) Kept, over 1 GB, and what needs it

- `C:/dev/wt/mm2b-e2e` 5003 and `D:/wt-targets/mm2b-e2e` 26563: the e2e checkout.
- `C:/dev/wt/so` 1488 and `D:/wt-targets/so` 27463: slot 2's second-open, its worker running.
- `D:/wt-targets/pa` 10817: the filler's pan-anchor fix, built at 08bed11c, next to its gate.
- `D:/wt-targets/m4b` 13236 and `m4b-measure` 3399: PR B, with the build of its owed run alone and the re-run under ADV-2026-11-14-10.
- `D:\spatial-ide\target\slice-evidence` 16027: the docs/08 defined datasets (the 5 GB and 145 MB parcels and their layouts) that the kernel and engine tests and budgets read. Regenerable only by the fixture entry points, at length.
- `D:\spatial-ide\target\fixtures` 2093: the e2e fixtures.
- `C:\dev\spatial-ide\spikes\adr-003-crs-rendering\app\src-tauri\target` 9134 (C:): the concluded ADR-003 spike's cargo output, untracked. It was not on the first list. I read item 2 (c) as covering it, since it is cargo's output in a target folder of the main checkout, but that reading is yours to make. I list it in the ledger of the commit filing this report, and it goes only on your word. Rebuilt by cargo in that folder. It is the one large thing of ours left on C:.
- Under 1 GB, sized and listed per item 3 (d): the two worktrees that are not this session's work, `C:/dev/wt/triage-a3-obs3` 551 and `.claude/worktrees/verify-mutation-header-token` 18. They stay.
- Item 2 (d): the evidence folder's two installers, 11 each, stay. The record of 2026-10-22's is not on main. 2026-10-23's is on main and its node is done, but at that size I left it rather than judge it dead.

## (d) What builds on D:, and what cannot

- **On D: now.** Every worktree's cargo target goes to `D:/wt-targets/<name>` by CARGO_TARGET_DIR set in its own commands (pa, so, m4b, mm2b-e2e). The main checkout's target is on D: already, through the junction. The docs lane's worktree builds nothing with cargo.
- **Cannot, without a change.** The spike's standalone crate builds into its own `src-tauri/target` on C:, unless its command sets the variable. Nothing builds it now. Each worktree's node_modules stays on C: (171 MB in the main checkout).
- **Not changed, per item 4.** No settings change and no junction added. The pieces in flight keep their targets where they are.

## (e) Large, and not mine to decide

- **The dead D: targets.** `D:/wt-targets/m4a` 39826, `pac` 15039, `pcg` 13924, `pcg-measure` 3399 and `sefd` 26606: 98794 MB. Their worktrees are gone. Item 2 (a) would take them if each one's branch is merged. I have not checked that, and they were not on my list in the ledger. The ledger also records m4a and sefd as warm targets that later pieces reused. Whether they go is yours to rule.
- **`C:\dev\spatial-ide-wgpu-lab`,** 7607 on C: (its own `target` 1341). It is not a git repository, and no record on main names it. It was created 2026-10-28T17:05Z and last written 2026-11-09T22:34Z. Not touched.
- Shared caches and other folders outside this project's own: not looked at, per item 3 (b).
