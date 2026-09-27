"""GDAL-written GeoParquet, using the GDAL that ships inside QGIS 3.44.2.

Source of GDAL: C:\Program Files\QGIS 3.44.2\bin\ogr2ogr.exe
  ogrinfo --version  -> GDAL 3.11.3 "Eganville", released 2025/07/12
  ogrinfo --formats  -> "Parquet -vector- (rw+v): (Geo)Parquet (*.parquet)"

Writes three files into ../gdal/. Inputs are files already in this corpus, so
the conversion is corpus -> corpus and nothing is downloaded.

Run:  target\corpus-venv\Scripts\python.exe scripts\gen_gdal.py
"""
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import qgis_env  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "gdal")

JOBS = [
    # (output basename, source relative path, extra ogr2ogr argv)
    ("ogr2ogr-epsg2056-default.parquet",
     "geopandas/gp-epsg2056-intkey.parquet",
     []),
    ("ogr2ogr-epsg4326-default.parquet",
     "geopandas/gp-epsg4326-covering.parquet",
     []),
    ("ogr2ogr-epsg2056-no-covering.parquet",
     "geopandas/gp-epsg2056-intkey.parquet",
     ["-lco", "WRITE_COVERING_BBOX=NO"]),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    env = qgis_env.env()
    for name, src_rel, extra in JOBS:
        dst = os.path.join(OUT, name)
        src = os.path.join(ROOT, src_rel.replace("/", os.sep))
        if os.path.exists(dst):
            os.remove(dst)
        argv = [qgis_env.OGR2OGR, "-f", "Parquet", dst, src] + extra
        print("$", " ".join('"%s"' % a if " " in a else a for a in argv))
        r = subprocess.run(argv, env=env, cwd=ROOT, capture_output=True,
                           text=True, timeout=600)
        print("  rc=%d" % r.returncode)
        if r.stdout.strip():
            print("  stdout:", r.stdout.strip())
        if r.stderr.strip():
            print("  stderr:", r.stderr.strip())
        if r.returncode != 0:
            raise SystemExit("ogr2ogr failed for " + name)
        print("  wrote %s (%d bytes)" % (dst, os.path.getsize(dst)))


if __name__ == "__main__":
    main()
