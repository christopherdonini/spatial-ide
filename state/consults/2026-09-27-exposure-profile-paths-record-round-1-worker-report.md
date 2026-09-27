*Custodian's filing note (2026-09-27): the exposure-profile-paths worker's record-round-1 hand-back (the final merge M″ and Amendments 10 and 11; head `7f422a9`), transcribed from the hand-back message with the harness's two-space indent removed. It is a worker report, not a gate report, and it prints no profile-naming string. Its path-and-line cites are into the branch; they are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the worker's text.*

---

Record round 1 complete. No STOP fired.

**Head, M″, N:**
- Worktree `C:/dev/wt/exposure-profile-paths`, branch `governance/exposure-profile-paths`.
- **Head = `7f422a9`** (Amendment 10 + 11).
- **M″ = `2b8813f`** — signed-off merge of `origin/main` (`9c9616a`) into the branch; parents `4155fcf` and `9c9616a`. No generated-file conflicts (all additive: `state/consults/...` reports, `state/gate-log.json` merged cleanly); `queue.mjs --check` / `site.mjs --check` both current.
- **N = 6**, unchanged (main's highest Custodian-role heading at `9c9616a` is still Amendment 5).

**Commit list, `ccdccfd` → head (17 first-parent commits to M″, plus the record commit):** `ccdccfd`, `209a9c3`, `c48a8dc`(merge), `1190057`, `980b10c`, `34f62c5`, `8f7698e`, `251fd80`(merge), `da80db0`, `f95da5a`, `d778421`, `b6add20`, `ebf0843`, `955e6c7`(C′), `f7a19e9`(merge, M′), `4155fcf`(Amendment 8+9), `2b8813f`(merge, M″), `7f422a9`(Amendment 10+11).

**Verbatim commands and results** (full detail, including the complete per-file re-derivation listing for both revisions, is in Amendment 11, `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` line 774-806):
- `git show origin/main:AI_DEVELOPMENT.md | grep -n "^## Amendment [0-9]* to the Custodian role"` — highest is Amendment 5 → N=6.
- `git diff --name-only origin/main...HEAD | wc -l` — 19.
- `git diff --stat 955e6c7 2b8813f -- scripts/hooks/profile-path-scan.mjs scripts/hooks/profile-path-scan.test.mjs .githooks/pre-commit .githooks/commit-msg` — empty (4.4 re-observation not owed).
- `git diff --numstat origin/main...HEAD -- DECISIONS-PENDING.md` — 1/1; `git diff -U0 origin/main...HEAD -- DECISIONS-PENDING.md` — one hunk; `redactRoots(removed)===added` — true.
- Byte-prefix (`git show origin/main:<file>` vs `git show HEAD:<file>`, `head.startsWith(main)`), all 5 true, totaling 39 appended lines.
- Re-derivation (`git ls-tree -r --name-only <rev>` / `git show <rev>:<path>`, this piece's own `scanText`): base `9c9616a` — 1123 files, 30 with findings; M″ `2b8813f` — 1127 files, 22 with findings. Identical file/class/count sets to the prior round (base minus the 8 files this piece rewords = 22); no new/unexpected file; invalidator 1 does not fire. Full per-file path/class/count listing is in the amendment (cross-checked programmatically against the raw script output — zero mismatches).
- Prediction 4: `git rev-list --first-parent --reverse ccdccfd~1..2b8813f` — 17 commits, both ends named by id (never HEAD). All 17 PASS (messages under `--message`, added lines under `scanText`).
- Suites at M″: node `349/349`; `cargo test -p spatial-kernel --no-fail-fast` (target dir set) — **281 passed, 0 failed, 28 ignored, 35 test binaries plus doc-tests** (no flake this run); verify-cites PASS (839 files, 58 loose advised); verify-quotes PASS (110/79/30/1/0, 2 hash-baselined); verify-test-claims PASS (300/88 files).
- Kernel-timing row (A3 Judge 4, now class-1 references only in Amendment 11 §11.5): alone-run `cargo test -p spatial-kernel --test end_to_end h2_a_cancel_before_the_first_batch_still_stops_the_query -- --exact` — 1 passed, 0 failed; green run of record cited as the gate-3 reviewer's run (281/0) or Product CI `36339620847` at `4155fcf`.

**Corrections applied (Amendment 11, §11.1-§11.4, §11.7):** A3-D3/G3-D5 (restated clauses withdrawn), A3-D4/G3-D3/G3-D4 (re-derivation and prediction-4 now complete and id-anchored), A3-D5/G3-D6 (discharge map corrected to the coordinator's exact map, including the 7.1(d)-names-a-doc-bullet-not-a-test note), A3-D6 (merge-base ambiguity resolved: this piece's own merge base stays `00cf306`, distinct from `origin/main...M″`'s base), G3's two nits (the count 20; "35 test binaries plus doc-tests"). A superseded index closes Amendment 11.

**Step 5 (resolve-before-commit):** every sentence of Amendment 10/11 was checked against the actual command outputs above before committing, including a programmatic cross-check of the two full re-derivation listings against the raw scan output (zero mismatches, zero missing/extra files). No mismatch found.

**Output discipline:** no raw `git diff`/`cat` on content that may hold a profile path; all checks via node scripts printing only paths/classes/counts/booleans; scratch work in `C:/dev/exp-fix2-scratch` (fresh, deleted after — confirmed gone); no `$USERNAME`/`$COMPUTERNAME` printed; commits used `-s` and explicit paths; file set stayed 19; `PLAN.yaml` untouched by my commits.

Per your instruction, **not pushing.** Awaiting your push, CI read, and scoped read of `4155fcf..head`.
