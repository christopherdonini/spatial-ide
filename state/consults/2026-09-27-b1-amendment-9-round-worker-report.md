*Custodian's filing note (2026-09-27): the B1 Amendment 9 round worker's hand-back (the merge of main, Amendment 9, the conformance fixtures; head `c9ec02e` on `cut/b1-engine-projection`), transcribed from the hand-back message with the harness's two-space indent removed. It is a worker report, not a gate report. Its path-and-line cites are into the branch; they are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the worker's text.*

---

B1 Amendment 9 round complete. Worktree C:/dev/wt/b1-projection, branch cut/b1-engine-projection, HEAD c9ec02e (clean, not pushed per instruction).

**Commits added (in order):**
1. `37b3644` merge: origin/main@e606af7 into cut/b1-engine-projection@0b517d9 -s. Conflicts only in generated files (CUSTODIAN-QUEUE.md/.json, site/data/plan.json, site/index.html) — took main's side then regenerated with queue.mjs/site.mjs. protocol/skp/tests/conformance/ carried no conflict; `git diff origin/main -- protocol/skp/tests/conformance/` was empty before any edit — byte-identical, as required.
2. `8b06927` Amendment 9 appended byte-for-byte from state/drafts/b1-amendment-9.draft.md (254fbfa). Extracted by awk script; sha256 over LF bytes with one trailing newline = `980b272f8c2ea83a7bd5aa23b5ca0e6658efb6ac091ff30dd5658756533fbd49` (48 lines) — matched before appending.
3. `c9ec02e` Amendment 9.2 fixture commit, touching only protocol/skp/tests/conformance/: literal 0.5→0.6, three version-refusal ids renumbered (skp_0_6→skp_0_7, SKP_0_5→SKP_0_6, skp_0_5SP→skp_0_6SP), 9 specs' "literal" clause updated, 4 fixtures gained `"columns": null` (matching ViewportQueryRequest.columns, read at protocol/skp/src/v0/commands.rs line 434 before editing), DIVERGENCES.md's 5 cites re-pointed (commands.rs line 460-465, kernel/src/skp.rs line 98-110 and line 982-983 and line 1378-1383, types.ts line 267-268 — each checked byte-for-byte against origin/main's cited content first), AMBIGUITIES.md A9 and README.md each gained the one required clause/sentence.

**verify-cites after merge:** PASS, exit 0 — "every rooted (in-tree) path:line reference across 833 file(s) resolves" (39 pre-existing advisory items unrelated to this change).

**M-1** (columns:null removed from req-viewport-all-null): applied at c9ec02e, `cargo test -p spatial-skp --test conformance` → Diverged `req-viewport-all-null`, harness `pass=61 deferred_to_host=15 diverged=2`, test FAILED. Reverted; diff clean.

**M-2** (skip_serializing_if on ViewportQueryRequest::columns): applied at c9ec02e, same test → panic "observed divergences differ", left set gains all four 9.1 ids, test FAILED. Reverted; diff clean.

**9.6(a)** E-15's own "compact the whole chunk" realization, applied to `compact_attribute_slice` at c9ec02e (requesting more than the retained run's length): panics inside arrow-data 58.4.0 ("range end index 5000 out of range for slice of length 20") rather than silently succeeding — arrow's slice() already scopes buffers to the run, so this specific realization is structurally caught, consistent with Amendment 9's note that X10's survival concerns a different realization. Reverted; diff clean.

**9.6(b)** X10's realization (retain_or_compact_single_run's compacting branch never taken) applied at c9ec02e: BOTH named tests failed by name — `every_emitted_attribute_column_retains_at_most_the_declared_factor` ("retained 342208 bytes for a run whose own allowance is 408 bytes", stream.rs line 2588) and `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` ("text run retained 2105348 bytes over its 84424-byte allowance", stream.rs line 2920). Not both survived — no STOP. Reverted; diff clean.

**Harness count after fixture commit (c9ec02e):** `pass=62 deferred_to_host=15 diverged=1`, divergence set `{rej-resp-cancel-bad-state}` alone — matches the e606af7 baseline exactly.

**Suites:**
- `cargo test --workspace --features spatial-engine/fixture` (CARGO_TARGET_DIR=C:/dev/wt/b1-projection/target): 80 test binaries, 774 tests passed, 0 failed, exit 0.
- `npx tsc --noEmit` (frontends/shell): exit 0, no output.
- `npx vitest run` (frontends/shell): 72 files / 1090 tests passed (one file initially timed out from concurrent cargo-lock contention with the workspace run; reran alone after that finished — passed).
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 315 pass, 0 fail.
- Six verify tools: verify.mjs PASS, queue.mjs --check PASS, site.mjs --check PASS, verify-cites PASS, verify-quotes PASS (109 checked/78 verified/30 baselined, 0 errors), verify-test-claims PASS (302 claims resolve).

No STOP fired: no invalidator moved, both 9.6 observations did not both survive, hash matched.

**Pre-gate self-check:** cross-module edit used the interface as it actually exists (ViewportQueryRequest.columns read at commands.rs line 415-434 before any fixture edit); every claim above is backed by a command output I ran; no user-facing messages were added/changed; every test I report reached its real assertion (panics/assert failures with named messages, not just setup). Model: claude-sonnet-5 (no override). No context handoff received or produced beyond this piece's own text.

**Cleanup:** C:/dev/b1-a9-scratch deleted; all spawned processes (monitor loops, cargo/node) killed — confirmed via wmic/tasklist before hand-back.

`git status --porcelain` in the worktree: empty (clean).

Files touched: engine/B1-PROJECTION-PREREGISTRATION.md; protocol/skp/tests/conformance/{AMBIGUITIES.md,DIVERGENCES.md,README.md,fixtures/refusals-any-layer.json,fixtures/refusals-at-deserialize.json,fixtures/requests-accept.json}; plus the merge's generated-file regenerations (CUSTODIAN-QUEUE.md/.json, site/data/plan.json, site/index.html, site/.nojekyll).

Off-scope noted, not touched: nothing found outside this piece's scope.
