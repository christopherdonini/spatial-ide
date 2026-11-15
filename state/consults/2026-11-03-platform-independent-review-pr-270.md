*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/INDEPENDENT-REVIEW-PR-270-2026-11-03.md` (9183 bytes, sha256 220bbcbdb55c5bc7ed60bddc7c25b481c788b436774f985b2825653b3a4a303b), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_011WNxdUYZLME72zhjDMxdVn, agent spatial-ide-indipendent-reviewer-agent (claude-fable-5-1, effort high), US$ 11.25, about 1020 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It reviewed commit e94065142e234ee10301ae578c57719ef956b4f3 (the merged PR's tip, its own first lines say), main being at 652752afa9bedb0172948869c9ab7f0b8ee08dd3 when the runs started (INDEX.md); from it to main at ae55d424, 16 product, docs or KNOWN-LIMITATIONS files changed (by git diff --name-only), so its readings of those files are read again before any node rests on them. No cloud filing answers the same question. By the human's ruling of 2026-11-05 (item 2), C1 (a moved form's relative pinned cites fall to the suffix tier) is S3 and the governance lane's next piece, on a five-line form: PLAN node `verify-cites-moved-file-relative-pinned-cites`. D1 and D2 ride in the same piece, words and paths only.*

---

# Independent review of merged #270 (piece F), 2026-11-03

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-indipendent-reviewer-agent`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (see first line). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_011WNxdUYZLME72zhjDMxdVn) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 1020 s active, US$ 11.25. Nothing below this line is edited.

---

I'll start by cloning the repository and fetching the pull request.

-----

Now the reviewer checklist and project rules.

-----

Now let me verify the move commit M (a8ae51d9) is renames-only.

-----

M matches the form's table plus the two Amendment-1 delta rows. Now the full diff from the merge base to the tip.

-----

**Repository:** christopherdonini/spatial-ide — **PR #270** — **commit reviewed:** e9406514 (tip of `pull/270/head`; merged by 578ec704) — **merge base:** 5b61a2e6 (the merge commit's first parent).

Scope read: the form on origin/main (`governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md`, Amendment 7 first), the four directives it cites, `.claude/agents/reviewer.md`, CLAUDE.md, the full diff 5b61a2e6..e9406514, every changed script in full, and the consumers of each touched interface (verify-quotes ← verify-cites; verify/site/verify-test-claims ← movedMap; moved-map ← forms-layout; governance-ci; pages; the Guardian's G3; citationIntegrity).

## Correctness

**C1. Pinned relative cites from a moved citing file are resolved against the file's new folder, not its pre-move folder, so they drop from the exact tier to the suffix tier in verify-cites.**
Where: `scripts/plan/verify-cites.mjs:422` passes `map` as `undefined` for a pinned cite; `:244` then calls `resolveRef(pathRaw, citingRel, …)` with `citingRel` = the current (moved) path; `:437` repeats `resolveRef(cite.pathRaw, relPath, …)` for the pin read. `originPath(map, …)` (which verify-quotes' hash-ref path does use, via `resolveRefMapped` `:247`) is never applied to a pinned cite.
What the form says: §2.3 "A moved citing file always resolves its relative cites against its old folder" and "Pinned citations are unchanged"; §8 item 15 blocks "a pinned citation whose resolution changed".
Concrete case: `governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md` carries 41 cites of the form `src/App.tsx:N @ 2ca3a53c` (lines 64-71, 134, 396-405, 432, 447-455, 464, 477, 483, 497). Before the move (file at `frontends/shell/`), `rel = frontends/shell/src/App.tsx` was an exact match. After it, `rel = governance/forms/frontends/src/App.tsx` misses, and the cite resolves only by basename suffix. For a wrong cite (e.g. `src/App.tsx:9999 @ 2ca3a53c`) the outcome changes from `oob-exact → checkPinned fails → gated` (`:449`) to `oob-suffix → checkPinned fails → advisory` (`:451`). Any relative pinned cite appended to a moved form from now on gets the loose tier too. I checked every pinned cite in every moved form: 41 change tier (all in that one file), each with exactly one suffix candidate, and all 41 pass either way, so §5's gated/advisory-set equality at P vs C2 still holds; what changed is the tier and therefore the gate's strength. Confirmed by reading. Fix is local: use `originPath(map, relPath)` as the citing path at `:244`'s caller for the pinned case and at `:437`.

## Evidence

None blocking. Checked: every new test's named mutation against the code (T2–T7, T8–T9, T10–T11, T12–T12c, T13, T14, T15, T16, T18–T19 each fail under their mutation by my reading). Note on T1 (verify-cites.test.mjs, "an unpinned old-path cite written before the move resolves to the new path at HEAD"): it also passes with the map lookup dropped entirely, because the suffix tier resolves `a/X-PREREGISTRATION.md` to `governance/forms/a/X-PREREGISTRATION.md` and line 4 is in range; only T2 discriminates the map from the suffix tier. T1's recorded mutation is artificial. Not blocking, since T2 covers it.

## Documentation (must-fix before merge under the proportional-gates rule; none changes code)

**D1.** `governance/README.md:30`: "A citation pinned to a revision (`path:line @ <rev>`) names the path as it was at that revision and is read there." For verify-cites this is not what the code does: a pinned cite is read at its pin only when the current tree does not already satisfy the line (`verify-cites.mjs:424` `if (res.status === 'ok') continue;` precedes the pin read at `:437`). True for verify-quotes hash refs and verify-test-claims. Confirmed by reading.

**D2.** `scripts/plan/README.md:57` ("defaults to `PLAN.yaml` at the repo root") and `:62` (queue "next to the plan file by default" is still true, but `scripts/hooks/README.md:164-165` lists the reading order with root names). Now false; these files were outside §2.2's table under OPEN-7 (A), so leaving them is per the ruling — recording it so a follow-up carries it.

## Notes

- **M is renames only**: `git diff --name-status -M100% a8ae51d9^ a8ae51d9` gives 188 `R100` lines and nothing else; blob id and basename equal on every row; the blob multisets of the two trees are identical; no row enters or leaves `docs/`; every new path is under `governance/` or is `scripts/run-cold-open.ps1`. The 188 rows equal §2.1's table plus Amendment 1's two delta rows (this form; `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md`). Root entries 59 → 32; forms outside `governance/forms/` and `state/`: the two `docs/` files.
- **MOVED.tsv** at e9406514 is byte-identical to its regeneration from a8ae51d9 (header, LF, sorted by old path, 188 rows, one commit).
- **PLAN.yaml** differs from the base only in 160 `gate:` lines; no gate still names an old path; every gate path exists at the tip. **The final merge** introduces content differing from both parents only in the two queue files, PLAN.yaml, site/, and three records that are byte-identical to main's blobs at their old paths (DECISIONS-PENDING.md, the F form, the KERNEL-CLOSE form).
- **§7**: with the form's exclusions (plus `state/` and the generated files' old root paths) the diff is 46 files, 1,555 lines — matches Amendment 7, within 48/1,600.
- **Block-on-sight 8**: no added line in C2 carries an unpinned old-path `path:line` cite (checked by script over the diff's added lines against the 188 old paths). **Item 9**: the agent-definition edits are 13 backticked path tokens, none inside a quoted span. **Item 14**: both append-never lists unchanged (legacy-bound list's 11 citing paths all stay; 27 baseline `file` keys are old paths, matched through the map). **Item 17**: `EXTRA_HASH_SCAN_FILES` maps to `governance/AI_DEVELOPMENT.md`, which is tracked.
- **Tooling paths**: no remaining string literal to a moved file in scripts/, hooks/, .githooks/, .claude/settings.json, workflows' `paths:`/`run:` lines, Guardian hooks, or product code (comments and generated labels excepted, per OPEN-7). `pages.yml` needs no change (site.mjs/health.mjs/verify.mjs/buildHealth.mjs all default to `REPO_ROOT/site`). G3 is location-independent (`register.js:527,563-571`).
- **README**: every "What works today" clause traces to a Part M row and its verdict in RELEASE-0.1 Amendments 15/16/18 (M4 EPSG:2056 fixture; M5/M14 `id < 100` and Zoom to layer; M6 fill/opacity/outline; hover row; M8/M9 typed final path component, whole dataset and current view, filter not carried — Amendment 21; M11 served over HTTP, KNOWN-LIMITATIONS 12). The human's repaired parenthesis matches the ruling's words. Install, First five minutes, Local-first and License bytes unchanged. The map section's folder descriptions match the tree.
- `measure-reads.mjs routine <rev>` now reads `governance/DECISIONS-PENDING.md` only, so it can no longer measure a pre-move rev (OPEN-2 (A) allowed the path-only edit; recording the consequence).
- `moved-map.mjs plan` keeps the exact two-path `ALLOWED_DOCS_FORMS` while `forms-layout.mjs` allows all of `docs/experiments/` (Amendment 6 says `moved-map.mjs` is not edited); a future `docs/experiments/*-PREREGISTRATION.md` would be a "problem" for `plan` but pass the layout check. By design today; a divergence to keep in view.
- `site.mjs:109` loads the map from `REPO_ROOT` on every evidence link rather than once per render; harmless.

**What I would run** (cannot here): `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` at e9406514; `node scripts/plan/verify-cites.mjs` at 5b61a2e6 and at e9406514 and diff the gated/advisory sets after mapping (the §5 proof, and the only run that would show whether any pinned relative cite's verdict differs — my reading says none does); for C1, add `src/App.tsx:99999 @ 2ca3a53c` to the EXPORT form on a scratch branch and confirm it lands in `advisory`, then apply the `originPath` fix and confirm it lands in `gated`.

-----

