*Custodian's filing note (2026-10-02): the architect's ruling on how to resolve invalidator I4 for PR #157, PLAN node `workspace-rustfmt`. This is the gate-1 architect resumed on the custodian's message, which proposed (A) a class 9 amendment inside #157 or (B) a redo. Reviewed: cut/workspace-rustfmt @ c6d1414dc063364ffb8e46428d739922d7bafbc7 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's.*

*The ruling is OTHER: fix the test regex on main first, as its own node, and keep #157's shape. The custodian filed the proposed node `publish-panel-rs-regex-layout` and asks its placement in question round 34's successor, round 35.*

*On the ruling's note on quotation: the custodian's message put a paraphrase of round 34 item 1 in quotation marks. It entered no record.*

*Profile paths redacted at filing: none.*

---

RULING: OTHER (cut/workspace-rustfmt @ c6d1414dc063364ffb8e46428d739922d7bafbc7)

I recommend against both options. Fix the test regex on main first, as its own small piece, and keep #157's scope exactly as the human approved it.

**Why not (A)**
- **Class 9 does not fit.** The template defines class 9 as work that a standing rule, permanent ruling or standing directive of the human adds to a piece (`docs/PREREGISTRATION-TEMPLATE.md:170`). This work comes from the form's own invalidator I4 (`WORKSPACE-RUSTFMT-PREREGISTRATION.md:130`), not from any such rule.
  - None of classes 1 to 9 covers adding scope after an invalidator. In that case §10 says not to invent a class: it is a finding for the human (`docs/PREREGISTRATION-TEMPLATE.md:96-99`).
  - Labelling it class 9 anyway would be a misfiled amendment.
- **It changes a shape the human approved on a red line.**
  - Round 34, item 1 (a red-line item, typed) adopted the custodian's shape: a diff of exactly the two fmt commands, plus the check in the same PR.
  - The form records that shape: no change outside C1's formatter output and the two §7 files (`WORKSPACE-RUSTFMT-PREREGISTRATION.md:51-56`, `:159-160`).
  - A TS test edit inside #157 departs from that shape, so under (A) it would have to go back to the human as typed text.
- **Your quote is not the ruling's text.** Your message quotes round 34, item 1 as approving "the pass and its check". The ruled text does not contain those words. Its words are "workspace-rustfmt follows, with its CI fmt check in the same PR". Do not carry your phrase into any record as a quote.

**Why not (B)**
- A redo rebuilds the same C1 tree under a new id and gains nothing.
- The fix does not depend on the formatter. `=\s*"` matches both main's layout and C1's, so the fix can land first without touching #157.

**The route**
1. **A new `proposed` node, short form, test-only.**
   - Scope: `frontends/shell/src/publish/PublishPanel.test.ts`, 1 file, at most 6 changed lines.
   - Its `Out-of-scope` line asserts that none of the four §21a categories is touched. Round 25, item 2 (e) is satisfied: no §21a category is touched.
   - The change makes both declaration regexes tolerate layout around `:` and `=`:
     - `:222` (`FILTER_SCOPE_SENTENCE`);
     - `:465` (`PREPARE_CANCEL_KEY_PREFIX`).
   - The model is the repo's own `checkOriginEventName.mjs:44`.
   - Line 465 passes today: `publish.rs:957` at c6d1414 is one line. But it has the same fragility, and the two regexes read the same file in the same way, so it goes in the same change.
   - The collapse step at `:228` already handles C1's continuation indent (`publish.rs:71-72`). Leave it unchanged.
2. **That node's tests.**
   - **Mutation:** change one character of the Rust literal, observe both tests fail by name, record the commit, revert.
   - **Seam proof from the real shape:** run the changed test against main's `publish.rs` and against c6d1414's `publish.rs`. Both must be green.
   - Gate: reviewer only.
3. **#157 after that merges.**
   - C3 touches `rust-fmt.yml` only: the S2-1 and N1 rewording, and dropping the quotes around the section label. §8 item 3 allows this, and §7 already covers it.
   - C3's push is a `synchronize`. Product CI — shell then runs on a merge ref that includes main's fix.
   - It must be fully green, including the src-tauri cargo test and both release checks. Any other red is a second stop and goes to the human, as you proposed.
   - Then gate 2.

**The text readers I checked at c6d1414**
- `sole_caller_scan.rs` looks safe. It needs `publish_unguarded(` on no line, and `boundary::execute(` in `publish.rs`, which is at `publish.rs:788`.
- `checkOriginEventName.mjs` looks safe. Its regexes (`:44`, `:55`) match `lib.rs:142` and `:172-173`.
- `surfaceCompleteness.test.ts` (`:33`, `:150`) also reads src-tauri `lib.rs`. §0 misses it as well as `PublishPanel.test.ts:221` and `:464`. It passed in the vitest run.

**Conditions**
- **§7.** #157's §7 is not edited and its budget line stays as it reads: at most 120 lines over the two files, counted by its own command. C3 counts inside it. No class 8 applies unless that count is exceeded. The TS file is never added to #157's §7; it is the new node's Scope.
- **#157's record.** One appended amendment, class 2, whose first line says it was written after the results. It holds references only:
  - run 37006671393;
  - the failing test pinned `frontends/shell/src/publish/PublishPanel.test.ts:222 @ <a main commit> sha256:<hex>`. The file is unchanged by #157, so pin it on main, with the hash computed by the custodian;
  - F6 left unedited;
  - §0's omissions by reference: the gate-1 reviewer's S2-2, plus `surfaceCompleteness.test.ts`;
  - CI's rustfmt 1.10.0 against the local 1.9.0, by reference to the reviewer's S2-3. E1 is green, so I6 does not fire. H1 is recorded as tested across those two versions and claims nothing more;
  - the fix node's id and PR.
  
  The node's generation bumps (`AUTONOMY.md:230`).
- **What holds meanwhile.** P1's constraint still holds while #157 waits: no Rust-touching node is dispatched. The fix node is TS-only, so it is not a Rust branch. P1 at merge is still owed.

**To the human: one item.** The custodian may append a `proposed` node, but only the human sets its `order` (`AUTONOMY.md:67`). Ask the human by option label to place the fix node ahead of #157's merge, with I4's firing given as context. This is not a red line, because #157's approved shape is unchanged. If the human would rather take (A), that has to be their typed text, because it changes a red-line approval's shape. Add to the same message the one-sentence C=994 disclosure from my gate 1.

**My gate 1** reviewed the diff, not the suites, as I said there. The reviewer's S1-1 stands, and my PASS carries forward to gate 2 only for an unchanged C1 and C2 plus a C3 that touches only that comment.
