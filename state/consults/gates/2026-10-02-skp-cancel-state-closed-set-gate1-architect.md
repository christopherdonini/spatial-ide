*Custodian's filing note (2026-10-02): the architect's gate 1 on PR #160, for PLAN node `skp-cancel-state-closed-set`, full gating. Reviewed: cut/skp-cancel-state-closed-set @ 8e4747e (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 8e4747e. Verdict PASS, with S2-1 (the I6 reading extends to four more test files, by reference in the closing record), S2-2 (the SKP-V0 §8 note's restatement of the entry-30 rule becomes a reference), S2-3 (DIVERGENCES.md's D1 cites and run lines) and S2-4 (five suites for the reviewer to show green). S2-2 and S2-3 go to correction round 1, batched with the reviewer's findings. Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/skp-cancel-state-closed-set @ 8e4747e. PR #160, gate 1, architect.

I have no Bash, so I computed no hash and ran no suite. Every `path:line @ <rev>` below needs its sha256 computed by the reviewer. Spans that exist only on the branch are named in words with the commit id (round 25, item 2 (d)). Quotes: none. Everything below is paraphrase.

Note on reading: partway through my review the worktree was checked out at B (2d835a9), then back at 8e4747e. The reflog is `.git/worktrees/skp-cancel-state/logs/HEAD`, entries 7 and 8. I read `main.rs`, `DIVERGENCES.md` and `SKP-V0.md` again after the return to 8e4747e. Every finding below is read at 8e4747e.

## S1 (blocking)
None.

## S2 (should fix; the PASS stands)

**S2-1. H1 is false at 27 sites, but Amendment 1 records only one** (item 5).
- Five test files outside §7 build a cancel response with `{ state: "requested" }` (read at 8e4747e):
  - `App.lateResult.test.tsx:207`: the one Amendment 1 records;
  - `admission/AdmissionPanel.test.ts`: 2 sites (lines 398, 508);
  - `streaming/tileViewportStreamManager.test.ts`: 2 sites (80, 1313);
  - `streaming/viewportStreamManager.test.ts`: 2 sites (49, 626);
  - `residency/candidateArmSession.test.ts`: 20 sites, from line 144 to line 3546.
- All are untyped `vi.fn().mockResolvedValue` values. All are inside the closed set, none is edited, and all compile unchanged. So the I6 reading in Amendment 1 item 1 covers them the same way, and nothing is invalidated.
- The cause is my drafting: §6 item 1's regex (`CancelResponse|CancelOutcome|CancelState|\.state\b`) cannot match an object-literal `state:`. §0's list of readers missed these sites for the same reason.
- **Fix:** in the closing amendment, add a reference only: the four files at their main base 3f72519 (they are outside the diff), stating that the I6 reading extends to them. Do not open a correction round.

**S2-2. The new SKP-V0 §8 note drops a condition from the entry-30 rule.**
- The note is lines 969-977 of `protocol/skp/SKP-V0.md` at 8e4747e. Its parenthesis paraphrases the rule as: a new key forces a bump, and a value-domain widening does not.
- Entry 30 attaches an expiry condition to the widening licence (`protocol/skp/SKP-V0.md:648-651` @ 337f0ee). The note leaves it out.
- The note's conclusion for this piece ("this is neither") does not depend on the licence. But binding spec text now states the rule without its condition, and the repo has been public since 2026-08-03 (ADR-009 corrigendum). My form's §0 bullet has the same simplification.
- **Fix:** reduce the parenthesis to a reference: no new key and no widening, per the entry-30 addendum's versioning disposition, with no restatement of the rule. This is a one-line edit inside §7's file list and its line budget, so it is not a record correction.

**S2-3. `DIVERGENCES.md` describes its own cites wrongly.**
- At 8e4747e, the Resolved line (lines 11-13) says the D1 record below it is the finding "as it stood at the baseline" (bb98f71). But the D1 cites in lines 18-21 (`commands.rs:460-465`, `skp.rs:98-110`, `types.ts:267-268`) are not bb98f71's lines: C.md places them at bb98f71 as `:381-385`, `:61-73` and `:217`.
- Lines 3-4 still say the fixtures were re-run at `skp/0.6`, commit 37b3644, directly above the new run line at 5d4da4d.
- The file is in §7, so these are fixes within the piece's scope, not disclosures.
- **Fix:** replace the D1 line cites with item names, as §2 item 6 already did for the host-deferred section, and make lines 3-6 agree with the new run line.

**S2-4. For the reviewer: §9 lists suites that must be green before either gate, and the worker's report gives no evidence for five of them.**
1. `cargo clippy`: the worker did not run it.
2. `npm run verify`: the worker ran only `typecheck` and `test`. `verify` also runs `check:*`, `verify:adr-index`, `test:residency-trace` and `test:citation-integrity`.
3. `verify:plan`: no run is recorded.
4. The `src-tauri` build: that crate is excluded from the workspace (`Cargo.toml:28`), so it is covered only by `product-ci-shell` on the branch's CI.
5. F7 unmutated at C: §6 item 2 asks for it, and `DIVERGENCES.md` states a run at 5d4da4d, but the worker recorded F7 only at B and at D.

My PASS assumes the reviewer's runs of all five are green. A red one fails the reviewer's gate.

## Judgments, per §9

1. **The §21a reading and §0's grounds.** Both hold.
   - **§21a:** the wire head (`AUTONOMY.md:323-324`) and the property-under-test head (`:327`) apply. The cancellation-guarantee head at `:326` is not engaged: CancelOutcome's variants and the registries' cancel arms are unchanged (read at 8e4747e; the reviewer confirms by diff).
   - **Direction:**
     - Ground 1 correctly characterizes ADR-021 Decision 2 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:60-63` @ 337f0ee): schema evolution only as a version bump, never as a tolerant reader.
     - Ground 2 matches SKP-V0 §4 item 13 (`protocol/skp/SKP-V0.md:274-278` @ 337f0ee).
     - Ground 3 matches the `CrsUnit` precedent: the same derives, no fallback.
   - **Version:** the spec's value set and the kernel's bytes are unchanged (T4), so entry 30 is not engaged. Question round 38, item 1 rules it.
2. **The seam and caller reading (§1).** Accepted.
   - Rust `CancelState` has product callers: `CancelResponse.state` and the kernel's `cancel_state_of`.
   - `cancel_state_of` is private, with one caller, `SkpHost::cancel`, at `kernel/src/skp.rs` line 1525 at 8e4747e.
   - TS `CancelState` is used by `CancelResponse`, which `client.ts:126` returns.
   - `CancelOutcome::as_str` had one caller on main (`kernel/src/skp.rs:1524` @ 3f72519), now replaced.
   - The deserialize refusal is not a new code path. It is the closed domain the existing `Deserialize` derive and the crate's both-directions rule force, the same as `CrsUnit`.
   - The end-to-end proof comes from the real shape, as a chain: T4 compares the real `SkpHost::cancel` output with the shared fixtures, and T5 reads the same fixtures through the TS type.
3. **ADR-004 Amendment 4, ADR-006 and ADR-018** are unchanged.
   - `CancelResponse` still has one member and keeps `deny_unknown_fields`.
   - No operation class changes.
   - The three values and the cancel semantics are untouched.
4. **§2 item 7, the SKP-V0 text in commit D.**
   - **(i)** Lines 123-126 at 8e4747e cover all four required points. They claim compile-time checking only in the shell, mention no conformance suite, and quote nothing.
   - **(ii)** The §8 note records every element: the §1 sentence added in place; no bump, with its reason and question round 38, item 1; the fixtures and both sides' tests in one commit (B); D1 resolved; the empty data-plane diff. It is appended after the `skp/0.8` entry.
   - Whether any earlier §8 text was edited is for the reviewer's diff to confirm. In the spans I compared, the content is identical, shifted down 5 lines.
   - Exception: S2-2.
5. **Amendment 1.**
   - **"I6 not fired" is the correct reading.** The H1 line points at I6, and I6 is defined in §5 with its own condition: compiling needs a file outside §7. When a pointer and its target's own condition differ, the target's condition governs. The condition is not met, and the stop exists to protect §7's scope, which nothing threatens here.
   - H1 is correctly left unedited (class 2: the prediction is never edited to match).
   - **The commit-plan deviation** is recorded correctly. The reason (C's id could not exist while C was being made) is valid, and C carried `REPORTED_DIVERGENCES = &[]`.
   - **Record form under the cap:**
     - it is references, plus the reason and the evidence class 2 requires;
     - its pin is at 3f72519, which is on main;
     - branch commits are named in words with no hash;
     - its first body line marks it post-result;
     - it has a superseded index.
   - Exception: S2-1's missing extent.
6. **R1 to R6** hold.
   - There is no `cfg`, and no test is ignored.
   - T4's fixture path is relative to `CARGO_MANIFEST_DIR`, the same form as the precedent at `kernel/src/skp.rs` line 2942 at 8e4747e.
   - The form says T4 "builds no path". That means no data or temp path: T4 joins a path only to read a fixture.
   - Nothing is claimed above L1.
7. **§8, item by item.**
   1. Out-of-list paths: depends on the reviewer's recount. The worker reports 13 files and 231 lines, within the budget.
   2. Holds: no serde fallback, and `state` is typed on both sides.
   3. Holds: no new code, validator, literal change or visible text.
   4. Holds: no change to `client.ts`, `src-tauri`, the variants or the registries.
   5. Holds: `v0-cancel-response.json` is unchanged.
   6. Holds: the three re-aims change only the right-hand side.
   7. Holds.
   8. Holds, except S2-2.
   9. Holds.
   10. Holds: T4 spawns no thread.
   11. Holds: each mutation is recorded as observed at 5d4da4d, and no `verify-mutation` run is called an observation.
   12. Holds: no overrun and no scope addition.
   13. Holds.
   14. Pending: the merge itself; the node records `merge: merge-commit`.

   The round 25, item 2 failure modes are all absent: no full-form §7 overrun outside class 8, no scope addition, no `verify-mutation` called an observation, no branch test text pinned by hash, and no five-line form.

## N (notes; no action requested)
- **N1.** Amendment 1 item 2 (the commit plan) fits class 1 better than class 2, since class 2 covers a missed §3/§5 prediction. Its first body line already carries class 1's marker, so no re-label is needed.
- **N2.** The header names only §21c's file bound. The line count (231 against 150) also crosses it. This changes nothing.
- **N3.** `protocol/skp/src/v0/commands.rs:7-8` @ 337f0ee says retyping a field means a new version string. Read it as the wire type, which is unchanged. Question round 38, item 1 and the §8 note carry the no-bump disposition.
- **N4.** The §8 note's "conformance harness" is the directory's name, not a claim to be SKP's conformance suite, so §8 item 8 is not breached.
- **N5.** ADR-029's stale `SKP-V0.md:97` cite remains out of scope, as routed. The branch's insertion is below line 121, so it moves nothing above it.

No ADR skeleton: no decision is missing.

Files:
- C:/dev/wt/skp-cancel-state/protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md
- C:/dev/wt/skp-cancel-state/protocol/skp/SKP-V0.md
- C:/dev/wt/skp-cancel-state/protocol/skp/tests/conformance/DIVERGENCES.md
- C:/dev/wt/skp-cancel-state/frontends/shell/src/residency/candidateArmSession.test.ts (and the three other test files in S2-1)
- C:/dev/spatial-ide/state/consults/2026-10-02-skp-cancel-state-closed-set-worker-report-1.md
