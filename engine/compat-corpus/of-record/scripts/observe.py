"""Observe a GeoParquet file. Every value returned here was read from the file's
own bytes -- nothing is inferred, and nothing here calls a file correct,
incorrect, admissible or refusable.

`observe(path)` returns the dict that MANIFEST.json stores under "observed".
build_manifest.py imports it, so the manifest and this CLI can never disagree.

CLI:  python observe.py <file> [<file> ...]
"""
import hashlib
import json
import os
import sys

import pyarrow.parquet as pq

PARQUET_MAGIC = b"PAR1"


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def tail_facts(path):
    """The last 8 bytes of a Parquet file are <uint32 footer length LE><'PAR1'>.

    Read as bytes; no Parquet library is involved, so this works on files that
    cannot be opened as Parquet at all.
    """
    size = os.path.getsize(path)
    out = {"bytes": size, "tail_magic_present": False, "footer_length_field": None,
           "head_magic_present": False}
    with open(path, "rb") as f:
        if size >= 4:
            out["head_magic_present"] = f.read(4) == PARQUET_MAGIC
        if size >= 8:
            f.seek(-8, os.SEEK_END)
            tail = f.read(8)
            out["tail_magic_present"] = tail[4:] == PARQUET_MAGIC
            if out["tail_magic_present"]:
                out["footer_length_field"] = int.from_bytes(tail[:4], "little")
    return out


def crs_shape(col):
    if "crs" not in col:
        return "absent-key"
    crs = col["crs"]
    if crs is None:
        return "null"
    if isinstance(crs, dict):
        ident = crs.get("id")
        if isinstance(ident, dict) and "authority" in ident and "code" in ident:
            return "projjson:%s:%s" % (ident["authority"], ident["code"])
        return "projjson:%s" % crs.get("name", "<no id, no name>")
    return "other:" + type(crs).__name__


def _axis_list(crs):
    """The coordinate_system.axis list of a PROJJSON object, in file order.

    Read from the top-level "coordinate_system" only. For a ProjectedCRS that is
    the projected system (the one the coordinates are in); its base_crs carries a
    different axis list and is deliberately not substituted here.
    """
    if not isinstance(crs, dict):
        return None
    cs = crs.get("coordinate_system")
    if not isinstance(cs, dict):
        return None
    axis = cs.get("axis")
    if not isinstance(axis, list):
        return None
    return axis


def crs_axis_names(crs):
    axis = _axis_list(crs)
    if axis is None:
        return None
    return [a.get("name") if isinstance(a, dict) else None for a in axis]


def crs_axis_directions(crs):
    axis = _axis_list(crs)
    if axis is None:
        return None
    return [a.get("direction") if isinstance(a, dict) else None for a in axis]


def observe(path):
    """The MANIFEST.json "observed" object for one file."""
    out = {}
    try:
        pf = pq.ParquetFile(path)
    except Exception as exc:  # a mutation may not be openable as Parquet at all
        out["parquet_open_error"] = "%s: %s" % (type(exc).__name__, exc)
        out["geo_metadata_key_present"] = None
        out["parquet_footer_created_by"] = None
        out["row_count"] = None
        out["row_group_count"] = None
        return out

    md = pf.schema_arrow.metadata or {}
    raw = md.get(b"geo")
    out["parquet_open_error"] = None
    out["geo_metadata_key_present"] = raw is not None
    out["parquet_footer_created_by"] = pf.metadata.created_by
    out["row_count"] = pf.metadata.num_rows
    out["row_group_count"] = pf.metadata.num_row_groups

    if raw is not None:
        try:
            geo = json.loads(raw)
            out["geo_metadata_parses_as_json"] = True
        except Exception as exc:
            geo = None
            out["geo_metadata_parses_as_json"] = False
            out["geo_metadata_json_error"] = "%s: %s" % (type(exc).__name__, exc)
        if isinstance(geo, dict):
            prim = geo.get("primary_column")
            col = (geo.get("columns") or {}).get(prim, {}) or {}
            crs = col.get("crs")
            out.update({
                "geo_version": geo.get("version"),
                "geo_creator_key_present": "creator" in geo,
                "geo_creator": geo.get("creator"),
                "geo_top_level_keys": sorted(geo.keys()),
                "primary_geometry_column": prim,
                "geometry_columns_listed": sorted((geo.get("columns") or {}).keys()),
                "geometry_encoding": col.get("encoding"),
                "geometry_types": col.get("geometry_types"),
                "crs_key_present": "crs" in col,
                "crs_shape": crs_shape(col),
                "crs_projjson_name": crs.get("name") if isinstance(crs, dict) else None,
                "crs_projjson_id": crs.get("id") if isinstance(crs, dict) else None,
                "crs_axis_names": crs_axis_names(crs),
                "crs_axis_directions": crs_axis_directions(crs),
                "covering_present": "covering" in col,
                "covering": col.get("covering"),
                "bbox_present_in_column_metadata": "bbox" in col,
                "bbox": col.get("bbox"),
                "edges": col.get("edges"),
                "geometry_column_metadata_keys": sorted(col.keys()),
            })

    cols, ints, strs = [], [], []
    for field in pf.schema_arrow:
        t = str(field.type)
        cols.append({"name": field.name, "arrow_type": t, "nullable": field.nullable})
        if t.startswith(("int", "uint")):
            ints.append({"name": field.name, "arrow_type": t})
        if t in ("string", "large_string", "string_view"):
            strs.append({"name": field.name, "arrow_type": t})
    out["columns"] = cols
    out["integer_typed_columns"] = ints
    out["string_typed_columns"] = strs
    return out


if __name__ == "__main__":
    for p in sys.argv[1:]:
        print("=====", p)
        rec = {"bytes": os.path.getsize(p), "sha256": sha256(p)}
        rec.update(tail_facts(p))
        rec["observed"] = observe(p)
        print(json.dumps(rec, indent=2, ensure_ascii=False))
