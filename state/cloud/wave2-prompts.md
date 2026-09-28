*Custodian's filing note (2026-09-27): the wave-2 prompts file, copied from the human's untracked copy on the human's word (the 2026-09-27 wave-2 authorisation, `state/directives/2026-09-27-wave2-authorisation.md`, item 1, and the 2026-09-27 wave-2 confirmation, `state/directives/2026-09-27-wave2-confirmation.md`, item 1, which confirms the content as Fable's wave-2 file). Before copying, the source file itself hashed sha256 d9b3dabfda305ed165b494d3aa7d1e8dd2c3f14a278af53395a29aae864fc16a, 175 lines and 12,434 bytes, as the human stated. Everything below the rule is that file, byte for byte; the same hash is recomputed over those bytes. The assembled prompts, with the baseline written in, are filed beside their session IDs under `state/cloud/wave2/`. 2026-09-28: each deviation note that the custodian adds later sits under its own dated `#### Deviation` heading, the first one under W2-B. Removing each such section, from its heading line up to the next heading, restores the hash above.*

---

# Wave 2 — B1 and what landed since wave 1

*Fable, 2026-09-27. Same operating rules as wave 1; the custodian copies this file into `state/cloud/wave2-prompts.md` (tracked) before launch, and nothing tracked cites this untracked original. Nothing here authorises product changes, except W2-D, which needs its own brief sighted first.*

## 1. Why this wave, and what carries over

Wave 1 audited a baseline from before B1 and the watcher. Since then the product gained a **new untrusted input on the wire** (B1's `columns` projection on `viewport_query`, `skp/0.6`), a **new server-to-client event** (ADR-035's `dataset_session_ended`), and the **watcher's lifecycle code**. That's exactly where fresh, independent eyes pay.

Everything from wave 1 carries over unchanged: the result schema and triage rules (`state/cloud/wave1-prompts.md` §3 and §4), the recording format (§6), the evidence bar, the forbidden paths, the stop conditions, the DCO proof, and the two mechanics added before wave 1 launched: **the repo's hooks are inert in cloud sessions (#120)**, and **every session examines the baseline in a separate worktree, never by checking out in place.**

## 2. Before launch

- **Baseline.** `WAVE2_BASELINE` = the first main commit at or after `d6ec85af081fa05e4d30995224865da1bc743552` (B1's merge, #134) with product CI green on all workflows. The custodian writes the full SHA into every prompt uniformly and records the CI run links.
- **The promotion's end date.** Read it on claude.ai → Settings → Usage and record it in the wave-2 ledger. If fewer than three days remain, run the batches back to back; otherwise keep the pacing below.
- **Balance.** Record it before and after each batch, as in wave 1 (whole dollars, ±$1).

## 3. Items

| Item | What | Kind | Output |
|---|---|---|---|
| W2-A1 | B1 projection: conformance to its contract | audit | report; reproducer tests on its branch only |
| W2-A2 | B1 projection: hostile input and security | audit | report; reproducer tests on its branch only |
| W2-B | Property campaign on filter admission (ADR-021), now composed with projection | evidence campaign | report plus a branch of tests; **at most one PR**, for my click |
| W2-C | The watcher and ADR-035's event path: concurrency and lifecycle | audit | report; reproducers on its branch only |
| W2-D *(optional)* | Linux portability fixes for wave 1's D-1 to D-4 | implementation | one PR; **only after the custodian's brief is sighted by me** |

**Launch order:** W2-A1 and W2-A2 as a pair. Then W2-B and W2-C as a pair. Then W2-D, if I have sighted its brief and the credit allows.

## 4. The prompts

**How to assemble them:** W2-A2, W2-B and W2-C are written as W2-A1 with only the item id, the branch name and the TASK block replaced (W2-B also replaces the OUTPUT line, as shown). The custodian copies W2-A1 in full for each and swaps exactly those parts, so every launched prompt carries every rule. "[paste the schema]" means `state/cloud/wave1-prompts.md` §3's worker fields, verbatim, with its Baseline SHA field reading `git -C /tmp/wave2-baseline rev-parse HEAD`. The custodian records the exact assembled text of each prompt beside its session ID.

### W2-A1 — B1 projection: conformance to its contract

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: audit exactly commit <WAVE2_BASELINE>. Run `git worktree add
/tmp/wave2-baseline <WAVE2_BASELINE>` and confirm with `git -C /tmp/wave2-baseline rev-parse HEAD`
before anything else. All reading, building, reproducers and branches happen inside
/tmp/wave2-baseline; the session's own checkout stays on main. Do not move to a newer head, and do not
reason from later commits.
ROLE: you investigate and report. You do not design, decide, merge, or change product code.

TASK — does B1's attribute projection do exactly what its accepted contract says? Authorities, in
order: docs/adr/ADR-023-attribute-projection-on-viewport-query.md (its Decision, as amended),
engine/B1-PROJECTION-PREREGISTRATION.md (its rulings, O1–O8 included), protocol/skp/SKP-V0.md (the
skp/0.6 section), docs/adr/ADR-021's dated notes (the filter namespace), ADR-017 §4 (the bundle-format
restriction). Check in particular:
- the admitted-type allowlist, including Float32 (carried unchanged) and dictionary columns (decoded to
  their value type; the index never exposed);
- every named refusal (unknown, type, geometry, identity, duplicate, too-many, empty list), each
  reachable and each with its own code; `columns: null` versus `[]`; the reserved id refused before the
  unknown-name check (O8);
- `describe`'s per-column `projectable` computed by the same function as the refusal, so the two can
  never disagree (O4);
- the emitted Arrow columns: declared order, every projected column nullable, 64-bit integers never
  narrowed, co-indexed with ids and rings;
- projection admission before filter admission (O3); Float32 filterable, dictionary columns refused as
  not filterable by name;
- the publish path: shared admission first, then the named bundle-format restriction, refusal codes and
  text unchanged except as O1/O8 ruled.
A contract clause the code does not honour is a finding. A disagreement between two authorities is an
unproven observation, never a finding: report it, do not resolve it.

EVIDENCE BAR: at most five findings. Each needs a reproducing test (preferred) or an exact file:line code
path at the baseline. No reproducer and no exact path means no finding. Zero findings is a valid and
useful result; do not invent weaknesses to fill the quota. Put anything plausible but unproven under
"Unproven observations", at most five, one line each. Before filing a finding, read KNOWN-LIMITATIONS.md
and search DECISIONS-PENDING.md and PLAN.yaml: a duplicate of a declared limit, a queued entry or a
proposed node is not a finding.

REPRODUCERS: test files only, under existing test directories. Commit them only to branch
cloud/wave2-A1 and push it. Open no PR. Edit no product source file.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, .claude/,
scripts/hooks/, any product source file.

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol or SKP semantic change; a design or architectural decision would be needed; the task would
have to grow beyond this scope.

DCO: before any commit, inside /tmp/wave2-baseline run `git config core.hooksPath .githooks` and prove
the hook rejects an unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
PRIVACY: never write a path that names a user profile (C:\Users\<name>, /Users/<name>, /home/<name>)
into any file or commit message; generic machine accounts (runner, user, root) are fine.
NETWORK: package registries only (crates.io, npm), and only to build.
PLATFORM: your results are Linux evidence only. Windows CI and the local custodian verify the product.

OUTPUT: your final message is the WAVE2 REPORT, in exactly the wave-1 schema with "WAVE1" read as
"WAVE2":
[paste the schema]
```

### W2-A2 — B1 projection: hostile input and security

Replace the item id (`W2-A2`, branch `cloud/wave2-A2`) and the TASK block:

```
TASK — treat B1's projection as untrusted input and try to break it. The request's `columns` list
and the file's own column names are both attacker-controlled. Examine:
- SQL composition: how projected column names reach the SELECT list. Names containing double quotes,
  backslashes, NUL, newlines, commas, Unicode confusables, leading or trailing spaces, SQL keywords,
  and names that collide after case-folding. The filter predicate's composition rule (ADR-021) must
  be unaffected by any projection.
- Admission bypass: can any sequence of requests project geometry, the identity column, a refused
  type, or more than the declared ceiling of columns; can a dictionary index ever leave the engine.
- Resource bounds: projection width at the ceiling times batch size; per-column chunk retention;
  memory and time growth that any declared ceiling does not bound (ADR-010 rule 6).
- Refusal hygiene: no refusal leaks another column's values or file content; comma-containing names
  are handled as the ruling says (omitted from known_columns, with the omission stated).
- The publish path: can a projected type the bundle format refuses reach a written bundle.
Work only inside your container; probe nothing outside it.
```

### W2-B — filter admission property campaign (may open one PR)

Replace the item id (`W2-B`, branch `cloud/wave2-B`), the TASK block, and the OUTPUT line:

```
TASK — a property campaign against the ADR-021 filter-admission boundary, now composed with B1's
projection. Write deterministic, seeded generators in plain test code (no property-testing crate is a
dependency, and none may be added) that produce predicates from the admitted grammar and
from outside it: subqueries, function calls, CAST, placeholders, comments, statement separators, quote
and dollar-quote games, deep nesting, huge literals, identifiers colliding with projected column
names. The properties:
  (P1) every generated predicate is either refused with a named code, or admitted with the bbox and
       limit intact in the composed SQL (the two-sentinel probe's guarantee);
  (P2) admission is deterministic for a given predicate and schema;
  (P3) no predicate reaches a function call, a file read or a network access;
  (P4) no refusal carries data from the file.
Record each generator's seed and case count. A counterexample is a finding, with its seed and a
minimised case. Put the campaign's tests in a new file under an existing test directory; do not
modify existing tests.
```
```
OUTPUT: branch cloud/wave2-B, at most ONE pull request, titled "Wave 2 B: filter-admission property
campaign (proposal)", containing only the new test file. Do not merge it. Your final message is the
WAVE2 REPORT (the schema's worker fields); "Findings" are counterexamples, with seeds.
```

#### Deviation 1, 2026-09-28 — W2-B's "Open no PR" line

The custodian inserted this after W2-B's launch, and nothing else in this file is edited. It is recorded under the 2026-09-28 W2-D sighting, the paragraph "Fable on W2-B's conflict" (`state/directives/2026-09-28-wave2-D-sighting.md`).

W2-B was assembled as §4 directs, swapping only the item id, the branch, the TASK block and the OUTPUT line. Its launched text therefore carries W2-A1's REPRODUCERS paragraph with only the branch swapped. That text is `state/cloud/wave2/W2-B-prompt.md`, 75 lines, sha256 24ce5c134fbe0afe8984d0b219154ff2ceb5f35365e7f47027a14f4826f100b9. The paragraph's third sentence, byte-copied from the launched text, is "Open no PR.". It sits beside the OUTPUT block's "at most ONE pull request".

Fable's reading, byte-copied from the directive with its line breaks joined by spaces: "a drafting error in the wave file (the "Open no PR" rule should have been listed among W2-B's replaced lines). Either outcome is conforming: keep one PR if the worker opens it; if it opens none, the branch stands, and we decide at triage whether to open a draft PR from cloud/wave2-B." The launched text does not change.

### W2-C — the watcher and ADR-035's event path

Replace the item id (`W2-C`, branch `cloud/wave2-C`) and the TASK block:

```
TASK — concurrency and lifecycle audit of code added since wave 1: the advisory source-change watcher
(its Windows adapter by reading only; its signal handling, invalidation and opening race by reading and
Linux-runnable tests) and ADR-035's `dataset_session_ended` event: emission from the single place a
generation's end is recorded, at most once, without blocking or taking a lock; the session reference's
minting and routing; the shell's listener dropping unknown sessions with a logged line that carries no
reference; the ended state on `describe`. Look for: a lock held across emission or a Drop; an end that
emits twice or never; a late event resurrecting a session; a leak of watcher handles, threads or
listeners across reopen and close. The race `live_or_mint` versus `close_dataset` is KNOWN (PLAN node
kernel-generation-close-races): do not re-report it; report only a different mechanism.
```

### W2-D — Linux portability fixes (optional, implementation)

No prompt is written here, on purpose. It is an implementation cut (wave 1's D-1 to D-4: tests that
assume Windows' LOCALAPPDATA, one kernel test, npm 10's lockfile mismatch, and the test that writes a
Windows-path-named file on Linux). The custodian writes its brief under the usual preregistration
discipline and brings it to me; if I sight it, it launches with the same forbidden paths and stop
conditions, one PR, **and Windows CI on the PR is the verifier** (a fix that goes green on Linux and
red on Windows is rejected whole).

## 5. Triage and after the wave

Triage exactly as wave 1 (§4 of the wave-1 file): S1 needs a reproducer or the custodian's own Windows
reproduction; nothing becomes a cut during the wave; the S1 candidates come to me in one batch after it.
Findings on B1 are re-checked against main at triage time, since B1's shell half and B2 will move
nearby code. Record everything in `state/cloud/wave2.md` and `state/cloud/wave2/<item>.md`.
