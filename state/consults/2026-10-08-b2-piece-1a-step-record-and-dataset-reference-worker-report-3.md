*Custodian's filing note (2026-10-08): `b2-piece-1a-step-record-and-dataset-reference`'s gate-1 fix worker report (correction round 1 of 2), at the branch head 14acee0b (worker-high run 06:49:09Z to 07:24:33Z by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 73adb8c085b131008b66e9e44fe684a0ac62a1b11c911a77979c9f5ee1763759. The custodian checked the fixes against Amendment 5 and the reviewer's D1 and D2 by the diff afdaca37..14acee0b (3 files, 106 lines added and 26 removed). Paths and lines below are at the branch head, not main.*

---

All of Amendment 5's items 1, 3, 4, 5, 6 and 7, plus the reviewer's D1 and D2, are done, committed and pushed. The workspace tests (922 passed, 0 failed), clippy, fmt, the ADR index check and the six verifiers all exit 0. No force and no rebase was used; the worktree is clean. `frontends/shell/src-tauri/Cargo.lock` is untouched, and so is `Cargo.lock`. Head 14acee0b equals origin's head.

**Commits** (each signed off, with the two trailer lines; pushed after each as a plain update):
- 713e862c "docs: ADR-036 under the form's Amendment 5 - canonical form, the carrying rule, containment and the named state's free-text basis (piece 1a)"
- 507838e2 "fix: canonical form named as such, a named state's basis read as free text, and the stale docs corrected (piece 1a, form Amendment 5 items 3, 4, 6, 7; reviewer D1, D2)"
- 14acee0b "test: the recorded mutations of R7, K1's added seam and R8, observed at 507838e2 (piece 1a, form Amendment 5 item 7)"

**ADR equality:** PASS at 14acee0b. My script takes §2.3 between its markers and applies Amendments 1, 2 and 5. The text blocks come from the fenced blocks of the form itself. Every anchor is checked to occur exactly once.
- Before the Amendment 5 edits, the script's result for §2.3 plus Amendments 1 and 2 was byte-equal to the file at HEAD, 14,091 bytes.
- After the edits, the file is byte-equal to the script's result for Amendments 1, 2 and 5, 16,354 bytes.
- The diff against the previous file shows only the Amendment 5 hunks: the `project-relative` bullet, the carrying rule, the containment block, the `observed` paragraph and the named-states paragraph.
- `node scripts/adrIndex.mjs --check` in `frontends/shell` passes (34 ADRs), so `docs/README.md` is unchanged and unedited.

**The code** (`kernel/src/dataset_ref.rs`), per the items:
- **Rename:** `stays_inside_the_project_folder` is now `in_canonical_form`, with the same refusals and the same `Malformed` variant at `at`. Its doc says it checks canonical form on the string alone and that containment is piece 1c's resolver's. The error detail now reads "a project-relative locator is in canonical form".
- **`Locator::ProjectRelative` doc (D2):** the stale "neither built nor interpreted here" sentence is gone. It now says the locator is checked here for canonical form only, and that the resolver checks containment.
- **`expect_state`:** it keeps the closed key set and the closed word. It accepts a basis only if it is a string within `MAX_REF_STRING_BYTES` and not blank, reusing the existing `claim` helper. A blank basis is `Malformed` at `<path>.basis`; an over-long one is `OverCeiling`. The fixed-text comparison is removed. The basis constants are `NOT_TAKEN`, `NONE_PINNED`, `NOT_REPORTED` and `NOT_READ_OVER_CEILING`. `to_json` and `parse_observed` are unchanged, and the comment above the constants and `expect_state`'s doc now say the word is closed and the basis is the text this writer writes.
- **Module header:** D1 is fixed ("absolute path" replaces "path of any kind"), and the header gains one bullet saying the reader accepts any bounded, non-blank basis and keeps none, and that `to_json` writes this writer's own basis texts.
- No `pub` item and no error variant was added.

**The tests:**
- R7 is renamed `a_project_relative_locator_outside_canonical_form_is_refused`, with its nine cases unchanged.
- K1 (`kernel/tests/dataset_ref.rs`) now replaces `resource.source_revision` with the bundle's own `source.source_revision` from the real `publish_unguarded` manifest. It asserts the two basis texts differ, that the entry parses, and that the parsed entry writes back to the reference's own text.
- R8 is new: `a_named_states_basis_is_free_text_and_its_word_is_closed`. It runs over all four named-state paths and checks another non-blank basis, a blank basis, an over-long basis and another word.

**Mutations:**

| Test | Mutation | Failing assertion | Observed at | Reverted |
|---|---|---|---|---|
| R7 | `in_canonical_form` returns `Ok` at once | first case `../x.parquet`: `unwrap_err()` on an `Ok` value, at `dataset_ref.rs:785` | 507838e2 | yes |
| K1, added | `expect_state` compares against the fixed text again, as at a3f9f34f | `the bundle's own state parses: Malformed { path: "$.resource.source_revision.basis", detail: "the basis text is fixed in version 1" }`, at `tests/dataset_ref.rs:211` | 507838e2 | yes |
| R8 | blank check removed (`claim` becomes `bounded`) | blank case of the first named state: `unwrap_err()` on an `Ok` value, at `dataset_ref.rs:845` | 507838e2 | yes |

Each mutation was applied by hand and its test run alone by name at 507838e2. After each run I reverted with `git checkout` and `git status` showed clean. The recorded-mutation comments are in 14acee0b, a later commit than the one they name. R7's old note (observed at 1e637d55) is replaced by a note naming `in_canonical_form`. No `verify-mutation` run was used.

**Checks** (`CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8` set on every cargo call; hold means the shared hold with the exact shape):

| Check | Exit | Held |
|---|---|---|
| New-test targets: `cargo test --workspace --locked --features spatial-engine/fixture --lib --test dataset_ref -- dataset_ref` (9 lib tests including R7 and R8, plus K5) | 0 | yes |
| New-test targets: K1 by name via `--test dataset_ref` | 0 | no (small build) |
| Full `cargo test --workspace --locked --features spatial-engine/fixture`, first run | 101 | yes |
| Full `cargo test --workspace --locked --features spatial-engine/fixture`, rerun after cleaning the five members | 0 | yes |
| `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture` | 0 | yes |
| `cargo fmt --all -- --check` | 0 | no |
| `node scripts/adrIndex.mjs --check` | 0 | no |
| `verify.mjs --offline`, `queue.mjs --check`, `site.mjs --check`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` | each 0 | no (light) |

- **Rerun result:** 922 passed, 0 failed, 54 ignored, over 101 result lines. R7, R8 and K1 are among the passes.
- **Clippy:** 73 warnings, all in files this fix does not touch, none on an added line. None is in `kernel/src/dataset_ref.rs`, `kernel/tests/dataset_ref.rs` or `engine/src/descriptor.rs`.
- **Verifiers:** `verify.mjs` ran with `--offline`, so the PR-merged and release-published checks were skipped.

**§7, three-dot, at 14acee0b.** The command is `git diff --numstat origin/main...HEAD` with the form's pathspecs. The merge base is db7c88d0 and the local `origin/main` is badac676, not fetched.

| Group | Lines | Ceiling | Result |
|---|---|---|---|
| Engine product | 154 | 180 | within |
| Engine tests | 238 | 240 | within |
| Kernel product | 876 | 760 | over by 116 |
| Kernel tests | 541 | 520 | over by 21 |
| ADR | 184 | 280 | within |
| Indexes | 17 | 30 | within |
| Total | 2,010 over 10 files | 2,010 | at the ceiling, not over |

- Kernel product is `dataset_ref.rs` 872, `lib.rs` 1 and `kernel/Cargo.toml` 3. Kernel tests are `dataset_ref.rs` 424 and `no_generation_in_persisted_artifacts.rs` 117.
- Against Amendment 4's count at 479ae81d (1,930), the fix adds 80 lines. Kernel product grew by 54, kernel tests by 16 and the ADR by 10.

**Deviations:**
- **Class 8, for the closing record:** the two kernel groups above are over their ceilings. The total sits exactly at 2,010. I did not edit §7.
- **Environment, no class:** the first full workspace run failed with exit 101, in 3 tests of `protocol/data-plane/tests/no_transport_leakage.rs`. The test binary in the warm shared target had `C:\dev\wt\1a-rev` baked into `CARGO_MANIFEST_DIR`, a directory that no longer exists. This is the stale-artifact case in memory. I ran `cargo clean -p` for the five workspace members (`spatial-engine`, `spatial-data-plane`, `spatial-skp`, `spatial-renderer`, `spatial-kernel`) in `D:/wt-targets/1a`, which removed 14 GiB, then reran the suite; it was green. The mutation runs happened before that clean. Their failures are kernel assertions, so they are unaffected.
- **Interpretation, no class:** the brief said "four new-test targets" without naming them. I ran R7, R8 and K1 (lib and integration targets), plus K5 and the module's other unit tests that the name filter caught.
- **Not held:** the three mutation runs and the K1 baseline run were small kernel-only builds of about 30 s, so I treated them as free under the machine paragraph.
- **Class 3, test text:** R7's old recorded-mutation note was replaced rather than left beside the new one.
- **Detail wording:** the blank-basis refusal reuses `claim`, so its detail text reads "an empty claim is not recorded". The variant and path are as the item says.

**Noticed, not done:**
- The "Last verified at" lines in `engine/README.md` and `kernel/README.md` still say 1251fc3c. Code changed after it. No pointer is stale (the old names occur nowhere outside the form), but the lines are not at the last code commit. Amendment 5 did not ask for them, so I left them.
- D3 (the PR body's size line) is the custodian's. The correct pairing is above: 1,930 over 10 files at 479ae81d, and 2,010 over 10 files at 14acee0b, both against merge-base counts.
- The scratchpad folder I was given already held the custodian's files, including a `msg1.txt` that the Write tool refused to overwrite. I used only `w1afix-*` names there and wrote nothing else outside the worktree and `D:/wt-targets/1a`.
- The first full run's failure shows a risk for any later run in this shared target.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), the model named in this session's environment. No model override and no context handoff received or produced.
