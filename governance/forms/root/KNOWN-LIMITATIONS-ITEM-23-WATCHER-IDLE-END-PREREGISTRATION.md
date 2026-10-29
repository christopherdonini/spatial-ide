# KNOWN-LIMITATIONS item 23: where the advisory watch does not end the session — five-line short form (`AUTONOMY.md` §21d)

Proposed path: `KNOWN-LIMITATIONS-ITEM-23-WATCHER-IDLE-END-PREREGISTRATION.md`. Committed before any change, with the node, per the short-form discipline. §A's words are the architect's draft under item 2 of state/directives/2026-10-11-direction-after-status-review.md (AUTONOMY.md §31); the human approves or replaces them here, recorded as Amendment 1 (class 5), before the worker applies them.

```
Authority: PLAN node known-limitations-item-23-watcher-idle-end; state/directives/2026-10-17-227-m1-watcher-visible-open-1-a-item-23-node-228-merged.md, item 3; state/consults/2026-10-17-source-changed-post-reopen-routes-watcher-visible-architect-draft.md, its findings outside scope (the KNOWN-LIMITATIONS item 23 finding); state/directives/2026-10-11-direction-after-status-review.md, item 2. Reuse index (tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, printed byte for byte as the custodian's brief carries it): for source watcher, exit 1, `No prior art recorded for "source watcher". Research it before planning an implementation.`; a miss, noted; nothing is implemented.
Scope: KNOWN-LIMITATIONS.md (item 23 only: its text and its one HTML source comment; no other item edited, no renumbering); PLAN.yaml (this node's record); 2 files; declared line budget <= 40 changed lines by §21c's counting, this form excluded.
Change: item 23's text and source comment are replaced by the words Amendment 1 records (§A's draft until then), byte for byte by script; no visible Corrected sentence, because the item is not in the v0.1.0 section and the watcher is not at the v0.1.0 tag (§D).
Tests+mutation: none added or changed (documents only); the reviewer checks the words byte for byte against Amendment 1, every clause of §B at the PR's base, every pin by recomputation, §D's tag rows, and that no other item and no line outside Scope changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; a document states what unchanged code does on main.
```

### §A. The item (draft words for the human, §31)

Item text (replacing item 23's eight lines; 4-space continuation as the file has it):

    23. **Where the advisory watch does not end the session, a pan that stays inside what is already
        resident issues no fresh query, so the app shows nothing of a change until a query is next
        issued.** On Windows, a change to the open file that the watch reports ends the session when
        the notification arrives, with no query needed, even while the app is idle: the session-ended
        block appears and the canvas is cleared. The rest of this item is about a change the detector
        (item 19) can see that the watch does not report — a dataset whose watch is not armed (off
        Windows, item 24, or where arming failed), a write not yet signalled (item 25), a rename or
        deletion farther up the tree or a repointed link (item 26) — and about a session-ended event
        that does not reach the app (item 28). For those, the app learns of the change only from a
        query that is actually issued; a small pan well inside the resident tiles issues none, so the
        canvas keeps showing what it showed before the pan and a hover there still answers normally.
        The refusal arrives once a query is issued — panning further out shows it — so for that case
        this is a delay in noticing, not a missed detection; it says nothing about a change item 19
        itself records as undetectable, which no later query surfaces either.

Source comment (one line, indented 4 spaces under the item, replacing the current one; every pin on one line; M = 607d8d166f2667b1b3e9bb9e501b57b4938328b9, written in full):

    <!-- [The human's wording, approved | The human's own words, given | Drafted by the architect; accepted as it stands] in KNOWN-LIMITATIONS-ITEM-23-WATCHER-IDLE-END-PREREGISTRATION.md Amendment 1; drafted by the architect under item 2 of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-17-227-m1-watcher-visible-open-1-a-item-23-node-228-merged.md, item 3. Revised <date>: until this revision the item said that a change the detector can see goes unnoticed until a query is next issued; that held when it was written (PR #109) and stopped holding on Windows when the advisory watcher merged (PR #127). Neither the item nor the watcher is at the v0.1.0 tag (the form's §D). Sources on main: kernel/src/skp.rs:1140-1168 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:1dc427302222140159e995d59cbf0101137be6e8a3426f4b8d4fd213ad9eaa06 (the watcher's sink ends the generation on a signal, no query); kernel/src/skp.rs:914-926 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:c6f9be8cf603fa8dc178181c2348e084f75790f2ebd54fc3bd7d33448fc41b11 (one event queued, tickets cancelled); engine/src/watch.rs:86-103 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:2787ddb6ac7a2c371c68d52fdb610c9703c9115a114dc0d70aa96e1bc465d3e9 (the Windows arm; checks-only off Windows); engine/src/watch.rs:603-636 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:dc201d8dad90cd07c3a9d75a502d622943e34b5f06941e619178298ad93f964b (canonicalized path; checks-only where arming fails); engine/src/watch.rs:653-654 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:cd61973db67265d689af2c7e6af4715dd12e0e8838778870fc3a07429df836be (the parent filter: name, size, last write); engine/src/watch.rs:695-704 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:cf63150fb689024ef64adc09666fabd198532450af902830894847f0fbb041be (the grandparent filter: directory name); frontends/shell/src-tauri/src/lib.rs:286-294 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:dc7b70f2e1f1cb6f1d1ceb0720d7ec83a87a77ebfa08d8610eda80f10d12f6fd (PlatformWatch, the product arm); frontends/shell/src-tauri/src/lib.rs:302-315 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:5bc60d44e791c4db5b46e45cbd0e61d19a9768af9cac6a7d19d6a8c15f6edca5 (the event emitted to the webview; a failed emit logged); frontends/shell/src/App.tsx:1366-1397 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:5df17c60b2220d21f2d24bfc0d7ec4a33adb4c22fbcb482469dd55dc910473ac (the listener; a failed registration logged); frontends/shell/src/App.tsx:781-802 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:7c57ebc2a51a83f1136cdce9e1d044f0476f1cc4b19d09c234a9dc37ea4d6987 and frontends/shell/src/App.tsx:750-769 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:02ee2a656d80e43b011dc53bc497b8b6ff4ad836e4345aa140987f1fe164fc5a (routed to the live manager); frontends/shell/src/App.tsx:1507-1517 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:dbaca5956dd122e050f1ed039ad1b0926556451fc5dadb3d90c040b330c6ffe4 and frontends/shell/src/App.tsx:1588-1589 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:af52f1a4bffa172998b98f9830d9e5def0be56c45311e3bfe9e69e1de390d312 (the tiled arm is the shipped default); frontends/shell/src/streaming/tileViewportStreamManager.ts:735-748 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:069236a63de40703cf4f021215af7af91172b0dab0fb256421d2f62d33f03f83 and frontends/shell/src/residency/candidateArmSession.ts:1081-1095 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:0128ef1fe80f0a3eee871c0a9219943659ec57cc6577f397f3cbfd2127a342dc (every resident tile cleared, then the App told); frontends/shell/src/App.tsx:687-699 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:46783dc729075210b794f7dbbe3aab86e6abe558ba3419cb8df0bb3e06f3b87f and frontends/shell/src/App.tsx:2170-2174 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:49042cd9a456e8d63971f95f873790346248448e7d7df28dce369186de70ff98 (the session-ended block and the hover latch); frontends/shell/src/streaming/tileViewportStreamManager.ts:494-505 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:1b1e3ffcae11bf7633595be731e3258097ac87ef1d2ea567bc19d474b107f381 (a query only for a covering tile neither tracked nor resident); frontends/shell/src/canvas/pick.ts:104-106 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:07368a6681b10fb24575938b87d6c0ec2cef939e9da3d436f5c4f32ba2441329 (the hover refuses only once the session has ended); kernel/src/skp.rs:1436 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:8a3283c12d21190899182ea9cb8d0a1318ef878ed1df250f3a6a72eb269eb7d5 (a later query refused under an ended generation); kernel/src/skp.rs:1449-1455 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:e9c1fc2216056c966e6e70b08bd19c9fa03f628aebda3d4d58b133c7185fe810 (the pre-check ends the generation); frontends/shell/src/streaming/tileViewportStreamManager.ts:940-958 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:69102175086e5de26012c7e96d1d3e5a230178401e1ef0b80b5f08cae52dc043 (that refusal ends the session in the app); frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:954 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:73b0c6881dd286d7570ceb6b49a9a9a6cacef7ec3a87437c392fc8c662243fe2 (Amendment 11 (b), the small-pan/no-query finding, referenced, not quoted); engine/src/descriptor.rs:13-18 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:e8e6aa1b3b3572eec4cf7baf6da35d1de5d712877f05a7faaec6a1a6b2029b20 (the change the preregistration registers as not detected); frontends/shell/MANUAL-WALKTHROUGH.md Part N row N8, by name (sourcing "This is not a missed detection"). Run evidence: state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:107-120 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:582da8d8edacc396d5ba127c409907c2e567b49d9bd5c3a7c665fd11cee5b698 (an idle mtime touch ended the session with no query). Not covered (item 2c): an end that lands inside one request round trip of a query; the baseline arm, which only a dev-only switch selects. -->

### §B. Clause check

M = 607d8d166f2667b1b3e9bb9e501b57b4938328b9, read by the architect. T = b391e43622056324c56d35cc33065305140a8415; the item sits in the on-main section and makes no claim of T. §D confirms by script that neither the item nor the watcher is at T.

| # | Clause | Evidence at M | At T | Holds |
|---|---|---|---|---|
| C1 | Where the watch does not end the session, a pan inside what is resident issues no fresh query | tileViewportStreamManager.ts:494-505 (a query only for a tile neither tracked nor resident); the tiled arm is the shipped default (App.tsx:1507-1517, :1588-1589); observed: OWNER-INVALIDATION Amendment 11 (b), run 4 | n/a | yes |
| C2 | …so the app shows nothing of a change until a query is next issued | the session-ended state is set only by handleSessionEnded (App.tsx:687-699), reached from a manager's end, the pre-check catch, or the event route (App.tsx:664-666); with no event and no query, none runs | n/a | yes |
| C3 | On Windows, a change the watch reports ends the session when the notification arrives, with no query needed, even while idle | skp.rs:1140-1168 → :914-926; watch.rs:86-103; lib.rs:286-294; run: the triage report :107-120; M11 at cf2434e6 (re-aim form Amendment 2 item 9) | no watch (§D1, §D2) | yes |
| C4 | …the session-ended block appears | lib.rs:302-315 → App.tsx:1366-1397 → :781-802 → :750-769 → tileViewportStreamManager.ts:763-765 → :735-748 → candidateArmSession.ts:1094 → App.tsx:1586 → :687-699; rendered at :2170-2174 | n/a | yes |
| C5 | …and the canvas is cleared | candidateArmSession.ts:1089 (`canvas?.clearAllTiles()`); the baseline arm's clearResidency (viewportStreamManager.ts:427-437) is dev-only and named not covered | n/a | yes |
| C6 | a dataset whose watch is not armed (off Windows, item 24, or where arming failed) | watch.rs:92-101; :603-636, :666-668, :683-709 return ChecksOnly; skp.rs:1261-1279 admits the dataset under checks-only | n/a | yes |
| C7 | a write not yet signalled (item 25) | only a pointer to item 25 (H2: a signal no later than the handle's close); no new claim | n/a | yes (it defers) |
| C8 | a rename or deletion farther up the tree, or a repointed link (item 26) | watch.rs:603-612 (canonicalized at arm), :653-654, :695-704 (two folders only); run: the re-aim form §2.4 (a junction repoint not seen while idle) | n/a | yes |
| C9 | a session-ended event that does not reach the app (item 28) | skp.rs:895 (`try_send`: a full queue drops it); lib.rs:308-312 (emit failure logged); App.tsx:1384-1391 (registration failure logged) | n/a | yes |
| C10 | For those, the app learns of the change only from a query that is actually issued | skp.rs:1436 (require_live refuses under an ended generation); :1449-1455 (pre-check); the post-check runs at a stream's end; descriptor.rs:7-9 | n/a | yes |
| C11 | a small pan well inside the resident tiles issues none | C1 | n/a | yes |
| C12 | the canvas keeps showing what it showed before the pan | the only clears on this path are C5's, reached only through an end (C2) | n/a | yes |
| C13 | a hover there still answers normally | pick.ts:104-106 (refuses only when sessionEnded) | n/a | yes |
| C14 | The refusal arrives once a query is issued; panning further out shows it | C10, and tileViewportStreamManager.ts:940-958 (a refused mint ends the session in the app) → C4 | n/a | yes |
| C15 | a delay in noticing, not a missed detection | C10 + C14; MANUAL-WALKTHROUGH Part N row N8, by name | n/a | yes |
| C16 | it says nothing about a change item 19 records as undetectable, which no later query surfaces either | descriptor.rs:13-18 | n/a | yes (unchanged from the current item) |

### §C. Not covered (item 2c)

- An end that lands inside one request round trip of a query, where the app may learn it from either route first.
- The baseline arm, which only the dev-only `setResidencyArm` switch selects.

### §D. Checks before commit (the custodian's script; STOP on any mismatch, and the draft returns to the architect, where item 8's form then applies)

1. `git ls-tree -r --name-only b391e43622056324c56d35cc33065305140a8415 -- engine/src/watch.rs` prints nothing. Positive self-test: the same command at M prints the path.
2. `git grep -n -E 'ReadDirectoryChangesW|SourceWatchArm|PlatformWatch|DatasetSessionEnded|dataset_session_ended' b391e43622056324c56d35cc33065305140a8415 -- engine kernel protocol frontends/shell/src frontends/shell/src-tauri/src` exits 1. Self-test at M exits 0. Print the rc each time.
3. `git show b391e43622056324c56d35cc33065305140a8415:KNOWN-LIMITATIONS.md | grep -c 'until a query is next issued'` prints 0. Self-test at M prints 1.
4. PR #127's merge commit, read from GitHub's record and written in full, is not an ancestor of the tag: `git merge-base --is-ancestor <it> b391e43622056324c56d35cc33065305140a8415` exits 1.
5. Every hash at M computed, over whole lines as committed, LF bytes.

### §E. Gates

- **Route.** A single combined reviewer gate (§21b), under proportional gates (state/directives/2026-10-05-product-first-direction.md, section 2).
- **What blocks.** Correctness or Evidence only. A clause untrue at the base claims a limit the code does not support, which is Correctness.
- **Wording blocks.** A block on the wording alone carries the reviewer's replacement words, each clause checked; the human answers under §31.
- **Documentation findings.** Fixed before the merge; no re-gate.
- **Overlap.** `source-changed-post-reopen-routes-watcher-visible` declares KNOWN-LIMITATIONS.md unchanged and edits MANUAL-WALKTHROUGH.md. The comment cites row N8 by name, which keeps its sentence in both versions. PR #227 shares no path. Whichever piece merges later merges main in before its last gate run.

### §F. Open for the human

- OPEN-1: approve or replace §A's words (§31). Item 23 is not marked as your wording. By item 3 you see them.
- OPEN-2: a release-notes line. Recommended: none. No release carried item 23 or the watcher (§D), and the v0.1.0 page's paragraph is for corrections (item 44's Amendment 1, OPEN-2). This piece does not touch published text.

## Amendments

*(Opens empty; append-only.)*

### Amendment 1 — the human's rulings on OPEN-1 and OPEN-2 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md`, item 2). References only.*

1. **OPEN-1:** §A's words are approved as drafted: the item text and the source comment. The source comment's bracket reads `The human's wording, approved`, and its `<date>` is the UTC date on which the words are applied, from `date -u +%F`.
2. **The lines, as the file takes them:** the item's 14 lines are §A's with their four-space block indent removed, so the item starts at column 0 and its continuation lines keep four spaces, as the file has it. The source comment's one line keeps its four leading spaces, its indent under the item, as §A's heading for it says. They replace item 23's eight lines and its one source comment line.
3. **OPEN-2:** no release-notes line. Neither the item nor the watcher is at the v0.1.0 tag (§D).
4. **Next:** one worker applies the words by script, byte for byte from §A, in `C:/dev/wt/kl23` on the branch `cut/known-limitations-item-23` from the commit that adds this amendment; then the single reviewer gate (§E). Rule (00): the piece shares no path with the pieces in progress or PR #229.
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — closing record: PR #230 merged

*Written by the custodian after the merge, on the human's message of 2026-10-20 (`state/directives/2026-10-20-230-231-233-merged-232-strikes-rule-d1-a-not-i1-profile-path-redact-unknown-attempt-a.md`). References only.*

1. **Merged** by the human at 2026-10-20T07:32:52Z, merge commit 3fa90769c735d0f5846e20110ec0f51b35a08ddb (two parents: main a5951feebccb8f5e0994003a652d2af89bab0e99 and the branch head 9b47f539586b158f3469c5356014b7c640ff2581). `KNOWN-LIMITATIONS.md` has the same blob at the merge commit as at the branch head, 5f383ce3ed482bbcd948a4a9598fba59d56a67aa.
2. **The worker's report:** `state/consults/2026-10-18-known-limitations-item-23-watcher-idle-end-worker-report.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 fd5e5acf05a4ea3fd70870f6f3747285608da441143b90fe48d34455ca1ae104 from its line 5.
3. **The single reviewer gate (§E):** PASS, gate-log 545: `state/consults/gates/2026-10-18-known-limitations-item-23-watcher-idle-end-reviewer.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 2305edc0e906192da0771e1152d3c33f09ed706d3381fd16a730ce4e47fc00bd.
4. **No release-notes line** (Amendment 1 item 3).
5. **PLAN:** the node is done, with `{pr: 230}`.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.
