Reviewed: cut/subagent-compaction-hooks at 66fb4c2b51e540a5aec73529ee65d940959cd95d (the custodian's filing note, 2026-11-22: PR 349's single gate, attempt 1 (ADV-2026-11-22-01 item 4); Bash 23, Read 2, SubagentHandback 1, by unique call ids; 1 errored (a grep that matched nothing, its output read), model claude-opus-5-5, from 2026-11-22T04:49:49Z to 2026-11-22T04:56:40Z by its transcript; the report below byte for byte from its hand-back of 13023 bytes, sha256 c853bc989746889cf3fbb5a21b51e6b7acaa899dc6ad07b8acf888eb605e060a), gate, reviewer
Verdict: PASS WITH NOTES, cut/subagent-compaction-hooks @ 66fb4c2b51e540a5aec73529ee65d940959cd95d.

Reviewer model: Claude Opus 5.5 (claude-opus-5-5).

## Verdict summary

Nothing blocks under Correctness or Evidence. Before the merge, three Documentation findings need fixing (D1 to D3 below). D3 is the README, which sits outside this piece's Scope, so it goes to the human as a draft; it cannot be edited in this PR.

## Preflight

- **Brief:** read whole; sha256 7181f047…2887 and 5605 bytes, both as stated.
- **Worktree:** `C:/dev/wt/subagent-compact`. Branch `cut/subagent-compaction-hooks`, HEAD 66fb4c2b51e540a5aec73529ee65d940959cd95d, porcelain empty.
- **Remote:** `git ls-remote` shows the same head. PR 349 `headRefOid` is the same; the PR is a draft.
- **Merge base:** with eb47ee33 it is eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7.
- **Reflog:** `662ea259 HEAD@{5}`, then `reset: moving to HEAD`, then `merge origin/main: Fast-forward` to eb47ee33, then T 4407e33f, S f77c3fa9, M 66fb4c2b. This matches the brief.
- **Version:** `claude --version` gives `2.1.330 (Claude Code)`.
- **Line endings:** `git ls-files --eol` on precompact-flush.mjs gives `i/lf w/lf attr/text=auto eol=lf`.
- **CI on PR 349:** all eight checks pass.

## Clause table (against directive line 28 and the form's Change line; cites at 66fb4c2b)

| Clause | Where the diff meets it | Result |
|---|---|---|
| session-resume with agent_id: no output, exit 0 | `scripts/hooks/session-resume.mjs:138`. This runs after the stdin parse and before `buildOutput`. Test (1) is at `hooks.test.mjs:1608`. | Holds |
| precompact-flush with agent_id: allows, exit 0 | `precompact-flush.mjs:228-247` returns `decision: 'allow'`. `main` at `:318-325` then exits 0. Test (3) is at `:1634` and covers both auto and manual. | Holds |
| calls no checkFreshness | The branch at `:228` returns before the first `checkFreshness` call at `:250`. The second call is at `:276`. | Holds, by code. No test asserts it (N2). |
| neither reads nor writes `.claude/state/precompact-<sid>.json` | `statePath`/`readJson` (`:262-263`) and `writeJson` (`:282`) are only reachable after the branch. Test (3) asserts the file is absent after both auto and manual. | Holds. The "reads" half is shown by code only (N2). |
| exactly one record line, decision allowed-subagent, agent_type (null when absent), flushed_at null | `:231-242`: one `appendFileSync` call, `decision: 'allowed-subagent'`, `flushed_at: null` (no `readFlushedAt`), and `agent_type` set to the input's value when it is a string, else `null`. Test (3) checks that the line count grows by one per call, and checks the decision, the agent_type and that flushed_at is null. | Holds. The null case is not tested (N3). |
| judges or changes nothing of the custodian's freshness or block state | No ledger read and no `.json` access on this path. The only write is the append the form permits to the `.jsonl` record log. | Holds |
| one diagnostic line naming the agent type | The record line at `:231-238`. stderr also gets one allow line (`:246`), which exits 0. | Holds |
| without agent_id: unchanged in output, exit code and writes | The diff only adds lines: a guarded early exit or return, then the old code untouched (numstat deletions are 0). Test (2) at `:1619` and test (4) at `:1653` cover this, and all 74 earlier tests in the file still pass. | Holds |
| does anything read the `.jsonl` log and judge from it | Searched the whole tree (`git grep`) for `precompact-`, `.jsonl`, `'.claude', 'state'` and `.claude/state` in `*.mjs/*.js/*.ts/*.json`, outside the test files. The only code that touches `precompact-<sid>.jsonl` is the writer (`precompact-flush.mjs:186-187`, `:211`, `:239`). Nothing in `tools/mods/` refers to it; `continuity.mjs:6` cites the file only for `parseSessionContinuity`. The tests that read the log are in `hooks.test.mjs`. | Confirmed: only tests read it |

## Scope

- `git diff --numstat eb47ee33...66fb4c2b` gives:
  - `92 0 scripts/hooks/hooks.test.mjs`
  - `21 0 scripts/hooks/precompact-flush.mjs`
  - `1 0 scripts/hooks/session-resume.mjs`
- That is three files and 114 lines, within the 140 budget.
- Nothing on the block-on-sight list is touched: no settings file, no other hook, no flush.mjs, cloud.mjs or cloud.test.mjs, no Guardian or mod, no dependency or lockfile.

## Tests

**At T (4407e33f, detached), `node --test scripts/hooks/hooks.test.mjs`: rc=1, pass 76, fail 2.**
- Test (1) is red for the intended reason. The deepStrictEqual diff shows `stdout` holding the reading order, the block and the `Resume facts:` line, where `''` was expected.
- Test (3) is red for the intended reason, on its auto pass: `AssertionError [ERR_ASSERTION]: auto: the decision`, `'recorded-only'` against `'allowed-subagent'`.
- Tests (2) and (4) are green.

**At 66fb4c2b:**
- The same file: rc=0, tests 78, pass 78, fail 0.
- The whole CI command `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc=0, tests 615, pass 615, fail 0, cancelled 0, skipped 0.

**Test isolation.** Every new test:
- calls `runEntry` (`:1598`), which spawns `process.execPath` on `path.join(here, script)` (the real entry point) with the input on stdin;
- runs with `subagentEnv(dir)` (`:1579`), which sets `CLAUDE_PROJECT_DIR` to `dir`;
- gets `dir` from `makeTempDir`, which is `fs.mkdtempSync(path.join(os.tmpdir(), prefix))` (`:27-28`), so never the main checkout;
- runs with the cloud markers deleted, the same list as cloud.test.mjs `localEnv`;
- removes its temporary folder in `finally`.

I never ran either hook against `C:/dev/spatial-ide`.

## Mutations (observed by me, each made with one anchored sed, then `git checkout -- <file>`)

**m1.** `sed -i '/^  if (input?\.agent_id) process\.exit(0);/d' scripts/hooks/session-resume.mjs` deleted exactly the line at `:138`.
- Result: rc=1, pass 77, fail 1. The failing test is `subagent compaction: session-resume with agent_id prints nothing and exits 0`, with `AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:` and stdout holding the reading order.
- The recorded comment at `:1607` matches this.
- Restored; porcelain `[]`.

**m2.** `sed -i 's/^  if (input\.agent_id) {$/  if (false \&\& input.agent_id) {/' scripts/hooks/precompact-flush.mjs`.
- Result: rc=1, pass 77, fail 1. The failing test is `subagent compaction: precompact-flush with agent_id allows, writes no block record and logs one allowed-subagent line`, with `AssertionError [ERR_ASSERTION]: auto: the decision`, `'recorded-only'` against `'allowed-subagent'`.
- The recorded comment at `:1633` matches this.
- Restored; porcelain `[]`.

**m2b (extra, beyond the brief).** I added this one because at T and under m2 the manual half of test (3) never runs. The guard became `if (input.agent_id && input.trigger !== 'manual') {`.
- Result: rc=1, fail 1, the same test (3), now on `manual: block: flushed_at is more than 10 minutes old` followed by the BLOCK_REASON text.
- So the manual half does catch a path that blocks.
- Restored; porcelain `[]`.

**Final state:** branch `cut/subagent-compaction-hooks`, HEAD 66fb4c2b51e540a5aec73529ee65d940959cd95d, porcelain empty.

## Live unverified, and the changelog cite

- **Live unverified.** The form's Tests+mutation line and §B both say "live unverified" and that no real subagent compaction has been seen. So do the PR body ("**Live unverified.** … A real subagent compaction has not been seen.") and the S commit message. Nothing claims that a real subagent compaction was observed, and nothing claims when the hooks first fired.
- **Changelog cite.** I used the copy at `<S>/cc-changelog.md` (sha256 5469fbb7…9032, 11661 lines).
  - Line 1116 is `## 2.1.323`.
  - Line 1257 is ``- Fixed `PreCompact`, `PostCompact` and post-compaction `SessionStart` hooks not receiving `agent_id` and `agent_type` when a subagent compacts``.
  - No `## ` heading falls between them.
  - The form's §A paraphrase, which is marked as a paraphrase, is supported.
  - The running version, 2.1.330, matches. I cannot tell from here whether my reading came after the human's restart, which the directive asks to be confirmed (line 29).

## Findings by class

### Correctness
None.

### Evidence
None.

### Documentation (each must be fixed before the merge; none is the human's wording)

**D1. The header comment of `scripts/hooks/precompact-flush.mjs` (lines 4-12) is now incomplete.** It is in Scope. It says every non-manual call is "judged for freshness" and lists the five record fields, but the subagent branch skips the judgment and writes a sixth field.
- Replacement words: insert after line 10, before the `// Every call that reaches…` line:
  `//   - an input that carries agent_id (a subagent's compaction): allowed before the freshness and block checks; checkFreshness is not called, the block record above is neither read nor written, and the record line carries decision allowed-subagent, flushed_at null and a sixth field, agent_type (a string as received, else null).`
- Clause check:
  - "before the freshness and block checks" holds: `:228` comes before `:250`, `:262` and `:276`. I did not write "first", because the cloud guard (`:329`) and the stdin parse (`:301`) come earlier.
  - "checkFreshness is not called" holds: the return at `:246` comes before `:250`.
  - "neither read nor written" holds: `:262-263` and `:282` are unreachable from the branch.
  - "allowed-subagent, flushed_at null" holds at `:234` and `:236`.
  - "agent_type, a string as received, else null" holds at `:237`.

**D2. The form's Tests+mutation line says "Each new test is shown red before the script change".** Tests (2) and (4) pin the parent behaviour and are green at T. That is right for regression pins, and the T commit message says so, but the form overstates it. The form is append-only, so correct it by an appended amendment.
- Replacement words: `Tests (1) and (3) were shown red at 4407e33f for the intended reason and green at 66fb4c2b; tests (2) and (4) pin the parent behaviour and are green at both.`
- Clause check: both halves hold, as the T run above and the head run show.

**D3. `scripts/hooks/README.md` is stale.** The PreCompact "The record" paragraph lists four decision values and five fields. The SessionStart section does not mention agent_id. The README is outside the 3-file Scope, and the human's line 28 says anything beyond the two scripts and their tests goes to them as a draft. So it cannot be fixed in this PR without the human's approval. The closing amendment must name it, and the custodian files these words as the draft.
- Words, sentence 1: after "`flushed_at` (the ledger block's value, else `null`)." add `A call whose input carries agent_id (a subagent's compaction) is allowed without a freshness judgment or the block record; its line carries decision allowed-subagent, reason and flushed_at null, and a sixth field, agent_type (a string as received, else null).`
- Words, sentence 2: in the SessionStart section, add `With agent_id in its input it prints nothing and exits 0.`
- Clause check: the same lines as D1, plus `session-resume.mjs:138`.

### Notes (none blocks)

- **N1. The template literal at `precompact-flush.mjs:241-242`.** The newline is written as a literal line break, where `appendRecord` at `:213` writes `\n`. The bytes are correct either way: `.gitattributes` forces `eol=lf` on checkout (I checked `w/lf`), and ECMAScript turns CR LF into LF inside template literals anyway. Use `\n` for readability and to match `:213`. The append-failure path also calls `console.error` directly, where `appendRecord` returns a note joined by `withNote`. The behaviour is the same (one stderr line), but the shape differs.
- **N2. Two clauses rest on code reading only.** No test seeds a recent `precompact-<sid>.json` and checks that a subagent call leaves it unconsumed and byte-unchanged. No test catches a `checkFreshness` call inside the branch. Both clauses hold as written, so this is a test gap only.
- **N3. The null case of agent_type is not tested.** No test sends agent_id without agent_type; the code handles it at `:237`.
- **N4. The mutation comments are worded ambiguously.** At `:1607` and `:1633` they say "at the commit that adds this line's parent". Read literally, they mean the mutation ran at f77c3fa9 (M's parent). Plainer words would be: `RECORDED MUTATION (run at f77c3fa9, before this comment was added): …`. Only add the commit id if the merge keeps the branch commits.
- **N5. Subagent lines land in the parent's record log.** A subagent compaction's line goes to `precompact-<session_id>.jsonl` for whatever session_id the harness passes, which is probably the parent's. Nothing reads that log to make a decision (see the table), so the parent's decisions are unaffected. Worth one line in the README draft if the human wants it.

Scratch files, all in `<S>`: `schrev-T.log`, `schrev-M.log`, `schrev-CI.log`, `schrev-m1.log`, `schrev-m2.log`, `schrev-m2b.log`.

*Appended by the custodian, 2026-11-22: the reviewer's note on the correction commit, under ADV-2026-11-22-05 item 2. It is not a new attempt of the gate, and the report above is carried forward. Its run: Bash 13, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-22T05:47:37Z to 2026-11-22T05:49:21Z by its transcript. Below, byte for byte from its hand-back of 6700 bytes, sha256 9aa555699ce6b1e6e42e0f06ff162240ef2d0c1f394c7540e3205975cfb9e24a, except one profile path masked as <S>. Read by the custodian after it: C:/dev/wt/subagent-compact at fdd1f545f0334fb6fbde9ede82a5da0cdd74219c, the porcelain empty.*

## Note on the correction commit fdd1f545f0334fb6fbde9ede82a5da0cdd74219c (the reviewer, 2026-11-22; ADV-2026-11-22-05 item 2)

Verdict: the correction holds. I read cut/subagent-compaction-hooks @ fdd1f545f0334fb6fbde9ede82a5da0cdd74219c in the worktree C:/dev/wt/subagent-compact. `git rev-parse HEAD` printed `fdd1f545f0334fb6fbde9ede82a5da0cdd74219c` at the start and again at the end. `git status --porcelain` printed nothing at the start and nothing at the end. `git log --oneline 66fb4c2b..fdd1f545` shows one commit, fdd1f545. `git diff 66fb4c2b fdd1f545 --stat` printed `2 files changed, 4 insertions(+), 4 deletions(-)` (scripts/hooks/hooks.test.mjs and scripts/hooks/precompact-flush.mjs). The diff has three comment lines (one D1 insertion and two N4 rewrites) and one code line (N1).

### Check 1: the literal's value is unchanged

- **Line endings.** `git check-attr -a scripts/hooks/precompact-flush.mjs` printed `text: auto` and `eol: lf`. These come from `.gitattributes` line `* text=auto eol=lf`. `git ls-files --eol` printed `i/lf    w/lf    attr/text=auto eol=lf` for the file.
- **CR bytes.** I counted CR bytes with `tr -cd '\r' | wc -c`. It printed `CR bytes in blob 66fb4c2b: 0`, `CR bytes in blob fdd1f545: 0` and `CR bytes in worktree file: 0`.
- **The bytes of the line.** `git show <c>:scripts/hooks/precompact-flush.mjs | grep -n -A1 'appendFileSync(p, \`' | od -c` shows:
  - At 66fb4c2b, line 241 ends `` ` $ { l i n e } \n `` with a real LF byte, and line 242 is `` ` , ' u t f 8 ' ) ; ``.
  - At fdd1f545, line 242 holds `` ` $ { l i n e } \ n ` , ' u t f 8 ' ) ; `` on one line. That is a backslash followed by `n`.
- **The value of the literal.** The script `scratchpad/evlit.mjs` takes the literal's source from each blob with `git show`, starting after the `allowed-subagent` anchor. It evaluates the literal with `new Function('line', 'return ' + lit)('LINE')`. It printed:
  - `66fb4c2b literal source bytes: "\`${line}\n\`" value: "LINE\n" hex: 4c494e450a`
  - `fdd1f545 literal source bytes: "\`${line}\\n\`" value: "LINE\n" hex: 4c494e450a`
  - `equal: true`
  - Both values are the line followed by one LF (0a) and no CR.
- **A CR LF checkout.** I fed a raw CR LF inside a template literal through the same route. It printed `CRLF raw evaluates to: "LINE\n"`. So the old form would also have given one LF even with a CR present. There was none.

### Check 2: test (3) fails if the newline is lost

- **The mutation.** The script `scratchpad/mut.cjs` uses the anchor `"\n      fs.appendFileSync(p, \`${line}\\n\`, 'utf8');\n"`. That is the six-space indent, so it excludes the four-space `appendRecord` line at `:214`. The script counts the matches, exits 1 unless there is exactly 1, and then drops the `\n`. It printed `matches: 1` and `rc=0`. `git diff` showed only `-      fs.appendFileSync(p, \`${line}\n\`, 'utf8');` / `+      fs.appendFileSync(p, \`${line}\`, 'utf8');` at `@@ -239,7 +239,7 @@`.
  - A first attempt with an inline `node -e` printed `matches: 0` and `rc=1`, because shell escaping lost the backslash. It changed nothing and the file was unmodified. I then used the script file instead.
- **The run under the mutation.** I ran `node --test --test-name-pattern="subagent compaction: precompact-flush with agent_id allows, writes no block record and logs one allowed-subagent line" scripts/hooks/hooks.test.mjs` from the worktree root. It gave `rc=1`, `ℹ tests 1`, `ℹ pass 0` and `ℹ fail 1`, with:
  - `SyntaxError: Unexpected non-whitespace character after JSON at position 134 (line 1 column 135)`
  - `at subagentRecordLines (file:///C:/dev/wt/subagent-compact/scripts/hooks/hooks.test.mjs:1604:84)`
  - `at TestContext.<anonymous> (file:///C:/dev/wt/subagent-compact/scripts/hooks/hooks.test.mjs:1642:21)`
- **Why it fails, in paraphrase.** The test makes two calls, `auto` then `manual`. Without the LF, the second record is appended onto the first line. `subagentRecordLines` splits the file on `\n` and calls `JSON.parse`, which throws on the joined line. So the test fails for the intended reason, records run together. The failure shows as a parse error, not as an `assert` message. With a single call the mutation would not be caught; the loop of two calls is what catches it.
- **The restore.** I ran `git -C C:/dev/wt/subagent-compact checkout -- scripts/hooks/precompact-flush.mjs`. It printed `restored; porcelain: []`.
- **The run after the restore.** The same command gave `rc=0`, `✔ subagent compaction: precompact-flush with agent_id allows, writes no block record and logs one allowed-subagent line (158.6416ms)`, `ℹ pass 1` and `ℹ fail 0`.

### Check 3: the three comment lines are my words

The script `scratchpad/cmp.cjs` takes my words from `state/consults/gates/2026-11-22-subagent-compaction-hooks-gate-reviewer.md` in the main checkout. The D1 words are the backticked "Replacement words" span. The N4 words are the backticked span after "Plainer words would be:". It compares those words with the lines `git diff 66fb4c2b fdd1f545` adds.

- **D1** (`precompact-flush.mjs`, the line inserted after the automatic-compaction bullet, before `// Every call that reaches…`): the script printed `D1 added == D1 words: true lengths 329 329`. The line matches byte for byte. It sits where D1 said to put it.
- **N4, both lines** (`hooks.test.mjs`, the lines just above the tests at `:1608` and `:1634`). My words were `RECORDED MUTATION (run at f77c3fa9, before this comment was added): …`. The `…` stands for the rest of the existing comment. For each line the script printed `N4 line starts with the words before the ellipsis: true | tail after prefix equals the old line tail after "parent: ": true`.
  - The only change on each line is `, at the commit that adds this line's parent` → ` (run at f77c3fa9, before this comment was added)`. The `// ` marker comes first, and the old text after the colon is kept byte for byte. Both lines match my words, with the rest of the comment filled in from the original.
  - N4's condition was "Only add the commit id if the merge keeps the branch commits" (paraphrase of my N4). That is still a merge-time condition. `git merge-base --is-ancestor f77c3fa9 fdd1f545` gave `rc=0`: f77c3fa9 (`f77c3fa9b0b553e62b192fe5424181b4e26db750`) is on the branch. A squash merge would leave that id unreachable from main, so the merge should keep the branch commits, as N4 asked.

The scratch scripts and logs are in `<S>\`: `evlit.mjs`, `mut.cjs`, `cmp.cjs`, `mut-run.log` and `restored-run.log`.

The correction holds; the rest of the report is carried forward.
