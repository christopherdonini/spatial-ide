*Custodian's filing note (2026-09-30): gate 1 (reviewer) of PR #144, B-1's T-A (ADR-021's Note 2026-09-30), for PLAN node `filter-bind-admission-implicit-coercions` at generation 2, attempt 1. Reviewed: docs/b-1-adr-021-note @ 7c6f9019149c2f000fec56595bf4e86595847467 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its items 1 and 5 close the architect's item 6 in the same gate. Profile paths redacted at filing: none.*

---

Reviewed: docs/b-1-adr-021-note @ 7c6f901
(full id 7c6f9019149c2f000fec56595bf4e86595847467; base origin/main @ 2700a04c9e445e2e92ed008647a23a3f89469b08, after `git fetch`)

Verdict: PASS. No blocking issues, no suggestions. One nit (below).

Correctness: PASS. Severity none. Scope: the one ADR-021 append. Disposition: ready for the human's merge click.
Evidence: PASS. Severity none. Scope: items 1-10, all recomputed in C:\dev\wt\b-1-adr-021-note. Disposition: no action.
Documentation: PASS. Severity none. Scope: the appended Note is byte-identical to the accepted T-A with only the two dates filled, and the Status line is untouched. Disposition: no action.

1. `git diff --stat origin/main...HEAD` shows `docs/adr/ADR-021-row-filter-on-viewport-query.md | 25 +++…`, 1 file changed, 25 insertions(+), no deletions. `git diff origin/main...HEAD | grep '^-'` prints only the header `--- a/docs/adr/…`. `grep -c '^-[^-]'` gives 0. No removed line.
2. `sha256sum state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` gives 76e139be7a2515abae1b28c11b80a18f58f451d13e93dafd41ccbf427c23f079. `git show origin/main:<same path> | sha256sum` gives the same hash.
3. `sed -n '22,45p' <rulings> | sha256sum` gives 837958a00d06abb5d6a837dfd1ce3a660b75fb26b0563363ab81d1d7c46204c4. `sed -n '244,267p' <ADR> | sha256sum` gives eb108e559904896bcf525b69828dd6c1829e62bc3adffd851818fbfaf2869920. `sed -n '243p' <ADR> | od -c` gives `\n` only, so line 243 is empty. `wc -l` gives 267. The span bounds are right: the rulings file's line 21 is the heading "### T-A. The ADR-021 Note" and its blank line, and T-B starts after line 45 (`sed -n '15,21p;46,50p'`).
4. `diff <(sed -n '22,45p' <rulings>) <(sed -n '244,267p' <ADR>)` exits 1 with two hunks, `1c1` and `3c3`. Each hunk changes `<date>` to `2026-09-30` and nothing else: the heading "## Note <date> — …" and the italic line "…typed acceptance of <date> (…". `grep -c '<date>' <ADR>` gives 0. The fill matches the ruling in DECISIONS-PENDING.md, block "RULED 2026-09-30 — B-1's typed texts accepted" ("with <date> filled as 2026-09-30").
5. `git show origin/main:<ADR> | sha256sum` and `head -n 242 <ADR> | sha256sum` both give 65fc1a70a46e084f4e6f40b6d674b6609e25d4ad9b279a61bd0e7fb6b7df28a9. The main file has 242 lines. `sed -n '3p'` is identical on both sides: "**Status:** **Accepted — 2026-08-13, by the human**, carrying the acceptance condition below."
6. `git ls-files --eol <ADR>` gives `i/lf w/lf attr/text=auto eol=lf`. `tail -c 2 <ADR> | od -c` gives `.  \n`, so the file ends with exactly one newline. `file` reports UTF-8 with no CRLF.
7. `git log -1 --format='%H%n%an%n%B' 7c6f901` shows the trailer `Signed-off-by: Christopher Donini <donini.christopher@gmail.com>`. The body's hashes match items 2 and 3.
8. Self-checks, each run in the worktree with `$?` captured:
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: rc=0 (tests 353, pass 353, fail 0)
   - `node scripts/plan/verify-cites.mjs`: rc=0, PASS over 949 files. The 32 loose references it advises on are all outside this diff (state/drafts).
   - `node scripts/plan/verify-quotes.mjs`: rc=0, PASS. 112 checked, 0 hash-reference errors. The 2 hash-baselined entries in engine/LOD-PREREGISTRATION.md already fail on main and are outside this diff.
   - `node scripts/plan/verify-test-claims.mjs`: rc=0, PASS (388 claims)
   - `node scripts/plan/verify.mjs`: rc=0, PASS
   - `node scripts/plan/queue.mjs --check`: rc=0, current
   - `node scripts/plan/site.mjs --check`: rc=0, current
   - `git status --porcelain` afterwards is empty, so the worktree was not modified.
9. `gh pr view 144 --json headRefOid,…` gives headRefOid 7c6f9019149c2f000fec56595bf4e86595847467, OPEN, not a draft. `gh pr checks 144` in full, rc=0:
   `every commit is signed off	pass	7s	…/runs/36640755035/job/109652191636`
   `test · verify:plan · queue/site drift	pass	1m2s	…/runs/36640726156/job/109652101278`
   `test · verify:plan · queue/site drift	pass	54s	…/runs/36640755163/job/109652192512`
   `gh run list --branch docs/b-1-adr-021-note` gives 36640755035 DCO (pull_request), 36640755163 Governance CI (pull_request) and 36640726156 Governance CI (push). All three ran on head 7c6f901 and completed with success. None are pending. No workflow is missing: the product-ci-rust, product-ci-shell and product-ci-viewer workflows and both adr-003 workflows are path-filtered to kernel/, engine/, renderer/, frontends/ and spikes/, and this diff touches none of those (`grep -A6 '^on:' .github/workflows/*.yml`). pages.yml runs only on pushes to main.
10. `node scripts/plan/docsOnly.mjs origin/main HEAD` gives rc=1: "NOT eligible for delegation (1 offending path(s)): docs/adr/ADR-021-…: ADR files and docs/01_Principles.md are never docs-only-eligible (AUTONOMY §9 …)". So auto-merge is refused and the merge is the human's click, as expected.

Checklist, applied to a docs-only diff:
- No code, so items 1-7 and the caller grep do not apply.
- The Note has no path:line cites, sha256 pins or passages presented as verbatim. I checked with `grep -noE '…\.(md|rs|mjs|yaml):[0-9]+|sha256|verbatim|reads:'` over lines 244-267, which found nothing (rc=1).
- The one file the Note names, engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md, exists in the tree (`ls -la`).
- The change is an append to an accepted ADR under the human's typed ruling (docs/README, ADR immutability: amend by appending). The Note itself says the text above is unchanged, and item 5 proves that.

Nit: the three-dot diff header line `--- a/…` matches a naive `^-` grep. Item 1 therefore uses `^-[^-]`, and only the header line was matched.
