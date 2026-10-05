*Custodian's filing note (2026-10-05): the architect's draft of `b1-engine-kernel-half-followups`'s preregistration, on the custodian's brief. Drafting is the architect's by question round 43, item 2. This is the lead-data second pilot's measured piece 2, so the brief named the impact read `state/consults/2026-10-05-b1-engine-kernel-half-followups-impact-read.md` (sha256 64261f6e), and the draft's part 4 lists the pointers it used, found wrong and found missing. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is f6d42b99fe91804125317fdd3dc4fa3e42b983b82ab6adabdeeb7f731ecc81b3. Write audit PASS: zero write calls (Read 35, Grep 12, Glob 1, SubagentHandback 1). The run lasted 2026-10-05T12:15:03.437Z to 2026-10-05T12:24:34.250Z (179,997 subagent tokens, 49 tool uses, 570,825 ms, from the harness's task notification). C3: the main checkout's porcelain held only its two pre-existing untracked items before and after, and main stayed at b438c587, the commit the draft says it read. Checked by the custodian before the form's commit: c9ec02e (c9ec02e32cb36a64a446424f6db2f4584cacdefc) is an ancestor of origin/main. The form as committed differs from part 2's block only by the computed pin hashes, by the §9 comma cite of the two kernel publish lines, written as a reference to §2's seam paragraph, as part 3 asks, and by two path-less pins in §2 (lines 2915 and 2324-2329) given their file, engine/src/stream.rs, so that they can be hashed.*

---

Reviewed: main @ b438c587

## 1. Which record and form, and why

- **The record.** This piece gets its own preregistration. It does not go in B1's form. Amendment 12 closes B1's form to further additions before B1's close (`engine/B1-PROJECTION-PREREGISTRATION.md:783 @ b438c587 sha256:HASH-TBD`), and B1 has not closed: the shell half is still open. Putting this piece's test and doc edits into B1's form would be an addition to a closed form.
- **The form is the full form, with full gating from dispatch.** Three separate reasons each require it:
  1. **Size (§21c).** Counted by §21c's rule, tests included, the piece comes to about 350 changed lines across 4 files. That is over the 150-line bound.
  2. **A §21a guarantee.** The piece adds a proof of, and rewrites the doc text of, the retention bound. That bound is a property currently under test (condition (3); ADR-010 rule 6).
  3. **A §21a wire path.** D6's clause lands in `protocol/skp/SKP-V0.md`, which is under `protocol/skp/**`.

  Because of reasons 2 and 3, the `Out-of-scope` line could not claim that the piece touches none of the four categories. So under §25(e), and round 25 item 2 (e), no five-line form may be committed for it.
- **Where the file goes:** `engine/B1-FOLLOWUPS-PREREGISTRATION.md`. The node is in the engine lane, the precedent is that a module's forms live in that module, and the new test lives in `engine/src/stream.rs`. It is committed on main now, before any code. Set the node's `gate` field to it only after that commit.
- **Nothing here needs the human.** The red lines (`AI_DEVELOPMENT.md:451-454`) are not reached:
  - D6 enters as an appended dated note with no literal change.
  - The split of the recorded-mutation comments between the two nodes follows both nodes' existing summaries, so neither node's ruled scope changes.

## 2. The draft

```
# B1 engine-kernel half's routed items (gate 3): publish's retention flag proven through flush, and the doc and record nits — preregistration

## Header

- **Status.** The preregistration of PLAN node `b1-engine-kernel-half-followups`. Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form and full gating from dispatch (AUTONOMY §21a; §21c, about 350 lines counted with tests; §25(e): the piece touches a stated guarantee's proof and doc text, and `protocol/skp/**`). No five-line form exists for this piece.
- **Authority:**
  - PLAN node `b1-engine-kernel-half-followups`, placed by question round 31, item 1 (RULED 2026-09-30).
  - Drafting by the architect: question round 43, item 2.
  - Routed by B1's gate 3: `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md` (E2, D2–D6, the supplementary mutation S1) and `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md` (its §3 E-15 note, §4 doc nits, Other notes).
  - The owner's-index update: `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1, item 2.
- **Why not B1's form.** Amendment 12 closes it to further additions before B1's close (`engine/B1-PROJECTION-PREREGISTRATION.md:783 @ b438c587 sha256:HASH-TBD`). This form amends nothing in it.
- **Drafted by** the architect agent, on the custodian's brief. Inputs: lead-data's impact read (`state/consults/2026-10-05-b1-engine-kernel-half-followups-impact-read.md`, read at e29c6f86) and a re-read of `main` at b438c587. Read-only; the architect ran no command.
- **Reference form.**
  - Code and records at main are pinned `path:line @ b438c587 sha256:<hex>`. b438c587 is on main.
  - A pin is historical. It is authoritative for the defect it names. The tree at the branch's base is authoritative for the edit, and the worker re-derives every site before editing (template §0).
  - Self-references are by section and item. The ledger is cited by round and item.
- **Branch.** `cut/b1-engine-kernel-half-followups`, cut from `main` when a slot frees. It merges by a merge commit, never a squash, because T1's recorded-mutation comment names a branch commit (§4).

## §0. Disclosure

- Read: the impact read; the node and `kernel-close-races-followups` in PLAN.yaml; both gate-3 reports; B1's form (Header, §7–§9, Amendments 9–12); AUTONOMY §21–§21d and §25; the template, Round 25 additions included; the portability directive §2; the code sites cited below.
- **Gate-3 reports in conflict on E-15.**
  - The architect's note says E-15's doc describes a row-count failure path that does not occur (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:108 @ b438c587 sha256:HASH-TBD`).
  - The reviewer's row 9.6(a) records E-15 failing at `c9ec02e`'s stream.rs line 2669 with left 5000, under a full-length copy realized through `Buffer::ptr_offset` (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:83 @ b438c587 sha256:HASH-TBD`).
  - Amendment 10 makes the reviewer's report the observation of record for 9.6 (`engine/B1-PROJECTION-PREREGISTRATION.md:772 @ b438c587 sha256:HASH-TBD`). This form follows the observation of record (§2, item E-15).
- **Not carried** (not routed to this node): the gate-3 architect's SKP-V0 §4 item 3 nit, and its §9 suites note.

## §1. What this preregistration may and may not claim

- **No performance number.** No timing assertion, no `docs/08` row (docs/01 principle 8). This follows the precedent of round 25, item 1: assert the property, never a budget that docs/08 does not declare.
- **No wire change.** The SKP-V0 note (§2, D6) adds no literal, key, value, code or command. `protocol/data-plane/` stays empty.
- **No product behaviour change.** Product (non-test) source changes only in `//` and `///` comment lines.
- **No new operator-visible text.** No ADR-018 vocabulary.
- **ADRs cited, none amended.** Cited: ADR-004 (copy-minimized), ADR-010 rule 6, ADR-017 §12. ADR-023 is Proposed and binds nothing; it is cited only as the source of B1's condition (3).

## §2. The change

### E2: publish's flag proven through `flush` (one new test, T1)

**The path T1 proves.**
- `StreamPlan::for_publish` declares `compact_attribute_retention: false` (`engine/src/stream.rs:610 @ b438c587 sha256:HASH-TBD`).
- `Dataset::stream_for_publish` passes that plan to `stream_inner` (`engine/src/stream.rs:940 @ b438c587 sha256:HASH-TBD`).
- `flush`'s single-run arm hands the flag to `single_run_retention` (`engine/src/stream.rs:2434-2435 @ b438c587 sha256:HASH-TBD`).
- Today the only proof stops at the constructor (`engine/src/stream.rs:2900 @ b438c587 sha256:HASH-TBD`, `:2915 @ b438c587 sha256:HASH-TBD`).

**T1.**
- Name: `a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush`.
- Placement: in `engine/src/stream.rs`'s `mod tests`, under `#[cfg(feature = "fixture")]`.

**Seam (the real shape).** T1 makes the same two calls the kernel makes:
- `Dataset::resolve_projection` (`kernel/src/publish/mod.rs:493 @ b438c587 sha256:HASH-TBD`);
- `Dataset::stream_for_publish` (`kernel/src/publish/mod.rs:716 @ b438c587 sha256:HASH-TBD`).

T1 calls them with `ViewportQuery::all()` and `CancelToken::new()`. It never builds a `StreamPlan` or calls `stream_inner` itself.

**Fixture.**
- Built with `write_geoparquet` in the temp dir: `AttributeMode::MultiType`, `CrsMode::DeclaredLv95`, `features` ≤ 20 000.
- Projection `zone, text`. `zone` is Utf8 with NULLs (`engine/src/fixture.rs:182 @ b438c587 sha256:HASH-TBD`). `text` is about 1 KiB per row (`engine/src/fixture.rs:422 @ b438c587 sha256:HASH-TBD`).
- The worker picks `features` and `avg_vertices` so that publish's size cut (`engine/src/stream.rs:412-425 @ b438c587 sha256:HASH-TBD`) lands batches inside one DuckDB chunk. That is H1 in §5.
- The fixture is hashed before and after the run, as the live text test does.

**Where T1 observes the kept run.**
- It reads the producer's queued `Item`s in-module from `BatchStream`'s private `rx` (`engine/src/stream.rs:742 @ b438c587 sha256:HASH-TBD`), before `write_ipc_into` runs.
- This is the live text test's route (`engine/src/stream.rs:3046 @ b438c587 sha256:HASH-TBD`).
- Decoded IPC cannot show retention (`engine/src/stream.rs:2994-2997 @ b438c587 sha256:HASH-TBD`).

**T1's assertions.**
- Every row is seen exactly once.
- For each projected column, at least one queued batch carries that column as an array that `retain_or_compact_single_run` would compact. That is, its return is not `Arc::ptr_eq` to the emitted array: the emitted array is a slice that retains more than the live allowance, and publish's `flush` kept it uncompacted.
- A compacted or concatenated array is tight, so it would come back pointer-equal. Under S1 no column satisfies the assertion.
- The failure message names the column. It states that publish's `flush` compacted every over-allowance run, or that the fixture has no such run.

**Recorded-mutation comment.** T1 carries one, naming the branch commit it was observed at (§4).

### Doc nits in `engine/src/stream.rs`

For every item below, the content is binding and the wording is the worker's.

- **D3, nullable-only wording.** Each site is reworded so that the H3 byte difference is attributed to a sliced bitmap's padding bits. Each site names both observed shapes: a nullable Utf8 run carrying a NULL (Amendment 5, row 5.1), and a non-null Boolean's values bitmap (Amendment 8's class-2 row). Sites:
  - `flush`'s route-(a) comment: `engine/src/stream.rs:2429-2433 @ b438c587 sha256:HASH-TBD`;
  - E-15's doc: `engine/src/stream.rs:2756-2759 @ b438c587 sha256:HASH-TBD`. E-15's own claim stays: its non-null `Int64` run has no bitmap, which is why byte identity is true for it;
  - a third site, not named by the gates and the same defect in the same file: `StreamPlan::compact_attribute_retention`'s doc, `engine/src/stream.rs:585-590 @ b438c587 sha256:HASH-TBD`.
- **D3, the overgeneralized rule.** These sites state a general rule over byte-aligned offsets:
  - `engine/src/stream.rs:91-97 @ b438c587 sha256:HASH-TBD`;
  - `engine/src/stream.rs:2360-2366 @ b438c587 sha256:HASH-TBD`.

  Each is reduced to the observed cases. The bytes differed for nullable Utf8 at the R-E1 shape, and for Boolean at 8/3, 0/10 and 40/20. They were equal at 3/5. Each site says no rule over offsets is claimed. Neither site states the reviewer's padding-bit mechanism as fact.
- **D4, the misplaced doc.** The doc block on `single_run_retention` currently carries `retain_or_compact_single_run`'s doc (`engine/src/stream.rs:2311-2323 @ b438c587 sha256:HASH-TBD`). That doc moves onto `fn retain_or_compact_single_run` (`engine/src/stream.rs:2338 @ b438c587 sha256:HASH-TBD`). `single_run_retention` keeps `:2324-2329 @ b438c587 sha256:HASH-TBD`.
- **The architect's relative clause.** In `engine/src/stream.rs:2327-2329 @ b438c587 sha256:HASH-TBD`, the clause about never entering the compacting branch is reattached to every plan but the live projected stream's. The rewritten text may name T1 as the proof for publish.
- **"this function's" in the const doc.** At `engine/src/stream.rs:99-102 @ b438c587 sha256:HASH-TBD`, the phrase names `retain_or_compact_single_run`'s compacting branch instead. The publish claim may name T1.
- **E-15's Mutation paragraph** (`engine/src/stream.rs:2763-2765 @ b438c587 sha256:HASH-TBD`).
  - Its failure path stays: it is the one observed (§0).
  - It gains a recorded-mutation line naming:
    - the realization (a full-length copy through `Buffer::ptr_offset`);
    - the commit `c9ec02e`;
    - the observer (B1 gate 3's reviewer, row 9.6(a));
    - the failing assertion, by its message as at `c9ec02e`, with left 5000.
  - Before writing, the worker resolves that line 2669 of `engine/src/stream.rs` at `c9ec02e` lies in E-15's `compacted.len()` assertion, and copies that assertion's message from `c9ec02e`.
- **Recorded-mutation comments** in this file: rows S-1 and S-2 of §4.

### Recorded-mutation comments in `kernel/tests/skp_projection.rs`

Rows K-1 to K-8 of §4. Each comment that has no commit gains the commit it is re-observed at. Each bare self-line becomes the failing assertion's message, with no line number. The mutation text is unchanged.

### D6: one scoping clause, in `protocol/skp/SKP-V0.md`

- **Placement.** One dated note, no literal change, appended at the end of §8, after the dated note at `protocol/skp/SKP-V0.md:969-977 @ b438c587 sha256:HASH-TBD`. §8 is append-only from `protocol/skp/SKP-V0.md:541-544 @ b438c587 sha256:HASH-TBD`.
- **Content (binding; wording the worker's).**
  - The `skp/0.6` fixture-commit lists name the version's two-sided wire fixtures: `protocol/skp/tests/data/*.json`, with `fixtures.rs` and `fixtures.test.ts`. The lists are at:
    - §4 item 13: `protocol/skp/SKP-V0.md:303-311 @ b438c587 sha256:HASH-TBD`;
    - §8's `skp/0.6` Mechanics: `protocol/skp/SKP-V0.md:917-921 @ b438c587 sha256:HASH-TBD`;
    - §9.1: `protocol/skp/SKP-V0.md:987-990 @ b438c587 sha256:HASH-TBD`;
    - `SKP_VERSION`'s doc: `protocol/skp/src/v0/mod.rs:66-69 @ b438c587 sha256:HASH-TBD`.
  - The conformance suite's spec-derived fixtures under `protocol/skp/tests/conformance/` are outside those lists. They were updated for `skp/0.6` in `c9ec02e` (B1 §10, Amendment 9).
  - No literal, key, value, code or command changes. `protocol/data-plane/` has an empty diff.
- **Not edited.** None of the four list sites, and nothing above §8's end.

### D2 and A9: no edit (defects absent at main)

- **D2.** The header no longer credits `37b3644`. It names the `5d4da4d` run, and its `skp/0.6` line credits no commit (`protocol/skp/tests/conformance/DIVERGENCES.md:3-6 @ b438c587 sha256:HASH-TBD`). The cancel-state piece rewrote it (`protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, Amendment 2, item 2). The wrong-commit credit D2 named is gone.
- **A9.** The text that `skp/0.6` has since merged is true at main (`protocol/skp/tests/conformance/AMBIGUITIES.md:17 @ b438c587 sha256:HASH-TBD`). B1 merged at `d6ec85a` (B1 §10, Amendment 11).

### Owner's index (`engine/README.md`, applied in the PR, lead-data's text)

- Owner's index, Last verified at: `engine/README.md:499 @ b438c587 sha256:HASH-TBD`.
- Interfaces → Publish stream and content pin, which gains T1 as a pin: `engine/README.md:505 @ b438c587 sha256:HASH-TBD`.
- Governed by → preregistrations in this module, which gains this form: `engine/README.md:518 @ b438c587 sha256:HASH-TBD`.
- No change to `kernel/README.md`'s index: the kernel edits are comments only, and no pointer moves.

### Node split with `kernel-close-races-followups`

- **This node carries** every B1 recorded-mutation comment in `engine/src/stream.rs` and `kernel/tests/skp_projection.rs` that names no commit or carries a bare self-line (§4, S-1, S-2, K-1 to K-8). That discharges the `skp_projection.rs` half of `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` Amendment 1, item 1.4.
- **`kernel-close-races-followups` keeps** `kernel/tests/wire_bytes_invariant.rs:368-372 @ b438c587 sha256:HASH-TBD`. Only that node's summary names that file.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** no semantics change.
- **R2 and R4:** no `cfg`. T1 uses `std::env::temp_dir()` and no path literal.
- **R5:** no level claim.
- **R6:** no new ignore.

### KNOWN-LIMITATIONS

No item is owed. No user-visible behaviour changes and nothing is reduced.

## §3. Fixtures, with predicted outcomes

| Fixture | Prediction |
|---|---|
| T1's MultiType file (spec stated in T1) | Every row seen once. Each of `zone` and `text` has at least one queued batch whose array the live rule would compact. The file's sha256 is unchanged across the run. |

## §4. Tests, and the mutation per new test

Every mutation is applied, the named test is run, the failure is recorded by name with its commit, and the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is an observation.

| Row | Test | Mutation | Observed at |
|---|---|---|---|
| T1 (new) | `a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush` | M-E2, gate 3's S1: `flush`'s single-run arm passes `true` in place of the plan's flag (`engine/src/stream.rs:2435 @ b438c587 sha256:HASH-TBD`). This is the mutation T1 is declared to kill, so S1 is killed by T1. | The branch commit, named in T1's comment. Re-made at the gate. |
| Supplementary (gate only, not a comment) | `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` | M-E2′: `flush` passes `false`. This is the other direction of ignoring the flag. | The reviewer's report. |
| S-1 | `a_non_dictionary_chunk_column_passes_through_the_decode_step_unchanged` | As written at `engine/src/stream.rs:2601-2604 @ b438c587 sha256:HASH-TBD`. Gains a commit; the bare `:2419` is dropped. | `b438c587` |
| S-2 (D5) | the live text test | As written at `engine/src/stream.rs:3001-3004 @ b438c587 sha256:HASH-TBD`. Gains a commit. | `b438c587` |
| K-1 | the wire-fixture projection test | `kernel/tests/skp_projection.rs:151-154 @ b438c587 sha256:HASH-TBD`; no commit | `b438c587` |
| K-2 | same (X11) | `kernel/tests/skp_projection.rs:155-158 @ b438c587 sha256:HASH-TBD`; no commit | `b438c587` |
| K-3 | K-4's test | `kernel/tests/skp_projection.rs:365-370 @ b438c587 sha256:HASH-TBD`; bare `:275` | `b438c587` |
| K-4 | `every_projection_refusal_matches_its_committed_error_fixture_shape` | `kernel/tests/skp_projection.rs:583-587 @ b438c587 sha256:HASH-TBD`; no commit | `b438c587` |
| K-5 | the placeholder-text test | `kernel/tests/skp_projection.rs:917-922 @ b438c587 sha256:HASH-TBD`; no commit | `b438c587` |
| K-6 | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` | `kernel/tests/skp_projection.rs:1003-1007 @ b438c587 sha256:HASH-TBD`; bare `:384` | `b438c587` |
| K-7 | `a_projection_composes_with_a_filter` | `kernel/tests/skp_projection.rs:1247-1250 @ b438c587 sha256:HASH-TBD`; bare `:479` | `b438c587` |
| K-8 | `publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text` | `kernel/tests/skp_projection.rs:1399-1403 @ b438c587 sha256:HASH-TBD`; bare `:578` | `b438c587` |

**How the `b438c587` rows are made.** On a `git archive b438c587` export with its own `CARGO_TARGET_DIR`, with engine runs using `--features spatial-engine/fixture`. The test code there equals the branch's, because only comments differ. Each rewritten comment records the message observed.

**Declared unchanged:** the commit-named comments, all already framed as historical:
- `engine/src/stream.rs:2628-2634 @ b438c587 sha256:HASH-TBD`;
- `engine/src/stream.rs:2861-2864 @ b438c587 sha256:HASH-TBD`;
- `engine/src/stream.rs:2936-2939 @ b438c587 sha256:HASH-TBD`;
- `kernel/tests/skp_projection.rs:1115-1119 @ b438c587 sha256:HASH-TBD`;
- `kernel/tests/skp_projection.rs:1456-1461 @ b438c587 sha256:HASH-TBD`.

## §5. Predictions · declared unchanged · invalidators · falsification

- **H1 (a hypothesis).** Under `BatchSizePolicy::publish()` over T1's fixture, at least one batch per projected column is a single run inside a larger DuckDB chunk, with retention over the live allowance. Discriminator: T1 passes at the branch head.
- **P1.** T1 passes at head and fails under M-E2 by its per-column assertion.
- **P2.** Every row S-x and K-x fails its test by name at `b438c587`.
- **P3.** The workspace suite is main's plus one test (T1), with no other outcome changed.
- **Declared unchanged:**
  - every non-comment line outside `mod tests` and `kernel/tests/`;
  - every existing assertion, `expect` message, fixture and test name;
  - publish bytes (ADR-017 §12; `kernel/tests/publish.rs:284 @ b438c587 sha256:HASH-TBD` unchanged and passing);
  - `MAX_QUEUED_BATCHES`'s doc (`engine/src/stream.rs:67-79 @ b438c587 sha256:HASH-TBD`);
  - `DIVERGENCES.md`, `AMBIGUITIES.md` and `v0/mod.rs`;
  - SKP-V0 above §8's end;
  - `Cargo.lock`.
- **Invalidators (stop and return to the architect; nothing is adjusted to pass):**
  - H1 fails for every fixture within the bounds above. Do not add a hook, change the policy, or build a plan in the test.
  - Any product non-comment line must change.
  - An existing assertion must change.
  - A row S-x or K-x survives at `b438c587`. Its comment is left as it is, and the survival is a finding.
  - `c9ec02e`'s line 2669 is not E-15's length assertion.
  - `c9ec02e` is not an ancestor of main.
- **Falsification.** Publish's flag can be shown to reach `flush` only through a path that the kernel's call does not take.

## §6. Instruments

All are assertions: a pointer identity over the retention decision, a row count, and a file hash. None is a measurement. No counter or accessor is added.

## §7. Declared values and ceilings

- No constant is added or changed. `MAX_ATTRIBUTE_RETENTION_FACTOR`, `MAX_QUEUED_BATCHES`, `PUBLISH_PARTITION_TARGET_BYTES` and `PUBLISH_PARTITION_ROWS` are unchanged.
- **Line budget, by §21c's rule** (insertions plus deletions, tests included; this form and generated files excluded):

  | File | Ceiling |
  |---|---|
  | `engine/src/stream.rs` | ≤ 230 |
  | `kernel/tests/skp_projection.rs` | ≤ 100 |
  | `protocol/skp/SKP-V0.md` | ≤ 12 |
  | `engine/README.md` | ≤ 10 |
  | **Total** | **≤ 360 over these 4 files** |

- **Counting command, at a named commit:** `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- engine/src/stream.rs kernel/tests/skp_projection.rs protocol/skp/SKP-V0.md engine/README.md`.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. A non-comment change to any product (non-test) line.
2. A new `pub` or `pub(crate)` item, accessor, option, callback or code path (the caller rule).
3. An existing test's assertion, message, fixture or name changed.
4. A path in the diff outside the four in §7 and this form. A diff under `protocol/data-plane/`, `protocol/skp/src/` or `protocol/skp/tests/` is shown empty.
5. In SKP-V0, anything beyond one dated note appended at §8's end, or any change to a literal, key, code or command.
6. "zero-copy" anywhere (ADR-004).
7. A performance number, a timing assertion or a docs/08 row.
8. A rewritten recorded-mutation comment without the commit it was observed at, or with any line number. A record that calls a `verify-mutation` run an observation.
9. T1 reading retention from decoded IPC, building a `StreamPlan`, or entering anywhere but `Dataset::stream_for_publish` (the seam rule).
10. A doc that states a rule over bitmap offsets beyond the observed cases, or that calls publish's bytes anything but equal to main's by construction.
11. An edit to an ADR, to B1's form, to the cancel-state form or to the close-races form.
12. An edit to a comment §4 declares unchanged, or to `kernel/tests/wire_bytes_invariant.rs`.
13. A record hash at a branch commit. A test-text span named without its commit id (round 25, item 2 (d)).
14. A new `cfg`, platform ignore or path literal (portability R4 and R6).

## §9. Gates

- **Architect** (full gating):
  - §8, item by item;
  - the seam against `kernel/src/publish/mod.rs:493,716` at the branch's base;
  - D6's note against §8's append-only rule;
  - verbatim quotes and discharge claims resolved;
  - the round-25 checks: class 8 against §7; class 9 for any addition; the mutation wording; test-text spans.
- **Reviewer:**
  - the full diff with `origin/main...HEAD`, with `protocol/data-plane/`, `protocol/skp/src/` and `protocol/skp/tests/` shown empty;
  - §7's count by its command;
  - M-E2 and M-E2′ re-made;
  - every row S-x and K-x re-made at `b438c587`;
  - E-15's `c9ec02e` resolution checked;
  - every hash recomputed;
  - the owner's-index rows checked against the diff.
- **Suites, green before either gate:**
  - `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --check` and `clippy`;
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`;
  - `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
  - CI green at the reviewed commit.
  - There is no shell diff; the shell suites run in CI only.
- **Operator:** none.
- **PR body:** asks for a merge commit, never a squash, and names T1's comment's branch commit.

## §10. Amendments

*(Opens empty; append-only.)*
```

## 3. OPEN items

None waits on the human. Three notes for you:

- **D6 has a fallback.** If you would rather the piece not touch `protocol/skp/**` at all, the alternative is to record the gate-3 architect's reading in this form only and drop the SKP-V0 note. That leaves the lists unscoped wherever a reader meets them, and the form stays full either way because of the size and guarantee reasons. I recommend the appended note as drafted. If a slot opens before you decide, nothing waits on this.
- **The 90-minute PLAN budget is at risk.** The piece needs 10 comment re-observations plus T1's runs, under full gating. That is yours to re-budget; it is not class 8, which reads only §7.
- **A finding in the B1 record, outside this piece.**
  - The gate-3 architect's 9.6(a) conditions 2 and 3 forbid recording the failure at E-15's own assertion (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:101-106 @ b438c587 sha256:HASH-TBD`).
  - The reviewer's row records exactly that (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:83 @ b438c587 sha256:HASH-TBD`).
  - B1's form is closed and the record cap holds, so this is a ledger note at most. This form follows the observation of record.
- **For you to check before committing the form:**
  - that `c9ec02e` is an ancestor of `origin/main`;
  - the hashes, all marked HASH-TBD;
  - the comma cite `kernel/src/publish/mod.rs:493,716` in §9, which is not in pin form. Make it two pins, or replace it with the two pinned cites already given in §2's seam paragraph.

## 4. Files read, and the impact read's pointers

**Files read:**
- the impact read, in full;
- `PLAN.yaml` 2845-2884 and 3080-3104;
- both gate-3 reports, in full;
- `engine/B1-PROJECTION-PREREGISTRATION.md` 1-30, 320-399 and 720-839;
- `AUTONOMY.md` 306-385 and 476-487;
- `docs/PREREGISTRATION-TEMPLATE.md`, in full;
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`, in full;
- `state/directives/PORTABILITY-2026-09-30.md`, in full;
- `DECISIONS-PENDING.md` 627-636 (round 25);
- `AI_DEVELOPMENT.md` 451-467;
- `docs/adr/ADR-018-what-cancellation-acknowledged-means.md` 1-12;
- `engine/src/stream.rs` 60-109, 349-439 (grep), 570-617, 741-742, 900-944, 995-1144, 2290-2459 and 2549-3088;
- `engine/src/fixture.rs` (grep);
- `engine/tests/publish_stream.rs` 20-49, 400-444, and grep;
- `engine/README.md` 410-434 and 495-528;
- `kernel/src/publish/mod.rs` 706-721, and grep for `resolve_projection`;
- `kernel/tests/skp_projection.rs` (`RECORDED MUTATION` grep, -A6);
- `kernel/tests/wire_bytes_invariant.rs` (same grep);
- `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` (grep), 386-399;
- `protocol/skp/tests/conformance/DIVERGENCES.md` 1-12;
- `protocol/skp/tests/conformance/AMBIGUITIES.md` 15-18;
- `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md` 94-103 and 270-281;
- `protocol/skp/SKP-V0.md` 298-313, 536-547 and 905-994;
- `protocol/skp/src/v0/mod.rs` 50-85.

**Pointers used** (each checked at b438c587):
- 1.1: all.
- 1.2: :2374-2385, :2434-2441 and :2330-2372.
- The live test: :3005-3007, :3046 and :2994-2997.
- 1.4: all, including the third nullable site at :586-587.
- 1.5: all.
- 1.6: DIVERGENCES :3-6, AMBIGUITIES :17 and the four list sites.
- The cancel-state rewrite: :98-100 and :277.
- §2: `kernel/src/publish/mod.rs:493` and `:716`; `engine/README.md:499`, `:505` and `:518`.
- `PLAN.yaml:3098`.
- §3: SKP-V0 :541-544; B1 :783 and :21.
- Questions 1-5: all.

**Pointers found wrong:** none beyond the disclosed `:917-921` range, which ends at `:922`.

**Pointers missing:**
- `kernel/tests/wire_bytes_invariant.rs:368-372`: a B1 comment with no commit and a bare `:350`, inside the very claim the read cites at `PLAN.yaml:3098`.
- The gate-3 reviewer's row 9.6(a) (`…gate3-reviewer.md:83`), which contradicts the architect's E-15 note (`:108`) that the read did point to. It is needed for question 5.
- The batch policy that decides question 2's crux, whether a publish batch can be a single run:
  - `BatchSizePolicy::publish()` (`engine/src/stream.rs:412-425`);
  - `PUBLISH_PARTITION_TARGET_BYTES` (`:125`);
  - `PUBLISH_PARTITION_ROWS` (`:165`).
- `BatchStream`'s private `rx` field (`engine/src/stream.rs:742`), the in-module observation route. The read gave only its use at `:3046`.
- `engine/src/fixture.rs:422` (`text`, about 1 KiB per row), which bears on T1's fixture shape.
- SKP-V0 §8's last dated note (`protocol/skp/SKP-V0.md:969-977`), the precedent that answers question 4.
- The kernel/README index has no pointer to check: I relied on the read's statement that `kernel/README.md:361` is unaffected, and did not read it.
