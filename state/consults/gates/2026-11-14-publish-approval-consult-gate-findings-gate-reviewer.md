Reviewed: PR #319 at 9fb3aff1bba72dbf5349a12adf518f34a09e0020 (merge base 54ee3522) (the custodian's filing note, 2026-11-14: the gate, the reviewer, attempt 1, the single reviewer gate of the five-line form `governance/forms/frontends/PUBLISH-APPROVAL-CONSULT-GATE-FINDINGS-PREREGISTRATION.md`, its section E, PLAN node publish-approval-consult-gate-findings, the docs lane; its brief by file (13106 bytes, sha256 f6d38c7d444be4068a58874b97a154a29df464d72a7964a3f4d1e7e439dff403); the run 10:36:57Z to 11:00:31Z by its transcript, 52 calls (Read 11, Bash 39, Grep 1, SubagentHandback 1), none errored, no file written by the Write or Edit tools, model claude-opus-5-5; each run it claims has a call behind it (npm run verify in a shared hold #30, node --test #31, verify.mjs offline #32, verify-cites #33, verify-quotes in a shared hold #37, gh pr checks #44), and each run's log on disk gives the counts and exits it reports; below, the hand-back byte for byte (with one final newline, 15637 bytes, sha256 e6ea75d13ff9420afad6cd71b54a65d6c75e93cf44f75335d26d413660e72a45), whose scratch-folder paths the reviewer itself wrote as <S>. Nothing is changed.)

Reviewed: PR #319 at 9fb3aff1bba72dbf5349a12adf518f34a09e0020 (merge base 54ee3522), the single reviewer gate
Verdict: PASS
cut/publish-approval-consult-gate-findings @ 9fb3aff1bba72dbf5349a12adf518f34a09e0020

I found nothing under Correctness, nothing under Evidence and nothing under Documentation. Three observations follow the checks. None of them is a finding, and none needs a fix. My departures from the brief are listed at the end.

Brief: 13106 bytes, sha256 f6d38c7d444be4068a58874b97a154a29df464d72a7964a3f4d1e7e439dff403. This matches the brief named by the launching message.
Model, as the harness reports it: Opus 5.5 (claude-opus-5-5).
Start 2026-11-14T10:37:12Z. End 2026-11-14T10:59:04Z.

**1. Start**
- `git -C C:/dev/spatial-ide fetch -q origin`: rc 0.
- In C:/dev/wt/pacg:
  - HEAD is `9fb3aff1bba72dbf5349a12adf518f34a09e0020` (rc 0).
  - The porcelain is empty (rc 0).
  - ls-remote gives `9fb3aff1bba72dbf5349a12adf518f34a09e0020	refs/heads/cut/publish-approval-consult-gate-findings` (rc 0).
- HEAD^ and the merge base with origin/main are both 54ee3522bfd2865637575802d267ca6746d2fd59. origin/main = 51de9f2af2464bcc8a5624706df30e3c98db165c.
- df at start:
  - `C:              476G  425G   51G  90% /c`
  - `D:              466G  115G  352G  25% /d`
- The form at origin/main: 19164 bytes, sha256 5c772c4655c6400ab9d7bfc45541c610b8b348e9246b32961586adff9b6e5965.
- The ruling: 5425 bytes, sha256 daa8bcc8942303f1ded4dad5e43133dd44c232ed84d55fa54a24fd1997eed747.
- Both equal the custodian's readings. Start as given.

**2. Out-of-scope line (form line 10)**
- **ADR: holds.** No file under `docs/adr/` is in the diff. The diff names only `frontends/shell/MANUAL-WALKTHROUGH.md` and `frontends/shell/src/publish/PublishDialog.tsx`.
- **Security and wire: hold.** Nothing under `protocol/` or `src-tauri/` is in the diff.
- **No code statement and no test changed: holds.**
  - Dialog lines 1–168 at the base equal lines 1–168 at the head, and base 172..end equals head 173..end (checked by script).
  - The only change is the comment lines 169–171 → 169–172.
  - No test file is in the diff.
- **Guarantee: holds.** No code changes, and no claim of a limit or a measurement is added.
- **No string the app shows: holds.**
  - The changed lines 169–172 are inside the JSDoc at head 168–180, which closes directly above `export default function PublishDialog({` at head 181.
  - The JSX the component returns is head 235–332.
- **PR B's form is not edited: holds.** `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md` is not in the diff.

**3. The diff**
- numstat (rc 0):
  - `1	1	frontends/shell/MANUAL-WALKTHROUGH.md`
  - `4	4` is not present; the line is `4	3	frontends/shell/src/publish/PublishDialog.tsx`
- Totals: 5 insertions and 4 deletions, 9 changed lines. This is within the declared budget of at most 12 (7 + 2 expected).
- `--name-only` gives the same two files (rc 0). I read the whole diff (rc 0).
- Dialog: lines 169–171 at the base are replaced by four lines. Line 168 (`/**`) and everything from base line 172 are unchanged (by script).
- Walkthrough: 2028 lines both sides. The only line that differs is 333 (row G3), and within it only the §C span changes (check 4).
- `git diff --stat 54ee3522… origin/main -- <P> <G> frontends/shell/src/publish/types.ts` gave empty output (rc 0), so main has changed none of those three files since the base.

**4. §B and §C byte for byte** (a node script, rc 0)
- §B:
  - The fence lines are form line 50 (` ```text `) and form line 55 (` ``` `).
  - Form lines 51–54 are 339 bytes, and dialog lines 169–172 at the head are 339 bytes.
  - Result: `equal: true`.
- §C:
  - The ruling's old span (ruling line 20) equals form line 72: `true`.
  - The ruling's new span (ruling line 26) equals form line 78: `true`.
  - The old span (57 bytes) occurs once in base line 333 and once in the whole base file.
  - The new span (268 bytes) occurs once in head line 333 and once in the whole head file. The old span occurs 0 times in head line 333.
  - `replace(base333)==head333: true`.

**5. The §B and §C clauses against the head**
`git diff --stat 9540e6cb HEAD` over every file the clauses cite gives only the PR's change (rc 0):
- `MANUAL-WALKTHROUGH.md | 2 +-`
- `PublishDialog.tsx | 7 ++++---`

The files in that stat were ADR-024, types.ts, PublishDialog.tsx, PR B's form, publish.rs, grant.rs and MANUAL-WALKTHROUGH.md. 9540e6cb is an ancestor of the head (rc 0). The pins at 9540e6cb are authoritative for their own bytes (check 7). The tree at the head differs from them only by the dialog's +1 shift after line 171, and I give head line numbers by content.

§B clauses (form lines 57–65):
- **Brief deleted by the publish cut's final docs commit: holds.**
  - ADR-024:34–35 at the head (unchanged from 9540e6cb) reads "`NEXT-CUT.md` (this cut's own brief — deleted by its final docs commit; this ADR is what survives it)".
  - This text is inside the **Related:** paragraph, lines 17–36.
- **Decision section records this surface: holds.**
  - `## Decision` runs from line 68 to line 228. The surface is at 137–178 ("**Approval: DOM, one comparison, in Rust.**").
- **Thirteen fields: holds.**
  - The script counts 13 fields in `PublishPromptData` at head types.ts 15–52.
  - The fields are operation, class, reversibility, source_name, source_content_hash, style_hash, destination_display, grantor, grant_remaining_s, row_scope, filter_scope, outcome_summary and published_columns.
- **Rendered, in the order the JSX declares: holds.** The `prompt.*` references inside the JSX (235–332) are:
  - the header at 238 (operation, class, reversibility);
  - outcome_summary at 244;
  - the eight list fields at 245–266: source_name 247, source_content_hash 249, style_hash 251, destination_display 254, grantor 257, grant_remaining_s 260, row_scope 263, published_columns 265;
  - filter_scope at 267–271.
  - Every field is referenced, and the dialog has no `prompt.*` reference outside the JSX.
  - Line mapping from 9540e6cb to the head: 237→238, 243→244, 244–265→245–266, 266–270→267–271.
- **Verbatim: holds.**
  - Each value is a bare `{prompt.x}` interpolation.
  - ` — class `, ` — `, ` — grant remaining: ` and `s` (238, 260) are the component's own text.
- **filter_scope only when sent: holds.** types.ts 35–39 gives `string | null`, and the render is guarded at head 267 (`{prompt.filter_scope && (`).
- **No case outside ordinary use: holds.** I found none.

§C clauses (form lines 81–85):
- **"By this hash alone": holds.**
  - `style_hash` (types.ts:21) is the only field whose name matches /style/.
  - It is rendered once, at head 250–251 (A 249–250).
- **"None of its colours, opacity or outline": holds.**
  - No field name matches `/colou?r|opacity|outline|fill|stroke/i`.
  - Positive controls first: the same regex matches dialog line 201 (`handleFillColor`, a comment outside the JSX). It also matches walkthrough head line 333 (`colour,opacity,outline`).
  - The search then gave 0 matches over the whole JSX, head 235–332. This range includes the `<dt>` labels and the comments, so it is wider than the form's 276–328 at 9540e6cb (= head 277–329).
- **Still true after PR B: holds at 9540e6cb.**
  - PR B's form line 176, "- PublishDialog, PublishPanel and `src-tauri/src/publish.rs`;", is under `### 2.1 Unchanged` / "Nothing in this list is edited:" (171–173).
  - The columns line's attributes come only from `style_attributes` (publish.rs 592 and 697). That function returns only the style's `match_column()` (1299–1307), so the line names a column, not a colour, opacity or outline.
- **Reach: holds.** No timing-sensitive, dev-only or instrumented case was found.

**6. §A's "met" claims** (the same lines at 9540e6cb and at the head; publish.rs, grant.rs and ADR-024 are unchanged between them)
Finding 1: holds.
- publish.rs:69 is `pub const PENDING_ATTEMPT_TTL: Duration = Duration::from_secs(600);`.
- At 656–658 the grant takes `PENDING_ATTEMPT_TTL`.
- grant.rs:221 is `MAX_GRANT_LIFETIME … from_secs(20 * 60)`.
- The dialog states the expiry once: its definition is at 16–17 and the render at head 286 (9540e6cb 285).
- The grant's remaining seconds are rendered at head 258–260 (9540e6cb 257–259). A search of the dialog for setInterval, setTimeout, requestAnimationFrame and Date.now found 0 matches (grep rc 1), so there is no countdown.
- ADR-024:302 states 600 s.

Finding 3 (ii): holds.
- `compose_published_columns` is at 322–331 and is called at 697.
- The attributes come from `style_attributes(&style_source)` at 592.
- Lines 1299–1307 give the match column only.
- The dialog renders the line at head 265 (9540e6cb 264).

§A item 4's absence, by script, on PR B's form at 9540e6cb (1879 lines). Section ranges are taken from the headings:
- §2.3: 231–277.
- Amendment 12: 1551–1820.
- "Amendment 12, continued": 1821–1867.
- Amendment 13: 1868–1879.
- Four patterns gave 0 hits in every range and 0 in the whole file:
  - `publish-approval-columns-line`;
  - `/columns[ -]line/i`;
  - the consult's full path;
  - the consult's basename fragment.
- Positive controls on the same file at origin/main:
  - `publish-approval-columns-line` hits line 1981.
  - columns line hits 8 lines (1881, 1910, …).
  - The consult path hits line 1921.
- These hits are inside main's Amendment 14 (heading at 1881), which is expected (§D).

**7. Pins**
- The script found 38 pins and 38 loose ` @ <rev> sha256:<hex>` occurrences. 38 match and 0 mismatch.
- Every pin is at 9540e6cb, which resolves to 9540e6cb71ca57f097c6ef29bfccd38e18df79c0. That commit is on main (merge-base --is-ancestor, rc 0).
- No span contains a CR.
- The count equals the custodian's.

**8. Readiness** (all from C:/dev/wt/pacg)
`npm run verify` in frontends/shell, in a shared hold (-Minutes 10, -MaxWaitMinutes 20, background):
- rc 0.
- Status before the hold (`<S>/gr319-status-1.txt`, 10:43:36Z): quiet=False, average=23.8%, peaks-over-25=13. No `project=SpatialIDE` line.
- Hold lines:
  - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:22284 also=<m> (commands started from now on inherit it; release when done)`
  - `MACHINE_RELEASED project=<m> shell=bash.exe:22284 affinity=FF (cores 0-7)`
  - There were no waiting or error lines.
- The run started about 10:43:40Z, and its output was last written at 10:48:48Z.
- vitest gave `Test Files  112 passed (112)` and `Tests  1459 passed (1459)`.
- The last 30 lines, byte-copied:
```
✔ T2 the E-ASK-TWO run line (U its printed duration) reads FAIL (0.3807ms)
✔ T3 an unknown-attempt with U = T + 1 reads INCONCLUSIVE, with U = T reads FAIL (0.2704ms)
✔ T4 a success and a refused outcome, each with U = 10 T, give no verdict (0.3527ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 23.8056

> spatial-ide-shell@0.1.0 test:s5d-verdict
> node e2e/s5dVerdict.test.mjs

✔ T1 B5's session-ended line alone reads PASS (4.1176ms)
✔ T2 A1's two lines read INCONCLUSIVE, C2, the message naming {mtime} (0.7139ms)
✔ T3 A3's two lines read INCONCLUSIVE, C2 (the session-ended line's already-ended text is not classified) (0.3037ms)
✔ T4 B5's line removed reads FAIL, no class (0.2197ms)
✔ T5 a refusal carrying A3's already-ended text, details read from the real skp.rs, reads FAIL, C1 (0.5593ms)
✔ T6 a refusal carrying the could-not-re-read detail, prefix read from the real descriptor.rs, reads FAIL, R (0.3535ms)
✔ T7 a {mtime} refusal beside a refusal of another code reads FAIL, C3 (0.3898ms)
ℹ tests 7
ℹ suites 0
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 20.6036
```

The other readiness runs:
- **`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`** (10:44:24Z–10:46:35Z): rc 0, `ℹ tests 598`, `ℹ pass 598`, `ℹ fail 0`.
- **`node scripts/plan/verify.mjs --offline`** (10:47:12Z–10:47:17Z): rc 0. `verify:plan PASS — C:\dev\wt\pacg\governance\PLAN.yaml agrees with the repository.`
- **`node scripts/plan/verify-cites.mjs`** (10:47:36Z–10:49:25Z): rc 0. `verify:cites PASS — every rooted (in-tree) path:line reference across 2999 file(s) resolves. (193 loose reference(s) advised above.)`
- **`node scripts/plan/verify-quotes.mjs`**, in a shared hold (-Minutes 5, -MaxWaitMinutes 20, background):
  - rc 0.
  - Status before the hold (`<S>/gr319-status-2.txt`, 10:50:52Z): quiet=False, average=30.5%, peaks-over-25=60. No `project=SpatialIDE` line.
  - Hold lines:
    - `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:56236 also=<m> (commands started from now on inherit it; release when done)`
    - `MACHINE_RELEASED project=<m> shell=bash.exe:56236 affinity=FF (cores 0-7)`
  - The run finished at 10:58:48Z, about 8 minutes against the 5-minute estimate.
  - `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 928 ruling cites resolved, 0 ruling-cite errors.`

CI: `gh pr checks 319` read at 2026-11-14T10:52:13Z (rc 0). 8 checks, all pass:
- every commit is signed off;
- no profile path in the range;
- ported-notices ×2;
- tauri build (NSIS, build-only, no signing) ×2;
- typecheck · build · vitest · cargo test ×2.

**9. End**
- HEAD is `9fb3aff1bba72dbf5349a12adf518f34a09e0020`, and the porcelain is empty (0 bytes; the verify build left no tracked change).
- df at end:
  - `C:              476G  426G   50G  90% /c`
  - `D:              466G  115G  352G  25% /d`
- No background shell or process I started is still running. All three background tasks (be4apek2p, bkq0ssl3a, b0ti5kk2l) completed with exit 0, so nothing needed killing.

**Observations** (all three are mine; none is a finding, and none needs a change):
1. The clause "deleted by that cut's final docs commit" rests on ADR-024's record. The comment cites that record as its source.
   - git history cannot show the deletion: commit 252585bf's subject says NEXT-CUT.md was "previously gitignored, never in the repository".
   - `git log --diff-filter=D` up to 9540e6cb finds only bc696489 (2026-08-06).
2. ADR-024's Decision field list (137–144) predates `published_columns`, which its appended note of 2026-11-13 (line 312) records. §B's "the Decision section records this surface" still holds.
3. The form's §C pin for the dialog's "fixed text" (276–328) leaves out the `<dt>` labels. My search covered the whole JSX and still found zero.

**Departures from the brief:**
- `gh pr view 319 --json headRefOid,isDraft` (read at about 10:52Z; it gave `9fb3aff1… draft=true`) is a network call outside the brief's list of fetch, ls-remote and gh pr checks. It was read only.
- Two calls piped a command whose rc I printed:
  - the `grep -n 'attributes…' publish.rs | grep -v` call in check 6;
  - the `git ls-files | grep` archive listing.
- Extra local read-only calls outside the nine checks: a `git log` of NEXT-CUT.md's history (for observation 1), an `ls-files`, and one Grep.
- `node --test` and `verify-cites` ran outside any hold, while the verify hold was active. The brief requires no hold for them, and both passed.
- Twice I read or polled the task output files while waiting. One of my wait loops was moved to the background by the harness after 180 s (task b0ti5kk2l). It was not a refusal.
- There were no stops, no refusals and no repeated runs.

Scratch outputs are under `<S>`, named `gr319-*`.
