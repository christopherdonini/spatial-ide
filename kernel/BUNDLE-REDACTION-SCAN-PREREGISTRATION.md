# The bundle redaction scan in the product publish: every staged file scanned before the rename, a finding refused by name — full form (PLAN node bundle-redaction-scan-not-in-product-publish)

File: kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md (proposed name; the custodian's choice)
Authority:
- The human's placements of 2026-10-21, item 1 (graded S1; slot 1 ahead of the order; the architect's form first; never weakened): state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:11 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a64593ab31cac061787e9acdc293300810b6c6e6bee8fce2542c80adf6b54a5b. The message has its RULED block in DECISIONS-PENDING.md.
- The human's rulings on this form (OPEN-1 to OPEN-4 (A); W6 approved as drafted; a lead-data impact read before the form is committed): state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e93556d99c28d74a663143e883702200c234af4eb79fe855b6dbca27c716aa24. The message has its RULED block in DECISIONS-PENDING.md.
- S1 as defined: state/directives/2026-10-05-product-first-direction.md:21 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5b0d35c6d7971fd2e5d3222bd8cc107595b70e14d33e45af3c37927d77a0118f (item 5).
- The node: PLAN.yaml:5394-5410 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:85d04efa87d6dae11787e667337f0c89dfa9bb639013ba0d8d3eacc9dca07a45.
- Candidate 1 of the boundary inventory: state/consults/2026-10-16-boundary-inventory-architect.md:25 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:0da3f853f51afb2aa2996a280099dc2262adf18eaf79a1f138e8a0147f8d42a4, and its publishing row, state/consults/2026-10-16-boundary-inventory-architect.md:16 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:fe7fce1681547305f2e537d45c33c72a5792876cf0af665e01149034f880a1ce. This is evidence (a read at b88b1d2f), cited for what it reported. Every fact used here was re-read at 9a8bd4428251f6102610d514328d9fc49495e66e.
- lead-data's impact read: state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-impact-read.md (read at ab9a4b4f). This is evidence; the pointers this form used are listed under "Files read".

Drafted by: the architect agent, read-only. Drafted at main 54d07268 (state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-draft.md); revised at main 9a8bd4428251f6102610d514328d9fc49495e66e after the human's rulings and lead-data's impact read.
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full; both gates from dispatch (§0.5).
Pins: every pin is a historical pin at 9a8bd4428251f6102610d514328d9fc49495e66e. For the code the piece edits, its base tree is authoritative. For what this form read, the pin is. If a pinned line has moved by the base, the worker re-derives the site by symbol. Each pin's full commit id and sha256 were added by the custodian's script before this form was committed (Amendment 1 item 4). OPEN-1 (A)'s own pin stays at 54d07268, as ruled; the line read the same at 9a8bd4428251f6102610d514328d9fc49495e66e.

## §0. Disclosure

0.1 What exists.
- ADR-017 §13 (Accepted) says no local filesystem path, username, machine identifier or credential appears anywhere in a bundle, and that this is asserted by a scan over every byte of every emitted file: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:500-511 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:4a44e0ebbedcd8fe55215f9ae4ba3aaab9e31f7acafdf121cfeacfc3f7930781.
- The scan is `bundle::redaction` (kernel/src/bundle/redaction.rs:1-365 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:6a4239c840a6ba550119085ea676c506e63390b3647f455b02aabe3d4c439de8).
- `scan_directory` (kernel/src/bundle/redaction.rs:338-365 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f865bb5d9836b5ca02cf588c9d764a4ed02cea5a8ea6689582d94f00fc6250a4) has two callers, both in one test, `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle`: kernel/tests/publish.rs:441 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:56beff5502f1e18927c55c92cc5f89cc28cd33702906f99c6510e857177ab0ef and kernel/tests/publish.rs:477 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:3c2bc38e15f6906e26981b6b6346fdf63f1addb468993daa6d239f859c5a182b. That test runs over one synthetic-viewer fixture bundle (kernel/tests/publish.rs:94-116 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5021f57e0474d561fc9a96ee12ded4a670d5e972dbfb3166a98a5529cb917614, kernel/tests/publish.rs:421-482 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:480b375e43b1bd812727ec3df507eadd39320206c8fe6bc7f597a08ce56d962b).
- `scan` (kernel/src/bundle/redaction.rs:220-307 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9cd7ac2aaf5d90382f2af1ec54f7594a180e912f51989dfb53c68b83beb1e5d0) has one product caller, the audit log's record check: kernel/src/permission/audit/log.rs:76 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5a92ebb42a397effe6ed291a4e9f66c77ee2d5b0cd27981b6712afffa86431c2 (the import), kernel/src/permission/audit/log.rs:249-255 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e712395f181fa1312fbce6b5c644df284267a14e8b0949ee050fa43a4ee34180 (the identifiers) and kernel/src/permission/audit/log.rs:256 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:596af092e6e4b428ae8808b07085ad1115012fd8258ae33837a424ffedc57bf1 (the call). That check is over audit records, never over a bundle.
- No product publish scans its emitted files.

0.2 Earlier evidence. kernel/RESULTS.md:1314-1315 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f2a70015043efe9b57ad0c794570d50bb0c6f70f2e01c354be12d21a8f03f8dd reports the product scanner, run by hand over a 100k bundle with the real built viewer: 56 files, 0 findings. That is evidence at an older viewer build. Since then the notice set has grown, through the AGPL text, the EPSG section and the installed-program section: renderer/bundle-viewer/notice.mjs:135-236 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a9ab9436b0fed7949bd109bba9cd3be8ba187475a95c0eb4a0b2d322f172cbcd. So it does not settle O0.

0.3 Reuse index (the standing step). The custodian ran `node tools/reuse.mjs` in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The output below is byte-copied from the custodian's brief:
- `$ node tools/reuse.mjs redaction scan bundle` printed `No prior art recorded for "redaction scan bundle". Research it before planning an implementation.`
- `$ node tools/reuse.mjs publish emitted files leak` printed `No prior art recorded for "publish emitted files leak". Research it before planning an implementation.`

Both lookups missed. This is noted and does not block. The piece adds no new mechanism; it wires in an existing one.

0.4 Sibling search (AUTONOMY.md §14). The defect class is "a `docs/09` redaction function whose only callers are tests". One sibling: `Session::redact` (protocol/data-plane/src/session.rs:125-131 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f63be9fc9945cf6e91411fc145115c0f6cf0155e64568ecc6d10603de5e9bd0b). It is already node `session-log-token-redaction-rests-on-page-code` (PLAN.yaml:5411-5427 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7bb51474735b26bff9167af2221ff193967faa1dd468735b824733221fbab6de). No new node is proposed.

0.5 Gating route. §21a applies, under three of its bullets:
- the piece makes ADR-017 §13's stated guarantee true of the product, a property under test;
- it adds an uninterruptible term to the publish's cancellation window (ADR-018; §2.6);
- it adds a refusal the operator can reach in ordinary use.

It is also over §21c's 150-line bound (§7). So the full form and both gates apply from dispatch (AUTONOMY.md:315-332 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3 and AUTONOMY.md:482 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669), and no five-line form is committed.

0.6 Fixture drive: no measurement is taken, and the 5 GB fixture is not used.

## §1. May and may not claim

May claim, from §2 and §4's runs:
- every publish through `permission::boundary::execute` (the shell's execute and the `publish-bundle` CLI, which ADR-017 keeps as developer and test tooling: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1140 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:22245ad32149f55cda7ff080c01ec21b46b3e7a98c82e13dbce54397313cfec3) and every `publish_unguarded` call runs the unchanged `redaction::scan` over every byte of every staged file, after the last file is written and before the rename;
- a match that is not `operator-declared` refuses the publish with `PublishError::RedactionFinding`, code `publish.redaction_finding`, audited as `refused` with `error_kind` `RedactionFinding`. No bundle then exists under the destination name, and the staging directory is removed, or reported by `StagingNotRemoved` if it cannot be;
- the declared strings are exactly the two the format suite declares: the viewer's copyright and the corresponding-source `at` (kernel/tests/publish.rs:437-440 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:04a64a63ba90080524a949955e301a135f0da365e026337b000abc09926321ed);
- T1 to T5 and M1 to M7, as observed.

May not claim:
- that a published bundle carries nothing sensitive. The scan is a necessary condition only (kernel/src/bundle/redaction.rs:13-47 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:fdf06940e2d7ca3d04daa5912a75f875d0fec27d44ec771eaba98f050977d542):
  - a match must sit inside a run of at least 12 printable ASCII bytes;
  - a path among non-printable bytes is not reported;
  - an email address, a personal name or a postal address is not a class the scan knows (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:947-948 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:cf101365f1ce8c433766fd5409c72dfffc8388e1ef61afe5f3fb473490aa83bb);
- that the identity classes are scanned when the environment does not name them. `from_environment` reads `USERNAME`/`USER`/`LOGNAME` and `COMPUTERNAME`/`HOSTNAME`, at least 3 characters each (kernel/src/bundle/redaction.rs:117-142 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:15e135dfe73ac698538ea227ee425097231bee416af66094ef1f269439dcb6ea). An identifier it cannot read is not scanned for (§2.8);
- that the bytes scanned are the bytes renamed, against another process of the same user writing into the hidden staging directory between the scan and the rename. That window is declared, not closed;
- any duration: of the scan, of the publish, or of a cancel's acknowledgement while a file is being scanned. No `docs/08` row (docs/08_Testing.md:8 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:1185356552cbb402306f649f0c38dd4f85c109e86a2a64b34c12009d3e6ea558 stays unscored for this term);
- that `build_millis`, the sidecar's `finished_at` or the CLI's `build ms` includes the scan. All three are sampled before it (§2.3);
- that a declared string containing `"` or `\` is found in its JSON-escaped occurrence in `manifest.json`. It is not, and an identity match there then refuses: the scan fails closed, which is not a leak.

No ADR is amended (OPEN-4 (A)). There is no SKP, MCP, data-plane or wire change, and `protocol/` has an empty diff. There is no new dependency and no new `pub` item outside the `fixture` feature.

## §2. The change

2.1 What the scan checks, and what it does not (kernel/src/bundle/redaction.rs).
- It checks every byte of the bytes it is handed. Each match is reported only if it lies inside a printable-ASCII run of at least `MIN_PRINTABLE_RUN` = 12 (kernel/src/bundle/redaction.rs:179-196 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:23367e4103466e618f9f20b4a63570c4227c06429c4c9fe63fd617525b06c741). The classes:
  - `credential` and `local-filesystem-path` literal needles, ASCII case-insensitive (kernel/src/bundle/redaction.rs:146-166 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:fc70abcb0e057bc2454e8391efbabb75c17ea69d47a380ee5031ba102e334038): `credential`, `password`, `passwd`, `secret`, `api_key`, `apikey`, `authorization:`, `bearer `, `private_key`, `BEGIN RSA`, `BEGIN PRIVATE`; `file://`, `\\?\`, `/home/`, `/Users/`, `/tmp/`, `/var/folders/`, `AppData\Local\Temp`, `AppData/Local/Temp`;
  - a drive-letter path `X:\` or `X:/` that is not preceded by a word character (kernel/src/bundle/redaction.rs:258-277 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:8b4a8222d00f7d8fb7763f57c71e24dbd6abc8718f9611c367db7441b8111fd4);
  - the machine's usernames (`username`) and hostnames (`machine-identifier`) (kernel/src/bundle/redaction.rs:279-304 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9b491fd7695ac24ab455f1db5caa7617fce97ddc54d38a707fc50d309b74fd36).
- An identity match lying wholly inside an occurrence of a declared string is re-classed `operator-declared`. It is reported, never suppressed (kernel/src/bundle/redaction.rs:61-68 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:89939705d0784756af73fc02ae180041b81521c58ae7d340261494a3183eec70, kernel/src/bundle/redaction.rs:224-242 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:df27685c766f1d2ef47f571b8e114db06b1bae9641ad7c1c9629f799b5506800). Credentials and paths are never re-classed (kernel/src/bundle/redaction.rs:70-85 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7177e6a9aaf2b1d908c8032f0b7ee5841a6d90ebaa0bb24c0c5d75678d8efb38). A declared string shorter than 12 characters after trimming is ignored (kernel/src/bundle/redaction.rs:204-217 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9688a1e0cc7f9fad7c7a40935588244407507b9b0cb5373bde983bd0f2b3d2e9).
- What it does not check:
  - a match in a run shorter than 12 bytes (`C:/tmp/x`), or among non-printable bytes (kernel/src/bundle/redaction.rs:42-47 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:34a35eef154abf536fdbe76cc0d339a455d1c92fa8b7efb62e699c0994e07992);
  - path shapes outside the needle list (for example `/opt/…`);
  - any class it does not know (an email address, a personal name);
  - file names: only contents are scanned, and the walk reports relative names.
- `scan_directory` walks a directory depth-first, entries sorted, reads every file whole and scans it, then sorts all findings by (file, offset) (kernel/src/bundle/redaction.rs:338-365 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f865bb5d9836b5ca02cf588c9d764a4ed02cea5a8ea6689582d94f00fc6250a4).

2.2 Where the product publish emits each file (kernel/src/publish/mod.rs). Everything goes into one staging directory, a hidden sibling `.<name>.staging-<hex>` of the destination (`Staging::create`, kernel/src/publish/mod.rs:1438-1460 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:2577c10eb4cfb2eb851b60d003b062630c699d53bc5510cd4ae1e3b2966c7480, name at kernel/src/publish/mod.rs:1451 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ef7e7b642edfb4e7034a8a77f1a8d203c28b3db06b4596fde5850615335bf118), created at kernel/src/publish/mod.rs:636 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:30038f911c6a10cc5d1d9f71e120c7aca6f5e4b67fb9071cd8be355ab5ed32f5. Every file is written by `Staging::write_inner` (kernel/src/publish/mod.rs:1524-1581 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c150f01869d4880d29e18829f047ed75a10e15f33a886dad5ada34a0e2d442c3).

| File | Written at | Via |
|---|---|---|
| `data/part-NNNNN.arrows` | kernel/src/publish/mod.rs:807-808 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9124563ab3acbde4b918127c6491762e2f5bb0477ced40ee5fb8a1e4d8907510 (directory kernel/src/publish/mod.rs:735 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c537c6b6827e7228143018784e2ba2a405617210cce82d502362a1ec413d48f3) | `write_partition` |
| `style.json` | kernel/src/publish/mod.rs:833 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:bd511afaf81a2c0d2f4f3b3ea91786ac5a1b21391400eef2d832f05c8d7ecf40 | `write` |
| `viewer/<asset>` (`index.html`, `app.js`, `NOTICE.txt` from `renderer/bundle-viewer/dist` in the shell: frontends/shell/src-tauri/src/publish.rs:1383-1395 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9d1c145ac6f866d2faed46ab22d940ba041f17b6eac0bf48fea93adfde33ff42) | kernel/src/publish/mod.rs:837-852 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7bb35a78ef4ff350b12399fe5a8ce6ff8c258309db92fb0d4a0c98be7b525e16 | `write` |
| `manifest.json` | kernel/src/publish/mod.rs:902 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:24057f9505182204a9f373400b40e8e95382ce36b18b364a1dd61dff584c15f0 | `write` |
| `build-info.json` (the sidecar) | kernel/src/publish/mod.rs:927-930 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e | `write` |

The bundle is handed over by `Staging::finalize`'s rename (kernel/src/publish/mod.rs:1612-1629 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:636286d409a7b8f33bed258bc8a8675e3f86ba9bc153c1235efb737ee9efc348), called at kernel/src/publish/mod.rs:934 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a after `total_bytes` (kernel/src/publish/mod.rs:933 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:346aff1a7a03c1735a7761bbc9c5b51d302005a90574f6d893629a12d90fa7f8). The shell then returns `ExecuteOutcome::Success`, and the CLI prints its facts.

2.3 The one place: in `run_inner`, after the sidecar write (kernel/src/publish/mod.rs:927-930 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e) and before `staging.total_bytes()` (kernel/src/publish/mod.rs:933 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:346aff1a7a03c1735a7761bbc9c5b51d302005a90574f6d893629a12d90fa7f8) and `staging.finalize` (kernel/src/publish/mod.rs:934 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a). The gate:
- builds `MachineIdentifiers { declared: vec![req.viewer_license.copyright.clone(), req.viewer_license.corresponding_source.at.clone()], ..MachineIdentifiers::from_environment() }`, the test's own construction (kernel/tests/publish.rs:437-440 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:04a64a63ba90080524a949955e301a135f0da365e026337b000abc09926321ed). These two strings reach the manifest unchanged (kernel/src/publish/mod.rs:1204-1210 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:00bda3cfb834fee9d48d15fa6bf76bfefac5cbf0c4ed14d23ebd658d8bb22d2e);
- walks the staging root in `scan_directory`'s order;
- calls `watch.check()` before each file;
- reads each regular file whole and passes its bytes to `redaction::scan`, unchanged;
- stops at the first file holding a finding whose class is not `OPERATOR_DECLARED`;
- returns `PublishError::RedactionFinding` for that file, with its findings sorted by offset: `file` (the bundle-relative path), `class` and `byte_offset` of the lowest-offset one, and `count`, the number of such findings in that file;
- refuses a failure to list a directory or read a file as `PublishError::Io`, with a context naming the redaction scan, never as a pass. This follows `total_bytes`'s own walk (kernel/src/publish/mod.rs:1597-1601 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a28b6c73d9f9083f9019e4d376148fcf1aaf67f0989c9cda3b7a6e2e0bbb0401). It does not go through `error::classify_io` (kernel/src/publish/error.rs:467-512 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:314fdedc91473072247a9080a9e37cb58a253950ae131e727cc6175e094b460b), whose access-denied and sharing-violation arms would report a failed read as `DestinationNotWritable`.

The build figures (the impact read's question 4). The gate runs after `build_millis` is sampled (kernel/src/publish/mod.rs:913 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:686e30ee8e740945e59a17a0530434c464c78320deb2e6cc7f42801348240e79), after `finished_at` (kernel/src/publish/mod.rs:920 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f9f3f967cd87ebc3cb168208eacdcb6bfc2f735b468c4182d0fced68830be092) and after the sidecar is written (kernel/src/publish/mod.rs:927-930 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e). So none of the following includes the scan:
- the sidecar's fields;
- `PublishOutcome::build_millis` (kernel/src/publish/mod.rs:942 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:479828d401310fe48a2a1be5f8b6233d99cdc6817048adaeba522fbe5a3f29fb);
- the CLI's `build ms` line (kernel/src/bin/publish-bundle.rs:667 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:da5886519fc9af1b494939191abd9c3bb8e74100d30e5982fff334f72d353252);
- the shell's `Success.build_millis` (frontends/shell/src-tauri/src/publish.rs:848 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e4719e9baefddcf46cb10ecf1ed2cd96e1780e35fc21daf919dc3f83ec1f500d), which no renderer uses (frontends/shell/src/publish/types.ts:78-83 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:35263dd8e02513e00a45ad8da3e13ce9ea91358f5231a30ff9f6c1be4b0bfc4e).

That follows from the placement: the sidecar must be on disk to be scanned. Their meaning is unchanged, so figures recorded before this piece stay comparable with figures after it. A harness's outer wall time of a publish includes the scan. No doc sentence about them is changed.

Findings held (the impact read's question 5). The gate holds one file's `scan` result at a time. A file whose findings are all `operator-declared` is dropped before the next file is read, and the walk stops at the first file holding another class. No count ceiling is declared for that result, and none is added, because `scan` is on §2.4's byte-identical list.

The bound is derived, and declared here in the units it bounds (ADR-010 rule 6, docs/adr/ADR-010-render-frames-origins-boundaries.md:70-72 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:0ab685667cc219d003c6654139e8abb5af4ab7f0d8c020ebe6f469b5ed381a17):
- `scan` makes at most one finding per pattern per byte position (kernel/src/bundle/redaction.rs:244-304 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:543de42a05a96d918bb43a42fc8fd4ff2b74ee93f7b4b54e6e160af5eb15b4fb).
- So a file of L bytes yields at most P × L findings. P counts the 19 needles (kernel/src/bundle/redaction.rs:146-166 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:fc70abcb0e057bc2454e8391efbabb75c17ea69d47a380ee5031ba102e334038), the drive-letter rule, and the at most three usernames and two hostnames `from_environment` reads (kernel/src/bundle/redaction.rs:120-133 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9f9688993c9db8fbe997f6c82b42dffe99a0a3728b22c2631bcc690fcfee42ff), so P ≤ 25.
- Each finding carries its file name and an excerpt of at most 48 bytes around the match plus the match itself (kernel/src/bundle/redaction.rs:309-318 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:d8ef146390dd22930f3b8fecfd7fae4ac219f74fea63cf41911e3d45814a1981). `from_utf8_lossy` can then replace an invalid byte with a three-byte character.
- L is bounded as §2.6 states.

Reaching that order needs data that repeats a pattern throughout one file; ordinary data with a path per row yields findings in proportion to its rows. The test helper `scan_directory` keeps reporting the whole bundle.

2.4 kernel/src/bundle/redaction.rs.
- One private walk, shared by `scan_directory` and the gate. It visits the same files in the same order as today's walk.
- `scan_directory`'s signature, return value and final sort are unchanged.
- One `pub(crate)` function for the gate, for example `first_undeclared_findings(root, machine, before_each_file)`; the shape of its error is the worker's. Its product caller is `run_inner`.
- One module-doc paragraph, W7.
- Byte-identical: `scan`, `CREDENTIAL_NEEDLES`, `MIN_PRINTABLE_RUN`, `ATTRIBUTABLE_CLASSES`, `OPERATOR_DECLARED`, `declared_ranges`, `in_printable_run`, `find_all_ascii_ci`, `finding`, `MachineIdentifiers` with `from_environment`, and the whole `mod tests` (kernel/src/bundle/redaction.rs:367-589 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:cf9f6797986e240acac2285cd75d3d350aad5e7fd62719401a434d433e249660).

2.5 What happens on a finding, end to end.
- `run_inner` returns the error. `publish_prepared`'s error arm removes the staging directory, or returns `StagingNotRemoved { after }` (kernel/src/publish/mod.rs:638-653 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b29068705e7d7d01a6a60229c3fc65e73a235b1f2d54d6431685a1b560eba9a9). A panic is covered by `Drop` (kernel/src/publish/mod.rs:1645-1668 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:50003494bfebf1cf08e97566bf7ce084d24945b85481e5a50fe20c7b2a43a335).
- `boundary::execute` writes the outcome record through `finish` (kernel/src/permission/boundary.rs:453 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:61352fa0c10a86ae89887dc9df3ccf495864a9d79296ea0cba7db4a880fbf9c8, kernel/src/permission/boundary.rs:482-506 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:441d309b5fbe1409dd599d83543499cb262f509640f927db0f08ab2ec006c5e6). The new arms:
  - `error_kind` gains `RedactionFinding` (kernel/src/permission/boundary.rs:203-250 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f966afa97fbbe41e125b80a5520d44d3b17ddab5f59a3de23b975821f4380641);
  - `publish_outcome` classes it `Refused`, as the gate working (kernel/src/permission/boundary.rs:280-310 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7789020fa8a91d7b148cb351d35f50376e736432285a3c0455e30b1baa470db4). Under `StagingNotRemoved` the outcome follows the inner error, as today (kernel/src/permission/boundary.rs:283 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a4c05974eaf03bc9239bc1ee25af25ad311f0514d8d1a8485de152f4e6cf45b2).
- The outcome record carries `error_kind` only, never a message (kernel/src/permission/boundary.rs:482-497 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:51ccd454ca7ab601cfef2df6456ae33bb76b8fc696e1d5c46fa7b51f9dae9f17).
- The shell maps `BoundaryError::Publish(e)` to `ExecuteOutcome::Refused { message: e.refusal_detail() }` (frontends/shell/src-tauri/src/publish.rs:858-862 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c0aa663fc262ff94f0b22b98cf857378f4beaeb529fbea3dc3912afbebace260). `formatPublishRefusal` reads any `publish.<snake_case>` prefix (frontends/shell/src/publish/formatPublishRefusal.ts:44 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:bf31984d2c1247f06741113bd89d24002369d52c53c26491a5e4a83f53793695), so the shell needs no change.
- The CLI returns the error from `boundary::execute` (kernel/src/bin/publish-bundle.rs:656 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a24e566543e83549698c0a0d18d53f3db76966854ad7b517373486fbde9f8bcc), and `main` prints its `Display` (kernel/src/bin/publish-bundle.rs:166-171 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ce10c187dcd4d9e59802514a40dc0a8e1dfb682721f3a649a2c31635265e3f84). `BoundaryError::Publish`'s `Display` is the inner error's (kernel/src/permission/boundary.rs:162 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:1158750ce70bc6870a9fea5be6218257d8f40d48f61c444110f725ae06b6d13b).
- The class-3 act (the rename) never happens. ADR-006's class and `REVERSIBILITY_CLASS` are unchanged, and so is ADR-010 rule 7's recovery policy (kernel/src/publish/mod.rs:60-64 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:92f494660e305996462c9eda7704e8c8af5c50c9e466e0b7e606fc04961fb35b).

2.6 Cancellation and cost (ADR-018 vocabulary; the impact read's questions 1 to 3).

The gate adds sections to the `Finalizing` window, after the check at kernel/src/publish/mod.rs:906 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ae41f0aafaf78de9eecf55f74ab68054e0bd2cc5c0311d7a35972b52996379aa and before `finalize` (kernel/src/publish/mod.rs:934 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a). `watch.check()` runs before each file, so the window between checks is one file's listing, read and scan.

Classified under ADR-018 §4 (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:78-88 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:d25698d56329e26cf6bf8ab59cba7c5ef6d9eb19893aa9d1ac8fed312c66d628):
- (a) code-controlled cadence: one file between cancellation checks. It bounds work in files. In bytes it bounds work only as far as each file's own size is bounded (below). No new constant is declared.
- (b) unbounded external sections: each directory's `read_dir`, each entry's type check, and each file's `std::fs::read`. These are blocking filesystem calls this code cannot interrupt.
- The `scan` of one file's bytes: a code-controlled quantity of at most that file's bytes. Its per-byte cost is unmeasured and not claimed, on the precedent of Corrigendum 4's encode row (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1087 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b03dd7ce338c8d888fb1888e8378ed97b11f2d64c18fb4d6d7d884dfae357dbc).

No section here is a time bound, and none is netted against another.

Where the term sits (question 2):
- Corrigendum 4's table decomposes §15's partition-write window (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1076-1093 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:429bce7164d81677e5746c44371b4ba6c4d0487d3d9442cd8a7a9c3858dab575).
- kernel/CANCELLATION-AND-TRACING.md §3's table (kernel/CANCELLATION-AND-TRACING.md:87-95 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:3b08f4b66bacaa940a72a02a0fef624b9962eb53471ec10e94a4c8932f7eebeb) covers the pre-first-batch and partition-write windows.
- The new sections are in the `Finalizing` window, which neither table lists. Neither table lists that window's existing sections either: the heuristic re-check (kernel/src/publish/mod.rs:911 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7bd1228f7635778f7857c62f746a9af08f7453257309b98e8420fde87183f8ec), `total_bytes` (kernel/src/publish/mod.rs:916 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:eb0190bc626db79deee2f480dbfa03625f07632586ad22d6c6cd37ae5c9f45b7, kernel/src/publish/mod.rs:933 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:346aff1a7a03c1735a7761bbc9c5b51d302005a90574f6d893629a12d90fa7f8) and the sidecar write (kernel/src/publish/mod.rs:927-930 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e).
- Neither table is edited (OPEN-4 (A); the design note is not this piece's). The classification is recorded here and at the site (W4).
- After the last file's check, that file's read and scan, `total_bytes` and the rename run unchecked. A cancel arriving then lets the publish finish, which KNOWN-LIMITATIONS item 30 already states (KNOWN-LIMITATIONS.md:338-340 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:0e3cb061e016f5184e4c24e6291c31404497053fae68fc4a3350f972d7008f0d).
- No new phase (OPEN-2 (A)) and no new trace span.

The bytes of one file (question 1):
- `data/part-NNNNN.arrows`:
  - A batch is cut before a row that would take its estimate past `PUBLISH_PARTITION_TARGET_BYTES` (1 MiB; engine/src/stream.rs:131 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5652f88baf508ecd91558123f934678d75a53c6c160c66f025430c2631a486ae, engine/src/stream.rs:2028 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:43e253df6776df28bdb456f59120c46fa3df9890f2692626fa061611ea71797c). So a partition of more than one row is at most 1 MiB on the producer's estimate.
  - A single row larger than that is a partition of its own, refused above `MAX_BATCH_BYTES` (4 MiB; engine/src/stream.rs:49 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:2bb8e5d47fed5a98d308688cbe6222878c71ce6ba1deddf5c7cc681deca67949, engine/src/stream.rs:2488-2505 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9e3291b5bbdf0853b33fe49d3995e83fb351d841871c1c9f1604a55d40a8e772).
  - The file adds the Arrow IPC envelope, for which this form found no separate ceiling.
  - So the bound on one partition's scanned bytes is `MAX_BATCH_BYTES` on the estimate, not 1 MiB. The "≤ 1 MiB" at kernel/src/publish/mod.rs:1509 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a4c8fe4f56dfb3383e76dfe0e8ba409e282f159651bc95f0b423e464c63e17db holds for the multi-row case only.
  - The largest recorded partition is 880,712 B (kernel/RESULTS.md:1390 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5666d5eb7dd4d95814c1eba5d4d35c74bc99f5a144d434d8350323ce061a9fee).
- `viewer/<asset>`: at most `MAX_VIEWER_ASSET_BYTES` (16 MiB; kernel/src/publish/viewer_assets.rs:35 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:38154691a2e04353e34d0db5e051d492dcbb1adcf631f975e3db3891968d9a72). The largest recorded is `viewer/app.js`, 437,588 B (kernel/RESULTS.md:1327 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:37ec72ae3e69e158edee263b750f8820ff88d307b2f144a7347987225efdc3b0).
- `manifest.json`, `style.json`, `build-info.json`: this form found no byte ceiling of their own. The manifest lists every partition, so it grows with the partition count, which `MAX_PUBLISH_PARTITIONS` (100,000; engine/src/stream.rs:174 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b99809b549dd770be1702f624c95f99b9b983b9849c7b37ae891252bbdf02dc2) bounds. Recorded: 16,020 B at 51 partitions (kernel/RESULTS.md:1391 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:703f0911eff51b17d6791cac28be8f793fb1f87086cc380cf64eca9a60f34423).

Cost (question 3):
- No duration is claimed for any bundle size (§1), and docs/08 has no publish-duration row (docs/08_Testing.md:5-9 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:cf53ed89ddad43f43e5e3436cf10c908a8191663f42bbed5be0d5f646f154d3f).
- The cost is stated in bytes. The gate reads every staged byte once more from disk, the same set `total_bytes` measures (kernel/src/publish/mod.rs:933 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:346aff1a7a03c1735a7761bbc9c5b51d302005a90574f6d893629a12d90fa7f8), and passes over each file once per pattern (at most 25, §2.3).
- Size reference points, cited for what they report:
  - the 100k fixture's bundle, 44,601,149 B in 56 files (kernel/RESULTS.md:1314 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:04c82ecae4a33514c9f3918238e250ce6d7d1d57c07d500cbcd8e0bb97839771, kernel/RESULTS.md:1329 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:4e45ef47a93a42e5d76e5dce171256921831c865e4560fb4863637ab58f686d4);
  - the 5 GB source's publish of record, 5,737,397,728 B in 6,636 partitions (kernel/RESULTS.md:1731-1732 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:8bc255d45194548e76e96aad5f60247b432e00451d6d70c039f9dd90dcb7c2ed). That figure is from the fifth section of 2026-08-07 (kernel/RESULTS.md:1610 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:d68cafd8638fc2532de170b8713be928a6c3d6bf8b37b8aa7020c4887fa7df73), before ADR-025's acceptance.
- A whole-file publish of that source now refuses at preflight on `MAX_FEATURES` (KNOWN-LIMITATIONS.md:79-88 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:640d3e4097d635ff56c6e95caa6354796d537ddab883b6cbbc6bc6a82456e4d9). But `MAX_RESIDENT_BYTES` is checked at no stage, and `predicted_features` is `None` on the `DeclaredNotVerified` identity route (kernel/src/publish/ceilings.rs:107-119 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b20232226a82cd2f0489386df5c4658391991058475bea85d3297afe1bc31970; KNOWN-LIMITATIONS.md:90-94 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:396bcf1cbf8e55c03b32285267f1ffb24f04bdd397ceb90b4bab36445cc0400b). So a bundle above 512 MiB still publishes.
- The only hard bound on a bundle's partition bytes is `MAX_PUBLISH_PARTITIONS` partitions of one partition's bound each. The cost is stated against that largest publishable bundle, in bytes, and is not measured.
- The operator sees `finalizing` for the whole scan (OPEN-2 (A)). A refusal on a large dataset arrives only after every partition is written.

2.7 kernel/src/publish/error.rs.
- The variant `RedactionFinding { file: String, class: &'static str, byte_offset: usize, count: usize }`, with no excerpt (OPEN-1 (A)). Its doc is W3.
- `code()` arm: `"publish.redaction_finding"` (kernel/src/publish/error.rs:247-278 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7413a5e56351158ec9f12eb88aadab24843974aff548afc3a5aacc3b043853c1).
- `Display` arm: W1, a P6 placeholder, on the `GeometryEncodingNotPublishable` precedent (kernel/src/publish/error.rs:400-406 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c6cd6b56482eef04fbf5b3fe5e1e40bf307ab958f8537f51d6483b9fa72ea4f2).
- kernel/src/permission/audit/reader.rs: `plain_reason` gains `"RedactionFinding"` with W2 (kernel/src/permission/audit/reader.rs:226-284 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:aa47fa5b252293cf10ad96ef906bbfbf787acff9ec03046f2147ee86c60a70f1). Without it, `--audit-show` would print the kind as unrecognised (kernel/src/permission/audit/reader.rs:282 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:343a2ce0ac92760ceab43f825daea4719832dc4b37dfee8e07d14cd3bd63cc78), against the exposure review's legibility condition (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1123-1125 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:729b169d4949cae509c6d9ecd5116770e48a04e643ef77995eb11d27b699b681).

2.8 Portability (state/directives/PORTABILITY-2026-09-30.md, R1 to R6).
- The owning boundary is publishing (kernel). No OS cfg is added.
- The byte classes behave the same on Windows, macOS and Linux.
- The identity classes depend on the environment:
  - Windows is supported (`USERNAME`, `COMPUTERNAME`);
  - macOS and Linux are explicitly reduced: `HOSTNAME` is often not exported to a child process, and the hostname is then not scanned (kernel/src/bundle/redaction.rs:115-116 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:1b10d4cf9d48a352163eff8f5c04340fd7578c1d19464375fda8f155e0ebd3d5). This is reachable only through the CLI or the kernel there, because the shell is Windows-only.
- Kernel tests run on Windows and ubuntu in CI; the shell tests on Windows. No KNOWN-LIMITATIONS item is owed for this, since no shipped Linux or macOS product exists.

2.9 Seams (the human's rule of 2026-09-16, round 4).
- Kernel to shell: the consuming side's actual interface is `refusal_detail()` through `ExecuteOutcome::Refused` (frontends/shell/src-tauri/src/publish.rs:858-862 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c0aa663fc262ff94f0b22b98cf857378f4beaeb529fbea3dc3912afbebace260) and the prefix regex (frontends/shell/src/publish/formatPublishRefusal.ts:44 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:bf31984d2c1247f06741113bd89d24002369d52c53c26491a5e4a83f53793695). T1 is the end-to-end proof from the real shape: `prepare`, then `execute`, then `boundary::execute`, then `publish_prepared`.
- Kernel to the audit reader: the `error_kind` string. T5 reads the real record and T4 the reader.
- Engine fixture to the tests: test support behind `fixture`, on the precedent at engine/src/fixture.rs:194-195 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:79721bfe4910785d6ac5242196190b87c21b04b7f20184930c91f5dc293deea3. It has no shipped caller, by that precedent.
- Caller rule: the gate function, the variant and the reader arm each have a product caller. Nothing new is `pub` outside `fixture`.

2.10 Words. W6 is the human's: approved as drafted (OPEN-3 (A)). W1 is a P6 placeholder for an app string. W2 to W5 and W7 are the architect's; the worker applies them and the PR body lists them. The clause checks are under "Words, checked" below.

## §3. Fixtures

- F1: engine/src/fixture.rs gains `pub fn write_zone_texts(path: &Path, zones: &[&str])`, behind `fixture`. It writes one Polygon feature per value: `id` UInt64 from 0, `geometry` WKB, unit squares in LV95, `zone` Utf8 holding the given values, and GeoParquet metadata as in `write_hostile_batch` (engine/src/fixture.rs:1627-1680 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b8e9e58619727ade4abb35776229e9b4dda21868eaa94907963ec3a38c53a0c4).
- T1 and T5 use 10 values: `residential` ×9, and at index 3 `C:\Users\someone\AppData\Local\Temp\leak.parquet`. The `AppData\Local\Temp` needle fires whatever the neighbouring bytes are.
- Predicted for T1 and T5: the first undeclared file is `data/part-00000.arrows`, class `local-filesystem-path`, count ≥ 1.
- Each test writes its own fixture per run; nothing is pinned by hash. The 5 GB fixture is not used.

## §4. Tests and mutations

Every mutation and run is observed the same way: apply it, run the named test alone, record its outcome by name with the commit it was observed at, and revert. A verify-mutation run is never called an observation (round 25, item 2 (c)).

New tests:
- **T1** (frontends/shell/src-tauri/src/publish.rs, `mod tests`): `a_publish_whose_styled_column_holds_a_path_is_refused_by_the_redaction_scan_and_nothing_reaches_the_destination`. It uses `env_lock`, `AUDIT_LOG_ENV`, F1, `prepare` with the module's `STYLE`, then `execute` with the right phrase, and asserts:
  - `ExecuteOutcome::Refused`, whose message starts `publish.redaction_finding: ` and contains `data/part-00000.arrows` and `local-filesystem-path`;
  - the destination is absent, and `staging_entries` (frontends/shell/src-tauri/src/publish.rs:3163 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7d7b613d15aebefd18d4e9b971ff0eb533845598866350be06ea10a5eb105fcf) is 0;
  - the audit log holds 2 lines, and the outcome line has `outcome` `refused` and `error_kind` `RedactionFinding`.
- **T3** (kernel/tests/typed_terminal_codes.rs): `a_redaction_refusal_detail_begins_with_its_typed_code`. It asserts the code, the `refusal_detail` prefix, that the detail ends with `Display`, the `[P6 placeholder] ` prefix, and that the text contains the file, class, offset and count.
- **T4** (reader.rs `mod tests`): `a_redaction_refusal_reads_as_its_plain_reason`. A refused pair with `error_kind` `RedactionFinding` renders W2 and not the unrecognised sentence.
- **T5** (kernel/tests/permission_boundary.rs): `the_boundary_refuses_a_bundle_whose_data_holds_a_path_before_the_rename_and_audits_it_as_refused`. It uses F1 with `grant_for`, `run_attempt` and the right approval, and asserts:
  - `Err(BoundaryError::Publish(PublishError::RedactionFinding { file, class, .. }))` with the §3 values;
  - `no_side_effect(dir, destination)`;
  - the outcome record is `refused` / `RedactionFinding`.

Unchanged and still passing (the clean side, from the real shape):
- `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` (frontends/shell/src-tauri/src/publish.rs:1856-1909 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:1dba0686e1221df1fac49d916619a0fd4a25b7bb6bfb11204eaf0ab6107443b7);
- `granted_and_approved_publishes_and_records_a_success_with_the_manifest_hash` (kernel/tests/permission_boundary.rs:525 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:bd23fddf124ebefb8f2d3b35eacc54e9932cf067acf27d11ba3ea86ebd38a0b8);
- `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle` (kernel/tests/publish.rs:421-482 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:480b375e43b1bd812727ec3df507eadd39320206c8fe6bc7f597a08ce56d962b);
- every redaction unit test (kernel/src/bundle/redaction.rs:385-588 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e14de3e0f62680fd2151d9ce2d16e6bebb7e5a1622b0d3a1f0822bf2ae905672).

Mutations:
- **M1:** delete the gate call in `run_inner`. T1 fails at its `Refused` match and T5 at its `Err` match.
- **M2:** class `RedactionFinding` as `Outcome::Failed` in `publish_outcome`. T1 and T5 fail at the `refused` assertion.
- **M3 (the scan weakened):** in the gate walk, skip every file whose relative path starts with `data/`. T1 and T5 fail.
- **M4:** change the code's string. T3 fails at the code assertion.
- **M5:** delete the `plain_reason` arm. T4 fails by name.
- **M6 (over-firing):** make the gate refuse every bundle. The two unchanged success tests above fail by name.
- **M7, a predicted survivor:** delete the per-file `watch.check()`. Every test passes; the gate reads the line.
- **Known gap:** the `operator-declared` filter is proven only on a machine whose login name appears in a declared string. O0 and R1 on the custodian's machine cover it.

Runs:
- **O0 (at B, before any code):** a scratch integration test, never committed or pushed. It builds `renderer/bundle-viewer` with `npm run build` at B. It then publishes `kernel/tests/publish.rs`'s 2,000-feature fixture through `publish_unguarded`, with `ViewerAssets::from_dir(renderer/bundle-viewer/dist)` and `bundled_viewer_license()`'s copyright and route. Finally it runs the unchanged `scan_directory` with those two strings declared, and records every finding.
  - Predicted: no finding outside `operator-declared`.
  - Any other finding: STOP before code. The human rules, and the scan is not weakened.
- **R1 (at H, the custodian's machine, debug app):** frontends/shell/e2e/publish.mjs, steps APPROVED' and REFUSED', pass unchanged (the real app, the real viewer, the gate in the path).

The scratch test is never committed, and the worktree is shown clean after the run.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: T1, T3, T4 and T5 pass at H, and each of M1 to M6 fails its named tests as §4 states.
- P-2: M7 survives.
- P-3: O0 finds nothing outside `operator-declared`, and R1 passes.
- P-4: every existing test passes, in the workspace on both CI platforms, in the shell suite, and on the custodian's machine.

Declared unchanged:
- §2.4's list, byte for byte;
- kernel/tests/publish.rs;
- `PublishPhase` (OPEN-2 (A));
- `protocol/**`, `frontends/shell/src/**` and `frontends/shell/e2e/**`;
- every ADR, docs/08, and SKP-V0.md.

Invalidators:
- O0 finds a finding outside `operator-declared`: stop before code, and the human rules (class 2).
- An existing test is refused by the gate: stop, return to the architect, class 2. Never weaken the scan.
- M1 to M6 do not fail as predicted: stop, class 2.
- M7 fails: class 2, no stop.

Falsification: a product publish whose staged file holds a match that is not `operator-declared` and that completes the rename.

## §6. Instruments

- Every quantity is an assertion: the typed outcome, the record's `outcome` and `error_kind`, the presence of the destination, and the staging entry count.
- O0 and R1 are pass/fail outcomes, not measurements, and carry no docs/08 row. Their logs are filed by the custodian as evidence, not Authority.

## §7. Declared values and ceilings

- At most 432 changed lines by §21c's rule, tests included. Counted with `git diff --numstat B H -- <the files below>`, where B = `git merge-base origin/main H`. The PR body names both.

| File | Ceiling |
|---|---|
| kernel/src/bundle/redaction.rs | 58, outside `mod tests` only |
| kernel/src/publish/mod.rs | 35 |
| kernel/src/publish/error.rs | 30 |
| kernel/src/permission/boundary.rs | 8 |
| kernel/src/permission/audit/reader.rs | 30 |
| kernel/tests/typed_terminal_codes.rs | 35 |
| kernel/tests/permission_boundary.rs | 70 |
| engine/src/fixture.rs | 50 |
| frontends/shell/src-tauri/src/publish.rs | 90, `mod tests` only |
| KNOWN-LIMITATIONS.md | 14 (OPEN-3 (A): W6) |
| kernel/README.md | 8 (owner's index: kernel/README.md:360 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ea9563a39d56f67badf1bb4c381c262bffe6d5407583ac3cfdd1d462d580d1df, kernel/README.md:372 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a40ce7933989427f275f942bab364cd604acd3980cdbbc1139e4ddd341c519c7, kernel/README.md:373 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c5d9d05217a75542634f545a94f5098cf17d2137af08be6c4c2290e508c41a3e, kernel/README.md:392 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:66bfb9df9c902b9cc1deee76f9cd950da822b62308f4dfd5d1b57a37e1191fb2; lead-data's update) |
| engine/README.md | 4 (owner's index, lead-data's update) |

- Non-generated files: this form and the 12 above.
- No constant is added. The findings held for one file have the derived bound §2.3 declares. The per-file cadence of §2.6 is bounded in bytes as follows:
  - partitions: by `MAX_BATCH_BYTES`, on the producer's estimate;
  - viewer assets: by `MAX_VIEWER_ASSET_BYTES`;
  - `manifest.json`, `style.json` and `build-info.json`: by no declared constant.
- **Budget: 240 minutes.** The custodian sets it as the node's `budget_minutes` in PLAN.yaml, replacing 60, after governance D's click (§9, Overlap).
  - The work: twelve files and this form, at most 432 changed lines, seven mutations each run alone, O0's viewer build and scratch run, R1 on the custodian's machine, and the shell suite.
  - For comparison, the full-form nodes `land-45` and `polish-87-88-89` carried 240.
  - Past twice the budget the node stops (AUTONOMY.md §10).
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Code before this form is committed on main with the custodian's hashes; code before O0 is recorded.
2. **The scan weakened**, by any of:
   - any edit to an item in §2.4's byte-identical list;
   - a declared string beyond the two;
   - any file, directory or byte range skipped, or a file's bytes split before `scan`;
   - a finding downgraded to a warning, logged and continued, or counted against a threshold;
   - an I/O error read as a pass.
3. Any edit to kernel/tests/publish.rs or to redaction.rs's `mod tests`.
4. The gate placed anywhere but once, after the sidecar write and before `finalize`; or any path to `finalize` that bypasses it.
5. A rename after a finding.
6. The matched text in the refusal (OPEN-1 (A)) or in the audit record; anything beyond `error_kind` in the record.
7. A new `pub` item outside `fixture`; the fixture writer outside `fixture`.
8. Any diff under `protocol/`, `frontends/shell/src/` or `frontends/shell/e2e/`, or to SKP-V0.md, an ADR or `PublishPhase` (OPEN-2 (A), OPEN-4 (A)).
9. A string the app shows that is not marked `[P6 placeholder]`; KNOWN-LIMITATIONS words other than W6, byte for byte (OPEN-3 (A)).
10. A claim beyond §1.
11. A path:line cite in a code comment.
12. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- **Architect and reviewer, both from dispatch** (§21a; §25 (e)). Verdicts follow state/directives/2026-10-05-product-first-direction.md, section 2: block only on Correctness or Evidence; Documentation findings are fixed in this PR before the merge.
- **Architect:**
  - §2.3's placement and §2.5's chain against the cited sites;
  - the §2.4 list byte-identical against B;
  - the caller rule (§2.9);
  - W1 to W7 against the code;
  - §8 item by item;
  - §1.
- **Reviewer:**
  - the full diff;
  - every hash recomputed;
  - M1 to M7, O0 and R1, each against its commit id;
  - the §7 count;
  - the owner's-index updates against the diff.
- **Suites:**
  - `cargo test -p spatial-kernel` (lib, `--test publish`, `--test permission_boundary`, `--test typed_terminal_codes`);
  - `cargo test -p spatial-engine --features fixture --lib`;
  - `cargo test` in frontends/shell/src-tauri;
  - `cargo fmt --all --check`;
  - the workspace by CI on both platforms, and the shell CI;
  - the node --test scripts suite, verify-plan, verify-cites, verify-quotes and verify-test-claims.
- **Heavy runs** (O0, R1, the shell suite) follow the machine paragraph the briefs carry, in shared holds.
- **Merge:** a merge commit, never a squash.
- **Operator:** no walkthrough row in this piece (MANUAL-WALKTHROUGH.md is the docs lane's). W1 joins the sitting's sight list as a P6 placeholder, on the custodian's record.
- **KNOWN-LIMITATIONS:** one new item, W6 byte for byte, at the next free number (OPEN-3 (A)).
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:6baf1cbfb7e93952f2c41c71be144cafc5c06ced596e2b8f4d3db5410b42821c). lead-data writes it and the worker applies it:
  - kernel/README.md:360 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ea9563a39d56f67badf1bb4c381c262bffe6d5407583ac3cfdd1d462d580d1df (last verified), kernel/README.md:372-373 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:2217e7edc47aab22b5ed3afcc879020e0aa71a5b172232809be67a0d66d37b6d (the publish and boundary rows gain T5) and kernel/README.md:392 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:66bfb9df9c902b9cc1deee76f9cd950da822b62308f4dfd5d1b57a37e1191fb2 (declared limits gain W6's item number);
  - engine/README.md:530 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:165ed48655eb8523d81798a44339933c0814b825014db5efd1bfe6cc151f122b and engine/README.md:546 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9d1aada281b9e6b5aaf10bf751824a82957ec8f6f5ed3a6576cfd4144c62aec4.
- **Overlap: rule (00)** (AUTONOMY.md:609 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0). Separate KNOWN-LIMITATIONS items, walkthrough Parts and e2e README entries count as separate paths (state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:551c2c8c99555a9cf256d5cc1279d1c659a809b72cf150094b8574206ec63c92).

  This piece's paths:
  - kernel/src/bundle/redaction.rs;
  - kernel/src/publish/mod.rs and error.rs;
  - kernel/src/permission/boundary.rs and audit/reader.rs;
  - kernel/tests/typed_terminal_codes.rs and permission_boundary.rs;
  - engine/src/fixture.rs;
  - frontends/shell/src-tauri/src/publish.rs (`mod tests` only);
  - KNOWN-LIMITATIONS.md (one new item);
  - kernel/README.md and engine/README.md (owner's indexes);
  - this form.

  PLAN.yaml stays the custodian's, on main. Nothing is under `protocol/`, no wire fixture is touched, and neither Cargo.lock nor package-lock.json changes (no new dependency).

  - **Governance D** (PR #237). Its paths, scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ce62cea8b0d6da493cd9d301f773d62a90243dc02485daa767299ef15d8e9567:
    - `scripts/plan/rotate-plan-summaries.mjs` and its test;
    - `scripts/plan/verify-quotes.mjs` and its test (conditional);
    - `scripts/plan/README.md` and `AUTONOMY.md`;
    - at S10: PLAN.yaml, `CUSTODIAN-QUEUE.*`, `site/`, `state/cut-archive/` and `state/drafts/`.

    No path is shared. The only contact is PLAN.yaml, through the custodian's rows for this node. Under D's OPEN-5 (B) (scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:502 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:d3e45b62d12da6ea5e9615bae8a23a888b3dec12ae4bbea205df02178c2dccb4), every commit touching PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` is held from D's S9 to its click. So this node's budget (§7) and status edits wait for D's click. This form's own commit touches none of them and may land before the click.
  - **PR #239** (walkthrough-current-view-rows-g1-n5). Its paths are listed at frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e007af93d7e8ba283a0581acadc65406bba173d2efc314778c3859d8de04fd05: `MANUAL-WALKTHROUGH.md` Part G row G1 and Part N row N5, its form, PLAN.yaml and the generated files. Disjoint: this piece edits no walkthrough row.
  - **ADR-036's pre-acceptance block** (docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md). Its draft's files are listed at state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:329 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:1caa2c26664d66a06bcb97049d2b074c0a6354537e86f3bda0d4f7905fc04f0e: ADR-036, the generated `docs/README.md`, its form and PLAN.yaml. Disjoint: this piece edits no ADR (OPEN-4 (A)) and nothing under `docs/`.
  - **Piece 1c.** Its drafted groups are at state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:338-347 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ae3a4fe42bda1196da3ec798ba875fab2a449a13dca0b718daeddf95f86a8320, state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:354-363 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:cb7b394e6938d7bb012d2f02b513688de71bbfaf210117d9debb9d6197acdfec and state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:370-379 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9a233e4b4d38db92acdd8ea40098870dd07222fff96c9005f0d59bbedb6f529e, and its overlap section at state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:414-423 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:437e91cf959d0ec3b8fcac125f66ce07c48e032a1b2f5e54f7463393fe151f74.
    - It shares kernel/README.md (its records group, state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:347 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c8ba026acc49b1722052203a247d284dc65c09149b65c2d51facf36a79a7e297). That is the same file, so 1c's step that edits it is dispatched after this piece's PR merges, as 1c's draft records (state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:423 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b6224c13b988b9c4e2cc7407f1c1510453e64b6ad5c108093b735628703d2022).
    - It shares KNOWN-LIMITATIONS.md as separate items.
    - It reads `kernel/src/permission/` without editing it (state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:421 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:57f06dc2868a4919d48ad3cc2967dfee4497686be41463ae2c6e90a6d30cd445) and uses engine/src/fixture.rs without editing it (state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:422 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:0325675185e3800f04b80d21612d0bc4ff2d6944da5a082e3bbe9daaca5c448c).
    - Its `protocol/` paths (state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:338 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:91592edeac53217f08ad13c7213d52f78a40b19435fd999a4eacd848c06bfeae) do not meet this piece, which touches none.
    - Its src-tauri edits are `commands.rs` and `lib.rs` (state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:97-98 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:49506c5545dce84ef8f5873641da1f9c773b403af1deec88d317c99e0bba5b67, state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:266 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f02417d26c1748d5d701d6726ec89413b96e6830603128a10102c0e84cb08264), not `publish.rs`.
  - **Milestone 4** (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md).
    - It shares KNOWN-LIMITATIONS.md as separate items (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:376 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:896f4e5e4c298cfa64c9c01f62edd81e593dbb959851a7b9df4ec53592b32b5e).
    - It reads frontends/shell/src-tauri/src/publish.rs without editing it (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:377 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b71aa59598cd00b425620641d4bb05a91ca558b1ebae9d9bb7c92a96693a7f62).
    - It uses engine/src/fixture.rs, through a new generator in kernel/tests/manual_walkthrough_fixtures.rs (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:343 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:75695e6ede7f5c8dbbdf88168cd046a791e95940ecd589c86d555ba57236ce09), without editing it (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:378 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:2d9e9212c012147305a736cae3861da075bf4bc44590c69f7f12cddc687c25a7).
    - It declares `protocol/**`, `kernel/src/**`, `engine/**` and `src-tauri/**` not edited (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:346 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:dff730b82dc1db212c289250d6cea3430cfe66886e57c161b1eadcc2074ff0f3).
    - Its node depends on this one (PLAN.yaml:2360 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:ffe715dccc296417a8feb9034b9b33f84b903bb90e9bf47cef191fdafcf4ee12, node `b1-shell-half`), so the two run in sequence.
    - Under its OPEN-4 (A′), now carried by ADR-036's block (state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:4b060a097e2669c574a255533c6db432f4f3bb4e477b51d38bb8f192cbff8f1d), a later recording piece touches `protocol/` (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:386 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a2f883a9bb849b3981f0ce6c156cf0f7b41cabb70f728eff971caf9093c20f2e). This piece touches none.
  - **KNOWN-LIMITATIONS numbering.** 1c's items and milestone 4's each take the next free numbers. This piece merges first, so W6 takes the next free number and theirs follow it.
  - The custodian re-checks rule (00) at dispatch against both slots and every PR awaiting merge.

## §10. Amendments

(opens empty; append-only)

---

## Words, checked

**W1 — the `Display`; a P6 placeholder for an app string, the human's at the sitting:**
`[P6 placeholder] refused: the redaction scan (ADR-017 §13) found {count} match(es) in `{file}` that are not operator-declared, the first of class `{class}` at byte {byte_offset}; no bundle was created at the destination`
- "found {count} match(es) in {file}": the count is of that one file's findings, because the walk stops at the first such file (§2.3). No claim is made about other files.
- "that are not operator-declared": the gate's filter, against `OPERATOR_DECLARED` (kernel/src/bundle/redaction.rs:68 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:33651cadb231e0b573efe047b49dad639e220f4ec5cc0783f9ae4c31df08dbab).
- "the first … at byte": the lowest offset, because §2.3 sorts that file's findings by offset.
- "no bundle was created at the destination": `finalize` (kernel/src/publish/mod.rs:934 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a) is not reached. It makes no claim about staging removal, which `StagingNotRemoved` reports separately.

**W2 — the reader's arm (CLI text, not the app; the worker applies):**
`the redaction scan found a local filesystem path, user name, machine identifier or credential in the staged bundle`
- The four refusable classes are `local-filesystem-path`, `username`, `machine-identifier` and `credential` (kernel/src/bundle/redaction.rs:146-166 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:fc70abcb0e057bc2454e8391efbabb75c17ea69d47a380ee5031ba102e334038, kernel/src/bundle/redaction.rs:279-304 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9b491fd7695ac24ab455f1db5caa7617fce97ddc54d38a707fc50d309b74fd36). `operator-declared` never refuses.

**W3 — the variant's doc:**
The redaction scan (ADR-017 §13; `bundle::redaction`) found, in one staged file, a match that is not operator-declared. Raised after every staged file is written and before the rename, so no bundle exists under the destination name. The staging directory is then removed as on every other failure, or reported by `StagingNotRemoved`. Carries that file's bundle-relative path, the first match's class and byte offset, and the number of such matches in that file. Never the matched text: a credential match would carry the credential (`docs/09`).
- Checked against §2.3 and §2.5, and against kernel/src/publish/mod.rs:638-653 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b29068705e7d7d01a6a60229c3fc65e73a235b1f2d54d6431685a1b560eba9a9.

**W4 — the comment at the gate's site:**
**The redaction gate (ADR-017 §13): every staged file, as it is on disk, before the rename.** It runs the same `redaction::scan` the format suite runs, with the same two declared strings: the viewer's copyright and its corresponding-source route. Cancellation is checked before each file, so the window between checks is one file's read and scan: not bounded in time, and in bytes only by that file's own size. A match that is not operator-declared refuses with `RedactionFinding`. A file or directory that cannot be read ends the publish with `PublishError::Io`, never a pass.
- Checked against kernel/tests/publish.rs:437-440 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:04a64a63ba90080524a949955e301a135f0da365e026337b000abc09926321ed and against §2.3 and §2.6.

**W5 — the order doc, step 6 (kernel/src/publish/mod.rs:58 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:489f9e73513bc4645146142e4a20eb7f2f6f5faee4267c4a5a7a96a496a118ba):**
`6. **Re-check the source with the fail-closed heuristic**, write the sidecar, **scan every staged file for the `docs/09` classes** (`bundle::redaction`; a match that is not operator-declared refuses), then rename.`
- Matches kernel/src/publish/mod.rs:911 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7bd1228f7635778f7857c62f746a9af08f7453257309b98e8420fde87183f8ec, kernel/src/publish/mod.rs:927-930 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e, the gate, and kernel/src/publish/mod.rs:934 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a, in that order.

**W7 — redaction.rs module doc, a new paragraph:**
`## Where the product runs it` / `publish` runs `scan` over every staged file before the rename and refuses on the first file holding a match that is not operator-declared; `scan_directory` stays the tests' whole-bundle report.
- Checked against §2.3 and §2.4.

**W6 — KNOWN-LIMITATIONS, a new item; the human's sentence, approved as drafted (OPEN-3 (A)):**
**A publish is refused when the bundle would contain a local path, your login name, this computer's name or a credential word, and the check is a pattern search, not a proof.** Before the bundle is moved into place, every file it would contain is searched, including the values of the columns your style uses, for:
- text shaped like a local path, such as a drive path (`C:\…`), a home or temp folder, or a `file://` address;
- your login name or this computer's name, except inside the copyright notice and the source-code address the bundle carries;
- words such as `password`, `secret` or `api_key`, wherever they appear.

Any match refuses the publish as `publish.redaction_finding`, naming the file and the kind of match, and no bundle appears at the destination. A dataset whose styled column holds such a word in ordinary text cannot be published as it is. A match is seen only inside at least 12 consecutive printable ASCII characters, so a short path, or one surrounded by binary bytes, is not caught.

Clause checks:
- "before the bundle is moved into place": the gate precedes `finalize` (§2.3).
- "the columns your style uses": the shell publishes `style_attributes` (frontends/shell/src-tauri/src/publish.rs:406 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:46fa20428c4696b3a3f2de385c88868534a17dfd33de339b54dea4e417cd6e6e, frontends/shell/src-tauri/src/publish.rs:532 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:46fa20428c4696b3a3f2de385c88868534a17dfd33de339b54dea4e417cd6e6e).
- "such as": the needle list (kernel/src/bundle/redaction.rs:146-166 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:fc70abcb0e057bc2454e8391efbabb75c17ea69d47a380ee5031ba102e334038) and the drive rule (kernel/src/bundle/redaction.rs:258-277 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:8b4a8222d00f7d8fb7763f57c71e24dbd6abc8718f9611c367db7441b8111fd4); not claimed to be exhaustive.
- The login-name and computer-name clause: re-classed only wholly inside a declared occurrence (kernel/src/bundle/redaction.rs:224-242 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:df27685c766f1d2ef47f571b8e114db06b1bae9641ad7c1c9629f799b5506800), with the two declared strings (§2.3); names from the environment (kernel/src/bundle/redaction.rs:117-142 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:15e135dfe73ac698538ea227ee425097231bee416af66094ef1f269439dcb6ea).
- "wherever they appear": credentials are never re-classed (kernel/src/bundle/redaction.rs:70-85 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7177e6a9aaf2b1d908c8032f0b7ee5841a6d90ebaa0bb24c0c5d75678d8efb38).
- "naming the file and the kind of match": W1.
- The 12-character limit and binary bytes: kernel/src/bundle/redaction.rs:42-47 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:34a35eef154abf536fdbe76cc0d339a455d1c92fa8b7efb62e699c0994e07992 and kernel/src/bundle/redaction.rs:179 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:457aabc66655d991cfe01ce84022a25b71437543629ffa22907fd9c09b7e9396.
- Ordinary use can reach this: a styled text value containing `secret` refuses.

---

## OPEN items, ruled

All four were ruled (A) by the human on 2026-10-21, and W6 was approved as drafted: state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e93556d99c28d74a663143e883702200c234af4eb79fe855b6dbca27c716aa24. Each (A) is kept as drafted, its pin included. The other options and the recommendations are not carried; the draft keeps them at 54d07268.

**OPEN-1 — the refusal: its code, and what its text carries. Ruled (A).**
- (A) Code `publish.redaction_finding`, `error_kind` `RedactionFinding`, outcome `refused`. The text names the file, the first match's class and byte offset, and the count in that file, and never the matched text. No shell guidance entry, on the precedent of the geometry-encoding refusal (kernel/tests/typed_terminal_codes.rs:455-459 @ 54d07268).

**OPEN-2 — a progress phase for the scan. Ruled (A).**
- (A) None: the scan runs inside the existing `Finalizing` phase. No new string, and the phase sequences tests assert are unchanged.

**OPEN-3 — a KNOWN-LIMITATIONS item. Ruled (A); W6 approved as drafted.**
- (A) A new item, W6, approved by the human or replaced by the human's own words.

**OPEN-4 — ADR text. Ruled (A).**
- (A) No ADR text in this piece. ADR-017 §13 already states what the code now does. The new refusal and the new uninterruptible term (§2.6) are recorded in the code and this form. The custodian proposes a node for an ADR-017 note in the human's typed words, naming the product gate and Corrigendum 4's new term.

No SKP or wire change is needed. A publish refusal rides an existing string, and SKP-V0 says so (protocol/skp/SKP-V0.md:783-795 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e39c44a25e32991c9c4dea39f40934576e9dc60217dc731577acf41ead9001ec).

---

## Files read, and the impact read's pointers (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:21 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:85cd418c28af56015b71b8d4cf3f6d7a4a38cebc4d81a7fc0b03a224017da7d9)

Read at main 9a8bd4428251f6102610d514328d9fc49495e66e, a clean tree except two untracked files outside every path named here.

**Pointers used**, by the impact read's own section numbers:
- **§1.1:**
  - kernel/src/permission/boundary.rs:313-455 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:84aa62ba67bf2ff94a739a01f8cfd4de635926f4ca9b5f0802979b3b402e0080 and kernel/src/permission/boundary.rs:423 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9a10864308c99e16025c1f7982f6b323d7c8109600a9ec66ad1e85f2184620bb;
  - kernel/src/publish/mod.rs:620-655 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a8b7bc4120833093f595d56b72187b43589d0c156427676610baf21253e6d600, kernel/src/publish/mod.rs:1438-1460 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:2577c10eb4cfb2eb851b60d003b062630c699d53bc5510cd4ae1e3b2966c7480, kernel/src/publish/mod.rs:1612-1629 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:636286d409a7b8f33bed258bc8a8675e3f86ba9bc153c1235efb737ee9efc348, kernel/src/publish/mod.rs:933-934 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f3875a0e3f9ea3c3a279c1e00637d02e73fac3aca15021a18c9b809cb204cf7d and kernel/src/publish/mod.rs:1645-1668 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:50003494bfebf1cf08e97566bf7ce084d24945b85481e5a50fe20c7b2a43a335.
- **§1.2:**
  - every redaction.rs range;
  - the callers at kernel/src/permission/audit/log.rs:76 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5a92ebb42a397effe6ed291a4e9f66c77ee2d5b0cd27981b6712afffa86431c2, kernel/src/permission/audit/log.rs:249-255 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e712395f181fa1312fbce6b5c644df284267a14e8b0949ee050fa43a4ee34180 and kernel/src/permission/audit/log.rs:256 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:596af092e6e4b428ae8808b07085ad1115012fd8258ae33837a424ffedc57bf1 (its correction to the draft).
- **§1.3:**
  - kernel/src/publish/error.rs:247-278 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7413a5e56351158ec9f12eb88aadab24843974aff548afc3a5aacc3b043853c1, kernel/src/publish/error.rs:284-286 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:12da66c02017f2779734221c19097cad39019e6850b71073cc64234d238d8832 and kernel/src/publish/error.rs:467 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:967ef65fae9f8ef48a479973bb5e7590cd7febb874f1596bb53088954b564632;
  - kernel/src/permission/boundary.rs:203-250 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f966afa97fbbe41e125b80a5520d44d3b17ddab5f59a3de23b975821f4380641, kernel/src/permission/boundary.rs:280-310 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7789020fa8a91d7b148cb351d35f50376e736432285a3c0455e30b1baa470db4 and kernel/src/permission/boundary.rs:482-506 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:441d309b5fbe1409dd599d83543499cb262f509640f927db0f08ab2ec006c5e6;
  - kernel/src/permission/audit/reader.rs:226-284 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:aa47fa5b252293cf10ad96ef906bbfbf787acff9ec03046f2147ee86c60a70f1;
  - frontends/shell/src-tauri/src/publish.rs:858-866 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e3ed396f156dcc38ecc10e6424ed449afd28df91ef9c3ab0a790af256ee71c60;
  - frontends/shell/src/publish/formatPublishRefusal.ts:44 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:bf31984d2c1247f06741113bd89d24002369d52c53c26491a5e4a83f53793695;
  - kernel/src/bin/publish-bundle.rs:142-173 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b9f28a223699751ab938094b8d3bec5b7a792d0a6f00715facfd37b5f5c95e51;
  - protocol/skp/SKP-V0.md:783-795 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e39c44a25e32991c9c4dea39f40934576e9dc60217dc731577acf41ead9001ec;
  - the two typed_terminal_codes tests.
- **§2.1:**
  - engine/src/stream.rs:49 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:2bb8e5d47fed5a98d308688cbe6222878c71ce6ba1deddf5c7cc681deca67949, engine/src/stream.rs:131 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5652f88baf508ecd91558123f934678d75a53c6c160c66f025430c2631a486ae, engine/src/stream.rs:171 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:7262a4330fa59c65db9c48b7d5a7f627f37e06716109172fd941bbc90c7fe224, engine/src/stream.rs:174 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b99809b549dd770be1702f624c95f99b9b983b9849c7b37ae891252bbdf02dc2 and engine/src/stream.rs:209 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b5d88bb7de8a75b039ddf371e9dada3611df129472959db51d030a6a9a5962f8;
  - kernel/src/publish/viewer_assets.rs:35 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:38154691a2e04353e34d0db5e051d492dcbb1adcf631f975e3db3891968d9a72;
  - kernel/RESULTS.md:1327-1329 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a3c38dd0d355c5c0b7662d97205365c285521d36647610cf6fc287763058f9b8 and kernel/RESULTS.md:1388-1393 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:d19de5571a4038334b285715eda3a06ef3e8446ccb137b2f2202cf2b5571c88c;
  - kernel/RESULTS.md:1731-1732 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:8bc255d45194548e76e96aad5f60247b432e00451d6d70c039f9dd90dcb7c2ed.
- **§2.2:**
  - kernel/src/publish/ceilings.rs:107-119 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:b20232226a82cd2f0489386df5c4658391991058475bea85d3297afe1bc31970;
  - KNOWN-LIMITATIONS.md:79-94 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:35bc3a75c6a8951a58dba44f9e33b72f3403ced1f68d996d3fd6fb93ffe7e790;
  - kernel/RESULTS.md:1610 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:d68cafd8638fc2532de170b8713be928a6c3d6bf8b37b8aa7020c4887fa7df73, kernel/RESULTS.md:1724 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:cfd4910fdb2491295bd239de55b84c532cf8fad8edb914d9625560c6da18360a and kernel/RESULTS.md:2119-2134 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:39d83fab14e13619fe402c6728f665a2ba0eeebcca7406ce1d37ce8a3fa21691.
- **§2.3:** the scan's passes.
- **§2.4:**
  - kernel/src/publish/mod.rs:905-906 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:060f0ab1bd13f4006832b6dd63bd11352396151a7a1ad3d0466d29360ab4e333, kernel/src/publish/mod.rs:911-934 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:0b06d21dfe0c98027b606b84c4edd73cad8fc6e3914f0be75d202398d90d4d72 and kernel/src/publish/mod.rs:960-1004 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:5a8974a2c93293095ef74347fdac2e73962b84b56fb6cef120c73fc7e3dc6e68;
  - KNOWN-LIMITATIONS item 30;
  - ADR-018 §4;
  - docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1076-1093 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:429bce7164d81677e5746c44371b4ba6c4d0487d3d9442cd8a7a9c3858dab575;
  - CANCELLATION-AND-TRACING.md §3.
- **§2.5:** docs/08_Testing.md:5-9 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:cf53ed89ddad43f43e5e3436cf10c908a8191663f42bbed5be0d5f646f154d3f.
- **§3:**
  - frontends/shell/src-tauri/src/publish.rs:848 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e4719e9baefddcf46cb10ecf1ed2cd96e1780e35fc21daf919dc3f83ec1f500d;
  - frontends/shell/src/publish/types.ts:78-83 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:35263dd8e02513e00a45ad8da3e13ce9ea91358f5231a30ff9f6c1be4b0bfc4e;
  - kernel/src/bin/publish-bundle.rs:658-668 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:1b2acb1882ec029ba29d1d742a1fd0c7aaef01fdc4b3d897a48f1a79eb794d7d.
- **§4:** docs/adr/ADR-010-render-frames-origins-boundaries.md:70-72 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:0ab685667cc219d003c6654139e8abb5af4ab7f0d8c020ebe6f469b5ed381a17.
- **§5:**
  - D's path list;
  - 1c's state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:347 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:c8ba026acc49b1722052203a247d284dc65c09149b65c2d51facf36a79a7e297, state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:421-423 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:db1d5fc47b30b320e57a50e3491cbd8a00c71a43f804ed20e1a6cfd878a6a100, state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:97-98 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:49506c5545dce84ef8f5873641da1f9c773b403af1deec88d317c99e0bba5b67, state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:266 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:f02417d26c1748d5d701d6726ec89413b96e6830603128a10102c0e84cb08264 and state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:338 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:91592edeac53217f08ad13c7213d52f78a40b19435fd999a4eacd848c06bfeae;
  - milestone 4's state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:346 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:dff730b82dc1db212c289250d6cea3430cfe66886e57c161b1eadcc2074ff0f3, state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:376-378 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:95f9f741ce80dba8e6c48f65ccdfd64ad3c26fa430e83e4e9687d8d6601ac0fb and state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:386 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a2f883a9bb849b3981f0ce6c156cf0f7b41cabb70f728eff971caf9093c20f2e.
- **§6:** questions 1 to 5.

**Found wrong:** none among the pointers re-read here. The walkthrough piece's paths were cited from its draft, and its committed form now carries them, at frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e007af93d7e8ba283a0581acadc65406bba173d2efc314778c3859d8de04fd05. That is superseded, not wrong at ab9a4b4f.

**Missing:**
- engine/src/stream.rs:2028 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:43e253df6776df28bdb456f59120c46fa3df9890f2692626fa061611ea71797c (the cut before append) and engine/src/stream.rs:2488-2505 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:9e3291b5bbdf0853b33fe49d3995e83fb351d841871c1c9f1604a55d40a8e772 (the `MAX_BATCH_BYTES` refusal on the estimate). Question 1 needs both.
- kernel/src/publish/error.rs:486-511 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:e05994321d3fb5aa30c93ca25c38e8a910a57a148975fe6fcb1119b90771e2e2 (`classify_io`'s arms) and kernel/src/publish/mod.rs:1597-1601 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:a28b6c73d9f9083f9019e4d376148fcf1aaf67f0989c9cda3b7a6e2e0bbb0401 (`total_bytes`'s own `Io`). The read-failure design needs both.
- kernel/src/permission/boundary.rs:162 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:1158750ce70bc6870a9fea5be6218257d8f40d48f61c444110f725ae06b6d13b (the CLI's `Display` path).
- frontends/shell/src-tauri/src/publish.rs:1337-1357 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:110feb83d454047482e0dd4eba6ec0eac46d70634816e7fe0733910029b0ff1c (`dataset_name_for`: a file's stem reaches the manifest's logical URI).
- scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:502 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:d3e45b62d12da6ea5e9615bae8a23a888b3dec12ae4bbea205df02178c2dccb4 (D's OPEN-5 (B) hold on PLAN.yaml commits).
- AUTONOMY.md:609 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0 (rule (00) itself) and the 2026-10-18 extension, state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:551c2c8c99555a9cf256d5cc1279d1c659a809b72cf150094b8574206ec63c92.
- kernel/README.md:392 @ 9a8bd4428251f6102610d514328d9fc49495e66e sha256:66bfb9df9c902b9cc1deee76f9cd950da822b62308f4dfd5d1b57a37e1191fb2 (declared limits) was in the impact read but missing from the draft's index update.

**Files read:**
- the impact read, 1-400, and the draft, 1-400;
- the rulings directive, 1-23; the placements directive, 1-22; product-first, 15-24; the pilot directive, 1-62;
- PLAN.yaml, 2352-2360 and 5390-5429;
- kernel/src/publish/mod.rs, 1-260, 325-349, 600-1019, 1195-1214 and 1420-1679;
- kernel/src/bundle/redaction.rs, 1-590;
- kernel/src/permission/boundary.rs, 195-534, plus a search;
- kernel/src/permission/audit/log.rs, 70-79 and 240-269;
- kernel/src/permission/audit/reader.rs, 218-289;
- kernel/src/publish/error.rs, 170-526;
- kernel/src/publish/viewer_assets.rs and kernel/src/bundle/mod.rs, by search, plus kernel/src/bundle/mod.rs, 915-939;
- kernel/src/publish/ceilings.rs, 100-157;
- kernel/src/bin/publish-bundle.rs, 118-177 and 640-674;
- kernel/tests/publish.rs, 90-119 and 412-489;
- kernel/tests/typed_terminal_codes.rs, 405-479;
- kernel/tests/permission_boundary.rs, by search;
- engine/src/stream.rs, 30-219, 412-427, 1995-2061 and 2470-2514;
- engine/src/fixture.rs, 185-204 and 1575-1689; engine/src/lib.rs, by search;
- frontends/shell/src-tauri/src/publish.rs, 835-869, 1378-1407, 1570-1765, 1850-1914 and 3155-3184, plus searches;
- frontends/shell/src/publish/formatPublishRefusal.ts, 35-50; frontends/shell/src/publish/types.ts, 74-85;
- kernel/RESULTS.md, 1310-1334, 1384-1395, 1608-1611, 1720-1735 and 2118-2135;
- ADR-017, 495-614, 920-954 and 1040-1144; ADR-018, 1-110; ADR-010, 66-89; ADR-025, 1-4; ADR-036, headings;
- kernel/CANCELLATION-AND-TRACING.md, 80-124;
- docs/08_Testing.md, 1-12;
- KNOWN-LIMITATIONS.md, 75-99 and 330-410;
- AUTONOMY.md, 197-200, 315-359, 476-483 and 609, plus headings;
- kernel/README.md, 355-399; engine/README.md, 525-559;
- protocol/skp/SKP-V0.md, 781-796; protocol/data-plane/src/session.rs, 120-133;
- renderer/bundle-viewer/notice.mjs, 100-244;
- the boundary inventory, 14-26;
- D's form, 440-464, plus a search;
- the walkthrough piece's form, 150-161, plus a search, and its draft, 145-174;
- ADR-036's block draft, 320-351;
- 1c's draft, 330-379 and 412-426, plus a search;
- milestone 4's draft, 335-390;
- the 2026-10-18 directive, 14.

## Amendment 1 — committed: the rulings and the impact read integrated by the architect's revision; the pins; the budget; O0 next (class 1)

*Written by the custodian before any code. References only: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`; `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-impact-read.md`; `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form.md` and its second revision, `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form-cites.md`.*

1. **The rulings:** OPEN-1 to OPEN-4 (A), and W6 approved as drafted. The architect's revision shows each as ruled; W6 is byte-identical to the draft's.
2. **The impact read** came before this commit, as the human asked. The revision answers its five questions in §1, §2.3, §2.6 and §7, and corrects the one pointer it found wrong.
3. **What the revision changes beyond the rulings,** each listed with why in the revised report: a failed read ends the publish with `PublishError::Io`, not through `classify_io` (§2.3, W4); the `publish-bundle` CLI is named as developer and test tooling (§1). The report also puts two points on W6 to the human, with W6 unchanged: a file name reaches the manifest, and the gate stops at the first file with a match.
4. **The pins:** the second revision writes every line cite with its full path and `@ 9a8bd442`; each is pinned by script with the full commit id 9a8bd4428251f6102610d514328d9fc49495e66e and the sha256 of its lines. Cites inside backticks, which are text to be written, and OPEN-1 (A)'s pin at 54d07268, as ruled, are left as written. The Pins sentence in the header is brought true to match.
5. **The budget:** 240 minutes (§7), set in PLAN.yaml after governance D's click, with the node's in-progress edit (D's OPEN-5 (B) hold).
6. **Next:** O0 at B, before any code, by a worker-high (§4, §8 item 1); its result is recorded as Amendment 2 before any code is written. A finding outside `operator-declared` stops the piece for the human.
7. **OPEN-4 (A)'s node** for an ADR-017 note, in the human's typed words, is proposed with the held PLAN changes; the revised report's point on the design notes goes with it.

Nothing above is edited.

## Amendment 2 — O0: STOP, three findings outside `operator-declared` (class 1); written after the result was seen

*Written by the custodian before any code. References only: `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-o0-worker-report.md`.*

1. **O0** (§4), at B ed2024c2401500c26d7a2bf2944f995dd43f04e8: the viewer built with `npm run build`; the 2,000-feature fixture published through `publish_unguarded` with the built `dist/` and `bundled_viewer_license()`'s copyright and route; the unchanged `scan_directory` with those two strings declared. Eight findings. Five are `operator-declared`. Three are not: `credential` in `viewer/NOTICE.txt` at byte 19092, and `local-filesystem-path` in `viewer/NOTICE.txt` at byte 111337 and in `viewer/app.js` at byte 7291. The positive control fired. **P-3 is falsified**, and the piece stops before code (§4, O0's paragraph).
2. **Where each comes from**, as the custodian read the built files at B (no excerpt is reproduced here):
   - the `credential` finding is the word that names a password in section 6 of the GNU Affero General Public License's text, which the notice carries verbatim;
   - the first `local-filesystem-path` finding is a `/Home/` path segment inside an `https` URL, in the third-party licence text `LICENSES/third-party/duckdb-1.5.5/snappy/LICENSE`, which the notice carries verbatim;
   - the second is the example drive path in a comment of `renderer/bundle-viewer/src/manifest.ts` (its URI-scheme rule), which the viewer's build keeps in `app.js`.
   None of the three is a path, user name, machine identifier or credential of this machine. That is the custodian's reading, not a verdict of the scan.
3. **The scan is not weakened** (§8 item 2), and no code is written. The human rules what follows. Their ruling is recorded in the next amendment before any code.

Nothing above is edited.
