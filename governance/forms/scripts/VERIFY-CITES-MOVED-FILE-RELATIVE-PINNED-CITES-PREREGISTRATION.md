# verify-cites: a moved citing file's relative pinned cites resolve from its folder before the move as well as its folder now (the #270 review's C1, with its D1 and D2) — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node verify-cites-moved-file-relative-pinned-cites, the governance lane (S3). The five lines and the notes are the architect's draft (`state/consults/2026-11-05-verify-cites-moved-file-relative-pinned-cites-five-line-form-architect-draft.md`, read only at main 8e90c244; its sha256 from line 5 is 12ad75a9616ccef7a13687f973d5b32ad1ab4986ff2b5b5cd8b9c016d6daf844), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ 8e90c244` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path as `path:line` at <commit>, sha256 <hex>; 2 such) (68 pins; 32 bare line numbers bound to a path, 28 to the path written before them and 4 to the file their sentence names, the F form for `:372` and `:373` and `scripts/plan/verify-cites.mjs` for `:437` and `:445`); one cite listing seven lines of governance/PRECEDENTS.md split into seven; the 3 remaining markers given the full commit id; the five lines moved before the notes, with the draft's heading and form-path line for them dropped; the report's first line and its read paragraph dropped; this title and lead line added. Form path: `governance/forms/scripts/VERIFY-CITES-MOVED-FILE-RELATIVE-PINNED-CITES-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

```
Authority: PLAN node verify-cites-moved-file-relative-pinned-cites (governance/PLAN.yaml:6201-6217 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:9681e68095e34c3f95e03a3a8f03c97393bf59d00cd849efaafc9b85012629db); the human's ruling of 2026-11-05, item 2, first sentence (state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:9 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:cb77dc049787204e76d51c00840388991df9ca9ba536978ca790aaa8f46e2081); the finding C1 with D1 and D2, a reading and not Authority (state/consults/2026-11-03-platform-independent-review-pr-270.md:33-36 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:90c7d4de4204a92fff64dee4b01373cf30b8d180407aa4ec211e9a8af3015e5b, state/consults/2026-11-03-platform-independent-review-pr-270.md:44 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:0254da8457529d9b5b2c76fcb62c4aea6c40bff16039b4e94705e34c847b0fdd, state/consults/2026-11-03-platform-independent-review-pr-270.md:46 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:9000d37940ce82c73169da5db52ffc295b813c9cbfa2fd276bf9da1f4308e2db); piece F's form §2.3 and §8 item 15 (governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:364 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:9e9feaeee1cb638be61faa313dde0627ca99e46af0aab176e929bdd6e2a2a7fa, governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:372-373 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:57402150751a0ad8858b44ef2a5f9de40322b96a84dc87663df3c77fc1c6cfb5, governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:506 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:86aa89db63b3347dd7dfa17e4b80e0a0acf3bdc438099953f2baa62543b04972). Reuse index (tools/reuse.mjs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c): a miss for both queries, noted; it does not block.
Scope: scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs, governance/README.md, scripts/plan/README.md, scripts/hooks/README.md (5 files); declared budget 130 changed lines, insertions plus deletions, tests and comments counted (§21c), this form excluded.
Change: In runVerifyCites, a pinned cite's tree resolution and the path list its pin is read at take the candidates of its path resolved from the citing file's folder before its first move (originPath through governance/MOVED.tsv) and from its folder now, so a moved file's relative pinned cites keep the exact tier they had before the move, while a pinned cite's own path still takes no old-to-new mapping and no post-move check, an unmoved citing file resolves as today, and resolveRef, resolveRefMapped, checkCitation's unpinned path, checkPinned and movedMap.mjs are unchanged; D1's and D2's words land with it.
Tests+mutation: T-A `verify-cites: a moved form's relative pinned cites resolve from its pre-move folder at the exact tier` (the 41 cites read at 8e90c244fbf0cdd1175447a883f40f62d90fadd1: 39 in governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md, 1 each in governance/forms/root/KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md and governance/forms/root/KNOWN-LIMITATIONS-ITEM-41-SOURCE-COMMENT-PREREGISTRATION.md; a fixture with a moves-only commit; 41 gated, none advisory; fails at the base), mutation M1, the map dropped (current folder only): T-A fails by name; T-B `verify-cites: a pinned cite from a moved file to a file moved beside it stays at the exact tier` (the 9 cites of governance/PRECEDENTS.md and governance/forms/root/KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md at the same commit; 9 gated), mutation M2, the pre-move folder only: T-B fails by name; each mutation observed by applying it, running the test, recording its failure by name with its commit, and reverting; every existing test keeps its name and passes; node scripts/plan/verify-cites.mjs on the real tree at base and head: exit 0, the gated and advisory sets and the scanned count equal (a difference stops the piece).
Out-of-scope: ADR: none. Security posture: none. Wire (SKP, MCP): none. Stated guarantee or invariant: none; no existing test's assertion changes (T6 and T7 keep theirs; no other pinned test's fixture has a MOVED.tsv), and a pinned cite's own path keeps §2.3's no map and no post-move check.
```

*The notes, OPEN items and what is not settled below are the architect's from its draft, carried byte for byte except for the pins; where they say I, my or mine, they mean the architect's. They are this form's reading.*

## 1. Route: the five-line form stays open

- **§21a (`governance/AUTONOMY.md:315-332 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3`): no existing test assertion changes.**
  - T6, at `scripts/plan/verify-cites.test.mjs:698-707 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:42081a886ed4ff17e13ed56502e2d8f44f929e64cc5456035ce2f3004581fac8`, uses a pinned cite from `rec.md`, which never moved. `originPath` returns that path unchanged, so the result is the same.
  - T7, at `scripts/plan/verify-cites.test.mjs:709-717 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:f1a8ca9a60c6fa4706fb1019e64d53d375e79b42bcc8a4a33b5e94f9a21d065e`, is unpinned and unchanged.
  - Every other pinned test builds its fixture with `gitTree`, `pinnedRepo`, `pinnedAfter` or `ledgerRepo`. None of those writes `governance/MOVED.tsv`, so the map is empty and nothing changes. The same holds for `scripts/plan/rotate-decisions-pending.test.mjs:292 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:57b16666efd67fde018841b622981f6fd411f3ce467b617867552237097058b5`.
  - T6's tested property is kept: a pinned cite's own path takes no old-to-new mapping and no post-move check (F form, `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:372-373 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:57402150751a0ad8858b44ef2a5f9de40322b96a84dc87663df3c77fc1c6cfb5` and `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:415 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:d3257fb69179b78fefde697d42ae993c4451fe3ff2a1bd478ac33be1df2745f8`).
  - The change carries out §2.3's line that a moved citing file always resolves its relative cites from its old folder (`governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:364 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:9e9feaeee1cb638be61faa313dde0627ca99e46af0aab176e929bdd6e2a2a7fa`), and §8 item 15 (`governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:506 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:86aa89db63b3347dd7dfa17e4b80e0a0acf3bdc438099953f2baa62543b04972`).
- **§21c (`governance/AUTONOMY.md:347-357 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31`): within bounds.** The piece touches 5 files, about 130 changed lines, and adds no dependency, no exposure surface and no user-visible behaviour.
- **Risk for the single reviewer to check first:** the F form's line that pinned citations are unchanged (`governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:372 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:273bc9723fdb3c1b34946bf6b7830256dd10defff70463fc41de8cf010ee27d1`). My reading is that it binds the cite's own path, not the citing file's folder. If the reviewer reads it otherwise, the piece leaves the single-gate route under §21b.

## 2. C1 at this main, re-derived by reading

The review's own line numbers apply to its commit, e9406514. At 8e90c244fbf0cdd1175447a883f40f62d90fadd1 the pinned branch is at these lines of `scripts/plan/verify-cites.mjs`:
- `scripts/plan/verify-cites.mjs:435-436 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:2afe1c9c15a10a9cd4c9d8ae4f7f283acb57af522bd6dbe2f24072922689918f` passes no map for a pinned cite.
- `resolveRefMapped` therefore falls to `resolveRef` from the citing file's current path (`scripts/plan/verify-cites.mjs:248 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:fe9a82769060e64b0ba3faee01053ff613c285949f5f688da36bb9357a203fa9`).
- The pin read re-resolves from the current path (`scripts/plan/verify-cites.mjs:451-452 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:c8dc84d28bdd554797706efc53ef23ca35bcea5014b90227ea279da62de47e6b`).
- A failing cite is gated if it resolved exactly (`scripts/plan/verify-cites.mjs:462-463 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:b2b30ef3a4797eb3f9533ba4f8cc8e1fe94f0d4d1a463595bca1386ad5aa2765`) and advisory if it resolved only by suffix (`scripts/plan/verify-cites.mjs:464-465 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:7bfc63f4a9e3084bb3628858b3bb82e3b31f01d11ba9c2f2b1285e84c25aff80`).

Unpinned cites already use the pre-move folder, at `scripts/plan/verify-cites.mjs:251 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:62c5bfd24c4454c965eb4a3d4c7799d74c6d832e1b1b71022521bedcab741f5a` and `scripts/plan/movedMap.mjs:97 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:4ad51bcb50924605b50955ea3aa5a190ff03d750fe6c946a6fbcaa36bf0d3356`.

**Cites that fall from the exact tier to the suffix tier today: 41, all of them.** That count matches the ruling's, but they are not all in the EXPORT form:
- **39 in the EXPORT form.** They are the relative pinned cites at `@ 2ca3a53c` in Amendment 3's table, in `governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md`. Their lines are 396-401, 404-416, 418, 421-423, 425, 427-433, 435-436 and 439-444, one cite per line (`governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:396-444 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:a80c35f0903ee51955a0b633eeac59e472af658580ed861b55f783529c6ebbe9`).
  - From the folder they sit in now (`governance/forms/frontends/`), nothing resolves exactly. Each resolves by suffix to `frontends/shell/<path>`.
  - From their pre-move folder (`frontends/shell/`, `governance/MOVED.tsv:66 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:d339a1bffd0352c99fd40158f631594b0374e550e6d8cdacc746a58fd0361315`), each resolves exactly. All 10 target files exist under `frontends/shell/`.
- **1 each in two root forms that moved:**
  - `governance/forms/root/KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md:6 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:6c29264ac27941ab6bafcc193758afb2a48b28a7694ef56e56c5b5cf46a21274`
  - `governance/forms/root/KNOWN-LIMITATIONS-ITEM-41-SOURCE-COMMENT-PREREGISTRATION.md:6 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:a124db7363f74323ae943d5908be2657d966e7ae3d8d9fb631fac59f287b4aef`
  - Each has one pinned bare `KNOWN-LIMITATIONS.md` cite. From the pre-move folder (the repository root, `governance/MOVED.tsv:11-12 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:e0d75c0b85f1ea89cbe2384615e9b441f5976dc37d2cc304a774401cd050838b`) it resolves exactly to the root file. Today it resolves only by suffix.
- **The review's line list does not match its count.** It says all 41 are in the EXPORT form, but the lines it lists (64-71, 134, 396-405, ...) are the lines that carry `App.tsx` cites, the full-path ones included.

**Cites the review's suggested fix (pre-move folder only) would demote: 9.** These sit in moved files and cite a file that moved beside them, so today they resolve exactly from the new folder:
- `governance/PRECEDENTS.md:27 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:7dd022a63696588f47f14a5c77fad387c452a2119273474b47a40968e6732784`, `governance/PRECEDENTS.md:42 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:bc4795b823db936c6dee3edf9de92fbdc8937b71c54cadc63ff6e8de96224255`, `governance/PRECEDENTS.md:57 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:60189adb3abd75e3e62dde634ed8909f4dc0b9c30a1ef230cd0c8688648070a9`, `governance/PRECEDENTS.md:70 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:08e52eaccd0bc9dec081755c383e3cb2a90c1f2078312d1c16bfc8bf64c48b53`, `governance/PRECEDENTS.md:84 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:8549454ee7f6dc30cec85d0ff9cb38c61ef9b9b47b85c53494615fd7b00ba8b5`, `governance/PRECEDENTS.md:97 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:6c4597090eb76f2817dcfe2338dd20e1154717988c8d2390352e2309383fe827`, `governance/PRECEDENTS.md:111 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:5332c3b5e6ef09b0b4c41f83118cf1c48105e41b0c2519cf83e317653963471f`: seven pinned `AI_DEVELOPMENT.md` cites. Both files moved from the root to `governance/` (`governance/MOVED.tsv:2 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:4dc28594e75d11c7b353193b6822b5c6f80bdefb13d32b1dd507ac681d7180e0`, `governance/MOVED.tsv:23 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:f73f7ec586649420d93a62ad6d9e1617d0656523f1b51580e6eee5e109ef5907`).
- `governance/forms/root/KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md:27-28 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:e1539813a5a8fa96448453dd487e0feed53b1c779ab060b8020f323a48db0a59`: two pinned cites of the form itself (`governance/MOVED.tsv:16 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:fff30a97ec736e648f50c6176baad6313de457ce2fde588f14119a1294f16db3`).

**How I looked (Grep over `governance/`, which holds every moved file the scan reads):**
- Pinned cites whose path has a folder but does not start at a repository top folder:
  - first letter not that of any top folder: none;
  - 28 likely sub-folder names such as `src`, `src-tauri`, `e2e` and `tests`: only the 39 above;
  - `./` and `.github`-style starts: none.
- Every pinned bare file-name cite (400 hits): checked against the old and new folders. The only bare names that exist outside those folders are the root `KNOWN-LIMITATIONS.md`, `CLAUDE.md` and `CONTRIBUTING.md`; none exists in a sub-folder.
- Every other moved file shows no tier change.

## 3. The Change

- **Where the pre-move folder enters:**
  - Unpinned cites: unchanged (`scripts/plan/verify-cites.mjs:247-252 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:bed7a771c93c0effe5a5750ea1e47bd0fc7e30bc5838586dde04330709e96342`).
  - Pinned cites: at the pinned branch of `runVerifyCites` (`scripts/plan/verify-cites.mjs:436 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:8c25225fb168405a05d6949db0eb0ef4c63ae64922d7ad349341094fd1b1e61d`) and at the pin read's path list (`scripts/plan/verify-cites.mjs:451 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:9eeca008b594c91b1957da4fe651dddc44a2c0abff04c34c4712f0ff2aefe53d`). One unexported helper returns the union of two resolutions:
    - `resolveRef` from the pre-move path, `originPath(map, relPath)` (`scripts/plan/movedMap.mjs:77-85 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:5b082f88236c775780d1d83e1826b2b7b25c9f112d1b2fc6345be66a8125c76b`), listed first;
    - `resolveRef` from the current path.
  - No exported item is added.
- **Must not change:**
  - Cites written from the root are untouched, because `resolveRef` tries the path as written whatever the citing folder.
  - Files that never moved: `originPath` returns their path unchanged.
  - A pinned cite's own path takes no `resolveMoved` and no post-move check: `res.mapped` stays unset (`scripts/plan/verify-cites.mjs:437 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:dd52ae86fd940fa679620a917486fff08791b848a97178fe43dabcf0947e72c4`).
  - The archived prefixes, the rotating-ledger rule (`scripts/plan/verify-cites.mjs:445 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:3f4debb6fdc26e991dc09b8322438016ed8eeb6e36d83bdc9d0f0648cb09f180`), `checkPinned`, `resolveRef`, `resolveRefMapped`, the unpinned path, `movedMap.mjs` and `moved-map.mjs`.
- **Callers whose behaviour moves:**
  - `runVerifyCites` only, which means the command line: governance-ci's verify:cites step (`.github/workflows/governance-ci.yml:154-155` at 8e90c244fbf0cdd1175447a883f40f62d90fadd1, sha256 76484b6d6917d949226e9e45f9f5f2983b85bb2842747c8af660399317ab090c) and the pre-gate self-check.
  - `scripts/plan/rotate-decisions-pending.test.mjs:292 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:57b16666efd67fde018841b622981f6fd411f3ce467b617867552237097058b5` calls it with no map, so its behaviour does not change.
  - `verify-quotes.mjs` imports `resolveRefMapped` and other unchanged exports (`scripts/plan/verify-quotes.mjs:137 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:a28407640f2126e4b09f43b5a5e21096ecb076159134cecdbee88b83fb607954`), so it does not move. Neither do `verify-test-claims.mjs`, `verify.mjs` or `site.mjs`.
- **Comments to rewrite in the same files:** `scripts/plan/verify-cites.mjs:35-38 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:bfced9a7dcddd6b511ad87be8dd9fd3f17b5e2d38c3407d2bed86a37e1b32df5` (which says a pinned cite takes none of the move handling), `scripts/plan/verify-cites.mjs:85-90 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:62fcea75a7299fd6fec952bb2b900548af1738e7a47ca23cd63af3b8899a5bc4` and `scripts/plan/verify-cites.mjs:435 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:fbc10bae1eb289081ad689defc83630aea6ce8a6f3372b30694fa2b887d7254c`. The worker words them; they are Documentation.

## 4. Tests and mutations

**T-A** `verify-cites: a moved form's relative pinned cites resolve from its pre-move folder at the exact tier`
- It reads the real forms at 8e90c244fbf0cdd1175447a883f40f62d90fadd1 with `git show` from `REPO_ROOT`. CI clones the full history (`.github/workflows/governance-ci.yml:141-143` at 8e90c244fbf0cdd1175447a883f40f62d90fadd1, sha256 ba1c06d58816a3e8aaa67253ea5afcd40e857fc722d8460fc93ea994d4db9450).
- It takes the 41 cites with the product's own `extractCitations`:
  - EXPORT's pinned cites whose path starts with `src/` or `src-tauri/`;
  - the pinned `KNOWN-LIMITATIONS.md` cite of each of ITEM-40 and ITEM-41.
- It asserts the counts 39, 1 and 1 before building anything.
- It writes each cite as written into a fixture repository: the three forms at their old paths, and empty target files at their old-folder paths.
- It moves the forms in a moves-only commit, using `git mv` and `addCommit` (`scripts/plan/moved-map.mjs:105-115 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:0371254606939d52a38360a85416997b9b4b54b2f5b7b727dd7b8ebd3170805a`), then runs `runVerifyCites`.
- It asserts 41 gated findings, each at the form's new path with the reason that the pin's commit was not found, and none advisory.
- **At the base it fails:** 0 gated, 41 advisory.
- **Mutation M1, which drops the map:** the helper ignores `MOVED.tsv` and resolves from the current folder only. Predicted: T-A fails by name, on the gated count.

**T-B** `verify-cites: a pinned cite from a moved file to a file moved beside it stays at the exact tier`
- Same shape, using the 9 cites from section 2 at 8e90c244fbf0cdd1175447a883f40f62d90fadd1 (PRECEDENTS and AI_DEVELOPMENT moved to `governance/`, OWED-ROWS to `governance/forms/root/`).
- It asserts 9 gated. It passes at the base.
- **Mutation M2:** the helper resolves from the pre-move folder only. Predicted: T-B fails by name, with 9 advisory.

**Why the real forms are read at a pinned commit rather than written into the test:**
- All 41 pass against the real tree, so only a fixture where both the tree check and the pin fail can show which tier a cite took.
- Reading the bytes from the record at a fixed commit gives the real shape, keeps the test stable when the record grows, and saves about 50 lines of literals.

Notes beneath the form:
- **Rule (00):** the piece's paths are the five Scope files and this form. Each is disjoint from every in-flight branch:
  - `cut/port-2-macos-l1-and-app-dirs` touches `.github/workflows/product-ci-rust.yml`, `scripts/plan/cfg-boundary.mjs` and `scripts/plan/cfg-boundary.test.mjs`;
  - `cut/b2-piece-1c-save-and-reopen` and #280 touch nothing under `scripts/`, `governance/` or `.github/`.
  - The piece touches nothing under `protocol/`. Rule (00) is clear.
- **Gate:** a single combined reviewer (§21b). Section 1's reading of the F form's line on pinned citations is the reviewer's first check.

## 5. D1 and D2 (words and paths only)

**D1 replaces `governance/README.md:30 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:506460c7e47b3da0b63904baaba331924bab8e3a86b864ce718ddfb9560d65b2`** (my words, under OPEN-1 (A)):

`- A citation pinned to a revision (`path:line @ <rev>`) names the path as it was at that revision. `scripts/plan/verify-quotes.mjs` reads a pinned hash reference (`@ <rev> sha256:<hex>`) at that revision, and `scripts/plan/verify-test-claims.mjs` reads the pinned line of a superseded or withdrawn row there. `scripts/plan/verify-cites.mjs` reads a pinned cite there only when no file the current tree resolves its path to holds the line; it resolves the path as written, without `MOVED.tsv`'s old-to-new rows, from the citing file's folder and, for a moved citing file, from its folder before the move too.`

Each clause checked against the code:
- verify-quotes reads at the revision on both branches (`scripts/plan/verify-quotes.mjs:786 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:df3bbaa57f7a1f796777cbd9279d07415f9e6fe700b4c97b61eea3b4a17e1305`, `scripts/plan/verify-quotes.mjs:791 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:0836f8b79982bfb985d645b9302d3f514a096084608d817a8892471777246f97`).
- verify-test-claims reads at the revision (`scripts/plan/verify-test-claims.mjs:310-316 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:152ec8cced38587f1ce2b32e1916365d6e4ec8d0779a338966b438db47e1c262`).
- verify-cites reads the pin only after the tree check (`scripts/plan/verify-cites.mjs:442 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:035ed72b0051700c3966e2523603a8d3bf597c565d4008f04fbe441b2af9a73d` comes before `scripts/plan/verify-cites.mjs:449-456 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:be5c4b05c3a83f906f984664d4305812170a226efb9ffbdd3ad9591331839757`).
- "Without the old-to-new rows" and "both folders" are true after this Change.
- Under OPEN-1 (B), the last clause would read: from the citing file's folder before the move.
- Whose wording: by my reading not the human's, since §2.6 had piece F draft this file. I did not read the 2026-10-30 ruling's text, so the custodian confirms.

**D2(a) replaces `scripts/plan/README.md:57 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:ad1b3ff25de02e863e45254569a1cfea171c3a67ddde13d3b6109c1719c74cc1`** (my words):

``governance/PLAN.yaml`, a path read from the working directory, so run it from the repo root).`

- Checked: the default is `scripts/plan/plan.mjs:295 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:4c16a9628e5635c5393ea3cd94930b42e45565c0e094d368443e5a4d9fb4aa9a`, and the read is relative to the working directory at `scripts/plan/plan.mjs:53 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:26a8e85b56dd250f917bc3842f1bc8ced067c2f224a4474b56e4112b19e3e197`.
- `:62` stays: it is still true (`scripts/plan/queue.mjs:263 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:3f723fea630ea926b70b736a0092c9c3e969c12957e777579c1f78a74f92ae72`).

**D2(b) replaces `scripts/hooks/README.md:164-165 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:bd62f6ad77609f37f7a379928d5cc55efaaa40b27ba6b3621aa2e8f9e143ad51` with three lines** (my words):

```
`governance/DECISIONS-PENDING.md`, `state/directives/`, `governance/PRECEDENTS.md`, then
`governance/AUTONOMY.md` and `governance/AI_DEVELOPMENT.md`), then `state/CUT-STATE.md`'s
`## SESSION-CONTINUITY` block **verbatim**
```

- Checked against what the hook prints: `scripts/hooks/session-resume.mjs:31-34 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:cd44d0cc0b758689696f7a99e934b0ecf815d0ce54dde22bfdc5ae01ebd3bc01`.
- Line 166 continues unchanged.

## OPEN items

None is a red line by my reading.

- **OPEN-1, how a pinned cite resolves:**
  - (A) the union of the pre-move folder and the current folder. This keeps all 50 cites from section 2 at the exact tier.
  - (B) the pre-move folder only, the review's fix. It demotes the 9 sibling cites.
  - (C) pinned cites go through `resolveRefMapped` without the post-move check. This maps the cite's own path, against §2.3 (`governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:373 @ 8e90c244fbf0cdd1175447a883f40f62d90fadd1 sha256:0a09c0dbc54aeb522433ce35a714b56d51587f3e9f58b3311a4e26e32d6be8ae`), and at this main it fixes nothing that (A) leaves.
  - Recommendation: (A).
- **OPEN-2, the count:** the ruling's "41 cites of EXPORT" are, by my reading, 39 in EXPORT and 2 in ITEM-40 and ITEM-41.
  - (A) T-A covers all 41, and the form records where they sit as a reading.
  - (B) T-A covers EXPORT's 39 only.
  - (C) Hold for the human.
  - Recommendation: (A). If the worker's count at the base differs from 39, 1 and 1, the piece stops.
- **OPEN-3, where the test's cites come from:**
  - (A) the real forms read at 8e90c244fbf0cdd1175447a883f40f62d90fadd1, fed into a fixture.
  - (B) the cites copied byte for byte into the test as literals; this costs about 50 more lines.
  - (C) the real tree directly; this cannot tell the tiers apart, because all 41 pass.
  - Recommendation: (A).
- **OPEN-4, T-B:** (A) include it; (B) drop it. It goes with OPEN-1 (A). Recommendation: (A).

## What I could not settle

- No sha256 hashes: I have no shell. The custodian's script computes them for every cite above.
- Whether any of the 41 fails today in the tree or at its pin. This is not run. The review's reading is that all pass, and the base and head verify:cites comparison in the Tests line is the check.
- That each cite has exactly one suffix candidate is checked only by Glob over the working tree.
- Whether `governance/README.md:30` is the human's wording; see D1.
- The worker words the comments in `scripts/plan/verify-cites.mjs` (Documentation).

## The custodian's settlement (class 1, before any code)

- **OPEN-1 (A), OPEN-2 (A), OPEN-3 (A) and OPEN-4 (A)** are not red lines and are taken on the drafting agent's recommendation on 2026-11-05, under the human's direction of 2026-10-31 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4), which the direction of 2026-11-03 keeps (`state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`); the human reviews each on return and may reverse it, a reversal recorded, not edited. Under OPEN-2 (A) the ruling's 41 are read as section 2 finds them, 39 in the EXPORT form and 1 each in ITEM-40's and ITEM-41's: every EXPORT cite the ruling names is in the test, and the count is the ruling's.
- **Section 2's counts, checked by the custodian's script** at main 93187222 (the product's own `extractCitations`, `classifyPath`, `resolveRef` and `originPath`, over every file the scan reads whose `originPath` differs from its path: 185 files, 5066 pinned cites): 41 resolve only by suffix from the folder now and exactly from the folder before the move (39, 1 and 1 in the three forms section 2 names); 9 resolve exactly from the folder now and not from the folder before (7 in governance/PRECEDENTS.md, 2 in governance/forms/root/KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md); the other 5016 take the same tier from both. Only the counts are filed. So OPEN-1 (A) moves exactly the 41 and keeps the 9.
- **The F form's line on pinned citations** (section 1's risk): the human's ruling of 2026-11-05 directs this change by name, so the custodian reads that line as the draft does, as binding a pinned cite's own path. A reviewer reading it otherwise is a stop for the human, not a change of route by the custodian.
- **D1's line is not the human's wording:** `governance/README.md` line 30 was written in piece F's paths commit 494cea7b, under §2.6 of F's form, which has piece F draft that file; the human's ruling of 2026-10-30 approved #270's README.md words, not this file's.
- **The reuse index** (from the drafting brief, byte for byte; both queries miss, a miss noted):

```text
$ node tools/reuse.mjs moved map relative cite resolve   (exit 1)
No prior art recorded for "moved map relative cite resolve". Research it before planning an implementation.
$ node tools/reuse.mjs pinned citation old folder   (exit 1)
No prior art recorded for "pinned citation old folder". Research it before planning an implementation.
```

- **Rule (00)** was checked at main 93187222 by `git diff --name-only origin/main...<branch>` over the open PR (#280) and the branches of the PLAN nodes in progress (`cut/b1-shell-half-pr-c`, `cut/open-dataset-close-serialised-under-the-catalog-lock`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b2-piece-1c-save-and-reopen`): none touches the five Scope files or this form, and the piece touches nothing under `protocol/`. It is checked again at dispatch.
- **The gate:** the reviewer alone (§21b), as drafted; its first check is section 1's reading.
- **Not settled by the draft, and proven by the piece's own runs:** the tests, the mutations, the size and the base and head scan comparison.

## Amendments (opens empty; append-only)
