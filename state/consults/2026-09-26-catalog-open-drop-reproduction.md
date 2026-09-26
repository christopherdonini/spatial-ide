*Custodian's filing note (2026-09-26): the tester-high's report for PLAN node `catalog-open-drop-reproduction` (RULED 2026-09-26, question round 25, item 1 (d)), read at main 3319073 and the watcher tip 68f5c56, filed as returned (extracted by script from the agent's hand-back; byte-identical). Its two quotations of `state/cloud/wave1/A2.md` were checked byte-exact by grep -F before filing. Everything below the rule is the agent's text.*

---

## 1. Verdict

**S2.** No `Drop` reached from a replaced `Arc<Dataset>` at `3319073` can acquire, or wait on a thread that is waiting on, `Catalog`'s `RwLock` — I found no re-entrant or transitive path back into `kernel::Catalog` anywhere in `Dataset`'s field graph. But real, non-trivial work does run **while the write guard is held**, because of Rust's own temporary-lifetime drop order in `kernel/src/lib.rs:168`/`:190` (`self.lock_write().insert(name.into(), Arc::new(ds));`): the value `HashMap::insert` hands back (the replaced `Arc<Dataset>`, if any) is a temporary created *after* the guard temporary, and Rust drops same-statement temporaries in reverse creation order — so the replaced dataset's whole `Drop` chain (pool teardown, DuckDB connection close) runs and finishes *before* the write guard itself is released. This is confirmed empirically by probe (a). It is the S2 "latency note," not the S1 reacquire/deadlock pattern.

This matches a prior, independent finding already on record: `state/cloud/wave1/A2.md:78-79` (worker A2's concurrency audit) states, byte-copied: "After PR #116, the lock graph I read is acyclic: `StreamRegistry.tickets`→`CancelToken.interrupt`→DuckDB `InterruptHandle`; `OpenRegistry.inflight`→`CancelToken.interrupt`; `GenerationRegistry`, the pool's `state` and the `Catalog` RwLock take no other lock. I found no other `Drop` that re-enters a lock its caller already holds." and "`Catalog::open` (`lib.rs`) drops a replaced `Arc<Dataset>` while holding the catalog write lock. If that was the last reference, the pool's idle DuckDB connections close under the lock. This only happens when a non-SKP caller reuses a name; there is no deadlock path, so it is a lock-held-during-work note only." My independent walk of `Dataset`'s field graph and the two probes reach the same conclusion.

## 2. Drop inventory (all citations at `3319073` unless marked "68f5c56")

| Type / field | path:line | What it does | (i) acquire Catalog lock | (ii) wait on a thread waiting for Catalog lock | (iii) unbounded block |
|---|---|---|---|---|---|
| `Dataset` (path, envelope, covering, geo, file_schema) | `engine/src/dataset.rs:140-169`... wait, this is a plain struct with no `Drop` impl, on fields | Fields drop in declaration order; all are plain data | No | No | No |
| `Dataset.pool: Arc<ConnectionPool>` | `engine/src/dataset.rs:153` | Decrements refcount; if last ref, `ConnectionPool` drops | No | No | No (the decrement itself) |
| `ConnectionPool` (no `impl Drop`) | `engine/src/pool.rs:322-332` | Default field drop → `state: Mutex<PoolState>` (`:324`) → `PoolState.idle: Vec<Physical>` (`:290`) → each `Physical.conn: Connection` | No | No | No (bookkeeping-only mutex, per the module's own header `:349-350`) |
| `Dataset.pin: Mutex<Option<ContentPin>>` | `engine/src/dataset.rs:157` | Plain data, own mutex | No | No | No |
| `Lease` (**not** owned by `Dataset` — leased transiently by a stream's producer thread or a test caller via `pool.acquire`; not reached from dropping a `Dataset`) | `engine/src/pool.rs:572-579` | `self.pool.discard(self.class)` (pool's own `Mutex<PoolState>`) then `drop(p)` (→ `Connection` drop, row below) | No | No | No (discard is bookkeeping) |
| `duckdb::Connection` (no `impl Drop`; default field drop) | `duckdb-1.10505.0/src/lib.rs:271-275` | → `db: RefCell<InnerConnection>` drops first | No | No | No |
| `InnerConnection::drop` → `self.close()` → `duckdb_disconnect` | `…/duckdb-1.10505.0/src/inner_connection.rs:270-282` (close at `:107-117`) | Foreign C call into DuckDB, closes this connection handle | No — never touches any Rust lock in this repo | No | **Yes** — a foreign call whose duration this codebase does not bound (`engine/src/pool.rs:14-16`'s own header: "How S2 divides... has not been measured") |
| `DatabaseHandle::drop` → `ffi::duckdb_close` | `…/duckdb-1.10505.0/src/inner_connection.rs:42-55` | Runs when the last `Arc<Mutex<DatabaseHandle>>` for a database drops — closes the whole database | No | No | **Yes** — DuckDB's own close/checkpoint, exactly the class of operation the task names |
| `Connection.cache: StatementCache` → each cached `RawStatement::drop` | `…/duckdb-1.10505.0/src/cache.rs:59-60`, `…/raw_statement.rs:245-250` | `duckdb_destroy_prepare` per cached statement | No | No | No (teardown of an already-prepared statement, not a checkpoint) |
| `BatchStream::drop` (**not** owned by `Dataset** — returned to the caller/producer, not stored in `Dataset`; included for contrast) | `engine/src/stream.rs:786-796` | `self.cancel.cancel_for_drop()` — sets an atomic flag | No | No | No |
| `TraceGuard::drop` (**not** reached — `Dataset` holds no `TraceGuard` field) | `engine/src/trace.rs:341-346` | Locks the process-global `CURRENT` mutex, unrelated to `Catalog` | No | No | No |
| `EngineSource::drop` (**not** reached — owned by SKP's ticket registry, wraps a `BatchStream` + dataset name string, not `Arc<Dataset>`) | `kernel/src/lib.rs:503-533` | `end_session_if_source_changed` → `invalidator.end_generation` (GenerationRegistry, PR #116's own object graph) | No (different lock, not Catalog's) | No | No |

**Key structural point (task's "contrast `Catalog::remove`"):** `Catalog::remove` (`kernel/src/lib.rs:202-204`) is `self.lock_write().remove(name)` as the function's **tail expression, no semicolon** — the write-guard temporary is scoped to `remove()`'s own body and is dropped as that function returns, *before* the caller ever receives the `Option<Arc<Dataset>>`. Whatever the caller does with that value (e.g. `close_dataset`'s bare `self.catalog.remove(name);` at `kernel/src/skp.rs:1371`/`68f5c56:1371`) drops it in the *caller's own, later statement*, structurally after the guard is long gone. `Catalog::open`/`open_cancellable` cannot have this property because they discard the replaced value in the *same* statement that produces the guard. Probe (a2) confirms this empirically (`held=false`, below).

## 3. Reachability

- **Callers of `Catalog::open`:** `kernel/src/main.rs:105` (`slice-host`) — opens exactly once at process startup, per the binary's own CLI shape; never re-opens. Every `kernel/tests/*.rs` caller (`end_to_end.rs:51`, `indexed_budgets.rs:448`, `skp_admission.rs` x8, `slice_budgets.rs:365`, `wire_bytes_invariant.rs:70`, `concurrency_in_situ.rs:228,382`, etc.) calls `.open()` exactly once per test function against its own fresh `Catalog` (verified by an `awk` scan of every function in every `kernel/tests/*.rs` file counting `catalog.open(` occurrences per function — none exceeded 1).
- **Callers of `Catalog::open_cancellable`:** only `kernel/src/skp.rs:809` (`SkpHost::open_dataset`, called by the shell via `frontends/shell/src-tauri/src/commands.rs:54-62`). The name is `DatasetHandle::mint()` (`protocol/skp/src/v0/handles.rs:17-21,46-48`): 16 bytes from `getrandom::fill` (OS CSPRNG), i.e. a 128-bit random handle. `two_mints_differ` (`protocol/skp/src/v0/handles.rs:181-183`) only asserts pairwise inequality, not global uniqueness, but a genuine collision is astronomically improbable, never structurally excluded.
- **No product path replaces a dataset today.** `slice-host` opens once; the shell only opens via `SkpHost::open_dataset` (always a fresh random handle) and only removes via `close_dataset`/`Catalog::remove`; `frontends/shell/src-tauri/src/publish.rs` never calls `open`/`open_cancellable`, only `Catalog::get`. Replacement is reachable today only via a test that reuses a name on one `Catalog` (none currently does) or the negligible-probability SKP handle collision.
- **No caller holds another lock across the call.** `SkpHost::open_dataset`'s `OpenRegistry::begin`/`end` (`kernel/src/skp.rs:700-707`, `:709-711`) each lock-and-release their own `Mutex` immediately; the `OpenGuard` (`Drop` at `kernel/src/skp.rs:734`) only touches that same `Mutex`, after `open_cancellable` has already returned.
- **Is the catalog's `Arc` the last strong reference?** Neither `BatchStream` nor `EngineSource` holds an `Arc<Dataset>` — `stream_inner` clones only what it needs (descriptor, path, envelope, geometry column — see its own comment at `engine/src/stream.rs:1100-1102`, "Cloned rather than borrowed because the producer thread outlives this call") into the producer thread, never the `Arc`. This is worth flagging against `Catalog::remove`'s own doc comment (`kernel/src/lib.rs:198-199`): "The `Arc<Dataset>` a live stream already holds keeps the dataset alive until that stream ends" — that claim does not hold for the current `BatchStream`/`EngineSource` implementation; I found no code path where a stream itself holds `Arc<Dataset>`. The one place that genuinely holds `Arc<Dataset>` beyond a single call is `frontends/shell/src-tauri/src/publish.rs` (fields at `:159,:372,:451,:478`), for the life of one publish attempt. So: outside an in-flight publish on that name, or the brief window a caller's local `ds` from `get()` (`describe`/`viewport_query`, `kernel/src/skp.rs:821-824`,`:841-844`) is still in scope, the catalog's `Arc` **is** the last reference, so a same-name replace would trigger the real drop chain.

## 4. The watcher tip `68f5c56`

- `Catalog`'s struct and `open`/`open_cancellable`/`get`/`remove`/`names` are **byte-identical** between `3319073` and `68f5c56` (direct diff, no output). `Dataset`'s struct fields are also unchanged (empty diff); the diff only adds a plain-data method, `SourceDescriptor::unestablished_components` (`engine/src/descriptor.rs`), no new field, no `Drop`.
- New file `engine/src/watch.rs` (711 lines) adds `SourceWatch` (struct `:440-443`, `Drop` `:451-478`, thread join at `:469`). Its `Drop` **does** block for an unbounded time — (iii) — but:
  - It is stored in `kernel/src/skp.rs`'s `SkpHost.watches: Mutex<HashMap<String, OpenRecord>>` (`:931`, `OpenRecord` struct `:875-880`), a structure entirely separate from `Catalog.datasets`. `Dataset` owns no field of this type — there is no path from a dropped `Arc<Dataset>` to a `SourceWatch`.
  - Its watch thread's own callback only reaches `invalidator.end_generation(...)` (GenerationRegistry/StreamRegistry), never a `Catalog` method — joining it cannot transitively wait on the Catalog's lock either.
  - `close_dataset` (`kernel/src/skp.rs:1349-1372` on that branch) **already applies the PR #116 fix shape to its own lock**: `let removed_watch = self.watches.lock()...remove(name); drop(removed_watch);` (`:1362-1363`) — the `watches` guard, an unnamed temporary, is released at the end of the `let` statement; the removed `OpenRecord` (and its `SourceWatch`, whose `Drop` joins threads) is dropped explicitly on the *next* line, after the guard is gone. The code's own comment (`:1358-1361`) states this discipline by name: "the `OpenRecord` (and so the watch) is removed under the map guard and dropped only after release." This is the mirror image of the shape `Catalog::open`/`open_cancellable` still lack.
  - `open_dataset` (`:1050-1051` for the `open_cancellable` call) never replaces an existing entry — a fresh random handle every time — and releases its pre-admission `latch` `Mutex` (`:1087`) before ever touching `catalog` (`:1088`) or `generations`.
- **Conclusion:** the watcher tip changes neither `Dataset`'s Drop chain nor `Catalog::open`'s code, introduces no new S1 candidate, and does not change this verdict. It does supply a contemporaneous precedent — the exact "drop after guard release" shape already applied to `SkpHost.watches` — that `Catalog::open`/`open_cancellable`'s replace path could adopt for consistency, even though (per S2) nothing here makes it a correctness requirement today.

## 5. Probes (scratch worktree only, none committed)

All three files are under `C:/dev/wt/catalog-drop-repro/` and are untracked (`git status --porcelain` there shows only `?? .scratch-probes/` and `?? kernel/tests/zz_probe_catalog_open_drop.rs`).

**(a) Drop-order confirmation** — `C:/dev/wt/catalog-drop-repro/.scratch-probes/probe_a_drop_order.rs`, a standalone program (plain `std::sync::RwLock`, no repo crates — this is a question about Rust's own temporary-lifetime rules) reproducing `Catalog::open`'s exact statement shape (`guard.insert(...);`, no `let`).
Command: `rustc -O probe_a_drop_order.rs -o probe_a_drop_order.exe && timeout 15 ./probe_a_drop_order.exe`
Output (excerpt):
```
[drop] Payload id=1 write-lock-still-held-at-this-drop=true
RESULT: replaced-value-drop-observed-write-lock-held = true
CONCLUSION: the replaced value's Drop runs BEFORE the write guard is released ...
sanity: lock is free after Catalog::open returns — no leaked guard.
```

**(a, contrast half)** — `.scratch-probes/probe_a2_remove_shape.rs`, reproducing `Catalog::remove`'s tail-expression shape.
Command: `rustc -O probe_a2_remove_shape.rs -o probe_a2.exe && timeout 15 ./probe_a2.exe`
Output (excerpt):
```
[drop] Payload (via remove-shape) write-lock-still-held-at-this-drop=false
RESULT: remove-shape replaced-value-drop-observed-write-lock-held = false
CONCLUSION: remove()'s internal write guard is released before the caller ever receives, let alone drops, the replaced value ...
```

**(b) Real-`Catalog` timing** — `C:/dev/wt/catalog-drop-repro/kernel/tests/zz_probe_catalog_open_drop.rs`: opens a 2,000-feature GeoParquet fixture as `"X"`, then replaces it 20 times on the main thread while a second thread loops `catalog.get("X")`/`catalog.names()` and records each call pair's wall time.
Command: `cargo build -p spatial-kernel --tests` (background, ~9m21s cold build incl. bundled DuckDB), then `timeout 60 cargo test -p spatial-kernel --test zz_probe_catalog_open_drop -- --nocapture`
Output:
```
PROBE-B-RESULT n=574425 median=900ns max=3.5564ms (observations only, this machine, not a docs/08 claim)
test catalog_open_replace_reader_wait_timing ... ok
```
These are **observations only, this machine** (Windows 10, this build), not a docs/08 budget claim.

**(c) Deadlock/watchdog probe** — not run. Neither step 1 (Drop inventory) nor step 3 (watcher tip) found any candidate path to (i) or (ii), so the task's own condition for running (c) was not met.

Cleanup: I verified no leftover `cargo.exe`/`rustc.exe`/`cl.exe`/test-binary processes remain running after each probe (`tasklist` checks after the build and after the test run both returned "No tasks are running which match the specified criteria"). I did kill two stray duplicate `cargo build` process pairs (PIDs 46092/35968 and 29672/3092) that resulted from an initial shell-backgrounding mistake on my part (`&` inside a Bash-tool call, which does not persist between tool calls) before restarting the build cleanly in the background — noted for transparency, not left running.

## 6. What remains open

- I did not independently verify DuckDB's `duckdb_close`/`duckdb_disconnect` internals (C++ source) for exactly how long a checkpoint/flush can take under load or on a larger file; I only established, from the Rust-side `duckdb` crate wrapper, that these are foreign calls this codebase does not bound and that they run under the write lock in the replace path. Probe (b)'s observed max (3.5564 ms) is against a small (2,000-feature), freshly-written, reuse-connections-default fixture on this machine only — it does not bound behavior against a larger dataset, `PoolConfig::fresh_per_query()`, or a machine under load, and no docs/08 claim is made from it.
- I did not build or test anything in `C:/dev/wt/source-change-watcher` (per instructions), so the watcher-tip section rests on `git show`/`git diff` reads only, not a build or test run at `68f5c56`.
- I did not find or run an existing test that already exercises `Catalog::open`'s replace path (`insert` returning `Some`) anywhere in the current test suite — the replace path is reachable but, as far as I found, currently untested outside my own scratch probe.
- Elapsed time was close to the 90-minute budget once the cold `spatial-kernel` test build (duckdb-sys bundled compile, ~9m21s) is included; I did not attempt a second, larger-scale timing run (e.g. against a `docs/07`-scale fixture) given the budget.

Files touched (all untracked, none committed):
- `C:/dev/wt/catalog-drop-repro/.scratch-probes/probe_a_drop_order.rs`
- `C:/dev/wt/catalog-drop-repro/.scratch-probes/probe_a2_remove_shape.rs`
- `C:/dev/wt/catalog-drop-repro/.scratch-probes/probe_a_drop_order.exe`, `probe_a2.exe` (compiled binaries)
- `C:/dev/wt/catalog-drop-repro/kernel/tests/zz_probe_catalog_open_drop.rs`
- `C:/dev/wt/catalog-drop-repro/target/` (build artifacts, this worktree's own, `CARGO_TARGET_DIR` unset)
