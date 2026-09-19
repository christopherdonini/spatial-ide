# Shell dependency audit, 2026-09-19 -- preregistration

**Committed before any code**, per the short-form/full-form discipline (`AUTONOMY.md` §21a/§21b);
this piece takes the full form (a dependency change, one of §21a's four categories) and full
two-agent gating, but that gate is deferred to §7.

## §0. Authority

- `DECISIONS-PENDING.md`, RULED 2026-09-19, entry 115, item (c) (the human's verbatim order: fix
  reachability-first, dev-only in the same piece after shipped, patch-level under P-033, anything
  minor/major or a new package returns to the human with the lockfile diff and licence check, the
  notice set regenerated in the same PR).
- `PRECEDENTS.md` P-011 ("Dependency changes... No dependency is added or changed without the
  human") -- the default this piece operates under for anything past patch-level.
- `PRECEDENTS.md` P-033 (the Dependabot patch-bump precedent for the custodian; `AUTONOMY.md`
  Appendix A2, item 20) -- the narrow carve-out entry 115(c) invokes for a patch-level fix, not
  exercised here because phase 1 found none available (see §3).
- ADR-009's licence boundary (accepted 2026-08-07; the pre-public licence-audit checklist item this
  piece's §5 licence-audit step runs against) -- by name only; not amended here.
- Phase 1 (read-only, dispatched by the same RULED block) established the reachability findings
  this preregistration's §2/§3 restate as data.

## §1. Scope

- `frontends/shell/package.json`, `frontends/shell/package-lock.json`
- `renderer/bundle-viewer/package.json`, `renderer/bundle-viewer/package-lock.json`
- The generated notice files, if they change as a build consequence (`frontends/shell/src/generated/NOTICE.txt`,
  `renderer/bundle-viewer/dist/NOTICE.txt` -- both gitignored, never committed)
- This file

No product code, no wire, no shipped dependency, no ADR (see §6).

## §2. The advisory table (phase 1's finding, reproduced as data)

| package | installed | severity | dev/prod | shipped? (evidence) | fix | semver class | new packages | licence in -> out | route |
|---|---|---|---|---|---|---|---|---|---|
| vitest | 2.1.9 | critical | dev (direct, `frontends/shell/package.json` devDependencies) | not shipped -- test runner only; not in the Rollup module walk that defines the shipped set (`frontends/shell/vite.config.ts:40-73`) | vitest@5.0.1 | major | yes (10 new, tree-wide -- see §3 of commit 3's record) | MIT -> MIT | human |
| vite (nested under vitest/vite-node) | 5.4.21 | high | dev (transitive of vitest/vite-node; not a direct dependency) | not shipped -- dev/test tool only, same evidence path | pulled in by vitest@5.0.1 / vite-node@6.0.0 | major (no independent patch line; installed 5.4.21, resulting nested vite is 6.x) | see vitest row | MIT -> MIT | human |
| vite-node | 2.1.9 | moderate | dev (direct, `frontends/shell/package.json` devDependencies) | not shipped -- same evidence path | vite-node@6.0.0 | major | see vitest row | MIT -> MIT | human |
| esbuild (nested under vite-node/vitest) | 0.21.5 | moderate | dev (transitive, two nested copies: `node_modules/vite-node/node_modules/esbuild`, `node_modules/vitest/node_modules/esbuild`) | not shipped -- same evidence path | pulled in by vitest@5.0.1 | major | see vitest row | MIT -> MIT | human |
| @vitest/mocker | 2.1.9 | moderate | dev (transitive of vitest, `node_modules/vitest/node_modules/@vitest/mocker`) | not shipped -- same evidence path | pulled in by vitest@5.0.1 | major | see vitest row | MIT -> MIT | human |
| esbuild (`renderer/bundle-viewer`) | 0.24.2 | moderate | dev (direct, `renderer/bundle-viewer/package.json` devDependencies) | not shipped -- build-time bundler only; not in the esbuild metafile that defines the viewer's shipped set (`renderer/bundle-viewer/build.mjs:26-42`) | esbuild@0.28.2 (package.json range change) | major | yes (per `npm audit fix --force`'s own report) | MIT -> MIT | human |

Ten new packages pulled into the `frontends/shell` tree by the forced fix include two declaring
`MPL-2.0` (`lightningcss`, `lightningcss-win32-x64-msvc`), not on `RECOGNISED_PERMISSIVE`
(`scripts/audit-dependency-licenses.mjs:75-91`) and not a package-scoped decision in
`PACKAGE_DECISIONS` (`scripts/audit-dependency-licenses.mjs:120-179`). The full add/remove/change
list with versions and per-package licences is commit 3's record, not reproduced here twice.

## §3. The reachability ruling

None of the six advisories reach a shipped artifact: the packaged `frontends/shell` bundle (whose
shipped-package set is the Rollup module walk at `frontends/shell/vite.config.ts:40-73`, run over
what `generateBundle` actually emits after tree-shaking) and the `renderer/bundle-viewer` published
bundle (whose shipped-package set is the esbuild metafile at
`renderer/bundle-viewer/build.mjs:26-42`) both define "shipped" from a real build manifest, not a
hand-kept list, and none of `vitest`, `vite`, `vite-node`, `esbuild`, `@vitest/mocker` appears in
either. All six are therefore group B ("dev-only ones follow in the same piece") throughout entry
115(c)'s reachability-first ordering -- there is no group A (shipped) row.

`npm audit fix --dry-run` in both trees proposes nothing: no patch-level fix exists for any of the
six. Every available fix (`npm audit fix --force`) is a major-semver bump (vitest 2.1.9 -> 5.0.1,
vite-node 2.1.9 -> 6.0.0 as its consequence, esbuild 0.24.2 -> 0.28.2 in the viewer) and, in the
shell tree, introduces new packages. Under entry 115(c)'s own text ("Patch-level bumps land under
P-033; anything minor/major or introducing a new package comes back to me with the lockfile diff and
licence check"), every one of the six advisories routes to the human. Nothing here is
custodian-landable.

## §4. What this branch does, and what it does not claim

**Does:** applies `npm audit fix --force` in both `frontends/shell` and `renderer/bundle-viewer` on
this DRAFT branch so the human can inspect a real, built, tested artifact rather than a hypothetical
one; records the exact `package.json` range changes and lockfile add/remove/change counts; rebuilds
both packages and runs the notice generator, then diffs the regenerated notice bytes against the
same build performed before the fix (this branch's pre-fix state, itself a fast-forward of
`origin/main`, so the comparison is against what ships today); runs the shell's and the viewer's own
test and build scripts and records rc and counts; runs the licence audit script and records its rc,
report, and the fact that it does not scan `frontends/shell` (§8); records the lockfile diff summary
(added/removed/changed packages with versions and licences).

**Does NOT claim:** nothing on this branch is landable without the human's word (P-011; entry
115(c)); this is a draft for inspection, never merged, never presented as ready. The two MPL-2.0
packages the forced shell fix pulls in (`lightningcss`, `lightningcss-win32-x64-msvc`) need a dated,
package-scoped decision at `scripts/audit-dependency-licenses.mjs:120-179` before any landing --
this piece surfaces that need, it does not resolve it. No claim is made that vitest 5 / vite 6 /
esbuild 0.28 are behaviourally compatible with this codebase beyond what the recorded test and build
runs in commit 3 actually show.

## §5. Tests (recorded with rc in commit 3)

- `frontends/shell`: `npm test -- --run` (vitest suite, after `pretest`'s viewer build + shell
  build), `npm run build`
- `renderer/bundle-viewer`: `npm run build`, `npm test` (its `node --test` suite, which exercises
  `notice.mjs`)
- The notice-byte-identity tests inside the shell suite (`src/notices/noticeByteIdentity.test.ts`,
  `src/notices/noticeDeterminism.test.ts`) as part of the same `npm test -- --run` run above, not a
  separate invocation
- `node scripts/audit-dependency-licenses.mjs` (the licence audit)

## §6. Out-of-scope

No product code. No wire (SKP/MCP) change. No shipped dependency (§3: nothing here reaches a shipped
artifact). No ADR amendment. No merge to `main`.

## §7. Gates

Reviewer + architect, full gating under §21a (a dependency change is one of its four categories) --
opened only AFTER the human's word on §2/§3's routed items, not before. This preregistration and
commits 2-3 (the applied fix and its recorded results) are the decision material the human's word
acts on; they are not themselves gated in this piece.

## §8. Finding, off-scope (for the human)

`NPM_TREES` in `scripts/audit-dependency-licenses.mjs:210-215` lists `renderer/bundle-viewer`,
`frontends/canvas-probe`, `protocol/transport-bakeoff/web`, and `spikes/adr-003-crs-rendering/app`,
but not `frontends/shell` -- the tree this piece's forced fix touches. Today's licence audit
(`node scripts/audit-dependency-licenses.mjs`, run in commit 3) never covers the shell tree; its
report is silent on the ten packages a real shell fix would add, MPL-2.0 pair included. This is a
stale-paths gap in the audit script, not something this piece's scope authorizes fixing.
