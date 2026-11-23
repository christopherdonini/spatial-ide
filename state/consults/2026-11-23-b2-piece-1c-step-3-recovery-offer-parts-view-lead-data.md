*Filed by the custodian: lead-data's view on building the recovery offer in parts, asked by the advisor's ruling ADV-2026-11-23-22 item 5 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-22-the-bullet-as-ruled-op6-accepted-no-narrow-read-the-third-place-takes-work-5260-not-accepted-yet-c2-fix-i.md`), node:b2-piece-1c-step-3-recovery-offer@parts-view-lead-data, dispatched at 2026-11-23T17:13:04Z. Its run: Read 24, Grep 11, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T17:13:04Z to 2026-11-23T17:22:08Z by its transcript; 0 calls named the main checkout. It read main at 6cf6140c and Amendment 4 from its hand-back, since filed. The report below from its hand-back, 13368 bytes, sha256 0ea18e14cb5c3308d35da3a645988283e6f915015a34a3da6ded26bfa9f101a5, byte for byte, with one final newline added. Nothing in it is ruled: the size and any split are the advisor's.*

---

Result: Yes, a limited split works under one wire version and the strict caller rule. Part A is the declared writer item, about 90 lines. Part 1 is the three commands at one version with their shell callers, about 4,500 lines. Part 2 is Amendment 4's clear at an open and the twin removal, which needs no wire change, about 700 to 800 lines. No one-version cut brings the part that carries the commands below about 4,500, and smaller parts would need a second SKP version, which departs from the human's OPEN-3 (A).

Every `path:line` is read at 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 in `C:/dev/wt/read-1123w`. Amendment 4 is cited as `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-4-lead-data-draft.md`, by item. I read ADV-2026-11-23-22 item 5 only in the brief's paraphrase, because it is not on that commit. Line counts are drafter's estimates, counted both numstat columns, in §2.11's groups. I rule nothing: the size and any split are the advisor's.

**1. Build in parts: yes, limited to three parts.**
- **Why it is possible.** Every `pub` item and wire command can stay in the same part as its product caller. Part 2 adds only private functions, called from commands that Part 1 has already shipped with their shell callers.
- **What it gains.** Amendment 4 items 2 and 3 are the removal logic that grew the piece: lock probes, removals under the lock, and the twin search. They get their own pair of gates. The declared writer item can land early, because its caller exists today.
- **What it does not gain.** Part 1 stays about the size the advisor accepted, not much less. The three commands, their one literal and fixtures, the src-tauri handlers, the shell callers and the e2e must land together. That is the same reason the 1c form gives for P3b-2 (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:3095`). Any further cut is a second version, which is a departure from the human's ruling (item 3).
- **Step 2's precedent is not used.** Step 2 also used R2's pre-committed producers (ADV-2026-11-16-10 item 2; `.claude/agents/architect.md:11`, "a producer pre-committed by the human with its consumer named and gated may land ahead of that consumer; it exempts nothing whose consumer is undesigned."). The brief excludes that, so no part below relies on it. Whether to allow it is the advisor's.

**2. The parts, in build order**

**Part A: the declared item (§2.5; ADV-2026-11-16-16 item 2 (b)).**
- **Files:** `kernel/src/session_history.rs` only, the record's `locations.json` writer. About 25 product lines and about 65 for K-C8's unit test, so about 90.
- **Commands, seams, surfaces:** none new. The seam is `store::locations_to_bytes` → the record writer.
- **Caller:** the existing `record_step` path, with `frontends/shell/src-tauri/src/commands.rs:160-172` as its product caller.
- **Tests:** K-C8, with its mutation (the inline lossy writer restored). It is red at base by behaviour.
- **Gates:** full, both gates, under ADV-2026-11-16-06 item 2 (a). It is a persistence writer, and it adds a refusal the user is told (Amendment 2 N-5). It may be folded into Part 2 to save one pair of gates.
- **Base and merge:** base is main. No path is in §2.11's shared-paths table, but the custodian checks it against PR 361's file list before code. It merges before Part 1 is cut, or Part 1 takes it in by a merge commit. Whether it waits for the v0.2 tag and for step 2 being done, as the node does, is the advisor's placement.

**Part 1: the three commands at `skp/0.15` (or the next unused literal, Amendment 2 N-6).**
- **Files:** everything in §2.11 as Amendments 2 and 4 revise it, except Part A's region and Part 2's regions. Estimates by group:
  - protocol about 330
  - conformance about 220
  - literal about 260
  - kernel product about 820, in `recovery.rs` (new), `session_history.rs`, `lib.rs` and `project/store.rs`
  - kernel tests about 1,430
  - src-tauri about 100
  - shell product about 500
  - shell tests about 500
  - e2e about 300
  - KNOWN-LIMITATIONS about 50
  - Total about 4,500.
- **Commands it adds:** `list_recoverable`, `recover_session` and `discard_recoverable`, with all four codes.
- **Kernel seams and items:**
  - `Open.reopened_as`;
  - `recover_bytes` made `pub(crate)`;
  - the bounded two-line read;
  - the `LOCATIONS_LIMITS` bound;
  - `MAX_RECOVERABLE_RECORDS` and `MAX_DEDUPE_RECORDS`;
  - the start walk and Amendment 4 item 4's dedupe, with K-C27's private parameter;
  - step 3a;
  - adopt, identity and bind;
  - OPEN-4 (B) entries;
  - the `restored` mark read as `later-version` (Amendment 4 item 7).
- **Shell surfaces:** `RecoveryOffer.tsx`, `handleRecovered`, the client wrappers, three registry rows, and the codes in `formatRefusal.ts`.
- **Callers:**
  - each command: its src-tauri handler, then `skp/client.ts`, then `RecoveryOffer` (mounted, and after an `opened` reopen) or `App.tsx`;
  - each kernel item: one of these commands.
- **Tests:**
  - K-C1 to K-C7;
  - K-C9 **as filed in §4**, with mutation "mark not considered";
  - K-C10, K-C11;
  - K-C12, with Amendment 4 item 6's mutation;
  - K-C13 to K-C16;
  - K-C17, renamed by Amendment 4 item 7 (N-17);
  - K-C18, K-C19;
  - K-C20, with Amendment 4 item 6's text;
  - K-C21, K-C22;
  - K-C23, with Amendment 4 item 8's 257-folder form;
  - K-C24 to K-C27, K-C36, K-C37;
  - P-1, T-1;
  - S-1 (Amendment 4 item 1), S-2 to S-8;
  - E-RECOVER.
  - Each keeps its filed mutation. All are red at base by compile.
- **Gates:** full, both gates (wire).
- **Base:** the recorded base B of Amendment 2 N-7: main's tip plus PRs 356, 359 and 360 and the relink branch's head, which holds PRs 353, 358 and 359.
- **Merge:** after Part A, and on §9's terms as Amendment 2 N-7 revises them: after the v0.2 tag, after step 2's node is done, after every base and PR 361, as a merge commit.
- **The OPEN-2 record in this part.** A project's record with nothing after its last mark is not listed, as filed. Item 70's sign stays until Part 2.
- **Interim gaps, to name in Part 1's limitations or accept:**
  - item 70's sign for that case;
  - a twin left after its project's record is recovered or discarded, then listed at a later start (Amendment 2 item 8 (a)).
- ADV-2026-11-23-16 items 4 and 5 are met only when Part 2 merges.

**Part 2: Amendment 4 items 2 and 3, the clear at an open and the twin removal.**
- **Files and estimates:**
  - `kernel/src/recovery.rs`: about 160;
  - `kernel/tests/recovery.rs`: about 500, appended tests plus K-C9's change;
  - `protocol/skp/SKP-V0.md`: about 20, as a dated note with no literal change, because §8 and below is append-only (`protocol/skp/SKP-V0.md:576-577`);
  - `KNOWN-LIMITATIONS.md` items 70 and 76: about 16;
  - `frontends/shell/MANUAL-WALKTHROUGH.md`, the whole operator Part: about 110.
  - Total about 700 to 800.
- **Commands, seams, surfaces:** none `pub`. It adds private functions for the clear (item 2) and the twin search (item 3).
- **Callers:** the clear is called from `list_recoverable(handle)`. The twin search is called from `recover_session` (step 4a), `discard_recoverable` (step 3a) and the clear. All three are in Part 1.
- **Tests:**
  - K-C9, as Amendment 4 item 8 changes it. This replaces Part 1's row, so it is a declared edit of an existing test.
  - K-C28 to K-C35, with Amendment 4 item 8's mutations.
- **Gates:** full, both gates (concurrency, removals, what the user is told).
- **Base and merge:** base is main after Part 1 merges. It is a `protocol/` piece for the slot rule. The node is done only after this part merges.

**3. What the split costs**
- **Tests that span parts:**
  - K-C9 is written twice (Part 1 as filed, Part 2 changed).
  - K-C28, K-C29, K-C34 and K-C35 pass at Part 2's base. Part 1 never clears a record or removes a twin, so they cannot be red before their code. Their evidence is the mutation alone, and the later amendment must declare that against §4's heading rule.
  - Part 1's tests must build no project's record with nothing after its last mark, except K-C9 as filed. Otherwise Part 2 breaks them (I3).
- **`SKP_VERSION`:** Part 1 alone bumps the literal. Parts A and 2 bump nothing. A version freezes at merge (`protocol/skp/SKP-V0.md:314-319`). Part 2 changes what the commands remove but no field (:305), so it needs a contract ruling (question 1 below).
- **The operator Part and OP6:**
  - The walkthrough says "OP6 joins this Part with step 3." (`frontends/shell/MANUAL-WALKTHROUGH.md:2023`). ADV-2026-11-23-16 item 8 moves OP6 to this form.
  - I recommend the whole Part (OP-R1 to OP-R5 and OP6, one blank log) lands with Part 2 and is run once after it merges, as step 2 ran its Part after its parts.
  - The other way: OP-R1 to OP-R4 and OP6 land in Part 1 and OP-R5 in Part 2.
- **The sitting of 2026-11-24:** nothing in any part lands before it, and the split adds, moves or edits no row of it. I did not read the sitting script. ADV-2026-11-23-16 item 8's check, whether it names OP6, is the custodian's and is unchanged.
- **Overhead:** about 135 lines. That is K-C9 twice, item 70 worded twice (the advisor words both, ADV-2026-11-23-16 item 7), an interim twin line, and the 76 bullets in two turns. Beyond that: three pairs of gates instead of one, and Part 1 waiting on the slot rule's single `protocol/` piece.

**4. The form text a split needs (a later amendment; not drafted here)**
- the title block's "Form and gating" line;
- §1 (what each part may claim);
- §2.3 and §2.4 (which part each rule lands in). Amendment 4 item 2's §2.4 addition and its "Listing removes nothing" replacement move to Part 2's dated note;
- §2.9 (seams by part);
- §2.10 (item 70 per part, item 76 split, the interim twin line);
- §2.11 (per-part files, ceilings by group, counting base, shared paths). This supersedes Amendment 4 item 11;
- §2.12 (a split row);
- §2.13;
- §4 (each row's part; K-C9's two forms; the red-before-fix exception for K-C28, K-C29, K-C34 and K-C35). This supersedes Amendment 4 item 8's "Red before the fix" for Part 2;
- §5 (predictions, I7 per part);
- §7 (which part brings each site; no line edited);
- §8 (item 14 in Part 1; items 13 and 15 in Part 2, and item 13 also for Part 1's discard);
- §9 (gates per part, the operator Part's place, the merge order, the node done only after Part 2).
- Each part is then declared before its code, as Amendment 30 declared P1a and P1b.

**5. The cut by version, and the smallest whole**
- **Under one version:** the split above keeps every command with its caller. The smallest part that carries the commands is Part 1, about 4,500 lines. Unsplit, the whole is ≤ 5,260, as Amendment 4 item 11 declares.
- **Smaller parts need a second literal:**
  - The best two-version cut, by record kind, has three parts:
    - **P:** a project's record at its open; all three commands, handle only; about 2,300 to 2,500 lines.
    - **T:** items 2 and 3; about 700 lines.
    - **U:** sessions that never saved, at start; the null arms, the walk, item 4's dedupe, step 3a and `opened`; about 2,600 to 2,800 lines, including the second literal move.
  - The total is about 5,900 to 6,000 lines.
  - A by-command cut (list and Discard first) is worse. Between its parts it shows unsaved work with Discard only.
- **The ruling it departs from:** the human ruled the 1c form's OPEN-3 (A), "three PRs, each with its own SKP version" (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:803`; `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:16`). ADV-2026-11-16-10 item 1 (a) kept it for step 2 by giving P3b alone the version.

**Files read:**
- `kernel/README.md:357-402`; `engine/README.md:533-567`;
- `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` (whole);
- the Amendment 4 hand-back;
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`: :770-811, :1887-2025 and :3085-3109, plus grep hits;
- `.claude/agents/architect.md`;
- the ADV-2026-11-16-06, ADV-2026-11-16-10 and ADV-2026-11-23-16 directives;
- `state/directives/2026-10-08-round-70-rulings.md`;
- the 2026-10-21 directive;
- `kernel/src/session_history.rs:280-459`;
- `frontends/shell/src-tauri/src/commands.rs:150-229`;
- `protocol/skp/SKP-V0.md` (headings, :303-335, :389-392, :574-577, :676-693);
- grep hits in `frontends/shell/MANUAL-WALKTHROUGH.md` and `state/CUT-STATE.md`.

**Questions to the custodian. None is ruled here, and none blocks the attempt-3 gate:**
1. **Contract.** May Part 2 change what `list_recoverable(handle)`, `recover_session` and `discard_recoverable` remove under the merged `skp/0.15`, with a dated note and no new literal? If not, Part 2 needs a second version, the same departure as item 5's.
2. **Red line.** A two-version split of step 3 departs from the human's OPEN-3 (A). Whose ruling is that?
3. **Placement.** The node is not done, and no release is cut, between Part 1 and Part 2. This is ADV-2026-11-23-16 items 4 and 5's "after this piece", with the gap in the spirit of ADV-2026-11-16-10 item 2 (c). Does the advisor accept that?

Report path: `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-parts-view-lead-data.md`
sha256: not computed, because I have no hashing tool. The custodian hashes this message's bytes at filing.

Opus 5.5 (claude-opus-5-5)
