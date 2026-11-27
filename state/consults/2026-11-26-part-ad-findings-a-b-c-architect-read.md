# Part AD's findings A, B and C: what the code does, the smallest piece for each, and the fixture for AD3 (the architect, a read-only consult, not a gate)

*Filed by the custodian: node:part-ad-findings-a-b-c@architect-read, placed by ADV-2026-11-26-06 item 7 with no node yet. It is not a gate and gives no verdict. It was dispatched after 2026-11-26T17:53:01Z and before 2026-11-26T17:55:22Z (both from date -u), read only in D:/wt/read-1124f at 20ed759b71064079792541f2a76cf804a6c84bc1, whose product folders equal main's 7402b645. Its brief is brief-part-ad-abc-architect.md in the scratch folder, 3853 bytes, sha256 6438eca96ced3db4705867d62f026d9d2b55a9ee06a76b9b85adc780044fcce8. One message was sent to it while it ran: by ADV-2026-11-26-07, its input chris-1126-block-i.md was replaced by the filed text with one personal span withheld. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened): 82 tool uses, 589312 ms, 174531 tokens; model opus, by its definition's model line. It handed back once, before 2026-11-26T18:06:03Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. Its path:line cites are at 20ed759b and carry no span hashes. A and B go to the advisor for placing (item 7). The one run it names waits until the advisor is told (item 8). Its ADR skeleton is a proposal, not an ADR. Filed below the rule as handed back, nothing masked, with one change: in the files-read line, the walkthrough's range `:2021-2049` is written `:2021-2048`. The file has 2048 lines at 20ed759b and on main, and verify-cites refuses a line past a file's end. As handed back: 16724 bytes, sha256 d9b4bee74bdf16e55ffaeaba7f00fa59a6ad1ed485b4ba95c36ccc90f8438e9a. As filed: 16724 bytes, sha256 1ef27c1360101b6a0b3add0d660c4dfb27b2f3265fbb7f106c794f3598e45e75.*

---

**Verdict: not a gate (a read-only consult).** Reviewed: detached read checkout D:/wt/read-1124f @ 20ed759b71064079792541f2a76cf804a6c84bc1. This is a main commit; the brief says its code folders match main's 7402b645. Every path:line below is at 20ed759b. Quotes marked verbatim are copied from the Read output. I have no Bash, so the reviewer recomputes the span hashes before filing. I quote nothing from the human's file, which is now 829 B with the personal span withheld.

In short:
- **A and B** are faults a user can meet. Both are confirmed in the code (Correctness), and the advisor's two readings hold.
- **C** is an Evidence gap: no shipped fixture reliably makes AD3 reachable by hand.
- **B** needs a decision that nothing in docs/ records. An ADR skeleton is at the end.

---

## Finding A — a second save shows nothing

**What the code does:**
- **Kernel.** The second save does real work. `Projects::save` finds the open's entry, reuses its folder and checks the existing file names the same project. It then writes `locations.json` and replaces `project.spatial` (kernel/src/project/mod.rs:312-348, :400-406), then writes the history mark (:418).
- **Shell, saver.** It skips the picker because the dataset is in `saved`. Verbatim, frontends/shell/src/project/saveProject.ts:104: `        if (!saved.has(input.dataset)) {`. It then answers the same list as the first save (:115-121).
- **App stores a new object with the same texts.** Verbatim, App.tsx:2193: `    if (texts !== null) setSaveNotices({ dataset: held.dataset, texts });`
- **The render keys each line by its index.** Verbatim, App.tsx:2501: `            {shownSaveNotices.map((text, index) => (` and :2502: `              <div key={index} className="canvas-refusal save-notice" role="alert">`
  - Paraphrase: the same key and the same text means React changes no DOM node. So nothing on screen changes, and since the alert element is not re-inserted, a screen reader announces nothing either.
- **The advisor's reading is confirmed.**
- **The test cannot see it.** App.save.test.tsx:201-203 asserts the second save is sent with `folder` null, which passes. Nothing can observe that the screen did not change.
- One more case: a click while a save is still in flight answers `null` and changes nothing (saveProject.ts:98).

**What a user needs:** a change on screen that only that click causes. That means either something in the line that differs from the last save's, or a visible state of the control while the save runs. How it reads is the advisor's to rule (item 9); I say nothing about words.

**Milestone 5's first part (PR A) does not remove the fault. It changes where the fix goes.**
- Form `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`:
  - §2.2 (:217) puts save notices on a `replaced-by-owner` route.
  - :241 replaces `saveNotices` with the condition store.
  - Amendment 4, A4-1's New text (:1245), sends a save through `replaceBatch`. That ends the old conditions and raises fresh ones.
- So a second save gets a new condition with the same display and `occurrences` 1. S-5, the line that shows only when `occurrences > 1` (:260), never shows. The same text appears in the same strip place.
- The new id may remount the element, but the form does not say ConditionView keys by condition id. Even if it does, identical text looks unchanged.

**Smallest piece:**
- **Before PR A merges.** Make each save's notices visibly new: give the save batch a per-save identity used in the key, plus either a visible entry state or a per-save difference in the line (the advisor's to word).
  - Files: frontends/shell/src/App.tsx (about 5 lines at :887 and :2193-2505), the shell's stylesheet if an entry state is chosen (about 6 lines), and App.save.test.tsx (about 15 lines: the second save gives a new element, or the changed line).
  - The end-to-end proof from the real shape is one step in frontends/shell/e2e/project.mjs: save twice and assert what changed.
  - About 30-40 lines in all.
- **After PR A merges.** The same piece on ConditionView's save-notice element, the save route and C-A6's neighbour test, of the same size.
- **Advice on order.** PR A edits the same App.tsx save site (form :1593-1599). Under the rule that one path is touched by only one piece in flight, land this piece after PR A, on top of it.

---

## Finding B — after Ctrl+R, a line about changed data and a line that the project is already open

**What a reload leaves held in the kernel. The advisor's reading is confirmed, and goes further: every open the old page made, not only the project.**
- **No close runs on a reload.**
  - The shell closes datasets only from an in-page effect (App.tsx:1645-1647), and there is no unload handler: a search for `beforeunload|pagehide|unload` in src/ finds none.
  - The host's page-load hook only checks the window's origin. Verbatim, src-tauri/src/lib.rs:216: `            if payload.event() != tauri::webview::PageLoadEvent::Finished {`. Lines :215-260 close nothing.
- **The project lock stays held.** Each saved or reopened open's entry holds the identity's open lock (`_lock`, kernel/src/project/mod.rs:126-138). It is dropped only when the open is closed or its session has ended. Verbatim, mod.rs:265: `        saved.retain(|s| open(&s.dataset));`
- **So after Ctrl+R the kernel still holds** each pre-reload dataset: its catalog entry, its data-plane pool, its armed source watcher and, for AD1's and AD2's saves, its project lock. It holds them until the app process exits or that open's session ends. The new page has no handle to them and cannot close them.
- **The new page remembers no project.** Verbatim, App.tsx:891: `  const heldProjectRef = useRef<{ dataset: string; project: string } | null>(null);`
- **Reopen after the reload.** Verbatim, mod.rs:780: `        self.release_ended();` then :782: `            LockRefused::Held => OpenFailure::OpenElsewhere(identity.clone()),`
  - The kernel's message, verbatim, protocol/skp/src/v0/error.rs:280: `            format!("{project} is already open"),`
- **A further consequence** (paraphrase, from the same lines): in the same process after a reload, AD4's "The same project" for AD1's folder would also be refused, because AD1's lock is still held. "A copy" mints a new identity and is not refused (mod.rs:751).

**Which of the two lines the human most likely saw: S9-other** (reopenNotices.ts:32).
- openProject.ts:89 (paraphrase) picks S9-own only when the refusal's project equals the project this window holds. After a reload that is `null` (App.tsx:891, :1244-1247), so the first refused reopen in the reloaded page shows S9-other.
- S9-own (reopenNotices.ts:30) is possible only if the reloaded page had already reopened that project and then opened the same folder again.
- The human's "already opened" matches the kernel's message, `{project} is already open`, which the refusal block shows beside either line.

**Why a line about changed data can show after a reload and after Free up space.** The code has two candidate lines, and both need the reload:
1. **S10, the reopen's check.** It shows when size, mtime, footer length or footer hash differ, or when an admission claim differs. Verbatim, openProject.ts:135: `  if (check.observed.length > 0 || check.admission.length > 0) notices.push(reopened.relinked ? relinkedFileNotice(check) : changedFileNotice(check));` The comparison is engine/src/descriptor.rs:432-447, called from kernel/src/dataset_ref.rs:321-349.
   - A reload changes none of these. Free up space keeps the size and the bytes.
   - Only the modified time could move. The repository does not establish whether dehydration or rehydration changes it: the O0 run (state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o0-custodian-run.md:5, :28) recorded attributes, size and hash, but no modified time.
2. **The session-ended block** (App.tsx:2469-2471), carrying `engine.source_changed`'s message (engine/src/error.rs:380-384).
   - The reopen arms its watcher before the engine opens the file (kernel/src/skp.rs:1203, then :1206).
   - The watcher listens for name, size and last-write changes. Verbatim, engine/src/watch.rs:654: `            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE;`
   - If rehydration during the open shows up as one of those, the new open's session ends at once.

**Where the reload comes in** (inference from the code, not observed):
- Had the app been closed as the row says, AD2's open would have died with the process. After Ctrl+R it stays open and watched, with its lock.
- Free up space on that file can fire the old open's watcher, which ends its session. The new page drops that event: App.tsx:813 is `  if (event.session !== deps.admittedSession) {`, logged as a warn line at :818-820.
- Ending that session frees the lock through `release_ended`, so a later reopen gets past the lock. The same file event is what the reopen's check (1) or the new watcher (2) then reports.
- So one plausible order is: refused with S9-other, then Free up space, then the reopen succeeds with a changed-data line. Without a file change the reopen is refused every time until the app exits.
- Not established either way: whether OneDrive lets Free up space go ahead on a file the engine holds open.

**Is a reload reachable in a release build?** Most likely yes, but the repository does not settle it.
- Nothing here turns it off. tauri.conf.json:14-20 sets only the title and size. The shell has no keydown handler for reload and no `contextmenu` handler.
- I believe WebView2's browser shortcut keys, Ctrl+R and F5, stay on by default in a Tauri release build. That belief comes from the Tauri and wry defaults, which are not in the repository. The proof is one press of Ctrl+R in the installed NSIS build.
- In a dev build it is reachable for certain, and so is Vite's full reload.

**Which line showed: only the sitting's evidence or a run can tell.**
- **No run needed:** read the sitting's session log, `session-<stamp>.log` under the app's log folder (lib.rs:326-330, identifier `dev.spatialide.shell` at tauri.conf.json:5). It holds:
  - one `origin-self-check ok` line per page load (lib.rs:236-239), which marks the reload;
  - `reopen-refused` lines with `skp.project_open_elsewhere` and the project id (openProject.ts:75);
  - any `dataset_session_ended: dropped for an unknown session` line (App.tsx:819).
  - It does not record which S9 line showed, or S10.
- **The one run that would tell**, in its own worktree, after the advisor is told (ruling item 8): open the AD2 copy and save; Ctrl+R; open the project folder; Free up space; open the project folder again. Record the strip's lines and the session log after each step.

**Smallest piece:**
- In the host, at the start of a main-window page load, close every dataset the catalog holds, then call `Projects::release_ended`.
  - Use `PageLoadEvent::Started`, not `Finished`, so the new page's first open cannot be closed.
  - The parts exist: `Catalog::names` (kernel/src/lib.rs:253-255) and `SkpHost::close_dataset` (skp.rs:1614), which also disarms the watch.
- Files:
  - frontends/shell/src-tauri/src/lib.rs (about 20-30 lines);
  - optionally a kernel helper, if the shell's close path is not reusable (about 15 lines);
  - a kernel test: two opens, one saved, close all, then `open_project` succeeds (about 40 lines);
  - the end-to-end proof from the real shape in frontends/shell/e2e/project.mjs: open, save, reload the page, open the project, assert it opened with no refusal (about 30 lines).
- About 100-120 lines in all. It touches no protocol/ file, so the rule of one protocol piece at a time is not engaged.
- Blocking Ctrl+R in the page alone is smaller, but it is not a fix: the context menu and dev reloads still leave the kernel holding opens.

---

## Finding C — AD3 cannot be reached with `filter-zoned.parquet`

**What the code does:**
- Cancel shows from the first moment of the open (AdmissionPanel.tsx:124-131; the 200 ms delay at :127 applies only to the waiting line). So reaching it depends only on how long the download lasts.
- The file is 409,872 B (state/consults/2026-11-12-b1-shell-half-pr-b-base-series-tester-report.md:49).
- Cancel is acted on only between the open's steps and in the engine's bound queries; the two metadata reads are not bound (KNOWN-LIMITATIONS.md:558, item 75). AD3 accepts either outcome.

**Existing fixtures** (byte sizes as the cited reports read them):

| Fixture | Bytes | Source | Notes |
|---|---|---|---|
| `100k-happy-path.parquet` | 29,933,646 | tester report :50 | Under the vertex ceiling (manual_walkthrough_fixtures.rs:63-69); no `zone` column, so AD2's filter does not carry over |
| `parcels-145mb.parquet` (`S`) | 151,629,665 | kernel/RESULTS.md:2988, :4096 | Attributes and vertex total not checked in this read |
| `slow-filter-scan.parquet` | 766,186,557 | tester report :53 | Its unfiltered first look is refused at the ceiling by construction (manual_walkthrough_fixtures.rs:667-675); no `zone` |
| `parcels-5gb.parquet` | 5,004,376,705 | frontends/shell/RESULTS.md:926 | — |

**A generated size:**
- The filter generator keeps `zone`. At 2,000 features (:616-627) it makes about 205 B per feature, an inference from one point, not measured.
- The vertex ceiling, 2,000,000, caps it near 150,000-160,000 features at 12 vertices each, about 30 MB. That is no better than the 100k fixture.
- To go larger while keeping AD2's filter would need a new attribute-padding mode. There is none: `AttributeMode` at engine/src/fixture.rs:173-196 has None, CategoricalZone, MultiType and FilterWitness.

**Recommendation** (my judgment, not a measurement):
- Use `100k-happy-path.parquet` if the human's download speed makes about 30 MB last longer than a reach for Cancel. Otherwise use the 145 MB file once its attributes and vertex total are checked.
- `slow-filter-scan` is reachable on almost any line, but its first look is a ceiling refusal, so "opens as in AD2" no longer describes it.
- Any of these changes AD3's Before line and its expected outcome. That is a document change; I propose no words.

**OneDrive cost:**
- Bytes: one upload of the file's size, held against the account's quota, plus one full download per AD3 attempt.
  - The full download is inferred from the O0 run, where an open by path downloaded the whole file and cleared the online-only bits. That was for 43 B; whether a large file downloads in full or in parts is not established.
- Time: the repository records no OneDrive speed or quota. As arithmetic only, not a measurement:
  - at 100 Mbit/s: about 2.4 s for 30 MB, 12 s for 152 MB, 61 s for 766 MB;
  - at 1 Gbit/s: about a tenth of each.
- Only the human's own line tells. No duration goes into the row (docs/08; ADR-018).

---

## ADR skeleton (a decision B needs; none exists — ADR-035:133 leaves reload out of its scope)

**ADR-0xx — The main window's page lifecycle and kernel-held opens (Proposed)**
- **Context.** In the desktop shell the kernel lives as long as the process, and the page can reload (Ctrl+R, F5, the context menu, dev reloads). Opens, watchers and project locks made by one page outlive it, and no client can reach them: App.tsx:891, :1645-1647; lib.rs:215-260; mod.rs:259-266. This keeps a project locked against its own window and blocks AD4's "The same project" (docs/01: never block the user; ADR-036's lock).
- **Decision.** A main-window page load (`Started`) ends every open the previous page made: each catalog dataset is closed through `close_dataset`, then `Projects::release_ended` runs, before the new page can issue a call. Other SKP clients keep connection-scoped lifecycles, which are not decided here.
- **Consequences.**
  - Exports and streams in flight from the old page are cancelled.
  - Session histories end as at a close.
  - No change to the protocol or to MCP (docs/10).
  - Needs one end-to-end reload step (project.mjs) and a kernel test from the real `close_dataset` and `open_project` interfaces.
  - The page's own reload stays possible, and the result is now defined.

Files read (all under D:/wt/read-1124f): frontends/shell/src/App.tsx; frontends/shell/src/project/{saveProject,openProject,reopenNotices}.ts; frontends/shell/src/admission/AdmissionPanel.tsx; frontends/shell/src-tauri/src/lib.rs; frontends/shell/src-tauri/tauri.conf.json; kernel/src/project/mod.rs; kernel/src/dataset_ref.rs; kernel/src/skp.rs; engine/src/{watch,descriptor,error}.rs; protocol/skp/src/v0/error.rs; kernel/tests/manual_walkthrough_fixtures.rs; governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md; KNOWN-LIMITATIONS.md; frontends/shell/MANUAL-WALKTHROUGH.md:2021-2048.
