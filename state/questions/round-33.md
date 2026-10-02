Question round 33 — 2026-10-02 (custodian → human). The weekly window: process proposals A to F (drafted in state/drafts/weekly-window-2026-10-02.md); PORTABILITY-2026-09-30.md section 7's five decisions; and item G, node 5's note or fix (state/drafts/round-33-node5-fix-choice.md). Eleven items, asked in three calls of 4, 4 and 3, in this order. Items 1 and 8 are RED LINE (marked). AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. RED LINE (public exposure, part B) — The weekly window's process proposal, two parts. (A) workspace-rustfmt: one mechanical `cargo fmt --all` pass, plus the src-tauri crate, with a CI fmt check in the same PR, so main is never red between them. It supersedes data-plane-crate-fmt. The drift measured at 0ada14f was 2,048 hunks in 126 workspace files, plus 105 in src-tauri. The pass moves lines in about 133 files: unpinned path:line cites into them would point at moved text without any check going red. Hash pins are unaffected, and a .git-blame-ignore-revs file names the commit. It runs only while no Rust branch is open, and none is open today (node 6 has merged; node 7 has not started). (B) exposure-scan-ci-backstop: profile-path-scan.mjs gains a range mode. A new workflow on every PR and every push to main scans added lines, path names and commit messages, catching what the local hooks cannot (web edits, GitHub's merge commits, --no-verify, cloud sessions). It never prints a matched segment.
  (1) Both, as two pieces (Recommended). The backstop goes first. The rustfmt pass and its check follow in the first window with no Rust branch open; today qualifies if node 7's code waits for it. data-plane-crate-fmt closes as superseded.
  (2) Both, as one piece. They land together in the first window with no Rust branch open.
  (3) Hold.

---

2. C — test-claims-same-pr-superseded-pin. Today verify-test-claims refuses a superseded pin unless the pinned commit is an ancestor of origin/main. A form must be committed before code, so a form that retires a test the same PR introduces cannot carry a valid pin until after the merge, and the PR's own Governance check stays red. This was met at A2-1's Amendment 12 on 2026-09-29. The fix also accepts a commit reachable from the scanned HEAD, but only when the claiming line is introduced in origin/main..HEAD and the node records a merge-commit merge. Unit fixtures cover the squash hazard.
  (1) Adopt as described (Recommended). A small governance piece, with its preregistration before any code and the reviewer, plus the architect if section 21a applies.
  (2) Hold. The known workaround is a plain-text reference, as accepted for A2-1.

---

3. D — round-mirror-pretooluse-hook. The round mirror depends on the custodian remembering it, and it lapsed after round 30. A PreToolUse hook on AskUserQuestion would render the call's own questions and options into state/questions/round-<n>.md and send it to Telegram. It never blocks or alters the question: it exits 0 on every path. It stays silent inside a subagent, in a session without the lease, and in a cloud session. Telegram stays read-and-copy, and AskUserQuestion stays the answer channel.
  (1) Adopt, one call per round (Recommended; Fable's recommendation). Each AskUserQuestion call becomes its own round file and message.
  (2) Adopt as a backstop only. It sends only when no round file was written and mirrored in the turn.
  (3) Hold.

---

4. E — stop-hook-stale-continuity. On 2026-09-29 an automatic compaction was blocked by the PreCompact hook, and the model never saw it. The Stop hook would refuse to end a turn while the SESSION-CONTINUITY block is stale, meaning a ledger commit has landed since the last flush. Its reason names the newest ledger commit and the block's flushed_at, and tells the model to flush, commit ledger-only and push. It counts inside the existing continuation caps. The PreCompact block stays as the backstop.
  (1) Adopt as described (Recommended; Fable's recommendation). The check runs before the background-tasks allow, and milestone refreshes are ledger-only.
  (2) Adopt it, with every refresh preceded by a health-refresh commit.
  (3) Hold.

---

5. F — AUTONOMY.md section 0's reading order gains state/directives/ (newest first), after DECISIONS-PENDING.md. The source is your line in state/directives/2026-09-29-directives-not-duplicated-and-holds-check.md. It would be a dated amendment appended at the end of AUTONOMY.md.
  (1) Adopt (Recommended).
  (2) Hold.

---

6. PORTABILITY section 7, decision 1 — runner minutes. PORT-1 adds a Linux job to every product push, and PORT-2 adds macOS. Standard GitHub-hosted runners have been free for public repositories, but check Settings → Billing before relying on it.
  (1) PORT-1 now, PORT-2 after PORT-1 is green (Recommended; PORTABILITY's recommendation).
  (2) Approve both now.
  (3) Hold both.

---

7. PORTABILITY section 7, decision 2 — support profiles to target. The recommendation: Windows 10/11 x64 (the reference, unchanged); macOS 14 or later on Apple Silicon for CI, plus the 2019 Intel MacBook for L2 and L3; Linux Ubuntu 24.04 x64 with WebKitGTK 4.1. Other distributions and architectures are not claimed.
  (1) Adopt these profiles (Recommended; PORTABILITY's recommendation).
  (2) Hold; decide with PORT-1's results.

---

8. RED LINE (what CI installs) — PORTABILITY section 7, decision 3 — CI system packages for the Linux shell build (PORT-3): WebKitGTK and its build dependencies, installed in the runner only. They are not product dependencies, but they change what CI installs. PORTABILITY gives no recommendation.
  (1) Approve, runner only. Installed by the PORT-3 workflow, never added to the repository's product dependencies.
  (2) Hold until PORT-1 and PORT-2 are green.

---

9. PORTABILITY section 7, decision 4 — a Linux machine or VM for the L2 smoke (the real webview and desktop integration). A VM is enough for L2. L3 (hardware-dependent rendering and performance) needs real hardware and is deferred. PORTABILITY gives no recommendation.
  (1) A VM for L2. L3 stays deferred.
  (2) A physical Linux machine.
  (3) Not yet. L2 on Linux waits.

---

10. PORTABILITY section 7, decision 5 — where the coherent-acquisition guarantee lives (B2's Prepare, defined without the OS). Publish-from-recipe, CLI replay and editing's base revision will all cite it.
  (1) A short Proposed ADR (Recommended; PORTABILITY's recommendation). Drafted with B2's preregistration; its acceptance stays yours.
  (2) B2's preregistration alone, promoted later.

---

11. G — node 5 (catalog-open-replace-drop-latency-note) merged as note only (#151). Round 25 item 1 (d) decided the note, not the fix. The fix binds the replaced dataset and drops it after Catalog::open's write guard: two lines, in the shape close_dataset already uses. No deterministic test can show where the drop happens without a timing assertion or a test-only hook, so it would land with no failing-first test. No product path replaces a dataset today, except through a 128-bit handle collision.
  (1) Note only (Recommended). The item closes.
  (2) The fix too, as its own node, next in the queue after node 7.
