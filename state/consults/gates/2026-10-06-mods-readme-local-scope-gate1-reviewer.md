# PR #184 gate 1 — reviewer (single gate)
Reviewed: cut/mods-readme-local-scope @ 1eb82dbae30354674ce51376e1a7812530be7560

Node `mods-readme-local-scope`, tag `node:mods-readme-local-scope@g1`. Single combined gate (`AUTONOMY.md` §21b): code review plus the light constitution check (cites, red-line scan). Base 74abee6c9ae48b02be734cd92384ec20d09c323e (the merge base with origin/main, which was a69327468204e1f96d4846e5fb1b5aee3e400f1a at review).

## Verdict

**PASS.** No Correctness finding, no Evidence finding. One Documentation and record finding (D1), must-fix in this pull request before the merge; it causes no correction round and no re-gate.

## Out-of-scope check (read first)

The form is `tools/mods/MODS-README-LOCAL-SCOPE-PREREGISTRATION.md`, added on main by 74abee6c, before the one branch commit 1eb82dba. Its Out-of-scope line is `tools/mods/MODS-README-LOCAL-SCOPE-PREREGISTRATION.md:10 @ 74abee6c sha256:05498f3f5c6434e73d9340e3f4ee8455c22992ab9fd7eb7ba1bbc61b591538dd`. It names no §21a category as touched (ADR none, security none, wire none, guarantee none). Checked against §21a:
- ADR: no ADR file or status line in the diff.
- Security posture (ADR-020, ADR-009, ADR-021 per §21a): the diff changes README instruction text only; no manifest, hook, rule, settings or code file. The security-posture sentence in each README is unchanged (context lines in the diff).
- Wire: no `protocol/` file.
- Guarantee: the changed Guardian scope sentence states a fact the record already holds (the enable record lives in an ignored file); no test or script in the tree asserts a plugin-scope property (`git grep` for `enabledPlugins` and `settings.local` over `scripts` and `tools/mods`, non-markdown: no hit).

The line holds. The single-gate route stands.

## Scope and budget

- Files: `git diff --name-only 74abee6c origin/cut/mods-readme-local-scope` gives exactly the two READMEs.
- Budget: `git diff --numstat 74abee6c 1eb82dba` over the two READMEs gives 3/3 (Recorder) and 4/4 (Guardian): 14 changed lines against the declared 24.
- Every changed line is an install, disable or uninstall line, or the Guardian scope sentence. Unchanged, as the form keeps: the Guardian marketplace step (`tools/mods/spatial-guardian/README.md:50 @ a6932746 sha256:4a578627c8870a609f7e6eba612f0a242fe9315e502c6f38cadabbc779c99dea`, byte-identical at the head), the reload and confirm steps in both READMEs, the Recorder marketplace sentence inside its step 1 (the text after the command is unchanged), and both security-posture sentences.
- Line endings at the head: both READMEs LF (`file` reports no CRLF).

## Each changed line against the record and the build

Record: `tools/mods/GUARDIAN-V0-PREREGISTRATION.md:884 @ a6932746 sha256:f59739afbdd1a6e5d774e197edfe9569dea3852b84883b12b733eddd144a0b8a` and `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:637 @ a6932746 sha256:f59739afbdd1a6e5d774e197edfe9569dea3852b84883b12b733eddd144a0b8a` (item 1 of each amendment: the install at local scope from the main checkout); `tools/mods/GUARDIAN-V0-PREREGISTRATION.md:890 @ a6932746 sha256:a981c09c97e21f638d77f4b94483072e54b06739a9de31e663bbbc9a142da091` and `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:643 @ a6932746 sha256:a981c09c97e21f638d77f4b94483072e54b06739a9de31e663bbbc9a142da091` (item 3: the enable record and the ignore line); `.gitignore:32 @ a6932746 sha256:f2ecf84a3eba443ae877883f951b25a53005a71ab5a14f15a4027b88b41c77b3` (confirmed by `git check-ignore -v .claude/settings.local.json`, which reports that line). `.claude/settings.json` is tracked (`git ls-files`), so the reason given for refusing project scope holds.

Build: `claude --version` reports 2.1.291, the build the form names. Help text, paraphrased (command output, no path): install takes `-s, --scope` user, project or local, default user; disable takes `-s, --scope` user, project or local, default auto-detect; uninstall takes `-s, --scope` user, project or local, default user.

- Guardian step 2 and Recorder step 1, install with `--scope local`: a valid option value; matches item 1 of both amendments.
- Guardian and Recorder disable with `--scope local`: valid; matches the install.
- Guardian and Recorder uninstall with `--scope local`: valid. Before this change the uninstall lines carried no scope, and the build defaults uninstall to user scope, so the old lines no longer addressed the live install; the change corrects that.
- Guardian scope sentence (line 55 of `tools/mods/spatial-guardian/README.md` at 1eb82dba): forbids project scope only; names `.claude/settings.local.json` as the local enable record and says git ignores it. Supported by item 3 of Amendment 11 and the ignore line above. It names the main checkout, matching item 1.

## Findings

### Correctness

None.

### Evidence

None. No guarantee, limit or measurement is claimed. No passage is marked as a quote of the human. No red-line text: the diff installs, enables and refuses nothing, and the sentence reserving installation to the human is unchanged.

### Documentation and record (must-fix before the merge)

**D1. The Recorder step 1 says a checkout on main, not the main checkout.** Line 73 of `tools/mods/spatial-evidence-recorder/README.md` at 1eb82dba opens its step with the words a checkout on main, at local scope. The form Change line (`tools/mods/MODS-README-LOCAL-SCOPE-PREREGISTRATION.md:8 @ 74abee6c sha256:5fa939ce42a3164d73a1a891de3ff99a2f68de6957c2983e31c814a181e12e0c`) requires each README to say the commands run from the main checkout, and Amendment 8 item 1 records the install from the main checkout. At local scope the enable record is the checkout settings file that git ignores, and the registry keys the install to that checkout path (Amendment 8 items 2 and 3), so an install from another checkout on main (a worktree) would enable the mod there and not in the main checkout. The Guardian README now says the main checkout; the two disagree. Fix: on that same line, read "From the main checkout, at local scope". The line is already counted, so the budget stays at 14.

## The worker report: its two noticed items

1. **Guardian marketplace step at `--scope user`.** Not a finding. The form keeps the marketplace step unchanged (its Change line, above); neither install-row amendment records a marketplace scope, so no record contradicts the line; marketplace registration and plugin install take their scopes separately. Not verified at the build: `claude plugin marketplace add --help` was outside the commands this gate may run.
2. **Recorder step 1 wording.** A finding: D1 above.

## Constitution check

- Cites in the changed lines: none added. The unchanged Guardian pin at line 54 (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` at 1bb94e19) recomputes to its stated hash, b446fb1dad9f228df029d8ffea2628f3a99f15239b9b44ce3e76aac99fdd7013.
- Placement: `state/directives/2026-10-06-probes-readme-node-and-script-adoption.md`, item 3, with its RULED block in `DECISIONS-PENDING.md` (the third direction of 2026-10-06, item 3). PLAN node `mods-readme-local-scope` names the form as its gate and a merge commit as its merge.
- The forms are not edited by this piece (Amendment 11 item 6 and Amendment 8 item 7 leave their install lines as history); the diff touches neither form.

## Commands and exit codes

- `git fetch origin`: completed (rc not captured separately).
- `git rev-parse origin/cut/mods-readme-local-scope origin/main`: 1eb82dba and a6932746 (rc not captured separately; output complete).
- `git merge-base origin/main origin/cut/mods-readme-local-scope`: 74abee6c.
- `git diff --stat origin/main...origin/cut/mods-readme-local-scope`, and the full three-dot diff: two files, 7 insertions, 7 deletions.
- `git diff --numstat 74abee6c 1eb82dba` over the two READMEs: 3/3 and 4/4.
- `git log --diff-filter=A` on the form: 74abee6c.
- `git check-ignore -v .claude/settings.local.json`: matched `.gitignore` line 32 (rc 0).
- `claude --version`: rc 0 (2.1.291).
- `claude plugin install --help`: rc 0.
- `claude plugin disable --help`: rc 0.
- `claude plugin uninstall --help`: rc 0.
- `git worktree add --detach C:/dev/wt/gate184-rev 1eb82dba`: HEAD 1eb82dba, porcelain clean.
- In that worktree, each with a 300 s timeout:
  - `node scripts/plan/verify-cites.mjs`: rc 0 (PASS, 1431 files; 34 loose references advised, none in the two READMEs or the form).
  - `node scripts/plan/verify-quotes.mjs`: rc 0 (PASS, 121 checked, 90 verified, 30 baselined, 1 advisory).
  - `node scripts/plan/verify-test-claims.mjs`: rc 0 (PASS, 502 claimed tests across 131 files).
  - `node scripts/plan/verify.mjs`: rc 0 (verify:plan PASS).
  - Worktree porcelain after the checks: clean.
- `gh pr checks 184`: rc 0. Every line:
  - cfg boundary (PORTABILITY R2): pass, 7s (run 37501750801)
  - cfg boundary (PORTABILITY R2): pass, 10s (run 37502140750)
  - every commit is signed off: pass, 5s (run 37502140760)
  - no profile path in the range: pass, 13s (run 37502140767)
  - test · verify:plan · queue/site drift: pass, 1m25s (run 37501750801)
  - test · verify:plan · queue/site drift: pass, 1m21s (run 37502140750)
- `gh pr view 184`: head 1eb82dbae30354674ce51376e1a7812530be7560, branch cut/mods-readme-local-scope, base main, OPEN (rc 0).
- `git worktree remove C:/dev/wt/gate184-rev`: rc 0; no entry remains.

No heavy command ran; no machine hold was taken.
