*Custodian's filing note (2026-09-26): the reviewer gate's attempt-1 report for PLAN node `bundle-viewer-partition-offset-bounds` at 874c72f, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

## 1. Verdict: FAIL, on the record only

The code, the tests, the fixtures, the pre-fix run, M0–M10, the KNOWN-LIMITATIONS item and every check pass. The failures are three defects in the amendments' record at `874c72f`. All three are fixable in one record round, and none needs a code change.

## 2. Blocking findings

**R1 — Amendment 1 cites a line in the ledger.**
- Rule: round 12 clause (a), with round 14 clause (a′), which says no ledger passage is pinned by path:line plus hash. The gate fails by name "a line cite into `DECISIONS-PENDING.md`".
- Location: `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md:253` carries ``The ruling: `DECISIONS-PENDING.md:40 @ e562e9b sha256:d76437e5265f90d440335107e1ea8d51d47126538e485437ee1f230714331b88`.``
- The hash itself is correct. The form is what fails.
- Fix: the reference is the ruling's round and item, "RULED 2026-09-26, question round 25, item 4". The amendment's heading already carries it, so drop the pin.

**R2 — Amendment 2 row 3 states a tool's behaviour without naming the tool's commit.**
- Rule: round 15 item (c). The gate fails by name "a tool claim without the tool's commit".
- Location: `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md:264` carries `that tool checks a record exists and runs no mutation`.
- The claim is true today: `scripts/plan/verify-mutation.mjs`'s module doc discloses that it "does NOT run the mutation". But no commit is named.
- Fix: drop the clause, or name the tool's commit. `7d24ed1`, on main, is the last commit touching that file.

**R3 — the closing amendment restates in prose what its references already carry.**
- Rule: the record cap directive of 2026-09-18. A closing amendment is references and hashes, and the gate fails by name "prose that restates a claim a reference could carry".
- Row 7, at `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md:268`, carries `F3 is built by write-then-patch at a differential location, as F5 and F6 are, and two IPC-writer behaviours are documented in the test file's module doc`. That restates its own reference, worker report lines 28–32, line 32 specifically.
- Row 3's `reworded at `aaa6020` so that `verify-mutation` finds each record` restates worker report line 14. Row 1's line 14, not row 3's own cite (worker report line 20), carries it.
- Fix: reduce both rows to their references.

## 3. Pre-fix run (the tests at `d986725` against the unfixed `partition.ts`)

The unfixed file is blob `a571b94`, the same as the base. Node v24.18.1. rc=1, 1 pass and 10 fail.

| Test | §5 prediction | Observed |
|---|---|---|
| T0 | pass | pass |
| T1 | fail, no exception | fail, `Missing expected exception.` |
| T2 | fail, no exception | fail, `Missing expected exception.` |
| T3 | fail, no exception | fail, `Missing expected exception.` |
| T4 | fail, no exception | fail, `Missing expected exception.` |
| T5 | fail, no exception | fail, `Missing expected exception.` |
| T6 | fail, no exception | fail, `Missing expected exception.` |
| T7 | `TypeError` on `children` | `TypeError: Cannot read properties of undefined (reading 'children')` |
| T8 | `TypeError` on `values` | `TypeError: Cannot read properties of undefined (reading 'values')` |
| T9 | `TypeError`, BigInt conversion | `TypeError: Cannot convert a BigInt value to a number` |
| T10 | `TypeError` on `values` | `TypeError: Cannot read properties of undefined (reading 'values')` |

Every prediction held, and no falsifier fired. The test code at `d986725` equals HEAD's apart from comments, and `partition-entry.mjs` is unchanged.

## 4. M0–M10, my run at `874c72f`

`src/partition.ts` at HEAD is the same as at `a411fc4`. I applied each mutation by script, ran `node --test scripts/partition-bounds.test.mjs`, then reverted with `git checkout`. Every run had rc=1, and `git status --porcelain` was empty after each revert.

| Mutation | Applied as | Only failing test | Error |
|---|---|---|---|
| M0 | B4 `<=` changed to `<` | T0 | `BundleFailure: partition-decode-failed (data/part-00000.arrows): ring offsets end at 14, past the coordinate-pair count 14` |
| M1 | B4 deleted (lines 240–246) | T1 | `Missing expected exception.` |
| M2 | B3's monotone loop deleted (231–239) | T2 | `Missing expected exception.` |
| M3 | B2 deleted (215–221) | T3 | `detail "ring offsets decrease at ring 3: 12 then undefined" does not include "polygon offsets"` |
| M4 | B1's monotone loop deleted (206–214) | T4 | `Missing expected exception.` |
| M5 | B1's start clause deleted (199–205) | T5 | `detail "ring offsets start at undefined, below 0" does not include "polygon offsets"` |
| M6 | B3's start clause deleted (224–230) | T6 | `Missing expected exception.` |
| M7 | G1 deleted (153–159) | T7 | `expected a BundleFailure, got TypeError: Cannot read properties of undefined (reading 'valueOffsets')` |
| M8 | G2 deleted (161–167) | T8 | `detail "geometry column: the coordinate values are not float64" does not include "ring level"` |
| M9 | G3 reduced to `coordValuesCandidate?.values === undefined` | T9 | `expected a BundleFailure, got TypeError: Cannot convert a BigInt value to a number` |
| M10 | G3's `?.` changed to `.` | T10 | `expected a BundleFailure, got TypeError: Cannot read properties of undefined (reading 'values')` |

Each mutation fails exactly its row's test, matching §5, and every per-test record in the test file matches what I saw.

## 5. Hash table

Each hash was recomputed with `git show <rev>:<path> | sed -n '<a>,<b>p' | sha256sum`. All revs used here (`e562e9b`, `02ec6a3`, `b391e43` which is tag v0.1.0, and `515a8b3`) are on main.

| Row | Reference | Recomputed | Match | Span covers the claim |
|---|---|---|---|---|
| A1 | `DECISIONS-PENDING.md:40 @ e562e9b` | d76437e5… | yes | yes, the round 25 item 4 ruling (form fails, R1) |
| 1 | worker report 9-14 @ e562e9b | be1222e5… | yes | yes, the commit list |
| 2 | worker report 16 @ e562e9b | 90435540… | yes | yes. It says it ran `a411fc4`'s tests against the unfixed code; the test code equals `d986725`'s |
| 3 | worker report 20 @ e562e9b | 3372fd31… | yes | yes, but its parenthetical names B3 as what catches M8, and my run shows G3 (see S1) |
| 4 | acceptance record 42-56 @ 02ec6a3 | 61d2f690… | yes | yes: the manifest hash, rc 0 with verdict `rendered-and-hover-resolved`, and the artifact's sha256 |
| 4 | the artifact `.json` @ 02ec6a3 and @ origin/main | 6c47cc8e… | yes | — |
| 4 | worker report 22 @ e562e9b | 4de27649… | yes | yes, no artifact kept |
| 5 | `partition.ts:1-226` @ b391e43 and @ 515a8b3 | 72c4a895… for both | yes | yes. Both files are 226 lines, blob a571b94, which is also the pre-fix blob |
| 5 | `main.ts:478-479` @ b391e43 and `main.ts:577-578` @ 515a8b3 | 034c96d5… for both | yes | yes, the `load().catch` routing to `unhandled-error` |
| 6 | worker report 26 @ e562e9b | 8ef69629… | yes | yes |
| 7 | worker report 28-32 @ e562e9b | 4dac4b78… | yes | yes (prose restates it, R3) |

- **Row 6** (`git diff --numstat origin/main...HEAD`): `partition.ts` 85+4=89; the two scripts 588+8=596; `KNOWN-LIMITATIONS.md` 12+0=12; 4 files in Scope besides the preregistration. All match.
- **Row 5, the v0.1.0 check, holds:** the partition walk has no bounds checks at v0.1.0, and `main.ts` routes a raw exception to `unhandled-error`. `main.ts` at HEAD is the same blob as at the base (154c77b).

## 6. Checks, each with its rc

Everything below ran at `874c72f`. The worktree was clean after each.

| Check | rc | Result |
|---|---|---|
| `npm run verify` (renderer/bundle-viewer) | 0 | 80/80 |
| partition-bounds tests at `d986725`, pre-fix | 1 | 1 pass, 10 fail, as §5 predicts |
| `verify-cites.mjs` | 0 | PASS |
| `verify-quotes.mjs` | 0 | PASS, 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | PASS |
| `verify.mjs --offline` | 0 | PASS |
| `queue.mjs --check` | 0 | current |
| `site.mjs --check` | 0 | current |
| `verify-mutation.mjs --base origin/main --head HEAD` | 0 | 11/11 recorded |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 311/311 |
| CR bytes in all 11 changed files, working tree and `HEAD:` blobs | — | 0 |

**The fix against §2:**
- **Placement:** G1–G3 sit at the lookup site (`partition.ts:152-177`). B1–B4 come right after the row-count check (`:193-246`), before the projection at `:248` and the walk at `:272`, and they run in §2b's order.
- **Fail-closed:** every comparison is written `!(a <= b)` or `!(a >= 0)`.
- **Detail strings:** all eleven §2e strings are byte-exact.
- **Refusal state:** the only new state is `partition-decode-failed`, and there is no new try/catch.
- **Exports and `dist/`:** there is no new `src/` export. `build.mjs` builds only `src/main.ts`, and the test entry lives under `scripts/`.
- **§2f doc comment:** it matches the code order.
- **§2g:** no §2g file is touched.
- **§2c:** holds. `render.ts:341-343` and `:425-427` read the same arrays over the same ranges.
- **The seam:** the caller at `main.ts:560` passes the six arguments the tests pass.

**Fixtures:**
- F0–F10 each carry a self-check.
- F3, F5 and F6 are located by differential location: exactly one differing byte is asserted, and the patch lands at ±4 from it with no hard-coded position.
- The claim about the apache-arrow 18.1.0 writer's `addBuffer` (`node_modules/apache-arrow/visitor/vectorassembler.mjs:83-89`) checks out.

**§8, item by item:**
- Item 1: no timing figure in the diff, the commit messages or the amendments.
- Items 2–8 and 10: clear. PLAN, queue and site are custodian and merge regeneration, which the brief expects.
- Item 11: filed.
- Item 9, mechanics: the item sits directly after item 16 at `C:\dev\wt\viewer-offset-bounds\KNOWN-LIMITATIONS.md:163`, as a pure insertion (12+0). Nothing is renumbered or merged, and the DRAFT marker is present.

**Item 9, "sandboxed as any website is" (my reading; the wording is the human's):**
- The phrase is the human's own, from the round 25 item 4 ruling.
- My reading: it does not claim any published bundle is fixed or safe. It frames a bundle as untrusted code. The same sentence tells readers to open bundles only from sources they trust, and the next sentence says bundles already published keep the stall.
- One risk to name at the PR: the phrase can be read as reassurance. It is also an unproven statement about the context the viewer runs in, since same-origin serving or `file://` changes what the sandbox isolates.

## 7. Suggestions and nits

Suggestions:
- **S1:** row 3 cites the worker's summary at report line 20, which says B3 catches M8. My run and the test's own record at `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\scripts\partition-bounds.test.mjs:561-565` show G3. Since my run is the observation of record, consider dropping the worker-summary cite when fixing R3.
- **S2:** the acceptance record row 4 cites has a build-time figure at `state/consults/2026-09-26-partition-offset-bounds-acceptance.md:40`. It is on main, outside the cited span and outside this diff, so it is not a §8 item 1 hit. Keep future cites off that line.
- **S3:** the declared §3 values changed for F0 (a third, empty feature), F3, F5 and F6. The self-checks assert the actual values, but row 7 names no fixture. Pointing row 7 at the test file's module-doc span with a hash would fix R3 and this together.
- **S4:** the test module doc at `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\scripts\partition-bounds.test.mjs:16-17` says neither IPC quirk is true of a real kernel-written partition, and cites nothing. Cite the acceptance run or soften it.
- **S5:** Amendment 1's parentheses paraphrase the ruling. The record cap favours a bare reference.

Nits:
- **N1:** `partition-bounds.test.mjs:243-247` documents parameters (`differAt`, `basePatchIndex`) that the function does not have.
- **N2:** `partition-bounds.test.mjs:83-85`, the doc on `idValues`, is garbled.
- **N3:** F9's self-check asserts only the leaf type.
- **N4:** §7's `budget_minutes is 120` is a planning figure. My reading is that it is not a §8 item 1 figure.

## 8. Gate-log note

Reviewer gate, attempt 1, at `874c72f` (`viewer/partition-offset-bounds`), verdict FAIL on the record only. The code, tests and evidence all pass:
- the pre-fix run at `d986725` matches §5 (1 pass, 10 fail, each error class as predicted);
- all eleven tests pass after the fix, and `npm run verify` is rc 0 with 80/80;
- the reviewer's own M0–M10 run fails exactly the named test each time, with a clean revert after each;
- every Amendment 2 hash and the artifact's sha256 recompute exactly, the numstat figures match, and the v0.1.0 check holds;
- the governance checks and the scripts suite (311/311) are rc 0, and there are zero CR bytes.

The three blocking findings are record defects: R1, Amendment 1's line cite into `DECISIONS-PENDING.md` (round 12 (a) and round 14 (a′)); R2, row 3's statement about `verify-mutation` with no commit named (round 15 (c)); and R3, rows 3 and 7 restating in prose what their references carry (the record cap directive of 2026-09-18). This is the piece's first record round. On item 9, the reviewer reads "sandboxed as any website is" as the human's own words and not a claim that anything is safe; the final wording is the human's at the PR. The worktree was left clean at `874c72f`. The two node.exe processes running on the machine belong to a Codex runtime started 2026-09-25 and were left alone.
