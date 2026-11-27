# The recovery offer's base corrected at 97e2156d (ADV-2026-11-27-43 item 1), the worker's report

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-43-the-recovery-base-corrected-by-one-commit-outside-part-1s-count-b-carries-the-two-lines-on-main-a-required-protocol-member-named.md`, item 1. One commit on cut/b2-piece-1c-step-3-recovery-offer in D:/wt/recov, from f533fadc46728648c028dfafa318a1aece322c1b to 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b. A sonnet worker (worker) made it, with no build, app, dev server or e2e suite started. Its run, by the facts script, has its first record at 2026-11-27T23:38:15Z and its last at 2026-11-27T23:38:53Z; by its completion notice it took 37229 ms and 10 tool uses. The custodian checked by git that the commit's only parent is f533fadc and its diff is 2 insertions in frontends/shell/src-tauri/src/page.rs. Below the rule is its hand-back, saved by Write with the harness's indent removed (1855 bytes, sha256 c31fd55cc5eb303f1c286389140060b4fa410f614dad4b3729cdf1e0319473c3), byte for byte. Its account is the worker's; the reviewer's narrow read checks it.*

---

New commit: 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b, pushed. Before the edit, HEAD was f533fadc… and the tree was clean.

Field: `set_aside_file_id: bool` in both requests. Its doc says "Always present, `false` for no choice", with no `#[serde(default)]`. That is protocol/skp/src/v0/commands.rs:40-48 for OpenDatasetRequest and :820-824 for OpenProjectRequest. I chose `false` for both.

fmt: `cargo fmt --check` in frontends/shell/src-tauri exited 0 with no output. I ran no build, test, check or clippy.

Push check: `git rev-parse HEAD` and `origin/cut/b2-piece-1c-step-3-recovery-offer` both give 97e2156d…, and `git status --porcelain` is empty.

`git show --stat HEAD`: commit 97e2156d, subject "fix: the recovery offer's base: page.rs's two test request literals take set_aside_file_id (ADV-2026-11-27-43 item 1)", one body paragraph, trailers Co-Authored-By and the Signed-off-by that `-s` added. One file changed: frontends/shell/src-tauri/src/page.rs, 2 insertions, 0 deletions.

`git show HEAD -- frontends/shell/src-tauri/src/page.rs`:
@@ -794,6 +794,7 @@ mod tests {
                 crs_assertion: None,
                 identity: None,
+                set_aside_file_id: false,
             }
@@ -819,6 +820,7 @@ mod tests {
                 answer: None,
                 relink: None,
+                set_aside_file_id: false,
             }
(The two hunks are in `open_request` and `reopen_request`. The field is last, after the existing members.)

Departure: my first sed pass range ended one line too early and inserted only the first line. I added the second by a second sed over lines 817-822 before committing, so the committed diff is the intended 2 insertions. The first Edit call failed because I had not Read the file, so it changed nothing.

Model: Sonnet 5.5. No override, and no context handoff received or produced.
