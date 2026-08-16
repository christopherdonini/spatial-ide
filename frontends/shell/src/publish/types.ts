/**
 * The publish seam's wire types (NEXT-CUT.md publish-cut, P1/P2). Field names mirror
 * `frontends/shell/src-tauri/src/publish.rs` exactly -- snake_case included, matching this
 * repository's own `skp/types.ts` discipline ("the same shape is both the Rust fixture-verified
 * wire contract and this client's request/response types"). `binding_publish_prepare`/
 * `binding_publish_execute` are **binding-local, never SKP** (`publish.rs`'s own module docs) --
 * these types therefore carry plain `number`s, not SKP's `HexF64`/`DecU64` encodings.
 */

/** `PublishPromptData` (`publish.rs`) -- the host-composed prompt `PublishDialog.tsx` renders
 * VERBATIM, field for field. Never re-derived, summarized, or reworded here. */
export interface PublishPromptData {
  operation: string;
  class: number;
  reversibility: string;
  source_name: string;
  source_content_hash: string;
  style_hash: string;
  /** The FULL resolved destination string, never truncated. No `confirmation_phrase` field exists
   * on this type -- the host never hands the expected typed phrase to JS at all (reviewer gate,
   * publish cut: an earlier version carried one, unrendered, which made ADR-024's "never crosses
   * into JS" claim false as written). The dialog's own instruction tells the operator to type
   * "the destination's final path component"; a script -- or `e2e/publish.mjs` -- can still
   * *derive* the expected phrase from this field's own basename, which is why the property is
   * defence-in-depth against operator error, never a secret the host withholds. */
  destination_display: string;
  grantor: string;
  grant_remaining_s: number;
  /** Whole-file or viewport-bbox, in words -- NEW relative to `ApprovalPrompt::render`'s own field
   * set (`publish.rs`'s own doc comment on `PublishPromptData`). */
  row_scope: string;
  /** Present only when the shell's active filter would have applied to this publish -- the
   * NEXT-CUT.md conditional block's own verbatim sentence, never silently dropped. `null`, not
   * omitted (`publish.rs`'s `Option<String>` crosses as `null` when `None`, never an absent key). */
  filter_scope: string | null;
}

/** `PrepareOutcome` (`publish.rs`, `#[serde(tag = "status", rename_all = "kebab-case")]` --
 * variant NAMES are kebab-case, field names inside each variant stay their Rust spelling
 * unchanged: `serde`'s enum-level `rename_all` only renames the tag, never a struct variant's own
 * fields). `PickerCancelled` is not an error (`publish.rs`'s own doc comment: "nothing was
 * attempted") -- callers must not treat it as a refusal. */
export type PrepareOutcome =
  | { status: "prompt"; attempt_id: string; prompt: PublishPromptData }
  | { status: "picker-cancelled" }
  | { status: "refused"; message: string };

/** `ExecuteOutcome` (`publish.rs`). `succeeded-unaudited` is a REAL bundle on disk whose outcome
 * record could not be written -- reported distinctly from `success`, never folded into it
 * (`publish.rs`'s own doc comment: "an unaudited class-3 side effect is not a success").
 * `unknown-attempt` means nothing was authorized or denied -- the attempt id names nothing the
 * host still holds (already used, expired, or never issued), not a refusal. */
export type ExecuteOutcome =
  | {
      status: "success";
      bundle_path: string;
      rows: number;
      partitions: number;
      total_bytes: number;
      manifest_bytes: number;
      style_hash: string;
      operation_digest: string;
      /** Present on the wire (`publish.rs`'s `build_millis: f64`) but deliberately UNUSED by every
       * renderer in this tree -- NEXT-CUT.md's own evidence guard rail: "no perf figure anywhere
       * ... the UI publish path is UNMEASURED and stays that way this cut." Kept in the type so a
       * consumer that DOES need it (a future measured piece) is not blocked re-deriving the field,
       * but nothing here renders it. */
      build_millis: number;
    }
  | { status: "succeeded-unaudited"; bundle_path: string; detail: string }
  | { status: "refused"; message: string }
  | { status: "unknown-attempt" };

/** `PublishScope` (`publish.rs`, `#[serde(tag = "kind", rename_all = "kebab-case")]`) -- exactly
 * the two ADR-017 §8 shapes `binding_publish_prepare` admits, and nothing else (the conditional
 * block's point 2). `bbox` carries plain `f64`s (see this file's own top comment), never SKP's
 * `HexF64` wire encoding -- `resolvePublishScope` (`PublishPanel.tsx`) is what decodes the SKP-wire
 * viewport bbox this shell already tracks (`App.tsx`'s `lastViewportBboxRef`, `HexF64`-encoded)
 * back to plain numbers before it ever reaches this type. */
export type PublishScopeInput =
  | { kind: "whole-file" }
  | { kind: "viewport-bbox"; bbox: { xmin: number; ymin: number; xmax: number; ymax: number } };

/** The Tauri event `execute_with_progress` emits (`publish.rs::PUBLISH_PROGRESS_EVENT`/
 * `PublishProgressEvent`) -- phases only, never a percentage or ETA (NEXT-CUT.md P2 item 3). */
export interface PublishProgressEvent {
  attempt_id: string;
  phase: string;
}

/**
 * The conditional block's own verbatim sentence (NEXT-CUT.md, binding), restated here for
 * `PublishPanel.tsx`'s own informational display -- shown as soon as the shell's active filter
 * would apply, BEFORE any host round-trip (the host's own copy, `publish.rs::FILTER_SCOPE_SENTENCE`,
 * is what actually reaches `PublishPromptData.filter_scope` and is what `PublishDialog.tsx` renders
 * verbatim from host data; this constant is the panel-level echo NEXT-CUT.md's P3 item 2 asks for,
 * duplicated by necessity -- the panel has no host round-trip to source it from before Publish is
 * even clicked). Kept as a single named constant, not inlined at each use site, and the two copies
 * are pinned equal by `PublishPanel.test.ts` reading `publish.rs`'s own source text, so a future
 * edit to either side cannot drift silently.
 */
export const FILTER_SCOPE_SENTENCE =
  "this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing " +
  "publishes the viewport extent, not your filter";
