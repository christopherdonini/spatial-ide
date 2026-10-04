Question round 49 — 2026-10-04 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 2 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Round 49, item 1 — node 10 (#170). Remedy B fixes §2.1 (NULL-op-NULL typed as the binder types it, BIGINT predicted, probe P-0 first). The same remedy closes the PRE-EXISTING defect on main: `zone = -NULL` is admitted with an undeclared VARCHAR→BIGINT cast, and `zone IS DISTINCT FROM -NULL` ends its stream in an error naming a file value. Context: state/consults/2026-10-04-type-walk-null-literal-arithmetic-architect-remedy.md (Q1). Route for that main defect?
  (1) Fold into node 10 (Recommended) — Amendment 2, class 9, with this ruling as its authority: one line in the unary arm, row C51 and mutation M7, in the same correction round; ~250–275 of node 10's 300 lines.
  (2) Its own node — A full-form piece after node 10 merges; main keeps the leak until then; node 10 carries Amendment 1 only.

---

2. Round 49, item 2 — degenerate constant-NULL shapes against REAL, DOUBLE or a double literal, e.g. `f32 > NULL * NULL` and (if folded) `f32 > -NULL`, `1e3 > -NULL` — some admitted on main today. These always return no rows. Under remedy B they are judged by the binder's type (BIGINT vs REAL) and refused by bit width with the residual reason, routed with F7 (proposed node type-walk-rule2-residual-reasons). Which?
  (1) Refuse by type (Recommended) — Follows your ADR-021 Note 2026-10-03 item 2 principle (a NULL-valued result is judged by its type); pinned as refused in B-T1; their reason sentence joins F7's routing. A user-visible change for the shapes main admits today.
  (2) Admit them — A reading that a NULL-valued arithmetic result counts as a NULL literal against numeric operands — yours to make, needs an ADR-021 Note, and adds guards at four or five readers.
