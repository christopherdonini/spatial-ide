*Custodian's filing note (2026-10-02): the reviewer's gate 1 on PR #158, for PLAN node `publish-panel-rs-regex-layout`, the single combined gate (§21b). Reviewed: cut/publish-panel-rs-regex-layout @ 8a1b0dc5797603cb52eb23ba9b16fe1fb082a40e (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 8a1b0dc. Verdict PASS, with S2-1 to fix before merge (the in-memory variant is a no-op, so vacuous, on c6d1414's layout); the fix goes back to the worker as correction round 1, recorded by a one-line class 4 `Amendment:` note under the five lines. Profile paths redacted at filing: none.*

---

VERDICT: PASS (cut/publish-panel-rs-regex-layout @ 8a1b0dc5797603cb52eb23ba9b16fe1fb082a40e)
Reviewed cut/publish-panel-rs-regex-layout @ 8a1b0dc5797603cb52eb23ba9b16fe1fb082a40e. PR #158, gate 1, reviewer: the single combined gate under AUTONOMY.md §21b. Base f5c87b0, one commit.

The verdict is PASS with one S2 (S2-1), which must be fixed before merge. There are no S1 findings. The worktree is left with `git status --porcelain` empty, nothing committed or pushed, and the main checkout untouched.

## Out-of-scope line, read first (§21d)
- The line names no §21a category as touched: ADR none, security none, wire none, guarantee none.
- The diff bears that out:
  - It is test-only.
  - `publish.rs` is unchanged (its content at f5c87b0 is byte-identical to the worktree's).
  - Both expected values and both asserted equalities are unchanged, so no property under test changes. Only the way the Rust source is read is loosened.
- The single gate applies. Round 25 item 2(e) resolves to AUTONOMY.md §25(e). Round 35 resolves to its RULED block in DECISIONS-PENDING.md. Both gate-file paths in the form exist.

## Findings
**S1:** none.

**S2-1. The in-memory variant can pass vacuously, and does so on #157's layout.** File: `PublishPanel.test.ts`, both pinned tests, the `moved` lines.
- `moved` is built by `rustSource.replace('<NAME>: &str = "', …)`, a fixed-string replace. Where that exact string is absent, `moved === rustSource`, and the in-memory assertion compares the file's match with itself, so it passes trivially.
- I probed this in a scratch script outside the worktree:
  - On main's `publish.rs`, both replaces take effect.
  - On c6d1414's `publish.rs` (the layout #157 lands), the `FILTER_SCOPE_SENTENCE` replace is a no-op; `PREPARE_CANCEL_KEY_PREFIX` still takes effect.
- So once #157 merges, the FILTER test no longer tests a CRLF before the literal, and nothing reports that. The form's Tests line ("each of the two tests also matches its regex against an in-memory copy … moved to the next line after a CRLF") would then be silently false for that test.
- At 8a1b0dc, against main's file, the Tests line holds, and the mutation proves it (section 4). That is why this is S2 and not S1.
- The fix stays in Scope and budget (about 16 of 20 lines):
  - build the variant layout-independently, e.g. `rustSource.replace(/(<NAME>\s*:\s*&str\s*=)\s*"/, '$1\r\n    "')`;
  - add the guard `expect(moved).not.toBe(rustSource)`;
  - re-observe the mutation and the seam proof on the new commit.

**N1. The mutation record (check 4).** The RECORDED MUTATION comments say "observed at base f5c87b0 plus this change". A comment inside a commit cannot name that same commit. "f5c87b0 plus this change" identifies one tree: 8a1b0dc's tree with the mutation applied. I rule that this satisfies "recorded with its commit", so it is not S2.
- I reproduced both mutations on 8a1b0dc's tree.
- The closing record should say so by reference to this report, naming 8a1b0dc.
- The worker report's wording ("uncommitted on HEAD f5c87b0") agrees with the comments.

**N2. The form departs from the architect's route.**
- The I4 ruling's route set a budget of at most 6 changed lines; the diff has 14. It also proposed a different mutation: one character of the Rust literal.
- The form, committed before any code at f5c87b0 and placed by round 35, declares 20 lines and the regex-whitespace mutation. The form is the binding preregistration, and the diff is within it.
- The form's mutation is also the right one: it targets the new tolerance, while the existing equality assertions already cover a literal change.

**N3.** Both regexes are unanchored on `const\s+`, unlike `frontends/shell/e2e/checkOriginEventName.mjs:44`. Each name occurs exactly once followed by `\s*:`, on both main and c6d1414, so this is harmless today.

**N4.** The quoted test names in the RECORDED MUTATION comments elide with ASCII `...` rather than `…`. Each kept span matches the test name byte for byte, and nothing is negated or qualified across the elision.

## Checks
1. **Scope and budget.** `git diff --numstat f5c87b0...8a1b0dc` gives `12 2 frontends/shell/src/publish/PublishPanel.test.ts`: 14 lines, 1 file, within the 20 declared. The capture groups (`([\s\S]*?)`, `([^"]*)`), the collapse step and both expected values are unchanged.
2. **Note 1 and R1, probed in scratch.** Both regexes extract the right value for each of these shapes: tabs around `:`, `=` and `;`; three blank lines between each token; CRLF before `=`; CRLF after `=`; CRLF everywhere; spaces before `;`; no spaces at all; NBSP after `=` (JS `\s` covers it).
   - A comment between `=` and the literal does not match. Note 1 asks for whitespace only.
   - On main's `publish.rs`, the new and old regexes match at the same index (4435 and 45280) with an identical capture; there is one global match each.
   - The captured literal contains no `"`, so neither the lazy `[\s\S]*?` nor the `"\s*;` terminator can stop earlier than before.
   - On c6d1414, the new FILTER regex matches (capture length 145, the same as main's) where the old one did not.
   - `.gitattributes` gives `publish.rs` `eol=lf`, so a CRLF file on disk is not a checkout risk; CRLF is covered in memory only.
3. **The in-memory variant.** See S2-1.
4. **Mutation, reproduced independently on 8a1b0dc.** I set `=\s*"` back to `= "` one regex at a time, then reverted.
   - FILTER regex: 1 failed and 41 passed. The FILTER test failed by its full name at `PublishPanel.test.ts:228:34` (the in-memory expect) with "expected undefined to be 'this bundle format cannot record a ro…'".
   - PREPARE regex: 1 failed and 41 passed. The PREPARE test failed by its full name at `:476:34` (the in-memory expect) with "expected undefined to be 'prepare:'".
   - Both match the worker report.
5. **Seam proof.**
   - With c6d1414's `publish.rs` in the working tree (numstat 413/105): 42 of 42 passed.
   - After `git checkout --`: 42 of 42 passed.
   - Control: base f5c87b0's test file against c6d1414's `publish.rs` fails the FILTER test at `:223` (`expect(match).not.toBeNull()`). That is I4 reproduced, and this change fixes it.
6. **Text readers.** The diff touches one file. `surfaceCompleteness.test.ts`, `checkOriginEventName.mjs` and `publish.rs` are unchanged.
7. **CI.** `gh pr checks 158` rc 0, all pass.
   - Product CI — shell, pull_request run 37029818741 on the merge ref: vitest/cargo test passed (5m49s) and the tauri build passed (5m33s). It was in progress at first read; I waited with a bounded `gh run watch` and it finished green at 15:56Z.
   - The push run 37029065886 also passed, as did sign-off and the profile-path check.
8. **PR body and worker report.**
   - Both match the commit: 14 lines, the regex texts, the mutation sites `:228` and `:476`, and the seam-proof counts, all reproduced.
   - The PR body's "`\s*` around the colon and after the equals sign" understates the change, which also allows whitespace before `=` and before `;`. That is not an over-claim.
   - The worker report discloses the no-op on c6d1414 but does not say that it makes the FILTER variant vacuous there (S2-1).
   - I did not re-run the whole-suite count (1094); CI's vitest job is green on the merge ref.

## Repository checks at 8a1b0dc
| Check | Exit code | Result |
|---|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 366 pass, 0 fail |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1085 files; advisories only, none in the diff |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 463 claims |
| `node scripts/plan/verify-mutation.mjs --base f5c87b0 --head 8a1b0dc` | 0 | PASS, "all 0 new test(s)" |

The `verify-mutation` PASS is vacuous here: it counts new test names, and this piece changes two existing tests. The mutation evidence is the reproduction in check 4, not this tool.

Files:
- `C:\dev\wt\publish-regex\frontends\shell\src\publish\PublishPanel.test.ts`
- `C:\dev\wt\publish-regex\frontends\shell\PUBLISH-PANEL-RS-REGEX-LAYOUT-PREREGISTRATION.md`
- `C:\dev\wt\publish-regex\state\consults\2026-10-02-publish-panel-rs-regex-layout-worker-report-1.md`
- `C:\dev\wt\publish-regex\state\consults\gates\2026-10-02-workspace-rustfmt-i4-architect-ruling.md`
