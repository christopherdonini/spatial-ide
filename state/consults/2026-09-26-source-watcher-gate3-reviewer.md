*Custodian's filing note (2026-09-26): the reviewer gate's attempt-3 reports (a scoped record round) for PLAN node `engine-source-change-watcher`, filed as returned (each extracted by script from the agent's hand-back; byte-identical), in the order returned: the report at c7c009d (PASS); its first addendum at 2b8aaaf, confirming the architect's record-cap (3) reduction byte-exact and finding five further quote mismatches (FAIL, record only); its second addendum at 1644aa3, after those were reduced the same way (PASS). Everything below the first rule is the agent's text, as returned, except 1 occurrence(s) of one rooted cite to lines that exist only on the branch, on this file's line 86. A script rewrote each to the worktree path, `C:devwtsource-change-watcher` followed by the same path and lines, because `verify-cites` resolves rooted cites against main's tree. Nothing else changed; the reports are separated by rules.*

---

**Reviewer gate, attempt 3 (record round): `engine-source-change-watcher` at c7c009d. Verdict: PASS.**

Scope: the worktree at C:\dev\wt\source-change-watcher, HEAD c7c009d. origin/main is 3dfc622, which is also the merge-base. I judged three commits: b178ee5, 722a551 and c7c009d.

State at the end:
- The tree is clean (`git status --porcelain` is empty).
- CARGO_TARGET_DIR was unset, so cargo used the worktree's own target.
- Every process ran in the foreground under `timeout` and has exited. None is left running.

## Blocking

None.

## 1. b178ee5 changes no behaviour

- **Every hunk is a comment, a doc comment or the one Markdown row.** 7 files, 14 lines in and 14 out.
- **Line counts are unchanged in every file:** watch.rs 711, source_watch_adapter.rs 645, MANUAL-WALKTHROUGH.md 1526, viewportStreamManager.test.ts 1117, skp.rs 3019, source_watch_ordering.rs 507, typed_terminal_codes.rs 363.
- **No doc-comment code block was added.**
- **`cargo check -p spatial-engine -p spatial-kernel --tests`:** rc 0.

Each fix against its finding:

- **F1/R1: fixed.** The K6 doc at `C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs:244-246` has no quotation marks and attributes no wording to §2b. It now paraphrases `ArmedWatch::resolves_unchanged`'s doc at `C:\dev\wt\source-change-watcher\engine\src\watch.rs:40-44`. That doc does call the check a second check beside the caller's own bookkeeping, so the paraphrase is accurate.
- **R2/S2: fixed.** Q2 at `C:\dev\wt\source-change-watcher\frontends\shell\MANUAL-WALKTHROUGH.md:1509` now lists `DescribeSummary.tsx` and its two `<dt>` labels (`C:\dev\wt\source-change-watcher\frontends\shell\src\admission\DescribeSummary.tsx:79` and `:86`, both `[P6 placeholder]`).
  - I grepped the branch diff for product files that add a `[P6 placeholder]` string: error.rs, watch.rs, App.tsx, DescribeSummary.tsx, describeSummaryText.ts, formatRefusal.ts, lib.rs and skp.rs.
  - Q2 now names all of them.
- **S1: fixed.** The RECORDED MUTATION lines above `mod raw_win32` (`C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs:256-258`) now match A6's own doc (`:353-355`) byte for byte. The frequency claim is gone.
- **S3: fixed.** `C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts:795` is labelled §2d, not SH7. The only SH7 left is the real one at `:839` and `:851`.
- **N1: fixed** at `C:\dev\wt\source-change-watcher\kernel\tests\typed_terminal_codes.rs:243`.
- **N3 / nit: fixed.** `C:\dev\wt\source-change-watcher\engine\src\watch.rs:223` now attributes the point to the fix ruling's §4 item 3, beyond B2. That matches the ruling's own "Beyond B2, flagged" bullet (`state/consults/2026-09-26-source-watcher-fix-ruling.md:75`).
- **Nit, the reason for "never null": fixed.** The re-issue comment at `C:\dev\wt\source-change-watcher\engine\src\watch.rs:341-343` now gives the correct reason: only one read is outstanding per handle, so a named cancel and a null cancel hit the same read here.
- **Nit, the SAFETY comment: fixed.** `C:\dev\wt\source-change-watcher\engine\src\watch.rs:460-461` now says a null `CancelIoEx` cancels I/O on the handle from any thread in the process. That matches `CancelIoEx`'s documented behaviour.
- **Nit, E7's printed path: fixed** (`kernel\src\skp.rs`) at `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2828`.
- **Left open, and acceptable:**
  - The `WATCH_BUFFER_BYTES` dead_code warning off Windows. The node `suites-and-toolchain-beyond-windows` exists (`C:\dev\wt\source-change-watcher\PLAN.yaml:2691`) and covers it.
  - The `.catch` nit in `App.tsx`.
  - My suggestion S1 (a grandparent spawn failure after P's thread has started).
  - None of the three blocks. S1 should go to the custodian's intake with the other residuals.

## 2. 722a551 brings only main's changes

- Its parents are b178ee5 and 3dfc622. It changes 15 files relative to b178ee5.
- Six of those are also in the branch's own diff set: CUSTODIAN-QUEUE.json and .md, PLAN.yaml, and site/data/health.json, site/data/plan.json and site/index.html. Those same six are the only files whose content differs from main's 3dfc622.
- **PLAN.yaml:** the only difference from main is the branch's own existing hunk on the node (`gate: engine/SOURCE-WATCHER-PREREGISTRATION.md`, `evidence: {branch: cut/source-change-watcher}`), carried through. It is identical to the branch's pre-merge hunk.
- **Queue and site:** they differ only in the regenerated plan hash, the timestamp and that node's evidence line.

## 3. c7c009d, Amendment 6

- **Append-only:** `git diff 68f5c56..c7c009d -- engine/SOURCE-WATCHER-PREREGISTRATION.md` is one hunk, `@@ -580,0 +581,20 @@`, with 0 removed lines. The file grows from 580 to 600 lines. No commit since 68f5c56 touches anything above the amendment.
- **References and hashes only:** it passes. The only prose is the class labels, one clause per row saying what the span is, and row 2's class-3 correction, which is two sentences and under the ceiling.
- **Every hash rev is on main:** 04b3680 and 3dfc622 are both ancestors of origin/main. Every `path:line @ rev sha256` reference sits on a single line.
- **Row 13 (the E5 pin) has no hash, and I accept that.**
  - Round 15 (e) governs hash references in an append-only record, and 4137f4d is not on main.
  - The fix ruling's residual row (`state/consults/2026-09-26-source-watcher-fix-ruling.md:130`) says the pin cannot enter the branch's record yet.
  - The architect's gate-2 §6 row 13 would have put a hash in with a rev that is not on main, which is exactly what (e) forbids. The worker was right to depart from it.
  - The row states that the pin is appended on main later, so it is not a pin read as current.

## 4. Hash table

Each hash was recomputed with `git show <rev>:<path> | sed -n '<a>,<b>p' | sha256sum`. All the source files have 0 CR bytes.

| Row | Span | Recomputed | Match | Covers what the row says |
|---|---|---|---|---|
| 1a | gate1-reviewer.md:81-116 @ 04b3680 | 2442590134d160c531e4fc3fb68fff46e4868ed8754a0174e65406bb34cf3b13 | yes | yes: the "Mutations applied, run and reverted" section |
| 1b | gate2-reviewer.md:82-95 @ 3dfc622 | 248a3217e7e93b717f3004b9ce9a8e6941a0c5b211e914bedc36e5d7742b05b4 | yes | yes: the mutation table. It holds K15 ×2, E7, both pins, SH7, SH8 and SH11, plus the probe and two regressions |
| 1c | gate2-reviewer.md:72 @ 3dfc622 | 304b7c44f34b8b2d2ff75725b5f3d4844df9f51829647e43b7d1f389f0d225d7 | yes | yes: the E10 line |
| 2 | gate1-reviewer.md:60 @ 04b3680 | c6e005ffeeda4417422e134a86ad03d2fe6427c356ffa8dad58fd0e13bb27458 | yes | yes: verify-mutation runs no mutation |
| 3 | gate1-reviewer.md:75-78 @ 04b3680 | 84719194d8e7bf307e0677e86c4245dbdfda8079f1ba88618fa5aa36b6ef3902 | yes | yes: H1, H2, H3 and H5. H4 (:79) is excluded |
| 4a | gate1-reviewer.md:62-69 @ 04b3680 | 00648cd2aa35c6a92acc3bdccb76a50e4788a1a84b1b1ccca1a0b0be8391ed88 | yes | yes: the gate-1 E2E |
| 4b | gate1-reviewer.md:71 @ 04b3680 | 292fb14e0414b2df3f5d9b8273707cbb86a65b40fe0af8a574643ee8205c2e31 | yes | yes: the W4 miss |
| 4c | gate2-reviewer.md:112-122 @ 3dfc622 | 3fc4771c146d02251fcb23ba9874bf69df39c4916bb4bc7bb52ee90fd22f7bcb | yes | yes: the gate-2 E2E rerun |
| 4 file | frontends/shell/e2e/out/source-watch-idle-1790421338030.json (worktree; git-ignored, cited as evidence) | 5d7882c069880b8ec8bd9575d0c5eec7f19bf2793cbc9911bdba5dc1a4008262 | yes | n/a |
| 5a | gate2-reviewer.md:124-135 @ 3dfc622 | 7a6435a535127595639f17f7c4cc658dac47f750b6a6e55785401d2b3c5505ad | yes | yes: the §21c figures |
| 5b | gate1-reviewer.md:120-133 @ 04b3680 | fb789316ded1d6147813652dcc7e888a1c11cea93612187ae712d71d8f3ce4b0 | yes | yes: gate 1's figures and the fold-in commits |
| 6 | gate1-reviewer.md:102-104 @ 04b3680 | 0de8a535c17b9159d25067288d14a321652959d64676c512288342831be6b676 | yes | yes: SH5 |
| 7a | gate1-reviewer.md:84 @ 04b3680 | 4f6f85e8e68c344eb85420be6b2eaab7e833fdabff342b172626128548420bf0 | yes | yes: E7's registered mutation |
| 7b | gate2-reviewer.md:87 @ 3dfc622 | c0d50fa38988e4b338e1bf7139db2ec263c3c27390fd6bee4a67c0f52eadfd2c | yes | yes: E7's registered mutation |
| 8 | gate1-architect.md:94-96 @ 04b3680 | c2b2989f9f389fdccd54348e1e2d95a9ee1a9e727d730c34712f6acc88add4f1 | yes | yes: SH12 |
| 9 | gate1-architect.md:58 @ 04b3680 | cc43abd4e5d313b930ad1217f7b14092256d26ae230a9ddb6f8e6e4fdcca3b18 | yes | yes: advisory 6 |
| 10 | gate2-reviewer.md:84-86 @ 3dfc622 | 6ae7828a2cc063712f9037f20b495bb4895791eb8df96fe6e3845468cc4c49e9 | yes | yes: K15's registered and second mutations, and the probe. The named test exists at `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2978`, inside `mod ticket_drop_under_lock_regression` (`:2419`) |
| 11 | gate2-architect.md:46-50 @ 3dfc622 | 1f825656fb040ef553b78b7828df414a8d619534b89060aac411a147938ca2b4 | yes | yes: the watch.rs bullet (B1, B2 and the use-after-free) |
| 13 (not in the row; checked for the later pin) | C:devwtsource-change-watcherkernelsrcskp.rs:2626-2644 @ 4137f4d | c0483b8ed3ec3e47424345548e458b484d44a2aba310a3470f6b7a9d7ffac31a | matches G2A and gate-1 R | 4137f4d is not on main |

The other references resolve:
- **Row 1:** dfdc8fb is on main and is the attempt-1 gate-log commit.
- **Row 12:**
  - The backticked `the listener logs no session reference` matches §4's test name byte for byte (`C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md:305`). The test was deleted in 8fbb1c6, which is fix item 10.
  - The backticked replacement title is at `C:\dev\wt\source-change-watcher\frontends\shell\src\App.test.ts:1352`, byte for byte.
- **Row 2's target:** Amendment 3 item 5's last sentence is at `C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md:517`.
- **Row 5's recount:** I ran `git diff --numstat origin/main...<rev>`, summing $1+$2, with gate 1's exclusions. The figures are identical at 68f5c56, 722a551 and HEAD:
  - engine 1,432 / 6, kernel 2,691 / 15, protocol 230 / 17, src-tauri 28 / 1, shell 2,094 / 26.
  - Total 6,475 lines across 65 files, so "recounted unchanged at 722a551" holds.

## 5. Checks (all at c7c009d, in the worktree)

| Check | Tool commit | rc | Result |
|---|---|---|---|
| `cargo check -p spatial-engine -p spatial-kernel --tests` | — | 0 | Finished |
| verify-cites.mjs | 7104cd3 | 0 | PASS (758 files). The only loose advisory near this piece is on main's gate1-reviewer.md:190, which predates this round |
| verify-quotes.mjs | f9444a4 | 0 | PASS, 0 hash-reference errors |
| verify-test-claims.mjs | b82941e | 0 | PASS, 256 claims |
| verify.mjs --offline | db9d20b | 0 | PASS |
| queue.mjs --check | deb56ed | 0 | current |
| site.mjs --check | f9444a4 | 0 | current |
| verify-mutation.mjs --base origin/main --head HEAD | 7d24ed1 | 0 | 89/89 |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | — | 0 | 311/311 |
| LF | — | — | 0 CR bytes across 98 checked paths: every file changed in origin/main...HEAD, plus the files changed since 68f5c56. `file` reports no CRLF in the round's files |

I also ran `cargo fmt --check` for the two crates. It exits 1 with 1,783 reflow diffs across files this round never touched, which points to a config or path mismatch, not a formatting problem. It is not one of the gate's checks and I did not use it.

## Suggestions (non-blocking)

- **Row 1's "attempt 3" has no commit yet.** Row 1 names the attempt-3 gate-log entry without a commit because it does not exist yet. The custodian should make sure the entry filed for this gate is the one row 1 means (the attempt-1 and attempt-2 entries are dfdc8fb and 3dfc622).
- **The preamble does not mention row 13's difference.** It says the rows are the architect's gate-2 §6 and does not note that row 13 deliberately leaves out the hash. The departure is correct under round 15 (e) and the fix ruling's line 130. A reader, though, has to find that out; the amendment does not say so.
- **The E5 pin on main is still owed.** After a merge that keeps 4137f4d reachable (no squash), the pin can be appended on main with the hash above.

## Nits

- **Row 14 overstates.** It says each discharge names its test. Row 11's discharge names the line of a report (proof by reading), not a test. Round 7 accepts "the test or line", so this is a wording overstatement, not a failure.
- **A stale doc still sits on `mod raw_win32`.** The first `///` paragraph above it (`C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs:251-255`) describes the throughput approach that was tried and dropped. It predates this round, and S1 only asked for the frequency claim to go.
- **Some reworded comment lines are over 100 columns.** `C:\dev\wt\source-change-watcher\engine\src\watch.rs:223` is 103, `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2828` is 106, and `C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts:795` is 104. This is cosmetic only.

## Gate-log note

`engine-source-change-watcher` attempt 3 at c7c009d: reviewer PASS (record round).
- **b178ee5:** comments and one Markdown row only, every file's line count held, cargo check rc 0. F1/R1 fixed: K6 no longer quotes §2b and paraphrases `ArmedWatch`'s doc. R2/S2 fixed: Q2 lists DescribeSummary.tsx's two `<dt>` labels. S1, S3, N1, N3 and the watch.rs and E7-path nits are applied and accurate.
- **722a551:** brings only main's changes. It overlaps the branch set only in the regenerated queue and site files and PLAN.yaml, which keeps the branch's own node hunk.
- **Amendment 6 (c7c009d):** append-only (+20 lines, 0 removed) and references and hashes only. All 18 span hashes recompute at 04b3680 or 3dfc622, both on main, and each span covers its row. The E2E report hash is 5d7882c0…8262. §21c recounts to 6,475 lines across 65 files at 722a551. Row 13 carries no hash, correctly under round 15 (e), since 4137f4d is not on main; the E5 pin (c0483b8e…) is appended on main after a history-keeping merge.
- **Checks:** verify-cites, verify-quotes, verify-test-claims, verify --offline, queue and site all rc 0. verify-mutation 89/89 (tool at 7d24ed1). Scripts suite 311/311. LF clean.
- **Left open, non-blocking:** WATCH_BUFFER_BYTES off Windows (goes to suites-and-toolchain-beyond-windows), the `.catch` nit, and S1 (grandparent spawn failure).

Files:
- C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md
- C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs
- C:\dev\wt\source-change-watcher\frontends\shell\MANUAL-WALKTHROUGH.md
- C:\dev\wt\source-change-watcher\frontends\shell\src\admission\DescribeSummary.tsx
- C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs
- C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts
- C:\dev\wt\source-change-watcher\kernel\tests\typed_terminal_codes.rs
- C:\dev\wt\source-change-watcher\engine\src\watch.rs
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs
- C:\dev\wt\source-change-watcher\frontends\shell\e2e\out\source-watch-idle-1790421338030.json
- C:\dev\spatial-ide\state\consults\2026-09-26-source-watcher-fix-ruling.md

---

**Addendum to the reviewer's attempt-3 report: `engine-source-change-watcher` at 2b8aaaf. Verdict: FAIL, record only.**

The reduction commit 2b8aaaf is confirmed exactly: every byte, LF, rustfmt, npm verify, the budget, and the governance checks.

My full sweep still finds five more quoted spans that do not match their sources. Each is a gate failure by name under round 10's "a quote marked verbatim that does not match its source byte-for-byte". Each needs a one-line, comment-only reduction of the same kind.

Three things you should know about that:
- Only one of the five (F-a) meets your sweep's criterion, a span attributed to a section. The other four are attributed to a doc comment, a test's own assertion text, or a recorded observed failure message, and round 10 reaches those too.
- All five were on the branch at attempts 1 through 3. I should have caught them at attempt 3, and did not, because I never swept for them.
- F-b, F-c and F-e sit in the text of recorded mutations. Their fixes are comment-only, but they correct what those records say.

State at the end:
- The tree is clean at 2b8aaaf.
- CARGO_TARGET_DIR was unset.
- Every process ran under `timeout` and has exited.

## 2b8aaaf: the confirmations you asked for

**The diff is exactly these bytes.**
- `git diff --numstat c7c009d..2b8aaaf` covers six files, 10 lines in and 10 out. The sites are watch.rs:453, source_watch_adapter.rs:552, formatRefusal.ts:73-74, lib.rs:493-494, skp.rs:1261 and :1333, and source_watch_ordering.rs:262 and :265.
- All eight of the architect's replacement lines match its text byte for byte. I compared each by script with `git show 2b8aaaf:<path> | sed -n '<l>p'`.
- Your two additions at `C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs:262` and `:265` are the only other changes.
- Every file keeps its line count.

**Each new reference says what its section says.** I read each against the preregistration at `C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md`.
- §2a is at `:102`.
- §2b's single emission point is at `:143`. It names the pre-check as `SkpHost::end_generation` and the post-check as `EngineSource::next_into`. That matches skp.rs:1261 and :1333 (the pre-check) and lib.rs:493-494 (the post-check).
- §4 A11's `icacls` deny is at `:247`.
- §1 is at `:61`.
- §4 K6's clauses (no catalog entry, no generation) are at `:268`.

**LF:** 0 CR bytes in all six files.

**fmt:** `cargo fmt --check -p spatial-engine -p spatial-kernel` exits 1 at both commits, as expected.
- The 1,783 reported locations are identical between c7c009d and 2b8aaaf, across the same 106 files.
- None of the -/+ lines rustfmt reports touches any of the ten changed comment lines.

**`npm run verify` in frontends/shell:** rc 0. 72 files and 1087 tests pass, and every check passes.

**Budget:** `git diff --numstat origin/main...HEAD` still measures against merge-base 3dfc622, even though origin/main has moved to 02ec6a3. The figures are unchanged:
- engine 1,432 lines / 6 files, kernel 2,691 / 15, protocol 230 / 17, src-tauri 28 / 1, shell 2,094 / 26.
- Total: 6,475 lines across 65 files. Amendment 6's row 5 holds.

**Governance checks at 2b8aaaf:**

| Check | Tool commit | rc | Result |
|---|---|---|---|
| verify-cites | 7104cd3 | 0 | PASS |
| verify-quotes | f9444a4 | 0 | PASS, 0 hash-reference errors |
| verify-test-claims | b82941e | 0 | PASS |
| verify.mjs --offline | db9d20b | 0 | PASS |
| queue.mjs --check | deb56ed | 0 | current |
| site.mjs --check | f9444a4 | 0 | current |
| verify-mutation --base origin/main --head HEAD | 7d24ed1 | 0 | 89/89 |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | — | 0 | 311/311 |

## The sweep

**How it worked:**
- It covered every `+` line in `origin/main...HEAD`: comment lines in code files, and every line in Markdown files.
- Consecutive comment lines were joined into one block, so a quote that spans lines is caught.
- Backtick spans that contain a `"` were masked before quote pairing.
- Each double-quoted or curly-quoted span of 5 or more characters that contains whitespace was searched, whitespace-normalized, across every tracked text file, with comment prefixes stripped and the quote's own occurrence excluded.
- I ran it once filtered to spans with an attribution nearby and once unfiltered, then resolved every candidate by hand.

**Where it cannot see:**
- Quotes inside string literals and test titles.
- Single-word quotes, and quotes shorter than 5 characters.
- Single-quoted spans.

**Found: five mismatches**

- **F-a (attributed to a section, so inside your criterion).** `C:\dev\wt\source-change-watcher\protocol\skp\src\v0\mod.rs:53-54` quotes §4 item 7's "no server-to-client push".
  - On main the item reads `7. **Subscriptions and events** — none. No server-to-client push on the control plane in any form.` The quote is lowercase; the source's "No" is capitalized.
  - At HEAD the branch rewrote item 7 (`C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md:232-236`), and the phrase no longer exists there at all.
  - Reduce it to an unquoted reference, for example: the one named exception to §4 item 7's rule against server-to-client push.
- **F-b (attributed to a doc comment).** `C:\dev\wt\source-change-watcher\kernel\tests\session_reference.rs:5-7` says SessionRef's own doc comment states "no command's request type accepts it; it authorizes nothing and is never looked up; its only reads are the transition report and the event."
  - The source, `C:\dev\wt\source-change-watcher\protocol\skp\src\v0\handles.rs:107-108`, reads `**No command's request type accepts it** — it authorizes nothing and is never looked up; its only reads are the transition report and the event (round 21 item 1, rider (a)).`
  - The case, the bold marks and the dash all differ.
- **F-c (attributed to a recorded observed failure).** `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2909` records that the run timed out with "one event, carrying the recorded reference" never satisfied.
  - The test's actual `expect` text is at `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2953`: `one event, carrying the reference recorded before forget_dataset ran`.
  - Both came in at 6a1d6f3, so the two never matched.
- **F-d (attributed to a test title).** `C:\dev\wt\source-change-watcher\frontends\shell\src\App.lateResult.test.tsx:555` reads RECORDED MUTATION for "a coverage-lost pre-check refusal also ends the session".
  - The test's title, at `:559`, is `an engine.source_coverage_lost pre-check refusal also ends the session`.
  - verify-mutation passes only because the real title falls within its window.
- **F-e (attributed to the test's own assertion).** `C:\dev\wt\source-change-watcher\kernel\tests\session_end_event.rs:273` reads this test's "exactly one event total" assertion fails.
  - The assertion's text, at `:299`, is `exactly one event, ever`.
  - Both came in at 43ec01d.

**Borderline: scare quotes with no attribution. Reducing them is cheap, but none blocks.**
- `C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.ts:327` and `:424` quote "exactly once" next to an Amendment 4 item 1 cite. The preregistration does not contain that phrase.
- `C:\dev\wt\source-change-watcher\frontends\shell\src\residency\candidateArmSession.test.ts:3623` quotes M6's mutation. There is no M6 anywhere in this file or in `OWNER-INVALIDATION-PREREGISTRATION.md`, so the quote was already unresolvable on main. d90837d only renamed the method inside it.
- `C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts:960` quotes "Another stream's [terminal] ends the session", an edited form of the SH12 title.
- `C:\dev\wt\source-change-watcher\frontends\shell\e2e\source-watch-idle.mjs:50` quotes "no new viewport_query", a paraphrase of F0.

**Checked and resolved:**
- Every KNOWN-LIMITATIONS item 24-28 span.
- The watch.rs, skp.rs, injected_watch, watch_support and typed_terminal_codes quotes of §2b and §4.
- source_watch_ordering.rs:258: the earlier revision of the comment at 43ec01d, line 269.
- session_end_event.rs:199-201: an elided quote of lib.rs:474-478. Both retained spans match, and the elision removes no negation or qualifier from what is kept.
- MANUAL-WALKTHROUGH.md:1493: §9, at the preregistration's line 468.
- The rest of the candidates on the filtered list.

## Gate-log note

`engine-source-change-watcher` attempt 3 addendum at 2b8aaaf: reviewer FAIL, record only.
- The architect's record-cap (3) reduction is confirmed byte-exact: six files, 10 lines in and 10 out, line counts and LF held. rustfmt's report set is unchanged (1,783 locations, 106 files). npm verify passes 1087. The budget holds at 6,475 lines across 65 files. All governance checks exit 0: verify-mutation 89/89, the scripts suite 311/311.
- The full sweep finds five more quotes that do not match their sources, under round 10:
  - mod.rs:53-54, the §4 item 7 phrase;
  - session_reference.rs:5-7, SessionRef's doc;
  - skp.rs:2909, E8's observed message;
  - App.lateResult.test.tsx:555, a test title;
  - session_end_event.rs:273, an assertion text.
- Each needs a one-line, comment-only reduction.

Files:
- C:\dev\wt\source-change-watcher\protocol\skp\src\v0\mod.rs
- C:\dev\wt\source-change-watcher\protocol\skp\src\v0\handles.rs
- C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md
- C:\dev\wt\source-change-watcher\kernel\tests\session_reference.rs
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.lateResult.test.tsx
- C:\dev\wt\source-change-watcher\kernel\tests\session_end_event.rs
- C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.ts
- C:\dev\wt\source-change-watcher\frontends\shell\src\residency\candidateArmSession.test.ts

---

**Second addendum to the reviewer's attempt-3 report: `engine-source-change-watcher` at 1644aa3. Verdict: PASS, record only.**

State at the end:
- The tree is clean at 1644aa3.
- Every process ran under `timeout` and has exited.

**The diff is exactly the comment lines you listed.**
- `git diff 2b8aaaf..1644aa3` touches 8 files, 12 lines in and 12 out. Every changed line is inside a `//`, `///`, `//!` or `*` comment.
- The sites are:
  - `C:\dev\wt\source-change-watcher\protocol\skp\src\v0\mod.rs:53-54`
  - `C:\dev\wt\source-change-watcher\kernel\tests\session_reference.rs:6-8`
  - `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2909`
  - `C:\dev\wt\source-change-watcher\frontends\shell\src\App.lateResult.test.tsx:555`
  - `C:\dev\wt\source-change-watcher\kernel\tests\session_end_event.rs:273`
  - `C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.ts:327` and `:424`
  - `C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts:960`
  - `C:\dev\wt\source-change-watcher\frontends\shell\e2e\source-watch-idle.mjs:50`
- Every file keeps its line count, and none has a CR byte.

**Each reduction now points to the right place.**
- F-c: the `expect` it refers to is in the test body below, at `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2953`.
- F-d: the test below is the `it(...)` at `C:\dev\wt\source-change-watcher\frontends\shell\src\App.lateResult.test.tsx:559`.
- F-b: it is marked "(paraphrased)" and has no quotation marks.
- F-a: it reads correctly against item 7 as the branch rewrote it.

**Sweep re-run over `origin/main...HEAD`.**
- The attributed-quote pass finds 0 spans with no match. It found 2 at 2b8aaaf, before the reduction.
- The unfiltered pass leaves 6 spans with no match. None of them is a branch-added mismatch:
  - 3 were resolved in my first addendum: session_end_event.rs:199 (an elided quote of lib.rs:474-478), source_watch_ordering.rs:258 (a quote of the comment's own revision at 43ec01d) and candidateArmSession.test.ts:3623 (the M6 label, already unresolvable on main).
  - 3 quote nothing: source_watch_adapter.rs:85 and :614, and viewportStreamManager.ts:330.

**Checks at 1644aa3:**

| Check | Tool commit | rc | Result |
|---|---|---|---|
| verify-mutation --base origin/main --head HEAD | 7d24ed1 | 0 | 89/89 |
| verify-cites | 7104cd3 | 0 | PASS |
| verify-quotes | f9444a4 | 0 | PASS, 0 hash-reference errors |
| verify-test-claims | b82941e | 0 | PASS |
| verify.mjs --offline | db9d20b | 0 | PASS |
| queue.mjs --check / site.mjs --check | deb56ed / f9444a4 | 0 / 0 | current |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | — | 0 | 311/311 |
| `npm run verify` (frontends/shell) | — | 0 | 72 files and 1087 tests pass; every check passes |
| `cargo check -p spatial-skp -p spatial-kernel --tests` | — | 0 | Finished |

**Gate-log note:** `engine-source-change-watcher` attempt 3, final reduction at 1644aa3, reviewer PASS (record only). The reviewer's five full-sweep quote mismatches and four borderline scare quotes are reduced to unquoted references or marked paraphrases: 8 files, comments only, 12 lines in and 12 out, line counts and LF held. The re-sweep finds no branch-added mismatch. verify-mutation 89/89, the verify-cites, verify-quotes, verify-test-claims, verify --offline, queue and site checks all rc 0, scripts 311/311, npm verify 1087 passed, cargo check rc 0.
