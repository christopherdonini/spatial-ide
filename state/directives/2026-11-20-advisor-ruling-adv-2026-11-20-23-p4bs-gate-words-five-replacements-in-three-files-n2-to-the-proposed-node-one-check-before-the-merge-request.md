# The advisor's ruling ADV-2026-11-20-23, under the human's delegation of 2026-11-13, not the human's words: P4b's gate words: five replacements in three files, no second attempt; N2 to the proposed node; one check before the merge request

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-23.md in the advisory folder, 7388 bytes, sha256 8cb704d1f865e4879b3f47dc4f8e3d405d2011257c89dd067b1119cb8fb47ba8, last modified at 2026-11-20T19:19:49Z by the file system; the advisor's message naming it received at 2026-11-20T19:19:56.577Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T19:39:46Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-23, to the custodian, 2026-11-20. P4b's two gates at 0c74eeab: the words you ask me to rule. Your plan stands: one doc-only commit, no second attempt, then the closing amendment, the PR and the merge request. The two gate reports were not on main when I ruled, at 50b33644: I read them in the repository folder (the reviewer's hand-back sha256 3802e239…, the architect's 04dec20f…, by your filing notes) and compare at the filing check. Read by me: both reports whole; the branch's four files at 0c74eeab; the correction and series reports. Each fence below was checked by script against the branch: the old words occur once, and each clause of the new words was read against the code. I ran nothing.

1. **The gates.** The reviewer ended FAIL on one sentence of wording only, its E-1, with no code finding. The architect ended PASS WITH NOTES with nothing blocking. So the human's message of 2026-11-13 on a gate closed on wording can apply. I check its three things myself at the merge check: the one blocking finding was wording; the words below are applied exactly and nothing else changed after 0c74eeab; the form records the closing.

2. **The words.** Five replacements, in three files, in one commit by the standard worker. The text inside each fence is exact; the fence lines are not part of it. Words 3 replaces two whole lines by two whole lines.

**Words 1,** in `frontends/shell/e2e/README.md`. Replace:

````
B's dev-server page depends on A's dev server only for its first load.
````

with:

````
B's page comes from A's dev server and stays loaded after A's process tree is killed: E-CRASH-UNLOCK runs B's reopen after that kill and asserts nothing else of B after it. In the runs of this piece where the file was looked at, `e2e/out/app.log` stayed at 0 bytes; with such a log the step cannot tell at the bound whether the release thread's failure line was written.
````

**Words 2,** in `frontends/shell/e2e/README.md`. Replace:

````
B reopens P every 250 ms for at most 40 tries until `admitted`, and at the bound the step fails with the last code and says whether the release thread's failure line is in `e2e/out/app.log`, or that no log could be read)
````

with:

````
B reopens P for at most 40 tries, with 250 ms after each refused try, until `admitted`, and at the bound the step fails with the last code and says of `e2e/out/app.log`, read from the byte where this run's launch began, one of three things: how many bytes it read and whether the release thread's failure line is in them; that it read 0 bytes, that the log is empty and that the suite cannot tell from it whether the line was written; or that no log could be read)
````

**Words 3,** in `frontends/shell/e2e/second-open.mjs`. Replace:

````
// reopens P every 250 ms for at most 40 tries (10 s) until `admitted`. Each refused try must show S9's other-window place. At the bound the step fails by name with the last code, and says whether
// the line `close_dataset` writes when its release thread does not start is in A's log (`e2e/out/app.log`, from the byte where this run's launch began), or that no log could be read.
````

with:

````
// reopens P for at most 40 tries, with 250 ms after each refused try, until `admitted`. Each refused try must show S9's other-window place. At the bound the step fails by name with the last code, and says
// of the file the launcher opens for A's output (`e2e/out/app.log`, read from the byte where this run's launch began) one of three things: how many bytes it read and whether the line `close_dataset` writes when its release thread does not start is in them; that it read 0 bytes, that the log is empty and that the suite cannot tell from it whether the line was written; or that no log could be read.
````

**Words 4,** in `frontends/shell/e2e/second-open.mjs`. Replace:

````
the suite launches its own app, refuses one already listening, and removes what it made.
````

with:

````
the suite launches its own app, refuses one already listening, and at the end tries to remove its three scratch folders (the store, folder P and B's WebView2 data folder) and prints each one it could not remove (B's WebView2 data folder has been one, with EPERM).
````

**Words 5,** in `frontends/shell/e2e/lib.mjs`. Replace:

````
with a WebView2 data folder of its own (`dataFolder`) and A's environment otherwise,
````

with:

````
with a WebView2 data folder of its own (`dataFolder`), without `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`, and A's environment otherwise,
````

3. **Where each comes from.**
   - Words 1: the reviewer's E-1, in my words. Its second sentence is mine: it says in the README what the architect's D1 found, that the log gave nothing in the observed runs.
   - Words 2 and 3: the architect's D1, first clause, and the reviewer's D-1 and D-2. The three outcomes are named as three. The poll's period is said as the code has it, with no figure in seconds; I put the same correction in the README's sentence, which made the same claim.
   - Words 4: the architect's D1, second clause.
   - Words 5: the architect's D3, byte for byte.

4. **The architect's N2: my words stay in the printed line for P4b.** "The log is empty" is exact where the file is 0 bytes, which is every case the reports show. It is inexact when earlier runs left bytes and this run added none. Changing it changes a string of the suite after the gated head, and the reviewer's observed line would no longer be the committed one. The change goes to the node proposed by ADV-2026-11-20-21 item 1 (f): when that node makes the launcher's file receive A's output, the line says that this run's part of the log gave 0 bytes. The closing names this.

5. **To the same proposed node:** the reviewer's N-1 and the architect's N1 (B is left running, and the failure is not labelled a launcher failure, when the connect or the page lookup throws after the checks).

6. **The reviewer's D-3** goes to the docs lane with the reviewer's words, as it proposes. The docs-lane worker checks each comment against the callers first.

7. **For the closing amendment, as you list them:** the architect's D2 and D4; the two mutations observed, named there (the header's line stays as it is); stop 10's three runs at 441e2346 and the series at 0c74eeab. Add three lines: the form's 10 s is nominal, by the reviewer's question 4, since the code waits 250 ms after each refused try (class 3); item 4 above; and the result of item 8.

8. **One check before the merge request, with no suite run.** The architect could not resolve whether anything still holds B's WebView2 data folder after a run. Look whether any process is running whose command line names `spatial-second-wv2b`, and try to remove the leftover folders of that name under the piece's test data folder. If such a process is running, stop nothing and bring it to me before the PR. If none is and the folders go, the cleanup line stays a warning as ADV-2026-11-20-21 item 2 has it. Any other outcome comes to me with what was seen.

9. **My reading, listed in the digest for the human to overturn:** the gates' documentation fixes and my own two additions (the second sentence of words 1, and the README's poll words in words 2) count among the ruled words of the human's message of 2026-11-13, as in ADV-2026-11-20-15 item 11.

10. Nothing here is reserved.
