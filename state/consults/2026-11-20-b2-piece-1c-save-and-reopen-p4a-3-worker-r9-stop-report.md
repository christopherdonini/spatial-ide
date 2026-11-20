*Filed by the custodian: P4a-3's worker, its fifth (stop 13 at R9) hand-back (claude-sonnet-5-5), 4102 bytes, sha256 3765c8bb196900033ae9bfcc78fe1872e5e759aebc7178345d89b34faf83443f, below the rule, byte for byte but for 1 of the project name as <m>, with one final newline added. Calls Bash 10, Write 1, SubagentHandback 1, 0 errored, from 2026-11-20T10:15:37Z to 2026-11-20T10:18:54Z by its transcript. The record is its transcript.*

---

STOP at R9: a test correction is needed and it comes to the advisor first, as the brief says. port-5400 harness. Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. The README entry, P-head, counts and push are not done.

STATE
- HEAD is e35693f286db906708634ddbdd6f0c655c75bf9a, a `test:` commit made alone after 20895dfb. Its subject is `test: E-REOPEN's R8 opens another file and sees P's close before it reopens Q (B2 piece 1c, Amendment 61 item 3)`.
- It changes R8 only (9 insertions, 3 deletions) in `frontends/shell/e2e/reopen.mjs`. R8 reads the `close_dataset` row right after `openPath` returns, then copies P to Q.
- `git status --porcelain` is empty. The branch is local only: remote head 20895dfb, not pushed.
- A final busy check gave `FREE`. No process of mine is running.

RUN w-r3 (one hold, after a busy check alone): rc 1
- Log: `<H>/out/p4a-e2e-w-r3.log`.
- Session log: `<S>/1cp4a3-w-r3.session.log`, copied from the one the app's stderr names (`session-1795169818.log`).
- Load line: `load w-r3 ...` appended to `<H>/out/p4a-e2e-loads.txt`; hold lines masked as `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<shell> also=<m>`, then `MACHINE_RELEASED ...`, with no MACHINE_WAITING or MACHINE_ERROR.
- R1, R2, R3, R4 PASS.
- R5 PASS. Ring at the read: `256 actions (336 dropped)`; the `close_dataset` row had 12 entries after it.
- R6 PASS, the view bit for bit. The saved view is `centre (2600900.3333333335, 1200900.2857142857)`, `zoom -0.8571428571428572`. The `open_project` request has answer and relink null, outcome ok. Ring at the read: `256 actions (555 dropped)`; the row had 3 entries after it.
- R7 PASS: `not-asked`, and the file's identity and workspace are unchanged.
- R8 PASS.
  - Ring at the `close_dataset` read: `256 actions (654 dropped)`; the row had 14 entries after it.
  - S8 showed its text. The `same` click opened Q. The ring then read `256 actions (882 dropped)`. `folders.json` lists both folders.
  - On f-r1's refused R8: its log shows the 60 s wait failure with no record of which place the page showed (no reading of the refusal block was made). So the closing has no place to name, and nothing goes to the advisor on that account.
- R9 FAIL, after 41.9 s: `waited 30000ms for a close_dataset row at ok beyond the 1 counted (P2's data handle); a row missing at its read is the form's stop 13`. The last reading was `256 actions (1364 dropped)`.
- E-CHANGED was not reached.

CAUSE (my suite, not product)
- R9 and E-CHANGED read the close row too late. `openFile` waits for the first pixels and settles 3 s of quiet before `waitClosed` runs, in `stepR9` at lines 344-346 and in `stepChanged` at lines 359-361.
- By then the first look's tile requests (about 110 per load, and the ring is at 256) have pushed the new `close_dataset` row out, and the older one it counted is out too.
- R5 and R8 use `openFile`'s `afterOpen` hook to read right after the call, as the brief and stop 13 require. R9 and E-CHANGED were written before that and still use the late read.
- No row was dropped before a read that the form requires: R5, R6 and R8's reads all found their rows. The failing read is R9's own, taken late, and the product is not implicated.

PROPOSED CORRECTION (test only, awaiting the advisor)
- In `stepR9` and `stepChanged`, pass `waitClosed` as `afterOpen` to `openFile`, exactly as R5 and R8 do.
- That changes the two steps' read order and nothing else, and it would be committed alone, after the R8 commit.

COUNTS
- Not yet run. The last figures stand: the shell product group is 846 against 820 and its tests 847 against 690, class 8, nothing cut (Amendment 61 item 4). The e2e group is `reopen.mjs` at about 463 lines plus one `package.json` line, so under 485.
- The README entry and the lock-file check are pending: `package.json` carries the single added line, and the lock files are untouched.

I need the advisor's go on the R9/E-CHANGED correction, then I will run it once as w-r4 on the same harness, write the README entry (`npm run e2e:reopen`), run the P-head checks, count and push.
