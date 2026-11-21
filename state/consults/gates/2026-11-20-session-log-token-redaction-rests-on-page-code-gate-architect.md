Reviewed: cut/session-log-token-redaction at 0cc509fe8ff3c04177206512b96b35c854f4c086 (the custodian's filing note, 2026-11-21: the architect's gate of the redaction node, section 9; Read 22, Glob 3, Grep 14, SubagentHandback 1, none errored, by unique call ids, model claude-opus-5-5, from 2026-11-20T23:27:50Z to 2026-11-20T23:34:17Z by its transcript; the report below byte for byte from its hand-back of 13889 bytes, sha256 90674462893091834cdfa56f23417b11bc1ee204837326f7d6dd4b647ece2faf, nothing masked by the custodian, with this note in its first line and one final newline), gate, architect
Gate: session-log-token-redaction-rests-on-page-code, architect, at 0cc509fe8ff3c04177206512b96b35c854f4c086 (cut/session-log-token-redaction; base d7f27ef8b41869b2e89fcb849ca20f5244cc9e0b)
Verdict: PASS WITH NOTES

Under AUTONOMY §22: Correctness PASS; Evidence PASS on the code read, with the evidence the form still owes (listed under Notes); Documentation: one must-fix finding, going to the advisor.

Everything was read in C:/dev/wt/redact-g at H, or in the main checkout C:/dev/spatial-ide for the form, the rulings and the reports. I have no Bash, so I ran nothing. Section 7's count, the name-only list, the empty Cargo diffs and the byte-equality of the fences are taken from the record (Amendment 3 items 2 and 7, and the two worker reports). The reviewer recomputes them.

**1. Section 8, item by item**
- **Item 1** (no edit under protocol/): the record has only the three src-tauri files in `--name-only`. `protocol/data-plane/src/session.rs` at H matches §2.1. PASS, on the record.
- **Item 2** (no claim beyond §1): none found (question 6). PASS.
- **Item 3** (the token held, printed or logged): PASS.
  - The only holding is `DataPlaneHandle.session` (state.rs:18), built as `session: running.session.clone()` (lib.rs:447). The leaked `running` is the data plane's own object, as at the base.
  - `Session` derives only `Clone`, with no `Debug` (session.rs:53), and no crate code prints or logs the handle or the token.
  - The attach's reply (commands.rs:248) is the delivery.
  - The tests run `assert!(!session.leaks_into(..))` before any `assert_eq!` on a line's text. K-3's earlier `assert_eq!` compares LF counts only, so a failing test prints no token.
- **Item 4** (page code or e2e files changed): none, on the record. PASS.
- **Item 5**, read with Amendment 3 item 6: the record has empty `Cargo.toml` and `Cargo.lock` diffs. PASS, on the record.
- **Item 6** (Amendment 3's new words): no difference. PASS.
  - The attach (commands.rs:248) is `format!("tok.{}", state.session.token_for_delivery())`.
  - K-1 (:756), K-2 (:770) and K-3 (:784) are each `format!("tok.{}", session.token_for_delivery())`, over a real `Session::with_origin` (:728).
- **Item 7** (pub items and their product callers): PASS.
  - `DataPlaneHandle.session` replaces `token`. Its product callers are commands.rs:248 and :270.
  - `SessionLog::append_redacted` (state.rs:88) has one product caller, commands.rs:270.
  - `one_line` is private and called by `append`.
  - There is no `allow(dead_code)` and no new `cfg` beyond `#[cfg(test)] mod tests`.
- **Item 8** (a shown string changed): none. PASS.
- **Item 9** (a line cut or packed to fit §7): none seen. state.rs:29 is a short line because the advisor's fence (ADV-2026-11-20-26 item 2 (c)) replaced whole lines for whole lines. That is not packing. PASS.
- **Item 10** (a lint silenced): none. The `publish.rs` clippy warning is not silenced (Amendment 3 item 8). PASS.
- **Item 11** (round 25): see question 7.
- **Item 12** (record items): PASS.
  - Amendment 3 item 5's fence matches the fence in ADV-2026-11-20-27 item 1 by my read. The reviewer recomputes it byte for byte.
  - Amendment 3 has no line cite into the ledger, no bare self-line, and no pin read as current.
  - Item 2 (b) says the module doc is "main's again". It matches main's commands.rs:16-20.

**2. The seams (§9.1), by the code at H**
- **(a) The attach's credential to the binding.** Both commands read the one managed `DataPlaneHandle` (lib.rs:465). The attach hands out `tok.` followed by the hex token. `Session::redact` replaces the hex, so the line holds `tok.<redacted>`. PASS.
- **(b) The binding to `SessionLog`.**
  - `logSessionEvent` (frontends/shell/src/diagnostics/log.ts:22) invokes with `{ level, message }`, and the binding takes `level: String, message: String` (commands.rs:267-268). Both names are one word, so camelCase does not apply.
  - The two `State` parameters (`log`, `handle`) are not read from the payload.
  - The body is the one call `log.append_redacted(&handle.session, &level, &message)`.
  - PASS.
- **(c) The shell to `spatial_data_plane::Session`.** Its actual interface:
  - `redact(&self, &str) -> String`, which is `s.replace(&self.token, REDACTED)` (:125-126);
  - `token_for_delivery(&self) -> &str` (:83);
  - `leaks_into(&self, &str) -> bool` (:129);
  - `pub const REDACTED: &str = "<redacted>"` (:45), reached as `spatial_data_plane::session::REDACTED` because `pub mod session` is at lib.rs:46.
  - The token is `hex::encode` (:139), so it is lowercase hex. PASS.
- **The seam rule's end-to-end test.** No test reaches the IPC under route (ii). In its place, the gate reads the code. ADV-2026-11-20-22 item 3 and ADV-2026-11-20-27 item 2 rule this, and Amendment 2 item 5 lists it for the human to overturn. This is a delegated ruling, so it is not a block here. Note N1.

**3. The caller rule**
- `DataPlaneHandle.session` has two product callers (commands.rs:248 and :270).
- `Session::redact`'s first product caller is state.rs:94.
- `append_redacted` has one product caller, commands.rs:270. Its other callers are the tests (:758, :772, :787, :788).
- No other code in the crate appends the page's text:
  - lib.rs:94 is `refuse_to_start`. Its messages come from config, and every call to it comes before `serve` (lib.rs:362, :377, :408; serve is at :425).
  - lib.rs:236, :246 and :267 are the self-check. Its MISMATCH and UNVERIFIABLE lines are OPEN-2 (i)'s named exception.
  - lib.rs:419 is the config-origin line.
  - pool_poll.rs:223 and :260 write counts and reasons.
- PASS.

**4. The words, clause by clause against the code at H**
- **§2.4 (a)**, `binding_pick_project_folder` (commands.rs:336-340): the text is the fence's, reflowed. The clauses hold: `App.tsx`:901 and `AdmissionPanel.tsx`:387 are the callers; the dialog is native (:344-349); `None` is no pick (:353); the `takeSlot` case is dev-only and named. TRUE.
- **(b)**, the module doc (:16-20): byte-equal to main's. The binding is one call to one state method. TRUE.
- **(c)**, `SessionLog`'s doc (state.rs:25-34):
  - It writes through `append_redacted` (:94): TRUE.
  - "every occurrence": `str::replace`: TRUE.
  - The host's own lines take no token: TRUE, as set out in question 3.
  - The self-check exception: lib.rs:243 and :264. TRUE.
  - "any other form ... is not redacted": TRUE.
- **(d)**, the binding's doc (commands.rs:258-262): TRUE, through `append_redacted`.
- **(e)**, the field doc (state.rs:15-17): TRUE.
- **(f)**, `append`'s doc (:58-67) and its comment (:73-75):
  - Both texts go through `one_line` (:76).
  - Because the stamp is digits and the separators are spaces, no line holds a Cc but its final LF, nor a Bidi_Control, U+2028 or U+2029.
  - The Bidi_Control list (:108-112) is the full Unicode set of 12. `is_control` is General_Category Cc, the same set as `shownText`'s `\u0000-\u001F\u007F-\u009F`.
  - "written as given", "no length bound", and the clause on fields that cannot be told apart: TRUE.
  - "replaces characters and removes none ... cannot change what the redaction caught": TRUE. Neither `\`, `n` nor U+FFFD is hex, and `<redacted>` holds no replaced character.
  - The `one_line` doc (:98-102): TRUE, checked against frontends/shell/src/project/shownText.ts:23.
- **The method's doc** (state.rs:83-87), the worker's: "one product caller" is TRUE (:270). Redaction then `Self::append`, and "any other form is not caught": TRUE.
- **K-1 to K-4's docs:**
  - The helpers' docs and the comment at :750-751: TRUE.
  - K-4 (:804-817): "lines above the `#[cfg(test)]`/`mod tests {` pair" is TRUE (:823-827). "to the first line that is `}` alone" is TRUE (:837, an exact match). "It shows the call is written, not what it writes" is TRUE.
  - One clause is ambiguous: Finding D1.

**5. The tests**
- **K-1 and K-2** meet §4's asserts with Amendment 2 item 3: a real `Session` and `SessionLog`, `leaks_into` first, one line, the exact line after the stamp. YES.
- **K-3:**
  - The input holds CR, U+0007, U+202E, U+2028 and LF in both texts, then a plain call.
  - The line count is asserted first (:791-792).
  - The leak assertion is added (:793), as Amendment 3 item 4 says.
  - Then the hidden-character check (:795-797), the exact U+FFFD and `\n` placements (:799-800), and the plain line exactly (:801, with `after_stamp` checking that the stamp is digits).
  - Mutation (b) goes red at the line count, because the raw LF in `level` gives 3 LFs. YES.
- **K-4** shows that the call is written, and that no non-`//` line above the tests holds `.append(`. Both of its assertions were seen red: the presence assertion in the second-brief report, and the absence assertion in the words report. It claims no more. YES.
- **Unreached beyond Amendment 2 item 4's list:**
  - The handle's construction in lib.rs:445-448, which no test reaches. The redaction does not depend on it: both commands read the same managed handle. Whether the handed-out token is the data plane's own is the e2e suites' to show (P5).
  - Of §1's character set, only CR, BEL, U+202E, U+2028 and LF are exercised. U+2029, U+061C, U+200E, U+200F, U+202A-D, U+2066-9, the tab and the C1 range rest on reading `one_line`, which I read correct.
  - Neither of these exceeds a §1 claim. Note N2.

**6. Section 1's limits.** No clause claims that the log can never hold the token, that every line is redacted, a length bound, or that fields can always be told apart. `append`'s doc disclaims the last two outright. The token in any other form is stated as not caught or not redacted in three places: state.rs:33-34, state.rs:86-87 and commands.rs:261-262. "Cut" is not listed in state.rs:33's parenthesis, but the parenthesis gives examples of "any other form". PASS.

**7. docs/01, 02 and 10; round 25**
- **docs/01:** no principle touched. No perf claim, no new blocking work beyond an O(n) replace in an existing sync sink.
- **docs/02 row `frontends`** ("Clients only — no logic"): the binding is decode, one state method, return. The redaction is the data plane's own `redact`, called from the sink that owns the line format.
- **docs/10:** credential delivery stays on the control plane. There is no wire change.
- **Round 25:**
  - The overrun, 254 against 230 at H, is recorded as counted (Amendment 3 item 7), with class 8 owed in the closing. §7 is not edited: Amendment 2 item 12 supersedes its fourth file and leaves the ceiling as it is.
  - Route (ii), K-4 and K-3's assertion are recorded as class 5 or class 1 by ruling, before their code. Amendment 2 is on main before 1b903cff and 0005d0d3, by way of the merge 88bbd3bc.
  - No `verify-mutation` run is called an observation.
  - No test-text span is pinned by hash at a branch commit. The test results in the amendment are named with commit ids.
  - The form is the full form.
  - PASS.

**Findings**

*Blocking:* none.

*Must-fix wording (Documentation, before the merge; not the human's wording):*
- **D1, to the advisor, unreworded.** The clause in K-4's doc, commands.rs:815-816 at 0cc509fe, byte-copied: "As in the precedent, only `//` lines are skipped as comments, so a commented-out call or any other type's `.append(` is a false offender, noise rather than a silent pass."
  - Read literally, it is untrue for a call commented out with `//`. The filter at :828 skips that line, so it is not an offender. It is true only for a call inside a `/* */` block or on a `*` line.
  - The precedent (frontends/shell/src-tauri/tests/sole_caller_scan.rs:50-51) has the same looseness.
  - It describes a false-positive mode of a test, not a product guarantee or limit, so I file it as Documentation, not Correctness.

*Notes:*
- **N1.** The seam rule's end-to-end test from the real shape is replaced for this seam by the gate's reading (ADV-2026-11-20-22 item 3; ADV-2026-11-20-27 item 2). It stands as the advisor's delegated ruling, listed for the human (Amendment 2 item 5). The PR body should carry Amendment 2 item 4's "not reached" line in its terms.
- **N2.** K-3 exercises 5 of the replaced set. The rest is shown by reading the code, not by a test.
- **N3, to the advisor with D1.** K-4's limits list omits a call in path form: `SessionLog::append(&log, …)` has no `.append(` and passes the absence scan. The doc's own claim ("no other line calls `.append(`") stays literally true. Amendment 2 item 3's "calls the log's `append`" is reached only for method-call syntax.
- **N4.** Every test cleans a fixed folder under `std::env::temp_dir()` (:723-726). Two concurrent `cargo test` runs on one TMP could collide, because the log name has one-second resolution. This is the same pattern as the `publish.rs` precedent. It matters only if the tester and the reviewer share a TMP.
- **N5.** The evidence still owed is not read here: §9.3's e2e runs at H (the tester), §7's commands and the Cargo diffs at H, the mutations made again, fmt and clippy (the reviewer), and the class-8 row in the closing.
- **N6.** The protocol-side field doc session.rs:55-56 says the token is "never logged". With OPEN-2 (i) that is not strictly so. It is out of this piece by §2.4's Not-edited list. I name it only.

Files read: C:/dev/spatial-ide/governance/forms/frontends/SESSION-LOG-TOKEN-REDACTION-PREREGISTRATION.md; C:/dev/wt/redact-g/frontends/shell/src-tauri/src/commands.rs, state.rs, lib.rs and pool_poll.rs; C:/dev/wt/redact-g/protocol/data-plane/src/session.rs and lib.rs; C:/dev/wt/redact-g/frontends/shell/src/diagnostics/log.ts; C:/dev/wt/redact-g/frontends/shell/src/project/shownText.ts; the rulings ADV-2026-11-20-17 (items 5 and 7), -22, -26 and -27 under C:/dev/spatial-ide/state/directives/; the second-brief and words reports under C:/dev/spatial-ide/state/consults/. I did not read ADV-2026-11-20-20 or -24, or the stop report; I took those from Amendments 1 to 3.

Model: claude-opus-5-5 (Opus 5.5), as the harness reports it.
