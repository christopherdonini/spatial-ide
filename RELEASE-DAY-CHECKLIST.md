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
- [ ] Topics set: `gh repo edit --add-topic geoparquet --add-topic gis --add-topic tauri --add-topic duckdb --add-topic rust --add-topic spatial` (adjust; topics are metadata, not claims).
- [ ] Homepage: none, or the repository's own README (no marketing site exists). `gh repo edit --homepage ""`.
- [ ] "Releases" and "Packages" sidebar items as GitHub sets them; nothing else changes. Visibility is NOT touched (already public since 2026-08-03; ADR-009's corrigendum).

## 3. README top (custodian drafts, human sights)

- [ ] `README.md`'s first screen answers: what this is (two paragraphs, `docs/00`), what v0.1.0 is (the hero slice, the whole claim), the limits link (`KNOWN-LIMITATIONS.md`) BEFORE the install section, the install line with the artifact name, no performance statement, the licence block. Nothing above the fold describes the installed application except from Part M's record.

## 4. The tag (human)

- [ ] Tag message finalized from the draft (`RELEASE-0.1.md`'s last amendment names the draft's location); every sentence verifiable against a file in the tree.
- [ ] `git tag -a v0.1.0 -F <tag-message-file> <commit>` — annotated, on the intended commit; `git tag -v` is not expected (no signing key is declared for this project; the DCO sign-off is per commit).
- [ ] `git push origin v0.1.0`.
- [ ] `git describe --tags` on main prints `v0.1.0`.

## 5. The GitHub release (human)

- [ ] `gh release create v0.1.0 --title "Spatial IDE v0.1.0" --notes-file <release-body-file> "frontends/shell/src-tauri/target/release/bundle/nsis/Spatial IDE_0.1.0_x64-setup.exe"` — the body from the finalized draft: the installer, its SHA-256, and the `KNOWN-LIMITATIONS.md` link ABOVE THE FOLD (the first three lines); then what v0.1.0 is; then the limits digest; then licences and the corresponding-source route.
- [ ] After upload: download the asset back and re-hash it — the SHA-256 on the release page equals the file's (`gh release download v0.1.0 --pattern "*.exe" --dir <tmp>` then hash).
- [ ] The release is NOT marked pre-release or draft unless the human decides so (a decision, queued if unsure).

## 6. After the tag (custodian, mechanical)

- [ ] `RELEASE-0.1.md` gains the closing amendment: the tag's commit, the release URL, the asset's SHA-256, Part M's verdicts pointer; `CUT-STATE.md` archived to `.cut-archive/` (Rule 10).
- [ ] `NEXT-CUT.md`'s three post-release candidates (ADR-032; LOD, ADR-031; the geometric-protection piece, entry 66 (b)) presented for the human's sequencing — nothing scheduled by the custodian.
- [ ] CI on the tag is green (`gh run list --event push --limit 3`).

## Never on release day

- No dependency change, no config change, no "quick fix" between Part M and the tag: any code change re-runs the affected Part M rows first.
- No performance number anywhere in the tag message, the release body, the README or the limits file (`docs/08`: no numbers, no claim).
- No statement about macOS/Linux beyond "not in v0.1.0" (`docs/07`'s open gates).
