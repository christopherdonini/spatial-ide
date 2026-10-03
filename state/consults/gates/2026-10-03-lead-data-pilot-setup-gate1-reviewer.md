*Custodian's filing note (2026-10-03): the gate-1 reviewer for PR #166 wrote this report to this path itself, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record (the 2026-10-03 lead-data clarification, C3) of the report as written, from this file's line 5 (the report's first line) to the end, is 0841f62ae4bbd94b5440fffb1e8d2df208b73f4022557755ed62451ebd78670e, computed by the custodian from the saved bytes. It equals the reviewer's returned sha256.*

---

VERDICT: PASS
Reviewed cut/lead-data-pilot-setup @ 629fb7f1d1a84102d9ebfb13bb7a358dbafdeede. PR #166, gate 1, reviewer.

Base af40bbff65bee300c519856a4e37625e7bca5b2f (the form's commit, an ancestor of origin/main a886bd68e5f6). Commits b238dd1, f637fe4, 629fb7f; merge-base with af40bbf is af40bbf. Worktree clean before and after. Every check below was run by my own script against `git show af40bbf:<path>` and the worktree bytes; nothing was taken from the worker's report.

## S1 — blocking

None.

Out-of-scope line read first (AUTONOMY.md §21d; Round 25 item 2): `LEAD-DATA-PILOT-SETUP-PREREGISTRATION.md` @ af40bbf names no §21a category as touched (ADR none, security none, wire none, guarantee none). Checked against the diff: no ADR file, no `protocol/` path, no product permission or audit source, no test text touched. C8 (the only security-adjacent edit) is not applied. C5 is judged under S2-1 (not a guarantee change). The line holds.

## Checklist results

**1. Byte equality (own script).**
- `.claude/agents/lead-data.md` @ 629fb7f equals `state/directives/LEAD-DATA-PILOT-2026-10-03.md` lines 20-41 @ af40bbf: `cmp` rc 0, both sha256 30969c7b59054c5df4c9e8b7508d558eda252d68a431e93869ca9069aec031f8. The pilot document is unchanged on the branch and on main: whole-file sha256 05c740f8352e6d218f920f1ccef5b8a461de9b625da768ce160c37bde0b4a962 at af40bbf, at 629fb7f and at origin/main.
- `AI_DEVELOPMENT.md` @ 629fb7f equals its af40bbf bytes, plus one LF, plus pilot lines 47-49: `cmp` rc 0, both sha256 54b0a6a82b6c36715f979cad5006a890a76451f062830c5c25c033d2210b1802. It is appended at the end, and no line above it moves.
- `engine/README.md` @ 629fb7f equals af40bbf bytes + LF + the report's section 1 fenced block: equal (true). The engine body is not edited.
- `kernel/README.md` @ 629fb7f equals af40bbf bytes with C1a, C1b, C2, C3, C4, C5, C6 and C7 applied in order (each anchor taken from the report's fenced blocks, each found exactly once at af40bbf, on a line start), + LF + the report's section 2 fenced block: whole-file equal (true). Body 280 → 342 lines; the index heading is at line 344 of 379.
- C8 is not applied. Its anchor is present exactly once on the branch, and the first line of its new text is present zero times.
- All four files are LF-only and end in exactly one LF.
- The report used for the comparison is `state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md` @ origin/main a886bd6. Hash of record recomputed over file line 5 to EOF: 160c89e1dc5a8db624c303f27e465757a404768332c50e29df8498a5d4f27e46. It matches the filing note.
- Worker report `state/consults/2026-10-03-lead-data-pilot-setup-worker-report-1.md` @ a886bd6, recomputed the same way: dd5ff6f1f5080c547edc6e407810eac2e7b00a28812c4181ff6d44a150fe9ee0. It matches.

**2. Index sections.**
- In both sections, the heading line, the blank line, the italic rule line and the following blank line equal pilot lines 55-58 byte for byte.
- Length: engine 32 lines, kernel 36 lines (≤ 60). Each file has exactly one Owner's-index heading.
- Last verified at af40bbf, a commit on main.
- Pointer resolution at af40bbf (scripted over every backticked token in both sections, plus the bare ADR, KNOWN-LIMITATIONS and SKP-V0 § references): **all resolve; none fails.** In detail:
  - **Tests.** All 34 engine and 35 kernel `file::test` pointers name a `fn` preceded by a test attribute. Each nested module named exists: `engine/src/pin.rs::tests`, `engine/src/cancel.rs::tests`, `kernel/src/skp.rs::tests`, `kernel/src/skp.rs::ticket_drop_under_lock_regression`, `kernel/src/params.rs::tests`.
  - **Files.** Every named file is in the af40bbf tree. That covers 12 engine and 15 kernel preregistrations (all of `engine/*PREREGISTRATION*.md` and `kernel/*PREREGISTRATION*.md` at af40bbf), plus `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `kernel/PERMISSION-BOUNDARY.md`, `engine/src/crs-catalog.json`, `engine/examples/make-fixture.rs`, `kernel/examples/verify-bundle.rs`, `kernel/src/bin/publish-bundle.rs` and `renderer/bundle-viewer/ceilings.json`.
  - **Constants.** All 33 engine and 11 kernel ceiling constants are declared (`const NAME`) in exactly the file named. `reader_ceilings` is `pub fn` in `kernel/src/publish/ceilings.rs`, under `pub mod ceilings`.
  - **Engine items.** Every `spatial_engine::` item is public:
    - via `pub mod` (crs, crs_catalog, identity, watch, rowgroup, lod; fixture and layout under the `fixture` feature);
    - via `pub use` (AdmissionRecord, BatchStream, TaggedBatch, BatchEnvelope, BatchSizePolicy, AdmittedProjection, ProjectionError, AdmittedPredicate, FilterError, PredicateAdmitError, TypeRefusalReason, ContentPin, CancelToken, ConnectionPool, PoolConfig, LeaseClass, SourceDescriptor, StreamStats, EngineError, and the six watch types);
    - `Dataset::` methods as `pub fn` in `engine/src/dataset.rs` or `engine/src/stream.rs` (open_cancellable, stream_with_cancel, admit_projection, stream_projected_with_cancel, stream_for_publish, pin_content, check_source_unchanged, build_index, stream_indexed_experimental);
    - `AdmittedPredicate::admit` and `lod::build_tiers` as `pub fn`.
  - **Kernel items.** Every `spatial_kernel::` item is public: SkpHost, StreamRegistry, GenerationRegistry, SessionInvalidator(::end_generation), SessionEndReason, session_end_channel, SkpHost::open_dataset and close_dataset, error_of, filter_error_of, terminal_detail_of, Catalog, EngineSourceFactory(::ticket_only), StreamParams, OPERATION, publish::preflight, publish::publish_unguarded, publish::ViewerAssets, bundle, permission::boundary::execute, permission::audit.
  - **Consumed items.** spatial_data_plane::transport's five items and `serve`, spatial_skp::v0's SkpError, DatasetSessionEnded and SKP_VERSION, and spatial_renderer::compile and canonical are all exported, and the kernel uses each at af40bbf. `ceilings.json` is `include_str!`-ed by `kernel/src/publish/ceilings.rs`. `engine/Cargo.toml` has no path dependency other than itself (dev-dependency).
  - **ADRs and SKP-V0 sections.** Every ADR number listed exists under `docs/adr/` at af40bbf. SKP-V0 §1, §5, §7, §7.5, §8 (with its `skp/0.5` entry), §9 and §9.5 exist. `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a and §2b exist.
  - **KNOWN-LIMITATIONS.** Items 2, 3, 9, 11, 19, 20, 22-27 and 5, 6, 8, 12, 16, 21, 28, 30 exist. On origin/main since af40bbf only item 30's body changed, and every item number is stable.
- No restatement: neither section restates a schema, an ADR's decision text or a limitation's text. Each line is a label and pointers. The two property labels without an item path ("No transport in this module", "No generation or session reference in a persisted artifact") label a pinned test and do not restate the governing text.

**3. Kernel README body edits against the tree at af40bbf.** I checked each factual claim against the named code and records. All hold:
- **C1a.** Orchestration covers the streamed query, `SkpHost` and `publish/`. The dataset registry is only the `Catalog` name map, and the permission subset is described in the body's absent-section bullet. No lineage or undo is implemented.
- **C1b.** The only `impl BatchSource` and `impl SourceFactory` over engine streams in the tree are `EngineSource` and `EngineSourceFactory` (`kernel/src/lib.rs`). The other impls are synthetic: `protocol/data-plane/tests/*`, and the in-module tests of `kernel/src/skp.rs`.
- **C2.** `slice-host --data` (`kernel/src/main.rs`). `SkpHost::open_dataset` mints a `DatasetHandle` and uses it as the catalog name.
- **C3.**
  - The `AdmissionMode` doc says one process never runs both modes.
  - `slice-host` builds `with_connection_reports`, which is Raw.
  - The shell builds `EngineSourceFactory::ticket_only` (`frontends/shell/src-tauri/src/lib.rs`).
- **C4.** `SkpHost` implements the five commands, mints tickets, calls `mint_for_open` per successful open, and arms the watch in `open_dataset`.
- **C5.** The table composes `(MAX_QUEUED_BATCHES + 1) × MAX_BATCH_BYTES` only. The docs of `MAX_QUEUED_BATCHES` and `MAX_ATTRIBUTE_RETENTION_FACTOR` in `engine/src/stream.rs` bound the live projected stream separately.
- **C6.** `MAX_CONCURRENT_STREAMS = 4` is declared in `protocol/data-plane/src/server.rs`, and in no `kernel/` file. `MAX_STREAM_CONNECTIONS = 4` (`engine/src/pool.rs`).
- **C7.** Checked against `GenerationRegistry` (`mint_for_open`, `live_generation`, `attribute_ticket`, `invalidate`, first mark stands, `dead_tickets`, `begin_close`, `forget_dataset`), `SessionInvalidator::end_generation` (record, then `try_send`, then `StreamRegistry::cancel`), the `StreamRegistry` no-drop-under-lock invariant, and the `SkpHost` methods:
  - `open_dataset` arms before `open_cancellable`; a pre-admission signal refuses with the recorded signal's code; ChecksOnly records the reason read by `describe`'s `coverage`.
  - `viewport_query` takes three steps: projection admitted before the filter in `build_viewport_query`, both before `open_engine_stream`'s lease and before `tickets.mint`.
  - `close_dataset` drops the watch before the unknown-dataset check, then begin_close, cancel_all_for_dataset, forget_dataset, catalog.remove.
  - `EngineSource` runs the post-check at the terminal and, best-effort, on Drop. The raw path passes `None` for the invalidator.
  - The shell builds the host with `PlatformWatch` (`cfg(windows)` arm only) and drains `session_end_channel` into `DATASET_SESSION_ENDED_EVENT`.
  - `skp.filter_type_not_admitted` is in `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` §2 (2.7).

**4. Moved cites.** `git grep` for `kernel/README.md:<digits>` (forward and backslash forms) at af40bbf finds exactly five references, all in `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md`:
- line 90, `:126-127` twice;
- line 93, `:127` (backslash form);
- line 94, `:126-127`;
- line 104, `:86`.

This matches the report's table. The 16-line shift is confirmed: the af40bbf text at lines 86 and 126-127 is byte-identical to the 629fb7f text at lines 102 and 142-143. At af40bbf, **no reference outside `state/cut-archive/` moves**. That includes the `#L` and "line N" forms, and relative `README.md:<n>` inside `engine/` and `kernel/`. No `engine/README.md:<n>` reference moves, because that file is append-only. See S2-4 for the four new references that main now carries.

**5. Size and scope.** numstat af40bbf...629fb7f: 22/0 `.claude/agents/lead-data.md`, 4/0 `AI_DEVELOPMENT.md`, 33/0 `engine/README.md`, 108/9 `kernel/README.md`. That is 167 + 9 = **176 over 4 files**, against the declared 400, and all four are Scope files. The form is not in the diff. No `scripts/`, `.claude/agents/architect.md` or `reviewer.md` path is touched. Main's 12 commits since af40bbf touch none of the four files.

**6. Suites.** Run in the worktree at 629fb7f. `scripts/` there is byte-identical to af40bbf. See Exit codes.

## Exit codes

Tool commit: the scripts as at 629fb7f1d1a8 (`git diff --quiet af40bbf 629fb7f -- scripts` rc 0). Last commits touching each:
- verify-cites.mjs 522e448d55e0
- verify-quotes.mjs f9444a4d99a9
- verify-test-claims.mjs e9735d4749f0
- verify.mjs 260720226f13
- scripts/plan + scripts/hooks 859375c979b5

| Check | rc | Result line |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1148 files; 38 loose references advised, none in the diff |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 113 checked, 82 verified, 30 baselined, 1 advisory, 0 hash-reference errors |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 483 claimed tests across 113 files |
| `node scripts/plan/verify.mjs` (verify:plan) | 0 | PASS, PLAN.yaml agrees with the repository |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | tests 415, pass 415, fail 0 |

PR #166 CI, read by run id at 2026-10-03T10:30:38Z, all on head 629fb7f:

| Run | Event | Workflow | State |
|---|---|---|---|
| 37115895429 | pull_request | Product CI — Rust workspace | completed, success |
| 37115895428 | pull_request | Governance CI | completed, success |
| 37115895587 | pull_request | Product CI — shell | completed, success |
| 37115895471 | pull_request | DCO sign-off | completed, success |
| 37115896070 | pull_request | Exposure scan | completed, success |
| 37115713333 | push | Governance CI | completed, success |
| 37115713726 | push | Product CI — shell | completed, success |
| 37115713482 | push | Product CI — Rust workspace | **in_progress** (ubuntu job passed; the windows job is still running) |

All three commits carry a Signed-off-by.

## S2 — suggestions

1. **C5 and "guarantee none".** Lead-data's question 1 put C5 in the Guarantee category. Applied, C5 narrows the README's composed table to streams with no projected attributes. It claims no figure for the projected case. My judgement is that this is not a §21a guarantee change: no code-declared bound changes, the narrowed text matches what `engine/src/stream.rs` already declared, and the recomposition (the actual declared-ceiling decision) is routed to `kernel-composed-ceiling-projected-stream` (PLAN.yaml @ a886bd6). The architect owns the §21a reading and should confirm it explicitly.
2. **C8 held.** The README body still carries the C8 anchor bullet unchanged, as well as the "no client" wording in *What is deliberately absent*. Lead-data flagged both against the shell's `binding_publish_*` seam (`frontends/shell/src-tauri/src/publish.rs` @ af40bbf). Whether that seam is a served surface is the held ADR-017/ADR-024 exposure question, which is the human's call, so I do not count it against check 3. The PR body discloses the hold. The closing record should reference the OPEN 2026-10-03 entry by its round and item once it is ruled, and note that C5 was taken where the report marked it held. That records the form's "applied as written" as amended by the custodian's answers in the filing note @ 52de9df.
3. **The AI_DEVELOPMENT.md section is stale against the clarification.** The appended section is Part 3 byte for byte, as the form requires. It still says the index update comes after a merge, and that the custodian checks that `git status --porcelain` "shows only its report file". Clarification C1 and C3 govern both points. A reader of AI_DEVELOPMENT.md alone does not see the clarification. Consider a later appended pointer to `state/directives/2026-10-03-lead-data-pilot-clarification.md`; it does not belong in this piece.
4. **Four new moving references on main.** Since af40bbf, main carries four `kernel/README.md:<line>` references outside `state/cut-archive/`: the lead-data report's section 4 table (`state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md` @ a886bd6). They describe the af40bbf file, which the report's title names, and they move with this merge as the archive's do. They are not defects of this branch. A reader should treat them as pinned to af40bbf.

## N — nits

- The filing notes' phrase "from its fifth line to the end" means the file's line 5, which is the report's title line. It does not mean the fifth line below the rule. Both hashes recompute only over file line 5 to EOF.
- The lead-data report cites the template as "Part 4, lines 55-65". Line 65 is the closing fence, and the template body is lines 55-64.
- The C6 line is 108 columns. Other README lines already exceed 100, so this is cosmetic.
- C7 says the tickets are cancelled through `StreamRegistry::cancel`, "the path a data-plane CANCEL reaches". That mirrors the `SessionInvalidator` doc at af40bbf. Strictly, the two converge at the producer's `CancelToken`, not at the same function.
- C7 says each projection or filter refusal carries its own `skp.projection_*` or `skp.filter_*` code. A residual admission-lease exhaustion during filter admission answers `engine.connections_exhausted` instead. The README says so two sections earlier, and the code does not treat that as a filter refusal.
- The engine index's ADR list omits ADR-003, ADR-009, ADR-011 and ADR-030, which `engine/src` also cites. It is a selection, and every listed ADR resolves.
- The form's 400-line budget is above §21d's template figure of 150. It rests on the round 5, item 2 count (code and tests only). This diff has zero code or test lines, so nothing is overrun.
