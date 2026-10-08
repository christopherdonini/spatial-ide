# Spatial IDE reuse archaeology

A queryable record of what already exists in open source for each capability Spatial IDE needs, so that nothing substantial is planned from scratch without first knowing who has solved it, under what licence, and whether Spatial IDE may reuse it.

Round 1: 2026-10-08, against Spatial IDE at `4561f3b8` (and open PR #190 at `14acee0b`). Second issue, the same day: every Spatial IDE citation pinned, in-tree-looking third-party paths prefixed, `fetch-cache.mjs` hardened.

**Place it after PR #190 merges.** Five citations point into files only #190 adds: ADR-036 and `kernel/src/dataset_ref.rs`. They are pinned at `14acee0b`, which reaches main's history only when #190 merges (the repository merges pull requests with merge commits). Before that, `verify-cites` fails on exactly those five; after it, the checker passes on the whole bundle, whether or not it has the pinned fallback.

## What is here

| Path | What it is |
|---|---|
| `reuse-index.json` | **The index.** 55 capabilities, 188 candidate rows. Each capability: what Spatial IDE needs, PLAN nodes, priority, register (do-not-reinvent / worth-owning / open), a short answer, candidates with repository, pinned commit, verified licence, licence class, one reuse mode, dependency status and key paths, open decisions for the human, and the notes section that is its evidence. Plus `licence_watch`: licence traps found on the way. |
| `tools/reuse.mjs` | Query the index. No dependencies. |
| `repos.lock.json` | Every repository read in Round 1 (154 entries), pinned at the commit read, with its sparse-checkout paths. |
| `tools/check-index.mjs` | Checks the index's schema and the guardrails; run after every edit. |
| `tools/fetch-cache.mjs` | Rebuilds the local clone cache from `repos.lock.json`, after validating every entry. No dependencies; needs git 2.24 or later. |
| `notes/*.md` | The evidence: one file per track, with sweep, dossiers, registers and errata. `VERIFICATION-A.md` and `VERIFICATION-B.md` are the independent re-check. |
| `indexes/*.yaml` | One record per repository read in source (121). |
| `REUSE-ROUND-1.md` | The Round 1 report: what matters now, decisions for the human, the master table. |
| `BRIEF.md` | The research brief for later rounds (method, tools, licence gate, output). |

## Query before planning

```
node tools/reuse.mjs command palette
capability: command-palette → VS Code [CONCEPTUAL], Lumino [CONCEPTUAL], cmdk [CONCEPTUAL], Zed [CONCEPTUAL], kbar [REJECT]   (worth-owning, P0)
capability: command-registry-native-menus → @tauri-apps/api [ADOPT], VS Code [CONCEPTUAL], Lumino [CONCEPTUAL]   (do-not-reinvent, P0)
capability: fuzzy-matching → @codemirror/autocomplete [PORT], uFuzzy [WATCH], ...   (do-not-reinvent, P0)

node tools/reuse.mjs --full text shaping     # licences, dependency status, paths, open decisions, evidence
node tools/reuse.mjs ADR-036                 # everything that bears on the B2 file formats
node tools/reuse.mjs --list                  # all 55 capabilities
node tools/reuse.mjs --licence-watch         # licence traps
```

A query that matches nothing exits with status 1 and says so: that capability has not been researched, so research comes before planning.

## Rebuild the clone cache

```
node tools/fetch-cache.mjs --dest <cache dir>              # all 154 pins, about 1.8 GB blob-less
node tools/fetch-cache.mjs --track q-command-bar --dest …   # one track only
```

The lock file is treated as untrusted input. Before any git call, every entry is validated:
- the url is `https://` on github.com or gitlab.com, with a plain owner/repo path;
- the commit is exactly 40 hex digits;
- the name is one directory name, with no path separator and no `..`;
- the filter comes from a fixed set;
- no value starts with `-`;
- the entry has no unknown key.

A failing entry is refused by name, and nothing is fetched while any entry is refused (`--dry-run` validates without fetching).

Every git call:
- passes `--end-of-options` before its values;
- disables the ext and file transports (`GIT_ALLOW_PROTOCOL=https`, `protocol.ext.allow=never`, `protocol.file.allow=never`);
- never prompts;
- skips LFS smudging;
- checks symlinks out as plain files.

Then `rg` the cache directly ("how does MapLibre place line labels?" → `rg -n placeCollisionBox <cache>/maplibre__maplibre-gl-js@*`). Keep the cache **outside** the Spatial IDE repository. It is third-party code: read it, never build or run it, never commit it.

## Citations

- **Spatial IDE citations:** every one is written with the full repository-root path and its commit, `path:line @ <commit>` (8 hex). That is the form `scripts/plan/verify-cites.mjs` reads, and the pin goes inside any backticks.
  - `4561f3b8` is main as the research read it.
  - `14acee0b` is PR #190's head, used only where the cited file differs there or exists only there. A cite read on the PR head into a file the PR leaves byte-identical carries `4561f3b8`.
- **Third-party citations** whose path begins with a Spatial IDE top-level folder name (docs, engine, frontends, kernel, protocol, renderer, scripts, site, spikes, state, tools, LICENSES) carry their repository as the first path segment, for example `deck.gl/docs/api-reference/geo-layers/tile-layer.md:306-317`. The checker then never reads them as in-tree.

## The guardrails

1. Spatial IDE's core is AGPL-3.0-or-later. Every candidate states its licence, verified from the repository's own files, and a licence class:
   - permissive;
   - core-combinable copyleft (GPL-3.0, GPL-2.0-or-later, AGPL: usually combinable into the core, never in an Apache-2.0 SDK or anything a proprietary plugin links);
   - weak copyleft;
   - likely incompatible (GPL-2.0-only);
   - red;
   - data;
   - spec.
2. Code with no licence, an unverified one or an incompatible one is **reference only**. Such a candidate is never ADOPT, WRAP, VENDOR, FORK or PORT; `node tools/check-index.mjs` fails on one that is.
3. **Adopting anything as a new dependency stays the human's typed word.** Such candidates carry `dependency: "new — the human's typed word"`, and the query tool prints that beside them.
4. Ported code needs a route into the shipped NOTICE before it lands (`licence_watch: shell-port-notice-route`).
5. Flag, don't rule: licence readings are reserved for counsel.

## Extending it (later rounds)

- Add or update a capability in `reuse-index.json` only with evidence: a notes section that cites repository, path and commit.
- Add every repository read to `repos.lock.json` with the commit read, and run `node tools/fetch-cache.mjs --dry-run` to validate it.
- Write citations as the Citations section says, and run the repository's `verify-cites` over the bundle before it is placed.
- Re-check before relying on an entry whose pin is old: licences and maintenance change (earcut changed its licence in April 2026).
