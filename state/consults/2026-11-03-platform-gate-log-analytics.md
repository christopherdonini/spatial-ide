*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/GATE-LOG-ANALYTICS-2026-11-03.md` (193470 bytes, sha256 785f27edd223e6448dd8c2930b178cd6904aa40edcb65ba5da48a95a1a12bd5e), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_01EUQ56RmUQoDSFnsTFyJbpQ, agent spatial-ide-drift-sweeper (claude-fable-5-1, effort high), US$ 20.62, about 2749 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. The cloud filing of the same question is `state/consults/2026-11-03-cloud-gate-analytics-report.md` (its branch on 84a90e26; between that commit and this one only governance records changed, the gate log not among them). Both stand, and `state/consults/2026-11-05-platform-and-cloud-gate-analytics-comparison.md` sets them side by side. They agree on the first-pass rates by month (25 of 70, 62 of 113, 5 of 7), the attempt-1 rates by role (reviewer 114 of 202, architect 75 of 150), the 435 filed reports, the nine pieces whose counts restarted, the lane numerators and the full-form first-pass count (39 of 102), and neither recommends anything. They differ on: rows, 668 against 667 (the cloud leaves out the void row); unmapped nodes, 15 against 16; rows with no report, 209 against 237; finding totals and class splits, and correction and record rounds (different definitions); the five-line form population, 54 against 57; size buckets (different bounds); durations (measured differently); and rule catalogues, 49 rules against 36, which do not map onto each other. By the ruling (item 2), these analytics wait with E1.*

---

# Gate-log analytics for piece E, 2026-11-03

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-drift-sweeper`, system prompt overridden by the advisor for this task) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01EUQ56RmUQoDSFnsTFyJbpQ) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 2749 s active, US$ 20.62. Nothing below this line is edited.

---

I'll start by cloning the repository and examining its structure.

-----

Let me look at a couple of gate reports to understand their structure, plus the form structure.

-----

Both are PLAN's own `gate` values, so the mapping is right. Final regeneration and copy to outputs:

-----

Checked out `main` @ `652752afa9bedb0172948869c9ab7f0b8ee08dd3` (2026-11-03 17:35:46 +0100, "docs: the human's message of 2026-11-03 filed verbatim …"). Nothing was pushed, forked, opened or commented; the clone's working tree is clean (`git status --porcelain` empty). Deliverables are also copied to `/mnt/session/outputs/` (the scripts, `REPORT.md`, and `out/{pieces,reports,findings,rules}.csv` — the CSVs carry the full per-finding and per-report data that REPORT.md abridges).

## Summary of what was measured (readings, not judgments)

- **Inputs read**: `state/gate-log.json` — 668 entries over 190 nodes (`scripts/plan/README.md:258-266 @ 652752a` defines the file); `governance/PLAN.yaml` — 356 nodes; `governance/forms/**` — 190 forms; `state/consults/gates/` — 435 reports, plus 34 pre-§25 reports under `state/consults/` named `*-gate<n>-<role>.md` (`governance/AUTONOMY.md:480 @ 652752a` dates the filing rule to round 25).
- **First-pass rate** (every gate's attempt 1 PASS or PASS WITH NOTES): 2026-09 36% (25/70), 2026-10 55% (62/113), 2026-11 71% (5/7). Under `scripts/plan/health.mjs:161-182`'s own definition (earliest entry, strict PASS; PASS WITH NOTES is not counted) the figures are 37% / 38% / 14%, so the strip's number and the form-level reading diverge mostly on PASS WITH NOTES, which only appears from October.
- **Correction rounds**: mean 1.49 per piece in September, 0.73 in October, 0.29 in November; gate entries per node 4.43 → 3.04 → 2.14. Record rounds (`record: true`): 52 in September, 4 in October, 0 in November.
- **By role**: reviewer attempt-1 pass rate 56% (78 P / 36 PWN / 88 F of 202), architect 50% (47/28/75 of 150); FAIL share over all attempts 43% vs 47%. The one `tester` entry is row 44 (`lod-tier-builder-route-b`).
- **By size** (the form's declared budget): ≤50 lines first-pass 69%, 51–150 49%, 151–500 42%, 501–1500 27%, >1500 40%; mean correction rounds rise 0.35 → 0.72 → 1.15 → 1.59 → 2.10. Five-line forms: 56% first-pass, mean CR 0.72; full forms: 38%, 1.32.
- **Days form → closing record** (git log on the form): median 0–1 day in every month and lane; the PR merge-commit date agrees within 3 days for all but one piece (`corpus-reproducibility-record`, whose form took an amendment 32 days after its PR).
- **Rules most often cited by open findings** (1,814 open findings; keyword classification, `rules.py`): R48 stale/untrue descriptions in comments, docs and record rows (250 findings, 177 reports; source `.claude/agents/worker.md:27`, `tester.md:11`, `AUTONOMY.md:389`), R36 an unsupported claim of a guarantee/limit/measurement (187; `AUTONOMY.md:389`, `architect.md:17`, `reviewer.md:31`), R43 suites/CI not run or not recorded (118; `AUTONOMY.md:168-174, :391`), R17 mutation per test / verify-mutation is not an observation (109; `AUTONOMY.md:215`, `architect.md:15`, `reviewer.md:29`, `worker.md:33`), R03 verbatim quotes byte for byte (102; `architect.md:10`, `reviewer.md:25`, `worker.md:25`), R24 append-only / post-result first line (99; `AUTONOMY.md:385`), R27 cancellation (98; `reviewer.md:12`), R14 the record cap (91; `AUTONOMY.md:241, :389`). The `.claude/agents/*.md` line numbers are at the named commit.
- **Piece E's own measure** (`state/directives/2026-10-24-governance-piece-e-rules-as-records-readings-e1-repin-fresh-session-practice.md:70-72 @ 652752a`): E1 has not merged, so only the "before" half exists — the ten most recent gated pieces: 7/10 first-pass, 23 gate runs (2.30 per node), 4 correction rounds. `analytics.py --last N` recomputes it after E1.

**Gaps and caveats** (details in REPORT.md §5): 15 gate-log nodes have no PLAN node (lane `unmapped`); 209 gate-log entries (207 of them in September) have no report file, so their finding classes are 0/0/0; 24 forms yield no budget reading; 51 forms have no amendment heading naming the closing record, so the last content commit stands in (flagged `*`); 10 reports share a gate-log row with another report and 41 report verdict lines differ from the gate-log verdict (the gate-log verdict is used); rule classification is regular-expression matching that the maintainers can re-read row by row in `findings.csv`.

=== FILE: scripts/gate-analytics/README.md ===
# scripts/gate-analytics — gate-log analytics for governance piece E's measurement

Read-only analytics over `state/gate-log.json`, `governance/PLAN.yaml`, `governance/forms/**`
and the gate reports under `state/consults/gates/` (plus the pre-§25 `state/consults/*-gate<n>-<role>.md`).
Nothing in the repository is written; the outputs go to `--out` (default `out/gate-analytics/`).

    python3 scripts/gate-analytics/analytics.py --root . --out out/gate-analytics [--last 10] [--no-pre-s25]

Needs Python 3.11+ and Node (for `plan_to_json.mjs`, which reuses `scripts/plan/yamlSubset.mjs`
so PLAN.yaml is read exactly as `verify:plan` reads it). No dependency is added. Runtime is about a
minute, almost all of it `git log --follow` over the 190 forms.

| file | what it reads |
|---|---|
| `common.py` | helpers: git, the gate log (with 1-based `row`), PLAN.yaml via Node, verdict normalisation |
| `gate_log.py` | per node: gates seen, first-pass verdict per gate, correction rounds, record rounds, restarts |
| `forms.py` | per form: node(s), five-line vs full, §9 gates, declared line budget (regex, matched text kept), amendments, the closing-record amendment, `git log --follow` dates |
| `reports.py` | per gate report: file-name parts, filing-note node / PR / `Reviewed: <branch> @ <commit>`, verdict line, findings by id and class (Correctness / Evidence / Documentation, or S1 / S2 / N) with text |
| `join.py` | gate-log node → PLAN node; report → gate-log row (node, role, date, gate number, verdict; ordered alignment where a group is ambiguous) |
| `rules.py` | the rule catalogue (R01–R49) with each rule's source cite and the regular expressions that mark a finding as citing it |
| `analytics.py` | the join, the aggregates (month, lane, size, form shape, role, the last N pieces), the rules table, the data-quality note; writes `pieces.csv`, `reports.csv`, `findings.csv`, `rules.csv`, `REPORT.md` |

Every reading is a reading of the records as text. The gate-log verdict is authoritative where a
report's own verdict line differs; the rule classification is keyword matching that the
maintainers can re-read row by row in `findings.csv`.
=== END ===

=== FILE: scripts/gate-analytics/plan_to_json.mjs ===
#!/usr/bin/env node
// Dumps governance/PLAN.yaml as JSON using the repository's own subset parser
// (scripts/plan/yamlSubset.mjs), so the lane/gate/evidence fields are read exactly
// as verify:plan reads them. Usage: node plan_to_json.mjs <repo-root> > plan.json
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const root = process.argv[2] || '.';
const { parseYamlSubset } = await import(pathToFileURL(join(root, 'scripts/plan/yamlSubset.mjs')).href);
const plan = parseYamlSubset(readFileSync(join(root, 'governance/PLAN.yaml'), 'utf8'));
process.stdout.write(JSON.stringify(plan));
=== END ===

=== FILE: scripts/gate-analytics/common.py ===
"""Shared helpers for the gate-log analytics (governance piece E's measurement).

Every function here reads the repository as data; nothing writes into it.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
from collections import OrderedDict
from datetime import date

GATE_ROLES = ("reviewer", "architect", "tester")
VERDICTS = ("PASS", "PASS WITH NOTES", "FAIL")


def repo_root() -> str:
    return os.environ.get("SPATIAL_IDE_ROOT", os.getcwd())


def git(root: str, *args: str) -> str:
    out = subprocess.run(["git", "-C", root, *args], capture_output=True, text=True, check=False)
    return out.stdout


def head_commit(root: str) -> str:
    return git(root, "rev-parse", "HEAD").strip()


def load_gate_log(root: str) -> list[dict]:
    """state/gate-log.json as a list; `row` is the 1-based position (the number the
    records cite as "gate-log 613")."""
    with open(os.path.join(root, "state/gate-log.json"), encoding="utf-8") as fh:
        rows = json.load(fh)
    for i, r in enumerate(rows, 1):
        r["row"] = i
    return rows


def load_plan(root: str) -> dict:
    """governance/PLAN.yaml through the repository's own subset parser (plan_to_json.mjs)."""
    here = os.path.dirname(os.path.abspath(__file__))
    out = subprocess.run(["node", os.path.join(here, "plan_to_json.mjs"), root],
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def plan_nodes_by_id(plan: dict) -> "OrderedDict[str, dict]":
    return OrderedDict((n["id"], n) for n in plan["nodes"])


def parse_date(s: str | None) -> date | None:
    if not s:
        return None
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", str(s))
    return date(int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None


def norm_verdict(v: str) -> str:
    v = v.strip().upper().rstrip(".")
    if v.startswith("PASS WITH"):
        return "PASS WITH NOTES"
    if v.startswith("PASS"):
        return "PASS"
    if v.startswith("FAIL") or v.startswith("BLOCK"):
        return "FAIL"
    if v.startswith("VOID"):
        return "VOID"
    return v


def md_table(headers: list[str], rows: list[list]) -> str:
    def cell(x):
        s = "" if x is None else str(x)
        return s.replace("|", "\\|").replace("\n", " ")
    out = ["| " + " | ".join(headers) + " |", "|" + "|".join("---" for _ in headers) + "|"]
    for r in rows:
        out.append("| " + " | ".join(cell(c) for c in r) + " |")
    return "\n".join(out)


def pct(n: int, d: int) -> str:
    return "n/a" if not d else f"{100.0 * n / d:.0f}%"
=== END ===

=== FILE: scripts/gate-analytics/gate_log.py ===
"""Per-node reading of state/gate-log.json.

For every node (a "gated piece" is a gate-log node): the gates it saw, the first-pass
verdict per gate, the number of correction rounds, the record rounds, and the dates.

Correction rounds: per gate, the entries whose `attempt` is greater than 1; the node's
count is the maximum over its gates (the reviewer's attempts 2..5 are four rounds even
when the architect stopped at 3). An `attempt: 1` that appears a second time for the same
node+gate starts a new sequence (a re-gated node); the first sequence decides the
first-pass verdict and the restart is flagged.
"""
from __future__ import annotations

from collections import OrderedDict, defaultdict

from common import load_gate_log, norm_verdict


def per_node(rows: list[dict]) -> "OrderedDict[str, dict]":
    nodes: "OrderedDict[str, dict]" = OrderedDict()
    for r in rows:
        n = nodes.setdefault(r["node"], {
            "node": r["node"], "rows": [], "gates": OrderedDict(), "first_date": r["date"],
            "last_date": r["date"], "record_rounds": set(), "void": 0, "restarts": 0,
        })
        n["rows"].append(r["row"])
        n["last_date"] = max(n["last_date"], r["date"])
        n["first_date"] = min(n["first_date"], r["date"])
        v = norm_verdict(r["verdict"])
        if v == "VOID":
            n["void"] += 1
        g = n["gates"].setdefault(r["gate"], {"entries": [], "first_pass": None, "first_row": None,
                                              "attempts": 0, "correction_entries": 0, "sequences": 0})
        g["entries"].append(r)
        g["attempts"] = max(g["attempts"], r["attempt"])
        if r["attempt"] == 1:
            g["sequences"] += 1
            if g["first_pass"] is None:
                g["first_pass"] = v
                g["first_row"] = r["row"]
            else:
                n["restarts"] += 1
        else:
            if v != "VOID":
                g["correction_entries"] += 1
        if r.get("record") is True:
            n["record_rounds"].add((r["gate"], r["attempt"]))
    for n in nodes.values():
        n["correction_rounds"] = max((g["correction_entries"] for g in n["gates"].values()), default=0)
        # distinct attempts tagged record:true (an attempt gated twice counts once), as health.mjs counts
        n["record_rounds"] = len({a for (_g, a) in n["record_rounds"]})
        n["first_pass_all"] = all(g["first_pass"] in ("PASS", "PASS WITH NOTES") for g in n["gates"].values())
        n["first_pass_clean"] = all(g["first_pass"] == "PASS" for g in n["gates"].values())
        n["gate_entries"] = sum(len(g["entries"]) for g in n["gates"].values())
        n["month"] = n["first_date"][:7]
    return nodes


if __name__ == "__main__":
    import sys
    from common import repo_root
    rows = load_gate_log(repo_root())
    nodes = per_node(rows)
    print(len(rows), "entries,", len(nodes), "nodes")
    for n in list(nodes.values())[:5]:
        print(n["node"], {g: (v["first_pass"], v["attempts"]) for g, v in n["gates"].items()}, n["correction_rounds"])
=== END ===

=== FILE: scripts/gate-analytics/forms.py ===
"""Reads every preregistration form under governance/forms/.

Per form: the PLAN node(s) it gates, its shape (five-line or full), the gates its §9
names, the declared line budget, its amendments (headings), the amendment that records
the merge (the closing record), and the git dates of the form's first commit and of the
closing record's commit (git log on the form file, following the 2026-10-29 rename
through governance/MOVED.tsv).
"""
from __future__ import annotations

import os
import re
from collections import OrderedDict

from common import git, parse_date

FORM_GLOB_DIR = "governance/forms"

# §9 (or the five-line "Gate:" note) — which agents the form names
ROLE_WORDS = {
    "reviewer": re.compile(r"\breviewer\b", re.I),
    "architect": re.compile(r"\barchitect\b", re.I),
    "tester": re.compile(r"\btester(-high)?\b", re.I),
}

GATES_HEADING = re.compile(r"^#{2,4}\s+(§\s?9\b|9\.|§[A-Z]\.\s+Gates|§\d+\.?\s+Gates|\d+\.\s+Gates)", re.M)
ANY_HEADING = re.compile(r"^#{2,4}\s+", re.M)
AMEND_HEADING = re.compile(r"^#{2,4}\s+Amendment\s+(\d+[a-z]?)\b(.*)$", re.M)
CLOSING_WORDS = re.compile(r"closing record|closing state|\bmerged\b|the merge\b|after the merge|merge-?commit|\blanded\b|"
                           r"the click\b|closes the piece|closing amendment", re.I)
CORRECTION_WORDS = re.compile(r"correction round|record correction|record-correction|reduction", re.I)

BUDGET_PATTERNS = [
    # five-line Scope line and its variants
    re.compile(r"line budget[^0-9\n]{0,40}?(\d[\d,]*)\b", re.I),
    re.compile(r"budget[^0-9\n]{0,15}(?:<=|≤)\s*(\d[\d,]*)", re.I),
    # full-form §7 totals
    re.compile(r"at most\s+(\d[\d,]*)\s+(?:changed\s+)?lines", re.I),
    re.compile(r"(?:<=|≤)\s*(\d[\d,]*)\s+(?:changed\s+|non-generated\s+)?lines", re.I),
    re.compile(r"(\d[\d,]*)\s+lines\s+(?:over|across)\s+\d+\s+files?", re.I),
    re.compile(r"§21c figure\s+(\d[\d,]*)", re.I),
    re.compile(r"at most\s+(\d[\d,]*)\s+non-generated\s+lines", re.I),
    re.compile(r"(\d[\d,]*)\s+(?:changed|non-generated)\s+lines", re.I),
    re.compile(r"[Tt]otal[^|\n]{0,40}?\*{0,2}(?:about\s+)?(\d[\d,]*)\s*(?:\*{0,2}\s*)?(?:changed\s+)?lines", re.I),
    re.compile(r"^\|\s*\*{0,2}Total\*{0,2}.*\|\s*\*{0,2}(?:about\s+)?(\d[\d,]*)[^|\n]*\|?\s*$", re.I | re.M),
]


def section_text(text: str, heading_re: re.Pattern) -> str | None:
    m = heading_re.search(text)
    if not m:
        return None
    start = m.end()
    nxt = re.compile(r"^#{1,3}\s+", re.M).search(text, start)
    return text[start: nxt.start() if nxt else len(text)]


def declared_budget(text: str, five_line: bool) -> tuple[int | None, str | None]:
    """Returns (budget, matched text). Five-line forms: the Scope line first; full forms:
    the §7 section first; then the whole form. The matched text is kept so a reader can
    check the reading."""
    scopes: list[str] = []
    if five_line:
        m = re.search(r"^\**Scope\**:\s*(.*)$", text, re.M)
        if m:
            scopes.append(m.group(1))
    s7 = section_text(text, re.compile(r"^#{2,4}\s+(§\s?7\b|7\.)", re.M))
    if s7:
        scopes.append(s7)
    scopes.append(text)
    for scope in scopes:
        for pat in BUDGET_PATTERNS:
            m = pat.search(scope)
            if m:
                try:
                    return int(m.group(1).replace(",", "")), m.group(0).strip()[:80]
                except ValueError:
                    continue
    return None, None


def git_history(root: str, path: str) -> list[dict]:
    """Commits touching the form, oldest first, following renames; each with the path it
    had at that commit and the name-status letter (A, M, R100 ...)."""
    out = git(root, "log", "--follow", "--format=%x1e%H|%ci|%s", "--name-status", "--", path)
    commits = []
    for chunk in out.split("\x1e"):
        chunk = chunk.strip()
        if not chunk:
            continue
        lines = chunk.splitlines()
        h, ci, subj = lines[0].split("|", 2)
        status, p = None, path
        for ln in lines[1:]:
            ln = ln.strip()
            if not ln:
                continue
            parts = ln.split("\t")
            status = parts[0]
            p = parts[-1]
        commits.append({"hash": h, "date": ci[:10], "datetime": ci, "subject": subj, "status": status, "path": p})
    commits.reverse()
    return commits


def commit_adding(root: str, paths: list[str], needle: str) -> dict | None:
    """The oldest commit whose diff on any of `paths` adds the heading text (git log -S)."""
    out = git(root, "log", "--format=%H|%ci|%s", "-S", needle, "--", *paths)
    lines = [ln for ln in out.splitlines() if ln.strip()]
    if not lines:
        return None
    h, ci, subj = lines[-1].split("|", 2)
    return {"hash": h, "date": ci[:10], "datetime": ci, "subject": subj}


def read_forms(root: str, plan_nodes: dict) -> "OrderedDict[str, dict]":
    gate_to_nodes: dict[str, list[str]] = {}
    for nid, n in plan_nodes.items():
        g = n.get("gate")
        if g and g != "none":
            gate_to_nodes.setdefault(g, []).append(nid)
    forms: "OrderedDict[str, dict]" = OrderedDict()
    base = os.path.join(root, FORM_GLOB_DIR)
    for module in sorted(os.listdir(base)):
        mdir = os.path.join(base, module)
        if not os.path.isdir(mdir):
            continue
        for fn in sorted(os.listdir(mdir)):
            if not fn.endswith(".md"):
                continue
            rel = f"{FORM_GLOB_DIR}/{module}/{fn}"
            with open(os.path.join(mdir, fn), encoding="utf-8") as fh:
                text = fh.read()
            five_line = bool(re.search(r"^\**Out-of-scope\**:", text, re.M))
            named = re.findall(r"PLAN node[s]?\s+`([a-z0-9][a-z0-9-]*)`", text)
            named += re.findall(r"PLAN node[s]?\s+([a-z0-9]+(?:-[a-z0-9]+)+)", text)
            gates_sec = section_text(text, GATES_HEADING)
            if gates_sec is None and five_line:
                m = re.search(r"^[-*\s]*\**Gate\**:?\s*(.*)$", text, re.M)
                gates_sec = m.group(0) if m else None
            declared_gates = sorted(r for r, rx in ROLE_WORDS.items() if gates_sec and rx.search(gates_sec))
            if five_line and not declared_gates:
                declared_gates = ["reviewer"]  # §21b: the single combined gate
            budget, budget_text = declared_budget(text, five_line)
            amendments = []
            for m in AMEND_HEADING.finditer(text):
                head = (m.group(1), m.group(2).strip(" —-:"))
                amendments.append({"n": head[0], "title": head[1][:160], "line": text.count("\n", 0, m.start()) + 1,
                                   "closing": bool(CLOSING_WORDS.search(head[1])),
                                   "correction": bool(CORRECTION_WORDS.search(head[1]))})
            closing = next((a for a in reversed(amendments) if a["closing"]), None)
            history = git_history(root, rel)
            paths = sorted({c["path"] for c in history} | {rel})
            first = history[0] if history else None
            content_commits = [c for c in history if not (c["status"] or "").startswith("R")]
            last_content = content_commits[-1] if content_commits else None
            closing_commit = None
            if closing:
                needle = f"Amendment {closing['n']}"
                # search by the heading's distinctive tail so an Amendment-N restated elsewhere does not match
                tail = closing["title"][:60]
                closing_commit = commit_adding(root, paths, tail) if tail else None
                if closing_commit is None:
                    closing_commit = commit_adding(root, paths, needle)
            forms[rel] = {
                "path": rel, "module": module, "five_line": five_line,
                "plan_nodes": gate_to_nodes.get(rel, []), "named_nodes": sorted(set(named)),
                "declared_gates": declared_gates, "gates_section_found": gates_sec is not None,
                "budget": budget, "budget_text": budget_text,
                "amendments": amendments, "amendment_count": len(amendments),
                "correction_amendments": sum(1 for a in amendments if a["correction"]),
                "closing_amendment": closing,
                "first_commit": first, "last_content_commit": last_content, "closing_commit": closing_commit,
                "history_len": len(history),
            }
    return forms


def days_between(a: str | None, b: str | None) -> int | None:
    da, db = parse_date(a), parse_date(b)
    return (db - da).days if da and db else None


if __name__ == "__main__":
    import json
    from common import load_plan, plan_nodes_by_id, repo_root
    root = repo_root()
    forms = read_forms(root, plan_nodes_by_id(load_plan(root)))
    nb = sum(1 for f in forms.values() if f["budget"] is None)
    nc = sum(1 for f in forms.values() if f["closing_amendment"] is None)
    ncc = sum(1 for f in forms.values() if f["closing_amendment"] and f["closing_commit"] is None)
    print(len(forms), "forms;", nb, "without a budget reading;", nc, "without a closing amendment;", ncc, "closing amendment not found in git -S")
    for f in list(forms.values())[:3]:
        print(json.dumps({k: v for k, v in f.items() if k != "amendments"}, default=str)[:600])
=== END ===

=== FILE: scripts/gate-analytics/reports.py ===
"""Reads the gate reports under state/consults/gates/ (and, as a secondary set, the
pre-§25 reports under state/consults/ named *-gate<n>-<role>.md).

Per report: the date, piece slug, stage (gate n / reduction / scoped), role, the PLAN node
the filing note names, the PR number, the reviewed branch @ commit, the verdict line, and
the findings: each with its id, its class (Correctness / Evidence / Documentation when the
report says so; otherwise the pre-2026-10-05 severity bucket S1-blocking / S2-should-fix /
N-note), the section it sits under, and its text.
"""
from __future__ import annotations

import os
import re
from collections import OrderedDict

from common import norm_verdict

FNAME = re.compile(
    r"^(?P<date>\d{4}-\d{2}-\d{2})-(?P<slug>.+?)-(?P<stage>gate\d+[a-z]?|reduction\d*|round-?\d+|i\d+|s10|e-scoped|"
    r"closing-record|closing-scoped|merge|scoped-read-c5)?-?(?P<role>architect|reviewer|tester)?(?P<tail>-[a-z0-9-]+)?\.md$")

CLASS_WORDS = [("Correctness", re.compile(r"\bCorrectness\b", re.I)),
               ("Evidence", re.compile(r"\bEvidence\b", re.I)),
               ("Documentation", re.compile(r"\bDocumentation\b|\brecord(-fidelity| findings?)\b", re.I))]
SEVERITY_WORDS = [("blocking", re.compile(r"\bS1\b|\bblock(ing|ers?|s)?\b|\bblockers?\b", re.I)),
                  ("should-fix", re.compile(r"\bS2\b|should[- ]fix", re.I)),
                  ("note", re.compile(r"\bN\b|\bnits?\b|\bnotes?\b|suggestions?|non-blocking|not blocking", re.I))]

HEADING = re.compile(r"^(#{1,6})\s+(.*)$")
BOLD_HEADING = re.compile(r"^\*\*([^*]{2,80})\*\*:?\s*$")
# a finding item: optional list marker, then **ID. text** / **ID: text** / **ID — text** / ### ID
ID_CORE = r"(?:G\d-|R\d-|A\d-|G2-)?(?:C|E|D|DOC|DR|ND|N-D|S1|S2|B|N|F|L)-?\d+[a-z]?"
ITEM = re.compile(r"^\s*(?:[-*]\s+|\d+\.\s+)?\*\*(?P<id>" + ID_CORE + r")(?P<sep>[.:)\s—-])")
ITEM_H = re.compile(r"^#{3,6}\s+\**(?P<id>" + ID_CORE + r")\b")
ID_PREFIX = re.compile(r"^(?:G\d-|R\d-|A\d-|G2-)?(?P<p>C|E|DOC|DR|ND|N-D|D|S1|S2|B|N|F|L)")
PREFIX_CLASS = {"C": "Correctness", "E": "Evidence", "D": "Documentation", "DOC": "Documentation",
                "DR": "Documentation", "ND": "Documentation", "N-D": "Documentation",
                "S1": "blocking", "B": "blocking", "S2": "should-fix", "N": "note", "F": "unclassed", "L": "unclassed"}
SKIP_SECTIONS = re.compile(r"mutation|checks?\b|commands|exit codes|files read|hold lines|deviations|what i (ran|read)|"
                           r"suites?\b|coverage|seam:|as i read them|the (architect|reviewer)'s gate", re.I)
VERDICT_LINE = re.compile(r"\b(?:verdict|overall)\**\s*[:—-]?\s*\**\s*(?P<v>pass with notes|pass with documentation findings|pass|fail|block|void)\b",
                          re.I)
VERDICT_COLON = re.compile(r"`?:\s*\**(?P<v>PASS WITH NOTES|FAIL|PASS)\b", re.M)
VERDICT_LEAD = re.compile(r"^\s*\**\s*(?:VERDICT:\s*)?(?P<v>PASS WITH NOTES|PASS|FAIL|BLOCK)\b", re.M)
VERDICT_PROSE = re.compile(r"\b(?P<v>PASS WITH NOTES|FAIL|PASS)\b[,.]?\s+(?:on |Reviewed|`|cut/|governance/|docs/|—|-)", re.M)


def classify_heading(h: str) -> tuple[str | None, str | None]:
    cls = next((c for c, rx in CLASS_WORDS if rx.search(h)), None)
    sev = next((s for s, rx in SEVERITY_WORDS if rx.search(h)), None)
    return cls, sev


def parse_report(path: str, text: str) -> dict:
    fn = os.path.basename(path)
    m = FNAME.match(fn)
    meta = m.groupdict() if m else {"date": fn[:10], "slug": fn[11:-3], "stage": None, "role": None, "tail": None}
    head = "\n".join(text.splitlines()[:25])
    node = re.search(r"PLAN node[s]?\s+`([a-z0-9][a-z0-9-]*)`", head)
    node2 = re.search(r"node[:\s]+`?([a-z0-9][a-z0-9-]+)@g\d+", head)
    pr = re.search(r"PR\s+#(\d+)", head)
    reviewed = re.search(r"Reviewed:\s*`?([^\s`@]+)`?\s*@\s*`?([0-9a-f]{7,40})", text)
    gate_n = re.search(r"\bgate[- ](\d+)[a-z]?\b", head, re.I)
    head6 = "\n".join(text.splitlines()[:6])
    attempt = re.search(r"\battempt[- ](\d+)\b", head6, re.I)
    role_txt = re.search(r"\b(architect|reviewer|tester)\b", head, re.I)
    # verdict
    verdict = None
    for rx in (VERDICT_LINE, VERDICT_LEAD, VERDICT_PROSE, VERDICT_COLON):
        vm = rx.search(text)
        if vm:
            verdict = norm_verdict(vm.group("v"))
            break
    # findings
    findings = []
    section, sec_cls, sec_sev, skip = None, None, None, False
    cur = None
    for ln_no, line in enumerate(text.splitlines(), 1):
        hm = HEADING.match(line) or BOLD_HEADING.match(line)
        if hm and not ITEM.match(line):
            if cur:
                findings.append(cur); cur = None
            section = hm.group(2) if hm.re is HEADING else hm.group(1)
            sec_cls, sec_sev = classify_heading(section)
            skip = bool(SKIP_SECTIONS.search(section)) and sec_cls is None
            continue
        im = ITEM.match(line) or ITEM_H.match(line)
        if im and not skip:
            if cur:
                findings.append(cur)
            fid = im.group("id")
            p = ID_PREFIX.match(fid).group("p")
            pcls = PREFIX_CLASS.get(p, "unclassed")
            if pcls in ("Correctness", "Evidence", "Documentation"):
                cls = pcls
            elif sec_cls:
                cls = sec_cls
            else:
                cls = pcls if pcls != "unclassed" else (sec_sev or "unclassed")
            cur = {"id": fid, "class": cls, "severity": pcls if pcls in ("blocking", "should-fix", "note") else sec_sev,
                   "section": section, "line": ln_no, "text": line.strip()}
            continue
        if cur is not None:
            if line.strip() == "" and len(cur["text"]) > 1500:
                findings.append(cur); cur = None
            elif len(cur["text"]) < 4000:
                cur["text"] += "\n" + line.strip()
    if cur:
        findings.append(cur)
    # de-duplicate an id restated later in the same report (e.g. "C-1 is closed" under a later section)
    seen, uniq = set(), []
    for f in findings:
        if f["id"] in seen:
            continue
        seen.add(f["id"]); uniq.append(f)
    counts = {"Correctness": 0, "Evidence": 0, "Documentation": 0, "blocking": 0, "should-fix": 0, "note": 0, "unclassed": 0}
    for f in uniq:
        counts[f["class"]] = counts.get(f["class"], 0) + 1
    role = meta.get("role") or (role_txt.group(1).lower() if role_txt else None)
    return {
        "path": path, "file": fn, "date": meta["date"], "slug": meta["slug"], "stage": meta.get("stage"),
        "tail": meta.get("tail"), "role": role,
        "node_named": node.group(1) if node else (node2.group(1) if node2 else None),
        "pr": int(pr.group(1)) if pr else None,
        "branch": reviewed.group(1) if reviewed else None, "commit": reviewed.group(2) if reviewed else None,
        "gate_n": (int(re.sub(r"\D", "", meta["stage"])) if meta.get("stage") and meta["stage"].startswith("gate")
                   else (int(gate_n.group(1)) if gate_n else None)),
        "attempt_named": int(attempt.group(1)) if attempt else None,
        "verdict": verdict, "findings": uniq, "counts": counts,
        "uses_three_classes": any(f["class"] in ("Correctness", "Evidence", "Documentation") for f in uniq)
                               or bool(re.search(r"Correctness|Evidence", text)),
    }


def read_reports(root: str, include_pre_s25: bool = True) -> "OrderedDict[str, dict]":
    out: "OrderedDict[str, dict]" = OrderedDict()
    gdir = os.path.join(root, "state/consults/gates")
    for fn in sorted(os.listdir(gdir)):
        if fn.endswith(".md"):
            rel = f"state/consults/gates/{fn}"
            with open(os.path.join(gdir, fn), encoding="utf-8") as fh:
                r = parse_report(rel, fh.read())
            r["set"] = "gates"
            out[rel] = r
    if include_pre_s25:
        cdir = os.path.join(root, "state/consults")
        for fn in sorted(os.listdir(cdir)):
            if re.search(r"-(gate\d+|attempt\d+)-(architect|reviewer|tester)\.md$", fn):
                rel = f"state/consults/{fn}"
                with open(os.path.join(cdir, fn), encoding="utf-8") as fh:
                    r = parse_report(rel, fh.read())
                r["set"] = "pre-s25"
                out[rel] = r
    return out


if __name__ == "__main__":
    from common import repo_root
    reps = read_reports(repo_root())
    nv = sum(1 for r in reps.values() if r["verdict"] is None)
    nn = sum(1 for r in reps.values() if r["node_named"] is None)
    print(len(reps), "reports;", nv, "without a verdict reading;", nn, "without a named node")
    import collections
    print(collections.Counter(r["verdict"] for r in reps.values()))
    tot = collections.Counter()
    for r in reps.values():
        tot.update(r["counts"])
    print(tot)
=== END ===

=== FILE: scripts/gate-analytics/join.py ===
"""Joins the gate-log nodes with PLAN.yaml, the forms and the gate reports.

Node -> lane/form: PLAN.yaml's node (`lane`, `gate`); a gate-log node absent from PLAN.yaml
is matched to a PLAN node whose `evidence.branch` basename equals the gate-log name, else
stays unmapped (listed in the data-quality note).

Report -> gate-log entry: by the PLAN node the filing note names (else the PR number's
PLAN node, else the file-name slug against the gate-log node ids), then by role, the
report's date and its gate number against the entry's `attempt`.
"""
from __future__ import annotations

import os
import re
from collections import OrderedDict, defaultdict

from common import parse_date


def map_nodes_to_plan(log_nodes: dict, plan_nodes: dict) -> dict[str, dict]:
    by_branch = {}
    for nid, n in plan_nodes.items():
        ev = n.get("evidence") or {}
        if isinstance(ev, dict) and ev.get("branch"):
            b = str(ev["branch"])
            by_branch[os.path.basename(b)] = nid
            by_branch[b.replace("/", "-")] = nid
    out = {}
    for name in log_nodes:
        if name in plan_nodes:
            out[name] = {"plan_id": name, "how": "id"}
        elif name in by_branch:
            out[name] = {"plan_id": by_branch[name], "how": "evidence.branch"}
        else:
            out[name] = {"plan_id": None, "how": "unmapped"}
    return out


def pr_index(plan_nodes: dict) -> dict[int, list[str]]:
    idx: dict[int, list[str]] = defaultdict(list)
    for nid, n in plan_nodes.items():
        ev = n.get("evidence") or {}
        if isinstance(ev, dict) and isinstance(ev.get("pr"), int):
            idx[ev["pr"]].append(nid)
    return idx


def slug_candidates(slug: str, log_node_ids: list[str]) -> list[str]:
    s = slug.lower()
    exact = [n for n in log_node_ids if n == s]
    if exact:
        return exact
    tail = [n for n in log_node_ids if n.endswith("-" + s) or s.endswith("-" + n) or n.startswith(s + "-") or s.startswith(n + "-")]
    if tail:
        return tail
    sub = [n for n in log_node_ids if s in n or n in s]
    if sub:
        return sub
    # the longest shared dash-token prefix, when it is at least three tokens long
    st = s.split("-")
    best, best_len = [], 0
    for n in log_node_ids:
        nt = n.split("-")
        k = 0
        while k < min(len(st), len(nt)) and st[k] == nt[k]:
            k += 1
        if k >= 3 and k > best_len:
            best, best_len = [n], k
        elif k >= 3 and k == best_len:
            best.append(n)
    return best


def attach_reports(reports: dict, log_rows: list[dict], log_nodes: dict, plan_nodes: dict,
                   node_map: dict) -> tuple[dict, list[dict]]:
    """Returns (report -> {node, row}) and the unmatched list. Each gate-log row is taken by at
    most one report (an addendum/confirmation file shares its row with the main report, flagged)."""
    log_ids = list(log_nodes.keys())
    prs = pr_index(plan_nodes)
    plan_to_log = defaultdict(list)
    for ln, m in node_map.items():
        if m["plan_id"]:
            plan_to_log[m["plan_id"]].append(ln)
    taken: dict[int, str] = {}
    result, unmatched = {}, []

    def desired_attempt(r: dict) -> int | None:
        if r.get("attempt_named"):
            return r["attempt_named"]
        t = r.get("tail") or ""
        m = re.search(r"attempt-?(\d+)", t)
        if m:
            return int(m.group(1))
        st = r.get("stage") or ""
        if re.fullmatch(r"gate\d+", st):
            return int(st[4:])
        return None  # gate<n>b, reduction, scoped, closing: the next untaken entry of that day

    order = sorted(reports.items(), key=lambda kv: (kv[1]["date"], kv[1]["slug"], desired_attempt(kv[1]) or 99,
                                                    1 if kv[1].get("tail") else 0, kv[0]))
    for rel, r in order:
        cands: list[str] = []
        how = None
        if r["node_named"]:
            if r["node_named"] in log_nodes:
                cands, how = [r["node_named"]], "filing note"
            elif r["node_named"] in plan_to_log:
                cands, how = plan_to_log[r["node_named"]], "filing note via PLAN"
        if not cands and r["pr"] and r["pr"] in prs:
            for pid in prs[r["pr"]]:
                cands += plan_to_log.get(pid, [pid] if pid in log_nodes else [])
            how = "PR number" if cands else None
        if not cands:
            cands = slug_candidates(r["slug"], log_ids)
            how = "slug" if cands else None
        if not cands:
            unmatched.append({"report": rel, "reason": "no node candidate"})
            continue
        rd = parse_date(r["date"])
        role = r["role"]
        want = desired_attempt(r)
        best = None
        for node in cands:
            for row in log_rows:
                if row["node"] != node or row["gate"] != role:
                    continue
                d = abs((parse_date(row["date"]) - rd).days)
                att_match = want is not None and row["attempt"] == want
                rv = r.get("verdict")
                verdict_clash = rv is not None and ((rv == "FAIL") != (row["verdict"] == "FAIL"))
                score = (d, 1 if verdict_clash else 0, 0 if att_match else 1, 1 if row["row"] in taken else 0, row["row"])
                if best is None or score < best[0]:
                    best = (score, row, node)
        if best is None:
            unmatched.append({"report": rel, "reason": f"candidates {cands} have no {role} entry"})
            continue
        score, row, node = best
        shared = row["row"] in taken
        result[rel] = {"node": node, "row": row["row"], "how": how, "day_gap": score[0],
                       "attempt_match": score[2] == 0, "verdict_clash": score[1] == 1, "shared_row": shared, "candidates": cands,
                       "wanted_attempt": want}
        if not shared:
            taken[row["row"]] = rel
    # pass 2: where a node+role group has a shared row or a verdict clash and the group's report
    # count equals its gate-log entry count, align the two in order (date, wanted attempt, file
    # name against row order) and keep the alignment when it does not add a clash.
    groups: dict[tuple[str, str], list[str]] = defaultdict(list)
    for rel, v in result.items():
        groups[(v["node"], reports[rel]["role"])].append(rel)
    for (node, role), rels in groups.items():
        vs = [result[x] for x in rels]
        if not any(v["shared_row"] or v["verdict_clash"] for v in vs):
            continue
        log_entries = [row for row in log_rows if row["node"] == node and row["gate"] == role]
        if len(log_entries) != len(rels):
            continue
        ordered = sorted(rels, key=lambda x: (reports[x]["date"], desired_attempt(reports[x]) or 99,
                                              1 if reports[x].get("tail") else 0, x))
        before = sum(1 for v in vs if v["verdict_clash"])
        after = 0
        for rel, row in zip(ordered, log_entries):
            rv = reports[rel].get("verdict")
            if rv is not None and ((rv == "FAIL") != (row["verdict"] == "FAIL")):
                after += 1
        if after <= before:
            for rel, row in zip(ordered, log_entries):
                rv = reports[rel].get("verdict")
                result[rel].update({"row": row["row"], "shared_row": False, "aligned": True,
                                    "verdict_clash": rv is not None and ((rv == "FAIL") != (row["verdict"] == "FAIL")),
                                    "attempt_match": (desired_attempt(reports[rel]) == row["attempt"])})
    return result, unmatched


if __name__ == "__main__":
    import json
    from common import load_gate_log, load_plan, plan_nodes_by_id, repo_root
    import gate_log, reports as rp
    root = repo_root()
    rows = load_gate_log(root)
    nodes = gate_log.per_node(rows)
    plan = plan_nodes_by_id(load_plan(root))
    nm = map_nodes_to_plan(nodes, plan)
    print("unmapped nodes:", [k for k, v in nm.items() if not v["plan_id"]])
    reps = rp.read_reports(root)
    res, un = attach_reports(reps, rows, nodes, plan, nm)
    print(len(res), "reports attached;", len(un), "unmatched")
    for u in un:
        print("  UNMATCHED", u)
    import collections
    print(collections.Counter(v["how"] for v in res.values()))
    print("day gap >0:", sum(1 for v in res.values() if v["day_gap"] > 0), "attempt mismatch:", sum(1 for v in res.values() if not v["attempt_match"]), "shared rows:", sum(1 for v in res.values() if v["shared_row"]))
    for rel, v in res.items():
        if v["day_gap"] > 2 or (v["how"] == "slug" and len(v["candidates"]) > 1):
            print("  CHECK", rel, v["node"], v["row"], v["day_gap"], v["candidates"][:4])
=== END ===

=== FILE: scripts/gate-analytics/rules.py ===
"""The rule catalogue: the rules the agent definitions (.claude/agents/*.md) and
governance/AUTONOMY.md state, each with its source cite and the text patterns that mark a
finding as citing it. A finding may cite several rules; a finding that cites none is
counted under `unclassified`.

The patterns are a reading aid, not a judgment: each finding's text was matched by regular
expression and a sample was read by hand (REPORT.md, data quality). All cites are at the
commit the report names.
"""
from __future__ import annotations

import re

A = ".claude/agents/architect.md"
R = ".claude/agents/reviewer.md"
W = ".claude/agents/worker.md"
T = ".claude/agents/tester.md"
AU = "governance/AUTONOMY.md"

RULES: list[dict] = [
    {"id": "R01", "name": "cross-module seam written against the real interface, proven end to end",
     "source": f"{A}:10; {R}:18-25; {W}:17-24 (round 4)",
     "rx": r"\bseams?\b|imagined interface|real shape|end-to-end test|\bround 4\b"},
    {"id": "R02", "name": "no callback/option/code path/pub item without a product caller (instrument-accessor exemption)",
     "source": f"{A}:10; {R}:24-25; {W}:23-25 (round 4; round 5 item 4; round 8)",
     "rx": r"product caller|test-only (pub|caller|accessor|export)|caller grep|no caller|without a caller|instrument accessor|round 5, item 4|\bpre-committed\b.*consumer"},
    {"id": "R03", "name": "a quote marked verbatim matches its source byte for byte",
     "source": f"{A}:10; {R}:25; {W}:25 (round 10)",
     "rx": r"\bverbatim\b|byte[- ]for[- ]byte|byte-identical|byte-equal|paraphrase (presented|marked|introduced)|misquot|does not match its source|\bround 10\b"},
    {"id": "R04", "name": "an elision never removes a negation, condition or qualifier",
     "source": f"{A}:10; {R}:25 (round 11)",
     "rx": r"\belision\b|\belided\b|\bround 11\b"},
    {"id": "R05", "name": "ledger rulings cited by round and item (or entry number), never by line",
     "source": f"{A}:10; {R}:25 (round 12 (a), round 14 (a′))",
     "rx": r"round and item|by round|without its item|line cite into|DECISIONS-PENDING\.md:\d+|entry number|round 12 ?\(a\)|cited by line|cites? .{0,30}by line"},
    {"id": "R06", "name": "a passage that must be invoked is pinned path:line @ commit sha256; a bare self-line, a cite into a file the same commit edits, or a pin read as current fails",
     "source": f"{A}:10; {R}:25 (round 12 (b), round 14, round 15)",
     "rx": r"sha256 ?.{0,40}(does not|wrong|differs|mismatch|fails)|hash(es)? .{0,40}(recompute|does not match|differs|wrong|stale|mismatch|fail)|(pin|pinned reference|pinned line|pinned span) .{0,60}(stale|does not|no longer|wrong|current|mismatch|broken|differs)|\bunpinned\b|no (pin|hash|span hash)\b|without (a |its |the )?(pin|hash|sha256|span hash)|bare (self-)?line|self-reference|round 12 ?\(b\)|\bround 14\b|read as current|which is authoritative|missing (its |the )?(hash|pin)|reproduced (text|passage) .{0,40}(without|no)"},
    {"id": "R07", "name": "a correction is at most three sentences and never restates an earlier amendment's claim",
     "source": f"{A}:10; {R}:25 (round 12 (d))",
     "rx": r"three sentences|over the ceiling|restates? (an |the )?(earlier|previous|prior)|round 12 ?\(d\)"},
    {"id": "R08", "name": "a correction round ends with a superseded index",
     "source": f"{A}:10; {R}:25 (round 12 (e))",
     "rx": r"superseded index|round 12 ?\(e\)"},
    {"id": "R09", "name": "nothing tracked may cite an untracked file as Authority",
     "source": f"{A}:10; {R}:25 (round 14)",
     "rx": r"untracked (file|folder|directory|Authority|path)|cites? an untracked|scratch folder|not (tracked|committed|filed)\b.{0,40}(cite|evidence|report)"},
    {"id": "R10", "name": "a record statement about a tool's behaviour names the tool's commit",
     "source": f"{A}:10; {R}:25 (round 15 (c))",
     "rx": r"tool'?s? commit|tool claim|round 15 ?\(c\)|named with (the tool'?s|its) commit|without (the|its) tool commit|the tool at"},
    {"id": "R11", "name": "a hash reference in an append-only record carries an explicit @ rev at a commit on main",
     "source": f"{A}:10; {R}:25 (round 15 (e)); {AU}:499 (§27)",
     "rx": r"commit on main|branch commit|round 15 ?\(e\)|HEAD default|not on main|only on (the|its|this) branch|pinned at (a|the) branch"},
    {"id": "R12", "name": "a hash reference is written contiguous on one line",
     "source": f"{A}:10; {R}:25 (round 15 (d))",
     "rx": r"\bcontiguous\b|split across|round 15 ?\(d\)|comment continuation"},
    {"id": "R13", "name": "a committed byte of a record is restored only within the round-15 (f) bound",
     "source": f"{A}:10; {R}:25 (round 15 (f))",
     "rx": r"round 15 ?\(f\)|restored? (a |the )?committed byte|rewrote (a|the) (record|amendment)|history (was )?rewritten"},
    {"id": "R14", "name": "the record cap: a closing amendment is references and hashes, never prose; record correction is two rounds per piece",
     "source": f"{A}:10; {R}:25; {AU}:241 (§15), :389 (§22); state/directives/2026-09-18-record-cap.md",
     "rx": r"record cap|references and hashes|references only|prose (that )?restat|restat(es|ing) (a|the|its) claim|reduce[sd]? (the|its) record|record[- ]correction|record round|two rounds|round 2 of 2"},
    {"id": "R15", "name": "every 'discharged'/'done' clause in an amendment names the test or line that proves it",
     "source": f"{A}:10; {R}:25 (round 7)",
     "rx": r"discharg|\"done\" clause|no resolvable proof|\bround 7\b|over-?claims?|claims? (it|to have) (discharged|closed|done)|does not prove|proves nothing|unproven|not (yet )?proved"},
    {"id": "R16", "name": "operator-visible text: engine messages state engine facts; owners state consequences",
     "source": f"{A}:10; {R}:25 (round 7)",
     "rx": r"engine facts?|owners? states?|states? (another|the other|a) module'?s? consequence|another module'?s consequence|Display (says|still says|text)|operator-visible"},
    {"id": "R17", "name": "one mutation per new test that fails it by name; a verify-mutation run is not an observation",
     "source": f"{AU}:215 (§14), :222-226; {A}:15; {R}:29; {W}:33 (round 25 (c))",
     "rx": r"(no|without|lacks? (a|its)|has no|missing) (observed |recorded )?mutation|mutation .{0,60}(not|never) (observed|recorded|applied|run|seen)|unregistered mutation|survives? (the|its|every) mutation|mutation .{0,30}survive|verify-mutation|observation of (a|the) mutation|RECORDED MUTATION|mutations? .{0,40}(unobserved|unrecorded)|never (been )?seen to fail|fail(s|ed)? by name"},
    {"id": "R18", "name": "a sibling search on every fix",
     "source": f"{AU}:215 (§14)",
     "rx": r"\bsiblings?\b"},
    {"id": "R19", "name": "a §7 budget overrun is recorded as class 8 and §7 is never edited",
     "source": f"{A}:15; {R}:29; {W}:33 (round 25, item 2 (a)); docs/PREREGISTRATION-TEMPLATE.md Round 25",
     "rx": r"class 8|§ ?7'?s? (overrun|ceiling|line|figure|edited|not edited)|budget overrun|overrun|over (the|its) (declared |line )?(budget|ceiling)|over by \d+"},
    {"id": "R20", "name": "a scope addition on a standing rule is recorded as class 9 before any code of it",
     "source": f"{A}:15; {R}:29; {W}:33 (round 25, item 2 (b))",
     "rx": r"class 9|scope addition|landed before (any|the|its) amendment"},
    {"id": "R21", "name": "a test-text span on an unmerged branch is named with its commit id, never hash-pinned at a branch commit",
     "source": f"{A}:15; {R}:29; {W}:33 (round 25, item 2 (d))",
     "rx": r"test-text span|without (its|the) commit id|named without its commit|commit id\b.{0,60}(test|span|comment)|round 25, item 2 ?\(d\)|class[- ]3 (row|test)"},
    {"id": "R22", "name": "a five-line form's Out-of-scope line that names a §21a category takes the full form and full gating",
     "source": f"{AU}:334-345 (§21b), :359-375 (§21d), :482 (§25 (e)); {A}:15; {R}:29",
     "rx": r"Out-of-scope line|§ ?21a|§ ?21b|§ ?21d|full form|full gating|re-enters? full|single[- ]gate route|five-line form"},
    {"id": "R23", "name": "the §21c size threshold (≤150 changed lines, ≤8 files; insertions plus deletions) and the form's declared line budget",
     "source": f"{AU}:347-357 (§21c)",
     "rx": r"§ ?21c|150 (changed |non-generated )?lines|size threshold|(declared|line) budget|exceeds? (the|its) budget|file count|insertions plus deletions|over the (eight|8)[- ]file"},
    {"id": "R24", "name": "immutable records are append-only; an amendment written after an outcome says so in its first line and names what it invalidates",
     "source": f"{AU}:385 (§22); docs/PREREGISTRATION-TEMPLATE.md header rule",
     "rx": r"append-only|edited in place|in-place (edit|change|rewrite)|first line (lacks|does not say|omits|should|must|is missing)|post-result|not (yet )?recorded as class|class \d+ (is )?(missing|not recorded|owed|not yet recorded)|no amendment (records|declares|carries)|not in any amendment|invalidat(es|ed|ion) .{0,30}(not|un)"},
    {"id": "R25", "name": "a gate report's first line names the branch @ commit it reviewed",
     "source": f"{AU}:480 (§25 (b)); {A}:15; {R}:29",
     "rx": r"first line (names|must name|lacks)|Reviewed: .{0,30}(missing|absent)|reviewed commit|which commit (it|was) reviewed"},
    {"id": "R26", "name": "no unwrap on fallible paths in non-spike code; failures not hidden",
     "source": f"{R}:11 (checklist 1)",
     "rx": r"\bunwrap\(\)|\bexpect\(|\bpanic(s|king|ked)?\b|unhandled (error|rejection)|swallow(s|ed)? (the )?(error|failure)|error (is )?(hidden|silent)|silently"},
    {"id": "R27", "name": "nothing synchronous on the canvas/UI path; every operation cancellable (docs/01 principle 7, ADR-018)",
     "source": f"{R}:12 (checklist 2); {A}:10 (principle violations); CLAUDE.md non-negotiables",
     "rx": r"\bcancel(lable|lation|led|s)?\b|ADR-018|principle 7|never[- ]block|synchronous|blocks? the (canvas|UI)|\binterrupt(s|ed)?\b|\bbackpressure\b"},
    {"id": "R28", "name": "no JSON on a data path (ADR-004)",
     "source": f"{R}:13 (checklist 3)",
     "rx": r"serde_json|JSON\.parse|JSON on (a|the) data|ADR-004|zero-copy|copy-minimi"},
    {"id": "R29", "name": "CRS handled as a type; no implicit reprojection or hard-coded EPSG assumption",
     "source": f"{R}:14 (checklist 4); CLAUDE.md non-negotiables",
     "rx": r"\bCRS\b|EPSG:?\d*|reprojection|ADR-003|silent conversion"},
    {"id": "R30", "name": "no unmeasured performance claim; numbers per docs/08",
     "source": f"{R}:15 (checklist 5); {T}:11; {AU}:127 (§5)",
     "rx": r"docs/08|perf(ormance)? (claim|number|figure)|unmeasured|\bp50\b|\bp95\b|measurement|docs/08-measured|latency (claim|figure)"},
    {"id": "R31", "name": "float precision: projected coordinates reaching float32 without offset-relative handling",
     "source": f"{R}:16 (checklist 6)",
     "rx": r"float32|\bf32\b|offset-relative|\bprecision\b"},
    {"id": "R32", "name": "tests for non-spike code; every required test reaches its assertion",
     "source": f"{R}:17 (checklist 7); {W}:27; {T}:11 (the four failure classes)",
     "rx": r"(no|missing|without a|lacks a|has no|needs a|carries no) test|untested|not under test|no end-to-end test|does not reach its assertion|reach(es)? (its|the) (intended )?assertion|only its setup|asserts? nothing|would (also )?pass (on|under|with)|cannot fail|never fails|tautolog|assert(ion)? (is )?(too )?(weak|loose|vacuous)"},
    {"id": "R33", "name": "module and protocol boundaries (docs/02, docs/10; control plane vs data plane; MCP never bulk data)",
     "source": f"{A}:10 (module and protocol boundaries)",
     "rx": r"docs/02|docs/10|module boundar|control plane|data plane|\bMCP\b|\bwire\b|SKP-V0|protocol/skp"},
    {"id": "R34", "name": "operation-class correctness (ADR-006: pure / workspace / side effect)",
     "source": f"{A}:10 (operation-class correctness)",
     "rx": r"ADR-006|\bundo(able)?\b|operation[- ]class|side[- ]effect"},
    {"id": "R35", "name": "the piece's text defines its scope: no improvisation past it; scope creep against the roadmap and the form",
     "source": f"{W}:11 (Rules); {A}:10 (scope creep against the roadmap)",
     "rx": r"scope creep|beyond (the|its) (scope|piece|form)|out of scope|outside (the|its|this) (scope|piece|form)|off-scope|undeclared (change|file|edit)|not (named|declared|listed) (in|by) (the form|§|the Scope|Scope)|improvis|widen(ing|ed|s)?\b|\bvolunteer|does more than §|not in (the|its) Scope|unlisted file"},
    {"id": "R36", "name": "a claim of a guarantee, a limit or a measurement that the code or the evidence does not support is never documentation-only",
     "source": f"{AU}:389 (§22); {A}:17; {R}:31 (the 2026-10-05 proportional gates); state/directives/2026-10-05-product-first-direction.md section 2",
     "rx": r"(claims?|states?|says|asserts?) (a |an |the )?(limit|guarantee|invariant)|\buntrue\b|\bfalse (sentence|claim|statement|tool claim|reading|cite|row)\b|misstates?|not (true|supported) (at|of|by)|over-?claims?|does not (hold|support)|the code (does not|no longer|never) (have|do|does)|under-?claims?|misdescribe|no longer (true|holds)|not what the code does|is false|contradict|describes? (a|the) (behaviour|state|code) .{0,30}(not|never)"},
    {"id": "R37", "name": "a wording block ends in one answer: exact replacement words with a clause check; the human's wording vs a worker's",
     "source": f"{AU}:530-551 (§31); {A}:19; {R}:33",
     "rx": r"clause check (is )?(missing|absent|not shown)|no clause check|without (a|the) clause check|the human'?s wording .{0,60}(changed|reworded|edited|replaced)|reword(ed|s|ing)? .{0,60}the human|wording block|§ ?31 ?\((a|b|c|d)\)|third round|not the human'?s wording .{0,40}(but|yet|though)"},
    {"id": "R38", "name": "every path:line cite resolves (verify:cites); a stale or off-by-N cite fails by name",
     "source": f"{AU}:148-154 (§6a items 1-2); {A}:10 (a stale cite ... a gate failure by name); {W}:25",
     "rx": r"stale (cite|line|cross-reference|link|comment|reference|path|intra-doc)|off-by-(one|N|\d)|\bdangling\b|cites? .{0,40}(does not|no longer|doesn'?t) exist|(moved|shifted|wrong) line|verify[-:]cites|:\d+ (is|was) (now )?:\d+|points? (at|to) the wrong|line (number|cite)s? .{0,30}(stale|wrong|off)|\bre-?pin"},
    {"id": "R39", "name": "a claimed test exists in the tree (verify:test-claims); a claimed-but-missing test fails",
     "source": f"{AU}:155-163 (§6a item 3)",
     "rx": r"claimed test|claims? a test (that|the tree)|test (the tree lacks|does not exist|that does not exist)|verify[-:]test-claims|names? a test (that|which) (does not|no longer)|no test (named|by that name)|test name.{0,30}(stale|wrong|renamed)"},
    {"id": "R40", "name": "red-line text (ADR status/amendments, gate rulings, licensing, security posture) keeps the human's typed words; red lines are the human's",
     "source": f"{A}:17-19; {R}:31-33; {W}:14-15; {AU}:3, :311-313 (§21)",
     "rx": r"red[- ]line|ADR[- ]status|Status line|the human'?s (typed )?words|the human'?s click|licen[cs]e|security posture|ADR-020|ADR-009|ADR-021|exposure surface"},
    {"id": "R41", "name": "the worker's/tester's report states the four failure classes, the model, overrides, handoffs; the report format",
     "source": f"{W}:27-31; {T}:11 (report additions)",
     "rx": r"four failure classes|(worker|tester)'?s report .{0,80}(false|wrong|claims|does not|omits|lacks|misstates|under-?|over-?|names no)|report (lacks|omits|does not state|does not name|does not print)|model (observed|override)|token evidence|hand-?back .{0,40}(lacks|omits|does not)"},
    {"id": "R42", "name": "the closing record, the PR body, the owner's index and KNOWN-LIMITATIONS are current with the diff before the merge",
     "source": f"{AU}:389 (§22: fixed in the same PR, the closing record lists them); .claude/agents/lead-data.md:14-16 (owner's index); {AU}:195 (§9)",
     "rx": r"(PR body|PR title|closing record|owner'?s[- ]index|KNOWN-LIMITATIONS|README|the ledger|PLAN\.yaml|CUT-STATE|summary line|index (line|row|wording)|Last[- ]verified)\b.{0,100}(must carry|does not (carry|list|name|record|mention|say|disclose)|is (stale|not updated|missing|out of date|incomplete)|lacks|omits|under-?records?|not (yet )?(updated|current)|still (says|reads|names|describes|lists)|misstates?|stale|incomplete|wrong|out of date|not in)|(stale|wrong|missing|incomplete) .{0,40}(PR body|closing record|owner'?s[- ]index|README|KNOWN-LIMITATIONS)"},
    {"id": "R43", "name": "§9's suites and CI are run and recorded (exit codes, run ids, the tool's commit); carried-forward verdicts need a semantic applicability check",
     "source": f"{AU}:168-174 (§6a contract), :391 (§22 carry-forward); the forms' §9",
     "rx": r"\bCI\b.{0,40}(never ran|did not run|has not run|not run|is red|failed|not green|skipped|path filter)|suite (log|did not run|not run|never ran)|did not reproduce|\bunobserved\b|not observed|could not (run|be run|be discharged)|no run\b|(no|without|missing|unprinted) exit code|exit code (is |was )?(not|never) (printed|recorded|read)|run id\b.{0,30}(missing|not)|carry(-| )forward|carried forward|applicability check|not re-?run|was not run|were not run|re-?gate"},
    {"id": "R44", "name": "strings the app shows and KNOWN-LIMITATIONS words go on the human's sight list (P6)",
     "source": f"{A}:19; {R}:33 (strings the app shows stay under P6); the forms' §9 Operator lines",
     "rx": r"\bP6\b|sight list|user-visible|operator-facing|the human'?s sight|P6 placeholder|\bsighted\b"},
    {"id": "R45", "name": "the generation tag: a result whose node@g<n> no longer matches is stale",
     "source": f"{AU}:230 (§15)",
     "rx": r"\bgeneration\b.{0,30}(tag|bump|stale|mismatch)|@g\d+"},
    {"id": "R46", "name": "no new dependency without the human (a dependency edge the human has not seen)",
     "source": f"{AU}:3; {A}:10; {R}:29; CLAUDE.md (dependency additions are the human's)",
     "rx": r"new dependency|cargo add|dependency edge|Cargo\.lock|package-lock|lockfile|transitive licen|windows-sys"},
    {"id": "R47", "name": "heavy runs happen inside the shared machine hold; hold lines recorded",
     "source": "the forms' §9 (Heavy runs happen inside the shared hold); state/directives (holds check)",
     "rx": r"MACHINE_HOLD|hold line|shared hold|\bthe hold\b|outside (a|the) hold"},
    {"id": "R48", "name": "comments, docs, messages and record rows describe what the code does at this commit (no stale or untrue description)",
     "source": f"{W}:27 (every user-facing message describes behaviour implemented at this commit); {T}:11 (every operator-facing line describes what was measured at this commit); {AU}:389 (§22)",
     "rx": r"(comment|docs?|documentation|sentence|row|paragraph|header|line|note|README|message|title|heading|label|docstring|summary|rationale|bullet|table|cell|item)s?\b.{0,80}\b(still (says|reads|names|describes|calls|lists|cites|points)|says .{0,100}\b(but|not|instead|no longer|wrong|actually|while)|(is|are|reads as|remains?) (stale|wrong|untrue|out of date|misleading|inaccurate|narrower|broader|too broad|too narrow)|misstat|describes? .{0,60}(not|wrong|no longer)|does not (say|name|mention|match|describe|state|disclose)|leaves? out|omits|under-?(states|records|claims)|over-?(states|claims))"},
    {"id": "R49", "name": "a recorded figure, count or command names the commit it was run at and is reproducible (no moving HEAD, no unnamed commit)",
     "source": f"{A}:10; {R}:25 (round 15 (c)); the forms' §7 counting command 'at a named commit'",
     "rx": r"without the commit (it|that|they) (was|were) run at|at a moving HEAD|moving HEAD|not recorded verbatim|at a named commit|no commit (named|given|recorded)|which commit|names? no commit|without (a|the|its) commit\b|commit (is|was) not (named|recorded|given)"},
]

COMPILED = [(r["id"], re.compile(r["rx"], re.I)) for r in RULES]
RESOLVED = re.compile(r"^\**[A-Z0-9-]+[a-z]?\**?[.:)]?[^.\n]{0,50}\b(resolved|closed|holds?|discharged|cleared|as predicted|is met|: met|now (carries|names|reads|says|holds)|no longer (a )?(finding|blocks)|withdrawn|passes|fixed|done)\b", re.I)


def classify(text: str) -> list[str]:
    return [rid for rid, rx in COMPILED if rx.search(text)]


def is_resolved(text: str) -> bool:
    first = text.split("\n", 1)[0]
    return bool(RESOLVED.search(first))


BY_ID = {r["id"]: r for r in RULES}
=== END ===

=== FILE: scripts/gate-analytics/analytics.py ===
#!/usr/bin/env python3
"""Gate-log analytics for governance piece E's measurement.

Usage:  python3 scripts/gate-analytics/analytics.py [--root <repo>] [--out <dir>] [--last N]

Reads state/gate-log.json, governance/PLAN.yaml, governance/forms/**, state/consults/gates/**
(and the pre-§25 reports under state/consults/), runs git log on each form, and writes:
  <out>/pieces.csv       one row per gated piece (a gate-log node)
  <out>/reports.csv      one row per gate report, joined to its gate-log row
  <out>/findings.csv     one row per finding, with its class and the rule ids it cites
  <out>/rules.csv        one row per rule: findings citing it and the reports
  <out>/REPORT.md        the tables and the data-quality note
Nothing in the repository is written.
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import re
import statistics
import sys
from collections import Counter, OrderedDict, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import git, head_commit, load_gate_log, load_plan, md_table, parse_date, pct, plan_nodes_by_id  # noqa: E402
import gate_log as gl  # noqa: E402
import forms as fm  # noqa: E402
import reports as rp  # noqa: E402
import join  # noqa: E402
import rules as ru  # noqa: E402

SIZE_BUCKETS = [("records-only (0)", 0, 0), ("1-50", 1, 50), ("51-150", 51, 150), ("151-500", 151, 500),
                ("501-1500", 501, 1500), ("over 1500", 1501, 10 ** 9)]


def size_bucket(b: int | None) -> str:
    if b is None:
        return "unknown"
    for name, lo, hi in SIZE_BUCKETS:
        if lo <= b <= hi:
            return name
    return "unknown"


def merge_commits(root: str) -> dict[int, dict]:
    out = git(root, "log", "--merges", "--first-parent", "--format=%H|%ci|%s", "main")
    m: dict[int, dict] = {}
    for ln in out.splitlines():
        h, ci, subj = ln.split("|", 2)
        pm = re.search(r"Merge pull request #(\d+)", subj)
        if pm:
            m.setdefault(int(pm.group(1)), {"hash": h, "date": ci[:10]})
    return m


def median(xs):
    xs = [x for x in xs if x is not None]
    return f"{statistics.median(xs):.1f}" if xs else "n/a"


def mean(xs):
    xs = [x for x in xs if x is not None]
    return f"{statistics.mean(xs):.2f}" if xs else "n/a"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=os.environ.get("SPATIAL_IDE_ROOT", "."))
    ap.add_argument("--out", default="out/gate-analytics")
    ap.add_argument("--last", type=int, default=10, help="the N most recent gated pieces, for piece E's before/after figure")
    ap.add_argument("--no-pre-s25", action="store_true", help="read only state/consults/gates/")
    args = ap.parse_args()
    root = os.path.abspath(args.root)
    os.makedirs(args.out, exist_ok=True)
    commit = head_commit(root)

    rows = load_gate_log(root)
    nodes = gl.per_node(rows)
    plan = load_plan(root)
    plan_nodes = plan_nodes_by_id(plan)
    lanes = {l["id"]: l for l in plan["lanes"]}
    node_map = join.map_nodes_to_plan(nodes, plan_nodes)
    forms = fm.read_forms(root, plan_nodes)
    reports = rp.read_reports(root, include_pre_s25=not args.no_pre_s25)
    attached, unmatched = join.attach_reports(reports, rows, nodes, plan_nodes, node_map)
    merges = merge_commits(root)

    # forms by plan node (one node may share a form with others; a node may have none)
    form_of_node: dict[str, str] = {}
    for rel, f in forms.items():          # PLAN.yaml's `gate` first ...
        for nid in f["plan_nodes"]:
            form_of_node.setdefault(nid, rel)
    for rel, f in forms.items():          # ... then a form that names the node in its text
        for nid in f["named_nodes"]:
            form_of_node.setdefault(nid, rel)

    # ---- per piece --------------------------------------------------------------------
    pieces: "OrderedDict[str, dict]" = OrderedDict()
    for name, n in nodes.items():
        pm = node_map[name]
        pn = plan_nodes.get(pm["plan_id"]) if pm["plan_id"] else None
        lane = pn["lane"] if pn else "unmapped"
        form_rel = form_of_node.get(pm["plan_id"]) if pm["plan_id"] else None
        if form_rel is None and name in form_of_node:
            form_rel = form_of_node[name]
        f = forms.get(form_rel) if form_rel else None
        ev = (pn or {}).get("evidence") or {}
        pr = ev.get("pr") if isinstance(ev, dict) else None
        mc = merges.get(pr) if isinstance(pr, int) else None
        form_first = f["first_commit"]["date"] if f and f["first_commit"] else None
        closing = (f["closing_commit"] or f["last_content_commit"]) if f else None
        closing_date = closing["date"] if closing else None
        closing_kind = ("closing amendment" if f and f["closing_commit"] else ("last content commit" if f and f["last_content_commit"] else None))
        piece = {
            "node": name, "plan_node": pm["plan_id"], "mapped_by": pm["how"], "lane": lane,
            "status": (pn or {}).get("status"), "pr": pr, "pr_merge_date": mc["date"] if mc else None,
            "form": form_rel, "form_shape": (("five-line" if f["five_line"] else "full") if f else None),
            "declared_gates": "+".join(f["declared_gates"]) if f else None,
            "budget": f["budget"] if f else None, "budget_text": f["budget_text"] if f else None,
            "size_bucket": size_bucket(f["budget"] if f else None),
            "amendments": f["amendment_count"] if f else None,
            "correction_amendments": f["correction_amendments"] if f else None,
            "form_commit": form_first, "closing_commit": closing_date, "closing_kind": closing_kind,
            "days_form_to_closing": fm.days_between(form_first, closing_date),
            "days_form_to_pr_merge": fm.days_between(form_first, mc["date"]) if mc else None,
            "first_date": n["first_date"], "last_date": n["last_date"], "month": n["month"],
            "gates_seen": "+".join(n["gates"].keys()),
            "first_pass_reviewer": (n["gates"].get("reviewer") or {}).get("first_pass"),
            "first_pass_architect": (n["gates"].get("architect") or {}).get("first_pass"),
            "first_pass_tester": (n["gates"].get("tester") or {}).get("first_pass"),
            "first_pass_all_gates": n["first_pass_all"], "first_pass_clean": n["first_pass_clean"],
            "correction_rounds": n["correction_rounds"], "gate_entries": n["gate_entries"],
            "record_rounds": n["record_rounds"], "restarts": n["restarts"], "void": n["void"],
            "gate_log_rows": f"{n['rows'][0]}-{n['rows'][-1]}",
            "Correctness": 0, "Evidence": 0, "Documentation": 0, "blocking": 0, "should-fix": 0, "note": 0,
            "reports": 0, "shared_form": (len(f["plan_nodes"]) > 1) if f else False,
        }
        pieces[name] = piece
    # health.mjs's own definition: the earliest entry per node, strict PASS
    first_entry: dict[str, dict] = {}
    for i, r in enumerate(rows):
        k = (r["date"], r["attempt"], i)
        if r["node"] not in first_entry or k < first_entry[r["node"]][0]:
            first_entry[r["node"]] = (k, r)
    for name, (_k, r) in first_entry.items():
        pieces[name]["first_pass_health_mjs"] = r["verdict"] == "PASS"

    # ---- reports and findings ------------------------------------------------------------
    report_rows, finding_rows = [], []
    rule_hits: dict[str, dict] = {rid: {"findings": 0, "reports": set(), "pieces": set(), "by_class": Counter(), "by_role": Counter()} for rid in ru.BY_ID}
    unclassified = Counter()
    for rel, r in reports.items():
        at = attached.get(rel)
        node = at["node"] if at else None
        logrow = rows[at["row"] - 1] if at else None
        if node:
            p = pieces[node]
            p["reports"] += 1
            for k in ("Correctness", "Evidence", "Documentation", "blocking", "should-fix", "note"):
                p[k] += r["counts"].get(k, 0)
        report_rows.append({
            "report": rel, "set": r["set"], "date": r["date"], "role": r["role"], "stage": r["stage"],
            "node": node, "lane": pieces[node]["lane"] if node else None, "gate_log_row": at["row"] if at else None,
            "gate_log_verdict": logrow["verdict"] if logrow else None, "gate_log_attempt": logrow["attempt"] if logrow else None,
            "report_verdict": r["verdict"], "verdict_agrees": (rp.norm_verdict(logrow["verdict"]) == r["verdict"]) if (logrow and r["verdict"]) else None,
            "mapped_by": at["how"] if at else None, "shared_row": at["shared_row"] if at else None,
            "branch": r["branch"], "commit": r["commit"], "pr": r["pr"],
            "uses_three_classes": r["uses_three_classes"], **r["counts"],
        })
        for f in r["findings"]:
            resolved = ru.is_resolved(f["text"])
            ids = [] if resolved else ru.classify(f["text"])
            finding_rows.append({
                "report": rel, "date": r["date"], "role": r["role"], "node": node,
                "lane": pieces[node]["lane"] if node else None, "id": f["id"], "class": f["class"],
                "section": (f["section"] or "")[:60], "line": f["line"], "resolved_status": resolved,
                "rules": " ".join(ids), "text": f["text"][:300].replace("\n", " "),
            })
            if resolved:
                continue
            if not ids:
                unclassified[f["class"]] += 1
            for rid in ids:
                h = rule_hits[rid]
                h["findings"] += 1
                h["reports"].add(rel)
                if node:
                    h["pieces"].add(node)
                h["by_class"][f["class"]] += 1
                h["by_role"][r["role"] or "?"] += 1

    # ---- write CSVs --------------------------------------------------------------------
    def write_csv(path, rows_, fields=None):
        if not rows_:
            return
        fields = fields or list(rows_[0].keys())
        with open(path, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=fields, extrasaction="ignore")
            w.writeheader()
            for x in rows_:
                w.writerow(x)
    write_csv(os.path.join(args.out, "pieces.csv"), list(pieces.values()))
    write_csv(os.path.join(args.out, "reports.csv"), report_rows)
    write_csv(os.path.join(args.out, "findings.csv"), finding_rows)
    rule_rows = [{"rule": rid, "name": ru.BY_ID[rid]["name"], "source": ru.BY_ID[rid]["source"], "findings": h["findings"],
                  "reports": len(h["reports"]), "pieces": len(h["pieces"]),
                  "report_list": " ".join(sorted(h["reports"]))} for rid, h in rule_hits.items()]
    rule_rows.sort(key=lambda x: -x["findings"])
    write_csv(os.path.join(args.out, "rules.csv"), rule_rows)

    # ---- REPORT.md ---------------------------------------------------------------------
    P = list(pieces.values())
    L = []
    L.append(f"# Gate-log analytics for governance piece E's measurement\n")
    L.append(f"Computed at `{commit}` (head of `main` at clone time) by `scripts/gate-analytics/analytics.py`. "
             f"Inputs: `state/gate-log.json` ({len(rows)} entries, {len(nodes)} nodes), `governance/PLAN.yaml` "
             f"({len(plan_nodes)} nodes), `governance/forms/**` ({len(forms)} forms), `state/consults/gates/` "
             f"({sum(1 for r in reports.values() if r['set'] == 'gates')} reports) and the pre-§25 reports under "
             f"`state/consults/` ({sum(1 for r in reports.values() if r['set'] == 'pre-s25')} files named `*-gate<n>-<role>.md`). "
             "All counts are readings of the records as text; nothing here is a judgment, and the maintainers decide what they mean. "
             "A \"gated piece\" is a gate-log node (`state/gate-log.json` keys each entry by `node`, "
             "`scripts/plan/README.md:258-266 @ " + commit[:12] + "`).\n")
    L.append("## 1. Definitions\n")
    L.append("- **First-pass result per gate**: the `verdict` of the entry with `attempt: 1` for that node and gate (reviewer / architect / tester). "
             "When a node's gate shows a second `attempt: 1` later (a re-gated sub-piece), the first decides and the restart is counted.\n"
             "- **Correction rounds**: per gate, the entries with `attempt > 1`; the piece's figure is the maximum over its gates.\n"
             "- **Record rounds**: distinct attempts tagged `record: true`, as `scripts/plan/health.mjs` counts them (`recordRoundCounts`).\n"
             "- **Finding classes**: Correctness / Evidence / Documentation where the report uses `governance/AUTONOMY.md` §22's three verdicts "
             "(from 2026-10-05, `AUTONOMY.md:389`); earlier reports use S1 (blocking) / S2 (should-fix) / N (note) and are kept in those buckets. "
             "A finding whose first line records a status (resolved, closed, holds, discharged) is counted as a status line, not an open finding.\n"
             "- **Days from the form's commit to the merge**: `git log --follow` on the form file; the first commit's date to the date of the commit "
             "that added the amendment whose heading names the closing record or the merge (else the last content commit, flagged). "
             "The PR's merge-commit date on `main` (`Merge pull request #N`) is given beside it where PLAN.yaml names the PR.\n"
             "- **Piece size**: the form's declared line budget (the five-line form's `Scope` line; the full form's §7 total), bucketed.\n"
             "- **Lane**: PLAN.yaml's `lane` of the node; a gate-log node absent from PLAN.yaml is `unmapped`.\n")

    # 2. per piece
    L.append("## 2. Per gated piece\n")
    L.append("Columns: first-pass per gate (R = reviewer, A = architect; PWN = PASS WITH NOTES; `-` = that gate did not run; the one `tester` entry, "
             "row 44 `lod-tier-builder-route-b`, is not shown); CR = correction rounds; RR = record rounds; "
             "C/E/D = Correctness / Evidence / Documentation findings summed over the piece's attached reports; S1/S2/N = pre-§22 blocking / should-fix / note "
             "findings; days = the form's first commit date → the closing-record commit date, in days (`*` = no closing amendment found, the last content "
             "commit on the form stands in), with the form-commit → PR-merge-commit span in brackets. The dates themselves are in `pieces.csv`.\n")
    hdr = ["#", "node (gate-log rows)", "lane", "month", "form", "size", "R", "A", "CR", "RR", "C/E/D", "S1/S2/N", "days (PR)"]
    trs = []
    for i, p in enumerate(P, 1):
        fshort = (os.path.basename(p["form"]).replace("-PREREGISTRATION.md", "") + (" (5L)" if p["form_shape"] == "five-line" else "")) if p["form"] else "—"
        if p["shared_form"]:
            fshort += " (shared)"
        days = p["days_form_to_closing"]
        dstr = ("" if days is None else str(days)) + (f" ({p['days_form_to_pr_merge']})" if p["days_form_to_pr_merge"] is not None else "")
        span = f"{p['form_commit'] or '?'} → {p['closing_commit'] or '?'}" if p["form"] else "—"
        if p["closing_kind"] == "last content commit":
            span += " *"
        trs.append([i, f"`{p['node']}` ({p['gate_log_rows']})", p["lane"], p["month"], fshort,
                    p["budget"] if p["budget"] is not None else "?",
                    (p["first_pass_reviewer"] or "-").replace("PASS WITH NOTES", "PWN"), (p["first_pass_architect"] or "-").replace("PASS WITH NOTES", "PWN"),
                    p["correction_rounds"], p["record_rounds"],
                    f"{p['Correctness']}/{p['Evidence']}/{p['Documentation']}", f"{p['blocking']}/{p['should-fix']}/{p['note']}",
                    (dstr or "?") + (" *" if p["closing_kind"] == "last content commit" else "")])
    L.append(md_table(hdr, trs) + "\n")

    # 3. aggregates
    def agg_table(key, title, order=None):
        groups: dict[str, list[dict]] = defaultdict(list)
        for p in P:
            groups[str(p[key])].append(p)
        keys = order or sorted(groups.keys())
        trs = []
        for k in keys:
            g = groups.get(k, [])
            if not g:
                continue
            n = len(g)
            fp_all = sum(1 for p in g if p["first_pass_all_gates"])
            fp_clean = sum(1 for p in g if p["first_pass_clean"])
            fp_h = sum(1 for p in g if p.get("first_pass_health_mjs"))
            rv = Counter(p["first_pass_reviewer"] for p in g if p["first_pass_reviewer"])
            av = Counter(p["first_pass_architect"] for p in g if p["first_pass_architect"])
            trs.append([k, n, f"{fp_all} ({pct(fp_all, n)})", f"{fp_clean} ({pct(fp_clean, n)})", f"{fp_h} ({pct(fp_h, n)})",
                        f"{rv.get('PASS',0)}/{rv.get('PASS WITH NOTES',0)}/{rv.get('FAIL',0)}",
                        f"{av.get('PASS',0)}/{av.get('PASS WITH NOTES',0)}/{av.get('FAIL',0)}",
                        mean([p["correction_rounds"] for p in g]), sum(p["correction_rounds"] for p in g),
                        f"{sum(p['gate_entries'] for p in g)} ({mean([p['gate_entries'] for p in g])})",
                        sum(p["record_rounds"] for p in g),
                        f"{sum(p['Correctness'] for p in g)}/{sum(p['Evidence'] for p in g)}/{sum(p['Documentation'] for p in g)}",
                        f"{sum(p['blocking'] for p in g)}/{sum(p['should-fix'] for p in g)}/{sum(p['note'] for p in g)}",
                        median([p["days_form_to_closing"] for p in g]), median([p["days_form_to_pr_merge"] for p in g]),
                        sum(1 for p in g if p["days_form_to_closing"] is not None)])
        h = [title, "pieces", "first-pass, all gates PASS or PWN", "first-pass, all gates PASS", "first-pass, health.mjs definition",
             "reviewer first-pass P/PWN/F", "architect first-pass P/PWN/F", "mean CR", "sum CR", "gate entries (mean)", "record rounds",
             "C/E/D", "S1/S2/N", "median days form→closing", "median days form→PR merge", "pieces with days"]
        return md_table(h, trs)

    L.append("## 3. Aggregates\n")
    L.append("PWN = PASS WITH NOTES. `health.mjs definition` = the earliest entry per node is a strict `PASS` (`scripts/plan/health.mjs:161-182`), "
             "the figure the health strip shows; the other two read every gate's attempt 1.\n")
    L.append("### 3a. By month (the month of the piece's first gate entry)\n")
    L.append(agg_table("month", "month") + "\n")
    lane_order = [l["id"] for l in sorted(plan["lanes"], key=lambda l: l["priority"])] + ["unmapped"]
    L.append("### 3b. By lane (`governance/PLAN.yaml` `lanes`, in priority order)\n")
    L.append(agg_table("lane", "lane", lane_order) + "\n")
    L.append("### 3c. By piece size (the form's declared line budget)\n")
    L.append(agg_table("size_bucket", "declared budget", [b[0] for b in SIZE_BUCKETS] + ["unknown"]) + "\n")
    L.append("### 3d. By the form's shape\n")
    L.append(agg_table("form_shape", "form shape", ["five-line", "full", "None"]) + "\n")

    # by role
    L.append("### 3e. By the gate agent's role\n")
    role_rows = []
    for role in ("reviewer", "architect", "tester"):
        ents = [r for r in rows if r["gate"] == role]
        if not ents:
            continue
        first = [r for r in ents if r["attempt"] == 1]
        v1 = Counter(r["verdict"] for r in first)
        vall = Counter(r["verdict"] for r in ents)
        reps = [x for x in report_rows if x["role"] == role]
        cls = Counter()
        for x in reps:
            for k in ("Correctness", "Evidence", "Documentation", "blocking", "should-fix", "note"):
                cls[k] += x.get(k, 0)
        nrep = len(reps) or 1
        top = Counter()
        for rid, h in rule_hits.items():
            top[rid] = h["by_role"].get(role, 0)
        tops = ", ".join(f"{rid} ({c})" for rid, c in top.most_common(5) if c)
        role_rows.append([role, len(ents), len({r['node'] for r in ents}),
                          f"{v1.get('PASS',0)}/{v1.get('PASS WITH NOTES',0)}/{v1.get('FAIL',0)} of {len(first)}",
                          pct(v1.get("PASS", 0) + v1.get("PASS WITH NOTES", 0), len(first)),
                          f"{vall.get('PASS',0)}/{vall.get('PASS WITH NOTES',0)}/{vall.get('FAIL',0)}/{vall.get('VOID',0)}",
                          pct(vall.get("FAIL", 0), len(ents)), len(reps),
                          f"{cls['Correctness']}/{cls['Evidence']}/{cls['Documentation']} ({cls['Correctness']/nrep:.2f}/{cls['Evidence']/nrep:.2f}/{cls['Documentation']/nrep:.2f} per report)",
                          f"{cls['blocking']}/{cls['should-fix']}/{cls['note']}", tops])
    L.append(md_table(["role", "gate entries", "nodes", "attempt-1 verdicts P/PWN/F", "attempt-1 pass rate (P+PWN)", "all attempts P/PWN/F/VOID",
                       "FAIL share, all attempts", "reports read", "C/E/D findings (per report)", "S1/S2/N findings", "rules most cited"], role_rows) + "\n")

    # 3f piece E: last N
    L.append(f"### 3f. The {args.last} most recent gated pieces (piece E's 'ten before E1' baseline)\n")
    L.append("Ordered by the piece's first gate-log entry; the directive's measure is the gate first-pass rate and the gate runs per node "
             "(`state/directives/2026-10-24-governance-piece-e-rules-as-records-readings-e1-repin-fresh-session-practice.md:70-72`). "
             "The script takes `--last N`; the 'after E1' half is computed the same way once E1 has merged.\n")
    lastN = sorted(P, key=lambda p: (p["first_date"], p["gate_log_rows"]))[-args.last:]
    trs = [[p["node"], p["first_date"], p["gates_seen"], p["first_pass_reviewer"] or "-", p["first_pass_architect"] or "-",
            "yes" if p["first_pass_all_gates"] else "no", p["gate_entries"], p["correction_rounds"]] for p in lastN]
    n = len(lastN)
    trs.append(["**total / rate**", "", "", "", "", f"{sum(1 for p in lastN if p['first_pass_all_gates'])}/{n} ({pct(sum(1 for p in lastN if p['first_pass_all_gates']), n)})",
                f"{sum(p['gate_entries'] for p in lastN)} ({mean([p['gate_entries'] for p in lastN])} per node)", sum(p["correction_rounds"] for p in lastN)])
    L.append(md_table(["node", "first gate", "gates", "R first", "A first", "first-pass (all gates)", "gate runs", "CR"], trs) + "\n")

    # 4. rules
    L.append("## 4. Rules most often found broken\n")
    L.append("Each open finding's text was matched against the rule catalogue in `scripts/gate-analytics/rules.py` (regular expressions over the "
             "finding's text; a finding may cite several rules; the catalogue names each rule's source in `.claude/agents/*.md` and "
             "`governance/AUTONOMY.md`). The count is findings, not reports; the report list is in `rules.csv` (every report) and abridged here "
             "(the first 6 by path). Status lines (resolved / closed / holds) are excluded. Source abbreviations: A = `.claude/agents/architect.md`, "
             "R = `.claude/agents/reviewer.md`, W = `.claude/agents/worker.md`, T = `.claude/agents/tester.md`, LD = `.claude/agents/lead-data.md`, "
             "AU = `governance/AUTONOMY.md`; line numbers are at the commit named at the top.\n")
    n_find = len(finding_rows)
    n_res = sum(1 for f in finding_rows if f["resolved_status"])
    n_open = n_find - n_res
    n_unc = sum(unclassified.values())
    L.append(f"Findings read: {n_find}; status lines: {n_res}; open findings: {n_open}; open findings citing no catalogued rule: {n_unc} "
             f"({', '.join(f'{k} {v}' for k, v in unclassified.most_common())}).\n")
    trs = []
    for rr in rule_rows:
        if rr["findings"] == 0:
            continue
        h = rule_hits[rr["rule"]]
        bc = h["by_class"]
        reps_sorted = sorted(h["reports"])
        short = ", ".join("`" + os.path.basename(x) + "`" for x in reps_sorted[:6]) + (f" … (+{len(reps_sorted) - 6}; appendix A / rules.csv)" if len(reps_sorted) > 6 else "")
        src = (rr["source"].replace(".claude/agents/architect.md", "A").replace(".claude/agents/reviewer.md", "R")
               .replace(".claude/agents/worker.md", "W").replace(".claude/agents/tester.md", "T").replace(".claude/agents/lead-data.md", "LD")
               .replace("governance/AUTONOMY.md", "AU"))
        trs.append([rr["rule"], rr["name"], src, rr["findings"], f"{bc.get('Correctness',0)}/{bc.get('Evidence',0)}/{bc.get('Documentation',0)}/{bc.get('blocking',0)}/{bc.get('should-fix',0)}/{bc.get('note',0)}",
                    len(h["reports"]), len(h["pieces"]), f"{h['by_role'].get('reviewer',0)}/{h['by_role'].get('architect',0)}", short])
    L.append(md_table(["rule", "statement (paraphrase)", "source (path:line)", "findings", "C/E/D/S1/S2/N", "reports", "pieces", "reviewer/architect", "gate reports citing it (abridged)"], trs) + "\n")
    # appendix A: the full report list for the four most-cited rules, grouped by piece
    L.append("### Appendix A. The gate reports citing each of the four most-cited rules, grouped by piece\n")
    L.append("Each entry is `piece: report, report, …` with each report named by its file name less the date prefix, `.md`, and the piece's own id when the name starts with it; "
             "`state/consults/…` (pre-§25) files are marked `†`. The complete list for every rule is `rules.csv`.\n")
    for rr in rule_rows[:4]:
        h = rule_hits[rr["rule"]]
        by_piece: dict[str, list[str]] = defaultdict(list)
        for x in sorted(h["reports"]):
            rep = reports[x]
            node = attached[x]["node"] if x in attached else "?"
            tail = os.path.basename(x)[11:-3]
            tail = tail[len(node) + 1:] if tail.startswith(node + "-") else tail
            by_piece[node].append(tail + ("†" if rep["set"] == "pre-s25" else ""))
        parts = [f"`{n}`: {', '.join(v)}" for n, v in sorted(by_piece.items())]
        L.append(f"- **{rr['rule']}** ({rr['findings']} findings, {len(h['reports'])} reports, {len(h['pieces'])} pieces) — " + "; ".join(parts) + "\n")
    zero = [rr["rule"] + " " + rr["name"] for rr in rule_rows if rr["findings"] == 0]
    if zero:
        L.append("Rules in the catalogue with no finding matched: " + "; ".join(zero) + ".\n")

    # 5. data quality
    L.append("## 5. Data quality\n")
    dq = []
    unm = [k for k, v in node_map.items() if not v["plan_id"]]
    dq.append(f"- **Gate-log nodes absent from PLAN.yaml ({len(unm)})**, lane `unmapped`, no form: " + ", ".join(f"`{x}`" for x in unm) + ". "
              "Most are 2026-09-14/15 docs or tooling pieces gated before PLAN nodes were kept for them; `recorder-retired`, `proportional-gates`, "
              "`wording-block-rule`, `adr-034-acceptance-words`, `adr-035-acceptance` are docs PRs whose nodes were never added.")
    via = [f"`{k}` → `{v['plan_id']}`" for k, v in node_map.items() if v["how"] == "evidence.branch"]
    if via:
        dq.append("- **Nodes mapped by `evidence.branch`, not by id**: " + ", ".join(via) + ".")
    noform = [p["node"] for p in P if p["plan_node"] and not p["form"]]
    dq.append(f"- **PLAN nodes with no form found ({len(noform)})** (`gate: none`, or a gate path outside `governance/forms/`): " + ", ".join(f"`{x}`" for x in noform) + ".")
    shared = sorted({p["form"] for p in P if p["shared_form"]})
    dq.append(f"- **Forms shared by more than one node ({len(shared)})** — the form's dates and budget apply to every node that names it: " + ", ".join(f"`{x}`" for x in shared) + ".")
    nob = [p["node"] for p in P if p["form"] and p["budget"] is None]
    dq.append(f"- **Forms with no line-budget reading ({len(nob)} pieces)**, size `unknown`: " + ", ".join(f"`{x}`" for x in nob) + ". "
              "The budget is read by regular expression (`forms.py` `BUDGET_PATTERNS`); `pieces.csv` carries the matched text (`budget_text`) so each reading can be checked.")
    zero_b = [p["node"] for p in P if p["budget"] == 0]
    if zero_b:
        dq.append("- **Budget read as 0** (records-only pieces by their Scope line): " + ", ".join(f"`{x}`" for x in zero_b) + ".")
    nocl = [p["node"] for p in P if p["form"] and p["closing_kind"] == "last content commit"]
    dq.append(f"- **Forms with no amendment heading naming the closing record or the merge ({len(nocl)} pieces)**: the last content commit on the form stands in "
              "(flagged `last content commit` in §2). The 2026-10-29 moves-only commit `a8ae51d9` (governance piece F, 188 renames) is skipped as a rename. "
              "Pieces: " + ", ".join(f"`{x}`" for x in nocl) + ".")
    gap = [(p["node"], p["days_form_to_closing"], p["days_form_to_pr_merge"]) for p in P if p["days_form_to_closing"] is not None and p["days_form_to_pr_merge"] is not None and abs(p["days_form_to_closing"] - p["days_form_to_pr_merge"]) > 3]
    dq.append(f"- **Form-closing date vs PR merge date differ by more than 3 days ({len(gap)} pieces)** — a form that closes after the click, or a shared form, or a node whose PR is one of several: "
              + ", ".join(f"`{n}` ({a} vs {b})" for n, a, b in gap[:25]) + (" …" if len(gap) > 25 else "") + ".")
    nopr = sum(1 for p in P if p["plan_node"] and p["pr"] is None)
    dq.append(f"- **PLAN nodes without a PR in `evidence` ({nopr})**: no PR-merge date; `{{path}}`, `{{commit}}`, `{{branch}}` or empty evidence.")
    dq.append(f"- **Reports not attached to any gate-log entry ({len(unmatched)})**: " + "; ".join(f"`{u['report']}` ({u['reason']})" for u in unmatched) + ".")
    sh = [x for x in report_rows if x["shared_row"]]
    dq.append(f"- **Reports sharing a gate-log row with another report ({len(sh)})** (addenda, confirmations, a second gating of the same attempt, or an ADR-texts gate the log does not key separately): "
              + ", ".join(f"`{os.path.basename(x['report'])}`→row {x['gate_log_row']}" for x in sh) + ".")
    disagree = [x for x in report_rows if x["verdict_agrees"] is False]
    dq.append(f"- **Report verdict line disagrees with the gate-log verdict ({len(disagree)} of {sum(1 for x in report_rows if x['verdict_agrees'] is not None)} compared)**: the gate-log verdict is used throughout; "
              "disagreements are mostly `PASS WITH NOTES` logged as `PASS` (or the reverse), a §22 table whose combined verdict is read from one row, or a scoped re-gate. List: "
              + ", ".join(f"`{os.path.basename(x['report'])}` (report {x['report_verdict']}, log {x['gate_log_verdict']})" for x in disagree[:15]) + (" …" if len(disagree) > 15 else "") + ".")
    nov = [x for x in report_rows if x["report_verdict"] is None]
    dq.append(f"- **Reports with no verdict line the parser reads ({len(nov)})**: " + ", ".join(f"`{os.path.basename(x['report'])}`" for x in nov) + ".")
    norows = [r for r in rows if r["row"] not in {x["gate_log_row"] for x in report_rows if x["gate_log_row"]}]
    dq.append(f"- **Gate-log entries with no report file ({len(norows)})**: {Counter(r['date'][:7] for r in norows).most_common()} — reports before 2026-09-26 were not filed as files "
              "(`AUTONOMY.md` §25 (b) dates the filing rule to round 25, 2026-09-26); their finding classes are unknown and those pieces show 0/0/0.")
    three = sum(1 for x in report_rows if x["uses_three_classes"])
    dq.append(f"- **Reports using §22's three verdict classes: {three} of {len(report_rows)}**; the rest (mostly before 2026-10-05) use S1/S2/N or free headings, kept as `blocking` / `should-fix` / `note`. "
              "Finding items are recognised by their bold id (`**C-1.**`, `**D2:**`, `**S2-1.**`, `**N-3.**`, `**B1.**`, `**F2**`, `**L3**`); prose findings without an id are not counted.")
    vo = [r for r in rows if r["verdict"] == "VOID"]
    dq.append(f"- **Gate-log verdicts outside PASS / PASS WITH NOTES / FAIL**: {len(vo)} `VOID` (" + ", ".join(f"row {r['row']} `{r['node']}`" for r in vo) + "); 1 `tester` gate entry (row "
              + ", ".join(str(r['row']) for r in rows if r['gate'] == 'tester') + ").")
    rest = [p["node"] for p in P if p["restarts"]]
    dq.append(f"- **Nodes whose gate-log attempts restart at 1 ({len(rest)})** (a second sub-piece or PR under the same node; the first sequence decides first-pass): " + ", ".join(f"`{x}`" for x in rest) + ".")
    dq.append("- **Record rounds**: `record: true` was applied retroactively on 2026-09-18 for earlier records (`scripts/plan/README.md:281-286`); the tag is the custodian's hand-set predicate, not a derivation.")
    dq.append("- **Rule classification** is by regular expression over each finding's text (`rules.py`), read against a hand sample; a finding that names a rule it did not break "
              "(e.g. 'the sibling search found nothing') is still counted under that rule, and a Correctness finding on a plain logic defect cites no rule. "
              "The `rules` column of `findings.csv` lets the maintainers re-read any row.")
    dq.append("- **The 'ten before / ten after E1' measure** cannot be completed: E1 has not merged at this commit (PLAN node `governance-e-readings` is the current piece-E node in "
              "`governance/CUSTODIAN-QUEUE.md:31`); §3f gives the 'before' half as the ten most recent pieces.")
    L.extend(dq)
    L.append("")
    with open(os.path.join(args.out, "REPORT.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(L))
    print(f"wrote {args.out}/REPORT.md; pieces {len(P)}, reports {len(report_rows)}, findings {len(finding_rows)}")


if __name__ == "__main__":
    main()
=== END ===

=== FILE: REPORT.md ===
# Gate-log analytics for governance piece E's measurement

Computed at `652752afa9bedb0172948869c9ab7f0b8ee08dd3` (head of `main` at clone time) by `scripts/gate-analytics/analytics.py`. Inputs: `state/gate-log.json` (668 entries, 190 nodes), `governance/PLAN.yaml` (356 nodes), `governance/forms/**` (190 forms), `state/consults/gates/` (435 reports) and the pre-§25 reports under `state/consults/` (34 files named `*-gate<n>-<role>.md`). All counts are readings of the records as text; nothing here is a judgment, and the maintainers decide what they mean. A "gated piece" is a gate-log node (`state/gate-log.json` keys each entry by `node`, `scripts/plan/README.md:258-266 @ 652752afa9be`).

## 1. Definitions

- **First-pass result per gate**: the `verdict` of the entry with `attempt: 1` for that node and gate (reviewer / architect / tester). When a node's gate shows a second `attempt: 1` later (a re-gated sub-piece), the first decides and the restart is counted.
- **Correction rounds**: per gate, the entries with `attempt > 1`; the piece's figure is the maximum over its gates.
- **Record rounds**: distinct attempts tagged `record: true`, as `scripts/plan/health.mjs` counts them (`recordRoundCounts`).
- **Finding classes**: Correctness / Evidence / Documentation where the report uses `governance/AUTONOMY.md` §22's three verdicts (from 2026-10-05, `AUTONOMY.md:389`); earlier reports use S1 (blocking) / S2 (should-fix) / N (note) and are kept in those buckets. A finding whose first line records a status (resolved, closed, holds, discharged) is counted as a status line, not an open finding.
- **Days from the form's commit to the merge**: `git log --follow` on the form file; the first commit's date to the date of the commit that added the amendment whose heading names the closing record or the merge (else the last content commit, flagged). The PR's merge-commit date on `main` (`Merge pull request #N`) is given beside it where PLAN.yaml names the PR.
- **Piece size**: the form's declared line budget (the five-line form's `Scope` line; the full form's §7 total), bucketed.
- **Lane**: PLAN.yaml's `lane` of the node; a gate-log node absent from PLAN.yaml is `unmapped`.

## 2. Per gated piece

Columns: first-pass per gate (R = reviewer, A = architect; PWN = PASS WITH NOTES; `-` = that gate did not run; the one `tester` entry, row 44 `lod-tier-builder-route-b`, is not shown); CR = correction rounds; RR = record rounds; C/E/D = Correctness / Evidence / Documentation findings summed over the piece's attached reports; S1/S2/N = pre-§22 blocking / should-fix / note findings; days = the form's first commit date → the closing-record commit date, in days (`*` = no closing amendment found, the last content commit on the form stands in), with the form-commit → PR-merge-commit span in brackets. The dates themselves are in `pieces.csv`.

| # | node (gate-log rows) | lane | month | form | size | R | A | CR | RR | C/E/D | S1/S2/N | days (PR) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `polish-engine-lease-class` (1-5) | engine | 2026-09 | POLISH-87-88-89 (shared) | ? | FAIL | FAIL | 2 | 0 | 0/0/0 | 0/0/0 | 1 (1) |
| 2 | `release-artifacts-from-ci` (6-6) | release | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 3 | `site-bugs-first` (7-8) | governance | 2026-09 | — | ? | FAIL | - | 1 | 0 | 0/0/0 | 0/0/0 | ? |
| 4 | `hover-confirming-marker` (9-10) | shell | 2026-09 | POLISH-87-88-89 (shared) | ? | PASS | PASS | 0 | 0 | 0/0/0 | 0/0/0 | 1 (1) |
| 5 | `telegram-round-mirror` (11-11) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 6 | `health-drives-metrics` (12-12) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 7 | `autonomy-policy-2026-09-14` (13-14) | unmapped | 2026-09 | — | ? | FAIL | - | 1 | 0 | 0/0/0 | 0/0/0 | ? |
| 8 | `pre-gate-self-checks` (15-15) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 9 | `adr-index-drift` (16-16) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 10 | `adr-index-guard` (17-17) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 11 | `flush-hardening` (18-18) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 12 | `health-strip-honest` (19-19) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 13 | `predicate-admission-fixture-race` (20-20) | unmapped | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 14 | `pan-anchor-95` (21-22) | unmapped | 2026-09 | — | ? | PASS | PASS | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 15 | `briefa-p3-p6` (23-41) | engine | 2026-09 | ADMISSION (shared) | ? | FAIL | FAIL | 4 | 0 | 0/0/0 | 0/0/0 | 8 (7) |
| 16 | `engine-extension-autoload-off` (25-29) | engine | 2026-09 | EXTENSION-AUTOLOAD | ? | PASS | FAIL | 2 | 0 | 0/0/0 | 0/0/0 | 1 (1) * |
| 17 | `self-check-false-readings` (32-33) | governance | 2026-09 | — | ? | PASS | PASS | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 18 | `lod-tier-builder-route-b` (38-69) | engine | 2026-09 | LOD | ? | FAIL | FAIL | 5 | 4 | 0/0/0 | 0/0/0 | 3 (3) * |
| 19 | `briefa-p3b-owner-side-invalidation` (45-65) | engine | 2026-09 | OWNER-INVALIDATION | ? | FAIL | FAIL | 5 | 5 | 0/0/0 | 0/0/0 | 2 (2) |
| 20 | `governance-verify-quotes` (49-79) | governance | 2026-09 | VERIFY-QUOTES (5L) | 150 | FAIL | FAIL | 4 | 3 | 0/0/0 | 0/0/0 | 2 (2) |
| 21 | `governance-record-round-count` (70-74) | governance | 2026-09 | RECORD-ROUND-COUNT (5L) | 135 | FAIL | - | 2 | 1 | 0/0/0 | 0/0/0 | 0 (0) * |
| 22 | `briefa-p6-part-n-acceptances` (75-103) | engine | 2026-09 | ADMISSION (shared) | ? | FAIL | - | 2 | 0 | 0/0/0 | 0/0/0 | 8 |
| 23 | `briefa-p3b-test-names` (77-84) | engine | 2026-09 | P3B-TEST-NAMES (5L) | 30 | FAIL | - | 1 | 1 | 0/0/0 | 0/0/0 | 0 (1) * |
| 24 | `adr-029-g1-feasibility` (80-86) | kernel-protocol | 2026-09 | — | ? | FAIL | - | 1 | 0 | 0/0/0 | 0/0/0 | ? |
| 25 | `governance-test-claims-superseded` (81-176) | governance | 2026-09 | TEST-CLAIMS-SUPERSEDED (5L) | 120 | FAIL | FAIL | 3 | 2 | 0/0/0 | 0/0/0 | 6 (6) * |
| 26 | `briefa-p5-gate-tests` (85-99) | engine | 2026-09 | ADMISSION (shared) | ? | - | FAIL | 1 | 1 | 0/0/0 | 0/0/0 | 8 (9) |
| 27 | `briefa-p4-corpus-run` (89-101) | engine | 2026-09 | ADMISSION (shared) | ? | FAIL | - | 2 | 2 | 0/0/0 | 0/0/0 | 8 (9) |
| 28 | `briefa-p6-describe-fields` (90-98) | engine | 2026-09 | DESCRIBE-FIELDS (5L) | 40 | FAIL | FAIL | 2 | 1 | 0/0/0 | 0/0/0 | 1 (1) * |
| 29 | `governance-audit-npm-trees` (104-104) | governance | 2026-09 | AUDIT-NPM-TREES (5L) | 10 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (1) * |
| 30 | `briefa-p6-n8-reopen-reset` (105-116) | shell | 2026-09 | N8-REOPEN-RESET (5L) | 250 | FAIL | FAIL | 3 | 0 | 0/0/0 | 0/0/0 | 1 (1) * |
| 31 | `adr-013-display-statement` (117-120) | shell | 2026-09 | ADR-013-DISPLAY-STATEMENT (5L) | 80 | FAIL | FAIL | 1 | 2 | 0/0/0 | 0/0/0 | 0 (0) * |
| 32 | `drill-fix-release-only-guard` (121-124) | measurement | 2026-09 | — | ? | FAIL | - | 1 | 1 | 0/0/0 | 0/0/0 | ? |
| 33 | `drill-fix-fixture-watchdog` (122-122) | measurement | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 34 | `drill-fix-viewer-build-order` (123-139) | shell | 2026-09 | — | ? | PASS | - | 2 | 1 | 0/0/0 | 0/0/0 | ? |
| 35 | `governance-verify-gate-file-exists` (125-129) | governance | 2026-09 | — | ? | FAIL | - | 1 | 1 | 0/0/0 | 0/0/0 | ? |
| 36 | `known-limitations-owed-rows` (126-131) | release | 2026-09 | — | ? | FAIL | - | 1 | 1 | 0/0/0 | 0/0/0 | ? |
| 37 | `governance-verify-mutation-multiline-attrs` (127-167) | governance | 2026-09 | VERIFY-MUTATION-MULTILINE-ATTRS (5L) | 60 | FAIL | FAIL | 2 | 1 | 0/0/0 | 0/0/0 | 1 * |
| 38 | `governance-verify-mutation-header-token` (128-136) | governance | 2026-09 | — | ? | FAIL | FAIL | 1 | 0 | 0/0/0 | 0/0/0 | ? |
| 39 | `engine-tests-configured-connections` (130-133) | engine | 2026-09 | — | ? | FAIL | - | 1 | 1 | 0/0/0 | 0/0/0 | ? |
| 40 | `shell-dependency-audit-piece` (132-141) | shell | 2026-09 | — | ? | FAIL | FAIL | 1 | 1 | 0/0/0 | 0/0/0 | ? |
| 41 | `crs-unit-fact-and-bounds` (142-161) | kernel-protocol | 2026-09 | CRS-UNIT-FACT-AND-BOUNDS | ? | FAIL | FAIL | 2 | 1 | 0/0/0 | 0/0/0 | 0 (0) * |
| 42 | `adr-021-023-b1-notes` (146-147) | kernel-protocol | 2026-09 | — | ? | PASS | PASS | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 43 | `engine-source-change-watcher` (148-213) | engine | 2026-09 | SOURCE-WATCHER | 4830 | PASS | FAIL | 6 | 1 | 0/2/0 | 12/0/10 | 1 (1) |
| 44 | `fixture-regeneration-entry-point` (156-163) | measurement | 2026-09 | — | ? | FAIL | FAIL | 1 | 1 | 0/0/0 | 0/0/0 | ? |
| 45 | `kernel-ticket-drop-under-registry-lock` (170-178) | kernel-protocol | 2026-09 | TICKET-DROP-UNDER-LOCK (5L) | 250 | FAIL | PASS | 2 | 3 | 0/0/0 | 0/0/0 | 0 (0) * |
| 46 | `governance-test-claims-withdrawn-marker` (184-188) | governance | 2026-09 | TEST-CLAIMS-WITHDRAWN | 280 | FAIL | FAIL | 2 | 2 | 0/0/0 | 0/0/0 | 0 (0) * |
| 47 | `adr-035-acceptance` (189-191) | unmapped | 2026-09 | — | ? | PASS | PASS | 1 | 0 | 0/0/0 | 0/0/0 | ? |
| 48 | `governance-hooks-cloud-inert` (192-194) | governance | 2026-09 | HOOKS-CLOUD-INERT (5L) | 150 | FAIL | - | 2 | 1 | 0/0/0 | 0/0/0 | 0 (0) * |
| 49 | `adr-035-decision-4-note` (195-197) | kernel-protocol | 2026-09 | — | ? | PASS | PASS | 1 | 0 | 0/0/0 | 0/0/0 | ? |
| 50 | `governance-test-claims-superseded-followups` (198-205) | governance | 2026-09 | TEST-CLAIMS-FOLLOWUPS | 720 | FAIL | FAIL | 2 | 1 | 0/0/0 | 6/0/3 | 0 (0) |
| 51 | `data-plane-origin-non-ascii` (206-209) | kernel-protocol | 2026-09 | ORIGIN-NON-ASCII | 200 | PASS | FAIL | 1 | 1 | 0/0/0 | 1/0/10 | 0 (0) |
| 52 | `bundle-viewer-partition-offset-bounds` (214-217) | publish-viewer | 2026-09 | PARTITION-OFFSET-BOUNDS | ? | FAIL | FAIL | 1 | 1 | 0/0/0 | 0/0/7 | 0 (1) |
| 53 | `governance-weekly-proposals-2026-09-26` (218-234) | governance | 2026-09 | GOVERNANCE-WEEKLY-PROPOSALS-2026-09-26 | 80 | PASS | PASS | 2 | 2 | 0/1/0 | 0/0/10 | 1 (1) |
| 54 | `data-plane-stream-registry-bound` (220-223) | kernel-protocol | 2026-09 | STREAM-REGISTRY-BOUND | 450 | FAIL | FAIL | 1 | 1 | 0/0/0 | 3/0/9 | 0 (1) |
| 55 | `governance-stop-hook-lease` (224-229) | governance | 2026-09 | STOP-HOOK-LEASE (5L) | 150 | FAIL | FAIL | 2 | 2 | 3/1/6 | 0/0/0 | 0 (1) * |
| 56 | `corpus-reproducibility-record` (230-235) | engine | 2026-09 | CORPUS-REPRODUCIBILITY | ? | FAIL | FAIL | 1 | 1 | 7/2/0 | 0/0/0 | 32 (1) * |
| 57 | `b1-engine-kernel-half` (236-247) | kernel-protocol | 2026-09 | B1-PROJECTION (shared) | ? | FAIL | FAIL | 2 | 0 | 9/12/13 | 10/0/0 | 2 (2) |
| 58 | `exposure-profile-paths` (238-249) | governance | 2026-09 | EXPOSURE-PROFILE-PATHS | 720 | FAIL | FAIL | 4 | 3 | 10/15/37 | 0/0/3 | 1 (0) * |
| 59 | `geometry-types-beyond-polygons` (250-426) | engine | 2026-09 | MULTIPOLYGON-MP1 | 4500 | FAIL | FAIL | 3 | 0 | 0/0/10 | 8/0/12 | 1 (1) |
| 60 | `kernel-generation-close-races` (258-263) | kernel-protocol | 2026-09 | GENERATION-CLOSE-RACES | 600 | FAIL | FAIL | 2 | 2 | 0/1/2 | 0/0/8 | 0 (1) |
| 61 | `test-claims-landedness-bound` (264-265) | governance | 2026-09 | — | ? | FAIL | - | 1 | 0 | 0/0/0 | 6/0/1 | ? |
| 62 | `wave2-b-admission-campaign-merge` (266-266) | engine | 2026-09 | — | ? | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 63 | `watcher-first-read-on-watch-thread` (267-270) | engine | 2026-09 | WATCHER-FIRST-READ (5L) | 150 | PASS | FAIL | 1 | 0 | 3/0/0 | 1/0/15 | 0 (1) * |
| 64 | `suites-and-toolchain-beyond-windows` (271-271) | platform | 2026-09 | SUITES-BEYOND-WINDOWS (5L) | 60 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (0) * |
| 65 | `b1-close-nul-column-names` (272-282) | engine | 2026-09 | B1-PROJECTION (shared) | ? | PASS | PASS | 5 | 0 | 2/0/0 | 36/0/6 | 2 (4) |
| 66 | `filter-bind-admission-implicit-coercions` (283-290) | engine | 2026-09 | FILTER-BIND-COERCIONS | ? | PASS | PASS | 3 | 0 | 0/0/0 | 17/0/3 | 1 (1) |
| 67 | `engine-cancel-before-stream-window` (291-294) | engine | 2026-09 | CANCEL-BEFORE-EXECUTE | 400 | FAIL | FAIL | 1 | 0 | 0/0/0 | 6/0/23 | 0 (0) |
| 68 | `kernel-ticket-liveness-redeem-wording` (295-296) | kernel-protocol | 2026-09 | TICKET-LIVENESS-REDEEM | 300 | PASS | PASS | 0 | 0 | 0/0/0 | 0/0/10 | 0 (0) |
| 69 | `publish-refusal-codes-and-attempt-lifecycle` (297-302) | publish-viewer | 2026-09 | RAW-PATH-CREATE-REFUSAL-CODE | 60 | PASS | PASS | 1 | 0 | 0/0/0 | 0/0/12 | 0 (0) |
| 70 | `kernel-close-dataset-unknown-keeps-openrecord` (303-308) | kernel-protocol | 2026-09 | CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD | 150 | PASS | FAIL | 2 | 0 | 0/0/0 | 3/0/13 | 1 (1) |
| 71 | `catalog-open-replace-drop-latency-note` (309-312) | kernel-protocol | 2026-10 | CATALOG-OPEN-REPLACE-DROP-NOTE | 120 | PASS | FAIL | 1 | 0 | 0/0/0 | 2/0/15 | 0 (0) |
| 72 | `audit-reader-char-boundary` (313-316) | publish-viewer | 2026-10 | AUDIT-READER-CHAR-BOUNDARY | 175 | FAIL | FAIL | 1 | 0 | 0/0/0 | 2/0/9 | 1 (1) |
| 73 | `exposure-scan-ci-backstop` (317-323) | governance | 2026-10 | EXPOSURE-SCAN-CI-BACKSTOP | 800 | PASS | PASS | 3 | 2 | 0/0/0 | 1/2/16 | 0 (0) |
| 74 | `round-mirror-pretooluse-hook` (324-336) | governance | 2026-10 | ROUND-MIRROR-PRETOOLUSE-HOOK | 700 | FAIL | PASS | 2 | 0 | 0/0/0 | 1/4/17 | 0 (0) |
| 75 | `test-claims-same-pr-superseded-pin` (328-334) | governance | 2026-10 | TEST-CLAIMS-SAME-PR-SUPERSEDED-PIN | 650 | FAIL | FAIL | 1 | 0 | 0/0/0 | 3/6/19 | 0 (0) |
| 76 | `workspace-rustfmt` (330-339) | governance | 2026-10 | WORKSPACE-RUSTFMT | 120 | FAIL | PASS | 2 | 0 | 1/1/0 | 4/5/22 | 0 (0) |
| 77 | `publish-panel-rs-regex-layout` (332-335) | governance | 2026-10 | PUBLISH-PANEL-RS-REGEX-LAYOUT (5L) | 20 | PASS | - | 1 | 0 | 0/0/0 | 0/2/8 | 0 (0) * |
| 78 | `questions-mirror-t11-copy-glob` (340-340) | governance | 2026-10 | QUESTIONS-MIRROR-T11-COPY-GLOB (5L) | 10 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (0) * |
| 79 | `skp-cancel-state-closed-set` (341-344) | kernel-protocol | 2026-10 | CANCEL-STATE-CLOSED-SET | 300 | PASS | PASS | 1 | 0 | 0/0/0 | 0/9/15 | 1 (1) |
| 80 | `stop-hook-stale-continuity` (345-348) | governance | 2026-10 | STOP-HOOK-STALE-CONTINUITY | 650 | PASS | PASS | 1 | 0 | 0/0/0 | 0/8/24 | 1 (1) |
| 81 | `port-1-linux-l1` (349-354) | platform | 2026-10 | PORT-1-LINUX-L1 | 750 | PASS | PASS | 1 | 0 | 0/6/0 | 0/3/0 | 1 (1) |
| 82 | `publish-attempt-lifecycle-src-tauri` (351-360) | publish-viewer | 2026-10 | PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI | 700 | FAIL | FAIL | 3 | 0 | 0/0/0 | 1/6/3 | 0 (0) |
| 83 | `lead-data-pilot-setup` (361-366) | governance | 2026-10 | LEAD-DATA-PILOT-SETUP (5L) | 400 | PASS | FAIL | 2 | 0 | 12/0/0 | 1/1/0 | 0 (0) * |
| 84 | `subagent-write-audit-script` (367-373) | governance | 2026-10 | SUBAGENT-WRITE-AUDIT (5L) | 250 | FAIL | - | 3 | 0 | 5/0/3 | 3/1/0 | 0 (0) * |
| 85 | `kernel-ticket-drop-followups` (372-376) | kernel-protocol | 2026-10 | TICKET-DROP-FOLLOWUPS | 320 | FAIL | PASS | 1 | 0 | 2/0/0 | 2/9/15 | 0 (0) |
| 86 | `guardian-v0` (377-383) | governance | 2026-10 | GUARDIAN-V0 | 1650 | FAIL | PASS | 2 | 0 | 0/0/0 | 3/11/20 | 1 (1) |
| 87 | `type-walk-null-literal-arithmetic` (379-387) | engine | 2026-10 | TYPE-WALK-NULL-LITERAL-ARITHMETIC | ? | FAIL | PASS | 2 | 0 | 1/0/0 | 2/2/21 | 1 |
| 88 | `claude-md-stale-facts` (388-389) | governance | 2026-10 | CLAUDE-MD-STALE-FACTS (5L) | 12 | PASS | - | 1 | 0 | 0/0/0 | 0/2/4 | 0 * |
| 89 | `evidence-recorder-v0` (390-395) | governance | 2026-10 | EVIDENCE-RECORDER-V0 | 1400 | FAIL | FAIL | 2 | 2 | 1/13/0 | 6/4/15 | 0 (0) |
| 90 | `watch-grandparent-spawn-signal` (396-397) | kernel-protocol | 2026-10 | WATCH-GRANDPARENT-SPAWN-SIGNAL | 160 | PASS | PASS | 0 | 0 | 0/0/0 | 0/1/3 | 0 (0) |
| 91 | `timing-tests-assert-property-not-budget` (398-399) | kernel-protocol | 2026-10 | TIMING-TESTS-PROPERTY-NOT-BUDGET | 0 | PASS | PASS | 0 | 0 | 0/0/0 | 0/1/5 | 0 (0) |
| 92 | `timing-assertions-under-contention` (400-401) | engine | 2026-10 | TIMING-ASSERTIONS-UNDER-CONTENTION | 40 | PASS | PASS | 0 | 0 | 0/0/0 | 0/4/10 | 0 (0) |
| 93 | `data-plane-terminal-without-credit` (402-409) | kernel-protocol | 2026-10 | TERMINAL-WITHOUT-CREDIT | ? | FAIL | FAIL | 2 | 0 | 0/0/3 | 3/9/15 | 0 (0) |
| 94 | `evidence-recorder-v0-1` (404-411) | governance | 2026-10 | EVIDENCE-RECORDER-V0-1 | 1000 | FAIL | PASS | 1 | 0 | 0/0/4 | 1/4/17 | 0 (0) |
| 95 | `b1-engine-kernel-half-followups` (412-415) | engine | 2026-10 | B1-FOLLOWUPS | ? | PASS | FAIL | 1 | 0 | 0/0/0 | 2/0/14 | 0 (0) |
| 96 | `adr-034-acceptance-words` (416-418) | unmapped | 2026-10 | — | ? | PASS | PASS | 0 | 0 | 0/0/2 | 0/0/0 | ? |
| 97 | `proportional-gates` (417-419) | unmapped | 2026-10 | — | ? | PASS | PASS | 0 | 0 | 0/0/3 | 0/0/0 | ? |
| 98 | `compaction-record-and-resume-line` (420-421) | governance | 2026-10 | COMPACTION-RECORD-AND-RESUME-LINE | 450 | PASS | PASS | 0 | 0 | 1/0/7 | 0/0/0 | 1 (1) |
| 99 | `guardian-n1-before-auto-compaction` (423-424) | governance | 2026-10 | GUARDIAN-N1-BEFORE-AUTO-COMPACTION | 350 | PASS | PASS | 0 | 0 | 0/0/8 | 1/0/0 | 0 (0) |
| 100 | `mods-readme-local-scope` (425-425) | governance | 2026-10 | MODS-README-LOCAL-SCOPE (5L) | 24 | PASS | - | 0 | 0 | 0/0/1 | 0/0/0 | 0 (0) * |
| 101 | `geometry-points-cut` (427-428) | engine | 2026-10 | GEOMETRY-POINTS | 3220 | PASS | PASS | 0 | 0 | 0/0/11 | 0/0/0 | 1 (1) |
| 102 | `kernel-close-races-followups` (429-430) | kernel-protocol | 2026-10 | GENERATION-CLOSE-RACES-FOLLOWUPS | 113 | PASS | PASS | 0 | 0 | 4/0/5 | 0/0/0 | 2 (2) |
| 103 | `typed-terminal-codes-post-check-race` (431-432) | kernel-protocol | 2026-10 | TYPED-TERMINAL-CODES-POST-CHECK-RACE | 80 | PASS | PASS | 0 | 0 | 0/3/2 | 0/0/2 | 0 (0) |
| 104 | `geometry-lines-cut` (433-434) | engine | 2026-10 | GEOMETRY-LINES | 2721 | PASS | PASS | 0 | 0 | 0/0/8 | 0/0/0 | 1 (1) |
| 105 | `data-plane-crowded-start-detail-spaces` (435-436) | kernel-protocol | 2026-10 | CROWDED-START-DETAIL-SPACES | 47 | PASS | PASS | 0 | 0 | 1/0/9 | 0/0/0 | 1 (1) |
| 106 | `b2-piece-1a-step-record-and-dataset-reference` (437-440) | kernel-protocol | 2026-10 | B2-1A-STEP-RECORD-AND-DATASET-REFERENCE | 60 | FAIL | FAIL | 1 | 0 | 4/0/12 | 0/0/0 | 0 (0) |
| 107 | `verify-cites-pinned-citations` (441-442) | governance | 2026-10 | VERIFY-CITES-PINNED-CITATIONS (5L) | 150 | FAIL | - | 1 | 0 | 3/0/5 | 0/0/0 | 0 (0) |
| 108 | `reuse-round-1-bundle` (443-443) | governance | 2026-10 | REUSE-ROUND-1-BUNDLE (5L) | 1 | FAIL | - | 0 | 0 | 0/1/1 | 0/0/0 | 0 |
| 109 | `adr-032-staleness-docs` (444-444) | governance | 2026-10 | ADR-032-STALENESS-DOCS (5L) | 12 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (0) |
| 110 | `docs-08-public-data-sentence` (445-445) | governance | 2026-10 | DOCS-08-PUBLIC-DATA-SENTENCE (5L) | 2 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (0) |
| 111 | `shell-migration-milestone-1` (446-449) | shell | 2026-10 | SHELL-MIGRATION-MILESTONE-1 | 3250 | FAIL | FAIL | 1 | 0 | 6/8/48 | 0/0/0 | 2 (2) |
| 112 | `e2e-hover-establishing-read-stale` (450-454) | shell | 2026-10 | E2E-HOVER-ESTABLISHING-READ | 140 | PASS | FAIL | 1 | 0 | 0/1/5 | 0/0/0 | 0 (0) * |
| 113 | `covering-names-missing-column` (452-455) | engine | 2026-10 | COVERING-NAMES-MISSING-COLUMN | 520 | PASS | FAIL | 1 | 0 | 0/2/8 | 0/0/0 | 0 (0) |
| 114 | `skp-drained-stream-helper-post-check-race` (456-457) | kernel-protocol | 2026-10 | SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE | 110 | PASS | PASS | 0 | 0 | 0/2/10 | 2/0/0 | 0 * |
| 115 | `wire-bytes-invariant-trace-flag-race` (458-459) | kernel-protocol | 2026-10 | WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE | 40 | PASS | PASS | 0 | 0 | 0/0/5 | 0/0/0 | 0 (1) * |
| 116 | `known-limitations-item-8-filter-not-published` (460-460) | release | 2026-10 | KNOWN-LIMITATIONS-ITEM-8 (5L) | 60 | PASS | - | 0 | 0 | 0/0/4 | 0/0/0 | 0 (0) * |
| 117 | `stream-flush-cancel-exit-marks-producer-cancelled` (461-462) | engine | 2026-10 | STREAM-FLUSH-CANCEL-EXIT | 150 | PASS | PASS | 0 | 0 | 2/1/5 | 0/0/0 | 0 (0) * |
| 118 | `filter-identity-alias-ambiguous-reached-through-skp` (463-464) | kernel-protocol | 2026-10 | FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP | 150 | PASS | PASS | 0 | 0 | 1/0/6 | 0/0/0 | 0 (1) * |
| 119 | `shell-stale-frame-comments` (465-467) | shell | 2026-10 | SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS (5L) (shared) | 140 | FAIL | PASS | 1 | 0 | 0/1/18 | 0/0/0 | 0 (1) * |
| 120 | `e2e-stale-expectations-reaim` (468-470) | shell | 2026-10 | E2E-STALE-EXPECTATIONS-REAIM | ? | FAIL | PASS | 1 | 0 | 0/3/10 | 0/0/0 | 2 (2) |
| 121 | `known-limitations-item-2-on-main-paragraph` (471-482) | release | 2026-10 | KNOWN-LIMITATIONS-ITEM-2-ON-MAIN (5L) | 30 | FAIL | - | 2 | 0 | 2/1/4 | 0/0/0 | 1 (1) * |
| 122 | `crs-undeclared-message-wording` (472-474) | engine | 2026-10 | CRS-UNDECLARED-MESSAGE-WORDING | 65 | PASS | FAIL | 1 | 0 | 0/2/3 | 0/0/0 | 1 (1) * |
| 123 | `shell-map-refill-after-resize` (475-487) | shell | 2026-10 | SHELL-MAP-REFILL-AFTER-RESIZE | 600 | FAIL | FAIL | 3 | 0 | 4/5/21 | 0/0/0 | 2 (2) * |
| 124 | `ported-code-notice-route` (483-486) | governance | 2026-10 | PORTED-CODE-NOTICE-ROUTE | 1400 | FAIL | FAIL | 1 | 0 | 8/0/9 | 0/0/4 | 2 (2) * |
| 125 | `module-docs-stale-statements` (488-491) | kernel-protocol | 2026-10 | MODULE-DOCS-STALE-STATEMENTS | 400 | FAIL | FAIL | 1 | 0 | 2/8/13 | 0/0/0 | 0 (0) * |
| 126 | `skp-v0-live-sections-current-area-c` (492-495) | kernel-protocol | 2026-10 | SKP-V0-LIVE-SECTIONS-AREA-C | 180 | PASS | PASS | 2 | 0 | 2/0/12 | 1/0/0 | 0 (0) * |
| 127 | `wording-block-rule` (496-497) | unmapped | 2026-10 | — | ? | PASS | PASS | 0 | 0 | 0/0/12 | 0/0/0 | ? |
| 128 | `shell-migration-milestone-2` (498-514) | shell | 2026-10 | SHELL-MIGRATION-MILESTONE-2 | 6644 | PASS | PASS | 3 | 0 | 6/7/52 | 0/0/10 | 5 (5) |
| 129 | `recorder-retired` (499-499) | unmapped | 2026-10 | — | ? | PASS | - | 0 | 0 | 0/0/1 | 0/0/0 | ? |
| 130 | `shell-crs-form-for-format-default-contradicted` (501-503) | shell | 2026-10 | SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED | 225 | FAIL | PASS | 1 | 0 | 0/1/8 | 0/0/0 | 1 (1) * |
| 131 | `guardian-v1` (504-506) | governance | 2026-10 | GUARDIAN-V1 | 1300 | PASS | FAIL | 0 | 0 | 3/1/6 | 0/0/0 | 9 (9) |
| 132 | `known-limitations-current-view-stale-box` (505-505) | release | 2026-10 | KNOWN-LIMITATIONS-ITEM-42-CURRENT-VIEW (5L) | 20 | FAIL | - | 0 | 0 | 8/0/2 | 0/0/0 | 2 (2) |
| 133 | `stale-test-names-and-comments` (515-518) | shell | 2026-10 | STALE-TEST-NAMES-AND-COMMENTS | 140 | PWN | FAIL | 0 | 0 | 10/9/9 | 0/0/0 | 3 (3) |
| 134 | `shell-status-bar-one-height` (516-519) | shell | 2026-10 | SHELL-STATUS-BAR-ONE-HEIGHT | 562 | PWN | PWN | 0 | 0 | 0/0/8 | 0/0/0 | 1 (1) |
| 135 | `export-current-view-after-unreported-fit` (517-520) | shell | 2026-10 | EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT | 670 | PWN | PWN | 0 | 0 | 0/0/12 | 0/0/0 | 2 (2) |
| 136 | `known-limitations-item-40-source-comment` (521-521) | release | 2026-10 | KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT (5L) | 2 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (0) |
| 137 | `b2-piece-1b-recording` (522-527) | kernel-protocol | 2026-10 | B2-1B-RECORDING | 220 | FAIL | FAIL | 2 | 0 | 13/2/45 | 0/0/24 | 4 (4) |
| 138 | `known-limitations-crs-epoch-edges-third-axis` (528-528) | release | 2026-10 | KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS (5L) | 20 | PWN | - | 0 | 0 | 9/0/2 | 0/0/0 | 3 (3) |
| 139 | `engine-clause-composition-properties` (529-530) | engine | 2026-10 | CLAUSE-COMPOSITION-PROPERTIES (5L) | 180 | PWN | PWN | 0 | 0 | 0/0/10 | 0/0/0 | 3 (3) |
| 140 | `e2e-readme-status-bar-steps` (531-531) | shell | 2026-10 | E2E-README-STATUS-BAR-STEPS (5L) | 2 | PWN | - | 0 | 0 | 0/0/0 | 0/0/0 | 3 (3) |
| 141 | `governance-search-ignore-historical` (532-533) | governance | 2026-10 | SEARCH-IGNORE-HISTORICAL | 380 | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/2 | 3 (3) |
| 142 | `source-changed-post-route-s5d-race` (534-564) | shell | 2026-10 | SOURCE-CHANGED-S5D-INCONCLUSIVE | 287 | PWN | PWN | 2 | 0 | 1/0/12 | 0/0/0 | 1 (1) |
| 143 | `known-limitations-item-41-source-comment` (535-535) | release | 2026-10 | KNOWN-LIMITATIONS-ITEM-41-SOURCE-COMMENT (5L) | 2 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (0) |
| 144 | `publish-approval-unknown-attempt-under-load` (536-537) | shell | 2026-10 | PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1 (5L) | 150 | PWN | PWN | 0 | 0 | 0/1/4 | 0/0/2 | 1 |
| 145 | `governance-cut-state-cap-and-rotation` (538-546) | governance | 2026-10 | CUT-STATE-CAP-AND-ROTATION | 960 | FAIL | FAIL | 3 | 0 | 5/4/14 | 0/0/4 | 5 (5) |
| 146 | `known-limitations-item-23-watcher-idle-end` (545-545) | release | 2026-10 | KNOWN-LIMITATIONS-ITEM-23-WATCHER-IDLE-END (5L) | 40 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 3 (3) |
| 147 | `source-changed-post-reopen-routes-watcher-visible` (547-548) | shell | 2026-10 | SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE | ? | PWN | PWN | 0 | 0 | 0/0/8 | 0/0/3 | 3 (3) |
| 148 | `shell-migration-milestone-3` (549-561) | shell | 2026-10 | SHELL-MIGRATION-MILESTONE-3 | 5577 | FAIL | FAIL | 3 | 0 | 9/7/43 | 0/0/0 | 9 (9) |
| 149 | `governance-decisions-pending-open-and-archive` (556-559) | governance | 2026-10 | DECISIONS-PENDING-OPEN-AND-ARCHIVE | 1260 | FAIL | PWN | 1 | 0 | 0/3/9 | 0/0/2 | 6 (6) |
| 150 | `publish-approval-ttl-ten-minutes` (563-565) | shell | 2026-10 | PUBLISH-APPROVAL-TTL-TEN-MINUTES (5L) | 120 | FAIL | FAIL | 0 | 0 | 2/0/4 | 0/0/0 | 1 (1) |
| 151 | `connection-reuse-recycled-interrupt-flake` (566-569) | engine | 2026-10 | CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL | 100 | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/0 | 4 (4) |
| 152 | `governance-plan-summaries-archive` (567-575) | governance | 2026-10 | PLAN-SUMMARIES-ARCHIVE | 800 | FAIL | FAIL | 3 | 0 | 8/0/9 | 0/0/0 | 1 (1) |
| 153 | `walkthrough-current-view-rows-g1-n5` (572-573) | shell | 2026-10 | WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5 | 4 | PASS | PASS | 0 | 0 | 0/1/0 | 0/0/0 | 0 (0) |
| 154 | `adr-036-pre-acceptance-block` (576-580) | kernel-protocol | 2026-10 | ADR-036-PRE-ACCEPTANCE-BLOCK | ? | PWN | FAIL | 2 | 0 | 2/0/7 | 0/0/0 | 0 (0) |
| 155 | `bundle-redaction-scan-not-in-product-publish` (581-603) | kernel-protocol | 2026-10 | BUNDLE-REDACTION-SCAN | 432 | FAIL | FAIL | 2 | 0 | 9/4/7 | 0/0/0 | 2 (5) |
| 156 | `verify-quotes-round-item-cites` (585-590) | governance | 2026-10 | VERIFY-QUOTES-ROUND-ITEM-CITES | 550 | FAIL | FAIL | 1 | 0 | 1/3/14 | 0/0/4 | 2 (2) * |
| 157 | `stale-assertion-messages-and-product-comments` (587-588) | shell | 2026-10 | STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS | 27 | FAIL | PWN | 0 | 0 | 0/7/3 | 0/0/0 | 0 (1) * |
| 158 | `walkthrough-row-f7-cli-refusal` (591-594) | shell | 2026-10 | WALKTHROUGH-ROW-F7-CLI-REFUSAL | 14 | PWN | PWN | 1 | 0 | 2/4/8 | 0/0/0 | 1 (4) * |
| 159 | `questions-mirror-item-count` (595-596) | governance | 2026-10 | QUESTIONS-MIRROR-ITEM-COUNT | 30 | FAIL | FAIL | 0 | 0 | 4/0/3 | 0/0/0 | 0 (0) * |
| 160 | `b1-shell-half` (597-620) | shell | 2026-10 | SHELL-MIGRATION-MILESTONE-4 | 11094 | PWN | PWN | 1 | 0 | 5/5/37 | 0/0/0 | 2 |
| 161 | `verify-cites-pin-resolution-and-line-zero` (599-600) | governance | 2026-10 | VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO | 60 | FAIL | FAIL | 0 | 0 | 4/0/4 | 0/0/0 | 0 (0) * |
| 162 | `flush-crlf-field-rewrite` (601-605) | governance | 2026-10 | FLUSH-CRLF-FIELD-REWRITE | 8 | FAIL | FAIL | 1 | 0 | 2/1/2 | 0/0/0 | 0 (1) * |
| 163 | `known-limitations-items-51-52-render-numbers` (606-606) | release | 2026-10 | — | ? | PWN | - | 0 | 0 | 0/0/0 | 0/0/0 | ? |
| 164 | `publish-sort-window-cancel-not-exercised-on-ci` (607-608) | kernel-protocol | 2026-10 | PUBLISH-SORT-WINDOW-CANCEL-NOT-EXERCISED-ON-CI (5L) | 80 | PWN | PWN | 0 | 0 | 1/1/3 | 0/0/0 | 0 (0) |
| 165 | `guardian-parity-git-timeout-under-load` (609-611) | governance | 2026-10 | GUARDIAN-PARITY-GIT-TIMEOUT-UNDER-LOAD | 130 | PWN | FAIL | 1 | 0 | 0/1/2 | 0/0/0 | 1 (2) |
| 166 | `autonomy-section-36-filler-slot` (612-612) | release | 2026-10 | — | ? | PWN | - | 0 | 0 | 0/0/2 | 0/0/0 | ? |
| 167 | `covering-case-collision-binds-other-column` (613-614) | engine | 2026-10 | COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL | 1015 | PWN | PWN | 0 | 0 | 0/0/5 | 0/0/0 | 0 (3) * |
| 168 | `stream-evaluation-failure-fixed-detail` (615-622) | engine | 2026-10 | STREAM-EVALUATION-FAILURE-FIXED-DETAIL (5L) | 150 | FAIL | FAIL | 1 | 0 | 4/2/5 | 0/0/0 | 1 (1) |
| 169 | `governance-hash-grammar-shared` (623-623) | governance | 2026-10 | HASH-GRAMMAR-SHARED (5L) | 140 | PWN | - | 0 | 0 | 0/0/2 | 0/0/0 | 0 (0) |
| 170 | `verify-cites-out-of-range-line-count` (624-624) | governance | 2026-10 | VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT (5L) | 100 | FAIL | - | 0 | 0 | 1/0/3 | 0/0/0 | 0 (1) |
| 171 | `kernel-close-during-open-admission` (625-626) | kernel-protocol | 2026-10 | KERNEL-CLOSE-DURING-OPEN-ADMISSION (5L) | 140 | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/3 | 0 (1) |
| 172 | `session-generation-t1-t3-reobservation` (627-628) | kernel-protocol | 2026-10 | SESSION-GENERATION-T1-T3-REOBSERVATION (5L) | 60 | PWN | PWN | 0 | 0 | 0/0/5 | 0/0/0 | 0 (1) |
| 173 | `slice-traced-test-cross-stamping` (629-630) | engine | 2026-10 | SLICE-TRACED-TEST-CROSS-STAMPING (5L) | 100 | PASS | PWN | 0 | 0 | 0/0/0 | 0/0/2 | 0 (0) |
| 174 | `session-generation-other-recorded-mutations-name-no-commit` (631-632) | kernel-protocol | 2026-10 | SESSION-GENERATION-OTHER-RECORDED-MUTATIONS (5L) | 90 | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/0 | 0 (0) |
| 175 | `verify-cites-past-end-bound` (633-634) | governance | 2026-10 | VERIFY-CITES-PAST-END-BOUND (5L) | 150 | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/0 | 0 (1) |
| 176 | `fixture-s-regeneration-entry-point` (635-636) | kernel-protocol | 2026-10 | FIXTURE-S-REGENERATION-ENTRY-POINT (5L) | 260 | PWN | PWN | 0 | 0 | 0/0/3 | 0/0/0 | 0 (1) |
| 177 | `first-batch-factorial-ignored-trace-tests` (637-638) | kernel-protocol | 2026-10 | FIRST-BATCH-FACTORIAL-IGNORED-TRACE-TESTS (5L) | 40 | PWN | PWN | 0 | 0 | 0/0/0 | 0/0/0 | 3 (3) |
| 178 | `governance-hash-ref-leading-dot-path` (639-639) | governance | 2026-10 | HASH-REF-LEADING-DOT-PATH (5L) | 110 | PWN | - | 0 | 0 | 0/0/1 | 0/0/0 | 0 (0) |
| 179 | `admitted-integer-overflow-silent-wraparound` (640-645) | engine | 2026-10 | ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND | 450 | FAIL | PWN | 2 | 0 | 1/4/11 | 0/0/3 | 2 (2) |
| 180 | `corpus-line-files` (642-643) | engine | 2026-10 | CORPUS-LINE-FILES (5L) | 150 | PWN | FAIL | 0 | 0 | 0/7/2 | 0/0/2 | 0 (0) |
| 181 | `stream-fetch-overflow-fixed-detail` (646-647) | engine | 2026-10 | STREAM-FETCH-OVERFLOW-FIXED-DETAIL | 380 | PWN | PWN | 0 | 0 | 0/0/6 | 0/0/3 | 1 (1) |
| 182 | `open-dataset-refuses-a-name-closed-during-admission` (648-649) | kernel-protocol | 2026-10 | OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION (5L) | 140 | PWN | PWN | 0 | 0 | 0/0/5 | 0/0/0 | 3 (4) |
| 183 | `governance-f-tidy-repository-in-place` (650-653) | governance | 2026-10 | GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE | 1600 | FAIL | FAIL | 2 | 0 | 4/5/10 | 0/0/0 | 2 (2) |
| 184 | `adr-020-appended-note` (654-657) | kernel-protocol | 2026-11 | ADR-020-APPENDED-NOTE | ? | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/0 | 12 (12) |
| 185 | `verify-cites-reversed-range` (655-655) | governance | 2026-11 | VERIFY-CITES-REVERSED-RANGE (5L) | 100 | PASS | - | 0 | 0 | 0/0/0 | 0/0/0 | 0 (2) * |
| 186 | `engine-cancel-before-execute-siblings` (656-660) | engine | 2026-11 | ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS (5L) | 150 | PWN | FAIL | 2 | 0 | 0/2/5 | 0/0/9 | 0 (2) * |
| 187 | `walkthrough-stale-cites-l5-degrees-p1` (661-662) | shell | 2026-11 | WALKTHROUGH-STALE-CITES-L5-DEGREES-P1 | ? | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/0 | 0 (2) * |
| 188 | `verify-quotes-cite-listing-line-count` (663-664) | governance | 2026-11 | VERIFY-QUOTES-CITE-LISTING-LINE-COUNT (5L) | 70 | PWN | PWN | 0 | 0 | 0/0/1 | 0/0/0 | 0 (2) * |
| 189 | `adr-017-note-product-redaction-gate` (665-668) | kernel-protocol | 2026-11 | ADR-017-NOTE-PRODUCT-REDACTION-GATE | ? | PWN | FAIL | 0 | 0 | 0/0/0 | 0/0/0 | 0 * |
| 190 | `stream-cancel-returns-left-unmarked` (666-667) | engine | 2026-11 | STREAM-CANCEL-RETURNS-LEFT-UNMARKED (5L) | 150 | PWN | PWN | 0 | 0 | 0/0/2 | 0/0/0 | 0 (0) |

## 3. Aggregates

PWN = PASS WITH NOTES. `health.mjs definition` = the earliest entry per node is a strict `PASS` (`scripts/plan/health.mjs:161-182`), the figure the health strip shows; the other two read every gate's attempt 1.

### 3a. By month (the month of the piece's first gate entry)

| month | pieces | first-pass, all gates PASS or PWN | first-pass, all gates PASS | first-pass, health.mjs definition | reviewer first-pass P/PWN/F | architect first-pass P/PWN/F | mean CR | sum CR | gate entries (mean) | record rounds | C/E/D | S1/S2/N | median days form→closing | median days form→PR merge | pieces with days |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-09 | 70 | 25 (36%) | 25 (36%) | 26 (37%) | 30/0/39 | 12/0/31 | 1.49 | 104 | 310 (4.43) | 52 | 34/34/68 | 109/0/155 | 1.0 | 1.0 | 42 |
| 2026-10 | 113 | 62 (55%) | 35 (31%) | 43 (38%) | 43/30/40 | 33/24/33 | 0.73 | 83 | 343 (3.04) | 4 | 176/138/695 | 41/94/357 | 0.0 | 1.0 | 107 |
| 2026-11 | 7 | 5 (71%) | 1 (14%) | 1 (14%) | 1/6/0 | 0/4/2 | 0.29 | 2 | 15 (2.14) | 0 | 0/2/12 | 0/0/9 | 0.0 | 2.0 | 7 |

### 3b. By lane (`governance/PLAN.yaml` `lanes`, in priority order)

| lane | pieces | first-pass, all gates PASS or PWN | first-pass, all gates PASS | first-pass, health.mjs definition | reviewer first-pass P/PWN/F | architect first-pass P/PWN/F | mean CR | sum CR | gate entries (mean) | record rounds | C/E/D | S1/S2/N | median days form→closing | median days form→PR merge | pieces with days |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| engine | 37 | 13 (35%) | 7 (19%) | 8 (22%) | 14/7/15 | 7/7/18 | 1.54 | 57 | 175 (4.73) | 17 | 20/24/93 | 84/6/133 | 1.0 | 1.0 | 35 |
| kernel-protocol | 38 | 21 (55%) | 13 (34%) | 15 (39%) | 16/10/12 | 15/8/14 | 0.76 | 29 | 129 (3.39) | 8 | 50/33/173 | 27/29/147 | 0.0 | 1.0 | 35 |
| shell | 26 | 13 (50%) | 4 (15%) | 6 (23%) | 5/10/11 | 6/9/9 | 0.96 | 25 | 99 (3.81) | 4 | 45/60/312 | 0/0/15 | 1.0 | 1.5 | 24 |
| publish-viewer | 4 | 1 (25%) | 1 (25%) | 1 (25%) | 1/0/3 | 1/0/3 | 1.50 | 6 | 22 (5.50) | 1 | 0/0/0 | 3/6/31 | 0.0 | 0.5 | 4 |
| measurement | 3 | 1 (33%) | 1 (33%) | 1 (33%) | 1/0/2 | 0/0/1 | 0.67 | 2 | 7 (2.33) | 2 | 0/0/0 | 0/0/0 | n/a | n/a | 0 |
| release | 11 | 8 (73%) | 5 (45%) | 5 (45%) | 5/3/3 | 0/0/0 | 0.27 | 3 | 14 (1.27) | 1 | 19/1/14 | 0/0/0 | 1.0 | 1.0 | 7 |
| governance | 54 | 19 (35%) | 14 (26%) | 18 (33%) | 16/6/32 | 10/4/21 | 1.19 | 64 | 195 (3.61) | 23 | 76/50/165 | 36/50/195 | 0.0 | 0.0 | 49 |
| platform | 2 | 2 (100%) | 2 (100%) | 2 (100%) | 2/0/0 | 1/0/0 | 0.50 | 1 | 5 (2.50) | 0 | 0/6/0 | 0/3/0 | 0.5 | 0.5 | 2 |
| unmapped | 15 | 14 (93%) | 14 (93%) | 14 (93%) | 14/0/1 | 5/0/0 | 0.13 | 2 | 22 (1.47) | 0 | 0/0/18 | 0/0/0 | n/a | n/a | 0 |

### 3c. By piece size (the form's declared line budget)

| declared budget | pieces | first-pass, all gates PASS or PWN | first-pass, all gates PASS | first-pass, health.mjs definition | reviewer first-pass P/PWN/F | architect first-pass P/PWN/F | mean CR | sum CR | gate entries (mean) | record rounds | C/E/D | S1/S2/N | median days form→closing | median days form→PR merge | pieces with days |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| records-only (0) | 1 | 1 (100%) | 1 (100%) | 1 (100%) | 1/0/0 | 1/0/0 | 0.00 | 0 | 2 (2.00) | 0 | 0/0/0 | 0/1/5 | 0.0 | 0.0 | 1 |
| 1-50 | 26 | 18 (69%) | 14 (54%) | 14 (54%) | 14/4/8 | 4/3/3 | 0.35 | 9 | 50 (1.92) | 2 | 28/15/40 | 0/8/22 | 0.0 | 1.0 | 26 |
| 51-150 | 47 | 23 (49%) | 10 (21%) | 11 (23%) | 16/16/15 | 9/11/18 | 0.72 | 34 | 145 (3.09) | 14 | 43/36/146 | 12/5/107 | 0.0 | 1.0 | 47 |
| 151-500 | 26 | 11 (42%) | 6 (23%) | 9 (35%) | 8/5/13 | 9/6/10 | 1.15 | 30 | 105 (4.04) | 7 | 48/19/147 | 20/21/126 | 0.0 | 1.0 | 26 |
| 501-1500 | 22 | 6 (27%) | 3 (14%) | 5 (23%) | 5/3/14 | 5/4/13 | 1.59 | 35 | 106 (4.82) | 10 | 40/53/158 | 19/37/139 | 1.0 | 1.0 | 22 |
| over 1500 | 10 | 4 (40%) | 3 (30%) | 4 (40%) | 4/1/5 | 4/1/5 | 2.10 | 21 | 70 (7.00) | 1 | 30/34/219 | 23/11/52 | 1.5 | 1.0 | 10 |
| unknown | 58 | 29 (50%) | 24 (41%) | 26 (45%) | 26/7/24 | 13/3/17 | 1.03 | 60 | 190 (3.28) | 22 | 21/17/65 | 76/11/70 | 1.5 | 2.0 | 24 |

### 3d. By the form's shape

| form shape | pieces | first-pass, all gates PASS or PWN | first-pass, all gates PASS | first-pass, health.mjs definition | reviewer first-pass P/PWN/F | architect first-pass P/PWN/F | mean CR | sum CR | gate entries (mean) | record rounds | C/E/D | S1/S2/N | median days form→closing | median days form→PR merge | pieces with days |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| five-line | 54 | 30 (56%) | 13 (24%) | 14 (26%) | 16/18/20 | 2/13/13 | 0.72 | 39 | 154 (2.85) | 17 | 53/17/107 | 5/6/45 | 0.0 | 1.0 | 54 |
| full | 102 | 39 (38%) | 27 (26%) | 35 (34%) | 37/16/48 | 35/15/50 | 1.32 | 135 | 452 (4.43) | 32 | 157/157/648 | 139/88/475 | 1.0 | 1.0 | 102 |
| None | 34 | 23 (68%) | 21 (62%) | 21 (62%) | 21/2/11 | 8/0/3 | 0.44 | 15 | 62 (1.82) | 7 | 0/0/20 | 6/0/1 | n/a | n/a | 0 |

### 3e. By the gate agent's role

| role | gate entries | nodes | attempt-1 verdicts P/PWN/F | attempt-1 pass rate (P+PWN) | all attempts P/PWN/F/VOID | FAIL share, all attempts | reports read | C/E/D findings (per report) | S1/S2/N findings | rules most cited |
|---|---|---|---|---|---|---|---|---|---|---|
| reviewer | 379 | 190 | 78/36/88 of 202 | 56% | 159/55/164/1 | 43% | 255 | 117/92/389 (0.46/0.36/1.53 per report) | 76/54/232 | R48 (117), R36 (85), R43 (64), R42 (59), R17 (51) |
| architect | 288 | 143 | 47/28/75 of 150 | 50% | 114/40/134/0 | 47% | 214 | 93/82/386 (0.43/0.38/1.80 per report) | 74/40/289 | R48 (133), R36 (102), R14 (61), R24 (60), R17 (58) |
| tester | 1 | 1 | 1/0/0 of 1 | 100% | 1/0/0/0 | 0% | 0 | 0/0/0 (0.00/0.00/0.00 per report) | 0/0/0 |  |

### 3f. The 10 most recent gated pieces (piece E's 'ten before E1' baseline)

Ordered by the piece's first gate-log entry; the directive's measure is the gate first-pass rate and the gate runs per node (`state/directives/2026-10-24-governance-piece-e-rules-as-records-readings-e1-repin-fresh-session-practice.md:70-72`). The script takes `--last N`; the 'after E1' half is computed the same way once E1 has merged.

| node | first gate | gates | R first | A first | first-pass (all gates) | gate runs | CR |
|---|---|---|---|---|---|---|---|
| stream-fetch-overflow-fixed-detail | 2026-10-29 | architect+reviewer | PASS WITH NOTES | PASS WITH NOTES | yes | 2 | 0 |
| open-dataset-refuses-a-name-closed-during-admission | 2026-10-29 | architect+reviewer | PASS WITH NOTES | PASS WITH NOTES | yes | 2 | 0 |
| governance-f-tidy-repository-in-place | 2026-10-29 | architect+reviewer | FAIL | FAIL | no | 4 | 2 |
| adr-020-appended-note | 2026-11-01 | architect+reviewer | PASS WITH NOTES | PASS WITH NOTES | yes | 2 | 0 |
| verify-cites-reversed-range | 2026-11-01 | reviewer | PASS | - | yes | 1 | 0 |
| engine-cancel-before-execute-siblings | 2026-11-01 | architect+reviewer | PASS WITH NOTES | FAIL | no | 4 | 2 |
| walkthrough-stale-cites-l5-degrees-p1 | 2026-11-01 | architect+reviewer | PASS WITH NOTES | PASS WITH NOTES | yes | 2 | 0 |
| verify-quotes-cite-listing-line-count | 2026-11-03 | architect+reviewer | PASS WITH NOTES | PASS WITH NOTES | yes | 2 | 0 |
| adr-017-note-product-redaction-gate | 2026-11-03 | architect+reviewer | PASS WITH NOTES | FAIL | no | 2 | 0 |
| stream-cancel-returns-left-unmarked | 2026-11-03 | architect+reviewer | PASS WITH NOTES | PASS WITH NOTES | yes | 2 | 0 |
| **total / rate** |  |  |  |  | 7/10 (70%) | 23 (2.30 per node) | 4 |

## 4. Rules most often found broken

Each open finding's text was matched against the rule catalogue in `scripts/gate-analytics/rules.py` (regular expressions over the finding's text; a finding may cite several rules; the catalogue names each rule's source in `.claude/agents/*.md` and `governance/AUTONOMY.md`). The count is findings, not reports; the report list is in `rules.csv` (every report) and abridged here (the first 6 by path). Status lines (resolved / closed / holds) are excluded. Source abbreviations: A = `.claude/agents/architect.md`, R = `.claude/agents/reviewer.md`, W = `.claude/agents/worker.md`, T = `.claude/agents/tester.md`, LD = `.claude/agents/lead-data.md`, AU = `governance/AUTONOMY.md`; line numbers are at the commit named at the top.

Findings read: 1972; status lines: 158; open findings: 1814; open findings citing no catalogued rule: 611 (note 236, Documentation 208, Correctness 50, Evidence 49, should-fix 33, blocking 21, unclassed 14).

| rule | statement (paraphrase) | source (path:line) | findings | C/E/D/S1/S2/N | reports | pieces | reviewer/architect | gate reports citing it (abridged) |
|---|---|---|---|---|---|---|---|---|
| R48 | comments, docs, messages and record rows describe what the code does at this commit (no stale or untrue description) | W:27 (every user-facing message describes behaviour implemented at this commit); T:11 (every operator-facing line describes what was measured at this commit); AU:389 (§22) | 250 | 22/6/144/21/16/39 | 177 | 93 | 117/133 | `2026-09-26-corpus-record-gate1-reviewer.md`, `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-partition-offset-bounds-gate2-architect.md`, `2026-09-26-source-watcher-gate1-architect.md`, `2026-09-26-stop-hook-lease-gate1-reviewer.md`, `2026-09-26-stop-hook-lease-gate2-architect.md` … (+171; appendix A / rules.csv) |
| R36 | a claim of a guarantee, a limit or a measurement that the code or the evidence does not support is never documentation-only | AU:389 (§22); A:17; R:31 (the 2026-10-05 proportional gates); state/directives/2026-10-05-product-first-direction.md section 2 | 187 | 44/12/75/24/8/19 | 139 | 84 | 85/102 | `2026-09-26-corpus-record-gate1-reviewer.md`, `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-source-watcher-gate1-architect.md`, `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-stop-hook-lease-gate1-reviewer.md` … (+133; appendix A / rules.csv) |
| R43 | §9's suites and CI are run and recorded (exit codes, run ids, the tool's commit); carried-forward verdicts need a semantic applicability check | AU:168-174 (§6a contract), :391 (§22 carry-forward); the forms' §9 | 118 | 20/21/52/9/7/8 | 97 | 61 | 64/54 | `2026-09-26-corpus-record-gate1-architect.md`, `2026-09-26-corpus-record-gate1-reviewer.md`, `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-test-claims-followups-gate3-architect.md`, `2026-09-27-adr-034-gate2-reviewer.md`, `2026-09-27-b1-engine-kernel-half-gate2-reviewer.md` … (+91; appendix A / rules.csv) |
| R17 | one mutation per new test that fails it by name; a verify-mutation run is not an observation | AU:215 (§14), :222-226; A:15; R:29; W:33 (round 25 (c)) | 109 | 3/20/33/17/6/26 | 84 | 49 | 51/58 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-governance-weekly-proposals-gate1-reviewer.md`, `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-26-partition-offset-bounds-gate2-architect.md`, `2026-09-26-source-watcher-gate1-architect.md`, `2026-09-26-source-watcher-gate1-reviewer.md` … (+78; appendix A / rules.csv) |
| R03 | a quote marked verbatim matches its source byte for byte | A:10; R:25; W:25 (round 10) | 102 | 18/4/47/10/2/18 | 84 | 52 | 50/52 | `2026-09-26-corpus-record-gate1-architect.md`, `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate2-reviewer.md`, `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-26-source-watcher-gate2-architect.md` … (+78; appendix A / rules.csv) |
| R24 | immutable records are append-only; an amendment written after an outcome says so in its first line and names what it invalidates | AU:385 (§22); docs/PREREGISTRATION-TEMPLATE.md header rule | 99 | 7/2/61/10/5/13 | 91 | 62 | 39/60 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate2-architect.md`, `2026-09-26-origin-non-ascii-gate2-reviewer.md`, `2026-09-26-stop-hook-lease-gate2-architect.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate1-architect.md` … (+85; appendix A / rules.csv) |
| R27 | nothing synchronous on the canvas/UI path; every operation cancellable (docs/01 principle 7, ADR-018) | R:12 (checklist 2); A:10 (principle violations); CLAUDE.md non-negotiables | 98 | 8/14/32/9/5/29 | 61 | 38 | 43/55 | `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-source-watcher-gate2-architect.md`, `2026-09-27-kernel-generation-close-races-gate1-reviewer.md`, `2026-09-28-watcher-first-read-gate1-architect.md`, `2026-09-29-a2-1-gate2-architect.md` … (+55; appendix A / rules.csv) |
| R14 | the record cap: a closing amendment is references and hashes, never prose; record correction is two rounds per piece | A:10; R:25; AU:241 (§15), :389 (§22); state/directives/2026-09-18-record-cap.md | 91 | 2/0/49/5/5/26 | 84 | 53 | 30/61 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate2-architect.md`, `2026-09-26-origin-non-ascii-gate2-reviewer.md`, `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-26-partition-offset-bounds-gate2-architect.md` … (+78; appendix A / rules.csv) |
| R42 | the closing record, the PR body, the owner's index and KNOWN-LIMITATIONS are current with the diff before the merge | AU:389 (§22: fixed in the same PR, the closing record lists them); LD:14-16 (owner's index); AU:195 (§9) | 89 | 0/1/73/0/4/11 | 80 | 50 | 59/30 | `2026-09-26-stop-hook-lease-gate1-reviewer.md`, `2026-09-26-stop-hook-lease-gate2-reviewer.md`, `2026-09-27-b1-engine-kernel-half-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate2-reviewer.md`, `2026-09-30-cancel-before-execute-gate1-reviewer.md`, `2026-10-02-publish-panel-rs-regex-layout-gate2-reviewer.md` … (+74; appendix A / rules.csv) |
| R06 | a passage that must be invoked is pinned path:line @ commit sha256; a bare self-line, a cite into a file the same commit edits, or a pin read as current fails | A:10; R:25 (round 12 (b), round 14, round 15) | 85 | 9/5/38/7/3/18 | 76 | 56 | 35/50 | `2026-09-26-corpus-record-gate1-architect.md`, `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-26-source-watcher-gate2-architect.md`, `2026-09-26-stop-hook-lease-gate2-architect.md`, `2026-09-26-stream-registry-bound-gate1-architect.md` … (+70; appendix A / rules.csv) |
| R33 | module and protocol boundaries (docs/02, docs/10; control plane vs data plane; MCP never bulk data) | A:10 (module and protocol boundaries) | 79 | 17/4/30/8/3/13 | 48 | 25 | 35/44 | `2026-09-26-source-watcher-gate1-architect.md`, `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-source-watcher-gate2-architect.md`, `2026-09-27-b1-engine-kernel-half-gate1-architect.md`, `2026-09-27-b1-engine-kernel-half-gate1-reviewer.md`, `2026-09-27-adr-034-gate1-architect.md` … (+42; appendix A / rules.csv) |
| R19 | a §7 budget overrun is recorded as class 8 and §7 is never edited | A:15; R:29; W:33 (round 25, item 2 (a)); docs/PREREGISTRATION-TEMPLATE.md Round 25 | 76 | 4/3/45/5/4/13 | 70 | 39 | 35/41 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-stop-hook-lease-gate2-reviewer.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate1-reviewer.md`, `2026-09-27-exposure-profile-paths-gate2-architect.md` … (+64; appendix A / rules.csv) |
| R38 | every path:line cite resolves (verify:cites); a stale or off-by-N cite fails by name | AU:148-154 (§6a items 1-2); A:10 (a stale cite ... a gate failure by name); W:25 | 70 | 7/7/35/3/2/16 | 54 | 36 | 48/22 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-governance-weekly-proposals-gate1-reviewer.md`, `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate2-reviewer.md`, `2026-09-27-exposure-profile-paths-gate1-reviewer.md`, `2026-09-27-exposure-profile-paths-gate3-architect.md` … (+48; appendix A / rules.csv) |
| R11 | a hash reference in an append-only record carries an explicit @ rev at a commit on main | A:10; R:25 (round 15 (e)); AU:499 (§27) | 64 | 2/3/37/5/4/12 | 63 | 48 | 28/36 | `2026-09-26-corpus-record-gate1-architect.md`, `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-stop-hook-lease-gate2-architect.md`, `2026-09-27-b1-engine-kernel-half-gate1-architect.md`, `2026-09-27-adr-034-gate1-reviewer.md`, `2026-09-27-exposure-profile-paths-gate1-reviewer.md` … (+57; appendix A / rules.csv) |
| R40 | red-line text (ADR status/amendments, gate rulings, licensing, security posture) keeps the human's typed words; red lines are the human's | A:17-19; R:31-33; W:14-15; AU:3, :311-313 (§21) | 63 | 19/4/27/5/1/4 | 46 | 30 | 25/38 | `2026-09-26-corpus-record-gate1-architect.md`, `2026-09-26-corpus-record-gate1-reviewer.md`, `2026-09-26-origin-non-ascii-gate2-architect.md`, `2026-09-27-adr-034-gate1-architect.md`, `2026-09-27-adr-034-gate1-reviewer.md`, `2026-09-27-adr-034-gate2-architect.md` … (+40; appendix A / rules.csv) |
| R32 | tests for non-spike code; every required test reaches its assertion | R:17 (checklist 7); W:27; T:11 (the four failure classes) | 62 | 9/13/10/10/5/15 | 50 | 32 | 34/28 | `2026-09-26-stop-hook-lease-gate2-architect.md`, `2026-09-27-b1-engine-kernel-half-gate1-architect.md`, `2026-09-27-b1-engine-kernel-half-gate1-reviewer.md`, `2026-09-27-b1-engine-kernel-half-gate2-reviewer.md`, `2026-09-27-exposure-profile-paths-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate1-reviewer.md` … (+44; appendix A / rules.csv) |
| R15 | every 'discharged'/'done' clause in an amendment names the test or line that proves it | A:10; R:25 (round 7) | 59 | 6/13/10/18/5/4 | 50 | 32 | 24/35 | `2026-09-27-b1-engine-kernel-half-gate1-reviewer.md`, `2026-09-27-adr-034-gate1-architect.md`, `2026-09-27-adr-034-gate2-architect.md`, `2026-09-27-b1-engine-kernel-half-gate2-reviewer.md`, `2026-09-27-b1-engine-kernel-half-gate3-reviewer.md`, `2026-09-27-exposure-profile-paths-gate1-architect.md` … (+44; appendix A / rules.csv) |
| R39 | a claimed test exists in the tree (verify:test-claims); a claimed-but-missing test fails | AU:155-163 (§6a item 3) | 51 | 0/11/19/7/2/12 | 37 | 27 | 36/15 | `2026-09-26-governance-weekly-proposals-gate1-reviewer.md`, `2026-09-26-stop-hook-lease-gate1-reviewer.md`, `2026-09-26-test-claims-followups-gate3-architect.md`, `2026-09-27-b1-engine-kernel-half-gate2-reviewer.md`, `2026-09-27-exposure-profile-paths-gate1-reviewer.md`, `2026-09-27-kernel-generation-close-races-gate1-reviewer.md` … (+31; appendix A / rules.csv) |
| R08 | a correction round ends with a superseded index | A:10; R:25 (round 12 (e)) | 46 | 2/0/19/6/7/10 | 43 | 28 | 15/31 | `2026-09-26-test-claims-followups-gate2-architect.md`, `2026-09-26-test-claims-followups-gate3-reviewer.md`, `2026-09-27-governance-weekly-proposals-gate2-architect.md`, `2026-09-27-kernel-generation-close-races-gate1-architect.md`, `2026-10-01-catalog-replace-note-gate2-architect.md`, `2026-10-01-catalog-replace-note-gate2-reviewer.md` … (+37; appendix A / rules.csv) |
| R44 | strings the app shows and KNOWN-LIMITATIONS words go on the human's sight list (P6) | A:19; R:33 (strings the app shows stay under P6); the forms' §9 Operator lines | 45 | 6/1/25/3/1/6 | 36 | 20 | 18/27 | `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-source-watcher-gate2-architect.md`, `2026-09-26-source-watcher-gate3-architect.md`, `2026-09-27-adr-034-gate1-architect.md`, `2026-09-27-adr-034-gate1-reviewer.md`, `2026-10-03-guardian-v0-gate1-architect.md` … (+30; appendix A / rules.csv) |
| R01 | cross-module seam written against the real interface, proven end to end | A:10; R:18-25; W:17-24 (round 4) | 41 | 9/13/5/5/2/5 | 39 | 30 | 17/24 | `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-26-source-watcher-gate1-architect.md`, `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-source-watcher-gate2-architect.md`, `2026-09-26-stop-hook-lease-gate1-reviewer.md`, `2026-09-26-stream-registry-bound-gate1-architect.md` … (+33; appendix A / rules.csv) |
| R49 | a recorded figure, count or command names the commit it was run at and is reproducible (no moving HEAD, no unnamed commit) | A:10; R:25 (round 15 (c)); the forms' §7 counting command 'at a named commit' | 40 | 2/3/17/10/3/4 | 35 | 27 | 16/24 | `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-27-b1-engine-kernel-half-gate3-reviewer.md`, `2026-09-27-exposure-profile-paths-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate1-reviewer.md`, `2026-09-27-exposure-profile-paths-gate3-architect.md`, `2026-09-27-exposure-profile-paths-gate3-reviewer.md` … (+29; appendix A / rules.csv) |
| R07 | a correction is at most three sentences and never restates an earlier amendment's claim | A:10; R:25 (round 12 (d)) | 39 | 2/0/28/5/2/1 | 39 | 32 | 11/28 | `2026-09-27-exposure-profile-paths-gate5-reviewer.md`, `2026-09-27-kernel-generation-close-races-gate1-architect.md`, `2026-09-27-kernel-generation-close-races-gate1-reviewer.md`, `2026-09-29-a2-1-gate2-architect.md`, `2026-09-30-close-dataset-unknown-gate2-architect.md`, `2026-10-02-test-claims-same-pr-pin-gate1-architect.md` … (+33; appendix A / rules.csv) |
| R26 | no unwrap on fallible paths in non-spike code; failures not hidden | R:11 (checklist 1) | 38 | 4/1/6/10/3/13 | 32 | 25 | 21/17 | `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate2-reviewer.md`, `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-26-stream-registry-bound-gate1-reviewer.md`, `2026-09-27-adr-034-gate1-architect.md` … (+26; appendix A / rules.csv) |
| R10 | a record statement about a tool's behaviour names the tool's commit | A:10; R:25 (round 15 (c)) | 33 | 0/4/17/6/1/3 | 32 | 23 | 13/20 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-26-partition-offset-bounds-gate2-architect.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-26-stream-registry-bound-gate1-reviewer.md`, `2026-09-27-exposure-profile-paths-gate1-architect.md` … (+26; appendix A / rules.csv) |
| R20 | a scope addition on a standing rule is recorded as class 9 before any code of it | A:15; R:29; W:33 (round 25, item 2 (b)) | 33 | 8/0/11/4/4/6 | 28 | 23 | 13/20 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-10-02-round-mirror-hook-gate2-reviewer.md`, `2026-10-02-test-claims-same-pr-pin-gate1-architect.md`, `2026-10-02-test-claims-same-pr-pin-gate2-architect.md`, `2026-10-02-test-claims-same-pr-pin-gate2-reviewer.md`, `2026-10-02-workspace-rustfmt-gate1-reviewer.md` … (+22; appendix A / rules.csv) |
| R35 | the piece's text defines its scope: no improvisation past it; scope creep against the roadmap and the form | W:11 (Rules); A:10 (scope creep against the roadmap) | 33 | 3/1/15/1/1/11 | 30 | 24 | 15/18 | `2026-09-26-stop-hook-lease-gate1-reviewer.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate3-reviewer.md`, `2026-09-30-b-1-code-gate1-architect.md`, `2026-09-30-b-1-code-gate2-reviewer.md`, `2026-10-02-skp-cancel-state-closed-set-gate1-architect.md` … (+24; appendix A / rules.csv) |
| R02 | no callback/option/code path/pub item without a product caller (instrument-accessor exemption) | A:10; R:24-25; W:23-25 (round 4; round 5 item 4; round 8) | 31 | 10/2/6/5/2/5 | 27 | 20 | 19/12 | `2026-09-27-test-claims-landedness-gate1-reviewer.md`, `2026-09-29-a2-1-gate2-architect.md`, `2026-09-30-ticket-liveness-redeem-gate1-architect.md`, `2026-09-30-ticket-liveness-redeem-gate1-reviewer.md`, `2026-10-02-skp-cancel-state-closed-set-gate1-reviewer.md`, `2026-10-02-test-claims-same-pr-pin-gate1-architect.md` … (+21; appendix A / rules.csv) |
| R23 | the §21c size threshold (≤150 changed lines, ≤8 files; insertions plus deletions) and the form's declared line budget | AU:347-357 (§21c) | 31 | 3/2/14/5/1/5 | 29 | 24 | 12/19 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-stop-hook-lease-gate2-architect.md`, `2026-09-26-stop-hook-lease-gate2-reviewer.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate1-architect.md` … (+23; appendix A / rules.csv) |
| R21 | a test-text span on an unmerged branch is named with its commit id, never hash-pinned at a branch commit | A:15; R:29; W:33 (round 25, item 2 (d)) | 30 | 4/0/13/4/4/5 | 27 | 23 | 10/20 | `2026-09-26-stream-registry-bound-gate1-reviewer.md`, `2026-09-27-exposure-profile-paths-gate3-architect.md`, `2026-09-28-watcher-first-read-gate2-architect.md`, `2026-09-29-a2-1-gate2-architect.md`, `2026-09-30-close-dataset-unknown-gate2-architect.md`, `2026-09-30-publish-refusal-src-tauri-gate1-reviewer.md` … (+21; appendix A / rules.csv) |
| R30 | no unmeasured performance claim; numbers per docs/08 | R:15 (checklist 5); T:11; AU:127 (§5) | 26 | 2/1/12/1/0/9 | 25 | 21 | 5/21 | `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-stop-hook-lease-gate2-architect.md`, `2026-09-26-stop-hook-lease-gate2-reviewer.md`, `2026-09-27-adr-034-gate2-architect.md`, `2026-09-27-kernel-generation-close-races-gate1-architect.md` … (+19; appendix A / rules.csv) |
| R05 | ledger rulings cited by round and item (or entry number), never by line | A:10; R:25 (round 12 (a), round 14 (a′)) | 25 | 4/2/9/2/3/4 | 22 | 18 | 8/17 | `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-27-adr-034-gate1-reviewer.md`, `2026-10-02-publish-panel-rs-regex-layout-gate1-reviewer.md`, `2026-10-02-test-claims-same-pr-pin-gate1-architect.md`, `2026-10-02-test-claims-same-pr-pin-gate2-architect.md`, `2026-10-02-workspace-rustfmt-gate2-architect.md` … (+16; appendix A / rules.csv) |
| R18 | a sibling search on every fix | AU:215 (§14) | 22 | 2/5/3/4/0/8 | 21 | 17 | 9/13 | `2026-09-26-source-watcher-gate1-reviewer.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-27-exposure-profile-paths-gate2-architect.md`, `2026-09-30-cancel-before-execute-gate1-reviewer.md`, `2026-09-30-cancel-before-execute-gate2-architect.md`, `2026-09-30-cancel-before-execute-gate2-reviewer.md` … (+15; appendix A / rules.csv) |
| R29 | CRS handled as a type; no implicit reprojection or hard-coded EPSG assumption | R:14 (checklist 4); CLAUDE.md non-negotiables | 21 | 6/2/12/0/0/1 | 19 | 14 | 9/12 | `2026-09-30-raw-path-refusal-code-gate1-reviewer.md`, `2026-10-07-geometry-points-cut-gate1-architect.md`, `2026-10-07-geometry-points-cut-gate1-reviewer.md`, `2026-10-10-known-limitations-item-2-on-main-paragraph-gate1-reviewer.md`, `2026-10-11-crs-undeclared-message-wording-gate1-architect.md`, `2026-10-11-known-limitations-item-2-on-main-paragraph-gate2-reviewer.md` … (+13; appendix A / rules.csv) |
| R22 | a five-line form's Out-of-scope line that names a §21a category takes the full form and full gating | AU:334-345 (§21b), :359-375 (§21d), :482 (§25 (e)); A:15; R:29 | 19 | 1/0/7/3/2/6 | 16 | 15 | 6/13 | `2026-09-26-governance-weekly-proposals-gate1-architect.md`, `2026-09-26-stop-hook-lease-gate2-architect.md`, `2026-09-27-test-claims-landedness-gate1-reviewer.md`, `2026-09-28-watcher-first-read-gate1-architect.md`, `2026-10-02-test-claims-same-pr-pin-gate1-architect.md`, `2026-10-03-kernel-ticket-drop-followups-gate2-architect.md` … (+10; appendix A / rules.csv) |
| R47 | heavy runs happen inside the shared machine hold; hold lines recorded | the forms' §9 (Heavy runs happen inside the shared hold); state/directives (holds check) | 18 | 3/8/7/0/0/0 | 14 | 12 | 14/4 | `2026-10-03-lead-data-pilot-setup-gate1-reviewer.md`, `2026-10-09-e2e-hover-establishing-read-stale-gate1-architect.md`, `2026-10-09-skp-drained-stream-helper-post-check-race-gate1-architect.md`, `2026-10-11-shell-map-refill-after-resize-gate1-reviewer.md`, `2026-10-14-stale-test-names-and-comments-gate1-reviewer.md`, `2026-10-17-source-changed-post-route-s5d-race-step-1-gate1-reviewer.md` … (+8; appendix A / rules.csv) |
| R04 | an elision never removes a negation, condition or qualifier | A:10; R:25 (round 11) | 12 | 0/0/4/2/0/3 | 11 | 8 | 5/7 | `2026-09-26-origin-non-ascii-gate1-architect.md`, `2026-09-26-origin-non-ascii-gate2-architect.md`, `2026-09-26-origin-non-ascii-gate2-reviewer.md`, `2026-09-26-partition-offset-bounds-gate1-architect.md`, `2026-09-26-source-watcher-gate3-architect.md`, `2026-09-26-stream-registry-bound-gate1-architect.md` … (+5; appendix A / rules.csv) |
| R12 | a hash reference is written contiguous on one line | A:10; R:25 (round 15 (d)) | 12 | 0/3/3/1/0/4 | 11 | 9 | 6/6 | `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-26-stream-registry-bound-gate1-reviewer.md`, `2026-09-27-b1-engine-kernel-half-gate1-architect.md`, `2026-09-27-adr-034-gate1-architect.md`, `2026-09-27-adr-034-gate1-reviewer.md`, `2026-10-04-type-walk-null-literal-arithmetic-gate2b-architect.md` … (+5; appendix A / rules.csv) |
| R31 | float precision: projected coordinates reaching float32 without offset-relative handling | R:16 (checklist 6) | 12 | 2/0/2/7/0/1 | 9 | 5 | 7/5 | `2026-09-27-b1-engine-kernel-half-gate1-architect.md`, `2026-09-27-b1-engine-kernel-half-gate1-reviewer.md`, `2026-09-27-b1-engine-kernel-half-gate2-reviewer.md`, `2026-09-30-b-1-code-gate1-architect.md`, `2026-09-30-b-1-code-gate1-reviewer.md`, `2026-10-03-publish-attempt-lifecycle-src-tauri-gate2-architect.md` … (+3; appendix A / rules.csv) |
| R37 | a wording block ends in one answer: exact replacement words with a clause check; the human's wording vs a worker's | AU:530-551 (§31); A:19; R:33 | 12 | 2/0/9/0/0/1 | 11 | 8 | 6/6 | `2026-09-27-b1-engine-kernel-half-gate1-architect.md`, `2026-10-02-exposure-scan-ci-backstop-gate3-architect-reduction.md`, `2026-10-11-wording-block-rule-gate1-architect.md`, `2026-10-11-wording-block-rule-gate1-reviewer.md`, `2026-10-12-guardian-v1-gate1-architect.md`, `2026-10-14-stale-test-names-and-comments-gate1-reviewer.md` … (+5; appendix A / rules.csv) |
| R16 | operator-visible text: engine messages state engine facts; owners state consequences | A:10; R:25 (round 7) | 11 | 2/1/0/3/0/4 | 11 | 10 | 4/7 | `2026-09-26-source-watcher-gate2-architect.md`, `2026-09-26-stream-registry-bound-gate1-architect.md`, `2026-09-27-b1-engine-kernel-half-gate1-reviewer.md`, `2026-09-27-adr-034-gate1-architect.md`, `2026-09-28-watcher-first-read-gate2-reviewer.md`, `2026-09-29-a2-1-gate1-architect.md` … (+5; appendix A / rules.csv) |
| R25 | a gate report's first line names the branch @ commit it reviewed | AU:480 (§25 (b)); A:15; R:29 | 10 | 1/0/6/0/1/2 | 10 | 9 | 4/6 | `2026-09-27-exposure-profile-paths-gate2-reviewer.md`, `2026-09-27-exposure-profile-paths-gate3-architect.md`, `2026-10-02-round-mirror-hook-merge-reviewer.md`, `2026-10-04-evidence-recorder-v0-gate3-architect.md`, `2026-10-05-adr-034-acceptance-words-gate1-architect.md`, `2026-10-05-timing-assertions-under-contention-gate1-reviewer.md` … (+4; appendix A / rules.csv) |
| R34 | operation-class correctness (ADR-006: pure / workspace / side effect) | A:10 (operation-class correctness) | 9 | 3/0/6/0/0/0 | 8 | 8 | 1/8 | `2026-10-03-lead-data-pilot-setup-gate1-reviewer.md`, `2026-10-05-compaction-record-and-resume-line-gate1-architect.md`, `2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-gate1-architect.md`, `2026-10-10-wire-bytes-invariant-trace-flag-race-gate1-architect.md`, `2026-10-11-ported-code-notice-route-gate1-architect.md`, `2026-10-14-stale-test-names-and-comments-gate1-architect.md` … (+2; appendix A / rules.csv) |
| R46 | no new dependency without the human (a dependency edge the human has not seen) | AU:3; A:10; R:29; CLAUDE.md (dependency additions are the human's) | 8 | 5/2/1/0/0/0 | 8 | 6 | 5/3 | `2026-10-08-b2-piece-1a-step-record-and-dataset-reference-gate1-reviewer-attempt-2.md`, `2026-10-08-b2-piece-1a-step-record-and-dataset-reference-gate1-reviewer.md`, `2026-10-11-ported-code-notice-route-gate1-architect.md`, `2026-10-23-walkthrough-row-f7-cli-refusal-gate2-architect.md`, `2026-10-23-walkthrough-row-f7-cli-refusal-gate2-reviewer.md`, `2026-10-24-stream-evaluation-failure-fixed-detail-gate1-reviewer.md` … (+2; appendix A / rules.csv) |
| R09 | nothing tracked may cite an untracked file as Authority | A:10; R:25 (round 14) | 5 | 0/2/3/0/0/0 | 5 | 5 | 4/1 | `2026-10-08-verify-cites-pinned-citations-gate1-reviewer.md`, `2026-10-10-stream-flush-cancel-exit-marks-producer-cancelled-gate1-reviewer.md`, `2026-10-16-b2-piece-1b-recording-gate2-reviewer.md`, `2026-10-17-publish-approval-unknown-attempt-step-1-gate1-architect.md`, `2026-10-21-walkthrough-current-view-rows-g1-n5-gate1-reviewer.md` |
| R41 | the worker's/tester's report states the four failure classes, the model, overrides, handoffs; the report format | W:27-31; T:11 (report additions) | 5 | 0/1/1/1/0/2 | 5 | 4 | 2/3 | `2026-09-29-a2-1-gate2-architect.md`, `2026-10-01-catalog-replace-note-gate1-reviewer.md`, `2026-10-01-catalog-replace-note-gate2-reviewer.md`, `2026-10-17-publish-approval-unknown-attempt-step-1-gate1-architect.md`, `2026-10-19-shell-migration-milestone-3-pr-a-gate1-architect.md` |
| R45 | the generation tag: a result whose node@g<n> no longer matches is stale | AU:230 (§15) | 4 | 0/0/2/0/1/1 | 4 | 3 | 2/2 | `2026-10-02-stop-hook-stale-continuity-gate1-architect.md`, `2026-10-02-stop-hook-stale-continuity-gate1-reviewer.md`, `2026-10-05-proportional-gates-gate1-architect.md`, `2026-10-26-session-generation-other-recorded-mutations-name-no-commit-gate1-reviewer.md` |
| R28 | no JSON on a data path (ADR-004) | R:13 (checklist 3) | 3 | 1/0/0/1/0/1 | 3 | 3 | 2/1 | `2026-10-02-test-claims-same-pr-pin-gate1-reviewer.md`, `2026-10-07-kernel-close-races-followups-gate1-reviewer.md`, `2026-10-11-skp-v0-live-sections-current-area-c-gate1-architect.md` |
| R13 | a committed byte of a record is restored only within the round-15 (f) bound | A:10; R:25 (round 15 (f)) | 2 | 0/0/1/1/0/0 | 2 | 2 | 1/1 | `2026-09-27-kernel-generation-close-races-gate1-reviewer.md`, `2026-10-02-workspace-rustfmt-gate2-architect.md` |

### Appendix A. The gate reports citing each of the four most-cited rules, grouped by piece

Each entry is `piece: report, report, …` with each report named by its file name less the date prefix, `.md`, and the piece's own id when the name starts with it; `state/consults/…` (pre-§25) files are marked `†`. The complete list for every rule is `rules.csv`.

- **R48** (250 findings, 177 reports, 93 pieces) — `adr-020-appended-note`: gate1-architect, gate1-reviewer; `adr-036-pre-acceptance-block`: gate1-architect, gate1-reviewer; `b1-close-nul-column-names`: a2-1-gate1-architect, a2-1-gate2-architect, a2-1-gate2-reviewer, a2-1-gate3-architect, a2-1-gate3-reviewer, a2-1-reduction1-architect; `b1-engine-kernel-half`: gate1-architect†, gate1-reviewer†, gate2-reviewer; `b1-engine-kernel-half-followups`: gate1-reviewer; `b1-shell-half`: pr-a-gate1-architect, pr-a-gate1-reviewer, pr-c-gate1-architect, pr-c-gate1-reviewer; `b2-piece-1a-step-record-and-dataset-reference`: gate1-architect-attempt-2, gate1-architect, gate1-reviewer; `b2-piece-1b-recording`: gate1-architect, gate1-reviewer, gate2-reviewer, gate3-reviewer; `bundle-redaction-scan-not-in-product-publish`: gate1-architect; `bundle-viewer-partition-offset-bounds`: partition-offset-bounds-gate2-architect†; `catalog-open-replace-drop-latency-note`: catalog-replace-note-gate1-architect; `compaction-record-and-resume-line`: gate1-architect; `corpus-line-files`: gate1-architect; `corpus-reproducibility-record`: corpus-record-gate1-reviewer†; `covering-case-collision-binds-other-column`: gate1-architect, gate1-reviewer; `covering-names-missing-column`: gate1-architect-attempt-2, gate1-reviewer; `data-plane-crowded-start-detail-spaces`: gate1-architect, gate1-reviewer; `data-plane-origin-non-ascii`: origin-non-ascii-gate1-architect†; `data-plane-stream-registry-bound`: stream-registry-bound-gate1-architect†; `e2e-hover-establishing-read-stale`: gate1-architect, gate1-reviewer; `e2e-stale-expectations-reaim`: gate1-architect; `engine-cancel-before-execute-siblings`: gate1-architect, gate1-reviewer; `engine-cancel-before-stream-window`: cancel-before-execute-gate1-architect, cancel-before-execute-gate1-reviewer, cancel-before-execute-gate2-architect; `engine-clause-composition-properties`: gate1-reviewer; `engine-source-change-watcher`: source-watcher-gate1-architect†; `evidence-recorder-v0`: gate1-architect, gate1-reviewer, gate2-architect; `evidence-recorder-v0-1`: gate1-architect, gate1-reviewer; `export-current-view-after-unreported-fit`: gate1-reviewer; `exposure-profile-paths`: gate1-architect, gate1-reviewer, gate2-architect, gate2-reviewer; `exposure-scan-ci-backstop`: gate1-architect, gate1-reviewer, gate3-architect-reduction, gate3-reviewer; `filter-bind-admission-implicit-coercions`: b-1-code-gate1-architect; `fixture-s-regeneration-entry-point`: gate1-architect; `flush-crlf-field-rewrite`: gate2-reviewer; `geometry-lines-cut`: gate1-architect; `geometry-points-cut`: gate1-architect, gate1-reviewer; `geometry-types-beyond-polygons`: adr-034-gate2-architect, adr-034-gate2-reviewer, gate1-reviewer; `governance-cut-state-cap-and-rotation`: gate1-reviewer; `governance-decisions-pending-open-and-archive`: gate1-architect; `governance-f-tidy-repository-in-place`: gate1-architect, gate1-reviewer; `governance-hash-grammar-shared`: gate1-reviewer; `governance-hash-ref-leading-dot-path`: gate1-reviewer; `governance-plan-summaries-archive`: gate1-architect, gate2-architect; `governance-search-ignore-historical`: gate1-architect; `governance-stop-hook-lease`: stop-hook-lease-gate1-reviewer†, stop-hook-lease-gate2-architect†; `governance-test-claims-superseded-followups`: test-claims-followups-gate2-architect†, test-claims-followups-gate3-architect†; `governance-weekly-proposals-2026-09-26`: governance-weekly-proposals-gate2-architect†; `guardian-v0`: gate2-architect, gate2-reviewer; `guardian-v1`: gate1-architect, gate1-reviewer; `kernel-close-dataset-unknown-keeps-openrecord`: close-dataset-unknown-gate2-architect; `kernel-close-during-open-admission`: gate1-architect; `kernel-generation-close-races`: gate1-reviewer; `kernel-ticket-drop-followups`: gate1-architect, gate2-reviewer; `known-limitations-crs-epoch-edges-third-axis`: gate1-reviewer; `known-limitations-item-2-on-main-paragraph`: gate1-reviewer; `module-docs-stale-statements`: gate1-architect, gate1-reviewer; `open-dataset-refuses-a-name-closed-during-admission`: gate1-architect, gate1-reviewer; `port-1-linux-l1`: gate2-architect; `ported-code-notice-route`: gate1-reviewer; `proportional-gates`: gate1-architect; `publish-attempt-lifecycle-src-tauri`: gate2-architect; `publish-sort-window-cancel-not-exercised-on-ci`: gate1-architect, gate1-reviewer; `questions-mirror-item-count`: gate1-architect; `recorder-retired`: gate1-reviewer; `round-mirror-pretooluse-hook`: round-mirror-hook-gate1-reviewer, round-mirror-hook-merge-reviewer; `session-generation-other-recorded-mutations-name-no-commit`: gate1-reviewer; `shell-crs-form-for-format-default-contradicted`: gate1-reviewer; `shell-map-refill-after-resize`: gate1-architect, gate1-reviewer, gate2-architect; `shell-migration-milestone-1`: gate1-architect-attempt-2, gate1-architect, gate1-reviewer-attempt-2, gate1-reviewer; `shell-migration-milestone-2`: phase-a-gate1-reviewer, phase-b-gate1-architect, phase-b-gate1-reviewer, phase-b-gate2-architect, phase-b-gate2-reviewer, phase-b-gate3-reviewer, phase-b-gate4-reviewer; `shell-migration-milestone-3`: pr-a-gate1-architect, pr-a-gate1-reviewer, pr-a-gate2-architect, pr-a-gate2-reviewer, pr-a-gate3-architect, pr-a-gate3-reviewer, pr-b-gate1-architect, pr-b-gate1-reviewer; `shell-stale-frame-comments`: shell-stale-frame-and-layout-comments-gate1-reviewer; `shell-status-bar-one-height`: gate1-architect, gate1-reviewer; `skp-cancel-state-closed-set`: gate1-architect, gate1-reviewer; `skp-v0-live-sections-current-area-c`: gate1-reviewer; `slice-traced-test-cross-stamping`: gate1-architect; `source-changed-post-reopen-routes-watcher-visible`: gate1-architect, gate1-reviewer; `source-changed-post-route-s5d-race`: source-changed-s5d-inconclusive-gate1-architect; `stale-test-names-and-comments`: gate1-architect; `stop-hook-stale-continuity`: gate1-reviewer, gate2-architect, gate2-reviewer; `stream-evaluation-failure-fixed-detail`: gate1-reviewer, gate2-architect, gate2-reviewer; `stream-fetch-overflow-fixed-detail`: gate1-architect; `subagent-write-audit-script`: gate2-architect; `test-claims-same-pr-superseded-pin`: test-claims-same-pr-pin-gate1-reviewer; `timing-assertions-under-contention`: gate1-architect, gate1-reviewer; `type-walk-null-literal-arithmetic`: gate1-architect; `verify-cites-out-of-range-line-count`: gate1-reviewer; `verify-cites-pin-resolution-and-line-zero`: gate1-architect, gate1-reviewer; `verify-cites-pinned-citations`: gate1-reviewer-attempt-2, gate1-reviewer; `verify-quotes-round-item-cites`: gate1-architect, gate2-architect, gate2-reviewer; `walkthrough-row-f7-cli-refusal`: gate1-architect, gate2-architect; `wire-bytes-invariant-trace-flag-race`: gate1-architect, gate1-reviewer; `wording-block-rule`: gate1-architect, gate1-reviewer; `workspace-rustfmt`: gate1-architect, gate1-reviewer, gate2-architect, gate2-reviewer, gate3-architect

- **R36** (187 findings, 139 reports, 84 pieces) — `admitted-integer-overflow-silent-wraparound`: gate1-architect, gate1-reviewer; `adr-020-appended-note`: gate1-architect; `adr-036-pre-acceptance-block`: gate1-architect; `b1-close-nul-column-names`: a2-1-gate1-architect, a2-1-gate2-architect, a2-1-gate2-reviewer, a2-1-gate3-architect, a2-1-gate3-reviewer, a2-1-reduction1-architect; `b1-engine-kernel-half`: gate1-architect†, gate1-reviewer†, gate2-reviewer; `b1-engine-kernel-half-followups`: gate1-architect; `b1-shell-half`: pr-a-gate1-architect, pr-c-gate1-architect, pr-c-gate1-reviewer; `b2-piece-1a-step-record-and-dataset-reference`: gate1-architect; `b2-piece-1b-recording`: gate1-architect, gate1-reviewer, gate2-architect, gate2-reviewer, gate3-reviewer; `bundle-redaction-scan-not-in-product-publish`: gate1-architect; `catalog-open-replace-drop-latency-note`: catalog-replace-note-gate1-architect, catalog-replace-note-gate1-reviewer; `claude-md-stale-facts`: gate1-reviewer; `corpus-line-files`: gate1-architect; `corpus-reproducibility-record`: corpus-record-gate1-reviewer†; `covering-case-collision-binds-other-column`: gate1-architect, gate1-reviewer; `covering-names-missing-column`: gate1-architect; `crs-undeclared-message-wording`: gate1-architect; `data-plane-origin-non-ascii`: origin-non-ascii-gate1-architect†; `data-plane-stream-registry-bound`: stream-registry-bound-gate1-architect†; `data-plane-terminal-without-credit`: gate1-architect, gate1-reviewer; `e2e-hover-establishing-read-stale`: gate1-reviewer; `e2e-stale-expectations-reaim`: gate1-architect, gate1-reviewer, gate2-reviewer; `engine-cancel-before-stream-window`: cancel-before-execute-gate1-architect, cancel-before-execute-gate1-reviewer; `engine-clause-composition-properties`: gate1-architect; `engine-source-change-watcher`: source-watcher-gate1-architect†, source-watcher-gate1-reviewer†; `evidence-recorder-v0`: gate3-architect; `evidence-recorder-v0-1`: gate1-architect; `export-current-view-after-unreported-fit`: gate1-architect, gate1-reviewer; `exposure-profile-paths`: gate1-architect, gate1-reviewer, gate2-architect, gate2-reviewer; `exposure-scan-ci-backstop`: gate1-architect, gate2-reviewer; `filter-bind-admission-implicit-coercions`: b-1-code-gate1-architect, b-1-code-gate1-reviewer, b-1-code-gate2-architect; `fixture-s-regeneration-entry-point`: gate1-architect; `flush-crlf-field-rewrite`: gate1-architect; `geometry-points-cut`: gate1-reviewer; `geometry-types-beyond-polygons`: adr-034-gate1-architect, adr-034-gate2-reviewer; `governance-cut-state-cap-and-rotation`: gate1-architect, gate2-architect; `governance-decisions-pending-open-and-archive`: gate1-architect; `governance-f-tidy-repository-in-place`: gate1-architect, gate1-reviewer; `governance-hash-grammar-shared`: gate1-reviewer; `governance-plan-summaries-archive`: gate1-architect, gate1-reviewer, gate2-architect; `governance-search-ignore-historical`: gate1-reviewer; `governance-stop-hook-lease`: stop-hook-lease-gate1-reviewer†, stop-hook-lease-gate2-reviewer†; `governance-test-claims-superseded-followups`: test-claims-followups-gate3-reviewer†; `governance-weekly-proposals-2026-09-26`: governance-weekly-proposals-gate1-architect†; `guardian-v0`: gate2-architect; `kernel-close-during-open-admission`: gate1-architect; `kernel-generation-close-races`: gate1-architect; `kernel-ticket-liveness-redeem-wording`: ticket-liveness-redeem-gate1-architect, ticket-liveness-redeem-gate1-reviewer; `known-limitations-crs-epoch-edges-third-axis`: gate1-reviewer; `known-limitations-current-view-stale-box`: gate1-reviewer; `known-limitations-item-2-on-main-paragraph`: gate1-reviewer, gate2-reviewer; `module-docs-stale-statements`: gate1-architect, gate1-reviewer; `open-dataset-refuses-a-name-closed-during-admission`: gate1-architect; `proportional-gates`: gate1-architect; `publish-approval-ttl-ten-minutes`: gate1-architect, gate1-reviewer; `publish-attempt-lifecycle-src-tauri`: gate2-architect; `publish-sort-window-cancel-not-exercised-on-ci`: gate1-architect; `questions-mirror-item-count`: gate1-architect, gate1-reviewer; `round-mirror-pretooluse-hook`: round-mirror-hook-gate1-reviewer; `session-generation-other-recorded-mutations-name-no-commit`: gate1-reviewer; `shell-crs-form-for-format-default-contradicted`: gate1-architect, gate1-reviewer, gate2-reviewer; `shell-map-refill-after-resize`: gate1-architect, gate2-architect; `shell-migration-milestone-1`: gate1-architect, gate1-reviewer-attempt-2, gate1-reviewer; `shell-migration-milestone-2`: phase-a-gate1-architect, phase-b-gate1-architect, phase-b-gate1-reviewer, phase-b-gate2-reviewer; `shell-migration-milestone-3`: pr-a-gate1-architect, pr-a-gate1-reviewer, pr-a-gate2-architect, pr-b-gate1-reviewer; `shell-stale-frame-comments`: shell-stale-frame-and-layout-comments-gate2-reviewer; `skp-cancel-state-closed-set`: gate1-architect, gate1-reviewer; `skp-v0-live-sections-current-area-c`: gate1-reviewer, gate2-reviewer; `stale-assertion-messages-and-product-comments`: gate1-architect; `stale-test-names-and-comments`: gate1-architect; `stop-hook-stale-continuity`: gate1-reviewer, gate2-architect; `stream-evaluation-failure-fixed-detail`: gate2-reviewer; `subagent-write-audit-script`: gate3-architect; `test-claims-landedness-bound`: test-claims-landedness-gate1-reviewer; `test-claims-same-pr-superseded-pin`: test-claims-same-pr-pin-gate1-architect, test-claims-same-pr-pin-gate1-reviewer; `type-walk-null-literal-arithmetic`: gate1-reviewer; `verify-cites-out-of-range-line-count`: gate1-reviewer; `verify-cites-pin-resolution-and-line-zero`: gate1-architect, gate1-reviewer; `verify-cites-pinned-citations`: gate1-reviewer-attempt-2; `verify-quotes-round-item-cites`: gate1-architect; `walkthrough-row-f7-cli-refusal`: gate1-architect; `walkthrough-stale-cites-l5-degrees-p1`: gate1-reviewer; `watcher-first-read-on-watch-thread`: watcher-first-read-gate1-architect; `workspace-rustfmt`: gate2-reviewer

- **R43** (118 findings, 97 reports, 61 pieces) — `admitted-integer-overflow-silent-wraparound`: gate1-architect, gate1-reviewer; `adr-020-appended-note`: gate1-architect, gate1-reviewer; `adr-036-pre-acceptance-block`: gate1-architect, gate2-architect; `b1-close-nul-column-names`: a2-1-gate1-architect; `b1-engine-kernel-half`: gate2-reviewer; `b1-engine-kernel-half-followups`: gate1-architect; `b2-piece-1a-step-record-and-dataset-reference`: gate1-reviewer; `b2-piece-1b-recording`: gate1-architect, gate1-reviewer; `bundle-redaction-scan-not-in-product-publish`: gate2-architect; `claude-md-stale-facts`: gate1-reviewer; `connection-reuse-recycled-interrupt-flake`: gate1-reviewer; `corpus-reproducibility-record`: corpus-record-gate1-architect†, corpus-record-gate1-reviewer†; `covering-case-collision-binds-other-column`: gate1-architect, gate1-reviewer; `data-plane-crowded-start-detail-spaces`: gate1-architect; `data-plane-origin-non-ascii`: origin-non-ascii-gate1-architect†; `data-plane-terminal-without-credit`: gate1-architect, gate2-reviewer; `e2e-hover-establishing-read-stale`: gate1-architect; `e2e-stale-expectations-reaim`: gate1-reviewer; `engine-cancel-before-execute-siblings`: gate1-architect, gate2-architect; `engine-cancel-before-stream-window`: cancel-before-execute-gate1-reviewer; `engine-clause-composition-properties`: gate1-architect; `export-current-view-after-unreported-fit`: gate1-architect, gate1-reviewer; `exposure-profile-paths`: gate2-architect; `flush-crlf-field-rewrite`: gate1-architect, gate2-reviewer; `geometry-lines-cut`: gate1-architect; `geometry-types-beyond-polygons`: adr-034-gate2-reviewer; `governance-cut-state-cap-and-rotation`: gate1-reviewer, gate2-architect, gate2-reviewer, gate3-architect, gate3-reviewer; `governance-decisions-pending-open-and-archive`: gate1-architect, gate1-reviewer, gate2-architect; `governance-f-tidy-repository-in-place`: gate1-architect, gate1-reviewer; `governance-hash-grammar-shared`: gate1-reviewer; `governance-hash-ref-leading-dot-path`: gate1-reviewer; `governance-search-ignore-historical`: gate1-architect; `governance-test-claims-superseded-followups`: test-claims-followups-gate3-architect†; `guardian-v0`: gate1-architect, gate1-reviewer, gate2-architect, gate2-reviewer; `kernel-generation-close-races`: gate1-architect, gate1-reviewer; `known-limitations-crs-epoch-edges-third-axis`: gate1-reviewer; `module-docs-stale-statements`: gate1-architect, gate1-reviewer; `open-dataset-refuses-a-name-closed-during-admission`: gate1-reviewer; `publish-approval-ttl-ten-minutes`: gate1-architect; `publish-sort-window-cancel-not-exercised-on-ci`: gate1-reviewer; `shell-crs-form-for-format-default-contradicted`: gate1-reviewer; `shell-migration-milestone-1`: gate1-architect-attempt-2, gate1-reviewer-attempt-2, gate1-reviewer; `shell-migration-milestone-2`: phase-a-gate1-architect, phase-b-gate1-architect, phase-b-gate1-reviewer, phase-b-gate3-reviewer; `shell-migration-milestone-3`: pr-a-gate1-reviewer, pr-a-gate2-reviewer, pr-b-gate1-reviewer; `shell-status-bar-one-height`: gate1-reviewer; `skp-cancel-state-closed-set`: gate1-architect; `skp-drained-stream-helper-post-check-race`: gate1-architect, gate1-reviewer; `source-changed-post-reopen-routes-watcher-visible`: gate1-reviewer; `source-changed-post-route-s5d-race`: step-1-gate1-reviewer, step-2-gate1-reviewer; `stale-assertion-messages-and-product-comments`: gate1-reviewer; `stale-test-names-and-comments`: gate1-architect, gate1-reviewer; `stream-cancel-returns-left-unmarked`: gate1-architect; `stream-evaluation-failure-fixed-detail`: gate1-reviewer, gate2-architect, gate2-reviewer; `stream-fetch-overflow-fixed-detail`: gate1-reviewer; `stream-flush-cancel-exit-marks-producer-cancelled`: gate1-reviewer; `test-claims-same-pr-superseded-pin`: test-claims-same-pr-pin-gate2-reviewer; `timing-tests-assert-property-not-budget`: gate1-architect; `verify-cites-out-of-range-line-count`: gate1-reviewer; `walkthrough-row-f7-cli-refusal`: gate1-architect; `wording-block-rule`: gate1-architect, gate1-reviewer; `workspace-rustfmt`: gate1-architect, gate1-reviewer

- **R17** (109 findings, 84 reports, 49 pieces) — `admitted-integer-overflow-silent-wraparound`: gate1-architect; `b1-close-nul-column-names`: a2-1-gate1-architect; `b1-engine-kernel-half`: gate1-architect†, gate2-reviewer, gate3-reviewer; `b1-engine-kernel-half-followups`: gate1-architect; `b1-shell-half`: pr-a-gate1-reviewer, pr-c-gate2-architect, pr-c-gate2-reviewer; `b2-piece-1b-recording`: gate1-architect, gate1-reviewer, gate2-architect, gate2-reviewer; `bundle-redaction-scan-not-in-product-publish`: gate2-reviewer; `bundle-viewer-partition-offset-bounds`: partition-offset-bounds-gate1-architect†, partition-offset-bounds-gate2-architect†; `data-plane-stream-registry-bound`: stream-registry-bound-gate1-architect†; `engine-source-change-watcher`: source-watcher-gate1-architect†, source-watcher-gate1-reviewer†, source-watcher-gate2-architect†; `evidence-recorder-v0-1`: gate2-architect; `export-current-view-after-unreported-fit`: gate1-architect; `exposure-profile-paths`: gate1-architect, gate2-architect, gate3-reviewer; `exposure-scan-ci-backstop`: gate3-architect-reduction, gate3-reviewer; `fixture-s-regeneration-entry-point`: gate1-architect; `geometry-types-beyond-polygons`: adr-034-gate1-architect, gate1-reviewer; `governance-cut-state-cap-and-rotation`: gate1-reviewer; `governance-decisions-pending-open-and-archive`: gate1-architect, gate1-reviewer, gate2-architect; `governance-f-tidy-repository-in-place`: gate1-reviewer; `governance-plan-summaries-archive`: gate1-reviewer, s10-reviewer; `governance-stop-hook-lease`: stop-hook-lease-gate1-reviewer†; `governance-weekly-proposals-2026-09-26`: governance-weekly-proposals-gate1-architect†, governance-weekly-proposals-gate1-reviewer†, governance-weekly-proposals-gate2-architect†; `guardian-parity-git-timeout-under-load`: gate1-reviewer; `guardian-v0`: gate2-architect, gate2b-reviewer; `kernel-close-dataset-unknown-keeps-openrecord`: close-dataset-unknown-gate1-architect; `kernel-generation-close-races`: gate1-reviewer; `kernel-ticket-drop-followups`: gate2-architect; `kernel-ticket-liveness-redeem-wording`: ticket-liveness-redeem-gate1-architect, ticket-liveness-redeem-gate1-reviewer; `port-1-linux-l1`: gate2-architect; `proportional-gates`: gate1-architect; `publish-panel-rs-regex-layout`: gate1-reviewer, gate2-reviewer; `round-mirror-pretooluse-hook`: round-mirror-hook-gate2-reviewer; `session-generation-t1-t3-reobservation`: gate1-architect; `shell-map-refill-after-resize`: gate1-reviewer; `shell-migration-milestone-1`: gate1-architect, gate1-reviewer-attempt-2; `shell-migration-milestone-2`: phase-a-gate1-reviewer, phase-b-gate1-architect, phase-b-gate3-reviewer, phase-b-gate4-architect, phase-b-gate4-reviewer; `shell-migration-milestone-3`: pr-a-gate1-architect, pr-a-gate1-reviewer, pr-a-gate2-architect; `source-changed-post-route-s5d-race`: source-changed-s5d-inconclusive-gate1-architect; `stop-hook-stale-continuity`: gate1-architect, gate2-reviewer; `stream-cancel-returns-left-unmarked`: gate1-architect; `subagent-write-audit-script`: gate2-architect; `test-claims-landedness-bound`: test-claims-landedness-gate1-reviewer; `test-claims-same-pr-superseded-pin`: test-claims-same-pr-pin-gate1-architect, test-claims-same-pr-pin-gate1-reviewer, test-claims-same-pr-pin-gate2-architect; `timing-assertions-under-contention`: gate1-architect, gate1-reviewer; `type-walk-null-literal-arithmetic`: gate1-architect, gate1-reviewer, gate2-architect; `verify-cites-out-of-range-line-count`: gate1-reviewer; `verify-cites-past-end-bound`: gate1-reviewer; `verify-quotes-round-item-cites`: gate1-reviewer; `workspace-rustfmt`: gate1-reviewer

## 5. Data quality

- **Gate-log nodes absent from PLAN.yaml (15)**, lane `unmapped`, no form: `telegram-round-mirror`, `health-drives-metrics`, `autonomy-policy-2026-09-14`, `pre-gate-self-checks`, `adr-index-drift`, `adr-index-guard`, `flush-hardening`, `health-strip-honest`, `predicate-admission-fixture-race`, `pan-anchor-95`, `adr-035-acceptance`, `adr-034-acceptance-words`, `proportional-gates`, `wording-block-rule`, `recorder-retired`. Most are 2026-09-14/15 docs or tooling pieces gated before PLAN nodes were kept for them; `recorder-retired`, `proportional-gates`, `wording-block-rule`, `adr-034-acceptance-words`, `adr-035-acceptance` are docs PRs whose nodes were never added.
- **Nodes mapped by `evidence.branch`, not by id**: `governance-test-claims-superseded` → `governance-test-claims-superseded-scanner`.
- **PLAN nodes with no form found (19)** (`gate: none`, or a gate path outside `governance/forms/`): `release-artifacts-from-ci`, `site-bugs-first`, `self-check-false-readings`, `adr-029-g1-feasibility`, `drill-fix-release-only-guard`, `drill-fix-fixture-watchdog`, `drill-fix-viewer-build-order`, `governance-verify-gate-file-exists`, `known-limitations-owed-rows`, `governance-verify-mutation-header-token`, `engine-tests-configured-connections`, `shell-dependency-audit-piece`, `adr-021-023-b1-notes`, `fixture-regeneration-entry-point`, `adr-035-decision-4-note`, `test-claims-landedness-bound`, `wave2-b-admission-campaign-merge`, `known-limitations-items-51-52-render-numbers`, `autonomy-section-36-filler-slot`.
- **Forms shared by more than one node (4)** — the form's dates and budget apply to every node that names it: `governance/forms/engine/ADMISSION-PREREGISTRATION.md`, `governance/forms/engine/B1-PROJECTION-PREREGISTRATION.md`, `governance/forms/frontends/POLISH-87-88-89-PREREGISTRATION.md`, `governance/forms/frontends/SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md`.
- **Forms with no line-budget reading (24 pieces)**, size `unknown`: `polish-engine-lease-class`, `hover-confirming-marker`, `briefa-p3-p6`, `engine-extension-autoload-off`, `lod-tier-builder-route-b`, `briefa-p3b-owner-side-invalidation`, `briefa-p6-part-n-acceptances`, `briefa-p5-gate-tests`, `briefa-p4-corpus-run`, `crs-unit-fact-and-bounds`, `bundle-viewer-partition-offset-bounds`, `corpus-reproducibility-record`, `b1-engine-kernel-half`, `b1-close-nul-column-names`, `filter-bind-admission-implicit-coercions`, `type-walk-null-literal-arithmetic`, `data-plane-terminal-without-credit`, `b1-engine-kernel-half-followups`, `e2e-stale-expectations-reaim`, `source-changed-post-reopen-routes-watcher-visible`, `adr-036-pre-acceptance-block`, `adr-020-appended-note`, `walkthrough-stale-cites-l5-degrees-p1`, `adr-017-note-product-redaction-gate`. The budget is read by regular expression (`forms.py` `BUDGET_PATTERNS`); `pieces.csv` carries the matched text (`budget_text`) so each reading can be checked.
- **Budget read as 0** (records-only pieces by their Scope line): `timing-tests-assert-property-not-budget`.
- **Forms with no amendment heading naming the closing record or the merge (51 pieces)**: the last content commit on the form stands in (flagged `last content commit` in §2). The 2026-10-29 moves-only commit `a8ae51d9` (governance piece F, 188 renames) is skipped as a rename. Pieces: `engine-extension-autoload-off`, `lod-tier-builder-route-b`, `governance-record-round-count`, `briefa-p3b-test-names`, `governance-test-claims-superseded`, `briefa-p6-describe-fields`, `governance-audit-npm-trees`, `briefa-p6-n8-reopen-reset`, `adr-013-display-statement`, `governance-verify-mutation-multiline-attrs`, `crs-unit-fact-and-bounds`, `kernel-ticket-drop-under-registry-lock`, `governance-test-claims-withdrawn-marker`, `governance-hooks-cloud-inert`, `governance-stop-hook-lease`, `corpus-reproducibility-record`, `exposure-profile-paths`, `watcher-first-read-on-watch-thread`, `suites-and-toolchain-beyond-windows`, `publish-panel-rs-regex-layout`, `questions-mirror-t11-copy-glob`, `lead-data-pilot-setup`, `subagent-write-audit-script`, `claude-md-stale-facts`, `mods-readme-local-scope`, `e2e-hover-establishing-read-stale`, `skp-drained-stream-helper-post-check-race`, `wire-bytes-invariant-trace-flag-race`, `known-limitations-item-8-filter-not-published`, `stream-flush-cancel-exit-marks-producer-cancelled`, `filter-identity-alias-ambiguous-reached-through-skp`, `shell-stale-frame-comments`, `known-limitations-item-2-on-main-paragraph`, `crs-undeclared-message-wording`, `shell-map-refill-after-resize`, `ported-code-notice-route`, `module-docs-stale-statements`, `skp-v0-live-sections-current-area-c`, `shell-crs-form-for-format-default-contradicted`, `verify-quotes-round-item-cites`, `stale-assertion-messages-and-product-comments`, `walkthrough-row-f7-cli-refusal`, `questions-mirror-item-count`, `verify-cites-pin-resolution-and-line-zero`, `flush-crlf-field-rewrite`, `covering-case-collision-binds-other-column`, `verify-cites-reversed-range`, `engine-cancel-before-execute-siblings`, `walkthrough-stale-cites-l5-degrees-p1`, `verify-quotes-cite-listing-line-count`, `adr-017-note-product-redaction-gate`.
- **Form-closing date vs PR merge date differ by more than 3 days (1 pieces)** — a form that closes after the click, or a shared form, or a node whose PR is one of several: `corpus-reproducibility-record` (32 vs 1).
- **PLAN nodes without a PR in `evidence` (5)**: no PR-merge date; `{path}`, `{commit}`, `{branch}` or empty evidence.
- **Reports not attached to any gate-log entry (0)**: .
- **Reports sharing a gate-log row with another report (10)** (addenda, confirmations, a second gating of the same attempt, or an ADR-texts gate the log does not key separately): `2026-09-27-adr-034-gate4-reviewer.md`→row 251, `2026-09-27-b1-engine-kernel-half-gate3-reviewer.md`→row 247, `2026-09-27-test-claims-landedness-gate2-reviewer.md`→row 265, `2026-09-30-ticket-liveness-redeem-gate1-architect-confirmation.md`→row 295, `2026-10-02-exposure-scan-ci-backstop-gate3-architect-reduction.md`→row 319, `2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md`→row 345, `2026-10-02-workspace-rustfmt-i4-architect-ruling.md`→row 330, `2026-10-16-b2-piece-1b-recording-gate2-architect-addendum-test-cfg.md`→row 524, `2026-10-16-b2-piece-1b-recording-gate3-architect-addendum-group-calls.md`→row 526, `2026-09-26-stop-hook-lease-gate2-reviewer.md`→row 229.
- **Report verdict line disagrees with the gate-log verdict (41 of 464 compared)**: the gate-log verdict is used throughout; disagreements are mostly `PASS WITH NOTES` logged as `PASS` (or the reverse), a §22 table whose combined verdict is read from one row, or a scoped re-gate. List: `2026-09-27-b1-engine-kernel-half-gate3-architect.md` (report PASS WITH NOTES, log PASS), `2026-09-27-exposure-profile-paths-gate5-reviewer.md` (report PASS, log FAIL), `2026-09-30-cancel-before-execute-gate2-architect.md` (report PASS WITH NOTES, log PASS), `2026-09-30-close-dataset-unknown-gate3-architect.md` (report PASS WITH NOTES, log PASS), `2026-09-30-publish-refusal-src-tauri-gate1-architect.md` (report PASS WITH NOTES, log PASS), `2026-09-30-raw-path-refusal-code-gate1-architect.md` (report PASS WITH NOTES, log PASS), `2026-09-30-raw-path-refusal-code-gate2-architect.md` (report PASS WITH NOTES, log PASS), `2026-09-30-ticket-liveness-redeem-gate1-architect.md` (report PASS WITH NOTES, log PASS), `2026-10-01-audit-reader-char-boundary-gate2-architect.md` (report PASS WITH NOTES, log PASS), `2026-10-01-catalog-replace-note-gate2-architect.md` (report PASS WITH NOTES, log PASS), `2026-10-02-round-mirror-hook-gate2-reviewer.md` (report PASS WITH NOTES, log PASS), `2026-10-05-adr-034-acceptance-words-gate1-architect.md` (report PASS WITH NOTES, log PASS), `2026-10-05-compaction-record-and-resume-line-gate1-architect.md` (report PASS WITH NOTES, log PASS), `2026-10-05-proportional-gates-gate1-architect.md` (report PASS WITH NOTES, log PASS), `2026-10-06-geometry-types-beyond-polygons-gate1-architect.md` (report PASS WITH NOTES, log PASS) ….
- **Reports with no verdict line the parser reads (5)**: `2026-09-30-ticket-liveness-redeem-gate1-architect-confirmation.md`, `2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md`, `2026-10-02-workspace-rustfmt-i4-architect-ruling.md`, `2026-10-16-b2-piece-1b-recording-gate2-architect-addendum-test-cfg.md`, `2026-10-16-b2-piece-1b-recording-gate3-architect-addendum-group-calls.md`.
- **Gate-log entries with no report file (209)**: [('2026-09', 207), ('2026-10', 2)] — reports before 2026-09-26 were not filed as files (`AUTONOMY.md` §25 (b) dates the filing rule to round 25, 2026-09-26); their finding classes are unknown and those pieces show 0/0/0.
- **Reports using §22's three verdict classes: 317 of 469**; the rest (mostly before 2026-10-05) use S1/S2/N or free headings, kept as `blocking` / `should-fix` / `note`. Finding items are recognised by their bold id (`**C-1.**`, `**D2:**`, `**S2-1.**`, `**N-3.**`, `**B1.**`, `**F2**`, `**L3**`); prose findings without an id are not counted.
- **Gate-log verdicts outside PASS / PASS WITH NOTES / FAIL**: 1 `VOID` (row 540 `governance-cut-state-cap-and-rotation`); 1 `tester` gate entry (row 44).
- **Nodes whose gate-log attempts restart at 1 (9)** (a second sub-piece or PR under the same node; the first sequence decides first-pass): `briefa-p6-part-n-acceptances`, `briefa-p6-n8-reopen-reset`, `governance-verify-mutation-multiline-attrs`, `crs-unit-fact-and-bounds`, `engine-source-change-watcher`, `geometry-types-beyond-polygons`, `publish-refusal-codes-and-attempt-lifecycle`, `shell-migration-milestone-2`, `b1-shell-half`.
- **Record rounds**: `record: true` was applied retroactively on 2026-09-18 for earlier records (`scripts/plan/README.md:281-286`); the tag is the custodian's hand-set predicate, not a derivation.
- **Rule classification** is by regular expression over each finding's text (`rules.py`), read against a hand sample; a finding that names a rule it did not break (e.g. 'the sibling search found nothing') is still counted under that rule, and a Correctness finding on a plain logic defect cites no rule. The `rules` column of `findings.csv` lets the maintainers re-read any row.
- **The 'ten before / ten after E1' measure** cannot be completed: E1 has not merged at this commit (PLAN node `governance-e-readings` is the current piece-E node in `governance/CUSTODIAN-QUEUE.md:31`); §3f gives the 'before' half as the ten most recent pieces.
=== END ===

-----

