# kernel/src/skp.rs: open_dataset refuses a name closed during its admission — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node open-dataset-refuses-a-name-closed-during-admission, the filler queue's entry 5b (S3). The five lines, the notes, the OPEN items and what the draft could not settle are the architect's draft (`state/consults/2026-10-26-open-dataset-refuses-a-name-closed-during-admission-five-line-form-architect-draft.md`, read only at main 7939326c; its sha256 from line 5 is a2b3fbdc4a0c7076e9b67cdd3e538ac413f14df9ab6b6d99f214b4bb7c6dac2e), carried byte for byte with these changes, all the custodian's: each cite read at 7939326c is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path, and a root file whose name the tree holds more than once, as `path:line` at <commit>, sha256 <hex>; 0 such): the cites the draft marks, every cite on a line before that line's last marker, and every cite written with a file name that resolves to one tracked path (52 pins; 1 by a bare or partial name; 4 line numbers the draft marks bound to the path before them; ADR-035's two cites, line 83 and the Note at 149 to 158, bound to the ADR's file by name; 1 bare line numbers the draft leaves unmarked kept as written; 3 left as written; 1 prose markers given the full commit id); this title and lead line added; the draft's closing list of files read dropped. Every pin is historical: for the code, the piece's base on main is authoritative. Form path: `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

```
Authority: PLAN node `open-dataset-refuses-a-name-closed-during-admission` (PLAN.yaml:3371-3387 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:a9b1e36e0ac39ff42ccc9ca341e25034a922ee4836410d037813642754dfca25), generation 1, placed S3 as filler entry 5b by the human's resent direction (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:2e61dbb5f344ac1c7d25d5c5295f6cb84911949ee6f96410655cf8ac6c4d8c3b; state/FILLER-QUEUE.md:17 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:5ed9f1020d358b8534f6eb5270c1b2ec4e90c8d7cfe5b4d81147be61b71ee6d7); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; the shape is that direction's fallback, M1's shape (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:9 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:29de1baeebc7b5c7a2c768b4c45baf4a2422496769f8d31e222c166eec227172) with the narrowed title, the remaining window proposed as its own node; the pinned test is replaced under this form, as the human's ruling recorded at kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:124 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:3338f0ebf3faf6d89692bed271c8cdfcd252403977af9ce41831389a7b48e02a provides; the reuse index found no prior art on either search (catalog lock admission; close during open), a miss noted here.
Scope: 3 files: kernel/src/skp.rs (in `SkpHost::open_dataset`, the Watching arm only; the latch's lock-order doc comment; in the `#[cfg(test)]` module `ticket_drop_under_lock_regression`, the pinned test and the block comment above it); protocol/skp/SKP-V0.md (§1's `open_dataset` section: the human's sentence and its source comment, plus §8's note only if OPEN-2 is ruled (B)); kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md (one appended amendment carrying superseded pins to its lines 9 and 133 at a commit on main; nothing above it edited); declared line budget 140 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no line of the ChecksOnly arm, `close_dataset`, `Catalog` or `GenerationRegistry` changes; no test other than the pinned one is changed or removed.
Change: in `open_dataset`'s Watching arm, after the watch's `resolves_unchanged` check and before `SessionRef::mint()`, the open refuses as `skp.unknown_dataset` (the existing constructor, message and `handle` field) when `self.catalog.get(handle.as_str())` is `None`: the latch guard is dropped first, then the watch (which joins), and nothing is minted, inserted, emitted or removed; the pinned test is replaced by one asserting that refusal; SKP-V0's `open_dataset` section gains the human's sentence.
Tests+mutation: a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds (pinned; predicted to FAIL by name at the fix commit, before it is replaced, at its expect on the open's result; that run recorded with the commit id) is replaced by a_close_during_open_admission_refuses_the_open_and_mints_no_generation (new, kernel/src/skp.rs, same module); M1: delete the new check, and the test fails at its expect_err on the open's result; M2: move the check after `mint_for_open`, and it fails at its no-live-generation assertion; M3: on the refusal, insert the `OpenRecord` carrying the watch before returning, and it fails at its no-record assertion; each is observed by applying it, running the test, recording the failing assertion with the commit in a `RECORDED MUTATION:` doc line, and reverting.
Out-of-scope: ADR: no status line or amendment (ADR-035 Decision 4's mint per successful open and its Note 2026-09-25 are read, not changed: a refused open is not successful and mints nothing); security: nothing ADR-020, ADR-009 or ADR-021 governs, and `DatasetHandle`'s CSPRNG minting is unchanged; wire: touched, as the human words it: an added `skp.unknown_dataset` refusal on `open_dataset` with the existing code, message and field; `skp/0.12` stays; no fixture, type or TypeScript mirror changes; nothing under protocol/ but SKP-V0.md; guarantee: touched: `open_dataset`'s admission changes, and in the pinned interleaving close-races' §1 claim (i) and its §5 falsification second bullet, which today's test meets (that form's Amendment 1), are no longer met; two windows stay open (a close that removes the name after the check, and the ChecksOnly arm), both unreachable in the product, proposed as their own node; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine or my, they mean the architect's. They are this form's reading.*

## Notes

### 1. Why the full shape falls back

The human's shape: "the catalog check and the mint under the one lock close_dataset's removal takes". That lock is the catalog's `RwLock`, taken for writing by `Catalog::remove` (kernel/src/lib.rs:248-250 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:540f1436491b3244ed7489c75c9e7747deaea13e535333c8e7babda46ce7b4af). The other removal, of the `OpenRecord` under `watches` (kernel/src/skp.rs:1567-1572 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:ce7b583b5ce2aef0490c48f664bcdc4c0a59911aa4b048237185e270eed715d9), runs first in the close, so serialising against it closes nothing.

The close's steps are: C0 remove the watch (:1567-1572), C1 check the catalog (:1573), C2 `begin_close` (:1584), C3 cancel the tickets (:1586), C4 `forget_dataset` (:1591), C5 `catalog.remove` (:1593).

With the open's check and mint held under that guard:
- O after C5: the open refuses.
- O before C4: C4 forgets the generation the open minted.
- **O between C4 and C5: the generation is minted after the forget, then the name is removed. The defect remains.** `forget_dataset` clears `closing` (kernel/src/skp.rs:827-837 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:27947a50e3dfb78975b6e7ae714d3668e2fa7fa26ca1ffc128bff3ba7fbaa049), so between C4 and C5 nothing records that a close is under way.

The open-side guard alone therefore does not close the window. Closing it means also changing `close_dataset`, in one of two ways:
- hold the catalog's write guard across C4 and C5, with the removed `Arc<Dataset>` dropped after release; or
- reorder close-races' §2c so the removal comes before the forget (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:138-148 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:6e96f9cdb0a20de6e9e94dbb23c71c93024d56b7ad029c24e00e8c454e45e53d).

Either way a second function changes, one that close-races governs.

**Evidence.** No deterministic seam reaches the C4–C5 window or the ChecksOnly arm's window:
- The ChecksOnly arm's `arm()` returns before the catalog insert (kernel/src/skp.rs:1173-1177 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:8d462b3675a380dc820c2632ed21dff5cda6aabca04092458adfc9500b582e06). No test code runs between the insert (kernel/src/lib.rs:233 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:e722e5cdb78b7cf62bfa6dd016358564faf71539a99d3123c8a403c32bd68590) and its mint (kernel/src/skp.rs:1277-1279 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:88bd2a2e05aa60d756eea64c241957c04c74ab4b34b288c8807cae7eeb0a6378).
- Inside the close, the only test-reachable instant is the drop point of a Pending ticket during C3 (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:205-209 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:76e6be5c654e3a647300ca01ad1e83e7e104980be466762eb6bcbb1dac50a557), which comes before C4.
- Reaching either window would need a product hook, which the caller rule forbids, or a spawned thread, which close-races' determinism rule forbids (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:203 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:60f27288730cb392458d0964d8250f5ded4ac53b3dc0191278b270621c23eed4).

So two of the full shape's three claims could carry no mutation that fails a test by name, which the human's request requires.

**Size.** The full shape is about 50 product lines (both arms, the close, the lock-order doc) plus the roughly 80-line test flip. That is about 130 lines with two claims unproven, and past 150 with any evidence for them.

So the lock order (the close side has to change) puts the evidenced full shape past the budget, and M1's shape stands. There is one more route: a `Catalog` method in kernel/src/lib.rs. It would collide with 1c step 1 under rule (00). The full shape would have to call `Catalog`'s private `lock_write` from skp.rs (kernel/src/lib.rs:163-168 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:b4de7d6896e956398d7f1edcfe439b0af0835a90969f6a076695bddb8d079c21, visible crate-wide).

**A window I found while reading.** The open drops the latch (kernel/src/skp.rs:1248 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:b01cead8df56ee6d341d7648213266e264f37b0c828e2b263ccc27f3b98c6829) before it inserts the `OpenRecord` (:1249-1258). A close that runs whole in that gap leaves an armed watch, with no catalog entry and no generation, and the open returns `Ok`. A later close of the same name releases it (C0) and refuses. This window is unreachable in the product. It goes into the proposed node, not this piece.

### 2. Lock order for M1, against every taker

- The latch is a per-call local (:1127). Only this call takes it, and the sink, which the watch threads (or a test watch) call (:1133).
- M1 adds one nesting: latch, then the catalog's read guard, taken and released inside `Catalog::get` (kernel/src/lib.rs:237-239 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:0b54373cfc76780207b8cc25c168b05c0f46d3f0bbb3e493634ac7c67300fd0c), before `mint_for_open`. The documented order, latch then generations (kernel/src/skp.rs:1002-1006 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:522d5c1ff043f68f289ad21fc217e52963e86c45adebe9e3346c94af08437f89), is unchanged.
- Catalog guards are taken only inside `Catalog`'s own methods (kernel/src/lib.rs:204 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:e722e5cdb78b7cf62bfa6dd016358564faf71539a99d3123c8a403c32bd68590, 233, 238, 249, 253 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf). None of them can reach the latch.
- Every other catalog caller takes the guard alone and releases it before going on:
  - `describe` (kernel/src/skp.rs:1303-1306 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:38cd2538bdd3e2e983af7708f97823e170277f1f7af9508c61c8c0599e451fcb);
  - `viewport_query_resolve` (:1396-1399);
  - `close_dataset` (:1573, :1593);
  - `record_step` (kernel/src/session_history.rs:152-157 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:fff9c19bcd2eca036e6d38fea008d235f1c98d3f10556a32b8b47a3b9d0932f4);
  - `create_from_raw_params` (kernel/src/lib.rs:416-419 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:4b7384ca1efe70e1071893773ec7ad943a9f7082cea46e716f35813c5ce1d958).
- No cycle exists. The test's re-entrant close runs inside `resolves_unchanged` (:1206), before the check, and takes no latch. This is the pinned test's proven path.
- The refusal must drop the latch guard before the watch, because the watch's threads call the sink, which takes the latch. This is the existing refusal path's order (:1213-1219).
- Edge, for the gate only (no line): `get` clones an `Arc`. If a concurrent close removed the entry in between, the clone is the last reference, and the `Dataset` is dropped under the latch. That is unreachable. M1's recorded text is kept as written.
- Placement: after the existing signal refusal (:1207-1242), so a recorded signal still takes precedence. That path's `catalog.remove` is harmless on an absent name.

### 3. The ChecksOnly arm

It is untouched (:1261-1293), and the narrowed title says so (PLAN.yaml:3372 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:181a74a7310e41364c16f41a3891dc798d85ae6dcd8c9f9a6f2fe43a6a48b549). Adding the check there with no test would be a line that no test proves. It belongs to the proposed node.

### 4. The pinned test, the tests and the mutations

- **The flip, by name.** Commit 1 carries the product change alone. The kernel crate's only predicted failure is the pinned test, at its expect "the open returns Ok although a close ran inside its admission" (kernel/src/skp.rs:5136 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:8ce25b684b5ba3541b3d43577293796bd54174d03846a95f1a69ee55a00b402d). That matches M1's observation at bc7b0fbd479f97d05a60f4f48578c9870fed639e (:5104-5109). Commit 2 replaces the test. The build report records both commit ids.
- **The replacement's assertions, in order** (my shape):
  1. the watch's pre-state and the inner close's `Ok`, unchanged (:5129-5134);
  2. the open is `Err` with `code == "skp.unknown_dataset"` and its `handle` field equal to `names[0]` (kernel's error constructor at protocol/skp/src/v0/error.rs:64-72 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:1f0ec80e1a46858cca06bca40aeb6da7755e92166c39339aece4d35b602f3233). M1 fails here;
  3. the catalog does not hold the name;
  4. `live_session` is `None` and `live_generation` is `Err(NotOpen)` (M2 fails here); there is no record (M3 fails here); the watch flag is set;
  5. `describe` and `viewport_query` refuse, and no ticket is minted;
  6. `try_recv` is empty;
  7. a second close refuses, with still no record and no generation.

  The name comes from `names[0]`, because the open returns no handle.
- **The doc comment** states that the test replaces the pinned one under this form, the unreachability (D1's words at :5097-5100, kept), the two windows left open with the proposed node's id, and M1 to M3. The block comment at :5035-5036 names both forms.
- **verify-test-claims.** The old name is a binding claim at kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:9 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:29de1baeebc7b5c7a2c768b4c45baf4a2422496769f8d31e222c166eec227172 and kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:133 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:b67a56142b0db61f8dac8efd6efa3e45c6ba3d707be91fb32896ab1dd3e0739b: its node is done, and the scan covers `PREREGISTRATION*.md` (scripts/plan/verify-test-claims.mjs:721 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:e686da950c9b8170daf5ca0c2f4ead1a8dfb74f5b2a952432480c7adbf32d8a7). Each line therefore needs its own superseded pin, `path:line @ <a commit on main> sha256:<hex>`, with the word "superseded" on the pin's own line and the replacement named. These are conditions (a) to (e) at scripts/plan/verify-test-claims.mjs:59-80 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:0a5fc1ae68b4878f0ddb1f3a025c2ac3c4381ba97ad46073937e6d493e2a16c9, a statement about the tool at 7939326c. Run it in the replacing commit and again in the done commit.

### 5. The human's SKP-V0 words

- **Where they go.** A new paragraph in §1's `### open_dataset`, after the paragraph that ends at protocol/skp/SKP-V0.md:52 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:2c37b6c28414e050946f890d83d6a96620b013ba8b6fc7673c24b104ed09a83f and before `### describe` at :54.
- **The text.** The span inside the double quotes at state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:2e61dbb5f344ac1c7d25d5c5295f6cb84911949ee6f96410655cf8ac6c4d8c3b, from `Refusal skp.unknown_dataset:` to `no message changes shape.`. The worker byte-copies it by script and adds nothing to it. It is not reproduced here.
- **It is the human's wording.** Clause check against M1:
  - "Refusal skp.unknown_dataset": M1 returns `SkpError::unknown_dataset` (error.rs:64-72). True.
  - "the catalog no longer holds the name at admission": M1's condition, checked under the latch in admission (kernel/src/skp.rs:1185-1191 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:2e47ea976e9393e0a5997f0348c5ef8e50661cef39c758f5f9d7d61128c1738e). True as the cause of every such refusal. Read the other way round, it has two gaps: a close after the check, and the ChecksOnly arm. Neither can be observed in the shipped app: the handle is 16 bytes from the OS CSPRNG (protocol/skp/src/v0/handles.rs:19-23 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:ed8e290352da217b235c32b2b1f4f2ae09144455a5c797ae24cde6a0753cc730), only this open returns it (kernel/src/skp.rs:1114 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:238cd96f1a7d324b88b87bdf32fa1f79fbd8eea52da6fccd3c7bdd44edaf9a11, kernel/src/skp.rs:1295-1297 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:dcd5b043d7b0347e01c6a4758b131d7552d4efc1a4d5d4bd283bed4f1ed5ceaa), and `Catalog::names` has no product caller. Its only `.names()` hits are tests, plus a projection's `names()` at kernel/src/publish/mod.rs:526 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:d084156264c3402da6043c6e46fe7820d7ae75ddb0969a7df2144cccaa4faf90. So the sentence does not block, and the gap goes in its source comment.
  - "an added refusal on open_dataset, the existing code": `open_dataset` returns no `unknown_dataset` today (:1100-1299). True.
  - "no message changes shape": no type changes. True.
- **Source comment.** These words are mine, not the human's, applied with no re-gate:

  `<!-- The refusal above is made in SkpHost::open_dataset's Watching arm, at one check after the watch's resolves_unchanged and before the mint. A close that removes the name after that check, and the ChecksOnly arm, are not refused; neither is reachable in the shipped app: the handle is minted from the OS CSPRNG and returned only by this open, and Catalog::names has no product caller. The remaining window is proposed as its own node. -->`

  Clause check:
  - the placement: this form's Change line, against :1206 and :1243-1246;
  - "not refused": the close takes no guard that admission holds from the check to the mint (:1554-1595), and the ChecksOnly arm is outside Scope;
  - unreachability: protocol/skp/src/v0/handles.rs:19-23 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:ed8e290352da217b235c32b2b1f4f2ae09144455a5c797ae24cde6a0753cc730 and the `names()` search above.
- **Other wire text.** None changes:
  - §4 item 8: no new code;
  - §4 item 13: no field changes (protocol/skp/SKP-V0.md:299-303 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:b4170741d0929ea5bc56a1866c24c24d4025bf73c3fc8468c940ecbbf0b6a4a4);
  - §5;
  - `close_dataset`'s section;
  - fixtures;
  - `SKP_VERSION` stays `skp/0.12` (protocol/skp/src/v0/mod.rs:115 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:060d4f4517eb8e7d80ae0842026dcbf9a6bd75c9a03df1e01a708cdc3708c8ab).
- **§8 is OPEN-2.**

### 6. Size against §21c (it fits)

| Part | Counted lines (mine) |
|---|---|
| The Watching arm's check, with its comment | about 12 |
| The lock-order doc comment | about 6 |
| The test's name, doc comment and M1 to M3 lines | about 45 |
| The test body's changed steps 2, 4, 5 and 7 | about 34 |
| The block comment | about 4 |
| SKP-V0, the sentence and its comment (counted to be safe) | about 6 |
| **Total** | **about 107, in 3 files** |

- The limits are AUTONOMY.md:350-351 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333 and AUTONOMY.md:357 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec. The amendment on the earlier form is a record, not code or tests, so it counts as a file only.
- There is no new dependency and no exposure surface. No behaviour visible in the shipped app changes.
- An overrun is class 6, and the Scope line is not edited (AUTONOMY.md:345 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3).

### 7. Out-of-scope readings

- **ADR.** ADR-035 (docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:83 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:17a621f74a4da547fbfa3839947a60c5f84bf1911776048dca970831d79e863d) (one mint per successful open) and the Note at docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:149-158 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:f81b5c50537ea14d3d9e8c71909ec19d162209c5849299db1d82bb07af6ee7a3 are consistent with this piece. Nothing in either is amended.
- **Wire.** The human calls this a wire change, and the form says so. §36 sets round 25, item 2 (e) aside for filler pieces (AUTONOMY.md:482 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669, AUTONOMY.md:692 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84), so naming the category does not move the piece to the full form.
- **Guarantee.** Close-races declared `open_dataset` unchanged (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:256 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:b14c81bf5a28b7d70de3b43a74e579a0aa80c8bf2188c53595631cc9e4b2fac4). This piece changes it. Claim (i) (:80) is now met in the pinned interleaving.
- **Constitution.** Control plane only (docs/02, docs/10); no MCP and no data plane. The operation class is unchanged (ADR-006): a refused open leaves no entry. No docs/08 figure is claimed.
- **Seam.** No new seam. The shell catches any `SkpCallError` from `open_dataset` and from `describe` in one block and formats it generically (frontends/shell/src/admission/admitDataset.ts:47-65 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:5ad9fb748465edbf8f5f217bffb3ebd8554724cc02d6416b0d25dce8a0110277). `describe` already returns this code there. Following close-races' §1 Seam reading (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:93 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:3076ffc01e8d5561f093235ffb3e5bc317eee8ae0861b42e54ff9380684dfce7), no shell end-to-end test is owed. The gate checks that reading.
- **P6.** No new string; the existing message is reused.

### 8. Rule (00), path by path

This piece's paths are kernel/src/skp.rs, protocol/skp/SKP-V0.md and kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md, plus its own form on main.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none. Contact only: it edits kernel/src/lib.rs (`Catalog`) and kernel/src/session_history.rs. This piece calls `Catalog::get` unchanged, so a changed API would show up at merge as a compile error, not as a shared path. |
| port-2 | none |
| 6b | none (kernel/tests only) |
| #260 | none |
| #252 | none |
| #249 | none |
| #244 | none |
| #241 | none (its kernel paths are under publish/, permission/, bundle/, bin/ and README) |

- No in-flight list names protocol/, so this piece would be the only one touching it. That has to be true again at dispatch, checked by `git diff --name-only origin/main...<branch>`.
- The path lists are the brief's; I cannot read branches.

## OPEN items

- **OPEN-1 (the human's: placement).** The proposed node. My words:
  - id: `open-dataset-close-serialised-under-the-catalog-lock`
  - title: "open_dataset's catalog check and mint, in both arms, serialised with close_dataset's forget and removal, and no OpenRecord inserted after a close (the windows M1 leaves)"
  - summary:
    - The windows are note 1's C4–C5 window, the ChecksOnly arm, and the `OpenRecord` gap.
    - The shape: the catalog's write guard is held across `forget_dataset` and the removal, or close-races §2c is reordered. The lock order is latch, then catalog, then generations, and nothing takes them in reverse.
    - Evidence: no deterministic seam reaches these windows. Its form settles with the human first whether a threaded test, with its nondeterminism disclosed, or a proof by reading is accepted.
    - Unreachable in the product.
  - Options: (A) place it, S3, on the filler queue (recommended); (B) discard it, with the windows named in this piece's source comments.
- **OPEN-2 (the human's: wire text).** §8's preamble says §§1–7 are "updated in place where a version note says so" (protocol/skp/SKP-V0.md:569-572 @ 7939326c84bb1b6592cf2147e0f5ecd5d73739cf sha256:e5b423c4a697d4d3f1b19b4da89f1380c98157515c2eefcfc3899ef2b06e1f64). The no-bump notes at :1101-1118 are the precedent.
  - (A) §1 only. The form records "no literal change".
  - (B) Also a §8 note. My words:

    `### Note: open_dataset refuses a name closed during its admission (2026-10-26; no literal change)` / `**skp/0.12 stands; no literal is bumped and no fixture changes.** §1's open_dataset section gains one paragraph in place: open_dataset may refuse as skp.unknown_dataset, the existing code, with its existing message and handle field. No key, value or command is added or removed; protocol/data-plane/ has an empty diff.`

    Clause check: mod.rs:115; error.rs:64-72; this form's Scope.
  - I recommend (B), for the preamble's sake. About 5 doc lines, still under 140.
- **OPEN-3 (the custodian's).** Who writes the superseded pins (note 4), and at which commit. I recommend: the worker, in the replacing commit, pinned at the piece's base on main (round 15 (e)), with verify-test-claims run in that commit and in the done commit.

## What I could not settle

- No run: the fix's behaviour, the flip, M1 to M3 and the size are all predictions from reading.
- No sha256: every pin is for the custodian to expand by script.
- verify-test-claims' acceptance of the two pins is not run.
- I read no branch, so 1c step 1's changes to `Catalog` are unknown.
- I did not read the 2026-10-25 directive's item 1 itself; I cite it through the earlier form's line 124.

## The custodian's settlement (class 1, before any code)

- **The human's ruling of 2026-10-26** (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md`, line 28), referenced and not restated:
  - **OPEN-1: (A).** `open-dataset-close-serialised-under-the-catalog-lock` is placed, S3, on the filler queue after entry 9 (its entry 10).
  - **OPEN-2: (B).** SKP-V0's §8 gains the architect's note in its words, the OPEN-2 (B) text above, byte-copied by the worker; the Scope's §8 clause applies.
  - **OPEN-3: as the architect recommends.** The worker writes the superseded pins to the earlier form's lines 9 and 133 in the replacing commit, pinned at the piece's base on main, with verify-test-claims run in that commit and in the done commit.
- **This form's own Tests+mutation line** names the replaced test beside its replacement. Its closing amendment carries a superseded pin to that line, written by the custodian.
- **Rule (00)** was checked at main e5c7835d by `git diff --name-only origin/main...<branch>` over the open PRs (#268) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `wip/governance-f-scripts`): none touches the piece's paths, and none touches `protocol/`. It is checked again at dispatch.
- **Governance piece F** moves this form and the earlier form into `governance/forms/kernel/` by its moves-only commit, with rule (00) set aside for that commit alone; their old paths resolve through `governance/MOVED.tsv`.

## Amendments (opens empty; append-only)

### Amendment 1 (2026-10-29): the closing record, written after gate 1's reports and the words commit were seen. References and hashes only, with the architect's D4 correction in its words.

- **The final head:** 6b8020951efbd0ed19b4848955ca5953589b45ac, the words commit on the record commit da8c6cdc, the test commit 68773f09 and the fix commit 5e38ffae.
- **Build:** `state/consults/2026-10-29-open-dataset-refuses-a-name-closed-during-admission-build-worker-report.md` (sha256 1d30b3145d0e80009c0d7791725a9676739ad5a96960aca8e70ead8958097fa0).
- **Gate 1:**
  - `state/consults/gates/2026-10-29-open-dataset-refuses-a-name-closed-during-admission-gate1-architect.md` (sha256 483746ece59b116c673f94ac893eee09dfa7d655e262f267b13d648504703e30), gate-log 648, PASS WITH NOTES.
  - `state/consults/gates/2026-10-29-open-dataset-refuses-a-name-closed-during-admission-gate1-reviewer.md` (sha256 604e5cdb4616ed7fcb483126127e579175530d859b000a006e5a918e51cc19b8), gate-log 649, PASS WITH NOTES.
- **The words commit** 6b802095: `state/consults/2026-10-29-open-dataset-refuses-a-name-closed-during-admission-gate1-words-worker-report.md` (sha256 from line 5 c7cee42df37265a6b88757b9210555981673c5baf30a60b26c47b091a473c840). It carries the architect's D1 and D3, and the reviewer's D1 for the two sentences the architect's D2 also words, with no re-gate (AUTONOMY §31). None is the human's wording. The SKP-V0 source comment's last sentence is now the reviewer's, so that comment no longer equals note 5's span.
- **The architect's D4, in its words:** The guarantee clause of this form's Out-of-scope line, and the earlier form's Amendment 1 it cites, use "met" for close-races' §1 claim (i) where the test's state contradicts it; read plainly, the earlier test's items 4 and 7 broke claim (i) and fired the §5 Falsification second bullet, and in the pinned interleaving this piece's test shows claim (i) holding and that bullet not firing, as note 7 states. The proof is a_close_during_open_admission_refuses_the_open_and_mints_no_generation, items 4 and 7.
- **The replaced test's claim:** kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md:9 @ a6843238e150f1c7f9bb34a39f7fbc038b1454f1 sha256:3ee7fc9e152c8e159753f00c07342579a3729b2281e1734ea22313d2ba4a4140 — superseded; a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds is replaced by a_close_during_open_admission_refuses_the_open_and_mints_no_generation in kernel/src/skp.rs.
- **CI at the final head,** read by gh before this record: 18 of 18 checks pass, and the new test passes on both L1 entries (pull_request run 40843668372: cargo test --workspace (windows-latest); pull_request run 40843668372: L1 portable correctness · cargo test --workspace (ubuntu-24.04); push run 40843661852: L1 portable correctness · cargo test --workspace (ubuntu-24.04); push run 40843661852: cargo test --workspace (windows-latest)).
- **Figures:** 125 lines over the 3 files (`kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md` 9/0, `kernel/src/skp.rs` 73/36, `protocol/skp/SKP-V0.md` 7/0), under the Scope's 140.
- **Merge:** by merge commit, so that the fix and test commits the RECORDED MUTATION lines name stay reachable on main.
