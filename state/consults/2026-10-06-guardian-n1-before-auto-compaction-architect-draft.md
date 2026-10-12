*Custodian's filing note (2026-10-06): the architect's draft of `guardian-n1-before-auto-compaction`'s preregistration (piece B of the context-flush brief), on the custodian's brief at main 7ce9dab2. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is ce0fb5e7ae0ceef4e9b18b9d5b8b9bf5c70af47c0f523c36373e6641fa31e3a1. Write audit PASS: zero write calls (Read 36, Grep 13, Glob 2, SubagentHandback 1). Run window from the transcript: 2026-10-06T04:58:25.752Z to 2026-10-06T05:11:21.086Z (the harness's usage line: 288,351 subagent tokens, 52 tool uses, 775,355 ms). The form as committed, `tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md`, is part 2's block with its 48 HASH-TBD pins computed at 7ce9dab2, and with seven phrases on six lines rewritten so that the human is referred to in neutral words, as the custodian's standing rule requires; nothing else changed. Its fact 1 is answered in the ledger: the branch `cut/guardian-v1` at 5a9eb051 changes, against main, exactly `register.js`, `guardian.test.ts` and `README.md` under `tools/mods/spatial-guardian/`, from merge base ccac14d2.*

---

Reviewed: main @ 7ce9dab2

## 1. The form, and why

**Full form, full gating (reviewer and architect).** No five-line form is used. Four heads apply, and each one is enough on its own:
- **§21a, security posture.** Guardian is installed by reference from the main checkout's folder. So this merge is the security-posture change itself (`state/directives/MODS-V1-2026-10-05.md:5`; v0 form Amendment 8, E0).
- **§21a, a property currently under test.** v0's T28 asserts the 10-point band. v0's T29 asserts that a block whose `flushed_at` is days old is fresh. B2 and B3 reverse both.
- **§21c, size.** About 290 changed lines with the tests, against the 150-line bound.
- **§21c, new user-visible behaviour.** The text of the nudge, and when it fires.

Under §25(e) and the template's Round 25 (e), the Out-of-scope line would name a §21a category (security). So the full form applies from dispatch.

**Where it lives:** `tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md`, beside the v0 and v1 forms. It is outside `spatial-guardian/`, so committing it does not touch the live folder.

**One design choice that departs from what the brief implies.** The parity test (`scripts/hooks/guardian-continuity-parity.test.mjs`) is not edited.
- The age clause is applied in N1 (`register.js`), after the judgment `continuity.mjs` makes, and it reads the `flushed_at` that `continuity.mjs` already parses. That value comes back as one new field.
- So the shared judgment (`judged` and `stale`) stays the Stop hook's predicate step for step, and T35/T36 must pass unchanged. That answers B3's question about the parity test.
- This keeps the piece inside `tools/mods/spatial-guardian/`, which matches piece A's form (§0, concurrent work: piece B edits only `tools/mods/`).

**What is the human's:**
- His typed merge approval naming E12 to E14 (a red line, at merge time).
- The reload that makes the change live (his).
- Four readings he may overturn before code (§3 below). None is a red line, and no code waits on them unless he overturns one.
- If P0's stop (I1) or my added stop (I4) fires, the figures go to him.

## 2. The draft

````markdown
# Guardian N1 measured against the auto-compaction threshold: 5-point bands from 80, and a flush-age clause (PLAN node `guardian-n1-before-auto-compaction`) — preregistration

**Authority:**
- the 2026-10-05 context-flush direction (RULED 2026-10-05; cited by its block's heading, since it carries no round, item or entry number). Item 3 is `state/directives/2026-10-05-human-direction-context-flush.md:12 @ 7ce9dab2 sha256:HASH-TBD`; item 5 is `state/directives/2026-10-05-human-direction-context-flush.md:16 @ 7ce9dab2 sha256:HASH-TBD`. Item 3 changes round 44, item 1 for N1;
- the brief it approves, piece B: `state/directives/CONTEXT-FLUSH-2026-10-05.md:39-54 @ 7ce9dab2 sha256:HASH-TBD`; what stays, its §2: `state/directives/CONTEXT-FLUSH-2026-10-05.md:23-28 @ 7ce9dab2 sha256:HASH-TBD`; the measure, its §5: `state/directives/CONTEXT-FLUSH-2026-10-05.md:56-62 @ 7ce9dab2 sha256:HASH-TBD`; acceptance and stop, its §6: `state/directives/CONTEXT-FLUSH-2026-10-05.md:64-70 @ 7ce9dab2 sha256:HASH-TBD`; what the covering line settles, its §8 items 4 and 5: `state/directives/CONTEXT-FLUSH-2026-10-05.md:83-84 @ 7ce9dab2 sha256:HASH-TBD`;
- placement: the 2026-10-05 product-first direction (RULED 2026-10-05, cited by its block's heading), with its fragments and clarification (`state/directives/2026-10-05-product-first-fragments.md`, `state/directives/2026-10-05-product-first-clarification.md`). Section 1 says the piece continues and no longer waits for `guardian-v1`: `state/directives/2026-10-05-product-first-direction.md:9-11 @ 7ce9dab2 sha256:HASH-TBD`. Section 4 sets the slot-2 order: `state/directives/2026-10-05-product-first-direction.md:19 @ 7ce9dab2 sha256:HASH-TBD`. Section 7 lists what is unchanged: `state/directives/2026-10-05-product-first-direction.md:25 @ 7ce9dab2 sha256:HASH-TBD`;
- the node: `PLAN.yaml:4136-4153 @ 7ce9dab2 sha256:HASH-TBD`;
- standing rules:
  - round 44, item 1 (`state/directives/2026-10-03-guardian-o3-o8-ruling.md:6-8 @ 7ce9dab2 sha256:HASH-TBD`), as item 3 changes it for N1;
  - round 34, item 3 (no live G1 probe); round 7 (texts); round 29 (exposure); round 15 (c) and (e); round 25, item 2 (a) to (e);
  - the MODS-V1 brief's install-by-reference line and its §1 (`state/directives/MODS-V1-2026-10-05.md:5 @ 7ce9dab2 sha256:HASH-TBD`; `state/directives/MODS-V1-2026-10-05.md:9-11 @ 7ce9dab2 sha256:HASH-TBD`);
  - the v0 brief's N1 row (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24 @ 7ce9dab2 sha256:HASH-TBD`).
- The v0 form (`tools/mods/GUARDIAN-V0-PREREGISTRATION.md`) stays the form of every v0 rule. It is closed by its Amendment 7, and this piece appends no amendment to it. This form governs only N1's fill, bands, staleness and text, and the one field `continuity.mjs` gains. For those, it replaces v0 §2.8 and v0 §7's N1 values.

**Drafted by** the architect agent on the custodian's brief, alone. No lead-data read was made, because the piece crosses no `engine/` or `kernel/` path (product-first direction, section 1). It was read at main 7ce9dab2.
- Nothing was run.
- The architect has no shell, so `cut/guardian-v1` at 5a9eb051 was not read with `git show`. Its contents are taken from its form (Amendments 1 to 6) and the ledger. Before dispatch, the custodian confirms which files that branch's diff against main touches (§0.4).
- **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating:** full, reviewer and architect, under four heads, each enough alone:
- **§21a, security posture** (`AUTONOMY.md:315-332 @ 7ce9dab2 sha256:HASH-TBD`). Guardian is read from `tools/mods/spatial-guardian/` in the main checkout (v0 form, Amendment 8, E0; Amendment 9), so the merge changes the live mod at the next reload.
- **§21a, a property currently under test.** v0's T28 (the 10-point band, `tools/mods/spatial-guardian/test/guardian.test.ts:642-652 @ 7ce9dab2 sha256:HASH-TBD`) and v0's T29 (an old `flushed_at` read as fresh, `tools/mods/spatial-guardian/test/guardian.test.ts:654-666 @ 7ce9dab2 sha256:HASH-TBD`).
- **§21c, size** (`AUTONOMY.md:347-357 @ 7ce9dab2 sha256:HASH-TBD`): over the bound (§7).
- **§21c, new user-visible behaviour:** the nudge's text, and when it fires.

Under round 25, item 2 (e) (`AUTONOMY.md:482 @ 7ce9dab2 sha256:HASH-TBD`), no five-line form is used.

**Red line.**
- The merge waits for the human's typed approval, given after both gates and before his click, naming the live rows he allows (E12 to E14) (brief §4; the context-flush direction, item 3).
- Installing, enabling, loading and reloading are his.
- Nothing in this piece installs, enables, loads or reloads a mod, adds a marketplace, starts a `claude` session, or writes under the user's Claude folder.
- Before the merge, nothing writes into `tools/mods/spatial-guardian/` or `tools/mods/.claude-plugin/` in the main checkout. This form and its §10 amendments are excepted.
- AUTONOMY §9's docs-only merge is not used while Guardian is installed.

## §0. Disclosure

**0.1 Inputs (Evidence, not Authority).**
- The window draft's item J rows: `state/drafts/weekly-window-2026-10-09.md:402-411 @ 7ce9dab2 sha256:HASH-TBD`, `state/drafts/weekly-window-2026-10-09.md:490-495 @ 7ce9dab2 sha256:HASH-TBD` and `state/drafts/weekly-window-2026-10-09.md:547-553 @ 7ce9dab2 sha256:HASH-TBD`. They show three automatic compactions since N1 went live, each with 770k to 776k tokens before it, and no N1 text in any of them.
- The v0 form's Amendment 1 (P0b), item (v): on build 2.1.288, the summary breakdown is local and carries `percentage` and `totalTokens` over `rawMaxTokens`.
- v0's Amendment 8 holds `validate`'s two lines, byte-copied, at 2.1.289.
- Build labels are kept (round 15 (c)). A 2.1.288 type read is not current for any other build.

**0.2 Repository facts relied on, at 7ce9dab2.**
- **N1's values:** `tools/mods/spatial-guardian/hooks/register.js:22-23 @ 7ce9dab2 sha256:HASH-TBD`. **N1's text:** `tools/mods/spatial-guardian/hooks/register.js:36 @ 7ce9dab2 sha256:HASH-TBD`. **The header's N1 line:** `tools/mods/spatial-guardian/hooks/register.js:15 @ 7ce9dab2 sha256:HASH-TBD`.
- **The N1 section** opens at `tools/mods/spatial-guardian/hooks/register.js:420-423 @ 7ce9dab2 sha256:HASH-TBD`:
  - `contextFill`, which makes the one `$.session.usage({ breakdown: 'summary' })` call and reads `percentage`: `tools/mods/spatial-guardian/hooks/register.js:425-429 @ 7ce9dab2 sha256:HASH-TBD`;
  - `shownBands`: `tools/mods/spatial-guardian/hooks/register.js:431-432 @ 7ce9dab2 sha256:HASH-TBD`;
  - `nudge`: `tools/mods/spatial-guardian/hooks/register.js:434-455 @ 7ce9dab2 sha256:HASH-TBD`;
  - the registrations, with N1 first: `tools/mods/spatial-guardian/hooks/register.js:457-464 @ 7ce9dab2 sha256:HASH-TBD`.
- **`judgeContinuity`**, which returns `{ judged: false }` or `{ judged: true, stale }`: `tools/mods/spatial-guardian/hooks/continuity.mjs:42-62 @ 7ce9dab2 sha256:HASH-TBD`. Its parser is `tools/mods/spatial-guardian/hooks/continuity.mjs:12-26 @ 7ce9dab2 sha256:HASH-TBD`.
- **The Stop hook's predicate**, unchanged: `scripts/hooks/stop-queue.mjs:221-244 @ 7ce9dab2 sha256:HASH-TBD`. The parity test that holds the two together is `scripts/hooks/guardian-continuity-parity.test.mjs:310-347 @ 7ce9dab2 sha256:HASH-TBD`, and its mod side reads only the outcome: `scripts/hooks/guardian-continuity-parity.test.mjs:245-255 @ 7ce9dab2 sha256:HASH-TBD`.
- **The PreCompact hook's age figure and its parse:** `scripts/hooks/precompact-flush.mjs:33 @ 7ce9dab2 sha256:HASH-TBD` and `scripts/hooks/precompact-flush.mjs:104-110 @ 7ce9dab2 sha256:HASH-TBD`, as merged in #181.
- **The test kit:**
  - `World`: `tools/mods/spatial-guardian/test/guardian.test.ts:29-40 @ 7ce9dab2 sha256:HASH-TBD`;
  - `arm`'s usage answer: `tools/mods/spatial-guardian/test/guardian.test.ts:55-66 @ 7ce9dab2 sha256:HASH-TBD`;
  - `gitWorld`: `tools/mods/spatial-guardian/test/guardian.test.ts:577-592 @ 7ce9dab2 sha256:HASH-TBD`;
  - the N1 tests T26 to T32: `tools/mods/spatial-guardian/test/guardian.test.ts:596-703 @ 7ce9dab2 sha256:HASH-TBD`.
- **The README's N1 lines:** `tools/mods/spatial-guardian/README.md:18 @ 7ce9dab2 sha256:HASH-TBD` and `tools/mods/spatial-guardian/README.md:24 @ 7ce9dab2 sha256:HASH-TBD`.
- **No owner's-index line** covers `tools/mods/`; the owner's indexes are in `engine/README.md` and `kernel/README.md`. So this piece owes no index update (product-first direction, section 1).

**0.3 P0, read-only, before any code.** P0 is run in the piece's worktree by the worker and returned as its message. The custodian records it as **Amendment 1, headed P0** (class 1). §10 opens empty, and nothing is appended before it. No code is written before Amendment 1 is committed.
1. **The types at the machine's build.**
   - The worker records `claude --version`, which becomes the build of record.
   - It then records whether the summary breakdown, the value of `context.breakdown` from `$.session.usage({ breakdown: 'summary' })`, declares each of `autoCompactThreshold` (a number), `isAutoCompactEnabled` (a boolean) and `totalTokens` (a number), each with its doc lines. It also records the doc line naming `percentage`'s denominator, and whether the call still estimates locally and sends no request.
   - Source, in order:
     - the build's own declarations, read in the 2.1.289 binary's embedded text as piece A's P0 read them (`scripts/hooks/COMPACTION-RECORD-AND-RESUME-LINE-PREREGISTRATION.md`, Amendment 1, item 2);
     - the engine-written `.claude-plugin/types/` in the worktree, if one exists there;
     - the 2.1.288 type file, read only for comparison and labelled as 2.1.288.
   - Each finding is cited by an offset or line range within a file named in words, with its sha256. No user-profile path is recorded.
   - **STOP (I1):** a field is not declared on the summary breakdown at the build of record, sits elsewhere, has another type, or no declaration can be read at that build. Then the piece stops before code and returns to the human with P0's figures (brief §4, P0 item 1).
2. **The live figures on this machine,** by reads that install nothing:
   - the model's window, from the session's model id and the build's embedded window table;
   - the auto-compaction threshold and its source. Its source is the build's embedded expression and constants, together with every override in effect, each read by name: `CLAUDE_CODE_AUTO_COMPACT_WINDOW` in the session environment, and an auto-compact window key in the user, project and local settings files. Values are recorded, and no paths;
   - a cross-check: for each automatic compaction in item 3, the token count before it (from its boundary record) stands against the threshold.
   - The human may add his own `/context` reading in the custodian's session. It is then recorded as his, and it is optional.
3. **The fill N1 would have read** at each automatic compaction since 2026-10-04T11:31Z, from every main-loop transcript of this project in that window. The window draft names three, all in session 128d8fa3: 2026-10-05T00:18:31Z, 2026-10-05T11:33:48.981Z and 2026-10-06T04:41:54.040Z. P0 enumerates all of them. For each compaction:
   - the boundary time, the trigger, and the token count before it;
   - **today's route:** that count over the compaction window that item 1's doc line names, as a percentage;
   - **B1's route:** `(100 × count) / threshold`, with item 2's threshold;
   - for each B1 band (80, 85, 90, 95): the first main-loop tool call whose preceding assistant usage (input plus cache-read plus cache-creation tokens) reaches the band's token figure; its time; and the block's state there by §2.3. That state is the newest commit on main touching `state/CUT-STATE.md` at that time, whether that commit rewrote `flushed_at`, and the age of that `flushed_at`;
   - the bands that would have nudged.
   - Disclosed: the API's usage stands in for the breakdown's local estimate. Transcripts sit under the user's Claude folder; they are named by session prefix only, and no command text is reproduced.
   - **STOP (I4, the architect's addition; reading R-4):** at the last main-loop tool call before any of these compactions, B1's fill is below 80. B1 could not have fired there, so the piece stops and returns to the human with the figures.
- **The `claude` subcommands the worker may run** anywhere in the piece are `claude --version`, `claude plugin validate` and `claude plugin test`. The custodian alone runs `claude plugin list`, at E12.

**0.4 What this piece's merge does to `guardian-v1`'s resume.** `guardian-v1` is parked. Its branch is `cut/guardian-v1` at commit 5a9eb051, named here in words and not pinned (round 15 (e)). By its §2.0 and §7, that branch changes `register.js`, `guardian.test.ts` and `README.md` only. Its first step on resume is the ledger's parked entry of 2026-10-05T20:29Z: merge main in, re-read the form's pins into `register.js`, then record the mutation observations.
- **Line-stable by construction (§8 item 6).**
  - In `register.js`, this piece inserts and removes no line above the N1 section (line 420 at 7ce9dab2). It edits lines 15 and 23 in place only. So v1's pins into lines 3-6 and 54-418 at 5c06b0c2 and 2d4fa886 keep their numbers and content on main after this merge. v1's pin to the registrations (457-464) moves with the N1 section's growth.
  - In `guardian.test.ts`, this piece edits only lines 38, 39 and 62 in place above T28 (line 642 at 7ce9dab2). So v1's pins to the header, `World`, `arm`, T7, T24 and T25 keep their line numbers. Their `World` and `arm` content differs, which is v1 Part B's own region.
- **Expected textual conflicts on v1's merge of main:**
  - the `World` and `arm` lines, where v1 Part B adds the env answer;
  - `register.js` line 15, if v1 rewrote the header's rule list;
  - the README's N1 row and N1 paragraph.
  Resolution: N1's text from main (this piece), and every G-rule's text from v1.
- **Readings v1 must take by its own amendment on resume.** This form cannot amend v1's form.
  - v1 §5 declares N1 unchanged, and v1 §7 declares N1's values unchanged. Both read as N1 as main holds it after this merge, since v1 changes none of it.
  - v1's I9 (T1 to T41 pass unchanged) reads against main's T1 to T41 after this merge: T28 is rewritten as B-T3, and T29's fixture is recent.
  - v1's `validate` prediction is unaffected. This piece keeps the hooks line and the calls line byte-identical, `(via contextFill)` included.
- **v1's numbering is reserved.** v1 uses F36 to F63, T42 to T72 and E7 to E11. This form uses B-F, B-T and E12 to E14.

**0.5 Concurrent work.**
- MP-1 in slot 1 is under `engine/`, `kernel/`, `protocol/`, the shell and docs, which is disjoint.
- `kernel-close-races-followups` follows in slot 2.
- The Evidence Recorder is not touched.
- Before dispatch, the custodian confirms that the files `cut/guardian-v1`'s diff touches are the three above.

## §1. May and may not claim

**May claim**, under `claude plugin test` at the build of record, on Windows:
1. With the breakdown carrying a positive finite `autoCompactThreshold`, a finite `totalTokens` and `isAutoCompactEnabled === true`, N1's fill is `(100 × totalTokens) / autoCompactThreshold`, and `percentage` is not read (B-T1). Otherwise the fill is `percentage`, as at v0 (B-T2).
2. One line per 5-point band from 80. Under R-1, bands at and above 95 are one band, so a cycle carries at most four lines (B-T3).
3. N1 nudges when today's judgment is stale, or when the committed `flushed_at` it read is more than 10 minutes before the call (B-T4). It gives none when the block is fresh by today's judgment and flushed within 10 minutes (B-T5).
4. The threshold route's line is §7's threshold text. The fallback route keeps v0's text (B-T1, B-T2; R-2).
5. No line for a subagent's call or a denied call (T30, re-observed).
6. `validate`'s hooks and calls lines are byte-identical to v0 Amendment 8's.
7. T35 and T36 pass unchanged, on Windows and in governance-ci on ubuntu-latest.
- **Live, only after its row:** the threshold figure as the engine computes it in a session (E13); the line reaching the model (E13; v0's E6 never fired); the acceptance (E14).

**May not claim:**
- That a flush happens. N1 asks for it, and the custodian acts.
- That the breakdown's local estimate equals the figure the engine compacts on.
- A nudge before every compaction. N1 fires only on a main-loop tool call, so a band crossed inside a long turn with no later tool call gives no line.
- That the age clause is the PreCompact hook's freshness. It shares only the 10-minute figure and its parse; the tip, porcelain, push and last-ledger-change conditions are not N1's.
- Parity for the age clause. The Stop hook has none, by design (brief §2).
- Ages under clock skew. A `flushed_at` in the future, or one that cannot be parsed, does not trigger the clause (R-3).
- Bands kept across a hot reload. `shownBands` is a module variable.
- Builds other than the build of record; macOS; Linux for the mod itself; cloud sessions.
- That the installed copy is isolated from the folder (v0 E0).
- Any latency figure, and any docs/08 row.
- On the fallback route, that N1 ever fires. If auto-compaction runs below 80% of the compaction window, it never does (brief B1; the README says so).

**Out of scope** (brief §6's last bullet; direction item 5): a snapshot at compaction; any change to the summary's instructions; a mod that blocks or defers a compaction; the auto-compact window's setting; the Stop hook and its predicate; the PreCompact hook; the next step in brief §6. Also every G-rule, `hooks.json`, `plugin.json`, `.gitignore`, the marketplace, the parity test and every file under `scripts/hooks/`.

**Scope limits:** no wire change; no ADR cited as governing or amended; ADR-006 does not apply (repository tooling); no configuration, `userConfig`, option or flag.

**Seams**, each written against the other side's actual interface:
- **N1 to the summary breakdown.** The field names, types and location are those P0 item 1 records at the build of record. The plugin tests answer `session.usage` in exactly that shape, written after Amendment 1 (§8 item 19). The end-to-end proof from the real shape is E13.
- **N1 to `continuity.mjs`.** `judgeContinuity(run)` gains one field on its judged results, `flushedAt`: the committed `flushed_at` at the newest ledger commit, or `null` when no ledger commit exists. Its one product caller is N1's age clause. The plugin tests drive it through the real module, from git's output shape (`gitWorld`). The judgment it returns is unchanged, and T35/T36 prove that.
- **The line to the model:** the `context` field (v0 Amendment 1 (P0b), item (iv)), proven live by E13.
- **The N1 count to its consumer:** the measure's row (piece A's form, §2 item 6, its last bullet), defined in §4.
- **Callers:** nothing lands without a product caller. No export is added.

## §2. The change

2.1 **The fill (B1),** in `contextFill`, which keeps its name and its one `$.session.usage({ breakdown: 'summary' })` call.
- It takes the threshold route when the breakdown's `isAutoCompactEnabled === true`, its `autoCompactThreshold` is a finite number above 0, and its `totalTokens` is a finite number at or above 0. Then p = `(100 * totalTokens) / autoCompactThreshold`, computed in that order.
- Otherwise p is `percentage` when it is finite, as at v0. Otherwise p is absent, and N1 returns `ran`.
- `contextFill` returns p and the route, so that the text can follow the route.

2.2 **The bands (B2).**
- `N1_THRESHOLD` stays 80. `N1_BAND` becomes 5, edited in place on line 23.
- band = `Math.min(Math.floor(p / N1_BAND), N1_TOP_BAND / N1_BAND)`, with `N1_TOP_BAND = 95` (R-1). So the bands are 80, 85, 90 and 95 of the route's denominator; on the threshold route, with a threshold near 770k tokens, that is about 616k, 655k, 693k and 732k.
- `shownBands` clears below 80 on either route, as at v0.

2.3 **Staleness for N1 (B3).**
- N1 nudges when `verdict.judged === true` and either `verdict.stale === true`, or `verdict.flushedAt` parses (`new Date(flushedAt).getTime()`, the PreCompact hook's own parse) to a time more than `N1_MAX_AGE_MS` before `Date.now()`, read at the call.
- `N1_MAX_AGE_MS = 10 * 60 * 1000`, the PreCompact hook's figure.
- A judgment that is not judged gives no line. So does a `flushedAt` that is `null`, unparseable or in the future (R-3).
- **`continuity.mjs`:** each judged result carries `flushedAt`. When no ledger commit exists it is `null`. On every other judged path it is the value parsed at that commit, whatever the parent read gave. Its `judged` and `stale` values, its git calls and its parser are unchanged. Its JSDoc states the new shape. It has no new import, export or `$` call.
- **How the parity test holds the shared judgment, with the age clause beside it.** The age clause lives in N1, outside `continuity.mjs`'s judgment, and reads only the field that `continuity.mjs` parses with the parser it already restates. So the judgment T35 compares is unchanged, and T35/T36 run unchanged on the same thirteen fixtures. Any change that moves the clause into the judgment fails T35. The Stop hook and its predicate are unchanged (brief §2).
- The age reads the committed `flushed_at`, not the working tree's (R-3).

2.4 **The text (B4).**
- On the threshold route the line is `N1_THRESHOLD_TEXT(p)` (§7): percent of the auto-compaction threshold.
- On the fallback route it is v0's `N1_TEXT`, unchanged on line 36 (R-2).

2.5 **Unchanged (B5).** N1 refuses nothing and has no deny and no catch. It is registered first, and its first statement is `next(e)`. It skips subagent calls and denied calls, and makes no new `$` call. `validate`'s hooks and calls lines are unchanged. `PROCESS_TIMEOUT_MS` and N1's git adapter are unchanged.

2.6 **Placement in the files.**
- `register.js`: the header's N1 line (15) and `N1_BAND` (23) are edited in place. Every new declared value (`N1_TOP_BAND`, `N1_MAX_AGE_MS`, `N1_THRESHOLD_TEXT`) and every new line goes in the N1 section, with a comment naming this form's §7.
- `guardian.test.ts`:
  - in place: `World`'s comment and field lines 38-39 gain an optional extra-breakdown map, and `arm`'s breakdown line 62 spreads it;
  - T28 is rewritten whole as B-T3 (name, body and comment);
  - T29's two `flushed_at` values become recent;
  - B-T1, B-T2 and B-T4 are appended at the end of the file, under their own section heading;
  - observation lines are appended under each re-observed mutation.
- `README.md`:
  - line 18 (the N1 row): the threshold route, the 5-point bands, the age clause;
  - line 24 (the N1 paragraph): both routes, the fallback disclosure (N1 may then never fire), the age clause as N1's alone, and the parity sentence kept;
  - line 5 only if the build of record is not 2.1.289.

2.7 **Portability** (R1 to R6, `state/directives/PORTABILITY-2026-09-30.md:31-65 @ 7ce9dab2 sha256:HASH-TBD`).
- **Owning boundary:** none new. The change touches no OS mechanism. `place` stays the mod's one OS-touching function.
- **Windows:** supported. Tested under `claude plugin test`, and live by E12 to E14.
- **macOS and Linux:** the mod is unavailable there, and no claim is made. T35 and T36 run unchanged on ubuntu-latest in governance-ci.
- **R1:** one rule on every platform.
- **R2 and R4:** no platform branch, and no drive letter.
- **R5:** no level claimed.
- **R6:** no platform ignore.

## §3. Fixtures and predicted outcomes

The engine's answers are stubbed with the test's `on`, as v0 §3 does. A stale block means `gitWorld` with c equal to p. `recent(m)` means an ISO time m minutes before the test's start. The threshold route's breakdown carries `autoCompactThreshold: 1000000` and `isAutoCompactEnabled: true`, plus the `totalTokens` shown. All field names are as Amendment 1 records them.

| # | Calls | Predicted |
|---|---|---|
| B-F1 | threshold route, stale: `totalTokens` 790000 with `percentage` 95; then `totalTokens` 800000 with `percentage` 10 | no line; then one line, the threshold text at 80 |
| B-F2 | stale: `isAutoCompactEnabled` false, threshold 1000000, `totalTokens` 100000, `percentage` 85; then `percentage` 10; then `percentage` 85 with no threshold fields | v0's text at 85; no line; v0's text at 85 |
| B-F3 | threshold route, stale, after a call at 10: `totalTokens` 800000, 840000, 850000, 899000, 900000, 950000, 990000, 1010000 | lines at 80, 85, 90 and 95 only |
| B-F4 | fallback 85: c = recent(11), p = FLUSH_A (a flush-only commit); after a call at 10, c = p = recent(2); after a call at 10, c = `not-a-time`, p = `other` | a line; a line; no line |
| B-F5 (T29) | fallback 85: c = recent(2), p = FLUSH_A; then p absent | no line; no line |
| T30 | as at v0 | as at v0 |

## §4. Tests, one mutation each

- **How a mutation is observed** (round 25, item 2 (c)): apply it, run `claude plugin test tools/mods/spatial-guardian`, record the failing test by name in its `// RECORDED MUTATION:` comment with the commit and `claude --version`, then revert. A `verify-mutation` run is not an observation. At its commit, the worker states whether verify-mutation's scan covers `tools/mods/**/*.test.ts`.

| # | Test | Fixture | Mutation |
|---|---|---|---|
| B-T1 | `N1 measures the fill against the auto-compaction threshold when the breakdown carries it and auto-compaction is on` | B-F1 | M1a: the threshold route dropped, so p is always `percentage`. M1b: v0's text used on the threshold route |
| B-T2 | `N1 falls back to the breakdown percentage when auto-compaction is off or the threshold is absent` | B-F2 | M2: the `isAutoCompactEnabled === true` condition dropped |
| B-T3 (T28 rewritten) | `N1 appends at most one line per 5-point band, from 80 to 95 percent` | B-F3 | M3a: `shownBands.add(band)` dropped (v0 T28's mutation). M3b: `N1_BAND = 10`. M3c (under R-1): the top-band bound dropped |
| B-T4 | `N1 judges a block stale when its flushed_at is more than 10 minutes old, and never on an unparseable one` | B-F4 | M4a: the age clause dropped. M4b: the clause joined to the judgment by AND |
| B-T5 (T29, its name unchanged) | `N1 appends nothing on a fresh block` | B-F5 | v0's mutation, re-observed. M5a: `N1_MAX_AGE_MS = 0`. M5b: `continuity.mjs` returning the first parent's `flushed_at` as `flushedAt` |
| T30 (unchanged) | `N1 appends nothing for a subagent call or a refused call` | as v0 | v0's mutation, re-observed |

- T26, T27, T31 and T32 are unchanged. Their v0 mutations are re-observed at the observation commit, because the code around them changes.
- Existing observation lines are never edited; new ones are appended beneath. T28's comment is the one exception: it is replaced along with the test it describes.
- T35 and T36 are unchanged and not re-observed by the worker. The reviewer runs them (§9).

**The measure's N1 column** (piece A's form, §2 item 6, its last bullet; brief §5).
- From E12's live point, each row of an automatic compaction gives that cycle's N1 nudges.
- The cycle runs from the latest of these to the boundary: the session's previous boundary, the live point, or the session's start.
- For each nudge, the row gives its tool-result time, the integer percent, and which text it carried.
- The count is 0 when there were none.

**E-rows, live, after the merge and the human's reload.** Each runs only if his typed approval names it. The custodian records each as a class 1 row on main. No probe is forced: a context is never filled on purpose.
- **E12 — the live point:**
  - `claude --version`;
  - `claude plugin list`'s entry for the mod, byte-copied by script;
  - the main checkout's `HEAD` containing the merge, with its reflog time;
  - the reload's time, by the transcript.
- **E13 — the first natural nudge,** from the transcript:
  - the time of the tool result it followed;
  - the line, byte-copied by script and marked. If the transcript does not hold `context` text, the row says so, and the custodian's own sighting is recorded with that time, labelled as the model's report;
  - the route, read from the text, and the fill;
  - the block's state: the newest ledger commit, its `flushed_at` and that value's age;
  - the flush that followed (its commit and time), or none.
  - **Predicted:** the threshold text, at a fill of 80 or more, on a block stale by §2.3.
  - It replaces v0's E6 for N1, and the closing record says so.
- **E14 — acceptance:** for each of the next three automatic compactions after E12, the N1 column above. A cycle with none also gives, for each band, the first main-loop tool call that reaches it (from the transcript's usage against Amendment 1's threshold) and the block's state there.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- B-T1 to B-T5 and T26, T27 and T30 to T32 pass at the head, and each fails under its mutations. Every other v0 plugin test passes unchanged. T35 and T36 pass unchanged.
- `validate`, on `tools/mods/spatial-guardian` and on `tools/mods`, text and `--json`, prints hooks and calls lines byte-identical to v0 Amendment 8's.
- **P0:**
  - the three fields are declared (the brief's 2.1.289 read);
  - the threshold lies at or below each compaction's token count (770,191 and 775,563 on record);
  - today's route reads 77 to 78 at those compactions;
  - B1's route reads 95 or more at the last tool call before each;
  - at least one band would have nudged before each.
  - A different result is recorded in Amendment 1. Only I1 and I4 stop.
- **E13:** as §4 predicts. **E14:** at least one nudge precedes each of the three compactions.

**Declared unchanged:**
- every path outside §7's four files, and in particular:
  - `hooks.json`, `plugin.json`, `.gitignore` and the marketplace;
  - every file under `scripts/hooks/`, the parity test included;
  - `.claude/`, `AUTONOMY.md` and `AI_DEVELOPMENT.md`;
  - the v0 and v1 forms, and piece A's form;
- `register.js` lines 1-419 other than lines 15 and 23;
- `register()`; N1's registration and its position;
- `PROCESS_TIMEOUT_MS`, `N1_THRESHOLD`, `N1_TEXT`, and N1's git adapter;
- `judgeContinuity`'s judgment and its git calls.

**Invalidators** (stop, to the custodian, unless another route is named):
- **I1:** P0 item 1's stop, to the human with P0's figures.
- **I2:** a run of record at a build other than Amendment 1's. Every plugin test and `validate` is re-run, and the change is recorded.
- **I3:** a `validate` line differs from v0 Amendment 8's. A difference confined to a `(via …)` annotation is class 2.
- **I4:** P0 item 3's stop, to the human (R-4).
- **I5:** `claude plugin test` refuses to run (the rollout switch). No agent clears it; that is the human's.
- **I6:** T35 or T36 cannot pass unchanged, or the change needs an edit under `scripts/hooks/`, a new export, or a new `$` call.
- **I7:** any step would install, enable, load or reload a mod, add a marketplace, start a session, write under the user's Claude folder, or write into the main checkout's `tools/mods/spatial-guardian/` or `tools/mods/.claude-plugin/`.
- **I8:** §7's file count is exceeded.
- **I9:** a v0 test other than T28 and T29 needs a change to an assertion or a fixture.
- **I10 (live; stop, and tell the human; brief §6):**
  - N1 nudges in a subagent's transcript;
  - N1 nudges twice in one band within a cycle. The row also notes any reload in that cycle, and the stop still fires;
  - the PreCompact hook blocks an automatic compaction;
  - the resume hook throws;
  - after E12, a nudge carries v0's text while Amendment 1 found the fields declared. That would mean the run is not following the folder (v0 E0), and install is the human's.
- **I11 (live; to the human):** a cycle in E14 with no nudge, with that cycle's figures (brief §6).

**Falsification:**
- a line below 80 of the route's denominator;
- two lines in one band;
- a line on a subagent call or a denied call;
- a line on a block that is fresh by the judgment and flushed within 10 minutes;
- no line on a block stale by §2.3 at an unshown band;
- the threshold route taken without `isAutoCompactEnabled === true`;
- a text other than §7's.

## §6. Instruments

Assertions only:
- deny or `next(e)`; the `context` array and its text; stub arguments and call counts;
- `validate`'s lines; `claude --version`, `node --version` and `git --version`;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with its commit (round 15 (c)).
- P0's reads are of declarations, settings, the environment and transcripts. They are evidence, and none is an observation of the mod.

## §7. Declared values and ceilings

- `N1_THRESHOLD = 80` (unchanged); `N1_BAND = 5`; `N1_TOP_BAND = 95` (R-1); `N1_MAX_AGE_MS = 10 * 60 * 1000`.
- The threshold route's text, the form's own wording, for the human's sight before his approval: `` `Context at ${Math.round(p)}% of the auto-compaction threshold: flush the continuity block now (rewrite, commit, push), then continue.` ``
- The fallback route's text is v0's `N1_TEXT`, unchanged (`tools/mods/spatial-guardian/hooks/register.js:36 @ 7ce9dab2 sha256:HASH-TBD`).
- The threshold route's fields are exactly Amendment 1's three names.
- **Size:** at most 350 changed lines (insertions plus deletions) over at most 4 files:
  - the files: `tools/mods/spatial-guardian/hooks/register.js`, `tools/mods/spatial-guardian/hooks/continuity.mjs`, `tools/mods/spatial-guardian/test/guardian.test.ts` and `tools/mods/spatial-guardian/README.md`;
  - the counting command: `git diff --numstat <base>..<head> -- . ':!tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base on main, named by id, and `<head>` is a named commit;
  - the estimate: 40, 12, 220, 15;
  - an overrun is class 8 (round 25, item 2 (a)), and this line is never edited.
- **Minutes:** the node's `budget_minutes`, 240.

## §8. Block-on-sight

1. A new `$` call; `contextFill`'s name, or its one usage call, changed; a hooks or calls line changed.
2. N1 with a deny, a catch or a `.catch`; its registration or its first-place position changed; `next(` called with anything but the received event.
3. `percentage` read on the threshold route; the threshold route taken without `isAutoCompactEnabled === true`.
4. A second staleness predicate; a change to `continuity.mjs`'s `judged` or `stale` results, its git calls or its parser; an import, a `$` call or a second export there.
5. The age read from anything but the returned `flushedAt`; a working-tree read; any time source but `Date.now()` at the call.
6. In `register.js`, a line inserted or removed above line 420 (at 7ce9dab2), or any edit there other than lines 15 and 23 in place. In `guardian.test.ts`, a line inserted or removed above T28 (line 642 at 7ce9dab2), or an edit there other than lines 38, 39 and 62 in place.
7. A v0 test body changed other than T28 (rewritten as B-T3) and T29's two timestamps; an existing observation line edited, T28's comment excepted.
8. A file outside §7's four, apart from this form and the custodian's generated set; any edit under `scripts/hooks/` or `.claude/`, or to `AUTONOMY.md` or any filed form.
9. Any install, enable, reload, marketplace change, `--plugin-dir` session or `claude` session start by an agent; any write under the user's Claude folder; before the merge, any write into the main checkout's `tools/mods/spatial-guardian/` or `tools/mods/.claude-plugin/`; a `claude` subcommand other than §0.3's.
10. A forced N1 probe; a live G1 probe; any G1-shaped call made on purpose.
11. A user-profile path in any file, test, record or commit message.
12. A test without its `RECORDED MUTATION`; a record that calls a `verify-mutation` run an observation of a mutation; a mutation recorded without its observation commit.
13. A §7 overrun not recorded as class 8, or §7's line edited to match; any code of a scope addition before the class 9 amendment that declares it.
14. A test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.
15. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a bare self-line;
    - a pin read as current;
    - a tool claim without the tool's commit;
    - a correction round without its superseded index;
    - an amendment numbered before Amendment 1 (P0).
16. A squash or rebase merge, or any force-push.
17. A nudge text other than §7's two, or one stating another module's consequence (round 7).
18. A five-line form for this piece.
19. Any code before Amendment 1 is committed, or after I1 or I4 fires; a test stub whose breakdown fields are not Amendment 1's names.

## §9. Gates

**Proportional gates, by reference:** the product-first direction, section 2 (`state/directives/2026-10-05-product-first-direction.md:15 @ 7ce9dab2 sha256:HASH-TBD`), now `AUTONOMY.md` §22 as amended by #180 (`AUTONOMY.md:389 @ 7ce9dab2 sha256:HASH-TBD`). A gate fails only on Correctness or Evidence. Documentation and record findings are fixed in this pull request before the merge, checked by the custodian against each finding, and listed in the closing record. The three exceptions in that section stand. The record cap stays.
- **Dispatch:**
  - after this form's commit, the custodian sets the node's `gate` to this form. The node already carries `merge: merge-commit`;
  - the branch is `cut/guardian-n1-before-auto-compaction`, with a worktree under `C:\dev\wt\` and never the main checkout's folder;
  - the worker's first step is P0, read-only, and then it stops;
  - the custodian records Amendment 1 and bumps the node's generation (AUTONOMY §15); then the build;
  - record text is written with the Write tool, never in a command that also holds the word push (v0 README, G1's over-refusals).
- **Architect:**
  - the Gating heads;
  - brief §2 and §4 (B1 to B5) against §2;
  - the direction's items 3 and 5;
  - round 44, item 1, as item 3 changes it: T35/T36 unchanged, and the age clause outside the judgment;
  - Amendment 1 against I1 and I4;
  - the seams and the caller rule (§1);
  - §0.4 against the code (§8 item 6);
  - round 7 on §7's texts;
  - R1 to R6;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - on the custodian's machine, with `claude --version`: `claude plugin test`, and `validate` on both targets, text and `--json`;
  - every mutation in §4 observed at the gated head;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` on Windows, with T35 and T36 named in its output;
  - §7 recounted;
  - §8 items 1 to 7, checked by reading and by the diff's hunk headers.
- **Suites, green before either gate:** the node suites above; governance-ci on the branch, read before gating; §6's tools.
- **PR body:**
  - this form, and Amendment 1 by reference;
  - both `validate` outputs, text and `--json`;
  - the plugin test output with its version;
  - a request for a merge commit (round 25, item 2 (d)).
- **Operator and merge:**
  1. The human sights §7's texts and the README's N1 lines.
  2. He gives his typed merge approval after both gates, naming which of E12 to E14 he allows, and clicks (a merge commit).
  3. The custodian fast-forwards the main checkout and edits nothing in the folder.
  4. **The human runs `/reload-plugins` in the custodian's session, or restarts it. The custodian never reloads.** No install or uninstall is needed, because Guardian is installed by reference. A later session start also loads the merged code.
  5. The custodian records E12, then E13 and E14 as they fall.
  6. If E13 shows v0's text on the threshold route, I10 fires, and reinstalling or updating is the human's.
- **Done:** PLAN marks the node done at the merge. E13 and E14 stay open, as piece A's E1 did.

## §10. Amendments — opens empty, append-only (classes 1 to 9; each correction round ends with a superseded index). Amendment 1 is P0's record (§0.3); nothing precedes it.
````

## 3. OPEN items

**There are no OPEN items.** Four readings are drafted in full. The human may overturn any of them before the build. None is a red line, and no code waits on them unless he overturns one:
- **R-1, the top band.** Fills at and above 95 count as one band, so B2's at-most-four-nudges holds even if p reaches 100 or more before the compaction fires. The breakdown is a local estimate, so that can happen.
  - Option (a), recommended: the bound.
  - Option (b): no bound, and the four-nudge claim is limited to fills below 100.
  - What waits: M3c and one line in `nudge`.
- **R-2, the fallback text.** The fallback route keeps v0's text, because saying percent of the threshold there would state a false fact (round 7).
  - Option (a), recommended: split by route.
  - Option (b): the threshold text on both routes.
- **R-3, the source of the age.** The age is the committed `flushed_at` at the newest ledger commit, which `continuity.mjs` already parses. This adds no `$` call (brief §2), and the nudge asks for a commit. A value that cannot be parsed, or one in the future, does not trigger the clause.
  - Option (a), recommended: the committed value.
  - Option (b): read the working tree. That adds a `$.fs.read` and breaks B5, so it is rejected.
- **R-4, my addition to the stops: I4.** If P0 shows B1's fill below 80 before any past compaction, B1 could not have fired there, so the piece stops and returns to the human.
  - Option (a), recommended: keep I4.
  - Option (b): drop it, and P0 item 3 becomes evidence only.

**Three facts for the custodian:**
1. I could not read `cut/guardian-v1` at 5a9eb051, because I have no shell. §0.4 relies on v1's form and the ledger, and the custodian confirms the branch's file list before dispatch.
2. The parity test is not edited, by design (§2.3). This keeps piece A's §0 statement true: piece B edits only `tools/mods/`.
3. P0's types read may run into the same gap v1's P0 did: there is no plugin-authoring folder at 2.1.289. The draft names the binary's embedded text as the first source, as piece A's P0 used. If nothing can be read at the build, that is I1's stop.

## 4. Files read

- C:\dev\spatial-ide\state\directives\CONTEXT-FLUSH-2026-10-05.md
- C:\dev\spatial-ide\state\directives\2026-10-05-human-direction-context-flush.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-fragments.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-clarification.md
- C:\dev\spatial-ide\state\directives\2026-10-03-guardian-o3-o8-ruling.md
- C:\dev\spatial-ide\state\directives\MODS-GUARDIAN-V0-2026-10-03.md
- C:\dev\spatial-ide\state\directives\MODS-V1-2026-10-05.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md (lines 25-69)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\README.md
- C:\dev\spatial-ide\tools\mods\spatial-guardian\hooks\register.js
- C:\dev\spatial-ide\tools\mods\spatial-guardian\hooks\continuity.mjs
- C:\dev\spatial-ide\tools\mods\spatial-guardian\hooks\hooks.json
- C:\dev\spatial-ide\tools\mods\spatial-guardian\test\guardian.test.ts
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V0-PREREGISTRATION.md (whole, Amendments 1-10)
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V1-PREREGISTRATION.md (lines 1-200, 463-672, 1151-1306, plus grep for N1/N2)
- C:\dev\spatial-ide\scripts\hooks\guardian-continuity-parity.test.mjs
- C:\dev\spatial-ide\scripts\hooks\precompact-flush.mjs (lines 1-130, plus grep)
- C:\dev\spatial-ide\scripts\hooks\stop-queue.mjs (lines 218-247, plus grep)
- C:\dev\spatial-ide\scripts\hooks\COMPACTION-RECORD-AND-RESUME-LINE-PREREGISTRATION.md (whole)
- C:\dev\spatial-ide\AUTONOMY.md (§7 at 176-188; §21-§22 at 306-391; §25-§30 at 476-528)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (lines 95-178, Round 25 additions included)
- C:\dev\spatial-ide\PLAN.yaml (lines 4110-4159)
- C:\dev\spatial-ide\state\CUT-STATE.md (lines 1-12, 3233-3352, plus grep)
- C:\dev\spatial-ide\state\drafts\weekly-window-2026-10-09.md (lines 12-26, 384-423, 485-554)
- Not read: the branch `cut/guardian-v1` at 5a9eb051, because I have no shell for `git show`.
