# The advisor's ruling ADV-2026-11-20-26, under the human's delegation of 2026-11-13, not the human's words: the redaction node at 0005d0d3: the four word clauses route (ii) made untrue, in the advisor's words, before the gates; K-4's mutation (b); the form's Amendment 3

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-26.md in the advisory folder, 5331 bytes, sha256 e71b1e53eee0803d07e7821a32fd712875c473c0a20321b7c015ae27683585d8, last modified at 2026-11-20T21:13:44Z by the file system; the advisor's message naming it received at 2026-11-20T21:13:53.600Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T21:53:18Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-26, to the custodian, 2026-11-20. The redaction node at 0005d0d3: the four word clauses that route (ii) made untrue, and the order. I rule otherwise on one point of your plan: the words land before the gates, not after them. The build, its counts and the test results are by your message; the worker's report was not on main when I ruled, and I compare at the filing check. Read by me: the branch's three files at 0005d0d3 and the form with its Amendment 2. Each fence was checked by script: the old words occur once at 0005d0d3, and no new line is over 100 characters. I ran nothing.

1. **The order.** The four clauses are known untrue now, so no gate is sent to read them. One doc-only commit applies the words below on top of 0005d0d3, by the standard worker. Then both gates read the new head. The human's message of 2026-11-13 is for a gate that ended FAIL on wording; it is not a plan for words known untrue before the gate.

2. **The words.** Four replacements in two files. The text inside each fence is exact, whole lines for whole lines; the fence lines are not part of it.

**Words (b),** in `frontends/shell/src-tauri/src/commands.rs`. Replace:

````
//! (`close_dataset` also starts [`Projects::release_ended`], after the host's close, and
//! `binding_log_session_event` passes the page's text through the data plane's `Session::redact`
//! before the append) — docs/02's "frontends: clients only, no logic" applied to the Rust half of a
//! client. `lib.rs` lists every command below in its `tauri::generate_handler!` call; adding one
//! here without adding it there is a command JS can never reach, which is the reason there is
//! exactly one list.
````

with:

````
//! (`close_dataset` also starts [`Projects::release_ended`], after the host's close) — docs/02's
//! "frontends: clients only, no logic" applied to the Rust half of a client. `lib.rs` lists every
//! command below in its `tauri::generate_handler!` call; adding one here without adding it there is
//! a command JS can never reach, which is the reason there is exactly one list.
````

**Words (c),** in `frontends/shell/src-tauri/src/state.rs`. Replace:

````
/// `binding_log_session_event` (`commands.rs`) passes the page's `level` and `message` through the
/// data plane's `Session::redact`, which replaces every occurrence of the token's exact text with
/// `<redacted>`, before it calls `append`. The host's own lines are composed in this crate and take
````

with:

````
/// `binding_log_session_event` (`commands.rs`) writes them through `append_redacted`, which passes
/// the page's `level` and `message` through the data plane's `Session::redact`, replacing every
/// occurrence of the token's exact text with `<redacted>`, and then calls `append`. The host's own
/// lines are composed in this crate and take
````

**Words (e),** in `frontends/shell/src-tauri/src/state.rs`. Replace:

````
    /// what `binding_data_plane_attach` hands out and what `binding_log_session_event` redacts.
````

with:

````
    /// what `binding_data_plane_attach` hands out, and what `SessionLog::append_redacted` redacts
    /// when `binding_log_session_event` passes this session to it.
````

**Words (f),** in `frontends/shell/src-tauri/src/state.rs`. Replace:

````
    /// redacted (`binding_log_session_event`); the rule replaces characters and removes none, and
````

with:

````
    /// redacted ([`Self::append_redacted`]); the rule replaces characters and removes none, and
````

3. **What they do.**
   - (b): the module doc's paragraph goes back to main's bytes. Under route (ii) the binding is a plain one-call binding, so the parenthetical needs no second case. This replaces, for that parenthetical, ADV-2026-11-20-17 item 2.
   - (c), (e) and (f) name the method as where the redaction runs, and the binding as its caller.
   - (d), the binding's doc, stands as written: each text does pass through `Session::redact` before `SessionLog::append`.
   - The method's own doc is the worker's, and the gates read each clause, its "one product caller" among them.

4. **K-4's second assertion needs its own mutation.** Mutation (b): the binding keeps its call of the method, and a line is added to its body that calls the log's `append` with the page's texts. It is seen red by name at the absence assertion, then reverted. The standard worker runs it in the same brief, after the words commit, and commits nothing from it. Until it is seen red, that assertion is not claimed as shown.

5. **K-3's added assertion stays.** K-3's message carries the credential and K-3 also asserts no leak, after the line count. That is more than section 4 lists: class 1.

6. **The form's Amendment 3, before the gates.** It records: the four replaced clauses of section 2.4 and of the worker's words (class 5, by this ruling); K-4's mutation (b); item 5. The branch need not take main in for it.

7. **The clippy warning in `publish.rs`** is not this piece's and is not silenced. It goes to the daily batch.

8. **The count** is taken again at the gated head. 262 of 230 at 0005d0d3 is recorded as counted, class 8 in the closing; nothing is cut or packed.

9. **CI.** ADV-2026-11-20-24 item 4 applies to the runs at 0005d0d3 and at the words commit.

10. Nothing here is reserved.
