# PR #207 gate 5 — reviewer (Amendment 6's commit)
Reviewed: cut/shell-map-refill-after-resize @ edfa187fbd7817ff493159e4ed90fdf046eaf738

**Verdict: PASS.** There is no Correctness finding and no Evidence finding. There is one Documentation finding (D1). It must be fixed before the merge, with no re-gate. A gate fails only on C or E: state/directives/2026-10-05-product-first-direction.md:15 @ 4f1d42684076b00b28f5c1ac76be6b095d9e42e6 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751.

## Findings

**D1 (Documentation, must fix before the merge).** The new `resetFitForNewGeneration` doc comment lists, arm by arm, when the reset is called. For the candidate arm it lists two times: at the start of a live reissue, and at the open's first look. It leaves out that the candidate arm also calls the reset after an issued outcome.
- In the code, `applyFilter` calls `deps.resetFitForNewGeneration()` on an issued outcome on both arms. The dep is the same on both arms: `handleApplyFilter`, which reaches `issueQueryRef` and is the candidate session's `reissueUnrestricted`.
  - frontends/shell/src/App.tsx:336-338 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:43c422729ca6446f94c05ea36f7a63b7197e9a05b65baefca72dddd056926bb0
  - frontends/shell/src/App.tsx:958-961 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:bdbba1846542e3689c19a9709ec0dbc0b1e08886665c94d028a23c6c2b1ab58f
- Gate 4's C1, first bullet, says the same: "at an issued outcome, on both arms".
- The comment is at frontends/shell/src/canvas/WorkingCanvas.tsx:133-137 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:b381478c6ecc5031a69c33f4cc5c2d7ba8bc824ed79d88e3ef8326ec1db9ccd6.
- Every clause it states holds (see Check 4). It claims no more than the code does, so this is not C.
- Read as a full list, though, it understates the candidate arm by one call site.
- Amendment 6 item 4 states the candidate arm with the same omission, so it is the source of this gap. The worker followed it as written (frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:559-561 @ 4f1d42684076b00b28f5c1ac76be6b095d9e42e6 sha256:1a21c691224cda13d8743e97583c77a5a5365e023a14acf06725616a17a6ddaf).
- I propose no words.

## Checks

**1. The commit.** `git fetch origin` rc=0. HEAD and `origin/cut/shell-map-refill-after-resize` are both edfa187fbd7817ff493159e4ed90fdf046eaf738. The starting `git status --porcelain` was empty. `git rev-list --count 66cc80de..edfa187f` is 1, and the parent is 66cc80de5bdc711bb448deac212d373835356519. `git diff --numstat 66cc80de… edfa187f…` rc=0:
```
1	1	KNOWN-LIMITATIONS.md
5	4	frontends/shell/src/canvas/WorkingCanvas.tsx
```
Only the two allowed files are touched. Holds.

**2. `KNOWN-LIMITATIONS.md`.** A node script compared the file at 66cc80de with the file at edfa187f (369 elements after split, the same in each).
- Lines that differ: `[368]` only.
- It took the directive's line 9 at c48601ab18d6d4bc3763c53e0c820e7f37a9b851, which is on main (merge-base rc=0), and checked that the line starts with exactly three spaces. It stripped them.
- It found `the candidate residency arm. Authority:` exactly once in the old line, and inserted `' ' + sentence` after `the candidate residency arm.`.
- Result: `rebuilt===new line 368: true`.
- Positive control: dropping the sentence's final period gives `false`.
- The script exited rc=0.

Pins:
- Directive line: state/directives/2026-10-11-merge-205-ruling-207-c-crs-form-open-items.md:9 @ c48601ab18d6d4bc3763c53e0c820e7f37a9b851 sha256:76cf51df5e91f0cadb72cc294201b1b86a8cd4f1e03c9d1abefd2d928bfb391b. This matches Amendment 6 item 3's hash.
- Old line 368 plus LF: KNOWN-LIMITATIONS.md:368 @ 66cc80de5bdc711bb448deac212d373835356519 sha256:112ef95a9523becdb6b71c1e1aa632918c2f9afb14e9fe834e612dc66857769b
- New line 368 plus LF: KNOWN-LIMITATIONS.md:368 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:cf1cd56d5c8b1fc944b5ac3f6ccd0c193099245dd71263da134529bc33594632
- Both hashes agree between node crypto and `sed -n 368p | sha256sum`, and with worker report 10.

**3. `WorkingCanvas.tsx`, comment-only.** A node script ran two independent strips on both revisions and compared what was left:
- (a) the TypeScript parser on the worktree's `node_modules/typescript`, as TSX with zero parse diagnostics, printed with `removeComments: true`;
- (b) a hand stripper that removes `//` and `/* */` comments and is aware of strings and template literals.

I dropped a raw-scanner variant that I tried first. Without parser context it mis-tokenised the file, so it was not usable.

66cc80de → edfa187f:
- real: `raw equal: false | AST-printed (comments removed) equal: true | hand-stripped equal: true`, rc=0
- positive control, code token `WorkingCanvas`→`WorkingCanvaz` in `const WorkingCanvas = forwardRef`: both `false`, rc=1 (detected)
- negative control, `auto-fit`→`auto-fix` inside a comment: both `true`, rc=0

Holds: every changed line is inside a comment.

**4. Gate 4's D1 and D2 at the head.** The two files below are unchanged in the commit (`git diff --quiet 66cc80de edfa187f -- candidateArmSession.ts App.tsx`, rc=0).
- "at the start of a reissue begun while the session is live (`reissueUnrestricted`…)": the reset is at frontends/shell/src/residency/candidateArmSession.ts:1658 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:afd8c4c71c8ab144d9f80d65acda489a7a63c5108d49a7b60bd664742eda80eb. It runs before `issueUntiledQuery` (`:1698`), so "start" holds. The refusal recovery's reissue goes through the same function. Holds.
- "an Apply after the session has ended runs none, because that function returns before the reset": `if (sessionEnded) return { kind: "session-ended" };` is at frontends/shell/src/residency/candidateArmSession.ts:1642 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:66c8099d098a12f5fac187069ab0d753259e8ee19601d3f41df45494ae8a21a0. `session-ended` is not `issued`, so `App.tsx:336-338` does not reset either. Holds.
- "at the open's first look (`App.tsx`)": `session.reissueUnrestricted(null, activeFilterRef.current)` is at frontends/shell/src/App.tsx:1437 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:586b4842a3325b2c19e2d7cd609a8c03be34b2c68f7c172eb5b30cab8edd2cd6. Holds.
- "on the baseline arm, after an issued outcome (`applyFilter`)": `App.tsx:336-338` (pinned under D1). The only product callers of the canvas reset are `App.tsx:960`, `:1428` and `:1590`, all `applyFilter` deps, plus `candidateArmSession.ts:1658`. Holds.
- The `lastQueriedRef` comment now defers to that method's doc comment, so it states no timing of its own. Holds. Pin: frontends/shell/src/canvas/WorkingCanvas.tsx:1020-1021 @ edfa187fbd7817ff493159e4ed90fdf046eaf738 sha256:58c5ca05fd7b60eaa2600b02539c72085cb5ca493a4c6de481ed43da3aa64dea.
- Gate 4's D1 (gates/2026-10-11-shell-map-refill-after-resize-gate4-architect.md:68-70 @ 4f1d42684076b00b28f5c1ac76be6b095d9e42e6 sha256:4359f0b2df9556c1f83a8c2185724c8949a477a1a47a5d5b4c0e6150f25cf9b6) is closed. The baseline timing is corrected and the first-look caller is named.
- Gate 4's D2 is closed: the session-ended Apply is now excluded.
- No unsupported claim, so no C. The residual omission is this report's D1.

**5. Gate 4's Evidence note** (state/consults/gates/2026-10-11-shell-map-refill-after-resize-gate4-architect.md:64 @ 4f1d42684076b00b28f5c1ac76be6b095d9e42e6 sha256:8e0d02a2d9a68e1dfd79fb4a781271681233216120b05935011b301599a85aa4).
- 58967ff4 resolves to 58967ff4d0a7191ef33142cf2cf73ac7f8eb1480. `git log 58967ff4..66cc80de` shows one commit.
- `git diff --numstat 58967ff4 66cc80de` rc=0:
```
2	2	KNOWN-LIMITATIONS.md
4	3	frontends/shell/src/canvas/WorkingCanvas.tsx
```
- Same strip-and-compare as Check 3, 58967ff4 → 66cc80de:
  - real: AST-printed equal `true`, hand-stripped equal `true`, rc=0
  - code-token control: both `false`, rc=1
  - comment control: both `true`, rc=0
  - So `WorkingCanvas.tsx` changed only in comments.
- `git diff -U0 58967ff4 66cc80de -- KNOWN-LIMITATIONS.md` rc=0 has a single hunk, `@@ -367,2 +367,2 @@`: line 367 (item 39, `39. **Retired by shell-map-refill-after-resize.**…`) and line 368 (its `<!-- Retired by … -->` comment). Nothing else changed. Pin: KNOWN-LIMITATIONS.md:367-368 @ 66cc80de5bdc711bb448deac212d373835356519 sha256:eb2c34250cd3ee6b4edda4e817c63e547c84a77f2fa07d24e3f60dd46cea70a3.
- Gate 4's Evidence note is discharged.

**6. Governance at the head** (run in the worktree at edfa187f):
- `node scripts/plan/verify-cites.mjs` rc=0: PASS, 1685 files, 49 loose references advised.
- `node scripts/plan/verify-quotes.mjs` rc=0: PASS, 121 checked, 90 verified, 30 baselined, 1 advisory, 0 hash-reference errors.
- `node scripts/plan/verify-test-claims.mjs` rc=0: PASS, 534 claimed tests.
- `node scripts/plan/verify.mjs` rc=0: `verify:plan` PASS.

**7. CI.** `gh pr checks 207` rc=0. The PR's headRefOid is edfa187f…, and each run's `headSha` is edfa187fbd7817ff493159e4ed90fdf046eaf738 (`gh run view`). Nothing was pending.
- every commit is signed off: pass (DCO sign-off)
- no profile path in the range: pass (Exposure scan)
- tauri build (NSIS, build-only, no signing): pass (two runs)
- typecheck · build · vitest · cargo test: pass (two runs)

**8. Low profile.** The commit body is one subject line plus the `Co-Authored-By` and `Signed-off-by` trailers. A grep for `https?://|www\.|@name|#N` over the message (rc=0) matches only the two trailer lines, on their email addresses. There is no outside reference, link or @mention outside the trailers. Holds.

Final `git status --porcelain` in C:/dev/wt/refill: empty (rc=0). HEAD is edfa187fbd7817ff493159e4ed90fdf046eaf738. I made no commits, no pushes and no edits to tracked files.

Files: C:/dev/wt/refill/frontends/shell/src/canvas/WorkingCanvas.tsx, C:/dev/wt/refill/KNOWN-LIMITATIONS.md, C:/dev/wt/refill/frontends/shell/src/App.tsx, C:/dev/wt/refill/frontends/shell/src/residency/candidateArmSession.ts, C:/dev/spatial-ide/frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/gates/2026-10-11-shell-map-refill-after-resize-gate4-architect.md
