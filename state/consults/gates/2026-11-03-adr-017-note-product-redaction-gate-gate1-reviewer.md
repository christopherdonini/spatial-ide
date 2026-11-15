Reviewed: PR #276 at ab2ca383389d18a4e2bd3209bd3500de4ae34cba (base f975d609), gate 1, reviewer
Verdict: PASS WITH NOTES

cut/adr-017-note-product-redaction-gate @ ab2ca383389d18a4e2bd3209bd3500de4ae34cba. The merge stays held under §8 item 3 until the human's typed answer on OPEN-1 for each of the seven clauses is recorded as a class 5 amendment. My checks raise nothing beyond that.

## Findings

**Correctness: none from this gate.**
- No clause outside §2.2's seven reads untrue to me at H, so §5's invalidator is not met.
- Code at H is code at C. `git diff --name-only ca8e44f1 ab2ca383` touches only ADR-017, governance/, site/ and state/ files, so every code span at ca8e44f1 has the same line numbers at H.
- The seven clauses below are the human's under OPEN-1. I give no replacement words.

**The seven clauses (OPEN-1, held for the human). My reading at H agrees with each span:**
- **1.1: agree.**
  - kernel/src/publish/viewer_assets.rs:160-172: `is_built_asset` skips a recorded viewer file.
  - renderer/bundle-viewer/scripts/scan-dist.rs:20: the build's scan uses `redaction::MachineIdentifiers::default()`.
  - renderer/bundle-viewer/redaction-reviewed.json:4-5: the NOTICE.txt `credential` and `local-filesystem-path` rows.
  - One addition for the human, same file, line 6: a third reviewed row, `{ "file": "app.js", "class": "local-filesystem-path", "offset": 7291 }`. The draft's span names only the two NOTICE.txt rows. This makes 1.1 more untrue, not less. It goes to the human with 1.1; I suggest no words.
- **1.4: agree.** At kernel/src/bundle/redaction.rs:405-407, `if skip(&rel, &bytes) { continue; }` passes a file over after it is read. Item 1, read alone, says every staged file is scanned.
- **2.2: agree.**
  - kernel/src/permission/boundary.rs:244 gives `error_kind` `StagingNotRemoved`.
  - :284 takes the outcome from the inner error: `PublishError::StagingNotRemoved { after, .. } => publish_outcome(after),`.
  - kernel/src/publish/error.rs:287 gives the code `publish.staging_not_removed`.
  - kernel/src/publish/mod.rs:642-657 is where ordinary use reaches it.
- **3.2: agree.** `git ls-files` has no root `scripts/scan-dist.mjs` (a `test -e` for it exits 1). The tracked file is `renderer/bundle-viewer/scripts/scan-dist.mjs`.
- **3.4: agree.**
  - scan-dist.rs:20 scans with default identities and no declared strings.
  - mod.rs:946-952 uses `MachineIdentifiers::from_environment()` plus the two declared strings.
- **4.4: agree.** Two stretches have no `watch.check()` inside them:
  - From mod.rs:910 (the `Finalizing` check) through :915 (heuristic re-check), :920 (`total_bytes`), :931-934 (the build-info write) and redaction.rs:387 (the root `read_dir`), up to the first per-file check at redaction.rs:398.
  - After the last file's check: its read and scan, then mod.rs:973 (`total_bytes`) and :974 (`finalize`).
  - The accepted sentence at ADR-017:1089-1090 joins its terms with "and".
- **4.5: agree.** mod.rs:942-944, the site's own comment, bounds the window "in bytes only by that file's own size". No declared byte ceiling exists for one file's read and scan.

**Evidence: one note, non-blocking (E11).**
- What is wrong: `gh pr checks 276` exits 1. It still lists the push-event Governance CI run 41643984072 (head ab2ca383, failure). That run's only failures are `gh api .../pulls/N` calls answered HTTP 503: 13 nodes reported "PR #N is not merged". In the same run, verify:quotes passed.
- Why it does not block: the pull_request-event run of the same workflow, 41645331941, at the same head ab2ca383, passed. So did my own online `verify.mjs` (E7).
- Fix: re-run the failed job of run 41643984072 before the merge so the PR's checks read green. That is a PR action, the custodian's.

**Documentation: none that must be fixed.** Three disclosures, all with the record already correct:
- **Pins F1 and C116** (governance/PLAN.yaml:6030-6046 and :6045 @ ca8e44f1) do not match the tree at main 811a2f5c or 6dff90e9, as the settlement states. The diff from C to H is the custodian's `gate`, `budget_minutes` and `summary` lines of the node. Named as the round-14 addition requires: the pin is authoritative for what the form drafted against, and the tree is current for the node's fields. No fix.
- **The form's §2.2 line** says the pins are "expanded by script". The settlement explains they are bound by the pin table instead. No fix.
- **The worker report's E7** (rc 1 twice, on 502/503 answers) is overtaken by my run below, which exited 0.

## Check 1: the diff
- `git diff f975d609...ab2ca383`: rc 0. One hunk at @@ -1157,3 +1157,13 @@.
- `node a017-g1r-check1.mjs` in the worktree (my script, in scratch): rc 0, CHECK1 PASS. What it found:
  - Files B...H: only `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`.
  - numstat `10 0`, against §7 P1 (at most 10 and 0).
  - The merge base is B; there is one commit, H.
  - The worktree file equals H's blob (81216 B).
  - B (79144 B) is a byte prefix of H. Neither has a CR byte. Both end in LF. B has 1159 lines, H 1169, so 10 lines are appended.
  - The 2072 appended bytes equal LF plus the directive's lines 29-37 at B, each with its LF (sha256 02cd00cd29c9250671a904b9938014c12f7c74d484ed2c8e26a6b728de3ee736).
  - The directive's :29-37 have sha256 baa3f04685818538da5d407dc5e3db09f0d3d73c614b601eab5e8a85b9dc7611, equal at B, ca8e44f1 and 6dff90e9.
  - ADR-017 at ca8e44f1 and at 6dff90e9 equals B.
  - No appended line begins `Status:` or `**Status:**`. The only Status line, line 3, is the same at B and H.
  - The appended text has no `sha256:`, no `<!--` and no `@ <hex>`, so no rewrap, pin or comment was added.

## Check 2: every pin
- `node a017-g1r-check2.mjs 6dff90e9` in the main checkout: rc 0, CHECK2 PASS.
  - It found 142 `path:line @ <commit> sha256:<hex>` pins: 142 table rows (F1-F20, C1-C120, O1-O2, in order) and 0 in the text outside the table.
  - Each is recomputed from the row's own full path at ca8e44f14d08752849c4da6222c7579eae07e4f1, over the lines with their LFs: **142 checked, 0 fail**.
  - ca8e44f1 is an ancestor of origin/main, so no pin is at a branch commit.
  - Correspondence: the line tokens in the form's text equal the rows' ranges, in order, in each region (F 20/20, C 120/120, O 2/2).
  - Drift against later trees: only F1 and C116 (see the Documentation disclosures).
- The form's other hashes, by `a017-g1r-check2c.mjs`: rc 0, CHECK2B PASS.
  - The draft from line 5 to the end: e086a4dac51f...
  - The worker report from line 5 to the end: d15b8092ae8a...
  - Form lines 49-108 are byte-identical to draft lines 13-72 (2a3ab5ef2b95...).
  - Form lines 192-222 are byte-identical to draft lines 231-261 (2e93200c02c8...).
  - Form lines 1-47 and 110-188 equal the draft's section 4 (its lines 101-226) line for line.
  - The draft's hand-back hash, with the one disclosed de-root reversed, is 0b0d8686f237..., as its filing note says.
  - My first version of check2b exited 1. The cause was an off-by-one in my own slice (it included the blank form line 189). The corrected script above passed.
- The form is the same at B and at main 6dff90e9 (`git diff --quiet`, rc 0).

## Check 3: E1 to E10 at H, in C:/dev/wt/a017
Tools are as of H. Each tool's last commit: verify-quotes, verify-test-claims, verify.mjs, queue.mjs and site.mjs 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2; verify-cites 702d172b4a38e232506800040e874889fa328026; adrIndex.mjs 66107ccfb310a0bdca46c1139a185735ef0b792e.
- **E1:** `git diff --numstat B...H -- <ADR-017>`: rc 0, `10 0`.
- **E2, E3, E4:** check 1, rc 0.
- **E5:** `node scripts/plan/verify-quotes.mjs`.
  - At H: rc 0, with 134 checked, 103 verified, 30 baselined, 1 advisory, 0 hash-reference errors (2 hash-baselined) and 909 ruling cites.
  - The B side was run in the main checkout. Its ADR-017, scripts/ and the form equal 6dff90e9's, and that ADR-017 equals B's byte for byte. Result: rc 0 with the same counts. Its stderr is byte-identical to H's (`cmp` rc 0).
  - Scoped to ADR-017 alone, both sides: rc 0, 2 checked and 2 baselined, and the outputs are identical. The two passages are at ADR-017:432 and :780, both earlier text. **No passage is extracted from the note** (lines 1160-1169).
  - `--show-cites`, both rc 0: H lists 9099 cites and the main checkout 9101. No line of the difference names ADR-017.
  - Disclosure: while these runs were going, main moved to 13048d45 at 14:12:45Z (the custodian's gate filings: governance/, site/, state/ only), and the main checkout was carrying staged edits not made by me. ADR-017, scripts/ and the form were unchanged throughout. I do not attribute the 2-cite difference further.
- **E6:** `node scripts/plan/verify-cites.mjs`: rc 0, PASS over 2575 files. No advisory names ADR-017.
- **E7:**
  - `verify-test-claims.mjs`: rc 0, 716 claimed tests.
  - `verify.mjs`, online, in a bounded loop (at most 3 tries, 60 s apart): try 1 ran 14:00:10Z to 14:02:34Z, **rc 0**, `verify:plan PASS`. No retry was needed and there were no failing calls.
- **E8:** `npm run verify:adr-index` in frontends/shell, which runs `node scripts/adrIndex.mjs --check`: rc 0, "34 ADRs, index in docs/README.md matches every Status line". docs/README.md is unchanged from B to H and from C to H (`git diff --quiet` rc 0 both), so the :55 row is unchanged.
- **E9:** `queue.mjs --check` rc 0 (current); `site.mjs --check` rc 0 (current).
- **E10:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 594 tests, 594 pass, 0 fail.
- §5 invalidator "any in-flight piece edits ADR-017": `gh pr list --state open` (rc 0) shows only #276 touching it (#277, #275 and #271 do not).

## Check 4: E11, CI
- `gh pr checks 276`: rc 1. The PR is a draft and its headRefOid is ab2ca383.
- Each run's head sha, from `gh run view` (all rc 0, attempt 1, all at head ab2ca383; none in progress, so no wait was needed):
  - 41643984072, Governance CI, push: **failure**. HTTP 503 only (see the Evidence note).
  - 41645331941, Governance CI, pull_request: success.
  - 41643983920, Ported notices, push: success.
  - 41645331618, Ported notices, pull_request: success.
  - 41645331336, DCO sign-off, pull_request: success.
  - 41645331321, Exposure scan, pull_request: success.
  - cfg boundary passed in both workflows' listings.

## Background shells, processes and porcelain
- The harness moved two of my calls to the background after 180 s: bdufpxgdm (the E1/E5 batch) and brnlige8x (a 540 s wait loop with a sleep and a deadline). Both completed (exit 0) before this report. I started no other process and killed none. No shell or process of mine is still running.
- No heavy command was run, so no hold was taken.
- Writes: only my scratch folder, files named a017-g1r-*. No Write tool was available, so the scripts were written by a quoted heredoc and contain no backslash.
- `git -C C:/dev/wt/a017 status --porcelain`: rc 0, 0 bytes, HEAD ab2ca383389d18a4e2bd3209bd3500de4ae34cba.
