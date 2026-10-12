# PR #210 gate 2 — reviewer
Reviewed: cut/skp-v0-live-sections-current-area-c @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7

**Verdict: FAIL, on one Correctness finding (C1). There are no Evidence findings. Two Documentation findings (D1, D2) must be fixed before the merge.**

B is 1457fbd0a09464c03082a2aea3df65dd1171bc95. Under proportional gates (`state/directives/2026-10-05-product-first-direction.md:15 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`), only C and E findings fail a gate. The form's §9 says that an unsupported claim in a rewritten sentence is Correctness, and §5 says the piece is falsified if any rewritten sentence is shown untrue.

## Correctness

**C1. The new `describe` accessor sentence is still untrue at the head.**
- The sentence is at `protocol/skp/SKP-V0.md:58-61 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:ec9a58a36e2ef7e6a74c511f736c88a2893a0bac43e956e7c745acc23ba6e0db`. It reads "Every field maps to an existing `engine::Dataset` accessor, except `coverage` and `session_end`".
- Naming the exceptions makes the sentence an exhaustive claim. At least one more top-level member has no accessor behind it: `extent`.
  - `describe_dataset` fills `extent` with a constant. Its own comment says "no `Dataset::bounds()` accessor exists on the engine" (`kernel/src/skp.rs:1977-1982 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:396c7d680e10d3c0c55229d517899c5c1b2d50b85ee168376e4ddc1f5351134e`). The same bytes are at lines 1980-1985 at the head.
  - The spec's own §2 C1 says the same: "no `bounds()` accessor exists on `engine::Dataset`" (`protocol/skp/SKP-V0.md:145-149 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:9a4caac7009965b9b9a189ae80d9ac3343ec6d62c9a45e615ee058f049b25515`). Those bytes are at lines 152-156 at the head.
  - The new sentence therefore contradicts §2 of the same document.
- Fixed literals also fill some sub-members if the sentence is read field by field: `crs.axis_normalization` (`kernel/src/skp.rs:1897 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:9e4c4215472f0b9f1d33ceaf50479a00a2e952c0600b5c7b85177dc4c1cf0116`), and `geometry.coordinate_layout` and `frame` (`kernel/src/skp.rs:1934-1935 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:9f7afe71f5c6fc9a172b34655c634e80c6107feb8133226ba822526f66019f04`).
- I checked the two named exceptions and the rest of the members:
  - `coverage` does come from `self.watches` and `session_end` from `self.generations.ended_reason`, at `kernel/src/skp.rs` 1309-1364 at the head.
  - `checks` comes through the accessor `Dataset::descriptor()`, so it is correctly not an exception.
  - Every other top-level member reads an accessor: `path`, `crs`, `identity`, `file_schema`, `covering`, `source_license` and `admission`.
- **Fix, inside Amendment 3 item 1 and with no budget pressure** (`SKP-V0.md` is at 70 of 130):
  - Name `extent` as an exception, pointing to §2 C1. Alternatively, reword the sentence so it does not claim every field.
  - Make the matching edit to the §8 note's §1 clause, "its accessor sentence excepts `coverage` and `session_end`". The note is not merged yet, so it can still be edited.
  - Update the PR body's "now excepting `coverage` and `session_end`".

The other two sibling lines hold:
- **`commands.rs` doc.** It now says "passed to the engine's open as received" (`protocol/skp/src/v0/commands.rs:22-23 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:59875afb515b92f7afa01312c0fae96e04f2340bfeacb8cd4d823895f32bd757`). The path is never altered on its way to the engine's open:
  - the host passes `&req.path` unchanged to `Catalog::open_cancellable` (`kernel/src/skp.rs:1173-1177 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:8d462b3675a380dc820c2632ed21dff5cda6aabca04092458adfc9500b582e06`);
  - `Catalog::open_cancellable` hands `path` to `Dataset::open_cancellable` (`kernel/src/lib.rs:218-224 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:b8ad75741fb31b0c6dc91cf09af8173dc36bc765781b33fc6121c87509e88eb6`);
  - that calls `open_inner`, whose refusal order holds (`engine/src/dataset.rs:325-332 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:0d5bee5cda3aaef39a65987ec17c917456563f7501b27c20d92c99da64c8f5a0`);
  - the only `canonicalize` in `engine/src` and `kernel/src` is on the watcher's own copy, in `engine/src/watch.rs`;
  - the line no longer claims a host-side check.
- **`codec.rs` "rejected"** (`protocol/skp/src/v0/codec.rs:13 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:fce79c5043f43344746afaffe2a0ab53961b08c5573e2578265242546afeefe9`). Both deserializers turn a parse failure into `serde::de::Error::custom`:
  - `HexF64` at `protocol/skp/src/v0/codec.rs:69-77 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:b446ed8095d31e9c68b8a967bfe465113f66c8532d634f3a5105648759cfd2e0`;
  - `DecU64` at `protocol/skp/src/v0/codec.rs:112-119 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:7085906bdca3bf9822d8362327dfa406da4b2bf4eb7cb0229930526cf2518ca6`.
  - Neither one maps the failure to an SKP code, so "rejected" is exact and makes no claim of a refusal.

## Evidence

None. E1, E5, E7, E8 and E9 hold at the head by my own runs (Checks 4, 5 and 7), and CI is green (Check 8).

## Documentation (each must be fixed before the merge)

- **D1. Amendment 3's superseded index is incomplete.**
  - Amendment 1 item 6 puts E7's `commands.rs` limit at "lines 199-200 only". At the head the file also has a hunk at line 22 (`@@ -22 +22 @@`).
  - Amendment 3 item 1 authorizes that line in substance, but its superseded index names only "§2.1 to §2.4's row lists", not Amendment 1 item 6.
  - Fix: record the supersession, by reference only (record cap).
- **D2. The PR body's Evidence section is stale after the round.**
  - "E1: 37 changed `.rs` and `.ts` lines" is now 41 (Check 4).
  - "The `commands.rs` diff is the one comment hunk" is now two hunks, at 22 and 199-200.

## Checks

1. **The round's diff.**
   - Commands: `git diff --numstat a8b45622 20d8546e` (rc 0) and `git diff a8b45622 20d8546e`, every hunk read.
   - Five files changed: `kernel/README.md` 1/1, `SKP-V0.md` 8/7, `codec.rs` 1/1, `commands.rs` 1/1 and `handles.rs` 2/2.
   - Each hunk falls under Amendment 3 item 1 or item 2:
     - item 1: the `commands.rs` line 22 doc, the `describe` accessor sentence, and the `codec.rs` line 13 doc;
     - item 2: the S12 bullets, the §9.1 note's position, the `handles.rs` rewrap, and the index line.
   - Nothing changed outside those items.
2. **The three sibling lines.** One line fails (C1); the other two hold, with the reads given under Correctness.
   - Read for C1: `describe_dataset`, `kernel/src/skp.rs` 1866-2016 at the head, and `SkpHost::describe`, 1301-1367.
   - Commands: `grep -n "pub fn bounds\|pub fn extent" engine/src/dataset.rs` (rc 1, absent), and `grep -n "pub fn descriptor…" engine/src/dataset.rs` (rc 0).
3. **The gate 1 Documentation findings: all closed.** C1 is a new defect in item 1's own rewrite.
   - **Architect D-1:** the note now reads "outside §5 … in §4 item 8 and §7.5". The headings script places the two cites at head line 271, inside §4 (206-333), and at 487, inside §7.5 (484-517).
   - **Architect D-2:** the note cites the directive by path and item 4. Item 4 of that directive is the ruling on the unproduced codes (read at the head, and `git ls-files --error-unmatch` rc 0).
   - **Architect D-3 and my D2:** in §9.1 the 2026-10-11 note now follows the `skp/0.7` note and is the last text before `### 9.2` (`protocol/skp/SKP-V0.md:1123-1136 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:e94436001cde9fa4928695a293be0f61796f8a57466e326658e7b8d518a7563b`).
   - **Architect D-4 and my D6:** the index line is applied. lead-data read the three pointers at a8b45622.
     - Lines 354, 356, 357 and 363 are identical at a8b45622 and 20d8546e (`diff` rc 0 for each).
     - The round touched nothing under `kernel/src` or `kernel/tests` (`git diff --stat` empty).
     - The check therefore carries to the head.
   - **My D1:** the quoted span "stability across reopen" now sits whole on one line, `protocol/skp/src/v0/handles.rs:15 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:f65680a46c08d3de7693d0441566fae9205c042f2a061e0ee525334aaf1ec5a3`. At B it was at `protocol/skp/src/v0/handles.rs:12 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:58e5a1f81a5b07b4909ac07a89fab9626f1d2fea3dd683397d9e0d4d85305e84`.
     - `grep -n -o '"stability across reopen"'` matches once at each rev (rc 0 both), with the same bytes.
     - `grep -c 'stability across'` gives 1 at each rev, so no split remnant is left.
   - **My D3:** (a) and (c) are closed. (b) was rewritten but is still untrue (C1).
   - **My D4:** every B→head `SKP-V0.md` hunk (`git diff -U0`) is recorded by section in the note: the §1 lead and the `describe` currency and accessor sentences are added, and so is §3's lead. The fixture wording now reads "the nine `HexF64` fixtures that carry one" (`protocol/skp/SKP-V0.md:1109-1113 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:966cb26da3528d211d0ac943db8be508dc96db9b325f7234cde107d1105cd24a`). The note matches S12 (i).
   - **My D5:** `gh pr view 210` (rc 0) now reads 110 of 116, with the six explained. The body's other stale items are D2.
   - **Index line:** a script took the second ```text fence of lead-data's update and compared it with `cmp` against head line 382: rc 0.
     - The first fence against B line 382: rc 0.
     - Self-test, head line 382 against the old fence: rc 1.
     - Pin: `kernel/README.md:382 @ 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7 sha256:554c46c57307752d17995302433e17ec0a18756c9a29cbf59599e372df9eb2a4`.
4. **E1, from B to the head.**
   - `git diff -U0 1457fbd0 20d8546e -- '*.rs' '*.ts' '*.tsx'` (rc 0) shows 41 changed lines.
   - I filtered out every comment line with `grep -vE '^[+-][[:space:]]*(//|/\*\*|\*/|\*( |$))'`, which counts `/** */` continuation lines as comments: 0 lines remain (rc 1).
   - The self-test on a code line hit (rc 0).
   - The `*`-led lines are the `types.ts` hunk at 291-293, inside the `/** … */` block that opens at 290 (read in context).
5. **E8 and E5.**
   - E8: §8 is the text from `## 8.` up to `## 9.`. At B it is 543 lines and 39506 bytes; at the head, 553 lines and 41917 bytes. A `head -c 39506` of the head's §8 against B's §8 gives `cmp` rc 0. The only bytes after the prefix are the S12 note.
   - E5: `cargo fmt --all -- --check` rc 0.
   - Also run:
     - E7's `git diff --quiet B H -- protocol/skp/tests protocol/skp/src/v0/mod.rs protocol/data-plane frontends/shell/src/skp/__tests__` rc 0;
     - `types.ts` line 15 `diff` rc 0;
     - `docs/adr KNOWN-LIMITATIONS.md engine` unchanged, rc 0;
     - E9: outside §8 each reserved code occurs once, all on line 346. The self-test `skp.version_unsupported` gave 2.
6. **Budget.** `git diff --numstat origin/main...origin/cut/skp-v0-live-sections-current-area-c` rc 0; the merge-base is B, and the result equals B...H.

   | File | Lines | Ceiling |
   |---|---|---|
   | `SKP-V0.md` | 70 (51/19) | 130 |
   | `error.rs` | 3 (3/0, insertions only) | 9 |
   | `handles.rs` | 10 | 24 |
   | `kernel/src/skp.rs` | 9 | 6 + 10 = 16 |
   | `types.ts` | 5 | 8 |
   | `kernel/README.md` | 2 | 2 |
   | `codec.rs` | 8 | 8 |
   | `commands.rs` | 6 | 6 (Amendment 1 item 5) |

   - Total: 113 lines in 8 files, against 206 lines and 10 files. No overrun.
   - Three files sit at their ceiling: `codec.rs`, `commands.rs` and `kernel/README.md`. A C1 fix in `SKP-V0.md` has room.
7. **Governance at the head.** The tool commit is c813c6ab74ce4c8e32eb63a6357930a4715880a3 (`git log -1 -- scripts/plan`).
   - `node scripts/plan/verify-cites.mjs` rc 0: PASS, 1751 files, 49 loose advisories, none in this diff.
   - `node scripts/plan/verify-quotes.mjs` rc 0: PASS.
   - `node scripts/plan/verify-test-claims.mjs` rc 0: PASS.
   - `node scripts/plan/verify.mjs` rc 0: PASS.
8. **CI.**
   - `gh pr checks 210` first gave rc 8, with the two windows-latest `cargo test --workspace` jobs pending. Both runs (38158784470, 38158788313) have headSha 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7.
   - I watched with `gh pr checks 210 --watch --interval 60` (rc 0).
   - A re-run of `gh pr checks 210` gave rc 0, 18 of 18 pass, with the PR's headRefOid at 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7.
9. **Low profile.** `git log --format='%H%n%B' a8b45622..20d8546e` (rc 0).
   - The commits are 56b74f55 and 20d8546e. Neither carries an outside reference or an @mention.
   - The only link is the `Claude-Session` trailer. Each commit carries Co-Authored-By, Claude-Session and Signed-off-by trailers only.

Final `git status --porcelain` in `C:/dev/wt/skpe`: empty (rc 0). HEAD is 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7. No commits, pushes or tracked-file edits were made.
