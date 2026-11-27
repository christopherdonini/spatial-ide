# The architect's read of what assumes main, for release/v0.2: the scripts, the hooks, the workflows, Pages, the exposure scan, the licence audit and the queue and site regeneration, for a push to the branch and for a pull request against it

*Filed by the custodian: node:release-v0-2@what-assumes-main-architect-read, under the human's addition 2 to ADV-2026-11-26-01 and ADV-2026-11-26-15 items 2 and 3.*

- **What it is.** A read, not a gate, with no gate-log row. Its drafts A to F are for the human: by the human's addition 2, a change to a hook, a workflow or a mod comes to the human as a draft, and by ADV-2026-11-26-15 item 3 the advisor drafts the change to its own merge check after this filing. Nothing in it is acted on.
- **Where it read.** Read only, in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08. By the custodian's git check before dispatch, scripts/, .github/, .claude/ and tools/ are identical there, at release/v0.2's tip 7402b64564ca9476664f7871716588335261aaa5 and at main's tip.
- **Dispatch and run.** Dispatched before 2026-11-26T19:39:32Z (date -u), with the brief brief-release-branch-read-architect.md from the scratch folder (4980 bytes, sha256 cf02ebe8f64f69298fe5c3f59edf5ca673af25edf9fe73d869780bea32f90b54). Its run comes from its completion notice only (ADV-2026-11-26-02: no transcript opened): 61 tool uses, 442207 ms, 166265 tokens. The model is opus, by its definition's model line. It handed back once, before 2026-11-26T19:47:59Z (date -u after saving).
- **How it was written here.** The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent and its note line above the report removed, byte for byte and nothing masked: 15187 bytes, sha256 d18eea897d809c10152a749cea83eccca3d15fdf11230ec63adfa08bdd29a004.

---

**Verdict: pass with notes.** Reviewed main @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08, read in D:/wt/read-1124f. By the custodian's git check this is identical to release/v0.2 @ 7402b64564ca9476664f7871716588335261aaa5 under scripts/, .github/, .claude/ and tools/. There is no root package.json (a Glob of the checkout found none).

This was a read, not a gate. Nothing blocks on Correctness or Evidence, and there is no Documentation finding. The changes and decisions below go to the human as drafts. Every path:line below is in the checkout. Text in backticks marked "verbatim" is copied from the Read output. Everything else is paraphrase. I cite ADV-2026-11-26-15 by id and item and do not quote it.

One fact governs every workflow row. A push runs the workflow files of the pushed commit, and a pull request runs those of its merge ref. The pull-request case is stated at exposure-scan.yml:22-23. So a workflow change made on main does nothing for release/v0.2 until it is also in release/v0.2's tree. By the branch rule, only the human can name it in.

## Table

| # | Item | Push to release/v0.2 | Pull request against release/v0.2 | Change needed |
|---|---|---|---|---|
| 1 | governance-ci.yml `plan` job: node --test, verify:cites, verify:quotes, verify:test-claims, verify:plan, buildHealth smoke, queue/site/moved-map checks, forms-layout | Has no branch filter. Runs only when a path in :83-100 changes. Reads the pushed tree. For verify:plan and verify:test-claims it also reads origin/main and live PR states from `gh api`. The result is true for the release tree, whose plan and ruling set are frozen at the fork. | Same, with the paths at :101-118, checked out at the PR merge ref. A docs-only PR or a result-log PR that touches none of those paths runs nothing, so the result is vacuous. The gap is already disclosed at :73-81. | No file change. Procedure: before the merge check, dispatch it on the PR's head branch (workflow_dispatch, :119). |
| 2 | governance-ci.yml `cfg-boundary` job | Same trigger as row 1. Reads the tree. True. | Same. | No. |
| 3 | pages.yml | Does not run. Its push trigger is main only (:28-32). | No pull_request trigger. | Optional guard (draft B). A dispatch on release/v0.2 would run release's own pages.yml and deploy (:68-81). Whether the github-pages environment allows that was not read. |
| 4 | exposure-scan.yml | Does not run (:37-38, verbatim: `branches: [main]`). Every merge into release/v0.2, and the merge or squash message GitHub writes for it, goes unscanned. The first scan is the final merge's push to main, after the tag. | Runs: no branch filter (:35-36). The base is the PR's base sha (:62, :69-71), which is release's tip. Diff three-dot, log two-dot (profile-path-scan.mjs:525-530). True. | Yes, draft A. |
| 5 | ported-notices.yml + scripts/check-ported-notices.mjs | Runs on every push (:11-13). Reads the tracked tree (check-ported-notices.mjs:27-36). True. It ran green on the push that created the branch (as read). | Runs. True. | No. |
| 6 | dco.yml | Does not run. Pushes are not checked by design (:28-30). | Runs (:86-90). Range is the event's base..head (:119-120, :138). True. | No. |
| 7 | product-ci-rust, product-ci-shell, product-ci-viewer, rust-fmt, both adr-003 spike workflows | Path-filtered, no branch filter (rust :129-157; shell :114-137; viewer :56-65; fmt :29-38; spikes :33-37). A docs-only push or a result-log push matches none, so the result is vacuous; there is no code to test. A newer release run cancels an older one (e.g. product-ci-rust.yml:190-192). That is harmless here. | Same with their pull_request lists. Vacuous. | No. |
| 8 | release-artifacts.yml + tauri-build.yml | A branch push does not run them. A `v*` tag push runs them on the tagged tree, whatever its branch (release-artifacts.yml:37-40; tauri-build.yml:37-39). True. | Not triggered. | No. |
| 9 | Licence audit, scripts/audit-dependency-licenses.mjs | No workflow runs it (a grep of .github finds no reference). It is run by hand and reads metadata on disk (:9, :13-17). It names no git ref. On the release tree it audits the dependency set as of the fork. | Same. | No. |
| 10 | verify-cites.mjs | Reads the tree at HEAD. The legacy list is read along HEAD's first-parent history (:27-29, :411-419), and pins must be ancestors of HEAD (:32, :490-491). It never reads main. True for the release tree. A cite into a file filed on main after the fork fails there, and that failure is true. | Same, at the merge ref. | No. Rule: release text cites only what its own tree holds. |
| 11 | verify-quotes.mjs | Reads the tree. A hash ref's rev defaults to HEAD (:74-75, :611). A round/item cite resolves against the ruling set in the tree. That set is frozen at the fork, so a cite of a later round fails there. It never reads main. It does not enforce round 15(e). | Same. | No. Same rule as row 10. |
| 12 | verify-test-claims.mjs | Its base ref is origin/main (:346-356). Condition (e) refuses a pin that is not an ancestor of main (:67-72, :369-383). The same-PR exception reads `origin/main..HEAD` (:82-90, :448-474), which on release spans every release commit since the fork. True to its rule. | Same. | No, if records follow draft D. |
| 13 | verify.mjs (verify:plan) | Reads origin/main, else local main, for {commit} evidence (:78-91). For {pr} evidence it reads only `merged` and never the base (:47-55, verbatim: `return { ok: data.merged === true,`). A gate file must be tracked in the tree (:256-260). On release the plan is frozen and PR states are live, so the reverse check (:230-237, :310-317) may fail there. Not established. | Same. | Optional, draft E. The seam on main is in the records section. |
| 14 | queue.mjs --check, site.mjs --check | Regenerate from the tree's own PLAN.yaml. No git ref. Release's plan never changes, so the result is true and static. | Same. | No. |
| 15 | moved-map.mjs --check | Regenerates rows from the commits MOVED.tsv names (:117-144). No main. True. | Same. | No. |
| 16 | docsOnly.mjs (the §9 docs-only verdict; not in CI) | Its base is an argument (:2, :57-60). PLAN.yaml is a named exception (:48), so it does not stop a release PR from touching records. | Must be run with base origin/release/v0.2. | No file change. Procedure. |
| 17 | verify-mutation.mjs (run by hand) | Default base is origin/main (:253). Against a release head, three-dot reaches back to the fork and takes in every release commit. | Pass the release base. | No file change. Procedure. The same goes for every brief's `origin/main...HEAD` gate range. |
| 18 | Stop hook (settings.json:3-13 → stop-queue.mjs) | Not a branch event. It runs in the session's project directory (:68-70), which is the main checkout. HALT is read locally and on origin/main only (:13-16, :115-146). Continuity and the ready set come from that checkout's HEAD (:208-224, :323-333). In a checkout of release/v0.2 with no lease line, it allows (:296-299). | Not affected. | No. Rule: the main checkout never checks out release/v0.2. If it did, the hook would read the frozen plan's "next" node. |
| 19 | PreCompact (settings.json:14-35 → precompact-flush.mjs) | Reads the block's tip against HEAD and @{u} of the project directory (:115-165). No main. Not affected. | Not affected. | No. |
| 20 | SessionStart (settings.json:36-77 → session-resume.mjs) | Counts tip..HEAD (:86). No main. Not affected. | Not affected. | No. |
| 21 | profile-path-scan in the local hooks (.githooks/pre-commit, .githooks/commit-msg) | Runs on every commit in an armed clone, on any branch. True. | Range mode is row 4. | No. |
| 22 | Guardian (tools/mods/spatial-guardian, read only) | No rule names the main branch or the default branch. "main" there means the main working tree (register.js:613-626). G1 refuses a force-push or a remote-ref delete on any branch (:12, :325-373). G7 refuses an agent's PR merge on any base (:18). | Same. | No. |
| 23 | The advisor's merge check (the human's file; unread) | Not applicable. | As the advisor reports it under ADV-2026-11-26-15 item 3, it covers only PRs based on main. I did not read it. | Yes, the human's. Draft F lists what a change must settle. |
| 24 | Records on main for a release piece | See the records section. | See the records section. | Decision, draft D. |

Notification and StopFailure hooks: no git ref; not affected.

## Records (item 6)

- Records commit to main only, so the docs-only piece and the result log get their PLAN node, gate rows and form there.
- A gate file that exists only on release fails verify:plan on main by name (verify.mjs:256-260).
- {commit: X} evidence, where X is a release-only commit, fails on main until the final merge (verify.mjs:197-200, :78-91).
- {path: X}, where X exists only on release, fails on main (verify.mjs:201-203).
- A non-done node with {pr: N} fails on main as soon as N merges into release (verify.mjs:230-237).
- A done node with {pr: N}, where N merged into release/v0.2, **passes on main** although main does not hold the change (verify.mjs:178-183, :47-55). This is a false PASS, and the brief's example is exactly this case.
- A superseded pin at a release-only commit is refused on main until the final merge (verify-test-claims.mjs:369-383).
- A hash pin at a release-only commit recomputes in CI, because the full fetch sees every branch. It still breaks round 15(e) in an append-only record, and Round 25 item 2 for a test-text span. No check catches this.
- No script checks gate-log.json, CUT-STATE.md or the directives against a PR's base. They are read only by site, health and the quote baselines.
- All of this clears at the final merge **only if** that merge is a true merge commit and release/v0.2 stays on origin. A squash or a rebase leaves release commit ids off main for good.

## Drafts for the human

**A. Exposure scan on pushes to release/v0.2 (workflow).**
- File: .github/workflows/exposure-scan.yml.
- At :38, `branches: [main]` becomes `branches: [main, release/v0.2]`.
- The header at :10 reads "or a push to main". It becomes "or a push to main or to release/v0.2". This is a worker's comment, not the human's wording.
- Why: each merge into release/v0.2 is a push, and GitHub writes its message at the click. No PR run reads that message.
- Why not `release/**`: a new branch's first push carries an all-zero `before`. The scanner cannot resolve it and exits 2 (profile-path-scan.mjs:512-522). release/v0.2 already exists, so its pushes carry a real `before`.
- To take effect it must be in release/v0.2's tree, so the human names it in. It should also land on main with the same bytes, so the final merge does not conflict.
- The alternative is to accept the gap: the final merge's push to main scans the whole range, after the tag.

**B. Pages deploy guard (workflow, optional).**
- File: .github/workflows/pages.yml.
- Add `if: github.ref == 'refs/heads/main'` to the `deploy` job (:68-70).
- An alternative needs no file: the github-pages environment allows main only. That is a setting.
- Like A, the guard works for a dispatch on release only if it is in release's tree.

**C. The final merge (decision).**
- release/v0.2 is merged into main by a merge commit, never a squash or a rebase.
- release/v0.2 is kept on origin. G1 already refuses an agent's delete of it.
- Merges into release/v0.2 follow the same method rule as merges into main.
- Repository settings must allow merge commits. That was not read.

**D. Records on main for a piece on release/v0.2 (decision; custodian rules, no file).**
1. The form stays on main only. The release PR never carries it.
2. The PLAN node stays in-progress with {branch: <head>} and no {pr} until the final merge. It is set done in the first records commit after that merge, with {pr: N}.
3. Gate rows and the closing amendment name release commits by id. They carry no hash pin at a release-only commit until the final merge. The other route is the human ruling that release/v0.2 commits count as "on main" for round 15(e), conditional on C.
4. A release PR touches no record path: governance/PLAN.yaml, CUSTODIAN-QUEUE.*, site/, state/CUT-STATE.md, state/gate-log.json, state/directives/, DECISIONS-PENDING.md.
5. Text on release/v0.2 cites only files and rulings in its own tree.

**E. verify.mjs makes D.2 mechanical (script, optional).**
- File: scripts/plan/verify.mjs.
- For done {pr} evidence, require `merged` plus either base.ref main or merge_commit_sha an ancestor of origin/main (:47-55, :178-183).
- It lands on main only.

**F. What a change to the advisor's merge-check instruction must settle (the human's file; unread).**
- Base release/v0.2 is allowed only for what the human named: the docs-only piece and the result log.
- No step merges main into a release PR. That includes the preparation step of ADV-2026-11-26-15 item 4.
- Which CI counts as read. Governance CI may not run (row 1), so it is dispatched on the head. Ported-notices, DCO and the exposure scan do run.
- The gate diff range is origin/release/v0.2...HEAD.
- The merge method into release/v0.2, and C for the final merge.
- Who clicks the final merge. Its PR has base main and so fits the current instruction, but its diff carries every release commit.
- The records commit on main after each release merge, as in D.
- There is no branch protection on release/v0.2 (as read). A ruleset against direct push, force-push and deletion is the human's setting to choose.

**Decision skeleton (missing: how a second long-lived branch relates to main's records and checks)**
- Context: release/v0.2 is forked at 7402b645. Nothing flows from main into it, and it merges into main once. Records live on main. Main's checks resolve evidence against main and read PR states without the base.
- Decision: C, D and F above. A, and B optionally, land in both trees.
- Consequences: a release piece's node closes only after the final merge. Release text cannot cite later rulings. The tag's tree is checked by the release branch's own frozen scripts.

## Not established without a run

- Whether verify:plan passes on release/v0.2 today, with its frozen plan against live PR states.
- Whether the github-pages environment restricts deployment branches.
- Whether repository settings allow merge commits.
- The read says no check is required on either branch. ported-notices.yml:8-9 planned a required check, and this read does not show one.
- Whether the sitting's checkout on D: is a worktree or a clone, and whether its core.hooksPath is armed.
- Whether a doc the docs-only piece edits is also edited on main after the fork. That would conflict at the final merge.
- Whether CI on main was green at 7402b645.
- The advisor's file, which I did not read.

Files read (all under D:/wt/read-1124f): .github/workflows/*.yml, scripts/plan/{verify,verify-cites,verify-quotes,verify-test-claims,moved-map,docsOnly,buildHealth,queue,site}.mjs, scripts/plan/verify-mutation.mjs (grep), scripts/hooks/{stop-queue,precompact-flush,session-resume,flush,profile-path-scan}.mjs, scripts/{audit-dependency-licenses,check-ported-notices}.mjs, .claude/settings.json, .githooks/{pre-commit,commit-msg}, tools/mods/spatial-guardian/hooks/register.js and its README.
