Reviewed: PR #308 at a9455d48c0d7332327c4674eafc50a9f5058e720 (the custodian's filing note, 2026-11-12: the architect's one check of the human's item 1, by the human's third message of 2026-11-12, item 6, PLAN node adr-035-close-races-note, the docs lane; its pins marked for the custodian or a reviewer to compute; the byte check its gaps name was the custodian's, at the restore: the human's line is in the ADR once, as a whole line; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #308 at a9455d48c0d7332327c4674eafc50a9f5058e720, the human's item 1, architect
Verdict: PASS

Branch and commit: cut/adr-035-close-races-note @ a9455d48c0d7332327c4674eafc50a9f5058e720. I read the code on main in the main checkout. The session-start status shows no kernel or protocol file modified, and only records staged, at 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5. All cites are `@ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:<H>` unless another commit is named. I have no shell, so the custodian or a reviewer fills each `<H>`. Every word below is mine. Nothing in quotation marks is a quote, apart from identifiers.

Item 1 sits at `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, Note 2026-11-11, item 1, on the branch. I compared it by reading against the human's line in the directive (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:39`, without its outer quotation marks), and the two read identically. The byte check is the reviewer's (see the gaps).

## Clause by clause

**C0. The close race named by the Note of 2026-09-25, item 3, is closed by kernel-generation-close-races (#136, merged 2026-09-28). Holds.**
- The Note's item 3 names that race and that node (ADR-035 `:157`, the same at main and at the branch).
- The node shows status done, `evidence: {pr: 136}` and done 2026-09-28 (`governance/PLAN.yaml:2334-2350`; my reading is of the working copy, which is staged-modified, so pin it at 7693001e126b526d1c98f2ce79c529c5e058f0d7 sha256:a477c2584f65b7cb4f7bd36a33edaed370d4ae977104c79301c2e23c8acfa03e, the reviewer's value).
- The merge date rests on the reviewer's E12 run (mergedAt 2026-09-28T18:15:11Z).

**C1. Since that merge, only `open_dataset` creates a live generation, through `mint_for_open`. Holds.**
- The only write to `live` is the insert in `mint_for_open`: `kernel/src/skp.rs:574-593` (the insert is at `:583`). My search of every `.rs` file in the repository found no other `live.insert`.
- `mint_for_open(` has two product callers, `kernel/src/skp.rs:1269-1272` and `kernel/src/skp.rs:1312-1314`. Both lie inside `open_dataset`, which runs from `:1106` to `:1335`, with `describe` starting at `:1337`.
- Every other caller is test code:
  - inside `skp.rs`, at `:3616`, `:3828`, `:3919`, `:4137` and `:4827`, all inside `#[cfg(test)] mod tests` (`:2441-3402`) or `mod ticket_drop_under_lock_regression` (`:3454-5362`);
  - and in `kernel/tests/`.
- `live_generation` never mints (`kernel/src/skp.rs:602-615`).
- "Since that merge" rests on the reviewer's E13 at M = 74a9b24bf802a5bc4792051282a1b4c9bd9acec8: product callers only in `open_dataset`, and `live_or_mint` still present at M^1 (`kernel/src/skp.rs:526 @ 85cb849244016dd0e3b050d6138fc40af18d4947 sha256:fa2fb994a0ec7e24c18bf6eff1bd2ecbbffded533de1afd16ec971be979ac022`, the reviewer's value).

**C2. A `viewport_query` racing `close_dataset` no longer mints a generation. Holds.**
- `viewport_query` is three steps: resolve, mint and attribute (`kernel/src/skp.rs:1409-1416`).
- None of them inserts into `live`:
  - resolve is the catalog read (`:1431-1436`);
  - the mint step's live check is `require_live` (`:1472`, then `:1666-1689`), and `live_generation` only reads;
  - its only registry write is `end_generation`, which removes (`:1485-1491`, then `invalidate` at `:787-793`);
  - `attribute_ticket` inserts only into `tickets`, and only when a live generation already exists (`kernel/src/skp.rs:622-635`).
- The step does mint a ticket (`:1508`), but no generation.

**C3. The refusal is by the end's reason when an end is recorded at the moment of its check, and `skp.unknown_dataset` otherwise. Holds at each refusal point the race can reach.**
- **Live check.** `live_generation` reads the end mark first, under the registry lock, and only then reads `closing` and `live` (`kernel/src/skp.rs:605-614`). `require_live` maps `Ended(reason)` to the reason's code and `NotOpen` to `skp.unknown_dataset` (`kernel/src/skp.rs:1670-1686`). So a recorded end wins even while closing, and the answer is decided by what is recorded at that check.
- **Attribute arm.** When `attribute_ticket` is false (`:1522-1525`), the ticket is cancelled (`:1526`). The answer then follows `ended_reason` at that read: `None` gives `skp.unknown_dataset` (`:1531-1533`), and `Some` gives the reason's code (`:1537-1547`, reading `kernel/src/skp.rs:755-759`).
- **Resolve.** This step fails only after `catalog.remove`. `Catalog::get` takes the read guard (`kernel/src/lib.rs:238-240`), and the close's forget and remove run under one write guard (`kernel/src/skp.rs:1627-1637`). So the mark is already gone, and `skp.unknown_dataset` (`:1432-1435`) agrees with the clause.

**C4. The close removes a recorded end when it forgets the dataset, so a query that checks after that gets `skp.unknown_dataset` even if the generation ended before the close. Holds.**
- `forget_dataset` removes `live`, `invalidated` and `closing` (`kernel/src/skp.rs:827-837`; the mark is removed at `:830`). `close_dataset` calls it at step 3 (`:1633`), after `begin_close` (`:1621`) and before `catalog.remove` (`:1636`).
- After that, `live_generation` finds no mark, no closing entry and no live generation, so it answers `NotOpen`, which becomes `skp.unknown_dataset` (`:605-614`, `:1673`). The arm's `ended_reason` is `None`, which gives `skp.unknown_dataset` (`:1531-1533`).
- No mark can come back:
  - `invalidate` writes one only when it removes a live generation (`:787-793`);
  - the only inserter is `mint_for_open`, whose admission refuses a name no longer in the catalog (`:1262-1268`, `:1306-1311`);
  - and a reopen gets a fresh handle (`:571-573`).
- Registry-level test: `forget_dataset_removes_the_generation_the_invalidation_and_every_attribution` (`kernel/tests/session_generation.rs:196-228`). It invalidates, then forgets, then asserts `NotOpen`.
- No `SkpHost`-level test drives this race. The human's ruling of the same item places that test at the kernel test node S3, so I record it as information and not as a finding.

**C5. Do the words close C1 as the two gate reports state it? Yes.**
- C1 was that the old condition, "if the generation had already ended", fails when a pre-close end is forgotten before the query's check. Both reports trace that path the same way: forget at `:1627-1637`, then `NotOpen` at `:602-615`, then `skp.unknown_dataset` at `:1666-1673`.
- The new words make the condition the state at the check, not the generation's history. The last sentence also states the ended-then-closed case outright, with the answer the code gives.
- D2's item 2 (the arm, "when no end is recorded") and this item now agree on the condition.

## Readings (information only, not findings)
- **"Racing."** A query that runs wholly before `begin_close` gets `Ok`, and step 2 then cancels its ticket (`:1613-1623`). That is the close's linearization, and an operator cannot tell it apart from a query issued before the close. I read "racing" as the race that used to mint, as both earlier gates did.
- **The engine's own pre-check.** Suppose a query passes the live check before `begin_close` and its source changed. Its pre-check refuses with the engine's source-changed code (`:1485-1491`) even if the close has meanwhile forgotten the name, in which case `invalidate` records nothing. The engine detected that refusal itself; the close race did not cause it. I read it as outside the clause, as I do filter, CRS and lease refusals.

## Findings by class
- Correctness: none.
- Evidence: none.
- Documentation: none in this check.

## What I read
- The brief.
- Both directives at the lines the brief names (`…third-message…md:31`; `…s1-fix-open-a-c…md:37-41`).
- ADR-035 lines 155-167 in the worktree at a9455d48.
- `kernel/src/skp.rs` on main: 430-950, 1250-1340, 1395-1704, and the module boundaries.
- `kernel/src/lib.rs:238-251`.
- `kernel/tests/session_generation.rs:190-231`.
- A repository-wide search for `mint_for_open(` and `live.insert`.
- `governance/PLAN.yaml:2334-2350`.
- Both gate reports (`state/consults/gates/2026-11-12-adr-035-close-races-note-gate-architect.md`, `state/consults/gates/2026-11-12-adr-035-close-races-note-gate-reviewer.md`).
- I did not open the form (`governance/forms/root/ADR-035-CLOSE-RACES-NOTE-PREREGISTRATION.md`). The check needed nothing from it beyond what the gate reports carry.

## The packet's gaps
- With no shell, I cannot confirm that the checkout's HEAD is 5007eaa1 or that the working-tree kernel equals it. I rely on the session-start status, which shows no kernel or protocol change.
- Every `sha256:<H>` is the custodian's or the reviewer's to fill.
- I checked by reading only, not byte for byte, that item 1 at a9455d48 equals the directive's line 39 without its quotation marks.
- "Since that merge" and the merge date rest on the reviewer's E12 and E13 runs, not on my own reading at M.
- `kernel/src/skp.rs` line numbers differ from the earlier gates' 7693001e numbers. Every cite above is mine at main.

I had no shell, so I leave no background shell. Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
