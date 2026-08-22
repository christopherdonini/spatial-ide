# Companion note — native `wgpu` renderer bake-off (2026-08-22)

**A dated companion to `NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md`, filed beside it, never
edited into it** — the preregistration's text is frozen on the ADR-012 pattern (written before
anyone is invested in the outcome; its predictions bind because they predate the run), so
additions ride alongside as dated companions and move with the parent document when the work is
scheduled. Like the parent, this note binds nothing and may not be cited to justify starting the
work.

## Two requirements on any future run

1. **Each candidate's buffer-memory strategy is part of the run record.** For every candidate,
   the run must state — before results are read — how vertex/attribute memory is allocated,
   uploaded, mapped, shared, and reused per frame and per data change: staging-buffer vs
   direct-mapped, per-tile vs monolithic, rewritten vs persistent. A comparison whose candidates
   differ silently in buffer strategy measures the strategies, not the renderers, and cannot be
   attributed afterward.

2. **The native candidate evaluates direct engine→GPU Arrow buffer sharing, on both of this
   machine's GPU profiles.** On the UMA profile (Intel UHD 630, shared system memory) an Arrow
   buffer the engine already holds can in principle be *mapped* rather than copied into GPU
   memory; on the discrete profile (NVIDIA GTX 1650, dedicated VRAM) a bus transfer is physically
   required and "sharing" can only restructure where the copy happens. Both profiles are already
   the spike record's own measurement hardware (`spikes/adr-003-crs-rendering/README.md`, M4's
   two-GPU protocol). **The UMA question is a dimension of this bake-off, not a separate
   project** — it gets a column in the run record, not its own preregistration.

## The bound on expectations, stated before anyone runs anything

**Upload cost was never a measured wall through the browser path, and that fact bounds what
buffer sharing can be expected to buy.** Precisely what the record shows
(`spikes/adr-003-crs-rendering/README.md`): the steady rendering path's measured walls are
frame-*present* costs (M1.5: ~130 ms frames at 10M points on the UHD 630 with the attribute
buffer reused by reference — no upload in the loop); upload appears as a measured budget miss
only in the *event-scoped* origin-swap/commit scenario (M4: final reupload frame ~66 ms on both
GPUs; patch-and-reupload 80–333 ms), and M5 counts the CPU→GPU upload as the one
physically-required copy on the hot path, identified and counted, never timed as the steady-state
bottleneck. A sharing evaluation that reports "upload eliminated" has therefore removed a cost
the browser path never showed as its wall — the run must measure what sharing actually changes
end to end (frame-present cost included), not assume the eliminated copy was the constraint.
