*Custodian's filing note (2026-10-23): the v0.2 scope proposal, drafted by the architect, read only at main 2ffbf957, for the human's decision and not a form; main moved after it only in records. It is put to the human as decision entry 137. Its documentation finding on KNOWN-LIMITATIONS items 4, 10 and 43 is noted on piece 1c's node. The run 08:52:05Z to 09:02:18Z by its transcript (Glob 2, Read 44, Grep 34; no Write, Edit or Bash). Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 263d55027a93264835cf8d34edb7c8a969e590fdb1d81ee7861a76ea16c1a8f3.*

---

Drafted: the v0.2 scope proposal, at main 2ffbf957

I read everything in the main checkout. I took HEAD to be 2ffbf957 from the session's git status, because I have no shell to confirm it. For the same reason I computed no sha256, and none appears here. Every `path:line` below is `@ 2ffbf957`. Ledger passages are cited by entry, round or item, never by line. I quote none of the human's words. Where I give the substance of a ruling, it is my paraphrase and is marked so.

**How I read item 5** (`state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:16 @ 2ffbf957`), paraphrase: v0.2 is cut from main once milestone 4, piece 1c and the redaction scan have landed, and it holds main at that point. This proposal also answers the earlier request for a v0.2 plan covering its contents, the felt sitting and the release notes (`state/directives/2026-10-11-direction-after-status-review.md:32 @ 2ffbf957`, item 4). The release notes are a red-line text and stay in the human's typed words (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:16 @ 2ffbf957`). §3 therefore lists what the notes must carry and drafts no words.

---

# The draft

## 1. What v0.2 holds

v0.2 is still the Prototype hero slice (`docs/07_Roadmap.md:9 @ 2ffbf957`), shipped as a Windows installer, with its limits declared. It does not claim Prototype exit. ADR-029's scan-progress debt is due before that exit (`docs/README.md:67 @ 2ffbf957`) and is unscheduled. It makes no performance claim.

### A. Already on main since v0.1.0 (merged; it ships whatever else is decided)

| Capability a user can see | Delivered by (PLAN node, PR) | KNOWN-LIMITATIONS |
|---|---|---|
| The Map Studio frame: regions, panel toggles, attention strip, status bar | `shell-migration-milestone-1`, #195 (`PLAN.yaml:3106-3117 @ 2ffbf957`) | item 18 retired |
| Selection and scope: Select tool, a selection that survives filter and pan, hidden count, stated export scope | `shell-migration-milestone-2`, #217 (`PLAN.yaml:5033-5044 @ 2ffbf957`) | 40, 41 |
| Command bar (Ctrl+K), slash commands, `/filter` with field completion, filter cards switched on and off | `shell-migration-milestone-3`, #234 (`PLAN.yaml:5051-5061 @ 2ffbf957`) | 45, 46 |
| MultiPolygon, Point, LineString and MultiLineString read, drawn and picked | `geometry-types-beyond-polygons`, `geometry-points-cut`, `geometry-lines-cut` (`PLAN.yaml:1370`, `:2279`, `:2298 @ 2ffbf957`) | 31–38 |
| GeoParquet 1.0.0/1.1.0: no `crs` key opens as OGC:CRS84; a latitude-first CRS opens under the format's x,y rule (ADR-032); the CRS form after `engine.format_default_contradicted` | Brief A nodes; `shell-crs-form-for-format-default-contradicted`, #214 (`PLAN.yaml:4854-4864 @ 2ffbf957`) | item 2's on-main paragraph (`KNOWN-LIMITATIONS.md:60 @ 2ffbf957`) |
| A file with no `id` column opens with session-only identity | `briefa-p3-p6` (`PLAN.yaml:598 @ 2ffbf957`) | item 3's on-main paragraph (`KNOWN-LIMITATIONS.md:70 @ 2ffbf957`) |
| Datasets in degrees are drawn; they cannot be published | `crs-unit-fact-and-bounds` (`PLAN.yaml:1578 @ 2ffbf957`) | 17, 21 |
| A source change ends the session (detector plus the advisory watcher, Windows) | `engine-source-change-watcher` (`PLAN.yaml:2205 @ 2ffbf957`) | 19, 23–28 |
| Filter and style changes kept on this machine across a crash | `b2-piece-1b-recording`, #222 (`PLAN.yaml:5240-5250 @ 2ffbf957`) | 43 |
| Current view exports the area the map shows | `export-current-view-after-unreported-fit`, #219 (`PLAN.yaml:4566-4576 @ 2ffbf957`) | item 42's on-main note (`KNOWN-LIMITATIONS.md:194 @ 2ffbf957`) |
| The approval dialog states the pending attempt's expiry | `publish-approval-ttl-ten-minutes` (`PLAN.yaml:5649 @ 2ffbf957`) | — |
| A window closed mid-publish leaves no staging folder (the exit drain) | `publish-attempt-lifecycle-src-tauri` (`PLAN.yaml:2942 @ 2ffbf957`) | 30 |
| The map refills after a resize; the status bar keeps one height | `shell-map-refill-after-resize`, `shell-status-bar-one-height` (`PLAN.yaml:5136`, `:5172 @ 2ffbf957`) | 39 retired |
| Bundles published by v0.2 carry the zoom-anchor fix and the partition-offset checks | PR #53, PR #128 | 16, 29 (`KNOWN-LIMITATIONS.md:168-188 @ 2ffbf957`) |

### B. From the three pieces in flight

| Capability a user can see | Delivered by | KNOWN-LIMITATIONS |
|---|---|---|
| Every product publish scans every staged file before the rename. A finding refuses the publish by name (`publish.redaction_finding`). A viewer file is skipped only when its bytes match the viewer build's scanned record (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:47-51 @ 2ffbf957`, with Amendment 3 item 6's amended first bullet). Its limits are `:53-62` | `bundle-redaction-scan-not-in-product-publish`, #241 (`PLAN.yaml:5428-5444 @ 2ffbf957`) | item 47 (W6′; a branch fact, `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:796 @ 2ffbf957`) |
| PR A: the Feature tab shows every projected column of the inspected feature, with the null marker and the not-held state | `b1-shell-half` (`PLAN.yaml:2353-2369 @ 2ffbf957`); form §2.2 (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:184-229 @ 2ffbf957`) | 51, 52 (`…MILESTONE-4-PREREGISTRATION.md:794 @ 2ffbf957`) |
| PR C: a Table tab in Activity with the three scopes, a count line and Cancel | form §2.4 (`:278-322`) | KL-1, KL-2, KL-5 (`:413-420`) |
| PR B: colour by category over a projected text column, with its legend. The cases come from one bounded first-scope query (OPEN-16 (b), Amendment 5 `:1126`). The export carries the `match` | form §2.3 (`:231-276`) | KL-3, and an "On main" note on item 4 |
| 1c step 1: Save project (linked): project identity, an atomic `project.spatial`, the saved-here mark | `b2-piece-1c-save-and-reopen` (`PLAN.yaml:5342-5358 @ 2ffbf957`); form `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:138-144`, `:441-458 @ 2ffbf957` | 48–50 (K-2 to K-4; `…MILESTONE-4-PREREGISTRATION.md:797 @ 2ffbf957`) |
| 1c step 2: Open project: containment checked at open, the copy-or-same question, the second-open refusal, the changed-file notice, re-link | same form, `:460-474` | same |
| 1c step 3: the recovery offer after a crash | same form, `:476-490` | same |

PR order is A, then C, then B (`…MILESTONE-4-PREREGISTRATION.md:169 @ 2ffbf957`). What these pieces may not claim binds the release text as well: no undo, no lineage, no replay, no snapshot, one dataset per project, a click selection never saved (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:146-157 @ 2ffbf957`), and B1 never called complete (`…MILESTONE-4-PREREGISTRATION.md:153-159 @ 2ffbf957`).

## 2. What v0.2 excludes, why, and where each goes

| Excluded | Why | Where it goes |
|---|---|---|
| A macOS or Linux artifact or support claim | docs/07's hardware gate is open (`docs/07_Roadmap.md:17 @ 2ffbf957`). PORT-2 gives CI L1 only | platform lane: `port-2-macos-l1-and-app-dirs` ready (`PLAN.yaml:3410`), `port-3`/`port-4` proposed (`:3428`, `:3446`), `platform-hardware-validation` unscheduled (`:1980`). If PORT-2 lands first, only item 1's levels paragraph changes |
| Code signing | entry 77's chain waits on a CI-built release | `signpath-application-draft` (`PLAN.yaml:1389`), then `entry-77-code-signing` (`:725`). v0.2 ships unsigned (item 14) |
| Bundled VC++ runtime | static CRT declined (69a stands, `PLAN.yaml:1814 @ 2ffbf957`) | declared (item 15) |
| LOD tier selection; a fuller overview view | the node is not placed | `lod-tier-selection` (`PLAN.yaml:835`); item 7 stands |
| A filter carried in a bundle; bundle v2; CLI replay | B3 is not placed | `briefb-b3-publish-v2` (`PLAN.yaml:1887`); item 8 stands |
| Snapshot, lineage file, compaction, restore, replay, file association, more than one dataset per project | outside 1c by its form (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:146-157`) | later B2 stages (`briefb-b2-save-reopen`, `PLAN.yaml:1869`); notebooks replay is Alpha (`docs/07_Roadmap.md:40`) |
| True scan progress | ADR-029 has no route | `decision-adr-029-scan-progress-route` (`PLAN.yaml:1426`), unscheduled |
| Attributes on hover; per-case colour edits | milestone 4 OPEN-3 (a) and OPEN-6 (a) | KL-7 (item 52); a later node |
| Shell milestone 5 (Problems, Jobs) | not placed; it follows `b1-shell-half` | `shell-migration-milestone-5` (`PLAN.yaml:5102`) |
| Declaring identity for a session-tier file | not placed | `identity-declaration-route-for-session-tier` (`PLAN.yaml:4689`); item 3's note states it |
| Publishing data in degrees | the viewer has no degrees path | item 21 |
| MCP, notebooks, plugins | Alpha | docs/07 Alpha |
| The proposed-but-unplaced defect nodes | none is placed | the human triages. Each one ordinary use can reach gets a KNOWN-LIMITATIONS line if it is left out. See O6 |

## 3. Preconditions before the tag, with the record that shows each one met

**Pieces and merges**
- [ ] #244 (the F7 row) merged immediately before #241. Record: PLAN `walkthrough-row-f7-cli-refusal` done with its `{pr}`.
- [ ] #241: R2 by the human from the installer at the final head (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:704`, `:878 @ 2ffbf957`). If the architect's recommended fix to `read_build_record`'s doc comment on `cut/bundle-redaction-scan` lands first (`PLAN.yaml:5443` names it), R1 runs again at the new head. Then the merge. Record: the form's next amendment, then the node done.
- [ ] Milestone 4 PR A, then PR C, then PR B, each gated and merged. Record: the form's amendments, and `b1-shell-half` done.
  - PR B's merge waits for `record-step-style-match-widening` to be on main (`…MILESTONE-4-PREREGISTRATION.md:265`). That node is proposed and unplaced (`PLAN.yaml:5700-5716`).
  - PR B's suites need #241 merged, because they include the viewer build's scan (`:672`).
  - OPEN-18, OPEN-19 and OPEN-20 are the human's (`PLAN.yaml:2368`).
- [ ] 1c steps 1, 2 and 3, each gated and merged.
  - Step 1 still owes O1 (after O0, which waits for the human's online-only file), P1 to P6 (after PR A merges) and R1 (after #241 merges) (`PLAN.yaml:5357`). Its `kernel/README.md` edit waits for #241 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:547`).
  - Step 2 needs the human's OPEN-S2-1 to OPEN-S2-4.
  - Record: ADR-036's appended amendment and ADR-022 Amendment 2 in step 1's first commit; each step's closing amendment.
- [ ] The scope additions §5 rules in (O4). Record: their nodes done.

**Red-line texts (the human's typed words)**
- [ ] B1's close: `entry-79-b1-consult-items` (`PLAN.yaml:1206-1222`), at which the human accepts ADR-023's 2026-09-29 Amendment and ADR-021's Note together (see O5). Record: a directive file, and the regenerated `docs/README.md` row (`docs/README.md:61` reads Proposed today).
- [ ] The ADR-017 note for the product redaction gate (`adr-017-note-product-redaction-gate`, `PLAN.yaml:5717-5733`). Record: the note appended to ADR-017.
- [ ] Release notes and tag message in the human's typed words. They must carry:
  - the installer, its SHA-256 and the KNOWN-LIMITATIONS link above the fold;
  - what v0.2 is;
  - the limits digest;
  - licences and the AGPL §6 route;
  - the build commit and the docs-only `git diff --stat`;
  - item 29's line, which round 25, item 4 binds to "the next release's notes" (carried at `PLAN.yaml:1828`);
  - nothing that presents ADR-011, ADR-012, ADR-023 (unless accepted), ADR-024 or ADR-029 as settled.
- [ ] The human's typed approval to publish (2026-10-11 direction, item 4).

**Strings and wording**
- [ ] The sitting answers N1 to N7, and the fixes are merged before the candidate build. N1 to N7 change shipped strings, so they are code (`sitting-wording-n1-to-n7`, `PLAN.yaml:5768`).
- [ ] P6 sights: milestone 4's OPEN-14, 1c's S1 to S18 and #241's W8. Every `[P6 placeholder]` on a shipped surface is either sighted and replaced, or explicitly accepted (OPEN-2 below).

**The sitting (the human gives its date; until then no release is scheduled: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:16 @ 2ffbf957`)**
- [ ] `operator-sitting-queue` (`PLAN.yaml:5530-5546`): Parts P (points and degrees), T, W, Y, Z, AA and AB, Part G's G3 and G8, L5, and the sights. Record: each Part's result log filled, verdicts verbatim.
- [ ] What joins on the merges: #244's F7 rows, Part AC (milestone 4, rows across its three PRs), and 1c's one Part per step. Record: the same.
- [ ] Each finding is fixed and merged, with the touched rows run again, before the candidate build.

**The release cut**
- [ ] A release record `RELEASE-0.2.md` with an architect consult, committed before any release code, on the human's approval of this proposal's answers. AUTONOMY §11 names `RELEASE-<version>.md` as the hash record (`AUTONOMY.md:203`).
- [ ] A version-bump piece, landed before the candidate build. It touches `frontends/shell/src-tauri/tauri.conf.json:4`, `frontends/shell/src-tauri/Cargo.toml:13`, `frontends/shell/package.json:4`, and the own-package lines `frontends/shell/src-tauri/Cargo.lock:4217` and `frontends/shell/package-lock.json:3`, `:9`. Those are lockfile lines, but no dependency moves. Every milestone 4 and 1c form declares the lockfiles unchanged, so this cannot ride inside them.
- [ ] `release-artifacts.yml` dry run green, its record slot filled. The slot reads EMPTY today (`.github/workflows/release-artifacts.yml:34-35 @ 2ffbf957`).
- [ ] The candidate artifact built and hashed into `RELEASE-0.2.md`.
- [ ] The release walkthrough Part on a clean profile, the Part M successor (`frontends/shell/MANUAL-WALKTHROUGH.md:837 @ 2ffbf957`). It is run by the human with a filled log, and includes:
  - install and hash;
  - the three notice files;
  - opens in EPSG:2056, in EPSG:3857 and on a format-default file;
  - filter, cards, select, attributes, table, colour by category;
  - save, close and reopen, and the recovery offer;
  - a publish through the scan;
  - the bundle opened in a browser;
  - M12 mode 3;
  - M13's two bracketed values (`m13-bracketed-values`, `PLAN.yaml:1224-1240`).
  No tag comes before this Part (`RELEASE-DAY-CHECKLIST.md:13 @ 2ffbf957`).
- [ ] KNOWN-LIMITATIONS, README and QUICKSTART rewritten for the v0.2 artifact after the Part, with KNOWN-LIMITATIONS last. The `[M:` bracket grep in `RELEASE-DAY-CHECKLIST.md:14` prints nothing. Today:
  - the KL header and its move rule are v0.1.0's (`KNOWN-LIMITATIONS.md:1`, `:200-203`);
  - `README.md:23` and `:39`, and `QUICKSTART.md:1` and `:10`, are v0.1.0's;
  - QUICKSTART's identity bullet changes with the next release (`PLAN.yaml:1828`).
- [ ] `git diff --stat <build commit> <tag>` shows documentation only, recorded in `RELEASE-0.2.md`.

**The tag and after (`RELEASE-DAY-CHECKLIST.md:37-89`)**
- [ ] The tag (the human). The run on the tag green; the local hash equals the job summary's.
- [ ] The artifact rows on the attached build, per OPEN-1.
- [ ] Release create and upload (the human), then the logged-out check.
- [ ] The evidence archive attached (the human's click, `AUTONOMY.md` §12).
- [ ] A closing amendment in `RELEASE-0.2.md`, references and hashes only. The merge-back if a branch was used. CI green on the tag. The nodes riding v0.1.1 re-targeted (O1).

## 4. The order of what remains, and the human's part at each step

1. **Now, through the human's listed day** (`state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md:26 @ 2ffbf957`).
   - Human: free port 5180, run #241's R2, provide O0's file, click #244 then #241, give the sitting's date. Answer this proposal.
2. **Slot 1:** milestone 4 PR A gates, then the merge; then PR C (re-sweep, code, gates, merge).
   - Human: each click; OPEN-18 to OPEN-20.
3. **Slot 2:** 1c step 1 completes (O1, P1 to P6, R1), then its gates and merge.
   - Human: the click.
4. **protocol/ is one piece at a time** (rule (00); `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:563-566`). `record-step-style-match-widening` runs between two 1c steps, then PR B can merge.
   - Human: place the widening (1c's OPEN-A2, the same question), and click PR B.
5. **1c steps 2 and 3**, with their forms committed from the drafts ahead.
   - Human: OPEN-S2-1 to OPEN-S2-4; each click.
   - The covering-case S1 runs where rule (00) puts it (`…weekend…md:8`). Session-log redaction runs after 1c's src-tauri group (`…weekend…md:10`).
6. **B1's close and the ADR-017 note.**
   - Human: the typed acceptance and the typed words.
7. **The sitting**, then fixes for its findings.
   - Human: the date, the verdicts, N1 to N7, the P6 sights.
8. **The release cut** (`RELEASE-0.2.md`, the version bump, the candidate, the release Part, docs, notes, tag, upload, archive).
   - Human: approve the release record; rule OPEN-1 to OPEN-5; run the release Part; type the notes and the tag message; tag; approve publishing; create and upload the release; attach the archive.

## 5. Real scope choices (cost in pieces, gates and the human's acts; no durations)

- **O1. Fold v0.1.1 into v0.2, or cut v0.1.1 first.**
  - Background: v0.1.1 has no forcing content of its own (`PLAN.yaml:1828`). M13's re-test, the SignPath draft and the first CI-built release all ride it (`:1231`, `:1396`). The workflow's note names the v0.1.1 tag (`.github/workflows/release-artifacts.yml:31-32`).
  - Cutting v0.1.1 separately costs a second full release cut: a walkthrough on its artifact, docs, notes and a tag, for a subset of main.
  - **Recommend: fold.** The human re-targets those three nodes to v0.2, and §11's "from v0.1.1" is read as "from the next release" (the human confirms that reading).
- **O2. 1c whole (steps 1 to 3), or steps 1 and 2 only.**
  - Stopping at step 2 saves one step's form, PR and gates. Item 43's "nothing offers them back" then stands, and 1b's pre-committed `recover` keeps no product caller in a release.
  - Save without reopen is not coherent, so step 2 is the floor.
  - **Recommend: whole.**
- **O3. Milestone 4 whole, or PRs A and C only.**
  - Dropping PR B removes the protocol widening, the viewer-scan dependency and OPEN-18 to OPEN-20 from the critical path. But item 4's "styling is by literal only" then stays true, and the hero slice's "style it" step is unchanged from v0.1.0.
  - **Recommend: whole.**
- **O4. The two newly graded fixes.**
  - `covering-case-collision-binds-other-column` (S1, `PLAN.yaml:4262`). Per the 2026-10-05 product-first direction, item 5 (`state/directives/2026-10-05-product-first-direction.md:21`), S1 includes a silent wrong result. The human held earlier releases for open S1s (`state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md:18`).
  - `session-log-token-redaction-rests-on-page-code` (S2, `PLAN.yaml:5445-5461`). It is security-posture text: the `state.rs` comment states a guarantee that rests on page code.
  - **Recommend: both in v0.2.** If the S2 one is left out, the release text says nothing about the token and the log.
- **O5. ADR acceptances before the tag.**
  - v0.2 ships attribute projection under ADR-023, which reads Proposed (`docs/README.md:61`), and a publish gate that ADR-017 does not yet record. Accepting at B1's close and appending the ADR-017 note costs two typed acts from the human. Otherwise the notes must name both as unrecorded. ADR-024 stays Proposed either way (`docs/README.md:62`), and the notes say so.
  - **Recommend: both before the tag.**
- **O6. The proposed S2 nodes that reach the Windows artifact.** These include `windows-case-fold-non-ascii`, `shell-admit-describe-failure-closes-open`, `b1-session-ordinal-refusal-wording` and `filter-identity-alias-ambiguous-guidance-line-and-note`, whose KNOWN-LIMITATIONS note is already owed.
  - **Recommend:** none blocks v0.2 unless the human grades it S1. Each one ordinary use reaches gets its KNOWN-LIMITATIONS line before the tag.

---

# OPEN items (the human's)

- **OPEN-1. Which artifact ships under §11.**
  - The conflict: §11 makes the asset the tagged commit's CI build (`AUTONOMY.md:203`). The checklist forbids a tag before the walkthrough (`RELEASE-DAY-CHECKLIST.md:13`) and forbids attaching a build nobody ran (`:22`). The docs written after the walkthrough land above the walked commit, so the tag's CI build is a new build of a tree whose code is unchanged. I claim nothing about reproducible bytes.
  - (a) Walk the CI artifact of candidate commit X. Docs-only commits follow, then the tag at Y. Attach Y's CI build, after re-running the artifact rows on it (install, hash, launch, notices, M12 mode 3). Those rows are declared in `RELEASE-0.2.md` before the walk, and `git diff --stat X Y` is the proof.
  - (b) An rc tag, `v0.2.0-rc.1`. `v*` triggers on it, it is walked, and the final tag repeats (a)'s rows. This costs one more outward-facing tag.
  - (c) Set §11 aside for v0.2.
  - **Recommend (a).**
- **OPEN-2. `[P6 placeholder]` marks in a release.** By a Grep count, 23 non-test product files under `frontends/shell/src`, `frontends/shell/src-tauri/src`, `kernel/src` and `engine/src` carry more than a hundred lines with the mark at main (lines, not distinct strings; some may be comments). Many of those strings render in the app.
  - (a) Every marked string on a shipped surface is sighted at the sitting and replaced before the candidate.
  - (b) Strings left unsighted ship with their mark, plus one KNOWN-LIMITATIONS line saying marked text is provisional wording.
  - **Recommend (a) for the hero path and the new 1c and milestone 4 strings, and (b) for the rest, by the human's list.**
- **OPEN-3. Freeze main, or a `release/0.2.0` branch** (entry 83's pattern, `RELEASE-DAY-CHECKLIST.md:37`; `RELEASE-0.1.md:1212`).
  - **Recommend the branch,** cut from the candidate commit, so other lanes keep moving on main. It costs a merge-back and row re-classification if fixes land on it.
- **OPEN-4. The tag name and the flag.** Tauri's version is semver (`tauri.conf.json:4`), so **recommend `v0.2.0`.** Pre-release or not is the human's choice (`RELEASE-DAY-CHECKLIST.md:88`). v0.1.0 was marked pre-release (`RELEASE-0.1.md:1284`).
- **OPEN-5. A fresh local account or a clean VM for the release Part.** Item 15 records that a machine without the VC++ runtime was never observed (`KNOWN-LIMITATIONS.md:154-158`).
  - A VM is the only way to observe that, and it costs the human a VM.
  - **Recommend:** a fresh account, as v0.1.0 used, unless the human has a VM. In that case add one row for the missing runtime.

# Findings on the way (Documentation, must-fix in the piece that owns each)

- Items 4 and 10 say nothing persists and there is no project file (`KNOWN-LIMITATIONS.md:72-77`, `:118-122`). Item 43 says nothing offers the crash file back (`:400`). After 1c's steps, the on-main reading of these becomes untrue. 1c's KL group names only K-2 to K-4 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:513-517`). An untrue limit is Correctness at 1c's gates. I recommend that steps 1 and 3 each add the on-main note or retirement, in item 3's pattern.
- Item 15 calls the VC++ question an open decision (`KNOWN-LIMITATIONS.md:157`). The PLAN records 69a as standing (`PLAN.yaml:1814`). Fix this at the release rewrite.
- `release-artifacts.yml` names the v0.1.1 tag (`:31-32`). `RELEASE-DAY-CHECKLIST.md` is written for v0.1.0 throughout (`:1`, `:19`, `:86`). Both are updated in the release cut.
- The walkthrough has two Parts headed P (`frontends/shell/MANUAL-WALKTHROUGH.md:1455`, `:1614`). The sitting script tells them apart. The release Part should take a fresh letter.

# What I could not settle

- Six Parts have blank result logs at main that are not on the queue's list: Q (`MANUAL-WALKTHROUGH.md:1522-1531`), R (`:1556-1564`; its own proposed node, `PLAN.yaml:3823-3839`), S (`:1595-1606`), U (`:1747-1766`), V (`:1781-1794`) and X (`:1806-1811`). I could not tell whether each is owed, waived or discharged elsewhere. If owed, each joins the sitting before the candidate.
- I could not confirm the exact numbers PR C and PR B give KL-1, KL-2, KL-3 and KL-5, or the Part letters 1c's steps take; both are set at their re-sweeps.
- Whether §11's "from v0.1.1" binds v0.2 if v0.1.1 is never cut: that is the human's reading (O1).
- Whether DECISIONS-PENDING entry 74's question (tag after the whole walkthrough, or after part of it) should be re-asked for v0.2. I recommend answering it now as (a), the v0.1.0 practice.
- HEAD at 2ffbf957: no shell.
