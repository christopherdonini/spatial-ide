# Spike — static CRT for the shell executable (DECISIONS-PENDING entry 69, option (b))

**Written conclusion only. Nothing here is decided, launched, or shipped.** Run 2026-09-09 by the custodian on the day-work list ("static-CRT build spike in a worktree: link result + dumpbin /imports on MSVCP140, written conclusion only, informs entry 69 (b)"). The spike informs the human's ruling on entry 69; it does not make it.

## Question

The v0.1.0 candidate executable (`spatial-ide-shell.exe`, built from `main` 998be05) imports `MSVCP140.dll` — the Microsoft Visual C++ 2015–2022 redistributable — dynamically, and the NSIS installer bundles no redistributable (entry 69; `RELEASE-0.1.md` Amendment 14). Does building the shell crate with the Rust MSVC target's static CRT (`-C target-feature=+crt-static`) link at all, and does it remove that import and the UCRT forwarders?

## Method

- Worktree `spike/entry69-static-crt` on `main` 279b43f, its own `target/` (nothing shared with the shipped build). The two frontend build outputs (`frontends/shell/dist`, `renderer/bundle-viewer/dist`) and the generated `src/generated/NOTICE.txt` were copied in as build artifacts so `tauri::generate_context!` finds its resources; no `npm` step ran in the worktree.
- One configuration file, **in the worktree only — not committed, not for `main`**:

  ```toml
  # frontends/shell/src-tauri/.cargo/config.toml
  [build]
  rustflags = ["-C", "target-feature=+crt-static"]
  ```

- `cargo build --release` in `frontends/shell/src-tauri` (the crate's own target; not `tauri build`, so no installer was produced). First attempt failed on the missing copied notice file (a spike-setup omission, not a linkage fact); the second attempt linked.
- `dumpbin /DEPENDENTS` (VS 2022 Build Tools, MSVC 14.44) on the result and on the shipped v0.1.0 executable, same tool, same day.

## Result

| | v0.1.0 (dynamic CRT, `main` 998be05) | spike (`+crt-static`) |
|---|---|---|
| link | clean | clean — exit 0, `Finished release`, **zero `LNK` warnings** in the build log |
| `spatial-ide-shell.exe` | 44,363,776 bytes | 44,331,520 bytes |
| DLL dependents | 27 | 16 |
| CRT-related imports | `MSVCP140.dll`; `api-ms-win-crt-{math,string,convert,runtime,heap,time,environment,stdio,filesystem,locale}-l1-1-0.dll` | **none** — no `MSVCP140`, no `VCRUNTIME140`, no `api-ms-win-crt-*` |
| remaining dependents (both) | `advapi32, ntdll, user32, kernel32, ole32, gdi32, dwmapi, comctl32, shlwapi, api-ms-win-core-synch-l1-2-0, shell32, oleaut32, ws2_32, bcryptprimitives, rstrtmgr` — all shipped with Windows 10 | same set |
| `spatial_ide_shell_lib.dll` (the crate's `cdylib` target, built beside the exe; **not** packaged by the installer — `installer.nsi` copies the main binary and the resource files only) | not inspected | 29,692,928 bytes; no CRT-related imports |

So: **the static CRT links, and the executable's dependency on the VC++ redistributable is gone.** The DuckDB amalgamation (compiled by `libduckdb-sys`'s C++ build) and every other C/C++ object linked with it under the same flag — the import table is the evidence; the per-object compiler flags were not separately inspected.

## What this spike does NOT establish

- **Runtime behaviour.** The executable was never launched (session locked; build-only day). A static-CRT build can differ at runtime from a dynamic one (heap and locale state are per-image; anything loaded as a DLL that expects the shared CRT would not share it). The shipped build has only one such DLL beside it and the installer does not package it. A decision (b) would need the packaged build rebuilt, re-hashed, and **Part M re-run on it** (Amendment 13's rule: a document describing an artifact is written after running it).
- **The installer.** `tauri build` was not run; NSIS packaging of a static-CRT executable was not exercised (no reason to expect a difference — the installer copies the file — but not shown).
- **Licence posture of the statically linked runtime.** Statically linking the Microsoft C runtime conveys Microsoft's runtime code inside the executable rather than depending on a separately installed redistributable. Whether that changes what the notice set must carry (ADR-030's reopen condition: "any further third-party set a conveyed artifact carries that no build manifest reports") and under which Microsoft terms it is conveyed is a question for the architect and the human — **not answered here, not assumed either way.** Under option (a) (declare) nothing changes on this point.
- **Size or timing.** The byte counts above are facts about two files; no claim is made from them (docs/08).

## What a ruling for (b) would need, from this evidence

1. The `rustflags` setting placed where the shipped build reads it (`frontends/shell/src-tauri/.cargo/config.toml`, checked in), with a comment naming entry 69.
2. CI's `tauri build` job proving the link on `windows-latest`, and `dumpbin /DEPENDENTS` (or an equivalent check) asserting the absence of `MSVCP140.dll` as a test, so the property cannot regress silently.
3. The packaged build rebuilt and re-hashed; Part M re-run on it; the KNOWN-LIMITATIONS install entry then says nothing about a redistributable.
4. The architect's answer on the runtime-conveyance question above, recorded in `DEPENDENCY-LICENSES.md` / ADR-030's note as needed.

Under (a) (declare), none of this runs before the tag: one sentence in the install entry and QUICKSTART, and M1 records the dependency as not exercised.

## Files

- This README (the deliverable).
- Build logs (not committed): the custodian's scratchpad, `spike-static-crt-build.log` (attempt 1, failed on the copied-file omission) and `spike-static-crt-build-2.log` (attempt 2, `Finished release`).
- The worktree's `.cargo/config.toml` above — spike-local, deliberately not committed.
