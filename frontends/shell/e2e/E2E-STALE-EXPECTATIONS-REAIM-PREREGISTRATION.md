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
