# The advisor's ruling ADV-2026-11-28-05, under the human's delegation of 2026-11-13, not the human's words: the reload keys' form after the reviewer's form gate: `unread` under Part A alone (DOC-5), DOC-2 as the gate gives it, and one narrow second attempt of each form gate before Part A's code

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-05.md in the advisory folder, 6854 bytes, sha256 fb1b63ebdfaa08458b1a4190daa00852e2e2704833f882a209a5d8aa872ba53b, UTF-8, last modified at 2026-11-28T03:13:09Z by the file system. It was named by a session message received before 2026-11-28T03:13:39Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-05, to the custodian, 2026-11-28 (03:12Z). The reload keys' form after the reviewer's form gate: what `unread` says under Part A alone (the report's DOC-5), DOC-2's words, and one narrow second attempt of each form gate before Part A's code. It answers (a), (b) and (c) of your message on DOC-5 and DOC-2. It replaces the third bullet and the fenced text of ADV-2026-11-28-04 item 1.

Read by me: on main at f0098033, the reviewer's report whole (`state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-reviewer.md`); the form's §0 to §4 and §7 to §10 with Amendments 1 to 4; in the architect's report its verdict line, check 3 and the findings C1 to D4; `governance/AUTONOMY.md` §31; my ADV-2026-11-13-06 item 3 and ADV-2026-11-22-07 item 4. Not read: the crate sources both gates cite.

1. **(a) `unread` stands for the key under Part A alone. The fault is in my words.**
   - The third bullet of ADV-2026-11-28-04 item 1 said `unread` is for a value whose read failed. I wrote it against the case where the settings are not reached. I did not think of a build that holds no read of the key setting at all. The form predicted `unread` for that build before my ruling (§2 item 1, §3), and that stands.
   - In place of that bullet: **`unread` says that this run read no value for that setting.** Either a read failed after the settings were reached, or the build makes no WebView2 call that reads the setting, which is the key setting without Part B. It is never written for settings that were not reached. That case stays `webview-chrome not-applied`.
   - No other word is added for Part A alone. The line gives no reason for an `unread`, with or without Part B. ADV-2026-11-27-44 item 7 stands: both lines state what was read or not done, and no consequence. The bytes of both lines, both levels and the not-applied cases stand.
   - Under Part A alone the line is the read-back line, at `info`. From an installed build the line expected is `webview-chrome context_menus=off accelerator_keys=unread`. That is the form's reading and is not yet observed.
   - **The words for §1's line claim,** in place of the fence of ADV-2026-11-28-04 item 1. One clause is changed, and the rest is byte for byte:

````text
- One session-log line from `setup()`. When the settings are reached, it is the read-back line, with `unread` for each value this run did not read: its read failed, or, without §0 item 3, the build makes no WebView2 call that reads the key setting. When they are not reached, it is `webview-chrome not-applied`: no main window is found, `with_webview` returns `Err`, or a `CoreWebView2` or `Settings` call fails. Not covered, and named in the source comment: the case where the runtime holds no such webview and drops the closure, so no line is written (C1). Ordinary use does not reach it.
````

   - The source comment at the key setter and getter says that without Part B the build neither sets nor reads the key setting, so the field reads `unread`. The words are the worker's.

2. **The case "`with_webview` returns `Err`": the clause stands, as the gate reads it.**
   - `with_webview` returns a `Result`, so the code has that arm, and §9 item 5 forbids `setup()` failing on it. The clause says what the arm writes if it runs.
   - The form already says the arm cannot run from `setup()` today (the reviewer's EV-2, its New 2). The source comment at the arm says so too, in the worker's words, naming the crate version the gate read.
   - No test is claimed for the arm. U-5 covers the function it calls.

3. **(b) DOC-2's words are applied as the gate gives them,** from the report's bytes.
   - They agree with item 1: the key getter makes no WebView2 call and returns `Err`, and `apply` gives `unread` for it.
   - They agree with the architect's A1: the key setter and getter name no `webview2-com` type.

4. **(c) Yes, a read first: one narrow second attempt of each form gate, before Part A's code.**
   - **Why.** Both form gates ended FAIL and stay FAIL in every record. The human's rule of 2026-11-13 lets me count a FAIL as closed at the merge check, with no further attempt, only when its only blocking findings were wording, the words are applied exactly and the form records it. The reviewer's EV-2 adds two tests, two mutations and a module function. The architect's E3 gives E-1 a new read path, with a function and an assertion of its own. I am not sure those are wording. A doubt about a rule on my own check is not mine to settle the easier way. A second attempt that ends PASS or PASS WITH NOTES needs no exception.
   - This is no finding against your Amendments 2 and 4. The architect's report says its words go in with no re-gate, the reviewer's says each correction changes the form only, and you applied them as written.
   - **The reviewer's attempt 2** reads Amendment 4 and the amendment that carries this ruling, and nothing else:
     - Amendment 4's items against its own report;
     - DOC-2 and the claim's new words against this ruling;
     - whether U-5, U-6 and the E-1 row still hold with item 1.
   - **The architect's attempt 2** reads Amendments 2 to 4 and the amendment that carries this ruling, and nothing else:
     - Amendment 2's items against its own report, with the reviewer's check 7 of their application carried forward;
     - Amendment 3 against its findings D1, D2 and D4 and against ADV-2026-11-28-04;
     - the module function that EV-2 adds, under the caller rule;
     - DOC-2's key setter and getter under its A1;
     - whether the answer of the named posture check in attempt 1 still stands.
   - Everything else of each attempt 1 is carried forward. If an attempt finds only words to correct, it gives them exactly, they are applied, and there is no third attempt. A FAIL on anything else comes to me.
   - The two run in either order, or at the same time, as your slots allow. Part A's code is dispatched when both have ended PASS or PASS WITH NOTES.
   - The amendment that carries this ruling is on main before either attempt starts.

5. **The candidate's row, which I owe (OPEN-8).** For a candidate that carries Part A alone, the line to read is the one in item 1. That build leaves the keys alone, so Ctrl+R and F5 do there what they do today. I write the row when a candidate is named.

6. **Your sight item on KNOWN-LIMITATIONS item 83** gets its own answer, next: the words are mine, and I read the architect's note and the code first. Until that answer, item 83 stands as filed. The reviewer's read part of milestone 5's PR B does not wait for it.

7. Nothing here is reserved. No rule of the human's is changed, and no exception to one is ruled. For the human, in the digest: my bullet on `unread` corrected; the two narrow reads asked, and why.
