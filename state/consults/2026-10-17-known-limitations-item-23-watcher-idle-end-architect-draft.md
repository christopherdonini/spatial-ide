*Custodian's filing note (2026-10-17): the architect's draft of the five-line form for `known-limitations-item-23-watcher-idle-end`, with its words for item 23, read at main 607d8d16; the run 2026-10-17T21:02:21Z to 2026-10-17T21:09:18Z by its transcript (Read 35, Grep 34, Glob 1; no write-capable call); its one SubagentHandback call, at 21:09:17Z. Byte-copied by script from that call; one final newline added; nothing else changed. The form is committed from its fenced block at `KNOWN-LIMITATIONS-ITEM-23-WATCHER-IDLE-END-PREREGISTRATION.md`: its 25 pin(s) `@ M sha256:HASH-TBD` are written with M in full and their hashes computed by the custodian at 607d8d16, its §D item 5's placeholder words `Every HASH-TBD at M computed` read as `Every hash at M computed` once the hashes were computed, and its empty Amendments section gets the usual `(Opens empty; append-only.)` line; nothing else changed. The pins in section 1 of the report below stay as handed back. Section D's checks are the custodian's record `state/consults/2026-10-17-known-limitations-item-23-tag-checks.md`. The message's sha256 as handed back is 52727db12a1a9853fc25218d906f276425d1a0ce81a4ec33d9d85615ed8c7b73.*

---

Reviewed: main @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9

Verdict: not applicable. This is a draft form; no diff was reviewed. I have no git tool and made no write-capable call. I read the working tree, which the session snapshot shows is that commit, clean apart from two untracked paths.

## 1. The tag finding

**Finding: at the v0.1.0 tag the watcher did not end idle sessions, because it did not exist yet. Item 23 did not exist at the tag either. So the human's condition in item 3 is not met, and the item does not take item 8's Corrected form.** This is inferred from the record, not read from the tag's tree. I could not read `engine/src/watch.rs`, `kernel/src/skp.rs` or the shell at b391e43622056324c56d35cc33065305140a8415: the Read, Grep and Glob tools cannot read git objects. The form's §D therefore has the custodian confirm it by script before commit, and stop if it does not hold.

The record evidence:
- **The watcher came after the tag.** The node `engine-source-change-watcher` was opened 2026-09-18 and done 2026-09-26, with `evidence: {pr: 127}` (`PLAN.yaml:2205-2221 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`). Its form reads main at c16f41d and rests on rulings of 2026-09-24 onward (`engine/SOURCE-WATCHER-PREREGISTRATION.md:5-17 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`). The tag was cut 2026-09-13, by the project's own record.
- **Item 23 came after the tag, and before the watcher.** It was added by `known-limitations-owed-rows`, PR #109, done 2026-09-24 (`PLAN.yaml:1632-1648 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`; `KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md:3 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`). It sits under the heading `## On main since v0.1.0 — not in any release yet` (`KNOWN-LIMITATIONS.md:200 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`).
- **So the item was true when written and became false on main when PR #127 merged.** No release carried either the item or the watcher.

**On main, the watcher does end an idle session on a change it reports.**
- The kernel's watcher sink calls `end_generation` straight from the signal, with no query involved (`kernel/src/skp.rs:1140-1168 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`).
- `end_generation` queues one event and cancels the session's tickets (`kernel/src/skp.rs:914-926 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`).
- The shell forwards the event (`frontends/shell/src-tauri/src/lib.rs:302-315 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`), and the App's listener ends the session (`frontends/shell/src/App.tsx:1366-1397 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`).
- The parent-folder filter includes last-write and size changes (`engine/src/watch.rs:653-654 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`).
- **Run evidence:** an idle mtime touch ended the session with no query after it (`state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:107-120 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9 sha256:HASH-TBD`; the re-aim form's R11 pins the same span at a576ab37). The mutation M11, which puts the touch back on the pre route, failed by name at cf2434e6 (`frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`, Amendment 2, item 9).

## 2. The draft form

````markdown
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

    <!-- [The human's wording, approved | The human's own words, given | Drafted by the architect; accepted as it stands] in KNOWN-LIMITATIONS-ITEM-23-WATCHER-IDLE-END-PREREGISTRATION.md Amendment 1; drafted by the architect under item 2 of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-17-227-m1-watcher-visible-open-1-a-item-23-node-228-merged.md, item 3. Revised <date>: until this revision the item said that a change the detector can see goes unnoticed until a query is next issued; that held when it was written (PR #109) and stopped holding on Windows when the advisory watcher merged (PR #127). Neither the item nor the watcher is at the v0.1.0 tag (the form's §D). Sources on main: kernel/src/skp.rs:1140-1168 @ M sha256:HASH-TBD (the watcher's sink ends the generation on a signal, no query); kernel/src/skp.rs:914-926 @ M sha256:HASH-TBD (one event queued, tickets cancelled); engine/src/watch.rs:86-103 @ M sha256:HASH-TBD (the Windows arm; checks-only off Windows); engine/src/watch.rs:603-636 @ M sha256:HASH-TBD (canonicalized path; checks-only where arming fails); engine/src/watch.rs:653-654 @ M sha256:HASH-TBD (the parent filter: name, size, last write); engine/src/watch.rs:695-704 @ M sha256:HASH-TBD (the grandparent filter: directory name); frontends/shell/src-tauri/src/lib.rs:286-294 @ M sha256:HASH-TBD (PlatformWatch, the product arm); frontends/shell/src-tauri/src/lib.rs:302-315 @ M sha256:HASH-TBD (the event emitted to the webview; a failed emit logged); frontends/shell/src/App.tsx:1366-1397 @ M sha256:HASH-TBD (the listener; a failed registration logged); frontends/shell/src/App.tsx:781-802 @ M sha256:HASH-TBD and frontends/shell/src/App.tsx:750-769 @ M sha256:HASH-TBD (routed to the live manager); frontends/shell/src/App.tsx:1507-1517 @ M sha256:HASH-TBD and frontends/shell/src/App.tsx:1588-1589 @ M sha256:HASH-TBD (the tiled arm is the shipped default); frontends/shell/src/streaming/tileViewportStreamManager.ts:735-748 @ M sha256:HASH-TBD and frontends/shell/src/residency/candidateArmSession.ts:1081-1095 @ M sha256:HASH-TBD (every resident tile cleared, then the App told); frontends/shell/src/App.tsx:687-699 @ M sha256:HASH-TBD and frontends/shell/src/App.tsx:2170-2174 @ M sha256:HASH-TBD (the session-ended block and the hover latch); frontends/shell/src/streaming/tileViewportStreamManager.ts:494-505 @ M sha256:HASH-TBD (a query only for a covering tile neither tracked nor resident); frontends/shell/src/canvas/pick.ts:104-106 @ M sha256:HASH-TBD (the hover refuses only once the session has ended); kernel/src/skp.rs:1436 @ M sha256:HASH-TBD (a later query refused under an ended generation); kernel/src/skp.rs:1449-1455 @ M sha256:HASH-TBD (the pre-check ends the generation); frontends/shell/src/streaming/tileViewportStreamManager.ts:940-958 @ M sha256:HASH-TBD (that refusal ends the session in the app); frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:954 @ M sha256:HASH-TBD (Amendment 11 (b), the small-pan/no-query finding, referenced, not quoted); engine/src/descriptor.rs:13-18 @ M sha256:HASH-TBD (the change the preregistration registers as not detected); frontends/shell/MANUAL-WALKTHROUGH.md Part N row N8, by name (sourcing "This is not a missed detection"). Run evidence: state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:107-120 @ M sha256:HASH-TBD (an idle mtime touch ended the session with no query). Not covered (item 2c): an end that lands inside one request round trip of a query; the baseline arm, which only a dev-only switch selects. -->

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
5. Every HASH-TBD at M computed, over whole lines as committed, LF bytes.

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
````

## 3. The clause check

§B of the draft is the clause check: 16 clauses, each against code on main, with run evidence for C3 and C8. Every clause holds at M.
- **At the tag:** no clause applies. The item is in the on-main section, and §D confirms by script that neither the item nor the watcher is at the tag.
- **Named, not blocking (item 2c):** an end inside one request round trip, and the baseline arm, which only a dev-only switch selects.
- **Read from code at M:** C6 to C9 and C14. C1 and C3 also rest on the runs named in §B. I did not read the kernel post-check's body in `kernel/src/lib.rs`, so C10 names it by role only. The reviewer re-reads it there.

A note for the custodian, outside Scope: on main, `MANUAL-WALKTHROUGH.md` row N8 still touches the mtime and expects no change after a small pan. On Windows the watcher contradicts that. The watcher-visible piece's Appendix A.2 already rewrites N8 to a junction repoint, so no new node is needed.

## 4. The OPEN items

- **OPEN-1:** the words' sight under §31. Your answer is yes, your own words, or accepted as it stands. Item 23 is not marked as your wording.
- **OPEN-2:** a release-notes line. I recommend none, since no release carried item 23 or the watcher.

## 5. Files read (all at main 607d8d16 unless stated)

- C:/dev/spatial-ide/state/directives/2026-10-17-227-m1-watcher-visible-open-1-a-item-23-node-228-merged.md
- C:/dev/spatial-ide/PLAN.yaml (the item 23 node; `engine-source-change-watcher`; `known-limitations-owed-rows`)
- C:/dev/spatial-ide/state/consults/2026-10-17-source-changed-post-reopen-routes-watcher-visible-architect-draft.md (lines 1-492)
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md (1-30, 90-114, 200, 220-327)
- C:/dev/spatial-ide/KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md
- C:/dev/spatial-ide/KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md
- C:/dev/spatial-ide/engine/SOURCE-WATCHER-PREREGISTRATION.md (1-40, plus a search)
- C:/dev/spatial-ide/engine/src/watch.rs (1-110, 410-709)
- C:/dev/spatial-ide/engine/src/descriptor.rs (1-25)
- C:/dev/spatial-ide/kernel/src/skp.rs (900-1279, 1373-1459)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/lib.rs (276-325)
- C:/dev/spatial-ide/frontends/shell/src/App.tsx (655-814, 1330-1397, 1505-1526, 2160-2184, plus searches)
- C:/dev/spatial-ide/frontends/shell/src/streaming/viewportStreamManager.ts (415-454)
- C:/dev/spatial-ide/frontends/shell/src/streaming/tileViewportStreamManager.ts (455-514, 720-769, 938-959, plus searches)
- C:/dev/spatial-ide/frontends/shell/src/residency/candidateArmSession.ts (1050-1097)
- C:/dev/spatial-ide/frontends/shell/src/canvas/pick.ts (a search, lines 97-106)
- C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md (949-951)
- C:/dev/spatial-ide/frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md (950-957)
- C:/dev/spatial-ide/frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md (170-179, 258-269, 705-719, plus searches)
- C:/dev/spatial-ide/state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md (100-124)
- C:/dev/spatial-ide/AUTONOMY.md (§31, 530-551)
- C:/dev/spatial-ide/state/directives/2026-10-11-direction-after-status-review.md (10-34)
- C:/dev/spatial-ide/RELEASE-0.1.md (a search only)
- Not read: any file at the v0.1.0 tag. My tools cannot read git objects; §D covers this.
