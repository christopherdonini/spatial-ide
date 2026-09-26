"""Writes the geopandas/ files.

NOTE 2026-09-10: gp-epsg3857-strkey.parquet was retired from the main set
and moved to retired/ (see README.md). Re-running this script writes it back
into geopandas/, which would put the main set at 13. Delete or re-move that
one output after a re-run, or run only the blocks you need.
"""
import warnings, random
import geopandas as gpd, pandas as pd
from shapely.geometry import Point, Polygon

OUT = r"C:\dev\spatial-ide\target\fixtures\compat-corpus\geopandas"
random.seed(20260910)

def sq(x, y, s):
    return Polygon([(x, y), (x + s, y), (x + s, y + s), (x, y + s), (x, y)])

# 1. EPSG:2056 (LV95, projected), integer key column, default writer options
n = 240
rows = []
for i in range(n):
    x = 2600000.0 + random.uniform(-8000, 8000)
    y = 1199000.0 + random.uniform(-8000, 8000)
    rows.append({"parcel_id": 100000 + i, "label": f"P{i:04d}",
                 "area_m2": round(random.uniform(50, 900), 2),
                 "geometry": sq(x, y, random.uniform(5, 40))})
gdf = gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:2056")
gdf.to_parquet(OUT + r"\gp-epsg2056-intkey.parquet")

# 2. EPSG:3857 (projected), string key column only
rows = []
for i in range(n):
    x = 828000.0 + random.uniform(-20000, 20000)
    y = 5933000.0 + random.uniform(-20000, 20000)
    rows.append({"site_code": f"CH-{i:05d}", "count": random.randint(0, 50),
                 "geometry": Point(x, y)})
gdf = gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:3857")
gdf.to_parquet(OUT + r"\gp-epsg3857-strkey.parquet")

# 3. No CRS set at all -> whatever geopandas writes for an unset CRS; no key column
rows = []
for i in range(n):
    rows.append({"measure": round(random.uniform(0, 1), 6),
                 "flag": bool(random.getrandbits(1)),
                 "geometry": Point(random.uniform(-5, 5), random.uniform(-5, 5))})
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    gdf = gpd.GeoDataFrame(rows, geometry="geometry", crs=None)
    gdf.to_parquet(OUT + r"\gp-nocrs-nokey.parquet")

# 4. EPSG:4326 with the covering bbox the 1.1 writer can emit; integer + string keys
rows = []
for i in range(n):
    lon = 7.44 + random.uniform(-0.2, 0.2)
    lat = 46.95 + random.uniform(-0.2, 0.2)
    rows.append({"fid": i, "name": f"n{i:04d}", "geometry": sq(lon, lat, 0.002)})
gdf = gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:4326")
gdf.to_parquet(OUT + r"\gp-epsg4326-covering.parquet", write_covering_bbox=True)

# 5. EPSG:2056 written through pyarrow's geoarrow-style encoding if offered, else default;
#    duplicated integer column + unique string column (key ambiguity, no judgement recorded)
rows = []
for i in range(n):
    x = 2601000.0 + random.uniform(-3000, 3000)
    y = 1197000.0 + random.uniform(-3000, 3000)
    rows.append({"batch": i % 12, "uid": f"u-{i:04d}-{random.randint(0,9)}",
                 "geometry": Point(x, y)})
gdf = gpd.GeoDataFrame(rows, geometry="geometry", crs="EPSG:2056")
gdf.to_parquet(OUT + r"\gp-epsg2056-dupint-struid.parquet", geometry_encoding="WKB")
print("geopandas files written")
