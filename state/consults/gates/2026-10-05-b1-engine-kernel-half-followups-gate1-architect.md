*Custodian's filing note (2026-10-05): PR #178's gate 1, the architect, for PLAN node `b1-engine-kernel-half-followups`, under the tag node:b1-engine-kernel-half-followups@g1. Reviewed: cut/b1-engine-kernel-half-followups @ 7b05dfd6685c031102b298a17ed85a658949f3b7 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 35d3139f3fb9c9e7251e19e0f5c23fd3f7f9c1ba89652fa6b5d4a43722255ed6. Write audit PASS: zero write calls (Read 35, Grep 10, Glob 3, SubagentHandback 1). Run window from the transcript: 2026-10-05T16:07:14.324Z to 2026-10-05T16:20:50.707Z. The architect read the code from the read-only export `C:/dev/wt/b1f-head-7b05dfd6` while the reviewer ran mutations in the worktree. On its N-7, the custodian confirms from `gh pr view 178` that the PR body asks for a merge commit, never a squash, and names 784a15c79bc818488b89fdc21008993ccadd6297. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-engine-kernel-half-followups @ 7b05dfd6685c031102b298a17ed85a658949f3b7

**Verdict: FAIL.** There is one S1. It is fixed by one comment-only edit inside scope and needs no amendment. Everything else on the §9 Architect list passes.

I read the code in the export `C:/dev/wt/b1f-head-7b05dfd6`. I made no writes and ran no shell commands. I could not run git, so where I name a commit chain, I took it from `C:/dev/spatial-ide/.git/worktrees/b1f/logs/HEAD`: f75dff0e → 784a15c7 → d7688aec → 35f762d8 → 9c8e7930 → 7b05dfd6, all linear. The reviewer's `origin/main...HEAD` diff is the proof for items 1, 4 and 5.

## Findings

**S1-1. K-3's rewritten comment states test text that is false at the commit it now names.**
- Where: `kernel/tests/skp_projection.rs:368-373 @ 7b05dfd6`.
- The comment is now stamped "observed at b438c587…". It keeps the clause saying the test's closing assertion is `codes.len() == 7` (byte-copied from `kernel/tests/skp_projection.rs:373 @ 7b05dfd6`).
- The test's closing assertion asserts 8 (`kernel/tests/skp_projection.rs:571-575 @ 7b05dfd6`). The test's own doc says the 7 became 8 (`:358-359 @ 7b05dfd6`).
- Worker report 1, deviation 10, disclosed this and left it, reading it as part of the mutation text. It is not part of the mutation text, which ends at "(sharing `ColumnIsIdentity`'s code)". The clause sits in the Observed part.
- So this is a stale cite inside a file in scope, not something to disclose and keep. Per the round-7 ruling it is a gate failure by name.
- Fix: change `7` to `8`, or drop the clause. Comment-only, one commit. It stays inside §2 (K-rows) and §7 (`skp_projection.rs` goes from 75 to about 77 against a ceiling of 100). No class 9 and no amendment. After the fix, a narrow re-gate of that one comment is enough.

**N-1. Worker deviation 2 (K-2/X11): no claim changes and no amendment is needed.**
- The mutation text is kept byte-for-byte. The appended clause ("applied as a shift of both slice bounds…") records which realization produced the recorded message. That is what §4 asks for ("Each rewritten comment records the message observed").
- P2 holds under both readings. The literal reading also fails by name, at `assert!(checked_schema, "must have seen at least one batch")` (`kernel/tests/skp_projection.rs:336 @ 7b05dfd6`).
- That failure appears only in worker report 1, deviation 2. The closing record should reference that deviation and not restate it.

**N-2. Worker deviation 3 (K-3 names its failing test) is correct and needed.**
- The comment sits above `type ProjectionRefusalCase`, not above a test.
- §4's row K-3 label "K-4's test" is my drafting defect: it collides with the form's own row K-4. The intended meaning is B1's K-4, which is proven inside `every_projection_refusal_is_synchronous_typed_and_pre_mint` (`:351-367 @ 7b05dfd6`).
- No §8 bearing.

**N-3. Deviations 4, 5, 6, 7, 8 and 11 are within "content binding, wording the worker's".**
- None bears on §8.
- E-15's line names `c9ec02e` in short form while the S-x/K-x rows use 40-hex ids. Both resolve.

**N-4. Form defect (mine): §2 says "No change to `kernel/README.md`'s index".**
- That is wrong for `kernel/README.md:376`, the list of kernel halves of pieces filed elsewhere. This form governs kernel test edits, so it belongs there.
- §8 item 4 bars the path here. Route it, below.

**N-5. Pre-existing nit, not in this piece.**
- `compact_attribute_slice`'s doc (`engine/src/stream.rs:2366-2367 @ 7b05dfd6`) places the `compact_attribute_retention` gate in `retain_or_compact_single_run`. The gate is in `single_run_retention`.
- Carry it to the next piece that touches this file.

**N-6. Records on main, outside this PR's diff; no amendment can or should fix them.**
- Worker report 1, line 58: the phrase quoted as D6's drops the backticks that `engine/B1-FOLLOWUPS-PREREGISTRATION.md` §2, D6, carries around `skp/0.6` and `c9ec02e`. It is not byte-identical to the form's D6 text.
- Line 57 reproduces a span of the gate-3 reviewer report after "reads:", with no script mark and no hash. It does byte-match its source, `…gate3-reviewer.md:83`.
- Neither is an amendment. The closing record cites the report by reference only and does not carry either quote.

**N-7. PR body: not verified, because I have no shell.** §9 requires the body to ask for a merge commit and to name `784a15c79bc818488b89fdc21008993ccadd6297`. Two things depend on a merge commit:
- T1's comment names that branch commit;
- `engine/README.md:499`'s "Last verified at" names `9c8e7930`.

The reviewer or the custodian confirms this from `gh`.

## Checklist

**§8, item by item:**
1. No product non-comment line changes: PASS. Every code line in `single_run_retention`, `retain_or_compact_single_run`, `compact_attribute_slice` and `flush`'s arm is identical to main. Line offsets account exactly for +146/−51 (net +95, T1 is 78 lines).
2. No new `pub` or `pub(crate)` item: PASS. T1 reads the private `stream.rx` from inside the module.
3. No existing assertion, message, fixture or name changed: PASS.
4. Paths: PASS, on worker report 1, the reflog commit set and the export. The reviewer's diff is the proof.
5. SKP-V0: PASS. One dated note at `protocol/skp/SKP-V0.md:979-985 @ 7b05dfd6`, after the 2026-10-02 note and before §9. Lines 960-977 are unchanged against main. No literal changed.
6. "zero-copy": PASS. A grep over the four files finds none.
7. No performance number: PASS.
8. Recorded-mutation comments: FAIL through S1-1. Every rewritten comment names its commit and carries no line number. The stale-text defect is S1-1. No record calls a `verify-mutation` run an observation.
9. The seam rule: PASS (see the seam check below).
10. No rule over offsets beyond the observed cases: PASS. Publish's bytes are called equal to main's by construction (`engine/src/stream.rs:99-103`, `:591-593 @ 7b05dfd6`).
11. No edit to an ADR or to the barred forms: PASS.
12. The five declared-unchanged comments are byte-identical: PASS. They now sit at `engine/src/stream.rs:2639-2645`, `:2877-2880` and `:2952-2955`, and at `skp_projection.rs:1121-1125` and `:1463-1468 @ 7b05dfd6`. `wire_bytes_invariant.rs` is untouched.
13. Hash pins and test-text spans: PASS.
    - No record hash is pinned at a branch commit.
    - T1's quoted failure message is named with 784a15c7, by id.
    - E-15's message is named with `c9ec02e`.
    - The index update's branch line cites are read at 9c8e7930, which it names.
14. cfg: PASS. The only `cfg` is the `fixture` feature cfg that §2 requires. There are no platform cfgs and no absolute path literals.

**The seam: PASS.**
- At the base, `kernel/src/publish/mod.rs:493` is `ds.resolve_projection(&req.attributes)?` and `:716` is `ds.stream_for_publish(&req.query, projection, cancel.clone())?`. The kernel's `src` is untouched by the branch.
- The engine signatures: `resolve_projection(&self, names: &[String])` (`engine/src/stream.rs:959`) and `stream_for_publish(&self, &ViewportQuery, &AdmittedProjection, CancelToken)` (`:932`).
- T1 makes the same two calls (`:3148-3153`). It builds no `StreamPlan` and never calls `stream_inner`. It observes queued `Item`s before IPC encoding.
- The real shape holds.

**D6 against SKP-V0 §8's append-only rule (`SKP-V0.md:541-544`): PASS.** The note is appended after the last entry. It covers the four list sites and the conformance scoping, and says no literal changes and the data plane has an empty diff.

**Verbatim quotes and discharge claims: PASS for the diff.**
- The quoted messages match their assertions' format strings at head:
  - T1 with `:3170-3171`;
  - S-2 with `:3076`;
  - K-1 with `skp_projection.rs:286`;
  - K-4 with `:700`;
  - K-6 with `:1076`;
  - K-8 with `:1449`.
- E-15's message matches `:2793` and the worker's `c9ec02e` line 2669 output.
- The diff adds no amendment, so it makes no discharge claim. Records outside the diff are N-6.

**Round 25:**
- Class 8: no overrun. Worker report 1 counts 197 + 75 + 8 at 9c8e7930, and the index update counts README at 6, so 286 against 360, with every file under its ceiling. §7 is unedited and the form is identical to main's, with §10 empty. The reviewer's count is the proof.
- Class 9: no addition landed. The K-2 realization clause and K-3's test name record observations inside rows §2 already lists. Either "found, not changed" item, if taken here, would be class 9, with its amendment first.
- Mutation wording: clean.
- Test-text spans: clean.
- The five-line-form check does not apply: this is a full form.

**Doc nits: does each rewritten doc state §2's binding content? Yes, each does.**
- D3, both shapes with the padding-bit attribution, at all three sites: the `StreamPlan` field doc (`stream.rs:586-595`), `flush`'s comment (`:2437-2444`) and E-15's doc (`:2767-2772`). E-15 keeps its "no bitmap" claim.
- D3, observed cases only, with "no rule over offsets or lengths is claimed", and the mechanism not stated as fact: `:91-97` and `:2366-2374`. Both name 8/3, 0/10 and 40/20 as differing and 3/5 as equal.
- D4: the doc moved onto `retain_or_compact_single_run` (`:2331-2345`), and `single_run_retention` keeps its own (`:2315-2322`).
- The relative clause is reattached to the other plans and names T1 (`:2318-2322`).
- The const doc names `retain_or_compact_single_run`'s branch and T1 (`:99-103`).
- E-15's Mutation paragraph keeps its failure path. Its new line (`:2779-2781`) carries the realization, the commit `c9ec02e`, the observer (gate 3's reviewer, row 9.6(a)), "left 5000" and the message.
- One tension between §2's two D3 bullets: three sites must attribute the difference to padding bits, and two must not state the mechanism. The worker resolved it by phrasing the attribution as a condition. I accept that.

**lead-data's index update (`state/consults/2026-10-05-b1-engine-kernel-half-followups-index-update.md`):**
- Correct, and applied byte-identically at `engine/README.md:499`, `:505` and `:518 @ 7b05dfd6`. Its pointers resolve: T1 at `:3121` inside `mod tests` (`:2560-3445`), `resolve_projection` at `:959`, and the constant at `:104`.
- Complete against §2's three bullets.
- Its two "found, not changed" items are both accurate, and neither belongs in this piece:
  1. `Dataset::resolve_projection` is not in `engine/README.md:505`. This piece does not change what that pointer points to, so nothing is owed by the index rule. Route it to the next piece that touches the engine index.
  2. `kernel/README.md:376` does not name this form. Owed, but outside §8 item 4 (N-4). Route it to `kernel-close-races-followups`, whose form should list `kernel/README.md` and name both forms.

## Closing-record list (after the merge; references and hashes only)
1. PR #178, its merge commit id on main, and the reviewed head after the S1-1 fix.
2. The gate report paths: this one, the reviewer's, and any re-gate.
3. `state/consults/2026-10-05-b1-engine-kernel-half-followups-worker-report-1.md`, by section (deviations 2 and 3), plus any report 2.
4. T1's observation commit, `784a15c79bc818488b89fdc21008993ccadd6297` (reachable through the merge commit). Pin `engine/src/stream.rs` T1's comment line range `@ <merge commit> sha256:<hex>`, recomputed by the reviewer.
5. P1, P2 and P3 are discharged by the reviewer's report rows, by name. §7's count is that report's row.
6. The skp_projection.rs half of `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` Amendment 1, item 1.4: discharged by rows K-1 to K-8, at the merge commit, with the reviewer's row table as the proof. This is recorded in this form's §10, not in the close-races form.
7. Routed: index item 1 (to the engine-index follow-up), index item 2 and N-4 (to `kernel-close-races-followups`), and N-5. One line each, node name only.
8. PLAN node done with `{pr: 178}` in the done commit only.

## The lead-data pilot: pointers wrong or missing
- The impact read §1.5 gives K-5's comment as `kernel/tests/skp_projection.rs:917-921`. At main it spans `:917-922`, and the form pins 917-922.
- The impact read §2 lists the index rows the piece sits under (`engine/README.md:505`, `:503`, `:523`; `kernel/README.md:361`). It omits `engine/README.md:518`, the governing-forms list, which this piece had to change. It also omits `kernel/README.md:376`, and that omission flowed into the form's §2 error (N-4).
- The impact read §1.2 says only the live plan's test drives the plan → `stream_inner` → `flush` path. The two `engine/tests/publish_stream.rs` tests in its next bullet drive publish's full path too. "Only" holds for retention assertions, not for the path.
- The index update: no wrong pointer. Its "Last verified at 9c8e7930" holds only under a merge-commit merge (N-7).

Files:
- C:/dev/wt/b1f-head-7b05dfd6/kernel/tests/skp_projection.rs
- C:/dev/wt/b1f-head-7b05dfd6/engine/src/stream.rs
- C:/dev/wt/b1f-head-7b05dfd6/protocol/skp/SKP-V0.md
- C:/dev/wt/b1f-head-7b05dfd6/engine/README.md
- C:/dev/spatial-ide/engine/B1-FOLLOWUPS-PREREGISTRATION.md
- C:/dev/spatial-ide/kernel/src/publish/mod.rs
- C:/dev/spatial-ide/kernel/README.md
- C:/dev/spatial-ide/state/consults/2026-10-05-b1-engine-kernel-half-followups-worker-report-1.md
- C:/dev/spatial-ide/state/consults/2026-10-05-b1-engine-kernel-half-followups-index-update.md
- C:/dev/spatial-ide/state/consults/2026-10-05-b1-engine-kernel-half-followups-impact-read.md
