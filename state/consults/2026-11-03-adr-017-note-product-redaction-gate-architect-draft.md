*Custodian's filing note (2026-11-03): the architect's draft for the docs lane's `adr-017-note-product-redaction-gate`, read only at main ca8e44f1, the run 12:22:34Z to 12:32:28Z by its transcript (Read 42, Grep 28, Glob 5; every path inside the repository; no shell, so no background shell). Extracted by script from its SubagentHandback call, with one final newline added (the hand-back's sha256 so, 0b0d8686f23754f7677dedf2a0b56f6e8bbe360acaca6c87ab778a00d3f113e8). One disclosed rewrite: section 1's row 1.1 cites `kernel/publish/viewer_assets.rs`, which names no file (the file is `kernel/src/publish/viewer_assets.rs`, as its other cites in section 1 resolve); that one cite is de-rooted to the file name, as row 3.1 writes it, because verify-cites reads a rooted cite at its pin and would fail it on main. Nothing else is changed. Its sha256 from line 5 to the end is e086a4dac51fbeba2d13039107c4bdbb7d94291598a0defe5d80a9311105930e.*

---

Drafted: adr-017-note-product-redaction-gate, full form, architect
34 clauses checked; 7 for the human (1.1, 1.4, 2.2, 3.2, 3.4, 4.4, 4.5).
Read at: main @ ca8e44f14d08752849c4da6222c7579eae07e4f1, read only. Every cite below is `path:line @ ca8e44f1`. I have no shell, so I give no sha256 here; the custodian's script pins each cite before the form is committed. I left no background shell, and no wait loop ran.

**Conventions.** The words are the human's and a red line (AI_DEVELOPMENT.md:451-454 @ ca8e44f1). I do not reword them and I give no replacement words: AUTONOMY.md:544 @ ca8e44f1 keeps red-line texts out of §31's route. Each clause label below is my own paraphrase, not a quotation. A clause is found by its item number and its position in the item, read at state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:29-37 @ ca8e44f1. "Mine" marks my own reading.

## 1. The clause check

| # | Clause (label mine) | At main | Code span | Pinning test |
|---|---|---|---|---|
| H.1 | heading: the product publish runs §13's scan | true, with item 3's exception | kernel/src/publish/mod.rs:953-970 @ ca8e44f1 | T5, T1 (below) |
| H.2 | heading: the node named in brackets | true: that node is done, PR 241 | governance/PLAN.yaml:5707-5723 @ ca8e44f1 | — |
| I.1 | italic line: appended under the human's ruling | true | the directive's :27 (item G) @ ca8e44f1 | — |
| I.2 | italic line: the text above is unchanged, the Status block and Corrigendum 4 included | holds at H only if the diff is a pure append | — | E2 at H |
| **1.1** | **§13's guarantee is now asserted by the product** | **for the human** (below) | mod.rs:957 @ ca8e44f1; viewer_assets.rs:160-172 @ ca8e44f1; renderer/bundle-viewer/scripts/scan-dist.rs:20 @ ca8e44f1; renderer/bundle-viewer/redaction-reviewed.json:4-5 @ ca8e44f1 | — |
| 1.2 | every publish through `boundary::execute`, the shell's and the CLI's | true | kernel/src/permission/boundary.rs:426 @ ca8e44f1 → mod.rs:624-659, :684, :953 @ ca8e44f1; frontends/shell/src-tauri/src/publish.rs:832 @ ca8e44f1; kernel/src/bin/publish-bundle.rs:669 @ ca8e44f1 | T5 `the_boundary_refuses_a_bundle_whose_data_holds_a_path_before_the_rename_and_audits_it_as_refused` (kernel/tests/permission_boundary.rs:1122 @ ca8e44f1); T1 `a_publish_whose_styled_column_holds_a_path_is_refused_by_the_redaction_scan_and_nothing_reaches_the_destination` (frontends/shell/src-tauri/src/publish.rs:3218 @ ca8e44f1) |
| 1.3 | and every `publish_unguarded` call | true: it is the same path | mod.rs:611-618 @ ca8e44f1 | none directly; the path is shared |
| **1.4** | **scan over every staged file** | **for the human** (below) | kernel/src/bundle/redaction.rs:405-407 @ ca8e44f1 | — |
| 1.5 | each file as it lies on disk | true | redaction.rs:404 @ ca8e44f1 (`std::fs::read` of the staged path) | — |
| 1.6 | after the last file is written, before the rename | true | mod.rs:931-934 (the sidecar, the last write), :953, :974 (`finalize`) @ ca8e44f1 | T5's `no_side_effect`; T1 |
| 1.7 | the format suite's two declared strings: the copyright and the corresponding-source `at` | true | mod.rs:946-952 @ ca8e44f1 against kernel/tests/publish.rs:436-440 @ ca8e44f1 | — |
| 2.1 | an undeclared match refuses as `publish.redaction_finding` | true | mod.rs:964-969, kernel/src/publish/error.rs:283 @ ca8e44f1. Mine: the CLI prints only the `Display`, without the code (publish-bundle.rs:182 @ ca8e44f1); the shell carries the code (publish.rs:860-862 @ ca8e44f1) | T3 `a_redaction_refusal_detail_begins_with_its_typed_code` (kernel/tests/typed_terminal_codes.rs:495 @ ca8e44f1); T1 |
| **2.2** | **audited as `refused` with `error_kind` `RedactionFinding`** | **for the human** (below) | boundary.rs:240, :244, :284, :303, :485-500 @ ca8e44f1 | T5, T1 (ordinary path only) |
| 2.3 | names the bundle-relative path | true | redaction.rs:399-403; error.rs:422-427 @ ca8e44f1 | T3, T5 |
| 2.4 | the first match's class and offset | true: the lowest-offset undeclared match | redaction.rs:367-369; mod.rs:966-967 @ ca8e44f1 | T3 (the text), T5 (the class) |
| 2.5 | the count of matches in that file | true, read with the item's antecedent: the count of undeclared matches. Mine: operator-declared matches in the same file are not counted, and the `Display` says so | redaction.rs:367; mod.rs:968 @ ca8e44f1 | T5 (count ≥ 1) |
| 2.6 | never the matched text | true: the variant has no excerpt, and the audit record carries `error_kind` only | error.rs:186-197, :422-427; boundary.rs:486-500 @ ca8e44f1 | T3 (exact `Display`) |
| 2.7 | no bundle under the destination name | true: the gate returns before `finalize` | mod.rs:964 vs :974 @ ca8e44f1 | T1 (destination absent), T5 |
| 2.8 | staging removed, or reported by `StagingNotRemoved` | true | mod.rs:642-657 @ ca8e44f1 | T1 (`staging_entries` 0) |
| 3.1 | a viewer file is skipped only when its sha256 equals the build record's entry for it | true | viewer_assets.rs:160-172; redaction.rs:405; mod.rs:957; publish.rs:1394, :1399, :1406-1437 @ ca8e44f1 | U1 `only_a_viewer_file_whose_bytes_hash_to_its_own_build_record_entry_is_skipped` (viewer_assets.rs:339 @ ca8e44f1); T6 (permission_boundary.rs:1161 @ ca8e44f1); T8 (publish.rs:3257 @ ca8e44f1) |
| **3.2** | **the file named `scripts/scan-dist.mjs` writes it** | **for the human** (below) | — | — |
| 3.3 | written only after the scan passed | true: the old record is removed first, and the script exits before writing on any unreviewed finding | renderer/bundle-viewer/scripts/scan-dist.mjs:78, :88-91, :92-96 @ ca8e44f1 | V1 (renderer/bundle-viewer/scripts/scan-dist.test.mjs:37 @ ca8e44f1) |
| **3.4** | **"the same scan"** | **for the human** (below) | scan-dist.rs:12-13, :20-21 @ ca8e44f1 vs mod.rs:946-952 @ ca8e44f1 | — |
| 3.5 | over the built viewer, against the reviewed rows by file, class and offset | true | scan-dist.mjs:33-39, :76, :81, :86-87 @ ca8e44f1 | scan-dist.test.mjs:57 @ ca8e44f1 |
| 3.6 | a viewer file with no matching entry is scanned | true | viewer_assets.rs:164-172 → redaction.rs:408 @ ca8e44f1 | U1, T6 (second half) |
| 4.1 | table row: the scan of one file is code-controlled, at most that file's bytes | true | redaction.rs:404-408 @ ca8e44f1 | — |
| 4.2 | cancellation is checked before each file | true | redaction.rs:398; mod.rs:956 @ ca8e44f1 | **none**: the redaction form declared M7 a predicted survivor (governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:234 @ ca8e44f1) |
| 4.3 | per-byte cost unmeasured and not claimed | true: no measurement exists | that form's §1 :60 @ ca8e44f1 | — |
| **4.4** | **the window's sentence: the four terms joined by "or"** | **for the human** (below) | mod.rs:910, :915, :920, :931-934, :973-974; redaction.rs:387 @ ca8e44f1 | — |
| **4.5** | **"bounded in bytes exactly" carried onto the new term** | **for the human** (below) | mod.rs:942-944, :1586-1588 @ ca8e44f1; the form's :293-296 @ ca8e44f1 | — |
| 5.1 | `bundle_version` stays 1 | true | kernel/src/bundle/mod.rs:53 @ ca8e44f1 | — |
| 5.2 | nothing in the format changes | true: the gate writes nothing | mod.rs:936-970 @ ca8e44f1 | — |
| 5.3 | item 47 records what the operator sees | true | KNOWN-LIMITATIONS.md:420 @ ca8e44f1 | — |
| 5.4 | item 47 records what the scan cannot see | true. Mine: it gives examples and does not claim to be exhaustive | KNOWN-LIMITATIONS.md:413, :418, :420 @ ca8e44f1 | — |

### For the human, each with its span (none reworded)

- **1.1.** The product's check is narrower than §13 (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:500-504 @ ca8e44f1) in three ways:
  - Recorded viewer files are never scanned at publish (viewer_assets.rs:160-172 @ ca8e44f1).
  - The build's scan of those files has no identity classes (scan-dist.rs:20 @ ca8e44f1).
  - Two reviewed matches, of the `credential` and `local-filesystem-path` classes, are allowed in `NOTICE.txt` and so ship in every bundle the shell publishes (redaction-reviewed.json:4-5 @ ca8e44f1; the redaction form's Amendment 8 item 1). The redaction form itself may not claim that a skipped viewer file was checked for any login or computer name (its :648 @ ca8e44f1).

  This is a guarantee claim, so it is Correctness.
- **1.4.** Every staged file is scanned except under item 3's skip (redaction.rs:405-407 @ ca8e44f1). In ordinary shell use this applies to every publish. Item 1 itself does not point to item 3. Mine: the note as a whole states the exception in item 3, but item 1 read alone is untrue.
- **2.2.** When the staging directory cannot be removed, the refusal's code is `publish.staging_not_removed` (error.rs:287 @ ca8e44f1) and `error_kind` is `StagingNotRemoved` (boundary.rs:244 @ ca8e44f1). The outcome stays `refused` (boundary.rs:284 @ ca8e44f1). Ordinary use can reach this, for example when another process holds a staged file open. Mine: item 2's last sentence can be read as covering it, so "accepted as it stands" is defensible.
- **3.2.** No file `scripts/scan-dist.mjs` exists at the repository root. The tracked file is `renderer/bundle-viewer/scripts/scan-dist.mjs`. The words name all three viewer files relative to the viewer directory, as the shell's own doc comment does (publish.rs:1398 @ ca8e44f1). ADR-017 itself names paths from the root (ADR-017:17-18 and :797 @ ca8e44f1).
- **3.4.** The build runs the same `scan_directory` from the same source file, but with `MachineIdentifiers::default()`: no usernames, no hostnames, no declared strings (scan-dist.rs:20 @ ca8e44f1). The publish runs with the environment's identities and the two declared strings (mod.rs:946-952 @ ca8e44f1). So the build's scan cannot find the `username` or `machine-identifier` classes. KNOWN-LIMITATIONS.md:418 @ ca8e44f1 states this for the operator; item 3 does not.
- **4.4.** With "or", the sentence says the uninterruptible window is any one of four terms. Two stretches run more than one unchecked section in sequence:
  - From the `Finalizing` check (mod.rs:910 @ ca8e44f1) to the gate's first per-file check: the heuristic re-check (:915), `total_bytes` (:920), the sidecar's `File::create`, `write_all` and `sync_all` (:931-934, through :1580, :1586-1588 and :1615), and the root `read_dir` (redaction.rs:387 @ ca8e44f1).
  - After the last file's check: its read and scan, then `total_bytes` (:973) and the rename (:974), with no check between them.

  A skipped viewer file's term is a read and a hash, not a scan. These sections are not new; the redaction form recorded them as unlisted (its :151 and :153 @ ca8e44f1), and the PLAN node's summary puts that question to the human (governance/PLAN.yaml:6045 @ ca8e44f1). Mine: Corrigendum 4's accepted sentence (ADR-017:1089-1090 @ ca8e44f1) joins its three terms with "and"; the "or" changes what they mean.
- **4.5.** This is an untrue claim of a limit, so it is Correctness. Nothing declares a byte ceiling for one file's read and scan:
  - `manifest.json`, `style.json` and `build-info.json` have no declared constant;
  - a partition is bounded only on the producer's estimate (`MAX_BATCH_BYTES`);
  - viewer assets are bounded by `MAX_VIEWER_ASSET_BYTES`.

  The redaction form records all three (its :293-296 and :156-164 @ ca8e44f1). The site's own comment says the window is bounded in bytes only by that file's own size (mod.rs:942-944 @ ca8e44f1). The "in time not at all" half is true.

## 2. Where the words land

- **ADR-017's end now:** the last section begins at ADR-017:1144 @ ca8e44f1, and the file ends with its bullet at :1157-1160 @ ca8e44f1 (line 1160 is its continuation). I cannot see whether :1160 ends with a line feed; E3 checks it at B.
- **The bytes appended, after :1160's line feed:** one line feed (the blank separator; mechanics, not words), then the directive's lines 29 to 37 inclusive, each with its own line feed, copied by script from state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:29-37 @ ca8e44f1. That span is:
  - the heading at :29;
  - the blank at :30;
  - the italic line at :31;
  - the blank at :32;
  - items 1 to 5 at :33-37.

  Nothing else: no rewrap (OPEN-3), no pin, no comment. That is 10 inserted lines and 0 deleted.
- **I reproduce none of the words here.** No script of mine byte-copied them.
- **The Edit:** its `old_string` is ADR-017's last line at B with its final line feed, the shape Guardian G3 allows (the precedent is governance/forms/root/ADR-020-APPENDED-NOTE-PREREGISTRATION.md:132 @ ca8e44f1).
- **Status lines:** no line of the span begins with `Status:` or `**Status:**`, the shape `adrIndex.mjs` counts (frontends/shell/scripts/adrIndex.mjs:66 and :154 @ ca8e44f1).

## 3. What follows the note

- **`docs/README.md`:** nothing. Its row (:55 @ ca8e44f1) is generated from the Status line alone (adrIndex.mjs:11-18 @ ca8e44f1), and the Status line does not change.
- **`docs/02_Architecture.md:80` @ ca8e44f1:** it lists Corrigenda 1 to 3 only, and omits Corrigendum 4 and every later appended section. Nothing in this piece (OPEN-4).
- **KNOWN-LIMITATIONS item 47 (:413-420 @ ca8e44f1):** nothing owed. The note points to it, and its words (W6′) are already the human's. The port-2 branch also edits this file.
- **The verify-quotes baseline:** nothing predicted. The note marks no passage as verbatim (E5 checks it).
- **The redaction form:** nothing owed. Its node is done (PLAN.yaml:5707-5723 @ ca8e44f1), and the record cap applies (OPEN-6).
- **`kernel/CANCELLATION-AND-TRACING.md` §3:** not covered by the human's words (OPEN-5). Its §9 (:262-264 @ ca8e44f1) needs no change.

## 4. The form, whole

```text
# ADR-017's appended note in the human's typed words: the product publish runs §13's scan (PLAN node adr-017-note-product-redaction-gate). Preregistration (full form)

File: governance/forms/root/ADR-017-NOTE-PRODUCT-REDACTION-GATE-PREREGISTRATION.md, committed on main by the custodian before the PR.

**Authority.**
- The node: governance/PLAN.yaml:6030-6046 @ ca8e44f1 (title and summary whole; depends_on bundle-redaction-scan-not-in-product-publish, done, PR 241: governance/PLAN.yaml:5707-5723 @ ca8e44f1).
- The ruling and the words: state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:27 @ ca8e44f1 (item G) and :29-37 @ ca8e44f1 (the words).
- The rulings that owe it:
  - state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12 @ ca8e44f1 (OPEN-4 (A); the form's text at governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:465-466 @ ca8e44f1);
  - state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:8 @ ca8e44f1 (OPEN-7).
- The order: state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:16 @ ca8e44f1 (item 5); a piece held on a red line leaves its slot, :14 @ ca8e44f1 (item 4).
- Red line: governance/AI_DEVELOPMENT.md:451-454 @ ca8e44f1 (ADR statuses and amendments). ADR notes are named at the 2026-10-31 directive :14 @ ca8e44f1. §31's replacement route does not apply (governance/AUTONOMY.md:544 @ ca8e44f1).
- Verdicts: proportional (state/directives/2026-10-05-product-first-direction.md, section 2). A clause's truth is Correctness.
- Reuse index (the standing step), byte for byte as the custodian's brief carried it. Both queries miss; the miss is noted and does not block. The prior art in the tree is ADR-017's own appended sections and the ADR-020 note form.
  $ node tools/reuse.mjs redaction scan publish refuse   (exit 1)
  No prior art recorded for "redaction scan publish refuse". Research it before planning an implementation.
  $ node tools/reuse.mjs adr note appended   (exit 1)
  No prior art recorded for "adr note appended". Research it before planning an implementation.

**Drafted by** the architect, read only, at main ca8e44f14d08752849c4da6222c7579eae07e4f1 (C). The note's words are the human's; every other word of this form is the architect's.
**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
**Gating: full form, both gates from dispatch** (§21a, governance/AUTONOMY.md:315-332 @ ca8e44f1; §25 (e), governance/AUTONOMY.md:482 @ ca8e44f1).
- The piece touches an ADR (governance/AUTONOMY.md:319-320 @ ca8e44f1).
- It restates a cancellation window in ADR-018's vocabulary and a stated guarantee (governance/AUTONOMY.md:325-327 @ ca8e44f1), as text, with no code.
- So the Out-of-scope line could not assert that the piece touches none of the four, and no five-line form is committed.
- The piece is under §21c by size (governance/AUTONOMY.md:347-357 @ ca8e44f1).
- Out-of-scope, the four categories: ADR, touched (ADR-017, appended only, its Status line unchanged); security posture, not touched (no ADR-020, ADR-009 or ADR-021 text); data plane and wire, not touched; stated guarantee, touched as documentation only.

## §0. Disclosure
- Inputs read at C: the node; the three rulings above; ADR-017 whole; the redaction form whole with its amendments; KNOWN-LIMITATIONS item 47; and the code and tests each clause names (§2.2).
- No fixture, no run, no measurement.

## §1. May and may not claim
- May claim: ADR-017 at B is a byte prefix of ADR-017 at H; the bytes appended are one line feed plus the directive's :29-37, byte for byte; each clause holds as §2.2 and the human's recorded answers state.
- May not claim:
  - any change to ADR-017's decision, its Status, §13, §15 or Corrigendum 4's own text;
  - any code change, test or measurement;
  - that a clause listed for the human is true before the human's answer is recorded.

## §2. The change
2.0 Rules.
- (a) A single append at ADR-017's end; nothing above is edited.
- (b) The appended text is exactly the human's lines, unwrapped (OPEN-3 (A)), with no pin, no comment and no added word.
- (c) No line of it begins with `Status:` or `**Status:**`.
- (d) If ADR-017 at B does not end in a line feed, or holds a CR byte, the worker stops (§5).
2.1 The bytes: one line feed, then state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md lines 29 to 37, each with its line feed, copied by script at B. One Edit whose old_string is ADR-017's last line at B with its final line feed.
2.2 The clause check: the architect draft's section 1 (state/consults/2026-11-03-adr-017-note-product-redaction-gate-architect-draft.md), carried here by the custodian byte for byte, pins expanded by script. Its seven clauses for the human (1.1, 1.4, 2.2, 3.2, 3.4, 4.4, 4.5) wait on OPEN-1.
2.3 Overlap, rule (00): this piece's paths, each set against the branches in flight at C (by `git diff --name-only origin/main...<branch>`):
- P1 docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, append only.
- P2 this form, the custodian's, on main.
- P3 governance/PLAN.yaml with the generated CUSTODIAN-QUEUE.* and site/, the custodian's, on main.
- Against cut/b2-piece-1c-save-and-reopen (ADR-022, ADR-036, kernel/*, renderer/src/canonical.rs, spikes/*): disjoint. Contact: clause 3.1 reads `canonical::sha256_hex`, which that branch edits; the gate re-derives the clause at B.
- Against cut/port-2-macos-l1-and-app-dirs (KNOWN-LIMITATIONS.md, kernel/PERMISSION-BOUNDARY.md, kernel/src/permission/audit/log.rs, engine/*, CI, scripts/plan/cfg-boundary*): disjoint; this piece edits no KNOWN-LIMITATIONS item. Contact: clause 2.2's audit path runs through audit/log.rs; re-derived at B.
- Against cut/b1-shell-half-pr-c (none): disjoint.
- Against cut/adr-020-appended-note, #271 (ADR-020, verify-quotes.baseline.json): disjoint; this piece predicts no baseline edit.
- Against cut/verify-quotes-cite-listing-line-count (verify-quotes.mjs and its test): disjoint. Contact: E5 names the tool's commit at B.
- Against cut/stream-cancel-returns-left-unmarked (engine/src/stream.rs, engine/README.md): disjoint. Contact: clause 4.5's partition bound is read in stream.rs.
- Nothing under protocol/; no lockfile or wire fixture changes. The custodian re-checks rule (00) at dispatch.
2.4 Portability: no OS-dependent feature; R3 does not apply.

## §3. Fixtures
None.

## §4. Tests and evidence
- No test is added, renamed or changed, and no mutation is owed: the piece changes a document only. No record of this piece calls any run, a verify-mutation run included, an observation of a mutation.
- Evidence at H, each by script with its exit code checked; each tool claim names the tool's commit (round 15 (c)):
  - E1: `git diff --numstat B...H -- docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md` gives insertions 10, deletions 0.
  - E2: ADR-017 at B is a byte prefix of ADR-017 at H, by node Buffer compare.
  - E3: ADR-017 at B and at H has no CR byte, and each ends in a line feed, by node.
  - E4: H's bytes after B's length equal a line feed followed by the directive's lines 29 to 37, each with its line feed, read at B by node.
  - E5: `node scripts/plan/verify-quotes.mjs` exits 0, with checked, verified, baselined and advisory counts equal to B's. Any passage it extracts from the note is a stop (class 2).
  - E6: `node scripts/plan/verify-cites.mjs` exits 0.
  - E7: `node scripts/plan/verify-test-claims.mjs` and `node scripts/plan/verify.mjs` exit 0.
  - E8: `npm run verify:adr-index` in frontends/shell exits 0, and docs/README.md:55 @ ca8e44f1's row is unchanged.
  - E9: `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` report current.
  - E10: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` exits 0.
  - E11: PR CI is green.

## §5. Predictions, declared unchanged, invalidators, falsification
- Predicted: E1 to E11 hold. The gate at H finds the same seven clauses for the human as §2.2, and no other.
- Declared unchanged: every byte of ADR-017 at B; docs/README.md; docs/02_Architecture.md; KNOWN-LIMITATIONS.md; kernel/CANCELLATION-AND-TRACING.md; the redaction form; every code and test file.
- Invalidators (stop and report): E3 fails at B; the directive's lines 29 to 37 at B differ from C; the gate at H finds a clause untrue that §2.2 does not list; any in-flight piece edits ADR-017.
- Falsified if: ADR-017 at B is not a prefix of H, or the appended bytes differ from the directive's.

## §6. Instruments
Assertions by script only. There is no measurement and no operator step.

## §7. Declared values and ceilings
- P1: at most 10 insertions and 0 deletions, by `git diff --numstat B...H`.
- One non-generated file in the PR. The form and PLAN.yaml are the custodian's, on main.
- Budget: 45 minutes. Past twice the budget, the node stops.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight
1. Any byte of ADR-017 at B changed, the Status block and Corrigendum 4 included.
2. Appended text other than the line feed and lines 29 to 37, byte for byte: a rewrap, an added word, a pin or a comment.
3. The merge before every clause §2.2 lists for the human has the human's typed answer, recorded as a class 5 amendment.
4. A path outside §2.3; anything under protocol/; docs/02, KNOWN-LIMITATIONS.md, CANCELLATION-AND-TRACING.md or any ADR other than ADR-017 edited.
5. A line beginning `Status:` or `**Status:**`.
6. A line cite into DECISIONS-PENDING.md, a bare self-line, or a hash pinned at a branch commit.
7. A tool claim without the tool's commit.
8. The round-25 items, by name: a §7 overrun not recorded as class 8, or §7 edited to match; a scope addition not recorded as class 9, or its code before its amendment; a verify-mutation run called a mutation's observation; a test-text span on an unmerged branch pinned by hash or named without its commit id.

## §9. Gates
- Architect and reviewer, both from dispatch.
  - The architect re-runs §2.2 clause by clause at H against B's code, re-deriving each span by symbol; reads each recorded answer of the human against its clause; checks §8 item by item.
  - The reviewer checks the diff, recomputes every pin, and runs E1 to E11.
- Verdicts are proportional:
  - A clause found untrue is Correctness. It goes back to the human with its code span, and the gate does not substitute words.
  - A clause the human accepts as it stands is recorded as a class 5 amendment and is then no longer a blocking finding.
  - The human's own words for a clause are checked once, those words only; a failure goes back to the human.
- Operator: none. No walkthrough row and no KNOWN-LIMITATIONS item.
- The merge is the human's click, by merge commit.

## §10. Amendments
Opens empty, append-only, classes 1 to 9. The human's answers to OPEN-1 are class 5, before merge.

## §11. OPEN items
| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | the seven clauses in §2.2 | none: the human's answer | yes |
| OPEN-2 | when to dispatch | (A) | no |
| OPEN-3 | line wrap | (A) | (B) would be |
| OPEN-4 | docs/02:80 | (a) | (b) would be |
| OPEN-5 | CANCELLATION-AND-TRACING §3 | (a) | (b) would be |
| OPEN-6 | the redaction form's closing row | (a) | no |
```

## 5. OPEN items, with options and my recommendation

- **OPEN-1, the seven clauses (red line; the human's typed answer, which waits for the human's return on 2026-11-04).** For each of 1.1, 1.4, 2.2, 3.2, 3.4, 4.4 and 4.5, the human answers in one of two ways:
  - (i) accepted as typed, and the gap is recorded on the form;
  - (ii) the human's own words, which the gate checks once.

  I make no recommendation on the words. Mine, on whether "accepted as typed" can be defended: for 2.2 and 3.2, yes, as readings within the item. For 1.4, only if item 3 is read as qualifying it. For 1.1, 3.4, 4.4 and 4.5, no: each states a guarantee or a limit the code does not support.
- **OPEN-2, when to dispatch.**
  - (A) Dispatch now. The worker appends the words as typed, both gates run at H, and the gate's clause list goes to the human. The merge waits for the human's answers. This follows item G's own sequence (the directive's :27 @ ca8e44f1).
  - (B) Hold dispatch until the human has answered this draft's list.

  **Recommended: (A).** It is not a red line, so it is taken under the 2026-10-31 direction, item 4, with today's date. I recommend that the custodian also puts the seven-clause list to the human in the closing message, so the answer can arrive on 2026-11-04.
- **OPEN-3, line wrap.**
  - (A) The human's lines unwrapped, byte for byte, which E4 can check mechanically.
  - (B) Rewrapped at 100 columns. That changes the human's bytes, so it is a red line.

  **Recommended: (A).** Taken.
- **OPEN-4, docs/02_Architecture.md:80 @ ca8e44f1.**
  - (a) Not in this piece.
  - (b) Add this note to that list. That is a scope change to a ruled item, so it is a red line.
  - (c) A separate docs-lane node, proposed by the custodian, to bring that entry current with every appended section.

  **Recommended: (a), with (c) as a proposal for the human to place.** Taken as (a).
- **OPEN-5, `kernel/CANCELLATION-AND-TRACING.md` §3 and the Finalizing window (the PLAN summary's question).**
  - (a) Not in this piece: the human's words do not cover it.
  - (b) In this piece. That is a scope change to a ruled item, so it is a red line.

  **Recommended: (a).** Taken. Mine: clause 4.4 sits on the same unlisted window, so the human may want both answered together.
- **OPEN-6, the redaction form.**
  - (a) No row: its node is done, and the record cap applies.
  - (b) A class 1 row naming this PR after the merge.

  **Recommended: (a).** Taken.

## 6. What I could not settle

- No sha256 and no byte checks: I have no shell. ADR-017's final line feed, any CR bytes, and the exact bytes of directive :29-37 are E3 and E4 at B.
- Whether verify-quotes extracts any passage from the note, under the trigger set at the tool's commit at B: that is E5. #271 and VQ are both in flight against that tool and its baseline.
- 4.2 has no pinning test. I did not read whether the redaction PR recorded M7's observed outcome.
- Code under two in-flight branches backs two clauses: renderer/src/canonical.rs (1c; clause 3.1) and kernel/src/permission/audit/log.rs (port-2; clause 2.2). The gate re-derives both at B.
- I did not read `kernel/CANCELLATION-AND-TRACING.md` §3 itself, only the PLAN summary's description of it (governance/PLAN.yaml:6045 @ ca8e44f1).
- The node's PLAN fields (`gate: none`, `budget_minutes: 0`) are the custodian's to set: the gate to this form's path and the budget to 45.

Files I relied on: C:/dev/spatial-ide/state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md, C:/dev/spatial-ide/docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, C:/dev/spatial-ide/governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md, C:/dev/spatial-ide/kernel/src/publish/mod.rs, C:/dev/spatial-ide/kernel/src/bundle/redaction.rs, C:/dev/spatial-ide/kernel/src/publish/viewer_assets.rs, C:/dev/spatial-ide/kernel/src/permission/boundary.rs, C:/dev/spatial-ide/kernel/src/publish/error.rs, C:/dev/spatial-ide/renderer/bundle-viewer/scripts/scan-dist.mjs, C:/dev/spatial-ide/renderer/bundle-viewer/scripts/scan-dist.rs, C:/dev/spatial-ide/frontends/shell/src-tauri/src/publish.rs, C:/dev/spatial-ide/KNOWN-LIMITATIONS.md.
