*Custodian's filing note (2026-11-12): the architect's read-only consult on the human's item 2 (c) of 2026-11-12 (what the publish approval shows before a bundle is written, and whether it names the Colour by column), read at main c85788f1, from its hand-back (17736 bytes, sha256 5e2568610c3e570c30bb4c38a9cf0ad9a59ac1deb71d1697784ec219eb02d9bf), below the rule. Each `sha256:<H>` is filled by script with the sha256 of the cited whole lines, each with its LF, at c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e (65 pins); a final newline is added; nothing else is changed. Its brief by file (5349 bytes, sha256 01c3b30688c05123c08e31a6ed356ac0549b045a46943df5f34915e4b6c63e32); the run 16:22:19Z to 16:28:57Z by its transcript, 59 calls (Read 31, Glob 3, Grep 24, SubagentHandback 1), no write, model claude-opus-5-5. One call errored: a Grep of an ADR-006 file name it guessed, which does not exist. The custodian's dispatch prompt asked it to give the brief's byte count as the Read tool shows it, which the Read tool does not show (the custodian's error); it says so. Its answer: a bundle carries the column's values, and the approval does not name the column. Under item 2 (c) the options go to the human, and v0.2 does not tag with this open. Its three OPEN items are red lines and wait for the human's words. A reading and not Authority.*

---

Read: b1-shell-half PR B, the publish approval and the Colour by column (item 2 (c)), at main c85788f1
Reviewed: main @ c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e

The brief: I read it whole with the Read tool before any other call. The Read tool shows no sha256, so the sha256 was not shown to me. It also shows no byte count: it showed 48 numbered lines, the last one empty. I did not check the 5349 bytes the dispatch states.

This is a read-only consult, not a gate, so it has no verdict. My reading is that nothing in docs/01 or ADR-006 is violated, at main or as PR B plans it. The gap is the human's tag condition (item 2 (c)), and the answer is no: the approval does not name the column.

## 1. What the publish approval shows before a bundle is written, at main

**What the host sends.** `PublishPromptData` (`frontends/shell/src-tauri/src/publish.rs:266-304` @ c85788f1 sha256:a363659b21dbce19fe65d1e5e8ec8fd49acaddaf329b8be76da81f16b99b43e7; mirrored in `frontends/shell/src/publish/types.ts:15-48` @ c85788f1 sha256:45c5d755cfefdf177dcd2f0945c03555e886cf1d767d965678f8b3a913d8bed8) has twelve fields, filled at `frontends/shell/src-tauri/src/publish.rs:657-670` @ c85788f1 sha256:2701e8e06709285e4a95843cfef022fdabab0ce310078bc2f7fdf7d209636eb6:
- `operation`, `class`, `reversibility`;
- `source_name`, `source_content_hash`;
- `style_hash`;
- `destination_display`;
- `grantor`, `grant_remaining_s`;
- `row_scope` (`frontends/shell/src-tauri/src/publish.rs:141-152` @ c85788f1 sha256:55c644b3d6b57983217518ee07e9c25c986dc343079d584b8a8151c697d5ab48);
- `filter_scope`, null except under a current-view scope with a filter on (`frontends/shell/src-tauri/src/publish.rs:134-139` @ c85788f1 sha256:5ed8e2c4e2b3aca7f20ad6b3f523658052cd174eaf3716ebea8eba7f7cb1a118);
- `outcome_summary` (`frontends/shell/src-tauri/src/publish.rs:315-328` @ c85788f1 sha256:7eacdf2b2e1c7c2788d16af291f06a06b21d7132342758dd77c2e08cf0f7f44a). This sentence is composed only from the destination's basename and its parent folder. It names no column.

**What the dialog renders** (`frontends/shell/src/publish/PublishDialog.tsx:235-276` @ c85788f1 sha256:cb316c398efe34cf3b207cac90bd80c05b07a47b5176e84665618d95b28fe867). It renders every field it is sent, and nothing else from the host:
- a header with the operation, class and reversibility;
- the outcome sentence;
- a list of Source, Source content hash, Style hash, Destination, Grantor with the grant's remaining seconds, and Row scope;
- the filter-scope alert when that field is not null;
- the dialog's own fixed warning (`frontends/shell/src/publish/PublishDialog.tsx:274-276` @ c85788f1 sha256:f4c876ff197e2aa2ceb3e68b5074240d2c195471f20a56933d6c23f53ca6272b);
- the instruction, the expiry sentence and the typed-phrase input (`frontends/shell/src/publish/PublishDialog.tsx:278-310` @ c85788f1 sha256:6fe955dadce76d1701b9aed30531e91edb644c099de2c38f712c722d21dbd5d9).

**What it leaves out:**
- The confirmation phrase, by design (`frontends/shell/src-tauri/src/publish.rs:274-285` @ c85788f1 sha256:62377242393dd33329b670cc2ca1624ecf92e41f80708fd5930040d6d3634750).
- The set of attribute columns the bundle will carry. No field holds it.
- The style's match column. The only trace of it is `style_hash`: a sha256 over `style.json`'s bytes, which binds the column but does not name it.
- License, viewer and redaction facts. None is on the payload.

**The kernel's own prompt never reaches the operator in the shell.** It is built again at execute (`kernel/src/permission/boundary.rs:392-407` @ c85788f1 sha256:02237e4ed4f3abdbe010bc356d9a193ee7b46495ffda08963d2dd083c741ce0b), but `ShellApproval::respond` ignores it (`frontends/shell/src-tauri/src/publish.rs:172-180` @ c85788f1 sha256:4031613010a599d5c4b9d0f1744e502f28e3e170e16f040bf12330c0c1adfc63). Its fields carry no column either (`kernel/src/permission/approval.rs:77-95` @ c85788f1 sha256:cb0c559dc46eaae3dd1bf6ec184749fe1489254aa0d3dea3112a2000d58aacce; render at `kernel/src/permission/approval.rs:100-126` @ c85788f1 sha256:72fc1b0e3420c3fb2893ab954900466ada4556aaf29272d519c118557a44914a).

## 2. Which columns a bundle carries at main, and where that is decided

**What a partition holds.** Every partition holds `id`, the geometry, and then the declared attribute projection in its declared order (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:118` @ c85788f1 sha256:7ac62cbdb54cccdd582018da7bcf437efa97330f7f996d09eaea7732c6372afe). The manifest names those columns in `schema` and names the match column in `style.match_column` (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:195` @ c85788f1 sha256:e31f1cffb5beaf6a0afb8220efbce77fcb28d58a3e8434245a6cc613e489cfd6, `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:213` @ c85788f1 sha256:d2e337c812f2c93cc2d10aacb7ffd075351138874065f76604f8530ea5a1a070, `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:228-229` @ c85788f1 sha256:03fc6e307dfbb439aa33be8dc577bbab00b2b9f9eaf247e85046f73c5f9a942a). The operation digest also records the projection (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:367` @ c85788f1 sha256:2908dadd5159cf34c7a6eda557e8a1e04c3a099f92dff52dab0a14e3d26440de).

**Where the set is decided.** The host decides it, in `style_attributes`, from the style document JS sends: the document's one match column, or none (`frontends/shell/src-tauri/src/publish.rs:1258-1279` @ c85788f1 sha256:6b3ed47b0b5a5452ddde99a178b4cc25f720849bbf661bfa53d544754f88f2ea, which uses `renderer/src/style.rs:398-406` @ c85788f1 sha256:aee2a0920191a82e5bb3bd3b478bb0cb53ae3074184f35fbfcd105fca75cd6c9). It is called at `frontends/shell/src-tauri/src/publish.rs:436-439` @ c85788f1 sha256:12958b43cf802ca6e336fda0a481fe4c069b5b270e1fac3641e12f941fd9bdd9 and `frontends/shell/src-tauri/src/publish.rs:565` @ c85788f1 sha256:46fa20428c4696b3a3f2de385c88868534a17dfd33de339b54dea4e417cd6e6e, and stashed for execute at `frontends/shell/src-tauri/src/publish.rs:677-693` @ c85788f1 sha256:82f6dfcf0532f59b9534d858564e5dd9bc14d82f1fae47c6d2ba309b9659c151. The kernel publishes exactly that list (`kernel/src/publish/mod.rs:305-306` @ c85788f1 sha256:1513e0d8d81ab0d1a4b0876dc2a8d6facb3d0bfb90881632a96f732dc322e65c), resolved at `kernel/src/publish/mod.rs:530` @ c85788f1 sha256:8e775cffb978c5e52993a868d0a207ed323a313da83bd3e34009922a5d6ae4e8 and compiled against it at `kernel/src/publish/mod.rs:546-548` @ c85788f1 sha256:82b0dafe510183f200dd79c219fbcfbf403ed01633d10950285d969f9e6e2251.

**What the app publishes at main.** The shell's document is literal-only (`frontends/shell/src/style/document.ts:108-133` @ c85788f1 sha256:fad649540dbe17b1eb66ba8db823d6ce1e5a533801530e82cc75263105a7545c; sent at `frontends/shell/src/publish/PublishPanel.tsx:426` @ c85788f1 sha256:13739117c57d3db98fbd01fff6f78ff6bc3d8774c00a0b1881e29c6b902f458d). So `style_attributes` returns nothing, and an app export carries `id` and the geometry only. KNOWN-LIMITATIONS item 59 says so (`KNOWN-LIMITATIONS.md:490-491` @ c85788f1 sha256:32917fd12588262e2f720ed2d79c84708dd164a83f91f3816058a0bc294340a5).

**A column used only for styling.** From the app, none exists at main. In the format, a match column is always published, because the style cannot compile without it (`frontends/shell/src-tauri/src/publish.rs:1263-1266` @ c85788f1 sha256:e8c92b8e4be9dc09fbb795976cb6625a784837d56d6e5797a2cd0ed1f0a251e2). The CLI tooling's `--attributes` also publishes columns (`kernel/src/bin/publish-bundle.rs:16` @ c85788f1 sha256:edd2c5a24eceef55a331e754469ccb6a53821e56b845e103805eb436210197bb, `kernel/src/bin/publish-bundle.rs:268` @ c85788f1 sha256:8f414abb7930431ee2102342fc451f2603b80c2512bb513f810b8447d458f540).

**Does the approval name it?** No, on either surface: there is no field for it (section 1).

## 3. With PR B as the form and Amendment 12 plan it

**Does a bundle carry the Colour by column's values? Yes.**
- `fill_color` becomes the match whenever `fillMatch` is set, and `toStyleDocument` emits it (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:233-238` @ c85788f1 sha256:e5d2cca1dfe5f8ab1f0b0998585080ac0502a6725950c638c524880d10ccb274).
- Export makes no path change, because `publish.rs` derives the match column (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:268-270` @ c85788f1 sha256:b216be69c816050bfac303c5456b5665bf4ba48e3eef025eb49ce008a2c27af7). From there the chain of section 2 applies.
- PB-E2 asserts that `zone` is published (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:526` @ c85788f1 sha256:c114077617fcffa5178196c89b736243438ac699b46fc1ab20d0a53708d1ecd0).
- Amendment 12 changes none of this. It names item 59's claim as becoming untrue (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1689` @ c85788f1 sha256:024015a955761a4bafa7804c5ee9b40b5caa9886ef1977845706cbcff0bdd677).
- Every published feature's value goes out in the partitions. The categories, up to 12 distinct values, also go into `style.json`. The viewer's hover lists the value (`renderer/bundle-viewer/src/main.ts:448-458` @ c85788f1 sha256:bce2415d020735ba35a8240b6583942d33a99b80743955867f614dfd2dc6a25f).

**Does the approval then name that column? No.**
- The form keeps PublishDialog, PublishPanel and `publish.rs` unchanged (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:176` @ c85788f1 sha256:829af76f9fb294a265e56f9124643a594c7b37059c765208a2a5945559be3eff).
- It forbids any change under `src-tauri` (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:162` @ c85788f1 sha256:aad013adc016ccf8b034dc032500df4e1f8940963b9936cd57dbe6ca1d15e423; block-on-sight `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:625` @ c85788f1 sha256:6a466d825280b875ad60b6f96541a48c2a142cca83d7fd94476856b7020db178).
- So the payload stays as in section 1. The only change the operator can see is a different `style_hash`.

**My reading against the constitution.**
- The publish is still approval-gated and declares its class, which is what docs/01 requires (`docs/01_Principles.md:25` @ c85788f1 sha256:7caf034eacb03745213cfafcecab1e3085fd032ed793c06e9dae823d6b922401), as do ADR-006 (`docs/adr/ADR-006-lineage-undo-side-effects.md:17` @ c85788f1 sha256:3679b1eed3e38b0bafe1cac389ea255e41fbbe827971ca94e8ce66ffa3a850dd) and docs/09 (`docs/09_Security_and_Privacy.md:21` @ c85788f1 sha256:021a0b2593e9d24b01e592c0b6d13e1ee7876919050048ae3dec06adaddf4277, `docs/09_Security_and_Privacy.md:28` @ c85788f1 sha256:1526efeb31ac9f68d2382d63fc76c5298542dfbe0d3fca25438d5f9ec0245133). None of them requires the approval to list columns.
- ADR-017's exposure condition 1 asks the approval to say roughly what the bundle contains (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1119-1122` @ c85788f1 sha256:2b7576e18dd1ad707b6497b593726903db13f4cdffd106d43469b83d1346aad0). The outcome sentence still meets those words. But it does not tell the operator that a data column's values leave with the rows.
- docs/09 treats attribute values as untrusted input (`docs/09_Security_and_Privacy.md:25` @ c85788f1 sha256:275b54e44f2374918f9f39b6d7025b3bdbecf3771b3a3470df6b65b8de26cb54). The redaction scan already covers styled-column values (`KNOWN-LIMITATIONS.md:447` @ c85788f1 sha256:0eae4375328d61a369d1c4dc3a0eaaf259adb9dd6758277b993bf28ac2720e38), and with PR B that case is reached for the first time.

## 4. Options (the approval does not name it)

Line counts below are my estimates, not measurements. Each becomes a ceiling only once a form declares it.

**(A) Recommended: a host-composed approval line naming the published columns, as its own small piece outside PR B.**
- Change:
  - `PublishPromptData` gains one field, composed in `prepare_with_query` from the same `attributes` vector that goes into the request and the stashed attempt. Once preflight has passed, the kernel publishes exactly that list.
  - The line names `id`, the geometry, and each attribute column; an export with no attributes is named that way too.
  - The dialog renders it within the provenance list.
- Files:
  - `frontends/shell/src-tauri/src/publish.rs`: the field, its composition, `prompt_stub` and one unit test;
  - `frontends/shell/src/publish/types.ts`;
  - `frontends/shell/src/publish/PublishDialog.tsx` and `PublishDialog.test.ts`;
  - the prompt fixtures `tsc` names (`App.command.test.tsx` and `App.selection.test.tsx` construct prompts; read them at dispatch);
  - one e2e step.
- Wire: one binding-local field, not SKP (`frontends/shell/src/publish/types.ts:5-10` @ c85788f1 sha256:8c716e61eded7a7b15a48c7d956f946740b5a2fe71eaa6699241246f62c5a924). No SKP version change and no MCP change. The field carries at most 32 column names, which is control data, not bulk data.
- P6: one new string, which the host composes.
- Tests (round 4's seam rule):
  - a unit test that the field equals the request's attributes;
  - a dialog render test;
  - one end-to-end test from the real shape: after a Colour by on `zone`, the dialog's line names `zone`, and that name equals the published manifest's `schema` minus its first two entries.
- Size: about 25 product lines, 60 test lines and 15 e2e lines.
- Records:
  - Walkthrough G3 gets a dated pointer (`frontends/shell/MANUAL-WALKTHROUGH.md:332` @ c85788f1 sha256:687a5de61b0c84d0d1bde05fd57921b5d5649e49798d2c876abc4567544a658e).
  - PR B's operator row 5 gains an expected outcome: the approval names the column (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:682` @ c85788f1 sha256:24e4c694e97788aca94daa5d09619ad93652340d1c1a86150f26305bc2b8ab70).
  - ADR-024's field list (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:137-144` @ c85788f1 sha256:a533a2020049c303aaa22f2621f440d0b36bee8003c37a5a96b3d0f0e468ab5d) needs an appended note. That ADR is Proposed.
- Paths: disjoint from PR B's list (PR B's `types.ts` is `skp/types.ts`) and touching no `protocol/` path, so it can run beside PR B.
- v0.2: the tag waits for this piece's merge.
- Red lines: a P6 string; the approval surface that the human's exposure review passed (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1110-1132` @ c85788f1 sha256:07f9e955ca2dec9ef5557da86f36b813293fb7417be3e9b12c7d785e73672ff1), which is what the operator is told before data leaves the machine; and the placement of a new node.

**(B) The same change inside PR B, by a class 9 amendment.**
- Cost: A's files and lines, plus PR B's form ceases to hold at three places: §1's no-`src-tauri` rule, §2.1's unchanged list, and block-on-sight item 1. PR B grows past 4,430 lines.
- v0.2: tags when PR B merges.
- Red lines: a scope change to a form the human ruled, plus A's red lines.
- Not recommended.

**(C) A shell-side sentence in the Export section naming `fillMatch.column`, with no host change.**
- Cost: `PublishPanel.tsx`, which is on §2.1's unchanged list (class 9); one P6 string; one test.
- Why not:
  - It is not the approval, and the dialog still names nothing.
  - It is a second, page-side derivation of a decision the host makes, so it can disagree with what is published.
  - It would be the shell stating the host's consequence, which the operator-text ruling names a defect.
- Not recommended.

**(D) Record it; no code.**
- Cost: OPEN-B's item 59 text gains a clause saying an export with Colour by carries that column's values for every exported feature, and that the approval does not name the column. The AC5 row says the same.
- v0.2: tags once the human approves the words.
- Red line: the KNOWN-LIMITATIONS wording.
- Cheapest. It leaves the operator less informed at the moment of consent.

**(E) Kernel parity: `ApprovalPrompt` gains the column list, `render()` prints it, and the shell mirrors it.**
- This follows `kernel/src/permission/approval.rs:97-99` @ c85788f1 sha256:6cb9d94bb9f01b8a8f59654d4f73d358dc8add0c93e3954b87f4cf703c9ecbd1: one place, so the CLI and the shell show the same facts.
- Cost: A's files plus `approval.rs`, `boundary.rs`, their tests and the CLI path (a `kernel/src` change).
- Red lines: the same as A.
- Recommended as a later node, not for v0.2. The CLI is still developer and test tooling (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1140` @ c85788f1 sha256:22245ad32149f55cda7ff080c01ec21b46b3e7a98c82e13dbce54397313cfec3).

**Excluded:** publishing a category style without its column. The style cannot compile without it (section 2), and PB-E2 would fail.

**My recommendation is (A)**, as its own piece merged before v0.2's tag, with (E) placed later. OPEN-B's item 59 text is then re-read against (A)'s outcome. The choice is yours.

## OPEN items

- **OPEN-P1: which option, (A) to (E).** **Red line:** the approval surface, what leaves the machine, and, under (B), a scope change. I recommend (A).
- **OPEN-P2: the words of the new approval line.** **Red line:** P6. My starting text, which is not your wording: Columns published: id, the geometry, and zone. With no attributes: Columns published: id and the geometry only. Clause check against the code:
  - id and the geometry always: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:118` @ c85788f1 sha256:7ac62cbdb54cccdd582018da7bcf437efa97330f7f996d09eaea7732c6372afe;
  - the named columns are the request's `attributes`, exactly: `kernel/src/publish/mod.rs:305-306` @ c85788f1 sha256:1513e0d8d81ab0d1a4b0876dc2a8d6facb3d0bfb90881632a96f732dc322e65c and `kernel/src/publish/mod.rs:530` @ c85788f1 sha256:8e775cffb978c5e52993a868d0a207ed323a313da83bd3e34009922a5d6ae4e8.
  - The text names no count of values. No data has been read at prepare (`frontends/shell/src-tauri/src/publish.rs:306-314` @ c85788f1 sha256:ce2f820ec9092668a566e0efab0ee93e7c02050829aa38d88530cc36acd50c46), so a count would be an unmeasured claim.
- **OPEN-P3: the node's placement (lane and severity) and whether v0.2's tag waits for it.** **Red line:** placement. I recommend the tag waits, under item 2 (c).

## Gate findings (not ruled)

1. Documentation, but a stale limit: ADR-024, which is Proposed, states the pending attempt's TTL as 120 s (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:88` @ c85788f1 sha256:b9038105412169bd2bd9da5682a3afce4303ae46a4f72ae88936105292a61271). The code's value is 600 s (`frontends/shell/src-tauri/src/publish.rs:69` @ c85788f1 sha256:e6d22c86a483b84486fe4742b38166e434ac77a7962557099712fffed75d1d0a). An appended note in the docs lane would fix it.
2. Documentation: `frontends/shell/src/publish/PublishDialog.tsx:168-171` @ c85788f1 sha256:617e16b10bcf8b902f366d642afb49c5347c873f7662b1fb6fdd22f82874a744 points to a report for the full field list and names no path.
3. Documentation: walkthrough G3 asks the operator to judge whether they know what style will be written (`frontends/shell/MANUAL-WALKTHROUGH.md:332` @ c85788f1 sha256:687a5de61b0c84d0d1bde05fd57921b5d5649e49798d2c876abc4567544a658e), but the dialog shows only a hash. Under PR B the category column stays unnamed, and PR B's operator row 5 does not ask about it.
4. Documentation: PR B's form §2.3 (i) reads the bundle path only. No line of the form records what the change means for the approval. PR B's records commit should cite this consult by path.

## Read, by path

- the directive, item 2 (c), and its item 6: `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`
- the milestone 4 form: `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md` (§1, §2.1, §2.3, §4, §8, §9, Amendment 12 and its continuation)
- the PR B ahead draft: `state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md` (PR B: draft amendment)
- the shell publish path: `frontends/shell/src/publish/PublishDialog.tsx`, `PublishPanel.tsx` (by search), `client.ts`, `types.ts`, `frontends/shell/src-tauri/src/publish.rs`
- the kernel: `kernel/src/publish/mod.rs`, `kernel/src/permission/approval.rs`, `kernel/src/permission/boundary.rs`, `kernel/src/bin/publish-bundle.rs` (by search)
- the renderer: `renderer/src/style.rs`, `renderer/src/compiled.rs`, `renderer/bundle-viewer/src/main.ts`, `frontends/shell/src/style/document.ts`
- the ADRs: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`, `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md`, `docs/adr/ADR-009-license-and-open-core-boundary.md`, `docs/adr/ADR-006-lineage-undo-side-effects.md`
- the constitution: `docs/01_Principles.md`, `docs/09_Security_and_Privacy.md`
- what the user is told: `KNOWN-LIMITATIONS.md` (items 4, 47, 51, 54 to 59), `frontends/shell/MANUAL-WALKTHROUGH.md` (Part G)
- the reuse index: both runs are misses, with no prior art recorded for either query. This reading rests on the tree at c85788f1 alone.

## Packet gaps

- ADR-009 has no text on what leaves the machine. The posture is docs/09's (`docs/09_Security_and_Privacy.md:5` @ c85788f1 sha256:da5c6ab521a67a0b1c7e7b6a26e375f62f474f4ab9797f62ae6bd7794b17e8ff).
- Whether a change to the approval's fields reopens the human's exposure review (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1110-1132` @ c85788f1 sha256:07f9e955ca2dec9ef5557da86f36b813293fb7417be3e9b12c7d785e73672ff1) or stays inside it is not given.
- Whether v0.2's tag needs an operator sitting of a new walkthrough row, or only the merge, is not given.
- The PLAN.yaml lane and node conventions for a new publish piece were not read.

## Model

Opus 5.5 (claude-opus-5-5), as the harness reports it.
