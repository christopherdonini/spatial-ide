# PR #210 gate 1 — reviewer
Reviewed: cut/skp-v0-live-sections-current-area-c @ a8b45622084e0aa0f4ffd761a19921b706b38f76

**Verdict: PASS. There are no Correctness or Evidence findings. Six Documentation findings (D1–D6) must be fixed in this PR before the merge, with no re-gate.**

Base B is 1457fbd0a09464c03082a2aea3df65dd1171bc95. Under proportional gates (`state/directives/2026-10-05-product-first-direction.md:15 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`), only C and E findings block.

## Correctness

**None.** I checked every rewritten sentence against its pinned facts at B. I re-ran all 116 pins in the form's §0–§9 by script:
- 110 hash at B.
- 6 do not. Four are the `kernel/README.md` lines that Amendment 2 lists. Two are the Authority pins into `PLAN.yaml` (4406-4422 and 1977), which are moved lines.
- No pinned code or ADR fact changed, so there is no invalidator.

Row by row:

- **S1 holds.**
  - `OpenDatasetResponse` has `dataset` and `session` (`protocol/skp/src/v0/commands.rs:63-69 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:9891becfbe8c3ce6cac63e3b1b68507bc1a2fbf74d9a43fd5e55654bcf680254`).
  - I checked every struct inside `DescribeResponse`: SourceInfo, CrsInfo, GeometryInfo, IdentityInfo, FieldInfo (now with `projectable`), RowCount, Extent, LicenseInfo, SanityInfo, SourceCoverage, SourceChecks and EndReason. Every member is in the block at the head, and the value domains match the serde `rename_all` values.
- **S3 holds, clause by clause** (`protocol/skp/SKP-V0.md:210-215 @ a8b45622084e0aa0f4ffd761a19921b706b38f76 sha256:158eb289451fb7cb5ef41bd6bea890017c3f1c181acb1a8f02647046d7688894`):
  - (a) "no `publish`": at B, a script found no publish struct, enum or fn in `protocol/skp/src` (rc 1). The self-test on `OpenDatasetRequest`/`DescribeRequest` hit (rc 0). The handler list in `frontends/shell/src-tauri/src/lib.rs` has five SKP commands and no publish.
  - (b) The UI reaches publish through `binding_publish_*`, outside SKP. This rests on the module doc's binding-local family (`frontends/shell/src-tauri/src/commands.rs:11-12 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:c21fa7cddc0156715bed25e4cba0a19f52ff453be417e3ff366ff8c9960fabcc`). It also rests on the prepare, execute and cancel commands and their registration, and on `surfaceRegistry.ts`/`PublishPanel.tsx` as the callers.
  - (c) "discharged … for that UI surface only": the exposure review says this (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1127-1132 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:524f064a91fbf53c0aa99f476e9702d2fb46dd81c24a83ac35f5a607fd95a174`), and so does its completion (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1134-1142 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:b3e3a630c64e504061231df63ea6005bb3a4e38e486aa4427bbc0d1899b148e3`).
  - (d) The surface list is exactly the list at 1129-1131. The CLI parenthetical matches the completion's own CLI sentence. No surface is added and none is dropped. Nothing goes beyond ADR-017's text, so block-on-sight 6 is not triggered.
- **S4 holds** (`protocol/skp/SKP-V0.md:29-32 @ a8b45622084e0aa0f4ffd761a19921b706b38f76 sha256:7e6773ea853096efcc161a3d93fe88028d2fae42988f6dfe81b76ad47c277864`).
  - `SkpHost::open_dataset` passes `&req.path` unchanged to `Catalog::open_cancellable`, then to `Dataset::open_cancellable` and `open_inner` (`kernel/src/skp.rs:1172-1176 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:8d462b3675a380dc820c2632ed21dff5cda6aabca04092458adfc9500b582e06`).
  - `partitioned_source_detail` runs before `is_file` (`engine/src/dataset.rs:325-327 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:d1a7cf72b1130653d6da62a02413e06cdd3eb53a0711b3f1b1d4f85a02fd6b16`). The `Source` text follows (`engine/src/dataset.rs:328-332 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:21ff4035de8e654869eb77548d9bce00b07bb53cf6ac7fe1f60f165ac6a672b7`).
  - At B, the only `canonicalize` on the open command's path is the watcher's own copy (`engine/src/watch.rs:603-605 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:f3081f4e42cfcd969539e445cad9dcf677d131535332d97ac8ee753fa632c138`). It is armed before the open and is not passed to it. "passes it to the engine's open as received, without canonicalizing it" is therefore exact.
  - I found no `canonicalize` in `frontends/shell/src-tauri/src` outside a publish test.
- **S5a holds.**
  - The deserializer maps both cases through `serde::de::Error::custom` (`protocol/skp/src/v0/codec.rs:69-77 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:a303c98412709a846406007b98d4499905420dc45e2412fa35322c81c338c5b5`).
  - A Tauri argument-decode error is not an `SkpError` object, so `call` records it as thrown and rethrows `e` (`frontends/shell/src/skp/client.ts:58-65 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:b075b19b3e368be9bb5ee955cf2920ea6f10c00e0149ebf00e73c9b10480ea31`).
  - The new text makes no claim about Tauri's error text or about an end-to-end test.
- **S5b and S5d hold.**
  - At B and at the head, the call-site scripts find 0 calls for each of the three constructors. The self-test `cancel_key_in_use` finds 1.
  - Across history, every diff line naming the three constructors outside `fn` definitions: 0. So "never produced" holds by constructor.
  - A string-literal scan finds only the definitions and the test literal at `error.rs:156`.
- **S5c holds** (`kernel/src/skp.rs:1556-1568 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:ce90281111de2eb46aabd634fc0b1a8cbb4fe691cf0f3bec909106acfd9d0437`). `check_version` comes first, then a `StreamHandle` parse that routes to tickets or opens, and each lookup returns `Unknown` on a miss.
- **S5e holds.** At the head, nothing outside `codec.rs` names `HexF64ParseError` or `from_hex` except the re-export in `mod.rs`.
- **S6, S7, S8, S9, S10 and S11 hold.**
  - S6: `decodeDatasetSessionEnded` and `listenDatasetSessionEnded`.
  - S7: the `SessionRef` doc.
  - S8: seven `ProjectionError` arms, with `projection_empty_list` in `viewport_query_build_error_of`.
  - S9: `SKP_VERSION = "skp/0.11"`, with §8 entries 0.7 to 0.11.
  - S10: §9.5 has eight rows.
  - S11: the §5 cites.
- **SX2 holds.** 433413a is on main (`merge-base --is-ancestor` rc 0). Its block-on-sight 3 is the bare-`generation` rule. The draft was deleted in 42a5f348, the acceptance commit.
- **SX3 holds** (`docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:8f94f2d6ca945be6f3d213b793e153c6724eb9a61a7a273271a4767684bac1e8`). `by-construction-within-generation` appears in Amendment 1 (line 208).
- **S12 claims (ii), (iii) and (v) hold.**
  - The fixture counts are 6 `skp.malformed_hex_f64` and 3 `skp.bbox_not_finite`.
  - Nothing in `*.rs`, `*.ts`, `*.tsx`, `*.mjs` or `*.js` reads `expected_refusal_code`.

## Evidence

**None.**
- E1, E2, E5 and E7–E10 hold by my own runs (Checks below).
- E3 and E4 were not re-run by this gate. They rest on the worker's runs and on CI's green cargo test and vitest jobs.

## Documentation (each must be fixed before the merge)

- **D1. Bytes changed inside an existing quoted span** (§2.0(d), §8 item 11). In `protocol/skp/src/v0/handles.rs:13-15 @ a8b45622084e0aa0f4ffd761a19921b706b38f76 sha256:2e8ee0bc851054ff24a39e8b4fe894157b44a471aab1618c12cfbca8f638c270`, the reflow splits ADR-016's "stability across reopen" across a `//!` continuation. The span's bytes are no longer identical to B (`protocol/skp/src/v0/handles.rs:11-13 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:c876fc4f1feb5694911e2b382604090c39ac960d933216d12dd931097eed96ab`). Rewrap so the quoted span sits whole on one line.
- **D2. The §9.1 dated note is out of order** (`protocol/skp/SKP-V0.md:1129-1134 @ a8b45622084e0aa0f4ffd761a19921b706b38f76 sha256:88854c2cbb181498836c801b9df3de8d562b5fe61b9c0b087927a4849e8d2380`). The 2026-10-11 note sits above the 2026-09-29 `skp/0.7` note. That note then reads as the later word ("is now compared against `"skp/0.7"`"). Move the new note below the `skp/0.7` note, which is the end of §9.1's existing text.
- **D3. Unedited sibling statements now contradict the rewritten text.** Each lies outside its row's lines, so fixing it needs a class 9 amendment before the edit. Alternatively, the custodian records the routing in the PR before the merge.
  - (a) `protocol/skp/src/v0/commands.rs:22-23 @ a8b45622084e0aa0f4ffd761a19921b706b38f76 sha256:8f0a13410492f28ed47e56e2f68f44a6a3445ff7b76e6a9117493cadd0fd1cd7` says the path is "canonicalized and checked by the host". S4 now says the opposite. Amendment 1 item 6 limits `commands.rs` to lines 199-200.
  - (b) `protocol/skp/SKP-V0.md:59-60 @ a8b45622084e0aa0f4ffd761a19921b706b38f76 sha256:3ac0501a72423ef6962e76f5afb898b948ca5732e52c34ee1cd27b13318afc21` says "Every field maps to an existing `engine::Dataset` accessor". It now sits directly over `coverage` and `session_end`, which come from the host's `watches` and `generations` (`kernel/src/skp.rs:1308-1359` at B), not from `Dataset` accessors. It was already untrue at B for the response, but the piece now lists those members under it.
  - (c) `protocol/skp/src/v0/codec.rs:13` still says "a malformed value is a refusal". §3's lead now says "rejected" on purpose.
- **D4. The S12 §8 note under-records** (it becomes append-only at merge, so fix it now).
  - S12 (i) asks for each in-place change by section. The note omits §1's `describe` lead rewrite and §3's lead change from "refusal" to "rejected".
  - "the nine `HexF64` fixtures" reads as if there are nine. There are ten `any-hex-*` fixtures; nine carry a code, and `any-hex-json-number` carries none. Write "the nine `HexF64` fixtures that carry one".
- **D5. The PR body's pin arithmetic does not reproduce.** The body says "110 of the form's 114 pins hash the same at B. The other four are the kernel README lines." By script, the form's §0–§9 carries 116 pinned references, 110 of which hash at B. The 6 that do not are 4 `kernel/README.md` and 2 `PLAN.yaml` (the Authority pins). Correct the body. The filed worker report is a record and stays as filed.
- **D6. §2.6 owner's index is not in this head.**
  - The `kernel/README.md` line (ceiling 2) is still owed in this PR.
  - lead-data's three-pointer check against H is also owed (`kernel/README.md:356`, `:357` and `:363 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95`, per Amendment 2).
  - This gate covers neither.

Observations (no finding):
- A client cancel key shaped like `sh_` plus 32 hex digits passes `parse_cancel_key`, and is then looked up among tickets. The new S5c sentence states that rule exactly.
- Four new `SKP-V0.md` lines run past the file's usual wrap.

## Checks

1. **Diff.** `git diff --numstat origin/main...origin/cut/skp-v0-live-sections-current-area-c` returned rc 0.

   | File | Lines (+/−) | Ceiling |
   |---|---|---|
   | `SKP-V0.md` | 67 (49/18) | 130 |
   | `error.rs` | 3 (3/0, insertions only) | 9 |
   | `handles.rs` | 10 | 24 |
   | `kernel/src/skp.rs` | 9 | 6 + 10 (OPEN-2) = 16 |
   | `types.ts` | 5 | 8 |
   | `codec.rs` | 6 | 8 |
   | `commands.rs` | 4 | 6 (Amendment 1 item 5) |
   | `kernel/README.md` | 0 | 2 |

   The total is 104 lines in 7 files, against 206 lines and 10 files. Every path is inside §7 plus Amendment 1. HEAD, origin and the merge-base were confirmed as a8b45622 and 1457fbd0, and `git status` was clean.
2. **Sentences against pins.** The pin script returned rc 0 (116 in the form body, 110 at B, 6 explained). The rows are covered under Correctness.
3. **E1.** I ran `git diff -U0 B H -- '*.rs' '*.ts'` and filtered to lines that are not comments.
   - 37 changed lines, 0 of them non-comment (grep rc 1). The positive self-test hit (rc 0).
   - `error.rs` has three `///` insertions only, each directly above its constructor.
4. **E2.** All four runs were under a shared hold, with `CARGO_TARGET_DIR=D:/wt-targets/skpe`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`. Every hold was granted and released, and none returned 96–99.
   - `cargo test -p spatial-skp -- --list`: rc 0 at H and rc 0 at B (a temporary detached worktree at B, since removed). `cmp` rc 0: 52 tests, sha256 12e6209e9b8de600deda89acb04c1fe9e942d6adba22499ace9cb0a1fca5fe2c for both.
   - `cargo test -p spatial-kernel -- --list`: rc 0 at H and rc 0 at B. `cmp` rc 0: 391 tests, sha256 dc7035c6c8bd8a4d4a241d6e19778c189f20a61bced854b41709596afed76d29 for both.
   - The B builds compiled from the B worktree's own paths.
5. **E5, E7, E8, E9.**
   - E5: `cargo fmt --all -- --check` rc 0.
   - E7: `git diff --quiet B H -- protocol/skp/tests protocol/skp/src/v0/mod.rs protocol/data-plane frontends/shell/src/skp/__tests__` rc 0.
     - The self-test on `commands.rs` returned rc 1. Its only hunk is `@@ -199,2 +199,2 @@`.
     - `types.ts` line 15 is identical (`diff` rc 0).
     - `docs/adr`, `KNOWN-LIMITATIONS.md`, `engine` and `kernel/README.md` are unchanged (rc 0).
   - E8: §8 at B (543 lines) is a byte-identical prefix of §8 at H (`cmp` rc 0). The only addition is the S12 note, placed before `## 9.`.
   - E9: outside §8 at H, each reserved code occurs once, on line 345. The self-test `skp.version_unsupported` gave 2; at B the counts were 1, 2 and 2.
6. **Quotation marks.**
   - The only new `"` marks are wire value literals inside the `describe` code block and `` `state: "unknown"` ``. They are not quotations.
   - The spans "no server-to-client push" and "no wildcard arm" are unchanged.
   - The span "stability across reopen" changed bytes (D1).
7. **Governance at H.** All four were run in the worktree, whose tool commit is c813c6ab74ce4c8e32eb63a6357930a4715880a3 (the last commit touching `scripts/plan`).
   - `node scripts/plan/verify-cites.mjs` rc 0 (PASS, 49 advisories, none in this diff).
   - `node scripts/plan/verify-quotes.mjs` rc 0 (PASS).
   - `node scripts/plan/verify-test-claims.mjs` rc 0 (PASS).
   - `node scripts/plan/verify.mjs` rc 0 (PASS).
   - Every test named in §2 exists at the head (one `fn` each). `frontends/shell/e2e/publish.mjs` exists, as do the SH6 block and the "untyped transport failure" case.
8. **CI.** `gh pr checks 210` was first rc 8, with one job pending (windows-latest). I watched it with `gh pr checks 210 --watch --interval 60` (rc 0) and then re-ran `gh pr checks 210`: rc 0, 18 of 18 pass. Both runs have headSha a8b45622084e0aa0f4ffd761a19921b706b38f76.
9. **Low profile.** The title, the body and the three commit messages have no outside issue, PR or link. The only links are in the body's attribution trailer. The only PR reference is in-repo (#209). There are no @mentions, and each commit carries only its Co-Authored-By and Signed-off-by trailers.

Final `git status --porcelain` in `C:/dev/wt/skpe`: empty (rc 0). HEAD is a8b45622084e0aa0f4ffd761a19921b706b38f76, and the temporary B worktree has been removed.
