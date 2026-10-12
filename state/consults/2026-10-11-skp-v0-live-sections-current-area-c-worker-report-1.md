*Custodian's filing note (2026-10-11): skp-v0-live-sections-current-area-c (the docs lane's piece e) worker report 1, the worker run 15:58:49Z to 16:27:18Z by its transcript, on cut/skp-v0-live-sections-current-area-c, B 1457fbd0a09464c03082a2aea3df65dd1171bc95, head a8b45622084e0aa0f4ffd761a19921b706b38f76, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with one final newline added. The sha256 of the report as handed back is 4127decb9785f844830f016be0a0115443f4e7ddf7ce136f734881eec4781cd8.*

---

Piece e (skp-v0-live-sections-current-area-c) is built and pushed. It stopped short of §2.6, as ordered, so the `kernel/README.md` owner's-index lines and their line count are still to come.

**Pin recheck.** I checked all 114 `path:line @ rev sha256` pins of the form against the tree at B, after setting aside four hand-written ones (none touches an edited file). 110 match as written. The 4 that do not are the `kernel/README.md` lines Amendment 2 already lists (§2.6). In those four rows B's tree is authoritative. There was no changed fact (no invalidator). Amendment 1's pins at d8f2b800 match.

**Head and commits.** Head is a8b45622084e0aa0f4ffd761a19921b706b38f76, on top of B = 1457fbd0a09464c03082a2aea3df65dd1171bc95. The three commits, all `docs:` with sign-off and trailer, are:
- d375b2e1: SKP-V0.md rows S1, S3, S4, S5a-c, S9-S11.
- 9dc34200: comment rows S5d, S5e, S6, S7, S8, SX2, SX3.
- a8b45622: S12, the §8 note.

**Rows (file; what it now says).** Lines are as of head; the S12 note is §8, lines 1106-1115.
- S1 and S4, `protocol/skp/SKP-V0.md`:
  - Line 26: `open_dataset` returns `{ dataset, session }`.
  - Lines 29-32: the path is passed to the engine's open as received. A directory or glob path is refused as `engine.identity_ordinal_partitioned_unsupported`, and any other non-file as `engine.source`.
  - Lines 62-63: the `describe` lead now says it carries every member the host sends at the literal §4 item 3 states.
  - Lines 80-88: `schema[].projectable`, `coverage`, `checks` and `session_end` are in the block.
- S5c, line 123: `cancel` tells a `sh_` handle from a cancel key by shape, answers `unknown` when neither is found, and still refuses a version mismatch first.
- S5a, lines 190-196: the lead says a malformed value is "rejected", not "refused". A bad `HexF64` is rejected by its deserializer before any command runs, and the shell client rethrows the non-`SkpError`.
- S3, lines 211-215: publish is reached only through the shell's `binding_publish_*` commands. ADR-017's 2026-08-17 completion covers the UI surface only. SKP, CLI-as-product, MCP, plugin, notebook and AI each still need their own review. No other surface is named.
- S9, lines 234-235, 380-382 and 1129-1131: §4 item 3 now states `skp/0.7` to `skp/0.11` and that the host compares `skp/0.11`. §1's lead points there. §7.1 and §9.1 each carry a dated note.
- S5b, lines 343-346: the `skp.` example list drops the three codes. A new line lists them as reserved and not produced at `skp/0.x`.
- S10, line 1183: §9.5's heading reads "eight codes".
- S11, lines 270 and 486: both cites now say §5.
- `protocol/skp/src/v0/error.rs` (S5d): three `///` lines, 75, 85 and 95, each saying "reserved, not produced at `skp/0.x`, nothing calls it" and pointing to §5.
- `protocol/skp/src/v0/codec.rs` (S5e): lines 15-18 now say the `Deserialize` turns either parse error into a serde error with the `Display` text, and that no caller maps it to an SKP code.
- `protocol/skp/src/v0/handles.rs` (S7): lines 4-16 now state three minting rules, add a `SessionRef` bullet, and say all four kinds are session-scoped.
- `frontends/shell/src/skp/types.ts` (S6): lines 290-293 name `decodeDatasetSessionEnded` and `listenDatasetSessionEnded` as the consumers.
- `kernel/src/skp.rs` (S8): lines 1722-1724 map seven codes in `projection_error_of`. `projection_empty_list` is minted in `viewport_query_build_error_of`.
- `kernel/src/skp.rs` (SX2): lines 419-421 name block-on-sight 3 of the draft amendment at 433413a, "the rule's origin", not ADR-016 Amendment 1's text. I confirmed that 433413a is on main and that its block-on-sight 3 is this rule.
- `protocol/skp/src/v0/commands.rs` (SX3): lines 199-200 now say ADR-016 Amendment 1 is recorded as Accepted (2026-09-23).

**Evidence (command, exit code).** `<D>` is `D:/wt-targets/skpe-run/logs/`.
- E1: a script over `git diff -U0 B HEAD -- '*.rs' '*.ts'` found 37 changed lines, 0 non-comment, rc 0. The `error.rs` diff is three `///` insertions only.
- E2: the `--list` output of `spatial-skp` and `spatial-kernel` is identical at B and H, rc 0 each (52 and 391 tests). Logs are `<D>list-*-B.txt` and `<D>list-*-H.txt`.
- E3, all rc 0:
  - `cargo test -p spatial-skp --test fixtures --test conformance`.
  - `--lib hex_f64` (3 passed).
  - Kernel lib tests `cancel_on_an_unknown_handle`, `the_real_cancel_responses` and `version_mismatch_is_refused` (3 passed).
  - `--test typed_terminal_codes --test skp_projection --test source_watch_ordering`.
  - In the shell: `tsc --noEmit` rc 0, and `vitest run src/skp` 47 passed. This covers the fixtures loader, `events.test.ts` and `client.test.ts`.
- E4: `cargo doc --no-deps -p spatial-skp -p spatial-kernel` has 10 warnings at B and 10 at H. None is new, rc 0.
- E5: `cargo fmt --all -- --check` rc 0. I found no lint or format step for the shell in the CI workflows, so I ran typecheck and vitest, not a lint.
- E6, at head a8b45622, all rc 0:
  - `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` all passed.
  - `queue.mjs --check` and `site.mjs --check` both report current.
  - `node --test` over the three script suites: 457 passed, 0 failed.
- E7: `git diff --quiet B HEAD -- protocol/skp/tests protocol/skp/src/v0/mod.rs protocol/data-plane frontends/shell/src/skp/__tests__` rc 0. `types.ts` line 15 still reads `skp/0.11`. The `commands.rs` diff is the single hunk at 199-200, comments only.
- E8: B's §8 is a byte-identical prefix of H's. The only difference is the note appended after the covering note's last line. S12 is the sole §8 change.
- E9: each of the three codes appears once outside §8, on §5's reserved line (343-346), by script with a positive self-test.
- Absence scripts:
  - S5b: `git grep` over `*.rs`, `*.ts` and `*.tsx` finds only the three constructor definitions, and the self-test on `cancel_key_in_use` is positive.
  - S3: `commands.rs` declares no publish request type; its only `publish` hits are comments about published bundles and the publish preflight.
- `verify-quotes --show-cites` on the 7 changed files lists 4 cites, all pre-existing in lines I did not edit. I added no quotes and no bare `path:line`.
- Machine holds: the first, for E2-E5 at H, ran cargo under a shared hold (`runH.sh`). The second hold covered E2 and E4 at B (`runB.sh`). The `--detach` checkout to B was returned to the branch, which sits at head. Both holds were granted and released, and neither returned a code 96 to 99.

**Budget (`git diff --numstat B...HEAD`, insertions + deletions).** SKP-V0.md is 67 (cap 130). `error.rs` is 3 (cap 9). `handles.rs` is 10 (cap 24). `kernel/src/skp.rs` is 9 (cap 16). `types.ts` is 5 (cap 8). `codec.rs` is 6 (cap 8). `commands.rs` is 4 (cap 6). The total is 104 lines (cap 206) in 7 files (cap 10); `kernel/README.md` (cap 2) is untouched.

**Not done as written, and things for the gate.**
- §2.6 is not done: no `kernel/README.md` edit.
- The S4 absence of `canonicalize` is not literally "none on the open path". `engine/src/watch.rs` `arm` canonicalizes its own copy of the path, and `kernel/src/skp.rs` line 1172 calls it with the request path. The engine's open is called at line 1176 with the path as received, so my sentence says exactly that: "passes it to the engine's open as received".
- `SKP-V0.md` line 407 cites a "§6" about "no claim without the thing". S11 names only two lines, so I left it alone.
- Running `npm ci` in `frontends/shell` created `node_modules`, which git ignores.

**Self-check.**
- Each rewritten sentence was checked against the code or ADR it rests on, at B.
- No cross-module interface was written to.
- No message states behaviour that is not implemented.
- I ran every E-item to its assertion.
- I am running as Sonnet 5.5, with no model override and no context handoff.

`git status --porcelain` is empty, and the branch is pushed at a8b45622 with no PR opened.
