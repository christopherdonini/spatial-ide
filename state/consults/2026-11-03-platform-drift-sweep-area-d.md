*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/DRIFT-SWEEP-AREA-D-2026-11-03.md` (9536 bytes, sha256 00a0afdfc226e132736d0ddf4f3617a263e24f7717e9447f11643e40091a70ef), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_01KQt7ZFjTf94GNCxXbmd28r, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high), US$ 14.14, about 999 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. No cloud filing answers this area's question (the engine and kernel module docs and READMEs). By the ruling (item 2), it is triaged as on 2026-10-10: its findings are re-derived by script before any node rests on them.*

---

# Drift sweep area D, 2026-11-03 (advisory chat)

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01KQt7ZFjTf94GNCxXbmd28r) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 999 s active, US$ 14.14. Nothing below this line is edited.

---

I'll start by cloning the repository and checking the commit.

-----

The head matches the given commit. Let me map the area D material.

-----

Let me read the two kernel documents first.

-----

All engine index pointers resolve. Now the kernel README's pointers.

-----

**Repository:** https://github.com/christopherdonini/spatial-ide — **Area D** (engine and kernel module docs, the READMEs, `kernel/CANCELLATION-AND-TRACING.md`, `kernel/PERMISSION-BOUNDARY.md`) — **commit swept: 652752afa9bedb0172948869c9ab7f0b8ee08dd3** (head of main at checkout; matches the commit named for this run).

Method: cloned, read the four named documents and every module header under `engine/src` and `kernel/src` (plus `publish-bundle.rs`, `main.rs`), and checked each ceiling constant, each pinned test name in both owner's indexes (all 110 resolve), each CLI flag, each status line of ADR-001…036, and each cross-module claim against the code on both sides. Old-path cites to moved forms (`engine/X-PREREGISTRATION.md` → `governance/forms/…`) are resolved by design through `governance/MOVED.tsv` (piece F's form §2.3, "no record edited"), so they are not reported.

## Findings

**1. `kernel/README.md:103-116` — the admission-class composition claim is stale since the Table landed.**
Claims: the shell's three tile admissions plus "the one baseline (non-tiled) viewport query — `3 + 1 = 4` — cannot collide at this class", so "in the shipped shell this class therefore never refuses, so a per-tile filter admission is never lost to a lease."
Code: `frontends/shell/src/table/tableSource.ts:131` issues a filtered `viewport_query` (milestone 4 PR C, #253, 2026-10-25); the shell's own retry comment, `frontends/shell/src/streaming/tileViewportStreamManager.ts:310-317`, now says "the table adds one admission and one stream, so three tiles plus the table plus an export can reach it"; `KNOWN-LIMITATIONS.md:444-446` (item 56) records the refusal as a shipped limit. `engine/src/pool.rs:113-123` carries the same "in that composition this class is never the thing that refuses" sentence. The kernel README (written 2026-09-14, f16fb3a1) was not among PR C's edits.
Why it matters: this is the one file the repository says is "entitled to know both sides", and it tells a reviewer a refusal the shell now has a retry and a KNOWN-LIMITATIONS item for cannot happen.
Confirmed (both sides in the tree; I did not run the shell).

**2. `kernel/README.md:120-135`, `engine/README.md:329-340`, `engine/src/pool.rs:66-69` — "unreachable on the natural-completion path" no longer holds for the shipped shell.**
Claims: because `MAX_STREAM_CONNECTIONS` equals the binding's `MAX_CONCURRENT_STREAMS` (4), `ConnectionsExhausted { class: "stream" }` "cannot be reached in composition" except through the cancel-path lease race.
Code: a Pending ticket holds its stream lease *before* the data plane admits it (`kernel/src/skp.rs:87-93`, `:121-123`), and a publish leases `Class::Stream` without passing the data plane at all (`engine/src/dataset.rs:2180-2186` via `stream_for_publish`); the shell now demands up to five at once — three tiles, the Table, an export — which `KNOWN-LIMITATIONS.md:445` states plainly ("Together they can leave a request refused … `engine.connections_exhausted`").
Why it matters: the paragraph routes the whole question to ADR-014 as a cancel-ordering problem, so a reader would look for a race where the plain count already exceeds the pool.
Confirmed on the premise (both lease sites and KL 56 are in the tree); the five-way concurrency itself is the repository's statement, not something I ran.

**3. `engine/README.md:445-446` — restates the withdrawn ADR-017 §15 sentence.**
Claims: "The size ceiling is also what bounds cancellation: **the uninterruptible window is one partition's encode and write.**"
Code: `engine/src/stream.rs:119-126` says "This comment used to end 'the uninterruptible window is one partition's encode and write'" and withdraws it (717ff9c3, 2026-08-07, a day after the README line, be44abdf); `kernel/src/publish/mod.rs:111-151` chunks the write at `PUBLISH_WRITE_CHUNK_BYTES` with a cancel check per chunk; ADR-017 Corrigendum 4 (`docs/adr/ADR-017-…md:1044-1089`) records the narrower window.
Why it matters: the README's "declared publish ceilings" paragraph is where a reader looks up what bounds publish cancellation, and it names a bound the engine's own source retracted.
Confirmed.

**4. `kernel/src/permission/approval.rs:15-21` — "One check, two producers … A future SKP surface adds a third implementation."**
Claims: only `StdinApproval` and `PreNamedApproval` implement `ApprovalSource`; a third would be a future SKP surface.
Code: `frontends/shell/src-tauri/src/publish.rs:148-166` — `ShellApproval` has implemented `ApprovalSource` since 3bd479bc (2026-08-16), and `kernel/src/permission/audit/record.rs:84-96` already carries its `ApprovalRoute::ShellDialog` (approved widening, DECISIONS-PENDING entry 6). The header was written 2026-08-07 (55c7683e).
Why it matters: a reviewer counting `ApprovalSource` producers from this header would miss the one the shipped UI actually uses (the one F-6 of `PERMISSION-BOUNDARY.md` was written about).
Confirmed.

**5. `engine/src/lib.rs:77` — measurement scope still says "MSVC / bundled DuckDB".**
Claims: "Windows 10 Pro 22H2 / MSVC / bundled DuckDB."
Code: since #266 (5d9a7eb3, 2026-10-28) the Windows build compiles the bundled DuckDB with clang-cl (`.cargo/config.toml`); `engine/README.md:527-530` was rewritten to say figures before that merge were on cl.exe and none have been re-taken since; the O1 form's OPEN-7 named `engine/README.md:523` only, not this twin sentence.
Why it matters: it is the module's scope statement for every measurement, and it now names the compiler the figures were *not* taken on.
Confirmed (the sibling sentence in the README was changed by the same piece; this one was not).

**6. `kernel/src/skp.rs:7-10` — "Every Tauri command handler in `frontends/shell/src-tauri` is a thin wrapper that … calls one method here."**
Code: `frontends/shell/src-tauri/src/commands.rs` now has 14 handlers; `record_step` goes to `session_history::StepRecorder`, and the eight `binding_*` handlers (publish prepare/execute/cancel, data-plane attach, CRS catalog, file pick, session log, e2e destination) never touch `SkpHost`.
Why it matters: it is the sentence that tells a reader where a shell command lands, and for the class-3 publish commands it points at the wrong module.
Confirmed; minor (overbroad rather than wrong about the five SKP commands).

## Already tracked in `governance/PLAN.yaml` (left out above)

- **b2-piece-1c-save-and-reopen** — the lines calling ADR-036 "Proposed" (ADR-036 Accepted 2026-10-22): its form (§"Live text that says ADR-036 is Proposed") names `kernel/src/dataset_ref.rs:4`, `kernel/src/lib.rs:18`, `kernel/src/session_history.rs:5`, `kernel/README.md:274`, `:375`. Same topic, not in its list: `kernel/README.md:374` (session-history row), `:386` (accepted list lacks ADR-036), `:391` ("Proposed ADRs: … ADR-036"), and `engine/README.md:560`.
- **dataset-stream-doc-producer-runs-ahead** — `engine/src/stream.rs:911-912`; same claim also in that file's header, `:12-13` ("nothing is generated ahead of need").
- **kernel-composed-ceiling-projected-stream** — `kernel/README.md:72-76`.
- **pre-admission-change-detail-braces** — the braced/`[P6 placeholder]` strings in `kernel/src/skp.rs:1633-1640`, `:1238`, `engine/src/watch.rs:96`.
- **redaction-hostname-off-windows** — `PERMISSION-BOUNDARY.md`'s machine-identifier class off Windows.
- **module-docs-stale-statements** (done, #209) — all ten findings of the 2026-10-10 area-D sweep are closed on main; nothing there re-opened.
- **governance-f-tidy-repository-in-place** (done) — old-path form cites in both owner's indexes resolve through `MOVED.tsv` by that piece's design.

## Not got to

Per-function doc comments below the headers in `engine/src/predicate.rs` (3,297 lines), `engine/src/geoparquet.rs`, `engine/src/lod.rs` body, the producer internals of `engine/src/stream.rs`, and `kernel/src/skp.rs` beyond `open_dataset`/`close_dataset`/the registry docs; `kernel/FIXTURES.md` (not in area D's list); the `path:line` cites inside doc comments other than `pool.rs`'s `:72-78`; the RESULTS files (records, not swept); whether `PERMISSION-BOUNDARY.md`'s dated 2026-08-07 body lists every preflight refusal `PublishError` has since gained (`GeographicCrsNotPublishable`, `GeometryEncodingNotPublishable`, `RowFilterNotRecordable`, `ReaderCeilingExceeded`, `ViewerAssetPathRejected` are absent from its list at `:258-260`, but the file declares itself not rewritten and `boundary.rs:51-66` carries the current list, so I did not count it).

-----

