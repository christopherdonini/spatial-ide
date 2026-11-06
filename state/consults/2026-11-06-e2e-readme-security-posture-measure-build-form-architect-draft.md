*Custodian's filing note (2026-11-06): the architect's full-form draft for the docs lane's `e2e-readme-security-posture-measure-build` (the human's ruling of 2026-11-05, evening, items 2 and 4, `state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`), drafted ahead while the KL pair is in its gate, read only at main b5b5f97a. Its brief by file (sha256 5bcdde5bb2e256a24ab38389da8e53551169dacd20f15ec6458949a68f2cf687), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's output byte for byte. The run 09:42:25Z to 09:52:23Z by its transcript (claude-opus-5-5; unique calls Read 41, Grep 45, Glob 4 and the hand-back, 91, equal to the notification's). Extracted by script from its one SubagentHandback call, one final newline added. Its sha256, from line 5 to the end, is 70b77dea5929615e9d1c9a2c22179c748c5425f07deef468849f2ae65d71e252. OPEN-2, OPEN-3 and OPEN-6 are red lines and go to the human; the form is committed from this draft with the custodian's settlement. A draft, not Authority.*

---

Draft: e2e-readme-security-posture-measure-build, full form, architect (read at main @ b5b5f97ad58282d141494674fe469e43072ec026)

I read the main checkout's working tree. The session's starting snapshot named its HEAD as b5b5f97a, with no tracked change. I have no shell, so I could not confirm HEAD, and I can give no sha256. Every `@ b5b5f97a…` cite below is meant as `@ b5b5f97ad58282d141494674fe469e43072ec026`, for the custodian to expand by script with its hash, as was done for the KL form. I leave no background shell.

---

# frontends/shell/e2e/README.md: the security-posture paragraph in the human's words, B11's E-FLOOR entry and B12's lib.rs cites. Full form (`docs/PREREGISTRATION-TEMPLATE.md`)

## Header

- **Path:** `governance/forms/frontends/E2E-README-SECURITY-POSTURE-MEASURE-BUILD-PREREGISTRATION.md`. PLAN node `e2e-readme-security-posture-measure-build` (governance/PLAN.yaml:6719-6735 @ b5b5f97ad58282d141494674fe469e43072ec026).
- **Drafted by** the architect from the custodian's brief, read only, at main b5b5f97ad58282d141494674fe469e43072ec026.
- **Committed** by the custodian on main before any change.
- **Append-only** once committed. An amendment made after any outcome has been seen says so in its first line.
- **Authority:**
  - The node.
  - The human's ruling of 2026-11-05 (evening), `state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`: item 2, its docs-lane line (4 of 7), and item 4 (the paragraph's words).
  - Part 1, items 1 to 9, of `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`, by reference.
  - Non-red-line OPEN items take the drafting agent's recommendation: `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4, held while the human is away until 2026-11-09.
  - Readings, not Authority: `state/consults/2026-11-05-drift-sweep-areas-a-b-triage-architect.md` (B6, B11, B12) and `state/consults/2026-11-03-platform-drift-sweep-area-b.md` (findings 6, 11, 12).
- **Reuse index:** `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed the following (both exit 1); two misses, noted, and nothing is implemented:
  - for `e2e readme security posture`: `No prior art recorded for "e2e readme security posture". Research it before planning an implementation.`
  - for `remote debugging port measure build`: `No prior art recorded for "remote debugging port measure build". Research it before planning an implementation.`
- **Depends on** the KL pair (PR #287). No change starts before that pair is done.

## §0. Disclosure

- **Inputs.** The triage's B6, B11 and B12, and the sweep's findings 6, 11 and 12. Every code cite below is a read of the main checkout at b5b5f97a.
- **Corroboration only, not evidence of record.** Untracked build outputs exist in the main checkout: `frontends/shell/dist/` and `frontends/shell/dist-measure/`, of unknown commit.
  - The plain `dist/` has no `openPath`, `capturePixels` or `SPATIAL_E2E` string.
  - The `dist-measure/` bundle registers `openPath` and `crsCatalog` and has no `capturePixels`.
  - Both agree with C9's and C12's readings below, but they prove nothing about the head.
- **A record that decides nothing on C17.** `state/consults/2026-10-12-shell-crs-form-for-format-default-contradicted-e2e-custodian-run.md:17 @ b5b5f97ad58282d141494674fe469e43072ec026` and `:21` describe a run that set the CDP arguments both through a config overlay's `additionalBrowserArgs` and through `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`. So it cannot show which of the two carried them.
- **Hypothesis, mine, unverified, with its discriminator.** I recall, and can cite no source here, that WebView2's documentation and common Tauri test practice treat `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` as added to a host's own arguments, not ignored. If so, C17 is untrue. The discriminator is the live check in §6 (OPEN-4).

## §1. What this form may and may not claim

- It changes one documentation file, at three places (§2), plus the node's PLAN record, which the custodian keeps on main.
- It does not change: code, tests, any string the app shows, any ADR, `protocol/`, `docs/09`, or the section heading at README:7.
- It makes no performance claim and no claim about macOS or Linux.
- The paragraph's words are the human's and red-line text (security posture). The gates check them; they never edit them.
- Part 1, item 2's WORDS-ONLY pass does not apply: it "never covers my wording or red-line texts".

## §2. The change

### 2.1 The paragraph (B6)

- **What is replaced.** The paragraph under `## Security posture (docs/09, binding)`: frontends/shell/e2e/README.md:9-19 @ b5b5f97ad58282d141494674fe469e43072ec026, 11 lines from the line after the heading's blank line to the blank line before `## Running it` (README:21).
- **What replaces it.** One line, byte for byte the human's words from the directive's item 4: line 25 of that file, from the character after its first `"` to the character before its final `"`. It is not rewrapped, because wrapping would change bytes. The heading and both blank lines stay.
- **How the worker copies it (sketch, mine).** A Node script, run at the base:
  - Read the directive with `git show <base>:<path>`, take line 25, and assert that it starts with `4. e2e/README.md`, ends with `"` and holds no `\r`.
  - Take `words = line.slice(line.indexOf('"') + 1, -1)`. The words contain inner double quotes, so the end is the line's last character.
  - Read the README with `git show <base>:frontends/shell/e2e/README.md`, assert LF only, and locate the heading line by exact equality. Assert a blank line after it, and take the paragraph up to the next blank line. Assert 11 lines; on any other count, STOP and report.
  - Replace those lines with the single line `words`, and write the file with LF.
  - The script carries none of the human's words as a literal.
- **How the gate shows byte-equality.** The reviewer re-runs the extraction at the PR's base and checks, at the head:
  - the heading line;
  - one blank line, then a line equal to `words`, then a blank line;
  - `sha256(words + "\n")` equals the sha256 of that README line with its LF (both printed);
  - `git diff origin/main...HEAD -- frontends/shell/e2e/README.md` shows no other change in that section.
- **Clause by clause.** The gates check each clause at the head (Part 1, item 1), as in the §2.4 table.
- **A clause untrue at the head:**
  - It is a Correctness finding, because it is an unsupported claim of a guarantee, addressed to the human.
  - The words are never edited without the human. The piece holds until the human's typed answer: the human's replacement words, or acceptance as it stands with the gap recorded on this form.
  - No gate supplies replacement words as a pass (red-line text).

### 2.2 B11: E-FLOOR in the Layout spec

- **Where.** The Asserted list of the Layout spec entry, README:747 @ b5b5f97ad58282d141494674fe469e43072ec026, between `E-FIT`'s parenthetical and `E-REOPEN`'s. That matches the run order: e2e/layout.mjs:551-554 @ b5b5f97ad58282d141494674fe469e43072ec026.
- **It must cover** (e2e/layout.mjs:268-311 @ b5b5f97ad58282d141494674fe469e43072ec026, :98-104):
  - E-FLOOR is asserted.
  - It runs at a 1024 x 640 viewport with Activity open and both the attention strip and the status bar filled past their caps, by probe rows the step itself adds. The product has no path that fills them.
  - The map region stays visible, keeps the same connected canvas node, and is at least 480 x 320.
  - The step fails if the viewport cannot be set to that size or the inner size differs.
  - The probe rows are removed afterwards.
- Every other byte of line 747 is unchanged.

### 2.3 B12: the stale lib.rs cites in the residency section

- **Where.** README:561 (`lib.rs:96-98`) and README:602-603 (`lib.rs:100`, `lib.rs:148-172`) @ b5b5f97ad58282d141494674fe469e43072ec026.
- **The code now:**
  - `app_log_dir()`: frontends/shell/src-tauri/src/lib.rs:324-327 @ b5b5f97ad58282d141494674fe469e43072ec026.
  - `SessionLog::open`: lib.rs:328.
  - The measure build's window build that opens the port: lib.rs:511-529.
- **The cite form** is set by OPEN-7. The worker rewraps only within the paragraphs README:556-571 and :598-611.
- **It must keep the sentence's claim true.** The session log opens before the measure route's window build, inside the same `setup()`.

### 2.4 Clause table at main (my reading; the gates redo it at the head)

Clause labels are my paraphrase. They are not the human's words.

| # | Clause (paraphrase) | Code @ b5b5f97a… | At main |
|---|---|---|---|
| C1 | the shipped build never opens the port | frontends/shell/src-tauri/Cargo.toml:51-52; lib.rs:511; tauri.conf.json:8-10; .github/workflows/tauri-build.yml:66-68 (no `--features`) | holds by reading; see C17 |
| C2 | and carries no e2e hook | e2e-test-surface.ts:343-350; the guards in C9 | holds by reading |
| C3 | two builds do, by design; neither is shipped | lib.mjs:191; package.json:48 (`--no-bundle`) | holds |
| C4 | `attachOrLaunch` writes the overlay at `e2e/out/tauri.e2e.conf.json`, gitignored | lib.mjs:96-113, :167; frontends/shell/.gitignore:1 | holds |
| C5 | it sets `additionalBrowserArgs` to wry's defaults plus the port flag | lib.mjs:41-42, :103-106 | flag: holds; "wry's defaults": see C16/C20 |
| C6 | runs `tauri dev --config`, regenerated per launch | lib.mjs:167, :191, :111 | holds (written only when it launches) |
| C7 | `build:measure` is a release build with the feature | package.json:48 | holds (`tauri build`, release by default; Tauri CLI behaviour, outside the repo) |
| C8 | lib.rs opens the port with a checked-in default | lib.rs:517-525 (`"9223"` at :518) | holds |
| C9 | `isInstrumentedBuild.ts` keeps the hooks (registered in AdmissionPanel and WorkingCanvas) in when `VITE_MEASURE_BUILD` is set | isInstrumentedBuild.ts:32; .env.measure:10; package.json:47; writeMeasureConfigOverlay.mjs:49; AdmissionPanel.tsx:325-342; WorkingCanvas.tsx:2204, :2298, :2320, :2351-2352; App.tsx:1246-1335, :1669-1670, :1831-1832; PublishPanel.tsx:571-578 | **PARTLY UNTRUE**: WorkingCanvas's registrations are gated on `import.meta.env.DEV` alone, so they are out of the measure build; App.tsx's 18 registration calls (17 hooks) are kept and not named; PublishPanel's are DEV-only (OPEN-2) |
| C10 | the plain build has no default feature | Cargo.toml:51-52 | holds |
| C11 | references no port | lib.rs:511; tauri.conf.json (no `additionalBrowserArgs`) | holds for the debugging port; the plain build does name the dev-server port (tauri.conf.json:8) and bind a data-plane port, so "no port" is read in context |
| C12 | and compiles the hooks out | the C9 guards; e2e-test-surface.ts:347 | holds by reading; only partly checked (C14) |
| C13 | `check:dist-clean` runs in CI after `npm run build` | package.json:17; product-ci-shell.yml:210-212 | holds, for the CI job's own build; the release artifact's job (tauri-build.yml:66-68) runs no dist check |
| C14 | it is what proves it, not the build succeeding | checkDistClean.mjs:22-37, :44, :55-125, :280-311; product-ci-shell.yml:226-230 | **UNTRUE as a claim of proof**: it greps `dist/` only, for a fixed list (no `__SPATIAL_E2E__`, `openPath`, `capturePixels`, `publish*`, `queryWithFilter` or `remote-debugging-port`); its header says a miss is "ONE-DIRECTIONAL, never a proof"; it reads no Cargo feature and no Rust. "Not the build succeeding" holds (OPEN-3) |
| C15 | the variable is not used | repository search at main: only comments, the README and records | holds |
| C16 | wry always sets `additionalBrowserArgs` itself | wry 0.55.1 (Cargo.lock:6114-6117), outside the repo | not decidable by me (OPEN-5) |
| C17 | so WebView2 ignores the variable, verified live | lib.mjs:14-19 (a statement, not a filed run) | not decidable by reading; no filed run record found; a hypothesis against it (§0) (OPEN-4) |
| C18 | the root cause is in `wry-0.55.1/src/webview2/mod.rs` | Cargo.lock:6115 (`0.55.1`) | the version holds; the content is C16's |
| C19 | setting it replaces wry's defaults rather than appending | spikes/adr-003-crs-rendering/README.md:221 | holds if "it" is `additionalBrowserArgs` (the antecedent is ambiguous; note 3) |
| C20 | so the overlay repeats them verbatim | lib.mjs:41-42 against wry 0.55.1's defaults; spike :221 lists only `--disable-features=…` | rests on C16's source |

## §3. Fixtures

None. No run is made by the worker. The OPEN-4 (B) run is the tester's, before dispatch.

## §4. Tests, and the mutation per new test

None added or changed (documents only), so there is no mutation. The gates' checks are §2.1's byte-equality, §2.4's clause table at the head, and §2.2's and §2.3's coverage.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Declared unchanged:**
  - every byte of `frontends/shell/e2e/README.md` outside README:9-19, the Asserted list at :747, and the paragraphs :556-571 and :598-611;
  - the heading at :7;
  - every file other than README.md (and PLAN.yaml on main).
- **Invalidators** (each one stops the piece):
  - I1: the README line is not byte-equal to the extracted words.
  - I2: a clause the human has not ruled on is found untrue at the head.
  - I3: a change outside Scope.
  - I4: the paragraph is not 11 lines at the base.
- **Falsification.** C17's live check (OPEN-4) shows the variable reaching `msedgewebview2.exe`. Then C1 and C17 go to the human before any merge.

## §6. Instruments

All are assertions, and none is a measurement:
- the byte-equality check;
- the clause table;
- `git diff --numstat`;
- if OPEN-4 (B), the tester's live check, run before the gate in a shared hold. The run:
  - uses a plain release exe of the base, with no config overlay;
  - sets `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333`;
  - waits, bounded at 60 s, then records whether `http://127.0.0.1:9333/json/version` answers, and the `CommandLine` of every `msedgewebview2.exe` the exe started;
  - repeats once without the variable, as a control;
  - stops only the processes it started, with every wait under a hard timeout;
  - files a report that the gate reads.

## §7. Declared values and ceilings

- At most 40 changed lines (insertions plus deletions) in `frontends/shell/e2e/README.md`, counted by `git diff --numstat origin/main...HEAD -- frontends/shell/e2e/README.md`. This form is excluded.
- The branch changes 1 file.
- If OPEN-6 is answered (A) before this form is committed:
  - also `frontends/shell/e2e/lib.mjs` (:8-12, :89-95, :142-148) and `frontends/shell/src/e2e-test-surface.ts` (:4-12), at most 30 more lines;
  - 3 files in all.
- An overrun is class 8, and this line is not edited.
- No constant is declared or changed.

## §8. Block-on-sight

1. The paragraph line is not byte-equal to directive item 4's words (§2.1).
2. A clause untrue at the head, unless the human has ruled on it (OPEN-2, OPEN-3, OPEN-4's outcome).
3. Any edit of the human's words other than the human's own.
4. A diff outside §7's places.
5. B11 misses one of §2.2's points.
6. A B12 cite does not land on the code it names at the head, or the sentence's ordering claim no longer holds.
7. A rooted `path:line` written into the README. It would gate `verify-cites` on every later drift.

## §9. Gates

- **Architect and reviewer**, both, full gating (§21a), on one packet (Part 1, item 5), at one reviewed commit. Dispatch follows the full suite passing at that head (Part 1, item 4; §D's commands).
- **Reviewer:** runs the byte-equality script, the clause table at the head, the wry source read (OPEN-5), and §D.
- **Architect:** checks the clause table against the code and the red-line handling.
- **Operator:** none.

## §10. Amendments

*(Opens empty; append-only. Classes 1 to 9.)*

---

## §A. Whose words

- **The paragraph** is the human's typed wording and red-line text (security posture).
- **B11** (an e2e suite step) is not red-line. The worker writes its words from the code. They are DRAFT for the human's sight (Part 1, item 1), and the gate's replacement words, if any, apply with no re-gate (AUTONOMY §31). The worker first runs `git log -L 747,747:frontends/shell/e2e/README.md` at the base: if the entry's span is the human's typed words, it goes to the human at the click.
- **B12** is cites only, not red-line, and is the worker's.
- **OPEN-6's comments**, if they are taken in, state the posture, so I read them as red-line: the human's at the click.

## §B. Line estimate (mine)

- The paragraph: 11 deletions and 1 insertion, so 12.
- B11: 2.
- B12: 6 to 14 with rewrap.
- In all, about 20 to 28, against the declared 40.

## §C. The gates

- **Blocks only on Correctness or Evidence.** C9 and C14, as they stand, are Correctness: unsupported claims of a guarantee in red-line text. They wait on the human's answer to OPEN-2 and OPEN-3, and are never worded around.
- **Documentation findings on B11 and B12** are fixed before the merge, with no re-gate.
- **The human's answer** is recorded as a class 5 amendment before the merge.

## §D. Verification (the worker at the head; both gates re-run)

- `node scripts/plan/verify-cites.mjs`
- `node scripts/plan/verify-quotes.mjs`
- `node scripts/plan/verify-test-claims.mjs`
- `node scripts/plan/verify.mjs --offline`
- `node scripts/plan/docsOnly.mjs origin/main HEAD`
- the scripts' `node --test` suite, as CI runs it
- `git diff --numstat origin/main...HEAD -- frontends/shell/e2e/README.md`
- §2.1's byte-equality script, both sha256 printed

Under Part 1, item 4, these are this piece's suite. If OPEN-6 is (A), add `npm run test:citation-integrity` in `frontends/shell`.

The PR body carries:
- the clause table at the head;
- the byte-equality output;
- the `git log -L` class of line 747;
- OPEN-5's wry pins;
- OPEN-4's run report or its "not run".

## §E. Rule (00)

The rule is AUTONOMY.md:609 @ b5b5f97ad58282d141494674fe469e43072ec026. The README's separate entries count as separate paths: `state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md`, item 3.

| This piece's place in README.md | U12 (#285) | U1 | 8d (#286) | KL pair (#287) | port-2 | 1c |
|---|---|---|---|---|---|---|
| Security posture (:7-19) | none (its hunk -217,2 is in Publish spec, :179-245) | none | none | none | none | none |
| Residency measurement harness (:466-740; :561, :602-603) | none | none | none | none | none | none |
| Layout spec (:741-751; :747) | none | none | none | none | none | none |

- **No code path is shared.** If OPEN-6 is (A), `lib.mjs` and `e2e-test-surface.ts` are in no branch's list.
- **If U12 merges first,** the line numbers shift. The worker locates each place by content, and every pin here stays historical.
- **Whichever merges later** merges main in before its last gate run.
- **No owner's index needs a line.** Nothing indexes `governance/forms/frontends/` or the README's sections.

## §F. OPEN items

**OPEN-1: the route** (not a red line)
- (A) This full form and both gates. **Recommended.** The paragraph is security posture, which is §21a (AUTONOMY.md:321-322), and §25 (e) closes the five-line form from dispatch (AUTONOMY.md:482).
- (B) A five-line form with one reviewer. Not available: the Out-of-scope line would have to name security.

**OPEN-2: C9, the measure build's hooks** (**red line**: the human's words)
- (A) The human types replacement words. My draft for the human's sight follows, and it is not the human's wording: "and `isInstrumentedBuild.ts` keeps in, when `VITE_MEASURE_BUILD` is set, the in-page hooks (`src/e2e-test-surface.ts`) registered in `App.tsx` and `AdmissionPanel.tsx`; those registered in `WorkingCanvas.tsx` and `PublishPanel.tsx` are gated on `import.meta.env.DEV` alone and stay out of it." **Recommended.** The clause check:
  - "keeps in, when set": isInstrumentedBuild.ts:32, .env.measure:10, package.json:47, writeMeasureConfigOverlay.mjs:49.
  - "registered in App.tsx and AdmissionPanel.tsx": App.tsx:1246, :1669, :1831 guard all 18 calls; AdmissionPanel.tsx:325.
  - "WorkingCanvas and PublishPanel, DEV alone": WorkingCanvas.tsx:2204, :2320; PublishPanel.tsx:571.
  - "stay out of it": `import.meta.env.DEV` is false under `vite build --mode measure`. That is stated at .env.measure:7, and Vite derives it from NODE_ENV (Vite's behaviour, outside the repo). The gate confirms it from Vite's installed source, read only.
- (B) A code change gating WorkingCanvas's and PublishPanel's registrations on `isInstrumentedBuild()`, so that the words become true. This widens what a CDP-exposed build carries, and needs its own fully gated piece. Not recommended.
- (C) Accepted as it stands, with the gap recorded on this form.

**OPEN-3: C14, what proves the plain build clean** (**red line**)
- (A) The human types replacement words. My draft follows, and it is not the human's wording: "The plain build has no default feature, references no debugging port and compiles the hooks out. `check:dist-clean`, run in CI after `npm run build`, checks part of that: it fails if any identifier on its list survives in that build's `dist/`, and a pass is evidence, not proof. No check reads the Rust side; it rests on `Cargo.toml` declaring no default feature and on `lib.rs` opening the port only under `#[cfg(feature = "measure-build")]`." **Recommended.** The clause check:
  - Cargo.toml:51-52;
  - lib.rs:511;
  - package.json:17 and product-ci-shell.yml:212;
  - checkDistClean.mjs:44, :55-125, :234-242;
  - checkDistClean.mjs:22-37;
  - "no check reads the Rust side": nothing under `scripts/` or `.github/` greps for the port, and the CI's two cargo steps only check that it compiles (product-ci-shell.yml:226-230).
- (B) Widen `check:dist-clean` to `__SPATIAL_E2E__`, every hook name and `remote-debugging-port`, as a separate code node. It still says nothing about Cargo features.
- (C) Accepted as it stands.

**OPEN-4: C17, the live clause** (the method is not a red line; an adverse result goes to the human)
- (A) The gate records "not re-run; rests on lib.mjs:14-19; no filed run record".
- (B) The tester's live check in §6, before dispatch. **Recommended**, given §0's hypothesis. It needs a plain release exe of the base, a shared hold, and roughly 25 minutes of build; that exceeds the node's 30-minute budget once the rest is counted, so it is the custodian's call.

**OPEN-5: C16 and C20, the wry source** (not a red line)
- (A) The reviewer reads `wry-0.55.1/src/webview2/mod.rs` in the cargo registry's source copy, read only. It checks that the cached crate's sha256 equals Cargo.lock:6117's checksum, and records the lines it relies on (the default arguments, and the unconditional `set_additional_browser_arguments` call) with their sha256, marked external. If no registry copy exists, it records "not checked" and C16 and C20 go to the human. **Recommended.**
- (B) docs.rs's source view of 0.55.1, recorded by URL.

**OPEN-6: siblings that state the old posture** (**red line**)
- Where:
  - lib.mjs:8-12 says nothing in the app turns the port on by default (untrue for the measure build);
  - lib.mjs:91 says the overlay is "the only place the debug-port flag ever exists on disk";
  - lib.mjs:146-147 says "nothing else ever turns the debug port on";
  - e2e-test-surface.ts:10-11 says the production build succeeding proves the hooks are out.
- (A) Taken into this piece at §7's conditional places, with words written after code and the human's at the click. **Recommended**: one red-line round for the human instead of two, and Part 1, item 4 would otherwise return a disclosed sibling.
- (B) A separate node, named here.

**OPEN-7: B12's cite form** (not a red line)
- (A) Anchor by symbol, with no line numbers: `lib.rs`'s `setup()`, `app_log_dir()`, `SessionLog::open`, and the `#[cfg(feature = "measure-build")]` block. **Recommended**: the lines drift, and these are unpinned.
- (B) New bare line numbers at the base.

**OPEN-8: dispatch timing** (not a red line)
- (A) No worker until the human has answered OPEN-2, -3 and -6 (back 2026-11-09). **Recommended**: the paragraph cannot pass with C9 and C14 as they stand.
- (B) Dispatch now and let the gate report them.

---

## Notes (mine)

1. **Route.** Even at about 25 lines in 1 file, §21c's size bounds are met, but the category forces the full form (AUTONOMY.md:317-332, :482).
2. **The heading `(docs/09, binding)`.** docs/09 has no rule on a debugging port or on e2e hooks: docs/09_Security_and_Privacy.md:3-5 and :30-43 @ b5b5f97ad58282d141494674fe469e43072ec026. The heading is outside the human's words and is not edited. This is a finding for the human.
3. **C19's "it" is ambiguous.** Read as the environment variable, it contradicts C17. The human may want to name `additionalBrowserArgs`; that is the human's words, so it is a note, not a change.
4. **A triage count error.** B6 says `registerE2eHook(` appears 37 times in App.tsx and 6 times in PublishPanel. Those counts include `unregisterE2eHook(` calls. The registrations are 18 calls (17 hooks) in App.tsx and 3 in PublishPanel.
5. **A wider posture point**, beyond this piece and for docs/09's owners. If OPEN-4 shows the variable reaching WebView2, any installed copy opens a CDP port when that variable is set in the user's environment.

## Could not settle

- HEAD itself, and any sha256 (no shell).
- C16, C17, C18's content and C20 (outside the repository, or live).
- Vite's DEV-under-`--mode measure` rule, from Vite's source.
- Line 747's `git log -L` class.
- Whether the untracked `dist/` and `dist-measure/` outputs match any commit.
