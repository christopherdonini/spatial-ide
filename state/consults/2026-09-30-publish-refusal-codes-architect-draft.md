# Consult — the architect's draft for publish-refusal-codes-and-attempt-lifecycle (2026-09-30)

*Custodian's filing note: the architect agent's final report, delivered as a hand-back message on 2026-09-30 (enqueued 17:40:46Z), on the custodian's brief (a drafting consult, not a gate), read at main a446efd; the report notes main moved to bff107e (#147's merge) while it read. Recorded verbatim below the rule, from the message, with the harness's report indentation removed, except for one elision marked in parentheses: the DRAFT section, committed as `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md` with the edits its header lists. The custodian's checks before commit, at a446efd and at main 37333ef: `create_from_raw_params` maps `open_engine_stream`'s error with `e.to_string()`, and the mid-stream arm of `EngineSource::next_into` uses `skp::terminal_detail_of`; src-tauri `publish.rs` answers `ExecuteOutcome::Refused { message: e.to_string() }` at execute and `EnsurePinnedOutcome::Failed(e.to_string())` at the pin phase; `BoundaryError`'s Display for `Publish` is the bare `PublishError` Display; `formatPublishRefusal` labels a message with no `publish.*` prefix `publish-refused`; `SKP-V0.md`'s refusal-surfaces bullet and its `publish.engine` sentence read as the report says; the shell installs `EngineSourceFactory::ticket_only`; the kernel binary's `with_connection_reports` and `new` are both raw mode; `a_viewport_in_the_wrong_crs_is_refused_end_to_end` asserts only that the detail contains `EPSG:4326`, so the prefix does not break it; no test or source file outside `kernel/src/skp.rs` and `kernel/tests/skp_admission.rs` names `viewport_crs_mismatch`, and neither matches a raw-path detail. `server.rs`, src-tauri `publish.rs` and `SKP-V0.md` are unchanged from a446efd to 37333ef. Its bare `:line` references are read at a446efd, in the file the sentence names.*

---

**Verdict: pass with notes. Reviewed main @ a446efdd49f2.** Only A4-4 can proceed as this node's kernel half. A4-1 and A4-3 are lost at src-tauri lines, and A4-2's code is already declared, so all three need the human's ruling. Draft below.

Before the verdict detail, one thing about the tree. Main fast-forwarded to bff107eab823 while I was reading (`.git/logs/HEAD` line 1286), almost certainly #147's merge. My cites into `kernel/src/lib.rs` above line 400, and all cites into `error.rs`, `boundary.rs`, src-tauri `publish.rs`, the TS files, `SKP-V0.md` and the B1 prereg, read identically before and after the move. `skp.rs` changed in #147, so I cite `terminal_detail_of`/`error_of` by symbol. `lib.rs`'s `next_into` arm is at :579-580 at a446efd and :617-618 at bff107e. I have no Bash, so the custodian computes every span hash in the draft.

## 1. The four findings in the code

- **A4-1.** At execute, the shell gets `ExecuteOutcome::Refused { message: e.to_string() }` (`frontends/shell/src-tauri/src/publish.rs:734`). For a publish error, `BoundaryError`'s Display prints only the `PublishError` Display, with no code (`kernel/src/permission/boundary.rs:155`). The shell parser therefore falls back to `publish-refused` (`frontends/shell/src/publish/formatPublishRefusal.ts:48`), and that label is what the operator sees (`frontends/shell/src/admission/RefusalBlock.tsx:28`).
  - Governing text: `protocol/skp/SKP-V0.md:750-758` says, paraphrased, that a publish refusal reaching the shell is code plus display, scoped to `PublishError`. It names only the two preflight sites (`publish.rs:409`, `:513`).
  - Falls short of: that sentence's general claim. An execute-time `PublishError` is still a `PublishError`.
- **A4-2.** The client gets `publish.engine: <EngineError Display>` (`kernel/src/publish/error.rs:206`, `:216-218`, `:354`, `:363-371`).
  - This code is declared, not a defect of implementation. `SKP-V0.md:1051-1056` and `engine/B1-PROJECTION-PREREGISTRATION.md:54`, `:131`, `:866` all say projection and format refusals travel as `publish.engine`.
  - The no-catch-all rule the finding cites (`docs/adr/ADR-021-row-filter-on-viewport-query.md:93-99`) covers only the `skp.filter_*` codes.
  - Falls short of: no clause.
- **A4-3.** In the pin phase, `Err(e) => EnsurePinnedOutcome::Failed(e.to_string())` (`publish.rs:1073`) becomes `PrepareOutcome::Refused` (`:417`) with no code, and the shell labels it `publish-refused`.
  - `SKP-V0.md:754-756` lists the untyped refusals on this seam: a permission error, an IPC rejection, the unknown-attempt sentence. A pin-phase engine error is not among them, and no clause names a code for it.
  - Falls short of: no clause. The case is undeclared.
- **A4-4.** On the raw-params path, a create-time engine refusal becomes `map_err(|e| e.to_string())` (`kernel/src/lib.rs:378`), then `TERM_PRODUCER_FAILED` with the bare Display (`protocol/data-plane/src/server.rs:479-490`). The mid-stream path does prefix the code (`lib.rs:579-580`).
  - Governing text: `SKP-V0.md:750-752` says a data-plane terminal's detail is code plus display, and the `terminal_detail_of` doc says the same.
  - Falls short of: that sentence.

`KNOWN-LIMITATIONS.md` records none of the four.

## 2. What each fix makes visible, and what needs the human

- **A4-1: needs the human.** It can't be fixed in the kernel alone without an unruled visible change.
  - The only kernel-only fix is to make `BoundaryError`'s Display carry the code. That also changes the `publish-bundle` CLI's stderr (`kernel/src/bin/publish-bundle.rs:165-168`), putting a machine code in front of the sentence with nothing to strip it, which `formatPublishRefusal.ts:25-28` says must not happen.
  - The clean fix is src-tauri `:734` calling the existing `PublishError::refusal_detail()`. It adds no new code or string. The only visible change is the label from `publish-refused` to an existing `publish.*` code; the message is unchanged because the parser strips the prefix (`formatPublishRefusal.ts:44-45`).
  - **The human rules:** round 31 item 2 placed A4-1 in the "kernel half", but its fix line is in src-tauri. Does that line go in this node, in node 8, or in a new node?
- **A4-2: needs the human.** Every fix changes a declared code or adds a string. **The human rules** one of:
  - keep `publish.engine` and close A4-2 as declared behaviour;
  - nest the codes, `publish.engine: engine.<code>: …`, which puts a new string in front of the operator;
  - send the `engine.*` code directly, which means widening the TS regex at `formatPublishRefusal.ts:44`;
  - mint per-cause `publish.*` codes, which are new codes.
- **A4-3: needs the human.** The site is src-tauri: engine's `pin_content_observed` has no kernel type in between, so a kernel-only fix is impossible. No code has been declared for it. **The human rules** which code and which site: `publish.engine` through `PublishError::from(e).refusal_detail()` (an existing code and string, one src-tauri line), or `engine.*` (a TS change).
- **A4-4: proceeds.** It only makes the implementation keep a code shape that is already declared. The codes come from `error_of`'s table and the Display is unchanged. On the wire, the raw-path create-time detail gains the prefix. The shell never sees this, because it installs `ticket_only` (`frontends/shell/src-tauri/src/lib.rs:399`). The one visible spot is the canvas-probe's note line (`frontends/canvas-probe/src/main.ts:261`), which is a probe, and it already shows prefixed mid-stream details.

## 3. Sibling search

- src-tauri `publish.rs:1040`: the test-only `ensure_pinned` also stringifies the error. No product caller.
- `publish-bundle.rs:168` and `:490`: the CLI prints refusals with no code. No declared seam covers the CLI.
- `StagingNotRemoved`: the inner cause's code survives only in the prose (`error.rs:205`, `:348-353`). This is the variant's declared design, A4 observation 2, discarded.
- Raw path, non-engine strings: the unknown operation (`lib.rs:335`), the params decode (`:354`) and the unknown dataset (`:358`) carry no code. Giving them one would mint new strings, so they are out.
- `server.rs:531`: "could not start the producer" is a spawn failure, not an engine error.
- `publish/mod.rs:673` and `:852` (the pin verify during publish): these go through `publish.engine`, so they fall under A4-2.
- `publish.style` and `publish.canonical` lose nothing: `StyleError` and `CanonicalError` have no code table.
- src-tauri `:518`, `:531`, `:543`, `:556`, `:662`, `:690`: all declared untyped at `SKP-V0.md:754-756`.

## 4. Fix shape and cost

- **A4-4:** `lib.rs:378` becomes `.map_err(|e| skp::terminal_detail_of(&e))?`, and the comment at `:372-374` names the prefix.
  - About 3 changed lines of code plus a test of about 30 lines, in 2 files.
  - No new `pub` item: `terminal_detail_of` is already product-called in `next_into`. No new dependency, nothing in src-tauri or TS.
  - Most of the cost is the kernel test build (DuckDB is bundled).
  - It can't claim anything about the shell, about any publish refusal, or about the non-engine raw-path strings.

## 5. Reproduction and gating

- **Reproduction:** extend `kernel/tests/end_to_end.rs::a_viewport_in_the_wrong_crs_is_refused_end_to_end` (`:496-521`). It uses a real data-plane server with `EngineSourceFactory::new`, which is the same Raw mode as `kernel/src/main.rs:158` (`lib.rs:290-305`). The extended test fails today, as the A4 record observed.
- **Gating: full form, §21a.** The change alters a data-plane terminal literal and makes the implementation meet a stated shape (`SKP-V0.md:750-752`). Under round 25 item 2(e), no five-line form is used.
- **Portability:** not OS-dependent. The piece has no `cfg`, and the OS error classification in `error.rs:386-425` is not touched.

## Recommendations to the custodian

- **PLAN node and next round:** set the node's `gate:` to the form's path. Put A4-1 to A4-3 to the human in the next round (the site and scope for A4-1 and A4-3, the code for A4-2 and A4-3), and record them as a proposed node blocked on that ruling.
- **Wording:** the node's title claims all four are kernel work, and the code does not support that. Word the question as a premise correction, not a re-ask.
- **Closing:** don't set the node to done with its PR on the A4-4 PR alone. `verify:plan` fails a non-done node that names a merged PR.

---

(The report's DRAFT section followed here. It is not repeated: the committed form, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, is that draft with the edits its header lists.)

---

Paths: `C:\dev\spatial-ide\kernel\src\lib.rs`, `C:\dev\spatial-ide\kernel\tests\end_to_end.rs`, `C:\dev\spatial-ide\kernel\src\permission\boundary.rs`, `C:\dev\spatial-ide\kernel\src\publish\error.rs`, `C:\dev\spatial-ide\frontends\shell\src-tauri\src\publish.rs`, `C:\dev\spatial-ide\frontends\shell\src\publish\formatPublishRefusal.ts`, `C:\dev\spatial-ide\protocol\skp\SKP-V0.md`, `C:\dev\spatial-ide\engine\B1-PROJECTION-PREREGISTRATION.md`, `C:\dev\spatial-ide\state\cloud\wave1\A4.md`
