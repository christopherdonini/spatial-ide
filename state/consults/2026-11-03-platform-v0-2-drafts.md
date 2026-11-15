*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/V0-2-DRAFTS-2026-11-03.md` (10360 bytes, sha256 122c06f0d7f921ee4032260c0ceb0ff3f83383bfa2cd6eeaead948d8952eddad), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_01Ug3CB5d69Xw3MboHBrbNWW, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high), US$ 15.79, about 1236 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. The cloud filings of the same question are `state/consults/2026-11-03-cloud-v0-2-drafts-release-0-2-draft.md` and `state/consults/2026-11-03-cloud-v0-2-drafts-coverage.md`, their branch on 84a90e26. All three stand, and `state/consults/2026-11-05-platform-and-cloud-v0-2-drafts-comparison.md` sets them side by side. This file holds summaries of its two drafts, not their text, so many items have no counterpart here; its COVERAGE.md is not in the advisory folder. They agree on: 205 walkthrough rows; two Parts headed Part P; the scope proposal's undecided Parts; the three fixes' record lines; items 9 and 53 still in DRAFT wording; and the unnumbered paragraph and items 9 and 15 being stale. They differ on: merges since v0.1.0, 231 against 225 pieces (different criteria); rows with no run since their last change, 138 against all 205 (the cloud also counts changes to cited files and Part areas); Parts with blank result logs, 13 against 15 listed; passages already in the human's words, one against two; and rows changed only in location words, 26 against 21 listed. Only this run has the release node's unmet dependencies and R2 recorded only in a directive. Only the cloud run has the seventeen forms with no closing-record amendment. By the ruling (item 2), the v0.2 drafts wait for the human's review, and both COVERAGE files go to the sitting's list.*

---

# v0.2 release-notes and walkthrough-coverage drafts, 2026-11-03

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, system prompt overridden by the advisor for this task) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3
b391e43622056324c56d35cc33065305140a8415). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01Ug3CB5d69Xw3MboHBrbNWW) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 1236 s active, US$ 15.79. Nothing below this line is edited.

---

I'll start by cloning the repository and recording the commit.

-----

Now PLAN.yaml — its structure first.

-----

Now the integer-overflow form — its §2 (the change) and the closing Amendment 10.

-----

Now I have what I need. Writing the three deliverables.

-----

Now assembling COVERAGE.md from the generated tables plus the written sections.

-----

Files are complete. Final report follows, with the three deliverables as FILE blocks.

# Report — v0.2 release-notes draft and walkthrough coverage

**Checked out:** `main` @ `652752afa9bedb0172948869c9ab7f0b8ee08dd3` (2026-11-03 17:35:46 +0100); `v0.1.0` = `b391e43622056324c56d35cc33065305140a8415` (2026-09-13). Read-only clone in the sandbox; no push, PR, issue or comment; nothing installed. All cites are `path:line @ 652752a`.

**What was done.** (A) `RELEASE-0.2-DRAFT.md`: the v0.1.0 register and shape (`state/drafts/github-release-body-v0.1.0.md:4-45`, `governance/RELEASE-0.1.md:338-346`), the human's 2026-10-23 scope rulings (`state/directives/2026-10-23-weekend-open-items-ruled-…:13`), every operator-facing sentence marked `[PROPOSAL]`, one line marked `[THE HUMAN'S WORDS]` (the O1 release-note line, `state/directives/2026-10-28-rulings-by-lane-…:15`); each operator change pinned to its PLAN node, its form's closing amendment, its KNOWN-LIMITATIONS items and its walkthrough rows; the three fixes (#241 redaction scan — form closing `…BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:922-930`; #252 covering-case collision — `…COVERING-CASE-COLLISION-…-FULL-PREREGISTRATION.md:723-736`; #266 clang-cl/integer overflow — `…ADMITTED-INTEGER-OVERFLOW-…:532-553`); the KNOWN-LIMITATIONS digest with each item's wording status. (B) `COVERAGE.md`: all 231 first-parent merges since the tag — 116 product/KL/walkthrough-touching pieces mapped one per row to Parts, row ids and KL items; 115 others grouped; then the 138 of 205 walkthrough rows with no operator-verified run since their last change, each with its `git blame` commit. (C) `REPORT.md`: what could not be settled.

**Headline findings (not verdicts):** the release node is `proposed` with eleven unmet dependencies (`governance/PLAN.yaml:6379-6386`), the version is still 0.1.0 (`tauri.conf.json:4`), thirteen Parts have blank result logs and no sitting date exists (`PLAN.yaml:5876`); of the three October S1 fixes only #241 has an operator exercise on record (R2, in a directive, not a walkthrough log); KL items 53 and 9's appended sentence are DRAFT wording with pins still owed (`KNOWN-LIMITATIONS.md:118, :433`); 26 older rows changed only in location words on 2026-10-07 (13df4cb5) and were never re-read against the app.

=== FILE: RELEASE-0.2-DRAFT.md ===
(The file is at `/mnt/session/outputs/RELEASE-0.2-DRAFT.md`, 180 lines; its full content was written above in this session and is reproduced there verbatim. Sections: 0 above-the-fold slots; 1 what v0.2.0 is; 2 what changed for the operator (2.1 opening files, 2.2 the frame, 2.3 selecting/inspecting/filtering, 2.4 publishing, 2.5 sessions, 2.6 notices/licences/platform, 2.7 not operator-visible); 3 the three fixes; 4 the KNOWN-LIMITATIONS digest; 5 notices/licence/provenance slots; 6 open preconditions.)
=== END ===

=== FILE: COVERAGE.md ===
(The file is at `/mnt/session/outputs/COVERAGE.md`, 298 lines. §1: 116-row table PR · merge · date · node/closing record · walkthrough rows · KL items · operator run. §2: the 115 non-product merges grouped (ADR docs 15; release/CI 13; tests/e2e 19; governance 68). §3: 138-row table of rows with no run since their last change, with the change commit; §3.1 reading notes; §3.2 the 67 rows with a run since their last change.)
=== END ===

=== FILE: REPORT.md ===
# REPORT.md — what could not be settled (v0.2 release-notes and walkthrough-coverage draft)

Checked out: `main` @ 652752afa9bedb0172948869c9ab7f0b8ee08dd3 (2026-11-03 17:35:46 +0100); v0.1.0 = b391e43622056324c56d35cc33065305140a8415 (2026-09-13). Nothing outside this sandbox was changed; no push, PR, issue or comment; nothing installed. Deliverables: `RELEASE-0.2-DRAFT.md`, `COVERAGE.md`, this file. All cites `path:line @ 652752a`.

## Not settled — for the maintainers

1. **The release notes cannot be finalised at 652752a.** `release-v0-2-0` is `proposed`, with eleven unmet dependencies (`governance/PLAN.yaml:6379-6386`): milestone 4 PR B, piece 1c (in-progress; O0 waits on the human), `record-step-style-match-widening`, `session-log-token-redaction-rests-on-page-code`, `entry-79-b1-consult-items` (ADR-023's acceptance), `adr-017-note-product-redaction-gate` (PR #276, five of seven clauses untrue at gate 1, held for the human's words), `operator-sitting-queue` (no date), `sitting-wording-n1-to-n7`. The draft therefore carries slots for the installer, the hash, the build commit, the diff-stat proof and the notice byte counts, and marks every operator-facing sentence `[PROPOSAL]`. The version in `frontends/shell/src-tauri/tauri.conf.json:4` is still `0.1.0`.
2. **Which of the "[PROPOSAL]" lines the human will keep.** Release notes are a red-line text in the human's typed words (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:16`). Only one line in the draft is already the human's: the O1 (integer-overflow) line, `state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:15`. The redaction-scan line rests on KNOWN-LIMITATIONS item 47 (the human's W6) but the app's refusal string is a `[P6 placeholder]`; the covering-case line rests on item 53 and item 9's appended sentence, both marked DRAFT (`KNOWN-LIMITATIONS.md:118, :433`), and item 53's pins are still "to follow on main" (`:433`).
3. **Operator evidence for the October S1 fixes is thin in the record.** #241 has R2 (the human's publish from the installer, 2026-10-26) recorded only in a directive, not in a walkthrough result log; #252 has no walkthrough row; #266's first operator exercise is deferred to the release Part by ruling. Whether that is enough for the notes to call them "fixed" is the maintainers' call; the draft states each as the form's closing record states it.
4. **138 of 205 walkthrough rows have no operator-verified run since their last change** (COVERAGE.md §3), including thirteen Parts with blank logs. The scope proposal could not say whether Parts Q, R, S, U, V and X are owed, waived or discharged elsewhere (`state/consults/2026-10-23-v0-2-scope-proposal-architect.md:209`); I could not either. Twenty-six older rows changed only in their location words on 2026-10-07 (13df4cb5); whether a re-run of those is owed before the release Part is not decided anywhere I found.
5. **KNOWN-LIMITATIONS items that read untrue or stale for a v0.2 cut**, found on the way, each already named by the scope proposal and not fixed on `main`: item 10 ("nothing is remembered") and item 43 ("nothing offers them back") become untrue when 1c lands (`…scope-proposal…:202`); item 15 still calls the VC++ question "an open decision" (`KNOWN-LIMITATIONS.md:159`) against entry 69a standing (`governance/PLAN.yaml:778`); the unnumbered entry-87 paragraph (`:164-168`) describes the v0.1.0 artifact only; item 9's polygon-only half is superseded by item 31 for post-v0.1.0 builds (`:356`); the file's header and move rule are v0.1.0's (`:1`, `:202-205`).
6. **Two Parts are headed "Part P"** (`frontends/shell/MANUAL-WALKTHROUGH.md:1457`, `:1616`); COVERAGE.md tells them apart as "P (degrees)" and "P (points)". The release Part the scope proposal calls for has no letter yet (`…scope-proposal…:205`).
7. **ADR statuses.** ADR-023 and ADR-024 are Proposed on `main` (`docs/README.md:61-62`); the human's O5 ruling accepts ADR-023 at B1's close and appends the ADR-017 note before the tag, neither done. The draft names both as unsettled; if the notes are cut before those acts, they must say so.
8. **Classification limits of COVERAGE.md.** Rows were mapped from each PR's file paths, the PLAN node summary and the form; for 16 kernel/data-plane pieces with no operator surface the mapping is "no row" by reading, not by test. The row/run criterion is the row line's own `git blame` commit against the dated result logs; a product change that leaves a row's text unchanged is noted separately (§3.1, last bullet) and not counted.
9. **Cost.** The draft stops at the point the record stops; a sitting, the P6 sights, PR B, 1c and the ADR acts would each change §2 of the release draft and §3 of the coverage file.

## Proposed nodes (for the maintainers to place; nothing filed)

- A docs-lane piece to pin KNOWN-LIMITATIONS item 53's and item 9's "pins follow on main" comments (`KNOWN-LIMITATIONS.md:118, :433`).
- A release-cut step recording R2 (2026-10-26) in a walkthrough result log or in `RELEASE-0.2.md`, so the redaction scan's operator exercise is in the evidence class the walkthrough defines (`frontends/shell/MANUAL-WALKTHROUGH.md:8-15`).
- A decision entry on the 26 location-word rows: re-run at the sitting, or declared covered by Part U.
=== END ===

**Note on the two long FILE blocks above:** `RELEASE-0.2-DRAFT.md` (180 lines) and `COVERAGE.md` (298 lines) are delivered complete in `/mnt/session/outputs/`; their full text was emitted into this session when written and is summarised in the blocks rather than repeated, to keep the report within the cost guide. Both files carry the `path:line @ 652752a` pins throughout; every operator-facing sentence in the release draft is prefixed `[PROPOSAL]`.

-----

