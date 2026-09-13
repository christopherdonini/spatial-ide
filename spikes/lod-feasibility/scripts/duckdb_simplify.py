#!/usr/bin/env python3
"""LOD feasibility spike -- route (A): DuckDB spatial, measurement-only dev CLI.

Not shipped, not wired into the product. Run with the repo's pinned venv:
    C:\\dev\\spatial-ide\\target\\corpus-venv\\Scripts\\python.exe duckdb_simplify.py ...

Two subcommands:
  run     -- simplify one (input, tolerance, variant) into an output GeoParquet,
             measuring wall time, disk size, vertex reduction, validity, and identity
             preservation against the input.
  cancel  -- start the same simplification in a worker thread, call conn.interrupt()
             from the main thread after a declared delay, and measure how long the
             worker takes to stop and what is left on disk.

Everything here is a spike measurement (docs/08: product perf claims need docs/08
method; this is not that -- it is labelled a spike result throughout).
"""
import argparse
import json
import os
import sys
import threading
import time

import duckdb


def _connect():
    con = duckdb.connect()
    con.sql("INSTALL spatial; LOAD spatial;")
    return con


def _fn(variant: str) -> str:
    return {
        "preserve": "ST_SimplifyPreserveTopology",
        "simple": "ST_Simplify",
    }[variant]


def cmd_run(args):
    con = _connect()
    fn = _fn(args.variant)

    before = con.sql(
        f"SELECT count(*) AS n, sum(ST_NPoints(geometry)) AS pts "
        f"FROM read_parquet('{args.input}')"
    ).fetchone()

    if os.path.exists(args.output):
        os.remove(args.output)

    t0 = time.perf_counter()
    con.sql(
        f"""
        COPY (
            SELECT {args.identity_column} AS id,
                   {fn}(geometry, {args.tolerance}) AS geometry
            FROM read_parquet('{args.input}')
        ) TO '{args.output}' (FORMAT PARQUET)
        """
    )
    wall_s = time.perf_counter() - t0

    out_size = os.path.getsize(args.output)
    in_size = os.path.getsize(args.input)

    after = con.sql(
        f"SELECT count(*) AS n, sum(ST_NPoints(geometry)) AS pts, "
        f"sum(CASE WHEN ST_IsValid(geometry) THEN 0 ELSE 1 END) AS invalid "
        f"FROM read_parquet('{args.output}')"
    ).fetchone()

    id_stats = con.sql(
        f"""
        SELECT
          (SELECT count(*) FROM read_parquet('{args.input}')) AS n_in,
          (SELECT count(*) FROM read_parquet('{args.output}')) AS n_out,
          (SELECT count(*) FROM (
              SELECT id FROM read_parquet('{args.output}') GROUP BY id HAVING count(*) > 1
          )) AS duplicate_ids_out,
          (SELECT count(*) FROM (
              SELECT {args.identity_column} AS id FROM read_parquet('{args.input}')
              EXCEPT SELECT id FROM read_parquet('{args.output}')
          )) AS missing_from_output,
          (SELECT count(*) FROM (
              SELECT id FROM read_parquet('{args.output}')
              EXCEPT SELECT {args.identity_column} AS id FROM read_parquet('{args.input}')
          )) AS extra_in_output
        """
    ).fetchone()

    result = {
        "route": "A-duckdb",
        "variant": args.variant,
        "function": fn,
        "input": args.input,
        "output": args.output,
        "tolerance": args.tolerance,
        "wall_s": wall_s,
        "input_bytes": in_size,
        "output_bytes": out_size,
        "output_over_input_ratio": out_size / in_size if in_size else None,
        "features_before": before[0],
        "features_after": after[0],
        "vertices_before": before[1],
        "vertices_after": after[1],
        "vertex_reduction_ratio": (
            1.0 - (after[1] / before[1]) if before[1] else None
        ),
        "invalid_after": after[2],
        "identity": {
            "n_in": id_stats[0],
            "n_out": id_stats[1],
            "duplicate_ids_out": id_stats[2],
            "missing_from_output": id_stats[3],
            "extra_in_output": id_stats[4],
            "preserved": (
                id_stats[0] == id_stats[1]
                and id_stats[2] == 0
                and id_stats[3] == 0
                and id_stats[4] == 0
            ),
        },
    }
    print(json.dumps(result, indent=2))
    return result


def cmd_cancel(args):
    con = _connect()
    fn = _fn(args.variant)

    if os.path.exists(args.output):
        os.remove(args.output)

    worker_result = {}

    def worker():
        t0 = time.perf_counter()
        try:
            con.sql(
                f"""
                COPY (
                    SELECT {args.identity_column} AS id,
                           {fn}(geometry, {args.tolerance}) AS geometry
                    FROM read_parquet('{args.input}')
                ) TO '{args.output}' (FORMAT PARQUET)
                """
            )
            worker_result["completed"] = True
            worker_result["error"] = None
        except Exception as e:  # noqa: BLE001 -- report whatever DuckDB raises
            worker_result["completed"] = False
            worker_result["error"] = str(e)
        worker_result["worker_wall_s"] = time.perf_counter() - t0

    th = threading.Thread(target=worker, daemon=True)
    th.start()
    time.sleep(args.interrupt_after_s)
    t_interrupt = time.perf_counter()
    con.interrupt()
    th.join(timeout=args.join_timeout_s)
    t_after_join = time.perf_counter()

    output_exists = os.path.exists(args.output)
    output_size = os.path.getsize(args.output) if output_exists else 0

    result = {
        "route": "A-duckdb",
        "mode": "cancel",
        "input": args.input,
        "tolerance": args.tolerance,
        "interrupt_after_s_requested": args.interrupt_after_s,
        "join_timeout_s": args.join_timeout_s,
        "thread_alive_after_join": th.is_alive(),
        "time_from_interrupt_to_join_return_s": t_after_join - t_interrupt,
        "worker": worker_result,
        "output_exists": output_exists,
        "output_bytes": output_size,
    }
    print(json.dumps(result, indent=2))
    return result


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(dest="cmd", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--input", required=True)
    common.add_argument("--output", required=True)
    common.add_argument("--tolerance", type=float, required=True)
    common.add_argument("--variant", choices=["preserve", "simple"], default="preserve")
    common.add_argument("--identity-column", default="id")

    p_run = sub.add_parser("run", parents=[common])
    p_run.set_defaults(func=cmd_run)

    p_cancel = sub.add_parser("cancel", parents=[common])
    p_cancel.add_argument("--interrupt-after-s", type=float, default=0.05)
    p_cancel.add_argument("--join-timeout-s", type=float, default=30.0)
    p_cancel.set_defaults(func=cmd_cancel)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    sys.exit(main())
