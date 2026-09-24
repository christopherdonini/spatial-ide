> **Status: brief — proposed, unscheduled; the human's accepted direction of 2026-09-18; preregistration owed before code.**
> Recorded 2026-09-18 from the human's handoff `HANDOFF-2026-09-18-source-consistency.md` (kept outside the repository); this tracked text is the record.

**Scope.** Windows-only advisory detection for the open dataset's source file, via `ReadDirectoryChangesW` on the parent directory through the `windows-sys` edge already in the engine (no new crate), feeding P3b's existing invalidation path. The existing pre-check and post-check stay unchanged; the watcher adds signals and replaces nothing.

**Signals and rules.**
1. **Change** (write, rename, replace or delete touching the source's name): ends the generation through P3b's path, **regardless of the descriptor** — a matching descriptor never discharges a signal. Reason shown: *source-change notification observed*.
2. **Coverage lost** (buffer overflow, loss of an established watch, any unaccounted gap): **ends the generation conservatively**. Reason shown: *detection coverage lost — a modification is possible, not observed*; never "the source changed". A signal-free re-arm proves nothing about the gap; re-arming may support a **new, explicitly reopened** generation, never restore the old one.
3. **Unavailable at open** (directory cannot be watched): admits a **clearly labelled checks-only** preview (`describe` + status stack). Losing coverage *after* admission is rule 2, never a silent downgrade to checks-only.
4. **Opening race**: the watcher is armed before the descriptor is read; any signal between arming and admission refuses the open.
5. **No automatic reload**: a signal ends a generation; a new one begins only by explicit reopen; no batch from an ended generation is admitted.

**Testable criterion** (no OS-delivery deadline promised): *a signal delivered to the process before a query is issued ends the generation before that query's ticket is minted; a signal delivered during a stream ends it before the stream's terminal is admitted; a signal delivered while idle ends it before the next render or pick.*

**Acceptance cases.** (a) Same-size in-place write → generation ended on the signal, descriptor still matching. (b) Rename/replace/delete → ended. (c) Overflow → ended with the *coverage lost* reason; re-arm does not restore. (d) Unavailable at open → checks-only label present; a later coverage loss → rule 2. (e) Signal between arm and admission → open refused. (f) **Idle canvas** — no stream, no query — signal → residency cleared, picks refused, status shown (the cached-view gap that motivated this). (g) No reload on any event; no mixed-generation batch admitted. **Two separate test tiers, each claiming only what it proves:** injected-signal ordering tests (the criterion above, deterministic), and the Windows adapter tests (real filesystem events on a temp directory: write, rename, replace, delete, forced overflow — proving the adapter maps events to the three signals, not any delivery timing).

**Non-goals.** Snapshots, prepared mode, editing, PostGIS, polling fallback, non-Windows (declared beside the tier note), any docs/08 row, any dependency.

**Sighted 2026-09-24 by the human:** accepted as the record of the settled direction, with seven additions binding on the preregistration, verbatim in `state/directives/2026-09-24-watcher-sight.md` (the RULED 2026-09-24 block in `DECISIONS-PENDING.md`). Where this brief and those additions differ, the additions govern.
