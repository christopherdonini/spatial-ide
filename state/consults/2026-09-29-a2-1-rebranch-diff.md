# A2-1 — the re-commit diff under the 2026-09-29 formatting ruling

*Custodian's record (2026-09-29): the `git diff <old head> <new head>` that the 2026-09-29 formatting ruling (`state/directives/2026-09-29-a2-1-amendment-12-formatting.md`) requires before any gate carries over. Old head: `cut/b1-close-nul-names` @ 1507845. New head: `cut/b1-close-nul-names-2` @ 19f37da4e86218a682efdbc3e02a5e4c75f8a0ba. The new branch holds 1add801 (Amendment 12 re-committed), then 1a6584d and 19f37da, which are cdadc6d and 1507845 cherry-picked without `-x`: their trees apply unchanged and their messages and sign-offs are kept. The whole difference between the two heads is the three changed lines below, and in them exactly four code spans lose their backticks, one per reference to an old W2-A2 test. No gate had run on the old head, so none carries over. The new head is gated after the N-4 correction commit (see the ledger).*

```diff
diff --git a/engine/B1-PROJECTION-PREREGISTRATION.md b/engine/B1-PROJECTION-PREREGISTRATION.md
index ab28efb..4a68e6c 100644
--- a/engine/B1-PROJECTION-PREREGISTRATION.md
+++ b/engine/B1-PROJECTION-PREREGISTRATION.md
@@ -830,7 +830,7 @@ This is class 9 (scope addition), not a record correction. It is written before
   - The positional rule classifies both.
 - **k3** (a covering that names a column the file lacks, with no U+0000) fails at the first bbox item as a binder error. It is not an A2-1 case (OPEN A12-c).
 
-**Reproducers:** `a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_opens` and `a_nul_in_a_column_name_makes_admission_type_a_different_column_than_duckdb_binds`, in `engine/tests/b1_projection_hostile_names.rs` at c37b427 (`cloud/wave2-A2`, unmerged; nothing merges from it; file sha256 `515db6f692edd7b78393a13b651c9222893101fceecf5626efb2a68ddd58190d`). No code of this addition exists.
+**Reproducers:** a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_opens and a_nul_in_a_column_name_makes_admission_type_a_different_column_than_duckdb_binds, in `engine/tests/b1_projection_hostile_names.rs` at c37b427 (`cloud/wave2-A2`, unmerged; nothing merges from it; file sha256 `515db6f692edd7b78393a13b651c9222893101fceecf5626efb2a68ddd58190d`). No code of this addition exists.
 
 **12.1 §2 shape**
 
@@ -887,14 +887,14 @@ The reproducer file's three passing control tests come along unchanged:
 - `hostile_names_colliding_after_case_folding_bind_one_column_each`;
 - `hostile_names_an_uppercase_id_under_a_mapped_identity_is_admitted_beside_id`.
 
-- **N-1** `a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens`. It inverts `a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_opens` (c01).
+- **N-1** `a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens`. It inverts a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_opens (c01).
   - Asserts: the resident name is `nu\u{0}l`. `["nu\u{0}l"]` is refused `ColumnNameNotAddressable`. `["nu"]` is refused `ColumnUnknown`, with `known_columns` holding `nu\u{0}l` (under OPEN A12-a as recommended). No stream opens.
   - Mutation: `probe_schema` returns the export's names.
 - **N-1a** `a_nul_in_a_name_renders_as_a_visible_escape_in_every_engine_message_and_detail` (c01, c16, c20, k1; §8 item 34).
   - Asserts: the `Display` text and every `detail` or `reason` field of each refusal these files produce contain no raw U+0000, and name the column with U+0000 rendered as the six ASCII characters `\u0000`. That covers `ColumnNameNotAddressable`, `ColumnNotFilterable`, `GeoMetadata`, `IdentityUnusable` and `NoCoveringBbox`. Every engine log line that names such a column goes through the same rendering function.
   - Mutation: the rendering function returns the name unchanged.
   - The wire's `column` and `known_columns` fields carry the bound name itself, JSON-escaped by serialization (OPEN A12-a). Those are field values, not messages.
-- **N-2** `a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind`. It inverts `a_nul_in_a_column_name_makes_admission_type_a_different_column_than_duckdb_binds` (c02).
+- **N-2** `a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind`. It inverts a_nul_in_a_column_name_makes_admission_type_a_different_column_than_duckdb_binds (c02).
   - Asserts: `["zone"]` admits the `Utf8` column and streams values equal to a DuckDB read. `["zone\u{0}x"]` is refused `ColumnNameNotAddressable`.
   - Mutation: the function in (c) always returns `Ok`.
 - **N-3** `projectable_and_admission_agree_on_a_nul_named_column` (kernel, K-5's harness, c01 and c02).
```
