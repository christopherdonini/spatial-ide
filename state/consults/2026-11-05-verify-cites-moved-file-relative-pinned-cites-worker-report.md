*Custodian's filing note (2026-11-05): the worker's report for verify-cites-moved-file-relative-pinned-cites (the form `governance/forms/scripts/VERIFY-CITES-MOVED-FILE-RELATIVE-PINNED-CITES-PREREGISTRATION.md`), built at be4e3d46d97055a0274fa8a88747a0e36352190f on its branch. The run 16:14:51.880Z to 16:40:50.643Z by its transcript (claude-sonnet-5-5; unique calls Bash 35, Read 2, Write 3 and the hand-back), its full suite run at the head backed by calls in that transcript. Extracted by script from the hand-back message in that transcript (6459 bytes, sha256 f675696f90378e02dfc50ebc14cb4429480948a3af4af162e6c9f085ea0619da), unchanged. Under Part 1 item 4 of the human's rulings of 2026-11-05 the custodian read it before the gate: its three disclosures name no unfixed sibling and no gap in the change, so none went back to the worker; they are in the review packet for the gate. A report, not Authority.*

---

Built: verify-cites-moved-file-relative-pinned-cites at be4e3d46d97055a0274fa8a88747a0e36352190f (pushed; origin's branch equals HEAD; `git status --porcelain` empty). Brief sha256 matched f096316d.

Commits (each with a `-s` sign-off, no `@` in the message file outside the first trailer line):
- 6f29ce6062b72cef23782d87ccbae207d967187f "fix: verify-cites-moved-file-relative-pinned-cites, a moved file's relative pinned cites keep the exact tier". It holds the change, T-A, T-B and the D1/D2 words.
- be4e3d46d97055a0274fa8a88747a0e36352190f "docs: verify-cites-moved-file-relative-pinned-cites, the two recorded mutations". It holds the two RECORDED MUTATION comment lines.

Helper (scripts/plan/verify-cites.mjs:406-410, unexported) and its two call sites at 447 and 462:
```
function pinnedRefs(pathRaw, citingRel, index, map) {
  const here = resolveRef(pathRaw, citingRel, index);
  const before = resolveRef(pathRaw, originPath(map, citingRel), index);
  return [[...new Set([...before.exact, ...here.exact])], [...new Set([...before.all, ...here.all])]];
}
447: const res = cite.pin ? checkResolved(cite, ...pinnedRefs(cite.pathRaw, relPath, index, map), root) : checkCitation(cite, index, root, map);
462: const [rx, ra] = pinnedRefs(cite.pathRaw, relPath, index, map);
```
A pinned cite's own path still goes through `resolveRef` only: no `resolveMoved` and no post-move check. `checkCitation` is called only for unpinned cites, with the same arguments as before. The three comments are reworded: header MOVE MAP lines 35-38, the pin note at 85-90, and the comment at the call site.

Seam read: the helper calls `originPath` at scripts/plan/movedMap.mjs:77-85 and `resolveRef` and `checkResolved` in the same file. Caller grep: `pinnedRefs` has two callers, both in `runVerifyCites`. No new export or dependency.

T-A (scripts/plan/verify-cites.test.mjs):
- It reads the three forms with `git show 8e90c244…` from `REPO_ROOT` and takes the pinned cites with the product's `extractCitations`.
- It asserts the counts [39, 1, 1] before building a fixture of the forms at their old paths plus empty targets, then a moves-only commit with the map (`git mv`, `addCommit`).
- It asserts 41 gated and no advisory. Each gated entry is checked by relPath, citeLine, target and the reason `pinned commit <pin> not found`.

T-B:
- Same shape. It asserts the counts [7, 2], then 9 gated and no advisory, checked the same way.

T-A at the base (before the change landed, `verify-cites.mjs` sha256 4e4f7757…): the counts assertions passed, then `0 !== 41`. The result was 0 gated and 41 advisory. T-B passed at the base.

M1 (the helper resolves from the current folder only), applied to 6f29ce6062b72cef23782d87ccbae207d967187f:
```
✖ verify-cites: a moved form's relative pinned cites resolve from its pre-move folder at the exact tier (3306.7991ms)
ℹ pass 55
ℹ fail 1
```
M2 (the pre-move folder only), applied to the same commit:
```
✖ verify-cites: a pinned cite from a moved file to a file moved beside it stays at the exact tier (1410.3166ms)
ℹ pass 55
ℹ fail 1
```
M2's failure was "0 !== 9" with the advisory list filled. After each mutation I reverted the file; its sha256 was f4e729576cc37ec0400ca07f213df455faf1313b880f09602332956fe8424181, equal to commit 6f29ce6's.

D1, D2(a) and D2(b) were byte-copied by script from the form's lines 111, 123 and 131-133:
- D1 is governance/README.md:30.
- D2(a) is scripts/plan/README.md:57, now "`governance/PLAN.yaml`, a path read from the working directory, so run it from the repo root)."
- D2(b) is scripts/hooks/README.md:164-166 (three lines).

Checks at the head, with exit codes:
- CI's own `node --test` line: rc 0, tests 598, pass 598, fail 0. At 6f29ce6 it was the same 598/598, and at the base verify-cites ran 54 tests plus the 2 new ones.
- `verify-cites.mjs` at the head: rc 0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2635 file(s) resolves. (131 loose reference(s) advised above.)"
- `verify-cites.mjs` at the base 4009a97e: rc 0, the same line. The 131 advisory lines are identical (diff rc 0, 0 lines). Gated 0 and scanned 2635 on both sides.
- `verify-quotes.mjs`: rc 0, "verify:quotes PASS — 135 checked, 104 verified, 30 baselined, 1 advisory, … 910 ruling cites resolved, 0 ruling-cite errors." My first run hit my own 280 s `timeout` (rc 124) and was not a failure; the rerun with a 590 s limit passed.
- `verify-test-claims.mjs`: rc 0, "PASS — all 729 claimed test(s) across 230 file(s)…"
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- Size by `git diff --numstat origin/main...HEAD`: 105 changed lines against the Scope's 130. The rows are 1/1 governance/README.md, 3/2 scripts/hooks/README.md, 1/1 scripts/plan/README.md, 17/6 verify-cites.mjs and 73/0 verify-cites.test.mjs.

Pre-gate self-check:
1. Cross-module code uses the interface the other side actually exposes: yes, `originPath` as read at movedMap.mjs:77-85. T-A and T-B start from the real forms and real `runVerifyCites`.
2. Every completion claim points to evidence that exists and proves the claim: the logs are `vcmf-*.log` in my scratch folder.
3. Every user-facing message describes behaviour implemented here: there are no new messages.
4. Every required test reaches its assertion, not only its setup: T-A got through its counts and failed at `0 !== 41`, the gated-count assertion, at the base; M1 and M2 failed in the assertions.

Stop rules: none met. No file outside the Scope's five was touched. No existing test changed; the only edits to existing lines are two import lines in the test file (`REPO_ROOT` and the `addCommit` import). `resolveRef`, `resolveRefMapped`, `checkPinned`, the unpinned path, `movedMap.mjs` and `moved-map.mjs` are unchanged.

Disclosures:
- The test writes each cite into the fixture as its raw token plus ` @ <pin>`, one per line, not as the whole original line. The fixture cites are written "as written" only to that extent.
- In T-B the cite at lines 9 and 11 of OWED-ROWS exceeds a 2-line self file, and the AI_DEVELOPMENT target holds "x\n" so the rename stays exact (R100).
- I ran the base scan by detaching the worktree to 4009a97e and back, then confirmed the branch HEAD.
- No background shell of mine is left running. The wait-loop and verify-quotes background tasks all finished; no process was killed.

Model: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff. No token figures at hand.
