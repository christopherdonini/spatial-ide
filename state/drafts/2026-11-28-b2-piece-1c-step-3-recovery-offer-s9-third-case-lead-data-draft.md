# The recovery offer's S-9 third case, lead-data's draft: the `recover-describe-refused` line of ADV-2026-11-28-01 item 4, its test case and its mutation

*Filed by the custodian as a draft, not as an amendment of the form, under `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-01-the-whole-at-most-6060-lines-the-discard-line-in-lib-rs-by-literals-only-a-refusal-after-opened-is-recover-describe-refused.md`, item 4. lead-data (Opus) read D:/wt/read-1128a at 4e7f48ada60da2ec91b69ac7660f496fcf138e3e, D:/wt/recov at 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b and the ruling's copy in D:/wt/adv-inbox, read only, and wrote no file. By the facts script its records run from 2026-11-28T01:30:22Z to 2026-11-28T01:33:27Z, with no call in the main checkout; by its completion notice it took 185340 ms and 19 tool uses. Its hand-back is below as received, with the harness indent removed: 8816 bytes, sha256 29413051008d3bfd27aa8aa419f2cd17e0a2324007b33dd270171be8463b49dc. The form's Amendment 21 carries its row.*

---

DRAFT READY

RESULT: I've worded S-9's third case and its mutation, M-S9-D, plus the `recover-describe-refused` line and where `admitRecovered` writes it. Part 1 comes to about 5,193 lines and the whole to about 6,053, so both stay inside ADV-2026-11-28-01 item 1's figures (5,200 and 6,060). No blocking question.
REPORT PATH: state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-s9-third-case-lead-data-draft.md
SHA256: not computed. I have no hashing tool, so the custodian computes it over the filed bytes.

Everything below is my wording unless it is marked verbatim. `recover-describe-refused` is byte-copied from ADV-2026-11-28-01 item 4. The M-S9 Old and New texts are byte-copied from the draft's Amendment 20 text, line 193.

## 1. The S-9 row with its third case, and its mutations

These are in the form of the draft's Amendment 20 table (Id | Test | Mutation | Fails). The draft's text gives each mutation in its test's row and gives mutations no rows of their own. So both mutations go in S-9's Mutation cell, each with a label. M-S9 stands as drafted. M-S9-D is new.

| S-9 | `a_refused_recover_or_a_describe_refused_after_it_logs_one_line_with_its_code_and_bounded_message_and_a_success_logs_none` (`RecoveryOffer.test.tsx`). `../skp/client` and `../diagnostics/log` are mocked as `frontends/shell/src/project/openProject.test.ts` mocks them (lines 20-42 at 97e2156d), `closeDataset` among them; `formatRefusal`, `shownRefusal` and `describeOpened` are real. **First case:** the recover wrapper throws `skp.recoverable_record_locked` with a message holding U+202E: the outcome is `refused`, and the logs are `[{level: "recover-refused", message: "skp.recoverable_record_locked: " + shownText(message)}]`. **Second case:** reset, the wrapper resolves an `opened` reply and describe resolves: the outcome is not `refused`, and the logs are `[]`. **Third case** (ADV-2026-11-28-01 item 4): reset, the wrapper resolves an `opened` reply and describe throws `skp.unknown_dataset` with a message holding U+202E; the close mock resolves at once, so `describeOpened`'s wait ends at the close: the outcome is `refused`, and the logs are `[{level: "recover-describe-refused", message: "skp.unknown_dataset: " + shownText(message)}]` | **M-S9:** Old ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);``, New ``logSessionEvent("recover-refused", `${e.skpError.code}: ${e.skpError.message}`);``. **M-S9-D:** Old ``logSessionEvent("recover-describe-refused", `${refusal.code}: ${refusal.message}`);``, New ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);`` | M-S9: S-9, at its first case's logs equality. M-S9-D: S-9, at its third case's logs equality |

- **Why M-S9-D fails at an assertion and not at a compile.** It swaps one string literal for another. `logSessionEvent`'s `level` parameter is `string` (`frontends/shell/src/diagnostics/log.ts`, line 20 at 97e2156d). The `recovered` flag is still read under the mutation. So the code still builds, and the third case fails at its logs equality: the level written is `recover-refused`. The first and second cases still pass under M-S9-D. M-S9 fails only the first case.
- **Each Old text is a whole line in the file**, leading whitespace aside, and stands once. That holds as long as no comment in `RecoveryOffer.tsx` carries either call in its double-quoted form. `discardEntry`'s line carries `"discard-refused"`, so it does not match either.
- **The rename is my choice.** The drafted name ends "one that succeeds logs none". The third case is a recover that answered `opened` and still logs a line, so that name would no longer be true. If the gates keep the drafted name, the row stands otherwise unchanged.
- **Places in Amendment 20 this touches**, as pointers only, for the custodian's amendment to carry by reference:
  - item 8 (a), which item 4 of the ruling replaces;
  - item 3's catch for `admitRecovered` (see 2 below);
  - item 6's §1 claim ("a successful one leaves none (S-9, S-10)"). I read that claim as "none of this kind", and I have not reworded it.

## 2. The line `recover-describe-refused` and where `admitRecovered` writes it

This is worded as the draft's Amendment 20 item 3 words `recover-refused`: the code and the bounded message after `shownRefusal(formatRefusal(...))`, as `reopen-refused` has them (`frontends/shell/src/project/openProject.ts`, lines 80-82 at 97e2156d). `admitRecovered` keeps its one catch.

- **`export async function admitRecovered(record, cancelKey, dataset)`:**
  - Before its `try`: `let recovered = false;`
  - In its `try`, once the recover wrapper's reply has been read as `opened` and before `describeOpened(dataset)`: `recovered = true;`
  - Its catch, in order:
    - `if (!(e instanceof SkpCallError)) throw e;`
    - `const refusal = shownRefusal(formatRefusal(e.skpError));`
    - `if (recovered) {`
    - ``logSessionEvent("recover-describe-refused", `${refusal.code}: ${refusal.message}`);``
    - `} else {`
    - ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);``
    - `}`
  - It then returns the refused outcome, as drafted.
- **What each branch covers:**
  - A typed refusal of the recover call itself leaves `recovered` false and writes `recover-refused`.
  - A typed refusal that arrives after the `opened` reply (the describe's, through `describeOpened`) writes `recover-describe-refused`.
  - An untyped failure is rethrown and writes neither, as in `admitProject`.
- **Its doc comment** gains one sentence: a refusal of the recover call writes `recover-refused`, and one after an `opened` reply writes `recover-describe-refused` (ADV-2026-11-28-01 item 4).

## 3. What this adds to Part 1, by file

| File | Group | Adds |
|---|---|---|
| `frontends/shell/src/project/RecoveryOffer.tsx` | shell product | about 8 (the flag's two lines, the five-line branch in place of one line, and about 2 doc-comment lines) |
| `frontends/shell/src/project/RecoveryOffer.test.tsx` | shell tests | about 10 (the third case; the rename adds no line) |

- **Groups:** shell product goes from 520 (Amendment 20) to 528, and shell tests from 540 to 550. src-tauri is unchanged by this item.
- **Lines:** Part 1 goes from at most 5,175 to at most 5,193. The whole goes from at most 6,035 to at most 6,053. Part 2 stays at 860.
- **Files:** none added. Part 1 stays at 47 and the union at 50.
- **Against ADV-2026-11-28-01 item 1:** inside both figures, with about 7 lines of margin each.
- **Not counted by me:** the item 2 changes the ruling words itself (`write_host_line`'s doc comment, which is the worker's words; `discarded_line` in place of `discarded_kind` and the `format!` line; T-6's closure if the capture does not coerce). The draft's src-tauri figure of 430 has almost no slack. If those changes add more than about 7 lines beyond the draft's src-tauri estimate, Part 1 passes 5,200, and the custodian's count would show it before code.

## 4. Anything in the ruling's items 2 or 4 that cannot be worded as ruled

- **Item 4:** nothing. The third case, its line and the one mutation are worded as ruled, and the mutation fails at the third case's equality.
- **Item 2:** not worded here, as the brief asks. From reading only (I compiled nothing), I found nothing that blocks the `'static` types:
  - `SessionLog::append` takes `level: &str, message: &str` (`state.rs`, line 68 at 97e2156d), and a `&'static str` passes to it.
  - `LogFn` is `Box<dyn Fn(&str, &str) + Send>` (`page.rs`, line 96 at 97e2156d). Item 2 already covers the case where that does not coerce to `&dyn Fn(&'static str, &'static str)` (a closure in T-6).

## Files read (all read only)

- D:/wt/adv-inbox/ADV-2026-11-28-01.md (whole)
- D:/wt/read-1128a/kernel/README.md (its owner's index, lines 357 to the end)
- D:/wt/read-1128a/engine/README.md (its owner's index, lines 533 to the end)
- D:/wt/read-1128a/state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-amendment-20-lead-data-draft.md (whole)
- D:/wt/read-1128a/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-46-a-discard-leaves-one-session-log-line-written-by-the-binding-a-refused-recover-or-discard-leaves-a-line-amendment-1-stands-for-now.md (whole)
- D:/wt/read-1128a/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md (§2.7 at lines 139-163; Amendments 17 to 19, lines 2542-2831; plus Greps)
- D:/wt/recov/frontends/shell/src/project/openProject.ts (whole)
- D:/wt/recov/frontends/shell/src/project/openProject.test.ts (lines 1-130, plus a Grep)
- D:/wt/recov/frontends/shell/src/admission/admitDataset.ts (lines 86-111, plus a Grep)
- By Grep only: D:/wt/recov/frontends/shell/src/diagnostics/log.ts (`logSessionEvent`'s signature); D:/wt/recov/frontends/shell/src-tauri/src (`LogFn`, `recording_log`, `SessionLog::append`)
