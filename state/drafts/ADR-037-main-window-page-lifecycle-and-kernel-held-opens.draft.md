# ADR-037 draft, Proposed, by the architect: the main window's page lifecycle and the opens the kernel holds across a reload (finding B of Part AD). Not accepted; for the advisor's ruling

*Filed by the custodian: node:part-ad-finding-b@adr-037-architect-draft, under ADV-2026-11-26-08 item 2. The advisor rules on its acceptance from this filed draft. Until then it binds nothing, and no line of docs/adr/ is written.*

- **Where it read.** Read only, in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08.
- **Its number.** ADR-037 was unused on main and on every remote branch, by git (`git ls-tree -r` over each remote branch, and `git grep` on origin/main), before dispatch.
- **Dispatch and run.** Dispatched just before 2026-11-26T19:09:28Z (date -u after the call), with its brief byte for byte: brief-adr-037-architect.md in the scratch folder, 2874 bytes, sha256 3264304503e24411206b0af9eb8244ab679138034733ac8d4bfb09e9f72c5e33. Its run comes from its completion notice only (ADV-2026-11-26-02: no transcript opened): 76 tool uses, 733920 ms, 209271 tokens. The model is opus, by its definition's model line. It handed back once, before 2026-11-26T19:22:59Z (date -u after saving), and no message was sent to it.
- **How it was written here.** The custodian wrote the whole hand-back through the Write tool, with the harness's two-space indent removed, byte for byte and nothing masked: 24331 bytes, sha256 4356bbdeebaef82c83fa1752fa7c480e49beb175cf2e6eae0b9e816c1f3f8ed7. It holds the draft from its `#` line, then the drafter's open questions and its findings outside the draft.
- **Its open questions** went to the advisor at 19:27Z, with B's base: open PR 356 changes `frontends/shell/src-tauri/src/commands.rs`, which the draft needs.

---

**Verdict: not a gate. This is a draft ADR, filed for the advisor's ruling on acceptance.** Reviewed: detached read checkout D:/wt/read-1124f @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08, a main commit. Every path:line below is at c28c8cf1. The only quotes are the ones marked verbatim, each copied from the Read output. All other text is paraphrase. There are no span hashes. I quote nothing from the human, and nothing from the advisor's file, which is untracked; I cite it by id and item only.

Draft for `state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.draft.md`, from the `#` line to the line before "After the draft":

---

# ADR-037 — The main window's page lifecycle and the opens the kernel holds across a reload

**Status:** Proposed 2026-11-26. It binds nothing until it is accepted. The advisor rules on acceptance from this filed draft (ADV-2026-11-26-08, item 2), under the delegation of 2026-11-13. The accepted text lands in finding B's PR.
**Drafted by:** the architect agent, on the custodian's brief (node `part-ad-finding-b`). It starts from the ADR skeleton under Finding B in `state/consults/2026-11-26-part-ad-findings-a-b-c-architect-read.md` and answers ADV-2026-11-26-08 item 2 (a) to (e).
**Related:** docs/01 (principle 7; the derived rules "Never block the canvas" and "Auditable beyond revertible") · docs/02 (SKP; the module map's frontends row) · docs/04 (Permission model) · docs/10 (Structure; Control plane vs data plane) · ADR-004 · ADR-006 · ADR-018 · ADR-020 Amendment 1 (the page-load hook) · ADR-022 (a session-scoped style is ephemeral view state) · ADR-035 · ADR-036 §3, §6, §9, §12 and Amendments 1 to 4 · `protocol/skp/SKP-V0.md` §1 (`close_dataset`) and §3.
Every path:line in this ADR is at c28c8cf1 (main). Text not marked verbatim is paraphrase.

## Context

The desktop shell runs one process. One kernel serves the main window's page, and the page can be replaced while the kernel runs on. Ctrl+R, F5, the context menu's Reload, a dev full reload and the e2e suites' `page.reload()` all replace it.

- **What the kernel holds for a page.** Each open has:
  - a catalog entry and its DuckDB pool;
  - an armed source watch (`kernel/src/skp.rs:1203-1207`, removed by `close_dataset` at `:1628-1633`);
  - a session-history record (`kernel/src/session_history.rs:290-338`);
  - after a save or a reopen, the project's open lock (`kernel/src/project/mod.rs:126-138`).
  
  The lock is dropped only when `release_ended` finds the open closed or its session ended. Verbatim, `kernel/src/project/mod.rs:265` (a sub-line span): `saved.retain(|s| open(&s.dataset));`
- **Nothing closes them at a reload.**
  - The page closes a dataset only from an in-page effect (`frontends/shell/src/App.tsx:1645-1650`).
  - The page has no unload handler: a search of `frontends/shell/src` for `beforeunload|pagehide|unload` finds none.
  - The host's page-load hook returns at once for every event except `Finished` and closes nothing. Verbatim, `frontends/shell/src-tauri/src/lib.rs:216` (a sub-line span): `if payload.event() != tauri::webview::PageLoadEvent::Finished {`
- **The new page cannot reach them.** Handles are session-scoped. Verbatim, `protocol/skp/SKP-V0.md:192` (a sub-line span): "All four are session-scoped and non-persistable." Nothing hands the old page's handles to the new page, and the new page holds no project (`App.tsx:891`).
- **The fault (finding B).** After a reload, opening the project the old page saved or reopened is refused. `open_project` runs `release_ended` and then takes the lock (`mod.rs:780-787`). The old open is still in the catalog and live, so its entry stays, and the lock refuses with `skp.project_open_elsewhere`. This lasts until the process exits or that open's session ends.
- **Nothing in docs/ decides a page's lifecycle.** ADR-035's "What this ADR does not decide" (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:133`) names "reload" beside re-arm and a restored generation. That reads as a generation's reload, not the page's, so this ADR does not rest on it.

## Decision

### 1. A page

A *page* of the main window starts at a page-load event `Started` for the window whose label `PinnedOrigin.window_label` holds (`lib.rs:130-139`). It ends at the next such event or when the process exits. The form establishes two things:
- against tauri 2.11.5 and on a release build (ADV-2026-11-26-08, item 1, S0 (b)), which navigations raise `Started`: the first load, Ctrl+R, F5, the context menu's Reload, a dev full reload. Where one does not, this ADR's end does not run for it, and the form says so.
- that `Started` is raised for the main document only.

### 2. Whose opens (item 2 (a))

- **A page holds the opens it made.** The host binding (`frontends/shell/src-tauri`) records, per page:
  - each dataset name its `open_dataset` and `open_project` commands returned to that page;
  - the cancel key of each such command still in flight;
  - nothing else.
  
  A name the page closes itself leaves the page's set.
- **What a page's end touches.** It touches the page's own set. It does not touch "every dataset the catalog holds".
  - Today the two are the same set. The shell builds the only product `SkpHost` (`lib.rs:282-296`; every other `SkpHost::new` call in the tree is a test). Its catalog gains an entry only through `SkpHost::open_under` (`skp.rs:1206-1207`). That is reached from `open_dataset` (`skp.rs:1108-1112`) and from `Projects::open_project` (`mod.rs:826`), and both are reached only through the Tauri commands (`commands.rs:63-79`, `:204-224`).
  - The data plane redeems tickets and opens nothing (`lib.rs:431-435`).
  - The shell has one window (`tauri.conf.json:14-20`; `capabilities/default.json:5`). The measure build builds that same window, not a second one (`lib.rs:523-541`).
  - So at c28c8cf1 every open in the catalog was made by a page of the main window.
- **As planned, the sets differ.** docs/10 (Structure) and docs/02 (Plugins) plan other SKP and MCP clients, and docs/04 (Permission model) scopes grants per client. Once one of them shares this kernel, the catalog holds opens that no page made. A user's reload must not close an agent's or a plugin's open. By the rule above, an open the page did not make is never closed by the page's end.
- **A second window** gets no ownership rule here (§6).

### 3. The end of a page

At a main-window `Started`, the binding:
1. **Starts the end, without waiting.** In the hook itself, in constant time and with no wait on any kernel lock, it starts a new page record and closes the *open gate* (§5). The old record is kept for the end.
2. **Runs the end off the hook's thread.** The steps below run on a thread of their own, as `close_dataset` already hands off `release_ended` (`commands.rs:143-147`). They never run on the event loop's thread or the page's.
   - (i) Cancel each in-flight open's key through `SkpHost::cancel` (`skp.rs:1600-1612`). Cancel every registered publish through `RunningPublishes::cancel_all` (`publish.rs:1183-1187`), the call the exit path makes (`publish.rs:1206-1217`).
   - (ii) Close each name in the old page's set by the `close_dataset` command's own steps (`commands.rs:133-153`): the host's close (`skp.rs:1614-1675`), and the pool-poll stop under its `cfg`.
   - (iii) Run `Projects::release_ended` once (`mod.rs:259-266`), when `Projects` exists.
   - (iv) Write one session-log line, with the counts of opens closed, keys cancelled and publishes cancelled. The line carries no handle, path or project identity (`SKP-V0.md:192-194`).
   - (v) Open the gate.
3. **No new kernel code.** The end is written against these kernel calls as they are (`SkpHost::cancel`, `SkpHost::close_dataset`, `Projects::release_ended`, `RunningPublishes::cancel_all`). It needs no change to `kernel/` or `protocol/`.

### 4. Calls of the old page still in flight (item 2 (b))

The rule is that **a call begun under an ended page leaves nothing open.**
- Each `open_dataset` or `open_project` command notes which page it began under.
- When its reply is `Opened` and that page has ended, the binding closes the returned name by §3 (ii) and then runs `release_ended`. The name never enters the current page's set.
- Checking the page and entering the name happen in one critical section with §3's taking of the old set. A reply therefore lands either in a live page's set or in the late-close path, never in neither.
- The reply then goes back as Tauri delivers it; the page that sent the call is gone.

What the user's data ends as, call by call:

| Call in flight at `Started` | What it ends as |
|---|---|
| `open_dataset` | Cancelled between its steps (§3 (i)), or completed and then closed (this section). The file is only read. No open is left that no page can reach. |
| `open_project` | As `open_dataset`. Its writes before the host's open stand as written (`mod.rs:790-796`): `folders.json`, and after the answer `copy`, the folder's `project.spatial` with a new identity (ADR-036 §4). A refusal frees its lock (`mod.rs:699`). A completed reopen's lock is freed by the late close and `release_ended`. A `Question` reply writes nothing (`mod.rs:742-743`). |
| `save_project` | One of two outcomes. If the end's close lands before the save's check under the `saved` mutex, the save is refused and writes nothing (`mod.rs:304-311`). Otherwise the save completes: `project.spatial` is replaced whole (`mod.rs:406`; ADR-036 §8), and the machine store and the history moves are written. `release_ended` waits for the save and then frees its lock (`mod.rs:247-258`). The new page shows nothing of the save. |
| `record_step` | Its line is written whole or refused. Verbatim, `SKP-V0.md:1308` (a sub-line span): "A `close_dataset` or a session end that lands after it does not stop the write: the line is true of the open it names." The process lives on, so a reload cannot tear the line. |
| `viewport_query` and its stream | The close cancels every ticket and stream of the dataset (`SKP-V0.md:151-153`). The old page's sockets also close, which the data plane reads as a cancel (`protocol/data-plane/src/adapter_ws.rs:171-174`). No user data is involved. |
| A publish, running | Cancelled by §3 (i). It ends as any cancelled publish ends today: the kernel's error arm removes its staging directory and records a cancelled outcome (`lib.rs:577-587`). If the cancel arrives after its last cancel point, it ends with its own outcome. ADR-018 says what the cancel owes. This ADR adds no case to the audit record. |
| A publish prepare | If its token is registered, it is cancelled. A prepare still in its native picker is not reached, because no command can dismiss that dialog (`commands.rs:386-391`). Its pending attempt, which no page holds, lapses at its time limit of 600 s (`publish.rs:69`). This read did not establish whether a prepare writes anything; the form establishes it. |

### 5. The new page's opens wait for the end

- The new page's `open_dataset` and `open_project` await the open gate on the async runtime before they start. No other command waits.
- The wait never runs on the event loop's thread or the page's (docs/01, "Never block the canvas"). It lasts only while §3's closes and `release_ended` run. It does not wait for the old page's in-flight opens (§4).
- Without the gate, a new page's reopen that arrived before §3 (ii) had run would be refused as already open.

### 6. The first load and other windows (item 2 (c))

- **The first load** is a `Started` like any other. The old record is empty, so the end only runs an empty `release_ended` and opens the gate. The hook runs only after `setup()` has managed the state it reads (`lib.rs:199-206`).
- **A window other than the main one**: its page-load events end nothing, as today's label check already skips them (`lib.rs:222-224`).
- **No second webview may be created** in this process until an amendment to this ADR keys page ownership by window.

### 7. What crosses the wire

- Nothing: no SKP command, member, event or code, and no change to the data plane or MCP (docs/10, Control plane vs data plane; ADR-004).
- The page sends nothing. The binding observes the page load and calls existing kernel operations.
- For the desktop binding, this ADR reads `SKP-V0.md` §3's "session-scoped" as ending with the page that received the handle. It does not edit that text.

### 8. The step record (item 2 (e))

ADR-036's rules are unchanged. The end ends no session-history record. The records stay with this run until its normal end clears them (§9), as they do after a `close_dataset` today.

## Consequences

**(d) What a user loses at a reload, and that nothing asks first.**
- **Lost:** everything the page held in memory. That is:
  - the open dataset on the canvas;
  - the filter clauses and the applied filter;
  - the style;
  - the view;
  - a selection;
  - the notices on screen;
  - a publish dialog, or a running publish (§4);
  - the project the window held (`App.tsx:891`).
- **What remains:**
  - a saved project's file as at its last save;
  - a save or an export that completed (§4);
  - the session history's lines on the machine (below).
- **Nothing asks first.** There is no `beforeunload` handler. The page's one `keydown` listener (`frontends/shell/src/layout/StudioLayout.tsx:279-304`) cancels only its own chords. Those are B, I, J and K (`frontends/shell/src/layout/actionRegistry.ts:72-80`); none is R or F5.
- **No undo.** The page's state is ephemeral view state (ADR-022), and a reload is not offered as undoable. Verbatim, ADR-006 Consequences (a sub-line span of `docs/adr/ADR-006-lineage-undo-side-effects.md:25`): "users are never told something is revertible when it isn't."
- **Open:** whether the installed build asks first, or switches off its reload keys (Open item 1).

**(e) What a reload in the middle of recorded steps leaves in the step record (ADR-036).**
- **A step in flight** is written whole or refused (§4).
- **A step the page applied but had not yet sent** is not in the record. The page's queue sends one step at a time after the change is applied (`App.tsx:868-882`; ADR-036 §12).
- **No line marks the reload.** ADR-036 §6 has only the `saved-here` and `restored` marks. A new mark changes the shape and needs a `version` step (ADR-036 §3); it is not decided here (Open item 3).
- **The old open's record is still held after the close.** Verbatim, ADR-036:207 (a sub-line span): "While its session lives, the application holds the history under an exclusive lock." After a reload the record is still held, until the run's normal end. Whether that is the session §9 means is not decided here.
- **A saved project reopened in the same run** continues the project's record when this run holds it (`session_history.rs:392-401`; ADR-036 Amendment 2 item 4, Amendment 4). The new page's steps then chain after the old page's last step, including steps after the last save whose effect the reload discarded. A close and reopen in one run does the same today.
- **An unsaved open's `unsaved-` record** is kept until the run's normal end deletes it. Verbatim, ADR-036:209 (a sub-line span): "a normal end of the application clears every history its run created." So it is cleared at normal exit and is never offered for recovery. A crash leaves it (§9). ADR-036 §9's offer has no product caller at c28c8cf1: `session_history::recover` is called from `kernel/src/session_history.rs` and kernel tests only, and no command in the shell's handler list reaches it (`lib.rs:550-573`).

**Other consequences.**
- **The fault is fixed.** After a reload, the project the old page held opens in its own window, and AD4's "The same project" for that folder is no longer refused by a lock from an earlier page.
- **ADR-006 classes.**
  - The end is not a workspace mutation: it writes no project file and records no step.
  - It is not an external side effect: it writes only its session-log line.
  - A publish it cancels is a class-3 operation, cancelled through that operation's own audited path (§4).
- **docs/01 principle 7.** Verbatim, `docs/01_Principles.md:13` (a sub-line span): "All operations are cancellable, streaming, and progress-reporting." The end cancels the old page's cancellable work rather than waiting for it. Nothing in it runs on the canvas's thread.
- **docs/08.** No number is claimed for the end or for the gate's wait. A form that states one measures it.
- **docs/02, frontends.** The binding gains lifecycle bookkeeping: it maps a transport fact that only the host sees to existing SKP calls, and decides nothing about data. The "no logic" doc comments at `lib.rs:13-16` and `commands.rs:16-20` name this exception, as `commands.rs:17` already names `release_ended`.
- **e2e.** The two suites that reload mid-script (`frontends/shell/e2e/pan-anchor.mjs:64`, `frontends/shell/e2e/recentre-crossing.mjs:84`) now end the previous page's opens at that reload.
- **Proof (the seam rule).**
  - One end-to-end step from the real shape, in `frontends/shell/e2e/project.mjs`: open, save, reload the page, open the project, and assert that it opened with no refusal. It is red at the base (ADV-2026-11-26-08, item 1, S0 (a)) and green after.
  - One test, through the binding's own functions over a real `SkpHost` and `Projects`: an open whose reply arrives after the end is closed, and its lock is freed.
- **Residual, named.** A command the old page sent that the host begins handling after `Started` has been handled counts as the new page's. If it is an open, that open stays held until exit, as it would today. This needs timing inside one request round trip.
- **Residual, named.** A new page's reopen of the project an old in-flight reopen is still opening is refused with `skp.project_open_elsewhere` until the old call returns, cancelled or completed and then closed. That refusal is the kernel's true fact at that moment, and a retry then succeeds. Ordinary use can reach this by reloading during a long reopen (Open item 2).

## What this ADR does not decide

- A kernel-side client scope (an owner on each open, in `kernel/src/skp.rs`). That is its home once a second binding shares one kernel (docs/10), and each binding then ends its own client's opens.
- A second window's ownership rule (§6).
- What `SKP-V0.md` §3's "session" means for any binding other than the desktop one.
- A page whose renderer process ends with no navigation.
- A mark for steps a reload or a close discarded (ADR-036 §3, §6).
- Whether ADR-036 §9's "while its session lives" ends at a close.
- The recovery offer's product caller.
- The session-log line's words.
- Asking first, or switching off the reload keys (Open item 1).

## Open

1. **Ask first, or switch off the reload keys, in the installed build** (item 2 (d)). The options, with their costs:
   - (i) **A `beforeunload` prompt.**
     - Needs: page code only, no dependency or setting.
     - Costs: the shell holds no "unsaved since the last save" fact, so it needs one. The prompt's words would be WebView2's, not P6's.
     - Not established: whether WebView2 under tauri 2.11.5 shows the prompt.
   - (ii) **Cancel Ctrl+R, Shift+Ctrl+R, F5 and Shift+F5 in the page's `keydown` listener.**
     - Needs: no dependency or setting.
     - Costs: the context menu's Reload and dev reloads remain.
     - Not established: whether WebView2 lets page script cancel its browser keys.
   - (iii) **Turn off WebView2's browser accelerator keys.**
     - Costs: it also turns off find, print and zoom.
     - Not established: whether tauri 2.11.5 or wry exposes this as a config key or builder method. Otherwise it needs a direct WebView2 dependency.
   - (iv) **Turn off the default context menu.**
     - Costs: copy and paste in the menu, if shown.
     - Not established: whether the release build shows that menu.

   A dependency, or a config key in `tauri.conf.json` (which is a setting), makes that part the human's (the delegation of 2026-11-13, item 4 (c)). It is not in this piece. None of the options removes the need for §3, because dev reloads, the e2e reloads and any other navigation remain.
2. Whether the open gate (§5) also waits for the old page's in-flight opens. That removes the second residual, but then the new page's first open waits on a cancelled open whose metadata reads are not bound.
3. A mark for steps discarded by a reload, with the `version` step it needs (ADR-036 §3).

---

After the draft:

**Open questions for the advisor**
1. **Open item 1 (item 2 (d)).** Is option (iii) as a builder call in `lib.rs` a "setting" in your sense? As a `tauri.conf.json` key it is, and then it is the human's. Options (i) and (ii) need neither a dependency nor a setting. Each has an unestablished WebView2 behaviour, which S0 (b) can settle in one sitting.
2. **Base files.** The decision needs `frontends/shell/src-tauri/src/commands.rs`: open and reopen note their page, the late close, and the gate. Your base check (ADV-2026-11-26-08, item 1) names `lib.rs`, `e2e/project.mjs`, `kernel/src/skp.rs` and `kernel/src/lib.rs`, but not `commands.rs`. The custodian should check open PRs for it. The decision needs neither `kernel/src/project/mod.rs` nor `kernel/src/skp.rs`. It also does not need `Catalog::names`, because the page set replaces the catalog-wide close.
3. **Publish at reload.** The draft cancels running publishes, as the exit path does (`publish.rs:1206-1217`), because no page can show the outcome or offer Cancel. The alternative is to let them run to their own outcome. Which do you rule?
4. **Open item 2.** A transient refusal, or a wait behind the old in-flight open?
5. **§7.** The draft reads `SKP-V0.md` §3's "session-scoped" as page-scoped for the desktop binding and does not edit SKP-V0. If you want that reading written into SKP-V0 itself, that is a protocol file, so it is a stop to you under your item 1.
6. **Not established in the repository:**
   - which navigations raise `Started` (§1);
   - which thread the page-load closure runs on (§3 keeps it constant-time either way);
   - whether a Tauri command can name its calling webview (only needed for the second-window amendment).

**Findings outside the draft**
- **`frontends/shell/e2e/README.md:69-70`** carries a quote from `residency-harness.mjs` (`:2031`) that a mid-script `page.reload()` has "no precedent anywhere in this harness suite". That no longer holds: `frontends/shell/e2e/pan-anchor.mjs:64` and `frontends/shell/e2e/recentre-crossing.mjs:84` reload. Documentation.
- **`frontends/shell/e2e/pan-anchor.mjs:58-64`** attaches with `attachOrLaunch` and then reloads. On an attach to an app a prior run left with a dataset open, that run's open stays held in the kernel, with its watch and pool, until the app exits. This is today's behaviour and is evidence hygiene for e2e runs; ADR-037 would end it.
- **The architect read's Finding B** cites `ADR-035:133` as leaving reload out of its scope. That line's "reload" sits beside re-arm and a restored generation, and reads as a generation's reload. It is a weak cite; the draft does not rest on it.
- **`kernel/src/session_history.rs:1235` (`recover`)** has no product caller: there is no command in `frontends/shell/src-tauri/src/lib.rs:550-573`. ADR-036 §9's recovery offer is therefore unbuilt, so after a crash as well as a reload, no offer is made. This may already be recorded as later work; I did not check KNOWN-LIMITATIONS for it.

Files read (all under D:/wt/read-1124f): `frontends/shell/src-tauri/src/{lib,commands,publish}.rs`, `frontends/shell/src-tauri/tauri.conf.json`, `frontends/shell/src-tauri/capabilities/default.json`, `frontends/shell/src/App.tsx` (parts), `frontends/shell/src/layout/{StudioLayout.tsx,actionRegistry.ts}` (parts), `kernel/src/{skp,lib,session_history}.rs` (parts), `kernel/src/project/mod.rs` (parts), `protocol/skp/SKP-V0.md` (parts), `protocol/skp/src/v0/handles.rs`, `protocol/data-plane/src/adapter_ws.rs` (parts), `docs/01`, `docs/02`, `docs/04`, `docs/10`, `docs/adr/ADR-006`, `ADR-035` (parts), `ADR-036`, `governance/AI_DEVELOPMENT.md` (red lines and §B), `state/directives/2026-11-13-the-grant-approved-…md`, `frontends/shell/e2e/{README.md,pan-anchor.mjs}` (parts). I also read the scratch copies of ADV-2026-11-26-08 and the architect read.
