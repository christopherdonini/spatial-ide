Reviewed: PR #264 at a45c206d34c0e367c8e8df2251fcafa1bbafd590, gate 1, architect (cut/first-batch-factorial-ignored-trace-tests @ a45c206d34c0e367c8e8df2251fcafa1bbafd590)
Verdict: PASS WITH NOTES

I have no shell, so I computed no sha256. That covers the brief's own hash, any span hash, and the numstat. I read the head file in the worktree `C:/dev/wt/fbf`. I could not read B (8d8d412e) through git history, so I used main's working tree (b4e7e27c, no tracked changes) as the base's copy of `kernel/tests/first_batch_factorial.rs`. Its line numbers agree with the form's pins (the first test at :1299-1302, the H5 test at :1433, 1778 lines). Cites below marked "head" are at a45c206d. Cites marked "main" are at b4e7e27c.

## Findings by class

**Correctness:** none.
**Evidence:** none.
**Documentation (must fix before the merge, no re-gate):**

D-1. The RECORDED MUTATION line at head kernel/tests/first_batch_factorial.rs:1299 says `` `--ignored --exact`, each test alone. ``, but only one test was observed. Lines 1301-1302 then say the H5 test was not run. So the sentence names "each test" under an observation that covered one. The H5 reading is disclosed, so this is a precision defect, not an unsupported claim.
- Replacement words: change "each test alone." to "each run alone." The rest of line 1299 is unchanged.
- Clause check: "each run alone" means the unmutated run and the M-1 run each selected one test by `--exact`, each in its own shared hold. The build report says the same at its "Observation" lines 27-33 (filed copy). The line becomes 98 columns, so it stays under 100, and the line count stays 30 of 40.
- Not the human's wording. It is the worker's fill of the architect's W1 placeholder. The worker applies it with no re-gate, and the PR body lists it.

## Check 1: the five lines against the head

- **Authority:** the PLAN node exists on main at PLAN.yaml:4505-4521: `generation: 2`, `budget_minutes: 60`, gate = this form, evidence = the branch. Holds.
- **Scope:** one file.
  - The lock, its accessor and the doc are at head :1281-1307. They sit after `the_5gb_clustered_cell`, which closes at :1279, and above the first test's doc at :1309.
  - `let _serial = serial();` is the first statement at :1330 and :1465.
  - Line count: the doc is 22 lines (:1281-1302), plus the static (1), a blank (1), the fn (3) and a blank (1), which makes 28; the two statements make 30. That equals the reported numstat `30 0`, which the custodian checked by git. I cannot run git.
  - Zero deletions, and all 30 insertions are in the declared items. So no assertion, message, name, `#[ignore]` reason, fixture path or constant changed.
  - Cross-check: the line offsets are consistent. Main :1300 maps to head :1328 (+28), main :1433 to head :1462 (+29), main :1561 to head :1591 (+30), and main's last line 1778 to head 1808.
  - 30 is under the declared 40, so there is no §7 overrun (round 25, item 2).
- **Change:**
  - `static TRACE_SERIAL: std::sync::Mutex<()> = std::sync::Mutex::new(());` and `TRACE_SERIAL.lock().unwrap_or_else(|e| e.into_inner())` (head :1303-1307) match the sibling's shape at main kernel/tests/wire_bytes_invariant.rs:183-187.
  - A Grep finds no `drop(_serial)`. The named binding therefore lives to the end of each body.
  - Neither item is `pub`, and there is no cross-module seam.
- **Tests+mutation:**
  - There is no new test.
  - M-1 is recorded with the 40-hex code commit 3c8e91f634246b620e8346b2d34acca597a6385e (head :1296-1300).
  - No record calls a verify-mutation run an observation.
  - Observation and code: the head differs from the observed code commit only by the 8 doc lines :1295-1302. The stop report says the code commit's doc was 14 lines (:1281-1294), and 22 - 14 = 8, matching 30 - 22 = 8. So the code that was observed is the head's code.
  - The failure location fits the start's `expect`. The build report gives `first_batch_factorial.rs:1348:10`. That is the code commit's `.expect("no other trace is running")` line (head :1354 minus the 8 doc lines = :1346) plus M-1's 2 added lines. Column 10 is where `expect` begins.
- **Out-of-scope:** see check 4.

## Check 2: the words

- **W1:** I compared it word for word against note 1's blockquote. It matches at head :1281-1294; only the wrap differs from line 3 on, which the stop report discloses.
- **Clause check at the head and main:**
  - "one flag and one slot … refuses a second trace": engine/src/trace.rs:88, :98 and :329-333 (main). Holds.
  - Child process per factorial trial: the only `trace::start` calls in the file are head :510 (inside `run_one_trial`, reached from `night_trial_child`, which is env-gated at :446-449), :1350 and :1485. Holds.
  - "first statement … to the end of its body": head :1330 and :1465, with no explicit drop. Holds.
  - Locals drop in reverse order on a panic, so the guard stops the trace first: `guard` is scoped inside the loop, after `_serial`. Its Drop clears both the flag and the slot (main trace.rs:353-358). Holds.
  - "other ignored passes run unserialised": the `#[ignore]` lines at head :767, :1047 and :1591 belong to bodies that take no lock. Holds.
  - RESULTS.md commands with `--exact`: main kernel/RESULTS.md:3560 and :4653-4654. Holds.
- **The record commit's filled places:**
  - The code commit: the full 40-hex id. Holds.
  - The outcome: the unmutated pass and the M-1 failure by name with its message, both consistent with the build report. Holds.
  - The H5 reading is stated as "a reading, not an observation" (head :1301-1302). Holds.
  - One defect: D-1 above.

## Check 3: Amendment 1 and the route

- **The hash and size agree everywhere:**
  - S's full sha256, fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a, and its 151629665 B appear in Amendment 1.
  - The same figures are in the entry point's run report (`state/consults/2026-10-27-fixture-s-regeneration-entry-point-build-worker-report.md`, its lines 26-27).
  - The full hash matches the constant at main engine/tests/import_layout_fixtures.rs:79-80.
  - The 16-hex prefix matches main kernel/RESULTS.md:2988.
  - The worker found the same full hash on the source and on the export's copy before any run (build report, lines 20-21).
- **The ruling:** Amendment 1 follows the human's ruling of 2026-10-28, item 2 (the source path, the copy at the main checkout, the full hash re-checked, nothing freed on C:). I make no finding on the ruling itself.
- **OPEN-2 (B):** the settlement's fallback is "only the first test is observed and the second's mutation is recorded as a reading, never as observed". The route consult (`state/consults/2026-10-25-first-batch-factorial-ignored-trace-tests-fixture-s-route-architect.md`, R1/R3b) has H5 follow the (B) fallback with S present. That is what was done: S was present, H5 was absent, test 1 was observed and test 2 is a reading. Holds.
- **The settlement's other terms:**
  - Separate cargo targets: the export used `D:/wt-targets/fbf-export-target`, and its sources were touched before the first run.
  - No timing miss, so no re-run was owed.
  - The disk floor was checked: 143G free on D:.

## Check 4: out of scope

- **ADR:** no status line or amendment.
- **Security:** nothing.
- **Wire:** nothing under protocol/, and no literal or message text changed.
- **Guarantee:** no assertion, message or fixture path changed (check 1). The lock is taken before each trial loop, outside the timed `requested` Instant and the trace segment (head :1371-1385, :1506-1520).
- **No figures:** the record states no figure, in line with note 2's "May not claim: … any timing". The H5 M-1 is disclosed as a reading.
- **Round 25, item 2 and the form:** no scope addition, and no verify-mutation run is called an observation. The test-text record names its commit id, and the commit is not pinned by hash. The five-line form stands under §36.

## Check 5: the worker's disclosures

- **Unmutated pass stated without figures:** this is correct under note 2's "may not claim" list. It does not bear on the evidence.
- **Busy-wait loop killed by its own PID (46044):** this was a wait on a log, not on a test process. The custodian's transcript check shows the two taskkills and no other heavy call outside a hold. It is machine hygiene and does not bear on the evidence.
- **verify-quotes:** the full run timed out, and the run on the changed file reported 0 checked. The diff carries no verbatim passage, because W1 is the architect's words and is not presented as a quote. I could not run the tool. No bearing.
- **39 clippy warning headers, not diffed against the base:** the one warning reported for this target is at kernel/tests/support/mod.rs:342, outside the diff. The added items repeat the sibling's shape, which compiles in that file. No bearing on the evidence or the words. The worker's "pre-existing" is unverified for the other 38, and the worker discloses that itself.

## Not run

- git numstat, sha256 and diff (no shell; I used the custodian-checked numstat and checked it by counting lines).
- `verify-quotes` and `verify-cites` (no shell).
- The worker's raw logs `fbf-w-*`, which are in the worker's scratch folder and were not provided.

Paths read:
- C:/dev/wt/fbf/kernel/tests/first_batch_factorial.rs
- C:/dev/spatial-ide/kernel/tests/first_batch_factorial.rs
- C:/dev/spatial-ide/kernel/FIRST-BATCH-FACTORIAL-IGNORED-TRACE-TESTS-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-25-first-batch-factorial-ignored-trace-tests-worker-stop-report.md
- C:/dev/spatial-ide/state/consults/2026-10-28-first-batch-factorial-ignored-trace-tests-build-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-25-first-batch-factorial-ignored-trace-tests-fixture-s-route-architect.md
- C:/dev/spatial-ide/state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md
- C:/dev/spatial-ide/state/directives/2026-10-28-o1-p3-accepted-one-explain-6b-takes-s-from-6d-262-stands-8a-goes-ahead.md
- C:/dev/spatial-ide/kernel/tests/wire_bytes_invariant.rs
- C:/dev/spatial-ide/engine/src/trace.rs

Grep only:
- C:/dev/spatial-ide/kernel/RESULTS.md
- C:/dev/spatial-ide/engine/tests/import_layout_fixtures.rs
- C:/dev/spatial-ide/PLAN.yaml
- C:/dev/spatial-ide/state/consults/2026-10-27-fixture-s-regeneration-entry-point-build-worker-report.md
