# shell-migration-milestone-3 PR A: the custodian's e2e runs at 2fa7c8d0, after correction round 2

*The custodian's record (2026-10-19). Built by script from each run's artifacts (the suite log, the runner output, the app's stderr capture), copied whole into the custodian's scratch folder right after each run; every quoted line byte-copied whole, CR removed. The exe as at 7e4ea32a's runs (`state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md`); no exe source differs, checked by git; the frontend served by vite from the checkout. Each mutation was checked before the series against the header at the head: its path on its header line, its from-text and to-text each once in the header, its anchor once in its file.*

## The hold and the runs

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:49364 also=bash.exe:26192 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:49364 affinity=FF (cores 0-7)
```

```text
label mm3a-r2 head 2fa7c8d09df2e8f21370c1bf68b23213a25615a0 exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f built at be6aa6203a196f553ec08f697d678dfa08a78bd4; no exe source differs; start 2026-10-19T20:31:55Z
command-bar: rc=0, 2026-10-19T20:31:55Z to 2026-10-19T20:32:27Z, fixtures unchanged 
layout: rc=0, 2026-10-19T20:32:27Z to 2026-10-19T20:33:31Z, fixtures unchanged 
regression: rc=0, 2026-10-19T20:33:32Z to 2026-10-19T20:38:16Z, fixtures unchanged 
mut-E-CTRLK: rc=1, 2026-10-19T20:38:17Z to 2026-10-19T20:39:00Z, fixtures unchanged mutation=E-CTRLK diff-lines=2 reverted-clean-at=2fa7c8d0
mut-E-SEARCH: rc=1, 2026-10-19T20:39:00Z to 2026-10-19T20:39:37Z, fixtures unchanged mutation=E-SEARCH diff-lines=2 reverted-clean-at=2fa7c8d0
mut-E-SEARCH-b: rc=1, 2026-10-19T20:39:37Z to 2026-10-19T20:40:08Z, fixtures unchanged mutation=E-SEARCH-b diff-lines=2 reverted-clean-at=2fa7c8d0
mut-E-SEARCH-c: rc=1, 2026-10-19T20:40:09Z to 2026-10-19T20:40:40Z, fixtures unchanged mutation=E-SEARCH-c diff-lines=1 reverted-clean-at=2fa7c8d0
mut-E-HELP: rc=1, 2026-10-19T20:40:40Z to 2026-10-19T20:41:12Z, fixtures unchanged mutation=E-HELP diff-lines=2 reverted-clean-at=2fa7c8d0
mut-E-BARFOCUS: rc=1, 2026-10-19T20:41:12Z to 2026-10-19T20:41:42Z, fixtures unchanged mutation=E-BARFOCUS diff-lines=2 reverted-clean-at=2fa7c8d0
mut-E-REVEAL: rc=1, 2026-10-19T20:41:42Z to 2026-10-19T20:43:10Z, fixtures unchanged mutation=E-REVEAL diff-lines=2 reverted-clean-at=2fa7c8d0
mut-E-SLASH: rc=1, 2026-10-19T20:43:11Z to 2026-10-19T20:43:43Z, fixtures unchanged mutation=E-SLASH diff-lines=2 reverted-clean-at=2fa7c8d0
checkout clean at end, 2fa7c8d09df2e8f21370c1bf68b23213a25615a0
end 2026-10-19T20:43:44Z
```

## Against the form

- **command-bar, layout and regression** pass at the head (the bar's run now commits inside `flushSync` before the focus goes back).
- **The eight mutations** each fail, each applied alone at the head and reverted with the checkout clean. No suite log names unknown-attempt.
- **E-SEARCH-c,** run for the first time: it fails E-SEARCH on the predicted `elementFromPoint` assertion, as predicted.

## The mutation runs' failing lines

### E-CTRLK, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-CTRLK       FAIL    E-CTRLK: 0 layout.toggleLayers rows were recorded, expected exactly 1
```

### E-SEARCH, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-SEARCH      FAIL    E-SEARCH: the text to lay lists 0 options ([]), expected the one entry Zoom to layer
```

### E-SEARCH-b, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-SEARCH      FAIL    E-SEARCH: the first option's top (18.890625) is above the top bar's bottom (40)
```

### E-SEARCH-c, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-SEARCH      FAIL    E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option
```

### E-HELP, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-HELP        FAIL    E-HELP: ? lists 4 options, expected 11
```

### E-BARFOCUS, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-CTRLK       FAIL    E-CTRLK: /lay then Tab left "/lay" in the bar, expected "/layers"
E-BARFOCUS    FAIL    E-BARFOCUS: Tab with no list open left the bar's input holding the focus
```

### E-REVEAL, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-REVEAL      FAIL    E-REVEAL: timed out after 60000ms
E-SLASH       FAIL    E-SLASH: / pressed from the map left the bar focused holding "", expected it focused holding "/"
```

### E-SLASH, applied alone, reverted, the checkout clean at 2fa7c8d0

```text
E-SLASH       FAIL    E-SLASH: the focus left the Filter section's input when / was typed in it
```
