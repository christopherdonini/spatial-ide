# verify-cites gives a cite starting at line 0 a reason of its own, and reads a pin at the file the tree resolves the path to (PLAN node `verify-cites-pin-resolution-and-line-zero`) — preregistration

**Authority:**
- PLAN node `verify-cites-pin-resolution-and-line-zero` (`PLAN.yaml:4889-4905` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:1744a7ca1f807cc4518a9fc5b9b724d78b2e96cfc0ee86e32d32a0e2cde7a75e).
- It is first in the governance lane by `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:12` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:c13138a5d6b24ca065029eb8715d26c9276fbbbd3b068b356830c78cd0a6849d (item 3).
- Its two defects were found by PR #191's attempt-2 reviewer gate (gate-log 442): C3 at `state/consults/gates/2026-10-08-verify-cites-pinned-citations-gate1-reviewer-attempt-2.md:53-60` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:296da637934cd9ebee76ce9c094b8bdfc1a5369424ba1db07933872e60866ce4 and D4 at `state/consults/gates/2026-10-08-verify-cites-pinned-citations-gate1-reviewer-attempt-2.md:98-109` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:173a9440c573d97505fba14056f44f7e2d4f225a0daf73cdd133ee0042fdb7cf.
- Both are routed by `scripts/plan/VERIFY-CITES-PINNED-CITATIONS-PREREGISTRATION.md:56-59` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:8e3de3c1542060b31b769dae3ed99ae24247acaf8e9067f11171c9b89d523d77 (its Amendment 2, item 7). That record is closed and is not edited.

**Drafted by** the architect agent on the custodian's brief, read at main 2ffbf957. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Form: full.** The reasons, under `AUTONOMY.md:315-332` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3 (§21a), its fourth category at `AUTONOMY.md:325-327` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7, and `AUTONOMY.md:482` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669 (§25(e)):
- Under §2.2 the pin is found for the fixture of the C2 test (`scripts/plan/verify-cites.test.mjs:322-327` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:007806b942003be43e51e39dfbee56318a72e2ed260da2103920838034a0b139). That test exists to prove that a pin whose path is not found keeps the tree's reason. Its fixture must therefore change, and that is a property currently under test.
- The header's stated limit on where a pin is read (`scripts/plan/verify-cites.mjs:59-63` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:2bf6e82d8610fb204f6b2404235a3aba15d3131919af88af63f44a5aabcad9ab) is replaced.
- An Out-of-scope line could not claim that none of the four categories is touched.
- The precedent is the same reading in `scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:5-8` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:e7a079c8e1ffd12cabd7d56ba82f7db336851f9cb31dd86251ed0157125f5a0d.
- There is no ADR, no security posture, no wire and no product file. The size (§7) does not decide the form.

## §0. Disclosure
- **Reasoned from the code at 2ffbf957. Nothing was run.** The piece relies on:
  - `checkCitation`: `scripts/plan/verify-cites.mjs:247-262` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:b366489b0e2c6149a901184500726649c88bf0a7aa556146609282937a8d4537. Line 251 marks a start or end below 1 as invalid. Lines 256 and 261 still word the failure as the highest line exceeding the file. For a range from line 0 to line 2 that is line 2, which is false. For a bare line 0 the reason names line 0 as "exceeding" the file, which is also false.
  - `checkPinned`: `scripts/plan/verify-cites.mjs:264-287` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:966d02248169bfdd1a3548405e17eb91e78b80077a889982a71ca7a6046471d7. Line 273 takes the path as written. Line 275 reads it at the pin from the repo root. Lines 283-285 give the same false wording at the pin.
  - The pin branch of `runVerifyCites`: `scripts/plan/verify-cites.mjs:349-355` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:b7006130cc6a18e2287acae06744832cc289a7b333a729338467bed9c2c94967. It keeps the tree's reason when the pin reports `missingFile` and the tree found a file (C2).
  - The tree's resolution, `resolveRef`: `scripts/plan/verify-cites.mjs:178-209` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:924a616bd247dfd3ae64675a292470cdc47b3183a2aacb2422397734eaf956c4. It tries the root-relative path for a slash path, then the path relative to the citing file's folder, each with a `.md` fallback (the exact set). It then adds basename suffix matches (the full set).
  - **The other reader of a pin**, `checkHashRef` in verify-quotes: `scripts/plan/verify-quotes.mjs:770-833` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:17c7289f57638003b17bd7f9d4f4a200e9d26d925a777dfe25ededb082f591c7. Its resolution at `scripts/plan/verify-quotes.mjs:779-800` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:f5282d1927220742aa6b16adeacb9c1cb6721d73d2cdf1fe9d3caed6b3a6150b uses the exact set if it is not empty, else the full set. With one candidate it reads the pin at that file. With none it reads the path as written. With several it fails as ambiguous. It imports `resolveRef` and four other exports from verify-cites (`scripts/plan/verify-quotes.mjs:137` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:b9992c548aaf1219d54df62b12da64e34544d72efb41bf5d8c37a8fff4bec1fb).
  - The only other importer of verify-cites is `scripts/plan/rotate-decisions-pending.test.mjs:292-294` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:fd4de565b335ed9d47317cd2b058a57229e54f5b50c11f8823ade150df7adc56, which checks one unpinned cite.
- **Line-0 cites at main.** I searched the working tree, which matches 2ffbf957 for tracked files. I covered the `.ignore`d folders `state/drafts/`, `state/consults/gates/`, `state/cut-archive/` and `site/`, plus `.claude/agents/` and `.github/`. Exactly one path-shaped token has a line of 0: `state/consults/gates/2026-10-08-verify-cites-pinned-citations-gate1-reviewer-attempt-2.md:54` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:e40ddc6a00efc640c49d1a79666b4b1dfb65111f8ba05efe72baf4565952c3f3, an unpinned rooted range starting at line 0, in a gate report, so advisory. This search is a floor; I1 is the proof.
- **README.** `scripts/plan/README.md` has no verify-cites section at 2ffbf957 (its headings run from line 1 to line 379). The checker's header comment is its documentation, and nothing in the README changes.
- **Reuse index** (the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c), byte for byte from the brief:
```text
$ node tools/reuse.mjs citation checker pinned line
No prior art recorded for "citation checker pinned line". Research it before planning an implementation.
$ node tools/reuse.mjs path resolution fallback
No prior art recorded for "path resolution fallback". Research it before planning an implementation.
```
  Both are misses, so no prior art is used.
- **Fixture drive:** nothing is measured. ADR-006 does not apply (repository tooling). No docs/08 row.

## §1. May and may not claim
- **May claim:**
  1. A cite whose start or end is line 0 fails with a reason that names line 0, in the tree path (both tiers) and the pin path. Its status and tier are unchanged. (T-C3a, T-C3b, I1.)
  2. A pinned cite that fails in the tree is read at its pin at each file the tree resolves its path to (the exact set if any, else the suffix set), then at the path as written. It passes if any of these is a file at the pin holding the cited line or range. (T-D4a, T-D4b, T-D4d.)
  3. No cite that passes at main fails at the head, and no cite changes tier. (T-D4d, I1, I2.)
- **May not claim:**
  - that a pin resolves a relative, `.md`-fallback or basename cite to a file that is no longer in the tree. Such a cite is read at the path as written only, as today;
  - that a loose pinned cite matching nothing in the tree is read at its pin. It is skipped, as today;
  - that the passing file is the one the author meant. Like the tree check, this proves existence and bounds, not meaning;
  - a check of a reversed range (end below start) or a correct line count in the reason (OPEN-4);
  - any docs/08 figure.
- **Unchanged:**
  - `extractCitations` and its pin pattern (`scripts/plan/verify-cites.mjs:157` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:f12455f55d6c85f47a375bf8b94fb5aae249daa13f2bd0f9ed6ef550125a0e9e);
  - `resolveRef`, `classifyPath`, `topDirsOf`, `buildTrackedIndex`, `isPathShaped` and `CODE_EXTS`;
  - the three other disclosed pin limits (after a closing backtick or two spaces; a cite that resolves in the tree is not checked; a hex word after `@`);
  - the rotating-ledger rule (`scripts/plan/verify-cites.mjs:343-348` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:3747b888f1feb6f44f860d79c2220c5c48fdde15e2ef460cdad08cd7a1883b47), the archived prefixes, the doc-number exclusion, the routing (`scripts/plan/verify-cites.mjs:356-365` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:c014062074f08ecb04176b6eac102af162c31dd6f63265d356f1e236184fadf0) and the condition for reading a pin (line 350);
  - the reason texts for a non-zero line, for a missing commit and for a missing file, and the reason for a cite with no match;
  - the lenient line count, the output format, the CLI and the exit codes;
  - `verify-quotes.mjs` entirely, and every existing test except the C2 test's fixture.
- **Seams:**
  - **`runVerifyCites` into `checkPinned`:** internal. `checkPinned` gains a required third parameter, the ordered list of paths to read. Its one product caller passes it, and no default exists.
  - **verify-quotes into verify-cites' exports:** untouched, by §8 item 1. The verify-quotes suite stays green.
  - **Agreement with `checkHashRef`:** with one tree candidate, both read the pin at that file. With none, both read the path as written. They differ in two disclosed ways:
    - with several candidates, verify-cites passes if any is in range, as its tree check does at line 252, while verify-quotes refuses as ambiguous (a hash must name one file);
    - verify-cites also tries the path as written after the candidates, so that no pass is lost.
  - **No new export.** The candidate list is an internal helper.

## §2. The change
1. **C3, line 0.**
   - **Before:** a cite whose start or end is below 1 fails as out of range, with a reason naming its highest line as exceeding the file. That holds in `checkCitation` (exact and suffix tiers) and in `checkPinned`.
   - **After**, when the start or the end is 0:
     - tree, exact tier: status `oob-exact`, reason `line 0 does not exist in "<file>" (lines count from 1)`;
     - tree, suffix tier: status `oob-suffix`, reason `line 0 does not exist in <which> (lines count from 1)`, with `<which>` formed as today;
     - pin: once the commit is found and a path is a file there, the reason is `line 0 does not exist in "<path read>" at pinned commit <pin> (lines count from 1)`. The order stays commit, then file, then line, then range.
   - A rooted cite with no match keeps its no-match reason. Statuses and tiers are unchanged.
   - These strings are the architect's wording, not the human's, and not app strings (not P6).
2. **D4, where a pin is read.**
   - **Before:** `checkPinned` reads only the path as written, from the repo root. The gate's probes found three cases:
     - a relative cite (`src/App.tsx` at line 4, from `frontends/shell/NOTE.md`) stays gated;
     - a `.md`-fallback cite (`docs/README` at line 4) stays gated;
     - a basename cite (`pool.rs` at line 4) stays advisory;
     - in each case the file the tree resolves to holds the line at the pin.
   - **After:**
     - The list of paths is the tree's exact set if it is not empty, else its suffix set, then the path as written with `./` removed. The list is in order, without duplicates.
     - `checkPinned` checks the commit once, then reads each path at the pin. It returns ok at the first file holding the cited line or range.
     - Otherwise it returns the first failure that is not a missing file, in list order: a directory, line 0 (§2.1), or a range beyond the file.
     - If every path is missing, it returns `missingFile` with today's reason, which names the path as written.
     - A list holding only the path as written behaves exactly as today. That is the case for a rooted cite with no match, and for every cite whose tree candidate is its own path.
3. **The header** (`scripts/plan/verify-cites.mjs:14-16` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:a1543b71364ce9a0d28523700d9cc74137593ebe35300be3cf06528f0bc0da0c and `scripts/plan/verify-cites.mjs:59-63` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:2bf6e82d8610fb204f6b2404235a3aba15d3131919af88af63f44a5aabcad9ab):
   - The PINNED FALLBACK sentence names the order in §2.2.
   - The D4 limit becomes: a pin is read at the files the tree resolves the path to, then at the path as written, so a relative, `.md`-fallback or basename cite to a file no longer in the tree is read at the path as written only; a loose cite matching nothing is not read at its pin.
   - The header also names the line-0 reason.

## §3. Corpus predictions
- **E0, at the form's commit, before code (the custodian, by script):** run main's checker at 2ffbf957 over the main checkout and list every advisory entry whose cite carries a pin, with path, line, target and reason. The list goes into Amendment 1. Gated at main is 0.
- **I1, main's checker against the head's, over the tracked tree at 2ffbf957:**
  - gated is 0 and 0;
  - in the advisory set, exactly one entry changes because of C3, the cite at `state/consults/gates/2026-10-08-verify-cites-pinned-citations-gate1-reviewer-attempt-2.md:54` @ 2ffbf957d5a4c34cc0879af3dae66ba749b26b58 sha256:e40ddc6a00efc640c49d1a79666b4b1dfb65111f8ba05efe72baf4565952c3f3. Only its reason changes, to the line-0 exact-tier wording;
  - every other change is an E0 entry that either leaves the set (a candidate passes at its pin) or changes only its reason (a candidate found at the pin and out of range there gives the pin's reason);
  - no entry is added. A miss on the counts is a class 2 result. A change of any other kind is invalidator I1.
- **I2:** the same two checkers over the head's tree. The prediction is the same, and the head's own new files add no gated entry.

## §4. Tests and mutations
Each test is end to end through `runVerifyCites`, on a temporary git repository like today's. Each mutation is observed by applying it, running `node --test scripts/plan/verify-cites.test.mjs`, recording the failing names with the commit, and reverting it, in a RECORDED MUTATION comment. No comment carries a line-0 or out-of-range rooted cite token.
- **T-C3a, new, `a_cite_starting_at_line_0_is_reported_at_line_0_in_the_tree`:**
  - Setup: an unpinned rooted range from line 0 to line 2 into a 3-line file, plus a basename cite at line 0.
  - Assert: gated 1 and advisory 1, each reason matching the line-0 wording of its tier.
  - Mutation M-C3a: the line-0 branch in `checkCitation` removed. It fails T-C3a.
- **T-C3b, new, `a_pinned_cite_starting_at_line_0_is_reported_at_line_0_at_its_pin`:**
  - Setup: the same range, pinned at a commit where the file exists.
  - Assert: gated 1, reason matching the pin's line-0 wording.
  - Mutation M-C3b: the line-0 branch in `checkPinned` removed. It fails T-C3b.
- **T-D4a, new, `a_pinned_relative_or_md_fallback_cite_is_read_at_the_file_the_tree_resolves`:**
  - Setup: the gate's first two probes. `frontends/shell/src/App.tsx` and `docs/README.md` have 5 lines at the pin and 2 in the tree. `frontends/shell/NOTE.md` cites each at line 4, pinned.
  - Assert: gated 0.
  - Mutation M-D4a: the pin read at the path as written only. It fails T-D4a, and also T-D4b and T-D4c (disclosed).
- **T-D4b, new, `a_pinned_basename_cite_is_read_at_its_suffix_match`:**
  - Setup: a basename cite of `pool.rs` at line 4, pinned, in `pinnedRepo`.
  - Assert: advisory 0.
  - Mutation M-D4b: the list built from the exact set only. It fails T-D4b only.
- **T-D4c, new, `a_pinned_basename_cite_past_its_resolved_files_end_gives_the_pins_reason`:**
  - Setup: a basename cite of `pool.rs` at line 9, pinned (today's C2 fixture).
  - Assert: advisory 1, reason matching `exceeds "engine/src/pool.rs" at pinned commit`.
  - Mutation M-D4c: the failure taken from the read of the path as written instead of the first path found. It fails T-D4c.
- **T-D4d, new, `a_pinned_cite_still_passes_at_the_path_as_written_when_the_tree_resolves_elsewhere`:**
  - Setup:
    - commit 1 holds a root `scripts/x.mjs` with 5 lines and a `renderer/v/scripts/x.mjs` with 2 lines;
    - commit 2 deletes the root file and adds `renderer/v/NOTE.md`, which cites `scripts/x.mjs` at line 4 pinned at commit 1.
  - Assert: gated 0. This passes at main too: it guards that no pass is lost.
  - Mutation M-D4d: the path as written dropped from the list. It fails T-D4d only.
- **The C2 test, fixture changed, name kept:**
  - New fixture: the cited basename is `late.rs` at line 9. `engine/src/late.rs`, with 2 lines, is added after the pin commit, so every path is missing at the pin.
  - Assert: the reason matches `^line 9 exceeds engine/src/late\.rs \(`.
  - Its mutation, the reason choice made unconditional, is re-observed at the head.
- **Unchanged:** P1 to P6, MV1, MV2, the two DECISIONS-PENDING tests, the tree and recognizer tests, and `rotate-decisions-pending.test.mjs`, each with its recorded mutation.

## §5. Predictions · unchanged · invalidators · falsification
- **Predictions:** §3, and every test in §4 green at the head.
- **Unchanged:** §1.
- **Invalidators:**
  - I1: an I1 or I2 change outside §3's classes, or any added entry;
  - I2: an existing test other than the C2 test needs a change;
  - I3: the verify-quotes or rotate-decisions-pending suite goes red;
  - I4: a file beyond §7 is needed. That is routed, not absorbed.
- **Falsification:** a cite that passes at main and fails at the head. That would make §1 claim 3 untrue.

## §6. Instruments
- E0, I1 and I2 are assertions, not measurements.
- A scratch script imports `runVerifyCites` from main's file (`git show 2ffbf957:scripts/plan/verify-cites.mjs` into scratch) and from the head's. It runs both with `repoRoot` set to a clean tree, and prints the sorted gated and advisory sets (path, line, target, reason) and their difference, each changed row with its class.
- The output is filed with the PR, and each run names its commit (round 15 (c)). The wall time of each run is reported for information, not as a budget.

## §7. Declared values and ceilings
- The list of paths read at a pin: the exact set, else the suffix set, then the path as written (§2.2). There is no cap on its length, and no new constant.
- The three line-0 reason strings in §2.1.
- **Files:**
  - `scripts/plan/verify-cites.mjs`, at most 60 changed lines;
  - `scripts/plan/verify-cites.test.mjs`, at most 150;
  - total at most 210, by `git diff --numstat B...HEAD` over those two paths.
  - The form and PLAN's gate line are exempt (§21c).
- Budget: 90 minutes (the node carries 45).

## §8. Block-on-sight
1. Any change to the signature or behaviour of an export verify-quotes imports, or any edit to `verify-quotes.mjs`.
2. A new export, or an optional or default parameter with no product caller.
3. A cite that passes at main failing at the head (I1, I2), or any tier change.
4. A comment, test comment or form line carrying a token verify-cites gates (a line-0 or out-of-range rooted cite).
5. A mutation recorded as observed by a `verify-mutation` run.
6. A diff outside §7.
7. A header sentence claiming a resolution or limit the code does not have.

## §9. Gates
- Architect and reviewer.
- Suites: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, plus verify-cites, verify-quotes, verify-test-claims and verify:plan. E0, I1 and I2 are filed.
- No operator row.

## §10. Amendments (opens empty, append-only; classes 1 to 9)

## §10 Amendment 1 — at the commit: the pins, the human's OPEN-1 to OPEN-3 (A), the E0 list, rule (00) by the branch diffs, the budget (class 1); written by the custodian

*Written by the custodian at the commit that adds this form. References only: the architect's drafting consult `state/consults/2026-10-23-verify-cites-pin-resolution-and-line-zero-architect-draft.md` (its rule (00) and OPEN items); the human's ruling `state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md`, item 2.*

1. **The pins.** The draft's 26 line cites, read at main 2ffbf957, are pinned above by script at 2ffbf957d5a4c34cc0879af3dae66ba749b26b58, each over its lines joined with a final newline; the checker, its test, verify-quotes, the plan README and AUTONOMY.md are the same at the commit that adds this form.
2. **The human's rulings:** OPEN-1 (A), a pin's paths are the tree's candidates, then the path as written; OPEN-2 (A), several candidates pass if any holds the cited lines; OPEN-3 (A), the path as written is kept after the candidates. §2.2 stands as drafted. OPEN-4's two defects are the proposed nodes `verify-cites-out-of-range-line-count` and `verify-cites-reversed-range`, placed after this lane's queue by the human (item 7).
3. **E0, by script at this commit** (`runVerifyCites`, its code the same as at 2ffbf957, over the main checkout at fb98f44b, cross-checked by matching each advisory entry to its extracted citation): gated 0; advisory 108, of which 0 carry a pin:
   - none
4. **Rule (00), by the branch diffs at this commit** (`git diff --name-only origin/main...<branch>`): none of `cut/bundle-redaction-scan` at 2fc01f59, `cut/walkthrough-row-f7-cli-refusal` at abc900f2, `cut/b1-shell-half-pr-a` at 35085072, `cut/b2-piece-1c-save-and-reopen` at 7109aeb2, `cut/questions-mirror-item-count` at 8e395985, `cut/covering-case-collision-binds-other-column` at b0637a7f names this piece's two files or this form. None is under `protocol/`. By the human's item 1, #245 (`cut/questions-mirror-item-count`) runs alongside.
5. **The budget** is 90 minutes, as §7 gives it; the node carries it from this commit.
6. **Next:** the code, the tests, the mutations and the I1 and I2 runs, by one worker on `cut/verify-cites-pin-resolution-and-line-zero` from this commit; then the PR and both gates.

Nothing above is edited.
