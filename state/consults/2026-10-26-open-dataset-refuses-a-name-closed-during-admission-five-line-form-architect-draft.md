*Custodian's filing note (2026-10-26): the architect's read-only draft, ahead, of the five-line form for `open-dataset-refuses-a-name-closed-during-admission`, the filler queue's entry 5b (S3), which runs after entry 6b resumes, read at main 7939326c. It applies the human's fallback (the lock order puts the full shape past the five-line budget): M1's shape with the narrowed title, about 107 lines in 3 files, the remaining windows proposed as their own node, `open-dataset-close-serialised-under-the-catalog-lock`, added to PLAN as proposed by the custodian with this filing in the human's words' terms. Its OPEN-1 (that node's placement) and OPEN-2 (whether SKP-V0's section 8 gains a no-literal-change note beside the human's section 1 sentence) are the human's and are put to the human; nothing is committed from this draft before its turn and those answers. The custodian's choice on its OPEN-3: (A), the worker writes the superseded pins in the replacing commit, pinned at the piece's base on main, with verify-test-claims run in that commit and in the done commit. The run 02:45:25Z to 02:55:22Z by its transcript (Glob 3, Grep 19, Read 27; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is a2b3fbdc4a0c7076e9b67cdd3e538ac413f14df9ab6b6d99f214b4bb7c6dac2e.*

---

Drafted: open-dataset-refuses-a-name-closed-during-admission, five-line form, architect

I read only the main checkout, at 7939326c. I have no shell, so this draft carries no sha256 and I ran no git, cargo or verify script. Every cite below is `path:line @ 7939326c`, read in the main checkout. A cite into `state/consults/gates/` is in the advisory tier.

**Settled first, under the human's words:** the full shape falls back to M1's shape with the narrowed title, and the remaining window is proposed as its own node. The fallback condition is the human's own: "If the lock order puts that past the five-line budget" (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 @ 7939326c). It is met, for the reasons in note 1. The fallback fits §21c: about 105 counted lines in 3 files.

```
Authority: PLAN node `open-dataset-refuses-a-name-closed-during-admission` (PLAN.yaml:3371-3387 @ 7939326c), generation 1, placed S3 as filler entry 5b by the human's resent direction (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 @ 7939326c; state/FILLER-QUEUE.md:17 @ 7939326c); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ 7939326c): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; the shape is that direction's fallback, M1's shape (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:9 @ 7939326c) with the narrowed title, the remaining window proposed as its own node; the pinned test is replaced under this form, as the human's ruling recorded at kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:124 @ 7939326c provides; the reuse index found no prior art on either search (catalog lock admission; close during open), a miss noted here.
Scope: 3 files: kernel/src/skp.rs (in `SkpHost::open_dataset`, the Watching arm only; the latch's lock-order doc comment; in the `#[cfg(test)]` module `ticket_drop_under_lock_regression`, the pinned test and the block comment above it); protocol/skp/SKP-V0.md (§1's `open_dataset` section: the human's sentence and its source comment, plus §8's note only if OPEN-2 is ruled (B)); kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md (one appended amendment carrying superseded pins to its lines 9 and 133 at a commit on main; nothing above it edited); declared line budget 140 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ 7939326c); this form exempt; no line of the ChecksOnly arm, `close_dataset`, `Catalog` or `GenerationRegistry` changes; no test other than the pinned one is changed or removed.
Change: in `open_dataset`'s Watching arm, after the watch's `resolves_unchanged` check and before `SessionRef::mint()`, the open refuses as `skp.unknown_dataset` (the existing constructor, message and `handle` field) when `self.catalog.get(handle.as_str())` is `None`: the latch guard is dropped first, then the watch (which joins), and nothing is minted, inserted, emitted or removed; the pinned test is replaced by one asserting that refusal; SKP-V0's `open_dataset` section gains the human's sentence.
Tests+mutation: a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds (pinned; predicted to FAIL by name at the fix commit, before it is replaced, at its expect on the open's result; that run recorded with the commit id) is replaced by a_close_during_open_admission_refuses_the_open_and_mints_no_generation (new, kernel/src/skp.rs, same module); M1: delete the new check, and the test fails at its expect_err on the open's result; M2: move the check after `mint_for_open`, and it fails at its no-live-generation assertion; M3: on the refusal, insert the `OpenRecord` carrying the watch before returning, and it fails at its no-record assertion; each is observed by applying it, running the test, recording the failing assertion with the commit in a `RECORDED MUTATION:` doc line, and reverting.
Out-of-scope: ADR: no status line or amendment (ADR-035 Decision 4's mint per successful open and its Note 2026-09-25 are read, not changed: a refused open is not successful and mints nothing); security: nothing ADR-020, ADR-009 or ADR-021 governs, and `DatasetHandle`'s CSPRNG minting is unchanged; wire: touched, as the human words it: an added `skp.unknown_dataset` refusal on `open_dataset` with the existing code, message and field; `skp/0.12` stays; no fixture, type or TypeScript mirror changes; nothing under protocol/ but SKP-V0.md; guarantee: touched: `open_dataset`'s admission changes, and in the pinned interleaving close-races' §1 claim (i) and its §5 falsification second bullet, which today's test meets (that form's Amendment 1), are no longer met; two windows stay open (a close that removes the name after the check, and the ChecksOnly arm), both unreachable in the product, proposed as their own node; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

## Notes (my reading)

### 1. Why the full shape falls back

The human's shape: "the catalog check and the mint under the one lock close_dataset's removal takes". That lock is the catalog's `RwLock`, taken for writing by `Catalog::remove` (kernel/src/lib.rs:248-250 @ 7939326c). The other removal, of the `OpenRecord` under `watches` (kernel/src/skp.rs:1567-1572 @ 7939326c), runs first in the close, so serialising against it closes nothing.

The close's steps are: C0 remove the watch (:1567-1572), C1 check the catalog (:1573), C2 `begin_close` (:1584), C3 cancel the tickets (:1586), C4 `forget_dataset` (:1591), C5 `catalog.remove` (:1593).

With the open's check and mint held under that guard:
- O after C5: the open refuses.
- O before C4: C4 forgets the generation the open minted.
- **O between C4 and C5: the generation is minted after the forget, then the name is removed. The defect remains.** `forget_dataset` clears `closing` (kernel/src/skp.rs:827-837 @ 7939326c), so between C4 and C5 nothing records that a close is under way.

The open-side guard alone therefore does not close the window. Closing it means also changing `close_dataset`, in one of two ways:
- hold the catalog's write guard across C4 and C5, with the removed `Arc<Dataset>` dropped after release; or
- reorder close-races' §2c so the removal comes before the forget (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:138-148 @ 7939326c).

Either way a second function changes, one that close-races governs.

**Evidence.** No deterministic seam reaches the C4–C5 window or the ChecksOnly arm's window:
- The ChecksOnly arm's `arm()` returns before the catalog insert (kernel/src/skp.rs:1173-1177 @ 7939326c). No test code runs between the insert (kernel/src/lib.rs:233 @ 7939326c) and its mint (kernel/src/skp.rs:1277-1279 @ 7939326c).
- Inside the close, the only test-reachable instant is the drop point of a Pending ticket during C3 (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:205-209 @ 7939326c), which comes before C4.
- Reaching either window would need a product hook, which the caller rule forbids, or a spawned thread, which close-races' determinism rule forbids (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:203 @ 7939326c).

So two of the full shape's three claims could carry no mutation that fails a test by name, which the human's request requires.

**Size.** The full shape is about 50 product lines (both arms, the close, the lock-order doc) plus the roughly 80-line test flip. That is about 130 lines with two claims unproven, and past 150 with any evidence for them.

So the lock order (the close side has to change) puts the evidenced full shape past the budget, and M1's shape stands. There is one more route: a `Catalog` method in kernel/src/lib.rs. It would collide with 1c step 1 under rule (00). The full shape would have to call `Catalog`'s private `lock_write` from skp.rs (kernel/src/lib.rs:163-168 @ 7939326c, visible crate-wide).

**A window I found while reading.** The open drops the latch (kernel/src/skp.rs:1248 @ 7939326c) before it inserts the `OpenRecord` (:1249-1258). A close that runs whole in that gap leaves an armed watch, with no catalog entry and no generation, and the open returns `Ok`. A later close of the same name releases it (C0) and refuses. This window is unreachable in the product. It goes into the proposed node, not this piece.

### 2. Lock order for M1, against every taker

- The latch is a per-call local (:1127). Only this call takes it, and the sink, which the watch threads (or a test watch) call (:1133).
- M1 adds one nesting: latch, then the catalog's read guard, taken and released inside `Catalog::get` (kernel/src/lib.rs:237-239 @ 7939326c), before `mint_for_open`. The documented order, latch then generations (kernel/src/skp.rs:1002-1006 @ 7939326c), is unchanged.
- Catalog guards are taken only inside `Catalog`'s own methods (kernel/src/lib.rs:204, 233, 238, 249, 253 @ 7939326c). None of them can reach the latch.
- Every other catalog caller takes the guard alone and releases it before going on:
  - `describe` (kernel/src/skp.rs:1303-1306 @ 7939326c);
  - `viewport_query_resolve` (:1396-1399);
  - `close_dataset` (:1573, :1593);
  - `record_step` (kernel/src/session_history.rs:152-157 @ 7939326c);
  - `create_from_raw_params` (kernel/src/lib.rs:416-419 @ 7939326c).
- No cycle exists. The test's re-entrant close runs inside `resolves_unchanged` (:1206), before the check, and takes no latch. This is the pinned test's proven path.
- The refusal must drop the latch guard before the watch, because the watch's threads call the sink, which takes the latch. This is the existing refusal path's order (:1213-1219).
- Edge, for the gate only (no line): `get` clones an `Arc`. If a concurrent close removed the entry in between, the clone is the last reference, and the `Dataset` is dropped under the latch. That is unreachable. M1's recorded text is kept as written.
- Placement: after the existing signal refusal (:1207-1242), so a recorded signal still takes precedence. That path's `catalog.remove` is harmless on an absent name.

### 3. The ChecksOnly arm

It is untouched (:1261-1293), and the narrowed title says so (PLAN.yaml:3372 @ 7939326c). Adding the check there with no test would be a line that no test proves. It belongs to the proposed node.

### 4. The pinned test, the tests and the mutations

- **The flip, by name.** Commit 1 carries the product change alone. The kernel crate's only predicted failure is the pinned test, at its expect "the open returns Ok although a close ran inside its admission" (kernel/src/skp.rs:5136 @ 7939326c). That matches M1's observation at bc7b0fbd479f97d05a60f4f48578c9870fed639e (:5104-5109). Commit 2 replaces the test. The build report records both commit ids.
- **The replacement's assertions, in order** (my shape):
  1. the watch's pre-state and the inner close's `Ok`, unchanged (:5129-5134);
  2. the open is `Err` with `code == "skp.unknown_dataset"` and its `handle` field equal to `names[0]` (kernel's error constructor at protocol/skp/src/v0/error.rs:64-72 @ 7939326c). M1 fails here;
  3. the catalog does not hold the name;
  4. `live_session` is `None` and `live_generation` is `Err(NotOpen)` (M2 fails here); there is no record (M3 fails here); the watch flag is set;
  5. `describe` and `viewport_query` refuse, and no ticket is minted;
  6. `try_recv` is empty;
  7. a second close refuses, with still no record and no generation.

  The name comes from `names[0]`, because the open returns no handle.
- **The doc comment** states that the test replaces the pinned one under this form, the unreachability (D1's words at :5097-5100, kept), the two windows left open with the proposed node's id, and M1 to M3. The block comment at :5035-5036 names both forms.
- **verify-test-claims.** The old name is a binding claim at kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:9 and :133 @ 7939326c: its node is done, and the scan covers `PREREGISTRATION*.md` (scripts/plan/verify-test-claims.mjs:721 @ 7939326c). Each line therefore needs its own superseded pin, `path:line @ <a commit on main> sha256:<hex>`, with the word "superseded" on the pin's own line and the replacement named. These are conditions (a) to (e) at scripts/plan/verify-test-claims.mjs:59-80 @ 7939326c, a statement about the tool at 7939326c. Run it in the replacing commit and again in the done commit.

### 5. The human's SKP-V0 words

- **Where they go.** A new paragraph in §1's `### open_dataset`, after the paragraph that ends at protocol/skp/SKP-V0.md:52 @ 7939326c and before `### describe` at :54.
- **The text.** The span inside the double quotes at state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 @ 7939326c, from `Refusal skp.unknown_dataset:` to `no message changes shape.`. The worker byte-copies it by script and adds nothing to it. It is not reproduced here.
- **It is the human's wording.** Clause check against M1:
  - "Refusal skp.unknown_dataset": M1 returns `SkpError::unknown_dataset` (error.rs:64-72). True.
  - "the catalog no longer holds the name at admission": M1's condition, checked under the latch in admission (kernel/src/skp.rs:1185-1191 @ 7939326c). True as the cause of every such refusal. Read the other way round, it has two gaps: a close after the check, and the ChecksOnly arm. Neither can be observed in the shipped app: the handle is 16 bytes from the OS CSPRNG (protocol/skp/src/v0/handles.rs:19-23 @ 7939326c), only this open returns it (kernel/src/skp.rs:1114, :1295-1297 @ 7939326c), and `Catalog::names` has no product caller. Its only `.names()` hits are tests, plus a projection's `names()` at kernel/src/publish/mod.rs:526 @ 7939326c. So the sentence does not block, and the gap goes in its source comment.
  - "an added refusal on open_dataset, the existing code": `open_dataset` returns no `unknown_dataset` today (:1100-1299). True.
  - "no message changes shape": no type changes. True.
- **Source comment.** These words are mine, not the human's, applied with no re-gate:

  `<!-- The refusal above is made in SkpHost::open_dataset's Watching arm, at one check after the watch's resolves_unchanged and before the mint. A close that removes the name after that check, and the ChecksOnly arm, are not refused; neither is reachable in the shipped app: the handle is minted from the OS CSPRNG and returned only by this open, and Catalog::names has no product caller. The remaining window is proposed as its own node. -->`

  Clause check:
  - the placement: this form's Change line, against :1206 and :1243-1246;
  - "not refused": the close takes no guard that admission holds from the check to the mint (:1554-1595), and the ChecksOnly arm is outside Scope;
  - unreachability: handles.rs:19-23 and the `names()` search above.
- **Other wire text.** None changes:
  - §4 item 8: no new code;
  - §4 item 13: no field changes (protocol/skp/SKP-V0.md:299-303 @ 7939326c);
  - §5;
  - `close_dataset`'s section;
  - fixtures;
  - `SKP_VERSION` stays `skp/0.12` (protocol/skp/src/v0/mod.rs:115 @ 7939326c).
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

- The limits are AUTONOMY.md:350-351 and :357 @ 7939326c. The amendment on the earlier form is a record, not code or tests, so it counts as a file only.
- There is no new dependency and no exposure surface. No behaviour visible in the shipped app changes.
- An overrun is class 6, and the Scope line is not edited (AUTONOMY.md:345 @ 7939326c).

### 7. Out-of-scope readings

- **ADR.** ADR-035:83 @ 7939326c (one mint per successful open) and the Note at :149-158 @ 7939326c are consistent with this piece. Nothing in either is amended.
- **Wire.** The human calls this a wire change, and the form says so. §36 sets round 25, item 2 (e) aside for filler pieces (AUTONOMY.md:482, :692 @ 7939326c), so naming the category does not move the piece to the full form.
- **Guarantee.** Close-races declared `open_dataset` unchanged (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:256 @ 7939326c). This piece changes it. Claim (i) (:80) is now met in the pinned interleaving.
- **Constitution.** Control plane only (docs/02, docs/10); no MCP and no data plane. The operation class is unchanged (ADR-006): a refused open leaves no entry. No docs/08 figure is claimed.
- **Seam.** No new seam. The shell catches any `SkpCallError` from `open_dataset` and from `describe` in one block and formats it generically (frontends/shell/src/admission/admitDataset.ts:47-65 @ 7939326c). `describe` already returns this code there. Following close-races' §1 Seam reading (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:93 @ 7939326c), no shell end-to-end test is owed. The gate checks that reading.
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
- **OPEN-2 (the human's: wire text).** §8's preamble says §§1–7 are "updated in place where a version note says so" (protocol/skp/SKP-V0.md:569-572 @ 7939326c). The no-bump notes at :1101-1118 are the precedent.
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

Files read (all at C:/dev/spatial-ide):
- state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md
- PLAN.yaml
- kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md
- state/consults/gates/2026-10-25-kernel-close-during-open-admission-gate1-architect.md
- kernel/src/skp.rs
- kernel/src/lib.rs
- kernel/src/session_history.rs
- protocol/skp/SKP-V0.md
- protocol/skp/src/v0/error.rs
- protocol/skp/src/v0/handles.rs
- docs/adr/ADR-035-dataset-session-ended-control-plane-event.md
- kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md
- AUTONOMY.md
- state/FILLER-QUEUE.md
- scripts/plan/verify-test-claims.mjs
- frontends/shell/src/admission/admitDataset.ts
