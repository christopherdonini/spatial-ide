"""Probe the QGIS 3.44.2 install that supplies the GDAL and QGIS writers.

Records the verbatim output of:
  ogrinfo --version
  ogrinfo --formats            (the Parquet line, and the driver count)
  ogrinfo --format Parquet     (the layer creation option list)
  qgis_process --version

Writes PROBE.json beside MANIFEST.json; build_manifest.py copies it into the
manifest so the manifest states versions that were read from the tools, not
versions someone typed.

Run:  target\\corpus-venv\\Scripts\\python.exe scripts\\probe_producers.py
"""
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import qgis_env  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(argv):
    r = subprocess.run(argv, env=qgis_env.env(), cwd="C:\\",
                       capture_output=True, text=True, timeout=900)
    return {"argv": argv, "returncode": r.returncode,
            "stdout": r.stdout, "stderr": r.stderr}


def main():
    out = {
        "probed_install": qgis_env.ROOT,
        "ogr2ogr_exe": qgis_env.OGR2OGR,
        "ogrinfo_exe": qgis_env.OGRINFO,
        "qgis_process_exe": qgis_env.QGIS_PROCESS,
    }
    v = run([qgis_env.OGRINFO, "--version"])
    out["ogrinfo_version"] = v["stdout"].strip()

    f = run([qgis_env.OGRINFO, "--formats"])
    lines = [ln.rstrip() for ln in f["stdout"].splitlines()]
    out["ogrinfo_formats_parquet_lines"] = [ln for ln in lines
                                            if "parquet" in ln.lower()]
    out["ogrinfo_formats_driver_line_count"] = sum(
        1 for ln in lines if " -vector-" in ln or " -raster-" in ln
        or " -raster,vector-" in ln or " -multidimensional raster-" in ln)

    d = run([qgis_env.OGRINFO, "--format", "Parquet"])
    out["ogrinfo_format_parquet"] = d["stdout"]

    q = run([qgis_env.QGIS_PROCESS, "--version"])
    out["qgis_process_version"] = q["stdout"].strip()
    out["qgis_process_stderr"] = q["stderr"].strip()
    out["qgis_process_returncode"] = q["returncode"]

    path = os.path.join(ROOT, "PROBE.json")
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(out, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print("wrote", path)
    print(out["ogrinfo_version"])
    print(out["ogrinfo_formats_parquet_lines"])
    print(out["qgis_process_version"].splitlines()[0] if out["qgis_process_version"] else "")


if __name__ == "__main__":
    main()
