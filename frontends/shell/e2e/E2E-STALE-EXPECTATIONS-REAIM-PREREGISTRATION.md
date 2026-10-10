# E2E-STALE-EXPECTATIONS-REAIM — preregistration (full form)

Proposed path: `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`.

## Header

- **Authority.**
  - PLAN node `e2e-stale-expectations-reaim` [R1].
  - The human's additions of 2026-10-09, items 1, 2, 4 and 5 [R2, R3, R5, R6]. Their RULED block in `DECISIONS-PENDING.md` is the one headed RULED 2026-10-09 — additions. It is cited by that heading, never by line.
  - Item 3 [R4] is a separate node and is not part of this piece.
- **Drafted by:** the architect agent, alone, on the custodian's brief of 2026-10-09, at main a576ab3725d77a6f63afc8935cb572eca2cf2dec.
- **Base.** The branch is cut from main after PR #196 (the K6 fix) merges, per the slot order [R2]. `regression.mjs` is edited as #196 leaves it.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line, and states what it touches or invalidates.

## §0. Disclosure

**Inputs.**
- The triage of node `e2e-failures-present-at-the-base` [R7–R11]. Its finding: every step is a stale expectation, none is a stale fixture, and none is a product defect.
- The custodian's solo re-run of `e2e:console` [R12–R16]. It ran under the exclusive hold, unmodified, on the shipped default arm, at window height 800, at ac89e033. That commit's `frontends/shell/src` and `e2e/console.mjs` are identical to main's. In that run:
  - HEXLIM', REFUSAL' and GROUP' fail as the triage found [R12, R13, R14];
  - REGRESS' fails only through C2'/C3' [R15].
  - So REFUSAL' and GROUP' fail with the machine quiet as well.
- **PR #196's tree.** Read in its worktree, HEAD not verified.
  - The lines this piece edits in `regression.mjs` are the same there as at main: the `stepRefusal` helper [R32] and the C2'/C3' call [R34].
  - The constants above line 2340 sit one line lower in #196's tree.
  - No pin below is at a branch commit.

**Reuse index (the standing step).** `node tools/reuse.mjs`, run by the custodian in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c [R109]:
- no prior art for e2e, end-to-end test, console or playwright;
- candidates for identity (`engine-open-identity`, `stable-identity-copy-move`) and fixture (`real-world-line-test-files`, `geoparquet-conformance-files`). None is drawn on: every change here is a fresh write against this repository's own suites and generators. No port.

**Hypotheses, labelled.**
- **H1 (inferred from code, not observed).** On the shipped arm, each untiled stream's terminal writes a session-log line [R65], and every session-log line is a class-B console entry [R66].
  - So a line can be recorded between two of GROUP''s three calls, which would split their group.
  - The probe and the solo run both show the ×3 group forming [R9, R14].
  - Discriminator: GROUP''s own failure message lists the rows found between the three (§2.3).
- The REFUSAL' latency mechanism is not needed and is not claimed. The triage labels it an inference [R9].

**What the re-aimed source-changed route exercises.** KNOWN-LIMITATIONS item 26 [R71] (owed by [R70]) states that a symlink in the resolved path, repointed after admission, is not seen while idle and is caught at the next query's pre-check. This piece is the first e2e run of that statement, for a directory junction.

**Fixture drive.** Nothing is measured, and the 5 GB fixture is not read.

### §0.R References

Every hash was computed by the custodian over whole committed lines, LF bytes. One span per pin.

| id | reference |
|---|---|
| R1 | `PLAN.yaml:4351-4367 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:ad0a466cc863f6a4ce07ca657779269eca3cca072e492402bcf1f846a396a646` |
| R2 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:8-17 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:18950c04733fc4311a484a10b10cf88449a343b0b0c8c1754b3acbd22f6e246a` |
| R3 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:19 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:4fd1da0c960ba8c7861875f4d71f68b0631f0eb5678ad6c9b70b9f261943da30` |
| R4 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:21 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:b57de54493d353dcc4e4d914085c039debe5a61b6a6ea699e952db729bed722f` |
| R5 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:25-27 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:39c525d2ce19e2fe031247f8734337e5aeaa9c8aba500a23ebe72b563273ed8a` |
| R6 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:dc6bf46fc21f8f6cd3e6cb64b1fdec690aad6fd5b32be78300b9629a629efe78` |
| R7 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:29-69 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:c84369abbc12f0c6e68ebd2188b34f7202714dc126f0bff406a7f957b3f249ce` |
| R8 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:71-78 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:d4981e5a57d4586ba07714df29028338568b3db204cb8a5ca07b7cc9d53b115e` |
| R9 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:80-100 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:86b2129e6f161234c033f85ca9efe8bc46a13858833dd2299c411026100dd61a` |
| R10 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:102-105 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:2886faf52b9000a4d15aff81712c88e5483e4f91fea7be30cf21184ba3e34d3e` |
| R11 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:107-120 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:582da8d8edacc396d5ba127c409907c2e567b49d9bd5c3a7c665fd11cee5b698` |
| R12 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:8 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:ca8955ab1f554f9ff6bdb9f9c2636395590c386920c7ecb3e4d9e64e73cef46d` |
| R13 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:9 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:721bfeddaa739468fa5cdf6ec848ce00f3afe38dfbe9caaba69a9c292ab5556f` |
| R14 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:12 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:a6627cbcde89a9a3b0c959c1dfe7c1fe112f6ac3eb3e52ddac811106f24f53b6` |
| R15 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:24 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:8a3e107d989a3fbf2cfb4cb359d5a5e182e622b350f145ce9118ed22dbd70366` |
| R16 | `state/drafts/e2e-stale-expectations-reaim-console-alone/README.md:3-5 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:9bac8dab83237798a039b536d457a43406360844e4f29220f7092fd26a52bd91` |
| R17 | `engine/src/dataset.rs:1666-1692 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:c463f6c9fc7bc81ed1676ceea9d918c4e4b8799ea94cad7ef8ad1f427e02202a` |
| R18 | `engine/src/identity.rs:149-153 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:28a68b00bbb25d41a8db11f43758147c37b773871174c1d6f1f200e059d56e8a` |
| R19 | `protocol/skp/tests/data/v0-describe-response-session-ordinal.json:31 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:947374cb464d97b1d83b0ccf54355eab38a62c39d5eb3c00b889a25da2ffc73c` |
| R20 | `docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:8f94f2d6ca945be6f3d213b793e153c6724eb9a61a7a273271a4767684bac1e8` |
| R21 | `engine/ADMISSION-PREREGISTRATION.md:67 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:8aed7e37a32e2303e351d42c3ff7996bd05e0c0da5ae554b0cb5e9118fef3ae2` |
| R22 | `frontends/shell/src/admission/DescribeSummary.tsx:44-45 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:ebf4f96ec8edd70879fed7e6d8006dcd7a6cde16e5bf376f092150b52e9eb6ba` |
| R23 | `frontends/shell/src/admission/DescribeSummary.tsx:65-70 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:c87049458e02a89cebe1810c305ff86d22b078487acaadf7cb23f5187007187f` |
| R24 | `engine/src/identity.rs:297-313 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:00334befa0cd36cbaab55c0af1041c8b0ecaf1ad888451639a42d3bc33f00a76` |
| R25 | `engine/src/identity.rs:322-344 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:094e022adbecebeda8af5f5c0a9563730be17f58ea5b163d2172e97887ca49b0` |
| R26 | `engine/src/fixture.rs:528-546 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:6e238c2fd780019496c0ff4d763799b03fcb7b68c33a420806cbbbbc5b71461f` |
| R27 | `engine/src/fixture.rs:621-627 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:083601d58327cf6aca46ee184414ccdc3076657d66f89d4392e84d900061f2cc` |
| R28 | `kernel/tests/manual_walkthrough_fixtures.rs:477-497 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:55ee61c2d9624f011b9c971abcbf09e7bcff048ae9080a53af083ef8de520cde` |
| R29 | `kernel/tests/manual_walkthrough_fixtures.rs:527-565 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:d83ab63bb800a76adc2a8c12a603883d88768535262a87fc36169c765f535f7d` |
| R30 | `frontends/shell/e2e/regression.mjs:60-61 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:19d3d169b509677ba9ad10af102b228f13f33389d7c26216b9bc96ed94977de7` |
| R31 | `frontends/shell/e2e/regression.mjs:106-110 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:8a49ef45d9d76aa0d6d75dbcab61d8aee5c8cb211c5502a2fdf964a7c285c493` |
| R32 | `frontends/shell/e2e/regression.mjs:2340-2390 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:9140ea093148b17d6bb305d043505f56d831be6304ffaa3e2ea6f059e29ab5f9` |
| R33 | `frontends/shell/e2e/regression.mjs:2474-2482 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:7c2473a6e76449ba160f1d9ad3d96c1310baab6a9b0458edabdfc8f686190234` |
| R34 | `frontends/shell/e2e/regression.mjs:2634-2644 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:b0d936df274ab123d6f01660e78408c26f949cf707a93d65da7b0df2196609f4` |
| R35 | `frontends/shell/e2e/regression.mjs:2550-2557 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:276d6f481cf6443ef2ac92f836f58a380418d599edf1e25bc836f620e1ad487e` |
| R36 | `frontends/shell/e2e/admission-remediation.mjs:50-65 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:9e37f7a793d13dbd588a6a4a7e920db43c089027648c57cca8a2ea687c871afb` |
| R37 | `frontends/shell/e2e/admission-remediation.mjs:74-78 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:6e717c57a77fa419d016f38ca74d6798bc6cc070265e3e656d15cc7605f3e8a7` |
| R38 | `frontends/shell/e2e/admission-remediation.mjs:404-435 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:209db993645705f4c52c9f606a4f5aa9a692afd493820c0e230f08c51f9cfb17` |
| R39 | `frontends/shell/e2e/admission-remediation.mjs:467-529 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:56fb1df3217fc84820bce92a4c8f87e79c3874343bc502d0cce70faf71888781` |
| R40 | `frontends/shell/e2e/admission-remediation.mjs:540-543 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:620d94adb07d2c649fbfbcfb5116641031a41ac7db5236f8862f734193ad3522` |
| R41 | `frontends/shell/e2e/admission-remediation.mjs:747-751 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:0e3b0add8b807a86b498d96940478f524dfcf94be99c3134e9fef75b4e092a89` |
| R42 | `frontends/shell/e2e/admission-remediation.mjs:809-811 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:16780ea1352cc6c5450b8ed6462acef2cd1cedc1a6583eb3abf4dc241b0d24a2` |
| R43 | `protocol/skp/SKP-V0.md:887-898 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:a031a8e6166fabb98589916b6d7c0d777b7b31b3e723bc470f10cb753179cd73` |
| R44 | `frontends/shell/src/skp/client.ts:113-123 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:0e5904fb26c271c95bf57d5d1e151e490a8fa6821fbee0d78a67b02a63a59a8c` |
| R45 | `frontends/shell/e2e/console.mjs:362-367 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:e29ca67bd99609794ab47d4d24bf77bae12e2378bc17701337da4f1420133e0c` |
| R46 | `frontends/shell/src/residency/residencyArm.ts:26-36 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:e6ad4f0a05bf116bc8887f2189cdbd32207bfa726e205f3a2cee806936e3ae37` |
| R47 | `frontends/shell/src/residency/residencyArm.ts:50 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:7f6a03cf4a311a343a544451e647abc60699d4db675128f8f872afbff2ec2bac` |
| R48 | `frontends/shell/src/App.tsx:1123-1124 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:7231ade90b69fae5bbaf1768303fb1a985c2b30ce05868074daf41dafd658962` |
| R49 | `frontends/shell/e2e/console.mjs:22-28 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:68bb04955fcf5c6ae8020e70aa84a419759987ea19860ba0e82ebdbf3d74252f` |
| R50 | `frontends/shell/e2e/console.mjs:400-420 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:c1b808358fba793eddbca812febd8254147a9aff8ba4826a25b4d4bac48dfae5` |
| R51 | `frontends/shell/e2e/console.mjs:542-609 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:e081cac8bf79f3ab32a56c23d15e936eb841f0455d2706d2dba24ead3cf2dc7d` |
| R52 | `frontends/shell/e2e/console.mjs:813-823 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:fbc86a448234496b56418d04a1856642554e769c8b6785c7945edd0e5f258311` |
| R53 | `frontends/shell/src/console/recorder.ts:139 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:423b617db7fe4b69b4e623a9a6db4f007739554d482062926f3cd2d26855db4f` |
| R54 | `frontends/shell/src/console/recorder.ts:280-286 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:8c02788208074bcb7756bebd755ae7ab5461f999722415ae4042d8522f9943f9` |
| R55 | `frontends/shell/src/console/consoleViewModel.ts:177-189 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:01b077d07f3c593876673c0bc2a15a58be42bf9999825f9e8847420c23cbfef0` |
| R56 | `frontends/shell/src/console/ConsolePanel.tsx:28-34 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:bdfda403b2e7bb7c70f49e1a9accd000d76dd528cbd8be3e59dd4aa8ff9ec2ff` |
| R57 | `frontends/shell/src/console/ConsolePanel.tsx:61-67 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:75c5f9b37df8b803327c6aeb6f201a6c9a36ed0416ec932bc06fd399817424d5` |
| R58 | `frontends/shell/src/console/ConsolePanel.tsx:103-131 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:b39c7392943e6052d6d3b42f65d3cb6e99f40aaccd9ea85ab419486b698c0463` |
| R59 | `frontends/shell/src/console/ConsolePanel.tsx:175-179 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:3e6411db0203bd393dfb4bedceec8cc08e72305f5afe81a360cf9d0495a79cdb` |
| R60 | `frontends/shell/src/console/consoleViewModel.ts:182 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:d67826d25f82aac413e8cf6c094dc04bd1337fed9ccba8416a60d56b33545f83` |
| R61 | `frontends/shell/src/App.tsx:305 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:a08e39472fe3751bad90f194602a70a48a5988b1f6e5f53645cfe016ac9e9314` |
| R62 | `frontends/shell/src/App.tsx:318-322 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:228c3274148903e2b752b8e8be3a53ade786ddaf86c1e9583d13b9fb5a821bed` |
| R63 | `frontends/shell/src/residency/candidateArmSession.ts:1631-1699 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:3f370f7dd0eb20b30cfb1ef5340c7b9fbe947e62d88f23e35ea7fac7a0a35ba5` |
| R64 | `frontends/shell/src/residency/candidateArmSession.ts:1274 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:a64b9f3fa2152164450dd72b192dcc2a40e7e176bd82184f1b031f85c990d826` |
| R65 | `frontends/shell/src/residency/candidateArmSession.ts:1370-1375 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:0c4dda7735e46711b8e389013415a0339de60557cec94a21af50902b2392c7fb` |
| R66 | `frontends/shell/src/diagnostics/log.ts:20-21 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:6d8574691e44a4f79a8ae234221c9b0373c0debe1b435352ecc99870c2ecb79e` |
| R67 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:83-87 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:308c62b5a5ac50e08c570d06710e59a9ac500bf58ed0360448e93e21baa1c243` |
| R68 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:93-97 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:b07d9848c59d5c66102838a5b8e92052c40bb6ae5b1d58f64226cce9c0f08c62` |
| R69 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:246 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:6338de0d8fe3e83d43e7b1b884fede3a63fd149a0462baa5d4998e428caf1e27` |
| R70 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:407 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:f8da56c299fe91a3ad4e45e7a71923a4ebfbbfe62174c933ddb3f92f1939973b` |
| R71 | `KNOWN-LIMITATIONS.md:293-298 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:2a0d4662e62cd9127588cbe32f07bc451947e7aa05687dda2ef9af1fe8059c4f` |
| R72 | `frontends/shell/e2e/source-changed.mjs:33-37 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:b7891d2c874eca435cb37268a51f069a7821ad52eb942b50e74c0e431b80b04a` |
| R73 | `frontends/shell/e2e/source-changed.mjs:210-214 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:3eae60ff981a07c9f587525dfd56cc7e0ed5bb4f2fd5e9477f3281abe269e700` |
| R74 | `frontends/shell/e2e/source-changed.mjs:177-186 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:79716fa3e6506fc9109ee8e3f6360ef597b04658c9de84a92af372a3a1dc0baa` |
| R75 | `frontends/shell/e2e/source-changed.mjs:519-521 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:32648ad72f35f9b3f55b7c0c034c54b42bf2464d233523002cb3a37164833cb8` |
| R76 | `frontends/shell/e2e/source-changed.mjs:572-578 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:7815d163a93c7ded66d2fe2a546022fcf58b86112d0ebe5b138be763815c42e2` |
| R77 | `frontends/shell/e2e/source-changed.mjs:741-748 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:400929baacc4368cd03e08dfb1c494f30ae18e615ce5f2e9d977daa342e272c8` |
| R78 | `frontends/shell/e2e/source-changed.mjs:751-771 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:87470c5d4d4e637b945d1be0f1a7307713d47299f4af9ffa40a40180943435c2` |
| R79 | `frontends/shell/e2e/source-changed.mjs:779-821 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:30896c5e25088a39087fba51d0266c73025adcaf01001c2902a0ae34f5d36b5c` |
| R80 | `frontends/shell/e2e/source-changed.mjs:1097 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:7f244a57de902997c8d29a44e8ffa5f12db6f12395b0540a83174196d5e0081d` |
| R81 | `frontends/shell/MANUAL-WALKTHROUGH.md:144 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:929dcbada125b93bfd5002cab04aa7dae27fa4d90ae8b2a8a0771554474ecec3` |
| R82 | `frontends/shell/MANUAL-WALKTHROUGH.md:179-185 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:cca8521d8eccccde7bb2261932ba5b89b0d53022640d7a1d7a44fa448953a8d2` |
| R83 | `frontends/shell/MANUAL-WALKTHROUGH.md:511-512 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:7b0418a48269cd32caab92852cd8a5e59b2964ab9ef77517dd75269368d50b5a` |
| R84 | `frontends/shell/MANUAL-WALKTHROUGH.md:587-591 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:1612cbdbc65ca43ad95276683a7bce45a5ce62780c8d32e609d4d4f5310f50d8` |
| R85 | `frontends/shell/MANUAL-WALKTHROUGH.md:94 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:95ffbbc23023f13f5170ce4b290634cffc3d13a7bd96c696b8b52f0b3543370f` |
| R86 | `frontends/shell/MANUAL-WALKTHROUGH.md:612 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:ea8d5775010496935ffbceb0c8224a984fc14097c8958b59230ddddcc1127a58` |
| R87 | `frontends/shell/MANUAL-WALKTHROUGH.md:614 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:82705ce4cea102835b7da3bfa926c200d68a30033a92f932a1f132a7221611e8` |
| R88 | `frontends/shell/MANUAL-WALKTHROUGH.md:681 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:1c0e9b4ac24df0db5ab28de23d6aff306f0c91e9263bb4f4aa9cb87b19d3cc69` |
| R89 | `frontends/shell/MANUAL-WALKTHROUGH.md:684-685 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:44ce26f6bea85712c2937912ff0c5fd218cf6f2331b2e7df7f7ecc68b75da6f1` |
| R90 | `frontends/shell/MANUAL-WALKTHROUGH.md:946 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:bfcc34243aee94564a0599341aa649247c538983a2a5e32d3c8838be7cf609b0` |
| R91 | `frontends/shell/e2e/README.md:240-244 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:b4e03358febc539a953be3a4d5cfdd232a3d300e5a416448d401d7eff6e32285` |
| R92 | `frontends/shell/e2e/README.md:264-277 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:08c960f532eaa118e7da24cc0f123c16325d4334e303a609938364bc408be487` |
| R93 | `frontends/shell/e2e/README.md:436 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:b79a844f9f9e6171b1c9a4848ac12c8b1c56f82773e4c121ddd86389066ec8ae` |
| R94 | `KNOWN-LIMITATIONS.md:60-66 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:f8f21542af1a8944d0975cb6dd19b7cddeffcfb0157f6a9a40434e3acea3603b` |
| R95 | `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1` |
| R96 | `state/directives/2026-10-06-machine-script-adopted.md:20 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:678460c8f7dfa9e08653c2371aa5c7ef6659eab4b081f4d05035a0cdee329e22` |
| R97 | `state/directives/2026-10-05-product-first-direction.md:8-11 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:9aead327c84a609975136446c01d60ceb332f059f25bd2660c1d00720d70ea87` |
| R98 | `state/directives/2026-10-05-product-first-direction.md:15 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751` |
| R99 | `state/directives/2026-10-05-product-first-direction.md:19 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:6b83a5387d8d511d324a992658af70614661aabb1e927aaff39273a1ce56b2c4` |
| R100 | `state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md:6-19 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:0c4c4b64fecd70e2e48fe90618ab4b90bcf30f4d6429335f0b5e6d03eb0c2d2d` |
| R101 | `state/directives/2026-10-09-rulings-on-the-eight-forms.md:13 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:709fb8d9fe2efb61fa42089eef1bcd3e2d6cd4eeaafc75b54bbd4788e03a3b16` |
| R102 | `state/directives/2026-10-09-rulings-on-the-eight-forms.md:11 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:bd6f7d3f434e106501948deca425dd07793410cfeab553f8e745ee45f60ce519` |
| R103 | `state/directives/PORTABILITY-2026-09-30.md:33-65 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff` |
| R104 | `AUTONOMY.md:315-332 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3` |
| R105 | `AUTONOMY.md:347-357 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31` |
| R106 | `AUTONOMY.md:482 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669` |
| R107 | `docs/PREREGISTRATION-TEMPLATE.md:172 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2` |
| R108 | `frontends/shell/e2e/regression.mjs:92-98 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:5918952f173bcc2836deab93a04cf8f845a661e4e4f59287f5c6cff553a69d61` |
| R109 | `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:33-36 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:c8fdf6726f013c0396b45f15c77e6f7deadf1833c6e971121542225769866fdc` |
| R110 | `engine/src/fixture.rs:4 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:65b5e5249edaf5a3d4e2e1903d97fd77afc395ecf3e370159b42398b5ae52183` |
| R111 | `engine/src/fixture.rs:194-195 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:79721bfe4910785d6ac5242196190b87c21b04b7f20184930c91f5dc293deea3` |
| R112 | `frontends/shell/e2e/admission-remediation.mjs:429 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:ffd51fb2d7f20d81370513a8ffb756c931f9c6ad965fad4e0023458bc9ce4bf3` |

## §1. What this preregistration may and may not claim

- **No product change.** Nothing under these paths changes:
  - `frontends/shell/src/**`, `frontends/shell/src-tauri/**`, `protocol/**`, `kernel/src/**`;
  - `engine/src/**`, except the one feature-gated fixture variant of §2.6 if OPEN-1 (A) is ruled.
  - A step that needs a product change, or shows a defect, stops the piece and goes back to the human [R2].
- **No measurement.** No performance number and no docs/08 row. The millisecond values in §7 are bounds on waiting, never results (ADR-018).
- **Evidence class: E2E-verified** for the four suites. Operator rows are proposed for the human's sight, not judged here.
- **The session-tier assertions** prove that the shell opens the keyless file and renders the engine's statement. They do not prove R-I3's engine properties, which belong to the engine tests the triage names [R7].
- **The source-changed re-aim** proves KNOWN-LIMITATIONS item 26's pre-check backstop [R71] for a directory junction repointed after admission. It does not prove it:
  - for a file symlink;
  - for a rename above the grandparent;
  - for the post route or the reopen route, neither of which is re-aimed (§5, declared unchanged).
- **GROUP' and REFUSAL'** make no claim about console latency. The only stated property is a re-render at most once per frame [R56], which is not a latency contract.
- **No wire change.** HEXLIM' asserts the existing `skp/0.6` key set [R43]. No ADR is cited as amended, and none is amended.
- **User-visible wording** stays the human's. The walkthrough row texts in Appendix A are proposals for sight. The KNOWN-LIMITATIONS paragraph is the human's own text.

## §2. The change, step by step

The ruled rules are item 1's [R2], referenced and not restated. For each step: what it asserts today, what changed, and the re-aimed assertion.

### 2.1 regression C2'/C3'

- **Today** [R34, R32]: `missing-identity-refused.parquet` must refuse with `engine.identity_unusable` and the no-such-column message [R31]. The identity form must be present, `parcel_key` must be among its candidates, there is no dismiss control, and no summary appears in the Layers region.
- **Replaced.** A single file with no `id` column now opens on the session tier: R-I3 [R21], ADR-016 Amendment 1, Accepted [R20], implemented at [R17].
  - Still existing: a file whose `id` cannot serve still refuses with the identity form and its candidates ([R25], [R24]; the last sentence of the human's paragraph [R5]).
- **Re-aimed: two halves in the one step, each failing by its own name.**
  - **(a) Session half.**
    - `openPath(no-id-column.parquet)` returns `{kind:"admitted"}`.
    - After `waitForSettle` (MAP''s values, §7), the summary, read where MAP' reads it [R112], holds the Identity line `session-ordinal:file_row_number — by-construction-within-generation` [R22].
    - It also holds a `Session identity` row whose text equals `SESSION_IDENTITY_STATEMENT`. That constant is byte-copied from [R19], under the suite's verbatim-constant convention [R108].
    - No `.admission-panel .admission-refusal` is present.
    - The identity form's absence is recorded as INFO and not asserted, since the identity-route node [R4] will change it.
  - **(b) Refusal half.** `stepRefusal` (unchanged) on `string-id-refused.parquet` with:
    - code `engine.identity_unusable`;
    - a message constant read back from a real run [R108], whose detail is the type refusal [R25];
    - form `.identity-declaration-form`;
    - candidates `["parcel_key"]`.
  - The fixture-existence loop [R33] gains the new paths. The step's outer bound changes per §7.

### 2.2 admission MAP' and BOTHNEEDED'

- **MAP'**
  - **Today** [R38]: the keyless file refuses with the missing message [R37], offers `parcel_key`, and admitting it as declared gives `mapped:parcel_key — verified-at-open-full-file`.
  - **Re-aimed.**
    - (a) The same session half as 2.1(a), on `no-id-column.parquet`.
    - (b) Refuse-then-declare on `string-id-refused.parquet`:
      - a plain open refuses `engine.identity_unusable` with the read-back type message;
      - the candidates are exactly `["parcel_key"]`;
      - declaring `parcel_key` admits;
      - the summary holds `mapped:parcel_key — verified-at-open-full-file` (that assertion is unchanged).
- **BOTHNEEDED'**
  - **Today** [R39]: an explicit-null-CRS, keyless file refuses CRS; asserting the CRS alone refuses identity, showing the carried-option line; the combined request admits.
  - **Re-aimed.**
    - (a) **Session half, on `no-crs-no-id-refused.parquet`** (the old shape, renamed):
      - a plain open refuses `engine.crs_undeclared`;
      - asserting the CRS alone gives `{kind:"admitted"}`;
      - the summary holds the caller-asserted CRS line and the `Session identity` row equal to `SESSION_IDENTITY_STATEMENT`.
    - (b) **Both-needed half, on `no-crs-string-id-refused.parquet`:**
      - a plain open refuses `engine.crs_undeclared`;
      - the CRS alone refuses `engine.identity_unusable` with the read-back type message and the carried-option line (assertions unchanged);
      - the combined request admits with both summary lines (unchanged).
- **CONFLICT'** keeps its body. Only its fixture constant follows the rename [R40].
- The existence checks [R41] and the regeneration constants [R36] follow the new names. Step bounds change per §7.

### 2.3 console: HEXLIM', REFUSAL', GROUP', the arm readback

- **HEXLIM'** [R45]
  - Changed: the wire gained `columns` in `skp/0.6`, always present [R43]. The client sends `columns: null` [R44].
  - Re-aimed: the expected key list is exactly `bbox, bbox_crs, columns, dataset, filter, limit, skp`. Nothing else in the step changes. The value of `columns` is not asserted, because the ruling asks for the key list only.
- **REFUSAL'** [R50]
  - What changed is an assumption, not behaviour. The shipped arm is now the candidate arm (entry 52 (a); [R46], [R47]). On it, the refused entry reaches the DOM after the hook returns [R9, R13].
  - Re-aimed: the step polls `readClassAEntries` every `CONSOLE_POLL_INTERVAL_MS`, up to `CONSOLE_POLL_BOUND_MS` (§7), until a `viewport_query` row with outcome `refused` is present. Its code and message are then compared with the live outcome, unchanged.
  - When the bound expires, the step fails by name. The message gives the bound and the console label's count and dropped figures [R57].
  - A fixed sleep or a frame count is not a valid wait. That is the human's rule for the sibling piece [R102], applied here.
- **GROUP'** [R51]
  - What changed: the same arm assumption. Premise [R49] is that nothing else is recorded between the three calls. On the shipped arm that can fail (H1). The step also counted every new header [R14].
  - **Re-aimed: option 1, by what the entries are.**
    1. `waitForSettle` on the render trace, with HEXLIM''s own values (§7), so that no earlier generation's work is still in flight.
    2. Expand every group. Read the baseline:
       - the console label's total, count plus dropped [R57];
       - the number of *residential untiled rows*, which must be 0 or the step fails by name. A residential untiled row is a class-A `viewport_query` row whose parsed request has `bbox === null` and `filter.predicate === "zone = 'residential'"`. The primary attempt of an Apply issues `bbox: null` [R61]. Tile queries and the refusal-recovery re-issue carry a bbox ([R62], [R63]).
    3. Make three `queryWithFilter("zone = 'residential'")` calls in sequence, each `applied` (unchanged).
    4. Poll (bound §7). Each read expands every group and maps each class-A row to its enclosing `.console-group`, or to none. The condition: exactly 3 residential untiled rows, all in one `.console-group`.
    5. **Capacity.** Let R = the label's total at the passing read minus the baseline total. R ≤ `MAX_CONSOLE_ENTRIES` (256, mirrored from [R53]) proves none of the step's own rows can have been evicted, because the ring drops the oldest [R54]. R > 256 fails by name as `capacity` before any other check.
    6. On the passing read:
       - the group's header text equals `×N`, where N is the number of rows it shows (I8: one group of real entries, [R55], [R58]);
       - every row in it is `viewport_query`;
       - each request text parses on its own.
       - N and the number of distinct texts among the 3 are reported, not asserted. The prediction is N = 3 (§5).
    7. When the bound expires, the step fails by name. The message gives the count found, the group each row is in, and the kinds of the rows found between them in DOM order (H1's discriminator).
  - The suite never counts all headers, and never reads the recorder module.
- **Arm readback (the assumption made explicit).**
  - After the mount gate, `main` reads `window.__SPATIAL_E2E__.getResidencyArm()` [R48].
  - It stops the run as a harness failure, by name, unless the arm is `candidate`. This is regression.mjs's precedent [R35].
  - Nothing sets an arm. The suite stays on the shipped arm, and nothing pins the baseline.
- **REGRESS'** and every other console step are unchanged. REGRESS' carries regression and admission [R10].

### 2.4 source-changed S3 and S4 (default route `pre` only)

- **Today.**
  - S3 moves the scratch copy's mtime [R78].
  - S4 issues a gesture ladder and asserts that a `viewport_query` follows [R79]. The pre-check is then supposed to refuse it.
- **Changed.** The advisory watcher (node `engine-source-change-watcher`; round 17, item 2) sees the touch while the app is idle and ends the session first, so no query follows [R11].
  - What it cannot see: a symlink in the resolved path repointed after admission. Arming canonicalizes the path and watches only the final parent and grandparent ([R67], [R68], [R70], [R71]).
- **Re-aimed, route `pre` only.**
  - **Layout, before S1.** Under `e2e/out` (gitignored):
    - `source-changed-targets/a/source-changed-scratch.parquet` and `source-changed-targets/b/source-changed-scratch.parquet`, each copied from the 100k fixture and each hash-equal to `hashBefore` [R75];
    - `b`'s copy has its mtime moved forward 120 s with `utimesSync` before the open, so the two copies differ only in mtime;
    - a directory junction, `source-changed-link` → `source-changed-targets/a`, made in-process with Node's `fs.symlinkSync(target, path, "junction")`. This needs no elevation and spawns nothing. The watcher's own test A10 uses a junction [R69].
    - A stale junction from an earlier run is removed with `fs.unlinkSync`, never with a recursive delete.
    - S1 [R76] opens `e2e/out/source-changed-link/source-changed-scratch.parquet`.
  - **S3 (pre).**
    - Retarget: unlink the junction, then re-create it pointing at `b`.
    - Assert that `realpathSync` of the opened path now resolves inside `b`, and that both copies still hash to `hashBefore` (block-on-sight 8 of the existing driver, kept).
    - On `EPERM` or `EACCES` it fails by name, with no fallback to another link type and no elevation.
    - Off Windows it fails by name, naming the file-watching boundary (§2.7).
  - **S4 (pre).** The ladder is unchanged. Added: after the query, the session log written since the baseline [R77] must carry a `tile-stream-mint-refused` line with `engine.source_changed`. That is the pre-check's own line [R74]. If it is absent, S4 fails by name.
  - **S5a–S5c** are unchanged. The final hash check covers both copies.
  - **Routes `post` and `reopen`** keep `SCRATCH_COPY` [R73] and their mtime touch, including `reopen`'s second touch [R80]. They are not re-aimed (§5).

### 2.5 Fixture generators (`kernel/tests/manual_walkthrough_fixtures.rs`)

| Name | Shape | Source | Generator |
|---|---|---|---|
| F-A `no-id-column.parquet` | declared LV95; `parcel_key` UInt64; no `id` | the spec of [R28], unchanged | renamed to `generate_the_no_id_column_fixture`; the doc comment's refusal sentence is corrected |
| F-B `string-id-refused.parquet` (new) | declared LV95; `id` Utf8 (`key-{n}`); `parcel_key` UInt64 = n | new | `generate_the_string_id_refusing_fixture` |
| F-C `no-crs-no-id-refused.parquet` | explicit `"crs": null`; no `id` | the spec of [R29], unchanged | renamed to `generate_the_no_crs_no_id_refusing_fixture`; its both-needed doc is corrected (a plain open still refuses on CRS) |
| F-D `no-crs-string-id-refused.parquet` (new) | explicit `"crs": null`; `id` Utf8; `parcel_key` | new | `generate_the_no_crs_string_id_refusing_fixture` |

- All four fixtures have `features: 100` and `avg_vertices: 12`, as their siblings do.
- New names are used so that no stale file on disk can stand in for a new shape.
- The old files are left on disk, untracked, and nothing reads them.
- The doc comment at [R28], which says these files are refused until a mapping is declared, is corrected.

### 2.6 F-B and F-D's writer (OPEN-1)

- **(A), recommended.** One variant in `engine/src/fixture.rs` [R26]: `IdentityMode::StringIdsBesideParcelKey`.
  - The schema gets `id` Utf8, then `parcel_key` UInt64, ahead of `bbox` and `geometry` [R27].
  - The writer fills both columns.
  - Every existing variant's bytes are unchanged.
  - The module is test support, behind the `fixture` feature [R110]. The caller-rule precedent is [R111].
- **(B) and (C)** are in OPEN-1.

### 2.7 Portability item (R3 of [R103])

- **Owning boundary:** file watching (`engine/src/watch.rs`). It is exercised, not changed.
- **Behaviour:**
  - Windows: supported, and the junction route is exercised here.
  - macOS and Linux: the watcher is explicitly reduced to checks-only (KNOWN-LIMITATIONS item 24). The shell e2e suites do not run there today; that level is not established, per PORT-3 and PORT-4.
  - S3 (pre) fails by name off Windows rather than skipping (R6).
- **Tests per platform:** Windows only. The deferral is recorded by KNOWN-LIMITATIONS items 1 and 24 and by the portability plan.
- No `cfg` in product code. The only platform check is `process.platform` in the e2e file.
- No Windows assumption enters shared logic (R4). The new fixture constants follow the suites' existing test-only path convention.

### 2.8 Records and documents

- **`frontends/shell/e2e/README.md`.** The descriptions of HEXLIM', REFUSAL' and GROUP' [R92] and of the default source-changed route [R91] follow §2.3 and §2.4. Dated records, for example [R93], are not edited.
- **`frontends/shell/MANUAL-WALKTHROUGH.md`.**
  - Rows C2, C3, I4 and I5: the Appendix A texts, after the human's sight.
  - Coverage rows [R85], [R86], [R87], [R88] and [R89] follow §2.
  - Rows I6 and I8, the Part C heading and the fixture tables [R81], [R83] follow OPEN-3.
  - No result log is edited.
- **`KNOWN-LIMITATIONS.md`.** Item 3 [R94] gains the human's paragraph (Appendix B) after its existing text, which ends with the item's comment line. One blank line goes before it and one after. No other item is edited (item 5's disjoint-paths rule, [R6]: PR #197 edits item 9, and map-refill edits item 39). Whichever of these merges later merges main in before its last gate run.

## §3. Fixtures — predicted outcomes

Every file under `target/fixtures/manual-walkthrough` that any run reads is sha256-hashed before and after the runs.

| Fixture | Predicted |
|---|---|
| F-A | bytes equal to the triage's `missing-identity-refused` hash b0c2f1ea879ca75ba1d740cfab93cc91a41e917e955085dbd4d6e4405e82f424 [R7]. A plain open admits on the session tier, and the summary shows the statement |
| F-B | a plain open refuses `engine.identity_unusable`; the detail begins `type is Utf8;` [R25]; candidates exactly `parcel_key` [R24]; declaring `parcel_key` admits, `mapped:parcel_key — verified-at-open-full-file` |
| F-C | bytes equal to 6e41b31267a4241cae388e2c49467fa4b1930be679aed7e55fb0753e9227f5c8 [R7]; refuses `engine.crs_undeclared`; with the CRS asserted, admits on the session tier |
| F-D | refuses CRS, then identity (type), then the combined request admits |
| 100k copies `a` and `b` | hash-equal to the 100k fixture throughout; differ in mtime only |

## §4. Tests, and one observed mutation per re-aimed step

**How a mutation is observed** (wording per [R107]):
- apply it;
- run the named suite;
- record the step's failure by name, with the commit it was observed at;
- revert it, and show the worktree clean.
- One at a time. None is committed, pushed or left in place.

A `verify-mutation` run is never called an observation. All mutations below touch **test lines** (TL) or select a **fixture** (FX). **No product line is touched** (OPEN-2 offers the alternative).

| # | Step | Mutation | Kind | Predicted failure, by name |
|---|---|---|---|---|
| M1 | C2'/C3' (a) | the session half's fixture constant points at `100k-happy-path.parquet` (native `id`) | FX | `C2'/C3' (session tier)`: no `Session identity` row |
| M2 | C2'/C3' (b) | the refusal half's fixture points at F-A | FX | `C2'/C3'`: expected refused `engine.identity_unusable`, got admitted |
| M3 | MAP' (a) | the session half's fixture points at F-B | FX | `MAP' (session tier)`: expected admitted, got refused |
| M4 | MAP' (b) | the declared column `parcel_key` is replaced by `id` | TL | `MAP'`: declaring did not admit |
| M5 | BOTHNEEDED' (a) | the fixture points at F-D | FX | `BOTHNEEDED' (session tier)`: expected admitted after the CRS assertion, got `engine.identity_unusable` |
| M6 | BOTHNEEDED' (b) | the fixture points at F-C | FX | `BOTHNEEDED'`: expected `engine.identity_unusable` after asserting the CRS alone, got admitted |
| M7 | HEXLIM' | `columns` removed from the expected list | TL | `HEXLIM'`: key set mismatch (the text of [R12]) |
| M8 | REFUSAL' | the poll's match also requires a refusal code that no refusal carries. This is a read-side stand-in for a refusal that never renders | TL | `REFUSAL'`: no refused `viewport_query` entry within the declared bound |
| M9 | GROUP' | the third call's predicate becomes `zone = 'commercial'` | TL | `GROUP'`: expected 3 residential untiled rows, found 2 |
| M9c | GROUP' capacity | the mirrored capacity is set to 2 | TL | `GROUP'`: capacity |
| M10 | arm readback | the expected arm becomes `baseline` | TL | a harness failure naming the arm read back |
| M11 | S3 (pre) | the retarget is replaced by the old mtime touch on the opened path | TL | `S4`: no `viewport_query` followed any gesture (the watcher ended the session first; [R11]) |
| M12 | S4 (pre) | the retarget is skipped, so the junction stays on `a` | TL | `S4`: no `tile-stream-mint-refused` `engine.source_changed` line since the baseline |

**Suites:**
- `npm run e2e:regression`, `npm run e2e:admission` and `npm run e2e:console` (REGRESS' included);
- `source-changed.mjs`, default route, `launched:true`;
- the four generators (`cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`);
- under OPEN-1 (A), the engine's fixture-dependent tests, unchanged and passing;
- CI's `node --test` scripts suite, and `verify:plan`, `verify:cites` and `verify:quotes`.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions.** A wrong prediction is a result, recorded as class 2.
- **P1.** Each of the four suites gives 0 FAIL in a solo run with `launched:true`. Main then meets item 2's premise for milestone 2 [R3].
- **P2.** GROUP''s group has N = 3, and the three texts are byte-identical.
- **P3.** R ≤ 256. The value is recorded.
- **P4.** F-A to F-D behave as §3 predicts.
- **P5.** On the pre route, the pan rung produces the query, the pre-check line carries detail `{mtime}`, and S5a–S5c pass.
- **P6.** M1 to M12 each fail by their named message.

**Declared unchanged:**
- every product path named in §1;
- `frontends/shell/e2e/lib.mjs`;
- the bodies of these console steps: HEADER', ECHO', TWOCMD', CLASSB', CLASSC', COPYTRUNC', UNCLASS', REGRESS';
- every `regression.mjs` step except C2'/C3';
- every admission step except MAP' and BOTHNEEDED' (CONFLICT''s fixture constant only);
- source-changed S1, S2 and S5a–S5c, and the `post` and `reopen` routes;
- every other fixture generator, and every engine fixture variant's bytes;
- KNOWN-LIMITATIONS items other than 3;
- every walkthrough result log, and the e2e README's dated records.

**Invalidators.** Each one stops the piece and goes to the human. None is worked around.
- **I1.** A re-aimed step fails in a solo run because of the product [R2].
- **I2.** S4 shows a query but no pre-check refusal after the junction retarget. Item 26's claim [R71] would then not hold for a junction.
- **I3.** GROUP' fails in a solo run because a row of another kind sits between the three residential rows. That means option 1's premise does not hold on the shipped arm. Option 2 is not taken without the human.
- **I4.** The junction cannot be made without elevation on the e2e machine.
- **I5.** F-B does not refuse, or offers candidates other than exactly `parcel_key`.
- **I6.** F-A's or F-C's bytes differ from their predecessors'. That is fixed before any run.

**Falsification.** This preregistration is wrong if the four suites cannot all pass against main's product without a product edit.

## §6. Instruments

- Every quantity is an **assertion**: outcome kinds, row kinds and counts, group membership, header text, hash equality, log-line presence. R (§2.3) is an assertion on a count.
- There is no measurement. The step-line milliseconds the suites already print are not results.

## §7. Declared values and ceilings

| Value | Bounds or denotes |
|---|---|
| `CONSOLE_POLL_BOUND_MS` = 5000 | the REFUSAL' and GROUP' polls. A ceiling on waiting, not a latency claim. The triage's single probe saw the refused entry at about 299 ms [R9] |
| `CONSOLE_POLL_INTERVAL_MS` = 100 | the poll's mechanism |
| `MAX_CONSOLE_ENTRIES` = 256 | mirrored from [R53] by the sibling-file convention; GROUP''s capacity check |
| GROUP' pre-settle: `quietMs` 1500, `timeoutMs` 15000 | HEXLIM''s own values |
| GROUP' outer bound 30 s → 45 s | the settle, the three calls and the poll. A bound |
| C2'/C3' outer bound 30 s → 90 s; MAP' and BOTHNEEDED' 60 s → 120 s | each half adds a `waitForSettle` (`quietMs` 3000, `timeoutMs` 45000, MAP''s values). A bound |
| S3 `b`-copy mtime offset = +120 s | the same offset S3 used before [R78] |
| F-B and F-D: `features` 100, `avg_vertices` 12 | as their siblings |

**Line budget.** The count is insertions plus deletions from `git diff --numstat <merge-base>...<PR head>`, per §21c's rule [R105]. This form is excluded.

| File | Ceiling |
|---|---|
| `frontends/shell/e2e/console.mjs` | 220 |
| `frontends/shell/e2e/admission-remediation.mjs` | 220 |
| `frontends/shell/e2e/source-changed.mjs` | 170 |
| `frontends/shell/e2e/regression.mjs` | 120 |
| `kernel/tests/manual_walkthrough_fixtures.rs` | 90 |
| `engine/src/fixture.rs` | 40, under OPEN-1 (A) only |
| **Code and tests, total** | **860** |
| `frontends/shell/e2e/README.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, `KNOWN-LIMITATIONS.md` (documents) | 40, 60 and 2 |

- Files: at most 9.
- An overrun is recorded as class 8, and this line is never edited.
- No new dependency: Node built-ins only, and no crate.

## §8. Block-on-sight

1. Any edit under a product path in §1, apart from §2.6 (A) as ruled.
2. Any arm set or pinned in `console.mjs`.
3. A fixed sleep or a frame count used as the REFUSAL' or GROUP' wait.
4. GROUP' asserting on the total number of `.console-group-header` elements.
5. A walkthrough result log edited, or an e2e README dated record edited.
6. A recursive delete on a path that is, or contains, a junction. Any link type other than `junction`. Any elevation, `runas` or spawned `mklink`.
7. Copy hashes unequal anywhere in the source-changed run.
8. The KNOWN-LIMITATIONS text not byte-identical to [R5]'s line 27, or any other item edited.
9. A mutation committed, pushed or left in place.
10. A refusal-message constant written by hand and not read back from a run.
11. A failure seen in a shared run recorded as a failure (§9).
12. An invalidator of §5 reached and worked around.
13. A new dependency.

## §9. Gates

- **Proportional gates** under [R98]. A gate fails only on Correctness or Evidence. Documentation and record findings are fixed in the same PR before the merge.
- **Architect.** §1 to §8 one by one; the operation class (an e2e and test-support piece, no undo surface); the caller rule for §2.6 [R111].
- **Reviewer.** The whole diff; each block-on-sight item.
- **Suites.** Those of §4, green before the gates.
- **Operator.** Rows C2, C3, I4 and I5 (and I6 and I8 per OPEN-3) are committed with blank result logs and queued for the next sitting.
- **Heavy runs.** The worker's and tester's briefs carry the machine paragraph of [R95], as written. The form names no other rule for builds.
- **Shared runs.** The human's line, reproduced from [R96]. It must be byte-copied by script and marked; the custodian re-copies it and recomputes the hash before the commit:

  > - A timing-sensitive failure seen in a shared run is not recorded as a failure. Report it to the custodian, who re-runs it alone on the machine.

## §10. Amendments — opens empty, append-only

## Appendix A — proposed walkthrough row texts, for the human's sight

The texts are proposals. Engine strings are placeholders, filled by a byte-copy, never typed.

- **C2.** Select `no-id-column.parquet` and confirm. → No refusal panel. The summary appears in the Inspector's Source section, and the features draw. Its **Identity** line reads `session-ordinal:file_row_number — by-construction-within-generation`. Below it, a **Session identity** row reads, verbatim:
  - *⟨SESSION_IDENTITY_STATEMENT, byte-copied from [R19], the sentence Part N's N3 quotes [R90]⟩*.
  - Fact that changed: this file, formerly `missing-identity-refused.parquet`, was refused before the session tier (ADR-016 Amendment 1, R-I3).
- **C3.** Read the summary fully. → No identity declaration form appears: the app does not yet offer a way to declare an identity column for a file that opened this way (KNOWN-LIMITATIONS item 3). **Judge:** does the Session identity row read as a clear statement that these features are identified for this session only?
- **I4.** As the current I4 [R84], with three changes:
  - the file is `string-id-refused.parquet` (new: its `id` column holds text, which cannot serve, and a unique 64-bit `parcel_key` sits beside it);
  - the message is *⟨the type refusal, verbatim, from the suites' read-back constant⟩*;
  - the candidate list still has exactly one entry, `parcel_key`.
  - The form description, the Judge prompt and the Declare instruction stay as the current row has them. The outcome is unchanged: Admitted, `mapped:parcel_key — verified-at-open-full-file`.
- **I5.** As the current I5 [R84], with these changes:
  - the file is `no-crs-string-id-refused.parquet` (new: an explicit `"crs": null`, a text `id`, and a unique `parcel_key`);
  - after the CRS is asserted, the identity refusal carries I4's type message;
  - the carried-claim line, the Judge prompt and the outcome are unchanged.
  - A note: the former `bothneeded-refused.parquet`, now `no-crs-no-id-refused.parquet`, admits on the session tier once the CRS is asserted. That is covered E2E only (BOTHNEEDED' (a)).

## Appendix B — KNOWN-LIMITATIONS item 3 paragraph

The text below is reproduced from [R5]'s line 27, with its three leading spaces, as the PR lands it. The custodian replaces this block with a script byte-copy and recomputes the hash before the commit.

   **On `main` (not the v0.1.0 artifact above).** A single file that has no `id` column and no declared mapping opens instead of being refused. Its features are identified for that session only, by their position in the file, and the summary says so. That identity does not survive a reopen or a change to the source, and it is never saved or published. This is the one case in which a row position stands in for identity. The app does not yet offer a way to declare an identity column for a file that opened this way: the declaration form appears only when a file's identity is refused. A file whose `id` column cannot serve is still refused.

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-3 and on the lead-data pilot (class 5)

*Written by the custodian after the human's answers were received (14:09:02Z by the transcript, question round 70) and before any code. References only; nothing below is a quotation.*

1. **The rulings:** state/directives/2026-10-09-reaim-question-round-answers.md:6-16 @ 8607406ba0e012cb9afcccaec561af66e50f20d9 sha256:6c633de7ee22b921df27b277fdf7a47ead6af91dfdc5d38df42bcca1f8c150b5.
2. **OPEN-1 is (A)** (state/directives/2026-10-09-reaim-question-round-answers.md:7 @ 8607406ba0e012cb9afcccaec561af66e50f20d9 sha256:bd56a1687d051f34942f01512c5406a2d6ac9fb207b4d0d8ff2413cf612064fc).
   - §2.6 (A) binds.
   - `engine/src/fixture.rs` is in scope for that one feature-gated variant, within §7's 40-line ceiling.
   - Options (B) and (C) are void.
3. **OPEN-2** (state/directives/2026-10-09-reaim-question-round-answers.md:10 @ 8607406ba0e012cb9afcccaec561af66e50f20d9 sha256:3c669bbbc0352e4157145f272ed2e145f7cf14f66e0ef3c4b276cd057f5d7446). Every re-aimed step keeps its test-side or fixture-side mutation in §4, except REFUSAL′.
   - **M8 is replaced by a product-line mutation:** the refusal block at frontends/shell/src/console/ConsolePanel.tsx:175-179 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:3e6411db0203bd393dfb4bedceec8cc08e72305f5afe81a360cf9d0495a79cdb (§0.R's R59) is removed. The predicted failure is REFUSAL′ failing by name when its declared bound expires.
   - **Its terms** are those the draft's OPEN-2 option (b) named: R100, restated at R101, applied to that one block.
   - **What is void and what stays:** the read-side stand-in that M8 described is void. GROUP′'s M9 and M9c stay test-side.
   - **How §4 and §8 read with this item:** §4's statement that no product line is touched, and §8 item 1. The mutation is temporary and is never committed.
4. **OPEN-3 is (a)** (state/directives/2026-10-09-reaim-question-round-answers.md:13 @ 8607406ba0e012cb9afcccaec561af66e50f20d9 sha256:cb40309fb87280b8a2cd338686320796fc15ef3cead985ab883a2c1881409eb1).
   - §2.8's rows I6 and I8, the Part C heading and the fixture tables are in scope, for the human's sight, within §7's ceiling for the walkthrough.
   - No result log is edited.
   - §9's Operator bullet includes I6 and I8.
5. **The lead-data pilot** (state/directives/2026-10-09-reaim-question-round-answers.md:16 @ 8607406ba0e012cb9afcccaec561af66e50f20d9 sha256:4ee81a7c3e12d78b74ada699e41d85332d8f98ff79973d1ccd868f8fda173b67).
   - No impact read is made. The draft stands as the architect's alone, and the piece is not one of the pilot's measured pieces.
   - The answer refers to a paste, and the custodian has asked the human which text that is. Nothing above depends on it.
6. **Code** waits for the K6 fix (PR #196) to merge. The branch is cut from main after it, as the header says.
7. **Superseded index:**
   - §2.6's (B) and (C) → item 2;
   - §4's M8 row, and its statement that no product line is touched → item 3;
   - §2.8's OPEN-3 bullet and §9's OPEN-3 parenthesis → item 4.

   Nothing above is edited.

### Amendment 2 — rounds 70 and 71 (class 5); GROUP′ re-aimed and every existing fixture's bytes shown by hash (scope addition, class 9)

*Written after outcomes were seen: worker report 1 [A2.R12–A2.R21] and the custodian's solo runs [A2.R3–A2.R11]. It invalidates §2.3's GROUP′ assertion, P2 and I3. It touches §2.4 (route `pre`), §4, §5, §8 and §9, and adds to §7 without editing it. Items 5, 6 and 10 are a scope addition (class 9) under round 70 and round 71, declared before any code of it. Item 9 is class 2. No line above is edited.*

Branch lines are cited in words at cf2434e6 (the branch commit cf2434e6f25033335d69ee4b667caefd109832f1), with no hash (round 15 (e); round 25, item 2 (d)). The base is b8ad22ff50f11538f46bf308e5680faeb69912e1 [A2.R30]. H is the branch head at the time of a run.

**A2.R references.** Main @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5. Each hash is over whole committed lines, LF bytes. One span per pin.

| id | reference |
|---|---|
| A2.R1 | `state/directives/2026-10-09-round-71-and-round-70-paste.md:6 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:0f013aece65a21799561fa99a90381306d2ac23b93f606a604add1a4382e79fe` |
| A2.R2 | `state/directives/2026-10-09-round-71-and-round-70-paste.md:8 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:71f67ab67fedf82451b895ea56f59cf7790dbcdcf6b5361d64933aa016916df7` |
| A2.R3 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/README.md:3-6 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:56e35d8971c09bd50d891de2fbda8d85622907bd4f430614404774f9df950e7a` |
| A2.R4 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-2-hold-output.txt:6 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:48ad5445f542115a8359e7de3cdbb06f7e3ffdf3226b2050b041d5865a4cf1e6` |
| A2.R5 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-2-hold-output.txt:20 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:7b837b824600004af4737e41e6a74b45a6f051f339bc60149f341a39483581d5` |
| A2.R6 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-2-hold-output.txt:28 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:6710448f4ead9714f2b25012069bedfc209c2c08f66a0d20bb6b01f00318e714` |
| A2.R7 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/w2-source-changed.log.txt:8 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:cea807374b170c55130c959ccb284611e83a584fe59efe05fbe3ed70ee4dd04e` |
| A2.R8 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-3-hold-output.txt:7 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:cd5abc8bc782d38929180375cc86675f1b0c6f29a0823f031ba81ae0fa76012a` |
| A2.R9 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-3-hold-output.txt:17 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:464dc6a856af98321d6f66bd058a827ac22e9fab548d00cb17b1c4f78fea1a31` |
| A2.R10 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/window-3-hold-output.txt:27 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:e4820f54796f6e77f7d7073d3a4208b10d45132f929b66c56db3e8a5fb1842b8` |
| A2.R11 | `state/drafts/e2e-stale-expectations-reaim-solo-runs/w3-console-run3.log.txt:12 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:75341b7e8d6379b280e0d45149c90a4cb76baddf3731a02d04c7e74f5d290ceb` |
| A2.R12 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:31 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:8fd648b146b3ac2e0ae46a5dea4d10408efe2aa6e523e4f2137992586ba606fd` |
| A2.R13 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:55 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:ec88b59b87669b003529740de31f215752b24fca25e1b91465e3d2600f08be28` |
| A2.R14 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:46 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:2b97065c556c6231cef93b7753fb1d031f1ee559be1ce5650020ce9e6478b62a` |
| A2.R15 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:81 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:39468c8e5350e09c2dcb5eae21edff4ac87f1119bac305b0cf636c31a3a71a30` |
| A2.R16 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:159-162 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:f666ed16afe9e45277c98a3d0dc76cda2cb8c078a70339f41fb5753c5cd51041` |
| A2.R17 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:179 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:d6523c05fd228fa00dbe6379575c88f21ab065e4eb1f1572cf09f648f19f8815` |
| A2.R18 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:109 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:916a3c2cfe6bfda38cdeea6b7f74c449611386a4ee14c170f1ac9fdb8bad45e3` |
| A2.R19 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:190-194 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:ff2b3bfa3dac830dd85c393c232ffc9d0717fc317085e55c79ff4b5c91f8d25f` |
| A2.R20 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:156-157 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:0bce02b896321d55f8d6e9ef8b5354cf9eb09cff8851c53eddefa09d884f2251` |
| A2.R21 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:195-200 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:db714bdb8ca500a22cf8724153e7640294b39b86314d6eb24b161497ecdd90ff` |
| A2.R22 | `frontends/shell/src/console/consoleViewModel.ts:160-169 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:2b44c92e637d25dd5936becbb32bbe2b2eee189804828886ca78c2666ff0be34` |
| A2.R23 | `frontends/shell/src/console/consoleViewModel.ts:171-189 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:d8804eaefa0154f749bf4d98fe012902df5da7f2ee57418448dd893ea404a8c8` |
| A2.R24 | `frontends/shell/src/console/ConsolePanel.tsx:103-132 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:9c41bead85512bbcf6372723775e87c70cf0a7c84fd23673e39e161eb5678b06` |
| A2.R25 | `frontends/shell/src/console/ConsolePanel.tsx:183-198 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:3be5f588cfd10326b120e22644464e5012bf56421465b16465bb5c343c2053f8` |
| A2.R26 | `tools/corpus/README.md:34-44 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:5fb7725143b63d30087a7c1d3fc0b0521446bd7d0d6e2b5b3cf8a76e47d8f291` |
| A2.R27 | `engine/ADMISSION-RESULTS.md:8 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:7284580cef0ef33c054bfccf02ef5ff0451a444bf4a21e45302a500bccee8aca` |
| A2.R28 | `engine/examples/make-fixture.rs:31-71 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:c89399ad2f12567586202c8b1ce01c156056684ac1a21cbcfc532037f0498223` |
| A2.R29 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:33 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:ec30c9dcc65dc6d8e248bd1a3a354358b8116fc16622d564197ca057faa31f78` |
| A2.R30 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-worker-report-1.md:7 @ d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5 sha256:db07df8b85c2dd0a705f91186b10b46a612e9e3e1a348c9d49f2a897dfe1ef6b` |
| A2.R31 | `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:9 @ 6e9b74cf65c502328b38078fba03bb0b516df8ad sha256:a220f6f5f423a36e20782a85fd7f9fee3724c395f5c9b8450ab4260ffe1c973b` |
| A2.R32 | `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:10 @ 6e9b74cf65c502328b38078fba03bb0b516df8ad sha256:e4534e4145157322b29530bcd8473d56636e86ddd7e091770a95e3d8b9fa8528` |
| A2.R33 | `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:11 @ 6e9b74cf65c502328b38078fba03bb0b516df8ad sha256:c2c6f9086df83549d09dd9568e71341dc88887a3826befb8cf4b2cf716159c7a` |
| A2.R34 | `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:12 @ 6e9b74cf65c502328b38078fba03bb0b516df8ad sha256:ee6f3f848f1638fc7ed3cc945da40745a1f547be71c86c177ceac5b8567c05d4` |
| A2.R35 | `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:13 @ 6e9b74cf65c502328b38078fba03bb0b516df8ad sha256:0fc8f986c0f6dabb05783dbc9793104e639c4eb49a3b631dfb82d4e49659d120` |
| A2.R36 | `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:14 @ 6e9b74cf65c502328b38078fba03bb0b516df8ad sha256:a5e14e9aef6286e50911ce8a2c009067bd1d0b32039b3652ca1c253092c9e56f` |

1. **The rulings and I3.**
   - Round 71 [A2.R1] and the text round 70's fourth answer named [A2.R2]. Their ledger block is cited by its heading, RULED 2026-10-09 — round 71 and round 70's paste, and never by line.
   - [A2.R2] answers Amendment 1 item 5's open question.
   - **I3 fired in a solo run:** window 3, console run 3 [A2.R10, A2.R11]. Runs 1 and 2 exited 0 [A2.R8, A2.R9]; their logs were overwritten [A2.R3].
   - Round 71 resolves I3: GROUP′ is re-aimed by the grouping rule (item 2). Option 2 is void.

2. **GROUP′, as `console.mjs` must assert it.** This supersedes §2.3's GROUP′ steps 4, 6 and 7, and P2.
   - **Definitions.** All read from the DOM. The suite still imports nothing under `src/console/`.
     - A row's *key*:
       - class A: `a:` plus its `.console-entry-header` text;
       - class B and class C: the class letter, `:`, and the whole `.console-entry-prose` text;
       - unclassified: `u:` plus its text.
       - These keys map one-to-one onto the grouping key [A2.R22]: class-B prose ends with the command, and each class-C action renders its own statement [A2.R25].
     - An *item*: a direct child of `.console-entries` that is a single `.console-entry`, or a `.console-group` with its header text, its `aria-expanded` and its shown rows. A group's key is its rows' key.
     - The *window*: the rows in DOM order from the first residential untiled row to the last (§2.3 step 2's definition), together with every item that holds those rows or lies between them.
     - One constant, `GROUP_CALLS = 3`, sets both the number of calls and the expected residential count.
   - **Steps 1–3** are unchanged: the settle, a baseline with 0 residential untiled rows and the label total, and `GROUP_CALLS` calls, each `applied`.
   - **Step 4, the poll.** The bound and interval are unchanged (§7). Each read expands every group, then reads the items.
     - Done when the window holds exactly `GROUP_CALLS` residential untiled rows and no collapsed group lies inside it.
     - On expiry it fails as `GROUP': presence`. The message gives the count found, the item that holds each found row, and the keys from the first found row to the last (H1's discriminator, kept).
   - **Step 5, capacity**, unchanged and checked first on the passing read: R > `MAX_CONSOLE_ENTRIES` fails as `GROUP': capacity`.
     - R ≤ 256 means no entry recorded since the baseline has been evicted [R54], so every run inside the window is shown whole.
   - **Step 6.** Then, in this order, each failing by name:
     - (a) `GROUP': group`: a group in the window has N < 2, or its header is not `×N` for the N rows it shows, or its rows do not share one key.
     - (b) `GROUP': split run`: two adjacent items in the window have one key. The same check applies to the window's first item and the item just before it, when that item is a single or an expanded group. This is the grouping promise that a run of consecutive identical entries forms one item [A2.R23, A2.R24]. A session-log line between residential rows therefore breaks their run and passes.
     - (c) **The not-exercised condition** [A2.R1, its second sentence]: no group in the window shows two or more rows inside the window.
       - Its failure name is the one that sentence gives. It goes into `console.mjs` as a byte copy by script from [A2.R1], prefixed `GROUP': `, and is never typed.
       - The step never passes on single entries only.
     - (d) `GROUP': parse`: a class-A row in the window whose request text does not parse on its own (I8, as before).
   - **Step 7, the report on a pass.**
     - The window's items in DOM order, each as its key and its count of rows inside the window.
     - The number of groups that satisfy (c).
     - The number of distinct texts among the residential rows.
     - R.
   - **Bounds.** Unchanged (§7): the poll 5000/100 ms, the pre-settle 1500/15000 ms, the outer 45 s.
   - **P2′.** In every passing run, the residential texts are byte-identical. They are reported; a different count is a class-2 result. N is not predicted.
   - **I3′.** Any GROUP′ failure in a solo run stops the piece and goes to the human. A failure named `group` or `split run` is an I1 candidate.

3. **GROUP′'s observed mutations.** Each follows §4's wording [R107]: one at a time, observed at a named commit, reverted, worktree shown clean.

   | # | Mutation | Kind | Predicted failure, by name |
   |---|---|---|---|
   | M9 (stands, new text) | the third call's predicate becomes `zone = 'commercial'` | TL | `GROUP': presence`, found 2 |
   | M9c (stands) | the mirrored capacity is set to 2 | TL | `GROUP': capacity` |
   | M9n (new) | `GROUP_CALLS` 3 → 1 | TL | step 6 (c)'s ruled name: one row is inside the window, so no group shows two |
   | M9g (new) | step 6 (a) expects `×(N+1)` | TL | `GROUP': group` |
   | M9s (new) | the item read returns every group's rows as singles | TL | `GROUP': split run`; (a) passes vacuously |

   - M9n is deterministic by construction.
   - M9g and M9s fail whenever the unmutated step would pass (c).

4. **Round 70: REFUSAL′'s terms are met.**
   - M8 was observed in this piece's worktree only, as one edit and one run: thirteen mutation runs for thirteen mutations [A2.R15].
   - The permission system accepted the edit. It was restored and the worktree shown clean [A2.R16], and it was never committed [A2.R17].
   - Amendment 1 item 3 stands, and nothing further is owed.

5. **Where `engine/src/fixture.rs` branches on the identity mode** (OPEN-1 (A); round 70). All lines are at cf2434e6.

   | # | Symbol | Lines of `engine/src/fixture.rs` at cf2434e6 | What `StringIdsBesideParcelKey` does there |
   |---|---|---|---|
   | B1 | `schema`, the `id_field` match | 625-632 | takes the `StringIds` arm (627-629): the first field is `id`, `Utf8`, non-null |
   | B2 | `schema`, `if identity == StringIdsBesideParcelKey` | 634-636 | adds the field `parcel_key`, `UInt64`, non-null, second, ahead of `bbox` (637-643) and the attributes |
   | B3 | `generate`, the per-row `match spec.identity` | 1094-1106 | its own arm (1101-1104) appends `key-{id}` to `string_ids` and `id` to `ids` |
   | B4 | `generate`, the first-column match | 1167-1173 | takes the `StringIds` arm (1169-1171): the first column is `string_ids` |
   | B5 | `generate`, `if spec.identity == StringIdsBesideParcelKey` | 1174-1176 | pushes `ids` as the second column |

   - **No branch:**
     - the declaration (546-548);
     - the doc-only correction to `ForeignKeyColumn` (533-534);
     - the pass-throughs: the field (465), the default `NativeUnique` (563) and the `schema` call (937).
   - The variant never reaches the wildcard arms (631, 1105, 1172).
   - The `write_hostile_*` writers (1582, 1604, 1688) do not read the mode.
   - The reviewer checks this list against `git diff b8ad22ff...H -- engine/src/fixture.rs`.

6. **Every existing fixture byte-identical by hash** (round 70; class 9).
   - **What counts as existing.**
     - **T1:** every file that `kernel/tests/manual_walkthrough_fixtures.rs` writes, all its generators included (the 4,000,000-feature one too).
     - **T2:** every file that the default test suites write through `fixture.rs`: the workspace, and `frontends/shell/src-tauri` after its CI's frontend build.
     - **T3:** the P4 corpus and its `MANIFEST.json`. No file in it is written by `fixture.rs` [A2.R26].
     - **T4:** every other file under `C:/dev/spatial-ide/target/fixtures/` that `fixture.rs` wrote, through `make-fixture` or an ignored test. The worker lists each one, with its producing command and size, before any run.
   - **Commits.** b8ad22ff against H. A comparison counts only if `git diff --quiet cf2434e6 H -- engine/src/fixture.rs kernel/tests/manual_walkthrough_fixtures.rs` exits 0.
   - **Where.**
     - The base runs in a fresh detached worktree, `C:/dev/wt/reaim-base`, at b8ad22ff; H runs in `C:/dev/wt/reaim`.
     - Each has its own `CARGO_TARGET_DIR`.
     - Every heavy command runs inside `hold shared -Project SpatialIDE` [R95].
     - Each worktree's `target/fixtures/manual-walkthrough/*.parquet` is removed first, non-recursively.
     - Nothing is written into the main checkout's `target/fixtures`.
     - Afterwards: `git worktree remove` on the base worktree, and `git status --porcelain` empty in both.
   - **Commands.**
     - **T1:** at each commit, `cargo test -p spatial-kernel --test manual_walkthrough_fixtures --locked -- --ignored --nocapture`, then `sha256sum` over the directory's `*.parquet`.
     - **T2 and T4:**
       - A temporary patch, one scratch file, is applied with `git apply` identically at both commits and is never committed.
       - It hooks the success arm of `write_geoparquet_cancellable` and the end of each `write_hostile_*`.
       - When `SPATIAL_FIXTURE_HASH_LOG` names a directory, each hook appends one line there: the test binary's stem without its `-<hash>`, the thread name (or `unnamed`), and the written file's sha256.
       - The suites then run with that variable set. T4's files under 1 GiB are written the same way.
       - `git apply -R` reverts the patch, and the worktree is shown clean.
     - **T3:**
       - `sha256sum` of every file under `target/fixtures/compat-corpus/`, compared with its `MANIFEST.json` and `mutations/DERIVATIONS.json`.
       - `MANIFEST.json`'s own sha256, compared with [A2.R27].
       - Done before the first run of this item and after the last.
       - `admission_p4_corpus` is not run, because it rewrites a tracked file.
   - **Pass.**
     - **T1:** under the rename map (`missing-identity-refused.parquet` → `no-id-column.parquet`, `bothneeded-refused.parquet` → `no-crs-no-id-refused.parquet`), every base file has an H file with an equal sha256. H writes exactly that set plus `string-id-refused.parquet` and `no-crs-string-id-refused.parquet`.
     - **T2 and T4:** the key sets are equal, and for each key the multiset of sha256s is equal at both commits.
     - **T3:** every hash matches its manifest entry, at both times.
     - Anything else fails as `fixture byte-identity: <tier>: <file or key>` and stops the piece (I6′).
   - **M13** (under the same allowance as the patch).
     - At H, `DuplicateIds`'s written value goes from 7 to 8 (line 1097 of `engine/src/fixture.rs` at cf2434e6).
     - T1 re-runs `generate_the_dupkey_refusing_fixture` alone.
     - Predicted failure: `fixture byte-identity: T1: dupkey-refused.parquet`.
     - Reverted, and the worktree shown clean.
   - **The worker's evidence** [A2.R14] does not suffice for T1. It shows that no file on disk was rewritten; it does not show what the branch's writer produces.
     - It suffices only for F-A and F-C. The branch wrote both, equal to their predecessors [A2.R13].

7. **The solo-run rule for P1.**
   - **Console runs.** After item 2 lands at H, the custodian runs `console.mjs` alone **five** times, set in advance.
     - Each run starts a fresh app, in an exclusive hold, with nothing else of the session running.
     - Each run's log is kept under its own name and filed with its hold output.
   - **Pass:** 5 of 5 exit 0, with every step PASS (GROUP′ and REGRESS′ included) and the worktree clean after each.
   - **Any failure** is recorded with its log, and the piece goes to the human. No run is repeated or added to replace it.
   - The record states how many of the five windows held more than one item. If none did, the split path is unobserved solo and nothing is claimed for it.
   - **Window 2's passes** [A2.R4–A2.R7] stand for the other three suites only if `git diff --name-only cf2434e6 H` lists only these files:
     - `frontends/shell/e2e/console.mjs`;
     - this form;
     - `frontends/shell/e2e/README.md`;
     - `frontends/shell/MANUAL-WALKTHROUGH.md`.
     - Otherwise each of the three runs alone once more at H, and must pass.

8. **The budget.**
   - `console.mjs` stands at 208 of 220 [A2.R12], and item 2 will exceed 220.
   - **This addition's ceiling:** `console.mjs`'s §7 count (§7's command) at the PR head is at most 290.
   - Every other §7 figure holds:
     - the code total stays within 860;
     - `README.md` stays within 40;
     - files stay at 9 or fewer. Nothing tracked is added: the patch, M13, the hash lists and the logs are never committed to the piece.
   - §7 is not edited. A final count above 220 gets a class-8 row, `budget overrun, §7 not edited`: 220, the final figure, and this item as the reason. A count above 290 is recorded the same way.

9. **c7d41dac (class 2), accepted.**
   - **What did not hold.** At c98263a1 the ladder was unchanged, as §2.4 declares for route `pre`, and P5's first clause failed: the pan and zoom rungs both stayed 17→17 [A2.R18].
     - That run was shared. It is recorded only as the reason for the change, and never as a failure (§9, §8 item 11).
   - **The change.** Route `pre`'s pan takes `dragsToCrossDataset` (lines 506-512 and 910 of `frontends/shell/e2e/source-changed.mjs` at cf2434e6). That is the bound the post route already uses under the human's Decision A (lines 955-967 of the same file at cf2434e6).
     - It is test-side and within §7: 142 of 170 [A2.R29].
   - **At cf2434e6:**
     - P5 held solo [A2.R6, A2.R7];
     - M11 and M12 failed by name [A2.R20];
     - the worker disclosed the difference [A2.R19].
   - P5 is not edited.
   - Worker differences 2 and 3 [A2.R21] are accepted as written. Neither changes a prediction.

10. **Class-9 declarations (§5, §8, §9).**
    - **Declared unchanged:**
      - every §1 product path;
      - `lib.mjs`;
      - every console step except GROUP′;
      - the regression, admission and source-changed files after cf2434e6;
      - `fixture.rs` and `manual_walkthrough_fixtures.rs` after cf2434e6.
    - **I6′:** any difference in T1–T4.
    - **I7:** the human withholds the patch and M13 allowance and rules no reduced claim. T2 and T4 then stop.
    - **§8 additions:**
      - 14. The patch or M13 committed, pushed, left in place, or applied outside this piece's worktrees.
      - 15. A solo GROUP′ run repeated or added to replace a failure.
      - 16. Step 6 (c) removed or weakened, or its name typed instead of byte-copied.
      - 17. Anything written under `target/fixtures/compat-corpus`, or `admission_p4_corpus` run.
    - **§9:** the architect resolves T1–T4's lists and item 5. The reviewer recomputes the hashes and checks the patch's revert.

11. **Superseded index.**
    - §2.3 GROUP′, steps 4, 6 and 7 → item 2
    - P2 → item 2 (P2′)
    - I3 → items 1 and 2 (I3′)
    - §4's M9 failure text → item 3; M9n, M9g, M9s and M13 are added (items 3 and 6)
    - P1's run count → item 7
    - I6 → item 10 (I6′)
    - §2.4's unchanged ladder for route `pre` → item 9
    - Amendment 1 item 5's open question → item 1
    - §2.6 (A)'s unchanged-bytes sentence → proven by item 6, not edited

    Nothing above is edited.

12. **The human's answers to the draft's open items** (2026-10-10, received at 11:00:52Z by the transcript; [A2.R31]–[A2.R36]). Added by the custodian with the pins, before any code of this amendment (class 5). Each answer is cited, not quoted.
    - **12.1 The allowance** [A2.R31]. Item 6's hash-log patch and M13 are allowed on that line's terms: in this piece's worktree, `C:/dev/wt/reaim`, and its base worktree, `C:/dev/wt/reaim-base`, only; applied with `git apply`; reverted; each worktree shown clean; never committed; never pushed.
      - If the permission system refuses either, the worker stops and the custodian tells the human.
      - This replaces item 10's I7: **I7′** is a refusal by the permission system of the patch or M13. T2 and T4 then stop and go to the human.
    - **12.2 T4 files of a GiB or more** [A2.R32]. They are not regenerated.
      - For each one, its producing command runs at both commits with only the feature count lowered, until the file is under a GiB. The two hashes are compared under item 6's T2 and T4 pass rule.
      - The record names each large file as not hashed. Its claim rests on item 5's list and on the reduced file (round 15 (b)).
      - A producing command that cannot be reduced lists its file as not covered.
      - The worker's T4 list (item 6) gives, for each large file, the reduced command and the reduced file's size.
    - **12.3 Class fit** [A2.R33]. Class 9 stands for this amendment. The template sentence is on the weekly window's list, and the template is not edited here.
    - **12.4 Solo runs** [A2.R34]. Five, as item 7 sets.
    - **12.5 The reading** [A2.R35]. As item 2's step 6 (c) is written: a group with two or more rows inside the step's own window.
    - **12.6 Order** [A2.R36]. No GROUP′ code before this amendment is committed. **§8 addition 18:** GROUP′ code at any commit before the main commit that adds this amendment.
    - Items 1 to 11 are not edited. Item 12 supersedes item 10's I7 (by 12.1), and adds §8 item 18 (by 12.6).
