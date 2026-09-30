# Consult — the architect's draft for node 3's second piece, the A4-1 and A4-3 src-tauri lines (2026-09-30)

*Custodian's filing note: the architect agent's final report, delivered as a hand-back message on 2026-09-30 (enqueued 18:26:48Z), on the custodian's brief (a drafting consult, not a gate), read at main 0f98934. Recorded verbatim below the rule, from the message, with the harness's report indentation removed, except for one elision marked in parentheses: the DRAFT section, committed as `frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md`, the first commit of branch `cut/publish-refusal-src-tauri`, with the edits its header lists. It is not committed on main: node 3's PLAN `gate` names the first piece's form until that piece merges, and `verify-test-claims` treats only a non-done node's gate file as planned. The custodian's checks before commit, at 0f98934: `BoundaryError` has the four variants the report names; `execute_with_progress`'s final match has no cancelled outcome, so a cancelled execute answers `ExecuteOutcome::Refused` through the catch-all; the pin-phase arm catches `EngineError::Cancelled` one line above the `Failed` arm; `PublishError::code` has `publish.cancelled` and `publish.engine`, and `From<EngineError>` maps `Cancelled` to `Cancelled`; the ten declared-unchanged test names and the `prepared` and `unpinned_fixture` helpers exist in `publish.rs`; `PublishPanel.test.ts` covers `nextStateFromDialogSettled` and `nextStateFromPrepareOutcome`; SKP-V0 §8's change log is append-only; the deletion-under-an-open-dataset precedent and the `open for hashing: ` detail read as cited; walkthrough row G4 expects `publish-refused` on a wrong phrase; `docs/PREREGISTRATION-TEMPLATE.md` fixes §8 to §10 as Block-on-sight, Gates and Amendments; `AUTONOMY.md` §21c's bounds include no new user-visible behaviour. Its `@ 0f98934` cites are read at 0f98934.*

---

**Verdict: pass with notes.** main @ 0f98934

This is a drafting consult, not a gate. The two lines can proceed under a full form, and no ruling from the human is needed. The draft is below.

**Findings that bind the draft**
- **A4-1 changes one arm.**
  - `BoundaryError` has four variants (`kernel/src/permission/boundary.rs:138-148 @ 0f98934`). Only `Publish(PublishError)` has a code.
  - `Permission` and `Audit` stay `e.to_string()`, as SKP-V0 scopes them (`protocol/skp/SKP-V0.md:754-756 @ 0f98934`).
  - `OutcomeNotAudited` already has its own arm (`frontends/shell/src-tauri/src/publish.rs:728-733 @ 0f98934`).
  - Wrong-phrase refusals are `PermissionError::ApprovalRefused` (`kernel/src/permission/boundary.rs:205 @ 0f98934`). So walkthrough row G4's `publish-refused` stays true (`frontends/shell/MANUAL-WALKTHROUGH.md:327 @ 0f98934`).
- **A4-3 is the line at `frontends/shell/src-tauri/src/publish.rs:1073 @ 0f98934`.**
  - `Cancelled` is caught one line earlier (`:1072`). Every `Failed` is therefore `PublishError::Engine`, which gives `publish.engine` (`kernel/src/publish/error.rs:206 @ 0f98934`, `:363-372`).
  - The message the operator reads is byte-identical, because `Engine`'s Display is the `EngineError` Display (`kernel/src/publish/error.rs:354 @ 0f98934`).
- **No SKP-V0 edit is needed.**
  - The bullet sits in §8's change log, which is append-only (`protocol/skp/SKP-V0.md:536-539 @ 0f98934`).
  - Its general sentence, scoped to `PublishError`, already covers the execute and pin-phase refusals. Its naming of the two preflight sites records where skp/0.3 applied it, and it stays true.
  - `publish.engine` is an existing arm of `code()`, and round 32 G3 (a) ruled it. G3 (c), the spec-edit option, was not chosen.
  - If you want the site list kept current anyway, the form would be an appended note to the skp/0.3 entry. Both earlier notes were appended on the human's rulings (`protocol/skp/SKP-V0.md:800-806 @ 0f98934`, `:869-871`). That makes it the human's call, and I do not recommend it.
- **Consumers.**
  - Nothing in TS product code or `e2e/*.mjs` matches these refusals by their old text. `e2e/publish.mjs` REFUSED' checks only the status.
  - The one publish guidance case (`frontends/shell/src/admission/formatRefusal.ts:118 @ 0f98934`) is a preflight refusal, so no new guidance text appears.
- **Pin-phase fixture precedent.** Deleting the source file after `Dataset::open` already runs on Windows CI (`engine/tests/session_identity.rs:555-558 @ 0f98934`). The resulting error text has no path (`engine/src/index.rs:614-615 @ 0f98934`, `engine/src/error.rs:260 @ 0f98934`).

**For you (the custodian), no ruling needed**
1. Compute every span hash at 0f98934 and add your edits line to the header, as you did on A4-4's form.
2. PLAN node `gate:` names A4-4's form. When this piece is dispatched, name this form in the gate field or the PR body. Node 3 is done only after both pieces, per round 32, "With them".
3. Collision risk: node 8, `publish-attempt-lifecycle-src-tauri`, later edits `execute_with_progress`. This piece keeps its execute diff to one arm.
4. Walkthrough: optional. It is not needed for the gate, because no existing row is falsified. If you want one, queue a single observation for the next batched walkthrough: after Cancel publish (H8a), the refusal block's code reads `publish.cancelled`. Do not edit MANUAL-WALKTHROUGH.md in this piece.

---

(The report's DRAFT section followed here. It is not repeated: the committed form, `frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md` on branch `cut/publish-refusal-src-tauri`, is that draft with the edits its header lists.)

---

Paths read:
- C:\dev\spatial-ide\state\directives\2026-09-30-round-32-answers.md
- C:\dev\spatial-ide\state\questions\round-32.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (the RULED blocks for rounds 31 and 32)
- C:\dev\spatial-ide\kernel\RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-09-30-publish-refusal-codes-architect-draft.md
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\publish.rs
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\commands.rs
- C:\dev\spatial-ide\kernel\src\permission\boundary.rs
- C:\dev\spatial-ide\kernel\src\permission\grant.rs
- C:\dev\spatial-ide\kernel\src\publish\error.rs
- C:\dev\spatial-ide\kernel\src\publish\mod.rs
- C:\dev\spatial-ide\engine\src\dataset.rs
- C:\dev\spatial-ide\engine\src\pin.rs
- C:\dev\spatial-ide\engine\src\index.rs
- C:\dev\spatial-ide\engine\src\error.rs
- C:\dev\spatial-ide\engine\tests\session_identity.rs
- C:\dev\spatial-ide\protocol\skp\SKP-V0.md
- C:\dev\spatial-ide\frontends\shell\src\publish\formatPublishRefusal.ts
- C:\dev\spatial-ide\frontends\shell\src\publish\formatPublishRefusal.test.ts
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.test.ts
- C:\dev\spatial-ide\frontends\shell\src\admission\RefusalBlock.tsx
- C:\dev\spatial-ide\frontends\shell\src\admission\formatRefusal.ts
- C:\dev\spatial-ide\frontends\shell\e2e\publish.mjs
- C:\dev\spatial-ide\frontends\shell\MANUAL-WALKTHROUGH.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\AUTONOMY.md (§21a-d, §25)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\docs\01_Principles.md
- C:\dev\spatial-ide\PLAN.yaml
- C:\dev\spatial-ide\.github\workflows\product-ci-shell.yml
