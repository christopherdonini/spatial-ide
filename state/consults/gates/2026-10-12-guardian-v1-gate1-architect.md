# PR #216 gate 1 — architect
Reviewed: cut/guardian-v1 @ 49b6a01296f2d55c53ccb12480a7127a9940a125

**Verdict: block, on wording only.** There is one Evidence finding, E-1: a README clause that states engine behaviour the piece has no evidence for. The words are not the human's, so the worker applies the replacement below with no re-gate, and the PR body lists it. Once it is applied, the verdict is pass. There are no Correctness findings and no Documentation must-fix findings. Installing, enabling, reloading and E15 stay the human's. The merge waits for the human's typed approval after both gates, and that approval names the live checks (E7 to E11 and E15).

I checked from `.git/refs` that the branch head and origin/cut/guardian-v1 are both at 49b6a012. I have no shell, so the byte and count checks marked "reviewer" below are §9's reviewer items, not findings.

## Correctness

No findings. What was checked:

- **A.12, item 3f against A.2, F64 to F66 and T73 to T75.**
  - Item 3f says G8 covers `.claude/settings.local.json` and that installing stays the human's (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`, item 3f).
  - `g8LocalSettingsRefuses` (`tools/mods/spatial-guardian/hooks/register.js:688-696 @ 49b6a012`) follows A.2 clause by clause:
    - **Candidate:** the placed path, or the path as received with a `/` put in front, ends in the suffix. Only a candidate makes a lookup.
    - **Lookups:** M comes from `mainTree`, which caches only a found repository (`register.js:619-626 @ 49b6a012`). L is placed by `place`.
    - **Refusal:** when the two normalised placed paths are equal.
    - **No repository:** the call passes.
    - **L that cannot be placed:** refused.
    - **A rejected lookup:** throws, and the catch at `register.js:1025-1033 @ 49b6a012` refuses it.
    - **Rule, reason and order:** rule G8 with `G8_REASON`, in G8's place directly after the user-folder check (`register.js:1019-1020 @ 49b6a012`).
    - **Nothing new:** no new hook, `$` call, env name or reason, and no `isThisRepository` call (§8 item 21).
  - **Product caller:** `register.js:1020 @ 49b6a012`, so this is not a test-only seam. It uses only `session.repo` and `fs.stat`, the engine seams the mod already uses, answered by the existing `answerRepo` and `vfs` helpers (`tools/mods/spatial-guardian/test/guardian.test.ts:1018-1055 @ 49b6a012`).
  - **F64 and T73** (`guardian.test.ts:1842-1860 @ 49b6a012`): all eight rows are present.
    - The `..` row and the case row land on L because `vfs` resolves dots and the code lower-cases.
    - The link-at-L row is the one that kills T73's mutation: the placed path is `d:/t/s.json`, so only the path as received makes it a candidate.
  - **F65 and T74** (`guardian.test.ts:1868-1890 @ 49b6a012`): all nine rows are present.
  - **F66 and T75** (`guardian.test.ts:1897-1919 @ 49b6a012`): (a) gives `CATCH_REASON`. (b) gives `next(e)` with zero repository lookups. (c) gives G8, because `C:/r/.claude` is missing, the folder stat in `place` fails, and so L cannot be placed.
  - Part A's code (e5afe5e6) followed Amendment 7 (class 9) and Amendment 8's OPEN-7 ruling, as A.12's third bullet requires.
- **C.3's check.**
  - At the gated head, README Install is main's text (`tools/mods/spatial-guardian/README.md:46-55 @ 85933a08`) plus exactly two sentences: v1's sentence and A.8's (`README.md:96 and 103 @ 49b6a012`).
  - Turning it off is byte-identical by reading (`README.md:105-111 @ 49b6a012`).
  - main's N1 section (`register.js:420-486 @ 85933a08`) reads identical to `register.js:1035-1101 @ 49b6a012`. The header's N1 entry and `N1_BAND = 5` are main's.
  - `continuity.mjs` is not among the changed files.
  - The by-script check at the merge commit 83044167 is worker report 3, section "The merge (Part C)".
- **D.2.**
  - Item 1: T71 holds the closed form at `guardian.test.ts:1811-1815 @ 49b6a012`.
  - Item 2: an answer of no repository is not cached (`register.js:622 @ 49b6a012`).
  - Item 5: T58's line names its own test and gives a count for the others (`guardian.test.ts:1535-1537 @ 49b6a012`).
  - Item 6: `arm` answers only `env.get` by default (`guardian.test.ts:52-103 @ 49b6a012`). The v1 helpers are registered per test, so §8 item 29 holds.
  - Item 3 (the `validate` annotations) is the reviewer's C.5 item.
  - No `OBSERVATION-Tnn` placeholder remains.
- **Round 7 on §7's reasons.**
  - `G8_REASON` (`register.js:47-48 @ 49b6a012`) is unchanged, as A.10 declares. It states the ruling's own fact, holds no path, and states no other module's consequence.
  - On an L refusal it reads accurately for the enable record, which is enabling plugins. It is an app-visible string under P6, so no rewording is proposed. The human sights it at §9's Operator step.

## Evidence

**E-1: README clause asserts which file the engine reads for a worktree session.**
- `README.md:65 @ 49b6a012` says of a session started in a worktree that it "reads that worktree's local settings file and not the main checkout's".
- The piece has no evidence for that engine behaviour at 2.1.296.
- Amendment 7, A.9 puts exactly this on the may-not-claim list: which local settings file the engine reads for a session the human starts somewhere other than the main checkout.
- A.8's drafted bullet carried the same overreach, so it is the source of the error.
- This is an unsupported claim of a limit. **Not the human's wording**: Amendment 7 was drafted by the architect agent, and the worker wrote the README line.
- **Replacement words.** Replace the clause `a session started in a worktree, which reads that worktree's local settings file and not the main checkout's;` with:

  `a session started in a worktree, for which this piece does not establish which local settings file the engine reads; G8 guards only the main checkout's file;`

- **Clause check.**
  - "does not establish which local settings file the engine reads": A.9's may-not-claim, word for word in substance. No test or E-row reads it.
  - "G8 guards only the main checkout's file": L is the main tree's root plus the suffix, and the main tree is the root also for a worktree session (`register.js:692-695 @ 49b6a012`; §2.6's M). A worktree's own file passes (F65's row `C:\r\.claude\worktrees\w\...`, `guardian.test.ts:1883 @ 49b6a012`). The main checkout's L is refused whichever checkout the session started in.

**Amendment 9's class 2 rows: none changes what a test proves.**
- **(a) T74's no-repository row runs first.**
  - `mainTree` caches a found repository. If the row ran later, its "no repository" fixture would really be a cached repository.
  - Running it first is the stated fixture at a fresh load.
  - Every other row's outcome does not depend on order.
  - T74's mutation still fails on the other-checkout rows.
- **(b) T75 runs (b), (a), (c).**
  - Running (b) first makes `asked === 0` an absolute count, and the repository answer is still `reject` at that point, so a stray lookup would also surface as `CATCH_REASON`.
  - (a) still runs with an empty cache.
  - (c) is unaffected.
  - The assertions are F66's.
- **(c) A.8's Install sentence lands in Part A, not in the merge commit.** C.3's check bounds what may appear, and a subset meets it. At the merge commit the sentence would have described code that was not there yet. No test is involved.
- **(d) The 80 mutated runs held no shared hold.**
  - This is a process deviation from the machine rule, not from the form.
  - The test kit's verdicts carry no timing assertion, and §9's reviewer observes every mutation again at the gated head, which is the evidence of record.
  - It does not change what a test proves.

**Amendment 9's class 8 row.**
- 84 + 783 + 1,090 = 1,957 over 3 files, against the 1,300 ceiling. This matches worker report 3, section "Size against Part F".
- Against Part F's estimate (about 1,850), the test file is +110, register.js −7 and the README −1. "Almost all of the difference is in the test file" holds.
- §7's size line is unedited. I5 holds.
- The recount at 49b6a012 is the reviewer's.

**The README's log-folder line.**
- `README.md:50 @ 49b6a012` no longer holds the clause the human named in item 4 of `state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md`. The rest of the line matches the code (`register.js:925-963 @ 49b6a012`).
- I could not compare its bytes with the parent's (no shell, and no earlier copy of the line exists outside git). **Reviewer:** `git diff c4a50c3c 49b6a012 -- tools/mods/spatial-guardian/README.md` should show one changed line whose only difference is the removed clause.

## Documentation

None must-fix.

## Suggestions (not required)

1. **§8 item 30's first bullet against A.2's fail-closed bullet.**
   - A.2 refuses a candidate on the suffix alone when L cannot be placed. A.11's third bullet requires that, and the code does it.
   - Read item 30's first bullet as applying when L is placed. No amendment is needed: the code follows A.2.
   - That over-refusal needs the main checkout's tracked `.claude` folder to be missing or unreadable, which ordinary use does not reach here. The source comment at `register.js:683-687 @ 49b6a012` already records it.
2. **The folder stat inside `place` turns every failure into "unplaceable"** (`register.js:507-511 @ 49b6a012`, v0's code).
   - So a non-ENOENT failure on L's folder is refused and logged as G8, not as `catch` as A.2's first fail-closed bullet words it.
   - Both outcomes refuse, and only the logged rule differs.
3. **Install wording** (`README.md:96 @ 49b6a012`, carried over from v1, allowed by C.3).
   - "These commands" also covers `/reload-plugins`, which G8 does not read.
   - Optional words: `G8 refuses the two `claude plugin` commands above to every agent.`

## Files read
- C:/dev/spatial-ide/tools/mods/GUARDIAN-V1-PREREGISTRATION.md (Amendments 9 to 6, §2, §3, §4, §5, §7, §8, §9)
- C:/dev/spatial-ide/tools/mods/GUARDIAN-V0-PREREGISTRATION.md (Amendment 11)
- C:/dev/wt/gv1/tools/mods/spatial-guardian/hooks/register.js
- C:/dev/wt/gv1/tools/mods/spatial-guardian/test/guardian.test.ts (header, `arm`, the v1 helpers, T58, T71, T72, T73 to T75)
- C:/dev/wt/gv1/tools/mods/spatial-guardian/README.md
- C:/dev/spatial-ide/tools/mods/spatial-guardian/hooks/register.js (main: header, N1 section)
- C:/dev/spatial-ide/tools/mods/spatial-guardian/README.md (main: Install, Turning it off)
- C:/dev/spatial-ide/state/consults/2026-10-05-guardian-v1-worker-report-1.md
- C:/dev/spatial-ide/state/consults/2026-10-05-guardian-v1-worker-report-2.md
- C:/dev/spatial-ide/state/consults/2026-10-12-guardian-v1-worker-report-3.md
- C:/dev/spatial-ide/state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md
- C:/dev/spatial-ide/state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md
- C:/dev/wt/gv1/.git, C:/dev/spatial-ide/.git/worktrees/gv1/HEAD, C:/dev/spatial-ide/.git/refs/heads/cut/guardian-v1, C:/dev/spatial-ide/.git/refs/remotes/origin/cut/guardian-v1, C:/dev/spatial-ide/.git/packed-refs
