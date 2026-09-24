# explicit viewer-before-shell build order — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: state/directives/2026-09-22-part-n-n8-and-sequencing.md:159 (read, cite by path:line, not retyped); DECISIONS-PENDING.md entry 115, item (b); kernel/RESULTS.md, section "### Step 4 — the shell build/test (`frontends/shell`)"; PLAN.yaml node drill-fix-viewer-build-order; AUTONOMY.md §21d.
Scope: frontends/shell/package.json (the "prebuild" and "pretest" scripts only) and a new frontends/shell/scripts/buildViewerFirst.mjs; declared line budget <= 150 non-generated lines across <= 8 files.
Change: prebuild first runs buildViewerFirst.mjs (builds renderer/bundle-viewer, refusing with a named-fix message if its node_modules is missing) then generate:notice, so a bare `npm run build` here builds the viewer on its own; pretest is simplified since prebuild now covers what it built explicitly.
Tests+mutation: the check is a real clean run -- delete renderer/bundle-viewer/dist and dist-metafile.json, run `npm run build` in frontends/shell, record rc; the mutation is the change reverted and the same run recorded failing with generateNotice.mjs's existing "does not exist -- run `npm run build` in renderer/bundle-viewer first" message; both runs recorded in the hand-back.
Out-of-scope: no dependency added/removed/bumped; no ADR, wire, security or guarantee text; no change to what ships -- frontends/shell/src/generated/NOTICE.txt and the viewer's dist/NOTICE.txt sha256 verified equal to main's build of them.
```
