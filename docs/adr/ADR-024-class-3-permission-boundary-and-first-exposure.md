# ADR-024 — The Class-3 Permission Boundary, and Its First Exposure Surface

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. **Filing this ADR
is not, and must not be read as, the human's review of the exposure surface** — ADR-017's
acceptance condition (its Status block, restated by the human's 2026-08-07 clarification recorded
in `kernel/PERMISSION-BOUNDARY.md`) requires that review as a *further* condition beyond the
machinery this ADR documents, and only the human's own review discharges it (see Consequences).
Implemented ahead of acceptance under already-accepted ADR-004's license and within `docs/07`'s
Prototype hero-slice scope, the ADR-019/ADR-020/ADR-021/ADR-022 precedent (each implemented as
Proposed code before its own acceptance).
**Drafted by:** the architect design consult for the `cut/publish-ui` branch (2026-08-16), filed
from that consult's skeleton by this cut's own P4 piece, per CLAUDE.md's architect-first workflow
rule. **Supersedes `kernel/PERMISSION-BOUNDARY.md` as the home of record** for the permission
model — that file is not rewritten (its findings F-1–F-10 and its 2026-08-07 human rulings stand as
the record of the machinery's own design and of two decisions already made), but this ADR is now
where the model *as filed* lives, and it is what a future reader should cite.
**Related:** ADR-004 §4 items 1/3/11/13 (SKP command catalog — binding-local commands are named,
excluded, never SKP), ADR-006 (operation classes — publishing is class 3, external side effect,
irreversible), `docs/09` "Capability grants" (scoped, expiring grants; export/publish distinct
capabilities never implied by write) and "To be specified" (audit-log retention, still open — see
Consequences), ADR-015 (claim-versus-fact discipline — the same discipline that makes a grant
checked against resolved facts rather than a request's own assertions), ADR-017 §8 (the two
recordable `filter` shapes; its Status block's acceptance condition, restated 2026-08-07), §14
(the conforming-reader contract `kernel/examples/verify-bundle.rs` implements and
`e2e/publish.mjs` runs), Corrigendum 3 (spent the v1 schema exception — why a row predicate cannot
be recorded, ever, at `bundle_version` 1), ADR-018 (cancellation vocabulary — this surface's
progress/cancel is a Tauri event + `CancelToken`, an instrument surface, never an SKP field, per
ADR-004 Amendment 4's own proof by byte comparison), ADR-021 (the row-filter predicate this
surface's own honesty fix, P0, refuses to publish), ADR-022 (style v0 as the one style model — the
style hash this surface shows and binds), `docs/03` ("One-click publish… no SaaS backend
(ADR-008)" — read below as no-SaaS, not no-confirmation), `SKP-V0.md` §4 (the command catalog
`binding_*` commands are excluded from), `kernel/PERMISSION-BOUNDARY.md` (superseded as home of
record; its F-1–F-10 and 2026-08-07 human rulings on F-5/F-10 are binding inputs to this ADR, not
revisited), `NEXT-CUT.md` (this cut's own brief — deleted by its final docs commit; this ADR is
what survives it), `CUT-STATE.md`'s publish-cut sections P0–P4 (the implementation record this ADR
formalizes).

## Context

`kernel/src/permission/` — grant, approval, boundary, audit — was built 2026-08-07, before this
cut, and is the subject of `kernel/PERMISSION-BOUNDARY.md` (findings F-1–F-10). That file draws a
line this ADR does not blur: ADR-017's acceptance condition is **one requirement, machinery before
exposure** (a scoped grant, explicit approval, redacted audit record); the human's 2026-08-07
clarification adds a **second, further** condition — a reviewed exposure surface, discharged only
by the human's own review, not by any architect verdict or any ADR filing. On 2026-08-07 the human
ruled F-10 (the stricter reading of "until then" stands) and F-5 (the CLI's self-minted grant is
accepted for v0, with one rule carried forward as binding: **the requester must never mint the
grant**).

This cut (`cut/publish-ui`) builds the first thing that reaches that machinery from outside
`publish-bundle`: a shell UI. Three facts bounded its design before any code was written:

1. **The row-filter format gap.** `publish::build_operation` never read `req.query.filter` before
   this cut, while `stream_for_publish` composed it — a predicate-carrying publish would have
   produced a manifest claiming `whole-file` over a filtered subset, a false manifest (`docs/01`
   principle 3) at a schema version (`bundle_version` 1) whose one schema-change exception
   (ADR-017 Corrigendum 3) is spent. This cut's own P0 piece closes that gap with a typed refusal,
   independent of any UI, before this ADR's own surface existed.
2. **F-5's binding rule needs a concrete shape for a UI**, not only for a CLI flag. A shell command
   that let JS supply a destination string the grant then trusted would be exactly the theater F-5
   rules out — a caller manufacturing its own authorization.
3. **No SKP message, no MCP surface, no plugin/notebook/AI reach is licensed by anything here.**
   `kernel/PERMISSION-BOUNDARY.md`'s "What exposure still requires" list (an SKP message pair,
   authentication, a grant-issuing surface, a persistence/revocation decision, MCP's own review,
   a non-blocking `ApprovalSource`, the human's review) is untouched by this cut and stays a list
   of what is **not** here.

## Decision

**Surface: binding-local Tauri commands, never SKP.** `binding_publish_prepare` and
`binding_publish_execute` (`frontends/shell/src-tauri/src/commands.rs`, `src/publish.rs`) reuse
`spatial_kernel::permission::boundary` in-process — the host already links `spatial-kernel`, so this
is the same machinery `publish-bundle` drives, never a second policy. Named `binding_*`, excluded
from SKP's command catalog and from any future conformance suite (`SKP-V0.md` §4 items 1/3/11/13;
`docs/02`'s frontends-are-clients-only boundary; the `binding_pick_file` precedent this pair
follows). **Stated plainly: this is not a way around ADR-017's condition.** The condition gates a
UI identically to any other exposure; the only thing chosen here is *which* surface, and the
review of it is the human's alone (Consequences, below). Progress and cancellation are a Tauri
event + `CancelToken` — an instrument surface, never an SKP field (ADR-018; ADR-004 Amendment 4).

**Two commands, and the split is the anti-theater property:**

- `binding_publish_prepare(dataset_handle, style_doc, scope, filter_active)` opens the **native**
  OS destination picker host-side — the destination never crosses from JS as a string the app
  trusts — runs `publish::preflight` (pure; this is where P0's row-filter refusal fires, before
  anything else), mints a `PublishGrant` from facts the host itself holds (the dataset's own
  `ContentPin`, never anything the request asserts about itself; the picker's own answer; and
  `Principal::from_environment()`), and stashes a **single-use, TTL-bounded** (120 s,
  `PENDING_ATTEMPT_TTL`, an ADR-010 rule 6 declared ceiling) pending attempt keyed by a
  host-minted opaque `attempt_id` (32 hex CSPRNG, `mint_attempt_id`). Returns plain prompt data —
  every `ApprovalPrompt` field, plus a row-scope sentence and, when the shell's own active SQL
  filter would have applied, the filter-scope sentence in words (never silently dropped — the
  conditional block's own requirement, discharged verbatim as
  `FILTER_SCOPE_SENTENCE`).
- `binding_publish_execute(attempt_id, typed_phrase)` **takes** the pending attempt (single-use —
  a second call on the same id always misses, `PendingAttempts::take`), opens a **fresh**
  `AuditLog::open_for` for this attempt alone (closing F-9 by construction, not convention — the
  shell never holds a log across attempts; proven by test:
  `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt`), and
  runs `permission::boundary::execute` with a `ShellApproval` carrying the already-typed phrase.
  `publish::publish_unguarded` is never called from this crate — the sole-caller source scan
  (`kernel/tests/permission_boundary.rs`'s own property) is extended to
  `frontends/shell/src-tauri/tests/sole_caller_scan.rs` (F-2/F-4).

**"The requester never mints the grant" (F-5's binding rule), made concrete for this surface:**
JS supplies exactly four kinds of input across the whole seam — an opaque, catalog-resolved
`dataset_handle`; a style document's own text (content, not an identity claim); a `scope` shape
(`WholeFile` or `ViewportBbox`, a **query** parameter, never a member of `SourceScope` or
`DestinationScope`); and, later, only `attempt_id` + the operator's typed phrase. None of these
becomes the grant's authority directly: `SourceScope` comes from `ContentPin`, a kernel-held fact
about bytes the host already pinned; `DestinationScope` comes from the native OS picker's own
answer, never a JS string; `Principal` comes from the host's own environment read, never anything
JS asserts about who is asking. A compromised or careless page script can ask this surface to
*attempt* a publish, but it cannot manufacture the grant that attempt is checked against — the
mint happens host-side, from host-held facts, exactly as it does for `publish-bundle`'s own
library callers (`kernel/PERMISSION-BOUNDARY.md`'s "the grant mechanism's teeth are at the library
boundary" carried forward unchanged).

**The dev-only E2E test seam does not weaken this property — it narrows only which *fact source*
supplies the destination.** WebView2's native save dialog has no CDP-reachable automation path at
all (unlike the admission flow's `openPath`, whose picker is a *separate* Tauri command an E2E hook
can simply not call), so proving anything past the picker needed a host-side seam:
`binding_publish_prepare_e2e_destination` (`commands.rs`) accepts a destination string directly and
otherwise calls the **identical** `publish::prepare` the real command calls — the grant is still
minted host-side, from the supplied path, via the same code the operator's own click runs. What
changes is only that an operator's OS-level dialog interaction did not produce that path this time.
This command is `#[cfg(debug_assertions)]` on both its own definition and its entry in `lib.rs`'s
`generate_handler!` list — `tauri-macros`' own codegen applies each list item's attributes to its
generated match arm, so this genuinely removes the command from a release build rather than merely
disabling it at runtime, the same guarantee `npm run build` gives the JS-side `openPath` hook.
**Known limitation, the same one ADR-020 already named for this exact idiom in this crate**
(`lib.rs`'s `webview_origin` selector): `tauri build --debug` retains `debug_assertions`, so a
*packaged* debug build would still carry this seam. Not exercised or closed by this piece.
**`e2e/publish.mjs` therefore does not exercise the native picker itself — only the operator's
manual walkthrough (MANUAL-WALKTHROUGH.md Part G) does.**

**Approval: DOM, one comparison, in Rust.** `PublishDialog.tsx` renders `PublishPromptData`'s own
informational fields verbatim, in a fixed order: `operation`/`class`/`reversibility` (the header
line), `source_name`, `source_content_hash`, `style_hash`, `destination_display` (the full string,
never truncated), `grantor` (with the host's own `grant_remaining_s`, shown once, never
re-derived), `row_scope`, and — when present — `filter_scope`, in its own alert block. **No
`confirmation_phrase` field exists on `PublishPromptData` at all, and this is corrected wording,
not a restatement**: an earlier version of this seam carried one, serialized to JS but never
rendered by anything, which made an earlier draft of this very sentence — "the phrase never
crosses into JS" — literally false as written (`publish.rs`'s struct definition and `types.ts`'s
mirror both declared it; only the dialog's own render list omitted it). Dropping the field
(reviewer gate, publish cut B1) is what makes the claim true rather than aspirational: the host now
has nothing to hand the page even if it wanted to. The dialog's own instruction tells the operator
to type "the destination's final path component"; the typed value carries back to the host
completely unexamined by this component — **the phrase never enters `submitPublishAttempt` at
all, structurally**: that function's own signature has no parameter for an expected value to
compare against, proven rather than merely observed by `PublishDialog.test.ts`. **A script —
including `e2e/publish.mjs` itself — can still derive the expected phrase from
`destination_display`'s own basename**, the same value a careful operator would read off the
rendered `Destination` field; consistent with the limitation stated below, this is
defence-in-depth against operator error, never a secret the host is withholding from anything
capable of deriving it on its own. The one comparison (`permission::approval::check`) stays in
Rust, reached only after the DOM submits. Never defaulted: the confirmation field starts empty and stays
empty on every code path; no don't-ask-again; no remembered or standing approval (a fresh
`attempt_id` and a fresh `PublishDialog` instance for every attempt); Enter-on-empty is inert; no
default or last-used destination (the native picker is asked fresh every time); no pre-selected
license values; one prompt, no retry loop (`nextPublishDialogState` has no transition back to
`"confirming"`). **Stated limitation, and it is a limitation of the mechanism, not an oversight:**
DOM approval proves *deliberateness against operator error* — a stray click, a slip, a browser
autofill — it does **not** prove anything against an in-page script that could call the same
`execute()` function this dialog's own Submit button calls, with any string it likes. `e2e/publish.mjs`
is the proof of exactly that limitation: it "approves" a publish through the identical seam a real
operator's click uses, driven entirely by an automated script, and the boundary cannot and does
not distinguish the two. This is an **independent reason**, beyond ADR-017's own acceptance
condition, that MCP and AI-driven exposure stay fenced (`kernel/PERMISSION-BOUNDARY.md` item 5): an
approval arriving from an LLM host over any future control-plane surface is precisely `docs/09`'s
"tool calls derived from data-borne text require approval" case, and a DOM comparison proves
nothing about that case at all. `docs/03`'s "one-click publish… no SaaS backend" reads as a claim
about hosting architecture, not about confirmation — `docs/01`'s approval-gated rule for class-3
operations governs regardless, and this surface's one prompt is where it is discharged.

**`ApprovalRoute::ShellDialog` within `spatial-audit/1`.** A third value in `approval_route`'s
domain (`"shell-dialog"`), not a schema version bump — `spatial-audit/1`'s tag is unchanged, and
the outcome record's fixed 16-key set is asserted unchanged by test
(`shell_dialog_serializes_as_shell_dialog_and_the_key_set_is_unchanged`). **Dated no-external-readers
justification, 2026-08-16:** a reader that tolerated an unrecognized `approval_route` string would
see a third channel rather than a schema break; this crate's own reader is not that tolerant, but
no external reader of `spatial-audit/1` is known to exist as of this date — the same posture
`kernel/PERMISSION-BOUNDARY.md`'s "8 MiB × 4 remains one module's ceiling, not project policy" takes
about a different field. **Expiry clause, stated so this cannot be forgotten:** this justification
holds only for as long as it remains true that nothing outside this log's own writer and its own
reader reads it. The day an external reader exists — a log viewer, a support tool, an aggregator,
any second consumer of `spatial-audit/1` — this value-domain widening becomes a real schema
decision this ADR did not make, and needs its own. **QUEUED for the human, as an explicit decision
item** (`NEXT-CUT.md`'s Design/Audit paragraph), not settled by this filing.

**One `AuditLog` per attempt (F-9), closed by construction.** `execute()` calls
`AuditLog::open_for` fresh on every call — never a log the shell holds across attempts — proven by
test with two attempts pointed at two different `SPATIAL_IDE_AUDIT_LOG` paths, each log holding
exactly its own intent+outcome pair and nothing of the other's.

**A second bound this same design change exposed, found and fixed at this cut's own reviewer
gate, and recorded here because it corrects a claim `kernel/PERMISSION-BOUNDARY.md`'s own "Append"
row makes** ("`OpenOptions::append`, one in-process mutex held across open → write → `sync_all`"):
that row is true of a caller that only ever holds ONE live `AuditLog` at a time (`publish-bundle`'s
own shape) — it says nothing about two *different* `AuditLog` instances, each with its own gate,
writing the same file concurrently, which per-attempt `AuditLog::open_for` makes an ordinary case
the moment two publish attempts are approved close together. **This ADR supersedes that row**: the
gate (`kernel/src/permission/audit/log.rs::AUDIT_LOG_GATE`) is now a single **process-global**
`Mutex`, not one per instance, held across open/rotate → write → sync for every `AuditLog` in the
process — so no two instances, and no concurrent rotation near the size ceiling, can interleave
with each other. Proven by test
(`log::tests::concurrent_audit_log_instances_never_interleave_a_line`: twelve threads, twelve
concurrently-live `AuditLog` instances, one shared log file, every resulting line still parses and
none is lost).

**Row scope: exactly ADR-017 §8's two shapes, plus the preflight refusal, and nothing else.**
`PublishScope` is `WholeFile | ViewportBbox { bbox }` — a query parameter composed into
`ViewportQuery` inside `to_query()`, `filter: None` always, never a member of `SourceScope` or
`DestinationScope`. An active SQL predicate is refused by `publish::preflight`
(`PublishError::RowFilterNotRecordable`, P0) before any grant, before any audit record, before any
staging directory — a filter-active publish is not silently narrowed to whole-file, it is
**refused outright**, and when the shell's own filter would have applied but is not what is being
published, the prompt says so in the filter-scope sentence rather than letting an operator publish
more than they think they are (`e2e/publish.mjs`'s own `FILTERED'` step exercises exactly this: the
sentence is present, and the resulting bundle's row count is the full dataset's, verified both by
the manifest's own claim and by an independent reader's decode).

## Consequences

- **`Principal::from_environment()` remains unverified.** `USERNAME`/`USER` is what the process was
  told, not what the OS knows; `PrincipalKind::OsUser`, never `authenticated-user`. This shell
  surface's grantor is exactly as unverified as `publish-bundle`'s own — nothing here authenticates
  anyone, and nothing here claims to.
- **Grants remain non-persistent.** `Arc<Mutex<GrantSet>>` in Tauri managed state, dying with the
  process; nothing is written, nothing is read back — the same justification
  `kernel/PERMISSION-BOUNDARY.md`'s "Non-persistence" section already gives, carried unchanged into
  this surface.
- **Audit-log retention stays open, per F-1.** This cut adds a second caller (the shell) sharing
  the existing 8 MiB × 4-generation ceiling declared for `publish-bundle`; `docs/09`'s "To be
  specified: audit-log retention" is retention across every class-3 operation and every client, and
  this ADR does not settle it.
- **Filtered-subset bundles remain out of reach, by construction.** Publishing the SQL-filtered
  subset would be `bundle_version` 2 — the ADR-021 materialization fence, and a candidate future
  **ADR-025**, which this ADR does not schedule or license. The human's to schedule (QUEUED).
- **The dev-only E2E test seam is a named, bounded carve-out** (Decision, above): compiled out of a
  release build, and even through it the grant is minted host-side from the supplied destination —
  but an E2E run through it never exercises the real native picker, which is why the operator's
  manual walkthrough (P5) remains a required, distinct piece of evidence, not a redundant one.
- **`ensure_pinned`'s own pin phase is uncancellable and unreported** (`publish.rs`'s own doc
  comment on that function, verbatim in substance): it runs on `spawn_blocking`, so it does not
  block the whole app, but during `binding_publish_prepare`'s "Preparing…" state it has **no
  cancel affordance and no progress report of its own** — `docs/01` principle 7's progress/cancel
  clause is unmet for the pin phase specifically. Invisible on this cut's own evidence fixtures
  (2 000–100 000 features, pins in well under a second); a real gap for a `docs/07`
  hero-slice-scale (5 GB) publish attempt through the shell UI, where the same whole-file SHA-256
  hash that is instant on a small fixture becomes a multi-second-to-multi-minute wait with no way
  to see progress or back out. Not built or closed by this ADR — a cancellable, progress-reported
  pin step is design work beyond this cut's own evidence-and-ADR scope, named here rather than
  silently absorbed.
- **The exposure review this ADR's own Status line names is discharged ONLY by the human.** Filing
  this ADR, the reviewer gate over this cut (P5), and even a green `e2e/publish.mjs` run are all
  evidence *for* that review — none of them **is** it. Nothing in this document may be read as
  having lifted `kernel/PERMISSION-BOUNDARY.md`'s F-10 ruling or ADR-017's "developer/test tooling
  until then" restriction; that restriction lifts, if it lifts, only on the human's own word.

## What this ADR does not decide

- **SKP, MCP, plugin, notebook, or AI exposure of publish.** ADR-017's acceptance condition remains
  unmet for every one of these; `SKP-V0.md` §4 items 1/11 name publish's binding-local commands as
  excluded from the SKP catalog, not as a future SKP surface this ADR has pre-approved.
- **Standing or reusable grants, or any grant-issuing surface.** `kernel/PERMISSION-BOUNDARY.md`
  items 3/4 remain open; this surface mints one grant per prepared attempt, in-process, and issues
  nothing to a caller.
- **Grant persistence or revocation.**
- **Authentication of any kind.**
- **Audit-log retention policy** (F-1, open — see Consequences).
- **Publishing the SQL-filtered subset** (`bundle_version` 2; the ADR-021 materialization fence;
  queued as candidate ADR-025, the human's to schedule).
- **Attribute-projection publishing UI.** `style_attributes()`'s automatic derivation from the
  active style document is not a selection surface, and ADR-017 §16's 32-attribute cap is
  unchanged; no UI here lets an operator choose which attributes publish.
- **Remote destinations, upload, hosting, or sharing** (ADR-008's own static-publishing scope,
  unchanged).
- **`--replace`, republishing, or deletion** (ADR-017 §15, still open).
- **Scheduling or batch publishing.**
- **Persisting styles or project files.** ADR-022's own class-2/`docs/11` obligations remain absent
  and unaddressed by this ADR; a style crosses this surface as `style_source: &str` from memory,
  never written anywhere.
- **The exposure review itself.** Discharged only by the human (Consequences, above) — this ADR is
  evidence toward that review, not a substitute for it.
