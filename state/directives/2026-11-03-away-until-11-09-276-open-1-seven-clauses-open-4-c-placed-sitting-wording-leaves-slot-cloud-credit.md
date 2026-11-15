# The human's message of 2026-11-03: away until Monday 2026-11-09, the direction of 2026-10-31 holding until then and the item-4 review moved to the return; #274 meant #275; #276's OPEN-1, the human's words for the seven clauses (class 5), the gate checking only these, then out of draft; the ADR-017 note's OPEN-4 (c) placed, S4, the docs lane last; sitting-wording leaves its slot, OPEN-8 (a) as N8; entry 1b as placed; the cloud and API credit to 2026-11-05: qualification runs, and cloud branches fetched hourly to 2026-11-06

*Filed verbatim by the custodian from the session transcript: the human's typed message, its user record (origin human) at 2026-11-03T16:20:39Z (UTC). Its text is byte-copied by script from that record, from line 6, unchanged; nothing in it names another project or a profile path. The RULED block in governance/DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---
To the custodian, 2026-11-03. I am away until Monday 2026-11-09; my direction of 2026-10-31 holds until then, item 4 included, and the review of the items taken under it moves to my return. "#274 for my click" meant #275; all three are merged.

#276, OPEN-1, my words for the seven clauses, class 5; every other clause stays byte for byte, and the gate checks only these:
- 1.1 replaces item 1's first sentence: "§13's scan now runs in the product, not only in the format suite, with the exceptions item 3 states; where the product's check is narrower than §13's sentence, item 3 says so."
- 1.4: after "over every staged file as it lies on disk" add ", except a viewer file item 3 passes over,".
- 2.2 replaces item 2's last sentence: "No bundle exists under the destination name. The staging directory is then removed as on every other failure; when it cannot be, the publish is still refused, with the code `publish.staging_not_removed` and `error_kind` `StagingNotRemoved` in place of the finding's."
- 3.2: the three files take their paths from the root: `renderer/bundle-viewer/viewer-asset-hashes.json`, `renderer/bundle-viewer/scripts/scan-dist.mjs`, `renderer/bundle-viewer/redaction-reviewed.json`.
- 3.4 replaces "only after the same scan passed over the built viewer" with "only after the build's own run of `redaction::scan_directory` passed over the built viewer", and item 3 gains, before its last sentence: "That build run has no login name, no computer name and no declared strings: it checks the viewer's files for paths and credential words, not for a login or computer name, and the three matches its reviewed rows allow, two in `NOTICE.txt` and one in `app.js`, ship in every bundle the shell publishes. In these ways the product's check is narrower than §13's sentence."
- 4.4 replaces the window sentence: "The window's sentence gains the gate's terms, joined as Corrigendum 4 joins its own: one chunk's write, one `File::create`, one `sync_all`, and in the gate one file's read and scan (for a viewer file item 3 passes over, its read and hash) and one directory's listing between two files, bounded in bytes by what each term reads or writes, and in time not at all. Two stretches run more than one term with no check between them, as the redaction form records: from the `Finalizing` check to the gate's first per-file check (the heuristic re-check, the byte total, the sidecar's create, write and sync, and the root listing), and after the last file's check (its read and scan, the byte total and the rename)."
- 4.5 replaces the row sentence: "Corrigendum 4's table gains a row: the read and scan of one staged file is bounded in bytes by that file's own size and by no declared ceiling (a partition's size rests on the producer's estimate, `MAX_BATCH_BYTES`; a viewer file's on `MAX_VIEWER_ASSET_BYTES`; `manifest.json`, `style.json` and `build-info.json` have none), with cancellation checked before each file; its per-byte cost is unmeasured and not claimed."
Then out of draft for my click.

ADR-017 note's OPEN-4 (c): placed, S4, docs lane last, after the sitting-wording pieces.

Sitting-wording: OPEN-3 and OPEN-5 wait for the sitting, as they must; no form commits before it; the piece leaves its slot. OPEN-8 (a), and it joins the sitting's list as N8, to be worded there with the others; no node.

The follow-up node posix-backslash-is-inside-and-redaction-label as filler entry 1b: placed as you have it.

O0 waits for me. Clicks from the app as the custodian reports them. Nothing else is held on me until Monday.

To the custodian, 2026-11-03. The cloud credit expires 2026-11-05 and the API credit with it; both are to be spent on the work, beside the normal sessions, with no cap.

1. The platform: every qualification run the harness supports, L1 to L3 where the cloud has it, each repeated three times for repeatability, from now until 2026-11-05 or the credit is gone; results filed as records as the harness provides. If the key is not in your environment, say so once and this part waits for me.

2. Cloud sessions, started by me from the app: each works on a fresh clone, read-only on main, and pushes drafts to its own branch cloud/<topic>, no pull request. From now until 2026-11-06, fetch refs/heads/cloud/* every hour. Read each new branch; file what you use as a consult under state/consults/ with its provenance (branch, commit, the files' sha256), as you file any agent's hand-back; it is a draft and not Authority. Never merge a cloud branch; never commit its files as they are; propose nodes from its findings as from any reading; branch deletion is mine, later. Their topics, so you can place them: E1's rule records draft; the KNOWN-LIMITATIONS truth audit; fixture determinism on Linux; the overflow and redaction measurements on Linux; suite repeatability and clippy on Linux; the ADR notes and docs path audit; gate-log analytics for piece E's measurement; the v0.2 release-notes and walkthrough-coverage draft.

3. Nothing else changes: rule (00), the lanes, the filler slot, item 4 of 2026-10-31, and the red lines.
