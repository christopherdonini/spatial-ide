Reviewed: main @ 513ca7b3cefea5019cabcc0c64198082150c6d0a
sha256: not computed

Note for filing. Neither this report nor the form writes a rooted token for a line of the live ledger. The directive's line 38 does carry one, and it is exactly what OPEN-1 is about. If a filed copy of this report kept such a token, it would turn red under verify-cites at the first rotation.

## 1. Form choice

**Full form, reviewer and architect, from dispatch.** There are three reasons:
- **§21a, guarantee.** flush.mjs's all-or-nothing, fail-loud contract is a property under test (`scripts/hooks/flush.test.mjs:41-61 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`). The cap adds a stated guarantee to it: a refused file stays byte-identical and nothing is truncated.
- **§21c, size.** The piece declares 960 lines over 12 files (§21c is `AUTONOMY.md:347-357 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).
- **§25 (e).** No five-line form is used (`AUTONOMY.md:482 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).

## 2. The draft form, to be committed at `scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md`

````markdown
# The continuity block's 6,144-byte cap, the ledger's weekly rotation and the six standing items moved out (PLAN node `governance-cut-state-cap-and-rotation`, piece B of three) — preregistration

**Authority:** the human's direction of 2026-10-14, with its RULED block in `DECISIONS-PENDING.md` (cited by date, never by line). Referenced and not reproduced, except where §2 item 6 says otherwise:
- the opening paragraph: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:6 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`
- piece B: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:25-40 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`
- the out-of-scope line: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:65 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`
- the addendum's B: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:68 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`

- Node: `PLAN.yaml:5274-5290 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
- Order: it runs after piece A (`PLAN.yaml:5257-5273 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`), whose form is `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`. C follows (`PLAN.yaml:5291-5307 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`). It never takes slot 1. The merge is the human's click.

**Drafted by** the architect agent on the custodian's brief, read at main 513ca7b3. **Committed before any code**, as the node's gate. It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full, reviewer and architect, from dispatch.**
- By §21a: a stated guarantee, and a property under test (`AUTONOMY.md:315-332 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`). This is flush.mjs's fail-loud contract, extended by the cap's guarantee that a refused file is byte-identical and nothing is truncated.
- By §21c's size: §7 declares 960 lines.
- Under §25 (e), no five-line form is used.

It touches no ADR, no wire and no security posture. The scratch file holds only the text a flush would have committed to this public repository. Verdicts are proportional (`AUTONOMY.md:389 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).

## §0. Disclosure
- **Read, not run.** The architect has no Bash. The line numbers were read in the main checkout, and the custodian's hashes at 513ca7b3 confirm them. `state/CUT-STATE.md` is cited only by heading, field label, entry stamp or commit, never by a working-tree line.
- **The code relied on:**
  - **flush.mjs.**
    - The field list: `scripts/hooks/flush.mjs:46-55 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - `findBlockRange`: `scripts/hooks/flush.mjs:64-76 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - `updateBlockFields`, which throws and writes nothing: `scripts/hooks/flush.mjs:100-149 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - The CLI, which writes only after the update returns and exits 1 on any throw: `scripts/hooks/flush.mjs:184-218 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - **The real-block label test**, which allows one non-field line, `Previous ledger`: `scripts/hooks/flush.test.mjs:41-61 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - **session-resume.mjs.**
    - `READING_ORDER`: `scripts/hooks/session-resume.mjs:28-34 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - `extractSessionContinuityBlock`, which returns the heading through the next heading, trimmed: `scripts/hooks/session-resume.mjs:44-57 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - `buildOutput`: `scripts/hooks/session-resume.mjs:99-116 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - **The precompact freshness checker.**
    - The last-ledger-change sub-check: `scripts/hooks/precompact-flush.mjs:112-127 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - The ledger-only rule, under which a block may cite HEAD's parent only when HEAD changes `state/CUT-STATE.md` alone: `scripts/hooks/precompact-flush.mjs:133-146 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - **The stop hook's continuity step.** It reads git only: the newest commit touching the ledger is stale when its flushed_at equals its first parent's. See `scripts/hooks/stop-queue.mjs:221-244 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD` and its block reason, `scripts/hooks/stop-queue.mjs:327-342 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - **The Guardian's copy of the same predicate:** `tools/mods/spatial-guardian/hooks/continuity.mjs:49-65 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - **verify-cites.**
    - The archived prefixes: `scripts/plan/verify-cites.mjs:88 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - The pin reader: `scripts/plan/verify-cites.mjs:151 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`. It does not read a pin that follows a closing backtick: `scripts/plan/verify-cites.mjs:53-60 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
    - The tiers: `scripts/plan/verify-cites.mjs:323-353 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
- **No hook runs flush.mjs.** OPEN-2 rests on these facts:
  - `precompact-flush.mjs` imports nothing from it: `scripts/hooks/precompact-flush.mjs:27-31 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - `stop-queue.mjs` only names it in its reason text: `scripts/hooks/stop-queue.mjs:41-49 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
  - The hook commands in `.claude/settings.json` (lines 15 to 47 at 513ca7b3cefea5019cabcc0c64198082150c6d0a, sha256 HASH-TBD; a dot-prefixed path, written in words) run `stop-queue.mjs` and `precompact-flush.mjs` only.
- **The 2026-09-24 rotation (B.4's model).** Read in `state/CUT-STATE.md` at 513ca7b3, in the ledger entry stamped `2026-09-24T19:40Z`, its bullet on cites moved with the file:
  - a cite in a draft was rewritten to name the archive path, at unchanged line numbers that still held the cited text;
  - a cite into a continuity-block line, which every flush rewrites, was rewritten to name the commit at which that line held the cited text.
- **Every rooted line cite into the ledger, read by Grep on 2026-10-14 in the checkout.**
  - Gated: the two named in B.4, and the directive's own lines 37 and 38 (`state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:37-38 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).
  - Pinned, and so safe: two in `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, at 02dfcff3.
  - Advisory: one under `state/drafts/` and one under `state/consults/gates/`.
  - The directive's line 38 cites lines 332 to 333 of the ledger. Once the live file is shorter than that, verify-cites gates it as out of range. The file is the human's verbatim record and cannot be edited, hence OPEN-1.
- **Reuse index.** The custodian ran `node tools/reuse.mjs` in the read-only clone of `christopherdonini/spatial-ide-reuse` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. Each query exited 1. The output below is byte-copied from the custodian's brief:
  - `log rotation`: `No prior art recorded for "log rotation". Research it before planning an implementation.`
  - `ledger`: `No prior art recorded for "ledger". Research it before planning an implementation.`
  - `size cap`: `No prior art recorded for "size cap". Research it before planning an implementation.`
  - `session continuity`: `No prior art recorded for "session continuity". Research it before planning an implementation.`

  All four are misses. The design rests on this repository's own 2026-09-24 rotation and on the code cited above.
- **Concurrent pieces.**
  - A appends an AUTONOMY section first, so B's section number is A's plus one (`<n>` below).
  - C edits `verify.mjs`, `verify-test-claims.mjs` and `verify-quotes.mjs`, none of which B touches. B touches `verify-cites.mjs` only under OPEN-1.
- **Machine.** Nothing here is a heavy run.

## §1. May and may not claim
**May claim**, each at the recorded commit:
1. `flush.mjs` refuses every write whose SESSION-CONTINUITY block, as `extractSessionContinuityBlock` returns it, would exceed 6,144 UTF-8 bytes (C1 to C3, C5).
2. The refusal names the largest field and every field's size (C4).
3. A refused file stays byte-identical, and the refused block is written whole to a scratch file outside the repository, whose path the refusal names (C6, C7).
4. `rotate-cut-state.mjs`, when due, stages a `git mv` to `state/cut-archive/CUT-STATE-<date>.md` whose blob equals HEAD's ledger blob. It applies the collision rule, writes the new file's exact text, writes nothing when not due or when it refuses, and is run by no hook (R1 to R7, R9).
5. After the first rotation commit and its ledger-only flush commit on main: session-resume prints the block; the precompact hook allows; the stop hook's continuity predicate is stale at the rotation commit and fresh after the flush; verify-cites passes before and after (R8, E3 to E9).
6. `READING_ORDER` item 1 is the directive's words, plus the sections the six items moved to (S1).
7. Each of the six items sits byte-identical in its destination, with its source (§2 item 1, E1).

**May not claim:**
- That the block is always under 6,144 bytes. The cap binds writes made through `flush.mjs`. A hand edit, or any other writer, is not bound.
- That a refusal reaches anyone from a hook. No hook runs `flush.mjs` (§0; OPEN-2).
- That the scratch file outlives the operating system's cleaning of its temporary folder.
- That an unpinned line reference written before a rotation still points at its text. The notice is the way back.
- Anything on macOS. The tests run on CI's ubuntu-latest and locally on Windows, and the live observations are on Windows.
- Any token count or context size.

**Unchanged:**
- `precompact-flush.mjs`, including its ledger-only rule;
- `stop-queue.mjs` and the Guardian's `continuity.mjs`;
- `scripts/plan/measure-reads.mjs`;
- `.claude/settings.json`;
- `extractSessionContinuityBlock`, `parseSessionContinuity` and `SESSION_CONTINUITY_FIELDS`;
- `DECISIONS-PENDING.md`;
- `state/CUT-STATE.md` on the branch, which the PR never touches;
- every existing byte of `AUTONOMY.md` and `PRECEDENTS.md`.

## §2. The change
1. **The six standing items.** These are marker strings the worker's script searches for, read in the working tree on 2026-10-14. They are not quotations, and the script checks them at M0. Each item runs from its start marker up to, but not including, the space before its end marker. A marker not found exactly once on its field's line at M0 is a STOP (I2).

| Item | Field line | Start marker | End marker | Destination | Why | Source |
|---|---|---|---|---|---|---|
| (00) | `half-made judgments:` | `(00) STANDING from` | `(0) STANDING from` | AUTONOMY §<n> part B, item 1 | a step the custodian runs before starting any piece: a mechanic | `state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md:9 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD` (item 3) |
| (0) | same | `(0) STANDING from` | `(1) NOTE FOR THE HUMAN` | part B, item 2 | how heavy runs are held and briefed: a mechanic | `state/directives/2026-10-06-machine-script-adopted.md:6-23 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`, and the two directives the item names by path |
| (5) | `intended sequencing (next session):` | `(5) STANDING: reports to files` | `(6) THE 2026-10-09 WINDOW` | part B, item 3 | a list of working mechanics | per clause (below) |
| (14) | `half-made judgments:` | `(14) STANDING from round 50` | `(17) ITEM J AGREED` | part B, item 4 | what worker and tester briefs say: a mechanic | round 50, item 1 |
| (2) | same | `(2) STANDING RULE from` | `(3) P-034:` | `PRECEDENTS.md` P-035 | a rule every new piece must satisfy: a generalised ruling | `state/directives/PORTABILITY-2026-09-30.md:31-65 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD` |
| (18) | same | `(18) STANDING from the second` | `(19) FROM FABLE` | `PRECEDENTS.md` P-036 | a rule on what may be filed and read: a generalised ruling | `state/directives/2026-10-06-boot-mods-local-and-machine-script.md:15-16 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD` |

   - **Item (5)'s clause sources.** Each clause gets its own source, cited by directive path or by round and item:
     - reports to files: `state/directives/2026-10-03-reports-to-files-two-pieces-trial.md`;
     - refreshing at milestones: `state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md`, item 5;
     - the merge commit: `state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md:12 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD` (item 6);
     - round 50, item 1;
     - the trailers: `state/directives/2026-10-04-fable-advice-nodes-trailers-latency.md:22 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`;
     - round 51, item 3.

     The worker finds the source of every other clause by search: `state/directives/` and `DECISIONS-PENDING.md`, searched explicitly under A's rule. A clause with no tracked source is listed in the PR body as unsourced, never given an invented one.
   - **The byte copy.** Each item is byte-copied by script from `state/CUT-STATE.md` at M0. M0 is the main commit the branch starts from; the custodian names it at dispatch. The copy is pinned as `path:L @ <M0> sha256:<hex>`, where L is the field's line at M0 found by its label, a sub-line span carrying its whole line's hash.
   - **No edits while open.** The custodian does not edit the six items while the PR is open.
   - **The pointer, at the head of the `half-made judgments:` field.** It is placed inside a field so that main's real-block label test stays green before the merge. The words are OPEN-4 (c):

```text
(S) STANDING items moved: AUTONOMY.md §<n> part B, items 1 to 4 (from 00, 0, 5, 14); PRECEDENTS.md P-035 (from 2) and P-036 (from 18).
```

   - **The PRECEDENTS entries**, appended after P-034 under the heading `## From the continuity block's standing items (2026-10-14 direction, piece B, item 1)`. Each entry has the following parts:
     - **Ruling.** The source, pinned with its hash and not reproduced (round 12 (b)). For P-035, also the human's covering line, which the file's filing note names; it is byte-copied by script if it is tracked, and STOP (I7) if it is not found.
     - **The item, moved.** Byte-copied by script, marked, pinned at M0, in a fence.
     - **Generalisation.** One sentence:
       - P-035: "New and materially changed work follows R1 to R6 of `state/directives/PORTABILITY-2026-09-30.md` §2."
       - P-036: "Nothing filed in this repository names the other project or states facts about it, and no agent of this project reads another project's transcripts, memory or folders."
     - **Scope and limits.**
       - P-035: R1 to R6's own words. Earlier declared platform limitations are not made blocking (`state/directives/PORTABILITY-2026-09-30.md:3 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).
       - P-036: applies from 2026-10-06. Earlier files stay as filed (`state/directives/2026-10-06-probes-readme-node-and-script-adoption.md:9 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).
     - **Applied to.** Recorded from the move on.
2. **The cap, in `scripts/hooks/flush.mjs`.**
   - **Imports.** `os`, and `extractSessionContinuityBlock` from `./session-resume.mjs`. That module's CLI is guarded, and the import creates no cycle.
   - **The new exports, each with a product caller:**
     - `BLOCK_CAP_BYTES = 6144`;
     - `BlockCapError` (carrying `.block`);
     - `blockSizes(text)`, returning `{ blockBytes, fields: [{ label, bytes }] }`. `blockBytes` is `Buffer.byteLength(extractSessionContinuityBlock(text), 'utf8')`. Each field's bytes are the UTF-8 bytes of its whole `<label>: <value>` line, in block order.
   - **Where it sits.** At the end of `updateBlockFields`, after the lines are replaced and before the return. A block over the cap throws `BlockCapError` with this message:

```text
flush: refusing to write — the SESSION-CONTINUITY block would be <n> bytes (UTF-8), over the cap of 6144. Largest field: "<label>", <b> bytes. Field sizes: <label> <b>, … (all eight, block order).
```

     The largest field is the field with the most UTF-8 bytes, the first one in block order on a tie. The `Previous ledger:` line and the rotation notice count toward the block, but neither is a field.
   - **The CLI on a refusal.**
     - It writes the refused block whole, followed by one `\n`, with the flag `wx`. The file goes in a folder named `spatial-ide-flush-refused` under the operating system's temporary folder, as Node's `os.tmpdir()` reports it, and is named `refused-<stamp>-<pid>.md`. The stamp is the machine clock's UTC ISO time, with `:` and `.` replaced by `-`.
     - It then appends: `The file is unchanged; the refused block is written whole to <path>.`
     - If that folder resolves inside the repository root, or the write fails, it writes no scratch file and appends: `The file is unchanged; no scratch file was written (<reason>).`
     - It exits 1 in every case.
     - Nothing truncates the block, anywhere.
   - **Scope of the cap.** Under OPEN-2 (A), recommended, every cap refusal writes the scratch file, whichever step asked for the flush, so the hooks are unchanged. Under OPEN-2 (B), the scratch file is written only on the named flag, and this item gains the flag.
   - **The header comment** gains the cap's contract in four lines. No tracked text carries the printed path. A record names the scratch file by its file name only.
3. **`scripts/plan/rotate-cut-state.mjs`.** It uses Node's standard library, plus `blockSizes`, `BLOCK_CAP_BYTES` and `BLOCK_HEADING` from `flush.mjs`. Every git call uses an argument array and a 64 MiB buffer. It never fetches, commits or pushes. Its exports are `isDue`, `archiveNameFor`, `noticeLine` and `buildRotatedLedger`, each called by its own `main`.
   - **Refusal (exit 2, nothing written).** It refuses when:
     - the current branch is not `main`;
     - `git status --porcelain` shows a tracked change;
     - `HEAD` is not equal to `@{u}`;
     - the ledger has no block or no `## Ledger`;
     - the new block would exceed the cap, checked before anything moves;
     - the suffix passes `-99`;
     - any git call fails.
   - **Due.** It is due when either of these holds:
     - the `%cI` of the newest commit that added a file matching `state/cut-archive/CUT-STATE-[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*.md` (`git log -1 --diff-filter=A --format=%cI -- ':(glob)…'`) is before the most recent Monday 00:00Z, read from the machine clock in UTC;
     - `git cat-file -s HEAD:state/CUT-STATE.md` exceeds 153,600, which is OPEN-3 (ii).

     When there is no such commit, it is due.

     When it is not due, it prints one line naming the newest archive's time, that Monday and the size, writes nothing and exits 0.
   - **When due:**
     - P = `git rev-parse HEAD`.
     - The name is `CUT-STATE-<YYYY-MM-DD>.md`, from the machine clock's UTC date. On a collision with a name in HEAD's tree or on disk it becomes `-2`, then `-3`, and so on. Nothing is ever overwritten.
     - `git mv state/CUT-STATE.md state/cut-archive/<name>`.
     - It writes the new `state/CUT-STATE.md` (LF, one final newline). It has no title line (OPEN-3 (iii)), and runs, in this order:
       - `## SESSION-CONTINUITY`;
       - every line of P's block range except its `Previous ledger:` line, any earlier notice line, and trailing blank lines;
       - a blank line;
       - `` Previous ledger: `state/cut-archive/<name>` (archived byte-identical by `git mv` from `state/CUT-STATE.md` at <P>). Before it: `<the first backticked path of P's Previous ledger line>`. ``;
       - a blank line;
       - the notice (below);
       - a blank line;
       - `## Ledger`.
     - `git add state/CUT-STATE.md`.
     - It asserts `git rev-parse :state/cut-archive/<name>` equals `git rev-parse <P>:state/CUT-STATE.md`. A mismatch prints STOP and exits 2, with no rollback.
     - It prints the staged paths, both blob ids, the block's bytes, and the next steps: `git commit -s -m "chore: rotate the ledger to state/cut-archive/<name>"`, push, then a normal ledger-only flush commit with `flush.mjs`, then push. It exits 0.
   - **The notice** (OPEN-4 (b)). It is the human's template with its placeholders filled. `<commit>` is P, the last commit at which `state/CUT-STATE.md` held the archived bytes. The archive path first exists at the rotation commit, which the file cannot name inside itself. It contains no `: ` sequence, so the real-block label test stays exact.

```text
Line references written before the rotation point into state/cut-archive/<name> at <P>.
```

4. **The two gated citations, as on 2026-09-24.** Each becomes a pin at a main commit where the cited text sat. A pin resolves both before and after the rotation, whenever the rotation lands, which an archive path written before the rotation cannot do.
   - **The watcher report.** In `state/consults/2026-09-26-source-watcher-gate3-architect.md:109 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`, the backticked cite into line 8 of the ledger becomes `` `state/CUT-STATE.md:8 @ <C8> sha256:<hex>` ``, inside the same backticks: verify-cites does not read a pin after a closing backtick.
     - C8 is the first parent of the commit that added the report.
     - The reviewer confirms that line 8 at C8 carries what the report says it carries. If it does not, the worker steps back through the ledger's main history before the report's filing commit. STOP (I7) if none does.
   - **The lease report.** In `state/consults/2026-09-26-stop-hook-lease-gate1-reviewer.md:32 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`, the cite into lines 332 to 333 becomes the same shape at C332. That commit is chosen the same way, and the needle `81107ddf` must sit in those lines there.
   - **Recording.** Each file changes on that one line only. The PR body records each edit under directive item B.4.
   - **verify-cites, under OPEN-1 (B), recommended.**
     - An unpinned rooted cite whose path is `state/CUT-STATE.md` goes to the advisory tier wherever it sits, the same treatment C.7 gives the unpinned cites into `DECISIONS-PENDING.md`.
     - A pinned one stays gated at its pin.
     - It takes about 6 lines, in `runVerifyCites`, after the in-tree check.
     - Under OPEN-1 (A), `state/directives/` joins `ARCHIVED_PREFIXES` instead.
5. **`READING_ORDER` item 1** (OPEN-4 (a)). The human's words, byte-copied by script from inside the quotes of `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:40 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`, are followed by the architect's sentence, which carries the addendum's B:

```text
1. state/CUT-STATE.md — the continuity block, then the live ledger, plus any unfinished matter it names explicitly. The standing items: AUTONOMY.md §<n> part B and PRECEDENTS.md P-035 and P-036.
```

   - **What pins the old text.** No test or check asserts item 1's words. The include checks are self-referential: `scripts/hooks/hooks.test.mjs:1223-1233 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD` and `scripts/hooks/cloud.test.mjs:96 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
   - **The §26 adjacency test** reads lines 4 and 5 only: `scripts/hooks/hooks.test.mjs:1314-1325 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`.
   - **Other forms.** The stale-continuity form blocks an edit to the header line only, and the header is unchanged. A's T1 imports `READING_ORDER`.
   - **AUTONOMY §0.** Its item 1 (`AUTONOMY.md:7-13 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`) is not edited. §<n> says how it is read.
6. **`AUTONOMY.md` §<n>**, appended after the last line of A's section.
   - **Title:**

```text
§<n>. The continuity block's cap, the ledger's weekly rotation, and the standing items (the human, 2026-10-14; that directive's piece B and the addendum's B; appended after §<n-1> so that no line a record cites above it moves)
```

   - **Part A, the rule.**
     - The directive's B (lines 25 to 40) and the addendum's B (line 68) are reproduced, byte-copied by script and marked, each with its pin and hash, in a `text` fence. This section is where the direction says its record rules live, as §31 does.
     - Then the custodian's instantiation, not a quotation:
       - (i) The cap, as in item 2. The scratch file is named in these words only.
       - (ii) The session-start step: lease, main brought level with origin, then `node scripts/plan/rotate-cut-state.mjs`. When it stages, the custodian makes the rotation commit, pushes, then makes a normal ledger-only flush commit and pushes. No hook runs the script.
       - (iii) Line references. One written before a rotation resolves through the notice. A new line reference into `state/CUT-STATE.md` is pinned at a main commit with its hash.
       - (iv) §0's item 1 is read as `READING_ORDER`'s item 1. §0 and §17 are not edited in place.
   - **Part B, the standing items.** Items 1 to 4, from (00), (0), (5) and (14), each byte-copied, marked and pinned at M0, each with its source. One closing line names P-035 and P-036.
7. **Dates.** No date is typed anywhere.
   - The archive name and the scratch stamp come from the machine clock in UTC, the clock `date -u` reads.
   - The weekly rule reads the archive commit's `%cI`.
   - `flushed_at` comes from `flush.mjs`'s default.
   - The custodian's ledger entries come from `date -u`.
   - The closing record's times come from `%cI`.
8. **Effects on A's anchors and on the after-C figure**, as A's §2 item 7 asks (`scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:132-143 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`):
   - (a) `measure-reads.mjs` is not touched.
   - (c) Every anchor stays:
     - `state/CUT-STATE.md`, `## SESSION-CONTINUITY`, `flushed_at:`, `## Ledger`, and the dated entry shape are unchanged;
     - the title line goes, and A's script does not read it;
     - `DECISIONS-PENDING.md` is untouched.
   - (d) `extractSessionContinuityBlock` and `parseSessionContinuity` are unchanged.
   - (e) `/state/cut-archive/` covers B's archives.
   - **Part 1 of the after-C figure** gains the notice and the new `Previous ledger:` line. It is at most 6,144 bytes when the last write went through `flush.mjs`.
   - **Part 2** under A's OPEN-1 holds under every option:
     - (A): the entries dated within 168 hours before `flushed_at` and after the last rotation;
     - (B): the last 10 entries, or fewer just after a rotation;
     - (C): the whole live ledger, at most 150 KB plus one week's entries.
   - **M-2 (the search corpus)** loses the archived ledger's bytes, because the archive is under `.ignore`.
   - **What C's record names.** The after-C record names the last rotation commit and its time beside the figures, because part 2 depends on the days since then.
9. **What B leaves for C** (C's form cites this item):
   - (a) The archive folder is `state/cut-archive/`, tracked. Names are `<STEM>-<YYYY-MM-DD>.md` from the machine clock's UTC date, with `-2`, `-3`, … chosen against HEAD's tree and the disk. Nothing is ever overwritten.
   - (b) The notice's shape is item 3's one line, with `<commit>` as the last commit at which the live path held the archived bytes.
   - (c) A rotation is a whole-file `git mv` in one commit with the live file's rewrite. Byte identity is proven by blob-id equality, and no hook runs it.
   - (d) `archiveNameFor` and `noticeLine` keep their signatures until C's form, which names any change or a shared module.
   - (e) B never touches `DECISIONS-PENDING.md`.
10. **Order, and freezing main.**
    - **Branch commits.** The branch is `cut/cut-state-cap-and-rotation`, in worktree `C:/dev/wt/csr`, from M0.
      - S1: the verify-cites rule (OPEN-1) and its tests.
      - S2: the two cite pins.
      - S3: the cap, with C1 to C7.
      - S4: the rotation script, with R1 to R9.
      - S5: `READING_ORDER`, with S1-test.
      - S6: AUTONOMY §<n> and P-035/P-036, after OPEN-3 and OPEN-4.
    - **On main.** The PR never touches `state/CUT-STATE.md`, so the custodian's ledger commits continue as usual while it is open.
    - **(b), the shrink.** When both gates have passed, the custodian makes one ledger-only flush commit on main with today's `flush.mjs`. It removes the six items, puts the pointer in, and shortens the rest to at most 6,144 bytes; nothing is truncated by a tool. The custodian then merges main into the branch and waits for CI. The PR body shows:
      - E1: the block's bytes at (b);
      - E2: the six spans at (b)'s parent equal the M0 copies;
      - every obligation removed in (b), with its new home: a PLAN node, the queue, AUTONOMY, or the archive.
    - **Freeze, from (b) to the click.** Main takes no commit. Ledger entries wait in a scratch file outside the repository, with their times from `date -u`. The human is told the order: (b) is in, and the click is next.
    - **Withdrawal.** If the PR is withdrawn, a flush restores the six items from (b)'s parent.
    - **After the click, before any other main commit:**
      - the rotation script, then commit R, then push;
      - E3 to E6;
      - flush commit F, ledger-only and carrying the held entries, then push;
      - E7 to E9.
    - **The first rotation is this piece's.** The node is done only with E1 to E9 recorded.
11. **Portability (R3).** B has no OS-conditional code.
    - `os.tmpdir()` resolves the temporary folder per platform.
    - Windows is supported (the live E rows). Linux is supported (CI's ubuntu-latest runs every test). macOS is not observed.
    - No user-visible reduction.

## §3. Fixtures
- **The real ledger**, read by C5 and by the existing label test. Each replaces all eight fields with `SENTINEL`, so they stay under the cap before (b).
- **Temporary git repositories, each with a bare repository as `origin`**, for C6, C7, R1 to R8. Their texts hold `é` (2 bytes) and `→` (3 bytes).
- **The temporary folder for C6.** It is redirected by setting `TMPDIR`, `TEMP` and `TMP` in the spawned CLI's environment: Node's own resolution, not a new option.
- **The lease file in R8** is written with the test's session id.

## §4. Tests, each with its mutation
Each mutation is applied, the named test fails, the failure is recorded by name with its commit in a `RECORDED MUTATION:` comment, and the mutation is reverted. That run is the observation of record, never `verify-mutation` (`docs/PREREGISTRATION-TEMPLATE.md:172 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).
- C1 `flush: a block of exactly 6,144 UTF-8 bytes is written`. **MC1:** the cap compared with `>=`.
- C2 `flush: a block of 6,145 bytes is refused with BlockCapError`. **MC2:** the cap check removed.
- C3 `flush: a non-ASCII block under the cap in characters and over it in UTF-8 bytes is refused`. **MC3:** the size counted as string length.
- C4 `flush: the refusal names the largest field by UTF-8 bytes and every field's size`. Here the largest field by characters differs from the largest by bytes. **MC4:** the largest field chosen by string length.
- C5 `flush: the cap measures the block session-resume prints, for the real ledger's shape`. The seam test, from the real shape:
  - `next = updateBlockFields(real, allSentinel)`;
  - `blockSizes(next).blockBytes` equals the UTF-8 bytes of the block `buildOutput` prints for a temporary project holding `next`.

  **MC5:** the size measured over `findBlockRange`'s lines, untrimmed.
- C6 `flush CLI: a refused block leaves the file byte-identical and is written whole to the scratch file the refusal names`. It asserts:
  - Buffer equality of the file before and after;
  - stderr's path lies under the redirected folder and outside the repository;
  - the scratch file's bytes equal the block followed by `\n`;
  - exit 1.

  **MC6:** the scratch file written with the block truncated to 6,144 bytes.
- C7 `flush CLI: a temporary folder inside the repository gets no scratch file and the refusal says so`. **MC7:** the inside-repository check removed.
- R1 `rotate-cut-state: a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text`. **MR1:** the archive written by reading the text and rewriting it with its final newline trimmed.
- R2 `rotate-cut-state: a same-day collision takes -2, then -3, and no archive is overwritten`. **MR2:** the existing-name check removed.
- R3 `rotate-cut-state: due from Monday 00:00Z after the last archive, not on the Sunday before`. **MR3:** the week taken to start on Sunday.
- R4 `rotate-cut-state: a ledger over 153,600 bytes is due mid-week, and one of exactly 153,600 is not`. **MR4:** `>=`.
- R5 `rotate-cut-state: not due exits 0 and writes nothing`. **MR5:** `isDue` returns true.
- R6 `rotate-cut-state: refuses with exit 2 and writes nothing off main, on a modified tracked file, or with HEAD not equal to its upstream`. **MR6:** the upstream check removed.
- R7 `rotate-cut-state: a new block over the cap refuses before anything moves`. **MR7:** the cap check moved after the `git mv`.
- R8 `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`. The seam test, from the real shape. It uses the real CLIs and exports, with no git injected:
  - at R, `decidePrecompact` (manual) blocks, and `decide` blocks with a reason naming R;
  - at F, the first allows fresh, and `decide` passes continuity, reaching its no-PLAN allow; `notify` is a no-op;
  - session-resume exits 0 at both.

  **MR8:** the rotation rewrites the block's `flushed_at`.
- R9 `rotate-cut-state: no hook in .claude/settings.json runs the rotation script`. **MR9:** a SessionStart entry running it.
- S1-test `session-resume: reading-order item 1 is the continuity block, the live ledger and the unfinished matter it names, with the standing items' sections`. **MS1:** the old item 1 restored.
- Under OPEN-1 (B):
  - V1 `verify-cites: an unpinned line cite into state/CUT-STATE.md past its end is advisory`. **MV1:** the rule removed.
  - V2 `verify-cites: a pinned line cite into state/CUT-STATE.md whose pin fails stays gated`. **MV2:** the rule applied to pinned cites as well.
  - Under (A), V1 and V2 read the same of a file under `state/directives/`.

## §5. Predictions · declared unchanged · invalidators
- **Predictions.**
  - E3: blob ids equal at R.
  - E4: at R, the precompact hook blocks (manual), and the predicate is stale and names R.
  - E7: at F, the hook allows fresh, and the predicate is not stale.
  - E5 and E8: session-resume exits 0.
  - E6 and E9: verify-cites passes.

  A wrong prediction is a result (class 2).
- **D1, declared unchanged** between M0 and the head, by stdout sha256 and exit code:
  - `verify.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify-mutation.mjs`;
  - `verify-cites.mjs`'s gated set;
  - the CI `node --test` globs, by count, rising only by the new tests;
  - the bytes of every file §1 lists as unchanged.
- **Invalidators. Each one is a STOP, and goes to the human:**
  - I1: a span at (b)'s parent differs from its M0 copy.
  - I2: a marker not found exactly once at M0.
  - I3: R8, E4 or E7 contradicts its prediction.
  - I4: verify-cites fails at the merge, at R or at F.
  - I5: (b) measures over 6,144.
  - I6: D1 differs.
  - I7: a cited text, or the covering line, is not found at any main commit.

## §6. Instruments
- **Assertions:** C1 to C7, R1 to R9, S1-test, V1 and V2, and D1.
- **Evidence:**
  - E1: (b)'s block bytes, from `git show <b>:state/CUT-STATE.md` piped into a one-line Node module that prints `Buffer.byteLength(extractSessionContinuityBlock(stdin))`.
  - E2: the span comparison, by script.
  - E3: `git rev-parse <R>^:state/CUT-STATE.md` and `git rev-parse <R>:state/cut-archive/<name>`, plus `git diff --no-renames --name-status <R>^ <R>` listing exactly two paths.
  - E4 and E7: `precompact-flush.mjs` run with `{"trigger":"manual","session_id":"obs-b-r"}` (then `obs-b-f`) on stdin, and the Guardian predicate run through a one-line Node module over real git.
  - E5 and E8: `session-resume.mjs` run with `{}` on stdin.
  - E6 and E9: `verify-cites.mjs` and `verify-quotes.mjs`, plus main's CI at F.

  E7 runs within 10 minutes of F's `flushed_at`. Every row names its commit.

## §7. Declared values and ceilings
- **Values:**
  - `BLOCK_CAP_BYTES = 6144`;
  - the rotation size threshold of 153,600 bytes (OPEN-3 (ii));
  - the week starts Monday 00:00Z;
  - suffixes run to `-99`;
  - the scratch folder is `spatial-ide-flush-refused`;
  - git `maxBuffer` is 64 MiB;
  - exit codes are 0 and 1 for flush, 0 and 2 for rotation.
- **Line budget: at most 960 lines over at most 12 files.**
  - `scripts/hooks/flush.mjs`: 80
  - `scripts/hooks/flush.test.mjs`: 190
  - `scripts/plan/rotate-cut-state.mjs`: 200
  - `scripts/plan/rotate-cut-state.test.mjs`: 290
  - `scripts/hooks/session-resume.mjs`: 2
  - `scripts/hooks/hooks.test.mjs`: 20
  - `scripts/plan/verify-cites.mjs`: 8
  - `scripts/plan/verify-cites.test.mjs`: 40
  - `AUTONOMY.md`: 75
  - `PRECEDENTS.md`: 50
  - each consult: 2
- **Counting command:** `git diff --numstat <M0>...<head> -- . ":(exclude)scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md" ":(exclude)CUSTODIAN-QUEUE.md" ":(exclude)CUSTODIAN-QUEUE.json" ":(exclude)site" | awk '{n+=$1+$2; f++} END {print n, f}'`
- An overrun is class 8, and this line is never edited to match (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 513ca7b3cefea5019cabcc0c64198082150c6d0a sha256:HASH-TBD`).

## §8. Block-on-sight
1. The diff touches any file that §1 lists as unchanged.
2. `AUTONOMY.md` or `PRECEDENTS.md` at the head is not M0's file plus appended bytes: `cmp -n "$(git cat-file -s <M0>:<f>)" <(git show <M0>:<f>) <(git show HEAD:<f>)` must exit 0.
3. A moved item is not byte-identical to its M0 span, or has no source.
4. Any truncation path in `flush.mjs`, or the cap measured over anything but `extractSessionContinuityBlock`'s output, or counted in characters.
5. The rotation script is run by a hook, or itself commits, pushes or fetches, or writes anything when it is not due or refuses.
6. A tracked file carries a user-profile path, the scratch path included.
7. A typed date in a script or record.
8. A rooted line cite into `state/CUT-STATE.md` without a pin at a main commit, in any file the piece adds or edits, this form included. A line cite into `DECISIONS-PENDING.md`.
9. A merge before E1 and E2 are in the PR body, or the node set to done without E3 to E9.

## §9. Gates
- **Architect:**
  - §8, item by item;
  - C5 and R8 as seam tests from the real shape;
  - §2 item 1's table against the spans and sources;
  - §2 item 8.
- **Reviewer:**
  - the full diff;
  - every mutation made again;
  - the hashes recomputed;
  - D1;
  - the counting command.
- **After the merge:** one scoped reviewer pass over the closing amendment's E3 to E9 rows, covering commits and hashes only.
- **Suites:** the CI `node --test` globs, plus `verify:plan`, `cites`, `quotes`, `test-claims` and `mutation`.
- **Operator:** none. These are custodian-facing scripts, not strings the app shows.
- **Verdicts are proportional:** a block only on Correctness or Evidence. Documentation findings are fixed before the merge.

## OPEN (the human's)
- **OPEN-1, before dispatch: the directive's own cite into lines 332 to 333 of the ledger.** After the first rotation the live file is shorter, verify-cites gates that cite as out of range, and the directive cannot be edited.
  - (A) `state/directives/` joins the advisory prefixes, as drafts and gate reports already have.
  - (B) **Recommended:** an unpinned line cite into `state/CUT-STATE.md` is advisory wherever it sits, the same treatment your C.7 gives `DECISIONS-PENDING.md`, while a pinned one stays gated.
  - (C) Your own words.
- **OPEN-2, before dispatch: "in the precompact or stop hook".** Neither hook runs `flush.mjs` (§0). The stop hook only names it in its reason.
  - (A) **Recommended:** every cap refusal writes the scratch file, which covers those cases with the hooks unchanged.
  - (B) A flag the custodian passes when a hook's reason asked for the flush, with both reason texts naming it. That edits two tested strings and adds about 40 lines.
  - (C) Your own words.
- **OPEN-3, for sight, before S6.** Each reading below is recommended:
  - (i) "(5)" is the `intended sequencing` field's "(5) STANDING", not `half-made judgments`' "(5)", the record cap, which is not marked STANDING.
  - (ii) "150 KB" is 153,600 bytes, matching 6,144 as 6 × 1,024.
  - (iii) "starts with the continuity block" means the new file has no title line.
  - (iv) The destinations in §2 item 1.
- **OPEN-4, the words (§31 (e)), before S5 and S6.** Approve or replace each:
  - (a) the added sentence in item 1;
  - (b) the notice with `<commit>` as P (recommended), or the rotation commit written in by F;
  - (c) the pointer.

## §10. Amendments — opens empty, append-only
````

## 3. Clause check

**Against the directive**, with lines read at 513ca7b3:

| # | Clause | How the form meets it |
|---|---|---|
| — | Line 25: "keeps its name" | The path is unchanged, and the hooks read it by name. |
| B.1 | Line 26 | §2 item 1 covers six items, a byte copy for each, sources, PRECEDENTS for rulings ((2), (18)) and AUTONOMY for mechanics ((00), (0), (5), (14)), with a one-line pointer. |
| B.2 | Line 28 | The cap is measured in UTF-8 bytes over the injected block. The refusal names the largest field and the sizes (C4). |
| B.2 | Line 29 | A refused file stays byte-identical, with no truncation path (C6, §8 item 4). |
| B.2 | Line 30 | C1 and C2 cover 6,144 and 6,145; C3 covers non-ASCII. MC2 is "cap removed"; MC3 is "counted in characters". |
| B.3 | Line 32 | Rotation runs every Monday, and sooner when the file is over the threshold (R3, R4). |
| B.3 | Line 33 | It is a `git mv`, byte-identical (R1, E3), and handles collisions (R2). |
| B.3 | Line 34 | The new file is the block, the `Previous ledger:` line and the notice. The notice's commit is OPEN-4 (b). |
| B.3 | Line 35 | A ledger-only flush follows. `precompact-flush.mjs` is unchanged (§1, §8 item 1). The hooks are shown in R8 and E3 to E9, and the first rotation is part of the piece (§2 item 10). |
| B.4 | Lines 37–39 | Both cites are pinned at the commit where the text sat, the 2026-09-24 shape for a block line. verify-cites passes before and after, given OPEN-1. **Premise gap:** the directive's line 38 itself goes out of range. |
| B.5 | Line 40 | The words are byte-copied, and S1-test covers them. |
| Addendum B | Line 68 | The scratch file: §2 item 2 (OPEN-2 on "in the hook"). The live block under the cap before the cap is enabled: E1 at (b), before the click. The script runs at session start and never in a hook (R9). The pointer and item 1 name the sections. |
| — | Line 65: out of scope | No per-node files, site or gate-log format is touched. |
| — | Line 6: no lost obligations | The PR body lists every obligation (b) removes, with its new home (§2 item 10). The held entries go into F. |

**Against the code:**
- **Neither hook calls `flush.mjs`.** Its CLI catch is the only place that knows a refusal happened. That is why the scratch write sits in the CLI and the cap sits in `updateBlockFields`.
- **The real-block label test.** It allows only `Previous ledger` as a non-field line, and its label regex takes any `X: ` line as a label. That decided two things: the pointer goes inside a field, and the notice must not contain `: `.
- **The stop predicate** reads `c` against `c^1` by flushed_at. A rotation that copies the block unchanged is stale until F (R8, MR8), which matches "followed by a normal ledger-only flush commit".
- **The precompact ledger-only rule.** It accepts F, whose parent is R, because F changes only the ledger. R itself is not ledger-only, so the hook blocks a manual compaction at R. The rule is not loosened.
- **verify-cites** gates rooted out-of-range cites and does not read a pin after a closing backtick. That decided the pinned form inside the backticks, and it is the source of OPEN-1.

**Against the brief:**
- **A's §2 item 7:** §2 item 8.
- **A's OPEN-1 holds under each option:** §2 item 8.
- **Dates:** §2 item 7.
- **The contract for C:** §2 item 9.
- **The freeze:** §2 item 10. The PR never touches the ledger, so main is frozen only from (b) to the click. The rotation is on main after the click, so the PR does not reopen on every main commit.
- **The scratch path** is named in words only (§8 item 6).
- **Reuse misses:** §0.

## 4. OPEN items
- **OPEN-1, before dispatch.** The directive's line 38 cite goes out of range after the first rotation. Recommended: (B), unpinned cites into `state/CUT-STATE.md` become advisory.
- **OPEN-2, before dispatch.** No hook runs `flush.mjs`. Recommended: (A), every cap refusal writes the scratch file.
- **OPEN-3, before S6, for sight:**
  - item (5) is the intended-sequencing "(5) STANDING";
  - 150 KB is 153,600 bytes;
  - the new file has no title line;
  - the destinations.
- **OPEN-4, before S5 and S6, §31 (e):**
  - item 1's added sentence;
  - the notice's commit (P recommended);
  - the pointer's words.

## 5. Files read
- `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md`, whole.
- `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`, whole.
- `PLAN.yaml`, lines 5255 to 5309.
- `AUTONOMY.md`: headings, plus §0, §7, §8, §17, §18, §21 to §22, and §23 to §31.
- `PRECEDENTS.md`: header, plus P-033 to the end.
- `state/CUT-STATE.md`, at heading level: the SESSION-CONTINUITY block and the first ledger entries.
- `scripts/hooks/flush.mjs`, `scripts/hooks/flush.test.mjs`, `scripts/hooks/precompact-flush.mjs` and `scripts/hooks/session-resume.mjs`, whole.
- `scripts/hooks/stop-queue.mjs`, lines 1 to 80 and 200 to 359.
- `scripts/hooks/hooks.test.mjs`, lines 1200 to 1339.
- `scripts/hooks/README.md`, lines 150 to 179.
- `tools/mods/spatial-guardian/hooks/continuity.mjs`, whole.
- `.claude/settings.json`, whole.
- `scripts/plan/verify-cites.mjs`, whole.
- `scripts/plan/verify-quotes.mjs`, lines 1 to 80.
- `.github/workflows/governance-ci.yml`, its node lines.
- `docs/PREREGISTRATION-TEMPLATE.md`, lines 94 to 178.
- `state/consults/2026-09-26-source-watcher-gate3-architect.md`, lines 100 to 114.
- `state/consults/2026-09-26-stop-hook-lease-gate1-reviewer.md`, lines 25 to 39.
- `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, lines 27 to 33.
- `state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md`, `state/directives/2026-10-06-machine-script-adopted.md` and `state/directives/PORTABILITY-2026-09-30.md`, whole.
- Grep hits in `state/directives/2026-10-06-*` and `state/directives/2026-10-04-fable-advice-nodes-trailers-latency.md`.
- `DECISIONS-PENDING.md`, lines 1003 to 1012, plus Grep hits, cited here only by date.
