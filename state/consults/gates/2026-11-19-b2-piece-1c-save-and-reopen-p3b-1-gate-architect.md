Reviewed: PR #339 at 70335c37eacc479347f811f6332ab197c3cec593 (the custodian's filing note, 2026-11-19: the architect's gate of P3b-1; Read 23, Grep 28, Glob 1, SubagentHandback 1, one errored, model claude-opus-5-5, from 2026-11-19T17:37:40Z to 17:46:22Z by its transcript; the report below byte for byte from its hand-back of 13199 bytes, sha256 6a9743360844ca5b0cbeab7f5146647e607dccd784aa1f5fc4f2d885281d04ac, nothing masked by the custodian, with this note in its first line and one final newline), gate, architect, attempt 1
Gate: PR #339, b2-piece-1c-save-and-reopen P3b-1, architect, at 70335c37eacc479347f811f6332ab197c3cec593 (cut/b2-piece-1c-p3b-1 @ 70335c37eacc479347f811f6332ab197c3cec593)

Verdict: PASS WITH NOTES

The verdict rests on the code. Correctness has no blocking finding. Evidence has four items that must be in the record before the merge (section E). Five documentation findings are must-fix (section D). Four of them are untrue clauses and go to the advisor. I give them without new wording, as the brief asks. None blocks, so the wording-blocks rule does not apply. Code cites are to the worktree at H. Rulings are cited by id and item, and the form by amendment and item.

## 1. The lock order (Amendment 44 item 3 (c))

Every place that takes the `saved` mutex, with what it holds at that moment:

- **`Projects::save`** (kernel/src/project/mod.rs:290)
  - Holds: no lock. The caller `save_project` holds only an `Arc<Dataset>` (mod.rs:417-421).
  - Under the mutex, in order:
    - `catalog().get` takes the catalog's `RwLock` read and releases it inside `Catalog::get`, which returns a cloned `Arc` (kernel/src/lib.rs:238-240);
    - `require_live` takes the `GenerationRegistry`'s inner mutex and releases it (kernel/src/skp.rs:602-614);
    - then the recorder's `state` mutex, through `dataset_uri` (mod.rs:308) and through `history` → `adopt_project` / `mark_saved_here` (session_history.rs:281, 356, 415).
- **`Projects::release_ended`** (mod.rs:246)
  - Holds: no lock. `host.catalog()` and `host.generations()` are `Arc` clones, not guards (skp.rs:1083-1104).
  - Under the mutex: the catalog read, then the generations mutex, each released inside its call (mod.rs:249-251). Then `retain` drops `ProjectLock`s, which is a file unlock (store.rs:255-259).
- **`Projects::open_project`** (mod.rs:816)
  - Holds: no mutex. `ds` is dropped at mod.rs:803, and `recorder.reopened` has released `state` at mod.rs:815. It holds the `ProjectLock` file lock (non-blocking) and the `OpenGuard`, which is not a lock (skp.rs:975-984).

The other edges:

- `SkpHost::close_dataset` holds the catalog write and then takes the generations (skp.rs:1650-1658): catalog → generations.
- `record_step` takes catalog → generations → `state`, each released before the next (session_history.rs:293-306).
- Nothing takes `saved` while it holds the catalog, the generations or `state`.

The graph is saved → catalog → generations, plus saved → state, with no reverse edge, so it cannot deadlock. The comment at mod.rs:287-289 is true. It does not name the saved → state edge (note N-1).

## 2. The hand-off (ADV-2026-11-19-28 item 2 (f))

Item 2 (a) holds:

- commands.rs:138 runs the host's close.
- commands.rs:139-141 then `std::thread::spawn(move || projects.release_ended())`, without a join.
- The managed state type `Option<Arc<Projects>>` is the one lib.rs:457-462 manages. The seam is written against the real interface.

**Nothing relies on the lock being free when `close_dataset` replies:**

- The shell does not wait for the close: `void closeDataset(resource).catch(() => {})` (frontends/shell/src/App.tsx:1579).
- K-O17 (b) and K-O28 call `release_ended` directly (kernel/tests/project_save.rs:1235, 1266).
- No P3b-1 code reads the lock after a close.

**Against docs/01's never-block rule:**

- The main thread no longer waits on `saved`.
- No sync command takes `saved` any more.
- `save_project` runs on `spawn_blocking`.

The hand-off is sound.

**What the docs name.** Item 2 (b)'s three facts are true. Each lands in the docs at commands.rs:118-124 and mod.rs:238-242. Two clause gaps are in section D (D-4 and D-5).

## 3. ADV-2026-11-19-23 item 7

`Projects::save` has one product caller, `Projects::save_project` (mod.rs:425). I found no other caller in kernel/src, src-tauri/src or protocol. The check under the mutex (mod.rs:290-297) now refuses a closed or ended open from any caller before "first" is decided (mod.rs:298-300). The question is closed by construction. K-O28 shows it through direct calls.

## 4. The release's design

**What it frees.** `open = catalog.get(name).is_some() && require_live(..).is_ok()` (mod.rs:249-251).

- It frees exactly the entries whose open is not in the catalog, or whose session has ended. Through `closing`, that includes an open whose close has begun (skp.rs:608-610).
- It keeps every open that is in the catalog and live.
- Entries are pushed only after an open is live (mod.rs:391, 817), so an open mid-admission cannot be swept.
- A late spawned sweep cannot drop a new reopen's entry, because catalog names are minted once per open.

**The remaining window.** It is named truly as far as it goes. Saves are now serialised under `saved`, so a save can no longer write after the release. `record_step` is the only writer left that linearises at `require_live` (skp.rs:1683-1687) and takes no `saved` lock.

The doc names the session-end case only. The same window follows a close: a `record_step` past session_history.rs:298 when `close_dataset` begins. That is D-4.

**Is it the form's to accept?** Yes. Amendment 43 item 6 names it for the source comment as timing inside one request. Amendment 44 item 2 keeps it as what is left, and ADV-2026-11-19-23 item 4 accepted item 6.

## 5. The lineage reader's two refusals

- **They are the form's:** Amendment 43 item 7 (a), packet items P-5 (a) (ii) and P-9 (c) (ii).
- **`Unreadable`** replaces `Damaged { line: 0 }` (session_history.rs:1785-1787). On Linux, the directory case reaches it through `read_to_end` failing with EISDIR (session_history.rs:1807).
- **`ThroughLink`.** The test `symlink_metadata(path).is_ok_and(|m| m.is_symlink())` (session_history.rs:1788) is the same test as `check_inside`'s `m.is_symlink()` (resolver.rs:172-176).
  - It is applied at the final name only, as the form says.
  - A metadata error falls through to `File::open`, which gives `Absent` or `Unreadable`. `check_inside` instead refuses with `Unresolvable`, and its walk covers every segment. The difference is sound.
- **Nothing persisted changes.** `LineageRefused` derives no serde. The reader opens read-only. The `Display` text stays in the kernel; at P3b-2 the wire carries `{reason: unreadable}` with no text.

## 6. The doc words, clause by clause at H

**Matched to their sources:**

- **Fence 1 (D4)**, commands.rs:172-173: equal to ADV-2026-11-19-28 item 3 (a), re-wrapped only. True, in the sense that the release runs after the host's close.
- **Fence 2 → 3**, store.rs:227-229: the old sentence is gone and the new one is equal. Each clause is true: the drop at mod.rs:251, the binding at commands.rs:140, and `open_project` at mod.rs:730 before mod.rs:731.
- **Fence 4**, commands.rs:15-16: equal and placed after `serialize`. One clause is untrue (D-3).

**Amendment 43 item 6's words, all true:**

- the module doc, mod.rs:23-26: "next reopen or close" is true, because any close sweeps all entries;
- `_lock`, mod.rs:133-136;
- `save`, mod.rs:270-272.

**The worker's words:**

- The `save` bullet (mod.rs:256-258), `SaveFailure::Open` (mod.rs:193-194) and `open_project` step 3 (mod.rs:640-642) are true.
- The `lineage_file` doc (session_history.rs:1780-1781) and the `LineageRefused` docs and `Display` texts are true.
- The `no_generation` module doc (lines 13-15, 65-66) is true against store.rs:241-252: the file is created when absent, never truncated, never written.
- The `release_ended` doc (mod.rs:236-244): see D-4.
- The `close_dataset` doc (commands.rs:118-124): see D-5.

## 7. Scope and the not-covered rows

- **`pub` items** equal Amendment 44 item 7: `Projects::release_ended`, `LineageRefused::Unreadable`, `LineageRefused::ThroughLink` and `SaveFailure::Open`.
  - `release_ended` has two product callers: commands.rs:140 and mod.rs:730.
  - `SaveFailure::Open` is consumed at mod.rs:1022.
  - The two lineage variants are pre-committed, with P3b-2's mapping named and gated as their consumer (Amendment 43 item 12).
- **Paths:** seven, matching Amendment 43 item 7 (a) plus store.rs (Amendment 46 item 3 (b)).
- **Undeclared behaviour:** none found. A save of an open closed between the command's checks and the mutex is now refused where the base saved it. That is declared (Amendment 44 item 2).
- **Amendment 46 item 2 (d):** the first clause is true. The second is untrue (D-1).
- **Amendment 46 item 4:** the arm is named as not covered. Its stated condition is wrong (D-2).

## Findings

### Blocking

None.

### D. Must-fix before the merge (documentation and record)

- **D-1, to the advisor.**
  - Text: ADV-2026-11-19-28 item 2 (d), carried by Amendment 46 item 2 (d): "P4's suites are the first to run it".
  - Untrue. App.tsx:1579 closes a replaced handle through the shipped binding. `frontends/shell/e2e/project.mjs` (E-SAVE, the second admission at line 348) and `e2e/selection.mjs` (E-ASK, lines 674-676) already run `close_dataset`, so they run the hand-off.
  - What holds: none of them asserts its effect. E-SECOND and E-CRASH-UNLOCK are the first to assert it.
- **D-2, to the advisor.**
  - Text: ADV-2026-11-19-28 item 4, carried by Amendment 46 item 4: "Reaching it needs a release between the command's own checks and the mutex".
  - Untrue as a necessary condition. `release_ended` changes neither the catalog nor the generations. The arm `SaveFailure::Open(e) => e` is reached by a `close_dataset` or a session end between mod.rs:417-421 and mod.rs:290-297, with no release needed.
  - The window is also not only microseconds: a save that waits on `saved` behind another save waits for that save's IO.
  - The arm's outcome is correct either way: it passes through the host's own code.
- **D-3, to the advisor.**
  - Text: fence 4 at commands.rs:15: "`close_dataset` alone starts a second call".
  - Untrue in the shipped build. `binding_publish_prepare` (commands.rs:355-461) makes several calls: the catalog `get`, the dialog, `publish::bundled_viewer`, then `with_registered_cancel` around `spawn_blocking` of `prepare_with_progress`.
  - Dev and measure builds only, named and not blocking: `open_dataset`'s pool-poll `start` (commands.rs:71-76).
  - The base sentence it qualifies was already untrue for `binding_publish_*`.
- **D-4, to the advisor.**
  - Text: the last sentence of `release_ended`'s doc, mod.rs:242-244 (the worker's words). It names "before the session ended" only.
  - The same window follows a close. Timing inside one request; it should be named in the source comment.
- **D-5, to the advisor.**
  - Text: `close_dataset`'s doc, commands.rs:118: "is started on a thread of its own".
  - Untrue when `Projects` is `None` (commands.rs:139).
  - Named and not blocking: "for as long as that save takes" leaves out the spawned thread's start and any other holder of `saved`, such as another sweep or `open_project`'s push. Each is timing inside one round trip.
- **D-6, record.** Under Amendment 46 item 6, src-tauri stands at 27 against a ceiling of 25: an overrun of 2.
  - The closing amendment records it as class 8. The ceiling line is not edited.
  - Kernel product is 90 of 95, kernel tests 234 of 240, and the total 351 of 360.

### E. Evidence for the closing amendment, before the merge (not failures at this gate)

- **E-1.** One E-SAVE run at the final candidate (Amendment 43 item 16). It is not among the facts given. Per D-1, it also runs the hand-off.
- **E-2.** ADV-2026-11-19-28 item 7 asks for K-O26's two mutations to be rerun at the head. The facts give the second only.
  - The first mutation, K-O17 (b), L8, L9 and K-O28 were observed at 4bffa2b7.
  - The reviewer shows by git that `4bffa2b7..ff6bd07c` changes only comments under kernel/src, or the runs are repeated.
- **E-3.** CI on three platforms, L9 off Windows included. Its mutation off Windows was not observed (stop report 2). Stop 6 applies on any red.
- **E-4.** The seam close_dataset → `release_ended` has no end-to-end test before P4, which Amendment 46 item 2 (d) rules. The node stays not done until E-SECOND passes on main (Amendment 43 item 12, R2 (c)).

### Notes

- **N-1.** The lock-order comment could name the saved → recorder `state` edge. It is true as written.
- **N-2.** `release_ended` frees `ProjectLock`s and may drop the last `Arc<Dataset>` clone under `saved`. This happens off the main thread. A pool shutdown would delay saves only.
- **N-3.** `std::thread::spawn` panics on the main thread if the OS refuses a thread. `thread::Builder::spawn` with the error ignored would degrade to "freed at the next reopen or close". This is ruled; noted for P3b-2.
- **N-4, for P4's form.**
  - E-SECOND must not assume the lock is free at the close's reply: it should poll, bounded.
  - The shell replaces a handle by opening the new one before it closes the old one (selection.mjs:646). So a reopen in the same window of the project that is open is refused as `OpenElsewhere` by `open_project`'s own sweep. P4 decides the order.
- **N-5.** L9's test covers the final name only, as the form says. A link at `.spatial` is followed, and the gap between the check and the open is a race. Both are timing or out of scope; named here.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
