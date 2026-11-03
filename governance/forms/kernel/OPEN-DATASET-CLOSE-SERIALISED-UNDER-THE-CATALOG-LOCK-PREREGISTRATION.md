# kernel: open_dataset's catalog check and mint, in both arms, serialised with close_dataset's forget and removal, and no OpenRecord left after a close — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node open-dataset-close-serialised-under-the-catalog-lock, the filler queue's entry 10 (S3). The size paragraph, the five lines, the notes, the OPEN items, the questions and what is not settled are lead-data's draft (`state/consults/2026-11-01-open-dataset-close-serialised-under-the-catalog-lock-five-line-form-lead-data-draft.md`, read only at main 7591cdad; its sha256 from line 5 is ee31eb1805e654fda4ee36d5d04e2d8e1aa532bffad1abfce46d02c73de04520), carried byte for byte with these changes, all the custodian's: each cite the draft marks `@ 7591cdad`, and each cite on a line before that line's last marker, is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path, or a root file whose bare name other tracked files share, as `path:line` at <commit>, sha256 <hex>; 0 such) (22 pins; 0 by a file name that resolves to one tracked path at that commit; 1 bare line numbers bound to the path written before them; 2 bare line numbers the draft leaves unmarked kept as written; 2 remaining markers given the full commit id); this title and lead line added; the draft's opening paragraph (its read commit and its wording convention) and its last bullet (the report path) dropped; its size paragraph and the line after it kept before the five lines, where the draft put them. Form path: `governance/forms/kernel/OPEN-DATASET-CLOSE-SERIALISED-UNDER-THE-CATALOG-LOCK-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

**Size, settled first (§21c, governance/AUTONOMY.md:349-357 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:c99b2fcabe5d66acf6c904d268db4cb8f1d2451a4429bcba596b0381a2749159).** Whether it fits depends on the evidence route (OPEN-1):
- (C), recommended: about 124 lines in 2 files. It fits, declared at 145.
- (B), proof by reading alone: about 84 lines in 2 files. It fits.
- (A), a threaded test: about 165 lines or more. It does not fit, so (A) means the full form, which is the human's route.

The lines below are written for (C).

```
Authority: PLAN node `open-dataset-close-serialised-under-the-catalog-lock` (governance/PLAN.yaml:3406-3422 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:6306b70e2932530f6394a8c483f5b1b6a721a3859c6fa59bd1991eaeb24d78b0), generation 1, status ready, placed S3 as filler entry 10 by the human's ruling of 2026-10-26 (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:28 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:29ffa859929abdc88814fb420d1d35817e3188e570293533ed60d6505382668c; state/FILLER-QUEUE.md:27 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:24f8c8c1aedc4beb669c518db7ece16dbf123587f547475aa1e09fecfa4a6f93), from the fallback in the human's direction for entry 5b (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:2e61dbb5f344ac1c7d25d5c5295f6cb84911949ee6f96410655cf8ac6c4d8c3b); the filler rule, AUTONOMY §36 (governance/AUTONOMY.md:692 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, §25 (e) set aside; the windows are the ones entry 5b's form leaves open (governance/forms/kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md:10 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:73e0ed1e69aae05b7fd94a9efa3e467106bbdbd352b8e1c0bce8899d2ad67846, and its notes 1 and 3 at :19-45 and :65); the evidence route is OPEN-1's; the reuse index found no prior art for "catalog lock close open race" (exit 1, the read-only private clone at 89bbac37), a miss noted here.
Scope: 2 files: kernel/src/skp.rs (in `SkpHost::open_dataset`, both arms' admission from the check through the `OpenRecord`'s insert, the admission comment and `LatchState`'s lock-order doc; in `SkpHost::close_dataset`, steps 3 and 4 under the catalog's write guard, one record removal after them, and its two ordering comments; in the `#[cfg(test)]` module `ticket_drop_under_lock_regression`, one new test and the doc comments of `a_close_during_open_admission_refuses_the_open_and_mints_no_generation` and `a_close_drops_its_watch_before_it_returns`); protocol/skp/SKP-V0.md (the source comment under §1's `open_dataset` refusal sentence only; the human's sentence is unchanged and §8 gets no note); declared line budget 145 (insertions plus deletions, tests and comments counted, governance/AUTONOMY.md:357 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; kernel/src/lib.rs is not edited (`Catalog`'s existing private `lock_read` and `lock_write` are called from skp.rs); no line of `GenerationRegistry`, `StreamRegistry`, `viewport_query`, `describe` or the sink changes; no existing test's assertions change.
Change: `open_dataset`, in both arms, takes the catalog's read guard after the latch's signal refusal and holds it from a check that the catalog still holds the name (refusing as `skp.unknown_dataset` with the existing constructor, before any mint, the catalog guard and then the latch dropped before the watch) through the mint and the `OpenRecord`'s insert; `close_dataset` holds the catalog's write guard across `forget_dataset` and the name's removal (the removed `Arc<Dataset>` dropped after release), then removes, and drops after release, any `OpenRecord` an admission inserted after its first step; so a close lands wholly before an admission's check or wholly after its insert, and once `close_dataset` returns no generation, record or catalog entry for the name remains.
Tests+mutation: a_record_inserted_during_a_close_is_removed_before_the_close_returns (new, kernel/src/skp.rs, same module: at close-races' drop point, a retired `Pending` ticket's `RunOnDrop` after `cancel_all_for_dataset` releases its guard, the test inserts an `OpenRecord` carrying a `FlagWatch` for the closing name; after `close_dataset` returns `Ok`, the name has no record and that watch's flag is set); M1: delete the record removal after step 4, and it fails at its no-record assertion; observed but not registered, M-T2: delete step 0's `watches` removal, and `a_close_drops_its_watch_before_it_returns` passes (the late removal masks it) while `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` fails at `the close removed the record`, recorded in T2's doc; unchanged and re-run as regression: a_close_during_open_admission_refuses_the_open_and_mints_no_generation, CR1 to CR4, R2, T1, T2, E7, E8; the windows no deterministic seam reaches (W1, W2 and W3's open half) are proven by reading under OPEN-1, each with a reading mutation the form names and the gates check, none claimed as observed; each observed mutation is applied, the test run, the failure recorded with its commit in a `RECORDED MUTATION:` doc line, and reverted.
Out-of-scope: ADR: not touched (ADR-035 Decision 4's mint per successful open and its Note 2026-09-25 are read, not changed: a refused open mints nothing); security: not touched (`DatasetHandle`'s CSPRNG minting is unchanged; no exposure surface); wire: no literal, code, member, message or fixture changes and `skp/0.12` stays; the refusal SKP-V0 §1's existing sentence words now also comes from the ChecksOnly arm, and only its source comment changes; guarantee: touched: `open_dataset`'s admission and the locks `close_dataset` takes change in a function close-races governs (§2c's step order is kept; its last two steps now run under one catalog write guard, and one record removal follows them); close-races §1 claim (i) now holds in every interleaving by reading; the source-watcher form's watch-lifetime claim holds except in W3's interleaving (OPEN-3), which the product cannot reach; the five-line form stands under §36, which sets §25 (e) aside.
```

*The notes, the OPEN items, the questions and what is not settled below are lead-data's from its draft, carried byte for byte except for the pins; where they say I or my, they mean lead-data's. They are this form's reading.*

## Notes (mine)

### 1. Size
| Part | Counted lines (my estimate) |
|---|---|
| `LatchState` lock-order doc, rewritten | about 17 |
| The admission comment at kernel/src/skp.rs:1187-1190 | about 4 |
| Watching arm (5b's check moved under the read guard, two drops) | about 17 |
| ChecksOnly arm (the check, the refusal, the drop) | about 9 |
| `close_dataset` (write section, late removal, two comments) | about 24 |
| New test, its doc and M1 | about 40 |
| 5b test doc (its open-windows sentence) and T2 doc (M-T2) | about 11 |
| SKP-V0 source comment | about 2 |
| **Total** | **about 124, in 2 files** |

- Under (B), drop the test row: about 84, so declare 110.
- Under (A), a threaded open/close loop with joins, invariant checks and its disclosure: about 70 to 90 lines on top of the product 71 and the docs, so 160 or more. That is past §21c.
- An overrun mid-piece is class 6 (docs/PREREGISTRATION-TEMPLATE.md:125-131 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:de5406a708458da2c3def1e4b685acd5dacb5aac5ea87f694d49090f7d6e48c9), and Scope is not edited.

### 2. The windows: all three are still open at 7591cdad94a68ea686c102ec2d76c35125289aa4 after 5b
- **W1: a close's forget between the open's check and its mint.**
  - The open's path: Watching arm, latch at kernel/src/skp.rs:1193 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:00492052e77870b2eb397ec0a83c3b9ad562c1888b3c53fe6b35f43a21899730; `resolves_unchanged` at :1208; 5b's check at :1250, a `Catalog::get` whose read guard is released on return (kernel/src/lib.rs:237-239 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:0b54373cfc76780207b8cc25c168b05c0f46d3f0bbb3e493634ac7c67300fd0c); the mint at kernel/src/skp.rs:1256-1258.
  - The close's path: step 0 at :1579-1584; the check at :1585; `begin_close` at :1596; `cancel_all_for_dataset` at :1598; `forget_dataset` at :1603, which clears `live` and `closing` (:827-837); `catalog.remove` at :1605.
  - Interleaving: check → forget → mint → remove. Afterwards `live` holds a name the catalog lacks. That breaks close-races §1 claim (i) (governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:80 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:e68807f5c7eedba898ef6e755fbc63ccc8fe9fe4549a770ec5764fd9500068ff) and its falsification second bullet (:272). It is 5b's note 1 case O-between-C4-and-C5, made wider.
- **W2: the ChecksOnly arm.**
  - It has no catalog check (kernel/src/skp.rs:1273-1305).
  - A close running after the catalog insert (kernel/src/lib.rs:233) and before the mint (kernel/src/skp.rs:1289-1291) leaves a generation, and then a record (:1294-1303), for a name the catalog no longer holds.
- **W3: the record gap.**
  - Both arms drop the latch (:1260, :1293) before inserting the `OpenRecord` (:1261-1270, :1294-1303), and hold no guard in between.
  - A close running whole in that gap finds no record at step 0, forgets and removes, and the insert then leaves a record (in the Watching arm, an armed watch). The open returns `Ok`.
  - A later close of the name releases it at step 0 and refuses at :1585.
- **Not reachable in the shipped app.**
  - The handle is 16 bytes from the OS CSPRNG (protocol/skp/src/v0/handles.rs:19-23 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:ed8e290352da217b235c32b2b1f4f2ae09144455a5c797ae24cde6a0753cc730), minted inside the open (kernel/src/skp.rs:1116) and returned only on success (:1307-1310).
  - `Catalog::names` (kernel/src/lib.rs:252-254) has no product caller. Its only hits are in the test module (kernel/src/skp.rs:4375, :5082), plus a projection's own `names()` at kernel/src/publish/mod.rs:530.

### 3. The shape and the lock order (OPEN-2)
- **The locks:**
  - L, the per-open latch (:1129);
  - C, the catalog's `RwLock` (kernel/src/lib.rs:128-131), taken only by `Catalog`'s methods (:163-168, :204, :233, :238, :249, :253);
  - G, `GenerationRegistry.inner` (kernel/src/skp.rs:437-439). It is a leaf: its methods never call out;
  - W, `watches` (:1053). A record is always dropped after release (:1579-1584).
- **Today's nestings:** only L→G, at admission. The sink drops L before G and T (:1149, :1170). Every other catalog taker takes C alone and releases it:
  - `describe` (:1315-1318);
  - `viewport_query_resolve` (:1408-1411);
  - `close_dataset` (:1585, :1605);
  - `record_step` (kernel/src/session_history.rs:152-156 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:a0d17cb3058851954b84318068ef185bb01e9d0154a5c6df783b2b8b86579217);
  - `create_from_raw_params` (kernel/src/lib.rs:416-419);
  - the open's refusal paths (kernel/src/skp.rs:1216, :1286), after L is dropped;
  - the shell's `host.catalog().get` calls (frontends/shell/src-tauri/src/commands.rs:296-299 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:8a6587cab96da5029f0236ba89d7c78d7ff298d2fa087959d3ea6311ab3e7f63, frontends/shell/src-tauri/src/commands.rs:548-551 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:8a6587cab96da5029f0236ba89d7c78d7ff298d2fa087959d3ea6311ab3e7f63) and pool_poll.rs:193.
- **S1 (recommended) adds** L→C(read)→G and C(read)→W in the open, and C(write)→G in the close. G and W stay leaves, and nothing takes C while holding G, W or T. So the order is acyclic: L, then C, then G or W.
- **Three placement constraints the gates should check:**
  1. The read guard is taken after `resolves_unchanged` and after the signal refusal. 5b's test runs a real close inside `resolves_unchanged` (:5079-5088). If the open already held C(read) there, the close's C(write) on the same thread would deadlock. The signal refusal also takes C(write) at :1216 and :1286.
  2. The write guard spans only forget and remove, never `cancel_all_for_dataset`. CR2 and E7 run a racing call at that drop point on the close's own thread (:4410-4415, :4504-4517), and `viewport_query` takes C(read).
  3. No thread takes C(read) twice. std's `RwLock` priority policy is OS-dependent, and nothing here relies on it.
- **The removed `Arc<Dataset>`** is dropped after release, in the shape the catalog's own note names (kernel/src/lib.rs:195-196).
- **What changes in a function close-races governs:** §2c's order (governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:138-148 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:6e96f9cdb0a20de6e9e94dbb23c71c93024d56b7ad029c24e00e8c454e45e53d) is kept as the tree has it after the unknown-keeps-openrecord swap. Its last two steps now run under one guard, and a record removal follows them. Its §8 item 5 (:300) is not hit, because nothing is reordered.
- **S2** reorders §2c (remove before forget). The close side shrinks to one moved line, but that is exactly what §8 item 5 names, and it changes §2c's "the name goes last" reading (kernel/src/skp.rs:1604). It still needs the open's read guard and the late removal.
- **S3** puts a `Catalog` method in kernel/src/lib.rs, which `cut/b2-piece-1c-save-and-reopen` edits. Rule (00) would then skip the piece at dispatch until 1c merges.

### 4. The evidence (OPEN-1)
- **No deterministic seam reaches W1 or W2, or W3's open half, at 7591cdad94a68ea686c102ec2d76c35125289aa4.**
  - The only test-run code inside admission is `arm()`, before the insert, and `resolves_unchanged`, before the check.
  - No test code runs between the check and the mint (:1250 to :1256), or between the insert and the ChecksOnly mint, or between :1260 and :1261.
  - The close's only deterministic instant is close-races' drop point (governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:205-209), which comes before forget.
  - The open cannot be aimed at a closing name, because it mints a fresh one.
- **The close half of W3 has one seam:** at that drop point, after step 0 and before the write section, a test can place an `OpenRecord` in `watches` in-crate. That is test (C). It writes private state where close-races' §4 (iv) only reads it (:211), so the gates should rule on it.
- **Precedent for a proof at reading level:** close-races' own may-not-claim for a window with no product interposition point (:88).

### 5. Tests and mutations
- **The new test and M1, M-T2, and the regression set** are as the Tests+mutation line states.
- **Under reading** (named for the gates; none observed):
  - R-M2: 5b's check moved back outside the read guard reopens W1.
  - R-M3: the write guard released between forget and remove reopens W1.
  - R-M4: the ChecksOnly check deleted reopens W2.
  - R-M5: the read guard dropped before the record's insert reopens W3 (the insert can then follow the late removal).
- **Placement:** read guard taken before `resolves_unchanged` hangs 5b's test. It is stated for the gates, not run, because no test has a timeout.
- **Prediction:** 5b's test passes unchanged. Its close runs before the read guard, and the late removal finds nothing.
- **Invalidator:** any other kernel test fails. In particular, a source_watch_ordering test that asserts the watch is dropped before forget.

### 6. What a user sees, and the Platform item
- **The user sees nothing.** Every window is unreachable (note 2). No new string; the existing message is reused (P6).
- **No figure is claimed** for the added guard (docs/08, ADR-018).
- **No KNOWN-LIMITATIONS item exists for this, and none is owed.**
- **Platform:** not an OS-dependent feature, so the template's R3 section (docs/PREREGISTRATION-TEMPLATE.md:177 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0) is not required. The one OS-dependent thing, std's `RwLock` policy, is relied on by nothing (note 3). The kernel suite runs on both L1 entries.
- **SKP-V0's source comment:**
  - Today (protocol/skp/SKP-V0.md:55 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:be57331bd5a4d5555511bf9f5eaedb25cbd2703935c19a43006b6297f14aba08) it states both windows are not refused, so it becomes false.
  - My words for it: `<!-- The refusal above is made in SkpHost::open_dataset's Watching and ChecksOnly arms, at one check under the catalog's read guard, held through the mint and the OpenRecord's insert; close_dataset holds the catalog's write guard across forget_dataset and the name's removal, so a close lands wholly before the check or wholly after the insert. Neither interleaving is reachable in the shipped app: the handle is minted from the OS CSPRNG and returned only by this open, and Catalog::names has no product caller. -->`
  - It is not the human's wording; per 5b's Amendment 1 (:200), it is the reviewer's and the architect's.
  - The human's sentence at :54 stays true and is untouched. I see no §8 note owed (5b's note still describes it), and the gate checks that reading.
- **Owner's index:** no kernel/README.md line is owed by the index rule. The form and the new pin are mine to add after merge.

### 7. Rule (00), path by path
This piece's paths: kernel/src/skp.rs and protocol/skp/SKP-V0.md, plus its form on main.

| In flight | Overlap |
|---|---|
| cut/b2-piece-1c-save-and-reopen | none in its kernel list. Contact only: it edits kernel/src/lib.rs, whose private `lock_read`/`lock_write` this piece calls, so a change there would show up at merge as a compile error. Its 6 non-kernel paths are not given: check protocol/. |
| cut/port-2-macos-l1-and-app-dirs | none in its kernel list; its 11 other paths are not given: check protocol/ |
| cut/b1-shell-half-pr-c | none (0 files) |
| #273, #272, #271 | none under kernel/; their paths are not given: check protocol/ |

Protocol/ has an at-most-one rule, so it has to be confirmed by `git diff --name-only origin/main...<branch>` at dispatch.

## OPEN items (each with my recommendation)
- **OPEN-1: the evidence route.**
  - (A) A threaded test, its nondeterminism disclosed. It fails no mutation by name reliably, breaks close-races' determinism precedent (:203, :296), and goes past §21c, so the full form.
  - (B) Proof by reading alone, at about 84 lines.
  - (C) Proof by reading plus the one deterministic test for W3's close half, at about 124 lines.
  - **I recommend (C).** If the gates refuse a private-state write from the drop point, fall back to (B).
  - **Red line?** Not on the list in state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38, as I read it. But the placed node reserves the choice to the human: its summary at governance/PLAN.yaml:3421 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:a11e7885074aa80818bf72dc5dffc1c07eb7321f029bcea3a32aae44bf70ce32 says "its form settles with the human first". Whether item 4 reaches it is the blocking question below.
- **OPEN-2: the shape.** (S1) the write guard across forget and remove; (S2) §2c reordered; (S3) a `Catalog` method in lib.rs. **I recommend S1.** It changes a stated guarantee, so it comes to the custodian as a question. I do not read it as a red line.
- **OPEN-3: where the late removal sits.**
  - (a) After the write guard's release. The source-watcher claim (governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:159 @ 7591cdad94a68ea686c102ec2d76c35125289aa4 sha256:8e1594dccaf75842d17bc3689b5738c888837f8f58747f8571af736b5c14fb38) then fails only in W3's interleaving, where `invalidate` after forget writes nothing and emits nothing (close-races §2a item 5).
  - (b) Inside the write section, before forget. This keeps :159, but joins a watch under the catalog's write guard in that interleaving.
  - **I recommend (a).** It is a guarantee item; I do not read it as a red line.
- **OPEN-4: T2's recorded mutation is masked by the late removal.**
  - (a) T2's doc gains M-T2's observed line, and T1 carries step 0's deletion.
  - (b) T2 gains a distinguishing assertion. That changes an existing test's assertions.
  - **I recommend (a).** Not a red line.

## Blocking questions
- Does the 2026-10-31 item 4 direction reach OPEN-1, which the placed node says "settles with the human first"? Or does OPEN-1 wait for the human until 2026-11-04?
- Do the guarantee changes (OPEN-2, OPEN-3) stand under §36 as the Out-of-scope line declares them?

## What I could not settle
- No run: the behaviour, M1, M-T2, the regression passes and the size are all predictions from reading.
- No sha256: the custodian expands the pins by script.
- I read no branch. Whether any branch in flight touches protocol/, and what 1c does to `Catalog`, are unknown to me.
- I did not read kernel/tests/source_watch_ordering.rs, so whether any test there pins that the watch is dropped before forget is unconfirmed (an invalidator in note 5).

## The custodian's settlement (class 1, before any code)

- **The human's ruling of 2026-11-03** (`state/directives/2026-11-03-271-d1-b-reason-field-7b-open-5-a-follow-up-node-entry-10-open-1-c.md`, item 3) answers the draft's two blocking questions:
  - **OPEN-1: (C),** the proof by reading plus the one deterministic test for the close half of W3. If the gates refuse the private-state write from the drop point, (B): the fall is recorded by an amendment when the refusal is filed, under the same ruling, with no new one.
  - **OPEN-2: S1, OPEN-3: (a) and OPEN-4: (a)** stand; by the ruling none is a red line.
  - **The guarantee changes** stand under §36 as the Out-of-scope line declares them; the five-line form stays, with the reviewer and the architect from dispatch.
- **`kernel/tests/source_watch_ordering.rs`, read by git at main b32f5acc** (the draft's last unsettled item): no line names `forget`. Its two `close_dataset` calls are followed by a reopen's assertions (kernel/tests/source_watch_ordering.rs:282 @ b32f5acc679a20f63ab18f078dbfa7c246d7e219 sha256:92855751dcb72c3e7aa8db20c5d2a90889cd87ac24b7b42f2921917018ffb2cf) and by the close's own `cancelled_streams` count (kernel/tests/source_watch_ordering.rs:646 @ b32f5acc679a20f63ab18f078dbfa7c246d7e219 sha256:a97d1e7d300ec449e632d6873decbf20ac3924983d958b6726b7e3aa754da5a3); neither observes whether the watch is dropped before forget. The custodian's reading; the gates check it.
- **Rule (00),** by git at main b32f5acc (`git diff --name-only origin/main...<branch>` over the open PRs, #277, #276, #275, #271, and the branches of the PLAN nodes in progress): nothing touches `kernel/src/skp.rs`, any path under `protocol/`, or this form; protocol/'s at-most-one is re-read at dispatch. `cut/b2-piece-1c-save-and-reopen` edits `kernel/src/lib.rs`, whose private `lock_read` and `lock_write` this piece calls: contact only, as the draft's table says, and a change there would show as a compile error at merge. Two older branches edit `kernel/src/skp.rs`: `cut/b1-close-nul-names` (last commit 2026-09-29), with paths under `protocol/` too, and `cut/kernel-ticket-drop-followups-p1-base` (last commit 2026-10-03); neither is an open PR's head or the branch of a PLAN node in progress, so neither is in flight.
- **The read commit and main:** `git diff --name-only 7591cdad b32f5acc -- kernel/src/skp.rs protocol/skp/SKP-V0.md` is empty, so the Scope files read at main b32f5acc as they did at 7591cdad.
- **Not settled by the draft, and proven by the piece's own runs:** the behaviour, M1, M-T2, the regression passes and the size, as its last section says. Entry 10 is dispatched in the filler queue's order when the filler slot is free.

## Amendments (opens empty; append-only)
