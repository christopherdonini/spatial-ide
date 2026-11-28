# The recovery offer's base correction at 97e2156d: the reviewer's narrow read (ADV-2026-11-27-43 item 1): PASS

*Filed by the custodian, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-43-the-recovery-base-corrected-by-one-commit-outside-part-1s-count-b-carries-the-two-lines-on-main-a-required-protocol-member-named.md`, item 1. The reviewer (Opus) read D:/wt/recov at 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b, ran no build, and wrote no file; its report names the one git object write it made. By the facts script its records run from 2026-11-27T23:40:11Z to 2026-11-28T00:02:21Z; by its completion notice it took 1330507 ms and 29 tool uses. Its hand-back is below as received, with the harness indent removed: 8263 bytes, sha256 da198bd593357e6d092791a66ea921568bbf9079242dd3b15a2b381aacb355e9.*

---

Verdict: PASS
Reviewed: D:/wt/recov @ 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b

Branch cut/b2-piece-1c-step-3-recovery-offer @ 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b (draft PR 370). In D:/wt/recov, `git rev-parse HEAD` gave 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b and `git status --porcelain` printed nothing, so the tree is clean. Its one parent is f533fadc46728648c028dfafa318a1aece322c1b. I ran no build and changed nothing in the worktree. The only thing I wrote to the repository was the object database, through one `git merge-tree --write-tree` call (fact check below).

**Checking the custodian's facts (all paraphrase)**
- f533fadc's parents are f7770e1a (first) and 5ce0525a (second). `git merge-tree --write-tree f7770e1a 5ce0525a` exits 0 with tree 7bea60adfb00c82df54d2e9d93093d9f5578ffbf, which is f533fadc's own tree. So the merge needed no resolution and none was made.
- Run 46080515270 ("Product CI — shell", push, headSha f533fadc) concluded failure. Its failed step is "Build and test the Tauri backend". `--log-failed` shows E0063, missing field `set_aside_file_id`, at `src\page.rs:791:13` (an `OpenDatasetRequest` literal) and at `src\page.rs:816:13` (an `OpenProjectRequest` literal).
- frontends/shell/src-tauri/src/page.rs exists at 5ce0525a and not at f7770e1a, so it came from B's branch. 8e4247d8 adds `pub set_aside_file_id: bool` to both structs in protocol/skp/src/v0/commands.rs. It is an ancestor of f7770e1a and not of 5ce0525a.

**1. The diff.** `git diff f533fadc 97e2156d` touches one file, frontends/shell/src-tauri/src/page.rs, with 2 lines added and none removed (numstat 2/0). It adds `set_aside_file_id: false,` once inside `open_request`'s `OpenDatasetRequest` literal (frontends/shell/src-tauri/src/page.rs:797 @ 97e2156d) and once inside `reopen_request`'s `OpenProjectRequest` literal (frontends/shell/src-tauri/src/page.rs:823 @ 97e2156d). Both sit under `mod tests`. Nothing else changes in that file or in any other.

**2. Whether `false` means no choice.** It does.
- Type: `bool` (protocol/skp/src/v0/commands.rs:48 and :824 @ 97e2156d).
- Docs: protocol/skp/src/v0/commands.rs:40-47 @ 97e2156d says, in paraphrase, that the field is always present and `false` means no choice. It also says it carries no `#[serde(default)]`, so a request without it fails to deserialize. protocol/skp/src/v0/commands.rs:820-823 @ 97e2156d says the same for `OpenProjectRequest`.
- Serde: neither field has a field-level serde attribute. The only struct-level attribute is `#[serde(deny_unknown_fields)]` (protocol/skp/src/v0/commands.rs:20 and :811 @ 97e2156d). `answer` and `relink` carry `deserialize_with = "key_present"` (:816, :818); `set_aside_file_id` has nothing comparable.
- Consumers: the kernel branches only on `true` (kernel/src/skp.rs:1207 @ 97e2156d, `if req.set_aside_file_id`), and so does the engine (engine/src/dataset.rs:2024 @ 97e2156d). So `false` gives the same open the helpers built before the field existed.
- The TS wire types document `false` for no choice as well (frontends/shell/src/skp/types.ts:52-55 and :405-406 @ 97e2156d).

**3. Other literals of the two types at 97e2156d.** I found every `.rs` file holding either name with `git grep -l -w -F`. A script then matched each brace-delimited literal and skipped struct definitions and `-> T {` return-type braces. The result is 49 literals, and none lacks the field:
- frontends/shell/src-tauri/src/page.rs:791 and :817: carry it (this commit).
- kernel/src/project/mod.rs:822, :1557: carry it.
- kernel/src/skp.rs:3085, :3246, :3324, :3430, :4291, :4378, :4449, :4534, :5523: carry it.
- kernel/tests, all carrying it:
  - dataset_ref.rs:244
  - describe_crs_unit.rs:50
  - no_generation_in_persisted_artifacts.rs:638, :769, :872, :988
  - partitioned_refusal_offers_no_declaration.rs:62
  - project_lock_crash.rs:173
  - project_relink_inside_folder_skp.rs:92
  - project_reopen.rs:579
  - project_reopen_skp.rs:96
  - project_save.rs:153
  - project_save_skp.rs:68, :305, :382, :582
  - record_step_crs.rs:66
  - record_step_match.rs:62
  - session_end_event.rs:83
  - session_history.rs:73, :563
  - session_history_crash.rs:42
  - session_reference.rs:56
  - single_file_bracket_name_open.rs:71
  - skp_admission_remediation.rs:69, :523
  - source_watch_ordering.rs:48
  - source_watch_windows.rs:55
  - text_id_reopen_recorded_declaration.rs:80
  - text_id_set_aside_not_saved_or_published.rs:95
  - typed_terminal_codes.rs:333
  - watcher_first_read_windows.rs:73
- kernel/tests/skp_admission_remediation.rs:617 does not name the field. It is a struct update, `..set_aside_req(...)`, which fills the field from the :523 literal, and that one carries it.
- protocol/skp/src/v0/commands.rs:1074, :1096, :1118: carry it.
- frontends/shell/src-tauri/src/commands.rs:84 and :242 name the types only as command parameters (deserialized), not as literals.
- Every `OpenProjectRequest` in kernel/tests is built by `serde_json::from_value`, not as a literal (for example project_reopen_skp.rs:169, project_relink_inside_folder_skp.rs:130). The fixture JSON in protocol/skp/tests/fixtures.rs carries the key (:608, :817 @ 97e2156d).

**4. Other new required members, against the shell.** `git diff 5ce0525a...f7770e1a -- protocol/` (merge base 55969f98) adds four required members to Rust types:
- `OpenDatasetRequest.set_aside_file_id`
- `OpenProjectRequest.set_aside_file_id`
- `IdentityInfo.candidate_columns`
- `IdentityInfo.set_aside_column`

The same diff also bumps `SKP_VERSION` to `skp/0.17`. Its other protocol changes add no required members to existing types: data-plane property tests, a proptest dev-dependency, docs and fixtures.
- `git grep -w IdentityInfo` under frontends/shell/src-tauri at 97e2156d finds nothing, so the shell builds no `IdentityInfo` literal. The tree's one literal, kernel/src/skp.rs:2045, carries both new members.
- The shell's only hardcoded version literal is `"skp/0.0"` (frontends/shell/src-tauri/src/page.rs:1128 @ 97e2156d), a deliberate bad-version case. The bump does not affect it.
- `git diff --stat 5ce0525a...f7770e1a -- frontends/shell/src-tauri` is empty.
- `git diff --stat f7770e1a...5ce0525a -- protocol/` is empty, so B added no protocol member the C1 side could lack.
- No other literal is missing a member.

**5. CI at 97e2156d.** I read it at 2026-11-27T23:42:27Z, when four runs were still in progress, and again at 2026-11-28T00:01:37Z, when all were completed (`date -u`). Polling was every 75 s for about 19 minutes. Every run on that commit, all on branch cut/b2-piece-1c-step-3-recovery-offer:

| Run | Workflow | Event | Conclusion | Jobs |
|---|---|---|---|---|
| 46083641284 | Product CI — shell | push | success | typecheck · build · vitest · cargo test: success; tauri build (NSIS): success |
| 46083645714 | Product CI — shell | pull_request | success | same two jobs: success |
| 46083646254 | Product CI — Rust workspace | pull_request | success | L1 ubuntu-24.04, L1 macos-latest, windows-latest: success |
| 46083641260 | Governance CI — plan, queue, site | push | success | |
| 46083645720 | Governance CI — plan, queue, site | pull_request | success | |
| 46083641263 | Rust fmt | push | success | |
| 46083645696 | Rust fmt | pull_request | success | |
| 46083641272 | Ported notices | push | success | |
| 46083645641 | Ported notices | pull_request | success | |
| 46083645712 | Exposure scan | pull_request | success | |
| 46083645678 | DCO sign-off | pull_request | success | |

I confirmed by `gh run view` that the headSha of 46083641284, 46083645714 and 46083646254 is 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b. gh listed no push run of "Product CI — Rust workspace" for this commit.

**6. Verdict: PASS.**

Correctness: none.

Evidence: none.

Documentation: none.

Notes (non-blocking):
1. The commit changes exactly the two test literals, with the value that means no choice. The step that failed at f533fadc (run 46080515270) passes at 97e2156d in both shell runs, and the Rust workspace run passes on all three platforms. 97e2156d is fit to stand as the recovery offer's base.
2. The fix is right for these test helpers. The `page.rs` rig drives no row-position choice, and `false` keeps the opens they made before the field existed.
