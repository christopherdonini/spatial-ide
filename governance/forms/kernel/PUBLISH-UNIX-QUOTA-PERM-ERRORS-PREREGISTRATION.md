# kernel: publish gives a quota overrun the disk-full class on Linux and macOS, and pins EPERM as not writable — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node publish-unix-quota-perm-errors, the filler queue's entry 7c (S3, proven on the Linux L1 job). The five lines, the notes, the OPEN items and what is not settled are lead-data's draft (`state/consults/2026-11-01-publish-unix-quota-perm-errors-five-line-form-lead-data-draft.md`, read only at main b1bdb8ac; its sha256 from line 5 is 5af21e548a60da035bf80652f33b13655ab2f191fe8ee5f221a0f14ad841eec2), carried byte for byte with these changes, all the custodian's: each cite the draft marks `@ b1bdb8ac`, and each cite on a line before that line's last marker, is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path, or a root file whose bare name other tracked files share, as `path:line` at <commit>, sha256 <hex>; 5 such) (61 pins; 0 by a file name that resolves to one tracked path at that commit; 0 bare line numbers bound to the path written before them; 0 bare line numbers the draft leaves unmarked kept as written; 2 remaining markers given the full commit id); this title and lead line added; the draft's opening paragraph (its read commit and its wording convention), its Form path line and its closing result block dropped. Form path: `governance/forms/kernel/PUBLISH-UNIX-QUOTA-PERM-ERRORS-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

```
Authority: PLAN node `publish-unix-quota-perm-errors` (governance/PLAN.yaml:3825-3841 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:a99918d408992ec23581e0472b221ffedaf0f824929f702db0499a804f4b6f34), filler queue entry 7c (state/FILLER-QUEUE.md:21 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:530dfc5a7c06691520a156a5c525f3e748fb0c97b18cb7333dc1e6e4bc6b34f7), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84); the observation is wave-3 W3-A unproven observation 1 (state/cloud/wave3/W3-A.md:166 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:33e9f26b8482a8197cb53a18262a235a4264b907cec2ce4999f68f2ba236a4b0) with its custodian triage (state/cloud/wave3/W3-A.md:196 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8ee87516d95d2fd04b7ed553120afd55d62b192ef9077072d7419eb3f61f77e0), routed out of port-1 by its drafting consult (state/consults/2026-10-02-port-1-linux-l1-architect-draft.md:72 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8061388d5b1044ef6ea6d400edf16b302a975abec5506399412a11e313af013a, state/consults/2026-10-02-port-1-linux-l1-architect-draft.md:383 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:9ad18c49bd64332e87b07ca39aee1dc960953b02932438447743bd52696cce03); reuse index: a miss, no prior art recorded for "errno quota permission classification" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1, run by the custodian for this form's brief).
Scope: kernel/src/publish/error.rs; scripts/plan/cfg-boundary.test.mjs (its three pinned site counts only); kernel/README.md (owner's index: this form in the preregistration list, the Last-verified bullet); 3 files; declared line budget 100 by §21c's counting rule (estimate 70: product 12, tests 48, the check's test 6, README 4).
Change: `classify_io` gains a third per-platform table, `QUOTA_EXCEEDED`, holding EDQUOT (122 on Linux, 69 on macOS, empty on every other target). A raw EDQUOT now classifies as `PublishError::InsufficientSpace`, the class Windows' disk-full codes 39 and 112 take, where today it falls to `Io`. Windows' tables and its classification are unchanged. EPERM (1 on both) already reaches `DestinationNotWritable`, the class of Windows' ACCESS_DENIED (5), through the existing `PermissionDenied` kind fallback. It gains a test and no table entry.
Tests+mutation: T1 `kernel/src/publish/error.rs::tests::a_quota_overrun_is_insufficient_space_on_linux_and_macos` (Linux and macOS; ignored elsewhere with a reason naming the OS error classification boundary). M1: the `|| QUOTA_EXCEEDED.contains(&c)` clause is removed from the disk-full arm. Predicted failure: T1's panic naming EDQUOT 122 as classified `Io` on the Linux L1 job. T2 `kernel/src/publish/error.rs::tests::eperm_is_destination_not_writable_on_unix` (unix; ignored on Windows with a boundary reason). M2: the `PermissionDenied` kind-fallback arm is deleted. Predicted failure: T2's panic naming EPERM 1 as classified `Io` on the Linux L1 job; the existing `permission_denied_classifies_even_when_the_raw_code_is_unknown_here` fails as well on every job. T3 `kernel/src/publish/error.rs::tests::another_platforms_quota_errno_is_not_a_quota_failure_here` (all platforms). M3: the Linux table becomes `&[122, 69]`. Predicted failure: T3's panic naming 69 as classified `InsufficientSpace` on the Linux L1 job. Changed, not new: `scripts/plan/cfg-boundary.test.mjs::the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site`, its counts re-pinned from 18 to 21 sites and kernel/src/publish/error.rs from 6 to 9; its recorded M1 stands. Proven on the Linux L1 job (`.github/workflows/product-ci-rust.yml:196-197` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 6001cee2262c0ea4d0b2dae776762ca043e8b20f58ce2f6e6faee1446a322f44, `.github/workflows/product-ci-rust.yml:233-234` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 b583ae49475deb6fd0c6a7b2d4ee8a35323f6b6f814b70b68e8b908491ceed3c); T1 and T2 appear in Windows' printed ignored list (`.github/workflows/product-ci-rust.yml:238-240` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 4f18097b5d2fb0306ba2b3f59d92fb20b47ebb13a4cc9b659e1d94b5eb3fdf80).
Out-of-scope: ADR: none (no status line or amendment). Security: none (nothing ADR-020, ADR-009 or ADR-021 governs). Wire: none (a publish code crosses the Tauri boundary as `refusal_detail`, kernel/src/publish/error.rs:298-300 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:12da66c02017f2779734221c19097cad39019e6850b71073cc64234d238d8832, and no SKP, data-plane or MCP surface is touched). Guarantee: TOUCHED. The OS error classification row, graded supported on all three platforms (state/directives/PORTABILITY-2026-09-30.md:42 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:497fd8ee58c67e4448e01f4f57adf35880df05e340884cc27addfcf4ae0c3be5), becomes true for quota overruns on Linux and macOS. A property under test, the cfg-boundary site count (scripts/plan/cfg-boundary.test.mjs:73 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:f25d1be379e5d7d06103cf66ed67ceb5aaee7ea160217ecab4b46dafd7f443f4, scripts/plan/cfg-boundary.test.mjs:75 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:3dab4b4f18cdfc226a2eb1160b41588487fd5ea4a9c2a4492b31dbeb1c586714, scripts/plan/cfg-boundary.test.mjs:88 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:29f5a5faa02a41fb11e19ba28aa4df1698ef7487c980687ec92628aeb1bc94fe), is re-pinned. §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch. No new dependency, no `unsafe`, no new string, no new `pub` item.
```

*The notes, the OPEN items and what is not settled below are lead-data's from its draft, carried byte for byte except for the pins; where they say I or my, they mean lead-data's. They are this form's reading.*

## Notes


**N1. Size against §21c, settled first**
- The bounds are 150 changed lines with tests counted, 8 files, no new exposure surface, no new dependency and no new user-visible behaviour (governance/AUTONOMY.md:350-351 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333). The counting rule and the exempt form are at governance/AUTONOMY.md:357 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec.
- My estimate:
  - error.rs product code: 12 lines (3 cfg attributes, 3 consts, a short doc addition, one match line changed).
  - The three tests: 48.
  - cfg-boundary.test.mjs: 6 (3 lines changed).
  - kernel/README.md: 4 (2 lines changed).
  - Total about 70 lines over 3 files. The declared budget of 100 leaves room.
- The other three bounds:
  - Dependency: none (N3).
  - Exposure surface: none. No process is spawned, no file is read and nothing new is listened on.
  - User-visible behaviour: OPEN-3.

**N2. The defect and the classifier**
- The classifier is at kernel/src/publish/error.rs:482-533 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:8ee26ed391dd2efe3ba9d3f27198c9d8454e5be4f33527ffe9865b4ae495e188. Its tables:
  - Windows: kernel/src/publish/error.rs:492-495 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:84e2d1b6596836e531b37a88379d881f7ba0592aeed8891fb0618ec3b605867d.
  - Unix, ENOSPC 28 and EACCES/EROFS 13 and 30: kernel/src/publish/error.rs:497-500 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:c2cde56ef088ff06067f4c1a2b3a300a2669ffac794bbfbd44e5cebce72d6fc7.
  - Other targets: kernel/src/publish/error.rs:502-505 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:5152e7039ce3733d134800b3df951c1d2759ff06ca06700dcad8d310d19f8dc2.
- The match and its kind fallback are at kernel/src/publish/error.rs:507-532 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:e05994321d3fb5aa30c93ca25c38e8a910a57a148975fe6fcb1119b90771e2e2 (the `PermissionDenied` arm at :518-526).
- The doc on why the tables stay separate per platform is at kernel/src/publish/error.rs:484-487 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:7f85a370bbd6475fcada2639a2d6bf20cb73337ede2cc40ffb39e225601507bb. The portability plan keeps this file as the pattern (state/directives/PORTABILITY-2026-09-30.md:28 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:87f78a71bafce8865d9a5085fcf329c24318d7d7b8833e0b5ba2da0a912602d7).
- The observation cites error.rs:401-404 at its audit baseline. At b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 those lines are :497-500.
- The existing tests are at kernel/src/publish/error.rs:535-569 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:51fe7e9ea323fc8810a97b4c9db3ddb0771a756cdea605f4b88c6961cb5053ee. All are declared unchanged.

**N3. No new dependency (a red line), and how the piece does without one**
- The kernel's dependencies are at kernel/Cargo.toml:18-34 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:69d25a94c8ce7c0dfbbb616cf9213fba2f794acf67f494e0e4781d141f4e9107. None of them is an errno source.
- `libc` is in the lock (`Cargo.lock:1179-1180` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 d39eb5a587141012e5ce1ea2a8f908a5729b3726d1a39426e467f5351df6295b) only as another crate's dependency. Naming it in kernel/Cargo.toml would be a new dependency edge. The getrandom precedent at kernel/Cargo.toml:32-33 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:0865ae5afee20502e9fb00b98a7c69ebf5055d6c9b994a17333dca947a2d79ff does not make that free.
- The piece uses integer literals, one per platform, as the existing tables already do. Each is checked against std's own errno mapping in T1, so nothing outside std is needed.

**N4. Which class each errno joins (my reading)**
- **EDQUOT** (Linux 122, macOS 69; values from state/cloud/wave3/W3-A.md:166 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:33e9f26b8482a8197cb53a18262a235a4264b907cec2ce4999f68f2ba236a4b0) joins `InsufficientSpace`.
  - That variant is documented as the filesystem running out of room, detected at write time (kernel/src/publish/error.rs:37-45 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:f40b3e459ee529c89967f19466eb38fd679765c9941c15ccf70970b409ef3d48).
  - A quota overrun is the same condition for this writer. W3-A says Windows reports disk full for a quota overrun. That is unverified here.
  - The Windows table names no quota code. ERROR_DISK_QUOTA_EXCEEDED, which I recall as 1295 and did not verify, is absent from it.
- **EPERM** (1 on Linux and macOS) belongs in `DestinationNotWritable` (kernel/src/publish/error.rs:29-35 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:c58cf8e8f5321b2a3d36a18ea2abec36ee117b52b3f78a3a0a39a98e3b0d282b), beside EACCES and EROFS. Windows' ACCESS_DENIED (5) sits there too.
  - I recall, and cannot verify here because the tree has no std source, that std maps a raw EPERM to `ErrorKind::PermissionDenied`.
  - If so, the fallback at :518-526 already classifies it, and the observation's EPERM half is already met. T2 settles this on the L1 job.
  - Contingency, declared now: if T2 fails on the L1 job, my recollection is wrong. Then `1` joins the unix `NOT_WRITABLE` table on its existing line (no new cfg site), recorded as an amendment, and M2 becomes removing it. See OPEN-2.
- **Windows** is unchanged. Its lines :492-495 stay byte-identical, and the third arm gives it an empty `QUOTA_EXCEEDED`.

**N5. Why per-OS raw tables (Route B), and what they cost**
- An EDQUOT that differs between Linux and macOS needs `target_os` cfgs. Three new sites go in error.rs, which is already on the allowlist (scripts/plan/cfg-boundary.mjs:27-33 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:0ef8ec150af352fc8b0db15de439e0f0f50170b591aee0d82ca4651aeb8c0ccf, :32).
- No allowlist entry is added. The check's test pins every site, though (scripts/plan/cfg-boundary.test.mjs:65-90 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:f0b5f8ba172713ca56676912f1af8ed13838eb5991b9577c7c784dd479c76717), so its counts are re-pinned in this piece. That is the third Scope file and the rule (00) question below.
- Test-module cfgs are not counted (scripts/plan/cfg-boundary.mjs:10-15 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:c25841ffc15b7adf9b0c60a436e75493ecd4e039fe2726cea0fb21ad72d7786e, :157-171), so the tests' gating adds no sites.
- The alternatives are in OPEN-1.

**N6. What a user sees (my reading)**
- The existing messages:
  - `InsufficientSpace`: kernel/src/publish/error.rs:320-325 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:0ad222c2919de1b525ebdfa16d6686720702e650107aa1883a5e1eb9cb837756.
  - `DestinationNotWritable`: kernel/src/publish/error.rs:316-319 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:81cdc044688cd4c9c27be4492960d253874a6f0a5b85bd202fea803c6cc05eb1.
  - The codes `publish.insufficient_space` and `publish.destination_not_writable`: kernel/src/publish/error.rs:263-264 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:d68714ab4a9a19a9eea7384889c2e8241fe676bcba8c4662b4b3a4fedfca960f.
  - The audit reader's plain reasons: kernel/src/permission/audit/reader.rs:254-256 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:fb619fc78786e4e83dd3d60c06b57c62f6296e7f897375c244f3af37f5162c31.
- These are now reached by EDQUOT on Linux and macOS in place of the `Io` message and the `publish.io` code (kernel/src/publish/error.rs:265 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:be57ff00fad97a879dad57ce623f49572d38f0ba7b247a46bf26e0f89a8b82ae, :326-327).
- The audit outcome stays `Failed`, because all three variants are in the failed set (kernel/src/permission/boundary.rs:306-311 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:0b68f0557b1e2be007bb6b54d6e87e43f27165df6c2a9081114b5cab73064a00). `error_kind` names the variant (kernel/src/permission/boundary.rs:225-227 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:44edd944d934a69a3edf5cf485912896a8bb9aefe75a7d811de0a6c47dea1cfd).
- No client matches any of the three codes: a grep of the tree outside target and node_modules finds them only in error.rs.
- No new string. No product ships off Windows (KNOWN-LIMITATIONS.md:14-17 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:b09539dcb92e1e5270f096973af4a8934994bb4d7e49928624b2f608b3e1d639). Linux is L1 for the Cargo workspace only (KNOWN-LIMITATIONS.md:27 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:b7d18a7e3c11e9b4fd0a3971a788623c4e2fdf414d9793e6c9b40718f98fc1d5).
- Whether this is new user-visible behaviour is OPEN-3. The wording question is OPEN-4.

**N7. Callers of the classifier, all unchanged**
- kernel/src/publish/mod.rs:1492-1498 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:73d7b27fbd7730e9731a96c83612cfce5c266719f1c0e7eb4767fdef2831a20d (staging directory)
- :1508-1514 (bundle directory)
- :1580-1581 (create)
- :1586-1588 and :1594-1595 (write)
- :1610-1611 (flush)
- :1615-1616 (sync)
- :1658-1664 (finalize rename)
- kernel/src/permission/audit/normalize.rs:180 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:9a45dd0113a7d88f30c1f878e1c016d678b43ed3846bf5474b1002da018a085c names it in a doc comment only.

**N8. Test design**
- **T1**
  - The test picks `edquot` as 69 on macOS and 122 otherwise, through `cfg!` in the test body.
  - It first asserts `std::io::Error::from_raw_os_error(edquot).kind() == std::io::ErrorKind::QuotaExceeded`. This is an oracle independent of the product table: a wrong literal fails by name before the classification is checked.
  - It then asserts `classify_io` gives `InsufficientSpace` with `raw_os_error == Some(edquot)`.
  - Assumption: `ErrorKind::QuotaExceeded` is stable on CI's `@stable` toolchain (`.github/workflows/product-ci-rust.yml:205` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3, sha256 9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641). I recall it was stabilised in 1.85, unverified here.
- **T2:** a raw 1 gives `DestinationNotWritable` with `raw_os_error == Some(1)`. It is ignored on Windows, where 1 is a different code.
- **T3** keeps the separate-tables principle (kernel/src/publish/error.rs:484-487 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:7f85a370bbd6475fcada2639a2d6bf20cb73337ede2cc40ffb39e225601507bb) under test:
  - On Linux, 69 is not `InsufficientSpace`.
  - On macOS, 122 is not.
  - On Windows, neither 69 nor 122 is. This also guards Windows staying unchanged.
  - In every case the raw code stays visible.
- **Declared unchanged:** the three existing error.rs tests, kernel/tests/publish.rs and every cfg-boundary test except the re-pinned one.
- **Invalidators:**
  - Any existing test changing outcome on either job.
  - Windows' `--list --ignored` gaining anything beyond T1 and T2.
  - T1's std oracle failing on the L1 job, which would mean the observation's value is wrong. The piece stops.

**N9. The Platform item (R3: state/directives/PORTABILITY-2026-09-30.md:49-54 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:60f4aa60c2364c5acc141be1a32c0d23a3b38f2a9df5d03d40c51cef44bf9959; template docs/PREREGISTRATION-TEMPLATE.md:177 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0)**
- **Owning boundary:** OS error classification, kernel/src/publish/error.rs (state/directives/PORTABILITY-2026-09-30.md:42 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:497fd8ee58c67e4448e01f4f57adf35880df05e340884cc27addfcf4ae0c3be5). It already exists, so the architect adds nothing.
- **Windows:** supported, unchanged. T3 runs. T1 and T2 are ignored with reasons naming the boundary (R6, state/directives/PORTABILITY-2026-09-30.md:65 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:97ca2c3a10f89a424cf8edc9de104c336b1ad22206f3eda0aebb14fc474f26d5).
- **Linux:** supported. EDQUOT 122 gives `InsufficientSpace`, and EPERM 1 gives `DestinationNotWritable`. T1, T2 and T3 run on the ubuntu-24.04 L1 job.
  - Disclosed: 122 is the generic Linux value. Linux architectures that number EDQUOT differently are not built here (my recollection: MIPS, Alpha, SPARC, PA-RISC). T1's oracle would fail there by name.
  - Android is not `target_os = "linux"`, so it takes the empty arm.
- **macOS:** supported by code (69, and EPERM 1). It is compiled and tested only once a macOS L1 job exists, which is port-2's work and in flight. Until then it is code-path-only, and the deferral is recorded in this form (OPEN-5).
- No KNOWN-LIMITATIONS item is owed: nothing is reduced, and KL 1 is unchanged.

**N10. Rule (00): the piece's paths against the in-flight list**
- **kernel/src/publish/error.rs.** Not among the kernel paths of `cut/b2-piece-1c-save-and-reopen` or `cut/port-2-macos-l1-and-app-dirs`. #273, #272, #271 and `cut/b1-shell-half-pr-c` list nothing under kernel/. Clear on the list given.
- **kernel/README.md.** Not among the listed kernel paths of any branch. Clear on the list given.
- **scripts/plan/cfg-boundary.test.mjs.** Not determinable from the list, which gives only kernel/ paths.
  - 7a's settlement records that at 0f6c62a4, `cut/port-2-macos-l1-and-app-dirs` edited `scripts/plan/cfg-boundary.mjs` and its test (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:102 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:530d5915a747ac0ffe6aa49124244990fc57e5e6efce2361ab2d5f4129f5f176).
  - If that still holds, Route B collides by rule (00). This is the first blocking question.
- **The form itself,** governance/forms/kernel/PUBLISH-UNIX-QUOTA-PERM-ERRORS-PREREGISTRATION.md. New, on main, by the custodian.
- I cannot see the docs and governance lanes' paths.
- 7c's earlier skip reason (#241) is recorded at state/FILLER-QUEUE.md:21 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:530dfc5a7c06691520a156a5c525f3e748fb0c97b18cb7333dc1e6e4bc6b34f7. #241 has merged, per 7a's form at governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:71 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:56213b71c23d3343d71a8b184a63861c994b39fb84aade93baf4985d0165a777.

**N11. Record notes**
- The PLAN summary calls this a user-visible error class change (governance/PLAN.yaml:3840 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:26f144d0bd65095e4420b864fe3b478afff2f4b8ba1225b89059b8b3a09b26fe). The node title names EPERM as missing (governance/PLAN.yaml:3826 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:ec3dd49e050e86c3215e207e601e68677484f43179186ca4a2769c8063c1eb08). N4 explains why EPERM may already be classified.
- The owner's index lists this module's forms at their old `kernel/...` paths (kernel/README.md:387-389 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:0d0f9bfe2699a9f3f740d41de3327f595bcfdd868fd6d7118e2e828b601e301d). None of those paths exists at main; they resolve through governance/MOVED.tsv (for example governance/MOVED.tsv:104 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:d35410c60f421ecd6ba23d3c929fa9b2a7ab5d27c5ae8ff4d02574964c4481e7). See OPEN-6.

## OPEN items, each with options and my recommendation

None is a red line, except option (B) of OPEN-4.

- **OPEN-1: how EDQUOT is classified.** Recommendation: (B).
  - (B) Per-OS raw tables, as drafted. Windows is unchanged, and the shape follows the explicit-table pattern the portability plan keeps. It adds 3 cfg sites and re-pins the check's test, which raises the rule (00) question.
  - (A) A kind arm, `e.kind() == ErrorKind::QuotaExceeded`, mapped to `InsufficientSpace`. It needs no cfg and edits no test file, and std's mapping is right on every architecture. But on Windows a raw ERROR_DISK_QUOTA_EXCEEDED (by my recollection std maps it to that kind) would move from `Io` to `InsufficientSpace`. That is a user-visible change on the supported platform and against the brief's "Windows unchanged".
  - (C) Restructure the six existing cfg'd consts so the site count stays at 6. This bends product code to fit a pinned count, and it rewrites the Windows lines.
  - If rule (00) collides, I recommend skipping 7c at dispatch: it keeps its place (state/FILLER-QUEUE.md:3 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:7da60aa87b074740f7d7b3833cba76847c12eed307666d9becc06736850c04c3) and re-pins on port-2's numbers after that merges. I do not recommend falling back to (A).
- **OPEN-2: EPERM.** Recommendation: (A).
  - (A) EPERM is left to std's `PermissionDenied` mapping and pinned by T2, with the N4 contingency.
  - (B) `1` is also listed in the unix `NOT_WRITABLE` table. That follows the observation's letter, but while the kind arm stands, no mutation of that entry can fail a test.
- **OPEN-3: is EDQUOT reaching existing classes "new user-visible behaviour" under §21c?** Recommendation: (A), the same shape as 7a's ruled OPEN-2 (governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md:100 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:31905ebbbabc4603fb1e11d57b1c4d281d9cf1366f033972c5dcdd3bce56f679).
  - (A) Not new. The variants, messages, codes and audit outcome all already exist, there is no new string, and no product ships off Windows. The filler stands with both gates from dispatch under §36.
  - (B) New. The piece leaves the filler slot for the full form and full gating.
- **OPEN-4: the existing `InsufficientSpace` message says the filesystem is full, which is not literally true for a quota overrun.** Recommendation: (A).
  - (A) Reuse it unchanged. The OS detail it carries names the quota, and the P6 sitting may reword the shared message.
  - (B) A quota-specific sentence. **A red line:** it is a new P6 string under item 4 of the 2026-10-31 direction (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3 sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38). It is also new user-visible behaviour and adds lines.
- **OPEN-5: macOS.** Recommendation: (A).
  - (A) The arm ships, code-path-only until a macOS L1 job exists, with the deferral in this form. T1's oracle checks the value when that job first runs.
  - (B) No macOS arm. macOS stays `Io` and explicitly reduced until macOS L1.
- **OPEN-6: the owner's-index update.** Recommendation: (A).
  - (A) Add only this form, at its governance path, and the Last-verified note. The old paths resolve through MOVED.tsv, and re-pathing them is a separate index update.
  - (B) Re-path lines 387-389 in the same edit. That adds about 2 changed lines and touches pointers this piece does not change.

## What I could not settle

- Whether any in-flight branch, PR, docs lane or governance lane edits `scripts/plan/cfg-boundary.test.mjs` at b1bdb8acc4035aa1eab223d3d62caf75abfcc0a3. Route B depends on this (N10).
- My recollections of std, all unverified here: std maps EPERM to `PermissionDenied` and EDQUOT to `QuotaExceeded`, and `ErrorKind::QuotaExceeded` is stable on CI's toolchain. T1 and T2 prove the first two on the L1 job, and the first push proves the third.
- Whether Windows really reports a quota overrun as 112 or 39 (W3-A's claim). This piece neither depends on it nor tests it.
- Confirmation that "guarantee: touched" here is not a red line, as the human ruled for 7a.
- No sha256: I have no shell.

## The custodian's settlement (class 1, before any code)

- **The OPEN items,** taken on 2026-11-01 as the drafting agent recommends, by the human's direction of 2026-10-31 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4); none is a red line, and the human reviews each on return:
  - **OPEN-1: (B),** per-OS raw tables, as drafted; with its contingency, below.
  - **OPEN-2: (A),** EPERM left to the kind fallback and pinned by T2, with N4's contingency.
  - **OPEN-3: (A),** not new user-visible behaviour; the filler stands with both gates from dispatch under §36.
  - **OPEN-4: (A),** the existing message reused unchanged. Option (B), a new string, is a red line and is not taken.
  - **OPEN-5: (A),** the macOS arm ships code-path-only until a macOS L1 job exists, with that deferral recorded here.
  - **OPEN-6: (A),** the owner's index gains this form at its governance path and the Last-verified note only.
- **The guarantee:** the draft's second question is read as the human ruled for 7a (`governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md`, its settlement, the guarantee bullet): a platform scope made true is not a red line; the piece stays `guarantee: touched`, with the reviewer and the architect from dispatch under §36. The custodian's reading, for the human's review on return.
- **Rule (00),** the draft's first question, by git at main ce5db2f1 (`git diff --name-only origin/main...<branch>` over the open PRs, #273, #272, #271, and the branches in flight): `cut/port-2-macos-l1-and-app-dirs` edits `scripts/plan/cfg-boundary.test.mjs` (and `scripts/plan/cfg-boundary.mjs`), a Scope file; nothing else touches the Scope or this form. So 7c is skipped at dispatch, keeping its place in the filler queue, as OPEN-1's contingency says. When port-2 has merged, the check's pinned site counts in the Tests+mutation line are re-read at that main and recorded by an amendment before any code.
- **The read commit and main:** `git diff --name-only b1bdb8ac ce5db2f1 -- kernel/src/publish/error.rs scripts/plan/cfg-boundary.test.mjs kernel/README.md` is empty, so the Scope files read at main ce5db2f1 as they did at b1bdb8ac.
- **Not settled by the draft, and proven by the piece's own runs:** std's mapping of EPERM and EDQUOT and `ErrorKind::QuotaExceeded`'s stability on CI's toolchain (T1, T2, the first push), as its last section says.

## Amendments (opens empty; append-only)
