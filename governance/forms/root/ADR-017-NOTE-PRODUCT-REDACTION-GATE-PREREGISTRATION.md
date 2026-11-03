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

## OPEN items, with options and the architect's recommendation (the draft's section 5)

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

## The custodian's settlement (class 1, before any code)

- **The draft** is filed at `state/consults/2026-11-03-adr-017-note-product-redaction-gate-architect-draft.md` (its sha256 from line 5 to the end is e086a4dac51fbeba2d13039107c4bdbb7d94291598a0defe5d80a9311105930e). It is filed with one disclosed rewrite: the de-root of a cite whose path names no file, as its filing note says.
- **This form** is the draft's section 4, byte for byte, with three additions: the draft's section 1, from its table to the end of its list for the human, after §2.2's line (sha256 2a3ab5ef2b955a38c9ca005b2c44ffd6a24d64987f12d51ad8156584c07077fa); the draft's section 5 below its heading, in the section before this one (sha256 2e93200c02c8743c6f334c6c2f292fc0efff4b5174df718531e051092033d4d4); and this settlement. Both carried parts are byte-identical to the filed draft. §2.2's line says the pins are expanded by script. They are not expanded in place, so that the carried text stays byte-identical to the draft. Instead, the pin table below binds every line cite in this form to its file, its lines, the full commit and the sha256 of those lines. A pathless cite is bound by the reason its row gives. This is the cheapest reversible way, taken under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`).
- **OPEN-1** (clauses 1.1, 1.4, 2.2, 3.2, 3.4, 4.4 and 4.5) is a red line. It waits for the human's typed answer for each clause, (i) or (ii), recorded as a class 5 amendment before the merge (§8 item 3, §10).
- **OPEN-2 (A), OPEN-3 (A), OPEN-4 (a), OPEN-5 (a) and OPEN-6 (a)** are taken as the architect recommends, under the human's direction of 2026-10-31, item 4, on 2026-11-03. The human reviews each on return and may reverse it. OPEN-4 (c) is a separate docs-lane node bringing docs/02's ADR-017 entry current with every appended section; it is put to the human as a proposal and not placed.
- **ADR-017 at C**, by script: 1159 lines, ending in a line feed, with no CR byte; it is unchanged at main 811a2f5c. Its last section begins at line 1144, and its last bullet is lines 1157 to 1159. The draft's section 2 says 1157 to 1160, but line 1160 does not exist. Its last line occurs once in the file, so it can be §2.1's old_string with its line feed.
- **The words:** the directive's lines 29 to 37 read the same at C and at main 811a2f5c, by script.
- **Rule (00)**, by script at main 811a2f5c: no open PR (#275, #271) and no branch in flight touches ADR-017 or this form.
- **The checkout:** 140 of the 142 pinned ranges read the same at main 811a2f5c as at C (the others: governance/PLAN.yaml:6030-6046, governance/PLAN.yaml:6045-6045).
- **PLAN:** the node's gate is this form, and its budget is 45 minutes (§7).
- **Gating:** both gates from dispatch (§9). The merge waits on OPEN-1, then on the human's click, by merge commit.

### The pin table

Each row is one line cite in this form, in order: F for the form's own text, C for §2.2's carried clause check, O for the OPEN items. The second column says how the cite names its file. Each pin is read at ca8e44f14d08752849c4da6222c7579eae07e4f1, and its sha256 is over the cited lines, each with its line feed.

| Cite | Named as | Pin |
|---|---|---|
| F1 | the full path | governance/PLAN.yaml:6030-6046 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c1bb5f40272df309c565df1ebe22e16e9cd6aaa3da6d5d9fd1cd403af9689705 |
| F2 | the full path | governance/PLAN.yaml:5707-5723 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:3136ff8f0f328eafe936fb59cfb44d2788b7aa0ce027d90a73c584e4815b7a25 |
| F3 | the full path | state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:27 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c0f14d9122c6eb468a5fd4b1aadd782fcb5f8bcdf17e549739ac6407b76415af |
| F4 | none: the 2026-10-28 directive, F3 | state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:29-37 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:baa3f04685818538da5d407dc5e3db09f0d3d73c614b601eab5e8a85b9dc7611 |
| F5 | the full path | state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:e93556d99c28d74a663143e883702200c234af4eb79fe855b6dbca27c716aa24 |
| F6 | the full path | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:465-466 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:75240b89f4098200cb38365827e300fae93dc3b7e5e82de52cb95678a6df37f1 |
| F7 | the full path | state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:8 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:ef83730920f356d4e08f79f8fbd4c7d5ba8ec6567912b093f41fed285f60302b |
| F8 | the full path | state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:16 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:29ac055c08392a6f510e542315be4cb5be8ddcf8dd35bf4af49a96be4d5883bd |
| F9 | none: the 2026-10-31 directive, F8 | state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38 |
| F10 | the full path | governance/AI_DEVELOPMENT.md:451-454 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821 |
| F11 | none: the 2026-10-31 directive, named | state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38 |
| F12 | the full path | governance/AUTONOMY.md:544 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:25b91d5336bc7016ac3eb61392406795b78f56fc47799fe31085ddcaf1d84ff1 |
| F13 | the full path | governance/AUTONOMY.md:315-332 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3 |
| F14 | the full path | governance/AUTONOMY.md:482 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669 |
| F15 | the full path | governance/AUTONOMY.md:319-320 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:5238514ca590001e21cfa3c41b057ba1c429c7334f4ba2c53c68aeb0b3a5a039 |
| F16 | the full path | governance/AUTONOMY.md:325-327 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7 |
| F17 | the full path | governance/AUTONOMY.md:347-357 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31 |
| F18 | none: the 2026-10-28 directive, §2.1 | state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:29-37 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:baa3f04685818538da5d407dc5e3db09f0d3d73c614b601eab5e8a85b9dc7611 |
| F19 | the full path | docs/README.md:55 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:fb217ecc9d706e379ff9e58f33777004ffe5042aeec51585fded71235ed5ca27 |
| F20 | docs/02 | docs/02_Architecture.md:80 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:b389b1e2f2c4d199e510a473468d17d7cc349384378493e31fe465a88e04a6c2 |
| C1 | the full path | kernel/src/publish/mod.rs:953-970 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:ec1450bbef2fd213b2d74769894e803195a279975ad2d2ff133c851bd2694283 |
| C2 | the full path | governance/PLAN.yaml:5707-5723 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:3136ff8f0f328eafe936fb59cfb44d2788b7aa0ce027d90a73c584e4815b7a25 |
| C3 | none: the 2026-10-28 directive, F3 | state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:27 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c0f14d9122c6eb468a5fd4b1aadd782fcb5f8bcdf17e549739ac6407b76415af |
| C4 | `mod.rs` | kernel/src/publish/mod.rs:957 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:bf639c61208309e9987acd2289307b3c2947d9db340846cbbc4c7e7dfe2b98bd |
| C5 | `viewer_assets.rs` | kernel/src/publish/viewer_assets.rs:160-172 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:0fd5051087b7bff282d758c20fb31121cc5282a560b5b53649d274b3ec0487b8 |
| C6 | the full path | renderer/bundle-viewer/scripts/scan-dist.rs:20 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:46ce49a2423e69ca8911750d616d955b45defd3d37c97244fb29f88a4f5673ef |
| C7 | the full path | renderer/bundle-viewer/redaction-reviewed.json:4-5 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:46dda766862b8e8a419ef1edf5c63aaabd2c086a539e3ddd2db26c6e5e161b84 |
| C8 | the full path | kernel/src/permission/boundary.rs:426 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:9a10864308c99e16025c1f7982f6b323d7c8109600a9ec66ad1e85f2184620bb |
| C9 | `mod.rs` | kernel/src/publish/mod.rs:624-659 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a8b7bc4120833093f595d56b72187b43589d0c156427676610baf21253e6d600 |
| C10 | none: C9's list | kernel/src/publish/mod.rs:684 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7b95ba54235d56081b647f07b4ea668f93238adae037a4feec453487dbaa4994 |
| C11 | none: C9's list | kernel/src/publish/mod.rs:953 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:241b2580a0cf2d3655c71f85184e76c5f424983826d0809d6df07cf55b500cf5 |
| C12 | the full path | frontends/shell/src-tauri/src/publish.rs:832 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:1e4c8c8d1a3ffa4f72885fb1eb757a82215ecbfc122730be0c31b864ad0dffde |
| C13 | the full path | kernel/src/bin/publish-bundle.rs:669 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a24e566543e83549698c0a0d18d53f3db76966854ad7b517373486fbde9f8bcc |
| C14 | the full path | kernel/tests/permission_boundary.rs:1122 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:33fbd25d02405531b82f589df066925d18372e14b3c20b1ed3478f553511288d |
| C15 | the full path | frontends/shell/src-tauri/src/publish.rs:3218 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:6b6703389a3f21360b94cb4f8de2fa10e77a3b6bb3718bed47ef664e54eea245 |
| C16 | `mod.rs` | kernel/src/publish/mod.rs:611-618 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:42576ebd87bb02b3acb0bac0bb024f31103b044163fbd858cccdb23ff863b0ad |
| C17 | the full path | kernel/src/bundle/redaction.rs:405-407 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a04e11bf414dcb17c46edf1da42e483b99efb5ba5aa02e1c30f81750a319f3ff |
| C18 | `redaction.rs` | kernel/src/bundle/redaction.rs:404 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:da179d219c875edbdfe5f071cec308210df8c06845997d90cc25b2b0f4d98c48 |
| C19 | `mod.rs` | kernel/src/publish/mod.rs:931-934 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e |
| C20 | none: C19's list | kernel/src/publish/mod.rs:953 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:241b2580a0cf2d3655c71f85184e76c5f424983826d0809d6df07cf55b500cf5 |
| C21 | none: C19's list | kernel/src/publish/mod.rs:974 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a |
| C22 | `mod.rs` | kernel/src/publish/mod.rs:946-952 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:32a1f02acd0ff0e4396f6922e8b584113a8abf18afc68cff916ada04b2feda26 |
| C23 | the full path | kernel/tests/publish.rs:436-440 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:28a4d15db6334dd924524a1b4456d9cd04e87654c6a492273abd4f49bf12d88a |
| C24 | `mod.rs` | kernel/src/publish/mod.rs:964-969 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:f421cbcc0c7f1c14a520badcb9d3f03fb21e30a6081a92d7b39352bb6d42a829 |
| C25 | the full path | kernel/src/publish/error.rs:283 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:5f54e6e6e057ebf20f0a1d8814fc653c48a8fd889681d79bace4f4bf5e06bf54 |
| C26 | `publish-bundle.rs` | kernel/src/bin/publish-bundle.rs:182 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7220e6f17f19ef00416b31d69c1ad2fd8404d9676ae54204bc478a023edd1cd5 |
| C27 | `publish.rs` | frontends/shell/src-tauri/src/publish.rs:860-862 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c454880f228f7e1fd9295349b4ea646b7391bf02d24cc86613f6518b9fd70549 |
| C28 | the full path | kernel/tests/typed_terminal_codes.rs:495 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7ef263a86856073bbafc42f9fc73e7f9b8c1aeb8e7aabc0c8630a1a4073bef82 |
| C29 | `boundary.rs` | kernel/src/permission/boundary.rs:240 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:4b0a00cc7f425b4defb1ac42766d6d8e19e05ec460f969eff17f1e1a4082ce4b |
| C30 | none: C29's list | kernel/src/permission/boundary.rs:244 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:62149a035940851a2d2015dccad688fb597d5f57d5d4b2bcccb005c6de17ab3f |
| C31 | none: C29's list | kernel/src/permission/boundary.rs:284 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a4c05974eaf03bc9239bc1ee25af25ad311f0514d8d1a8485de152f4e6cf45b2 |
| C32 | none: C29's list | kernel/src/permission/boundary.rs:303 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:cfc99227d98b5d6b167934ac577ba73fd6bec872d9d5dbd7a53b2845befd38b8 |
| C33 | none: C29's list | kernel/src/permission/boundary.rs:485-500 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:51ccd454ca7ab601cfef2df6456ae33bb76b8fc696e1d5c46fa7b51f9dae9f17 |
| C34 | `redaction.rs` | kernel/src/bundle/redaction.rs:399-403 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:cdb91e6f66d20905e6958713b2f0436b04ebe3bb9a410fc6c5b96f5b936ac69d |
| C35 | `error.rs` | kernel/src/publish/error.rs:422-427 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:2e4c12c97b90696cceb60a77356766047849d4e783e12b24247b5b8b82412baf |
| C36 | `redaction.rs` | kernel/src/bundle/redaction.rs:367-369 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:05310002be2dc84f87f928a760a932ae461269f080e0b2d042a6ba25bd4c4f2e |
| C37 | `mod.rs` | kernel/src/publish/mod.rs:966-967 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:2659251ff53c0348588ca74246d51af91b07a05bc02d16ec7374e87691d96b6c |
| C38 | `redaction.rs` | kernel/src/bundle/redaction.rs:367 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a6ba4b274812cb6fb7bb5df298f80a5adee8789cb70ca7cae0745271e548857a |
| C39 | `mod.rs` | kernel/src/publish/mod.rs:968 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:227a63388d1246956622e6c443e0875eb1b1f700d4a465d664fe8091714460c9 |
| C40 | `error.rs` | kernel/src/publish/error.rs:186-197 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:2ade3ed2be636792cca25ebe038edba8abaddb7d2d33dcbac60890255d28c927 |
| C41 | none: C40's list | kernel/src/publish/error.rs:422-427 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:2e4c12c97b90696cceb60a77356766047849d4e783e12b24247b5b8b82412baf |
| C42 | `boundary.rs` | kernel/src/permission/boundary.rs:486-500 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:232b64a3fc1aa02a61eee15f8c6b652b799114afd008c58901024f89252b7f76 |
| C43 | `mod.rs` | kernel/src/publish/mod.rs:964 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c36feefd3f2b544eaa2d0faa6cf0aaf7cdcc56ac971de637d8c1e5fe289b5af1 |
| C44 | none: C43's list | kernel/src/publish/mod.rs:974 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a |
| C45 | `mod.rs` | kernel/src/publish/mod.rs:642-657 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:b29068705e7d7d01a6a60229c3fc65e73a235b1f2d54d6431685a1b560eba9a9 |
| C46 | `viewer_assets.rs` | kernel/src/publish/viewer_assets.rs:160-172 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:0fd5051087b7bff282d758c20fb31121cc5282a560b5b53649d274b3ec0487b8 |
| C47 | `redaction.rs` | kernel/src/bundle/redaction.rs:405 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:1e416b9426cfbe2a8f6b0af44e3988149d8364c43345cb8a4cd8d77eb88f36a1 |
| C48 | `mod.rs` | kernel/src/publish/mod.rs:957 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:bf639c61208309e9987acd2289307b3c2947d9db340846cbbc4c7e7dfe2b98bd |
| C49 | `publish.rs` | frontends/shell/src-tauri/src/publish.rs:1394 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:9bd1fb230fa0ace614c74385d47412ce68400170a188912179ba27e12c42447f |
| C50 | none: C49's list | frontends/shell/src-tauri/src/publish.rs:1399 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:58aa60ee43ba478df4aa3f3958faa2f0cd35a10762148fdcf79e0a1e7568f1b8 |
| C51 | none: C49's list | frontends/shell/src-tauri/src/publish.rs:1406-1437 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:9719f758ceec08743ff7aecc5c544415f564767b1dfd09065ae8a6bbce4c5eef |
| C52 | `viewer_assets.rs` | kernel/src/publish/viewer_assets.rs:339 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:016e4965dacf714183e0ee779110c3784f9d8aeb453074d376af99ec1ffdb50d |
| C53 | `permission_boundary.rs` | kernel/tests/permission_boundary.rs:1161 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:8917bd2c732bfe09f61aad317fb8cbf2d61e8678a3d3d7abdb23a47dbc92eae5 |
| C54 | `publish.rs` | frontends/shell/src-tauri/src/publish.rs:3257 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:eb39ab0ccbbeeacbd520909156dc2494c37099a63f3262a89741338a16ff37f5 |
| C55 | the full path | renderer/bundle-viewer/scripts/scan-dist.mjs:78 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:3c03dd0451f9efc22f69ae468766e0ee4c58751e9679a4afd912e83289ab5e32 |
| C56 | none: C55's list | renderer/bundle-viewer/scripts/scan-dist.mjs:88-91 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:03d978fdb0487935b2a83c9c558a266db9ecfe5b1fa6924b7913b49674fb9c6e |
| C57 | none: C55's list | renderer/bundle-viewer/scripts/scan-dist.mjs:92-96 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:90e3848dc4e50e99feeccea35627f14aff981bc494c2c48327968ca344d6eab4 |
| C58 | the full path | renderer/bundle-viewer/scripts/scan-dist.test.mjs:37 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:b11d61c06388b532a0fb355d943977931f4681427a59b7b9a8744c90ae224132 |
| C59 | `scan-dist.rs` | renderer/bundle-viewer/scripts/scan-dist.rs:12-13 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:8790cce2b9123a10344e64948dd4e492328a8233a261acd8d8f11c6945d1ada7 |
| C60 | none: C59's list | renderer/bundle-viewer/scripts/scan-dist.rs:20-21 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:895d717e2489218e0639d9ba69785e6269e46f4be06a5cd1b2803a5318d483c1 |
| C61 | `mod.rs` | kernel/src/publish/mod.rs:946-952 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:32a1f02acd0ff0e4396f6922e8b584113a8abf18afc68cff916ada04b2feda26 |
| C62 | `scan-dist.mjs` | renderer/bundle-viewer/scripts/scan-dist.mjs:33-39 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:13949717e211f0d5485d12442a370d544c0b99813c34a3795898da57a2bd6ee6 |
| C63 | none: C62's list | renderer/bundle-viewer/scripts/scan-dist.mjs:76 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:ebe46dcec24b0388bc39ee52331b1abe4033cbe3ac5ae3d02e675058bb2c4edc |
| C64 | none: C62's list | renderer/bundle-viewer/scripts/scan-dist.mjs:81 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:d21e23459146ec62e1b93216f95202f006e89c4a36a667c058faea3f5049c9d9 |
| C65 | none: C62's list | renderer/bundle-viewer/scripts/scan-dist.mjs:86-87 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:e9a2c11afe91b35905816147db65dc6575b404c06079d8bc64c0c3b31a10887b |
| C66 | `scan-dist.test.mjs` | renderer/bundle-viewer/scripts/scan-dist.test.mjs:57 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:56d7629890a170f137bc97f3689a1a7b533c6a7ee80dbfb693ee3d7b181ee64d |
| C67 | `viewer_assets.rs` | kernel/src/publish/viewer_assets.rs:164-172 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:6c6fbc0babf8b3206dd3611c126bef0374e98368e58686a40735d488f57eaddb |
| C68 | `redaction.rs` | kernel/src/bundle/redaction.rs:408 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:d94ffab88481f67ba77bffafa237bd7f45b1e123599179f2af5153a72178aa24 |
| C69 | `redaction.rs` | kernel/src/bundle/redaction.rs:404-408 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:d3e9fa2423dd72a4e9c51001619c44f9a03c99dfc9a377029ce13424c686be96 |
| C70 | `redaction.rs` | kernel/src/bundle/redaction.rs:398 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:ef2e93e75427af3805a1cabb63d0fc83df4596fa97854d5641783c9dee7e6764 |
| C71 | `mod.rs` | kernel/src/publish/mod.rs:956 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:937e4739bc5848a7b992d8f033f2320d2bc987d60921d97ae45e7b12e3c9d85a |
| C72 | the full path | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:234 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:71bca194070204c050227aaa6607265f2f91117c69202e67e49ad6059b076707 |
| C73 | none: the redaction form, C72 | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:60 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:6713d630ab9918f23fa21b2ca6cd7a8f89cd6347b032f06956e7536d3c2ae6fb |
| C74 | `mod.rs` | kernel/src/publish/mod.rs:910 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:ae41f0aafaf78de9eecf55f74ab68054e0bd2cc5c0311d7a35972b52996379aa |
| C75 | none: C74's list | kernel/src/publish/mod.rs:915 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7bd1228f7635778f7857c62f746a9af08f7453257309b98e8420fde87183f8ec |
| C76 | none: C74's list | kernel/src/publish/mod.rs:920 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:eb0190bc626db79deee2f480dbfa03625f07632586ad22d6c6cd37ae5c9f45b7 |
| C77 | none: C74's list | kernel/src/publish/mod.rs:931-934 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e |
| C78 | none: C74's list | kernel/src/publish/mod.rs:973-974 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:f3875a0e3f9ea3c3a279c1e00637d02e73fac3aca15021a18c9b809cb204cf7d |
| C79 | `redaction.rs` | kernel/src/bundle/redaction.rs:387 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:6ff6497d56abdbbdc2185a69b89d8faf0579e701e069545e04ee527126dcd0eb |
| C80 | `mod.rs` | kernel/src/publish/mod.rs:942-944 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:07d400efe8d7177515ab1bae5709eea2dcf3049984afbf3e167045c54eafacc8 |
| C81 | none: C80's list | kernel/src/publish/mod.rs:1586-1588 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c60b390cdc34b2b94590fb67366aa46a2d3dff44f50e8c4df9cc56c940faba60 |
| C82 | none: the redaction form, C72 | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:293-296 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:f6144cbdd66a808b240c04a92401abd800c034a015826901c1476dd4bc78636b |
| C83 | the full path | kernel/src/bundle/mod.rs:53 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c7813e8a140d4d6b849fd11f787a0584b6aa85c538f85d1f5a2b958cb9b6dec3 |
| C84 | `mod.rs` | kernel/src/publish/mod.rs:936-970 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:0142b5980d99a2be87f934d367bcd5e4a9b9a608841ff4105569a9974c5124c5 |
| C85 | the full path | KNOWN-LIMITATIONS.md:420 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:14ad825095a889accba51a49a935a884421a28ce91a332cf8a599e3b11a98374 |
| C86 | the full path | KNOWN-LIMITATIONS.md:413 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:0eae4375328d61a369d1c4dc3a0eaaf259adb9dd6758277b993bf28ac2720e38 |
| C87 | none: C86's list | KNOWN-LIMITATIONS.md:418 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:baf9f0383c94833368e50d4bd7373ff3827a97b1f6b41ad676b9d3dae34ddb96 |
| C88 | none: C86's list | KNOWN-LIMITATIONS.md:420 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:14ad825095a889accba51a49a935a884421a28ce91a332cf8a599e3b11a98374 |
| C89 | the full path | docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:500-504 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:1de5ffa11e2d8887469105c1a03bc6b7f5384a6dad63abdfcef6db89af4c3997 |
| C90 | `viewer_assets.rs` | kernel/src/publish/viewer_assets.rs:160-172 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:0fd5051087b7bff282d758c20fb31121cc5282a560b5b53649d274b3ec0487b8 |
| C91 | `scan-dist.rs` | renderer/bundle-viewer/scripts/scan-dist.rs:20 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:46ce49a2423e69ca8911750d616d955b45defd3d37c97244fb29f88a4f5673ef |
| C92 | `redaction-reviewed.json` | renderer/bundle-viewer/redaction-reviewed.json:4-5 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:46dda766862b8e8a419ef1edf5c63aaabd2c086a539e3ddd2db26c6e5e161b84 |
| C93 | none: the redaction form, named in its sentence | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:648 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c2fde9ff3656394e9b8643df25571ffe45211f0a7ed5b39ed1985efb91255d36 |
| C94 | `redaction.rs` | kernel/src/bundle/redaction.rs:405-407 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a04e11bf414dcb17c46edf1da42e483b99efb5ba5aa02e1c30f81750a319f3ff |
| C95 | `error.rs` | kernel/src/publish/error.rs:287 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:f9f82d67f65f844e748597d54d733e57e83e3b177d9146e17bdf4499bf74b0a6 |
| C96 | `boundary.rs` | kernel/src/permission/boundary.rs:244 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:62149a035940851a2d2015dccad688fb597d5f57d5d4b2bcccb005c6de17ab3f |
| C97 | `boundary.rs` | kernel/src/permission/boundary.rs:284 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a4c05974eaf03bc9239bc1ee25af25ad311f0514d8d1a8485de152f4e6cf45b2 |
| C98 | `publish.rs` | frontends/shell/src-tauri/src/publish.rs:1398 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:ccf656aff9b8e6f229f8ae02c50e2b3fc9e2f83b5e9244aa2419f7be1ab76820 |
| C99 | `ADR-017` | docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:17-18 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:4a5cbef3a6a402e092d1cb541a0b798b949cb45c967fb3aa340de4d28cd76dc7 |
| C100 | none: C99's list | docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:797 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:49e3e290cf4995e3a3605523e23b89d162859081507aefc45ab8f8fa118f29c3 |
| C101 | `scan-dist.rs` | renderer/bundle-viewer/scripts/scan-dist.rs:20 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:46ce49a2423e69ca8911750d616d955b45defd3d37c97244fb29f88a4f5673ef |
| C102 | `mod.rs` | kernel/src/publish/mod.rs:946-952 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:32a1f02acd0ff0e4396f6922e8b584113a8abf18afc68cff916ada04b2feda26 |
| C103 | the full path | KNOWN-LIMITATIONS.md:418 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:baf9f0383c94833368e50d4bd7373ff3827a97b1f6b41ad676b9d3dae34ddb96 |
| C104 | `mod.rs` | kernel/src/publish/mod.rs:910 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:ae41f0aafaf78de9eecf55f74ab68054e0bd2cc5c0311d7a35972b52996379aa |
| C105 | none: C104's sentence | kernel/src/publish/mod.rs:915 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7bd1228f7635778f7857c62f746a9af08f7453257309b98e8420fde87183f8ec |
| C106 | none: C104's sentence | kernel/src/publish/mod.rs:920 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:eb0190bc626db79deee2f480dbfa03625f07632586ad22d6c6cd37ae5c9f45b7 |
| C107 | none: C104's sentence | kernel/src/publish/mod.rs:931-934 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:3622df8dab8650766633f31efdc5fe3e757f9acf64ab01587e3640684792059e |
| C108 | none: C104's sentence | kernel/src/publish/mod.rs:1580 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:edd6e9a4d6d28dca6481749df6f265ea7f60b0b284fdcd2f3418f7a6753d2744 |
| C109 | none: C104's sentence | kernel/src/publish/mod.rs:1586-1588 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c60b390cdc34b2b94590fb67366aa46a2d3dff44f50e8c4df9cc56c940faba60 |
| C110 | none: C104's sentence | kernel/src/publish/mod.rs:1615 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:29ee16cf10ae5a30408301004889a3a47dff7ecaaf469c3c1393b320c96018e0 |
| C111 | `redaction.rs` | kernel/src/bundle/redaction.rs:387 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:6ff6497d56abdbbdc2185a69b89d8faf0579e701e069545e04ee527126dcd0eb |
| C112 | none: C104's list item | kernel/src/publish/mod.rs:973 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:346aff1a7a03c1735a7761bbc9c5b51d302005a90574f6d893629a12d90fa7f8 |
| C113 | none: C104's list item | kernel/src/publish/mod.rs:974 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:7e896ea531832c20addd1cc2099250973068c7f1cb8194f2c9ff694967c6a45a |
| C114 | none: the redaction form, named in its sentence | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:151 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:d9189897faccc81f2af6b3015a18dcf9d1be6d3ca4c079a57102a938cad52459 |
| C115 | none: C114's list | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:153 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:46e1ce9700e1d1f3d48e0fa1e3e97056963cac15516cd6cf22f9d29210b674db |
| C116 | the full path | governance/PLAN.yaml:6045 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:9fdb24024f60e544a2538ad7260e35f144bf9afeb7ae4d6eab77cf3c5215e7a0 |
| C117 | `ADR-017` | docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1089-1090 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:a4b350cf1ed040b7deaf5c9b4779bac51a8fe868fcde485080a77de789890c1c |
| C118 | none: the redaction form, named in its sentence | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:293-296 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:f6144cbdd66a808b240c04a92401abd800c034a015826901c1476dd4bc78636b |
| C119 | none: C118's list | governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:156-164 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:e537131ee2ba8fa4a35caccb5c7d1a2642734dacb6b47def20230af103256365 |
| C120 | `mod.rs` | kernel/src/publish/mod.rs:942-944 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:07d400efe8d7177515ab1bae5709eea2dcf3049984afbf3e167045c54eafacc8 |
| O1 | none: the 2026-10-28 directive, F3 | state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:27 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:c0f14d9122c6eb468a5fd4b1aadd782fcb5f8bcdf17e549739ac6407b76415af |
| O2 | the full path | docs/02_Architecture.md:80 @ ca8e44f14d08752849c4da6222c7579eae07e4f1 sha256:b389b1e2f2c4d199e510a473468d17d7cc349384378493e31fe465a88e04a6c2 |
