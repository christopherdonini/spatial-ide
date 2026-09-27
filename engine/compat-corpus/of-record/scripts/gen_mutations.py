"""Derive the mutations/ directory from named main-set files.

Each mutation changes exactly one thing about one base file. Nothing here says
what a reader should do with the result: the expected outcomes are pre-declared
in engine/ADMISSION-PREREGISTRATION.md, not in this corpus.

Writes mutations/DERIVATIONS.json, which build_manifest.py reads so the manifest
records the byte offsets and parameters actually used, not a description of them.

Run:  target\\corpus-venv\\Scripts\\python.exe scripts\\gen_mutations.py
"""
import json
import os
import shutil
import sys

import pyarrow.parquet as pq

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import observe  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "mutations")

BASE_A = "geopandas/gp-epsg2056-intkey.parquet"
BASE_C = "gdal/ogr2ogr-epsg2056-default.parquet"

TRUNCATE_BYTES = 1024
INVALID_GEO_JSON = b'{"version": "1.1.0", "primary_column": "geometry", "columns": {'
ABSENT_COLUMN = "no_such_bbox_column"


def _p(rel):
    return os.path.join(ROOT, rel.replace("/", os.sep))


def _rewrite_geo(base_rel, out_name, new_geo_bytes, note):
    """Read the base with pyarrow, replace the schema's `geo` key-value metadata,
    write a new file. The rewrite is a pyarrow write, so the Parquet footer's
    created_by becomes pyarrow's, not the base writer's.
    """
    src, dst = _p(base_rel), os.path.join(OUT, out_name)
    table = pq.read_table(src)
    md = dict(table.schema.metadata or {})
    md[b"geo"] = new_geo_bytes
    table = table.replace_schema_metadata(md)
    pq.write_table(table, dst)
    return {
        "path": "mutations/" + out_name,
        "derived_from": base_rel,
        "derivation": note,
    }


def truncated():
    src = _p(BASE_A)
    out_name = "gp-epsg2056-intkey-truncated.parquet"
    dst = os.path.join(OUT, out_name)
    with open(src, "rb") as f:
        data = f.read()
    with open(dst, "wb") as f:
        f.write(data[:-TRUNCATE_BYTES])
    return {
        "path": "mutations/" + out_name,
        "derived_from": BASE_A,
        "derivation": (
            "copy of the base with the last {n} bytes not written: "
            "open(base, 'rb').read()[:-{n}] written to mutations/{o}. The "
            "trailing <uint32 footer length><'PAR1'> is inside the removed "
            "range.".format(n=TRUNCATE_BYTES, o=out_name)),
        "parameters": {"bytes_removed_from_end": TRUNCATE_BYTES},
    }


def geojson_invalid():
    note = (
        "pyarrow: pq.read_table(base); the schema key-value metadata key b'geo' "
        "replaced with the byte string " + INVALID_GEO_JSON.decode() +
        " (a JSON object that is never closed); pq.write_table(...). All other "
        "schema metadata keys are carried over unchanged.")
    return _rewrite_geo(BASE_A, "gp-epsg2056-intkey-geojson-invalid.parquet",
                        INVALID_GEO_JSON, note)


def covering_absent_columns():
    src = _p(BASE_C)
    geo = json.loads(pq.ParquetFile(src).schema_arrow.metadata[b"geo"])
    prim = geo["primary_column"]
    before = geo["columns"][prim].get("covering")
    geo["columns"][prim]["covering"] = {
        "bbox": {
            "xmin": [ABSENT_COLUMN, "xmin"],
            "ymin": [ABSENT_COLUMN, "ymin"],
            "xmax": [ABSENT_COLUMN, "xmax"],
            "ymax": [ABSENT_COLUMN, "ymax"],
        }
    }
    new = json.dumps(geo, separators=(",", ":")).encode()
    note = (
        "pyarrow: the base's geo metadata was parsed, its geometry column's "
        "covering.bbox members were repointed from the real struct column "
        "\"geometry_bbox\" to \"" + ABSENT_COLUMN + "\" (a name that is not in "
        "the file's schema), and the file was rewritten with pq.write_table. "
        "Nothing else in the geo metadata was changed.")
    rec = _rewrite_geo(
        BASE_C, "ogr2ogr-epsg2056-default-covering-absent-columns.parquet",
        new, note)
    rec["parameters"] = {
        "covering_bbox_column_name_written": ABSENT_COLUMN,
        "covering_in_base": before,
    }
    return rec


def changed_same_size():
    src = _p(BASE_A)
    out_name = "gp-epsg2056-intkey-changed-same-size.parquet"
    dst = os.path.join(OUT, out_name)
    shutil.copy2(src, dst)  # copy2 carries the base's mtime across
    st_before = os.stat(dst)

    pf = pq.ParquetFile(src)
    names = [f.name for f in pf.schema_arrow]
    col_index = names.index("geometry") if "geometry" in names else 0
    cc = pf.metadata.row_group(0).column(col_index)
    start = cc.dictionary_page_offset or cc.data_page_offset
    offset = start + cc.total_compressed_size // 2  # inside the compressed page data

    with open(dst, "r+b") as f:
        f.seek(offset)
        old = f.read(1)[0]
        f.seek(offset)
        f.write(bytes([old ^ 0x01]))
    new = old ^ 0x01

    os.utime(dst, ns=(st_before.st_atime_ns, st_before.st_mtime_ns))
    st_after = os.stat(dst)
    st_src = os.stat(src)
    return {
        "path": "mutations/" + out_name,
        "derived_from": BASE_A,
        "derivation": (
            "shutil.copy2 of the base, then one byte at absolute offset {off} "
            "XORed with 0x01 in place (0x{a:02X} -> 0x{b:02X}), then os.utime "
            "to put the base's mtime back. The offset is column chunk {i} "
            "(\"{n}\") of row group 0, at its first page offset {s} plus half "
            "its compressed size {c}, i.e. inside the compressed page data and "
            "not in the footer.".format(off=offset, a=old, b=new, i=col_index,
                                        n=names[col_index], s=start,
                                        c=cc.total_compressed_size)),
        "parameters": {
            "byte_offset": offset,
            "byte_before": "0x%02X" % old,
            "byte_after": "0x%02X" % new,
            "column_chunk_index": col_index,
            "column_chunk_name": names[col_index],
            "row_group": 0,
            "first_page_offset": start,
            "total_compressed_size": cc.total_compressed_size,
            "size_equals_base": os.path.getsize(dst) == os.path.getsize(src),
            "mtime_ns": st_after.st_mtime_ns,
            "base_mtime_ns": st_src.st_mtime_ns,
            "mtime_ns_restored_to_base": st_after.st_mtime_ns == st_src.st_mtime_ns,
        },
    }


def appended():
    src = _p(BASE_A)
    out_name = "gp-epsg2056-intkey-appended.parquet"
    dst = os.path.join(OUT, out_name)
    table = pq.read_table(src)
    with pq.ParquetWriter(dst, table.schema) as w:
        w.write_table(table)   # row group 1: the base's rows
        w.write_table(table)   # row group 2: the same rows again
    return {
        "path": "mutations/" + out_name,
        "derived_from": BASE_A,
        "derivation": (
            "pyarrow: t = pq.read_table(base); pq.ParquetWriter(dst, t.schema) "
            "with w.write_table(t) called twice, so the file carries the base's "
            "rows as row group 1 and the same rows again as row group 2. The "
            "schema key-value metadata, including geo, is the base's, carried "
            "through pq.read_table unchanged. This is a rewrite, not a byte "
            "append: a Parquet footer cannot be appended to in place."),
        "parameters": {"row_groups_written": 2},
    }


def main():
    os.makedirs(OUT, exist_ok=True)
    recs = [truncated(), geojson_invalid(), covering_absent_columns(),
            changed_same_size(), appended()]
    for rec in recs:
        base = _p(rec["derived_from"])
        mut = _p(rec["path"])
        bt, mt = observe.tail_facts(base), observe.tail_facts(mut)
        bo, mo = observe.observe(base), observe.observe(mut)
        rec["observed_difference"] = {
            "base_bytes": bt["bytes"],
            "mutation_bytes": mt["bytes"],
            "bytes_changed": bt["bytes"] != mt["bytes"],
            "base_footer_length_field": bt["footer_length_field"],
            "mutation_footer_length_field": mt["footer_length_field"],
            "footer_length_changed":
                bt["footer_length_field"] != mt["footer_length_field"],
            "base_tail_magic_present": bt["tail_magic_present"],
            "mutation_tail_magic_present": mt["tail_magic_present"],
            "base_geo_metadata_parses_as_json":
                bo.get("geo_metadata_parses_as_json"),
            "mutation_geo_metadata_parses_as_json":
                mo.get("geo_metadata_parses_as_json"),
            "mutation_parquet_open_error": mo.get("parquet_open_error"),
            "base_sha256": observe.sha256(base),
            "mutation_sha256": observe.sha256(mut),
        }
        d = rec["observed_difference"]
        print("%-56s %8d bytes  footer_len %s -> %s  geo parses %s -> %s" % (
            os.path.basename(rec["path"]), d["mutation_bytes"],
            d["base_footer_length_field"], d["mutation_footer_length_field"],
            d["base_geo_metadata_parses_as_json"],
            d["mutation_geo_metadata_parses_as_json"]))

    out = os.path.join(OUT, "DERIVATIONS.json")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        json.dump({"generated_by": "scripts/gen_mutations.py",
                   "mutations": recs}, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("wrote", out)


if __name__ == "__main__":
    main()
