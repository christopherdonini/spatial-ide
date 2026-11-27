Reviewed: the merge commits of three held pull requests, each a merge of main 4b9fd558d0437b3249e1bba58334a6d55074c199 into its branch, by full hash in the read worktree D:/wt/read-1124f, read only: 363 bf11959dc4f4a83bd3ce10de73d8b35062ed7b16, 364 a30f5fe866ada34a5397a2f7b60a41f852067cc2, 366 79f4380badd71679a0d28318b2f8514c7ab59bae. This is the custodian's filing note, 2026-11-27: the narrow read each merge-in gets before its pull request leaves draft (ADV-2026-11-26-15 item 4; ADV-2026-11-27-02 item 3 (a)), node:held-prs@prep-mergein-read-2, the second such read after the eight of `state/consults/gates/2026-11-27-held-prs-preparation-merge-in-narrow-read-reviewer.md`. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 11 tool uses, 318420 ms, 52501 tokens; model opus. It handed back once; the custodian saved its report through the Write tool from the hand-back message, with the harness's two-space indent removed, at 2026-11-27T03:21:49Z (the saved file's modification time). Filed below the rule, 7706 bytes, sha256 5a955e9faab5207d3807c2b67b4c2dd3fe9220be87cc412a1580306cc583c71d, byte for byte, nothing masked. The reading condition on check 4 is taken as for the eight: the noreply attribution trailer is not an account address, so check 4 passes for all three. The report's advisory under PR 364's check 3, on main's cites into files that PR lengthens, is a record matter for whichever lands second; it is not a finding against the merge-in.

---

363 PASS · 364 PASS · 366 PASS. Reviewed against the read worktree D:/wt/read-1124f after `fetch -q origin` (rc=0), at main 4b9fd558d0437b3249e1bba58334a6d55074c199. Heads read: cut/relink-after-refusal @ bf11959dc4f4a83bd3ce10de73d8b35062ed7b16, cut/large-utf8-and-utf8-view-attribute-columns @ a30f5fe866ada34a5397a2f7b60a41f852067cc2, cut/partitioned-ordinal-refusal-opens-the-identity-form @ 79f4380badd71679a0d28318b2f8514c7ab59bae.

Every command was run as `git -C D:/wt/read-1124f …`, written `G` below. M is 4b9fd558d0437b3249e1bba58334a6d55074c199.

Check 3 for all three PRs: `G diff --name-status <mb> M -- . ':!state/' ':!governance/'` prints only two paths, from both merge-bases (0bcf5434 and 55969f98):
- `M site/data/plan.json`
- `M site/index.html`

Both are generated plan-site output. `G grep -l "site/index.html\|site/data/plan.json" M -- scripts .github` points to scripts/plan/site.mjs and rotate-plan-summaries.mjs. The diff of site/index.html shows a node box added and an svg height changed (506 to 552); nothing there is code or tests. No PR touches site/, governance/ or state/. In every new head, the `site`, `governance`, `state` and `.github` subtree hashes equal main's: site 52b16318, governance 0f5cf71e, state 6eda3414, .github 2cc2d953. `scripts` equals main's (cc232e12) for 363 and 366. For 364 it differs only by the PR's own file (see below). `G diff --name-only 55969f98 M -- scripts .github package.json package-lock.json | wc -l` prints 0. So the site build and drift check see main's exact inputs, and the checks themselves are unchanged.

Beyond the brief, I also scanned main's governance/ and state/ changes for `path:line` cites into each PR's own files. These would be checked by verify-cites on the merged tree. For each cite I compared the highest cited line with the file's length at the new head.

=== PR 363 (cut/relink-after-refusal)
1. `G rev-list --parents -n1 bf11959d…` printed `bf11959d… e4e6493d92ec941425dd6566c0a4ec154c7eb633 4b9fd558d0437b3249e1bba58334a6d55074c199`. `G rev-parse origin/cut/relink-after-refusal` printed `bf11959dc4f4a83bd3ce10de73d8b35062ed7b16`. OK.
2. `G diff-tree --cc bf11959d…` printed only the commit id (1 line, no hunk). The merge-base of M and the old head is 0bcf543452af79df6251cc7d86ab9f2cf644fcc2.
   - `G diff M bf11959d… | G patch-id --stable` printed c8bd55758f1b3aef4c7461f540ffb9fde0be2d4b.
   - `G diff 0bcf5434… e4e6493d… | G patch-id --stable` printed c8bd55758f1b3aef4c7461f540ffb9fde0be2d4b.
   - Equal. The shortstat is 31 files, +2158/−199 on both sides. OK.
3. Only the site/ pair, which cannot change the PR's code, tests or checks.
   - The cite scan found one main-added cite past the end of a file: `frontends/shell/e2e/README.md:916`, while the file has 908 lines at the PR head, at M and at the base. It sits in `state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-build-gate-reviewer.md:143`. That gate report reviews PR 366's branch, where the README has 918 lines.
   - It cannot fail CI: M:scripts/plan/verify-cites.mjs:128 reads, verbatim, `const ARCHIVED_PREFIXES = ['state/drafts/', 'state/consults/gates/'];`, and its comment at :458-459 says a broken cite there is advisory. It also fails the same way on main itself, so this merge does not introduce it. Not a finding against 363.
4. `G log -1 --format=%B bf11959d…`, line 1 verbatim: `chore: merge main into cut/relink-after-refusal (preparation, ADV-2026-11-26-15 item 4)`. There is one `Signed-off-by:` line, in git's `-s` form for the configured identity. The only other line with an address is the `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` attribution trailer (see note).

=== PR 364 (cut/large-utf8-and-utf8-view-attribute-columns)
1. `G rev-list --parents -n1 a30f5fe8…` printed `a30f5fe8… 50c7c3314fe9d9b5afe7fd78417c5afd0c7992ba 4b9fd558d0437b3249e1bba58334a6d55074c199`. `G rev-parse origin/<branch>` printed `a30f5fe866ada34a5397a2f7b60a41f852067cc2`. OK.
2. `G diff-tree --cc a30f5fe8…` printed only the commit id (no hunk). The merge-base is 55969f9849bce50230f7ae7c19c03bc73289517a.
   - The new-side patch-id is 89af586197181f4b6abcb6eba9d3ea5ffc8793d9.
   - The old-side patch-id is 89af586197181f4b6abcb6eba9d3ea5ffc8793d9.
   - Equal. The shortstat is 17 files, +769/−128 on both sides. OK.
3. Only the site/ pair; no effect.
   - This PR's own scripts/plan/verify-cites-shortened-target.json lists cites from governance/ and state/ files read at fixed commits. It is consumed by verify-cites.mjs:287. Main changed none of scripts/.
   - Main's governance/state additions cite this PR's files 28 distinct ways, e.g. engine/src/attributes.rs:253-256, predicate.rs:1132-1144, stream.rs:2655-2743, engine/README.md:533-567, kernel/README.md:357-402. Examples of citing files are governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md and governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md.
   - Every one is within bounds at the PR head. Lengths from base to head: attributes.rs 1035→1050, predicate.rs 3348→3364, stream.rs 3969→3969, engine/README.md 567→568, kernel/README.md 402→402. The two files the PR shortens (kernel/tests/skp_admission.rs 950→910 and skp_filter_cancellation.rs 282→253) get no new cites from main.
   - None of those cites carries a sha256 pin. verify-cites checks existence and bounds only (its own comment at :87), so no CI check can now fail.
   - Advisory: the PR adds lines to attributes.rs (+15), predicate.rs (+16) and engine/README.md (+1). Main's new cites into those files may point at shifted content once 364 lands. That is a record matter for whichever lands second, not something this merge-in caused.
4. Line 1 verbatim: `chore: merge main into cut/large-utf8-and-utf8-view-attribute-columns (preparation, ADV-2026-11-26-15 item 4)`. One `Signed-off-by:`; the trailers are the same as 363's.

=== PR 366 (cut/partitioned-ordinal-refusal-opens-the-identity-form)
1. `G rev-list --parents -n1 79f4380b…` printed `79f4380b… e4116cadbedcd6916dd38bab2681592909a85e4a 4b9fd558d0437b3249e1bba58334a6d55074c199`. `G rev-parse origin/<branch>` printed `79f4380badd71679a0d28318b2f8514c7ab59bae`. OK.
2. `G diff-tree --cc 79f4380b…` printed only the commit id (no hunk). The merge-base is 0bcf543452af79df6251cc7d86ab9f2cf644fcc2.
   - The new-side patch-id is c1f0801c619d407b23cb9aaa2f2c2f8eefd6254d.
   - The old-side patch-id is c1f0801c619d407b23cb9aaa2f2c2f8eefd6254d.
   - Equal. The shortstat is 43 files, +3232/−242 on both sides. OK.
3. Only the site/ pair; no effect. The cite scan over this PR's 43 files found no main-added cite past the end of a file. The README:916 cite above falls inside this branch's 918 lines.
4. Line 1 verbatim: `chore: merge main into cut/partitioned-ordinal-refusal-opens-the-identity-form (preparation, ADV-2026-11-26-15 item 4)`. One `Signed-off-by:`; the trailers are the same.

Note on check 4, all three: a per-message scan finds two lines with an address: the `Signed-off-by:` line and the `Co-Authored-By: … <noreply@anthropic.com>` attribution trailer. I judged the trailer as the standard attribution line, not a personal email, so check 4 passes. If "no other line naming an email" is meant literally, all three fail check 4 the same way. So does the already-passed cut/shell-tests-temp-folder merge-in, whose message `G log -1 --format=%B` shows with the same two lines. I also can't prove the sign-off was added by `-s` rather than typed; it only matches `-s`'s form exactly.

No tool call was refused. Nothing was written, checked out or built, and I read no file in the main checkout.
