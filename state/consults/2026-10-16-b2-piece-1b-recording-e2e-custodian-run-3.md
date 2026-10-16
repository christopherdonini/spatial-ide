# b2-piece-1b-recording at 3dfc1a0e: the custodian's e2e run 3, GROUP' with the group toggle's class-C proof (the human's 2026-10-16 direction)

*The custodian's record, 2026-10-16. The port-5400 harness; the detached checkout C:/dev/wt/mm2b-e2e at 3dfc1a0e51ac1936a1008d815c8d19b8dab69367; the exe built from 936b7982 (7b547f90 and 3dfc1a0e change e2e/console.mjs only); each suite a fresh app, in one shared hold. Log lines are byte-copied by script, cut at 400 characters; every run recorded the fixtures unchanged. Each mutation was made at the head by an anchored one-line edit, applied alone, run, reverted, and the checkout proven clean. The worker reports: `state/consults/2026-10-15-b2-piece-1b-recording-console-reaim-worker-report.md` (the 2026-10-15 re-aim, sha256 ad2ad43c, its run 2026-10-15T18:54:41Z to 2026-10-15T18:59:32Z by its transcript) and `state/consults/2026-10-16-b2-piece-1b-recording-group-toggle-worker-report.md` (the addition, sha256 57aad04e, its run 2026-10-16T07:05:38Z to 2026-10-16T07:09:19Z), each from its one hand-back; the second is byte-identical except its one scratch-folder path, masked because a tracked file holds no profile path.*

## The console suite (2026-10-16T07:09:48Z to 2026-10-16T07:15:15Z, rc=0)

```text
HEADER' PASS
ECHO' PASS
TWOCMD' PASS
HEXLIM' PASS
REFUSAL' PASS
CLASSB' PASS
CLASSC' PASS
GROUP' PASS
COPYTRUNC' PASS
UNCLASS' PASS
REGRESS' PASS
GROUP'      PASS    3 style edits -> window items (key, rows inside): ["single a:record_step x1","×2 c:[P6 placeholder] no API equivalent exi x2","×3 a:record_step x3"]; 2 group(s) show 2+ rows inside the window; 4 distinct text(s) among the 4 style.set record_step rows; R=7 <= 256; one group-header click wrote 1 entry (label total 294 -> 295), a class-C row with owner "docs/03 §\"The action conso
```

## GROUP''s two mutations

- **CON-GROUP** (`groupConsecutiveEntries` never coalesces, re-observed at the new head; 2026-10-16T07:15:35Z to 2026-10-16T07:20:51Z, rc=1): GROUP' fails by name at its split-run check, as in run 2; every other step passes.

```text
GROUP'      FAIL    GROUP': split run: two adjacent items in the window share the key "c:[P6 placeholder] no API equivalent exists -- switching the"; a run of consecutive identical entries forms one item
```

- **CON-TOGGLE** (the group header's `recordNamed` call removed from `ConsolePanel.tsx` `ConsoleGroupRow`, the one line below; 2026-10-16T07:21:12Z to 2026-10-16T07:26:37Z, rc=1): GROUP' fails by name on the new assertion, as the direction predicts; every other step passes.

```text
-          recordNamed("gui-action", "console.toggleGroupExpanded");
```

```text
GROUP'      FAIL    GROUP': toggle: one click on a group header wrote no console entry within 5000ms (label total 288 before, 288 after)
```
