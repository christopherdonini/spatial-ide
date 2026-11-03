---
id: health-strip-sources-never-mixed
status: active
applies_to: [reviewer, worker, worker-high]
when: [build, gate-reviewer]
paths: ["scripts/plan/site.mjs", "scripts/plan/health.mjs", "scripts/plan/buildHealth.mjs"]
source: ["governance/AUTONOMY.md:128 @ 6b67d44 sha256:2e2006600986e4715d038f9bc84af1b185cd5579206298227f1f7a54f2392455", "governance/AUTONOMY.md:231 @ 6b67d44 sha256:1f83befc12e3576898369fde0d3e033af329d92acbdc72447c352c630b72437d"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# health-strip-sources-never-mixed

*Paraphrase, not the human's words: the binding text is at the source.*

The health strip keeps two sources on their own dated lines, never mixed: build-time facts (CI on main, open PRs, the latest release), read from GitHub's API inside the Pages build by buildHealth.mjs and dated built_at; machine facts (drift, disks, stray processes, waiting-on-human age, the throughput rows) from health.mjs, dated generated_at.

A fact that could not be read shows its error text, never a bare "unknown". verify:plan never depends on the build-time file.
