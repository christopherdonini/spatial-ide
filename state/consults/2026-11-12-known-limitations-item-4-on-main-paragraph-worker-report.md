*Custodian's filing note (2026-11-12): the KNOWN-LIMITATIONS item 4 worker's report, from its hand-back (2909 bytes, sha256 3dbcfec74e77c58b0ba6904941138687c7197f7cf06eea451b938d6ccc2992a8), below the rule. The scratch folder's full path, written once in it, is given here as `<S>`, and a final newline is added; nothing else is changed. Its brief by file (5975 bytes, sha256 c6d923716dcb02e2d0012922684017701fafd38c0fc2b1feb385d3cf7b3d83d9); the run 15:46:31Z to 15:59:33Z by its transcript, 21 calls (Read 5, Bash 13, Write 2, SubagentHandback 1), no heavy command and no hold, model claude-sonnet-5-5. One call errored: a foreground `sleep 100` before a read of a background task's output, refused by the harness; the report does not name it. It read Part 1 of the directive of 2026-11-05 through item 7, where the brief named items 1 to 9, and says so. Its commit f56d6efe changes line 80 only, and the line equals the one its brief gave, by the custodian's check; pushed. A report, a reading and not Authority.*

---

Built: known-limitations-item-4-on-main-paragraph at f56d6efe8050324b1396e4b2d257f33061b31471

Start state: the brief's sha256 matched (c6d92371...). After `git fetch -q origin` (rc 0), the worktree HEAD and origin/main were both c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e, and the porcelain was empty.

Hashes:
- Form: 866571f23b8949b27929d9d9aa532ae66811aacc3e31dd3fc5d2f579587aaa59 on disk and via `git show c85788f1:<form>`.
- Old line `kl4-old-line.txt`: 329 bytes, sha256 1d1ac5a0ed176bd4524fb26303c89c3af2c87f3d26663ab16897b1abc6341e7b.
- New line `1112y-kl4-line.txt`: 407 bytes, sha256 ff6dbce9bb743e1e67f40757a1cdff873f710cfc90120317389ae31343a0dc59.
- All three match the brief.

Reading: I read the form, the directive lines 20-27 (the human's words are at line 25), and Part 1 of the 2026-11-05 directive through item 7 (the first 60 lines). I did not read items 8 and 9. Nothing in those lines bore on this one-line change.

Script: `<S>/kl4-w-apply.mjs`, where `<S>` is `<S>`. It is written with the Write tool and holds all the brief's checks 1 to 5. The full source is in that file.
- Output: `KL4-OK`, rc 0.

Checks (output redirected to `<S>/kl4-w-*.out`, rc shown):

| Check | rc |
|---|---|
| `git diff --check` | 0 |
| `profile-path-scan.mjs --staged` | 0 (output: "profile-path-scan: clean") |
| `verify-cites.mjs` | 0 (PASS; 193 loose references advised) |
| `verify-quotes.mjs` | 0 (the output lists 1 advisory and 30 baselined entries, none on KNOWN-LIMITATIONS.md) |

I ran the last three in one background call, so the harness reported that call as failed. The failure came from my `tail -3` on several files, after the three rc lines had printed.

Commit: f56d6efe8050324b1396e4b2d257f33061b31471, `docs: KNOWN-LIMITATIONS item 4's On-main paragraph in the human's words`. `git show --stat` shows ` KNOWN-LIMITATIONS.md | 2 +-` and `1 file changed, 1 insertion(+), 1 deletion(-)`.

Message file `<S>/kl4-w-msg.txt`: the subject, one blank line, then the Co-Authored-By trailer and the Claude-Session trailer. It has no sign-off line and no email. `-s` added its own sign-off at commit time, and I did not quote it.

Push: `git -C C:/dev/wt/kl4 push -u origin cut/known-limitations-item-4-on-main-paragraph` ran in its own call and was accepted (new branch). `ls-remote` afterwards shows f56d6efe8050324b1396e4b2d257f33061b31471 for that branch, which is my commit. The porcelain is empty.

Beyond the brief: I wrote two extra scratch files in `<S>`, `kl4-w-commit.out` and `kl4-w-apply.out`, and I made no other edits. I started two background wait loops with a mistyped path. They did nothing and finished harmlessly when the quotes run ended. No PR action, no CI wait.

Model: Sonnet 5.5, `claude-sonnet-5-5`, as the harness reports it; no override and no context handoff.
