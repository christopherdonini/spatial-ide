*Custodian's filing note (2026-10-09): the architect's draft of Amendment 1 of `renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md`, recording the human's rulings of 2026-10-09 (`state/directives/2026-10-09-rulings-on-the-eight-forms.md`), on the custodian's brief at main b4dc05e0. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 10380b31371e2dd565c6812bd9e3bd920f41d15a5f2210c134e8131f083ff4da. Write audit PASS: zero write calls (Read and Grep only, 18 tool uses). Run window from the transcript: 08:46:53Z to 08:53:50Z. The amendment as appended is part 1's block with its 12 pins computed at b4dc05e0, each pinned span's first and last line checked by the custodian; nothing else in it is changed (sha256 445b9126a86d2f8554fee9f0394aeead5e19be035aec9e8ecab187af92c07907).*

---

Reviewed: main @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b

## 1. The amendment

````markdown
### Amendment 1 — the human's rulings on OPEN-1 to OPEN-6, the source-archive build, CI and the ADR-030 note

Class 5, and class 9 (scope addition) for items (d) and (f): this amendment records the human's rulings of 2026-10-09 on this form's open items and is written before any code. The rulings are `state/directives/2026-10-09-rulings-on-the-eight-forms.md`, item 7, which the human said to record as each form's Amendment 1 before dispatch (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:6 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`). The RULED block of 2026-10-09 in `DECISIONS-PENDING.md` applies them. The scope additions follow class 9 (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions) and cite the directive by path. Nothing here adopts a port, and `works` stays empty at merge (§8 item 1).

**(a) OPEN-1 = (a)** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:55 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- §7: `ALLOWED_UPSTREAM_LICENSE_IDS` is exactly `["0BSD", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "BSL-1.0", "ISC", "MIT", "Zlib"]`, compared case-sensitively. Tests still inject their own set.
- Every port still needs the human's typed word. `adopted_by` and check (iv) in §2.2 do not change.
- Apache-2.0's condition (any upstream NOTICE file pinned) has no mechanical check. The ported README states it as the porter's duty, and the port piece's gate checks it. §1 gains a may-not-claim for it.
- Any other licence needs a per-port ruling. This piece builds no route for exceptions: a port under another licence brings its own ruling and its own change.
- §8 item 6 becomes: an `ALLOWED_UPSTREAM_LICENSE_IDS` value other than the eight ids above.

**(b) OPEN-2 = (a)** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:56 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- §2.3's header is now the ruled form.
- Every package's `license` field stays as it is, and no check reads or enforces it. §1 gains this as a may-not-claim. §5's "every package manifest and lockfile" already covers the field.
- §8 item 7 becomes: a header form other than §2.3.

**(c) OPEN-3 = (b)** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:57 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- The two headings, both intros, the §7 entry shapes and the end sentinel land as the worker's draft. In `notice.mjs`, each wording constant carries a comment that calls it latent under this item. Nothing renders while the registry is empty.
- The human sights this wording in the first port piece, which does not merge before they have. `LICENSES/third-party/ported/README.md` states this, and the PR body names it. §9's Operator line stands.

**(d) OPEN-4 = (a), the human's text (class 9, scope addition)** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:63 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`; the note is `state/directives/2026-10-09-rulings-on-the-eight-forms.md:65-71 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- The accepted note is the human's text, not the architect's draft. It adds the source-archive case, which item (f) builds.
- `docs/adr/ADR-030-conveyed-artifact-notice-set.md` joins the diff. Before merge the worker appends one empty line to its end, then lines 65 to 71 of the directive, copied by script from `git show b4dc05e08c1e24ef7d6904596bb2332b87dcf75b:state/directives/2026-10-09-rulings-on-the-eight-forms.md | sed -n '65,71p'` and never typed. No existing ADR-030 byte changes.
- The gate checks the bytes two ways:
  - `git diff --numstat <merge-base>...HEAD -- docs/adr/ADR-030-conveyed-artifact-notice-set.md` reads 8 added and 0 deleted, and the first added line is empty;
  - the sha256 of `git show HEAD:docs/adr/ADR-030-conveyed-artifact-notice-set.md | tail -n 7` equals the hash pinned above.
- There is no test row, because this is text: the byte check is its proof.
- §1's ADR-030 line now reads: reopened, with the human's note from item 7 appended at the end. "No accepted ADR text is edited" still holds, because lines are only appended.
- §8 item 8 becomes: a merge with ADR-030's diff failing either byte check.

**(e) OPEN-5 = (a)** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:58 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- The human's definitions (what read means, what a port is, what a fresh write is) are that line. Nothing here restates them.
- From this ruling on, every form that draws on the reuse index says, for each candidate it uses, whether it is a port or a fresh write.
- This form's answer: it draws on the index (§0) but uses no candidate. The one entry it cites is a licence-watch finding, carried by a note written in its own words and cited by repository, commit and path. The piece ports nothing.
- §2.7: the CONTRIBUTING paragraph and the ported README each cite that directive line for what counts as a port and what counts as a fresh write. Any wording of their own is marked as paraphrase.

**(f) A build from a source archive (class 9, scope addition)** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:60 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).

§2 shape:
- `portedNotices.mjs` gains two exports, typed in `.d.mts`:
  - `listTrackedFiles(repoRoot)` returns `string[] | null`.
    - It returns null, and runs nothing, exactly when `lstat(join(repoRoot, '.git'))` fails with `ENOENT`. Any other lstat error throws.
    - Otherwise it runs `git -C <repoRoot> --git-dir=.git --work-tree=. ls-files -z` through `spawnSync`, with no shell.
    - On a spawn error or a non-zero exit it throws, naming `repoRoot` and the first line of git's stderr.
  - `portedPrebuildCheck({ repoRoot, root, allowlist })` runs `readPortedRegistry`, then `listTrackedFiles`, then `checkPortedFiles`, and returns `{ registry, findings, notes }`. `notes` holds the §7 not-searched line when the listing is null, and is empty otherwise.
- `checkPortedFiles` accepts `files: null`. In that case:
  - (i) does not run;
  - (ii) checks that each registered path exists on disk under `repoRoot` and has the §2.3 header;
  - (iii) runs unchanged;
  - (iv) checks form only, because tracked status needs a listing.
  
  Together with the re-hashing in `readPortedRegistry`, this is the registry side that the ADR-030 note names.
- `generateNotice.mjs` is the product caller. It calls `portedPrebuildCheck` before `notice()` and prints each note with `console.log`, then goes on. A throw or any finding becomes the existing `generateNotice: FAIL -- …` line and exit 1. In a git checkout, the behaviour §2.5 declared is unchanged.
- `scripts/check-ported-notices.mjs` calls `listTrackedFiles`. A null result fails by name: the repository check has no archive mode.

**The test for "not a git checkout"** (the human asked the architect to define it): the root has no entry named `.git`. It is reliable on Windows, macOS and Linux for these reasons:
- Every kind of checkout puts an entry named `.git` at its root, on all three systems. A clone has a directory, CI's shallow `actions/checkout@v4` included. A worktree or a submodule has a file.
- No source archive carries that entry. `git archive`, GitHub's tarball and zipball, and release source archives all leave out the repository's own `.git`.
- The test is one `lstat` of a fixed name joined with `node:path`. It has no shell, no rule about separators, drive letters or case, and no `cfg`.
- It does not depend on git being installed or on PATH, on any environment variable, or on parent directories. `git rev-parse` discovery is not used because it walks upward: an archive unpacked inside another checkout would count as a checkout, list nothing from this tree, and pass silently.
- It fails closed. Any `.git` entry, valid or not, makes the tree a checkout, so the listing decides. `--git-dir=.git --work-tree=.` stops git from finding a repository above the root.
- Limit: a tree with a stray `.git` entry counts as a checkout, and if git cannot list it, the build fails. That is the failure the human ruled for.

§3:
- F10: a temporary tree under `os.tmpdir()` holding a valid registry (one work, one registered file with the §2.3 header) and one unregistered file with a `Ported-From:` line, and no `.git` entry.
- F11: F10 plus a `.git` file reading `gitdir: missing` (a relative path, no drive letter).

§4, added to `renderer/bundle-viewer/scripts/portedNotices.test.mjs`:

| # | Test | Mutation that fails it |
|---|---|---|
| T16 | `outside a git checkout the registry side is checked and the not-searched line is the one note`: on F10, `findings` is empty and `notes` is the §7 line. With the registered file's SPDX line changed, exactly one finding names that path, and the note is still there. | `listTrackedFiles` returns `[]` instead of null when `.git` is absent |
| T17 | `in a git checkout whose listing fails the prebuild check throws naming the root`: F11 | `listTrackedFiles` returns null when git exits non-zero |

- T8 now gets its file list through `listTrackedFiles` at the repository root and also asserts the list is not null. Its mutation stands. T8 is the run of the listing from the real shape: real git on the real tree.
- P3 now covers T1 to T17.

§2.8 (R3): the code path is the same on all three systems. T16 and T17 run on ubuntu in viewer CI. The worker records one Windows run of `node --test renderer/bundle-viewer/scripts/portedNotices.test.mjs` in its worktree, where `.git` is a file. macOS has no runner, so it is not run there. R5 is unchanged.

§1:
- May-claim bullet 1 becomes: "…fails the repository check and a packaged build from a git checkout, by name".
- May claim, added: a build outside a git checkout runs the registry-side checks, fails on a registry fault, and prints the §7 line.
- May not claim, added: that a build outside a git checkout searches for unregistered markers.

§5:
- Invalidators, added:
  - the §7 note appears in the log of any CI build (`product-ci-shell.yml`, `tauri-build.yml`, `release-artifacts.yml`);
  - T8 fails where `.git` is a file.
- Falsification, added:
  - a build in a git checkout that prints the note instead of listing;
  - a build outside a checkout that passes despite a registry fault.

§8, added: 14. A "not a git checkout" test other than a `.git` entry at the root (for example discovery, an environment variable, or whether git is installed), or a listing that lets git find a repository above the root.

§7, added: the note line, exactly: `generateNotice: NOTE -- <repoRoot> is not a git checkout (no .git entry); the ported-file registry was checked; unregistered port markers were not searched`.

**(g) OPEN-6: required** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:59 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- §7, added: the workflow is `name: Ported notices`, with one job, id `ported-notices`, `name: ported-notices`, and no matrix. GitHub names a non-matrix job's check run after the job's `name:`, so the check will be named `ported-notices`.
- After merge, the custodian reads the name of the check run from the first green run on main through the API. They then give the human that exact string and the run id, and the human adds it to the required checks. This PR changes no repository setting.

**(h) CI installs nothing** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:61 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- `.github/workflows/ported-notices.yml` has this shape:
  - it triggers on `push` and `pull_request`, with no path or branch filter;
  - `permissions: contents: read` is set at the workflow level;
  - it runs on `ubuntu-latest`;
  - its steps are `actions/checkout@v4` with `persist-credentials: false`, then `actions/setup-node@v4` with `node-version: "24"` and no `cache`, then `node scripts/check-ported-notices.mjs`.
- This matches governance-ci's cfg-boundary job (`.github/workflows/governance-ci.yml` lines 171 to 185, with the workflow permissions at lines 118 to 119, at b4dc05e08c1e24ef7d6904596bb2332b87dcf75b).
- §8, added: 15. Any other step in `ported-notices.yml`, any install (`npm ci`, `npm install`, any package manager), a `cache:`, any permission beyond `contents: read`, or any path or branch filter.

**(i) The AUTONOMY.md label finding** (`state/directives/2026-10-09-rulings-on-the-eight-forms.md:62 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`).
- The finding (`state/consults/2026-10-09-ported-code-notice-route-architect-draft.md:344 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD`) is not fixed in this PR. It stays with the weekly window.
- §5's declared-unchanged list adds `AUTONOMY.md`.

**(j) Budget (§7).** At most 1,550 changed lines across at most 20 files, replacing 1,400 and 20. The reason is items (d) and (f): ADR-030's 8 lines, the listing branch, and T16 and T17. The counting command is unchanged, and an overrun is class 8.

**(k) §9, added.**
- Architect: the byte check of item (d), and §8 items 14 and 15.
- The PR body names:
  - the latent wording and the first port piece's sight (item (c));
  - the after-merge step for OPEN-6 (item (g));
  - the AUTONOMY finding staying with the weekly window (item (i)).

**Superseded index** (the old lines stay in place, append-only; read this amendment first):

| Form text | Superseded by |
|---|---|
| §0, finding bullet: "The fresh write is outside this piece (OPEN-5)" | item (e) |
| §1, may-claim bullet 1; the may-not-claim list; the ADR-030 line | items (a), (b), (d), (f) |
| §2.3: "The form is OPEN-2; this is the recommended one" | item (b) |
| §2.4, Wording bullet | item (c) |
| §2.5, bullet 1 (the listing and its failure) | item (f) |
| §2.6, bullets 1 and 2 | items (f), (g), (h) |
| §2.7, CONTRIBUTING bullet | item (e) |
| §2.8, R3 | item (f) |
| §3, F2–F9 | extended by item (f) (F10, F11) |
| §4, T8; P3's range | item (f) |
| §5, declared unchanged; invalidators; falsification | items (f), (i) |
| §7, `ALLOWED_UPSTREAM_LICENSE_IDS`; Entry shapes' "(wording per OPEN-3)"; Budget | items (a), (c), (j); additions in (f), (g) |
| §8, items 6, 7, 8 | items (a), (b), (d); items 14 and 15 added in (f), (h) |
| §9, Architect; PR body | item (k) |
````

## 2. What the human must still decide

None. Two after-merge steps are the human's to carry out, not open decisions: adding the `ported-notices` check to the required checks once the custodian has given its name from the first green run on main, and sighting the latent wording in the first port piece.

For the custodian, not the human: the OPEN-5 rule (every form that draws on the reuse index says port or fresh write for each candidate it uses) binds forms beyond this piece. Where it is written down beside the standing reuse step (the template, the briefs) is the custodian's placement. This amendment records it but does not place it.

Every `sha256:HASH-TBD` must be computed at b4dc05e08c1e24ef7d6904596bb2332b87dcf75b before commit (I have no Bash). The hash for the span at lines 65-71 is also the reference for item (d)'s byte check.

## 3. Files read

- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-on-the-eight-forms.md
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-additions-reaim-identity-route-documents.md
- C:\dev\spatial-ide\renderer\bundle-viewer\PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-10-09-ported-code-notice-route-architect-draft.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (lines 1-80)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (lines 110-178; grep for classes 5, 8, 9)
- C:\dev\spatial-ide\docs\adr\ADR-030-conveyed-artifact-notice-set.md (lines 50-85)
- C:\dev\spatial-ide\frontends\shell\scripts\generateNotice.mjs
- C:\dev\spatial-ide\.github\workflows\governance-ci.yml (lines 1-186)
- C:\dev\spatial-ide\.github\workflows\product-ci-shell.yml (lines 155-229)
- C:\dev\spatial-ide\.github\workflows\product-ci-viewer.yml (grep)
- C:\dev\spatial-ide\renderer\bundle-viewer\package.json (grep)
- C:\dev\spatial-ide\.github\workflows\ (grep for checkout and build steps: tauri-build.yml, release-artifacts.yml and others)
