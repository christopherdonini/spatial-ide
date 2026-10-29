# governance/

How the work is run. The preregistration forms, the plan, the rulings ledger, the working rules, the audits and the release records sit here, so that the repository root holds what a reader or a tool looks for first.

## What is here

- [`AI_DEVELOPMENT.md`](AI_DEVELOPMENT.md): development-time practice outside the product constitution: the agent team, the custodian role, the red lines and the accumulated lessons.
- [`AUTONOMY.md`](AUTONOMY.md): the custodian's work system: plan as data, the queue, the Stop hook, rulings and the landing page.
- [`CUSTODIAN-QUEUE.md`](CUSTODIAN-QUEUE.md) and [`CUSTODIAN-QUEUE.json`](CUSTODIAN-QUEUE.json): the queue, generated from `PLAN.yaml` by `scripts/plan/queue.mjs`; never edited by hand.
- [`DECISIONS-PENDING.md`](DECISIONS-PENDING.md): the decisions pending the human, and the rulings ledger.
- [`MACOS-BRINGUP.md`](MACOS-BRINGUP.md): the macOS bring-up kit, for the human sitting at the Mac, from nothing installed to the running shell app.
- [`MOVED.tsv`](MOVED.tsv): the old path, the new path and the move commit of every file this folder took in.
- [`PLAN.yaml`](PLAN.yaml): the plan as data; the queue and `site/` are generated from it.
- [`PRE-PUBLIC-CHECKLIST.md`](PRE-PUBLIC-CHECKLIST.md): the ADR-009 pre-public checklist, kept as history: the repository has been public since 2026-08-03.
- [`PRECEDENTS.md`](PRECEDENTS.md): generalised rulings, checked before any question is raised.
- [`PUBLIC-AUDIENCE-AUDIT.md`](PUBLIC-AUDIENCE-AUDIT.md): the read-only audit of the window from the repository going public to 2026-09-07.
- [`RELEASE-0.1.md`](RELEASE-0.1.md): the release-engineering cut of v0.1.0: the brief and the preregistration record, with its amendments.
- [`RELEASE-DAY-CHECKLIST.md`](RELEASE-DAY-CHECKLIST.md): the v0.1.0 tag as a checklist.
- [`forms/`](forms/): the preregistration forms, one folder for each top-level folder of the code they were written about, and `root/` for those written about the repository root.

## Where a new preregistration form goes

A new form goes in `governance/forms/<folder>/`, where `<folder>` is the first path segment of the code it is about: `engine`, `frontends`, `kernel`, `protocol`, `renderer`, `scripts`, `spikes` or `tools`; a form about the repository root goes in `governance/forms/root/`. The file keeps its name. Forms under `state/` stay there, and so do `docs/PREREGISTRATION-TEMPLATE.md` and `docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md`, the two `docs/` files that match the form glob. `node scripts/plan/forms-layout.mjs` fails, by name, a form anywhere else; governance-ci runs it. `node scripts/plan/moved-map.mjs plan` prints where rule R would place each form that is tracked now.

## How an old path resolves

`MOVED.tsv` has one row for each moved file: `old`, `new` and `commit`, separated by tabs, sorted by old path; the commit is the moves-only commit that made the rename, and that commit holds renames and nothing else.

- A record that names a file by its old path is not edited. `scripts/plan/verify-cites.mjs`, `scripts/plan/verify-quotes.mjs`, `scripts/plan/verify.mjs` and `scripts/plan/site.mjs` read the old path through `MOVED.tsv` and open the file where it is now.
- A citation pinned to a revision (`path:line @ <rev>`) names the path as it was at that revision and is read there.
- To read a moved file as it was before the move: `git show <commit>^:<old path>`. To follow its history across the move: `git log --follow <new path>`.
- A line written after the move that cites an old path fails `node scripts/plan/verify-cites.mjs` by name; cite the new path.
- A later moves-only commit adds its rows with `node scripts/plan/moved-map.mjs add <commit>`. `node scripts/plan/moved-map.mjs --check` regenerates the file from the commits it names and fails on any byte of difference, so the file is never edited by hand.
