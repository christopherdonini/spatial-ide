Question round 38 — 2026-10-02 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 1 item, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Item 1. Node 7 (skp-cancel-state-closed-set, wave-1 C-1, S2). The cancel response's `state` is a free string in protocol/skp (Rust) and in the shell's TypeScript types, while SKP-V0 §1 lists exactly three values: requested, unknown, already_terminal. The kernel writes only those three. Nothing in product code reads the field. Which side is wrong, and does fixing it bump the protocol literal? The architect's draft finds the reader is wrong: ADR-021 Decision 2 and SKP-V0 §4 item 13 forbid a reader that tolerates values outside a set. With no key or value added and the kernel's bytes unchanged, no literal bump is needed. Not a red line. Option 3 would open an ADR-021 amendment later, which would then need your typed word.
  (1) Reader wrong, no bump (Recommended) — protocol/skp gets a closed enum that refuses any other value at deserialize; the shell gets a closed union type, checked at compile time only. SKP-V0 §1 gains one sentence and §8 a dated note. The literal stays skp/0.8. Full gating, about 13 files, budget 120 min.
  (2) Reader wrong, bump to 0.9 — The same fix plus a bump to skp/0.9 on both sides. Roughly 25 more files, because every fixture carries the literal.
  (3) Spec wrong — SKP-V0 says a reader may accept other values. This contradicts ADR-021 Decision 2, so it would open an ADR-021 amendment, for your typed word later.
  (4) Hold — Node 7 waits; the queue moves to port-1-linux-l1.
