*Custodian's filing note (2026-10-02): the architect's gate 1 on PR #153, for PLAN node `exposure-scan-ci-backstop`, full gating. Reviewed: cut/exposure-scan-ci-backstop @ 5d3951fbe337e78dfc6076e307763497b41362ff (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 5d3951f. Verdict PASS, with one S2: the workflow header's not-claimed item names the runner's own flattened form, which `MACHINE_ACCOUNTS` already permits; the real gap is a person's flattened form, not refused in CI. It is a comment-only fix, taken in correction round 1. Profile paths redacted at filing: none.*

---

VERDICT: PASS (cut/exposure-scan-ci-backstop @ 5d3951fbe337e78dfc6076e307763497b41362ff)

There are no S1 findings. There is one S2, a comment-only fix: if only that comment hunk changes, my verdict holds after a re-read of that hunk. Every cite below is at 5d3951f, read in the worktree (HEAD resolves to this commit both locally and on origin). All file paths are relative to the repository root. I had no Bash, so I computed no hash and ran no git command.

**Findings**

- **S2: the workflow header misstates the CI gap. `.github/workflows/exposure-scan.yml:22-23`.**
  - The header ends the list of what is not claimed with "the machine-local profile form of the runner itself" (a byte copy of the header's own words).
  - Every form of `runner` is already permitted, on every machine, by `MACHINE_ACCOUNTS` (`scripts/hooks/profile-path-scan.mjs:27`). So that item says nothing.
  - The real gap is in the drafting consult's open point 1 (`state/consults/2026-10-02-exposure-scan-ci-backstop-architect-draft.md`). Paraphrase: a person's flattened profile form is not refused in CI, because rule (iii) keys on `os.homedir()` (`profile-path-scan.mjs:629`), and on the runner that is `runner`.
  - §2 item 7 of the form requires the header to say what a green run does not mean, and this file is published. Reword the item so it states that gap. The form's own may-not-claim sentence (§1) is ambiguous in the same way. It is append-only, so leave it as it is.
- **N1: Amendment 1 does not change what T3 proves (asked).**
  - The range mode reads committed objects only (`profile-path-scan.mjs:525-530`). An index-built rename and a `git mv` rename give the same commit.
  - T3 asserts `R100` before it scans (`scripts/hooks/profile-path-scan.test.mjs:1202`). Under M3, a filter of `AC` drops the R entry.
  - §2 item 9's R4 already says renames are built through plumbing. That contradicts S3's `git mv`, and the amendment resolves the contradiction on R4's side.
  - The label "class 2, a post-result amendment" borrows class 1's name. The template's class 2 (`docs/PREREGISTRATION-TEMPLATE.md:106-109`) defines a deviation as an outcome that differs from a prediction, whereas here the fixture's construction differs. It is the closest fit, and no new class is owed.
  - The reviewer should confirm that the assertion at test line 1202 is present at 02bde66, the commit the amendment names.
- **N2: T7 shows that the commit was refused, not that a finding refused it.**
  - `profile-path-scan.test.mjs:1296` matches `commit refused`. The hook also prints that text when the scan aborts (`.githooks/pre-commit:36`).
  - M7 does tell the token apart (with `ACMR` the commit is accepted), and T6 proves that the parser reads the type change. May-claim 5 therefore stands.
  - Optionally, also assert `link:1 unlisted-segment`.
- **N3: `-M` never yields status C.** It does not detect copies; that needs `-C`. So copies arrive as status A and are read whole (`profile-path-scan.mjs:526`, `:529`). §1 may-claim 2 says only a copy's changed lines count. That is wrong for copies, but in the safe direction.
- **N4: conflicting PRs go unscanned until the conflict is resolved.** GitHub documents that `pull_request` workflows do not run while a PR has a merge conflict (I did not verify this here). Scanning resumes at the next `synchronize` and at the push to `main`. §1 may-claim 1's "every pull_request event" does not list this case. Route it to `exposure-scan-followups`; do not make it a clause.
- **N5: trailing newlines.** `$(...)` strips trailing newlines (`exposure-scan.yml:80`), so stdout that is the clean line plus blank lines would be accepted. This copies the hook (`.githooks/pre-commit:19-25`), so it is not new risk.
- **N6: T8 uses `git mv`** (`profile-path-scan.test.mjs:1313`), while R4 says renames are built through plumbing. The name is clean, so there is no platform effect.

**Asked items**

- **No pass without a computed range.**
  - The workflow exits 0 only on status 0 and the exact clean line (`exposure-scan.yml:83-85`).
  - The scanner prints the clean line only after `cmdRange` returns (`profile-path-scan.mjs:658-666`).
  - `cmdRange` returns only after rev-parse, merge-base, the diff, the name list and the log all succeed. Every failure goes to `abortRange` → exit 2 (`:518-531`, `:506-510`). That includes an empty argument (`:518`), and so an empty env value.
  - An unknown event exits 2 (`exposure-scan.yml:74-77`). E2 and E4 were red with exit 2 on real pushes (CUT-STATE entry 2026-10-02T07:05Z; worker report, E2–E4).
- **No segment or message text printed.**
  - The count line holds numbers only (`:553-555`).
  - A finding prints a path through `safePrintablePath`, `commit <sha>`, a line number and a class (`:539`, `:549`, `:607-613`). Nothing else.
  - git's stderr is piped and never forwarded (`:491-502`). Because `stdio` is given explicitly, `execFileSync` does not copy stderr to the parent.
  - T11 and T12 assert this (`test.mjs:1394-1444`).
- **Event values through `env` only.** They are set at `exposure-scan.yml:58-62`. There is no `${{` inside `run:` (`:63-91`).
- **Seam and caller (§1).**
  - No new export: the test file imports the same four names (`test.mjs:19`), and `runGitCaptured`, `cmdRange`, `abortRange` and `resolveCommit` are module-private.
  - The only product caller is `exposure-scan.yml:80`, in the same PR. It uses the CLI shape the scanner actually has: two arguments, exit codes 0, 1, 2 and 3, and the clean line.
  - The real-shape end-to-end runs: E1 (run 36975569067, `pull_request`, with counts recomputed) and E2–E4 (runs 36975271367, 36975323133 and 36975368380, real push payloads). E5 is owed after the merge, as a class 1 row.
- **R1–R6.**
  - R1: `localName` (`:629`) is the only input taken from the OS.
  - R2: no OS-conditional code is added. `computeIsMain` is unchanged.
  - R3: governance-ci runs the hooks suite on ubuntu-latest (`.github/workflows/governance-ci.yml:109`, `:126-127`), and the worker ran it on Windows.
  - R4: the new tests use `update-index --cacheinfo` with no filesystem symlink, spawn only `git` and `process.execPath`, and take temp directories from `os.tmpdir()`.
  - R5: holds.
  - R6: no skip or platform branch appears in the new tests.
- **Intake table.** Each disposition matches the code:
  - `T` is in the range content filter (`:526`) and the staged content filter (`:442`). The staged name filter keeps `ACMR` (`:473`).
  - The matcher is unchanged: lines 22–335 on main are identical to lines 26–339 here.
  - The diff touches only the three files plus the form (the custodian's recount is 91/0, 85/1 and 368/0).
  - There is no whole-tree read, and the hooks are untouched.
- **Rulings.**
  - Round 27, item 2: (i) a tool error exits 2, red; (ii) the canary runs first (`:631-634`).
  - Round 28, item 2: there is no whole-tree scan.
  - Round 29, item 1: the matcher is unchanged.
  - Round 29, item 4 and round 30, item 1: T13 (`test.mjs:1446-1462`) holds under a runner home.
  - Round 29, item 5 and round 33, item 1: §2 matches the adopted proposal. The staged token is preregistered in the intake table, not added after the fact.
  - ADR-009: nothing refused reaches the public log.
  - The round 7 ruling: the scanner's fact line states a fact (`:504`), and the workflow states its own consequence (`exposure-scan.yml:87`).
- **The Round 25, item 2 rules.**
  - No §7 overrun: 545 of 800, over 3 files.
  - No scope addition.
  - `verify-mutation` is never called an observation (`test.mjs:1101-1103`; worker report, M1–M13).
  - Amendment 1 names the test text with commit 02bde66 and pins no hash.
  - No five-line form is used.

**§8 item by item**

1. Pass: as above, `:491-502`, `:539`, `:549`, `:553-555`.
2. Pass: the matcher, lists, roots, canary, `parseAddedLines` and the redact modes are byte-identical to main, and neither hook is in the diff.
3. Pass: the only staged-mode change is the token at `:442`.
4. Pass on every sub-item: the triggers (`yml:31-35`), no `paths`, no `pull_request_target`, no `concurrency`, permissions `contents: read` (`:37-38`), no `secrets.`, only the two actions (`:48`, `:53`), no install step, no `continue-on-error` and no `|| true`, no `${{` in `run:`. The head is `PR_HEAD` (head sha), not the merge ref, and acceptance needs status and line together (`:83`).
5. Pass: the trigger is `branches: [main]` (`yml:35`).
6. Pass: there are no quotations in `yml:3-29`, `profile-path-scan.mjs:12-14` or `test.mjs:1096-1462`.
7. Pass: strings are built from `mk(...)` parts or listed names (`runner`); there is no symlink, no `sh` spawn and no drive letter in a temp path; every test cleans up in `finally`; nothing is ignored.
8. Pass: only the three §7 files and the form.
9. Pass as far as I could read: none of the three files contains a profile path, and E1 scanned the range green. Rule (iii) in CI keys on `runner`, so that range's flattened-form check rests on the worker's armed hooks.
10. Pass for now. The closing record owes 7680dc9 (the commit the mutations were applied at) for M1–M13.
11. Pass: 545 of 800, and §7 is unedited.
12. Pass: Amendment 1 has no ledger line cite, no hash, no bare self-line and no reproduced text, and its first line says it was written after the results. It also names its test text by commit (02bde66).
13. Not yet applicable. The 07:05Z CUT-STATE entry records that the repository still allows squash and rebase merges, so the merge must be made as a merge commit.

No ADR skeleton is needed: no decision is missing.
