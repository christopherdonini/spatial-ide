Reviewed: the form text b-form-r5-text.txt in the scratch folder, 51235 bytes, sha256 71a7cd3f665356f097036deefb6b285311b53f52d872b2e07203a54e51fb3c67 (r4 with N-1 and N-2 applied by script), read only. This is the custodian's filing note, 2026-11-26: the reviewer's form gate, attempt 3, node:reload-ends-the-old-pages-opens@form-gate-reviewer-3, under ADV-2026-11-26-17 item 2. The narrow read of N-1 alone, by the same agent resumed by a message sent after 2026-11-26T21:31:51Z. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 1 tool use, 22670 ms, 56072 tokens; model opus. It handed back once, before 2026-11-26T21:32:42Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The report below is byte-identical to the saved one (2297 bytes, sha256 18a1f849). Verdict: PASS (N-1 closes; r4 to r5 exactly the two pairs, by its script); no further pair; r5 is the form as filed; gate-log row 917.

---

PASS (N-1 closes): b-form-r5-text.txt, sha256 71a7cd3f665356f097036deefb6b285311b53f52d872b2e07203a54e51fb3c67 (51235 bytes, recomputed by me). Read checkout: D:/wt/read-1126b @ 77662d1ac837c56d4691b6821ffd1ece049f9da4; this read needed none of it. Grounds (ADV-2026-11-18-02 item 2): concurrency. I read this against my narrow re-read report, b-form-gate-reviewer-narrow-read-report.md, sha256 e00a145ee7a45716ca50ed0b5f9894eede2d30e9870e2a2f8deb31bbfbd01cab (5697 bytes, recomputed).

## r4 to r5 is exactly N-1 and N-2

I applied N-1, then N-2, to b-form-r4-text.txt (sha256 c8b6e5b7df8401b4ffa7a953d0e653ef1ef72141a68378437b03cef18fa2dd22) by script. Each Old text occurred once, and the result is byte-identical to r5. Nothing else changed.

## N-1 read in place

The U-11b row is the line right after U-11 in §4's table, and §2 item 2's guard sentence is unchanged. Together they close N-1:

1. **The test reaches the guard's case.** U-11b's future is pending because an earlier page's in-flight ticket still holds the gate (§2 item 2 (i)). So the future is dropped while its gate-waiting entry exists. That is the case the guard sentence covers, not the in-flight `Ticket` that U-11 covers.
2. **It passes on the change.** With the guard, dropping the future removes the entry. `Pages::cancel` then gets the kernel's `Unknown` for a key that does not parse as `StreamHandle`, finds no gate-waiting entry, and returns `unknown` unchanged (§2 item 6 (b)).
3. **It is red on its mutation.** Under M-U11b the entry stays after the drop. `Pages::cancel` finds it, sets its flag and answers `requested`, so U-11b goes red at that assertion.
4. **It is written against §2's real interfaces.** It uses `admit`, `Pages::cancel`, an earlier page's `Ticket` and `page_started`. It is polled with `std::task::Waker::noop()`, as U-3 is, with no sleep.
5. **The size still holds.** The `page.rs` tests estimate now reads 560. The estimate sums to 1187, or 1194 with the ADR-020 note, both inside §7's 1250 ceiling. So the Size line and "The ceiling holds both ways." stay true. U-11b uses U-1b's "(same file)" form, so "U-1 to U-12" in §3 and §10 needs no change.

Neither pair creates a new defect, and I have no further fix.

Nothing written. No main-checkout file and no transcript file read.
