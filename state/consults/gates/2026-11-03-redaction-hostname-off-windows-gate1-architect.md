Reviewed: PR #278 at fa4d009562185de498f5ed5b23979e0ecf7f05ba (base b1d8d02c), gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/redaction-hostname-off-windows @ fa4d009562185de498f5ed5b23979e0ecf7f05ba

I have no shell. I computed no sha256, ran no git, read no CI log and leave no background shell. I read the files at the head in `C:/dev/wt/rhow`, and B's files as main's, since the custodian checked that no product file changed on main past B. These checks need git or CI, so they are the reviewer's: that 06f54ec0 carries M2 alone, that 52e65e28 restores the bytes, the numstat, the six commits with no rewrite, and the CI logs. Where I rely on the worker report for one of them, I say so.

## Findings

**Correctness: none.** **Evidence: none that blocks.** Five Documentation findings follow. Each must be fixed before the merge, with no re-gate. None of the five touches the human's wording.

**D1. Amendment 2 has the wrong class.** It is recorded as class 8. Class 8 is the full form's budget overrun against §7 (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions, class 8), and that same text says "Class 6 stays the short form's budget class". This piece is on a five-line form, so its class is 6 (template class 6, "Budget deviation, Scope not edited"). Class 6 also requires the reason, and Amendment 2 gives none: "did not trim" is not a reason. The 198 figure, the counting rule and the route all hold (check 2). The worker report's line 59 called it class 8, and Amendment 2 followed it.
- **Fix:** an appended correction, the custodian's own wording, three sentences:
  > Amendment 2's class is 6 (budget deviation, Scope not edited), the short form's budget class; class 8 is the full form's (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions). Its reason, which Amendment 2 does not state: T2's child-process design (N6) takes 122 of the 198 lines. As class 6 has it, the short form stays and the architect gate is the one taken, here from dispatch.
- **Clause check:**
  - (1) Class 6's text reads "short form only … a five-line piece exceeded its declared `Scope` line budget", and class 8 reads "a full-form piece exceeded a line budget … its §7 declares". Both hold.
  - (2) The new test file is 122 lines at the head, all of them added. That is Amendment 2's own numstat row.
  - (3) Class 6's last sentence reads "the single-gate route closes … and the architect gate is taken; the short form stays". The architect gate runs from dispatch (this gate). The words restate no earlier amendment's claim.

**D2. The Change line overstates what Route A leaves alone on Windows.** The form's Change line says "Windows' source and every caller are unchanged".
- "Every caller" is true: `log.rs`, `publish/mod.rs` and `normalize.rs` are not in the diff.
- "Windows' source" is not literally true under Route A. The shared code that Windows compiles changed, at `kernel/src/bundle/redaction.rs:136` and `:148-178`. When neither `COMPUTERNAME` nor `HOSTNAME` gives 3 or more bytes, Windows reaches `os_hostname`. N4 discloses this edge.
- Judged at what an operator can observe: a normal Windows session always sets `COMPUTERNAME`, so ordinary use never reaches the edge, and if it did the scan would only get stricter. That is why this is not a Correctness finding.
- **Fix:** the closing amendment reads the Change line's Windows clause through my boundary ruling below, by reference to this report.

**D3. Amendment 1 cites the wrong part of the direction.** Amendment 1 says it was taken under the 2026-10-31 direction's item 4. Item 4 covers OPEN items that take the drafting agent's recommendation. How M2 is observed is not an OPEN item and had no recommendation. The part that fits is the direction's closing paragraph, the one after item 6 (paraphrased: where a question has no recommendation and no red line, take the cheapest reversible option and record it the same way).
- **Fix:** one appended sentence, the custodian's own wording:
  > Amendment 1's authority is the 2026-10-31 direction's closing paragraph (paraphrased: a question with no recommendation and no red line takes the cheapest reversible option, recorded the same way), not its item 4, which covers OPEN items; the human's review on return is unchanged.
- **Clause check:**
  - Item 4 reads "An OPEN item that is not a red line takes the drafting agent's recommendation".
  - The closing paragraph reads "Where a question has no recommendation and no red line, take the cheapest reversible option and record it the same way."
  - A temporary commit followed by a revert commit is reversible.

**D4. The viewer workflow's run at the head is not in the record.**
- N7 declares `scan-dist.test.mjs` unchanged, and N2 makes the viewer's standalone compile the cross-module consumer.
- The worker could not run that test, because the worktree has no `dist/` (worker report line 56). It substituted the driver's own compile (`rustc --edition 2021 -A warnings scripts/scan-dist.rs`, exit 0). That compile is the property itself: the file is still std-only, since the new code uses only `std::fs` and `std::env`.
- The worker report also says "by CI" without naming a run. `product-ci-viewer.yml:64` and `:73` include `kernel/src/bundle/redaction.rs` in the path filter, so that workflow ran on the push.
- **Fix:** the closing amendment names that run at fa4d0095 and its result, in these words, the blanks filled by the custodian:
  > The viewer workflow (`.github/workflows/product-ci-viewer.yml`) ran at fa4d0095 as run <id>, <result>; its `npm run verify` compiles `kernel/src/bundle/redaction.rs` on its own through `scripts/scan-dist.mjs` (N2, N7).
- If that run is red, N7's invalidator applies and the piece stops. That would be an Evidence failure.

**D5. The closing amendment's pins must follow round 25 (d) and round 15 (e).** This is a forward note. If the closing amendment pins the two RECORDED MUTATION lines (`redaction.rs:675`, `redaction_hostname_off_windows.rs:88`), it names them in words at fa4d0095 until the merge, with no hash at a branch commit. The hash pins follow on main after a merge commit that keeps them reachable.

## Ruling on the boundary (R2, for the closing amendment by reference)

I add one named boundary to R2's table: **machine identity, `os_hostname` in `kernel/src/bundle/redaction.rs`**, reached only through `MachineIdentifiers::from_environment` → `hostnames_from` (`redaction.rs:136`, `:148-178`).

- **Windows: supported, unchanged.** The hostname comes from `COMPUTERNAME` (or `HOSTNAME`). The fallback runs only when neither gives 3 or more bytes, which ordinary use does not reach. It then tries `\proc\sys\kernel\hostname` on the current drive, as N4 discloses. Normally that file is absent. A file planted there only adds a needle, so the scan gets stricter and never weaker (R1 holds).
- **Linux: supported.** `/proc/sys/kernel/hostname`, trimmed, under the 3-byte floor, is read only when the environment names none. Named limits:
  - where `/proc` is not mounted, the scan keeps the environment's names alone, which `from_environment`'s doc (`:123-126`) already states is a gap and not a pass;
  - an exported `HOSTNAME` that differs from the kernel's name is used alone (N3).
- **macOS: explicitly reduced.** There is no such file, so the hostname is scanned only when `HOSTNAME` is exported. Nothing shows the user. This is recorded in the form under OPEN-1 (A), the human's ruling of 2026-10-30, and revisited with a macOS piece. No KNOWN-LIMITATIONS item is owed: no macOS or Linux product ships, and KL 1 carries each platform's level.
- **Tests:** T1 runs on every platform (`redaction.rs:677`). T2 runs on Linux (`redaction_hostname_off_windows.rs:94`) and is ignored elsewhere with a reason that names this boundary (`:90-93`), which satisfies R6. CI prints the ignored list (`product-ci-rust.yml:240`).
- **R4 against Route A:** Route A adds no OS-conditional code. The read is an OS mechanism in shared code, made deliberate and visible by this table entry, which is the cure R2 offers. It assumes nothing about Windows; it states each platform's behaviour; and no platform goes green by broad exclusion.
- **Scope of the ruling:** it names a boundary. It does not add `redaction.rs` to `scripts/plan/cfg-boundary.mjs`'s allowlist, which stays untouched. A later `#[cfg]` in `os_hostname` (Route B) would need its own architect-reviewed allowlist change under this boundary's name.
- **The Change line:** its Windows clause (D2) is read as this ruling states Windows.

## Checks

**1. The constitution and the platform rule**
- **R1:** redaction gets stricter on Linux, Windows is unchanged in ordinary use, and macOS is graded as reduced and stated. Nothing weakens silently.
- **R2 and R4:** see the ruling. **R3:** N5 covers the boundary, the three platform grades and the tests per platform. **R6:** `redaction_hostname_off_windows.rs:92`.
- **ADR-017 §13:** the gate is unchanged. `first_undeclared_findings`, `walk` and `scan` match B. Only the identifiers going in widen, and `publish/mod.rs:946-952` is untouched.
- **The PERMISSION-BOUNDARY property** (`kernel/PERMISSION-BOUNDARY.md:293-296`, read in the current tree, which matches the pin's wording): `machine-identifier` is now recorded on Linux.
- **The old redaction form:** its P ≤ 25 bound (`governance/forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:114`) holds, because the OS name is taken only when `hostnames.is_empty()` (`redaction.rs:163`), so there are at most two hostnames. Its Linux grade (`:187`) moves to supported. Its macOS grade stays.
- **The rest of the constitution:**
  - docs/02 and docs/10: no SKP, data-plane or MCP surface.
  - ADR-006: no operation changes class.
  - docs/08: one small procfs read per `from_environment` call, called twice per audit append, and only when the environment names no hostname. That is no budget risk.
  - The seam rule: the new functions are private, and their one product caller is `from_environment`. T2 is written against the real `AuditLog::open_for`, `append_intent`, `path` and `IntentRecord` (`kernel/src/permission/audit/log.rs:121`, `:163`, `:167`; `record.rs:115`) and the real `classify` (`log.rs:244-279`). No `pub` item is added.

**2. The five lines and the size**
- **Scope:** three files, matching the diff.
- **Change:** `hostnames_from` is byte-equivalent to B's loop for the environment (B's `redaction.rs:135-141`) and falls back only when that loop finds nothing. Holds, with D2's reading.
- **Tests+mutation:**
  - T1's three assertions match N6.
  - M1's predicted failure (left ["envhost","oshost"], right ["envhost"]) is what dropping the guard yields at the second assertion.
  - M2 is recorded at 06f54ec0 on the Linux L1 job with its run and job ids, and reverted by 52e65e28 (`redaction_hostname_off_windows.rs:88`). That is the shape Amendment 1 words.
- **Out-of-scope:**
  - ADR: none. §13 is unchanged.
  - Security: none. The human ruled the widening not a red line: nothing loosens and no ADR text changes.
  - Wire: none.
  - Guarantee: touched. §36 sets §25 (e) aside for a filler, and both gates run from dispatch.
  - No dependency, no `unsafe`, no user-visible string.
- **Size:** 198 against 145, counted by §21c's rule (the worker report and Amendment 2; the reviewer recounts). The route holds under class 6's last sentence. The class does not hold (D1). §36's size condition is an entry condition, met at dispatch with 145 declared, and nothing in §36 moves a filler out of its slot mid-piece.

**3. The boundary:** ruled above.

**4. The claim**
- **Linux:** a `machine-identifier` finding reaches `residual_classes`, proven by T2 through the real log, with M2 observed. It reaches the publish gate by the same constructor (`publish/mod.rs:951`), with no separate publish-route test. The seam rule asks for one end-to-end test from the real shape, and T2 is it.
- **Windows:** unchanged where `COMPUTERNAME` gives 3 or more bytes.
- **At most two hostnames (N3):** holds.
- **Strings and std:** no new string, std only (N2; D4 for the run).
- **macOS:** claimed only as explicitly reduced. No KNOWN-LIMITATIONS item is owed. KL 47 (`KNOWN-LIMITATIONS.md:413-420`) is now true on the Linux CLI, which is OPEN-2 (A).
- **Named, not a finding:** a short generic Linux hostname of 3 or more bytes widens false refusals. That is the existing 3-byte floor's declared trade, now reached on Linux, and it is for the macOS/Linux product pieces.

**5. The records and the docs**
- **The settlement:** it cites the ruling by path and line, and line 19 says what the settlement says.
- **Amendment 1:** the shape is as worded; D3 for its authority. **Amendment 2:** D1.
- **The RECORDED MUTATION lines:** each names its commit (M1 f7be3a30, M2 06f54ec0). M1's text matches the worker report's line 36. M2's quoted stderr matches the byte-copied log at the worker report's line 46. That line carries the CI runner's ephemeral VM name; I do not reproduce it here, and it is not a defect.
- **No history rewritten:** I rely on the worker report and the custodian's transcript note (a revert commit; no reset, rebase, amend or force). The reviewer confirms it by git.
- **The doc comments:** the docs of `from_environment` (`:123-126`), `hostnames_from` (`:148-150`), `os_hostname` (`:174-175`), T1 (`:671-673`), T2's module doc and function doc (`redaction_hostname_off_windows.rs:4-11`, `:86`) and T2's ignore reason (`:92`) are each true against the code, read with the ruling for Windows.
- **`kernel/README.md`:** `:387` gains the form's governance path, which exists at b1d8d02c. `:360`'s added clause is accurate.
- **A pre-existing issue, not this gate's finding:** the other rows at `:387` still carry their pre-move `kernel/...` paths, and no `kernel/*PREREGISTRATION.md` exists on main. The worker disclosed this. Fixing it is outside this form's two declared README edits and belongs to a docs-lane re-path.

Files read: `C:/dev/wt/rhow/kernel/src/bundle/redaction.rs`, `C:/dev/wt/rhow/kernel/tests/redaction_hostname_off_windows.rs`, `C:/dev/wt/rhow/kernel/README.md`, `C:/dev/spatial-ide/governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/2026-11-03-redaction-hostname-off-windows-worker-report.md`.
