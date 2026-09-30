# Consult — node 4's worker report (kernel-close-dataset-unknown-keeps-openrecord, g1)

*Custodian's filing note: the worker-high's final hand-back for PLAN node `kernel-close-dataset-unknown-keeps-openrecord` at g1 (the form `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`), delivered as a message on 2026-09-30 (enqueued 21:55:45Z). The worker stopped once mid-build after a progress note (enqueued 21:09:07Z, superseded by this report and not filed), then finished its work without sending a report; the custodian asked it for this report, and it states the branch was not changed after its four commits. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at e1c37b0 on 7f80c8b, f4fb9ed and 4f045da from 1e68aba, each with one sign-off; the form's §7 command gives `122 4 kernel/src/skp.rs`, 126 over 1 file; the product diff moves the catalog check below the `watches` removal and adds a comment, and e1c37b0 only rewraps that comment; Product CI (Rust workspace and shell) succeeded on e1c37b0. The "uncommitted state files" the report mentions in the main checkout are the pre-existing untracked `.codex-remote-attachments/` only. The report's line numbers are unpinned working pointers at the branch commits it names.*

---

node:kernel-close-dataset-unknown-keeps-openrecord@g1 -- FINAL REPORT. Model observed: claude-sonnet-5-5 (Sonnet 5.5); no override, no context handoff. Supersedes my earlier progress note.

STATE: branch cut/close-dataset-unknown pushed at e1c37b0, worktree C:/dev/wt/close-dataset-unknown clean. No PR opened; nothing written under state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/; form not edited. The branch was not changed after the four commits.

BUILT: in SkpHost::close_dataset (kernel/src/skp.rs) the `watches` removal and its drop now precede the `unknown_dataset` check; comment states the new first step and why. Refusal, its condition and the success path's order untouched. T1 `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` (fixture "close-unknown-keeps-record") and T2 `a_close_drops_its_watch_before_it_returns` (fixture "close-drops-its-watch") in ticket_drop_under_lock_regression, with FlagWatch (Drop sets an AtomicBool, resolves_unchanged true) and FlagArm defined in that module. No sleep/thread/timeout/hook/cfg in either test.

COMMITS: 4f045da = commit B (test-only T1, T2). f4fb9ed = commit C (the move + comment). 7f80c8b = comment-only edit to T1/T2 docs recording the P0 failure at 4f045da and both mutation observations at f4fb9ed (form section 4 requires each observation in the test's doc with its commit; +6/-3). e1c37b0 = comment-only rewrap of one close_dataset comment line I wrote at 101 columns (rustfmt does not reflow comments).

H1 GREP (git grep -nE "\.remove\(|catalog\(\)" -- kernel/src frontends/shell/src-tauri/src), relevant lines:
frontends/shell/src-tauri/src/commands.rs:268: .catalog() (then .get)
frontends/shell/src-tauri/src/commands.rs:501: .catalog() (then .get)
frontends/shell/src-tauri/src/pool_poll.rs:179: host.catalog().get(&dataset)
kernel/src/lib.rs:203: self.lock_write().remove(name)   [Catalog::remove body]
kernel/src/skp.rs:1136: self.catalog.remove(handle.as_str());   [refused open; record inserted only later at 1170/1182]
kernel/src/skp.rs:1451: ...self.watches.lock()...remove(name);   [record removal]
kernel/src/skp.rs:1470: self.catalog.remove(name);   [after record removal]
Other .remove( hits have non-Catalog receivers (tickets, running maps, generation maps, audit reader, publish.rs). No product remover with a live OpenRecord: I1 did not fire.

B (4f045da): T1 FAILED at kernel\src\skp.rs:3893:9, panic text "the close removed the record"; its earlier assertions (code skp.unknown_dataset, handle field) passed. T2 PASSED at B. I2 did not fire.

MUTATIONS (each applied at f4fb9ed, run, reverted; porcelain empty after each; not verify-mutation runs):
M1 base order restored (removal below the check): T1 FAILED "the close removed the record" (skp.rs:3895:9); T2 passed.
M2 watches removal deleted: T2 FAILED "the close removed the record" (skp.rs:3921:9); T1 also failed on the same message (skp.rs:3893:9).
Both recorded in the tests' docs with the commit (7f80c8b).

CHECKS (exit codes read directly):
- cargo test -p spatial-kernel at e1c37b0: rc=0; 312 passed, 0 failed summed over all targets (lib target 135). All section-5 declared-unchanged tests pass (I4 did not fire).
- cargo clippy -p spatial-kernel --tests: rc=0; one skp.rs warning at skp.rs:244, identical at base and head; no new warning.
- rustfmt --edition 2021 --check skp.rs hunks: 99 at 1e68aba, 99 at e1c37b0 (only my added lines formatted).
- node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" from C:/dev/spatial-ide: rc=0; 353 tests, 353 pass, 0 fail.
- verify-quotes --show-cites kernel/src/skp.rs: PASS (0 checked).

SECTION 8: diff touches only kernel/src/skp.rs (git diff --name-only 1e68aba...HEAD); no new item in product code, no hook, no cfg(test) branch in product code; no generations/tickets call on the unknown path; success path's order unchanged; grep of added lines for sleep|recv_timeout|thread::spawn|cfg( returns one hit, the word "sleep" in a comment saying there is none; no fixture name shared with another test (grep fixture(" in skp.rs).

SECTION 7: form's command (git diff --numstat 1e68aba...e1c37b0 -- . ':!kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**') = `122 4 kernel/src/skp.rs`: 126 changed lines vs <=150, 1 file vs <=1. No overrun.

CI on e1c37b0: Product CI -- shell success (run 36780038301, 5m48s); Product CI -- Rust workspace (cargo test --workspace, windows-latest) success (run 36780037904, 22m2s). No other workflow ran for the branch.

PRE-GATE SELF-CHECK (four classes): (1) cross-module interface: no new cross-module seam; the kernel drops the watch via the existing ArmedWatch trait (engine/src/watch.rs:37-39); SourceWatchArm and Catalog::remove used as they stand. (2) completion claims: each points to existing evidence (P0 = 4f045da, observations = f4fb9ed recorded in 7f80c8b, suite and CI results above). (3) user-facing messages: none changed; refusal byte for byte as before. (4) required tests reach their intended assertion: every observed failure was on the named record-absent assertion, not setup; T1 asserts preconditions, Catalog::remove Some, code, handle field, record absent, flag true, second refusal.

OFF-SCOPE NOTICED, NOT DONE: cold worktree build took 16m55s; the scripts suite ran from the main checkout as briefed, which has uncommitted state files.
