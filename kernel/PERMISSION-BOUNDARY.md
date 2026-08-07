# The class-3 permission boundary

**What exists as of 2026-08-07**, and — more important — **what exposure still requires**.

ADR-006 gives external side effects three obligations: *audit log · explicit approval · declared
reversible / compensatable / irreversible*. Until this cut only the third existed, and both
`kernel/README.md` and ADR-017 §15 recorded the other two as **owed and absent**. They now exist.

**Nothing here is exposed.** No SKP message is defined, nothing in `protocol/` is touched, and no
served surface reaches the operation. [What exposure still requires](#what-exposure-still-requires)
is the list.

### Two requirements, from two different authorities — do not merge them

This is worth getting exactly right, because an earlier draft of this file merged them and thereby
misquoted an accepted, immutable ADR.

- **ADR-017's acceptance condition** (Status block) says: *before* publish is exposed through SKP, a
  shipped CLI/UI, MCP, a plugin, a notebook or an AI surface — and no later than Prototype exit —
  the kernel must enforce a scoped publish grant, explicit approval and a redacted audit record;
  *"until then `publish-bundle` remains developer/test tooling only."* **That is one requirement:
  machinery before exposure.** Corrigendum 2 confirms the condition is unchanged in every respect.
- **A reviewed exposure surface** is required by the **human's brief for this cut**, not by ADR-017.
  It is recorded here because that brief is deleted when this cut lands, and an instruction that
  survives only in a deleted file is an instruction nobody can check.

**On ADR-017's literal wording the machinery half is now met**, which raises a question this cut does
not answer: whether *"until then"* has lapsed of its own terms and the tooling-only restriction with
it. This file's position is that it has **not**, because the human's brief attaches the further
condition above — but that is a reading, and the custodian owns it. Recorded as **F-10**.

### The five design points this cut's brief sent to the architect

Listed so the claim "all five were settled" is checkable against this file rather than against a
commit message. Each links to where it is settled:

| | Design point | Settled in |
|---|---|---|
| 1 | The grant object's **scope grammar** | [Grant and approval are different questions](#grant-and-approval-are-different-questions), [Scope is checked against facts](#scope-is-checked-against-facts-never-against-the-request) |
| 2 | **Where grants live** in the kernel | [Non-persistence and the docs/11 boundary](#non-persistence-and-where-the-docs11-boundary-sits); `kernel/src/permission/grant.rs` |
| 3 | The **approval flow**, interactive and non-interactive | [Grant and approval](#grant-and-approval-are-different-questions), [There is no approval timeout](#there-is-no-approval-timeout) |
| 4 | The **audit record**'s schema, location, append-only mechanism and redaction rules | [The audit log's declared properties](#the-audit-logs-declared-properties) and its four subsections |
| 5 | The **SKP-facing seam** future exposure uses without redesign | [What exposure still requires](#what-exposure-still-requires) |

On point 5, concretely: the seam is `trait ApprovalSource` plus `boundary::execute`, both in
`kernel/`. `ApprovalPrompt` is deliberately plain-data shaped — owned `String`s, no `Path`, no
borrowed engine types — so a future SKP approval request is a transcription of it rather than a new
type. **Nothing in `protocol/` is touched**, because `docs/02` puts permissions in the kernel and SKP
in `protocol/`, and warns that collapsing the two is how the SKP surface gets absorbed. Authorization
is kernel policy; transport is protocol mechanism.

---

## The model, in one pass

A class-3 operation runs only if **all** of these hold, in this order:

| | | Refusal | Who does it |
|---|---|---|---|
| 1 | Everything decidable without writing is decided — names, licenses, projection, style | the existing `PublishError` set | `publish::preflight`, via the boundary |
| 2 | The audit log resolves, sits outside the bundle, is under its ceiling, and **opens for append** | `AuditError::{Unwritable, LogInsideDestination, RotationFailed}` | **the caller**, via `AuditLog::open_for` |
| 3 | An **intent record** is written and synced | `AuditError::{Unwritable, CredentialInRecord, ControlCharacterInField, Canonical}` | the boundary |
| 4 | A **grant** authorizes this operation kind, this source, this destination, and has not expired | `PermissionError::{NoGrant, GrantScopeMismatch, GrantExpired}` | the boundary |
| 5 | An **approval** naming the destination is given | `PermissionError::{ApprovalRefused, ApprovalUnavailable}` | the boundary |
| 6 | The grant still holds, against a fresh clock reading | as 4 | the boundary |
| 7 | The operation runs | the existing `PublishError` set | `publish::publish_prepared` |
| 8 | An **outcome record** is written | on success: `BoundaryError::OutcomeNotAudited`. **On a failing terminal there is no second error** — the audit failure goes to stderr and the original refusal is what the caller gets, because losing why the operation failed would be the worse trade | the boundary |

**Step 2 is the caller's, and that is a real seam rather than a detail.** `AuditLog::open_for`
cannot be bypassed — the constructor is the only way to get an `AuditLog` and it always probes — but
it is handed a destination, and `boundary::execute` re-checks the inside-the-bundle rule against the
destination actually being published so that rule does not depend on the caller passing the same
value twice. Steps 3–8 are the boundary's alone.

`kernel/src/permission/boundary.rs` is the only path through steps 3–8, and
`kernel/tests/permission_boundary.rs` asserts that with a scan over this crate's own source.

`PermissionError` also carries `GrantCeilingExceeded`, `GrantLifetimeExceeded` and
`DestinationUnresolvable`; the first two refuse when a grant is *issued* rather than checked, and the
third before step 2.

### Grant and approval are different questions

The **grant** authorizes a class and a scope — *this operator may publish this dataset to this
destination class until then*. The **approval** confirms *this execution*. Both are checked, each
produces its own typed error, and neither substitutes for the other. This is `docs/09`'s "export and
publish are distinct capabilities, never implied by write" carried one step: holding a capability is
not the same as having deliberately exercised it.

The division of labour is also what makes the confirmation phrase workable. The phrase is the
destination's **final path component**, which cannot distinguish `A/parcels` from `B/parcels` — and
does not need to **when the grant is independent of the request**, because `DestinationScope` is
then checked against the resolved destination and catches exactly that case.

**That complementarity is a property of a library caller, not of the CLI**, and saying otherwise
would be the neatest sentence in this document and a false one. At the command line the grant is
minted from `--out` (see below), so it moves with `--out` and catches nothing about it. Concretely:

| | caught by |
|---|---|
| a `y`-reflex | the approval, always |
| `--approve` naming a *different basename* than `--out` | the approval, always |
| `--out` moved from `A/parcels` to `B/parcels`, `--approve parcels` unchanged | **neither, at the CLI** — a library caller with an independent `GrantSet` catches it on the grant |

### Scope is checked against facts, never against the request

The content hash comes off the dataset's own pin. The destination comes from
`resolve_destination()`, which canonicalizes the parent and rejoins the final component — both sides
of every comparison go through that one function, so Windows' `\\?\` prefix cancels out instead of
silently mismatching. The dataset **name** is the one member taken from the request, legitimately:
it is not a description of the operation, it *becomes* `spatial://dataset/<name>` in the manifest, so
a grant for `parcels` must not authorize publishing byte-identical data as `internal-parcels`.

This is ADR-015's claim-versus-fact discipline. A grant checked against what a request says about
itself would be checking the claim rather than the thing.

### There is no approval timeout

`std` cannot read a line from stdin with a deadline. A reader thread leaves an uncancellable
`read_line` blocking the process; `tokio` would work but the publish path is deliberately
synchronous and the CLI already isolates tokio to one thread for Ctrl-C alone. So a timeout is
**deferred with reason** and `RefusalReason` has no `Timeout` variant to imply otherwise. Terminal
detection is not attempted either — `std` has no `isatty`.

What supplies the property a timeout would have: **the grant is checked twice**, once before the
prompt and once after approval against a fresh clock. However long an operator takes, a stale
approval cannot ride an expired grant, and the bound is the grant's own declared lifetime rather
than an arbitrary deadline.

---

## The v0 single-user reality, stated rather than obscured

**The grantor and the operator are the same OS user, and at the command line the tool mints its own
grant from the very request it is about to authorize.** Stated as bluntly as it deserves:

- **The source half is a tautology.** `publish-bundle` grants itself the dataset it just opened and
  pinned, so the check can only fail if the file changes underneath between pin and boundary.
- **In the default invocation the destination half is a tautology too.** With no
  `--grant-destination`, the scope is `DestinationScope::exact(&out)` — minted from `--out`, checked
  against `--out`. It cannot fail. **So the ordinary command line's grant checks nothing.**
- **`--grant-destination <dir>` is the only part that is not a tautology.** It scopes the grant to a
  directory the operator names *separately* from `--out`, so a publish aimed outside that directory
  is refused. That is a real check, and it is opt-in.

So at the command line, what gates the operation is the **approval** and the **audit record**. The
grant's contribution in the default case is that it exists, carries a grantor, expires, and forces
the single path — not that it authorizes anything the request did not already assert. **The grant
mechanism's teeth are at the library boundary**, where a caller supplies a `GrantSet` it did not
derive from the request; that is where the scope-mismatch and expiry tests live, and it is the shape
a future grant-issuing surface would have.

`Principal::from_environment()` reads `USERNAME`/`USER`/`LOGNAME`. That is **what the process was
told**, not what the operating system knows, and the kind is `os-user` rather than
`authenticated-user` because the second word would be false. No authentication system is built and
none is claimed.

The object model does not *assume* the single-user case: a grant carries its grantor, and
`PrincipalKind` has room for kinds that do not exist yet, so multi-principal is a data change rather
than a redesign.

---

## Non-persistence, and where the docs/11 boundary sits

**Grants are in-process and die with the process.** Nothing is written, nothing is read back.

The justification has the same shape as `protocol/data-plane/src/session.rs`'s keychain deferral, and
carries the same expiry clause: **it holds only while nothing outlives the process, and it is void
the moment something does.**

Persisting a grant would make it a resource, and `docs/11` then applies in full — a stable URI, a
schema, a lifecycle, provenance. `docs/14`'s plain-text rule would apply to its format. A revocation
design would become necessary, and ADR-017 already leaves revocation open. And because a persisted
grant authorizes an irreversible act, it would need its own integrity story. **None of that is in
this cut**, which is why grants are not persisted rather than persisted badly.

---

## The audit log's declared properties

| | |
|---|---|
| **Location** | `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl` (Windows); `$XDG_DATA_HOME` or `$HOME/.local/share` elsewhere |
| **Override** | `SPATIAL_IDE_AUDIT_LOG`, absolute path. **No value turns it off** |
| **Format** | one canonical-JSON object per line (JSON Lines), fixed key sets, `schema: "spatial-audit/1"` |
| **Append** | `OpenOptions::append`, one in-process mutex held across open → write → `sync_all` |
| **Rotation** | at **8 MiB** (`MAX_AUDIT_LOG_BYTES`) — **checked when a log is opened, not while it is written**; see below |
| **Retention** | **4** generations (`MAX_AUDIT_LOG_GENERATIONS`); the oldest is **deleted**. ≈40 MiB, ≈39 000 publishes — arithmetic below |
| **Unwritable** | **the operation refuses**, before any side effect |
| **In the bundle** | never — a log resolving inside the destination is refused, twice: at `open_for` and again in `execute` against the destination actually being published |

**JSON Lines rather than one array** because the log's purpose is to survive interruption, and a
top-level array is unparseable after any partial write. Line framing does not depend on the escaper:
a field containing a control character is refused before serialization.

**JSON here is not an ADR-004 violation, and the distinction is the same one ADR-017 §5 already
draws** for the manifest: ADR-004 forbids JSON on **data hot paths**. An audit record is a
control-plane fact written twice per operation, and reading the rule one level too high would forbid
the manifest as well.

### Where the retention number comes from

A record pair is **measured, not estimated**: 1 053 bytes for a successful publish (555 intent + 498
outcome, newlines included), from this repo's own boundary-test logs. Refused attempts are smaller —
**911–951 bytes across the eight refusal cases in that suite** — because the outcome carries no
digest, manifest hash or counts. The success pair is used below because it is the larger, so the
resulting count is the conservative one.

```
8 MiB / 1 053 B  ≈  7 900 publishes per generation
× 5 files (live + 4 kept)  ≈  39 000 publishes retained
```

**This is a size, not a budget, and it is not a `docs/08` measurement of anything.** It also moves
with the data: the destination is recorded, so a long path makes records bigger and the count
smaller. Take ≈39 000 as an order of magnitude with a stated basis, not a guarantee.

### The ceiling is checked when a log is **opened**

`AuditLog::open_for` resolves, rotates and probes. `append` does none of that. Because every caller
today opens one log per attempt, the bound holds — but it holds **because of how the log is used,
not because the log bounds itself**. A future served surface holding one `AuditLog` across many
attempts would grow the live file without limit. Recorded as **F-9**.

**What the append does and does not guarantee.** Append mode positions every write at end-of-file at
write time on both platforms, so two appenders do not overwrite each other's bytes; the mutex means
this process never interleaves with itself. That is the whole of the atomicity claimed. A single
`write` is not atomic in general — records are a few hundred bytes, far below any plausible
threshold, but that is a practical expectation, not a standard, which is the second reason for
JSONL: an interleaved line **fails to parse and is visibly corrupt** rather than silently changing a
valid record's meaning. Nothing serializes two concurrent processes; `std` has no portable file
locking, and that is declared rather than closed — the same posture `Staging::finalize` takes about
its residual TOCTOU race.

`sync_all` runs per record, because an intent sitting in a buffer when the power goes is an intent
that was never recorded. **Its cost is unmeasured and no latency figure is claimed** (`docs/08`).

### Two phases, and what the log promises

An **intent** record is written before the operation is authorized; an **outcome** record at every
terminal. An interrupted publish therefore leaves an intent with no outcome — a readable state
meaning *this started and we do not know how it ended* — rather than leaving nothing.

Intent comes **before** the grant check on purpose: an unauthorized attempt is still an attempt, and
a log recording only what passed the gate cannot answer the question an audit exists for.

**What the log promises is: every attempt that reached the gate is recorded, authorized or not.** It
does not promise a record of every command typed. Everything that refuses at or before the intent
write leaves **nothing**, and the list is longer than the obvious one:

- all of `preflight`'s refusals — `SourceNotPinned`, both license refusals, the three
  `ViewerLicense*` ones, `CorrespondingSourceNotDurable`, `DatasetNameRejected`, `Style`, `Engine`;
- `DestinationUnresolvable`;
- the three ways establishing the log can fail — `Unwritable`, `LogInsideDestination`,
  `RotationFailed`;
- **and the two ways the intent record itself can be refused**: `CredentialInRecord` and
  `ControlCharacterInField`. These are the least obvious and the most worth stating, because they
  are the case F-3 describes: publishing to `D:\secret-maps\out` is refused **with no audit record
  at all**. The record that would have described the attempt is the thing that was rejected.

The ordering is deliberate: nothing on that list is an attempt to *do* the operation, and an intent
record carries the source and style hashes that `preflight` produces, so writing it earlier would
trade a worse record of real attempts for a record of malformed ones.

**`AuditError::Unwritable` is necessarily absent from the log**, because the log is what failed.

### Redaction on the record itself

The destination **is** the record's subject, so it is recorded — with user-profile prefixes
normalized to tokens (`<user-home>`, `<temp>`, …), longest match first, at path-component boundaries
only. `docs/09`'s scan (`kernel/src/bundle/redaction.rs`) then runs over the rendered line:

- a **`credential`** finding is **fatal** — the record is not written, and at the intent record that
  means the operation does not run.

  **This is stricter than `docs/09`, and the difference is a choice rather than a mandate.**
  `docs/09` says secrets are *redacted from* logs; this *refuses to write the record and aborts the
  operation*. Redacting instead would mean blanking the record's own subject, which would leave an
  audit entry that no longer says where anything went — so refusing is the better failure, but it is
  a decision, and F-3 is its operator-visible cost. What is genuinely `docs/09`'s and is carried
  unchanged: the rule does not become conditional because a field was deliberately supplied.

  **At the *outcome* record the operation has already run**, so a credential first appearing there
  (only `grantor_name` can carry one) refuses the record, not the publish — which is
  `OutcomeNotAudited`'s case: a bundle exists and the log does not say so;
- `local-filesystem-path`, `username` and `machine-identifier` findings are **recorded** in the
  record's own `residual_classes`, so the log states its own leakage instead of hiding it. A flat "no
  findings" rule would make every record unwritable, since the destination is the subject and a path
  is never attributable.

**Declared limits**, all four:

- Normalization is **component-exact**: a username inside a longer component (`D:/someone-maps/out`)
  is left alone, because rewriting it would corrupt a real directory name. The record names
  `username` in `residual_classes` instead.
- **A root this cannot read from the environment is a root it does not normalize.** On a machine
  where `TMPDIR` is unset, `/tmp/...` matches no root and is recorded as it is.
- **`residual_classes` is a report on the drafted line, not a proof about the written one.** The
  guarantee that holds over the bytes actually written is the **credential** one.
- **The scan's own floor applies here as it does to bundles**: a match is reported only inside a
  printable-ASCII run of at least `MIN_PRINTABLE_RUN` = 12 bytes (ADR-017 §13). So a short path or a
  short username in a short run is not a finding at all — a second, independent reason
  `residual_classes` under-reports rather than over-reports.

### This is not the ADR-006 class-2 command/event log

`kernel/README.md` already warns in the other direction — that the workspace-mutation log "would not
serve as an audit record for an external side effect even if it existed". The converse holds too:
**this log is class-3 only. It is not a transaction log, it does not participate in undo, and it
replays nothing.**

It is also **deliberately not a `docs/11` resource** — no stable URI, no schema negotiation, no
lineage, no reproducibility grade, referenced by no project. This is the one place `docs/01`
principle 1 is knowingly not applied, because applying it would put the log *in the project*, and it
must not be: it audits one machine, is per-user, and ships nowhere.

---

## What exposure still requires

ADR-017's acceptance condition needs the machinery **and** a reviewed exposure surface. The machinery
exists. **None of the following is in this cut**, and each is required before publish may be reached
through SKP, a shipped CLI, MCP, a plugin, a notebook or an AI surface:

1. **An SKP control-plane message pair** for the approval request and response, specified in
   `protocol/` with version negotiation, capability discovery and an error taxonomy (`docs/10`), and
   passing the normative conformance suite.
2. **Authentication and authorization on that surface.** `Principal::from_environment()` is
   unauthenticated; recording an unauthenticated *remote* identity as a grantor fact is exactly what
   ADR-015 refuses in the CRS case.
3. **A grant-issuing surface.** Today grants are constructed in-process by the composition root;
   there is no way for a client to request one. Issuance is where persistence becomes hard to avoid.
4. **A decision on grant persistence and revocation**, with the `docs/11` and `docs/14` consequences
   above.
5. **For MCP specifically:** an approval prompt is control-plane-shaped and admissible, but a class-3
   approval arriving from an LLM host is precisely `docs/09`'s "tool calls derived from data-borne
   text require approval" case, and needs its own review.
6. **A non-blocking `ApprovalSource`.** `StdinApproval` blocks its thread. Reached through SKP on a
   kernel thread it would block the kernel for human-scale time, which *is* `docs/01`'s "never block
   the canvas". At a command line there is no canvas and no operation running yet — the prompt is
   asked before the operation starts — so principle 7 has nothing to attach to. That reasoning
   inverts completely at exposure. **This implementation must not be inherited.**
7. **The human's review of the exposure surface itself.** No architect verdict substitutes for it.

---

## Flagged for the human

Recorded here rather than resolved. Most are decisions the custodian owns; **F-5 and F-6 are a
disclosure and an already-taken constraint**, listed alongside them because they are the two things a
reader most needs not to miss.

**F-1 — `docs/09`'s "To be specified: audit-log retention" is not closed.** This cut declares
8 MiB × 4 generations for *one* log in *one* module. `docs/09`'s item is retention across every
class-3 operation and every client. The values above are offered as the first datum; the item stays
open, and settling it is an ADR rather than an edit to `docs/09`.

**F-2 — a public library function still performs an ungated class-3 side effect.**
`spatial_kernel::publish::publish_unguarded` is `pub` and callable with no grant, no approval and no
audit — `kernel/tests/publish.rs` calls it about thirty times. The alternative, `pub(crate)`, would
route the entire bundle-format suite through the authorization model, so a grant bug would fail
thirty *format* tests with nothing saying which property broke. The mitigations are the name and the
sole-caller scan; the residual is real. Options if the custodian wants it closed: a cargo feature
gate, or a `#[doc(hidden)]` experimental seam on the `IndexUse` precedent.

**F-3 — the credential scan will refuse some legitimate destinations.** `CREDENTIAL_NEEDLES`
contains bare words (`secret`, `password`, `apikey`, `credential`), so a destination like
`D:\secret-maps\out` produces a `credential` finding and refuses the publish. The refusal names the
matched class and offset, and the check is deliberately unconditional. A narrower needle set for
audit records than for bundles is available, but it weakens an unconditional rule and should be a
decision, not a default.

**F-4 — the sole-caller property is enforced by a source scan, not by visibility.** A line-oriented
text scan defeats none of: an aliased import, a function pointer, or unusual spacing. The surface is
small and the entry points are named to warn, but the property is "no line in `kernel/src` names
these outside the boundary", not "no path can reach them".

**F-5 — the CLI's default grant is self-minted and checks nothing.** Both halves are tautologies
unless `--grant-destination` is supplied: the source is the dataset the tool just pinned, the
destination is `--out` compared against `--out`. See
[the v0 single-user reality](#the-v0-single-user-reality-stated-rather-than-obscured). This is the
most important honesty point in the cut and must not be read as the CLI having obtained authority
from anywhere. It is a **disclosure**, not a question — listed here so it cannot be missed.

**F-6 — a blocking approval must not survive exposure.** Item 6 above, recorded as a binding
constraint on any future `ApprovalSource` so it cannot be shipped quietly.

**F-7 — the audit log is knowingly not a `docs/11` resource.** Reasoning above. A future reading of
principle 1 that makes audit records typed artifacts would change it.

**F-8 — `docs/09` and this design: subset, with one boundary named.** `docs/09`'s grant grammar is
`read dataset A / network only to domain Y / cannot publish / expires in 20 minutes`. Expiry is
consistent (its own 20 minutes is adopted as the ceiling); the source scope is the same shape with
one operation kind; default-deny expresses "cannot publish" as "no grant". **Where the subset stops
being one:** a default-deny store *cannot* express "may do everything **except** publish", which
becomes necessary the moment a second class-3 operation exists. And `docs/09`'s "grants attach to any
client — plugin, AI agent, notebook — through the one extension surface" describes where grants
attach *once clients exist*; that sentence becomes binding at exposure, and
`Principal::from_environment()` becomes inadmissible as a remote grantor at the same moment.
**No `docs/09` text is proposed for change.**

Two further `docs/09` lines this comparison does **not** reach, named so the subset claim is not read
wider than it is:

- *"Every action by a user, plugin, or AI agent is attributable and logged"* (§Posture). This log
  covers **one operation kind**, records nothing before the intent point (see the list above), and
  its principal is unauthenticated by construction. Attributable-in-principle, to an unverified name.
- The credential divergence in **S-4 above**: `docs/09` says redact, this refuses.

**F-9 — the rotation ceiling is enforced per opened log, not per log.** `AuditLog::open_for` rotates;
`append` does not. Every caller today opens one log per attempt, so the ~40 MiB bound holds — by how
the log is used, not by the log. A served surface holding one `AuditLog` across attempts would grow
the live file without limit, and because intent records precede authorization, an *unauthorized*
caller would drive that growth. Closing it means a size check on the append path, or a documented
requirement that a long-lived holder reopen. **Neither is done here.**

**F-10 — whether ADR-017's "until then" has already lapsed.** ADR-017's condition, read literally, is
one requirement: machinery before exposure. The machinery now exists, so on that reading
`publish-bundle`'s tooling-only restriction lapses of its own terms. This file takes the stricter
reading — that the human's brief attaches a reviewed exposure surface as a further condition — and
nothing in this cut acts on either. `docs/README.md` and `docs/02_Architecture.md` both carry the
"developer/test tooling until then" phrasing and would need a decision applied to them.
**The custodian owns which reading governs.**

---

## No ADR decides the permission model

This design's rationale lives in this file and in the module docs. That is a gap: every other
architectural decision of this size has an ADR, and `docs/02` puts permissions in the kernel without
saying what they are.

An **ADR-018 — the class-3 permission boundary** was drafted by the architect during this cut and is
**not filed**, for one reason only: **this cut's brief did not ask for one, and proposing an ADR is a
scope decision the custodian owns.** It is explicitly *not* because a Proposed ADR would look
decided — this repository already carries four (ADR-011, 012, 013, 016), `docs/README.md` says a
Proposed ADR binds nothing, and ADR-011 is named there as binding nothing by name. An earlier draft
of this section gave that reason and it contradicted the repo's own convention.

**So: an ADR is owed, and this file is the interim record.** It is a worse home than `docs/adr/` —
it is not numbered, not immutable, and not in the constitution index.

---

## Correction to a commit message in this cut

**`7694b30` ("refactor: extract publish's preflight…") states `cargo test --workspace: 314 passed,
0 failed, 2 ignored`. That number is wrong for that commit.** The correct figure there is **268
passed, 0 failed, 2 ignored** — the same as `main`, because that commit adds and removes no tests
(`git show 7694b30 -U0 -- kernel/tests/publish.rs` shows zero `#[test]` attributes added or removed;
the static workspace test count is 247 at both `main` and `7694b30`).

314 is `55c7683`'s figure — the commit that adds the 46 boundary and CLI tests — and that commit
reports it correctly. The number was carried backward into the earlier message from a later tree
state, so the refactor commit's evidence for "the full suite is green" is not reproducible **at that
commit**, though the claim itself is true (268 passed there).

**Recorded rather than rebased.** The branch is unpushed, so amending was available; it is not taken
because this repository corrects by appending — accepted ADRs, `RESULTS.md`'s post-run notes, and
`PRE-PUBLIC-CHECKLIST.md`'s custodian update all work that way — and rewriting four commits to hide
a wrong number is a worse precedent than leaving the number with a correction beside it. The
head-of-branch figure, **318 passed / 0 failed / 2 ignored**, is correct and independently
reproduced.

Found by the tester during the acceptance run, not by the author.

---

## Human rulings on the two flagged findings — 2026-08-07, recorded by the custodian

**F-10 — ruled: the stricter reading stands, and is made permanent.** ADR-017's literal wording
would let "developer/test tooling only" lapse on the machinery half alone; the review half was a
human instruction whose home (the cut brief) was deleted by design. A dated clarification is
appended to ADR-017 restoring it as a recorded condition: exposure through SKP, any shipped CLI/UI,
MCP, plugin, notebook or AI surface additionally requires that the exposure surface itself pass
review. The machinery existing is necessary, not sufficient.

**F-5 — ruled: accepted for v0, with one rule carried forward as binding.** The CLI's self-minted
grant checks nothing because grantor and operator are the same human; the gate's teeth are the
approval, the audit record, and the library boundary — which is where any future exposure calls.
The binding rule for that future surface: **the requester must never mint the grant.** A surface
that lets the caller manufacture its own authorization makes the boundary theater; grant issuance
stays on the human side of whatever line the exposure surface draws. This rule is part of the
review F-10 requires.
