Reviewed: main at 49a6964701fd55cc64a3cca15311d827a922043b, in the detached read worktree C:/dev/wt/read-1123aa (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 6, attempt 4, node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-4, dispatched at 2026-11-23T18:30:19Z; its run: Read 12, Grep 8, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T18:30:29Z to 2026-11-23T18:39:32Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 14690 bytes, sha256 a517e323e9d8da33ab815a1437a90bc16de545eafe639baa47e245b843fabead, byte for byte, nothing masked, with one final newline added. FAIL on two Correctness findings, each fixed by words alone, with replacement words: C-11 (the open step clears a folder that is absent, the ordinary reopen, and can race the open own save; a row K-C40 added) and C-12 (the answer to C-9 names a sole caller that step 3a contradicts); five Documentation findings, N-27 to N-31, with replacement words; Amendment 6 carries the attempt-3 words faithfully; C-9 answered but for C-12, C-10, E-5 and N-19 to N-26 answered; the ceilings re-declared by N-30, their acceptance the advisor.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123aa @ 49a6964701fd55cc64a3cca15311d827a922043b

This is the architect's form gate, attempt 4, tag `node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-4`. It covers `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` ("form" below), read with Amendment 6's New texts in place. Every cite is at 49a69647. None of the sentences below is the human's wording, so the worker applies the words given here with no re-gate.

**In one line.** FAIL, on two Correctness findings, and both are fixed by words alone:
- **C-11:** the open's new step clears a folder that is not there, which is the ordinary case of every reopen.
- **C-12:** the answer to C-9 says the start's listing is the only product caller of both steps. That is untrue against the form's own step 3a.

Everything else in Amendment 6 holds.

## Amendment 6 against the attempt-3 report
- The report gives 21 Old/New pairs: C-9 ×3, C-10, E-5 ×4, N-19 ×3, N-20 ×2, N-21 ×2, N-22 ×2, N-23, N-24, N-25, N-26. Amendment 6 carries them in that order (items 2 to 22), and I found no content difference. The fences are four backticks, against the report's three; only the content is carried.
- **Each Old occurs once above Amendment 6:**
  - form :1206, :1220, :1019, :1054, :1207, :1213, :1222, :1226, :1021 (part of the line), :927, :1216, :984, :992, :1261 (part), :1262, :1001 (part), :1006, :1287 (part), :1237 (part), :1347, :1215.
  - No two of them overlap.
  - Every distinctive New fragment I searched occurs only at :1381 and below.
- Items 23 to 25 add only where each text goes and what comes next, plus one estimate attributed to the gate. Item 1's hand-back sha256 matches the filing note of the attempt-3 report (:1).

## Correctness (blocks)

**C-11. N-19's open step clears an absent folder and races this open's own save** (Amendment 6 item 11, form :1524).
- **How it happens.** The step reads only `history.jsonl`'s metadata. When the project has no record, the `<hex>` folder itself is absent. That is every ordinary reopen, so the text then orders removals of `locations.json`, any `.tmp-` file and the folder.
- **Two faults follow:**
  - The form says nothing about removal failures. An implementation that returns `NotFound` makes `list_recoverable(handle)` fail on every reopen. No row proves the ordinary case: K-C4, K-C19 and K-C20 all have a record, and S-5 is mocked.
  - `list_recoverable` takes no lock across I/O (form :1149) and runs beside this open's own save. A save whose move runs `create_dir`, then copies `locations.json` and makes the `.tmp-` file (`kernel/src/session_history.rs:551-556`), after the clear's metadata read can have that `locations.json`, or the `.tmp-` file, removed by the clear.
- **The given reason is also off.** A first save mints a new identity (`kernel/src/project/mod.rs:320`), so it never moves into P's folder. A later save is made by an open held in `saved` (:312-314), which holds the lock (:409-415, :876).
- **Why the fix is sound.** Once the folder is known to be there, this open's save cannot move into it, because `create_dir` refuses a folder that exists (:551). A `create_dir` failure returns before `copy_under`'s cleanup at :569, and the move is tried again at the next save (:347-348).
```text
It reads the metadata of `history.jsonl`. When that file is absent, the folder holds no step: a save's move that ended before its rename (`kernel/src/session_history.rs:551-562`), or a Discard that ended between its removals, left it. It is cleared at that open with no question: its `locations.json`, any `history.jsonl.tmp-` file and the folder are removed. No run can be moving a history into it, because this open holds the project's `open.lock` (`kernel/src/project/mod.rs:781`, :876; ADR-036 Amendment 1 item 3) and a first save takes it (:396).
```
```text
It reads the metadata of the folder, then of `history.jsonl`. When the folder is absent, nothing is listed and nothing is removed. When the folder is there and `history.jsonl` is absent, the folder holds no step: a save's move that ended before its rename (`kernel/src/session_history.rs:551-562`), or a Discard that ended between its removals, left it. It is cleared at that open with no question: its `locations.json`, any `history.jsonl.tmp-` file and the folder are removed; a removal that fails is ignored, as `end_session`'s are (`kernel/src/session_history.rs:444-446`), and the reply lists nothing for it. No other run can be moving a history into it: a first save mints a new identity (`kernel/src/project/mod.rs:320`), and a later save is of an open that holds its project's `open.lock` (:312-314, :409-415, :876; ADR-036 Amendment 1 item 3), which this open holds (:781). This open's own save cannot move into the folder while it is there, because the move's `create_dir` refuses a folder that exists (`kernel/src/session_history.rs:551`); a save during that one listing takes no move and moves at its next save (:347-348).
```
- Clause check:
  - "folder absent: nothing removed" closes the race, because the clear then makes no removal the move could meet.
  - "ignored as `end_session`'s": `let _ =` at :444-446.
  - "first save mints": `mint_identity()` at mod.rs:320.
  - "later save holds the lock": `known` comes from `saved` (:312-314), whose entries keep `_lock` (:414, :876).
  - "`create_dir` refuses": :551, which returns early through `?`.
  - "next save": the doc comment at :347-348.
- The race in the last sentence is inside one request round trip, so it is named and does not block.

Row added after K-C39 (it adds a test, see N-30):
```text
| K-C39 | `a_projects_folder_with_no_history_is_cleared_at_its_open` (the same folder, then `list_recoverable(handle)`: no entry, and the folder is gone) | the folder left in place | K-C39 |
```
```text
| K-C39 | `a_projects_folder_with_no_history_is_cleared_at_its_open` (the same folder, then `list_recoverable(handle)`: no entry, and the folder is gone) | the folder left in place | K-C39 |
| K-C40 | `a_reopen_with_no_record_folder_lists_nothing_and_removes_nothing` (a project saved, its recorder ended normally, then reopened in a new recorder with no `<hex>` folder: `list_recoverable(handle)` is `Ok` with no entry, and the root's folder names are unchanged) | the clear run on an absent folder, its removal errors returned | K-C40 |
```
- K-C40 is red before the fix (the command does not exist). Under the mutation, `remove_file` gives `NotFound` and the reply is an error on every system. No pass case is known.

**C-12. C-9's answer claims a sole caller the form contradicts** (Amendment 6 item 2, form :1398).
- `recover_session`'s step 3a runs "Amendment 4 item 4's dedupe, for this record alone" (form :1085, :1077). So the dedupe has two product callers.
- Read as binding, "only product caller" forces a second copy of the dedupe for step 3a, and K-C27 would prove only the start's copy. Not read as binding, the clause is false.
- The caller rule itself is met either way, since there is no test parameter. The words also do not say how the mutant compiles against K-C27's calls.
```text
The start's listing is the only product caller of both, and no parameter exists for the test)
```
```text
The start's listing calls both, and `recover_session`'s step 3a calls the same dedupe for its one record (Amendment 4 items 4 and 5); no parameter exists for the test, and the mutation carries the first names inside the walk's returned value, so K-C27's calls compile unchanged)
```
- Clause check: "the same dedupe" is :1077 and :1085. "Carries the names inside the returned value" is what attempt 3's clause check required (that report, :41).

## Evidence
None open. E-5 is answered; see below.

## Documentation (must be fixed before the merge; none blocks)

**N-27. Held fixtures must not be empty** (form :1200). N-19 (form :1510) and N-20 (:1568) skip the lock probe on a 0-byte history. If a test locks an empty file:
- K-C26, K-C27 and K-C37 go red on correct code;
- K-C34's mutation is never reached on any system.
```text
"The test holds" means a `File` the test opens and locks itself.
```
```text
"The test holds" means a `File` the test opens and locks itself; in K-C25 to K-C28, K-C34 and K-C37 the history so held holds a header and at least one step line, so that no `metadata` check reads it as absent or 0 bytes (Amendment 6 items 10 and 14).
```

**N-28. A stale sub-bullet under the known pass cases** (form :1223). Under H1 neither mutation removes anything on Windows.
```text
     - K-C28 and K-C34 drop the test's own handle before reading by path, so on Windows a removal the mutation made while that handle was open shows whichever delete semantics the system uses (H2). On macOS/Linux the file is unlinked.
```
```text
     - K-C28 and K-C34 drop the test's own handle before reading by path. On Windows neither mutation removes a file, because its read through its own handle fails first (H1); on macOS/Linux the mutation unlinks the files (H3), and the read by path finds them gone.
```

**N-29. Point (2) leaves out N-19's per-candidate `metadata` call** (form :1056).
```text
     - per candidate, one lock probe and at most `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes.
```
```text
     - per candidate, one `metadata` call on its `history.jsonl`, and, unless that history is absent or 0 bytes, one lock probe and at most `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes.
```

**N-30. The ceilings (Amendment 6 item 23).**
- **The gating route.** AUTONOMY §21a-§21c bear only on that: full gating stands (wire, guarantee; AUTONOMY.md:323-327), and the file count stays at 47 of 50, since K-C38 to K-C40 go in `kernel/tests/recovery.rs`.
- **The figures are low.**
  - The 30-60 covers C-9 and N-19's rows only. Not counted: N-19's open step and dedupe check, N-20's twin check, C-11's words, and K-C27's unit test, which sits in `kernel/src/recovery.rs` and so in the product row. My count is about 45-80.
  - Tests are about 100-145: K-C38, K-C39 (a save, a crash and a reopen), K-C40, K-C28's assertion and K-C36's fixture.
- Attempt 3 already called +270 tight (that report, :243), so both rows are likely to pass their figures. They should be re-declared now, before code. Acceptance is the advisor's.
```text
C-9's two private steps and N-19's rows K-C38 and K-C39 add product and test lines, which the gate puts at roughly 30 to 60 and 60 to 80. A row that passes its figure is re-declared by amendment before code, as the gate says.
```
```text
C-9's two private steps, N-19's open step and dedupe check, N-20's twin check, C-11's words and K-C27's unit test add about 45 to 80 lines to `kernel/src/recovery.rs`; K-C38 to K-C40, K-C28's added assertion and K-C36's fixture add about 100 to 145 lines to `kernel/tests/recovery.rs`. Re-declared here, before code: kernel product 1,070 to 1,160; kernel tests 1,800 to 1,950; total ≤ 5,500, ≤ 50 files.
```

**N-31. K-C36 now covers only the open** (Amendment 6 item 22). The start's `later-version` rule for a `restored` mark (form :1183) loses its fixture. The mutation as named still fails K-C36, so this does not block.
```text
a `saved-here` mark after s3; listed `later-version`, and the folder is still there)
```
```text
a `saved-here` mark after s3; listed `later-version`, and the folder is still there; and the same lines without that mark as an `unsaved-` record at a start: listed `later-version`)
```

## Attempt-3 findings, by id
- **C-9:** answered except for C-12. The two private steps have no test parameter. In the product's order:
  - the mutant leaves the new folder unseen and lists U, so K-C27 goes red;
  - correct code meets `WouldBlock` on the held candidate and withholds U, so K-C27 goes green, given N-27.
- **C-10:** answered and true. Step 2 counts only folders that hold the file, and step 4 needs the 257th (form :1020, :1022).
- **E-5:** answered.
  - **K-C28 on Windows.** The mutant's read fails (H1, form :31), and Amendment 2's rule lists the record `cannot-be-offered` (form :499). "No entry, in any state" then goes red.
  - **K-C28 and K-C34 on macOS/Linux.** The advisory lock lets the read succeed, and the files are removed.
  - **K-C34 on Windows** is a true named pass case.
  - **If the macOS/Linux observation waits,** the form is still sound on two conditions. The closing record must state K-C34's red as not yet observed, with the Windows run recorded as its pass case. And no record may claim K-C34 proves the probe there.
  - For the advisor: `.github/workflows/product-ci-rust.yml:205-208` already runs the workspace's tests on ubuntu-24.04 and macos-latest, so a pushed mutation commit can be observed now.
- **N-19:**
  - **The start's rule (form :1510) is sound under the locks.** A move holds U's lock until after its rename (`kernel/src/session_history.rs:558-562` before :374). So a taken U whose candidate has no history is the only copy.
  - **The open's rule** is sound once C-11 is applied.
  - **K-C38 and K-C39** each have one mutation, its set and no known pass case. Both are red before the fix, because the command does not exist.
- **N-20:** answered. Its cite :516-523 holds (`create_new` at :520, `try_lock` at :523).
- **N-21:** true at what an operator can observe. The cases the first sentence leaves out (a `restored` mark, which no product code writes; a damaged line) are not reached by ordinary use.
- **N-22, N-23:** answered and true (form :72, :625-626).
- **N-24 (the note draft):** true against the code: :423-425; `kernel/src/project/mod.rs:406` before :418; and the conditions at form :930-933. One exception is named: while another instance's listing holds the record, it is not cleared at that open (form :953). That window is one listing.
- **N-25 (question (g)):** true. It does not name item 3's leave on a lock or read failure other than `WouldBlock` (form :992), which ordinary use does not reach.
- **N-26:** answered (see N-31). The fixture chains under ADR-036 §9 (ADR-036:205). Under the mutation the clear's conditions hold, so the folder goes and the test is red.

## Files read (at 49a69647)
- `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, whole
- `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-3.md`, whole
- `kernel/src/session_history.rs`, :90-629
- `kernel/src/project/mod.rs`, :270-424 and :740-899
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, :200-279
- `governance/AUTONOMY.md`, :315-357
- `.github/workflows/product-ci-rust.yml`, :180-258, and the workflows' `runs-on` lines, by search

Opus 5.5 (claude-opus-5-5)
