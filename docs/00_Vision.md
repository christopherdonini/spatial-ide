# 00 — Vision

## Why this project exists

GIS tooling is stuck between a 20-year-old desktop paradigm (QGIS: UI freezes, plugin rot, binary project files, silent CRS errors) and an expensive walled garden (ArcGIS). Meanwhile the data world moved to Parquet, Arrow, and cloud-native formats, and workflows moved to code, notebooks, and AI agents. No tool treats spatial work as what it actually is: computing.

## What we are building

A **Spatial IDE** — VS Code's extensibility, Figma's immediacy and polish, Google Earth's directness, Jupyter's reproducibility — combined into an AI-native spatial computing platform.

Not a next-generation QGIS. Not a clone with better defaults. A different category: the platform is a headless spatial kernel; the UI, the CLI, the notebooks, and the AI are all clients of it (see 02).

## Who it is for

- Analysts who have outgrown desktop GIS but don't want to live in raw Python.
- Developers who want GIS as a platform and library, not a monolithic app.
- Teams that need spatial work to be reproducible, reviewable, and shareable like code.
- AI agents, as first-class users of the same API humans use.

## Initial wedge

The first customer is specific: **a technically capable spatial/data analyst with read-heavy workflows who has outgrown desktop GIS but doesn't want to build everything in Python.** The prototype (07) is built for them. Novices — "Explorer with zero learning curve" — remain the long-term destination the North Star describes; they do not dictate the first architecture.

## Problems we solve (market-driven)

- **Data normalization** — import anything, get a clean Arrow table plus a report of what was fixed (05).
- **Workflow automation** — every action is recorded and replayable (03).
- **Background processing** — nothing ever blocks the canvas (01, derived rules).
- **Diagnostics** — spatial linting with quick fixes; AI explains, deterministic checks decide (03, 04).
- **Integrated notebooks** — workflows are recorded artifacts, not screenshots of dialog boxes.
- **Unified SQL + GIS** — the map is a live query result (03).

## North Star

> A user who has never touched GIS can import 10 GB of spatial data, ask questions in natural language, inspect every generated SQL query, reproduce the entire workflow six months later, and publish the results — without ever leaving the application.

Every feature request is tested against this sentence: does it move us closer or farther? It encodes database-first, reproducibility, AI as infrastructure, notebooks, SQL transparency, performance, and integrated workflows in a single benchmark. An AI agent must be able to perform the same workflow through the same API, leaving a lineage trail anyone can audit.

## Long-term goal

Build a Spatial IDE, not a clone of QGIS. When in doubt, choose the platform decision over the app decision.
