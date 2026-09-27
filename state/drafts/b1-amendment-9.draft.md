*Custodian's note (2026-09-27): the architect's draft of Amendment 9 to engine/B1-PROJECTION-PREREGISTRATION.md for PLAN node `b1-engine-kernel-half` (a class-9 scope addition at the merge of main: #123's conformance fixtures to B1's wire shape and literal; E-15's mutation), saved as returned from the hand-back message with the harness's two-space indent removed. The amendment text is the part between the two rules; a worker appends it byte for byte. Its cited rulings were checked against the tracked text before filing (round 24, item 4, `DECISIONS-PENDING.md` line 97; RULED 2026-09-24 (night), line 227; `AMBIGUITIES.md` A9).*

---

**Verdict: pass with notes. B1 goes ahead under Amendment 9, below.** `cut/b1-engine-projection @ 0b517d9` (the worktree checkout, which you state is at that commit; I ran no git command). Main's side was read at `main @ e606af7`: `protocol/skp/tests/conformance/{README.md,main.rs,DIVERGENCES.md,AMBIGUITIES.md,fixtures/*.json}` and `protocol/skp/src/v0/mod.rs`, whose `SKP_VERSION` is still `skp/0.5`, so `skp/0.6` remains the literal after main's (§8 item 4 holds).

**1. Scope, class and record cap.**
- The update is outside the form's letter. §2.1's fixture list covers the fixtures both the Rust and the TypeScript tests read, and the conformance suite is Rust-only and postdates the form.
- It does fall under two things B1 already carries: §2.8's rule that merge conflicts are resolved by carrying every piece's fields, and the standing literal rule.
- It takes an amendment of **class 9 (scope addition)**, declared before any code of the addition (round 25, item 2). Landing the fixture commit first is a gate failure by name.
- It is not a record correction, so it does not count against the two correction rounds.
- Gate 3's reviewer report becomes the observation of record, and no closing amendment follows.

**2. Round 24, item 4 does not reach this.**
- The human's words on round 24, item 4 were "Hold until the watcher" (RULED 2026-09-26). The `skp/0.5` fixture update appears only in the custodian's Applied text for that item: it was one application, for #123. It is not a standing rule and names no later literal.
- Your phrase "fixtures follow the literal current on main" is a paraphrase the ledger does not carry. Keep it out of the record.
- No question to the human is needed. The authorities are:
  - The literal: RULED 2026-09-24 (night), item (2), already in B1's Authority. The suite's own `AMBIGUITIES.md` A9 resolution also says fixtures use the current merged literal.
  - `columns`: the fixtures are derived from the spec. B1 writes the spec text (SKP-V0 §8's `skp/0.6` entry and §9.2) under RULED 2026-09-24, question round 17, items 3 and 4, and RULED 2026-09-14, question set D, item D2.
- A question would be needed only if a fixture's `expect` or `roundtrip` had to change, or `main.rs` / `REPORTED_DIVERGENCES` had to change. Amendment 9 makes either one an invalidator.

**Two notes your facts did not cover:**
- **The version fixtures are wrong in a way the harness cannot see.** `refusals-any-layer.json` has `any-version-skp_0_6`, which expects `skp/0.6` to be refused with `skp.version_unsupported`. Under B1 that becomes the live literal. Every version fixture is deferred to the host (A3), so the harness stays green while the fixture asserts something false. It has to be renumbered: 9.2 below.
- **`DIVERGENCES.md`'s five `path:line` cites go stale at the merge because of B1's own diff.** For example, `CancelResponse` is at `commands.rs:448` on main and at `:461` on the branch, and the `CancelResponse` interface is at `types.ts:257` on main and `:267` on the branch. Once the file is in scope these are class-3 fixes in the same commit.

**3. The proof.** The harness's set equality proves the `columns` half, with two mutations: M-1 (one fixture without `columns`) and M-2 (`skip_serializing_if` on the field).
- The literal half has no mutation that can fail. Its proof is the diff plus a count of `"skp": "skp/0.5"` in `fixtures/` equal to 0, with the exit code checked.
- Nothing may call a `verify-mutation` run an observation of a mutation (round 25, item 2 (c)).

**4. E-15 is not taken as recorded.**
- X10's survival stands as a result, but it leaves E-15's §4 mutation unresolved.
- "Compact the whole chunk" can be done two ways:
  - The test's own doc names a full-length copy. E-15's `compacted.len() == 20` assertion sees that.
  - The worker's version keeps the window and over-retains the buffer. IPC bytes cannot see that; it is a retention property (E-14, with §7 as row 5.3 amends it).
- No new test is needed unless the observations in 9.6 below both survive. If they do, stop.

**5. Order.**
1. Merge `origin/main` into the branch. Resolve only the generated files; the conformance files stay byte-identical to main's.
2. Run `verify:cites` (the merge cures Amendment 8's failure).
3. Commit Amendment 9 as returned.
4. Make the fixture commit (9.2), touching `protocol/skp/tests/conformance/` only.
5. Observe M-1, M-2 and 9.6 as the pre-gate self-check: apply, run, note the failure by name, revert. Leave the tree clean.
6. Run §9's suites and the scripts `node --test` suite.
7. Push and read the branch's CI (ubuntu).
8. Gate 3.

Beforehand, record main's harness count line at `e606af7` as the baseline 9.4 compares against.

---

### Amendment 9 — 2026-09-27, post-result: scope addition on RULED 2026-09-24 (night), item (2): `protocol/skp/tests/conformance/` at the merge of `main`; E-15's mutation

Class 9 (scope addition), with one class-4 row (9.6). Written after a trial merge of `main` at `e606af7` was seen failing `spec_derived_fixtures_against_wire_types`, and after Amendment 8's X10 row. This is not a record correction. The merge of `main` precedes this amendment and changes no conformance file; no code of the addition precedes it.

**9.1 Rule and cause.** RULED 2026-09-24 (night), item (2), and §2.8's resolution rule now cover #123's conformance suite (`protocol/skp/tests/conformance/`), which postdates this form. At the merge, `req-viewport-all-null`, `req-viewport-populated`, `req-viewport-hex-zero-and-negzero` and `req-viewport-decu64-max` newly diverge, because they re-serialize with `columns` (§2.1; SKP-V0 §8's `skp/0.6` entry). Round 24, item 4 is not the authority.

**9.2 §2 shape.** One commit after the merge, touching only `protocol/skp/tests/conformance/`:
- `fixtures/*.json`:
  - Every `"skp": "skp/0.5"` becomes `"skp/0.6"`.
  - In `refusals-any-layer.json`, `any-version-skp_0_6` becomes `any-version-skp_0_7` on `skp/0.7`. `any-version-SKP_0_5` becomes `any-version-SKP_0_6` on `SKP/0.6`, and `any-version-skp_0_5SP` becomes `any-version-skp_0_6SP` on `skp/0.6` with its trailing space.
  - The nine version fixtures' `spec` names the `skp/0.6` literal. A `spec` naming the version that introduced a field is unchanged.
- The four fixtures of 9.1 gain `"columns": null`, and their `spec` gains §8's `skp/0.6` entry. No other document gains `columns`.
- `DIVERGENCES.md`: the header's re-run sentence and count line are updated to this run, naming the merge commit and the platform. Its five `path:line` cites are re-pointed to the merged tree (class 3).
- `AMBIGUITIES.md` A9: one clause appended for `skp/0.6`.
- `README.md`: one sentence appended naming this amendment. The commit changes no implementation file.

**9.3 §4.** The test is `spec_derived_fixtures_against_wire_types`, with `main.rs` unchanged. Each mutation is applied, the test is run, its failure is recorded by name with the commit, and the mutation is reverted (round 25, item 2 (c)):
- M-1: `"columns": null` removed from `req-viewport-all-null`. The observed set gains that id.
- M-2: `skip_serializing_if` on `ViewportQueryRequest::columns`. The four ids of 9.1 join the observed set.

The literal half has no mutation, because every version fixture is deferred to the host (`AMBIGUITIES.md` A3). Its proof is the diff and a count of `"skp": "skp/0.5"` under `fixtures/` equal to 0.

**9.4 §5.**
- Declared unchanged:
  - `main.rs`;
  - every fixture's `expect`, `roundtrip` and `expected_refusal_code`, and the number of fixtures;
  - D1's substance;
  - the observed divergence set, which stays `rej-resp-cancel-bad-state` alone;
  - the pass and deferred counts, which equal main's harness at `e606af7`.
- Invalidators (stop and return to the architect):
  - any of the above moves;
  - an implementation file must change for the harness to pass;
  - a divergence other than 9.1's four appears at the merge.

**9.5 §8 and §9.**
- Block-on-sight 24: the fixture commit touches a path outside `protocol/skp/tests/conformance/`; a fixture refuses `skp/0.6` or carries `skp/0.5` as its literal; or `columns` is non-null or appears outside 9.1's four fixtures.
- The reviewer reads:
  - the commit's diff;
  - M-1's and M-2's observations;
  - the harness's `--nocapture` count line at a named commit, beside main's count at `e606af7`.
- The architect checks 9.2 against `main.rs`'s `check` (round-trip value equality).

**9.6 E-15 (class 4, on gate 2's A-E6 and Amendment 8's X10).** X10's survival stands.
- The full-length copy that E-15's doc names is observed against E-15.
- X10's realization (an unchanged window over a whole-chunk buffer) is observed against `every_emitted_attribute_column_retains_at_most_the_declared_factor` and `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound`, as 9.3 prescribes. At least one must fail by name.
- If both survive, stop: the retention proof has a gap, and a test is declared by amendment before it is written.

**Record.** Gate 3's reviewer report is the observation of record for 9.3 and 9.6. No closing amendment follows (the record cap).

---

The amendment above carries no line cites, no hashes and no reproduced text, so there is nothing for the reviewer to recompute.

Files:
- `C:/dev/wt/b1-projection/engine/B1-PROJECTION-PREREGISTRATION.md`
- `C:/dev/spatial-ide/protocol/skp/tests/conformance/main.rs`
- `C:/dev/spatial-ide/protocol/skp/tests/conformance/README.md`
- `C:/dev/spatial-ide/protocol/skp/tests/conformance/DIVERGENCES.md`
- `C:/dev/spatial-ide/protocol/skp/tests/conformance/AMBIGUITIES.md`
- `C:/dev/spatial-ide/protocol/skp/tests/conformance/fixtures/refusals-any-layer.json`
- `C:/dev/spatial-ide/protocol/skp/tests/conformance/fixtures/requests-accept.json`
- `C:/dev/wt/b1-projection/engine/src/stream.rs` (E-15)
