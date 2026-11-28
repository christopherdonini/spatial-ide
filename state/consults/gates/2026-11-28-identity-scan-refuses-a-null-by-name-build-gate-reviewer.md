# The identity scan refuses a null by name: the reviewer's build gate at 6e5a0b83 (node:identity-scan-refuses-a-null-by-name@build-gate-reviewer): PASS WITH NOTES

*Filed by the custodian. The reviewer (Opus) read D:/wt/read-1127c at dda3521f80e62ed039db66885cfa737695f6426f and D:/wt/nullname at 6e5a0b834ca37a2bb9ad20073fe20511b760558e, ran its mutations and suites in shared holds with its scripts and logs under D:/wt/nullname-logs, and left the checkout clean, as its report says. By the facts script its records run from 2026-11-28T00:07:35Z to 2026-11-28T01:04:13Z, and 58 of its calls ran with the main checkout as their working folder, the shell's start folder. By its completion notice it took 3397617 ms and 65 tool uses. Its hand-back is below as received, with the harness indent removed: 16037 bytes, sha256 8777996582f0f443cd51029b9770b1d2f9aecd91c04d66b983d8b56f7e951fad.*

---

PASS WITH NOTES — cut/identity-scan-refuses-a-null-by-name @ 6e5a0b834ca37a2bb9ad20073fe20511b760558e. Main read: dda3521f80e62ed039db66885cfa737695f6426f (D:/wt/read-1127c). The tree was clean before and after (`git -C D:/wt/nullname status --porcelain` printed nothing; HEAD 6e5a0b83).

I found no Correctness or Evidence finding. There are three Documentation findings, and each must be fixed before the merge.

## 1. Scope (f7770e1a...6e5a0b83)

**Commands:**
- `git diff --name-only f7770e1a...6e5a0b83`
- `git rev-list --parents f7770e1a..HEAD`: four commits in a single line, no merge commit.
- `git show --stat` for each commit.

**Files changed:** six, all among §7's seven paths: engine/src/dataset.rs, engine/src/error.rs, engine/src/fixture.rs, engine/tests/identity_null_refusal.rs, engine/tests/identity_null_refusal_scan_count.rs and kernel/tests/skp_admission_remediation.rs. engine/README.md is untouched, which matches §2.7 (lead-data writes its pointers at the merge).

**Changes against §2 and §4:**
- **dataset.rs:** all inside §2.1.
  - `count("<c>")` is added as the 5th column (index 4), so min and max keep indices 2 and 3.
  - `run_identity_scan` returns `present`.
  - The null check sits between the negative check and the repeat check.
  - Three comments are corrected: "four questions", the counter comment's "null", and the doc of `identity_verification_scans`, which now names T7.
  - No change to the skip, session-ordinal, not-addressable or set-aside arms, to `set_aside_outcome`, or to the cancel guard.
- **error.rs:** the `IdentityUnusable` doc now lists six refusals (§2.2). The 6e5a0b83 edit to the `LodRefused` doc (two lines) is outside §2.2's letter. See D2.
- **fixture.rs:** §2.6. The mode, `NullBearingWidth` and `NullBearingValues` (named by Amendment 6 item 4), the refusal before the first row, and the four arms. The private helper `NarrowColumn::field_name` belongs to the mode.
- **The three test files:** §4 with Amendment 3. T1 to T7, K1 and K2, plus the Mutation lines (f6614e15).

## 2. §7's count at the head

**Command:** `git diff --numstat f7770e1a...6e5a0b83 -- . ':!<form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, summed with awk.

**Printed:** 39/13 dataset.rs, 7/6 error.rs, 164/0 fixture.rs, 201/0 identity_null_refusal.rs, 49/0 identity_null_refusal_scan_count.rs, 65/1 skp_admission_remediation.rs. That is **545 lines over 6 files**, under the ceilings of 650 and 7.

No path falls outside the count, because the diff touches no excluded path. Amendment 6 item 3's 541 is the count at f6614e15; 6e5a0b83 adds 2 insertions and 2 deletions, which gives 545 (D2).

## 3. The mutations, observed again at the head

**The driver:**
- `sha256sum` and `wc -c` matched the brief: mutations.sh is 1453 bytes, sha256 e4e5247a…068c; mutate.mjs is 3370 bytes, sha256 51118d9a…1e89.
- I read both whole. The worker's record (mutations.txt) says "observed at 69e36325…".

**Entries against §4 (with Amendment 3) and the test-source Mutation lines:** every entry is the named mutation and matches its source line.
- M-1 makes the check `if false && nulls > 0` (removed). Recorded on T1.
- M-2 makes it `distinct == present || true`, so W-1 always. Recorded on T2.
- M-3 adds `&& matches!(field.data_type(), Int64|UInt64)`. Recorded on T3.
- M-4 makes it `if field.is_nullable()`. Recorded on T4.
- M-5 computes `rows - distinct`. Recorded on T5.
- M-6 moves the null block before the negative check. Recorded on T6.
- M-7 adds a second `execute_guarded` call with its own `fetch_add` inside the null arm. Recorded on T7. It re-runs the whole scan rather than reading only the null count. It is still "a second guarded call over the file", so it meets §4.
- M-8 makes the arm `return Err(EngineError::Query(detail))`. Recorded on K1 and K2.
- M-9 makes it `identity_source: IdSource::File.as_envelope_value()` at the null site only (Amendment 3 item 4). Recorded on T3.

**Old texts at the head:** I ran `grep -cF` on each anchor in engine/src/dataset.rs.
- Each of these printed 1: `    if nulls > 0 {`, `let detail = if distinct == present {`, `let nulls = rows - present;`, `    // **A null, refused by name**`, `    if distinct != rows {` and `        if m < 0 {`.
- M-8's and M-9's anchors are scoped by the script to the segment from `let nulls` to `if distinct != rows`, where each occurs once. File-wide they occur 5 times, but the script checks the count inside the segment.
- Every Old stands, so I needed no hand-applied mutation. I applied each with the hash-verified mutate.mjs.

**Runs:** each mutation ran in its own `hold shared` through D:/wt/nullname-logs/rr-mut.sh. Its logs are rr-mut-M-1.log to rr-mut-M-9.log, each with the applied diff; no earlier log was overwritten. Every run gave rc=101, and `grep -c "error\[E"` printed 0 in all nine logs, so none failed by a compile error. Each test failed at its own assertion:
- **M-1:** T1 at identity_null_refusal.rs:101 (the detail assertion, which read the repeat detail). T2 (:121) and T3 (:138) also failed. 3 passed, 3 failed.
- **M-2:** T2 at :121. It read W-1 where W-2 was expected. 5 passed, 1 failed.
- **M-3:** T3 at :138, native, for `Int8`. It read the repeat detail. 5 passed, 1 failed.
- **M-4:** T4 at :160, where the open of `Int8` was refused with "null in 0 of 100 rows". T5 also failed at :178. 4 passed, 2 failed.
- **M-5:** T5 at :178 ("null in 1999 of 2000 rows"). T2 also failed at :121 ("2 of 100"). 4 passed, 2 failed.
- **M-6:** T6 at :200 (`negative value (-1)`). It read W-1. 5 passed, 1 failed.
- **M-7:** T7 at identity_null_refusal_scan_count.rs:48. The assertion printed left 2, right 1. 0 passed, 1 failed.
- **M-8:** K1 at skp_admission_remediation.rs:740 (the code was `engine.query`, not `engine.identity_unusable`). K2 at :762, the `expect` of the open, refused as `engine.query`. 12 passed, 2 failed.
- **M-9:** T3 at :147, F-3d, for `Int8`. The assertion printed left `file:id`, right `mapped:parcel_key`. 5 passed, 1 failed.

**Reverts:** each run reverted with `git checkout -- engine/src/dataset.rs`, and the log shows "porcelain after revert: []". `git -C D:/wt/nullname status --porcelain` run separately after each mutation printed nothing (rc 0, 0 lines).

## 4. The suites at the head

D:/wt/nullname-logs/rr-suites.sh ran in one shared hold. Its summary is rr-suites-summary.txt, with head 6e5a0b83, and the tree was clean afterwards.
- `cargo test --locked -p spatial-engine -p spatial-kernel -p spatial-skp`: rc 0. Summed over 131 `test result` lines: 1131 passed, 0 failed, 69 ignored. T1 to T7, K1 and K2 are each "ok".
- `cargo fmt --all -- --check`: rc 0, with empty output.
- verify-cites: rc 0, PASS over 3813 files, 240 advisories.
- verify-quotes: rc 0, PASS (161 checked, 130 verified, 30 baselined, 0 hash errors, 948 ruling cites resolved).
- verify-plan (`scripts/plan/verify.mjs`): rc 0, PASS.
- verify-test-claims: rc 0, PASS (971 claimed tests).
- verify-mutation `--base f7770e1a… --head HEAD`: rc 0, PASS ("all 9 new test(s) have a recorded mutation naming them"). This checks that each mutation is recorded. It is not an observation of a mutation; check 3 is.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 623 tests, 623 pass, 0 fail.
- **CI at 6e5a0b83** (`gh run list --branch …`): every workflow completed success on both push and pull_request, Product CI (Rust workspace) included.

No clippy was run and no app was started.

## 5. The words

- I sliced W-1 and W-2 from form lines 124 and 125 on main with sed and ran `grep -cF` for them in dataset.rs: W-1 as a quoted literal printed 1, and `"{w1}` followed by the W-2 continuation printed 1.
- The words sit at dataset.rs:2179 (W-1) and :2183 (W-2). They match byte for byte, including the placeholders, whose local names are `nulls`, `rows`, `present` and `distinct`.
- The form's wording equals ADV-2026-11-26-05 item 1 as filed (I read the ruling file).
- The choice between the two is the form's: W-1 when `distinct == present`, W-2 otherwise (§2.1, OPEN-A3 (A)).
- The clause bindings hold in the code: `nulls = rows - present` (:2177), rows is `count(*)`, present is `count(c)`, and distinct is `count(DISTINCT c)`.
- Neither word set states a consequence outside the engine. The Display (error.rs:389-393) wraps the detail after "cannot serve as stable feature identity —".
- I found no clause untrue.

## 6. Block on sight (§9)

All nine items hold; none is violated.
1. **No second statement or pass.** There is one `format!` SQL (:2129-2134) and one `execute_guarded` with one `fetch_add` (:2148-2153). T7 is green.
2. **No new variant, wire code, field, literal or wire fixture.** The error.rs diff is doc-only, and `git diff --name-only … -- protocol/` printed nothing.
3. **No changed repeat or negative detail.** The format strings at :2164-2166 and :2195-2198 are unchanged context lines, and T5 pins the repeat detail byte for byte.
4. **No refusal by schema nullability.** The refusal is `if nulls > 0` (:2178). M-4 proves T4 catches the nullability version.
5. **No placeholder mark or code before the words.** The diff grep for `placeholder` or `[W ` gave rc 1. The form was added at 3673ff0f (2026-11-26) with Amendment 1 item 2, and the first code commit is d48e3235 (2026-11-27).
6. **No path outside §7:** see check 1.
7. **Base.** The text-id head b7a3dae6 is an ancestor of f7770e1a (`merge-base --is-ancestor`). The recovery head 97e2156d is not an ancestor of the base, and 65 recovery commits lie outside the base.
8. **No change to the skip, session-ordinal, not-addressable or set-aside arms, or to the cancel guard:** the diff hunks are only at :92, :2120-2143, :2158, :2173-2191 and `run_identity_scan`.
9. **No red is a compile error.** This rests on the worker's red-engine.log and red-kernel.log, which show assertion failures for T1, T2, T3 and K1 and guards that are ok. I did not re-run the red commit, because the brief allows no checkout.

## 7. Seams and guarantees (§10)

- All nine tests are present, green at the head (check 4), and red under their own mutations (check 3).
- **K1** goes through `SkpHost::open_dataset(OpenDatasetRequest)`, which returns `Result<_, SkpError>`. It reads the real refusal fields `err.code`, `err.fields` (a `BTreeMap<String,String>` in protocol/skp/src/v0/error.rs:17-22) for "column" and "detail", and `err.message`.
  - On the producer side, `error_of` at kernel/src/skp.rs:2248-2265 maps the variant to `identity_unusable` with `column`, `detail`, `candidate_columns` and `identity_source`.
- **K2** uses the existing helper `set_aside_req` (`set_aside_file_id: true`), then `SkpHost::describe`. It reads the real wire shape through `serde_json::to_value(&described.identity)`, the pattern the file already uses at :565.
  - This JSON is the test's view of a control-plane describe, not a data path.
  - The engine half is `set_aside_outcome` (dataset.rs:2224-2242), which maps any `IdentityUnusable` to the session tier.
- **ADR-016 and the engine-facts rule:** both refusals stay `IdentityUnusable`. Only `detail` is new.

## 8. ADV-2026-11-27-43 item 3

- **Command:** `git diff --name-only f7770e1a...HEAD -- protocol/` printed 0 lines. No type in protocol/ gains a member.
- **protocol/ literals the diff adds:** I grepped the added lines for protocol type literals. There is exactly one: `DescribeRequest { skp, dataset }` in K2 (kernel/tests/skp_admission_remediation.rs, at about :764). It uses both of the type's current members (protocol/skp/src/v0/commands.rs:87-90).
- The `OpenDatasetRequest` values come from the existing helpers `open_req` and `set_aside_req` (:63-77 and :522-527). The diff adds no `OpenDatasetRequest` literal.

## 9. The worker's departures

None of them touches a result:
- **Trailers and sign-off:** a record matter only.
- **The words sliced by script:** check 5 confirms them byte for byte.
- **Amendment 3's pairs read as form text:** its assertions and M-9 are present.
- **M-4 also fails T5:** I see the same. It comes from the fixtures' `id` field reading back as nullable, and T4 still fails by name.
- **The `LodRefused` "four" left in place:** fixed afterwards in 6e5a0b83 (D2).
- **The fixture at 164 lines against an estimate of about 120:** the total is 545, under the ceiling, so no class 8.
- **The enum names:** recorded by Amendment 6 item 4.
- **The red logs:** these are the worker's evidence and I did not re-run them. The guards' proof is their mutations, which I re-observed.

## 10. The named posture check (ADV-2026-11-26-18 item 3)

The piece changes none of the following:
- **Network access or a listening socket.** I grepped the added lines for TcpListener, TcpStream, UdpSocket, socket, `.bind(`, listen, http, reqwest, hyper and tokio::net. The one hit is the doc comment "from a consumer's side" in error.rs.
- **How the data plane admits a consumer.** The same grep for data_plane, DataPlane and consumer found only that doc comment. No kernel/src file changed.
- **Any file under capabilities/.** `git diff --name-only … | grep -ciE 'capabilit|Cargo|package'` printed 0. The tracked capabilities files are frontends/shell/src-tauri/capabilities/default.json and the spike's, and neither is touched.
- **Any dependency.** The same diff check shows no Cargo.toml, Cargo.lock or package file touched.
- **Security posture:** unchanged. This rests on the lines above and on the diff touching only engine/src (dataset.rs, error.rs, and fixture.rs behind `#[cfg(feature = "fixture")]` per engine/src/lib.rs:110-111) and test files.

## Findings

### Correctness
None.

### Evidence
None.

### Documentation (each must be fixed before the merge)

**D1. PR 371's body is stale.**
- `gh pr view 371` shows "Three commits" listing d48e3235, 69e36325 and f6614e15, and says the gates are "still to run".
- It does not name 6e5a0b83 or list the architect's D1 words applied to the `LodRefused` doc with no re-gate, which §31 requires the PR body to list.
- The fix is the PR body only. No code changes.

**D2. The record does not yet cover 6e5a0b83.**
- Its `LodRefused` doc edit (error.rs:140-141, from "`IdentityUnusable` above … ADR-016's four" to "below … ADR-016's identity refusals") is outside §2.2's letter. §2.2 names only the `IdentityUnusable` doc, though the "four" was made untrue by this piece.
- §7's count at the head is 545, not Amendment 6 item 3's 541.
- The next amendment should record 6e5a0b83, its scope as a §2.2 consequence, and 545/6 at 6e5a0b83, as references.
- No code change.

**D3. A comment states something untrue about the counts.** These are the worker's words, not ruled, so I propose replacements.
- **File:** engine/src/dataset.rs:2127-2128. As written, "the two counts" most naturally means `count(*)` and `count(DISTINCT c)`, the two counts the sentence just named, and those differ by the nulls and the repeats together.
- **Old** (`grep -cF` printed 1): `nulls: the two counts differ by the nulls, which are refused by name below.`
- **New:** ``nulls: `count(*)` and `count(c)` differ by the nulls, which are refused by name below.``
- **Clause check:**
  - `count(*)` is `rows` (index 0) and `count(c)` is `present` (index 4).
  - Their difference is `nulls = rows - present` (:2177).
  - "Refused by name below" is the `if nulls > 0` arm (:2178-2191).
- If the new words push the line past 100 columns, rustfmt will not reflow a comment, so wrap it by hand.
- The correction changes a comment only, not code behaviour. Under the house rule it gets the reviewer's narrow read, because it touches a .rs line.

**Files (absolute):**
- D:/wt/nullname-logs/rr-suites.sh, rr-suites-summary.txt and rr-check-*.log
- D:/wt/nullname-logs/rr-mut.sh, rr-show.sh, and rr-mut-M-1.log to rr-mut-M-9.log
- D:/wt/nullname/engine/src/dataset.rs
- D:/wt/nullname/engine/src/error.rs
- D:/wt/read-1127c/governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md
