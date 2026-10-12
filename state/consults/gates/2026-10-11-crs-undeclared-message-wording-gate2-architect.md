# PR #206 gate 2 — architect
Reviewed: cut/crs-undeclared-message-wording @ d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c

**Verdict: pass.** There are no Correctness findings, no Evidence findings and no Documentation findings. E-1 is cleared, and so are D-1 and D-2. This is correction round 1 of 2, and it closes the round.

I have no shell, so every check below is by reading. Hash recomputation and the append-only proof stay with the reviewer (§8 item 2; round 15 (f)).

## Evidence

**E-1: cleared.** The new sentence at line 21 of the PR body states only what the code shows at d88636ef.
- **"the `(None, None)` arm of `crs::admit`" (`engine/src/crs.rs` lines 286-288):** this is the arm that raises `CrsUndeclared` with the detail T-1 carries. A grep of `engine/src` at the head finds exactly two constructions, at crs.rs:286 and dataset.rs:403.
- **"covers the form's raise sites (a) and (b): a `crs` value that is an explicit null or not an object, with no CRS asserted":**
  - `geoparquet.rs` maps both `Some(Value::Null)` (line 444) and `Some(_)` (line 450) to `ExplicitNull`.
  - `format_semantics` returns the default for `ExplicitNull` (line 555), so `admissible` is `None` and `undeclared_detail` is `None`.
  - With no assertion, `dataset.rs:415` therefore calls `admit(None, None, _)`.
  - This agrees with the form's 0.2 (raise sites (a) and (b) pinned at crs.rs:286-288) and with its 2.2.
  - The sentence does not say "only". The defensive path at `geoparquet.rs:514-519`, which the code comment calls unreachable today, does not falsify it.
- **"The other raise site, (c), an absent key under an unpinned version, carries a detail that names the version":** `geoparquet.rs:572-579` builds that detail with `geo.version`. `dataset.rs:398-403` returns it when no assertion is given. This agrees with 0.2's raise site (c).
- **An absent key under 1.0.0 or 1.1.0** is admitted (`geoparquet.rs:556-571`). The sentence no longer implies that it is refused.
- **The form's §1 claim**, that T-1's value is as raised by the real (a) site, is consistent with the arm the body now names.

## Correctness

None. The code has not changed since gate 1; the head is still d88636ef.

## Checks, scoped to the round

**D-2: cleared.** Both spans name their commit:
- "(`engine/src/crs.rs`, lines 286-288 at d88636ef)";
- "read from `engine/src/error.rs` at d88636ef".

Neither is pinned by hash at a branch commit (round 25, item 2).

**D-1: cleared.**
- The PR body's lines 69-70 read 47 (37 insertions, 10 deletions) against 65, with Documents at 2 (1 insertion, 1 deletion) against 2.
- Summed from the reviewer's B...H numstat:
  - insertions: error.rs 25, regression.mjs 4, admission-remediation.mjs 4, formatRefusal.test.ts 3 and the JSON 1, which is 37;
  - deletions: 4, 2, 2, 1 and 1, which is 10;
  - the walkthrough is 1 and 1.
- These match §7's split: code and tests at lines 225-230 of the form, Documents at line 231.
- The whole-diff line (41/14) still reconciles: 37 + 1 + 3 = 41 and 10 + 1 + 3 = 14, adding engine/README.md's 3/3.

**Amendment 3:**
- **Round 12 (d):** item 1 is three single-sentence bullets: the defect, the corrected figures, the proof. That is within the ceiling. Its only statement of Amendment 2's figure is the defect itself, so it restates no earlier claim.
- **Round 12 (e):** item 2 is the superseded index. It limits the supersession to Amendment 2 item 2's total.
- **Class 1:** it is correct. The heading and the first line say it was written after both gate reports, which are the round's results (round 15 (g)). It records only what those results invalidate.
- **Nothing above it changed, by reading:** Amendment 2 item 2 still reads 49. The correction is carried by an appended row, not an in-place edit, and Amendments 1 and 2 read as they did at gate 1.
- **Generation:** it is 4, and it matches PLAN.yaml's node at `generation: 4`.
- **Hash references:** it carries none, so round 15 (e) does not apply. Its gate-report paths are tracked on main and are given without line numbers.

**The rest of the PR body:** compared line by line with the body gate 1 read, it is unchanged apart from three things:
- line 21, for E-1 and D-2;
- line 69, plus the new line 70, for D-1;
- the new section "Correction round 1", at lines 81-89.

**The byte-copied blocks:**
- The template block (body line 18) equals line 33 of `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md` with its three leading spaces removed.
- T-1's block (body line 24) equals that template with `{detail}` filled by crs.rs:287's literal.
- It also equals the literal in `engine/src/error.rs` lines 457-460 at d88636ef, folded at the `\` continuations.
- Both blocks are byte-identical to gate 1's blocks.

**Note, not a finding:** the correction section says the old sentence introduced T-1's value "by a file condition the code does not refuse". Strictly, the code refuses some files without a `geo` metadata CRS and admits others (the absent key under 1.0.0 or 1.1.0). It is a record summary, not a claim of a guarantee, and it is read as intended. No change is required.

No ADR is needed, and no decision is missing.

Files read:
- C:/dev/wt/crs/engine/src/crs.rs
- C:/dev/wt/crs/engine/src/geoparquet.rs
- C:/dev/wt/crs/engine/src/dataset.rs
- C:/dev/wt/crs/engine/src/error.rs
- C:/dev/spatial-ide/engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md
- C:/dev/spatial-ide/state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-11-crs-undeclared-message-wording-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-11-crs-undeclared-message-wording-gate1-reviewer.md
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
- C:/dev/spatial-ide/PLAN.yaml
- the PR body, and the body gate 1 read
