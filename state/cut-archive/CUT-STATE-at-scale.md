# CUT-STATE — at-scale validation cut, pieces P1 (predicate probe) + P2 (Part H doc)

**Untracked** (`NEXT-CUT.md` rule 10 — archives to `.cut-archive/` at cut close, never committed
directly; this file records this piece's own work for the pieces after it).

Branch: `main` (doc + probe only, per the piece's own scope — zero product code).

---

## P1 — the predicate probe: **RUN, findings recorded, throwaway deleted**

**Question (NEXT-CUT.md P1 item 2):** is `id * 2 > 6599800` admitted, and is it — or a fallback —
genuinely long/zero-batch to first batch at 5 GB, as H3 needs?

**Mechanism:** `engine/examples/predicate-probe.rs` (make-fixture.rs's own pilot-example
precedent) — built (`cargo build --release -p spatial-engine --example predicate-probe`, 12m30s
clean, one dependency tree not yet built on this machine for a release profile), run twice (round
2 added one more candidate live, after round 1's finding), then **deleted** before this commit
(`git status --porcelain` confirmed clean of it below). Full console captured inline here — not
retained as a separate artifact, per the same throwaway convention `CUT-STATE-sqlfilter-panels-publish.md`'s P0 probe used (deleted code, findings kept in prose).

Ran against the real, hash-verified fixture (`target/slice-evidence/scale-pass/parcels-5gb.parquet`,
5,004,376,705 B — confirmed byte-identical to the pinned record before the probe ran) — **never a
smaller stand-in fixture**, per the piece's own instruction ("never faked on a small fixture").

### (a) Admission — ADR-021's three stages, all four predicates

| Predicate | Admitted? |
|---|---|
| `id > 3299900` (plain control — expected prunable) | **ADMITTED** |
| `id * 2 > 6599800` (NEXT-CUT's own H3 candidate) | **ADMITTED** |
| `id / 2 > 1649950` (NEXT-CUT's own declared fallback) | **ADMITTED** |
| `id * id > 10889340010000` (round 2, added live — a quadratic, `id` referenced twice, not a
  single-occurrence linear form) | **ADMITTED** |

All four pass `AdmittedPredicate::admit` (structural → namespace → bind, `engine/src/predicate.rs`)
against the open 5 GB dataset — the arithmetic operators `*`, `/`, and repeated column references
are within the allowlist exactly as `docs/07`'s filter-in-SQL design note declares.

### (b) Streaming contrast — bbox null, filter-only, real 5 GB fixture, n=1 per cell (pre-check, not
a measurement — bucket language only, per the piece's own wording rule)

| Predicate | first batch | total | rows | filter_plan |
|---|---|---|---|---|
| `id > 3299900` | under-a-second (33.4–37.1 ms observed) | under-a-second (34.4–38.4 ms observed) | 99 | `WholeFile` |
| `id * 2 > 6599800` | under-a-second (36.3–37.5 ms observed) | under-a-second (38.0–38.9 ms observed) | 99 | `WholeFile` |
| `id / 2 > 1649950` | under-a-second (64.3–76.9 ms observed) | under-a-second (64.9–78.6 ms observed) | 99 | `WholeFile` |
| `id * id > 10889340010000` (round 2) | under-a-second (52.1 ms observed) | under-a-second (53.6 ms observed) | 99 | `WholeFile` |

`filter_plan` reads `WholeFile` for every row because that field tracks this engine's own
**spatial** row-group plan (bbox/covering-bbox pruning) — `bbox` is `None` in every cell above, so
that plan never engages regardless of the attribute predicate. It says nothing about DuckDB's own
Parquet-reader-internal row-group statistics pruning, which this codebase does not instrument.

**All four rows land in the SAME bucket (under-a-second), including the plain prunable control.**
Two engineered-non-prunable candidates and one quadratic (non-linear, two-occurrence) candidate
were tried; none differentiated from the prunable control by even one bucket.

### Row count — confirmed

Every predicate's tail matched **99 rows** — "~100 tail rows... matches `id > 3299900`'s set" per
the piece's own instruction, confirmed identical across all four.

### Finding, stated honestly (the piece's own fallback instruction: "if nothing non-prunable is
admissible, H3 records that fact honestly — never faked on a small fixture")

**Nothing tried is genuinely long/zero-batch at 5 GB on this fixture's own shape, and the most
likely reason is structural, not a pruning failure of any one predicate:** `spec_5gb()` is
`AttributeMode::None` — the ONLY filterable column is `id` (`UInt64`, ~26.4 MB decoded across all
3,300,000 rows). A `WHERE` clause referencing only `id` never has to touch the ~4.95 GB geometry
column to be *evaluated* (only the matching rows' geometry is later fetched) — so even a predicate
DuckDB's optimizer cannot fold back onto a direct column comparison (and the quadratic round-2
candidate is exactly such a case) is still a full scan of a ~26 MB column, not a 5 GB one. **This is
an observation with a stated, plausible mechanism, not a proven decomposition** (`kernel/RESULTS.md`
own discipline: "suspecting it is not measuring it") — nothing here instruments DuckDB's own
optimizer or its row-group statistics pass to confirm which mechanism (constant-folding onto a
prunable form, or the cheap-column-scan fact above, or both) is doing the work.

**Conclusion for H3:** `id * 2 > 6599800` is admitted (H3's admission half is real and demonstrable
at 5 GB) but **is not** the genuinely-slow, liveness/Cancel-exercising predicate NEXT-CUT's H3 text
was drafted expecting. H3 in Part H is written accordingly — see `frontends/shell/MANUAL-WALKTHROUGH.md`
Part H, H3's own callout box, which states this finding plainly rather than fabricating a slow scan,
and names Part E's dedicated `slow-filter-scan.parquet` fixture (4,000,000 features, ONE row group,
`id > 3999900`) as the one instrument in this tree that has actually demonstrated the
liveness/Cancel/persistent-incomplete-status property — not reused here because doing so would
substitute a materially smaller fixture for the declared 5 GB one.

---

## Unrelated piece landed on `main` in this same untracked-state period: the macOS bring-up kit

**Not part of the at-scale cut above** — a separate, human-directed piece (the human now has a 2019
MacBook Pro 13", the hardware `docs/07`'s macOS gate has been waiting for), recorded here only
because this file is this remote period's own running state log, per its own untracked/append
convention.

**Built:** a read-only Windows-assumption audit of the tree, findings folded into
`MACOS-BRINGUP.md`'s own "Known platform caveats" section (repo root, committed); no code changed.
Audit method: every `cfg(windows)`/`cfg(target_os)` site, every `GetProcessIoCounters`/process-memory
measurement site, the ADR-020 origin selection, path literals, the port-5180 choice, and the E2E
harness's CDP dependency were located and read at their exact file:line before being written up.

**Headline findings:** (1) every Windows-only measurement site
(`kernel/tests/{first_batch_factorial,import_layout_factorial,indexed_budgets,slice_budgets}.rs`,
`kernel/tests/support/mod.rs`, `kernel/src/permission/audit/{log,normalize}.rs`,
`kernel/src/publish/error.rs`) is `#[cfg(windows)]`-gated with a `#[cfg(not(windows))]`/`#[cfg(unix)]`
fallback — `cargo build --workspace`/`cargo test --workspace` is expected to succeed unmodified on
macOS, with measurement instruments reporting `None` rather than failing; (2) ADR-020's packaged-build
origin (`http://tauri.localhost`, `frontends/shell/src-tauri/src/lib.rs`) is the Windows/WebView2
custom-protocol origin specifically — macOS packaged Tauri uses `tauri://localhost`, so a **packaged**
macOS build's data plane would 403 every WebSocket upgrade; dev mode (`http://localhost:5180`) is
unaffected — stated in the doc as a known, fail-closed, dev-mode-only-bring-up caveat, not something
to debug; (3) the `e2e/*.mjs` suites cannot run on macOS at all — `playwright-core` drives WebView2 over
CDP (`--remote-debugging-port`), and WKWebView has no CDP support whatsoever; the operator walkthrough
and the Rust test suites are the macOS validation instruments; (4) no workspace member depends on a
Windows-only crate — only the workspace-**excluded** `protocol/transport-bakeoff` (ADR-012 evidence,
hard-coded Edge paths, `windows-sys`) does, and it is out of scope for this bring-up entirely; (5)
`libduckdb-sys`'s default (non-cmake) `bundled` build path uses the `cc` crate only — verified against
the vendored crate source in the local Cargo registry cache — so Xcode Command Line Tools alone (no
separate cmake install) suffice for the long first build; (6) `tauri::path().app_log_dir()` resolves to
`~/Library/Logs/dev.spatialide.shell` on macOS — verified against the vendored `tauri-2.11.5` crate
source (`src/path/desktop.rs`), not assumed.

**`MACOS-BRINGUP.md`'s section list:** Prerequisites (CLT, Homebrew, rustup, Node LTS, git/gh auth) ·
Clone, build, run (with the "plausibly 30-60+ minutes" first-build expectation and the session-log
path) · What to run once it opens (Walkthrough Parts A-F only, fixture regeneration commands, the
evidence-class framing quoting `docs/07`'s own gate wording so bring-up is never read as gate-closure)
· Known platform caveats (the table summarized above) · If it fails — triage (CLT-missing shape, port
conflict, WebKit-oddities-are-data framing, app-never-opens) · Audit method (short, for reference).

**Committed:** `MACOS-BRINGUP.md` only, standard identity flags, message `docs: macOS bring-up kit —
the human has the hardware (docs/07 gate prep)`. Not pushed. Nothing else in the tree touched by this
piece — `CUT-STATE.md` (this file) and `NEXT-CUT.md` stay untracked/unstaged, per the piece's own
instruction to commit MACOS-BRINGUP.md "+ nothing else".

### Verify: probe deleted, tree clean

```
$ git status --porcelain
?? NEXT-CUT.md
```

(`NEXT-CUT.md` is the brief itself, untracked by design, not this piece's to remove — P4's own
scope per its status line.) `engine/examples/predicate-probe.rs` does not appear — deleted before
this line was captured.

---

## P2 — Part H into `frontends/shell/MANUAL-WALKTHROUGH.md`: **written**

Doc-only. Every duration/count cited in Part H was re-checked against `kernel/RESULTS.md` a final
time before commit (see the piece's own report for the citation list). No product code touched.
Committed on `main` with standard identity flags: `docs: walkthrough Part H — the hero slice at 5 GB
(at-scale cut P2)`.

---

## Single-file standalone bundle packager (macOS/Safari delivery): **built, verified, committed**

`tools/make-standalone-bundle.mjs` (new, zero dependencies) — repackages a published static bundle
directory into one `.html`: viewer's `index.html` structure + CSS (already inline in that file) +
`app.js` (as a `data:` URI script `src`, so nothing bundler-emitted can break out of the tag via a
literal `</script`), every asset `main.ts`'s two `fetch()` sites actually request (`manifest.json`,
the style, every partition — discovered from the manifest, not guessed) embedded base64 in
`window.__SPATIAL_EMBEDDED__`, and a fetch shim that recomputes the viewer's own `BUNDLE_BASE`
formula (`new URL('../', location.href)`) in the same document before the viewer script runs, so key
resolution is guaranteed to agree with the real `fetch()` calls regardless of where the file is
opened from or whether it's served or `file://`. One honesty banner at the top, generated/published
dates read from the run clock and the bundle's own `build-info.json` (degrades gracefully if absent).

Ran against `target/filter-zoned-publish/` -> `target/filter-zoned-standalone.html` (1,184,907 B; 3
assets embedded, 438,923 raw bytes, well under the 10 MB ceiling the script itself enforces).

**Verification, both node-side and in a real headless browser** — this machine's Edge install
self-relaunches de-elevated when started from this (elevated) shell and exits immediately, so its
stdout (`--dump-dom`'s only output channel) is unreachable by ordinary redirection; CDP/WebSocket
automation to reach the de-elevated instance was denied by the permission classifier as an
automation/RCE-shaped pattern (not pursued further, per instruction, rather than routed around).
Fell back to two *file-based* Chromium flags instead (`--screenshot=<path>`, `--enable-logging
--log-file=<path>` — both are ordinary filesystem writes, unaffected by the same handle-inheritance
restriction that breaks stdout capture across the elevation boundary): the resulting screenshot shows
the exact banner text, the rendered 2000-feature polygon layer, and the status line `1/1 partitions
verified · 2000 features drawn, 0 outside the view`; the log file's one relevant line is
`INFO:CONSOLE:191] "[spatial-ide standalone] fetch shim installed: 3 asset(s) embedded", source:
file:///.../filter-zoned-standalone.html (191)` with zero JS errors/exceptions from the page. Same
run repeated served from a local static server (`http://127.0.0.1:8992/...`) produced a
**byte-identical** screenshot and the same shim-installed log line at the `http://` URL — confirms the
shim's `BUNDLE_BASE`-recomputation design does not depend on origin, as designed.

Committed on `main`, standard identity flags: `tools/make-standalone-bundle.mjs` only (`git commit
-s`). `target/filter-zoned-standalone.html` was **not** committed (build output, `target/` is
gitignored) — deliver by path per the piece's own instruction.
