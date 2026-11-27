Reviewed: main at fe99e848713768a6d8338b96ee2b8ac4c9c891cb, in the detached read worktree C:/dev/wt/read-1123ab (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 7, attempt 5, node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-5, dispatched at 2026-11-23T19:07:36Z; its run: Read 11, Grep 9, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T19:07:48Z to 2026-11-23T19:16:04Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 11193 bytes, sha256 0b807e022ca5bacd9c3385653609dba7e89dfc54a5c9f91b09ab46354c22eebe, byte for byte, nothing masked, with one final newline added. FAIL: one Correctness finding, C-13 (at an open the step still locks a 0-byte history, which the form's own §8 item 12 blocks on sight; its fix is words that change what the code does, so §31 does not cover it), with replacement words, a row K-C41 and ceilings of 1,980 kernel test lines and 5,530 in total; two Documentation findings, N-32 (C-11's last sentence claims this open's own save cannot be raced) and N-33 (Amendment 7 item 3's pointer); Amendment 7 carries attempt 4's words faithfully; C-12 and N-27 to N-31 answered, C-11 answered but for C-13 and N-32.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123ab @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb

This is the architect's form gate, attempt 5, tag `node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-5`. It covers `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` (called "form" below), read with Amendment 6's and Amendment 7's New texts in place. Every cite is at fe99e848. None of the sentences below is the human's wording.

**In one line.** The verdict is FAIL on one Correctness finding, C-13: at a project's open, the step still locks a 0-byte history, which the form's own §8 item 12 blocks on sight. The fix is words, but they change what the code does, so §31's no-re-gate path does not cover it. There are also two Documentation findings, N-32 and N-33. Amendment 7 carries the attempt-4 words faithfully. C-12 and N-27 to N-31 are answered, and C-11 is answered except for N-32 and C-13.

## Amendment 7 against the attempt-4 report
- **What it carries.** The report gives eight Old/New pairs: C-11 ×2, C-12, N-27, N-28, N-29, N-30 and N-31. Amendment 7 items 2 to 9 carry them in that order, and I found no content difference. The fences are four backticks, against the report's three.
- **Each Old occurs once above Amendment 7:** form :1524 (part of the line), :1540, :1398 (part), :1200 (part), :1223, :1056, :1684 (part) and :1681 (part). No two of them overlap.
- **The New texts.** Each distinctive New fragment occurs only at :1709 or below (:1709, :1724, :1738, :1752, :1766, :1780, :1794, :1808).
- **Items 10 and 11** only send items to the advisor and say what comes next.
- **One custodian pointer is wrong.** See N-33.

## Correctness (blocks)

**C-13. At an open, the step locks an empty history** (form :1524; the sentence after Amendment 7's New text).
- **What the form says.** With Amendment 7 in place, step 1 runs `try_lock` on any `history.jsonl` that is present. §8 item 12 blocks on sight "a lock taken by the listing on an empty history" (Amendment 2 item 4, form :642).
  - The start's walk excludes an empty history (:622), and so do the start's candidates (:1510) and the twin probe (:1568).
  - The open's step is the only path left without that check.
- **How a 0-byte `<hex>` history arises.** A history is created at `kernel/src/session_history.rs:520` and locked only at :523.
  - While this open holds `open.lock`, only this open's own step can be making one: a step made after a save bound the open goes through `create`, :484-532.
  - Under the step as worded, the listing then takes that lock. The step's `try_lock` at :523 refuses it, so the step fails and its folder is removed (:491).
  - A crash between :520 and :532 leaves such a file for good.
- **Why it blocks.** The case is narrow. But the form contradicts its own block-on-sight list, so code built to the step is blocked at review. Fixing it changes what the code does, so §31 does not apply.
- **The replacement words:**
```text
Otherwise it runs `try_lock` on the history.
```
```text
When the folder holds a `history.jsonl` of 0 bytes by its metadata, nothing is locked, listed or removed (§8 item 12): a history is created empty and locked only after that (`kernel/src/session_history.rs:516-523`), and while this open holds the project's `open.lock` only this open's own step can be making one. A 0-byte history that a crash between those lines left stays, and a save's move into its folder is refused (:551); that needs a crash inside one step, and is named. Otherwise it runs `try_lock` on the history.
```
- **Clause check:**
  - The empty file is made at :520 and locked at :523.
  - "Only this open's own step": a `<hex>` record is created only for an open bound to P (`holder`, :315-319). Binding needs P's `open.lock`: `kernel/src/project/mod.rs:312-314`, :409-415, :781 and :876.
  - The refused move is `create_dir` at :551.
- **A row after K-C40:**
```text
| K-C40 | `a_reopen_with_no_record_folder_lists_nothing_and_removes_nothing` (a project saved, its recorder ended normally, then reopened in a new recorder with no `<hex>` folder: `list_recoverable(handle)` is `Ok` with no entry, and the root's folder names are unchanged) | the clear run on an absent folder, its removal errors returned | K-C40 |
```
```text
| K-C40 | `a_reopen_with_no_record_folder_lists_nothing_and_removes_nothing` (a project saved, its recorder ended normally, then reopened in a new recorder with no `<hex>` folder: `list_recoverable(handle)` is `Ok` with no entry, and the root's folder names are unchanged) | the clear run on an absent folder, its removal errors returned | K-C40 |
| K-C41 | `a_projects_folder_with_an_empty_history_is_left_unlocked_at_its_open` (a `<hex>` folder holding a `locations.json` and a 0-byte `history.jsonl`, then `list_recoverable(handle)`: no entry, and both files are still there, byte for byte) | the 0-byte check removed at an open (the empty history is locked, read and listed `cannot-be-offered`, `no-step`) | K-C41 |
```
- **K-C41 is red before the fix,** because the command does not exist (form :1219).
  - Under the mutation, the read finds no kept step, so the history is listed `no-step` (:499). That holds on every system, so no pass case is known.
  - The history has no mark, so the clear's conditions fail (:929-933).
- **The ceilings, for the added row:**
```text
kernel tests 1,800 to 1,950; total ≤ 5,500, ≤ 50 files.
```
```text
kernel tests 1,800 to 1,980; total ≤ 5,530, ≤ 50 files. K-C41 and the open's 0-byte check add about 20 to 30 test lines and about 5 product lines, inside the product figure.
```

## Evidence
None open.

## Documentation (must be fixed before the merge; none blocks)

**N-32. C-11's last sentence claims this open's own save cannot be raced** (form :1709).
- **Where the claim fails.** The claim fails when the folder is present because this open's own save made it:
  - the save's move ran `create_dir` (:551) before the listing read the folder;
  - the move had not yet renamed `history.jsonl` in (:562) when the listing read that.
- **What the clear can then do.** It can remove the copied `locations.json` (:553), the `.tmp-` file (:554-556) or the empty folder. The save then fails (:563, :569), or it succeeds and leaves the project's record with no `locations.json`.
  - A step made after a save bound the open has the same window: `create`'s `create_dir` at :486, then `locations.json` at :512.
- **Another run.** The sentence on other runs holds while this open holds `open.lock`. It fails only if this open is closed and its lock released during the listing.
- **Why it does not block.** Each case needs timing inside the listing's one request round trip. Under §31 it is named, not blocking, and the words do not change the code.
```text
This open's own save cannot move into the folder while it is there, because the move's `create_dir` refuses a folder that exists (`kernel/src/session_history.rs:551`); a save during that one listing takes no move and moves at its next save (:347-348).
```
```text
A folder that was there before this open's own save or step began is never written into by it, because `create_dir` refuses a folder that exists (`kernel/src/session_history.rs:551` for a save's move, :486 for a step's new record); such a save returns its error and moves at its next save (:347-348). Named, and not blocking, because each case needs timing inside this listing's one request round trip: this open's own save's move (:551-562), or a step of this open after a save bound it (:484-523), has made the folder and not yet put `history.jsonl` in it when this listing reads them, and the clear then removes what it has written there, or the folder, so that save or step returns an error, or the project's record is left with no `locations.json`; or this open's `open.lock` is released during this listing, after its close, and another instance's save of the project then moves into the folder.
```
- **Clause check:**
  - `create_dir` is at :551 (outside `made`, so it returns before :569) and at :486.
  - The save's error is the `?` at :369, and the next save is the doc comment at :347-348.
  - A step's record is the project's when the open is bound (:315-319).
  - A removal of the copied `locations.json` after :553 leaves the rename at :562 to succeed.
  - A removal of the empty folder before :553 or :512 makes the copy or the write fail.
  - The lock is held from `kernel/src/project/mod.rs:781`, :876, and released only by `release_ended` (:780).

**N-33. Amendment 7 item 3's pointer** (form :1712). The ceilings are item 8, not item 9 (the report says "see N-30").
```text
(it adds a test; see item 9)
```
```text
(it adds a test; see item 8)
```

## Attempt-4 findings, by id
- **C-11:** answered in part; C-13 and N-32 are what is left.
  - **When the folder is absent,** nothing is removed, so K-C40's case holds.
  - **A failed removal is ignored,** as `end_session`'s are (`let _ =`, :444-446).
  - **The cites hold:**
    - `mint_identity()` (`kernel/src/project/mod.rs:320`);
    - `known` from `saved` (:312-314);
    - `_lock` kept (:409-415, :876);
    - `try_lock` at the open (:781);
    - ADR-036 Amendment 1 item 3's `open.lock` (ADR-036:262-265).
  - **K-C40** is red before the fix (:1219) and has one mutation and its set. Under the mutation, `NotFound` comes on every system, so no pass case is known (:1482).
- **C-12:** answered and true.
  - Step 3a runs the same dedupe for one record (:1077, :1085), and the walk is the start's alone.
  - The mutation compiles against K-C27's calls if the test passes the walk's returned value to the dedupe untouched, which "carries … inside the returned value" requires.
- **N-27:** answered. K-C25 to K-C28, K-C34 and K-C37 are each a held-history test, and a header plus a step line clears every 0-byte check (:1510, :1568).
- **N-28:** true. It matches K-C28's and K-C34's rows (:1454, :1468) and H1/H3 (:31, :637).
- **N-29:** true. It matches the candidate rule (:1510).
- **N-30:**
  - **The arithmetic is right:** 1,070 + 80 ≤ 1,160, 1,800 + 145 ≤ 1,950, and 5,260 + 90 + 150 = 5,500.
  - **The estimate is sound but tight.** C-13 adds about 25 lines (see above).
  - **Full gating stands** under AUTONOMY §21a (wire, guarantee; AUTONOMY.md:323-327) and §21c (AUTONOMY.md:350-353). The file count is 47 of 50.
  - Acceptance of the figures is the advisor's.
- **N-31:** true. The rule for a `restored` mark is "at a start and at an open" (:1183). Under the mutation, the start's case is offered instead, so the test is red.

## Files read (at fe99e848)
- `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`: :1-130, :200-379, :425-654 and :903-1817, plus searches across the whole file
- `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-4.md`, whole
- `kernel/src/session_history.rs`: :290-629, plus searches
- `kernel/src/project/mod.rs`: :280-429 and :740-899
- `kernel/src/project/store.rs`, by search (:40-75)
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, by search (Amendment 1 item 3, :262-265)
- `governance/AUTONOMY.md`: :315-359

Opus 5.5 (claude-opus-5-5)
