*Custodian's filing note (2026-09-26): the reviewer gate's attempt-2 report (scoped, record round) for PLAN node `data-plane-origin-non-ascii` at 97c5c0a, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: PASS** (attempt 2, a scoped record round). I ran everything in C:\dev\wt\data-plane-origin at 97c5c0a with CARGO_TARGET_DIR=C:/dev/spatial-ide/target. I committed nothing, the tree is clean (`git status --porcelain` is empty), and the remote branch is at 97c5c0a.

## 1. No code change
- **Files touched:** 8d7ef9f changes only server.rs and tests/origin_header_encoding.rs. 97c5c0a changes only ORIGIN-NON-ASCII-PREREGISTRATION.md.
- **Comments only:** `git diff 1a000a0 HEAD -- '*.rs'` has no added or removed line that is not a `//` line (grep rc=1).
- **Line counts are unchanged:** server.rs is 528 lines and the test file 180 lines, at both 1a000a0 and HEAD.
- **§21c:** my attempt-1 command still gives **196** (server.rs 12/1, session.rs 3/0, the test file 180/0).
- **rustfmt:** `--check` on server.rs finds 12 hunks at both 1a000a0 and HEAD, so there is no new drift. The test file is clean (rc=0).

## 2. The excerpts
A node script (scratchpad `excerpt2.mjs`) checks each record's kept lines, after the 5-character `//   ` prefix, against the transcript lines that match `left:`, `right:` or `test result:`.
- **Against t1.txt–t5.txt:** 3, 5, 3, 7 and 3 kept lines. The sets are equal, byte for byte and in order.
- **The cut field:** each `…` replaces exactly the transcript's `finished in 0.0Ns` field.
- **No stray CR:** none of the transcripts contains a CR byte.
- **Against my attempt-1 reruns:** the same check on m1f and m2–m5.txt (`excerpt3.mjs`) also matches everything, so "reproduced at 1a000a0 by the reviewer gate, attempt 1" holds.

The failing tests each record names match both the transcripts' `panicked` lines and my attempt-1 reruns:

| Record | Names | Transcript and rerun agree |
|---|---|---|
| T1 | T1 | yes |
| T2 | T2 and T4 | yes |
| T3 | T3 | yes |
| T4 | T2, T3 and T4 | yes |
| T5 | T5 | yes |

The printed order differs between the runs (t4 printed T4, T2, T3; m4 printed T4, T3, T2). That supports the new "order varies" clause.

## 3. Amendment 1
- **First line:** it says it was written after both gates' attempt-1 results were seen, so it is marked post-result.
- **Commit ids all resolve:**
  - 3a9ed80 is the form, on b03e9e7.
  - d445c86 is the fix and tests: server.rs, session.rs and the test file, +164/−1.
  - fff5114 is the records, +31.
  - 1a000a0 is the attribution, 2/2.
  - 8d7ef9f is the excerpt form.
- **The force-push line:**
  - The worktree reflog shows d445c86 → c907f30 → reset to d445c86 → fff5114.
  - The origin remote-tracking reflog shows 3a9ed80 → c907f30 at 12:02:08, then c907f30 → fff5114 at 12:06:43. That second update is not a fast-forward, so it was a force-push.
  - c907f30 is not in the branch.
  - c907f30 would have counted **223** by the §21c rule, over the 200 ceiling.
- **References resolve on main (c0f1549):**
  - `state/gate-log.json` has both attempt-1 entries for the node.
  - The reviewer entry carries "196/200", "section 7 three files" and the suites.
  - My filed report exists. Its section "Runs" item 3 is the M1–M5 reruns, and item 2 is the test-first run including my own F4b observation. Both are as the amendment cites.
- **Form:** it has no hash pins, so round 15 (e) does not apply. Its "Superseded index" line is present.
- **References only:** it is, apart from item 3's classification clauses. Those are the content the architect's N3/N4 asked the amendment to carry, not prose restating something a reference could carry.

## 4. Re-runs (all @ 97c5c0a)

| Command | rc | Result |
|---|---|---|
| `cargo test -p spatial-data-plane` | 0 | 22 unit, 11 candidate_a, 4 no_transport_leakage, 5 origin_header_encoding |
| `cargo clippy -p spatial-data-plane --all-targets` | 0 | clean |
| verify-cites | 0 | PASS (733 files; advisories are all pre-existing, none in this diff) |
| verify-quotes | 0 | PASS (109 checked) |
| verify-test-claims | 0 | PASS (197) |
| `verify-mutation --base origin/main --head HEAD` | 0 | 5/5 named (test lines 102, 120, 135, 154, 172) |
| `timeout 120 node scripts/plan/verify.mjs --offline` | 0 | PASS |
| `file` on the 3 changed files | — | UTF-8, no CRLF; 0 CR bytes in each HEAD blob |

## Findings (none blocking)
- **N1, Amendment 1 item 3, "H1 by T3's mutation":**
  - H1 (§5) covers both F2's and F3's values. Its preregistered discriminator is §4's test-first run, observed in my report, Runs item 2.
  - T3's mutation covers only F3's half. T2's mutation (its record names T2) covers F2's.
  - This follows the architect's prescribed shape. The architect may want the cite widened; the record is not false.
- **N2, item 1, "with lease":** the reflogs prove a force-push but cannot show a lease. c907f30 sat on the remote from 12:02:08 to 12:06:43, and my attempt-1 gate ran on 1a000a0 after 12:09:42.
- **N3, item 1:** it does not mention 8d7ef9f's rewording of the server.rs `upgrade` comment (my attempt-1 nit). Non-blocking.
- **N4:** the amendment's references (`state/gate-log.json` attempt 1, `state/consults/...-gate1-reviewer.md`) resolve on main at c0f1549, not in the branch tree (merge base b03e9e7).
  - Main has moved past the base, so merging cannot be a fast-forward.
  - The commit ids stay valid if the branch lands by a merge commit. A rebase would invalidate every id the amendment names.
- **N5, carried from attempt-1 N1, the provenance "d445c86's source":** the src files are byte-identical to d445c86 (`cmp` against mutations/server.rs.fixed and session.rs.fixed). The test file the worker ran was an earlier draft (its panic lines are 3 lines above d445c86's). The clause "reproduced at 1a000a0" covers this, and N5 is non-blocking.
- **Nit:** server.rs lines 290–292 are 104, 104 and 108 columns wide, while the lines around them stay at or under 100. rustfmt does not flag this.

Files:
- C:\dev\wt\data-plane-origin\protocol\data-plane\ORIGIN-NON-ASCII-PREREGISTRATION.md
- C:\dev\wt\data-plane-origin\protocol\data-plane\tests\origin_header_encoding.rs
- C:\dev\wt\data-plane-origin\protocol\data-plane\src\server.rs
- The check scripts are C:\Users\CHRIST~1\AppData\Local\Temp\claude\C--dev-spatial-ide\5d626cec-7aaf-40a2-9c79-6e4d2c8db2e6\scratchpad\excerpt2.mjs and excerpt3.mjs.

**Gate-log note:** @ 97c5c0a reviewer PASS (attempt 2, record round): 8d7ef9f/97c5c0a comments and prereg only, line counts unchanged, section 21c 196/200; five excerpts' kept lines match t1-t5 and the reviewer's attempt-1 reruns byte for byte in order, the elided field is only finished-in, and the named failing tests match (T1; T2,T4; T3; T2,T3,T4; T5); Amendment 1's ids, force-push (remote reflog c907f30 to fff5114, c907f30 counts 223) and report and gate-log references resolve on main c0f1549, first line post-result; data-plane tests, clippy, verify-cites/quotes/test-claims/mutation 5/5, verify --offline all rc 0; LF; notes N1-N5 non-blocking (H1 cite covers only F3's half; lease unprovable; 8d7ef9f's server.rs reword unlisted; references resolve on main only; test-file provenance).
