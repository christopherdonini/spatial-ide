*Custodian's filing note (2026-09-26): the architect gate's attempt-1 report for PLAN node `bundle-viewer-partition-offset-bounds` at 874c72f, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

## 1. Verdict: FAIL (the record only)

The code, the tests, the constitutional checks and §8 items 1–11 all pass. What fails is Amendment 1's form and three rows of Amendment 2. The fix is one appended correction amendment (given in §4). No code changes. This is record round 1 of the two the record cap allows.

## 2. Findings

**F1: a line cite into the ledger.** Rules: round 12 (a), and round 14 (a′), "no ledger passage is pinned by (b)'s path:line + hash".
- `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md:253` reads: "The ruling: `DECISIONS-PENDING.md:40 @ e562e9b sha256:d76437e5265f90d440335107e1ea8d51d47126538e485437ee1f230714331b88`."
- This fails by name. The heading at `:251` already carries the correct form, "question round 25, item 4".

**F2: unmarked reproduction where the sentence is understandable without it.** Rule: round 12 (b) and its rider.
- `…PREREGISTRATION.md:255` contains "(bundles published before the fix keep a viewer that can stall on crafted offsets)". That is byte-identical to a span of round 25 item 4's ruling.
- Its first parenthetical, "(a bundle carries its author's viewer code; open bundles only from sources you trust)", is the ruling's words with an elision that is not marked.
- Neither has a script mark. The sentence already names its reference ("the item landed at `c855b77`").

**F3: a tool claim with no commit, and a reference that does not resolve.** Rules: round 15 (c); the record cap ("the smallest text a gate can verify").
- `…PREREGISTRATION.md:264` reads: "that tool checks a record exists and runs no mutation". That describes `verify-mutation`'s behaviour without naming the tool's commit.
- The same row's "The reviewer gate's run, commit named, is the observation of record." names no commit and no report, so this gate cannot resolve it.
- The parenthetical "(`cf7462e`, reworded at `aaa6020` so that `verify-mutation` finds each record; …)" restates what the reference can carry.

**F4: a figure against a moving base.** Rule: round 14, the human's addition (a pin is never read as current).
- `:267`, "final figures against main", names no range. The reviewer cannot recompute it.
- The branch merged main at `ea8cdb0`, so the only well-defined range is `e562e9b...c855b77`.

**F5: prose restating a reference.** Rule: the record cap. `:268`, "F3 is built by write-then-patch at a differential location, as F5 and F6 are, and two IPC-writer behaviours are documented in the test file's module doc", restates `worker-report.md:28-32`, which the row already cites.

**F6 (minor): a row with no class.** Amendment 2's preamble (`:260`) reads "Each row names its template class", but row 8 (`:269`) names none.

**Conditions for the reviewer.** I have no Bash, so these are unverified here.
- (a) `git diff aaa6020 874c72f -- renderer/bundle-viewer/` touches only the preregistration. The seam re-run was at `aaa6020`, before the merge of main.
- (b) `git diff d986725 a411fc4 -- renderer/bundle-viewer/scripts/` is empty. `worker-report.md:16` says the red run used "commit `a411fc4`'s tests", but §9 names commit 2.
- (c) The three-dot diff `e562e9b...874c72f` lists exactly five files, and `KNOWN-LIMITATIONS.md` is +12/−0.
- (d) Every Amendment 2 hash, and whether `partition.ts` is 226 lines at both `b391e43` and `515a8b3`.
- (e) `b391e43` is an ancestor of main. The main reflog line for PR #50 reads "the merge-back (PR #50) merged".

**Constitutional checks: all pass.**
- **ADR-017 §4:** G1–G3 enforce exactly the declared nesting `List<List<FixedSizeList<Float64>[2]>>`. Refusing a float32 leaf follows §4's exclusion and is declared in §5.
- **ADR-017 §14:** every refusal is `partition-decode-failed`, a listed state, under "decode" in its must-verify set. G1–G3 are presented as decode preconditions, not type verification.
- **ADR-017 §16:** no new ceiling, and `ceilings.json` is untouched. The walk is bounded by the partition's own arrays, which the reader ceilings already bound.
- **ADR-010 rule 7:** the recovery policy is unchanged. The fix serves "An application error must never present as a hardware hang." (`docs/adr/ADR-010-render-frames-origins-boundaries.md:87`).
- **docs/01 principle 7 and never-block-the-canvas:** an offset-driven unbounded loop becomes linear. No timing is claimed.
- **docs/01 principle 8:** there is no try/catch relabelling.

**The fix is what §2 registered.**
- `…\src\partition.ts:152-176` holds G1–G3, matching §2a clause for clause, including the `?.`.
- `:196-246` holds B1–B4 in §2b's order, every comparison written fail-closed, after the row-count check (`:185`) and before the projection (`:249`) and the walk (`:272`).
- My index arithmetic agrees with §2c: `r0` and `r1` lie in `[0, ringCount]`, and the highest read is `coords[2·pairCount−1]`.
- The detail strings match §2e exactly. Nothing beyond Scope.

## 3. §8, item by item

1. **Durations or timing figures: pass.** None in the code, test names, comments, commit messages, the KNOWN-LIMITATIONS item or the amendments. The build figure in the acceptance report sits at `acceptance.md:40`, outside the cited `:42-56`.
2. **§2g files and Scope: pass,** on the worker's file list (`worker-report.md:36`), subject to reviewer condition (c).
3. **New `FailureState` or other refusal state: pass.** Every new throw is `partition-decode-failed`.
4. **A try/catch in the walk: pass.** None added.
5. **Check order and the doc comment: pass.** The doc comment at `partition.ts:9-11` matches the code order.
6. **New export with only a test caller, or test surface in `dist/`: pass.** No new `src/` export. `scripts/partition-entry.mjs` sits outside the build's entry.
7. **Fixture self-checks and patch positions: pass.** F0–F6 go through `assertRawGeometry`, and F7–F10 through shape asserts. Patches are located differentially (`locatePatchPosition` asserts exactly one differing byte), with no hard-coded byte position.
8. **Detail strings: pass.** Engine facts only.
9. **The KNOWN-LIMITATIONS item: pass.** See §5 below.
10. **Claims about Arrow-type verification or the publisher: pass.**
11. **The real-shape run: pass.** It is filed at `02ec6a3`.

## 4. Amendments 1 and 2, row by row

**Amendment 1.**
- Class 5 is right: a ruling that settles the piece, cited by round and item, which is how class 5's "quoted verbatim" is read.
- Its first line declares it post-result and names what it touches (§2h's text).
- Its form fails on F1 and F2.
- Item 2 resolves to the PLAN node `release-v0-1-1` (`PLAN.yaml:1811`).

**Amendment 2.**
- **Row 1, class 1:** OK. The commits match the worktree reflog.
- **Row 2, class 1:** OK, subject to reviewer condition (b).
- **Row 3, class 1:** fails on F3. Naming an independent run as the observation of record is acceptable only once it resolves to a filed report.
- **Row 4, class 1:** OK. `acceptance.md:42-56` covers the manifest hash, the verdict, "1/1 partitions verified", and the artifact hash. Subject to reviewer condition (a).
- **Row 5, class 1:** `[[V010-CHECK]]` holds. Both pins are on main, and hash equality of the whole file plus the `load().catch` pair is proof enough. "including every v0.1.0 bundle" stands.
- **Row 6, class 2:** the class is right, per §7's own "A deviation is recorded as class 2 with the final figure." The range is missing (F4).
- **Row 7, class 2:** the class is right, per §5's invalidator for fixtures. Each rebuilt fixture keeps its declared property: F0 still ends exactly at B2's and B4's bounds, and F3, F5 and F6 fire B2, B1-start and B3-start. The prose fails on F5.
- **Row 8:** the residual is correct (`[[KL-N]]` and `[[PR]]` are filled at merge), but it carries no class (F6).

**The smallest fix.** Append the following. The custodian or reviewer fills the `[[…]]` placeholders by script, and the reviewer's report is filed on main first.

```
### Amendment 3 — 2026-09-26, record correction after the architect gate, attempt 1 (class 3 for the pointers; class 1 for the withdrawals, round 15 (g))

1. Amendment 1 pins the ledger by line, which round 12 (a) and round 14 (a′) forbid; its reference is RULED 2026-09-26, question round 25, item 4, and item 1's two parentheticals are withdrawn, the item landed at `c855b77` being its reference.
2. Amendment 2 row 3 states a tool's behaviour without its commit (round 15 (c)); the tool is `scripts/plan/verify-mutation.mjs:17-25 @ e562e9b sha256:[[H1]]`, and M0–M10's observation of record is `[[reviewer-report-path]]:[[a-b]] @ [[main-rev]] sha256:[[H2]]`.
3. Amendment 2 row 6's figures are over `git diff --numstat e562e9b...c855b77`, and row 8 is class 1.

Superseded: Amendment 1's `DECISIONS-PENDING.md:40` pin and item 1's two parentheticals; Amendment 2 row 3's parenthetical and its last sentence; row 6's "against main"; row 7's clause before its reference.
```

## 5. The KNOWN-LIMITATIONS item (`C:\dev\wt\viewer-offset-bounds\KNOWN-LIMITATIONS.md:163-173`)

**Order, as ruled: yes.** The bold lead at `:163-164` states the general truth. `:165` opens with "The specific limit:".

**§8 item 9: not tripped.**
- The general truth claims nothing about safety. "sandboxed as any website is" is the human's own phrase and states a containment, not safety.
- "Fixed for every bundle published by a build that includes [[PR]] or later" is about bundles published after the fix, and follows item 16's precedent (`:159-160`).
- Nothing is merged into item 16, nothing is renumbered, and there is no Arrow-type claim ("checks the geometry column's shape").

**Placement and DRAFT marker: as §2h requires.** The item sits in the v0.1.0 section, directly after item 16 and before `## On main since v0.1.0` (`:175`). The comment at `:173` carries its DRAFT marker and cites the ruling by round and item.

**Proposed for the human at the PR, not rewritten:** as written, "Fixed for every bundle…" follows directly after the bold general truth, so a reader could take "Fixed" to cover the general truth, which no fix changes.
- Consider "The specific limit is fixed for every bundle published by a build that includes [[PR]] or later: …".
- Consider changing the comment's scope line to say that the general truth stands for every bundle, and the specific limit for every bundle published before the fix.

## 6. Gate-log line

bundle-viewer-partition-offset-bounds, architect gate attempt 1 at 874c72f: FAIL, record only. The code passes, and so do ADR-017 §4, §14 and §16, ADR-010 rule 7, docs/01 principles 7 and 8, and §8 items 1–11. The fix matches §2a–§2f exactly, with no scope beyond §2. `[[V010-CHECK]]` holds. The KNOWN-LIMITATIONS item keeps the ruled order, its placement and its DRAFT marker, with one wording proposal for the human. Findings:
- F1: Amendment 1 pins `DECISIONS-PENDING.md:40` (round 12 (a) and round 14 (a′)).
- F2: Amendment 1 item 1 reproduces round 25 item 4's words without a mark (round 12 (b)).
- F3: Amendment 2 row 3 makes a tool claim with no commit (round 15 (c)), and its reviewer-run reference does not resolve.
- F4: row 6's figures are "against main", with no range.
- F5: row 7 restates its reference in prose (record cap).
- F6: row 8 has no class.

The fix is one appended Amendment 3 of three correction rows plus a superseded index. This is record round 1 of 2. Reviewer conditions (a)–(e) are open.
