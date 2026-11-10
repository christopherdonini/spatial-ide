Reviewed: PR #276 at c614cc5c9a446106f61c6a7e9f3d178ee358f28b (base f975d609), gate 2, reviewer
Verdict: PASS

cut/adr-017-note-product-redaction-gate @ c614cc5c9a446106f61c6a7e9f3d178ee358f28b. I read the brief whole. `sha256sum` gave e42c332f364236fd292c27cd964743f25a0f26f585e3eab9e1d7554bdf232ded, which matches.

## Findings by class

**Correctness: none.**
- H to H2 changes only the ten spans of the human's seven clauses. Every byte above the note, the heading, the italic line and item 5 are unchanged (checks 1 and 5).
- §8 items 1 and 2 are clear, with item 2 read as Amendment 1 reads it.
- Clause truth against B's code is the architect's check, and I did not re-derive it. One read only: at B, renderer/bundle-viewer/redaction-reviewed.json has three rows, two for `NOTICE.txt` and one for `app.js` at offset 7291. That matches the count in 3.4's words.

**Evidence: none.** E1 to E11 all hold at H2 (checks 3 and 4).

**Documentation: none that must be fixed.** One disclosure, with nothing to fix:
- §4's E8 names `npm run verify:adr-index`. As the brief says, I ran `node scripts/adrIndex.mjs --check`.
- At B, frontends/shell/package.json line 23 maps `verify:adr-index` to exactly that command. So the two are the same check.

## Check 1: the diff H to H2, derived independently
- I wrote my own script, `a017-g2r-derive.mjs` in scratch, with no backslash in it. It reads the human's quoted words straight from lines 9 to 15 of the 2026-11-03 directive in the main checkout. It does not use the worker's brief.
- It locates each target sentence in the note at H by structure:
  - 1.1: item 1's first sentence.
  - 1.4: the quoted anchor. H's comma follows it, and the added comma takes its place, as Amendment 1 discloses. The literal reading would carry `,,`, which the script confirms.
  - 2.2: item 2's last sentence.
  - 3.2: the three backticked names given root paths.
  - 3.4: the phrase, then the new sentences inserted before item 3's last sentence.
  - 4.5 and 4.4: item 4's two sentences, the row sentence and the window sentence.
- Run: rc 0.
  - B is a byte prefix of H.
  - H after B equals a line feed plus lines 29 to 37 of the 2026-10-28 directive.
  - **My result is byte-equal to H2's ADR-017** (sha256 59bb1b2d14bc4e5166ef618eb1f58ce0bff3cafa13f5387dc35a05f8a837d115 for both).
- B is a byte prefix of H and of H2, so the bytes before the note are equal at B, H and H2.
- Sizes and line counts: B is 79144 bytes and 1159 lines, H is 81216 bytes and 1169 lines, H2 is 82690 bytes and 1169 lines.
- None of the three has a CR byte, and each ends in a line feed.
- Status lines:
  - No line of the note, at H or at H2, begins `Status:` or `**Status:**`.
  - The file's one Status line sits above the note, in B's bytes, and is unchanged.
- `git diff --numstat ab2ca383 c614cc5c`: rc 0, `4	4	docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`.
- `git diff --summary` over the same range is 0 bytes, so there is no mode change. `git rev-list --count ab2ca383..c614cc5c` gives 1 commit.

## Check 2: Amendment 1's figures, recomputed
- The directive's lines 8 to 16 at 652752afa9bedb0172948869c9ab7f0b8ee08dd3 (`git show` to a file, `sed -n '8,16p'`, `sha256sum`, each rc 0): c2176047922693051cf8c243b989a9a8f930de748c1b2cdfc80c30a0ab16073b. **This matches.** The slice ends in a line feed.
- 652752af is an ancestor of origin/main (`git merge-base --is-ancestor`, rc 0), so the pin is at a commit on main. The file is byte-identical at main (`cmp`, rc 0).
- ADR-017 at H: 06f8ba99c1ce08163e182464261917f7fe6f8540c24a98b504695518f172d732. **This matches.**
- ADR-017 at H2: 59bb1b2d14bc4e5166ef618eb1f58ce0bff3cafa13f5387dc35a05f8a837d115, 1169 lines. **This matches.**
- The note at H2, from the line feed before `## Note ` to the end: 63086ced004e234af27f16e60ddb1f92f65709e276609bf7ef2275ec35318832. **This matches.**
- E1 at H, `git diff --numstat f975d609...ab2ca383`: rc 0, `10	0`. **This matches.**

## Check 3: E1 to E10 at H2, in C:/dev/wt/a017
Each tool's commit at H2, by `git log -1`:
- 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2: verify-quotes, verify-test-claims, verify.mjs, queue.mjs and site.mjs.
- 702d172b4a38e232506800040e874889fa328026: verify-cites.
- 66107ccfb310a0bdca46c1139a185735ef0b792e: frontends/shell/scripts/adrIndex.mjs.

The checks:
- **E1:** `git diff --numstat f975d609...HEAD -- <ADR-017>`: rc 0, `10 0`. `--name-only` over the same range names that one file only. The merge base is f975d609.
- **E2, E3, E4:** check 1's script, rc 0.
  - E2: B is a byte prefix of H2.
  - E3: no CR at B or at H2, and each ends in a line feed.
  - E4: the note's sha256 is 63086ced…8832, as Amendment 1 reads E4.
- **E5:** `node scripts/plan/verify-quotes.mjs`: rc 0. It ran 17:26:07Z to 17:31:27Z.
  - Counts: 134 checked, 103 verified, 30 baselined, 1 advisory, 0 hash-reference errors (2 hash-baselined) and 909 ruling cites. These equal gate 1's 134, 103, 30 and 1.
  - Stdout and stderr are byte-identical to gate 1's H run (`cmp` rc 0 on both).
  - Two passages come from ADR-017, at :432 and :780. Both are above the note, so **no passage is extracted from the note**.
  - Disclosure: the harness moved this call to the background after 180 s. I did not choose that. I waited for it with a deadline loop (5 s sleeps, 540 s cap). It completed with exit 0.
- **E6:** `node scripts/plan/verify-cites.mjs`: rc 0, PASS over 2575 files, 82 loose references advised. No advisory names ADR-017 (count 0).
- **E7:**
  - `verify-test-claims.mjs`: rc 0, 716 claimed tests across 227 files.
  - `verify.mjs` online, in a bounded loop of at most 3 tries, 60 s apart, retrying only on a 5xx: try 1 ran 17:31:58Z to 17:33:57Z, **rc 0**, `verify:plan PASS`. Stderr was empty, there was no 5xx and no retry was needed.
- **E8:** `node scripts/adrIndex.mjs --check` in frontends/shell: rc 0, "34 ADRs, index in docs/README.md matches every Status line". `git diff --quiet f975d609 HEAD -- docs/README.md`: rc 0, so the :55 row is unchanged.
- **E9:** `queue.mjs --check`, rc 0, current. `site.mjs --check`, rc 0, current.
- **E10:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 594 tests, 594 pass, 0 fail.

## Check 4: E11, CI
- `gh pr view 276`: rc 0. The PR is open and a draft, with headRefOid c614cc5c9a446106f61c6a7e9f3d178ee358f28b.
- `gh pr checks 276`: **rc 0, all 8 checks pass.**
- Each run, by `gh run view` (all rc 0, attempt 1, headSha c614cc5c9a446106f61c6a7e9f3d178ee358f28b, completed, success; none was in progress, so no wait was needed):
  - 41678053217, Governance CI, push
  - 41678066322, Governance CI, pull_request
  - 41678066371, DCO sign-off, pull_request
  - 41678066385, Exposure scan, pull_request
  - 41678053506, Ported notices, push
  - 41678066407, Ported notices, pull_request
- The cfg boundary check passed in both Governance runs.
- Gate 1's E11 note (run 41643984072 failing on 503s) no longer applies: that run was at ab2ca383, and the head's checks are green.

## Check 5: the worker's method
- The worker's script (`a017w-apply.mjs`, in scratch) works like this:
  - It parses the ten old/new pairs from the brief's fences.
  - It requires each old string to occur exactly once in the whole file at its turn.
  - It replaces that one occurrence by slicing, with no `String.replace`, so `$` patterns cannot act.
  - It writes the file back as UTF-8.
- To compare, I wrote my own script, `a017-g2r-edits.mjs`. It applies the brief's ten fenced pairs as exact Edit calls would: whole-file uniqueness, then one exact replacement. It works on H's raw bytes, in the brief's order.
- Run: rc 0. The brief has 0 CR bytes.
  - All ten old strings are unique at their turn, and each sits inside the note: byte offsets 79368 to 81833, all at or past B's length of 79144.
  - The result's sha256 is 59bb1b2d…d115. It is **equal to H2, and equal to my independent derivation in check 1**.
- H has no BOM, since B is a prefix of it, and H2 has no CR. So the UTF-8 round trip changed nothing.
- **The bytes the worker wrote do not differ in any way from what ten exact Edits would give.** The only difference is the tool used. The custodian's filing note already discloses it.

## Background shells, processes, porcelain
- The harness moved one call to the background, b96aayc9t (the E5 batch). It completed with exit 0 before this report.
- My wait loop ran in the foreground and ended on its condition. I started no other background shell or process and killed none, so nothing of mine is still running.
- No heavy command was run, so no hold was taken.
- Writes went only to my scratch folder, in files named `a017-g2r-*`. I had no Write tool, so the two scripts were written by a quoted heredoc. Each was checked by script to contain 0 backslash bytes.
- `git -C C:/dev/wt/a017 status --porcelain`: rc 0, 0 bytes. HEAD is c614cc5c9a446106f61c6a7e9f3d178ee358f28b.
