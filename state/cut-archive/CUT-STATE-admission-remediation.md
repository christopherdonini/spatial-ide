# CUT-STATE — admission-remediation cut [CLOSED 2026-08-18 — merged to main @ 16091f9, PR #14]

**Untracked; archives to `.cut-archive/CUT-STATE-admission-remediation.md` at close (rule 10).**
Branch: `cut/admission-remediation` (from `main` @ 2b4f95e, pushed).

## Ledger

- 2026-08-18 — cut opened on the architect's sequencing verdict (admission remediation over the
  MCP runner-up) + full design note. Part H's brief renamed to `PART-H-QUEUED.md` (operator run
  pending the batch); at-scale machine-side state archived. DECISIONS-PENDING 9–11 queued.
- P0 (protocol, skp/0.2): dispatched.
- ADR-026 (CRS definition supply): filed Proposed + docs/02 + docs/README index entries
  (ad1a175, pushed).
- 2026-08-18 — ADR-009 checklist piece landed on `main` @ 8a69260 (pushed; audited: SPDX
  spot-checks good, trailers + sign-off present, tsc/vitest/cargo-check green per its report).
  Queue drafts applied as DECISIONS-PENDING 12–15. **Loose end on THIS branch:** duplicate
  commit `875e1e0` (the checklist commit, landed here in a branch race before its cherry-pick
  to main). Remove once P0 commits: `git rebase --onto ad1a175 875e1e0 cut/admission-remediation`
  (content no-op — same changes live on main); then the pre-merge rebase onto main reconciles.
  **Process lesson for future dispatches:** an agent that will COMMIT must get worktree
  isolation when the custodian may switch branches in the shared tree mid-flight; candidate
  AI_DEVELOPMENT.md mechanics line at the next hygiene commit.
- P0 LANDED @ b751ff4, custodian-verified (SKP_VERSION = skp/0.2 both sides; candidate_columns
  threaded, Display byte-identical — `candidate_columns: _` in the arm; §8 entry carries
  DRAFT/PENDING HUMAN CONFIRMATION for entry 9; tests 24+11/102/277 green per report).
  **Duplicate-commit loose end RESOLVED by merging main into the branch (222f162)** — supersedes
  the earlier rebase plan: dropping 875e1e0 would have stripped the SPDX headers from this
  branch and manufactured merge conflicts at close; the merge reconciles identical changes with
  no force-push. Branch pushed at 222f162.
- **P0 deviation for the P6 architect re-review scope:** SKP-V0 §7.2's "omitted key =
  deserialize failure" prose does NOT match the code for the existing `bbox_cs`/`filter` fields
  either (plain `Option<T>` tolerates a missing key as None regardless of `#[serde(default)]`,
  empirically confirmed). Worker replicated actual behavior + added the documenting test
  `omitting_crs_assertion_or_identity_key_is_currently_tolerated_not_refused` + a marked §1
  note. Architect must rule: correct §7.2's prose to match shipped behavior, or harden all four
  fields to hard-require keys (wire-behavior change, version-internal while 0.2 is unreleased).
- P1 LANDED @ a999c9a, custodian-verified (wire types carry no by/at; host mints at one
  boundary, skp.rs:343-344 + host_attribution/host_minted_*; engine already had by/at on both
  types and describe already had asserted_by/asserted_at both sides — no wire changes needed;
  6 new tests green, full kernel+engine suites green per report). Deviation accepted: non-unique
  test reuses IdentityMode::DuplicateIds fixture (declaration-keyed path, no new fixture needed).
- **P2 design detail for the P6 architect re-review:** definition provenance
  (catalog-entry-id+hash vs `pasted`) is HOST-DERIVED by content-hashing the supplied
  definition_json against the pinned catalog — never client-claimed (F-5 spirit extended to
  provenance; exact-hash bookkeeping, not matching/scoring, so ADR-016 §3 discipline intact).
  ADR-026 names the record's content but not who derives it; this is the safer reading.
- P2 LANDED @ 6b80e95, custodian-verified (catalog entry = the in-tree LV95 PROJJSON verbatim,
  both coordinate_system.axis blocks present; pinned hash 254016…d024; provenance host-derived
  with the no-normalization test; binding_crs_catalog Tauri command + TS client for P3; all
  suites green per report). Worker's flagged version-bump tension resolved by §8 P2 addendum
  (7e9adc3, pushed): CrsInfo.definition_provenance is part of the same unreleased skp/0.2 —
  **architect P6 re-review scope now carries three items:** the §7.2 omitted-key prose finding,
  the host-derived-provenance design, and this addendum's within-version-field-add reasoning.
- P3 LANDED @ 77d6cd8, custodian-spot-verified (conflict code absent from the form set with I1
  copy at formatRefusal.ts:65; 321 shell tests green; dist grep clean; blanket cut-2 note gone,
  sweep test added). Worker flags accepted: regression.mjs stepRefusal (B2'/C2') now EXPECTED-
  BROKEN until P5 rewrites it — do not run e2e:regression as evidence before P5; naming debt
  remediationIsCut2/CUT2_REMEDIATION_CODES kept (semantics unchanged) — reviewer/architect may
  rename at P6 if they care.
- Reviewer gate on P0–P3 RETURNED: **passes after MUST-FIX 1+2** (both AdmissionPanel.tsx):
  (1) formFamily carry-forward dead — priorFamily always null, axis-order re-refusal dead-ends
  the panel; (2) options not accumulated — both-remediations file loops forever, full scan per
  lap (combined request proven admitting host-side, STEP4). SHOULD-FIX 3-11 + NOTEs recorded in
  the reviewer report (task output). Verified clean: admission-path unity incl.
  admitAndResetStaleUiState on remediated opens; I1/I2/I4/I7/I10/I11 all hold.
- P3b (shell fixes: MF1+MF2 + SF5 raw-paste, SF7 inFlight, SF8 CSS cap, SF9 prefill label,
  SF11 real transition test, legend fix, NOTE cleanups): dispatched.
- P3b LANDED @ 6a02fa5 (MF1+MF2+SF5/7/8/9/11 + legend + cleanups; remediationIsCut2 DELETED
  with reasoning accepted; 325 tests green; dist grep 0). Off-scope note adopted into P4's
  brief: top-level Open button not disabled during a remediation submit (P4 owns open-in-flight
  UX). Reviewer-NOTE free-text trim accepted-for-now: trimming the operator's own typed column
  name is UI convenience, not artifact mutation (contrast SF5); genuinely whitespace-named
  columns stay reachable nowhere today — recorded, not fixed, P6 may revisit.
- P3c LANDED @ 2f19ab9, custodian-verified (MAX_CRS_DEFINITION_BYTES=65_536 + blank-identifier
  variant at crs.rs:36-51; §8 P3c addendum present; engine 112+22, kernel 103+suites, skp 24+12,
  shell 330 all green per report). Dangling: definitionValidationMessage() implemented+tested
  but unrendered (CrsAssertionForm.tsx was P3b's file) — adopted into P4's brief. Branch pushed
  through 2f19ab9. Reviewer gate: both MUST-FIXes now closed; gate PASSES.
- P4 LANDED @ 9f15d5b (OPEN_LIVENESS_DELAY_MS=200 sibling of the scan constant; cancel_key
  retained on state, Cancel → skp cancel with the exact key; engine.cancelled intercepted —
  plain open → idle+note, resubmit → refused state restored intact; Open-button guard;
  validation message wired; 348 tests green; dist grep 0). P5 selectors provided:
  .admission-open-cancel / .admission-open-liveness / .admission-open-cancelled-note /
  .crs-assertion-definition-validation.
- P5 LANDED @ 77aa1e2 after one transient-API-error interruption (resumed with context; worker
  cleaned its own orphaned process trees before the evidence run — rule 9 discipline applied).
  **e2e:admission 11/11 PASS** (ASSERT'/PASTED'/AXISTRAP'/NODEF'/MAP'/DUPKEY'/BOTHNEEDED'/
  CONFLICT'/CANCELOPEN' real-cancel/NOPERSIST'/OVERBOUND'), **e2e:regression 12/12 PASS**
  (B2'/C2' repaired to assert forms), both on a verified-fresh session. New fixtures:
  dupkey-refused.parquet + bothneeded-refused.parquet (test-side generator fns only).
  Walkthrough Part I (I1-I8) appended, BLANK result log, queued for the operator batch.
  Note: the Part-H launcher shell exited 255 when its app was swept — expected, relaunch
  documented in PART-H-QUEUED.md. Branch pushed through 77aa1e2.
- P6 harvest opened: architect re-review of the full skp/0.2 diff dispatched (merge-gating,
  ADR-015 architect-blockable) with the three recorded questions + ADR-016 acceptance-wording
  request. After it returns: apply its text edits, queue ADR-016 acceptance, open the PR,
  archive this file per rule 10.
- Architect re-review RETURNED on the fifth attempt (fresh dispatch after four 529s):
  **PASS WITH NOTES.** Rulings: §7.2 prose corrected not hardened (ADR-021 uncontradicted);
  host-derived provenance blessed ('pasted' naming → decision 10); within-version assembly
  blessed under the new §4 item 13 four-condition rule — **skp/0.2 FREEZES at merge**. All
  edits applied @ 16091f9 (SKP-V0 A–E, ADR-026 note, Part I wording ×2, admit_identity doc
  comment, DECISIONS-PENDING entry 16 = ADR-016 acceptance request incl. the
  make-architect-blockable recommendation).
- PR #14 opened with the nine disclosures; ALL checks green (rust ×2 incl. the .gitattributes
  proof run, shell ×2, DCO). **ff-merged to main @ 16091f9, pushed.** Cut closed 2026-08-18.
  Human items outstanding (queued, not blocking): entries 9 (scan-progress re-deferral
  confirmation), 10 (ADR-026 route + 'pasted' naming), 11 (scope confirm), 16 (ADR-016
  acceptance). Walkthrough Part I queued in the operator batch alongside Part H.
- CI red on the branch (both post-P3c pushes): ONE test, the P3c byte-binding assert, failing
  on autocrlf CRLF vs the LF blob — \r only, content identical. Fixed @ 870fa5d (.gitattributes
  pins *.projjson to LF at checkout; reasoning in the file). No run fired for 870fa5d itself
  (the workflow's path filter excludes it) — the proof run rides the next protocol-path push
  or the PR's own pull_request trigger. Product behavior unaffected (provenance hashes wire
  text; the pinned catalog hash is escape-encoded, platform-stable).
- Architect re-review: FOUR consecutive 529-Overloaded terminations (attempts at dispatch +
  3 resumes with backoffs up to 12 min) — named cause: server-side congestion, never the work.
  Strategy change per rule 7's spirit: 30-min backoff, then a FRESH architect dispatch (same
  brief, clean context) instead of a fifth resume of a long transcript. The merge stays gated
  on it; nothing on the branch decays while waiting.
