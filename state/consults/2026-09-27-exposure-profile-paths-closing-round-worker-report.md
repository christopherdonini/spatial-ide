*Custodian's filing note (2026-09-27): the exposure-profile-paths worker's hand-back for Amendment 7's steps 6 to 8 (the final merge M′ and the closing record; head `4155fcf`), transcribed from the hand-back message with the harness's two-space indent removed. It is a worker report, not a gate report, and it prints no profile-naming string. Its path-and-line cites are into the branch; they are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the worker's text.*

---

7.13 steps 6-8 complete. No STOP fired.

**Head, M′, N:**
- Worktree `C:/dev/wt/exposure-profile-paths`, branch `governance/exposure-profile-paths`.
- **Head = `4155fcf`** (Amendment 8 + 9).
- **M′ = `f7a19e9`** — signed-off merge of `origin/main` (`254fbfa`) into the branch; parents `955e6c7` (C′) and `254fbfa`. Generated-file conflicts (PLAN.yaml, CUSTODIAN-QUEUE.json/md, site/index.html, site/data/plan.json, state/gate-log.json) all auto-resolved cleanly by git (this branch has zero changes of its own to any of them); `node scripts/plan/queue.mjs --check` and `site.mjs --check` both report current, no regeneration needed.
- **N = 6**, unchanged (`git show origin/main:AI_DEVELOPMENT.md` at `254fbfa` — highest Custodian-role heading is still 5).

**Commit list, `ccdccfd` → head:** `ccdccfd`, `209a9c3`, `c48a8dc`(merge), `1190057`, `980b10c`, `34f62c5`, `8f7698e`, `251fd80`(merge), `da80db0`, `f95da5a`, `d778421`, `b6add20`, `ebf0843`, `955e6c7`(C′), `f7a19e9`(M′, merge), `4155fcf`(Amendment 8+9).

**Re-run results at M′** (full detail and commands are in Amendment 9, `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` line 727-749):
- 2a′'s three checks (against `origin/main...HEAD`): PASS — 1 added/1 removed, one hunk, redact(removed)==added.
- §3's byte-prefix check, five append targets: all PASS.
- Re-derivation: base (`254fbfa`) 1118 files/30 findings; M′ (`f7a19e9`) 1122 files/22 findings — exactly §2a's revised 20 plus the same 2 already-routed main-added hits (`engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `state/consults/gates/...gate1-reviewer.md`). No new/unexpected file; invalidator 1 does not fire.
- Node suites: `scripts/hooks/profile-path-scan.test.mjs` 34/34; full glob (`scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`) 349 pass, 0 fail.
- **cargo test -p spatial-kernel (unfiltered, `--no-fail-fast` for a full count): 280 passed, 1 failed, 28 ignored, 36 binaries.** The one failure is `h2_a_cancel_before_the_first_batch_still_stops_the_query` (`kernel/tests/end_to_end.rs` line 399, a sub-100ms latency assert, code from `d400a475`/2026-08-09 — not a file this piece touches). Confirmed flaky: passes alone in isolation; failed twice under concurrent load at two different observed latencies (252.7ms, then 163.6ms). This piece changes no kernel code, so this is pre-existing on `origin/main`, not something this merge caused — disclosed in Amendment 9 as class 1, not treated as a STOP (no piece invalidator covers kernel timing tests). Flagging for your awareness before push/CI in case you want a second opinion.
- verify-cites / verify-quotes / verify-test-claims: all PASS (834 files/50 loose advised; 110 checked/79 verified/30 baselined/1 advisory/0 errors/2 hash-baselined; 300 claims/88 files/11 planned/3 superseded/15 withdrawn).
- Prediction 4 (reduced form), first-parent `ccdccfd~1..HEAD`, 15 commits: PASS — every non-merge commit's message and added lines clean, every merge's message clean.
- 4.4's re-observation: not owed (scanner/tests/hooks byte-identical between C′ and M′, confirmed by empty `git diff --stat`).

**Step 8 (resolve-before-commit):** every sentence of Amendment 8/9 was checked against the actual command outputs above before committing; no mismatch found.

**Output discipline:** no raw `git diff`/`cat` on content that might hold a profile path (2a′ and re-derivation checks done via node scripts, printing only counts/booleans/paths/form-classes); scratch work in `C:/dev/exp-fix2-scratch` (created fresh, deleted after — confirmed gone); no `$USERNAME`/`$COMPUTERNAME` printed; commits used `-s` and explicit paths; the local commit-msg hook actually caught one unsigned merge-commit attempt (I re-ran with `-s`).

Per your instruction, **not pushing.** Awaiting your step 9 (push, read CI, mark PR #133 ready after gate 3).
