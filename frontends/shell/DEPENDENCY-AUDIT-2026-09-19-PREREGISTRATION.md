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

## Amendment 1 -- the audit branch's results

**Written after the outcomes below were observed** (the ADMISSION rule). Commit 2 applied `npm
audit fix --force` in both trees; this records what running §5's steps against that applied fix
actually showed.

### Shell: `npm test -- --run` (triggers `pretest` -> viewer build + shell build)

**FAILS, rc 2, before the vitest suite ever runs.** `pretest` runs `npm run build` on this package,
which runs `tsc --noEmit` first; that fails with two errors, both in
`src/residency/candidateArmSession.test.ts`, both the same shape -- vitest 5's `vi.fn()` return
type (`Mock<Procedure | Constructable>`) no longer structurally satisfies a typed callback parameter
(`(event: ResidencyStatusEvent) => void`) the way vitest 2's did:

```
src/residency/candidateArmSession.test.ts(2271,73): error TS2322: Type 'Mock<Procedure | Constructable>' is not assignable to type '((event: ResidencyStatusEvent) => void) | undefined'.
  Type 'MockInstance<Procedure | Constructable> & (new (...args: any[]) => any) & {}' is not assignable to type '((event: ResidencyStatusEvent) => void) | undefined'.
src/residency/candidateArmSession.test.ts(3335,73): error TS2322: Type 'Mock<Procedure | Constructable>' is not assignable to type '((event: ResidencyStatusEvent) => void) | undefined'.
  Type 'MockInstance<Procedure | Constructable> & (new (...args: any[]) => any) & {}' is not assignable to type '((event: ResidencyStatusEvent) => void) | undefined'.
```

Per this step's instruction, tests and config are **not** patched to work around this; the failure
is recorded and the step stopped there. The vitest suite itself (1026 tests across 70 files, all
passing on this branch's pre-fix state -- a fast-forward of `origin/main` -- before commit 2) is
never reached post-fix.

### Shell: `npm run build` (run explicitly, as its own step)

**FAILS, rc 2, identically** -- same `tsc --noEmit` step, same two errors, same file and lines.
Because `tsc` fails before `vite build` ever runs, `dist/`, `dist-metafile.json`, and the *final*
`src/generated/NOTICE.txt` pass are never produced post-fix; only the `prebuild` hook's provisional
`generate:notice` write happens, and it can only read whatever `dist-metafile.json` a prior
successful build left on disk -- not this build's own manifest. **No valid post-fix shell notice
comparison is possible**; see the notice-set result below.

### Viewer: `npm run build`, `npm test`

**Both pass, rc 0.** Build: `dist/app.js` 434.9kb, same four outputs as the pre-fix build. Test
(`node --test scripts/**/*.test.mjs`): 69/69 pass, 0 fail, 0 cancelled.

### The notice set

- **Viewer** (`renderer/bundle-viewer/dist/NOTICE.txt`, gitignored, never committed): built once
  before commit 2 (this branch's pre-fix state) and once after, byte-identical
  (sha256 `826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb` both times, 3325 lines) --
  expected, since esbuild is a dev/build tool, not a package the metafile's module walk ever
  recorded as bundled.
- **Shell** (`frontends/shell/src/generated/NOTICE.txt`, gitignored, never committed): **could not
  be compared post-fix** -- the build that would produce a real, final-pass copy of it fails at
  `tsc --noEmit` before reaching that pass (see above). `git status --porcelain` is clean and
  `git diff --stat` on the path shows nothing, both trivially true because the path is gitignored
  and untracked in every state.

### The licence audit

`node scripts/audit-dependency-licenses.mjs`: **rc 0.** Summary: 256 packages audited, 254
recognised, 2 decided (both pre-existing Rust crates, unrelated to this piece), 0 needing review, 5
trees not auditable (2 cargo trees whose offline metadata call fails in this worktree, 3 npm trees
with no `node_modules` installed here -- none of these five is `frontends/shell` or
`renderer/bundle-viewer`, and none of this is caused by commit 2). Confirms §8: `frontends/shell`
is not one of `NPM_TREES` (`scripts/audit-dependency-licenses.mjs:210-215`), so the report never
scans the tree this piece's forced fix changed, and the ten added packages -- the two MPL-2.0 ones
included -- are not reported by it under any bucket. Running the script also rewrote the tracked
root `DEPENDENCY-LICENSES.md` to reflect this worktree's own partial `node_modules` layout (three
npm trees outside this piece's scope are not installed here, unlike on a fully-provisioned
checkout); that regeneration is an artifact of this worktree, not of commit 2, is out of this
piece's §1 Scope, and was reverted (`git checkout -- DEPENDENCY-LICENSES.md`) rather than committed.

### The lockfile diff summary

Counted from `"node_modules/<name>"` keys in `frontends/shell/package-lock.json` /
`renderer/bundle-viewer/package-lock.json`, comparing commit 1 (`e04ccc4`, pre-fix) against commit 2
(`566907c`, post-fix) -- this counts every declared key, including per-platform optional variants
npm lists but does not install on this machine, which is why it differs from `npm audit fix
--force`'s own narrower install-time report (shell: "added 11 packages, removed 18 packages,
changed 15 packages"; viewer: "changed 2 packages").

**`frontends/shell`: 35 added, 62 removed, 15 changed** (full lists in the branch's working log, not
reproduced here). Of the additions, the platform-specific optional binaries for `@rolldown/binding-*`
(16 targets) and `lightningcss-*` (11 targets other than the one this machine installs) are inert on
this platform. The packages actually new to this tree, with `npm view <pkg>@<ver> license`:

| package | version | licence |
|---|---|---|
| `@oxc-project/types` | 0.150.0 | MIT |
| `rolldown` | 1.2.9 | MIT |
| `@rolldown/pluginutils` (nested under `rolldown`) | 1.0.1 | MIT |
| `lightningcss` | 1.33.0 | **MPL-2.0** |
| `lightningcss-win32-x64-msvc` (the platform variant this machine installs) | 1.33.0 | **MPL-2.0** |
| `@types/chai` | 5.2.3 | MIT |
| `@types/deep-eql` | 4.0.2 | MIT |
| `detect-libc` | 2.1.2 | Apache-2.0 |
| `obug` | 2.2.1 | MIT |
| `@vitest/mocker` (relocated from a nested copy to top-level; version bump, not new) | 5.0.1 | MIT |

Neither `lightningcss` identifier is on `RECOGNISED_PERMISSIVE`
(`scripts/audit-dependency-licenses.mjs:75-91`) or in `PACKAGE_DECISIONS`
(`scripts/audit-dependency-licenses.mjs:120-179`), and (per §8) the shell tree is not audited by the
script regardless.

**`renderer/bundle-viewer`: 1 added, 0 removed, 26 changed.** All 26 changed entries are `esbuild`
and its per-platform `@esbuild/*` packages, `0.24.2 -> 0.28.2`. The one addition is a new platform
target, `@esbuild/openharmony-arm64@0.28.2` (esbuild started shipping it; inert on this machine),
licence MIT (`npm view esbuild@0.28.2 license`, `npm view @esbuild/openharmony-arm64@0.28.2
license`).

### `npm audit` after `npm ci`, both trees

`frontends/shell`: "found 0 vulnerabilities", rc 0. `renderer/bundle-viewer`: "found 0
vulnerabilities", rc 0. Both `npm ci` runs themselves: rc 0, clean installs. Both flagged one
unapproved install script each (`esbuild@0.25.12` in shell's tree, `esbuild@0.28.2` in the
viewer's) under npm's `allow-scripts` mechanism -- noted, not acted on; approving or denying it is
outside this piece's scope.

## Amendment 2 -- the gated piece's results

References and results only (the record cap, `state/directives/2026-09-18-record-cap.md`), per
DECISIONS-PENDING.md RULED 2026-09-20, entries 116 and 117.

**Merge:** `origin/main` merged at commit `30cb23c` (signed off; no lockfile/package.json conflict --
neither `frontends/shell/package-lock.json` nor `renderer/bundle-viewer/package-lock.json` was
touched by `origin/main` since this branch's base). `git diff --name-only --diff-filter=U` after the
merge: empty.

**Package delta vs. this document's own Amendment 1 lockfile-diff-summary table:** none. Recomputed
from `node_modules/<name>` keys in commit `30cb23c`'s lockfiles against `origin/main`'s: shell tree
35 added / 62 removed / 15 changed (same ten non-platform packages Amendment 1's table lists);
viewer tree 1 added / 0 removed / 26 changed (`@esbuild/openharmony-arm64`, the same MIT platform
stub). Resolved versions match exactly: `vitest` 5.0.1, `vite-node` 6.0.0, `esbuild` (viewer)
0.28.2, `lightningcss`/`lightningcss-win32-x64-msvc` 1.33.0, `caniuse-lite` 1.0.30001809. No STOP
condition.

**Test typing (entry 116):** commit `682fb4c` -- `frontends/shell/src/residency/candidateArmSession.test.ts:2271`
(`bootstrapAndArmOverBudget`) and `:3335` (`armOneTile`), each parameter retyped from
`ReturnType<typeof vi.fn>` to the callee's own declared type, `(event: ResidencyStatusEvent) => void`
(the callee: `frontends/shell/src/residency/candidateArmSession.ts:108`). `npx tsc --noEmit`: rc 2
before, rc 0 after; no other error. File line count unchanged (`git diff --stat`: 2 insertions, 2
deletions).

**Audit-script decisions (entries 116, 117):** commit `49f0568` -- three `PACKAGE_DECISIONS` entries
appended to `scripts/audit-dependency-licenses.mjs` for `lightningcss` 1.33.0,
`lightningcss-win32-x64-msvc` 1.33.0 (tree `frontends/shell`, MPL-2.0) and `caniuse-lite` 1.0.30001809
(tree `frontends/shell`, CC-BY-4.0), each dated 2026-09-20, build-time-only. `node
scripts/audit-dependency-licenses.mjs`: rc 0; the three packages no longer need REVIEW (previously 1
REVIEW line on `origin/main`, `caniuse-lite`; the `lightningcss` pair was absent from `origin/main`'s
lockfile). The regenerated `DEPENDENCY-LICENSES.md` was not committed: this worktree's partial
npm/cargo provisioning (2 cargo trees whose offline metadata call fails under `.claude/worktrees/`, 2
npm trees with no `node_modules` installed here) produces a materially different package count than a
fully-provisioned checkout's generation -- the same worktree artifact this document's own Amendment 1
already recorded and reverted rather than committed.

**Suites and builds (rc recorded):**

- `renderer/bundle-viewer`: `npm ci` rc 0; `npm run build` rc 0 (`dist/app.js` 434.9kb); `npm test`
  rc 0, 69/69 pass.
- `frontends/shell`: `npm ci` rc 0; `npm run verify` rc 1 -- 4 of 1048 tests fail with vitest's
  default 5000ms timeout, all in `src/notices/{duckdbAmalgamation,noticeByteIdentity,
  noticeDeterminism,spdxTokenisation}.test.ts`, which call `cargo metadata`/`cargo tree` against
  `frontends/shell/src-tauri` -- a crate this workspace's root `Cargo.toml` (`exclude`, line 27)
  deliberately excludes. Confirmed environment-only, not a consequence of this piece's dependency
  bump: (a) the same failing file run alone with `--testTimeout=30000` passes (21/21, 9.62s); (b) the
  identical suite run from a separate `git worktree add` of `origin/main` outside `.claude/worktrees/`
  passes 1048/1048 rc 0, with the same cargo calls individually taking 5-23s; (c) neither
  `lightningcss` nor `caniuse-lite` nor any npm package touches `Cargo.lock`, so the Rust package
  graph these tests read is identical before and after this piece's changes.
- `npm audit` after `npm ci`, both trees: "found 0 vulnerabilities", rc 0.

**Notice set (before/after, both trees):** `frontends/shell/src/generated/NOTICE.txt` sha256
`18c71526fcf566d5640f13b3b06783b67008c1ba6233ce64b32b4bc0a20ac7de` on both `origin/main` (built in a
separate `git worktree add` checkout) and commit `49f0568`'s tree -- byte-identical.
`renderer/bundle-viewer/dist/NOTICE.txt` sha256
`826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb` on both -- byte-identical,
matching this document's own Amendment 1 record of the same viewer hash.

**Governance pre-gate (rc recorded, all from the worktree root):** `node --test "scripts/plan/*.test.mjs"
"scripts/hooks/*.test.mjs"` rc 0 (251 pass); `node scripts/plan/verify-cites.mjs` rc 0 PASS; `node
scripts/plan/verify-quotes.mjs` rc 0 PASS; `node scripts/plan/verify-test-claims.mjs` rc 0 PASS (108
claimed, 3 pre-existing planned/advisory, unrelated to this piece); `node scripts/plan/verify.mjs
--offline` rc 0 PASS; `node scripts/plan/queue.mjs --check` rc 0, current; `node scripts/plan/site.mjs
--check` rc 0, current. No drift; nothing regenerated.

## Amendment 3 -- the timeout fix and full-provisioning audit (references only, record cap)

Corrects Amendment 2's attribution: the 4-of-1048 timeout failures are cargo package-cache lock
contention across concurrently running test files (vitest 5's default equals vitest 2's), not the
worktree's location -- observed directly this pass on a quiet machine (see below), superseding
Amendment 2's `.claude/worktrees/`-location explanation in its "Suites and builds" bullet for
`frontends/shell`.

**Timeout commit:** `5f8dbba`, delegation PRECEDENTS.md P-005. Ceiling and API cite are in that
commit's message.

**Runs (quiet machine, `tasklist` showed no cargo.exe/rustc.exe before each start):** the four files
together, 3/3 runs, 32/32 tests passing each run (13.32s, 17.24s, 15.00s).

**`npm run verify` at `5f8dbba`:** rc 0. Summary: `Test Files 4 passed (4)` /
`Tests 32 passed (32)` for the four notice files within the full suite; full-suite summary line
`== 76 passed, 0 failed ==` (test:residency-trace) and `== 30 passed, 0 failed ==`
(test:citation-integrity).

**Audit:** `node scripts/audit-dependency-licenses.mjs` at `60f56e1`, rc 0 --
`989 packages audited, 12 decided by a human, 0 need human review, 0 tree(s) not auditable`. REVIEW-line
delta vs `origin/main`: `caniuse-lite` moved from **Needs human review** to **Decided** (dated
2026-09-20, per Amendment 2); no other package entered or left review. Lockfiles unchanged by `npm ci`
/ `cargo fetch --locked` (clean `git status` before the audit commit).

**Governance pre-gate at `60f56e1` (rc recorded, all from the worktree root):**
`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` rc 0 (251 pass);
`node scripts/plan/verify-cites.mjs` rc 0 PASS; `node scripts/plan/verify-quotes.mjs` rc 0 PASS;
`node scripts/plan/verify-test-claims.mjs` rc 0 PASS (108 claimed, 3 pre-existing planned/advisory,
unrelated to this piece); `node scripts/plan/verify.mjs --offline` rc 0 PASS;
`node scripts/plan/queue.mjs --check` rc 0, current; `node scripts/plan/site.mjs --check` rc 0,
current.

## Amendment 4 — correction round after full gating attempt 1

References and results only (the record cap, `state/directives/2026-09-18-record-cap.md`).

**1/2. Per-decision `DECISION_SOURCE`; two false decision comments.** Defect: one hard-coded
`DECISION_SOURCE` credited all three 2026-09-20 decisions to the 2026-08-07 checklist note, and two
new entries' comments said lightningcss arrived via "vitest 5 / vite 6" and caniuse-lite was "bumped
by the same forced audit fix". Corrected reference: `scripts/audit-dependency-licenses.mjs` @ `fa5d3a6`
gives each `PACKAGE_DECISIONS` entry its own `source` (pre-existing entries keep
`PRE-PUBLIC-CHECKLIST.md`'s 2026-08-07 item 1; the three new ones cite `DECISIONS-PENDING.md`, RULED
2026-09-20, entry 116 for the lightningcss pair and entry 117 for caniuse-lite); lightningcss's
comment now cites vite-node's nested vite@8.3.0's own direct dependency
(`frontends/shell/package-lock.json:3993-4003 @ bb49f80 sha256:49cb6c57c6f986e2a2950ff54a900ca926d2233f1a96ed8b44482ae023207e5c`),
and caniuse-lite's comment states it was already 1.0.30001809 on `origin/main` before this piece
(`git show e04ccc4:frontends/shell/package-lock.json`). Proof: `node scripts/audit-dependency-licenses.mjs`
rc 0 at `fa5d3a6`; the Decided-packages table prints each row's own Source column; the "Third-party
data terms" section is byte-identical to `bb49f80`'s.

**3. The nested vite, disclosed (no ruling claimed or needed, per both gates).** §2's row said the
resulting nested vite is "6.x"; `frontends/shell/package-lock.json` resolves vite-node's nested vite
to 8.3.0, a required consequence of the approved `vite-node@^6.0.0` (`vite-node@^6.0.0` requires
`vite@^8`), bringing `rolldown@1.2.9` and `lightningcss@1.33.0` as vite 8's own dependencies and
moving `postcss` 8.5.26→8.5.28
(`frontends/shell/package-lock.json:3993-4003 @ bb49f80 sha256:49cb6c57c6f986e2a2950ff54a900ca926d2233f1a96ed8b44482ae023207e5c`).
No decision beyond the three already in `PACKAGE_DECISIONS` is needed: `rolldown` and `postcss` are
both MIT (`node_modules/rolldown/package.json`, `node_modules/postcss/package.json`, this worktree),
already on `RECOGNISED_PERMISSIVE`.

**4. Amendment 2's and Amendment 3's cause, both superseded.** Defect: Amendment 2 attributed the
4-of-1048 failures to the `.claude/worktrees/` location; Amendment 3 attributed them to cargo
package-cache lock contention; neither holds. Corrected cause: vitest 2's `withTimeout` is a plain
`Promise.race` with no post-check (untracked build output, main checkout's install of vitest 2.1.9 --
`@vitest/runner/dist/index.js`, function `withTimeout`, lines 32 through 50), so a test whose own
promise settles via microtask ordering before the timer macrotask fires is credited on-time
regardless of elapsed time; vitest 5's `withTimeout` explicitly checks `deadline.exceeded()` after the
test settles and rejects it even then (untracked build output, this branch's install of vitest 5.0.1
-- `vitest/dist/chunks/run.C5UmxDPh.js`, the `resolve` closure inside `withTimeout`, lines 3277
through 3288) -- a real behaviour change the approved bump introduces, not an environment artifact.
Proof: on `origin/main` at `fc65d83`, a quiet-machine (`tasklist` showed no cargo.exe/rustc.exe) solo
run of `noticeDeterminism.test.ts` (`npx vitest run`, vitest 2.1.9) takes 5.70s test time against the
unconfigured 5000ms default and still passes.

**5. The timeout's authority, re-cited.** Defect: the timeout commit (`5f8dbba`) cited
`PRECEDENTS.md` P-005, which is not about test timeouts. Corrected reference: `DECISIONS-PENDING.md`,
RULED 2026-09-20, entry 116's suite-and-build-green step is the authority — the approved vitest
5.0.1 enforces a timeout vitest 2.1.9 never enforced (finding 4, above), and raising it is part of
making the suite green under that entry. No re-commit: the code at `5f8dbba` is unchanged; only the
citation is corrected here.

**6. Record hygiene.** Defect: Amendment 2's "Test typing (entry 116)" bullet named the tsc error
lines (2271, 3335) as the retyped parameter lines, and its "Governance pre-gate" bullet named no
commit; separately, §0's first bullet labels a paraphrase "the human's verbatim order" and its P-011
quote elides with ASCII "..." rather than "…". Corrected reference: the retyped parameters are at
frontends/shell/src/residency/candidateArmSession.test.ts:2270 @ 682fb4c sha256:4287c551ccd75fe244352539d937eb19c9038e5d46a8787b40ca250c81d5304d and frontends/shell/src/residency/candidateArmSession.test.ts:3334 @ 682fb4c sha256:cf1610f94b0aa44f6d5657bc5f5ada59754c309c860dd5611828aee2964604d3
(matching entry 116's own text); the pre-gate ran at commit `49f0568` (HEAD when Amendment 2's `f1b71ab` was authored); the
actual verbatim human order is `DECISIONS-PENDING.md`, RULED 2026-09-19, entry 115, item (c), not
§0's paraphrase. Proof: `git show 682fb4c:frontends/shell/src/residency/candidateArmSession.test.ts`
confirms both lines' content; `git log --oneline` places `49f0568` immediately before `f1b71ab`;
`DECISIONS-PENDING.md:28 @ fc65d83` (main) carries the quoted human message in full.

**7. Disclosure: `protocol/transport-bakeoff/web`'s count, and `origin/main`'s own report.** Kept in
this PR per the ruling's "regenerated" instruction, about `origin/main`'s committed report, not this
piece's change: `protocol/transport-bakeoff/web` audits at exactly 30 packages once its
`node_modules` is provisioned (`npm ci` there: "added 30 packages"), and `origin/main`'s committed
`DEPENDENCY-LICENSES.md` (966 packages, 1 not-auditable) is itself under-provisioned — running the
audit against `origin/main` at `fc65d83` with that one tree's `node_modules` installed gives 996
packages and 0 not-auditable. This branch's own fully-provisioned report already reflects the correct
count (commit `fa5d3a6`, 989 packages including this piece's own dependency bump); `node_modules` was
removed from the main checkout afterward and its regenerated `DEPENDENCY-LICENSES.md` reverted
(`git checkout -- DEPENDENCY-LICENSES.md`), so `origin/main`'s tree is unchanged.

**8. The architect's caveat, for the record only.** The three 2026-09-20 `PACKAGE_DECISIONS` entries'
`why` text says "build-time-only", but `decisionFor()` keys only on tree/name/version/license
(`scripts/audit-dependency-licenses.mjs`, `decisionFor`), so nothing mechanical re-flags any of the
three if it enters a shipped set under the same tree key (`frontends/shell`) — a finding for a later
piece, not an audit-semantics change here.

### Superseded as of this amendment

- Amendment 2, "Test typing (entry 116)" bullet: lines 2271/3335 — superseded by finding 6 above
  (2270/3334).
- Amendment 2, "Governance pre-gate" bullet: no commit named — superseded by finding 6 above
  (commit `49f0568`).
- Amendment 2, "Suites and builds" bullet's `.claude/worktrees/`-location cause — superseded by
  finding 4 above.
- Amendment 3's own "Corrects Amendment 2's attribution" cargo-lock-contention cause and its
  "Timeout commit ... delegation PRECEDENTS.md P-005" line — superseded by findings 4 and 5 above.
- §2's row: "resulting nested vite is 6.x" — superseded by finding 3 above (8.3.0).
- §0's first bullet: "the human's verbatim order:" — superseded by finding 6 above (a paraphrase; the
  verbatim text is at `DECISIONS-PENDING.md`, RULED 2026-09-19, entry 115, item (c)).
- §0's P-011 quote's "..." elision mark — superseded by finding 6 above ("…").

Read the last amendment first.
