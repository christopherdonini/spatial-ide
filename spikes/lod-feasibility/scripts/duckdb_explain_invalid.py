#!/usr/bin/env python3
"""LOD feasibility spike -- route (A) counterpart to the Rust `explain` mode.

Added 2026-09-15 for DECISIONS-PENDING question set C, item C3 step 3: "route B's
invalid-output divergence is explained before either route is preregistered".

Runs DuckDB spatial's `ST_Simplify` on exactly the feature ids that route B's
`geo::Simplify` turned invalid, and reports, per id, the input/output vertex counts,
`ST_IsValid`, `ST_IsValidReason` (if the build has it), and `ST_AsText` -- so the two
routes' outputs for the same feature can be compared vertex-for-vertex.

Offline by construction: it calls `LOAD spatial` only, never `INSTALL`. The extension is
expected to be already present in the local cache; if it is not, this script fails loudly
rather than reaching the network. It also records `duckdb_extensions()`' `install_mode` for
the spatial row, which is the runtime-fetch fact question C3 step 1 asks about.

Not shipped, not wired into the product. Run with the repo's pinned venv:
    C:\\dev\\spatial-ide\\target\\corpus-venv\\Scripts\\python.exe duckdb_explain_invalid.py ...

Every number emitted here is a spike measurement, not a docs/08 product perf claim; no wall
times are reported at all because this is a correctness explanation, not a benchmark.
"""
import argparse
import json
import sys

import duckdb


def connect_offline():
    """LOAD only -- never INSTALL. Raises if the extension is not already cached locally."""
    con = duckdb.connect()
    con.sql("LOAD spatial;")
    return con


def extension_facts(con):
    query = (
        "SELECT extension_name, loaded, installed, install_path, extension_version, "
        "install_mode FROM duckdb_extensions() WHERE extension_name='spatial'"
    )
    row = con.sql(query).fetchone()
    return {
        "query": query,
        "extension_name": row[0],
        "loaded": row[1],
        "installed": row[2],
        "install_path": row[3],
        "extension_version": row[4],
        "install_mode": row[5],
        "duckdb_python_version": duckdb.__version__,
        "duckdb_engine_version": con.sql("SELECT version()").fetchone()[0],
    }


def try_scalar(con, expr, where_id):
    """Evaluate one scalar expression for one id, degrading gracefully if the build lacks
    the function (so a missing ST_IsValidReason is reported as unavailable, never faked)."""
    try:
        return con.sql(f"SELECT {expr} FROM feats WHERE id = {where_id}").fetchone()[0], None
    except Exception as e:  # noqa: BLE001 -- report whatever DuckDB raises, verbatim
        return None, f"{type(e).__name__}: {e}"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--input", required=True)
    ap.add_argument("--tolerance", type=float, required=True)
    ap.add_argument(
        "--ids",
        required=True,
        help="comma-separated feature ids (route B's invalid-output ids)",
    )
    ap.add_argument("--identity-column", default="id")
    ap.add_argument("--output", help="write the JSON result here as well as to stdout")
    args = ap.parse_args()

    ids = [int(s) for s in args.ids.split(",") if s.strip()]
    tol = args.tolerance

    con = connect_offline()
    ext = extension_facts(con)

    id_list = ", ".join(str(i) for i in ids)
    con.sql(
        f"CREATE TEMP TABLE feats AS SELECT {args.identity_column} AS id, geometry "
        f"FROM read_parquet('{args.input}') WHERE {args.identity_column} IN ({id_list})"
    )
    found = [r[0] for r in con.sql("SELECT id FROM feats ORDER BY id").fetchall()]

    simple = f"ST_Simplify(geometry, {tol})"
    preserve = f"ST_SimplifyPreserveTopology(geometry, {tol})"

    exprs = {
        "input_npoints": "ST_NPoints(geometry)",
        "input_is_valid": "ST_IsValid(geometry)",
        "input_is_valid_reason": "ST_IsValidReason(geometry)",
        "input_n_interior_rings": "ST_NumInteriorRings(geometry)",
        "input_exterior_npoints": "ST_NPoints(ST_ExteriorRing(geometry))",
        "input_interior0_npoints": "ST_NPoints(ST_InteriorRingN(geometry, 1))",
        "simple_npoints": f"ST_NPoints({simple})",
        "simple_is_valid": f"ST_IsValid({simple})",
        "simple_is_valid_reason": f"ST_IsValidReason({simple})",
        "simple_n_interior_rings": f"ST_NumInteriorRings({simple})",
        "simple_exterior_npoints": f"ST_NPoints(ST_ExteriorRing({simple}))",
        "simple_interior0_npoints": f"ST_NPoints(ST_InteriorRingN({simple}, 1))",
        "preserve_npoints": f"ST_NPoints({preserve})",
        "preserve_is_valid": f"ST_IsValid({preserve})",
        # Ring-collapse probe: simplify interior ring 0 on its own, both as a bare LINESTRING
        # and as a POLYGON made from that ring. GEOS's DouglasPeuckerSimplifier drops a
        # polygon ring whose simplified form is no longer a valid LinearRing; these two
        # expressions show whether that is what happened to the hole.
        "interior0_alone_line_npoints": f"ST_NPoints(ST_Simplify(ST_InteriorRingN(geometry, 1), {tol}))",
        "interior0_alone_line_wkt": f"ST_AsText(ST_Simplify(ST_InteriorRingN(geometry, 1), {tol}))",
        "interior0_alone_poly_npoints": f"ST_NPoints(ST_Simplify(ST_MakePolygon(ST_InteriorRingN(geometry, 1)), {tol}))",
        "interior0_alone_poly_wkt": f"ST_AsText(ST_Simplify(ST_MakePolygon(ST_InteriorRingN(geometry, 1)), {tol}))",
        "input_wkt": "ST_AsText(geometry)",
        "simple_wkt": f"ST_AsText({simple})",
        "preserve_wkt": f"ST_AsText({preserve})",
    }

    per_feature = []
    for fid in ids:
        rec = {"id": fid, "found_in_input": fid in found}
        if not rec["found_in_input"]:
            per_feature.append(rec)
            continue
        for name, expr in exprs.items():
            value, err = try_scalar(con, expr, fid)
            if err is None:
                rec[name] = value
            else:
                rec[name] = None
                rec[name + "_error"] = err
        rec["_expressions"] = exprs
        per_feature.append(rec)

    result = {
        "route": "A-duckdb",
        "mode": "explain",
        "purpose": (
            "C3 step 3: run route A's ST_Simplify on exactly the ids route B's geo::Simplify "
            "turned invalid, at the same tolerance, on the same input"
        ),
        "input": args.input,
        "tolerance": tol,
        "ids_requested": ids,
        "ids_found": found,
        "extension": ext,
        "features": per_feature,
    }

    text = json.dumps(result, indent=2, default=str)
    print(text)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text + "\n")


if __name__ == "__main__":
    sys.exit(main())
