*Custodian's filing note (2026-11-05): the architect's triage reading of the drift sweeps of area C (the SKP spec's live sections and the protocol's doc comments, findings 1 to 11) and area D (the kernel's and the engine's READMEs and module docs, findings 1 to 6), under the human's direction of 2026-11-05, item 2 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`): the drift sweeps and the two docs audits triaged as on 2026-10-10, confirmed findings to nodes by the custodian's grading. Its brief by file (sha256 05517656e81cbaa4e92384db41d57fcd6e844d2e48eca2f6bc736a4a17407ada); its inputs the filed sweeps `state/consults/2026-11-03-platform-drift-sweep-area-c.md` and `state/consults/2026-11-03-platform-drift-sweep-area-d.md`, worked at 652752af; read at main 9b0c2a14. The run 18:23:36Z to 18:30:51Z by its transcript (claude-opus-5-5; unique calls Read 64, Grep 43, Glob 1 and the hand-back, equal to the notification's). Extracted by script from the hand-back message in that transcript (24696 bytes, sha256 2f8a812f9029211a8429172fd9ccca13bde4c17b30637ebf9a1a3a08c10c557c), unchanged. A reading, not Authority: the grading and any node are the custodian's; walkthrough rows, the e2e README's security-posture paragraph, ADR text and strings a user sees are the human's words.*

---

**Verdict:** none. This is a triage reading, not a gate, so it has no Correctness, Evidence or Documentation verdict. Reviewed: main @ 9b0c2a14. That commit is HEAD in the session's git status. I have no shell, so I could not confirm it, and I could not check the brief's sha256. The working tree has the custodian's staged edits, `governance/PLAN.yaml` among them, and I read the tree as it stands. Every node is cited by id.

Tag: `triage:drift-sweep@areas-c-d`. "C:n" means `state/consults/2026-11-03-platform-drift-sweep-area-c.md` line n, and "D:n" means `state/consults/2026-11-03-platform-drift-sweep-area-d.md` line n. Every verdict below comes from reading the code; I ran nothing.

## Area C

**C1.** C:35 reads `**1. `skp.filter_dialect_unsupported` is listed as a refusal a client receives; the host never produces it.**`
- **What decides it:**
  - `protocol/skp/SKP-V0.md:498` lists the code in the §7.5 taxonomy: `| `skp.filter_dialect_unsupported` | `declared` |`.
  - `protocol/skp/src/v0/commands.rs:399` reads `if dialect != FILTER_DIALECT_DUCKDB_EXPR_0 {` and `:423` reads `Filter::new(raw.predicate, raw.dialect).map_err(serde::de::Error::custom)`, so a wrong dialect fails at deserialize.
  - `engine/src/predicate.rs:258` says "**Not constructible by [`AdmittedPredicate::admit`] today.**"
  - Both product admissions pass the predicate text only: `kernel/src/skp.rs:1868` `AdmittedPredicate::admit(f.predicate.clone(), ds)` and `kernel/src/session_history.rs:360` (same call).
  - The only constructor is the unit test at `kernel/src/skp.rs:2762`.
- **Verdict:** CONFIRMED, with one qualification. The spec contradicts itself rather than staying silent: `SKP-V0.md:422-423` already says a wrong dialect is refused "at deserialization alike, before the predicate text is ever looked at." The sweep's sub-claim also holds: `commands.rs:377` says "(a later phase)" and `:384` says "docs/09's allowlist walk is engine/kernel work, a later phase", and both are stale against `skp.rs:1868`.
- **Kind:** a doc that misstates the wire contract a client relies on. It is the same class as the three codes the human struck (ruling of 2026-10-10, item 4), but that ruling named only those three. Whether this code is produced or marked reserved is therefore the human's decision; it is not a wording fix.
- **Open nodes:** none covers it. `first-external-plugin-skp-client` (unscheduled) holds the produce-or-not question for decode-time refusals. `b2-piece-1c-save-and-reopen` (in progress) edits both `SKP-V0.md` and `commands.rs` at step 1's P2 (its §2.11 step 1 table and P2 list).

**C2.** C:41 reads `**2. ADR-036 is called "Proposed" in the live sections; it was Accepted 2026-10-22.**`
- **What decides it:** `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3` reads `**Status:** Accepted 2026-10-22`.
- **Verdict:** CONFIRMED.
- **The lines that still carry "Proposed" on main:**
  - `protocol/skp/SKP-V0.md:226`, "(ADR-036, Proposed)"
  - `protocol/skp/SKP-V0.md:1246`, "ADR-036 §12 (Proposed, binding nothing until accepted)"
  - `protocol/skp/src/v0/commands.rs:513`
  - `kernel/src/session_history.rs:5`
  - `kernel/src/lib.rs:18`
  - `kernel/src/dataset_ref.rs:4`
  - `kernel/README.md:274`, `:374`, `:375`, and `:391` ("Proposed ADRs, binding nothing: … ADR-036")
  - `kernel/README.md:386`, whose accepted list lacks ADR-036
  - `engine/README.md:560`
  - `kernel/tests/no_generation_in_persisted_artifacts.rs:42`
  - `frontends/shell/src/style/StylePanel.tsx:55`
  - `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:74`. This is accepted ADR amendment text, the human's words, so I write no replacement for it.
  - `frontends/shell/src/workspace/viewTransitions.ts:6` is already current ("Accepted 2026-10-22").
- **Which open node touches these lines:**
  - `b2-piece-1c-save-and-reopen`, its form's "Live text that says ADR-036 is Proposed" paragraph (§2.10). Step 1 brings current, "in the files it edits", the pins `dataset_ref.rs:4`, `lib.rs:18`, `session_history.rs:5`, `kernel/README.md:274` and `:375`, `no_generation_in_persisted_artifacts.rs:42`, `commands.rs:513`, and `SKP-V0.md:223` and `:1239`, all @ ad921f55.
  - The two SKP-V0 pins are historical. On main the words sit at `:226` and `:1246`. The reviewer should recompute both hashes to confirm the pins land on those lines; I cannot.
  - Step 1's P2 edits `SKP-V0.md` "with its change log and its Status lines", so both spec lines fall inside 1c's scope.
  - `StylePanel.tsx:55` is assigned by that form to a docs-lane piece.
  - Not in 1c's list: `kernel/README.md:374`, `:386` and `:391`, and `engine/README.md:560`. `kernel/README.md` is still in 1c's records group.
  - No other open node touches `SKP-V0.md:226` or `:1246`. `open-dataset-close-serialised-under-the-catalog-lock` edits only §1's comment at `:55`.
- **Kind:** misleads an implementer: §10's lead tells a reader that `record_step`'s format binds nothing.

**C3.** C:47 reads `**3. Shell client and the wire struct still claim an omitted `filter` key is a deserialize failure; serde tolerates it.**`
- **What decides it:**
  - The claim's lines: `frontends/shell/src/skp/client.ts:104-105` "so an absent key is a deserialize" / "failure, not a tolerated omission." and `commands.rs:438` "deny_unknown_fields plus this struct's own derive requires the key".
  - The field is a plain `pub filter: Option<Filter>,` at `commands.rs:441`.
  - `protocol/skp/tests/fixtures.rs:90-91` documents the tolerance, and the §7.2 correction at `SKP-V0.md:407-415` says the same.
  - The converse also holds. `fixtures.rs:75` says "no field-presence check exists anywhere else in `v0::commands`", but `commands.rs:542` `#[serde(deserialize_with = "key_present")]` is such a check, and the test at `:883-885` refuses `{}`.
- **Verdict:** CONFIRMED.
- **Kind:** misleads an implementer. The shell always sends the key, so no behaviour depends on it.
- **Open nodes:** 1c's step 1 lists `skp/{types,client}.ts`, `commands.rs` and "fixtures and protocol tests". `b1-shell-half` (in progress, PR B pending) is shell-side; its paths are settled at its dispatch.

**C4.** C:54 reads `**4. §1 `open_dataset` still says admission of `crs_assertion`/`identity` and the host-minted attribution "are P1 work".**`
- **What decides it:**
  - The claim's line, `SKP-V0.md:46`: "value (ADR-015 §4, ADR-016 §3–§7) and the host-minted attribution are P1 work, threaded through".
  - Both fields are acted on: `kernel/src/skp.rs:1121-1122` map both, `:1179` passes them to `.open_cancellable(handle.as_str(), &req.path, assertion, identity, &cancel);`, and `:1676` mints `by: host_attribution(),`.
- **Verdict:** CONFIRMED.
- **Kind:** misleads an implementer: it reads as if the two fields were carried but not admitted.
- **Open nodes:** `open-dataset-close-serialised-under-the-catalog-lock` (in progress, at the click) edits §1's comment at `:55`, nine lines below. 1c's P2 edits `SKP-V0.md`.

**C5.** C:60 reads `**5. The shared-fixture discipline is described as two-sided, but `record_step` has no TypeScript reader.**`
- **What decides it:**
  - `frontends/shell/src/skp/__tests__/fixtures.test.ts:29` reads "One canonical request/response per command, read by **both** the Rust host".
  - The three `v0-record_step-*.json` files are read only at `fixtures.rs:395-405`. No file under `frontends/shell` names them or the five `v0-error-session_history_*`/`step_line_*`/`style_value_*` fixtures (both by grep).
  - The TypeScript version list at `fixtures.test.ts:511-519` omits both record_step requests and also `v0-viewport_query-request-with-columns` (my addition).
- **Verdict:** PARTLY.
  - The TypeScript half is CONFIRMED.
  - The Rust half of the sub-claim "both … omit" holds only literally: `fixtures.rs:399-403` checks the version of both record_step requests inside `record_step_fixtures_round_trip`.
- **Kind:** misleads an implementer, since the header overstates coverage. The real gap is a missing TypeScript fixture test, which is a test change rather than a wording fix.
- **Open nodes:** 1c's P2 relies on this file (its form cites `fixtures.test.ts:510-523` @ e6dfe624) and adds fixtures under the same discipline.

**C6.** C:66 reads `**6. §4 item 9 says cancel's idempotence is "an accident … not a mechanism, and must not be cited as one".**`
- **What decides it:**
  - The claim's line, `SKP-V0.md:290`: "already keeping the first instant — an accident of two existing implementations, not a mechanism,".
  - Against it: `kernel/src/skp.rs:129` "`cancelled` is this registry's own record of whether `cancel` has", `:345-346` `if *cancelled {` / `CancelOutcome::AlreadyTerminal`, and `:332` `Some(TicketState::CancelledBeforeRedeem { .. }) => CancelOutcome::AlreadyTerminal,`.
  - The open-key branch reads the token on purpose: `:960` `let was_cancelled = token.is_cancelled();`.
- **Verdict:** CONFIRMED.
  - One bound neither text states: an entry older than `TERMINAL_ENTRY_MAX_AGE` (`:104`, 300 s) is evicted, and a repeat cancel then answers `unknown` (`:98-100`). So the repeat answer holds for the entry's lifetime only.
  - Item 9's `open_dataset` sentence holds.
- **Kind:** misleads an implementer. Minor.
- **Open nodes:** none, apart from 1c's P2 scope on the file.

**C7.** C:72 reads `**7. §3 describes a `SessionRef` "for a generation created any other way" that no path mints.**`
- **What decides it:**
  - `skp.rs:432` reads "**Only `mint_for_open` mints one**".
  - The product calls are only at `:1258` and `:1291`, inside `open_dataset` (`:1102-1311`), which returns that `session` at `:1307-1310`. The other calls (`:3588` onward) are tests.
- **Verdict:** CONFIRMED. `SKP-V0.md:187`'s sentence describes a case that cannot occur.
- **Kind:** misleads an implementer.
- **Open nodes:** `adr-035-close-races-note` (blocked) records the same unreachability on the ADR side. Nothing covers `SKP-V0.md`.

**C8.** C:78 reads `**8. `DatasetHandle`'s doc omits the sixth command it authorizes.**`
- **What decides it:** `protocol/skp/src/v0/handles.rs:97` reads "authorizes `describe`, `viewport_query` and `close_dataset`", and `commands.rs:521` has `pub dataset: DatasetHandle,` in `RecordStepRequest`.
- **Verdict:** CONFIRMED.
- **Kind:** misleads an implementer. Minor.
- **Open nodes:** none. `handles.rs` is not in 1c's list.

**C9.** C:84 reads `**9. `CancelRequest`'s doc says the host disambiguates "on its `_` prefix (`sh_...`)".**`
- **What decides it:**
  - The doc at `commands.rs:467`.
  - The host parses the whole string: `skp.rs:1557` `let outcome = match req.handle.parse::<StreamHandle>() {`. The parse demands 32 lowercase hex (`handles.rs:30`).
  - A cancel key may itself start with `sh_` (`handles.rs:139`).
- **Verdict:** CONFIRMED.
- **Kind:** misleads an implementer. Low impact, since `SKP-V0.md:129-131` is correct.
- **Open nodes:** 1c (`commands.rs`).

**C10.** C:89 reads `**10. `events.ts` cites a spec section that does not exist.**`
- **What decides it:** `frontends/shell/src/skp/events.ts:14` cites "(`SKP-V0.md` §2c)", but `SKP-V0.md:152`'s §2 holds only C1 to C3.
- **Verdict:** CONFIRMED.
- **Kind:** a stale cite only.
- **Open nodes:** none.

**C11.** C:94 reads `**11. Host-produced `skp.*` codes the spec never names.**`
- **What decides it:**
  - `skp.rs:1105` produces `.map_err(|e| SkpError::protocol("malformed_cancel_key", e))?;`.
  - `frontends/shell/src-tauri/src/commands.rs:66`, `:95` and `:149` produce the three `*_panicked` codes.
  - A grep of `SKP-V0.md` finds neither name. `protocol/skp/tests/conformance/DIVERGENCES.md:31` names the first.
- **Verdict:** CONFIRMED that the codes are produced.
  - Any client that sends a malformed `cancel_key` gets the first.
  - The `*_panicked` codes need a panic in a blocking task, which is not ordinary use.
- **Kind:** a spec omission, so whether to list them is a judgement.
- **Open nodes:** none.

## Area D

**D1.** D:33 reads `**1. `kernel/README.md:103-116` — the admission-class composition claim is stale since the Table landed.**`
- **What decides it:**
  - The README's claim: `kernel/README.md:107` "`3 + 1 = 4` — cannot collide at this class", and `:109-110` "that in the shipped shell this class therefore never refuses," / "so a per-tile filter admission is never lost to a lease".
  - The Table adds a load the sum does not count: `frontends/shell/src/table/tableSource.ts:131` issues a filtered `viewport_query`. The shell's own comment, `tileViewportStreamManager.ts:316`, says "adds one admission and one stream, so three tiles plus the table plus an export can reach it".
  - Each filtered admission leases the class: `engine/src/predicate.rs:146` `.acquire(LeaseClass::Admission)`.
  - My addition: `record_step`'s `filter.apply` admits again (`session_history.rs:360`), another lease on the same class that the README's `3 + 1` does not count. The area E triage separately found the untiled first look running beside the tiles.
  - The same sentence is in `engine/src/pool.rs:116-117`: "it is sized to the shipped shell's own composition so that, in that composition," / "this class is never the thing that refuses".
  - Also stale: `pool.rs:123` cites "`:72-78`", but that paragraph is at `:71-77` on main.
- **Verdict:** CONFIRMED that `3 + 1` is no longer the shell's whole admission load. Whether five admissions overlap in practice is timing and cannot be decided by reading.
- **Kind:** misleads an implementer or reviewer. It states a "never refuses" guarantee the shipped shell no longer meets; under the proportional-gates rule that would be a Correctness-class claim in a gate. Users are told the truth by KL 56.
- **Open nodes:**
  - `kernel/README.md`: `b2-piece-1c-save-and-reopen` (records group), `module-readme-moved-form-paths` (proposed) and `kernel-composed-ceiling-projected-stream` (proposed, `:72-76`), all the same file.
  - `pool.rs`: none.

**D2.** D:39 reads `**2. `kernel/README.md:120-135`, `engine/README.md:329-340`, `engine/src/pool.rs:66-69` — "unreachable on the natural-completion path" no longer holds for the shipped shell.**`
- **What decides it:**
  - The claim: `kernel/README.md:120-121` "refusal is unreachable on the" / "natural-completion path".
  - The stream lease is taken in `viewport_query`, before the data plane admits anything. The kernel's own doc says so at `skp.rs:87-90`: "**Not the ceiling reached first in practice.** Every `Pending` ticket already holds a leased … concurrent pending ticket fails at the connection lease with `engine.connections_exhausted`".
  - Publish leases the same class outside the data plane: `engine/src/dataset.rs:2184` `let lease = dataset.pool.acquire(LeaseClass::Stream)?;`, reached through `stream.rs:1234`.
  - Both ceilings are 4: `pool.rs:99` and `protocol/data-plane/src/server.rs:60`.
  - KL:444 states the five-way demand.
- **Verdict:** CONFIRMED by reading on the premise. I did not observe the five-way concurrency itself.
- **Kind:** misleads an implementer, and `kernel/src/skp.rs:87-93` contradicts it.
- **Open nodes:** as D1, plus `module-readme-moved-form-paths` for `engine/README.md`.

**D3.** D:45 reads `**3. `engine/README.md:445-446` — restates the withdrawn ADR-017 §15 sentence.**`
- **What decides it:**
  - The README: `engine/README.md:446` "**the uninterruptible window is one partition's encode and write.**"
  - The engine's source withdrew it: `engine/src/stream.rs:119-120` "**but it is not, on its own, the bound the" / "consumer feels.** This comment used to end "the uninterruptible window is one partition's encode".
  - The write is chunked: `kernel/src/publish/mod.rs:151` `pub const PUBLISH_WRITE_CHUNK_BYTES: usize = 256 * 1024;` and `:1592` `for chunk in bytes.chunks(PUBLISH_WRITE_CHUNK_BYTES) {`.
- **Verdict:** CONFIRMED. I did not read ADR-017's Corrigendum 4.
- **Kind:** misleads an implementer: it states a cancellation limit the source withdrew.
- **Open nodes:** `module-readme-moved-form-paths` (same file). `dataset-stream-doc-producer-runs-ahead` touches `stream.rs`, not the README.

**D4.** D:51 reads `**4. `kernel/src/permission/approval.rs:15-21` — "One check, two producers … A future SKP surface adds a third implementation."**`
- **What decides it:**
  - The header: `approval.rs:19` "A future SKP surface adds a third implementation and touches".
  - The third already exists: `frontends/shell/src-tauri/src/publish.rs:156` `impl ApprovalSource for ShellApproval {`, and `:162` `ApprovalRoute::ShellDialog`.
  - My addition: `approval.rs:17`, "[`ApprovalSource`] has one method", is also stale. The trait has `respond` and `route` (`:145`, `:148`).
- **Verdict:** CONFIRMED.
- **Kind:** misleads an implementer. Minor.
- **Open nodes:** none.

**D5.** D:57 reads `**5. `engine/src/lib.rs:77` — measurement scope still says "MSVC / bundled DuckDB".**`
- **What decides it:**
  - `engine/src/lib.rs:77` reads "Windows 10 Pro 22H2 / MSVC / bundled DuckDB."
  - `.cargo/config.toml:3` reads `"CXX_x86_64-pc-windows-msvc" = "clang-cl"`.
  - The README twin at `engine/README.md:527-530` records the compiler change and the DuckDB version.
- **Verdict:** PARTLY.
  - "MSVC" is still true of the Rust target, which is the `-msvc` triple.
  - The line omits that the bundled DuckDB is now compiled with clang-cl, and that no figure has been re-taken on that build.
- **Kind:** misleads about a measurement's scope. Minor.
- **Open nodes:** none.

**D6.** D:63 reads `**6. `kernel/src/skp.rs:7-10` — "Every Tauri command handler in `frontends/shell/src-tauri` is a thin wrapper that … calls one method here."**`
- **What decides it:**
  - `skp.rs:7` reads "Every Tauri command handler in".
  - `frontends/shell/src-tauri/src/lib.rs:538-557` registers 14 handlers.
  - `commands.rs:147` `tokio::task::spawn_blocking(move || recorder.record_step(request))` goes to `StepRecorder`, and the eight `binding_*` handlers do not touch `SkpHost`.
- **Verdict:** CONFIRMED. The sentence is overbroad; for the five SKP commands it holds.
- **Kind:** misleads an implementer. Minor.
- **Open nodes on `skp.rs`:**
  - `open-dataset-close-serialised-under-the-catalog-lock` (in progress, at the click)
  - `pre-admission-change-detail-braces` (ready)
  - 1c, whose step 1 adds a `save_project` handler (its P3 and P4), so `skp.rs:4`'s "five of the six" and the spec's command count move again.

**Area D's "already tracked" list:** I checked it against what is on main.
- Its ADR-036 lines are as listed under C2.
- The `stream.rs:13` header sentence ("nothing is generated ahead of need") is still there. It is outside `dataset-stream-doc-producer-runs-ahead`'s summary, which names `Dataset::stream`'s doc only.

## Proposal (the grading is the custodian's)

- **Group S, the spec's live sections** (`protocol/skp/SKP-V0.md`): C1 (the spec half, after the human's produce-or-reserve ruling), C2's two lines, C4, C6, C7, and C11 (if the human wants it listed).
  - Overlaps: 1c's step 1 (P2 edits `SKP-V0.md`), and `open-dataset-close-serialised-under-the-catalog-lock` (§1's comment, merging).
  - Rule (00), at most one piece touching `protocol/`, puts this group after 1c's protocol steps, or folds it into 1c's P2 as a class 9 addition. Which of the two is the custodian's choice.
- **Group P, protocol and shell doc comments:**
  - `commands.rs` for C1's `:377`/`:384`, C3, C9 and C2's `:513`
  - `handles.rs` for C8
  - `fixtures.rs:75` for C3
  - `client.ts:102-105` for C3
  - `events.ts:14` for C10
  - `fixtures.test.ts:29`, plus the missing TypeScript fixture test for C5, which is a test change
  - Overlaps: 1c (`commands.rs`, `client.ts`, `types.ts`, protocol tests, and the fixture test via P2). `b1-shell-half` PR B is shell-side; its paths are settled at its dispatch.
- **Group M, the module READMEs and docs:**
  - `kernel/README.md:103-135` for D1 and D2, plus C2's `:374`, `:386` and `:391`
  - `engine/README.md:329-340` and `:445-446` for D2 and D3, plus C2's `:560`
  - `engine/src/pool.rs:62-69`, `:113-123` for D1 and D2
  - `kernel/src/permission/approval.rs:15-21` for D4
  - `engine/src/lib.rs:77` for D5
  - `kernel/src/skp.rs:4-10` for D6
  - Overlaps: 1c (the `kernel/README.md` records group), `module-readme-moved-form-paths` and `kernel-composed-ceiling-projected-stream` (both READMEs), and the two in-flight `skp.rs` nodes.
  - Under the same-file rule, D1 and D2's README parts could join `module-readme-moved-form-paths` (proposed, docs only).

**What a client or user can rely on** (as 2026-10-10's finding 8 did):
- C1: a client is told of a refusal code it can never receive.
- D1 and D2: "never refuses" and "unreachable" guarantees a reviewer would rely on. Users are told otherwise by KL 56, correctly.
- D3: a cancellation bound that has been withdrawn.

**Minor gaps:**
- C2 (stale status words; C2 alone also touches an accepted ADR's text, `ADR-022:74`, which is the human's)
- C3, C4, C5, C6, C7, C8 and C9
- C10, a stale cite only
- C11, a judgement
- D4, D5 and D6

**Not decidable by reading:**
- whether five admissions or five stream leases overlap in ordinary timing (D1, D2)
- whether 1c's SKP-V0 pins at ad921f55 land on `:226` and `:1246`, which needs the hashes recomputed

**Outside the sweep, noted only:** §1's `viewport_query` block (`SKP-V0.md:111-115`) shows neither `filter` nor `columns`. §7.2 and §9.2 carry them, under §7's "additive" standing (`:373`). Unlike `describe`, the block has no pointer to them.

## Files read

- The brief: brief-tri-cd.md in the session scratchpad
- C:/dev/spatial-ide/state/consults/2026-11-03-platform-drift-sweep-area-c.md
- C:/dev/spatial-ide/state/consults/2026-11-03-platform-drift-sweep-area-d.md
- C:/dev/spatial-ide/state/consults/2026-11-05-area-e-kl-triage-numbered-items-architect.md
- C:/dev/spatial-ide/protocol/skp/SKP-V0.md (25-294, 320-430, 470-514, 1240-1269; grep)
- C:/dev/spatial-ide/protocol/skp/src/v0/commands.rs (24-41, 360-559; grep)
- C:/dev/spatial-ide/protocol/skp/src/v0/handles.rs
- C:/dev/spatial-ide/protocol/skp/tests/fixtures.rs (60-104, 383-482)
- C:/dev/spatial-ide/protocol/skp/tests/conformance/DIVERGENCES.md (grep)
- C:/dev/spatial-ide/protocol/data-plane/src/server.rs (grep)
- C:/dev/spatial-ide/kernel/src/skp.rs (1-20, 80-149, 320-369, 420-444, 950-974, 1095-1319, 1548-1567, 1665-1699, 1850-1879, 2240-2254; grep)
- C:/dev/spatial-ide/kernel/src/permission/approval.rs (1-40, 144-164)
- C:/dev/spatial-ide/kernel/src/session_history.rs (grep)
- C:/dev/spatial-ide/kernel/src/publish/mod.rs (grep)
- C:/dev/spatial-ide/kernel/README.md (60-139, 268-277, 374-391)
- C:/dev/spatial-ide/engine/README.md (320-344, 436-450, 518-565)
- C:/dev/spatial-ide/engine/src/pool.rs (55-139)
- C:/dev/spatial-ide/engine/src/predicate.rs (245-269; grep)
- C:/dev/spatial-ide/engine/src/stream.rs (105-134; grep)
- C:/dev/spatial-ide/engine/src/dataset.rs (2165-2189)
- C:/dev/spatial-ide/engine/src/lib.rs (68-82)
- C:/dev/spatial-ide/.cargo/config.toml
- C:/dev/spatial-ide/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (grep)
- C:/dev/spatial-ide/docs/adr/ADR-022-style-v0-as-the-single-style-model.md (grep)
- C:/dev/spatial-ide/frontends/shell/src/skp/client.ts (85-119)
- C:/dev/spatial-ide/frontends/shell/src/skp/types.ts (1-20, 280-319)
- C:/dev/spatial-ide/frontends/shell/src/skp/events.ts (1-25)
- C:/dev/spatial-ide/frontends/shell/src/skp/__tests__/fixtures.test.ts (1-60, 505-525)
- C:/dev/spatial-ide/frontends/shell/src/streaming/tileViewportStreamManager.ts (300-324)
- C:/dev/spatial-ide/frontends/shell/src/table/tableSource.ts (grep)
- C:/dev/spatial-ide/frontends/shell/src/workspace/viewTransitions.ts (grep)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/commands.rs (136-151; grep)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/lib.rs (grep)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/publish.rs (140-169)
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md (440-447)
- C:/dev/spatial-ide/governance/PLAN.yaml (node ids and statuses by grep; nodes b2-piece-1c-save-and-reopen, skp-line-cites-outside-close-races, open-dataset-close-serialised-under-the-catalog-lock, kernel-composed-ceiling-projected-stream, adr-036-pre-acceptance-block, record-step-style-match-widening, adr-notes-stale-statements-and-indices, module-readme-moved-form-paths, skp-closed-domain-response-strings, first-external-plugin-skp-client, skp-unproduced-codes-ruling, skp-v0-live-sections-current-area-c, b1-shell-half, dataset-stream-doc-producer-runs-ahead, and the three nodes before module-readme-moved-form-paths)
- C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md (410-464, 975-989; grep)
