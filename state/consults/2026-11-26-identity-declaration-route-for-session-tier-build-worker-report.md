# The identity route's build (phase 2, the code): the worker's report

*Filed by the custodian from the worker's hand-back (saved by Write with the harness's indent removed; 10432 bytes, sha256 102fcbf5d30d813a97a47f59f3e2ab7ab5e4067e33f9da2023e1e21b572cb138). The worker's words, not the custodian's; the custodian re-ran §7's count and the literal's file count (the form's Amendment 8). Its line cites are into the branch at 767033a2, not main.*

---

767033a25b0d2f231e91966378d874c58f56787f is the branch head and the pushed head, and every step completed. I pushed once, in its own Bash call, and `git rev-parse origin/cut/identity-declaration-route-for-session-tier` gives the same hash. `git status --porcelain` at the end is empty.

Model observed: Sonnet 5.5 (claude-sonnet-5-5). Worktree D:/wt/idr, base e9bd2483 (unchanged). Logs are in D:/wt/idr-logs/ with new names; the older s3-* logs there are not mine.

## Commits
- f716d819 `test: P0 of the identity declaration route: W-1, W-2, K-1, K-2, S-1 to S-4, T-1 and E-1 before the fix`. Stubs: `identityDeclarationOffer` always returns null, and `declarationOptions` returns `{identity}` alone. E-1 and its README entry are written and not run.
- 721ee81c `feat: offer the identity declaration beside the Open buttons for a file opened on the session tier (shell half)`. Offer rule, `declarationOptions`, `opening.resume`, the `datasetOnMap` prop, the one `App.tsx` prop, `IdentityInfo.candidate_columns?` in `types.ts`, and D1 to D3 plus the legend and hint, all under `[P6 placeholder] `. The literal is not bumped in this commit.
- 8db7a6ed `feat: skp/0.15, describe.identity carries the session tier's candidate list`.
  - Wire: `IdentityInfo.candidate_columns`, set by `describe_dataset` under the session guard from `identity.candidate_columns()`, and the engine accessor's doc loses its instrument exemption.
  - Literal: `SKP_VERSION` moves to skp/0.15, with the Rust fixtures, 65 conformance occurrences, 11 request fixtures and the shell literals and tests. The version-refusal fixture moves to skp/0.16.
  - Fixtures and docs: the three describe fixtures gain the member, `skp_version_is_skp_0_15` is renamed, the conformance README gains a paragraph, SKP-V0.md §1 and the §8 skp/0.15 entry (with the Amendment 5 item 7 paragraph byte-copied) are written, and the §10–12 literal statements are bumped.
  - Partitioned refusal (class 9): the wire fixture message now carries the engine's `Display` byte for byte, and SKP-V0.md's code entry is reworded.
- ca29d32c `docs: ADR-016 Amendment 2 and two Notes, KNOWN-LIMITATIONS item 3's offer, walkthrough Part AG and row I4's legend`. ADR-016 gets Amendment 2 with its acceptance line, the Note 2026-11-23 and the Note 2026-11-26, in that order, appended at the end with no line edited. Each is byte-copied from its ruling block (ADV-2026-11-23-26 item 1, ADV-2026-11-23-27 item 4, ADV-2026-11-26-12 item 3), and I checked the Note 2026-11-26 block as a byte substring of the file. KNOWN-LIMITATIONS item 3 gets D4, a comment naming the advisor's sentences, `identityDeclarationOffer`, `describe_dataset` and the member, and symbol cites replacing the stale line cites (class 3). MANUAL-WALKTHROUGH.md gets Part AG with a blank result log, and row I4's quoted legend becomes `Integer columns, schema order, unranked` (row I4 changes only there).
- 767033a2 `fix: the candidate list holds every integer width admission takes, from one private predicate`. `is_admitted_integer_type` is a private `fn` in identity.rs. `candidate_identity_columns` and `admit_column_type`'s admitting arm (now a guarded arm) both call it. The refusal arm and its detail are byte-unchanged. The `identity.rs` field and function docs and the `error.rs` doc are brought current.

## P0 failures, by test and commit
- W-1 at f716d819 fails at its list assertion: `["big_signed","big_unsigned"]` against `["big_signed","small_signed","big_unsigned"]`.
- W-2 at f716d819 fails at identity.rs:445 (a narrow width, part (i)).
- K-1 at f716d819 fails at the F-1 assertion (kernel test line 386): the member is absent, so `Null`.
- K-2 at f716d819 fails at (a), line 466, with `Null`. At 8db7a6ed it fails at (a) with `[]`, and K-1 passes there.
- S-1 to S-4 and T-1 at f716d819 all fail:
  - S-1: `(i)` expected null to deeply equal an offer.
  - S-2: "U-1's offer: expected null not to be null".
  - S-3: "(i) its own handle: expected null not to be null".
  - S-4: "the offer: expected null not to be null".
  - T-1: the keys are expected to include `candidate_columns`.
- At 767033a2 W-1, W-2, K-1 and K-2 all pass: engine identity 12/12, kernel remediation 9/9.

## Mutations observed, each reverted and none committed
All are observed at 767033a2 or at code identical to it for the files concerned. S-1 to S-4 were observed with HEAD ca29d32c. The code that mutation touches is unchanged by 767033a2.
- M-S1 (class test removed): S-1 fails at `(ii)`, "expected {…} to be null".
- M-S4 (handle condition removed): S-3 fails at `(ii) another handle`.
- M-S2 (`resume` return removed): S-2 fails, "expected {kind, note} to deeply equal {kind:'admitted'…}".
- M-S3 (`declarationOptions` returns `{identity}`): S-4 fails at the merged `crsAssertion`.
- M-T1 (fixture value null): T-1 fails, "expected null to deeply equal ['parcel_id']".
- M-W1 (type filter back to Int64|UInt64):
  - engine: W-1 (`["big_signed","big_unsigned"]`) and W-2 (identity.rs:459) fail;
  - kernel: K-2 fails at (a) with `[]`.
- M-W2 (candidate filter lists seven types, no UInt8):
  - engine: only W-2 fails, at (i);
  - kernel: K-2 fails at (c), with `Some("i8,i16,i32,i64,u16,u32,u64")`.
- M-K1 (`candidate_columns: None`): K-1 fails at F-1 and K-2 fails at (a), both `Null`.
- M-K2 (computed from Int64/UInt64 schema fields): K-2 fails at (a) with `[]`, and K-1 passes.
- M-E1 is not observable here. E-1 is not run, and the tester's run is the observation.

## Count against §7, by the counting command with merge-base e9bd2483 and head 767033a2
- The count is 1042 changed lines (863 added, 179 deleted) over 44 files.
- Against §7's 650 lines and 38 files, that is class 8: +392 lines and +6 files. The prediction was about 902 over 43 files, or about 908 over 44 with the partitioned node. I did not edit §7's line.
- Largest files: the kernel test (173), the engine `identity.rs` (128), the `AdmissionPanel` test (127), `AdmissionPanel.tsx` (86) and e2e `admission-remediation.mjs` (74).

## Suites at 767033a2
All Rust and shell runs were inside shared holds. None started an app, a dev server or e2e, and the node scripts ran outside any hold. Disk free on C: was about 43.5 GB before each heavy run.
- Shell: `npm ci` in renderer/bundle-viewer rc 0, `npm ci` in frontends/shell rc 0, `npm run typecheck` rc 0, `npm test` rc 0 (132 files, 1681 tests passed, 0 failed).
- `cargo test --locked -p spatial-kernel --test skp_admission_remediation`: rc 0, 9 passed, 0 failed, 0 ignored.
- `cargo test --locked -p spatial-kernel --no-fail-fast`: rc 0, 525 passed, 0 failed, 48 ignored (64 binaries).
- `cargo test --locked -p spatial-skp --no-fail-fast`: rc 0, 63 passed, 0 failed, 0 ignored.
- `cargo test --locked -p spatial-skp --test conformance -- --nocapture`: rc 0, 1 passed.
- `cargo fmt --all -- --check` rc 0, and the same in frontends/shell/src-tauri rc 0.
- `cargo clippy --workspace --locked --all-targets`: rc 0, 0 errors and 10 warnings. None are in lines I changed. One example is skp.rs:277, a pre-existing "very complex type".
- `verify-cites.mjs`: rc 0, PASS.
- `verify-quotes.mjs`: the first run hit my 170 s timeout (rc 124, empty log). The rerun in the background passed, rc 0 (159 checked, 0 errors).
- `verify-test-claims.mjs`: rc 0, PASS (901 claimed tests, 17 planned, 16 superseded, 17 withdrawn).
- `verify.mjs`: rc 0, PASS.
- `node --test` over scripts/plan, hooks and evidence: rc 0, 623 passed, 0 failed, 0 skipped.
- I did not run health.mjs.

## Stops, departures and findings
1. **MANUAL-WALKTHROUGH row I8 is now stale.**
   - It quotes the old cost notice verbatim ("Declaring a column here triggers a whole-dataset uniqueness check…"), which D3 replaces.
   - The form names row I4 only, so I left I8 alone and did not edit it.
   - The advisor or the words commit should decide I8. I4 also quotes the plain legend, while the shell shows `[P6 placeholder] Integer columns…` until the words commit.
2. **The skp/0.14 file count differs from Amendment 7.** `git grep -l 'skp/0\.14'` at the base lists 55 files, 24 of them in Scope, where Amendment 7 states 59 and 27. It did not block the work, and the five out-of-Scope files stay untouched (`commands.rs`, `surfaceRegistry.ts`, `client.ts`, `error.rs`, `AMBIGUITIES.md`).
3. **The commits carry a `Signed-off-by` line from `-s`.** It has the git account's email, added by git as the brief required. I typed no sign-off and put no email in any message body. Per the memory note on email in sign-offs, check that this is acceptable before merge.
4. **E-1 and the e2e README entry are written and not run.** The README entry says the run is the tester's.
5. **verify-quotes and the hold's `-Minutes` estimates.** The first verify-quotes attempt timed out as noted above. The machine hold's `-Minutes` estimates ran over at times, with no refusal (no exit 96–99).
6. **No hook (Guardian) refusal occurred.**

## Pre-gate self-check
- **Interfaces:**
  - `IdentityInfo.candidate_columns` is `Option<Vec<String>>` and is always on the wire, `null` off the session tier.
  - The offer is `identityDeclarationOffer(state, datasetOnMap)`.
  - `declarationOptions(offer, identity)` returns `{...offer.options, identity}`.
  - `AdmissionPanel` gains `datasetOnMap`.
  - The `opening` state gains an optional `resume`.
  - No `pub` item is added in the engine.
- **Evidence:**
  - Every new test has an observed P0 failure or a mutation failure, recorded above by name and commit.
  - Logs: D:/wt/idr-logs/p0-*, c2-*, c3-*, mut-* and s2-*.
- **User-facing strings:**
  - D1 to D3, the legend and the hint are built under `[P6 placeholder] `.
  - KNOWN-LIMITATIONS D4, the ADR text and the strings carried by reference are byte-copied from `origin/main` rulings or the form, not retyped. The legend and hint bytes match ADV-2026-11-26-04 item 4 once the mark is removed.
- **Test assertions reached:** S-1 to S-4, T-1, W-1, W-2, K-1 and K-2 are all reached, shown by the P0 failures and mutation failures above. E-1 is not reached because it was not run.
- **Caller grep:**
  - `is_admitted_integer_type` has exactly two callers, identity.rs:304 (the candidate filter) and :349 (`admit_column_type`'s guarded arm). It is private to the module.
  - `identityDeclarationOffer` is called by `runAdmitPath`'s hold (line 291) and by the render (line 551).
  - `declarationOptions` is called by the offer's `onSubmit` (line 598).
