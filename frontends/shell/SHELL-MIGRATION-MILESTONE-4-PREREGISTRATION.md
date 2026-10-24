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

## Amendment 3: scope addition (class 9), written after the worker's I1 stop was seen. Three product files, their tests, one test helper and nine null fills join PR A's list in §2.6. The duplicate drop keeps a row map. Every new member is required (class 1).

*Written after PR A's worker stopped at I1, and before any PR A code. The stop is recorded in `state/consults/2026-10-22-b1-shell-half-pr-a-i1-stop-worker-report.md`. This is a scope addition. §2.6's last paragraph makes a file added to a PR's list class 9 (round 25, item 2 (a)). The standing rule that adds the work is the cross-module seam rule (RULED 2026-09-16, question round 4): the decode, residency and inspect seam is written against what the residency and click code have at B. The architect drafted this read-only at main 0ff8db4e, with the code at B 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. §7 is not edited. Nothing below is a quotation.*

1. **The need (class 1).** At B, three product sites outside §2.6 build, by naming fields, the objects that §2.2 (c) and (e) widen:
   - `trimBatchToVertexBudget` rebuilds a `ResidentBatch` (`frontends/shell/src/canvas/tileIngest.ts:222-230` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:6458473d12a5b53c143101aef80ad38984fec70cd3933f84f996e8e8a4dc1191).
   - `TileResidentSet.addBatch` rebuilds one after a duplicate drop and re-indexes the rows (`frontends/shell/src/canvas/tileResidentSet.ts:225-254` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:12b3dbe647e1430f7c4345028bfa10603ecd61a6b4144e3030546524fed21d6f).
   - `clickEffect` builds `inspect.set`'s params from the click (`frontends/shell/src/feature/clickEffect.ts:67-71` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:b3a973da2f27c158386073b6cc4b9fdfbe85bf4a73f683b85058443ff86c1a86). Its `ClickInput` mirrors `ClickPick` (`frontends/shell/src/feature/clickEffect.ts:17-34` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:ff89fd3b570de70c863f78711d910322333369e9611029909270699ee1e0aec2), and App passes the canvas's click to it unchanged (`frontends/shell/src/App.tsx:1880-1886` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:e13752cdff297b3864b15cba933c5003bbea33a9e63fb6eaaeead5d8f6a77d7f).

   Both rebuilds are on the candidate arm's ingest path (`frontends/shell/src/canvas/tileIngest.ts:169-179` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:8adb13ff329e20f54fb5e00345144bde8c8de5f71ee987214e32cb15a61512fb). Left unedited, each one drops the new member.

2. **The trim (`tileIngest.ts`): carried unchanged.**
   - The trim keeps a prefix. Kept row r is source row r for every r below the count, and `partToRow` is the source's prefix (`frontends/shell/src/canvas/tileIngest.ts:195-205` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:4858de580c79654137b65dcda4770d0ef62dec3b69e92570fa6262c93f0b8646). So every row a kept part resolves to is the decode pass's own row for that id.
   - The trimmed batch therefore carries `attributes` as the same object: `null`, `"not-held"`, or the block. No copy is made (ADR-004).
   - `bytes` stays the source's. The rows trimmed away stay in `data` until the batch is released, so PA-U6's sum is the bytes actually held.
   - The trim's choice of rows and the vertex ceiling are unchanged. I8 is not met.

3. **The duplicate drop (`tileResidentSet.ts`): carried with a row map.**
   - **The rebuild.** The attribute block gains `rows: Int32Array | null`. `decodeBatch` sets it to `null`. `addBatch`'s rebuild sets `rows[dst] = srcIdx` in the same `keepIdx` loop that writes `ids`, `parts` and `partToRow` (`frontends/shell/src/canvas/tileResidentSet.ts:235-244` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:4057e861123d652865bd610739de20f782bbc39ba6f336c367f853776978aed4). It carries `names`, `data` and `bytes` unchanged, as the same objects. `"not-held"` and `null` are carried unchanged. The no-duplicate path, which returns the same batch, is unchanged.
   - **The reader.** `values.ts`'s `readRow(batch, row)` reads `data` at `row` when `rows` is null, and at `rows[row]` otherwise. It is the only reader of `data`.
   - **No second map.** In product, every batch reaches `addBatch` with `rows` null: either from `decodeBatch`, or from a trim that carries it unchanged. So no map is ever composed, and no code path does it.
   - **Why §5's falsification and §8 item 4 are untouched.** `data` is read at the decode pass's own row index for that feature. That index is written in the same loop step that copies the feature's id and parts from the decoded batch. §8 item 4 is met as written. §5's first condition is what PA-U9 tests.
   - **Why not mark the batch not-held instead.** A deduped batch would then hold no attributes whenever it repeats a feature that is already resident. In the candidate arm that means every feature straddling a tile edge, and every tile overlapping the first look (`frontends/shell/src/canvas/tileResidentSet.ts:58-82` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:5650cf50ff4df474e02b5066213cb522ec70a86a9b15f3bed8bfedda50872787). That is ordinary use, so KL-4 (not held past the ceiling) would be untrue, which is a Correctness finding.
   - **Why not copy the kept rows.** That would be a second copy per deduped batch on the ingest path (ADR-004), and it is a docs/08 risk with no budget to measure it against (OPEN-2 (b)).
   - **What the row map costs.** `rows` is not attribute data and is not summed into `RESIDENT_ATTRIBUTE_MAX_BYTES`. It costs 4 bytes per kept row. `partToRow` costs the same per part and is not summed either.

4. **The click (`clickEffect.ts`).**
   - `ClickInput`'s feature member gains `row`, mirroring `ClickPick` (`frontends/shell/src/canvas/clickPick.ts:30-33` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:8c0e25c0d50f5b25633e726c01728743fc92519a061d09d55ed9555f2e686f5c).
   - The Navigate branch's `inspect.set` params carry `{pick, bounds, row}`.
   - The Select branch and the pinned branch are unchanged. Neither sets an inspected feature.

5. **Every new member is required (class 1, the reading of §2.2 (c) and (e)).**
   - **The choice.** These are required, each typed with `null` as §2.2 writes it: `ResidentBatch.attributes`, `row` on `ClickPick`, on `ClickInput`, on `inspect.set`'s params and on `InspectedFeature`. `decodeBatch`'s projection is a required sixth parameter, and `WorkingCanvas`'s `projection` prop is required.
   - **Against (c).** §2.2 (c) puts the attributes in the decode pass under ADR-010 rule 2, which builds the decoded members together so that a desync is structurally hard. A required member makes the compiler find every site that builds a `ResidentBatch`: the two found at this stop, and any later one. If the member were optional, both rebuilds would have compiled and silently dropped the data. The missing member would then read as `null`, and the Feature tab would state that no column is projected, which is untrue for that feature.
   - **Against (e).** `row` is kept for the generation (ADR-010 rule 5). Required, the compiler proves that each of its four product writers carries it: `resolveClickPick`, App's pass-through, `clickEffect`, and the `inspect.set` reducer (`frontends/shell/src/workspace/viewTransitions.ts:141-147` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:6aa223d39b40e3e76baa823d0058be2ace0648b9414ad0e65f208a83c77e5dcb).
   - **No defaults.** A default value for the sixth parameter or for the prop would be used only by tests. That is a code path with no product caller (§8 item 13).
   - **What this means for the unlisted tests.** Nine of them take a null fill (item 6). Each fill is true of its fixture, because none of them projects a column. App's describe fixture has no projectable column (`frontends/shell/src/App.selection.test.tsx:62` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:d2ce2baec6c7b93bfae5084837579bc03266602587b10f3d940f731d0e70e481), and the canvas tests' batches carry no attribute column. No assertion, title, comment or recorded mutation changes. In-list test files take their fills inside their own §7 ceilings.

6. **The files added to PR A's list in §2.6, and their lines (class 9).** §7 is not edited. These figures are declared beside it, they are counted by §7's command, and an overrun of either is class 8.

| Group | Files (ceiling each) | At most |
|---|---|---|
| A-P, added | `frontends/shell/src/feature/clickEffect.ts` 10, `frontends/shell/src/canvas/tileIngest.ts` 8, `frontends/shell/src/canvas/tileResidentSet.ts` 30 | 48 |
| A-T, added | `frontends/shell/src/feature/clickEffect.test.ts` (new) 70, `frontends/shell/src/canvas/tileIngest.test.ts` 60, `frontends/shell/src/canvas/tileResidentSet.test.ts` 110, `frontends/shell/src/testUtils/attributeBatchIpc.ts` (new) 80 | 320 |
| A-T, null fills | `frontends/shell/src/canvas/buildLayers.test.ts` 14, `frontends/shell/src/canvas/highlightLayers.test.ts` 6, `frontends/shell/src/canvas/pick.test.ts` 8, `frontends/shell/src/canvas/residentSet.test.ts` 4, `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` 4, `frontends/shell/src/App.command.test.tsx` 4, `frontends/shell/src/App.selection.test.tsx` 2, `frontends/shell/src/workspace/selection.test.ts` 4, `frontends/shell/src/workspace/scope.test.ts` 2 | 48 |
| **Added** | | **416** |

   - **PR A's new totals:** 53 files, and 3,524 + 416 = 3,940 lines.
   - **The four fill forms.** Each null fill takes one of these forms: `attributes: null` in a `ResidentBatch` literal; `row: null` in a click or `inspect.set` literal; `null` as `decodeBatch`'s sixth argument; or `projection: null` in props.
   - **The fill sites at B:**
     - `frontends/shell/src/canvas/buildLayers.test.ts:55` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:67863fe067fdf546ff458503bfc601a15327b2f0338cf390fde5271410d950de, `:148`, `:185`, `:270`, `:357`, `:407`;
     - `frontends/shell/src/canvas/highlightLayers.test.ts:36` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:df5a80d2ed8673c95bbd05439088d48545c73519bc8821d69fd79d55719fde82, `:48`, `:57`;
     - `frontends/shell/src/canvas/pick.test.ts:32` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:025f9646aec8b3fba3446cb4e60dcd2513902b3d2bbe3ce1c02cd335ca796219, `:79`, `:116`, `:143`;
     - `frontends/shell/src/canvas/residentSet.test.ts:11` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:84ac69112af30386e368b8302aa7665c0a96b52d7bbf81e940b01dc6689442b8, `:45`;
     - `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:93-106` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:1591f6a97d7e0ec10090bcb40a389597c2680d427f3d82a5a3c2ba2338b50fb9 (the base props: the cast hides the required prop from `tsc`, so the fill is named here) and `:306`;
     - `frontends/shell/src/App.command.test.tsx:487` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:d76ecb5688ba2629fcc53f75fe5174442191b69b1d0d8834eb3a8c1c855828e6, `:594`;
     - `frontends/shell/src/App.selection.test.tsx:309` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:456479e38924c0f4d2a4730ca2c346bf98945c3a0180f6907e5f9940e4cff3e7;
     - `frontends/shell/src/workspace/selection.test.ts:187` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:c99db66a5b006a9d15bb304a283724f5d6b9734e07b718fe615b606175a84621, `:260`;
     - `frontends/shell/src/workspace/scope.test.ts:68` @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f sha256:48f7ba8f46e5fcc5d0a33672a588be413ba65b321fa76c5a9c25809520954767.

7. **Tests, one mutation each.** Each mutation is observed as §4 states: apply it, run the named test, record its failure by name with the commit, and revert. No `verify-mutation` run is an observation.

| ID | File | Test | Asserts | Mutation; expected failure |
|---|---|---|---|---|
| PA-U8 | `tileIngest.test.ts` | `trimBatchToVertexBudget carries the attributes unchanged, so each kept row reads its own values` | The batch is decoded from the helper's IPC: ids 11, 22 and 33, with a text column `tag` holding a, b and c. Trimmed to two whole features, `trimmed.attributes` is the source's object (`toBe`), and `readRow` gives a and b. A not-held batch, trimmed, stays `"not-held"`. | The trim's literal writes `attributes: null`. The test fails. |
| PA-U9 | `tileResidentSet.test.ts` | `a duplicate drop carries the attributes with a row map, so each kept row reads its own values` | Tile `0:0` owns id 2. A decoded batch of ids 2, 5 and 7 (`tag` two, five, seven; id 2 has two parts) is added under `0:1`. The accepted ids are 5 and 7, and `readRow` gives five and seven. `accepted.attributes.data` is the decoded batch's `data` (`toBe`), and `bytes` are equal. `partToRow` is as the SH-7 test states. | The rebuild carries the block with `rows: null`. Row 0 then reads two, and the test fails. |
| PA-U10 | `tileResidentSet.test.ts` | `a duplicate drop keeps a not-held batch not-held and a null batch null` | The same drop over a not-held batch accepts it not-held. Over a batch decoded with projection `null`, it accepts it with `attributes` null. | The rebuild writes `null` for any block that is not an object. The not-held case fails. |
| PA-U11 | `clickEffect.test.ts` | `a Navigate click on a feature carries its row into inspect.set, and the reducer keeps it on the inspected feature` | The test calls `clickEffect` with a Navigate view and a feature click. The click's `row` is `readRow` of a decoded batch's row 1. The effect's `inspect.set` carries that row, and `applyViewTransition` puts it on `inspected.row`. This is pure: nothing is mocked. | The Navigate branch sends `row: null`. The test fails. |

   - **One IPC builder, used by all.** The batches in PA-U8 to PA-U11 come from the real `decodeBatch` and `readRow`, over IPC built by `testUtils/attributeBatchIpc.ts`. PA-U3 uses the same helper, so there is one builder.
   - **The helper writes the engine's envelope shape:** `id`, then geometry, then the attributes, with `attribute_columns` as a JSON array of names (`engine/src/envelope.rs:239-256` @ 0ff8db4e35dec6c6ed4afbd51645e1cae757c15c sha256:39ad563ec0b97ac390e14b49a6d47683b88a9a58d9e831e71a9e1bd0189b7522; `engine/tests/data/golden/polygon-wire.golden:34` @ 0ff8db4e35dec6c6ed4afbd51645e1cae757c15c sha256:8a3b1dd61e56bc91da04804d365e6488717fb4ab745d2736814a65144291c031).
   - **No literal blocks.** No test writes an attribute block as a literal (§8 item 17).
   - **End to end.** The product's own end-to-end proof of the click path stays PA-E1.

8. **§5.**
   - **Declared unchanged:**
     - every existing test in `tileIngest.test.ts` and `tileResidentSet.test.ts`, by assertion;
     - the trim's choice of rows;
     - the dedupe's ownership, its suppressor bookkeeping and `duplicatesDropped`;
     - a rebuilt batch's `partToRow`, `partCount` and `totalVertices`;
     - the vertex ceiling;
     - H6. Neither the trim nor the dedupe copies the data; PA-U8 and PA-U9 assert that `data` is the same object.
   - **Invalidators:**
     - I1 fires if `tsc --noEmit` at PR A's head needs an edit to a file outside §2.6 and this amendment.
     - I8 is as stated in §5.

9. **§8 and §9.**
   - **§8 item 4** is read to include two more cases, for every PR: `data` indexed anywhere other than `values.ts`'s reader; and a rebuilt `ResidentBatch` that drops, defaults or re-copies its attributes.
   - **§8 item 17's seams** gain the rebuild seam, proved from the real decode by PA-U8 to PA-U10.
   - **The reviewer adds:**
     - `tsc --noEmit` clean at the head;
     - the nine null-fill files' diffs contain only item 6's four forms;
     - the mutations of PA-U8 to PA-U11, applied again.
   - **The architect adds:** a check of item 3's row map against §8 item 4.

10. **Rule (00) for the added paths** (§2.9; Amendment 2 item 6):
    - **#241**, at 2fc01f59: it has no path under `frontends/shell/src`. Disjoint.
    - **#242**, `verify-quotes-round-item-cites`: its paths are `scripts/plan/**` and `.github/workflows/governance-ci.yml`. Disjoint.
    - **#243**, the docs lane at b24e5281: its four paths (§2.9) include `frontends/shell/src/canvas/buildLayers.ts`, not `buildLayers.test.ts`. Disjoint.
    - **#244**, F7: it edits Part F of `frontends/shell/MANUAL-WALKTHROUGH.md` only. Disjoint.
    - **1c's step 1:** its groups name none of the added paths (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-458` @ 0ff8db4e35dec6c6ed4afbd51645e1cae757c15c sha256:8b86ef554cb7d295430fe97959b28460bdd5fa5ae44871bb6a14672781f85439). Its shell-tests group names no file. Under OPEN-17 (b) (Amendment 1 item 4) and 1c's own order (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:575-577` @ 0ff8db4e35dec6c6ed4afbd51645e1cae757c15c sha256:fab38342bc3bc001dcacfdee8c25ccc2eb85bcdfa6cabc60150a6fe68731a196), it edits nothing under `frontends/shell` until PR A merges. Disjoint.
    - **This form's later PRs:** PR C edits `workspace/selection.test.ts`, and PR B edits `canvas/buildLayers.test.ts`. Each comes after PR A's merge, in OPEN-11's order.

11. **Forward note (class 1).** PR C's `ResidentBatch.filter` (§2.4 (c)) is required under item 5's reading, and it meets the same two rebuild sites. PR C's re-sweep adds `tileIngest.ts` and `tileResidentSet.ts`, by class 9, before its code.

12. **Next:** PR A's code from B under this amendment, by one worker-high.

Read the last amendment first.

Nothing above is edited.

## Amendment 4: PR A's code read at 37b9d756, written after that code was seen and before its gates. D1 is class 8. The managers' `columns` and the canvas's new callback become required (class 1, a code change). The status item for features without attributes states a past fact (class 1, a code change). D3 to D11 are read (class 1), with one record correction (class 3).

*Written after PR A's code at 37b9d756267d25a30d8445615ff4e76de10b6e61 was seen, and before its gates; revised after the tester's `e2e:attributes` run at that head was seen (`state/consults/2026-10-22-b1-shell-half-pr-a-attributes-suite-tester-report.md`). The architect drafted it read-only at main 72868422, with the code at that head and B at 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. The worker's report is `state/consults/2026-10-22-b1-shell-half-pr-a-worker-report.md`, cited by its D numbers. Code at the head is not on main, so it is cited by path and symbol, with commit 37b9d756. §7 is not edited, and no file joins §2.6. Nothing below is a quotation.*

1. **D1 (class 8).** By §7's command over `55618ab5...37b9d756`, `frontends/shell/src/style/document.ts` counts 7 lines against its ceiling of 6 (the worker's report, its §7 table and D1). The overrun is the four-line bullet of Amendment 2 item 2 (c). It is recorded here as class 8, and §7 is not edited. A-P stays under its total.

2. **D2, and the canvas's new callback (class 1; a code change before the gates).**
   - **The reading.** §2.2 (b) does not say whether the option is required. Amendment 3 item 5's "no defaults" reading of §8 item 13 covers every option and prop that PR A adds to carry the projection or what follows from it. At the head:
     - An absent `columns` that sends `null` is a code path only tests take. App passes the option at both construction sites: `startCandidateArmSession` and `new ViewportStreamManager` in `frontends/shell/src/App.tsx`.
     - The same holds for an absent `onAttributesNotHeld`.
     - The tile manager's required `columns` is the form to follow.
     - A forgotten option would fail loudly, not silently: the canvas decodes with the open's set and refuses an empty batch through `UnexpectedProjectionError`. So this row rests on §8 item 13, not on §5.
   - **The change:**
     - `frontends/shell/src/streaming/viewportStreamManager.ts`: the option becomes `columns: string[] | null` (required). The `viewportQuery` call passes `this.opts.columns`, and the doc comment says the option is required with no default, as the tile manager's is.
     - `frontends/shell/src/residency/candidateArmSession.ts`: `CandidateArmSessionDeps.columns` becomes required. The tile manager's option and the first look's sixth argument both pass `deps.columns`.
     - `frontends/shell/src/canvas/WorkingCanvas.tsx`: `onAttributesNotHeld` becomes required.
     - `frontends/shell/src/streaming/viewportStreamManager.test.ts` and `frontends/shell/src/residency/candidateArmSession.test.ts`:
       - add `columns: null` at each construction site that passes no `columns`;
       - update the two PA-U7 recorded-mutation comments to `this.opts.columns` and `deps.columns`. The mutations stay the same.
     - `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` needs no fill. Its base props are a cast (Amendment 3 item 6), so its diff stays within the four fill forms.
   - **I1.** At the head, `new ViewportStreamManager(` and `startCandidateArmSession(` occur only in the two test files above, in `App.tsx` and in `candidateArmSession.ts`. `<WorkingCanvas` is rendered only in `App.tsx` and in the wiring test. So `tsc` needs no file outside the list.
   - **§7.**
     - The three product files stay within their ceilings: 20, 30 and 80.
     - The two test files will pass their per-file ceilings of 40 and 60. That is class 8, counted by §7's command at the gate head and recorded in the closing amendment. §7 is not edited, and A-T stays under its total.
     - The PA-U7 mutations are observed again at the new head (§9).

3. **D3 (class 1).** The status item shares the existing `status.residency` slot. That is "a status item" under §2.2 (d). A slot of its own would need `frontends/shell/src/layout/contributions.ts`, which is outside §2.6 (I1). Accepted.

4. **The status item's claim (Correctness, class 1; a code change before the gates).**
   - **The defect.** At the head, App sets the item on the canvas's first not-held report and clears it only when the next dataset opens (`attributesNotHeld` and the `status.residency` entry in `frontends/shell/src/App.tsx`). Its text, `ATTRIBUTES_NOT_HELD_TEXT`, states a present state. That is untrue once the not-held batches have been let go (evicted or superseded) while the item still shows.
   - **Ordinary use reaches it.** 268,435,456 bytes over 2,000,000 resident points is about 134 bytes of copied attribute data per row. This is arithmetic from the two declared constants in `frontends/shell/src/canvas/limits.ts`, not a measurement.
   - **The words.** These are a P6 placeholder, not the human's wording. The worker applies them and the PR body lists them. `ATTRIBUTES_NOT_HELD_TEXT` becomes:
     `[P6 placeholder] Some features' attributes were not held since this dataset was opened: the resident attribute limit was reached.`
   - **Each clause checked at the head:**
     - "were not held": the `onAttributesNotHeld` handler fires only when `withinAttributeCeiling` returns a not-held batch (`withinAttributes` in `WorkingCanvas.tsx`).
     - "since this dataset was opened": the state is keyed to `admitted.dataset`, and a new open mints a new handle. The App test for the status item asserts the clear.
     - "the resident attribute limit was reached": `withinAttributeCeiling`'s condition.
     - The text still contains `not held`, so that test's assertion holds.
   - **Not covered, named for the source comment:** the baseline arm, which only a dev switch selects, reports before the vertex-ceiling check. A batch that this check then refuses can still set the item.
   - **§7:** a few lines of `App.tsx`, within 150.

5. **D4 (class 1).** Accepted. The throw in `TileResidentSet.addBatch` (`frontends/shell/src/canvas/tileResidentSet.ts`) refuses a state that no product path builds (Amendment 3 item 3). Without the guard, a second dedupe would write `rows[dst] = srcIdx` over an already-mapped block: a silent wrong value, which is what §5's falsification and ADR-010 rule 2 exist to prevent. It adds no behaviour that a caller selects, unlike row 2's defaults. It is the same discipline as `decodeBatch`'s null-id refusal. Its test stays.

6. **D5 (class 1; no defect).**
   - Every engine envelope is built by `build` (`engine/src/envelope.rs:110-117` @ 728684220a3080d180b48878e93d909daca1db5b sha256:56f65ca5a52c97456c4103debdf3681ed06493b6912f5f8fa14ff6a0dfa9013b). `build` writes `attribute_columns` without a condition, `[]` when nothing is projected (`engine/src/envelope.rs:242-251` @ 728684220a3080d180b48878e93d909daca1db5b sha256:fb992a0f1e3d7f0c6bb71c30ef0c324ea866a29e8818c4afaa71542b58437965).
   - The golden shows `[]` for the unprojected viewport stream (`engine/tests/data/golden/polygon-wire.golden:8` @ 728684220a3080d180b48878e93d909daca1db5b sha256:0bdca9f96d0328f85f797de54f32074ad534bf0ea1a306d8488b0139c74c43d4) and `["zone"]` for a projected one (`engine/tests/data/golden/polygon-wire.golden:34` @ 728684220a3080d180b48878e93d909daca1db5b sha256:8a3b1dd61e56bc91da04804d365e6488717fb4ab745d2736814a65144291c031).
   - A search finds the key in each of the five committed IPC fixtures that the shell tests read (`engine/tests/data/geoarrow/*.arrows`; binary, so no line).
   - No product batch lacks the key. Refusing a batch without it is §2.2 (c)'s "not exactly that list". The two hand-built batches in `frontends/shell/src/canvas/decodeBatch.test.ts` that now write `"[]"` match the engine's shape.

7. **D6, settled by the run (Evidence; a code change before the gates, class 1).**
   - **What happened.** At 37b9d756, PA-E1 failed twice for want of a hit (the tester's report, its PA-E1 lines). `pointsAroundCentre`'s estimate of the cells fell on rows 0 to 3 of the 23-by-22 grid. The oracle's five ids sit on rows 10 and 11.
   - **The fix, in `frontends/shell/e2e/attributes.mjs` only (A-E):**
     - `pointsAroundCentre` and `FIT_MARGIN_FRACTION` are removed.
     - The step finds features by §4's method: PA-E3's `candidatePoints`, `capturePixels` pixels that are each confirmed through `hoverIdAfterBarrier`.
     - From the confirmed hovers, it fits the screen position of a grid cell. Under the generator's placement, an id's column is `id mod 23` and its row is `floor(id / 23)`, so x is linear in the column and y in the row. The fit uses hovers whose ids differ in column and in row.
     - It then aims at the oracle cells' predicted centres, confirms each id through `hoverIdAfterBarrier` before the click, and zooms in a notch at a time (as `distinctFeatures` does) if those points answer nothing or are below the pick resolution.
   - The generator and the oracle are unchanged, and §3 stands.
   - **What the fixed step must show:**
     - at least two of the oracle's ids reached by click, 242 (the NULL `zone`) among them;
     - for each, the Feature tab's id equal to the hovered id;
     - the six projected names in declared order;
     - every value equal to the oracle's, the NULL shown as the marker;
     - `d32` named in the not-projected line;
     - no not-held line;
     - the reached ids and the hover count printed on the PASS line.
   - **Still to come.** H1 and H7 are discriminated by that pass, and PA-E1's mutation is observed on it.
   - **Evidence, not Authority.** In the oracle the generator wrote to PR A's worktree (gitignored), all five ids carry an `i64` whose magnitude is over 2^53. So any oracle id the step reaches exercises §3's prediction about 64-bit values. D-report's list of three understates this.

8. **D7 (class 1).** `frontends/shell/src/App.attributes.test.tsx` uses the stand-ins of `App.workspace.test.tsx`: the SKP client, the baseline manager and the WebGL canvas.
   - Nothing on I5's list is mocked.
   - In PA-R2, everything from decode to the tab is real.
   - The manager's own passing of `columns` is PA-U7, against the transport mock.
   - The shipped arm's App wiring (the candidate session) is proven only end to end, by PA-E1 and PA-E3.
   - For this file, §4's "transport boundary" is read to include those platform stand-ins.

9. **D8 (class 1).** Four tests at 37b9d756 have no §4 row and no recorded mutation. Each discharges nothing:
   - in `frontends/shell/src/App.attributes.test.tsx`: the test titled `PA-A1: hands the open's projection set to the manager and to the canvas`, and the test titled `shows a status item when the canvas keeps a batch without attributes, and not for the next open`;
   - the row-map refusal test in `frontends/shell/src/canvas/tileResidentSet.test.ts` (row 5);
   - `displayValue`'s case with no projection in `frontends/shell/src/attributes/values.test.ts`.

   PA-A1 is this amendment's name for the first test.

10. **D11 (class 1).** Part AC carries §9's rows 0, 1, 2, 9, 10 and 11, numbered as §9 numbers them. Rows AC3 to AC8 are left for PR B (3 to 5) and PR C (6 to 8). AC10 covers PR A's strings, and each later PR names its own strings in its rows.

11. **D9, D10 and the count (class 3).**
    - The report counts 16 mutation runs. The transcript shows 15, as the custodian's filing note states: thirteen tests, with PA-U7's three counted apart. The observations are those 15 runs at 37b9d756.
    - D10 needs nothing.

12. **§8 at the head, item by item (class 1).**

| Item | Reading at 37b9d756 |
|---|---|
| 1, 2 | Met, by the worker's file list and empty lock diff. The reviewer confirms from the diff. |
| 3 | Met: no command, field or literal is added. |
| 4 | Met. `data` is indexed only in `readRow` (`frontends/shell/src/attributes/values.ts`), and `rows` is written in `addBatch`'s `keepIdx` loop. |
| 5 | Met: `readCell` makes every integer a `bigint`. |
| 6, 7, 10, 11 | Not applicable to PR A. |
| 8 | Met. `projectionFor` returns `null`, never `[]`, and reads only `projectable`. |
| 9 | Met: `displayValue` shows the marker for a NULL. |
| 12 | Met: no "undo" in the new product text that was read. |
| 13 | Not met at the head: row 2. |
| 14, 15 | Met. The new strings are P6 placeholders stating the shell's own facts. Row 4 is about truth, not ownership. |
| 16 | Met. |
| 17 | The request fixture is met (PA-U2), and the rebuild seam is met (PA-U8 to PA-U10, from the real decode). The decode of a real engine batch with projected columns is shown by PA-E3's pass at 37b9d756 for a `Utf8` column. PA-E1 failed for want of a hit (row 7), so the multitype columns are Evidence, pending. |
| 18 | D1 is recorded as class 8 (row 1), and §7 is not edited. This amendment adds no scope. The observations are not `verify-mutation` runs. Test text here is named with its commit. |
| 19 | Nothing is quoted. |
| 20 | No OPEN-16 code. The 1c-shared files are edited under OPEN-17 (b) (Amendment 1 item 4). |

   ADR-023 §11 item 3: `isReadableAttributeType` admits nothing. `projectionFor` alone chooses, from `projectable` only. The check refuses to read a column type the shell's reader lacks. Read so; see what could not be settled, item 2.

13. **KNOWN-LIMITATIONS item 51 (Documentation, must-fix before the merge; a draft, not the human's wording).**
    - **Why it must change.** At the head, the item says the status bar reports that some attributes "are not held", and also that "they come back". With row 4, the item says instead:

    ```
    51. **Attributes are not held for features loaded once the map holds 268,435,456 bytes of attribute data.**
        The Feature tab shows the attribute values read for the feature you click. The map holds at most 268,435,456 bytes (256 MiB) of attribute data in all, over every batch of features it keeps. A batch that would take it past that keeps its shapes without its attribute values; this limit drops nothing from the map and refuses nothing. Clicking a feature of such a batch shows that its attributes are not held, and from then until the next dataset is opened the status bar says that some features' attributes were not held. A batch the map loads again after letting it go is read again under the same limit.
    ```

    - **Each clause checked at the head:**
      - "read for the feature you click": `resolveClickPick` calls `readRow` at the click, and the result is carried to `inspected.row`.
      - "at most … over every batch it keeps": `residentAttributeBytes` over the active set's `getBatches()`, in `pushBatch` and `pushTileBatch`.
      - "keeps its shapes … refuses nothing": `withinAttributeCeiling` returns the batch marked `"not-held"`, with no throw.
      - "shows that its attributes are not held": `NOT_HELD_TEXT` in `frontends/shell/src/feature/FeatureTab.tsx`.
      - "until the next dataset is opened … were not held": row 4.
      - "read again under the same limit": every push decodes and calls `withinAttributes`.
    - **Not covered (for the source comment):** the dev-only baseline arm's early report (row 4).

14. **The `status.residency` slot's comment in `frontends/shell/src/App.tsx` (Documentation, must-fix; not the human's wording).** Append this sentence:

    `The attributes-not-held item (milestone 4 PR A, section 2.2 (d)) shares this slot: the canvas's onAttributesNotHeld report sets it, and it stays until the next dataset is opened.`

    Clause check: the report sets it, through the handler passed to `WorkingCanvas`; it stays until the next open, row 4.

15. **PA-E3's mutation (class 1, conditional).**
    - PA-E3 passed at 37b9d756: its unfiltered clicks showed three different zones (the tester's report, its PA-E3 line). The run stopped at PA-E1, so neither e2e mutation was observed.
    - Under `readRow(candidate.batch, 0)`, every row of the filtered half is `residential`. The unfiltered half catches the mutation only if the six features it clicks share batches whose row 0 shows one zone.
    - If the tester's observation at the next head shows the mutation surviving, PA-E3 as written is an Evidence failure. The fix, inside `frontends/shell/e2e/attributes.mjs` and A-E: each unfiltered id's zone is read again under the filter `id = N`, where its batch holds that one row, and the two must match.

16. **Next, in order.**
    1. Rows 2, 4, 7, 13 and 14, by one worker on PR A's branch.
    2. After #243 merges, main is merged into the branch, and Amendment 2 item 5's sentence is applied to `buildLayers.ts`. PR A does not merge before #243 (Amendment 2 item 10).
    3. **The tester, at that head:**
       - **(a) The fixtures, before the merge.** The generator exists only on the branch, and writes under its own worktree. The suite reads `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\`. So the generator is run at the head in PR A's worktree, and its two files are compared by sha256 with the shared folder's copies. Those copies are the ones the 37b9d756 run placed there and recorded in the tester's report.
       - Row 7 leaves the generator unchanged, so a later head must reproduce both recorded hashes, and the shared copies stand. A different hash is a stop, reported before any suite runs (§3). It is not a replacement.
       - After the merge, the generator runs from the main checkout into the shared folder, under the same rule.
       - **(b) The runs.** Every e2e suite, plus `e2e:attributes`. The fixtures are checked by hash before and after. Both e2e mutations are observed: H2, H1, H7, PA-E1 and PA-E3.
    4. The architect's and reviewer's gates at that head. The PR body states that round 8's exemption closes at PR A for B1's non-null path (§2.2 (b)), and lists the words applied from rows 4, 13 and 14.

Read the last amendment first.

Nothing above is edited.

## Amendment 5: the human's OPEN-16 (b) and their reading of OPEN-17 (b) (class 5), with `tableSource.ts` joining PR B (class 9), written before PR C's and PR B's code

*Written by the custodian on the human's message. References only: `state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md`, item 3; OPEN-16 and OPEN-17 above; Amendment 1, items 3 and 4.*

1. **OPEN-16 (b):** PR B builds its colour cases from one bounded first-scope query through PR C's `tableSource` and its single stream, as option (b) states, and §2.3 (d)'s source binds so. The PRs run in the order A, C, B. KL-3 is the human's line under OPEN-7, as given.
2. **Class 9, recorded before PR B's code:** `frontends/shell/src/table/tableSource.ts` joins PR B's list (§2.6, its conditional entry) with 30 lines in B-P, as §7 names under OPEN-16 (b). §7 is not edited.
3. **OPEN-17 (b)** stands as Amendment 1, item 4 records it. In the human's reading it changes nothing of 1c's order.
4. **Next:** PR A waits for #243 (Amendment 4, row 16). PR C's and PR B's dispatch amendments are drafted ahead by the architect, each re-swept at its own base before its code.

Nothing above is edited.

## Amendment 6: PR A's closing record, written after its gate 1 results were seen. Four per-file overruns are class 8; two readings are class 1; one item stays open.

*Written by the custodian after PR A's gate 1 reports were seen, at PR A's final head 0ed4b305b6e5573355ce0610f9227a7d03a806f6. References only, and nothing below is a quotation. The reports are `state/consults/gates/2026-10-23-b1-shell-half-pr-a-gate1-architect.md` and `state/consults/gates/2026-10-23-b1-shell-half-pr-a-gate1-reviewer.md`; the words applied are `state/consults/2026-10-23-b1-shell-half-pr-a-gate1-words-reconciled-architect.md`. §7 is not edited.*

1. **Class 8,** by §7's command over `c1f782db29c3ce4b2fd3b8954966494a21679b71...0ed4b305b6e5573355ce0610f9227a7d03a806f6`: `frontends/shell/src/style/document.ts` 7 of 6 (Amendment 4 row 1); `frontends/shell/src/canvas/buildLayers.ts` 7 of 6 (Amendment 2 item 5); `frontends/shell/src/streaming/viewportStreamManager.test.ts` 88 of 40 and `frontends/shell/src/residency/candidateArmSession.test.ts` 149 of 60 (Amendment 4 row 2). No other file passes its ceiling, and no group passes its total.
2. **Class 1:** PR A rewords the `feature.inspect` statement in `frontends/shell/src/console/surfaceRegistry.ts`, a file §2.6 lists, as an exception to §5's declared-unchanged strings. It is a P6 placeholder, for sight at Part AC row AC10.
3. **Class 1:** Amendment 2 item 2 (a)'s joined run is read with the whitespace after the comment marker also removed. Read so, its self-test at 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f is positive, and every pattern is zero at 35085072824b5bcd657c37e3ca1603cbb1693e93 under both readings (the reviewer's gate 1 report, What I checked, item 5).
4. **Open:** LargeUtf8 and Utf8View (`state/consults/2026-10-22-b1-shell-half-pr-a-amendment-4-architect-draft.md`, What I could not settle, item 2).

Read the last amendment first.

Nothing above is edited.

## Amendment 7: PR C's re-sweep at C e7eb8f2e and its base series at a533a598, written after both results were seen. No invalidator. Rows 8 and 13 are moved cites, and row 18's number and §2.6's count are corrected (class 3). Four product files, five test files and thirteen fill files join PR C's list, and the first scope's held bytes are bounded under ADR-010 rule 6 by a declared ceiling, at which the first scope stops and its line says so, on the human's ruling of 2026-10-24 (class 9). The base series, the readings, the Part rows, the numbers 54 to 56 and rule (00) are class 1.

*Written after PR C's re-sweep and its base e2e series were seen, before any PR C code. Drafted read-only by the architect at main 858092e340ac650822afea87b50b3ce00e50bd40 (`state/consults/2026-10-23-b1-shell-half-pr-c-dispatch-amendment-architect-draft.md`, item 1), from its PR C draft drafted ahead (`state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md`, PR C part); item 5 and the lines that depend on it redrafted read-only at main 4de4b9a91837a4faa181e8f1e8b6260158db665d (`state/consults/2026-10-24-b1-shell-half-pr-c-amendment-7-table-ceiling-redraft-architect.md`). References only; nothing below is a quotation, and none of it is the human's wording. Item 5's value and behaviour rest on the human's ruling of 2026-10-24 (`state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md`, item 2), restated in the architect's words. The re-sweep is `state/consults/2026-10-23-b1-shell-half-pr-c-re-sweep.md` (its sha256 from line 5 c4c4f1db3c1ca1a7550320ca8fc849112b0b079343c5f91bec19fb31185d0bb2), at C = e7eb8f2e98c4dcb033161573f8b8fa312169d70d. The base series is `state/consults/2026-10-23-b1-shell-half-pr-c-base-series-tester-report.md` (its sha256 from line 5 4ae2519fbe32648839bd0501df84d891f818a68b2bf0ae46433268de7e851c63), run at a533a598e4e139e2fbd2793ded328472cc977036 (by script, the 20 files of `git diff --name-only e7eb8f2e98c4dcb033161573f8b8fa312169d70d a533a598e4e139e2fbd2793ded328472cc977036`, every one a record: `CUSTODIAN-QUEUE.json`, `CUSTODIAN-QUEUE.md`, `PLAN.yaml`, `frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md`, `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`, `scripts/hooks/FLUSH-CRLF-FIELD-REWRITE-PREREGISTRATION.md`, `site/data/plan.json`, `site/index.html`, `state/CUT-STATE.md`, `state/consults/2026-10-23-b1-shell-half-pr-c-re-sweep.md`, `state/consults/2026-10-23-bundle-redaction-scan-not-in-product-publish-e-words-worker-report.md`, `state/consults/2026-10-23-bundle-redaction-scan-not-in-product-publish-main-merge-worker-report.md`, `state/consults/2026-10-23-bundle-redaction-scan-not-in-product-publish-r1-tester-report-3.md`, `state/consults/2026-10-23-bundle-redaction-scan-not-in-product-publish-r1-tester-report-4.md`, `state/consults/2026-10-23-covering-case-collision-binds-other-column-full-form-revised-lead-data-draft.md`, `state/consults/2026-10-23-flush-crlf-field-rewrite-correction-1-worker-report.md`, `state/consults/gates/2026-10-23-bundle-redaction-scan-not-in-product-publish-e-scoped-reviewer.md`, `state/consults/gates/2026-10-23-flush-crlf-field-rewrite-gate2-architect.md`, `state/consults/gates/2026-10-23-flush-crlf-field-rewrite-gate2-reviewer.md`, `state/gate-log.json`). Every pin at 4b26d279, 55618ab5, c6de9b48, 0ff8db4e, 72868422 or e6dfe624, and every fact of 507197c1, is historical (§0.3). For PR C's work the tree at C is authoritative, and at the code's base the tree at that base. The scope addition rests on the cross-module seam rule (RULED 2026-09-16, question round 4) and on §2.6's last paragraph (round 25, item 2 (a)). §7 is not edited.*

1. **The re-sweep at C (§0.3).** By the re-sweep's step 1, rows 1 to 7, 9 to 12, 14 to 17 and 19 are Same. I4 does not fire.
   - **Row 6.** No `ResidentBatch` rebuild site exists in product code beyond `trimBatchToVertexBudget` (`tileIngest.ts`) and `TileResidentSet.addBatch` (`tileResidentSet.ts`), plus `withinAttributeCeiling`'s spread (`limits.ts`).
   - **Row 7.** The product callers of `.pushBatch(` and `.pushTileBatch(` are `App.tsx` and `candidateArmSession.ts` only.
   - **Row 8, moved (class 3).** §2.4 (e)'s App pin and §0.2's two arm pins are at the lines that row names at C, and their bytes are identical. The `projection` memo is `projectionFor(admitted.describe)`.
   - **Row 13, moved (class 3).** §0.2's and §2.4 (e)'s tile-manager comment pins are three lines later at C, and their bytes are identical. The comment still calls the class composition-unreachable, so §2.4 (e)'s restatement stands as written.
   - **Row 18 (class 3, tree authoritative).** The highest KNOWN-LIMITATIONS item at C is 52, not 46.
   - **The pins (class 1).** The re-sweep's step 3 recomputes all 138 of the form's pins at their own commits, and all 138 match.
     - In PR C's sections, 10 pins are Changed at C. Each one is PR A's own merged edit, declared by Amendments 2 to 4, and rows 1 to 7 read the interfaces that result. Reading: a §0.2 interface that PR A changed as this form declares is the base's interface, not I4.
   - **The fixtures (row 17).** The three named fixtures hash equal to the records.
     - #241's branch changes `engine/src/fixture.rs` only by adding `write_zone_texts`.
     - `MultiType` and `write_geoparquet` are untouched.

2. **§2.6's count (class 3).** §2.6 says PR C has 31 files, but its list names 30: 19 product, 10 test and 1 e2e (the re-sweep's step 2). The 19 existing files are present at C. The 11 declared-new files are absent, and no `src/table/` path exists.

3. **Scope addition (class 9), declared before any of its code.**
   - **Why.** `ResidentBatch.filter` (§2.4 (c)) is required, under Amendment 3 item 5's reading and its item 11's forward note. The filter can reach a batch and a selection member only through files outside §2.6's PR C list:
     - the canvas's decode and push site, `WorkingCanvas.tsx`;
     - the two rebuilds (row 6);
     - `clickEffect.ts`, whose Select branch builds `selection.apply` (the re-sweep's row 5).
   - **Confirmed at C.** All 22 paths below are present at C (the re-sweep's step 2, last bullet), and rows 6 and 7 find no further site.

   | Group | Files (ceiling each) | At most |
   |---|---|---|
   | C-P, added | `frontends/shell/src/canvas/WorkingCanvas.tsx` 40, `frontends/shell/src/canvas/tileIngest.ts` 4, `frontends/shell/src/canvas/tileResidentSet.ts` 4, `frontends/shell/src/feature/clickEffect.ts` 10 | 58 |
   | C-T, added | `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` 60, `frontends/shell/src/canvas/tileIngest.test.ts` 40, `frontends/shell/src/canvas/tileResidentSet.test.ts` 40, `frontends/shell/src/feature/clickEffect.test.ts` 50, `frontends/shell/src/canvas/clickPick.test.ts` 40 | 230 |
   | C-T, fills | `frontends/shell/src/canvas/buildLayers.test.ts` 12, `frontends/shell/src/canvas/highlightLayers.test.ts` 6, `frontends/shell/src/canvas/pick.test.ts` 10, `frontends/shell/src/canvas/residentSet.test.ts` 4, `frontends/shell/src/attributes/values.test.ts` 4, `frontends/shell/src/canvas/limits.test.ts` 4, `frontends/shell/src/feature/FeatureTab.test.tsx` 4, `frontends/shell/src/App.command.test.tsx` 4, `frontends/shell/src/App.selection.test.tsx` 4, `frontends/shell/src/App.attributes.test.tsx` 4, `frontends/shell/src/workspace/scope.test.ts` 4, `frontends/shell/src/workspace/viewTransitions.test.ts` 6, `frontends/shell/src/layout/StudioLayout.test.tsx` 2 | 68 |
   | **Added** | | **356** |

   - **PR C's new totals:** 52 files, and 3,840 + 356 = 4,196 lines. These are counted by §7's command, and an overrun of a file or a group is class 8.
   - **The fill forms.** Each fill takes one of these forms, and each is true of its fixture, which is streamed with no filter:
     - `null` as `decodeBatch`'s seventh argument;
     - `filter: null` in a `ResidentBatch` or click literal;
     - `row: null, filter: null` in a `selection.apply` literal;
     - `"activity.table": null` in a slots record.
   - **A fill outside the list,** or any edit that `tsc --noEmit` needs outside §2.6 and this item, is I1. It is recorded by class 9 before its code, as Amendment 3 did.
   - **Risks.** `decodeBatch.test.ts` and the three managers' tests take the new argument at every call. PR A overran two of the same managers' test files (Amendment 6 item 1). An overrun is class 8, and §7 is not edited.

4. **Readings (class 1).**
   - **The filter is `decodeBatch`'s required seventh parameter,** beside `streamHandle` and `batchSeq`, so every member is set in the decode call, as `projection` is.
     - Each manager's `onBatch` carries the filter its stream was issued with.
     - `pushBatch` and `pushTileBatch` take that filter and pass it to `decodeBatch`.
     - The two rebuilds carry it as the same object, and `withinAttributeCeiling`'s spread carries it with no edit.
     - With the parameter required, `tsc` finds every caller, `tableSource.ts` included.
   - **`candidateArmSession.ts`.** §2.6 lists it among PR C's three managers, and also says `residency/` is not edited beyond the first look's argument. For PR C, the line is read as: no change to residency planning, budget, retry or lifecycle. The session's only edit carries the stream's filter from its `onBatch`, and from the untiled sink, to `pushTileBatch`. Any other edit there is I1.
   - **Selection members.**
     - `SelectionMembers` values become `{bounds, row, filter}`, and `unionOfBounds` and `countSelection` read `.bounds`.
     - The assertion at `frontends/shell/src/workspace/selection.test.ts:62` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:1de349b2408c94f4823fca182e315af801201d80547986a874fbeee2f71ee389 keeps its claim; only its access path changes.
     - `FeaturePanel.tsx` and `workspaceState.ts` are not edited.
   - **`CAPTURED_ROW_MAX_BYTES` lives in `table/tableConstants.ts`, which imports nothing.** `workspace/selection.ts` may import it: UA6 forbids only React, `skp/client`, `streaming/`, `residency/` and `canvas/` (`frontends/shell/src/workspace/workspaceBoundary.test.ts:28-32` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:7666d10fc949cfaecde25aa169501bb9a87d2362a0290cff2751b7b63b693d00). The cut is pure, and it happens in `selection.ts` when a member is added.
   - **`tableSource.ts` decodes through the real `decodeBatch`,** with the open's geometry column, encoding and projection. It keeps `ids` and `attributes`, and walks the geometry and drops it, with no figure claimed (OPEN-2 (b)). Its `limit` is `encodeDecU64(BigInt(TABLE_MAX_ROWS))`.
   - **The second scope's second test** (an id in a resident batch streamed under the view's filter) uses one `WorkingCanvas` handle method. Its product caller is `tableScope`, through App.
   - **Nothing for PR B lands in PR C.** `tableSource` has the Table tab as its only product caller. Round 8's producer exemption is not invoked.

5. **The first scope's held bytes (class 9, on ADR-010 rule 6: capacity ceilings are declared, not discovered; the value and the behaviour are the human's ruling of 2026-10-24, item 2, restated here in the architect's words).**
   - **The gap.** The first scope's copied attribute bytes have no declared ceiling, and they are not in `RESIDENT_ATTRIBUTE_MAX_BYTES`'s sum, which covers the canvas's active set only. The engine bounds each batch, not the sum over up to 1,000 rows' batches.
   - **The ceiling.** `TABLE_MAX_ATTRIBUTE_BYTES` = 67,108,864 (64 MiB), declared in `table/tableConstants.ts` beside §7's table constants. Its doc comment states the derivation: 1,000 rows (`TABLE_MAX_ROWS`) × 32 columns (`ATTRIBUTE_PROJECTION_MAX`) × about 2 KiB a value. The value is declared, not measured. Its measurement is the PLAN node `table-max-attribute-bytes-measurement`, before any performance claim. The comment's words are the architect's (the redraft consult, section 1 of its changes), applied by the worker and listed in the PR body.
   - **What it sums.** The `attributes.bytes` of each batch the first scope has added, as `RESIDENT_ATTRIBUTE_MAX_BYTES` sums them for the canvas; a batch with `attributes` null adds 0. The sum is per result: a superseding stream starts it at 0. `tableSource` does not call `withinAttributeCeiling` and holds no `"not-held"` batch.
   - **Its behaviour: the first scope stops adding rows, and its line says so.**
     - **Adding rows** is `tableSource` appending each decoded batch of its one stream, its ids and values, to the result, in arrival order.
     - **Where it stops.** Before appending a batch, the source adds that batch's bytes to the sum held. If the total would pass the ceiling, the batch is not appended. A total equal to the ceiling is within, as `withinAttributeCeiling` reads it. The source then cancels its stream through the client's `cancel`, as Cancel does, and appends no later batch of that stream.
     - **What it keeps and shows.** Every row of the batches appended before the stop, with its values, in arrival order. The batch that would pass is decoded before the check and released, so the result holds at most the ceiling.
     - **What it says, and where.** The stopped line below shows in the count line's place, and the liveness line ends. No count line shows for a stopped result.
     - The stop is the source's own, not an operator action, so it records no class C row (§2.5).
     - Supersede, hide, collapse, open, replace, generation end, session end and `engine.source_changed` act on a stopped result as §2.4 (b) states.
   - **What else this changes in the first scope.**
     - **Not-held:** the first scope has no not-held state, and no table row is marked not-held. The canvas's not-held marking (§2.2 (d)) is unchanged.
     - **The count line:** §2.4 (b)'s two lines stand for a result that ends Completed. The stopped line is a third, for a stopped result.
     - **The ids:** a stopped result holds the ids of the rows it shows, and only those. For §2.4 (c), a stopped result is not complete. A member whose id it lacks is counted not established (P6), never failed. A member whose id it holds passes, by §2.4 (c)'s third case.
     - **PR B:** nothing for PR B lands in PR C (item 4). PR B's cases query through `tableSource` meets the same stop, and PR B's amendment states what follows.
   - **The stopped line** (a P6 placeholder in the architect's words, not the human's wording; sighted at Part row AC7):
     `[P6 placeholder] The table stopped adding features: the next ones returned would have taken its attribute data past 64 MiB. Showing the first ${n} features returned, in no declared order; more may pass the filter.`
     - "stopped adding features": no batch is appended after the one that would pass. "Features" is plan §3's label for the table's rows (§2.4 (a)).
     - "the next ones returned would have taken its attribute data past 64 MiB": the batch the stream returned and the source did not append. "64 MiB" is written from `TABLE_MAX_ATTRIBUTE_BYTES`.
     - "the first ${n} features returned": `n` is the rows held, in arrival order.
     - "in no declared order": the query has no sort (§2.4 (b)).
     - "more may pass the filter": the stream is cancelled before its terminal.
   - **Files.** No file is added: `tableConstants.ts`, `tableSource.ts`, `TableTab.tsx`, `tableSource.test.ts` and `tableScope.test.ts` are on §2.6's list, inside their §7 ceilings.

6. **Tests, e2e and fixtures.**
   - **The standing rows.** §4's PC-U1 to PC-E4 stand. `tableSource.test.ts` builds its batches with `testUtils/attributeBatchIpc.ts` and mocks only the transport; mocking `decodeBatch` is I5.
   - **New rows.** Each mutation is observed as §4 states: apply it, run the named test, record its failure by name with the commit, and revert. No `verify-mutation` run is an observation.
     - **PC-U7** (`WorkingCanvas.wiring.test.tsx`): a batch pushed through `pushBatch` and through `pushTileBatch` under filter F is resident with `filter` F. Mutation: the push passes `null`; fails.
     - **PC-U8** (`tileIngest.test.ts`): the trim carries `filter` as the same object. Mutation: the literal writes `null`; fails.
     - **PC-U9** (`tileResidentSet.test.ts`): the duplicate drop carries `filter`. Mutation: the same; fails.
     - **PC-U10** (`clickEffect.test.ts`): a Select click on a feature carries `row` and `filter` into `selection.apply`, and the reducer keeps them on the member. Mutation: the Select branch sends `filter: null`; fails.
     - **PC-U11** (`clickPick.test.ts`): `resolveClickPick` carries the candidate batch's `filter`. Mutation: `null`; fails.
     - **PC-U12** (the three managers' tests, in PA-U7's shape): every `onBatch` carries its stream's filter, the first look included. Mutation: the first look passes `null`; fails.
     - **PC-U13** (`tableSource.test.ts`): batches are decoded by the real `decodeBatch` from the helper's IPC, and the test reads each batch's `attributes.bytes` from its decode. The first k batches sum within `TABLE_MAX_ATTRIBUTE_BYTES`, and the next one passes it. The result holds exactly the first k batches' ids and values, in arrival order. The source cancels its stream once, and a batch delivered after the stop is not added. The stopped line shows with `n` equal to the rows held, and no count line shows. Mutation: the sum omitted, each batch checked alone; fails.
     - **PC-U14** (`tableScope.test.ts`): a stopped first-scope result is not complete. A member whose id it lacks is counted not established, never failed. Mutation: a stopped result read as complete; fails.
   - **§5, declared unchanged:**
     - every existing assertion in `tileIngest.test.ts` and `tileResidentSet.test.ts`;
     - the trim's and the dedupe's choices;
     - `applySelectionMode`'s outcomes and `SELECTION_MAX_FEATURES`;
     - `countSelection`'s counts;
     - the layout reducer (§2.1).
   - **E2E.** PR C adds `frontends/shell/e2e/table.mjs`, one `e2e:table` script line and one `e2e/README.md` entry.
     - The tester's series at PR C's gate head is every suite at the base plus `e2e:table`, with PC-E1 to PC-E4's mutations observed.
     - It runs on the port-5400 harness under THE MACHINE paragraph (§9), with Amendment 2 item 4's harness corrections carried over.
     - No e2e step is designed to reach item 5's ceiling. PC-U13 and PC-U14 prove the stop from real decoded batches. The stopped line in any suite is a §3 prediction miss, class 2.
   - **Fixtures.** No new generator, and `kernel/tests/manual_walkthrough_fixtures.rs` is not edited.
     - PC-E1's oracle count is what `generate_the_filter_fixture` prints. The tester runs it into its own folder and checks that its file's sha256 equals the shared copy's, and the series report records both the count and the hash.
     - §3's "complete under one zone" prediction needs `residential`'s count to be below 1,000. A miss is class 2.

7. **The base series at a533a598 (class 1).**
   - **The suites.** Every one of the 15 `e2e:` scripts other than `e2e:debug` ended rc 0 on its first run, on an exe built at that commit. `e2e:residency-harness` was read by its exit code only. PA-E1 and PA-E3 pass, so H2 holds at the base.
   - **The scriptless drivers.** `pan-anchor.mjs`, `source-watch-idle.mjs` and `source-changed.mjs`'s default route pass. The post route ended rc 3 twice, with S5d INCONCLUSIVE and every other step passing. That is the result Amendment 2 item 9 records for PR A, so it is not I3.
   - **I6.** No `skp.projection_` line appears in any of the 20 runs' app stderr, so I6 does not fire.
   - **Fixtures.** All 34 files are hash-identical before and after. Nothing was regenerated, and the 5 GB fixture was not used.
   - **The one harness failure.** The first exe build failed because the shell's generated notice file did not yet exist, as in Amendment 2 item 4. A build is not a suite.

8. **The Part and the numbers.**
   - **The Part.** PR C's rows are AC6 to AC8, which are §9's rows 6 to 8 (Amendment 4 item 10), with PR C's new strings named in those rows.
     - Part AC's heading (`frontends/shell/MANUAL-WALKTHROUGH.md:1970` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:a95fc1fe8e74796d52df6b1f5a1c8ddd78529584ffd0c2328e1f343cc7e0e8e2) and its opening sentence (`frontends/shell/MANUAL-WALKTHROUGH.md:1972` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:574690e973a68488505dea77d170b067033bd90b65264a47e4e8ecb89d87df83) name PR A's rows only. PR C's records commit adds PR C to both.
     - The Part's fixture line gains `filter-zoned.parquet`, `100k-happy-path.parquet` and `slow-filter-scan.parquet`.
     - AC7 names item 5's stopped line, for sight as its text: no Part step is designed to reach the ceiling.
   - **KNOWN-LIMITATIONS: KL-1 is item 54, KL-2 item 55 and KL-5 item 56.**
     - Item 47 is #241's, items 48 to 50 are 1c's K-2 to K-4, and items 51 and 52 are PR A's (`KNOWN-LIMITATIONS.md:411` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:b4f07b8082142aba87d5ce0dad3a288886bf74baae30fb3800f114034578acda, `KNOWN-LIMITATIONS.md:415` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:e2ddec1bc1a34ca80c976b2283ff16e32a390eed52e90a09f8706c5f11225e6b).
     - Item 53 is held by covering-case's committed form: its Scope line (`engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md:6` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:37b5c3f5505f8ab7d3a79a0e9afa9bdcdee6f4aaeaadec19492ce7d7d899042b) and its section 4 (`engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md:88` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:eb9f6ac119f751add0d6a6c6e121fb5770c2cc139a8a21a83360c05009f0b32a). That piece stopped at H3 before any code (its Amendment 2), and its route is the human's. The number stays held until that route releases it. PR C's numbers do not move if it is released.
     - Unless item 53 stands directly above item 54 at PR C's KNOWN-LIMITATIONS commit, a line at column 0 goes before item 54 so that it renders as 54, as for items 42 and 44 (`KNOWN-LIMITATIONS.md:190` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:d858151dbabc620e4429a2cc6b262301e64599f96cf7878c56dd5daf45cf4382).
     - Item 54 also states item 5's ceiling and its stop, as one sentence in its paragraph and one clause in its source comment. The words are the architect's (the redraft consult, section 5 of its changes), a draft for the human's sight and not the human's wording.
     - The numbers are read again at that commit, against every branch in flight. A change there is class 3, with the tree authoritative.

9. **Rule (00) at C (class 1), by the re-sweep's step 5, file by file against PR C's 52 files and its records.**
   - **#241** (at 147ef82c at the re-sweep): `KNOWN-LIMITATIONS.md` only, for item 47, a separate path.
   - **#244, F7:** `frontends/shell/MANUAL-WALKTHROUGH.md`, Parts F and G only. Separate Parts are separate paths.
   - **1c's step 1** (at 7109aeb2): its diff from 43a39222 names no path under `frontends/`. Its version-literal sites are none of PR C's files. 1c's form records the OPEN-17 (b) interleave for PR C in its own Amendment 3, appended before PR C's code.
   - **port-2** (fb162627 at the re-sweep): its 16 declared files are at `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:b4768e57e2a86ae698295215d1538c0322b39d2b209f856b93f8ac09e053aeab, and none is under `frontends/`. Its KNOWN-LIMITATIONS edits are items 1 and 43.
   - **`cut/flush-crlf-field-rewrite`:** `scripts/hooks/` only.
   - **covering-case:** no branch commit. Its form's files are disjoint, apart from item 53 (a separate path).
   - **`record-step-style-match-widening`** is unplaced. PR C edits neither `skp/types.ts` nor `skp/client.test.ts`.
   - **No other `cut/*` branch ahead of main overlaps** (the re-sweep's step 5, last bullet).
   - **`protocol/`:** PR C touches none, and step 1 is its one piece.
   - **Before PR C's code,** each in-flight branch's `git diff --name-only origin/main...<branch>` is read again at the dispatch commit (#241 at 50c634a8, port-2 at 83d2ecef, and any branch moved since C), and the result is recorded in the PR body.

10. **§8 and §9.**
    - **§8 item 4** also covers a rebuilt `ResidentBatch` that drops or defaults `filter`.
    - **§8 item 11** also covers the stopped line: it claims no more than item 5 establishes, and a stopped result is never read as complete.
    - **§8 item 13:** the canvas's new handle method, and `TABLE_MAX_ATTRIBUTE_BYTES` with its check, have their product callers in PR C.
    - **§8 item 17** gains the filter seam, proved from the real decode by PC-U7 to PC-U12.
    - **The architect adds:**
      - no PR B hook in `tableSource`;
      - `candidateArmSession.ts`'s diff is only the filter argument (item 4);
      - item 5's ceiling and its stop are checked against ADR-010 rule 6 and the human's ruling of 2026-10-24, item 2: the derivation at the constant, the measurement node named, no performance claim, no not-held state in the table, and no row left out without the stopped line.
    - **The reviewer adds:**
      - `tsc --noEmit` clean at the head;
      - the thirteen fill files' diffs contain only item 3's forms;
      - the mutations of PC-U7 to PC-U14, applied again.

11. **Next.**
    1. 1c's Amendment 3 is appended (class 1).
    2. This amendment is pinned by script.
    3. `cut/b1-shell-half-pr-c` is brought to main at this amendment's commit, by a fast-forward or a merge, never a rebase. The PR body names §7's base.
    4. PR C's code, by one worker-high.
    5. The node's generation goes up by one.

**Superseded for PR C:**
- §2.6's PR C count: by item 2.
- §2.6's PR C list: added to by item 3.
- §0.2's and §2.4 (e)'s App and tile-manager pins: by item 1, rows 8 and 13.
- §7's PR C totals: read with item 3's additions, §7 unedited.
- §2.4 (b)'s terminals and count line: added to by item 5 (the stop and its line).
- §2.4 (c)'s complete result: read with item 5 (a stopped result is not complete).

Read the last amendment first.

Nothing above is edited.
