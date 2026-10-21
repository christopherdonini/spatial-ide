*Custodian's filing note (2026-10-21): the architect's draft of the full form for `bundle-redaction-scan-not-in-product-publish` (the human's placements message, item 1, graded S1), read only at main 54d07268. The run 2026-10-21T04:43:45Z to 04:58:36Z by its transcript (Glob 3, Grep 44, Read 43; no Write, Edit or Bash); its one SubagentHandback call, at 04:58:35Z. Checked by script at 54d07268: a call of `scan_directory` appears only in `kernel/src/bundle/redaction.rs` and `kernel/tests/publish.rs`. Not committed as a form: its OPEN-1 to OPEN-4 are the human's, its pins carry no hashes yet, and its O0 run stops the piece before any code. Extracted by script from the SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 8c05446a700ad8d09b8693d70177472b1649d226c6da526a9db7dc521998542f.*

---

Drafted: bundle-redaction-scan-not-in-product-publish, its full form, at main 54d07268

Below are the form, the OPEN items, and what I could not settle. The draft found no Correctness or Evidence blocker. One risk can only be settled by a run: whether the shipped viewer's own files trip the scan on the custodian's machine. That is step O0, and the piece stops on it before any code. I have no shell, so no cite here carries a sha256. Every `path:line` reads at 54d07268 (54d07268b on main), and the custodian fills the hashes by script before commit.

---

# The bundle redaction scan in the product publish: every staged file scanned before the rename, a finding refused by name — full form (PLAN node bundle-redaction-scan-not-in-product-publish)

File: kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md (proposed name; the custodian's choice)
Authority:
- The human's placements of 2026-10-21, item 1 (graded S1; slot 1 ahead of the order; the architect's form first; never weakened): state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:11 @ 54d07268. The message has its RULED block in DECISIONS-PENDING.md.
- S1 as defined: state/directives/2026-10-05-product-first-direction.md:21 @ 54d07268 (item 5).
- The node: PLAN.yaml:5394-5410 @ 54d07268.
- Candidate 1 of the boundary inventory: state/consults/2026-10-16-boundary-inventory-architect.md:25 @ 54d07268, and its publishing row, :16 @ 54d07268. This is evidence (a read at b88b1d2f), cited for what it reported. Every fact used here was re-read at 54d07268.

Drafted by: the architect agent, on the custodian's brief, read-only, at main 54d07268. No lead-data impact read was supplied (see "Could not settle").
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full; both gates from dispatch (§0.5).
Pins: every pin is a historical pin at 54d07268. For the code the piece edits, its base tree is authoritative. For what this form read, the pin is. If a pinned line has moved by the base, the worker re-derives the site by symbol. No pin carries a sha256 yet: the custodian adds each by script before this form is committed.

## §0. Disclosure

0.1 What exists.
- ADR-017 §13 (Accepted) says no local filesystem path, username, machine identifier or credential appears anywhere in a bundle, and that this is asserted by a scan over every byte of every emitted file: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:500-511 @ 54d07268.
- The scan is `bundle::redaction` (kernel/src/bundle/redaction.rs:1-365 @ 54d07268).
- `scan_directory` (:338-365) has two callers, both in one test, `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle`: kernel/tests/publish.rs:441 and :477 @ 54d07268. That test runs over one synthetic-viewer fixture bundle (:94-116, :421-482).
- `scan` (:220-307) has one product caller, the audit log's record check (kernel/src/permission/audit/log.rs:76, :249-254 @ 54d07268). That check is over audit records, never over a bundle.
- No product publish scans its emitted files.

0.2 Earlier evidence. kernel/RESULTS.md:1314-1315 @ 54d07268 reports the product scanner, run by hand over a 100k bundle with the real built viewer: 56 files, 0 findings. That is evidence at an older viewer build. Since then the notice set has grown, through the AGPL text, the EPSG section and the installed-program section: renderer/bundle-viewer/notice.mjs:135-236 @ 54d07268. So it does not settle O0.

0.3 Reuse index (the standing step). The custodian ran `node tools/reuse.mjs` in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The output below is byte-copied from the custodian's brief:
- `$ node tools/reuse.mjs redaction scan bundle` printed `No prior art recorded for "redaction scan bundle". Research it before planning an implementation.`
- `$ node tools/reuse.mjs publish emitted files leak` printed `No prior art recorded for "publish emitted files leak". Research it before planning an implementation.`

Both lookups missed. This is noted and does not block. The piece adds no new mechanism; it wires in an existing one.

0.4 Sibling search (AUTONOMY.md §14). The defect class is "a `docs/09` redaction function whose only callers are tests". One sibling: `Session::redact` (protocol/data-plane/src/session.rs:125-131 @ 54d07268). It is already node `session-log-token-redaction-rests-on-page-code` (PLAN.yaml:5411-5427 @ 54d07268). No new node is proposed.

0.5 Gating route. §21a applies, under three of its bullets:
- the piece makes ADR-017 §13's stated guarantee true of the product, a property under test;
- it adds an uninterruptible term to the publish's cancellation window (ADR-018; §2.6);
- it adds a refusal the operator can reach in ordinary use.

It is also over §21c's 150-line bound (§7). So the full form and both gates apply from dispatch (AUTONOMY.md:315-332 and :482 @ 54d07268), and no five-line form is committed.

0.6 Fixture drive: no measurement is taken, and the 5 GB fixture is not used.

## §1. May and may not claim

May claim, from §2 and §4's runs:
- every product publish (the shell's execute and the CLI, both through `permission::boundary::execute`) and every `publish_unguarded` call runs the unchanged `redaction::scan` over every byte of every staged file, after the last file is written and before the rename;
- a match that is not `operator-declared` refuses the publish with `PublishError::RedactionFinding`, code `publish.redaction_finding`, audited as `refused` with `error_kind` `RedactionFinding`. No bundle then exists under the destination name, and the staging directory is removed, or reported by `StagingNotRemoved` if it cannot be;
- the declared strings are exactly the two the format suite declares: the viewer's copyright and the corresponding-source `at` (kernel/tests/publish.rs:437-440 @ 54d07268);
- T1 to T5 and M1 to M7, as observed.

May not claim:
- that a published bundle carries nothing sensitive. The scan is a necessary condition only (redaction.rs:13-47 @ 54d07268):
  - a match must sit inside a run of at least 12 printable ASCII bytes;
  - a path among non-printable bytes is not reported;
  - an email address, a personal name or a postal address is not a class the scan knows (ADR-017:947-948 @ 54d07268);
- that the identity classes are scanned when the environment does not name them. `from_environment` reads `USERNAME`/`USER`/`LOGNAME` and `COMPUTERNAME`/`HOSTNAME`, at least 3 characters (redaction.rs:117-142 @ 54d07268). An identifier it cannot read is not scanned for (§2.8);
- that the bytes scanned are the bytes renamed against another process of the same user writing into the hidden staging directory between the scan and the rename. That window is declared, not closed;
- any duration: of the scan, of the publish, or of a cancel's acknowledgement while a file is being scanned. No `docs/08` row (docs/08_Testing.md:8 @ 54d07268 stays unscored for this term);
- that a declared string containing `"` or `\` is found in its JSON-escaped occurrence in `manifest.json`. It is not, and an identity match there then refuses: the scan fails closed, which is not a leak.

No ADR is amended, unless OPEN-4 (B) is ruled. There is no SKP, MCP, data-plane or wire change, and `protocol/` has an empty diff. There is no new dependency and no new `pub` item outside the `fixture` feature.

## §2. The change

2.1 What the scan checks, and what it does not (redaction.rs @ 54d07268).
- It checks every byte of the bytes it is handed. Each match is reported only if it lies inside a printable-ASCII run of at least `MIN_PRINTABLE_RUN` = 12 (:179-196). The classes:
  - `credential` and `local-filesystem-path` literal needles, ASCII case-insensitive (:146-166): `credential`, `password`, `passwd`, `secret`, `api_key`, `apikey`, `authorization:`, `bearer `, `private_key`, `BEGIN RSA`, `BEGIN PRIVATE`; `file://`, `\\?\`, `/home/`, `/Users/`, `/tmp/`, `/var/folders/`, `AppData\Local\Temp`, `AppData/Local/Temp`;
  - a drive-letter path `X:\` or `X:/` that is not preceded by a word character (:258-277);
  - the machine's usernames (`username`) and hostnames (`machine-identifier`) (:279-304).
- An identity match lying wholly inside an occurrence of a declared string is re-classed `operator-declared`. It is reported, never suppressed (:61-68, :224-242). Credentials and paths are never re-classed (:70-85). A declared string shorter than 12 characters after trimming is ignored (:204-217).
- What it does not check:
  - a match in a run shorter than 12 bytes (`C:/tmp/x`), or among non-printable bytes (:42-47);
  - path shapes outside the needle list (for example `/opt/…`);
  - any class it does not know (an email address, a personal name);
  - file names: only contents are scanned, and the walk reports relative names.
- `scan_directory` walks a directory depth-first, entries sorted, reads every file whole and scans it, then sorts all findings by (file, offset) (:338-365).

2.2 Where the product publish emits each file (kernel/src/publish/mod.rs @ 54d07268). Everything goes into one staging directory, a hidden sibling `.<name>.staging-<hex>` of the destination (`Staging::create`, :1438-1460, name at :1451), created at :636. Every file is written by `Staging::write_inner` (:1524-1581).

| File | Written at | Via |
|---|---|---|
| `data/part-NNNNN.arrows` | :807-808 (directory :735) | `write_partition` |
| `style.json` | :833 | `write` |
| `viewer/<asset>` (`index.html`, `app.js`, `NOTICE.txt` from `renderer/bundle-viewer/dist` in the shell: frontends/shell/src-tauri/src/publish.rs:1383-1395 @ 54d07268) | :837-852 | `write` |
| `manifest.json` | :902 | `write` |
| `build-info.json` (the sidecar) | :927-930 | `write` |

The bundle is handed over by `Staging::finalize`'s rename (:1612-1629), called at :934 after `total_bytes` (:933). The shell then returns `ExecuteOutcome::Success`, and the CLI prints its facts.

2.3 The one place: in `run_inner`, after the sidecar write (:927-930) and before `staging.total_bytes()` (:933) and `staging.finalize` (:934). The gate:
- builds `MachineIdentifiers { declared: vec![req.viewer_license.copyright.clone(), req.viewer_license.corresponding_source.at.clone()], ..MachineIdentifiers::from_environment() }`, the test's own construction (kernel/tests/publish.rs:437-440 @ 54d07268). These two strings reach the manifest unchanged (mod.rs:1204-1210 @ 54d07268);
- walks the staging root in `scan_directory`'s order;
- calls `watch.check()` before each file;
- reads each regular file whole and passes its bytes to `redaction::scan`, unchanged;
- stops at the first file holding a finding whose class is not `OPERATOR_DECLARED`;
- returns `PublishError::RedactionFinding` for that file, with its findings sorted by offset: `file` (the bundle-relative path), `class` and `byte_offset` of the lowest-offset one, and `count`, the number of such findings in that file;
- refuses a read or list failure through `error::classify_io` (error.rs:467 @ 54d07268), so it is reported as an I/O failure and never as a pass.

The walk stops at the first such file, so the number of findings held in memory is bounded by one file's. The test helper `scan_directory` keeps reporting the whole bundle.

2.4 kernel/src/bundle/redaction.rs.
- One private walk, shared by `scan_directory` and the gate. It visits the same files in the same order as today's walk.
- `scan_directory`'s signature, return value and final sort are unchanged.
- One `pub(crate)` function for the gate, for example `first_undeclared_findings(root, machine, before_each_file)`; the shape of its error is the worker's. Its product caller is `run_inner`.
- One module-doc paragraph, W7.
- Byte-identical: `scan`, `CREDENTIAL_NEEDLES`, `MIN_PRINTABLE_RUN`, `ATTRIBUTABLE_CLASSES`, `OPERATOR_DECLARED`, `declared_ranges`, `in_printable_run`, `find_all_ascii_ci`, `finding`, `MachineIdentifiers` with `from_environment`, and the whole `mod tests` (:367-589).

2.5 What happens on a finding, end to end.
- `run_inner` returns the error. `publish_prepared`'s error arm removes the staging directory, or returns `StagingNotRemoved { after }` (mod.rs:638-653 @ 54d07268). A panic is covered by `Drop` (:1645-1668).
- `boundary::execute` writes the outcome record through `finish` (kernel/src/permission/boundary.rs:453, :482-506 @ 54d07268). The new arms:
  - `error_kind` gains `RedactionFinding` (:203-250);
  - `publish_outcome` classes it `Refused`, as the gate working (:280-310). Under `StagingNotRemoved` the outcome follows the inner error, as today (:283).
- The outcome record carries `error_kind` only, never a message (:482-497).
- The shell maps `BoundaryError::Publish(e)` to `ExecuteOutcome::Refused { message: e.refusal_detail() }` (frontends/shell/src-tauri/src/publish.rs:858-862 @ 54d07268). `formatPublishRefusal` reads any `publish.<snake_case>` prefix (frontends/shell/src/publish/formatPublishRefusal.ts:44 @ 54d07268), so the shell needs no change.
- The CLI prints `Display` (kernel/src/bin/publish-bundle.rs:656 @ 54d07268).
- The class-3 act (the rename) never happens. ADR-006's class and `REVERSIBILITY_CLASS` are unchanged, and so is ADR-010 rule 7's recovery policy (mod.rs:60-64 @ 54d07268).

2.6 Cancellation (ADR-018 vocabulary). The gate adds a term to the Finalizing window: one file's `std::fs::read` (an unbounded external section) plus one `scan` of it (a code-controlled quantity, at most one file's bytes). Those bytes are bounded by the partition size (at most 1 MiB, mod.rs:1509 @ 54d07268) or by `MAX_VIEWER_ASSET_BYTES` (16 MiB, kernel/src/publish/viewer_assets.rs:35 @ 54d07268), whichever is larger: in bytes, never in time. ADR-017 Corrigendum 4's table names the partition-write window (ADR-017:1076-1093 @ 54d07268) and is not edited (OPEN-4). The term is declared in W4 and here. No new phase (OPEN-2) and no new trace span.

2.7 kernel/src/publish/error.rs.
- The variant `RedactionFinding { file: String, class: &'static str, byte_offset: usize, count: usize }`, with no excerpt (OPEN-1). Its doc is W3.
- `code()` arm: `"publish.redaction_finding"` (:247-278).
- `Display` arm: W1, a P6 placeholder, on the `GeometryEncodingNotPublishable` precedent (:400-406).
- kernel/src/permission/audit/reader.rs: `plain_reason` gains `"RedactionFinding"` with W2 (:226-284 @ 54d07268). Without it, `--audit-show` would print the kind as unrecognised (:282), against the exposure review's legibility condition (ADR-017:1123-1125 @ 54d07268).

2.8 Portability (state/directives/PORTABILITY-2026-09-30.md, R1 to R6).
- The owning boundary is publishing (kernel). No OS cfg is added.
- The byte classes behave the same on Windows, macOS and Linux.
- The identity classes depend on the environment:
  - Windows is supported (`USERNAME`, `COMPUTERNAME`);
  - macOS and Linux are explicitly reduced: `HOSTNAME` is often not exported to a child process, and the hostname is then not scanned (redaction.rs:115-116 @ 54d07268). This is reachable only through the CLI or the kernel there, because the shell is Windows-only.
- Kernel tests run on Windows and ubuntu in CI; the shell tests on Windows. No KNOWN-LIMITATIONS item is owed for this, since no shipped Linux or macOS product exists.

2.9 Seams (the human's rule of 2026-09-16, round 4).
- Kernel to shell: the consuming side's actual interface is `refusal_detail()` through `ExecuteOutcome::Refused` (publish.rs:858-862 @ 54d07268) and the prefix regex (formatPublishRefusal.ts:44 @ 54d07268). T1 is the end-to-end proof from the real shape: `prepare`, then `execute`, then `boundary::execute`, then `publish_prepared`.
- Kernel to the audit reader: the `error_kind` string. T5 reads the real record and T4 the reader.
- Engine fixture to the tests: test support behind `fixture`, on the precedent at engine/src/fixture.rs:194-195 @ 54d07268. It has no shipped caller, by that precedent.
- Caller rule: the gate function, the variant and the reader arm each have a product caller. Nothing new is `pub` outside `fixture`.

2.10 Words. Only W6 is a sentence of the human's (OPEN-3). W1 is a P6 placeholder for an app string. W2 to W5 and W7 are the architect's; the worker applies them and the PR body lists them. The clause checks are under "Words, checked" below.

## §3. Fixtures

- F1: engine/src/fixture.rs gains `pub fn write_zone_texts(path: &Path, zones: &[&str])`, behind `fixture`. It writes one Polygon feature per value: `id` UInt64 from 0, `geometry` WKB, unit squares in LV95, `zone` Utf8 holding the given values, and GeoParquet metadata as in `write_hostile_batch` (:1627-1680 @ 54d07268).
- T1 and T5 use 10 values: `residential` ×9, and at index 3 `C:\Users\someone\AppData\Local\Temp\leak.parquet`. The `AppData\Local\Temp` needle fires whatever the neighbouring bytes are.
- Predicted for T1 and T5: the first undeclared file is `data/part-00000.arrows`, class `local-filesystem-path`, count ≥ 1.
- Each test writes its own fixture per run; nothing is pinned by hash. The 5 GB fixture is not used.

## §4. Tests and mutations

Every mutation and run is observed the same way: apply it, run the named test alone, record its outcome by name with the commit it was observed at, and revert. A verify-mutation run is never called an observation (round 25, item 2 (c)).

New tests:
- **T1** (frontends/shell/src-tauri/src/publish.rs, `mod tests`): `a_publish_whose_styled_column_holds_a_path_is_refused_by_the_redaction_scan_and_nothing_reaches_the_destination`. It uses `env_lock`, `AUDIT_LOG_ENV`, F1, `prepare` with the module's `STYLE`, then `execute` with the right phrase, and asserts:
  - `ExecuteOutcome::Refused`, whose message starts `publish.redaction_finding: ` and contains `data/part-00000.arrows` and `local-filesystem-path`;
  - the destination is absent, and `staging_entries` (:3163) is 0;
  - the audit log holds 2 lines, and the outcome line has `outcome` `refused` and `error_kind` `RedactionFinding`.
- **T3** (kernel/tests/typed_terminal_codes.rs): `a_redaction_refusal_detail_begins_with_its_typed_code`. It asserts the code, the `refusal_detail` prefix, that the detail ends with `Display`, the `[P6 placeholder] ` prefix, and that the text contains the file, class, offset and count.
- **T4** (reader.rs `mod tests`): `a_redaction_refusal_reads_as_its_plain_reason`. A refused pair with `error_kind` `RedactionFinding` renders W2 and not the unrecognised sentence.
- **T5** (kernel/tests/permission_boundary.rs): `the_boundary_refuses_a_bundle_whose_data_holds_a_path_before_the_rename_and_audits_it_as_refused`. It uses F1 with `grant_for`, `run_attempt` and the right approval, and asserts:
  - `Err(BoundaryError::Publish(PublishError::RedactionFinding { file, class, .. }))` with the §3 values;
  - `no_side_effect(dir, destination)`;
  - the outcome record is `refused` / `RedactionFinding`.

Unchanged and still passing (the clean side, from the real shape):
- `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` (publish.rs:1856-1909 @ 54d07268);
- `granted_and_approved_publishes_and_records_a_success_with_the_manifest_hash` (permission_boundary.rs:525);
- `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle` (kernel/tests/publish.rs:421-482 @ 54d07268);
- every redaction unit test (redaction.rs:385-588 @ 54d07268).

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
- **O0 (at B, before any code):** a scratch integration test, never committed or pushed. It builds `renderer/bundle-viewer` with `npm run build` at B, publishes `kernel/tests/publish.rs`'s 2,000-feature fixture through `publish_unguarded` with `ViewerAssets::from_dir(renderer/bundle-viewer/dist)` and `bundled_viewer_license()`'s copyright and route, and runs the unchanged `scan_directory` with those two declared. It records every finding.
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
- `PublishPhase` (under OPEN-2 (A));
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

- At most 430 changed lines by §21c's rule, tests included. Counted with `git diff --numstat B H -- <the files below>`, where B = `git merge-base origin/main H`. The PR body names both.

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
| KNOWN-LIMITATIONS.md | 14, only under OPEN-3 (A) |
| kernel/README.md | 6 (owner's index, lead-data's update) |
| engine/README.md | 4 (owner's index, lead-data's update) |

- Non-generated files: this form and the 12 above.
- No constant is added. The bound is the existing `MIN_PRINTABLE_RUN`. The cadence term of §2.6 is bounded by the existing partition ceiling and `MAX_VIEWER_ASSET_BYTES`.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Code before this form is committed on main with the custodian's hashes; code of an OPEN option not yet ruled; code before O0 is recorded.
2. **The scan weakened**, by any of:
   - any edit to an item in §2.4's byte-identical list;
   - a declared string beyond the two;
   - any file, directory or byte range skipped, or a file's bytes split before `scan`;
   - a finding downgraded to a warning, logged and continued, or counted against a threshold;
   - an I/O error read as a pass.
3. Any edit to kernel/tests/publish.rs or to redaction.rs's `mod tests`.
4. The gate placed anywhere but once, after the sidecar write and before `finalize`; or any path to `finalize` that bypasses it.
5. A rename after a finding.
6. The matched text in the refusal (under OPEN-1 (A)) or in the audit record; anything beyond `error_kind` in the record.
7. A new `pub` item outside `fixture`; the fixture writer outside `fixture`.
8. Any diff under `protocol/`, `frontends/shell/src/` or `frontends/shell/e2e/`, or to SKP-V0.md, an ADR or `PublishPhase`, without the ruling that licenses it.
9. A string the app shows that is not marked `[P6 placeholder]`; KNOWN-LIMITATIONS words not ruled under OPEN-3.
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
- **KNOWN-LIMITATIONS:** per OPEN-3.
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ 54d07268). lead-data writes it and the worker applies it:
  - kernel/README.md:360 (last verified) and :372-373 (the publish and boundary rows gain T5) @ 54d07268;
  - engine/README.md:530 and :546 @ 54d07268.
- **Overlap (rule 00).** This piece touches kernel/src/bundle/, kernel/src/publish/, kernel/src/permission/, three kernel test files, engine/src/fixture.rs, frontends/shell/src-tauri/src/publish.rs, KNOWN-LIMITATIONS.md (one new item), kernel/README.md, engine/README.md and this form. Nothing is under `protocol/`.
  - Governance D (PR #237: scripts/plan/rotate-plan-summaries.mjs and its test, scripts/plan/README.md, AUTONOMY.md, and at S10 PLAN.yaml, CUSTODIAN-QUEUE.*, site/, state/cut-archive/, state/drafts/) shares no path.
  - Piece 1c and milestone 4 are drafting, with no paths yet. At dispatch the custodian checks that neither, nor any docs-lane piece, touches these files. 1c is likely kernel-side and milestone 4 is shell-side, so frontends/shell/src-tauri/src/publish.rs and kernel/src/publish/** are the paths to check.
  - PLAN.yaml stays the custodian's, on main.

## §10. Amendments

(opens empty; append-only)

---

## Words, checked

**W1 — the `Display`; a P6 placeholder for an app string, the human's at the sitting:**
`[P6 placeholder] refused: the redaction scan (ADR-017 §13) found {count} match(es) in `{file}` that are not operator-declared, the first of class `{class}` at byte {byte_offset}; no bundle was created at the destination`
- "found {count} match(es) in {file}": the count is of that one file's findings, because the walk stops at the first such file (§2.3). No claim is made about other files.
- "that are not operator-declared": the gate's filter, against `OPERATOR_DECLARED` (redaction.rs:68).
- "the first … at byte": the lowest offset, because §2.3 sorts that file's findings by offset.
- "no bundle was created at the destination": `finalize` (mod.rs:934) is not reached. It makes no claim about staging removal, which `StagingNotRemoved` reports separately.

**W2 — the reader's arm (CLI text, not the app; the worker applies):**
`the redaction scan found a local filesystem path, user name, machine identifier or credential in the staged bundle`
- The four refusable classes are `local-filesystem-path`, `username`, `machine-identifier` and `credential` (redaction.rs:146-166, :279-304). `operator-declared` never refuses.

**W3 — the variant's doc:**
The redaction scan (ADR-017 §13; `bundle::redaction`) found, in one staged file, a match that is not operator-declared. Raised after every staged file is written and before the rename, so no bundle exists under the destination name. The staging directory is then removed as on every other failure, or reported by `StagingNotRemoved`. Carries that file's bundle-relative path, the first match's class and byte offset, and the number of such matches in that file. Never the matched text: a credential match would carry the credential (`docs/09`).
- Checked against §2.3 and §2.5, and against mod.rs:638-653.

**W4 — the comment at the gate's site:**
**The redaction gate (ADR-017 §13): every staged file, as it is on disk, before the rename.** It runs the same `redaction::scan` the format suite runs, with the same two declared strings: the viewer's copyright and its corresponding-source route. Cancellation is checked before each file, so the window between checks is one file's read and scan, bounded in bytes and not in time. A match that is not operator-declared refuses with `RedactionFinding`. A file that cannot be read refuses as an I/O failure, never as a pass.
- Checked against kernel/tests/publish.rs:437-440 and against §2.3 and §2.6.

**W5 — the order doc, step 6 (mod.rs:58):**
`6. **Re-check the source with the fail-closed heuristic**, write the sidecar, **scan every staged file for the `docs/09` classes** (`bundle::redaction`; a match that is not operator-declared refuses), then rename.`
- Matches :911, :927-930, the gate, and :934, in that order.

**W7 — redaction.rs module doc, a new paragraph:**
`## Where the product runs it` / `publish` runs `scan` over every staged file before the rename and refuses on the first file holding a match that is not operator-declared; `scan_directory` stays the tests' whole-bundle report.
- Checked against §2.3 and §2.4.

**W6 — KNOWN-LIMITATIONS, a new item; the human's sentence (OPEN-3):**
**A publish is refused when the bundle would contain a local path, your login name, this computer's name or a credential word, and the check is a pattern search, not a proof.** Before the bundle is moved into place, every file it would contain is searched, including the values of the columns your style uses, for:
- text shaped like a local path, such as a drive path (`C:\…`), a home or temp folder, or a `file://` address;
- your login name or this computer's name, except inside the copyright notice and the source-code address the bundle carries;
- words such as `password`, `secret` or `api_key`, wherever they appear.

Any match refuses the publish as `publish.redaction_finding`, naming the file and the kind of match, and no bundle appears at the destination. A dataset whose styled column holds such a word in ordinary text cannot be published as it is. A match is seen only inside at least 12 consecutive printable ASCII characters, so a short path, or one surrounded by binary bytes, is not caught.

Clause checks:
- "before the bundle is moved into place": the gate precedes `finalize` (§2.3).
- "the columns your style uses": the shell publishes `style_attributes` (frontends/shell/src-tauri/src/publish.rs:406, :532 @ 54d07268).
- "such as": the needle list (redaction.rs:146-166) and the drive rule (:258-277); not claimed to be exhaustive.
- The login-name and computer-name clause: re-classed only wholly inside a declared occurrence (:224-242), with the two declared strings (§2.3); names from the environment (:117-142).
- "wherever they appear": credentials are never re-classed (:70-85).
- "naming the file and the kind of match": W1.
- The 12-character limit and binary bytes: :42-47 and :179.
- Ordinary use can reach this: a styled text value containing `secret` refuses.

---

## OPEN items for the human

**OPEN-1 — the refusal: its code, and what its text carries.**
- (A) Code `publish.redaction_finding`, `error_kind` `RedactionFinding`, outcome `refused`. The text names the file, the first match's class and byte offset, and the count in that file, and never the matched text. No shell guidance entry, on the precedent of the geometry-encoding refusal (kernel/tests/typed_terminal_codes.rs:455-459 @ 54d07268).
- (B) As (A), and the text also carries the matched excerpt for path and identity classes (never for `credential`).
- **Recommended: (A).** A refusal reaches the CLI's stderr and the app's refusal block, and docs/09 keeps credentials out of logs. One rule, "never the text", is simpler to hold than a per-class rule. The file and class are actionable, because the operator knows which column the style colours by. The text is a P6 placeholder either way.

**OPEN-2 — a progress phase for the scan.**
- (A) None: the scan runs inside the existing `Finalizing` phase. No new string, and the phase sequences tests assert are unchanged.
- (B) A new `PublishPhase` (for example `scanning`) with a P6 label in the shell. This adds frontends/shell paths and phase-sequence test changes.
- **Recommended: (A)** for this S1. The cost: on a large bundle the operator sees "finalizing" while every file is re-read. Recorded in §2.6.

**OPEN-3 — a KNOWN-LIMITATIONS item.**
- (A) A new item, W6, approved by the human or replaced by the human's own words.
- (B) None until the sitting.
- **Recommended: (A).** Ordinary use reaches the refusal: a word such as "secret" in a styled column refuses the publish.

**OPEN-4 — ADR text.**
- (A) No ADR text in this piece. ADR-017 §13 already states what the code now does. The new refusal and the new uninterruptible term (§2.6) are recorded in the code and this form. The custodian proposes a node for an ADR-017 note in the human's typed words, naming the product gate and Corrigendum 4's new term.
- (B) That note lands in this PR, in the human's typed words, before the merge.
- **Recommended: (A).** It keeps the S1 off a red-line text. Corrigendum 4's table speaks to §15's partition window, and the new term is disclosed rather than hidden. No words are drafted here: ADR amendments are red-line text.

No SKP or wire change is needed. A publish refusal rides an existing string, and SKP-V0 says so (protocol/skp/SKP-V0.md:783-795 @ 54d07268).

## What I could not settle

1. **O0's outcome.** Whether the shipped viewer's app.js or NOTICE.txt holds a needle, or the custodian's login name outside the two declared strings, is unknown until O0 runs. Third-party licence texts and bundled library code were not read. If it fires, every product publish would refuse; the piece stops and the human rules.
2. **No lead-data impact read** was supplied for this kernel and engine piece (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7 @ 54d07268). The custodian decides whether to run one before committing the form.
3. **Duration.** The scan's duration on the 5 GB hero publish (it re-reads about 5.7 GB of partitions), and the acknowledgement time of a cancel while the largest viewer asset is scanned, are unmeasured. None is claimed. A refusal on a large dataset arrives only after every partition is written.
4. **The CLI with a different route.** A CLI publish of the real viewer with a `--corresponding-source-url` other than the one in the viewer's NOTICE, or a `--license-by` naming the login name, refuses on a machine whose login name appears there. This follows from not widening the declared set, which would weaken the scan, and is not offered.
5. **No test for a cancel during the scan** (M7 is a survivor). A test needs a hook between files, which this piece does not add.
6. **Rule 00 for piece 1c and milestone 4** can only be checked at dispatch.
7. **The node's 60-minute budget** looks short for 13 files. That is the custodian's call.
8. **Every pin is unhashed.**

Report path, for filing: C:/dev/spatial-ide/state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-draft.md
