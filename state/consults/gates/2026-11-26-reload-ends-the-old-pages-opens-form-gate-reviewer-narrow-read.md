Reviewed: the form text b-form-r4-text.txt in the scratch folder, 50938 bytes, sha256 c8b6e5b7df8401b4ffa7a953d0e653ef1ef72141a68378437b03cef18fa2dd22 (r3 with attempt 1's 26 pairs applied by script), read only. This is the custodian's filing note, 2026-11-26: the reviewer's form gate, attempt 2, node:reload-ends-the-old-pages-opens@form-gate-reviewer-2, under ADV-2026-11-26-17 item 2. The narrow re-read that closes attempt 1, by the same agent resumed by a message sent after 2026-11-26T21:28:06Z. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 7 tool uses, 130049 ms, 52138 tokens; model opus. It handed back once, before 2026-11-26T21:31:51Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The report below is byte-identical to the saved one (5697 bytes, sha256 e00a145e). Verdict: BLOCK (Evidence N-1: the gate-waiting guard D-12 added had no test), C-1 and E-1 to E-4 closed; two pairs (N-1, N-2), applied by script, giving r5 (51235 bytes, sha256 71a7cd3f, the reviewer's own figure); gate-log row 916.

---

BLOCK (Evidence, one finding: N-1). I reviewed b-form-r4-text.txt, sha256 c8b6e5b7df8401b4ffa7a953d0e653ef1ef72141a68378437b03cef18fa2dd22 (50938 bytes, recomputed by me). I read it against b-form-r3-text.txt and against b-form-gate-reviewer-report.md, sha256 44fb8a2b4c4b7cba0a48c999fe9a3568d13f7fd1ddc2abc1905fedb3f74959e0 (19526 bytes). Read checkout: D:/wt/read-1126b @ 77662d1ac837c56d4691b6821ffd1ece049f9da4. I did not need to read the checkout again for this narrow read. Grounds (ADV-2026-11-18-02 item 2): concurrency.

## Mechanical check

- I parsed all 26 Old/New pairs from the saved report by script, with a literal backslash-n read as a line break.
- I applied them to r3 in order. Each Old text occurred exactly once at its turn.
- The result is byte-identical to r4: 50938 bytes, an exact match. So r3 to r4 is exactly my 26 pairs and nothing else.
- Each New text occurs exactly once in r4.

## Do C-1 and E-1 to E-4 close their findings? (as they stand in r4)

**C-1: closed.**
- The text is at §2 item 1, the watch bullet.
- The counter is now bumped "under the mutex".
- `admit` subscribes before its first read, reads under the mutex, and awaits `changed()` after each read that admits nothing. So no bump between a read and the wait is lost.
- The mutex is taken only between awaits, never inside a `Receiver::borrow` or `wait_for` closure. That removes the deadlock path.
- The pin `publish.rs:1096-1102` is the one I verified in attempt 1.
- It is consistent with the rules below it ("never held across … a wait") and with §9 item 6.

**E-1 (U-4): closed.**
- The row now asserts that `stop_poll` is called for no name.
- It says why the count alone cannot fail: a second close is refused by `SkpError::unknown_dataset` (`skp.rs:1634-1636`).
- M-U4 now predicts red at that assertion. It can fail on its mutation and pass on the change.

**E-2 (U-3 and U-12): closed.**
- U-3 now has three isolated cases, each pending while the other two are clear:
  - an end held in `log`;
  - an unsettled earlier ticket, with that page's end joined;
  - a late close held in a test `ArmedWatch` drop (`watch.rs:39`; `skp.rs:1628-1633`).
- M-U3 is red at the second case.
- U-12 joins the end by the returned handle. §2 item 4 now says the handle is read only by the U tests, so U-12 is consistent with it.

**E-3 (U-7): closed.**
- The bad-version cancel now targets a key waiting at the gate, and asserts the kernel's refusal and that the open stays waiting.
- Under M-U7 that cancel answers `requested`, so the row goes red.

**E-4: closed.**
- `:142-183` appears in §1 (Declared unchanged) and in §10 bullet 1's proof.
- No `:142-176` is left in r4.

## Does any applied pair create a new defect?

One does: D-12, which leads to N-1 below. I read the others with the text around them, and none adds a defect:

- **D-2 (§2 item 11):** the new fourth bullet sits in the condition's list, and the list still reads in order.
- **D-3 (§9 item 5):** the bullet now ends "arm;", and the next bullet follows correctly.
- **D-4:** its may-not-claim bullet agrees with §2 items 3 and 4, and with U-9.
- **D-7:** "nothing of the fix" is a paraphrase, not marked as a quote. It matches ADV-2026-11-26-24 item 2's red-commit bullet in meaning.
- **D-10:** its two "Ended page" bullets keep "The mutex is then released…" inside the with-a-name bullet, where it belongs.
- **D-1, D-5, D-6, D-8, D-9, D-11 and D-13:** each reads correctly in place.

### N-1 (Evidence): D-12's claim has no test

D-12 added a sentence to §2 item 2. As r4 has it: "The gate-waiting entry is held by a guard of its own inside `admit`, so an `admit` future dropped while it waits leaves no entry that `Pages::cancel` could answer `requested` for."

That is a stated guarantee. §4 holds every mechanism to one test and one mutation, and no row of §4 can fail if that guard is missing:
- U-11 drops a `Ticket`, which is the in-flight guard, not the gate-waiting guard.
- U-7 never drops a waiting future.

Fix: add a row after U-11, and raise the estimate to match.

N-1, Old: `| M-U11: the `Ticket`'s `Drop` removed |`
N-1, New: `| M-U11: the `Ticket`'s `Drop` removed |\n| U-11b (same file) | with an earlier page's unsettled ticket holding the gate, an `admit` future polled once with `std::task::Waker::noop()`, pending, then dropped: `Pages::cancel` of its key answers `unknown` | M-U11b: the gate-waiting entry's guard removed, so the cancel answers `requested` |`

N-2 (Documentation, goes with N-1), Old: `| `page.rs` tests | 540 |`
N-2, New: `| `page.rs` tests | 560 |`

Checks on these two pairs:
- Checked by script on r4: each Old occurs once, and each New occurs once after both are applied.
- The result is 51235 bytes, sha256 71a7cd3f665356f097036deefb6b285311b53f52d872b2e07203a54e51fb3c67.
- The §7 estimate becomes 1187, or 1194 with the ADR-020 note. That is inside the 1250 ceiling, so the Size line, "The ceiling holds both ways." and the Scope stay true.
- U-11b follows U-1b's "(same file)" form, so "U-1 to U-12" in §3 and §10 needs no change.
- U-11b can be written against §2's interfaces as they stand: `admit`, `Pages::cancel`, and an earlier page's `Ticket`.
- It can fail on M-U11b and pass on the change. Without the guard, the dropped future's entry stays with its key, so `Pages::cancel` (§2 item 6 (b), on the kernel's `Unknown` for a non-`sh_` key) answers `requested`. With the guard, the entry is gone and the kernel's `unknown` is returned unchanged.

## Notes

- I considered a pair that would have reworded §1's enum clause. I am not proposing it: the clause is grammatical and true as it stands.
- Nothing written. No checkout file and no transcript read.
