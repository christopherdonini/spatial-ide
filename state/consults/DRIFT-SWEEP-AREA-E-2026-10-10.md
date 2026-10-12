# Drift sweep, run 3, area E (stated limits and tests against main) — 2026-10-10

Provenance. An independent, read-only agent on the Claude Platform (Claude Fable 5.1, high effort) cloned the public repository and swept the commit named in the report's first line. It changed nothing. The advisor started the run through the platform's API at the human's request and fetched this text from the session's final message (session sesn_01Xdvma3Um4cJoTvgxve8vts). Run figures from the session record: about 20 minutes active, 22.6M cached input and 54.7k output tokens, US$ 11.67. The advisor asked the agent at US$ 9.11 to finish the checks in hand and report, so the "Not got to" list is longer than it would otherwise be. The text below the rule is the agent's report, unedited. The advisor's checks against main are in the advisor's reply to the human, not in this file.

---

Repository: https://github.com/christopherdonini/spatial-ide — Area E (KNOWN-LIMITATIONS.md against main; tests whose name, comment or assertion describes behaviour main no longer has, or that cannot fail) — commit swept: 9e7362dbc67d00cae0c3ecc931de4e6c3b46a263 (head of main)

## Findings

**1. KNOWN-LIMITATIONS item 2 states three CRS refusals that main no longer makes, and no "on main" paragraph says so.**
- Where: `KNOWN-LIMITATIONS.md:34-57` — "never applies a default" (:39); "A file whose `geo` metadata has no `crs` key is refused — GeoParquet's OGC:CRS84 default is deliberately not applied" (:43-44); "A CRS whose definition declares latitude first is refused, not reinterpreted … EPSG:4326 … is refused" (:52-55); "admitted … only if the declaration establishes an easting-first axis order" (:37-38).
- Code: `engine/src/geoparquet.rs:16-23, :497-501, :566` — an absent key under a pinned spec version admits as OGC:CRS84 with provenance `crs:format-default`; `engine/src/dataset.rs:397-426` — a declared lat-first definition is admitted carrying the format's WKB order (`axis:format-override`); the refusal narrows to caller-asserted non-x-first and unpinned versions. Pinned by `engine/tests/admission_format_semantics.rs:75` (F-1) and `:219-233` (F-4 opens EPSG:4326). ADR-032 Accepted 2026-09-23.
- Why it matters: the headline admission rule for most public GeoParquet; the only "on main" markers are :20 and :191, so a reader of main predicts a refusal the build does not make. The human's convention for the identical case on item 3 (an "On `main`" paragraph, `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md` item 4) has no counterpart here and no PLAN node carries it.
- Confirmed.

**2. A test's name says the keyless file is refused; its body asserts it admits, and two files cite it by that name.**
- Where: `engine/tests/identity.rs:139` `a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared` (watchdog label `a_foreign_key_column_needs_a_declaration`, :140).
- Code: `:148-166` opens with `.expect("R-I3: a single-file keyless source now admits")` and asserts `IdSource::SessionOrdinal` (ADR-016 Amendment 1, Accepted 2026-09-23). The name is propagated at `engine/src/identity.rs:254` and `engine/tests/admission_instruments.rs:67`. `engine/ADMISSION-PREREGISTRATION.md:294` records the assertion change, not the name.
- Why it matters: test names are used as pin lists for what the engine refuses; this one states a refusal that no longer exists.
- Confirmed. Not in `e2e-stale-expectations-reaim`'s scope (e2e steps and `manual_walkthrough_fixtures.rs` generators only).

**3. `App.test.ts` says the per-dataset `WorkingCanvas` remount is "not tested here or anywhere in this suite" and that no harness in the package can mount React; `App.layout.test.tsx` mounts the real `App` and tests exactly that.**
- Where: `frontends/shell/src/App.test.ts:48-63`; same premise at `frontends/shell/src/admission/AdmissionPanel.test.ts:24-25` and `frontends/shell/src/admission/CrsAssertionForm.test.ts:13-14` ("JSX no harness in this package can mount").
- Code: `frontends/shell/src/App.layout.test.tsx:1-15, :110-120, :282-297` — mounts `App` in jsdom (`vitest.config.ts:10`), stands in `WorkingCanvas` with a per-handle mount/unmount counter, and R1 asserts "a reopen mounts the new handle once and unmounts the old one once". `OriginMismatchState.test.tsx:29-50` (2026-09-08) and `HoverReadoutView.test.tsx` already mount components via `react-dom/client` + `act`.
- Why it matters: the header sends readers to e2e `REOPEN'` as the only evidence for the remount and declares React untestable here, so coverage decisions rest on a false map.
- Confirmed. (`shell-stale-layout-comments-and-s1-row` covers only `layoutBoundary.test.ts`'s header.)

**4. `renderer/tests/style_shell_agreement.rs` grounds its stub-schema argument on "`viewport_query` carries no attributes", a wire restriction lifted at skp/0.6.**
- Where: `renderer/tests/style_shell_agreement.rs:37-38`.
- Code: `protocol/skp/src/v0/commands.rs:441-447` — `ViewportQueryRequest.columns` since skp/0.6 (now skp/0.11); `frontends/shell/src/style/document.ts:18-22` was corrected ("this shell simply requests none"). ADR-023's carried condition 1 (`docs/adr/ADR-023…md:144`) required that assertion corrected "in the same piece — never left as a lie". The sentence also survives at `frontends/shell/src/canvas/buildLayers.ts:31` (area A, same topic).
- Why it matters: the conclusion (literal-only) still holds, but the stated reason is wrong, so when b1-shell-half adds `match` a reader hunts for a protocol change that already happened.
- Confirmed.

**5. A unit test's comment says the GeoParquet CRS default is "Not applied: see the module comment"; the module comment says it is applied.**
- Where: `engine/src/geoparquet.rs:867-872` `an_absent_crs_key_is_not_silently_ogc_crs84`.
- Code: `engine/src/geoparquet.rs:16-19` — "An *absent* `crs` key is admitted as OGC:CRS84 … provenance `crs:format-default`". The assertion (no *declared* CRS at parse) is still right; the comment and name describe the pre-Brief-A rule.
- Why it matters: unit-test-level statement of finding 1's rule, pointing to a comment that contradicts it.
- Confirmed. (`module-docs-stale-statements` names other geoparquet.rs lines, for "Proposed" only.)

**6. The on-main items' unpinned `path:line` cites no longer land where they say.**
- Where: `KNOWN-LIMITATIONS.md:246` (item 20: `dataset.rs:283-291`, `:1356-1396`, `error.rs:348-352`, `skp.rs:1187-1189`), `:267` (item 22: `dataset.rs:1021-1038`, `:1162-1171`, `:981-1031`), `:235` (item 19: `error.rs:342-347`).
- Code: gate at `engine/src/dataset.rs:326`, `partitioned_source_detail` `:1646-1687`, Display `engine/src/error.rs:383-388`, wire code `kernel/src/skp.rs:2093`; `sanity_check` `dataset.rs:1193` (`convicts` `:1223`), `convict_or_record` `:1332-1358`; `SourceChanged` Display `error.rs:377`.
- Why it matters: the header (:10-11) promises each line's source "can be checked"; these are not `@ commit` pinned and land on unrelated code.
- Confirmed; low stakes.

**7. A measurement-test doc comment still calls ADR-018 Proposed.**
- Where: `kernel/tests/first_batch_factorial.rs:1291`.
- Code: `docs/adr/ADR-018…md` Status "Accepted — 2026-08-08".
- Why it matters: "Proposed binds nothing" is review-blocking here; test-file instance of area D finding 8.
- Confirmed, minor.

## Checked and found current
Items 17–39 against `tileGrid.ts`, `offsetFrame.ts`, `descriptor.rs`, `watch.rs`, `skp.rs` (queue bound, `try_send`), `publish/mod.rs` preflight order and both Displays, `lod.rs`, `geoarrow.rs`, `buildLayers.ts`, `pickResolution.ts`, `EXIT_DRAIN_CEILING`, staging name, `--audit-show` text; item 1's platform paragraph against `product-ci-rust.yml` and port-* statuses; item 9's covering sentence against `judge_covering`; v0.1.0 items 5, 7, 10, 12, 13 spot-checked for silent main changes — unchanged. The item-2 axis-order quotation is main's wording by ruling (entry 94). No test found that cannot fail: `it(` blocks without `expect` are tsc-level or throw via helpers; Rust tests without asserts delegate to asserting helpers or are declared child processes.

## Already tracked in PLAN.yaml (left out)
`e2e-stale-expectations-reaim` (KNOWN-LIMITATIONS item 3; C2'/C3', MAP', BOTHNEEDED', HEXLIM', GROUP', REFUSAL', S4; "refusing" fixture generators in `kernel/tests/manual_walkthrough_fixtures.rs:477-497`), `e2e-failures-present-at-the-base`, `e2e-hover-establishing-read-stale`, `e2e-first-poll-readout-elsewhere`, `source-changed-post-reopen-routes-watcher-visible`, `mp-prime-e2e-covered-fixture`, `publish-sort-window-cancel-not-exercised-on-ci`, `first-batch-factorial-ignored-trace-tests`, `module-docs-stale-statements` (kernel README H2 row vs `end_to_end.rs:385-430`, whose stale name is disclosed in-line), `shell-stale-layout-comments-and-s1-row`, `shell-stale-frame-comments`, `extent-degenerate-zoom-doc` / `crs-zoom-constants-per-unit`, `shell-map-refill-after-resize` (item 39), `identity-declaration-route-for-session-tier`, `release-v0-1-1` (QUICKSTART identity bullet), `shell-owners-index`, `timing-tests-assert-property-not-budget`, `timing-assertions-under-contention`, `typed-terminal-codes-post-check-race`, `skp-drained-stream-helper-post-check-race`, `stream-doc-first-batch-claim`.

## Not got to
Bodies of vitest suites beyond `App*`, `admission/*`, `canvas/extent|pickResolution|tileGrid|offsetFrame`, `style/document`, `residency/*` headers; e2e step bodies beyond refusal/summary/message assertions and tracked steps; `#[cfg(test)]` modules in `kernel/src/skp.rs`, `engine/src/stream.rs`, `engine/src/predicate.rs`; `protocol/skp/tests/conformance`, `renderer/bundle-viewer/scripts/*.test.mjs`, `tools/mods/*/test`; whether the live `CrsUndeclared` message ("This engine does not apply GeoParquet's OGC:CRS84 default", `engine/src/error.rs:282-286`) should still say so — a product string, outside this area.

