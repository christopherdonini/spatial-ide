Question round 39 — 2026-10-02 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 1 item, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Item 1. port-1-linux-l1 (PORT-1, Linux L1 for the Cargo workspace): which runner label does the new Linux job in product-ci-rust use? Your round 33 item 7 profile names Ubuntu 24.04 x64, and KNOWN-LIMITATIONS 1 will say "Linux, Ubuntu 24.04 x64: L1 for the Cargo workspace only". PORTABILITY §6's wording says ubuntu-latest, which GitHub moves to newer releases over time. The architect's draft carries both safeguards either way: a profile step that prints the OS version each run, and an invalidator that stops the piece if the runner isn't 24.04 at its first run. Not a red line. The job installs nothing beyond the toolchain action Windows already uses, and nothing becomes a required check (that stays yours). The form is committed after your answer, and the piece is dispatched after #160 merges, so node 7's tests get their first Linux run here.
  (1) Pin ubuntu-24.04 (Recommended) — runs-on: ubuntu-24.04, matching your round 33 item 7 profile, so KNOWN-LIMITATIONS' Ubuntu 24.04 claim stays true when GitHub moves ubuntu-latest. A later move to a newer Ubuntu is its own small piece.
  (2) ubuntu-latest — As PORTABILITY §6 words it. The profile step reports the version each run. Once GitHub moves the label, KNOWN-LIMITATIONS' 24.04 line goes stale until a follow-up corrects it.
  (3) Hold — port-1 waits; the queue moves on.
