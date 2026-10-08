*Custodian's filing note (2026-10-08): `b2-piece-1a-step-record-and-dataset-reference`'s report for the human's Decision C (the shell lock's `getrandom` line) and gate 1 attempt 2's D-4, at the branch head 91fe4c850d2dfffa0d057beaf0cafa9c057e1808 (worker run 14:30:26Z to 14:31:26Z by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 5daedf220020475973a2e142fbe046ec9022ca9c11d8beabd2f2ffd9c57d3122. The custodian checked the commit by its diff against 14acee0b: three files, the one lock line and the two indexes' last-verified lines. Paths and lines below are at the branch head, not main.*

---

Commit 91fe4c850d2dfffa0d057beaf0cafa9c057e1808, pushed to origin as an ordinary fast-forward update (14acee0b..91fe4c85). The worktree is clean. I did not read Amendment 6 or the architect's D-4 file; I worked from your brief.

**Shell lock diff** (`git diff` on `frontends/shell/src-tauri/Cargo.lock` before the commit; exactly the one allowed line, no new package, no version change):
```
@@ -4237,6 +4237,7 @@ name = "spatial-kernel"
 version = "0.0.0"
 dependencies = [
  "arrow",
+ "getrandom 0.3.4",
  "serde_json",
  "spatial-data-plane",
  "spatial-engine",
```

**Root lock diff** (`git diff c01f2e09 HEAD -- Cargo.lock`):
```
@@ -1903,6 +1903,7 @@ version = "0.0.0"
 dependencies = [
  "arrow",
  "futures-util",
+ "getrandom 0.3.4",
  "serde_json",
  "spatial-data-plane",
  "spatial-engine",
```
This is the root lock's `getrandom` line, which was already in the tree. I did not touch the root lock.

**Pointer re-verification at 14acee0b** (HEAD was 14acee0b with a clean tree when I checked):
- **Engine index:** every file path in the index resolves. Every `file.rs::test_name` pointer finds its `fn` in the named file.
- **Kernel index:** every path resolves, including `permission/approval.rs`, `boundary.rs`, `grant.rs` and `engine/src/pool.rs`. Every test pointer finds its `fn`, except two that point at modules, not functions:
  - `cancel_notice_tests` is `mod` at `kernel/src/lib.rs:756`.
  - `ticket_drop_under_lock_regression` is `mod` at `kernel/src/skp.rs:3399`.
- **One mention that is not a pointer:** `launch-url.txt` in `kernel/README.md` is a harness file the text says is not reproduced.
- **Method limit:** this was a scripted check of file existence and function presence. It did not check that the cited behaviour still matches.

**Checks:**
- `cargo metadata --locked --offline` on the shell manifest, run after the lock edit: exit 0.
- `cargo metadata --locked --offline` on the root workspace: exit 0.
- `git diff 14acee0b HEAD --stat`: only `engine/README.md`, `kernel/README.md` and the shell `Cargo.lock` (3 insertions, 2 deletions).
- `node scripts/plan/verify-cites.mjs`: exit 0 (PASS, 35 loose references advised).

I ran no build and no test suites.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
