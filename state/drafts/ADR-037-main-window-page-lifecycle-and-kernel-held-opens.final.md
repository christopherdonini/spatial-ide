# ADR-037 final text, Accepted, by the architect at B's base with ADV-2026-11-26-26 applied: what lands in docs/adr/ is the text below the last rule, from its first line to Open item 1's line (ADV-2026-11-26-26 item 5)

*Filed by the custodian: node:reload-ends-the-old-pages-opens@adr-037-final-text, under ADV-2026-11-26-16 item 5 and ADV-2026-11-26-26 item 8. The advisor compares it with the draft (`state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.draft.md`, unchanged) before B's documents commit, and B's merge check compares B's diff with the text below the last rule byte for byte.*

- **Where it read.** The architect read the draft and the rulings from scratch copies of main at 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb, and the code at B's base: D:/wt/read-1126b at 77662d1ac837c56d4691b6821ffd1ece049f9da4, a detached local merge of main 7b72d29615edbef9277d5f2ffb2313fcc44c24ed and PR 356's head 88ce3c6575a81f248bcc0a203355c3a49a86ca30, which no branch of origin holds.
- **Dispatch and run.** A fresh architect, dispatched before 2026-11-26T21:38:41Z (date -u), with no message during the run. Its run comes from its completion notice only (ADV-2026-11-26-02: no transcript opened): 26 tool uses, 356834 ms, 147563 tokens; model opus. It handed back once, before 2026-11-26T21:45:07Z (the saved report's modification time). It has no shell, so it hashed nothing; the custodian recomputed the seven input hashes, and each matched.
- **How the text was made.** The custodian wrote the architect's report below through the Write tool from the hand-back message, with the harness's two-space indent removed, byte for byte, nothing masked (9033 bytes, sha256 e8e6b6bd). The hand-back's own copy of the text, between its delimiter lines, was not written out. In its place the custodian built the text by script from the draft on main and ADV-2026-11-26-16's three fences, by the differences the report states (the Status line, the one header sentence in the architect's words, item 3's three additions at their places): 25928 bytes, sha256 0a35ae54. Then ADV-2026-11-26-26 items 1 to 4 and 6 were applied as exact Old/New pairs, each Old found once, item 7's Status line set, and item 5's last line taken, by script: the text below the last rule, 21775 bytes, sha256 6eb341b20c68cce92e7dd2bb216bcdbe963bbe82dbce3720ff71575afebc7483.
- **Its untrue clauses** U1 to U5 went to the advisor with the architect's words, and ADV-2026-11-26-26 takes all five (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-26-adr-037-final-text-u1-to-u5-taken-the-docs-02-sentence-and-the-status-line-in-the-advisors-words.md`).

---

FINAL TEXT READY WITH UNTRUE CLAUSES FOR THE ADVISOR. I could not compute the byte count or the sha256: I have no shell tool, only Read, Grep and Glob. Reviewed: main @ 11e4ef2440778f2c30252d2b5ace6b459dd9fcfb (the draft, read from its scratch copy) and detached D:/wt/read-1126b @ 77662d1ac837c56d4691b6821ffd1ece049f9da4.

**Input hashes.** I could not recompute any of them, for the same reason, so I could not apply the brief's stop. The custodian or the reviewer must recompute all seven input hashes before this is filed. What I could check by search on the draft copy (paraphrase): it has no CR bytes and no tabs. No line ends in trailing spaces, except draft file lines 36 and 60, which are each exactly two spaces. I kept both in the final text. In the ruling copy, no line ends in whitespace.

DIFFERENCES (the draft's ADR is draft file line 20 to the end; file lines 1 to 19 are the filing note and the report header, and are not part of it)
- **Header, the Status line. Kind: item 4.** Replaced whole with ADV-2026-11-26-16 item 4's fenced line, copied byte for byte.
- **Header, the sentence on where the cites were read. Kind: header line.** The old sentence said every cite is at c28c8cf1 and that B's form re-reads the cites into commands.rs and publish.rs. The new sentence says three things:
  - those two files' cites are at B's base, named by its two parents (main 7b72d296 and PR 356's head 88ce3c65), and the architect re-read them under item 5;
  - every cite is a historical pin, never read as current, and for the code the tree is authoritative;
  - text not marked verbatim is paraphrase (kept from the old sentence).
  - Reasons: the re-read is now done. B's diff edits commands.rs, so at B's head those lines no longer match, and round 14's pin rule makes the record name which is authoritative. I named the two parents and not 77662d1a, because that detached merge commit will not be reachable from main.
- **§5, "The wait is part of the open call". Kind: item 3.** The two bullets from item 3's first fence are inserted byte for byte, directly after the bullet that begins "A `cancel` of the new open's own key ends the wait.", at the same depth.
- **Consequences, "Other consequences". Kind: item 3.** The ADR-020 bullet from item 3's second fence is inserted byte for byte, directly after the `**docs/02, frontends.**` bullet.
- **Cites into commands.rs and publish.rs. Kind: cite re-read.** No number changed: each cite is at the same line at B's base as in the draft (table below).
- The Drafted by and Related lines are unchanged: the landing needs no change to either. Nothing else differs.

CITES (draft line(s) → line(s) at B's base, and whether the lines bear the ADR's words out; my readings are paraphrase)
- `commands.rs:63-79` (§2) → 63-79. Yes: the `open_dataset` command, which calls `host.open_dataset` on `spawn_blocking` at :69.
- `commands.rs:204-224`, written `:204-224` (§2) → 204-224. Yes: the `open_project` command, which calls `open_project_command` at :214. A search of the crate's src finds no other product caller of either.
- `commands.rs:143-147` (§3 item 2) → 143-147. Yes: `release_ended` is handed to its own thread.
- `commands.rs:133-153` (§3 (ii)) → 133-153. Yes: the host's close at :142, the `release_ended` hand-off at :143-147, and the pool-poll stop under its `cfg` at :148-151.
- `commands.rs:386-391` (§4, the prepare row) → 386-391. Yes for this command: the doc says nothing it can do would close an open OS save dialog. The ADR's "no command" is broader than these lines, which speak of this command alone.
- `commands.rs:16-20` (Consequences, docs/02) → 16-20. At the base this is the "no logic" doc, and it does not yet name the gate. It names it only after B's own edit (form §2 item 7). It is true at landing if B makes that edit.
- `commands.rs:17` (same bullet) → 17. Yes: it names `Projects::release_ended`.
- `commands.rs:103-109` (the trailer, question 1) → 103-109. Yes: the `cancel` command, which calls `state.cancel`.
- `publish.rs:1183-1187` (§3 (i); also `:1183-1187` in the trailer's change 7) → 1183-1187. Yes: `cancel_all` cancels every registered token and returns the count.
- `publish.rs:1215` (§3 (i); trailer change 7) → 1215. Yes: `on_exit_requested` (:1206-1217) calls `cancel_all`.
- `publish.rs:69` (§4, the prepare row) → 69. Yes: `PENDING_ATTEMPT_TTL` is 600 s.
- How I checked the numbers: commands.rs lines 1 to 400 read the same in both checkouts. In publish.rs, a search finds :67, :69, :1183, :1206 and :1215 on the same lines in both. PR 356's publish.rs changes fall after line 2000.

UNTRUE (none of these sentences is the human's wording: all are the architect's, and none touches the advisor's additions or Status line. Each proposed sentence replaces the named sentence only.)
1. **§3 item 3, "No new kernel code", second sentence.**
   - Why it is untrue: it calls `RunningPublishes::cancel_all` a kernel call. That function is the binding's own (`frontends/shell/src-tauri/src/publish.rs:1183`).
   - Proposed: `The end is written against these calls as they are: the kernel's `SkpHost::cancel`, `SkpHost::close_dataset` and `Projects::release_ended`, and the binding's own `RunningPublishes::cancel_all`.`
   - Clause check: `cancel` and `close_dataset` are in kernel/src/skp.rs (form §0 item 3); `release_ended` is in kernel/src/project/mod.rs; `cancel_all` is in publish.rs at B's base.
2. **§6, first bullet, second sentence ("the end only runs an empty `release_ended` and opens the gate").**
   - Why it is untrue: B's form as gated (§2 item 5 (iv)) writes the session-log line at every end, the first load's included, with every count 0. An operator can see that line in the session log.
   - Proposed: `No earlier page has opens, so the end closes and cancels nothing: it runs an empty `release_ended`, writes its session-log line with every count 0, and opens the gate.`
   - Clause check: there are no names and no in-flight keys; `cancel_all` runs on an empty registry, because only page commands register a publish; `release_ended` runs (form item 5 (iii)); the line is written (item 5 (iv)); the gate opens once `ends_running` is 0 (item 2 (i)).
3. **Consequences, Proof, the second bullet's lead-in ("One test, ... with three cases:").**
   - Why it is untrue: the form as gated proves these cases with separate tests, U-2, U-12 and U-6/U-7, out of thirteen U tests.
   - Proposed: `  - Tests through the binding's own functions over a real `SkpHost` and `Projects`, among them these three cases:`
   - Clause check: form §4 says the U tests run against page.rs's functions, and §3 says they use a real `SkpHost` and a real `Projects`. U-2 is the late open closed with its lock freed; U-12 is the reopen that waits, then opens; U-6 and U-7 are the cancel at the gate.
4. **Consequences, Residual, second sentence ("that open stays held until exit, as it would today").**
   - Why it is untrue: by §2 and §4, and by form §2 items 3 to 5, such an open settles under the current page, so its name joins the new page's opens and the next page's end closes it.
   - Proposed: `If it is an open, it is held as one of the new page's opens, which the new page cannot reach, until that page ends or the process exits.`
   - This case needs timing inside one request round trip, so it does not block; it is named.
5. **The trailer after the Open section** (the `---`, "Changes against the first draft" and "Questions for the advisor").
   - Why: it is the draft's report to the advisor, not ADR content. The brief defines the ADR as running to the end of the file, so I kept it. But question 2's "B's form re-reads them at B's base" is overtaken by item 5's re-read. Question 1 is answered by ADV-2026-11-26-16 item 1, and its "the binding answers `requested`" is narrowed by item 3's first addition.
   - Proposed: end the text with the Open section's line `1. A mark for steps discarded by a reload, with the `version` step it needs (ADR-036 §3).`, and remove the blank line, the `---` and everything after it.
   - If the advisor keeps the trailer: question 2's second sentence becomes `The architect re-read them at B's base under ADV-2026-11-26-16, item 5.`

Notes (not untrue, no words proposed):
- **The prepare row** still leaves to the form whether a prepare writes anything. The form says it writes nothing, by read only, and has the build gate's reviewer confirm that. If that gate finds a write, the row goes to the advisor (form §0 item 3).
- **Proof says E-1 is "red at the base".** E-1 is in fact red at the red commit: the base with E-1's step alone (ADV-2026-11-26-24). The meaning holds for the product code.
- **§5's cancel bullets.** The form names a second moment, inside one request round trip, where a cancel answers `unknown`. That needs timing inside one round trip, so it does not block, and the form records it.
- **None of B's five gate reports** finds an ADR-037 clause untrue once C-2 is applied (the architect report's closing line).

---

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
  - The binding puts that `cancel` to the kernel first, so the kernel's version check and its lookup by the handle's shape are unchanged. Only when the kernel answers `unknown` for a key that the binding itself holds waiting at the gate does the binding answer `requested`.
  - The open cancelled at the gate returns the refusal that a cancelled open returns from the kernel. The binding makes no code and no text of its own for it.
  - The wait never runs on the event loop's thread or the page's (docs/01, "Never block the canvas").
  - No claim about the wait carries a duration.

### 6. The first load and other windows (item 2 (c))

- **The first load** is a `Started` like any other. No earlier page has opens, so the end closes and cancels nothing: it runs an empty `release_ended`, writes its session-log line with every count 0, and opens the gate. The hook runs only after `setup()` has managed the state it reads (`lib.rs:199-206`).
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
