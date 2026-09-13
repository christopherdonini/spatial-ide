# CUT-STATE — ADR-009 pre-public checklist pass (2026-08-18)

**Untracked** (custodian rule 10). Named `CUT-STATE-adr009-checklist.md` rather than the piece's
literal instruction (`CUT-STATE.md`) because that filename was live for a different, unrelated,
not-yet-closed cut (the at-scale hero-slice validation, `NEXT-CUT.md` + its own `CUT-STATE.md`)
when this piece started, and the working tree showed concurrent churn on those exact filenames
*during* this piece's run (`CUT-STATE.md`/`NEXT-CUT.md` were deleted, `PART-H-QUEUED.md` appeared,
all mid-session, no new commit on `main`) — consistent with a concurrent custodian process closing
that cut out while this piece ran. Overwriting `CUT-STATE.md` would have raced that process. Not
mine to touch; not touched. This file uses the archive's own established naming precedent
(`CUT-STATE-import-layout.md`, `CUT-STATE-sqlfilter-panels-publish.md`) instead.

**Piece scope:** execute ADR-009's pre-public checklist as far as custodian authority reaches,
branch `main`, custodian-delegated worker piece. **Not touched:** `DECISIONS-PENDING.md` (drafts
only, below, for the custodian to apply); any ADR status; the going-public decision itself.

---

## The checklist, verbatim (ADR-009, "Pre-public checklist — gates the repository becoming public")

1. `LICENSE` (AGPL-3.0-or-later) at root; per-crate/per-package license declarations and SPDX
   headers; Apache-2.0 and CC-BY-4.0 texts where those layers live.
2. DCO 1.1 text, `CONTRIBUTING.md` sign-off requirement, and a CI check enforcing `Signed-off-by`
   on external commits.
3. The ADR-017 corrigendum for bundle license notice + corresponding-source route, implemented in
   the writer and strict reader together.
4. **Dependency-license audit** of the full tree (cargo + npm), recorded in the repo. Nothing in
   the current stack is expected to conflict (permissive throughout), but expected is not audited.
5. Project-name collision check; trademark policy stub in docs/14.
6. History review before flipping public: the repository's full history goes with it — confirm no
   credentials, no personal data, no third-party material without rights (measurement artifacts,
   fixtures) anywhere in history.

**Finding walking in:** this checklist was already worked almost to completion once, 2026-08-07,
by an earlier custodian pass (`PRE-PUBLIC-CHECKLIST.md`, `LICENSES/README.md`,
`DEPENDENCY-LICENSES.md`, `DCO`, `CONTRIBUTING.md`, `docs/14`'s trademark stub — all already exist
and are committed). That pass predates the 2026-08-09 red-line rule that reserves "anything
ADR-009-adjacent" for the human — it is not this piece's to re-litigate, only to verify, extend to
the 11 days / 147 commits of drift since, and correct where its own written record had gone stale.

---

## Classification table

| # | Item | Class | Status / citation |
|---|---|---|---|
| 1 | LICENSE + per-package + SPDX headers + Apache-2.0/CC-BY-4.0 texts | **DONE-ALREADY** (verified + extended) | `LICENSE` (AGPL-3.0-or-later, root), `docs/LICENSE` (CC-BY-4.0), `LICENSES/{AGPL-3.0-or-later,CC-BY-4.0,Apache-2.0}.txt` all present, hash-checked this pass (see below) — genuine texts, not fabricated. `license` declared on all 6 crates (`Cargo.toml` workspace members) + npm packages. **MECHANICAL gap found and fixed**: `frontends/shell/**` (83 TS/TSX/MJS/HTML/CSS files) and `frontends/shell/src-tauri/build.rs` had no SPDX headers — that module postdates the 2026-08-07 147-file sweep. All 84 now carry the established header (see "Mechanical fixes" below). Full-tree re-scan after the fix: **zero** `.rs`/`.ts`/`.tsx`/`.mjs`/`.js`/`.html`/`.css`/`.ps1` tracked files missing a header. |
| 2 | DCO 1.1 text, `CONTRIBUTING.md`, sign-off CI | **DONE-ALREADY** (verified, evidence refreshed) | `DCO` re-diffed against live `https://developercertificate.org/` this pass — byte-identical. `.github/workflows/dco.yml` present; `gh run list` shows it green on recent PRs. All three product CI workflows (`product-ci-rust.yml`, `product-ci-shell.yml`, `product-ci-viewer.yml`) green on both `push` and `pull_request` as of 2026-08-17 (`gh run list`), closing the "viewer workflow never ran on `pull_request`" gap `CONTRIBUTING.md` still claimed open — **fixed** (see below). |
| 3 | ADR-017 corrigendum — bundle license notice + corresponding source | **DONE-ALREADY** (verified) | `viewer_license` still present end-to-end: `renderer/bundle-viewer/src/manifest.ts` (schema, key order, validation) and `kernel/src/publish/error.rs` (refusal reasons). No drift found. |
| 4 | Dependency-license audit (cargo + npm) | **DONE-ALREADY** (re-run, confirmed current) | `node scripts/audit-dependency-licenses.mjs` re-run this pass: **721 packages audited, 9 decided, 0 needing review, 1 tree not auditable** (`protocol/transport-bakeoff/web`, no `node_modules` — installing it is a download, out of this piece's named scope: "npm: same for frontends/shell direct deps"). Output byte-identical to the committed `DEPENDENCY-LICENSES.md` (`git diff` empty) — no drift in 11 days / 147 commits. `frontends/shell`'s own direct deps are covered by the same script run (it walks all `node_modules/*/package.json` in the tree, not just one package). |
| 5 | Project-name collision check; trademark stub in docs/14 | **DONE-ALREADY, with a residual scope question** — **NEEDS-HUMAN** (queued below) | `docs/14_Governance_and_Licensing.md` lines 18-19 carry a dated (2026-08-07) informal web-search collision check (no hit) + a trademark policy stub. The same note **self-limits**: "the deeper register search remains listed in `PRE-PUBLIC-CHECKLIST.md` as a pre-1.0 item rather than a pre-public one" — i.e. a prior custodian already decided this satisfies ADR-009 item 5's pre-public bar. That is exactly the kind of ADR-009-adjacent judgment call the current red-line rule reserves for the human, made before the rule existed. Not re-decided here; queued for explicit confirmation. |
| 6 | History review (credentials, personal data, third-party material) | **DONE-ALREADY** (2026-08-07 full pass) **+ MECHANICAL delta re-sweep this pass** | Original: 632 blobs / 92 commits, full read, `PRE-PUBLIC-CHECKLIST.md` §6 — no credentials, no personal-path leaks, no third-party data, three notes (none blocking). **This pass**: 147 new commits since (92→239 total) re-checked by targeted pattern search rather than a full blob re-read (cheaper, appropriate for a delta) — `git log --all -S` pickaxe for credential-shaped strings (`BEGIN PRIVATE KEY`, `AKIA`, `ghp_`, `sk-ant`, `sk-proj`, `xoxb-`, `AIza`), machine name (`Dell-XPS-15`), username-bearing absolute paths (`C:\Users\Christopher`, `C:/Users/Christopher`); `git ls-files` for `.env`/`.pem`/`.key`/`.p12`/credential-named files; `git log --diff-filter=A --name-only` for added `.parquet`/`.geojson`/`.gpkg`/`.shp`/`.osm*` files since 2026-08-07. **Zero hits on all of the above.** Current-tree grep (this piece's own step 3, narrower scope) also came back clean — see below. **One new, non-blocking finding**: 102 of 239 commits (all dated on/before 2026-08-10) carry no `Signed-off-by` trailer — predates the DCO-discipline habit settling in; queued below, not fixed (fixing would require a history rewrite, a named red line). |

---

## Personal-artifact sweep (piece step 3) — current tracked tree, mechanical half

Grepped the current `HEAD` tree (not full history — that's item 6 above) for: absolute paths with
the username outside attribution sites, machine name, RustDesk/session references, credential
patterns.

- **Username-bearing paths**: two hits, both reviewed, both **not leaks, not touched**:
  - `PRE-PUBLIC-CHECKLIST.md:220` — cites `donini.christopher@gmail.com` (172 records) and
    `chrys92d@gmail.com` (12) as a *finding* of the history review itself. Removing it would
    falsify the record it's reporting on.
  - `kernel/src/permission/audit/normalize.rs:142` — a doc-comment example (`C:/Users/Christopher2`)
    explaining the redaction algorithm's own component-boundary logic. The module's entire job is
    redacting the operator's home-directory path, so the real username is the natural illustrative
    example for its own design note — not an accidental leak. Left as-is.
- **Machine name** (`Dell-XPS-15`): zero hits in the current tree.
- **RustDesk references**: several, all in `AI_DEVELOPMENT.md`, `DECISIONS-PENDING.md`, and
  `frontends/shell/MANUAL-WALKTHROUGH.md` — operational method disclosure ("the human ran this
  remotely, degraded-channel caveat"), not a secret or personal-data leak (no session codes, no
  IPs, no credentials). Judged not in scope for redaction; noted, not touched.
- **Credentials**: `git grep` for common secret-shaped patterns — zero hits in the current tree.
  `git ls-files` for `.env*`/`.pem`/`.key`/`.p12`/credential-named files — zero.
- **Nothing required a fix under this step.** (Contrast with item 1, where the SPDX gap was real
  and mechanical — see below.)

---

## Mechanical fixes made this pass (all committed, see bottom)

1. **SPDX headers added to 84 files** that had none, all under `frontends/shell/` (the module
   postdates the 2026-08-07 147-file sweep): `frontends/shell/src-tauri/build.rs` (Rust convention:
   `// SPDX-License-Identifier: AGPL-3.0-or-later` / `// Copyright (C) 2026 Christopher Donini and
   the Spatial IDE contributors`) and 83 TS/TSX/MJS/HTML/CSS files under `frontends/shell/src/`,
   `frontends/shell/e2e/`, plus `frontends/shell/index.html`, `vite.config.ts`, `vitest.config.ts` —
   following the exact established convention per extension (verified against existing headed
   files elsewhere in the tree first; no new convention introduced):
   - `.ts`/`.tsx`/`.mjs` (no prior shebang): two `//` lines + blank line at top.
   - `.mjs` with a `#!/usr/bin/env node` shebang: header inserted immediately after the shebang.
   - `.html`: two `<!-- -->` lines + blank line immediately after the `<!doctype html>` line
     (matching `renderer/bundle-viewer/index.html`'s own placement).
   - `.css`: two `/* */` lines + blank line at top.
   - `frontends/shell/src/vite-env.d.ts` is a special case (a triple-slash `/// <reference>`
     directive as its sole content) — TypeScript only requires triple-slash directives be preceded
     by *comments*, nothing else, so the header goes before the directive; confirmed safe by
     running `npx tsc --noEmit -p .` (clean) after the edit.
   - Verified: `npx tsc --noEmit -p frontends/shell` clean; `npx vitest run` in
     `frontends/shell` — **28 test files, 275 tests, all passed**; `cargo check` in
     `frontends/shell/src-tauri` clean after the `build.rs` edit.
2. **`LICENSES/README.md` corrected** — it still said the AGPL-3.0/CC-BY-4.0 texts were "missing"
   and gave fetch instructions as an open step; both texts have been present and verified
   (hash-checked) since the same day (2026-08-07) the file was written, per
   `PRE-PUBLIC-CHECKLIST.md`'s own "Custodian completion note" — the README's prose was simply
   never updated to match. Fixed with a dated, appended correction (house style: append/correct in
   place with a dated note, don't silently rewrite) — the original "what was searched" provenance
   record is kept intact.
3. **`CONTRIBUTING.md` corrected** — claimed `product-ci-viewer.yml` had never run on a
   `pull_request`; `gh run list --workflow=product-ci-viewer.yml` shows it has, at least twice
   (`32016756529` on `cut/publish-ui`, 2026-08-17; `31948569278` on `cut/style-panel`, 2026-08-16;
   both success). Fixed with a dated correction note; the workflow-evidence table above it is
   otherwise still accurate and untouched.
4. **`PRE-PUBLIC-CHECKLIST.md` corrected** — its top status table was the 2026-08-07 snapshot,
   already self-contradicted by that file's own later "Custodian completion note" section the same
   day (e.g. item 1 marked "PARTIAL" when the license texts were fetched later that day; item 5
   marked "OPEN... Not performed" when the same file's lower section records a check having been
   performed). Kept the original table verbatim (house style — this file already uses that
   convention throughout its own history) and added a dated "Current status, 2026-08-18" block
   above it with the corrected reading and citations, pointing at this file for the full record.

No dependency, CI config, or ADR text was touched. No file outside the SPDX-header set and the
three documentation corrections above was modified.

---

## NEEDS-HUMAN — draft `DECISIONS-PENDING.md` entries (custodian to apply, not applied here)

Four items. Numbering left for the custodian to slot into the existing list (newest-first
convention, current highest is 8).

---

**Draft A — ADR-009 pre-public checklist: ready for your go/no-go, four residual questions.**
The mechanical half is done (SPDX headers extended to `frontends/shell/`, dependency audit
re-confirmed at 721/9/0, DCO text re-verified against the live source, all three CI workflows
green including the previously-unexercised `pull_request` path, stale documentation corrected).
Nothing found in this pass changes any prior finding. What's left is entirely judgment — Drafts
B–D below, plus **making the repository public itself**, which stays yours regardless of how this
checklist reads. Full citations: `CUT-STATE-adr009-checklist.md` (this piece's own state file,
untracked — the durable record is `PRE-PUBLIC-CHECKLIST.md` and `LICENSES/README.md`, both
updated this pass). Recommendation: none — this is the summary entry, not a decision.

**Draft B — Item 5's pre-public bar: does the 2026-08-07 informal web-search collision check +
docs/14 stub satisfy ADR-009 item 5, with the full trademark-register search deferred to pre-1.0?**
That deferral is already written into `docs/14` as a prior custodian's judgment call, made before
the 2026-08-09 red-line rule reserved ADR-009-adjacent decisions for you. Not re-decided by this
pass. Recommendation: if you're comfortable treating "no collision found, descriptive name, weak
mark" as sufficient for a still-private/pre-launch repo, **accept the deferral as written**; the
full register search stays a pre-1.0/counsel item per ADR-009's own Caveat. Touches: nothing if
accepted (already written); a `docs/14` edit if you want the bar read differently.

**Draft C — Two personal git identities are permanently in history
(`donini.christopher@gmail.com`, 172+ records; `chrys92d@gmail.com`, 12+) — acknowledge as-is, or
consolidate going forward?** Named as a non-blocking note by the original 2026-08-07 history
review and never explicitly resolved (not in `DECISIONS-PENDING.md`'s Pending or Resolved
sections). Unavoidable and normal for an open project once public; nothing to fix retroactively
(a history rewrite is a named red line). Recommendation: **acknowledge, no action** — optionally
standardize on one identity for new commits going forward, your call. Touches: nothing if
acknowledged; `git config user.email` locally if you want to standardize.

**Draft D — 102 of 239 commits (all on/before 2026-08-10) carry no `Signed-off-by` trailer —
accept as historical, pre-DCO-discipline commits, or address some other way?** Found this pass
(not in the original history review, which checked for credentials/personal-data/third-party
material, not sign-off completeness). The pattern cleanly tracks DCO adoption: ADR-009 accepted
2026-08-07, unsigned commits stop appearing after 2026-08-10 — this reads as the habit settling in,
not an ongoing gap. **Rewriting history to backfill trailers is a named red line
(`AI_DEVELOPMENT.md`) and not recommended**: DCO's own purpose is provenance for contributions from
people other than the committer, and every one of these 239 commits is from the same one or two
identities (both the sole author/maintainer) — there is no external-contribution provenance
question to retroactively answer. Recommendation: **accept as historical fact, no rewrite**; the
CI check (item 2) already gates every future *external* commit, which is what DCO 1.1 is for.
Touches: nothing if accepted — possibly a one-line note in `PRE-PUBLIC-CHECKLIST.md` §6 alongside
its existing three non-blocking notes, if you want it on the written record.

---

## What was actually run this pass

| Command | Result |
|---|---|
| `sha256sum LICENSES/{AGPL-3.0-or-later,CC-BY-4.0,Apache-2.0}.txt` | all three verified present, non-empty, canonical headers read by eye |
| `curl -s https://developercertificate.org/` then diff against `DCO` | byte-identical (ignoring HTML wrapper) |
| `node scripts/audit-dependency-licenses.mjs` | 721 audited, 9 decided, 0 needing review, 1 not auditable — **byte-identical** to committed `DEPENDENCY-LICENSES.md` (`git diff` empty) |
| `gh run list` / `gh run list --workflow=product-ci-viewer.yml` | all three product CI workflows green on `push` and `pull_request` as of 2026-08-17 |
| `git log --all -S<pattern>` × 7 secret-shaped patterns + machine name + escaped username path | zero hits, all patterns |
| `git log --diff-filter=A --name-only -- '*.parquet' '*.geojson' '*.gpkg' '*.shp' '*.osm*'` since 2026-08-07 | zero files added |
| `git grep` sweep, current tree, username/machine/credential/RustDesk patterns | two username-path hits (both records/design comments, not leaks, see above), zero credentials, zero machine-name hits |
| `npx tsc --noEmit -p frontends/shell` | clean |
| `npx vitest run` (frontends/shell) | **28 test files, 275 tests, all passed**, 30.35s |
| `cargo check` (frontends/shell/src-tauri) | clean |

---

## Branch race hit mid-piece — resolved, one loose end left for the custodian

The piece named branch `main`. Mid-session the working tree's checked-out branch changed twice
without any action by this piece (`cut/shell-skeleton` at session start → `main` when work began →
`cut/admission-remediation` by the time of the commit, evidenced by a new commit `ad1a175` "ADR-026
... admission-remediation cut opens" appearing with no corresponding action here, `CUT-STATE.md`/
`NEXT-CUT.md` disappearing and reappearing, `PART-H-QUEUED.md` appearing, and — after this piece's
own commit — an in-progress uncommitted edit to `DECISIONS-PENDING.md` (+30 lines) and, later still,
an uncommitted edit to `protocol/skp/tests/fixtures.rs`, neither made by this piece). This reads as
a concurrent custodian process actively working the same checkout while this piece ran, not a
mistake in these instructions.

**Consequence:** `git commit -s` for the mechanical fixes above landed on `cut/admission-remediation`
(as commit `875e1e0`) instead of `main`, because that was the checked-out branch at commit time.

**Resolved without touching the concurrent process's branch:** added a temporary worktree
(`git worktree add <tmp> main`), `git cherry-pick 875e1e0` onto it there — applied cleanly, no
overlap with `ad1a175`'s files — producing `8a69260` on `main`, then removed the temporary worktree.
**`main` now has the commit, at `8a69260`, as the piece asked.** The primary checkout was never
switched, `git checkout`/`reset`/`clean` were never run against it, and neither of the concurrent
process's uncommitted edits (`DECISIONS-PENDING.md`, `protocol/skp/tests/fixtures.rs`) were touched.

**Left deliberately undone:** `cut/admission-remediation` still carries the stray duplicate commit
`875e1e0` on top of `ad1a175`. Removing it means rewriting a branch another process is actively
committing to right now — judged too risky to do blind. **For the custodian, once that branch is
quiet:** `git log --oneline cut/admission-remediation` to confirm `875e1e0` is still the tip's
immediate ADR-009 ancestor with nothing of value on top of it, then either
`git rebase --onto ad1a175 875e1e0 cut/admission-remediation` (drops just that one commit, keeps
anything committed after it) or, if `875e1e0` is still the tip, `git reset --hard ad1a175`. Either
is a no-op for file content (the same changes now live on `main`); this is pure history hygiene, not
lost work.

## Deviations from the piece's literal instructions

1. **State file named `CUT-STATE-adr009-checklist.md`, not `CUT-STATE.md`** — see the top note.
   `CUT-STATE.md` was live for a different, concurrently-active cut for part of this session.
2. **Did not re-perform the full 2026-08-07 history review** (632-blob, commit-by-commit read) for
   the 147 commits since — used targeted pattern search instead (pickaxe + grep, see table above).
   Judged proportionate for a delta re-check; flagged rather than silently substituted.
3. **Did not install `protocol/transport-bakeoff/web`'s `node_modules`** to close its "not
   auditable" dependency-audit gap — the piece's item 4 names "frontends/shell direct deps"
   specifically, and installing a fresh tree is a network/toolchain action beyond a mechanical
   re-run of the existing offline-only audit script. Left as previously recorded.
4. **Did not touch `docs/14`, ADR-009, or `DECISIONS-PENDING.md`** — all four residual items are
   judgment calls, drafted above for the custodian to apply, per the piece's own instruction.
