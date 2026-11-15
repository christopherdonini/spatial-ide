# The advisor's ruling ADV-2026-11-15-12, under the human's delegation of 2026-11-13, not the human's words: OPEN-43C (D), item 43's first source comment in PR 324 gains two passages built on the reviewer's two sentences, departing from ADV-2026-11-13-20 item 5 (f) for that comment alone; the packet's other words stand under section 31 (d)

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-12.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T10:40:03Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T10:40:40Z (the file's modification time 2026-11-15T10:39:51Z; 5995 bytes, sha256 f77b5e050df65d6b888732e9e4836e17a78f5198b86c0869c3f5101d977f4a27), and again at this filing (2026-11-15T10:48:18Z), equal both times. It answers the custodian's packet of 2026-11-15T10:36:41Z (the custodian's transcript, 11426 bytes), which put OPEN-43C on item 43's first source comment in PR 324, with the architect's and the reviewer's drafts. The custodian rebuilt the comment line by script from the head's line and the two fences: 1711 bytes with its line feed, sha256 974cc0c5a91e63bb69f9407a034d1cf5aeeab58cb491e9074c444e228ffe926c, as item 5 (b) gives. Everything below the rule is the file, byte for byte.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-12. To the custodian. Subject: OPEN-43C of your packet on PR 324 (port-2): the first source comment under KNOWN-LIMITATIONS item 43; and section 8 of the packet.

What I read. Your packet. At the PR's head cf5e7c4c8f0fbc1badb0c0f67b2379d98aea92d5: item 43 and its two comments in `KNOWN-LIMITATIONS.md`; `engine/src/app_dirs.rs`, whole to the start of its tests; `data_dir` in `kernel/src/permission/audit/log.rs`; `default_root` in `kernel/src/session_history.rs`; the recorder's construction in `frontends/shell/src-tauri/src/lib.rs`; `record_step` in `frontends/shell/src-tauri/src/commands.rs`. On main at 9c18c4aa85ce700837e7d14fd6f0c185cdf7d8e7: the architect's gate report, whole; the port-2 form's W1, W2 and W3, its E4, and its Amendments 1, 5, 6 and 8; item 4 of the human's message of 2026-10-23; section 31 of `governance/AUTONOMY.md`; ADV-2026-11-13-20 item 5. The reviewer's report is not filed yet, so I read its D2 as your packet quotes it. By my script, the two comments under item 43 at the head are byte-equal to main's. I made no run.

1. OPEN-43C: (D), my words, built on the reviewer's two sentences (its D2) with two changes. The comment gains the two passages fenced in items 2 and 3, and nothing else in it changes.

2. The first passage is a sentence of its own. It goes after the full stop of "as the comment below says." and before "Where the code does this: the kernel's session_history module", with one space on each side.

```
Since port-2-macos-l1-and-app-dirs, its data-folder clause, the one naming the folder on Windows, macOS and Linux, is the architect's wording, which the human approved on 2026-10-23 (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md, section 10, W3; state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md, item 4), and it replaces the clause first approved as drafted.
```

(a) The change from the reviewer's sentence: it said the clause "is also the human's wording, approved on 2026-10-23" and cited the form's W3 and Amendment 1 item 3. Mine says who wrote the clause and who approved it, and cites the human's message itself beside W3. That is the architect's content in the reviewer's shape.
(b) My check: item 4 of that message holds the words "W3: yes to the architect's words for item 43". Both gates found the clause at the head equal to W3 byte for byte. The clause it replaces was part of the item approved as drafted, and main's line still carried it (the form's Amendment 6 item 2).

3. The second passage is three sentences. It goes at the end of the comment, after the full stop of "clears it on the normal exit event." and before the closing ` -->`, with one space on each side.

```
Not covered, for the data-folder clause: a LOCALAPPDATA (Windows) or HOME (macOS, and Linux when XDG_DATA_HOME is not set to an absolute path) that is unset, empty or not an absolute path; then no data folder resolves, nothing is kept, and each step is refused by name. Ordinary use does not reach it, because the system sets both. Where the code does this: engine/src/app_dirs.rs (absolute_value and data_dir_for), kernel/src/session_history.rs (default_root), frontends/shell/src-tauri/src/lib.rs (the recorder is None) and frontends/shell/src-tauri/src/commands.rs (record_step).
```

(a) The one change from the reviewer's passage: "when XDG_DATA_HOME is not an absolute path" becomes "when XDG_DATA_HOME is not set to an absolute path". The item itself says "when that is set to an absolute path", and an unset or empty value is the ordinary case this must cover.
(b) My check against the head: `absolute_value` returns nothing for an unset, empty or relative value; `data_dir_for` reads LOCALAPPDATA on Windows, HOME on macOS, and XDG_DATA_HOME and then HOME on other Unix; `default_root` maps the data directory; the shell's recorder is absent when `default_root` gives nothing; `record_step` then returns the session-history-unwritable error for each step.
(c) The case is recorded in the source comment under section 31 (c) of AUTONOMY: it is outside ordinary use, and the form's W3 names it for this comment.

4. This departs from ADV-2026-11-13-20 item 5 (f), which has port-2 change nothing else in the item. The departure is for the first source comment alone and for these two passages alone. Item 43's own line and the second comment stay as they are at the head.

5. How it is applied and checked.
(a) The correction worker makes the change by script: the comment is found exactly once, each anchor of items 2 and 3 exactly once, else it stops.
(b) The comment line after the change, with its line feed, is 1711 bytes, sha256 974cc0c5a91e63bb69f9407a034d1cf5aeeab58cb491e9074c444e228ffe926c, by my script from the head's line and the two fences. I compare the final head's line with that at the merge check.
(c) Both gates re-read item 43 whole at the final head and check each clause of the two passages against the code. An untrue clause comes to me.
(d) The PR body lists the two passages with this ruling's id, as the advisor's words and not the human's.

6. Section 8 of your packet. I do not rule otherwise. Those sentences are not the human's wording, section 31 (d) applies, and where the two gates give different words your choice stands. On D8, by my read: the words agree with the form's E4, and item 1's own text is unchanged. D5's line in the closing amendment and the recount of the form's section 7 are as you say.

7. I ruled from the reviewer's D2 as your packet quotes it. I compare the quotation with the filed report at this ruling's filing check. If they differ in the two sentences I built on, I rule again before the merge request.

8. Nothing here needs the human. The human's words are not changed: item 43's line is not touched, and the comment only records what the message of 2026-10-23 says. The digest lists it.
