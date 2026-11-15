Reviewed: PR #309 at 588312e4dcf2f04f9ab0f0d05b5a03497825eca4 (the custodian's filing note, 2026-11-12: the gate, the architect, from dispatch, before the reviewer, PLAN node pre-admission-change-detail-braces, filler entry 3; below, the hand-back byte-identical, one final newline added)
Reviewed: filler entry 3, cut/pre-admission-change-detail-braces at 588312e4dcf2f04f9ab0f0d05b5a03497825eca4 (base a06a70dc), gate, architect

Verdict: PASS WITH NOTES

All pins below are `path:line @ 588312e4 sha256:<H>`. I have no shell, so the reviewer computes each `<H>`. The two main-checkout pins are marked `@ c7ea7202`.

## Findings by class

- **Correctness:** none.
- **Evidence:** none. The form's open item on T2's route ("What I could not settle", third item) is closed by T2 together with M2 (check 3).
- **Documentation (must-fix before merge):** none.
- **Notes (mine, not findings):**
  - N-a. All four `RECORDED MUTATION:` lines describe the failure; none copies the output. Details in check 4.
  - N-b. The four recorded-mutation lines and the README's Last-verified bullet name 74fd4f1d, which is a commit on this branch. Main merges by merge commit (PR #307 has a merge commit, as Amendment 1 item 1 records), so it stays reachable. Under a squash merge it would not be.
  - N-c. Two doc lines run past 100 columns: source_watch_ordering.rs:324 and typed_terminal_codes.rs:317. No reference is split across them (round 15 (d) holds), and `cargo fmt --check` gave rc 0 by the report. Cosmetic only.

## Checks 1 to 6

**1. The red line on the words: holds.**
- The hunks in `padb-g-sites.txt` lines 5-6, 8-11, 13-16, 20-23 and 27-30 remove exactly the `{` before `[P6 placeholder]` and the `}` at the end of each literal. No other character changes.
- The four sites at H:
  - kernel/src/skp.rs:1031 @ 588312e4 sha256:<H>
  - kernel/src/skp.rs:1543-1544 @ 588312e4 sha256:<H>
  - kernel/src/skp.rs:1682-1683 @ 588312e4 sha256:<H>
  - kernel/src/lib.rs:546-547 @ 588312e4 sha256:<H>
- The test constant: frontends/shell/src/testUtils/terminalShapes.ts:58-59 @ 588312e4 sha256:<H>.
- Each detail now starts with `[P6 placeholder]`, as the §7 row requires (governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:402 @ c7ea7202 sha256:<H>). The words are still the placeholders.
- I grepped the worktree for `{[P6 placeholder]`, excluding target folders. Outside the form and the draft, the only hit is K15's comment at skp.rs:4367 (OPEN-4 (A)).

**2. Scope and Out-of-scope: holds.**
- The six files rest on the brief's locator (by git) and the report's numstat. I cannot run git, so the reviewer confirms with `git diff --name-only`.
- No new `pub` item. T2 is a private `#[test]` fn in the in-crate test module (skp.rs:4772-4773). No new `EngineError` variant and no new code: the hunks touch literals only.
- Each refusal keeps its code, field set and trigger:
  - error_of builds `fields.detail` from the same variant (skp.rs:2114-2115 and 2162-2164 @ 588312e4 sha256:<H>);
  - the match arms are unchanged around each site (skp.rs:1028-1036, 1537-1547, 1675-1686; lib.rs:544-550, all @ 588312e4 sha256:<H>).
- Nothing changes under protocol/, engine/ or KNOWN-LIMITATIONS.md (the locator).
- OPEN-3 (A), the wire reading, holds. protocol/skp/SKP-V0.md:889-891 @ 588312e4 sha256:<H> declares `fields.detail` with no value. A grep of protocol/ finds none of the four texts.

**3. T1 to T4 (Evidence): each new assertion reaches its clause.**
- **T1.** source_watch_ordering.rs:359-364 @ 588312e4 sha256:<H> is an equality between `refused.fields.get("detail")` and the brace-free literal, after the code check. This is the form's clause. M1 fails T1 alone (report, M1).
- **T2.** skp.rs:4783-4811 @ 588312e4 sha256:<H>. It runs open, resolve, mint, `invalidator.end_generation(.., CoverageLost)`, then attribute. It asserts the code and the brace-free `fields.detail`, matching both of the form's clauses.
  - **No other arm can produce that refusal.** `require_live` runs inside mint before the end (skp.rs:1472), so it returns Ok. After the end, T2 calls only `viewport_query_attribute`, whose one `SourceCoverageLost` construction is skp.rs:1543 (skp.rs:1513-1553 @ 588312e4 sha256:<H>). `attribute_ticket` returns false once no live generation remains (skp.rs:622-635 @ 588312e4 sha256:<H>).
  - **What the runs prove (by the report).** In the base run the code assertion passed and the detail equality failed with braces on the left, so the route reached an arm with that braced text. M2 restored the braces at 1543 only and failed T2 alone, so T2 reads skp.rs:1543.
- **T3.** typed_terminal_codes.rs:368-376 @ 588312e4 sha256:<H> asserts on the whole `"<code>: <message>"` text, as the form says. I composed the expected text from engine/src/error.rs:425-431 @ 588312e4 sha256:<H> and the literal at 1682, and it agrees. M3 fails T3 alone.
- **T4.** skp.rs:4993-5001 @ 588312e4 sha256:<H> is a whole-detail equality, as the form says. Its text is the same as T3's, so the text alone does not tell lib.rs:546 from skp.rs:1682. The mutation matrix does: M4 fails T4 and not T3, and M3 fails T3 and not T4. The route is the redeem step through `liveness_refusal` (lib.rs:513-553 and 563-571 @ 588312e4 sha256:<H>).
- Each mutation fails its own test and none of the other three (report, Mutations). The form also requires that `--list` gains exactly T2; by the report it does (1139 tests at base, 1140 at head).

**4. The recorded mutations and the index: hold, with N-a.**
- Each line names the full commit 74fd4f1de5e4400f0d0472a0d5c522e2468a08c7:
  - T1: source_watch_ordering.rs:323-329 @ 588312e4 sha256:<H>
  - T2: skp.rs:4764-4771 @ 588312e4 sha256:<H>
  - T3: typed_terminal_codes.rs:316-320 @ 588312e4 sha256:<H>
  - T4: skp.rs:4973-4978 @ 588312e4 sha256:<H>
- T2's line names its test literally. T1, T3 and T4 say "this test" inside the test's own doc. That is naming by attachment, which the form's "by name" allows.
- Each failure text matches the report's runs: the assert message, the equality that failed, "1 failed", and for T1 the other three passing.
- All four are descriptions, not copies (the fourth commit reworded them):
  - T1 and T2 describe `left` and give `right: Some("…")` in backticks, broken across a comment line. That `right` value is the assertion's own argument, rebuilt by the worker and not copied from output.
  - T3 and T4 describe both sides.
  - None of these is the human's words, so none is a red-line quote.
- K15 (skp.rs:4363-4368 @ 588312e4 sha256:<H>) should equal a8125f81's pin sha256:3aafacb309fb8235f9b229e7af1146561f4acacfea13836757cec430dacbde06. No hunk changes the line count above 4363, since the three skp.rs hunks there replace lines one for one. The reviewer recomputes the hash.
- kernel/README.md:390 @ 588312e4 sha256:<H> adds the form path to the list, which OPEN-7 (A) requires, and the path resolves.
- kernel/README.md:361 @ 588312e4 sha256:<H> claims that pointer was checked at 74fd4f1d. The form exists at B, so it resolves at 74fd4f1d and at H, and the claim is true. See N-b.

**5. The seam (OPEN-2 (A)): holds.**
- The changed constant (terminalShapes.ts:56-61 @ 588312e4 sha256:<H>) has one importer: liveTicketSet.test.ts:163-168 @ 588312e4 sha256:<H>.
- That test splits at the first ": " and asserts on the code only, so its outcome does not depend on the braces.
- By my reading, the constant's concatenation equals T3's string, so the shell test still models what the kernel sends. The reviewer byte-compares the two.

**6. Departures in the filing note, weighed against the form.**
- Four commits where the brief gave two. The form fixes no commit count, so this breaks the brief only. It was disclosed, and needs no closure.
- The workspace test run and clippy ran at the second commit, not at the head.
  - Form: no requirement. The form names the four tests and the four mutations, and those ran at the head.
  - Closure: the branch's CI at 588312e4. The reviewer reads its test and clippy jobs.
  - Clippy's rc 101 came from the renderer crate and stopped before the kernel was linted. CI's clippy at the head closes that too.
- An undisclosed `git stash`. Brief only. What is gated is the tree at H, which the reviewer diffs, and the stash list is now empty. Closure: a disclosure line in the PR body.
- `cargo fmt` and two `npm ci` ran outside a hold. This breaks the machine rules in the brief, not the form. No product closure.
- Two doc edits made by scratch scripts. Brief only; their result is in H and is read above.
- Four errored calls the report does not name. Report fidelity, brief only; the custodian's note already records them.

## For the human

- No P6 wording finding: no span changed beyond the eight braces.
- OPEN-1 to OPEN-7 were taken by the custodian on your direction of 2026-10-31, item 4. The settlement records that you review each on your return.

## The packet's gaps

- No git access: the six-file list, the numstat and every `<H>` hash rest on the locator and the reviewer.
- I could not read the branch's CI state at 588312e4.
- I did not have the worker's brief or its transcript. I weighed the departures from the filing note alone.
- The merge method (merge commit or squash) is not stated. N-b depends on it.

I left no background shell; I have no shell.

Model: claude-opus-5-5.
