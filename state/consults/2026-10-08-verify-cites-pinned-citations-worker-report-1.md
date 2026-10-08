*Custodian's filing note (2026-10-08): `verify-cites-pinned-citations`'s worker report, at the branch head 57e8d2b3 (worker run from 15:11:04Z, report at 15:18:31Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 22864903d1da6e071169477b2416be15c2c374c4cd44642de897ffca05b827e0. The custodian read the diff ed396e94..57e8d2b3 (2 files, 97 lines added and 4 removed). Paths and lines below are at the branch head, not main.*

---

Built the pinned-citation fallback in verify-cites.mjs, with P1 to P4. All checks pass and the seam proof is clean. Both commits are on origin and the worktree is clean.

**Commits (signed off, pushed as ordinary updates)**
- 0e092a40 feat: verify-cites reads a pinned citation at its pinned commit before calling it unresolved
- 57e8d2b3 docs: record the three hand-applied mutations for the pinned-citation tests

**How pins are parsed and resolved now**
- Before this change the checker did not parse `@ <rev>` at all.
- `extractCitations` now looks at the text right after each `path:line[-line]` token. It matches an optional space, `@`, an optional space, then a 7 to 40 hex-digit commit id. The result is stored as `cite.pin`, or `null` when there is none. The new regex is at `verify-cites.mjs:142`, and `checkPinned` (new) sits just above `globToRegExp`.
- In `runVerifyCites`, a cite that carries a pin and did not come out `ok` against the tree is read at its pin. That covers `oob-exact`, `oob-suffix`, and a rooted `no-match`. A loose `no-match` is still skipped as today.
- `checkPinned` uses `git cat-file -e <rev>^{commit}` and `git show <rev>:<path>` in the checker's repo root, with stderr suppressed. It fails with a reason in three cases:
  - the commit is missing: "pinned commit X not found";
  - the file is missing at that commit;
  - the line or range end is past that file's line count at the commit.
- A failing pin keeps the cite's original tier (gated or advisory). Its reason is the pin's reason, replacing the tree's.
- Unpinned cites, the archived prefixes, the loose and doc-number classes, the output format and the exit codes are untouched.

**P1 to P4 (observation commit 0e092a40fb10 for every mutation, all reverted, tree clean afterwards)**

| Test | Mutation applied by hand | Failing test (only one failed) | Reverted |
|---|---|---|---|
| P1 `a_pinned_cite_past_the_trees_end_that_resolves_at_its_commit_passes` | `if (pr.ok) continue;` commented out | P1 | yes |
| P2 `a_pinned_cite_whose_commit_does_not_exist_fails_by_name` | the missing-commit branch returns `ok: true` | P2 | yes |
| P3 `a_pinned_cite_whose_file_is_missing_at_that_commit_fails_by_name` | a failed `git show` leaves empty text instead of failing | P3 | yes |
| P4 `an_unpinned_cite_past_the_trees_end_still_fails` | none, as the form says | n/a | n/a |

The `RECORDED MUTATION` comments are in 57e8d2b3, the later commit, as you asked. I ran no `verify-mutation`.

**Seam proof**
- Before: the m1 checker fails with 4 gated cites, all pinned at 30e77c10 (`SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md` lines 17, 95 and 101, and the architect draft line 61). There were 37 advisories.
- After: `gated 0 advisory 37 scanned 1513`.
- The checker takes its root from its own file location. It has no root option, so running `node C:/dev/wt/vcp/scripts/plan/verify-cites.mjs` from `C:/dev/wt/m1` scans the vcp tree instead.
- To point it at m1 I imported the exported `runVerifyCites({repoRoot:'C:/dev/wt/m1'})` from the vcp file through `node --input-type=module -e`. That is read-only, and I wrote nothing in m1. The 37 advisories are unchanged and nothing new fails.

**Checks**

| Check | Exit | Result |
|---|---|---|
| `node --test scripts/plan/verify-cites.test.mjs` | 0 | 19 pass, 0 fail |
| Full scripts suite (in a shared hold) | 0 | 454 pass, 0 fail |
| `verify-cites.mjs` | 0 | pass |
| `verify-quotes.mjs` | 0 | pass |
| `verify-test-claims.mjs` | 0 | pass |
| `verify.mjs` (plan) | 0 | pass |
| `queue.mjs --check` | 0 | current |
| `site.mjs --check` | 0 | current |
| `cfg-boundary.mjs` | 0 | pass |

- The form does not name the "six verifiers". I took them from the workflow's governance-ci job, which gives these six plus `cfg-boundary.mjs` as a seventh I also ran.
- The suite run held with a shared hold granted. Its exit code was carried through a `tail` pipe, so I read the "454 pass, 0 fail" lines instead of an exit code.

**Scope count**
- `git diff --numstat ed396e94 HEAD`: verify-cites.mjs +31/-4, verify-cites.test.mjs +66/-0.
- That is 101 changed lines in the two files, within the 150 limit.

**Deviations and notes**
- The form says "line is out of range there" for the pinned commit. I used the same lenient count as the checker (`split('\n').length`), so a trailing newline allows one line past the end.
- A pin on a cite that already resolves in the tree is not checked. The form only reads a pin when the cite does not resolve in the tree, so a missing pin commit fails only in that case.
- My first attempt at the edit, a mangled shell heredoc, touched only `verify-cites.mjs`. I reverted it with `git checkout` before redoing the edit properly.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

Four-class self-check:
- Interface: git is read only through `cat-file` and `show`, and `runVerifyCites` and `checkCitation` were read first.
- Evidence: every claim above has a command output behind it.
- Messages: the new failure reasons describe code in this commit.
- Tests: P1 to P3 were each seen failing by name under their mutation.
