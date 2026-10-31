# The cancel response's `state` held to SKP-V0's closed set by its reader (wave-1 C-1, S2) — preregistration

**Authority:** PLAN node `skp-cancel-state-closed-set` (`PLAN.yaml:3041-3057` @ 337f0ee sha256:81a1df91fe987337dd3ba684876164667093e1c12c474bfa5940cf3cdb5af798). It was placed at position 7 of 16 by question round 31, item 1, and question round 33, item 1 holds its code until `workspace-rustfmt` merges (merged as 51ed3b2). Direction and version: question round 38 (RULED 2026-10-02), item 1. Origin: wave-1 C, Finding C-1 (`state/cloud/wave1/C.md:48-56` @ 337f0ee sha256:06d741d52ff22dfa8acba7b548ed04f12a28cf370ae5f68e5d498396db6ad536), and the triage line (`state/cloud/wave1/C.md:77` @ 337f0ee sha256:456395081517d13d8212659f5c4775fa3a35a0c9dfd09ed2439377f10a1bbd4b). These are evidence, not Authority.
**Drafted by** the architect agent on the custodian's brief, read at `main` 337f0ee (the consult: `state/consults/2026-10-02-skp-cancel-state-closed-set-architect-draft.md`). Shape model: `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`. **Committed before any code**, on main, as the node's gate file. It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at 337f0ee (the architect had no Bash); (2) the Authority clause and §2 item 7 (ii), which now name question round 38, item 1, where the human chose the reader-side fix with no literal bump; (3) the consult's path in the line above; (4) this line. Nothing else changed. On the consult's open points: PLAN's node takes this form as its gate, 120 minutes as its budget and `merge: merge-commit`, in the same commit; node 15's summary is reworded to "node 15's own SKP-V0 entry"; the other closed-domain fields typed `String` are routed as a proposed node; ADR-029's stale `SKP-V0.md:97` cite is noted in the ledger for the human.
**Gating:** full, from dispatch (round 25, item 2 (e)), so no five-line form is used. Two §21a heads apply. The first is the wire (`AUTONOMY.md:323-324` @ 337f0ee sha256:90dd5aaa322e44946970eecb24134b69e410c15e357bfa9cdd5ef5c4459bca59): `protocol/skp/**` changes. The second is a property under test (`AUTONOMY.md:327` @ 337f0ee sha256:d80649bedfea2f8ac48948d94ca0d4b3f629fb1a5e3c407b5d01bae98e390a95): the conformance harness's reported-divergence set and three kernel tests' cancel assertions change. The piece is also over §21c's file bound. It amends no ADR and touches no security posture.

## §0. Disclosure
- Reasoned from code at 337f0ee. C-1's own cites are at its baseline bb98f71 and are not reused.
- **The defect.** `CancelResponse.state` is a `String` (`protocol/skp/src/v0/commands.rs:462-468` @ 337f0ee sha256:34c6c1b5b5d98be933e2381b1a1164fcc3a9952914788681d23bfd1b34d41202). The shell mirrors it as `state: string` (`frontends/shell/src/skp/types.ts:267-269` @ 337f0ee sha256:a0d0b861c1fef1cc0809145a1b38dfe24490b5cb3b4e50172ca11d397b4cf497). §1 of the spec gives three values (`protocol/skp/SKP-V0.md:114` @ 337f0ee sha256:f279ed42cca49feaed8fe8d508a0a1ed0635136468914a8c55582c0ec46e959c).
- **The writer is closed.** The kernel writes `CancelOutcome::as_str` (`kernel/src/skp.rs:96-112` @ 337f0ee sha256:07a83d86e6bb630258795c45addc2e0ce5c9e20d6c4a648a6933a1f23093dec0), and its only caller is `SkpHost::cancel` (`kernel/src/skp.rs:1514-1526` @ 337f0ee sha256:6cff74add674f72bd0103ae1061d75f354609a8fd6db5b343a912c59e8e682bc). The shell's Tauri command `cancel` in `frontends/shell/src-tauri/src/commands.rs` returns that value unchanged.
- **The readers (§6 item 1).**
  - No product code reads `state`.
  - Rust: nothing in product deserializes a `CancelResponse`. Only `protocol/skp/tests/fixtures.rs` (`cancel_fixtures_round_trip`) and the conformance harness do.
  - TS: every caller of `client.ts`'s `cancel` awaits the result or discards it, and none reads `state`. The shell validates no response at runtime (`frontends/shell/src/skp/__tests__/fixtures.test.ts:42-52` @ 337f0ee sha256:843ea8e2b22e88a09f06ceb1f6b78942560d6076bca246e9e229863874b903f8).
  - Three kernel integration tests compare `state` with a string: `kernel/tests/skp_admission.rs:892` @ 337f0ee sha256:6f6d6a2c6721faf3afa2b44c726f6a83ad44e818c72338dbb8a305a1dbf5497c, `kernel/tests/skp_filter_cancellation.rs:244` @ 337f0ee sha256:6f6d6a2c6721faf3afa2b44c726f6a83ad44e818c72338dbb8a305a1dbf5497c and `kernel/tests/source_watch_ordering.rs:572` @ 337f0ee sha256:6f868ebcee3f8c82a96ef13b8162c66f927fd6a6f7bb50553ee6d79f75a576da.
- **PR #123 is merged** (`state/directives/2026-09-27-session-order.md:9` @ 337f0ee sha256:572088db81603096e71591b82a1cd149bf0d1dc1cdcb36ec64079632c628b48a). Its harness is on main under `protocol/skp/tests/conformance/`. The harness asserts that the divergences it observes equal `REPORTED_DIVERGENCES`, in both directions (`protocol/skp/tests/conformance/main.rs:12-15` @ 337f0ee sha256:774c4fbc7d7e3a4c77c6afa440d7e221c265fa094f9f16fcd76e9866c6ead744). Fixing C-1 therefore fails the harness unless that set is emptied, so the harness is in scope (§2 item 6). The fixture is `rej-resp-cancel-bad-state` (`protocol/skp/tests/conformance/fixtures/refusals-at-deserialize.json:299-308` @ 337f0ee sha256:741ca4c2bee923ce85af638c68882758291cd328e5e0a02fbc80c3baf4511c6b).
- **Which side is wrong.** The triage left this undetermined. This form finds it is the reader, on three grounds:
  1. ADR-021 Decision 2 (Accepted) allows schema evolution only as a version bump, never as a tolerant reader (`docs/adr/ADR-021-row-filter-on-viewport-query.md:60-63` @ 337f0ee sha256:6ca61ff930759b9d54c81076f033de6db4ce7e5282ad627e310c41d2cbc0efcd).
  2. SKP-V0 §4 item 13 states the same rule for the whole spec (`protocol/skp/SKP-V0.md:274-278` @ 337f0ee sha256:b4170741d0929ea5bc56a1866c24c24d4025bf73c3fc8468c940ecbbf0b6a4a4), and so does the crate (`protocol/skp/src/v0/commands.rs:7-8` @ 337f0ee sha256:0665df90cb16ac2932991bd5c96841c5e64c79696cf70a6ed1eadfc1c57a79c8).
  3. Every other closed value set on this wire is refused at deserialize with no fallback. Examples are `CrsUnit` (`protocol/skp/src/v0/commands.rs:152-163` @ 337f0ee sha256:9be01d69636228f94b21a1dbb492149fcd8670707c1bc85068d4adfb8d7f94c4), `CoverageState`, `ChecksState`, `CheckComponent`, `EndReason` and `Filter`'s one dialect.

  The other option is for the spec to let a reader accept other values. That would write a tolerant reader into SKP-V0 against ADR-021 Decision 2, so it needs an ADR amendment. It is not this form.
- **Version: no literal bump.**
  - No key, value, error code or command is added or removed. §1's set is unchanged.
  - The kernel's serialized response for each outcome is unchanged. T4 proves this at B and at C.
  - SKP-V0's entry-30 addendum records the human's rule (`protocol/skp/SKP-V0.md:640-651` @ 337f0ee sha256:8e5e590886446590e7336f2df72ec8b187f8b4d25a30a3f3607fedb65359351e): a new key forces a bump, and a value-domain widening rides the current literal. This piece is neither.
- **H1 (hypothesis):** no file outside §7's list builds, compares or deserializes a `CancelResponse.state`. Discriminator: §6 item 1. A hit is invalidator I6.
- Intake:

  | Item | Disposition |
  |---|---|
  | C-1 | In |
  | The harness's `REPORTED_DIVERGENCES` and D1 in `DIVERGENCES.md` | In: §2 item 6 |
  | `DIVERGENCES.md`'s two host-deferred line cites into `kernel/src/skp.rs`, stale since rustfmt | In: the file this piece edits (§2 item 6) |
  | AMBIGUITIES.md A1 to A9 | Out: they go to the human with the ambiguity list (`state/cloud/wave1/C.md:81` @ 337f0ee sha256:cdccc176d0bc761147532c7a9cd8c305db5a3ce65f91608545e538412a3b08d3) |
  | Other closed-domain response fields typed `String` (`crs.source`, `identity.class`, `sanity.level` and others) | Out: no finding names them; routed to the custodian as a candidate node |
  | SKP-V0's second engine-prefix site (`formatTerminalRefusal.ts`, `create_from_raw_params`), and its §1 `close_dataset` paragraph | Out: PLAN node `kernel-close-races-followups` (`PLAN.yaml:3092` @ 337f0ee sha256:5b1125f9571124d8d81a008076d490173363c409285c4a427a689339e4226ebc). This form's §8 note is not that node's entry. |
  | ADR-029's cite of cancel's states at `SKP-V0.md:97` (`docs/adr/ADR-029-scan-progress-carrier-quantity.md:84` @ 337f0ee sha256:4f2508af643231c6f1b672e42b3d0834aad4dfd0f2eb5955a06c6e1d315c463a) | Out: ADR text; a note to the custodian |
  | A runtime check of responses in the shell | Out: no response is validated at runtime, and nothing reads `state` |

- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. `protocol/skp`'s `CancelResponse` deserializes exactly §1's three values and refuses any other string at deserialize (T1, T2, and the harness's `rej-resp-cancel-bad-state`).
  2. For each of its three outcomes, the real `SkpHost::cancel` response serializes to the same JSON value as that state's shared fixture, at the base and after the change (T4).
  3. The shell's `CancelResponse.state` admits exactly the three strings, at compile time (T3, T5).
  4. The conformance harness reports no divergence.
- **May not claim:**
  - that the shell refuses an out-of-set value at runtime;
  - any new `skp.*` code, or any refusal that reaches a client;
  - anything about another closed-domain field typed `String`;
  - that any AMBIGUITIES.md item is resolved;
  - that the harness is SKP's conformance suite (`protocol/skp/tests/conformance/README.md:8-11` @ 337f0ee sha256:8330085c804d7e73c23dc6d59bab7a1a54a8e52ae1410dc3cf3d09b0be04ca00);
  - any `docs/08` figure, or any level above L1.
- **Unchanged:**
  - the literal `skp/0.8` on both sides;
  - every existing fixture file, byte for byte, including `v0-cancel-response.json` and all conformance fixtures;
  - `CancelOutcome`'s variants, every registry's cancel logic, and `SkpHost::cancel`'s signature;
  - `client.ts`, `src-tauri`, and every shell caller of `cancel`;
  - `protocol/data-plane/`, which has an empty diff;
  - ADR-004 Amendment 4 (no field is added);
  - every ADR-006 operation class, and ADR-018's cancellation vocabulary and semantics;
  - all operator-visible text;
  - every ADR and `docs/01`.
- **Seams:**
  - **The seam.** There is one, kernel to shell, crossed by the response JSON. On the consuming side, the interface is the TS type `CancelResponse` in `types.ts` (no product code reads `state`), plus Rust's `CancelResponse`.
  - **The end-to-end test.** T4 runs from the real shape: it compares the real `SkpHost::cancel` output with the shared fixtures that `fixtures.rs` and `fixtures.test.ts` both read. Precedent: `the_real_describe_crs_shape_matches_the_shared_fixture` (`kernel/src/skp.rs:2832-2905` @ 337f0ee sha256:9846a5879fb1017786de179c7f7d686b15786381b6fc28119668db1d82c417da).
  - **New items and their product callers.**
    - Rust `CancelState`: called by `CancelResponse.state` and by the kernel's `cancel_state_of`.
    - `cancel_state_of` (private): called by `SkpHost::cancel`.
    - TS `CancelState`: called by `CancelResponse.state`, which `client.ts`'s `cancel` returns.
  - **Removed:** `CancelOutcome::as_str`. Its one caller now goes through `cancel_state_of`.
  - **The Rust deserialize refusal** has no product caller in this repository, because the shell reads in TS. It is a property of the type, as `CrsUnit`'s refusal is. The gate checks this reading.

## §2. The change
1. **`protocol/skp/src/v0/commands.rs`.**
   - Add `pub enum CancelState { Requested, Unknown, AlreadyTerminal }`.
     - Derives `Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize`; carries `#[serde(rename_all = "snake_case")]`.
     - No `#[serde(other)]` and no fallback.
     - Its doc names SKP-V0 §1 and the `CrsUnit` precedent.
   - `CancelResponse.state` becomes `CancelState`. Its doc keeps the ADR-004 Amendment 4 sentence.
   - Add T1 and T2 to `mod tests`.
2. **`kernel/src/skp.rs`.**
   - Add a private `fn cancel_state_of(CancelOutcome) -> CancelState` beside `end_reason_of`: an exhaustive `match` with no wildcard.
   - `SkpHost::cancel` builds `CancelResponse { state: cancel_state_of(outcome) }`.
   - Remove `CancelOutcome::as_str`. `CancelOutcome`'s doc names the projection.
   - Add T4 to the test module that holds `synthetic_source`.
3. **`frontends/shell/src/skp/types.ts`.** Add `export type CancelState = "requested" | "unknown" | "already_terminal"`, whose doc mirrors the Rust type, as `CrsUnit`'s does. `CancelResponse.state` becomes `CancelState`. No runtime check is added.
4. **Re-aims.** The three kernel test lines in §0 compare against `spatial_skp::v0::CancelState::{Requested, Requested, Unknown}`, the same values. Nothing else in those tests changes.
5. **Fixtures.**
   - Two new files: `protocol/skp/tests/data/v0-cancel-response-unknown.json` and `protocol/skp/tests/data/v0-cancel-response-already_terminal.json`, each formatted like `v0-cancel-response.json`.
   - `fixtures.rs`'s `cancel_fixtures_round_trip` round-trips all three.
   - `fixtures.test.ts` gains T3 and T5. Its existing `cancel request/response` test is unchanged.
6. **The conformance harness.**
   - `main.rs`: `REPORTED_DIVERGENCES` becomes `&[]`.
   - `DIVERGENCES.md`:
     - D1 is marked resolved, naming this node and the commit;
     - the run line gives the new counts and the commit;
     - the host-deferred section's two `kernel/src/skp.rs` line cites become function names: `check_version`, and `CancelKey::try_from` in `SkpHost::open_dataset`.
7. **`protocol/skp/SKP-V0.md`.** The content below is binding; the wording is the worker's; nothing is quoted.
   - **(i)** After the shape block in §1's `cancel`, add one sentence saying:
     - the set is closed;
     - under this version, an object whose state is outside the set is not a cancel response, and no tolerant reader accepts it (§4 item 13);
     - `protocol/skp` refuses such a value at deserialize;
     - the shell's TS mirror is a closed union, checked at compile time only, as is every response type there.
   - **(ii)** After the `skp/0.8` entry, append to §8 a dated note recording:
     - that the §1 sentence was added in place;
     - that there is no literal bump, with its reason in one sentence (the entry-30 rule) and question round 38, item 1;
     - that the two new shared fixtures landed with both sides' tests in one commit;
     - that the harness divergence is resolved;
     - that `protocol/data-plane/` has an empty diff.

     No earlier §8 text is edited.
8. **Nothing else changes:**
   - no literal bump, error code or runtime validator;
   - no change to `client.ts`, `src-tauri`, `CancelOutcome`'s variants or any registry;
   - no new constant.
9. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:33-65` @ 337f0ee sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff):
   - **R1:** serde and TS type semantics are the same on every platform.
   - **R2:** no `cfg`, and no file in scope is a boundary file.
   - **R3:** not engaged; this is not an OS-dependent feature.
   - **R4:** no new coupling. T4 builds no path, and the fixture paths are `CARGO_MANIFEST_DIR`-relative, as the precedent's are.
   - **R5:** L1 only, on the platforms CI runs.
   - **R6:** no test is ignored on any platform.

## §3. Fixtures and predicted outcomes
| # | Input | Base | After |
|---|---|---|---|
| F1 | `{"state":"requested"}` (the existing fixture) | accepted, round-trips | same |
| F2 | `{"state":"unknown"}` (new) | accepted, round-trips | same |
| F3 | `{"state":"already_terminal"}` (new) | accepted, round-trips | same |
| F4 | `{"state":"cancelled"}` (T1, and the harness) | accepted | refused at deserialize |
| F5 | `"Requested"`, `"already-terminal"`, `""` (T1) | accepted | refused at deserialize |
| F6 | the real `SkpHost::cancel` response for Unknown (an unminted `sh_` handle), Requested (a minted ticket cancelled once) and AlreadyTerminal (minted, redeemed, cancelled twice) | equals F2, F1, F3 | same |
| F7 | `cargo test -p spatial-skp --test conformance -- --nocapture` | diverged = [`rej-resp-cancel-bad-state`]; pass p and deferred d recorded at B | diverged = []; pass p+1; deferred d |

## §4. Tests, one mutation each
- No sleep, timeout, spawned thread or timing assertion. No test-only hook in product code.
- **P0, before any code.** Commit B is test-only: T1, T3, T4, T5, F2, F3 and the `fixtures.rs` extension. At B:
  - T1 fails, because F4 deserializes;
  - `npm run typecheck` fails at T3 with TS2578;
  - T4, T5 and the harness pass.

  Each is recorded by name, with B's commit id.
- **T1** `a_cancel_response_state_outside_the_closed_set_is_refused_at_deserialize` (commands.rs), over F4 and F5. **M1:** add a `#[serde(other)] Other` variant to `CancelState`; T1 fails at F4, and the harness fails too.
- **T2** `the_three_cancel_states_serialize_as_the_spec_strings_and_round_trip` (commands.rs) asserts the exact JSON per variant. **M2:** `rename_all = "kebab-case"`; T2 fails at `already_terminal`.
- **T3** `a cancel response state outside the closed set does not typecheck` (fixtures.test.ts): a `@ts-expect-error` over `{ state: "cancelled" }` typed as `CancelResponse`. **M3:** `CancelState` widened to `string`; `npm run typecheck` fails with TS2578 at T3's directive.
- **T4** `the_real_cancel_responses_match_the_shared_fixtures` (kernel/src/skp.rs), over F6. Each response comes through the real `SkpHost::cancel`, is serialized with `serde_json::to_value`, and is compared with its fixture file. **M4:** `cancel_state_of` maps `AlreadyTerminal` to `Unknown`; T4 fails at F3.
- **T5** `each shared cancel response fixture carries one of the three states` (fixtures.test.ts) uses an array typed `CancelResponse["state"][]` holding the three strings, plus a per-file equality. **M5:** drop `"already_terminal"` from `CancelState`; `npm run typecheck` fails with TS2322 at T5's array.
- The edited `cancel_fixtures_round_trip` and the three re-aims need no new mutation. M2 also fails the round-trip.
- A mutation is observed by applying it, running the named test or `npm run typecheck`, recording the failure by name with its commit in the test's doc, and reverting it. A `verify-mutation` run is not an observation. A test-text span on the unmerged branch is named in words with its commit id, never pinned by hash.
- Commits: A is this form, on main. B is P0. C is the fix with T2, the re-aims and §2 item 6. D is §2 item 7.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** P0 as stated in §4. At C, T1 to T5 pass, each fails under its own mutation, F7 holds, and every other workspace and shell test passes.
- **Declared unchanged:**
  - §1's Unchanged list;
  - every test other than the cancel round-trip and the three re-aim lines, whose only change is the comparison's right-hand side;
  - the kernel's JSON for each outcome (T4 at B and at C).
- **Invalidators:**
  - **I1 (invalid run):** at B, T1 passes or T3 typechecks. Recorded as class 2.
  - **I2 (stop, to the custodian):** T4 fails at B, so the writer emits something other than F1 to F3.
  - **I3 (stop):** a product reader that branches on `state` is found.
  - **I4 (stop, to the human):** the fix needs a literal bump, an error code, a runtime validator or operator-visible text.
  - **I5 (stop):** a declared-unchanged test fails.
  - **I6 (stop, to the custodian):** H1 fails, so compiling needs a file outside §7.
  - **I7:** the human rules other than §2. The form is then not committed as drafted.
  - **I8 (stop):** F7's counts differ from the prediction.
- **Falsification:** after the change, an out-of-set string deserializes as a `CancelResponse`; or the kernel's JSON for any outcome changes; or the TS type admits a string outside the set.

## §6. Instruments
Assertions only.
1. `git grep -nE "CancelResponse|CancelOutcome|CancelState|\.state\b" -- kernel protocol frontends/shell/src frontends/shell/src-tauri/src`, read hit by hit (H1, I3).
2. F7's count line, at B and at C.
3. `npm run typecheck` output at B, and under M3 and M5.
4. `cargo fmt --check`, read as no new hunk in the touched files.
5. `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings
- No new constant.
- **Size budget:** at most 300 changed lines (insertions plus deletions) over at most 13 files, exactly these:
  - `protocol/skp/src/v0/commands.rs`
  - `protocol/skp/tests/fixtures.rs`
  - `protocol/skp/tests/data/v0-cancel-response-unknown.json`
  - `protocol/skp/tests/data/v0-cancel-response-already_terminal.json`
  - `protocol/skp/tests/conformance/main.rs`
  - `protocol/skp/tests/conformance/DIVERGENCES.md`
  - `protocol/skp/SKP-V0.md`
  - `kernel/src/skp.rs`
  - `kernel/tests/skp_admission.rs`
  - `kernel/tests/skp_filter_cancellation.rs`
  - `kernel/tests/source_watch_ordering.rs`
  - `frontends/shell/src/skp/types.ts`
  - `frontends/shell/src/skp/__tests__/fixtures.test.ts`
- **Counting command:** `git diff --numstat <merge-base>...<head> -- . ':!protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, run at a named commit. This form is excluded by name.
- An overrun is class 8, and this section is never edited to match.
- **Estimate:** about 215 lines in total:
  - commands.rs 45;
  - skp.rs 70;
  - types.ts 7;
  - the three re-aims 6;
  - the fixtures and `fixtures.rs` 8;
  - `fixtures.test.ts` 35;
  - the harness 14;
  - SKP-V0 25.

## §8. Block-on-sight
1. Any path outside §7's list, except this form's own §10 amendments (the reading question round 37, item 1 gave `workspace-rustfmt`, written into this form), `PLAN.yaml`, generated files and `state/**`.
2. A `#[serde(other)]`, a default or any fallback on `CancelState`; `state` left as `String` or `string`.
3. A new `skp.*` code, a runtime validator, a literal change on either side, or operator-visible text.
4. Any change to `client.ts`, `src-tauri`, `CancelOutcome`'s variants or a registry's cancel logic.
5. An existing fixture file changed; a conformance fixture changed.
6. A declared-unchanged test's assertions edited, beyond the three re-aims' right-hand sides.
7. A new item with no product caller; a test-only hook; a `cfg(test)` branch in product code; `PartialEq<&str>` or any other impl that exists only for tests.
8. An SKP-V0 §8 edit to earlier text; an SKP-V0 sentence that claims a runtime refusal in the shell or a conformance suite; a quotation in the new text.
9. Any `cfg(windows|unix|target_os)`; a platform ignore.
10. A sleep, timeout, thread or timing assertion in T1 to T5.
11. A record that calls a `verify-mutation` run an observation; a mutation recorded without its commit.
12. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition landed before its class-9 amendment.
13. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash, or named without its commit id;
    - a bare self-line;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so.
14. A squash or rebase merge.

## §9. Gates
- **Architect:**
  - the Header's §21a reading;
  - §0's direction and version grounds, against ADR-021 Decision 2, SKP-V0 §4 item 13 and the entry-30 addendum;
  - the seam and caller reading (§1);
  - ADR-004 Amendment 4, ADR-006 and ADR-018 unchanged;
  - §2 item 7 against §1's claims;
  - R1 to R6;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - P0 at B;
  - M1 to M5 observed;
  - F7 at B and at C;
  - §7 recounted with its own command;
  - §6 item 1 re-run.
- **Suites, green before either gate:**
  - `cargo test --workspace` on Windows, and `cargo clippy`;
  - `cargo fmt --check` for the workspace (`.github/workflows/rust-fmt.yml`);
  - `npm run verify` in `frontends/shell`;
  - the verify tools, each with the tool's commit;
  - `verify:plan`;
  - CI's `node --test` scripts suite;
  - the branch's CI, read before gating.
- **Operator:** none. Nothing visible changes.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)

### Amendment 1 — H1 as worded, and the commit plan (class 2)

Written after the results were seen (a post-result amendment), before either gate. References only.

1. **H1 is false as worded.**
   - `frontends/shell/src/App.lateResult.test.tsx:207` @ 3f72519 sha256:34647de7a400e5da2181b5f7191de4166112d3d5a0658e7a6f9930348c96fe65 builds a `CancelResponse` whose `state` is `"requested"`, inside the closed set. It is outside §7's list.
   - The file is unchanged by this piece. It compiles unchanged under the closed union (`npm run typecheck`, rc 0 at 190fd6b), and no file outside §7 changes.
   - The H1 line calls any hit I6, but I6's own condition is that compiling needs a file outside §7. That condition is not met, so the custodian reads I6 as not fired. The gates judge this reading. H1 is not edited.
2. **The commit plan.** §2 item 6's `DIVERGENCES.md` update landed in D (190fd6b), not in C, because its resolved line names C's id (5d4da4d). C carries `main.rs`'s `REPORTED_DIVERGENCES` change. F7 at D is pass 63, deferred 15, diverged 0, as §3 predicts.
3. **Superseded index.** None. H1 and §4's commit plan stand as registered; this amendment records the deviations.

### Amendment 2 — correction round 1 (class 1)

Written after gate 1's results were seen (a post-result amendment). References only.

1. **The round.** Branch commit 92ed745 answers gate 1. The findings it answers are the architect's S2-2 and S2-3 (`state/consults/gates/2026-10-02-skp-cancel-state-closed-set-gate1-architect.md`), and the reviewer's S2-1 and its note on `DIVERGENCES.md`'s header (`state/consults/gates/2026-10-02-skp-cancel-state-closed-set-gate1-reviewer.md`). Both files are text-only. F7 re-run at 92ed745 is pass 63, deferred 15, diverged 0. §7's count at 92ed745 is 243 lines over 13 files.
2. **Superseded index.**
   - The SKP-V0 §8 note's parenthesis restating the entry-30 rule, as commit 190fd6b added it, is superseded by the reference to the entry-30 disposition at 92ed745.
   - In `protocol/skp/tests/conformance/DIVERGENCES.md` at 190fd6b, three things are superseded at 92ed745: the header's run lines naming the `skp/0.6` re-run, D1's three line cites and the Resolved line. They are replaced by the 5d4da4d run line, item names and the restated Resolved line.
   - No other line is superseded.

### Amendment 3 — the closing record (class 1, references only)

Written after the piece's results were seen and after its merge (a post-result amendment). References only.

1. **Merged.** PR #160 merged on 2026-10-03 at 05:32:23Z as merge commit d3ecb9e, at head da110d0. So 2d835a9, 5d4da4d, 190fd6b, 8e4747e, 92ed745 and da110d0 stay reachable from main (§8 item 14).
2. **The I6 reading, extended** (the gate-1 architect's S2-1). Amendment 1 item 1's reading covers four more test files, each building an in-set cancel response and compiling unchanged:
   - `frontends/shell/src/admission/AdmissionPanel.test.ts`;
   - `frontends/shell/src/streaming/tileViewportStreamManager.test.ts`;
   - `frontends/shell/src/streaming/viewportStreamManager.test.ts`;
   - `frontends/shell/src/residency/candidateArmSession.test.ts`.

   They are referenced as files at 3f72519. No file outside §7 changed.
3. **Mutations.** M1 to M5 were observed at 5d4da4d (`state/consults/2026-10-02-skp-cancel-state-closed-set-worker-report-1.md`). The gate-1 reviewer re-observed them at 8e4747e (`state/consults/gates/2026-10-02-skp-cancel-state-closed-set-gate1-reviewer.md`, check 3).
4. **The suites §9 names,** each in the gate-1 reviewer's report:
   - `cargo clippy --workspace --all-targets --locked` rc 0 at 8e4747e (check 7);
   - F7 at C, 63/15/0 (check 4);
   - `npm run verify` and the src-tauri build: product-ci-shell run 37053733955 (check 8);
   - verify:plan: Governance CI run 37053733544 (check 8).

   92ed745 and da110d0 touch text only. At da110d0, CI is green (`state/consults/gates/2026-10-02-skp-cancel-state-closed-set-gate2-reviewer.md`, check 6).
5. **Amendment 1's class label.** Its first line carries class 1's post-result marker, and it is not relabelled (the gate-1 reviewer's S2-3; the gate-1 architect's N1).
6. **Tools,** each at its last change: verify-cites 522e448, verify-quotes f9444a4, verify-test-claims e9735d4, verify-mutation 7d24ed1, verify:plan 2607202. A verify-mutation run is a tool run, not an observation.
7. **§7's final figure.** By §7's own command at da110d0, the figure is 243 lines over 13 files (the gate-2 reviewer's check 4).
8. **Superseded index.** None. Amendment 2's index stands.
