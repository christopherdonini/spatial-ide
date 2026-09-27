import duckdb
OUT = r"C:\dev\spatial-ide\target\fixtures\compat-corpus\duckdb-spatial"
con = duckdb.connect()
con.execute("INSTALL spatial; LOAD spatial;")

# A. integer key + string column, LV95-range coordinates, plain GEOMETRY (no CRS carried)
con.execute(f"""
COPY (
  SELECT (100000 + i)::INTEGER AS parcel_id,
         format('P{{:04d}}', i) AS label,
         (i % 7)::SMALLINT AS zone,
         ST_Point(2600000 + (i * 37 % 8000), 1199000 + (i * 53 % 8000)) AS geom
  FROM range(0, 300) t(i)
) TO '{OUT}\duckdb-lv95range-intkey.parquet' (FORMAT PARQUET);
""")

# B. no integer, no unique string: only doubles + a repeating category
con.execute(f"""
COPY (
  SELECT (i % 5)::DOUBLE AS category,
         (i * 0.017)::DOUBLE AS measure,
         ST_Point(-3.0 + (i * 0.01), 47.0 + (i * 0.007)) AS geom
  FROM range(0, 300) t(i)
) TO '{OUT}\duckdb-degreesrange-nokey.parquet' (FORMAT PARQUET);
""")

# C. string key, polygons
con.execute(f"""
COPY (
  SELECT format('site-{{:05d}}', i) AS site_code,
         ST_Buffer(ST_Point(828000 + (i * 31 % 20000), 5933000 + (i * 71 % 20000)), 25) AS geom
  FROM range(0, 200) t(i)
) TO '{OUT}\duckdb-mercatorrange-strkey.parquet' (FORMAT PARQUET);
""")
print("duckdb files written")
