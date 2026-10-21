# Done nodes' summaries over 300 bytes moved verbatim from PLAN.yaml into state/cut-archive/ by a named script, monthly beside C's rotation, the rule appended to AUTONOMY, and the measurements before and after it (PLAN node `governance-plan-summaries-archive`, governance piece D) — preregistration

**Form path:** `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md`. When the custodian commits this form, the node's `gate` becomes that path.

**Authority:** the human's direction of 2026-10-20, with its RULED block in `DECISIONS-PENDING.md` (cited by date, never by line). It is referenced here and not reproduced, except where §2 item 9 says otherwise. All spans are in `state/directives/2026-10-20-governance-d-done-node-summaries-archived-the-2026-10-14-trim-sentence-corrected.md`, read at 677ecd12:
- the opening paragraph: line 6;
- the correction of the 2026-10-14 sentence: line 8;
- item 1: line 10; item 2: lines 11-15; item 3: line 16; item 4: line 17; item 5: lines 18-22; item 6: line 23; item 7: lines 24-27;
- the out-of-scope line: line 29;
- the addendum: lines 31-32.

Each span is written `<directive>:<a>[-<b>] @ 677ecd12`. **This draft carries no sha256, because the drafter has no shell.** Before commit, the custodian expands every `@ 677ecd12` to the full commit id and adds its sha256 by script. This applies to every pin in this form. Done before commit: 62 pins, each now `path:line @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:<the lines with their LFs>`; and R16's bullet replaced by the drafter's revision, filed beside the draft; the one span in a path with a leading dot, .ignore:3, written without a hash.

- **Node:** `governance-plan-summaries-archive` (cited by id, never by a PLAN.yaml line). It comes after governance C (`governance-decisions-pending-open-and-archive`, done, PR #232), whose form is `scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md`. It goes in the governance lane after what is already queued there and never holds slot 1. The merge is the human's click.

**Drafted by** the architect agent on the custodian's brief, read at main 677ecd12. **Committed before any code.** It is the node's gate. It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full, reviewer and architect, from dispatch.**
- By §21a (`AUTONOMY.md:315-332 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3`): a property under test. `verify:plan` parses PLAN.yaml and checks that the queue and the site have not drifted, and verify-quotes searches PLAN.yaml. The move changes what each of them reads.
- By §21c's size (`AUTONOMY.md:347-357 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31`): §7 declares 800 lines.
- Under §25 (e) (`AUTONOMY.md:482 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669`), no five-line form is used.

It touches no ADR, no wire and no security posture. Verdicts are proportional (`AUTONOMY.md:389 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:8a36edc32e678f5c491f84c6c7b6d1cbc5c1b97bf8e86300ffb7a9180196a4c3`).

## §0. Disclosure

- **Read, not run.** The drafter has no shell. Every line number was read in the main checkout at 677ecd12 (a clean tree except for two untracked files outside every path named here). `DECISIONS-PENDING.md` is cited only by date, round or entry, and PLAN.yaml only by node id.
- **The correction (line 8).** No PLAN.yaml summary trim was ever placed, and D replaces it. The node's summary already records this. Beyond the moves themselves, no code or record of this piece changes any summary.
- **The parser** (the addendum requires it):
  - **Its key grammar:** `KEY_RE` is `[A-Za-z_][A-Za-z0-9_]*` (`scripts/plan/yamlSubset.mjs:25 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:f2fda2e04f8c7bd95da505cc00fa150bbced6c0ef1985066204c0999e7b641c5`). It has no hyphen. Every node id is kebab-case (`scripts/plan/plan.mjs:19 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:eee2a1fafaa5b75244ca23bb9e9a3d8d9eb338a8f910397f0461d62024ecc7f5`). So a YAML map whose keys are node ids is refused by the very parser the addendum names. That is OPEN-1.
  - **Block scalars** (`|`, `>` and their variants) are refused with the line number (`scripts/plan/yamlSubset.mjs:226-232 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:20d15bbb702400908647361a5cf222c19e9ede39e86c7620a7c3004c309298eb`; test `scripts/plan/yamlSubset.test.mjs:115-116 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:3327a54118456f6f34ff4eaa0d3ec450c110f188f4282d9b172c15c3dc9c141c`).
  - **A duplicate key in one map** is refused (`scripts/plan/yamlSubset.mjs:174-176 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:c8c2f7db3ea96318bdda105df732285e0364006e74afb102d82dfc3dadab5e50`). A duplicate node id is refused by `validatePlan` (`scripts/plan/plan.mjs:107-110 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:c49f0ed53ceaa07ce874e51390e6cac13540373c1d3f362de44921e0157fde7c`).
  - **A double-quoted scalar** is decoded by `JSON.parse` (`scripts/plan/yamlSubset.mjs:239-268 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:7b41aa43e2ddc34ddefa8535ed3654ba19921feffa745b71c688a43ee3d30bca`). A comment is stripped after whitespace outside quotes (`scripts/plan/yamlSubset.mjs:48-61 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:57142b11c8d5dd13bc87c908803f3049029e199653e1407c033dbad23f0e7e79`).
  - **One line per scalar.** No string value can span lines. So every string summary sits on exactly one line: its key line.
- **The summaries at 677ecd12, read by Grep, not by the parser.** 312 lines of PLAN.yaml contain `summary:`, and all 312 begin with four spaces and `summary: "`. No summary is a plain or block scalar. The human's figures (690,693 bytes; 151 of the 193 done nodes over 300 bytes) were the custodian's at b2433b78. S0 recounts them with the parser at M0.
- **What reads a node's summary, with every read** (the addendum names four; the rest are listed so the set is closed):
  - **queue.mjs.** `nodeSummary` copies `summary` (`scripts/plan/queue.mjs:42-56 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:b9fe2e44c7106e7e1a12c14f672a54c05ef3f8527d68e70a8a88bede939e4388`), but only for the ready, waiting, blocked, in-progress, proposed and unscheduled sets (`scripts/plan/queue.mjs:71-96 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:d5c33bd57dbc87062822f45972d90e6628a5e2f298c7449f29ed5236fd566b33`; `deriveStates` skips done nodes, `scripts/plan/plan.mjs:15 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:4245d3e5fc16f9773770cfdb5e250de636105471181975f743cb21d2a369cbfe`, `scripts/plan/plan.mjs:250-251 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:890ab7b24e630b2fd3db80dff14c215e0b31f7b692beeb137428803d69a4177d`). No done node's summary reaches `CUSTODIAN-QUEUE.md` or `.json`. Both files carry the plan's sha256 (`scripts/plan/queue.mjs:110 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:ed674bf36ee7bae224f7d13d94cc965e311c79a421541f9916988d887c32d180`, `scripts/plan/queue.mjs:80 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:d54282288c59adbe2bdf384fe4c1c43976efcf69853bd5f2155458519aa9b08d`).
  - **site.mjs.** It reads every node's summary in two places:
    - `findMetricViolations` checks `title` and `summary` against `METRIC_RE` (`scripts/plan/site.mjs:38 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:b993200beee9758ff52118f0697d1a0052e888f40c5219c4ef084a27592b58d8`, `scripts/plan/site.mjs:52-69 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:cf33a881cef08109799f11b2c306c193e1ea29a592d530c845ada4d5d97bfd5f`).
    - `site/data/plan.json` embeds every node whole (`scripts/plan/site.mjs:737-748 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:cfcdd855a5f96122767ede37651fd23012b4a6abb2b7b91fffbfb58608d9c716`).

    `site/index.html` shows no summary: a done box shows title, date and evidence (`scripts/plan/site.mjs:238-243 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:f956f0c61c8b72aeb687b8567a6aeedb8fc76800ab9bc396e05a3f10683de6b5`), and its inline data carries `plan_hash` and the done nodes' id, title, lane and dates (`scripts/plan/site.mjs:636-643 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:ad115396a836deb6ce65bfbab522c32337318431192cf8bb1e57e39913c83fb2`). The drift check renders with the build facts absent (`scripts/plan/site.mjs:853 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:85c773b05dd81d9bfb96d0f6920c21992af8a8de81db581266f7572597a3e519`). A local generation reads `site/data/build-health.json` when it exists (`scripts/plan/site.mjs:937 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:01105b2d0f995e089190af4563e7cc7bba103fca4a04b434c65a1eeea4650779`).
  - **buildHealth.mjs** reads no PLAN.yaml. Its imports are `ghRepoSlug` from verify.mjs and `PRODUCT_CI_WORKFLOWS` from site.mjs (`scripts/plan/buildHealth.mjs:27-31 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:375d17b49272ec195fe840265839ef0c34eba37da2ac7a7eae9a95425d36df3d`). Its output is GitHub's API at the time it runs, written to a gitignored file (`scripts/plan/buildHealth.mjs:18-19 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:1a5ff343c8451b7f2dcd130840e4328f22bd0e7275a52c0e2d4a770a6d274b4a`, `scripts/plan/buildHealth.mjs:283-296 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:dd6ce3076b3ed649308728dd6cd92f4abdbe4855a893bd1c2d9ffeca97922a61`).
  - **questions-mirror.mjs** reads no PLAN.yaml. It imports `telegram.mjs`, `cloud.mjs` and `leaseHeldBy` from `stop-queue.mjs` (`scripts/hooks/questions-mirror.mjs:26-31 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:9b0123fb8dce0d4f813f286392b0e0a58d59aa892ad64339b94e982c54ef6956`). `leaseHeldBy` reads `CUSTODIAN-LEASE` only (`scripts/hooks/stop-queue.mjs:154-166 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:a276c02916cd11d0a4215abeb51471144083a63404244fa72ff3b00c12efe30f`). Its summary is a message summary (`scripts/hooks/questions-mirror.mjs:54-56 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:b056fb7a5a70cdd24d6666bd2ceae3360b55646625b0fd16dde700bd5075e027`).
  - **Others, for a closed set.** None of these reads `summary`:
    - verify.mjs, which parses, checks status agreement, and runs the two drift checks (`scripts/plan/verify.mjs:290-325 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:3729023778adee4030ddd1ed19e90d8860f29636049a616460ae650812dd7c29`);
    - health.mjs (`scripts/plan/health.mjs:239-256 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:7ff79ad1bb4d713a4a6dd04945a3cb8cceb9459f613e082e697a8564febdeb3d`);
    - stop-queue.mjs (`scripts/hooks/stop-queue.mjs:349-357 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:db7cf905817c2c292d3e6e3de34577a06b4ef9ce8886551ac7431600e4de214c`);
    - docsOnly.mjs, which reads lane priorities and felt-verdict statuses (`scripts/plan/docsOnly.mjs:137-175 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:bb12e30b97076c91aec531687814431b7f3b9341a5f07f77db758c9df5a222d3`);
    - verify-test-claims.mjs, which reads status and gate (`scripts/plan/verify-test-claims.mjs:755-771 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:7acdfc9bcc4f711e7ba5a6f7bcd849866b01cf87624de371f54ff7aded5a4af2`);
    - rotate-decisions-pending.mjs, whose dry run reads ids and statuses.

    A Grep for `.summary` over the repository's JavaScript finds `scripts/plan/queue.mjs:54 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:f27df8d41b418de16c95dd889eb879588e3f35896caae760f91f44d636defa99` as the only PLAN reader.
- **verify-cites and verify-quotes, against item 2's parenthetical.**
  - **verify-cites** scans tracked `.md` files and code files' comments, never `.yaml` (`scripts/plan/verify-cites.mjs:302-311 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:ceb841b8480ed0e0d626480555a7fe4d4ed8d18c4163cac6a8a540192819984a`, `scripts/plan/verify-cites.mjs:89 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:12ce184bcbb25927ca78f65c0ebabcd3068602519a0c666e5b98ddcfdbfca884`). PLAN.yaml and the archive are both outside its scan. A cite *into* PLAN.yaml is resolved against its line count, which the move keeps.
  - **verify-quotes** scans preregistrations and ADRs for quote passages and hash references (`scripts/plan/verify-test-claims.mjs:746-748 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:7412016b5b48773dc4380b5aa8c1da1fd9dfe63a9f187dcdea21128c55894660`, `scripts/plan/verify-quotes.mjs:406-416 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:43e74acf6b7a458f8e4037e3ef11f8ccdb9625a249e2e8e480b01a5d515db4cb`). Neither PLAN.yaml nor the archive is scanned.
  - **But verify-quotes reads PLAN.yaml as a source**, in two ways:
    - its tree-wide haystack is every tracked file with a `yaml` extension, among others (`scripts/plan/verify-quotes.mjs:116 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:83e0b48bb6f732dda88b5fb1ad0edfd9bafca222a8e5448d62b6320d8819a653`, `scripts/plan/verify-quotes.mjs:834-840 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:cb724468679353c6fe8e5f5bc9a19117a6d909d2bf30831ef45a76ae195a1e4f`). The archive joins that haystack, so a passage found today only in a moved summary is still found.
    - a passage whose nearest introducing cite names PLAN.yaml is searched in PLAN.yaml alone, in the working tree, whatever its pin (`scripts/plan/verify-quotes.mjs:900-917 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:70eff8ddc1d8875f0e7de8e6c62950a530a749ca021fbe2b4e9f60a9bc0e9b59`). Such a passage would fail after its summary moves.

    C met the same shape for its ledger and built its fourth reader at `scripts/plan/verify-quotes.mjs:909 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:ef9e1b7de8d3db5aa8a4fdb8c6acbab0e59c6c843d3c27a0378b8fbe4fc36162`. S0 settles whether any such passage exists. That is OPEN-2.
- **The measurement script.** `routine` reads only `state/CUT-STATE.md` and `DECISIONS-PENDING.md` (`scripts/plan/measure-reads.mjs:61-63 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:fb6a4d54299019b739b781ac86255c0c48a0f1e6f59103d72215e6c31ba3375c`). `corpus` sums the committed sizes of the paths `rg --files` lists (`scripts/plan/measure-reads.mjs:90-118 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:2ec658a80ace99b0242e460e7153e48c2618d19b9f0311e5e16e733675be4fb5`). `/state/cut-archive/` is in `.ignore` (`line 3 of .ignore at 677ecd12985e671bcc8916a5efdea2ff9b731331, written without a hash because the reference grammar reads no path with a leading dot`), so the archive leaves the corpus. Its bytes are never edited (A's §2 item 7 (a)).
- **What C and B leave for reuse:**
  - B's `archiveNameFor` (`scripts/plan/rotate-cut-state.mjs:40-46 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:859ed80aeb6a421475123b2fe951210e22b5a56727ac622a1cdf9e59cd410441`), with C's stem mapping (`scripts/plan/rotate-decisions-pending.mjs:150-155 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:54951142661da889636796800f210108e97e6b4e95dde561f130027172e72faa`);
  - C's `isDue` (`scripts/plan/rotate-decisions-pending.mjs:74-81 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:9c0d0d0d02d7075caa5cb80af6b6194615e6662f8c20eaca6ba0e15d1b8e42f5`);
  - C's `parseUnits` and `classify` (`scripts/plan/rotate-decisions-pending.mjs:43-71 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:beaa1af838cdd5f6eb1edaefc340ecda9240c5ca53538bd12d3ac8da48775898`);
  - C's obligation-word regex shape (`scripts/plan/rotate-decisions-pending.mjs:31-32 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:be930b5f4f7f7c3c219d85de86fb1c903fbc498ae2eb62d7b8476b23fffe6c2f`);
  - C's refusal checks (`scripts/plan/rotate-decisions-pending.mjs:131-136 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:fef6fb4de2c429961bdd59d5f2f9b94c9c4c7a92c748e88517eeff373e399033`).

  Each module has a main guard, so importing one runs nothing.
- **AUTONOMY and the README's ends.** `AUTONOMY.md` ends at line 666, the end of §34 (`AUTONOMY.md:642-666 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:21d8f9321aa0b875b519b6587305e64dde22a59db2589e5d19bda3d37eadf506`). `scripts/plan/README.md` ends at line 365.
- **CI.** The governance workflow's path filters name PLAN.yaml (`.github/workflows/governance-ci.yml`, lines 80 and 97 at 677ecd12; a dot-prefixed path, written in words). D's PR and every later rotation commit on main therefore run governance CI.
- **The exposure scan.** C's S10 was refused by the pre-commit profile-path scan on a moved line (C's form, Amendment 3 item 5). The archive's added lines are copies of PLAN.yaml lines. S0 runs the same scan over them.
- **Reuse index.** The custodian ran `node tools/reuse.mjs` in the read-only clone of the reuse repository at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The output below is byte-copied from the custodian's brief:

```text
$ node tools/reuse.mjs archive summaries rotation
No prior art recorded for "archive summaries rotation". Research it before planning an implementation.
$ node tools/reuse.mjs yaml round trip verbatim move
No prior art recorded for "yaml round trip verbatim move". Research it before planning an implementation.
```

  Two misses. They are noted and do not block. The design rests on B's and C's rotations and the code cited above.
- **Machine.** Nothing here is a heavy run.

## §1. May and may not claim

**May claim**, each at the recorded commit:
1. Each archived summary line is byte-identical to the PLAN.yaml line it replaced, and its parsed string equals the parsed summary (R1, R2, and E-P at S10).
2. Only the moved summary lines change. Every other PLAN.yaml line is byte-identical, and the line count is unchanged (R3, E-P).
3. Only done nodes whose parsed summary is over 300 UTF-8 bytes move, unless kept. No node of another status moves (R5, R6, R13).
4. A second run, or a run with nothing to move, writes nothing. A refusal writes nothing (R7 to R11).
5. Every existing check gives the same results before and after the code (D1-a) and before and after the move (D1-b), within §5's named differences. Each of the addendum's four readers gives the output §5's reader table predicts (E-R).
6. The archive is outside the search corpus, and PLAN.yaml's own bytes fall by exactly the moved bytes (E-M).
7. An archived summary is found by its node id with the Grep tool given `state/cut-archive/` as its path (O1, O2).

**May not claim:**
- That the obligation markers find every obligation. They flag rows; the custodian resolves them, and the human sees the kept ones.
- That PLAN.yaml stays under any size between rotations.
- Any token count or context size.
- Anything on macOS.
- Anything about the three out-of-scope matters (line 29): one file per node, the CI-built site, and the gate log's format.

**Unchanged:**
- `scripts/plan/yamlSubset.mjs`, `scripts/plan/plan.mjs`, `scripts/plan/measure-reads.mjs`;
- `queue.mjs`, `site.mjs`, `buildHealth.mjs`, `health.mjs`, `verify.mjs`, `verify-cites.mjs`, `verify-test-claims.mjs`, `docsOnly.mjs`, `rotate-cut-state.mjs`, `rotate-decisions-pending.mjs`, `scripts/hooks/**`;
- `verify-quotes.mjs`, except §2 item 6 under OPEN-2 (A);
- `.ignore`, `.claude/settings.json` and the CI workflows (the last two written in words);
- `site/data/health.json`;
- every existing byte of `AUTONOMY.md` and `scripts/plan/README.md`;
- every existing test's name and assertion;
- PLAN.yaml on the branch, except the moved summary lines at S10.

## §2. The change

1. **What moves (items 1 and 5).**
   - **Status.** A node is *done* when `loadPlan` (`scripts/plan/plan.mjs:50-67 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:45431322b364fbd91749e47256412efec61085b52e888fce3bffaafc3beae985`) at the run's HEAD records `status: done`.
   - **Size.** Its summary is *over 300 UTF-8 bytes* when `typeof node.summary === 'string'` and `Buffer.byteLength(node.summary, 'utf8') > 300`. This is the parsed string, never the raw line.
   - **Candidates.** A candidate is a done node over 300 bytes whose summary is not a pointer (item 3) and whose id is not given in `--keep`.
   - **Never moved:** any node whose status is in-progress, ready, blocked, proposed or unscheduled, whatever its size.
2. **`scripts/plan/rotate-plan-summaries.mjs`, the named script (item 2).**
   - **Imports and conventions.** It uses Node's standard library; `loadPlan` from `plan.mjs`; `parseYamlSubset` from `yamlSubset.mjs`; `archiveNameFor` from `rotate-cut-state.mjs`; and `isDue`, `parseUnits` and `classify` from `rotate-decisions-pending.mjs`. Every git call uses an argument array and a 64 MiB buffer. It never fetches, commits or pushes. Its exports are `findCandidates`, `buildMove`, `verifyMove`, `pointerFor`, `isPointer` and `obligationRows`, each called by its own `main`.
   - **Refusal (exit 2, nothing written).** It refuses when:
     - `git status --porcelain` shows a tracked change;
     - `HEAD` does not equal `@{u}`;
     - `git rev-parse HEAD:PLAN.yaml` differs from `git rev-parse origin/main:PLAN.yaml`. This stands in for a branch check, as C's blob check does;
     - PLAN.yaml at HEAD holds a CR byte;
     - `loadPlan` throws: a block scalar (with its line number), a duplicate id, or anything outside the subset. No other reader of PLAN.yaml is used;
     - a summary begins with the marker but is not exactly a pointer, or a pointer names an archive that is not tracked at HEAD or does not hold that id (item 3);
     - a `--keep` id is not a candidate;
     - `verifyMove` fails (below);
     - the suffix would pass `-99`;
     - any git call fails.
   - **P** is `git rev-parse origin/main`.
   - **Due.** `isDue({ lastArchiveIso, nowIso, sizeBytes: 0 })`, where `lastArchiveIso` is the `%cI` of `git log -1 --diff-filter=A --format=%cI -- ':(glob)state/cut-archive/PLAN-SUMMARIES-*.yaml'`. The human named no size trigger for D, hence the zero. Only `.due` and `.month` are used. When it is not due, it prints `rotate-plan-summaries: not due — the newest archive was added <iso>; this month began <month>.`, writes nothing and exits 0.
   - **Nothing to move.** When it is due but there are no candidates, it prints one line, writes nothing (no empty archive) and exits 0.
   - **The name.** `PLAN-SUMMARIES-<UTC date from the machine clock>.yaml`, through `archiveNameFor` with the stem and extension mapped as C maps its stem. A name taken in HEAD's tree or on disk takes `-2`, `-3` and so on. No archive is ever written over.
   - **`buildMove`** builds two texts in memory, both LF with one final newline:
     - **The archive (under OPEN-1 (A)):**
       - line 1: `# Done nodes' summaries moved out of PLAN.yaml by scripts/plan/rotate-plan-summaries.mjs (AUTONOMY.md §<n>). Never edited.`;
       - `source: {path: PLAN.yaml, commit: "<P>"}`;
       - `summaries:`;
       - then, for each candidate in PLAN.yaml order, `  - id: <id>` followed by **PLAN.yaml's own summary line for that node, copied byte for byte**. PLAN's summary lines sit at four spaces, which is where the list item's keys sit.
     - **The new PLAN.yaml:** P's text with each moved node's summary line replaced by `    summary: "` + `pointerFor(<name>)` + `"`. Nothing else changes.
   - **Locating a summary line.** The k-th `  - ` item under the top-level `nodes:` is `plan.nodes[k]`, and its `id` line must match. Its summary line is the one line in that item's range that begins with four spaces and `summary: `. Anything else refuses.
   - **`verifyMove`** runs in memory, before any write:
     - parse the new PLAN.yaml with `parseYamlSubset` and validate it;
     - parse the archive with `parseYamlSubset`.
     - **Assert:**
       - the line counts are equal;
       - every line differs from P's only at the moved lines;
       - each moved line in the archive is byte-identical to P's line;
       - the archive's ids are exactly the moved ids, in order, with no duplicate and none outside PLAN.yaml;
       - each archived string, parsed, `===` the summary it replaced;
       - the new plan's nodes deep-equal P's, except each moved summary, which equals its pointer.

     Any failure refuses (exit 2, nothing written).
   - **When due**, it writes the archive and PLAN.yaml, then `git add` both. It asserts that `git rev-parse :<each>` equals `git hash-object --stdin` of its in-memory text. A mismatch prints STOP and exits 2, with no rollback. It then prints the staged paths, both blob ids, the moved count, the moved bytes (item 8), and the next steps (item 4).
   - **`--keep <id,...>`** leaves the named candidates in place (item 5).
   - **`--dry-run`** writes nothing. It prints the candidates, the pointers found, the archive name, the moved bytes, and one row per candidate (item 5).
3. **The pointer (the addendum).** `pointerFor(name)` is `[archived summary] state/cut-archive/<name>`. `isPointer(s)` is true exactly when `s` matches `^\[archived summary\] state/cut-archive/PLAN-SUMMARIES-\d{4}-\d\d-\d\d(?:-(?:[2-9]|[1-9]\d))?\.yaml$`.
   - **Under 300 bytes:** the line is at most 87 bytes.
   - **Written by the script alone:** no hand-written words.
   - **Recognised and skipped:** a pointer is never a candidate. A summary that begins with `[archived summary]` but does not match refuses the run, so no hand-written text passes for a pointer. Every pointer must name a tracked archive that holds its id, or the run refuses.
   - **Inert elsewhere:** it holds no `path:line` token and matches no `METRIC_RE` (R4).
4. **The procedure (item 4), a session-start step, never in a hook.** It runs after `rotate-cut-state.mjs` and `rotate-decisions-pending.mjs`, with the same lease and fetch:
   1. Run `--dry-run`. When it is due and has candidates, resolve every row (item 5). File the sheet at `state/drafts/plan-summaries-<UTC date>-obligations.md`.
   2. Run the script, with `--keep` for every `stays` row.
   3. Make sure no `site/data/build-health.json` is present. Run `node scripts/plan/queue.mjs` and `node scripts/plan/site.mjs`, then `git add` `CUSTODIAN-QUEUE.md`, `CUSTODIAN-QUEUE.json`, `site/index.html`, `site/data/plan.json` and the sheet.
   4. Run `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify.mjs --offline` on the staged tree and on HEAD, and compare exit codes and gated findings.
   5. If they are equal, commit `chore: move done nodes' summaries from PLAN.yaml to state/cut-archive/<name>` (signed off) and push. If they differ, restore the index and every path from HEAD, commit nothing, and tell the human.

   Each rotation writes a new archive file. Archive files are never edited.
5. **Obligations (item 3).**
   - **Found by `obligationRows`**, one row per candidate, giving:
     - the id and the summary's bytes;
     - the markers found, as two lists: in the current-state segment (the text before the first ` Before: `) and in the rest;
     - every PLAN node id named as a whole word, with its status at HEAD;
     - every DECISIONS-PENDING entry named (`entry <n>`, `entries <n>[, <n>…]`), each marked open when C's `classify` keeps it under the live `## Pending` at HEAD;
     - every KNOWN-LIMITATIONS item named (`KNOWN-LIMITATIONS` followed by `item`/`items <n>…`), each marked present when a line `<n>. **` exists in `KNOWN-LIMITATIONS.md` at HEAD.
   - **The markers** are §7's list: whole words, case-insensitive, in C's regex shape.
   - **Resolved by the custodian, every row,** as one of:
     - `home: plan <id>` (status not done at the run's HEAD);
     - `home: decisions-pending entry <n>` (an entry `classify` keeps);
     - `home: known-limitations item <n>`;
     - `not owed: <proof>` (a test, a `path:line @ <main commit>`, a commit, a PR or a record showing it done or withdrawn; round 7's rule);
     - `no obligation: <one-line reason>`;
     - `stays: no home`, passed to `--keep`.

     The three homes are the three the human named. The continuity block is not a home here, unlike in C.
   - **The first migration.** The sheet is `state/drafts/plan-summaries-d-obligations.md` on the branch. The PR body lists every `stays` row in full, with the counts by resolution.
   - **Monthly rotations.** A `stays` row does not stop the rest of the run (the human: such a summary stays until a home is placed). The custodian tells the human the kept ids.
   - **Checked by:**
     - the gate-1 reviewer, every row mechanically (each home exists with the stated status at G0; each proof resolves);
     - the architect, every row resolved `not owed` or `no obligation` whose current-state markers are non-empty;
     - the human, the `stays` list.
6. **verify-quotes, under OPEN-2 (A) only, and only if S0 shows a difference.** In the named-file gate, when the one named file is PLAN.yaml, a passage passes when one tracked `state/cut-archive/PLAN-SUMMARIES-*.yaml` holds it. Each file is normalised on its own, and nothing is joined. This is about 6 lines beside C's line 909. Under OPEN-2 (B) or (C) it is not built.
7. **The rule (item 6): `AUTONOMY.md` §`<n>` and `scripts/plan/README.md`, each appended after its last line.** `<n>` is 35 unless another section lands first. The custodian replaces the placeholders and byte-copies the span by script before the worker applies the text.

~~~markdown
## §<n>. Done nodes' summaries move from PLAN.yaml to state/cut-archive/ each month (the human, 2026-10-20; `state/directives/2026-10-20-governance-d-done-node-summaries-archived-the-2026-10-14-trim-sentence-corrected.md`, piece D and its addendum; appended after §<n-1> so that no line a record cites above it moves)

### Part A. The rule

The rule is the human's, item 6 of piece D. It is byte-copied by script from `state/directives/2026-10-20-governance-d-done-node-summaries-archived-the-2026-10-14-trim-sentence-corrected.md:23 @ <main commit> sha256:<hex>` (a sub-line span: the words after the item's label; the hash is the whole line's), and nothing in it is changed. Items 1 to 5, item 7 and the addendum are referenced and not reproduced.

```text
<item 6's words after its label, byte-copied by script>
```

### Part B. The custodian's instantiation (not a quotation)

- **(i) What moves.** A node moves when PLAN.yaml, parsed by `scripts/plan/yamlSubset.mjs`, records it as done and its summary as a string of more than 300 UTF-8 bytes, unless the custodian keeps it with `--keep`. A node of any other status, a summary of 300 bytes or less, and a pointer never move.
- **(ii) The move.** `node scripts/plan/rotate-plan-summaries.mjs` writes a new file, `state/cut-archive/PLAN-SUMMARIES-<date>.yaml` (the machine clock's UTC date; `-2`, `-3`, … when the name is taken). For each moved node it holds the node's id and its PLAN.yaml summary line, byte for byte. In PLAN.yaml that line becomes one generated line, `summary: "[archived summary] state/cut-archive/<name>"`. No other line changes, and the line count stays the same. The script checks this through the parser before it writes, stages both files, and writes nothing when it refuses. It never commits, pushes or fetches. An archive is never edited.
- **(iii) When.** At session start, after `rotate-cut-state.mjs` and `rotate-decisions-pending.mjs`, with the same lease and fetch. It is due when no archive has been added, or when the newest was added before the first of the current month at 00:00Z. Run again in the same month, or with nothing to move, it writes nothing. No hook runs it.
- **(iv) Before it runs.** The custodian runs it with `--dry-run`. One row per summary to be moved lists the markers it holds and the PLAN nodes, DECISIONS-PENDING entries and KNOWN-LIMITATIONS items it names. A summary that names something still owed moves only when the obligation has a live home: a PLAN node not done, an open DECISIONS-PENDING entry, or a KNOWN-LIMITATIONS item. Otherwise it is kept with `--keep`, and the human is told. Then the queue and the site are regenerated. `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify --offline` run on the staged tree and on HEAD, and the rotation is committed only when they agree.
- **(v) Searching.** An old summary is found by its node id in `state/cut-archive/`, by §32: give the Grep tool that folder as its path. A tree-wide search finds the node's pointer in PLAN.yaml, which names the file.
- **(vi) §1.** It is not edited. The pointer lines are an edit to done nodes' summaries, made under this section.
~~~

   - **The README section.** It is headed `## \`rotate-plan-summaries.mjs\` — done nodes' summaries to \`state/cut-archive/\` (AUTONOMY.md §<n>)`. It holds the same Part A copy with its pin (OPEN-6 (A)), then usage (`[--dry-run] [--keep <id,...>]`), the exit codes (0 and 2), what it stages, and a line naming Part B.
   - **Clause check, after the piece:**

| Sentence | Against | Holds by |
|---|---|---|
| Part A, item 6's first two sentences (what a summary states; where a done node's history belongs) | norms for the custodian; no code enforces them | not a code claim, so no wording block; the markers (item 5) are the only mechanical aid |
| Part A, item 6's third sentence (the monthly rotation moves what is left) | `findCandidates`, `isDue` | holds read with item 1's scope: done and over 300 bytes; a summary of 300 bytes or less stays, and Part B (i) says so (R5) |
| Part A, item 6's fourth sentence (search by id under A's rule) | the archive's `- id:` lines; `.ignore:3` | O1 and O2 |
| B (i) | `findCandidates` | R5, R6, R13, R10 |
| B (ii) | `buildMove`, `verifyMove`, `archiveNameFor`, the staging | R1 to R4, R8, R11 |
| B (iii) | `isDue` through the glob; the nothing-to-move branch; settings | R7, R12, R16 |
| B (iv) | the procedure, item 4; `obligationRows` | R14; the rest is the custodian's procedure, and says so |
| B (v) | as the fourth sentence | O1, O2 |
| B (vi) | `AUTONOMY.md:67 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:d164044680a70fb27155b3af71015e8b64f0683f49acc68a31facaca76f1079e` | not a code claim |

   These sentences are the drafter's, not the human's (§31 (d) and (e)). The human approves Part B in OPEN-6.
8. **The moved bytes.** `Σ over moved nodes of (bytes of P's summary line − bytes of the pointer line)`, without LFs, since the line count is unchanged. This equals `git cat-file -s <S9>:PLAN.yaml − git cat-file -s <S10>:PLAN.yaml`. The script prints it, and E-M checks it.
9. **The measurements (item 7).** A's §2 item 5 procedure is used unchanged, with A's script at its bytes. The figures:
   - **M-1, the routine read:** `measure-reads.mjs routine <rev>`. It is recorded although PLAN.yaml is not part of it (`scripts/plan/measure-reads.mjs:61-63 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:fb6a4d54299019b739b781ac86255c0c48a0f1e6f59103d72215e6c31ba3375c`).
   - **M-2, the search corpus:** A's four steps, in a clean worktree detached at `<rev>`, with the script from M-1's worktree.
   - **M-3, PLAN.yaml's bytes:** `git cat-file -s <rev>:PLAN.yaml`.

   **Before D** at M0 (the main commit the branch starts from). **After D** at the merge commit. Each figure is run twice, and the two outputs must be byte-identical, as C's Amendment 9 recorded them. Each figure is recorded with:
   - its stderr line and output sha256;
   - the environment facts of A's step 3;
   - `git show <rev>:scripts/plan/measure-reads.mjs | sha256sum`, which must equal A's S1 digest (A's form, Amendment 6 item 4).
10. **Dates.** No date is typed anywhere:
    - the archive name comes from the machine clock in UTC;
    - the due rule reads `%cI`;
    - held filings carry their receive times;
    - the closing record's times come from `%cI`.
11. **Order, and freezing main.**
    - **The branch** is `cut/plan-summaries-archive`, in worktree `C:/dev/wt/psa`, from M0. M0 is the main commit carrying the dispatch amendment; the custodian names it.
    - **Branch steps:**
      - M: M-1 to M-3 at M0, twice each. No commit.
      - S0: the probe (§4). No commit.
      - S1: the script's exports, with R1 to R6, R8 to R10 and R13.
      - S2: `main`, with R7, R11, R12, R14 and R16.
      - S3: R15, the seam test.
      - S4: §2 item 6, with Q1 and Q2, under OPEN-2 (A) only.
      - S5: the README section and AUTONOMY §`<n>`, after OPEN-6.
    - **D1-a:** M0 against S5.
    - **G0, both gates at S5.** The PR body carries:
      - the dry run against main's current PLAN.yaml (the candidates, the moved bytes, the sheet);
      - S0's results;
      - the predicted D1-b and reader table.
    - **The human** checks the `stays` list and answers the OPEN items.
    - **F0, the freeze (OPEN-5 (A)).** From here until the click, main takes no commit, and the human merges no other PR. PLAN.yaml edits, RULED blocks, directives and ledger entries wait in a scratch file outside the repository, each with its receive time. The human is told the order. Then:
      - S9: `origin/main` merged into the branch, and the dry run again;
      - new candidates since G0 get their rows. A candidate list that differs from G0's by id goes to the human (I6);
      - S10: the script, the regeneration and the commit (item 4, steps 2 to 5), then push;
      - D1-b (S9 against S10), E-P, E-R and E-O, in the PR body;
      - one scoped reviewer pass over S9..S10, mechanical only.
    - **After the click,** before any other main commit: the held filings, the node done with `{pr: N}`, then M-1 to M-3 at the merge commit, then the closing record.
    - **Withdrawal.** Main was never touched, so nothing is restored. The freeze lifts and the held filings land.
12. **Portability (R3).** There is no OS-conditional code. Paths from git use `/`, and `fs` paths go through `path.join`. Windows is supported (the live rows) and Linux is supported (CI runs every test). macOS is not observed. There is no user-visible reduction.

## §3. Fixtures

- **Temporary git repositories with a bare `origin`,** for R1 to R14 and R16. They hold:
  - a PLAN.yaml built on `scripts/plan/fixtures/valid-plan.yaml`;
  - a minimal `DECISIONS-PENDING.md` (one open entry and one marked entry);
  - a `KNOWN-LIMITATIONS.md` with two items.
- **The long summaries in the fixtures** hold `é` and `→`, a `\"` escape, a `\u00e9` escape, a ` #` sequence, a `: ` sequence and a trailing comment. One done node's summary is 300 bytes, one is 301, and one is under 300 characters but over 300 bytes. Each open status has a node over 300 bytes.
- **R15** copies the working tree's PLAN.yaml (CI checks out LF) into a temporary repository and appends one synthetic done node over 300 bytes, so that at least one summary moves.
- **The real tree,** for S0, D1-a, D1-b, E-P, E-R, E-M and O1/O2. It is never edited by a test.

## §4. Tests, each with its mutation, and the probe

Each mutation is applied, the named test fails, the failure is recorded by name with its commit in a `RECORDED MUTATION:` comment, and the mutation is reverted. That run is the observation of record, never `verify-mutation` (`docs/PREREGISTRATION-TEMPLATE.md:172 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2`).

- R1 `rotate-plan-summaries: a due run writes a new archive whose summary lines are byte-identical to the PLAN.yaml lines they replace, keyed by node id in PLAN.yaml order`. **MR1:** the archive line re-serialised from the parsed string.
- R2 `rotate-plan-summaries: each archived string, once parsed by yamlSubset, equals the summary it replaced`. **MR2:** the archive line written as an unquoted plain scalar.
- R3 `rotate-plan-summaries: only the moved summary lines change; every other PLAN.yaml line is byte-identical and the line count is unchanged`. **MR3:** a generated comment line written above each pointer.
- R4 `rotate-plan-summaries: the pointer is one generated line under 300 bytes naming the new archive, an earlier archive is never written over, and the pointer matches no site.mjs metric pattern`. The fixture forces a name collision. **MR4:** `taken` always false.
- R5 `rotate-plan-summaries: a done node's summary of 300 UTF-8 bytes stays, 301 moves, and one under 300 characters but over 300 bytes moves`. **MR5:** the size counted with `.length`.
- R6 `rotate-plan-summaries: a node that is in-progress, ready, blocked, proposed or unscheduled is never moved, whatever its summary's size`. **MR6:** the status filter removed.
- R7 `rotate-plan-summaries: a second run changes nothing: not due in the same month, and due with nothing to move writes no archive`. **MR7:** an empty archive written when nothing qualifies.
- R8a `rotate-plan-summaries: a round-trip mismatch refuses the whole run and writes nothing`. It calls `verifyMove` with an archive whose one summary differs by one escaped character, and runs the CLI to show that no file is written. **MR8a:** the parsed-equality assertion removed.
- R8b `rotate-plan-summaries: a duplicate id refuses the whole run and writes nothing`. It covers `verifyMove` given an archive with one id twice, and a PLAN.yaml with a duplicate node id through the CLI. **MR8b:** the archive's ids compared as a set.
- R8c `rotate-plan-summaries: an id missing from PLAN.yaml refuses the whole run and writes nothing`. It covers `verifyMove` given an archive id that PLAN.yaml lacks, and `--keep` naming an unknown id. **MR8c:** archive ids not in PLAN.yaml ignored.
- R9 `rotate-plan-summaries: a summary written as a block scalar refuses the run with its line number and writes nothing`. **MR9:** a `YamlSubsetError` caught and the run continued over a line-based reading.
- R10 `rotate-plan-summaries: a summary that begins with the marker but is not a generated pointer refuses, and a pointer whose archive does not hold its id refuses`. **MR10:** the marker matched by prefix and skipped.
- R11 `rotate-plan-summaries: refuses with exit 2 and writes nothing on a modified tracked file, HEAD not equal to its upstream, a PLAN.yaml blob that differs from origin/main's, or a carriage return in PLAN.yaml`. **MR11:** the blob check removed.
- R12 `rotate-plan-summaries: due when no PLAN-SUMMARIES archive was ever added or the newest was added before the month's first at 00:00Z, and a DECISIONS-PENDING archive does not count`. **MR12:** the glob widened to every file in `state/cut-archive/`.
- R13 `rotate-plan-summaries: --keep leaves the named summaries in place and the rest move`. **MR13:** `--keep` ignored.
- R14 `rotate-plan-summaries: --dry-run writes nothing and lists one obligation row per candidate with its markers in both segments and the PLAN nodes, DECISIONS-PENDING entries and KNOWN-LIMITATIONS items it names`. **MR14:** `--dry-run` stages the move.
- R15 `rotate-plan-summaries: from the real PLAN.yaml, after a run the queue differs only in plan_hash, the site's plan.json only in plan_hash and the moved summaries, and both drift checks pass after regeneration`. This is the seam test from the real shape. It uses the real CLI, then `buildQueue`, `renderSite`, `checkQueueDrift` and `checkSiteDrift`. **MR15:** the status filter dropped, so an open node's long summary moves.
- R16 `rotate-plan-summaries: no hook in .claude/settings.json runs the script`. The test's reader, a function inside the test file and not an export of the script, takes a settings file's path, parses that file, and returns every hook command that names `rotate-plan-summaries.mjs`. R16 calls it on the real `.claude/settings.json`, read only, and asserts an empty list; the test never writes that file. **MR16:** R16's path switched to a copy that the test writes in its own temporary directory, the real settings' content with one SessionStart entry running the script added; R16 then fails by name. The mutation is applied to that copy only; the real `.claude/settings.json` is never edited.
- Under OPEN-2 (A) only:
  - Q1 `verify-quotes: a passage introduced by a PLAN.yaml cite and found only in a PLAN-SUMMARIES archive passes`. **MQ1:** the named-file search reads PLAN.yaml alone.
  - Q2 `verify-quotes: a passage introduced by a PLAN.yaml cite and found in neither PLAN.yaml nor an archive fails by name`. **MQ2:** an archive's presence counted as found.

**S0, the probe, before any code.** In a throwaway worktree detached at M0:
1. Run `verify.mjs --offline`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`, `verify-mutation.mjs`, `queue.mjs --check` and `site.mjs --check`. Record each one's exit code, stdout sha256 and stderr.
2. With a scratch script outside the repository, apply §2 item 2's move by hand: every candidate's line copied to a probe archive under `state/cut-archive/`, and a probe pointer written in its place. Regenerate the queue and the site. Stage. Never commit.
3. Run the repository's pre-commit profile-path scan over the staged diff.
4. Run the seven again.
5. Record every difference, the candidate count by the parser, the moved bytes, and the done-node count.
6. Remove the worktree.

S0 settles OPEN-2's condition and the exposure question.

**Observations, at S10 on the branch, by the reviewer.** Each records the exact call, the result as returned, the commit, `claude --version` and `rg --version`'s first line.
- **O1:** Grep `{"pattern":"id: <a moved id>$","path":"<worktree>\\state\\cut-archive","output_mode":"files_with_matches"}`. Predicted: the archive.
- **O2:** the same call with the worktree root as its path. Predicted: PLAN.yaml only.

## §5. Predictions · declared unchanged · invalidators

**Predictions.** A wrong prediction is a result (class 2).
- **S0:**
  - verify-cites, verify-test-claims, verify-mutation and verify.mjs `--offline` are identical before and after;
  - the two drift checks pass after regeneration;
  - verify-quotes is identical unless a passage introduced by a PLAN.yaml cite quotes a moved summary;
  - the scan finds nothing.
- **No numeric prediction** is made for the candidate count or the moved bytes.
- **E-P, at S10, by script:**
  - `git diff --numstat <S9> <S10> -- PLAN.yaml` gives N insertions and N deletions;
  - the archive has 3 + 2N lines;
  - `git diff --name-only <S9> <S10>` lists exactly PLAN.yaml, the archive, `CUSTODIAN-QUEUE.md`, `CUSTODIAN-QUEUE.json`, `site/index.html`, `site/data/plan.json` and the sheet;
  - R1 to R3's assertions hold on the real pair.
- **E-R, the reader table, S9 against S10:**

| Reader | What it takes from a done node's summary | Check | Predicted |
|---|---|---|---|
| queue.mjs | nothing | `CUSTODIAN-QUEUE.json` parsed, `plan_hash` and `generated_at` dropped, deep-equal; `CUSTODIAN-QUEUE.md` diff | equal; the `.md` differs on its `Generated from` line only |
| site.mjs | the metric check; `plan.json` embeds it | `index.html` with `plan_hash` and `generated_at` normalised, equal; `plan.json` parsed, every node deep-equal except each moved node's `summary`, which is its pointer; `plan_hash`, `generated_at` dropped | as stated; no metric violation before or after |
| buildHealth.mjs | nothing; no PLAN.yaml read | OPEN-4 | under OPEN-4 (A), no PLAN.yaml read |
| questions-mirror.mjs | nothing; no PLAN.yaml read | `buildSummary` on the newest `state/questions/round-<n>.md`, at S9 and S10 | identical |

  Every difference is recorded as the piece's own.
- **E-M, after D:**
  - (a) the archive is not in `rg --files` at the merge commit;
  - (b) PLAN.yaml is in that list at M0 and at the merge;
  - (c) `cat-file -s <S9>:PLAN.yaml − cat-file -s <S10>:PLAN.yaml` equals §2 item 8's moved bytes.

  M-2's change from M0 to the merge is recorded with PLAN.yaml's term split into (c) and main's own PLAN.yaml commits from M0 to S9. Every other listed path that differs is named with its delta. No prediction is made for M-1.
- **D1-a, declared unchanged between M0 and S5:** the exit code, stdout sha256 and stderr sha256 of the five checks, with these named exceptions:
  - verify-cites's file count, by the new `.md` and `.mjs` files;
  - verify-mutation's count and stderr, by the new tests;
  - `node --test` counts, rising only by the new tests.
- **D1-b, declared unchanged between S9 and S10:** the five checks by exit code, stdout sha256 and stderr; `queue.mjs --check` and `site.mjs --check` exit 0 at both; `node --test` counts equal. No exception is named.

**Invalidators. Each is a STOP, and goes to the human:**
- I1: D1-a differs outside its exceptions.
- I2: D1-b differs.
- I3: E-R differs from the table.
- I4: E-M (a) or (c) fails.
- I5: S0 shows a difference that OPEN-2 does not cover, or the scan finds a line.
- I6: the candidate list at F0 differs from G0's by id, and the human has not seen it.
- I7: the measure-reads digest at either rev differs from A's S1 digest.
- I8: any figure differs between its two runs.
- I9: a `stays` row lands in the archive.

## §6. Instruments

- **Assertions:** R1 to R16; Q1 and Q2 (conditional); D1-a, D1-b, E-P, E-R, E-M, O1, O2.
- **Counts:** M-1 to M-3. These are deterministic byte counts at a rev, run twice by the worker and once more by the reviewer. They are not docs/08 measurements and carry no p50 or p95.
- **Evidence:**
  - the S0 table;
  - the G0 and F0 dry runs and the sheet;
  - S10's blob ids (the archive, PLAN.yaml at S9 and S10);
  - `git diff --no-renames --name-status <S9> <S10>`.

  Every row names its commit.

## §7. Declared values and ceilings

- **Values:**
  - the threshold: over 300 UTF-8 bytes of the parsed summary;
  - the month starts on the first at 00:00Z, and there is no size trigger;
  - suffixes run to `-99`;
  - exit codes are 0 and 2;
  - git `maxBuffer` is 64 MiB;
  - the archive glob is `state/cut-archive/PLAN-SUMMARIES-*.yaml`;
  - the pointer form is §2 item 3's;
  - the markers are `owed`, `owes`, `owing`, `waits`, `waiting`, `pending`, `held`, `until`, `next`, `follow-up`, `queued`, `later`, `not yet`, `deferred`, `outstanding`, `carried`, `still`, `open` and `todo`. C's `before` is left out, because every history segment opens with `Before:`.
- **Line budget: at most 800 lines over at most 6 files.**
  - `scripts/plan/rotate-plan-summaries.mjs`: 230
  - `scripts/plan/rotate-plan-summaries.test.mjs`: 420
  - `scripts/plan/verify-quotes.mjs`: 8 (OPEN-2 (A) only)
  - `scripts/plan/verify-quotes.test.mjs`: 70 (OPEN-2 (A) only)
  - `scripts/plan/README.md`: 30
  - `AUTONOMY.md`: 42
- **Counting command,** run at S5 and at the PR head: `git diff --numstat "$(git merge-base origin/main HEAD)" HEAD -- . ":(exclude)scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md" ":(exclude)PLAN.yaml" ":(exclude)state/cut-archive" ":(exclude)state/drafts" ":(exclude)state/consults" ":(exclude)CUSTODIAN-QUEUE.md" ":(exclude)CUSTODIAN-QUEUE.json" ":(exclude)site" | awk '{n+=$1+$2; f++} END {print n, f}'`.
- **The moved lines, counted apart:** `git diff --numstat <S9> <S10> -- PLAN.yaml state/cut-archive`, recorded as E-P. These are data written by the script and proven by blob ids and R1 to R3, not code.
- **An overrun** is class 8, and this section is never edited to match (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716`).

## §8. Block-on-sight

1. At S10, a PLAN.yaml line other than a moved summary line changed, or the line count changed.
2. An archive summary line that is not byte-identical to P's line, or any archive edited after its commit.
3. A moved node that was not done at P, or whose parsed summary was 300 bytes or less, or a pointer not of §2 item 3's form.
4. A `stays` or unresolved row moved.
5. The script run by a hook, or itself committing, pushing or fetching, or writing anything when it is not due, has nothing to move, or refuses.
6. Any of these:
   - a merge before the `stays` list, D1-b, E-P, E-R and O1/O2 are in the PR body;
   - a main commit between F0 and the click;
   - a generated file edited by hand.
7. `AUTONOMY.md` or `scripts/plan/README.md` at the head is not M0's file plus appended bytes: `cmp -n "$(git cat-file -s <M0>:<f>)" <(git show <M0>:<f>) <(git show HEAD:<f>)` must exit 0 for each.
8. `measure-reads.mjs`, `yamlSubset.mjs` or `plan.mjs` touched, or a second YAML reader in the script.
9. A reader named in §1's unchanged list edited (verify-quotes under OPEN-2 (A) excepted).
10. A typed date in a script or record.
11. A line cite into PLAN.yaml, an archive or `DECISIONS-PENDING.md` in any file the piece adds or edits, this form included, unless it is pinned at a main commit with its hash (DECISIONS-PENDING never by line).
12. A record that calls a `verify-mutation` run an observation of a mutation.
13. A figure without its rev, its second identical run, the environment facts and the script's digest.
14. Anything of the out-of-scope line: one file per node, the CI-built site, or the gate log's format.

## §9. Gates

- **Architect:**
  - §8, item by item;
  - R15 and R1 to R3 as the seam from the real shape;
  - §2 item 1 against items 1 and 5;
  - the sheet's `not owed` and `no obligation` rows (§2 item 5);
  - E-R against the addendum;
  - the clause check of §2 item 7.
- **Reviewer:**
  - the full diff;
  - every mutation made again;
  - every hash recomputed;
  - S0, D1-a and the dry run run again;
  - every row of the sheet checked mechanically;
  - the counting command;
  - O1 and O2 at S10;
  - the scoped S9..S10 pass (D1-b, E-P, E-R).
- **After the merge:** one scoped reviewer pass over the closing record: commits and hashes only.
- **Suites:** the CI `node --test` globs, plus `verify:plan`, `cites`, `quotes`, `test-claims` and `mutation`, each named with its commit.
- **Operator:** none. Nothing here is visible to a user.
- **Verdicts are proportional:** a block only on Correctness or Evidence. Documentation findings are fixed before the merge.
- **Rule 00, at main 677ecd12.** D's paths are:
  - `scripts/plan/rotate-plan-summaries.mjs` and its test (new);
  - `scripts/plan/verify-quotes.mjs` and its test (conditional);
  - `scripts/plan/README.md` and `AUTONOMY.md`;
  - at S10: PLAN.yaml, `CUSTODIAN-QUEUE.*`, `site/`, `state/cut-archive/` and `state/drafts/`.

  None is under `protocol/`. The two pieces in hand:
  - **S5d (a)** on `cut/source-changed-s5d-inconclusive`: `frontends/shell/e2e/s5dVerdict.mjs` and its test, `e2e/source-changed.mjs`, `frontends/shell/package.json`, and `e2e/README.md` (its form's rule-00 list, `frontends/shell/SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md:380-386 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:3360ce28724ab1b1f87f083fb92ff1223269b7511995a1e95aaaaad02f1c5eb4`).
  - **publish-approval-ttl-ten-minutes** on `cut/publish-approval-ttl-ten-minutes`: `publish.rs`, `PublishDialog.tsx` and its test, `e2e/exportElapsed.test.mjs`, `e2e/publish.mjs`, `e2e/README.md`, `MANUAL-WALKTHROUGH.md` Part G and ADR-024, and no PLAN or generated file on its branch (`frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md:7 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:1723f931bf88a25e44c5c6c9228bcaa3bf821bd47fe4f29515332c6509d152cd`).

  Both are disjoint from D. The custodian confirms with `git diff --name-only origin/main...<branch>` at dispatch. Their merge clicks and the custodian's PLAN.yaml commits marking them done must land before F0 or after D's click. The human is told the order.

## OPEN (the human's)

- **OPEN-1, before S1: the archive's shape.** The subset's key grammar has no hyphen (§0), so a map keyed by node id cannot be parsed.
  - (A) **Recommended:** a list of `{id, summary}` items under `summaries:`, in PLAN.yaml order. The script refuses a duplicate id. Searching `id: <id>` finds an entry.
  - (B) Widen `KEY_RE`. That edits the parser every check depends on. Not recommended.
  - (C) Your own words.
- **OPEN-2, before S4, and only if S0 shows it: the named-file reader in verify-quotes.**
  - (A) **Recommended:** §2 item 6, the same shape as C's fourth reader.
  - (B) No change. Each such summary stays, with `--keep` and a `stays` row.
  - (C) Your own words.
- **OPEN-3, before G0's sheet, for sight:** §7's markers, §2 item 5's resolution forms, one row per candidate (C's shape), and the two segments. Expect most rows flagged, because history segments carry `NEXT:`.
- **OPEN-4, before G0: buildHealth.mjs's before and after.** It reads GitHub's API and the clock, not PLAN.yaml.
  - (A) **Recommended:** the import proof in E-R plus `summaryLines` run at S9 and S10 on one fixed fixture object, identical. No network run.
  - (B) One paired network run at each commit, compared with `built_at` dropped, and any API fact that changed named.
- **OPEN-5, before F0: the freeze.**
  - (A) **Recommended:** C's F0. Main takes no commit and no other merge from S9 to the click, and filings are held.
  - (B) Only commits touching PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` are held. Others land, and E-M names them.
- **OPEN-6, before S5: the rule's two homes.**
  - (A) **Recommended:** item 6's span byte-copied into both AUTONOMY §`<n>` and the README section, because item 6 names both files.
  - (B) The README names §`<n>` Part A and does not reproduce it.
  - Part B's words (§2 item 7) are the drafter's, for your approval or replacement (§31 (e)).
- **OPEN-7, readings, for sight. Each is recommended:**
  - (i) Item 7's word *unchanged* on the corpus line means the instrument, since the addendum predicts the figure falls.
  - (ii) *On the first of each month* means due from the first at 00:00Z, run at the first session start on or after it, with no size trigger.
  - (iii) A home is one of the three named, and the continuity block is not one.
  - (iv) A `stays` row does not stop the rest of a run.
  - (v) *A duplicate id* means within PLAN.yaml or within the archive a run writes. A node re-archived in a later month appears in two archives, and both are found by id.
  - (vi) The pointer's date is a file name, not a number under §1's summary note (`AUTONOMY.md:50 @ 677ecd12985e671bcc8916a5efdea2ff9b731331 sha256:d43a56c1854231c7e3cc840a164080e7d1f8aa18e0a73a11a26514ff1c1b1794`).

## §10. Amendments — opens empty, append-only

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-7; the dispatch (class 5)

*Written by the custodian on the human's ruling. References only: `state/directives/2026-10-20-235-and-236-clicked-d-open-1-to-7-ruled-runs-alone-only-when-a-claim-would-change.md`, from line 6.*

1. **OPEN-1 (A):** a list of `{id, summary}` items under `summaries:`, in PLAN.yaml order; a duplicate id refuses the run.
2. **OPEN-2 (A),** if S0 shows it: the named-file reader, as C's fourth reader.
3. **OPEN-3:** the human sees the sheet at G0.
4. **OPEN-4 (A):** the import proof and `summaryLines` on one fixed fixture; no network run.
5. **OPEN-5 (B):** from S9 to the click, only commits touching PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` are held; others land, and E-M names them. The branch merges main in once more before the click if main moved.
6. **OPEN-6 (A):** item 6's span byte-copied into both homes; Part B's words approved as drafted.
7. **OPEN-7:** readings (i) to (vi) confirmed.
8. **M0** is the main commit that adds this amendment; the custodian names it at dispatch. The branch is `cut/plan-summaries-archive`, in `C:/dev/wt/psa`.
9. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — built to G0: S1 to S5, S4 not built; M at M0; S0 and the dry run; the differences (class 3); the script's overrun (class 8); written after the results were seen

*Written by the custodian after the worker's report was seen. References and hashes only: `state/consults/2026-10-20-governance-plan-summaries-archive-g0-worker-report.md`.*

1. **Built** on `cut/plan-summaries-archive` from M0: S1 d93607315ede2cc9c22a18a102d54db89337e05d with its mutation record 0d5cdbd44f86e1c7f023f3781e4071320be15e22; S2 e11f7275a4c0a2b71ea2a5a46c0aca114e73e040 with aaf6787a24aa962b06e268964ecc5b831e17816d; S3 a73689f3cc6245d9c3e14cd588ca0f9eb4ffebec with f4a520c0a3e9105e8d4b3ce89b2e60ac470e1735; S5 2d60ac164e7a65e29e5e55a27eaa202062d31b83. S4 is not built: S0 shows no difference in verify-quotes, so OPEN-2 (A)'s condition is not met.
2. **M at M0** (§2 item 7), each figure twice and byte-identical, in the report: M-1's routine total 81,398 bytes; M-2's corpus 1,986 files and 36,290,933 bytes; M-3's PLAN.yaml 695,917 bytes by `git cat-file -s`. The script's digest equals A's S1. Ripgrep's first line names rev 575938147b where C's closing record named de4bc695b7; the version is the same, 14.1.1.
3. **S0 and the G0 dry run** (the report): the seven checks identical before and after a hand move; 153 candidates of 195 done nodes at M0; 405,897 moved bytes. The dry run ran in a throwaway clone, because main's PLAN.yaml has moved since M0 and the script's blob check refuses in the worktree; S9 merges main in and runs it again. The sheet, `state/drafts/2026-10-20-plan-summaries-d-obligations-g0.md` (sha256 f2f17760ce35134b71ce720ced20789d6ac94a24b6717614ddd8243a08a89af1), has 153 rows: 87 with no marker in the current-state segment, 28 with markers and a mechanical home, and 38 with markers and none, which stay by default. It goes to the human at G0 (OPEN-3).
4. **Differences from the form (class 3), as the report's items 1 to 10:** a record commit after each code commit; MR9 caught at both parse sites; verifyMove returns a list of problems; R8a's CLI half shows a locator refusal; obligationRows lands in S2; one more refusal (the PLAN.yaml on disk not HEAD's) and four imports; the AUTONOMY placeholders resolved by script to §35 and §34; the dry run in a clone; R16's positive control; the throwaway worktrees removed.
5. **Budget (class 8; §7 not edited):** `scripts/plan/rotate-plan-summaries.mjs` is 249 lines against its 230; the whole is 653 lines over 4 files against 800 over 6.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 3 — G0: PR #237 opened as a draft; every row of the sheet resolved; the candidates over main's current PLAN.yaml (class 1); written after the dry run was seen

*Written by the custodian. References and hashes only: `state/drafts/2026-10-21-plan-summaries-d-obligations-g0-resolved.md` and PR #237's body.*

1. **PR #237** is open as a draft from `cut/plan-summaries-archive` at 2d60ac164e7a65e29e5e55a27eaa202062d31b83. Its body carries what §2 item 11's G0 bullet names.
2. **The candidates over main's current PLAN.yaml** (§2 item 11), at 9831bb2163552f6e715fa29458f2c54124df10a2: the S5 script's own `findCandidates`, `buildMove` and `verifyMove`, imported and called by the custodian, give 153 candidates of 195 done nodes, the same ids as the G0 sheet, 405897 moved bytes, an archive of 309 lines, and no verifyMove problem. The CLI was not run, because its blob check refuses by design when the branch's PLAN.yaml is not main's. PLAN.yaml is unchanged from that commit to ead5b66ac6826bb52431ce77b406e3ffebb6d44a.
3. **Every row resolved** (§2 item 5), at `state/drafts/2026-10-21-plan-summaries-d-obligations-g0-resolved.md` (sha256 202ad248e60756a90ba831dfc601601359b9cca99a0e1710faac83f74ba20b57): no obligation 87; home 9; not owed 3; stays 54. A home is taken only where the row's own current-state text places the obligation there; not owed only with a merged PR as the proof; every other row with a marker stays. The stays list goes to the human (OPEN-3).
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 4 — gate 1: both FAIL on C1 and C2; correction round 1; the record corrected (class 1); written after both gate reports were seen

*Written by the custodian. References and hashes only: `state/consults/gates/2026-10-21-governance-plan-summaries-archive-gate1-architect.md` (gate-log 567) and `state/consults/gates/2026-10-21-governance-plan-summaries-archive-gate1-reviewer.md` (gate-log 568).*

1. **Gate 1** at S5: both gates FAIL on the same two Correctness findings. C1: R15 refuses once PLAN.yaml holds pointers, because its temporary repository holds no archive, and its count of moved summaries assumes an unkept real candidate. C2: a failure after the first write is reported as a refusal that wrote nothing. The reviewer reproduced C1 on the script's own move at M0: R15 alone exits 1, and the CI globs give 526 of 527.
2. **Correction round 1** of the two the record cap allows: one worker-high on the branch, for C1 and C2 as both reports give them, and for the Documentation words of item 3. MR15 is recorded again at the fixing commit, and R15 is shown passing on a rotated tree in a throwaway clone, before S10. Then gate 2, both gates.
3. **The words (AUTONOMY §31 (d)), one author's per sentence.** The README's staging sentence and the test file's header: both gates give the same words. The README's exit-code sentence: the two differ in one phrase, and the reviewer's (`or failed on an unexpected error`) is applied, because the same sentence names STOP for a failure after the first write, and the architect's `stopped` would read as that STOP. The test file's mutation-commit comment and the due call's comment: the reviewer's alone.
4. **The record (the architect's D4 words, the revs filled by script; the reviewer's Doc-7).** Amendment 2's item 5 is this piece's class 8 entry, budget overrun, §7 not edited, and its item 4 is read as class 1, the amendment's first line saying it was written after the results were seen. The sheet hashes of Amendment 2 item 3 and Amendment 3 item 3 are read @ b2df233db725d947c02c001b7d3f0f2db3d9bde6 and @ b5c1c8418ea6fbfbff98135539e63f57af47abea, the commits adding each sheet. §8 item 6's second bullet and §2 item 11's F0 bullet are read under Amendment 1 item 5 (OPEN-5 (B)): a held commit is one touching PLAN.yaml, CUSTODIAN-QUEUE.* or site/.
5. **D1-b at S10 (the reviewer's Doc-6), predicted before S9.** The S10 commit adds the sheet at `state/drafts/plan-summaries-d-obligations.md` (§2 item 5), so verify-cites' stdout file count rises by one at S10, a difference §5 does not name. By I2 it goes to the human before S9. C's precedent: verify-cites' extra file, its archive, accepted as that piece's own (C's form, Amendment 5 item 5 and Amendment 7 item 5).
6. **Not taken in this round:** the reviewer's suggestions on R4's bound and on `holds`' cost per pointer. Both are recorded in its report.
7. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 5 — correction round 1 built; budget overrun, §7 not edited (class 8); written after the results were seen

*Written by the custodian after the worker's report was seen. References only: `state/consults/2026-10-21-governance-plan-summaries-archive-round-1-worker-report.md`.*

1. **Built** on `cut/plan-summaries-archive` from 2d60ac164e7a65e29e5e55a27eaa202062d31b83: the fix commit c8c0a2949c841537d3a3d2800ef4da5b34cf344f (C1, C2 and the five word pairs of Amendment 4 item 3) and the record commit 510f4bacc1521fb85de84628b8686f334a2970aa (comment lines only).
2. **Observed** (the report): MR15 at c8c0a2949c841537d3a3d2800ef4da5b34cf344f fails R15 by name. In a throwaway clone at c8c0a2949c841537d3a3d2800ef4da5b34cf344f, the script's own move committed there: R15 passes, with the synthetic node alone moved; with the archive removed from that clone's tree, R15 refuses by name. The brief's "delete R15's new archive copy" was read as removing the archive the copy step reads; both leave R15's temporary repository without the archive. C2 was checked by patched copies of the script in that clone: a failure after the staged write prints the refusal line at 2d60ac16 and the STOP line at c8c0a2949c841537d3a3d2800ef4da5b34cf344f.
3. **Budget (class 8; §7 not edited):** `scripts/plan/rotate-plan-summaries.mjs` is 251 lines against its 230, two more than Amendment 2 item 5's 249; the whole is 663 lines over 4 files against 800 over 6.
4. **Gate 2,** both gates, at the record commit.
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 6 — gate 2: both PASS WITH NOTES; the word round (class 1); written after both gate reports were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-21-governance-plan-summaries-archive-gate2-architect.md` (gate-log 570) and `state/consults/gates/2026-10-21-governance-plan-summaries-archive-gate2-reviewer.md` (gate-log 571).*

1. **Gate 2** at the record commit: both gates PASS WITH NOTES, and both close C1 and C2. The reviewer made R15 on a rotated tree, MR15 and the C2 check again, and also ran the S10 shape: with the 54 stays rows passed to `--keep`, the script moves 99 summaries, 284,775 bytes, and R15 passes.
2. **The architect's D6 words:** Amendment 5 item 3's figures are §7's counting command at 510f4bacc1521fb85de84628b8686f334a2970aa (the round's report, its §7 table); the script's two added lines are the fix commit's, its C2 STOP path (`scripts/plan/rotate-plan-summaries.mjs` lines 228-240 at that commit) and the due call's comment, now two lines (lines 192-193 at that commit).
3. **The word round, no re-gate (AUTONOMY §31 (d)):** the architect's D5 words for the README's exit-code sentence and D7 words for R15's comment, applied by a worker; the reviewer's Doc-A and Doc-B words in the PR body, applied by the custodian, with a list of every word applied.
4. **Before S9:** D1-b's predicted exception (Amendment 4 item 5) is with the human under I2; S9 waits for that answer.
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 7 — the gate-2 word round built (class 1)

*Written by the custodian. References only: `state/consults/2026-10-21-governance-plan-summaries-archive-gate2-words-worker-report.md` and PR #237's body.*

1. **The word round** of Amendment 6 item 3 is at f54b54ac4a9f9f73b482e865dacdb7e314f126fc: the README's exit-code sentence and R15's comment, in the architect's words, comment and prose lines only. §7 at that commit: 663 lines over 4 files, unchanged.
2. **The PR body** carries the reviewer's Doc-A bullet and Doc-B section, byte for byte from its report, and lists every word applied in both rounds.

Nothing above is edited.

### Amendment 8 — the human's answers on D1-b's exception and the stays list (class 5)

*Written by the custodian on the human's message. References only: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md`.*

1. **D1-b's exception (I2; Amendment 4 item 5):** accepted, the sheet's own file, as with C. At S10, verify-cites' stdout file count rises by one for `state/drafts/plan-summaries-d-obligations.md`, and that difference is the piece's own.
2. **The stays list (OPEN-3):** accepted as resolved; the 54 rows stay in PLAN.yaml until a later rotation.
3. **Next:** S9, then S10, under OPEN-5 (B).
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 9 — the human's answer on I6; the S10 sheet; S10 next (class 5)

*Written by the custodian on the human's message. References and hashes only: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`.*

1. **I6:** S9's candidate list differs from G0's by one id, `connection-reuse-recycled-interrupt-flake`, new, with none gone and the common ids in G0's order (`state/consults/2026-10-21-governance-plan-summaries-archive-s9-worker-report.md`). The human has seen it, and its row is `no obligation`.
2. **The sheet at S10** (§2 item 5), built by script from S9's dry run and G0's resolved sheet (Amendment 3 item 3), with G0's 153 resolutions unchanged and their current-state markers equal at S9: 154 rows; no obligation 88, home 9, not owed 3, stays 54. Its sha256 is 9ed1c66ed6ab64ce5068aedeb91e2601d545a99a9fc2e17835f8b3667075a977. The worker copies it to `state/drafts/plan-summaries-d-obligations.md` byte for byte, and the 54 stays rows go to `--keep`.
3. **S10** by one worker-high on the branch at S9's merge commit e01738917ef271ff65ee01740c5fbfca36237b73, then the scoped reviewer pass over S9..S10 with O1 and O2. Main has moved since S9 by commits touching none of PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/`; the branch merges main in once more before the click (Amendment 1 item 5).
4. **Generation:** unchanged in PLAN.yaml under the hold; it goes up with the held filings after the click.

Nothing above is edited.

### Amendment 10 — S10 built: the move committed; D1-b, E-P, E-R and E-M (c) as predicted; P is a later main commit (class 1); written after the results were seen

*Written by the custodian after the worker's report was seen. References and hashes only: `state/consults/2026-10-21-governance-plan-summaries-archive-s10-worker-report.md`.*

1. **S10** is 120cd55dadd68ab4670776f6882b3e028624edf2 on `cut/plan-summaries-archive`, pushed, its parent S9 e01738917ef271ff65ee01740c5fbfca36237b73. The archive `state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml` (blob 56ba73a11869c682f177be816f7c4bc30511b1d1, 203 lines); PLAN.yaml blob 841e0527f16aac1d770a035424ddd52c5526bc03, from S9's 83abe8bbc6f9b8007b8694f90b83ac713d444fa1; 100 summaries moved, 291,520 bytes; the 54 stays rows kept; the sheet at sha256 9ed1c66ed6ab64ce5068aedeb91e2601d545a99a9fc2e17835f8b3667075a977.
2. **Step 4 and D1-b, S9 against S10:** the five checks' exit codes, stdout and stderr equal, except verify-cites' stdout file count, 2132 to 2133, the sheet's (Amendment 8 item 1). queue.mjs and site.mjs `--check` exit 0 at both. The CI globs: 527 tests, 527 passed, at both, the counts files byte-equal. verify-mutation ran with S9's base given explicitly (54d072687e79f8cb9a77ca942aa6809dad4e326b), since origin/main had moved; its output equals S9's. The shared hold's command printed no exit-code line, at S9 as at S10.
3. **E-P, E-R and E-M (c):** 100 insertions and 100 deletions in PLAN.yaml; the archive's 203 lines equal 3 + 2N; exactly the seven paths; `verifyMove` on the real pair returns no problem. E-R as §5's table predicts: the queue's JSON deep-equal and its Markdown different on the `Generated from` line only; the site equal once normalised, each moved node's summary its pointer; no metric violation at either; `buildSummary` byte-identical. E-M (c): 703,836 − 412,316 = 291,520, the script's moved bytes.
4. **P:** the archive's `source` commit is main's ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f, where S9's dry run printed 54d072687e79f8cb9a77ca942aa6809dad4e326b. Main moved after S9 by commits touching none of PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` (Amendment 1 item 5), and P's PLAN.yaml blob is S9's. The candidate ids are S9's, so I6 is not raised again. The two generators' output went to /dev/null; their exit codes, 0, are in the report.
5. **Next:** the scoped reviewer pass over S9..S10 with O1 and O2; the PR body; main merged in once more before the click.

Nothing above is edited.

### Amendment 11 — the scoped S10 pass: PASS WITH NOTES (class 1); written after the report was seen

*Written by the custodian. References only: `state/consults/gates/2026-10-21-governance-plan-summaries-archive-s10-reviewer.md` (gate-log 574).*

1. **The pass** (§9, reviewer) at S10: R1 to R3 on the real pair, by the reviewer's own script with a negative control; the sheet, the stays list and I9; E-P, E-M (c), D1-b and E-R as predicted. The CI globs' exit code, which the worker did not see printed (Amendment 10 item 2), printed 0 in the reviewer's run.
2. **E-O:** O1 found the archive alone and O2 found PLAN.yaml alone, as §4 predicts, at 120cd55dadd68ab4670776f6882b3e028624edf2, with `claude --version` and `rg --version`'s first line recorded in the report.
3. **N1:** the sheet's directive path and the archive's `source` commit are on main and not yet in the branch's history. The final merge of main into the branch, before the click (Amendment 1 item 5), brings both in; after it, `git cat-file -e HEAD:<that path>` and `git merge-base --is-ancestor ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f HEAD` both exit 0.
4. **Next:** the final merge of main into the branch, the PR body (D1-b, E-P, E-R and E-O), and the human's click.

Nothing above is edited.

### Amendment 12 — closing record: PR #237 merged; the after-D measurement at the merge commit (class 1)

*Written by the custodian after the merge. References and hashes only: `state/consults/2026-10-21-governance-plan-summaries-archive-after-d-measurement.md`, sha256 9f12c428810c1050d780af103bf5b68aa68b5c0c168d5a39643d3fe920ad529f.*

1. **Merged** by the human: merge commit 16b3d36045cb3b122bb19baeadbaa22de29e9132, `%cI` 2026-10-21T14:35:38+02:00 (two parents: main 6c3795c5257013d5471bacf68d8c7bb6a2006e0b and the branch head 6045a6dfc0e092f63192f64a6bafc326cfa5b07c, the final merge). The held filings and this node done with `{pr: 237}` are main's next commit, 5a630ed53caf8ce9564962f97ad1ed2ab750fab7, `%cI` 2026-10-21T14:53:41+02:00, before any other (§2 item 11).
2. **The move** (§2 item 4): S10 120cd55dadd68ab4670776f6882b3e028624edf2, in the merge. At the merge commit the archive `state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml` is blob 56ba73a11869c682f177be816f7c4bc30511b1d1 and PLAN.yaml is blob 841e0527f16aac1d770a035424ddd52c5526bc03, both S10's.
3. **M-1** (§2 item 9), in a worktree detached at the merge commit with a clean porcelain; the run's script ran 2026-10-21T12:54:55Z to 2026-10-21T12:55:08Z. Twice, both exit 0, stdout and stderr byte-identical between the runs. The stderr line: `measure-reads: routine 16b3d36045cb3b122bb19baeadbaa22de29e9132 block=5843 ledger=39940 entries=91 window_from=2026-10-14T09:27:28.000Z outside_window=0 pending=51320 total=97108`. Stdout is 97108 bytes by `wc -c`, equal to `total`; its sha256 is dc9237bfabdd8df356d1eda283631be26034aba300c731c2cd28ab27a0fb9f4b, and the stderr's f3c0e70ac4a0f5434f35f598887393ce0c1e8295cc77e87c52f406957001178d. At M0 the total was 81,398 (Amendment 2 item 2). §5 makes no prediction for M-1.
4. **M-2:** a second worktree detached at the merge commit, its porcelain empty before and after; the script from M-1's worktree. Each run's pipe exited 0 and 0, with nothing on ripgrep's stderr, and the two runs were byte-identical. Stdout: `measure-reads: corpus 16b3d36045cb3b122bb19baeadbaa22de29e9132 files=2011 bytes=36607014`, sha256 1d8d6e2dd2cfa4346405090d002f4676b3c4163fea85f31faa402220e7c2d0f8. Stderr: `tracked_not_listed=586`, sha256 2ec3fa59ee33f80ee30fb8dd9838d6b413be1145e0ace82020031c2c6e178462. At M0: 1,986 files and 36,290,933 bytes; the M0 list, saved in a third clean worktree at M0, gives that figure again. All three worktrees are removed.
5. **M-3:** `git cat-file -s 16b3d36045cb3b122bb19baeadbaa22de29e9132:PLAN.yaml` is 412316 on both runs (stdout sha256 b94487c1a11fcf02ed7525994c04ff2bd9af0ec2e4dc548d4f5af4f8bcad2ce9). At M0: 695,917.
6. **E-M** (§5): (a) and (b) hold, and (c) is Amendment 10 item 3. M-2 changed by +25 files and +316,081 bytes. PLAN.yaml's term, −283,601, is (c)'s −291,520 plus main's own PLAN.yaml commits from M0 to S9, +7,919. The other 37 differing paths, +599,682 bytes, are each named with their delta in the record. No listed path is gone.
7. **The script:** `git show <merge commit>:scripts/plan/measure-reads.mjs | sha256sum` is 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1, equal to A's S1 digest; M-1's worktree file has the same digest.
8. **The environment facts:** `rg --version`'s first line is `ripgrep 14.1.1 (rev 575938147b)`, as at M0 (Amendment 2 item 2). `RIPGREP_CONFIG_PATH` is unset. `core.excludesFile` is not set (local, global and system each exit 1). `info/exclude` is present, 541 bytes, sha256 321dffcb77a68a6c079d35da12944866b895b4cc9fb3b1fae72fe9468c7eafeb, as at M0. `C:/dev/wt` and `C:/dev` hold no `.ignore`, `.rgignore` or `.gitignore`. `claude --version` is `2.1.306 (Claude Code)` (2.1.305 at M0); node v24.18.1 and `git version 2.49.0.windows.1`, as at M0.
9. **Invalidators:** I4, I7 and I8 are not raised.
10. **Next:** one scoped reviewer pass over this record, commits and hashes only (§9).

Nothing above is edited.
