# Divergences: spec-derived fixtures vs `protocol/skp` wire types

Baseline `bb98f71f43a2891d317b10a124387df9d5ee0ebf`; fixtures re-run at `skp/0.6` (merge of `main`
into this branch, commit `37b3644`, Windows evidence). Run:
`cargo test -p spatial-skp --test conformance -- --nocapture` → `pass=63 deferred_to_host=15 diverged=0`
at commit `5d4da4d` (PLAN node `skp-cancel-state-closed-set`; the previous run was `pass=62
deferred_to_host=15 diverged=1`).

## D1 — `cancel` response `state` accepts any string — RESOLVED

- **Resolved** by PLAN node `skp-cancel-state-closed-set` at commit `5d4da4d`: `CancelResponse.state`
  is the closed `CancelState`, so the fixture is refused at deserialize. The record below is the
  finding as it stood at the baseline.
- **Spec section:** SKP-V0.md §1 `cancel`: `→ { state: "requested" | "unknown" | "already_terminal" }`.
- **Fixture:** `fixtures/refusals-at-deserialize.json` → `rej-resp-cancel-bad-state`
  (`{"state":"cancelled"}` as `CancelResponse`).
- **Observed:** accepted at deserialize; re-serialized as `{"state":"cancelled"}`.
  `CancelResponse.state` is `String` (`protocol/skp/src/v0/commands.rs:460-465`); the three values
  appear only in its doc comment. The host writer is closed (`kernel/src/skp.rs:98-110`,
  `CancelOutcome::as_str`), so the open set is on the reading side only; the TypeScript mirror
  reads it as `string` too (`frontends/shell/src/skp/types.ts:267-268`).
- **Which side appears wrong:** undetermined. §1 states a closed value set but does not say that a
  reader must refuse a value outside it (the same layer question as `AMBIGUITIES.md` A3).

## Host-deferred (not divergences)

15 `refused_any_layer` fixtures are accepted at the type layer, because `skp`
(all request structs) and `open_dataset.cancel_key` are `String` fields: the 9 version-literal
fixtures and the 6 malformed-cancel-key fixtures. The spec does not say which layer refuses them
(A3). Code path only, not executed here: `kernel/src/skp.rs`'s `check_version` (`==`) and
`CancelKey::try_from` in `SkpHost::open_dataset` (→ `skp.malformed_cancel_key`).
