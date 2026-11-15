*Custodian's filing note (2026-10-29): lead-data's read-only draft, ahead, of the five-line form for filler entry 7a, on the custodian's brief (its REPORT PATH), read at main 53e0a0a1; the reuse index a miss, carried. It is a draft and not Authority. The custodian's answers to its two questions: by `git diff --name-only origin/main...<branch>`, cut/port-2-macos-l1-and-app-dirs edits scripts/plan/cfg-boundary.mjs and its test, so Route B would overlap it and Route A, as drafted, stands; no branch in flight edits kernel/README.md, kernel/src/bundle/redaction.rs or the new test's path. Its OPEN-1 and OPEN-2 go to the human, and the form is committed only after #270 merges. By its transcript: Read 25, Grep 24, Glob 2; run 2026-10-29T12:21:42Z to 12:28:51Z. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 6706cc6c953cec88ecbccefaaa243c50aa235e156d0ec2a2f2a6c6f70da5c9d6.*

---

Draft: redaction-hostname-off-windows five-line form, lead-data

All reads are at main 53e0a0a1, which is the checked-out tree. I wrote no file and quoted nothing except the reuse query string, which is byte-copied from the brief.

## The form

Proposed path: `governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md`. It is committed after #270 merges and before any code.

```
Authority: PLAN node `redaction-hostname-off-windows` (PLAN.yaml:2750-2766 @ 53e0a0a1), filler queue entry 7a (state/FILLER-QUEUE.md:19 @ 53e0a0a1), run in the filler slot under AUTONOMY.md §36 (AUTONOMY.md:692 @ 53e0a0a1); the finding is wave-3 A-2 (state/cloud/wave3/W3-A.md:128-145, :186 @ 53e0a0a1); reuse index: a miss, no prior art recorded for "redaction hostname machine identifier" (tools/reuse.mjs in the reuse clone, exit 1, run by the custodian for this form's brief).
Scope: kernel/src/bundle/redaction.rs; kernel/tests/redaction_hostname_off_windows.rs (new); kernel/README.md (owner's index: this form in the preregistration list, the Last-verified bullet); 3 files; declared line budget 145 by §21c's counting rule.
Change: `MachineIdentifiers::from_environment` still reads `COMPUTERNAME` and `HOSTNAME` first; only when neither gives a name of at least 3 bytes does it take the machine's name from a private, std-only boundary function `os_hostname` (`/proc/sys/kernel/hostname`, trimmed, same 3-byte floor), so on Linux with `HOSTNAME` not exported a `machine-identifier` finding reaches an audit record's `residual_classes` and the publish gate; Windows' source and every caller are unchanged, and macOS stays explicitly reduced.
Tests+mutation: T1 `kernel/src/bundle/redaction.rs::tests::the_os_hostname_is_taken_only_when_the_environment_names_none` (all platforms), mutation M1: drop the "environment named none" guard so the OS name is always appended, predicted failure: T1's env-first assertion, left ["envhost", "oshost"], right ["envhost"]; T2 `kernel/tests/redaction_hostname_off_windows.rs::an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname` (Linux; ignored elsewhere with a reason naming the boundary), mutation M2: `os_hostname` returns `None`, predicted failure: the child's assertion that the record carrying the `uname -n` name lists `machine-identifier` in `residual_classes`, surfaced by the parent as the child's non-zero exit with its stderr; proven on the Linux L1 job (.github/workflows/product-ci-rust.yml:196-197, :233-234 @ 53e0a0a1).
Out-of-scope: ADR: none (no status line or amendment; ADR-017 §13's gate unchanged); security: none (nothing ADR-020, ADR-009 or ADR-021 governs); wire: none (no SKP, data-plane or MCP surface); guarantee: TOUCHED, because the property at kernel/PERMISSION-BOUNDARY.md:293-296 @ 53e0a0a1 becomes true on Linux (Windows unchanged) and the Linux grade at kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:185-187 @ 53e0a0a1 moves from explicitly reduced to supported; §25 (e) is set aside for a filler by §36, so the five-line form stands with the reviewer and the architect from dispatch; no new dependency, no `unsafe`, no new string.
```

## Notes

**N1. The defect**
- `from_environment` gets hostnames only from `["COMPUTERNAME", "HOSTNAME"]` (kernel/src/bundle/redaction.rs:135-141 @ 53e0a0a1). Its doc already calls a missing identifier "a gap in the scan and not a pass" (:123-124 @ 53e0a0a1).
- Hostnames are scanned at :300-312 @ 53e0a0a1.
- The audit log builds its identifiers from `from_environment` (kernel/src/permission/audit/log.rs:249-256 @ 53e0a0a1). `machine-identifier` is one of its residual classes (:93 @ 53e0a0a1), collected at :265-275 @ 53e0a0a1.
- The publish gate uses the same constructor (kernel/src/publish/mod.rs:946-952 @ 53e0a0a1).
- Wave 3 reproduced the defect on Linux with `HOSTNAME` removed (state/cloud/wave3/W3-A.md:132-136 @ 53e0a0a1). Its reproducer is on `cloud/wave3-A` and not on main, so T2 is written fresh.

**N2. Why the boundary sits inside redaction.rs**
- The viewer build compiles redaction.rs on its own (renderer/bundle-viewer/scripts/scan-dist.rs:12-13 @ 53e0a0a1; rustc edition 2021 with `-A warnings`, renderer/bundle-viewer/scripts/scan-dist.mjs:59 @ 53e0a0a1). That build uses `MachineIdentifiers::default()` (scan-dist.rs:20 @ 53e0a0a1), and the file names nothing outside `std` (redaction.rs:53-55 @ 53e0a0a1).
- `os_hostname` and `hostnames_from` are therefore std-only and private, and their one product caller is `from_environment`.
- No caller changes. That matters because `cut/port-2-macos-l1-and-app-dirs` edits log.rs. The callers are log.rs:254, publish/mod.rs:951, normalize.rs:144-146 and kernel/tests/publish.rs:437-440, all @ 53e0a0a1.
- The constructor keeps its name, and its doc says it now also reads a file. Renaming it would touch log.rs.
- The cross-module consumer is the viewer's standalone compile. Its existing end-to-end proof is renderer/bundle-viewer/scripts/scan-dist.test.mjs:28 @ 53e0a0a1, which copies the real file. It stays green only if the file stays std-only.

**N3. The OS name is a fallback, not an extra name**
- This keeps "at most two hostnames", so P ≤ 25 holds (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:114 @ 53e0a0a1). Declared unchanged.
- It also leaves Windows unchanged wherever `COMPUTERNAME` gives a name of at least 3 bytes.
- The cost: an exported `HOSTNAME` whose value differs from the kernel's name is still used alone, as it is today.

**N4. Route A (drafted) against Route B, for the architect**
- **Route A (drafted):** no OS cfg in product code. `scripts/plan/cfg-boundary.mjs` and its test are untouched, since the check only sees cfg forms (cfg-boundary.mjs:14-17 @ 53e0a0a1). The boundary is named in the Platform item below and added to R2's table by the architect's gate (state/directives/PORTABILITY-2026-09-30.md:35-47, :56 @ 53e0a0a1).
- **Disclosed Windows edge of Route A:** a process with no `COMPUTERNAME` of 3 or more bytes and no `HOSTNAME` would try `\proc\sys\kernel\hostname` on the current drive. Normally that file is absent. If someone creates it, the scan only gains a needle and gets stricter.
- **Route B:** `#[cfg(target_os = "linux")]` and `#[cfg(not(target_os = "linux"))]` arms of `os_hostname`. Windows would be exactly unchanged and the check would see the boundary.
- **Route B's cost:**
  - It needs an allowlist entry (cfg-boundary.mjs:27-33 @ 53e0a0a1) and new pinned counts (scripts/plan/cfg-boundary.test.mjs:73-89 @ 53e0a0a1). That is 5 files and about 152 lines, over §21c.
  - Port-2's new application-directory boundary very probably edits that same allowlist. I cannot read the branch, so the custodian should check.

**N5. Platform item (R3, docs/PREREGISTRATION-TEMPLATE.md:177 @ 53e0a0a1)**
- **Owning boundary:** machine identity, `os_hostname` in kernel/src/bundle/redaction.rs. The architect adds it.
- **Windows:** supported, unchanged (`COMPUTERNAME`). No new Windows test. T2 is ignored there with a reason naming the boundary (R6, PORTABILITY:65 @ 53e0a0a1).
- **Linux:** supported, the new grade (`/proc/sys/kernel/hostname`). T1 and T2 run on the ubuntu-24.04 L1 job.
- **macOS:** explicitly reduced, as today. The hostname is scanned only when `HOSTNAME` is exported. Nothing shows the user, the same as the existing declaration (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:187-188 @ 53e0a0a1). T1 runs there; T2 is ignored with the boundary reason. The deferral is recorded in this form (see OPEN-1).
- No KNOWN-LIMITATIONS item is owed: KL 1 is unchanged, and no Linux or macOS product ships.

**N6. Test design**
- **T1** tests a private `hostnames_from(env lookup, OS source)` with no env mutation. It makes three assertions:
  - no env name, OS gives "wave3-probe-host\n": the result is ["wave3-probe-host"];
  - env `HOSTNAME`="envhost", OS gives "oshost": the result is ["envhost"];
  - OS gives "vm\n": the result is empty (the floor holds).
- **T2 runs itself again as a child process.** Precedent: kernel/tests/session_history_crash.rs:99-106 @ 53e0a0a1.
  - The child is started with `env_remove("HOSTNAME")`, `env_remove("COMPUTERNAME")` and an absolute `SPATIAL_IDE_AUDIT_LOG`, so there is no in-process `set_var`.
  - The child writes two `IntentRecord`s through `AuditLog::open_for` and `append_intent`. Precedent: kernel/tests/no_generation_in_persisted_artifacts.rs:70-71, :491-506 @ 53e0a0a1.
  - The control record does not carry the hostname, and its `residual_classes` must lack `machine-identifier`. The second record carries the `uname -n` name in `source_name`, not in `principal_name` (which would be attributed), and must list `machine-identifier`.
  - The oracle is `uname -n`, a separate path to the same kernel name, not the implementation's read of `/proc`.
  - The child fails by name, never passes, when the OS name is under 3 bytes (wave 3's container name `vm`, W3-A.md:133 @ 53e0a0a1) or when the name occurs in the control record.

**N7. Declared unchanged, and what would stop the piece**
- Declared unchanged: every existing redaction.rs test; kernel/tests/publish.rs::the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle (predicted: 0 leaked on Linux with the runner's name now scanned); scan-dist.test.mjs; the 3-byte floor; `RESIDUAL_CLASSES`; `MIN_PRINTABLE_RUN`.
- Windows' `--list --ignored` gains T2. Linux gains T1 and T2 as passed.
- Invalidator: any existing test changing outcome on either job stops the piece.

**N8. Paths, for the rule (00) check**
- Paths: kernel/src/bundle/redaction.rs, kernel/tests/redaction_hostname_off_windows.rs (new), kernel/README.md.
- None of them is log.rs, normalize.rs or scripts/plan.
- 7a's earlier skip reason has cleared: #241 merged (PLAN.yaml:5722 @ 53e0a0a1).
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
- **OPEN-2: is the Linux CLI publish refusing a bundle that holds the machine's name "new user-visible behaviour" under §21c?** KL 47 already states that refusal with no platform qualifier (KNOWN-LIMITATIONS.md:413-420 @ 53e0a0a1). Recommendation: (A).
  - (A) Not new: KL 47 made true on Linux, with no new string and no shipped Linux product. The filler stands.
  - (B) New: the piece leaves the filler slot for the full form and full gating.

## Questions for the custodian

- **Guarantee scope:** the form names a stated guarantee as touched, because the PERMISSION-BOUNDARY property's platform scope widens to Linux. Under §36 that keeps the five-line form with both gates. Please confirm it is not a red line.
- **Port-2's paths:** does `cut/port-2-macos-l1-and-app-dirs`, #270 or `cut/b2-piece-1c-save-and-reopen` edit kernel/README.md or scripts/plan/cfg-boundary*.mjs? The answer decides Route A against Route B (N4).

I have no shell, so there is no sha256 for this report.

Report path: C:/dev/spatial-ide/state/consults/2026-10-29-redaction-hostname-off-windows-five-line-form-lead-data-draft.md
