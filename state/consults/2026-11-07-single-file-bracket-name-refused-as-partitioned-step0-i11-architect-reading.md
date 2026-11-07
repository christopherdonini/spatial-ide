*Custodian's filing note (2026-11-07): the architect's reading for filler entry 8f, `single-file-bracket-name-refused-as-partitioned`, after its step 0 report (filed at eb7b60c7): whether the I-11 candidate fires, whether the outcomes and the shape follow, what the class 1 amendment records, and whether the tester's stray write voids step 0. A consult, not a gate. Its prompt named its brief by path and sha256 (23d735d0); read only at main eb7b60c7, with the DuckDB v1.5.5 sources in step 0's build folder on D:. The run 2026-11-07T12:48:58.250Z to 2026-11-07T12:54:41.967Z by its transcript (claude-opus-5-5; unique calls Read 10, Grep 5 and the hand-back, 16, equal to the notification's). Extracted by script from its one SubagentHandback call, at 2026-11-07T12:54:41.898Z, one final newline added; its sha256 is 914fc2cc39dd71308f23552f68900de5a6439e00451f60d10a299f4326176e6d. On its Q2 advice the tester's raw outputs and the probe are kept outside the repository, in the local evidence folder under 2026-11-07/8f-step0/ (14 files; p1.out, p2.out and the probe by sha256 equal to the report's). The custodian's call on disclosure (1), on this reading's Q5: the observations stand; reported to the human. A reading, not Authority.*

---

Reading: 8f step 0, I-11 and the class 1 amendment (main @ eb7b60c724e27774d9790460c790378a9e661fa8; read-only from the working tree, since I have no shell to confirm HEAD; the DuckDB v1.5.5 sources read at D:/wt-targets/8f0/debug/build/libduckdb-sys-e687d2665fbd4cae/out/duckdb/). This is a consult, so it gives no gate verdict. I wrote nothing and computed no hashes, so every hash below is the custodian's to compute by script.

Form = governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md (lines as at eb7b60c7). Report = state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md. LFS = src/common/local_file_system.cpp, FS = src/common/file_system.cpp, LIKE = src/function/scalar/string/like.cpp (all in the DuckDB tree above).

## Q1. Does the last-ditch fallback fire I-11?

**Yes, its condition is met. Under I-11's own words it requires nothing more before code, because the selected shape does not use it.**
- **The condition** (Form:271): "a literal route in DuckDB's source (O8) that §3 does not list."
  - LFS:1761-1766 is such a route. When glob expansion has found nothing, `FetchFileWithoutGlob(path, …)` returns the raw text as a file if it exists.
  - §3's forms (Form:158-163) and outcome rows (Form:173-177) do not list it.
- **The consequence**, also Form:271: "It is recorded, not used. Using it needs an amendment that declares its §2, §4, §5, §8 and §9 items, and a step 0 re-run for it, before code." The "Using it" clause binds only a shape that relies on the route. ESCAPED does not:
  - **Class C (RAW).** `{` and `}` are not glob characters (FS:613-625), so the path goes straight to LFS:1725-1727 and never reaches the fallback.
  - **Class B (ESCAPED).** The escaped pattern reaches L by matching (LFS:1644-1656, LIKE:46-48 and :77-145). The fallback runs only when that pattern matches nothing, and then it runs on the escaped text.
  - **No §3 row could use it anyway.** It returns L only when no sibling matches, and §3 classifies a class by its worst case (Form:173). That makes it R2 territory.
- **No step 0 re-run is required by I-11.**
- **The stop.** Form:260 reads "Each stops the piece and goes to the architect unless marked:". This reading is that hand-off, and the class 1 amendment records it.
- **Side readings, labelled as readings and not established:**
  - The fallback is the narrow form of H-LIT (Form:44). K1 and K6 under F-raw read decoys, which falsifies H-LIT as stated.
  - §0.3's unexplained `\\?\` evidence fits LFS:1731-1736. An absolute path's first split, which is where `\\?` lands, is used as the literal starting directory and is never matched.

## Q2. Do the class outcomes and the shape follow?

**Yes, they follow from §3's words.**
- **Class B is R2.** K1, K2, K5 and K6 under F-raw read a decoy (Form:176).
- **F-escB is E-OK.** With L present it reads exactly L in K1, K2, both class B K4 literals, K5 and K6. With L absent it reads no file in K7-K1, K7-K2 and K7-K5. That is K7's whole class B list (Form:154, :177).
- **F-escB is the first E-OK form,** so class B is ESCAPED (Form:185).
- **Class C is R0.** K3 and K4's `zones}` and `zones{1}` read exactly L, and K7-K3 reads no file (Form:174), so class C is RAW.
- **The union is ESCAPED** (Form:190), which binds §7's ESCAPED row (Form:288).
- **Observations the selection rests on that the report does not carry:**
  1. **Per-observation file lists for O1 to O6.** The report carries only the claim that all six were identical (Report:56). The lists are in the tester's scratch outputs (p1.out, p2.out), cited by hash only, outside the repository and untracked.
  2. **The probe's verdict logic,** which defines what "EXACT_L" means. The probe is untracked, in C:/dev/wt/8f0 (Report:28).
  - **Recommendation:** preserve both, or have the amendment cite them as disclosed untracked evidence (a run's output, not Authority) beside the report. Do this before the worktree is swept.
- **Not run, and not required by §3's words:** K7 for K6, K7 for the K4 literals, and `zones{1}` with L absent. None of them changes the selection.

## Q3. Does the fallback change what ESCAPED must claim or test?

**The tests, yes. The claims, partly. Each point below is a reading, not an observation.**

(a) **T2 and M2** (Form:212-218). M2 makes the helper return its input. It fails only where the raw text is a well-formed `[..]` and a decoy that pattern matches is present. In every other case M2 passes:
- a lone `]` has no glob, so it is read literally (FS:613-625);
- a lone `[` is an invalid pattern, so the fallback reads the literal (LIKE:135-137, LFS:1763-1765);
- a bracket pair with no matching decoy falls to the fallback too.

So T2's L-absent row must hold a bracket-pair name with a matching decoy beside it. Otherwise M2's prediction is untrue. Your example (a pair, no decoy) therefore cannot discriminate the helper: under M2 the fallback reads L whenever it is present, and nothing when it is absent.

(b) **M3** (Form:217):
- **Dropping `]` is an equivalent mutant on this DuckDB.** Once every `[` is written `[[]`, no bracket expression is open, and a bare `]` takes the literal default branch (LIKE:61-66).
- **Dropping `[` is observable, but only on a pair row.** `zones[1]` becomes `zones[1[]]`, which no longer matches L, and the fallback finds nothing. On a lone-`[` row the fallback reads L and the mutant survives.
- **Declare before code:** M3 drops `[`, its row is a pair row, and `]` is recorded as equivalent by this reading. If not, §8 item 9 meets a surviving mutant at the gate.

(c) **An ESCAPED residual that §1 does not name.** If L is removed between the pre-check and DuckDB's call, the fallback looks up the escaped text as a literal name, and would read a file that carries that name. This needs timing inside one request, so it does not block. It should be named in the source comment beside §1's R1 residual (Form:65).

(d) **Linux, a bracket in the first component of an absolute path.** LFS:1731-1736 treats that component as a literal directory: LFS:1733 reads "// FIXME: we don't support /[GLOB]/.. - i.e. globs in the first level of an absolute path". The escaped text then names a directory that does not exist, and the open errors after the gate admits it.
- It reads no wrong rows, so the falsification at Form:273 is not hit.
- But §1's "is admitted" (Form:60) is untrue for that path on Linux, and E1's temp-directory paths cannot observe it.
- Windows is unaffected: the first split is the drive letter or `\\?`.
- **Bound the Linux claim.**

(e) **Windows letter case.** The pattern match in LIKE is byte-exact, but `is_file` and the non-glob components are not case-sensitive (LFS:1783-1801). If the path text's case differs from the directory listing in a component that holds a bracket, the open errors.
- Whether `pick_file` can return such a case is not settled.
- Either bound the claim in the comment and in item 20's words, or observe it.

(f) **Comments** (§2.4, §8 item 6). State only what step 0 observed, for example that a lone `[` reads the literal (K4). Do not state the fallback mechanism as DuckDB fact.

**Note (a preference, not a condition):** no case in §3 holds both a bracket and a brace in one name, so E1 could add such a row.

## Q4. What the class 1 amendment must record (references and hashes only)

1. **First line:** it is written after step 0's outcomes were seen (Form:25).
2. **The run's identity:** the run commit aca36808f58e1a504c4a129e29f611ed36cb0302, and the form's sha256 at it.
3. **The report:**
   - pinned `path @ <main commit>` with its sha256, and the hand-back extract's sha256;
   - the raw outputs and the probe by sha256, disclosed as untracked evidence.
4. **The outcomes, each by a pinned Report line range:**
   - class B R2, F-escB E-OK, so ESCAPED (escB);
   - class C R0, so RAW;
   - the shape ESCAPED, by section reference to "§7, the ESCAPED row". It is a self-reference, so no line number.
5. **H-LIT:** falsified, by reference to the K1 and K6 rows.
6. **Invalidators:**
   - I-1, I-2 and I-10 did not fire;
   - I-11 fired, was recorded and is not used, with this reading by path and hash once filed;
   - I-3 is deferred to the worker's base grep (§9 item 8).
7. **§2.4's rename branch is met.** Class C is R0, and `every_glob_metacharacter_read_parquet_expands_is_refused_by_name` has a `{a,b}` row (engine/tests/session_identity.rs:693). The rename is conditional on I-7 at the base.
8. **What the O8 reading changes (Q3 a, b, d, e):**
   - T2's L-absent row is a pair with a matching decoy;
   - M3 drops `[` on a pair row, and `]` is equivalent;
   - §1's Linux claim is bounded at the first absolute component;
   - the Windows case bound.
   
   Whether these sit in this class 1 amendment, as "what it invalidates" (template class 1), or in an amendment of their own is the custodian's call. Either way they land before code.
9. **The DuckDB pins:** the package (libduckdb-sys 1.10505.0, v1.5.5), and LFS, FS and LIKE by sha256 with line ranges.
   - Pin LFS:1761-1766 for the fallback. The two comments are on 1763-1764 and the call is on 1765; the brief's "1763-1765 carry the comments" is loose.
10. **Disclosure (1)** and the custodian's call on it, by reference.

## Q5. Does the stray write void the step 0 observations?

**No. Nothing in the form or in Part 1 voids them.**
- **The form's invalidators** (Form:261-271) and §9 item 2's stops (Form:317) do not cover a stray write. §8 item 11 (Form:306) covers only a shared target or a commit.
- **Part 1** (Part 1 of state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md, items 1-9) covers sentences, gates, corrections, readiness, packets and tests. None of it covers step 0 write discipline.
- **What the observations rest on:**
  - the tester's own target;
  - fixture hashes equal before and after (Report:53);
  - two processes byte-identical (Report:46).

  The log file under C:/dev touched none of these.
- **The breach itself.** It breaks the brief's stop rule, which I was not given and have not read. That makes it a conformance matter, the custodian's call, with the filing note's report to the human as it stands.

## OPEN items only the human can settle

- **Red line:** KNOWN-LIMITATIONS item 20 and SKP-V0 §1's sentence stay the human's words at the click (Form:132, §9 item 6). They must carry the Q3 (d) and (e) bounds and claim no more than that.
- **Not a red line:** everything else here. That includes disclosure (1), unless the custodian refers it.

## What I could not settle

- Whether HEAD is eb7b60c7 (no shell).
- Whether `pick_file` can return a path whose letter case differs from the disk (Q3 e).
- Whether Q3's test declarations are class 1 or another class; template classes 1 to 7 name no pre-code test-design change.
- Whether the tester read O8 before or after the runs. It changes nothing above.
- Q3's points are source readings, not observations; a step 0 re-run would be needed to observe (d) or (e).

Report path given in the brief: C:/dev/spatial-ide/state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-i11-architect-reading.md
