*Custodian's filing note (2026-09-26): the reviewer gate's attempt-1 report for PLAN node `governance-weekly-proposals-2026-09-26`, reviewed at governance/weekly-proposals-2026-09-26 @ f205478, filed as returned under state/consults/ (the piece's own rule on gate-report filing starts at its merge; extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text, as returned, except one cite on this file's line 93: its worktree path mixed separators, so `verify-cites` read the forward-slash tail as a rooted cite into main's tree, and a script rewrote that tail's forward slashes as backslashes. Nothing else changed.*

---

governance/weekly-proposals-2026-09-26 @ f205478fc1a664ff64911e63edfa570d2cf63685 — **PASS**

## 1. Verdict
PASS. I found no blocking issues. Every §9 duty below was run by me at f205478, and each observation names that commit. Merge base is a5d8b8b, and origin/main is b6bdf25. The tree was clean at the end (`git status --porcelain` empty). The temporary base worktree I created was removed and pruned.

## 2. Blocking findings
None.

## 3. Byte-check table
Method: a script (`bytecheck.mjs` in the session scratchpad) takes each T block from the form **at 340f516**. The block is the lines after the opening `~~~`, up to the closing `~~~`, or up to EOF for T6. The expected file is built as: base file at a5d8b8b + "\n" + the block's lines joined by LF + "\n". It is then compared buffer-for-buffer with `git show f205478:<file>`.

| T | File | Block lines | Closing fence | Base bytes | Head bytes = expected | Base is exact prefix | EQUAL | CR | Ends in one LF |
|---|---|---|---|---|---|---|---|---|---|
| T1 | docs/PREREGISTRATION-TEMPLATE.md | 14 | yes | 17108 | 21027 | yes | **yes** | 0 | yes |
| T2 | AUTONOMY.md | 7 | yes | 69329 | 71773 | yes | **yes** | 0 | yes |
| T3 | AI_DEVELOPMENT.md | 7 | yes | 63287 | 65298 | yes | **yes** | 0 | yes |
| T4 | .claude/agents/architect.md | 1 | yes | 12033 | 12963 | yes | **yes** | 0 | yes |
| T5 | .claude/agents/reviewer.md | 1 | yes | 12008 | 12989 | yes | **yes** | 0 | yes |
| T6 | .claude/agents/worker.md | 1 | **no** (Amendment 1) | 12567 | 13382 | yes | **yes** | 0 | yes |

- **Amendment 1 holds.** At 340f516 the form ends with T6's line and one LF. At c57a1cb, worker.md ended in `\n\n`. dd47574 removes exactly that one empty line.
- **P4 holds.** `git diff --numstat origin/main...HEAD` shows 0 deletions in all six governing files: architect 2/0, reviewer 2/0, worker 2/0, AI_DEVELOPMENT 8/0, AUTONOMY 8/0, template 15/0.

## 4. Mutation table
I applied each mutation myself at f205478 by `sed` on `scripts/plan/verify-cites.mjs:82`. I ran `node --test scripts/plan/verify-cites.test.mjs` with a 120 s timeout, then reverted with `git checkout --`. `git status --porcelain` was empty after each revert.

| M | Mutation | rc | Result | Failing assertion (observed) | Matches §4 |
|---|---|---|---|---|---|
| M1 | `['state/drafts/']` | 1 | 14 pass, 1 fail; only `a_broken_rooted_cite_in_a_filed_gate_report_is_advisory_and_its_siblings_stay_gated` | gated.length 3, not 2: the gates/ report's :99 became gated | yes |
| M2 | `['state/drafts/', 'state/consults/gates']` | 1 | 14 pass, 1 fail; the same test by name | gated.length 1, not 2: `gates-example.md`'s :96 became advisory | yes |
| M3 | `['state/consults/gates/']` | 1 | 14 pass, 1 fail; the same test by name | gated.length 3, not 2: the drafts file's :98 became gated | yes |

- Unmutated baseline at f205478: 15/15 pass, rc 0. Falsification (§5) is not met.

## 5. Checks at f205478, each with its rc
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: **rc 0**, 312/312 pass.
- `verify-cites.mjs`: **rc 0**, 755 files, 64 loose advisories.
  - P2: I ran the tool at a5d8b8b in a temporary detached worktree, since removed. Its 64 advisory lines are **identical** to the head's (sorted diff empty).
  - No `state/consults/gates/` exists at head or on origin/main, so §5's last invalidator is not triggered.
- `verify-quotes.mjs`: **rc 0**. 109 checked, 78 verified, 30 baselined, 0 hash-reference errors.
- `verify-test-claims.mjs`: **rc 0**. 227 claims across 82 files.
- `verify-mutation.mjs --base origin/main --head HEAD`: **rc 0**. 1 new test, mutation recorded. This result is not the observation; §4 above is.
- `verify.mjs --offline`: **rc 0**.
- `queue.mjs --check`: **rc 0**.
- `site.mjs --check`: **rc 0**.

**Other checks (§6, §7, §8, CR bytes):**
- **§6 temp-directory delta:** `verify-cites-git-*` count was 317 before and 317 after one `--test-name-pattern` run of the new test alone. **Delta 0.**
- **§7 budget:**
  - verify-cites.mjs is 6/2 and the test file is 39/0, so **47 ≤ 80**.
  - Non-generated files: the form, PLAN, the six governing files and the two scripts make **10 ≤ 10**. The other five changed files are the generated set.
- **Tool change (§2.2, §8 item 4):**
  - One non-exported constant, `C:\dev\wt\governance-weekly\scripts/plan/verify-cites.mjs:82` `const ARCHIVED_PREFIXES = ['state/drafts/', 'state/consults/gates/'];`
  - The `archived` line reads it: `C:\dev\wt\governance-weekly\scripts/plan/verify-cites.mjs:295` `    const archived = ARCHIVED_PREFIXES.some((prefix) => relPath.startsWith(prefix));`
  - The round-14 sentence is kept, and one sentence is added.
  - Nothing else changed apart from one empty line after the constant. No export lines are added or removed.
- **Test (§3, §4):**
  - The name matches §4 exactly.
  - The fixture is §3's: a three-line pool.rs and four files citing :99, :98, :97 and :96.
  - Cleanup is in a `finally` with `fs.rmSync`.
  - The RECORDED MUTATION comment describes the cites in words and has no path:line token.
  - The a5d8b8b test file is a byte-exact prefix of the head file (9184 of 11585 bytes), so the 14 existing tests are unchanged (§8 item 5).
- **§8, item by item:**
  - 1: no byte above any pre-piece end (prefix check).
  - 2: every appended text is identical to its block (table above).
  - 3: no class is renumbered, and classes 1–7 are untouched (prefix check). The new entries are 8 and 9.
  - 4: pass (above).
  - 5: pass (above).
  - 6: `git diff --name-status` touches no path under `state/consults/` or `state/drafts/`.
  - 7: see S1 below. Every added clause implements (a)–(e) or the ruling's reviewed-commit condition. Nothing is out of scope on my reading.
  - 8: a scan of the added lines found **no** `"`, curly quotes, `DECISIONS-PENDING` or `x.ext:N` tokens. The only `@`/`sha256` hits are placeholders: `<branch> @ <commit id>` in T2–T5, and `<path>:<a>-<b> @ <commit> sha256:<hex>` in T1. No real hash reference.
  - 9: temp-directory delta 0.
  - 10: PLAN.yaml has 0 CR bytes (blob and working tree). Its diff is the single `gate:` line.
  - 11: no ADR, docs/01 or docs/NN is touched.
- **Cites in the T texts resolve:**
  - `scripts/plan/verify-mutation.mjs` at a5d8b8b has the WHAT THIS DOES NOT GUARANTEE paragraph ("it does NOT run the mutation"). It and verify-cites.mjs are unchanged between 522493a and a5d8b8b.
  - The gate-log entry for node `kernel-ticket-drop-under-registry-lock`, architect attempt 2, carries the "Out-of-scope line naming a section-21a category takes the full form at dispatch" note.
  - Template §10 and AUTONOMY §21a–§21d exist.
- **Zero CR bytes** in all 15 changed files at HEAD.

## 6. Suggestions and nits
- **S1 (for the architect, §8 item 7):** the T texts add mechanics the proposals do not spell out:
  - T1's class-9 pre-code declaration list;
  - the PR-body/no-squash/PLAN-node steps in T1 (d);
  - T2's filing-note shape;
  - T3's "not deleted until that commit is reachable" rule for branches.

  I read each as implementing (a)–(e) or the ruling's condition, and they were preregistered at 340f516. Whether that is in scope is the architect's call.
- **S2:** because T6 has no closing fence, GitHub renders Amendment 1 (`C:\dev\wt\governance-weekly\scripts\plan\GOVERNANCE-WEEKLY-PROPOSALS-2026-09-26-PREREGISTRATION.md:178-180`) inside T6's code block. Also, the phrase "the form's last line" in Amendment 1 is true only at 340f516. The form is append-only, so this is a disclosure, not a fix.
- **S3:** Amendment 1 sits at the end of the file, not under §10 ("opens empty"). That placement follows from append-only. A reader looking in §10 will find it empty.
- **S4 (ledger finding for 2026-10-02, per §1):** the existing test `runVerifyCites gates a broken rooted reference, ignores doc-number, advises a loose one` never removes its `gitTree` directory. OS temp already holds 317 `verify-cites-git-*` entries, and each full-suite run adds one. This is outside this piece (§8 item 5 forbids touching it). It sits beside round 25 item 1 (b).
- **N1:** the new test's lines 197, 222, 223, 226 and 229 exceed 100 columns.
- **N2:** the new test identifies each finding by `relPath` only, not by the line number (97/96/99/98) that §4 names. It is unambiguous because each file has one cite, but asserting `target` would match §4's wording.
- **N3 (my footprint):**
  - My runs of the verify-cites test file (baseline, M1–M3, the suite, the temp-delta run) each left the pre-existing test's temp directory behind (S4).
  - I wrote to the shared session scratchpad `C:\Users\CHRIST~1\AppData\Local\Temp\claude\C--dev-spatial-ide\5d626cec-7aaf-40a2-9c79-6e4d2c8db2e6\scratchpad\`: `bytecheck.mjs`, `suite.txt`, `h.txt`, `b.txt`, `vc-base.txt`, `verify-cites.mjs.txt`, `verify-quotes.mjs.txt`, `verify-test-claims.mjs.txt`, `verify-mutation.mjs.txt`, `verify.mjs.txt`, `queue.mjs.txt`, `site.mjs.txt`. Any earlier custodian file with one of those names has been overwritten. `suite.txt`, `b.txt` and `h.txt` may have existed before.
  - I also used `/tmp/mut_M{1,2,3}.txt` and deleted them.

## 7. Gate-log note
@ f205478 (reviewer, attempt 1, full gating): PASS.
- **Byte check:** by script, T1–T6 were taken from the form at 340f516 and match their tails at f205478 exactly. Each base file at a5d8b8b is an exact prefix, and each file ends in one LF. T6 is a single line with no closing fence (Amendment 1), and dd47574's removal is confirmed. P4 is 0 deletions in all six files.
- **Tool change:** one non-exported `ARCHIVED_PREFIXES` with both slashed prefixes, read by `archived`, plus one comment sentence.
- **Tests:** the 14 existing tests are a byte-exact prefix. I re-applied M1, M2 and M3 at f205478; each fails only the new test by name, and each revert left the tree clean.
- **Temp and budget:** temp-directory delta 0. Budget 47/80, and 10/10 non-generated files.
- **Checks, all rc 0:** suites 312/312 and verify-cites, with the same 64 advisories as at a5d8b8b. verify-quotes, verify-test-claims, verify-mutation, verify --offline, queue --check and site --check also passed.
- **CR and §8:** 0 CR bytes, and §8 items 1–11 are clear.
- **Notes:** S1 (added mechanics, the architect's call); S2 (Amendment 1 renders inside T6's unclosed fence); S4 (the pre-existing verify-cites test leaks a temp directory per run, a ledger finding for 2026-10-02).
- Model observed: Opus 5.5.
