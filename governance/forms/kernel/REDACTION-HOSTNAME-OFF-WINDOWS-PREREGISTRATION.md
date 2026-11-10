# kernel: the redaction scan knows the machine's hostname off Windows — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node redaction-hostname-off-windows, the filler queue's entry 7a (S3). The five lines, the notes, the OPEN items and the questions are lead-data's draft (`state/consults/2026-10-29-redaction-hostname-off-windows-five-line-form-lead-data-draft.md`, read only at main 53e0a0a1; its sha256 from line 5 is 6706cc6c953cec88ecbccefaaa243c50aa235e156d0ec2a2f2a6c6f70da5c9d6), carried byte for byte with these changes, all the custodian's: one cite naming the portability directive by its stem (R6's) written out as its path; each cite the draft marks `@ 53e0a0a1`, and each cite on a line before that line's last marker, is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path as `path:line` at <commit>, sha256 <hex>; 2 such) (41 pins; 8 by a file name that resolves to one tracked path at that commit; 8 bare line numbers bound to the path written before them; 0 bare line numbers the draft leaves unmarked kept as written; 1 remaining markers given the full commit id); this title and lead line added; the draft's preamble above its form heading and its closing two lines (no sha256, its report path) dropped. Every pin is historical, read before governance piece F moved the forms and the process files: for the code, the piece's base on main is authoritative. Form path: `governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

```
Authority: PLAN node `redaction-hostname-off-windows` (PLAN.yaml:2750-2766 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:d8181e0efecefed0335aea4f240650e58e50b97fda4c7061d2ff6d340bccf50e), filler queue entry 7a (state/FILLER-QUEUE.md:19 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:aa02bb086f617c718df57b7f482a3c5a61de613b4341b7800773eeb060f76871), run in the filler slot under AUTONOMY.md §36 (AUTONOMY.md:692 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84); the finding is wave-3 A-2 (state/cloud/wave3/W3-A.md:128-145 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:1c83e6b8c0c692421ff2d718617f1a12e3d9d84923d4d84bed912e4c5ff7c660, state/cloud/wave3/W3-A.md:186 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:4dc68b4394e502e015b09bdd091a6ad73a1acff377ca45a2f032edb38939d290); reuse index: a miss, no prior art recorded for "redaction hostname machine identifier" (tools/reuse.mjs in the reuse clone, exit 1, run by the custodian for this form's brief).
Scope: kernel/src/bundle/redaction.rs; kernel/tests/redaction_hostname_off_windows.rs (new); kernel/README.md (owner's index: this form in the preregistration list, the Last-verified bullet); 3 files; declared line budget 145 by §21c's counting rule.
Change: `MachineIdentifiers::from_environment` still reads `COMPUTERNAME` and `HOSTNAME` first; only when neither gives a name of at least 3 bytes does it take the machine's name from a private, std-only boundary function `os_hostname` (`/proc/sys/kernel/hostname`, trimmed, same 3-byte floor), so on Linux with `HOSTNAME` not exported a `machine-identifier` finding reaches an audit record's `residual_classes` and the publish gate; Windows' source and every caller are unchanged, and macOS stays explicitly reduced.
Tests+mutation: T1 `kernel/src/bundle/redaction.rs::tests::the_os_hostname_is_taken_only_when_the_environment_names_none` (all platforms), mutation M1: drop the "environment named none" guard so the OS name is always appended, predicted failure: T1's env-first assertion, left ["envhost", "oshost"], right ["envhost"]; T2 `kernel/tests/redaction_hostname_off_windows.rs::an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname` (Linux; ignored elsewhere with a reason naming the boundary), mutation M2: `os_hostname` returns `None`, predicted failure: the child's assertion that the record carrying the `uname -n` name lists `machine-identifier` in `residual_classes`, surfaced by the parent as the child's non-zero exit with its stderr; proven on the Linux L1 job (`.github/workflows/product-ci-rust.yml:196-197` at 53e0a0a1f339c94e0d504664f08a2a98b168a1da, sha256 6001cee2262c0ea4d0b2dae776762ca043e8b20f58ce2f6e6faee1446a322f44, `.github/workflows/product-ci-rust.yml:233-234` at 53e0a0a1f339c94e0d504664f08a2a98b168a1da, sha256 b583ae49475deb6fd0c6a7b2d4ee8a35323f6b6f814b70b68e8b908491ceed3c).
Out-of-scope: ADR: none (no status line or amendment; ADR-017 §13's gate unchanged); security: none (nothing ADR-020, ADR-009 or ADR-021 governs); wire: none (no SKP, data-plane or MCP surface); guarantee: TOUCHED, because the property at kernel/PERMISSION-BOUNDARY.md:293-296 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:51f86e6c6b661734552ae0a555436628add62dd2b0d62090fa646a43154f2f66 becomes true on Linux (Windows unchanged) and the Linux grade at kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:185-187 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:5f4468b0983b5edee4c5419509ab0fba600a1e5be4e41442946256a258b0bbfb moves from explicitly reduced to supported; §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch; no new dependency, no `unsafe`, no new string.
```

*The notes, OPEN items and questions below are lead-data's from its draft, carried byte for byte except for the pins and the one path written out; where they say I or my, they mean lead-data's. They are this form's reading.*

## Notes

**N1. The defect**
- `from_environment` gets hostnames only from `["COMPUTERNAME", "HOSTNAME"]` (kernel/src/bundle/redaction.rs:135-141 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:ea09747a1c7e46ce60b7ebea736ebd5bbccf148a7aecd27df357c4f1e5294f50). Its doc already calls a missing identifier "a gap in the scan and not a pass" (kernel/src/bundle/redaction.rs:123-124 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:1b10d4cf9d48a352163eff8f5c04340fd7578c1d19464375fda8f155e0ebd3d5).
- Hostnames are scanned at kernel/src/bundle/redaction.rs:300-312 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:6f89d96f1375af99ff286365ba661d3e4cf782d5391186c6522051aebc50cf70.
- The audit log builds its identifiers from `from_environment` (kernel/src/permission/audit/log.rs:249-256 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:280a1e0180ab7311afdbb086b0a582f95f8c0e4c21acd06471ff9c0803f89b98). `machine-identifier` is one of its residual classes (kernel/src/permission/audit/log.rs:93 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:514d53bb18de868464140255b8333ec004a90b355d9290088c8623ae3651a081), collected at kernel/src/permission/audit/log.rs:265-275 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:e6367d7666130aa17a9711b7547e91d7e58b9b398738632ff379760738efe1cd.
- The publish gate uses the same constructor (kernel/src/publish/mod.rs:946-952 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:32a1f02acd0ff0e4396f6922e8b584113a8abf18afc68cff916ada04b2feda26).
- Wave 3 reproduced the defect on Linux with `HOSTNAME` removed (state/cloud/wave3/W3-A.md:132-136 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:5d6bf856fc5004c623e6c192efa4082da634db93895ac2420def38a602f31555). Its reproducer is on `cloud/wave3-A` and not on main, so T2 is written fresh.

**N2. Why the boundary sits inside redaction.rs**
- The viewer build compiles redaction.rs on its own (renderer/bundle-viewer/scripts/scan-dist.rs:12-13 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:8790cce2b9123a10344e64948dd4e492328a8233a261acd8d8f11c6945d1ada7; rustc edition 2021 with `-A warnings`, renderer/bundle-viewer/scripts/scan-dist.mjs:59 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:3d514ae7fe80efc9c58c6690b60b81b6f8bb0edf6e571c89166612765421c957). That build uses `MachineIdentifiers::default()` (renderer/bundle-viewer/scripts/scan-dist.rs:20 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:46ce49a2423e69ca8911750d616d955b45defd3d37c97244fb29f88a4f5673ef), and the file names nothing outside `std` (kernel/src/bundle/redaction.rs:53-55 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:115a2750f1fb00c26451c7743c047afed53ebb59905defd40095e96ced15d094).
- `os_hostname` and `hostnames_from` are therefore std-only and private, and their one product caller is `from_environment`.
- No caller changes. That matters because `cut/port-2-macos-l1-and-app-dirs` edits log.rs. The callers are kernel/src/permission/audit/log.rs:254 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:1afb40f5d77f94627867f3bf18977aa15b3a4c80e720223f2263ef65a16ba790, kernel/src/publish/mod.rs:951 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:5096b51354a72517b9bdcfd37cc14f5b5b4ceb2983e32fe685d2c02ec3ba3d7b, kernel/src/permission/audit/normalize.rs:144-146 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:2b7ffc96808601c5ef68152e93fdbff452146ec7d0f7ae373ff652be665b44dd and kernel/tests/publish.rs:437-440 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:04a64a63ba90080524a949955e301a135f0da365e026337b000abc09926321ed, all @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da.
- The constructor keeps its name, and its doc says it now also reads a file. Renaming it would touch log.rs.
- The cross-module consumer is the viewer's standalone compile. Its existing end-to-end proof is renderer/bundle-viewer/scripts/scan-dist.test.mjs:28 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:ad50461732b1e131653c65a9abdc612625dcdf30d13e69e5f1f8c02d84b109df, which copies the real file. It stays green only if the file stays std-only.

**N3. The OS name is a fallback, not an extra name**
- This keeps "at most two hostnames", so P ≤ 25 holds (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:114 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:3a250cf1b10d618e8911ca0b6fb8c74896286731c78cc202ed21f3de0c9911fe). Declared unchanged.
- It also leaves Windows unchanged wherever `COMPUTERNAME` gives a name of at least 3 bytes.
- The cost: an exported `HOSTNAME` whose value differs from the kernel's name is still used alone, as it is today.

**N4. Route A (drafted) against Route B, for the architect**
- **Route A (drafted):** no OS cfg in product code. `scripts/plan/cfg-boundary.mjs` and its test are untouched, since the check only sees cfg forms (scripts/plan/cfg-boundary.mjs:14-17 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:7bef4935e42d016e91cd5658c04d75b0aae411522b76bf003a6f7d7cfeb2d0dc). The boundary is named in the Platform item below and added to R2's table by the architect's gate (state/directives/PORTABILITY-2026-09-30.md:35-47 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:5e5f89b17b9fecd9f6766c488dc58937595667cab0e00d2b2aee63abb8d477eb, state/directives/PORTABILITY-2026-09-30.md:56 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:525a991bd85ac4a23d6d09ec21020a670d51abafb820e31780664df6746c9d6d).
- **Disclosed Windows edge of Route A:** a process with no `COMPUTERNAME` of 3 or more bytes and no `HOSTNAME` would try `\proc\sys\kernel\hostname` on the current drive. Normally that file is absent. If someone creates it, the scan only gains a needle and gets stricter.
- **Route B:** `#[cfg(target_os = "linux")]` and `#[cfg(not(target_os = "linux"))]` arms of `os_hostname`. Windows would be exactly unchanged and the check would see the boundary.
- **Route B's cost:**
  - It needs an allowlist entry (scripts/plan/cfg-boundary.mjs:27-33 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:0ef8ec150af352fc8b0db15de439e0f0f50170b591aee0d82ca4651aeb8c0ccf) and new pinned counts (scripts/plan/cfg-boundary.test.mjs:73-89 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:632ae8b196e795959e63161d0e0a4dc0a5a49348367e0e04eba4ddb9dc475295). That is 5 files and about 152 lines, over §21c.
  - Port-2's new application-directory boundary very probably edits that same allowlist. I cannot read the branch, so the custodian should check.

**N5. Platform item (R3, docs/PREREGISTRATION-TEMPLATE.md:177 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0)**
- **Owning boundary:** machine identity, `os_hostname` in kernel/src/bundle/redaction.rs. The architect adds it.
- **Windows:** supported, unchanged (`COMPUTERNAME`). No new Windows test. T2 is ignored there with a reason naming the boundary (R6, state/directives/PORTABILITY-2026-09-30.md:65 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:97ca2c3a10f89a424cf8edc9de104c336b1ad22206f3eda0aebb14fc474f26d5).
- **Linux:** supported, the new grade (`/proc/sys/kernel/hostname`). T1 and T2 run on the ubuntu-24.04 L1 job.
- **macOS:** explicitly reduced, as today. The hostname is scanned only when `HOSTNAME` is exported. Nothing shows the user, the same as the existing declaration (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:187-188 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:4b81aaad287dd0f041ab5f795e5a4106091437be715ffab8101639dd922e88f5). T1 runs there; T2 is ignored with the boundary reason. The deferral is recorded in this form (see OPEN-1).
- No KNOWN-LIMITATIONS item is owed: KL 1 is unchanged, and no Linux or macOS product ships.

**N6. Test design**
- **T1** tests a private `hostnames_from(env lookup, OS source)` with no env mutation. It makes three assertions:
  - no env name, OS gives "wave3-probe-host\n": the result is ["wave3-probe-host"];
  - env `HOSTNAME`="envhost", OS gives "oshost": the result is ["envhost"];
  - OS gives "vm\n": the result is empty (the floor holds).
- **T2 runs itself again as a child process.** Precedent: kernel/tests/session_history_crash.rs:99-106 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:1991147f1171fb1cb107c9326cdcd1734548b4600bc1410e2151858f03d31b17.
  - The child is started with `env_remove("HOSTNAME")`, `env_remove("COMPUTERNAME")` and an absolute `SPATIAL_IDE_AUDIT_LOG`, so there is no in-process `set_var`.
  - The child writes two `IntentRecord`s through `AuditLog::open_for` and `append_intent`. Precedent: kernel/tests/no_generation_in_persisted_artifacts.rs:70-71 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:16e8f4024e36fc7c3ad180e658020680e30696082de792909434611db77571eb, kernel/tests/no_generation_in_persisted_artifacts.rs:491-506 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:eaa4e98e60ca81ff6c49ce3a63fb45ff18f611d0cae101b169ff14c898c2c27f.
  - The control record does not carry the hostname, and its `residual_classes` must lack `machine-identifier`. The second record carries the `uname -n` name in `source_name`, not in `principal_name` (which would be attributed), and must list `machine-identifier`.
  - The oracle is `uname -n`, a separate path to the same kernel name, not the implementation's read of `/proc`.
  - The child fails by name, never passes, when the OS name is under 3 bytes (wave 3's container name `vm`, state/cloud/wave3/W3-A.md:133 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:2394803f63a6e4d4211b802d55d90666053976f1b024c01d553128c15f105b9c) or when the name occurs in the control record.

**N7. Declared unchanged, and what would stop the piece**
- Declared unchanged: every existing redaction.rs test; kernel/tests/publish.rs::the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle (predicted: 0 leaked on Linux with the runner's name now scanned); scan-dist.test.mjs; the 3-byte floor; `RESIDUAL_CLASSES`; `MIN_PRINTABLE_RUN`.
- Windows' `--list --ignored` gains T2. Linux gains T1 and T2 as passed.
- Invalidator: any existing test changing outcome on either job stops the piece.

**N8. Paths, for the rule (00) check**
- Paths: kernel/src/bundle/redaction.rs, kernel/tests/redaction_hostname_off_windows.rs (new), kernel/README.md.
- None of them is log.rs, normalize.rs or scripts/plan.
- 7a's earlier skip reason has cleared: #241 merged (PLAN.yaml:5722 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:e70345a0bccb096ef47042fab9c4e7a97960af8767ad8a94692b4d0bc50ff5c7).
- kernel/README.md is the likely collision. #270 re-paths the index's form list, and port-2 or b2 1c may edit index rows.

**N9. Record**
- After #270 moves the forms, the cites to kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md (and kernel/PERMISSION-BOUNDARY.md, if it moves) need re-pointing when the form is committed. That is the custodian's call.
- The old form's 2.8 is superseded by this form for Linux. It is not amended: it is append-only, and the file count matters.

**N10. §21c bounds:** no dependency (std only), no exposure surface (a procfs read, no process spawned), and no new string. User-visible behaviour is OPEN-2.

## OPEN items for the human

- **OPEN-1: macOS.** Recommendation: (A), revisited with a later macOS piece.
  - (A) Stay explicitly reduced as today, recorded in this form.
  - (B) A std-only `uname -n` subprocess. That spawns a process on every scan: a new exposure surface, outside §21c.
  - (C) `gethostname` through an `extern "C"` declaration. That would be the first `unsafe` in kernel/src, a security-posture question.
  - (D) A crate such as `hostname` or `libc`. That is a new dependency: a red line, and outside §21c.
- **OPEN-2: is the Linux CLI publish refusing a bundle that holds the machine's name "new user-visible behaviour" under §21c?** KL 47 already states that refusal with no platform qualifier (KNOWN-LIMITATIONS.md:413-420 @ 53e0a0a1f339c94e0d504664f08a2a98b168a1da sha256:13a7b7ce34bc75f2b4fc179fe6f34c80c2a0fef098001302fad0ee6eaea34f76). Recommendation: (A).
  - (A) Not new: KL 47 made true on Linux, with no new string and no shipped Linux product. The filler stands.
  - (B) New: the piece leaves the filler slot for the full form and full gating.

## Questions for the custodian

- **Guarantee scope:** the form names a stated guarantee as touched, because the PERMISSION-BOUNDARY property's platform scope widens to Linux. Under §36 that keeps the five-line form with both gates. Please confirm it is not a red line.
- **Port-2's paths:** does `cut/port-2-macos-l1-and-app-dirs`, #270 or `cut/b2-piece-1c-save-and-reopen` edit kernel/README.md or scripts/plan/cfg-boundary*.mjs? The answer decides Route A against Route B (N4).

## The custodian's settlement (class 1, before any code)

- **The human's ruling of 2026-10-30** (`state/directives/2026-10-30-270-readme-r1-r3-d5-open-1-class-1-269-clicked-4a-7a-rulings.md`, line 19), referenced and not restated:
  - **OPEN-1: (A).** macOS stays explicitly reduced, as N5 records, and is revisited with a macOS piece.
  - **OPEN-2: (A).** The Linux CLI refusal is not new user-visible behaviour under §21c; the piece stays in the filler slot.
  - **The guarantee:** the ruling answers the draft's first question. The platform scope's widening to Linux is not a red line; the piece stays `guarantee: touched`, with the reviewer and the architect from dispatch under §36.
- **The draft's second question (Route A against Route B, N4):** by `git diff --name-only origin/main...<branch>` at main 0f6c62a4, `cut/port-2-macos-l1-and-app-dirs` edits `scripts/plan/cfg-boundary.mjs` and its test, so Route B would overlap it. Route A, as drafted, stands.
- **N9 (the old form's path):** governance piece F moved `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md` to `governance/forms/kernel/` (`governance/MOVED.tsv`). Every cite to it in this form is pinned at 53e0a0a1 and is read at its pin, so none is re-pointed. `kernel/PERMISSION-BOUNDARY.md` did not move.
- **Rule (00)** was checked at main 0f6c62a4 by `git diff --name-only origin/main...<branch>` over the open PRs (#273, #272, #271) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b1-shell-half-pr-c`, `cut/engine-cancel-before-execute-siblings`): none touches the three Scope files or this form. It is checked again at dispatch, which follows the filler queue's order.

## Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-03 — class 1, before any code: how M2 is observed

- The Tests+mutation line proves T2 and M2 on the Linux L1 job, and the piece is built on Windows, where T2 is ignored. M2 is observed in the shape 7b's settlement takes for its Linux-only mutations (governance/forms/kernel/POSIX-BACKSLASH-IN-SHARED-PATH-LOGIC-PREREGISTRATION.md:163 @ 652752afa9bedb0172948869c9ab7f0b8ee08dd3 sha256:61b59517a7cd86e9e838c5eb5430ae97aee095fad664a1c1e6293f6706261063): one temporary commit carrying M2 alone on the piece's branch, its ubuntu-24.04 failure recorded by test name, run id and commit, then reverted by a new commit. No history is rewritten. This is the custodian's reading of the form's words, taken under the human's direction of 2026-10-31, item 4, on 2026-11-03. It is not a red line, and the human reviews it on return.
- **Rule (00),** by `git diff --name-only origin/main...<branch>` at main 652752af: the open PR (#276) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b1-shell-half-pr-c`, `cut/adr-017-note-product-redaction-gate`) touch none of the three Scope paths or this form.

### Amendment 2 — 2026-11-03 — class 8, budget overrun, the Scope line not edited; written after the piece's tests, mutations and CI runs were seen

- At the head fa4d009562185de498f5ed5b23979e0ecf7f05ba (base b1d8d02c8e3c9e42f52f47a4c8c8fb1388ea45e8, six commits), `git diff --numstat origin/main...origin/cut/redaction-hostname-off-windows` over the three Scope files gives 198 lines: `kernel/README.md` 2/2, `kernel/src/bundle/redaction.rs` 62/10, `kernel/tests/redaction_hostname_off_windows.rs` 122/0. The declared figure is 145, so the overrun is 53. The worker reported it and did not trim. The total is over §21c's 150. The piece already takes both gates from dispatch (the Guarantee scope settlement, under §36), so its route does not change. Gate 1 reads the overrun.

### Amendment 3 — 2026-11-03 — class 1, record corrections of Amendments 2 and 1 (gate 1: the reviewer's D2, the architect's D1 and D3); written after gate 1's reports were seen

- Amendment 2 names its class as 8, which is the full form's budget class; this five-line form's overrun is class 6, budget deviation, Scope not edited (`docs/PREREGISTRATION-TEMPLATE.md`, its items 6 and 8). Its figures stand, and the reason it omits is that the new test file alone is 122 lines (T2's child-process harness, its two helpers and its module doc), against a 145 declared for all three files with no per-file split. The 198 lines are over §21c's 150, so class 6's closing of the single-gate route applies; the reviewer and the architect already gate the piece from dispatch.
- Amendment 1's authority is the 2026-10-31 direction's closing paragraph (paraphrased: a question with no recommendation and no red line takes the cheapest reversible option, recorded the same way), not its item 4, which covers OPEN items; the human's review on return is unchanged.
- The filler slot (the reviewer's note on §36, which admits a filler that fits §21c's size; at 198 lines this piece no longer does): neither gate recommends a course, so under the same closing paragraph the cheapest reversible option is taken on 2026-11-03: the piece stays in the filler slot, built and in gate, both gates from dispatch. It is not a red line, and the human reviews it on return.

### Amendment 4 — 2026-11-03 — the closing record (class 1), written after gate 1's reports, the D1 commit and its CI were seen; references and hashes only

- **The final head:** f81220ba2cdaa26a6110308a1b304a571e07346a, one commit on fa4d009562185de498f5ed5b23979e0ecf7f05ba, from B b1d8d02c8e3c9e42f52f47a4c8c8fb1388ea45e8; the three Scope files and 198 lines, as Amendment 2 gives.
- **Gate 1 at fa4d0095:**
  - `state/consults/gates/2026-11-03-redaction-hostname-off-windows-gate1-architect.md` (sha256 3bf71829848adc8ddf6c3483f0c36348b5dbc4a012796188eb7887533c839518), gate-log 671, PASS WITH NOTES.
  - `state/consults/gates/2026-11-03-redaction-hostname-off-windows-gate1-reviewer.md` (sha256 ac55014765b65b4b11ecc09eff3c1e1ce8c3b1b705dc1cb1ee92d05975a6f84e), gate-log 672, PASS WITH NOTES.
- **The boundary:** the architect's ruling in its report, by reference: machine identity, `os_hostname` in `kernel/src/bundle/redaction.rs`, is added to R2's table (`state/directives/PORTABILITY-2026-09-30.md`, section 2); `scripts/plan/cfg-boundary.mjs`'s allowlist is untouched. The Change line's Windows clause is read as that ruling states Windows (its D2).
- **D1, the reviewer's words:** applied at f81220ba by a worker, `state/consults/2026-11-03-redaction-hostname-off-windows-d1-worker-report.md` (sha256 from line 5 13249773b3b136662754c906507c5081029c8cbbf419a8c0a0761601143edec9); the custodian checked the bytes against the pair by script.
- **D4, the architect's words:** The viewer workflow (`.github/workflows/product-ci-viewer.yml`) ran at fa4d0095 as run 41689563271, success; its `npm run verify` compiles `kernel/src/bundle/redaction.rs` on its own through `scripts/scan-dist.mjs` (N2, N7).
- **CI at f81220ba:** `gh pr checks 278`, every check passing; the Rust workspace runs 41703309382 (push) and 41703319740 (pull_request), success, T2 `ok` in the ubuntu job 126151999501's log; the viewer run 41703319677 (pull_request), success.
- **D5:** the two RECORDED MUTATION lines, T1's doc in `kernel/src/bundle/redaction.rs` and T2's doc in `kernel/tests/redaction_hostname_off_windows.rs`, are named in words at f81220ba until the merge; their hash pins follow on main after the merge commit.
- **Notes with no fix, for the click:** the reviewer's: T2's fixed scratch path collides between two concurrent runs of its binary; common-word hostnames fail closed on Linux; the README's pre-move form paths predate the piece (the proposed node `module-readme-moved-form-paths`).
- **Merge:** the human's click, by merge commit.
