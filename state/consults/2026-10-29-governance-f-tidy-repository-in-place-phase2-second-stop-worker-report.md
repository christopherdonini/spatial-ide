*Custodian's filing note (2026-10-29): the worker-high's second report on phase 2 of governance piece F's build, after its resumption under the addendum brief, stopped at section 5's verify-test-claims comparison. The custodian's check: the branch's local head in C:/dev/wt/pf is M 2003f8e2 on P 212be170, never pushed (origin holds no such branch); C2 is staged and uncommitted. By its transcript since the resumption at 2026-10-29T08:20:28.693Z: no push, no cargo call; one reset of the unpushed local branch, as the addendum permits. It discloses one stray command killed by its own PID, and an empty file it created and removed in the user's home folder by the same slip. The run to 09:23:20Z (Bash 129, Read 8, Write 14, Edit 18). Extracted by script from its second SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is e16f50396cc473081dd04ed3bfee0b1698d222296ff5c4044a5344797afa2788.*

---

Stopped: governance-f-tidy-repository-in-place, `verify-test-claims` gives a different result at C2 than at P (exit 1, 31 findings against PASS with 0). Section 5 allows no such difference and section 8 item 7 stops on it. M is committed locally and not pushed. C2 is built and staged in the worktree but not committed, and nothing is pushed.

Addendum brief a3766b7595009b36694e1f25480aae6ba928bce1776a03dc2caed8d596e24611 shown first, with the first brief's sha256 as before.

**State left**
- Branch `cut/governance-f-tidy-repository-in-place` in C:/dev/wt/pf is at M = 2003f8e2b81fa96aea6ad109e88849c54f203bd5 on P = 212be1700f0b08b0f5808a568cd61bac332250a7. I reset the unpushed local branch once, as permitted, and HEAD equalled P with an empty porcelain before M.
- The porcelain now shows 51 staged paths (43 modified, 8 added), nothing unstaged or untracked. A patch copy of the staged state is in my scratch folder as `pf2-c2-staged.patch`.
- The local ref origin/main now reads 9ba08951, two commits past P. I did not merge it.
  - a0b5ad25: the #269 gate 1 reviewer report.
  - 9ba08951: #269 closed for the click. It touches `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md` (the delta-row form, same path), `PLAN.yaml`, the queue and site files, `state/` files and `state/gate-log.json`.
  - A resumed build must merge main, re-run rule R and `rewrite-gates`, and redo the proof.
- Background shells: none left. Every hold was released. One `cat` I started by mistake was killed by its own PID. I also created and removed an empty file in the user profile folder with the same slip.

**Why it stopped**
- At C2, `verify-test-claims` exits 1: 31 findings against 0 at P. Its counts moved as follows:

| Measure | P | C2 |
|---|---|---|
| Superseded | 11 | 4 |
| Withdrawn | 17 | 0 |
| Claims "not found in any test file" | 0 | 24 |
| Withdrawn-test rows invalid ("refused: another file's path") | 0 | 7 |

- Cause: `scripts/plan/verify-test-claims.mjs` has no move map. It compares a pinned reference's path (the old path, as written in the form) with the form's current path at lines 258 and 648. It also reads `git show <rev>:<current path>` at lines 291 and 602, and runs `git blame` on the current path at line 435.
- Section 2.2's table gives that file one line (871, the plan path). Phase 1 changed none of its code, and phase 1's rehearsal ran verify-cites, verify-quotes and verify but not verify-test-claims.
- I did not edit the logic. The fix is a change to the form's table: map-aware path compare and read at those lines, plus a test. The custodian or the human has to rule on that.

**M (committed locally)**
- Subject: `chore: governance piece F, the moves-only commit (188 renames by rule R)`.
- Rule R at P gave 188 rows to move and 34 to stay, with no problem and no collision. It is identical to the first derivation at cac8cba0. A script compared it with section 2.1's table: 186 rows match, 0 are missing, 0 differ.
- Delta rows for the PR body:
  - `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md` to `governance/forms/kernel/`, same basename.
  - `scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md` to `governance/forms/scripts/`, same basename.
- Check 1 passes: 188 `R100` lines match the 188 rows exactly, and `git diff --shortstat` shows 188 files, 0 insertions, 0 deletions.
- Check 2 passes: 188 blob ids equal and 188 basenames equal.
- Check 3 passes, run as Amendment 3 states it on all 188 rows: oldest commits of `--follow M -- <new>` and `--follow M^ -- <old>` equal, and the two commit lists (M excluded) equal.

**C2 as built (staged, uncommitted)**
- Phase 1's patch applied cleanly with `git apply --3way`, and the 16 files are byte-identical to 810f6f15.
- `governance/MOVED.tsv`: `moved-map.mjs add` gave 188 rows, `--check` PASS, LF only, ASCII.
- `rewrite-gates`: 162 gate lines that are not none, 160 rewritten, no other byte of `PLAN.yaml` touched.
- The path edits from section 2.2's table were done by script on named lines:
  - scripts and hooks;
  - tests, with a `mkdir` line added in two test files (`docsOnly.test.mjs` and `verify-test-claims.test.mjs`) that write under `governance/`;
  - governance-ci's filters (`governance/MOVED.tsv` added to both) and its two new steps;
  - `.ignore` line 2;
  - `scripts/run-cold-open.ps1` lines 24 and 36;
  - `frontends/shell/e2e/citationIntegrity.test.mjs` at its three lines.
- The OPEN-7 rows are done:
  - `CLAUDE.md` lines 8, 33 and 35, plus one `governance/` bullet in the layout section.
  - `CONTRIBUTING.md`, `docs/README.md` and `docs/PREREGISTRATION-TEMPLATE.md`.
  - The issue template line 10.
  - The dated pointer appended at the end of `governance/AUTONOMY.md`.
- `.claude/agents/architect.md` and `reviewer.md`: only backticked path tokens outside quoted spans, 8 lines in all. `worker.md` and `lead-data.md` hold no backticked token to change, so they are untouched.
- `RELEASE-DAY-CHECKLIST.md` is untouched (Amendment 2). `LICENSES/README.md` is untouched, because no sentence of it became untrue.
- `governance/README.md` is written, one line per entry plus where new forms go and how an old path resolves.
- `README.md` is built by script from the architect draft's item 1. Eight kept spans of P's README are present byte for byte (script-checked). The only new-text name that does not exist as written is the unqualified `PLAN.yaml` in the `governance/` bullet; `governance/PLAN.yaml` exists. I left the draft's wording.
- Queue and site were regenerated. Against P's outputs, with old paths mapped on both sides, they differ only in `plan_hash` and the generation stamps. `site/index.html` also has the 7 evidence links that now read `governance/...`, as OPEN-6 (A) intends.
- Size by section 7's command: 45 files and 1444 lines (+1207 −237), against at most 1,600 and 48. `PLAN.yaml` gate lines: 160 rewritten (160+/160−), against at most 160.
- No Guardian or harness refusal was met.

**T14 and its mutation**
- Test: `stop-queue: the default plan path is governance/PLAN.yaml`.
- Mutation: the default path in `stop-queue.mjs` set back to the root `PLAN.yaml`. It failed by name with "the hook did not reach the plan" and the allow-with-no-plan message. The file was reverted to the same sha256 prefix, 58c8ad94165e6af0.
- The mutation was observed on the working tree over M, before C2 was committed. T14's comment says so.

**Section 5, before at P and after at C2**

| Check | P (212be170) | C2 (staged tree) |
|---|---|---|
| `verify.mjs` online / `--offline` | 0 / 0, PASS | `--offline` PASS (online not re-run) |
| `verify-cites` | exit 0, 2509 scanned, 78 advisory | exit 0, 2516 scanned (P+7), 78 advisory, advisory set equal after mapping, stable across 3 runs |
| `verify-quotes` | 132 checked, 101 verified, 30 baselined, 1 advisory, 2 hash-baselined, 887 ruling cites, 214 scanned | identical counts; full dump of 8174 lines equal after mapping |
| `verify-quotes` dump detail | 6402 hash-checked cites, all PASS, 0 findings | same |
| **`verify-test-claims`** | exit 0, 695 claims, 43 planned, 11 superseded, 17 withdrawn | **exit 1, 31 findings (the stop)** |
| `node --test` (scripts/plan, hooks, evidence) | 570 pass, 0 fail | 587 pass, 0 fail (rerun after the ROTATING_LEDGERS reading below) |
| New test names vs section 4 | | 17 new names, exactly section 4's, none removed |
| `queue.mjs --check` / `site.mjs --check` | PASS / PASS | PASS / PASS |
| `moved-map.mjs --check` and `forms-layout.mjs` | | PASS and PASS (178 forms) |
| Hooks (script run on the real plan) | | Stop with a held lease blocks and names the plan's first ready node. PreCompact blocks on the real tree's stale block; the fresh-block allow is covered by the hooks test. SessionStart's reading order names only existing paths, except the one mention inside the human's words (see readings). |
| `citationIntegrity.test.mjs` | | PASS |
| measure-reads `routine` | total=215928 | byte-identical stdout, sha256 d864ad6de38088d091ea0966bbc9ee3bd59845057595719fa3d2d05b01e16f4f |
| measure-reads `corpus` | files=2297, bytes=42165264 | files=2305, bytes=42255857 |

- Corpus comparison holds. C2's list equals P's mapped set plus 8 added files (7 new files plus `MOVED.tsv`), with 0 dropped. The byte difference of 90593 equals the sum over added and edited listed files (35 edited).
- `verify-test-claims` outputs are in my scratch folder.
- Guardian tests: not run. Their README runs them with `claude plugin test`, a `claude` command I may not issue. CI or the human runs them.
- The "online" verify at C2 was not re-run, only `--offline` and the drift checks.

**Measurement**
- (a) root entries: 59 at P, 32 at C2.
- (b) `.md` files in the code folders: 206 at P, 46 at C2 (160 fewer: 158 plus the two delta forms).
- Forms outside `governance/forms/` and `state/`: 2 at C2, both on OPEN-1's list.
- OPEN-2 digests, P to C2:
  - `measure-reads.mjs`: 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1 to eec8d1d4e50b20f8266554b55ecca156ad9024cfa606b86ab10f89e643fb4a79
  - `.ignore`: d59148d1e369b280052884c8434b2b01d083a8ff6012f9ca4ff731fad32673cf to c3024d471bc6c72aaba245da72bd99f5f83a11923f16ed3b2a855854a3a4e678
- `verify-cites` wall time in a shared hold, three runs each: P 3877, 3975, 4120 ms; C2 26882, 24828, 27543 ms. That is about 6.7 times slower, from the post-move blame. It is far inside the 15-minute job timeout.

**Readings the form left open (flagged for the gate)**
1. **Item 3 of the reading order in `session-resume.mjs`.** It carries the human's words byte for byte, and the item 3 test pins them to the directive. Those words say "in DECISIONS-PENDING.md" by its old root path. I left them unchanged and edited only the leading path of item 3. T15 therefore leaves that single mention out of its path check, and every other name stays checked. This is a change to phase 1's T15, not path-only. I re-observed T15's mutation for it: item 5 set back to `PRECEDENTS.md` fails by name, and the file was reverted to the same digest. The comment above T15 says so.
2. **`ROTATING_LEDGERS` in `verify-cites.mjs`.** I added `governance/DECISIONS-PENDING.md` beside the old name (three members). With one name, either the verify-cites test fixtures or the rotate-decisions-pending fixture fail, because neither fixture has a map. This is a set addition, not a pure path edit. Production works with either, through the map.
3. **`verify-cites.test.mjs`.** It is unchanged. The table's line 475 edit would have broken its "subfolder is advice" assertion.
4. Test lines the form's table cites do not match P exactly, so I edited the lines each test actually needs. Where the check text matches a message that now carries the governance path, I changed the regex path only. I made two `${DP} ${FELT}` cite changes to the literal `DECISIONS-PENDING.md ` in `rotate-decisions-pending.test.mjs`, so the verdict-cite prefix stays as written.

**Model:** Sonnet 5.5 (claude-sonnet-5-5) as the harness reports. No override. No context handoff received or produced.
