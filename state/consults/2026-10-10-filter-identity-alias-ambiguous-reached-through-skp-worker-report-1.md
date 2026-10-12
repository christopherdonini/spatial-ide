*Custodian's filing note (2026-10-10): `filter-identity-alias-ambiguous-reached-through-skp`'s worker report 1, the worker run 19:25:03Z to 19:40:06Z by its transcript, on `cut/filter-identity-alias-ambiguous-reached-through-skp` from 34d14658, head d586394581825b4c7d8653612b469ebec9c80e22, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 4a5a1fd82d3995fdfd37f0293c55cc1a431406d10f920a7024fa01cb4f68417e. The custodian checked on origin: the head, the three files' numstat (12, 97 and 12 changed lines), and that protocol/skp/SKP-V0.md decodes as UTF-8.*

---

Built and published. T-1 passes at H, M-1 and M-2 each fail it by name, and no §5 invalidator or falsification fired. H = d5863945. `git status --porcelain` is empty and the branch is pushed, up to date with origin.

**Commits** (branch `cut/filter-identity-alias-ambiguous-reached-through-skp`, on top of 34d14658)
- caf131fd: T-1 added, with the mutation commit ids left as placeholders.
- 2f42e0ab: T-1's doc records M-1 and M-2 with their observed commit, caf131fd.
- d5863945: the corrected paragraphs in `SKP-V0.md` §7.5 and in `identity_alias_ambiguity`'s doc comment.

**T-1 final name:** `a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`. It is the proposed name, unchanged, in `kernel/tests/skp_admission_remediation.rs`, `#[tokio::test(flavor = "multi_thread")]`.
- F-1 is written by `write_geoparquet` with `StringIds`, `FilterWitness`, 2 features, `avg_vertices` 6 and `hole_every` 0.
- It uses `SkpHost::new` over a fresh `Catalog`, holding a `StreamRegistry` clone.
- (i) `open_dataset` with identity null is refused as `engine.identity_unusable`, column `id`, and `candidate_columns` split on commas contains `u64`.
- (ii) `open_dataset` with `IdentityDeclaration{column:"u64"}` is admitted, and `describe` gives `mapped:u64`.
- (iii) `viewport_query` with `Filter::new("id = 'key-1'", FILTER_DIALECT_DUCKDB_EXPR_0)` is refused as `skp.filter_identity_alias_ambiguous`. Its keys are exactly `column` (`id`) and `source_column` (`u64`).
- (iv) `cancel_all_for_dataset` returns 0.
- It never uses `Catalog::open_cancellable` and never sets `skip_uniqueness_check`.
- Seams read before writing: `kernel/src/skp.rs:1099`, `:1372`, `:367`, and `IdentityDeclaration` at `protocol/skp/src/v0/commands.rs:52-59`. The commits cite them.
- Caller grep: I added no `pub` item, callback or option.

**Corrected texts as committed.** They match §2.2 and §2.3 exactly, with `<T-1>` set to the name above and `<date>` set to 2026-10-10. The doc-comment version is the same text as it sits in `engine/src/predicate.rs`. In `SKP-V0.md`:
```
`skp.filter_identity_alias_ambiguous` is refused when the dataset's identity is mapped from a
column other than `id` (ADR-016 §3; `open_dataset`'s `identity`, §1) and the file also carries its
own column named `id`, whatever that column's type: a predicate naming `id` cannot say whether it
means the wire identity or the file's column. Any client that declares an identity on
`open_dataset` for such a file reaches it; proven through the host by
`kernel/tests/skp_admission_remediation.rs::a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`. *(Corrected 2026-10-10: this paragraph called the
code unreachable from any product entry point. That stopped being true when the
admission-remediation cut (`skp/0.2`) threaded `open_dataset`'s `identity` into the engine.)*
```
In `engine/src/predicate.rs`:
```
/// **Reachable from the product** (corrected 2026-10-10). `open_dataset`'s `identity` reaches
/// `Dataset::open_cancellable` as a declared identity, which `admit_identity` makes
/// `IdSource::Mapped`; on a file that also carries its own `id` column, a predicate naming `id` is
/// refused here. Proven through SKP by `kernel/tests/skp_admission_remediation.rs::a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`. The note
/// this replaces said no product entry point constructed a `Mapped` identity; that stopped being
/// true when the admission-remediation cut threaded `open_dataset`'s `identity` into the engine.
```

**Mutations.** Both were applied by hand, the test was run, and the change was reverted. `git status --porcelain` showed `[]` after each revert. Both ran with base HEAD = caf131fd, with `--test skp_admission_remediation a_declared_identity_beside` in a shared hold.
- M-1: I made `identity_alias_ambiguity` return `None` at the top of its body. T-1 failed at (iii), `skp_admission_remediation.rs:334`, with "a predicate naming `id` must be refused as ambiguous: ViewportQueryResponse { stream: StreamHandle(…), expires_in_ms: 30000 }".
- M-2: in `SkpHost::open_dataset` (`kernel/src/skp.rs:1119`) I replaced the `host_minted_identity_declaration` result with `let identity = None;`. T-1 failed at (ii), `skp_admission_remediation.rs:312`. The declared open was refused with code `engine.identity_unusable`, message "refused: `id` cannot serve as stable feature identity — type is Utf8; identity must be an integer that widens into u64 without transformation. …", and fields `candidate_columns` "i64,u64", `column` "id".
- Both are recorded in T-1's doc by symbol, with caf131fd.

**Printed message (Amendment 1 item 2).** I ran T-1 once at H = d5863945 with a scratch `println!` after the code assert, `-- --nocapture`. I reverted the line and the worktree was clean. Printed, byte for byte:
`refused: `id` is ambiguous — this dataset's identity is mapped from `u64`, and the file also carries its own, unrelated column literally named `id`; a predicate cannot say which one it means`
It matches the Display arm at `engine/src/predicate.rs:338-343`.

**Suites at H**, once each, in one shared hold, with `CARGO_BUILD_JOBS`=8 and `RUST_TEST_THREADS`=8. All exit codes were 0 and the hold was granted.
- `skp_admission_remediation`: 7 passed.
- `spatial-kernel --lib`: 153 passed.
- `predicate_admission` and `filter_type_admission`: 3 passed. The 277 s is the run's own time; I made no timing claim.
- `cargo doc -p spatial-engine --no-deps`: 19 warnings, all of the kinds "links to private item" or "unresolved link". The only ones mentioning `identity_alias_ambiguity` are from the module doc's existing link, and my text has no link. I ran no baseline doc build, so "none new" is by reading, not by comparison.
- `cargo fmt --all --check`: clean.

**§7 figures** (`git diff --numstat B H`). B = `git merge-base origin/main H` = 34d14658.
| File | Added | Deleted | Total | Ceiling |
|---|---|---|---|---|
| `kernel/tests/skp_admission_remediation.rs` | 95 | 2 | 97 | 110 |
| `engine/src/predicate.rs` | 6 | 6 | 12 | 20 |
| `protocol/skp/SKP-V0.md` | 8 | 4 | 12 | 20 |
| All three | | | 121 | 150 |

There is no overrun. Of the 2 deletions in the test file, one is the fixture import line `write_geoparquet, CrsMode, …`, rewritten to add `AttributeMode`, and the other is the `spatial_skp::v0` import list, which I widened.

**§8 items 1 to 10:**
- Item 1: no code before the form and the flush merge (7b3d8040); none breached.
- Item 2: only the `predicate.rs` doc comment changed; no `kernel/src`, `protocol/skp/src`, `frontends` or other product edit. Both mutations were reverted, and `git status --porcelain` was empty.
- Item 3: no change to the engine message, wire literal, fixtures, §8 of `SKP-V0.md`, or any user-visible string.
- Item 4: `fixture.rs` untouched, and T-1 uses only main's `StringIds` and `FilterWitness`.
- Item 5: T-1 goes through `open_dataset` and `viewport_query` only.
- Item 6: only §7.5's paragraph changed in `SKP-V0.md` (hunk `@@ -482`), heading count unchanged.
- Item 7: the corrected texts are the declared ones.
- Item 8: no `path:line` and no intra-doc link in the code comments. The `file::test` reference is a path plus a name, as declared.
- Item 9: no `pub` item, dependency, OS cfg, ignore, sleep, retry or timeout.
- Item 10: no §7 overrun. Each mutation was observed by applying it, with its failing step and commit recorded. The `verify-mutation` tool was not used. The commit ids named are on the unmerged branch and have no hash pin.

**Differences from the form**
- None in the work. The form's `<T-1>` name is the proposed name.
- A first Python edit of `SKP-V0.md` wrote a lone 0xA7 byte for each `§` in the new paragraph. I fixed it to UTF-8 before committing, and the committed file decodes as UTF-8.
- The test doc's mutation commit ids were placeholders in caf131fd and are filled in 2f42e0ab. Both mutations were observed at caf131fd.

**Off-scope, not done:** `kernel/README.md` and `engine/README.md` owner's-index updates are lead-data's. I opened no pull request.
