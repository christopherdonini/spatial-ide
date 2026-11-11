*Custodian's filing note (2026-11-11): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-11 (17:40Z) (`state/directives/2026-11-11-seven-platform-runs-read-hourly-filed-as-consults-307-review-into-its-gate-round-stall-report-beside-the-reads.md`, line 7); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-11/INDEPENDENT-REVIEW-PORT-2-BRANCH-2026-11-11.md` (31849 bytes, sha256 e38c71e0be667632a1b03c18cda0606acb57f9bd39b1205c42439cf940d784d2; modified 2026-11-11T22:25:15Z; the folder holds no index file at this reading): session sesn_01UBPc5a987YfFVC52K54Aqh, agent spatial-ide-indipendent-reviewer-agent (claude-fable-5-1, effort high; the agent's own system prompt), US$ 8.33, about 792 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It reviewed the branch cut/port-2-macos-l1-and-app-dirs at 83d2ecef8dba33017e47310d7fab8e2be5ee5123, merge base 1f7d06b5ce4154a8b147a387d7482ece081eab9d, main being at 572416aa73b1c0f2aaa479ad3476a4829c14d26a (its own first lines say); the branch is still at 83d2ecef at this filing. From 572416aa to main at 8b5e3d21, 8 commits changed no file outside state/, governance/ and site/ (by git diff --name-only), so its readings of product, docs and KNOWN-LIMITATIONS files hold at this filing; its readings of governance and state records are read again before any node rests on them. It is filed under state/drafts/, not state/consults/: it carries 9 rooted path:line cites that do not hold on main as written (9 into files absent from main, 0 past a file's end, by my script's count), most into a branch's files; state/drafts/ is where such cites stay advisory, as for the 2026-11-05 filing `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md`. It goes into the packet of port-2's gates, which follow 1c step 1's merge by the human's placement of 2026-11-10; it finds no correctness defect, and its evidence item 3 asks that the test-list baselines be recomputed against main's head there.*

---

# Independent review of branch port-2 (macOS L1, app dirs), 2026-11-11

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-indipendent-reviewer-agent`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (origin/main was 572416aa when the run started). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01UBPc5a987YfFVC52K54Aqh) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 792 s active, US$ 8.33, last stop reason end_turn. Nothing below this line is edited.

---

I'll start by cloning the repository and checking out the commit.

-----

Tip is still 83d2ecef and merge base 1f7d06b5, as stated. Checking out and reading the form from main.

-----

Now the cited rulings under state/directives, and the reviewer checklist.

-----

Now the diff itself.

-----

Now the case-policy test and the changed engine tests.

-----

**Repository:** christopherdonini/spatial-ide — **no pull request** (branch `cut/port-2-macos-l1-and-app-dirs`) — **commit reviewed:** 83d2ecef8dba33017e47310d7fab8e2be5ee5123 (branch tip had not moved) — **merge base:** 1f7d06b5ce4154a8b147a387d7482ece081eab9d (`git merge-base` with origin/main at 572416aa; diffed against the base only).

Form read from origin/main at `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, Amendment 5 first; the four rulings it cites under `state/directives/` read; `.claude/agents/reviewer.md` applied. The diff is 939 lines over 15 files (recounted with §7's command; matches Amendment 5's class‑8 record).

## Correctness

None found. Every path builder was read against the form's §2 item 2 table:

| | code | Windows | macOS | Linux/other Unix | Other |
|---|---|---|---|---|---|
| data dir | `engine/src/app_dirs.rs:80-88` | `LOCALAPPDATA` if non-empty and absolute | `HOME/Library/Application Support`; `XDG_DATA_HOME` never read | `XDG_DATA_HOME` if absolute, else `HOME/.local/share` | `None` |
| audit log | `kernel/src/permission/audit/log.rs:362-375` | data dir + `spatial-ide/audit/publish.jsonl` | same | same | refusal `:355-361` |
| session root | `kernel/src/session_history.rs:132-134` (unchanged) | data dir + `spatial-ide/sessions` | same | same | `None` → `commands.rs:142-146` refuses |
| tier root | `app_dirs.rs:91-99`, `lod.rs:1170-1181` | `LOCALAPPDATA` if absolute, else `TIER_ROOT_REASON_WINDOWS` | `TIER_ROOT_REASON_UNDECLARED` | same | same |

All as the form states. cfg: three `cfg!` sites in `app_dirs.rs:45-53`, none added elsewhere; both cfg arms in `data_dir` removed; `is_inside` untouched. All three new test files and `app_dirs.rs` compile on every platform (runtime `cfg!`, `cfg_attr(ignore)` only). Trial merge of origin/main into 83d2ecef: no textual conflicts (see Notes).

## Evidence

1. **W1 is not yet supported by a run at this commit** — `KNOWN-LIMITATIONS.md:30` ("Its suite compiles and passes in CI"). Per Amendment 5 item 3 the macOS entry is red on the sort-window test at both pushes of this branch; the only green macOS run (E0b) was a probe at E0's tree. The claim closes only with E1 at the merged head (Amendment 4 item 3). The sort-window fix is on main now (`kernel/tests/publish_cancellation.rs` reads INCONCLUSIVE), so the order is achievable; the gate must hold the line until E1's run id exists. Confirmed by reading the form's record and main.
2. **K1's macOS half is unobserved** — `kernel/tests/case_policy_volume.rs:73` says so itself. §1 "may claim" item 5 (Windows *and* macOS) rests on H1/H4 (E1/E3). Not a defect; listed so the claim is not read as proved by this commit.
3. **P2/P3's baseline is E0, and main has moved under it.** Since 1f7d06b5 main added 13 `ignore` attributes in `kernel/`/`engine/` (posix-backslash node, redaction-hostname node, corpus/E2E harnesses) and ~20 new test files. "E0 list plus exactly A1–A3, E-K, E-L, K1" cannot hold at the merged head where I11 says E1 is read; the gates must recompute the set differences against main's head lists, not E0's. Confirmed by `git diff 1f7d06b5 origin/main`.

## Documentation (must fix before merge; does not block)

1. **`KNOWN-LIMITATIONS.md:401`** — item 43's source comment still says the item "is byte-copied by script from that form's section 2.10, item L". After this diff the location clause differs from B2‑1B item L (checked against `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:406` on main), so the sentence is false; and W3's "Not covered" case (form §10 W3) is not recorded in the comment, which Amendment 5 item 4 leaves open. Not the human's wording. Replacement words:

   `<!-- Approved as drafted by the human (kernel/B2-1B-RECORDING-PREREGISTRATION.md, Amendment 1, item 1); the item above is byte-copied by script from that form's section 2.10, item L, with the number set to 43 and its location clause replaced by the words the human approved on 2026-10-23 for PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md W3 (its Amendment 1, item 3). Not covered: a LOCALAPPDATA or HOME that is unset, empty or not an absolute path; then no file is kept and the record step refuses. Where the code does this: the application-directory boundary (engine/src/app_dirs.rs) decides the folder; the kernel's session_history module (kernel/src/session_history.rs) writes and clears the history under it, and the shell's binding (frontends/shell/src-tauri/src/lib.rs) clears it on the normal exit event. -->`

   Clause check: "location clause replaced" — `KNOWN-LIMITATIONS.md:400` is byte-identical to the form's W3 block (diffed); "approved 2026-10-23" — the human's answers directive, item 4, and form Amendment 1 item 3; "unset, empty or not an absolute path" — `app_dirs.rs:70-77`; "no file is kept and the record step refuses" — `session_history.rs:133` yields `None`, `lib.rs:451` manages `None`, `commands.rs:142-146` returns `session_history_unwritable`; "boundary decides" — `log.rs:373-375` → `app_dirs.rs:106-108`.
2. **`engine/src/app_dirs.rs:26`** — "the rule is four variables": three names are read (`LOCALAPPDATA`, `HOME`, `XDG_DATA_HOME`).
3. **`kernel/tests/no_generation_in_persisted_artifacts.rs:421`** keeps the old reason naming `engine/src/lod.rs` as the "application directories" boundary; after this diff `lod.rs` is labelled "free space" (`scripts/plan/cfg-boundary.mjs:30`). The form defers this to OPEN‑C (a) after 1c step 1 merges, and 1c has not merged (no `kernel/src/project/` on main), so it will be stale at merge. Declared; listed so the gate records it.

## Changed tests (before → after)

- `scripts/plan/cfg-boundary.test.mjs:75-91` (T1): asserted 18 sites in 6 files with `log.rs: 3` → asserts 19 in 7 with `app_dirs.rs: 3`, `log.rs: 1`. Named by the form (§2 item 5). Still pins per-file counts, so a cfg added anywhere else fails it. I ran `node scripts/plan/cfg-boundary.mjs` and `node --test scripts/plan/cfg-boundary.test.mjs` at 83d2ecef and at the trial merge: 19/7, 0 outside, 7 pass in both.
- 16 LOD-tier tests (`lod_tier_builder.rs` ×14, `lod_tier_cancellation.rs`, `lod_tier_preflight.rs`): only the `ignore` reason string changed; predicate `not(windows)` and bodies unchanged (Amendment 2 item 4's count).
- New tests, each asked "would it pass on broken behaviour": A1–A3 (pure table, all `Os` values on every host); E‑K (spawns the shipped binary, 3/2/6 cases per platform, each asserts exit code, printed path or refusal text, and an empty working directory); E‑L (refusal id + per-platform reason + nothing under the value, cwd or beside the source); K1 (precondition fails loudly on a case-sensitive volume; a `resolve_destination` that stops canonicalizing gives `<user-home>/iNNER/bundle` on Windows and an unstripped full path on macOS). All seven RECORDED MUTATION comments name 6c21888e and describe first failures consistent with the code (M4: old `cfg(windows)` body returns `Some("relative-data")` → status 0; M5: relative root reaches the free-space preflight → `lod_insufficient_disk`; M7: first site is `app_dirs.rs:45`).

## Notes

- **Existing Windows data:** unchanged. With an absolute `LOCALAPPDATA` the bytes are identical before and after (`PathBuf::from(var_os)` vs `PathBuf::from(value)` after `is_absolute`), for the audit log, the session root and the tier root. Only a relative or empty `LOCALAPPDATA` changes behaviour: formerly a cwd-relative log/store, now a refusal (OPEN‑2 (a)). On macOS, anything an earlier unsupported build wrote under `~/.local/share/spatial-ide` is no longer read and nothing says so; the form declares the move and macOS had no level. Linux: unchanged for absolute values.
- The shell's session log uses Tauri's `app_log_dir()` (`frontends/shell/src-tauri/src/lib.rs:324-327`) and is outside this boundary and the form's scope.
- **CI change:** one matrix entry, one profile step gated `runner.os == 'macOS'`, no install, no new action; Windows/Linux entries, commands, cache key, timeout, triggers and `paths` filters byte-unchanged (checked non-comment diff lines). Header comments quote nothing.
- **Block-on-sight §8, items 1–14:** none hit. §1 declared-unchanged list: each item checked (`data_dir` signature/visibility/file, `resolve_log_path`, `SkpHost::new`, `session_history.rs`, `component_eq`/`is_inside`/`normalize_with`/`resolve_destination`/`free_bytes_available`, `LOD_TIER_ROOT*` values, manifests/lockfile, MACOS‑BRINGUP). W1, W3, W4, W5 are byte-identical to the form's blocks (diffed). W6's two reasons match `app_dirs.rs:62-67`. `rustfmt --check` on all nine changed `.rs` files: clean.
- **Taking main in (origin/main 572416aa):** `git merge --no-commit` into 83d2ecef is clean — no textual conflicts; `KNOWN-LIMITATIONS.md` merges with both W1 and W3 intact. Main has not touched `log.rs`, `lod.rs`, the workflow, `cfg-boundary.*` or `session_history.rs`. Semantic interactions: (a) `normalize.rs` now uses `to_slashes`/`is_separator` — K1 unaffected (no backslash on macOS; both separators map on Windows); (b) main's new ignores and tests move the P2/P3/P4 baselines (Evidence 3); (c) `kernel/src/publish/*` and `bundle/redaction.rs` changes do not touch anything this diff calls; (d) governance files moved under `governance/` — the branch's test and code comments cite `PORT-2-…PREREGISTRATION.md` by bare name, resolvable via `governance/MOVED.tsv`.
- Nit: `engine/src/lod.rs:143-144` carries an unmarked fragment of the human's round‑3 ruling ("never beside the source file without the user's word") in paraphrase position; not presented as a quote.
- **Would run, cannot here:** `cargo test --workspace --locked` on all three runners (E1) and the three list steps; `cargo test -p spatial-kernel --test case_policy_volume` on macOS for H1/H4; the E3 probe for M6 on macOS; re-apply M1–M7 locally on Windows.

-----

Sandbox check: `/tmp/repo` is still at 83d2ecef with a clean tree, the merge base still resolves to 1f7d06b5, and `/tmp/form.md` is intact; the trial-merge worktree had already been removed by me before the interruption. Nothing was lost and nothing was redone. The report follows.

---

**Repository:** christopherdonini/spatial-ide — **no pull request** (branch `cut/port-2-macos-l1-and-app-dirs`) — **commit reviewed:** 83d2ecef8dba33017e47310d7fab8e2be5ee5123 (branch tip had not moved) — **merge base:** 1f7d06b5ce4154a8b147a387d7482ece081eab9d (`git merge-base` with origin/main at 572416aa; diffed against the base only).

Form read from origin/main at `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, Amendment 5 first; the four rulings it cites under `state/directives/` read; `.claude/agents/reviewer.md` applied. The diff is 939 lines over 15 files (recounted with §7's command; matches Amendment 5's class‑8 record). Nothing in this run was redone after the interruption.

## Correctness

None found. Every path builder was read against the form's §2 item 2 table:

| | code | Windows | macOS | Linux/other Unix | Other |
|---|---|---|---|---|---|
| data dir | `engine/src/app_dirs.rs:80-88` | `LOCALAPPDATA` if non-empty and absolute | `HOME/Library/Application Support`; `XDG_DATA_HOME` never read | `XDG_DATA_HOME` if absolute, else `HOME/.local/share` | `None` |
| audit log | `kernel/src/permission/audit/log.rs:362-375` | data dir + `spatial-ide/audit/publish.jsonl` | same | same | refusal `:355-361` |
| session root | `kernel/src/session_history.rs:132-134` (unchanged) | data dir + `spatial-ide/sessions` | same | same | `None` → `frontends/shell/src-tauri/src/commands.rs:142-146` refuses |
| tier root | `app_dirs.rs:91-99`, `engine/src/lod.rs:1170-1181` | `LOCALAPPDATA` if absolute, else `TIER_ROOT_REASON_WINDOWS` | `TIER_ROOT_REASON_UNDECLARED` | same | same |

All as the form states. cfg: three `cfg!` sites in `app_dirs.rs:45-53`, none added elsewhere; both cfg arms in `data_dir` removed; `is_inside` untouched. The three new test files and `app_dirs.rs` compile on every platform (runtime `cfg!`, `cfg_attr(ignore)` only). Trial merge of origin/main into 83d2ecef: no textual conflicts (see Notes).

## Evidence

1. **W1 is not yet supported by a run at this commit** — `KNOWN-LIMITATIONS.md:30` ("Its suite compiles and passes in CI"). Per Amendment 5 item 3 the macOS entry is red on the sort-window test at both pushes of this branch; the only green macOS run (E0b) was a probe at E0's tree. The claim closes only with E1 at the merged head (Amendment 4 item 3). The sort-window fix is on main now (`kernel/tests/publish_cancellation.rs` reads INCONCLUSIVE), so the order is achievable; the gate must hold the line until E1's run id exists. Confirmed by reading the form's record and main.
2. **K1's macOS half is unobserved** — `kernel/tests/case_policy_volume.rs:73` says so itself. §1 "may claim" item 5 (Windows *and* macOS) rests on H1/H4 (E1/E3). Not a defect; listed so the claim is not read as proved by this commit.
3. **P2/P3's baseline is E0, and main has moved under it.** Since 1f7d06b5 main added 13 `ignore` attributes in `kernel/`/`engine/` (posix-backslash node, redaction-hostname node, corpus/E2E harnesses) and ~20 new test files. "E0 list plus exactly A1–A3, E‑K, E‑L, K1" cannot hold at the merged head where I11 says E1 is read; the gates must recompute the set differences against main's head lists, not E0's. Confirmed by `git diff 1f7d06b5 origin/main`.

## Documentation (must fix before merge; does not block)

1. **`KNOWN-LIMITATIONS.md:401`** — item 43's source comment still says the item "is byte-copied by script from that form's section 2.10, item L". After this diff the location clause differs from B2‑1B item L (checked against `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:406` on main), so the sentence is false; and W3's "Not covered" case is not recorded in the comment, which Amendment 5 item 4 leaves open. Not the human's wording. Replacement words:

   `<!-- Approved as drafted by the human (kernel/B2-1B-RECORDING-PREREGISTRATION.md, Amendment 1, item 1); the item above is byte-copied by script from that form's section 2.10, item L, with the number set to 43 and its location clause replaced by the words the human approved on 2026-10-23 for PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md W3 (its Amendment 1, item 3). Not covered: a LOCALAPPDATA or HOME that is unset, empty or not an absolute path; then no file is kept and the record step refuses. Where the code does this: the application-directory boundary (engine/src/app_dirs.rs) decides the folder; the kernel's session_history module (kernel/src/session_history.rs) writes and clears the history under it, and the shell's binding (frontends/shell/src-tauri/src/lib.rs) clears it on the normal exit event. -->`

   Clause check: "location clause replaced" — `KNOWN-LIMITATIONS.md:400` is byte-identical to the form's W3 block (diffed); "approved 2026-10-23" — the human's answers directive, item 4, and form Amendment 1 item 3; "unset, empty or not an absolute path" — `app_dirs.rs:70-77`; "no file is kept and the record step refuses" — `session_history.rs:133` yields `None`, `lib.rs:451` manages `None`, `commands.rs:142-146` returns `session_history_unwritable`; "boundary decides" — `log.rs:373-375` → `app_dirs.rs:106-108`.
2. **`engine/src/app_dirs.rs:26`** — "the rule is four variables": three names are read (`LOCALAPPDATA`, `HOME`, `XDG_DATA_HOME`).
3. **`kernel/tests/no_generation_in_persisted_artifacts.rs:421`** keeps the old reason naming `engine/src/lod.rs` as the "application directories" boundary; after this diff `lod.rs` is labelled "free space" (`scripts/plan/cfg-boundary.mjs:30`). The form defers this to OPEN‑C (a) after 1c step 1 merges, and 1c has not merged (no `kernel/src/project/` on main), so it will be stale at merge. Declared; listed so the gate records it.

## Changed tests (before → after)

- `scripts/plan/cfg-boundary.test.mjs:75-91` (T1): asserted 18 sites in 6 files with `log.rs: 3` → asserts 19 in 7 with `app_dirs.rs: 3`, `log.rs: 1`. Named by the form (§2 item 5). Still pins per-file counts, so a cfg added anywhere else fails it. I ran `node scripts/plan/cfg-boundary.mjs` and `node --test scripts/plan/cfg-boundary.test.mjs` at 83d2ecef and at the trial merge: 19/7, 0 outside, 7 pass in both (node only; no cargo was run).
- 16 LOD-tier tests (`lod_tier_builder.rs` ×14, `lod_tier_cancellation.rs`, `lod_tier_preflight.rs`): only the `ignore` reason string changed; predicate `not(windows)` and bodies unchanged (Amendment 2 item 4's count).
- New tests, each asked "would it pass on broken behaviour": A1–A3 (pure table, all `Os` values on every host); E‑K (spawns the shipped binary, 3/2/6 cases per platform, each asserts exit code, printed path or refusal text, and an empty working directory); E‑L (refusal id + per-platform reason + nothing under the value, cwd or beside the source); K1 (precondition fails loudly on a case-sensitive volume; a `resolve_destination` that stops canonicalizing gives `<user-home>/iNNER/bundle` on Windows and an unstripped full path on macOS). All seven RECORDED MUTATION comments name 6c21888e and describe first failures consistent with the code (M4: old `cfg(windows)` body returns `Some("relative-data")` → status 0; M5: relative root reaches the free-space preflight → `lod_insufficient_disk`; M7: first site is `app_dirs.rs:45`).

## Notes

- **Existing Windows data:** unchanged. With an absolute `LOCALAPPDATA` the bytes are identical before and after (`PathBuf::from(var_os)` vs `PathBuf::from(value)` after `is_absolute`), for the audit log, the session root and the tier root. Only a relative or empty `LOCALAPPDATA` changes behaviour: formerly a cwd-relative log/store, now a refusal (OPEN‑2 (a)). On macOS, anything an earlier unsupported build wrote under `~/.local/share/spatial-ide` is no longer read and nothing says so; the form declares the move and macOS had no level. Linux: unchanged for absolute values.
- The shell's session log uses Tauri's `app_log_dir()` (`frontends/shell/src-tauri/src/lib.rs:324-327`); it is outside this boundary and the form's scope (the shell is not a workspace member).
- **CI change:** one matrix entry, one profile step gated `runner.os == 'macOS'`, no install, no new action; Windows/Linux entries, commands, cache key, timeout, triggers and `paths` filters byte-unchanged (checked the non-comment diff lines). Header comments quote nothing.
- **Block-on-sight §8, items 1–14:** none hit. §1 declared-unchanged list: each item checked (`data_dir` signature/visibility/file, `resolve_log_path`, `SkpHost::new`, `session_history.rs`, `component_eq`/`is_inside`/`normalize_with`/`resolve_destination`/`free_bytes_available`, `LOD_TIER_ROOT*` values, manifests/lockfile, MACOS‑BRINGUP). W1, W3, W4, W5 are byte-identical to the form's blocks (diffed). W6's two reasons match `app_dirs.rs:62-67`. `rustfmt --check` on all nine changed `.rs` files: clean.
- **Taking main in (origin/main 572416aa):** `git merge --no-commit` into 83d2ecef is clean — no textual conflicts; `KNOWN-LIMITATIONS.md` merges with both W1 and W3 intact. Main has not touched `log.rs`, `lod.rs`, the workflow, `cfg-boundary.*` or `session_history.rs`. Semantic interactions: (a) `normalize.rs` now uses `to_slashes`/`is_separator` — K1 unaffected (no backslash on macOS; both separators map on Windows); (b) main's new ignores and tests move the P2/P3/P4 baselines (Evidence 3); (c) `kernel/src/publish/*` and `bundle/redaction.rs` changes do not touch anything this diff calls; (d) governance files moved under `governance/` — the branch's test and code comments cite `PORT-2-…PREREGISTRATION.md` by bare name, resolvable via `governance/MOVED.tsv`.
- Nit: `engine/src/lod.rs:143-144` carries an unmarked fragment of the human's round‑3 ruling ("never beside the source file without the user's word") in paraphrase position; not presented as a quote.
- **Would run, cannot here:** `cargo test --workspace --locked` on all three runners (E1) and the three list steps; `cargo test -p spatial-kernel --test case_policy_volume` on macOS for H1/H4; the E3 probe for M6 on macOS; re-apply M1–M7 locally on Windows.

-----

Sandbox state is intact: `/tmp/repo` is at 83d2ecef with a clean tree, the merge base still resolves to 1f7d06b5, and the form copy is present. The review was complete before the interruption; nothing was redone. The report follows as my final message.

---

**Repository:** christopherdonini/spatial-ide — **no pull request** (branch `cut/port-2-macos-l1-and-app-dirs`) — **commit reviewed:** 83d2ecef8dba33017e47310d7fab8e2be5ee5123 (branch tip had not moved) — **merge base:** 1f7d06b5ce4154a8b147a387d7482ece081eab9d (`git merge-base` with origin/main at 572416aa; diffed against the base only).

Form read from origin/main at `governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, Amendment 5 first; the four rulings it cites under `state/directives/` read; `.claude/agents/reviewer.md` applied. The diff is 939 lines over 15 files (recounted with §7's command; matches Amendment 5's class‑8 record). Nothing was redone after the interruptions; the sandbox held the work.

## Correctness

None found. Every path builder was read against the form's §2 item 2 table:

| | code | Windows | macOS | Linux/other Unix | Other |
|---|---|---|---|---|---|
| data dir | `engine/src/app_dirs.rs:80-88` | `LOCALAPPDATA` if non-empty and absolute | `HOME/Library/Application Support`; `XDG_DATA_HOME` never read | `XDG_DATA_HOME` if absolute, else `HOME/.local/share` | `None` |
| audit log | `kernel/src/permission/audit/log.rs:362-375` | data dir + `spatial-ide/audit/publish.jsonl` | same | same | refusal `:355-361` |
| session root | `kernel/src/session_history.rs:132-134` (unchanged) | data dir + `spatial-ide/sessions` | same | same | `None` → `frontends/shell/src-tauri/src/commands.rs:142-146` refuses |
| tier root | `app_dirs.rs:91-99`, `engine/src/lod.rs:1170-1181` | `LOCALAPPDATA` if absolute, else `TIER_ROOT_REASON_WINDOWS` | `TIER_ROOT_REASON_UNDECLARED` | same | same |

All as the form states. cfg: three `cfg!` sites in `app_dirs.rs:45-53`, none added elsewhere; both cfg arms in `data_dir` removed; `is_inside` untouched. The three new test files and `app_dirs.rs` compile on every platform (runtime `cfg!`, `cfg_attr(ignore)` only). Trial merge of origin/main into 83d2ecef: no textual conflicts (see Notes).

## Evidence

1. **W1 is not yet supported by a run at this commit** — `KNOWN-LIMITATIONS.md:30` ("Its suite compiles and passes in CI"). Per Amendment 5 item 3 the macOS entry is red on the sort-window test at both pushes of this branch; the only green macOS run (E0b) was a probe at E0's tree. The claim closes only with E1 at the merged head (Amendment 4 item 3). The sort-window fix is on main now (`kernel/tests/publish_cancellation.rs` reads INCONCLUSIVE), so the order is achievable; the gate must hold the line until E1's run id exists. Confirmed by reading the form's record and main.
2. **K1's macOS half is unobserved** — `kernel/tests/case_policy_volume.rs:73` says so itself. §1 "may claim" item 5 (Windows *and* macOS) rests on H1/H4 (E1/E3). Not a defect; listed so the claim is not read as proved by this commit.
3. **P2/P3's baseline is E0, and main has moved under it.** Since 1f7d06b5 main added 13 `ignore` attributes in `kernel/`/`engine/` (posix-backslash node, redaction-hostname node, corpus/E2E harnesses) and ~20 new test files. "E0 list plus exactly A1–A3, E‑K, E‑L, K1" cannot hold at the merged head where I11 says E1 is read; the gates must recompute the set differences against main's head lists, not E0's. Confirmed by `git diff 1f7d06b5 origin/main`.

## Documentation (must fix before merge; does not block)

1. **`KNOWN-LIMITATIONS.md:401`** — item 43's source comment still says the item "is byte-copied by script from that form's section 2.10, item L". After this diff the location clause differs from B2‑1B item L (checked against `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:406` on main), so the sentence is false; and W3's "Not covered" case is not recorded in the comment, which Amendment 5 item 4 leaves open. Not the human's wording. Replacement words:

   `<!-- Approved as drafted by the human (kernel/B2-1B-RECORDING-PREREGISTRATION.md, Amendment 1, item 1); the item above is byte-copied by script from that form's section 2.10, item L, with the number set to 43 and its location clause replaced by the words the human approved on 2026-10-23 for PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md W3 (its Amendment 1, item 3). Not covered: a LOCALAPPDATA or HOME that is unset, empty or not an absolute path; then no file is kept and the record step refuses. Where the code does this: the application-directory boundary (engine/src/app_dirs.rs) decides the folder; the kernel's session_history module (kernel/src/session_history.rs) writes and clears the history under it, and the shell's binding (frontends/shell/src-tauri/src/lib.rs) clears it on the normal exit event. -->`

   Clause check: "location clause replaced" — `KNOWN-LIMITATIONS.md:400` is byte-identical to the form's W3 block (diffed); "approved 2026-10-23" — the human's answers directive, item 4, and form Amendment 1 item 3; "unset, empty or not an absolute path" — `app_dirs.rs:70-77`; "no file is kept and the record step refuses" — `session_history.rs:133` yields `None`, `lib.rs:451` manages `None`, `commands.rs:142-146` returns `session_history_unwritable`; "boundary decides" — `log.rs:373-375` → `app_dirs.rs:106-108`.
2. **`engine/src/app_dirs.rs:26`** — "the rule is four variables": three names are read (`LOCALAPPDATA`, `HOME`, `XDG_DATA_HOME`).
3. **`kernel/tests/no_generation_in_persisted_artifacts.rs:421`** keeps the old reason naming `engine/src/lod.rs` as the "application directories" boundary; after this diff `lod.rs` is labelled "free space" (`scripts/plan/cfg-boundary.mjs:30`). The form defers this to OPEN‑C (a) after 1c step 1 merges, and 1c has not merged (no `kernel/src/project/` on main), so it will be stale at merge. Declared; listed so the gate records it.

## Changed tests (before → after)

- `scripts/plan/cfg-boundary.test.mjs:75-91` (T1): asserted 18 sites in 6 files with `log.rs: 3` → asserts 19 in 7 with `app_dirs.rs: 3`, `log.rs: 1`. Named by the form (§2 item 5). Still pins per-file counts, so a cfg added anywhere else fails it. I ran `node scripts/plan/cfg-boundary.mjs` and `node --test scripts/plan/cfg-boundary.test.mjs` at 83d2ecef and at the trial merge: 19/7, 0 outside, 7 pass in both (node only; no cargo was run).
- 16 LOD-tier tests (`lod_tier_builder.rs` ×14, `lod_tier_cancellation.rs`, `lod_tier_preflight.rs`): only the `ignore` reason string changed; predicate `not(windows)` and bodies unchanged (Amendment 2 item 4's count).
- New tests, each asked "would it pass on broken behaviour": A1–A3 (pure table, all `Os` values on every host); E‑K (spawns the shipped binary, 3/2/6 cases per platform, each asserts exit code, printed path or refusal text, and an empty working directory); E‑L (refusal id + per-platform reason + nothing under the value, cwd or beside the source); K1 (precondition fails loudly on a case-sensitive volume; a `resolve_destination` that stops canonicalizing gives `<user-home>/iNNER/bundle` on Windows and an unstripped full path on macOS). All seven RECORDED MUTATION comments name 6c21888e and describe first failures consistent with the code (M4: old `cfg(windows)` body returns `Some("relative-data")` → status 0; M5: relative root reaches the free-space preflight → `lod_insufficient_disk`; M7: first site is `app_dirs.rs:45`).

## Notes

- **Existing Windows data:** unchanged. With an absolute `LOCALAPPDATA` the bytes are identical before and after (`PathBuf::from(var_os)` vs `PathBuf::from(value)` after `is_absolute`), for the audit log, the session root and the tier root. Only a relative or empty `LOCALAPPDATA` changes behaviour: formerly a cwd-relative log/store, now a refusal (OPEN‑2 (a)). On macOS, anything an earlier unsupported build wrote under `~/.local/share/spatial-ide` is no longer read and nothing says so; the form declares the move and macOS had no level. Linux: unchanged for absolute values.
- The shell's session log uses Tauri's `app_log_dir()` (`frontends/shell/src-tauri/src/lib.rs:324-327`); it is outside this boundary and the form's scope (the shell is not a workspace member).
- **CI change:** one matrix entry, one profile step gated `runner.os == 'macOS'`, no install, no new action; Windows/Linux entries, commands, cache key, timeout, triggers and `paths` filters byte-unchanged (checked the non-comment diff lines). Header comments quote nothing.
- **Block-on-sight §8, items 1–14:** none hit. §1 declared-unchanged list: each item checked (`data_dir` signature/visibility/file, `resolve_log_path`, `SkpHost::new`, `session_history.rs`, `component_eq`/`is_inside`/`normalize_with`/`resolve_destination`/`free_bytes_available`, `LOD_TIER_ROOT*` values, manifests/lockfile, MACOS‑BRINGUP). W1, W3, W4, W5 are byte-identical to the form's blocks (diffed). W6's two reasons match `app_dirs.rs:62-67`. `rustfmt --check` on all nine changed `.rs` files: clean.
- **Taking main in (origin/main 572416aa):** `git merge --no-commit` into 83d2ecef is clean — no textual conflicts; `KNOWN-LIMITATIONS.md` merges with both W1 and W3 intact. Main has not touched `log.rs`, `lod.rs`, the workflow, `cfg-boundary.*` or `session_history.rs`. Semantic interactions: (a) `normalize.rs` now uses `to_slashes`/`is_separator` — K1 unaffected (no backslash on macOS; both separators map on Windows); (b) main's new ignores and tests move the P2/P3/P4 baselines (Evidence 3); (c) `kernel/src/publish/*` and `bundle/redaction.rs` changes do not touch anything this diff calls; (d) governance files moved under `governance/` — the branch's test and code comments cite `PORT-2-…PREREGISTRATION.md` by bare name, resolvable via `governance/MOVED.tsv`.
- Nit: `engine/src/lod.rs:143-144` carries an unmarked fragment of the human's round‑3 ruling ("never beside the source file without the user's word") in paraphrase position; not presented as a quote.
- **Would run, cannot here:** `cargo test --workspace --locked` on all three runners (E1) and the three list steps; `cargo test -p spatial-kernel --test case_policy_volume` on macOS for H1/H4; the E3 probe for M6 on macOS; re-apply M1–M7 locally on Windows.

-----

