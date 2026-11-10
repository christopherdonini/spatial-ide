Reviewed: PR #292 at db6f7c43b796089a751872161abac9ad64022b98 (base fa7d1179), gate 1, architect
Verdict: FAIL

`cut/e2e-readme-security-posture-measure-build @ db6f7c43b796089a751872161abac9ad64022b98`. I have no shell, so I could not compute the sha256 of the brief or the packet, and I left no background shell. I read the packet whole first, then Part 1 items 1 to 9 of the gate-rounds directive, the form whole with Amendment 1, the worker report, the OPEN-4 tester report, the three Scope files at the head in C:/dev/wt/erm, and the code each clause rests on. Unless marked otherwise, all text below is my own wording. Quoted spans are copied from the file I cite.

## Findings by class

### Correctness (blocking, both for the human)

**K1 (for the human). C14 at the head is partly untrue.** README:9 says `check:dist-clean` "greps the built dist/ for a fixed list of hook and port identifiers".
- **Evidence.** The script greps `dist/` only (frontends/shell/e2e/checkDistClean.mjs:44 @ db6f7c43…). Its lists are `INSTRUMENT_IDENTIFIERS` (:55-125), `EXPECTED_PRESENT_CALLER_CHECKED_IDENTIFIERS` (:159) and `EXPECTED_PRESENT_CALL_SITE_IDENTIFIERS` (:194-202), and its loops are at :234-278. None of these lists holds a port identifier: no `remote-debugging-port`, no `9223`, no CDP token.
- The "hook" part holds only in part. Three of the forbidden identifiers are E2eTestSurface keys: `e2eSetViewStateCallCount` (:68), `setResidencyArm` (:87) and `setResidencyTileSizeLevel` (:122). The rest are instrument function names.
- The other clauses of this sentence hold: see C14b to C14d in the table.
- **Requirement broken.** Form §2.1 says a clause untrue at the head is a Correctness finding addressed to the human. This also meets §8 item 2, and Part 1 item 1 applies.
- **Same phrase elsewhere.** It is repeated in OPEN-6's comment at frontends/shell/src/e2e-test-surface.ts:11 @ db6f7c43…, so the same untruth sits in red-line comment text.
- **Closure.** The human's typed answer: either the human's own replacement words for this span, or acceptance as it stands with the gap recorded on the form as a class 5 amendment. The comment then follows the paragraph, as Amendment 1 rules ("take the paragraph's words at the click"). I give no gate words, because this is the human's wording and red-line text.

**K2 (for the human). OPEN-6's lib.mjs header carries C9 cut off before the qualifier the human added.**
- frontends/shell/e2e/lib.mjs:13 @ db6f7c43… ends the C9 span at "in when `VITE_MEASURE_BUILD` is set". It drops "App.tsx's among them; the registrations gated on `import.meta.env.DEV` alone, in WorkingCanvas.tsx and PublishPanel.tsx, are out of it."
- Read on its own, the sentence says the measure build keeps the in-page hooks, without qualification. That is the reading the human replaced because it was untrue.
- **Evidence.** WorkingCanvas.tsx:2204 and :2320 and PublishPanel.tsx:571 @ db6f7c43… return on `!import.meta.env.DEV`. So `capturePixels`, `e2eSetViewState`, `e2eSetViewStateCallCount`, `publishPrepare`, `publishPrepareWithDestination` and `publishExecute` are not registered in the measure build.
- The pointer on line 14, "(the paragraph … has the whole posture)", does not restore the qualifier to the sentence.
- **Requirement broken.** The brief's check 2: a false OPEN-6 clause goes to the human. Form §A also applies.
- **Closure.** The human's choice at the click. One option, which needs no gate words: the comment carries the human's whole C9 span from README:9.

### Evidence

None. The OPEN-4 run is filed (one pair of runs, at aa370b31), and Amendment 1 records its effect on C1 and C17.

### Documentation (must-fix before the merge; not blocking)

**D1. A sibling this piece creates: stale line cites into lib.mjs.**
- The lib.mjs header grows from 5 lines (base :8-12) to 7 lines (head :8-14). Every later line moves down by 2, so `waitForCdpUp` moves from :57-64 to :59-66 and `findAppPage` from :74-87 to :76-89. I checked this against main's copy of lib.mjs; the packet says main is unchanged since the base.
- Two places cite the old numbers, and both are now off by 2:
  - frontends/shell/e2e/README.md:596 @ db6f7c43…, "`lib.mjs:57-64`/`:74-87`". This is inside the base paragraph :598-611, which is one of §7's places.
  - frontends/shell/e2e/residency-harness.mjs:2411-2412 @ db6f7c43…. This file is outside §7, and §5 declares it unchanged.
- Neither cite is rooted, so verify-cites cannot catch them.
- **Closure, either of two:**
  - (a) Keep the header at the base's 5 lines. Nothing before :89 then moves, so both cites stay true, and no file outside Scope is touched.
  - (b) Replace the README span with these words (mine, not the human's; the cite text is the worker's, so they apply with no re-gate): "`lib.mjs`'s `waitForCdpUp` and `findAppPage`". Clause check: `waitForCdpUp` is lib.mjs:59-66 and `findAppPage` is :76-89 @ db6f7c43…. The residency-harness pair is then recorded as a follow-up, because editing it here would be a scope addition.

### Notes (not acceptance conditions)

- **N1, C11.** "references no port" is true only for the debugging port. The plain build binds the data-plane port (docs/09_Security_and_Privacy.md:32 @ db6f7c43…) and names devUrl's 5180 (tauri.conf.json:8). The form's §2.4 disclosed this at b5b5f97a. It is the human's wording; a note for the human.
- **N2, C9's "out of it".** This rests on Vite 6.4.3, external: the installed copy in the main checkout, at the version package-lock.json:3895-3896 @ db6f7c43… pins.
  - In that copy, `vite build` defaults NODE_ENV to "production" (dep-Dm0c1Wj2.js:46146-46150, :48878-48882), and `DEV: !isProduction` (:49070, :49175).
  - `.env.measure` sets no NODE_ENV.
  - The one case this does not cover is a NODE_ENV=development in the shell that runs `build:measure`. That needs a dev-only environment setting, so it does not block; name it in the source comment.
- **N3, C1's "never".** This is my hypothesis, unverified: WebView2 may also take extra browser arguments from a policy setting in the registry. The tester checked only the environment variable. This is for the human, and it ties to the form's note 5.
- **N4, B11.** The restore in layout.mjs:312-320 @ db6f7c43… swallows its own failure (`.catch(() => {})`), so "put back afterwards" is best-effort. It can fail only if the page fails, which ordinary use does not reach. No change needed.

## Check 1. The clause table at the head (README:9 @ db6f7c43…)

All code cites below are `@ db6f7c43…`.

| # | Clause (my labels) | Code it rests on | At the head |
|---|---|---|---|
| C1 | the shipped build never opens the port | Cargo.toml:51-52 (no `default`); lib.rs:511 (`#[cfg(feature = "measure-build")]`); tauri.conf.json (no `additionalBrowserArgs`); tauri-build.yml:68 (`npm run tauri build`, no `--features`), called by release-artifacts.yml:100; OPEN-4 report (one pair of runs, no flag on any command line) | holds (N3) |
| C2 | carries no e2e hook | e2e-test-surface.ts:348 (`if (!isInstrumentedBuild()) return;`); isInstrumentedBuild.ts:32 | holds by reading |
| C3 | two builds do; neither is shipped | lib.mjs:171 and :195 (`tauri dev`); package.json:48 (`--no-bundle`) | holds |
| C4 | `attachOrLaunch` writes `e2e/out/tauri.e2e.conf.json`, gitignored | lib.mjs:113, :171; .gitignore:1 | holds |
| C5 | sets `additionalBrowserArgs` to wry's defaults plus the flag | lib.mjs:43-44, :108; OPEN-4 run A: the browser process with no config key carried exactly these tokens | holds; the source read is the reviewer's (OPEN-5) |
| C6 | `tauri dev --config <path>`, regenerated per launch | lib.mjs:171, :195, :114 | holds |
| C7 | `build:measure`, a release build with the feature | package.json:48 | holds |
| C8 | lib.rs opens the port with a checked-in default | lib.rs:511-529, `"9223"` at :518 | holds |
| C9 (human, new) | keeps the hooks in when `VITE_MEASURE_BUILD` is set, App.tsx's among them; the DEV-only registrations in WorkingCanvas and PublishPanel are out | isInstrumentedBuild.ts:32; .env.measure:10; writeMeasureConfigOverlay.mjs:49; App.tsx:1246, :1669, :1831; AdmissionPanel.tsx:325; WorkingCanvas.tsx:2204, :2320; PublishPanel.tsx:571; Vite (N2) | holds |
| C10 | no default feature | Cargo.toml:51-52 | holds |
| C11 | references no port | tauri.conf.json; lib.rs:511 | holds for the debugging port (N1) |
| C12 | compiles the hooks out | the C2 and C9 guards | holds by reading |
| C13 | run in CI after `npm run build` | package.json:17-18 (`verify` chains `build && check:dist-clean`); product-ci-shell.yml:210-212 | holds |
| C14a (human, new) | greps the built dist/ for a fixed list of hook and port identifiers | checkDistClean.mjs:44, :55-125, :159, :194-202 | **UNTRUE on "port", partly true on "hook" (K1)** |
| C14b | a hit fails the job | checkDistClean.mjs:280-311 (`exitCode = 1`); product-ci-shell.yml:212 | holds |
| C14c | a miss is a check, not a proof | checkDistClean.mjs:22-37 | holds |
| C14d | the release artifact's job runs no dist check | tauri-build.yml:56-68 (no `check:dist-clean`); release-artifacts.yml:100 | holds |
| C15 | the variable is not used | the string appears only in lib.mjs comments and README.md (search outside governance/ and state/) | holds |
| C16 | wry always sets `additionalBrowserArgs` itself | wry 0.55.1, external (Cargo.lock:6114-6117); OPEN-4 run A corroborates | the reviewer's (OPEN-5) |
| C17 | WebView2 ignores the variable, verified live | OPEN-4 report (one pair at aa370b31); Amendment 1 | holds on the filed run |
| C18 | root cause in `wry-0.55.1/src/webview2/mod.rs` | Cargo.lock:6115 | version holds; content is the reviewer's |
| C19 (human, new) | setting `additionalBrowserArgs` replaces wry's defaults | spikes/adr-003-crs-rendering/README.md:221; lib.rs:519-521 repeats the defaults | holds |
| C20 | so the overlay repeats them verbatim | lib.mjs:44 against OPEN-4 run A's browser flags | holds; the source read is the reviewer's |

**Byte-equality.** I compared README:9 by reading, span by span, against the 2026-11-05 directive line 25 with Amendment 1's three spans (2026-11-06 directive lines 15, 16 and 17). I found no difference. This is not a hash: the proof is the reviewer's script and the worker's printed a9a7d8c3…. The heading reads `## Security posture` (README:7).

## Check 2. Red lines and whose words

- **The paragraph and the heading.** These are the human's words. I give no gate words. K1 goes to the human.
- **OPEN-6's four comments.** Each clause, checked against the code at the head:
  - **lib.mjs:8-14.** "nothing here turns the port on by default" holds (:171 is the only overlay write). "a packaged `tauri build` never sees this file" holds; this wording was already there at the base. "opens the port in one other build" holds (lib.rs:511-529). The C9 cut-off is K2.
  - **lib.mjs:91-98.** "the only generated file that holds the debug-port flag" holds among config files: writeMeasureConfigOverlay.mjs:46-52 writes no flag, and the flag is otherwise only in lib.rs:521. "the measure build carries the flag in checked-in Rust" holds.
  - **lib.mjs:145-152.** "Spawning is the only path that ever generates the config overlay" holds: the only `writeConfigOverlay(` call is at :171. "the other build … is the measure build" holds.
  - **e2e-test-surface.ts:11-13.** The C14 phrase falls under K1. "a measure build … keeps the same branches" holds (isInstrumentedBuild.ts:32). The worker also removed the base's false claim, "production build succeeding is what proves this".
- **B11 (README:738).** This is agents' words (packet item 3). Every point in §2.2 holds: layout.mjs:273-311 and :312-320 (N4), and :552 for the run order. No replacement words are needed.
- **B12 (README:552, :593-594).** This is the worker's wording. The `app_log_dir()` call (lib.rs:326) and `SessionLog::open` (lib.rs:328) both sit inside `.setup(` (:277). The measure block (:511-529) comes after them in the same closure (`Ok(())` at :536). Both cites hold, and so does the ordering claim.

## Check 3. Block-on-sight (§8) at the head

1. Byte-equality: no difference by reading. The hash is the reviewer's to show.
2. **Met, by K1.**
3. No edit of the human's words that I could see.
4. The changed places I read fall within §7's places: README :9, :552, :593-594 and :738; lib.mjs :8-14, :91-98 and :145-152; e2e-test-surface.ts :11-13. Showing that nothing else changed needs the diff, which is the reviewer's to run (I have no shell). The packet's numstat is 47 changed lines against a ceiling of 70, and the README's 24 against 40.
5. Not met: B11 covers every point.
6. Not met: the B12 cites land, and the ordering holds.
7. Not met: no rooted path:line was added to the README.

## Check 4. Constitution

- No conflict with docs/01, docs/09 or any accepted ADR. The comment at isInstrumentedBuild.ts:18-21 cites ADR-020's paired gates, and nothing in this diff touches them. docs/09 has no debugging-port rule, so dropping "(docs/09, binding)" from the heading conflicts with nothing.
- No posture sentence outside the paragraph and OPEN-6's four comments changed. The `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` paragraph reads the same at main lib.mjs:14-23 and head :16-25. The docs/09 comment at e2e-test-surface.ts:23-25 is unchanged.

## For the human

- K1: C14's "port identifiers".
- K2: lib.mjs:13's C9 cut-off.
- N1: C11's "no port".
- N3: C1's "never" and the WebView2 registry policy (my hypothesis, unverified).

## The packet's gaps (Part 2, section C)

- The diff's hunks themselves. The packet gives a locator, and I have no shell, so I rebuilt the base text of lib.mjs and e2e-test-surface.ts from main's copies on the packet's statement that main is unchanged since the base.
- Line cites in other files that point into the changed files (README:596 and residency-harness.mjs:2411-2412). Without them, D1 is found only by search.
- Where Vite's DEV rule can be read for C9: the installed copy and its version.
- That the OPEN-4 report's browser-process flags bear on C5, C16 and C20, not only on C17.
- CI status is given as a locator to be read with `gh`, which I cannot run. I did not need it for these checks.
