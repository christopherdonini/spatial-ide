Reviewed: PR #280 at bbb786e42c39396647ab0e8f282ca7d1943b463d (base 13e6dfbd), gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/open-dataset-close-serialised-under-the-catalog-lock @ bbb786e42c39396647ab0e8f282ca7d1943b463d. All line cites are to that commit (the worktree C:/dev/wt/odcl); cites to base are to main.

I have no shell, so I computed no sha256, ran no diff or numstat, and ran no test. The size, the CI run, the mutation runs and the regression passes are taken from the worker's report as the custodian checked it (`state/consults/2026-11-04-open-dataset-close-serialised-under-the-catalog-lock-worker-report.md`, line 3). I left no background shell.

## Findings

**Correctness: none. Evidence: none.**

**Documentation. Each must be fixed before the merge, with no re-gate.** None of these sentences is the human's wording. Under AUTONOMY §31, the worker applies my words and the PR body lists them.

**D1. The SKP-V0 source comment overstates which steps are serialised.** At `protocol/skp/SKP-V0.md:55` the clause "so a close lands wholly before the check or wholly after the insert" is not true of a whole close.
- Only steps 3 and 4 run under the write guard (`kernel/src/skp.rs:1626-1636`).
- The close's step 0 (`:1603-1608`), its `unknown_dataset` check (`:1609`, a read guard that can be held alongside the open's), `begin_close` (`:1620`) and `cancel_all_for_dataset` (`:1622`) can all run between the open's check (`:1262`/`:1306`) and its insert (`:1274-1283`/`:1316-1325`).
- That is exactly the interleaving OPEN-3 (a) discloses, so the sentence contradicts the form's own disclosure.
- Why this does not block: no ordinary use can reach the case, which needs a close landing inside one open's round trip on a handle the client does not have yet. §31 says such a case does not block and is recorded in the source comment, which these words do. If the case is read instead as an unsupported guarantee claim (the 2026-10-05 directive, section 2), the remedy is the same words with no re-gate.
- The human's sentence on line 54 is unchanged and stays true.

Replacement for the whole of line 55:
`<!-- The refusal above is made in SkpHost::open_dataset's Watching and ChecksOnly arms, at one check under the catalog's read guard, held through the mint and the OpenRecord's insert; close_dataset holds the catalog's write guard across forget_dataset and the name's removal, so those two steps land wholly before the check or wholly after the insert. A close's earlier steps (its OpenRecord removal, its unknown_dataset check, begin_close and the ticket cancel) can run between the check and the insert; the OpenRecord removal after the name's removal drops a record inserted then. None of these interleavings is reachable in the shipped app: the handle is minted from the OS CSPRNG and returned only by this open, and Catalog::names has no product caller. -->`

Clause check against the head:
- **Both arms, one check, read guard held through the mint and the insert:** `:1261-1284` and `:1305-1326`.
- **The write guard spans forget and remove:** `:1626-1636`.
- **"Those two steps land wholly before or after":** the `RwLock` keeps the write guard at `:1627` out while either read guard is held.
- **The earlier steps can run in between:** at `:1603-1622` the close takes the `watches` lock, a read guard through `Catalog::get`, the generations lock and the ticket registry. None of these needs the write guard.
- **The removal after the name's removal drops a record inserted then:** `:1643-1648`, shown by the new test and M1.
- **Not reachable in the shipped app:**
  - the handle comes from `getrandom::fill` (`protocol/skp/src/v0/handles.rs:21`) and is minted at `:1120`;
  - it is returned at `:1330-1333`, and on a refusal in this open's own error field (`:1266`, `:1309`);
  - a grep finds no product caller of `.names()` on `Catalog`. The hits are in test code, `kernel/tests`, and a projection's own method at `kernel/src/publish/mod.rs:530`.

The line count does not change, because the comment is one line.

**D2. The admission comment has the same overclaim.** At `kernel/src/skp.rs:1197-1198`: "so a `close_dataset` lands wholly before the check or wholly after the insert." This is the worker's wording. Replace the sentence that runs from "Past the signal refusal" (`:1194`) to `:1198` with the following, wrapped at 100 columns:
"Past the signal refusal each arm also holds the catalog's read guard, from its check that the catalog holds the name through the mint and the record's insert (lock order: latch, then the catalog's read guard, then generations or `watches`), so `close_dataset`'s `forget_dataset` and removal of the name, under its write guard, land wholly before the check or wholly after the insert; its earlier steps can run in between, and its record removal after step 4 drops a record inserted then."
The clause check is D1's. The edit adds about two lines; the closing amendment states the final figure (class 6 is already recorded).

**D3. The form's Change line has the same overclaim.** Its serialisation clause ("so a close lands …") says the same thing. The form is append-only, so the fix is one line in the closing amendment, which is references only:
"The Change line's serialisation clause is read as the close's steps 3 and 4 (`forget_dataset` and the name's removal), by gate 1's architect report, D3."

**D4. M-T2's label differs from the form.** At `kernel/src/skp.rs:5071` it reads `OBSERVED MUTATION (M-T2, not registered)`, but the form's Tests+mutation line puts each observed mutation in a `RECORDED MUTATION:` doc line.
- Replace the word `OBSERVED` with `RECORDED`. The line length is unchanged.
- Clause check: the line names its mutation and the commit d95baf4d. Under the mutation T2 passed and T1 failed at `the close removed the record`, which matches the worker report's lines 130-131. "Not registered" matches the form.

**Notes (no fix owed):**
- **N1. The sink still logs in OPEN-3's interleaving.** In that interleaving the sink's stderr line (`:1167`) still prints before `end_generation`. The form's "writes nothing and emits nothing" refers to `invalidate` and the event, so it stays true. The case is unreachable.
- **N2. A worker-report sentence is wider than its run.** The report on main says "no other test failed" for M1 (line 129) about a run that filtered out 144 tests. The record line in code does not repeat it. The closing record should not carry that sentence beyond that run.

## Ruling on OPEN-1: (C) stands; the write from the drop point is accepted as evidence

- **The test writes a state the product can reach.** It puts an `OpenRecord` of the product's own type into the product's own `watches` map, for the closing name, between step 0 and the write guard. In that window a product admission that has passed its check can insert its record, because it holds only the read guard (`:1261-1284`, against `:1603-1627`). This is the shape the code actually has, not an imagined one.
- **It is driven through the real close and the real drop point.** It uses `StreamRegistry::mint` and `cancel_all_for_dataset`, in the same shape as CR2 (`:4556-4558`).
- **Close-races' binding conditions hold** (`governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, §4 and §8 item 3): no sleep, no spawned thread, no timeout, no test-only `pub` item, hook or `cfg(test)` branch in product code. §4 (iv)'s "read" describes that piece's own tests; it does not forbid an in-crate write that reproduces a reachable state.
- **The test discriminates.** M1 fails it at its named assertion (d95baf4d).
- **What it proves:** `close_dataset` removes, before it returns, an `OpenRecord` for the name that appeared after step 0, and drops that record's watch. That is the close half of W3.
- **What it does not prove:**
  - W1, W2, and W3's open half (that the insert precedes the removal after step 4). These are proven by reading, below.
  - Where the removal after step 4 sits relative to the write guard. The test passes under OPEN-3 (a) and (b) alike.
  - That the record is dropped after `watches`' guard is released (`FlagWatch`'s drop takes no lock).
  - Anything about generations, or about the shipped app.

## Checks

**1.** See the ruling above.

**2. The proof by reading.**
- **The locks:**
  - L, the latch: taken at `:1201`/`:1288`.
  - C, the catalog: read at `:1261`/`:1305` in the open, write at `:1627` in the close.
  - G, the generations registry: taken at `:1270`/`:1312` in the open and at `:1632` in the close.
  - W, `watches`: taken at `:1274`/`:1316`.
- **The order is acyclic: L, then C, then G or W.**
  - The close never takes L.
  - The sink drops L before G (`:1153`).
  - Every product user of the catalog takes C alone: the close's step 0 releases W before `Catalog::get` (`:1603-1609`), and `describe` takes C and releases it before W (`:1338-1345`).
  - The `lib.rs` helpers are private and are called from a child module (`kernel/src/lib.rs:163-168`).
- **Placement constraint 1 holds:** the read guard is taken after `resolves_unchanged` (`:1216`) and after both signal refusals (`:1217-1252`, `:1294-1302`).
- **Placement constraint 2 holds:** `cancel_all_for_dataset` (`:1622`) runs before the write guard.
- **Placement constraint 3 holds:** each arm takes one read guard and checks with the guard's own `contains_key`. Nothing inside that section takes C.
- **Drops after release:** the removed `Arc<Dataset>` is dropped after the block releases the guard (`:1626-1639`), and the late record after `watches`' temporary guard (`:1643-1648`).
- **W1 is closed:** the check and the mint both sit inside one read section, and forget sits inside the write section.
  - R-M2 (the check outside the guard) lets the write section fit between the check and the guard, so the open mints for a removed name: W1 reopens.
  - R-M3 (the write guard released between forget and remove) lets the open's whole section run after forget, leaving a live generation: W1 reopens.
- **W2 is closed** by `:1305-1310`. R-M4 (that check deleted) mints and inserts after a completed write section: W2 reopens.
- **W3 is closed:**
  - Open half: the insert is inside the read section, so it precedes any later write section and its late removal, and a write section that comes first makes the check refuse.
  - Close half: the test.
  - R-M5 (the guard dropped before the insert) lets the write section and the late removal fit before the insert, which leaves a record: W3 reopens, as note 5 words it.
- **The placement mutation** (the read guard taken before `resolves_unchanged`) puts 5b's inner close, which needs the write guard, on a thread that already holds the read guard. It hangs, as stated. It is not claimed as run.

**3. The guarantees.**
- **Close-races §2c order is kept:** step 0 → check → `begin_close` → cancel → forget → remove, then one appended record removal. The step order matches main (`kernel/src/skp.rs:1579-1605` at base). Nothing is reordered, so §8 item 5 is not hit; the appended step is the declared change, standing under the human's 2026-11-03 direction, item 3.
- **§1 claim (i) now holds in every interleaving:** a mint needs the name present under the read guard, and forget and remove are atomic under the write guard.
- **The source-watcher claim** (`governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md`, line 159, the watch-lifetime paragraph) fails only in OPEN-3's interleaving (step 0 before the insert, the write section after it). There a late `invalidate` writes nothing (close-races §2a item 5; CR4 shows nothing is emitted).
- **ADR-035 Decision 4 and its Note are read, not changed:** both refusals return before `SessionRef::mint` (`:1266` before `:1269`; `:1309` before `:1311`).
- **Security is unchanged:** `DatasetHandle::mint` is untouched (`:1120`).
- **The wire is unchanged:** the only SKP-V0 change is line 55. The refusal uses the existing `SkpError::unknown_dataset`, now also from ChecksOnly (`:1309`).
- **No guarantee changes beyond what the Out-of-scope line declares.**

**4. The SKP-V0 source comment.**
- Line 55 at the head matches note 6's words (I compared them by reading; byte equality is the custodian's script check).
- Its clauses hold except "so a close lands wholly before…": see D1.
- Line 54 is unchanged and true.
- No §8 note is owed: the existing note "open_dataset refuses a name closed during its admission" (`protocol/skp/SKP-V0.md:1132-1134`) still describes the wire.

**5. The five lines, the size and the records.**
- **Scope:** the edits are in `open_dataset`, `close_dataset` (including its step-0 comment and two comments that come with the removal) and the test module. The bodies of T1, T2 and 5b are unchanged against main, read side by side. `GenerationRegistry`, `StreamRegistry`, `viewport_query`, `describe` and the sink are unchanged. `kernel/src/lib.rs`: its helpers read at the head as the form cites them; the file list is the custodian's git check.
- **Change:** holds, except its serialisation clause (D3).
- **Tests+mutation:** the new test exists and asserts what the line says (`:5108-5149`). The regression set passed at the head, per the worker report, lines 135-149.
- **Size:** 161 against the declared 145 is recorded as class 6 with the Scope line not edited. Amendment 1's per-commit attribution against note 1's rows is a sufficient reason. The route is unchanged because both gates run from dispatch. Keeping the piece in the filler slot matches 7a's Amendment 3, third item, and the 2026-10-31 direction's closing paragraph. Both hold. The D2 edit changes the final figure, which the closing amendment states.
- **The docs, clause by clause:**
  - `LatchState`'s doc (`:1002-1012`) is true.
  - The admission comment is true except as D2 states.
  - The close's ordering comments (`:1595-1602`, `:1623-1625`) and the two comments that come with the removal (`:1637-1642`) are true.
  - The new test's doc (`:5096-5106`) is true.
  - 5b's doc (`:5221-5226`) is true: both windows are now closed and shown by reading.
- **The mutation records:**
  - M1 (`:5104-5106`) names its mutation and d95baf4d and claims only the failure that ran.
  - M-T2 (`:5071-5075`) names its mutation and d95baf4d and claims only T2's pass and T1's failure, which both ran (label: D4).
  - R-M2 to R-M5 and the placement mutation are claimed nowhere as observed.
  - No `verify-mutation` run is called an observation.
