Reviewed: PR #318 at 63d66887049e8ddafaef7c6183f09138e7893480 (the custodian's filing note, 2026-11-14: the gate, the reviewer, this gate's attempt 4 in the gate log, under the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2, at the merge head M of main N (f47a2ad90f69dfa02f63636887d0402862c03edd) into C4 (c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6), scoped to the merge under the advisor's ruling ADV-2026-11-14-21 item 4 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-21-318-hold-main-into-the-branch-both-gates-at-the-merge-head-a-standing-changed-paths-list-before-a-last-gate.md`), with a verdict and a row of its own (item 4 (d)); its message sent at 2026-11-14T21:55:15Z to the same run, whose resumed prompt at 2026-11-14T21:55:19Z holds it byte for byte inside the harness wrapper (the message 495 bytes, sha256 c570d1ed26e168a7926b9b593d381509119903b3d73a2becdf72525b0a4502c7), pointing to its packet by file `<S>/msg-g318mr.txt` (4567 bytes, sha256 38734bfa6b6cb0aeef8aee19c3495afddf07456a69ffd974b9cea030725df63d), which names `<S>/adv-2026-11-14-21.copy.md` (5349 bytes, sha256 81630b699934f2925d86affc1d1a7c655e62a7a22ffe6a5b8a32b3bb5d9539dc), `<S>/pr-318-hold.copy.md` (5775 bytes, sha256 ccd6db516a52fea9cf5a1b9607ca1362f953bd76287530f00f3e6b28bff11d14), `<S>/check-318-merge.mjs` (4770 bytes, sha256 0e3bdc150378e8352e6f095824e91ff0e27ae9f87298b6a938eff0314ab47d6f) and `<S>/check-318-merge-M.out` (1645 bytes, sha256 68bc7cf858d88f7581978f72badadff2f59d8dd1bbed9927ebc1109f60ed7373); this attempt 2026-11-14T21:55:19Z to 2026-11-14T22:14:08Z by its transcript, 35 calls (Bash 29, Read 5, SubagentHandback 1), none errored, no file written by a Write or Edit call, model claude-opus-5-5; by script, every run it claims (the custodian's check script and its cmp, the four verify scripts, verify-quotes whole in a shared hold, gh pr checks, gh run view and list, its start and end checks) has a Bash call behind it whose result is not an error; below, the hand-back byte for byte (with one final newline, 9383 bytes, sha256 c21cc64a53af048d6e0576e68be777da0e590a72a8021042e974a2e87a4d97c7). Nothing is changed.)

Reviewed: PR #318 at 63d66887049e8ddafaef7c6183f09138e7893480, gate reviewer, attempt 4 (cut/second-open-history-before-1c-step-3 @ 63d66887049e8ddafaef7c6183f09138e7893480)
Verdict: PASS

## Findings

**Correctness:** none.
**Evidence:** none.
**Documentation:** none.

**Observations** (none of these blocks the gate)

- **O1. Item 4 (b) and Rust (my paraphrase).** ADV-2026-11-14-21 item 4 (b) says main changed no Rust, Cargo or CI file since the base. That no longer holds at N. `git diff --name-only 695e1303 N` shows the Rust changes are in `kernel/src/skp.rs` only: #320's three tests in `mod ticket_drop_under_lock_regression`. No Cargo or `.github` file changed. Your brief already says this.
  - The three tests name nothing in `session_history`, `StepRecorder` or `Projects`.
  - Both workspace runs at M passed: Ubuntu and Windows, push and pull_request, all attempt 1. That is the evidence that M builds and passes with those tests and this piece's kernel changes together.
- **O2. The C1 pins are historical, as they were at C4.** `kernel/src/session_history.rs` has blob e7c62079 at C1 (a2fbab2c) and blob 7dbd6bec at C and at M. So item 43's ten pins are historical at C1, as their comment says ("Where the code does this, at C1:"). verify-quotes at M reports 0 hash-reference errors. The merge does not touch this file, so my C4 reading stands unchanged.
- **O3. My own C3 report is now flagged.** verify-cites at M lists a new advisory against my C3 report: its `ADR-036…:295` cite is past the file's 293 lines. This is the miscount I recorded at C4 (O3). It is advisory only; the run exits 0.
- **O4. Amendment 3 item 6 still holds after the merge.** It names `kernel/README.md:395` on main at eedcbcef. Main's two README edits (lines 361 and 390) replace one line each, so no line moves. Line 395 is the same "Declared limits" line at eedcbcef, at N and at M, still ending `… 62, 63`. Nothing in item 6 is made untrue.
- **O5. The merge commit message.** It names N in full and ADV-2026-11-14-21 item 2. It carries the DCO Signed-off-by line, which CI's "every commit is signed off" check passed at M. I do not quote the address.

## (1) Item 3 (a) to (d): the custodian's script

**Calls**
- `node <S>/check-318-merge.mjs 63d66887… f47a2ad9…` > `<S>/g318mr-chk.out`: rc=0, ALL-PASS, 21 lines.
- `cmp <S>/g318mr-chk.out <S>/check-318-merge-M.out`: rc=0.
- All four packet files matched their stated sizes and sha256.

**What each part proves, and where it is weaker than item 3's words**
- **(a)** `rev-list --parents`: M has exactly two parents, c8f8bdca then N, in that order. This equals item 3 (a).
- **(b)** Each of the ten files from `git diff --name-only BASE C`, other than KNOWN-LIMITATIONS.md, has the same blob at M and at C. That equals item 3 (b)'s words, ADR-036 included (blob 24d412b6a1c6).
  - Weaker: it does not check that main left those ten files alone. If main had changed one, M == C would mean main's change was dropped.
  - My own `git diff --name-only 695e1303 N` over the PR's files gives KNOWN-LIMITATIONS.md only, which closes this.
- **(c)** The script builds the expected file: N's file with N's two item-43 lines replaced by C's three, and item 63's four lines removed, then compares the whole file with M's. They are equal (sha256 067d0b11163fd708…).
  - This proves item 3 (c) in full: item 43's line and two comments are C's, item 63 is gone, and every other line is N's.
  - The separate "item 47 present" line is a presence check only. The whole-file equality is what proves item 47 is N's text.
  - Weaker: it locates items 43 and 63 by regex with fixed line counts (2, 3 and 4). It checks those shapes, and it checks that base and N agree on them. It does not check the branch's own change to the file against the base. That was the advisor's check 4 at C and the earlier gates' work, not item 3 (c).
- **(d)** The diff from N to M names exactly the base-to-C file list, sorted and equal: eleven files.
  - (b), (c) and (d) together fix M's whole tree: every path outside the eleven is N's, ten of the eleven are C's, and KNOWN-LIMITATIONS.md is the computed merge.
  - "No hand edit" cannot be proven from a tree. What is proven (my paraphrase): M's tree is the clean three-way result the advisor predicted (item 2 (d)), so any edit would have to be identical to that result.
- **Extra:** C1 a2fbab2c is an ancestor of M, which supports item 2 (b). My `ls-remote` shows the branch at M, a fast-forward from C, with no rewrite.

## (2) Item 3 (e): the four verify scripts, from C:/dev/wt/so at M

- **verify-cites.mjs** > `<S>/g318mr-vcites.txt`: rc=0, PASS, 3047 files, 197 advisories (194 at C4).
  - The three new advisories are in main's records and my C3 report (O3).
  - None is in KNOWN-LIMITATIONS.md or the form.
- **verify-test-claims.mjs** > `<S>/g318mr-vtc.txt`: rc=0, PASS, 804 claims across 265 files (803 and 263 at C4).
- **verify.mjs --offline** > `<S>/g318mr-verify.txt`: rc=0, "verify:plan PASS".
- **verify-quotes.mjs**, whole, in a shared hold, background shell b48puvbva > `<S>/g318mr-vquotes.txt`: rc=0, PASS.
  - Counts: 156 checked, 125 verified, 30 baselined, 1 advisory, 0 hash-reference errors (2 hash-baselined, as at C4), 932 ruling cites resolved (927 at C4), 0 ruling-cite errors.
  - Compared with C4's output, only the scanned-file count line differs: 265 files against 263.

## (3) Items 43 and 47, read whole at M (from `<S>/g318mr-kl-M.md`)

- **Item 43** is at KNOWN-LIMITATIONS.md:436, with its approval comment at :437 and the advisor's comment with the ten C1 pins at :438. It is byte-equal to C's (the script's check (c), and my cmp at the start, rc 0).
- **Item 47** is at :448-456. It is the publish redaction: a pattern search, the 12-character run, and the 3-byte floor for the login and computer names. Main's addition is its last sentence and the comment at :456, the human's wording of 2026-11-12, item 7.
- Item 47 says nothing about session history files, and item 43 says nothing about bundles. Item 43's "nothing in the app sends it anywhere" is not contradicted by item 47: the bundle is built from the dataset and the style, not from the history file (my reading, unchanged from C4).
- Rendering is unaffected: item 43 is followed by a blank line and item 45 at :440, as at C.

## (4) Is anything passed at c8f8bdca made untrue by what main brought?

No. Main's changes since the base, from `git diff --stat 695e1303 N`, excluding state, governance and site:

| File | Lines changed | Relation to this piece |
|---|---|---|
| KNOWN-LIMITATIONS.md | 3 | item 47 only, read above |
| frontends/shell/MANUAL-WALKTHROUGH.md | 2 | row G3 |
| frontends/shell/e2e/pan-anchor.mjs | 27 | e2e file |
| frontends/shell/src/publish/PublishDialog.tsx | 7 | doc comment |
| kernel/README.md | 4 | O4 |
| kernel/src/skp.rs | 150 | tests only, O1 |

- Of these, only KNOWN-LIMITATIONS.md is a PR file.
- The code, the tests, ADR-036 Amendment 2, the forms and SKP-V0.md that I gated at C are blob-equal at M.
- The runs and the mutation observations of the earlier attempts stand. I repeated none: every run above is a new run that item 3 (e) asks for at M.

## (5) CI at M

`gh pr checks 318`, read at 2026-11-14T22:02:46Z > `<S>/g318mr-ci.txt`: rc=0, 18 rows, all pass.

`gh run view <id>` for each of the 12 runs > `<S>/g318mr-runs.txt`: each rc=0, every headSha 63d66887049e8ddafaef7c6183f09138e7893480, every run completed with success.
- Run on both push and pull_request:
  - Product CI — Rust workspace: 43644208783 and 43644212466;
  - Rust fmt: 43644209077 and 43644212451;
  - Governance CI: 43644208799 and 43644212404;
  - Ported notices: 43644208862 and 43644212491;
  - Product CI — shell: 43644208869 and 43644212534.
- Run on pull_request only:
  - DCO sign-off: 43644212506;
  - Exposure scan: 43644212458.

`gh run list --commit 63d66887…` > `<S>/g318mr-runlist.txt`: rc=0, 12 runs, each attempt=1 and success. No re-run.

## Start and end checks

- **Start** (`<S>/g318mr-start.txt`):
  - HEAD and the remote branch are both M; branch `cut/second-open-history-before-1c-step-3`; porcelain empty;
  - parents are C and N; N is on origin/main (rc 0); merge base 695e1303;
  - C: 50G free, D: 352G free.
- **End** (`<S>/g318mr-end.txt`, 2026-11-14T22:11:27Z), rc=0:
  - HEAD is M; porcelain empty; the remote branch is M;
  - remote main is still f47a2ad9 (= N), so no path of the piece changed on main after N;
  - C: 50G free, D: 352G free.
- I made no writes in the worktree.

## Status readings and hold lines (masked)

- **status 1** (2026-11-14T22:01:28Z), rc=0: quiet=False average=28.5% peaks-over-25=51; no project=SpatialIDE line.
- **hold:** `MACHINE_HOLD shared project=<m> cores=<m> affinity=FF shell=bash.exe:37632 also=<m> (commands started from now on inherit it; release when done)`. The hold was granted; the exit code was not in 96 to 99.
- **release:** `MACHINE_RELEASED project=<m> shell=bash.exe:37632 affinity=FF (cores 0-7)`
- **status 2** (after the release), rc=0: quiet=False average=30.7% peaks-over-25=57; no project=SpatialIDE line.

## Background shells, and my model

- b48puvbva (verify-quotes in the hold): completed, exit 0.
- bm28ndmdt (a bounded wait loop, moved to the background by the harness at 180 s): completed, exit 0.
- None is still running.

Model, as the harness reports it: Opus 5.5 (claude-opus-5-5).
