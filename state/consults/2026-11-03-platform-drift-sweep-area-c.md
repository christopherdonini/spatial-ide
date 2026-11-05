*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/DRIFT-SWEEP-AREA-C-2026-11-03.md` (10993 bytes, sha256 2c1ff5f6c751e61f29f26113200daaa9e0fe26a4fa5d3ba75ac2a6627eba3cab), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_0118tkqxnn3VCNaDXQbRd7Jz, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high), US$ 10.36, about 763 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. No cloud filing answers this area's question (the wire contract). By the ruling (item 2), it is triaged as on 2026-10-10: its findings are re-derived by script before any node rests on them.*

---

# Drift sweep area C, 2026-11-03 (advisory chat)

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_0118tkqxnn3VCNaDXQbRd7Jz) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 763 s active, US$ 10.36. Nothing below this line is edited.

---

I'll start by cloning the repository and checking the commit.

-----

The head matches the commit given. Now the area C files.

-----

Let me read the spec first, in full.

-----

Now the protocol crate's types.

-----

Now the kernel host. It's 5200 lines; I'll go through it in sections.

-----

**Repository:** christopherdonini/spatial-ide — **Area C (wire contract)** — swept at `652752afa9bedb0172948869c9ab7f0b8ee08dd3` (head of main as of this run, matches the stated origin/main).

## Findings (most consequential first)

**1. `skp.filter_dialect_unsupported` is listed as a refusal a client receives; the host never produces it.**
- Text: `protocol/skp/SKP-V0.md:498` (§7.5 table row, "eleven `skp.filter_*` codes … mapped field-for-field").
- Code: `protocol/skp/src/v0/commands.rs:397-424` refuses any dialect but `duckdb-expr/0` inside `Filter`'s `Deserialize`, so a bad dialect dies at request decode as a non-`SkpError` (same path as a malformed `HexF64`, §3). `engine/src/predicate.rs:258-262` states `DialectUnsupported` is "not constructible by `AdmittedPredicate::admit`"; `kernel/src/skp.rs:1868` passes only `f.predicate` to admission. The only constructor is the unit test at `kernel/src/skp.rs:2761`.
- Why: a client branching on this code (the spec's stated purpose of `fields`) can never see it — the same class the human's ruling struck from §5 for `skp.malformed_hex_f64`/`bbox_not_finite`/`unknown_handle`, but this code was outside that ruling. `commands.rs:374-386` still describes the taxonomy/allowlist as "a later phase".
- **Confirmed.**

**2. ADR-036 is called "Proposed" in the live sections; it was Accepted 2026-10-22.**
- Text: `SKP-V0.md:226` (§4 item 1, "ADR-036, Proposed"), `SKP-V0.md:1246` (§10 lead, "Proposed, binding nothing until accepted"); mirrors at `protocol/skp/src/v0/commands.rs:513`, `kernel/src/session_history.rs:5`, `kernel/src/lib.rs:18`, `kernel/src/dataset_ref.rs:4`.
- Code/record: `docs/adr/ADR-036-…md:3` — `**Status:** Accepted 2026-10-22`; PLAN `adr-036-pre-acceptance-block` summary records the acceptance commit 7cf76f9f.
- Why: a reader of §10 is told `record_step`'s format binds nothing; it now does. (The §8 `skp/0.12` entry is history and fine.)
- **Confirmed.** No node tracks the status-word update; `b2-piece-1c-save-and-reopen` (in progress) may or may not touch these lines.

**3. Shell client and the wire struct still claim an omitted `filter` key is a deserialize failure; serde tolerates it.**
- Text: `frontends/shell/src/skp/client.ts:102-105` ("an absent key is a deserialize failure, not a tolerated omission"); `protocol/skp/src/v0/commands.rs:437-440` ("deny_unknown_fields plus this struct's own derive requires the key").
- Code: plain `Option<Filter>` at `commands.rs:441`; the spec's own §7.2 Correction (`SKP-V0.md:407-419`) and `protocol/skp/tests/fixtures.rs:82-95` document that an omitted `Option<T>` key reads as `None`.
- Conversely `fixtures.rs:69-80` says "no field-presence check exists anywhere else in `v0::commands`" — `commands.rs:542-548`'s `key_present` on `FilterApplyParams::filter` is now exactly such a mechanism (`SKP-V0.md:1263`, test at `commands.rs:879-887`).
- Why: a client author reading `client.ts` would believe the host enforces key presence on `viewport_query`; it does not.
- **Confirmed.**

**4. §1 `open_dataset` still says admission of `crs_assertion`/`identity` and the host-minted attribution "are P1 work".**
- Text: `SKP-V0.md:45-48` ("… are P1 work, threaded through `open_cancellable`; this section states the wire shape `skp/0.2` opened, not that P0 alone admits anything").
- Code: `kernel/src/skp.rs:1121-1122, 1177-1179` admit both through `Catalog::open_cancellable`; `host_minted_crs_assertion`/`host_minted_identity_declaration` at `kernel/src/skp.rs:1670-1694` mint `by`/`at`/`definition_provenance`.
- Why: a live-section reader could conclude the two fields are carried but not acted on.
- **Confirmed.** (The 2026-10-11 piece rewrote the path sentence beside it, not this one.)

**5. The shared-fixture discipline is described as two-sided, but `record_step` has no TypeScript reader.**
- Text: `frontends/shell/src/skp/__tests__/fixtures.test.ts:29-30` ("One canonical request/response per command, read by **both** the Rust host … and this client"); `frontends/shell/src/skp/types.ts:7-10`.
- Code: `v0-record_step-request-filter-apply.json`, `…-style-set.json`, `…-response.json` are read only by `protocol/skp/tests/fixtures.rs:393-405`; no file under `frontends/shell` names them. Both "every request fixture carries the current SKP_VERSION" tests (`fixtures.rs:461-470`, `fixtures.test.ts` last block) omit the two `record_step` request fixtures.
- Why: `StepIntent`/`StyleSetParams` in `types.ts:293-310` are unverified against the wire fixtures, the drift the header says the fixtures exist to catch.
- **Confirmed.**

**6. §4 item 9 says cancel's idempotence is "an accident … not a mechanism, and must not be cited as one".**
- Text: `SKP-V0.md:288-291`.
- Code: `kernel/src/skp.rs:129-137, 342-357` — `TicketState::Redeemed.cancelled` is "this registry's own record of whether `cancel` has been called … never inferred from the underlying `SourceCancel`"; a second cancel answers `already_terminal` from that flag, and `CancelledBeforeRedeem` does likewise; `already_terminal` is a specified wire value with a shared fixture (§1, `v0-cancel-response-already_terminal.json`).
- Why: the text forbids citing a property the code now implements deliberately and the spec elsewhere specifies.
- **Confirmed** (for tickets; the open-key branch at `skp.rs:955-969` does still read `CancelToken::is_cancelled`).

**7. §3 describes a `SessionRef` "for a generation created any other way" that no path mints.**
- Text: `SKP-V0.md:187` ("The kernel mints one for every dataset-session generation … For a generation created any other way, no response returns it and no client holds it").
- Code: `kernel/src/skp.rs:432-435` ("Only `mint_for_open` mints one … no generation carries a reference no client holds"), `595-596`; `mint_for_open` is called only from `open_dataset`'s success arms (`skp.rs:1256-1258, 1289-1291`). PLAN `kernel-generation-close-races` is done; §8's 2026-09-25 note anticipated this in future tense.
- Why: a reader expects an unheld reference class that cannot occur.
- **Confirmed.**

**8. `DatasetHandle`'s doc omits the sixth command it authorizes.**
- Text: `protocol/skp/src/v0/handles.rs:97-98` ("authorizes `describe`, `viewport_query` and `close_dataset`").
- Code: `RecordStepRequest.dataset: DatasetHandle` at `commands.rs:519-523`; `kernel/src/session_history.rs:151-157`.
- Why: minor, but it is the one-line statement of what the handle grants.
- **Confirmed.**

**9. `CancelRequest`'s doc says the host disambiguates "on its `_` prefix (`sh_...`)".**
- Text: `protocol/skp/src/v0/commands.rs:467-469`.
- Code: `kernel/src/skp.rs:1557-1560` parses the whole string as a well-formed `StreamHandle` (`sh_` + 32 lowercase hex); anything else — including a client cancel key that happens to start with `sh_`, which the `CancelKey` alphabet permits — goes to the open registry. The spec's §1 text (`SKP-V0.md:129-131`) already states the well-formed rule.
- **Confirmed**, low impact.

**10. `events.ts` cites a spec section that does not exist.**
- Text: `frontends/shell/src/skp/events.ts:14` ("Mirrors `skp/0.5`'s own wire discipline (`SKP-V0.md` §2c)").
- Code/record: `SKP-V0.md` §2 has only C1–C3; "§2c" is the source-watcher preregistration's section.
- **Confirmed**, low impact.

**11. Host-produced `skp.*` codes the spec never names.**
- `kernel/src/skp.rs:1104-1105` mints `skp.malformed_cancel_key`; `frontends/shell/src-tauri/src/commands.rs:66, 95, 149` mint `skp.open_dataset_panicked` / `viewport_query_panicked` / `record_step_panicked`. `SKP-V0.md` §3 states the `CancelKey` alphabet but no refusal, and §5's `skp.` list (ellipsis) and §1 `open_dataset` are silent; only `tests/conformance/DIVERGENCES.md:31` records the first.
- Why: a client cannot match a code the contract does not list. This is an omission rather than a sentence that became false, so lower priority.
- **Confirmed** that the codes are produced; whether the spec should list them is a judgement.

## Checked and found current (not reported)
Literal `skp/0.12` on all three sides; `error_of`/`filter_error_of`/`projection_error_of` exhaustive and matching §5/§7.5/§9.5 (fields included); `record_step` check order, ceilings (262,144 / 33,554,432 / 4,096 / 1,024) and §10.4 codes; handle formats; `HexF64`/`DecU64` strictness; `describe` member set and value domains (`crs.source`, `uniqueness`, `sanity.level`, five `geoarrow.*` encodings, `checks.components`); `cancel`'s closed state set; path handling in `open_inner`; `MAX_INFLIGHT_BATCHES`, `MAX_PROJECTED_ATTRIBUTES`, `MAX_STREAM_CONNECTIONS`; §9.4 admission order; `spawn_blocking` claims; the `dataset_session_ended` event name and two-member payload. Old-path citations to `engine/*-PREREGISTRATION.md` etc. were not reported: `governance-f-tidy-repository-in-place` resolves them through `governance/MOVED.tsv` by design.

## Nodes already tracking things seen
`skp-v0-live-sections-current-area-c` (done; the previous area-C findings 1–9), `skp-unproduced-codes-ruling` (done), `skp-closed-domain-response-strings` (proposed; `crs.source`/`identity.class`/`sanity.level` still `String` on the reader), `open-dataset-close-serialised-under-the-catalog-lock` (the two windows in §1's HTML comment), `skp-line-cites-outside-close-races` (stale `skp.rs` line cites elsewhere), `adr-036-pre-acceptance-block` (done), `b2-piece-1c-save-and-reopen` (in progress), `first-external-plugin-skp-client` (typed refusal for decode errors), `record-step-style-match-widening`, `governance-f-tidy-repository-in-place`.

## Not reached
Row-by-row content of `protocol/skp/tests/conformance/fixtures/*.json`; `kernel/tests/*` assertions against the spec; the shell's consumers of the SKP types outside `frontends/shell/src/skp/` (App.tsx, streaming, residency); engine-side value domains were spot-checked, not read exhaustively; §8's history entries were treated as records and not re-verified.

-----

