*The trial build worker's second report for the node property-testing-trial-proptest-and-fast-check (PR 353, branch cut/property-testing-trial, pushed at 8fd35b28573d33f0b56455264c948a4f72f1e1f9), after its continuation brief, filed by the custodian byte for byte below the rule from the second hand-back in its transcript: 7930 bytes, sha256 c7317cd003acf6743e1c4879c9b9e1f18330f9cb5a61b6097aac34a4b740ef97. Its run after the first hand-back: Read 1, Bash 23, Write 5, SubagentHandback 1, by unique call ids; one Bash call errored, exit code 101, break (c)'s red run; claude-sonnet-5-5; first record 2026-11-22T12:09:42Z, hand-back 2026-11-22T12:22:37Z; no compaction; no call named the main checkout. Its first report is `state/consults/2026-11-22-property-testing-trial-build-worker-report-1.md`. The CI-timings commit of section 5 is owed to a later dispatch (Amendment 2 item 4). Unverified by any gate until the code gates.*

---

Done: property-testing-trial-proptest-and-fast-check pushed at 8fd35b28573d33f0b56455264c948a4f72f1e1f9, the P3 commit. This covers the continuation only; the CI-timings commit of §5 is not done, see the end. The push printed `90bdeab7..8fd35b28  cut/property-testing-trial -> cut/property-testing-trial`. After it, `HEAD` and `origin/cut/property-testing-trial` both resolve to that id and `git status --porcelain` prints nothing.

**Why break (b) printed no `cc` line (your item 3)**
- P2's persistence file is one file for every test in `wire_properties.rs`.
- Break (b)'s two failing tests replayed the line break (a) had saved (`cc cdb889a5…`).
- They failed on it and had nothing new to save.
- Proptest printed a seed on its first break run (P2's break (a)). fast-check printed seed and path on P1's first break run. Neither library failed to print a seed.
- I did not re-run break (b) and did not empty or edit the persistence file.

**Continuation steps, in order**
1. Green after break (b)'s revert: `src/wire.rs` showed a 0-byte diff and the four P2 tests passed (`cargo_rc=0`, `4 passed`).
2. Break (c): the anchor `p.extend_from_slice(&(params.len() as u32).to_be_bytes());` was replaced by `p.extend_from_slice(&(params.len() as u32).saturating_sub(1).to_be_bytes());`.
   - Red by name: `c_a_framed_start_reads_back_as_written` failed (exit 101). The other three passed.
   - Printed, byte-copied:
     ```
     Test failed: assertion failed: `(left == right)`
       left: `Some(("", []))`,
      right: `Some(("", [0]))` at protocol\data-plane\tests\wire_properties.rs:136.
     minimal failing input: op = [], params = [
         0,
     ]
     	successes: 0
     ```
   - It failed on the replayed line (`successes: 0`). No new `cc` line was saved and the file was unchanged.
   - I reverted the break (0-byte diff) and the green run gave 4 passed, `cargo_rc=0`.
3. P2 commit: `bb0de262ae9bb1e348e15c25ae459cb334d36aa3`, subject `test: the data-plane wire properties, no panic on bounded bytes and round trip`. It holds `protocol/data-plane/tests/wire_properties.rs` and `protocol/data-plane/proptest-regressions/wire_properties.txt` only. Committer time `2026-11-22T13:16:18+01:00`.

**P3**
- Commit `8fd35b28573d33f0b56455264c948a4f72f1e1f9`, subject `test: the shell frame decoder returns the frames written however the bytes are chunked`. It holds `frontends/shell/src/streaming/wire.property.test.ts` (94 lines) only. Committer time `2026-11-22T13:18:19+01:00`.
- Green: 1 test, `tsc --noEmit` rc 0. A temporary counter showed 200 runs, 108 of them with counted copies; the counter was removed.
- Break (a): the anchor `else this.chunks[0] = c.subarray(take);` was replaced by `else this.chunks[0] = c;`.
  - fast-check printed:
    ```
    Property failed after 2 tests
    { seed: -1146851542, path: "1:406:1", endOnFailure: true }
    Counterexample: [{"payloads":[Uint8Array.from([174,59,18,182,60,56,249,101,202]),Uint8Array.from([204,191,161,105,193,115,126,235,30,12]),Uint8Array.from([]),Uint8Array.from([250,225,31]),Uint8Array.from([107,157,32,67,154,150]),Uint8Array.from([101,18,112,175,210]),Uint8Array.from([134,217,40,214,81,112]),Uint8Array.from([28,40])],"cuts":[1]}]
    Shrunk 2 time(s)
    ```
  - The cause printed was `expected [ 'batch' ] to deeply equal [ 'batch', 'batch', 'batch', …(5) ]`.
  - The shrink is weak because the generator uses `chain`. The break is still red by name with a seed and path.
  - Reverted (0-byte diff), then green.
- Break (b): `this.stats.reassemblyCopies++;` was deleted.
  - fast-check printed:
    ```
    Property failed after 1 tests
    { seed: -1722091671, path: "0:0:0:1:1", endOnFailure: true }
    Counterexample: [{"payloads":[Uint8Array.from([])],"cuts":[1]}]
    Shrunk 4 time(s)
    ```
  - The cause printed was `counted reassembly copies: expected +0 to be 1`.
  - Reverted (0-byte diff), then green.
- No failure that was not a deliberate break, in P3 or in the continuation.
- P3's first break run printed a seed, so no stop.

**P1's fixed case:** unchanged from the first report. Frame 1 measured `0.5000000000005775` px, inside Amendment 1's window.

**Count over the eight Scope paths**
- Source lines (`git diff --numstat origin/main...HEAD`, lockfiles excluded): Cargo.toml 1, package.json 1, `recentreBudget.property.test.ts` 176, `wire.property.test.ts` 94, `wire_properties.txt` 7, `wire_properties.rs` 138. The total is 417, under 500.
- The two lockfiles are `Cargo.lock` 62/2 and `package-lock.json` 41/0.
- The paths are exactly the eight Scope paths.

**Suites (exit codes printed with `$?` or an `echo` of `rc`)**

| Run | Exit | Last line |
|---|---|---|
| `cargo test -p spatial-data-plane --locked` | 0 | `test result: ok. 0 passed` for the doc-tests; unit 24, candidate_a 17, no_transport_leakage 4, origin_header_encoding 5, stream_registry_bound 3, `wire_properties` 4 |
| `cargo fmt --all --check` | 0 | no output |
| `npm run verify` in `frontends/shell` (the CI job's own command: typecheck, build, vitest, and the e2e script tests) | 0 | `Test Files  125 passed (125)`, `Tests  1573 passed (1573)`; baseline was 1570, plus 3 new tests |
| `node scripts/plan/verify.mjs --offline` | 0 | `verify:plan PASS` |
| `verify-cites.mjs` | 0 | `verify:cites PASS — every rooted (in-tree) path:line reference across 3572 file(s) resolves. (211 loose reference(s) advised above.)` |
| `verify-quotes.mjs --show-cites` on my three test files | 0 | `verify:quotes PASS — 0 checked, 0 verified, …` |
| `verify-test-claims.mjs` | 0 | `verify:test-claims PASS — all 895 claimed test(s) across 283 file(s) exist or are planned, superseded or withdrawn …` |

**Records you asked me to correct**
- P1's subject is recorded as it stands: `test: the re-centre pixel-budget property on the shell's frame path`, "own" left out. No commit was amended.
- Exit codes in my first report that were read only from the absence of an error are, again, not printed values: both `npm ci` runs (shell and bundle-viewer), the first `vitest` baseline and the post-build rerun, `npm run build`, and the first `cargo test --no-run`.
- Printed values since the continuation began: the green run after break (b), `cargo_rc=0`; break (c)'s run, `cargo_rc=101`; the green run after (c), `cargo_rc=0`; the final suites above.

**Test defects (apart from product defects, per §8)**
- In P1's first red run the test recovered W as `target + origin`. With the broken `toLocal` the "origin moves" precondition failed before (a) was reached. The shrunk counterexample had a vertex equal to W, where the drawn error is zero.
- The deliberate break exposed it. I changed the test to pass W straight to `maybeRecenter`, as the form's Steps say. That first red run is in `<S>/ptr-p1-break-a.log`.
- No product defect in the continuation. The P1 finding of the form's Amendment 1 (strict budget exceeded by 0.0000000000005775 px in the fixed case) is the same as before, derived rather than found by a generated case.

**Departures and notes**
- The first report's isolation re-check was run after the first `cargo test --no-run`, and I did not repeat it.
- `<S>` holds every log, under `ptr-` names.
- Your item 4 lists the CI-timings commit. §5 puts it after the branch's first green CI run, and my brief limits network use to `git fetch`, `gh pr list`, `gh pr view`, the installs, the two dependency additions and the push. So I did not read CI and made no timings commit. It needs a later dispatch, as Amendment 2 item 4 says.
- A cite-checker run flagged `state/drafts/sitting-script-2026-11-24.md` as a loose reference. I did not touch it.
- I read `.claude/agents/worker.md` in the main checkout once in my first run, as you noted. It was not read again.
- Nothing is left running. The one background shell (`npm run verify`) completed and released its hold. Model: Sonnet 5.5 (`claude-sonnet-5-5`), high-effort variant. No context handoff.
