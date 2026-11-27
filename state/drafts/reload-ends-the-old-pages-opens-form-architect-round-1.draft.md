# Finding B's form, drafted by the architect, correction round 1: a reload of the main window ends the old page's opens. A draft, not the form: it binds nothing

*Filed by the custodian: node:reload-ends-the-old-pages-opens@form-draft-architect, under ADV-2026-11-26-17 item 1.*

- **Why a draft.** The architect is this form's author (ADV-2026-11-26-17 item 1). Its form gates, a fresh architect and then the reviewer (item 2), have not read it. It is committed at its path under `governance/forms/frontends/` only after both pass.
- **Where it read.** Read only. The code at D:/wt/read-1126b, detached at 77662d1ac837c56d4691b6821ffd1ece049f9da4: main 7b72d29615edbef9277d5f2ffb2313fcc44c24ed with PR 356's head 88ce3c6575a81f248bcc0a203355c3a49a86ca30 merged in locally and never pushed (ADV-2026-11-26-14 item 1). In this round, the filed rulings from the main checkout's working tree, as its report says.
- **Two hand-backs.** The first (34833 bytes, sha256 9c777ac6958bfc344af6db9514def3368470762dcf5ad4ac3ad21131b0b4f7fd) rebuilt places of ADV-2026-11-26-16 to -18 from its notes after a context boundary of its own, and marked them. The custodian ticked those places against the filed rulings and sent ten corrections (6325 bytes, sha256 30b23e80d060b9e1e374cedad043d424a58b1af68c6e9984ede8ab9673ab2e5e). This is the second. The first hand-back and both briefs are copied byte for byte to local evidence, in the dated folder 2026-11-26-b-form-architect, and are not filed.
- **Dispatch and run.** Dispatched before 2026-11-26T20:05:36Z (date -u), with a brief of 5913 bytes, sha256 5b8f5e48d9acd35e7cac20d41b1fdfecc3cc407d05de1749975684ff353492f8; resumed by a message before 2026-11-26T20:32:06Z; handed back before 2026-11-26T20:36:38Z. The runs come from the completion notices only (ADV-2026-11-26-02: no transcript opened): first 129 tool uses, 918293 ms, 141428 tokens; this round 24 tool uses, 282542 ms, 205266 tokens. The model is opus, by its definition's model line.
- **How it was written here.** The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed, byte for byte and nothing masked: 44758 bytes, sha256 d3935f2205e20d807beff16d42043d6b98ca09e25287fab18c20ed51b9a1db50.

---

**Verdict: not a gate. This is a form draft for the custodian to file (correction round 1).** Reviewed: D:/wt/read-1126b (detached) @ 77662d1ac837c56d4691b6821ffd1ece049f9da4. That commit is main 7b72d29615edbef9277d5f2ffb2313fcc44c24ed with PR 356's head 88ce3c6575a81f248bcc0a203355c3a49a86ca30 merged in locally and never pushed (ADV-2026-11-26-14 item 1).

**What I read in this round, and how:**
- **The rulings**, read whole and read only, from the files the custodian named in the main checkout's working tree: ADV-2026-11-26-08, -15, -16, -17, -18 and -19. I also read the scratch draft `adv-26-21.md`.
- **The crate sources** `dirs-6.0.0` and `dirs-sys-0.5.0`, as this round allowed.
- **Everything else**, code included, at the base.

**How cites and quotes work in this report:**
- Every repo `path:line` is at the base. Crate cites use `<crate>-<version>/<path>:<line>`.
- No span hashes are pinned. I have no Bash or git.
- Only passages marked verbatim are quotes, each byte-copied from a Read. Everything else is paraphrase.
- I quote nothing of the human's or the advisor's. Rulings are cited by id and item.

---

# A reload of the main window ends the old page's opens (PLAN node `reload-ends-the-old-pages-opens`, finding B of Part AD): preregistration, full form

**Path proposed:** `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md`.

**Authority:**
- **Rulings**, cited by id and item:
  - ADV-2026-11-26-08 items 1, 2 and 6;
  - ADV-2026-11-26-11;
  - ADV-2026-11-26-13 items 2 and 3;
  - ADV-2026-11-26-14 item 1;
  - ADV-2026-11-26-15 items 4 and 7;
  - ADV-2026-11-26-16 items 1 to 5;
  - ADV-2026-11-26-17 items 1 to 5;
  - ADV-2026-11-26-18 items 1 to 6;
  - ADV-2026-11-26-19 items 2 to 4 and 7.
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
- tauri-runtime-wry maps the event (`tauri-runtime-wry-2.11.4/src/lib.rs:5029-5040`) and skips the handler when the URL does not parse.
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

### 4. Finding 6, the log folder (ADV-2026-11-26-17 item 5)

**Where the folder is resolved, by this read:**
- The shell takes it from `app.path().app_log_dir()`, with a fallback to the OS temp folder (`frontends/shell/src-tauri/src/lib.rs:326-329`).
- tauri resolves that as `dirs::data_local_dir()` joined with the identifier `dev.spatialide.shell` and `logs` (`tauri-2.11.5/src/path/desktop.rs:278-290`; `tauri.conf.json:5`).
- `dirs-6.0.0/src/win.rs:11` calls `dirs_sys::known_folder_local_app_data()`. That is `SHGetKnownFolderPath(FOLDERID_LocalAppData, 0, …)` (`dirs-sys-0.5.0/src/lib.rs:180-181`, `:150-158`).
- No environment variable is read anywhere on that path. Whether the known-folder API itself reads a process's environment is Windows behaviour, outside these sources.
- The WebView2 data folder comes from the same `LocalData` base (`tauri-2.11.5/src/manager/webview.rs:534-545`).

**What this read concludes.**
- The session log and the WebView2 data do not follow a suite's `LOCALAPPDATA` (`frontends/shell/e2e/project.mjs:65`).
- The kernel's per-user stores do follow it (`engine/src/app_dirs.rs:82`, `:108-109`; their reach, `kernel/src/permission/audit/log.rs:370-376`).
- **So the folder does not follow, and ADV-2026-11-26-17 item 5's consequence holds:**
  - the runs' logs and the human's sitting logs share one folder, and are told apart by their stamps alone (`state.rs:47`);
  - a small piece is proposed after this one, not now.

### 5. Base and overlap facts

- **From the custodian:**
  - PR 356 changes `commands.rs`, and its head is in this base.
  - PRs 359, 363, 365 and 366 change `frontends/shell/e2e/README.md`.
  - No open PR touches `page.rs`, `lib.rs`, `project.mjs` or `docs/adr/ADR-037*`.
- **Not checked by me:** the rest of §7's Scope, `docs/adr/ADR-020*` among it. I have no git. The custodian checks it by git in the base before the first commit.

### 6. Where this form departs from lead-data's draft

- **Its OPEN items, now ruled:**
  - OPEN-1, the base: closed by ADV-2026-11-26-14.
  - OPEN-2: ruled by ADV-2026-11-26-18.
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
  - **The two "Only caller: `e2e/reopen.mjs`" doc lines** on the hooks that E-1 also calls (`frontends/shell/src/e2e-test-surface.ts:191-205`).

### 7. Intake

| Item | Disposition |
|---|---|
| A reload ends the old page's opens, and a reopen after it is admitted | In |
| The new page's opens wait for the earlier ends and their opens | In (ADV-2026-11-26-13 item 3) |
| A cancel of an open that waits at the gate | In (ADV-2026-11-26-16 item 1) |
| A dated note on ADR-020 | Conditional (§2 item 11; OPEN-5) |
| Asking first, or switching off the reload keys | Out (ADR-037 Open 1) |
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
- A cancel of an open waiting at the gate answers `requested`, and that open returns the kernel's cancelled refusal without reaching the kernel.
- E-1: open, save, reload, reopen is admitted, in the e2e suite on Windows.

**May not claim:**
- which keys or menu items reload: owed to the human's press;
- any `docs/08` figure for the end or the gate's wait;
- a second window;
- a renderer process that ends with no navigation;
- an old page's command that the host begins after `Started` (ADR-037's named residual, which needs timing inside one request round trip);
- macOS or Linux.

**Class:** full form, both gates. The piece crosses the binding-to-kernel seam, adds new concurrency, touches the closure ADR-020 governs, and runs over 260 lines.

**Declared unchanged:**
- `kernel/`, `engine/`, `protocol/`, `SKP-V0.md`'s text and shape;
- `tauri.conf.json`, `capabilities/`, `Cargo.toml`, `Cargo.lock`;
- the handler list (`lib.rs:550-573`);
- the `Finished` arm's lines (`lib.rs:216-277`) and the event constant and enum (`:142-176`);
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
   - a `tokio::sync::watch` counter that is bumped on every change, the pattern of `RunningPublishes` (`publish.rs:1098-1102`, `:1191-1199`).

   Rules for that mutex:
   - It is never held across a kernel call, a wait or a close.
   - Each lock recovers from poison with `unwrap_or_else(|e| e.into_inner())`.
   - The gate lives in the binding, before the kernel's `begin_open`. No wait is added inside the kernel (ADV-2026-11-26-16 item 1, its last line).

2. **`Pages::admit(key) -> Result<Ticket, SkpError>`** (async). It enters a gate-waiting entry under the current page, then waits until one of these:
   - **(i)** `ends_running == 0`, no in-flight entry of an earlier page remains, and `late_closes_running == 0`. The entry then moves to in-flight and `Ok` is returned.
   - **(ii)** Its flag is set. The entry is removed and `Err(spatial_kernel::skp::error_of(&spatial_engine::EngineError::Cancelled))` is returned. That is the kernel's own value for a cancelled open; the binding makes no code and no text of its own.

   With no reload in the process, (i) holds at once.

3. **`Pages::settle(ticket, opened: Option<&str>, …)`**. In one critical section with `page_started`'s taking of the set (ADR-037 §4):
   - **Current page:** the name enters the current set.
   - **Ended page:** the binding starts a late close: `close_dataset`, then `release_ended`, then `late_closes_running -= 1` and a bump.
     - It runs on `std::thread::Builder::spawn`, with a drop guard holding the decrement.
     - If the spawn fails, the error goes to stderr and the guard opens the gate. That open stays held, as today.

   The command starts the dev pool poll only for a current-page name.

4. **`Pages::page_started(app)`**. It is called from the hook. It runs in constant time and has no panic path: no `unwrap`, `expect` or indexing.
   - Under the mutex, it:
     - takes the current set, its in-flight keys and its gate-waiting entries;
     - sets each gate-waiting entry's flag. Such an open returns the kernel's cancelled refusal and never reaches the kernel (U-8);
     - increments the page number and `ends_running`;
     - bumps the counter.
   - Then it starts the end on `std::thread::Builder::spawn`, with the error to stderr. The decrement guard moves into the closure, so a failed spawn still opens the gate.

5. **`run_end(set, host, projects, publishes, stop_poll, log)`**. On the end's thread, in this order:
   - (i) `SkpHost::cancel` for each in-flight key, then `RunningPublishes::cancel_all`;
   - (ii) for each name, `SkpHost::close_dataset`, then `stop_poll(name)`;
   - (iii) `Projects::release_ended` once, when `Projects` is `Some`;
   - (iv) one `SessionLog::append` line, with counts only and no handle, path or identity (`SKP-V0.md:192-194`). Its words, a draft that is not the human's: `page-end closed=<n> cancelled=<n> publishes=<n>`;
   - (v) the guard drops: `ends_running -= 1`, then a bump. The precedent is `OpenGuard`, `skp.rs:1126-1133`.

   `stop_poll`'s product caller is `lib.rs`: the pool stop under its `cfg`, and a no-op otherwise.

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
    - `e2e-test-surface.ts`: the two "Only caller" lines name both suites.

11. **ADR-020, conditional (OPEN-5).** The form holds either way:
    - **If the human's approval of ADV-2026-11-26-21 is filed on main before this PR's documents commit, and the advisor rules the mechanism OPEN-5 (a):**
      - item 5's note is appended at the end of `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md`, after its last line, in this PR;
      - its text is byte for byte the approved item's fenced block, written by script; the worker types none of it;
      - nothing above it changes;
      - `verify:adr-index --check` is re-run, and any change it needs stays inside `docs/README.md`'s row.
    - **Otherwise** ADR-020 is not changed in this piece (ADV-2026-11-26-18 item 5), and any diff to it is a block (§9 item 3).

## §3. Fixtures and predicted outcomes

- **The U tests:**
  - an engine fixture written by `spatial_engine::fixture` (`engine/src/fixture.rs:436`, `:998`; `IdentityMode::NativeUnique`, `:693`) into the test process's own temporary folder, PR 356's pattern (`commands.rs:733-741`);
  - a real `SkpHost` and a real `Projects` over a temporary root.
- **U-6** uses a test `SourceWatchArm` (`engine/src/watch.rs:67-68`) that blocks in `arm()` until it is released, then returns `ArmOutcome::ChecksOnly` (`:53-61`).
- **E-1** uses the suite's `FIXTURE` (`project.mjs:73`, read in place) and `FOLDER_ONE`.
- **Predictions:**
  - U-1 to U-10 green at the head;
  - E-1 red at the base, with `skp.project_open_elsewhere`, and green at the head;
  - the suite's other steps pass in both.

## §4. Tests, one mutation each

Each mutation is a patch file outside the repository, applied, run and reverted, named with its commit. A `verify-mutation` run is recorded as a run, never as an observation of a mutation.

| Test | Asserts | Mutation, predicted red |
|---|---|---|
| U-1 `a_page_end_closes_its_opens_and_frees_the_lock` | after `admit`, `settle` and a save, then `page_started` and `run_end`: the name is gone from the catalog and `ProjectLock::try_lock` succeeds | M-U1: `run_end` skips the close |
| U-1b (same file) | as U-1, with the close kept | M-U1b: `run_end` skips `release_ended`, so `try_lock` is `Held` |
| U-2 `an_open_settled_after_its_page_ended_is_closed` | ticket under page 1, then `page_started`, then the open, then `settle`: closed, lock free, current set empty | M-U2: `settle` enters the name whatever its page |
| U-3 `the_gate_waits_for_ends_earlier_opens_and_late_closes` | each of the three holds `admit` pending (polled with `std::task::Waker::noop()`, no sleep); `admit` is ready once all three clear | M-U3: the gate ignores earlier in-flight opens |
| U-4 `a_name_the_page_closed_is_not_closed_again` | after `forget`, the end's closed count is 0 | M-U4: `forget` does nothing |
| U-5 `a_page_end_cancels_registered_publishes` | a registered token is cancelled and counted | M-U5: `cancel_all` dropped |
| U-6 `the_gate_cancel_is_the_kernels_cancelled_refusal` | blocking arm, then `host.cancel(key)` is `Requested`, then release, then `Err` (the identity scan's attach, `engine/src/dataset.rs:2063-2073`, `:1692-1697`). The gate-cancelled open's error serializes equal to it (`serde_json::to_value`) | M-U6: the gate returns a different `SkpError` |
| U-7 `a_cancel_at_the_gate_and_the_kernels_other_answers` | a gate key answers `requested`, its open never reaches the kernel (a flag in the call), and a second cancel answers `unknown`. Unchanged answers: an unknown key gives `unknown`; a key the kernel holds gives `requested`; a bad version gives the kernel's refusal; an `sh_` handle never matches | M-U7: the binding answers before calling the kernel |
| U-8 `a_second_reload_ends_the_ending_pages_gate_waiters` | page 1 in flight, then page 2's B waits, then `page_started`: B gets the cancelled refusal, and page 3's C is ready once page 1's open settles | M-U8: the end leaves its gate-waiters, so C stays pending |
| U-9 `a_panic_in_the_end_still_opens_the_gate` | `stop_poll` panics, the end thread's join is `Err`, and `admit` is ready | M-U9: the decrement moves from the guard to the end of `run_end` |
| U-10 `page_started_returns_and_starts_the_end_on_a_poisoned_lock` | with the `Pages` mutex poisoned, `page_started` returns without a panic and the end runs | M-U10: the poison recovery replaced by `.unwrap()` |
| E-1 (`project.mjs`), after SECOND-SAVE on `FOLDER_ONE` (OPEN-1 (a)) | `page.reload({ waitUntil: "load" })`, the mount wait, then `e2eOpenProjectFolder(FOLDER_ONE)` answers admitted. The precedents: `pan-anchor.mjs:64`; `reopen.mjs:276` | M-E1: the `Started` arm returns before `page_started`, so the answer is `skp.project_open_elsewhere` |

The U tests run against `page.rs`'s functions, because the tauri mock runtime cannot run in this crate's tests (PLAN node `shell-test-executables-carry-the-common-controls-manifest`, parked). The seam's proof from the real shape is U-6, for the kernel's answer, and E-1, through the app.

## §5. Predictions, invalidators, falsification

- **Invalidators:**
  - U-6's fixture reaches no cancellable step after `arm()`. Then (c) has no real-shape test, and that goes to the advisor.
  - `ProjectLock::try_lock` cannot be reached from this crate. U-1b then uses a second `Projects` on the same root, recorded as class 3.
  - The toolchain lacks `Waker::noop` (Rust 1.85).
  - A step after E-1 fails at the head and passes at the base. That is a stop (OPEN-1).
- **Falsification:**
  - E-1 red at the head;
  - E-1 green at the base, so the fault is not reached;
  - any U test green under its own mutation.

## §6. Runs, C: and the log folder

- **The floor and the running app:**
  - No build, test or launch while C: is under its floor (ADV-2026-11-26-11; ADV-2026-11-26-19 item 7).
  - Until the human has closed their running app, nothing of this piece starts the app or a dev server (ADV-2026-11-26-19 item 2). E-1's runs wait for that.
  - The unit tests may run inside holds before then (ADV-2026-11-26-19 item 3).
  - The piece is not complete, and leaves no draft, before its e2e runs are made (the same item).
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
  - The room a launch takes on C: counts under the floor.
  - The tester tells its run's log apart by its stamp in the name (`state.rs:47`), lists the folder before and after, and copies the run's new file to the run's evidence. It moves and deletes nothing.
- **E-1's suite** launches its own app and refuses one already listening (`project.mjs:411-425`). Dev port 5180.

## §7. Declared values and ceilings

- No new constant.
- **Size:** at most 1150 changed lines, insertions plus deletions, over at most 9 files, or 10 under §2 item 11's condition.
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
  | `page.rs` tests | 450 |
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
| `e2e/README.md` | PRs 359, 363, 365, 366 (other entries) |
| the rest of §7 | none known; to be checked by git in the base (§0 item 5) |

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
   - a read of anything but the event, the label and `PinnedOrigin.window_label`;
   - a write to `PinnedOrigin` or `DataPlaneConfig`;
   - an origin selected or computed;
   - a second `on_page_load`, or the arm placed after the `Finished` filter;
   - an `unwrap`, `expect` or indexing on the hook's path.
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

## §10. Gates

**Form gates:** a fresh architect, then the reviewer. **Build gates:** both.

**The named check of ADV-2026-11-26-18 item 3.**
- The architect's form gate reads the plan, and its build gate reads the diff, against:
  - ADR-020 with its Amendment 1;
  - ADR-027;
  - `docs/09`.
- Each of those two reports says in so many words whether the piece changes the security posture, and on which lines that rests. An answer short of that is §9 item 1.

The check covers each of ADV-2026-11-26-18 item 2's six things, with its proof:
1. **The `Finished` arm's lines are unchanged, and the tests that pin the self-check are unchanged and green.**
   - Proof: a reading of the diff over `lib.rs:216-277` and `:142-176`.
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
- the caller rule: `Pages`' callers are the commands and the hook, and `stop_poll`'s is `lib.rs`;
- §9, item by item.

**Reviewer reads:**
- the full diff;
- U-1 to U-10 and E-1, each mutation observed;
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
- `project.mjs` at the base (E-1 red) and at the head, by a tester's series inside the machine's holds and under §6;
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

## OPEN questions

- **OPEN-1, where E-1 goes.**
  - (a) Between SECOND-SAVE and INSIDE-OPEN on `FOLDER_ONE` (`project.mjs:330-358`), where a project is held. Recommended. If INSIDE-OPEN fails after a reload, that is a stop.
  - (b) At the end of the chain. It is not red at the base, because the later steps' in-page closes free the lock.
- **OPEN-2:** closed by ADV-2026-11-26-16 item 1 (b). A second cancel gets the kernel's `unknown` (§2 item 6).
- **OPEN-3:** closed by ADV-2026-11-26-17 item 3 (§10 Operator).
- **OPEN-4, the session-log line's words** (§2 item 5 (iv)). This is the architect's draft, not the human's wording. It goes to the advisor.
- **OPEN-5, how a dated note on ADR-020 lands, if the human approves ADV-2026-11-26-21 item 5.** To the advisor.
  - **(a)** In this PR, as the draft's item 5 says.
    - Costs: a tenth file and about 7 lines inside the ceiling. A red-line text lands beside product code. The posture check must then read the note too.
    - It holds only if the approval is filed before this PR's documents commit.
  - **(b)** On its own, as ADV-2026-11-26-18 item 5 puts it.
    - Costs: one more small PR.
    - This piece then never touches ADR-020.
  - The two texts differ on this point. Recommended: whichever the advisor rules; the form holds either way (§2 item 11).

## §11. Amendments (opens empty, append-only; classes 1 to 9)

---

**What changed in this round, and why**
1. **§10a re-lettered from ADV-2026-11-26-16 item 1's own list.** The form now carries:
   - (a), as §2 item 6 and §9 item 3;
   - (e), as the stop in §9 item 2;
   - the last line, as §2 item 1 and §9 item 7;
   - item 5's last bullet, as §2 item 10.

   The "own cancel ends the wait" point stays in §2 item 2 as ADR-037 §5's.
2. **OPEN-2 closed.** On re-reading (b), its option (ii) would turn the kernel's `unknown` into a state other than `requested`, which (b) does not allow.
3. **OPEN-3 closed** from ADV-2026-11-26-17 item 3. §10 Operator rewritten. §0 item 2 now states the read's conclusion for a release build.
4. **§6 carries ADV-2026-11-26-17 item 4.** It also carries ADV-2026-11-26-19 items 2, 3 and 7, which bear on E-1's runs. The sitting-log copy is the custodian's and is left out.
5. **§0 item 4 settled.**
   - The `dirs` path is `SHGetKnownFolderPath`, and it reads no environment variable. The folder does not follow, so ADV-2026-11-26-17 item 5's consequence is carried.
   - The kernel's stores do follow the variable, a fact added for contrast.
   - The stray "§7a" is removed.
6. **The named check carries all six of ADV-2026-11-26-18 item 2's things**, each with its proof. Added for them: U-10, and the `SessionLog::append` reading (`state.rs:77-80`).
7. **ADV-2026-11-26-18 items 3 and 4 carried as written.** The check sits in the architect's form and build gates, and §9 item 1 is its stop.
8. **ADR-020 written to hold either way** (§2 item 11, §7, OPEN-5).
9. **The Merge line rewritten** from ADV-2026-11-26-08 item 6 as changed by ADV-2026-11-26-15 item 7, with ADV-2026-11-26-15 item 4 and ADV-2026-11-26-19 item 4.
10. **The [from notes] marks and the "Read this first" paragraph removed.**

**Findings outside the form**
1. **A "no precedent" record that no longer holds.** `frontends/shell/e2e/README.md:69-70` records that a mid-script `page.reload()` has no precedent. `pan-anchor.mjs:64` and `recentre-crossing.mjs:84` reload. So do the claims at `refusal-contract-baseline.mjs:26` and `regression.mjs:28`, `:1144`, as lead-data reported; I did not re-read those three. Documentation.
2. **Attach, then reload.** `pan-anchor.mjs:58-64` attaches and then reloads. An app left open by a previous run keeps that run's opens held until exit. Evidence hygiene until this piece lands.
3. **ADR-020:331.** Verbatim (a sub-line span): "this hook only runs on `PageLoadEvent::Finished`". That stays true of the self-check (ADV-2026-11-26-18 item 5). `lib.rs:163-173`'s "SAME completed navigation" comment is in Scope via `lib.rs`.
4. **The WebView2 data is shared too.** It resolves from the same known folder (§0 item 4). So the e2e runs and the human's own runs of `dev.spatialide.shell` share one WebView2 data folder as well as one log folder. Any page storage there carries across them. Its effect is not established. This is for the small piece ADV-2026-11-26-17 item 5 names.
5. **The recovery offer has no product caller.** `session_history::recover` (`kernel/src/session_history.rs:1235`, lead-data's cite; not re-read) has no command in `lib.rs:550-573`.
6. **For a later "ask first" piece.** tauri 2.11.5 exposes no accelerator-key or context-menu setting. Reaching wry's attribute needs raw `webview2-com` access or a dependency, and either is the human's.
7. **A hard-coded fixture path.** `project.mjs:73` points `FIXTURE` into the main checkout's `target\fixtures`. A worktree run reads the main checkout.

**Files read in this round:**
- the six ruling files named, from the main checkout's working tree, and the scratch `adv-26-21.md`;
- `dirs-6.0.0/src/{lib,win}.rs` and `dirs-sys-0.5.0/src/lib.rs` (parts);
- at the base: `frontends/shell/src-tauri/src/{state,origin,lib}.rs` (parts), `frontends/shell/e2e/{checkOriginEventName,project}.mjs` (parts), `engine/src/app_dirs.rs` (parts), `kernel/src/permission/audit/log.rs` (parts) and `kernel/src/session_history.rs:254-256`.
