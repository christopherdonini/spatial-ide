# PRECEDENTS — generalised rulings, checked before any question is raised

The rule (`AUTONOMY.md` §8, verbatim):

> Generalised rulings, each: id, the ruling **verbatim** with its date and DECISIONS-PENDING entry,
> the generalisation (one sentence), its scope and limits, the cases it has been applied to. Seeded
> from Amendment 1's delegation matrix (§B) and the RULED blocks of 2026-09-11 and 2026-09-13.
> **Checked before any question is raised; a matching precedent is cited (ledger + queue), not
> asked.** Adding a precedent is a docs change the custodian may make **only** by quoting an
> existing ruling; generalising beyond the ruling's words is a question, not a precedent.

Each entry below: id · the ruling verbatim, dated and sourced · the generalisation (one sentence) ·
scope and limits · applied-to. Entries P-001–P-016 are seeded from `AI_DEVELOPMENT.md` Amendment 1
§B's delegation matrix (one entry per delegated class and per always-the-human class, per
`AUTONOMY.md` §8's seeding instruction); P-017–P-022 from the RULED blocks of 2026-09-11 and
2026-09-13 in `DECISIONS-PENDING.md`; P-023–P-028 from `CLAUDE.md`'s non-negotiables digest;
P-029–P-032 from `AI_DEVELOPMENT.md`'s "Red lines" section — the two groups (P-007–P-016 and
P-029–P-032) name the same standing rules from two different canonical locations (the matrix line
that restates them, and the Red lines section itself); they are cross-referenced, not double
authority. P-033 is from the human's second directive of 2026-09-13, carried verbatim in
`AUTONOMY.md` Appendix A2 on this branch.

## Delegated classes (source: `AI_DEVELOPMENT.md` Amendment 1 §B, "Delegated to gates + custodian")

### P-001 — Mechanical closure under §A

**Ruling (verbatim, `AI_DEVELOPMENT.md:416`, Amendment 1 §B):** "Mechanical closure under §A."

**Generalisation:** A piece closed under Amendment 1 §A's bounded-closing-attempt rule is a
delegated closure, reported, never queued for a ruling.

**Scope and limits:** Only pieces meeting §A's three conditions (every applicable gate has affirmed
the design; every remaining item is record-only or mechanically verifiable; nothing touches
behaviour, a guarantee, authority, scope, or a property under test). Not a licence to close anything
merely because it is the second failed attempt — §A's own conditions still gate it.

**Applied to:** Not yet applied under this piece; Amendment 1 §A itself records its origin (entries
61, 64, 65, 67, per its Context).

### P-002 — Wording that follows the ruled standard

**Ruling (verbatim, `AI_DEVELOPMENT.md:417-420`, Amendment 1 §B):** "**Wording that follows the
ruled standard** — a string asserts only what the system did or verified; absent is stated, never
omitted; no wire-level claims in UI text; no durations (ADR-018); no perf words. The human sights
strings only when a **new state** is introduced, never for new wording of an existing state."

**Generalisation:** New wording for an already-ruled UI state is delegated; a genuinely new state
still needs the human's sight.

**Scope and limits:** Applies to UI/status strings only, and only where the underlying state is not
new. Does not cover docs/08-normative claims (those are always the human's, P-014).

**Applied to:** Not yet applied under this piece.

### P-003 — Formatting, citation, line-number and tense nits

**Ruling (verbatim, `AI_DEVELOPMENT.md:421`, Amendment 1 §B):** "Formatting, citation, line-number
and tense nits: fixed in sweeps, never queued."

**Generalisation:** Mechanical text nits (formatting, citation accuracy, line numbers, tense) are
fixed directly, never raised as a question.

**Scope and limits:** Only where the fix changes no claim's substance — a citation correction that
also changes what is being asserted is not a nit.

**Applied to:** Not yet applied under this piece.

### P-004 — Test re-aims that encode an already-ruled contract

**Ruling (verbatim, `AI_DEVELOPMENT.md:422`, Amendment 1 §B):** "Test re-aims that encode an
already-ruled contract: reported with the ruling cited."

**Generalisation:** A test changed to match a contract the human has already ruled on is a
delegated closure, reported with the ruling's citation, not re-asked.

**Scope and limits:** The ruling must already exist and be cited; a re-aim that would need a new
ruling (a changed contract, not merely an encoding of an old one) is not covered. See also P-021,
which restates this for a specific case (entry 80).

**Applied to:** Not yet applied under this piece.

### P-005 — CI, watcher, hygiene and tooling mechanics

**Ruling (verbatim, `AI_DEVELOPMENT.md:423`, Amendment 1 §B):** "CI, watcher, hygiene and tooling
mechanics (eol pins, hooks, watchers)."

**Generalisation:** Fixes to CI configuration, watcher scripts, and repository hygiene tooling
(line-ending pins, git hooks, check watchers) are delegated.

**Scope and limits:** Tooling and hygiene only — not a licence to add a dependency or change what a
gate checks for (those stay red-line/escalated).

**Applied to:** Not yet applied under this piece.

### P-006 — Escalation triggers

**Ruling (verbatim, `AI_DEVELOPMENT.md:425-426`, Amendment 1 §B):** "**Escalate to the human when:**
authority is missing; a product decision is needed; a guarantee changes; user-visible behaviour
changes; or a §A closing attempt fails."

**Generalisation:** Any of these five conditions ends delegation and routes to the human, regardless
of how small the remaining work looks.

**Scope and limits:** This is the boundary condition for every other delegated-class precedent
(P-001–P-005): none of them apply once one of these five triggers is true.

**Applied to:** Not yet applied under this piece.

## Always-the-human classes (source: `AI_DEVELOPMENT.md` Amendment 1 §B, "Always the human (red lines, unchanged)")

The matrix line (verbatim, `AI_DEVELOPMENT.md:410-413`, Amendment 1 §B): "**Always the human (red
lines, unchanged):** ADR statuses and amendments; preregistered gate pass/fail rulings; walkthrough
evidence and felt verdicts; new exposure surfaces and public exposure; dependency changes; history
rewrites; security posture; docs/08 normative rows; scope changes to a ruled item; any change to
user-visible behaviour not already ruled." Each clause below is one class from that sentence, each
its own precedent, the same source line.

### P-007 — ADR statuses and amendments

**Generalisation:** No custodian action ever changes an ADR's status or amends it.

**Scope and limits:** Matches Red lines bullet 1 (P-029) exactly; the two entries are the same rule
recorded in two places.

**Applied to:** Not yet applied under this piece.

### P-008 — Preregistered gate pass/fail rulings

**Generalisation:** A gate's pass/fail verdict on a preregistered instrument is never the
custodian's to render.

**Scope and limits:** Distinct from mechanical closure (P-001), which requires the gate to have
already affirmed the design.

**Applied to:** Not yet applied under this piece.

### P-009 — Walkthrough evidence and felt verdicts

**Generalisation:** Operator-verification (walkthrough) evidence and any `felt_verdict: true` node
are accepted as passed only by the human.

**Scope and limits:** Matches Red lines bullet 3 (P-031) and `PLAN.yaml`'s own `felt_verdict` field
rule (`AUTONOMY.md` §1).

**Applied to:** Not yet applied under this piece.

### P-010 — New exposure surfaces and public exposure

**Generalisation:** Opening a new exposure surface, or any change to public exposure, is never
delegated.

**Scope and limits:** Covers both code (new attack/exposure surface) and repository-level exposure
(visibility, publication).

**Applied to:** Not yet applied under this piece.

### P-011 — Dependency changes

**Generalisation:** No dependency is added or changed without the human.

**Scope and limits:** Matches `AUTONOMY.md`'s own repeated statement that "dependency additions are
the human's" (§1) and "any dependency proposal comes to me" (Appendix A, the seeding paragraph).

**Applied to:** Not yet applied under this piece.

### P-012 — History rewrites

**Generalisation:** No history rewrite (force-push, rebase of shared history) is ever delegated.

**Scope and limits:** Matches Red lines bullet 4's "history rewrites and force-pushes" (P-032).

**Applied to:** Not yet applied under this piece.

### P-013 — Security posture

**Generalisation:** No change to security posture is delegated.

**Scope and limits:** Undefined further by the matrix line itself; read narrowly until a ruling
narrows or widens it.

**Applied to:** Not yet applied under this piece.

### P-014 — docs/08 normative rows

**Generalisation:** No docs/08-normative row (a performance budget or measurement definition) is
added or changed by the custodian.

**Scope and limits:** Matches Red lines bullet 2's "anything docs/08-normative" (P-030) and
`CLAUDE.md`'s "Perf claims require measurements" non-negotiable (P-026).

**Applied to:** Not yet applied under this piece.

### P-015 — Scope changes to a ruled item

**Generalisation:** Once the human has ruled an item's scope, widening or narrowing it again is a
new question, not a custodian action.

**Scope and limits:** A `generation` bump on a node (`AUTONOMY.md` §15) is the mechanical trace of
this rule firing.

**Applied to:** Not yet applied under this piece.

### P-016 — User-visible behaviour changes not already ruled

**Generalisation:** Any change to user-visible behaviour is the human's, unless that exact change
has already been ruled.

**Scope and limits:** The wording-only exception (P-002) is the one carve-out: new wording of an
*already-ruled* state is delegated; a *new* state is not.

**Applied to:** Not yet applied under this piece.

## From the RULED blocks of 2026-09-11 and 2026-09-13 (`DECISIONS-PENDING.md`)

### P-017 — Signed-off-by must be a human identity

**Ruling (verbatim, `DECISIONS-PENDING.md:16`, RULED 2026-09-11):** "Signed-off-by must be a human
identity — remediate on branches if needed, fix the worker command."

**Generalisation:** Every commit's `Signed-off-by` trailer names a human identity, never a model or
agent; the model name belongs only in `Co-Authored-By`.

**Scope and limits:** Commit trailers only. Applies to every commit the custodian or a worker
produces, in any worktree.

**Applied to:** Verified on all 20 branch commits at the time of the ruling (per the same RULED
block's "Applied by the custodian" line); this piece's own commits follow it (`git commit -s` with
the repo's configured human identity).

### P-018 — A status that understates completeness does not justify RC3

**Ruling (verbatim, `DECISIONS-PENDING.md:8`, RULED 2026-09-13 (later), entry 87):** "a status that
understates completeness does not justify RC3."

**Generalisation:** A user-facing status line that is honest but incomplete (states a limit rather
than claiming full coverage) is acceptable release text on its own; it does not, by itself, force
another release-candidate rebuild.

**Scope and limits:** Specific to the choice between shipping a truthful, conservative status
sentence and forcing an RC3 rebuild for a wording-only reason; does not excuse a status that is
actually false.

**Applied to:** Entry 87's M15 zoom-out sentence (RC2).

### P-019 — Nothing merges to main before the tag except docs

**Ruling (verbatim, `DECISIONS-PENDING.md:10`, RULED 2026-09-13, entries 83-86/M13/RC2):** "Freeze
restated: nothing merges to main before the tag except docs."

**Generalisation:** During a release freeze, `main` accepts documentation-only merges; every other
change lands on the release branch.

**Scope and limits:** In force only during a declared release freeze (the tag-preparation window);
"restated" in the ruling's own words, so it is not a new rule, only a repeated one — check for an
active freeze before citing it.

**Applied to:** The v0.1.0 release branch (`release/0.1.0`) and RC2.

### P-020 — No code-signing before a release tag; a named post-tag evaluation order

**Ruling (verbatim, `DECISIONS-PENDING.md:16`, RULED 2026-09-11, entry 77):** "77: sign nothing for
v0.1.0; post-tag evaluate SignPath OSS first, Certum second."

**Generalisation:** A release ships unsigned rather than delaying for a signing decision; the
signing question is evaluated afterward, in the stated order.

**Scope and limits:** Named for v0.1.0 specifically; whether it extends to v0.1.1 and beyond is not
settled by this ruling's own words — entry 90 (DECISIONS-PENDING, static CRT/licence question) is
already a separate, later question on adjacent ground, not covered by this precedent. Treat as
scoped to v0.1.0 unless a later ruling extends it.

**Applied to:** v0.1.0 (recorded in the post-tag code-signing note, per the same RULED block).

### P-021 — A test re-aim must name the ruling and assert the new provenance class

**Ruling (verbatim, `DECISIONS-PENDING.md:16`, RULED 2026-09-11, entry 80):** "80: (a), each
re-aim naming the ruling AND asserting the new provenance class."

**Generalisation:** When a test is re-aimed to encode a ruling, the re-aim must both cite the
ruling and assert the new provenance class it establishes — citing the ruling alone is not enough.

**Scope and limits:** This sharpens P-004 (Amendment 1 §B's "test re-aims … reported with the
ruling cited") with a second, additional requirement (the provenance-class assertion) that P-004's
own words do not state. It does not stand alone as a wider rule about all test re-aims — only
those establishing provenance, entry 80's own subject.

**Applied to:** Entry 80's own re-aims (the Brief A batch, per the same RULED block).

### P-022 — Rule-7 accounting, once reported, stands unless corrected

**Ruling (verbatim, `DECISIONS-PENDING.md:10`, RULED 2026-09-13, entries 83-86/M13/RC2):** "Rule-7
accounting on 47: your reading stands."

**Generalisation:** A custodian-reported Rule-7 attempt count is accepted as the record once the
human has seen it and not corrected it.

**Scope and limits (low confidence — flagged, not withheld):** This is a single confirmation of a
single count (entry 47's), not a stated general policy about Rule-7 accounting; the generalisation
above goes slightly beyond the ruling's four words, closer to "a question, not a precedent" per
`AUTONOMY.md` §8's own caution. Cite with that caveat, or re-ask rather than rely on it for a
disputed count.

**Applied to:** Entry 47's Rule-7 count only.

## From `CLAUDE.md`'s non-negotiables digest (standing rules, rulings of the human)

### P-023 — Never block the canvas

**Ruling (verbatim, `CLAUDE.md:12`):** "Never block the canvas: every operation cancellable,
streaming, progress-reporting."

**Generalisation:** No operation — including anything this work system automates — may block
interaction; long-running custodian/worker actions stay cancellable and progress-reporting in
spirit (the Stop hook's own continuation caps and budget rule, §C, are one such application).

**Scope and limits:** A product-code rule first; its application to tooling (the work system itself)
is this document's own extension, not the rule's original scope.

**Applied to:** Product code throughout; by extension, the Stop hook's continuation caps (§C).

### P-024 — CRS is a type; no silent conversion

**Ruling (verbatim, `CLAUDE.md:13`):** "CRS is a type. Analytical reprojection is an explicit
operation; display reprojection only via a visible view transform. No silent conversion — proven for
EPSG:2056 natively on Windows/WebView2 by the concluded ADR-003 spike; macOS/Linux still need their
own hardware validation before the same claim holds there."

**Generalisation:** No code path silently reprojects; every reprojection is explicit and, for
display, visibly a view transform.

**Scope and limits:** Product/renderer code; not applicable to the governance tooling this piece
adds.

**Applied to:** Not applicable to this piece's own deliverables.

### P-025 — No JSON on data hot paths; never claim "zero-copy"

**Ruling (verbatim, `CLAUDE.md:14`):** "No JSON on data hot paths. Binary, chunked, backpressured,
**copy-minimized** — never claim "zero-copy" (ADR-004)."

**Generalisation:** Data hot paths stay binary, chunked and backpressured; "zero-copy" is never the
claim, "copy-minimized" is.

**Scope and limits:** Product data-plane code; not applicable to this piece's docs-only work.

**Applied to:** Not applicable to this piece's own deliverables.

### P-026 — Perf claims require docs/08 measurements; no numbers, no claim

**Ruling (verbatim, `CLAUDE.md:15`):** "Perf claims require measurements against docs/08 (p50/p95,
defined datasets). No numbers, no claim."

**Generalisation:** No performance number appears anywhere — release text, PRECEDENTS.md entries,
the landing page, or this piece's own report — without a docs/08 measurement behind it.

**Scope and limits:** Applies repo-wide, including release artefacts (`RELEASE-DAY-CHECKLIST.md`'s
own "Never on release day" section restates it for the tag moment) and this task's own instruction
("no performance claims").

**Applied to:** This piece's own report (no performance numbers included); `AUTONOMY.md` §5's
landing-page generator, which "refuses a node whose `summary` or `title` contains a duration, rate
or percentage" without a `measurement` pointer.

### P-027 — Undo is classed

**Ruling (verbatim, `CLAUDE.md:16`):** "Undo is classed (ADR-006): pure transforms replay; workspace
mutations are transactional; external side effects are approval-gated, never called undoable."

**Generalisation:** Every undoable action is one of three named classes; nothing is called
"undoable" if it is actually an approval-gated external side effect.

**Scope and limits:** Product undo/history system; not applicable to this piece.

**Applied to:** Not applicable to this piece's own deliverables.

### P-028 — Plain text everywhere

**Ruling (verbatim, `CLAUDE.md:17`):** "Plain text everywhere: project files, styles, configs are
diffable text."

**Generalisation:** Project files, styles and configs (and, by the same reasoning, this work
system's own `PLAN.yaml`, `PRECEDENTS.md` and generated queue) stay plain, diffable text — never a
binary or opaque format.

**Scope and limits:** The extension to the work system's own files is this document's reading, not
a separate ruling; `AUTONOMY.md` §1 independently requires `PLAN.yaml` to be a "declared YAML
subset" for the same reason.

**Applied to:** `PLAN.yaml`'s format choice (`AUTONOMY.md` §1); this file's own format.

## From `AI_DEVELOPMENT.md`'s "Red lines" section

### P-029 — ADR status changes, OPEN-block resolutions, acceptance conditions

**Ruling (verbatim, `AI_DEVELOPMENT.md:44`):** "ADR status changes (accept/reject/amend), OPEN-block
resolutions, acceptance conditions."

**Generalisation:** Same as P-007; recorded here from the Red lines section itself rather than
Amendment 1's restatement of it.

**Scope and limits:** See P-007.

**Applied to:** Not yet applied under this piece.

### P-030 — Gate approvals

**Ruling (verbatim, `AI_DEVELOPMENT.md:45-46`):** "Gate approvals: the ADR-017 exposure-surface
review, preregistration overrides, budget-wording changes, anything docs/08-normative."

**Generalisation:** Same family as P-008/P-014; recorded here from the Red lines section itself.

**Scope and limits:** See P-008 and P-014.

**Applied to:** Not yet applied under this piece.

### P-031 — Accepting operator-verification evidence as passed

**Ruling (verbatim, `AI_DEVELOPMENT.md:47`):** "Accepting operator-verification evidence
(walkthroughs) as passed."

**Generalisation:** Same as P-009; recorded here from the Red lines section itself.

**Scope and limits:** See P-009.

**Applied to:** Not yet applied under this piece.

### P-032 — Visibility, ADR-009-adjacent matters, unnamed dependency additions, history rewrites and force-pushes

**Ruling (verbatim, `AI_DEVELOPMENT.md:48-51`):** "Making the repository public (or any other
visibility change — the line stands; note, dated 2026-09-07: the repository has in fact been public
since 2026-08-03, the human's own act, which never entered the record until then); anything
ADR-009-adjacent; dependency-tree additions not named in a brief; history rewrites and
force-pushes."

**Generalisation:** Same family as P-010/P-011/P-012; recorded here from the Red lines section
itself, including the corrigendum that the visibility line held in the rule even when it did not
hold in fact for a period before 2026-09-07.

**Scope and limits:** See P-010, P-011, P-012. The corrigendum is itself a precedent for how a
gap between a stated rule and the facts is recorded (as a dated note, not a rewrite) — noted here,
not spun into a separate entry, since generalising it further would go beyond this ruling's own
words.

**Applied to:** The 2026-09-07 corrigendum to the repository's own visibility history.

## From the human's second directive (2026-09-13; `AUTONOMY.md` Appendix A2)

**Provenance note:** the human issued a second directive on 2026-09-13, after the one
`AUTONOMY.md` Appendix A records. It is carried verbatim, on this branch, in `AUTONOMY.md`
Appendix A2 ("the second directive, verbatim as received … the custodian's deduplicated reading is
items 16–20"); `main` separately carries the ledger's own move (`state/`) at commit `252585b` — see
`AI_DEVELOPMENT.md` Amendment 2 §M.

### P-033 — A Dependabot patch-bump precedent for the custodian

**Ruling (verbatim, `AUTONOMY.md` Appendix A2, item 20):** "Dependabot alerts; a patch-bump
precedent for the custodian."

**Generalisation:** The custodian may merge a Dependabot patch-level dependency bump when CI is
green.

**Scope and limits — CONFIRMED by the human on 2026-09-14 (the verbatim scope follows the paragraph below); not yet exercised:** A dependency change is
otherwise always the human's (P-011, P-014's neighbour in the Red lines list, and Amendment 1 §B's
matrix). This ruling's own four words ("a patch-bump precedent for the custodian") do not themselves
define "patch-level," do not say whether a lockfile-only bump or a manifest bump, and do not say
whether CI green is sufficient on its own or merely necessary. The generalisation above is the
narrowest reading consistent with the words ("patch-bump," "for the custodian," implying automatic
merge authority scoped to Dependabot's own patch-level PRs) — it is marked to be confirmed rather
than treated as settled, and no dependency bump should be merged under it without checking
`DECISIONS-PENDING.md` for a confirming ruling first.

**Confirmed scope — the human, 2026-09-14 (`DECISIONS-PENDING.md`, RULED 2026-09-14 question set C, C4), verbatim:** *"Patch-level means: a semver patch of a direct dependency, or a lockfile-only bump of a transitive one — a bump that introduces any NEW crate or package into the lockfile is not patch-level and comes to me. CI green is necessary, not sufficient: the licence audit must show no licence change, the notice generator's output must be regenerated and checked, and the lockfile diff must be read for new entries. Dependabot security patches count if they meet the above and merge without waiting; they are announced in the same window's report and flagged; a security fix that is minor or major comes to me immediately via the alert channel. Non-security bumps are batched weekly in one PR. Any crate or package named in a preregistration's pins — measurement instruments, the transport bake-off crate, pinned tooling — is never bumped under this precedent: a dependency bump cannot silently change a measured artifact."*

**Boundary rider — the human, 2026-09-19 (`DECISIONS-PENDING.md` RULED entry 115 (c)) and 2026-09-20 (the sitting-day ruling), verbatim from the first:** *"npm audit's severity is an input, not the ruling — reachability decides urgency."* And from the second: *"reachability-not-severity recorded as the P-033 boundary's precedent."* **Generalisation:** whether a vulnerable package is dev-only/build-only or ships (by the notice generators' own shipped-set definition) decides how urgently a fix is pursued; the advisory's severity label never does. A shipped advisory is fixed first at any severity; a dev-only one follows in the same piece; patch-level bumps land under this precedent, anything minor or major or introducing a new package comes to the human with the lockfile diff and the licence check.

**Applied to:** the shell's five npm advisories and the viewer's one, 2026-09-19 (entries 115-116): all six dev-only or build-only, no patch-level fix available, every fix major — routed to the human, ruled 2026-09-20 as one gated dependency piece (PR #97).
