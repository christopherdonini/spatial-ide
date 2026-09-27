"""Rebuild MANIFEST.json for the GeoParquet compatibility corpus.

Every value under "observed" comes from scripts/observe.py, i.e. from the file's
own bytes. This script contributes only provenance: what produced each file, and
with which command or URL. It states no expected admission outcome.

Run:  target\\corpus-venv\\Scripts\\python.exe scripts\\build_manifest.py
"""
import json
import os
import platform
import sys

import pyarrow

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import observe  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATE = "2026-09-10"
GPC = "4c9f87e5226e36f2022d6bd7d3c1980debdf7431"
GDC = "03fc216e1fc4af769c651a58176cae602417cca3"
VENV = r"C:\dev\spatial-ide\target\corpus-venv"
QGIS_ROOT = r"C:\Program Files\QGIS 3.44.2"

GEN_GP = ("GeoPandas 1.1.4 GeoDataFrame.to_parquet (writing through pyarrow 25.0.1); "
          "generator script gen_geopandas.py run in " + VENV)
GEN_DD = ("DuckDB 1.5.5 with the spatial extension loaded: "
          "COPY (SELECT ...) TO '<file>' (FORMAT PARQUET); "
          "generator script gen_duckdb.py run in " + VENV)

OGR = QGIS_ROOT + r"\bin\ogr2ogr.exe"
QP = QGIS_ROOT + r"\apps\qgis\bin\qgis_process.exe"
CORPUS_W = ROOT.replace("/", os.sep)


def ogr_cmd(out_rel, src_rel, extra=""):
    return ('"%s" -f Parquet %s %s%s   (run %s by scripts/gen_gdal.py, in the '
            'environment scripts/qgis_env.py builds)'
            % (OGR, os.path.join(CORPUS_W, out_rel.replace("/", os.sep)),
               os.path.join(CORPUS_W, src_rel.replace("/", os.sep)),
               (" " + extra) if extra else "", DATE))


def qgis_cmd(alg, out_rel, src_rel):
    return ('"%s" run %s -- INPUT=%s OUTPUT=%s   (run %s by scripts/gen_qgis.py, '
            'in the environment scripts/qgis_env.py builds; no GUI is started)'
            % (QP, alg,
               os.path.join(CORPUS_W, src_rel.replace("/", os.sep)),
               os.path.join(CORPUS_W, out_rel.replace("/", os.sep)), DATE))


GDAL_PIPE = ("GDAL OGR Parquet driver, run as ogr2ogr from the GDAL that ships "
             "inside QGIS 3.44.2 (see PROBE.json / probed_producers)")
QGIS_PIPE = ("QGIS processing, run headless as qgis_process from QGIS 3.44.2 "
             "(see PROBE.json / probed_producers)")

MAIN = [
    ("geopandas/gp-epsg2056-intkey.parquet", "GeoPandas / pyarrow",
     "geopandas 1.1.4, pyarrow 25.0.1", "generated", GEN_GP,
     "declared projected CRS EPSG:2056; integer key column; default writer options"),
    ("geopandas/gp-nocrs-nokey.parquet", "GeoPandas / pyarrow",
     "geopandas 1.1.4, pyarrow 25.0.1", "generated", GEN_GP,
     "GeoDataFrame written with crs=None; no integer-typed and no string-typed column"),
    ("geopandas/gp-epsg4326-covering.parquet", "GeoPandas / pyarrow",
     "geopandas 1.1.4, pyarrow 25.0.1", "generated",
     GEN_GP + ", called with write_covering_bbox=True",
     "declared EPSG:4326; integer and string columns; covering requested from the writer"),
    ("duckdb-spatial/duckdb-lv95range-intkey.parquet", "DuckDB spatial",
     "duckdb 1.5.5 (build d8cdaa33fd) + spatial extension", "generated", GEN_DD,
     "DuckDB GEOMETRY; coordinates in the LV95 numeric range; integer key column"),
    ("duckdb-spatial/duckdb-degreesrange-nokey.parquet", "DuckDB spatial",
     "duckdb 1.5.5 (build d8cdaa33fd) + spatial extension", "generated", GEN_DD,
     "DuckDB GEOMETRY; coordinates inside the +/-180 / +/-90 range; "
     "no integer-typed and no string-typed column"),
    ("duckdb-spatial/duckdb-mercatorrange-strkey.parquet", "DuckDB spatial",
     "duckdb 1.5.5 (build d8cdaa33fd) + spatial extension", "generated", GEN_DD,
     "DuckDB GEOMETRY polygons; coordinates in the Web Mercator numeric range; "
     "string key column"),
    ("gdal/ogr2ogr-epsg2056-default.parquet", GDAL_PIPE,
     "GDAL 3.11.3 OGR Parquet driver (ogr2ogr)", "generated",
     ogr_cmd("gdal/ogr2ogr-epsg2056-default.parquet",
             "geopandas/gp-epsg2056-intkey.parquet"),
     "GDAL rewrite of the GeoPandas EPSG:2056 file with no -lco at all, i.e. the "
     "Parquet driver's own defaults (WRITE_COVERING_BBOX defaults to YES, "
     "GEOMETRY_ENCODING to WKB, COMPRESSION to SNAPPY, and no CREATOR is set)"),
    ("gdal/ogr2ogr-epsg4326-default.parquet", GDAL_PIPE,
     "GDAL 3.11.3 OGR Parquet driver (ogr2ogr)", "generated",
     ogr_cmd("gdal/ogr2ogr-epsg4326-default.parquet",
             "geopandas/gp-epsg4326-covering.parquet"),
     "GDAL rewrite, driver defaults, of a source whose geo metadata declares "
     "EPSG:4326 as PROJJSON. Recorded here to show what GDAL then writes for "
     "crs; read the observed block rather than assuming"),
    ("gdal/ogr2ogr-epsg2056-no-covering.parquet", GDAL_PIPE,
     "GDAL 3.11.3 OGR Parquet driver (ogr2ogr)", "generated",
     ogr_cmd("gdal/ogr2ogr-epsg2056-no-covering.parquet",
             "geopandas/gp-epsg2056-intkey.parquet",
             "-lco WRITE_COVERING_BBOX=NO"),
     "same source and same driver as gdal/ogr2ogr-epsg2056-default.parquet, "
     "differing only in -lco WRITE_COVERING_BBOX=NO. That is the driver's own "
     "option name, taken verbatim from ogrinfo --format Parquet "
     "(LayerCreationOptionList, default YES); it was not invented here"),
    ("qgis/qgis-savefeatures-epsg2056.parquet", QGIS_PIPE,
     "QGIS 3.44.2 (qgis_process, native:savefeatures)", "generated",
     qgis_cmd("native:savefeatures", "qgis/qgis-savefeatures-epsg2056.parquet",
              "geopandas/gp-epsg2056-intkey.parquet"),
     "written by QGIS's own vector writer, which uses the GDAL QGIS ships; kept "
     "as a separate pipeline because the option choices are QGIS's, not "
     "ogr2ogr's. qgis_process prints a GRASS-not-installed warning on stderr on "
     "every run; the algorithm returned 0"),
    ("geoparquet-spec/example.parquet", "GeoParquet specification example file",
     "see observed.parquet_footer_created_by", "downloaded",
     "curl https://raw.githubusercontent.com/opengeospatial/geoparquet/" + GPC +
     "/examples/example.parquet on " + DATE,
     "the specification repository's own examples/example.parquet, at the pinned commit"),
    ("overture/overture-2026-08-19.0-building-bern.parquet",
     "Overture Maps extract via the overturemaps CLI",
     "overturemaps 1.0.2 CLI; Overture release 2026-08-19.0", "extracted",
     "overturemaps download --bbox=7.440,46.945,7.455,46.955 -f geoparquet -t building "
     "-r 2026-08-19.0 -o <file>   (run " + DATE +
     "; the CLI's <file>.state sidecar was deleted afterwards)",
     "Overture buildings over a small bbox in Bern"),
]

GDAL_AUTOTEST_URL = ("https://raw.githubusercontent.com/OSGeo/gdal/" + GDC +
                     "/autotest/ogr/data/parquet/")

RETIRED = [
    ("retired/gp-epsg3857-strkey.parquet",
     "geopandas/gp-epsg3857-strkey.parquet",
     "Near-duplicate of geopandas/gp-epsg2056-intkey.parquet on every observed "
     "axis -- same writer, same geo version 1.0.0, same crs shape class "
     "(PROJJSON with a projected EPSG id), covering absent in both, bbox member "
     "present in both, one integer-typed and one string-typed column in both. "
     "Only the EPSG code differs, and EPSG:2056 is the code this slice names."),
    ("retired/poly.parquet", "gdal/poly.parquet",
     "Downloaded from " + GDAL_AUTOTEST_URL + "poly.parquet on " + DATE +
     ". Held the GDAL-written case 'geo 1.1.0 + PROJJSON with a projected EPSG "
     "id + covering present'; that case is now held by "
     "gdal/ogr2ogr-epsg2056-default.parquet, which was written by GDAL on this "
     "machine with a recorded command instead of fetched. Note for the P0 "
     "architect: this was the corpus's only EPSG:27700 file. Its observed block "
     "is kept below under retired_observed so an axis-order prediction made "
     "against it is not lost."),
    ("retired/test_geoparquet_1_1.parquet", "gdal/test_geoparquet_1_1.parquet",
     "Downloaded from " + GDAL_AUTOTEST_URL + "test_geoparquet_1_1.parquet on " +
     DATE + ". Held 'GDAL-written, geo 1.1.0, crs key absent, covering "
     "present'; gdal/ogr2ogr-epsg4326-default.parquet has the same observed "
     "shape and was written here, and overture/... holds it too."),
    ("retired/test_with_fid_and_geometry_bbox.parquet",
     "gdal/test_with_fid_and_geometry_bbox.parquet",
     "Downloaded from " + GDAL_AUTOTEST_URL +
     "test_with_fid_and_geometry_bbox.parquet on " + DATE +
     ". Overlapped retired/test_geoparquet_1_1.parquet: same producer family, "
     "crs key absent in both, covering present in both, integer-heavy schema in "
     "both."),
]

RETIREMENT_REASON = (
    "The corpus is capped at 12 files in the main set. Four GDAL-written and "
    "QGIS-written files were added on " + DATE + " from the QGIS 3.44.2 install "
    "on this machine, so four files were moved out of the main set into "
    "retired/. They were moved, not deleted: their bytes are still on disk and "
    "any of them can be moved back. Retired files are NOT part of the main set "
    "and are not counted in file_count_main.")


def entry(rel, pipeline, tool, how, cmd, note, which_set):
    path = os.path.join(ROOT, rel.replace("/", os.sep))
    tail = observe.tail_facts(path)
    return {
        "path": "target/fixtures/compat-corpus/" + rel,
        "set": which_set,
        "producer_pipeline": pipeline,
        "library_or_tool": tool,
        "how_obtained": {"kind": how, "command_or_url": cmd, "date": DATE},
        "collection_note": note,
        "sha256": observe.sha256(path),
        "bytes": tail["bytes"],
        "observed": observe.observe(path),
    }


def main():
    entries = [entry(*row, which_set="main") for row in MAIN]

    derivations = json.load(open(os.path.join(ROOT, "mutations", "DERIVATIONS.json"),
                                 encoding="utf-8"))
    for m in derivations["mutations"]:
        rel = m["path"]
        path = os.path.join(ROOT, rel.replace("/", os.sep))
        tail = observe.tail_facts(path)
        entries.append({
            "path": "target/fixtures/compat-corpus/" + rel,
            "set": "mutations",
            "producer_pipeline": (
                "derived on this machine from a main-set file by "
                "scripts/gen_mutations.py"),
            "library_or_tool": "python 3.11.9, pyarrow 25.0.1 (in " + VENV + ")",
            "how_obtained": {"kind": "derived",
                             "command_or_url": m["derivation"],
                             "date": DATE},
            "collection_note": (
                "mutation fixture. What a reader should do with it is not stated "
                "here; the expected outcome is pre-declared in "
                "engine/ADMISSION-PREREGISTRATION.md."),
            "derived_from": "target/fixtures/compat-corpus/" + m["derived_from"],
            "derivation": m["derivation"],
            "derivation_parameters": m.get("parameters"),
            "observed_difference_from_base": m["observed_difference"],
            "sha256": observe.sha256(path),
            "bytes": tail["bytes"],
            "observed": observe.observe(path),
        })

    retired = []
    for rel, was, why in RETIRED:
        path = os.path.join(ROOT, rel.replace("/", os.sep))
        retired.append({
            "path": "target/fixtures/compat-corpus/" + rel,
            "was": "target/fixtures/compat-corpus/" + was,
            "retired_on": DATE,
            "reason": why,
            "sha256": observe.sha256(path),
            "bytes": observe.tail_facts(path)["bytes"],
            "observed": observe.observe(path),
        })

    probe_path = os.path.join(ROOT, "PROBE.json")
    probe = None
    if os.path.exists(probe_path):
        probe = json.load(open(probe_path, encoding="utf-8"))

    main_entries = [e for e in entries if e["set"] == "main"]
    mut_entries = [e for e in entries if e["set"] == "mutations"]

    manifest = {
        "corpus": "GeoParquet compatibility corpus (collection only)",
        "collected": DATE,
        "collected_for": ("RELEASE-DRAFTS-0.1.0/post-tag/"
                          "DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md, phase P0"),
        "expected_outcomes_recorded_here": False,
        "expected_outcomes_note": (
            "Expected admission outcomes are NOT recorded in this manifest, by design, "
            "for the main set and for the mutations alike. They are pre-declared in "
            "engine/ADMISSION-PREREGISTRATION.md. Every field under \"observed\" was "
            "read from the file's own bytes with pyarrow, or, for the tail facts, from "
            "the raw last eight bytes; nothing under \"observed\" is inferred, and no "
            "file here is called correct, incorrect, admissible or refusable."),
        "sets": {
            "main": ("files from independent producer pipelines; the corpus is capped "
                     "at 12 of these"),
            "mutations": ("files derived here from a named main-set file, each changing "
                          "one thing; not counted in the main set's cap"),
        },
        "malformed_or_mutation_fixtures_included": True,
        "file_count_main": len(main_entries),
        "file_count_mutations": len(mut_entries),
        "file_count": len(entries),
        "pipelines_represented": sorted({e["producer_pipeline"] for e in main_entries}),
        "read_with": {
            "python": platform.python_version(),
            "pyarrow": pyarrow.__version__,
            "venv": "target/corpus-venv (untracked)",
        },
        "probed_producers": probe,
        "observed_field_meanings": {
            "crs_shape": ("absent-key = the geometry column metadata carries no \"crs\" "
                          "member; null = the member is present and is JSON null; "
                          "projjson:<authority>:<code> or projjson:<name> = a PROJJSON "
                          "object is present"),
            "crs_axis_names": ("the PROJJSON crs's coordinate_system.axis[*].name list, "
                               "in the order the file states it; null where crs is "
                               "absent or null, or where the PROJJSON carries no "
                               "top-level coordinate_system. For a ProjectedCRS this is "
                               "the projected system's axis list; the base_crs axis list "
                               "is deliberately not substituted"),
            "crs_axis_directions": ("the same axis objects' \"direction\" values, same "
                                    "order, same null rule"),
            "geo_creator": ("the geo metadata's own \"creator\" member, verbatim; "
                            "null where the writer emitted none"),
            "parquet_footer_created_by": "the Parquet footer's created_by string, verbatim",
            "parquet_open_error": ("null when pyarrow opened the file; otherwise the "
                                   "exception text, verbatim. Only mutations are "
                                   "expected to be unopenable"),
            "geo_metadata_parses_as_json": ("whether the raw value of the \"geo\" "
                                            "key-value metadata key parsed as JSON"),
            "integer_typed_columns, string_typed_columns": (
                "columns whose Arrow type is an integer or a string type. Listed by name "
                "and type only. No column is called a key here; nothing was read from "
                "the column values."),
            "bbox_present_in_column_metadata": (
                "whether the geo metadata's geometry column object carries a \"bbox\" "
                "member; this is not a statement about Parquet column statistics"),
            "observed_difference_from_base": (
                "mutations only: byte size, the uint32 footer-length field in the last "
                "eight bytes, the trailing PAR1 magic, and whether the geo metadata "
                "parses, for the base and for the mutation side by side"),
        },
        "retirement_policy": RETIREMENT_REASON,
        "retired": retired,
        "files": entries,
    }

    out = os.path.join(ROOT, "MANIFEST.json")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("wrote", out, os.path.getsize(out), "bytes")
    print("main:", len(main_entries), "mutations:", len(mut_entries),
          "retired:", len(retired))


if __name__ == "__main__":
    main()
