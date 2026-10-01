# The audit reader's plain_date shows a value cut at byte 16 as stored, instead of panicking (wave-1 A3 observation 1, S2) — preregistration

**Authority:** PLAN node `audit-reader-char-boundary`, placed position 6 of 16 by question round 31, item 1 (RULED 2026-09-30). Origin: wave-1 A3, unproven observation 1 (`state/cloud/wave1/A3.md:70` @ ee54158 sha256:8b8925678e350f1f597075dddc4e93af8e8ab6dfca895cb9480bde4ec6bcfb46; custodian field `state/cloud/wave1/A3.md:87` @ ee54158 sha256:8c0486d4e4c13813cdab4479e56639c70c8e11cf718c6808d3de2fd3514925a0). Evidence, not Authority; nothing from any `cloud/wave1-*` branch merges.
**Drafted by** the architect agent on the custodian's brief, read at `main` ee54158 (the consult: `state/consults/2026-10-01-audit-reader-char-boundary-architect-draft.md`). Shape model: `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`. **Committed before any code**, on main, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at ee54158 (the architect had no Bash); (2) the consult's path in the line above; (3) this line. The draft is the architect's second: at the custodian's request it folds the five misquoted passages in `reader.rs` into scope (§2 item 6), which its first draft routed out, because they sit in the file this form already scopes. Nothing else changed.
**Gating:** full. AUTONOMY.md §21b admits docs, tests and polish only, and this piece changes a product guard. It also edits a stated property under test (§21a): the reader's fallback (`kernel/src/permission/audit/reader.rs:190-193` @ ee54158 sha256:eb181c9fe514cdbc999c94099e81fd606ad191d93fadd0fb7f9b296e62193a47), inside its corruption-is-visible doctrine (`kernel/src/permission/audit/reader.rs:19-26` @ ee54158 sha256:eb0d4d454ea7c2c738b7d3231afae6bdfba80d4e8ba3a87bf71153ade3d8733e). Under round 25, item 2 (e), no five-line form is used.
**The node title's "refuses"** means refusing to slice. Nothing new is refused to the operator.

## §0. Disclosure
- Reasoned from code. A3's cite is at its baseline bb98f71 and is not reused. A3 did not reproduce the panic; P0 (§4) is its first reproduction.
- The site: `kernel/src/permission/audit/reader.rs:195-196` @ ee54158 sha256:b6b9ac63815b2407c4c3d0c533f5b9564dbc7fc0b847b013877bd350fd59dbcd.
  - Byte 10 equal to the ASCII `T` makes 10 and 11 char boundaries. Index 16 is the only one that can fail.
  - The panic set at the base: an `at` of at least 17 bytes, `T` at byte 10, and byte 16 inside a multi-byte character.
- The callers: `kernel/src/permission/audit/reader.rs:264` @ ee54158 sha256:e802cecdbf4f423885989dd2f4f45ae5ee0aa4b41825c9c0ada7f22c5407a036, `kernel/src/permission/audit/reader.rs:309` @ ee54158 sha256:7c754feec61486f9ee3b0a66efcc028aa681d7e243d613c0bd7385512a34df33, `kernel/src/permission/audit/reader.rs:314` @ ee54158 sha256:e802cecdbf4f423885989dd2f4f45ae5ee0aa4b41825c9c0ada7f22c5407a036.
- The operator path: `kernel/src/bin/publish-bundle.rs:177-215` @ ee54158 sha256:09ced48d9690b07bfcfc576ab7bd82dedf6809c001d9e0f1c3dbfba694948e2e. Every line is built before any is printed.
- Reachability: only through a hand-edited or corrupted log, or a library caller's own clock.
  - `at` is `(attempt.clock)()` (`kernel/src/permission/boundary.rs:129` @ ee54158 sha256:c274c0411d6d0c22b3848557b36466fc177c138a12c478af30bab6648c1152fb).
  - The writer refuses control characters in it, not non-ASCII (`kernel/src/permission/audit/record.rs:195` @ ee54158 sha256:194a1485b062815ebb86c40f7c5a2ab280d44c464701ba566ae807378a03d8b4).
  - Both product clocks are `rfc3339_utc_now` (`kernel/src/bin/publish-bundle.rs:617` @ ee54158 sha256:ac5db1b1788ea258082db566a372b5b6e13b77700e38e18a0a62f4c1309a4b61; `frontends/shell/src-tauri/src/publish.rs:705` @ ee54158 sha256:ac5db1b1788ea258082db566a372b5b6e13b77700e38e18a0a62f4c1309a4b61), and it is ASCII by construction (`kernel/src/permission/audit/clock.rs:42-47` @ ee54158 sha256:80be66e0e70e33c70c19bf019a2d34dee518397624d17e0bf9f1dc000bd097ac).
- **H1 (hypothesis):** no product caller passes a clock other than `rfc3339_utc_now`. Discriminator: §6 item 2. A product caller found is invalidator I6.
- Intake:

  | Item | Disposition |
  |---|---|
  | A3 observation 1 | In |
  | The fallback doc's base overclaim (the guard is not a shape check, yet the doc says any value off the shape is shown verbatim) | In: the doc this fix edits (§2 item 2) |
  | Five quoted doc passages in `reader.rs` that do not byte-match their named sources; two of them name the wrong source | In: §2 item 6, comment lines only |
  | `kernel/src/permission/audit/log.rs:324` and `:327` (same commit as the next cell) | Out: the writer's own canonical line; both ends fall on ASCII `"`, so they are boundary-safe for any input (`kernel/src/permission/audit/log.rs:301-328` @ ee54158 sha256:f36d0b5607d184de6f048b1d30981e977c1d27438f41a2f214d5bcbb390c56fb) |
  | `kernel/src/permission/audit/normalize.rs:156-159` @ ee54158 sha256:0bdb36f34e28c66de72c071f3e7ecae077a4c59c4406dd6cca3c0215f5ec97b2 | Out: already guarded |
  | `clock.rs`'s test indexing of byte 10 | Out: a test over the clock's own output |
  | A log that is not valid UTF-8 is refused whole (`kernel/src/bin/publish-bundle.rs:196-198` @ ee54158 sha256:ada7296b60f3f2fd8b3f927dd519eb9c2b7b3cf63733eb4f43baea9a458fd686) | Out: not a panic; routed to the custodian as its own proposed node |
  | Wave-3 W3-A finding A-3 (a relative `XDG_DATA_HOME`) | Out: PLAN node `port-2-macos-l1-and-app-dirs` |
  | A3 observations 2 to 5 | Out: their own dispositions |

- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. `plain_date` returns for every `&str`. This is a reading of its guard, sampled by T1.
  2. For every input on which `plain_date` returned at the base, it returns the same string. It differs only on the base's panic set (§0), where it returns the input unchanged. This is a reading of the guard's algebra, sampled by T1 (S4).
  3. A log carrying such an `at` in a pair, an orphan outcome or an orphan intent renders one sentence per record. Each sentence starts with the stored value, and none reads CORRUPT (T2). `--audit-show`'s line function returns `Ok` with the header and that sentence (T3).
  4. Each of §2 item 6's five passages:
     - states only what its true source states;
     - is labelled as paraphrase and names that source;
     - has no quotation marks and no claim to be verbatim.
     P1 credits condition 2's wording to the custodian's record of the human's ruling, not to the human. These are comment lines and change no behaviour.
- **May not claim:**
  - a reachable product writer path (H1);
  - the binary's stdout or exit code at the base (read, not observed);
  - that a value passing the guard is a valid timestamp;
  - anything about control characters or newlines in a stored value as shown;
  - anything about a log that is not valid UTF-8;
  - quote fidelity of any doc passage outside `reader.rs`;
  - any `docs/08` figure.
- **Unchanged:**
  - `render_audit_log`'s signature;
  - every caller of `plain_date`;
  - the fallback arm and both slices;
  - the CORRUPT doctrine;
  - no new string, CORRUPT category or exit code;
  - no wire, SKP-V0, ADR or KNOWN-LIMITATIONS change;
  - ADR-006 classes (the reader is read-only).
- **Seams:** none new. The consumer `audit_show_lines` calls `render_audit_log(&str) -> Vec<String>` as it does at ee54158, and T3 is the end-to-end test from that real shape, over a real file. T1 calls the private `plain_date` from its own module's tests; it is not a new item, and it has product callers. The gate checks this reading.

## §2. The change
1. `kernel/src/permission/audit/reader.rs`, `plain_date`'s condition: `at.len() >= 16` becomes `at.is_char_boundary(16)`. That call is false past the end and true at the end, so it covers the length check, as in `kernel/src/permission/audit/normalize.rs:154-156` @ ee54158 sha256:e3905ad51c6693cb095bd86b89b0136cabfb00f05247efbfcf99c8bf0ea2ac1d. The `T` check, both slices and the fallback arm stay byte for byte.
2. `plain_date`'s doc states:
   - the check: byte 10 is `T`, and byte 16 is a char boundary (so the value has at least 16 bytes);
   - why only 16 needs checking: the ASCII `T` makes 10 and 11 boundaries;
   - that a hand-edited or corrupted log can put a multi-byte character across byte 16;
   - that a value passing the check is sliced whether or not its other bytes are digits;
   - that any other value is returned unchanged.

   The base's "does not match the shape … rather than mangled" sentence is replaced. The clock.rs reasoning sentence stays.
3. Tests: T1 and T2 in `reader.rs`'s `mod tests`; T3 in `publish-bundle.rs`'s `audit_show_tests`.
4. Nothing else: no new item of any visibility, and no product change in `publish-bundle.rs`.
5. Portability (`state/directives/PORTABILITY-2026-09-30.md` §2):
   - **R1:** str boundary semantics are the language's, identical on every platform.
   - **R2:** no `cfg`. Neither file is a boundary file. The audit log's two named boundaries (application directories; case policy) are untouched, and T3 passes an explicit path, so the resolver is not called.
   - **R3:** does not engage. This is not an OS-dependent feature.
   - **R4:** no new coupling. New test paths come from `temp_dir`, and destinations carry no drive letter.
   - **R5:** L1 on the platforms CI runs, nothing at L2 or L3.
   - **R6:** no test is ignored on any platform.
6. The five doc passages in `reader.rs`, comment lines only.
   - In each passage, only the quoted span and its attribution change. The words of each corrected text below are binding; line wrapping at 100 columns is the worker's.
   - Each corrected text is new prose, not a quotation. No passage keeps quotation marks or italic quotation, and none says verbatim.

   | # | Current text | Source it names | True source | Corrected text |
   |---|---|---|---|---|
   | P1 | `kernel/src/permission/audit/reader.rs:6-8` @ ee54158 sha256:a24ee836e789e7ffd7138f11d1e31236f1c49700477b860e180ad1cba2ad556a | ADR-017's Exposure review, condition 2, as the human's own words, verbatim | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1123-1125` @ ee54158 sha256:729b169d4949cae509c6d9ecd5116770e48a04e643ef77995eb11d27b699b681: the custodian's record of the human's ruling. That section's note at `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1131-1132` @ ee54158 sha256:e9603abe9cd8b03f8b145d57aa385a15c4227d87a4ab6e0ddf658f1e896f5b10 marks only quoted text as verbatim, and condition 2 carries no quotation marks | **ADR-017's Exposure review, 2026-08-17, condition 2**, in paraphrase of the custodian's record of the human's ruling there: the audit record must be human-legible without a decoder in the loop; the raw JSONL was honest but unreadable by its own audience (G6). The sentence that follows (This module is that reader …) is unchanged. |
   | P2 | `kernel/src/permission/audit/reader.rs:21-23` @ ee54158 sha256:55c24bbfc51fbc26b92c759ccf4fafea38f0f4e8bd9d0e32d7e09cea7b1aa449 | `super::log`'s module docs (correct) | `kernel/src/permission/audit/log.rs:41-43` @ ee54158 sha256:7bdfd05dc0fc508d32c16706d8f9a6d08c796d74cc74b4946baca5fc7857fd3e; the quote drops the source's emphasis markers | The same doctrine `super::log`'s own module docs state for the write side (in paraphrase: an interleaved line fails to parse and is visible as corrupt, rather than silently changing a valid record's meaning) governs the read side too. |
   | P3 | `kernel/src/permission/audit/reader.rs:30-31` @ ee54158 sha256:d42de70578af7acf87a3a3b22153376da337a7ae2b7c683d0c08c09c9cec3a1c | `super::mod`'s module docs (wrong: the words are not there) | `kernel/src/permission/audit/record.rs:47-51` @ ee54158 sha256:a10a70efebe71de276caba7bc41088602bbd88be15badc7717e9c2d7ad357098, the doc of `AUDIT_SCHEMA` | `super::record`'s doc on `AUDIT_SCHEMA`, in paraphrase: the log is append-only, so generation N and generation N+1 coexist in one file forever, and a reader will meet both. The sentence that follows (This is not hypothetical …) is unchanged. |
   | P4 | `kernel/src/permission/audit/reader.rs:211-212` @ ee54158 sha256:1d6893a0ce087de204b815e360c840e948f5168b3eb3ee18f08d6c8852f3acfb | `boundary.rs::error_kind`'s doc comment (correct) | `kernel/src/permission/boundary.rs:193` @ ee54158 sha256:48ffaa899bf28dc19b7ae1c416af415dac18def6f3b0caaaa0e734593ab63725; the quote changes the source's capital letter | (`boundary.rs::error_kind`'s own doc comment, in paraphrase: a variant name, never a rendered message) |
   | P5 | `kernel/src/permission/audit/reader.rs:342` @ ee54158 sha256:7bb959cbb15953808feddaadf46b6de2a48f887b3ef91b544d81569f31034260 (a test comment) | `log.rs`'s module docs (correct) | `kernel/src/permission/audit/log.rs:41-42` @ ee54158 sha256:9cec1983a1bfa4c3007091877a9f44ff65d732c0434b57f0f70c91b5acbf9eaa; the quote drops the source's emphasis markers | (`log.rs`'s own module docs, in paraphrase: an interleaved line fails to parse). |

## §3. Fixtures and predicted outcomes
All inputs are in-memory except S6, which writes its own file under the existing `workspace` helper with a name no other test uses. Nothing is hash-verified (disclosed), and no claim depends on file bytes beyond the record text.

| # | Scenario | Base | After |
|---|---|---|---|
| S1 | `plain_date("2026-08-17T08:4é")` (2-byte, bytes 15–16) | panic | the input |
| S2 | `plain_date("2026-08-17T08:€Z")` (3-byte, bytes 14–16) | panic | the input |
| S3 | `plain_date("2026-08-17T08:4😀")` (4-byte, bytes 15–18) | panic | the input |
| S4 | `plain_date("2026-08-17T08:44é")` (byte 16 is a boundary) | `2026-08-17 08:44` | same |
| S5 | `render_audit_log` over a pair whose outcome `at` cuts byte 16, an orphan outcome and an orphan intent, each `at` cut the same way, written in the JSON as `\u00e9` | panic | 3 lines, each starting with its stored `at`, none containing CORRUPT |
| S6 | `audit_show_lines(Some(file))`, one intent line with the character as raw UTF-8 bytes, destination `out/cut-cli` | panic | `Ok`, 2 lines: the header, then a sentence starting with the stored `at` and containing `interrupted?` |

## §4. Tests, one mutation each
- No sleep, timeout, spawned thread or timing assertion (round 25, item 1 (a)). No test-only hook in product code. The shared `fixture()` helper is not edited.
- **P0**, before any code: T1, T2 and T3 at the test-only commit each fail with the standard library's char-boundary panic. Recorded by name, with that commit.
- **T1** `a_timestamp_cut_by_a_multibyte_character_at_byte_16_is_returned_verbatim_not_sliced` (S1 to S4, S1 first).
  - Mutation M1: the condition restored to its base text. T1 panics at S1.
- **T2** `each_sentence_whose_at_cuts_a_character_at_byte_16_starts_with_the_stored_value` (S5).
  - Asserts length 3 and, per record, the stored prefix plus its marker: `SUCCEEDED`, `outcome recorded with no matching intent`, `intent recorded, no outcome (interrupted?)`. No line contains `CORRUPT`.
  - Mutation M2: the new condition's index 16 becomes 15. T2 panics at its first record.
- **T3** `an_audit_log_whose_at_cuts_a_character_at_byte_16_is_shown_not_a_panic` (S6), with the workspace name `audit-show-cut-at-byte-16`.
  - Mutation M1, applied on its own. T3 panics.
- §2 item 6 is comment lines only. It adds no test and needs no mutation.
- Mutations are observed by applying one, running the named test, recording its failure by name in the test's doc with the commit, and reverting. A `verify-mutation` run is not an observation.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** P0 fails at the base. T1 to T3 pass on the fix, and each fails under its own mutation. Every other kernel test passes.
- **Declared unchanged:**
  - `reader.rs`'s eight tests, `a_success_pair_reads_as_one_plain_sentence` through `blank_lines_are_ignored_without_being_reported_as_corrupt`, whose code is unchanged (P5 is a comment inside `fixture()`'s array);
  - `publish-bundle.rs`'s `an_explicit_path_argument_is_read_and_rendered`, `a_missing_log_is_reported_not_errored`, `an_empty_log_says_so` and `no_path_argument_falls_back_to_the_env_override`;
  - `clock.rs`'s and `normalize.rs`'s tests;
  - every non-comment line of `reader.rs` outside `plain_date`'s condition, byte for byte;
  - every comment line of `reader.rs` outside `plain_date`'s doc and §2 item 6's five passages;
  - no claim of any of the five passages changes: only how each is attributed and marked.
- **Invalidators:**
  - **I1 (invalid run):** a P0 test passes at the base. Recorded as class 2.
  - **I2 (stop, to the human):** the fix needs a new string, CORRUPT category, exit code or wording.
  - **I3 (stop):** a declared-unchanged test fails.
  - **I4 (stop, to the custodian):** another input-derived byte-index slice is found in `reader.rs`.
  - **I5 (stop):** the fix needs a change outside `plain_date`'s condition and doc.
  - **I6 (stop, regrade):** a product clock other than `rfc3339_utc_now` is found (H1).
  - **I7 (stop):** a test needs timing, a thread or a hook.
  - **I8 (stop, to the custodian):** at the worker's read, a passage's true source as §2 item 6 names it does not carry the paraphrased content, or a corrected text would have to state something its source does not.
- **Falsification:** any `&str` makes `plain_date` panic after the fix; or any input on which the base returned now returns a different string; or `--audit-show`'s output for a log without such a value differs from the base; or a corrected passage states what its named source does not.

## §6. Instruments
Assertions only:
1. String equality and prefix, line counts, `Ok`.
2. The clock grep: `git grep -n "clock:" -- kernel/src frontends/shell/src-tauri/src`, read for product `PublishAttempt` clocks (H1).
3. The slice grep: `git grep -nE "\[[^]]*\.\.[^]]*\]|split_at|split_off" -- kernel/src/permission/audit`, read for input-derived `str` receivers (I4).
4. `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit (round 15 (c)).
5. The quote grep: `git grep -nE '^\s*//.*"' -- kernel/src/permission/audit/reader.rs`, read hit by hit at head. Each remaining quotation either matches its named source byte for byte or quotes an example value or the reader's own output. P1 to P5 must not appear among the hits.
6. Each corrected passage in §2 item 6, read against its true source at ee54158 (I8).

## §7. Declared values and ceilings
- No new constant. The index 16 is the existing slice end.
- **Size budget:** ≤ 175 changed lines, insertions plus deletions, over ≤ 2 files (`kernel/src/permission/audit/reader.rs`, `kernel/src/bin/publish-bundle.rs`).
  - Counting command: `git diff --numstat <merge-base>...<head> -- . ':!kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: about 12 product and doc lines for the fix, 25 comment lines for §2 item 6, and 90 test lines.

## §8. Block-on-sight
1. Any `reader.rs` change other than `plain_date`'s condition and its doc, §2 item 6's five comment passages, and T1 and T2; the fallback arm, either slice, a caller or `render_audit_log` changed.
2. Any product change in `publish-bundle.rs`.
3. Any new string literal, CORRUPT category, exit code or operator-visible wording.
4. Any other file; any diff under `engine/`, `protocol/`, `frontends/` or `docs/`, or to KNOWN-LIMITATIONS or SKP-V0.
5. The five passages edited other than as §2 item 6 gives:
   - a non-comment line touched in the same hunk;
   - a quotation mark or italic quotation kept around paraphrased words;
   - "verbatim" or "own words" kept;
   - wording credited to the human;
   - a source named other than the true source in §2 item 6;
   - content added that the source does not state.
6. Doc text that calls the guard a full timestamp-shape check, says a value off the shape is shown verbatim, or claims anything about control characters.
7. Any new item in product code; a test-only hook; a `cfg(test)` branch in product code.
8. A sleep, timeout, spawned thread or timing assertion in T1 to T3.
9. Any `cfg(windows|unix|target_os)`; a platform ignore; a drive letter in a new test path or destination.
10. A declared-unchanged test's assertions edited; `fixture()`'s code edited (P5's comment is the only change inside it).
11. A workspace or fixture name shared with another test.
12. Anything from `cloud/wave1-*` merged or cherry-picked.
13. A record calling a `verify-mutation` run an observation; a mutation without its commit.
14. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class-9 amendment.
15. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit or named without its commit id;
    - a bare self-line;
    - reproduced text without its path:line and hash;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so.
16. A squash or rebase merge.

## §9. Gates
- **Architect:**
  - the Header's §21b and §21a reading;
  - §1's scope closure (§1 May 2's equivalence, the three callers, the doc's statement of the check);
  - ADR-017's Exposure review condition 2 (legibility unchanged for a valid log), and P1's attribution against that section's own note;
  - each of P1 to P5 against its true source (§1 May 4, §8 item 5);
  - ADR-006;
  - docs/01's operator-visible text ruling (no new message);
  - the caller rule and the seam reading (§1);
  - R1 to R6;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - P0 at the test-only commit;
  - M1 (on T1, and on T3 separately) and M2 observed;
  - §7 recounted;
  - §6 items 2, 3, 5 and 6 re-run.
- **Suites, green before either gate:**
  - `cargo test -p spatial-kernel` on Windows (the library and the `publish-bundle` bin); `cargo clippy`;
  - `cargo fmt --check`, read as no new hunk in the touched files and counted over stdin, never on a file copy;
  - `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`, each with the tool's commit;
  - CI's `node --test` scripts suite;
  - branch CI read before gating.
- **Operator:** none. A valid log's output is unchanged.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)
