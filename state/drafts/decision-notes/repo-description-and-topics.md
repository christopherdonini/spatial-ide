> **Status: decision-note — GitHub repository description, topics and homepage, drafted 2026-09-10 for the human's ruling.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Decision note — GitHub repository description, topics, homepage

*Drafted by the custodian on **2026-09-10**. **Nothing here is applied.** The repository's
description, topics and homepage are outward-facing metadata; `AI_DEVELOPMENT.md`'s red lines and
`RELEASE-DAY-CHECKLIST.md` §2 both make them the human's own step. The commands in §4 are written
ready to run so the human can run them — the custodian will not.*

**State today** (`gh repo view christopherdonini/spatial-ide`, 2026-09-10): description empty,
topics none, homepage empty, visibility public.

---

## 1. What the description has to satisfy

- **One sentence, ≤ 350 characters** (GitHub's limit).
- **`RELEASE-DAY-CHECKLIST.md` §2:** *"one sentence; the README's first line without the marketing
  tone."* The README's first line carries a four-way comparison (VS Code, Figma, Google Earth,
  Jupyter) — that is the tone to strip.
- **True to `docs/00_Vision.md`:9-11**, which release text may quote; **`docs/00`:35 (the North Star)
  is a hard prohibition** (`RELEASE-0.1.md` Q5) — it names 10 GB, natural language, notebooks and
  six-month reproduction, none of which v0.1.0 delivers.
- **No performance statement** (`docs/08`). "5 GB" is nameable only as the slice's target dataset
  class, never without its ceiling (ADR-011:63) — which does not fit a sentence, so it stays out.
- **True to what v0.1.0 is:** the hero slice (`docs/07`), Windows only, two admitted CRSs, style by
  literal, EPSG:4326 refused. Those limits live in `KNOWN-LIMITATIONS.md`, not in a 350-character
  field — but the description must not imply their absence.
- **No ™/®** — *"Spatial IDE" is a working title, not a registered mark* (`docs/14`).

---

## 2. Drafted description (recommended)

> An AI-native spatial computing platform: a headless spatial kernel, designed so that the UI, CLI, notebooks
> and AI are all clients of it. v0.1.0 is a Windows prototype — open a GeoParquet, filter it in SQL,
> style it, publish a static interactive bundle. AGPL-3.0-or-later core; the SKP protocol and file
> formats are open.

**321 characters** (measured after the human's 2026-09-11 modification, em dash included; was 304). Every clause traces to a file: sentence 1 is
`docs/00`:9-11 with the comparison list removed; sentence 2 is `docs/07`'s hero slice as `README.md`
states it; sentence 3 is the licence block and `docs/14`:14-16. It dates its present tense
("v0.1.0 is"), so it does not silently rot when v0.2 changes what is true.

---

## 3. Three alternatives, with the trade-off named

**B — v0.1.0 first, vision deferred** (231 chars)

> Windows prototype of a spatial IDE: open a GeoParquet, filter it in SQL, style it, publish a
> static interactive bundle. A Rust kernel, a DuckDB/Arrow engine and a Tauri shell, all speaking
> one open protocol. AGPL-3.0-or-later core.

*Trade-off:* the most conservative — nothing in it can outrun the artifact. It also throws away the
project's own category claim, so a stranger reads "another GeoParquet viewer". Choose it if the
priority is that no sentence anywhere promises more than v0.1.0 installs.

**C — vision only** (224 chars)

> An AI-native spatial computing platform: the platform is a headless spatial kernel; the UI, the
> CLI, the notebooks and the AI are all clients of it. Not a next-generation QGIS — a different
> category. AGPL-3.0-or-later core.

*Trade-off:* closest to `docs/00`, and the only draft that says what the project is *not*. But it
describes nothing that exists, which is the drift this cut has spent weeks refusing; and
*"Not a next-generation QGIS"* is a comparative — inside `docs/00` an internal steering rule, in a
public one-liner it reads as positioning against another project. Not recommended.

**D — stack first, for discovery** (225 chars)

> Spatial data IDE for Windows: GeoParquet read through a Rust kernel and a DuckDB/Arrow engine,
> filtered in SQL, styled, rendered with deck.gl in a Tauri shell, published as a static interactive
> bundle. AGPL-3.0-or-later core.

*Trade-off:* the best match for how people search, and every noun is verifiable in the tree. But it
reads as a dependency list, drops the platform framing, and pins third-party components in metadata
that is awkward to correct later (deck.gl is ADR-003's accepted architecture, but the native-`wgpu`
bake-off is filed and unscheduled). §4's topics already buy most of this draft's discoverability
without spending the sentence on it.

---

## 4. Topics

Topics are lowercase, hyphenated, ≤ 20 per repository, and are metadata rather than claims
(`RELEASE-DAY-CHECKLIST.md` §2). **Each was verified by fetching `https://github.com/topics/<topic>`
on 2026-09-10; the count is that page's own "Here are N public repositories matching this topic"
line.** Nothing below is assumed.

| Topic | Repositories (2026-09-10) | Why it is true here |
|---|---|---|
| `geoparquet` | 132 | the only input format v0.1.0 opens |
| `geospatial` | 7,173 | the domain |
| `gis` | 8,317 | the domain, as people search it |
| `spatial-data` | 637 | the domain, non-GIS phrasing |
| `duckdb` | 4,680 | the engine (`engine/`) |
| `parquet` | 1,894 | the storage layer under GeoParquet |
| `rust` | 125,312 | kernel, engine, protocol, shell backend |
| `tauri` | 12,896 | `frontends/shell` |
| `typescript` | 439,202 | the shell frontend and the published bundle viewer |
| `deck-gl` | 211 | the renderer, per ADR-003 |
| `desktop-app` | 21,196 | what v0.1.0 installs |
| `windows` | 68,450 | the only platform v0.1.0 supports |
| `local-first` | 19,934 | `README.md`'s own section; `docs/09` posture |
| `agpl` | 1,180 | the core's licence |

**Fourteen topics, six slots spare.** If the human wants fewer, the first to drop are `typescript`,
`rust` and `windows` — GitHub already surfaces languages, and `windows` is a limitation rather than
a feature.

**Note on the checklist's own suggestion.** `RELEASE-DAY-CHECKLIST.md` §2 sketches
`--add-topic spatial`. The custodian **did not verify** `https://github.com/topics/spatial` and is
not proposing it; `spatial-data` above was verified and is proposed in its place. Correcting the
checklist line is a separate, small change and is **not** made here.

### Commands, ready to run (the human runs them; the custodian does not)

```bash
gh repo edit christopherdonini/spatial-ide \
  --description "An AI-native spatial computing platform: a headless spatial kernel, designed so that the UI, CLI, notebooks and AI are all clients of it. v0.1.0 is a Windows prototype — open a GeoParquet, filter it in SQL, style it, publish a static interactive bundle. AGPL-3.0-or-later core; the SKP protocol and file formats are open."
```

```bash
gh repo edit christopherdonini/spatial-ide \
  --add-topic geoparquet \
  --add-topic geospatial \
  --add-topic gis \
  --add-topic spatial-data \
  --add-topic duckdb \
  --add-topic parquet \
  --add-topic rust \
  --add-topic tauri \
  --add-topic typescript \
  --add-topic deck-gl \
  --add-topic desktop-app \
  --add-topic windows \
  --add-topic local-first \
  --add-topic agpl
```

*(The description contains an em dash. In PowerShell, paste it into a here-string or a single-quoted
argument rather than retyping it, so the character survives.)*

---

## 5. Homepage

**Stays empty.** `RELEASE-DAY-CHECKLIST.md` §2: *"Homepage: none, or the repository's own README (no
marketing site exists)."* None exists, none is planned in this cut, and pointing the homepage at the
repository's own README is a self-link that adds nothing to the About panel. It is already empty as
of 2026-09-10, so **no command is needed** — `gh repo edit --homepage ""` only clears a set value.

---

## 6. The rule this note operates under

None of the above is applied without the human's word: not the description, not one topic, not the
homepage. `RELEASE-DAY-CHECKLIST.md` §2 is a **(human)** step in full, and its last line stands
unchanged — *"Visibility is NOT touched"*. If a draft is approved, record the approved sentence
verbatim in `RELEASE-0.1.md`'s next amendment before setting it, so metadata and record agree.

---

*Read in-repository, 2026-09-10 at `main` = `279b43f`: `docs/00_Vision.md`, `docs/07_Roadmap.md`,
`docs/14`, `README.md` and `QUICKSTART.md` (both drafts), `RELEASE-0.1.md` (Amendments 10 item 7,
13), `RELEASE-DAY-CHECKLIST.md`. Retrieved 2026-09-10: the fourteen
`https://github.com/topics/<topic>` pages in §4, and `gh repo view christopherdonini/spatial-ide`.*

---

## Ruled 2026-09-11 (DECISIONS-PENDING entry 78, the human verbatim)

> *"78: description A with "designed so that the UI, CLI, notebooks and AI are all clients of it"; topics as verified; checklist spatial→spatial-data; I run the edit."*

Applied in this note: §2's text carries the modification (321 characters, measured); the topics are the fourteen verified above; `RELEASE-DAY-CHECKLIST.md` line 27 now reads `spatial-data`. The human runs the edit; the custodian runs no `gh repo edit`.
