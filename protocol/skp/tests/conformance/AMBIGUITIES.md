# SKP-V0.md ambiguities found while writing conformance fixtures

Recorded, not resolved. Where one of these applied, **no fixture was written** for the ambiguous
point. Written in phase 1, from `protocol/skp/SKP-V0.md` alone (baseline
`bb98f71f43a2891d317b10a124387df9d5ee0ebf`), before any implementation file was opened.

| # | Section | Ambiguity | Consequence here |
|---|---|---|---|
| A1 | §1 `describe` (block "Brought current … skp/0.4") | The response block gives member names but not the types or value domains of `source.path_display`, `source.geoparquet_version`, `crs.asserted_by`/`asserted_at`/`definition_provenance` (only §8 says `Option<String>` for the last), `crs.axis_order`, `schema[].arrow_type`, `row_count.basis`, `sanity.reason`, or any `license` member (`declares_anything` could be bool or string). | No `describe` response fixture, positive or negative. |
| A2 | §7.2 Correction 2026-08-18 | The correction names four fields (`bbox_crs`, `filter`, `crs_assertion`, `identity`) as tolerating an omitted key, and states the mechanism generally ("a plain `Option<T>` struct field"). Whether an omitted `bbox` or `limit` key is tolerated or refused is not stated. | No omitted-`bbox`/`limit` fixture. |
| A3 | §3 scalar codecs; §5 codes | The layer at which a malformed `HexF64`, `DecU64`, `CancelKey` or version literal is refused is unstated: §3 calls them codecs ("a malformed value is a refusal, never a best-effort parse") but names SkpError codes (`skp.malformed_hex_f64`, `skp.bbox_not_finite`, `skp.version_unsupported`) which only a host can return. Whether a non-finite pattern is a codec or a bbox-validation refusal is likewise unstated. | These fixtures are `refused_any_layer`: a type-level acceptance is reported as "not observable at this layer", never as a divergence. |
| A4 | §3 `DecU64` | "decimal string" does not say whether leading zeros (`"007"`), a `+` sign, or surrounding whitespace are malformed. | No fixture for those forms. |
| A5 | §1 / §5 | "every request and response struct is `deny_unknown_fields`" — whether the `SkpError` envelope counts as a response struct is unstated. | No unknown-field fixture for `SkpError`. |
| A6 | §3 last bullet | Ordinary bounded integers "may be plain JSON numbers" — whether a string form (`"30000"` for `expires_in_ms`) is also admitted is unstated. | No fixture. |
| A7 | §1 `open_dataset` | `path` "is UTF-8, absolute" — whether a relative path is refused, at which layer and under which code is unstated. | No fixture. |
| A8 | §3 handles | `DatasetHandle`/`StreamHandle` formats are stated, but whether a client-sent malformed handle is refused at deserialization or as `skp.unknown_handle` is unstated. | No malformed-handle fixture. |
| A9 | §8 skp/0.4 last paragraph | "The literal follows merge order" and "while this is unmerged" leave the version's frozen/unfrozen status to repository state outside the spec. | The task names `skp/0.4` as current; fixtures use it. |
