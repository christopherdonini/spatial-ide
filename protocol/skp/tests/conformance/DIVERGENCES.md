# Divergences: spec-derived fixtures vs `protocol/skp` wire types

Baseline `bb98f71f43a2891d317b10a124387df9d5ee0ebf`. Linux evidence only. Run:
`cargo test -p spatial-skp --test conformance -- --nocapture` → `pass=62 deferred_to_host=15 diverged=1`.

## D1 — `cancel` response `state` accepts any string

- **Spec section:** SKP-V0.md §1 `cancel`: `→ { state: "requested" | "unknown" | "already_terminal" }`.
- **Fixture:** `fixtures/refusals-at-deserialize.json` → `rej-resp-cancel-bad-state`
  (`{"state":"cancelled"}` as `CancelResponse`).
- **Observed:** accepted at deserialize; re-serialized as `{"state":"cancelled"}`.
  `CancelResponse.state` is `String` (`protocol/skp/src/v0/commands.rs:381-385`); the three values
  appear only in its doc comment. The host writer is closed (`kernel/src/skp.rs:61-73`,
  `CancelOutcome::as_str`), so the open set is on the reading side only; the TypeScript mirror
  reads it as `string` too (`frontends/shell/src/skp/types.ts:217`).
- **Which side appears wrong:** undetermined. §1 states a closed value set but does not say that a
  reader must refuse a value outside it (the same layer question as `AMBIGUITIES.md` A3).

## Host-deferred (not divergences)

15 `refused_any_layer` fixtures are accepted at the type layer, because `skp`
(all request structs) and `open_dataset.cancel_key` are `String` fields: the 9 version-literal
fixtures and the 6 malformed-cancel-key fixtures. The spec does not say which layer refuses them
(A3). Code path only, not executed here: `kernel/src/skp.rs:969-974` (`check_version`, `==`) and
`kernel/src/skp.rs:790-791` (`CancelKey::try_from` → `skp.malformed_cancel_key`).
