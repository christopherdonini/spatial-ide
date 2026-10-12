*Custodian's filing note (2026-10-07): the architect's draft of `data-plane-crowded-start-detail-spaces`'s preregistration, on the custodian's brief at main a21435ed, drafted alone while the lead-data pilot is paused. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is a00f0e4255967b7a496a708b7dbfde80afae699a4670c9c4459a7fdbe50b8f62. Write audit PASS: zero write calls (Grep 26, Read 20, Glob 4, SubagentHandback 1). Run window from the transcript: 2026-10-07T10:22:49.724Z to 2026-10-07T16:10:36.704Z. An expired login stopped the run at about 10:25:48Z, and it was resumed by message at about 16:08Z, with one correction sent after it: main had not moved from a21435ed. The form as committed, `protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md`, is part 2's block with its 18 HASH-TBD pins computed at a21435ed. Nothing else changed. The custodian's check of the run count: at a21435ed the literal at `protocol/data-plane/src/server.rs` line 462 carries three runs of exactly 22 spaces, as the draft says, and it has carried them since the commit that introduced it, 87644cb4. At b6d1664 the literal is at line 436, also with three runs, so part 1's suggested check at line 356 of that commit reads a different line. N7's two-run count is the miscount. The pins in parts 1 and 3 below are left as returned.*

---

Reviewed: main @ a21435ed

(Both of the coordinator's mid-task messages are noted. I read every file in the main checkout, which is a21435ed, and every cite is at a21435ed. I made no write-capable call.)

## 1. Form choice, and what is left to the human

**The full form, with full gating from dispatch.** The five-line form is closed for two reasons:

- **§21a, the data-plane-or-wire category.** The crowded-start detail is a literal carried on the data-plane wire. `terminal_and_drain` puts it into the TERMINAL frame's payload: one code byte, then the UTF-8 detail (`protocol/data-plane/src/wire.rs:34`, `:87-90`). Changing its spaces changes the bytes and the length of a data-plane frame. The template's opening paragraph also names "the data plane / wire" (`docs/PREREGISTRATION-TEMPLATE.md:13`).
- **§25(e).** An honest `Out-of-scope` line could not say that the piece leaves the wire untouched. So no five-line form is committed for it.

**Size, by §21c's rule (tests included, this form excluded):** at most 8 lines in `server.rs` and at most 60 in `candidate_a.rs`, so at most 68 lines over 2 files. That is under the threshold. Full gating comes from the category, not from size.

**Where the form lives:** `protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md`. It is committed alone on main, and code lands only after #186 has merged. #186 (`C:/dev/wt/kcrf` @ 82140fe0) leaves `protocol/data-plane/` with an empty diff, and its form's §8 item 4 requires that. Its `server.rs:462` matches main's byte for byte, so the two pieces do not collide.

**What is the human's:** nothing in this piece. Every word an operator reads stays the same; only the three runs of spaces become single spaces, which question round 26, item 4 already ruled to file. So there is no OPEN item.

**A count discrepancy, decided here rather than opened (please check it):**
- At a21435ed the literal carries **three** runs of exactly 22 spaces, not two. A pattern requiring exactly 22 spaces at each of the three joins matched `server.rs:462`.
- Note N7 and the text of round 26, item 4 (b) both say two runs.
- An older worktree copy outside the repository also shows three, so this is very likely a miscount in N7 and not a later edit. That copy is untracked, so the form does not cite it. You can confirm with `git show b6d1664:protocol/data-plane/src/server.rs | sed -n 356p`.
- The node's title is about the string losing its runs, without a count, and all three runs come from the same lost continuation in the same literal. So I treat the third run as inside the ruling, not as a class-9 addition. If you read the ruling as limited to two runs, that would become a one-line OPEN item; I recommend against it.

**Record finding (Documentation; fix in the same PR before the merge):** the node's summary in `PLAN.yaml` says two runs. Correct it to three in the PR.

## 2. The draft

````markdown
# The data plane's crowded-start detail loses its runs of spaces — preregistration

## Header

- **Status.** The preregistration of PLAN node `data-plane-crowded-start-detail-spaces`. Committed before any code, alone on main. No code lands before PR #186 (`kernel-close-races-followups`) has merged. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form and full gating from dispatch (AUTONOMY §21a, the data-plane-or-wire category; §25(e)). The detail is a literal carried in the data-plane TERMINAL frame's payload (`protocol/data-plane/src/wire.rs:87-90 @ a21435ed sha256:HASH-TBD`), so a changed space is a changed wire byte. No five-line form exists for this piece.
- **Authority:**
  - PLAN node `data-plane-crowded-start-detail-spaces`, filed by question round 26, item 4, and placed by question round 31, item 1.
  - Moved to slot 2, after `kernel-close-races-followups`, by the 2026-10-05 product-first direction (`state/directives/2026-10-05-product-first-direction.md`, section 8, item e).
  - Drafting by the architect: question round 43, item 2.
  - Found by note N7 of `state/consults/2026-09-26-stream-registry-bound-gate1-architect.md:45 @ a21435ed sha256:HASH-TBD`.
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
- **The defect, re-derived.** The detail is the `format!` literal at `protocol/data-plane/src/server.rs:462 @ a21435ed sha256:HASH-TBD`, inside the timeout arm at `protocol/data-plane/src/server.rs:457-464 @ a21435ed sha256:HASH-TBD`. That arm is taken when a connection with no idle permit has sent no START within `CROWDED_START_TIMEOUT` (`protocol/data-plane/src/server.rs:430-441 @ a21435ed sha256:HASH-TBD`).
  - At a21435ed the literal carries **three** runs of exactly 22 spaces: after `ceiling`, after `so this` and after `rather than`. Each is a line continuation whose `\` and line break were lost, leaving the following line's indentation in the string.
  - N7 and the text of question round 26, item 4 (b) say two runs. This form fixes all three; it is one defect in one literal. The node's summary is corrected in the same pull request.
- **No test reaches this arm at the base.** No test in `protocol/data-plane/` or `kernel/` contains the detail's text. `an_idle_connection_holds_no_stream_slot_and_the_idle_ceiling_is_its_own` (`protocol/data-plane/tests/candidate_a.rs:800-839 @ a21435ed sha256:HASH-TBD`) connects beyond the ceiling but sends START at once, so it never reaches the timeout.
- **The consumer side of the seam.** The shell decodes the TERMINAL detail as opaque UTF-8 text and does not parse it (`frontends/shell/src/streaming/wire.ts:169-177 @ a21435ed sha256:HASH-TBD`). No product code in `frontends/`, `kernel/` or `engine/` contains the detail's text.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **May claim:** the bytes of the crowded-start detail. After the change, each of the three joins is one space, and the words, placeholders and punctuation are unchanged.
- **No other wire change.** The frame tags, the terminal code taxonomy (`protocol/data-plane/src/wire.rs:34-39 @ a21435ed sha256:HASH-TBD`), the framing and the code this arm sends (`TERM_TRANSPORT_FAILED`) are unchanged. The `no operation started` detail of the in-pool arm is unchanged. SKP is untouched.
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
- **The source shape is the worker's choice.** Either one line, or `\` continuations in the shape this file already uses for the admission refusal (`protocol/data-plane/src/server.rs:490-493 @ a21435ed sha256:HASH-TBD`), with each continued line ending in a space before its `\`. The new test pins the produced bytes either way, and `cargo fmt --all -- --check` passes.
- No other line of product code changes.

**Seam.** Producer: `handle`'s timeout arm, then `terminal_and_drain`, then the TERMINAL frame. Consumer: any data-plane client.
- The shell's decoder (`frontends/shell/src/streaming/wire.ts:169-177 @ a21435ed sha256:HASH-TBD`) passes the detail through as text, so nothing changes on that side.
- The end-to-end proof uses the real shape: a real WebSocket client in `candidate_a.rs` reads the actual TERMINAL frame through the suite's own `drain` (`protocol/data-plane/tests/candidate_a.rs:263-306 @ a21435ed sha256:HASH-TBD`), which reads the payload length, then the code byte, then the UTF-8 detail.
- No `pub` item, option, callback or code path is added.

**Owner's index.** `protocol/data-plane/README.md` carries no owner's-index lines at a21435ed, and the piece touches neither `engine/` nor `kernel/`, so no index update is owed (the product-first direction, section 1). The README's ceilings line (`protocol/data-plane/README.md:124-125 @ a21435ed sha256:HASH-TBD`) names values, not this text, and is unchanged.

**Portability.** Not OS-dependent, so R3's section is not required: no `cfg`, no path literal, no new ignore.

**KNOWN-LIMITATIONS.** Nothing owed.

## §3. Fixtures

None. The test uses the suite's synthetic `factory`.

## §4. Tests, and the mutation per new test

**T1 (new), in `protocol/data-plane/tests/candidate_a.rs`.** The name is the worker's, in the suite's sentence style; for example, `a_connection_beyond_the_idle_ceiling_that_never_starts_is_told_why_in_single_spaced_words`.

Shape, binding:
1. Start a data plane with the suite's `start` and `factory`.
2. Open `MAX_IDLE_CONNECTIONS + 1` connections with `connect`. None sends START or any credit.
3. Await the **first** TERMINAL to arrive on any of them: race `drain` over all of them, bounded by the suite's `RECV_DEADLINE` (`protocol/data-plane/tests/candidate_a.rs:251 @ a21435ed sha256:HASH-TBD`).
   - This is deterministic without a sleep. An idle permit is released only at START or at that connection's own timeout (`protocol/data-plane/src/server.rs:430-441 @ a21435ed sha256:HASH-TBD`, `protocol/data-plane/src/server.rs:478 @ a21435ed sha256:HASH-TBD`).
   - So exactly one connection runs on `CROWDED_START_TIMEOUT`, whatever order the handlers run in. The other `MAX_IDLE_CONNECTIONS` wait on `START_TIMEOUT`, which is longer than `RECV_DEADLINE`, so the crowded connection's terminal is the first to arrive.
4. Assert:
   - (a) its code is `wire::TERM_TRANSPORT_FAILED`;
   - (b) its detail equals the §2 C1 template text rendered with the public constants `server::MAX_IDLE_CONNECTIONS`, `server::CROWDED_START_TIMEOUT` and `server::START_TIMEOUT`;
   - (c) its detail contains no run of two spaces.
5. Drop the pending receives. Close every connection, as the suite's existing test does (`protocol/data-plane/tests/candidate_a.rs:834-838 @ a21435ed sha256:HASH-TBD`), then call `dp.shutdown()`.

Forbidden in T1: a sleep for synchronisation; any elapsed-time assertion; waiting on `START_TIMEOUT`; and any new `pub` accessor. Wall time is about `CROWDED_START_TIMEOUT`.

**Recorded mutation, M1.** Restore the literal to its a21435ed bytes, so the three 22-space runs come back. Predicted: T1 fails at assertion (b), by its message.
- The observation is made by applying M1, running T1 by name, recording its failure with the commit it was observed at, and reverting (round 25, item 2 (c)).
- No `verify-mutation` run is an observation.
- T1 carries a `RECORDED MUTATION (M1)` comment in the suite's existing style (`protocol/data-plane/tests/candidate_a.rs:841 @ a21435ed sha256:HASH-TBD`), naming the mutation and the failing assertion with no line number.

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

**Suites, green before either gate.** Heavy runs follow the paragraph the worker's brief carries from `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ a21435ed sha256:HASH-TBD`; this form names no other rule for running builds.
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
````

## 3. OPEN items

None. No word an operator reads changes. The only judgement call, counting the third run as inside the ruling, is decided in item 1 above and disclosed in the form's §0.

## 4. Files read (all at a21435ed, in the main checkout, unless noted)

- `C:\dev\spatial-ide\PLAN.yaml` (the node and `data-plane-crate-fmt`)
- `C:\dev\spatial-ide\DECISIONS-PENDING.md` (question round 26's RULED block)
- `C:\dev\spatial-ide\state\questions\round-26.md`
- `C:\dev\spatial-ide\state\consults\2026-09-26-stream-registry-bound-gate1-architect.md` (N7)
- `C:\dev\spatial-ide\protocol\data-plane\src\server.rs`
- `C:\dev\spatial-ide\protocol\data-plane\src\wire.rs` (the terminal codes and the payload)
- `C:\dev\spatial-ide\protocol\data-plane\tests\candidate_a.rs`
- `C:\dev\spatial-ide\protocol\data-plane\README.md`
- `C:\dev\spatial-ide\protocol\data-plane\STREAM-REGISTRY-BOUND-PREREGISTRATION.md` (line 173, from a search)
- `C:\dev\spatial-ide\frontends\shell\src\streaming\wire.ts` (the TERMINAL decoder)
- `C:\dev\spatial-ide\.github\workflows\rust-fmt.yml` (CI runs `cargo fmt --check`)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`
- `C:\dev\spatial-ide\AUTONOMY.md` §21 to §22 and §25 to §30
- `C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md`
- `C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md`
- `C:\dev\spatial-ide\state\directives\LEAD-DATA-PILOT-V2-2026-10-05.md`
- `C:\dev\wt\kcrf\kernel\GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md` (#186 @ 82140fe0, read-only, used as a shape precedent) and `C:\dev\wt\kcrf\protocol\data-plane\src\server.rs:462` (identical to main)
- `C:\dev\wt\triage-a3-obs3\protocol\data-plane\src\server.rs:345`, an older untracked copy that also shows three runs. It is my evidence only, and the form does not cite it.

Searches showed that no file in `docs/` names this refusal, and that no test or product code in `protocol/data-plane/`, `kernel/` or `frontends/` contains the detail's text. There was no impact read, because the pilot is paused.
