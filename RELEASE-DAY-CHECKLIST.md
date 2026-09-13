# Release day — the v0.1.0 tag as a checklist

*Written 2026-09-09 during the release cut, on the human's instruction that "the tag moment is a
checklist, not improvisation". Every step names the file, command or page it acts on. Steps marked
**(human)** are the human's own — the custodian never tags, never publishes a release, never changes
repository visibility or metadata (`AI_DEVELOPMENT.md`'s red lines). Steps marked **(custodian)**
are mechanical and were run, or are re-run, before the human's step that depends on them.*

## 0. Preconditions — all true before anything below

- [ ] Every release-cut PR merged (`RELEASE-0.1.md`'s latest amendment lists them; `gh pr list --state open` is empty of release PRs).
- [ ] `main` is what will be tagged: `git status` clean, `git log -1` is the intended commit, CI green on that commit (`gh run list --branch main --limit 5`).
- [ ] Part M was run by the human on the packaged build and its record is in `frontends/shell/MANUAL-WALKTHROUGH.md` ("### Part M run") — the verdicts verbatim. **No tag before Part M** (`RELEASE-0.1.md` Amendment 13: "a document describing an artifact is written after running it, not before").
- [ ] `KNOWN-LIMITATIONS.md`, `README.md`, `QUICKSTART.md` finalized from Part M's record — no `[M: …]` bracket remains (`grep -rn "\[M:" README.md QUICKSTART.md KNOWN-LIMITATIONS.md` prints nothing). Item 4 written last.
- [ ] `git diff --stat <built-commit> main` names only documentation — the installer that will be attached was built from a commit whose code equals the tagged commit's (the custodian records the built commit in `RELEASE-0.1.md`'s last amendment).

## 1. The artifact (custodian, re-verified by the human)

- [ ] The installer exists at `frontends/shell/src-tauri/target/release/bundle/nsis/Spatial IDE_0.1.0_x64-setup.exe` (name from `tauri.conf.json`'s `productName` + `version`).
- [ ] Its SHA-256 is recorded in `RELEASE-0.1.md` (the custodian's build record) and matches: `sha256sum "…/Spatial IDE_0.1.0_x64-setup.exe"` (Git Bash) or `Get-FileHash -Algorithm SHA256` (PowerShell).
- [ ] The three notice files it carries are the ones Part M M3 checked (`NOTICE.txt` beside the executable; `bundle-viewer\NOTICE.txt`; the in-app Notices view) — byte counts as recorded, no `*** BOOTSTRAP PASS`.
- [ ] The installer is the one Part M installed — same SHA-256 (if Part M ran on an earlier build, rebuild, re-hash, and re-run the rows the diff touches; do not attach a build nobody ran).

## 2. Repository metadata (human — GitHub "About" panel, or `gh repo edit`)

- [ ] Description set (one sentence; the README's first line without the marketing tone). `gh repo edit --description "<text>"`.
- [ ] Topics set: `gh repo edit --add-topic geoparquet --add-topic gis --add-topic tauri --add-topic duckdb --add-topic rust --add-topic spatial-data` (the fourteen verified topics and the final description are in `RELEASE-DRAFTS-0.1.0/decision-notes/repo-description-and-topics.md`; entry 78 ruled 2026-09-11; topics are metadata, not claims).
- [ ] Homepage: none, or the repository's own README (no marketing site exists). `gh repo edit --homepage ""`.
- [ ] "Releases" and "Packages" sidebar items as GitHub sets them; nothing else changes. Visibility is NOT touched (already public since 2026-08-03; ADR-009's corrigendum).

## 3. README top (custodian drafts, human sights)

- [ ] `README.md`'s first screen answers: what this is (two paragraphs, `docs/00`), what v0.1.0 is (the hero slice, the whole claim), the limits link (`KNOWN-LIMITATIONS.md`) BEFORE the install section, the install line with the artifact name, no performance statement, the licence block. Nothing above the fold describes the installed application except from Part M's record.

## 4. The tag (human)

**Release-branch pattern (entry 83, ruled 2026-09-13):** `release/<version>` is branched from the commit the candidate installer was built from; fixes ruled into the release land there through their own preregistrations and gates (never Brief-class engine work); the installer is rebuilt from the branch head (RC2, RC3, …) and hashed; the finalized release docs land on the branch as docs-only commits; the tag points at the branch head; the release body states the build commit and that the tagged tree differs from it by documentation only, with the `git diff --stat <build-commit> <tag>` line as proof; the branch merges back to main after the tag. Nothing merges to main before the tag except docs.

- [ ] Tag message finalized from the draft (`RELEASE-0.1.md`'s last amendment names the draft's location); every sentence verifiable against a file in the tree.
- [ ] `git tag -a v0.1.0 -F <tag-message-file> <commit>` — annotated, on the intended commit; `git tag -v` is not expected (no signing key is declared for this project; the DCO sign-off is per commit).
- [ ] `git push origin v0.1.0`.
- [ ] `git describe --tags` on main prints `v0.1.0` — under the release-branch pattern only after the merge-back, and as `v0.1.0-<N>-g<sha>` when main carries commits above the tag (2026-09-13: `v0.1.0-63-ge9900a3`).
- [ ] **From v0.1.1 (`AUTONOMY.md` §11; the human's directive item 11, 2026-09-14, verbatim:
      "Release artifacts are the tagged commit's CI build, hash-recorded; the dev machine is for
      headed work only — apply from v0.1.1."): the release asset is the tagged commit's CI build,
      not a dev-machine build.** Not in force for v0.1.0, which was built on the dev machine per
      Part M's own record. From v0.1.1, a dedicated workflow — `.github/workflows/release-artifacts.yml`
      (`chore(ci): release-artifacts-from-ci`, 2026-09-14; not a `tags` trigger folded into
      `product-ci-shell.yml`, since GitHub ANDs a push event's `tags` filter with a `paths` filter,
      which would leave a tag pushed at an already-existing commit — this release-branch pattern
      exactly — at risk of reporting no changed paths and never firing) — runs on a pushed `v*` tag,
      calling the same reusable build steps as `product-ci-shell.yml`'s own `tauri-build` job
      (`.github/workflows/tauri-build.yml`), and uploads the installer as a workflow artifact named
      `spatial-ide-<tag>-x64-setup` (e.g. `spatial-ide-v0.1.1-x64-setup` for the v0.1.1 tag),
      printing the installer's file name, byte size and SHA-256 to the run's job summary. Procedure:
      1. Push the tag (§4 above): `git push origin v<version>`.
      2. Wait for the run on the tag: `gh run list --branch v<version> --workflow
         release-artifacts.yml --limit 3` (or watch it directly once its run id is known: `gh run
         watch <run-id>`).
      3. Download the artifact: `gh run download <run-id> -n spatial-ide-v<version>-x64-setup -D
         <dir>`.
      4. Hash it locally: `Get-FileHash -Algorithm SHA256 "<dir>\Spatial IDE_<version>_x64-setup.exe"`
         in PowerShell (or `sha256sum "<dir>/<installer>"` in Git Bash).
      5. Compare the locally-computed hash against the run's own job summary (`gh run view <run-id>
         --log` prints the job log's `SHA-256:` line; the step summary is also visible on the run's
         page) — they must match exactly before proceeding.
      6. Record the file name, byte size and SHA-256 in `RELEASE-<version>.md`, in place of a
         dev-machine build record (`RELEASE-0.1.md` Amendment 17 is the house form for this record).
      7. `gh release upload` — the human's own step (§5 below); the custodian never publishes.
      8. The logged-out verification (§5's "lesson of 2026-09-13") still applies unchanged: the
         asset on the public release page must hash to the same value.
      The dev machine builds nothing for the release from v0.1.1 on — a local build there is for
      headed walkthrough work only (Part M, manual walkthroughs), never the shipped artifact's
      source.

## 5. The GitHub release (human)

- [ ] `gh release create v0.1.0 --title "Spatial IDE v0.1.0" --notes-file <release-body-file> "frontends/shell/src-tauri/target/release/bundle/nsis/Spatial IDE_0.1.0_x64-setup.exe"` — the body from the finalized draft: the installer, its SHA-256, and the `KNOWN-LIMITATIONS.md` link ABOVE THE FOLD (the first three lines); then what v0.1.0 is; then the limits digest; then licences and the corresponding-source route.
- [ ] After upload: download the asset back and re-hash it — the SHA-256 on the release page equals the file's (`gh release download v0.1.0 --pattern "*.exe" --dir <tmp>` then hash).
- [ ] The release is NOT marked pre-release or draft unless the human decides so (a decision, queued if unsure).
- [ ] **The lesson of 2026-09-13 (the human, verbatim): "gh release create leaves a draft when asset upload fails; the release is done only when a logged-out fetch of /releases/tag/<tag> shows the asset."** Run the check logged out (a private window, or `curl` without a token against `https://api.github.com/repos/<owner>/<repo>/releases/tags/<tag>`): `draft` must be `false` and the asset must be listed; then download the asset by its public URL and re-hash it. Not the authenticated `gh release view`, which shows drafts to their owner.

## 6. After the tag (custodian, mechanical)

- [ ] `RELEASE-0.1.md` gains the closing amendment: the tag's commit, the release URL, the asset's SHA-256, Part M's verdicts pointer; `CUT-STATE.md` archived to `.cut-archive/` (Rule 10).
- [ ] `NEXT-CUT.md`'s three post-release candidates (ADR-032; LOD, ADR-031; the geometric-protection piece, entry 66 (b)) presented for the human's sequencing — nothing scheduled by the custodian.
- [ ] CI on the tag is green (`gh run list --event push --limit 3`).

## Never on release day

- No dependency change, no config change, no "quick fix" between Part M and the tag: any code change re-runs the affected Part M rows first.
- No performance number anywhere in the tag message, the release body, the README or the limits file (`docs/08`: no numbers, no claim).
- No statement about macOS/Linux beyond "not in v0.1.0" (`docs/07`'s open gates).
