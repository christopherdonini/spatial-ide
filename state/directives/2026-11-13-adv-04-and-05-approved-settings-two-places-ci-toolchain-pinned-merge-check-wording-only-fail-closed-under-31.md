# The human's message of 2026-11-13 (11:48Z): the advisor's drafts ADV-2026-11-13-04 (the project settings file, changed in two places by the notifications piece) and ADV-2026-11-13-05 (the Rust toolchain CI installs, pinned) approved; on the advisor's merge check, a gate that ended FAIL on wording only and was closed under section 31 without a re-gate counts as closed when three things hold, which the advisor checks itself

*Filed verbatim by the custodian from the session transcript. The human typed this message while a turn was running, so it has no user record of its own: its queue record (enqueue) at 2026-11-13T11:48:02.045Z (UTC) and its queued_command attachment (origin human) hold the same text, byte-copied by script from the attachment (466 bytes, sha256 713351a4eb8d36d5ddf9c4b857933cf4f8d58de82ed7de4c71a75e32d5ebf609), with one final newline added. The message approves two drafts in the human's advisory folder, by the grant's item 4 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`): PASTES/ADV-2026-11-13-04.md (1407 bytes, sha256 1a8ed899db45f36ee7f590bcc9b4f85fe4c89e0cab1fe886cfb4c1c646998d04, last modified at 2026-11-13T08:27:49Z by the file system) and PASTES/ADV-2026-11-13-05.md (1693 bytes, sha256 31dd254e32afc1b6c54e149c32faa5a7717b4c8afa074572705f6a56b29f3c64, last modified at 2026-11-13T08:28:41Z), both before the approval; read by the custodian at 2026-11-13T11:48:39Z (the read's tool result in the transcript) and again at this filing (2026-11-13T12:07:35Z), equal both times. Their texts follow the message, each below its own rule, byte for byte. By the approval each draft's text is the human's words. Nothing is changed; nothing in any of them names another project. The custodian's note, not the ruling: the folder's place on the machine is not written here; the message was relayed to the advisor by session message at 11:51:14Z.*

---

approved ADV-2026-11-13-04
approved ADV-2026-11-13-05
On the advisor's merge check: a gate that ended FAIL on wording only and was closed under section 31 without a re-gate counts as closed, when three things hold. The report's only blocking findings were wording. The words ruled under section 31 (b) are applied exactly, with nothing else changed after the gated head. The form records the closing. The advisor checks those three things itself; if any fails, HOLD.

---

Draft for Chris's approval.

Id: ADV-2026-11-13-04. A reserved matter (a session's settings, item 4 (c) of the grant). It becomes Chris's words when he types "approved" and this id in the custodian's session. Drafted by the advisor after reading `.claude/settings.json` at main c56349f1 and Chris's message of 2026-11-13 (06:57Z), item 4.

To the custodian, 2026-11-13.

1. The notifications piece (advisor-questions-and-telegram-three-alarms) changes `.claude/settings.json` in the repository in two places and nowhere else.
(a) The PreToolUse entry whose matcher is "AskUserQuestion" is removed whole. It is the entry whose command is `node "$CLAUDE_PROJECT_DIR/scripts/hooks/questions-mirror.mjs" --hook`. It is the only PreToolUse entry, so the "PreToolUse" key goes with it.
(b) The Notification entry's matcher changes from "permission_prompt|idle_prompt|agent_needs_input|quota_auto_resume_stale|quota_auto_resume_disabled" to "quota_auto_resume_stale|quota_auto_resume_disabled". Its command and its timeout stay.
The Stop, PreCompact and SessionStart entries stay as they are.

2. The piece's worker makes this edit on the piece's branch. It goes through the piece's gates and the advisor's merge with the rest of the PR. The reviewer checks that the file differs from main in these two places only.

3. This approves no other change to any settings file, and no change to the Guardian or any mod.

---

Draft for Chris's approval.

Id: ADV-2026-11-13-05. A reserved matter (what CI installs, item 4 (c) of the grant). It becomes Chris's words when he types "approved" and this id in the custodian's session. Drafted by the advisor after reading the architect's consult (`state/consults/2026-11-13-ci-rust-toolchain-pin-options-architect-consult.md`), the seven install lines under `.github/workflows/` at main c56349f1 (each is `dtolnay/rust-toolchain@stable`), and the clippy step's draft (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`, Q1 to Q4).

To the custodian, 2026-11-13. The Rust toolchain that CI installs.

1. CI stops floating. All seven install steps name one exact Rust version, and the toolchain action is pinned by commit. This is the consult's (b) with (e). There is no rust-toolchain.toml: my machine and the worktrees stay as they are.

2. The version is the one that main's first green Rust run logs after the Rust CI fix (filler entry 15) merges. The pin itself changes no compiler.

3. It is one piece. It changes the seven install steps and nothing else: no path filter, no cache key, no lockfile, no other action. Its evidence is its own PR's runs: every Rust workflow green, each logging the same rustc version. The advisor places it and orders it around port-2 and the clippy step.

4. A bump to a newer version is its own piece, and it needs my "approved" each time.

5. No canary job on stable for now. The consult's (d) is not taken.

6. The clippy step (filler entry 12e). Q2: this pin. Q1: clippy comes with the pinned toolchain; if the pinned install does not carry it, the step requests the clippy component and nothing else.
