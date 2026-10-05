*Custodian's filing note (2026-10-05): the architect's draft of `guardian-v1`'s Amendment 4, on the custodian's brief after P0c (Amendment 3). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 56967107da25196164b6ba03ff9d08e2b8bea4b7aaae06e9a58569a934a7d7b3. Write audit PASS: zero write calls (Read 11, Grep 4, SubagentHandback 1). Run window from the transcript: 2026-10-05T18:28:13.842Z to 2026-10-05T18:33:12.695Z (116,521 subagent tokens, 16 tool uses, 298,874 ms, from the harness's task notification). The amendment as appended is part 1's block with its pin hashes computed at cd539e79 and nothing else changed.*

---

Reviewed: main @ cd539e79

**Verdict: pass with notes.** Amendment 4 is drafted below and is ready for the custodian to compute hashes and commit before any code. P0c's four readings stay inside the brief and the rulings, so none of them is a red line and there is no OPEN item. All ten hashes are left as `HASH-TBD` for you to compute. Tool claims (round 15 (c)) are labelled by build, as §0.1 does.

## 1. The amendment

```markdown
### Amendment 4 — round 58's OPEN-6 (c) verbs; Fable's round-58 advice, items 3 and 4; P0c's four readings (Parts A to E: classes 1 and 9)

*Written after P0c's outcomes were seen (Amendment 3) and before any code. No code or branch exists. The architect agent drafted this at main cd539e79. Nothing below is a quotation. Code is cited `path:line @ cd539e79 sha256:<hex>`. The P0c report, `state/consults/2026-10-05-guardian-v1-p0c-report.md`, and the P0b report, `state/consults/2026-10-05-guardian-v1-p0b-report.md`, are cited by section. Read this amendment's superseded index (Part E) first, then Amendment 2's (Part K).*

**Part A — scope addition (class 9): round 58, OPEN-6 (c)** (Amendment 2, Part H; §5's I10). The ruling is `state/directives/2026-10-05-round-58-guardian-v1-open-6-ruling.md:6 @ cd539e79 sha256:HASH-TBD`, cited by round and item and not reproduced. Its RULED block is in `DECISIONS-PENDING.md` under round 58.

A.1 **§2 shape (G8, command side; §2.5).**
- The plugin action words gain exactly `prune`, `autoremove`, `init`, `new` and `configure`.
- The MCP action words gain exactly `login`, `logout` and `reset-project-choices`.
- `eval` stays allowed, and no other verb is added. That includes `serve`, `details`, `tag`, `get` and `list`.
- The new words are read wherever §2.5's action words are read: the segment check, the quoted-token rescan, condition 1's sequence, and the restarts (Amendment 2, A.2). `--help` forms are included, as §2.5 states.
- Unchanged: the group words, the trigger (Part C, item 2), the sequence form, the path side (§2.5; Amendment 2, Part E), and §2.0's calls and env lines.

A.2 **§7's G8 values become:**
- group words: `plugin`, `plugins`;
- plugin actions: `install`, `i`, `uninstall`, `remove`, `enable`, `disable`, `update`, `add`, `rm`, `prune`, `autoremove`, `init`, `new`, `configure`;
- MCP actions: every word that begins `add`, plus `remove`, `login`, `logout` and `reset-project-choices`;
- not action words: `eval`, and every verb not listed above.

A.3 **F61 (T70).** Engine answers: env and stat, as in F42.
- Refused, G8:
  - `claude plugin prune`; `claude plugin autoremove`; `claude plugin init x`; `claude plugins new x`; `claude plugin configure x`;
  - `claude mcp login x`; `claude mcp logout x`; `claude mcp reset-project-choices`;
  - `claude.exe plugin init --help`; PowerShell `claude plugin configure x`;
  - `git commit -m "claude plugin test passed on the new build"`. This is the prose over-refusal of A.5.
- Allowed, `next(e)`:
  - `claude plugin eval x`; `claude plugins eval x`;
  - `claude plugin details x`; `claude plugin list`; `claude plugin marketplace list`; `claude plugin tag x`;
  - `claude mcp get x`; `claude mcp list`; `claude mcp serve`;
  - `git commit -m "init the new claude plugin folder"` (the verbs come before `claude`, so there is no sequence).

A.4 **T70** `G8 refuses the plugin and MCP verbs round 58 adds, and allows eval and the read-only verbs`. Fixture F61. **Mutation:** `login`, `logout` and `reset-project-choices` are placed among the plugin action words instead of the MCP action words.

A.5 **README (R-b, G8's over-refusals).** One line states that G8 refuses text that is never run when, within one command or one quoted string, it names `claude`, then `plugin`, `plugins` or `mcp`, then one of the eight verbs. The line gives the common words `new`, `init`, `configure`, `login` and `logout` as the shapes met in practice, and routes such text to the Write tool (R-i). It sits beside G1's over-refusal line (`tools/mods/spatial-guardian/README.md:31 @ cd539e79 sha256:HASH-TBD`). R-f's G8 limits also say that `claude plugin eval` is not refused, by round 58.

A.6 **§5.**
- Prediction: F61 as stated.
- Replay evidence: P0c's subsection on OPEN-6's rows (recorded in Amendment 3, item 3). It reports 0 rows refused with the verbs and not without them, and no main-loop row. That meets the ruling's replay condition, and nothing returns to the human.
- Declared unchanged: §5 as amended by Amendment 2, Part K, plus everything in A.1's unchanged bullet. `validate`'s predicted lines stand, since no call and no env name is added.
- Invalidated by:
  - a ruled verb absent from `claude plugin --help` or `claude mcp --help` at the build of record (I2 governs the build);
  - a recorded custodian flow refused by these verbs that does not name the spelling within one restart's text (Amendment 2, A.8). This is I8.

A.7 **§8 item 26:**
- a G8 action word beyond A.2 in code, or a refusal of `claude plugin eval`;
- a ruled verb read under the other group (a plugin verb under `mcp`, or the reverse).

Item 25 stands. For the eight verbs, this Part supplies its ruling and its class 9 amendment.

A.8 **§9.**
- The architect reads round 58, OPEN-6 against A.1, F61, T70 and A.5.
- The reviewer adds F61.

**Part B — scope addition (class 9), entering with Part A: Fable's round-58 advice, item 3.** The advice is `state/directives/2026-10-05-fable-advice-round-58.md:12 @ cd539e79 sha256:HASH-TBD`. It enters as Amendment 2, Part E carried Fable's round-57 item 3: as a limit on what is read, with no refusal added.

- **Where `claude --help` is added.**
  - §0.5's list of the only `claude` subcommands the piece runs gains `claude --help`. §8 item 9 reads that list.
  - It is read-only: it prints help, then exits. It is no session start, install, enable, load or reload (Red line; I6), and no call that G7, G8 or G9 targets (§8 item 10).
  - The build worker runs it as its first step, before any code, once under `timeout 60`, with `claude --version` beside it. P0b ran the group helps the same way (P0b report, section (ii)).
  - The reviewer runs it again at the gated head.
- **The README's G8 limits** (R-f; the "What it does not claim" section, `tools/mods/spatial-guardian/README.md:26 @ cd539e79 sha256:HASH-TBD`):
  - They list, as not read, every top-level `claude` verb other than `plugin` and `mcp` whose help line does not show it to be read-only.
  - The list is taken from that output at 2.1.289 and names the build.
  - When in doubt, a verb is listed.
- **Not added:** a refusal of any top-level verb. Adding one is a later ruling, entering by class 9 before its code.
- **§1, may not claim (G8):** the top-level `claude` verbs, as the README lists them.
- **§5:** no refusal changes, and `validate` is unchanged. Invalidated if the README's list does not match `claude --help` at the gated head's build.
- **§8 item 27:**
  - the README's top-level list taken from anything other than `claude --help` at the build of record;
  - code refusing a top-level verb.
- **§9:**
  - the PR body adds `claude --help`'s output, with `claude --version`;
  - the reviewer checks the README's list against its own `claude --help` run at the gated head.

**Part C — post-result (class 1): P0c's four readings** (P0c report, section (a)). Nothing below changes what Guardian refuses beyond the brief and the rulings.

1. **In a restart, B is M at the restart's own level, and a token rescanned inside the restart takes B from its own first segment.**
   - Settled by Amendment 2, A.2: its restart bullet (B unknown, read as M) and its bullet on B in a rescanned token, which applies in every reading.
   - Declared before code as §8 text, changing item 20's third bullet: there, reading B means reading a leading `cd` at the restart's own level. A token the restart rescans takes B by A.2's rescanned-token bullet, and that is no breach of item 20.
2. **`plugins` is in G8's trigger.**
   - Settled by §2.3's closing line (each rule's spellings are §7's values) and Amendment 2, Part H's group words.
   - Declared for the gate as a change to §2.5's trigger bullet: it reads §7's group words. The spelling set is unchanged.
   - It is needed for A.4's argument in Amendment 2. Without it, a quoted `bash -c` string holding `claude plugins install` would not be rescanned.
3. **`/s` is a recursive option for every delete word.**
   - Settled by §2.6, refused item 3, whose recursive-option bullet names `/s` with no condition on the command word.
   - Amendment 2, Part F's option rule changes only which words count as operands for `rd`, `rmdir`, `del` and `erase`.
   - For `rm` and the PowerShell words, this reading can only add a refusal, never allow one. No declaration is needed.
4. **The first refusing restart, in index order, is the one reported.**
   - In P0c this is a reporting choice.
   - In the build, it determines the rule id and reason only when one restart refuses and another throws. The outcome is a deny either way.
   - Declared before code as §2 text appended to Amendment 2, A.2's "When restarts run" bullet:
     - restarts run in ascending order of their restart point;
     - the rule refuses at the first restart that refuses;
     - a throw in an earlier restart reaches the hook's catch (§2.1(b)).
   - No test is added. The architect reads this against the code under §9's A.4 item.

**Part D — Fable's round-58 advice, item 4, for §9** (`state/directives/2026-10-05-fable-advice-round-58.md:14 @ cd539e79 sha256:HASH-TBD`). It is recorded by reference as the first reduction §9 considers when a gate fails on G9's code and not on a record.
- Moving G9 would narrow the piece that the human's direction approved (Authority, line 2). So it would enter as class 5 on his ruling, before a second code round.
- This amendment moves nothing.

**Part E — record lines amended by reference, and the superseded index.**
- **§1:**
  - may claim, item 2, adds F61's refused rows and passes its allowed rows;
  - may not claim, G8: Amendment 2, Part K's unruled-verbs bullet now reads as `claude plugin eval` (round 58), plus Part B's top-level verbs.
- **§3:** F61 is new.
- **§4:** T70 is new.
- **§5:** T1 to T34 and T37 to T70 pass. Part A's and Part B's §5 items are added. Every other prediction stands.
- **§7:**
  - G8's values are A.2;
  - §0.5's `claude` list is Part B's;
  - the size line stands, unedited. The estimate becomes register.js about 565, tests about 1000 and README about 155, for about 1720 lines in all, over the 1300 ceiling. An overrun at the gated head is class 8 (round 25, item 2 (a)).
- **§8:** items 26 and 27 are new. Item 20's third bullet is read as Part C, item 1 states.
- **§9:** A.8, Part B's §9 items, and Part D.

**Superseded index (read this amendment first).**
- Amendment 2, Part H's outside-the-brief bullets (OPEN-6) → round 58 and Part A. The eight verbs are refused, and `eval` is not.
- §7's G8 action lists (as amended by Part H) → A.2.
- §0.5's `claude` subcommand list → Part B.
- §2.5's trigger bullet → Part C, item 2 (its reading; the spelling set is unchanged).
- Amendment 2, A.2's "When restarts run" bullet → Part C, item 4 (its order).
- §8 item 20's third bullet → Part C, item 1 (its reading).
- §1's G8 limit on Part H's unruled verbs → Part E.
- §7's estimate (as amended by Amendment 2, Part K) → Part E. The size line is not edited.
```

## 2. OPEN items for the human

None. Round 58 rules all eight verbs and `eval`, and its replay condition is met by P0c's subsection on OPEN-6's rows. Part C's four readings each follow from §2.6 or Amendment 2 and add no refusal beyond the brief and the rulings. Running `claude --help` (Part B) is read-only and outside every red line. Two future decisions would wait on the human, but neither is open now:
- **Adding any top-level `claude` verb to G8.** That is a later ruling and a red line.
- **Moving G9 to its own node.** Part D only records this. It would be a class 5 change on his ruling, raised only if a gate fails on G9's code.

## Notes (not blocking)

- **Hashes.** All ten cites in Part A, Part B and Part D are written `@ cd539e79 sha256:HASH-TBD`. The RULED block gives d8d904089a663734ba61b63121f1443f4dd1e7e4d8e079383cf6cbfe2ea997a0 for the ruling's line 6 at the commit that added it; check that against cd539e79.
- **A.3's two `git commit -m` rows** follow from §2.5's design; P0c did not run them. A miss at the build is class 2.
- **Timing (evidence only, P0c section (b)).** G9's 1735 ms was measured on Node scratch with real file-system lookups. Under v0 §0's limits item, the engine's 10 000 ms hook clock stops during `$` calls, so this is no budget risk in itself. No docs/08 row applies.

## 3. Files read

- `C:\dev\spatial-ide\tools\mods\GUARDIAN-V1-PREREGISTRATION.md` (whole, Amendments 1 to 3)
- `C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-p0c-report.md`
- `C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-p0b-report.md` (section (ii))
- `C:\dev\spatial-ide\state\directives\2026-10-05-round-58-guardian-v1-open-6-ruling.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-fable-advice-round-58.md`
- `C:\dev\spatial-ide\DECISIONS-PENDING.md` (the round 58 RULED block and its neighbours)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md` (classes 1 to 9, Round 25 additions)
- `C:\dev\spatial-ide\state\directives\MODS-V1-2026-10-05.md` (§2.3 table and bullets)
- `C:\dev\spatial-ide\tools\mods\spatial-guardian\README.md`
- `C:\dev\spatial-ide\tools\mods\GUARDIAN-V0-PREREGISTRATION.md` (by search: hook budget, §7 counting line, class 8 precedent)

No write-capable call was made.
