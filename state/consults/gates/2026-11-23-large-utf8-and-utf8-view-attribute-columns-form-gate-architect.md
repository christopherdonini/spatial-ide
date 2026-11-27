Reviewed: main at a21d5de7d44035339e2cce56112c54178932afb2, in the detached read worktree C:/dev/wt/read-1123t (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 1, attempt 1, node:large-utf8-and-utf8-view-attribute-columns@form-gate-architect, dispatched at 2026-11-23T16:58:09Z; its run: Read 52, Grep 30, Glob 4, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:58:10Z to 2026-11-23T17:12:43Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 22347 bytes, sha256 43c1db3d6d150f896ebecda1488834c78345415086a9fc07bb6f521b83180a1a, byte for byte, nothing masked, with one final newline added. FAIL, every finding a matter of words with replacement words given under AUTONOMY section 31 (a): C1 (under (A) the filter namespace also departs from ADR-021 Note 2026-09-24 item 1, which the form does not name), C2 (the Renderer bullet: a recorded style_set match step compiles with no admission first), E1 (K-5 never meets either type; the property holds by construction), E2 (T3 and the probes prove less than the limit claims); D1 to D6 Documentation; the OPEN items read, not ruled. It read the form at a21d5de7, before ADV-2026-11-23-21 was filed (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-21-large-utf8-open-1-a-with-t3-adr-023-narrowed-by-an-appended-note-t3-kept-as-a-premise-pin.md`, at 6cf6140c).)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123t @ a21d5de7d44035339e2cce56112c54178932afb2

The form is read on main @ a21d5de7. Every finding below is a matter of words. The planned code is sound: it is engine-only and removes two arms and one VARCHAR alternative. So under AUTONOMY §31 (a) and the 2026-10-11 directive, item 2, I give replacement words for each blocking sentence. None of these sentences is the human's wording: all are lead-data's form text. The worker applies them with no re-gate and the PR body lists them. The form is append-only, so the custodian carries each new text by an appended amendment.

## Correctness

**C1 — §1, OPEN-1 (A), OPEN-2, §9 Merge. A changed requirement on an accepted ADR is not named.**
- ADR-021 is Accepted (docs/adr/ADR-021-row-filter-on-viewport-query.md:3).
- Its Note 2026-09-24, item 1 (:233), defines the filter namespace's type set as ADR-023 §2's admitted-type list, less dictionary-encoded columns.
- Under (A), `filterable_column_type` refuses both types through `admit_attribute_type` (engine/src/predicate.rs:1249). The namespace then departs from that note as well as from ADR-023 §2's list (ADR-023:47).
- The form names only ADR-023 (Proposed). It says ADR-017 §4 is not contradicted, which I agree with. It is silent on ADR-021, and its merge line has no condition on the human's answer.
- An ADR amendment or note is a red line, so the human's answer must come before code under (A) merges.

Old:
```text
- No ADR text is edited. ADR-023 §2 is OPEN-2.
```
New:
```text
- No ADR text is edited. Under (A) the engine's list departs from ADR-023 §2's text list and from the filter namespace that ADR-021's Note 2026-09-24 item 1 defines by that list; both are OPEN-2, and no code under (A) merges before the human's answer to it.
```
Old:
```text
Cost: it departs from ADR-023 §2's list (OPEN-2).
```
New:
```text
Cost: it departs from ADR-023 §2's list and from ADR-021's Note 2026-09-24 item 1, which defines the filter namespace by that list (OPEN-2).
```
Old:
```text
  - Recommendation: the custodian asks whether narrowing departs from the human's accepted text. This form edits no ADR. Under (B) or (C) the question does not arise.
```
New:
```text
  - ADR-021 (accepted), its Note 2026-09-24 item 1, defines the filter namespace's type set as ADR-023 §2's admitted-type list less dictionary-encoded columns (docs/adr/ADR-021-row-filter-on-viewport-query.md:233). Under (A) the namespace refuses the two types through `admit_attribute_type` (engine/src/predicate.rs:1249), so it departs from that note too.
  - Recommendation: the custodian puts to the human whether narrowing departs from the human's accepted text, of ADR-023 §2 and of ADR-021's note both. This form edits no ADR. Under (A) no code merges before the human's answer. Under (B) or (C) the question does not arise.
```
Old:
```text
- **Merge:** after the tag, and after PR 350 (its base); by merge commit.
```
New:
```text
- **Merge:** after the tag, after PR 350 (its base), and under (A) after the human's answer to OPEN-2; by merge commit.
```
Clause check:
- ADR-021:233 names ADR-023 §2's list, less item 2, as the type set.
- predicate.rs:1249 is the namespace's only type gate.
- Under (C) the namespace still admits both types: the emitted type is `Utf8`, and duckdb_type_name returns VARCHAR for it.
- The ADR-021:233 cite needs the custodian's pin by script.

**C2 — §2, the Renderer bullet. The harmlessness claim does not hold on one path.**
- The bullet says admission refuses first. That is true for publish: kernel/src/publish/mod.rs:530 runs before the style compile at :547-548.
- It is not true for a recorded `style_set` match step. kernel/src/session_history.rs:749-758 compiles it against the full file schema, with the named column, and runs no projection admission first.
- On that path a client other than the shell could record a match on such a column, and `viewport_query` would then refuse it.
- Ordinary use cannot reach it: no file yields either type, and the shell's chooser offers projected columns only (frontends/shell/src/App.tsx:855-858).

Old:
```text
- **Renderer.** `admit_match_type` (renderer/src/compiled.rs:231-239) and `admitsMatchKeyType` (renderer/style-ts/src/style.ts:46) still accept the two types. Both are unchanged and now wider than admission. That is harmless: they judge projected or described columns, and admission refuses first.
```
New:
```text
- **Renderer.** `admit_match_type` (renderer/src/compiled.rs:231-239) and `admitsMatchKeyType` (renderer/style-ts/src/style.ts:46) still accept the two types. Both are unchanged and now wider than admission. Publish runs admission before its style compile (kernel/src/publish/mod.rs:530, :547-548). A recorded `style_set` match step compiles against the file schema with no admission first (kernel/src/session_history.rs:749-758), so a client other than the shell could record a match on such a column that `viewport_query` then refuses. No file brings either type, and the shell offers only projected columns (frontends/shell/src/App.tsx:855-858). Narrowing the two rules is a renderer piece, not this one.
```
Clause check: the cited lines read as stated at a21d5de7.

## Evidence

**E1 — §1 bullet 2 and §4 "End to end". K-5 is named as proof, but it never meets either type.**
- K-5 (kernel/tests/skp_projection.rs:1119-1189) loops over the schema of fixtures opened from files. By U2 and §0 item 3, no file yields either type, so K-5 never asserts this claim.
- The property holds by construction: kernel/src/skp.rs:2064-2069 is `admit_projection_column(..).is_ok()`, and T1 calls that function on a field DuckDB itself exported.

Old:
```text
  - describe's `projectable` follows, by the existing K-5 agreement test;
```
New:
```text
  - describe's `projectable` follows by construction: it is `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069), which T1 calls on a DuckDB-exported field; K-5 keeps the agreement for every column a file brings, and no file brings either type;
```
Old:
```text
The seam's real shape is covered without the app: describe's value comes from `admit_projection_column` (K-5), and the shell reads only `projectable` (projection.ts:15-17).
```
New:
```text
The seam's real shape is covered without the app: describe's value is `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069), which T1 calls on a DuckDB-exported field, and the shell reads only `projectable` (projection.ts:15-17).
```

**E2 — §4 T3, §4 "End to end", OPEN-4. Limit claims go past what T3 and the probes prove.**
- T3 reads a VARCHAR literal on `fixture::configured_connection()` (engine/src/fixture.rs:58-64). That function calls `configure_connection`.
- T3 does not see a SET added to the pool's own path outside `configure_connection` (engine/src/pool.rs:431-441). It reads no file, so it also does not see a reader change that gives a file's text column a type other than VARCHAR.
- ADV-2026-11-16-11 item 2 records that no other source was tried.

Old:
```text
  - **Green at base and after.** It is a premise pin and not a red-before test (OPEN-4). It goes red if a DuckDB bump or a configuration change makes ordinary files reach either type.
```
New:
```text
  - **Green at base and after.** It is a premise pin and not a red-before test (OPEN-4). It goes red if VARCHAR's Arrow export on a connection configured by `configure_connection` stops being `Utf8`: a DuckDB bump that changes either setting's default, or either `SET` added to `CONFIGURE_SQL`. It reads no file, so a reader change that types a file's text column as other than VARCHAR is outside it.
```
Old:
```text
- So no file can bring such a column to describe. The only way to make one is a DuckDB setting the product never sets.
```
New:
```text
- So no file the probes tried brings such a column to describe, and the one way this form knows to make one is a DuckDB setting the product does not set (U1; T3 from now on).
```
Old:
```text
- **OPEN-4. T3, a premise pin green at base.** Recommendation: keep it. It is the only guard against the one way the type could arrive.
```
New:
```text
- **OPEN-4. T3, a premise pin green at base.** Recommendation: keep it. It guards the export settings, the way the probes found the type could reach the product connection.
```
Clause check:
- The probe report's lines 36-42 show both settings false.
- CONFIGURE_SQL sets neither (pool.rs:185-187).
- The product's `configure_new` runs `configure_connection` on its None branch (pool.rs:435-438).

## Documentation (must be fixed before the merge)

**D1 — Header, Branch bullet, and §2's counting command. The base is not the one ADV-2026-11-23-15 item 4 defines.**
- By item 4, the base is the merge commit that takes PR 350's head into main's tip, and it is recorded.
- A three-dot count from PR 350's head would also count main's changes since PR 350 last took main in.

Old:
```text
  - built on `cut/cancel-stamp-order` (PR 350), because both edit engine/README.md (§2 Scope; my paraphrase of the brief's reading of ADV-2026-11-23-15 item 4, which I have not read);
```
New:
```text
  - started at main's tip, taking in PR 350's head (`cut/cancel-stamp-order`) by a merge commit, because both edit engine/README.md's lines :537 and :557 (§2 Scope; ADV-2026-11-23-15 item 4);
```
Old:
```text
Sum the first two columns. `<base>` is `cut/cancel-stamp-order`'s head while PR 350 is unmerged, and `origin/main` after.
```
New:
```text
Sum the first two columns. `<base>` is the recorded base of ADV-2026-11-23-15 item 4: the merge commit that takes PR 350's head into main's tip, or the later merge commit that takes in a moved head; once PR 350 is on main, `origin/main`.
```

**D2 — §5 I1. There is no rule for when only one setting fails.**
- Lead-data's own note 1 makes this the likely case: `produce_arrow_string_view` may need `arrow_output_version`.
- If `arrow_large_buffer_size` fails, T3's mutation has a known pass case.

Old:
```text
  - **I1.** H-SET is false: neither setting yields its type from `query_arrow` on the bundled DuckDB. The worker may also try `SET arrow_output_version='1.4'` for Utf8View, recorded. If no setting works, T1's real-source half is replaced only by an amendment the advisor rules.
```
New:
```text
  - **I1.** H-SET is false for either setting: that setting, alone or, for Utf8View, with `SET arrow_output_version='1.4'` (tried and recorded), does not make `query_arrow` export its type on the bundled DuckDB. The worker stops at the first such failure. That half of T1's real source, and T3's mutation if the failing setting is `arrow_large_buffer_size`, are then replaced only by an amendment the advisor rules.
```

**D3 — §4. The form does not predict which tests each mutation turns red.**

Old:
```text
Each mutation is applied, run, recorded by name with its commit and reverted. Its `RECORDED MUTATION:` comment sits beside the test.
```
New:
```text
Each mutation is applied, run, recorded by name with its commit and reverted. Its `RECORDED MUTATION:` comment sits beside the test. Predicted red set: T1's mutation, T1 and T4 (the filter reaches the same arm through `filterable_column_type`); T2's, T2; T3's, T3, run in its own test binary, since the setting also exports binary columns with large buffers; T4's, T4. A temporary mutation of `engine/src/pool.rs` is not a change under §8 items 1 and 4.
```

**D4 — §4a. One more existing text becomes reachable, and S2 reaches the operator inside a wrapper.**
- S2 reaches the filter reason inside `EngineError::AttributeUnpublishable`'s Display (engine/src/error.rs:403-407; predicate.rs:1252).
- The Feature tab line also becomes reachable for these types (frontends/shell/src/feature/FeatureTab.tsx:63, :66).
- I checked all of them against the code, and they are true for the two types and for a dictionary over either. S1's list and S2's list leave both types out, and admission refuses them. The wrapper's statement that nothing is cast holds. The Feature tab line is true because describe marks such a column not projectable.
- Publish's dictionary text (attributes.rs:363-367) for a dictionary over either type was already reached before this change, from `admit_bundle_format`, with the same text.

Old:
```text
No string is added or changed. Two existing texts become reachable for these two types, only from a source no ordinary file is. Both are marked for the advisor (OPEN-3):
```
New:
```text
No string is added or changed. Three existing texts become reachable for these two types, only from a source no ordinary file is. S1 and S2 are marked for the advisor (OPEN-3):
```
Old:
```text
- **S2**: the final-arm text (engine/src/attributes.rs:111-114). It is kept byte for byte by the ruling the comment at :102-108 names. It would go into the filter's `ColumnNotFilterable` reason (predicate.rs:1249-1254) and publish's `AttributeUnpublishable` detail (attributes.rs:373-376).
```
New:
```text
- **S2**: the final-arm text (engine/src/attributes.rs:111-114). It is kept byte for byte by the ruling the comment at :102-108 names. It would go into the filter's `ColumnNotFilterable` reason, inside `EngineError::AttributeUnpublishable`'s own text (predicate.rs:1249-1254; engine/src/error.rs:403-407), and publish's `AttributeUnpublishable` detail (attributes.rs:373-376).
- **S3**: the Feature tab's line naming the columns the open does not project (frontends/shell/src/feature/FeatureTab.tsx:63, :66). It would name such a column, which is true: describe marks it not projectable.
```

**D5 — §2 item 1. The engine's doc rationale states another module's fact.**
- It names the shell's reader (docs/02, module boundaries). The engine's reason should be its own fact.

Old:
```text
   - A short doc line above the function says why: the shell reads only plain `Utf8`, and the product connection never exports the other two.
```
New:
```text
   - A short doc line above the function says why, in the engine's own facts: the product connection exports text only as plain `Utf8` (pinned by T3), so the two types are refused rather than offered unproven. It names no other module's reader.
```

**D6 — Amendment 1 item 3. Three cites have no pin.**
- The three are the header's ADV-2026-11-16-06 :25-26, the header's ADV-2026-11-16-04 :27, and §0 item 2's read-architect :28-30. I checked all three at a21d5de7: each holds and says what the form uses it for.
- The header's `governance/PLAN.yaml:7434-7450` pin is historical. The same commit edits the node's gate and summary, and no sentence says which is authoritative.

Old:
```text
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:122-125` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:676fa931c7d1bbb7213e1bdf8ca950da75638729b7664e30fcf6667b50358a55 — OPEN items; as written `:122-125` (r)
```
New:
```text
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:122-125` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:676fa931c7d1bbb7213e1bdf8ca950da75638729b7664e30fcf6667b50358a55 — OPEN items; as written `:122-125` (r)
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25-26` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — Header
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-04-two-nodes-from-the-architects-read-the-stream-refusal-node-after-a-read-the-dictionary-node-s3-after-b1-shell-half.md:27` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — Header
- `state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-architect.md:28-30` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:<by script> — §0
- The Header's `governance/PLAN.yaml:7434-7450` pin is historical: it holds the node as it stood at 0bcf5434; for the node's gate and summary the tree is authoritative.
```

## Answers to the brief's checks

- **Class.** Full, with both gates, holds.
  - By ADV-2026-11-16-06 item 2 (a), it changes a field value on the wire and crosses the seam between the engine and the shell. ADV-2026-11-23-15 item 7 (d) applies that rule to the gap pieces.
  - By AUTONOMY §21a, it touches the wire and changes properties under test: E1 and E2 assert that both types are admitted.
  - By §21c, the 220-line ceiling is over 150.
- **Type rule.** (A) keeps docs/01's rule of no silent conversion: every refusal stays typed, and nothing is cast.
  - ADR-017 §4's list is the bundle format's ceiling. ADR-023 §2's clarification (:43) separates admission from that check, so refusing earlier does not contradict ADR-017.
  - S1 (attributes.rs:487-491) and S2 are true for both types and for a dictionary over either.
- **Premise pin (T3).** Either setting turned on in `CONFIGURE_SQL`, or a DuckDB bump that flips either default, turns T3 red, provided H-SET holds. The setting descriptions at the probe report's lines 38 and 42 suggest it does.
  - If H-SET fails for a setting, flipping that setting does not change the export, and T3 rightly stays green.
  - Between a flip and T3, (A) turns the failure into every text column being listed as not projected, rather than the whole map failing.
  - Recommended, not required: a stronger real-shape pin opens a file through `Dataset::open` (the product's pool and `probe_schema`) and asserts `Utf8`.
- **Seams.** I read each against its real signature at a21d5de7:
  - `admit_projection_column(&Field, &str, &str) -> Result<Field, ProjectionError>` (attributes.rs:509-516);
  - `FieldInfo.projectable: bool` (commands.rs:226-236);
  - `projectionFor`, which reads only `projectable` (projection.ts:15-17);
  - `Dataset::admit_projection(&[String])` (stream.rs:989-1002), which maps to `skp.projection_type_not_admitted` (SKP-V0.md:1242);
  - `resolve_projection` (publish/mod.rs:530);
  - `filterable_column_type` (predicate.rs:1226-1255).

  No new `pub` item, callback or option lands. One test-text point: T1's `admit_projection` call needs `&[String]`, not `&["zone"]`.
- **Tests.** T1, T2 and T4 each have a sound reason to be red before the fix, and E1 and E2 each go red if the fix lands without their edits. The predicted red sets are in D3.
  - With D2 applied, no listed mutation has a known pass case.
  - An end-to-end test is not feasible in the suite as it stands without a test-only seam, which is not allowed. The engine side of the seam is proven by T1, and the kernel side is one call (E1).
- **Overlap.** engine/README.md lines :537 and :557 are shared with PR 350, whose Amendment 1 item 8 edits the same lines, so building on PR 350 is right (D1). The merge order agrees with ADV-2026-11-23-15 item 5.
  - None of the filed forms I read names attributes.rs, predicate.rs or stream.rs in its Scope.
  - The identity-route form changes kernel/src/skp.rs, which this form only reads. If it merges first, the skp.rs pins become historical.
  - I could not read the diffs of PRs 353, 356 or 358 to 362. The reviewer checks them with git.
- **Scope and block-on-sight.**
  - The five files and the 220-line ceiling are plausible against an estimate of about 170 lines.
  - I1 to I4 hold once D2 is applied.
  - Block-on-sight items 1 to 7 are each well formed. Items 1 and 4 now say how a temporary mutation of pool.rs is read (D3).
- **OPEN items** (not ruled).
  - OPEN-1 (A) is sound against the code, once C1 is carried.
  - OPEN-2 is sound once it is widened to ADR-021 (C1). The human accepted ADR-023's text with two amendments to §2 (ADR-023:14). So §2's list carries the human's own amended text, which argues for the human's answer.
  - OPEN-3, leaving S1 and S2 unchanged, is sound.
  - OPEN-4, keeping T3, is sound with E2's words.
- **Constitution.**
  - docs/02: the change is engine-only and stays on the control plane, with no MCP or data-plane change.
  - ADR-006: admission is pure, so no undo class changes.
  - ADR-010: neither the frame rules nor the identity rules are touched.
  - ADR-018 and docs/08: no ADR-018 vocabulary is used and no performance claim is made.
- **Records.**
  - Every quoted passage I checked matches its source byte for byte: "anything on the wire" and "In doubt, the piece is full" (ADV-2026-11-16-06:25-26), and "[B1 close placeholder]".
  - The quote "admits exactly the types above" joins words across a line wrap in the comment at stream.rs:2371-2372. That is a note only.
  - There are no line cites into the ledger and no bare self-lines.
  - I read every pinned line at a21d5de7, including all the (r) entries, and each is the lines the form means.

## Files read (at a21d5de7)

- governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md
- governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md (Scope, Amendments 1 to 4)
- governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md (§7, §8)
- governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md (header)
- governance/PLAN.yaml:7434-7450
- governance/AUTONOMY.md §21a to §21c and §22
- state/directives: the human's message of 2026-11-23; ADV-2026-11-23-15; ADV-2026-11-16-03, -04, -06 and -11
- state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md
- state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-read-architect.md
- state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-lead-data-draft.md (the lines before the title and the note after the end mark)
- docs/adr/ADR-017 §4; ADR-021 :3, :69-76 and :229-235; ADR-023 :1-80
- engine/src/attributes.rs, predicate.rs, stream.rs, dataset.rs, pool.rs, fixture.rs and error.rs, at the regions cited; engine/README.md:385-404 and :530-568; engine/Cargo.toml
- kernel/src/skp.rs:1883-1902 and :2030-2089; kernel/src/publish/mod.rs:500-569; kernel/src/session_history.rs:725-769; kernel/tests/skp_projection.rs:1104-1189
- protocol/skp/src/v0/commands.rs:222-237; protocol/skp/SKP-V0.md:1232-1247
- frontends/shell/src: attributes/projection.ts, attributes/values.ts, canvas/decodeBatch.ts:105-134, feature/FeatureTab.tsx:50-74, App.tsx:855-858
- renderer/src/compiled.rs:215-239; renderer/style-ts/src/style.ts:38-47

Model: claude-opus-5-5
