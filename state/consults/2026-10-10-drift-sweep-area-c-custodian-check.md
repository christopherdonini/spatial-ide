# Drift sweep, area C — the custodian's check at 116deb53

The custodian checked the human's drift sweep of area C, the wire contract against the code (`state/consults/DRIFT-SWEEP-AREA-C-2026-10-10.md`). The report was copied byte-identical from the human's advisory folder, and its sha256 9f24adae1061313f298240c3a8934a0e433955d0c0d15b9da73e757d3edb499b matches the human's stated hash.

The copy does not record the commit the sweep read. Every cite below is therefore re-derived at main 116deb53293bb62ebbaa49ee795e3b1f0093745d, read with `git show 116deb53:<path>`. The filing script asserts each cited line's content at that commit, and throws on any mismatch. Where a line here differs from the report's, this one governs.

**All nine findings hold at 116deb53.** The human's three instructions are answered at the end.

## Finding 1 — holds

§1's live shapes omit five members the host always sends.
- **`open_dataset`:** its response at protocol/skp/SKP-V0.md:26 has no `session`.
- **The describe block** (protocol/skp/SKP-V0.md:60-85) claims every `skp/0.3` and `skp/0.4` member. It has no `coverage`, `checks` or `session_end`.
- **`projectable`:** the block's `schema` line (protocol/skp/SKP-V0.md:79) has no `projectable`. A dated note names `schema[].projectable` in passing (protocol/skp/SKP-V0.md:96).
- **The preamble:** §8's preamble calls §§1–7 the live description (protocol/skp/SKP-V0.md:544).

The code:
- **`OpenDatasetResponse.session`:** protocol/skp/src/v0/commands.rs:68, set at kernel/src/skp.rs:1294-1297.
- **`DescribeResponse`'s three members:**
  - `coverage`: protocol/skp/src/v0/commands.rs:283, filled at kernel/src/skp.rs:1308.
  - `checks`: protocol/skp/src/v0/commands.rs:287, filled at kernel/src/skp.rs:1336.
  - `session_end`: protocol/skp/src/v0/commands.rs:289, filled at kernel/src/skp.rs:1360.
- **`FieldInfo.projectable`:** protocol/skp/src/v0/commands.rs:234, set at kernel/src/skp.rs:1967.
- **The fixtures:** `protocol/skp/tests/data/v0-open_dataset-response.json` carries `session`, and `protocol/skp/tests/data/v0-describe-response.json` carries the other four.
- **The shell mirror** carries all five:
  - frontends/shell/src/skp/types.ts:58
  - frontends/shell/src/skp/types.ts:166
  - frontends/shell/src/skp/types.ts:201
  - frontends/shell/src/skp/types.ts:204
  - frontends/shell/src/skp/types.ts:207

## Finding 2 — holds

§7.5 calls `skp.filter_identity_alias_ambiguous` unreachable from any product entry point (protocol/skp/SKP-V0.md:485-488). It is reachable. The path from the product to the refusal:
1. `open_dataset`'s identity is host-minted (kernel/src/skp.rs:1119).
2. It is passed into the catalog open (kernel/src/skp.rs:1176; kernel/src/lib.rs:207).
3. The engine makes it an `IdSource::Mapped` (engine/src/dataset.rs:1718).
4. Namespace admission refuses when the mapped column is not `id` and the file also carries its own `id` column (engine/src/predicate.rs:1119; engine/src/predicate.rs:1169).

Supporting evidence:
- **A mapped identity through SKP:** kernel/tests/skp_admission_remediation.rs:206 shows one.
- **The report's commits:**
  - the text was written at ee3b73ba (ee3b73ba, 2026-08-13);
  - the identity arrived on `open_dataset` at b751ff4a (b751ff4a, 2026-08-18).
- **Area D's stale claim:** the honesty note at engine/src/predicate.rs:1111 repeats it, as the report notes for area D.

## Finding 3 — holds

§4 item 1 says ADR-017's acceptance condition keeps publish unreachable regardless (protocol/skp/SKP-V0.md:202). Publish is reachable from the shell through three commands:
- frontends/shell/src-tauri/src/commands.rs:265
- frontends/shell/src-tauri/src/commands.rs:402
- frontends/shell/src-tauri/src/commands.rs:451

ADR-017 discharged the condition for that UI surface only:
- the discharge clause: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1129;
- the 2026-08-17 completion section: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1134.

Still true: SKP has no publish command, and `protocol/skp/src/v0/commands.rs` declares no publish request type.

## Finding 4 — holds

§1 says the host canonicalizes the path and refuses a non-file with `EngineError::Source`'s text (protocol/skp/SKP-V0.md:29-30). What the open path does:
- **A directory** is refused first, as `IdentityOrdinalPartitionedUnsupported` (engine/src/dataset.rs:325, engine/src/dataset.rs:326, engine/src/dataset.rs:1647). It is mapped to `engine.identity_ordinal_partitioned_unsupported` (kernel/src/skp.rs:2092).
- **Only a non-directory non-file** reaches the `Source` arm (engine/src/dataset.rs:328). This changed at 01045ee3 (01045ee3, 2026-09-15).
- **No canonicalization:** the open path never canonicalizes the path. `std::fs::canonicalize` appears at engine/src/watch.rs:605 for arming the watcher, in permission code, and in a publish test, and nowhere in the open path. The report marks the canonicalize claim as a suspected original inaccuracy rather than drift.

## Finding 5 — holds

Two places name the codes:
- **§3** names `skp.malformed_hex_f64` / `skp.bbox_not_finite` as the refusal for a bad `HexF64` (protocol/skp/SKP-V0.md:187).
- **§5** lists them with `skp.unknown_handle` (protocol/skp/SKP-V0.md:329-330).

None of the three is ever produced:
- **The constructors** are at protocol/skp/src/v0/error.rs:74, protocol/skp/src/v0/error.rs:82 and protocol/skp/src/v0/error.rs:90. `git grep` at 116deb53 finds no call to any of them in a `.rs`, `.ts` or `.tsx` file.
- **A malformed `HexF64`** fails at deserialization (protocol/skp/src/v0/codec.rs:75). The shell's client rethrows any rejection that is not an `SkpError` untyped (frontends/shell/src/skp/client.ts:59, frontends/shell/src/skp/client.ts:64). That covers the report's lines 60-62.
- **A cancel on an unknown handle** answers with a cancel state, never this code (kernel/src/skp.rs:1561, kernel/src/skp.rs:1566).
- **The conformance ambiguities** at protocol/skp/tests/conformance/AMBIGUITIES.md:11 and protocol/skp/tests/conformance/AMBIGUITIES.md:16 record the refusal layer as unstated. They do not say the codes are never minted.

## Finding 6 — holds

The shell mirror says the event decoder is a later piece (frontends/shell/src/skp/types.ts:292). It exists:
- frontends/shell/src/skp/events.ts:23
- frontends/shell/src/skp/events.ts:59

Its tests are in `frontends/shell/src/skp/events.test.ts`.

## Finding 7 — holds

`handles.rs`'s module doc states two minting rules and three kinds (protocol/skp/src/v0/handles.rs:4, protocol/skp/src/v0/handles.rs:11).
- **A fourth kind:** the same file defines `SessionRef` (protocol/skp/src/v0/handles.rs:104-113). The report gives lines 102-111.
- **A third rule:** SKP-V0.md states one (protocol/skp/SKP-V0.md:175), with four kinds (protocol/skp/SKP-V0.md:177).

## Finding 8 — holds

The `projection_error_of` doc counts six codes (kernel/src/skp.rs:1721). The match has seven arms:
- kernel/src/skp.rs:1725
- kernel/src/skp.rs:1730
- kernel/src/skp.rs:1744
- kernel/src/skp.rs:1749
- kernel/src/skp.rs:1754
- kernel/src/skp.rs:1759
- kernel/src/skp.rs:1776

The seventh arm arrived at 19f37da4 (19f37da4, 2026-09-29).

**Observed in the check, not in the report:** §9.5's heading still says seven codes (protocol/skp/SKP-V0.md:1148). Its table has eight rows, from protocol/skp/SKP-V0.md:1152 to protocol/skp/SKP-V0.md:1159.

## Finding 9 — holds

No live section states the current literal:
- **§9.1** says `skp/0.6` (protocol/skp/SKP-V0.md:1092), with a dated note moving it to `skp/0.7` (protocol/skp/SKP-V0.md:1097).
- **§4 item 3** stops at `skp/0.6` (protocol/skp/SKP-V0.md:220).
- **The code** sends `skp/0.11` (protocol/skp/src/v0/mod.rs:109; frontends/shell/src/skp/types.ts:15). It compares with `==` (kernel/src/skp.rs:1615).
- **`skp/0.8` to `skp/0.11`** appear only as §8 entries: protocol/skp/SKP-V0.md:952, protocol/skp/SKP-V0.md:989, protocol/skp/SKP-V0.md:1017, protocol/skp/SKP-V0.md:1051.

## The human's three instructions

**1. Finding 2 in the shell, and the tests.**
- **The shell would show it as a typed refusal.** The filter path formats the `SkpError` (frontends/shell/src/App.tsx:317). `FilterPanel` renders the refusal block (frontends/shell/src/filter/FilterPanel.tsx:134), which shows:
  - the code (frontends/shell/src/admission/RefusalBlock.tsx:28);
  - the verbatim message;
  - the fields `column` and `source_column`.

  It adds no code-specific guidance. This comes from reading the code, not from a run.
- **No test reaches it through SKP.** At 116deb53 the code and its variant appear only in `engine/src/predicate.rs`, `kernel/src/skp.rs` and two engine test files.
  - The kernel's unit test maps the engine variant to its code directly (kernel/src/skp.rs:2799).
  - The two engine test files name it only in their exhaustive code maps (engine/tests/admission_property_campaign.rs:625, engine/tests/filter_type_admission.rs:568).
  - No engine, kernel, shell or e2e test makes it fire.
- **Filed:** a proposed node graded S2, `filter-identity-alias-ambiguous-reached-through-skp`.

**2. Finding 5:** a proposed node for the human's ruling, `skp-unproduced-codes-ruling`. It allows no code before the ruling.

**3. Findings 1, 3, 4, 6, 7, 8 and 9:** one proposed documentation node, `skp-v0-live-sections-current-area-c`. It changes no literal.
