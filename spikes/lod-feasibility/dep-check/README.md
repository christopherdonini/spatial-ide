# LOD route-B dependency gate step — evidence (2026-09-16, read-only, nothing built)

The pre-code gate step of `engine/LOD-PREREGISTRATION.md` §8 items 1 and 3 and invalidator I1,
run under the human's ruling of 2026-09-16 (question round 3, item 2: the crate set is approved
"subject to the gate steps in the draft's §8: transitive licence closures recorded compatible before
any cargo add; the piece stops if a second Arrow major appears"). A throwaway probe crate
(`Cargo.toml` here: `geo = "=0.33.1"`, `wkb = "=0.9.2"`, `geo-traits = "=0.3.0"` beside the
workspace's own pins `arrow = { version = "58", default-features = false, features = ["ipc"] }`
and `parquet = { version = "58", default-features = false, features = ["arrow", "snap"] }`,
quoted from `Cargo.toml:45` and `engine/Cargo.toml:37`) was resolved with `cargo generate-lockfile`
(`Locking 146 packages`; cargo 1.97.1). Nothing under the product tree was touched; nothing compiled.

## A — I1 (a second Arrow major): does NOT fire

Every `arrow*` and `parquet` crate resolves at **58.4.0** (`inverse-trees.txt`, 13 inverse trees).
The only roots reaching any Arrow crate are the probe's own `arrow = "58"` and `parquet v58.4.0`.
**`geo`, `wkb` and `geo-traits` appear in no Arrow inverse tree.** `wkb-0.9.2/Cargo.toml` has no
`[features]` table and no arrow dependency (deps: byteorder, geo-traits, num_enum, thiserror);
`geo-traits-0.3.0`'s only dependency is the optional default `geo-types`; `geo-0.33.1` names neither
arrow nor parquet. The spike crate's Arrow 59 was the spike author's own direct lines
(`spikes/lod-feasibility/rust/Cargo.toml:18,21`), not a constraint from the three crates.

## B — licence closure

`added-closure.txt`: the closure introduced by the three crates over a parquet+arrow-only baseline
(`baseline/`) is **49 crates**, no existing crate version shifted. Licence expressions present:
`MIT`, `Apache-2.0`, `MIT OR Apache-2.0`, `Apache-2.0 OR MIT`, `ISC` (earcut 0.4.5), `Zlib`
(foldhash 0.2.0), and `BSD-3-Clause OR MIT OR Apache-2.0` (`num_enum` 0.7.6 and
`num_enum_derive` 0.7.6, pulled by `wkb` alone). No crate has an empty or unknown licence field;
no GPL/LGPL/MPL/BSL expression appears in the added closure. `full-tree-licences.txt` lists the
whole resolved tree (106 crates); its remaining non-allowlisted expressions (`Unlicense OR MIT`,
`Apache-2.0 AND MIT`, `Apache-2.0 OR BSL-1.0` for ryu, `(MIT OR Apache-2.0) AND Unicode-3.0`,
legacy `MIT/Apache-2.0`) are all **pre-existing in the parquet+arrow baseline**, not introduced here.

Compatibility with the workspace's `AGPL-3.0-or-later` core is the human's judgment (I4,
ADR-009); this file records the facts. Two notes for ADR-030's notice set when the piece lands:
`byteorder` gains new paths (via `wkb`, and `geo→rstar→heapless→hash32`); `thiserror` sits at both
1.0.69 (via wkb) and 2.0.20 (via geo-types).

The tier-builder piece re-runs this check at `cargo add` time against the real workspace and
records the result in its PR; this directory is the gate step's evidence, not the PR's.
