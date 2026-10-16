*Custodian's filing note (2026-10-16): the second worker's report for `b2-piece-1b-recording`'s Amendment 12 (route (a) for ADR-022), in C:/dev/wt/1b from the restored working tree the first worker left (`state/consults/2026-10-16-b2-piece-1b-recording-amendment-12-worker-report-1-stopped-at-g3.md`); the head ba0179fc85f29e59aa039f1f325a6f95e883c173, pushed, checked by the custodian (porcelain empty; one commit after a542097e, touching the ADR alone; the custodian's before-ready check passes, `state/consults/2026-10-16-b2-piece-1b-recording-adr-022-route-a-check.md`). The run 2026-10-16T18:54:08Z to 2026-10-16T18:56:42Z by its transcript (Bash 10, Read 1, Edit 1, Write 2); its one SubagentHandback call, at 18:56:40Z. Extracted by script; 0 rooted path:line cite(s) de-rooted; nothing else changed. The message's sha256 as handed back is c92e3a23fc01ee4113f923621fcc64a5653c131f5084edd8bbf8f6ac7b698b94; this file's, from line 5 to the end, is c92e3a23fc01ee4113f923621fcc64a5653c131f5084edd8bbf8f6ac7b698b94.*

---

Route (a) is finished: the human's words are appended to Amendment 1 of ADR-022 and the branch is pushed.

**Commit:** new head `ba0179fc85f29e59aa039f1f325a6f95e883c173` on `cut/b2-piece-1b-recording` (parent a542097e). The commit is `docs: ADR-022 restored to the base with git, Amendment 1 appended once more with the human's C-5 words (Amendment 12, route (a))`. It is signed off and carries both trailers. Only the ADR is staged, and the message is at `g12-commit-msg.txt` in my scratch folder.

**Step 0:** `git fetch origin` gave rc=0. HEAD was a542097e2017751fef164912431847ae6292c35d. Porcelain was the single line ` M docs/adr/ADR-022-…`. The file hash was fa3a411c…73e0, as required.

**Edit:** Guardian accepted the append. I used `old_string` ending in the final newline, and `new_string` was that text plus an empty line and the six Amendment 1 lines.

**Checks (each rc=0):**
- `sha256sum` printed 57107585e966af003b523fdd5fd3ef53b69c860f9f5b42975034e53284dc5277, as required.
- `git diff --numstat 31e25f15…` printed `7 0` for the file.
- `git diff a542097e…` printed one line out and one line in, and the line that changed is the one starting `- ADR-006's class-2 machinery`.
- `verify-cites.mjs` printed PASS with 38 advisory lines.
- `verify-quotes.mjs` printed PASS with 1 advisory line.
- `verify-test-claims.mjs` printed PASS.

**Push:** `git push origin cut/b2-piece-1b-recording` printed `a542097e..ba0179fc` and rc=0. It was an ordinary update, not forced.

**Last eight lines of the file now:**
```
(`docs/07` places both in Beta) · per-layer/multi-layer styles · any perf claim.

## Amendment 1 — style persistence granted for the session history (2026-10-14, the human)
From piece `b2-piece-1b-recording`, a committed style edit is persisted as a `style.set` step in the session history ADR-036 defines (Proposed). This is the grant Consequences (b) left open, for that store only.
- ADR-006's class-2 machinery is the kernel's step record: each committed change of one style property is one step, so a Reset records one step per property it changes, recorded by the kernel's `record_step` command (ADR-036 §12), as one line flushed before the reply; a line that is not whole is never recovered (ADR-036 §9).
- docs/11's obligations: the record's and the step's identities (URI), ADR-036 §6 (schema), ADR-036 §9 (lifecycle), and the step's `actor` and `at` (provenance).
- Consequence (a) stands: nothing is undone, and no UI implies undo.
- Persisting a style in a project file or a lineage is not granted here.
```

**Final porcelain:** empty.

**Model:** the harness reports Sonnet 5.5, claude-sonnet-5-5. I received no context handoff and produced none, and no model override applies.

**Self-check:**
- **Cross-module code:** none touched.
- **Completion claims:** each rests on a command output above.
- **User-facing messages:** none.
- **Required tests:** none; this was a docs-only append.
