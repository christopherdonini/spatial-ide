# Finding B's form, drafted by lead-data: reload ends the old page's opens. A draft, not a form: it is not committed under governance/forms/ and binds nothing

*Filed by the custodian: node:part-ad-finding-b@form-draft-lead-data, under ADV-2026-11-26-08 item 1.*

- **Why a draft.** It was drafted on ADR-037's first draft. Its OPEN-1 (the base) was ruled by ADV-2026-11-26-14, and its OPEN-5, OPEN-6 and OPEN-7 by ADV-2026-11-26-13 items 2, 3 and 1, before it came back. Its §2 and U-3 follow the first draft's §5. It is revised before it is committed as a form, at the path its report names, and before its gates. Who revises it, and when, went to the advisor with its OPEN-2, OPEN-10, finding 6 and the drafter's remit.
- **Where it read.** Read only, in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08.
- **Dispatch and run.** Dispatched before 2026-11-26T19:31:26Z (date -u), with the brief brief-b-form-lead.md from the scratch folder (4822 bytes, sha256 59afe6bebd5ac600e9637580994f0c8c57088219e008833a5673577aa8f1f5c1). Its run comes from its completion notice only (ADV-2026-11-26-02: no transcript opened): 104 tool uses, 998965 ms, 205400 tokens. The model is opus, by its definition's model line. It handed back once, before 2026-11-26T19:43:34Z (date -u after saving).
- **How it was written here.** The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed, byte for byte and nothing masked: 46131 bytes, sha256 b80fecb212f2d332bef63d540c95ad54c3e31fa20ab704bad72107142e88d0e8.

---

RESULT: I drafted the full form for finding B (both gates, S0 before any code, 12 OPEN items for the advisor). It changes no kernel/, engine/ or protocol/ file.

BLOCKING QUESTIONS (one line each):
- Red line: the Started arm goes into the on_page_load closure that ADR-020 governs, and ADR-020 sits behind the human's security red line. Its sentence at :331 would then describe only the self-check. Is this the human's word, and do they want a note on ADR-020? (OPEN-2)
- Base: main's tip (recommended) or PR 356's head, which changes commands.rs? (OPEN-1)
- S0 (b): a script cannot press Ctrl+R or F5 in a plain release build. Is the human's press at the sitting the means? And does a launch count as changing the app's log/data folder, which ADV-2026-11-26-11 item 7 keeps unchanged? A launch writes a new session-<stamp>.log there. (OPEN-10)
- Remit: my definition covers drafts for pieces confined to engine/ and kernel/. This piece's Scope is all frontends/. Does the draft stand as lead-data's, or should the architect take the form?

REPORT PATH: governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md (I wrote no file; the custodian files it).
SHA256: not computed. I have no Bash and wrote no file, so the hash is the filer's to compute on the filed bytes.

===== THE DRAFT (from the next line to the line before "===== FINDINGS OUTSIDE THE FORM") =====

# Reload ends the old page's opens — preregistration (full form)

**Path (proposed):** `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md`
**PLAN node (proposed):** `reload-ends-the-old-pages-opens` (the custodian adds it).
**Authority:**
- ADV-2026-11-26-08, item 1 (finding B, the base, no protocol file, S0), item 4 (the order) and item 6 (v0.2 and the merge after the tag).
- ADV-2026-11-26-11, items 1, 2 and 5.

Both rulings are cited by id and item and are not reproduced. Their words are the advisor's, under the delegation of 2026-11-13, not the human's.

- **The design** is ADR-037, "The main window's page lifecycle and the opens the kernel holds across a reload". It is Proposed and not accepted, and it binds nothing until the advisor accepts it. The draft is filed as `state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.draft.md`. This form cites it by section and builds what its Decision says. It is not this form's Authority until it is accepted, and no code is written before then (OPEN-3).
- **The finding** is `state/consults/2026-11-26-part-ad-findings-a-b-c-architect-read.md`, its section "Finding B".

**Reuse lookup.** The custodian's run printed, byte for byte, with exit status 1: `No prior art recorded for "page reload lifecycle". Research it before planning an implementation.` This is a miss: no prior art informs this form.

**Drafted by** lead-data, on the custodian's brief (`node:reload-ends-the-old-pages-opens@form-draft-lead-data`).
- Inputs: the two rulings, the ADR-037 draft and its architect report, and the architect read. All were read at main `c28c8cf10a5b616af3ce660d13b1478d90e4ea08` in the read checkout.
- Remit: lead-data's definition names drafts for pieces confined to engine/ and kernel/. This piece's Scope is all `frontends/`. That question is put to the custodian. The kernel and engine impact read is §2.6.

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Gating:** full form, both gates: the architect and the reviewer.
**Merge:**
- After the v0.2 tag unless the human says otherwise (ADV-2026-11-26-08 item 6).
- A merge that keeps the branch's commits reachable from main: no squash, no rebase.
- Before the merge, the branch is checked for changes main made since the gates in every Scope file. The check is recorded in the closing amendment.

**Isolation:**
- Nothing that builds, tests or launches starts until a read shows C: over its floor (ADV-2026-11-26-11 item 1).
- The worktree and the build output go on D: (item 5).
- A run still costs C: room (§0.5).

**Reading rule.** Every path:line is at c28c8cf1. A quote marked verbatim is byte-copied from the Read output; a sub-line span says so. Everything else is paraphrase. There are no span hashes; the gates pin what they must.

## §0. Disclosure

### 0.1 The fault, and what the user sees

- **Fault.** The user saves a project, or reopens one, in the main window. Then they reload the window (Ctrl+R, F5, the context menu's Reload). Opening the same project folder is now refused: the project lock is still held by the old page's open, which nothing closed. Every open the old page made stays held in the kernel: its catalog entry, its DuckDB pool, its armed source watch and, for a saved or reopened open, the project's lock. It stays held until the app process exits or that open's session ends.
- **What the user sees** (from the architect read's Finding B, paraphrase): the refusal block with the code `skp.project_open_elsewhere` and the kernel's "… is already open" message. The read finds that a reloaded page shows the S9-other place, because the new page holds no project (`frontends/shell/src/App.tsx:891`). It shows every time until the app is closed, unless the old open's session ends, for example on a change to its file.
- **Where it came from:** the human's sitting, Part AD. The human's words are not quoted here.

### 0.2 What the code does today (paraphrase, with the lines)

- **The page closes a dataset only from an in-page effect** (`App.tsx:1645-1650`). The shell has no unload handler (the architect read's search for `beforeunload|pagehide|unload`).
- **The host's page-load hook acts only on `Finished`.** Verbatim, `frontends/shell/src-tauri/src/lib.rs:216` (a sub-line span): `if payload.event() != tauri::webview::PageLoadEvent::Finished {`. Its body (`:219-277`) checks the label, reads the URL and logs the origin self-check. It closes nothing.
- **The lock is released only for an open that is closed or ended.** Verbatim, `kernel/src/project/mod.rs:265` (a sub-line span): `saved.retain(|s| open(&s.dataset));`
- **The reopen releases first, then takes the lock.**
  - Verbatim, `mod.rs:780` (a sub-line span): `self.release_ended();`
  - Then `:782` (a sub-line span): `LockRefused::Held => OpenFailure::OpenElsewhere(identity.clone()),`
  - Mapped at `:937` (a sub-line span): `OpenFailure::OpenElsewhere(p) => SkpError::project_open_elsewhere(p.as_str()),`
- **There is one window.** The shell's one product `SkpHost` is built at `lib.rs:282-296`. Every catalog entry comes through the `open_dataset` and `open_project` commands (`frontends/shell/src-tauri/src/commands.rs:63-79`, `:204-224`). That is ADR-037 §2's reading, which this read confirms.
- **Cancel keys are random.** The page mints them with `crypto.randomUUID()` (`frontends/shell/src/admission/AdmissionPanel.tsx:303`). A new page's key therefore does not collide with a key the old page left in flight. That case would otherwise be refused as a key in use (`kernel/src/skp.rs:1118-1135`).

### 0.3 What informed this form

| Input | Used for |
|---|---|
| The architect read, Finding B (`state/consults/2026-11-26-part-ad-findings-a-b-c-architect-read.md`) | The fault; `Started`, not `Finished`; the session-log evidence (one `origin-self-check ok` line per page load) |
| The ADR-037 draft, §1–§8 and its "Open questions for the advisor" | The design built here; OPEN-3 to OPEN-8 |
| `frontends/shell/e2e/pan-anchor.mjs:64` and `frontends/shell/e2e/recentre-crossing.mjs:84` | The precedent for `page.reload({ waitUntil: "load" })` in a suite |
| `frontends/shell/e2e/reopen.mjs:185` (`hookOpen`) and `:245-262` (R4) | The reopen hook, and the control that a same-page reopen is refused. Verbatim `:248` (a sub-line span): `expectAnswer(answer, "skp.project_open_elsewhere", "the same-window reopen");` |
| `kernel/tests/project_reopen.rs:1035-1075` (K-O4) and `:1875-1904` (K-O26) | Precedent (paraphrase): a second `Projects` over the same machine store sees a held lock as open elsewhere in the same process. U-1 and U-2 use this to observe that `release_ended` ran |
| `kernel/tests/project_save_skp.rs:42-85` | The rig shape: a real `SkpHost`, `StepRecorder`, `Projects`, a fixture from `write_geoparquet`, the save's wire JSON |

### 0.4 Not established by this read

- Which navigations raise `PageLoadEvent::Started` under tauri 2.11.5 on WebView2 (ADR-037 §1). Also that `Started` is raised for the main document only. No iframe and no in-page navigation exists in `frontends/shell/src` (a search for iframe, `location.reload|assign|href` and `pushState` found none).
- That `PageLoadEvent` has a `Started` variant. This is taken from tauri 2.11.5's source as ADR-020 cites it (`tauri-2.11.5/src/webview/mod.rs:21`), not read here. The build settles it.
- That `tauri::Builder::on_page_load` holds a single closure, so that a second call replaces the first. I believe it does; that is not established. §9 item 4 forbids a second call either way.
- Which thread the hook runs on. The Started arm is constant-time either way (§2.2).
- Whether Ctrl+R and F5 reload a release build (S0 (b)).
- Where the dev build's session log and WebView2 data land when a suite sets `LOCALAPPDATA` (§0.5, and finding 6 outside the form).

### 0.5 S0 — before any code

**S0 (a): the fault red at the base, by the end-to-end step.**
- Worktree: one on D: at the base (OPEN-1), with build output on D:.
- Commit 1: adds E-1's three steps to `frontends/shell/e2e/project.mjs` (§2.4) and nothing else.
- One run of `npm run e2e:project`.
- Predicted:
  - OPEN to SECOND-SAVE pass;
  - HELD-BEFORE-RELOAD passes (the control: the same page's reopen answers `skp.project_open_elsewhere`);
  - RELOAD passes;
  - REOPEN-AFTER-RELOAD fails, answering `"skp.project_open_elsewhere"`;
  - the chain stops there and the run exits 1.
- The result is recorded in an amendment, with the commit and the run.

**S0 (b): one reload by key in a release build of the base, and what the session log shows.**
- **If a release build of the base already stands** (a check for the custodian; this read cannot see outside the read checkout):
  - launch it, press Ctrl+R once, wait for the page, press F5 once, close the app;
  - read that run's `session-<stamp>.log` (the name is made at `frontends/shell/src-tauri/src/state.rs:47`) in the app's log folder (`lib.rs:326-339`; identifier `dev.spatialide.shell`, per the architect read's cite of `tauri.conf.json:5`), read-only, as ADV-2026-11-26-09 allows.
  - Predicted: three lines carrying `origin-self-check ok pinned=` (`lib.rs:238`): the first load and one per reload.
- **A script cannot press the key in a plain release build.**
  - A plain release build has no CDP port. The only exe launch with a CDP port is the measure build (`frontends/shell/e2e/lib.mjs:254-303`, `attachOrLaunchExe`).
  - Whether a CDP-dispatched Ctrl+R reaches WebView2's reload handling there is not established, and the measure build is not a plain release build.
  - Pressing a key from a script into a foreground window on this shared machine is not established either.
  - So the press is left not established. The human presses once at a later part of the sitting (ADV-2026-11-26-08 item 1). OPEN-10 asks whether a measure-build press may stand in.
- **If no release build of the base stands**, the custodian tells the advisor before any build starts (ADV-2026-11-26-08 item 1). The piece keeps its node.
- **If the presses add no line**, no reload reaches a release build. That is stop S-2.

**What S0 costs on C:** (unmeasured; the custodian reads C:'s free space before and after each run).
- **(a)**
  - On D: the cargo output (`CARGO_TARGET_DIR` on D:), the worktree, and its two `node_modules` (the shell's and `renderer/bundle-viewer`'s).
  - Still on C:
    - the OS temp folder, which holds `project.mjs`'s scratch store, its three project folders and the fixture copy that INSIDE-OPEN makes (`project.mjs:60-65`, `:345-346`; that step does not run in S0 (a) because the chain stops earlier);
    - the compiler's and linker's temp files under TMP;
    - the npm cache, if `npm ci` downloads anything;
    - the dev app's WebView2 data and its session log (where these land is not established here).
  - Option: point TMP and TEMP at a D: folder for the run. That moves the suite's temp folders, because `project.mjs` uses node's `tmpdir()`.
  - The fixture is read in place from the main checkout (`project.mjs:73`), which ADV-2026-11-26-11 item 4 leaves where it is. Reading it costs nothing.
- **(b)** A launch writes a new session log and WebView2 data under the app's folders on C: (OPEN-10).

## §1. What this preregistration may and may not claim

**May claim, once it is green:**
- After a reload of the main window, the project the old page saved or reopened opens in that window. The proof is E-1, from the real app.
- The old page's opens are closed, and their project locks freed, by the binding's own functions over a real `SkpHost` and `Projects` (U-1).
- An open that returns after its page ended is closed (U-2).
- The new page's opens wait for every end that is running (U-3).

**May not claim:**
- Any duration or performance number. No docs/08 row; the gate's wait is not measured.
- Which navigations other than a CDP `page.reload()` in the dev build raise the end. Ctrl+R and F5 in a release build wait for S0 (b) and the sitting. The context menu's Reload is not established.
- Anything about a second window, which ADR-037 §6 forbids, or about another SKP client.
- Anything about asking before a reload or switching off the reload keys (ADR-037 Open 1; OPEN-4).
- A change to the step record (ADR-036; ADR-037 §8).
- Any wire change. No SKP command, member, event or code; no `protocol/` file (ADR-037 §7). ADR-018's cancel vocabulary is unchanged.
- That ADR-020 is amended. It is not, and OPEN-2 asks whether it must be.
- macOS or Linux behaviour (§2.7).

No user-visible string is added.

## §2. The change — stated before it is applied

All in the shell's Rust half and one suite. The kernel calls are used as they are.

### 2.1 `frontends/shell/src-tauri/src/page.rs` (new; every item `pub(crate)`)

**`Pages`**, managed as `Arc<Pages>`:
- one `std::sync::Mutex` over:
  - `page: u64`;
  - `names`: the dataset handles returned to the current page;
  - `in_flight`: each in-flight open's cancel key, mapped to the page it began under;
  - `ends_running: usize`;
- a `tokio::sync::watch` channel that announces `ends_running`.

The mutex is a leaf. It is never held across a kernel call, a publish call, a thread spawn or an `await`.

**`start_page(&self) -> Ended`.** Called from the hook, in constant time. Under the mutex it:
- increments `page`;
- takes `names`, and the keys of `in_flight`, into the returned `Ended`;
- increments `ends_running` and announces it.

ADR-037 §3 step 1.

**`run_end(&self, ended: Ended, host: &SkpHost, projects: Option<&Projects>, running: &RunningPublishes, stop_poll: impl Fn(&str)) -> EndSummary`**, on a thread of its own. In order (ADR-037 §3 step 2):
1. **Cancel.** For each key: `host.cancel(CancelRequest { skp, handle: key })`. Then `running.cancel_all()`, if OPEN-5 is ruled (a).
2. **Close.** For each name: `host.close_dataset(CloseDatasetRequest { skp, dataset })`, then `stop_poll(name)`, which is the pool-poll stop under its `cfg` (`commands.rs:148-151`).
3. **Release.** `projects.release_ended()` once, when `Projects` exists.
4. **Log.** One session-log line (OPEN-11 holds its words) carrying only three counts: opens closed, keys cancelled, publishes cancelled. It carries no handle, path, key or project identity.
5. **Open the gate.** Decrement `ends_running` and announce it.

The `skp` field is `SKP_VERSION`. Verbatim, `protocol/skp/src/v0/mod.rs:136`: `pub const SKP_VERSION: &str = "skp/0.14";`

**`begin(&self, cancel_key: &str) -> Ticket` (async).**
- Waits on the watch until `ends_running` is 0.
- Then, under the mutex, re-checks that `ends_running` is still 0 and waits again if it is not.
- Records `cancel_key` under the current page.

ADR-037 §5. A new page's opens wait only for the ends, not for the old page's in-flight opens (OPEN-6).

**`finish(&self, ticket: Ticket, opened: Option<&DatasetHandle>) -> Kept`.** Under the mutex it removes the key. Then:
- if the ticket's page is the current page and a name was returned, it enters the name and answers `Kept::Yes`;
- if the ticket's page has ended, it answers `Kept::LateClose`.

The check and the insert share one critical section with `start_page`'s take. A reply therefore lands in a live page's set or in the late close, never in neither (ADR-037 §4).

**`late_close(name, host, projects, stop_poll)`.** The close (step 2 above) and `release_ended`, for one name.

**`forget(&self, name: &str)`.** Removes the name from the current page's set when the page closes it itself.

**The hand-off from the hook (the glue).**
- `pub(crate) fn on_started(app: &AppHandle, pages: Arc<Pages>)` calls `start_page`. It then spawns a named std thread that reads `Arc<SkpHost>`, `Option<Arc<Projects>>`, `Arc<RunningPublishes>`, `SessionLog` and, under its `cfg`, `PoolPollTasks` through `try_state`, and calls `run_end`.
- **If the thread cannot start** (draft decision D-1, for the gates): one standard-error line, as `commands.rs:144-146` does. The end is abandoned: `ends_running` is decremented so that the gate does not stay shut, and the old set is dropped unclosed. That is today's fault for that one reload, not a closed window.

The session-log line is written here, not in `commands.rs`. The test at `commands.rs:822-862` (K-4) forbids a new `.append(` line in that file.

### 2.2 `frontends/shell/src-tauri/src/lib.rs`

- `mod page;`, and `app.manage(Arc::new(page::Pages::new()))` beside the other managed state (`:484-490`).
- **The Started arm**, inserted in the existing `on_page_load` closure before the Finished filter at `:216`. If the event is `Started` and the label is `PinnedOrigin.window_label`, it calls `page::on_started` and returns. Any other `Started` returns.
- The Finished arm, `:216-277`, stays byte-identical. ADR-020 governs it (OPEN-2).
- The comment at `:190-214` gains a paragraph that names the second arm.
- The crate's "no logic" doc at `:13-16` gains the exception that ADR-037's Consequences name.

### 2.3 `frontends/shell/src-tauri/src/commands.rs`

- **`open_dataset`** (`:63-79`) and **`open_project`** (`:204-224`) gain `pages: State<'_, Arc<Pages>>`. Each runs these steps:
  1. awaits `pages.begin(&request.cancel_key)` before its `spawn_blocking`;
  2. after the reply, calls `pages.finish(ticket, <the Opened dataset, if any>)`;
  3. on `LateClose`, awaits `page::late_close` on `spawn_blocking` and starts no pool poll;
  4. otherwise, starts the pool poll as today.
- The reply is returned as the kernel gave it.
- **`close_dataset`** (`:134-153`) calls `pages.forget` after the host's close.
- **The module doc** (`:16-20`) names the page bookkeeping beside the `release_ended` hand-off it already names. Verbatim `:16` (a sub-line span): `**This file contains no logic**`
- **No other command changes.** `save_project`, `record_step`, `viewport_query` and the publish commands do not wait on the gate (ADR-037 §5).

### 2.4 `frontends/shell/e2e/project.mjs` (E-1; placement under OPEN-9, drafted as option (a))

- A mount wait made into one function, used at the start and after the reload. It also waits for the `e2eOpenProjectFolder` hook, which is registered at `AdmissionPanel.tsx:448`.
- A `hookOpen` helper shaped as `reopen.mjs:185`.
- Three steps between SECOND-SAVE and INSIDE-OPEN:
  1. **HELD-BEFORE-RELOAD:** `e2eOpenProjectFolder(FOLDER_ONE)` answers `"skp.project_open_elsewhere"`. This is the control: the lock is held while the page's open lives, as in R4.
  2. **RELOAD:** `page.reload({ waitUntil: "load" })`, as `pan-anchor.mjs:64` does, then the mount wait.
  3. **REOPEN-AFTER-RELOAD:** `e2eOpenProjectFolder(FOLDER_ONE)` answers `"admitted"`; the workspace read back through `e2eReadWorkspace` (used at `reopen.mjs:187`) holds the saved file's three clauses; and the first pixels are drawn, as INSIDE-OPEN checks them (`project.mjs:349-355`).
- The header:
  - the steps sentence (`:23-25`);
  - the "Not proved here" line. Verbatim `:27` (a sub-line span): `**Not proved here:** the native folder picker (OP1); reopen;` It now says that reopen after a reload is driven, and that other reopens are not;
  - one recorded-mutation entry, m-reload (§4).

### 2.5 `frontends/shell/e2e/README.md`, the Project spec entry only (`:832-846`)

- The "Asserted" list gains the three steps.
- In "What it proves not", the sentence "Reopen is not driven." (verbatim, `:846`, a sub-line span) says that only the reopen after a reload is driven.
- The words are drafts for the advisor and are not the human's.

### 2.6 Kernel and engine: no change (impact read, pointers)

- **Kernel interfaces used as they are:**
  - `SkpHost::cancel`. Verbatim `kernel/src/skp.rs:1600` (a sub-line span): `pub fn cancel(&self, req: CancelRequest) -> Result<CancelResponse, SkpError> {`
  - `SkpHost::close_dataset` (`skp.rs:1614-1675`; paraphrase: it takes a `CloseDatasetRequest` and returns `Result<CloseDatasetResponse, SkpError>`).
  - `Projects::release_ended`. Verbatim `kernel/src/project/mod.rs:259` (a sub-line span): `pub fn release_ended(&self) {`
  - `Projects::open_project_command` (`mod.rs:894-897`), reached through the existing command.
- **Shell interface used:** `RunningPublishes::cancel_all`. Verbatim `frontends/shell/src-tauri/src/publish.rs:1183` (a sub-line span): `pub fn cancel_all(&self) -> usize {`
- **Lock order:**
  - the `Pages` mutex is a leaf;
  - `release_ended` takes `saved` before the catalog, as `save` does (`mod.rs:301-304`);
  - so a save racing the end is either refused by the open check (`mod.rs:304-311`) or completes, after which `release_ended` frees its lock (`mod.rs:247-258`).
- **KNOWN-LIMITATIONS items touched by pointer, none edited:**
  - 72 (a project is kept open once only within one user's store): unchanged;
  - 62 (store folders): unchanged;
  - 70 (an earlier run's history): unchanged, since the end ends no history record (ADR-037 §8);
  - 75 (a Cancel before an online-only file has downloaded): an end's cancel of a reopen in that phase is acted on only after those reads return. That is the residual OPEN-6 names.
- **ADRs:**
  - ADR-035: no event added;
  - ADR-036: its rules unchanged;
  - ADR-020: OPEN-2;
  - ADR-004 and docs/10: nothing crosses a plane;
  - ADR-006: the end is not a workspace mutation, and a publish it cancels goes through its own audited path (ADR-037 Consequences).
- **Engine:** no interface is touched. The source watch is disarmed through `close_dataset` as today (`skp.rs:1628-1633`).
- **Owner's indexes:** no kernel or engine index pointer changes. The shell has no owner's index yet (PLAN node `shell-owners-index`).

### 2.7 Portability (R3, conditional)

- The piece adds no platform branch. It depends on the webview raising a page-load `Started` per navigation.
- **Owning boundary:** the shell's page-load hook, over tauri's runtime.
- **Windows:** supported. E-1 shows it, in the dev build.
- **macOS and Linux:** the shell is neither built nor shipped there (KNOWN-LIMITATIONS item 1), so nothing is claimed. Whether R3 applies here, and if so which grade, is for the architect (OPEN-12).

## §3. Fixtures

| Fixture | Used by | Predicted |
|---|---|---|
| `filter-zoned.parquet` from the main checkout (`project.mjs:73`), sha256 before and after as the suite records | E-1 | Unchanged |
| A file from `write_geoparquet`, `FixtureSpec { features: 500, avg_vertices: 12, seed: 1, attributes: CategoricalZone }`, in the test's own temp folder named with the test process id | U-1 to U-4 | Written by the test and removed at its end |

## §4. Tests, and the mutation per new test

Each mutation is observed by applying it, running the test, recording the failure by name with its commit, and reverting it.

**P0 approach:**
- Commit 1 is S0 (a).
- Commit 2 adds `page.rs` with its types and with bodies that keep today's behaviour: `start_page` takes nothing, the gate never shuts, `finish` always keeps, and `run_end` does nothing. It also adds U-1 to U-4 (and U-5 if OPEN-5 is ruled (a)). All of them are red.
- Commit 3 is the change, wired in.

| Id | File, test | Red before | Mutation |
|---|---|---|---|
| U-1 | `page.rs` tests, `an_end_closes_the_old_pages_opens_and_frees_the_project_lock` | Yes, at commit 2. B's reopen is refused | (a) `run_end`'s close loop removed: B's reopen answers `skp.project_open_elsewhere`. (b) `run_end`'s `release_ended` call removed: the same failure |
| U-2 | `page.rs` tests, `an_open_that_returns_after_its_page_ended_is_closed_and_frees_its_lock` | Yes. The name stays in the catalog | `finish` enters the name whatever the page: the catalog still holds it, and B's reopen is refused |
| U-3 | `page.rs` tests, `a_new_pages_open_waits_until_every_running_end_has_run` (`#[tokio::test]`, current-thread runtime, no sleep or timeout; it observes with `JoinHandle::is_finished` after `yield_now`) | Yes. `begin` finishes at once | (a) `start_page` does not shut the gate: `begin` finishes before any end. (b) The gate is a flag that each end opens: `begin` finishes after the first of two ends |
| U-4 | `page.rs` tests, `a_name_the_page_closed_itself_is_not_in_the_ended_set` | Yes (at the stub, the control fails) | `forget` does nothing: the `Ended` holds the closed name |
| U-5 (only under OPEN-5 (a)) | `page.rs` tests, `an_end_cancels_every_registered_publish` | Yes | The `cancel_all` call removed: the registered token reads not cancelled |
| E-1 | `frontends/shell/e2e/project.mjs`, steps HELD-BEFORE-RELOAD, RELOAD, REOPEN-AFTER-RELOAD | Yes, at S0 (a): REOPEN-AFTER-RELOAD answers `"skp.project_open_elsewhere"` | m-reload: the Started arm in `lib.rs` removed. It fails at REOPEN-AFTER-RELOAD with that answer |

**What U-1 does:**
- The rig, all real:
  - a `SkpHost` over `Catalog::new()`, `StreamRegistry::new()` and a six-line local `SourceWatchArm` answering `ArmOutcome::ChecksOnly` (`engine/src/watch.rs:53-69`; the kernel's `watch_support` is test-only and unreachable from the shell);
  - `session_end_channel().0`;
  - a `StepRecorder`;
  - `Projects` A over a machine folder.
- The page:
  1. open through `begin` → `host.open_dataset` → `finish`;
  2. save through A's `save_project`, with the wire JSON as `kernel/tests/project_save_skp.rs` builds it;
  3. a second, unsaved open;
  4. `start_page`, then `run_end`.
- It asserts:
  - the catalog holds neither name;
  - `Projects` B, over its own `SkpHost` and `StepRecorder` and sharing only the machine folder (as K-O4's second run does), reopens the folder: its `open_project_command` answers `Opened`.

U-1 and U-2 are the binding-level seam test of ADR-037's Proof.

**Declared unchanged:**
- the shell's existing unit tests, K-4 among them;
- `frontends/shell/src-tauri/tests/sole_caller_scan.rs`;
- `reopen.mjs`: R4 is unchanged, and no reload happens in it;
- `pan-anchor.mjs` and `recentre-crossing.mjs`: their assertions are unchanged; their reloads now end the prior page's opens;
- every kernel and engine suite, since no file of theirs changes.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions** (a wrong one is a result, recorded and never edited):
- P1, S0 (a), as §0.5 states.
- P2, S0 (b), three `origin-self-check ok pinned=` lines, as §0.5 states.
- P3, commit 2: U-1 to U-4 are red by their assertions.
- P4, commit 3:
  - every test is green;
  - E-1 is green in one run, with INSIDE-OPEN, INSIDE-SAVE and NOTICE-S18 passing after the reload;
  - each mutation is red as §4 states.

**Declared unchanged:**
- `lib.rs:216-277`, byte for byte;
- the session log's origin self-check lines;
- every command's reply shape;
- the exit drain (`lib.rs:576-609`);
- §4's list.

**Invalidators (each a stop):**
- **I1.** E-1 is red after commit 3 because `Started` is not raised for `page.reload()` in the dev build.
- **I2.** More end lines than reloads in a run's session log: `Started` is raised more than once per navigation, or for a sub-frame.
- **I3.** The end's thread fails to start in any run.
- **I4.** A change to `kernel/` or `protocol/` turns out to be needed.
- **I5.** REOPEN-AFTER-RELOAD is refused in some runs but not others: the gate does not cover the window.
- **I6.** An INSIDE-* step fails after the reload when it passed at the base. Placement goes back to the advisor (OPEN-9).

**Falsification.** The form is wrong in any of these cases:
- after the change, a reload still leaves the saved project refused in its own window;
- the end closes an open the new page made;
- the Started arm waits on any kernel lock, which would block the event loop (docs/01).

## §6. Instruments

Every quantity is an assertion: a reply's kind or code, the catalog's holding of a name, a token's state, a test task's finished flag, a count of session-log lines. Nothing is measured. No docs/08 row is claimed.

## §7. Size and Scope

**Scope (5 files, plus the ADR):**
1. `frontends/shell/src-tauri/src/page.rs` (new): about 150 product lines and about 250 test lines (U-1 to U-5 with the rig).
2. `frontends/shell/src-tauri/src/lib.rs`: the doc at `:13-16`, the comment at `:190-214`, the Started arm before `:216`, `mod page;`, and the `manage` beside `:484-490`. About 35.
3. `frontends/shell/src-tauri/src/commands.rs`: the doc at `:16-20`, `open_dataset` (`:51-79`), `close_dataset` (`:111-153`), `open_project` (`:196-224`). About 50.
4. `frontends/shell/e2e/project.mjs`: the header at `:23-51`, the helpers, three steps, the chain at `:458-470`, the mount wait at `:448-455`. About 75.
5. `frontends/shell/e2e/README.md`: the Project spec entry, `:832-846` only. About 6.
6. `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md`: the accepted text as the advisor rules it, byte for byte (ADV-2026-11-26-08 item 2). Counted apart, outside the budget.

**Budget and count:**
- Ceiling: at most 640 changed lines (insertions plus deletions) over items 1 to 5. The estimate is about 566.
- OPEN-6 (b) would add about 40, inside the ceiling.
- The architect read estimated 100 to 120 lines for a catalog-wide close. ADR-037's page set, late close and gate, and the real-host tests, are the difference.
- Counting: `git diff --numstat <merge-base>...<head> -- frontends/shell/src-tauri/src/page.rs frontends/shell/src-tauri/src/lib.rs frontends/shell/src-tauri/src/commands.rs frontends/shell/e2e/project.mjs frontends/shell/e2e/README.md`, at a named commit.
- An overrun is class 8, and this line is never edited to match. Any file added to Scope is class 9, declared before its code.

**Constants:** none added.

## §8. Overlap and merge order, by file

From the custodian's check at origin/main 3673ff0f, and from the forms read here. The custodian confirms each branch by git before code.

| File | Open PRs | In-progress pieces | Reading |
|---|---|---|---|
| `page.rs` (new) | none | none | — |
| `lib.rs` | none (the custodian's check) | none found: the in-progress forms read here cite it only by line | — |
| `commands.rs` (shell) | **PR 356** (`shell-tests-temp-folder-of-the-runs-own`): tests only, inside two `cfg(test)` modules, held to the tag | `relink-after-refusal-at-the-recorded-place` names `commands.rs`. That is `protocol/skp/src/v0/commands.rs` (its form, §7 and §9), not this file | OPEN-1. This piece edits no test module in this file, so the hunks are disjoint as drafted |
| `e2e/project.mjs` | none (the custodian's check) | none | The relink piece's R10 is in `reopen.mjs`, which this piece does not touch |
| `e2e/README.md`, the Project spec entry | PR 359 changes `e2e/README.md` (the identity-route form's overlap table, at `:251` of that form); which entry is not established here | the identity route (its admission-remediation entry); the relink (its E-REOPEN entry) | Separate entries count as separate paths. This piece touches the Project spec entry alone |
| `kernel/src/project/mod.rs`, `kernel/src/skp.rs` | PR 361 changes `mod.rs` | `opened-of-panic-sites-free-the-lock` | Not touched (§9 item 2) |

**Semantic overlaps, with no shared file:**
- **PR 361:** a panic while the reopen's reply is built frees the lock and closes the dataset. Here `finish` then sees an `Err` and records nothing. Without PR 361 that case stays held, as today.
- **`describe-fails-after-opened-closes-the-handle`:** the page's close of that handle goes through `close_dataset`, which calls `forget`.
- **The relink and the identity route:** their opens go through `open_project` and `open_dataset`, so they wait on the gate.

**Merge order:** after the tag. Relative to PR 356, per OPEN-1. In any order with PR 361.

## §9. Block-on-sight and stops

**Block-on-sight:**
1. Any diff outside §7's files, this form, PLAN and the records.
2. Any diff under `kernel/`, `engine/` or `protocol/` (`SKP-V0.md` included). `kernel/src/project/mod.rs` and `kernel/src/skp.rs` are named.
3. A dependency or feature line, `Cargo.toml`, `Cargo.lock`, `package.json`, a lockfile, `tauri.conf.json` or `capabilities/`.
4. A second `.on_page_load(` call; any byte of `lib.rs:216-277` changed; the Started arm placed after the Finished filter.
5. The Started arm doing more than the label check, `start_page`, and the thread spawn with its standard-error line.
6. The `Pages` mutex held across a kernel call, a publish call, a spawn or an `await`.
7. A gate wait in any command but `open_dataset` and `open_project`, or any wait on the event loop's thread.
8. A new `.append(` line in `commands.rs`; the end's line carrying a handle, path, key or project identity.
9. A `pub` item in `page.rs`; an item with no product caller.
10. A sleep or timeout in U-1 to U-5. A test temp folder without the test process id (the rule PR 356 brings).
11. A mutation said to be observed through `verify-mutation`, or one recorded without its commit.
12. A §7 overrun not recorded as class 8, or §7 edited.
13. A bare self-line, a hash at a branch commit, or a line cite into `governance/DECISIONS-PENDING.md`.
14. Product code before ADR-037 is accepted, or before a read shows C: over the floor.
15. A user-visible string added.
16. A merge before the tag without the human's word; a squash or rebase merge.

**Stops, to the custodian, who takes them to the advisor:**
- **S-1.** A `kernel/` or `protocol/` change is needed. That is a stop to the advisor under ADV-2026-11-26-08 item 1.
- **S-2.** S0 (b) shows no reload reaching a release build. The advisor is told before the build starts.
- **S-3.** S0 (a) is not red as P1 predicts.
- **S-4.** The advisor rules an ADR-037 question this form depends on differently from the draft. An amendment follows, before code.
- **S-5.** OPEN-2 is unanswered: no code of the Started arm.
- **S-6.** C: falls under the floor: nothing builds, tests or launches.

## §10. Gates

**Architect** reads:
- docs/01, never block the canvas: the constant-time Started arm, the end off-thread, the gate on the async runtime;
- docs/02, the frontends row's "no logic" and its named exception;
- docs/10 and ADR-004: nothing crosses a plane;
- ADR-006's classes;
- ADR-018: cancel, not a new vocabulary;
- ADR-020 and OPEN-2;
- ADR-035 and ADR-036, unchanged;
- ADR-037 §1 to §8 against the diff;
- the seam and caller rules for each seam below;
- §9, item by item.

**Reviewer** reads:
- the full diff;
- P0 and each mutation, observed again;
- the §7 count;
- the lock order: the `Pages` mutex as a leaf, `saved` before the catalog;
- the critical section that `finish` shares with `start_page`;
- D-1.

**Seams**, each against its actual interface:
- `SkpHost::cancel` (`skp.rs:1600`);
- `SkpHost::close_dataset` (`skp.rs:1614-1617`);
- `Projects::release_ended` (`mod.rs:259`);
- `Projects::open_project_command` (`mod.rs:894-897`);
- `RunningPublishes::cancel_all` (`publish.rs:1183`);
- `tauri::Builder::on_page_load` and `PageLoadEvent::Started` (tauri 2.11.5, per ADR-020's cite).

The end-to-end proof from the real shape is E-1. The binding-level proofs are U-1 and U-2, over a real host and real `Projects`.

**Suites, green before either gate:**
- in the shell crate's own folder (it is excluded from the workspace): `cargo fmt --check`, `cargo clippy --all-targets -D warnings` and `cargo test`;
- the shell's `npm` format check, typecheck and tests;
- E-1 (`npm run e2e:project`), plus one run each of `reopen.mjs`, `pan-anchor.mjs` and `recentre-crossing.mjs` (declared unchanged);
- `verify-cites`, `verify-quotes` and `verify-test-claims`, each named with the tool's commit.

**Operator:**
- S0 (b)'s press;
- after the merge, one row at the sitting: in the installed build, Ctrl+R, then Open project on the saved folder opens it. Its words are the advisor's. MANUAL-WALKTHROUGH.md is not in Scope (OPEN-12).

## OPEN items for the advisor (options, costs, lead-data's recommendation, as a draft)

- **OPEN-1. The base.**
  - (a) Main's tip. Costs: the merge check of `commands.rs` against PR 356 if it lands first.
  - (b) PR 356's head. Costs: 356's 23 test lines enter this branch's base, and this merge waits for 356. `page.rs`'s tests gain nothing from it: 356's helpers are private to their own `cfg(test)` modules.
  - Neither changes the tests or the line count.
  - Recommendation: (a).
- **OPEN-2. The red line (to the human).**
  - The Started arm sits in the closure ADR-020 governs. ADR-020 says of itself (verbatim, `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:329`, a sub-line span): "this ADR sits behind the human's security red line".
  - Its description says (verbatim, `:331`, a sub-line span): "(this hook only runs on `PageLoadEvent::Finished`)". After the piece that holds of the self-check only.
  - Options:
    - (a) The arm as drafted, with the Finished arm byte-identical and a note on ADR-020 in the human's words. Costs: no test or code lines beyond §7; one ADR note (not in Scope; class 9 if added).
    - (b) As (a), with no note, ADR-037 recording the closure's second role. Costs: none.
    - (c) Create the main window in code with a per-window page-load handler. Costs: it moves the window out of `tauri.conf.json`, which is a setting and so the human's; about 40 more lines; the measure build's window code too.
  - No recommendation: it is the human's.
- **OPEN-3. ADR-037's acceptance.**
  - No product code before acceptance.
  - The accepted text lands in this PR as §7 item 6.
  - A ruling that changes a section this form builds is S-4.
- **OPEN-4. ADR-037 open question 1: ask first, or switch off the reload keys.**
  - Out of this piece. A dependency or a setting is the human's.
  - The options' costs are ADR-037's Open 1 (i) to (iv). None of them removes the need for this piece: dev reloads and the suites' reloads remain.
- **OPEN-5. ADR-037 open question 3: publish at reload.**
  - (a) Cancel, as the exit path does. Costs: U-5 (about 30 lines) and 2 product lines.
  - (b) Let it run to its own outcome. Costs: none; the outcome is unseen, and the publish holds its `Arc<Dataset>` after the close (`commands.rs:405-408`, `:491-510`).
  - A prepare still in its picker is not reached either way. Its attempt lapses at `PENDING_ATTEMPT_TTL`, 600 s (`publish.rs:69`). By its doc, a prepare cancelled in its pin phase leaves no grant and no pending attempt (`publish.rs:494-496`, paraphrase). This read did not establish whether `prepare_with_query` writes to disk.
  - Recommendation: (a).
- **OPEN-6. ADR-037 open question 4 (its Open 2): a new page's reopen while the old page's reopen of the same project is in flight.**
  - (a) A transient `skp.project_open_elsewhere` until the old call returns; a retry then succeeds. Costs: 0.
  - (b) The gate also waits for the old page's in-flight opens. Costs: about 10 product lines and one test of about 30 lines. The wait is unbounded while the engine's metadata reads run (KNOWN-LIMITATIONS item 75).
  - Recommendation: (a), with the residual named in the ADR.
- **OPEN-7. ADR-037 open question 5: SKP-V0 §3's "session-scoped", read as page-scoped for the desktop binding.**
  - Not edited.
  - Writing it into `SKP-V0.md` is a protocol file, so it would be a stop (ADV-2026-11-26-08 item 1).
- **OPEN-8. ADR-037 open question 6: what is not established.**
  - Which navigations raise `Started`: the dev reload is settled by E-1; Ctrl+R and F5 in a release build by S0 (b) and the sitting; the context menu's Reload by nothing here (add it to the sitting's press?).
  - The hook's thread: the arm is constant-time either way.
  - Whether a command can name its webview: not needed.
  - The base-files question (its question 2) is OPEN-1.
- **OPEN-9. E-1's placement.**
  - (a) Between SECOND-SAVE and INSIDE-OPEN, on FOLDER_ONE. Costs: as §7. The INSIDE-* steps then run on the reloaded page, after a reopened open (I6).
  - (b) After NOTICE-S18, on FOLDER_THREE, whose open is still live at the end. Costs: about the same lines; the reopen then resolves the machine-recorded locator of a file named with U+007F, which tests something extra.
  - A FOLDER_ONE reopen at the end is not red at the base, because INSIDE-OPEN's close has already freed it.
  - Recommendation: (a).
- **OPEN-10. S0 (b)'s means.**
  - (a) The human presses once at a later part of the sitting. Costs: none for the piece.
  - (b) A CDP press in a measure build. Costs: a measure build, which is not a plain release build; whether WebView2 acts on the press is not established.
  - (c) An OS-level key press from a script. Not established on this shared machine.
  - Also: does a launch's new `session-<stamp>.log`, and its WebView2 data, count as changing the folder that ADV-2026-11-26-11 item 7 keeps unchanged?
  - Would the installed v0.1.0 build, if present, do for the question whether the keys reload a release WebView2? It is not a build of the base.
- **OPEN-11. Words.**
  - The end's session-log line. Its content is counts only; its words are the advisor's.
  - Whether KNOWN-LIMITATIONS gains an item for the residuals (an old-page command handled after `Started` counts as the new page's; OPEN-6 (a)'s transient refusal) and for "a reload loses unsaved work, with no question first". Costs: one file, about 6 lines, class 9. Out by default.
- **OPEN-12. Two things.**
  - Whether R3 applies to §2.7, and its grade.
  - Whether the sitting's row enters MANUAL-WALKTHROUGH.md in this PR. Costs: one file, about 6 lines, class 9.

## §11. Amendments — opens empty, append-only

(This form puts its gates at §10, as the identity-route form does. The amendments section therefore follows here.)

===== FINDINGS OUTSIDE THE FORM =====

1. `frontends/shell/e2e/README.md:69-70` repeats the record that a mid-script `page.reload()` has "no precedent". So do `frontends/shell/e2e/refusal-contract-baseline.mjs:26`, `frontends/shell/e2e/regression.mjs:28` and `regression.mjs:1144`, from `residency-harness.mjs:2028`. That no longer holds: `pan-anchor.mjs:64` and `recentre-crossing.mjs:84` reload. Documentation.
2. `frontends/shell/e2e/pan-anchor.mjs:58-64` attaches through `attachOrLaunch` and then reloads. When it attaches to an app that a prior run left with a dataset open, that open stays held until the app exits. This is evidence hygiene, and this piece would end it. I did not read `recentre-crossing.mjs`'s attach.
3. `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:330-331` says both reads "observe the SAME completed navigation in practice". `frontends/shell/src-tauri/src/lib.rs:163-173` corrects that to a window between them; I read those lines before this draft was composed. ADR-020 is accepted and behind the red line, so this is for the human, not for this piece.
4. `kernel/src/session_history.rs:1235` (`recover`) has no product caller. No command in `lib.rs:550-573` reaches it. The architect found this; KNOWN-LIMITATIONS item 70 covers the user-visible side in part.
5. `frontends/shell/e2e/reopen.mjs:245-262` (R4) is the only place a same-window `skp.project_open_elsewhere` is asserted. This piece adds the same check before the reload in `project.mjs`, which duplicates it on purpose as E-1's control.
6. Not established: whether Tauri's log folder (`lib.rs:326-339`) moves when a suite sets `LOCALAPPDATA` (`project.mjs:65`). By Tauri's documentation, not read in this repo, it is the per-user known folder, which the variable does not move. If it does not move, every e2e run of the dev build writes a new `session-<stamp>.log` into the app's real log folder, which ADV-2026-11-26-11 item 7 keeps unchanged. This is a question for the custodian before S0 or any suite run.
7. The architect read sized the fix at 100 to 120 lines, as a catalog-wide close. ADR-037's page-scoped design costs about 566, its tests included (§7). The advisor may want to weigh that difference when ruling on ADR-037 §2.

Files read this session, all under D:/wt/read-1124f at c28c8cf1:
- `frontends/shell/src-tauri/src/{lib,commands,publish,state,pool_poll}.rs` (parts);
- `kernel/src/skp.rs` and `kernel/src/project/mod.rs` (parts);
- `kernel/tests/project_reopen.rs` (parts);
- `protocol/skp/src/v0/{commands,mod}.rs` (grep);
- `engine/src/watch.rs:50-71`;
- `frontends/shell/e2e/{project,reopen}.mjs` and `frontends/shell/e2e/README.md` (parts);
- `frontends/shell/src/admission/AdmissionPanel.tsx` (grep);
- `docs/adr/ADR-020…md:308-335`;
- `docs/PREREGISTRATION-TEMPLATE.md`;
- `.claude/agents/architect.md`;
- `KNOWN-LIMITATIONS.md` (parts);
- `governance/PLAN.yaml` and `governance/CUSTODIAN-QUEUE.md` (parts);
- the in-progress forms named in §8 (parts);
- `state/directives/PORTABILITY-2026-09-30.md:49-54`;
- the architect read's Finding B.

Plus the scratch copies of ADV-2026-11-26-08, ADV-2026-11-26-11 and the ADR-037 architect report, and the files read before this session's compaction.
