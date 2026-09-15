#!/usr/bin/env python3
"""LOD feasibility spike -- C3 step 1 evidence: does libduckdb-sys's vendored DuckDB source
archive contain any spatial-extension source?

Added 2026-09-15 for DECISIONS-PENDING question set C, item C3 step 1 ("can DuckDB's spatial
extension be statically bundled with no runtime fetch -- the ADR-021 security property").

Read-only and fully offline: it opens the crate's `duckdb.tar.gz` in streaming mode, never
extracts it to disk, and reports (a) how many regular file members it has, (b) any member path
containing "spatial", (c) a byte-level search for spatial marker strings across every member,
and (d) the `extensions` keys of the archive's own `manifest.json` -- which is the list
`build_bundled_cc.rs` filters with `extension_enabled()`.

Not shipped, not wired into the product. Run with any Python 3; the repo's pinned venv works:
    C:\\dev\\spatial-ide\\target\\corpus-venv\\Scripts\\python.exe scan_bundled_duckdb_sources.py \\
        --archive "C:\\Users\\<user>\\.cargo\\registry\\src\\index.crates.io-<hash>\\libduckdb-sys-1.10505.0\\duckdb.tar.gz"
"""
import argparse
import json
import tarfile

DEFAULT_MARKERS = ["ST_Simplify", "spatial_extension", "SpatialExtension", "GEOSSimplify", "ST_NPoints"]


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--archive", required=True, help="path to libduckdb-sys's duckdb.tar.gz")
    ap.add_argument("--markers", default=",".join(DEFAULT_MARKERS))
    args = ap.parse_args()

    markers = [m.encode("utf-8") for m in args.markers.split(",") if m.strip()]
    hits = {m: [] for m in markers}
    paths_with_spatial = []
    manifest = None
    n_files = 0

    with tarfile.open(args.archive, "r:gz") as tf:
        for member in tf:
            if not member.isfile():
                continue
            n_files += 1
            if "spatial" in member.name.lower():
                paths_with_spatial.append(member.name)
            data = tf.extractfile(member).read()
            if member.name.endswith("manifest.json"):
                manifest = json.loads(data.decode("utf-8"))
            for mk in markers:
                if mk in data:
                    hits[mk].append(member.name)

    result = {
        "archive": args.archive,
        "regular_file_members": n_files,
        "member_paths_containing_spatial": paths_with_spatial,
        "marker_hits": {mk.decode(): files for mk, files in hits.items()},
        "manifest_extensions": sorted(manifest.get("extensions", {}).keys()) if manifest else None,
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
