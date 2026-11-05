*Custodian's filing note (2026-11-05): the architect's triage reading of area E's KNOWN-LIMITATIONS findings, the numbered items (the cloud's UNTRUE and STALE entries, the unnumbered paragraph, the two stale pins, item 43, and the platform sweep's findings 2, 3 and 5), under the human's direction of 2026-11-05, item 2 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`): triage as on 2026-10-10, confirmed findings to nodes by the custodian's grading, area E's KNOWN-LIMITATIONS items first. Its brief by file (sha256 521316f36496823499dd2942dceb53e82c1f7559d6c61d03af52444aebdecc64); the inputs the filed audits `state/consults/2026-11-03-cloud-kl-audit-report.md` and `state/consults/2026-11-03-platform-drift-sweep-area-e.md` and their comparison `state/consults/2026-11-05-platform-and-cloud-kl-audit-comparison.md`; read at main d8e52f77. The run 17:41:58Z to 17:48:15Z by its transcript (claude-opus-5-5; unique calls Read 55, Grep 43, Glob 2 and the hand-back, equal to the notification's). Extracted by script from the hand-back message in that transcript (22051 bytes, sha256 3277fe196a7a1744f304597544a16af1a687ea9088d3d20689dcc1add222f393), unchanged. A reading, not Authority: the grading and any node are the custodian's, and the wording of any KNOWN-LIMITATIONS.md text waits for the human's sight.*

---

**Verdict:** none. This is a triage reading, not a gate, so there is no Correctness, Evidence or Documentation verdict. Reviewed: main @ d8e52f77. That commit comes from the brief and the session's git status; I have no shell, so I could not confirm HEAD myself, and I could not check the brief's sha256 either.

Tag: `triage:area-e-kl@numbered`. "KL" below means `KNOWN-LIMITATIONS.md`, and every line number is on main as it stands. "Cloud" means `state/consults/2026-11-03-cloud-kl-audit-report.md`. "Platform" means `state/consults/2026-11-03-platform-drift-sweep-area-e.md`, cited by its filed lines. I did not execute anything; every verdict is a code reading.

## 1. The cloud's UNTRUE entries

**Item 3.** The clause at KL:70: "That identity does not survive a reopen or a change to the source, and it is never saved or published."
- **What decides it:**
  - `kernel/src/publish/mod.rs:457-566`: `preflight_pinless_parts` refuses on a filter, degrees, encoding, license, projection and ceilings. Nothing in it tests `is_session_ordinal`.
  - `kernel/src/publish/ceilings.rs:138`: `if let Some(features) = predicted_features {`. A session-tier `verified_rows` is `None` (`engine/src/identity.rs:235`, `verified_rows: None,`), so the ceiling check passes.
  - `engine/src/stream.rs:1438`: `let source_column = quote_ident(self.identity().source().source_column());`. That column is `file_row_number` for the session tier (`engine/src/identity.rs:96`).
  - `kernel/src/publish/mod.rs:1440` records `id_source`, and `:1444` keeps `"uniqueness was verified over this file at open.`
  - No shell publish file reads the identity class (grep of `frontends/shell/src/publish` and `src-tauri/src/publish.rs`).
- **Verdict:** PARTLY. "never … published" fails by code reading. The identity-form clause holds: `AdmissionPanel.tsx:31` reads `if (code === "engine.identity_unusable") return "identity";`. "never saved" is not contradicted: no session-tier identity is written as a claim.
- **Which audit is right:** the cloud, on the clause it names. The platform checked only the identity-form clause (platform:51, "3 (identity form appears only on `engine.identity_unusable`)").
- **Existing nodes:** `kl-items-graded-untrue-or-stale`; the behaviour question is `publish-session-tier-identity`. Neither the code nor the words should move before that node's test reading decides between a refusal and a rewording.
- **A fix must cover:** KL:70's publish clause, or the publish refusal it states; and the manifest caveat at `mod.rs:1444`, which is false for the session tier.

**Item 13.** The clauses at KL:141, "A drag that never reports its release leaves the hover re-pick inert for the session.", and KL:144, "until the app is restarted".
- **What decides it:**
  - `frontends/shell/src/canvas/WorkingCanvas.tsx:1970-1971` clears the flag on any later release: `const onPointerRelease = () => {` / `pointerButtonDownRef.current = false;`. The listeners are on the window: `:1982` is `window.addEventListener("pointerup", onPointerRelease, { passive: true });`, and `:1983` does the same for pointercancel.
  - The canvas is remounted on every open: `App.tsx:2186-2187`, `<WorkingCanvas` / `key={admitted.dataset}`.
  - The code's own comment, `WorkingCanvas.tsx:1211`, names the outcome it avoids: "leaving the flag stuck down for the rest of the session".
- **Verdict:** CONFIRMED. The next pointer release anywhere in the window recovers the re-pick, so it is not inert for the session and no restart is needed. The mechanism sentence (KL:141-144, up to "cancels the pending re-pick") holds.
- **Which audit is right:** the cloud. The platform listed only "13" (platform:51) and shows no clause check.
- **Existing node:** `kl-items-graded-untrue-or-stale`.
- **A fix must cover:** the "for the session" and "until the app is restarted" clauses, and the pin in the source comment at KL:146.

**Item 27.** The clause at KL:324-325, quoted per line: KL:324 "rename of that shape is read as the source going away rather than as the same file under a new" and KL:325 "spelling."
- **What decides it:**
  - `engine/src/watch.rs:437-442`: `if names.matches(&observed_name) {` … `return Some(WatchSignal::Change { action: label });`. Any matching record ends the session, whatever its action. There is no "same file" outcome.
  - `engine/tests/source_watch_adapter.rs:413-416`: a case-only self-rename delivers `RENAMED_OLD_NAME` on "this watch's own exact stored spelling — a byte-exact match regardless of any fold logic".
  - A record that names the source only in a spelling that does not fold one to one is skipped, not signalled (`watch.rs:444-447`).
- **Verdict:** CONFIRMED. Such a rename ends the session exactly as any rename does. The real residual runs the other way: a record that names the source only in a variant spelling is not signalled while the app is idle. The heading and the fold mechanism (KL:320-323) hold.
- **Platform:** does not list 27.
- **Existing node:** `kl-items-graded-untrue-or-stale`.
- **A fix must cover:** KL:323-325's description of the residual's effect; pin `watch.rs` (the source comment at KL:326 cites no line).

**Item 56.** The clauses at KL:445: "which is shown by name and is never a wrong result" and "While the map fills it can use three streams at once".
- **What decides "shown by name":** every `viewport_query`, per-tile ones included, goes through the console's one capture point:
  - `frontends/shell/src/skp/client.ts:55`: `const entry = consoleRecorder.record(request, command);`
  - `client.ts:61-62`: `if (isSkpError(e)) {` / `entry.resolveRefused(e);`
  - `ConsolePanel.tsx:176-178` renders `<RefusalBlock …>`, and `RefusalBlock.tsx:28` renders `{refusal.code}`.
  - The console is mounted without condition: `App.tsx:2465`, `"activity.console": <ConsolePanel />,`.
  - The console is bounded at 256 entries (`console/recorder.ts:139`), and the status line names no code.
- **What decides "three streams":**
  - `engine/src/pool.rs:113-115` sizes the admission class at "`MAX_IN_FLIGHT_TILE_STREAMS = 3` … plus the baseline (non-tiled) viewport query a session also issues, `1` — `3 + 1 = 4`".
  - `candidateArmSession.ts:446-448`: "in generation 2+ the grid frame survives `reissueUnrestricted`'s clear, so a tile batch can land before the new first look's own terminal". So tiles run beside the untiled first look after an Apply or Clear.
- **Verdict:** PARTLY.
  - The cloud's ground for UNTRUE is NOT CONFIRMED. Its "no UI surface shows the code" (cloud:91) is wrong, because the Activity console shows each refused tile query's code.
  - The "three streams" clause is CONFIRMED as an understatement: up to four map streams can run at once.
- **Which audit is right:** neither fully. The platform's "holds" (platform:51) is right on "shown by name" and silent on the stream count.
- **Existing node:** `kl-items-graded-untrue-or-stale`. Item 56 is draft wording, not the human's own (its comment at KL:446).
- **A fix must cover:** the stream count. Optionally, name where the code is shown (the console, not the status). The pins in the source comment at KL:446 cite no lines.

## 2. The cloud's STALE entries

**Item 4.** KL:75, "style is held in memory and is never persisted: no project file, no saved style, and reopening a", and KL:76, "dataset starts from the default."
- **What decides it:**
  - A reopen keeps the style. `workspaceState.ts:108-109`: "the view's filter is reset and its style kept". `workspaceState.ts:156` sets `filter: null` and keeps `style`. The test `App.workspace.test.tsx:239` is `it("RA2: a reopen resets the filter and keeps the style"`, and `:248` asserts `"the style is kept"`.
  - Style is written to disk. `App.tsx:1994` is `for (const transition of transitions) stepQueue.enqueue(dataset, transition);`, sent by `recordStep` (`App.tsx:857`). The kernel writes it as `"style.set"` (`kernel/src/session_history.rs:348`), appending at `:188` to `unsaved-<hex>` (`:222`).
  - Only a normal exit deletes it (`:195-203`). `recover` (`:773`) has no caller in kernel or shell product code.
- **Verdict:** CONFIRMED stale on main now, independent of 1c.
  - "reopening a dataset starts from the default" is untrue in ordinary use: any second open in a run keeps the style.
  - "is never persisted" is untrue as written: the style is written to a file that a crash leaves on disk, as item 43 itself says. Nothing reads that file back.
  - "no project file, no saved style" (meaning nothing the user can save) still holds until 1c.
- **Which audit is right:** the cloud. The platform's "untrue only when 1c merges" (platform:56) holds only for the project-file and saved-style clauses.
- **Existing nodes:** `kl-items-graded-untrue-or-stale`. `b2-piece-1c-save-and-reopen` also owes notes on items 4, 10 and 43 at its steps; its summary is in PLAN.yaml.
- **A fix must cover:** KL:75-76; the item's pin to `document.ts:33-37` at KL:77, whose "no session-recoverable state" (`document.ts:36`) is now contradicted at the app level; and a cross-reference to item 43.

**Item 10.** The heading at KL:120, "**One file per session, and nothing is remembered.**"; KL:121, "Nothing persists across a session: no"; KL:122, "project file, no saved style, no saved CRS assertion".
- **What decides it:**
  - The style kept across opens, as for item 4.
  - The record's header carries the admission: `kernel/src/dataset_ref.rs:259` has `"crs_assertion",`, and `:277` has `("admission", admission),`. It is written by `session_history.rs:220` and survives a crash. The opened file's path goes to `locations.json` (`session_history.rs:242`).
- **Verdict:** PARTLY.
  - The heading's "nothing is remembered" is CONFIRMED untrue: the style is remembered within a run.
  - "Nothing persists across a session … no saved CRS assertion" is CONFIRMED untrue for the crash case.
  - "no project file" holds.
  - The quoted panel sentence holds as behaviour, because nothing reads the record back.
- **Which audit is right:** the cloud, as for item 4.
- **Existing nodes:** the same two as item 4.
- **A fix must cover:** KL:120-122, and the stale pin at KL:124 (section 4 below).

**Item 15.** KL:159, "already had it; that case is untested, and what to do about it is an open decision.", and the source comment at KL:160, "DECISIONS-PENDING.md entry 69 (open)".
- **What decides it:** a record, not code. `governance/PLAN.yaml:778` is `- id: entry-69-runtime-dependency`, `:783` is `status: done`, and `:793` reads "RULED 2026-09-14 (with entry 90): option (a) declare stands". The code half holds: `tauri.conf.json:25-45` lists no redistributable, and `.cargo/config.toml:1-4` sets no static CRT.
- **Verdict:** CONFIRMED stale on main. The ruling came after the tag, so the sentence was true of the v0.1.0 artifact when it was written.
- **Platform:** listed "15" bare.
- **Existing node:** `kl-items-graded-untrue-or-stale`.
- **A fix must cover:** KL:159's last clause and KL:160's "(open)".

**Item 19.** KL:243, "That reduced-component degradation (fewer than four components, on the footer-ceiling or"; KL:244, "no-modification-time branch above) is shown nowhere in this build today: the display ADR-016"; KL:245, "Amendment 1 item 2 requires of it is owed to a later piece."
- **What decides it:**
  - `kernel/src/skp.rs:1349-1372` sets `resp.checks`, with `ChecksState::Degraded` and its components.
  - `DescribeSummary.tsx:94` has `<dt>[P6 placeholder] Structural checks</dt>`, rendered from `degradedChecksLine` (`describeSummaryText.ts:90-95`).
  - `layout/statusItems.ts:34` builds `` `${coverage} · [P6 placeholder] structural checks: degraded — unestablished: ${…}` ``, and its product caller is `layout/regionParts.tsx:218`.
- **Verdict:** CONFIRMED. The degradation is shown in two places. I did not read ADR-016 Amendment 1, so I do not decide whether that display meets item 2's requirement.
- **Platform:** checked a constant only (platform:51, "19 (`FOOTER_DESCRIPTOR_MAX_BYTES`)").
- **Existing node:** `kl-items-graded-untrue-or-stale`.
- **A fix must cover:** KL:243-245, and the ADR-016 `:240` cite in the source comment at KL:246.

## 3. The unnumbered paragraph (KL:164-168)

The clauses: KL:164, "Under a row filter at wide zooms, some of the view's per-tile queries are refused by the", and KL:165, "app's own filter-admission check and never run." The comment at KL:168 says "skp.filter_rejected_by_binder refusals discarded in tileViewportStreamManager.ts mintAndStart's catch; the fix is queued post-tag with the suspended FIND' assertion as its test".

- **What decides it:**
  - `engine/src/predicate.rs:146` is `.acquire(LeaseClass::Admission)`, and `:148-149` map exhaustion to `ConnectionsExhausted`. The admission class is sized 4 (`pool.rs:132`) to cover 3 tiles plus 1 baseline (`pool.rs:113-115`).
  - Every refusal is logged: `tileViewportStreamManager.ts:951`, `logMintRefused(tileKey, err);`, which writes `"tile-stream-mint-refused"` at `:283`.
  - A refused tile is retried once: `:984` `isRetryableRefusal(err) &&` and `:985` `!this.requeuedTiles.has(tileKey) &&`.
  - Both fixes are done: `polish-87-88-89` (PLAN.yaml:344-360, PR 55) and `polish-engine-lease-class` (PLAN.yaml:362-378, PR 59, done 2026-09-14).
- **Verdict:** CONFIRMED stale. Under the 3 + 1 sizing the map alone does not exhaust admission, and the remaining case is item 56's. The comment's "discarded" and "queued post-tag" are both stale. "The status then reports those areas as not loaded" still holds for a tile dropped after its retry.
- **Both audits agree.**
- **Existing node:** `kl-items-graded-untrue-or-stale`.
- **A fix must cover:** an on-main note or a retirement in item 3's pattern; the comment at KL:168 (its cause, "discarded", "queued post-tag", "suspended FIND'"); and, if the paragraph is kept, a number, so that it can be cited.

## 4. The pins at KL:103 and KL:124

**KL:103** reads `frontends/shell/src/residency/residencyStatus.ts:458 (within budget), :463 (over budget), :429-430 (the settled-partial sentence)`. What those lines hold now:
- `:458` is `if (status.settled === "partial-failure") return SETTLED_PARTIAL_FAILURE_TEXT;`
- `:463` is ``return `Showing all ${status.residentFeatureCount} features in view`;``. That is the within-budget string, not the over-budget one.
- The over-budget string is at `:468`.
- `:429-430` is doc-comment text (`:429`, `recommended text. Never the word "all" (BS6:`).
- The settled-partial sentence is at `:435`.

**KL:124** reads `frontends/shell/src/App.tsx:614 (one \`admitted\` dataset, \`Admitted | null\`)`. What the code holds now:
- `:614` is a stream-terminal comment: `` // `selfCancelledHandles` doc comment. It is the layer that knows "I cancelled this", which ``.
- `admitted` is now derived at `App.tsx:840`: `const admitted = view === null ? null : selectAdmitted(workspace, view.id);`. The single view is enforced in `workspace/workspaceState.ts:126-159` (`admit`).
- The same comment's `document.ts:33-37` pin still lands on "## Ephemeral only"; see item 4 for that passage's drift.

**Verdict:** CONFIRMED for both. These are stale references only.
**A fix must cover:** repointing each pin, written in the `@ <commit> sha256:` form the file's newer comments use.

## 5. Item 43

No clause is shown untrue. The wording is imprecise in two places: the record is a folder of two files, one of which holds the file's path (`session_history.rs:240-250`); and the cap is per record (`:45`), with a record keyed on path plus claims (`:168-169`, `:330-339`). Item 43 stays with 1c's notes.

## 6. Outside KNOWN-LIMITATIONS.md

**Platform finding 2.** `frontends/shell/e2e/regression.mjs:1946` reads "**SUSPENDED, and recorded by name rather than failed** (preregistration". `:1950` reads "reinstates itself, unchanged, on the first run where none exist." Against that, `:2257` reads "status assertion below is a HARD, UNCONDITIONAL `failures.push`", and `:2266-2286` push failures on every branch.
- **Verdict:** CONFIRMED. The header's second cause at `:1947-1948` ("filtered per-tile queries dropped silently before any stream is issued") is also stale.

**Platform finding 3.** `regression.mjs:2262` reads "settled-partial (or never reaches within-budget) -- expected and honest while the engine half", and `:2263` reads "(entry 91 (a), ADR-033) is not built". The engine half is built (`predicate.rs:146`; PLAN `polish-engine-lease-class` done).
- **Verdict:** CONFIRMED.

**For both:** no node covers them. `mp-prime-e2e-covered-fixture` (proposed) changes another step of the same file. **A fix must cover** the FIND' header at `:1940-1950` and the comment at `:2256-2265`, so that a FIND' red reads as a regression. These are stale test comments only.

**Platform finding 5.** `frontends/shell/src/App.lateResult.test.tsx:1349` reads "(`residency/candidateArmSession.ts:1046, :1076-1082`), NOT by `session.stop()` -- with A's first". What those lines hold now:
- `:1046` is `syncScanLiveness(); // P5f should-fix 3: …`.
- `:1076-1082` is the `endCandidateSession` doc comment.
- The route the cite means is `:1057`, `onSessionEnded: (detail) => endCandidateSession(detail),`, and `:1085-1098`, which ends `deps.onSessionEnded?.(detail);`.

The platform's "around `:1056-1064`" is close but not exact.
- **Verdict:** CONFIRMED. A stale reference only.
- **Existing node:** none. `skp-line-cites-outside-close-races` covers skp.rs cites only.
- **A fix must cover:** repointing, pinned.

## Proposal (the grading is the custodian's)

- **Group A: `kl-items-graded-untrue-or-stale`** (exists). Path: `KNOWN-LIMITATIONS.md`. It covers items 13, 15, 19, 27, 56 (the stream count only), the unnumbered paragraph and its comment, and the pins at KL:103 and KL:124.
  - Item 3 stays tied to `publish-session-tier-identity`: the behaviour may change rather than the words.
  - Items 4 and 10 are stale now, independent of 1c. 1c (`b2-piece-1c-save-and-reopen`, in progress) owes notes on the same items at its steps, so the custodian decides between landing them in this node now or folding them into 1c's step; both edit the same items.
  - Under the 2026-10-10 precedent's one node per KL change, A splits naturally into: (A1) 3; (A2) 4 and 10; (A3) 13 and 27; (A4) 15 and 19; (A5) the unnumbered paragraph; (A6) 56; (A7) the pins.
- **Group B: stale test and harness comments** (new). Paths: `frontends/shell/e2e/regression.mjs` (findings 2 and 3) and `frontends/shell/src/App.lateResult.test.tsx` (finding 5). It could join `mp-prime-e2e-covered-fixture` for regression.mjs under the same-file rule, but that node changes e2e behaviour and waits on `geometry-points-cut`.

**Misstates what a user can do or what is published** (as 2026-10-10's finding 8 did):
- 3: a session-tier file can be exported, and its manifest says uniqueness was verified.
- 4 and 10: the style is kept on reopen and written to a file a crash leaves.
- 13: the limit is overstated; the next click recovers it.
- 19: the limit is overstated; the degradation is shown.
- 27: the residual's effect is misdescribed.
- The unnumbered paragraph: a limit main has fixed.
- 56: minor; the stream count is understated.

**Stale reference or record only:** 15 (a record), the pins at KL:103 and KL:124, the regression.mjs comments (harness readers only), and App.lateResult.test.tsx:1349.

**Not decidable by reading:** whether item 3's export actually completes end to end (no test was run; `publish-session-tier-identity` orders one), and whether item 19's display meets ADR-016 Amendment 1 item 2 (not read).

## Files read

- The brief: brief-tri-e1.md in the session scratchpad.
- `C:/dev/spatial-ide/state/consults/2026-11-05-platform-and-cloud-kl-audit-comparison.md`
- `C:/dev/spatial-ide/state/consults/2026-11-03-cloud-kl-audit-report.md`
- `C:/dev/spatial-ide/state/consults/2026-11-03-platform-drift-sweep-area-e.md`
- `C:/dev/spatial-ide/KNOWN-LIMITATIONS.md` (1-334, 398-403, 440-447)
- `C:/dev/spatial-ide/governance/PLAN.yaml` (344-378, 776-793, 1649-1665, 2370-2385, 3177-3193, 4403-4419, 5656-5672, 6440-6531)
- `C:/dev/spatial-ide/kernel/src/publish/mod.rs`
- `C:/dev/spatial-ide/kernel/src/publish/ceilings.rs`
- `C:/dev/spatial-ide/kernel/src/session_history.rs`
- `C:/dev/spatial-ide/kernel/src/skp.rs`
- `C:/dev/spatial-ide/kernel/src/dataset_ref.rs` (grep)
- `C:/dev/spatial-ide/engine/src/identity.rs`
- `C:/dev/spatial-ide/engine/src/stream.rs`
- `C:/dev/spatial-ide/engine/src/watch.rs`
- `C:/dev/spatial-ide/engine/src/predicate.rs`
- `C:/dev/spatial-ide/engine/src/pool.rs`
- `C:/dev/spatial-ide/engine/tests/source_watch_adapter.rs`
- `C:/dev/spatial-ide/frontends/shell/src/App.tsx`
- `C:/dev/spatial-ide/frontends/shell/src/App.workspace.test.tsx`
- `C:/dev/spatial-ide/frontends/shell/src/App.lateResult.test.tsx`
- `C:/dev/spatial-ide/frontends/shell/src/style/document.ts`
- `C:/dev/spatial-ide/frontends/shell/src/workspace/workspaceState.ts`
- `C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx`
- `C:/dev/spatial-ide/frontends/shell/src/streaming/tileViewportStreamManager.ts`
- `C:/dev/spatial-ide/frontends/shell/src/residency/candidateArmSession.ts`
- `C:/dev/spatial-ide/frontends/shell/src/residency/residencyStatus.ts`
- `C:/dev/spatial-ide/frontends/shell/src/skp/client.ts`
- `C:/dev/spatial-ide/frontends/shell/src/console/ConsolePanel.tsx` (grep)
- `C:/dev/spatial-ide/frontends/shell/src/console/recorder.ts` (grep)
- `C:/dev/spatial-ide/frontends/shell/src/admission/formatRefusal.ts` (grep)
- `C:/dev/spatial-ide/frontends/shell/src/admission/RefusalBlock.tsx` (grep)
- `C:/dev/spatial-ide/frontends/shell/src/admission/AdmissionPanel.tsx` (grep)
- `C:/dev/spatial-ide/frontends/shell/src/admission/DescribeSummary.tsx` (grep)
- `C:/dev/spatial-ide/frontends/shell/src/admission/describeSummaryText.ts`
- `C:/dev/spatial-ide/frontends/shell/src/layout/statusItems.ts`
- `C:/dev/spatial-ide/frontends/shell/e2e/regression.mjs`
- `C:/dev/spatial-ide/frontends/shell/src-tauri/tauri.conf.json`
- `C:/dev/spatial-ide/.cargo/config.toml`
