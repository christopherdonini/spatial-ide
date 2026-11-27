# Shell-scale-display's U4 correction, the worker's report

*Filed by the custodian, 2026-11-27. The one correction commit of ADV-2026-11-27-25 (the form's Amendment 13), made in D:/wt/scale from 9f8b67cdab999426691b53fa452a9526833cf909 to 8c1e68d3bc928346c8f1fe21415aec3d96fc82af. A sonnet worker made it, with no app, dev server or e2e suite started. Its run, from its completion notice only (ADV-2026-11-26-02), was 20 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (3334 bytes, sha256 e6c73b00db611ec57a112c69b7ba09542ac3cf1162201738ec2de44ec1f2ebed), byte for byte. Its account is the worker's.*

---

8c1e68d3bc928346c8f1fe21415aec3d96fc82af is the pushed head (origin/cut/shell-scale-display). Every step completed; no PR opened. The worktree is clean (git status --porcelain prints nothing).

Commit: 8c1e68d3bc928346c8f1fe21415aec3d96fc82af, "fix: shell-scale-display's layout files take the unit and the box by structural types, so U4 holds (ADV-2026-11-27-25)". It was made with -s, no email, and carries the Co-Authored-By trailer.

Types chosen:
- `scaleReading(unit: string, zoom)` in scaleBar.ts. It still returns `not-metre` for every value but "metre".
- `ScaleItem`'s `unit: string` and `getBox: () => object | null`. I picked `object | null`. `AuthoritativeBbox` is an interface (viewportBbox.ts:5), so App's `viewBox.get` is assignable with no cast. The item only compares the value with `null`.

Doc sentences, byte-copied from the commit (verbatim):
- scaleBar.ts: ` * `unit` is a plain `string` (a `CrsUnit` is assignable to it) so that no file under `layout/` imports from `skp/` (layoutBoundary.test.ts U4).`
- regionParts.tsx: ` * `unit` is a `string` and `getBox` returns `object | null`, which the item only compares with `null`, so that no file under `layout/` imports from `skp/` or `canvas/` (layoutBoundary.test.ts U4).`

Checks at 8c1e68d3:
1. In frontends/shell, inside one shared hold: `npm run typecheck && npm test` exited 0. Vitest: "Test Files 134 passed (134)", "Tests 1688 passed (1688)". U4 is included in that run. The log is D:/wt/scale-logs/fix-shell.log.
2. At the worktree root, inside one shared hold: `node --test` on scripts/plan, scripts/hooks and scripts/evidence exited 0 with tests 623, pass 623, fail 0 (D:/wt/scale-logs/fix-node.log).
3. The four verify scripts:
   - verify-cites: rc 0, PASS, 3747 files, 221 loose references advised.
   - verify-quotes: rc 0, PASS, 159 checked, 128 verified, 0 hash-reference errors, 0 ruling-cite errors.
   - verify-test-claims: rc 0, PASS, 901 claimed tests across 293 files.
   - verify-mutation (--base 530d7b0e --head HEAD): rc 0, PASS, "all 5 new test(s) have a recorded mutation naming them".
4. §7 count, by the form's command over 530d7b0e...HEAD:
   - Insertions 487, deletions 4, total 491 of 760 (unchanged from Amendment 11's 491).
   - 10 files of at most 10.
   - Each file against its ceiling: layout.mjs 84/150; App.scale.test.tsx 184/240; App.tsx 7/20; WorkingCanvas.tsx 2/3; StudioLayout.test.tsx 1/2; contributions.ts 1/3; regionParts.tsx 37/45 (35 insertions, 2 deletions; it was 38 before the correction); scaleBar.test.ts 89/180; scaleBar.ts 71/90; styles.css 15/25.
   - Outside the count: KNOWN-LIMITATIONS.md 4/10, MANUAL-WALKTHROUGH.md 29/45, e2e/README.md 2/20.
   - No overrun, so no class 8.
5. `git diff --stat 9f8b67cd..HEAD` shows two files only: regionParts.tsx (7 lines changed) and scaleBar.ts (9 lines changed), 8 insertions and 8 deletions.

Departures: none from the ruling, the form or the brief.
- verify-cites printed an advisory about state/drafts/sitting-script-2026-11-24.md:863, which this change did not cause. I left it.
- The form is not in the worktree (it is on main only), so I read §7 from origin/main.
- The first verify batch ran in the Bash tool's background and none of its commands held the machine hold. verify-cites, verify-quotes, verify-test-claims and verify-mutation are not heavy.
