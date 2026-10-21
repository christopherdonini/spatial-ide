*Custodian's filing note (2026-10-21): the architect's revision of the redaction scan's full form, after the human's rulings and lead-data's impact read, read only at main 9a8bd442. The run 2026-10-21T08:51:58Z to 09:06:16Z by its transcript (Read 75, Glob 5, Grep 34; no Write, Edit or Bash), up to its first SubagentHandback call, at 09:06:16Z. Not committed as the form: about 160 of its line cites are bare, which a script cannot pin safely, and the custodian has asked the same agent for the form with every cite's path written out. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 8978b897ccf553b156bbe0e19db5e4febf381c3c78a366018f0d6c941213705c.*

---

Revised: bundle-redaction-scan-not-in-product-publish, its full form, at main 9a8bd442

I have no shell, so no cite below carries a sha256. Every `path:line` I wrote was read in the main checkout at 9a8bd442. That checkout is clean except for two untracked files outside every path named here. The custodian adds the hashes by script and writes the full commit id with each one. The revision found no Correctness or Evidence blocker. It did correct one claim of a limit in the draft: the draft said "a partition is at most 1 MiB" (§2.6 below). It also changes one design detail: how a failed read is reported (§2.3 below). O0 still stops the piece before any code.

## What changed against the draft, and why

**Item 1: the OPEN items ruled**
- Authority gains the rulings directive, `:12`.
- §1's last paragraph: "unless OPEN-4 (B) is ruled" now reads "(OPEN-4 (A))".
- §2.6: "No new phase (OPEN-2)" now reads "(OPEN-2 (A))".
- §2.10: W6 is marked approved as drafted.
- §5: `PublishPhase` is marked "(OPEN-2 (A))".
- §7: the KNOWN-LIMITATIONS row is marked "(OPEN-3 (A): W6)".
- §8: items 1, 6, 8 and 9 are settled. The clause about "an OPEN option not yet ruled" is removed, and "the ruling that licenses it" now names OPEN-2 (A) and OPEN-4 (A). For KNOWN-LIMITATIONS, the only words allowed are W6, byte for byte.
- §9's KNOWN-LIMITATIONS line now names W6.
- The owner's-index update gains kernel/README.md `:392` (declared limits). OPEN-3 (A) adds a declared limit, and that row lists them.
- The OPEN section is now "OPEN items, ruled". Each (A) is kept byte for byte, including OPEN-1 (A)'s pin at 54d07268, which I re-read at 9a8bd442 and which is unchanged. The (B) options and the recommendations are not carried, because the ruling settles them; the draft keeps them at its pin.
- W6 is byte-identical.

**Item 2: the impact read's five questions**
- **Q1** (which ceiling bounds a partition's bytes) is answered in §2.6, under "The bytes of one file".
- **Q2** (the ADR-018 §4 classification, and where the term sits against Corrigendum 4 and CANCELLATION-AND-TRACING §3) is answered in §2.6.
- **Q3** (the bundle size the cost is stated against) is answered in §2.6, under "Cost".
- **Q4** (whether the build figures include the scan) is answered in a new §2.3 paragraph, "The build figures", plus one bullet in §1 "May not claim".
- **Q5** (the ceiling on the findings held for one file) is answered in §2.3's last paragraph, "Findings held", and in §7.
- No question is left open.

**Item 3: pointers corrected and cites re-read**
- §0.1: log.rs `:249-254` is now `:76` (the import), `:249-255` (the identifiers) and `:256` (the call). This is the impact read's correction.
- §2.5: the CLI pointer `publish-bundle.rs:656` is the `boundary::execute` call, not the print. The `Display` is printed at `:166-171`, and `BoundaryError::Publish`'s `Display` delegates at boundary.rs:162.
- §2.6, a changed fact: the draft said "at most 1 MiB, mod.rs:1509". That holds only for a partition of more than one row, on the producer's estimate. A single-row partition can reach `MAX_BATCH_BYTES` (4 MiB) on the estimate (stream.rs:2028, :2488-2505). Also, `manifest.json`, `style.json` and `build-info.json` have no byte ceiling of their own. So the draft's "bounded in bytes … whichever is larger" was a claim of a limit the code does not support. §2.6, W4 and §7 are corrected.
- §2.3, a changed fact: `classify_io` (error.rs:467-512) maps access-denied and sharing-violation codes to `DestinationNotWritable`. A failed read would then be reported as "is not writable", which contradicts the draft's "reported as an I/O failure". The gate now returns `PublishError::Io` directly, as `total_bytes`'s walk already does (mod.rs:1597-1601). This is a design change; see also "Sentences outside items 1 to 6".
- Every other cite reads the same lines at 9a8bd442 as at 54d07268, and is re-pinned to 9a8bd442.

**Item 4: the budget.** §7 declares 240 minutes for the custodian to set as the node's `budget_minutes`, replacing 60.

**Item 5: rule (00).** §9's Overlap is rewritten. It checks governance D (including D's OPEN-5 (B) hold on PLAN.yaml commits), PR #239, ADR-036's pre-acceptance block, piece 1c and milestone 4, and adds a KNOWN-LIMITATIONS numbering note.

**Item 6: files read.**
- A new "Files read" section at the end of the form lists the impact read's pointers I used, those I found wrong (none), and those that were missing.
- The "Drafted by" line no longer says no impact read was supplied.

**Sentences outside items 1 to 6, with why**
- §1, first bullet: "every product publish (the shell's execute and the CLI …)" now reads "every publish through `permission::boundary::execute` (the shell's execute and the `publish-bundle` CLI, which ADR-017 keeps as developer and test tooling)". The reason: ADR-017:1140 says the CLI remains developer/test tooling, so calling it a product contradicts an Accepted record.
- §2.3's read-failure bullet and W4's last sentence change to match the design change under item 3.

---

# The bundle redaction scan in the product publish: every staged file scanned before the rename, a finding refused by name — full form (PLAN node bundle-redaction-scan-not-in-product-publish)

File: kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md (proposed name; the custodian's choice)
Authority:
- The human's placements of 2026-10-21, item 1 (graded S1; slot 1 ahead of the order; the architect's form first; never weakened): state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:11 @ 9a8bd442. The message has its RULED block in DECISIONS-PENDING.md.
- The human's rulings on this form (OPEN-1 to OPEN-4 (A); W6 approved as drafted; a lead-data impact read before the form is committed): state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12 @ 9a8bd442. The message has its RULED block in DECISIONS-PENDING.md.
- S1 as defined: state/directives/2026-10-05-product-first-direction.md:21 @ 9a8bd442 (item 5).
- The node: PLAN.yaml:5394-5410 @ 9a8bd442.
- Candidate 1 of the boundary inventory: state/consults/2026-10-16-boundary-inventory-architect.md:25 @ 9a8bd442, and its publishing row, :16 @ 9a8bd442. This is evidence (a read at b88b1d2f), cited for what it reported. Every fact used here was re-read at 9a8bd442.
- lead-data's impact read: state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-impact-read.md (read at ab9a4b4f). This is evidence; the pointers this form used are listed under "Files read".

Drafted by: the architect agent, read-only. Drafted at main 54d07268 (state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-draft.md); revised at main 9a8bd442 after the human's rulings and lead-data's impact read.
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full; both gates from dispatch (§0.5).
Pins: every pin is a historical pin at 9a8bd442. For the code the piece edits, its base tree is authoritative. For what this form read, the pin is. If a pinned line has moved by the base, the worker re-derives the site by symbol. No pin carries a sha256 yet: the custodian adds each by script, with the full commit id, before this form is committed. OPEN-1 (A)'s own pin stays at 54d07268, as ruled; the line read the same at 9a8bd442.

## §0. Disclosure

0.1 What exists.
- ADR-017 §13 (Accepted) says no local filesystem path, username, machine identifier or credential appears anywhere in a bundle, and that this is asserted by a scan over every byte of every emitted file: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:500-511 @ 9a8bd442.
- The scan is `bundle::redaction` (kernel/src/bundle/redaction.rs:1-365 @ 9a8bd442).
- `scan_directory` (:338-365) has two callers, both in one test, `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle`: kernel/tests/publish.rs:441 and :477 @ 9a8bd442. That test runs over one synthetic-viewer fixture bundle (:94-116, :421-482).
- `scan` (:220-307) has one product caller, the audit log's record check: kernel/src/permission/audit/log.rs:76 (the import), :249-255 (the identifiers) and :256 (the call) @ 9a8bd442. That check is over audit records, never over a bundle.
- No product publish scans its emitted files.

0.2 Earlier evidence. kernel/RESULTS.md:1314-1315 @ 9a8bd442 reports the product scanner, run by hand over a 100k bundle with the real built viewer: 56 files, 0 findings. That is evidence at an older viewer build. Since then the notice set has grown, through the AGPL text, the EPSG section and the installed-program section: renderer/bundle-viewer/notice.mjs:135-236 @ 9a8bd442. So it does not settle O0.

0.3 Reuse index (the standing step). The custodian ran `node tools/reuse.mjs` in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The output below is byte-copied from the custodian's brief:
- `$ node tools/reuse.mjs redaction scan bundle` printed `No prior art recorded for "redaction scan bundle". Research it before planning an implementation.`
- `$ node tools/reuse.mjs publish emitted files leak` printed `No prior art recorded for "publish emitted files leak". Research it before planning an implementation.`

Both lookups missed. This is noted and does not block. The piece adds no new mechanism; it wires in an existing one.

0.4 Sibling search (AUTONOMY.md §14). The defect class is "a `docs/09` redaction function whose only callers are tests". One sibling: `Session::redact` (protocol/data-plane/src/session.rs:125-131 @ 9a8bd442). It is already node `session-log-token-redaction-rests-on-page-code` (PLAN.yaml:5411-5427 @ 9a8bd442). No new node is proposed.

0.5 Gating route. §21a applies, under three of its bullets:
- the piece makes ADR-017 §13's stated guarantee true of the product, a property under test;
- it adds an uninterruptible term to the publish's cancellation window (ADR-018; §2.6);
- it adds a refusal the operator can reach in ordinary use.

It is also over §21c's 150-line bound (§7). So the full form and both gates apply from dispatch (AUTONOMY.md:315-332 and :482 @ 9a8bd442), and no five-line form is committed.

0.6 Fixture drive: no measurement is taken, and the 5 GB fixture is not used.

## §1. May and may not claim

May claim, from §2 and §4's runs:
- every publish through `permission::boundary::execute` (the shell's execute and the `publish-bundle` CLI, which ADR-017 keeps as developer and test tooling: docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1140 @ 9a8bd442) and every `publish_unguarded` call runs the unchanged `redaction::scan` over every byte of every staged file, after the last file is written and before the rename;
- a match that is not `operator-declared` refuses the publish with `PublishError::RedactionFinding`, code `publish.redaction_finding`, audited as `refused` with `error_kind` `RedactionFinding`. No bundle then exists under the destination name, and the staging directory is removed, or reported by `StagingNotRemoved` if it cannot be;
- the declared strings are exactly the two the format suite declares: the viewer's copyright and the corresponding-source `at` (kernel/tests/publish.rs:437-440 @ 9a8bd442);
- T1 to T5 and M1 to M7, as observed.

May not claim:
- that a published bundle carries nothing sensitive. The scan is a necessary condition only (redaction.rs:13-47 @ 9a8bd442):
  - a match must sit inside a run of at least 12 printable ASCII bytes;
  - a path among non-printable bytes is not reported;
  - an email address, a personal name or a postal address is not a class the scan knows (ADR-017:947-948 @ 9a8bd442);
- that the identity classes are scanned when the environment does not name them. `from_environment` reads `USERNAME`/`USER`/`LOGNAME` and `COMPUTERNAME`/`HOSTNAME`, at least 3 characters each (redaction.rs:117-142 @ 9a8bd442). An identifier it cannot read is not scanned for (§2.8);
- that the bytes scanned are the bytes renamed, against another process of the same user writing into the hidden staging directory between the scan and the rename. That window is declared, not closed;
- any duration: of the scan, of the publish, or of a cancel's acknowledgement while a file is being scanned. No `docs/08` row (docs/08_Testing.md:8 @ 9a8bd442 stays unscored for this term);
- that `build_millis`, the sidecar's `finished_at` or the CLI's `build ms` includes the scan. All three are sampled before it (§2.3);
- that a declared string containing `"` or `\` is found in its JSON-escaped occurrence in `manifest.json`. It is not, and an identity match there then refuses: the scan fails closed, which is not a leak.

No ADR is amended (OPEN-4 (A)). There is no SKP, MCP, data-plane or wire change, and `protocol/` has an empty diff. There is no new dependency and no new `pub` item outside the `fixture` feature.

## §2. The change

2.1 What the scan checks, and what it does not (redaction.rs @ 9a8bd442).
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

2.2 Where the product publish emits each file (kernel/src/publish/mod.rs @ 9a8bd442). Everything goes into one staging directory, a hidden sibling `.<name>.staging-<hex>` of the destination (`Staging::create`, :1438-1460, name at :1451), created at :636. Every file is written by `Staging::write_inner` (:1524-1581).

| File | Written at | Via |
|---|---|---|
| `data/part-NNNNN.arrows` | :807-808 (directory :735) | `write_partition` |
| `style.json` | :833 | `write` |
| `viewer/<asset>` (`index.html`, `app.js`, `NOTICE.txt` from `renderer/bundle-viewer/dist` in the shell: frontends/shell/src-tauri/src/publish.rs:1383-1395 @ 9a8bd442) | :837-852 | `write` |
| `manifest.json` | :902 | `write` |
| `build-info.json` (the sidecar) | :927-930 | `write` |

The bundle is handed over by `Staging::finalize`'s rename (:1612-1629), called at :934 after `total_bytes` (:933). The shell then returns `ExecuteOutcome::Success`, and the CLI prints its facts.

2.3 The one place: in `run_inner`, after the sidecar write (:927-930) and before `staging.total_bytes()` (:933) and `staging.finalize` (:934). The gate:
- builds `MachineIdentifiers { declared: vec![req.viewer_license.copyright.clone(), req.viewer_license.corresponding_source.at.clone()], ..MachineIdentifiers::from_environment() }`, the test's own construction (kernel/tests/publish.rs:437-440 @ 9a8bd442). These two strings reach the manifest unchanged (mod.rs:1204-1210 @ 9a8bd442);
- walks the staging root in `scan_directory`'s order;
- calls `watch.check()` before each file;
- reads each regular file whole and passes its bytes to `redaction::scan`, unchanged;
- stops at the first file holding a finding whose class is not `OPERATOR_DECLARED`;
- returns `PublishError::RedactionFinding` for that file, with its findings sorted by offset: `file` (the bundle-relative path), `class` and `byte_offset` of the lowest-offset one, and `count`, the number of such findings in that file;
- refuses a failure to list a directory or read a file as `PublishError::Io`, with a context naming the redaction scan, never as a pass. This follows `total_bytes`'s own walk (mod.rs:1597-1601 @ 9a8bd442). It does not go through `error::classify_io` (kernel/src/publish/error.rs:467-512 @ 9a8bd442), whose access-denied and sharing-violation arms would report a failed read as `DestinationNotWritable`.

The build figures (the impact read's question 4). The gate runs after `build_millis` is sampled (mod.rs:913), after `finished_at` (:920) and after the sidecar is written (:927-930). So none of the following includes the scan:
- the sidecar's fields;
- `PublishOutcome::build_millis` (:942);
- the CLI's `build ms` line (kernel/src/bin/publish-bundle.rs:667 @ 9a8bd442);
- the shell's `Success.build_millis` (frontends/shell/src-tauri/src/publish.rs:848 @ 9a8bd442), which no renderer uses (frontends/shell/src/publish/types.ts:78-83 @ 9a8bd442).

That follows from the placement: the sidecar must be on disk to be scanned. Their meaning is unchanged, so figures recorded before this piece stay comparable with figures after it. A harness's outer wall time of a publish includes the scan. No doc sentence about them is changed.

Findings held (the impact read's question 5). The gate holds one file's `scan` result at a time. A file whose findings are all `operator-declared` is dropped before the next file is read, and the walk stops at the first file holding another class. No count ceiling is declared for that result, and none is added, because `scan` is on §2.4's byte-identical list.

The bound is derived, and declared here in the units it bounds (ADR-010 rule 6, docs/adr/ADR-010-render-frames-origins-boundaries.md:70-72 @ 9a8bd442):
- `scan` makes at most one finding per pattern per byte position (redaction.rs:244-304).
- So a file of L bytes yields at most P × L findings. P counts the 19 needles (:146-166), the drive-letter rule, and the at most three usernames and two hostnames `from_environment` reads (:120-133), so P ≤ 25.
- Each finding carries its file name and an excerpt of at most 48 bytes around the match plus the match itself (:309-318). `from_utf8_lossy` can then replace an invalid byte with a three-byte character.
- L is bounded as §2.6 states.

Reaching that order needs data that repeats a pattern throughout one file; ordinary data with a path per row yields findings in proportion to its rows. The test helper `scan_directory` keeps reporting the whole bundle.

2.4 kernel/src/bundle/redaction.rs.
- One private walk, shared by `scan_directory` and the gate. It visits the same files in the same order as today's walk.
- `scan_directory`'s signature, return value and final sort are unchanged.
- One `pub(crate)` function for the gate, for example `first_undeclared_findings(root, machine, before_each_file)`; the shape of its error is the worker's. Its product caller is `run_inner`.
- One module-doc paragraph, W7.
- Byte-identical: `scan`, `CREDENTIAL_NEEDLES`, `MIN_PRINTABLE_RUN`, `ATTRIBUTABLE_CLASSES`, `OPERATOR_DECLARED`, `declared_ranges`, `in_printable_run`, `find_all_ascii_ci`, `finding`, `MachineIdentifiers` with `from_environment`, and the whole `mod tests` (:367-589).

2.5 What happens on a finding, end to end.
- `run_inner` returns the error. `publish_prepared`'s error arm removes the staging directory, or returns `StagingNotRemoved { after }` (mod.rs:638-653 @ 9a8bd442). A panic is covered by `Drop` (:1645-1668).
- `boundary::execute` writes the outcome record through `finish` (kernel/src/permission/boundary.rs:453, :482-506 @ 9a8bd442). The new arms:
  - `error_kind` gains `RedactionFinding` (:203-250);
  - `publish_outcome` classes it `Refused`, as the gate working (:280-310). Under `StagingNotRemoved` the outcome follows the inner error, as today (:283).
- The outcome record carries `error_kind` only, never a message (:482-497).
- The shell maps `BoundaryError::Publish(e)` to `ExecuteOutcome::Refused { message: e.refusal_detail() }` (frontends/shell/src-tauri/src/publish.rs:858-862 @ 9a8bd442). `formatPublishRefusal` reads any `publish.<snake_case>` prefix (frontends/shell/src/publish/formatPublishRefusal.ts:44 @ 9a8bd442), so the shell needs no change.
- The CLI returns the error from `boundary::execute` (kernel/src/bin/publish-bundle.rs:656 @ 9a8bd442), and `main` prints its `Display` (:166-171). `BoundaryError::Publish`'s `Display` is the inner error's (kernel/src/permission/boundary.rs:162 @ 9a8bd442).
- The class-3 act (the rename) never happens. ADR-006's class and `REVERSIBILITY_CLASS` are unchanged, and so is ADR-010 rule 7's recovery policy (mod.rs:60-64 @ 9a8bd442).

2.6 Cancellation and cost (ADR-018 vocabulary; the impact read's questions 1 to 3).

The gate adds sections to the `Finalizing` window, after the check at mod.rs:906 @ 9a8bd442 and before `finalize` (:934). `watch.check()` runs before each file, so the window between checks is one file's listing, read and scan.

Classified under ADR-018 §4 (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:78-88 @ 9a8bd442):
- (a) code-controlled cadence: one file between cancellation checks. It bounds work in files. In bytes it bounds work only as far as each file's own size is bounded (below). No new constant is declared.
- (b) unbounded external sections: each directory's `read_dir`, each entry's type check, and each file's `std::fs::read`. These are blocking filesystem calls this code cannot interrupt.
- The `scan` of one file's bytes: a code-controlled quantity of at most that file's bytes. Its per-byte cost is unmeasured and not claimed, on the precedent of Corrigendum 4's encode row (ADR-017:1087 @ 9a8bd442).

No section here is a time bound, and none is netted against another.

Where the term sits (question 2):
- Corrigendum 4's table decomposes §15's partition-write window (ADR-017:1076-1093 @ 9a8bd442).
- kernel/CANCELLATION-AND-TRACING.md §3's table (:87-95 @ 9a8bd442) covers the pre-first-batch and partition-write windows.
- The new sections are in the `Finalizing` window, which neither table lists. Neither table lists that window's existing sections either: the heuristic re-check (mod.rs:911), `total_bytes` (:916, :933) and the sidecar write (:927-930).
- Neither table is edited (OPEN-4 (A); the design note is not this piece's). The classification is recorded here and at the site (W4).
- After the last file's check, that file's read and scan, `total_bytes` and the rename run unchecked. A cancel arriving then lets the publish finish, which KNOWN-LIMITATIONS item 30 already states (KNOWN-LIMITATIONS.md:338-340 @ 9a8bd442).
- No new phase (OPEN-2 (A)) and no new trace span.

The bytes of one file (question 1):
- `data/part-NNNNN.arrows`:
  - A batch is cut before a row that would take its estimate past `PUBLISH_PARTITION_TARGET_BYTES` (1 MiB; engine/src/stream.rs:131, :2028 @ 9a8bd442). So a partition of more than one row is at most 1 MiB on the producer's estimate.
  - A single row larger than that is a partition of its own, refused above `MAX_BATCH_BYTES` (4 MiB; stream.rs:49, :2488-2505 @ 9a8bd442).
  - The file adds the Arrow IPC envelope, for which this form found no separate ceiling.
  - So the bound on one partition's scanned bytes is `MAX_BATCH_BYTES` on the estimate, not 1 MiB. mod.rs:1509's "≤ 1 MiB" holds for the multi-row case only.
  - The largest recorded partition is 880,712 B (kernel/RESULTS.md:1390 @ 9a8bd442).
- `viewer/<asset>`: at most `MAX_VIEWER_ASSET_BYTES` (16 MiB; kernel/src/publish/viewer_assets.rs:35 @ 9a8bd442). The largest recorded is `viewer/app.js`, 437,588 B (kernel/RESULTS.md:1327 @ 9a8bd442).
- `manifest.json`, `style.json`, `build-info.json`: this form found no byte ceiling of their own. The manifest lists every partition, so it grows with the partition count, which `MAX_PUBLISH_PARTITIONS` (100,000; stream.rs:174) bounds. Recorded: 16,020 B at 51 partitions (kernel/RESULTS.md:1391 @ 9a8bd442).

Cost (question 3):
- No duration is claimed for any bundle size (§1), and docs/08 has no publish-duration row (docs/08_Testing.md:5-9 @ 9a8bd442).
- The cost is stated in bytes. The gate reads every staged byte once more from disk, the same set `total_bytes` measures (mod.rs:933), and passes over each file once per pattern (at most 25, §2.3).
- Size reference points, cited for what they report:
  - the 100k fixture's bundle, 44,601,149 B in 56 files (kernel/RESULTS.md:1314, :1329 @ 9a8bd442);
  - the 5 GB source's publish of record, 5,737,397,728 B in 6,636 partitions (kernel/RESULTS.md:1731-1732 @ 9a8bd442). That figure is from the fifth section of 2026-08-07 (:1610), before ADR-025's acceptance.
- A whole-file publish of that source now refuses at preflight on `MAX_FEATURES` (KNOWN-LIMITATIONS.md:79-88 @ 9a8bd442). But `MAX_RESIDENT_BYTES` is checked at no stage, and `predicted_features` is `None` on the `DeclaredNotVerified` identity route (kernel/src/publish/ceilings.rs:107-119 @ 9a8bd442; KNOWN-LIMITATIONS.md:90-94 @ 9a8bd442). So a bundle above 512 MiB still publishes.
- The only hard bound on a bundle's partition bytes is `MAX_PUBLISH_PARTITIONS` partitions of one partition's bound each. The cost is stated against that largest publishable bundle, in bytes, and is not measured.
- The operator sees `finalizing` for the whole scan (OPEN-2 (A)). A refusal on a large dataset arrives only after every partition is written.

2.7 kernel/src/publish/error.rs.
- The variant `RedactionFinding { file: String, class: &'static str, byte_offset: usize, count: usize }`, with no excerpt (OPEN-1 (A)). Its doc is W3.
- `code()` arm: `"publish.redaction_finding"` (:247-278).
- `Display` arm: W1, a P6 placeholder, on the `GeometryEncodingNotPublishable` precedent (:400-406).
- kernel/src/permission/audit/reader.rs: `plain_reason` gains `"RedactionFinding"` with W2 (:226-284 @ 9a8bd442). Without it, `--audit-show` would print the kind as unrecognised (:282), against the exposure review's legibility condition (ADR-017:1123-1125 @ 9a8bd442).

2.8 Portability (state/directives/PORTABILITY-2026-09-30.md, R1 to R6).
- The owning boundary is publishing (kernel). No OS cfg is added.
- The byte classes behave the same on Windows, macOS and Linux.
- The identity classes depend on the environment:
  - Windows is supported (`USERNAME`, `COMPUTERNAME`);
  - macOS and Linux are explicitly reduced: `HOSTNAME` is often not exported to a child process, and the hostname is then not scanned (redaction.rs:115-116 @ 9a8bd442). This is reachable only through the CLI or the kernel there, because the shell is Windows-only.
- Kernel tests run on Windows and ubuntu in CI; the shell tests on Windows. No KNOWN-LIMITATIONS item is owed for this, since no shipped Linux or macOS product exists.

2.9 Seams (the human's rule of 2026-09-16, round 4).
- Kernel to shell: the consuming side's actual interface is `refusal_detail()` through `ExecuteOutcome::Refused` (publish.rs:858-862 @ 9a8bd442) and the prefix regex (formatPublishRefusal.ts:44 @ 9a8bd442). T1 is the end-to-end proof from the real shape: `prepare`, then `execute`, then `boundary::execute`, then `publish_prepared`.
- Kernel to the audit reader: the `error_kind` string. T5 reads the real record and T4 the reader.
- Engine fixture to the tests: test support behind `fixture`, on the precedent at engine/src/fixture.rs:194-195 @ 9a8bd442. It has no shipped caller, by that precedent.
- Caller rule: the gate function, the variant and the reader arm each have a product caller. Nothing new is `pub` outside `fixture`.

2.10 Words. W6 is the human's: approved as drafted (OPEN-3 (A)). W1 is a P6 placeholder for an app string. W2 to W5 and W7 are the architect's; the worker applies them and the PR body lists them. The clause checks are under "Words, checked" below.

## §3. Fixtures

- F1: engine/src/fixture.rs gains `pub fn write_zone_texts(path: &Path, zones: &[&str])`, behind `fixture`. It writes one Polygon feature per value: `id` UInt64 from 0, `geometry` WKB, unit squares in LV95, `zone` Utf8 holding the given values, and GeoParquet metadata as in `write_hostile_batch` (:1627-1680 @ 9a8bd442).
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
- `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` (frontends/shell/src-tauri/src/publish.rs:1856-1909 @ 9a8bd442);
- `granted_and_approved_publishes_and_records_a_success_with_the_manifest_hash` (kernel/tests/permission_boundary.rs:525 @ 9a8bd442);
- `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle` (kernel/tests/publish.rs:421-482 @ 9a8bd442);
- every redaction unit test (redaction.rs:385-588 @ 9a8bd442).

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
| kernel/README.md | 8 (owner's index: :360, :372, :373, :392; lead-data's update) |
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
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ 9a8bd442). lead-data writes it and the worker applies it:
  - kernel/README.md:360 (last verified), :372-373 (the publish and boundary rows gain T5) and :392 (declared limits gain W6's item number) @ 9a8bd442;
  - engine/README.md:530 and :546 @ 9a8bd442.
- **Overlap: rule (00)** (AUTONOMY.md:609 @ 9a8bd442). Separate KNOWN-LIMITATIONS items, walkthrough Parts and e2e README entries count as separate paths (state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ 9a8bd442).

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

  - **Governance D** (PR #237). Its paths, scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455 @ 9a8bd442:
    - `scripts/plan/rotate-plan-summaries.mjs` and its test;
    - `scripts/plan/verify-quotes.mjs` and its test (conditional);
    - `scripts/plan/README.md` and `AUTONOMY.md`;
    - at S10: PLAN.yaml, `CUSTODIAN-QUEUE.*`, `site/`, `state/cut-archive/` and `state/drafts/`.

    No path is shared. The only contact is PLAN.yaml, through the custodian's rows for this node. Under D's OPEN-5 (B) (:502 @ 9a8bd442), every commit touching PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` is held from D's S9 to its click. So this node's budget (§7) and status edits wait for D's click. This form's own commit touches none of them and may land before the click.
  - **PR #239** (walkthrough-current-view-rows-g1-n5). Its paths are listed at frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158 @ 9a8bd442: `MANUAL-WALKTHROUGH.md` Part G row G1 and Part N row N5, its form, PLAN.yaml and the generated files. Disjoint: this piece edits no walkthrough row.
  - **ADR-036's pre-acceptance block** (docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md). Its draft's files are listed at state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:329 @ 9a8bd442: ADR-036, the generated `docs/README.md`, its form and PLAN.yaml. Disjoint: this piece edits no ADR (OPEN-4 (A)) and nothing under `docs/`.
  - **Piece 1c.** Its drafted groups are at state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md:338-347, :354-363 and :370-379 @ 9a8bd442, and its overlap section at :414-423.
    - It shares kernel/README.md (its records group, :347). That is the same file, so 1c's step that edits it is dispatched after this piece's PR merges, as 1c's draft records (:423).
    - It shares KNOWN-LIMITATIONS.md as separate items.
    - It reads `kernel/src/permission/` without editing it (:421) and uses engine/src/fixture.rs without editing it (:422).
    - Its `protocol/` paths (:338) do not meet this piece, which touches none.
    - Its src-tauri edits are `commands.rs` and `lib.rs` (:97-98, :266), not `publish.rs`.
  - **Milestone 4** (state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md @ 9a8bd442).
    - It shares KNOWN-LIMITATIONS.md as separate items (:376).
    - It reads frontends/shell/src-tauri/src/publish.rs without editing it (:377).
    - It uses engine/src/fixture.rs, through a new generator in kernel/tests/manual_walkthrough_fixtures.rs (:343), without editing it (:378).
    - It declares `protocol/**`, `kernel/src/**`, `engine/**` and `src-tauri/**` not edited (:346).
    - Its node depends on this one (PLAN.yaml:2360 @ 9a8bd442, node `b1-shell-half`), so the two run in sequence.
    - Under its OPEN-4 (A′), now carried by ADR-036's block (state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10 @ 9a8bd442), a later recording piece touches `protocol/` (:386). This piece touches none.
  - **KNOWN-LIMITATIONS numbering.** 1c's items and milestone 4's each take the next free numbers. This piece merges first, so W6 takes the next free number and theirs follow it.
  - The custodian re-checks rule (00) at dispatch against both slots and every PR awaiting merge.

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
**The redaction gate (ADR-017 §13): every staged file, as it is on disk, before the rename.** It runs the same `redaction::scan` the format suite runs, with the same two declared strings: the viewer's copyright and its corresponding-source route. Cancellation is checked before each file, so the window between checks is one file's read and scan: not bounded in time, and in bytes only by that file's own size. A match that is not operator-declared refuses with `RedactionFinding`. A file or directory that cannot be read ends the publish with `PublishError::Io`, never a pass.
- Checked against kernel/tests/publish.rs:437-440 @ 9a8bd442 and against §2.3 and §2.6.

**W5 — the order doc, step 6 (mod.rs:58):**
`6. **Re-check the source with the fail-closed heuristic**, write the sidecar, **scan every staged file for the `docs/09` classes** (`bundle::redaction`; a match that is not operator-declared refuses), then rename.`
- Matches :911, :927-930, the gate, and :934, in that order.

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
- "the columns your style uses": the shell publishes `style_attributes` (frontends/shell/src-tauri/src/publish.rs:406, :532 @ 9a8bd442).
- "such as": the needle list (redaction.rs:146-166) and the drive rule (:258-277); not claimed to be exhaustive.
- The login-name and computer-name clause: re-classed only wholly inside a declared occurrence (:224-242), with the two declared strings (§2.3); names from the environment (:117-142).
- "wherever they appear": credentials are never re-classed (:70-85).
- "naming the file and the kind of match": W1.
- The 12-character limit and binary bytes: :42-47 and :179.
- Ordinary use can reach this: a styled text value containing `secret` refuses.

---

## OPEN items, ruled

All four were ruled (A) by the human on 2026-10-21, and W6 was approved as drafted: state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12 @ 9a8bd442. Each (A) is kept as drafted, its pin included. The other options and the recommendations are not carried; the draft keeps them at 54d07268.

**OPEN-1 — the refusal: its code, and what its text carries. Ruled (A).**
- (A) Code `publish.redaction_finding`, `error_kind` `RedactionFinding`, outcome `refused`. The text names the file, the first match's class and byte offset, and the count in that file, and never the matched text. No shell guidance entry, on the precedent of the geometry-encoding refusal (kernel/tests/typed_terminal_codes.rs:455-459 @ 54d07268).

**OPEN-2 — a progress phase for the scan. Ruled (A).**
- (A) None: the scan runs inside the existing `Finalizing` phase. No new string, and the phase sequences tests assert are unchanged.

**OPEN-3 — a KNOWN-LIMITATIONS item. Ruled (A); W6 approved as drafted.**
- (A) A new item, W6, approved by the human or replaced by the human's own words.

**OPEN-4 — ADR text. Ruled (A).**
- (A) No ADR text in this piece. ADR-017 §13 already states what the code now does. The new refusal and the new uninterruptible term (§2.6) are recorded in the code and this form. The custodian proposes a node for an ADR-017 note in the human's typed words, naming the product gate and Corrigendum 4's new term.

No SKP or wire change is needed. A publish refusal rides an existing string, and SKP-V0 says so (protocol/skp/SKP-V0.md:783-795 @ 9a8bd442).

---

## Files read, and the impact read's pointers (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:21 @ 9a8bd442)

Read at main 9a8bd442, a clean tree except two untracked files outside every path named here.

**Pointers used**, by the impact read's own section numbers:
- **§1.1:**
  - boundary.rs:313-455 and :423;
  - mod.rs:620-655, :1438-1460, :1612-1629, :933-934 and :1645-1668.
- **§1.2:**
  - every redaction.rs range;
  - the callers at log.rs:76, :249-255 and :256 (its correction to the draft).
- **§1.3:**
  - error.rs:247-278, :284-286 and :467;
  - boundary.rs:203-250, :280-310 and :482-506;
  - reader.rs:226-284;
  - shell publish.rs:858-866;
  - formatPublishRefusal.ts:44;
  - publish-bundle.rs:142-173;
  - SKP-V0.md:783-795;
  - the two typed_terminal_codes tests.
- **§2.1:**
  - stream.rs:49, :131, :171, :174 and :209;
  - viewer_assets.rs:35;
  - RESULTS.md:1327-1329 and :1388-1393;
  - RESULTS.md:1731-1732.
- **§2.2:**
  - ceilings.rs:107-119;
  - KNOWN-LIMITATIONS.md:79-94;
  - RESULTS.md:1610, :1724 and :2119-2134.
- **§2.3:** the scan's passes.
- **§2.4:**
  - mod.rs:905-906, :911-934 and :960-1004;
  - KNOWN-LIMITATIONS item 30;
  - ADR-018 §4;
  - ADR-017:1076-1093;
  - CANCELLATION-AND-TRACING.md §3.
- **§2.5:** docs/08_Testing.md:5-9.
- **§3:**
  - shell publish.rs:848;
  - types.ts:78-83;
  - publish-bundle.rs:658-668.
- **§4:** ADR-010:70-72.
- **§5:**
  - D's path list;
  - 1c's :347, :421-423, :97-98, :266 and :338;
  - milestone 4's :346, :376-378 and :386.
- **§6:** questions 1 to 5.

**Found wrong:** none among the pointers re-read here. The walkthrough piece's paths were cited from its draft, and its committed form now carries them, at frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158 @ 9a8bd442. That is superseded, not wrong at ab9a4b4f.

**Missing:**
- engine/src/stream.rs:2028 (the cut before append) and :2488-2505 (the `MAX_BATCH_BYTES` refusal on the estimate). Question 1 needs both.
- kernel/src/publish/error.rs:486-511 (`classify_io`'s arms) and mod.rs:1597-1601 (`total_bytes`'s own `Io`). The read-failure design needs both.
- kernel/src/permission/boundary.rs:162 (the CLI's `Display` path).
- frontends/shell/src-tauri/src/publish.rs:1337-1357 (`dataset_name_for`: a file's stem reaches the manifest's logical URI).
- scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:502 (D's OPEN-5 (B) hold on PLAN.yaml commits).
- AUTONOMY.md:609 (rule (00) itself) and the 2026-10-18 extension, :14.
- kernel/README.md:392 (declared limits) was in the impact read but missing from the draft's index update.

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

---

## What I could not settle

1. **O0's outcome.** Whether the shipped viewer's `app.js` or `NOTICE.txt` holds a needle, or the custodian's login name outside the two declared strings, is unknown until O0 runs. I did not read the third-party licence texts or the bundled library code. If O0 fires, every product publish would refuse; the piece then stops and the human rules.
2. **A file name reaches the manifest.** The shell names the dataset after the file's stem (frontends/shell/src-tauri/src/publish.rs:1337-1357 @ 9a8bd442), and that name is in the manifest's logical URI. So a file named after the login name, or containing a word like `secret`, refuses in ordinary use. W6 covers this under "every file it would contain is searched" without naming file names. W6 stays as the human approved it; this is for the human's sight.
3. **W6 and the first-file stop.** W6 says every file is searched. The gate stops at the first file with a match, so an operator meets one file per refusal and may meet another after fixing it. W6 stays as approved. W1 names one file, which matches.
4. **The design notes are not edited.** Corrigendum 4's table and CANCELLATION-AND-TRACING §3 do not list the `Finalizing` window (§2.6). When the custodian proposes the ADR-017 note node under OPEN-4 (A), they can decide whether that node also covers the design note.
5. **Duration** is unmeasured at any size, and the cost is stated in bytes only (§2.6).
6. **The CLI with a different route.** A CLI publish of the real viewer with a `--corresponding-source-url` other than the NOTICE's, or a `--license-by` naming the login name, refuses on a machine whose login name appears there. Widening the declared set would weaken the scan, so it is not offered.
7. **No test for a cancel during the scan** (M7 is a survivor), and none for a read failure (§2.3). Both would need a hook between files, which this piece does not add.
8. **An existing gap outside this piece.** `plain_reason` has no arm for `GeometryEncodingNotPublishable`, `ReaderCeilingExceeded` or `Cancelled` (reader.rs:226-284 @ 9a8bd442). This is the impact read's §1.3 finding; I propose no node.
9. **Timing for the custodian.** The budget (240) and status edits in PLAN.yaml wait for governance D's click. Rule (00) is re-checked at dispatch.
10. **Every pin is unhashed.** The custodian adds the hashes by script, with full commit ids.

Report path, for filing: C:/dev/spatial-ide/state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form.md
