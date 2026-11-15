*Custodian's filing note (2026-11-05): the governance lane's form for `verify-cites-moved-file-relative-pinned-cites` (the #270 review's C1, with its D1 and D2), drafted by the architect, read only at main 8e90c244. The run 15:22:27Z to 15:34:09Z by its transcript (Glob 5, Grep 29, Read 30, each call counted once by its id; no Write, Edit or Bash). Its section 2 counts were checked by the custodian's script at main 93187222 (the form's settlement). Its OPEN-1 to OPEN-4 are not red lines and take its recommendation under the human's direction of 2026-10-31, item 4, which the direction of 2026-11-03 keeps. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 12ad75a9616ccef7a13687f973d5b32ad1ab4986ff2b5b5cd8b9c016d6daf844.*

---

Draft: verify-cites-moved-file-relative-pinned-cites five-line form, architect

Read at main 8e90c244fbf0cdd1175447a883f40f62d90fadd1. I have no shell, so I give no sha256 hashes. The custodian's script adds them to every `path:line @ 8e90c244` cite below before the form is committed. All drafted text is my own wording unless it is marked otherwise. Nothing in this report is quoted.

## 1. Route: the five-line form stays open

- **§21a (`governance/AUTONOMY.md:315-332 @ 8e90c244`): no existing test assertion changes.**
  - T6, at `scripts/plan/verify-cites.test.mjs:698-707 @ 8e90c244`, uses a pinned cite from `rec.md`, which never moved. `originPath` returns that path unchanged, so the result is the same.
  - T7, at `scripts/plan/verify-cites.test.mjs:709-717 @ 8e90c244`, is unpinned and unchanged.
  - Every other pinned test builds its fixture with `gitTree`, `pinnedRepo`, `pinnedAfter` or `ledgerRepo`. None of those writes `governance/MOVED.tsv`, so the map is empty and nothing changes. The same holds for `scripts/plan/rotate-decisions-pending.test.mjs:292 @ 8e90c244`.
  - T6's tested property is kept: a pinned cite's own path takes no old-to-new mapping and no post-move check (F form, `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:372-373 @ 8e90c244` and `:415 @ 8e90c244`).
  - The change carries out §2.3's line that a moved citing file always resolves its relative cites from its old folder (`:364 @ 8e90c244`), and §8 item 15 (`:506 @ 8e90c244`).
- **§21c (`governance/AUTONOMY.md:347-357 @ 8e90c244`): within bounds.** The piece touches 5 files, about 130 changed lines, and adds no dependency, no exposure surface and no user-visible behaviour.
- **Risk for the single reviewer to check first:** the F form's line that pinned citations are unchanged (`:372 @ 8e90c244`). My reading is that it binds the cite's own path, not the citing file's folder. If the reviewer reads it otherwise, the piece leaves the single-gate route under §21b.

## 2. C1 at this main, re-derived by reading

The review's own line numbers apply to its commit, e9406514. At 8e90c244 the pinned branch is at these lines of `scripts/plan/verify-cites.mjs`:
- `:435-436 @ 8e90c244` passes no map for a pinned cite.
- `resolveRefMapped` therefore falls to `resolveRef` from the citing file's current path (`:248 @ 8e90c244`).
- The pin read re-resolves from the current path (`:451-452 @ 8e90c244`).
- A failing cite is gated if it resolved exactly (`:462-463 @ 8e90c244`) and advisory if it resolved only by suffix (`:464-465 @ 8e90c244`).

Unpinned cites already use the pre-move folder, at `:251 @ 8e90c244` and `scripts/plan/movedMap.mjs:97 @ 8e90c244`.

**Cites that fall from the exact tier to the suffix tier today: 41, all of them.** That count matches the ruling's, but they are not all in the EXPORT form:
- **39 in the EXPORT form.** They are the relative pinned cites at `@ 2ca3a53c` in Amendment 3's table, in `governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md`. Their lines are 396-401, 404-416, 418, 421-423, 425, 427-433, 435-436 and 439-444, one cite per line (`:396-444 @ 8e90c244`).
  - From the folder they sit in now (`governance/forms/frontends/`), nothing resolves exactly. Each resolves by suffix to `frontends/shell/<path>`.
  - From their pre-move folder (`frontends/shell/`, `governance/MOVED.tsv:66 @ 8e90c244`), each resolves exactly. All 10 target files exist under `frontends/shell/`.
- **1 each in two root forms that moved:**
  - `governance/forms/root/KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md:6 @ 8e90c244`
  - `governance/forms/root/KNOWN-LIMITATIONS-ITEM-41-SOURCE-COMMENT-PREREGISTRATION.md:6 @ 8e90c244`
  - Each has one pinned bare `KNOWN-LIMITATIONS.md` cite. From the pre-move folder (the repository root, `governance/MOVED.tsv:11-12 @ 8e90c244`) it resolves exactly to the root file. Today it resolves only by suffix.
- **The review's line list does not match its count.** It says all 41 are in the EXPORT form, but the lines it lists (64-71, 134, 396-405, ...) are the lines that carry `App.tsx` cites, the full-path ones included.

**Cites the review's suggested fix (pre-move folder only) would demote: 9.** These sit in moved files and cite a file that moved beside them, so today they resolve exactly from the new folder:
- `governance/PRECEDENTS.md:27,42,57,70,84,97,111 @ 8e90c244`: seven pinned `AI_DEVELOPMENT.md` cites. Both files moved from the root to `governance/` (`governance/MOVED.tsv:2 @ 8e90c244`, `:23 @ 8e90c244`).
- `governance/forms/root/KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md:27-28 @ 8e90c244`: two pinned cites of the form itself (`governance/MOVED.tsv:16 @ 8e90c244`).

**How I looked (Grep over `governance/`, which holds every moved file the scan reads):**
- Pinned cites whose path has a folder but does not start at a repository top folder:
  - first letter not that of any top folder: none;
  - 28 likely sub-folder names such as `src`, `src-tauri`, `e2e` and `tests`: only the 39 above;
  - `./` and `.github`-style starts: none.
- Every pinned bare file-name cite (400 hits): checked against the old and new folders. The only bare names that exist outside those folders are the root `KNOWN-LIMITATIONS.md`, `CLAUDE.md` and `CONTRIBUTING.md`; none exists in a sub-folder.
- Every other moved file shows no tier change.

## 3. The Change

- **Where the pre-move folder enters:**
  - Unpinned cites: unchanged (`scripts/plan/verify-cites.mjs:247-252 @ 8e90c244`).
  - Pinned cites: at the pinned branch of `runVerifyCites` (`:436 @ 8e90c244`) and at the pin read's path list (`:451 @ 8e90c244`). One unexported helper returns the union of two resolutions:
    - `resolveRef` from the pre-move path, `originPath(map, relPath)` (`scripts/plan/movedMap.mjs:77-85 @ 8e90c244`), listed first;
    - `resolveRef` from the current path.
  - No exported item is added.
- **Must not change:**
  - Cites written from the root are untouched, because `resolveRef` tries the path as written whatever the citing folder.
  - Files that never moved: `originPath` returns their path unchanged.
  - A pinned cite's own path takes no `resolveMoved` and no post-move check: `res.mapped` stays unset (`:437 @ 8e90c244`).
  - The archived prefixes, the rotating-ledger rule (`:445 @ 8e90c244`), `checkPinned`, `resolveRef`, `resolveRefMapped`, the unpinned path, `movedMap.mjs` and `moved-map.mjs`.
- **Callers whose behaviour moves:**
  - `runVerifyCites` only, which means the command line: governance-ci's verify:cites step (`.github/workflows/governance-ci.yml:154-155 @ 8e90c244`) and the pre-gate self-check.
  - `scripts/plan/rotate-decisions-pending.test.mjs:292 @ 8e90c244` calls it with no map, so its behaviour does not change.
  - `verify-quotes.mjs` imports `resolveRefMapped` and other unchanged exports (`scripts/plan/verify-quotes.mjs:137 @ 8e90c244`), so it does not move. Neither do `verify-test-claims.mjs`, `verify.mjs` or `site.mjs`.
- **Comments to rewrite in the same files:** `scripts/plan/verify-cites.mjs:35-38 @ 8e90c244` (which says a pinned cite takes none of the move handling), `:85-90 @ 8e90c244` and `:435 @ 8e90c244`. The worker words them; they are Documentation.

## 4. Tests and mutations

**T-A** `verify-cites: a moved form's relative pinned cites resolve from its pre-move folder at the exact tier`
- It reads the real forms at 8e90c244fbf0cdd1175447a883f40f62d90fadd1 with `git show` from `REPO_ROOT`. CI clones the full history (`.github/workflows/governance-ci.yml:141-143 @ 8e90c244`).
- It takes the 41 cites with the product's own `extractCitations`:
  - EXPORT's pinned cites whose path starts with `src/` or `src-tauri/`;
  - the pinned `KNOWN-LIMITATIONS.md` cite of each of ITEM-40 and ITEM-41.
- It asserts the counts 39, 1 and 1 before building anything.
- It writes each cite as written into a fixture repository: the three forms at their old paths, and empty target files at their old-folder paths.
- It moves the forms in a moves-only commit, using `git mv` and `addCommit` (`scripts/plan/moved-map.mjs:105-115 @ 8e90c244`), then runs `runVerifyCites`.
- It asserts 41 gated findings, each at the form's new path with the reason that the pin's commit was not found, and none advisory.
- **At the base it fails:** 0 gated, 41 advisory.
- **Mutation M1, which drops the map:** the helper ignores `MOVED.tsv` and resolves from the current folder only. Predicted: T-A fails by name, on the gated count.

**T-B** `verify-cites: a pinned cite from a moved file to a file moved beside it stays at the exact tier`
- Same shape, using the 9 cites from section 2 at 8e90c244 (PRECEDENTS and AI_DEVELOPMENT moved to `governance/`, OWED-ROWS to `governance/forms/root/`).
- It asserts 9 gated. It passes at the base.
- **Mutation M2:** the helper resolves from the pre-move folder only. Predicted: T-B fails by name, with 9 advisory.

**Why the real forms are read at a pinned commit rather than written into the test:**
- All 41 pass against the real tree, so only a fixture where both the tree check and the pin fail can show which tier a cite took.
- Reading the bytes from the record at a fixed commit gives the real shape, keeps the test stable when the record grows, and saves about 50 lines of literals.

## The draft form

`governance/forms/scripts/VERIFY-CITES-MOVED-FILE-RELATIVE-PINNED-CITES-PREREGISTRATION.md`

```
Authority: PLAN node verify-cites-moved-file-relative-pinned-cites (governance/PLAN.yaml:6201-6217 @ 8e90c244); the human's ruling of 2026-11-05, item 2, first sentence (state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:9 @ 8e90c244); the finding C1 with D1 and D2, a reading and not Authority (state/consults/2026-11-03-platform-independent-review-pr-270.md:33-36 @ 8e90c244, :44 @ 8e90c244, :46 @ 8e90c244); piece F's form §2.3 and §8 item 15 (governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:364 @ 8e90c244, :372-373 @ 8e90c244, :506 @ 8e90c244). Reuse index (tools/reuse.mjs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c): a miss for both queries, noted; it does not block.
Scope: scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs, governance/README.md, scripts/plan/README.md, scripts/hooks/README.md (5 files); declared budget 130 changed lines, insertions plus deletions, tests and comments counted (§21c), this form excluded.
Change: In runVerifyCites, a pinned cite's tree resolution and the path list its pin is read at take the candidates of its path resolved from the citing file's folder before its first move (originPath through governance/MOVED.tsv) and from its folder now, so a moved file's relative pinned cites keep the exact tier they had before the move, while a pinned cite's own path still takes no old-to-new mapping and no post-move check, an unmoved citing file resolves as today, and resolveRef, resolveRefMapped, checkCitation's unpinned path, checkPinned and movedMap.mjs are unchanged; D1's and D2's words land with it.
Tests+mutation: T-A `verify-cites: a moved form's relative pinned cites resolve from its pre-move folder at the exact tier` (the 41 cites read at 8e90c244fbf0cdd1175447a883f40f62d90fadd1: 39 in governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md, 1 each in governance/forms/root/KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md and governance/forms/root/KNOWN-LIMITATIONS-ITEM-41-SOURCE-COMMENT-PREREGISTRATION.md; a fixture with a moves-only commit; 41 gated, none advisory; fails at the base), mutation M1, the map dropped (current folder only): T-A fails by name; T-B `verify-cites: a pinned cite from a moved file to a file moved beside it stays at the exact tier` (the 9 cites of governance/PRECEDENTS.md and governance/forms/root/KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md at the same commit; 9 gated), mutation M2, the pre-move folder only: T-B fails by name; each mutation observed by applying it, running the test, recording its failure by name with its commit, and reverting; every existing test keeps its name and passes; node scripts/plan/verify-cites.mjs on the real tree at base and head: exit 0, the gated and advisory sets and the scanned count equal (a difference stops the piece).
Out-of-scope: ADR: none. Security posture: none. Wire (SKP, MCP): none. Stated guarantee or invariant: none; no existing test's assertion changes (T6 and T7 keep theirs; no other pinned test's fixture has a MOVED.tsv), and a pinned cite's own path keeps §2.3's no map and no post-move check.
```

Notes beneath the form:
- **Rule (00):** the piece's paths are the five Scope files and this form. Each is disjoint from every in-flight branch:
  - `cut/port-2-macos-l1-and-app-dirs` touches `.github/workflows/product-ci-rust.yml`, `scripts/plan/cfg-boundary.mjs` and `scripts/plan/cfg-boundary.test.mjs`;
  - `cut/b2-piece-1c-save-and-reopen` and #280 touch nothing under `scripts/`, `governance/` or `.github/`.
  - The piece touches nothing under `protocol/`. Rule (00) is clear.
- **Gate:** a single combined reviewer (§21b). Section 1's reading of the F form's line on pinned citations is the reviewer's first check.

## 5. D1 and D2 (words and paths only)

**D1 replaces `governance/README.md:30 @ 8e90c244`** (my words, under OPEN-1 (A)):

`- A citation pinned to a revision (`path:line @ <rev>`) names the path as it was at that revision. `scripts/plan/verify-quotes.mjs` reads a pinned hash reference (`@ <rev> sha256:<hex>`) at that revision, and `scripts/plan/verify-test-claims.mjs` reads the pinned line of a superseded or withdrawn row there. `scripts/plan/verify-cites.mjs` reads a pinned cite there only when no file the current tree resolves its path to holds the line; it resolves the path as written, without `MOVED.tsv`'s old-to-new rows, from the citing file's folder and, for a moved citing file, from its folder before the move too.`

Each clause checked against the code:
- verify-quotes reads at the revision on both branches (`scripts/plan/verify-quotes.mjs:786 @ 8e90c244`, `:791 @ 8e90c244`).
- verify-test-claims reads at the revision (`scripts/plan/verify-test-claims.mjs:310-316 @ 8e90c244`).
- verify-cites reads the pin only after the tree check (`scripts/plan/verify-cites.mjs:442 @ 8e90c244` comes before `:449-456 @ 8e90c244`).
- "Without the old-to-new rows" and "both folders" are true after this Change.
- Under OPEN-1 (B), the last clause would read: from the citing file's folder before the move.
- Whose wording: by my reading not the human's, since §2.6 had piece F draft this file. I did not read the 2026-10-30 ruling's text, so the custodian confirms.

**D2(a) replaces `scripts/plan/README.md:57 @ 8e90c244`** (my words):

``governance/PLAN.yaml`, a path read from the working directory, so run it from the repo root).`

- Checked: the default is `scripts/plan/plan.mjs:295 @ 8e90c244`, and the read is relative to the working directory at `:53 @ 8e90c244`.
- `:62` stays: it is still true (`scripts/plan/queue.mjs:263 @ 8e90c244`).

**D2(b) replaces `scripts/hooks/README.md:164-165 @ 8e90c244` with three lines** (my words):

```
`governance/DECISIONS-PENDING.md`, `state/directives/`, `governance/PRECEDENTS.md`, then
`governance/AUTONOMY.md` and `governance/AI_DEVELOPMENT.md`), then `state/CUT-STATE.md`'s
`## SESSION-CONTINUITY` block **verbatim**
```

- Checked against what the hook prints: `scripts/hooks/session-resume.mjs:31-34 @ 8e90c244`.
- Line 166 continues unchanged.

## OPEN items

None is a red line by my reading.

- **OPEN-1, how a pinned cite resolves:**
  - (A) the union of the pre-move folder and the current folder. This keeps all 50 cites from section 2 at the exact tier.
  - (B) the pre-move folder only, the review's fix. It demotes the 9 sibling cites.
  - (C) pinned cites go through `resolveRefMapped` without the post-move check. This maps the cite's own path, against §2.3 (`:373 @ 8e90c244`), and at this main it fixes nothing that (A) leaves.
  - Recommendation: (A).
- **OPEN-2, the count:** the ruling's "41 cites of EXPORT" are, by my reading, 39 in EXPORT and 2 in ITEM-40 and ITEM-41.
  - (A) T-A covers all 41, and the form records where they sit as a reading.
  - (B) T-A covers EXPORT's 39 only.
  - (C) Hold for the human.
  - Recommendation: (A). If the worker's count at the base differs from 39, 1 and 1, the piece stops.
- **OPEN-3, where the test's cites come from:**
  - (A) the real forms read at 8e90c244, fed into a fixture.
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
