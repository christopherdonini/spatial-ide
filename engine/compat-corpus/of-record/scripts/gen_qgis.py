"""QGIS-written GeoParquet, via qgis_process running headless.

qgis_process --version reports:
  QGIS 3.44.2-Solothurn 'Solothurn' (f30453dede3) / Qt 5.15.13 / Python 3.12.11
  GDAL/OGR 3.11.3 / PROJ 9.6.2 / GEOS 3.13.1-CAPI-1.19.2 / SQLite 3.50.4

The QGIS processing algorithm native:savefeatures writes through QGIS's own
vector writer, which in turn uses the GDAL that QGIS ships. The bytes are
therefore QGIS's choice of writer options on top of GDAL's Parquet driver, which
is why this file is kept as a pipeline of its own rather than folded into the
ogr2ogr entries.

No QGIS GUI is started; qgis_process is the headless entry point. GRASS is not
installed with this QGIS, so qgis_process prints "Problem with GRASS
installation: GRASS was not found or is not correctly installed" on stderr
before every run; it is unrelated to the algorithm and does not fail it.

Run:  target\corpus-venv\Scripts\python.exe scripts\gen_qgis.py
"""
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import qgis_env  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "qgis")

JOBS = [
    # (output basename, source relative path, algorithm, extra --KEY=VALUE args)
    ("qgis-savefeatures-epsg2056.parquet",
     "geopandas/gp-epsg2056-intkey.parquet",
     "native:savefeatures",
     []),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    env = qgis_env.env()
    for name, src_rel, alg, extra in JOBS:
        dst = os.path.join(OUT, name)
        src = os.path.join(ROOT, src_rel.replace("/", os.sep))
        if os.path.exists(dst):
            os.remove(dst)
        argv = [qgis_env.QGIS_PROCESS, "run", alg, "--",
                "INPUT=" + src, "OUTPUT=" + dst] + extra
        print("$", " ".join('"%s"' % a if " " in a else a for a in argv))
        r = subprocess.run(argv, env=env, cwd="C:\\", capture_output=True,
                           text=True, timeout=900)
        print("  rc=%d" % r.returncode)
        if r.stdout.strip():
            print("  stdout:", r.stdout.strip()[:2000])
        if r.stderr.strip():
            print("  stderr:", r.stderr.strip()[:2000])
        if r.returncode != 0 or not os.path.exists(dst):
            raise SystemExit("qgis_process failed for " + name)
        print("  wrote %s (%d bytes)" % (dst, os.path.getsize(dst)))


if __name__ == "__main__":
    main()
