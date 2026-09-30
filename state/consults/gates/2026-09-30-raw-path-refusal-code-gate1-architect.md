*Custodian's filing note (2026-09-30): the architect's gate 1 on PR #148, for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the first piece (A4-4), full gating. Reviewed: cut/raw-path-refusal-code @ 8b4f153 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 18:46:49Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 8b4f153. Its item 5 condition, that D is formatting-only, is met by the custodian's check: `kernel/tests/end_to_end.rs` at 92045df and at 8b4f153 hashes the same with all whitespace removed (sha256 prefix 3f8c165f3edb017a); `git diff -w` is not empty only because D reflows two asserts across lines. N1 (SKP-V0 and `formatTerminalRefusal.ts` name `next_into` as the only prefix site) is routed at the node's closing. Profile paths redacted at filing: none.*

---

Reviewed: cut/raw-path-refusal-code @ 8b4f153

**Verdict: PASS with notes.** A4-4 is implemented as §2 states. Nothing blocks.

How I read it: I have no Bash, so I compared the worktree at 8b4f153 with main's copies of the two files. The base-side text is main's, which I take as unchanged since 8cee33b; that is not re-derived. The diff stat (2 files, +43/−1) and the numstat (44) come from the worker's report and the custodian's filing note (`state/consults/2026-09-30-raw-path-refusal-code-worker-report-1.md`, lines 3, 33 and 40). They are consistent with what I read. I did not recompute any span hash, including §9's SKP-V0 pin at a446efd. I read `protocol/skp/SKP-V0.md:750-758` in the tree at 8b4f153, and I treat the tree as authoritative for this review. The reviewer recomputes the pin.

**1. §2 item 1 and nothing else: PASS.**
- The site is `kernel/src/lib.rs:382-383` at 8b4f153. It was `lib.rs:378` on main, where the code was `.map_err(|e| e.to_string())`. It is now `.map_err(|e| skp::terminal_detail_of(&e))`, with a comment added at `lib.rs:379-381`. That is 6 insertions and 1 deletion, which matches the stat.
- §8 items 1 to 5, one by one:
  - (1) Only `kernel/src/lib.rs` and `kernel/tests/end_to_end.rs` changed.
  - (2) There is no new string literal outside the comment. `skp.rs:1848-1850` (`terminal_detail_of`) is unchanged.
  - (3) The only engine-prefix formatter in `kernel/src` is `skp.rs:1849`. `publish/error.rs:217` builds the `publish.*` prefix, which already existed and is outside this diff.
  - (4) The non-EngineError refusals at `lib.rs:335`, `lib.rs:354` and `lib.rs:358` are unchanged and carry no code.
  - (5) No `pub` item was added. The call goes to an existing `pub fn` that already has product callers (`lib.rs:464`, `lib.rs:475`, `lib.rs:623`), so the caller rule is met.
- §7: 44 changed lines over 2 files, against a ceiling of 60 lines and 2 files. There is no class 8.

**2. True to SKP-V0's shape, and the comment is true: PASS.**
- SKP-V0.md:750-752 at 8b4f153 says a data-plane terminal's `detail` is `"<code>: <display>"` (a sub-span of those lines, not pinned). The create-time raw path was the case that broke this. It now takes the same route: `server.rs:479-490` passes the factory's `Err(String)` straight into the `TERM_PRODUCER_FAILED` detail, and adds no prefix of its own.
- The comment says the create-time refusal takes the mid-stream arm's shape. That is true: `lib.rs:622-623` calls the same function.
- The comment says `terminal_detail_of` is "the one place that prefix is minted". That is true for the engine-code prefix, which is what the comment is about.
- docs/01 principle 8 (no black boxes): the refusal is now inspectable by its code as well as its prose. This is consistent with the principle.

**3. T1: PASS.**
- `end_to_end.rs:523-558` at 8b4f153 matches §3 F1: `fixture("crs", 500)`, the dataset opened as `parcels` (`DATASET`), bbox `[7,46,8,47]` in `EPSG:4326`. It runs against the real `EngineSourceFactory::new` behind the data-plane server (`end_to_end.rs:53`).
- The four §4 assertions are all present, at lines 543, 544-546, 547-554 and 555.
- §8 item 6: there is no timing assertion. `RECV_DEADLINE` (`end_to_end.rs:197`) only bounds how long a failing test runs.
- §5's two tests in this file are unchanged in text. `h7_…` at lines 472-494 and `a_viewport_in_the_wrong_crs_…` at lines 496-521 are identical to main's lines 472-521.
- The other three test files in §5 are outside the 2-file stat.
- P0 and the mutation are recorded with their commits: P0 at B = 4db0865 and the mutation at C = 92045df (worker report lines 15-16). The report records an applied mutation, not a `verify-mutation` run. That is round 25-compliant, and the reviewer re-observes it.

**4. Consumer search: PASS. The §5 stop does not fire.**
- The consumer side as it actually is:
  - `formatTerminalRefusal.ts:33-43` splits on any `engine.[a-z0-9_]+` head. This is generic, and the new detail parses into code and message the same way mid-stream details already do.
  - `liveTicketSet.ts:60-61` matches only the `engine.source_changed` and `engine.source_coverage_lost` prefixes.
  - Both live in the shell, which installs `ticket_only` and never reaches this path.
- I searched the worktree for `viewport_crs_mismatch`, `refused: the viewport` and `viewport is expressed`. Nothing in `frontends/` or `protocol/` matches the raw-path create-time detail by prefix or by equality.
- The canvas-probe prints `terminal.detail` whole (`frontends/canvas-probe/src/main.ts:261`). That is the operator note §9 declares. It is the engine stating its own fact, so it is not an owner-consequence defect.
- `KNOWN-LIMITATIONS.md:111-113` quotes the Display text, which is unchanged. It is documentation, not a matcher.

**5. D (8b4f153): acceptable as is. No record line needed.**
- The form lists no commits, and D sits inside the §7 count, since numstat runs over base...HEAD.
- The worker report already discloses D (line 14).
- The end state at `end_to_end.rs:547-554` is consistent with a reflow of the two asserts.
- The reviewer should confirm that `git diff -w 92045df 8b4f153` is empty. If it is not, D is not formatting-only and needs a record line.

**Blocking:** none.

**Non-blocking:**
- N1. `SKP-V0.md:751-752` and `formatTerminalRefusal.ts:9-11` both name `EngineSource::next_into` as the only site that applies the prefix. `create_from_raw_params` is now a second site. Neither text is false, but both are incomplete. §2 item 2 forbids touching SKP-V0 here, so name the second site in the next SKP-V0 change-log entry or a later node, not in this PR.
- N2. T1 repeats the setup of `a_viewport_in_the_wrong_crs_is_refused_end_to_end` as its own test, which §5 required so that test's text stays unchanged. There is nothing to fix. A later cleanup must not merge the two.
- N3. Round 25 checks: no §7 overrun, no scope addition, and the mutation is recorded as applied. The report's line numbers are unpinned working pointers, which the custodian's filing note declares. None of the round 25 failures applies.

Files:
- C:/dev/wt/raw-path-refusal-code/kernel/src/lib.rs
- C:/dev/wt/raw-path-refusal-code/kernel/tests/end_to_end.rs
- C:/dev/wt/raw-path-refusal-code/kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-09-30-raw-path-refusal-code-worker-report-1.md
