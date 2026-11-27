# The recovery offer's Part 1 against the C1 piece's head and B's head: the architect's narrow read, no verdict (node:b2-piece-1c-step-3-recovery-offer@base-read)

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-33-three-free-places-the-null-refusal-builds-on-the-c1-head-the-recovery-offers-k-c34-row-and-a-narrow-read-now-the-fixture-node-s3.md`, item 3. The architect (Opus) was dispatched with its brief byte for byte (brief-recov-arch-read.md in the scratch folder), read only. By the facts script, its run went from 2026-11-27T22:01:21Z to 2026-11-27T22:09:52Z; by its completion notice, 84 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed; its four marked quotes were checked byte for byte by the custodian against D:/wt/reload at 5ce0525a and the form on main. The custodian shortened 2 rooted line cite(s) whose path is not on main to the file name, by script, and changed nothing else: they read `ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:40` (under docs/adr) and `page.rs:47-74` (under frontends/shell/src-tauri/src). It goes to the advisor, who rules the base before Part 1's code. Not a gate.*

---

main @ 7229527785ab58e71eed72d1d7840a87ff0b0e97 (the form, the ruling, the other pieces' forms); cut/text-id-reopen-with-a-recorded-declaration @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 (D:/wt/c1rd, the C1 piece's head); cut/reload-ends-the-old-pages-opens @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 (D:/wt/reload, B's head). I took the three commit ids from the refs under `C:/dev/spatial-ide/.git/refs/heads/`. I read each checkout in place. I had no git, so I could not see whether a worktree has uncommitted changes.

# The recovery offer's Part 1 against the C1 head and B's head: a narrow read by the architect (no verdict)

Under ADV-2026-11-27-33 item 3, for PLAN node `b2-piece-1c-step-3-recovery-offer` (node:b2-piece-1c-step-3-recovery-offer@base-read). Text not marked verbatim is paraphrase. Rulings are cited by id and item.

How the cites are written: [M] is the main checkout at 72295277, [C1] is D:/wt/c1rd at f7770e1a, and [R] is D:/wt/reload at 5ce0525a. "The form" is `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` [M]. The [C1] and [R] cites point at branch commits, not at main.

## 1. The three handlers and the shell's calls, against ADR-037 as B has it

**What ADR-037 counts** (paraphrase, except where marked):
- The page's opens are the names that `open_dataset` and `open_project` returned to the page, and the cancel keys of those commands still in flight. Verbatim, `ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:40` [R] (a sub-line span): "nothing else."
- The premise in :44 [R] is that the catalog gains an entry only through `SkpHost::open_under`, and that only those two commands reach it.
- Only those two commands wait at the gate (:85 [R]).
- B's code implements exactly that set:
  - `State.names` and `InFlight` are in `page.rs:47-74` [R].
  - Verbatim, `page.rs:216` [R] (a sub-line span): "The gate (ADR-037 section 5), for the new page's `open_dataset` and `open_project`."
  - The two commands call `admit` and then `settle` (`frontends/shell/src-tauri/src/commands.rs:87-94` and `:249-259` [R]).
  - `close_dataset` calls `forget` (`commands.rs:173` [R]).
  - The end cancels only the keys in `in_flight` and closes only the names in the set (`page.rs:477-504` [R]).
- ADR-037 leaves this question open. Verbatim, `ADR-037…md:188` [R] (a sub-line span): "The recovery offer's product caller."

**`list_recoverable`.** It starts, holds, ends and cancels no open and no publish.
- It reads `sessions/` and takes and releases a `try_lock` per record. It never calls the host's open path (the form §2.3, :65-78; Amendment 10 item 2, :2012-2016).
- Its handle form reads the binding of an open that `open_project` returned (Amendment 10 item 2, :2041). B already counts that open.
- B's code asks nothing of this handler. Under ADR-037 §5 it does not wait at the gate.

**`recover_session`, the null-dataset arm.** It **starts an open**.
- Verbatim, the form :83 [M] (a sub-line span): "through `host.begin_open(cancel_key)` and `host.open_under(..)` as `open_project` builds the request".
- It returns a `DatasetHandle` (§2.4, :104-107).
- So it is a third route from the page into `SkpHost::open_under`, and the premise at ADR-037:44 [R] no longer holds at Part 1's head.
- **ADR-037 does not count this open as written** (:37-40 [R]). The form as it stands, Amendment 10 item 2 "Callers" (:2034-2039 [M]), routes the handler through no `Pages` call. Ordinary use then reaches this case: crash, start, Recover, then Ctrl+R or F5.
  - The end does not close the recovered open. It stays in the catalog with its pool and its watch until the process exits, and the new page cannot reach it. This is the shape of ADR-037's Context fault, without a project lock, because the arm binds no project (§2.3 :88).
  - The end does not cancel an in-flight recover's key either. If the recover completes after `Started`, no late close runs. That is contrary to ADR-037 §4's rule at :64 [R], which is stated for the two counted commands.
- **What B's code asks, if this open is to be counted:**
  - the pattern of `open_dataset` (`commands.rs:86-101` [R]): `pages.admit(&request.cancel_key).await?` before the kernel call;
  - then `pages.settle(ticket, name, &host, projects_of(&app))` after it;
  - a pool poll only on `Settled::Current`;
  - `close_dataset` already calls `forget` for any name (`commands.rs:173` [R]).
  - `Pages` exposes nothing else: its public items are `admit`, `settle`, `forget`, `page_started` and `cancel` (`page.rs:195-447` [R]).
- **Counting it widens ADR-037 §2's set past "nothing else", and §5's list of waiting commands.** That is a matter for ADR-037, which is an accepted ADR. Leaving it uncounted leaves the residual above. This read does not choose between the two, and drafts no ADR text, under the brief's limit.
- **Cancel.** The shell's `cancel` goes through `Pages::cancel`, which asks the kernel first (`page.rs:420-446` [R]). A key that `begin_open` has registered is answered by the kernel, unchanged. The window before `begin_open` answers `unknown`, as B's doc names for today (`page.rs:414-416` [R]). B asks nothing more here.

**`recover_session`, the handle arm.** It starts and ends no open.
- It adopts the record into an open that `open_project` returned. B already counts and settles that open (`commands.rs:249-259` [R]).
- B's end can close that open at any point (`page.rs:499-504` [R]). The form does not say what `recover_session` answers when the handle is closed under it.
- That case needs a reload to land inside one request round trip, so it is named here, not raised as a gap.
- After the end, the adopted record stays with the run (ADR-037 §8, :112 [R]), and the reopen continues it (:139 [R]).

**`discard_recoverable`.** It locks the record and removes it (§2.3 :91; Amendment 10 item 2). It touches no open and no publish, and B asks nothing of it.

**The shell's calls** (§2.7 :141-148; Amendment 10 item 2 :2037-2038):
- `listRecoverable(null)` runs at mount, so it runs again on every new page. The new page's listing skips the records this run holds (§2.3 :68), so an earlier page's records are not offered. That matches ADR-037 Consequences (e) (:140 [R]).
- `listRecoverable(handle)` runs after a counted reopen.
- Recover's `admit` goes through `runAdmitPath`, with the null-arm open above.
  - At the C1 head, `runAdmitPath(path, options, deps)` calls `deps.admit(path, cancelKey, options)` and branches on `question` and `not_found` (`frontends/shell/src/admission/AdmissionPanel.tsx:326-355` [C1]).
  - Part 1's `admit` is written against that shape.
- Discard calls `discard_recoverable`, and `handleRecovered` applies intents. Neither touches an open.
- No handler and no shell call starts, holds, ends or cancels a publish.

## 2. Shared paths (each path once; Part 1 = P1, Part 2 = P2)

Source of the facts:
- B, A, PR A, `shell-scale-display` (PR 368) and `identity-scan-refuses-a-null-by-name`: read from their forms [M] and from their checkouts.
- The held PRs in `C:/dev/wt/` (350 to 367): I did not read their branches. Those rows rest on the recovery form's own table (§2.11 :221-229, Amendment 2 N-7 :750-759).
- Rule (00) asks the custodian to confirm every row by `git diff --name-only` per branch before the base ruling.

Pieces already inside the C1 head:
- PR A's code: `frontends/shell/src/conditions/` exists at [C1] and not at [M]. PR A's form, Amendment 13 item 4 (:2052 [M]), says the identity route took d6c2daf6 in.
- PR 365's code: `frontends/shell/e2e/colour-refill.mjs` exists at [C1] and not at [M].
- Text-id and the identity route.
- Their paths are carried by the base. A later move of their heads would come in by a merge.

| Path | P1/P2 | Shared with |
|---|---|---|
| `frontends/shell/src-tauri/src/commands.rs` | P1 | **B** (`page.rs` gate and `forget` calls, module doc :16-20 [R]); PR 356 (form :757; B's base holds PR 356's head, B's form Amendment 2 item 1 :737 [M]) |
| `frontends/shell/src-tauri/src/lib.rs` | P1 | **B** (`mod page`, doc :13-18, `Started` arm :270-278, `Pages` managed :556, handler list :616-639 [R]) |
| `frontends/shell/src/App.tsx` | P1 | PR 368 (scale form §7 :233, §9 :295 [M]; `scaleBar.ts` exists at D:/wt/scale and not at [C1]); PR 365 and PR A, in the base, if their heads move |
| `frontends/shell/src/project/saveProject.test.ts` | P1 (literal: `skp/0.17` at :70 [C1]) | **A** (A's form §7 :289 [M]; at D:/wt/a2save its literal stands at :88) |
| `frontends/shell/src/console/surfaceRegistry.ts` | P1 | PR 359 (form :226); PR A (in the base) |
| `frontends/shell/src/admission/admitDataset.test.ts` | P1 (literal) | PR 360 (form :227) |
| `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/commands.rs` | P1, P2 (SKP-V0) | the relink branch (form :228). The protocol line follows ADV-2026-11-27-33 item 5: the fixture node comes after this piece and touches none of its files |
| `frontends/shell/e2e/README.md` | P1 (`recover.mjs` entry) | B (Project entry), A (C-E2 entry), PR A, PR 368, PRs 359, 363, 365 and 366. Separate entries count as separate paths under rule (00a) |
| `KNOWN-LIMITATIONS.md` | P2 (items 43 and 70, and a new item "at the next free number at Part 2's base", Amendment 13 item 5 :2499 [M]) | PR 368 (new item), PR A, PR 365, PR 358, the relink branch. Separate items, but the new item's number depends on which of these the base holds |
| `frontends/shell/MANUAL-WALKTHROUGH.md` | P2 (new Part, "the letter after the last on the base", §9 :354) | A (spans in AD1, AE2 and AF3a), PR 368 (new Part), PR A, PR 365, the relink branch. The Part letter depends on the base the same way |

Not shared with any piece read here:
- the kernel files (`recovery.rs`, `session_history.rs`, `lib.rs`, `project/store.rs`, `tests/recovery*.rs`);
- `skp/client.ts`, `skp/types.ts` and `formatRefusal.ts` beyond the base;
- the conformance fixtures and their README;
- `docs/adr/ADR-036…`.

The null-by-name piece is engine-only, plus `kernel/tests/skp_admission_remediation.rs` (its form :265-271). B's other files (`page.rs`, `project.mjs`, `e2e-test-surface.ts`, ADR-037, `docs/README.md`) are not recovery paths.

**A fact about the literal at the C1 head.** §2.4's grep (:126), run for `skp/0\.17`, also lists files where the version appears only as an annotation of the version a feature came in:
- `frontends/shell/src/admission/AdmissionPanel.tsx:220` [C1];
- `kernel/src/skp.rs:2262` [C1].

`AdmissionPanel.tsx` is under §8 item 6 and I8, which forbid editing it. Whichever base is ruled, the literal's file list is resolved at that base, before the literal moves.

## 3. The base recommended: the C1 head with B's head merged in by the custodian

- Part 1 writes into the two files B changes (`commands.rs`, `lib.rs`), and the piece merges after B anyway. Merged in before code, the handlers are written against `Pages` as it actually is (the seam rule) and not against C1's copies of those files. At [C1] they still match main: the handler list is at `lib.rs:550`, and `open_dataset` and `open_project` are at `commands.rs:63` and `:204`.
- Item 1's open question about the null arm can only be answered and proven against B's code and against ADR-037 in the tree. On C1 alone, ADR-037 is absent. Part 1's T-1 and E-RECOVER would then be proven on a tree the merge changes, and the later merge of B would change gated Part 1 code.
- What it costs:
  - B is unmerged and waits on its run part. If its head moves, the move comes in by a merge commit with the reviewer's narrow read, as for the null-by-name piece (ADV-2026-11-27-33 item 2).
  - The merge also brings in PR 356's head and main at e9b61547, both from B's base (B's form Amendment 2 item 1). That adds no order constraint, because B already merges after PR 356.
  - B touches no `protocol/` path and no `skp/` literal.
- One wording point for the amendment that records the base: in the form, "B" is the recorded base commit (§2.11; Amendment 10 item 5), while the rulings use "B" for the reload piece. With B merged in, the form's "B" would contain the rulings' "B".

Files read:
- C:/dev/spatial-ide/governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md
- C:/dev/spatial-ide/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-33-three-free-places-the-null-refusal-builds-on-the-c1-head-the-recovery-offers-k-c34-row-and-a-narrow-read-now-the-fixture-node-s3.md
- C:/dev/spatial-ide/governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md
- D:/wt/reload/docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md
- D:/wt/reload/frontends/shell/src-tauri/src/page.rs
- D:/wt/reload/frontends/shell/src-tauri/src/commands.rs
- D:/wt/reload/frontends/shell/src-tauri/src/lib.rs
- D:/wt/c1rd/frontends/shell/src/admission/AdmissionPanel.tsx
