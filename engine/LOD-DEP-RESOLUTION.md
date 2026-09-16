# LOD tier builder — dependency resolution against the real workspace (2026-09-16)

The pre-code gate step of `engine/LOD-PREREGISTRATION.md` §8 items 1–4 and invalidators I1/I4, run
**against this workspace** rather than against a probe crate. The probe's evidence is
`spikes/lod-feasibility/dep-check/README.md`; this file is the same check re-run at `cargo add`
time, as that README's last paragraph says the tier-builder piece owes.

**This file records facts. It makes no compatibility judgment** — that is the human's under I4 and
ADR-009, exactly as the dep-check README states for its own listing.

## 1. What changed in the manifests

- `engine/Cargo.toml`: `geo = "0.33.1"`, `wkb = "0.9.2"`, `geo-traits = "0.3.0"` added to
  `[dependencies]`; `parquet = { version = "58", default-features = false, features = ["arrow",
  "snap"] }` is no longer `optional`; the `fixture` feature no longer carries `dep:parquet` and is
  now `fixture = []`.
- The three crates are declared in `engine/Cargo.toml`, not in the repo-root
  `[workspace.dependencies]`, which carries only the entries more than one member shares (`arrow`,
  `bytes`, `tokio`). `parquet` already followed that convention.
- No other manifest was edited.

## 2. Lockfile diff — the NEW entries (workspace `Cargo.lock`)

41 packages added; **no existing package's version moved** (the diff's only removed lines are
dependency-list lines re-sorted inside existing entries). Licence expression as `cargo tree -e
normal --prefix none --format "{p} {l}"` reports it:

| Package | Version | Licence expression |
|---|---|---|
| allocator-api2 | 0.2.21 | MIT OR Apache-2.0 |
| approx | 0.5.1 | Apache-2.0 |
| crossbeam-deque | 0.8.8 | MIT OR Apache-2.0 |
| crossbeam-epoch | 0.9.21 | MIT OR Apache-2.0 |
| crossbeam-utils | 0.8.23 | MIT OR Apache-2.0 |
| earcut | 0.4.5 | ISC |
| either | 1.18.0 | MIT OR Apache-2.0 |
| float_next_after | 2.0.0 | MIT |
| foldhash | 0.2.0 | Zlib |
| geo | 0.33.1 | MIT OR Apache-2.0 |
| geo-traits | 0.3.0 | MIT OR Apache-2.0 |
| geo-types | 0.7.20 | MIT OR Apache-2.0 |
| geographiclib-rs | 0.2.7 | MIT |
| hash32 | 0.3.1 | MIT OR Apache-2.0 |
| hashbrown | 0.16.1 | MIT OR Apache-2.0 |
| heapless | 0.8.0 | MIT OR Apache-2.0 |
| i_float | 1.16.0 | MIT |
| i_key_sort | 0.10.3 | MIT |
| i_overlay | 4.5.2 | MIT OR Apache-2.0 |
| i_shape | 1.18.0 | MIT |
| i_tree | 0.18.0 | MIT |
| num_enum | 0.7.6 | BSD-3-Clause OR MIT OR Apache-2.0 |
| num_enum_derive | 0.7.6 | (proc-macro) BSD-3-Clause OR MIT OR Apache-2.0 |
| proc-macro-crate | 3.5.0 | MIT OR Apache-2.0 |
| rand | 0.10.2 | MIT OR Apache-2.0 |
| rand_core | 0.10.1 | MIT OR Apache-2.0 |
| rand_pcg | 0.10.2 | MIT OR Apache-2.0 |
| rayon | 1.12.0 | MIT OR Apache-2.0 |
| rayon-core | 1.13.0 | MIT OR Apache-2.0 |
| robust | 1.2.0 | MIT OR Apache-2.0 |
| rstar | 0.12.2 | MIT OR Apache-2.0 |
| sif-itree | 0.4.1 | MIT OR Apache-2.0 |
| spade | 2.15.1 | MIT OR Apache-2.0 |
| stable_deref_trait | 1.2.1 | MIT OR Apache-2.0 |
| thiserror | 1.0.69 | MIT OR Apache-2.0 |
| thiserror-impl | 1.0.69 | (proc-macro) MIT OR Apache-2.0 |
| toml_datetime | 1.1.1+spec-1.1.0 | MIT OR Apache-2.0 |
| toml_edit | 0.25.15+spec-1.1.0 | MIT OR Apache-2.0 |
| toml_parser | 1.1.3+spec-1.1.0 | MIT OR Apache-2.0 |
| winnow | 1.0.4 | MIT |
| wkb | 0.9.2 | MIT OR Apache-2.0 |

Distinct licence expressions among the 41: `MIT OR Apache-2.0`, `MIT`, `Apache-2.0`, `ISC`,
`Zlib`, `BSD-3-Clause OR MIT OR Apache-2.0`. Every one of them is an expression the dep-check
README's closure already listed; **no expression outside that set appears**, and no GPL/LGPL/MPL/BSL
expression appears among the added entries. **I4 does not fire.**

**Against the probe's expectation.** The probe's `added-closure.txt` listed 49 crates; this
workspace adds 41. The difference is 8 crates the probe counted as added over its parquet+arrow-only
baseline which are **already in this workspace** at the same versions: `equivalent 1.0.2`,
`indexmap 2.14.2`, `log 0.4.34`, `rustversion 1.0.23`, `smallvec 1.16.1`, `syn 3.0.5`,
`thiserror 2.0.20`, `thiserror-impl 2.0.20`. The real workspace's added set is a strict subset of
the probe's: **nothing appears here that the probe did not see.** The probe's two notes hold as
written — `byteorder` gains new paths, and `thiserror` sits at both 1.0.69 (via `wkb`) and 2.0.20
(via `geo-types`).

## 3. Arrow resolution — I1

`cargo tree -e normal --prefix none --format "{p} {l}" | sort -u` from the workspace root: every
`arrow*` crate and `parquet` resolves at **58.4.0** and at no other version —
`arrow`, `arrow-arith`, `arrow-array`, `arrow-buffer`, `arrow-cast`, `arrow-data`, `arrow-ipc`,
`arrow-ord`, `arrow-row`, `arrow-schema`, `arrow-select`, `arrow-string`, `parquet`. `cargo
generate-lockfile` reports `arrow` and `parquet` as held at 58.4.0 with 59.3.0 available, i.e. the
workspace pin is doing the holding. **No second Arrow major is in the tree. I1 does not fire.**

## 4. The shell's own lockfile (the conveyed artifact)

`frontends/shell/src-tauri/Cargo.lock` is a **separate resolution** and is what ADR-030's generator
reads (`frontends/shell/scripts/rustCrateNotices.mjs`, decision 1: "the shell crate's lockfile
alone"). Because that crate depends on `spatial-engine` by path, the new crates enter it too. It was
updated in this commit: **29 packages added, no existing package's version moved.** The 29 are the
41 above minus the 12 the shell's own tree already carried (`crossbeam-utils`, `foldhash`,
`num_enum`, `num_enum_derive`, `proc-macro-crate`, `stable_deref_trait`, `thiserror 1.0.69`,
`thiserror-impl 1.0.69`, `toml_datetime`, `toml_edit`, `toml_parser`, `winnow`).

## 5. ADR-030 notice set

The notice is **generated at build time and is not a committed file**: `npm run generate:notice`
writes `frontends/shell/src/generated/NOTICE.txt`, which `.gitignore:13` excludes, and only
`npm run build`'s two-pass ordering produces a shippable one (`generateNotice.mjs`'s own header).
So there is no notice artifact in this diff to regenerate — there is a generator to re-run, and this
change reaches exactly one of its four sets: set 3, the Rust crates (sets 1, 2 and 4 are the two npm
metafiles and DuckDB's pinned amalgamation listing; no npm dependency and no DuckDB version changed
here).

Set 3's collector was run locally against the updated shell lockfile
(`collectLinkedCrates()` from `frontends/shell/scripts/rustCrateNotices.mjs`, target triple
`x86_64-pc-windows-msvc`):

- **352 linked crates enumerated**, the new ones among them, e.g. `geo 0.33.1 [MIT OR Apache-2.0]`,
  `wkb 0.9.2 [MIT OR Apache-2.0]`, `geo-traits 0.3.0 [MIT OR Apache-2.0]`, `rstar 0.12.2`,
  `spade 2.15.1`, `i_overlay 4.5.2`, `earcut 0.4.5 [ISC]`, `approx 0.5.1 [Apache-2.0]`.
- `buildCanonicalLicenseTexts()` — the **fail-closed** step that throws when a linked crate ships no
  licence file of its own and this repository carries no canonical text for its SPDX id — completed
  without throwing. The canonical-text ids the linked set needs are still exactly the four
  `LICENSES/` already carries: `Apache-2.0`, `BSD-3-Clause`, `MIT`, `MPL-2.0`. **No fifth id is
  introduced by this change**, so no new file under `LICENSES/` is owed.
- Of the new crates, those shipping no licence file of their own — and therefore attributed through
  a canonical text — are `geo 0.33.1`, `geo-traits 0.3.0`, `i_overlay 4.5.2`, `i_key_sort 0.10.3`,
  `rstar 0.12.2`.

The full generator (`npm run generate:notice`) additionally needs this package's `node_modules` and
both esbuild/Vite metafiles, which do not exist in this worktree; it runs in the shell's own build
and CI (`.github/workflows/product-ci-shell.yml`), where `npm run verify` runs `build` and
`check:dist-notice`. Stated rather than implied: **the packaged notice was not produced here**, and
what was checked locally is the one set this change touches and the generator's own fail-closed
licence-text guard over it.

## 6. How to reproduce

```
CARGO_TARGET_DIR=C:/dev/spatial-ide/target cargo metadata --offline --format-version 1 > /dev/null
CARGO_TARGET_DIR=C:/dev/spatial-ide/target cargo tree -e normal --prefix none --format "{p} {l}" | sort -u
```

from the workspace root, and, from `frontends/shell`:

```
node -e "import('./scripts/rustCrateNotices.mjs').then(m => { const c = m.collectLinkedCrates(); const t = m.buildCanonicalLicenseTexts(c, { repoRoot: '../..' }); console.log(c.length, [...t.keys()]); })"
```

(`repoRoot` must resolve to the repository root for the canonical texts to be found.)

## 7. Addendum (2026-09-16) — the free-disk preflight's platform call

The human's ruling of 2026-09-16 (question round 6, recorded as `engine/LOD-PREREGISTRATION.md` §10
Amendment 6) requires a free-disk preflight before the first tier is written. `std::fs` has no
free-space call, so `engine/src/lod.rs` calls `GetDiskFreeSpaceExW` through `windows-sys`, declared
under `[target.'cfg(windows)'.dependencies]` with the single feature `Win32_Storage_FileSystem`.

**No crate and no crate version enters either tree.** `windows-sys 0.61.2` was already resolved in
both lockfiles before this change (the workspace's via `tokio`/`getrandom`/`duckdb`; the shell's via
those and `tauri`), so it is already in the conveyed artifact's notice set. The lockfile diffs are
one line each — `windows-sys 0.61.2` added to `spatial-engine`'s own dependency list — and no other
package or version moved:

```
 Cargo.lock                           | 1 +
 frontends/shell/src-tauri/Cargo.lock | 1 +
```

- **I1 (a second Arrow major): still does not fire.** `windows-sys` reaches no Arrow crate; every
  `arrow*` and `parquet` stays at 58.4.0.
- **I4 (licence): nothing added.** No package was added, so the closure recorded in §2 is unchanged.
  `windows-sys` itself is `MIT OR Apache-2.0`, already recorded in both trees.
- **ADR-030.** The notice set's Rust source is the shell lockfile, which gains no package — the
  crate it now names for `spatial-engine` was already enumerated for the artifact. No new SPDX id,
  so `buildCanonicalLicenseTexts`' fail-closed step still needs exactly the four texts `LICENSES/`
  carries.

The in-tree precedent for calling a Win32 API this way is `protocol/transport-bakeoff/src/memory.rs`
(`GetProcessMemoryInfo` through the same crate). On a non-Windows target the reading is `None` and
the preflight fails closed, which is recorded at the function's own site rather than left to be
discovered.
