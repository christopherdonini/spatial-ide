Question round 62 — 2026-10-06 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Round item 1 — geometry-points-cut, OPEN-1 (form engine/GEOMETRY-POINTS-PREREGISTRATION.md, section OPEN): is MultiPoint in this cut? (A) Point only: MultiPoint stays refused at open as today, the sighted refusal template now listing three readable types (Polygon, MultiPolygon, Point). (B) Point and MultiPoint: adds geoarrow.multipoint, a Point row promoted to a one-part MultiPoint, and the pick map through parts. The architect recommends (A): the corpus has only ["Point"] files, the common writers declare what rows hold, and MP-1 already proved the multi-part machinery, so (B) can follow as a small piece. Not a red line under (A); (B) would be new user-visible behaviour, so type it via Other if you want it (the form is then redrafted before any code). Dispatch waits on this item.
  (1) (A) Point only (Recommended) — MultiPoint stays refused at open; the cut dispatches as drafted.
  (2) Hold — Keep OPEN-1 open; the cut is not dispatched yet.

---

2. Round item 2 — RED LINE (operator wording; type your ruling via Other). geometry-points-cut, OPEN-2: ADR-034 Decision 7 refuses a mixed-kind declared set with the sighted wording, but for ["Polygon","Point"] that wording would state a false fact (each type is readable; the combination is not, since the engine reads one kind per column). Options: (A) keep the sighted template unchanged for a member outside the readable set (its set now renders Polygon, MultiPolygon and Point), and add a new [P6 placeholder] detail for a set mixing readable kinds — RECOMMENDED; (B) one reworded text for both cases, sighted before merge; (C) the sighted template for both — the architect rejects it as stating a false engine fact. The code is built with the placeholder either way; only the PR's ready state and the final gate wait.
  (1) Hold — Keep OPEN-2 open; the build goes ahead with the placeholder, and the PR is not set ready.
  (2) Hold for Fable's read — Keep OPEN-2 open until Fable has read the form's OPEN section.

---

3. Round item 3 — RED LINE (user-visible behaviour, and a reading of ADR-022 and ADR-017 §5a; type your ruling via Other). geometry-points-cut, OPEN-3, how points are styled and the symbol radius. ADR-022 makes style v0 the single model; ADR-017 §5a says v1 styles polygons only. Options: (A) map the resolved polygon draw parameters (fill colour and opacity, outline colour and width) onto the point symbol, as rendering plumbing under ADR-022 Decision 4; the radius is a declared shell constant outside the style document; the document still says polygon; a KNOWN-LIMITATIONS line names this — RECOMMENDED; (B) draw points with fixed default parameters, the style panel not applying to them, with a [P6 placeholder] note; (C) add a point geometry and a radius to the style document — a style v2 / ADR-017 change, out of this cut, riding B3. Radius: 3, 4 or 5 CSS px; recommended 4 (an 8 px diameter, below the 9 px pick threshold). Waits: the shell commit's styling code.
  (1) Hold — Keep OPEN-3 open; the engine, kernel and wire commits go ahead, and the shell commit waits.
  (2) Hold for Fable's read — Keep OPEN-3 open until Fable has read the form's OPEN section.

---

4. Round item 4 — RED LINE (user-visible behaviour, applying ADR-028 item 4 to a new kind; type your ruling via Other). geometry-points-cut, OPEN-4, the pick rule for points. Under today's rule a point's extent is 0, so every hover would be refused (refusal below 9 px). Options: (A) compare the average on-screen spacing of resident points with the same 9 px threshold, computed once per render like today's average; clustered or coincident points in a sparse extent can then name the topmost symbol, and a KNOWN-LIMITATIONS line says so — RECOMMENDED (same mechanic, same named state and text, no added hover cost); (B) refuse when two or more symbols overlap at the pointer, with a depth-2 GPU pick per hover — exact at that pixel, but an unmeasured second pick pass per hover, and coincident points would need a new state and wording, since zooming cannot separate them; (C) treat a symbol's own diameter as its extent — with a 4 px radius every hover is refused, at 4.5 px or more nothing is, which weakens item 4 for points. In every option deck's pickingRadius stays unset (setting it moves polygon hover). Waits: the shell commit's hover branch.
  (1) Hold — Keep OPEN-4 open; the shell commit waits.
  (2) Hold for Fable's read — Keep OPEN-4 open until Fable has read the form's OPEN section.
