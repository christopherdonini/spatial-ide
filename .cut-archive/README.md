# Moved

On 2026-09-13 (the human's directive: "Track the ledger: CUT-STATE.md, NEXT-CUT.md, .cut-archive/ → a tracked state/ directory, committed at every flush and report — the checkpoint is the commit") this archive moved to `state/cut-archive/`, unchanged file by file, and is tracked from that commit on (it had been gitignored — never in the repository before). Accepted ADRs (immutable) cite the old `.cut-archive/<file>` paths; resolve them under `state/cut-archive/<file>`.
