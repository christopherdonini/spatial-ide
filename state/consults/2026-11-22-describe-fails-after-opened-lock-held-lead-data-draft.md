*Filed by the custodian: lead-data's draft preregistration for (g) of ADV-2026-11-21-15 item 4 (iii), the project lock or handle left held when describe fails after opened. It read the repository at 08783d07 in a detached read worktree and ran nothing. Its run: Read 42, Grep 21, Glob 5, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T14:48:27Z to 2026-11-22T14:56:52Z by its transcript; 0 calls named the main checkout; no compaction. The report below from its hand-back, 23829 bytes, sha256 2d5d90c3a3b28c38613e28697fc05b645880826abb38dee54fc541ce8afb46be, byte for byte. Its form is not filed yet: its pins take their hashes first, and its OPEN items go to its form gate.*

---

Result: I drafted the full-form preregistration for node (g). The fix lives in the shell: `admitProject` and `admitDataset` close the handle they were given when `describe` fails. The only kernel file is one seam test. No refusal is added on the wire.
Blocking question 1 (OPEN-1): my definition limits my drafts to engine/ and kernel/, but this piece's product change is all in frontends/shell. Does this draft stand as the node's form, and under which path?
Blocking question 2 (OPEN-7): ADV-2026-11-16-06 says it "runs for a week from 2026-11-16". Is its item 2 still in force when this piece is dispatched?
Report path: state/consults/2026-11-22-describe-fails-after-opened-lock-held-lead-data-draft.md
sha256: not computed. I have no hashing tool in this run, so the custodian computes it on filing, over the text below the BEGIN REPORT line.
---BEGIN REPORT---
# The project's lock or handle left held when `describe` fails after `opened`: the shell closes the handle it was given (full form)

- **Path (proposed):** `governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md`. The product change is in frontends/shell, so the form goes under frontends (OPEN-1).
- **Authority:**
  - ADV-2026-11-21-15 item 4 (iii), the advisor's ruling under the human's delegation of 2026-11-13, not the human's words: `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md:24` @ 08783d073376686eba767d5a65bb89675bd40b38. Its words, a sub-line span: "Both moderate in kind: at a reopen the project's lock stays held until the session ends or the app is closed. (g) is rare in reach as read;" and "lead-data drafts each preregistration, and the class is set at the form (a new refusal on the wire makes it full class)". The merge rule is its item 1 (same file `:11`).
  - ADV-2026-11-22-11 item 2, last bullet, likewise the advisor's: `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-11-no-place-under-the-cap-stands-idle-before-the-sitting-a-free-place-starts-the-next-piece-without-asking.md:17` @ 08783d07…, "each is built and gated on its branch now, and its merge request waits for the tag."
  - The PLAN node the custodian names when it is placed (proposed id `describe-fails-after-opened-closes-the-handle`).
  - Reuse index: tools/reuse.mjs in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-22, exit 1. Its output, byte for byte from the brief: `No prior art recorded for "lock held after failed open". Research it before planning an implementation.` The miss is noted here, nothing is ported, and the miss does not block.
- **Drafted by** lead-data, read only, on the custodian's brief, at main 08783d073376686eba767d5a65bb89675bd40b38 (the read worktree). The brief file is evidence only, never Authority. Every `@ 08783d07…` pin is historical. The worker re-derives each cite it touches at the branch base.
- **Hashes.** None is given here. Before commit, the custodian's script adds the sha256 after each pin: the cited whole lines, LF, at the pinned commit.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Form and gating: the full form and both gates**, by ADV-2026-11-16-06 item 2 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25-26` @ 08783d07…). Item 2 (a) lists "a piece that crosses a seam between modules". Two facts make this piece one:
  - its fix works only through the kernel's close-and-release contract (§0.3);
  - its seam test is in kernel/tests.
  Item 2 (b) adds "In doubt, the piece is full." The piece does **not** go full by item 4 (iii)'s ground, because it adds no new refusal on the wire (§1). The class is set at this form (OPEN-5).
- **Merge:** built and gated on its branch now. The merge waits for the v0.2 tag or the human's word (ADV-2026-11-21-15 item 1; ADV-2026-11-22-11 item 3: "No merge of code that ships in the app, and no lockfile change, before the tag."). Before the merge, the branch is checked for changes on main since the gates in every Scope file, and the check is recorded in the closing amendment.
- **Isolation:** its own worktree and build output, apart from the main checkout's (ADV-2026-11-22-11 item 3), recorded in the dispatch record.

## §0. Disclosure

**0.1 The finding, in its own words** (sub-line spans):
- The architect's P4a gate: `state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4a-gate-architect.md:123` @ 08783d07…, "N-2: if `describe` fails after `opened`, `admitProject` never closes the handle, so the project lock stays held. `admitDataset` on main has the same pattern. Ordinary use does not reach it."
- The reviewer's P4a gate: `state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4a-gate-reviewer.md:190` @ 08783d07…, "N4. A `describe` failure after `opened` loses the handle, the same as `admitDataset`'s existing pattern."
- The merge check: `state/consults/merge-checks/PR-341-51fed8a55340.md:24` @ 08783d07…, "the handle left open when describe fails after opened goes to the daily batch with a node proposed".

No pilot, spike or corpus has run. Nothing is measured, and the 5 GB fixture is not used.

**0.2 Where the lock is held** (kernel, read, not changed):
- A reopen keeps its `SavedProject` entry, and with it `_lock`, in `Projects::saved`. It is pushed before the reply is built (`kernel/src/project/mod.rs:870-877` @ 08783d07…).
- `release_ended` drops an entry only when the catalog no longer holds the open or its session has ended (`kernel/src/project/mod.rs:259-266` @ 08783d07…).
- Every `open_project` runs `release_ended` before it takes a lock (`kernel/src/project/mod.rs:780-782` @ 08783d07…).
- The module doc gives the lifetime: until the open is closed or, after its session ends, until the next reopen or close (`kernel/src/project/mod.rs:23-26` @ 08783d07…, paraphrased).
- The shell's `close_dataset` binding closes, then starts `release_ended` on a thread of its own, whatever the close returned (`frontends/shell/src-tauri/src/commands.rs:119-128`, `:142-147` @ 08783d07…).
- So an open whose handle the shell never closes keeps the lock until its session ends or the app exits. In the meantime, a retry of the same reopen is refused as `skp.project_open_elsewhere`.

**0.3 The interfaces as read (the seam rule)**, all @ 08783d07…:
- **Shell, the reopen:** `admitProject` calls `openProject`, then `describeDataset(dataset)`. A typed failure becomes `refused`, any other is rethrown, and nothing closes `dataset` (`frontends/shell/src/project/openProject.ts:62-78`).
- **Shell, a plain open:** `admitDataset` has the same shape after `openDataset` (`frontends/shell/src/admission/admitDataset.ts:56-74`).
- **The client:** `describe` and `closeDataset` are `call("describe" | "close_dataset", { skp, dataset })` (`frontends/shell/src/skp/client.ts:97-99`, `:136-138`). `call` records every command in the Console before it invokes, and turns a rejected `SkpError` into `SkpCallError` (`frontends/shell/src/skp/client.ts:50-72`).
- **The precedent:** the shell already closes with `void closeDataset(resource).catch(() => {})` (`frontends/shell/src/App.tsx:1647`).
- **Kernel `describe`:** it refuses only on the version and on a handle the catalog does not hold (`kernel/src/skp.rs:1361-1366`). It panics only at an `unreachable!` over a closed set (`kernel/src/skp.rs:1412`). The binding calls it synchronously, with no panic catch (`frontends/shell/src-tauri/src/commands.rs:83-88`).
- **The spec:** SKP-V0 §1 says `describe` is "Pure, in-memory, no IO beyond what `Dataset::open` already did, no lease taken, not cancellable" (`protocol/skp/SKP-V0.md:66`, sub-line). Its `close_dataset` paragraph is `protocol/skp/SKP-V0.md:145-153`. §12.2's `opened` carries `dataset: DatasetHandle` (`protocol/skp/SKP-V0.md:1404`). §12.3: "A project is open once at a time within one user's machine store, where its lock is kept" (`protocol/skp/SKP-V0.md:1433`, sub-line).
- **The error envelope:** `SkpError { code, message, fields }`. `unknown_dataset` carries the field `handle` (`protocol/skp/src/v0/error.rs:15-22`, `:64-72`), and `version_unsupported` carries `got` and `supported` (`:50-62`).
- **Already pinned in the kernel:** a closed and released open frees its lock.
  - `kernel/tests/project_save.rs::a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes` (`kernel/tests/project_save.rs:1225-1238`);
  - `kernel/tests/project_reopen.rs::a_reopen_after_a_session_end_in_the_same_process_takes_the_lock` (`kernel/tests/project_reopen.rs:1889-1904`);
  - W-5's `try_lock` check (`kernel/tests/project_reopen_skp.rs:516-539`).

**0.4 Reach, as read.** Each real way `describe` can fail after `opened`:
- (a) `skp.version_unsupported`. Not reachable from the shell, which sends its own constant.
- (b) `skp.unknown_dataset`. It needs the handle closed between the reply and `describe`. No shell code does that: the run awaits in sequence, and the App's close effect closes only workspace resources. If it did happen, that close has already started `release_ended`.
- (c) A panic in the kernel's `describe`. Unreachable by construction.
- (d) A failure in the transport, rethrown untyped. I did not read whether ordinary use can reach it.
- The finding is real in the code, and is reached only by injection: §4's kernel test reproduces it with the real host through (a).
- Out of this node: a panic in `opened_of` after the entry is kept (`kernel/src/project/mod.rs:967-1046`, node (d)); and a webview reload that leaves every handle open (not read).

## §1. What this preregistration may and may not claim

- **May claim:**
  - after an `opened` or an `open_dataset` reply, any failure of `describe` makes the shell send `close_dataset` for that handle before the run ends;
  - for a reopen, this frees the project's lock through the kernel's existing release (§0.2), which the seam test pins.
- **May not claim:**
  - any performance figure or `docs/08` row;
  - that an untyped transport failure is reachable or unreachable (§0.4 (d));
  - that a lock is freed when the close itself cannot reach the kernel.
- **No wire change, no new refusal.** No command, field, code or message changes, and `protocol/` has an empty diff. One existing request, `close_dataset`, is sent in one more case: its reply is dropped, and a refusal of it is dropped.
  - The Console shows that call as a row, since `call` records every command (`frontends/shell/src/skp/client.ts:59`). That is the only change an operator can see, and only after a failed `describe`.
- **Not touched:** no user-visible string, no session-log line, no ADR, no CRS, no persistence format, no dependency, no `Cargo.toml`, lockfile or workflow, no walkthrough row. No kernel or engine product line changes.
- **Portability:** not an OS-dependent feature, so the conditional platform section does not apply.

## §2. The change, stated before it is applied

**2.1 The shell (product):**
- One function in `frontends/shell/src/admission/admitDataset.ts`, exported, with two product callers. Proposed name: `describeOpened(dataset)`.
- It awaits `describe(dataset)`. On any rejection it first awaits `closeDataset(dataset)`, drops any rejection of the close, and then rejects with the **same** error it caught.
- `admitDataset` calls it in place of `describeDataset(dataset)` (`admitDataset.ts:61`), and `admitProject` does the same (`openProject.ts:70`).
- Everything after it is unchanged:
  - the typed refusal is still formatted, bounded (reopen) and logged once with its existing line;
  - the untyped failure is still rethrown;
  - the watchdog's `begin`/`end` stay where they are.
- A sketch, not code to copy:
  ```ts
  export async function describeOpened(dataset: string): Promise<DescribeResponse> {
    try { return await describeDataset(dataset); }
    catch (e) { await closeDataset(dataset).catch(() => {}); throw e; }
  }
  ```
- The doc comments of `admitProject` (`openProject.ts:56-61`), of the file header's first bullet (`openProject.ts:8-10`) and of `admitDataset` (`admitDataset.ts:41-47`) each gain one clause naming the close. These are the worker's words, read by both gates.

**2.2 The kernel:** no product change. One test is added (§4.3).

**2.3 Alternatives not taken:**
- Folding `describe` into the `opened` reply. That is a wire change and a new member, full class, with no gain the close does not give.
- A kernel-side expiry of an unconfirmed reopen's lock. That is new state and a new guarantee.
- Fire-and-forget close (OPEN-3): it would let the refusal show before the close is sent.

**2.4 No retry, sleep, longer timeout or skip** is added to any test.

## §3. Fixtures: pre-declared outcomes

- The kernel test writes F1 through the rig's existing `write_f1` under `std::env::temp_dir()/spatial-ide-project-reopen-skp-tests/<name>` (`kernel/tests/project_reopen_skp.rs:44-50`), as every W-test does.
- Predicted: saved, reopened `opened`, `describe` refused, lock held, then free after the close and release.
- The shell tests need no file. No hash verification applies.

## §4. Tests, and the mutation per new test

**Commits:**
- C1: the new tests alone, no fix. The red runs are recorded byte for byte from the runner's output.
- C2: §2.1's function and its two call sites.
- C3: the doc clauses.

Each commit is named by its full id in the closing amendment.

**4.1 `frontends/shell/src/project/openProject.test.ts`.** The existing client mock (`:16-29`) gains a settable `describe` and a recording `closeDataset`. Each mocked failure uses the real envelope of `protocol/skp/src/v0/error.rs:64-72` (code `skp.unknown_dataset`, its message, field `handle`).
- **S1** `a describe refused after opened closes the opened handle before the refusal returns`. `opened` names `ds_s1` and `describe` throws `SkpCallError`.
  - Outcome: `refused` with that code, closes equal `["ds_s1"]`, and the event order is `describe`, `close`, then the outcome.
  - C1: red at the closes (`[]`). C2: green.
- **S2** `a describe that fails untyped after opened closes the handle and rethrows the same error`. `describe` rejects with a `TypeError`.
  - `admitProject` rejects with that same object, and closes equal `["ds_s2"]`.
  - C1: red at the closes. C2: green.
- **S3** `a close that fails after a refused describe still returns the describe's refusal`. `closeDataset` rejects.
  - The outcome's code and message are the describe refusal's, and one `reopen-refused` log line carries them.
  - C1: red at the close count. C2: green.
- **S4** `an opened reopen whose describe succeeds closes nothing`. A control: green at C1 and C2.

**4.2 `frontends/shell/src/admission/admitDataset.test.ts`.** These mock at `invoke` (`:6-7`), so they check the real request shapes.
- **A1** `a describe refused after open_dataset sends close_dataset for the opened handle and returns the refusal`.
  - The third call is `"close_dataset", { request: { skp: "skp/0.14", dataset: "ds_a1" } }`, the shape of `client.ts:136-138` and SKP-V0 §1.
  - The outcome is `refused` with the describe's code.
  - C1: red (two calls). C2: green.
- **A2** `a describe that fails untyped after open_dataset sends close_dataset and rethrows`. C1: red. C2: green.

**4.3 `kernel/tests/project_reopen_skp.rs`, W-8, the seam pin (from the real shape):**
- **K1** `a_reopen_whose_describe_is_refused_holds_its_lock_until_the_opened_handle_is_closed`. Steps:
  1. `rig.inside()` saves the project, then closes and releases it.
  2. `rig.reopen` gives `opened`, whose `dataset` is decoded as a `DatasetHandle`.
  3. `rig.host.describe(DescribeRequest { skp: "skp/0.0", dataset })` is refused as `skp.version_unsupported`. Of the refusals `SkpHost::describe` gives (§0.3), this is the only one that leaves the handle in the catalog. The test's doc says so.
  4. The control: `ProjectLock::try_lock(&rig.machine, &uri)` is refused as held. This is the finding, with the real kernel.
  5. `rig.close(&handle)`, then `rig.projects.release_ended()`, in the binding's order.
  6. `try_lock` succeeds, and its lock is dropped at once.
- It is green at C1 and at C2. The kernel is unchanged, so it pins the contract the fix rests on and is **not** a red/green test.

**4.4 Mutations.** Each is applied, its test run, its failure recorded by name with the commit, then reverted (round 25's observation wording).
- **M1** (at C2): the close removed from `describeOpened`. Kills S1, S2, S3, A1 and A2.
- **M2** (at C2): the close's rejection not dropped. Kills S3, which gets the close's error and not the describe's refusal.
- **M3** (at C2): `describeOpened` closes on success as well. Kills S4.
- **M4** (at C2): the caught error replaced by a new one before the rethrow. Kills S2 and A2.
- **KM1** (at C2): `release_ended` keeps every entry (`saved.retain(|_| true)` at `kernel/src/project/mod.rs:265`). Kills K1 at step 6, by its message.

**4.5 Suites, green at C3** (three-dot range):
- in `frontends/shell`: `npm run typecheck`, then the two test files, then the whole unit suite;
- `cargo test -p spatial-kernel --test project_reopen_skp`, `cargo fmt --all -- --check`, `cargo clippy -p spatial-kernel --tests`;
- `verify:plan`, `verify:cites`, `verify:quotes`.

Heavy runs go under the machine's holds, as the dispatch brief says.

## §5. Predictions · declared unchanged · invalidators · falsification

**5.1 Predicted:** §4's outcomes as registered. A miss is class 2 and is never edited.

**5.2 Declared unchanged:**
- every wire byte, code and message;
- `protocol/` and every kernel and engine product line;
- `release_ended` and the `close_dataset` binding;
- the refusal shown, its owner place, its bound and its one log line;
- the rethrow of an untyped failure (same object);
- `runAdmitPath`;
- KNOWN-LIMITATIONS item 72 (`KNOWN-LIMITATIONS.md:545-546` @ 08783d07…), whose words stay true.

**5.3 Invalidators** (each a stop, to the custodian):
- any of S1 to S3, A1 or A2 not red at C1 for its own reason;
- K1 not green at C1, which would mean the kernel's contract is not as §0.2 reads;
- a need for a file outside §7, a new string or log line, or any kernel or protocol product change.

**5.4 Falsification:** K1's step 4 finds the lock free. The finding is then not as read.

## §6. Instruments

Every quantity is an assertion: call order, call counts, request shapes, typed codes and lock state. Nothing is timed.

## §7. Declared values and ceilings

- No constant is added.
- **Scope (5 files):**
  - `frontends/shell/src/admission/admitDataset.ts`
  - `frontends/shell/src/project/openProject.ts`
  - `frontends/shell/src/admission/admitDataset.test.ts`
  - `frontends/shell/src/project/openProject.test.ts`
  - `kernel/tests/project_reopen_skp.rs`
- **Line budget:** at most 220 changed lines (insertions plus deletions under §21c's rule, this form excluded), counted by `git diff --numstat origin/main...HEAD --` over the five paths at a named commit. An overrun is class 8, and this line is never edited.
- No owner's-index change. No pointer target changes, and K1 joins no index row unless the custodian asks.

## §8. Block-on-sight

1. Any change under `protocol/`, `engine/`, or `kernel/src/`, or any new code, field or message.
2. A new user-visible string or session-log line.
3. The describe's error replaced, wrapped or reordered with the close's.
4. A close on any path other than a failed `describe` after a handle was returned.
5. Any `Cargo.toml`, lockfile, `package.json`, dependency or workflow edit.
6. A retry, sleep, longer timeout or skip in any test.
7. A red/green claim for K1, or S1 to S3, A1 or A2 lacking their recorded C1 reds.
8. A file outside §7.
9. A merge before the tag without the human's word, or without the check of main.

## §9. Gates

- **Architect, the form's gate:**
  - the seam rule against §0.3, and the class (OPEN-5);
  - `docs/01` principle 7 (the awaited close is one in-memory command, and the release runs off the caller's thread, `commands.rs:142-147`);
  - §8 item by item.
- **Reviewer and architect, the build's gates:**
  - the full diff;
  - each §4.4 mutation observed by name;
  - the C1 reds against their stated reasons;
  - the doc clauses against the code.
- **Suites:** §4.5.
- **Operator:** none. No ordinary path reaches the failure (§0.4).

## §10. Amendments

*(Opens empty; append-only.)*

## OPEN questions, each with its recommendation

- **OPEN-1:** The product change is in frontends/shell, outside the engine/ and kernel/ that lead-data's drafts are limited to. Recommended: the custodian rules whether this draft stands, and the form is filed under `governance/forms/frontends/`.
- **OPEN-2:** Include `admitDataset`? It leaks a handle (catalog entry, watch) but no project lock. Recommended: yes. Node (g) names "lock or handle", and both gates name it.
- **OPEN-3:** Await the close before returning? Recommended: yes, with its rejection dropped. The order is then deterministic and testable, and a quick retry cannot overtake the close.
- **OPEN-4:** Close on an untyped failure too? Recommended: yes, then rethrow the same error.
- **OPEN-5:** The class. Recommended: full, on item 2 (a)'s seam ground and item 2 (b)'s "In doubt". The alternative is a five-line, shell-only piece with K1 dropped, which leaves the seam proven only by the existing kernel tests of §0.3.
- **OPEN-6:** A log line for the close? Recommended: none. The Console row already shows it, and a line would be a new string.
- **OPEN-7:** ADV-2026-11-16-06 "runs for a week from 2026-11-16" (`:13`). Recommended: the custodian confirms that item 2 still governs at dispatch.
---END OF FORM---
Note (lead-data):

What the code does not settle:
- Whether a panic in the synchronous `describe` binding (`commands.rs:83-88`, no catch) makes the shell's invoke reject or never settle. If it never settles, the fix does not reach that case. Not read here.
- Whether a transport failure (§0.4 (d)) can happen in ordinary use. The code does not show.
- Whether (g) is on v0.2's list. ADV-2026-11-21-15 item 6 makes that the human's word.

Reach: real, but only by injection.
- The kernel's `describe` refuses a handle that the catalog still holds only on the version, which the shell never sends wrong (`kernel/src/skp.rs:1361-1366`).
- `skp.unknown_dataset` needs a close that has already started `release_ended`.
- Both P4a gates say ordinary use does not reach it, and I found no path that does.
- K1 reproduces the held lock with the real host through `skp.version_unsupported`, the one real `describe` refusal that keeps the catalog entry. Its control step is the finding.
- A user meets it only as a retry refused with `skp.project_open_elsewhere` after a failed `describe`. No KNOWN-LIMITATIONS item declares it, and with the fix none is needed. Item 72 is unaffected.

The OPENs, in short (each recommendation is in the form):
- 1: the draft is outside my modules; the custodian decides; file it under frontends.
- 2: include admitDataset.
- 3: await the close, dropping its rejection.
- 4: close on untyped failures too.
- 5: full class.
- 6: no log line.
- 7: confirm ADV-2026-11-16-06 is still in force.

For the human: no dependency, lockfile, workflow or wire change, and no new string. Two things are the human's:
- the merge before the tag (ADV-2026-11-21-15 item 1);
- whether (g) joins v0.2.

One visible change goes to the human's notice: after a failed `describe`, the Console shows a `close_dataset` row. Hashes are left for the custodian's script.
