# DECISIONS-PENDING.md reduced to its open entries and recent rulings, the rest rotated into state/cut-archive/, one shared helper for the ruling set, and the second measurements after it (PLAN node `governance-decisions-pending-open-and-archive`, piece C of three) — preregistration

**Authority:** the human's direction of 2026-10-14, with its RULED block in `DECISIONS-PENDING.md` (cited by date, never by line). Referenced and not reproduced, except where §2 items 7 and 8 say otherwise:
- the opening paragraph: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:6 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:d743139eef4361c01b61499910e53e1908e38446fb18805fa73532a03547b6f4`
- the measurements: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:8-10 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:feb92776a35b7819248f508e233328ffecc818fd25b40c66738ee0c4f26ee140`
- piece C: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:42-63 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:5701661f4a658b561a142face07f7d201c8fc0e954dbed81e7102106084ee98b`
- the out-of-scope line: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:65 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:e716c0d7120766cb0fef51b9b6d5086dac29a19155e08741be307bc9c27d1034`
- the addendum's C: `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:69 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:3f8034a7e418bafe8457656afc9ccf44d54b17315c4ac1c6f7d511fe02b77722`

- Node: `PLAN.yaml:5291-5307 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:62106dedc89582ed19cb57d26a4742e293e25de250404b5d083e1fac32385cba`.
- Order: after B (`PLAN.yaml:5274-5290 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:13e0b98084d37d9e3e93dcafc2daf234a96a53d7c2c6bd1bdeba014202d75c59`), whose form is `scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md`, and after A (`PLAN.yaml:5257-5273 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:6681016e4017db2a84af3750515fc17d83e3962c67ca4aa16e377be9fd47dc4d`), whose form is `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`. It never takes slot 1. The merge is the human's click.

**Drafted by** the architect agent on the custodian's brief, read at main 76d038d5. **Committed before any code**, as the node's gate. It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating: full, reviewer and architect, from dispatch.**
- By §21a, a property under test (`AUTONOMY.md:315-332 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3`). Four checkers fail closed today: a felt-verdict cite with no ruling, a withdrawn-test rider with no ruling, a hash reference that does not recompute, and a rooted line past its file's end. This piece changes what each of them reads.
- By §21c's size: §7 declares 1,260 lines (`AUTONOMY.md:347-357 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31`).
- Under §25 (e) (`AUTONOMY.md:482 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669`), no five-line form is used.

It touches no ADR, no wire and no security posture. Verdicts are proportional (`AUTONOMY.md:389 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:8a36edc32e678f5c491f84c6c7b6d1cbc5c1b97bf8e86300ffb7a9180196a4c3`).

## §0. Disclosure
- **Read, not run.** The architect has no Bash. Line numbers were read in the main checkout at 76d038d5, and the custodian's hashes confirm each one. `DECISIONS-PENDING.md` and `state/CUT-STATE.md` are cited only by heading, date, round or entry, never by a working-tree line.
- **The three readers, at 76d038d5, with every call site:**
  - **verify.mjs.** `verdictCiteExists` reads the live file through `fs` and searches for a substring: `scripts/plan/verify.mjs:142-164 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:033043f0dd425885376d26b9e648310c9a095248c1e56e7ed4f30b3d8d33cb3a`. Its one product call site is `verifyStatusAgreement`, for a done node with `felt_verdict: true`: `scripts/plan/verify.mjs:260-270 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:b9b3e6ef8a40fa89d33733306b656feb1a461c5f867bce6164633854ecf42f93`. Its test writes the live file into a temporary folder that is not a git repository: `scripts/plan/verify.test.mjs:72-79 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:bf9940043372743db47b3444ef959091aa81bb754f25e44235c0328c55e9a434`.
  - **verify-test-claims.mjs.** `loadDecisionsPending` reads the live file through `fs`, cached by root: `scripts/plan/verify-test-claims.mjs:474-489 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:511508a00558a3417021c1f877009a0c72de2eea38121f83fe0b89adb5049564`. The grammar (the round header, the item inside its block up to the next `**` or `## ` line, and the entry head) and `resolveCitation` are at `scripts/plan/verify-test-claims.mjs:491-529 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:e5875c1fb435dca57f47b654cf014677fd51e5b797f52cf4ad7ae99580ae4213`. There are two call sites, both in `withdrawnRiders`, one for the ruling and one for the carrier: `scripts/plan/verify-test-claims.mjs:554-569 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:ccb3a76517db5de4f5d412e06f7588ad8ed7873d1e9f55774af0fb6529a52b88`. Every fixture that runs `runVerifyTestClaims` is a git repository, because the function itself runs `git ls-files`: `scripts/plan/verify-test-claims.mjs:740-743 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:e57f2ec8893337c44cef7f691421c7528a83800551791952dbb2de2007e98025`.
  - **verify-quotes.mjs.** The hash-scan list is `EXTRA_HASH_SCAN_FILES`, which names the live file, and `defaultHashScanFiles`: `scripts/plan/verify-quotes.mjs:397-408 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:4345b80b5e7b3eb1f31ab63eab33722cd8ff5cd939376b534e0ae6b66f306af7`. Its one call site is the default run: `scripts/plan/verify-quotes.mjs:817 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:7629ab6e1f8ab7e683ab687299c70f91c3b791c3cf16b8a38c440c83d5fd25a9`. The hash pass runs file by file: `scripts/plan/verify-quotes.mjs:854-878 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:d09a47bf47deb4b12501fa1d912e44c42fac5505dafc13c35ce482276d271150`.
- **A fourth reader the directive does not name.** In verify-quotes, a quote passage whose nearest cite is a `DECISIONS-PENDING.md` line cite is checked against that one file. The passage passes only if the live file holds it: `scripts/plan/verify-quotes.mjs:339-355 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:efa627a735a4c99e687f0896a017580724e53a1c461b2622d150498d8ea59c52` and `scripts/plan/verify-quotes.mjs:892-917 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:79089c1e59ab9a0401d149552295bbac21fda8bc12f9d96a7f2bc7719930a204`. One candidate, not yet confirmed as a gated passage, is `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md:27 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:43fa82e9a27565073fcc45215f2377911f3ad9c7682df958cdb16a79d68e1bb4`. S0 (§4) settles it. That is OPEN-2.
- **verify-cites, with the live file's name as a bare path.**
  - **Resolution.** `resolveRef` resolves the path relative to the citing file's folder (`scripts/plan/verify-cites.mjs:179-203 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:37e84e1369824840a5de76c7c2f1c173e59398de4fc48114ae4d575f40e05acc`). From a root-level file it resolves exactly, so a line past the end is `oob-exact` and gated. From any other folder it resolves by suffix only, so the same line is `oob-suffix` and advisory (`scripts/plan/verify-cites.mjs:241-256 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:b366489b0e2c6149a901184500726649c88bf0a7aa556146609282937a8d4537`, `scripts/plan/verify-cites.mjs:312-357 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:fa8fec917e9d4f9cbf588f1a7c15446fc8ff2f4da6c2718ebd324d2773a419d1`).
  - **What that means for item 7.** C.7's premise holds for citing files in subfolders. It does not hold for root-level ones. The root-level line cites into the ledger, read by Grep on 2026-10-14, are:
    - `PUBLIC-AUDIENCE-AUDIT.md:70 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:334e8b871d5b5ca23b9c945c47622492ad197114d6e358c2cf0f2ea6deaf0b87`, `PUBLIC-AUDIENCE-AUDIT.md:75 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:75ac0a058c86b4f424ff253085aa0ab6f8da91c6cc46ef7fd1519137fde1afcf` and `PUBLIC-AUDIENCE-AUDIT.md:234 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:9ec3c162f62d18341b1a5bdee031abe4a7bc257da59c54a6d17f775faed7fd33`, naming ledger lines 1056, 359 and 230 to 261;
    - six in `PRECEDENTS.md:217-291 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:f831596eb21a5f0f902999b1079762fcadf984595535b6bd0dd0f02257b529c5`, naming lines 8 to 16;
    - two in `KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md:9-15 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:5d55197a5f2f523f8c8042c3eb895b414968915790aea57977d86e33f5db6fbd`, naming line 57.
  - **The count.** The same Grep found 118 `DECISIONS-PENDING.md:<digits>` tokens across 43 tracked files, pinned ones included. The worker recounts at M0.
- **The ledger's shape at 76d038d5, by heading.** Read by Grep on 2026-10-14 in a checkout the custodian may have changed since. The worker recounts at M0.
  - **Headings:** the title `# Decisions pending the human`, a two-line italic preamble, `## Pending`, `## Resolved`.
  - **The blocks.** Under `## Pending` come two FELT VERDICTS blocks (Part N, and the 2026-09-14/15 sitting, both marked CLOSED), then DIRECTIVE and RULED blocks newest first, then three CLOSED blocks dated 2026-10-03.
  - **The numbered entries** follow, from 136 down to 1, with gaps. One RULED block sits between entries 55 and 54: the 2026-09-07 ruling on entries 52 to 54.
  - **Entry heads.** Entries 136 to 116, 51 to 49, 37 to 22 (where present), 15 to 12 and 8 open with a RULED, RESOLVED or APPLIED marker. The heads of entries 115 to 52, 48, 47 to 38, 24, 5, 4, 2 and 1 carry none, although RULED blocks rule many of them. Entry 24's head reads "(a)–(c) RESOLVED" and entry 48's reads "THIRD ATTEMPT AUTHORIZED".
  - **Size.** A Read of the region holding entries 118 to 93 went over the tool's 25,000-token page. That suggests the unmarked entries alone may come near or past 153,600 bytes. This is a hypothesis, and S0 measures it.
  - **Hash references.** The file holds one: in the RULED block of 2026-10-04, question round 46, a rooted path pinned at 1445eaf3. Its resolution does not depend on the citing file's folder.
- **What A leaves (A's §2 item 7, `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:132-143 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:03893d61cc1badb4cdaf3272cdd98a1450fae49482c6f7eed848466d8ad284b3`) and A's procedure (`scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:116-126 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:b291438923e2f99eb89a9a6676de438cf656fc2e8604fc58ce76fcda8cc2f094`).** Part 3 runs from `## Pending` to the next `^## ` line: `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:94 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:552645973b6c4102c402f844f8d564b2995ef866b7b51e5edc5bd702661bb83f`.
- **What B leaves (B's §2 item 9, `scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md:250-255 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:c9885915e728134aac67eb5393a8ef7e4b9f76f35f2bd16a69520c023fb561e4`).** B's rotation script and notice are at `scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md:155-191 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:6c32af3aa69a837e28460cb8a7552dac2f58d998a2a3423cf4419bbdf8ecc410`, and its freeze model at `scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md:256-276 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:2a0cab3519dc290720ecd3b36b81826bddd79af480a0fba9d8929a0dfa8d79a6`.
- **The reading order.** `READING_ORDER`: `scripts/hooks/session-resume.mjs:28-34 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:8a75b10138aee685a7a7f68a47658c5430301e4c9118eb0c4e2b7ae5ad8dfd33`. Item 3 is line 31. No test asserts item 3's words. The include checks are self-referential (`scripts/hooks/hooks.test.mjs:1230 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:3acb2a71ba9fc308f818d6f954e81b3cb5ed3714767747d274cbf72c5be0a668`, `scripts/hooks/cloud.test.mjs:96 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:0ee45cc300a81b812e5caf7774d13584c862bd83554cff1e42686144bd289181`). T17 (`scripts/hooks/hooks.test.mjs:1314-1325 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:fdec8412df2256b558cb04806f72e01b9dea1ea4aeb4db09f25be618bf79f0f9`) finds the first line that holds `DECISIONS-PENDING.md`, `state/directives/` or `PRECEDENTS.md`. AUTONOMY's §0 item 3 is at `AUTONOMY.md:11 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:4f04374c18e399bd0c10bc4a5f6278ab5ba86fa420a11d46bcdee87658f0e71a`.
- **CI's path filters** (`.github/workflows/governance-ci.yml`, lines 77 to 112 at 76d038d554913faae4165f6f1a20fd6c7175486a, sha256 2ffe6f47677dab25c55a30d4c3755f4933156c476b66b27643361c5b9b554187; a dot-prefixed path, written in words) name neither `DECISIONS-PENDING.md` nor `state/cut-archive/`. A rotation commit on main runs no CI, and the same is true today of a RULED commit. §2 item 5 makes the checks part of the rotation step.
- **Reuse index.** The custodian ran `node tools/reuse.mjs` in the read-only clone of `christopherdonini/spatial-ide-reuse` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The output below is byte-copied from the custodian's brief:
  - `decision log`, exit 1: `No prior art recorded for "decision log". Research it before planning an implementation.`
  - `archive`, exit 0: `capability: static-tile-archives → PMTiles [WATCH], tippecanoe [CONCEPTUAL], qgis2web [CONCEPTUAL]   (open, P2)`
  - `ruling lookup`, exit 1: `No prior art recorded for "ruling lookup". Research it before planning an implementation.`

  The one hit concerns archives of map tiles, not archives of records, so this piece has no prior art. The design rests on B's rotation and on the code cited above.
- **Concurrent pieces.**
  - A and B append AUTONOMY sections first, so C's section number is B's plus one (`<n>` below).
  - B's verify-cites rule depends on its OPEN-1 (`scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md:415-418 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:f247c6b60b4b6d836fdc065783990e5c199082904263886d3f6a6120e6b7f3bc`). C holds under either answer (§2 item 3).
  - "150 KB" follows B's OPEN-3 (ii) (`scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md:423-427 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:c53760e9a60141914dd9ee95ee713ebce20250ef6e6e09604f934d4124777353`).
  - C's notice names P under either of B's OPEN-4 (b) answers (`scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md:428-431 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:d13b85a6a6347f17ab93414ef1d69b4640cbbc408ce664a5225341448aa130e5`). The reason: C's migration commit is a branch commit, and a notice may only name a main commit (round 15 (e)).
  - For B's gate: B's drafted item-1 sentence names `PRECEDENTS.md`, which T17's first-occurrence search would read as step 5's line. C's item-3 line names neither `PRECEDENTS.md` nor `state/directives/`.
- **Machine.** Nothing here is a heavy run.

## §1. May and may not claim
**May claim**, each at the recorded commit:
1. Every reader resolves each record against one file of the ruling set at a time. Nothing joins two files (T3a, T3b).
2. A ruling found only in an archive resolves. A ruling in no file still fails. An invalid hash in an archive still fails (T1a, T1b, T2a, T2b, T4).
3. The ruling set's archives are listed through git, in a fixed order. A git failure throws and never narrows the set (H1, H2).
4. `rotate-decisions-pending.mjs`, when due, stages a `git mv` whose archive blob equals P's `DECISIONS-PENDING.md` blob. It writes the new file's exact text, keeps every numbered entry without a resolution marker unless one is named, writes nothing when it is not due or refuses, refuses over the size cap, and is run by no hook (R1 to R12).
5. Every existing check gives the same results before and after the code (D1-a) and before and after the migration (D1-b), within §5's named differences.
6. An unpinned line cite into `DECISIONS-PENDING.md` past the new file's end is advisory, from any citing folder (V1, and E-V at S10).
7. `READING_ORDER` item 3 holds the directive's words (S3).

**May not claim:**
- That an unpinned line reference written before a rotation still points at its text. The notice is the way back.
- That the obligation sheet finds every obligation. It is a reading, flagged by script and resolved by the custodian, and the human checks what is left.
- That the after-C routine-read figure is typical of a month. It is taken at the low point of the monthly cycle (§2 item 10).
- Any token count or context size.
- Anything on macOS.

**Unchanged:**
- `scripts/plan/measure-reads.mjs`;
- B's files, except the one change named in §2 item 11;
- `flush.mjs`, `precompact-flush.mjs`, `stop-queue.mjs`, the Guardian's hooks;
- `.claude/settings.json` and the CI workflows (both written in words);
- `PLAN.yaml` on the branch;
- `scripts/plan/verify-quotes.baseline.json`;
- every existing byte of `AUTONOMY.md`;
- every existing test's name and assertion. The one exception is one fixture line in `scripts/plan/verify.test.mjs:72-79 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:bf9940043372743db47b3444ef959091aa81bb754f25e44235c0328c55e9a434`: `git init` in its temporary folder.
- The bytes of `DECISIONS-PENDING.md` at P, which move whole.

## §2. The change
1. **`scripts/plan/rulingSet.mjs`, the shared helper.** It uses Node's standard library only. Its git calls use an argument array and a 64 MiB buffer.
   - `LIVE_RULINGS = 'DECISIONS-PENDING.md'`.
   - `ARCHIVE_RULINGS_RE = /^state\/cut-archive\/DECISIONS-PENDING-[^/]*\.md$/`, the directive's glob taken literally: the folder itself, no subfolders.
   - `rulingSetPaths(tracked)` is pure. It returns `[LIVE_RULINGS, ...archives]`, the archives being the tracked paths that match, in ascending code-unit order. This is the fixed order.
   - `trackedPaths(repoRoot)` runs `git ls-files -z`. Any git failure throws.
   - `readRulingSet(repoRoot, tracked = trackedPaths(repoRoot))` returns `[{ path, text }]`.
     - The live file is read from the working tree when it exists, as each reader does today.
     - Each archive is read from the working tree. A tracked archive missing from disk throws.
   - Each export has a product caller in item 2.
2. **The readers.** Each resolves a record inside one file of the set at a time.
   - (a) **`verdictCiteExists`**, lines 158 to 163.
     - A missing live file fails as today.
     - The function returns true when `readRulingSet(repoRoot)` holds a file whose text includes the needle. Its reason names the set.
     - The RELEASE branch and the prefix check are unchanged. Its one call site is unchanged.
   - (b) **`loadDecisionsPending(root)`** returns the array of the set's texts, cached by root, through `rulingSetPaths(gitList(root))`.
     - `resolveCitation(texts, citationText)` is false for an empty array. Otherwise it returns `texts.some(...)` over today's per-text logic, which is unchanged.
     - Both call sites in `withdrawnRiders` are unchanged.
   - (c) **verify-quotes's hash-scan list.** `'DECISIONS-PENDING.md'` leaves `EXTRA_HASH_SCAN_FILES`. Every path of `rulingSetPaths(index.files)` that `index.set` holds joins `defaultHashScanFiles`. An explicit `--files` run is unchanged.
   - (d) **Under OPEN-2 (A), and only if S0 shows a difference:** in the named-file gate, when the one named file is the live ruling file, a passage passes when one file of the set holds it, each file normalized on its own. Under OPEN-2 (B) or (C), (d) is not built.
3. **verify-cites.** An unpinned cite whose candidates are exactly the live ruling file goes to the advisory tier, wherever the citing file sits. A pinned one stays gated at its pin.
   - Under B's OPEN-1 (B), B's unpinned-target rule gains `DECISIONS-PENDING.md` as a second target, about 2 lines.
   - Under B's OPEN-1 (A), C adds the rule with its one target, about 8 lines, in `runVerifyCites` after `checkCitation`.
   - Either way, `ARCHIVED_PREFIXES` is unchanged.
4. **What an open entry is, at a revision.**
   - **The section** runs from the line after the line whose trimmed text is `## Pending` to the next `^## ` line, or the end of the file.
   - **A unit head** is a line matching `^\*\*(RULED|DIRECTIVE|FELT VERDICTS|CLOSED) ` (a block), or `^\d+\.\s*\*\*` (a numbered entry). Every other line belongs to the unit above it, including bold lines inside a unit such as `**Recommendation:**`, `**Item 1 —`, `**PREMISE CORRECTION` and `**Class fix`. Lines before the first head are dropped.
   - **A unit's text** runs from its head through the line before the next head or the section's end, with trailing blank lines dropped. For a numbered entry, a line starting `Archived copy: ` is dropped, because item 5 replaces it.
   - **Archived:**
     - every block unit;
     - every numbered entry whose head matches `^\d+\.\s*\*\*\[(RULED|RESOLVED|APPLIED)\b`, the same shape verify-test-claims reads as an entry ruling;
     - every entry named by `--archive-entries`;
     - the title's preamble and `## Resolved`, which stay in the archive and are not copied.
   - **Kept (open):** every other numbered entry. When in doubt, an entry stays.
   - **Doubtful kinds, with the recommendation for each (OPEN-1):**
     - FELT VERDICTS, DIRECTIVE and CLOSED blocks are archived. All are closed records, and a felt-verdict cite still resolves through item 2 (a).
     - Entry 24 (a partial head) and entry 48 (an authorisation head) are kept unless named.
     - Entries 1, 2, 4 and 5 (no bracket) are kept unless named.
5. **`scripts/plan/rotate-decisions-pending.mjs`.** It uses Node's standard library, `rulingSet.mjs`, `loadPlan` from `plan.mjs`, and `archiveNameFor` and `noticeLine` from `rotate-cut-state.mjs` (item 11). It uses a 64 MiB buffer and an argument array for every git call. It never fetches, commits or pushes. Its exports are `parseUnits`, `classify`, `isDue`, `buildLiveText` and `obligationRows`, each called by its own `main`.
   - **Refusal (exit 2, nothing written).** It refuses when:
     - `git status --porcelain` shows a tracked change;
     - `HEAD` does not equal `@{u}`;
     - `git rev-parse HEAD:DECISIONS-PENDING.md` differs from `git rev-parse origin/main:DECISIONS-PENDING.md`. This one check stands in for B's branch check: on main it holds when HEAD is level with origin, and on C's branch after main is merged in it names the same blob;
     - `## Pending` is missing;
     - an `--archive-entries` number is not an unmarked numbered entry at HEAD;
     - the suffix would pass `-99`;
     - any git call fails.
   - **P** is `git rev-parse origin/main`, the main commit at which the live path holds the bytes that move.
   - **Due** (`isDue({ lastArchiveIso, nowIso, sizeBytes })`). It is due when any of these holds:
     - no tracked archive matches;
     - the `%cI` of the newest commit that added a matching archive (`git log -1 --diff-filter=A --format=%cI -- ':(glob)state/cut-archive/DECISIONS-PENDING-*.md'`) is before the most recent first of the month at 00:00Z, read from the machine clock in UTC;
     - `git cat-file -s HEAD:DECISIONS-PENDING.md` exceeds 153,600.

     When it is not due, it prints one line (the newest archive's time, that first of the month, the size), writes nothing and exits 0.
   - **The size guard (exit 3, nothing written).** If the new file's text would exceed 153,600 UTF-8 bytes, it prints `rotate-decisions-pending: not rotating — the open entries alone make DECISIONS-PENDING.md <n> bytes, over 153,600; tell the human.` and exits 3. This applies to both triggers and to the first migration (OPEN-4 (iii)).
   - **`--dry-run`** writes nothing. It prints the kept units (number, the head's first 160 characters, the archive line), the archived units by kind, the new text's byte count and blob id (`git hash-object --stdin`, no `-w`), and item 6's rows. The custodian uses it before every rotation.
   - **When due:**
     - The name is `archiveNameFor('DECISIONS-PENDING', <UTC date from the machine clock>, …)`, with B's collision rule.
     - `git mv DECISIONS-PENDING.md state/cut-archive/<name>`.
     - It writes the new `DECISIONS-PENDING.md` (LF, one final newline), in this order:
       - `# Decisions pending the human`;
       - a blank line;
       - `noticeLine(<name>, <P>)`, B's one line;
       - a blank line;
       - `## Pending`;
       - then, for each kept unit in file order: a blank line, the unit's text, a blank line, and `` Archived copy: line <L> of `state/cut-archive/<name>`. ``

       L is the unit's head line in the archive, counted from 1. It is given in words, with no `path:line` token (OPEN-3).
     - `git add DECISIONS-PENDING.md`.
     - It asserts that `git rev-parse :state/cut-archive/<name>` equals `git rev-parse <P>:DECISIONS-PENDING.md`. A mismatch prints STOP and exits 2, with no rollback.
     - It prints the staged paths, both blob ids, the new file's bytes and the next steps (item 5's procedure). It exits 0.
   - **The procedure, a session-start step** (AUTONOMY §`<n>` part B), never in a hook. It has its own script and runs right after B's `rotate-cut-state.mjs`, in the same step and after the same lease and fetch:
     1. Run `--dry-run`. When due, resolve every obligation row (item 6) first.
     2. Run the script.
     3. Before committing, run `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify.mjs --offline` on the staged tree. Compare their exit codes and gated findings with the same four run on HEAD.
     4. If they are equal, commit `chore: rotate DECISIONS-PENDING.md to state/cut-archive/<name>` (signed off) and push.
     5. If they differ, restore the index and both paths from HEAD, commit nothing, and tell the human.
     6. Exit 3: no rotation, and the human is told.
6. **Obligations (C.2).**
   - **Found by:** `obligationRows`, one row per unit the run archives. Each row gives:
     - the kind, the head's first 160 characters, and the archive line;
     - every PLAN node id the unit names as a whole word, with its status at HEAD (through `loadPlan`);
     - a flag when the unit's text holds one of these words: `owed`, `owes`, `waits`, `pending`, `held`, `until`, `before`, `next`, `follow-up`, `queued`, `later`, `not yet`, `deferred`.
   - **Resolved by the custodian, every row,** as one of:
     - `represented: <PLAN node id, not done>`;
     - `represented: continuity block, <field>`;
     - `done: <evidence>`;
     - `no obligation: <one-line reason>`;
     - `not represented`.
   - **An obligation, as read here (OPEN-4 (i)),** is owed work not yet done. A standing rule inside an archived ruling stays binding where it is filed and is found through item 3's search.
   - **The first migration.**
     - The sheet is filed at `state/drafts/decisions-pending-c-obligations.md` on the branch.
     - The PR body lists every `not represented` row in full before the merge, with the counts by resolution.
     - A row the custodian places before the merge goes to PLAN by its own PR (round A1) or into the continuity block within B's cap.
   - **Monthly rotations.** No rotation runs while a row stands `not represented`. The custodian places it first, or tells the human.
   - **Checked by:**
     - the gate-1 reviewer, every row mechanically (a named id exists at G0 with a status other than done, a named field exists in the block at G0, a `done` row names its evidence);
     - the architect, every flagged row resolved `no obligation`;
     - the human, the `not represented` list.
7. **`READING_ORDER` item 3.** It becomes `3. DECISIONS-PENDING.md — ` followed by the human's words, byte-copied by script from inside the quotes of `state/directives/2026-10-14-governance-smaller-reads-ignore-cut-state-rotation-decisions-pending.md:62 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:122a1c2a9ef46e8e05f4c36a3d74645367c584b37154d7a85f77757e89b34638` (a sub-line span, carrying the whole line's hash). The text, shown here for sight:

```text
3. DECISIONS-PENDING.md — the open entries and recent rulings; search older rulings by date, round or entry in DECISIONS-PENDING.md and state/cut-archive/DECISIONS-PENDING-*.md, never read them whole.
```

   - **What pins the old text.** No test or check asserts item 3's words.
     - T17 finds the first line holding `DECISIONS-PENDING.md`. That is still item 3's line, and the line holds neither `state/directives/` nor `PRECEDENTS.md`.
     - A's T1 imports `READING_ORDER`.
     - The stale-continuity form blocks an edit to the header only, and the header is unchanged.
   - **AUTONOMY §0 item 3** is not edited. §`<n>` says how it is read.
8. **`AUTONOMY.md` §`<n>`,** appended after the last line of B's section.
   - **Title:**

```text
§<n>. DECISIONS-PENDING.md holds the open entries and recent rulings; the resolved part rotates into state/cut-archive/ (the human, 2026-10-14; that directive's piece C and the addendum's C; appended after §<n-1> so that no line a record cites above it moves)
```

   - **Part A, the rule.** The directive's C.5 to C.7 (lines 59 to 63) and the addendum's C (line 69) are reproduced, byte-copied by script and marked, each with its pin and hash, in a `text` fence. C.1 to C.4 are referenced and not reproduced.
   - **Part B, the custodian's instantiation, not a quotation:**
     - (i) The ruling set, as in item 1. The three readers, and under OPEN-2 (A) the fourth.
     - (ii) What an open entry is, as in item 4. When an open entry is ruled, its head gains the marker `[RULED <date> — question round <n>; see the RULED block at the top; recorded as filed:]`, as entries 119 to 136 carry it, so that the next rotation archives the entry.
     - (iii) Item 5's procedure and item 6's obligation check. No hook runs the script.
     - (iv) Line references. One written before a rotation resolves through the notice. A ruling is cited by date and round, or the line is pinned, in the form OPEN-3's answer sets.
     - (v) §0's item 3 is read as `READING_ORDER`'s item 3. §0 is not edited.
9. **Dates.** No date is typed anywhere.
   - The archive name comes from the machine clock in UTC, the clock `date -u` reads.
   - The due rule reads the archive commits' `%cI` and the machine clock.
   - Held RULED blocks and ledger entries carry the transcript's receive time, or `date -u`.
   - The closing record's times come from `%cI`.
10. **A's anchors, the after-C measurement and C's closing record.**
   - **Anchors** (A's §2 item 7 (c)). `DECISIONS-PENDING.md` stays at the root, and `## Pending` and the open entries stay under it. `## Resolved` goes, so part 3 runs to the end of the file. `measure-reads.mjs` is not touched.
   - **Effect on the after-C figure.** At C's merge commit, part 3 holds only the kept units and their archive lines, because held RULED blocks land after the click. That is the low point of the monthly cycle, and part 3 grows with every RULED block until the next rotation. M-2 loses the archived file's bytes, which sit under `/state/cut-archive/`.
   - **The run** follows A's §2 item 5 procedure unchanged, at C's merge commit on main (A's §2 item 7 (b)). The migration is in that commit (item 12).
     - **M-1:** in a worktree detached at the merge commit, `node scripts/plan/measure-reads.mjs routine <merge>`, twice, with byte-identical outputs.
     - **M-2:** A's four steps with `<M0>` replaced by the merge commit.
     - **Recorded:** the environment facts, any fact that differs named beside its figure, and `git show <merge>:scripts/plan/measure-reads.mjs | sha256sum`, which must equal A's S1 digest.
   - **C's closing record** is a class 1 amendment on main after the merge, references and hashes only. It holds:
     - the merge commit and its `%cI`;
     - the migration commit, the archive path and blob id, and P;
     - M-1 and M-2, each with its stderr line, output sha256 and second run;
     - the script's sha256;
     - the environment facts;
     - the last `CUT-STATE` rotation commit and its `%cI` (B's §2 item 8);
     - A's baseline row, named by A's form and amendment number.

     The custodian gives the human both pairs.
11. **B's item 9, reused.**
   - **(a)** The folder, the name and the collision rule, through `archiveNameFor` with the stem `DECISIONS-PENDING`.
   - **(b)** The notice, through `noticeLine`, with `<commit>` as P.
   - **(c)** The whole-file move in one commit with the live rewrite, and blob-id equality.
   - **(d)** C reads B's merged exports first. If `archiveNameFor` does not take the stem, C changes it to take the stem as its first argument, and B's call site passes `'CUT-STATE'`. That is at most 8 lines in `rotate-cut-state.mjs`, and B's R2 stays green unchanged. `noticeLine` is used as merged.
   - **(e)** No shared module is made.
12. **Order, and freezing main.**
   - **Branch commits.** The branch is `cut/decisions-pending-open-and-archive`, in worktree `C:/dev/wt/dpa`, from M0 (main after B's merge; the custodian names it at dispatch).
     - S0: no commit, the probe (§4).
     - S1: `rulingSet.mjs` with H1 and H2.
     - S2: verify.mjs with T1a, T2a and T3b, and the fixture line.
     - S3: verify-test-claims with T1b, T2b and T3a.
     - S4: verify-quotes with T4, plus Q1 and Q2 under OPEN-2 (A).
     - S5: verify-cites with V1 and V2.
     - S6: the rotation script with R1 to R12, and item 11 (d) if needed.
     - S7: `READING_ORDER` with S3.
     - S8: AUTONOMY §`<n>`, after OPEN-3 and OPEN-4.
   - **D1-a**, M0 against S8.
   - **G0, the gates.** Both gates run at S8. The PR body carries a dry run against main's current ledger blob: the kept list, the sizes, the obligation sheet, the S0 results and the predicted D1-b.
   - **The human's check.** The human checks the kept list and the `not represented` list in the PR body (OPEN-1), and says when the click is next.
   - **F0, the freeze.** From here until the click, main takes no commit. RULED blocks, directive files and ledger entries wait in a scratch file outside the repository, each with its receive time. The human is told the order.
     - The custodian merges `origin/main` into the branch (S9).
     - S10 is the script run on the branch, then the commit and push.
     - D1-b, S9 against S10.
     - E-V, verify-cites at S10: every unpinned `DECISIONS-PENDING.md` line cite past the new end is listed advisory, and none is gated.
     - Any RULED block added between G0 and F0 gets its obligation rows.
     - The kept list at F0 must equal G0's by entry number, or the difference goes to the human before the click.
   - **After the click,** before any other main commit: the held RULED blocks go to the top of `## Pending` in one commit, then push. Then a ledger-only flush and push. Then the after-C measurement (item 10).
   - **Withdrawal.** Main was never touched, so nothing is restored. The freeze lifts, and the held blocks are appended to the unchanged file.
13. **Portability (R3).** There is no OS-conditional code. Paths from git use `/`, and `fs` paths go through `path.join`. Windows is supported (the live rows) and Linux is supported (CI runs every test). macOS is not observed. There is no user-visible reduction.

## §3. Fixtures
- **Temporary git repositories with a bare `origin`,** for H1, H2, T1 to T4, Q1, Q2, V1, V2 and R1 to R11. Their texts hold `é` and `→`. Synthetic ledgers follow the real grammar (the round header, `- *Item M —`, entry heads, the four block kinds).
- **R11's repository** holds:
  - a RULED round block with an item;
  - a FELT VERDICTS block;
  - a pinned hash reference;
  - an entry with a RULED head marker, and an unmarked entry;
  - `## Resolved`;
  - a preregistration with a withdrawn-test row that cites the round and the entry.
- **The real tree,** for S0, D1-a, D1-b and E-V. It is never edited by a test.

## §4. Tests, each with its mutation, and the probe
Each mutation is applied, the named test fails, the failure is recorded by name with its commit in a `RECORDED MUTATION:` comment, and the mutation is reverted. That run is the observation of record, never `verify-mutation` (`docs/PREREGISTRATION-TEMPLATE.md:172 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2`).
- H1 `rulingSet: the set is the live file, then every tracked state/cut-archive/DECISIONS-PENDING-*.md in ascending path order; an untracked one is left out`. **MH1:** archives listed by reading the folder on disk.
- H2 `rulingSet: a git failure throws and never narrows the set to the live file`. **MH2:** the failure caught and the live file returned alone.
- T1a `verify: a felt-verdict cite found only in an archived DECISIONS-PENDING file resolves`. **MT1a:** `verdictCiteExists` reads the live file alone.
- T2a `verify: a felt-verdict cite in no file of the ruling set still fails`. **MT2a:** an archive's presence counted as a hit.
- T3b `verify: a cite split across the end of the live file and the start of an archive does not resolve`. **MT3b:** the set's texts joined with no separator before the search.
- T1b `verify-test-claims: a withdrawn-test row whose ruling sits only in an archived DECISIONS-PENDING file is withdrawn`. **MT1b:** `loadDecisionsPending` reads the live file alone.
- T2b `verify-test-claims: a ruling in no file of the ruling set still fails by name`. **MT2b:** `resolveCitation` returns true when the set holds more than one file.
- T3a `verify-test-claims: a round header at the end of the live file and its item at the start of an archive never combine into a ruling`. **MT3a:** the texts joined with `\n` before resolving.
- T4 `verify-quotes: an invalid hash reference in an archived DECISIONS-PENDING file still fails by name`. **MT4:** the archives left out of the hash-scan list.
- Under OPEN-2 (A) only:
  - Q1 `verify-quotes: a passage introduced by a DECISIONS-PENDING.md cite and found only in an archived file passes`. **MQ1:** the named-file search reads the live file alone.
  - Q2 `verify-quotes: a passage introduced by a DECISIONS-PENDING.md cite and found in no file of the ruling set fails by name`. **MQ2:** an archive's presence counted as found.
- V1 `verify-cites: an unpinned DECISIONS-PENDING.md line cite past its end from a root-level file is advisory`. **MV1:** the rule removed.
- V2 `verify-cites: a pinned DECISIONS-PENDING.md line cite whose pin fails stays gated`. **MV2:** the rule applied to pinned cites as well.
- R1 `rotate-decisions-pending: a due rotation stages the archive byte-identical to HEAD's DECISIONS-PENDING.md and the new file's exact text`. **MR1:** the archive written by reading the text and rewriting it with its final newline trimmed.
- R2 `rotate-decisions-pending: a numbered entry without a resolution marker stays, and one with RULED, RESOLVED or APPLIED at its head is archived`. **MR2:** unmarked entries archived.
- R3 `rotate-decisions-pending: RULED, DIRECTIVE, FELT VERDICTS and CLOSED blocks and the Resolved section are archived, and a bold line inside an entry is not a head`. **MR3:** any line starting `**` taken as a head.
- R4 `rotate-decisions-pending: each kept entry is followed by the archive line it came from, and an earlier archive line is replaced`. **MR4:** the line counted from 0.
- R5 `rotate-decisions-pending: --archive-entries archives only unmarked numbered entries present at HEAD and refuses any other number`. **MR5:** an absent number ignored instead of refused.
- R6 `rotate-decisions-pending: due when the last archive is before the first of the month at 00:00Z, and not due when it is at that instant`. **MR6:** the comparison made `<=`.
- R7 `rotate-decisions-pending: a file over 153,600 bytes is due mid-month, and one of exactly 153,600 is not`. **MR7:** `>=`.
- R8 `rotate-decisions-pending: when the open entries alone make the new file over 153,600 bytes it exits 3, writes nothing and says to tell the human`. **MR8:** the guard removed.
- R9 `rotate-decisions-pending: refuses with exit 2 and writes nothing on a modified tracked file, HEAD not equal to its upstream, or a DECISIONS-PENDING.md blob that differs from origin/main's`. **MR9:** the blob check removed.
- R10 `rotate-decisions-pending: --dry-run writes nothing and lists the kept units, the archived units and one obligation row per archived unit`. **MR10:** `--dry-run` stages the move.
- R11 `rotate-decisions-pending: after a rotation commit the readers find the moved rulings in the archive: a felt-verdict cite, a withdrawn-test ruling and a pinned hash reference`. This is the seam test from the real shape. It uses the real CLI, then `verdictCiteExists`, `runVerifyTestClaims`, `runVerifyQuotes` and `runVerifyCites` with `repoRoot`. **MR11:** the archive written under `state/archive/`.
- R12 `rotate-decisions-pending: no hook in .claude/settings.json runs the rotation script`. **MR12:** a SessionStart entry running it.
- S3 `session-resume: reading-order item 3 is the open entries and recent rulings, with older rulings searched by date, round or entry, never read whole`. **MS3:** the old item 3 restored.

**S0, the probe, before any code.** In a throwaway worktree detached at M0:
1. Run `verify.mjs --offline`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify-mutation.mjs`, recording each one's exit code, stdout sha256 and stderr.
2. Move the ledger to a probe archive name.
3. Write a live file holding only the title, a notice and `## Pending`.
4. Commit locally. The commit is never pushed.
5. Run the five again.
6. Record every difference, and the byte count of the units item 4 would keep.
7. Remove the worktree.

S0 settles OPEN-2's condition, and it shows which root-level cites become gated under today's verify-cites.

## §5. Predictions · declared unchanged · invalidators
- **Predictions.** A wrong prediction is a result (class 2).
  - **S0:**
    - verify.mjs fails on every felt-verdict cite into a moved block;
    - verify-test-claims reports every withdrawn-test row whose ruling or carrier moved;
    - verify-quotes reports no hash finding;
    - verify-cites gates only unpinned root-level `DECISIONS-PENDING.md` cites past the probe file's end, the four `PUBLIC-AUDIENCE-AUDIT.md` tokens among them.
  - **No numeric prediction** is made for the kept size.
  - **D1-a and D1-b** (below).
  - **E-V:** zero gated, and every unpinned past-end cite is listed advisory.
- **D1-a, declared unchanged between M0 and S8:**
  - the exit code, stdout sha256 and stderr sha256 of `verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify-mutation.mjs`;
  - CI's `node --test` globs, by pass and fail counts, rising only by the new tests.
- **D1-b, declared unchanged between S9 and S10:**
  - the same five checks by exit code and stdout sha256, except verify-cites's stdout advisory count;
  - stderr identical, except two named classes:
    - (1) verify-cites's advisory list gains the unpinned `DECISIONS-PENDING.md` line cites whose line passes the new file's end;
    - (2) any advisory line whose citing file was `DECISIONS-PENDING.md` reappears with the archive path at the same line.
  - Nothing is removed from any list, and nothing gated is added.
  - `node --test` counts are equal.
- **Invalidators. Each is a STOP, and goes to the human:**
  - I1: D1-a differs.
  - I2: D1-b differs outside its two classes.
  - I3: the kept text exceeds 153,600 bytes (exit 3) at G0 or F0.
  - I4: the archive blob differs from P's.
  - I5: B's merged `archiveNameFor` or `noticeLine` cannot be reused without changing B's tested behaviour.
  - I6: S0 shows a difference that neither item 2 nor item 3 covers.
  - I7: the kept list at F0 differs from G0's and the human has not seen it.

## §6. Instruments
- **Assertions:** H1, H2, T1a to T4, Q1 and Q2 (conditional), V1, V2, R1 to R12, S3, D1-a, D1-b and E-V.
- **Evidence:**
  - the S0 table;
  - the G0 dry run (the kept list, the sizes, the sheet);
  - S10's blob ids: `git rev-parse <S9>:DECISIONS-PENDING.md`, `git rev-parse <S10>:state/cut-archive/<name>`, and `git rev-parse <P>:DECISIONS-PENDING.md`;
  - `git diff --no-renames --name-status <S9> <S10>` listing exactly the two paths;
  - E-V's advisory listing;
  - the after-C figures (item 10).

  Every row names its commit.

## §7. Declared values and ceilings
- **Values:**
  - the size cap of 153,600 bytes (B's OPEN-3 (ii));
  - the month starts on the first at 00:00Z;
  - suffixes run to `-99`;
  - exit codes are 0, 2 and 3;
  - git `maxBuffer` is 64 MiB;
  - the archive pattern is item 1's;
  - the obligation words are item 6's.
- **Line budget: at most 1,260 lines over at most 16 files.**
  - `scripts/plan/rulingSet.mjs`: 70
  - `scripts/plan/rulingSet.test.mjs`: 90
  - `scripts/plan/verify.mjs`: 15
  - `scripts/plan/verify.test.mjs`: 70
  - `scripts/plan/verify-test-claims.mjs`: 20
  - `scripts/plan/verify-test-claims.test.mjs`: 110
  - `scripts/plan/verify-quotes.mjs`: 25
  - `scripts/plan/verify-quotes.test.mjs`: 110
  - `scripts/plan/verify-cites.mjs`: 10
  - `scripts/plan/verify-cites.test.mjs`: 45
  - `scripts/plan/rotate-decisions-pending.mjs`: 240
  - `scripts/plan/rotate-decisions-pending.test.mjs`: 380
  - `scripts/plan/rotate-cut-state.mjs`: 8, only under item 11 (d)
  - `scripts/hooks/session-resume.mjs`: 2
  - `scripts/hooks/hooks.test.mjs`: 20
  - `AUTONOMY.md`: 45
- **Counting command**, run at S8 and at the PR head: `git diff --numstat "$(git merge-base origin/main HEAD)" HEAD -- . ":(exclude)scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md" ":(exclude)DECISIONS-PENDING.md" ":(exclude)state/cut-archive" ":(exclude)state/drafts" ":(exclude)CUSTODIAN-QUEUE.md" ":(exclude)CUSTODIAN-QUEUE.json" ":(exclude)site" | awk '{n+=$1+$2; f++} END {print n, f}'`. The moved ledger and the new live file are data written by the script and proven by blob ids, not code.
- An overrun is class 8, and this line is never edited to match (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 76d038d554913faae4165f6f1a20fd6c7175486a sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716`).

## §8. Block-on-sight
1. The archive blob differs from P's, or the archive is edited after S10.
2. A kept unit is not byte-identical to its archive span (apart from a dropped earlier `Archived copy:` line). Or a unit is archived that is neither a block, nor marked, nor named by `--archive-entries`.
3. The new file holds anything beyond the title, the notice, `## Pending`, the kept units and their archive lines.
4. A reader joins files, or lists archives by anything but git, or a git failure narrows the set.
5. The rotation script is run by a hook, or itself commits, pushes or fetches, or writes anything when it is not due or refuses.
6. A merge before the kept list, the `not represented` list, E-V and D1-b are in the PR body. Or a main commit between F0 and the click.
7. `AUTONOMY.md` at the head is not M0's file plus appended bytes: `cmp -n "$(git cat-file -s <M0>:AUTONOMY.md)" <(git show <M0>:AUTONOMY.md) <(git show HEAD:AUTONOMY.md)` must exit 0.
8. `measure-reads.mjs` touched.
9. A typed date in a script or record.
10. An unpinned line cite into `DECISIONS-PENDING.md` or an archive in any file the piece adds or edits, this form included. Under OPEN-3 (B), any line cite into either.

## §9. Gates
- **Architect:**
  - §8, item by item;
  - R11, T1a, T1b and T4 as seam tests from the real shape;
  - item 4's definition against the directive;
  - item 6's flagged `no obligation` rows;
  - D1-a and D1-b against §5.
- **Reviewer:**
  - the full diff;
  - every mutation made again;
  - the hashes recomputed;
  - S0, D1-a, D1-b and E-V run again;
  - the dry run run again, with blob-id equality;
  - every row of the sheet checked mechanically;
  - the counting command.
- **After the merge:** one scoped reviewer pass over the closing amendment, covering commits and hashes only.
- **Suites:** the CI `node --test` globs, plus `verify:plan`, `cites`, `quotes`, `test-claims` and `mutation`.
- **Operator:** none.
- **Verdicts are proportional:** a block only on Correctness or Evidence. Documentation findings are fixed before the merge.

## OPEN (the human's)
- **OPEN-1, before G0: which unmarked entries are open.** Of the numbered entries, 79 carry no resolution marker at their head, and many of them are ruled in a RULED block.
  - (A) **Recommended:**
    - The marker rule of §2 item 4 applies.
    - The custodian's dry run lists every unmarked entry with the ruling it finds for it (cited by date and round, or by entry).
    - You strike in the PR body the ones to archive, and they are passed to `--archive-entries`.
    - Anything you do not strike stays.
  - (B) Keep every unmarked entry. If they exceed 153,600 bytes, C stops (I3) and you are told.
  - For sight: the doubtful kinds and the recommendation for each, in §2 item 4.
- **OPEN-2, before S4, and only if S0 shows it: the fourth reader.**
  - (A) **Recommended:** a passage introduced by a `DECISIONS-PENDING.md` cite passes when one file of the ruling set holds it (§2 item 2 (d)). Item 4's "results must be the same" needs it, and it is not among item 3's three readers.
  - (B) No fourth reader. Each failing passage needs your ruling to be baselined.
  - (C) Your own words.
- **OPEN-3, before S8: C.7's "or pin the line" against round 12 (a)**, which forbids a line cite into the ledger.
  - (A) **Recommended:** C.7 is your later, narrower rule. A line reference into `DECISIONS-PENDING.md` or an archive is allowed when it is pinned (`path:line @ <main commit> sha256:<hex>`), and an unpinned one still fails by name. The gate definitions are read with it and not edited.
  - (B) "Pin the line" applies to other files, and round 12 (a) stands whole for the ledger.
  - Under both, the new file's archive lines are written in words, with no `path:line` token.
- **OPEN-4, for sight, before S8.** Each reading below is recommended:
  - (i) An obligation is owed work not yet done. A standing rule stays binding where it is filed.
  - (ii) "150 KB" is B's OPEN-3 (ii) answer.
  - (iii) "Do not rotate again" applies to both triggers and to the first migration.
  - (iv) The new file carries no preamble.
  - (v) The archive line is given in words.

## §10. Amendments — opens empty, append-only

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-4 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md`, item 3, C). References only.*

1. **OPEN-1 (A):** the custodian's dry run lists every unmarked entry with the ruling it finds for it; the human strikes in the PR body the ones to archive, and what the human does not strike stays.
2. **OPEN-2 (A):** the fourth reader (§2 item 2 (d)).
3. **OPEN-3:** the human's own words, in the directive's item 3, C, which this form follows as written; the gate definitions are read with them and not edited.
4. **OPEN-4:** readings (i) to (v) confirmed.
5. **Still open:** none. The piece waits for B, its PLAN dependency.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — PR #226's architect F-2, before code (class 3)

*Written by the custodian before any code, on the forward note in A's form (`scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md`, Amendment 5 item 5) from PR #226's architect gate (`state/consults/gates/2026-10-17-governance-search-ignore-historical-gate1-architect.md`, F-2). References only.*

1. **M-2's step 4 (§2 item 10).** A's step 4 runs the script from A's worktree `C:/dev/wt/sih`, which is gone. In M-2 the script is `scripts/plan/measure-reads.mjs` at C's merge commit, run from M-1's worktree detached at that commit; the corpus side stays in M-2's own worktree at the merge commit. §2 item 10's digest check (`git show <merge>:scripts/plan/measure-reads.mjs | sha256sum`, equal to A's S1 digest) still binds.
2. **B is merged** (PR #229, merge commit 4b2a99767a7633b838b4eef178848bf08c71b9f6). Its first rotation, d86ebac73aa271625934b1d075bd87edd60c30d8 (B's Amendment 8), is the last `CUT-STATE` rotation commit that §2 item 10's closing record names, unless another lands first. C reads B's merged exports at M0 (§2 item 11 (d)).
3. **M0** is the main commit that adds this amendment; the custodian names it at dispatch.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.
