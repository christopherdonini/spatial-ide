*Custodian's filing note (2026-10-09): the architect's draft of `guardian-v1`'s Amendment 7 (the resume), on the custodian's brief at main e7bc3718 with the branch `cut/guardian-v1` at 5a9eb051. It arrived as a message, flagged by the harness for discussing a settings file (the file is the human's G8 ruling, item 3f; the draft asks for no settings change), and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 5653760003939b7878f450968272cfc70423e850590ad26d810cfae6572bf972. Write audit PASS: zero write calls (Read 26, Grep 12, Glob 1, SubagentHandback 1). Run window from the transcript: 2026-10-09T07:26:25Z to 07:38:49Z. The amendment as appended to `tools/mods/GUARDIAN-V1-PREREGISTRATION.md` is part 1's block with its 15 pins computed at e7bc3718, each pinned span's first and last line checked by the custodian (sha256 812fbc4df142869a7481ef753d33023ee4356a43f65b66fa895174176850f271). Two mechanical changes: four gendered pronouns for the human in Part E are written as their, since the human's pronouns are not stated; nothing else is changed.*

---

Reviewed: main @ e7bc37184d0db99a2832d5935ddd7ec14a251fbd; branch cut/guardian-v1 @ 5a9eb051

**1. The amendment**

````markdown
### Amendment 7 — the resume: G8 covers the main checkout's `.claude/settings.local.json` (scope addition); the build of record; merging main in; worker report 2 read; installing stays the human's; size (Parts A to G: classes 1, 3 and 9)

*Written before any resumed code, and after worker report 2's outcomes were seen. Nothing is committed on `cut/guardian-v1` beyond commit 5a9eb051, which is named in words (round 25, item 2 (d)). The architect agent drafted this at main e7bc3718. Nothing below is a quotation. Code on main is cited `path:line @ e7bc3718 sha256:<hex>`. Branch code is named by its lines, in words, at 5a9eb051, with no hash. Worker reports 1 and 2 (`state/consults/2026-10-05-guardian-v1-worker-report-1.md`, `state/consults/2026-10-05-guardian-v1-worker-report-2.md`) are cited by section. Read Part G's superseded index first, then the superseded indexes of Amendments 6, 4 and 2.*

**Part A — scope addition (class 9): the human's direction of 2026-10-09, item 3f** (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:27-28 @ e7bc3718 sha256:HASH-TBD`; its RULED block in `DECISIONS-PENDING.md` is RULED 2026-10-09, the slot orders, cited by heading). Fable's advice d of 2026-10-06 (`state/directives/2026-10-06-boot-mods-local-and-machine-script.md:24 @ e7bc3718 sha256:HASH-TBD`) names the file as the repository's, where the install record lives. It is advice, and item 3f is the ruling.

A.1 **The file.**
- L is `<M>/.claude/settings.local.json`, with M from §2.6's lookup: the main working tree's root, also for a worktree (P0 §5).
- L holds the local-scope enable record of both mods (v0's form, Amendment 11, item 3) and the project's local permission settings.
- Line 32 of `.gitignore` at e7bc3718 ignores L, so no gate ever reads a change to it.
- The user folder's own `settings.local.json` is already refused by §2.5 (`settings*.json` directly under H; F42's Edit row). The addition is therefore the repository's file.

A.2 **§2 shape: G8's path side** (§2.5, with Amendment 2, Part E).
- **Tools:** Write, Edit and NotebookEdit, from any agent, the main loop included. The check runs in G8's existing place in the order (§2.1(c)), after the user-folder checks.
- **Candidate:** a call is a candidate when its placed, normalised path ends in `/.claude/settings.local.json`. It is also a candidate when its path as received ends that way, normalised the same way (every `\` read as `/`, ASCII lower-cased) and read with a `/` put in front. Only a candidate makes a lookup.
- **For a candidate:** M is found by `mainTree` (cached on success), and L is placed by `place` (`tools/mods/spatial-guardian/hooks/register.js:251-281 @ e7bc3718 sha256:HASH-TBD`). The call is refused, with `G8_REASON` and rule `G8`, when the candidate's placed path equals L's placed path, both normalised (`tools/mods/spatial-guardian/hooks/register.js:284-286 @ e7bc3718 sha256:HASH-TBD`).
- **Fail closed:**
  - a rejected repository lookup, or a stat that fails other than with ENOENT, throws to the hook's catch (§2.1(b); rule `catch`);
  - when L cannot be placed, the candidate is refused (`G8`);
  - when there is no repository, a candidate passes, as for G9 (§2.6).
- **A link at L, or in its folders,** stays in reach. The call is a candidate by its spelling, and both sides resolve to the link's target.
- **No new hook, `$` call, env name or reason.** The lookups go through `mainTree` and `place`, so `validate`'s calls line keeps the annotations recorded in worker report 2, §5. The repository check (Amendment 2, Part C) is not run for this check (§8 item 21).
- **The shell side.**
  - G8's command side is unchanged. Its action words already refuse the CLI's route to L: `claude plugin enable` and `disable` at local scope (F42).
  - A Bash or PowerShell write to L is not read. That is OPEN-7's default (a).

A.3 **Still allowed:**
- a read of L (Guardian has no read hook);
- `<M>/.claude/settings.json`, and every other path under `<M>/.claude/` (F43 is unchanged);
- a `settings.local.json` in any other checkout: a worktree under `C:\dev\wt\` or under `<M>/.claude/worktrees/`, or another clone;
- a `settings.local.json` that is not in a `.claude` folder;
- shell writes, pending OPEN-7;
- the engine's own writes (a permission prompt's always-allow answer, `/permissions`, `/plugin`). They are not tool calls, and they are the human's acts.

A.4 **Fixtures.**
- **Engine answers:** `env.get` by `arm`'s default (Amendment 6, Part B); session.repo `C:/r`; stat by v1's file-system helper (every path resolves to itself unless a row says otherwise).
- **F64, refused, G8 (T73):**
  - Write `C:\r\.claude\settings.local.json`;
  - Edit `c:/R/.Claude/Settings.Local.JSON`;
  - NotebookEdit `C:\r\.claude\settings.local.json`;
  - Edit `C:\r\x\..\.claude\settings.local.json`;
  - a `worker` row's Write to `C:/r/.claude/settings.local.json`;
  - Write `C:\r\.claude\settings.local.json`, with the file answering ENOENT and its folder existing;
  - Edit `C:\link\.claude\settings.local.json`, with `C:/link` resolving to `C:/r`;
  - Write `C:\r\.claude\settings.local.json`, with that file resolving to `D:/t/s.json` (a link at L).
- **F65, `next(e)` (T74):**
  - Edit `C:\r\.claude\settings.json`;
  - Write `C:\r\.claude\settings.local.json.bak`;
  - Write `C:\r\settings.local.json`;
  - Write `C:\r\.claude\worktrees\w\.claude\settings.local.json`;
  - Write `C:\dev\wt\x\.claude\settings.local.json`;
  - Write `C:\r\docs\.claude\settings.local.json`;
  - Bash `cat > C:/r/.claude/settings.local.json`;
  - Bash `git check-ignore -v .claude/settings.local.json`;
  - Write `C:\r\.claude\settings.local.json`, with session.repo answering no repository.
- **F66 (T75):**
  - (a) Write `C:\r\.claude\settings.local.json`, with session.repo rejecting: refused, `CATCH_REASON`;
  - (b) Write `C:\r\docs\x.md`, with session.repo rejecting: `next(e)`, because a non-candidate makes no lookup;
  - (c) Write `C:\dev\wt\x\.claude\settings.local.json`, with `C:/r/.claude` answering ENOENT: refused, G8, because L cannot be placed.

A.5 **Tests.** Each test's comment carries its observation (§4; Part D).
- **T73** `G8 refuses a tool write to the main checkout's .claude/settings.local.json in every spelling, a link included`. Fixture F64. Mutation: the candidate test reads the placed path only, not the path as received.
- **T74** `G8 allows the repository's other .claude files, another checkout's settings.local.json and shell calls that name it`. Fixture F65. Mutation: the suffix test alone decides (L's comparison dropped).
- **T75** `G8's settings.local.json check fails closed and makes no lookup for any other path`. Fixture F66. Mutation: a rejected repository lookup is read as no repository.

A.6 **Existing rows: none changes.**
- F42's user-folder `settings.local.json` row is refused by the user-folder side, as before.
- F43's three `C:\r\.claude` rows pass.
- F46 (b), F47 to F49 and every v0 fixture hold no candidate. They make no new lookup, and `arm` gains no answer (§8 item 29 holds).
- T49, T50, T54, T56 and T57 are unchanged.

A.7 **§21a.**
- The addition falls under the form's first two Gating heads: security posture, and refuse-only with fail-closed. It adds one refusal, adds no write and moves no catch.
- It brings no other §21a category: no wire change, no ADR, no configuration.

A.8 **README (R-b, R-f).**
- G8's row gains L, as the local scope's enable record and the local permission settings. Its allowed list now reads as the repository's other `.claude` files.
- G8's limits gain four entries:
  - shell writes to L;
  - another checkout's `settings.local.json`;
  - a session started in a worktree, which reads that worktree's file;
  - a link at L whose target is written by its own spelling.
- The limit on the repository's own settings keeps the tracked files unguarded, and names L as guarded against tool writes.
- The Install section gains one sentence: G8 refuses an agent's tool write to the enable record.
- G8's kept over-refusal (a settings change the human asks the custodian to make by a tool write) now also covers a permission change in L.

A.9 **§1.**
- May claim, item 2, adds F64's refusals and F65's passes. Item 3 adds F66 (a) and (c).
- May not claim:
  - A.3's not-read shapes;
  - which local settings file the engine reads for a session the human starts somewhere other than the main checkout.

A.10 **§5.**
- **Predicted:** F64 to F66 as A.4 states. `validate`'s lines are unchanged from the line worker report 2, §5 observed.
- **Declared unchanged:**
  - every reason, `G8_REASON` included;
  - §7's env names;
  - the hooks line and the calls line;
  - G8's user-folder side and its `.claude.json` rule;
  - F42, F43 and F46 to F49.
- **Invalidated by:**
  - the enable record being found somewhere other than L (v0's form, Amendment 11, item 3);
  - a P0e (c) row showing an agent's tool write to L that was not a settings change the human asked for (Amendment 2, A.8's reading of I8).

A.11 **§8 item 30, block-on-sight:**
- a refusal of a `settings.local.json` path on the suffix alone;
- a lookup made for a non-candidate;
- a rejected lookup read as no repository, or an L that cannot be placed read as allow;
- a shell-side refusal of L before OPEN-7's ruling and its class 9 amendment;
- any write to L by any agent in the piece, or any of L's content in a record.

§8 item 9 and I6 gain any write to L.

A.12 **§9.**
- The architect reads item 3f against A.2, F64 to F66 and T73 to T75.
- The reviewer adds F64 to F66.
- Part A's code waits for OPEN-7's ruling, or for the human's note that its default stands.

**Part B — post-result (class 1): the build of record.**
- **Observed:** #183's mutations were observed at 2.1.291 (`tools/mods/spatial-guardian/test/guardian.test.ts:769-773 @ e7bc3718 sha256:HASH-TBD`), and main's README names 2.1.291 (`tools/mods/spatial-guardian/README.md:5 @ e7bc3718 sha256:HASH-TBD`). This form names 2.1.289, so every run of record on resume would fire I2 as it is worded.
- **Reading:**
  - The build of record is the version `claude --version` prints at P0e (a), as the N1 form takes its build (its §0.3, item 1). I2 reads against that build.
  - §1's 2.1.289, §4's E-row build precondition and R-j's build line all read as that build.
  - The 2.1.288 type reads keep their labels (§0.1). A `plugin test` result is a claim about the build of record.
- **P0e: read-only, in the worktree, before the merge.** Nothing from P0e is an observation.
  - **(a) The CLI.** The worker runs `claude --version`, `timeout 60 claude --help`, `claude plugin --help`, `claude plugin marketplace --help` and `claude mcp --help`, all inside §0.5's list as Amendment 4, Part B amends it. It records each output's sha256 and sets the outputs against P0b (ii) and worker report 2, §2.
    - **STOP (I16), to the human as a red line, as round 58 was:** a plugin, marketplace or MCP verb or alias that installs, uninstalls, enables, disables, updates, adds, removes or configures, and that is not in §7 as Amendment 4, A.2 lists it.
    - A ruled verb that is now absent is Amendment 4, A.6's invalidator.
    - A changed top-level list is taken into R-f's list (§8 item 27). It is not a stop.
  - **(b) The plugin-test switch.** `claude plugin test tools/mods/spatial-guardian` at 5a9eb051. Predicted: 70 pass. Worker report 1, §4's refusal message appearing again is I15.
  - **(c) A replay of tool writes.** It covers every Write, Edit and NotebookEdit call in this project's transcripts from 2026-09-20 to the run whose path, normalised, ends in `/.claude/settings.local.json`. Each row gives the time, the agent, the tool, and whether the path is the main checkout's L. No content and no command text are recorded. Nothing is predicted; the rows are reported. A row that writes L joins A.8's kept over-refusal when it was a settings change the human asked for. Any other such row is reported to the human under A.10.

**Part C — post-result (class 1): merging main in, and the pins.**

C.1 **The merge.**
- In the worktree, the worker merges main at a commit that holds this amendment, as a merge commit: no squash, no rebase, no force (§8 item 17). The merge commit is signed off.
- Under `tools/mods/`, the merge brings in:
  - #183: `register.js`, `continuity.mjs`, `guardian.test.ts` and the README's N1 lines;
  - #184: the README's Install and Turning-it-off lines.
- The N1 form's §0.4 (`tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md:86-99 @ e7bc3718 sha256:HASH-TBD`) names the expected conflicts and the rule: N1's text comes from main, and every G-rule's text from v1.

C.2 **Expected conflicts.**
- **`register.js`:**
  - **The header's N1 entry: certain.** v1 rewrote the header (lines 1-25 of `tools/mods/spatial-guardian/hooks/register.js` at 5a9eb051; its N1 entry is line 24). Main edited its line 15 in place (`tools/mods/spatial-guardian/hooks/register.js:15 @ e7bc3718 sha256:HASH-TBD`).
  - **The declared values: possible.** v1's block is lines 29-38 at 5a9eb051, with `N1_BAND` on line 32. Main changed its line 23 (`tools/mods/spatial-guardian/hooks/register.js:23 @ e7bc3718 sha256:HASH-TBD`).
  - **The N1 section: predicted to merge cleanly** (`tools/mods/spatial-guardian/hooks/register.js:420-486 @ e7bc3718 sha256:HASH-TBD`). v1 kept v0's section unchanged (lines 1018-1053 at 5a9eb051) and changed only `register` after it.
- **`guardian.test.ts`:**
  - `World` and `arm`: main's lines 38, 39 and 62 (`tools/mods/spatial-guardian/test/guardian.test.ts:29-40 @ e7bc3718 sha256:HASH-TBD`; `tools/mods/spatial-guardian/test/guardian.test.ts:49-96 @ e7bc3718 sha256:HASH-TBD`) against Part B's `env` (lines 29-43, and `arm` from line 52, at 5a9eb051);
  - the end of the file: main's B section and its re-observation block (`tools/mods/spatial-guardian/test/guardian.test.ts:739-831 @ e7bc3718 sha256:HASH-TBD`) against v1's section (lines 727-1511 at 5a9eb051).
- **README:** main's lines 5, 18, 24 and 38, and its Install and Turning-it-off sections (`tools/mods/spatial-guardian/README.md:46-63 @ e7bc3718 sha256:HASH-TBD`), against v1's lines 5, 21, 27 and 73 and its lines 94-111 at 5a9eb051.

C.3 **How the conflicts are resolved.**
- **From main:** N1, `continuity.mjs` and main's B tests, byte for byte. `N1_BAND` takes main's value. The B section and its re-observation block stay where main put them, before v1's section.
- **`World` and `arm`:** main's lines, with Amendment 6, Part B's `env` field and default added, and nothing else.
- **README:**
  - line 5 names the build of record (Part B) and keeps main's clause on N1's three fields;
  - the N1 row and the N1 paragraph are main's;
  - Install and Turning it off are main's local-scope text, plus v1's sentence that G8 refuses these commands to every agent, and A.8's sentence;
  - v1's user-scope sentence (never `project` or `local` scope) is dropped, because it contradicts v0's form, Amendment 11.
- **From v1:** every G-rule line, the log, and v1's tests.
- **Check at the merge commit, by script.** The diff from the merged main commit to the merge commit holds:
  - no line of `continuity.mjs`;
  - no line of main's N1 section or of main's B tests;
  - no line of Install or Turning it off other than C.3's two sentences.

C.4 **Readings after the merge** (the N1 form's §0.4).
- I9 reads against main's T1 to T41: T28 is now B-T3, and T29's fixture is recent.
- The N1 that §5 and §7 declare unchanged is N1 as main holds it.
- §7's `<base>` is the merged main commit, so #183's and #184's lines are not counted.

C.5 **Check at the merged head, before any Part A code.**
- `claude plugin test`. Predicted: every test passes, namely v1's 70 plus main's B-T1, B-T2 and B-T4, each named.
- `validate` on `tools/mods/spatial-guardian`, as text. Predicted: the hooks and env lines are unchanged, and the calls line is as worker report 2, §5 records it.
- **STOP (I17), to the architect:** any failing test, or a hooks or env line that differs.

C.6 **The pins.**
- **Standing.** Every pin in this form is at a commit on main (5c06b0c2, 3c802bcc, cd539e79, 2d4fa886, e7bc3718), and each is a historical pin. The pin is authoritative for the text it cites at its commit. The merged head's tree is authoritative for the code (round 14). No pin is edited or re-pinned.
- **How the worker re-derives them.** By script, as evidence in its report and not as a record. For each pin into the three files:
  - the span at the pin's own commit, with its sha256 recomputed;
  - the lines where the same bytes sit at the merged main commit and at the merge commit, or the word changed.
- **Predicted at the merged main commit:**
  - every `register.js` pin keeps its lines and bytes, except the registrations (457-464 at 5c06b0c2), which are found at `tools/mods/spatial-guardian/hooks/register.js:488-495 @ e7bc3718 sha256:HASH-TBD`;
  - the test pins 29-40 and 49-96 (at 2d4fa886) keep their lines, with changed bytes;
  - every other test pin and every README pin keeps its lines and bytes.
- **Predicted at the merge commit:** the v0 spans that v1 changes by design read as changed.
- A different finding is reported. It changes no claim.

**Part D — post-result (class 1): worker report 2, read for the resume.**

D.1 **What exists** (report §5): commit 5a9eb051 changes the three files, and 70 of 70 plugin tests passed at 2.1.289. No observation is of record. Each new test's comment carries an `OBSERVATION-Tnn` placeholder.

D.2 **Readings settled** (report §9):
- **Item 1.** F62's second row is `bash -c "git push 'origin"` with its double quote closed. It is refused through the rescan by (ii) (Amendment 6, A.7). T71's rows hold that form (lines 1493-1499 of `tools/mods/spatial-guardian/test/guardian.test.ts` at 5a9eb051).
- **Item 2.** An answer of no repository is not cached and is asked again. That adds lookups only and changes no outcome.
- **Item 5.** T58's line names T58's own test and gives a count for the others. That meets §4.
- **Item 6.** The v1 helpers beside `arm` answer only for the tests that call them, so §8 item 29 holds.
- **Item 3, with worker report 1, §5.** `validate`'s calls line differs from §5's lines only in `(via …)` annotations. This is class 2 under §5. The line observed is the prediction from now on (A.10, C.5).
- **Item 7.** Evidence about the test kit only.

D.3 **Observations owed.**
- **How:** all at one observation commit, the one whose code is the gated head's code. Each mutation is applied, run under `claude plugin test`, recorded by failing test name with the commit and `claude --version`, then reverted (round 25, item 2 (c)).
- **What:**
  - **The new tests:** T42 to T72 and T73 to T75. None of T42 to T72 is of record: report §6's runs of T42 to T52 are scratch runs at 5a9eb051 on 2.1.289, and its runs from T53 on are void.
  - **v0, re-declared:** T16, T24 and T25 share one mutation (§4).
  - **v0, re-observed:** T1 to T15, T17 to T23, T26 to T34 and T37 to T41, as main holds them. T28 is B-T3 and T29 is B-T5, each with its recorded lines.
  - **Main's B-T1, B-T2 and B-T4:** each recorded mutation line is re-observed, because v1 changes the `register` they run under (§4's reason).
  - **T35 and T36:** run by `node --test`, unchanged, with no mutation.
- **Recording:**
  - In each new test, the `OBSERVATION-Tnn` placeholder is replaced by the observation. These are the piece's own unmerged lines, so §8 item 12's last bullet (an existing line edited) reads as applying to lines on main, not to these.
  - Beneath each line on main (v0's and #183's), a v1 line is appended.
  - No placeholder remains at the gated head (§8 item 12).
  - No record calls a `verify-mutation` run an observation.

**Part E — installing stays the human's (no new class; one hold added).**
- **What the form already says:** the Red line's second and third bullets, I6, §8 item 9, and §9's Operator steps (the human's typed approval naming the E-rows, his click, his reload).
- **No resumed step installs, enables, reloads or loads a mod.**
  - P0e only reads.
  - The merge happens in the worktree under `C:\dev\wt\`.
  - `claude plugin test` and `validate` load nothing into a session (Amendment 6, Part C).
  - v1 changes no `plugin.json`, `hooks.json` or marketplace file, so no reinstall is needed.
- **What changes the live mod is the human's:** the merge (his click, after his typed approval) and the reload.
- **The custodian's fast-forward of the main checkout** puts v1 where the live mod is read from (v0's form, Amendment 11, item 5). It is therefore made only after that approval and click, as §9 already orders.
- **Added hold:** any write to L, the enable record (A.11).
- **E15** (beyond the brief's list; it runs only if the human names it):
  - **The call:** a main-loop Edit of the main checkout's `.claude/settings.local.json`, whose `old_string` is fresh text absent from the file, made with no prior Read.
  - **Predicted:** G8's reason, and the file's sha256 unchanged, computed before and after by script. No content is recorded.
  - **Harmless if not refused:** the Edit tool rejects an `old_string` it cannot find.
  - **If the engine stops the call before Guardian's hook runs,** or asks the human for permission, the row records that and is inconclusive, and the human declines any prompt.
  - When E15 is named, E10's file count extends to it.

**Part F — size (§7). No class until the gated head.**
- §7's size line stands, unedited.
- At 5a9eb051, §7's command against ccac14d2 counts 1645 lines over 3 files (report §5). After the merge, `<base>` is the merged main commit.
- **Estimate at the gated head:** about 1850 lines over 3 files, within Amendment 6, Part D's estimate and over the 1300 ceiling:
  - register.js about 790;
  - tests about 980 (Part A about 70, observation lines about 110);
  - README about 85.
- An overrun at the gated head is class 8, by §7's own command (round 25, item 2 (a)). The file count stays 3 (I5).

**Part G — record lines amended by reference, and the superseded index.**
- **§1:** may-claim items 2 and 3, and the may-not-claim list → A.9. The build → Part B.
- **§3:** F64 to F66 are new.
- **§4:**
  - T73 to T75 and E15 are new;
  - the observation set → D.3;
  - the E-rows' build precondition → Part B.
- **§5:**
  - T1 to T34, T37 to T75, and main's B-T1, B-T2 and B-T4 pass;
  - A.10's predictions and declarations are added;
  - **I16** is P0e (a)'s stop, and **I17** is C.5's stop;
  - I2 reads against Part B's build;
  - I6 gains L.
- **§7:** G8's locations add L (A.1). The estimate → Part F. The size line is not edited.
- **§8:** item 30 is new (A.11). Item 9 gains L. Item 12 reads as D.3 states.
- **§9:**
  - **Dispatch** comes after this amendment's commit, in this order:
    1. P0e (a) to (c);
    2. C.1 to C.6;
    3. Part A's code, once OPEN-7 is ruled or its default confirmed;
    4. D.3;
    5. the suites, `validate` on both targets as text and `--json`, and §7's count.
  - **The architect adds** A.12, C.3's check and D.2.
  - **The reviewer adds** F64 to F66, P0e's outputs, C.5, and C.6's table.
  - **Verdicts** follow `state/directives/2026-10-05-product-first-direction.md`, section 2.
- **Class 3 correction.** Amendment 6's first line names its superseded index as Part F. The index follows its Part E, under its own heading, and that heading is the reference.

**Superseded index (read this amendment first).**
- §2.5's path side → A.2 adds L.
- §1's build, I2's build, §4's E-row build precondition, and R-j's build line → Part B.
- §4's observation set → D.3.
- §9's dispatch order → Part G.
- §7's estimate, as Amendment 6, Part D amends it → Part F. The size line is not edited.
- Amendment 6's reference to its own superseded index → Part G's class 3 row.
````

**2. OPEN items for the human**

**OPEN-7: should G8 also refuse a shell write to the main checkout's `.claude/settings.local.json`?**
- **(a) No; it is not read.** This is the default the amendment declares. G8 refuses tool writes only, as it already does for the user folder (§0.4 item 4) and the user-level `.claude.json` (Amendment 2, Part E). The README states the limit. It adds no new reader, and no over-refusal of reads of the file that are already on record.
- **(b) Refuse any Bash or PowerShell call whose words name the file.** That would also refuse reads, such as `git check-ignore -v .claude/settings.local.json`, which ran in a 2026-10-06 gate (`state/consults/gates/2026-10-06-mods-readme-local-scope-gate1-reviewer.md:71 @ e7bc3718 sha256:HASH-TBD`), and `cat`. It is a new word rule on both shells.
- **(c) Refuse only shell write spellings that target the file:** a redirect, `tee`, `sed -i`, a `cp` or `mv` destination, `Set-Content`, `Add-Content` or `Out-File`. That would be Guardian's first write reader, and it would be partial: writes made from code, or through variables, still pass.
- **Recommendation:** (a).
- **Red line:** yes. What Guardian refuses is the security posture (§21a), as OPEN-1 to OPEN-6 were in rounds 57 and 58.
- **What waits on it:** Part A's code and tests only. P0e, the merge and C.5 or C.6 do not wait. A ruling of (b) or (c) enters by class 9 before its code (I10).

**Not an OPEN item, but you should know.** Part B moves the build of record off 2.1.289. #183's mutations were observed at 2.1.291, so under I2 as worded every run on resume would stop the piece. I have recorded this as class 1, on the N1 form's own precedent. If you would rather the human rule on it, it is the one judgement in this amendment that changes an invalidator.

**Notes for the custodian:**
- I have no Bash, so none of this was run. The expected conflicts and the pin predictions in C.2 and C.6 come from reading files.
- Confirm that the 2026-10-09 directive is tracked at e7bc3718 before hashing it.
- The 2026-10-09 direction's item 5 (query the index before planning) binds the drafting brief for a new piece. This is an amendment to a piece already preregistered, and no index output was carried.

**3. Files read**
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V1-PREREGISTRATION.md (whole, Amendments 1 to 6)
- C:\dev\spatial-ide\PLAN.yaml (node guardian-v1, lines 4104-4121)
- C:\dev\spatial-ide\state\directives\2026-10-09-slot-orders-pilot-and-reuse-standing-step.md
- C:\dev\spatial-ide\state\directives\2026-10-06-boot-mods-local-and-machine-script.md
- C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-worker-report-1.md
- C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-worker-report-2.md
- C:\dev\spatial-ide\tools\mods\GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md (§0.2 to §2.7)
- C:\dev\spatial-ide\tools\mods\MODS-README-LOCAL-SCOPE-PREREGISTRATION.md (Scope line)
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V0-PREREGISTRATION.md (Amendments 10 and 11)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\hooks\register.js (main, e7bc3718)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\test\guardian.test.ts (main: lines 1-100 and 720-831, plus a structural grep)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\README.md (main)
- C:\dev\wt\gv1\tools\mods\spatial-guardian\hooks\register.js (branch at 5a9eb051: lines 1-120 and 560-1064)
- C:\dev\wt\gv1\tools\mods\spatial-guardian\test\guardian.test.ts (branch: lines 1-60, 725-843, 1008-1077, 1137-1266, 1356-1380 and 1488-1511)
- C:\dev\wt\gv1\tools\mods\spatial-guardian\README.md (branch)
- C:\dev\spatial-ide\.gitignore (lines 25-36)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (lines 95-174)
- C:\dev\spatial-ide\DECISIONS-PENDING.md (RULED 2026-10-09 headings)
- C:\dev\spatial-ide\state\CUT-STATE.md (entries of 2026-10-06T16:28Z and 2026-10-09T07:26Z, by grep)
