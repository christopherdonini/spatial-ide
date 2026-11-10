*Custodian's filing note (2026-10-30): the worker's report on PR #270's commit 4d28aac3 (the README words the human approved, R1 to R3 and the human's repair; the form's Amendment 6, class 1: forms-layout allows docs/experiments/, T12c). The custodian's check: origin's branch is at 4d28aac3ecba72fe49457cad16029adfccbc982b, its parent f6168c99; the worktree's porcelain is empty; the numstat matches the report (4 files, 36 added, 13 removed). By its transcript: one commit, one push to the branch, no merge, reset, rebase, amend, PR action, cargo or claude call; Bash 31, Edit 7, Read 3, Write 2; run 2026-10-30T06:28:30Z to 06:39:21Z. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 90b5d7c6abb6e70755676a00a435cf73f626fc8d712ee07ee08a5256c0216a86.*

---

Done: governance-f-tidy-repository-in-place at 4d28aac3ecba72fe49457cad16029adfccbc982b (one commit, `-s`, on f6168c99, pushed, rc=0, porcelain empty).

README changes (in README.md):
- Every new span was taken by script from its source, not retyped. The script is `pf-a6-readme.mjs` and its equality check is `pf-a6-eq.mjs`, both in the scratchpad.
- R1 is in lines 33-34, from the report's line 52. Only "nothing" became "no behaviour".
- R2 is the `scripts/` bullet, from the report's line 54.
- R3 is the parenthesis inserted after "holds the preregistration forms", from the report's line 56.
- The repair is the parenthesis from `(EPSG:4326, WGS 84` to `not by accident)`, byte-copied from line 9 of the ruling. I read it with `git show c69ae7a7:<path>` because the directive file is not in the worktree.
- Equality check, after collapsing whitespace runs to one space: each span occurs exactly once in the new README (true for all four). The old README with the four replacements applied also equals the new README as a whole (true).
- `git diff` shows only the touched lines moved. Touched lines are at most 100 columns, and bullet continuations are indented two spaces. The longer lines still in the file were already there.
- Two touched paragraphs wrap oddly: the R3 bullet leaves a short line, "for each top-level folder they came from and `root/` for those", and the repair leaves "only." on its own line. I reflowed only the touched lines, as told.

Class 1 change:
- `scripts/plan/forms-layout.mjs` also passes a tracked `*PREREGISTRATION*.md` whose path starts with `docs/experiments/` (new `EXPERIMENTS_DIR`).
- `ALLOWED_DOCS_FORMS` is unchanged and still exported, and `moved-map.mjs` is not edited.
- Other forms under `docs/` still fail by name, and the problem text still opens `a preregistration outside governance/forms/ and state/`.
- The header comment, the `ALLOWED_DOCS_FORMS` comment, the rest of the problem text and the PASS line say what the check now allows.
- `.github/workflows/governance-ci.yml:182` has only the step's name changed.
- In `forms-layout.test.mjs`, T12 and T12b are untouched and the header comment names T12c and Amendment 6.
- T12c is named `forms-layout: any preregistration under docs/experiments/ is allowed, and nothing else under docs/`. Run one (`ALLOWED` plus `docs/experiments/NEW-EXPERIMENT-PREREGISTRATION.md`) exits 0. Run two (`docs/OTHER-PREREGISTRATION.md` and `docs/experiments-old/X-PREREGISTRATION.md`) exits 1, names both and nothing else.

Mutation:
- With `&& !f.startsWith(EXPERIMENTS_DIR)` removed and nothing else changed, the file gave rc=1, pass 2 and fail 1. The only failure was T12c, by that name.
- I reverted it. The diff of `forms-layout.mjs` was identical to the pre-mutation diff, and the file then ran pass 3, fail 0.
- The `// RECORDED MUTATION on f6168c99 with this commit's change applied, applied alone and reverted: ...` line sits above T12c in the file.

Numstat `f6168c99..HEAD`:
- `.github/workflows/governance-ci.yml`: 1 added, 1 removed.
- `README.md`: 7 added, 5 removed.
- `scripts/plan/forms-layout.mjs`: 12 added, 6 removed.
- `scripts/plan/forms-layout.test.mjs`: 16 added, 1 removed.

Checks at my head (the commit was made after the checks, from the same staged tree):
- `node --test` on `forms-layout.test.mjs` and `moved-map.test.mjs`: rc=0.
- `node --test` over `scripts/plan`, `scripts/hooks` and `scripts/evidence`: rc=0, last tally line `ℹ duration_ms 74911`, tests 590, pass 590, fail 0. My first try passed directories and failed with rc=1, so I re-ran with the globs governance-ci.yml:150 uses.
- `forms-layout.mjs`: rc=0, `forms-layout PASS -- 178 preregistration file(s), all under governance/forms/ or state/, or docs/PREREGISTRATION-TEMPLATE.md, or under docs/experiments/.`
- `moved-map.mjs --check`: rc=0, `moved-map --check PASS -- governance/MOVED.tsv equals its regeneration.` Its result is unchanged.
- `verify.mjs --offline`: rc=0, `verify:plan PASS`.
- `verify-cites.mjs`: rc=0, `verify:cites PASS`, 2523 files.
- `verify-quotes.mjs`: rc=0, `verify:quotes PASS`, 132 checked, 0 hash-reference errors. It took about 6 minutes in the background.
- `verify-test-claims.mjs`: rc=0, `verify:test-claims PASS`, 695 claimed tests.
- `queue.mjs --check`: rc=0, `CUSTODIAN-QUEUE.md/.json are current`.
- `site.mjs --check`: rc=0, `site/ is current`.

Commit message: `@` appears only on the `Co-Authored-By` line. `git commit -s` appended its own Signed-off-by trailer, which I did not type. I took no shared hold, because no command was heavy.

Background shells: the tool moved three of my calls to the background. They were the checks run and two wait loops, and all three exited (notifications received). Nothing I started is still running.

Model as the harness reports it: Sonnet 5.5, `claude-sonnet-5-5`.
