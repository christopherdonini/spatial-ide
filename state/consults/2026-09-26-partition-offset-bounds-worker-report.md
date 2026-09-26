*Custodian's filing note (2026-09-26): the worker's hand-back for PLAN node `bundle-viewer-partition-offset-bounds` at aaa6020, filed as returned (extracted by script from the agent's hand-back; byte-identical). Its acceptance artifact was not kept; the re-run is `state/consults/2026-09-26-partition-offset-bounds-acceptance.md`. Everything below the rule is the agent's text.*

---

Piece `bundle-viewer-partition-offset-bounds` complete. Branch `viewer/partition-offset-bounds`, pushed to origin at `aaa6020`.

MODEL/CONTEXT: ran as Sonnet 5 (per worker.md default), no override, no context handoff in or out.

COMMITS (5, all `git commit -s`, worktree `C:\dev\wt\viewer-offset-bounds`):
1. `d986725` test: partition-bounds.test.mjs (F0-F10 fixtures + self-checks) and partition-entry.mjs.
2. `a411fc4` fix: G1-G3/B1-B4 in partition.ts + doc-comment reorder.
3. `cf7462e` docs: M0-M10 records above each test (comments-only).
4. `38b7a7c` docs: KNOWN-LIMITATIONS §2h item, byte-verified against the preregistration by script.
5. `aaa6020` docs: reworded M4/M5/M6 records to literally say "Mutation" (comments-only) — a follow-up commit, not an amend, needed to satisfy `verify-mutation`'s literal-word heuristic (see Checks).

PRE-FIX RUN (commit `a411fc4`'s tests against the unfixed code, `npm ci` first: npm 11.16.0, node v24.18.1, exit 0, no lockfile issue): matches every §5 prediction exactly — T0 passes; T1-T6 fail "Missing expected exception"; T7 TypeError on `children`; T8/T10 TypeError on `values`; T9 TypeError "Cannot convert a BigInt value to a number". 1 pass / 10 fail / 11 total.

POST-FIX: 11/11 green; `npm run verify`: 80/80 green.

M0-M10 (each applied against `a411fc4`, run, reverted; commit+toolchain recorded in each comment): all 11 fail exactly their named test. M3, M5, M8 are caught by a *different* clause (B3's loop/start-check reading past bounds) under wrong wording, which each test's own word-content assertion correctly flags — recorded verbatim in the comments.

ACCEPTANCE RUN: composed dist/ (fresh build) with the external `100k-happy-path` bundle the way `e2e/zoom-anchor.mjs` does (its `before()` hook, lines ~156-166); manifest sha256 `1e5b4dc10bab298a9aa56cbaf180c62df35520584b96fbebfcc6459935765377`; `run-acceptance.mjs --expect-manifest-hash` verdict `rendered-and-hover-resolved`, exit 0 (no falsification — real kernel partition not refused); artifact sha256 `1a1075d7b7c493bf6260253de2c681c9feddbd96cdeec5d857bdcc277f9ab405` (artifact itself not filed in-tree — printed above, per instructions to report path+hash; it lived at a temp path I've since removed). Server process killed, temp dirs and scratch scripts removed after the run.

CHECKS (all exit 0 after the fixes above): `npm run verify` in bundle-viewer; `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` at repo root (311/311); `verify-cites.mjs` PASS; `verify-quotes.mjs` PASS (also ran `--show-cites` on my 4 changed files: 1 pre-existing quote checked/verified, no new quote claims introduced); `verify-test-claims.mjs` PASS; `verify-mutation.mjs --base origin/main --head HEAD` PASS (11/11, after commit 5's wording fix — first run had 3 MISS because the tool requires the literal word "mutation" within 500 chars, which M4/M5/M6's table rows in the preregistration sit outside of); `timeout 120 node scripts/plan/verify.mjs --offline` PASS; `file` on all 4 changed files: none report CRLF.

FIGURES (§7, insertions+deletions, `git diff --stat 28bb51c..HEAD`): KNOWN-LIMITATIONS.md 13+0; partition-bounds.test.mjs 588+0; partition-entry.mjs 8+0; partition.ts 85+4.

DEVIATIONS (all class 2, §5's own escape hatch, none weaken an assertion):
- partition.ts: 89 vs declared ≤70 — 7 distinct fail-closed checks with §2e's exact strings and doc comments; no discretionary lines.
- The two scripts combined: 596 vs declared ≤350 — driven by 11 fixtures needing byte-level Arrow construction (no row-builder API can produce an invalid list), each self-checked.
- KNOWN-LIMITATIONS.md: 13 vs declared ≤12 — the content is the preregistration's own verbatim block; only controllable line is the trailing blank separator every other item carries.
- Two apache-arrow 18.1.0 IPC-writer quirks, neither present in real kernel-written partitions (verified against the actual `100k-happy-path` partition), documented in the test file's own module doc comment: (1) offsets-buffer length padding read back as a phantom trailing offset — fixtures kept at already-aligned lengths; (2) a List sliced past its own length at write time comes back corrupted (0 coordinate pairs, empirically) rather than preserving the out-of-bounds value — F3 (like F5/F6) is built by writing a valid structure first and patching the invalid value in afterward, by differential byte location, never a hard-coded position.

STOPS: none — no §5 invalidator or falsification triggered.

Files: `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\src\partition.ts`, `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\scripts\partition-bounds.test.mjs`, `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\scripts\partition-entry.mjs`, `C:\dev\wt\viewer-offset-bounds\KNOWN-LIMITATIONS.md`.

Final `git status --porcelain`: empty (clean, pushed).
