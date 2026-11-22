*Filed by the custodian: lead-data's draft preregistration for (d) of ADV-2026-11-21-15 item 4 (iii), opened_of's four panic sites: a panic while the reopen's opened reply is built leaves the project's lock held and the dataset in the catalog. It read the repository at 08783d07 in a detached read worktree and ran nothing. Its run: Read 34, Grep 41, Glob 6, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T15:00:59Z to 2026-11-22T15:12:02Z by its transcript; 0 calls named the main checkout; no compaction. The report below from its hand-back, 22710 bytes, sha256 f984d107c3ecb249a1a0ce37be9b9195c01e4cec6b18d577f692551bc82bc920, byte for byte, with one final newline added. Its form is not filed yet: its pins take their hashes first, and its OPEN items go to its form gate.*

---

# kernel/src/project/mod.rs: a panic while the reopen's `opened` reply is built frees the project's lock and closes the dataset (node (d), `opened_of`'s four panic sites) — preregistration, full form

**Authority:**
- ADV-2026-11-21-15 item 4 (iii), node (d) (`state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md:24` @ 08783d07). Its words: "(d) is not reachable with a file the reader accepts, by both gates of that part"; "the class is set at the form (a new refusal on the wire makes it full class)"; "(d) carries the reviewer's note on `opened_of`'s doc."
- ADV-2026-11-20-01 item 5 (`state/directives/2026-11-20-advisor-ruling-adv-2026-11-20-01-pr-340s-gate-findings-nine-old-new-pairs-both-gates-take-a-second-attempt.md:110` @ 08783d07). The node is proposed "with both gates' shapes, not placed and not on v0.2's list".
- ADV-2026-11-22-11 item 2, last bullet (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-11-no-place-under-the-cap-stands-idle-before-the-sitting-a-free-place-starts-the-next-piece-without-asking.md:17` @ 08783d07): "each is built and gated on its branch now, and its merge request waits for the tag."
- Carried note: B2-1C form Amendment 53 item 2, second bullet (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:3905` @ 08783d07).
- PLAN node: the custodian names it when placing it (ADV-2026-11-21-15 item 2). Working name: `opened-of-panic-sites-free-the-lock`.
- The reuse index (tools/reuse.mjs in the reuse clone at 89bbac37, 2026-11-22, exit 1) gave, byte for byte:
  `No prior art recorded for "lock held after failed open". Research it before planning an implementation.`
  This form records that miss. Its own research is §0's reading of the code.

**Drafted by:** lead-data, on the custodian's brief, read only in the read worktree at main 08783d073376686eba767d5a65bb89675bd40b38. Every `path:line` below is at 08783d07. The custodian adds span hashes by script, because the drafter had no Bash. Every pin is historical: for the code, the piece's base on main is authoritative.

**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Gating:** full, with both gates (§9). See §1 for why.

**Merge:** the code ships in the app and the piece is not on v0.2's list. Its merge request waits for the tag or for the human's word (ADV-2026-11-21-15 item 1, line 11: "A product piece outside the list may be built and gated on its branch; its merge request waits for the tag or for the human's word, and I tell them when one is ready").

## §0. Disclosure

**Reasoned from code.** Nothing was run.

**The findings, in their own words:**
- The reviewer's P3b-2 gate (`state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-reviewer.md`):
  - :39: "**(i)** None of the four panics can be reached:"
  - :43: "Every file the reader accepts passes through `file.rs`'s `style_document` canonical check and `space()`'s provenance and definition checks before `opened_of` runs. So the canonical round trip, and the closed word sets, hold for any file that reaches it."
  - :45: "**(ii)** If a reply did panic, only a session end followed by `release_ended`, or quitting, would free the lock. This is not a finding, because the panic cannot be reached. Note to the advisor, with a proposed shape: map each of the four to `SkpError::protocol` and release the open's lock before replying."
  - :181: "`opened_of`'s doc clause "with no line" is ambiguous. Clarify it in the same pass."
- The architect's P3b-2 gate (`state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-architect.md`):
  - :21: "**(i) None of the four can be reached with a file the reader accepts.**"
  - :27: "The saved entry and its lock would stay in `Projects`, with the dataset live in the catalog and no handle at the client."
  - :29: "The panics are unreachable, so this is not a finding. One optional hardening: build the reply before pushing the entry. I do not propose it as a change."
  - Its line numbers (966, 980, 1003, 1008) are at ddd74c34. At 08783d07 the same sites are at 972, 986, 1009 and 1014.
- The advisor's merge check (`state/consults/merge-checks/PR-340-231b32cc388b.md:32`) lists, among the cases "Not covered, by name": "`opened_of`'s four panic sites."
- The B2-1C form, Amendment 54 (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:4215`), records: "S-PANIC's words claim no free lock (item 12)".

**The four sites** (`kernel/src/project/mod.rs:967-1046`):
1. `style.expect("a style the reader accepted is canonical")` at :972, on `to_canonical_string` at :971.
2. `serde_json::from_str(&style).expect("canonical JSON is JSON")` at :986.
3. `unreachable!` on an observation word at :1009.
4. `unreachable!` on an admission word at :1014.

**What holds the lock when one of them unwinds** (from :868-887 and :905-913):
- `open_project` has already run `recorder.reopened` (:868-869) and pushed `SavedProject { _lock: lock, .. }` into `Projects::saved` (:870-877). It then returned (:878-887).
- So the `saved` guard, the cancel-key registration (`_end_open_on_drop`, :709) and every other local of `open_project` are dropped before `opened_of` runs (:913). No mutex is held and none is poisoned.
- Three things stay:
  - the entry, which holds the `ProjectLock` (:126-138), an OS file lock freed when it is dropped or when the process ends (`kernel/src/project/store.rs:221-223`, :255-259);
  - the dataset, live in the catalog with its generation and watch;
  - the in-memory history binding (`kernel/src/session_history.rs:392-401`; it writes nothing).
- `release_ended` (:259-266) keeps an entry while the catalog holds its dataset and its session is live. The client never got the handle, so it cannot close it.

**Callers:**
- The shell binding (`frontends/shell/src-tauri/src/commands.rs:214-216`) runs the command on `spawn_blocking`. A panic becomes a `JoinError`, and the binding maps it to `SkpError::protocol("open_project_panicked", …)`, that is `skp.open_project_panicked`. The binding catches the panic; nothing frees the lock.
- The test rig (`kernel/tests/project_reopen_skp.rs:168`) calls the command with no catch.
- The 18 direct `open_project` callers (`kernel/tests/project_reopen.rs`, `kernel/tests/project_lock_crash.rs`, and the one in mod.rs) never call `opened_of`.
- No `panic = "abort"` is set in any `Cargo.toml`, so a panic unwinds.

**Reachability:**
- Sites 3 and 4: the word sets are closed at their sources. `differing_components` pushes only `size`, `mtime`, `footer-length` and `footer-hash` (`engine/src/descriptor.rs:432-451`). `DatasetRef::check` pushes only `crs` and `identity` (`kernel/src/dataset_ref.rs:334-340`).
- Site 1: the reader accepts a style only if it round-trips canonically (`kernel/src/project/file.rs:434-445`).
- Site 2: its input is the canonical writer's output for a fixed-depth document (`renderer/src/style.rs:424-439`).
- No accepted file reaches any of the four. A constructed `Opened`, whose fields are `pub` (`kernel/src/project/mod.rs:535-547`), reaches site 1 (a `Value::Literal(f64::NAN)` opacity gives `CanonicalError::NonFinite`, `renderer/src/canonical.rs:105-108`, :297), site 3 and site 4. Nothing reaches site 2, even then.

**Intake:**

| Item | Disposition |
|---|---|
| The lock and dataset left held after a panic in the `opened` reply | In |
| The reviewer's note on `opened_of`'s doc ("with no line") | In (§2 item 4) |
| Removing the four panics themselves | OPEN-1 |
| (g): the shell closes the handle when `describe` fails after `opened` | Out: its own node and draft; Scope kept disjoint (§8 item 2) |
| S-PANIC's words (`frontends/shell/src/project/reopenNotices.ts:105-106`) | Out: OPEN-3 |

## §1. May and may not claim

**May claim:** when a panic unwinds out of building the `opened` reply, before it leaves `Projects::open_project_command`:
- the catalog no longer holds the reopened dataset;
- `Projects::saved` holds no entry for it;
- the project's open lock is free.

**May not claim:**
- that the four sites cannot panic (under OPEN-1 (A) they stay as assertions);
- anything about a panic elsewhere in `open_project`;
- anything about the shell's notice, any `docs/08` figure, or any platform beyond the ones CI runs.

**Class, in the ruling's own words.** ADV-2026-11-16-06 item 2 (a) (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25`) gives the full form and both gates to "concurrency, cancellation or undo classes". The project lock is a cross-process exclusion, and this piece changes when it is released. Item 2 (b) (:26) ends: "In doubt, the piece is full."

Under OPEN-1 (A) the fix adds no refusal on the wire. The piece is full for the lock, not for the wire.

**After the week.** Item 0 (:13) says the ruling "runs for a week from 2026-11-16". If the build is dispatched after that, `governance/AUTONOMY.md` §21a governs. Its guarantee category ends "or any property currently under test" (:327): the lock's lifetime is under test (W-4's "held" case, `kernel/tests/project_reopen_skp.rs:421-426`; K-O26, by the reviewer's gate :88). §21c's bound also requires "no new user-visible behaviour" (:351), and a reopen that is now not refused after such a panic is new behaviour. The class is the same, full, with both gates to an affirmative PASS (:331).

**Unchanged:**
- The wire: no refusal, code, field or message. SKP-V0 §12 (`protocol/skp/SKP-V0.md:1390-1458`) and `protocol/skp/src/v0/commands.rs:699-869` are untouched.
- Persistence formats: the project file, `folders.json`, `locations.json` and the lineage files.
- Reader checks: `kernel/src/project/file.rs`.
- `open_project`'s body and signature, so the entry is still kept before the reply is built (:870-877).
- The binding, and the operation class. The architect's N-8 (gate :139): "ADR-006: P3b-2 does not change the reopen's operation class."

**Seams.**
- The binding receives the same `JoinError`. The guard runs on the panicking blocking thread during the unwind, before the task's `JoinHandle` resolves, so the lock is free by the time `skp.open_project_panicked` is replied.
- No `pub` item is added and no interface changes, so no end-to-end test is owed. The gate checks this reading.
- (g)'s K1 relies on the entry being kept before the reply is built. That order is unchanged, and the guard acts only during an unwind out of the reply, which K1 does not cause.

## §2. The change (OPEN-1 (A), recommended)

All of it is in `kernel/src/project/mod.rs`:

1. **A private `Projects::reply_of(&self, o: Opened) -> OpenedProject`.**
   - Its product caller is `open_project_command`'s `Reopen::Opened` arm (:913), which now calls it in place of `opened_of(*o)`.
   - It makes a private guard holding `&self` and the handle, calls `opened_of(o)`, and returns the reply.
2. **The guard's `Drop`.** Only when `std::thread::panicking()`, it:
   - closes the dataset through the host, exactly as the existing `close` closure does (:834-837), dropping the result;
   - then calls `self.release_ended()`.

   This is the shell's own close hand-off order (`commands.rs:142-144`), run inline. No lock is held on entry. `release_ended` takes `saved` before the catalog and the generations (:251-252). Nothing else changes.
3. **`open_project_command`'s doc** (:889-893) gains one sentence: a panic while the `opened` reply is built closes the reopened dataset and frees its lock before the panic leaves the call.
4. **`opened_of`'s doc** (:965-966), carrying the reviewer's note. Draft words, not the human's; the reviewer's clause check applies:

   "The `opened` reply: the workspace in its wire form, whole, as the reader accepted it; the view's state; the check's names; and the two lineage facts, with no text of a lineage file's lines and no rule text: a refusal carries a line number where it has one. It panics if the style does not write again as canonical JSON, or if the check names a word the wire has none for. No file the reader accepts reaches either, and [`Projects::reply_of`] closes the dataset and frees the lock if one fires."

   Clause check:
   - "a line number where it has one": `lineage_refusal_of` (:1049-1059): `OverBound` has an optional line, `Damaged` a line, the other two none.
   - "no rule text": `Damaged { line, .. }` drops it (:1055). This matches SKP-V0 §12.2 (`protocol/skp/SKP-V0.md:1424`).
   - "No file the reader accepts reaches either": §0, Reachability.
5. **Portability.** No `cfg`. `File::unlock` and the in-process second-handle refusal are what W-4's "held" case already relies on, on every CI platform. R3 does not engage.

## §3. Fixtures and predicted outcomes

The in-test fixture is F1, written by `spatial_engine::fixture::write_geoparquet` (dev-dependency with `fixture`, `kernel/Cargo.toml:38`). It is saved and closed as `Rig::saved` does (`kernel/tests/project_reopen_skp.rs:133-142`), under a temp folder named for this test alone and removed first. It is generated per run and not hash-verified (disclosed).

| # | Scenario | Base (P0 commit) | After |
|---|---|---|---|
| S1 | reopen, then `check` set to `Differs { observed: ["not-a-wire-word"], admission: [] }`, then `reply_of` | panics; catalog still holds the handle; lock held | panics at site 3; catalog lacks the handle; no entry; lock free |
| S2 | as S1 with `admission: ["not-a-wire-word"]` | as S1 | panics at site 4; same three facts |
| S3 | as S1 with `workspace.style.fill_opacity = Value::Literal(f64::NAN)` | as S1 | panics at site 1; same three facts |
| S4 | reopen, then `reply_of` unmutated | reply; catalog holds; lock held | same |

## §4. Tests, one mutation each

Placement: `kernel/src/project/mod.rs`'s `#[cfg(test)] mod tests`, so the test can reach the private `reply_of` and `saved`.
- The test defines its own watch arm, a `ChecksOnly` stub of about 8 lines, as `kernel/src/skp.rs:2402-2419` does, because that one is private to `skp`.
- No sleep, no spawned thread, no timeout, no test-only hook in product code.
- The panic is caught with `std::panic::catch_unwind(AssertUnwindSafe(..))`.

**P0, before the fix.** Commit 1 adds the tests and `reply_of` as a plain pass-through to `opened_of`, with no guard. K-D1 fails at assertion (ii) of case S1. The run is recorded with its commit id. Commit 2 adds the guard.

**K-D1** `a_panic_while_the_opened_reply_is_built_frees_the_lock_and_closes_the_dataset` (S1 to S3, in order on one rig; each case reopens, which itself proves the previous case freed the lock). In each case it asserts:
- (i) `catch_unwind` is `Err` and its `String` payload contains the site's own message (:1009, :1014, :972);
- (ii) `host.catalog().get(handle)` is `None`;
- (iii) `saved` holds no entry with that dataset;
- (iv) `store::ProjectLock::try_lock(&root, &project)` is `Ok`, and the probe lock is dropped.

Mutations:
- **M1:** empty the guard's `Drop` body. K-D1 fails at (ii).
- **M3:** call only `release_ended`, without the close. K-D1 fails at (ii).
- **M4:** close only, without `release_ended`. K-D1 fails at (iii).

**K-D2** `a_reply_built_without_a_panic_keeps_the_entry_and_the_lock` (S4). Asserts:
- the reply's `dataset` is the handle;
- the catalog holds it;
- `try_lock` is `Err(LockRefused::Held)`.

Mutation **M2:** drop the `thread::panicking()` condition. K-D2 fails at the catalog assertion.

Each mutation is observed by applying it, running the named test, recording the failing assertion and the commit in a `RECORDED MUTATION:` doc line, and reverting. A `verify-mutation` run is not an observation.

**Site 2 has no test.** No accepted file and no constructed `Opened` reaches it. The guard does not depend on the site, and K-D1 shows that for three sites. No interface is invented for it.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions:**
- P0 fails as §4 says.
- K-D1 and K-D2 pass on the fix, and each fails under its mutations as §4 says.
- Every other kernel test passes.

**Declared unchanged:**
- `kernel/tests/project_reopen_skp.rs` W-1 to W-7, W-4's "held" case included;
- `kernel/tests/project_reopen.rs` (K-O26 among them);
- `kernel/tests/project_lock_crash.rs`; `kernel/tests/project_save_skp.rs`;
- `kernel/src/project/mod.rs::tests::each_save_failure_maps_to_its_own_code_with_the_kernels_text`;
- the shell's `openProject.test.ts` S-PANIC row (:92).

**Invalidators:**
- **I1 (stop, to the custodian):** an accepted file reaches a site. It is then reachable and regraded (ADV-2026-11-21-15 item 7).
- **I2 (stop, to the custodian):** the fix needs a refusal, a code or any diff under `protocol/`. That is OPEN-1 (B), full class on the wire, a question.
- **I3 (invalid run):** P0 passes. Recorded as class 2.
- **I4 (stop):** the guard needs a lock held on entry, or a changed lock order.
- **I5 (stop):** a declared-unchanged test fails.
- **I6 (stop):** a `pub` item or test-only hook is needed.

**Falsification:** after such a panic leaves `open_project_command`, the lock is held or the dataset is in the catalog; or a reply built without a panic loses its entry.

## §6. Instruments

Assertions only:
- catalog membership, `saved` membership, `try_lock`'s outcome, and the panic payload;
- `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings

- No new constant.
- Size: at most 240 changed lines, insertions plus deletions, over 1 file (`kernel/src/project/mod.rs`). Estimate: about 40 product and doc lines, about 160 test lines.
- Counting: `git diff --numstat <merge-base>...<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
- An overrun is class 8, and this line is never edited to match.

## §8. Block-on-sight

1. Any diff outside `kernel/src/project/mod.rs`, this form, PLAN and records.
2. Any diff to (g)'s five paths: `frontends/shell/src/admission/admitDataset.ts`, `frontends/shell/src/project/openProject.ts`, their two test files, `kernel/tests/project_reopen_skp.rs`.
3. Any change to the wire, SKP-V0, a persistence format, `file.rs`, `store.rs`, the binding, a lockfile, a dependency or a workflow.
4. `open_project`'s body or signature changed; the entry pushed later than :870-877's place.
5. A new `pub` item; a `cfg(test)` branch in product code; a test-only hook.
6. The guard releasing on a path that is not an unwind; a lock held when the guard runs.
7. A sleep, a thread or a timeout in K-D1 or K-D2; a platform ignore.
8. A declared-unchanged test's assertions edited.
9. A record that calls a `verify-mutation` run an observation; a mutation recorded without its commit.
10. A §7 overrun not recorded as class 8, or §7 edited.
11. Record form: a line cite into `governance/DECISIONS-PENDING.md`; a hash at a branch commit; a bare self-line.
12. A merge before the tag without the human's word; a squash or rebase merge.

## §9. Gates

**Architect** checks:
- docs/01's never-block rule: the guard runs on the blocking thread;
- the lock's lifetime documents (`store.rs:221-223`, `mod.rs:133-136`, `mod.rs:558-560`);
- ADR-006; ADR-018 vocabulary;
- the caller rule (`reply_of`'s caller) and §1's seam reading;
- (g)'s K1 reading;
- §8, item by item.

**Reviewer** checks:
- the full diff;
- P0 and M1 to M4 observed again;
- §7 recounted;
- §2 item 4's clause check.

**Suites, green before either gate:**
- `cargo test --locked -p spatial-kernel` on Windows, inside the machine's holds; `cargo clippy`; `cargo fmt --check`;
- the four verify scripts and `verify:plan`; CI's `node --test` scripts suite;
- the branch's CI, read before gating.

**Operator:** none, since no accepted file reaches the change.

After the merge, lead-data writes the owner's-index pointer (`kernel/README.md`, Project save row).

## §10. Amendments (opens empty, append-only; classes 1 to 9)

---END OF FORM---

**Note (lead-data).**

**Reachability.** No accepted file reaches any of the four sites (§0). A constructed `Opened` after a real reopen reaches sites 1, 3 and 4. Nothing reaches site 2.

**Item 7 does not apply.** (d) is no fault a user meets in ordinary use. No KNOWN-LIMITATIONS item names it, and none is affected (I read items 62 and 72).

**Nothing goes to the human.** No dependency, lockfile, workflow or wire change.

**Not settled from the code:**
- I did not read `SkpHost::close_dataset`'s inner calls for a panic. A second panic inside the guard aborts the process, which still frees the OS lock (`store.rs:221-223`).
- I did not run anything. That S3's NaN reaches site 1 rather than an earlier check is read from `renderer/src/style.rs:434` and `canonical.rs:297`; P0's run proves it.

**OPEN-1, the mechanism.**
- (A) The unwind guard. Recommended: one file, no wire change, any panic in the reply covered, and K1's order kept.
- (B) The reviewer's shape: a typed refusal, then the release. It needs a new code in SKP-V0 §12.4 and `protocol/`, so it is full on the wire. It takes the protocol/ slot, and the shell's notice mapping sits in (g)'s `openProject.ts`.
- (C) The architect's: build the reply before keeping the entry. It changes `open_project`'s public return, which `kernel/tests/project_reopen.rs` pins, and an unwind would still leave the dataset in the catalog.
- Under (A) the four stay as assertions, named in the doc.

**OPEN-2, the test seam.** A private `reply_of` with its tests in mod.rs's `tests` module. Recommend accept: its caller is `open_project_command`, and no test-only caller is added.

**OPEN-3, S-PANIC's words.** S-PANIC (`frontends/shell/src/project/reopenNotices.ts:106`) says the project "may stay held until the application is closed". After (A) that is rarer, but the hedge is still true. Recommend no change here. It is a string the app shows, so it goes to the advisor's list for P6.

**OPEN-4, the doc words** in §2 item 4 are mine, not the human's. Recommend the reviewer's clause check. They go to the advisor only if the custodian reads them as strings the app shows; they are not.

**OPEN-5, the node name and the form's path** are the custodian's. Suggested path: `governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md`.

**(g) overlap: none.** (d) touches only `kernel/src/project/mod.rs` and does not change what K1 relies on.

**Model:** set at dispatch (ADV-2026-11-16-06 item 5 (d)).
