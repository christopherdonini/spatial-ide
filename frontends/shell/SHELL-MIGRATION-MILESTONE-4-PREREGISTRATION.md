# Shell migration, milestone 4: B1's shell half. Attributes of the inspected feature, colour by category with its legend, and the table with its three scopes (PLAN node `b1-shell-half`)

- **Path:** `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `b1-shell-half`, its whole summary.
  - The human's rulings: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0492f90a35a4b8ec4a2d45ee5df5be2253f7891e5410f66b606d49b04dd04fdb for the milestone, and `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4b060a097e2669c574a255533c6db432f4f3bb4e477b51d38bb8f192cbff8f1d for route (i), which carries OPEN-4 (A′).
  - The start: `state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md:10` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:15db75197c7a913dc5cba40d6116838cd48095cc8d89c68409533187d4a19a3b (Slot 1).
  - The placement: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md`, item 3.
  - The migration plan:
    - §8: `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:233-241` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:387f037e8fadacfd1b809dd58b5b1a89adebbc7c8689f96cbecddf055330c7f3;
    - §3's labels: `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49-52` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:8bbcc6a4320c5bf413853f1c99c94064908da2ed67556b6269508a969a17d028;
    - its ruling: `state/directives/2026-10-07-migration-plan-v2-ruled.md`.
  - B1's engine half (`engine/B1-PROJECTION-PREREGISTRATION.md`):
    - the caller rule: `engine/B1-PROJECTION-PREREGISTRATION.md:214-216` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f74bb0fc69be34397bfbd2f1057e28033fa911f1ba9cec554497164fe78f59e6;
    - Amendment 1, where O7 names this node: `engine/B1-PROJECTION-PREREGISTRATION.md:395` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:31846c81e466a75344dd8e1704a94bbd93a6dbe7599a70f34fec7a4c1bcc733a;
    - the operator line: `engine/B1-PROJECTION-PREREGISTRATION.md:384` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:de65752f1484810334a521cf562b0e48720c3c5b3706c72f6498e505b02a10e7;
    - the strings line: `engine/B1-PROJECTION-PREREGISTRATION.md:80` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:5e988b41df77887dae70f31db42f8d0034abc31d908c91e951c97678151ce435.

    This piece is the named consumer under round 8's producer exemption, pre-committed by round 17, item 4 and round 22, item 2.
  - ADR-023 is Proposed (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:fef6a76bfcfe66caee1dedc8c67b7ee5d2f3df134d3f3623b2082cc64398dfd5). Its text was accepted as drafted (RULED 2026-09-14, question set D, item D2), and entry 79's items (1) to (3) apply.
  - ADR-017 §5a; ADR-022 and its Amendment 1; ADR-036, Accepted 2026-10-22 (acceptance commit 7cf76f9f).
  - The O-07 walkthrough: step 6 at `state/directives/O-07-WALKTHROUGH-2026-10-05.md:48-51` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:6ffad4472417d1b4a728407dc4be35cab1027073e89573235ef02f9d27c27449, step 7 at `state/directives/O-07-WALKTHROUGH-2026-10-05.md:53-55` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:328d1b75c67e943034e62c92ead476f1e0eb46a3cd7b6dc73f9b22b4809ce21a, and the wording section at `state/directives/O-07-WALKTHROUGH-2026-10-05.md:240-247` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:672bda551563947c427bda7d3507077f6ac409d6a37225f5397158e3ff32b238.
- **Drafted by** the architect at main 2cd77a29, and finalised read-only at main 4b26d279. **None of these words is the human's,** except the plan's labels, which are copied byte for byte by script.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form and gating:** full form, with full gating from dispatch (§21a, `AUTONOMY.md:315-332` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3; §25 (e), `AUTONOMY.md:482` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669). The reasons:
  - the shell starts sending a non-null wire field;
  - it adds user-visible behaviour;
  - it touches properties under test (ADR-010 rule 2, and the residency ceilings);
  - it exceeds §21c;
  - under OPEN-4 (A′) it depends on a wire change.
- **Reuse index** (the standing step). These are the custodian's runs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, byte for byte as briefed:

```text
$ node tools/reuse.mjs attribute table feature inspector
No prior art recorded for "attribute table feature inspector". Research it before planning an implementation.
$ node tools/reuse.mjs categorical colour legend
No prior art recorded for "categorical colour legend". Research it before planning an implementation.
```

  Both queries miss. The misses are noted and block nothing. The draft's four earlier runs, and what it took from them, stand as recorded there (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md`, its §0.2): concepts only, with no port and no dependency.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run, and nothing is measured. The 5 GB fixture is not used. I read:
- the draft whole;
- both rulings files;
- the PLAN nodes `b1-shell-half`, `record-step-style-match-widening`, `b2-piece-1c-save-and-reopen`, `bundle-redaction-scan-not-in-product-publish`, `stale-assertion-messages-and-product-comments`, `walkthrough-row-f7-cli-refusal` and `verify-quotes-round-item-cites`;
- ADR-036 as accepted, and ADR-023;
- 1c's §2.10 to §2.14;
- #241's form, Amendment 3 item 10 and its rule (00);
- the docs lane's form whole;
- every §0.3 interface at main.

**0.2 The interfaces this piece consumes, read before any seam is drafted (the seam rule).** All are @ 4b26d279.

The wire:
- `viewport_query`'s request is `{skp, dataset, bbox, bbox_crs, limit, filter, columns}`, and the batch is `[id, geometry, ...columns]` (`protocol/skp/SKP-V0.md:1149-1171` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:57e1e7603e71559af966300e181774cb3c82a0917dcf8f687ee58b511b4a24b0).
- `Some([])` is refused, and the ceiling of 32 is checked first (`protocol/skp/SKP-V0.md:1179-1181` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a33e93147d4db680f4d0655418fb05097d40f5cd5d1c38f6f456f199cc8cc98b).
- There are eight refusal codes (`protocol/skp/SKP-V0.md:1196-1211` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ebc8805c6615112ee7323314fcf814a4ec662d19c37339a4879617b12962c5f2).
- `describe.schema[].projectable` is the kernel's (`protocol/skp/SKP-V0.md:83` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:b926385c1e43c27c3d06c2f97581817f46166793a0a3b5d7362a018dba112628).
- The committed request fixture with `columns` exists (`protocol/skp/tests/data/v0-viewport_query-request-with-columns.json`).
- The shell's only builder sends `columns: null` (`frontends/shell/src/skp/client.ts:108-126` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f8a94fc3de1661be4074dd51449019ec4ca41deff3b8205a9ab4ec3b7df7ab50).

The product callers of `viewportQuery`:
- `frontends/shell/src/streaming/tileViewportStreamManager.ts:941` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:246404bcef51ca499605f2bb895ce53a9496025cf51c574eb9b6a5927e9e4a96;
- `frontends/shell/src/streaming/viewportStreamManager.ts:192` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:959f17687ff5a260107c303f239f047c29235f8b869fc4d1774735b8235a0dfc;
- `frontends/shell/src/residency/candidateArmSession.ts:1274` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a64b9f3fa2152164450dd72b192dcc2a40e7e176bd82184f1b031f85c990d826, the first look, with `limit`.
- The candidate arm starts at `frontends/shell/src/App.tsx:1561` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:c77be16dd32042de9f436ced9bd47fac86df582e29af2e63334a0adb0c5a91b4, and the baseline at `frontends/shell/src/App.tsx:1674` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:1031b6daac969a0c34923d9dcdec4338b4be87cd4d90a0caad4cdac607a17f82.

Streams:
- `MAX_IN_FLIGHT_TILE_STREAMS = 3` (`frontends/shell/src/canvas/tileGridConstants.ts:40` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a8efcbcde73e438dc7828fbb382478af637ba27523beb317e4e6d5b11f3b5180).
- `MAX_STREAM_CONNECTIONS = 4` (`engine/src/pool.rs:99` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:346881842ec719008fb6be55f2b42b08dbdff7f8c81d329560639fe53b5dd9cd) and `MAX_ADMISSION_CONNECTIONS = 4` (`engine/src/pool.rs:132` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:c52c432c132cb973fdbb7c15c2a9db03a87d9b2ebb2c5d4d0bb464238e560293).
- A fifth pending ticket fails at the lease (`kernel/src/skp.rs:83-94` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:922a3dccc592ed69ea598f8491fd590e0777f5a3261fb3514e1c09cc0b107322).
- The cancel-path lease race is stated at `engine/README.md:325-336` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f0cd7d4356f80eca2d9725c8d4d53fe4248061f9e6f8127f7a4fae5b3c1fba20.
- The tile manager's single-retry comment calls the class composition-unreachable (`frontends/shell/src/streaming/tileViewportStreamManager.ts:307-316` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:afa4bd11bcda1f519bd45a126af7babdfc9baba92a06b33c73636b2e13c211d6).

Decode and pick:
- `ResidentBatch` is at `frontends/shell/src/canvas/decodeBatch.ts:96-114` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3a19ebcb554e08b18826e655697853cc4e1e4b27cab1ea5caf222fbbf246f96b, and `decodeBatch`'s signature at `frontends/shell/src/canvas/decodeBatch.ts:123-129` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:808a67711654e989d6cd0523152141d065422c7d378cc92c24bca2e5e66a7651.
- `resolvePick` is at `frontends/shell/src/canvas/pick.ts:134` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:d9b7f5515d27b8d0d7108708490f1e42ca9c571d0007e90dd69f965cfc729cef.
- `resolveClickPick` is at `frontends/shell/src/canvas/clickPick.ts:40-48` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:1a75d23f85ba31a4d15839bdc2bb1cb966ae5fdec35752c04ad26c54eef84cf5.

The workspace:
- `InspectedPick` and `InspectedFeature` are at `frontends/shell/src/workspace/workspaceState.ts:49-59` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0b02dcde6f92a226103d7f000d56725f1cfa83bb1c11ce304ba87d085460489d, and `ViewState` at `frontends/shell/src/workspace/workspaceState.ts:68-86` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:62574d11dfbcb107a6a78caafebd573879358ff20f7deaabab0c3dcec5f27965.
- The workspace's import rule (UA6: no `canvas/`, `streaming/`, `residency/` or `skp/client`) is at `frontends/shell/src/workspace/workspaceBoundary.test.ts:10-13` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f4c5efd3b62570d270d9a70ad7582a6892882cd5ed3f29fd659667c0cfc628ef. `attributes/` is not forbidden there.
- `SelectionMembers` is at `frontends/shell/src/workspace/selection.ts:28` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:14858a0fa6b91f8162a06be1b09a932a39bfb1c8510bd59a51e5a0f5ea561687, and `SELECTION_MAX_FEATURES = 10_000` at `frontends/shell/src/workspace/selectionConstants.ts:15` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0616e02ab0eb155291f33cc40ccd9b0037fba54e7e7e1db2fd6016c361c7af21.
- `StyleSetTransition` is at `frontends/shell/src/workspace/viewTransitions.ts:34-38` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:7f8721714f06a12192ae682792154ea7b8f53a3b768cb92c4d21bcfca66a0615, and `styleTransitions` at `frontends/shell/src/workspace/viewTransitions.ts:157` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:64e4293bb5b3c6de614d99d06044196fd6abd634f06b1d604a3b791e129e1cef.

The style:
- `StyleState` has four members (`frontends/shell/src/style/document.ts:56-61` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:6d08b5648c954bd6564a9e4ae8531a259b95da59a658a49da5b1a2cd034675b0).
- `StyleDocumentV0` has no `match` (`frontends/shell/src/style/document.ts:109-118` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f4017650ff734303b5cb2ceb04195557bb50eb179be1ab5844f04cd1ac922e19).
- The Literal-only bullet is at `frontends/shell/src/style/document.ts:18-22` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:d8b7d7e56fb24a3965cedc29ccdfc655e3ce7a499187ab206e5e96e91da387f1.
- The resolver exposes `legend` (`renderer/style-ts/src/style.ts:83` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:55a6469c70371bb06a2e98f7d8735ebf61a9c983569dad17c4e2092272167914), `groups` (`renderer/style-ts/src/style.ts:91` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:479f6a9b0a35e6fc2fd24986604826d7cd29074335717d956ef4c270d8d90ce1), `resolve` (`renderer/style-ts/src/style.ts:169` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:99121855115be2d7ab3849892a88d012b1e8dd19ae62714026adabdbac653d1a) and `groupFor` (`renderer/style-ts/src/style.ts:174` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0540d5eaf3e9159351d9e621ec973cfc68849b5e21a2fda0dfe8314ebe085865).
- The match-key type rule is Rust-only (`renderer/src/compiled.rs:225-239` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:eefa7767c167f085310750365080dea5c86e9c1c1c49ed0e8cc2fe9419f688ba).
- The canvas draws one colour (`frontends/shell/src/canvas/buildLayers.ts:447` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0a58685b0d83fd756ea6585db8d0197e06e033323fae97b86e8043dbbc276639, `frontends/shell/src/canvas/buildLayers.ts:470` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4a19c0098a5ad5403e537096f9e2b4c05d34c41bfa86c3e630271cc6e219bc35).
- style-ts has no test runner of its own (`renderer/style-ts/package.json:8-10` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0e814b5afd1cfaa75e8c373aca7fc4f188012517d8ac1228df43a834226e1a65).

Recording:
- `record_step` admits literals only (`protocol/skp/SKP-V0.md:1245-1256` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a2bdf3ae7661d12b76334427a6b057015456bfb0c8f879b173ec93313e06f935). ADR-036 admits the match (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:175` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:323cc8b75aed898d6e96f4684421e94b4d506d77ba6f0e4069e4231d62293271, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:177` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a73580f5dbc536d095028cae3529608708b2cc709ab11b7cf7c05c94dbe58f50).
- The shell's step value type is at `frontends/shell/src/skp/types.ts:290` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ef1b080e537303034533fc4928c026225380ae0ba5161a2f521faf7a878f0450.
- The e2e history reader is at `frontends/shell/e2e/recording.mjs:224-271` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3e1ce6086a3c35e4561332c61ffbc2b0e691e913859d72dde2757681c9c85581.

Export:
- `publishPrepare` sends the style document (`frontends/shell/src/publish/client.ts:31-44` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:ed08a8f9d56d3cf7ff55a799688c6ca809178ddbd87b7b663325aa8cfedabad6).
- The host derives the match column (`frontends/shell/src-tauri/src/publish.rs:1225-1246` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:6b3ed47b0b5a5452ddde99a178b4cc25f720849bbf661bfa53d544754f88f2ea).
- App holds an export consumer from a run's report until it ends (`frontends/shell/src/App.tsx:1151-1168` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:6d448eaad067e8b0b8c6b3f0c3b9b3caa508516a197e1ae2e6cf38c89c09cfda).
- PublishPanel reports a prepare run at `frontends/shell/src/publish/PublishPanel.tsx:403-406` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a2000bd694ae8ce2eba00df9081332ee76594f46ffea2a554b7e89b303c28c9b, and an execute run at `frontends/shell/src/publish/PublishPanel.tsx:516-520` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:b1fc483beabb407d5af7b26cb4c0fe7251f02cbad7a7c903482b3aea4d22bd04, after `publishExecute` is called.

Layout:
- `ACTIVITY_TABS` is Console and Notices (`frontends/shell/src/layout/contributions.ts:40-43` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a5e0aad5775a01bf84c8d46288fecb44f089df33f98329a4ec490165a40fe6f9), and the eleven sighted headings are at `frontends/shell/src/layout/contributions.ts:11-13` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:78c5c0d25257123f66f76d1e532ab2a72e5479db0542941cd1bb9368eb09c5ce.
- The Feature tab is a pure view (`frontends/shell/src/feature/FeatureTab.tsx:13-26` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:1e5082ce70684b02bdc8e865f7ba023c8e6237c90c5c26946df080e0b78ea84c).

The fixture: `AttributeMode::MultiType` is at `engine/src/fixture.rs:173-197` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3b0e1f53b3573dacdc4c5852c82f069fc27c602f81f03df2e71bde6130aa4925, and `write_geoparquet` at `engine/src/fixture.rs:860` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f22e41488f84cf23c6a005a9f6ad11460e3ed3a6609ab55a6ae247aa979cb7d6.

Records:
- The last walkthrough Part is AB (`frontends/shell/MANUAL-WALKTHROUGH.md:1927` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4917a05ad91af5f3bcba369d513f01f305aa06eb7d1042ae5a0931cb2ee1a3d5).
- KNOWN-LIMITATIONS item 4 describes the v0.1.0 artifact (`KNOWN-LIMITATIONS.md:72-77` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:948295e004c1860b1d6001cfbf748f92417b54af2e6d4644dbb9185312780ee1), and item 3's "On main" note at `KNOWN-LIMITATIONS.md:70` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:db65b22f2d1b9feab39c447cfaca4fdceff706f4a04f1dd318959f1827afca2a is the pattern for a note under a release item.

**0.3 Pins are historical.** At each PR's base, a read-only re-sweep runs before any code:
- it re-reads every §0.2 interface;
- it runs every e2e suite at the base;
- it names the walkthrough letter (AC if AB is still the last) and the KNOWN-LIMITATIONS numbers, distinct from any piece in flight.

A moved cite is class 3, with the tree authoritative. A changed interface is I4. The re-sweep is recorded as an amendment before that PR's code.

**0.4 Hypotheses**, each with its discriminator:

| ID | Hypothesis | Discriminator |
|---|---|---|
| H1 | `apache-arrow` reads the batch with the projected fields after geometry, in declared order, with `attribute_columns` readable. `Int64` and `UInt64` read as `bigint`, and `Float32` as its exact `number`. | PA-E1 |
| H2 | Projecting every projectable column (≤ 32) leaves every existing e2e suite green, with no projection or ceiling refusal. | the suites at PR A's head; a failure is I3 or I6 |
| H3 | A per-datum colour accessor whose `updateTriggers` key on a style revision is not re-evaluated on pan, zoom or render. | PB-U5 |
| H4 | With the table holding one stream, the tile manager's single retry absorbs `connections_exhausted` in ordinary use. | PC-U6; the residual is KL-5 |
| H5 | A `viewport_query` with `bbox: null`, a filter, a `limit` and `columns` ends Completed with at most `limit` rows. | PC-E1 |
| H6 | The copied attribute data references no part of the IPC message's buffer. | PA-U3 |
| H7 | For the fixture's value range, the shell's `Float32` and `Float64` display equals the oracle's shortest round-trip text. | PA-E1 |

**0.5 Not decided here:**
- any SKP command, field or literal;
- any ADR text;
- anything under `kernel/src`, `engine/src` or `protocol/`.

The `record_step` widening is the node `record-step-style-match-widening`, which the human places.

## §1. May and may not claim

**May claim, each only as §4 tests it:**
- the Feature tab shows every projected column of the inspected feature, read from the same decode pass as its id;
- colour by category over a projected text column, resolved by the imported resolver, with its legend;
- the table with the three scopes;
- the declared ceilings, each with its behaviour.

**May not claim:**
- any performance figure, `docs/08` row or duration (OPEN-2 (b));
- that B1 is done, or that the workflow is complete;
- that anything is undoable. The category style is ADR-006 class 2, recorded under OPEN-4 (A′);
- that the table shows every feature passing the filter, beyond what its count line states;
- that a selected feature passes the filter where §2.4 (c) has not established it;
- macOS or Linux above L1;
- that an export's execute is preceded by the table's cancel (§2.4 (e)).

**Other commitments:**
- No change to `protocol/`, `kernel/src`, `engine/`, `src-tauri`, the bundle viewer or MCP.
- **ADRs cited, none amended:** 004, 006, 010 (rules 1, 2, 5 and 6), 016 §7, 017 §5a, 021, 022, 023 (Proposed) and 036 (Accepted).
- **Operator text:** kernel and engine messages are shown as RefusalBlock shows them today. The shell's lines state only the shell's consequences.
- **Strings:** every new string is a P6 placeholder, sighted at the sitting (OPEN-14). B1's eight projection refusal messages are sighted in this piece's Part (`engine/B1-PROJECTION-PREREGISTRATION.md:80` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:5e988b41df77887dae70f31db42f8d0034abc31d908c91e951c97678151ce435).

## §2. The change

**Three PRs, in the ruled order (OPEN-11): A, then C, then B.**

### 2.1 Unchanged

Nothing in this list is edited:
- `applyFilter`, FilterPanel, `predicateInput.ts`, the filter cards and `combineClauses`;
- the export's scope rule;
- PublishDialog, PublishPanel and `src-tauri/src/publish.rs`;
- the map's key, and the remount on a new handle;
- the layout reducer;
- the hover readout (OPEN-3 (a), confirmed);
- every existing ceiling;
- the frame-tag check in `decodeBatch`;
- `e2e-test-surface.ts`, because the e2e suites read the rendered DOM. A hook needed there is I1.

### 2.2 PR A: attributes of the inspected feature (OPEN-1 (a), OPEN-12 (a), OPEN-13 (a))

**(a) The projection set**, in new `src/attributes/projection.ts`:
- `projectionFor(describe)` lists the schema rows with `projectable: true`, in schema order, up to `ATTRIBUTE_PROJECTION_MAX` (32).
- It returns `null` when there are none, never `[]`.
- It is fixed per open, and reads only `projectable` (entry 79, item (3)).

**(b) The wire:**
- `viewportQuery` gains a required `columns: string[] | null`, always sent.
- Its product callers are the three managers, each taking the open's set from a constructor option, and, in PR C, the table source.
- This closes round 8's exemption for B1's non-null path. The PR body names it.

**(c) Decode**, in the same pass as `ids`, `parts` and `partToRow` (ADR-010 rule 2):
- `decodeBatch` takes the expected projection, and refuses by a typed shell error a batch whose `attribute_columns` is not exactly that list, in order.
- `ResidentBatch` gains `attributes: {names, data, bytes} | null`. `data` is one named copy out of the IPC message (ADR-004, H6).
- `src/attributes/values.ts`'s `readRow(batch, row)` returns typed values:
  - text;
  - integer as `bigint`, every width, with 64-bit never narrowed;
  - `float32`, `float64` and boolean;
  - null.
- The display rules:
  - an integer shows its exact decimal;
  - a `float64` shows the shortest round-trip text;
  - a `float32` shows the shortest text that round-trips through `Math.fround`;
  - a NULL shows an explicit marker.
- `AttributeRow` lives in `src/attributes/`, so UA6 holds.

**(d) The resident attribute ceiling** (OPEN-12 (a)):
- `RESIDENT_ATTRIBUTE_MAX_BYTES` lives in `canvas/limits.ts`, summed over the copied attribute bytes in both arms.
- A batch that would pass it keeps its geometry and is marked `attributes: not-held`. After PR B, its match column is kept.
- The Feature tab names that state, and a status item shows it (P6).

**(e) Inspect:**
- `resolveClickPick` reads the row at `partToRow[gpuOrdinal]` from the candidate batch, in the same handler as the bounds.
- `inspect.set`'s params and `InspectedFeature` gain `row: AttributeRow | "not-held" | null`. It is kept for the generation (ADR-010 rule 5).
- `endViewGeneration` clears it.

**(f) The Feature tab.** A new section, Attributes (P6), shows every projected column in declared order, each with its value or the null marker (entry 79, item (2)). A line names the columns that are not projected, and the number left out over the ceiling. The not-held state is named. The hover is unchanged.

**(g) Comments made false by (b), corrected in this PR** (comment only, each re-checked clause by clause at H):
- `frontends/shell/src/skp/client.ts:122-123` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:d2fbf847e1ae29847d76a0da301dd89ffc62612d48ad06975436c3cbd409662d;
- `frontends/shell/src/skp/types.ts:260-263` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:6285c16156aef69648d92e82aa34fca00741c48b9008b56b5ffcae7f3422555e. The new sentence: `viewportQuery`'s callers pass the open's projection set (`projectionFor`), which is `null` when no column is projectable.
- `frontends/shell/src/style/document.ts:18-22` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:d8b7d7e56fb24a3965cedc29ccdfc655e3ce7a499187ab206e5e96e91da387f1: the clause from "`viewport_query` can carry" to "`columns: null`) --" is removed. The rest of the bullet stays true until PR B.
- `renderer/tests/style_shell_agreement.rs:37-39` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:f6adc4cd6edb92f59d4f73c60b0673f0d4935147c95dd9d0d418a16b40efd42b: the clause "; `viewport_query` has carried … and the shell requests none" is removed. The type sentence alone carries the conclusion.
- `frontends/shell/src/canvas/buildLayers.ts`'s top comment, as the docs-lane piece leaves it: the same clause is removed. **This edit waits for that piece's merge** (§2.6).
- `frontends/shell/src/workspace/viewTransitions.ts:6` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:e573caa687c6fc7b4e5f9d87115405ab318e12df1eb63d607f9e91bdfebc2f04: "(Proposed, so it binds nothing)" becomes "(Accepted 2026-10-22)".

### 2.3 PR B: colour by category and its legend (OPEN-4 (A′), OPEN-5 (c), OPEN-6 (a), OPEN-10 (a))

**(a) The model.** `StyleState` gains `fillMatch: {column, cases: {when, then}[], onNull, onUnmatched} | null`, defaulting to `null`. The document's `fill_color` is `fillMatch` when it is set. There is one `match` at most, on `fill_color` only.

**(b) The document:**
- `toStyleDocument` emits §5a's `match`.
- It is closed at construction: 1 to 64 cases, distinct `when` values, `on_null` and `on_unmatched` always present, and colours normalised.
- `StyleDocumentV0` widens on `fill_color` only.
- The Literal-only bullet is rewritten to the new fact.
- `StylePanel.tsx:55`'s "ADR-036, Proposed" becomes "ADR-036, Accepted 2026-10-22".

**(c) Resolution** goes through the imported resolver only (`canvas/matchGroups.ts`):
- per batch and style revision, a per-row group from `Style.groupFor`, with colours from `Style.groups`;
- a per-datum colour in `buildLayers` via `partToRow`, with `updateTriggers` on the style revision;
- with `fillMatch` null, today's props exactly.

**(d) Building the cases** (`style/categoryCases.ts`; OPEN-6 (a), per-case edits a later node; **its source binds as OPEN-16 rules**):
- the column's distinct non-null text values, in code-point order;
- at most `CATEGORY_MAX_CASES`, coloured by `CATEGORY_PALETTE` in order;
- `onNull` is `CATEGORY_NULL_COLOR` and `onUnmatched` is `CATEGORY_OTHER_COLOR`;
- the owner's line states how many values were found, and how many draw as Other.

**(e) Choosable columns** (OPEN-5 (c)):
- the projected columns that `renderer/style-ts` exports as admissible match keys, pinned to Rust by new rows in `renderer/tests/data/style-agreement.json`;
- no type rule is written in the shell.

**(f) The Style tab:**
- Colour by, with its apply, and One colour;
- the legend renders `Style.legend` in its order (the cases, No value, Other), each swatch the resolver's `fillColor`.

**(g) Transitions.** `style.set` on `fillColor` with `{match: …}` joins the union. A literal value clears `fillMatch`. The transition is pure.

**(h) Recording** (OPEN-4 (A′)):
- the step recorder sends the match as `record_step`;
- this PR's merge waits for `record-step-style-match-widening` on main;
- the shell's step value type gains the match member with that node's literal bump, or in this PR if that node did not add it.

**(i) Export:**
- no path change, because publish.rs derives the match column;
- the seam is proven by PB-E2.

**(j) Command bar** (OPEN-10 (a)): reveal entries only.

**(k) Records:**
- KNOWN-LIMITATIONS item 4 gains an "On main" paragraph, as item 3 has;
- KL-3 is added.

### 2.4 PR C: the table, in Activity (OPEN-7 (A), OPEN-8 (a), OPEN-9 (A))

**(a) The frame:**
- `ACTIVITY_TABS` gains the Table tab (P6 label), in slot `activity.table`.
- The scope options are plan §3's three labels, byte for byte (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:50-52` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:db46a46238843c7cfd13d3b7ffe63093440b0c5d02592a6a6243b514ff2493ea), and the default is the first.
- The header uses the human's word for rows (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:66526ec52cfd20d2649c0c8b62371ecc591ac6502cc13b551cde18db121804d2).
- The columns are `id` plus the open's projection set.

**(b) The first scope** (`table/tableSource.ts`):
- one stream: `viewportQuery(dataset, null, null, TABLE_MAX_ROWS, view.filter, projection)`, then `dataPlaneAttach` and `startStream`;
- it decodes id and attributes, checks the frame, and ignores the geometry;
- it issues only while the Table tab is shown and Activity is open, and never on pan;
- it supersedes and cancels on a scope or filter change;
- it cancels on hide, collapse, open or replace, and generation end;
- liveness is a line with Cancel;
- the terminals:
  - Completed gives the count line;
  - a refusal gives the shell's lead line plus the kernel's code and message;
  - `engine.source_changed` gives the owner line, then the rows are cleared.
- The count line:
  - below the limit, all N;
  - at the limit, the first N returned, in no declared order, and more may pass (P6).
- No sort, no row actions, no paging.

**(c) The other two scopes** (OPEN-8 (a)):
- `selection.apply`'s members gain the clicked row, captured as in §2.2 (e) and cut at `CAPTURED_ROW_MAX_BYTES` with a marker, and `filter`, the filter of its batch's stream.
- `ResidentBatch` gains `filter`, set through `onBatch`.
- The third scope lists every member.
- The second scope lists a member that passes the view's filter if one of these holds:
  - it was captured under that filter;
  - its id is in a resident batch streamed under it;
  - its id is in the first scope's result for it.
- A member fails if that result is complete and lacks it.
- Every other member is counted as not established (P6).

**(d) The grid** (`table/TableGrid.tsx`):
- APG grid roles: `role="grid"`, `aria-rowcount`, `aria-rowindex` and `columnheader`;
- one tab stop, with Arrows, Home, End, PageUp and PageDown moving the active cell;
- windowed rows, with no dependency.

**(e) The stream budget** (OPEN-9 (A)):
- The table issues nothing while an export consumer is held, and shows a P6 line.
- When App's export-run handler acquires a consumer (`frontends/shell/src/App.tsx:1151-1168` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:6d448eaad067e8b0b8c6b3f0c3b9b3caa508516a197e1ae2e6cf38c89c09cfda), it cancels a running table stream.
- PublishPanel reports an execute run after `publishExecute` is called (`frontends/shell/src/publish/PublishPanel.tsx:516-520` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:b1fc483beabb407d5af7b26cb4c0fe7251f02cbad7a7c903482b3aea4d22bd04). So the cancel is issued alongside the execute's request, not before it. The execute's lease can meet the table's connection not yet returned. That is KL-5: a typed `engine.connections_exhausted`, never a wrong result. PublishPanel is not edited.
- The tile manager's comment (`frontends/shell/src/streaming/tileViewportStreamManager.ts:307-315` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:dd805cece0c9a8b899187c583f95ea76da4743baa2ea9489c862dd0404505bea) is restated: the table adds one admission and one stream, and three tiles plus the table plus an export can reach the class.

### 2.5 Rows

- **Class A:** the table's `viewport_query`, through `skp/client.ts`'s recorder.
- **Class C,** at the action and before its outcome, each with a P6 statement of its API equivalent: `table.scopeSet`, `table.cancel`, `style.colourBy`, `style.oneColour`, and OPEN-10's entries.

### 2.6 Files, per PR

All paths are from the repository root. Lines count by §7's command. **Records** are outside the count: `frontends/shell/e2e/README.md` (one entry per PR), `frontends/shell/MANUAL-WALKTHROUGH.md` (the one new Part, with each PR's rows), `KNOWN-LIMITATIONS.md` (separate items), this form, and PLAN.yaml.

**PR A, 37 files.**
- Product:
  - `frontends/shell/src/skp/client.ts`;
  - `frontends/shell/src/skp/types.ts`, comment only;
  - `frontends/shell/src/streaming/tileViewportStreamManager.ts`, `frontends/shell/src/streaming/viewportStreamManager.ts` and `frontends/shell/src/residency/candidateArmSession.ts`;
  - `frontends/shell/src/canvas/decodeBatch.ts`, `clickPick.ts`, `WorkingCanvas.tsx` and `limits.ts`;
  - `frontends/shell/src/canvas/buildLayers.ts`, comment only, after the docs-lane piece merges;
  - `frontends/shell/src/attributes/projection.ts` and `values.ts`, both new;
  - `frontends/shell/src/workspace/workspaceState.ts` and `viewTransitions.ts`;
  - `frontends/shell/src/style/document.ts`, comment only;
  - `frontends/shell/src/feature/FeatureTab.tsx` and `FeaturePanel.tsx`;
  - `frontends/shell/src/App.tsx`, `frontends/shell/src/console/surfaceRegistry.ts` and `frontends/shell/src/styles.css`;
  - `frontends/shell/package.json`, one script line;
  - `renderer/tests/style_shell_agreement.rs`, comment only.
- Tests:
  - `frontends/shell/src/attributes/projection.test.ts` and `values.test.ts`, both new;
  - `frontends/shell/src/canvas/decodeBatch.test.ts`, `clickPick.test.ts` and `limits.test.ts`;
  - `frontends/shell/src/skp/client.test.ts`;
  - `frontends/shell/src/streaming/tileViewportStreamManager.test.ts` and `viewportStreamManager.test.ts`;
  - `frontends/shell/src/residency/candidateArmSession.test.ts`;
  - `frontends/shell/src/feature/FeatureTab.test.tsx`;
  - `frontends/shell/src/workspace/viewTransitions.test.ts` and `workspaceState.test.ts`;
  - `frontends/shell/src/App.attributes.test.tsx`, new.
- E2E: `frontends/shell/e2e/attributes.mjs` (new), and `kernel/tests/manual_walkthrough_fixtures.rs` (one `#[ignore]` generator, test code).
- Records: KL-4 and KL-7.

**PR C, 31 files.**
- Product:
  - `frontends/shell/src/table/TableTab.tsx`, `tableSource.ts`, `tableScope.ts`, `TableGrid.tsx` and `tableConstants.ts`, all new;
  - `frontends/shell/src/workspace/selection.ts` and `viewTransitions.ts`;
  - `frontends/shell/src/canvas/clickPick.ts` and `decodeBatch.ts`;
  - the three managers named in PR A;
  - `frontends/shell/src/layout/contributions.ts`, `StudioLayout.tsx` and `actionRegistry.ts`;
  - `frontends/shell/src/App.tsx`, `console/surfaceRegistry.ts` and `styles.css`;
  - `frontends/shell/package.json`.
- Tests:
  - `frontends/shell/src/table/tableSource.test.ts`, `tableScope.test.ts`, `TableGrid.test.tsx` and `TableTab.test.tsx`, all new;
  - `frontends/shell/src/workspace/selection.test.ts`;
  - `frontends/shell/src/canvas/decodeBatch.test.ts`;
  - the three managers' tests;
  - `frontends/shell/src/App.table.test.tsx`, new.
- E2E: `frontends/shell/e2e/table.mjs`, new.
- Records: KL-1, KL-2 and KL-5.

**PR B, 33 files, plus up to two conditional ones.**
- Product:
  - `frontends/shell/src/style/document.ts` and `StylePanel.tsx`;
  - `frontends/shell/src/style/Legend.tsx`, `categoryCases.ts` and `styleConstants.ts`, all new;
  - `frontends/shell/src/canvas/buildLayers.ts`, `matchGroups.ts` (new) and `WorkingCanvas.tsx`;
  - `frontends/shell/src/workspace/viewTransitions.ts`, `workspaceState.ts` and `stepRecorder.ts`;
  - `frontends/shell/src/App.tsx`, `layout/actionRegistry.ts`, `console/surfaceRegistry.ts` and `styles.css`;
  - `frontends/shell/package.json`;
  - `renderer/style-ts/src/style.ts`;
  - `renderer/tests/data/style-agreement.json`;
  - `renderer/tests/style_agreement.rs`.
- Conditional:
  - `frontends/shell/src/skp/types.ts`, only under §2.3 (h)'s second case;
  - `frontends/shell/src/table/tableSource.ts`, only under OPEN-16 (b).
- Tests:
  - `frontends/shell/src/style/document.test.ts`;
  - `frontends/shell/src/style/categoryCases.test.ts`, `StylePanel.test.tsx`, `Legend.test.tsx` and `matchKeyRule.test.ts`, all new;
  - `frontends/shell/src/canvas/matchGroups.test.ts`, new;
  - `frontends/shell/src/canvas/buildLayers.test.ts`;
  - `frontends/shell/src/workspace/viewTransitions.test.ts` and `stepRecorder.test.ts`;
  - `frontends/shell/src/App.colour.test.tsx`, new.
- E2E: `frontends/shell/e2e/colour.mjs`, new.
- Records: KL-3; item 4's note; Part F rows only where a location word changes, and only after the F7 piece merges.

**Not edited by any PR:**
- `protocol/**`, `kernel/src/**`, `engine/**` and `src-tauri/**`;
- `residency/`, beyond the first look's argument;
- FilterPanel, `filterClauses.ts`, PublishPanel, the bundle viewer and `e2e-test-surface.ts`;
- §2.1's list.

A need outside this list is I1. A file added to a PR's list is class 9, by amendment before its code.

### 2.7 Suites and records

- **One new suite per PR,** each with one script line and one `e2e/README.md` entry (separate entries are separate paths: `state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:551c2c8c99555a9cf256d5cc1279d1c659a809b72cf150094b8574206ec63c92).
- **One walkthrough Part,** at the letter the re-sweep names, with a blank log.
- **KNOWN-LIMITATIONS** (P6 drafts), at numbers distinct from #241's and 1c's in flight:
  - KL-1: the first scope shows at most `TABLE_MAX_ROWS` features, in no declared order, with no sort.
  - KL-2: the second scope counts members whose filter result is not established.
  - KL-3: the human's line under OPEN-7, worded as OPEN-16 rules.
  - KL-4: attributes are not held past `RESIDENT_ATTRIBUTE_MAX_BYTES`.
  - KL-5: three tile streams, the table and an export can meet a typed `engine.connections_exhausted`, including an execute issued while the table's cancel is in flight. It is never a wrong result.
  - KL-7: the hover readout shows no attributes (OPEN-3 (a)).
  - KL-6 is withdrawn, because OPEN-4 is (A′).

### 2.8 Portability (R3)

- No owning boundary is new: no path, no key chord beyond OPEN-10's registry entries, and no adapter.
- Windows is supported. macOS and Linux are L1, by unit tests. L2 goes to `shell-real-app-run-macos-linux`.
- The expected reduction is none.

### 2.9 Overlap (rule (00), `AUTONOMY.md:609` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0), per PR, by file

The pieces in progress or awaiting merge at 4b26d279:

**#241, `bundle-redaction-scan-not-in-product-publish`.** Its 24 files are listed at `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-749` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:eab80a9ed879fb6405b825aecd66fd83855d407312c7355cde2cd1cdf894c391 (Amendment 3 item 10) and in `state/consults/2026-10-22-bundle-redaction-scan-not-in-product-publish-worker-report-2.md:56-83` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:7f2a2208c502387fbba9aa4e0799823bc3178ab61b93ae5d7f363f6f4489ab2c:
- `kernel/src/bundle/redaction.rs`;
- `kernel/src/publish/{mod,viewer_assets,error}.rs`;
- `kernel/src/permission/boundary.rs` and `kernel/src/permission/audit/reader.rs`;
- `kernel/src/bin/publish-bundle.rs`;
- `kernel/tests/typed_terminal_codes.rs` and `kernel/tests/permission_boundary.rs`;
- `engine/src/fixture.rs`;
- `frontends/shell/src-tauri/src/publish.rs` and `frontends/shell/src-tauri/tauri.conf.json`;
- `renderer/bundle-viewer/{build.mjs,package.json,redaction-reviewed.json,src/manifest.ts}`;
- `renderer/bundle-viewer/scripts/{scan-dist.rs,scan-dist.mjs,scan-dist.test.mjs}`;
- `.github/workflows/product-ci-viewer.yml` and `.gitignore`;
- `KNOWN-LIMITATIONS.md`, `kernel/README.md` and `engine/README.md`.

How each PR meets it:
- **PR A: disjoint.**
  - No file in common.
  - KNOWN-LIMITATIONS is separate items.
  - `engine/src/fixture.rs` is called, never edited. If #241 merges first and changes `MultiType` or `write_geoparquet`, that is I4.
  - `frontends/shell/package.json` is not `renderer/bundle-viewer/package.json`.
  - Neither touches `protocol/`, a wire fixture or a lockfile.
- **PR C: disjoint.**
- **PR B: disjoint by file.** One effect: its `renderer/style-ts` edit is bundled into the viewer's `app.js`, which #241's build scan covers. So PR B's suites add the viewer build's scan.

**The docs lane, `stale-assertion-messages-and-product-comments` (in code).** Its paths are listed at `frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:214-220` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:35ec00a4502d9dc343d8659ccc044b95dc03482a3518222489cb378d0268e75b: `engine/tests/session_identity.rs`, `frontends/shell/e2e/regression.mjs`, `frontends/shell/src/admission/crsAssertionState.ts` and `frontends/shell/src/canvas/buildLayers.ts`.
- **PR A** shares `buildLayers.ts`, for one comment that the docs lane's B1 words make false at PR A (§2.2 (g)). That edit is made after the docs-lane piece merges, by merging main into PR A's branch. It is a Documentation fix and needs no re-gate. The docs lane's item 12 (`frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:328` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:08cbea22f4caabd96792d56af82b3501cbb502c54fbab13095dd76e6d1c6112a) is then never met, because milestone 4 is not on P4 while it is unmerged.
- **PR B** shares `buildLayers.ts`, so it is dispatched after the docs-lane piece merges.
- **PR C** is disjoint.

**Piece 1c (its committed form; code starts in slot 2).** Its groups are at `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-490` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:cc8e3826631607af97c4824eac06a21f4eba79e8200d139acdc960bade23636c, and its §2.14 at `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:531-581` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:cbafb5efa3e5b1f814d1e93593ef8bd5f1e5b871e39c8a80c732debe9e1909de.
- **PR A shares six files with step 1:**
  - `frontends/shell/src/skp/client.ts` and `frontends/shell/src/skp/types.ts` (step 1's shell product);
  - `frontends/shell/src/skp/client.test.ts`, which holds the version literal;
  - `frontends/shell/src/App.tsx` and `frontends/shell/src/console/surfaceRegistry.ts`;
  - `frontends/shell/package.json` (step 1's e2e group).
- **PR C shares** `App.tsx`, `surfaceRegistry.ts` and `package.json`.
- **PR B shares** the same three, and `types.ts` when the conditional applies. It also meets step 1's serialised `StyleState` (I10).
- Workspace files, `style/document.ts`, the renderer and `kernel/tests/manual_walkthrough_fixtures.rs` are not in 1c's groups.
- Walkthrough Parts, KNOWN-LIMITATIONS items and README entries are separate paths. **Two pieces in flight never take the same Part letter.**
- 1c's §2.14 orders milestone 4 first where shell paths meet, and says no 1c step dispatches while a milestone 4 PR is in progress or awaiting merge (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:575-577` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:fab38342bc3bc001dcacfdee8c25ccc2eb85bcdfa6cabc60150a6fe68731a196). See OPEN-17.

**verify-quotes-round-item-cites (in code, S3):** `scripts/plan/**` and `.github/workflows/governance-ci.yml`. **Disjoint for all three PRs.** One contact: once it merges, every round + item cite in this form must resolve.

**The F7 piece:** `frontends/shell/MANUAL-WALKTHROUGH.md` Part F only. PR A and PR C are disjoint, since their Part is a new one. PR B is disjoint unless a Part F row's location word changes; that edit waits for the F7 piece's merge.

**`record-step-style-match-widening` (proposed, unplaced).** Its paths are `protocol/` and `kernel/src/session_history.rs`, plus, through its literal bump, `frontends/shell/src/skp/types.ts` and `frontends/shell/src/skp/client.test.ts`.
- If it is placed while PR A runs, it shares those two files, so the two are serialised.
- PR B's merge depends on it.

**Can PR A start now? Yes, on the human's stated condition.** It is disjoint from #241 by every file. Two conditions follow:
1. **The docs lane.** The `buildLayers.ts` comment edit waits for the docs-lane piece's merge, the human's click, Monday 2026-10-26 at the earliest.
2. **Piece 1c.** PR A cannot run beside a 1c step that edits any of the six shared files. Until PR A merges, 1c's step 1 does not edit them. The SKP version bump, which must change `types.ts` and `client.test.ts` in the same commit as the kernel literal, waits as well. The other way round: if 1c step 1 is dispatched whole first, PR A waits until step 1 merges, which is after #241's merge at the earliest. OPEN-17 chooses.

The PLAN node's `depends_on` still names `bundle-redaction-scan-not-in-product-publish`. The custodian records the human's Slot 1 line there before dispatch.

## §3. Fixtures, with outcomes declared in advance

Each fixture is hash-verified before and after each run.

| Fixture | Used by | Predicted |
|---|---|---|
| `filter-zoned.parquet` | PA-E3, PB-E1 to PB-E4, PC-E1 and PC-E2 | `zone` is projected. Four categories plus No value. The first scope under one zone is complete. |
| `attributes-multitype.parquet` (new; `AttributeMode::MultiType`, 500 polygons; an oracle sidecar of five ids, read by the same generator through DuckDB) | PA-E1 | Six columns are projected and `d32` is named as not projected. `i64` shows exactly, `f32` matches the oracle (H7), and NULLs show the marker. |
| `100k-happy-path.parquet` | PC-E3, and suite regression | The first scope reaches the limit, and the line says more may pass. |
| `slow-filter-scan.parquet` | PC-E4 | The liveness line shows, then Cancel ends it. |

## §4. Tests, and one mutation each

**How a mutation is observed:** apply it, run the named test, record its failure by name with the commit, and revert (round 25, item 2 (c)). No `verify-mutation` run is an observation.

**What may be mocked:** the render tests mock only the transport boundary. Mocking `decodeBatch`, `projectionFor`, the resolver or `tableSource` is I5.

| ID | PR | Asserts | Mutation; expected failure |
|---|---|---|---|
| PA-U1 | A | `projectionFor`: projectable rows only, in schema order, capped at 32, `null` when there are none | return `[]` when there are none; fails |
| PA-U2 | A | `columns` sent as given, and `null` as null, never omitted; the key set equals the committed request fixture with columns | omit the key when null; fails |
| PA-U3 | A | decode: attributes after geometry, in order; a metadata mismatch refused by name; values co-indexed with `ids`; data not on the message buffer | read in reverse order; fails |
| PA-U4 | A | display: 2^63−1 and 2^64−1 exact; null gives the marker; the `float32` and `float64` rules; boolean | `Number(bigint)`; fails on 2^53+1 |
| PA-U5 | A | the click's row comes through `partToRow`; every part of a multipolygon gives one row | index by GPU ordinal; fails |
| PA-U6 | A | the attribute ceiling: geometry kept, the batch not-held, bytes released on clear | omit the new batch from the sum; fails |
| PA-U7 | A | all three managers pass `columns` on every call, the first look included | the first look passes `null`; fails |
| PA-R1 | A | the Feature tab: every column in order; the null marker; the not-projected line; the not-held state | skip null values; fails |
| PA-R2 | A | the pinned feature keeps its values after its batch is superseded | read the live batch at render; fails |
| PA-E1 | A | MultiType: a click at a `capturePixels` pixel, with its id from `hoverIdAfterBarrier`, shows the oracle's values | `projectionFor` drops the last column; fails |
| PA-E3 | A | filter-zoned under one zone: the clicked feature shows that zone | show row 0's values; fails |
| PB-U1 | B | `toStyleDocument` with `fillMatch` emits §5a's match and `Style.parse` accepts it; null gives byte-identical literal output | drop `on_null`; fails |
| PB-U2 | B | the cases: distinct non-null values, code-point order, the cap, palette order, the counts left out | a locale sort; fails on `a`/`B` |
| PB-U3 | B | the per-datum colour equals `Style.resolve(value).fillColor` for polygons, points and lines; NULL gives No value; an unlisted value gives Other | an unlisted value takes case 0; fails |
| PB-U4 | B | the shell's path agrees with the vector's match rows | lowercase the key; fails |
| PB-U5 | B | no accessor re-evaluation across ten pans (H3) | trigger on the render count; fails |
| PB-U6 | B | a match sets `fillMatch`, a literal clears it, and the transition is pure | the literal keeps it; fails |
| PB-U7 | B | the style-ts match-key rule equals Rust's over the vector's typed rows; the TS side is in `matchKeyRule.test.ts` | admit `Dictionary`; fails |
| PB-R1 | B | the legend matches `Style.legend`'s order and swatches; the chooser lists only admitted columns | a legend from the values present; fails |
| PB-R2 | B | one `record_step` with the match | send the literal; fails |
| PB-E1 | B | colour by zone: each feature's pixel equals its zone's swatch; NULL features get No value | drop the `on_null` mapping; fails |
| PB-E2 | B | export, then the bundle: `style.json` carries the match; `zone` is published; the viewer draws the same colour | send the literal document to `publishPrepare`; fails |
| PB-E3 | B | One colour restores the literal fill | leave `fillMatch` set; fails |
| PB-E4 | B | after colour by zone, the history's last step is `style.set` with the match, and its dependencies name `zone` with its type (read as `frontends/shell/e2e/recording.mjs:224-271` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:3e1ce6086a3c35e4561332c61ffbc2b0e691e913859d72dde2757681c9c85581 reads the history) | the recorder sends the literal `fillColor`; fails |
| PC-U1 | C | the source: one stream; `bbox` null; `TABLE_MAX_ROWS`; the filter and the projection; supersede cancels; the count lines | `limit` null; fails |
| PC-U2 | C | the scopes per §2.4 (c) | count another filter as passing; fails |
| PC-U3 | C | members carry the row and the filter; the cut and its marker; generation end drops them | no cut; fails |
| PC-U4 | C | nothing is issued while a consumer is held; a reported run cancels the table's stream | ignore the consumer; fails |
| PC-U5 | C | the grid's roles and keys; 10,000 rows render only the visible ones plus the overscan | render every row; fails on the DOM count |
| PC-U6 | C | a stubbed `connections_exhausted` on a tile while the table streams is retried once | no retry; fails |
| PC-R1 | C | hidden, no stream; shown, one; a filter change supersedes; a collapse cancels | issue on mount; fails |
| PC-R2 | C | session end clears the rows and shows the owner line | keep the rows; fails |
| PC-E1 | C | the first scope under one zone: all N equals the oracle count, and each row's `zone` matches | send `filter: null`; fails |
| PC-E2 | C | O-07 step 6: select three, filter so that one hides; the second scope shows 2 and the third 3 | the second scope equals the third; fails |
| PC-E3 | C | at 100k, the limit is reached and the more-may-pass line shows | a complete line at the limit; fails |
| PC-E4 | C | slow-filter-scan: the liveness line, then Cancel, with no stream left | Cancel not wired to `cancel` (`frontends/shell/src/skp/client.ts:128` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:2b1dcbef2bf6bdb430a1a69ee13f0b5b7ae92e2ec8102d34b6e6897b53c69005); fails |

**Plan §8's acceptance items, and what proves each:**
- the attributes: PA-U3, PA-U5, PA-R1, PA-E1 and PA-E3;
- colour and its legend: PB-U1 to PB-U4, PB-R1, PB-E1, PB-E2 and PB-E4;
- the table: PC-U1, PC-U2, PC-E1 and PC-E2;
- the connections: PC-U4, PC-U6 and KL-5;
- no new SKP command: §8 item 3.

**Text checks at PR A's head**, by script, each pattern self-tested positive at the base:
- `requests none`, `requests no projection` and `gains no parameter` have zero matches in `frontends/shell/src` and `renderer/tests`;
- `Proposed, so it binds nothing` has zero matches in `viewTransitions.ts`.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H7, and §3. A wrong prediction is class 2.

**Declared unchanged:**
- §2.1;
- every existing e2e outcome (H2);
- the frame-tag and identity checks;
- the export scope sentence;
- every existing string except §2.7's and §2.4's;
- the lockfiles.

**Invalidators.** Each one means stop and report.
- **I1:** an edit outside §2.6.
- **I2:** a dependency, port or lockfile change.
- **I3:** an existing e2e fails for a reason other than a declared selector change.
- **I4:** a §0.2 interface differs at the base.
- **I5:** a forbidden mock.
- **I6:** any `skp.projection_*` refusal in a suite.
- **I7:** code of an OPEN item before its ruling. That covers PR B's §2.3 (d) before OPEN-16, and 1c-shared files before OPEN-17.
- **I8:** the attribute ceiling cannot be met without changing the vertex ceiling's behaviour.
- **I9:** withdrawn. ADR-036 as accepted admits the match (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:175` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:323cc8b75aed898d6e96f4684421e94b4d506d77ba6f0e4069e4231d62293271).
- **I10:** a 1c step merges first and changes `StyleState`, `ViewState` or App's seams beyond what a class-3 row can carry. In particular, if 1c's saved `style` member is on main at PR B's base, PR B proves that a category style saves and reopens (class 9).

**Falsification.** The form is wrong if either holds:
- a projected value cannot be read co-indexed with its id from the decode pass that produced its row;
- the first scope cannot be served by one bounded `viewport_query`.

## §6. Instruments

- **Assertions:** the U, R and E rows.
- **Measurements:** none (OPEN-2 (b)).
- **The human's:** the felt rows.

## §7. Declared values and ceilings

| Constant | Value | Bounds |
|---|---|---|
| `ATTRIBUTE_PROJECTION_MAX` | 32 | columns per open; mirrors `MAX_PROJECTED_ATTRIBUTES` |
| `RESIDENT_ATTRIBUTE_MAX_BYTES` | 268,435,456 | copied attribute bytes over the resident batches |
| `CAPTURED_ROW_MAX_BYTES` | 16,384 | one captured row (×10,000 members gives at most 160 MiB) |
| `CATEGORY_MAX_CASES` | 12 | cases per apply (≤ §5a's 64) |
| `CATEGORY_PALETTE` / `CATEGORY_NULL_COLOR` / `CATEGORY_OTHER_COLOR` | 12 colours / a grey / a grey (P6) | case colours |
| `TABLE_MAX_ROWS` | 1,000 | the first scope's `limit` |
| `TABLE_MAX_IN_FLIGHT` | 1 | table streams per open |
| `TABLE_ROW_HEIGHT_PX`, `TABLE_OVERSCAN_ROWS` | 24, 10 | the windowed grid |

**Count:** `git diff --numstat <base>...HEAD -- frontends/shell renderer/style-ts renderer/tests kernel/tests/manual_walkthrough_fixtures.rs ':(exclude)frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`. `<base>` is each PR's merge base, or a named merge of main.

| Group | Files (ceiling each) | At most |
|---|---|---|
| A-P | client.ts 20, types.ts 6, tile manager 30, viewport manager 20, candidateArmSession 30, decodeBatch 150, projection 60, values 180, clickPick 40, WorkingCanvas 80, limits 25, buildLayers 6, workspaceState 20, viewTransitions 25, document.ts 6, FeatureTab 150, FeaturePanel 10, App 150, surfaceRegistry 20, styles.css 60, package.json 2, style_shell_agreement.rs 4 | 1,094 |
| A-T | projection 120, values 250, decodeBatch 280, clickPick 80, client 50, tile manager 80, viewport manager 40, candidate session 60, limits 150, FeatureTab 220, workspace 80, App.attributes 450 | 1,860 |
| A-E | attributes.mjs 420, generator 90, margin 60 | 570 |
| **PR A** | | **3,524** |
| C-P | TableTab 280, tableSource 300, tableScope 140, TableGrid 260, tableConstants 40, selection 70, viewTransitions 30, clickPick 20, decodeBatch 40, managers 40, tile comment 15, contributions 10, StudioLayout 30, actionRegistry 15, App 180, surfaceRegistry 30, styles.css 100 | 1,600 |
| C-T | tableSource 320, tableScope 220, selection 120, TableGrid 250, TableTab 200, decodeBatch 60, managers 80, App.table 450 | 1,700 |
| C-E | table.mjs 480, margin 60 | 540 |
| **PR C** | | **3,840** |
| B-P | document 160, StylePanel 200, Legend 120, categoryCases 120, styleConstants 40, buildLayers 160, matchGroups 110, WorkingCanvas 70, viewTransitions 50, workspaceState 10, stepRecorder 40, App 120, actionRegistry 25, surfaceRegistry 25, styles.css 70, style-ts 40, vector 40, Rust reader 40, types.ts 30 (conditional) | 1,480 |
| B-T | document 200, categoryCases 180, matchGroups 220, buildLayers 200, viewTransitions 120, stepRecorder 80, StylePanel/Legend 250, matchKeyRule 80, App.colour 350 | 1,680 |
| B-E | colour.mjs 510, margin 60 | 570 |
| **PR B** | | **3,730** |
| **Total** | | **11,094** |

- **Outside the count:** MANUAL-WALKTHROUGH.md 160, e2e/README.md 60, KNOWN-LIMITATIONS.md 70.
- **Under OPEN-16 (b):** `tableSource.ts` 30 joins B-P by amendment (class 9).
- **An overrun is class 8,** and this section is never edited.
- **Minutes:** `budget_minutes` stays 0, as milestone 3's did. The line ceilings bind.

## §8. Block-on-sight

1. A file outside §2.6, or any edit under `protocol/`, `kernel/src`, `engine/` or `src-tauri/`.
2. A dependency, port or lockfile change.
3. A new SKP command, field or literal.
4. A projected value read by an index not produced by the decode pass that produced `ids`, `parts` and `partToRow`.
5. A 64-bit integer narrowed to `Number`.
6. Match parse, resolve, legend or key-type semantics written in the shell.
7. A second `match`, a match off `fill_color`, or a legend derived from data.
8. `columns: []` sent, or a non-projectable column sent.
9. A NULL shown as an empty cell or an empty string.
10. A table stream issued on pan, while hidden, or while a consumer is held; more than one table stream.
11. A count line or scope that claims more than §2.4 establishes.
12. A style recorded other than as (A′); the words undo or undoable.
13. A `pub` item, prop, callback or option without a product caller, except under the instrument exemption as defined.
14. A message stating another module's consequence, or rewording a kernel refusal.
15. A new string neither marked P6 nor sighted.
16. A performance number, or B1 or the workflow called complete.
17. A seam test written to an imagined interface. The projection seam uses the committed request fixture and PA-E1; the resolver seam PB-U4 and PB-U7; the export seam PB-E2; the recording seam PB-E4.
18. The round 25 items by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a `verify-mutation` run called an observation;
    - a test-text span on a branch pinned at a branch commit, or named without its commit id.
19. A quote of the human's words marked verbatim that is not byte-identical; a line cite into the ledger; a bare self-line.
20. Code of an open OPEN item.

## §9. Gates

- **Gating, per PR:** architect and reviewer, full gating. Verdicts are proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording blocks follow `state/directives/2026-10-11-direction-after-status-review.md`, item 2.
- **The architect checks:**
  - §8 item by item;
  - ADR-023 §11 items 2 to 9 as they apply to the shell;
  - ADR-010 rules 1, 2, 5 and 6;
  - ADR-006 classes: projection and table class 1, the style class 2, export class 3 unchanged;
  - the seams in §8 item 17;
  - round 8's exemption closed at PR A;
  - the clauses of §2.2 (g) at H;
  - discharge claims and verbatim quotes.
- **The reviewer checks:**
  - the diff `origin/main...HEAD`;
  - every mutation, applied again;
  - §7 by its command;
  - an empty lock diff;
  - §4's text checks.
- **Suites, green first:**
  - `npm run verify` in `frontends/shell`;
  - every e2e suite at the base, plus the new ones. They run on the port-5400 harness under `state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md:6-7` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a7934120728704febfd42c4c818aae659c2fea1553e221527de7693bf80a18d9 until port 5180 is free.
  - `cargo test -p spatial-renderer` (PR A and PR B);
  - in PR B, `npm run build` in `renderer/bundle-viewer`, whose scan passes, once #241 has merged;
  - the governance `node --test` suites;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit.
- **Heavy runs:** THE MACHINE paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1, as written in every heavy-run brief.
- **Operator:** one new Part, with a blank log, joining `operator-sitting-queue` on each PR's merge. Each PR adds its own rows.
  - 0. Read §10, last amendment first.
  - 1 (A). MultiType: click a feature. Felt: is it readable, and where did you look?
  - 2 (A). The null marker and the not-projected line.
  - 3 (B; O-07 step 7). Colour filter-zoned by zone. Felt: where did you look for the legend, and does it feel like the layer's style?
  - 4 (B). One colour.
  - 5 (B). Export with the category style; the bundle shows the same colours and legend.
  - 6 (C; O-07 step 6). Select five, filter so that some hide, open the Table and switch scopes. Felt: is the scope clear before you open the selector?
  - 7 (C). The 100k fixture: the line at the limit.
  - 8 (C). Cancel a slow table load.
  - 9. Did you expect attributes on hover?
  - 10. P6 sight of every new string, and of B1's eight refusal messages from their committed error fixtures (OPEN-14).
  - 11 (A; OPEN-2 (b)). On a real parcel file with many columns, did the first view feel slower?

## §10. Amendments

The section opens empty and is append-only.
- **Amendment 1,** by the custodian at the commit: the pins by script, the rulings by reference, OPEN-14 at the sitting, and OPEN-16 and OPEN-17 as answered.
- **One re-sweep amendment** (§0.3) follows before each PR's code.

## §11. OPEN items, ruled

The source for every ruling is `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0492f90a35a4b8ec4a2d45ee5df5be2253f7891e5410f66b606d49b04dd04fdb:
- OPEN-1: (a).
- OPEN-2: (b).
- OPEN-3: (a), confirmed.
- OPEN-4: (A′), carried by ADR-036's block (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:4b060a097e2669c574a255533c6db432f4f3bb4e477b51d38bb8f192cbff8f1d), now in ADR-036 at `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:175` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:323cc8b75aed898d6e96f4684421e94b4d506d77ba6f0e4069e4231d62293271 and `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:177` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:a73580f5dbc536d095028cae3529608708b2cc709ab11b7cf7c05c94dbe58f50. The widening is `record-step-style-match-widening`, which the human places.
- OPEN-5: (c).
- OPEN-6: (a). Per-case edits are a later node.
- OPEN-7: (A), with the human's KNOWN-LIMITATIONS line; see OPEN-16.
- OPEN-8: (a).
- OPEN-9: (A); see §2.4 (e).
- OPEN-10: (a).
- OPEN-11: A, then C, then B.
- OPEN-12: (a).
- OPEN-13: (a).
- **OPEN-14: at the sitting.**
- OPEN-15: dated notes at ADR-023's acceptance, in the human's words, when B1 closes. This piece edits no ADR.

---

# OPEN items

**OPEN-16 (the human's; it binds PR B only).** Where the colour cases come from. OPEN-6 (a), as drafted, takes them from the features the map holds. The ruling on OPEN-7 adds a KNOWN-LIMITATIONS line. This span is byte-copied from my Read of `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:0492f90a35a4b8ec4a2d45ee5df5be2253f7891e5410f66b606d49b04dd04fdb, a sub-line span, not copied by script; the custodian re-checks it by script: "with a KNOWN-LIMITATIONS line that the cases come from the first 1,000 rows and the rest draw as Other". If the cases come from the resident batches, that line is untrue: a Correctness finding, an untrue limit.
- (a) Keep the resident source, and word KL-3 as the code does. The human's line would then be replaced, which is the human's to approve.
- (b) Build the cases from one bounded first-scope query: `bbox: null`, the view's filter, `limit` = `TABLE_MAX_ROWS` (1,000), the projection, through PR C's `tableSource` and its single stream. The human's line is then true as given, and the cases do not depend on pan or zoom. The order A, C, B makes it available. Cost: one more stream use, inside `TABLE_MAX_IN_FLIGHT`, and `tableSource.ts` joins PR B by class 9.
- **Recommend (b).**

**OPEN-17 (the custodian's at dispatch; the human's only if it changes 1c's order).** How PR A and 1c's step 1 share time.
- (a) As 1c's §2.14 is written: PR A now. Slot 2 runs O0 (B) only (`spikes/`, plus a file outside the repository) until PR A merges.
- (b) PR A now, and 1c's step 1 dispatched now on its groups outside `frontends/shell`:
  - O0, ADR text, `renderer/src/canonical.rs`, the kernel product and kernel tests, and `src-tauri`;
  - not `kernel/README.md` until #241 merges;
  - not protocol work that needs the version bump;
  - nothing under `frontends/shell` until PR A merges.

  This needs an appended amendment to 1c's form before its dispatch. It meets both of the human's Slot lines and the line that step 1 proceeds up to the resolver meanwhile (`state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md:11` @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e sha256:06da02b1dbc4a0005646f3e9332c04080a9eaf2a7338257860414460e62e5b6a).
- (c) 1c step 1 whole first, and PR A after its merge.
- **Recommend (b).** The same interleave applies to PR C and PR B against later 1c steps.

## Amendment 1 — at the commit: the pins, the rulings by reference, OPEN-16 and OPEN-17, and the Slot 1 line; written by the custodian

*Written by the custodian before any code. References only: the architect's final form, `state/consults/2026-10-22-b1-shell-half-milestone-4-architect-final-form.md`; the human's word, `state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md`.*

1. **The pins:** the form's 102 line cites read at main 4b26d279, those marked so and §0.2's, are pinned by script at 4b26d27905dd93d5c7453da67ee0d93ec8d4313e. A continuation cite is written with its file's full path, among them §11's two ADR-036 lines, §2.9's docs-lane item 12 and 1c's §2.14 lines, which follow a path named without a line. OPEN-16's quoted span was re-checked by script against its directive's line 20 at that commit.
2. **The rulings** are §11's, by reference to its directive. OPEN-14 is at the sitting.
3. **OPEN-16 is the human's,** on Monday 2026-10-26 (recommended (b)). It binds PR B only, so PR A and PR C proceed.
4. **OPEN-17: (b),** the custodian's at dispatch. PR A starts now. 1c's step 1 starts now on its groups outside `frontends/shell`, not `kernel/README.md` until #241 merges, and not the protocol work that needs the version bump; 1c's form records this by its own amendment before its dispatch. It meets both of the human's Slot lines. If the human reads it as a change to 1c's order, the answer is theirs on Monday.
5. **The Slot 1 line:** PR A is disjoint from #241 by every file (§2.9), so the node's `depends_on` no longer names `bundle-redaction-scan-not-in-product-publish`.
6. **Next:** PR A's re-sweep at its base (§0.3), recorded as an amendment before its code. PR A's `buildLayers.ts` comment waits for the docs-lane piece's merge (§2.9).

Nothing above is edited.

## Amendment 2 — PR A's re-sweep at B 55618ab5, written after the re-sweep's and the base series' results were seen: no pin moved and no invalidator; four class-3 rows (the text check's wrap, a test title, `document.ts`'s words, the fifth positive at b24e5281); the Part and the numbers; the base's suites and rule 00 (class 1)

*Written after the re-sweep's and the base e2e series' results were seen, before any PR A code. The architect drafted it read-only at main c6de9b48cde727684de7fec7bb44323fe24d0a02. It is references only, and nothing below is a quotation. The re-sweep is `state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md`, sha256 from its line 5 c7c9b7b81f640270a4d734cbb2b01a17a3530f3797f7e2da7e3831e1732f6d39. The series is `state/consults/2026-10-22-b1-shell-half-pr-a-base-e2e-tester-report.md`, sha256 from its line 5 4b0827c471257e77ca63091638af3f24e3796792da09b3b43409484423186a52. B is 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. Every `@ 4b26d279` pin is historical (§0.3). For the work, the tree at B is authoritative.*

1. **The pins.** None moved and none changed (the re-sweep's step 1). The §0.2 interfaces read at B as §0.2 states them (its step 2), so I4 does not fire. Every PR A file in §2.6 exists at B, and its six new files do not (its step 2, last paragraph).

2. **The re-sweep's four notes (class 3).**
   - **(a) The wrapped text check.** `Proposed, so it binds nothing` runs across `frontends/shell/src/workspace/viewTransitions.ts:6-7` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:7ccc0e5c8560a6e994c8b031916b8dfdc1a46295b493012341ea4744c0fe33ff. A line-by-line search finds nothing at B, so §4's second check fails its own self-test (re-sweep note 1).
     - §2.2 (g)'s sixth bullet is read as that two-line span.
     - §4's text-check paragraph reads: **Text checks at PR A's head**, by script. Each pattern is searched twice in each file named: once line by line, and once over the file's text with each line's leading whitespace, leading comment marker (`//!`, `//` or `*`) and trailing whitespace removed and the lines joined by one space. Each pattern is self-tested positive at the base in at least one of the two runs. At the head it has zero matches in both runs:
       - `requests none`, `requests no projection` and `gains no parameter` in `frontends/shell/src` and `renderer/tests`;
       - `Proposed, so it binds nothing` in `frontends/shell/src/workspace/viewTransitions.ts`.
     - The self-test at B:
       - `requests no projection` is positive at `frontends/shell/src/skp/client.ts:122` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:c4dbd2d71a4fd6a4def8ef340b9d4bf2e3742ae1a9a10ced4f1de2a03197de10 and `frontends/shell/src/skp/client.test.ts:43` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:f71a6cc33b3b44c6236c9e1d4e34619e6ac4dc80f915a2342ab58a7f4bb30c99;
       - `gains no parameter` is positive at `frontends/shell/src/skp/types.ts:262` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:db14ea2888c71d6ac649fdbb131f3c7892db8736529b7541bb6811cb124aaaff;
       - `requests none` is positive at `frontends/shell/src/style/document.ts:20` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:df755c15b565488b71dc128e77dccac4f71d1ab153f6943c230c4633b3d6a2d9 and `renderer/tests/style_shell_agreement.rs:39` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:a082692c1d782e3faf5121db14d16419bb6d6d0fbc0c130d8b11da0532a7b5b8;
       - `Proposed, so it binds nothing` is positive in the joined run only, over lines 6 and 7.
   - **(b) The test title in `frontends/shell/src/skp/client.test.ts`.** The check reaches the title at `frontends/shell/src/skp/client.test.ts:43` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:f71a6cc33b3b44c6236c9e1d4e34619e6ac4dc80f915a2342ab58a7f4bb30c99 (re-sweep note 2). That file is a PR A test file (§2.6), so this is a test-text fix.
     - The title reads: `sends columns: null as an explicit null when the caller passes null, never omitted`.
     - The test's call passes `null` for `columns`. Its body, its doc comment and its recorded mutation (omit the key) stay as they are.
     - Clause check against the body as it stands at `frontends/shell/src/skp/client.test.ts:44-48` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:a6bde0ec0918e939969af20036a387033191a308453957a92796495c1a9e9cb1:
       - "explicit null" is the `toBeNull` assertion;
       - "never omitted" is the `toHaveProperty("columns")` assertion;
       - "when the caller passes null" is the call's argument once §2.2 (b) makes `columns` required.
     - These are not the human's words. The edit fits A-T's `client 50` (§7).
   - **(c) `document.ts`'s bullet after the clause comes out.** Removing the clause from `frontends/shell/src/style/document.ts:18-22` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:d8b7d7e56fb24a3965cedc29ccdfc655e3ce7a499187ab206e5e96e91da387f1 leaves a lowercase "so" after a full stop, and "not a wire restriction" loses its antecedent (re-sweep note 3).
     - The bullet reads, wrapped as the file wraps:
       ```
        * - **Literal-only.** `StyleDocumentV0`'s type has no `match` variant at all -- there is no field to
        *   set that would produce one. So categorical/match styling is still unavailable live. The wire
        *   does not prevent it: the shell's `viewport_query` calls carry the open's projection set
        *   (`projectionFor`; `null` when no column is projectable). There is no wider model here.
       ```
     - Clause check at PR A's head:
       - The type has no `match` variant: `frontends/shell/src/style/document.ts:109-118` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:f4017650ff734303b5cb2ceb04195557bb50eb179be1ab5844f04cd1ac922e19, which PR A does not edit (§2.6, comment only).
       - Unavailable live: the canvas passes one `fillColor` (`frontends/shell/src/canvas/buildLayers.ts:447` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:0a58685b0d83fd756ea6585db8d0197e06e033323fae97b86e8043dbbc276639, `frontends/shell/src/canvas/buildLayers.ts:470` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:4a19c0098a5ad5403e537096f9e2b4c05d34c41bfa86c3e630271cc6e219bc35), and PR A touches only that file's comment.
       - The calls carry the open's set: §2.2 (a) and (b), asserted by PA-U1 and PA-U7.
       - "There is no wider model here" is unchanged.
     - These are not the human's words. ADR-023's B1 condition (1) asks for exactly this correction in the piece (RULED 2026-09-14, question set D, item D2, condition 1; carried at `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:144` @ c6de9b48cde727684de7fec7bb44323fe24d0a02 sha256:18b6453d6e8e8120764205e9d89730c9cf88420e33656caca15d839577dd2a72).
   - **(d) The fifth positive at b24e5281.** At b24e5281, `frontends/shell/src/canvas/buildLayers.ts`'s doc comment on `ResolvedDrawParams` carries `requests none`. That branch commit is named here with no line pin (re-sweep note 4 and step 5). The other positives there match §2.2 (g)'s list.
     - §4's text checks are run at the PR A head that goes to the gate, after main with #243's merge has been merged into PR A's branch (§2.9).
     - At that head the first bullet's runs also reach `buildLayers.ts`. Its self-test is the positive at b24e5281, and its zero follows §2.2 (g)'s fifth bullet (item 5).

3. **The Part and the numbers.**
   - **The Part is AC.** The last Part at B is AB (`frontends/shell/MANUAL-WALKTHROUGH.md:1927` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:4917a05ad91af5f3bcba369d513f01f305aa06eb7d1042ae5a0931cb2ee1a3d5). No branch in flight adds a Part (re-sweep step 3).
   - **KL-4 is item 51 and KL-7 is item 52.**
     - The highest item at B is 46 (`KNOWN-LIMITATIONS.md:407` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:e2a1de35da75f57c0f947eedf774921d7600f1be9e9b8d1ca9ebb89339eb78eb).
     - #241's item is 47, a branch fact at 2fc01f59.
     - 1c places its items after it and withdraws K-1 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:513-514` @ c6de9b48cde727684de7fec7bb44323fe24d0a02 sha256:17ee5e3fa2ef4595fc3ab89c10b8e1e700c0c1f2d66d6375648124cf80041eec), so its K-2 to K-4 take 48 to 50 (re-sweep step 4).
     - The numbers are read again at PR A's KNOWN-LIMITATIONS commit. A change there is class 3, with the tree authoritative.

4. **The base series (class 1).**
   - **Result.** The 14 `e2e:` scripts in `frontends/shell/package.json` other than `e2e:debug` each ended rc 0 at B, on an exe built at B. `e2e:residency-harness` was read by its exit code only.
   - **Fixtures.** They were hash-identical before and after, nothing was regenerated, and the 5 GB fixture was not used.
   - **The harness** ran under §9's port-5400 approval:
     - the overlay through `TAURI_CONFIG`;
     - vite with `--strictPort`;
     - the npx shim on PATH, and for `recording` its waiting variant;
     - one shared hold for each run;
     - a cargo target outside the worktree.
   - **Four attempts failed on harness causes,** each disclosed in the series:
     - publish twice, its deadline spent on a cargo build of its verify example;
     - the first exe build, before the shell's generated notice file existed;
     - recording once: the stock shim leaves the app detached, so the suite's stop released nothing, and its RECORD step met a live lock after OPEN, APPLY, STYLE and RESET had passed.
   - **None is I3.**
     - In each case the series shows the cause in the launcher or the build.
     - Each suite then passed at the same commit, with no product change, on the corrected harness: publish with its example built, and recording with the waiting shim.
     - The exe build is not a suite.
     - The reading, class 1: under I3, a failure whose recorded cause is the harness, and which passes at the same commit on the corrected harness, is not an e2e failure. The correction is carried into every later run of this piece. That means the waiting shim for `recording`, and publish's verify example built before its deadline starts.
     - The custodian judged the same.

5. **§2.2 (g)'s `buildLayers.ts` bullet against #243 (class 3).**
   - After main with #243's merge has been merged into PR A's branch, PR A removes the clause naming `viewport_query`'s projection since `skp/0.6` and the shell requesting none, and re-wraps (re-sweep step 5).
   - The comment's sentence reads:
     ```
      * `0..1` opacity). The shell's style documents are literal-only (`style/document.ts`'s
      * `StyleDocumentV0` has no `match` variant), so this is exactly ONE colour for a whole style, not
      * a per-feature table -- a plain array, deck.gl's own "constant attribute" shape, is what this
      * type carries and what `buildLayers` below passes straight through unchanged. */
     ```
   - Clause check at PR A's head:
     - "Literal-only" and "no `match` variant": `frontends/shell/src/style/document.ts:109-118` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:f4017650ff734303b5cb2ceb04195557bb50eb179be1ab5844f04cd1ac922e19, not edited by PR A.
     - "Exactly ONE colour": `frontends/shell/src/canvas/buildLayers.ts:447` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:0a58685b0d83fd756ea6585db8d0197e06e033323fae97b86e8043dbbc276639 and `frontends/shell/src/canvas/buildLayers.ts:470` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:4a19c0098a5ad5403e537096f9e2b4c05d34c41bfa86c3e630271cc6e219bc35, with PR A editing that file's comment only (§2.6, ceiling 6).
     - "A plain array … is what this type carries": the `fillColor` tuple at `frontends/shell/src/canvas/buildLayers.ts:36` @ c6de9b48cde727684de7fec7bb44323fe24d0a02 sha256:563daa957fb0d092226396673fd1b3a9a138a279727bef9fc27147d9799aa968.
     - The sentence does not say that the shell requests no projection, or that `viewport_query` carries no attributes.
   - These are not the human's words. The worker applies them, and the PR body lists them.

6. **Rule 00 at B (class 1)** (re-sweep step 6; §2.9; Amendment 1 item 4):
   - 1c's branch is at B, with no commit and none of the six shared files.
   - The docs lane is at b24e5281. It shares `buildLayers.ts` only, as §2.9 says.
   - #241 is at 2fc01f59 and is disjoint.
   - `verify-quotes-round-item-cites` is at b08a1fec and is disjoint.
   - The F7 piece edits Part F only.
   - PR A's Part AC and its items 51 and 52 are separate paths.

7. **Next:** PR A's code from B, by one worker-high, on `cut/b1-shell-half-pr-a`.
8. **Generation:** the node's generation goes up by one.

9. **F1, the scriptless drivers at B (the architect's finding, (a); the custodian's row):** `state/consults/2026-10-22-b1-shell-half-pr-a-scriptless-drivers-tester-report.md`. `pan-anchor.mjs`, `source-watch-idle.mjs` and `source-changed.mjs`'s default route pass every step; the post route's S5d is INCONCLUSIVE, twice, with every other step passing. Milestone 3's Amendment 3 item 12 records an S5d-only result beside the runs, neither I12 nor I3, and that holds here.
10. **F2 (the custodian's row, on the architect's finding):** PR A does not merge before #243. If #243 is dropped, PR A edits B's sentence in its place, and that edit is class 3. `carries no attributes` joins §4's first text-check bullet, positive at B at `frontends/shell/src/canvas/buildLayers.ts:31` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:ba2218b8e148ec04b7d7f37f80ce20beb5acf6da6d0f491a2b08632e95102335.
11. **F3 (class 3; the architect's words, not the human's):** §2.2 (g)'s first bullet, `frontends/shell/src/skp/client.ts:122-123` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:d2fbf847e1ae29847d76a0da301dd89ffc62612d48ad06975436c3cbd409662d, is replaced once line 124 sends the parameter by:
    ```
        // `skp/0.6`: the caller's projection set, sent as given (`projectionFor`'s list, or `null`
        // when no column is projectable); `null` is sent as `null`, never omitted.
    ```

Read the last amendment first.

Nothing above is edited.
