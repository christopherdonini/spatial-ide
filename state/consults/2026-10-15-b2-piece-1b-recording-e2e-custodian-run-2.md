# b2-piece-1b-recording at 7b547f90: the custodian's e2e run 2, after the console re-aim (the human's 2026-10-15 ruling)

*The custodian's record, 2026-10-15. The port-5400 harness; the detached checkout C:/dev/wt/mm2b-e2e at 7b547f901cd873ff07f605a06d6b5993c29fb55c; the exe built from 936b7982 (7b547f90 changes e2e/console.mjs only); each suite a fresh app, in one shared hold; the recording suite with the app kept attached (`E2E_SHIM_WAIT`, as in run 1). Log lines are byte-copied by script, cut at 400 characters; every run recorded the fixtures unchanged. Each mutation was applied alone from a scratch patch, run, reverted, and the checkout proven clean.*

## The recording suite (2026-10-15T19:00:10Z to 2026-10-15T19:00:22Z, rc=0)

```text
[OPEN] PASS (106ms): admitted
[APPLY] PASS (570ms): applied, and one record_step row reached ok
[STYLE] PASS (313ms): opacity 0.37 and colour #112233 committed; three record_step rows reached ok
[RESET] PASS (208ms): Reset committed; five record_step rows reached ok
[RECORD] PASS (677ms): unsaved-15faceb696dae71f9703b312a0386669: a header and five steps, in order and chained; the filter names the field zone; the recorded opacities 0.37 and 0.7058823529411765 equal the applied values bit for bit (H6)
```

## The console suite (2026-10-15T19:00:36Z to 2026-10-15T19:05:53Z, rc=0)

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
CLASSC'     PASS    style.setFillColor #112233 -> a new class-A record_step entry (matching rows 0 -> 1) with outcome "ok"; no class-C entry with an ADR-022 owner
GROUP'      PASS    3 style edits -> window items (key, rows inside): ["single a:record_step x1","×2 c:[P6 placeholder] no API equivalent exi x2","×3 a:record_step x3"]; 2 group(s) show 2+ rows inside the window; 4 distinct text(s) among the 4 style.set record_step rows; R=7 <= 256
```

## The re-aimed steps' mutations

- **CON-CLASSC** (the enqueue loop removed from `handleStyleCommit`, the same edit as run 1's REC-STYLE; 2026-10-15T19:06:13Z to 2026-10-15T19:11:39Z, rc=1): CLASSC' fails by name, as predicted; GROUP' also fails, because its style edits record nothing.

```text
CLASSC'     FAIL    CLASSC': no new class-A record_step row for the style.set fillColor #112233 edit reached ok within 5000ms (matching rows before 0, after 0, last outcome null)
GROUP'      FAIL    GROUP': presence: expected 3 style.set record_step rows (0 before plus 3) and no collapsed group in their window within 5000ms (polled every 100ms), found 0, held by items []; keys from the first found row to the last: []; console label total 290 (baseline 287, R=3)
```

- **CON-GROUP** (`groupConsecutiveEntries` never coalesces; 2026-10-15T19:11:59Z to 2026-10-15T19:17:19Z, rc=1): GROUP' fails by name at its split-run check, not at the "grouping not exercised" check the worker predicted (class 2); CLASSC' passes.

```text
CLASSC'     PASS    style.setFillColor #112233 -> a new class-A record_step entry (matching rows 0 -> 1) with outcome "ok"; no class-C entry with an ADR-022 owner
GROUP'      FAIL    GROUP': split run: two adjacent items in the window share the key "c:[P6 placeholder] no API equivalent exists -- switching the"; a run of consecutive identical entries forms one item
```
