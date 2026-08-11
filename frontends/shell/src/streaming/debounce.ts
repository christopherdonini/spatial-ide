/**
 * Trailing-edge debounce: coalesces a burst of calls into the single latest one, fired only after
 * `settleMs` has passed with no further call.
 *
 * **Why this exists (Custodian walkthrough finding, `frontends/shell` cut 1).** Before this,
 * `App.tsx` called `ViewportStreamManager.requestViewport` directly from deck.gl's
 * `onViewStateChange`, which fires on every pointer-move frame during a drag -- throttled inside
 * the manager to at most once per `VIEWPORT_QUERY_MIN_INTERVAL_MS` (120 ms), but a real
 * `viewport_query` round trip (Tauri IPC + `spawn_blocking` + DuckDB statement prep) is "routinely
 * longer than the throttle window" (`viewportStreamManager.ts`'s own doc comment). A sustained,
 * several-second drag therefore issued a new query roughly every 120 ms regardless of whether the
 * previous one had even started resolving, so overlapping in-flight `viewport_query` calls could
 * each mint their own kernel-side ticket before any of them noticed (via the manager's generation
 * counter) that a newer call had already superseded them -- accumulating pending tickets far
 * faster than ordinary interaction should, up to and past `MAX_PENDING_TICKETS`
 * (`kernel/src/skp.rs`), surfaced to the operator as `skp.too_many_pending_streams`.
 *
 * Debouncing to settle removes the query volume that causes it: during continuous motion nothing
 * is "settled", so zero queries fire; only once the gesture actually pauses does exactly one query
 * go out. `ViewportStreamManager`'s own throttle and generation-counter re-entrancy handling stay
 * as they are (`viewportStreamManager.ts`'s own tests depend on that interleaving remaining
 * possible) -- this is a call-site concern, not a change to the manager's contract.
 */
export interface Debounced<Args extends unknown[]> {
  /** Schedule `fn` to run after `settleMs` of no further calls, replacing (not queuing behind) any
   * call already scheduled -- the latest arguments always win. */
  call(...args: Args): void;
  /** Cancel a scheduled-but-not-yet-fired call, if any. Idempotent. */
  cancel(): void;
}

export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, settleMs: number): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return {
    call(...args: Args) {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        fn(...args);
      }, settleMs);
    },
    cancel() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}
