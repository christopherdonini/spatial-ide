Reviewed: PR 359, the branch cut/console-stream-lane at 8b8c38815a5fbc1e41e392366784a7c1c51a5783, in C:/dev/wt/console67 (the custodian's filing note, 2026-11-23: the reviewer, on Sonnet, closing Doc-1 of the architect's narrow attempt (`state/consults/gates/2026-11-23-console-stream-lane-a3-architect-narrow.md`), node:console-stream-lane-limitation-67@a3-doc1-reviewer, dispatched at 2026-11-23T10:28:12.198Z; its run: Bash 11, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-23T10:28:12.312Z to 2026-11-23T10:31:13.252Z by its transcript. Filed below the rule from its hand-back, 3608 bytes, sha256 e87042729494dd28bf8832b72777689d26200719272a7c0314ae3759e7fadea2, byte for byte but for two masks: its words on what a listing printed, which named the zone of the clock, are written "prints a time that is not UTC, with a `Z` label."; and the scratch folder's user-profile path, given once, is written "`<S>` is the custodian's scratch folder."; with one final newline added.)

---

Verdict: PASS
Reviewed: C:/dev/wt/console67 @ 8b8c38815a5fbc1e41e392366784a7c1c51a5783

I changed nothing. The saved outputs are `<S>/cd1-step1.txt` to `<S>/cd1-step5.txt`, one per step, with no new folder. `<S>` is the custodian's scratch folder.

**Step 1 (holds).** I ran `git -C C:/dev/wt/console67 rev-parse HEAD; git -C C:/dev/wt/console67 status --porcelain`. Both exited 0.
- HEAD prints `8b8c38815a5fbc1e41e392366784a7c1c51a5783`, the head you named.
- The status prints nothing.

**Step 2 (generated file).** I ran `sha256sum`, `stat -c size=%s` and `date -u -r` on `C:/dev/wt/console67/target/fixtures/manual-walkthrough/filter-zoned.parquet`. Exit 0.
- sha256 is `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`.
- Size is 409872 bytes.
- Modification time is `2026-11-23T09:20:43Z`.

**Step 3 (generator run; the modification time falls inside it).** I ran `grep -n '^wrote ' <S>/c67r/oracle.log; cat <S>/c67r/times.txt`. Exit 0.
- `oracle.log` line 231, byte for byte: `wrote C:\dev\wt\console67\kernel\../target/fixtures/manual-walkthrough\filter-zoned.parquet (2000 features, 24014 vertices, zone_counts=[402, 392, 389, 421], zone_nulls=396)`. The test that follows it is `generate_the_filter_fixture ... ok`.
- The generator run is phase `c` in `times.txt`. It is the only phase that fits the log: `oracle.log` is a `cargo test` log (`Finished test profile ... in 11m 39s`), and its own modification time is `2026-11-23T09:20:43Z`.
  - `c-start 2026-11-23T09:09:01Z`
  - `c-rc=0 c-end 2026-11-23T09:20:45Z`
- Phase `a` is the npm prebuild (`build.log`) and phase `b` is the shell dev build (`prebuild.log`). Both end before 09:09.
- The file's 09:20:43Z lies between 09:09:01Z and 09:20:45Z, and 2 s before the run's end. It also equals `oracle.log`'s own modification time.
- `ls -l --time-style=+%FT%TZ` prints a time that is not UTC, with a `Z` label. I used `date -u -r` for every time.

**Step 4 (shared copy's hash in the series).** I ran `grep -n 'filter-zoned.parquet' <S>/c67r/3-command-bar.log` and `<S>/c67r/12-table.log`, then `grep -n '92ed' ...`. Exit 0.
- `3-command-bar.log:41`, byte for byte: `FIXTURES      PASS    filter-zoned.parquet sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 -> 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`.
  - Both the before and after values equal step 2's full value.
- `12-table.log:15`, byte for byte: `[table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa`.
  - This line gives only the first 12 hex characters, `92ed800ccbcc`, which match step 2's prefix.
  - The full value is not on that line.
  - The only full-value line in the two logs is `3-command-bar.log:41`.

**Step 5 (tester's report).** I ran `grep -n '92ed800c...' <S>/console-e2e-2-report.md`. Exit 0.
- Line 41, byte for byte: ``- (c) sha256 of my copy and of the shared copy are both `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`. They are identical, so run 12 was made.``
- The value equals step 2's.

**Doc-1 result.** The generated copy's sha256 is now recomputed. The first line of the series with the full value of the shared copy is `3-command-bar.log:41`. The generated copy's hash is not recorded in any file of `<S>/c67r/` yet. It is `cd1-step2.txt` for now. To close Doc-1, record that hash beside run 12 (`12-table.log` or the series' FIXTURES row).

Model: Sonnet 5.5 (claude-sonnet-5-5)
