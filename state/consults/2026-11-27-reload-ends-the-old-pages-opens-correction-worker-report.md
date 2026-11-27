# B's correction after its two build-gate read parts, the worker's report

*Filed by the custodian, 2026-11-27. The correction of the form's Amendment 6 item 3 (ADV-2026-11-27-16), made in D:/wt/reload from ae4b673fc3d783514b13a4e823f5a432e43aeb91, with no app, dev server, e2e suite, cargo build or test started. A sonnet worker made it. Its run, from its completion notice only (ADV-2026-11-26-02), was 16 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (3148 bytes, sha256 53318677137b77acd5bcf87dac51cc892245eae5a30cd8d5fe68ddaadc5db274), byte for byte. Its account is the worker's; the custodian checked the head, its parent and both counts by git. No gate-log row: this is a correction, not a gate.*

---

5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 pushed (origin/cut/reload-ends-the-old-pages-opens). Every step completed.

Commit: 5ce0525a "docs: B's correction after its two build-gate read parts: four doc and comment places (ADV-2026-11-27-16)". It is signed off with git commit -s and carries no email.

Preflight: HEAD was ae4b673f before the change, and status was clean. df showed 41532 MB free, above the 40960 floor.

Places. One script applied all four. Each Old and New was read by git show from the filed reports on origin/main, and each Old was found exactly once. The script is D:/wt/reload-logs/apply-corr-1.mjs.
1. (b) settle's doc, page.rs, now around lines 294-300. Done. Old and New came from the reviewer's F3, from first backtick to last. The architect's F-3 was not applied. The word-equality check passed.
2. (c) start_page_end's doc, lib.rs. Done. Old and New came from the architect's F-4 (backtick span, fenced New).
3. (h) the handle's doc, page.rs, now around lines 118-121. Done. Old and New came from the architect's F-6. The reviewer's F5 was not applied.
4. First comment of commands.rs. Done. Old and New came from the architect's F-5.

Place 1's new lines (verbatim):
    ///   the host's close, then `Projects::release_ended` when there is a `Projects`, then the
    ///   decrement, held by a drop guard. With no `Projects` (`setup` managed `None`), no project
    ///   lock can be held, since only `Projects` takes one and `save_project` and `open_project`
    ///   refuse without it, so the late close is the host's close and the decrement.

Checks:
- cargo fmt --check: exit 0.
- verify-cites: exit 0. Summary line: "verify:cites PASS — every rooted (in-tree) path:line reference across 3964 file(s) resolves. (269 loose reference(s) advised above.)"
- verify-quotes: it ran in the background, so I did not capture a separate exit code. The shared chain ended with exit 0. Summary line: "verify:quotes PASS — 173 checked, 142 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 950 ruling cites resolved, 0 ruling-cite errors."

Numstat ae4b673f..HEAD (added, deleted):
- commands.rs: 2, 1
- lib.rs: 5, 1
- page.rs: 8, 2

Numstat ca576852...HEAD (added, deleted):
- docs/README.md: 1, 0
- ADR-037 (docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md): 193, 0
- e2e/README.md: 2, 2
- e2e/project.mjs: 37, 2
- commands.rs: 52, 7
- lib.rs: 70, 4
- page.rs: 1324, 0
- e2e-test-surface.ts: 2, 2
- Total: 1681 added, 17 deleted, 1698 together.

Departures: none from the brief's content. My first script drafts had wrapping bugs (a mismatch in the word-equality check, and a syntax error). I fixed them before anything was written. Nothing was built or run beyond the listed checks, and publish.rs was not touched.

Pre-gate self-check:
- The change is doc and comment text only, so it crosses no module seam.
- Each completion claim points to a log or a numstat.
- No user-facing message was changed.
- No test was added, so none needed to reach an assertion.
- Model: Sonnet 5.5, no override, no context handoff.
