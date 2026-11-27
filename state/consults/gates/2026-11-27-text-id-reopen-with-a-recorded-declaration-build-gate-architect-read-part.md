Reviewed: governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md at main @ 5e9b2184b7fb235fb488afe538ad451f331fdf30, against the code in the read checkout D:/wt/read-1127b at 97019e9198a9a2d110d0d686ce8166574547d4ce (PR 369, draft). The C1 piece's build gate, the architect (Opus), THE READ PART, with no verdict; its run, from its completion notice only (ADV-2026-11-26-02), was 82 tool uses. Filed by the custodian, 2026-11-27: the hand-back saved by Write with the harness's indent removed (15002 bytes, sha256 c974b171ce44217425e7506f57252b5efd9156f320502ea008529e6fd9dcb3e2), byte for byte below the rule.

---

READ PART: `cut/text-id-reopen-with-a-recorded-declaration @ 97019e9198a9a2d110d0d686ce8166574547d4ce` (code read in D:/wt/read-1127b). The form, the governance documents and the rulings were read at main `5e9b2184b7fb235fb488afe538ad451f331fdf30` (D:/wt/read-1127c). This part gives no verdict.

*Everything below is paraphrase unless it is marked verbatim. Rulings are cited by id and item.*

**Summary.** The product change matches §2. The wire matches §9 item 6, and every changed file is inside §7. The main finding is that E-R1 cannot reach its step (5) as written. Step (3) reopens a project the window still holds, and the kernel refuses that as `skp.project_open_elsewhere`. Text-id's own step `TEXTID'` (d) has the same defect at the base. Both go to the advisor before E-R1 runs.

## 0. The locators
- I read `<scratch>/c1-numstat.txt` and `<scratch>/c1-diff.txt` whole. I have no shell, so I could not recompute their byte sizes or sha256 values.
- The numstat lists 39 files. It sums to 791 insertions and 128 deletions, 919 lines in all.
- The diff's file headers are the same 39 paths. The numstat holds no form, PLAN, CUSTODIAN-QUEUE, `site/` or `state/` path.

## 1. Scope (ADV-2026-11-27-30 item 1, in so many words)
**Every changed file is inside §7's scope, as its "each" lines resolve at the base.**
- Most of the files are named in §7 outright.
- `engine/tests/identity.rs` is covered by an "each" line: the diff adds `..` to a destructure that had none at the base.
- `RefusalBlock.test.tsx`, `admitDataset.test.ts`, `saveProject.test.ts`, `client.test.ts` and `types.ts` are also covered: each line the diff removes from them holds `skp/0.16`.
- So are the 12 request fixtures under `tests/data/` and the three conformance fixture files, for the same reason.
- `v0-error-identity_unusable-with-candidates.json` holds `engine.identity_unusable`.

**Every change is inside §2 and §4 as gated.** Each change maps to its item:

| Change | Where in the form |
|---|---|
| The engine sites, the Display destructure and the doc paragraph | §2 items 1 to 3 (with Amendment 1's restatement) |
| D-R1 in `error.rs` | The advisor's text, ADV-2026-11-27-24 item 4 |
| The kernel arm | §2 item 4 |
| The literal and the fixtures | §2 items 5 and 6 |
| The shell's literal, the check and D-R2 (i)/(ii) | §2 items 7 and 8 |
| N-R1, N-R2, K-R1, K-R2, W-R1, S-R1, S-R2, `ID_REFUSAL` and E-R1 | §4 |
| The renamed `skp_version_is_skp_0_17` | The literal's mechanics (Amendment 4 item 6) |
| Row AH8 and the README section | ADV-2026-11-27-30 items 2 and 3 |

No file and no item is outside them.

## 2. The wire (§9 item 6)
- **One field.** `engine.identity_unusable` gains `identity_source` (`kernel/src/skp.rs:2262-2264`), and the literal becomes `skp/0.17` (`protocol/skp/src/v0/mod.rs:1082`; `frontends/shell/src/skp/types.ts:15`).
- **The SKP-V0 entry.** §8 gains a `skp/0.17` entry. The "compared today" lines in §4 item 3, §10.1, §11.1 and §12.1 are the literal's own lines.
- **No request member changes.** Every request fixture's diff is the `skp` line alone.
- **`protocol/data-plane/`** is absent from the numstat.
- **No other wire change.**

## 3. The guarantees of §10
- **ADR-016 Amendment 3, Decision 1.**
  - What this read part can close:
    - the engine values the field at every refusing site through `as_envelope_value` (`engine/src/dataset.rs:2081`, `:2103`, `:2165`, `:2178`; `engine/src/identity.rs:391`);
    - `file:id` comes only from `IdSource::File`, that is, with no declaration (`dataset.rs:2059`);
    - the kernel passes the field through (`skp.rs:2264`);
    - at a reopen the kernel sends the recorded declaration (`kernel/src/project/mod.rs:821-831`);
    - the shell has one decision site, and it fails closed (`frontends/shell/src/admission/AdmissionPanel.tsx:229`);
    - the choice's only render and only option-builder sit behind that site (`:726-729`, `:236-238`);
    - a reopen's refusal opens no form (`:390`).
    - These are proven by N-R1, N-R2, K-R1, K-R2, S-R1 and S-R2.
  - What waits for E-R1's run: the field reaching the real DOM at a reopen, in both halves.
    - The `mapped:id` half (no button) is E-R1 (5).
    - The `file:id` half (still offered) is E-R1 (3) and `TEXTID'` (d).
    - As written, neither half can be observed (F1, F3).
  - I weighed the build worker's rule-(00) view, that closure cannot rest on an unrun e2e step. I agree with it, on §10's seam rule. The worker did not see that step (3) cannot pass.
- **Decisions 2 and 6 are unchanged in code.**
  - The set-aside branch and `set_aside_outcome` are untouched (`dataset.rs:2024-2045`, `:2201-2219`).
  - `kernel/src/dataset_ref.rs` is untouched.
  - K-R1 (i)'s second call and K-R1 (ii) prove the kernel halves.
  - Decision 6's shell half at the port rests on the `file:id` reopen above (F1, F3).
- **ADR-016 §3 holds: the shell never overrides a recorded declaration.**
  - At a reopen the shell sends no claim (`frontends/shell/src/project/openProject.ts:70-73`) and offers no form (`AdmissionPanel.tsx:390`).
  - The choice beside a recorded declaration is refused by the engine (`dataset.rs:2027-2033`; K-R1 (i)).
- **The field states an engine fact, and the engine's messages are untouched.**
  - Display gains only `identity_source: _` (`engine/src/error.rs:388`).
  - `reopenNotices.ts`, `RowPositionChoice.tsx` and `describeSummaryText.ts` are not in the diff.

## 4. §10's seams, from the real shape at the head
- **Engine to kernel:** the destructure at `skp.rs:2248-2253` matches the variant at `error.rs:171-176`. K-R1 and K-R2 drive the real engine. Real shape.
- **Kernel to wire:** the field goes into `SkpError.fields`, a string map. K-R1 and K-R2 assert the kernel's own `SkpError`. W-R1 asserts the fixture files.
- **Wire to shell:** `fieldValue` over `formatRefusal` (`formatRefusal.ts:34-47`), after `shownRefusal` at a reopen (`openProject.ts:81`). S-R2 runs on the fixture files. The real app is E-R1, which is blocked as written (F1, F2).
- **Kernel project to engine:** K-R1 (i) uses a real save with a real declaration.
- **The operator row:** AH8 starts from a fresh app ("Close the app"), so F1 and F2 do not touch it (see §8).
- **No new `pub` item.** `admit_column_type` stays `pub(crate)`, and its product caller is `dataset.rs:2108`.

## 5. The claims of §1
- **The offer beside a reopen's refusal of `id` only on `file:id`:** true (`AdmissionPanel.tsx:229`; `dataset.rs:2059`; `identity.rs:84`).
- **A recorded declaration of `id` is refused with no offer, and its refusal names its source:** true in code (`dataset.rs:2047-2058` gives `mapped:id`). Through the app it awaits E-R1 (5).
- **A direct open behaves as today:** true. With no declaration, every refusal of `id` is `file:id`. A declared run is already excluded (`:230`).
- **What a project records does not change:** true. `dataset_ref.rs` is not in the diff.
- **The "not claimed" items:** all true. No `docs/` path is in the diff, and no engine message or owner sentence changed. The new field row is a key and a value, not a sentence.

## 6. §9, Block on sight, item by item
1. **Code before the form and the rulings:** untrue, by the record (Amendments 1 to 4). Without a shell I did not re-check the commit order.
2. **A path outside §7:** untrue (§1 above).
3. **The offer beside a value other than `file:id`, or an absent one:** untrue (`AdmissionPanel.tsx:229`; S-R1 covers both).
4. **An engine message, R-ENG, S-8 or S-1 to S-6c changed:** untrue.
5. **The field valued outside `as_envelope_value`, or composed in the kernel:** untrue (the sites in §3 above; `skp.rs:2264`).
6. **A request member, the data plane, or a wire change outside the entry:** untrue (§2 above).
7. **A byte of what a project records:** untrue.
8. **An ADR-016 edit:** untrue.
9. **A claim that a test was written before its code:** none in the reports I read.

## 7. Amendment 5 item 5: the step's own save
**The edit itself serves the seam better than §3's "parse and write".**
- The line replacement gives exactly the writer's layout (`renderer/src/canonical.rs:170-221`).
- The reader checks that layout byte for byte (`kernel/src/project/file.rs:157`; `kernel/src/project/strict_json.rs:83-110`).
- The recorded document equals the one a real save of `{column:"id"}` writes (`kernel/src/dataset_ref.rs:292-297`).

**But the own save brings a control into the step, and that control cannot pass (F1).** This changes claims that are not the form's:
- ADV-2026-11-27-30 item 4 reads KNOWN-LIMITATIONS item 3's second sentence partly on the premise that E-R1 (3) is written to show the refusal and the offer through the app.
- ADV-2026-11-27-30 item 2 rests AH8's expected outcome on E-R1 (5), which F1 keeps from being reached.

Both go to the advisor.

## 8. The advisor's words (AH8, its result-log line, the README section), read against the head
**AH8.** Each architecture-bearing clause is true:
- only one line holds `"identity"`, under the admission (`dataset_ref.rs:292-297`);
- the three-line layout and the final line feed are the writer's (`canonical.rs:178-221`; `strict_json.rs:93`);
- a bad edit is refused as `skp.project_file_refused` with `path` and `rule` (`mod.rs:977`);
- the outcome is `mapped:id` (`dataset.rs:2050`; `identity.rs:391`);
- the line beside the refusal is R-ENG (`openProject.ts:85`, `:96`; `reopenNotices.ts:106`);
- no button and no form shows (`AdmissionPanel.tsx:229`, `:390`);
- the file is left as typed: only an answer of `copy` rewrites it (`mod.rs:760`, `:797-799`).

**The README section.**
- The kernel facts in its clauses (2) and (4) are true:
  - the reader refuses another layout (`file.rs:157`);
  - the kernel asks while the first folder holds the identity (`mod.rs:744`, `:672`);
  - a project the window holds is refused (`mod.rs:783-790`, `:985`).
- Clause (3) describes an outcome the step cannot reach as written (F1).
- Once F1 is corrected, the README's list of acts lacks the new act.
- This is ruled text, so it goes to the advisor unreworded.

## 9. §7
- **The count.** 919 changed lines against 900, over 39 files, as Amendment 6 records. Every row of its table resolves against the numstat.
- **The design did not grow beyond §2.**
  - The product rows count 78 against ~83.
  - The overrun is in the Rust tests: 143 + 249 + 85 = 477, against ~310.
- **The count will rise.** The correction for F1 and F2 adds lines to the e2e row. That is another class 8 record; §7 is not edited.

## Findings

**F1. Evidence. The correction changes code (the e2e script). It goes to the advisor, because it bears on ruled words.**
- `TEXTID-C1` step (1) makes a first save of the window's live dataset. A first save takes the project's lock and keeps it while that dataset is live (`mod.rs:316`, `:397-418`). `release_ended` keeps a live dataset's entry (`:261-268`).
- Step (3) then reopens that same folder in the same window. The reopen's `try_lock` is therefore refused, and the refusal is `skp.project_open_elsewhere` (`:783-790`, `:985`).
- `e2e/reopen.mjs:238-263` (R3, then R4) asserts exactly this refusal for a save followed by a same-window reopen.
- The step fails at (3) by name, so it never shows a false green. But it never reaches (5), so E-R1 and M-RD8 cannot be observed.
- **Correction, inside E-R1's row:** between (2) and (3), open another file to replace the window's dataset. Then wait for the first handle's close, as `reopen.mjs` R5 does (`:269`). Only then reopen.

**F2. Evidence. The correction changes code (the same place).**
- Step (4) opens another file, but does not wait for the replaced dataset's close before step (5).
- The shell's close is fired from an effect and not awaited (`frontends/shell/src/App.tsx:1689-1694`).
- If step (5)'s `open_project` arrives before that close, the lock is still held and the answer is `skp.project_open_elsewhere`. The step fails by name.
- **Correction:** add the same wait as `reopen.mjs` R5, at step (4).

**F3. Evidence, on the base and outside this piece's changes. To the advisor before anything else (ADV-2026-11-27-30 item 1).**
- Text-id's own `TEXTID'` (d) (`frontends/shell/e2e/admission-remediation.mjs:619-632`, unchanged by this piece) does the same: a save, then a same-window reopen. By the places in F1 it will be refused as `skp.project_open_elsewhere`.
- It runs before `TEXTID-C1` in the same suite.
- It is text-id's E-1 (d) control. §4's E-R1 row and ADV-2026-11-27-30 item 4 rely on it.

**F4. Documentation. Must be fixed before the merge. No code changes.**
- File: `protocol/skp/tests/conformance/README.md`. The words are the build worker's, not the human's: the worker applies the new text with no re-gate, and the PR body lists it.
- The paragraph says this folder holds no document of that code. That is untrue: `tests/conformance/fixtures/responses-accept.json:91-104` holds `resp-error-identity-candidates`, with code `engine.identity_unusable`.
- Old, verbatim, found once:
```
no row is added: this directory holds no
document of that code. The existing rows' `spec` citations are not rewritten.
```
- New:
```
no row is added: the one document of
that code here, `resp-error-identity-candidates` in `responses-accept.json`, is unchanged. The
existing rows' `spec` citations are not rewritten.
```
- Each clause, checked:
  - *No row is added:* the three fixture files change only the literal line and one row's id.
  - *The one document of that code here:* a Grep over `protocol/skp`, `SKP-V0.md` excluded, finds the code in the conformance folder only at `responses-accept.json:98`.
  - *Unchanged:* `responses-accept.json` is not in the numstat.

**F5. Evidence, for the run part. No correction owed; no code.**
- S-R2's offered (`file:id`) case is `v0-error-identity_unusable-with-candidates.json`.
- No engine code produces that fixture's detail text: a Grep finds it only in the fixture.
- The engine's "no such column" refusal fires only for a declaration (`dataset.rs:2076-2083`), and is therefore `mapped:`.
- So S-R2 proves the key and the value the shell reads, not a refusal the kernel emits. The real `file:id` shape reaches the offer through the app only at E-R1 (3), which F1 blocks as written.

**Outside this piece, an observation only.** `frontends/shell/src/e2e-test-surface.ts:192-196` names `e2e/reopen.mjs` as the hooks' only caller. That was already untrue at the base, because `TEXTID'` uses them, and this piece adds a third caller. The file is not in §7, so this is for the custodian's queue.

## Relevant paths
- D:/wt/read-1127b/frontends/shell/e2e/admission-remediation.mjs
- D:/wt/read-1127b/frontends/shell/e2e/reopen.mjs
- D:/wt/read-1127b/kernel/src/project/mod.rs
- D:/wt/read-1127b/frontends/shell/src/App.tsx
- D:/wt/read-1127b/protocol/skp/tests/conformance/README.md
- D:/wt/read-1127b/protocol/skp/tests/conformance/fixtures/responses-accept.json
- D:/wt/read-1127c/governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md
