Reviewed: branch cut/partitioned-ordinal-refusal-opens-the-identity-form at 8d1fe83acfaede6873b6366e6594b99ddf9943ad, PR 366 (draft), in the branch worktree C:/dev/wt/partref, read only; the records at main 965a79749267c20cea7f4fe49887c2113033ad19 in C:/dev/wt/read-1123ak (the custodian's filing note, 2026-11-24: the architect's build gate, attempt 1, node:partitioned-ordinal-refusal-opens-the-identity-form@build-gate-architect-1, dispatched at 2026-11-24T00:56:17Z; its run: Read 33, Grep 16, Glob 4, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T00:56:17Z to 2026-11-24T01:03:06Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T01:03:06Z. Filed below the rule from its hand-back, 15105 bytes, sha256 e650203e11a7e5e01bd991c4bea5844b11ca0164cc4f96c9c1a950a18a5e04ed, byte for byte, nothing masked; 1 path of a file not on main, cited with a line, written as the file name alone by the custodian: `kernel/tests/partitioned_refusal_offers_no_declaration.rs` to `partitioned_refusal_offers_no_declaration.rs`, with one final newline added.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/partref @ 8d1fe83acfaede6873b6366e6594b99ddf9943ad
Branch: cut/partitioned-ordinal-refusal-opens-the-identity-form @ 8d1fe83acfaede6873b6366e6594b99ddf9943ad
REPORT PATH: state/consults/gates/2026-11-24-partitioned-ordinal-refusal-opens-the-identity-form-build-gate-architect.md

Correctness is closed. The FAIL comes from one Evidence finding: a mutation the form requires was never run. There is also one Documentation finding, which must be fixed before the merge.

## Findings

**E1. Evidence (blocks). M-K1b was never run.**
- What the form requires: §4's table lists M-K1b in "the named set": guard the gate at `dataset.rs:327` with `declared_identity.is_none()`, so that K1 fails at (a) for the declared open with `engine.source`. §4's last bullet says "The mutations are run and reverted by the worker, and each observed failure is recorded by name in the closing."
- What happened: the build report (`state/consults/2026-11-23-partitioned-ordinal-refusal-opens-the-identity-form-worker-report.md:32` @ 965a7974) says M-K1b "was not run". The worker read the form's "recorded" as meaning nothing was left to run. In this project a recorded mutation is one that was observed (compare K1's own RECORDED MUTATION at `partitioned_refusal_offers_no_declaration.rs:28-31`).
- Why it matters: M-K1b is the only mutation that shows K1 can see a declaration getting past item 5's refusal. That is the "whether or not an identity column is declared" property, which D1 now states as an engine fact. K1's assertions (a) and (d) on the declared open were green before the fix and after it (P0 failed only at (c)), so nothing yet shows they can fail.
- The code reading predicts the failure: under the guard, a declared open of a folder falls through to `engine/src/dataset.rs:330-335` and is refused as `engine.source`, so `partitioned_refusal_offers_no_declaration.rs:75` fails. This is a prediction, not an observation.
- To close it:
  1. Apply M-K1b at the head, run K1, revert, and `cmp` the file. Do not commit the mutation; §8 item 4 still holds.
  2. Add one RECORDED MUTATION paragraph to K1's doc, naming the commit it was observed at and the failing assertion. The file is in §7 Scope.
  3. Record it in the closing amendment.
- The re-gate reads only that one observation and that one paragraph. The other way to close it is an amendment that takes M-K1b out of §4's named set, with a reason. That weakens the proof of item 5 and is not recommended.

**D-1. Documentation (must fix before merge). The source comment at `frontends/shell/src/admission/formatRefusal.ts:124-129` misses a case an operator can reach by timing.**
- The comment says the shell reaches this refusal "only" through the dev-only `openPath` hook or from another client. There is a third case:
  - A picked file whose name holds `[`, `]`, `{` or `}` is admitted as one file at `engine/src/dataset.rs:1907-1909`.
  - If that file is removed after the pick (or after the reopen's check at `kernel/src/project/resolver.rs:179-182`) and before the open runs, step 3 refuses it with this code (`dataset.rs:1907-1914`).
- This needs timing inside one open, so under §31 it does not block, but it must be named in the sentence's source comment.
- "Only" also holds only on Windows, where a file name cannot hold `*` or `?`. On a platform where it can, the native `.parquet` picker (`frontends/shell/src-tauri/src/commands.rs:319-331`) could reach this refusal.
- These are the worker's words, not the human's or the advisor's. The worker applies them with no re-gate, and the PR body lists them.

Old:
```text
      // The gap the operator can see: in the shell this refusal is reached only through the
      // dev-only `openPath` hook, or from another client (section 0, Reach, of
      // governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md).
      // `AdmissionPanel` opens no form for this code (`formFamilyForCode`): the declaration form
      // sends the same path and is refused again. A single file whose name holds `*` or `?` is
      // also refused, and this text does not name that case.
```
New:
```text
      // The gap the operator can see: in the shell on Windows this refusal is reached only through
      // the dev-only `openPath` hook, from another client (section 0, Reach, of
      // governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md),
      // or when a file whose name holds `[`, `]`, `{` or `}` is removed after it was picked or checked
      // and before its open runs (timing inside one open; step 3 of `partitioned_source_detail` in
      // engine/src/dataset.rs), where this text's "folder or a pattern" does not fit what was picked.
      // `AdmissionPanel` opens no form for this code (`formFamilyForCode`): the declaration form
      // sends the same path and is refused again. A single file whose name holds `*` or `?` is
      // also refused, and this text does not name that case; Windows allows no such name.
```
Each clause checked against the code at the head:
- "on Windows … only through the dev-only `openPath` hook":
  - the shipped open is `pick_file` with a `.parquet` filter (`commands.rs:319-331`);
  - a reopen refuses a data path that is not a regular file (`resolver.rs:180-182`);
  - a picked existing file is a directory at neither `dataset.rs:1885` nor `*`/`?` on Windows, and with a bracket it returns `None` at `dataset.rs:1908-1909`;
  - the hook is registered only in an instrumented build (`AdmissionPanel.tsx:435-436`).
- "removed after it was picked or checked and before its open runs": `dataset.rs:1907-1914` refuses a bracket path at which `is_file()` is false.
- "Windows allows no such name": `*` and `?` are reserved characters in Windows file names. This is a platform fact.
- The rest is unchanged.

## Your checks

**1. ADR-016 Amendment 1 item 5 holds at the head.**
- The refusal comes before any identity path: `open_inner`'s first act is `engine/src/dataset.rs:327-329`, and `admit_identity` is first called at :565.
- Every constructor goes through `open_inner` (:222-310). The kernel goes through `Dataset::open_cancellable` (`kernel/src/lib.rs:219-236`) from `SkpHost::open_under` (`kernel/src/skp.rs:1205-1212`).
- The watch arm at `skp.rs:1203` returns an `ArmOutcome`, not a `Result`, so it cannot get in front of the refusal.
- No identity declaration is offered:
  - D1 (`engine/src/error.rs:390-396`) offers none;
  - D2 (`formatRefusal.ts:130-133`) says a declaration does not change the refusal;
  - `formFamilyForCode` returns no family for the code (`AdmissionPanel.tsx:31-36`), so no form opens and no tier choice is shown.
- A prior family can still be carried forward by `nextFormFamily` (`AdmissionPanel.tsx:53-56`, :292). S2 leaves that uncovered, and its header discloses it (`formatRefusal.test.ts:193-195`). Reaching it needs the same path to change from a file to a folder between two submits. Note only.
- The sentence "Its existing declared-mapping route is untouched" (`docs/adr/ADR-016-stable-feature-identity-admission.md:231-232`) now sits beside a message saying the refusal applies whether or not a column is declared. The contradiction is in older code, not this piece. ADV-2026-11-23-27 item 4 rules that the Note owed on it lands in the identity route's PR. Not this piece's to fix.

**2. The seam rule.**
- kernel/src, protocol/ and AdmissionPanel.tsx are not in the diff, so each seam's interface is the same at the base 2095a7ac and at the head.
- **Engine to kernel.**
  - The interface: `error_of` sets `message` from `e.to_string()` (`skp.rs:2139`) and maps the variant to `identity_ordinal_partitioned_unsupported` with `detail` only (:2189-2192).
  - K1 calls the real `SkpHost::open_dataset` (`skp.rs:1108`) with the real `OpenDatasetRequest` (`protocol/skp/src/v0/commands.rs:21-40`) and `IdentityDeclaration` (:58-60), and compares `SkpError` values (`protocol/skp/src/v0/error.rs:15-22`, which derives `PartialEq`).
  - K1 pins the code (a), a `detail` ending "is a directory" (b), the message equal to the engine's `Display` (e), and the two errors equal (d).
  - It does not pin that `fields` holds `detail` and nothing else. Note only: kernel/src is untouched.
  - The only real part replaced is the watch arm (`no_watch_arm`), which is off the error path as shown above.
  - Verdict on this seam: pinned, except for the closed set of fields.
- **Kernel to shell.**
  - K1 stops at the kernel. On the shell side, S1 and S2 (`formatRefusal.test.ts:183-203`) are keyed on the same code literal as K1's `CODE` (`partitioned_refusal_offers_no_declaration.rs:19`).
  - `RefusalBlock` shows `message` as it arrives (`RefusalBlock.tsx:34`) and adds the guidance looked up by code (:30, :46). Neither changed.
  - So the second seam is pinned only in part: by the matching literal, not by a test that carries one real refusal across. That is accepted under ADV-2026-11-23-27 item 3 (OPEN-3 (a)).
- No new `pub` item, callback or option. S2 imports two existing exports.

**3. Rule (00) and §9a.**
- The diff's paths are exactly `KNOWN-LIMITATIONS.md`, `engine/src/error.rs`, `frontends/shell/src/admission/formatRefusal.test.ts`, `frontends/shell/src/admission/formatRefusal.ts` and `kernel/tests/partitioned_refusal_offers_no_declaration.rs`. These are §9a's five.
- Nothing under `protocol/`, no wire fixture, no lockfile. OPEN-2 (a) holds.

**4. §8, item by item.**
1. Nothing outside §7's files: holds.
2. No edit under `protocol/` or `kernel/src/`: holds.
3. AdmissionPanel, RefusalBlock and IdentityDeclarationForm unchanged: holds.
4. Code, fields and the gate unchanged: holds.
5. Shown strings carried the placeholder mark at 2b90ed51 (the recorded outputs at `formatRefusal.test.ts:181-182` show it). The words commit followed ADV-2026-11-23-27, which was on main at f0718827 by the words report. Holds.
6. No placeholder string is asserted byte for byte: S1 checks properties only. Holds.
7. No ADR text edited: holds.

§7: 156 insertions plus 27 deletions is 183, at or under 200, over 5 files. No class 8.

**5. The words.**
- D1: the arm at `error.rs:392-395`, with its line continuations joined, is byte-equal to ADV-2026-11-23-27 item 6. Each clause is true:
  - "read as a folder or a pattern, not as one file ({detail})": the three refusal arms are at `dataset.rs:1885-1886` and :1907-1914;
  - "opens a single file only": :330-335;
  - "before reading it": stats and the path text only (:1884-1917, called at :327);
  - "whether or not … declared": :327 comes before :565.
  - It contains no "generation".
- D2 (`formatRefusal.ts:131-132`) is byte-equal to item 7 and true. Its only misfit is the timing case D-1 names.
- D3 (`KNOWN-LIMITATIONS.md:283-286`) quotes D1 with `{detail}` written as `` `<detail>` ``, as item 8 asks, and the following sentence equals item 8. No other word of item 20 changed except line wrapping.
- None of D1 to D3 is untrue.
- The other comments are true against the code:
  - error.rs :182 (the reviewer's words) and :190-192;
  - formatRefusal.ts :61-63 and :68-74 (the reviewer's);
  - formatRefusal.test.ts :139-140 (the reviewer's) and :175-198;
  - K1's docs;
  - item 20's comment, including the line naming whose words the item holds.
- The one exception is D-1.

**6. The constitution.**
- Engine messages state engine facts and owners state consequences (round 7): D1 is engine facts only, and D2 is the owner's route.
- docs/02's module boundaries are kept. There is no snapshot wording, which ADR-016 Amendment 1 item 1 forbids.
- Item 6's "existing tests stay green unmodified" is scoped to native and mapped identity. The replaced S1 is a session-tier guidance test, so item 6 does not apply.

**7. Records.**
- The quotations in new comments match their sources:
  - `formatRefusal.ts:69-70` against `governance/forms/engine/ADMISSION-PREREGISTRATION.md:234` §12d;
  - the old-text quotes in K1 :29-30 and `formatRefusal.test.ts:175-176` and :180 against the base's message and guidance as the diff removes them;
  - the observed failure outputs against the build report.
- No line cite into the ledger.
- The cites in source comments hold on main: the form by section, and ADV-2026-11-23-27 by item.
- One condition: the RECORDED MUTATION lines name branch commit 2b90ed51. They hold on main only if the PR is merged so that 2b90ed51 stays reachable (a merge commit, not a squash).
- `engine/ADMISSION-PREREGISTRATION.md §2d` in item 20's comment is a moved path. It is older text, it resolves through `governance/MOVED.tsv:29`, and it is not a finding.

## What the closing amendment must record
- This gate: FAIL, at the report path above.
- E1's close: M-K1b's observation (the commit, and the assertion that fails by name), or the amendment that withdraws it. Then the narrow re-gate's verdict.
- D-1's words, applied and listed in the PR body.
- The mutations M-S1, M-S2 and M-K1 were applied at the same time, each in its own file (disclosed).
- Test-text spans on the unmerged branch named by commit id, not pinned by hash at a branch commit (round 25).
- The finding carried under OPEN-2 (a): `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json:3` and `protocol/skp/SKP-V0.md:734-735` still hold the old text. The identity route takes them as a class 9 addition, built on this head (ADV-2026-11-23-27 item 2; ADV-2026-11-23-32 item 3).
- ADR-016's Note 2026-11-23 is owed in the identity route's PR (ADV-2026-11-23-27 item 4).
- §7: 183 of 200, at 8d1fe83a.

No decision is missing, so there is no ADR skeleton.

## Files read
- Brief: `<S>/brief-partref-arch-1.md`
- Diff: `<S>/partref-diff-8d1fe83a.txt`
- Second words report: `<S>/report-partref-words2.md`

In `C:/dev/wt/read-1123ak` (@ 965a7974):
- `governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md`
- `docs/adr/ADR-016-stable-feature-identity-admission.md` (:170-247)
- `governance/AUTONOMY.md` (:377-392, :600-619)
- the three rulings ADV-2026-11-23-20, ADV-2026-11-23-27 and ADV-2026-11-23-32 under `state/directives/`
- the two worker reports under `state/consults/`

In `C:/dev/wt/partref` (@ 8d1fe83a):
- `engine/src/error.rs`
- `engine/src/dataset.rs`
- `engine/src/fixture.rs` (grep)
- `kernel/src/skp.rs`
- `kernel/src/lib.rs`
- `kernel/src/project/resolver.rs`
- `kernel/tests/partitioned_refusal_offers_no_declaration.rs`
- `kernel/tests/watch_support/mod.rs` (grep)
- `protocol/skp/src/v0/commands.rs`
- `protocol/skp/src/v0/error.rs`
- `frontends/shell/src/admission/formatRefusal.ts`
- `frontends/shell/src/admission/formatRefusal.test.ts`
- `frontends/shell/src/admission/AdmissionPanel.tsx`
- `frontends/shell/src/admission/RefusalBlock.tsx`
- `frontends/shell/src-tauri/src/commands.rs`
- `frontends/shell/src/publish/formatPublishRefusal.test.ts` (grep)
- `KNOWN-LIMITATIONS.md`
- `governance/forms/engine/ADMISSION-PREREGISTRATION.md`
- `governance/MOVED.tsv` (grep)

Model: Opus 5.5 (claude-opus-5-5).
