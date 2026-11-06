*Custodian's filing note (2026-11-06): Part 2's consult, by the architect at main f65ea626, its fourth hand-back, extracted by script unchanged. The first three were over Part 2's 15,000 bytes; the custodian asked for cuts of wording only. The audit is in the ledger. A report, not Authority.*

---

main @ f65ea6265a0be818fcd3f1db556ca50d3a3b552f. A design consult; no verdict.

# Review packet design consult (Part 2)

I have no shell, so HEAD is unconfirmed: the session's start status showed f65ea626 on main. I computed no sha256 and leave no background shell. I changed and wrote nothing. Line cites are `@ f65ea626`, unhashed. The `<S>` builder scripts are untracked: they are evidence, not Authority. The governing text is Part 2 of `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`, cited by section.

Blind: I did not open the filed re-run (`...-reading-2-re-run-part-2-table-tester-report.md`), the ledger's section C entries or the three packets. A's share and C's results are set without them. Disclosure: I read `state/gate-log.json` rows 678-682 for their shape. They carry the gates' call counts (e.g. "Bash 41, Read 6"), not paths, and nothing here uses them.

Reuse index: "review packet" and "context packet per task" both missed (exit 1); no prior art is assumed.

## 1. Observed

- O1. Reading 2 kept only the tool_use id, the tool name and the result's byte length. It skipped the `tool-results/*.txt` side files (`state/consults/2026-10-24-governance-e-reading-2-transcript-tally-tester-report.md:21-27`). So it cannot classify by path, and it cannot count results the harness moved to side files.
- O2. Each packet came from a fresh single-use script. All three use item 5's five headings and the same git calls: `rev-parse`, `merge-base`, `log`, `diff --numstat`, and Scope drift on main (`<S>/make-packet-c1g1.mjs:12-19`, `<S>/make-packet-8bg1.mjs:13-24`, `<S>/make-packet-wrbg1.mjs:18-28`). The 8b and walkthrough packets inline the whole diff; C1's does not.
- O3. Each script checks the hand-back's sha256 against a scratch file (`c1g1:24-25`, `8bg1:28-29`, `wrbg1:33-34`), so the hand-back was an uncommitted input at assembly.
- O4. Each script writes live CI from `gh run list` (`c1g1:27`, `8bg1:42`, `wrbg1:32`). The walkthrough script also runs `git fetch` (`wrbg1:17`).
- O5. The gates' gap lists record:
  - CI taken mid-run (`state/consults/gates/2026-11-05-verify-cites-moved-file-relative-pinned-cites-gate1-reviewer.md:96`, `...2026-11-06-walkthrough-rows-...-gate1-architect.md:136`);
  - a line named without its text (`...verify-cites-...-reviewer.md:93`);
  - whose words, missing (`...verify-cites-...-reviewer.md:94`, `...walkthrough-...-architect.md:132`);
  - drift from the form to the head (`...walkthrough-...-reviewer.md:171`);
  - a moved section found through MOVED.tsv (`...type-walk-rule2-residual-reasons-gate1-architect.md:127`);
  - semantic facts no record holds, e.g. binder outcomes and consumers (`...type-walk-...-architect.md:126,129`, `...type-walk-...-reviewer.md:133-135`).
- O6. The 8b script checked a nonexistent path by hand, through `git log --all` and MOVED.tsv (`<S>/make-packet-8bg1.mjs:35-41`).
- O7. The readers:
  - `loadPlan`, `readRulingSet` and `loadMovedMap` read the working tree (`scripts/plan/plan.mjs:50`, `scripts/plan/rulingSet.mjs:30-38`, `scripts/plan/movedMap.mjs:54-57`).
  - `deriveStates` skips in-progress nodes (`plan.mjs:251`); its blocker expression is at `plan.mjs:253`.
  - A node has `gate`, `evidence` ({pr} or {branch}), `depends_on`, `needs_human`, `dates` and `entries` (`governance/PLAN.yaml:4176-4192`).
  - `resolveRoundItem` resolves within one file and never joins files (`rulingSet.mjs:4,84-102`).
  - `currentPath` and `resolveMoved` map old paths to current ones (`movedMap.mjs:71-111`).
  - A gate-log row holds node, gate, attempt, verdict, date and note (`state/gate-log.json:2`).
- O8. The continuity block has eight fields, among them `branches` and `in-flight gate states` (`scripts/hooks/flush.mjs:70-79`). It is capped at 6144 bytes (`flush.mjs:57`), and `session-resume.mjs` prints it verbatim (`scripts/hooks/session-resume.mjs:10`).
- O9. E1's selector keys rules by role and moment (`state/consults/2026-11-03-cloud-e1-rules-report.md:32,124-125`; `state/consults/2026-11-05-platform-and-cloud-e1-comparison.md:51-52`).

## 2. Proposed

### A. The table

The table follows A's text; the human compares it with the filed re-run over its window. There is one row group per population (the main session, each agent type). It holds counts, bytes and repository-relative paths only.

1. The count and result bytes of Read, Grep and Glob calls, and of Bash calls whose first program is `rg`, `grep` or `git grep`.
2. Read, Grep and Glob by area (count, bytes).
   - The path is `file_path` for Read and `path` for Grep and Glob. It is normalized to `/` separators, case-folded and stripped of the root (worktree roots: Q4), then mapped by `currentPath(loadMovedMap(root), rel)`.
   - The areas are A's: records; code; other; whole-repository searches (no `path`, or the root as `path`); outside (counted, never named).
   - A directory takes its first segment's area. A `glob` or `type` limited to Markdown makes it records.
3. The 20 largest Read results: path (or "outside"), bytes, agent type, and whole or range (range: `offset` or `limit` present).
4. The denominator, which the share needs and A omits: all tool-result bytes from every tool, per population and in total. If the filed re-run lacks it, the share cannot be computed from that run. That is a gap, not a guess.

**The share.** The lower bound is the code-area Read, Grep and Glob bytes over item 4. The upper bound adds the whole-repository searches and item 1's Bash searches.

**The threshold, set without the table:** 15% on the lower bound. Below it, a tool that at best halves code-finding bytes saves under about 8% of tool-result bytes. That is not worth a dependency, which needs the human's typed word. Only a lower-bound crossing counts; a crossing by the upper bound alone goes to the human.

### B. The packet

**a. Sources.** S: a script derives it. H: the hand-back supplies it. G: no record holds it (a gap).

1. **Base and reviewed commit.** The reviewed commit is the custodian's argument, never "the branch head now", so a commit added later is named with its impact. S: base, main, commits, numstat, diff, and Scope drift on main where the Scope line names paths. The branch is PLAN's `evidence.branch`. A node with only {pr} needs a live `gh`, recorded as read at assembly.
2. **Requirements and open decisions.** S: the form is `node.gate`, mapped through MOVED.tsv. The settlement is a locator by its heading. Its rulings are locators: a directive path and item, or a round and item through `resolveRoundItem`. Whose words, per old span: G (O5); today the hand-back gives them, marked H.
3. **Changed interfaces.** S: the changed files, and the diff lines that add or remove `pub ` or `export ` as candidates. The form's Change line, as a locator. What the change means for behaviour is H and is not carried (rule c5). Consumers: G (O5).
4. **Evidence with revisions.** S: the hand-back's path and sha256, and each commit it names, checked as an ancestor of the head. What ran at each commit: H, by locator. CI: a locator only (`gh pr checks <n>`; rule c2).
5. **Findings and dispositions.** The worker's disclosures: H, by locator. The custodian's dispositions: G until written; they are the packet's only typed text, marked as the custodian's. A re-gate adds, by S, the node's gate-log rows (history) and each `state/consults/gates/*-<node>-gate<N>-*.md` path. Closure conditions stay in those reports, as locators.
6. **Node state and blockers (on trial).** S: status, `needs_human`, `dates`, and `depends_on` with each dependency's status. Blockers use `plan.mjs:253`'s expression, because `deriveStates` skips in-progress nodes (O7). A gated node usually shows "none"; C's "what a gate needed" decides whether part 6 stays.

**b. Shape.**
- Header: node, PR, reviewed commit, base, main at assembly, the revision every record was read at, and the uncommitted inputs.
- Order: parts 1 to 5 in item 5's order, then part 6.
- Inline: ids, commits, numstat, file and symbol lists, node state, and finding ids with their dispositions.
- Locators: the form and its sections, rulings, the hand-back, gate reports, CI.
- The diff is inline within budget; otherwise it is given as `git diff <base>...<head>`.
- Budget: 16,000 bytes. Over it, the diff becomes a locator first, then lists are cut from the end. An `INCOMPLETE:` line names each part and count left out. Nothing is cut silently.

**c. Rules, each with the failure it prevents.**
1. The packet states the revision read and names every uncommitted input. Prevents an unfiled hand-back or a dirty `PLAN.yaml` passing as record (O3, O7).
2. CI or PR status appears only as a locator with its read time. Prevents a mid-run snapshot being read as a result (O4, O5).
3. An archived ruling is a location; every match in the ruling set is listed, with no date ordering. Prevents a later date being read as supersession (`rulingSet.mjs:4`).
4. Rulings appear by locator, never by excerpt. Prevents misquotation. The cost is O5's "line without text": a form's own line may be shown with its locator, a ruling may not.
5. Facts and locations only: never H prose, only its path and sha256. Prevents a worker's account of its own correctness reaching a gate.
6. A missing or ambiguous link is printed as `MISSING:` or `AMBIGUOUS:`, e.g. a form path absent after MOVED.tsv, an unresolved ruling, or two candidate reports. Prevents guessing past a nonexistent path like O6's.

**d. Edges.**
- The packet selects no rules: selecting by role and moment is E1's (O9), and briefs keep carrying Part 1 by reference.
- It carries no session state: the block's `branches` and `in-flight gate states` stay the custodian's (O8).
- It reads forms, ledgers, PLAN and the gate log, and changes none of them. It runs no `git fetch` (unlike O4); the caller fetches.
- It adds no field to a hand-back or a form.

**e. Other uses (proposed).**
- Correction dispatch: the re-gate packet (the correction diff, findings with closure locators, the affected tests) also serves the worker.
- Build dispatch: parts 2 and 6 only, since there is no reviewed commit yet.
- The custodian's preparation: the script replaces the builders (O2) and, like them, keeps assembly reads out of the main context.
- The main session's cache reads: little gain beyond the builders, because item 4 still has the custodian read the hand-back.
- What it replaces in A's table: the gates' whole reads of `PLAN.yaml`, `state/gate-log.json` and earlier gate reports (records area), and the custodian's form reads at assembly. It does not replace the gates' form reads, which briefs order whole, or anything in the code area.

**f. `scripts/plan/packet.mjs <node-id> --head <sha> [--handback <path>] [--regate] [--budget <n>]`, sketched, not built.**
- **Output.** Stateless: it writes nothing and prints Markdown. Exit 0 when complete, 2 when INCOMPLETE, 3 on any MISSING or AMBIGUOUS.
- **Readers used:** `loadPlan`, `loadMovedMap`, `resolveMoved`, `currentPath`, `readRulingSet`, `resolveRoundItem`, `trackedPaths`. Before treating a record as committed, it checks `git status --porcelain -- <path>` and HEAD against the revision, and names any mismatch.
- **Tests,** on a temporary git repository with the real readers, one observed mutation each:
  - moved path: a MOVED.tsv row; both the current and the old form path are shown;
  - archived ruling: a round and item only in `state/cut-archive/`; shown as a location, with no verdict word;
  - missing link: the `gate` form absent; `MISSING:` and exit 3;
  - uncommitted input: an untracked hand-back and a dirty `PLAN.yaml`, both named;
  - over budget: a large diff; `INCOMPLETE:` lists the diff and the cut lists, and the output stays within budget;
  - re-gate: a FAIL row and a report fixture; the correction diff first, then the finding locators.
- **Upkeep.** It breaks when the PLAN schema, the gate-report naming, the settlement heading or the gate-log row shape changes; a test catches each. My estimate, with no table behind it: about 300 lines plus about 300 lines of tests, which needs a full form, not a five-line one.

### C. Results that justify the script (set blind)

**Justify if any two hold:**
- (i) at least 60% of the bytes are S-sourced in at least 2 of the 3 packets;
- (ii) median assembly time is 15 minutes or more;
- (iii) at least 2 of 3 packets show a gap that rule c1, c2 or c6 prevents (live CI, a missing or moved path, an uncommitted input).

**Do not justify if any one holds:**
- (iv) H and G parts are over 50% of the bytes in at least 2 of 3;
- (v) median assembly time is under 5 minutes;
- (vi) every gap is semantic, of a kind no record holds (O5).

Otherwise, it goes to the human.

### D. Code questions for a finding-code form

Each answer cites `path:line @ <commit>` and the command or tool call with its exit code. A plugin's answer also names the plugin's version and commit (round 15, item c).

1. Where X is defined.
2. Every caller of X, product and test callers apart; a claim that the list is complete cites its search.
3. The implementors of trait or interface X.
4. Every path reaching error or reason X, each line of the chain cited.
5. The consuming side's declaration of a changed `pub` item (round 4's seam rule).
6. The tests exercising X, by name; a claim that a test fails under mutation cites the run.
7. How a string reaches the operator: Display, then the SKP message (O5).

## 3. Decisions for the human (each answerable in a line)

1. Is A's threshold 15% on the lower bound (code-area Read, Grep and Glob bytes over all tool-result bytes), or another value?
2. When only the upper bound crosses, does it come to you, or count as a crossing?
3. Do results the harness moved to side files count in A's table (O1)?
4. Do worktree checkouts of this repository count as the repository, and clones or exports in scratch as outside?
5. Is the denominator (item 4) added to the table if the filed re-run lacks it?
6. Do you adopt C's criteria: justify on any two of (i)-(iii); do not justify on any one of (iv)-(vi)?
7. Is the packet budget 16,000 bytes, with the diff moved to a locator first?
8. Is CI in the packet a locator with its read time only, never a status?
9. Does part 6 (node state and blockers) stay in the first version, pending C?
10. Is "whose words" left as a reported gap (H, marked) in the first version?
11. Does the re-gate packet also serve the correction worker's dispatch?
