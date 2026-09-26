"""Environment for the QGIS 3.44.2 standalone install on this machine.

QGIS ships its own GDAL 3.11.3 (bin\ogr2ogr.exe, bin\ogrinfo.exe, data under
apps\gdal\share\gdal) and qgis_process (apps\qgis\bin\qgis_process.exe).
This module builds the environment those binaries need without calling
bin\o4w_env.bat -- that batch file did not survive being called from this
session's shell (it does `pushd %~dp0` / `cd ..`, and failed with "The filename,
directory name, or volume label syntax is incorrect" when the parent process's
current directory was not a plain Windows path). The variables set here are the
ones bin\o4w_env.bat + etc\ini\*.bat + bin\qgis_process-qgis.bat set, read
out of those files.

Nothing in this module runs Spatial IDE code or launches the Spatial IDE app.
"""
import os

ROOT = r"C:\Program Files\QGIS 3.44.2"

OGR2OGR = ROOT + r"\bin\ogr2ogr.exe"
OGRINFO = ROOT + r"\bin\ogrinfo.exe"
QGIS_PROCESS = ROOT + r"\apps\qgis\bin\qgis_process.exe"


def env():
    e = dict(os.environ)
    win = os.environ.get("WINDIR", r"C:\Windows")
    e["OSGEO4W_ROOT"] = ROOT
    e["PATH"] = ";".join([
        ROOT + r"\bin",
        ROOT + r"\apps\qgis\bin",
        ROOT + r"\apps\Qt5\bin",
        ROOT + r"\apps\Python312",
        ROOT + r"\apps\Python312\Scripts",
        win + r"\system32",
        win,
        win + r"\system32\WBem",
    ])
    # etc\ini\gdal.bat
    e["GDAL_DATA"] = ROOT + r"\apps\gdal\share\gdal"
    e["GDAL_DRIVER_PATH"] = ROOT + r"\apps\gdal\lib\gdalplugins"
    # etc\ini\proj-runtime-data.bat
    e["PROJ_DATA"] = ROOT + r"\share\proj"
    # bin\qgis_process-qgis.bat
    e["QGIS_PREFIX_PATH"] = ROOT.replace("\\", "/") + "/apps/qgis"
    e["QT_PLUGIN_PATH"] = ROOT + r"\apps\qgis\qtplugins;" + ROOT + r"\apps\Qt5\plugins"
    e["GDAL_FILENAME_IS_UTF8"] = "YES"
    e["VSI_CACHE"] = "TRUE"
    e["VSI_CACHE_SIZE"] = "1000000"
    # etc\ini\python3.bat
    e["PYTHONHOME"] = ROOT + r"\apps\Python312"
    e["PYTHONPATH"] = ROOT + r"\apps\qgis\python"
    e["PYTHONUTF8"] = "1"
    # this session's own venv must not leak into QGIS's Python
    e.pop("VIRTUAL_ENV", None)
    return e
