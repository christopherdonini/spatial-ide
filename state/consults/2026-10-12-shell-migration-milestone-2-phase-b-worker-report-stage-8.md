*Custodian's filing note (2026-10-12): the worker's report on milestone 2's phase B, stage 8 of 8 (the walkthrough's Part W, KNOWN-LIMITATIONS items 36, 38, 40 and 41 as drafts, the e2e README), branch cut/shell-migration-milestone-2-phase-b, at cdc8a423d4793eafc17c2c0f8985abc63876326d, the run 2026-10-12T09:04:07Z to 2026-10-12T09:16:55Z by its transcript (Bash 52, Write 1); its one SubagentHandback call, at 09:16:54Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is 81bcd03a93c683bdc4e93c57f00ea1b3b6a8a04ff2b2ba3ed6a429c174ed76e5; this file's, from line 5 to the end, is 81bcd03a93c683bdc4e93c57f00ea1b3b6a8a04ff2b2ba3ed6a429c174ed76e5.*

---

Stage 8 of 8 (the last of phase B) is built and pushed. Head is cdc8a423d4793eafc17c2c0f8985abc63876326d, one `docs:` commit (signed off, trailer included) on top of 2f18ad39, which was the confirmed start head with an empty porcelain. Plain `git push`; no PR, no merge, rebase or force-push. Model observed: Sonnet 5.5, no override, no handoff. No e2e run was needed from me. I did not touch `state/`, PLAN.yaml, the form, `e2e/selection.mjs`, `WorkingCanvas.wiring.test.tsx`, `StudioLayout.test.tsx` or a double-click.

**layout.mjs decision: not edited.** The form's §7 line G-E allows up to 20 lines for the Inspector's third tab only, but requires no assertion for it. layout.mjs has no tab-count or tab-id assertion beyond `#inspector-tab-layer`, and it passed unedited at e4940dbe and f60329ef with the Feature tab present.

**Changes by file**
1. **`frontends/shell/MANUAL-WALKTHROUGH.md`, +41 lines.** New Part W at the tail, after Part X, with a blank result log. It has rows W0 to W11 and W8a.
   - Step texts follow §2.8's V0 to V11 renumbered per Amendment 2 item 10, plus Amendment 1 B4 on W3 and the Select-cursor ask on W2 (Amendment 1 A4).
   - W8a has three steps: Keep exporting, then Cancel and go on, then the Amendment 7 item 6 steps (let the export finish while the ask stands, choose Cancel, read the statement, open the folder). Its two Felt questions are Amendment 1 B3's and Amendment 7 item 6's, verbatim in sense.
   - Marked as a draft for the human's sight, in the Part's own note: the Expected-outcome cells and the sentences around the table. The Step wording is the form's. W11 states that the two late-cancel strings are approved wording (Amendment 8 item 1) and are re-read at the sitting.
2. **`KNOWN-LIMITATIONS.md` (repo root), +14 / -2 lines.**
   - Items 36 and 38: heading changed to "hover or click" and one sentence each added. The existing source comments are untouched; each gets a new DRAFT comment line.
   - New items 40 (a selection ends on reopen or source change, and is never saved) and 41 (the in-view-not-drawn count carries no reason).
   - All four additions are drafts pending the human's approval (item 2e). None is the human's wording, and no approval is invented. Item 42 is not touched.
3. **`frontends/shell/e2e/README.md`, +16 lines.** A "Selection spec" entry: the fixtures, every asserted step including E-ASK and E-ASK-STATEMENT, EXPORT-TODAY as recorded-not-asserted, and what the suite does not prove. Whole entry marked as a draft.

**Pins**
- Pins at B = c96e5329351fcc9ee40b1df71d379ddd953f15c8 (on main) are `pickResolution.ts:119-137` (averagePointSpacing, items 36) and `pickResolution.ts:90-117` (averageFeatureExtent, item 38). Each was hashed by a shell function: `git show B:path | sed -n a,bp | sha256sum` (whole lines, LF). verify-quotes `--show-cites` listed both as hash PASS.
- Spans that exist only on the unmerged branch are named in words, "lines a-b of path at 2f18ad39", with no hash, and each says its pin follows on main after the merge. They are `clickPick.ts` 40-48, `WorkingCanvas.tsx` 1236-1244, `workspaceState.ts` 140-141 and 149-158, `viewTransitions.ts` 156-165, `FeatureTab.tsx` 68-76 and `selection.ts` 119-157. I checked each span's first and last line against the file.

**Commands (exit codes)**
- `npm run verify` inside a shared hold: rc 0, 93 files and 1330 tests passed, citation-integrity 30 passed.
- `verify-cites.mjs`: rc 0 (1816 files, 38 loose advisories).
- `verify-quotes.mjs`: rc 0 (121 checked, 90 verified, 30 baselined).
- `verify-quotes.mjs --show-cites` on the three documents: rc 1. The FAIL lines it prints are the 30 baselined old walkthrough quotes (the same 30 the plain run baselines). None is in Part W or my edits.
- `verify-test-claims.mjs`: rc 0 (545 claimed).
- `verify.mjs`: rc 0.
- `node --test scripts/plan, hooks, evidence`: rc 0. My summary grep matched nothing, so I have no pass count.

**§7**
- MANUAL-WALKTHROUGH.md: +41 against 140, plus Amendment 1's 160 and Amendment 7's 15 more. Within every line.
- KNOWN-LIMITATIONS.md: 16 changed lines against ≤ 30.
- e2e/README.md: +16 against ≤ 30.
- layout.mjs: 0 of 20.
- §7's own command from B counts 5,596. This commit adds 0 to it, because all three files are outside `frontends/shell` or excluded by that command's pathspec.
- §7 was not edited.

**Not done as written or notes**
- Source-comment pins for four items use the words form for branch-only spans, per round 25 item 2. The pins follow after the merge.
- I added no pin for `ToolSwitch.tsx` or `OpenDuringExportAsk.tsx`. Walkthrough strings are read from them, but the walkthrough carries no cites.
- I removed an unverified "run on a fresh launch" paragraph from the README rather than assert it.
- Off-scope: OPEN-13 (the wiring test) and OPEN-14 (double-click) remain with the human.

**For the custodian at head cdc8a423**
- Re-run `e2e:selection` and `e2e:layout` if wanted; this commit changes no code.
- Check the Part W and items 40 and 41 wording in the gates.
- Before this branch merges, item 42's PR must merge main in (disjoint by number).

Final porcelain: empty. The branch is pushed and equals origin.
