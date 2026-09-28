# Wave 2, W2-B (batch 2: W2-B+W2-C): the session's report

**Source:** session_016KgXBnBrqbz69oHVvQj4DS, the final assistant turn, copied at 2026-09-28T17:05:44Z with the message's own Copy action in claude.ai/code, and saved with LF line endings. Everything between the two rules below is the session's text, verbatim. The WAVE2 REPORT proper begins at `# WAVE2 REPORT`, and the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally, per `state/cloud/wave1-prompts.md` §3, carried into wave 2 by `state/cloud/wave2-prompts.md` §1. The saved text scans clean under the profile-path scanner's `--message` mode.

---

Setting up done; reading the admission code and existing tests before writing the property campaign.

Reading done; starting the engine test build (bundled DuckDB takes a while) while I draft the generators.

Build still compiling; writing the campaign test file now (seeded SplitMix64 generators, four properties, independent DuckDB-parser oracle).

P1–P4 passed cleanly (2,500 cases), but I noticed admitted predicates leaking raw file values through stream error text outside the refusal path. I'm now tracing where those errors get exposed on the wire.

I found the bug: bind admission accepts implicit coercions like `zone = 1`, which then fail mid-scan and leak file values into the terminal error. Now I'll write minimal reproducers, including a check for whether the leaked row falls outside the viewport.

Oracle sanity confirmed (it flags known escapes and passes a clean predicate); throwaway check removed. Final run, then the DCO hook proof and commit.

Hook rejected the unsigned commit (HEAD unchanged at baseline). Committing signed.

# WAVE2 REPORT
## Worker fields
**Item:** B. **Lens/purpose:** a seeded, dependency-free property campaign against ADR-021 filter admission, composed with B1's live projection.
**Baseline SHA:** d4245feaef1ed94a4947bd2b2d1df9cc91a1a610, confirmed by `git -C /tmp/wave2-baseline rev-parse HEAD` at start.
**Branch:** cloud/wave2-B. **Commits:** 576f76be6f467dc9a6aa9da10116b4d907520ffd (the one new file, `engine/tests/admission_property_campaign.rs`).
**PR:** https://github.com/christopherdonini/spatial-ide/pull/139 (draft, not merged).
**Environment:** Linux 6.18. rustc 1.94.1, cargo 1.94.1, node v22.22.2, npm 10.9.7. The only network used was crates.io, through cargo, for the build.

**Commands run:**
- `git worktree add /tmp/wave2-baseline d4245fe…` → 0; `rev-parse HEAD` → d4245fe… → 0
- `CARGO_TARGET_DIR=/tmp/wave2-target cargo test -p spatial-engine --test predicate_admission --no-run` → 0 (warm-up build)
- `cargo test -p spatial-engine --test admission_property_campaign` → 0 (campaign passes; B-1 is ignored)
- `cargo test … --test admission_property_campaign b1 -- --ignored --nocapture` → 101 (B-1 fails as designed)
- `git config core.hooksPath .githooks`, then an unsigned `git commit` → 1 ("commit has no Signed-off-by trailer"; HEAD stayed at the baseline)
- `git … commit -s` → 0; `git push -u origin cloud/wave2-B` → 0

**Campaign (seed / cases):**

| Generator | Seed | Cases | Admitted and streamed |
|---|---|---|---|
| G1 admitted grammar | 0x0b02a00100000001 | 500 | 378 |
| G2 hostile templates | 0x0b02a00200000002 | 900 | 147 |
| G3 token splices | 0x0b02a00300000003 | 900 | 122 |
| G4 ceilings | 0x0b02a00400000004 | 200 | 91 |

- The fixture is `MultiType`, 800 features, seed 0x5eed20560b020001.
- There were zero counterexamples to P1–P4 across all 2,500 cases. Every refusal carried one of the 11 named codes, admission was deterministic across three runs, the canary directory stayed empty, and no refusal text carried file data.
- I checked the composition checker separately in a throwaway test (not committed). It flags `1=1) OR (1=1`, `zone = 'x') AND 1=1 --`, a smuggled `LIMIT` and `length(zone)`, and passes `zone = 'x'`.

**Findings:** 1

### Finding B-1
**Claim:** Bind admission admits predicates that need an implicit coercion (`zone = 1`, `i64 < 0.000000000000000000000000001`, `flag = 'x'`). Instead of a synchronous typed refusal, the scan then ends in an `engine.query` terminal error, and for the first two that error's text carries a value from the file.

**Suggested severity:** S2

**Code path:**
- `engine/src/predicate.rs:1158-1162`: `bind_admit` prepares the predicate against zero rows (`LIMIT 0`) built from `CAST(NULL …)`, so the implicit cast never runs.
- `predicate.rs:1184`: the only check is that the inferred type is `Boolean`.
- `predicate.rs:190`: the predicate is admitted.
- `engine/src/stream.rs:1362ff` (`build_sql`): it is composed into the query.
- `engine/src/error.rs:326`: the DuckDB conversion error becomes `query: {d}`.
- `kernel/src/lib.rs:579-581` and `kernel/src/skp.rs:1741-1742` (`terminal_detail_of`): that text becomes the data-plane terminal frame's detail.

**Reproducer:** `engine/tests/admission_property_campaign.rs::b1_an_implicit_coercion_is_admitted_and_fails_in_the_scan_carrying_file_data`, run with `cargo test -p spatial-engine --test admission_property_campaign b1 -- --ignored --nocapture`. Observed:
- `"zone = 1" -> ADMITTED`, then `Conversion Error: Could not convert string 'civic' to INT32 when casting from source column zone`. That is feature 400's zone value.
- `"i64 < 0.000…1" -> ADMITTED`, then `Could not cast value 7459109727985099445 to DECIMAL(38,27)`. That is feature 400's raw `i64` value.
- `"flag = 'x'" -> ADMITTED`, then `Could not convert string 'x' to BOOL`.
- The test's own assertion then fails: "implicit coercions admitted by bind admission".

**Guarantee violated:**
- SKP-V0.md §7.6, stage 3: "an implicit int-to-bool (or any other) coercion is refused rather than silently accepted".
- SKP-V0.md §7.6, intro: a refused predicate "returns synchronously and typed … never as a data-plane terminal frame".
- ADR-021 Decision item 6.3, and docs/01 principle 8.
- Caveat: "(or any other)" can also be read as "any other coercion *to BOOLEAN*". Under that reading only the synchronous-refusal half holds.

**Evidence:** The campaign itself surfaced it. Six admitted predicates ended in stream errors, among them G4's `i64 < 0.000…1` (which leaked raw value 5800113866356857844) and `id < 'inf'`. The leaked values came from rows inside the viewport: the tiny test viewport contains only feature 400, so the bbox was not bypassed.

**False-positive check:**
- KNOWN-LIMITATIONS.md: searched "coercion", "implicit", "conversion", "overflow", "filter". No match; entry 8 and the entry-87 row are unrelated.
- DECISIONS-PENDING.md and PLAN.yaml: searched "coercion", "implicit", "surrogate", "bind admission", "Conversion Error". Nothing is queued or proposed.
- The existing `predicate_admission.rs` covers only the non-BOOLEAN case.

**Confidence:** proven

### Unproven observations (not findings)
- Admitted arithmetic can overflow during the scan (`(i64 - 367) * 2 …`), and the terminal error then carries a value computed from a file row. It was from an in-view row only, and no stated guarantee covers stream terminal errors.
- Every `engine.query` terminal detail repeats a slice of the internal composed SQL ("LINE 1: … FROM read_parquet(?) WHERE (…)") to the client.
- Column names are matched case-sensitively in namespace admission (`ZONE = 'residential'` is refused as unknown_column), although DuckDB itself resolves names case-insensitively. That is stricter, not a hole.
- The campaign ran only the native-identity, unordered, index-off plan. The row-group and publish (`ORDER BY`) compositions were not generated.

### Stops
None.

---

## Custodian fields (filled locally, never by the worker)

Session ID: session_016KgXBnBrqbz69oHVvQj4DS   Model: Opus 5.5, Medium (as launched)   Launched/ended: 2026-09-28T07:35Z / the report posted by about 07:54Z (its commit 576f76b at 07:53:46Z). The report was copied at 17:05Z, after the pause described in the ledger.
Spend: not individually attributable. The batch delta for the pair (W2-B+W2-C) was $8: $210 before, and $202 after, read at 17:03Z. The readings are in `state/cloud/wave2.md`.

**The PR.** W2-B opened #139 as a draft titled "Wave 2 B: filter-admission property campaign (proposal)". It carries the one new file, and every CI check on it is green. That is the one pull request its OUTPUT allowed. Fable ruled that either outcome conforms (`state/cloud/wave2-prompts.md`, Deviation 1 under W2-B). Whether it merges goes to Fable with the after-wave batch.

**Triage against main at ec2b1c3.** Findings on B1 are re-checked against main at triage time, per `state/cloud/wave2-prompts.md` §5. Over `engine/src`, `kernel/src`, `frontends/shell/src` and `frontends/shell/src-tauri/src`, `git diff d4245fe ec2b1c3` touches only `frontends/shell/src/docs/adrIndex.test.ts`, one line from #135. Every item below is therefore **still-present**.

**Finding B-1: S1 CANDIDATE.** The worker suggested S2.

*Reason.* Filter admission is one of the security properties wave 1 §4's S1 clause names. The worker's two quotations were checked against `protocol/skp/SKP-V0.md` @ ec2b1c3:
- Stage 3's sentence is at `:477-480`, and the worker quotes it verbatim.
- §7.6's opening, at `:463-469`, says a refused predicate returns synchronously and never as a data-plane terminal frame. The worker quotes that with an elision.

Bind admission accepts `zone = 1`, `i64 < 0.000000000000000000000000001` and `flag = 'x'`. Each then fails in the scan and reaches the client as an `engine.query` terminal whose text carries a value from the file. This has the same shape as A2-1, a clause kept or broken.

*Reading caveat, from the worker.* "(or any other)" can be read as "any other coercion to BOOLEAN". Under that reading, only §7.6's synchronous-refusal half is at stake. The leaked values come from rows inside the viewport, so the bbox holds. It is Fable's to weigh.

*Reproduced locally (Windows): yes.*
- **Setup:** the scratch worktree `C:/dev/wt/wave2-b` at 576f76b, the campaign commit on cloud/wave2-B, whose parent is d4245fe.
- **The campaign:** `cargo test -p spatial-engine --test admission_property_campaign` passes, with 1 test passed and 1 ignored.
- **The reproducer:** the ignored `b1_an_implicit_coercion_is_admitted_and_fails_in_the_scan_carrying_file_data`, run with `-- --ignored --nocapture`, fails as designed. It names the same three admitted predicates and the same file values (`'civic'` and `7459109727985099445`).

**Unproven observations:**
1. Carried with B-1 as a scope note, not a separate item. When admitted arithmetic overflows in the scan, the terminal error carries a value computed from a file row. The mechanism is the same: a runtime failure after admission, with file-derived text in the terminal detail.
2. Carried with B-1 as a scope note, not a separate item. Every `engine.query` terminal detail repeats a slice of the composed SQL. Any fix to B-1's terminal text meets this too.
3. DISCARD, S3. Namespace admission is case-sensitive, which is stricter, not a hole. It agrees with W2-A1's and W2-A2's `ID` observations.
4. Kept as evidence, no severity. The campaign covered only the native-identity, unordered, index-off plan.

**The campaign's negative result stays here as evidence:**
- 2,500 seeded cases across G1 to G4, with seeds in the report;
- zero counterexamples to P1 to P4.
