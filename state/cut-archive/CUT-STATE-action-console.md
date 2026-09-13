# CUT-STATE — action-console cut [CLOSED 2026-08-19 — merged to main @ 807648f, PR #15]

**Untracked; archives to `.cut-archive/CUT-STATE-action-console.md` at close (rule 10).**
Branch: `cut/action-console` (from `main` @ 7fed740, pushed).

## Ledger

- 2026-08-18 — gates cleared by the human ("let's roll with the next cut"); docs/07 split
  applied @ 7fed740; entries 17-19 moved to Resolved. Brief: NEXT-CUT.md (architect design
  consult, task af182c9e893d7bb55 — ADR-027 skeleton lives in that output; P6 files it with
  the entry-18 accepted-with-a-deadline record added).
- P0 LANDED @ 088ee7d (recorder + choke-point wire; all 5 SKP commands confirmed through
  call(), no bypass; I1 sole-capture scan + I2 toBe tests; ceilings 256 entries / 80_000 render
  bytes; 363 tests green; dist grep 0). Deviation accepted: oldest-dropped (per spec) vs
  trace.rs's refuse-new — documented inline. ConsoleRefusal deliberately local (decoupled from
  SKP wire types).
- P1 LANDED @ 3ed84ea (renderSkpRequest = plain stringify of the real object — held for all 7
  discovered fixtures, no custom serialization; truncated variant has copyText:null so silent
  short copy is impossible by type; I3 no-version-literal scan; 377 tests green). Deviation
  accepted: assertExactKeys extracted to testUtils/ (importing a .test.ts re-executes its
  describes — correct call).
- P2 LANDED @ 8dc9e67 (full inventory: 5 SKP via the choke point + 8 binding commands at
  literal sites + 8 class-C rows; scan fails on unclassified AND stale; B/C row types cannot
  hold argument objects; 392 tests green). Two scan refinements accepted (self-exclusion;
  whitespace-tightened detector). Handoff: recorder still records only skp-request — class-B/C
  entry capture is P3's, via a NAME-ONLY API to preserve I1's spirit.
- P3 LANDED @ 1d30926 (drawer + recordNamed name-only API with per-symbol import scans; ×N
  grouping never merges; collapsed = count-only coalesced sync, I9 proven structurally; 436
  tests green; dist grep 0). Deviation accepted: SkpRequestEntry.command? metadata — describe
  and close_dataset are shape-identical {skp,dataset}; copy text still sourced only from the
  request object. Layout note recorded as COMPUTED (honest), real capture rides P5/Part J.
- P4 LANDED @ 43690cd (standing header verbatim per design, expanded-only, first child of
  .console-entries; consoleLanguage lint 10 assertions incl. the banned-label regex with the
  SKP-V0 doc-citation exception and the not-callable weld; 448 tests green). Branch pushed
  through P4 for early CI.
- P5 RAN, NOT COMMITTED (worker's own gate held — correct): console.mjs 10/10 green ×3 runs
  (COPYTRUNC' = NOT-REACHABLE by construction: max wire request 66,111 B < 80,000 ceiling,
  margin 13,889 — a finding, not a skip); admission 11/11 green; **regression A9' hover-pick
  FAILS deterministically** (A5'-A8' green). Worker proved independence from console.mjs
  EXECUTION but NOT from the console MOUNT (P3 mounts the drawer unconditionally; its layout
  note admits content height 831.55px). A9' was green yesterday at the admission cut's close;
  P3 is the only layout-touching delta. Suite files sit uncommitted in the tree (console.mjs,
  README, package.json).
- P5b RAN (Outcome B): drawer-hidden hover ALSO misses; canvas rect/GL buffer agree both
  states; scrollTop 0. Suite committed @ 19e8610 with an EXPECTED-FAIL README note. Custodian
  synthesis of its measurements: shown=1265px canvas (drawer's ~6px overflow → scrollbar eats
  15px) vs hidden=1280px vs yesterday's green (no scrollbar) — the width shift moves A9's
  sampled pixel onto a low-alpha edge (12,23,43,45) where fill renders but pick misses. TWO
  defects: (1) the drawer's 6px overflow reintroduces a scrollbar into the measured budget;
  (2) A9's first-non-background heuristic is edge-fragile. Neither is the pick PATH being
  broken (A7'/zoom fit green; the operator's hover worked in Parts A-D).
- P5c RAN → STOP at rule 7 (correct): layout fix verified (no scrollbar, canvas 1280) but A9'
  STILL red — zero interior-verified pixels at its camera state (all candidates edge patches,
  alpha 45 vs fill 180). Custodian committed the two standalone-good fixes (720b6a1 layout,
  2e345d4 A9' interior-hardening) + queued **entry 20** (0888a93): bounded test-side zoom-in
  third attempt recommended, HELD for the human per the entry-0 precedent. The PR waits on 20.
- P6 LANDED @ 6039cf7 (Part J six steps + coverage table + honest entry-20 note; ADR-027 filed
  Proposed with decision item 6 = the human's accepted-with-deadline ruling verbatim; docs/02 +
  README indexes). Pushed.
- Reviewer gate RETURNED: **passes after M1+M2** (both doc overclaims — the coverage table
  claims unexercised paths covered; "fails the build" overstates the line-oriented scan).
  Reviewer's better M2: source the class-B set from src-tauri lib.rs generate_handler! —
  evasion-immune. S1-S6 real (uncoalesced expanded sync; slider evicts the ring in 3 drags;
  recordNamed string unconstrained; class-B error field can carry host paths; the console
  doesn't record its OWN toggles; stale layout comments). A9' diagnosis NOT contradicted.
- P7 LANDED @ d07b664 (M1+M2) + 1eb5272 (S1-S6+NITs), pushed. 456 tests green; e2e:console
  10/10 with REGRESS' sole red = the known A9' (confirmed from nested output); admission 11/11.
  Notable: handler-list regex hardened against a `]` inside doc-comment prose; S1+S5 fallout in
  two e2e steps caught and fixed (CLASSC' owner-filtered; GROUP' double-rAF settle).
  **Reviewer gate now PASSES** (its M1+M2 condition discharged).
- No architect re-review gate for this cut: no architect-blockable ADR is touched (I11 empty
  diff under protocol/ and kernel/ held per reviewer; ADR-027 is Proposed, not blockable; the
  2026-08-18 design consult was the architect's word on the design). Gates complete.
- **The cut waits on exactly one thing: entry 20** (A9' third attempt / expected-fail /
  instrumented diagnosis — the human's call). PR opens after it.
- Entry 20 RESOLVED (human, 2026-08-19): option (a) authorized → P8 ran the bounded zoom
  attempt → **escalation trigger hit**: zero interior candidates at +3 AND +5 notches, several
  at buffer y=0 (frame's own top edge — features look CLIPPED, not small). Instrument
  committed @ 54526d5 (step red and loud by design). **Entry 21 queued** (198250e):
  one instrumented render-diagnosis session recommended, the entry-0 pattern — held for the
  human. Named candidate mechanisms: 6.4:1-aspect camera state leaves the feature band outside
  the 200px strip; fit/letterbox vertical misplacement at extreme aspect; real fill-layer
  regression. The PR waits on 21.
- Entry 21 RESOLVED (human: "start it") → P9 instrumented session RAN, diagnosis DECISIVE:
  **a fourth mechanism — feature-scale-vs-canvas-scale at the whole-dataset fit zoom.** Proven:
  content NOT clipped (rows 20–179 populated pre-zoom); fill layer HEALTHY (baselines A/B:
  22k–32k px at the exact configured alpha 180); alpha-180 population zoom-dependent (A9's
  camera ~11.6× beyond the interior-rich zoom; P8's +3/+5 notches were hopeless). H1/H2/strong-
  H3 all false. No product trace line needed; evidence gitignored in e2e/out/. Product-UX note
  (hover at whole-dataset zoom, sub-pixel features) → owned by ADR-011's tiling/LOD slice
  (gate 8), flagged for the next architect consult + the PR.
- P10 (test-side fix: bounded evidence-driven zoom search in A9', interior-verification
  retained, 15-notch ceiling, loud fail contradicting-P9 branch): dispatched. On double-green:
  the PR opens (entries 20+21 both resolved; all gates passed).
- P10 RAN, held its gate (no commit): search exhausted 15 notches BOTH runs — non-bg RISES to
  90,250 px at notch 2 then falls to exactly 0 at notch 7+ (content exits viewport); every
  candidate at buffer y=0. CONTRADICTED P9's search prediction → custodian re-synthesis,
  CODE-VERIFIED: `summarizePixels` samplePoint is BY ITS OWN TESTS "the first non-background
  pixel encountered in row-major scan" = structurally the content's TOP EDGE. Complete
  three-part mechanism: (1) P9's scale story true at A9's original zoom (3 alpha-180 px);
  (2) at notch 2-3 interiors exist (90k non-bg) but the top-biased samplePoint never offers
  one; (3) yesterday's green predates the P5c verifier — edge-pixel hover worked via deck's
  pick tolerance. Uncommitted P10 harness work carried into P11.
- P11 (FINAL bounded attempt: densest-patch bisection candidate selection via the existing
  regions API, notch-0-first, early-stop on two consecutive non-bg decreases; hard stop + queue
  if not double-green): dispatched.
- P11 DOUBLE-GREEN @ dc3c7aa: interior candidate verified at notch 0, patch fraction 100.0%,
  both runs byte-identical; regression fully green ×2; **first all-green e2e:console run**
  (REGRESS' 133s incl. both sub-suites); admission 11/11. The complete mechanism (scale at
  original zoom was partly overstated + top-edge samplePoint bias + pre-hardening pick
  tolerance) recorded in e2e/README.md's resolution note.
- PR #15 opened with six disclosures; ALL checks green (DCO + shell ×2; Rust workflow
  correctly path-skipped — empty protocol/kernel diff). **ff-merged to main @ 807648f,
  pushed. Cut closed 2026-08-19.** Human items outstanding (queued, unhurried): ADR-027
  acceptance waits for Part J's operator run (the ADR-022 pattern); the hover-at-scale UX
  question is ADR-011 gate-8's, flagged for the next architect consult. Walkthrough batch now
  holds Parts H, I, J.
