*Custodian's filing note (2026-10-29): the worker-high's report on filler entry 5b, built under its five-line form and settlement on cut/open-dataset-refuses-a-name-closed-during-admission in C:/dev/wt/odr (target D:/wt-targets/odr). The custodian's check: origin's branch is da8c6cdc on 68773f09 on 5e38ffae on main fa3d09f6; its numstat is kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md 9/0, kernel/src/skp.rs 71/35, protocol/skp/SKP-V0.md 7/0, 122 of the Scope's 140. By its transcript: 9 cargo calls, none outside a shared hold by command text; three commits and one push; no fetch, rebase, reset or PR action; its wait loops sleep each turn and end at a deadline; the kernel crate's head run sums to 390 passed, 0 failed, 42 ignored over 46 result lines, and the protocol crate's to 56 passed over 4, by the custodian's sum of its output files. The run 2026-10-29T06:55:24Z to 07:29:45Z (Bash 66, Read 4, Edit 6, Write 7). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 324eeb5322d0836028b61fbc5b920307ce2868b9983fa4d655bb873d165f66c3.*

---

Built: open-dataset-refuses-a-name-closed-during-admission at da8c6cdc1eab427c6f5a4c521698748a0528104e

Brief sha256 shown first: c6ca7a3c31b008a3527bb62d23f6385fd0dd4bc7880c7f258913beba37d6d5c8. Worktree C:/dev/wt/odr at main fa3d09f6; target D:/wt-targets/odr. `.cargo/config.toml` sha256 was 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, equal to the brief's. The form's sha256 was 4d2c80e579c3730ee9b9aff466d48620455b14f88a41c0aa7eb6052a63025b20.

**Commits** (each signed off once, `-s` only, no `@` outside the first trailer line):
1. 5e38ffae942180fbd1b82d53046568113948bbf8, "feat: open-dataset-refuses-a-name-closed-during-admission, the product change (...)". The Watching arm now refuses as `skp.unknown_dataset`, after `resolves_unchanged` and the signal refusal and before `SessionRef::mint()`, when `self.catalog.get(handle.as_str())` is `None`. It drops the latch guard, then the watch, and mints, inserts, emits and removes nothing. The latch's lock-order doc comment now reads latch, then the catalog read guard, then generations.
2. 68773f09a83cc6de00968506ac6919ad138c7a5b, "test: ... the pinned test replaced and the words (...)".
3. da8c6cdc1eab427c6f5a4c521698748a0528104e, "docs: ... the record (RECORDED MUTATION lines ...)", doc comments only.

All three are pushed together. `origin/cut/open-dataset-refuses-a-name-closed-during-admission` equals HEAD, and `git status --porcelain` is empty.

**Commit 1's predicted failure.** `cargo test -p spatial-kernel --locked` at 5e38ffae exited 101 and failed only the pinned test, at skp.rs:5148 on its expect, "the open returns Ok although a close ran inside its admission". The message carried `code: "skp.unknown_dataset"` with the handle. The lib result was 164 passed, 1 failed. Plain `cargo test` stops at the first failing target, so I re-ran with `--no-fail-fast`. Every other kernel target was ok, so no other failure. The hold-run output files and the first lines of the transcript are the evidence.

**The new test** is `a_close_during_open_admission_refuses_the_open_and_mints_no_generation`, in `ticket_drop_under_lock_regression`. Its assertions follow note 4 in order:
1. The watch's pre-state and the inner close's `Ok`.
2. The open is `Err` with `code == "skp.unknown_dataset"` and `fields["handle"] == names[0]`.
3. The catalog does not hold the name.
4. `live_session` is `None`, then `live_generation` is `Err(NotOpen)`, then no record, then the watch flag is set.
5. `describe` and `viewport_query` refuse, and no ticket was minted.
6. `try_recv` is empty.
7. A second close refuses, with still no record and no generation.

The block comment above the module's tests names both forms.

**Mutations**, each applied at commit 68773f09 alone, run in a shared hold, then reverted. After each revert, `git checkout -- kernel/src/skp.rs` gave sha256 663a483201ac7c5106e503a50e528f4914ac5dae846ee06c04d6e539534e356d, the same as commit 2's file.
- M1 (check deleted): failed at the `expect_err` on the open's result (the open returned Ok). The panic was reported at line 5145 in the mutated file, which is skp.rs:5150 at commit 2.
- M2 (check after `mint_for_open`): failed at skp.rs:5161, the first `no live generation` assertion, on `live_session`. Both assertions in item 4 carry the message "no live generation", so the line number is what tells them apart.
- M3 (insert the `OpenRecord` before returning): failed at skp.rs:5173, `the open inserted no record`.

**Byte-copied spans.** One script, `odr-copy.mjs`, copied them. It then re-read SKP-V0.md and checked that each span is present and equal to its source slice.
- The human's sentence is in §1's `open_dataset` section. Source: directive line 25, the span inside the double quotes (the character before it is `"`), from `Refusal skp.unknown_dataset:` to `no message changes shape.`. 171 bytes, sha256 de629e2ff3f1517148cbd1862413429a2eb9d085fd4acd686266d924f8867155.
- The architect's note-5 source comment sits on the line after it. 440 bytes, sha256 ecd6ba69464fc3f0dd08c87f20fc2653e04bec7a7868e8ba7df59f1b4a5fa3b7. Both were checked against the form's backticked spans.
- The §8 OPEN-2 (B) note is a heading and a paragraph, inserted at the end of §8, before `## 9`. Heading: 97 bytes, sha256 466edbaf6a861d2b9fe235b935f88cc9ddb3d424dc81904c87dd8171f1bffeb0. Paragraph: 319 bytes, sha256 bc0a184d28ca0c44dbe371706fa42487d036bd056cea23ad59d0fa6cb5b9001f. They were checked against the form's `` `…` / `…` `` text. All checks printed true.

**Superseded pins** are in Amendment 3, appended to the earlier form with the Edit tool whose old_string ended the file through its final newline. Each is pinned at fa3d09f693466334b71c5d9258f243f5282918bc, which is an ancestor of origin/main. Each has the word "superseded" on its own line and names the replacement test.
- Line 9: sha256 29de1baeebc7b5c7a2c768b4c45baf4a2422496769f8d31e222c166eec227172.
- Line 133: sha256 b67a56142b0db61f8dac8efd6efa3e45c6ba3d707be91fb32896ab1dd3e0739b.
- I recomputed both hashes from `git show fa3d09f6:<path>`. They match the form's.
- `verify-test-claims` lists line 133 as superseded. It does not list line 9 at all, and it passes.

**Size** (`git diff --numstat origin/main...HEAD`): skp.rs 71+35, SKP-V0.md 7+0, the earlier form 9+0. That is 122 against the Scope's 140. The only files changed are those three.

**Checks at head** (all exit 0):
- `cargo test -p spatial-kernel --locked`: 46 result lines, 390 passed, 0 failed, 42 ignored, and the new test ok.
- `cargo test -p spatial-skp --locked`: 56 passed, 0 failed.
- `cargo fmt --all -- --check`: 0. I ran `cargo fmt -p spatial-kernel` once before commit 2 to fix the new test's formatting.
- `cargo clippy -p spatial-kernel --locked --tests --no-deps`: 0. It prints nothing for kernel/src/skp.rs. The 33 warning lines are in other files.
- `verify.mjs --offline`: PASS.
- `verify-cites.mjs`: PASS, with 76 loose references advised in other files.
- `verify-quotes.mjs`: PASS, 131 checked, 0 hash-reference errors. `--show-cites` on the three changed files also passed.
- `verify-test-claims.mjs`: PASS at commit 2's tree and at head, both "all 695 claimed test(s)", with 12 superseded.

**Pre-gate self-check.**
- **Interface:** the only cross-module read is `Catalog::get` at kernel/src/lib.rs:237, which I read first. It takes the read guard inside `get` and releases it. It is an existing `pub fn`, and I added no `pub` item. The end-to-end test starts from the real shape: a real `SkpHost`, a real `close_dataset` run inside `resolves_unchanged`, and a real `open_dataset`.
- **Completion claims:** each rests on a recorded run: the commit 1 failure, M1 to M3, and the head checks.
- **User-facing message:** it reuses the existing `unknown_dataset` message, which the code produces at this commit.
- **Assertions:** the test reaches its intended assertions. M1 to M3 each failed at the assertion the form predicts, and no mutation passed.

**Disclosures.** No stop rule was met.
- I did not change the ChecksOnly arm, `close_dataset`, `Catalog` or `GenerationRegistry`.
- No test other than the pinned one was changed or removed.
- The hold shape had `export` statements between `cd` and the hold, in the same Bash call. Every cargo call was inside a shared hold, and none was refused.
- The test's doc comment has one line over 100 columns, because it carries a path that must stay on one line.
- The new test's doc comment refers to the old test as "the one the earlier form pinned" and does not repeat its name.
- Two nodes, with the "proposed" status my words give them: the doc comment names `open-dataset-close-serialised-under-the-catalog-lock` as "the proposed node". The human's OPEN-1 (A) places it, but I did not check PLAN.

**Hold lines** (my project's only, `also=` elided): each hold printed `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> (...)`, followed by `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. There were 9 holds in all: commit 1's run (2), the new test (1), M1 to M3 (3), head kernel (1), skp (1), clippy (1). All were granted.

**Background shells.** Every background shell I started had exited before I reported, and no cargo process is left. Their task notifications showed completion.

**Model:** the harness reports claude-sonnet-5-5 (Sonnet 5.5). I used no model override and received or produced no context handoff.

**Paths:**
- Worktree C:/dev/wt/odr: kernel/src/skp.rs, protocol/skp/SKP-V0.md, kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md.
- Scratch files, all under the scratchpad and named `odr-*`: the hold, test, mutation, copy and check output.
