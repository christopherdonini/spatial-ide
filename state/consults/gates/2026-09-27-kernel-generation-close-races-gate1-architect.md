*Custodian's filing note (2026-09-27): gate 1, attempt 1 (architect), full gating, of PLAN node `kernel-generation-close-races`. Reviewed: cut/kernel-generation-close-races @ af77861 (from the report's own first line; the full id af77861a6123576184c9d34071ddfb47b794374d, from the branch). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cut/kernel-generation-close-races @ af77861

**Verdict: FAIL.** The code passes. The only finding that fails the gate is a record-form defect in Amendment 2 (F1). Fixing it takes one appended row. No code changes, and the code does not need re-gating.

**What I could not check myself.** I have no shell. I could not recompute any sha256 or run `git diff`, the §7 command or the verify tools, so the reviewer recomputes all 17 Amendment 2 pins and the withdrawal row's pin. I did resolve each pinned span's content by line range against the files on main (d4245fe, bfb436d and 188b1f8 are all on main), and every range holds what its row says.

**The worktree moved while I was reading.** The worktree reflog shows `checkout 051c56f`, then `ecc4a37`, after af77861, presumably from the reviewer's re-runs. My reads of `kernel/src/skp.rs` came from a post-merge tree; one late grep hit a pre-fix tree. The reviewer should confirm `git diff ecc4a37 af77861 -- kernel/src` is empty. I compared the mint step against main's working tree at c4300c9, not d6ec85a, so the reviewer should also confirm `git diff d6ec85a c4300c9 -- kernel/src/skp.rs` is empty.

## Findings

**F1 — the gate fails (record cap).** Amendment 2, row 10, second bullet:
- Exact text: "It is clean neither at `0ada14f` nor at the head. No file's hunk count rises."
- Why it fails: both sentences restate the table at `state/consults/2026-09-27-kernel-close-races-suites-76f92ba.md:230-258 @ bfb436d sha256:4be31d1b352af93077a5acfe817f0c786458e53f78dd4e2f5d513cc35846b073`, which row 10's first bullet already pins. That is prose restating a claim a reference carries, a failure by name under `state/directives/2026-09-18-record-cap.md` item (1).
- What stays: row 10's third bullet can stand. Its reason sentence ties the table to the form's own §2e item 1 and Amendment 1, 1.2, which the reference alone does not carry, and its "no formatting pass" sentence is the disposition.
- Fix: append Amendment 3, class 3, one row of at most three sentences:
  - the defect: row 10's second bullet restates that span;
  - the corrected reference: that same span, already in row 10's first bullet;
  - the proof: that span.
  - It ends with a superseded index: "Amendment 2 row 10, second bullet → row 10's first-bullet reference".
- This is record round 1 of 2. Only the new amendment gets re-gated.

**N1 — pin versus tree (round 14 addition).** Amendment 2 names merge-base `0ada14f` and head `76f92ba`, but the branch has since merged main at af77861, so its merge-base is now c4300c9.
- The pin is authoritative for everything the record measured.
- af77861 differs from 76f92ba only by 00c3807 (this form, which §7 excludes) and by main's 188b1f8, bfb436d and c4300c9. By their subjects those touch only `state/`, PLAN, the queue and site, all of which §7 excludes.
- The reviewer recounts §7 at af77861 against c4300c9. If it gives 786 lines and 11 files, no row is owed; any other figure needs a class-8 row. The reviewer also reads branch CI at af77861 (the record names CI at 76f92ba).

**N2 — row 10's disposition is allowed.** §9's "`cargo fmt --check` on the changed files, green" could not be met inside this form:
- §2b says "Code moves at its existing indentation".
- Amendment 1, 1.2 declares a one-line form that rustfmt rewrites.
- Block-on-sight 18 forbids touching any other line in the two B1 files.
- Several changed files were already dirty at base (skp.rs has 99 hunks there).

The specific declarations govern the general suite line. So the gate reads §9's fmt item as "no changed file's rustfmt hunk count rises, and new test code is clean", which the pinned table shows. The §9 wording was my drafting defect. This proposes no new clause.

**N3 — row 11's routing is allowed.** The stale "even one no client holds" comment in `open_dataset`'s sink is in code §5 declares unchanged, so it could not be fixed in-piece. The B1 cite shifts are routed by Amendment 1, 1.4. Node `kernel-close-races-followups` is on main at c4300c9. The sink comment is now false about the shipped build; order that node early.

**N4 — ADR-035's text goes stale at merge (advisory, not blocking).** Three passages describe code this piece removes or changes:
- Decision 3's "A generation with no session reference still emits" bullet;
- its sub-bullet saying `invalidate` marks before it looks for a live generation;
- Decision 2's "mint-race arm".

§8 item 15 correctly forbids editing ADR-035. A dated note is owed; a skeleton is below. The same holds for the SKP-V0 §8 second note's open question, which round 23 item 2 already settled; no edit is needed there.

**N5 — the form contradicts itself on `engine/`.** §5 declares `engine/**` unchanged and §8 item 7 blocks any diff under `engine/`, while §2e item 4 and §8 item 10 mandate the one appended row in `engine/SOURCE-WATCHER-PREREGISTRATION.md`. The specific items govern, so that row is allowed. This is my drafting defect; no action.

**N6 — P2's base half is unmeasured, and the record says so.** The claim that only CR2 and CR4 fail at base is evidenced for the lib target only (`state/consults/2026-09-27-kernel-generation-close-races-worker-report-1.md:23 @ d4245fe`, the span row 3 pins). The reviewer's §9 test-first re-run at 051c56f can close it by running the whole kernel suite. This is not a class-2 miss.

## §9 list

- **ADR-019.** Pass. A ticket minted after `begin_close` fails attribution and is cancelled through the existing `StreamRegistry::cancel`. `StreamRegistry` and `create_from_ticket` are unchanged (their line positions match main; the reviewer confirms by diff).
- **ADR-035 Decisions 2–5 and the Note.** Pass.
  - `begin_close` leaves `live` in place, so an end recorded during the close still emits (E7, plus the recorded extra at 12ccbeb).
  - An end after `forget` writes nothing and emits nothing (CR4).
  - Decision 4's mint happens only in `open_dataset`. The code sites are `skp.rs` 1164 and 1176, which match the P3 grep at `state/consults/2026-09-27-kernel-close-races-suites-76f92ba.md:264-273 @ bfb436d`, whose other hits are all test code (the first `#[cfg(test)]` is at 2045).
  - Staleness: see N4.
- **Round 22 item 1 and round 23 item 2.** Pass. `live_generation` has no mint, and `mint_for_open` is the only `live.insert` (skp.rs 533). CR1 asserts that `live` is exactly B carrying `open_b.session`, that no ticket exists and that nothing was emitted, and it fails under the registered mutation (restoring a minting arm) at 12ccbeb. So the unheld path cannot be reached, and CR1 is the test that proves it.
- **The caller rule.** Pass.
  - `NotLive` and `live_generation` are `pub`, and their product caller is `viewport_query_mint`.
  - `begin_close` is `pub(crate)`, called from `close_dataset`.
  - The three step methods are private, and `viewport_query` is their only product caller.
  - No test-only `pub` item, hook or `cfg(test)` branch was added to product code; the cfg(test) items at 2045–2100 predate this piece.
- **The seam.** Pass. The race now answers with the existing `SkpError::unknown_dataset`, and H1 (the shell's `forDataset` guard drops it) was read at 3b421d5.
- **docs/01 principle 8.** Pass. The `unwrap_or(ObservedChange)` fallback is gone, and a race with no recorded end now answers `skp.unknown_dataset`, not a false session-ended claim (CR3). The two pairs of detail strings are byte-identical to main.
- **ADR-010 rules 6–7 and ADR-018.** Pass.
  - The `closing` bound is declared structurally, including the residual left by a close that unwinds; that residual clears on a repeat `close_dataset`.
  - The refusal is typed and surfaced.
  - The new tests use no clock and make no timing claims.
- **§8, item by item.**
  - Items 1–10: pass. The new tests use `try_recv` only, with no sleep, spawn or timeout. `close_dataset` runs in §2c's order. `invalidate` marks only after `live.remove`. The shell diff is one comment. E5, E7, E8, K10 and K15 changed only in comments.
  - Item 11: pass. No record calls a `verify-mutation` run an observation, and every doc-comment observation names 12ccbeb or 051c56f.
  - Item 12: pass. The class-8 row carries the words `budget overrun, §7 not edited`, and §7 still reads ≤ 600 lines and ≤ 10 files.
  - Item 13: pass. The reflog order is e2528ea (Amendment 1), then 76f92ba (the eight lines).
  - Item 14: pass. Every hash is at a commit on main; no line cite goes into `DECISIONS-PENDING.md`; there is no bare self-line and no branch-commit test-text pin.
  - Items 15 and 17: pass.
  - Item 16: pending, until the merge.
- **Block-on-sight 18.** Pass on the tree. The numstat shows 7/0 in `skp_projection.rs` and 1/0 in `wire_bytes_invariant.rs`. All eight lines are in 1.2's form, and each sits directly after its `SkpHost::new` statement (for `check_one`, line 580 follows the statement spanning 574–579). The reviewer confirms that 76f92ba's own diff touches only those eight lines.
- **Block-on-sight 19.** Pass. The mint step's order matches main: the live check, then `build_viewport_query` with `viewport_query_build_error_of`, then `open_engine_stream(ds, &query, projection.as_ref())`, then the wrap, then `tickets.mint`. No projection refusal can come after the stream.
- **1.5.** Pass. The merge adds no behaviour: the changes are `ds`/`dataset_name` borrow adjustments plus `columns: None` in the test helper.
- **1.1's rule.** Pass. Round 23 item 2 is the ruling that makes the on-demand mint the B1 tests relied on unreachable, and class 9 is the only class that widens a piece.
- **Amendment 2 against the template.**
  - Every row is classed, and every hash is at a commit on main.
  - The class-8 row records the declared and final figures (the final one at a named commit, 76f92ba) and the reason.
  - Row 1's commit identifications and row 6's CI run IDs are references, not restated prose.
  - Only row 10's second bullet fails (F1).

## Skeleton for the note to ADR-035 (for the human; append-only, never an edit)

- **Context:** `kernel-generation-close-races` (merge commit to be named) closes the close race that ADR-035's Note 2026-09-25, item 3 left to this node.
- **Decision (recorded, not new):**
  - After the merge, only `open_dataset` inserts a live generation, so Decision 3's "no session reference" case is unreachable.
  - `invalidate` marks only when it removes a live generation.
  - A query racing `close_dataset` answers `skp.unknown_dataset`, linearized at `begin_close`.
- **Consequences:**
  - Decision 3's bullet and its sub-bullet on marking, and Decision 2's "mint-race arm" wording, are historical as of that commit.
  - No wire change.
  - Carried by a proposed docs node, or by `kernel-close-races-followups`.

## Files

- `C:/dev/wt/kernel-close-races/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` (§10, Amendment 2, row 10)
- `C:/dev/wt/kernel-close-races/kernel/src/skp.rs`
- `C:/dev/spatial-ide/state/consults/2026-09-27-kernel-close-races-suites-76f92ba.md`
- `C:/dev/spatial-ide/state/consults/2026-09-27-kernel-generation-close-races-worker-report-1.md`
- `C:/dev/spatial-ide/state/consults/2026-09-27-kernel-close-races-merge-observation.md`
- `C:/dev/wt/kernel-close-races/docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`
