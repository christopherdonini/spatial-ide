*Custodian's filing note (2026-09-25): the architect agent's consult for PLAN node `engine-source-change-watcher`, drafting the preregistration's Amendment 4 (wave-1 Finding A2-1 folded in under the wave-1 block's rule (2)), filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything between the two rules is the agent's text. The custodian's triage of its decision 2(b) and the assembled text to append follow the second rule.*

---

**Verdict: pass with notes.** The fold-in fits inside the existing piece. It needs no ADR text, touches no red line, and adds no wire change. One note matters before dispatch: the architect's observation in decision 2(b).

## Decisions

**1. Class.**
- No pre-declared class names a scope addition made on a standing rule. Class 5 (`docs/PREREGISTRATION-TEMPLATE.md` §10, class 5) names only a narrowing.
- The nearest is class 5, read the way this prereg's own Amendments 1 and 2 already read it: "a scope settled on a ruling". Amendment 1 also added tests under that reading.
- The scope was reserved in advance. The Header's wave-1 bullet and §8 item 22 name the fold-in, so this settles content the prereg already anticipated.
- The amendment's first lines disclose the class and say it was written after phase 1's results were seen.
- The template says a class gap goes to the human rather than a new freeform class, and the record cap says the same. **So yes, carry it to the weekly process-proposal list**: class 5's wording ("scope-narrowing") against three uses in this piece that settle scope, one of them an addition. Nothing is settled here.

**2. Shape of the fix.**

(a) A2-1, the baseline manager (`viewportStreamManager.ts`):
- **Outcome.** A late request returns `session-ended`, not `superseded`:
  - `RequestOutcome`'s doc defines `superseded` as losing the supersede counter;
  - the entry check already puts the latch first as the more specific fact;
  - the member docs on `liveTickets` and `generation` forbid mixing the two counters. Fixing this by bumping `this.generation` in the end path would report a changed file as a pan, so the amendment rules it out.
- **The late ticket is cancelled** through the existing `skpCancel`. The authorities are ADR-028 Amendment 4 item 2 (in-flight streams are cancelled through the existing cancel), the manager's own superseded-branch precedent, and the tiled `mintAndStart`'s two abandon checks. The ticket is never admitted to the live set.
- **One check covers both routes.** The source-changed terminal branch and §2d's `notifySessionEnded` call one private end method. That is the tiled `endSession`/`notifySourceChanged` shape, and the method sets the single `sessionEnded` latch.
- **Smallest change:** the latch is read at the two post-await guards that follow a minted ticket (after `viewportQuery`, which is before `admit`, and after `dataPlaneAttach`), ahead of the generation comparison. This mirrors the tiled checks, which also sit only where a ticket exists.
- **After `supersedeCurrent` nothing changes.** No ticket exists there, and the kernel's pre-check refuses the query through the existing refusal route.
- The comment above `admit` states a premise the race falsifies, so it gets corrected.
- **No ADR text needed.** The fix restores the live-set admit precondition that ADR-028 Amendment 4 items 3–4 already assume.

(b) **Architect's observation, not in A2's report and not reproduced (read at main 37eee20).** The candidate arm's own untiled first-look sink has the same hole:
- `candidateArmSession.ts`'s `issueUntiledQuery` checks only `stopped` after its awaits.
- `endCandidateSession` neither cancels the running untiled stream nor clears `untiledStreamHandle`.
- The untiled `onBatch` has no live-ticket check, so a late first look, or an untiled batch still on the wire, is fed to `canvas.pushTileBatch` after `clearAllTiles`.
- A2's "the tiled arm does not have this defect" checked `tileViewportStreamManager.ts` only.
- §2d's event route into the candidate manager makes the late-mint window reachable at open, which it mostly was not before.
- As on the baseline arm, the kernel refuses the redemption end to end.

**My recommendation is to fold it in now as optional item 8** (second block below). If it is left out, I expect to raise it at the phase-2 gate under ADR-028 Amendment 4 item 2. Whether it rides rule (2) under A2-1 or needs its own triage is the custodian's call, since the rule's trigger is an audit S1.

**3. Tests.**
- SH12–SH14 (in the block) go in `frontends/shell/src/streaming/viewportStreamManager.test.ts`.
- SH12 asserts that `dataPlaneAttach` is **not** called for the late ticket. Without that, SH12's mutation would be masked by the post-attach guard, which is still fixed under that mutation.
- All three map to case (g). SH15–SH16 map there too if item 8 is included.

**4. §5, §7, §8 and §9.** In the block:
- **§5:** one prediction, a declared-unchanged list and one invalidator.
- **§7:** no file is added. The closing class-1 budget row names the fold-in commits, and §7 is not edited.
- **§8:** item 23 is added, and item 24 comes with item 8.
- **§9:** the architect gate gains item 23 plus ADR-028 Amendment 4 items 2 and 4 on both routes, and SH12–SH14 join `verify-mutation`.

**6. The human.** Nothing needs the human:
- no ADR status or text;
- no dependency;
- no new `pub` item: the end method is private, `notifySessionEnded` is already in §2d, and the `session-ended` variant already exists and `App.tsx`'s `reportViewportOutcome` already consumes it;
- no wire change and no new operator string.

A2-1's final severity is still the human's, in the after-wave batch as already planned. Item 1 of the amendment records that the fix is owed under ADR-028 Amendment 4 whatever that severity turns out to be.

**Hashes.** None are stated and no placeholder is needed. Every reference is by path, symbol, section or heading, which matches the Header's own rule that no reference carries a line. Item 8 carries one custodian placeholder, for the triage reference.

## Amendment 4 (append at the end of §10)

```
### Amendment 4 — 2026-09-26, written after phase 1's results were seen, before any fold-in code: the wave-1 fold-in of Finding A2-1

Class 5 as Amendments 1 and 2 read it, a scope settled on a ruling. Disclosed: this adds scope and narrows none; no pre-declared class names an addition, class 5 is the nearest, and the gap is carried to the weekly proposal list. The ruling is the Header's wave-1 block (`state/directives/2026-09-25-cloud-hooks.md` §4 rule (2), confirmed by §5), cited and not reproduced. The defect and its triage are `state/cloud/wave1/A2.md`, the WAVE1 REPORT's Finding A2-1 and the custodian fields' Finding A2-1 paragraph. The defect is present at this branch's base and is not introduced by phase 1; §2d's `notifySessionEnded` would add a second route into it. The fix is owed under ADR-028 Amendment 4 items 2 and 4 whatever final severity the human assigns.

1. **Shape (§2d, `ViewportStreamManager`).**
   - The source-changed terminal branch and §2d's `notifySessionEnded` call one private end method, the shape of `TileViewportStreamManager`'s `endSession` and `notifySourceChanged`. It sets the single `sessionEnded` latch before it invalidates.
   - In `requestViewport`, the guard after `viewportQuery` and the guard after `dataPlaneAttach` read the latch before comparing generations. When the latch is set, the minted ticket is cancelled through the existing `skpCancel` and is never admitted to the live set; no stream starts; any handle field naming the ticket is cleared; and the call returns `{ kind: "session-ended" }`.
   - An end never bumps `this.generation`, so a changed file is never reported as `superseded`.
   - The comment above the live-set `admit` is corrected to the guarded premise.
   - The guard after `supersedeCurrent` is unchanged: no ticket exists there, and the kernel's pre-check refuses a later query.
   - The precedent is `tileViewportStreamManager.ts`'s `mintAndStart`, whose two abandon checks cancel a late mint.
   - No new operator string.
2. **Tests (§4, shell, `frontends/shell/src/streaming/viewportStreamManager.test.ts`).** The reproducer named in Finding A2-1 is not merged; SH12 is its inverse.

| Test | Asserts | Mutation |
|---|---|---|
| SH12 | Terminal route: a `viewportQuery` pending when another stream's source-changed terminal ends the session resolves afterwards. The call returns `session-ended`, `skpCancel` receives the late handle, `dataPlaneAttach` and `startStream` are not called for it, and `activeStreamHandle` never names it | the guard after `viewportQuery` compares generations only |
| SH13 | Event route: the same window, with the end delivered by `notifySessionEnded`; the same assertions | `notifySessionEnded` invalidates, clears and notifies without setting the latch |
| SH14 | Event route: the end lands while `dataPlaneAttach` is pending. The call returns `session-ended`, the ticket is cancelled, `startStream` is not called for it, and `activeStreamHandle` is null | the guard after `dataPlaneAttach` compares generations only |

3. **Cases → tests.** Case (g) gains SH12–SH14.
4. **§5.**
   - Prediction: each of SH12–SH14 fails by name under its registered mutation. The SH12 and SH14 mutations restore the code at this branch's base.
   - Declared unchanged by the fold-in: `kernel/`, `protocol/`, `App.tsx`, `tileViewportStreamManager.ts`, and `RequestOutcome`'s variants.
   - Invalidator: the fold-in needs a new `RequestOutcome` variant, a kernel, protocol or wire change, or a `pub` item.
5. **§7.** No file is added. The fold-in's lines count in the shell row, and the closing amendment's class-1 budget row names the fold-in commits. §7 is not edited.
6. **§8, item 23.** A ticket whose `viewport_query` resolves after the session ended, on either route, that is admitted to a live set, has its stream started, or is left uncancelled. Also: an end implemented by bumping the supersede counter.
7. **§9, architect.** The gate adds §8 item 23 and ADR-028 Amendment 4 items 2 and 4, checked on both the terminal route and the event route. SH12–SH14 join `verify-mutation`.
```

## Optional item 8 (append after item 7 only if the custodian classes the candidate-arm sink under rule (2); replace the placeholder by script)

```
8. **The candidate arm's untiled sink** (found at consult by reading main at 37eee20; not reproduced; triage: <CUSTODIAN PLACEHOLDER: path and heading of the triage record>).
   - `candidateArmSession.ts`'s `issueUntiledQuery`: its check after `dataPlaneAttach` reads `sessionEnded` beside `stopped`. When the latch is set, the ticket is cancelled and the call returns `{ kind: "session-ended" }`.
   - `endCandidateSession` cancels a running untiled stream through the existing `cancelUntiledStream`, so the untiled `onBatch`'s existing handle check drops late batches.
   - Tests, in `frontends/shell/src/residency/candidateArmSession.test.ts`, case (g):
     - SH15: an event-route end while the first look's `viewportQuery` is pending. The call returns `session-ended`, the ticket is cancelled, and no stream starts. Mutation: the check after `dataPlaneAttach` reads `stopped` only.
     - SH16: an untiled batch delivered after an event-route end reaches no `pushTileBatch`, and the untiled handle is cancelled. Mutation: `endCandidateSession` omits `cancelUntiledStream`.
   - §8 item 24: an untiled first-look batch or mint admitted after the session ended.
   - §9: the gate checks item 24, and SH15–SH16 join `verify-mutation`.
```

Files read: `C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md`, `C:\dev\spatial-ide\state\cloud\wave1\A2.md`, `C:\dev\spatial-ide\state\directives\2026-09-25-cloud-hooks.md`, `C:\dev\spatial-ide\docs\adr\ADR-028-viewport-bounded-residency-over-budget-contract.md`, `C:\dev\spatial-ide\frontends\shell\src\streaming\viewportStreamManager.ts`, `C:\dev\spatial-ide\frontends\shell\src\streaming\liveTicketSet.ts`, `C:\dev\spatial-ide\frontends\shell\src\streaming\tileViewportStreamManager.ts`, `C:\dev\spatial-ide\frontends\shell\src\residency\candidateArmSession.ts`, `C:\dev\spatial-ide\frontends\shell\src\App.tsx`, `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`.

---

## Custodian triage of decision 2(b)

Read at main 4b08267; `frontends/shell/src` is unchanged since bb98f71. In `frontends/shell/src/residency/candidateArmSession.ts`:
- `endCandidateSession` sets `sessionEnded` and clears the tiles, but does not cancel the untiled stream.
- `issueUntiledQuery` checks only `stopped` after each await.
- The untiled sink's `onBatch` checks only that its handle is current.

So a batch on the untiled stream that arrives after an end reaches `pushTileBatch`. The code path convinces the custodian. It was not reproduced before the fix. SH15–SH16 are its reproduction: they fail under their registered mutations, which restore this code.

Disposition: folded in with A2-1 as the amendment's item 8.
- It is the same client-half defect against ADR-028 Amendment 4 item 2, on the sibling sink.
- The file is already in the preregistration's scope list.
- §2d's event route makes the path reachable at open.

It goes to the human beside A2-1 in the after-wave batch. It is a companion found by the custodian's consult, not an audit finding, and its severity is proposed with A2-1's.

## The text appended to the preregistration

Amendment 4's block above, followed by item 8's block, with item 8's one placeholder replaced by this file's path and section. Assembled by script; 36 lines, sha256 473a7d27cda7a487774d5ea4109d077fa8981602dad22b32649e3b9bb666aa8f.

````text
### Amendment 4 — 2026-09-26, written after phase 1's results were seen, before any fold-in code: the wave-1 fold-in of Finding A2-1

Class 5 as Amendments 1 and 2 read it, a scope settled on a ruling. Disclosed: this adds scope and narrows none; no pre-declared class names an addition, class 5 is the nearest, and the gap is carried to the weekly proposal list. The ruling is the Header's wave-1 block (`state/directives/2026-09-25-cloud-hooks.md` §4 rule (2), confirmed by §5), cited and not reproduced. The defect and its triage are `state/cloud/wave1/A2.md`, the WAVE1 REPORT's Finding A2-1 and the custodian fields' Finding A2-1 paragraph. The defect is present at this branch's base and is not introduced by phase 1; §2d's `notifySessionEnded` would add a second route into it. The fix is owed under ADR-028 Amendment 4 items 2 and 4 whatever final severity the human assigns.

1. **Shape (§2d, `ViewportStreamManager`).**
   - The source-changed terminal branch and §2d's `notifySessionEnded` call one private end method, the shape of `TileViewportStreamManager`'s `endSession` and `notifySourceChanged`. It sets the single `sessionEnded` latch before it invalidates.
   - In `requestViewport`, the guard after `viewportQuery` and the guard after `dataPlaneAttach` read the latch before comparing generations. When the latch is set, the minted ticket is cancelled through the existing `skpCancel` and is never admitted to the live set; no stream starts; any handle field naming the ticket is cleared; and the call returns `{ kind: "session-ended" }`.
   - An end never bumps `this.generation`, so a changed file is never reported as `superseded`.
   - The comment above the live-set `admit` is corrected to the guarded premise.
   - The guard after `supersedeCurrent` is unchanged: no ticket exists there, and the kernel's pre-check refuses a later query.
   - The precedent is `tileViewportStreamManager.ts`'s `mintAndStart`, whose two abandon checks cancel a late mint.
   - No new operator string.
2. **Tests (§4, shell, `frontends/shell/src/streaming/viewportStreamManager.test.ts`).** The reproducer named in Finding A2-1 is not merged; SH12 is its inverse.

| Test | Asserts | Mutation |
|---|---|---|
| SH12 | Terminal route: a `viewportQuery` pending when another stream's source-changed terminal ends the session resolves afterwards. The call returns `session-ended`, `skpCancel` receives the late handle, `dataPlaneAttach` and `startStream` are not called for it, and `activeStreamHandle` never names it | the guard after `viewportQuery` compares generations only |
| SH13 | Event route: the same window, with the end delivered by `notifySessionEnded`; the same assertions | `notifySessionEnded` invalidates, clears and notifies without setting the latch |
| SH14 | Event route: the end lands while `dataPlaneAttach` is pending. The call returns `session-ended`, the ticket is cancelled, `startStream` is not called for it, and `activeStreamHandle` is null | the guard after `dataPlaneAttach` compares generations only |

3. **Cases → tests.** Case (g) gains SH12–SH14.
4. **§5.**
   - Prediction: each of SH12–SH14 fails by name under its registered mutation. The SH12 and SH14 mutations restore the code at this branch's base.
   - Declared unchanged by the fold-in: `kernel/`, `protocol/`, `App.tsx`, `tileViewportStreamManager.ts`, and `RequestOutcome`'s variants.
   - Invalidator: the fold-in needs a new `RequestOutcome` variant, a kernel, protocol or wire change, or a `pub` item.
5. **§7.** No file is added. The fold-in's lines count in the shell row, and the closing amendment's class-1 budget row names the fold-in commits. §7 is not edited.
6. **§8, item 23.** A ticket whose `viewport_query` resolves after the session ended, on either route, that is admitted to a live set, has its stream started, or is left uncancelled. Also: an end implemented by bumping the supersede counter.
7. **§9, architect.** The gate adds §8 item 23 and ADR-028 Amendment 4 items 2 and 4, checked on both the terminal route and the event route. SH12–SH14 join `verify-mutation`.
8. **The candidate arm's untiled sink** (found at consult by reading main at 37eee20; not reproduced; triage: `state/consults/2026-09-25-source-watcher-amendment-4.md`, its section Custodian triage of decision 2(b)).
   - `candidateArmSession.ts`'s `issueUntiledQuery`: its check after `dataPlaneAttach` reads `sessionEnded` beside `stopped`. When the latch is set, the ticket is cancelled and the call returns `{ kind: "session-ended" }`.
   - `endCandidateSession` cancels a running untiled stream through the existing `cancelUntiledStream`, so the untiled `onBatch`'s existing handle check drops late batches.
   - Tests, in `frontends/shell/src/residency/candidateArmSession.test.ts`, case (g):
     - SH15: an event-route end while the first look's `viewportQuery` is pending. The call returns `session-ended`, the ticket is cancelled, and no stream starts. Mutation: the check after `dataPlaneAttach` reads `stopped` only.
     - SH16: an untiled batch delivered after an event-route end reaches no `pushTileBatch`, and the untiled handle is cancelled. Mutation: `endCandidateSession` omits `cancelUntiledStream`.
   - §8 item 24: an untiled first-look batch or mint admitted after the session ended.
   - §9: the gate checks item 24, and SH15–SH16 join `verify-mutation`.
````
