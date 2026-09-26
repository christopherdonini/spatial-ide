*Custodian's filing note (2026-09-26): the architect gate's attempt-1 report for PLAN node `data-plane-origin-non-ascii` at 1a000a0, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: FAIL.** There is one blocking finding, and it is in the record only. The fix, the tests, the seams and the posture all pass. The fix is an in-place rewording in one file, with zero net lines.

Method: I read the branch tree at 1a000a0 and main's `server.rs`, `session.rs` and data-plane `Cargo.toml`. I took the branch history from `.git/worktrees/data-plane-origin/logs/HEAD`: b03e9e7 → 3a9ed80 (prereg) → d445c86 (fix + tests) → c907f30 (over budget) → reset to d445c86 → fff5114 (records) → 1a000a0 (custodian). I had no Bash, so the diff stat, the line count, the suites and the mutation reruns are the reviewer's.

## Blocking

**F1. `protocol/data-plane/tests/origin_header_encoding.rs`, all five mutation records.**
- **Rule:** verbatim quotes (round 10) and elisions (round 11).
- **Defect:** each block says "Printed failure … by script, not retyped", which presents it as the printed output. Lines were removed without a `…` mark: each failure's `thread '<name>' panicked` line and the `assertion` line. The retained lines match byte for byte after the `//   ` prefix, but the block as presented does not match its source.
- **Why it matters:** the removed line is the qualifier that ties a pair to a test (round 11: an elision may not remove a qualifier).
  - The T3 record ("4 passed; 1 failed" plus an `Ok(())`/`Err(403)` pair) proves from its own text that some test failed, not which one.
  - T1 is attributable through "4 filtered out", and T5 through its unique pair.
  - T2 and T4 are attributable only through 1a000a0's added prose.
- **Smallest fix:** in each record, replace "by script, not retyped:" with a declared excerpt, for example "excerpted by script: only the `left:`, `right:` and `test result:` lines; every other line, including each failure's test name, elided:". Name T3's failing test in prose, the way 1a000a0 did for T2 and T4. This changes no lines and keeps §7's 200-line budget (about 196 by my read; the reviewer counts).

## Notes (fold into the same edit)

**N1. The "finished in 0.0Ns" field in all five count lines.**
- It is not a §8 item 13 performance claim in form: no subject, no budget verb, no comparison.
- docs/08 has no clause named "no-duration". The house rule is `docs/PREREGISTRATION-TEMPLATE.md` §1 (no number without p50/p95 and dataset per docs/08; no duration per ADR-018). The precedent is `engine/LOD-PREREGISTRATION.md`'s resolved finding 5, "An unmeasured duration in a code comment" (the root `Cargo.toml` dev-profile comment: "a figure in a comment is an unmeasured claim").
- The field also changes between reruns, so it is text no gate can verify (record cap).
- **Fix:** cut it to `…` on each count line. Severity: note. It is free inside F1's edit.

**N2. The T2 and T4 records' "printed in that order" (1a000a0).**
- libtest prints failure sections in completion order, which varies between runs under the multi-thread runner. The pairs are identical (`Ok(())`/`Err(403)`), so the order clause carries no attribution and a rerun cannot confirm it.
- The source 1a000a0 names, "the untrimmed run transcripts", is evidence, not Authority. That is acceptable.
- **Fix:** drop "printed in that order" and keep the test names. The reviewer confirms by rerun which tests fail under each mutation.

**N3. Preregistration §3, row F4b's "before the fix" column is unobserved.**
- Under T4's mutation (the fix reverted), T4 panics at F4a's assert and never reaches F4b. H2's discriminator for F4b is therefore not observed.
- F4b's after-fix `Err(403)` still stands: admission or a non-HTTP error would fail T4.
- This is my own design flaw (two rows in one test). Record it in the closing amendment as not discriminated. Do not edit §3.

**N4. Prediction versus outcome for T2's mutation.** It also failed T4. §4 did not predict that, and it does not contradict §4 (F4 carries `0xFF`). The closing amendment references it; nothing is edited.

## §8, item by item

1. **Pass.** `server::upgrade` maps only `headers.get("origin") == None` to `None`. There is no other product caller of `request_allowed`; `transport-bakeoff` has its own `Session` and is out of scope.
2. **Pass.** The `Err(_)` arm returns 403 `origin` before `token_from_offers` and `token_matches`.
3. **Pass.** No transform.
4. **Pass.** The body, signature and `tests` module are byte-identical to main. `session.rs` shifts by exactly +3 lines at the doc.
5. **Pass.** The token path and its order are unchanged.
6. **Pass.**
   - Every refusal is asserted as `assert_eq!(…, Err(403))`.
   - `attempt` panics on any non-`Error::Http` error.
   - T5 admitting proves the helper's `tok.` credential is valid, so a 403 cannot be a masked 401.
7. **Pass.** The real `spatial_data_plane::serve`, a loopback socket, and `tokio_tungstenite::connect_async`.
8. **Pass as far as I can read; the reviewer's stat confirms.** No `lib.rs` change is needed, since `serve` and `RunningDataPlane` are already re-exported.
9. **Pass.** `protocol/data-plane/Cargo.toml` is identical to main. The root manifest and `Cargo.lock` are for the reviewer's stat.
10. **Pass.** Every test type and helper is private. The new arm's caller is the `/stream` route.
11. **Pass.** No new string; 403 `origin` already exists.
12. **Pass**, subject to the reviewer's stat.
13. **Pass on line cites and exploitability.**
   - No bare `path:line` anywhere. The comments cite by section and symbol.
   - The exploitability wording stays inside Finding A1-1's bound: the server comment says "a same-origin claim rescue a stated foreign origin", with the token still required.
   - The duration field is N1.

## ADR-020 and docs/09
The fix restores the accepted posture: ADR-020 Decision's "Exact-match comparison is unchanged; `Origin: null` stays rejected; the … fallback for an absent header is unchanged", and docs/09 "Local listening sockets" (exact-match `Origin` validation). Neither text needs to change, and none changed.

## Seams (§2 table)
- **Client → `upgrade`:** the actual axum `HeaderMap` and `WebSocketUpgrade`, with 403 `origin` and 401 `credential`. T1–T5 prove it over a real socket. Pass.
- **`upgrade` → `Session::request_allowed`:** `(Option<&str>, Option<&str>) -> bool`, unchanged. The new doc sentence is true of its only caller. Pass.

## Caller rule
Not engaged. No new `pub` item, option or path.

## Discharge claims
- Resolved by reading: `session.rs` doc "`server::upgrade` refuses that case itself" (the `Err(_)` arm), and the server comment "before the credential check" (statement order).
- "Applied, run, reverted" and the five observed counts are the reviewer's to resolve by rerun on d445c86's tree.
- H1 is confirmed by the T3 mutation's structure: F3 reached the `Err` arm while being valid UTF-8.
- No "discharged" or "done" clause exists yet in the prereg; §10 is empty.

## Red lines
No ADR, dependency or public-exposure change. Pre-code note stands: Finding A1-1 was public before this fix. The closing amendment makes no claim that it was not.

## What the closing amendment must contain
References and hashes only (`state/directives/2026-09-18-record-cap.md`, the directive line). Its first line states it was written after results.
1. **Commits:** 3a9ed80 (preregistration), d445c86 (fix + tests), fff5114 (records), 1a000a0 (custodian attribution), and the fix-round commit. Each is cited at its SHA on main after the fast-forward merge (round 15 (e): no branch-only rev for any hash pin).
2. **Force-push, one line of references:** c907f30 exceeded §7's budget and was replaced by fff5114 on d445c86 (reflog) before any consumer read the branch. Round 15 (f) is not engaged, because a test comment is not an append-only record.
3. **Test results:** per test name (no line cites), the mutation record, the reviewer's rerun, and the gate-log entries for both gates at attempt 1 and attempt 2.
4. **Hypotheses:**
   - H1 → the T3 mutation.
   - H2 → the T4 mutation for F2, F3 and F4a; F4b's before-column not discriminated (N3).
   - H3 → the tests construct their requests.
   - The unpredicted T4 failure under T2's mutation (N4).
5. **Suites and budget:** each suite and verifier result by its commit, and the §21c line count as a number.
6. No prose restating any of the above.

**Files:**
- `C:\dev\wt\data-plane-origin\protocol\data-plane\tests\origin_header_encoding.rs`
- `C:\dev\wt\data-plane-origin\protocol\data-plane\src\server.rs`
- `C:\dev\wt\data-plane-origin\protocol\data-plane\src\session.rs`
- `C:\dev\wt\data-plane-origin\protocol\data-plane\ORIGIN-NON-ASCII-PREREGISTRATION.md`

**Gate-log line:** `data-plane-origin-non-ascii attempt 1 @ 1a000a0 — architect FAIL (record only): F1 mutation-record blocks presented "by script, not retyped" with unmarked elisions that drop the test attribution (rounds 10/11); N1 cut "finished in" to `…`; N2 drop "printed in that order"; N3 F4b before-column undiscriminated, for the closing amendment; code, seams, caller rule, ADR-020/docs/09 posture and §8 items 1–12 pass.`
