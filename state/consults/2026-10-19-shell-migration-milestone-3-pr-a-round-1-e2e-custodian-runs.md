# shell-migration-milestone-3 PR A: the custodian's e2e runs at 621cd1f3, after correction round 1

*The custodian's record (2026-10-19). Built by script from each run's artifacts (the suite log, the runner output, the app's stderr capture), copied whole into the custodian's scratch folder right after each run; every quoted line byte-copied whole, CR removed. The exe as at 7e4ea32a's runs (`state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md`); no exe source differs, checked by git; the frontend served by vite from the checkout.*

## The hold and the runs

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:28616 also=bash.exe:47380 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:28616 affinity=FF (cores 0-7)
```

```text
label mm3a-r1 head 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2 exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f built at be6aa6203a196f553ec08f697d678dfa08a78bd4; no exe source differs; start 2026-10-19T19:37:02Z
command-bar: rc=0, 2026-10-19T19:37:02Z to 2026-10-19T19:37:35Z, fixtures unchanged 
layout: rc=0, 2026-10-19T19:37:35Z to 2026-10-19T19:38:39Z, fixtures unchanged 
regression: rc=0, 2026-10-19T19:38:39Z to 2026-10-19T19:43:22Z, fixtures unchanged 
mut-E-CTRLK: rc=1, 2026-10-19T19:43:23Z to 2026-10-19T19:44:06Z, fixtures unchanged mutation=E-CTRLK diff-lines=2 reverted-clean-at=621cd1f3
mut-E-SEARCH: rc=1, 2026-10-19T19:44:06Z to 2026-10-19T19:44:42Z, fixtures unchanged mutation=E-SEARCH diff-lines=2 reverted-clean-at=621cd1f3
mut-E-SEARCH-b: rc=1, 2026-10-19T19:44:43Z to 2026-10-19T19:45:14Z, fixtures unchanged mutation=E-SEARCH-b diff-lines=2 reverted-clean-at=621cd1f3
mut-E-HELP: rc=1, 2026-10-19T19:45:14Z to 2026-10-19T19:45:47Z, fixtures unchanged mutation=E-HELP diff-lines=2 reverted-clean-at=621cd1f3
mut-E-BARFOCUS: rc=1, 2026-10-19T19:45:47Z to 2026-10-19T19:46:17Z, fixtures unchanged mutation=E-BARFOCUS diff-lines=2 reverted-clean-at=621cd1f3
mut-E-REVEAL: rc=1, 2026-10-19T19:46:17Z to 2026-10-19T19:47:46Z, fixtures unchanged mutation=E-REVEAL diff-lines=2 reverted-clean-at=621cd1f3
mut-E-SLASH: rc=1, 2026-10-19T19:47:46Z to 2026-10-19T19:48:19Z, fixtures unchanged mutation=E-SLASH diff-lines=2 reverted-clean-at=621cd1f3
checkout clean at end, 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2
end 2026-10-19T19:48:19Z
```

## Against the form

- **command-bar, layout and regression** pass at the head (StudioLayout's focus handling changed in round 1).
- **The seven mutations** each fail by the step named. E-BARFOCUS ran on its round 1 anchor; E-REVEAL timed out, one of its two named outcomes, with E-SLASH failing behind it in that run.
- **E-SEARCH-b,** run for the first time: it fails E-SEARCH, but on the assertion before the predicted one: `E-SEARCH FAIL E-SEARCH: the first option's top (18.890625) is above the top bar's bottom (40)`. The predicted `elementFromPoint` line is not reached. A wrong prediction is a result (class 2).

## The mutation runs' failing lines

### E-CTRLK, applied alone, reverted, the checkout clean at 621cd1f3

```text
E-CTRLK       FAIL    E-CTRLK: 0 layout.toggleLayers rows were recorded, expected exactly 1
```

### E-SEARCH, applied alone, reverted, the checkout clean at 621cd1f3

```text
E-SEARCH      FAIL    E-SEARCH: the text to lay lists 0 options ([]), expected the one entry Zoom to layer
```

### E-SEARCH-b, applied alone, reverted, the checkout clean at 621cd1f3

```text
E-SEARCH      FAIL    E-SEARCH: the first option's top (18.890625) is above the top bar's bottom (40)
```

### E-HELP, applied alone, reverted, the checkout clean at 621cd1f3

```text
E-HELP        FAIL    E-HELP: ? lists 4 options, expected 11
```

### E-BARFOCUS, applied alone, reverted, the checkout clean at 621cd1f3

```text
E-CTRLK       FAIL    E-CTRLK: /lay then Tab left "/lay" in the bar, expected "/layers"
E-BARFOCUS    FAIL    E-BARFOCUS: Tab with no list open left the bar's input holding the focus
```

### E-REVEAL, applied alone, reverted, the checkout clean at 621cd1f3

```text
E-REVEAL      FAIL    E-REVEAL: timed out after 60000ms
E-SLASH       FAIL    E-SLASH: the focus left the Filter section's input when / was typed in it
```

### E-SLASH, applied alone, reverted, the checkout clean at 621cd1f3

```text
E-SLASH       FAIL    E-SLASH: the focus left the Filter section's input when / was typed in it
```
