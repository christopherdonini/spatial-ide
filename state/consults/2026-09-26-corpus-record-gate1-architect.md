*Custodian's filing note (2026-09-26): gate 1, architect (full gating), for PLAN node `corpus-reproducibility-record` at `0fcf006` (local, unpushed), transcribed from the hand-back message with the harness's two-space indent removed. Held outside the repository until the human's sight (the architect's human-list item 1); filed on main afterwards. Everything below the rule is the architect's text.*

---

**Gate 1, architect (full gating): `corpus-reproducibility-record`**

**Head read:** `0fcf006` (0fcf006d7f66…; the worktree reflog shows a merge of `dd4acf3` into `e8e0cac`). I read the checked-out tree at `C:/dev/wt/corpus-record`. I have no Bash, so I could not run `git show` or recompute any hash; the reviewer confirms both. I also read the evidence under `C:\dev\corpus-regen\evidence\`.

## Verdicts (AUTONOMY.md §22)

- **Correctness: PASS with notes.**
  - Severity: none blocking the gate.
  - Scope: `RECORD.md`, `LICENCES.md`, the 13 copies, and the three appends (`.gitattributes`, `kernel/FIXTURES.md`, `LICENSES/README.md`).
  - Disposition: the merge stays held under block-on-sight 7 and 13 (finding C1).
- **Evidence: FAIL.**
  - Severity: medium.
  - Scope: two narrow items, E1 and E2.
  - Disposition: no record round is needed. The reviewer resolves both mechanically at `0fcf006` before `C:\dev\corpus-regen` is deleted. If both resolve, this verdict becomes PASS. If either does not, it goes to the human with Amendment 2 item 5.
- **Documentation: PASS with advisories.**
  - Severity: low.
  - Disposition: no correction round. Under the record cap, D-b to D-e are notes only.

## Findings

**C1 (Correctness): §8 block-on-sight 1–13, one by one**
- **1, 3, 4, 11:** the worker's counts at `e8e0cac` hold (C1 13/13; C4 21 rows with 0 disagreeing; C5 (ii)–(iv) clean). The reviewer's re-run at `0fcf006` is the proof.
- **2:** the six bookkeeping paths in `488b641` are disposed by the C13 result (apply-round-2 report, C13 bullet). For `0fcf006`, see E1.
- **5:** passes.
  - Each third-party row has a URL, a retrieval time and a sha256.
  - The project-generated rows have no source, which is the no-source cell §2b itself registered, now undeclared under round 26, item 2.
  - #11's open status now rests on O4, not O1.
- **6:** passes. The reproducible set is #11 plus the 16 project-generated rows, as round 26, item 2 ruled. The local-only set is 4 rows, listed by name.
- **7:** **stands at the head.**
  - `kernel/FIXTURES.md`'s existing P-b line (under the Users root) is still in the tree.
  - Under Amendment 2 item 3.2, the merge waits until a separate node removes that line from main, or the human rules otherwise.
  - That node is **not filed**: PLAN.yaml on main has no such node.
  - Every other hit is routed to the human.
  - `site/data/health.json` at the head has no path (checked). The worktree path survives only in `488b641`.
- **8:** passes.
  - Every why cell that reads "yes" names the invocation, the versions and the inputs.
  - Byte-reproducibility is disclaimed in two places: RECORD's header bullet "Procedure recorded", and its Regeneration run bullet "What `equal` states".
- **9:** read exactly as Amendment 2 item 2.1 bounds it.
  - The run supplies only pandas and numpy (#1–#3, R-1) and the spatial extension version (#4–#6), and only in rows whose outcome is `equal`.
  - Every other version cell traces to an `of-record/*` field. I checked MANIFEST `library_or_tool` and README "How it was collected".
  - The run's full version list sits only in the section Amendment 2 item 4.1(e) prescribes, and every value outside the bound equals its of-record value.
- **10:** read as bounded.
  - The corpus of record and the venv are unchanged: L0 = L1, V0 = V1, E0 = E1 (both E files read, equal on every extension fact).
  - That each script ran exactly once is not proven (E2).
- **12:** no quotation in the record files that is not byte-exact.
  - The #12 cell's entry and licence strings match the pinned bytes' buildings section as link text with the markdown removed, and are not presented as a quotation.
  - The one line cite is pinned (`ADMISSION-RESULTS.md:3 @ 15f558816bf1`).
  - There are no cites into `DECISIONS-PENDING.md`.
- **13:** not violated. The branch is unpushed and the sighting line is blank.

**C2: ADR-009**
- Decision 1 and checklist item 1: the copies are core-layer AGPL, and the nine scripts' SPDX exemption is an explicit path list (rider (d)).
- Checklist item 6 and the corrigendum:
  - Because the repository has been public since 2026-08-03, **the push itself publishes every branch commit into history**, not only the merge. That includes `488b641`'s `health.json` worktree path.
  - No personal data: P-a is 0, and C8 is 0 over added lines.
  - The third-party material is footer metadata, which round 26, item 1 ruled is metadata, not data.
  - `PROBE.json` carries GDAL's capability listing, which is de minimis tool output (note only).

**C3: §1 inert records**
- Holds.
  - No `.rs`, `.mjs`, `.ts` or workflow path invokes `of-record/`. `admission_p4_corpus.rs` names only the untracked `CORPUS_ROOT`.
  - No Python CI exists.
  - No `pub` item, callback or code path lands.

**C4: Amendment 2 item 2.4 (the equal rows' procedure-recorded cells)**
- **The record states it within §1's may-not-claim list:** no row claims byte-reproducibility, and the disclaimer is explicit.
- **Whether the "yes" meets §1's definition turns on a reading.** It meets the definition only if "the software that wrote the bytes" means software that wrote sha-equal bytes, not the software behind the 2026-09-10 write, whose pandas and numpy remain unknown.
- The cell's qualifier discloses exactly that. The reading is the human's to confirm (already on the item 5 list).

**C5: fidelity to the rulings**
- **Rider (d):** the explicit path list in `LICENSES/README.md` §"Byte-identical copies without an SPDX header". RECORD states the licence.
- **Rider (e):** C8 gave 0 and nothing at `e8e0cac`. It must be re-run at the pushed head and carried in the PR body (Amendment 1 item 1.2).
- **Project-generated rows by regeneration:** all 7 outcomes are `equal`, so the set U is empty and the human's phrase occurs 0 times, which is correct.
  - The phrase's source is `state/directives/2026-09-26-corpus-positions-and-stop-hook.md` @ 6e743ed, §2 item (2), the line's hash `db32712e…`. The reviewer recomputes it.
- **#12:** local-only, fetch-only and never redistributed. The USGS entry is recorded as naming no licence, which matches the refetched bytes (evidence file `overture_refetch.mdx`, Buildings section).
- **#11:** SPDX pin v3.29.0 at commit `31ba1a50…`. `evidence/spdx/fetch1.json` shows `licenseListVersion` 3.29.0 and Apache-2.0 `isOsiApproved` true.

**E1 (Evidence, medium): C13 is unresolved for the merge commit `0fcf006`**
- Amendment 2's custodian note requires any custodian commit that touches the six paths to pass C13. The merge touches them, and no record of C13 at `0fcf006` exists.
- As written, C13 cannot pass on a merge:
  - (ii) compares against `<c>^`, the first parent. That diff carries all of main's PLAN.yaml drift, so it fails by construction.
  - (i) is vacuous, because `diff-tree` prints nothing for a merge commit.
- **Proposed gate reading:** for a merge, run (i) and (ii) against the main parent (`git diff --name-status dd4acf3 0fcf006` and `git diff dd4acf3 0fcf006 -- PLAN.yaml` inside the node's block), (iii) as written, and (iv) as byte equality of `health.json` with `dd4acf3`'s. The reviewer runs this and records both readings. The result goes to the human with item 5's per-commit C13 results.

**E2 (Evidence, low): the Regeneration run's window, single execution and exit codes**
- RECORD's "Run" bullet gives a window of 19:43:21Z to 19:43:29Z and says each script was executed once.
- Nothing in the hand-back or in `evidence/` supports this: the two `.log` files carry no time, and there are no exit codes. Amendment 2 item 2.2(e) required both.
- The reviewer resolves the window against the mtimes of the scratch outputs and logs **before** `C:\dev\corpus-regen` is deleted.

**Documentation advisories (no round)**
- **D-a:** Amendment 2 item 5 is headed "at the PR", but directive item (1) and the custodian note require the sight **before the push**. Sequencing note only (see the human list).
- **D-b:** RECORD's Regeneration run bullet "The mark", and LICENCES' "By regeneration means" line, define a mark that no cell carries. Accurate, but it reads as if a mark were present.
- **D-c:** LICENCES O1 is now referenced by no row and carries no note that it is superseded (Amendment 2 item 3.4 says it is no longer #11's pin).
- **D-d:** RECORD's reference for the human's phrase locates it by section and line prefix, not by `path:line` (round 12 (b)). It still resolves uniquely.
- **D-e:** `of-record/README.md` is a tracked `.md`, so verify-cites and verify-quotes scan it. A later checker change could turn main red over a copy that must never be edited. The fix (exempting `of-record/` in `scripts/plan`) is outside this Scope. Proposal for the 2026-10-02 window.

## To the human (Amendment 2 item 5, plus the gaps)

Item 5 is complete for the rulings it covers. Add or re-time the following. Items 1–3 need the human's word **before the push**.

1. **Timing.** The sighting of `LICENCES.md` and every C6 hit, including `488b641`'s `health.json` path, happens before the push (directive item (1)), not at the PR. The push is the publication. Use a channel that does not itself put the hit list on public main.
2. **C13 for `0fcf006`**, under the merge reading in E1, next to `488b641`'s result.
3. **The `kernel/FIXTURES.md` removal node is not filed** (Amendment 2 item 3.2). The merge waits on it unless the human rules otherwise.
4. **#12's attribution:**
   - The cell carries entry names and licence names only. It carries neither the source's links nor the licensor wording on the Global ML Building Footprints entry.
   - Is that "with attribution" (item (3))?
5. **With every outcome `equal`, no row carries the human's phrase.**
   - #7–#10 and the five M rows were never regenerated.
   - Their "reproducible — by regeneration" rests on the recorded procedure plus inputs observed to reproduce.
   - This is context for how D4 was disposed.
6. **Rider (d)'s placement:** "the audit" is read as `LICENSES/README.md`'s appended section (Amendment 1 item 1.1(d)). Confirm.
7. **For completeness:** the preregistration itself, which C6 excludes by design, names `C:\dev\corpus-regen` and `C:\dev\wt\`. Neither is a permitted prefix, neither names a user, and both are already on main in the consult reports.
8. **Already listed:** the five non-paths; `LICENSES/README.md`'s two existing P-e hits; #12's no-licence entry and its set; the item 2.4 reading; SPDX v3.29.0; merge commit only.

**Paths:** `C:/dev/wt/corpus-record/engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `C:/dev/wt/corpus-record/engine/compat-corpus/RECORD.md`, `C:/dev/wt/corpus-record/engine/compat-corpus/LICENCES.md`, `C:/dev/wt/corpus-record/kernel/FIXTURES.md`, `C:/dev/wt/corpus-record/LICENSES/README.md`, `C:/dev/corpus-regen/evidence/`
