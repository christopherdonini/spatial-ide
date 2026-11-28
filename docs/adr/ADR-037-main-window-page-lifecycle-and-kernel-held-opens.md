# ADR-037 — The main window's page lifecycle and the opens the kernel holds across a reload

**Status:** Accepted 2026-11-26, by the advisor's rulings ADV-2026-11-26-16 and ADV-2026-11-26-26 under the human's delegation of 2026-11-13. The words are the architect's, with four passages in the advisor's words (two bullets on `cancel` in §5, the ADR-020 consequence, and the last sentence of the docs/02 consequence). None of them are the human's.
**Drafted by:** the architect agent, on the custodian's brief (node `part-ad-finding-b`). It starts from the ADR skeleton under Finding B in `state/consults/2026-11-26-part-ad-findings-a-b-c-architect-read.md` and answers ADV-2026-11-26-08 item 2 (a) to (e). It was revised under ADV-2026-11-26-13, items 1 to 4.
**Related:** docs/01 (principle 7; the derived rules "Never block the canvas" and "Auditable beyond revertible") · docs/02 (SKP; the module map's frontends row) · docs/04 (Permission model) · docs/10 (Structure; Control plane vs data plane) · ADR-004 · ADR-006 · ADR-018 · ADR-020 Amendment 1 (the page-load hook) · ADR-022 (a session-scoped style is ephemeral view state) · ADR-035 · ADR-036 §3, §6, §9, §12 and Amendments 1 to 4 · `protocol/skp/SKP-V0.md` §1 (`close_dataset`, `cancel`).
Every path:line in this ADR is at c28c8cf1 (main), except its cites into `frontends/shell/src-tauri/src/commands.rs` and `frontends/shell/src-tauri/src/publish.rs`. Those are at B's base, main's 7b72d296 with PR 356's head 88ce3c65 merged in (ADV-2026-11-26-14, item 1), where the architect re-read each (ADV-2026-11-26-16, item 5). Each cite is a historical pin, never read as current: for the code, the tree is authoritative. Text not marked verbatim is paraphrase.

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
- **The new page cannot reach them.** Nothing hands the old page's handles to the new page, and the new page holds no project (`App.tsx:891`).
- **The fault (finding B).** After a reload, opening the project the old page saved or reopened is refused. `open_project` runs `release_ended` and then takes the lock (`mod.rs:780-787`). The old open is still in the catalog and live, so its entry stays, and the lock refuses with `skp.project_open_elsewhere`. This lasts until the process exits or that open's session ends.
- **Nothing in docs/ decides a page's lifecycle.** ADR-035's "What this ADR does not decide" (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:133`) names "reload" beside re-arm and a restored generation. That reads as a generation's reload, not the page's, so this ADR does not rest on it.

## Decision

### 1. A page

A *page* of the main window starts at a page-load event `Started` for the window whose label `PinnedOrigin.window_label` holds (`lib.rs:130-139`). It ends at the next such event or when the process exits. The form establishes two things:
- against tauri 2.11.5 and on a release build (ADV-2026-11-26-08, item 1, S0 (b)), which navigations raise `Started`: the first load, Ctrl+R, F5, the context menu's Reload, a dev full reload. Where one does not, this ADR's end does not run for it, and the form says so.
- that `Started` is raised for the main document only.

### 2. The page's opens (item 2 (a))

- **What they are.** *The page's opens* are what the host binding (`frontends/shell/src-tauri`) records, per page:
  - each dataset name its `open_dataset` and `open_project` commands returned to that page;
  - the cancel key of each such command still in flight;
  - nothing else.
  
  A name the page closes itself leaves the page's opens.
- **What a page's end touches.** It touches the page's opens. It does not touch "every dataset the catalog holds".
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
   - (i) Cancel each in-flight open's key through `SkpHost::cancel` (`skp.rs:1600-1612`). Cancel every registered publish by the path the exit uses: `RunningPublishes::cancel_all` (`publish.rs:1183-1187`), which `on_exit_requested` calls (`publish.rs:1215`).
   - (ii) Close each of the page's opens by the `close_dataset` command's own steps (`commands.rs:133-153`): the host's close (`skp.rs:1614-1675`), and the pool-poll stop under its `cfg`. This is the ordinary close; an open ended this way is ended as any close ends it.
   - (iii) Run `Projects::release_ended` once (`mod.rs:259-266`), when `Projects` exists.
   - (iv) Write one session-log line, with the counts of opens closed, keys cancelled and publishes cancelled. The line carries no handle, path or project identity (`SKP-V0.md:192-194`, as written).
3. **No new kernel code.** The end is written against these calls as they are: the kernel's `SkpHost::cancel`, `SkpHost::close_dataset` and `Projects::release_ended`, and the binding's own `RunningPublishes::cancel_all`. It needs no change to `kernel/` or `protocol/`.

### 4. Calls of the old page still in flight (item 2 (b))

The rule is that **a call begun under an ended page leaves nothing open.**
- Each `open_dataset` or `open_project` command notes which page it began under.
- When its reply is `Opened` and that page has ended, the binding closes the returned name by the host's close and then runs `release_ended`, when `Projects` exists. It stops no pool poll, because none is started for a name that enters no page's opens. The name never enters the current page's opens.
- Checking the page and entering the name happen in one critical section with §3's taking of the old record. A reply therefore lands either among a live page's opens or in the late-close path, never in neither.
- The reply then goes back as Tauri delivers it; the page that sent the call is gone.

What the user's data ends as, call by call:

| Call in flight at `Started` | What it ends as |
|---|---|
| `open_dataset` | Cancelled between its steps (§3 (i)), or completed and then closed (this section). The file is only read. No open is left that no page can reach. |
| `open_project` | As `open_dataset`. Its writes before the host's open stand as written (`mod.rs:790-796`): `folders.json`, and after the answer `copy`, the folder's `project.spatial` with a new identity (ADR-036 §4). A refusal frees its lock (`mod.rs:699`). A completed reopen's lock is freed by the late close and `release_ended`. A `Question` reply writes nothing (`mod.rs:742-743`). |
| `save_project` | One of two outcomes. If the end's close lands before the save's check under the `saved` mutex, the save is refused and writes nothing (`mod.rs:304-311`). Otherwise the save completes: `project.spatial` is replaced whole (`mod.rs:406`; ADR-036 §8), and the machine store and the history moves are written. `release_ended` waits for the save and then frees its lock (`mod.rs:247-258`). The new page shows nothing of the save. |
| `record_step` | Its line is written whole or refused. Verbatim, `SKP-V0.md:1308` (a sub-line span): "A `close_dataset` or a session end that lands after it does not stop the write: the line is true of the open it names." The process lives on, so a reload cannot tear the line. |
| `viewport_query` and its stream | The close cancels every ticket and stream of the dataset (`SKP-V0.md:151-153`). The old page's sockets also close, which the data plane reads as a cancel (`protocol/data-plane/src/adapter_ws.rs:171-174`). No user data is involved. |
| A publish, running | Cancelled by the path the exit uses (§3 (i)). It leaves what a publish cancelled on that path leaves, as `lib.rs:577-587` establishes it, and this ADR claims nothing further about its destination. ADR-018 says what the cancel owes. |
| A publish prepare | If its token is registered, it is cancelled by that same path. A prepare still in its native picker is not reached, because no command can dismiss that dialog (`commands.rs:386-391`). Its pending attempt, which no page holds, lapses at its time limit of 600 s (`publish.rs:69`). This read did not establish whether a prepare writes anything; the form establishes it. |

### 5. The new page's opens wait for the end

The rule is that **a reopen is never refused because of an earlier page.**
- **Which commands wait.** The new page's `open_dataset` and `open_project` await the open gate on the async runtime before they start. No other command waits.
- **What the gate waits for.** It opens once every earlier page's end has finished, which means all three of:
  - §3's steps have run;
  - every open those pages had in flight has returned;
  - each such open's late close and `release_ended` (§4) has run.
- **The wait is part of the open call.**
  - The user sees the open's ordinary waiting state.
  - A `cancel` of the new open's own key ends the wait. The binding answers it as for an open in flight, and the open ends as a cancelled open ends. One case inside a single request round trip is not covered: when the open leaves the gate after the kernel has answered `unknown` and before the binding looks for the key, the binding answers `unknown` and the open goes on.
  - The binding puts that `cancel` to the kernel first, so the kernel's version check and its lookup by the handle's shape are unchanged. Only when the kernel answers `unknown` for a key that the binding itself holds waiting at the gate does the binding answer `requested`.
  - The open cancelled at the gate returns the refusal that a cancelled open returns from the kernel. The binding makes no code and no text of its own for it.
  - The wait never runs on the event loop's thread or the page's (docs/01, "Never block the canvas").
  - No claim about the wait carries a duration.

### 6. The first load and other windows (item 2 (c))

- **The first load** is a `Started` like any other. No earlier page has opens, so the end closes and cancels nothing: it runs an empty `release_ended` when `Projects` exists, writes its session-log line with every count 0, and opens the gate. The hook runs only after `setup()` has managed the state it reads (`lib.rs:199-206`).
- **A window other than the main one**: its page-load events end nothing, as today's label check already skips them (`lib.rs:222-224`).
- **No second webview may be created** in this process until an amendment to this ADR keys page ownership by window.

### 7. What crosses the wire

- Nothing: no SKP command, member, event or code, and no change to the data plane or MCP (docs/10, Control plane vs data plane; ADR-004).
- The page sends nothing. The binding observes the page load and calls existing kernel operations.
- This ADR changes no text of `SKP-V0.md` and gives none of it a new reading. What it decides is that the desktop binding closes, by the ordinary close, the page's opens.

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
- **Not decided here:** whether the installed build asks first, or switches off its reload keys (What this ADR does not decide).

**(e) What a reload in the middle of recorded steps leaves in the step record (ADR-036).**
- **A step in flight** is written whole or refused (§4).
- **A step the page applied but had not yet sent** is not in the record. The page's queue sends one step at a time after the change is applied (`App.tsx:868-882`; ADR-036 §12).
- **No line marks the reload.** ADR-036 §6 has only the `saved-here` and `restored` marks. A new mark changes the shape and needs a `version` step (ADR-036 §3); it is not decided here (Open item 1).
- **The old open's record is still held after the close.** Verbatim, ADR-036:207 (a sub-line span): "While its session lives, the application holds the history under an exclusive lock." After a reload the record is still held, until the run's normal end. Whether that is the session §9 means is not decided here.
- **A saved project reopened in the same run** continues the project's record when this run holds it (`session_history.rs:392-401`; ADR-036 Amendment 2 item 4, Amendment 4). The new page's steps then chain after the old page's last step, including steps after the last save whose effect the reload discarded. A close and reopen in one run does the same today.
- **An unsaved open's `unsaved-` record** is kept until the run's normal end deletes it. Verbatim, ADR-036:209 (a sub-line span): "a normal end of the application clears every history its run created." So it is cleared at normal exit and is never offered for recovery. A crash leaves it (§9). ADR-036 §9's offer has no product caller at c28c8cf1: `session_history::recover` is called from `kernel/src/session_history.rs` and kernel tests only, and no command in the shell's handler list reaches it (`lib.rs:550-573`).

**Other consequences.**
- **The fault is fixed.** After a reload, the project the old page held opens in its own window, and AD4's "The same project" for that folder is no longer refused by a lock from an earlier page.
- **A cancelled publish is not shown.** The new page does not tell the user that a publish was cancelled at the reload, unless the piece on the reload keys changes that (What this ADR does not decide). The session-log line of §3 (iv) records the cancel.
- **ADR-006 classes.**
  - The end is not a workspace mutation: it writes no project file and records no step.
  - It is not an external side effect: it writes only its session-log line.
  - A publish it cancels is a class-3 operation, cancelled through that operation's own audited path (§4).
- **docs/01 principle 7.** Verbatim, `docs/01_Principles.md:13` (a sub-line span): "All operations are cancellable, streaming, and progress-reporting." The end cancels the old page's cancellable work rather than waiting for it. The new open's wait at the gate can be cancelled by its own key (§5). Nothing in either runs on the canvas's thread.
- **docs/08.** No number is claimed for the end or for the gate's wait. A form that states one measures it.
- **docs/02, frontends.** The binding gains lifecycle bookkeeping: it maps a transport fact that only the host sees to existing SKP calls, and decides nothing about data. The piece that lands this ADR changes the "no logic" doc comments at `lib.rs:13-16` and `commands.rs:16-20` so that they name this exception, as `commands.rs:17` already names `release_ended`.
- **ADR-020.** The arm for `Started` stands in the closure that ADR-020 Amendment 1 registers for its self-check. The self-check is unchanged and still runs only on `Finished`. The new arm takes the main window's label from the same managed state and nothing else from it. It writes neither the pinned origin nor `DataPlaneConfig`, selects no origin, and adds no Tauri command. This ADR changes no text of ADR-020.
- **e2e.** The two suites that reload mid-script (`frontends/shell/e2e/pan-anchor.mjs:64`, `frontends/shell/e2e/recentre-crossing.mjs:84`) now end the previous page's opens at that reload.
- **Proof (the seam rule).**
  - One end-to-end step from the real shape, in `frontends/shell/e2e/project.mjs`: open, save, reload the page, open the project, and assert that it opened with no refusal. It is red at the base (ADV-2026-11-26-08, item 1, S0 (a)) and green after.
  - Tests through the binding's own functions over a real `SkpHost` and `Projects`, among them these three cases:
    - an open whose reply arrives after the end is closed, and its lock is freed;
    - a new page's reopen of a project that an earlier page's reopen still holds waits, and then opens;
    - a `cancel` of the waiting open's key ends its wait.
- **Residual, named.** A command the old page sent that the host begins handling after `Started` has been handled counts as the new page's. If it is an open, it is held as one of the new page's opens, which the new page cannot reach, until that page ends or the process exits. This needs timing inside one request round trip.

## What this ADR does not decide

- **Whether the installed build asks first, or offers no reload by key or by the default menu** (ADV-2026-11-26-13, item 4). This is a piece of its own, built on B's head. Its form follows B's S0, which shows what the release build does for Ctrl+R, F5 and the menu. The four options, with their costs:
  - (i) **A `beforeunload` prompt.**
    - Needs: page code only.
    - Costs: the shell holds no "unsaved since the last save" fact, so it needs one. The prompt's words would be WebView2's, not P6's.
    - Not established: whether WebView2 under tauri 2.11.5 shows the prompt.
  - (ii) **Cancel Ctrl+R, Shift+Ctrl+R, F5 and Shift+F5 in the page's `keydown` listener.**
    - Needs: page code only.
    - Costs: the context menu's Reload and dev reloads remain.
    - Not established: whether WebView2 lets page script cancel its browser keys.
  - (iii) **Turn off WebView2's browser accelerator keys.**
    - Needs: if tauri 2.11.5 or wry exposes it as a builder call or a key in the app's own `tauri.conf.json`, that is product code under a form. If it needs a new crate, a new Cargo feature or a lockfile change, that part is the human's.
    - Costs: it also turns off find, print and zoom.
    - Not established: which of the two applies.
  - (iv) **Turn off the default context menu.**
    - Needs: the same rule as (iii).
    - Costs: copy and paste in the menu, if shown.
    - Not established: whether the release build shows that menu.

  None of the options removes the need for §3, because dev reloads, the e2e reloads and any other navigation remain.
- A kernel-side client scope (an owner on each open, in `kernel/src/skp.rs`). That is its home once a second binding shares one kernel (docs/10), and each binding then ends its own client's opens.
- A second window's ownership rule (§6).
- Anything in `SKP-V0.md`. It belongs to every client, and this ADR neither changes it nor reads it anew (§7).
- A page whose renderer process ends with no navigation.
- Whether ADR-036 §9's "while its session lives" ends at a close.
- The recovery offer's product caller.
- The session-log line's words.

## Open

1. A mark for steps discarded by a reload, with the `version` step it needs (ADR-036 §3).

## Amendment 1 — 2026-11-28 — the open that `recover_session` starts is among the page's opens (node `b2-piece-1c-step-3-recovery-offer`)

*Appended under the advisor's rulings ADV-2026-11-27-37, item 2, ADV-2026-11-27-41, item 1, and ADV-2026-11-28-02, item 1, under the human's delegation of 2026-11-13, and accepted in the text the last of them gives. The words are the architect's, except these, which are the advisor's: this paragraph; in item 2's row, the sentence on a refusal after the open, the sentence on a refusal of the truncation and the three sentences on the listing; and item 6. None of them is the human's. It lands in the part of the recovery offer that lands `recover_session`'s handler. Nothing above this heading is edited: each item names a passage above by its section, and that passage is read with the item's words in its place, or with them added where the item says so. This amendment carries no `path:line`; for the code, the tree is authoritative.*

1. **§2, "What they are."** The list is read as:
   - each dataset name its `open_dataset` and `open_project` commands returned to that page, and each dataset name its `recover_session` command returned to that page for a request whose `dataset` was null;
   - the cancel key of each such command still in flight;
   - nothing else.

   `recover_session` with a null `dataset` is an open command wherever §3 to §5 and the Consequences name `open_dataset` and `open_project`. Its reply is `Opened` in §4's sense when the reply's `opened` is present. `recover_session` with a handle, `list_recoverable` and `discard_recoverable` start no open. They are not open commands, and nothing in this ADR applies to them.

2. **§4, the table.** A row is read after the `open_project` row:

   | `recover_session`, `dataset` null | Cancelled through its key (§3 (i)), or at the gate (§5), or completed and then closed (this section). Before its open it locks and reads the record and writes nothing. A refusal or a cancel before the record is truncated leaves the history byte for byte (the recovery offer's preregistration, Amendment 4 item 5). A refusal after its open closes that open in the kernel before it answers (the same preregistration, Amendment 17 item 5). A refusal of the truncation itself leaves the history byte for byte or truncated to its kept lines, and a later listing reads the same steps either way (the same item). A completed recover has truncated the record to its kept lines and adopted it into this run. After the late close the record stays with this run, as an unsaved open's record does after a close (Consequences (e)), and a normal end clears it. The listing does not wait at the gate (§5). It skips a record this run holds and a record whose history is locked, so it lists neither a record that a recover has adopted nor one that a recover in flight has locked. When a recover in flight is then cancelled or refused, a later listing lists its record again. No open is left that no page can reach. |

3. **§5, "Which commands wait."** Read as: The new page's `open_dataset`, `open_project`, and `recover_session` with a null `dataset`, await the open gate on the async runtime before they start. No other command waits: `recover_session` with a handle, `list_recoverable` and `discard_recoverable` do not.

4. **Consequences (e), last bullet, the sentence on the offer's product caller.** Read as: At c28c8cf1, ADR-036 §9's offer had no product caller: `session_history::recover` was called from `kernel/src/session_history.rs` and kernel tests only, and no command in the shell's handler list reached it. From the piece that lands this amendment, the offer's product callers are `list_recoverable`, `recover_session` and `discard_recoverable`, in the shell's handler list. A record that a crash left is offered as ADR-036 §9 says. In the run that made it, the record of an unsaved open that a reload closed is still never offered: the listing skips the records this run holds, and a normal end clears it.

5. **What this ADR does not decide, "The recovery offer's product caller."** Read as removed. Item 1 decides it, for the open that `recover_session` starts. Nothing else of the recovery offer is decided here.

6. **§2, "What a page's end touches", its first sub-bullet.** Read with this added after it: From the piece that lands this amendment, `SkpHost::open_under` is reached by a third route, `recover_session` with a null `dataset`, and that route too is reached only through its Tauri command. So every open in the catalog is still one that a page of the main window made.
