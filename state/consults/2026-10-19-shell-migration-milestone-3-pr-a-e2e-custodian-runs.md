# shell-migration-milestone-3 PR A: the custodian's e2e runs at 7e4ea32a

*The custodian's record (2026-10-19), for the form's §9 suites and H3 (Amendment 3 item 12): every existing suite at PR A's head, source-changed's post route, the new `e2e/command-bar.mjs`, and its six mutations as the PR A worker wrote them down. Built by script from each run's artifacts (the suite log, the runner output, the app's stderr capture, and any report and session log), each copied whole into the custodian's scratch folder right after its run. Every quoted line is byte-copied whole, with CR removed.*

## Setup

- **Head:** 7e4ea32a0ccef474b8b05ed582271a4baa24101f (branch `cut/shell-migration-milestone-3-pr-a`, from the code base 564aadae), in the custodian's e2e checkout `C:/dev/wt/mm2b-e2e`, detached there, clean at the start and at the end.
- **The exe:** `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f, built at be6aa6203a196f553ec08f697d678dfa08a78bd4. PR A changes no Rust; the series checked by git that no exe source differs between that commit and the head. The frontend is served by vite from the checkout, so the head's shell code, and each mutation, is what ran.
- **The hold:** one shared hold. This project's lines of the machine script's output:

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:20148 also=bash.exe:47824 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:20148 affinity=FF (cores 0-7)
```

## The runs

```text
label mm3a-s1 head 7e4ea32a0ccef474b8b05ed582271a4baa24101f exe D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f built at be6aa6203a196f553ec08f697d678dfa08a78bd4; no exe source differs; start 2026-10-19T18:22:06Z
recording: rc=0, 2026-10-19T18:22:06Z to 2026-10-19T18:22:27Z, fixtures unchanged 
export-view: rc=0, 2026-10-19T18:22:27Z to 2026-10-19T18:23:04Z, fixtures unchanged 
selection: rc=0, 2026-10-19T18:23:04Z to 2026-10-19T18:27:11Z, fixtures unchanged 
regression: rc=0, 2026-10-19T18:27:12Z to 2026-10-19T18:32:07Z, fixtures unchanged 
layout: rc=0, 2026-10-19T18:32:07Z to 2026-10-19T18:33:21Z, fixtures unchanged 
style: rc=0, 2026-10-19T18:33:21Z to 2026-10-19T18:33:43Z, fixtures unchanged 
console: rc=0, 2026-10-19T18:33:43Z to 2026-10-19T18:39:15Z, fixtures unchanged 
publish: rc=0, 2026-10-19T18:39:15Z to 2026-10-19T18:39:43Z, fixtures unchanged 
admission-remediation: rc=0, 2026-10-19T18:39:43Z to 2026-10-19T18:40:24Z, fixtures unchanged 
filter: rc=0, 2026-10-19T18:40:25Z to 2026-10-19T18:40:48Z, fixtures unchanged 
filter-panel: rc=0, 2026-10-19T18:40:48Z to 2026-10-19T18:41:30Z, fixtures unchanged 
refusal-contract-baseline: rc=0, 2026-10-19T18:41:30Z to 2026-10-19T18:42:22Z, fixtures unchanged 
residency-harness: rc=0, 2026-10-19T18:42:22Z to 2026-10-19T18:42:49Z, fixtures unchanged 
source-changed: rc=0, 2026-10-19T18:42:49Z to 2026-10-19T18:43:21Z, fixtures unchanged 
source-watch-idle: rc=0, 2026-10-19T18:43:21Z to 2026-10-19T18:43:48Z, fixtures unchanged 
pan-anchor: rc=0, 2026-10-19T18:43:48Z to 2026-10-19T18:46:37Z, fixtures unchanged 
source-changed-post: rc=1, 2026-10-19T18:46:37Z to 2026-10-19T18:47:10Z, fixtures unchanged 
command-bar: rc=0, 2026-10-19T18:47:10Z to 2026-10-19T18:47:45Z, fixtures unchanged 
mut-E-CTRLK: rc=1, 2026-10-19T18:47:45Z to 2026-10-19T18:48:18Z, fixtures unchanged mutation=E-CTRLK diff-lines=2 reverted-clean-at=7e4ea32a
mut-E-SEARCH: rc=1, 2026-10-19T18:48:18Z to 2026-10-19T18:48:51Z, fixtures unchanged mutation=E-SEARCH diff-lines=2 reverted-clean-at=7e4ea32a
mut-E-HELP: rc=1, 2026-10-19T18:48:51Z to 2026-10-19T18:49:24Z, fixtures unchanged mutation=E-HELP diff-lines=2 reverted-clean-at=7e4ea32a
mut-E-BARFOCUS: rc=1, 2026-10-19T18:49:24Z to 2026-10-19T18:49:54Z, fixtures unchanged mutation=E-BARFOCUS diff-lines=2 reverted-clean-at=7e4ea32a
mut-E-REVEAL: rc=1, 2026-10-19T18:49:54Z to 2026-10-19T18:51:23Z, fixtures unchanged mutation=E-REVEAL diff-lines=2 reverted-clean-at=7e4ea32a
mut-E-SLASH: rc=1, 2026-10-19T18:51:23Z to 2026-10-19T18:51:56Z, fixtures unchanged mutation=E-SLASH diff-lines=2 reverted-clean-at=7e4ea32a
checkout clean at end, 7e4ea32a0ccef474b8b05ed582271a4baa24101f
end 2026-10-19T18:51:56Z
```

## Against the form

- **H3 (every existing suite unchanged at the head):** held. Every existing suite passed; source-changed's post route failed on S5d alone, recorded beside the runs, neither I3 nor I12 (Amendment 3 item 12):

```text
S5d-post-check-route-confirmed        FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's touch lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":8,"mintRefused":["1792435620099 tile-stream-mint-refused 7:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792435620084 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

- **The new suite** passed every step:

```text
OPEN          PASS    admitted; .working-canvas node stored for the identity checks
E-CTRLK       PASS    Ctrl+K focused the bar; /lay, Tab, Enter flipped Layers' hidden; one layout.toggleLayers row; the map node is unchanged
E-SEARCH      PASS    the plain text inspector listed its option on top of the map below the top bar, and ArrowDown then Enter flipped the Inspector; a label-only, upper-case text found Zoom to layer
E-HELP        PASS    ? listed all 11 registry entries, every word and every chord label
E-BARFOCUS    PASS    focus alone opened no list; Tab and Shift+Tab left the bar in one press; Escape closed the list, then returned the focus to the map region
E-REVEAL      PASS    /export opened the Inspector and its Layer tab, expanded Export and focused .publish-open; no approval prompt appeared
E-SLASH       PASS    / pressed from the map focused the bar with / in it; / typed in the Filter section's input stayed there
FIXTURES      PASS    filter-zoned.parquet sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 -> 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
```

- **The six e2e mutations** each failed by their named step and message. E-BARFOCUS also failed E-CTRLK on its Tab completion, as the worker predicted. Under E-REVEAL's mutation the native picker stood, so E-REVEAL timed out (one of its two named outcomes) and the later E-SLASH step in that run failed behind it.
- **Unknown attempts:** none in any run.

## The mutation runs' failing lines

### E-CTRLK, applied alone, reverted, the checkout clean at 7e4ea32a

```text
E-CTRLK       FAIL    E-CTRLK: 0 layout.toggleLayers rows were recorded, expected exactly 1
```

### E-SEARCH, applied alone, reverted, the checkout clean at 7e4ea32a

```text
E-SEARCH      FAIL    E-SEARCH: the text to lay lists 0 options ([]), expected the one entry Zoom to layer
```

### E-HELP, applied alone, reverted, the checkout clean at 7e4ea32a

```text
E-HELP        FAIL    E-HELP: ? lists 4 options, expected 11
```

### E-BARFOCUS, applied alone, reverted, the checkout clean at 7e4ea32a

```text
E-CTRLK       FAIL    E-CTRLK: /lay then Tab left "/lay" in the bar, expected "/layers"
E-BARFOCUS    FAIL    E-BARFOCUS: Tab with no list open left the bar's input holding the focus
```

### E-REVEAL, applied alone, reverted, the checkout clean at 7e4ea32a

```text
E-REVEAL      FAIL    E-REVEAL: timed out after 60000ms
E-SLASH       FAIL    E-SLASH: / pressed from the map left the bar focused holding "", expected it focused holding "/"
```

### E-SLASH, applied alone, reverted, the checkout clean at 7e4ea32a

```text
E-SLASH       FAIL    E-SLASH: the focus left the Filter section's input when / was typed in it
```
