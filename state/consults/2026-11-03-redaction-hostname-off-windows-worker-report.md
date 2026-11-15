*Custodian's filing note (2026-11-03): the build of `redaction-hostname-off-windows` (filler 7a) by a worker on `cut/redaction-hostname-off-windows` from b1d8d02c, head fa4d0095, under its five-line form `governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md` and its Amendment 1 (class 1). The custodian's check by git: origin's branch is at fa4d0095, six commits on b1d8d02c, the three Scope files and no other, 198 lines (the form's Amendment 2, class 8). The run 16:48:10Z to 18:21:30Z by its transcript: Bash 80, Read 2, Write 2, one Monitor call refused as no such tool, one Bash call (a sleep of 240 s before a tail) refused by the harness; pushes of its branch, one revert commit by `git revert --no-commit` and a commit, and no reset, rebase, amend, force, PR action or claude command. Disclosed: it applied its source edits by Python scripts run through Bash, not by the Edit tool; gate 1's reviewer reads the bytes. No process of its was running when the custodian looked at the hand-back (18:22Z, by command line). Extracted by script from its SubagentHandback call, with one final newline added (the hand-back's sha256 so, 2eb606488471ca9f60fa159c81930474e86a2dc7eab37d708cca524ec77a7f82). One disclosed rewrite: the two path:line cites into the new test file, which is only on the branch, in the byte-copied CI log lines at this file's lines 43 and 45, are de-rooted to the file name (`kernel/tests/` dropped), because verify-cites reads a rooted cite on main and would fail it there. Nothing else is changed. Its sha256 from line 5 to the end is 4d45275bb908a3e788d273920f587a26d29cbccf2e7dcfcde17a2d5cb68ae696.*

---

Built: redaction-hostname-off-windows at fa4d009562185de498f5ed5b23979e0ecf7f05ba (branch cut/redaction-hostname-off-windows; origin's branch equals HEAD; porcelain empty; no PR action).

Commits (all `-s`; the only `@` in each message file is the first trailer line):
1. cce2d3208ee041be141b536d3326261350b60713 fix: ... the machine's own name is read from procfs when the environment names none
2. f7be3a3071ef8822713a9f05693dc6f897d7f69a test: ... T1 (all platforms) and T2 (Linux child process)
3. 2a3fae53e5a324351e5a3f1ef3c69e0b3fe65d51 docs: ... M1's recorded mutation beside T1
4. 06f54ec004ee090ffdff351becf14647b403121f test: ... TEMPORARY M2 (os_hostname returns None), reverted by the next commit
5. 52e65e2888efcd80c324fab8bd211bfa94b55a36 test: ... revert the temporary M2 commit
6. fa4d009562185de498f5ed5b23979e0ecf7f05ba docs: ... M2's recorded mutation beside T2

Worktree: C:/dev/wt/rhow at b1d8d02c; .cargo/config.toml sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f (equal); the form's sha256 48b0c8fd... (equal); target D:/wt-targets/rhow.

redaction.rs (lines at my base; the code at the base was authoritative and the form's 53e0a0a1 cites were not needed):
- `from_environment` (doc at base 122-124, body 125-148): the `COMPUTERNAME`/`HOSTNAME` loop is replaced by `hostnames_from(|key| std::env::var(key).ok(), os_hostname)`. Its doc now says it also reads a file.
- New private `hostnames_from(env, os)`: reads the environment names (3-byte floor, dedup) first. Only when that gives none does it take `os()`, trimmed, under the same floor.
- New private `os_hostname()`: reads `/proc/sys/kernel/hostname`. No OS cfg, no unsafe, no new dependency, no new string. Std only.
- Both new functions sit just above `CREDENTIAL_NEEDLES` (base line 151).
- `kernel/README.md` (2 lines changed): line 387 gains `governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md` at the end of the preregistration list. Line 360 gains "; every pointer the hostname fallback adds or changes (this piece's form in the preregistration list) at b1d8d02c".

Tests:
- T1 `the_os_hostname_is_taken_only_when_the_environment_names_none` (redaction.rs tests). `hostnames_from` with no env gives ["wave3-probe-host"] from "wave3-probe-host\n". With env HOSTNAME=envhost and OS "oshost" it gives ["envhost"]. With OS "vm\n" the result is empty. No env mutation.
- T2 `an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname` (kernel/tests/redaction_hostname_off_windows.rs).
  - The test re-runs itself (`current_exe`, `--exact`) as a child with `env_remove` of HOSTNAME and COMPUTERNAME and an absolute `SPATIAL_IDE_AUDIT_LOG`. No `set_var`.
  - The child takes the name from `uname -n` and fails by name if it is under 3 bytes.
  - It writes a control record and a record whose `source_name` is the name, through `AuditLog::open_for` and `append_intent`.
  - It asserts: exactly 2 lines; the name is absent from the control line; the control lacks `machine-identifier`; the named record lists it.
  - The parent asserts exit success and surfaces the child's stderr.
  - It is `cfg_attr(not(target_os = "linux"), ignore = "boundary: machine identity (os_hostname in kernel/src/bundle/redaction.rs)")`.
- Cross-module reads before writing: log.rs `classify`, `append_intent` and `open_for` (kernel/src/permission/audit/log.rs), `IntentRecord` (kernel/src/permission/audit/record.rs:115), session_history_crash.rs:85-106, no_generation_in_persisted_artifacts.rs:491-506. The end-to-end proof is T2, which goes from the real producer shape.
- Commit 1 test run: `cargo test -p spatial-kernel --locked` rc=0, 390 passed / 0 failed / 42 ignored. At head: rc=0, 391 passed / 0 failed / 43 ignored. T1 alone: ok. `--test redaction_hostname_off_windows -- --list --ignored` lists T2.

M1: dropped the `hostnames.is_empty()` guard (the OS name is always appended) and ran T1 alone in a hold, rc=101. The failure was at redaction.rs:683, "assertion `left == right` failed: an environment name is used alone / left: ["envhost", "oshost"] / right: ["envhost"]". Reverted. sha256 of redaction.rs equal to commit 2's: 835fb6b0d8016ebe9702bb8043293c56c1bb5c6d4c61628e969c5668bdef97b0.

CI runs (product-ci-rust):
- Run 41682651994 at 2a3fae53: both jobs success. Ubuntu job 126080053618 has T1 `... ok` and T2 `... ok`. Windows job 126080052775 has T1 ok, T2 `ignored, boundary: machine identity (os_hostname in kernel/src/bundle/redaction.` and the ignored listing names T2.
- Run 41686068307 at 06f54ec0 (M2): ubuntu job 126092020662 failure, windows job 126092021037 success. In the ubuntu log, T2 was the only test that FAILED (two "FAILED" lines: T2 and its result line). Byte-copied from that job's log:
```
2026-11-03T17:43:45.3242492Z test an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname ... FAILED
2026-11-03T17:43:45.3245771Z thread 'an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname' (31613) panicked at redaction_hostname_off_windows.rs:114:5:
2026-11-03T17:43:45.3246797Z the child exited with ExitStatus(unix_wait_status(25856)); its stderr:
2026-11-03T17:43:45.3247608Z thread 'an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname' (31615) panicked at redaction_hostname_off_windows.rs:80:5:
2026-11-03T17:43:45.3248514Z the record carrying the uname -n name "runnervm48cm3" does not list machine-identifier in residual_classes
```
- Revert commit 5: redaction.rs sha256 6910ae8c8c2abe566caf1373e0a891d4c989e3f864610ffca561267d7c67a7c3, equal to commit 3's.
- Run 41689563500 at fa4d0095: both jobs success. Ubuntu job 126104278223 has T1 ok and T2 ok. Windows job 126104278819 success.

Checks at head (rc / last line):
- `cargo test -p spatial-kernel --locked`: rc 0, see above.
- `cargo clippy -p spatial-kernel --locked --tests --no-deps`: rc 0. Nothing is printed for the Scope files (0 lines mention "redaction"); the existing warnings are in other tests (e.g. cancel_rescore).
- `cargo fmt --all -- --check`: rc 0.
- `verify.mjs --offline`: rc 0, PASS. `verify-cites.mjs`: rc 0, PASS. `verify-quotes.mjs`: rc 0, PASS. `verify-test-claims.mjs`: rc 0, PASS (729 claimed tests).
- `node --test renderer/bundle-viewer/scripts/scan-dist.test.mjs`: rc 1, 1 pass / 3 fail. The failure is `ENOENT lstat renderer/bundle-viewer/dist`: the fresh worktree has no built dist/ (the test needs `npm run verify` first). It is environmental, not an outcome change from this piece. I did not build dist/ (that would mean npm, which is outside the brief), so the standalone-compile test is NOT proven green by the test itself.
  - Substitute evidence: `rustc --edition 2021 -A warnings scripts/scan-dist.rs`, the driver's own compile of the changed redaction.rs, compiled in a hold (rc 0). Running it on a scratch dir exited 0 with no output. The std-only property is shown by that standalone compile and by CI.

Size: `git diff --numstat origin/main...HEAD` over the three files is README 2+2, redaction.rs 62+10, the new test file 122+0. That is 198 against the declared 145: an overrun of 53, reported and not trimmed. Per round 25, item 2, that is a class 8 for the architect or custodian to record.

Stop rules: none met. No log.rs, normalize.rs, publish/mod.rs, scripts/plan or workflow change; no unsafe, no new dependency, no `set_var`, no path:line cite in a code comment, no user-visible string change. The only red CI was M2's predicted failure. No hold was refused (no exit 96 to 99).

Disclosures:
- The README's Last verified entry uses the base b1d8d02c as the checked-at commit.
- The M1 and M2 `RECORDED MUTATION` lines are long single doc lines (the references stay contiguous).
- Some of my wait loops were moved to background by the harness. They have all exited by themselves, and no process of mine is running.
- Off-scope, not done: README line 387 still lists the older forms by their pre-move `kernel/...` paths (MOVED.tsv). I only appended the new one by its governance path.

Hold lines (my project only, `also=` elided): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> (commands started from now on inherit it; release when done)`, followed by `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. This happened for each of 7 holds: the full kernel test at commit 1, T1 and the T2 listing, M1, the full kernel test at head, clippy, the scan-dist test, and the rustc standalone compile.

Background shells left: none. Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
