*Custodian's filing note (2026-11-05): the tester's run of U1's reproducer for `publish-session-tier-identity`, on the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`): the node's own test at main 8b9193a1 in the detached worktree C:/dev/wt/u1r, nothing committed before its form. The test file stays untracked there (7932 bytes, sha256 8e9e76596575b81423198a06175d125b1558c843a2126804a400ed54af90755c); the custodian read the two runs' printed lines in the scratch files and found them identical. Its brief by file (sha256 f310f98ebeec210acc0680f4ccc720aab39062c1e65c443d8960dcabb8690229), carrying the human's Part 1 rulings of 2026-11-05 by reference; read at main 8b9193a1. The run 23:13:52Z to 23:28:13Z by its transcript (claude-sonnet-5-5; unique calls Read 6, Bash 20, Write 1, Monitor 1 and the hand-back, 29, equal to the notification's). Extracted by script from the hand-back in that transcript (7005 bytes, sha256 faaefbcafb00b46c738e056cee2c1937cbee8ce194c3f93c4b68830754cd4fc0); one change: the scratch folder's path in its SCRATCH FILES line, a user-profile path, replaced by `<the custodian's scratch folder>`. Graded by the custodian against the human's rule: a bundle published from the session tier with the manifest's uniqueness caveat, in both scopes, so S1. A report, not Authority.*

---

Reproduced: publish-session-tier-identity at 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a

Both scopes published a bundle from the session tier. The manifest keeps the fixed caveat "uniqueness was verified over this file at open". I grade nothing. Both runs passed with rc=0 and the printed lines are identical.

MODEL: the harness reports Sonnet 5.5 (claude-sonnet-5-5). No model override, no context handoff.
BRIEF: its sha256 matched f310f98e...0229, checked before I started.

WORKTREE AT THE START (C:/dev/wt/u1r): HEAD 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a; porcelain empty; .cargo/config.toml sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f.

THE SHELL'S ROUTE at 8b9193a1, and what the test calls
Shell side, in frontends/shell/src-tauri/src/publish.rs:
- prepare_with_progress (line 389):
  - publish::preflight_pinless.
  - ensure_pinned_with_progress (line 1313), which calls Dataset::pin_content_observed.
  - prepare_with_query (line 518), which runs publish::preflight and mints a PublishGrant with SourceScope.content_hash = pre.source_content_hash().
- execute_with_progress (line 718): builds the PublishRequest, opens AuditLog::open_for, uses ShellApproval(typed_phrase), and calls boundary::execute (line 832).
- Open side: SkpHost::open_dataset (kernel/src/skp.rs:1106) calls Catalog::open_cancellable (kernel/src/lib.rs:218) with no CRS assertion and no declared identity.

What my test calls, in order:
1. Catalog::new().open_cancellable("ds_u1r", path, None, None, &CancelToken::new()), then catalog.get.
2. publish::preflight_pinless.
3. Dataset::pin_content.
4. publish::preflight.
5. PublishGrant::new with OperationKind::Publish, SourceScope{"parcels", pre.source_content_hash()}, DestinationScope::exact, and a 600 s lifetime.
6. AuditLog::open_for.
7. PreNamedApproval(<destination basename>).
8. boundary::execute.

Deviations from the shell's route (kernel/tests cannot avoid them without a kernel/src change):
- Open: I call Catalog::open_cancellable directly, so the host's watcher and generation minting are not exercised.
- Pin: I call pin_content directly instead of ensure_pinned_with_progress, which lives in the shell crate.
- Approval: PreNamedApproval replaces ShellApproval. Both feed Approval::new(phrase) into the same comparison.
- Attributes: hardcoded ["zone"] rather than derived with style_attributes.
- Grant set: a fresh one, not the shell's Local/Shared handling.
- Scope bbox: the "current view" scope used a bbox of E_LO..+4000, N_LO..+4000, and it covered all 200 rows (rows=200). The two scopes therefore do not differ in row count in this run.

TEST FILE: C:/dev/wt/u1r/kernel/tests/u1_reproducer_session_tier_publish.rs (about 215 lines). The full text is in the transcript, where the Write call created it. Outline:
- It writes a 200-feature fixture with FixtureSpec{features:200, attributes: CategoricalZone, crs_mode: DeclaredLv95, identity: ForeignKeyColumn} under the system temp folder (u1r-session-tier-publish).
- It opens the file through the Catalog and prints the identity as opened.
- A publish_scope helper runs the shell's steps above for "current-view" and "whole-dataset". It prints either the refusal (code, Debug, Display) or "PUBLISHED rows/partitions". On success it also prints the manifest's "identity":{...} object, sliced raw from manifest.json up to the first "}".
- It has no assertions beyond unwrap/expect on setup.

RUN OUTPUT (byte-copied; identical in both runs, cmp of the ^U1R lines returned 0)
U1R identity as opened: is_session_ordinal=true source=session-ordinal:file_row_number uniqueness=by-construction-within-generation verified_rows=None
U1R scope=current-view boundary PUBLISHED rows=200 partitions=1
U1R scope=current-view manifest.identity="identity":{"id_source":"session-ordinal:file_row_number","id_uniqueness":"by-construction-within-generation","id_verified_rows":null,"id_js_exact":null,"caveat":"uniqueness was verified over this file at open. Stability across reopen is NOT established: nothing here pins a source revision, so two files could present identical identities. The source content hash above is the only thing tying this identity space to a byte sequence"}
U1R scope=whole-dataset boundary PUBLISHED rows=200 partitions=1
U1R scope=whole-dataset manifest.identity="identity":{"id_source":"session-ordinal:file_row_number","id_uniqueness":"by-construction-within-generation","id_verified_rows":null,"id_js_exact":null,"caveat":"uniqueness was verified over this file at open. Stability across reopen is NOT established: nothing here pins a source revision, so two files could present identical identities. The source content hash above is the only thing tying this identity space to a byte sequence"}
Each run ended with "test u1_session_tier_identity_published_through_the_shells_route ... ok" and "1 passed; 0 failed". The runs took 1.28 s and 1.14 s of test time.

SCRATCH FILES: u1r-run1.txt, u1r-run2.txt, u1r-l1.txt and u1r-l2.txt, in the scratch folder <the custodian's scratch folder>.

COMMANDS
All cargo calls ran in a shared hold with CARGO_TARGET_DIR=D:/wt-targets/u1r, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8.
- Run 1 (build and test): cargo test -p spatial-kernel --test u1_reproducer_session_tier_publish -- --nocapture printed "cargo rc=0".
- Run 2: the same command printed "cargo rc=0".
- Hold lines, mine only:
  - MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:55788 ... then MACHINE_RELEASED project=SpatialIDE shell=bash.exe:55788 affinity=FF (cores 0-7)
  - MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:18372 ... then MACHINE_RELEASED project=SpatialIDE shell=bash.exe:18372 affinity=FF (cores 0-7)
- No hold was refused.

FOUR FAILURE CLASSES (for the custodian's gate)
- Interface the product exposes: partly. The test uses the kernel calls the shell makes, but not the shell crate or SkpHost (deviations above).
- Result claims point to a table or report that exists: the claims above point only to the printed lines in the scratch files named above. No results table exists.
- Operator-facing lines describe what was measured at this commit: the lines are from 8b9193a1 with the one untracked test file.
- Measurement reaches its assertion: this is a reading, not a measurement. The test has no assertions, as the brief required. Both PUBLISHED lines were reached, so the publish and manifest read both executed.

No usage figures to report.

END STATE
- Worktree HEAD is still 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a. Porcelain is "?? kernel/tests/u1_reproducer_session_tier_publish.rs", the one untracked file.
- Temp-folder writes: the fixture and bundles under the system temp folder in u1r-session-tier-publish.
- Background shells: the wait loops I started are finished. Nothing of mine is running and I killed nothing.
- Nothing was committed or pushed, and no tracked file was edited.
