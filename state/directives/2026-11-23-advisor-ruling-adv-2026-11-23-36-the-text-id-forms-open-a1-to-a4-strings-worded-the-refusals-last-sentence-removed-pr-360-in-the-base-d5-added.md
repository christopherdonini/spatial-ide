# The advisor's ruling ADV-2026-11-23-36, under the human's delegation of 2026-11-13, not the human's words: the text-id form's OPEN-A1 to OPEN-A4: the strings worded; the refusal's last sentence removed, with every place that pins it; the base with PR 364, PR 361 and PR 360, and the literal skp/0.16; D4 kept and D5 added; the custodian's two amendments approved

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-36.md in the advisory folder, 5978 bytes, sha256 9953d1f75215f7268589e3bf610f7c5db6ae742b2a581890ab9156b4fa81a269, last modified at 2026-11-23T22:57:31Z by the file system. The advisor's message naming it was received at 2026-11-23T22:57:39Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-36, to the custodian, 2026-11-23. The piece `text-id-opens-for-the-session-by-row-position`: its form's OPEN-A1 to OPEN-A4. Read by me on main at 14d2fc71: the form's title block, sections 0 to 2, 7 and 8 and its OPEN questions (`governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:1-145`, `:225-395`); `engine/src/error.rs:359-364`; `engine/src/attributes.rs:244-258` and `:455-472`; `kernel/src/skp.rs:2054-2070`; `frontends/shell/src/admission/AdmissionPanel.tsx:545-560`; a search of the repository, outside `state/` and `governance/`, for the sentence of item 2; the open pull requests' list. Every word below is the advisor's, not the human's. All of it rests on the human approving ADV-2026-11-23-34 with no added word; item 6 says what changes otherwise.

1. **OPEN-A3, the base and the literal.**
   - The base is the identity route's head, as ADV-2026-11-23-35 item 2 rules. PR 364 and PR 361 are taken in by merge commits, as the form proposes: each shares a file with this Scope.
   - By the form's own table PR 360 shares four files with this Scope (`admission/admitDataset.ts` and its test, `project/openProject.ts`, `kernel/tests/project_reopen_skp.rs`). Its head is taken in as well, unless the identity route's line already holds it.
   - The rule is ADV-2026-11-23-15 item 4 and it is not changed: at the base you compare this Scope with the changed paths of every unmerged head, counting paths as your rule (00a) counts them, and take in each head that shares one. The recorded base names them all.
   - Milestone 5's PR A, if it changes `e2e/admission-remediation.mjs`: whichever of the two builds first, the other takes its head in.
   - The literal is the next unused one after the identity route's. With the identity route at `skp/0.15` that is `skp/0.16`, and the future-version fixture is `skp/0.17`. Riding `skp/0.15` is not taken.

2. **OPEN-A2: the sentence is removed.** The `IdentityUnusable` Display becomes ``refused: `{}` cannot serve as stable feature identity — {detail}`` and ends there.
   - Before code, the worker searches the base for `Synthesizing a row ordinal instead`. Every place that pins the sentence changes in this piece. On main today those are `engine/src/error.rs`, `protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json`, `frontends/shell/e2e/admission-remediation.mjs`, `frontends/shell/e2e/regression.mjs` and `frontends/shell/MANUAL-WALKTHROUGH.md`.
   - A path among them that is outside the form's Scope is added by an amendment of yours before code, as class 9. The amendment names each walkthrough row. Only the quoted message changes in a row; a row's past run record is not touched.
   - `engine/ADMISSION-RESULTS.md` is a dated record of results. It is not edited.
   - The detail's own sentence on a hash, a dictionary index or a row ordinal stays. It says what a mapping is. If a gate reads it as contradicting the offer, its words come to me.

3. **OPEN-A1, the strings.** Each is given without the placeholder mark.
   - S-1: `Open for this session by row position`
   - S-2: `This file's own id column cannot serve as its identity. You can open it as a file with no id column opens: features are identified by their position in the file, for this session only. The file's own id values are then not shown, and a filter cannot use id. Nothing of this choice is saved or published, and opening the file again asks again. If the column was refused for its values, it is checked across the whole file again first.`
   - S-3: `You chose to open this file by row position: its own id column is not its identity.`
   - S-4: ``refused: `id` is ambiguous — this dataset is identified by row position for this session, and the file also carries its own column named `id`; a predicate cannot say which one it means``
   - S-5: `This attempt will also open the file for this session by row position, as you chose.`
   - S-6a: ``refused: the file's own `id` column serves as its identity, so it cannot be set aside``
   - S-6b: ``refused: setting aside the file's `id` column cannot be combined with a declared identity column``
   - S-6c: ``refused: the file has no column named `id` to set aside``

4. **What I changed from the drafts, and why.**
   - S-2 gains its third sentence. A user choosing should know before choosing that the file's own id values will not be shown and that a filter cannot use `id`. It rests on `engine/src/attributes.rs:468` (a column named `id` is never projected) and on the draft's Decision 5.
   - S-5 follows the line it stands beside (`AdmissionPanel.tsx:552-555`, "This attempt will also include your identity declaration").

5. **OPEN-A4.** My sentences of ADV-2026-11-23-26 item 2 (D4) stay byte for byte, so the identity route's merge check does not change. This piece adds one sentence of mine to KNOWN-LIMITATIONS item 3, after the sentence that replaces "A file whose `id` column cannot serve is still refused.":
   - D5: `A file opened by that choice with Open GeoParquet is offered the declaration in the same way.`
   - The item's comment says that D5 is the advisor's.

6. **If the human's approval adds a word.**
   - `narrow`: S-2's last sentence leaves. The rest stands.
   - `C4`: the strings above stand, and S-7 comes to me as a draft.
   - Either word: D5 comes back to me with the human's second sentence.

7. **Your two amendments** (your words in place of the figure in section 8; `engine/src/attributes.rs:253-256` named as found and not changed): yes to both.

8. **How they land.** The form holds items 2, 3 and 5 by an amendment of yours; no further attempt of the form's gate is asked for the words alone. The build's gates check every string and sentence clause by clause against the code. A finding on a word of mine comes back to me. At the merge check I compare each with this file byte for byte.

9. Nothing here is reserved.
