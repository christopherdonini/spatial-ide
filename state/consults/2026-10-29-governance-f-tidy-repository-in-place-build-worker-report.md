*Custodian's filing note (2026-10-29): the worker-high's third report on phase 2 of governance piece F's build, after its second resumption, at 2026-10-29T09:32:08.290Z, under the second addendum brief. The custodian's check: origin's cut/governance-f-tidy-repository-in-place is C2 494cea7b on M a8ae51d9 on P 51a2cbad (main at the build); M is 188 R100 lines and nothing else by `git diff --name-status -M100%`; C2 is 45 files and 1542 lines by section 7's counting command. By its transcript since the resumption: one reset of the unpushed local branch (permitted), two commits, one read-only fetch of origin/main and one push; no cargo call. The run to 10:14:09Z (Bash 50, Read 4, Edit 11, Write 2). Extracted by script from its third SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 67aeccb0dd7db377392fc57c1ae9388f5109bd71d478d93b2e1e565e84c0a29f.*

---

Built: governance-f-tidy-repository-in-place at 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2

Both commits are pushed and origin's branch equals HEAD. I read the second addendum and showed its sha256 first: a337a0234c0c08fb7f7a2d92428985a2a3d6d3a2e612863173ae817617d4d257. The saved patch's sha256 matched 8bd1417010ff43004605aab70dcadc412e176e10ad31b0ff0be6c154caa0832a before I discarded the earlier staged work.

**Base and state**
- The branch was reset once (the permitted `--discard-changes` switch) to the new P = 51a2cbad7222a63c69b6b26a1ac6833425ca77f9. HEAD equalled P with an empty porcelain.
- M = a8ae51d9d0a7f44d65ea7913639ad69918d32389, C2 = 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2. Both are signed off.
- Git status is empty, and `git fetch origin main` (read-only) before the push showed origin/main still at P. No commits gained.
- Both commit message files had no `@` outside the Co-Authored-By line. I wrote no email.
- Background shells left: none. Every shared hold was released.

**M**
- 188 renames. Rule R at this P gave 188 rows (34 stay), identical to the earlier derivations.
- Section 2.1's table matches 186 of them. The delta rows are `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md` to `governance/forms/kernel/`, and `scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md` to `governance/forms/scripts/`, both with the same basename.
- Check 1: 188 `R100` lines, nothing else (`--shortstat` shows 0 insertions, 0 deletions).
- Check 2: 188 blob ids and basenames equal.
- Check 3, as Amendment 3 states it: all 188 rows pass, with oldest commits and commit lists equal.

**C2**
- The saved patch applied with `git apply --3way` with no conflict, leaving out the generated files.
- `moved-map.mjs add` gave 188 rows. `--check` passes. `rewrite-gates` rewrote 160 of 162 non-none gate lines. The queue and the site were regenerated.
- Amendment 4 is built in `scripts/plan/verify-test-claims.mjs`:
  - A pinned reference's path and the citing form's path are compared after both pass through `governance/MOVED.tsv` (`samePinnedPath`).
  - A pinned line is read at its rev from the form's path at that rev (`pathAtPinnedRev`, through `pathAtRev`).
  - The map is reloaded at the start of each run, and with no MOVED.tsv the script behaves as before.
  - The blame of a claim line needed no change: `git blame` already follows a pure rename.
- T18 and T19 are in `verify-test-claims.test.mjs`, with names matching the form byte for byte (checked with `grep -F`).
- Both tests pass. Their mutations were applied alone and reverted, the file's sha256 prefix 47673e0005097c69 before and after:
  - T18, mutation `m[2] !== relPath` in `markedSpans`: fails by name, the claim reported as not found. T19 still passes under it.
  - T19, mutation `const shownPath = relPath;` in `gitShowFile`: fails by name, "refused: hash does not recompute". T18 fails under it too, since it reads the same pinned line.
  - Both observed over M, and each test's comment records it.
- T14 and T15 mutations were re-observed on this M (the earlier M is gone). T14: the default path set back to the root `PLAN.yaml` fails by name. T15: item 5 set back to `PRECEDENTS.md` fails by name. Both files were reverted to the same digests, and the comments name a8ae51d9d0a7.
- Readings recorded by Amendment 5 are built as it states:
  - T15 leaves out the one old root path inside the human's words in the reading order.
  - `ROTATING_LEDGERS` holds both names.
  - `verify-cites.test.mjs` is unchanged.

**Size (section 7's command)**
- 45 files and 1542 lines (+1298 −244), against at most 1,600 and 48.
- `PLAN.yaml`: 160 gate lines rewritten (160+/160−), against at most 160.

**Section 5, P and then C2**

| Check | P (51a2cbad) | C2 (494cea7b) |
|---|---|---|
| `verify.mjs`, online and `--offline` | 0 and 0, PASS | both PASS |
| `verify-cites` | exit 0, 2512 scanned, 78 advisory | exit 0, 2519 scanned (P+7), 78 advisory; 79 output lines equal after mapping |
| `verify-quotes` | 132 checked, 101 verified, 30 baselined, 1 advisory, 2 hash-baselined, 887 ruling cites, 214 scanned | identical counts; dump of 8175 lines (6403 hash-checked cites, all PASS, 0 findings) equal after mapping |
| `verify-test-claims` | exit 0, 695 claims across 214 files, 43 planned, 11 superseded, 17 withdrawn | identical: exit 0, same counts and sets; 74 stderr lines equal after mapping, stdout equal |
| `node --test` (plan, hooks, evidence) | 570 pass, 0 fail | 589 pass, 0 fail; before-names ⊆ after-names, 19 additions = section 4's 16 from phase 1 plus T14, T18, T19 |
| `queue.mjs --check` / `site.mjs --check` | PASS / PASS | PASS / PASS |
| `moved-map.mjs --check` / `forms-layout.mjs` | | PASS / PASS (178 forms) |
| `citationIntegrity.test.mjs` | | PASS |

- The Guardian tests were not run, because they need `claude plugin test` and the `claude` command is forbidden to me.
- Queue and site: against P's committed outputs, with old paths mapped on both sides, they differ only in `plan_hash` and the generation stamps. `site/index.html` also has the three evidence-path links that now read `governance/...`.
- Hooks, run on the real plan:
  - Stop with a held lease blocks and names the plan's first ready node.
  - PreCompact blocks on the real tree's stale block; the fresh-block allow is covered by the hooks test.
  - SessionStart's reading order names no missing path except the one mention inside the human's words.
- measure-reads `routine`: P's script at P and C2's script at C2 print byte-identical stdout, sha256 7b80014f6be42c19454226460209d20b14b50784f952d3cf076ab0b5e333f8dc.
- measure-reads `corpus`, from clean checkouts with ripgrep 15.0.0 (the SEARCH-IGNORE record says 15.2.0):
  - P: files=2299, bytes=42192301. C2: files=2307, bytes=42288607.
  - The listed set equals P's set mapped through MOVED.tsv plus 8 added files, with 0 dropped.
  - The byte difference of 96306 equals the sum over added and edited listed files (35 edited).

**verify-cites wall time**
- Three runs each, in a shared hold: P 3911, 3859, 3832 ms; C2 23120, 23633, 23016 ms.
- The slowdown is the post-move blame. It is far inside the 15-minute job timeout.

**Measurement (a) and (b)**
- (a) root entries: 59 at P, 32 at C2.
- (b) `.md` files in the code folders: 206 at P, 46 at C2 (160 fewer).
- Forms outside `governance/forms/` and `state/`: 2, both on OPEN-1's list.
- OPEN-2 digests, P to C2:
  - `measure-reads.mjs`: 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1 to eec8d1d4e50b20f8266554b55ecca156ad9024cfa606b86ab10f89e643fb4a79
  - `.ignore`: d59148d1e369b280052884c8434b2b01d083a8ff6012f9ca4ff731fad32673cf to c3024d471bc6c72aaba245da72bd99f5f83a11923f16ed3b2a855854a3a4e678

**What C2 changes beyond a plain path edit** (a script checked every other changed line as the old line with path prefixes only)
- The governance-ci filters (`governance/MOVED.tsv` added to both) and its two new steps.
- The `governance/` bullet in `CLAUDE.md`.
- The dated pointer at the end of `governance/AUTONOMY.md`.
- `README.md`, built from the architect draft with eight kept spans copied from P's README by script. Every kept span is byte-identical to P's, script-checked. The only unqualified name is `PLAN.yaml` in the `governance/` bullet, which exists as `governance/PLAN.yaml`.
- `governance/README.md`.
- `citationIntegrity.test.mjs`: three path joins.
- `run-cold-open.ps1`: the usage path, and `Set-Location (Join-Path $PSScriptRoot '..')`.
- `mkdir` lines in two test files that now write under `governance/`.
- Two regex or cite-prefix path changes in `rotate-decisions-pending.test.mjs`.
- The Amendment 4 code and tests, plus the Amendment 5 readings.
- `.claude/agents` edits are 8 backticked path tokens in `architect.md` and `reviewer.md`, none inside a quoted span. No Guardian or harness refusal was met.
- `RELEASE-DAY-CHECKLIST.md` and `LICENSES/README.md` are untouched.

**Left open or noticed, not done**
- The PR body needs the delta rows above, the open PR list at the click and the README clause table. The architect draft's table is the starting point; its D2 note says the row-5/7/8 pins must be the tag's own lines, not main's.
- The `PLAN.yaml` gate rewrite must be re-run if main moves before the click.

**Model:** Sonnet 5.5 (claude-sonnet-5-5) as the harness reports. No override. No context handoff received or produced.
