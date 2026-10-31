# The data plane's crowded-start detail loses its runs of spaces — preregistration

## Header

- **Status.** The preregistration of PLAN node `data-plane-crowded-start-detail-spaces`. Committed before any code, alone on main. No code lands before PR #186 (`kernel-close-races-followups`) has merged. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form and full gating from dispatch (AUTONOMY §21a, the data-plane-or-wire category; §25(e)). The detail is a literal carried in the data-plane TERMINAL frame's payload (`protocol/data-plane/src/wire.rs:87-90 @ a21435ed sha256:bb98ee068deacc2e4fe2898b30bd96ad6005068d9a67cc76939ef1c3a81c5b3a`), so a changed space is a changed wire byte. No five-line form exists for this piece.
- **Authority:**
  - PLAN node `data-plane-crowded-start-detail-spaces`, filed by question round 26, item 4, and placed by question round 31, item 1.
  - Moved to slot 2, after `kernel-close-races-followups`, by the 2026-10-05 product-first direction (`state/directives/2026-10-05-product-first-direction.md`, section 8, item e).
  - Drafting by the architect: question round 43, item 2.
  - Found by note N7 of `state/consults/2026-09-26-stream-registry-bound-gate1-architect.md:45 @ a21435ed sha256:b2dc91f086044b72695ccfa7c963b25320363bdc03393b781f79b6ee5a7ceb78`.
- **Drafted by** the architect agent, alone, on the custodian's brief. The lead-data pilot is paused (the product-first direction, section 1), so there was no impact read. Read at main a21435ed. The architect ran no command.
- **Reference form.**
  - Code and records are pinned `path:line @ a21435ed sha256:<hex>`.
  - A pin is historical: it is authoritative for the defect it names. The tree at the branch's base is authoritative for the edit, and the worker re-derives every site before editing.
  - Self-references are by section and item. The ledger is cited by round and item.
  - Comments the piece writes into code name their targets by item, never by line.
- **Branch.** `cut/data-plane-crowded-start-detail-spaces`, cut from main after #186 merges. It merges by a merge commit, never a squash.

## §0. Disclosure

- **Read:**
  - the node;
  - question round 26 (the RULED block and `state/questions/round-26.md`);
  - N7;
  - `protocol/data-plane/src/server.rs`, `wire.rs` and `tests/candidate_a.rs` at the sites cited below;
  - `protocol/data-plane/README.md`;
  - the shell's TERMINAL decoder;
  - AUTONOMY §21a to §21d, §22 and §25;
  - the template, its Round 25 additions included;
  - the product-first direction, sections 1, 2 and 8;
  - the 2026-10-06 machine directive.
- **The defect, re-derived.** The detail is the `format!` literal at `protocol/data-plane/src/server.rs:462 @ a21435ed sha256:719437444e5c10206e0267818860e14b298f700df72195d8ade518d52f641021`, inside the timeout arm at `protocol/data-plane/src/server.rs:457-464 @ a21435ed sha256:cc5518e37015f2ba3c92e4d700e46a1507a0b8e352f445c8b62919ce19dfe7da`. That arm is taken when a connection with no idle permit has sent no START within `CROWDED_START_TIMEOUT` (`protocol/data-plane/src/server.rs:430-441 @ a21435ed sha256:f7eda579285dfa1011a989e198edb96125f187d51fc92e6e063735f0aa0ad139`).
  - At a21435ed the literal carries **three** runs of exactly 22 spaces: after `ceiling`, after `so this` and after `rather than`. Each is a line continuation whose `\` and line break were lost, leaving the following line's indentation in the string.
  - N7 and the text of question round 26, item 4 (b) say two runs. This form fixes all three; it is one defect in one literal. The node's summary is corrected in the same pull request.
- **No test reaches this arm at the base.** No test in `protocol/data-plane/` or `kernel/` contains the detail's text. `an_idle_connection_holds_no_stream_slot_and_the_idle_ceiling_is_its_own` (`protocol/data-plane/tests/candidate_a.rs:800-839 @ a21435ed sha256:4ce506ac2dd3aa5f5087b703467432d0e006228f9037d9d7fba950885ea24722`) connects beyond the ceiling but sends START at once, so it never reaches the timeout.
- **The consumer side of the seam.** The shell decodes the TERMINAL detail as opaque UTF-8 text and does not parse it (`frontends/shell/src/streaming/wire.ts:169-177 @ a21435ed sha256:5dc3796df3c8fdb55988f2dbfada4afaf3db76d1ac48d1e042b84d07a42a6920`). No product code in `frontends/`, `kernel/` or `engine/` contains the detail's text.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **May claim:** the bytes of the crowded-start detail. After the change, each of the three joins is one space, and the words, placeholders and punctuation are unchanged.
- **No other wire change.** The frame tags, the terminal code taxonomy (`protocol/data-plane/src/wire.rs:34-39 @ a21435ed sha256:886c5275cce5db9d456b3ad76263d95b3fa1c87d2437c98ee2dc3f66ad8ef52b`), the framing and the code this arm sends (`TERM_TRANSPORT_FAILED`) are unchanged. The `no operation started` detail of the in-pool arm is unchanged. SKP is untouched.
- **No word an operator reads changes.** Operator-facing wording is the human's (template §1), and this piece changes none of it.
- **No ceiling changes**, and no timing or performance claim: no docs/08 row and no number. The timeouts are named, not measured.
- **ADRs cited, none amended:**
  - ADR-010 rule 6: the ceilings stay declared, and their values are unchanged.
  - ADR-012: the transport stays provisional.
  - ADR-014: still reserved; admission policy is untouched.

## §2. The change

**C1. `protocol/data-plane/src/server.rs`, the literal at line 462 (pinned above).**
- The string it produces is exactly the base's string with each 22-space run replaced by one space.
- Its template text becomes: `no operation started, and the declared ceiling MAX_IDLE_CONNECTIONS={MAX_IDLE_CONNECTIONS} was already reached, so this connection was held for {CROWDED_START_TIMEOUT:?} rather than {START_TIMEOUT:?}`.
- **The source shape is the worker's choice.** Either one line, or `\` continuations in the shape this file already uses for the admission refusal (`protocol/data-plane/src/server.rs:490-493 @ a21435ed sha256:c5a01f7ba0e7d25118c7bb86451b8048a7f4d96e02295b157d0863e550498985`), with each continued line ending in a space before its `\`. The new test pins the produced bytes either way, and `cargo fmt --all -- --check` passes.
- No other line of product code changes.

**Seam.** Producer: `handle`'s timeout arm, then `terminal_and_drain`, then the TERMINAL frame. Consumer: any data-plane client.
- The shell's decoder (`frontends/shell/src/streaming/wire.ts:169-177 @ a21435ed sha256:5dc3796df3c8fdb55988f2dbfada4afaf3db76d1ac48d1e042b84d07a42a6920`) passes the detail through as text, so nothing changes on that side.
- The end-to-end proof uses the real shape: a real WebSocket client in `candidate_a.rs` reads the actual TERMINAL frame through the suite's own `drain` (`protocol/data-plane/tests/candidate_a.rs:263-306 @ a21435ed sha256:9784cfd44064f1eff7b2c4dd4dcae3311c89e5dc8277c5f979e1108907e86a65`), which reads the payload length, then the code byte, then the UTF-8 detail.
- No `pub` item, option, callback or code path is added.

**Owner's index.** `protocol/data-plane/README.md` carries no owner's-index lines at a21435ed, and the piece touches neither `engine/` nor `kernel/`, so no index update is owed (the product-first direction, section 1). The README's ceilings line (`protocol/data-plane/README.md:124-125 @ a21435ed sha256:6a0bf1cdd24a34ee60bcc0beab6ec5ef1e8e17b166f175c73cba9a2f9311d72d`) names values, not this text, and is unchanged.

**Portability.** Not OS-dependent, so R3's section is not required: no `cfg`, no path literal, no new ignore.

**KNOWN-LIMITATIONS.** Nothing owed.

## §3. Fixtures

None. The test uses the suite's synthetic `factory`.

## §4. Tests, and the mutation per new test

**T1 (new), in `protocol/data-plane/tests/candidate_a.rs`.** The name is the worker's, in the suite's sentence style; for example, `a_connection_beyond_the_idle_ceiling_that_never_starts_is_told_why_in_single_spaced_words`.

Shape, binding:
1. Start a data plane with the suite's `start` and `factory`.
2. Open `MAX_IDLE_CONNECTIONS + 1` connections with `connect`. None sends START or any credit.
3. Await the **first** TERMINAL to arrive on any of them: race `drain` over all of them, bounded by the suite's `RECV_DEADLINE` (`protocol/data-plane/tests/candidate_a.rs:251 @ a21435ed sha256:ff9814dfbe4facd9947b7c1a67bb4f1b46ca7a809dcdf6de47eab601659b272d`).
   - This is deterministic without a sleep. An idle permit is released only at START or at that connection's own timeout (`protocol/data-plane/src/server.rs:430-441 @ a21435ed sha256:f7eda579285dfa1011a989e198edb96125f187d51fc92e6e063735f0aa0ad139`, `protocol/data-plane/src/server.rs:478 @ a21435ed sha256:610055aef801899a0630bbda409a841dce1e57c3f43ebed912300803b5db6775`).
   - So exactly one connection runs on `CROWDED_START_TIMEOUT`, whatever order the handlers run in. The other `MAX_IDLE_CONNECTIONS` wait on `START_TIMEOUT`, which is longer than `RECV_DEADLINE`, so the crowded connection's terminal is the first to arrive.
4. Assert:
   - (a) its code is `wire::TERM_TRANSPORT_FAILED`;
   - (b) its detail equals the §2 C1 template text rendered with the public constants `server::MAX_IDLE_CONNECTIONS`, `server::CROWDED_START_TIMEOUT` and `server::START_TIMEOUT`;
   - (c) its detail contains no run of two spaces.
5. Drop the pending receives. Close every connection, as the suite's existing test does (`protocol/data-plane/tests/candidate_a.rs:834-838 @ a21435ed sha256:7b8adc8782ee76f6bbf8cb3885ee1e3aea5fbad96bbc25e805559e2f8cf8f7cd`), then call `dp.shutdown()`.

Forbidden in T1: a sleep for synchronisation; any elapsed-time assertion; waiting on `START_TIMEOUT`; and any new `pub` accessor. Wall time is about `CROWDED_START_TIMEOUT`.

**Recorded mutation, M1.** Restore the literal to its a21435ed bytes, so the three 22-space runs come back. Predicted: T1 fails at assertion (b), by its message.
- The observation is made by applying M1, running T1 by name, recording its failure with the commit it was observed at, and reverting (round 25, item 2 (c)).
- No `verify-mutation` run is an observation.
- T1 carries a `RECORDED MUTATION (M1)` comment in the suite's existing style (`protocol/data-plane/tests/candidate_a.rs:841 @ a21435ed sha256:38e967bae88420c40da73ebebb109e25052282c4074ed80981fd3701f37ac058`), naming the mutation and the failing assertion with no line number.

**Existing tests pinning the current bytes:** none (§0). Every existing test is unchanged.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- **P1.** At the head, `spatial-data-plane`'s test sets equal the base's, plus T1 passing.
- **P2.** Under M1, T1 fails at assertion (b).
- **P3.** At the current constants, the rendered detail reads `...MAX_IDLE_CONNECTIONS=4 was already reached, so this connection was held for 5s rather than 120s`. The worker reports the detail as T1 received it. A wrong rendering is a result, not a defect of C1.
- **P4.** At the base, `git grep -n "already reached, so this" -- protocol kernel engine frontends` finds only `protocol/data-plane/src/server.rs`.

**Declared unchanged:**
- every product line other than C1's literal;
- every constant and its value: `START_TIMEOUT`, `MAX_IDLE_CONNECTIONS`, `CROWDED_START_TIMEOUT`, `MAX_CONCURRENT_STREAMS`, `PEER_DRAIN_TIMEOUT`, `MAX_TERMINAL_RECORDS`, `TERMINAL_RECORD_MAX_AGE` and `MAX_FRAME_BYTES`;
- the terminal code this arm sends, and every other detail string, including the in-pool `no operation started` and the admission refusal;
- `wire.rs`, `adapter_ws.rs`, `session.rs`, `transport.rs`, `pump.rs` and `lib.rs`;
- every existing test's name, assertion and message;
- `protocol/skp/**`, `kernel/`, `engine/` and `frontends/`;
- `protocol/data-plane/README.md` and every preregistration in `protocol/data-plane/`;
- every ADR;
- `KNOWN-LIMITATIONS.md`;
- `Cargo.toml` and `Cargo.lock`.

**Invalidators (stop and return to the architect; nothing is adjusted to pass):**
- T1 cannot be made deterministic without a sleep, a timing assertion or a new accessor;
- the first terminal to arrive is not the crowded arm's;
- P4 finds a reader of the detail's text;
- C1 needs any change beyond the three joins.

**Falsification.** A data-plane consumer depends on the detail's current bytes.

## §6. Instruments

These are assertions and readings only: T1's three assertions, M1, and P4's grep. There is no measurement.

## §7. Declared values and ceilings

No constant is added or changed.

**Line budget, by §21c's rule** (insertions plus deletions, tests included; this form and generated files excluded):

| File | Ceiling |
|---|---|
| `protocol/data-plane/src/server.rs` | ≤ 8 |
| `protocol/data-plane/tests/candidate_a.rs` | ≤ 60 |
| **Total** | **≤ 68 over these 2 files** |

**Counting command, at a named commit:** `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- <the files above>`. An overrun is recorded as class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. A product change other than C1's whitespace at the three joins: any changed word, placeholder, punctuation, format specifier, terminal code, branch, or the in-pool detail.
2. A path in the diff outside §7's list, this form and `PLAN.yaml`.
3. A new `pub` or `pub(crate)` item, option, callback, code path or dependency.
4. A changed constant value, or a change to `wire.rs`.
5. An existing test's name, assertion or message changed.
6. T1 uses a sleep for synchronisation, asserts on elapsed time, waits on `START_TIMEOUT`, or leaves a connection open at `shutdown`.
7. M1 not observed as §4 states, or a record calling a `verify-mutation` run an observation.
8. Quotation marks around text that is not byte-identical to its named source. A line number in a code comment. A record hash at a branch commit. A test-text span named without its commit id (round 25, item 2 (d)).
9. The word zero-copy, a performance number or a timing claim.
10. A new `cfg`, platform ignore or path literal.

## §9. Gates

Proportional, under the product-first direction, section 2:
- A gate fails only on Correctness or Evidence.
- Documentation and record findings are fixed in the same pull request before the merge, with no correction round and no re-gate. The custodian checks each fix, and the closing record lists them.
- Reports carry AUTONOMY §22's three verdicts and are filed under `state/consults/gates/` (§25(b)).

**Architect** (full gating):
- §8, item by item;
- C1's bytes against §1;
- the seam: the shell's decoder read at the head, and T1 shown to use the real frame shape;
- the caller rule;
- verbatim quotes and discharge claims resolved;
- the round-25 checks: class 8 against §7, class 9 for any addition, the mutation wording, and test-text spans.

**Reviewer:**
- the full diff with `origin/main...HEAD`, with `protocol/skp/`, `kernel/`, `engine/` and `frontends/` shown empty;
- §7's count by its command;
- M1 re-made at the head;
- P4's grep at the base;
- T1's determinism argument read against `handle`;
- every hash recomputed.

**Suites, green before either gate.** Heavy runs follow the paragraph the worker's brief carries from `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ a21435ed sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`; this form names no other rule for running builds.
- `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --all -- --check`, and `clippy` as CI runs it;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Operator:** none.

**PR body:** asks for a merge commit, never a squash.

**Closing record (after the merge; references and hashes only):**
1. The PR, its merge commit and the reviewed head.
2. The gate report paths.
3. The worker report, by section.
4. M1's observation commit, and T1's recorded-mutation comment pinned at the merge commit with its hash.
5. §7's count.
6. The Documentation findings fixed.
7. The PLAN node set done, with `{pr}`, in the done commit only.

## §10. Amendments

*(Opens empty; append-only.)*

### Amendment 1 — the closing record (class 1, with class 2 for §0's summary sentence and P4)

*Written by the custodian after the outcomes were seen. PR #189 merged at 2026-10-08T04:28:59Z as merge commit ccb685555a43874d651d80f323a801e4fff7306f, with parents a75cfd7401f02272cba3eba4378967b8a9921b4d and 425dece2a9a16a05696c2ce6e1ce8348733fed6a. It follows §9's closing-record list and routes the gates' record items. References and hashes only. Nothing below is a quotation.*

1. **The PR and its heads:**
   - PR #189, at the merge commit above;
   - both gates' reviewed head, 9867fa9faa2feb9e61cb8b5d25f120be154f18f0;
   - the merged head, 425dece2. Over the reviewed head it adds only the reviewer's D3 fix, a test comment. The custodian checked it against its finding by the diff (worker report 2). CI was green there, 10 of 10.
2. **The gate reports,** under `state/consults/gates/`:
   - `2026-10-08-data-plane-crowded-start-detail-spaces-gate1-architect.md`, pass with notes, gate-log 435, sha256 0ec94fd637dcf888068a200976c9773029c1772eab7dfbc8fcbe4eb5d13f189f, added in 45e7a0b052261adb97bd8541340f30834a6088bb;
   - `2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md`, pass, gate-log 436, sha256 e1a468470178b7abbb8270a104bd3af445c29d65d9c6dae4024c616df9a5eec4, added in c01f2e093544bd2d1d1acfd17e35454d414bebc8.
3. **The worker reports.** Each hash is of the file from its line 5 to the end, and each file is byte-identical at the merge commit:
   - `state/consults/2026-10-07-data-plane-crowded-start-detail-spaces-worker-report-1.md`, the build, at 45e7a0b0, sha256 53eae644fc4e11dbc377b81d2c127564190675768f71e6cd3cd6b5e00aeccda6;
   - `state/consults/2026-10-08-data-plane-crowded-start-detail-spaces-worker-report-2.md`, the D3 fix, at c01f2e09, sha256 bb246e38a7b472ffc4bb0b4a7128ad3187c6cf56fc0275d280070260330e276a.
4. **M1:** observed over 9867fa9f, failing at assertion (b) (report 1), and re-made by the reviewer at 9867fa9f with the same failure. T1's recorded-mutation comment is `protocol/data-plane/tests/candidate_a.rs:841-842 @ ccb68555 sha256:9bf305aff04192d0dad83cde20dd0d9cfc1b8955dd459930f17f52ebf4a8665b`.
5. **§7:** 47 changed lines over the two files, against at most 68: `server.rs` 5 against 8, and `candidate_a.rs` 42 against 60. The count is §7's command with the merge commit's first parent as the base.
6. **The Documentation findings fixed:**
   - the reviewer's D3, T1's comment, at 425dece2;
   - the reviewer's D4, the PR body's wire sentence, in the body before the merge;
   - the architect's D4, the worker report's base cite, in that report's filing note before it was filed.
7. **Recorded, not fixable in the branch:**
   - **Class 2, §0's summary sentence** (the architect's D1 and the reviewer's D1). §0 says the node's summary is corrected in this PR. It was corrected on main instead, in 45e7a0b0, so the branch need not take every record commit.
   - **Class 2, P4** (the architect's D2 and the reviewer's D2). P4 is not met as worded: at the base, the grep also finds this form's own lines. No reader of the detail exists, so the invalidator does not fire.
   - **§9's clippy line** (the architect's D3). No CI workflow runs clippy. It was not run, and is not reported green.
   - **The head commit's message** (the reviewer's D5) says the consumer side was read. Report 1 says the worker cited the decoder from the form without re-reading it. Both gates read the decoder at the head (the gate reports' Seam sections).
8. **CI:** the `pull_request` run 37723999952 at 9867fa9f failed on ubuntu in `kernel/tests/wire_bytes_invariant.rs`, outside this diff. Its failed steps are filed byte-identical at `state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt`, and the proposed node `wire-bytes-invariant-trace-flag-race` holds it.
9. **Done:** PLAN marks the node done, with evidence `{pr: 189}`, at generation 2, in this amendment's commit.

**Superseded index.** §0's sentence on the node's summary → item 7. §5's P4 → item 7. Neither is edited.
