# ADR-037's Amendment 1 (the open the recovery offer starts, counted) and the posture answer: the architect's draft (node:b2-piece-1c-step-3-recovery-offer@adr-037-amendment-1)

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`, items 2, 3 and 6 (a). The architect (Opus) was dispatched with its brief byte for byte (brief-adr037-am1-architect.md in the scratch folder), read only. By the facts script, its run went from 2026-11-27T22:22:54Z to 2026-11-27T22:30:00Z; by its completion notice, 57 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed. Its Part B went to the advisor at once (ADV-2026-11-27-37 item 3), who placed it in ADV-2026-11-27-38 item 1. Amendment 1's words are the advisor's to rule. Not a gate.*

---

No verdict (this is a draft). I read three trees: main @ ba5e73973abfd1792c71a064b940c58f1b8d73db in its working tree, cut/reload-ends-the-old-pages-opens @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 at D:/wt/reload, and cut/text-id-reopen-with-a-recorded-declaration @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 at D:/wt/c1rd. I took the commit ids from the refs under C:/dev/spatial-ide/.git. I had no git and no hashing tool, so I could not see any uncommitted changes in the worktrees, and I pinned no hashes. At session start the main checkout showed the recovery form as modified and the ruling as untracked. My [M] line cites into those two files are therefore to the working tree as read; the custodian pins them when filing.

# ADR-037 Amendment 1 and the posture answer: the architect's draft (node:b2-piece-1c-step-3-recovery-offer@adr-037-amendment-1)

Under ADV-2026-11-27-37 items 2, 3 and 6 (a). Text not marked verbatim is paraphrase. Rulings are cited by id and item. Checkouts: [M] is C:/dev/spatial-ide, [R] is D:/wt/reload, [C1] is D:/wt/c1rd.

## PART A: ADR-037 Amendment 1

### The five Old texts, byte-copied from [R] `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` and marked verbatim

Whose words: ADR-037's Status line ([R] :3) says its words are the architect's, except four passages in the advisor's words. None of the five passages below is one of those four, and none is the human's. ADV-2026-11-27-37 item 2 makes the words and the acceptance of the amendment the advisor's.

1. §2's list, [R] :37-40, verbatim:
```
- **What they are.** *The page's opens* are what the host binding (`frontends/shell/src-tauri`) records, per page:
  - each dataset name its `open_dataset` and `open_project` commands returned to that page;
  - the cancel key of each such command still in flight;
  - nothing else.
```
2. §4's table. The new row goes after the `open_project` row, [R] :75, verbatim:
```
| `open_project` | As `open_dataset`. Its writes before the host's open stand as written (`mod.rs:790-796`): `folders.json`, and after the answer `copy`, the folder's `project.spatial` with a new identity (ADR-036 §4). A refusal frees its lock (`mod.rs:699`). A completed reopen's lock is freed by the late close and `release_ended`. A `Question` reply writes nothing (`mod.rs:742-743`). |
```
3. §5's "Which commands wait", [R] :85, verbatim:
```
- **Which commands wait.** The new page's `open_dataset` and `open_project` await the open gate on the async runtime before they start. No other command waits.
```
4. Consequence (e), [R] :140. This is a span inside the line; the hash would be of the whole line. Verbatim:
```
ADR-036 §9's offer has no product caller at c28c8cf1: `session_history::recover` is called from `kernel/src/session_history.rs` and kernel tests only, and no command in the shell's handler list reaches it (`lib.rs:550-573`).
```
5. What this ADR does not decide, [R] :188, verbatim:
```
- The recovery offer's product caller.
```

### The amendment, to append after [R] :193 (the ADR's last line)

Round 14 forbids a bare self-line. So the amendment points at its own ADR by section and carries no `path:line`; the line numbers above are only for this draft's reader.

````text
## Amendment 1 — <date> — the open that `recover_session` starts is among the page's opens (node `b2-piece-1c-step-3-recovery-offer`)

*Appended under the advisor's ruling ADV-2026-11-27-37, item 2, under the human's delegation of 2026-11-13. Drafted by the architect; its words and its acceptance are the advisor's, and none of them is the human's. It lands in the part of the recovery offer that lands `recover_session`'s handler. Nothing above this heading is edited: each item names a passage above by its section, and that passage is read with the item's words in its place. This amendment carries no `path:line`; for the code, the tree is authoritative.*

1. **§2, "What they are."** The list is read as:
   - each dataset name its `open_dataset` and `open_project` commands returned to that page, and each dataset name its `recover_session` command returned to that page for a request whose `dataset` was null;
   - the cancel key of each such command still in flight;
   - nothing else.

   `recover_session` with a null `dataset` is an open command wherever §3 to §5 and the Consequences name `open_dataset` and `open_project`. Its reply is `Opened` in §4's sense when the reply's `opened` is present. `recover_session` with a handle, `list_recoverable` and `discard_recoverable` start no open. They are not open commands, and nothing in this ADR applies to them.

2. **§4, the table.** A row is read after the `open_project` row:

   | `recover_session`, `dataset` null | Cancelled through its key (§3 (i)), or at the gate (§5), or completed and then closed (this section). Before its open it locks and reads the record and writes nothing. A refusal or a cancel before the record is truncated leaves the history byte for byte (the recovery offer's preregistration, Amendment 4 item 5). A completed recover has truncated the record to its kept lines and adopted it into this run. After the late close the record stays with this run, as an unsaved open's record does after a close (Consequences (e)), and a normal end clears it. The new page is not offered it. No open is left that no page can reach. |

3. **§5, "Which commands wait."** Read as: The new page's `open_dataset`, `open_project`, and `recover_session` with a null `dataset`, await the open gate on the async runtime before they start. No other command waits: `recover_session` with a handle, `list_recoverable` and `discard_recoverable` do not.

4. **Consequences (e), last bullet, the sentence on the offer's product caller.** Read as: At c28c8cf1, ADR-036 §9's offer had no product caller: `session_history::recover` was called from `kernel/src/session_history.rs` and kernel tests only, and no command in the shell's handler list reached it. From the piece that lands this amendment, the offer's product callers are `list_recoverable`, `recover_session` and `discard_recoverable`, in the shell's handler list. A record that a crash left is offered as ADR-036 §9 says. In the run that made it, the record of an unsaved open that a reload closed is still never offered: the listing skips the records this run holds, and a normal end clears it.

5. **What this ADR does not decide, "The recovery offer's product caller."** Read as removed. Item 1 decides it, for the open that `recover_session` starts. Nothing else of the recovery offer is decided here.
````

### Each clause checked against the code it rests on

Part 1's handler is not written yet. So each mechanism clause is checked against B's code, and each recover clause against the form; the build gates check every clause against the landed code.

- **Admit, settle and the late close apply to a third command unchanged.** `Pages::admit(key)` and `Pages::settle(ticket, opened, host, projects)` do not depend on which command calls them ([R] `frontends/shell/src-tauri/src/page.rs:229`, `:303-309`). `open_dataset` is the pattern to follow ([R] `commands.rs:86-94`).
- **Cancel at the gate works for any waiting key.** `Pages::cancel` matches waiting entries by key alone ([R] page.rs:430-438).
- **The end cancels in-flight keys and closes names, whatever command noted them** ([R] page.rs:477-504).
- **The open happens at step 4 and the truncation at step 5; a refusal or cancel before step 5 leaves the history byte for byte.** This is the form's step list, [M] form :627-634 (Amendment 2 C-series as read). That supports the "byte for byte" clause, and "writes nothing before its open" (steps 1 to 3 only validate, refuse, lock and read).
- **"Adopted into this run".** Step 6 pushes a `Record` with holder `Open(name)` ([M] form :85-88, :633).
- **"The listing skips the records this run holds."** [M] form :68 and :621.
- **"`opened` is present exactly when the kernel opened the data."** [M] form :111.
- **"The handle arm starts no open."** [M] form :84.

Only one case here does not block: a reply that lands inside one request round trip after `Started`. That is ADR-037's own residual ([R] :160), which item 1 extends to recover by its reading clause.

### Notes for the advisor and lead-data (outside the five places)

- **N-a: the ADR file is not in Part 1's file list.** Amendment 10 item 2's Files sentence says Part 1 touches nothing under `docs/adr/` ([M] form :2024). The ruling (item 2) lands this ADR file in the part that lands the handler. Lead-data's class 9 amendment has to change that sentence. With this file added, the union goes from 48 to 49 files of 50.
- **N-b: the form does not say where `begin_open` sits in `recover_session`.** The form only says the null arm opens "through" it ([M] form :83). `open_project` registers its key at its start ([C1] `kernel/src/skp.rs:1114-1117`). If recover registers only at step 4, a cancel during steps 1 to 3 answers `unknown`. That is the window `Pages::cancel`'s doc names ([R] page.rs:414-416), and here it is wider. The form should either put `begin_open` first or name the window.
- **N-c: the form does not say what happens to the open when step 5 or 6 refuses after step 4 has opened the data.** No name is returned, so `settle` cannot close it. That would be an open no page can reach, which is the fault ADR-037 ends, and it can happen with no reload at all. The form should say the kernel closes it.
- **N-d: §2's second bullet ([R] :44-47) is not amended.** It is a historical pin at c28c8cf1 ([R] :6, :47) and stays true as history. At the landing head a third route into `open_under` exists, and that bullet's conclusion still holds, because `recover_session` is a page command.
- **N-e: doc comments still name only two commands.** These are [R] commands.rs:17-20 and :126-128, page.rs:15-24 and :216, and lib.rs:13-18. They are the worker's to update in Part 1.
- **N-f: the remaining open questions are lead-data's.** The ruling's three recover tests, the question of whether E-RECOVER gains a step, and the pool poll for a recovered name are for lead-data's amendment. ADR-037's Proof bullet is not amended.

## PART B: the posture answer (ADV-2026-11-27-37 item 3, under ADV-2026-11-26-18 item 3), for the form as it stands

**In so many words: I cannot say that the piece makes no change to the security posture.**

It changes no security mechanism. It does widen what the page may call, including one removal of data on disk that only the handler list stands between the page and. docs/09, ADR-020 with its Amendment 1, and ADR-027 do not say whether such a widening is a change of posture. By ADV-2026-11-26-18, until the human answers, it is treated as theirs. So this goes to the advisor at once, as item 3 says.

1. **The three commands and their handlers.**
   - Part 1 registers them in the handler list ([R] lib.rs:616-639 is the list today; [M] form :2034-2039 and T-1 at :287).
   - They are SKP class-A rows in the console registry, read by `surfaceCompleteness.test.ts` ([M] form :2053). That is ADR-027 decision 4 met as declared ([M] `docs/adr/ADR-027-action-console-and-display-truth.md:38-45`).
   - None of them uses a grant. In the shell, grants gate only the publish handlers ([R] commands.rs:442, :578, :695).
   - The open in `recover_session`'s null arm goes the same route as `open_dataset` ([C1] skp.rs:1108-1112, `begin_open` and `open_under` at :1118 and :1139), so no check is bypassed.
   - No path crosses the wire: the reply carries a file name only ([M] form :110). The path comes from the record's own `locations.json`, which the app wrote ([M] form :83, §2.5 :130-131).
   - The page already opens any path it names (`open_dataset`). So the recover open adds no reach.
   - `list_recoverable(null)` gives the page each non-live record's name, file name, time, step count and data state ([M] form :99-103). The page had none of this before.
2. **What `discard_recoverable` removes, and at whose word.**
   - It validates the name: `unsaved-` plus 32 hex, or 32 hex ([M] form :67).
   - It refuses a record this run holds, and refuses on `WouldBlock`.
   - Then, under the record's lock, it removes `history.jsonl` and `locations.json` and removes the folder ([M] form :91, :1098). This mirrors `end_session`, whose removal uses `remove_dir`, not `remove_dir_all` ([C1] `kernel/src/session_history.rs:444-446`).
   - The folders are under the per-user `spatial-ide/sessions` ([C1] session_history.rs:254-256).
   - `end_session` never touches a record another run left ([C1] :437-438). `discard_recoverable` is the first path that removes records other runs left.
   - The decision that declining clears the record is ADR-036 §9's, which is accepted ([M] `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:206`).
   - In the product, the word is the user's Discard click ([M] form :145).
   - At the binding, nothing but the handler list gates the command, and a record name authorises nothing ([M] form :184). So any script that reaches the page can list every non-live record and then discard each one.
   - docs/09 and ADR-020 already make that the reach of a script on the page: the CSP is null ([M] `docs/09_Security_and_Privacy.md:40-43`; [M] ADR-020:107-113).
   - This new removal is narrower than a write the page already holds. `save_project` takes a page-supplied `folder` ([C1] `protocol/skp/src/v0/commands.rs:710-716`) and replaces `project.spatial` whole ([R] ADR-037:76).
   - The form names no session-log line for a discard, and no ADR-006 class for it. docs/09's posture says every action is attributable and logged ([M] docs/09:5). I did not check whether the shell's existing commands each log a line, so I do not claim this is a new gap.
3. **The files under `capabilities/`.**
   - `default.json` is the same at [C1] and [R] (:1-11: window `main` :5; `core:default`, `opener:default`, `dialog:default` :7-9).
   - Part 1's files include nothing under `capabilities/`, no `tauri.conf.json` and no `Cargo.lock` ([M] form :207-219, :2024). §8 item 6 forbids editing a manifest or `Cargo.lock` ([M] form :334).
   - **But that file does not gate app commands in this shell.** Tauri checks the ACL for an app command from a local origin only when the app has an ACL manifest. Tauri 2.11.5 does this at `src/webview/mod.rs:1819-1852`. tauri-build 2.6.3 registers that manifest only when the app defines permissions (`src/acl.rs:403-413`), and tauri-utils 2.9.3's check is at `src/acl/mod.rs:348-350`. All three are under D:/caches/cargo-registry/src/index.crates.io-1949cf8c6b5b557f/, and the versions are from [C1] `frontends/shell/src-tauri/Cargo.lock` :4476-4477, :4527-4528, :4720-4721.
   - The shell's `build.rs` is a bare `tauri_build::build()` ([C1] build.rs:4-6), and neither tree has a `permissions/` folder (I checked by glob).
   - So the handler list is the whole boundary on what the page may call, and "capabilities unchanged" proves nothing either way about the three commands.
4. **What stays unchanged.**
   - No network, no listening socket and no data-plane change: docs/09 :30-39 and ADR-020's mechanism ([M] ADR-020 Amendment 1 (c), :403-405).
   - No origin selection and no CSP change.
   - No grant or class-3 path is touched ([M] docs/09:21, :28).
   - Part 1 does not edit the page-load closure that ADR-020 Amendment 1 registers ([M] ADR-020:314-324); B's `Started` arm stays as B has it.

Files read:
- C:/dev/spatial-ide/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md
- C:/dev/spatial-ide/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-part-1-against-the-c1-head-and-b-architect-read.md
- C:/dev/spatial-ide/docs/09_Security_and_Privacy.md
- C:/dev/spatial-ide/docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md
- C:/dev/spatial-ide/docs/adr/ADR-027-action-console-and-display-truth.md
- C:/dev/spatial-ide/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (by search)
- D:/wt/reload/docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md
- D:/wt/reload/frontends/shell/src-tauri/src/page.rs, commands.rs, lib.rs, capabilities/default.json, build.rs (by glob)
- D:/wt/c1rd/frontends/shell/src-tauri/capabilities/default.json, build.rs, tauri.conf.json, Cargo.lock
- D:/wt/c1rd/kernel/src/session_history.rs, kernel/src/skp.rs, protocol/skp/src/v0/commands.rs
- D:/caches/cargo-registry/src/index.crates.io-1949cf8c6b5b557f/tauri-2.11.5/src/webview/mod.rs, src/ipc/authority.rs; tauri-build-2.6.3/src/acl.rs; tauri-utils-2.9.3/src/acl/mod.rs
