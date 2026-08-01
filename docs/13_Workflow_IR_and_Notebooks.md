# 13 — Workflow IR and Notebooks

## Why an IR

The action console (03) yields excellent raw material, but a reproducible notebook needs semantics that recording alone cannot give: explicit inputs and outputs, parameters, dependency ordering, environment lockfiles, failure states, side-effect declarations (ADR-006), secrets handling (09), manual edits, branching, cache policy. "Recording comes free" was too optimistic; recording is the start, not the artifact.

## The IR

SQL, Python, GUI actions, and AI tool calls all compile into one **Workflow IR**: a typed dataflow graph over ResourceRefs (11), with declared parameters and side-effect classes per step. The IR — not the notebook file — is what lineage stores and replay executes.

## Notebooks

Reactive and DAG-based — not Jupyter's hidden mutable state. A cell's outputs are functions of its declared inputs; stale cells are visibly stale; execution order is the graph, not the scroll order. A cell can capture a map state; scrubbing through a notebook scrubs the map (03).

## Reproducibility

Every notebook displays its reproducibility grade (ADR-005) and environment lockfile. Replay = re-execute the IR against pinned inputs; 08 asserts replay fidelity at the declared grade.
