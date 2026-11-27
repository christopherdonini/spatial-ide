# ADR-037 draft, Proposed, by the architect, revised under ADV-2026-11-26-13: the main window's page lifecycle and the opens the kernel holds across a reload (finding B of Part AD). Not accepted; for the advisor's ruling

*Filed by the custodian: node:part-ad-finding-b@adr-037-architect-revision, under ADV-2026-11-26-13 items 1 to 4 and item 6. The advisor rules on its acceptance from this filed draft. Until then it binds nothing, and no line of docs/adr/ is written.*

- **What changed.** This file held the first draft at 7b72d29615edbef9277d5f2ffb2313fcc44c24ed (26097 bytes, sha256 00b84b0b3a015c2f39b98d75909b89a4e890ee6ad60664d5905f6c5e43267fe8). The revision replaces it whole. The first draft stays readable at that commit.
- **Where it read.** Read only, in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08. Its cites into frontends/shell/src-tauri/src/commands.rs and publish.rs are at that commit, not at PR 356's head; B's form re-reads them at B's base (ADV-2026-11-26-14).
- **Dispatch and run.** The same agent as the first draft, resumed by one message sent before 2026-11-26T19:34:47Z (date -u). Its run comes from its completion notice only (ADV-2026-11-26-02: no transcript opened): 3 tool uses, 128829 ms, 227931 tokens. It handed back once, before 2026-11-26T19:39:32Z (date -u after saving).
- **How it was written here.** The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed, byte for byte and nothing masked: 25893 bytes, sha256 bb1efb2e43988a9729ec487af5e5fd5d0aada5fa28b26a196b006edeece553d5. Its question 1 went to the advisor.

---

**Verdict: not a gate.** This is the revised ADR-037 draft, under ADV-2026-11-26-13 items 1 to 4 and ADV-2026-11-26-14 item 1. Reviewed: detached read checkout D:/wt/read-1124f @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08, a main commit.

- **Cites.** Every path:line is at c28c8cf1. I did not read PR 356's branch (88ce3c65), because I have no git and the brief confines me to the read checkout and the scratch folder. The ADR therefore says that B's form re-reads its cites into `commands.rs` and `publish.rs` at B's base.
- **Quotes.** Each quote marked verbatim is copied from the Read output, and all other text is paraphrase. There are no span hashes. Both rulings' words are the advisor's, cited by id and item and never quoted.
- **One point for the advisor.** It is the first item in the questions at the end: making the gate's wait cancellable by the new open's own key needs the binding's `cancel` to answer for a key that is waiting at the gate.

---

# ADR-037 — The main window's page lifecycle and the opens the kernel holds across a reload

**Status:** Proposed 2026-11-26. It binds nothing until it is accepted. The advisor rules on acceptance from this filed draft (ADV-2026-11-26-08, item 2; ADV-2026-11-26-13, item 6), under the delegation of 2026-11-13. The accepted text lands in finding B's PR.
**Drafted by:** the architect agent, on the custodian's brief (node `part-ad-finding-b`). It starts from the ADR skeleton under Finding B in `state/consults/2026-11-26-part-ad-findings-a-b-c-architect-read.md` and answers ADV-2026-11-26-08 item 2 (a) to (e). It was revised under ADV-2026-11-26-13, items 1 to 4.
**Related:** docs/01 (principle 7; the derived rules "Never block the canvas" and "Auditable beyond revertible") · docs/02 (SKP; the module map's frontends row) · docs/04 (Permission model) · docs/10 (Structure; Control plane vs data plane) · ADR-004 · ADR-006 · ADR-018 · ADR-020 Amendment 1 (the page-load hook) · ADR-022 (a session-scoped style is ephemeral view state) · ADR-035 · ADR-036 §3, §6, §9, §12 and Amendments 1 to 4 · `protocol/skp/SKP-V0.md` §1 (`close_dataset`, `cancel`).
Every path:line in this ADR is at c28c8cf1 (main). B's base is main's tip with PR 356's head merged in (ADV-2026-11-26-14, item 1). PR 356 changes `frontends/shell/src-tauri/src/commands.rs` and `frontends/shell/src-tauri/src/publish.rs`, so B's form re-reads each cite into those two files at that base. Text not marked verbatim is paraphrase.

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
3. **No new kernel code.** The end is written against these kernel calls as they are (`SkpHost::cancel`, `SkpHost::close_dataset`, `Projects::release_ended`, `RunningPublishes::cancel_all`). It needs no change to `kernel/` or `protocol/`.

### 4. Calls of the old page still in flight (item 2 (b))

The rule is that **a call begun under an ended page leaves nothing open.**
- Each `open_dataset` or `open_project` command notes which page it began under.
- When its reply is `Opened` and that page has ended, the binding closes the returned name by §3 (ii) and then runs `release_ended`. The name never enters the current page's opens.
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
  - A `cancel` of the new open's own key ends the wait. The binding answers it as for an open in flight, and the open ends as a cancelled open ends.
  - The wait never runs on the event loop's thread or the page's (docs/01, "Never block the canvas").
  - No claim about the wait carries a duration.

### 6. The first load and other windows (item 2 (c))

- **The first load** is a `Started` like any other. No earlier page has opens, so the end only runs an empty `release_ended` and opens the gate. The hook runs only after `setup()` has managed the state it reads (`lib.rs:199-206`).
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
- **docs/02, frontends.** The binding gains lifecycle bookkeeping: it maps a transport fact that only the host sees to existing SKP calls, and decides nothing about data. The "no logic" doc comments at `lib.rs:13-16` and `commands.rs:16-20` name this exception, as `commands.rs:17` already names `release_ended`.
- **e2e.** The two suites that reload mid-script (`frontends/shell/e2e/pan-anchor.mjs:64`, `frontends/shell/e2e/recentre-crossing.mjs:84`) now end the previous page's opens at that reload.
- **Proof (the seam rule).**
  - One end-to-end step from the real shape, in `frontends/shell/e2e/project.mjs`: open, save, reload the page, open the project, and assert that it opened with no refusal. It is red at the base (ADV-2026-11-26-08, item 1, S0 (a)) and green after.
  - One test, through the binding's own functions over a real `SkpHost` and `Projects`, with three cases:
    - an open whose reply arrives after the end is closed, and its lock is freed;
    - a new page's reopen of a project that an earlier page's reopen still holds waits, and then opens;
    - a `cancel` of the waiting open's key ends its wait.
- **Residual, named.** A command the old page sent that the host begins handling after `Started` has been handled counts as the new page's. If it is an open, that open stays held until exit, as it would today. This needs timing inside one request round trip.

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

---

**Changes against the first draft, one line each:**
1. Context, "The new page cannot reach them": dropped the verbatim quote of `SKP-V0.md:192` and its use as a reason (ADV-2026-11-26-13, item 1).
2. §2: renamed to "The page's opens" and made that the ADR's own term throughout, in place of "the page's set" (item 1).
3. §3 (ii): added that it is the ordinary close, and that an open ended this way is ended as any close ends it (item 1).
4. §3 (iv): the no-logging cite to `SKP-V0.md:192-194` now says "as written" (item 1).
5. §7: replaced the reading of SKP-V0 §3's "session-scoped" with "changes no text of SKP-V0 and gives none of it a new reading; the binding closes, by the ordinary close, the page's opens" (item 1).
6. "What this ADR does not decide": "what SKP-V0 §3's session means for other bindings" became "Anything in SKP-V0; neither changed nor read anew" (item 1).
7. §3 (i): the publish cancel is named as the path the exit uses, citing `publish.rs:1215` (on_exit_requested's call), beside `:1183-1187` (ADV-2026-11-26-13, item 2).
8. §4, running-publish row: it now refers to what `lib.rs:577-587` establishes and claims nothing further about the destination. The sentence about a cancel after the last cancel point is removed (item 2).
9. §4, prepare row: "cancelled by that same path" (item 2).
10. Consequences: added "A cancelled publish is not shown", with the session-log line as its record (item 2).
11. §5: rewritten. The gate now also waits for every earlier page's in-flight opens and their late closes, and a reopen is never refused because of an earlier page. The wait is the open's ordinary waiting state and is ended by the new open's own `cancel`, with no duration claimed (ADV-2026-11-26-13, item 3).
12. Consequences: removed the residual "a new page's reopen … is refused … until the old call returns" (item 3).
13. Consequences, Proof: the binding-level test gains the wait-then-open case and the cancel-during-wait case (item 3).
14. Consequences, docs/01 principle 7: added that the gate's wait can be cancelled by the new open's key (item 3).
15. Open item 2 (gate and old in-flight opens) removed (item 3).
16. Open item 1 (ask first or switch off) moved to "What this ADR does not decide" as a piece of its own on B's head, with its form after B's S0 (ADV-2026-11-26-13, item 4).
17. Option (iii): "a config key … is a setting, hence the human's" is corrected. A builder call or a key in the app's own `tauri.conf.json` is product code under a form; a new crate, a new Cargo feature or a lockfile change is the human's. Option (iv) points to the same rule (item 4).
18. Consequences (d): "Open: whether the installed build asks first" became "Not decided here", pointing to the same section (item 4).
19. The remaining Open item, the reload mark, is renumbered from 3 to 1, and its cite in (e) is renumbered with it (follows from items 3 and 4).
20. Header: added B's base, main's tip with PR 356's head merged in, and that B's form re-reads the cites into `commands.rs` and `publish.rs` at that base (ADV-2026-11-26-14, item 1).
21. Status and Drafted by: added ADV-2026-11-26-13 (item 6, and the revision under items 1 to 4).
22. Related: the SKP-V0 entry now names §1 (`close_dataset`, `cancel`) and drops §3 as a decision source (item 1; item 3 for `cancel`).

**Questions for the advisor**
1. **Is §5's cancel a new reading of SKP-V0?** For the new open's own Cancel to end the gate's wait (ADV-2026-11-26-13, item 3), the binding's `cancel` command (`commands.rs:103-109`) has to answer for a key that is waiting at the gate. The kernel's registry for in-flight opens does not hold that key yet, because `begin_open` runs after the gate (`skp.rs:1118-1135`; `mod.rs:709`). §5 treats the wait as part of the open call, so the binding answers `requested`, and the open ends as a cancelled open ends. That matches `SKP-V0.md:132-134` as written: a key is looked up among in-flight opens. The binding then composes that answer itself.
   - If you read that as a new reading of SKP-V0, it is the protocol stop.
   - The only alternative is a wait inside the kernel's call after `begin_open`. That needs `kernel/src/skp.rs` and `kernel/src/project/mod.rs`, which ADV-2026-11-26-14 item 1 also routes to you.
2. **My cites into `commands.rs` and `publish.rs` are at c28c8cf1**, not at PR 356's head 88ce3c65, because I could not read that branch. B's form re-reads them at B's base.
