# Governance piece F: a tidy repository, in place: preregistration (full form)

*Committed before any code. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node governance-f-tidy-repository-in-place, the governance lane, the full form with both gates and the human's click, by the human's direction (`state/directives/2026-10-28-governance-piece-f-a-tidy-repository-in-place.md`). Its sections and its OPEN items are the architect's draft (`state/consults/2026-10-28-governance-f-tidy-repository-in-place-form-architect-draft.md`, read only at main 79476279; its sha256 from line 5 is b547f2be6aec66a33f2ae482873e35caca037034c0412502113ab8ed5d574755), carried byte for byte with these changes, all the custodian's: each cite read at 79476279 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a path starting with a dot, and a root file whose name the tree holds more than once, as `path:line` at <commit>, sha256 <hex>; 1 such): the cites the draft marks, every cite on a line before that line's last marker, and every cite written with a file name that resolves to one tracked path (35 pins; 2 by a bare or partial name; 8 line numbers bound to the path before them; 0 left as written), and a whole file cited at 79476279 given the full commit id (1 such), as is main at 79476279 (1) and every other marker the draft writes in prose (1); T17's row in section 4 and the Guardian test row in section 2.2 not carried, under the human's OPEN-9 (B); this lead line added; the draft's section 10 heading moved after the OPEN items and the settlement. Every pin is historical: for the code, the move commit's parent is authoritative. Form path: `scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md`, as the draft's Header proposes. The custodian keeps the PLAN node on main.*

## Header

- **Authority.** The PLAN node `governance-f-tidy-repository-in-place`, under the human's direction `state/directives/2026-10-28-governance-piece-f-a-tidy-repository-in-place.md` @ 79476279e2556044b1fee399d0433372aca68576. Its goal is at lines 9 to 12, items 1 to 7 at lines 14 to 31, and the out-of-scope line at line 33. The direction is cited by line and paraphrased here, never quoted.
- **Drafted by** the architect agent on the custodian's brief, reading `main` @ 79476279e2556044b1fee399d0433372aca68576. The inputs are two lists made by script at that commit: `git ls-tree --name-only 79476279` (59 root entries) and `git ls-files '*PREREGISTRATION*.md'` (176 files). The architect has no shell. Every `path:line @ 79476279` below is expanded with its sha256 by the custodian's script before this form is committed.
- **Proposed path of this form:** `scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md`, where governance-lane forms live today. The move commit moves it by the same rule as every other form (§2.1, rule R).
- **Committed before any code.** It is append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **PLAN:** the node carries `merge: merge-commit`. The move commit must stay reachable from main as a commit, because MOVED.tsv names it (§8 item 5).

## §0. Disclosure

- No pilot and no spike were run. Everything below is a read of `main` @ 79476279e2556044b1fee399d0433372aca68576. Hypotheses are labelled, and each names its discriminator.
- **H1.** Today, verify-quotes resolves a hash reference's path in the current tree before it reads the reference's rev (`scripts/plan/verify-quotes.mjs:775-787 @ 79476279e2556044b1fee399d0433372aca68576 sha256:ac86d182bc0ac11ace07db511b189d3c7dc040a95b2914ff1fb3a1868b65d626`). After the move, a pinned hash reference to a moved form would resolve to the new path, and `git show <old rev>:<new path>` would fail. Discriminator: T8.
- **H2.** verify-cites' suffix resolver (`scripts/plan/verify-cites.mjs:218-226 @ 79476279e2556044b1fee399d0433372aca68576 sha256:756533531cfd11e6e8afc4d4049f2b35d428f74146a05195b6be1dcc8ed8619f`) would silently resolve an old rooted path whenever the new path ends with it. Under OPEN-3 (A) that is every `engine/` and `kernel/` form. So the move-map lookup must come before the suffix tier. Discriminators: T1, T2 and T3.
- **H3.** Three scripts derive `site/` from PLAN.yaml's own folder: `scripts/plan/verify.mjs:320 @ 79476279e2556044b1fee399d0433372aca68576 sha256:69acd770641affcc805479500ce8159c6f2b702a43fe111d492698f17997cc5e`, `scripts/plan/site.mjs:920 @ 79476279e2556044b1fee399d0433372aca68576 sha256:65f67b6185eebe7af48e5d22f8695910557f36d1cab7fa9493cb8f104f303883` and `scripts/plan/health.mjs:272 @ 79476279e2556044b1fee399d0433372aca68576 sha256:568cf403adc8b7b2830c517b84d35deb793409e676a89bd794d712f40a603832`. Left as they are, the generator would write `governance/site/` while Pages uploads `site` (`.github/workflows/pages.yml:62-66` at 79476279e2556044b1fee399d0433372aca68576, sha256 04376bb3345f08980dc8db5bd7f8ba79f435b5157471c85b82a615d3a54c4078), so a stale site would publish. Discriminator: T16.
- **H4.** When PLAN.yaml is missing, the Stop hook allows without comment (`scripts/hooks/stop-queue.mjs:74 @ 79476279e2556044b1fee399d0433372aca68576 sha256:eee8560dcce762498b821ae40f8bca7098792ce9c2df0afd22f332a6940851bb`, `scripts/hooks/stop-queue.mjs:355 @ 79476279e2556044b1fee399d0433372aca68576 sha256:8d0abca490ff3267f54930dfec5193e0475330ee7c3748bafbdc4d4438862a97`). A Stop-hook pass is therefore no proof unless the hook reached the plan. Discriminator: T14.
- **Frozen script.** `scripts/plan/measure-reads.mjs` is frozen by `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:133 @ 79476279e2556044b1fee399d0433372aca68576 sha256:a0c3d948bea1eb14f0c821a84dc8ccbc44f497f37e6ad3e9710fab5827f8ecd3`, `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:138 @ 79476279e2556044b1fee399d0433372aca68576 sha256:bd3b983969802d96d34df22fd06b3ed958566bf24cfebd3cd310a21b8d1601b3`, `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:140 @ 79476279e2556044b1fee399d0433372aca68576 sha256:ce4b9cf96f902260ea5832f64cecc9481cbb7545782ad9c423fdf6be82caf5b0` and `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:142 @ 79476279e2556044b1fee399d0433372aca68576 sha256:c8e04f0ca0746cd4277ee251214c4de0ac522507c20179067e1c858cd9919846`. Its section 2 items 7(a), 7(c) and 7(e) cover the script's bytes, its `DECISIONS-PENDING.md` anchor and `.ignore`'s five lines. This piece must touch all three (OPEN-2).
- **Licence layers follow paths.** `LICENSES/README.md:22-23 @ 79476279e2556044b1fee399d0433372aca68576 sha256:fd66a3e47d81277ae914df4440b60d229cfff4f9965b991e6d9e5053a15dd233` puts `docs/` under CC-BY-4.0 and every other source file under the core licence. A move into or out of `docs/` therefore changes a file's licence, which is a red line. No row of §2.1 crosses that boundary (OPEN-1, OPEN-4).
- **Fixture drive:** none. This piece measures against no fixture.

## §1. What this preregistration may and may not claim

- **It may claim:**
  - the move commit holds renames only (R100 on every line, every blob id unchanged);
  - each moved file's history is reachable by `git log --follow`;
  - the listed checks give the same results before and after, as §5 defines "the same";
  - the counts of §6.
- **It may not claim:**
  - any performance figure or `docs/08` row (the counts in §6 are counts, not budgets);
  - any wire change, ADR amendment, licence-layer change, history rewrite or visibility change;
  - any change to product behaviour;
  - that GitHub's web history or blame follows the renames (not tested).
- **Wording:** the README's words are the human's, approved in the PR (item 6).

## §2. The change, stated before it is applied

### 2.1 The mapping table (the direction, item 1)

**Rule R.** The table is R's output at 79476279. At the move commit's parent P, the script re-derives the table. Any form added since 79476279 gets its row from R, and the PR body lists those rows. This section authorises those rows in advance. If R cannot produce a row (a new root entry, or a form in a folder R does not name), the move stops and the case goes to the human.

What R does:
- A form under a code folder goes to `governance/forms/<first path segment>/`, with its basename unchanged.
- A root form goes to `governance/forms/root/`.
- Under `state/`, and on OPEN-1's two exact paths, a file stays.
- Every moved file keeps its basename.

Rows: 44 non-form root entries (13 move, 31 stay) and 176 forms (173 move, 3 stay), 220 rows in all. The 15 root forms are root entries too; each is listed once, in the forms table, which makes 59 root entries. Renames in the move commit: 186.

**Root entries (44)**

| Root entry | New path | Reason |
|---|---|---|
| `.cargo` | stays | dotfile, read by cargo |
| `.claude` | stays | dotfile; Claude Code reads it here |
| `.cut-archive` | stays | dotfile; it holds the old-path pointer for ADR cites and the probe the SEARCH-IGNORE form's section 2 item 7(f) keeps |
| `.git-blame-ignore-revs` | stays | dotfile, read by git and GitHub |
| `.gitattributes` | stays | dotfile, tool |
| `.githooks` | stays | dotfile, the hooks path |
| `.github` | stays | dotfile; GitHub reads it here |
| `.gitignore` | stays | dotfile, tool |
| `.ignore` | stays | dotfile; ripgrep reads it at the root (one line changes in the paths commit) |
| `AI_DEVELOPMENT.md` | `governance/AI_DEVELOPMENT.md` | how the work is run |
| `AUTONOMY.md` | `governance/AUTONOMY.md` | how the work is run |
| `CLAUDE.md` | stays | Claude Code reads it at the root |
| `CONTRIBUTING.md` | stays | for contributors |
| `CUSTODIAN-QUEUE.json` | `governance/CUSTODIAN-QUEUE.json` | the generated queue |
| `CUSTODIAN-QUEUE.md` | `governance/CUSTODIAN-QUEUE.md` | the generated queue |
| `Cargo.lock` | stays | tool |
| `Cargo.toml` | stays | tool |
| `DCO` | stays | for contributors |
| `DECISIONS-PENDING.md` | `governance/DECISIONS-PENDING.md` | the process ledger |
| `DEPENDENCY-LICENSES.md` | stays | for readers; generated at the root (`scripts/audit-dependency-licenses.mjs:612 @ 79476279e2556044b1fee399d0433372aca68576 sha256:337f802d5b83f7c53920b2bad20d67e9312a4642ee7c7a3e06e22fc1b7ff7b15`, `:670`) |
| `KNOWN-LIMITATIONS.md` | stays | for readers |
| `LICENSE` | stays | for readers and tools |
| `LICENSES` | stays | top-level folder |
| `MACOS-BRINGUP.md` | `governance/MACOS-BRINGUP.md` (OPEN-4) | an operator kit for the human's sitting; `docs/` would relicense it |
| `PLAN.yaml` | `governance/PLAN.yaml` | how the work is run |
| `PRE-PUBLIC-CHECKLIST.md` | `governance/PRE-PUBLIC-CHECKLIST.md` | a checklist |
| `PRECEDENTS.md` | `governance/PRECEDENTS.md` | how the work is run |
| `PUBLIC-AUDIENCE-AUDIT.md` | `governance/PUBLIC-AUDIENCE-AUDIT.md` | an audit |
| `QUICKSTART.md` | stays | for readers |
| `README.md` | stays | for readers; its opening is rewritten under item 6 |
| `RELEASE-0.1.md` | `governance/RELEASE-0.1.md` | a release record |
| `RELEASE-DAY-CHECKLIST.md` | `governance/RELEASE-DAY-CHECKLIST.md` | a release checklist |
| `docs` | stays | top-level folder, kept by the direction |
| `engine` | stays | code folder |
| `frontends` | stays | code folder |
| `kernel` | stays | code folder |
| `protocol` | stays | code folder |
| `renderer` | stays | code folder |
| `run-cold-open.ps1` | `scripts/run-cold-open.ps1` (OPEN-4) | a measurement tool, not a reader file |
| `scripts` | stays | top-level folder |
| `site` | stays | top-level folder |
| `spikes` | stays | code folder |
| `state` | stays | top-level folder |
| `tools` | stays | code folder |

**Forms (176).** Each row keeps its basename. The new path is the folder shown plus that basename.

| Form at 79476279 | New folder | Reason |
|---|---|---|
| `CLAUDE-MD-STALE-FACTS-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `DOCS-08-PUBLIC-DATA-SENTENCE-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-ITEM-2-ON-MAIN-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-ITEM-23-WATCHER-IDLE-END-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-ITEM-41-SOURCE-COMMENT-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-ITEM-42-CURRENT-VIEW-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-ITEM-8-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `LEAD-DATA-PILOT-SETUP-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `PORT-1-LINUX-L1-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `REUSE-ROUND-1-BUNDLE-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `WORKSPACE-RUSTFMT-PREREGISTRATION.md` | `governance/forms/root/` | root form |
| `docs/PREREGISTRATION-TEMPLATE.md` | stays (OPEN-1) | the template, not a form; `docs/` is CC-BY |
| `docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md` | stays (OPEN-1) | in `docs/`; moving it relicenses it |
| `engine/ADMISSION-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/B1-FOLLOWUPS-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/B1-PROJECTION-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-FULL-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/CORPUS-LINE-FILES-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/GEOMETRY-LINES-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/GEOMETRY-POINTS-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/LOD-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/SLICE-TRACED-TEST-CROSS-STAMPING-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/SOURCE-WATCHER-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/STREAM-FETCH-OVERFLOW-FIXED-DETAIL-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `engine/WATCHER-FIRST-READ-PREREGISTRATION.md` | `governance/forms/engine/` | form in a code folder |
| `frontends/shell/ADR-013-DISPLAY-STATEMENT-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/CRS-UNIT-FACT-AND-BOUNDS-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/DEPENDENCY-AUDIT-2026-09-19-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/DESCRIBE-FIELDS-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/E2E-README-STATUS-BAR-STEPS-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/ENTRY-66B-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/FILTER-84-85-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/HOVER-REPICK-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/N8-REOPEN-RESET-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/P3B-TEST-NAMES-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/PAN-ANCHOR-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/PART-N-UPDATE-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/POLISH-87-88-89-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/PUBLISH-PANEL-RS-REGEX-LAYOUT-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/RESIDENCY-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/VIEWER-BUILD-ORDER-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md` | `governance/forms/frontends/` | form in a code folder |
| `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/B2-1B-RECORDING-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/CANCEL-RESCORE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/FIRST-BATCH-FACTORIAL-IGNORED-TRACE-TESTS-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/FIXTURE-S-REGENERATION-ENTRY-POINT-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/PROBE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/PUBLISH-SORT-WINDOW-CANCEL-NOT-EXERCISED-ON-CI-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/SCALE-PASS-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/SESSION-GENERATION-OTHER-RECORDED-MUTATIONS-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md` | `governance/forms/kernel/` | form in a code folder |
| `protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md` | `governance/forms/protocol/` | form in a code folder |
| `protocol/data-plane/ORIGIN-NON-ASCII-PREREGISTRATION.md` | `governance/forms/protocol/` | form in a code folder |
| `protocol/data-plane/STREAM-REGISTRY-BOUND-PREREGISTRATION.md` | `governance/forms/protocol/` | form in a code folder |
| `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md` | `governance/forms/protocol/` | form in a code folder |
| `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md` | `governance/forms/protocol/` | form in a code folder |
| `protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md` | `governance/forms/protocol/` | form in a code folder |
| `renderer/bundle-viewer/PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md` | `governance/forms/renderer/` | form in a code folder |
| `renderer/bundle-viewer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md` | `governance/forms/renderer/` | form in a code folder |
| `renderer/bundle-viewer/ZOOM-ANCHOR-PREREGISTRATION.md` | `governance/forms/renderer/` | form in a code folder |
| `scripts/AUDIT-NPM-TREES-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/COMPACTION-RECORD-AND-RESUME-LINE-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/FLUSH-CRLF-FIELD-REWRITE-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/GUARDIAN-PARITY-GIT-TIMEOUT-UNDER-LOAD-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/HOOKS-CLOUD-INERT-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/QUESTIONS-MIRROR-T11-COPY-GLOB-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/ADR-032-STALENESS-DOCS-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/GOVERNANCE-WEEKLY-PROPOSALS-2026-09-26-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/HASH-REF-LEADING-DOT-PATH-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/RECORD-ROUND-COUNT-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/TEST-CLAIMS-LANDEDNESS-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/TEST-CLAIMS-PLANNED-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/TEST-CLAIMS-SAME-PR-SUPERSEDED-PIN-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/TEST-CLAIMS-SUPERSEDED-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/TEST-CLAIMS-WITHDRAWN-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-CITES-PAST-END-BOUND-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-CITES-PINNED-CITATIONS-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-GATE-FILE-EXISTS-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md` | `governance/forms/scripts/` | form in a code folder |
| `spikes/entry40-producer-hang-diagnosis/PASS-PREREGISTRATION.md` | `governance/forms/spikes/` | form in a code folder |
| `state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md` | stays | under `state/`, which the direction keeps |
| `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md` | `governance/forms/tools/` | form in a code folder |
| `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md` | `governance/forms/tools/` | form in a code folder |
| `tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md` | `governance/forms/tools/` | form in a code folder |
| `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` | `governance/forms/tools/` | form in a code folder |
| `tools/mods/GUARDIAN-V1-PREREGISTRATION.md` | `governance/forms/tools/` | form in a code folder |
| `tools/mods/MODS-README-LOCAL-SCOPE-PREREGISTRATION.md` | `governance/forms/tools/` | form in a code folder |

Folder counts for the moved forms:
- root 15, engine 30, frontends 40, kernel 36, protocol 6, renderer 3, scripts 36, spikes 1, tools 6.
- In total: 173 forms, plus 13 root entries, makes 186 renames.

Before the move, the script asserts that no two rows share a new path (no basename collision within a folder).

### 2.2 The two commits (the direction, item 2)

**Commit M, moves only.**
1. At P, `node scripts/plan/moved-map.mjs plan` prints R's rows. The script must agree with §2.1 plus the delta rows the PR body lists.
2. Each row is applied by `git mv -- <old> <new>`. Parent folders are created; an empty folder is no content.
3. M is committed, signed off.

Checks on M, run by script, any failure stops:
- `git diff --name-status -M100% M^ M` prints exactly one `R100<TAB>old<TAB>new` line per row and nothing else.
- For each row, `git rev-parse M^:<old>` equals `git rev-parse M:<new>`, and the two basenames are equal.
- The oldest commit of `git log --follow --format=%H M -- <new>` equals the oldest of `git log --format=%H M^ -- <old>`.

**Commit C2, paths.**
- It adds `governance/MOVED.tsv` (§2.3), `governance/README.md` (§2.6), `scripts/plan/movedMap.mjs`, `scripts/plan/moved-map.mjs`, `scripts/plan/forms-layout.mjs` and their tests.
- It rewrites PLAN.yaml gates by script (§2.4).
- It regenerates the queue and the site.
- It edits the hard-coded paths below. Every edit changes a path and nothing else, except where the table says otherwise.
- All line cites are `@ 79476279`.

| File | Lines | Change |
|---|---|---|
| `scripts/plan/rulingSet.mjs` | 11 | `LIVE_RULINGS` becomes `governance/DECISIONS-PENDING.md`; `ARCHIVE_RULINGS_RE` (13) is unchanged |
| `scripts/plan/verify.mjs` | 144, 148-151, 157, 160, 198-200, 320, 329 | plan default becomes `governance/PLAN.yaml`; the site default becomes `REPO_ROOT/site`, no longer the plan's folder; a `RELEASE-…` verdict cite and `evidence.path` resolve through the move map (OPEN-6); messages name the moved path; 317 is unchanged (the queue sits beside the plan) |
| `scripts/plan/site.mjs` | 109, 919, 920 | plan default; out-dir default `REPO_ROOT/site`; the evidence-path link goes through the map (OPEN-6) |
| `scripts/plan/health.mjs` | 271, 272 | plan default; site-dir default `REPO_ROOT/site` |
| `scripts/plan/queue.mjs` | 262 | plan default (263 to 265 then follow the plan's folder) |
| `scripts/plan/plan.mjs` | 295 | default path |
| `scripts/plan/docsOnly.mjs` | 48, 84, 85, 138-146, 149, 164, 175 | `governance/PLAN.yaml` and `governance/CUSTODIAN-QUEUE.*` |
| `scripts/plan/verify-cites.mjs` | 113, 204-228 (callers 273, 404), 368-423 | the move map, the moved-citer directory and the post-move check (§2.3); `ROTATING_LEDGERS` compares the path after the map |
| `scripts/plan/verify-quotes.mjs` | 427, 515-541, 766-800, 957, 963, 1067 | `EXTRA_HASH_SCAN_FILES` gets the governance path; baseline `file` keys compared through the map; resolution through the map; a pinned rev reads the old path (§2.3) |
| `scripts/plan/verify-test-claims.mjs` | 871 | plan path |
| `scripts/plan/measure-reads.mjs` | 63 | `governance/DECISIONS-PENDING.md`, under OPEN-2 only |
| `scripts/plan/rotate-decisions-pending.mjs` | 164 | plan path (its other ledger lines follow `LIVE_RULINGS`) |
| `scripts/plan/rotate-plan-summaries.mjs` | 81, 180-184, 215, 227, 236-237 | plan and ledger paths, and the archive header's source path |
| `scripts/hooks/stop-queue.mjs` | 74, 384 | plan default; the message names the governance paths |
| `scripts/hooks/session-resume.mjs` | 28-34 | `READING_ORDER` names the governance paths |
| tests, path only, every test name unchanged | `verify.test.mjs` 75, 97, 104, 112 and the RELEASE fixtures; `verify-test-claims.test.mjs` 569, 657, 695, 732, 798, 848, 867, 890, 937, 1176, 1244, 1283, 1325, 1387, 1593; `verify-quotes.test.mjs` 975-1114; `verify-cites.test.mjs` 475; `rotate-decisions-pending.test.mjs` 25; `rotate-plan-summaries.test.mjs` 298, 342; `measure-reads.test.mjs` 50, 77, 102, 115, 129, 132, 150 (OPEN-2); `docsOnly.test.mjs` 122-200; `hooks.test.mjs` 385, 1314-1324, 1391-1414 | fixtures write to `LIVE_RULINGS` and the governance paths |
| `.github/workflows/governance-ci.yml` | 85, 91, 92, 97, 102, 108, 109, 114; after 175 | filters name the governance paths, and both add `governance/MOVED.tsv`; two steps are added: `node scripts/plan/moved-map.mjs --check` and `node scripts/plan/forms-layout.mjs` |
| `.github/workflows/pages.yml` | none | it uploads `site`, which stays; the default is fixed in `site.mjs` |
| `.ignore` | 2 | `/governance/CUSTODIAN-QUEUE.json` (OPEN-2) |
| `CLAUDE.md` | 19-24 | one `governance/` bullet in the layout section |
| `.claude/agents/architect.md` | 11, 15, 17, 19 | backticked path tokens outside quoted spans only |
| `.claude/agents/reviewer.md` | 18, 25, 29, 31, 33 | as for architect.md |
| `.claude/agents/worker.md` | 15, 17, 25, 33 | as for architect.md |
| `.claude/agents/lead-data.md` | 12 | none (it names `docs/PREREGISTRATION-TEMPLATE.md`, which stays) |
| `frontends/shell/e2e/citationIntegrity.test.mjs` | 200, 202, 209 | the RESIDENCY form and AI_DEVELOPMENT at their new paths; without this the shell's `npm run verify` goes red |
| `run-cold-open.ps1`, moving to `scripts/` | 24, 36 | the usage path; `Set-Location (Join-Path $PSScriptRoot '..')`, so line 41's relative path holds |
| `PLAN.yaml` | gate lines, by script (§2.4) | nothing else |

**G3 needs no change.** It recognises a filed preregistration by the suffix `preregistration.md` on the lower-cased basename. Its filed test is `git cat-file -e HEAD:./<basename>`, run with the file's own folder as the working directory. Both are independent of location (`tools/mods/spatial-guardian/hooks/register.js:527 @ 79476279e2556044b1fee399d0433372aca68576 sha256:732589e85a87fb56692b8380b660b46ffa14a6918641d7febd861082710a8a96`, `tools/mods/spatial-guardian/hooks/register.js:563-571 @ 79476279e2556044b1fee399d0433372aca68576 sha256:a352caa42842fcce350eee7eb731b24f0e0de4270cf66e937bd38f2147abaef4`).

**Named but not read; not edited.** These resolve through the map (OPEN-7):
- product-code comments and strings that name a form;
- workflow comments;
- the generated labels at `scripts/audit-dependency-licenses.mjs:121-217 @ 79476279e2556044b1fee399d0433372aca68576 sha256:b2f053534ea6b516e5823e47a0d486c12643bd597c1c3c46014fbc536d68b9b6`;
- every record.

**Not edited, append-never.**
- `scripts/plan/verify-quotes.baseline.json`: 27 `file` keys name moved forms; they are matched through the map.
- `scripts/plan/verify-cites-legacy-bound.json`: its citing paths all stay; its history check fails on any entry it gains (`scripts/plan/verify-cites.mjs:351-361 @ 79476279e2556044b1fee399d0433372aca68576 sha256:9289a6d74df28086d192fcca2d5a18de7721b7a286e97c7fddc523f5d34c374a`).

### 2.3 Citations, with no record edited (the direction, item 3)

**MOVED.tsv**
- LF only, UTF-8.
- A header line `old<TAB>new<TAB>commit`, then one row per rename, sorted by old path in byte order. The commit is the full 40-hex id of the moves-only commit that made the rename.
- `moved-map.mjs add <commit>` appends the rows generated from `git diff --name-status -M100% <commit>^ <commit>`. It refuses when any line is not R100, when a basename differs, or when a new path falls outside `governance/` or `scripts/run-cold-open.ps1` (an explicit allow list).
- `moved-map.mjs --check` regenerates every row from the distinct commits the file names and fails by name on any byte difference. A hand edit therefore fails CI.
- A later moves-only commit adds rows in the same way. This is the remedy when governance-ci's form check catches a branch's form at an old location: the branch makes a moves-only commit and runs `add`.

**Resolution, unpinned cites** (`scripts/plan/movedMap.mjs`, shared by verify-cites, verify-quotes, verify and site)
- A cite whose path as written (`./` stripped) equals an old path resolves to the new path, and that file is read at HEAD. So do two more cases:
  - a cite whose citing-directory-relative path equals an old path;
  - a cite from a moved citing file, read relative to that file's pre-move folder.
- The map is consulted before the exact and suffix tiers.
- The tier is the one the path as written gets today: rooted is gated, loose is advisory.
- A moved citing file always resolves its relative cites against its old folder.

**Post-move rule** (verify-cites only, and only for cites that went through the map)
- The citing line's commit is found by `git blame --porcelain -L n,n` of the citing file. Blame follows the rename, and M changes no line, so M is never the line's commit.
- The line is written after the move when it is uncommitted, or when its commit has the row's move commit as an ancestor (OPEN-5).
- Such a cite fails by name: `old path "<old>" cited after the move at <commit12>; cite "<new>"`.
- Blame runs only on citing files changed since the row's move commit (`git diff --name-only <commit> HEAD`, plus changes in the working tree). Results are cached per file.

**Pinned citations are unchanged.**
- A cite with `@ <commit>` takes today's code path in verify-cites, with no map and no post-move check.
- In verify-quotes, a hash reference with an explicit rev is handled as follows. If resolution through the map lands on a new path whose row's move commit is not an ancestor of the rev, the row's old path is read at that rev. Every other reference is resolved exactly as today.

**Negative tests.** Each test has one mutation, observed by applying it, running the test, recording the failure by name with its commit, and reverting. These are listed in §4.
- Case 1: T1, T2, T7.
- Case 2: T3, T4, T5.
- Case 3: T6, T8.

### 2.4 PLAN.yaml gates, by script

`moved-map.mjs rewrite-gates` rewrites every `gate:` value equal to an old path, whatever the node's status. Done nodes are included, because verify-test-claims keeps a landed gate's claims binding by matching the gate path exactly (`scripts/plan/verify-test-claims.mjs:734-741 @ 79476279e2556044b1fee399d0433372aca68576 sha256:27d6715afa339a3cd2d0bbb912e387a6f42c1a1877298f21d168599d4eb1527a`). It touches no other byte. It is idempotent, and it is re-run after any merge of main into the branch.

At 79476279 there are 160 gate lines that are not `none`; the script reports how many of them name an old path. For `evidence.path` and `verdict.cite`, see OPEN-6.

### 2.5 The new governance-ci check

`scripts/plan/forms-layout.mjs`:
- It lists `git ls-files '*PREREGISTRATION*.md'` and fails by name on each path that is not under `governance/forms/` or `state/` and is not on the exact allow list, which is OPEN-1's two `docs/` paths.
- It runs in governance-ci's `plan` job beside `moved-map.mjs --check`.
- The existing filter `**/*PREREGISTRATION*.md` triggers it on any branch that adds a form. On a pull request it checks the merge ref, so it catches a form a pre-move branch created at an old location at that branch's merge.

### 2.6 governance/README.md and the README (the direction, item 6)

- **`governance/README.md`:**
  - one line per governance entry, drafted from each file's own opening;
  - where new forms go (rule R);
  - how an old path resolves (MOVED.tsv).
- **README.md:** §9 gives the procedure. The words come in the PR.

## §3. Fixtures and pre-declared outcomes

There is no data fixture. The tests build temporary git repositories: a file at `a/X-PREREGISTRATION.md`; a moves-only commit to `governance/forms/a/`; MOVED.tsv; then appended lines and citing records, committed before and after the move. Each test's predicted outcome is its assertion (§4).

## §4. Tests, and the mutation for each new test

| Test | Mutation | Predicted failure |
|---|---|---|
| T1 `verify-cites: an unpinned old-path cite written before the move resolves to the new path at HEAD`. The cite `:4` was written when the file had 3 lines; an amendment added after the move makes it 4. | resolve old paths at the move commit's parent | T1 fails: line 4 exceeds the file |
| T2 `verify-cites: an old-path cite past the end of the moved file fails by name, naming the new path` | drop the map lookup | the reason no longer names `governance/forms/a/X-PREREGISTRATION.md` |
| T3 `verify-cites: an old-path cite written after the move fails by name` | skip the post-move check | passes; T3 fails |
| T4 `verify-cites: an uncommitted old-path cite fails as written after the move` | treat blame's uncommitted sentinel as written before the move | T4 fails |
| T5 `verify-cites: an old-path cite from a branch forked before the move passes after the merge` (OPEN-5 A) | compare committer dates instead of ancestry | T5 fails |
| T6 `verify-cites: a pinned old-path cite written after the move is read at its pin, unchanged` | route pinned cites through the map and the post-move check | T6 fails |
| T7 `verify-cites: a moved file's relative cite resolves against its pre-move folder` | use the current folder | T7 fails |
| T8 `verify-quotes: a hash reference to an old path at a pre-move rev reads the old path at that rev` | today's order (current tree first) | the git show failure is reported by name |
| T9 `verify-quotes: a baseline entry keyed by an old path waives the same finding at the new path` | compare `file` raw | the finding is not baselined |
| T10 `moved-map: --check fails by name on a hand-edited row` | compare the row count only | T10 fails |
| T11 `moved-map: add refuses a commit with any line other than R100` | accept R below 100 | T11 fails |
| T12 `forms-layout: a preregistration outside governance/forms/ and state/ fails by name` | allow by the prefix `docs/` (the fixture holds `docs/x/NEW-PREREGISTRATION.md`) | T12 fails |
| T12b `forms-layout: state/ and the two exact docs/ paths are allowed` | drop the `state/` allowance | T12b fails |
| T13 `verify: a RELEASE verdict cite and an evidence path resolve through the move map` | `path.join(repoRoot, rel[1])` without the map | T13 fails |
| T14 `stop-queue: the default plan path is governance/PLAN.yaml` | revert to the root path | the allow-with-no-plan path is taken; T14 fails |
| T15 `session-resume: every path the reading order names exists at HEAD` | revert one name in the reading order | T15 fails |
| T16 `site: the default output folder is the repository's site/ whatever the plan path` (and the same for health and verify) | `dirname(planPath)/site` | T16 fails |

Every test that exists at P keeps its name and passes after.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions.**
- M: 186 R100 lines and nothing else.
- Root entries: 59 at 79476279, recounted at P; 32 after.
- Markdown files in the code folders: 158 fewer.
- Forms outside `governance/forms/` and `state/`: 2 after, both on OPEN-1's list.
- After-week Rust CI runs started by form-only pushes: 0.

**"The same results"** (the direction, item 4), comparing P with C2:
- **verify:** exit code 0 both times, online and `--offline`, with empty failures.
- **verify-cites:** equal exit code. The gated and advisory sets are equal after each `relPath` and target is mapped through MOVED.tsv. `scanned(C2)` equals `scanned(P)` plus the 6 files C2 adds. There is no legacy-list error.
- **verify-quotes:**
  - equal exit code;
  - equal checked, findings, advisories, baselined, hash-checked, hash-findings, hash-baselined, cites-checked and cite-findings counts;
  - equal sets after mapping;
  - no unmatched baseline entry in either run.
- **verify-test-claims:** equal exit code; equal finding, planned, superseded and withdrawn sets after mapping; equal scanned count.
- **Tests:** the hooks', plan, evidence and Guardian tests are all green. The before-name set is a subset of the after set, and every addition is named in §4.
- **Hooks:**
  - Stop, with a held lease, reaches step 5 and names the ready set derived from `governance/PLAN.yaml`.
  - PreCompact allows on a fresh block.
  - SessionStart prints a reading order whose every named path exists (T15).
- **Queue and site:** P's committed outputs, with every old path replaced by its new path, equal C2's regenerated outputs, except `plan_hash` and the generation stamps.
- **measure-reads:**
  - `routine`: P's old script and C2's script print byte-identical stdout, since `state/CUT-STATE.md` is untouched on the branch.
  - `corpus`: from clean checkouts, C2's listed set equals P's set mapped through MOVED.tsv, plus C2's added files. Every file C2 does not edit has the same blob. The byte difference equals the sum over C2's added and edited listed files, file by file.

**Declared unchanged:**
- every record's bytes;
- Guardian code;
- every product source;
- `docs/`, `state/`, `site/` (apart from regeneration), `LICENSES/`;
- both append-never lists.

**Invalidators, which stop the piece:**
- a basename collision under a forms folder;
- a moved blob that differs;
- a form appearing at an old location on main between P and the merge, which forces R to be re-derived with the human told;
- a before/after difference no listed C2 change explains.

**Falsification.** If any cite that went through the map, unpinned and written before the move, passes at P and fails at C2, or fails at P and passes at C2 (other than T1's shape), the resolution rule is wrong.

## §6. Instruments

These are assertions and counts, not `docs/08` measurements. R100 lines, blob equality and the check outputs are assertions. For the counts and their commands, see §9's measurement block. verify-cites' wall time is recorded at P and at C2 as a fact, and its ceiling is in §7.

## §7. Declared values and ceilings

- **The move commit:** 186 renames (re-derived at P, with the delta listed) and 0 content lines.
- **C2's budget:**
  - at most 1,600 non-generated lines, counting insertions plus deletions;
  - at most 48 files;
  - counting command: `git diff --numstat M C2 -- . ':(exclude)governance/MOVED.tsv' ':(exclude)governance/CUSTODIAN-QUEUE.md' ':(exclude)governance/CUSTODIAN-QUEUE.json' ':(exclude)site/**' ':(exclude)governance/PLAN.yaml'`;
  - PLAN.yaml's gate lines are counted on their own: at most 160.
- **Time:** governance-ci's `plan` job stays within its 15-minute timeout (`.github/workflows/governance-ci.yml:130` at 79476279e2556044b1fee399d0433372aca68576, sha256 71748d0a6ecca897550aa111ba0cbd7ac1b79a4595d46cde9a1adefd1cdc2851).
- **Folder rule R:** as in §2.1.
- **Allow list:** OPEN-1.
- **Measurement windows:** 168 h before and 168 h after the merge commit's committer time.

## §8. Block-on-sight

1. Any line of M's `git diff --name-status -M100%` that is not R100, or a row missing from it; a blob or a basename that differs.
2. A move into or out of `docs/` (a licence-layer change).
3. C2 edits a file outside §2.2's table or a record. A `*PREREGISTRATION*.md` other than this form's own appended amendments counts as such a file.
4. MOVED.tsv does not equal its regeneration (`--check`), or it holds a CR.
5. A squash or rebase merge: M must stay reachable from main.
6. A Stop-hook pass that is the allow-with-no-plan at `scripts/hooks/stop-queue.mjs:355 @ 79476279e2556044b1fee399d0433372aca68576 sha256:8d0abca490ff3267f54930dfec5193e0475330ee7c3748bafbdc4d4438862a97`.
7. A proof check whose before/after differ beyond §5's definition.
8. A line C2 writes that carries an unpinned old-path cite.
9. Changed text inside a quoted or byte-copied span in an agent definition or in CLAUDE.md.
10. Changed README License or Local-first text without the human's typed words (red line).
11. A C2 file that a piece in flight or a PR awaiting merge also touches.
12. A default site output anywhere but `site/`.
13. An edit to `measure-reads.mjs` or `.ignore` without OPEN-2's ruling.
14. An edit to either append-never list.
15. A pinned citation whose resolution changed.
16. Any Guardian code change, history rewrite, force-push or visibility change.
17. A scan set that silently shrinks: verify-quotes' hash-scan count, verify-cites' scanned count.

## §9. Gates

- **Architect and reviewer,** both on the full diff of both commits. The reviewer runs M's R100 script itself.
- **Suites:**
  - governance-ci, every step including the two new ones;
  - `node --test` over `scripts/plan`, `scripts/hooks` and `scripts/evidence`;
  - the shell's `npm run verify`, which includes citationIntegrity;
  - the Guardian tests;
  - product-ci-shell, -viewer and -rust, which run because the moved files leave their folders.
- **The human:**
  - approves §2.1's table in this form;
  - approves the README words in the PR;
  - clicks the merge, by merge commit.
- **Operator:** none, since there is no UI change.

**Timing** (the direction, item 5; Rule (00) at `AUTONOMY.md:609 @ 79476279e2556044b1fee399d0433372aca68576 sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0`):
- Rule (00) is set aside for M alone.
- The PR body lists the PRs open at the click (`gh pr list --state open`). Each open PR merges main afterwards.
- C2 gets no exception. Before the click, `gh pr diff --name-only` of every open PR and the paths of every piece in flight are checked against C2's file list. There must be no overlap, which means the governance lane is otherwise empty.
- citationIntegrity.test.mjs is one shell file: no shell piece may have it in flight.
- Main is held from P to the click. A main commit in between means: merge main into the branch, re-run R, re-run `rewrite-gates`, re-run the proof.

**The README** (the direction, item 6):
- The architect drafts the opening from `README.md:3-7` at 79476279e2556044b1fee399d0433372aca68576, sha256 91a00f999f9497b0a8c427a9ee3355ba24f5d9f08067cce57058d3becdcd4d47 (the vision paragraphs, taken from `docs/00_Vision.md`, unchanged).
- A statement of what works today follows (OPEN-8). Each clause is listed in the PR body with:
  - the code that implements it (`path:line @ <commit>`);
  - the operator evidence (a walkthrough row and its verdict);
  - whether an operator can observe it in the shipped build.
- There is no performance clause. The limits pointer to `KNOWN-LIMITATIONS.md` is unchanged.
- Then a map of about ten lines: the root files, `docs/`, the five module folders, `governance/` (with `forms/` and MOVED.tsv), `state/`, `site/`, `scripts/`, `tools/`, `spikes/`, `LICENSES/`.
- A pointer to `governance/README.md` closes it.
- Install, First five minutes, Local-first and License keep their bytes, unless the human types new words.

**Measurement** (the direction, item 7). Each figure is taken at P and at the merge commit X.
- (a) `git ls-tree --name-only <rev> | wc -l`
- (b) `git ls-tree -r --name-only <rev> -- engine frontends kernel protocol renderer scripts spikes tools | grep -c '\.md$'`
- (c) Rust CI runs:
  - list the runs with `gh run list --workflow product-ci-rust.yml --branch main --event push --limit 1000 --json databaseId,headSha,createdAt`;
  - keep the runs inside each 168 h window;
  - take each push's range from the PushEvent's before and head (`gh api repos/{owner}/{repo}/events --paginate`; if the event is gone, the head commit's first-parent diff, and say so);
  - list the changed paths with `git diff --name-only <before> <head>`;
  - filter them through the workflow's own include and exclude list (`.github/workflows/product-ci-rust.yml:124-150` at 79476279e2556044b1fee399d0433372aca68576, sha256 4620a44deedc7bf03e117fbb729642dfb849d066342833d81e2d366e56c7833e, in order);
  - a run is form-only when every path that matches the filter matches `*PREREGISTRATION*.md`;
  - record the total runs and the form-only runs for each window.
- The after-week figure is carried by OPEN-10.

---

**OPEN items for the human**

- **OPEN-1. The two `docs/` files whose names match the glob** (the template, and `docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md`). As the direction words it, the new check would fail on both.
  - (A) Both stay, and forms-layout allows exactly these two paths. No licence changes. Recommended.
  - (B) The experiments form moves to `governance/forms/docs/`. That relicenses it from CC-BY-4.0 to the core licence (`LICENSES/README.md:22-23 @ 79476279e2556044b1fee399d0433372aca68576 sha256:fd66a3e47d81277ae914df4440b60d229cfff4f9965b991e6d9e5053a15dd233`): a red line, which needs your typed ruling.
  - (C) The check allows all of `docs/`.
- **OPEN-2. measure-reads and `.ignore` are frozen** by the SEARCH-IGNORE form's section 2 items 7(a), 7(c) and 7(e) (`scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:133 @ 79476279e2556044b1fee399d0433372aca68576 sha256:a0c3d948bea1eb14f0c821a84dc8ccbc44f497f37e6ad3e9710fab5827f8ecd3`, `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:138 @ 79476279e2556044b1fee399d0433372aca68576 sha256:bd3b983969802d96d34df22fd06b3ed958566bf24cfebd3cd310a21b8d1601b3`, `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:140 @ 79476279e2556044b1fee399d0433372aca68576 sha256:ce4b9cf96f902260ea5832f64cecc9481cbb7545782ad9c423fdf6be82caf5b0`, `scripts/plan/SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md:142 @ 79476279e2556044b1fee399d0433372aca68576 sha256:c8e04f0ca0746cd4277ee251214c4de0ac522507c20179067e1c858cd9919846`). The after-C run is done.
  - (A) Path-only edits at `scripts/plan/measure-reads.mjs:63 @ 79476279e2556044b1fee399d0433372aca68576 sha256:ba01f0a336e823986e441648d9e0bb8228147d55fb2018bd3135f92bb813f962` and `.ignore:2`. This form is the telling that item 7(a) asks for, and the record carries both script digests. Recommended.
  - (B) `DECISIONS-PENDING.md` and `CUSTODIAN-QUEUE.json` stay at the root, against the direction's goal.
- **OPEN-3. The forms folder.**
  - (A) The first path segment: `governance/forms/engine/`, `frontends/`, `kernel/`, `protocol/`, `renderer/`, `scripts/`, `spikes/`, `tools/` and `root/`. This is the draft.
  - (B) Mirror the old folder path, for example `governance/forms/frontends/shell/e2e/`.
  - Either way the script asserts there is no collision.
- **OPEN-4. The two root files the direction does not name.**
  - (A) `governance/MACOS-BRINGUP.md` and `scripts/run-cold-open.ps1`, with two lines edited. The licence layer is unchanged and the paths commit stays out of the kernel lane. Recommended.
  - (B) `docs/MACOS-BRINGUP.md` (a relicensing, so a red line) and `kernel/scripts/run-cold-open.ps1`.
- **OPEN-5. How "after the move" is decided.**
  - (A) git blame of the line for every file, which equals the direction's first-commit rule for every record filed once. "After" means the move commit is an ancestor of the line's commit, or the line is uncommitted. A branch forked before the move is not faulted. Recommended.
  - (B) The direction's two mechanisms, with a classifier for records filed once, and "after" judged by committer date.
- **OPEN-6. PLAN.yaml's paths other than gates.** These are `evidence.path` at lines 698, 716, 788, 1197 and 1215 (DECISIONS-PENDING.md), 770 (RELEASE-DAY-CHECKLIST.md) and 1307 (RELEASE-0.1.md), and `verdict.cite` at 244, 263, 282 and 301 (RELEASE-0.1.md), all @ 79476279e2556044b1fee399d0433372aca68576.
  - (A) They resolve through the map in verify.mjs and site.mjs, and PLAN.yaml changes only its gates. Recommended.
  - (B) `rewrite-gates` also rewrites `evidence.path` and the RELEASE prefix of `verdict.cite`.
- **OPEN-7. Path mentions in files that stay** and are outside the direction's list: CLAUDE.md:8 @ 79476279e2556044b1fee399d0433372aca68576 sha256:0f7444f493b416448db26a90e3fb123a0d21c688e7b9c229368cceaca8f63816 and :33-35; CONTRIBUTING.md; `.github/ISSUE_TEMPLATE/bug-report.yml:10` at 79476279e2556044b1fee399d0433372aca68576, sha256 aedcac81aee05e20de2e6a398ba87d8a88bb6a40ba3cfd3538ef131cfdc5154e; docs/README.md; KNOWN-LIMITATIONS.md; LICENSES/README.md; the template; AUTONOMY.md:17 @ 79476279e2556044b1fee399d0433372aca68576 sha256:9b7abe8c378ca2a2a0b1328a5e0c9672848785beac53cc0f562581006b2af134; AI_DEVELOPMENT.md:336 @ 79476279e2556044b1fee399d0433372aca68576 sha256:4d1714424ec01bd13f07fa88f2675cf4dd27ac0dd67bf23e876f5656aa6cbb8e.
  - (A) Leave them all; they resolve through MOVED.tsv. Only CLAUDE.md:8 @ 79476279e2556044b1fee399d0433372aca68576 sha256:0f7444f493b416448db26a90e3fb123a0d21c688e7b9c229368cceaca8f63816 and :33-35 and the issue template, which direct a reader or an agent to open a file, are updated in C2, path only. Recommended.
  - (B) Leave all of them.
  - (C) Also append a dated pointer at the end of AUTONOMY.md.
- **OPEN-8. What the README calls "works today."**
  - (A) The last release's operator-verified behaviour, with main named as ahead and nothing claimed for it.
  - (B) Main's behaviour, each clause proven by a test on main and labelled unreleased.
- **OPEN-9. "Its tests say so" for the Guardian.**
  - (A) Add one test, T17, that puts a filed form under `governance\forms\`. The Guardian code is unchanged. Recommended.
  - (B) Run the existing tests only.
- **OPEN-10. The after-week Rust CI figure.**
  - (A) A PLAN node blocked on this one records it as a class 1 row, 168 h after the merge. Recommended.
  - (B) This node stays open until then.

## The custodian's settlement (class 1, before any code)

The human's ruling is `state/directives/2026-10-29-governance-f-mapping-table-approved-open-1-to-open-10-ruled.md`, referenced and not restated; each item below names what this form reads through it.

- **The mapping table: approved by the human as drafted, rule R and its delta rows included.** Section 2.1 is the approved table; a row R derives at the move commit's parent is approved in advance, as section 2.1 says, and the PR body lists it.
- **OPEN-1, OPEN-2, OPEN-3, OPEN-4, OPEN-5, OPEN-6 and OPEN-10: (A), the human's,** each in the human's words in the ruling. Under OPEN-2 this form is the telling the frozen script's item 7(a) asks for, and the record carries both script digests.
- **OPEN-7: (A) widened, plus (C), the human's.** Section 2.2's table of C2 gains the files the ruling's OPEN-7 names that the table does not already hold (`CONTRIBUTING.md`, `docs/README.md` and `docs/PREREGISTRATION-TEMPLATE.md`), path only, and one dated pointer appended at the end of `AUTONOMY.md` at its new path, naming `governance/` and `governance/MOVED.tsv`. The files the ruling keeps as written stay so; `LICENSES/README.md` changes only as the ruling allows. Section 8 item 3 reads with these rows.
- **OPEN-8: (A), the human's.** The README's statement of what works today is the last release's operator-verified behaviour, with main named as ahead and nothing claimed for it. It is updated at each tag as a release step: C2 also appends that step to `RELEASE-DAY-CHECKLIST.md` at its new path, in one line citing the ruling, and the release node `release-v0-2-0` carries it next.
- **OPEN-9: (B), the human's, plus one live observation.** Nothing under `tools/mods/spatial-guardian` is written; the Guardian's existing tests run as they are (section 9's suites). The observation is the custodian's, after the merge, on main: one Edit-tool attempt at a non-appending change to a moved filed form, refused by G3, its refusal text recorded in the ledger.
- **OPEN-10: (A).** The node `governance-f-after-week-rust-ci-figure`, blocked on this one, records the after-week Rust CI figure as a class 1 row 168 h after the merge.
- **Rule (00) at this commit,** by `git diff --name-only origin/main...<branch>` at main 4a49daa6 over the open PRs (#268) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`), against C2's paths: none touches them. Section 9's timing governs: the check is run again at dispatch and before the click, and C2 gets no exception.

## §10. Amendments (opens empty, append-only)

### Amendment 1 (2026-10-29), class 2: deviations declared before the moves-only commit and the paths commit, written after phase 1's tests and mutations were seen.

- **The build is staged.** C2's logic and tests were built first, with no move and no path edit, on the branch `wip/governance-f-scripts` at 810f6f158d909e15a505d12c0e4aa7b7aa923178 from main at 447b8497 (`state/consults/2026-10-29-governance-f-tidy-repository-in-place-phase1-worker-report.md`). C2 carries those files over by path. The PR keeps section 2.2's two commits, M and then C2.
- **A seventh new file.** C2 also adds `scripts/plan/movedFixture.mjs`, the new tests' shared fixture. Section 2.2's list of what C2 adds reads with it, and section 5's verify-cites prediction reads scanned(C2) equals scanned(P) plus 7.
- **Rule R's delta rows at P,** authorised in advance by section 2.1: this form, and `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md` (committed a6843238). M is re-derived at P and the PR body lists them.

### Amendment 2 (2026-10-29), class 5: the human's ruling of 2026-10-29 (`state/directives/2026-10-29-section-37-for-now-release-step-in-checklist-section-0-5b-runs-on.md`), quoted verbatim, before the moves-only commit.

- **OPEN-8's release step leaves C2** (line 10): "It commits straight to main as process text, before F's move commit, so F's two commits stay pure and the move carries it." The settlement's OPEN-8 sentence on C2 reads through it, and section 2.2's table does not gain `RELEASE-DAY-CHECKLIST.md`. The step is in `RELEASE-DAY-CHECKLIST.md` section 0, committed with this amendment.
- **The quiet window** (line 12): "The quiet window is the moment of C1's commit, not a freeze of the filler slot". Section 9's hold of main reads through it: a main commit after P is merged into the branch, with R, `rewrite-gates` and the proof re-run, as section 9 provides.
- **AUTONOMY.md** (line 8): "Piece F moves the file, nothing more." Its section 37 stays as it is.

### Amendment 3 (2026-10-29), class 2: section 2.2's check 3 on M corrected, written after its result on a first M (e2f9e7183a8de5b447f5c8ca365902c20ee7b16e, never pushed) was seen.

- **What was seen** (`state/consults/2026-10-29-governance-f-tidy-repository-in-place-phase2-stopped-worker-report.md`): checks 1 and 2 held on all 188 rows; check 3 failed on 23. Check 3 compares the oldest commit of a `git log --follow` at the new path with the oldest of a plain `git log` at the old path. For a file that reached its old path by a rename or a copy (a form first written as a consult draft, for example), `--follow` reaches that earlier history and the plain log does not, so the two differ while the move itself is sound.
- **Check 3, as corrected:** for each row, the oldest commit of `git log --follow --format=%H M -- <new>` equals the oldest of `git log --follow --format=%H M^ -- <old>`, and the two commit lists, M excluded, are equal. This is section 1's claim, each moved file's history reachable by `git log --follow`, stated on both sides of M.
- **M is made again** at the new P, main's head when the build resumes, and checks 1 to 3 are run there; the first M is discarded unpushed.
- **Section 5's counts read with Amendment 1's delta rows:** M has 188 R100 lines and nothing else, and the Markdown files in the code folders fall by 160.
