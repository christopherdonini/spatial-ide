*Custodian's filing note (2026-10-16): shell-migration-milestone-3's re-sweep at code start (its form's section 0.3), read-only, by a worker-high, read at main b88b1d2f; the run 2026-10-16T21:14:16Z to 2026-10-16T21:31:15Z by its transcript (Read 4, Bash 84, Write 2; its two Write calls both to its own scratch script, none in a repository); its one SubagentHandback call, at 21:31:13Z. The e2e suites at the base are the custodian's part, filed separately. Extracted by script, with the cites normalised mechanically so that each is a full pin at B: 15 cite(s) given the revision the report names for them, and 8 shortened path(s) written in full; each of the 45 pins' hashes recomputed at B by script and found equal; one cite's range, scope.ts:69-90, ran past the file's last line (85) and is written 69-85, the span its hash covers; one final newline added; nothing else changed. The message's sha256 as handed back is 98f2d5e87cc3f208d20caf1f9a329aa1d892d52a31b71394389ce3d3e81dcfc5; this file's, from line 5 to the end, is 4ec40659e5e644d574dccee0a77b0302da69ba013435341261c7959d92272ee5. Its section 2 and 4 class (b) rows, and its C9 question on the strict reading of I4, go to the architect for the form's re-sweep amendment before any code.*

---

# shell-migration-milestone-3 re-sweep at code start

Read at: main @ b88b1d2fba04e43489d4ef480060f45df2026173

`git fetch origin` run at start and again at end: HEAD and origin/main both equal that hash, main did not move. All findings are from `git show b88b1d2fba04e43489d4ef480060f45df2026173:path`. Nothing was written to the repository, no build/test/e2e was run. Note for the custodian: during my run the working-tree PLAN.yaml gained uncommitted edits (boundary-inventory set to done, plus a new proposed node); I read PLAN.yaml only from B's blob.

Method: pins were extracted from the form's blob at B (625 lines). Each pin's hash was recomputed from `git show ceff6d82bdd3223fefed46e209913db6d1552d40:path | sed -n 'a,bp' | sha256sum`. At B, each span was compared byte for byte with the same lines. Where it differed, the old span's text was searched line-aligned in B's blob. "Moved" means the old text was found exactly once, at new lines. "Changed" means it was not found.

**Verdict.** No invalidator found. I8 is not tripped: `applyFilter`, its deps and its outcome are byte-identical at B. I10 is not tripped: milestone 2's seam changes are additive. I4 is not tripped on my reading, but one judgment is the custodian's or architect's: PublishPanel's props changed in a way §0.5 does not list (item 2, C9). Seven (b) items are in §2 and §4 below and must go into the re-sweep amendment. Items B1 and B2 are the large ones.

## 1. Pins

Tallies:
- The form carries 57 `path:line @ ceff6d82… sha256` pins: 9 under `state/` (excluded as records) and 48 code/document pins.
- 48 of 48 code/document pins were copied correctly. The recomputed hash at ceff6d82 equals the form's hash for every one.
- 9 of 9 state pins were copied correctly and are identical at B. They are not tallied below.
- At B, of the 48: **16 identical**, **21 moved** (same text, new lines), **11 changed**.

All spans are read @ b88b1d2fba04e43489d4ef480060f45df2026173. For identical and moved rows, the hash is the form's pin hash and is also the hash of the B span. Changed rows show "-"; their B spans and hashes are in item 2. `fs/` stands for `frontends/shell/`.

| Form line | Pin (path:lines at ceff6d82) | Status | Lines at B | sha256 |
|---|---|---|---|---|
| 55 | fs/src/filter/predicateInput.ts:7-21 | identical | 7-21 | 9ada1b19f310017bd63528f2e27e3a18c1fbc6aac5752fca1c48deb3e7177c64 |
| 55 | fs/src/filter/FilterPanel.tsx:52-75 | identical | 52-75 | c368a1a233b12f9d4477c7184c2fb48322e7af21ec785e640359093055b890d2 |
| 55 | fs/src/filter/FilterPanel.tsx:123 | identical | 123 | 4ca189b570cf0d286e23a6c22360c338378ced873dc82230cd9f3ca35f391bac |
| 55 | fs/src/filter/FilterPanel.tsx:132-136 | identical | 132-136 | 2c5d6720d14438427aa1234a960a45e8f42ba564163611cced2340e5e45d2ea4 |
| 57 | fs/src/App.tsx:300-342 (applyFilter) | moved | 345-387 | 7cdffbcce25b7468ae352072b1454fc68ef047db3d9efd2400158d4d0089973b |
| 58 | fs/src/App.tsx:243-272 (deps) | moved | 288-317 | c7a54d34be5d50d5a152b108dc463c05062769b4df91400d4cedd2bfd55f5dfe |
| 58 | fs/src/App.tsx:236-241 (outcome) | moved | 281-286 | f62c0f8367da7de59c7fb9b3afd3fb2dcbde8a4970b383367a2689deb54d3168 |
| 59 | fs/src/App.tsx:929-965 (handleApplyFilter) | moved | 1021-1057 | d89199beacbc42d3481c8b4f0c5fe505e45a5ffd3196d1844d96e5d3c09b0eea |
| 60 | fs/src/App.tsx:901-904 (commit) | CHANGED | - | 8f07148cd6c10e39d0308b90923a92fdfd2349577266b7e331a74097f5d49a3d |
| 60 | fs/src/App.tsx:816-817 (state, ref) | CHANGED | - | e31b73713cf72e6828950b94c2f475d832e4972e89f59feacf6df5f109f35385 |
| 62 | fs/src/App.tsx:1407 (dev hook) | moved | 1595 | e8cf144fc06f05d56fa8395b41eeb0792e680b2519818898b80ffa92899223b1 |
| 62 | fs/src/App.tsx:1568 (dev hook) | moved | 1756 | c52ef30d7780c7f49f09ccda653a102fe17ba67015318aaa75640cc639f0cb85 |
| 63 | fs/src/App.tsx:1674-1688 (Filter slot) | moved | 1952-1966 | f92daa169dcdc97740cdd337c089da0da2350dd8f3ea33c5c0fcbdba84977aec |
| 63 | fs/src/App.tsx:1975-1983 (Export slot) | CHANGED | - | a8f5e3a079d3022d7418d7e36b45616d7724ecd2bf6df7971b019fa4e1c5d7d1 |
| 65 | fs/src/layout/StudioLayout.tsx:152-164 (keydown) | CHANGED | - | 63ba5a969a9cfb6721423af67e426e36030fc99fa0fb8e477ddb527f7a5511bc |
| 65 | fs/src/layout/StudioLayout.tsx:146-150 (runAction) | moved | 157-161 | 80fbe985163b06b5cbf772f081d537c264c4cc25b11228f9db596814a2f54809 |
| 66 | fs/src/layout/actionRegistry.ts:14-35 (ids, ACTIONS) | CHANGED | - | 9b8c11b2ba6297b5b433f826ff3166e88635dbde4a0747e4148f9f09f1a44abb |
| 66 | fs/src/layout/actionRegistry.ts:73-84 (matchChord) | moved | 100-111 | 93c3a34180377b4260810cc0a132fdb11de42d0187b520c3b7a16e983f304a05 |
| 68 | fs/src/canvas/WorkingCanvas.tsx:1940 (controller) | moved | 2012 | 8d2e6d749505719bf8174a9a1a37715edb85af8c06e100012c0ab58fc4f983aa |
| 69 | fs/src/layout/StudioLayout.tsx:207-228 (top bar) | CHANGED | - | 712bb7ac5db21d5c1cde88f52caf3cdf7584051063dc447ab2227ac33516a792 |
| 71 | fs/src/publish/PublishPanel.tsx:328 (expanded) | moved | 366 | 21189cbd2e2b67dd867b9107577692f69f55a00e242988f5935f5cda5e5a533f |
| 71 | fs/src/publish/PublishPanel.tsx:502-514 (disclosure) | moved | 575-587 | f27a42cb4420e2f72f54e7b8ea7452b9791403e1c17c7d8b016c41da8a3c0f65 |
| 75 | fs/src/skp/types.ts:17-20 | identical | 17-20 | 0ddd58f318eb570e0fee28deb61911ebd5b995a1fe364db66b98bc325319a44d |
| 75 | fs/src/skp/types.ts:244-251 | identical | 244-251 | e1133c8ba42826fc8d019e262582e0224f532e2336ebe49bc4523c4ee58d5945 |
| 76 | protocol/skp/SKP-V0.md:403-421 | moved | 425-443 | 0033a237f6827c35b6c5d06cbfd33d444989ef7d5ed0bf9e637d22f66f7c7cb2 |
| 77 | engine/src/predicate.rs:113 | moved | 115 | ce0c71917b0e199571309d3b989658e12bbf5c533ff7789ab3308ff65485cf94 |
| 78 | engine/src/predicate.rs:59 | identical | 59 | 905bc287c8263cf56a27703446f1acb936490c75972ecf2e51bbf4093328aea3 |
| 78 | engine/src/predicate.rs:120-126 | moved | 122-128 | 0d1babe0c044b86a40c5437882c0dca42e4503e88d23192e8550b937ad84bd4d |
| 78 | engine/src/predicate.rs:70 | identical | 70 | bba7755d315e486142dce0ce9eae94ae29e583a9594bb9e4f58c72898b18dc93 |
| 79 | protocol/skp/SKP-V0.md:442-458 | moved | 464-480 | 86c7813f5e3103e5e18370e82301b7794c6d4d1e9fafe770761aed27427214bf |
| 79 | protocol/skp/SKP-V0.md:465-483 (codes) | CHANGED | - | b9cafd3297d782fcfc37a04d40e7f5feb785feb4078ff683eb90188ccd6310c0 |
| 80 | protocol/skp/SKP-V0.md:423-425 | moved | 445-447 | 7cb203d913ea47bd89eb0b943c11b26e62a81403265e8582b86c33abd5c02823 |
| 81 | fs/src/skp/types.ts:158-167 | identical | 158-167 | 55cda2d3d2a230c032fea846c6afa83fda61757f20f83f9ff11c546744015653 |
| 81 | fs/src/skp/types.ts:116-129 | identical | 116-129 | 1be3c90172781dfc71e938837d84223d175f8ffe5402d3dbfc12eed77bcd6e01 |
| 81 | fs/src/skp/types.ts:186-191 | identical | 186-191 | 826b58fbd287ee088963cfa4f7c9bfddb6197ccdb6ca3e1dff41e03bd3aeed31 |
| 82 | fs/src/admission/AdmissionPanel.tsx:258-260 (Props) | CHANGED | - | b9484c475e12b276fe1498b1bd50e15587e44d21e855462dbc9f3ebe66db8baf |
| 82 | fs/src/admission/AdmissionPanel.tsx:290-296 (handlePick) | moved | 302-308 | 03e18920860c94be49a0b6d145827aedc02ead71394f884ce594a64ac825d416 |
| 82 | fs/src/admission/AdmissionPanel.tsx:348-350 (button) | moved | 362-364 | 37e5c4be9884a5966d94874fb2841bcfee0133bdca0ae8328bc7127577a7af05 |
| 83 | fs/src/publish/PublishPanel.tsx:284-305 (Props) | CHANGED | - | 997c59ce56ad68466f8c255bab0b06876737e2b493ffed4a1cadbbd8767dedfa |
| 83 | fs/src/publish/PublishPanel.tsx:604-611 (button) | moved | 681-688 | 40ce288199da75877461e383f672943fe604400f7a76e76c9e1214fe8dec598a |
| 84 | fs/src/layout/StudioLayout.tsx:107-117 (props) | CHANGED | - | 1ac2231a88254131218f77839e38f362d1b6657b11b4b15fc5d38c8262b636b7 |
| 84 | fs/src/layout/actionRegistry.ts:86-95 (labels) | moved | 113-122 | f81523f33f7641bd3973902a8e0ca052e16cc014db9927359364ac69f8a2e8ab |
| 84 | fs/src/layout/contributions.ts:66-72 (slots) | CHANGED | - | a077987dda7001deb0e34b93de6f8969dd3f7c654fa73773f3e23dfbb4051044 |
| 90 | fs/src/App.layout.test.tsx:11-14 | identical | 11-14 | 4c41aeb31e33a7ae03d43911b47992bcf27cffe93badb7b106d90a5980e061c9 |
| 90 | fs/src/App.layout.test.tsx:64-103 | identical | 64-103 | fa25900a4c39dbd0d518f50aba31a6d04e9bb4d7a5d9333545770df444bafb48 |
| 90 | fs/src/App.layout.test.tsx:109-119 | identical | 109-119 | 2ae70974bae4236f2ab694e37a3a037931302aa0f6d2213294bf29cd52d1b793 |
| 91 | fs/e2e/layout.mjs:190-221 | identical | 190-221 | 0e201e32458087b4d29fcac8dbbc967287cb458dd497dedac5bef0040148e80a |
| 277 | fs/src/canvas/viewportBbox.ts:16-23 | identical | 16-23 | 9039376f9697a5defe84cf8cc350e74827dad527bc289bffd84424750da14828 |

Bare cites with no hash in the form:
- "App.tsx:279-288's comment" (§2.5) has moved to `frontends/shell/src/App.tsx:324-333`. The sha256 of those 10 lines is the same at both revisions: fba0d1622c18d9b90293811dbed661c7022560d165aec43f21a25590a124b0f6.
- UC8's "the test at :49-51" is unchanged: `frontends/shell/src/layout/actionRegistry.test.ts:49-51 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:45b0c77bfc20fefee7c41b18f4ebdd890bd703b2aed8f470d4eb1c5d8b996420`. That is the same hash as at ceff6d82.

## 2. The 11 changed pins

All new spans below are @ b88b1d2fba04e43489d4ef480060f45df2026173.

**C1. App.tsx:901-904 (the commit, form line 60). Class (b).**
- The form uses it for "The commit writes the ref and the state".
- B: `frontends/shell/src/App.tsx:987-996 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:05f80495437e9063153300b3e1aec92d8f7fbc7c6e69014812e72238cbea530d`. `commitActiveFilter` writes the ref, dispatches `view.transition` `filter.apply` on the view, and enqueues a `record_step` of `{action: "filter.apply", params: {filter}}` on the step queue. `setActiveFilter` is gone.
- The workspace half is anticipated by form line 61.
- The step enqueue is new (piece 1b) and the form is silent on it. The impact is in §4 below (B1).
- Sections affected: §1 (Principle 4 bullets and "May not claim"), §2.5 (path to the kernel, Rows), §4 (RC3, RC5, RC14), §7 (App.tsx and test ceilings).

**C2. App.tsx:816-817 (state and ref, form line 60). Class (a).**
- B: `frontends/shell/src/App.tsx:836 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:281ed889b56eebdf60a0b08a57c984c5ec6b2fa99638af499c9c86a6a84e6862` (`activeFilter` is now read from the view's `filter`).
- B: `frontends/shell/src/App.tsx:910 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:57f13d53769efdaaa9ded569590c2050f9fbb112675b1349fca54ad7b4bcc92f` (`activeFilterRef`).
- Same fact. Anticipated by form line 61.

**C3. App.tsx:1975-1983 (Export slot, form line 63). Class (a).**
- B: `frontends/shell/src/App.tsx:2314-2325 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:4680803ceac485536b7c634e62c7e5450f4e7b9d55bddaf14a27425e5664bdb3`.
- `filterActive={activeFilter !== null}` is still there. The panel also gets `getViewBox`, `subscribeViewBox`, `stageScope`, `checkStagedScope` and `onExportRunning`.
- The form's word "only" is now false for the props. It stays true for the filter, which still reaches the panel as the boolean.
- Seam 6 holds: `frontends/shell/src/workspace/scope.ts:54-67 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:b572c637674e9fb47d108b0513318dc6c04da5fdff951b7635e25a331b653851` and `frontends/shell/src/workspace/scope.ts:69-85 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:d33f26992f7150af81851d53f6bf7764860ce1fb86e3a26a32a90ab4b4be6f69`. `filterAsApplied` is the view's `filter`, compared by value (predicate and dialect).

**C4. StudioLayout.tsx:152-164 (the keydown listener, form line 65). Class (a).**
- B: `frontends/shell/src/layout/StudioLayout.tsx:168-187 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:318b268faee540aa699215ffdf4ecd30369fe6ca3e4fb667b051af57f0f44abf`.
- Still one `keydown` listener on `window`. It calls `runAction` when `matchChord` hits, then falls through to the bare-tool-key branch (`matchToolKey`, then `onSelectTool`). Anticipated by form line 67.
- The dispatch consequence is §4 B3.

**C5. actionRegistry.ts:14-35 (ids, ACTIONS, form line 66). Class (a).**
- B: `frontends/shell/src/layout/actionRegistry.ts:18-57 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:bda1dffdb9645642f469ed9d2561155e53db319040974e67e1b658f249f0c8bb`.
- Eight entries, not four. `ActionEntry` has gained `bareKey` and `scopeWords`, both required, and every literal sets them explicitly. The new `command` and `takes` fields are additive in the same way.
- `matchChord`'s body is unchanged (moved to 100-111). Milestone 2's tool-key matcher is `matchToolKey` at 146-157.

**C6. StudioLayout.tsx:207-228 (top bar, form line 69). Class (a).**
- B: `frontends/shell/src/layout/StudioLayout.tsx:230-252 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:b5936b6aea75bb76b2cc98ea63e2b5b7debb662e9838d6c77d3e3ecd3531d806`.
- The header is `.app-header`, then `{hasContent(slots["topBar.tools"]) && …}`, then `.top-bar-toggles`. The tools slot is filled only when a dataset is admitted (App.tsx:2278).
- §2.3 says "after `.app-header`". It must pick before or after the tools block. No test depends on that order.
- A read, not a change since ceff6d82: `.top-bar` has `overflow: hidden` (`frontends/shell/src/styles.css:57-65 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:856897a188fa028021264bf66f0aee41248bc9185f574e01f0155d6f665d94c4`). A list rendered as a descendant of the bar would be clipped. §2.3's "below the top bar" has to account for that.

**C7. SKP-V0.md:465-483 (refusal codes, form line 79). Class (a).**
- B: `protocol/skp/SKP-V0.md:487-505 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:121d5ac38911d3d0201c7279aee8b43dd94529c8271c4212662716650e74fed2`.
- The only difference is one cross-reference: "§6/§4 item 8's" became "§5/§4 item 8's". The eleven-code table is identical.

**C8. AdmissionPanel.tsx:258-260 (Props, form line 82). Class (a).**
- B: `frontends/shell/src/admission/AdmissionPanel.tsx:267-271 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:1bb2a139fcbb5f7169421620287be1d2828aa71cc5342907e30e497825d87e2b`.
- `confirmOpen: () => Promise<boolean>` is built (required). The form says "may add". The flow is `handlePick` (302-308), then `pickFile`, then `admitPath`, then `confirmOpen` awaited before the first `setState` (`AdmissionPanel.tsx:203`).
- `isOpenInFlight` is at line 124 and the button's `disabled` at 362-364, both as the form says.

**C9. PublishPanel.tsx:284-305 (Props, form line 83). Class (a), with a flag.**
- B: `frontends/shell/src/publish/PublishPanel.tsx:316-340 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:c96a903892194e291d04344dbfa921c51f457193cd1ad71897bbe98fe4847d04`.
- `hasSettledView` and `getLastViewportBbox` are gone, replaced by `getViewBox` and `subscribeViewBox` (PR #219). Milestone 2's `stageScope`, `checkStagedScope` and `onExportRunning` are added.
- §0.5 names only milestone 2's three. Read strictly against §0.3, "an interface that differs from §0.5 is I4". I judge it not an invalidator: the plan consumes only the component's existence, a new `forwardRef` handle, and the DOM hooks `.publish-disclosure` (575-587) and `.publish-open` (681-688). All of these are unchanged text.
- `.publish-open` is mounted only while `expanded` (line 588). Its `disabled` now also covers `scope === "current" && currentDisabled` (line 685). `reveal()` must focus after the expanded render, and fall back to `.publish-disclosure` when the button is disabled, as §2.7 already says.
- Please rule on the strict-I4 reading.

**C10. StudioLayout.tsx:107-117 (props, form line 84). Class (a).**
- B: `frontends/shell/src/layout/StudioLayout.tsx:115-128 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:7ea13cd4a5240d02a61cc7603b00a94c3c9747f4c8d9540383a2aea5022000f9`.
- Gains the optional `onSelectTool`. Anticipated.

**C11. contributions.ts:66-72 (slots, form line 84). Class (a).**
- B: `frontends/shell/src/layout/contributions.ts:66-83 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:dcc8d2cef979a57cf3347ab69d6b08a53b3f935d8d5c9b0909194ea272baf15f`.
- Gains `topBar.tools` and the optional `status.selectionEnded`. `INSPECTOR_TABS` now lists layer, style and feature, so `selectTab(inspector, layer)` is still valid. Anticipated.

## 3. §0.5, each interface as read at B

- **Kernel admission, identical or moved with the same text:**
  - `Filter` and the fixed dialect: `types.ts:17-20` and `244-251` are identical.
  - Composition `WHERE (<predicate>) AND <bbox>` is at `SKP-V0.md:425-443`.
  - `AdmittedPredicate::admit` is at `engine/src/predicate.rs:115`.
  - The 4,096-byte refusal is at 59 and 122-128, and depth 32 is at 70.
  - Admitted constructs are at `SKP-V0.md:464-480`, and the namespace sentence at 445-447.
  - Engine diff since ceff6d82: `AdmittedPredicate` gained a `columns` field and a `referenced_columns()` accessor, whose product caller is the kernel's session-history module. This shifts the pinned lines by 2. Admission behaviour is unchanged.
  - Refusal codes (C7): the table is the same, with one cross-reference reworded.
- **Schema the shell holds:** `types.ts:158-167`, `116-129` and `186-191` are identical.
- **Open path:** Props differ (C8, anticipated). `handlePick` and the button are the same text, moved.
- **Export panel:** Props differ (C9, flagged). The button is the same text, moved.
- **Registry and frame:** StudioLayout props, `ACTIONS`/`ActionId` and the slots differ (C5, C10, C11, all anticipated). The label functions are the same text, at 113-122. The milestone 2 additions named in §0.5 are all present:
  - `topBar.tools`: `contributions.ts:71`.
  - Tool ids: `actionRegistry.ts:18`.
  - `matchToolKey`: `actionRegistry.ts:146-157`.
  - Scope declarations: `scopeWords`, `actionRegistry.ts:44-45` and `55`.
- **Milestone 2's workspace, read at B:**
  - Union of nine transitions: `frontends/shell/src/workspace/viewTransitions.ts:52-61 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:94aaf42e0ecb134ccc1b55d39bfdcd3230eddd7786548c429a6107bacfce9243`.
  - `filter.apply` replaces only `filter`: `frontends/shell/src/workspace/viewTransitions.ts:95-98 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:b24a9ba2a729d418ed413bbbd5af2d3791c61bad792a44c104632e17574debef`. The selection survives (UB5).
  - `ViewState`: `frontends/shell/src/workspace/workspaceState.ts:67-80 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:ceba458c3ae7d3607554b5cf57133e46cb78bd75070dedf6effcced431d89b6d`.
  - `resource.admitted` resets `filter: null`: `frontends/shell/src/workspace/workspaceState.ts:140-146 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:6a5057974fe0357af701a20c45abfc955aaf83a0d75c834201f2ea5c95269c7f`.
  - `resolveScope` and `checkScope`: scope.ts spans in C3.
- **Render harness and Tab walk:** identical (item 1).
- **A difference the form's §4 states wrongly, pre-existing:**
  - §4 says the manager stand-in records `requestViewport(bbox, bboxCrs, filter)`.
  - The real signature is `(bbox, bboxCrs, nowMs, filter)`: `frontends/shell/src/streaming/viewportStreamManager.ts:163-168 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:cb533810c4f5834e6eff80cb41b9266610d80aac812b58f365d4295b614c6fba`. `streaming/` is unchanged since ceff6d82.

## 4. §0.4 as read, and what piece 1b added

Still holds, text identical:
- `predicateTextToFilter` (`predicateInput.ts:7-21`), which sends non-empty text verbatim.
- FilterPanel's submit (`FilterPanel.tsx:52-75`), and its applied-predicate line and its refusal (lines 123 and 132-136).
- `applyFilter` (`App.tsx:345-387`). It cancels the pending debounce and issues `requestViewport(null, newFilter)`. On an issued outcome it commits and calls `resetFitForNewGeneration`. On a refusal it formats the refusal first, then re-issues the last applied filter. Otherwise it returns not-applied.
- `ApplyFilterDeps` (288-317) and `ApplyFilterOutcome` (281-286).
- `handleApplyFilter` (1021-1057), with its generation guard. It calls the unchanged-looking `commitActiveFilter`, which is C1.
- The two dev hooks (1595, 1756): their `applyFilter` call text is identical, and both commit through the same `commitActiveFilter`.
- The Filter slot (1952-1966).

Changed: the commit (C1) and the state (C2).

What piece 1b added to this path:
- `commitActiveFilter`, after the ref write and the `filter.apply` dispatch, calls `stepQueue.enqueue(dataset, {action: "filter.apply", params: {filter}})` (`App.tsx:987-996`). It is called only from `applyFilter`'s issued branch, so a refused or not-applied filter records nothing. The doc comment states this ("after an issued outcome, never before it", `App.tsx:980-985`).
- The queue and notice state: `frontends/shell/src/App.tsx:832-842 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:9b66e20466382404682044d76b423e0560f419117b03451217ce3c71a16e526a`. The queue is `frontends/shell/src/workspace/stepRecorder.ts:1-20 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:55f8e314eb4933443eaf6aa6458e502b3aa6de31ae6a7aba427693b893b810f1`. It is first in, first out, with one call in flight and at most 64 waiting.
- A step that was not recorded shows its notice in the attention strip: `frontends/shell/src/App.tsx:2175-2176 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:3d231a759b044ce2e32a08d6d155f6906a594024742036f4867d3441d57178c4`. The text begins "Filter applied." for a filter step.
- The wire union has two actions, `filter.apply` and `style.set`: `frontends/shell/src/skp/types.ts:290-312 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:552c6d5a166010f042e87331df904ef25e3c4306c308b9a612cfe21c61c332bc`. A clause id cannot reach the kernel's history. This is consistent with §1's "No change to the wire".
- The console has a class-A `record_step` row: `frontends/shell/src/console/surfaceRegistry.ts:78-87 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:e442bee183fb3e7ea2f958bba5ba7f2af5d62145411a085dd6cf4817cdb3fe32`.
- The style class-C rows left the table because each committed edit is now that class-A row: `frontends/shell/src/console/surfaceRegistry.ts:167-177 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:bd7ea00160f62038df64c495f71ba947b40592bb63e64b3a05a1bef009a90986`. Only `style.resetToDefault` stayed.

**(b) rows the amendment must carry.** None is an invalidator. B1 to B3 are changed facts.

**B1. Card changes and `record_step`.**
- §2.5 says the card commit "writes `activeFilterRef.current = proposal.filter` and dispatches `filter.clauses.set`". As written it records nothing to the kernel's session history, while a Panel Apply and Clear do.
- Every issued card change must enqueue one `filter.apply` carrying the combined filter (a value, never a delta), once, after the commit. A shared helper with `commitActiveFilter` avoids drift.
- §1 says "Each clause action records one class-C row, with a P6 statement that it has no API equivalent." Piece 1b's precedent (`surfaceRegistry.ts:167-177`) removed such rows where a step is now recorded. The "no API equivalent" statement must not be said of a change whose combined filter now reaches the kernel as `record_step`. Wording is the human's at P6.
- §1's "May not claim … logged" needs a distinction: the kernel's session history records the combined filter, not the clauses.
- §4: RC3, RC5 and RC14 can assert the recorded step. The render harness needs `recordStep` in its SKP-client mock (B5).
- §7: the App.tsx and test ceilings are affected.

**B2. Principle 4 rows and notices.** The record-failure notice is shown in the attention strip for card changes too. §2.5's "Rows" bullet and §1's "Operator-visible text" bullet should say so.

**B3. Dispatch.** Form line 181 says "An applied action calls StudioLayout's `runAction(id)`, the function its chord and its button call." At B this is true only for the three region toggles and Zoom to layer.
- `runAction` is at `frontends/shell/src/layout/StudioLayout.tsx:157-161 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:80fbe985163b06b5cbf772f081d537c264c4cc25b11228f9db596814a2f54809`, and it handles only those.
- The four milestone-2 entries run elsewhere. Navigate and Select go through App's `handleSelectTool` (`frontends/shell/src/App.tsx:1844-1855 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:e0986295e5228e79e1a5d5df6b5bcbf2b24db8a3e19068c5f0d6253b21b2c3cf`, via `onSelectTool` and the tool switch buttons).
- Zoom to selection and Clear selection go through App's `handleZoomToSelection` and `handleClearSelection` (`frontends/shell/src/App.tsx:1871-1883 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:89add85e8eb705120270261dfa36f799922b857ee7292dbb595f3653981ee94b`), called by the Feature tab's buttons. These two are disabled when nothing is selected (`frontends/shell/src/feature/FeatureTab.tsx:128-135 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:e81bfea9053af2588b1eedd9eb1c661e72de6240af1d63e383bed858697933ac`), and the bar's `available` needs the same rule from App.
- §2.2, §2.3 (Running), §5 Falsification 2, §8 item 8 and §7's StudioLayout/App ceilings must be re-worded. The single dispatch has to be built by passing these handlers into StudioLayout like `onZoomToLayer` and `onSelectTool`, so that one `runAction` reaches all of them. If instead the bar called App directly for these four, that would be a second path. Falsification 2 is not tripped as long as the single `runAction` is built.

## 4b. Further (b) rows found while checking §2 (not pins)

**B4. `ViewState.clauses` and pinned tests.**
- §2.5 says `ViewState` gains `clauses`.
- `workspaceState.test.ts:46` pins the minted view to `{ id, resource, filter, style }` (`frontends/shell/src/workspace/workspaceState.test.ts:46 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:4204194667f729eefe4b17d41715669fba7666f31cc6d82203de82425804bbfd`). `workspaceState.test.ts:155-163` pins its keys to "filter", "id", "resource", "style" (`frontends/shell/src/workspace/workspaceState.test.ts:155-163 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:c86b2532c0d26c854507d8c694e7028dbddd3289339010e58c9e0b73e5b1ccb4`).
- Milestone 2 kept those pins by making its new members optional behind readers (`viewTransitions.ts:63-69`, doc at `workspaceState.ts:60-66`).
- §2.5 and UC7 must say which route they take: an optional `clauses` with a reader, or a declared edit to those two tests (the declared `workspaceState.test.ts` ceiling is 40 lines).
- UC7's union edit is real: `viewTransitions.test.ts:53` pins "exactly section 2.4's nine names". The test is labelled UA4.

**B5. OPEN-8 (b), the bare slash, against the registry's shape.**
- Amendment 1 item 9 places the `/` match "in the keydown listener and actionRegistry.ts's match".
- At B the bare-key mechanism is `ActionEntry.bareKey`, read by `matchToolKey`. It returns `entry.id as ToolActionId`, and UB10 asserts that only the tools have a key (`frontends/shell/src/layout/actionRegistry.test.ts:249-257 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:b45e46d6e8f67f8861c1e66d460ddd4586b53fb99267e41d050c5865aff2279d`).
- Putting `/` on `command.focus`'s `bareKey` would fail UB10 and mis-type the matcher's return. Use a separate third matcher, or declare the UB10 and cast edits.
- RC-SLASH's three cases (§10 Amendment 1 item 9) stand either way.

**B6. Render harness, copied.**
- §4 and §0.5 say to copy App.layout.test.tsx's harness (identical at B). Its SKP-client mock has no `recordStep`, and its manager stand-in never settles.
- `App.recording.test.tsx` (new, piece 1b) has a mock with `recordStep` logged and refusable, and a manager stand-in that settles as issued or rejects by predicate, with the four-argument signature: `frontends/shell/src/App.recording.test.tsx:83-96 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:331a3b0758b8fb43c23657679519c61b5fb6f5f8dedad846c699fc74f20a2977`. Its header says its harness is App.workspace.test.tsx's.
- Without `recordStep` in the mock, every issued filter in a copy of the layout harness would fail inside the queue and show a record notice.
- The copy should add `recordStep`. §4 should also say which of the three harnesses it copies.

**B7. Names (item 5).** The row ids Y0 to Y12 all move; see item 5.

## 5. Names the form must take at B

- **Next unused walkthrough Part: AB.**
  - Last Part heading: `frontends/shell/MANUAL-WALKTHROUGH.md:1897 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:238a27a791a87412e125b40fd675f65a7bf16914ac65b0da1cef884a3673909c` ("Part AA", piece 1b).
  - Part Y is taken (`frontends/shell/MANUAL-WALKTHROUGH.md:1851 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:dfab34c52147e9cfa5661592e7ee8e955c73bb0cd39e475519f5781f10e2f820`, the Current view fix). Part Z is `:1876`, and X and W are at 1791 and 1808.
  - No "Part AB" occurs in any tracked file outside `state/consults` (`git grep`).
  - Every row id the form writes as Y0 to Y12 collides with Part Y's rows and must move to AB: §0.6 H2 ("row Y1") and H4 ("row Y7"), §2.10, §4's tables and the "Operator" lines, Amendment 1 items 3, 9, 10 and 14.
- **Next free KNOWN-LIMITATIONS numbers.**
  - Numbered items 1 to 43 are present in `KNOWN-LIMITATIONS.md` at B. Item 43 (piece 1b) is at `KNOWN-LIMITATIONS.md:390 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:c22c976f428e62d266bf47043a06e577a3dc7e77d07c4136a1aa34a97c1353eb`.
  - Item 44 is claimed by a committed form but not in the file yet: `KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md:7 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:98a6e3cc3193ac0170c8d4e9dd03104f1d71de3b86b99aa56e768bfa8b4b7a33`. Its PLAN node `known-limitations-crs-epoch-edges-third-axis` has status ready (PLAN.yaml:4571 region).
  - So the OPEN-3 (A) and OPEN-4 (a) items take **45 and 46** if item 44 lands first. If the item-44 node is dropped or does not land first, they take 44 and 45. The form's own rule (§2.10) is to read this at the code base, and the items land in PR B (Amendment 1 item 10), so the numbers must be read again at PR B's base.
  - A third number may be needed for OPEN-9 (i), which is not yet drafted (Amendment 2 item 2).
- **Item 39's third sentence.** It is at `KNOWN-LIMITATIONS.md:379 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:ade05ff3699847fc81592b239f647a4be3bb3b9338b4614efb3ef7196e647ade`: "One exception: after a file is opened, after a filter Apply or Clear whatever its outcome, and after the map fits itself to the data, a change of size asks for nothing new until the next pan or zoom." Item 39 is unchanged since ceff6d82 (`git diff` hunks touch items 2, 36, 38, 40, 41, 42 and 43 only). Its source comment, at :380, calls the third and fourth sentences the human's own wording of 2026-10-11. The replacement is in bounds only under Amendment 1 item 10's approval.

## 6. §2 boundaries against B

- **"May edit" files that must exist:** all exist: `actionRegistry.ts` and `.test.ts`, `StudioLayout.tsx`, `App.tsx`, `AdmissionPanel.tsx`, `PublishPanel.tsx`, `console/surfaceRegistry.ts`, `styles.css`, `package.json`, `workspace/workspaceState.ts` and `.test.ts`, `workspace/viewTransitions.ts` and `.test.ts`, `App.layout.test.tsx`, `e2e/layout.mjs`.
- **"New" files:** none of `src/command/`, `workspace/filterClauses.ts`, `filter/ClauseCards.tsx`, `App.command.test.tsx` or `e2e/command-bar.mjs` exists at B, so nothing collides.
- **Conditional files:** `layout/scaleBar.ts` and `layout/nativeMenu.ts` do not exist and are dropped by Amendment 1 items 7 and 8.
- **"Not edited" files that gained something the plan needs:** none.
  - `skp/` gained `recordStep` and `StepIntent`; the plan needs nothing new there.
  - `canvas/` gained selection work. `resetFitForNewGeneration` is still in the `applyFilter` path.
  - `feature/` and `layoutState.ts` need nothing.
  - `stepRecorder.ts` needs nothing if the combined filter reuses `filter.apply` (B1).
- **Boundary scans over the plan's files:**
  - `workspaceBoundary.test.ts` (UA6) scans every non-test file in `src/workspace/` (`frontends/shell/src/workspace/workspaceBoundary.test.ts`). `filterClauses.ts` may import `Filter` as a type and the dialect constant from `skp/types`, not `skp/client` or React.
  - `soleCaptureSite.test.ts` allows `recordNamed` only from a fixed list (`frontends/shell/src/console/soleCaptureSite.test.ts:49-62 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:da5fd507bf443181b9f276b1b595a899790df96b4a1d751012ba97da91d14f47`). `App.tsx`, `StudioLayout.tsx` and `PublishPanel.tsx` are on it; `CommandBar.tsx` and `ClauseCards.tsx` are not. The form already puts the rows in App's handlers.
  - `regression.mjs:378` asserts `.app-header` text equals "Spatial IDE". The bar must be a sibling of the `.app-header` span, as §2.3 has it.
- **Declared shapes:** holding:
  - `ActionEntry` additions are additive, and `matchChord`'s body is unchanged.
  - The "eight ids" test lists exactly the eight ids (`actionRegistry.test.ts:121-136`).
  - The test at :49-51 is unchanged (its `ctrl("k")` becomes wrong when `command.focus` takes K; that is the declared edit).
  - `AdmissionPanel` and `PublishPanel` are plain function components, so the `forwardRef` change is as §2.7 declares.
  - `AdmissionPanel` is in the unconditional `region.layers` slot (`App.tsx:1933-1936`), so `requestPick()` is reachable with Layers closed.
  - The Export section is `admitted &&` (`App.tsx:2314`), consistent with the "no dataset" availability rule.
- **Declared shapes:** not holding as written: dispatch (B3), the record step (B1), `ViewState` (B4) and the bare slash (B5).
- **`confirmOpen` and `requestPick()`.** App's `confirmOpen` says that a second call drops the first ask (`frontends/shell/src/App.tsx:1148-1160 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:2542da92eddef0b49db9120645bb15256c949619e96ce0f78ef02b5ce3800201`). `isOpenInFlight` is false while the picker or the ask is open. §2.7's busy rule (the button's own condition) therefore does not cover a second `/open` during the ask.

## 7. Hypotheses

- **H1.** Same reading at B: composition, constructs and `admit` are the same text (item 3). The discriminator, E-AND, is a run and reads the same. One new fact in E-AND: if B1 is adopted, its `.filter-active` and map checks gain a `record_step` row (not an assertion the form has now).
- **H2.** Unchanged. Real keys only. Nothing new at B, and nothing in the source takes Ctrl+K.
- **H3.** Reads differently in two ways:
  - `layout.mjs` is unchanged since ceff6d82 (no diff) and the Tab walk's lines are identical. The `header` selector still gives "top", so the bar inside it counts as "top". The tool switch (admitted only) is already inside that header.
  - "Every existing e2e suite" now includes three suites added since ceff6d82 (item 8). `console.mjs` and `regression.mjs` were edited by piece 1b.
- **H4.** Unchanged. `controller: true` is at `WorkingCanvas.tsx:2012`. The only window `keydown` listener in `src` is StudioLayout's (169-186), plus FilterPanel's, the tab/splitter handlers and PublishDialog's own.
- **H5.** Unchanged. It concerns the recognizer, which does not exist yet.
- **H6.** Dropped with OPEN-6 (Amendment 1 item 7). The scale display (OPEN-7) is dropped too, with the SC row and Y12 (item 8).

## 8. E2E suites at B

`frontends/shell/package.json:25-40 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:2a3e6133743b606cb31de5e0ae61113e67c2c59d58a9e405df797f08e9f37910`. All files exist at B.

| Script | File |
|---|---|
| e2e:debug | e2e/debug-session.mjs |
| e2e:regression | e2e/regression.mjs |
| e2e:refusal-contract-baseline | e2e/refusal-contract-baseline.mjs |
| e2e:admission | e2e/admission-remediation.mjs |
| e2e:filter | e2e/filter.mjs |
| e2e:filter-panel | e2e/filter-panel.mjs |
| e2e:style | e2e/style.mjs |
| e2e:publish | e2e/publish.mjs |
| e2e:console | e2e/console.mjs |
| e2e:layout | e2e/layout.mjs |
| e2e:selection | e2e/selection.mjs |
| e2e:export-view | e2e/export-view.mjs |
| e2e:recording | e2e/recording.mjs |
| e2e:residency-harness | e2e/residency-harness.mjs |

- **Added since ceff6d82: three.** `e2e:selection` (milestone 2 phase B), `e2e:export-view` (PR #219) and `e2e:recording` (PR #222). The diff of `package.json` since ceff6d82 is exactly those three lines.
- **Edited since ceff6d82:** `console.mjs` and `regression.mjs`.
- `e2e:debug` is the README's debug session, not a pass/fail suite. `e2e:residency-harness` is a measurement harness with flags.
- **Present but with no script:** `e2e/pan-anchor.mjs`, `e2e/source-changed.mjs`, `e2e/source-watch-idle.mjs`. They are unchanged since ceff6d82 and I could not tell whether any of them is part of the run set; the custodian decides.
- Other `verify` members that are not `e2e:` scripts: `test:residency-trace` and `test:citation-integrity`.

## 9. Rule 00

At B (committed blobs):
- `PLAN.yaml` status counts: 181 done, 85 proposed, 21 unscheduled, 9 blocked, 1 ready. The value "in progress" occurs on no node. So no node is in progress, with or without a path under `frontends/shell`.
- The one ready node is `known-limitations-crs-epoch-edges-third-axis` (PLAN.yaml:4571 region). Its Scope is `KNOWN-LIMITATIONS.md` and `PLAN.yaml` only. It is not under `frontends/shell`, but it will edit the same `KNOWN-LIMITATIONS.md` that milestone 3's PR B edits, and it reserves item 44 (item 5).
- `shell-migration-milestone-3` is `proposed`, with `gate: none` and `depends_on: [shell-migration-milestone-2, export-current-view-after-unreported-fit]` (`PLAN.yaml:5022-5026 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:01ab7685063dc5c85f54b30e1598367d952d4b4666da33b992752a83a9dcaa1f`). Both dependencies are done. Setting the node in progress would name a gate file, so that field wants the form's path.
- `boundary-inventory` at B is `proposed`, lane governance, gate none, read-only (`PLAN.yaml:5240-5246 @ b88b1d2fba04e43489d4ef480060f45df2026173 sha256:927c332ef20b32b01fd413e3f95644edd7be886acbb2b1645f4926c21122a7c3`).
- `gh pr list --state open` returned `[]`, so no PR awaits merge.
- `git worktree list`: the main checkout at B; an unmerged governance branch worktree `governance/verify-mutation-header-token`; and two detached worktrees under `C:/dev/wt` (`mm2b-e2e` at B, `triage-a3-obs3` at 31d7d34c).
- The governance branch is not a PR and touches only `scripts/plan/verify-mutation.mjs`, its test and a form file (`git diff --stat origin/main...` of that branch).

## Files read

Working tree at B unless marked "(blob at B)". Everything else was read as `git show b88b1d2fba04e43489d4ef480060f45df2026173:path`, with the same paths at `ceff6d82bdd3223fefed46e209913db6d1552d40` for the pin recomputation.
- `.claude/agents/worker.md`
- `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md` (whole, 625 lines)
- Code under `frontends/shell/src/`: `App.tsx`, `App.layout.test.tsx`, `App.recording.test.tsx`, `admission/AdmissionPanel.tsx`, `publish/PublishPanel.tsx`, `filter/predicateInput.ts`, `filter/FilterPanel.tsx`, `layout/StudioLayout.tsx`, `layout/actionRegistry.ts`, `layout/actionRegistry.test.ts`, `layout/contributions.ts`, `layout/layoutState.ts`, `layout/layoutConstants.ts`, `skp/types.ts`, `streaming/viewportStreamManager.ts`, `canvas/WorkingCanvas.tsx`, `canvas/viewportBbox.ts`
- Workspace: `workspace/workspaceState.ts`, `workspace/workspaceState.test.ts`, `workspace/viewTransitions.ts`, `workspace/viewTransitions.test.ts`, `workspace/scope.ts`, `workspace/stepRecorder.ts`, `workspace/workspaceBoundary.test.ts`
- Feature, console and styles: `feature/FeatureTab.tsx`, `feature/ToolSwitch.tsx`, `console/surfaceRegistry.ts`, `console/surfaceRegistry.test.ts`, `console/surfaceCompleteness.test.ts`, `console/soleCaptureSite.test.ts`, `styles.css`
- `frontends/shell/e2e/layout.mjs`, `e2e/lib.mjs`, `e2e/README.md`, `package.json`, `MANUAL-WALKTHROUGH.md`
- `engine/src/predicate.rs`, `protocol/skp/SKP-V0.md`
- `KNOWN-LIMITATIONS.md`, `KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md`, `KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md`
- `PLAN.yaml`
- Pin recompute only: the 9 `state/` files the form pins.
