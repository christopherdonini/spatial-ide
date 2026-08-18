// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Coalesces repeated calls into at most one pending `requestAnimationFrame` callback -- the reviewer
 * gate's S5 fix (style-panel cut P7 fixes): a continuous slider drag in the style panel fires an
 * `onChange` (and therefore a style `useEffect`) once per input event, far more often than once per
 * animation frame, and each one previously re-tessellated the whole resident set synchronously
 * (`WorkingCanvas.tsx`'s `render()`) on the spot.
 *
 * `schedule()` while a frame is already pending is a no-op -- the ALREADY-scheduled callback still
 * runs, and it runs `fn` fresh (`fn` closes over whatever state is current when the frame actually
 * fires, e.g. `WorkingCanvas.tsx`'s `drawParamsRef.current`, which the style effect updates
 * SYNCHRONOUSLY on every call regardless of whether the render itself was coalesced away) -- so
 * coalescing loses no information, only redundant intermediate frames. `cancel()` clears a pending
 * frame without ever running `fn`; the caller is expected to call it on its own teardown (component
 * unmount), so no callback fires after the thing that scheduled it is gone.
 *
 * Mirrors `streaming/debounce.ts`'s own `{call/cancel}`-shaped interface (renamed `schedule` here,
 * since "debounce" and "coalesce to one per frame" are different guarantees worth naming
 * differently: debounce fires once after a settle GAP; this fires once per frame regardless of
 * whether the calls ever stop). `requestFrame`/`cancelFrame` are injectable (default
 * `requestAnimationFrame`/`cancelAnimationFrame`) so a test can drive this with a small, fully
 * controlled fake instead of depending on jsdom's own `requestAnimationFrame` behavior.
 */
export interface Coalesced {
  /** Schedule `fn` to run on the next animation frame -- a no-op if a frame is already pending. */
  schedule(): void;
  /** Cancel a scheduled-but-not-yet-fired frame, if any. Idempotent. */
  cancel(): void;
  /** If a frame is pending, cancel it and call `fn` SYNCHRONOUSLY, right now, instead of waiting for
   * the browser's own next frame -- idempotent no-op when nothing is pending (`fn` is never called
   * "just in case"; only an actually-pending call gets flushed). Added for a real gap this module's
   * own S5 fix (reviewer gate, style-panel cut P7) introduced: `WorkingCanvas.tsx`'s dev-only
   * `capturePixels` E2E hook forces an OUT-OF-BAND `deck.redraw()` to read the framebuffer back
   * immediately, outside the browser's own natural frame timing -- without this, that forced redraw
   * could read `deck.props.layers` before a still-pending coalesced style render had ever applied
   * them, capturing STALE colours. A real user never hits this: the browser's own next paint always
   * carries a pending frame regardless, imperceptibly (one frame, ~16ms) -- `flush()` exists for the
   * one caller that reads back a frame OUT OF BAND from that normal timing. */
  flush(): void;
}

export function coalesceOncePerFrame(
  fn: () => void,
  requestFrame: (cb: FrameRequestCallback) => number = requestAnimationFrame,
  cancelFrame: (handle: number) => void = cancelAnimationFrame
): Coalesced {
  let pending: number | null = null;
  return {
    schedule() {
      if (pending !== null) return;
      pending = requestFrame(() => {
        pending = null;
        fn();
      });
    },
    cancel() {
      if (pending !== null) {
        cancelFrame(pending);
        pending = null;
      }
    },
    flush() {
      if (pending !== null) {
        cancelFrame(pending);
        pending = null;
        fn();
      }
    },
  };
}
