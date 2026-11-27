Reviewed: main at 55969f9849bce50230f7ae7c19c03bc73289517a, in the detached read worktree C:/dev/wt/read-1123ad (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 8, attempt 6, node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-6, dispatched at 2026-11-23T19:55:21Z; its run: Read 12, Grep 9, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T19:55:23Z to 2026-11-23T20:01:19Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 9187 bytes, sha256 7e9f33d25e95b6ff0146e0b608760cae5ceb2b53864995e43a8cff7454338c09, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; Amendment 8 carries the attempt-5 words faithfully; C-13, N-32 and N-33 answered and true against the code; three Documentation findings, N-34 to N-36, on words inside Amendment 8, to be fixed before the merge with replacement words, none asking for another attempt; the six sha256 values of Amendment 8 left for the reviewer to recompute; the ceilings' arithmetic right, with about 5 product lines of headroom.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1123ad @ 55969f9849bce50230f7ae7c19c03bc73289517a

Architect's form gate, attempt 6, tag `node:b2-piece-1c-step-3-recovery-offer@form-gate-architect-6`. Below, "form" means `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`. I read it with the New texts of Amendments 6, 7 and 8 in place. Every cite is at 55969f98. None of the sentences discussed is the human's wording. Under §31(d), the worker applies the replacement words below with no re-gate, and the PR body lists them.

**In one line.** Amendment 8 carries the attempt-5 words faithfully. C-13, N-32 and N-33 are answered and hold against the code. There are no Correctness or Evidence findings. Three Documentation findings (N-34 to N-36) must be fixed before the merge.

## Amendment 8 against the attempt-5 report
- **Pairs.** The report gives five Old/New pairs: C-13 ×3 (the try_lock sentence, the K-C41 row, the ceilings), N-32 and N-33. Amendment 8 items 2 to 6 carry them in that order. Each pair matches the report byte for byte as I read it: report :32/:35 against form :1829/:1835, :43/:46-47 against :1843/:1849-1850, :54/:57 against :1858/:1864, :74/:77 against :1872/:1878, and :89/:92 against :1886/:1892. The fences are four backticks, against the report's three. Nothing else is carried.
- **Old texts.** Each occurs exactly once above Amendment 8: :1524 (part of the line), :1724, :1794 (part), :1709 (part) and :1712 (part). No two overlap. Item 1's statement that the Old texts of items 3 to 6 stand inside Amendment 7 is true.
- **New texts.** No New text occurs above :1818. The K-C40 line inside item 3's New text is the retained row, and the K-C41 line occurs only at :1850.
- **Pins (item 7).**
  - What I checked: every cited range resolves at 55969f98 to the code the text names. `kernel/src/session_history.rs` :516-523 runs from the `OpenOptions` to the `try_lock`. :551 is `create_dir`. :486 is `create_dir`. :347-348 is the doc sentence on a failed move. :551-562 runs from `create_dir` to the rename. :484-523 runs from `dir` to the `try_lock`. The rev fe99e848 is a commit on main (round 15 (e)).
  - What I could not check: none of the six sha256 values, because I have no Bash. The reviewer should recompute them. I also took the brief's word that no code changed between fe99e848 and 55969f98; I did not verify it.

## Attempt-5 findings, by id
- **C-13: answered and true.**
  - **What the step now does.** A 0-byte `history.jsonl` is not locked, listed or removed (form :1835). This agrees with §8 item 12 (:642), the start's walk (:622), the candidate rule (:1510) and the twin probe (:1568).
  - **"Only this open's own step can be making one" holds** while this open holds `open.lock`:
    - A `<hex>` `history.jsonl` is created empty only in `write_record` (session_history.rs:520), and only from `create` for a holder bound to the project (:315-319, :480-482).
    - A save's move never makes an empty `history.jsonl`. It renames a written, synced `.tmp-` file (:554-562), and `with_project` always yields a header (:579-589).
    - Binding takes the project's `open.lock`: `kernel/src/project/mod.rs:312-314` and :395-396, plus :781 and :876 for a reopen. A second open of the same identity, in this process or another, is refused (ADR-036:265).
  - **No new race.** A non-empty history is already locked by its maker (:523 before :532; :558 before :562), so a later `try_lock` meets `WouldBlock` (H1/H3). The step's own `try_lock` at :523 is never refused by the listing.
  - **K-C41 has one red reason.** It is red before the fix because the command does not exist (:1219). Under its one mutation, the listing locks and reads the 0-byte file. `recover_bytes` on empty input returns no header, no lines and no failure (session_history.rs:1264-1294), so the record has no kept step and is listed `no-step` (:499). It holds no mark, so it is not cleared (:929-933). The test's "no entry" assertion fails on every system, so no pass case is known (:1222).
- **N-32: answered.**
  - **The windows are real.** The listing holds neither the state lock nor a lock across its reads (:1149), so it runs beside `record_step`, which holds the state lock across `create` (session_history.rs:306, :319).
    - The save's window is :551 to :562.
    - The step's window is :486 to :520; the cited :484-523 contains it.
    - The release case runs through `release_ended` at `kernel/src/project/mod.rs:780`.
  - **Naming, not blocking, is right under §31(c).** Each case needs timing inside one listing's round trip, and the words change no code.
  - Two wording defects remain: N-34 and N-35.
- **N-33: answered and true.** Amendment 7 item 8 holds the ceilings (:1783).

## Correctness
None.

## Evidence
None.

## Documentation (must be fixed before the merge; none blocks)

**N-34. N-32's first sentence is broader than the code** (form :1878).
- **The claim.** As written, it says any folder that existed before is never written into by this open's own save or step.
- **Where that fails.** This open's step appends to its own record's existing folder (session_history.rs:334), and so does its save's mark (:433).
- **What is true.** The claim holds for a folder with no `history.jsonl`, which is the only folder that sentence is about.
```text
A folder that was there before this open's own save or step began is never written into by it
```
```text
A folder with no `history.jsonl` that was there before this open's own save or step began is never written into by it
```
- **Clause check.** A new folder is made only at :486 and :551, and each refuses an existing folder. Continued writes (:334, :433) go to a record this run made, whose `history.jsonl` exists.

The same sentence also says the save returns an error. It does not: `adopt_project`'s error becomes a withheld history mark (`kernel/src/project/mod.rs:463-465`), and the save returns `Ok` (:419-423).
```text
such a save returns its error and moves at its next save
```
```text
such a save's move returns its error and is tried again at its next save
```
- **Clause check.** `copy_under`'s `?` at session_history.rs:369, and the doc sentence at :347-348 ("the error is returned, so the next save tries again").

**N-35. N-32's second sentence repeats the save-error claim** (form :1878). For a save, it is the move that fails; the save is `Ok` with a withheld mark (as in N-34).
```text
so that save or step returns an error
```
```text
so that save's move or that step returns an error
```
- **Clause check.** A failed step is `record_step`'s `?` at session_history.rs:319. A failed move is the `Err` from :566-571 through :369.

**N-36. C-13's crash window is too narrow** (form :1835).
- **The defect.** "between those lines" refers to :516-523. But a crash after the lock (:523) and before the header's write (:532) also leaves a 0-byte history, and it stays the same way.
```text
A 0-byte history that a crash between those lines left stays, and a save's move into its folder is refused (:551)
```
```text
A 0-byte history that a crash left after it was made and before its header was written (:516-532) stays, and a save's move into its folder is refused (:551)
```
- **Clause check.** The file is made at :520, locked at :523, and its header appended at :532. A crash anywhere in that span leaves 0 bytes. :551 is the move's `create_dir`. The bare `:516-532` reads as `kernel/src/session_history.rs`, the file named before it in that text, so the custodian pins it.

## Each New text that is not an answer
- **Item 4's tail sentence.** "K-C41 and the open's 0-byte check add about 20 to 30 test lines and about 5 product lines" is plausible.
- **Items 1, 7, 8 and 9** carry no claim about the code beyond the pins checked above. They bring no new fault.

## Ceilings (AUTONOMY §21a to §21c)
- **The arithmetic is right.** Tests: 1,950 + 30 = 1,980. Total: 5,500 + 30 = 5,530, with the product lines inside the product figure.
- **The product headroom is about 5 lines.** The attempt-5 top was 1,070 + 80 = 1,150. Adding about 5 gives 1,155, against a ceiling of 1,160.
- **One risk.** The estimate does not say whether it counts the source comments that §31(c) needs for the cases N-32 and C-13 name. Those comments could use up the headroom. If the product figure passes 1,160, it is a class-8 record before code (round 25, item 2). It must never be a §7 edit.
- **Gating stands.** Full gating holds under §21a (wire, guarantee) and §21c. Files: 47 of 50.
- **Acceptance** of the figures is the advisor's.

## Files read (at 55969f98)
- `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`: :600-660, :918-947, :1130-1229, :1500-1579 and :1690-1911, plus searches across the whole file
- `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-5.md`, whole
- `kernel/src/session_history.rs`: :290-629, and :1264-1294 found by search
- `kernel/src/project/mod.rs`: :295-424, :459-488 and :760-887
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: :258-267
- `governance/AUTONOMY.md`: :315-354 and :530-551, plus a section search

Opus 5.5 (claude-opus-5-5)
