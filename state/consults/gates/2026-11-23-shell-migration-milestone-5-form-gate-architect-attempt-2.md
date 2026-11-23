Reviewed: main at caea224a6cb081edc4577e978e408692c0c1172c, in the detached read worktree C:/dev/wt/read-1123d (the custodian's filing note, 2026-11-23: the architect's form gate on the full form under Amendments 2 and 3, attempt 2, node:shell-migration-milestone-5@form-gate-architect-2, dispatched at 2026-11-23T16:14:00Z; its run: Read 34, Grep 21, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:14:03Z to 2026-11-23T16:24:33Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13967 bytes, sha256 c9ee21f9bfaf08179b731b0b975e257c95cc18f08e5f4c7bf0c167b83c03f0f3, byte for byte, nothing masked, with one final newline added. FAIL: E-2 (Evidence: the stream-terminal raise in App.tsx has no test that fails when it is lost, since C-E1 accepts its count either way; the gate gives a biconditional count and a C-A5 row); D-1 to D-4 Documentation (the reducer tests raise after opened, seam 3 names C-E2, the class-9 record names its rule, the operator Part); N-1 to N-7 notes; E-1 items 1 to 5 and C-1 answered; OPEN-1 (D) and OPEN-2 to OPEN-7 (a) read sound, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123d @ caea224a6cb081edc4577e978e408692c0c1172c

All cites are at caea224a. As the brief says, the code is unchanged from 96f56d28, so I resolved Amendment 2's cites at caea224a. Every code cite it gives holds, except where a finding below says otherwise.

## Attempt-1 findings, by id

- **E-1 item 1: answered.** The arm map is at form:697-714. C-E1, H2, H3 and §3 row 1 run in `conditions-baseline.mjs`, pinned as `e2e/refusal-contract-baseline.mjs:596-617` pins. The separate process matches that suite's precedent (`:24-43`). The canvas-ceiling route is baseline-only (`frontends/shell/src/canvas/WorkingCanvas.tsx:1536-1548`). The stream-terminal route is baseline-only too: `App.tsx:1892` lies after the candidate branch's return at `:1838-1850`. But see E-2.
- **E-1 item 2: answered.** C-A1 moves to routes the candidate harness reaches:
  - the first look rejects through `reissueUnrestricted` (`residency/candidateArmSession.ts:1304`, which passes the refusal on unchanged);
  - `refuseRecordWith` is at `App.recording.test.tsx:20`, `:69-72` and `:229`;
  - the events mock already exists (`App.streamFailure.test.tsx:83-85`).
- **E-1 item 3: answered, and the shipped-arm proof is enough.** C-E2 proves seam 8 end to end on the shipped arm. A viewport refusal that is not suppressed has one raise site (`App.tsx:1623`), and C-A1 and C-A3 drive it through the real candidate session with only the transport mocked. The real app reaches it only through a fault injector, a dev-only switch. Its disclosure (form:781) suffices.
- **E-1 item 4: answered.**
  - `App.tsx:2306-2321` holds `relinquishFill`.
  - `relinquishedText` is at `residency/residencyStatus.ts:462-464`.
  - SLOW'/CANCEL' clicks `button.filter-cancel` (`refusal-contract-baseline.mjs:479-484`), so the baseline branch stays covered.
  - The twin-case comparison removes the pass case.
- **E-1 item 5: answered.** Step 0a matches D0 (`frontends/shell/MANUAL-WALKTHROUGH.md:218`). Step 3a's fresh launch resets the arm (`:222`). See D-4.
- **C-1: answered.** The `opened` dispatch site is `App.tsx:1182`. The reopen order is `:1221` then `:1238`. The guard at `:742` is right. C-U6a, C-U7a and C-U7b each have a mutation that kills them. But the change brings in D-1.
- **D-a to D-g:** adopted. They are byte-identical to the attempt-1 report, and each Old occurs once above Amendment 2.
- **The notes:** each is answered (C-U3, the post-check route, the reopen notices, the alert role, one closing per PR, the ceiling prediction).
- **Every Old text in Amendment 2** occurs once in the form above it, and each addition names where it goes.

## Correctness and Evidence findings (these block)

**E-2 (Evidence). The stream-terminal raise (`App.tsx:1892`) has no test that fails when it is lost. So §2.5 item 1 as amended, "The baseline-only routes are proven in the real app by C-E1", is not supported.**

Places: C-E1's New row (form:750), the harness line (form:761) and §2.5 item 1's New text (form:877).
- C-E1 accepts S-3 at 1 whether or not the session log holds the post-check route's `stream-terminal-failure` line (`App.tsx:1887`). If that line is present and the stream-terminal condition is missing, C-E1 still passes.
- No App test reaches `:1892` (form:761).
- So a deletion of the `:1892` raise passes every test.

The fix, by amendment, before code:
- (i) Make C-E1's count biconditional, replacing this clause:
```text
write and pan, and the top is session ended with S-3 at 1 and both rows standing, or S-3 at 2 only when the session log holds a `stream-terminal-failure` line whose detail opens with `engine.source_changed` (`App.tsx:1887`), the extra row being that stream-terminal condition; any other count fails;
```
```text
write and pan, and the top is session ended; S-3 is at 1, with both rows standing, exactly when the session log from the write on holds no `stream-terminal-failure` line whose text after `— ` opens with `engine.source_changed` (`App.tsx:1887`), and S-3 is at 2, the extra row being that stream-terminal condition, exactly when it holds one; any other pairing fails;
```
- (ii) Give the route a deterministic proof. I recommend a C-A5 row in `App.conditions.test.tsx`, in its own `describe`:
  - its `beforeEach` pins baseline before the first `openPath`, as `canvas/WorkingCanvas.wiring.test.tsx:84-85` does;
  - the already-mocked `ViewportStreamManager` keeps the options App constructs it with (`App.tsx:1863-1921`; the `onTerminal` key is from `makeManagerCallbacks`, `:601`);
  - calling their `onTerminal` with a `ProducerFailed` terminal gives one stream-terminal condition;
  - its mutation is "App does not raise at `:1892`", with the set {C-A5}.
  - The other way to close (ii) is to add to E-1 item 3's not-covered list that the stream-terminal raise is proven only on a run that takes the post-check route.
  - Either way, the App.conditions overrun grows, recorded as class 8.

## Documentation findings (must be fixed before the merge, by amendment; none is the human's wording, so the worker applies these words with no re-gate and the PR body lists them)

**D-1. The reducer tests that raise no longer state `opened(R)` first.** Under C-1, a raise while `current` is `null` is dropped (form:934). C-U7 (form:382) and C-U7a (form:960), written literally, would fail against a correct reducer. C-U2, C-U3, C-U5 and C-U6 are affected the same way.
```text
| C-U7 | A | `CONDITIONS_MAX + 1` raises: the oldest 64 are kept and `notKept` is 1 | drop the oldest; {C-U7} |
```
```text
| C-U7 | A | after `opened(R)`, `CONDITIONS_MAX + 1` raises under R, each with its own key: the oldest 64 are kept and `notKept` is 1 | drop the oldest; {C-U7} |
```
```text
**`opened` resets `notKept`:** `CONDITIONS_MAX + 1` raises under R give `notKept` 1;
```
```text
**`opened` resets `notKept`:** after `opened(R)`, `CONDITIONS_MAX + 1` raises under R, each with its own key, give `notKept` 1;
```
```text
**What may be mocked:** the App tests mock only what `App.streamFailure.test.tsx:4-11` mocks. Mocking `conditionsReducer`, `ConditionView` or `jobsFrom` is I5.
```
```text
**What may be mocked:** the App tests mock only what `App.streamFailure.test.tsx:4-11` mocks. Mocking `conditionsReducer`, `ConditionView` or `jobsFrom` is I5. Every C-U case that raises dispatches `opened(R)` before its first raise, except C-U6a's fresh-state case (Amendment 2, C-1).
```

**D-2. Seam 3 still names only the baseline e2e.** The strip slot and S-3 do not depend on the arm, and C-E2 drives them on the shipped arm.
```text
3. StudioLayout's `attention.top` slot and `attentionOthers`: C-R3, then C-E1.
```
```text
3. StudioLayout's `attention.top` slot and `attentionOthers`: C-R3, then C-E2 on the shipped candidate arm and C-E1 in its baseline-pinned process.
```
```text
| select Console; {C-R3, C-E1} |
```
```text
| select Console; {C-R3, C-E1, C-E2} |
```

**D-3. The class-9 record.** The first line names no rule. The addition declares nothing for §5, and §9's suites line still says "the new one" (`docs/PREREGISTRATION-TEMPLATE.md:170`). The rule is round 4, item 1: per `governance/forms/frontends/OWNER-INVALIDATION-PREREGISTRATION.md:1058`, the round-4 RULED block has only one item.
```text
The scope additions below are declared before any code. All are in PR A:
```
```text
Scope addition (class 9) on the seam rule (round 4, item 1), as the architect's form gate, attempt 1, E-1 applied it. The additions below are declared before any code. Declared unchanged for them (§5): `limits.ts`'s existing exports and every existing case in `limits.test.ts`; I1 to I8 invalidate them as they do the rest. All are in PR A:
```
```text
  - every e2e suite at the base plus the new one, by the suites' own launch;
```
```text
  - every e2e suite at the base plus the new ones (`conditions.mjs` and `conditions-baseline.mjs` for PR A, `jobs.mjs` for PR B), by the suites' own launch;
```

**D-4. The operator Part.**
- Step 2's "1 more" leaves out C-E1's second declared outcome.
- Step 3a's save can add notices: when the data is inside the project folder, `project/saveProject.ts:118-119` adds one.
```text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build.
```
```text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build. In step 2 the strip may show "2 more", and Problems a stream-terminal row, when the session ended on the post-check route (C-E1); in step 3 every row is then gone.
```
```text
Open a copy of the 100k fixture and save the project; the strip shows the save notice.
```
```text
Open a copy of the 100k fixture and save the project into a new folder that does not hold the copy; the strip shows the save notice.
```

## Notes (none blocks)

- **N-1, the drafter's point 2 (the ceiling kind at its producer): for the code's gates.** A constant `"vertex-ceiling"` at the `WorkingCanvas.tsx:1540` call passes C-K1, C-A2 and C-E1. C-E1 reaches only the vertex ceiling. The pick ceiling is 24-bit (`canvas/limits.ts:101-117`) and cannot practically be reached end to end. I recommend a C-K2 in the real-`WorkingCanvas` harness (`WorkingCanvas.wiring.test.tsx`, baseline pinned at `:85`), driving the catch at `:1538` with each class.
- **N-2, the drafter's point 3 (H6): for the code's gates; class 2 and a stop if it is wrong.** A pan's tile fill may end before the click. J-E1's status assertion stops a false pass. Aiming J-E1 at a FilterPanel Apply of the slow predicate would be more robust, since that is the fixture's purpose. After a settled first look, `relinquishFill` cancels the untiled stream (`candidateArmSession.ts:1886-1887`), and the result matches operator step 4, which filters.
- **N-3, H2 and H7.** "a write" names no mechanism. `e2e/source-watch-idle.mjs:446-458` ends a session on the shipped arm by an mtime touch with a hash check; name it or another mechanism.
- **N-4, C-E2.** "the save notices include `SAVED_NOTICE`" and then "S-3 is absent": the later counts assume exactly one notice. State it as exactly `[SAVED_NOTICE]`. A withheld history mark would add one (`saveProject.ts:117`).
- **N-5, C-A3's reopen and refused reopen.** These need client calls that the transport mock does not answer today (`App.streamFailure.test.tsx:57-81`). The amendment declares only `recordStep`.
- **N-6, the attach path.** Attached to an app that `conditions-baseline.mjs` left pinned, `conditions.mjs` and `jobs.mjs` fail their readback loudly, which is correct. Run them by the suites' own launch.
- **N-7, the records.**
  - Amendment 2's line cites carry no span hashes (Amendment 3 item 3). I resolved each at caea224a, and the re-sweep binds.
  - Amendment 2 spans form:691-1189, and the consult's marked text spans `:8-506`: 499 lines each. The reviewer recomputes Amendment 3's sha256.
- **The drafter's other points:**
  - point 1: settled above (enough);
  - point 4: blocks, as E-2;
  - point 5: sound (`App.tsx:2140-2147`, with `:1612-1613` reached before any session end), for the code's gates;
  - point 6: for the code's gates (class 8 at the count). The re-link base reading is the advisor's;
  - point 7: nothing to do.
- **§21a to §21c.** The piece is already fully gated. §7 is not edited. The predicted overruns (package.json 2 against 1, A-E about 960 against 620, App.conditions about 560 against 480, PR A about 3,550 against 3,094) are correctly deferred to class 8 at the count. The arithmetic checks: 3,094 + 456 = 3,550.

## OPEN items and drafts of shown words (to the advisor; not ruled)

- **OPEN-1 (D), OPEN-3 (a), OPEN-4 (a), OPEN-5 (a), OPEN-6 (a), OPEN-7 (a), OPEN-8:** sound against the code, unchanged since attempt 1.
- **OPEN-2 (a):** sound. Its producer is baseline-only, and the pick kind's producer call is unproven (N-1).
- **D-h:** sound, but "map loading" holds only as far as `isScanInFlight` does.
- **D-i:** sound.
- **S-13:** sound. Both statements name the setters that are removed (`console/surfaceRegistry.ts:234-236`, `:243-244`).
- **The plan §9 cap note:** the advisor's.
- **KL-D:** with C-1, every successful open empties Problems, including a reopen of the same file.

## Files read (at caea224a, in C:/dev/wt/read-1123d)

- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md` (§0 to §10, Amendments 2 and 3)
- `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect.md`
- `state/consults/2026-11-23-shell-migration-milestone-5-amendment-2-architect-draft.md` (`:505-533`)
- `governance/AUTONOMY.md:315-359`
- `docs/PREREGISTRATION-TEMPLATE.md:160-173`
- `governance/forms/frontends/OWNER-INVALIDATION-PREREGISTRATION.md` (by grep)
- `frontends/shell/src/App.tsx`
- `frontends/shell/src/App.streamFailure.test.tsx`
- `frontends/shell/src/App.recording.test.tsx` (by grep)
- `frontends/shell/src/residency/candidateArmSession.ts`
- `frontends/shell/src/residency/residencyStatus.ts`
- `frontends/shell/src/residency/residencyArm.ts`
- `frontends/shell/src/canvas/WorkingCanvas.tsx`
- `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`
- `frontends/shell/src/canvas/limits.ts`
- `frontends/shell/src/canvas/limits.test.ts` (by grep)
- `frontends/shell/src/streaming/viewportStreamManager.ts`
- `frontends/shell/src/project/saveProject.ts`
- `frontends/shell/src/console/surfaceRegistry.ts`
- `frontends/shell/e2e/refusal-contract-baseline.mjs`
- `frontends/shell/e2e/source-changed.mjs`
- `frontends/shell/e2e/source-watch-idle.mjs`
- `frontends/shell/e2e/project.mjs`
- `frontends/shell/MANUAL-WALKTHROUGH.md:205-224`

Model: Opus 5.5.
