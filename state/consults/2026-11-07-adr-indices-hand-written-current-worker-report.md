*Custodian's filing note (2026-11-07): the worker's report for adr-indices-hand-written-current, from its hand-back (sha256 a34361f0d10fe4c4f6572b20c946cd32bbfbb0c220d29741bc69033c9dc692ae, 7211 bytes), byte for byte. Its transcript holds 41 unique calls (Bash 35, Read 3, Write 2, the hand-back 1), equal to its notification; model claude-sonnet-5-5; run 22:52:26Z to 23:12:45Z. Checked by the custodian at origin: the branch at 01dc01752d84aa28e963bd8bb23679b3a1a52153; against origin/main, 19 changed lines (`docs/02_Architecture.md` 12/5, `docs/README.md` 1/1); CI at the head four runs green, read at 23:58:04Z; draft PR #296. A report, not Authority.*

---

Built: adr-indices-hand-written-current at 01dc01752d84aa28e963bd8bb23679b3a1a52153

**B and rule (00).** B is 914bd156b3a41c158bf63c385024918e55d498d4. The form's sha256 was fe3f0b42…, matching. The worktree is C:/dev/wt/adri. At B its HEAD matched and its tracked porcelain was empty. For every `origin/cut/*` branch, `git diff --name-only origin/main...origin/<branch>` listed neither `docs/README.md` nor `docs/02_Architecture.md`.

**Scope.** F1 to F8 only. F9 to F13 are untouched. No sentence needed a status its ADR does not record. Every old text was found exactly once at B. The script printed each old and new text (in `adriw-edit-out.txt` in the scratch folder). ADR line cites below are `@ 914bd156` (B's first 8 hex).

Findings, new text byte-copied from the script output:
- **F1.** ADR-026:110, :114, :91 @ 914bd156.
  - README: "was settled on 2026-09-03 (DECISIONS-PENDING entry 25: `pasted` retained))."
  - docs/02:91: "**Not settled by this acceptance, settled later:** … that wording was settled on 2026-09-03 (the ADR's appended section, DECISIONS-PENDING entry 25: `pasted` retained)."
  - The ADR's Status line is untouched, and no sentence says it was corrected.
- **F2.** ADR-023:3, :14, :26, :163 @ 914bd156.
  - README: "Proposed and binds nothing, … its Record line says the Decision text was accepted as drafted, with two §2 amendments, by the human on 2026-09-14, and that Status stays unchanged until B1's close; an Amendment of 2026-09-29 is Proposed".
  - docs/02:86's head is changed the same way, and "An Amendment of 2026-09-29 is Proposed." is added at the end of the line.
- **F3.** ADR-017:672, :723, :750, :1044, :1144, :1161 @ 914bd156.
  - README: "**five corrigenda appended**", and "…declares **spent**; 4 (2026-08-07) and a corrigendum of 2026-09-07 complete the five; a Note of 2026-10-28 is also appended)."
- **F4.** Same ADR-017 lines.
  - docs/02:80 now reads "**Five corrigenda are appended, and a Note of 2026-10-28,** and must be read with it; the first three are:". The rest of the line is unchanged.
- **F5.** ADR-016:3 @ 914bd156.
  - README: "status withheld twice), **ADR-016** (" became "status withheld twice). **ADR-016** (". Nothing else in that clause changed.
- **F6.** ADR-029:3, :64, :71, :77, :83 @ 914bd156.
  - Both files say Proposed and "binds nothing until its gate and the human's word", with the decision "drafted 2026-09-14 for the human's sight".
  - Each file's old "open: …" / "Open: …" sentence becomes "the questions it was filed to hold … are what that drafted decision addresses" (docs/02: "…; the decision drafted 2026-09-14 addresses them").
- **F7.** ADR-013:3, :5, :265, :330 @ 914bd156. docs/02:77 now reads:
  - "- **ADR-013 (accepted, 2026-08-09, architect-blockable from acceptance)** — … Its deadline, inherited from that block, is on resolving the question — by this ADR or a successor — before the editing plugin's digitizing path is built. Amendment 1 (2026-09-23, Accepted) and a Note of 2026-11-05 are appended."
- **F8.**
  - README gains ADR-033 to ADR-036 after the ADR-032 clause. Each has its title (lower-cased first letter), status and date. ADR-034 also carries "architect-blockable".
  - docs/02 gains seven entries after ADR-029's: ADR-018, 030, 032, 033, 034, 035, 036. Each has its H1 title copied by script, plus status and date. Only ADR-018 and ADR-034 carry "architect-blockable".
  - The ADR lines are `:3` of ADR-018, 030, 033, 034, 035, 036, `:5` of ADR-032, and the H1 at `:1` of each @ 914bd156.

**Held unchanged.** `adriw-held.mjs` compared B against my head and printed ALL OK.
- README changed only at line 27.
- The F9, F10 and F11 README spans each occur once at B and at head.
- The README `docs/02:81` cite and its ADR-020 sentence (1363 characters) are byte-identical.
- The dated corrections are present and identical. The ADR-009, ADR-020, ADR-021, ADR-025 and ADR-030 clauses are byte-identical.
- docs/02 lines 78, 79, 81, 83, 84, 85, 88 and 93 are identical at the same line numbers.
- The dated "Stale-clause correction" in line 91 is identical.
- docs/02 lines 1 to 76 are identical, lines 90 and 92 are identical, and 7 lines were added at the end.
- `git diff -U0` shows docs/02 changed at 77, 80, 86, 91 and 94, plus the 7 appended lines.

**Checks at head.** The first six ran on the tree before the commit. The tree content is identical either way.

| Check | Exit | Last line / result |
|---|---|---|
| `npm run verify:adr-index` | 0 | `adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line` |
| `verify-cites` | 0 | PASS, 2748 files |
| `verify-test-claims` | 0 | PASS, 756 claimed tests |
| `verify.mjs` | 0 | `verify:plan PASS` |
| `queue.mjs --check` | 0 | CUSTODIAN-QUEUE.md/.json are current |
| `site.mjs --check` | 0 | site/ is current |
| `forms-layout.mjs` | 0 | PASS, 207 files |
| Scripts suite (in the hold) | 0 | tests 598, pass 598, fail 0 |
| `verify-quotes` (in the hold) | 0 | PASS, 151 checked, 120 verified |
| `git diff --name-only origin/main...HEAD` | – | exactly `docs/02_Architecture.md` and `docs/README.md` |
| `git diff -U0 origin/main...HEAD -- docs/README.md` | – | one hunk, `@@ -27 +27 @@` |

**Numstat.** docs/02 is 12 insertions and 5 deletions. docs/README.md is 1 and 1. The total is 19, against the form's 30.

**Push and CI.**
- The commit is signed off, and the message file had `@` only in the first trailer.
- Origin's branch equals HEAD (01dc0175…) and the tracked porcelain is empty.
- CI was read once at 2026-11-07T23:12:06Z. The one run listed was 42424145058, "Ported notices", head sha 01dc01752d84aa28e963bd8bb23679b3a1a52153, status in_progress. I did not wait. I took no PR action.

**Deviations and judgement calls (mine).**
1. I ran `verify-quotes` in the same hold call as the suite, after it and joined with `;`, instead of a single command after `&&`.
2. In F4 I added "; the first three are:" so the line stays true with a count of five and a list of three. That goes beyond "the count and the Note, nothing else", so the gate may replace it.
3. ADR-035's entry omits "architect-blockable". Its Status line names the property only as "not architect-blockable until this acceptance", so I did not infer it.
4. docs/02:86 still says "Until decided: the working canvas styles by literal only…". I did not touch that clause because no finding names it. It may be stale against the build.
5. ADR-023's own Status line still says "decision deliberately undrafted", while its Record line says the Decision text was accepted as drafted. I wrote only the Record line's facts and kept "Proposed, binds nothing".

**Hold lines (this project's only).** `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:35292`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:35292 affinity=FF (cores 0-7)`. No exit codes 96 to 99.

**Background shells left.** None. My background jobs (`bewred1uq`, `bk6vwmpuh`, `bsvr3b4be`, `by1bi0l6p`) all completed with exit 0.

**Model.** The harness reports Sonnet 5.5 (`claude-sonnet-5-5`).

**State.** Branch `cut/adr-indices-hand-written-current` is at 01dc0175, pushed, and the tracked porcelain is empty.
