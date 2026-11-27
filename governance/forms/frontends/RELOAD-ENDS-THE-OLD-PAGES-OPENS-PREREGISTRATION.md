# A reload of the main window ends the old page's opens (PLAN node `reload-ends-the-old-pages-opens`, finding B of Part AD): preregistration, full form

**Path proposed:** `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md`.

**Authority:**
- **Rulings**, cited by id and item:
  - ADV-2026-11-26-08 items 1, 2 and 6;
  - ADV-2026-11-26-11;
  - ADV-2026-11-26-13 items 2 to 4;
  - ADV-2026-11-26-14 item 1;
  - ADV-2026-11-26-15 items 4 and 7;
  - ADV-2026-11-26-16 items 1 to 5 and 7;
  - ADV-2026-11-26-17 items 1 to 5;
  - ADV-2026-11-26-18 items 1 to 6;
  - ADV-2026-11-26-19 items 2 to 4 and 7;
  - ADV-2026-11-26-23 items 1 to 3;
  - ADV-2026-11-26-24 items 1 to 4.
- **The design** is ADR-037 as ADV-2026-11-26-16 item 2 accepts it, with item 3's three additions and item 4's Status line. The Proposed text is `state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.draft.md`. Where this form says "ADR-037 §n", it means the accepted text's section.
- **The human's draft.** ADV-2026-11-26-21 is a draft for the human and binds nothing until they approve it. Its item 5 bears on ADR-020 (§2 item 11, OPEN-5).
- **Grounds** (ADV-2026-11-18-02 item 2): architecture, concurrency and security.
- **Reuse index.** The custodian ran `tools/reuse.mjs` in the read-only reuse clone at 89bbac37, with the query `page reload lifecycle`. It exited 1 and printed, byte for byte:
  `No prior art recorded for "page reload lifecycle". Research it before planning an implementation.`
  This form records that miss. Its research is §0's reading of the pinned sources.
- **The input draft.** Lead-data's draft of this form is an input, drafted outside its definition by the advisor's ruling (ADV-2026-11-26-17 item 1). I checked each of its claims myself; §0 item 6 lists where I depart from it.

**Drafted by:** the architect, the form's author (ADV-2026-11-26-17 item 1). Every pin is historical: for the code, the piece's base on main is authoritative.

**Committed before any code.** Append-only once committed. **Read the last amendment first.**

**Gating:**
- Full form.
- The form gates are a fresh architect and the reviewer (ADV-2026-11-26-17 item 2). The build gates are both, too.
- The architect's form gate and its build gate each carry ADV-2026-11-26-18 item 3's named check (§10).

**Merge:**
- **Not into `release/v0.2`.** It merges into main in its turn (ADV-2026-11-26-08 item 6, as changed by ADV-2026-11-26-15 item 7). Whether v0.2 carries it stays the human's.
- **The checkout must stand first.** No merge into main until the sitting's checkout stands, as ADV-2026-11-26-15 item 4 defines that: its one build made, the script's start paragraph naming its folder, and one tester's start there filed.
- **The human's app must be closed.** No merge into main while the human's app runs from the main checkout (ADV-2026-11-26-19 item 4).
- After PR 356, by a merge commit, never a squash or a rebase.
- **Draft until both runs are filed.** The PR leaves draft only as ADV-2026-11-26-24 item 2 bounds it: after the base run at the red commit (§6) and the head series (§10) are filed.

## §0. Disclosure

Reasoned from code and from the pinned crate sources. Nothing was run.

### 1. The fault

- The page-load hook acts only on `Finished`. Verbatim, `frontends/shell/src-tauri/src/lib.rs:216` (a sub-line span): `if payload.event() != tauri::webview::PageLoadEvent::Finished {`
- At a reload nothing closes the old page's opens. A project the old page saved or reopened keeps its entry, and with it its lock. Verbatim, `kernel/src/project/mod.rs:265` (a sub-line span): `saved.retain(|s| open(&s.dataset));`
- The new page's `open_project` runs `release_ended` and then takes the lock (`kernel/src/project/mod.rs:780-787`). It is refused with `skp.project_open_elsewhere` (`:937`).
- `frontends/shell/e2e/reopen.mjs` R4 asserts that answer for a reopen in the same window. Verbatim, `frontends/shell/e2e/reopen.mjs:248`: `expectAnswer(answer, "skp.project_open_elsewhere", "the same-window reopen");`
  - R4 does not reload, so it stays true.

### 2. S0 (b): read from the source, not observed (ADV-2026-11-26-17 item 3)

**Accelerator keys and the context menu.**
- wry's defaults keep WebView2's browser accelerator keys and its default context menus (`wry-0.55.1/src/lib.rs:1687-1688`). They are applied at `wry-0.55.1/src/webview2/mod.rs:571` and `:582-586`.
- Nothing in `tauri-runtime-wry-2.11.4/src` or `tauri-2.11.5/src` calls `with_browser_accelerator_keys` or `with_default_context_menus`.
- `tauri-utils-2.9.3/src/config.rs` has no key for either.
- Devtools are compiled in only under `debug_assertions` or the `devtools` feature (`tauri-runtime-wry-2.11.4/src/lib.rs:5209-5211`). The shell enables no tauri feature.

**Which navigations raise `Started`.**
- wry raises `PageLoadEvent::Started` from `add_ContentLoading` on the top-level `ICoreWebView2` (`wry-0.55.1/src/webview2/mod.rs:643-658`), and `Finished` from `add_NavigationCompleted` (`:659-670`).
  - No frame-level handler is registered, so `Started` is the main document's.
  - The handler is held in an `Rc` (`:644`), so it runs on the thread that built the webview.
- tauri-runtime-wry maps the event (`tauri-runtime-wry-2.11.4/src/lib.rs:5029-5040`) and skips the handler when the URL does not parse. wry also skips it when the webview's URL cannot be read (`wry-0.55.1/src/webview2/mod.rs:653`, its `?`), and tauri skips it when the manager holds no webview for the label (`tauri-2.11.5/src/manager/webview.rs:296`). For such a load the end does not run (ADR-037 §1).
- tauri calls the Builder's `on_page_load` for every webview (`tauri-2.11.5/src/manager/webview.rs:290-311`).
- A second `Builder::on_page_load` replaces the first (`tauri-2.11.5/src/app.rs:1781-1789`).
- The page makes no scripted or same-document navigation. A search of `frontends/shell/src` for `pushState|replaceState|location.(hash|href|assign|replace|reload)|window.open(` finds nothing.

**What the read concludes for a release build.**
- Nothing in the pinned sources turns off WebView2's reload keys or its context menu in a release build.
- A reload that loads a new top-level document raises `Started` through `ContentLoading`.
- So the read gives no ground to tell the advisor before the build that no reload reaches a release build.
- Not in these sources: which keys and menu items reload, which is the WebView2 runtime's behaviour. The observation stays owed: one press each of Ctrl+R and F5 by the human, in the installed candidate build, as a row the advisor adds to the candidate's steps. It does not hold this piece (ADV-2026-11-26-17 item 3).

### 3. The kernel interface the binding consumes (read, unchanged)

- **`SkpHost::cancel`** (`kernel/src/skp.rs:1600-1612`):
  - It checks the version first.
  - It parses the handle as a `StreamHandle`. If that fails, it treats the handle as a cancel key.
  - It answers `Requested`, `Unknown` or `AlreadyTerminal` (`:936-972`, `:73-77`; `protocol/skp/SKP-V0.md:126-143`).
- **`SkpHost::open_dataset`** is `check_version`, then `begin_open`, then `open_under` (`skp.rs:1108-1112`). `begin_open` is `pub(crate)` (`:1118-1135`).
- **`SkpHost::close_dataset`** is at `skp.rs:1614-1675`.
- **`Projects::release_ended`** (`kernel/src/project/mod.rs:259-266`) and **`Projects::open_project_command`** (`:894-915`).
  - Only an `Opened` reply leaves a lock held: the entry is pushed at `:870-877`.
  - `Question` returns before any write (`:743`).
  - `NotFound` and the refusals drop their lock on return.
- **The cancelled refusal.** A cancelled reopen maps to `error_of(&EngineError::Cancelled)` (`mod.rs:926`): code `engine.cancelled`, with no fields (`skp.rs:2210`; asserted at `:2712-2714`).
  - `error_of` is `pub fn` (`skp.rs:2138`), and `EngineError` is pub (`engine/src/lib.rs:145`).
  - `StreamHandle` is re-exported by `spatial_skp::v0` (`protocol/skp/src/v0/mod.rs:16`), and the kernel parses it from another crate (`skp.rs:1605`).
  - So by this read, ADV-2026-11-26-16 item 1 (b) and (c) need no file under `kernel/` or `protocol/`. If the build finds otherwise, that is the stop in §9 item 2.
- **`ProjectLock::try_lock`** (`kernel/src/project/store.rs:241-252`). Verbatim, `store.rs:264` (a sub-line span): "Another handle holds it, in this process or in another."
- **`RunningPublishes::cancel_all`** (`frontends/shell/src-tauri/src/publish.rs:1183-1187`), the call the exit path makes (`:1215`).
- **`SessionLog::append`** (`frontends/shell/src-tauri/src/state.rs:68-81`):
  - It holds its file mutex only for one `write_all` and one `flush` (`:77-80`).
  - It drops the line, without a panic, when that mutex is poisoned.
- **A publish prepare at a reload** (ADR-037 §4, the prepare row, which leaves this to the form). By this read, a prepare writes nothing to disk: its pin only reads the source (`publish.rs:1363-1366`, `:1374-1388`), and its grant and its pending attempt live in memory and die with the process (`lib.rs:479-485`). The build gate's reviewer confirms this against `prepare_with_query` at the base. If a write is found, the row's words go to the advisor before ADR-037 lands (ADV-2026-11-26-16 item 5).

### 4. Finding 6, the log folder (ADV-2026-11-26-17 item 5)

**Where the folder is resolved, by this read:**
- The shell takes it from `app.path().app_log_dir()`, with a fallback to the OS temp folder (`frontends/shell/src-tauri/src/lib.rs:326-329`).
- tauri resolves that as `dirs::data_local_dir()` joined with the identifier `dev.spatialide.shell` and `logs` (`tauri-2.11.5/src/path/desktop.rs:278-290`; `tauri.conf.json:5`).
- `dirs-6.0.0/src/win.rs:11` calls `dirs_sys::known_folder_local_app_data()`. That is `SHGetKnownFolderPath(FOLDERID_LocalAppData, 0, …)` (`dirs-sys-0.5.0/src/lib.rs:180-181`, `:150-158`).
- No environment variable is read anywhere on that path, except by its fallback, `std::env::temp_dir()` (`lib.rs:329`), taken only when `app_log_dir()` fails. Whether the known-folder API itself reads a process's environment is Windows behaviour, outside these sources.
- The WebView2 data folder comes from the same `LocalData` base (`tauri-2.11.5/src/manager/webview.rs:534-545`).

**What this read concludes.**
- The session log and the WebView2 data do not follow a suite's `LOCALAPPDATA` (`frontends/shell/e2e/project.mjs:65`).
- The kernel's per-user stores do follow it (`engine/src/app_dirs.rs:82`, `:108-109`; their reach, `kernel/src/permission/audit/log.rs:370-376`).
- **So, by these sources, the folder does not follow** (the known-folder API's own reading is outside them, as the bullet above says), **and ADV-2026-11-26-17 item 5's consequence holds:**
  - the runs' logs and the human's sitting logs share one folder, and are told apart by their stamps alone (`state.rs:47`);
  - a small piece is proposed after this one, not now.

### 5. Base and overlap facts

- **From the custodian:**
  - PR 356 changes `commands.rs`, and its head is in this base.
  - PRs 359, 363, 365 and 366 change `frontends/shell/e2e/README.md`.
  - No open PR touches `page.rs`, `lib.rs`, `project.mjs` or `docs/adr/ADR-037*`.
- **Checked by the custodian by git, 2026-11-26:** PR A's branch (`cut/shell-migration-milestone-5-pr-a`) also changes `frontends/shell/e2e/README.md`. No open PR and no other in-progress branch touches `page.rs`, `lib.rs`, `project.mjs`, `e2e-test-surface.ts`, `docs/README.md`, `docs/adr/ADR-037*` or `docs/adr/ADR-020*`.

### 6. Where this form departs from lead-data's draft

- **Its OPEN items, by the draft's numbering (not this form's OPEN section), now ruled:**
  - OPEN-1, the base: closed by ADV-2026-11-26-14 item 1.
  - OPEN-2: ruled by ADV-2026-11-26-18 items 1 to 6.
  - OPEN-3: ADR-037 is accepted (ADV-2026-11-26-16 item 2).
  - OPEN-5: ADV-2026-11-26-13 item 2, so U-5 is in.
  - OPEN-6: ADV-2026-11-26-13 item 3, under ADV-2026-11-26-16 item 1. The gate also waits for the old page's in-flight opens; the draft's gate waited for ends alone.
  - OPEN-10 and finding 6: ADV-2026-11-26-17 items 3 to 5.
- **What the draft missed:**
  - **A wait on itself (U-8).** If the gate is one global condition, an open waiting at the gate when its own page ends would wait for itself. So would every later page's open.
  - **The end thread's guard (U-9), and the hook-thread failure case (U-10).**
  - **The `cancel` command's change.**
  - **The (c) test from the kernel's real answer (U-6), and the (d) moment.**
  - **`docs/README.md`'s generated ADR index row.** `verify:adr-index` fails without it.
  - **The caller lines** of `e2eOpenProjectFolder` and `e2eSaveProjectToFolder`, which E-1 calls (`frontends/shell/src/e2e-test-surface.ts:188`, `:193`).

### 7. Intake

| Item | Disposition |
|---|---|
| A reload ends the old page's opens, and a reopen after it is admitted | In |
| The new page's opens wait for the earlier ends and their opens | In (ADV-2026-11-26-13 item 3) |
| A cancel of an open that waits at the gate | In (ADV-2026-11-26-16 item 1) |
| A dated note on ADR-020 | Conditional (§2 item 11; OPEN-5) |
| Asking first, or switching off the reload keys | Out (ADR-037, What this ADR does not decide; ADV-2026-11-26-13 item 4) |
| A mark in the step record for a reload | Out (ADR-037's open item; ADV-2026-11-26-16 item 7) |
| The shared log folder | Out: a small piece after this one (ADV-2026-11-26-17 item 5) |

## §1. May and may not claim

**May claim**, for the shipped build on Windows:
- After a main-window `Started`, the opens the previous page made are closed off the hook's thread, their project locks are freed, and its registered publishes are cancelled.
- An open that the ended page began, and that returns `Opened` after the end, is closed and its lock freed.
- The next page's `open_dataset` and `open_project` start only after:
  - every earlier end has run;
  - every earlier page's in-flight open has returned;
  - every late close has finished.
- A cancel of an open that still waits at the gate when the binding looks it up answers `requested`, and that open returns the kernel's cancelled refusal without reaching the kernel (§2 item 6 (d) names the two moments this does not cover).
- E-1: open, save, reload, reopen is admitted, in the e2e suite on Windows.

**May not claim:**
- which keys or menu items reload: owed to the human's press;
- any `docs/08` figure for the end or the gate's wait;
- a second window;
- a renderer process that ends with no navigation;
- an end or a late close whose thread the OS does not start, or that panics: its remaining opens then stay held, as today, and the gate still opens (§2 items 3 and 4; U-9);
- that a later page can open anything while an earlier page's open never returns: every later open then waits at the gate, and only its own cancel ends the wait;
- an old page's command that the host begins after `Started` (ADR-037's named residual, which needs timing inside one request round trip);
- macOS or Linux.

**Class:** full form, both gates. The piece crosses the binding-to-kernel seam, adds new concurrency, touches the closure ADR-020 governs, and runs over 260 lines.

**Declared unchanged:**
- `kernel/`, `engine/`, `protocol/`, `SKP-V0.md`'s text and shape;
- `tauri.conf.json`, `capabilities/`, `Cargo.toml`, `Cargo.lock`;
- the handler list (`lib.rs:550-573`);
- the `Finished` arm's lines (`lib.rs:216-277`) and the event constant and enum (`:142-183`; the enum's variants, which `check:origin-event` pins, end at `:183`);
- the tests that pin the self-check (§10, bullet 1 of the named check);
- `frontends/shell/src/**` code, the `e2e-test-surface.ts` doc lines apart;
- `src-tauri/tests/sole_caller_scan.rs`;
- `reopen.mjs` R4;
- `pan-anchor.mjs` and `recentre-crossing.mjs`;
- ADR-020's text, except under §2 item 11's condition.

## §2. The change

1. **`frontends/shell/src-tauri/src/page.rs` (new).** A managed `Arc<Pages>`. The state behind one `Mutex`:
   - the current page number;
   - the current page's names;
   - its in-flight opens, as tickets with their keys and page;
   - its gate-waiting opens, as tickets with their keys, page and a cancelled flag;
   - `ends_running` and `late_closes_running`;
   - a `tokio::sync::watch` counter that is bumped on every change, under the mutex, the pattern of `RunningPublishes` (`publish.rs:1096-1102`, `:1191-1199`). `admit` takes its receiver by `subscribe` before its first read of the state, reads the state under the mutex, and after each read that admits nothing awaits `changed()` on that receiver and reads again, so no bump between a read and the wait is lost. It takes the mutex only between awaits, never inside a `Receiver::borrow` or a `wait_for` closure.

   Rules for that mutex:
   - It is never held across a kernel call, a wait or a close.
   - Each lock recovers from poison with `unwrap_or_else(|e| e.into_inner())`.
   - The gate lives in the binding, before the kernel's `begin_open`. No wait is added inside the kernel (ADV-2026-11-26-16 item 1, its last line).

2. **`Pages::admit(key) -> Result<Ticket, SkpError>`** (async). It enters a gate-waiting entry under the current page, then waits until one of these:
   - **(i)** Its page is the current page, `ends_running == 0`, no in-flight entry of a page earlier than its own remains, and `late_closes_running == 0`, all read in one critical section. In that same section the entry moves to in-flight, and `Ok` is returned.
   - **(ii)** Its flag is set (by `Pages::cancel`), or its page is no longer the current page. The entry is removed and `Err(spatial_kernel::skp::error_of(&spatial_engine::EngineError::Cancelled))` is returned. That is the kernel's own value for a cancelled open; the binding makes no code and no text of its own.

   With no reload in the process, (i) holds once the first load's end, which closes nothing, has run.

   The `Ticket` is a drop guard, as `OpenGuard` is (`skp.rs:977-986`, made at `:1126-1133`): dropped without `settle`, it removes its entry and bumps the counter, so no early return or unwind can leave an in-flight entry holding the gate for every later page (U-11). In `open_project`, `admit` runs after the `Projects` check (`commands.rs:209-213`). The gate-waiting entry is held by a guard of its own inside `admit`, so an `admit` future dropped while it waits leaves no entry that `Pages::cancel` could answer `requested` for.

3. **`Pages::settle(ticket, opened: Option<&str>, …)`**. In one critical section with `page_started`'s taking of the set (ADR-037 §4):
   - **Current page:** the in-flight entry is removed, and the name, if the open returned one, enters the current set.
   - **Ended page, with no name:** the in-flight entry is removed, and nothing is closed.
   - **Ended page, with a name:** in that same critical section the in-flight entry is removed and `late_closes_running` is raised by one, so the gate never sees the entry gone while the late close is not yet counted. The mutex is then released, and the binding starts a late close: `close_dataset`, then `release_ended`, then `late_closes_running` lowered by `saturating_sub(1)` under the mutex, and a bump.
     - It runs on `std::thread::Builder::spawn`, with a drop guard holding the decrement.
     - If the spawn fails, the error is written by `writeln!` to `std::io::stderr()`, its result discarded, and the guard opens the gate. That open stays held, as today.

   The command starts the dev pool poll only for a current-page name.

4. **`Pages::page_started(self: &Arc<Self>, parts) -> Option<JoinHandle<()>>`**. `parts` holds `Arc<SkpHost>`, `Option<Arc<Projects>>`, `Arc<RunningPublishes>` and two closures, `stop_poll` and `log`, that the `Started` arm builds in `lib.rs` from a clone of the `AppHandle`. `SessionLog` stays managed by value (`state.rs:35-38`, `lib.rs:466`), and the `Finished` arm's `try_state::<SessionLog>()` is not touched. The U tests call this same function with test parts. The returned handle is read only by the U tests (U-9's join among them), and `lib.rs` discards it. It is called from the hook. It does no wait and no kernel call, its work does not grow with the page's entries, and it has no panic path: no `unwrap`, `expect`, indexing, `eprintln!` or unchecked arithmetic.
   - Under the mutex, it:
     - takes the current set by `mem::take`; the ended page's in-flight keys are read by the end's own thread (item 5 (i));
     - sets no per-entry flag: a gate-waiting entry whose page is no longer the current page is cancelled when its `admit` next reads the state. It returns the kernel's cancelled refusal and never reaches the kernel (U-8);
     - increments the page number and `ends_running`;
     - bumps the counter.
   - Then it starts the end on `std::thread::Builder::spawn`, with the error written by `writeln!` to `std::io::stderr()`, its result discarded (`eprintln!` panics when the write fails). The decrement guard moves into the closure, so a failed spawn still opens the gate.

5. **`run_end(pages, page, set, host, projects, publishes, stop_poll, log)`**, where `pages` is the `Arc<Pages>` and `page` the ended page's number. On the end's thread, in this order:
   - (i) under the mutex, the ended page's in-flight keys are read; with the mutex released, `SkpHost::cancel` for each, then `RunningPublishes::cancel_all`. A key still in item 6's (d) window answers `unknown`, and its open completes into item 3's late close;
   - (ii) for each name, `SkpHost::close_dataset`, then `stop_poll(name)`;
   - (iii) `Projects::release_ended` once, when `Projects` is `Some`;
   - (iv) one `SessionLog::append` line at level `info`, at every end, the first load's included (all three counts 0 there). Each count is in decimal digits, and the line carries no handle, path, name or project identity (`SKP-V0.md:192-194`). Its words are the advisor's (ADV-2026-11-26-23 item 2), not the human's: `page-end opens_closed=<n> opens_cancelled=<n> publishes_cancelled=<n>`. `opens_closed` counts the page's names whose `SkpHost::close_dataset` in (ii) returned `Ok`. `opens_cancelled` counts the in-flight keys whose `SkpHost::cancel` in (i) answered `requested`; it counts no gate-waiting open the binding cancelled, and no key the kernel answered `unknown` or `already_terminal`. `publishes_cancelled` is `RunningPublishes::cancel_all`'s return: the number of tokens registered when it ran, each of which it cancels, a token the page had already cancelled and that is still registered included (`publish.rs:1182-1187`). A late close writes no line. An end whose thread did not start writes none, and `SessionLog::append` drops a line only on a poisoned file mutex or a failed write (`state.rs:77-80`);
   - (v) the guard drops: `ends_running` is lowered by `saturating_sub(1)` under the mutex, then a bump (a panic in a drop during an unwind would abort). The precedent is `OpenGuard`, `skp.rs:977-986`.

   `stop_poll`'s and `log`'s product caller is `lib.rs`: the pool stop under its `cfg` (a no-op otherwise), and `SessionLog::append` reached by `try_state`.

6. **`Pages::cancel(&host, request)`** (ADV-2026-11-26-16 item 1).
   - **(b)** It puts the cancel to `SkpHost::cancel` first, so the version check and the lookup by the handle's shape stay the kernel's.
     - Only when the kernel answers `Unknown`, and the handle does not parse as `StreamHandle` (`skp.rs:1605-1608`), does it look for gate-waiting entries with that key. Their flags are set, they are removed, and the answer is `Requested`.
     - Every other answer, the version refusal included, is returned unchanged.
     - A second cancel of a key that waited at the gate gets the kernel's `unknown`: the binding no longer holds that key.
     - Duplicate keys at the gate are entries under distinct tickets, and one cancel matches them all. Past the gate, the kernel's `cancel_key_in_use` applies.
   - **(a)** No text and no shape of SKP-V0 changes. The three states stay the whole set.
   - **(d), the moment.** The window runs from `admit` returning to `begin_open` registering the key inside `spawn_blocking`.
     - In that window neither the binding nor the kernel holds the key, so a cancel answers `unknown`.
     - This does not differ from today: the window from command dispatch to `begin_open` answers the same.
     - The page sends its cancel once and does not read the answer (`frontends/shell/src/admission/AdmissionPanel.tsx:182-184`, `:500-502`).
     - If the open completes, it goes to its page's set or to a late close.
     - A second moment, inside one request round trip: the kernel answers `unknown` while the open waits at the gate, and the open leaves the gate before the binding looks. The binding then finds no gate entry, answers `unknown`, and the open goes on. Only that interleaving reaches it; it is named here and in `page.rs`'s comment on `Pages::cancel`.

7. **`commands.rs`.** Each command stays decode, one call, serialize, with the bookkeeping in `page.rs`:
   - `open_dataset` and `open_project` gain `State<Arc<Pages>>`, and run `admit`, then the existing `spawn_blocking`, then `settle`;
   - `cancel` gains `State<Arc<Pages>>` and calls `Pages::cancel`;
   - `close_dataset` also calls `Pages::forget(name)`, after the host's close;
   - the "no logic" doc (`:16-20`) names the gate and the page bookkeeping, as `:17` already names `release_ended`.

8. **`lib.rs`:**
   - `mod page`, and `.manage(Arc::new(Pages::new()))`;
   - in the existing `on_page_load` closure (`:215-278`), before the `Finished` filter at `:216`, one arm. On `Started`, when `PinnedOrigin.window_label` equals the webview's label, it calls `page_started` and returns. It reads nothing else from `PinnedOrigin`, writes neither it nor `DataPlaneConfig`, and calls no origin function;
   - the doc lines at `:13-16` and `:190-214` updated.
   - No line of the `Finished` arm changes. No text is added that `checkOriginEventName.mjs`'s exactly-one patterns match (`:44`, `:54-55`, `:78-96`).

9. **`project.mjs`:** E-1 (§4).

10. **ADR-037 and the docs:**
    - `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` is byte for byte the final text the architect files under `state/drafts/` once this form's gates have passed (ADV-2026-11-26-16 item 5). That text is:
      - the Proposed draft's ADR;
      - item 3's additions, byte for byte;
      - item 4's Status line;
      - the cites into `commands.rs` and `publish.rs` re-read at the base.

      The advisor compares that file with the draft, and the merge check compares the diff with that file byte for byte.
    - **A clause a gate finds untrue** goes to the advisor with words before the text lands. After it lands, it changes only by an appended amendment (ADV-2026-11-26-16 item 5).
    - `docs/README.md`: the generated index row.
    - `e2e/README.md`, the Project entry. It now drives a reopen after a reload, so its "Reopen is not driven." (verbatim, `frontends/shell/e2e/README.md:846`, a sub-line span) changes to say what is driven.
    - `e2e-test-surface.ts`: the caller lines of `e2eOpenProjectFolder` (`:193`) and `e2eSaveProjectToFolder` (`:188`) each name every suite that calls the hook at the head, found by a search (`second-open.mjs:84` already calls the first).

11. **ADR-020, conditional (OPEN-5).** The form holds either way:
    - **If the human's approval of ADV-2026-11-26-21 is filed on main before this PR's documents commit (OPEN-5 (a), ruled by ADV-2026-11-26-23 item 3):**
      - item 5's note is appended at the end of `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md`, after its last line, in this PR;
      - its text is byte for byte the approved item's fenced block, written by script; the worker types none of it;
      - nothing above it changes;
      - both architect gates' posture checks read the note (§10); if the approved text differs from the draft item this form's architect gate read, that goes to the advisor before the documents commit;
      - `verify:adr-index --check` is re-run, and any change it needs stays inside `docs/README.md`'s row.
    - **Otherwise** ADR-020 is not changed in this piece (ADV-2026-11-26-23 item 3; ADV-2026-11-26-18 item 5), and any diff to it is a block (§9 item 3).

## §3. Fixtures and predicted outcomes

- **The U tests:**
  - an engine fixture written by `spatial_engine::fixture` (`engine/src/fixture.rs:436`, `:998`; `IdentityMode::NativeUnique`, `:693`) into the test process's own temporary folder, PR 356's pattern (`commands.rs:733-741`);
  - a real `SkpHost` and a real `Projects` over a temporary root.
- **U-6** uses a test `SourceWatchArm` (`engine/src/watch.rs:67-68`) that blocks in `arm()` until it is released, then returns `ArmOutcome::ChecksOnly` (`:53-61`).
- **E-1** uses the suite's `FIXTURE` (`project.mjs:73`, read in place) and a fourth folder of its own, `FOLDER_FOUR`, made as the other three are (`project.mjs:62-64`) and dropped with them.
- **Predictions:**
  - U-1 to U-12 green at the head;
  - E-1 red at the red commit (the base with E-1's step alone; §6), with `skp.project_open_elsewhere`, and green at the head;
  - the suite's other steps pass in both.

## §4. Tests, one mutation each

Each mutation is a patch file outside the repository, applied, run and reverted, named with its commit. A `verify-mutation` run is recorded as a run, never as an observation of a mutation.

| Test | Asserts | Mutation, predicted red |
|---|---|---|
| U-1 `a_page_end_closes_its_opens_and_frees_the_lock` | after `admit`, `settle` and a save, then `page_started`, and the end joined by the returned handle: the name is gone from the catalog and `ProjectLock::try_lock` succeeds | M-U1: `run_end` skips the close |
| U-1b (same file) | as U-1, with the close kept | M-U1b: `run_end` skips `release_ended`, so `try_lock` is `Held` |
| U-2 `an_open_settled_after_its_page_ended_is_closed` | ticket under page 1, then `page_started`, then the open, then `settle`: closed, lock free, current set empty | M-U2: `settle` enters the name whatever its page |
| U-3 `the_gate_waits_for_ends_earlier_opens_and_late_closes` | each of the three holds `admit` pending while the other two are clear (polled with `std::task::Waker::noop()`, no sleep): an end held in its `log` part; an earlier page's unsettled ticket, with that page's end joined by the returned handle; a late close held in the drop of a test `ArmedWatch` (`engine/src/watch.rs:39`), which the host's close drops (`skp.rs:1628-1633`); `admit` is ready once all three clear | M-U3: the gate ignores earlier in-flight opens, and U-3 is red at the second case's pending assertion |
| U-4 `a_name_the_page_closed_is_not_closed_again` | after the host's close and then `forget`, in the command's order, the end's closed count is 0 and the end calls `stop_poll` for no name. The count alone cannot fail: a second close of the name is refused by `SkpError::unknown_dataset` (`skp.rs:1634-1636`) and is not counted | M-U4: `forget` does nothing, so the end calls `stop_poll` for the name, and U-4 is red at that assertion |
| U-5 `a_page_end_cancels_registered_publishes` | a registered token is cancelled and counted | M-U5: `cancel_all` dropped |
| U-6 `the_gate_cancel_is_the_kernels_cancelled_refusal` | blocking arm, then `host.cancel(key)` is `Requested`, then release, then `Err` (the identity scan's attach, `engine/src/dataset.rs:2063-2073`, `:1692-1697`). The gate-cancelled open's error serializes equal to it (`serde_json::to_value`) | M-U6: the gate returns a different `SkpError` |
| U-7 `a_cancel_at_the_gate_and_the_kernels_other_answers` | a gate key answers `requested`, its open never reaches the kernel (a flag in the call), and a second cancel answers `unknown`. Unchanged answers: an unknown key gives `unknown`; a key the kernel holds gives `requested`; a bad version, on a key waiting at the gate, gives the kernel's refusal and leaves that open waiting; an `sh_` handle never matches | M-U7: the binding answers before calling the kernel, so the bad-version cancel of the gate key answers `requested`, and U-7 is red at that assertion |
| U-8 `a_second_reload_ends_the_ending_pages_gate_waiters` | page 1 in flight, then page 2's B waits, then `page_started`: B gets the cancelled refusal, and page 3's C is ready once page 1's open settles | M-U8: `admit` does not compare its page with the current page, so B is not cancelled |
| U-9 `a_panic_in_the_end_still_opens_the_gate` | `stop_poll` panics, the end thread's join is `Err`, and `admit` is ready | M-U9: the decrement moves from the guard to the end of `run_end` |
| U-10 `page_started_returns_and_starts_the_end_on_a_poisoned_lock` | with the `Pages` mutex poisoned, `page_started` returns without a panic and the end runs | M-U10: the poison recovery replaced by `.unwrap()` |
| U-11 `a_ticket_dropped_unsettled_does_not_hold_the_gate` | `admit` under page 1, then `page_started`, then the end joined by the returned handle, then the ticket dropped without `settle`: page 2's `admit` is ready | M-U11: the `Ticket`'s `Drop` removed |
| U-11b (same file) | with an earlier page's unsettled ticket holding the gate, an `admit` future polled once with `std::task::Waker::noop()`, pending, then dropped: `Pages::cancel` of its key answers `unknown` | M-U11b: the gate-waiting entry's guard removed, so the cancel answers `requested` |
| U-12 `a_reopen_behind_an_earlier_pages_reopen_waits_then_opens` | page 1's `open_project_command` of a saved folder is held in U-6's blocking arm (its lock taken, `mod.rs:781`), then `page_started`, and the end joined by the returned handle; page 2's `admit` for the same folder is pending; the arm is released; page 1's call returns, with whichever answer the kernel gives once the end has cancelled its key, and settles; page 2's `admit` is then awaited, and its `open_project_command` answers `Opened` (ADR-037 Consequences, Proof, its second case) | M-U12: the gate ignores earlier in-flight opens, so page 2's `admit` is ready while page 1 still holds the lock (where its `open_project_command` would answer `skp.project_open_elsewhere`), and U-12 is red at its pending assertion |
| E-1 (`project.mjs`), a step after NOTICE-S18, the chain's last (ADV-2026-11-26-23 item 1) | `openPath(FIXTURE)` answers admitted and its first pixels are drawn (INSIDE-OPEN's wait); `e2eSaveProjectToFolder(FOLDER_FOUR)` answers `asked`; no close in the page comes between that save and the reload; then `page.reload({ waitUntil: "load" })`, the mount wait with `e2eOpenProjectFolder` among its hooks, then `e2eOpenProjectFolder(FOLDER_FOUR)` answers `admitted`. The precedents: `pan-anchor.mjs:64`; `reopen.mjs:276` | M-E1: the `Started` arm returns before `page_started`, so the answer is `skp.project_open_elsewhere` |

The U tests run against `page.rs`'s functions, because the tauri mock runtime cannot run in this crate's tests (PLAN node `shell-test-executables-carry-the-common-controls-manifest`, parked). The seam's proof from the real shape is U-6, for the kernel's answer, and E-1, through the app.

## §5. Predictions, invalidators, falsification

- **Invalidators:**
  - U-6's fixture reaches no cancellable step after `arm()`. Then (c) has no real-shape test, and that goes to the advisor.
  - `ProjectLock::try_lock` cannot be reached from this crate. U-1b then uses a second `Projects` on the same root, recorded as class 3.
  - The toolchain lacks `Waker::noop` (Rust 1.85).
  - E-1's own open or save, before its reload, does not answer as §4 says, at the base or at the head. Then E-1 does not reach the fault. That is a stop, and the advisor is told, since OPEN-1 (a) then stands (ADV-2026-11-26-23 item 1).
- **Falsification:**
  - E-1 red at the head;
  - E-1 green at the red commit, or red there for another reason, so the fault is not reached: a stop (§9 item 16);
  - any U test green under its own mutation.

## §6. Runs, C: and the log folder

- **The floor and the running app:**
  - No build, test or launch while C: is under its floor (ADV-2026-11-26-11; ADV-2026-11-26-19 item 7).
  - Until the human has closed their running app, nothing of this piece starts the app or a dev server (ADV-2026-11-26-19 item 2). E-1's runs wait for that.
  - S0 (a) (ADV-2026-11-26-08 item 1, changed in time only by ADV-2026-11-26-24): this piece's code and unit tests may start inside holds, in its turn in the order of builds (ADV-2026-11-26-24 items 1 and 4), under the five conditions of ADV-2026-11-26-24 item 2. For this form: the red commit is the branch's first commit after the base, and holds E-1's step and `FOLDER_FOUR` in `project.mjs` and no other line of the piece (ADV-2026-11-26-24 item 2: nothing of the fix); the base run is `project.mjs` at that commit, and the row's own reason is §4's E-1 row answering `skp.project_open_elsewhere` at the reopen; a stop under that item goes to the advisor (§9 item 16); a change of E-1's text after the red commit is an amendment in §11 by its class. The unit tests keep §4's proof (ADV-2026-11-26-24 item 3).
  - The piece is not complete, and leaves no draft, before its e2e runs are made (ADV-2026-11-26-19 item 3; ADV-2026-11-26-24 item 2).
- **What each run costs on C: (unmeasured).** The custodian reads C:'s free space before and after each run.
  - `cargo test`: the compiler's temp files under TMP; with CARGO_TARGET_DIR on D:, nothing in the target folder.
  - The npm steps: the npm cache.
  - The e2e run:
    - SCRATCH and its three folders under the OS temp folder;
    - one new session log and the WebView2 data, in the user's LocalAppData known folder (§0 item 4);
    - npm and the compiler's temp files.
  - Pointing TMP and TEMP at D: moves SCRATCH, but not the log or the WebView2 data.
- **The app's log folder (ADV-2026-11-26-17 item 4):**
  - A launch's new session log and WebView2 data are the app's ordinary writing, and do not count against ADV-2026-11-26-11 item 7, ADV-2026-11-23-12 item 3 (c) or ADV-2026-11-23-13 item 6.
  - No run changes or deletes a file that stands in that folder.
  - The sitting's logs are copied to the local evidence folder (ADV-2026-11-26-09) before the first run after C: is over the floor (ADV-2026-11-26-17 item 4). If that copy has not been made, the custodian files it before this piece's first run.
  - The room a launch takes on C: counts under the floor.
  - The tester tells its run's log apart by its stamp in the name (`state.rs:47`), lists the folder before and after, and copies the run's new file to the run's evidence. It moves and deletes nothing.
- **E-1's suite** launches its own app and refuses one already listening (`project.mjs:411-425`). Dev port 5180.

## §7. Declared values and ceilings

- No new constant.
- **Size:** at most 1250 changed lines (raised before commit for U-11 and U-12; E-1 as ruled fits the 1150 the form first set), insertions plus deletions, over at most 8 files, or 9 under §2 item 11's condition (the Scope below, exactly).
- **Scope, exactly:**
  - `frontends/shell/src-tauri/src/page.rs` (new);
  - `frontends/shell/src-tauri/src/lib.rs`;
  - `frontends/shell/src-tauri/src/commands.rs`;
  - `frontends/shell/e2e/project.mjs`;
  - `frontends/shell/e2e/README.md` (the Project entry only);
  - `frontends/shell/src/e2e-test-surface.ts` (the two doc lines);
  - `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md`;
  - `docs/README.md` (the generated row);
  - under §2 item 11's condition only: `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md` (the appended note);
  - outside the count: the final ADR-037 text under `state/drafts/` (ADV-2026-11-26-16 item 5).
- **Estimate:**

  | Part | Lines (about) |
  |---|---|
  | `page.rs` code | 240 |
  | `page.rs` tests | 560 |
  | `lib.rs` | 35 |
  | `commands.rs` | 45 |
  | `project.mjs` | 90 |
  | `e2e/README.md` | 12 |
  | `e2e-test-surface.ts` | 4 |
  | ADR-037 | 200 |
  | `docs/README.md` | 1 |
  | the ADR-020 note, if it lands | 7 |

  The ceiling holds both ways.
- **Counting:** `git diff --numstat <merge-base>...<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
- An overrun is class 8, and this line is never edited to match. A scope addition is class 9, recorded before its code. The ADR-020 note under its condition is preregistered here and is not a scope addition.

## §8. Overlap and merge order

| Path | Shared with |
|---|---|
| `commands.rs` | PR 356 (in the base; it merges first) |
| `e2e/README.md` | PRs 359, 363, 365, 366 and PR A's branch (other entries) |
| the rest of §7 | none, by the custodian's check (§0 item 5) |

No `protocol/` path is touched.

## §9. Stops and block-on-sight

1. **The posture stop (ADV-2026-11-26-18 item 4).** If either of the architect's gates finds a change of security posture, or cannot say that there is none, the piece stops. It goes to the human, and the advisor rules nothing on it.
2. **The protocol stop (ADV-2026-11-26-16 item 1 (e)).** If (b) or (c) cannot be met without a file under `kernel/` or `protocol/`, that goes to the advisor before code.
3. A diff outside §7, this form, PLAN and the records, or to ADR-020 outside §2 item 11's condition. Any change to:
   - `kernel/`, `engine/`, `protocol/`, `SKP-V0.md`;
   - `tauri.conf.json`, `capabilities/`, `Cargo.toml`, `Cargo.lock`;
   - the handler list.

   A new command, listener, port, scheme or capability.
4. Any line of the `Finished` arm changed, or a test that pins the self-check changed or red.
5. In the `Started` arm:
   - a read of `PinnedOrigin` other than its `window_label`, or of any managed state other than `PinnedOrigin` and the parts `page_started` takes (`Arc<Pages>`, `Arc<SkpHost>`, `Option<Arc<Projects>>`, `Arc<RunningPublishes>`). The `stop_poll` and `log` closures' reads of `PoolPollTasks` and `SessionLog`, made through the `AppHandle` clone when the end's thread calls them, are not reads of the arm;
   - a write to `PinnedOrigin` or `DataPlaneConfig`;
   - an origin selected or computed;
   - a second `on_page_load`, or the arm placed after the `Finished` filter;
   - an `unwrap`, `expect`, indexing, `eprintln!` or unchecked arithmetic on the hook's path.
6. The `Pages` mutex held across a kernel call, a wait or a close.
7. `Unknown` becoming `Requested` for anything but a gate-waiting key; any other kernel answer altered; a refusal code or text of the binding's own; a wait inside the kernel.
8. An end or a late close run on the hook's thread or the async runtime's.
9. A sleep in a U test; a retry or a skip in E-1.
10. A declared-unchanged assertion edited, `reopen.mjs` R4 included.
11. A `verify-mutation` run called an observation; a mutation named without its commit.
12. A §7 overrun not recorded as class 8, or §7 edited; a scope addition not recorded as class 9 before its code.
13. A hash at a branch commit; a bare self-line; a line cite into `governance/DECISIONS-PENDING.md`.
14. ADR-037 differing from its state/drafts final text; the ADR-020 note differing from the approved item, or typed by hand.
15. An app or dev-server start, or a merge, against §6 or the Merge line; a squash or a rebase merge.
16. Against ADV-2026-11-26-24 item 2: product code in the red commit; code taken further after the base run ends green or red for another reason, before the advisor rules; E-1's text changed after the red commit without an amendment by its class, or the base run not re-made on the changed text; the PR out of draft before the base run and the head series are filed.

## §10. Gates

**Form gates:** a fresh architect, then the reviewer. **Build gates:** both.

**The named check of ADV-2026-11-26-18 item 3.**
- The architect's form gate reads the plan, and its build gate reads the diff, against:
  - ADR-020 with its Amendment 1;
  - ADR-027;
  - `docs/09`;
  - under §2 item 11's condition, the appended ADR-020 note (ADV-2026-11-26-23 item 3).
- Each of those two reports says in so many words whether the piece changes the security posture, and on which lines that rests. An answer short of that is §9 item 1.

The check covers each of ADV-2026-11-26-18 item 2's six things, with its proof:
1. **The `Finished` arm's lines are unchanged, and the tests that pin the self-check are unchanged and green.**
   - Proof: a reading of the diff over `lib.rs:216-277` and `:142-183`.
   - The tests:
     - `check:origin-event` (`frontends/shell/e2e/checkOriginEventName.mjs`, in `npm run verify`), which pins the event name and the payload's discriminants in `lib.rs`;
     - the `origin.rs` tests module (`frontends/shell/src-tauri/src/origin.rs:245-`), which pins the normaliser the self-check uses;
     - `frontends/shell/src/OriginMismatchState.test.tsx`.
   - No test drives the `Finished` arm itself. Its lines are proved unchanged by the reading.
2. **The arm takes the main window's label from the same managed state, and nothing else from it.** Proof: a reading of the arm.
3. **It writes neither the pinned origin nor `DataPlaneConfig`, and selects no origin.** Proof: a reading. The arm calls nothing in `origin.rs`, and no `expected_origin*`.
4. **No Tauri command (ADR-027 decision 4), and no listener, port, scheme or capability.**
   - Proof: the handler list unchanged in the diff, and `surfaceCompleteness.test.ts` green.
   - Proof: a reading that the diff adds no `listen`, bind, `register_uri_scheme_protocol` or capability.
5. **`tauri.conf.json` and `capabilities/` unchanged.** Proof: `git diff --stat` over both.
6. **The arm's work runs off the hook's thread, and a failure or a panic in it cannot stop the `Finished` arm.**
   - The end and the late closes run on threads of their own: a reading of §2 items 3 to 5. A panic there unwinds that thread only, and the gate still opens (U-9).
   - The hook-thread part has no panic path: a reading per §9 item 5. A poisoned `Pages` mutex neither panics the hook nor stops the end (U-10).
   - The `Finished` arm reads no `Pages` state, so nothing the end does is on its path: a reading.
   - The one state both arms write is the session log. `SessionLog::append` holds its file mutex only for a write and a flush, and drops a line, without a panic, when that mutex is poisoned (`state.rs:77-80`). So the end cannot make the `Finished` arm panic: a reading.
   - Whether a panic in the COM callback would abort the process is not established. Nothing in `webview2-com-0.38.2/src` calls `catch_unwind`. The no-panic-path reading is what this bullet rests on.

**Architect also reads:**
- §2 against ADR-037 as accepted;
- docs/01's never-block rule (the hook, the end and the gate);
- ADR-006 (the end is neither a workspace mutation nor a side effect; a cancelled publish keeps its own audited path);
- docs/02 (bookkeeping only);
- docs/10 (no wire change);
- ADV-2026-11-26-16 item 1 (a) to (e) and its last line;
- the caller rule: `Pages`' callers are the commands and the hook, `stop_poll`'s and `log`'s is `lib.rs`, and the `Ticket`'s `Drop` is reached by the commands;
- §9, item by item.

**Reviewer reads:**
- the full diff;
- U-1 to U-12 and E-1, each mutation observed;
- the §7 count;
- §2 item 6 against `skp.rs:1600-1612`;
- under §2 item 11's condition, the ADR-020 note byte for byte against the approved item.

**Seams**, each against its actual interface:
- `SkpHost::cancel(&self, CancelRequest) -> Result<CancelResponse, SkpError>` (`skp.rs:1600`)
- `SkpHost::open_dataset` (`skp.rs:1108`)
- `SkpHost::close_dataset` (`skp.rs:1614`)
- `Projects::release_ended(&self)` (`mod.rs:259`)
- `Projects::open_project_command` (`mod.rs:894`)
- `RunningPublishes::cancel_all(&self) -> usize` (`publish.rs:1183`)
- `error_of` (`skp.rs:2138`)
- `SourceWatchArm::arm` (`watch.rs:67-68`)
- `SessionLog::append` (`state.rs:68`)
- `Builder::on_page_load` (`tauri-2.11.5/src/app.rs:1781-1789`)

**Suites, green before either build gate:**
- `cargo test --locked` in `frontends/shell/src-tauri`;
- fmt and clippy;
- the shell's `npm run verify` (it includes `verify:adr-index` and `check:origin-event`), with `npm ci` in `renderer/bundle-viewer` too;
- the shell's tests (`OriginMismatchState.test.tsx`, `surfaceCompleteness.test.ts` among them);
- the verify scripts and `verify:plan`;
- CI's `node --test`;
- `project.mjs` at the red commit (E-1 red; §6) and at the head, by a tester's series inside the machine's holds and under §6;
- in the same series at the head: `reopen.mjs` (R4 among its steps), `second-open.mjs`, `pan-anchor.mjs` and `recentre-crossing.mjs` (their reloads now end opens), and `admission-remediation.mjs` and `table.mjs` (they name `cancel`);
- the branch's CI, read before gating.

**Operator.** The press of Ctrl+R and of F5 in the installed candidate build is the human's, as a row the advisor adds to the candidate's steps. It does not hold this piece (ADV-2026-11-26-17 item 3). This piece adds no walkthrough row.

### §10a. Ticks against the filed rulings

- **ADV-2026-11-26-16 item 1:**
  - (a) §2 item 6, §9 item 3;
  - (b) §2 item 6, U-7;
  - (c) §2 item 2 (ii), U-6;
  - (d) §2 item 6;
  - (e) §0 item 3, §9 item 2;
  - the last line (no wait inside the kernel): §2 item 1, §9 item 7.
- **ADV-2026-11-26-16:**
  - item 2: Authority;
  - items 3 and 4: §2 item 10;
  - item 5, all four bullets: §2 item 10, §7, §9 item 14.
- **ADV-2026-11-26-17:**
  - item 1: the header;
  - item 2: Gating, §10;
  - item 3: §0 item 2, §10 Operator;
  - item 4: §6;
  - item 5: §0 item 4, Intake.
- **ADV-2026-11-26-18:**
  - item 1: §1 (the window stays in `tauri.conf.json`);
  - item 2: §10's named check, bullets 1 to 6;
  - item 3: §10;
  - item 4: §9 item 1;
  - item 5: §2 item 11, OPEN-5;
  - item 6: §9 item 1.
- **ADV-2026-11-26-19:**
  - items 2 to 4: §6, Merge;
  - item 7: §6.
- **ADV-2026-11-26-08 item 6 and ADV-2026-11-26-15 items 4 and 7:** Merge.
- **ADV-2026-11-26-23:** item 1: §3, §4 (E-1), §5; item 2: §2 item 5 (iv); item 3: §2 item 11, §10.
- **ADV-2026-11-26-08 item 1, S0 (a), as ADV-2026-11-26-24 changes it:** §6, Merge, §9 item 16, OPEN-6.
- **ADV-2026-11-26-24:** items 1 and 4: §6; item 2: §6, Merge, §3, §5, §9 item 16, §10; item 3: §4, §6.

## OPEN questions

- **OPEN-1, where E-1 goes.**
  - Ruled by ADV-2026-11-26-23 item 1: at the end of the chain, with an open and a save of its own and no close in the page between its save and its reload (§4).
  - Not taken: the place between SECOND-SAVE and INSIDE-OPEN, and the end of the chain on `FOLDER_ONE`.
- **OPEN-2:** closed by ADV-2026-11-26-16 item 1 (b). A second cancel gets the kernel's `unknown` (§2 item 6).
- **OPEN-3:** closed by ADV-2026-11-26-17 item 3 (§10 Operator).
- **OPEN-4:** ruled by ADV-2026-11-26-23 item 2 (§2 item 5 (iv)). The words are the advisor's, not the human's.
- **OPEN-5:** ruled by ADV-2026-11-26-23 item 3: (a), under §2 item 11's condition; otherwise ADR-020 is not changed in this piece. B does not wait for the approval.
- **OPEN-6:** ruled by ADV-2026-11-26-24 item 1, option (b): the code and the unit tests may start before E-1's base run, under its item 2's five conditions (§6, Merge, §9 item 16).

## §11. Amendments (opens empty, append-only; classes 1 to 9)

## Amendment 1 — 2026-11-26 — at the first commit: the authority on main, the node's gate, the form gates, ADR-037's final text, the span hashes

*Written by the custodian at the form's first commit, after both form gates and before any code. References and hashes only. Nothing above is edited: the "Path proposed" line and the Authority list are the form's as gated.*

1. **Authority on main.** The rulings the Authority list names are filed under `state/directives/`:
   - ADV-2026-11-26-08 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-08-findings-a-b-c-placed-b-first-with-its-adr-drafted-now-a-after-it-on-milestone-5-pr-a-c-not-a-piece.md`;
   - ADV-2026-11-26-11 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-11-c-under-its-floor-nothing-builds-tests-or-launches-reads-fill-the-places-room-made-in-order.md`;
   - ADV-2026-11-26-13 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-13-adr-037-open-questions-no-skp-v0-edit-publish-cancelled-the-gate-waits-asking-first-a-piece-of-its-own.md`;
   - ADV-2026-11-26-14 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-14-finding-bs-base-is-mains-tip-with-pr-356-merged-in-the-order-of-the-places.md`;
   - ADV-2026-11-26-15 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-15-the-order-of-the-reads-what-assumes-main-first-no-held-piece-merges-until-the-sittings-checkout-stands-the-lab-facts-to-the-lasting-identity-consult.md`;
   - ADV-2026-11-26-16 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-16-adr-037-the-cancel-at-the-gate-is-not-a-new-reading-of-skp-v0-under-five-conditions-the-decision-accepted-with-three-additions.md`;
   - ADV-2026-11-26-17 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-17-bs-form-is-the-architects-lead-datas-drafts-are-inputs-s0-b-met-by-a-read-of-the-pinned-sources-a-launchs-writes-do-not-count-against-11.md`;
   - ADV-2026-11-26-18 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-18-the-started-arm-goes-into-adr-020s-closure-under-conditions-the-piece-shows-adr-020-unchanged-not-held-for-the-human.md`;
   - ADV-2026-11-26-19 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-19-c-over-the-floor-noted-the-humans-running-app-stays-untouched-nothing-starts-the-app-or-a-dev-server-until-they-close-it.md`;
   - ADV-2026-11-26-23 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-23-b-form-open-1-e-1-at-the-end-with-its-own-open-and-save-open-4-the-log-lines-words-open-5-a.md`;
   - ADV-2026-11-26-24 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-24-b-form-open-6-b-code-and-unit-tests-start-inside-holds-the-red-commit-first-five-conditions.md`.
   - Two rulings filed after the form's last round also bind it, by their items. ADV-2026-11-26-20 item 7 places text-id ahead of this piece in the order of builds (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-20-text-id-five-corrections-of-wording-the-form-records-them-by-an-amendment-the-build-ahead-of-b.md`). ADV-2026-11-26-26 rules ADR-037's final text (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-26-adr-037-final-text-u1-to-u5-taken-the-docs-02-sentence-and-the-status-line-in-the-advisors-words.md`); see item 4.
   - ADV-2026-11-26-21 is filed as a draft for the human (`state/consults/2026-11-26-advisor-draft-adv-2026-11-26-21-for-the-humans-approval-release-v0-2-pull-requests-the-final-merge-a-note-on-adr-020-not-the-humans-words.md`). No approval of it is filed at this commit.
   - The inputs are filed as drafts: lead-data's at `state/drafts/reload-ends-the-old-pages-opens-form-input-lead-data.draft.md`, and the architect's round 1 at `state/drafts/reload-ends-the-old-pages-opens-form-architect-round-1.draft.md`.
2. **The node's gate.** The PLAN node `reload-ends-the-old-pages-opens` names this form as its gate. It was added as proposed at 97fe4f313c1157ffad147a7fcd48d1f8fd2bdd19. Its class is full, with both gates, as the form's title says.
3. **The form gates.** Each round's pairs were applied by the custodian by script, with each Old text found exactly once.
   - The architect read round 1 (sha256 08705b25) at the read checkout 77662d1a. It gave BLOCK, gate-log row 911, in `state/consults/gates/2026-11-26-reload-ends-the-old-pages-opens-form-gate-architect.md`. Its 49 pairs gave round 2 (4f848ac9).
   - The architect's narrow re-read gave PASS WITH NOTES, row 912, in `state/consults/gates/2026-11-26-reload-ends-the-old-pages-opens-form-gate-architect-narrow-read.md`. Its 19 pairs gave round 3 (b1dd2b60).
   - The reviewer read round 3. It gave BLOCK, row 915, in `state/consults/gates/2026-11-26-reload-ends-the-old-pages-opens-form-gate-reviewer.md`. Its 26 pairs gave round 4 (c8b6e5b7).
   - The reviewer's narrow re-read gave BLOCK, row 916, in `state/consults/gates/2026-11-26-reload-ends-the-old-pages-opens-form-gate-reviewer-narrow-read.md`. Its 2 pairs gave round 5.
   - The reviewer's second narrow read gave PASS, row 917, in `state/consults/gates/2026-11-26-reload-ends-the-old-pages-opens-form-gate-reviewer-narrow-read-2.md`, with no pair.
   - The result is this file's first 51235 bytes, sha256 71a7cd3f665356f097036deefb6b285311b53f52d872b2e07203a54e51fb3c67.
4. **ADR-037's final text** (ADV-2026-11-26-26 items 5 and 8).
   - It is filed at `state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.final.md` at 97fe4f313c1157ffad147a7fcd48d1f8fd2bdd19: the text below that file's last rule, 21775 bytes, sha256 6eb341b20c68cce92e7dd2bb216bcdbe963bbe82dbce3720ff71575afebc7483.
   - It is the accepted text that the Authority list's "ADR-037 §n" names.
   - The advisor compares it with the draft before this piece's documents commit. The merge check compares the diff's ADR-037 with it byte for byte.
5. **Span hashes.**
   - Every `path:line` cite above was read at B's base, 77662d1ac837c56d4691b6821ffd1ece049f9da4, a local merge that no branch of origin holds. Each span is therefore pinned at a commit on origin whose cited lines are byte-identical to the base's: 92 at main's 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb, and one (`commands.rs:733-741`) at PR 356's head 88ce3c6575a81f248bcc0a203355c3a49a86ca30.
   - There are 123 cites, 85 with a path and 38 bare `:n`. 105 of them are in the tree, giving 93 distinct spans. 18 are into crate sources in the cargo registry, outside every git tree, and are listed last with no hash.
   - Each entry names the file and the lines a cite is read as, the pin, the sha256 of those lines at the pin (each line with its LF), and the sections that cite it. "as written" gives the cite's form where it differs from the entry.
   - How a cite is read:
     - A bare `:n` is read as the file named before it in the same passage.
     - An entry marked (r) (22 of them) is a short name that matches more than one tracked file. It is read against the file its passage names, and the reasons follow the list.
     - The open cite `origin.rs:245-` is read as `:245`.
   - A worker made the list by script from this file's text, in a clean worktree at 11e4ef24. The custodian recomputed all 93 hashes by script, at each pin and at the base 77662d1a, and every one matched.

- `frontends/shell/src-tauri/src/lib.rs:216` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:35fcd9319108d5ebc4fff67976cf040cab6ea1c85d2b0c4fa841e1593202944e — §0, §2; as written `:216` (r)
- `kernel/src/project/mod.rs:265` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:349803bd1ab9eac618792ab4971fd10908e40db44504935cbdbe6c690240ca12 — §0
- `kernel/src/project/mod.rs:780-787` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:16c8096d39c654ec4c51e27eab71dd78e088b8a5e9f1557f83bd8dc0f322f0c7 — §0
- `kernel/src/project/mod.rs:937` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:d5f570c3dfec71a3560c83a824203f4f95cf7e8d4b958630908d760316b8671e — §0; as written `:937`
- `frontends/shell/e2e/reopen.mjs:248` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:0da63290a4b903920a6539f7d2ca3ef75384b4aa0c3d1a4625e970ef3564ae13 — §0
- `kernel/src/skp.rs:1600-1612` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ce90281111de2eb46aabd634fc0b1a8cbb4fe691cf0f3bec909106acfd9d0437 — §0, §10; as written `skp.rs:1600-1612`
- `kernel/src/skp.rs:936-972` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:4c52c457fb198f0261651c5e63904261b383b1e41bf8980da2b2cb6b361cb5da — §0; as written `:936-972`
- `kernel/src/skp.rs:73-77` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:a65bd3fde8b5b9d05626e638848e6fa54fa289ecdf2549cb74dd5b1a4474d89b — §0; as written `:73-77`
- `protocol/skp/SKP-V0.md:126-143` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:071cd543917e496fabc69c8d24a3e422286180eca0f297b3c6b49106c06d423e — §0
- `kernel/src/skp.rs:1108-1112` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:2005a4640b4cd6d06cd3cdd20e3273f98a32d15c12799c287a4f9c3b4f432720 — §0; as written `skp.rs:1108-1112`
- `kernel/src/skp.rs:1118-1135` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:197284dead9eae8a32608aadecdec7c26879f12d8759caed28ef8550e0db38f4 — §0; as written `:1118-1135`
- `kernel/src/skp.rs:1614-1675` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:75db9993f16c73e190ee81cc285ff57a6285b74130b7786f86eb0262e953ffd8 — §0; as written `skp.rs:1614-1675`
- `kernel/src/project/mod.rs:259-266` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:2951f6463d17ff662d839eff4ba700ed94c07260b8d6c58ab37870c07e997500 — §0
- `kernel/src/project/mod.rs:894-915` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:43498198fb372df6326891d7eeccca360312644970fcea9109f3ef6a2a4a3a0b — §0; as written `:894-915`
- `kernel/src/project/mod.rs:870-877` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:416174bb443a546ed2f842c87e52bbbefdc2ac63d743c52782621ca21c59d8d5 — §0; as written `:870-877`
- `kernel/src/project/mod.rs:743` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:211eaecb850d87bb35e59453a789da9c63717c15fe272a6074705b6ab54d61a3 — §0; as written `:743`
- `kernel/src/project/mod.rs:926` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:22d6dfb407ccddfd0867b1539221393a0a16cc7d77c8d8a27056d357f30f2ebb — §0; as written `mod.rs:926` (r)
- `kernel/src/skp.rs:2210` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:9fbfdd87541fd282062720f62dc649c2fb53956ed5a0cb782e99fbe9ad2138cd — §0; as written `skp.rs:2210`
- `kernel/src/skp.rs:2712-2714` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ea608e06753eceb785d43c27179dff42e89bfcfb4f4e0d2519e950056082128a — §0; as written `:2712-2714`
- `kernel/src/skp.rs:2138` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:7e5c7ea042572d29b45fe707dc3168663420f138a89d801f16db10a4d7b7797d — §0, §10; as written `skp.rs:2138`
- `engine/src/lib.rs:145` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:f9b058db220aceea95f56d281dcddce7ad7ec4cb7fbe1fbe858ea6b2bb40fc0e — §0
- `protocol/skp/src/v0/mod.rs:16` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:fd9885dcb8298141babd5b633385d4ba9d51213492b6a56d9c48994e8d24882f — §0
- `kernel/src/skp.rs:1605` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:07805ba283ed58c5088be298ce393a26cc480130fc8b2218fa26e12440ade7a2 — §0; as written `skp.rs:1605`
- `kernel/src/project/store.rs:241-252` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:81c5faacab5db22ff6013dedd01f630021d679e8bedbc047dd2bbed586591614 — §0
- `kernel/src/project/store.rs:264` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:c5fd424b358ce96d440c5f6dbe35c7e81be508f0399bf4b1f27872fd2e31288e — §0; as written `store.rs:264`
- `frontends/shell/src-tauri/src/publish.rs:1183-1187` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:0a1a0f81df3a90e205b2f2e21c8ed97ff1ba25faba25d22bb407c56dd63a0203 — §0
- `frontends/shell/src-tauri/src/publish.rs:1215` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ee1d149ae2cd894bc813e427e0aec2aececebd10df0228a7d146f35d9980957b — §0; as written `:1215`
- `frontends/shell/src-tauri/src/state.rs:68-81` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:37588e4b852bf156c8dc4f82a2df658575810ad3063bdebded592151f69257d8 — §0
- `frontends/shell/src-tauri/src/state.rs:77-80` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:e692f6be586c832b7bd151e190ba25217769dc1a1ef8ebd35538d4cf439e27f9 — §0, §2, §10; as written `:77-80`, `state.rs:77-80`
- `frontends/shell/src-tauri/src/publish.rs:1363-1366` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ccc58a169119858b84c13afca72430b40a2976fa5efadcfeac5df1914a1874cc — §0; as written `publish.rs:1363-1366` (r)
- `frontends/shell/src-tauri/src/publish.rs:1374-1388` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:8c65c5c4846d67717555f1cfce806096755f5d090a5c1cfb5b1408304a2e80fe — §0; as written `:1374-1388`
- `frontends/shell/src-tauri/src/lib.rs:479-485` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:660eb36cefa38671a5dbc3ab5086e08a47d06f1869ef831b4bddd90bbcc74cb8 — §0; as written `lib.rs:479-485` (r)
- `frontends/shell/src-tauri/src/lib.rs:326-329` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:2ef549bd3a3d6618e612ae8a88a263da844921d5150b85796f4f160587a3d9ff — §0
- `frontends/shell/src-tauri/tauri.conf.json:5` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:95c188ffa36cab936a50b6d702a7be10456d6a8daed8be1a03cc64540ac2fb07 — §0; as written `tauri.conf.json:5` (r)
- `frontends/shell/src-tauri/src/lib.rs:329` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:e512243de0caeb4522a56247727e20d55bd585812523f02602944595d047d37a — §0; as written `lib.rs:329` (r)
- `frontends/shell/e2e/project.mjs:65` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:74861dd1036958c04d2e4518d0c2bc1a1c6293a0290161321e2794482f3aadf4 — §0
- `engine/src/app_dirs.rs:82` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:de5bf8f867714c4f194f2c5a63609bf6f5342c6e9951e87507bf15b8739de82f — §0
- `engine/src/app_dirs.rs:108-109` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:c56cb25ebf4a33e3056e73c595f4d2e2693f9a1428fd400cd2b9ccdfc689ed6c — §0; as written `:108-109`
- `kernel/src/permission/audit/log.rs:370-376` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:d51a579d62d904b5ff8678eba5b09007f9f732e916f07e0afafc862739641938 — §0
- `frontends/shell/src-tauri/src/state.rs:47` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:2a972feaea27d714340f67f83f0ce1953fac4f285018c97256ccd42ce32603b7 — §0, §6; as written `state.rs:47`
- `frontends/shell/src/e2e-test-surface.ts:188` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:a5cffb73a93c1c556c9c0915877dce2c99bc5ad58d80316063574866a0838b67 — §0, §2; as written `:188`
- `frontends/shell/src/e2e-test-surface.ts:193` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:9ef9036a0638f03019739f58b04cf486ad327c5d07827684122e39de1043025d — §0, §2; as written `:193`
- `frontends/shell/src-tauri/src/lib.rs:550-573` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:7107b546774f543bf2621c1ac4f464c851482605c64ffc817640967c5ab808a6 — §1; as written `lib.rs:550-573` (r)
- `frontends/shell/src-tauri/src/lib.rs:216-277` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:fef1eedba1025c2bfa3fc28fd6bf659cf44dd0ae1d4961ab71d7ca0741742a6c — §1, §10; as written `lib.rs:216-277` (r)
- `frontends/shell/src-tauri/src/lib.rs:142-183` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:70f3630a36bc3f680c828ecb6b0fcda2439344f2a39eb47552d4173b18de20bf — §1, §10; as written `:142-183`
- `frontends/shell/src-tauri/src/lib.rs:183` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:412ca345ccf75bf9c0806bce695be8de808b79984251a7a54d202cf6101dd451 — §1; as written `:183`
- `frontends/shell/src-tauri/src/publish.rs:1096-1102` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:60b10baa88547863819a0fdf2db2b22f54516d30d8723a121a1f77c3daf568ea — §2; as written `publish.rs:1096-1102` (r)
- `frontends/shell/src-tauri/src/publish.rs:1191-1199` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:6f6a432178586a9380d48980a564bda5c97e77a7acf396d8f0934903983345ea — §2; as written `:1191-1199`
- `kernel/src/skp.rs:977-986` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:cd5d58eab25fc4661e4d81b550879f51fe54cbec4a0723d69856ee9ab26410b8 — §2; as written `skp.rs:977-986`
- `kernel/src/skp.rs:1126-1133` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:fb7cb949bfd6031d7f2bb9cee70138004cab5ee3947f887fe14c36a5d359cb16 — §2; as written `:1126-1133`
- `frontends/shell/src-tauri/src/commands.rs:209-213` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:9b1c696f1abbda35204d888c6da136144e0402b380c7b832f4022176a93a7ca8 — §2; as written `commands.rs:209-213` (r)
- `frontends/shell/src-tauri/src/state.rs:35-38` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:bf25603a4f735dd6485def431a701c570cbe3358516d14046b252e9fd864e7ed — §2; as written `state.rs:35-38`
- `frontends/shell/src-tauri/src/lib.rs:466` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:d561211156d184ede6b335419ab8039cc241d3feb3eccda23a85031b59e32d80 — §2; as written `lib.rs:466` (r)
- `protocol/skp/SKP-V0.md:192-194` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:e65cbd91b85684dc2c4b469354ab7da09e539d8fa40f261e510c98bf59a880be — §2; as written `SKP-V0.md:192-194`
- `frontends/shell/src-tauri/src/publish.rs:1182-1187` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:e1f2cb7234d502a5611cab9ed4b3ec054a9f9ca24422c35c9d139f9c553a3e61 — §2; as written `publish.rs:1182-1187` (r)
- `kernel/src/skp.rs:1605-1608` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:339a366e2fa54e0919e8fce7cf4540b8ea073c0843949fc8bf493f7d3705f707 — §2; as written `skp.rs:1605-1608`
- `frontends/shell/src/admission/AdmissionPanel.tsx:182-184` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:885f521ea82f278ddc541fa14f1dbe2584768f792b5585b9ae345c7c2b0c86f7 — §2
- `frontends/shell/src/admission/AdmissionPanel.tsx:500-502` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:bd1888ad3a419bc359bc1ebddd2a64079477424f94d1afd571753bdeee844f3f — §2; as written `:500-502`
- `frontends/shell/src-tauri/src/commands.rs:16-20` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:efceda67f51c10c9105fe0a5778bbd7705bf2602f2a0aa146e93ddd80db35a31 — §2; as written `:16-20` (r)
- `frontends/shell/src-tauri/src/commands.rs:17` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:8924834c4cab5a6ef2e9cc74a5a6aa395dc261889b8f14261b6ba324ce5fabcc — §2; as written `:17` (r)
- `frontends/shell/src-tauri/src/lib.rs:215-278` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:681f7c48bbc3be98a20feac779a3e80135571abcfbfd5a724a1e7d5bc6899ec1 — §2; as written `:215-278` (r)
- `frontends/shell/src-tauri/src/lib.rs:13-16` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:83c4177d80de13045e5bfa07f43ef13132ba63211a3597b98e680d2cac4e3128 — §2; as written `:13-16` (r)
- `frontends/shell/src-tauri/src/lib.rs:190-214` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:0023add36145f33ea05c8ded77b4d3d261964c6bc914482e197a742034940931 — §2; as written `:190-214` (r)
- `frontends/shell/e2e/checkOriginEventName.mjs:44` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:d2e3f2dfa61120252d0335eedc4bda409493fa1642e29c573564d42f12cbc14f — §2; as written `:44`
- `frontends/shell/e2e/checkOriginEventName.mjs:54-55` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:fff1ed1538367bf56d13915ffb3c1759135ffcd69e07da63739ea84c39912230 — §2; as written `:54-55`
- `frontends/shell/e2e/checkOriginEventName.mjs:78-96` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:47bfae93a703b175fcbe1e9fd994ff48a62be994ea8b752735edadb9a2456397 — §2; as written `:78-96`
- `frontends/shell/e2e/README.md:846` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:5ba2a26892f6e5db52098d9aa953b27b8f27948d550c2effa4aeaac906e9dd1c — §2
- `frontends/shell/e2e/second-open.mjs:84` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:800ce6d3006f131f10755fb9a7ea328f3d3c4db25ce127a60440d154a71f9c62 — §2; as written `second-open.mjs:84`
- `engine/src/fixture.rs:436` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:c23237aaac7973dfe68b4640f3ca3ec2cbc8486e26283d884e27dcdf12d0b6df — §3
- `engine/src/fixture.rs:998` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:f22e41488f84cf23c6a005a9f6ad11460e3ed3a6609ab55a6ae247aa979cb7d6 — §3; as written `:998`
- `engine/src/fixture.rs:693` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:380545bfc2095d2b44acc5f11d80d4c0c8ee7b3b3e8bb6299b47b07061965d14 — §3; as written `:693`
- `frontends/shell/src-tauri/src/commands.rs:733-741` @ 88ce3c6575a81f248bcc0a203355c3a49a86ca30 sha256:9aa9558733847ee8e2fa46a1bc6d4d4d81ad6cf10677fc53c3ac5d6e509d5343 — §3; as written `commands.rs:733-741` (r)
- `engine/src/watch.rs:67-68` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:4de148a5f9140f31eee66570d3b2d9099ff38a71304a7a58354b06f47341daa0 — §3, §10; as written `watch.rs:67-68`
- `engine/src/watch.rs:53-61` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:33646b59698af69942d0a00bc69fec5856d3febc1a376e2663da9e805942a967 — §3; as written `:53-61`
- `frontends/shell/e2e/project.mjs:73` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:c56d306b2d15b2cff62e4fa4c3e4f89ad0df55adc87a5e14278058dd8385d055 — §3; as written `project.mjs:73`
- `frontends/shell/e2e/project.mjs:62-64` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:a70ba890d467220b007539cae9ec1dfe4ccf0776a742a6e6fe33d2d233cd72c9 — §3; as written `project.mjs:62-64`
- `engine/src/watch.rs:39` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:6ebe8c5c4d4338a1ef5c8b196460a1a1dff933f8464ea5e583ad49fd6c674a9d — §4
- `kernel/src/skp.rs:1628-1633` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ce7b583b5ce2aef0490c48f664bcdc4c0a59911aa4b048237185e270eed715d9 — §4; as written `skp.rs:1628-1633`
- `kernel/src/skp.rs:1634-1636` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:a536b9132726e8d30b8f26283b7a205f16295cc01fe72128f0dcee7cde9e3ec0 — §4; as written `skp.rs:1634-1636`
- `engine/src/dataset.rs:2063-2073` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:0dd148ce60e6a91f9ba5c035fee8c43cdc9bbe679423148261ce921f0ac6d096 — §4
- `engine/src/dataset.rs:1692-1697` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ae9971e8c402c991d97ebf5dddd503389f9d5bdad4a796868e2c930d8ad56b7e — §4; as written `:1692-1697`
- `kernel/src/project/mod.rs:781` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:dcd775535d6459e9dccdfe036750a75e4f35fdad72107858f74c20e865fca860 — §4; as written `mod.rs:781` (r)
- `frontends/shell/e2e/pan-anchor.mjs:64` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:4aae8de406c31b3eb926b6adc2fca10e807804f43ca38b94ad7a380404ac3414 — §4; as written `pan-anchor.mjs:64`
- `frontends/shell/e2e/reopen.mjs:276` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:4e2caa4459211a09f0b29e550e3bf17147bda18528962677d6424b8a6460d29c — §4; as written `reopen.mjs:276`
- `frontends/shell/e2e/project.mjs:411-425` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:97263f90cb433c73cb4c898e8c1165523d1c98facbb83e81341defc0844de2c2 — §6; as written `project.mjs:411-425`
- `frontends/shell/src-tauri/src/origin.rs:245` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:1e0af3fd4a4c3a1d47c7f470ed0d86d90d9de210a5eb1455fbd94482a4765b72 — §10
- `kernel/src/skp.rs:1600` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:2195c16e57234f9edee3ade5479858f0d1f4ba91574b769c44f772d6c45ce7a2 — §10; as written `skp.rs:1600`
- `kernel/src/skp.rs:1108` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:773242bd546d8c460eeac591d79af6d6dfe15b77f11aa89415357d696c6dc419 — §10; as written `skp.rs:1108`
- `kernel/src/skp.rs:1614` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ff25945643915ecd1790fa6d78fd42abcca6c4332c2f86070c4c9a2f15a95c3a — §10; as written `skp.rs:1614`
- `kernel/src/project/mod.rs:259` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:677635a736cb9b84c6278a0f6343a4fb1d6d6eff2785099545cf59dcfb9fe7ac — §10; as written `mod.rs:259` (r)
- `kernel/src/project/mod.rs:894` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:ff7cf5e7b2027321d438140daf185cf042bb20adba61dd208ed890d9645483a7 — §10; as written `mod.rs:894` (r)
- `frontends/shell/src-tauri/src/publish.rs:1183` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:8e76458e1316125291494ee67cdfbe1f652b442330afbb3d880005fbd37e96e6 — §10; as written `publish.rs:1183` (r)
- `frontends/shell/src-tauri/src/state.rs:68` @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb sha256:349ef340845bde3ccced893796832e50810a0591dbf5b82c34febd4164cab1f2 — §10; as written `state.rs:68`

**(r) entries: form line, and why.**
- `frontends/shell/src-tauri/src/lib.rs:216` — form line 48, 260 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `kernel/src/project/mod.rs:926` — form line 89 — short name `mod.rs` matches 11 tracked files; the passage is about kernel/src/project/mod.rs
- `frontends/shell/src-tauri/src/publish.rs:1363-1366` — form line 98 — short name `publish.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/publish.rs
- `frontends/shell/src-tauri/src/lib.rs:479-485` — form line 98 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/tauri.conf.json:5` — form line 104 — short name `tauri.conf.json` matches 2 tracked files; the passage is about frontends/shell/src-tauri/tauri.conf.json
- `frontends/shell/src-tauri/src/lib.rs:329` — form line 106 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/src/lib.rs:550-573` — form line 180 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/src/lib.rs:216-277` — form line 181, 446 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/src/publish.rs:1096-1102` — form line 197 — short name `publish.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/publish.rs
- `frontends/shell/src-tauri/src/commands.rs:209-213` — form line 210 — short name `commands.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/commands.rs
- `frontends/shell/src-tauri/src/lib.rs:466` — form line 221 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/src/publish.rs:1182-1187` — form line 233 — short name `publish.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/publish.rs
- `frontends/shell/src-tauri/src/commands.rs:16-20` — form line 256 — short name `commands.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/commands.rs
- `frontends/shell/src-tauri/src/commands.rs:17` — form line 256 — short name `commands.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/commands.rs
- `frontends/shell/src-tauri/src/lib.rs:215-278` — form line 260 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/src/lib.rs:13-16` — form line 261 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/src/lib.rs:190-214` — form line 261 — short name `lib.rs` matches 7 tracked files; the passage is about frontends/shell/src-tauri/src/lib.rs
- `frontends/shell/src-tauri/src/commands.rs:733-741` — form line 291 — short name `commands.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/commands.rs
- `kernel/src/project/mod.rs:781` — form line 319 — short name `mod.rs` matches 11 tracked files; the passage is about kernel/src/project/mod.rs
- `kernel/src/project/mod.rs:259` — form line 486 — short name `mod.rs` matches 11 tracked files; the passage is about kernel/src/project/mod.rs
- `kernel/src/project/mod.rs:894` — form line 487 — short name `mod.rs` matches 11 tracked files; the passage is about kernel/src/project/mod.rs
- `frontends/shell/src-tauri/src/publish.rs:1183` — form line 488 — short name `publish.rs` matches 2 tracked files; the passage is about frontends/shell/src-tauri/src/publish.rs

**Outside every git tree (crates in the cargo registry; no hash).**
- form line 57: `wry-0.55.1/src/lib.rs:1687-1688`
- form line 57: `wry-0.55.1/src/webview2/mod.rs:571`
- form line 57: `:582-586` (bare; file `wry-0.55.1/src/webview2/mod.rs`)
- form line 60: `tauri-runtime-wry-2.11.4/src/lib.rs:5209-5211`
- form line 63: `wry-0.55.1/src/webview2/mod.rs:643-658`
- form line 63: `:659-670` (bare; file `wry-0.55.1/src/webview2/mod.rs`)
- form line 65: `:644` (bare; file `wry-0.55.1/src/webview2/mod.rs`)
- form line 66: `tauri-runtime-wry-2.11.4/src/lib.rs:5029-5040`
- form line 66: `wry-0.55.1/src/webview2/mod.rs:653`
- form line 66: `tauri-2.11.5/src/manager/webview.rs:296`
- form line 67: `tauri-2.11.5/src/manager/webview.rs:290-311`
- form line 68: `tauri-2.11.5/src/app.rs:1781-1789`
- form line 104: `tauri-2.11.5/src/path/desktop.rs:278-290`
- form line 105: `dirs-6.0.0/src/win.rs:11`
- form line 105: `dirs-sys-0.5.0/src/lib.rs:180-181`
- form line 105: `:150-158` (bare; file `dirs-sys-0.5.0/src/lib.rs`)
- form line 107: `tauri-2.11.5/src/manager/webview.rs:534-545`
- form line 492: `tauri-2.11.5/src/app.rs:1781-1789`

## Amendment 2 — 2026-11-27 — the base the code is built on (ADV-2026-11-26-14; ADV-2026-11-27-02 item 3 (d)), before any code

*Written by the custodian before any code of this piece. References and hashes only. Nothing above is edited.*

1. **The base** is ca57685263df8628e1b6d452e1423319a30b6596, the first commit of `cut/reload-ends-the-old-pages-opens` on origin. It is a merge made by the custodian: main e9b61547b64f42fd957f710bdce01bfa6f448e1d merged into PR 356's head 44fe6e789347d7a1cc583620706b78ae52642cf8. That head is PR 356's preparation merge of main 4b9fd558d0437b3249e1bba58334a6d55074c199 (ADV-2026-11-26-15 item 4), whose narrow read is filed at `state/consults/gates/2026-11-27-held-prs-preparation-merge-in-narrow-read-reviewer.md`.
2. **The spans hold.** By git, `git diff --name-only 77662d1ac837c56d4691b6821ffd1ece049f9da4 ca57685263df8628e1b6d452e1423319a30b6596 -- . ':!state/' ':!governance/' ':!site/'` prints nothing. Outside those three folders, the base's tree equals that of Amendment 1's base, so the spans of Amendment 1 item 5 read the same at this base.
3. **§7's count** is read against this base: `<merge-base>` in §7's command is ca57685263df8628e1b6d452e1423319a30b6596, so that PR 356's own lines are not counted. Once PR 356 is on main, the two readings agree. This is a reading, class 1, and §7 is not edited.
4. **ADV-2026-11-26-24 item 2 applies from this base.** The red commit is the branch's first commit after ca57685263df8628e1b6d452e1423319a30b6596. The code worker (worker-high) was dispatched on this base on 2026-11-27, with no e2e run.

Read the last amendment first.

## Amendment 3 — 2026-11-27 — class 8: the size at the code's head (ADV-2026-11-27-06; ADV-2026-11-27-07), before the gates

*Written by the custodian after the code and before its gates are dispatched. References and counts only. §7 is not edited, and nothing above is edited.*

1. **The figures.**
   - Declared in §7: at most 1250 changed lines over at most 8 files.
   - Final, by §7's own command at 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4, with `<merge-base>` ca57685263df8628e1b6d452e1423319a30b6596 (Amendment 2 item 3): 1670 insertions and 17 deletions, 1687 changed lines over 8 files.
   - The file count is within the ceiling. The lines run 437 over it.
   - This is class 8, and the gates go on (ADV-2026-11-27-06 item 1). No line is cut to meet the ceiling.

2. **§7's estimate, with the count beside each row.** The counts are insertions plus deletions, from the same command.

   | Part | Estimated (about) | Counted |
   |---|---|---|
   | `page.rs` code | 240 | 509: lines 1 to 509, before the test module |
   | `page.rs` tests | 560 | 809: lines 510 to 1318, the test module |
   | `lib.rs` | 35 | 70 (66 + 4) |
   | `commands.rs` | 45 | 58 (51 + 7) |
   | `project.mjs` | 90 | 39 (37 + 2) |
   | `e2e/README.md` | 12 | 4 (2 + 2) |
   | `e2e-test-surface.ts` | 4 | 4 (2 + 2) |
   | ADR-037 | 200 | 193 |
   | `docs/README.md` | 1 | 1 |
   | the ADR-020 note, if it lands | 7 | 0: not added, since ADV-2026-11-26-21 is not approved (§2 item 11) |
   | total | 1187, or 1194 with the note | 1687 |

3. **`page.rs`, where the lines beyond the estimate sit.**
   - **The worker's own account,** in the code worker's report at the head: 509 lines of code and 808 of tests, against the form's 240 and 560. The custodian's script counts the test module at 809. The worker's figure leaves out one line of the module.
   - **By item.** The custodian counted by a script over `page.rs` at 7bd3bf22. Each item runs from its first doc or attribute line to the line before the next item's first line.
   - **The product part,** lines 1 to 509: 509 lines, of which 132 are comment, 35 blank and 342 code. The estimate was 240.

     | Item | Lines |
     |---|---|
     | the module's doc comment (1 to 30) | 30, of which 28 comment |
     | the `use` lines (31 to 46) | 16 |
     | `InFlight`, `Waiting`, `State`, `Pages` and `impl Default for Pages` (47 to 91) | 45, of which 8 comment |
     | `StopFn`, `LogFn`, `EndParts` and `Settled` (92 to 121) | 30, of which 12 comment |
     | the four guards `Ticket`, `WaitGuard`, `EndGuard` and `LateGuard`, each with its `Drop` (122 to 185) | 64, of which 9 comment |
     | `fn cancelled` (186 to 191) | 6, of which 2 comment |
     | `impl Pages` (192 to 442), below | 251, of which 56 comment |
     | `fn close_one` (443 to 455) | 13, of which 2 comment |
     | `fn run_end` (456 to 509) | 54, of which 15 comment |

     Inside `impl Pages`:

     | Method | Lines |
     |---|---|
     | the opening line, `new`, `lock`, `bump` and `change` (192 to 212) | 21 |
     | `admit` (213 to 257) | 45 |
     | `try_admit` (258 to 284) | 27 |
     | `settle` (285 to 351) | 67 |
     | `forget` (352 to 359) | 8 |
     | `page_started` (360 to 397) | 38 |
     | `cancel`, with the closing brace (398 to 442) | 45 |

   - **The test module,** lines 510 to 1318: 809 lines. The estimate was 560.
     - **The rig:** 377 lines, of which 18 are comment.

       | Item | Lines |
       |---|---|
       | the `use` lines (512 to 533) | 22 |
       | `HARNESS_BOUND` and `STYLE` (534 to 539) | 6 |
       | `Latch` and its `impl` (540 to 569) | 30 |
       | `Mode` (570 to 584) | 15 |
       | `TestArm`, `HeldWatch` and their four `impl`s (585 to 633) | 49 |
       | `Seen` and its `impl` (634 to 653) | 20 |
       | `Rig`, `fn rig` and `impl Rig` (654 to 709 and 730 to 872) | 199 |
       | `poll`, `ready` and `assert_pending` (710 to 729) | 20 |
       | `held_open` (873 to 888) | 16 |

     - **The tests:** 429 lines in 14 test functions, of which 12 lines are comment.

       | Test | Lines |
       |---|---|
       | `a_page_end_closes_its_opens_and_frees_the_lock` | 21 |
       | `a_page_end_frees_the_lock_after_the_close` | 15 |
       | `an_open_settled_after_its_page_ended_is_closed` | 35 |
       | `the_gate_waits_for_ends_earlier_opens_and_late_closes` | 63 |
       | `a_name_the_page_closed_is_not_closed_again` | 19 |
       | `a_page_end_cancels_registered_publishes` | 16 |
       | `the_gate_cancel_is_the_kernels_cancelled_refusal` | 34 |
       | `a_cancel_at_the_gate_and_the_kernels_other_answers` | 82 |
       | `a_second_reload_ends_the_ending_pages_gate_waiters` | 20 |
       | `a_panic_in_the_end_still_opens_the_gate` | 15 |
       | `page_started_returns_and_starts_the_end_on_a_poisoned_lock` | 27 |
       | `a_ticket_dropped_unsettled_does_not_hold_the_gate` | 12 |
       | `a_gate_waiting_future_dropped_leaves_no_entry_to_cancel` | 17 |
       | `a_reopen_behind_an_earlier_pages_reopen_waits_then_opens` | 53 |

     - **The module's frame:** 3 lines (510, 511 and 1318).

4. **The reason.** `page.rs` runs 518 lines past its two estimates: 269 in the product part and 249 in the test module.
   - The product part's 269 are 167 comment and blank lines, and 102 code lines beyond the 240.
   - In the test module, the 14 tests take 429 lines, 131 under the 560. The rig's 377 lines and the module's 3 frame lines make up the rest.

   Whether the 342 code lines are the design §2 states is the question of ADV-2026-11-27-06 item 3, which both gates answer.

5. **Three means that the words of §2 do not name** (ADV-2026-11-27-07 items 1 and 2). By that ruling they are read as inside §2 items 3, 4, 7 and 8. They are not class 9.
   - `projects_of` in `commands.rs`;
   - the `host` parameter of `open_project`;
   - `start_page_end` in `lib.rs`.

6. **The gates.**
   - Both gates answer ADV-2026-11-27-06 item 3's question in so many words.
   - Both read ADV-2026-11-27-07 item 3 (a) to (d).
   - Both give their words on the security posture (ADV-2026-11-26-18).
   - What still stands is ADV-2026-11-27-06 item 5.

Read the last amendment first.

## Amendment 4 — 2026-11-27 — the custodian's: the build gates in two parts (ADV-2026-11-27-08 item 3), before either gate

*References and hashes only. Nothing above is edited.*

1. **The ruling.** ADV-2026-11-27-08 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-08-readings-on-363-and-366-right-the-build-gates-of-the-identity-route-and-b-in-two-parts-a-starts-on-pr-as-head-the-order-for-the-places.md`), item 3: this piece's two build gates are held in two parts, as PR 361's narrow read was (ADV-2026-11-23-12 item 2). Its item 5 places their read parts after the identity route's.
2. **What changes, with no line edited.** §10's list headed "Suites, green before either build gate" changes in time only, and for its tester's series alone: `project.mjs` at the red commit and at the head, and the other e2e suites the same series runs at the head. Every other item on that list stays green before the read part.
3. **The read part.** Each gate reads or runs everything that starts no app: the diff against this form; the unit tests and their mutations, observed again inside the machine's holds; the clause checks of every ruled string and document; the questions of ADV-2026-11-27-06 item 3 and ADV-2026-11-27-07 item 3 (Amendment 3); and its words on the security posture. Its report is filed as the read part, with its findings.
4. **The run part.** When the port has served it, each gate reads the tester's series, red at f73dfed342bb504949c3d8172c3339bef1ae8b46 and green at the head, and gives its verdict. Before that the gate is not complete and has no gate-log verdict.
5. **Findings of the read part** are corrected before the series runs, so that the series runs once, at the head the gates will pass. A correction that changes code is read by the same gate in its run part.
6. **What stands.** ADV-2026-11-26-24 item 2: if the red run ends green, or red for another reason, the piece stops and goes to the advisor, the read part with it.
7. **The head** the read parts read is 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4 (Amendment 3), or a later head recorded by amendment.

Read the last amendment first.
