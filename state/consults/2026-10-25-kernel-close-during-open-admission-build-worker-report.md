*Custodian's filing note (2026-10-25): the worker-high's build of `kernel-close-during-open-admission` (the filler queue's entry 5) on its branch, from main dd0b6113, final head 7b437be3; draft PR #258. The custodian's check: the numstat from dd0b6113 is 128 and 0 in kernel/src/skp.rs alone, and the worktree is clean and equal to origin. Its writes by the write tools were the one file and its own scratch files (19); one shell command also wrote a cargo fmt output file in the user-profile root, which the worker disclosed and removed in its next command, and the custodian checked it is gone. No rebase, reset, PR action or force push. The run 17:54:23Z to 18:19:45Z by its transcript (Read 18, Bash 32, Grep 3, Edit 17, Write 2). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is e13e3f2619b6afce54a46949ed95dc85c8b4e8ab1da0e97224abc1d1b2d59aab.*

---

Built: kernel-close-during-open-admission at 7b437be350acb93f4c1210c948147f658e1cadf9

**Commits** (both signed off with `-s`; each message file had no `@` outside its first trailer line):
- bc7b0fbd479f97d05a60f4f48578c9870fed639e `test(kernel): kernel-close-during-open-admission, the pinned test (Tests+mutation line)` (121 insertions)
- 7b437be350acb93f4c1210c948147f658e1cadf9 `test(kernel): kernel-close-during-open-admission, M1 recorded (Tests+mutation line)` (7 insertions, comment lines only)

**Where it landed.** Only `kernel/src/skp.rs`, inside `ticket_drop_under_lock_regression`. No product line changed. No new `pub` item, hook or `cfg(test)` branch in product code. No dependency added. No existing test changed. No sleep, spawned thread or timeout in the test.

**The test**, `a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds`, against note 1's seven items:
- **Setup:** the test builds the host with `Arc::new_cyclic`. Its test-owned arm, `CloseOnAdmissionArm(Weak<SkpHost>, result cell, drop flag)`, returns `Watching` over `CloseOnAdmissionWatch`. On its one call, `resolves_unchanged` reads `catalog().names()`, then `live_generation(name)`, then runs a real `close_dataset` on that name. It stores all three in the cell and returns `true`. `Drop` sets the flag.
- **1:** the cell shows one catalog name, `live == Err(NotLive::NotOpen)`, and the inner close `Ok` with `cancelled_streams == 0`.
- **2:** the open returns `Ok`, and its handle equals the closed name. This is the expect M1 fails.
- **3:** `catalog().get(name)` is `None`.
- **4:** `live` holds `name` with `open.session` (read in-crate through `generations.inner`, the K15 precedent). The host holds a record, and the watch is not dropped.
- **5:** `describe` and `viewport_query` on the handle both return `skp.unknown_dataset`, and the ticket map is empty.
- **6:** `try_recv` is `Empty`.
- **7:** a second close returns `skp.unknown_dataset`, the record is gone, the watch is dropped, and `live` still holds `name` with `open.session`.
- **Doc comment:** it says the four things note 1 lists (pins today's behaviour, a known gap the product cannot reach; M1 is the fix shape; a fix flips it and it is then replaced under the fix's own form; it claims no property).
- **Shape differences from note 1:** state is shared through a cloneable tuple-struct arm, which the watch wraps, and the result cell is a tuple type alias (`Inside`). Both were to fit the 140-line budget. I added two helpers, `live_session` and `assert_unknown_dataset`.
- **Weak import:** `Weak` is written as `std::sync::Weak`, with no import line.

**Step 2, first run** (test alone, base plus test, shared hold, 1500 s call timeout): `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 162 filtered out; finished in 0.07s`, exit 0. The window is real. The inner close did not refuse, and nothing hung. No stop rule was met.

**M1** (applied alone at bc7b0fbd479f97d05a60f4f48578c9870fed639e, in the Watching arm immediately before `SessionRef::mint()`, returning `Err(SkpError::unknown_dataset(handle.as_str()))` when `self.catalog.get(handle.as_str())` is `None`):
- The test run alone gave exit 101.
- The failing assertion is the item 2 expect, `kernel\src\skp.rs:5131:27`: `the open returns Ok although a close ran inside its admission: SkpError { code: "skp.unknown_dataset", ... }`.
- I reverted with `git checkout -- kernel/src/skp.rs`. `git status --porcelain` printed nothing.
- The `RECORDED MUTATION (M1)` doc lines are in the second commit. They name the mutation, the failing expect, and the full id bc7b0fbd479f97d05a60f4f48578c9870fed639e.
- No `verify-mutation` run was used.

**Scope count:** `git diff --numstat dd0b6113...HEAD` gives `128  0  kernel/src/skp.rs`, which is 128 of 140, in one file.

**Checks at head 7b437be3** (shared holds for the heavy ones):
- `cargo test -p spatial-kernel --locked --lib ticket_drop_under_lock_regression`: exit 0. `test result: ok. 23 passed; 0 failed; 0 ignored; 0 measured; 140 filtered out`.
- `cargo test -p spatial-kernel --locked` (whole crate): exit 0. Summed over the 47 result lines: 379 passed, 0 failed, 41 ignored. The lib line reads `ok. 163 passed; 0 failed`.
- `cargo fmt --all -- --check`: exit 0.
- `cargo clippy -p spatial-kernel --tests --locked`: exit 0. 39 `warning` lines, none in my lines. The one in `kernel\src\skp.rs` is at line 277, in product code above the test module.
- `node scripts/plan/verify-cites.mjs`: exit 0, `verify:cites PASS`.
- `node scripts/plan/verify-quotes.mjs`: exit 0, `verify:quotes PASS`.
- `node scripts/plan/verify-test-claims.mjs`: exit 0, `verify:test-claims PASS` (661 claimed tests).
- `node scripts/plan/verify.mjs --offline`: exit 0, `verify:plan PASS`.

**Final state:** origin's `cut/kernel-close-during-open-admission` equals HEAD (both 7b437be350acb93f4c1210c948147f658e1cadf9, from `git fetch` then `git rev-parse`). `git status --porcelain` is empty. I pushed each commit in its own call, both with exit 0. No PR action. No process I started is still running (a process listing for cargo and rustc showed none).

**Disclosures:**
- My first draft of the test came to 162 lines. I cut it to 121 by restructuring (tuple types, fewer rustfmt-expanded lines), not by dropping any of the seven items.
- By mistake I wrote one scratch file (a `cargo fmt --check` output) to a path in the user-profile root, outside the allowed locations. I removed it right away and confirmed it is gone. All later scratch files used the `kcdo-w-` prefix in the scratchpad.
- Where a wait was needed I used bounded foreground checks with `ping` delays, not a bare sleep.

**Pre-gate self-check:**
- **Cross-module interfaces:** `ArmedWatch`, `SourceWatchArm`, `ArmOutcome::Watching`, `WatchSink`, `Catalog::names`, `SkpHost::close_dataset`, `describe` and `viewport_query` were all read at the base and used as they are. No new cross-module path was added.
- **Completion claims:** each rests on a run above. The first run and the M1 run are in my transcript with their output files.
- **User-facing messages:** none added.
- **Assertions:** the first run passed with every item asserted. The M1 run reached item 2's expect, so items 1 onward run in order up to the mutated expect.

**Hold lines** (my project's only):
- First run: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:3284 ...`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:3284 affinity=FF (cores 0-7)`.
- M1 run: `MACHINE_HOLD shared project=SpatialIDE ... shell=bash.exe:47924 ...`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:47924 ...`.
- Module run: `MACHINE_HOLD shared project=SpatialIDE ... shell=bash.exe:33748 ...`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:33748 ...`.
- Whole-kernel run: `MACHINE_HOLD shared project=SpatialIDE ... shell=bash.exe:3588 ...`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:3588 ...`.
- Clippy run: `MACHINE_HOLD shared project=SpatialIDE ... shell=bash.exe:4872 ...`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:4872 ...`.
- All five were shared holds. No exit 96 to 99 occurred.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`), as the harness reports it. No override. No context handoff received or produced.
