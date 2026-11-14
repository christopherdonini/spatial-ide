*Custodian's filing note (2026-11-12): the architect's read-only options draft for `second-open-history-before-1c-step-3`, the human's item 3 (e) of 2026-11-12, read at main c85788f1 on the code at #307's merge commit 9398efc6 (no code path differs between the two), from its hand-back (25229 bytes, sha256 27f42ccae4a72af9436a52e9f0a596a16a172e418c74efd811f5cc98ba469ad2), below the rule. Each `sha256:<H>` is filled by script with the sha256 of the cited whole lines, each with its LF, at c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e (72 pins); a final newline is added; nothing else is changed. Its brief by file (7429 bytes, sha256 d99ee103a2acfa9864d8fe61b1fdce35f4195f4ac2cf696b8cbec5709028bd7d); the run 16:32:49Z to 16:43:40Z by its transcript, 67 calls (Read 34, Grep 31, Glob 1, SubagentHandback 1), no write, no errored call, model claude-opus-5-5. While it read, the main checkout held the staged files of the custodian's commit 1112z (records only); it says so under G5. It is for the human's ruling: OPEN-N1 to OPEN-N5 are red lines and wait for the human's words; ADR-036's text is the human's. A reading and not Authority.*

---

Read: second-open-history-before-1c-step-3, the options draft (item 3 (e)), on the code at 9398efc6
Reviewed: main @ c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e; code at #307's merge commit 9398efc6e3db7474cc9b1346ea9e1a5f1d5c7832 (read in the main checkout, as the brief directs)

I have no shell, so I cannot show the brief's sha256. Nothing below is a quotation. Every `<H>` is for the custodian's script to fill. `<data>` means the per-user data directory.

## 1. Which record a step goes to at 9398efc6

**The naming rule.**
- A record is `<data>/spatial-ide/sessions/<name>/history.jsonl`, with `locations.json` beside it (`kernel/src/session_history.rs:199-201` @ c85788f1 sha256:af9ac452c49d90677c034f976b76da408fc20820f096045245e2b79a81e8ccd0, `kernel/src/session_history.rs:364-375` @ c85788f1 sha256:f3019af76bca75305fc9aa5671fed321e0ed39d647dd631ecb60d0e6684959f5).
- `<name>` is `unsaved-<32 hex>` when the record is created (`kernel/src/session_history.rs:367` @ c85788f1 sha256:e42fd19c8241142cfcea7d51c76fcf806e807af687d31c93d802d05b1a1740f7), and the project's 32 hex characters after a move (`kernel/src/session_history.rs:286` @ c85788f1 sha256:8c8c4e5162b6aed1b3de8cee880ca41b7fc58ab7edea6d9f8773b552d38348cd).
- The machine store `projects/<hex>/` is a separate folder (`kernel/src/project/store.rs:56-63` @ c85788f1 sha256:2a2e068d5905787f779be5847803b66cc785340f481007d48a12fc91a1b1e8da).

**How a record is found.**
- The record is created at an open's first step. Every later step whose path and claims are equal goes to the same record, for every open in the run (`kernel/src/session_history.rs:243-252` @ c85788f1 sha256:6a4b2fb4edcc577478bb1fd869d74049eeb32f265ef30cabdead50b406c97967, `kernel/src/session_history.rs:423-427` @ c85788f1 sha256:8f525e5c33eef4b9be461f89f74aa4094ebb661d8fb76ce4fdd1ae4bb17175cc, `kernel/src/session_history.rs:557-567` @ c85788f1 sha256:e24c1543c6eede26917359dbc810049bcb43cb858d71818c09236983d146d701).
- This is 1b's rule (`governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:204-214` @ c85788f1 sha256:050a48e9481c26cc69ef075808bc0ba8de40a67ec2aa770d0571c83473250d4f), and K5 pins it (`kernel/tests/session_history.rs:339-405` @ c85788f1 sha256:4cc56f50f360ba4cee1019ba35740448573f5949ea750ecd017e0661f6371bf1).
- The kernel's `close_dataset` never reaches the recorder (`kernel/src/skp.rs:1590-1612` @ c85788f1 sha256:fe73f265c1673584cf2e8b00f497c1ba33364a24d9bc776c1f1c42e0503b3fc3), and records are only dropped by `end_session`.
- `Projects` keys an open's project by its catalog handle, and every open gets a new handle (`kernel/src/project/mod.rs:119-127` @ c85788f1 sha256:b911b3bb87e77204fea2ec409d59c9a67329ebcd254dc4f28382a64e8eec76a4, `kernel/src/project/mod.rs:244-253` @ c85788f1 sha256:c918d273213325d3639dfeff9fa952b32d11480f70d4c26c79686f3ff9b40f91; `frontends/shell/src-tauri/src/commands.rs:154-160` @ c85788f1 sha256:d2a4854bb52ea46e89753afda6a8b33c9012dbf28e948a3c2bc304254c39792c). The shell does the same (`frontends/shell/src/project/saveProject.ts:86-109` @ c85788f1 sha256:f0c3be95c9bd8d8962b01586469d318cd0f6e274be3ea89643bed7583af4c2c8).

**(a) First open, steps, a save, more steps.**
- **Steps.** They go to `unsaved-<r>`. Its header has `project` not-yet-saved and the history's own dataset URI H (`kernel/src/session_history.rs:533-544` @ c85788f1 sha256:d566f68d1a5726454f506cf2353e3aaf7e154055f4428e28f68478b1ba311fb5). The steps chain from there.
- **The save.** It mints project P and P's dataset URI, then writes `projects/<P>/` and `project.spatial` (`kernel/src/project/mod.rs:284-302` @ c85788f1 sha256:52184306c54a569c7dad9e583cc624a07a22344d7196a39bb710104072f8f39d). Only after that do the history moves run (`kernel/src/project/mod.rs:313` @ c85788f1 sha256:c7856f7650e0b79897ba3dbd5055cbf5e1f28a048d6d4f05739e290795d580a7):
  - `adopt_project` copies the record to `sessions/<P hex>/`. Only the header's `project` changes; the lines are carried as they are (`kernel/src/session_history.rs:277-298` @ c85788f1 sha256:09c6f222f1accd38c60697a54beb05f28fc692f599ded8add496612d85f50a73, `kernel/src/session_history.rs:469-482` @ c85788f1 sha256:40b536f2481b1ca23dd91dd1ba95fef9668227b096006890c8107e944538613d). Then it removes `unsaved-<r>`.
  - Then the mark is written, or withheld when the workspace differs.
- **More steps** append to `sessions/<P hex>/`. A later save of the same open finds the record already held by P, so the move does nothing, and it appends a mark.
- **`end_session`** removes `sessions/<P hex>/` (`kernel/src/session_history.rs:340-348` @ c85788f1 sha256:09fe9bcbd10663cf3a3f1b1b684ebabffae0e628d068e10874525487a0b0eeb8; `frontends/shell/src-tauri/src/lib.rs:587-594` @ c85788f1 sha256:726928bc634e8740801614700c41d7ad653818e3034c539175962925f0a7be0a). It leaves `projects/<P>/` and `project.spatial` (item 62). A crash leaves `sessions/<P hex>/`.

**(b) Second open of the file, after A's save; its steps; a save to folder 2.**
- **The second open.** The shell closes the first handle after the new open (`frontends/shell/src/App.tsx:1550-1563` @ c85788f1 sha256:f5315ad9c67c99ed1ee03012b1ef66f0b8dedc9d7e7b028949589164ee390cb1). It resets the filter and clauses but keeps the style, and records no step for that (`frontends/shell/src/workspace/workspaceState.ts:150-156` @ c85788f1 sha256:59d3238e5fc0457be01808a6e4126091cbbbab39456a3ddcf2f51bd1b19d2d4e).
- **Its steps** match A's record by path and claims. They are appended to `sessions/<A hex>/history.jsonl` after A's mark: their `parent` is A's last step, their `data.dataset` is H_A, and their observation is the second open's (`kernel/src/session_history.rs:253-266` @ c85788f1 sha256:e606afbef835d1a615ff40064403694b70fa51bf303e86433a64dde0e1679a2a).
- **The save to folder 2** is a first save for the new handle, so it mints project B.
  - `adopt_project` does nothing, because A holds the record (`kernel/src/session_history.rs:283-285` @ c85788f1 sha256:3138dc47ed2f48a814c2c89ad36569b9d30316daafd34ca2843359f12ff12724).
  - The mark is `HeldByAnotherProject`, which replies `withheld`, at this save and at every later one (`kernel/src/session_history.rs:318-320` @ c85788f1 sha256:0947f5ee4097332d7c8544790a6ddb234055705888cce7e25259dfad297a09fe; Amendment 24 item 2).
  - B has no record.
- **`end_session`** removes `sessions/<A hex>/`, B's steps with it. A crash leaves B's steps under A's header. Item 63 states this (`KNOWN-LIMITATIONS.md:506-507` @ c85788f1 sha256:12cf08203e87b3e1434550eb76ebad62ee49bb433f29209209e31e938e629f0d).

**(c) A save before any step, then steps (the review's C2).**
- **The save.** There is no record, so the move does nothing and the mark is `NoStep`, which becomes `withheld` (`kernel/src/session_history.rs:279-281` @ c85788f1 sha256:b0ffec3d6728c0d719c5f491177111ac2f9feeddd7667bb2d1bb8fb476a4d8f2, `kernel/src/session_history.rs:315-317` @ c85788f1 sha256:2def80ca377b35dd9b831c2e5678c1a3e5fbd263d8e4378171a17a161454a275).
- **The steps** create `unsaved-<r>`, with a not-yet-saved header and no project. Nothing binds it to P.
- **A later save of the same open** moves it to `sessions/<P hex>/`. Until that save, and after a crash before it, an `unsaved-` record sits beside `projects/<P>/`.
- **`end_session`** removes whichever of the two records exists.

**(d) Further cases.**
- **(d1) A's steps end up in B's record.** Open n1 and save it as A before any step. Record steps on n1; they go to `unsaved-R`, held by no project. Close n1, open n2 on the same file, and record steps; they continue R. Save n2 to folder 2 as B: `adopt_project` moves R, including A's post-save steps, under `sessions/<B hex>/`, and the mark can be `Written`. This is ordinary use.
- **(d2) A stale filter in `Reached`.** Two opens of one file before any save share one record. The reopen's filter reset is not a step, so `Reached` keeps the first open's filter (`kernel/src/session_history.rs:152-156` @ c85788f1 sha256:8f89849b98f32335ce7c6eb6c11e0287bfd4eddd8b57011a01f8f956b4335b71). At the save:
  - `differs` withholds the mark when the workspace's filter is not that value (`kernel/src/project/mod.rs:463-467` @ c85788f1 sha256:c24b8e5ce959c70fc556070878387c979b3b3e6ed1114134d1ec553e98715e36);
  - the record's last filter value is not the workspace's.
- **(d3) Path spelling decides the record.**
  - The engine keeps the path as it was requested (`engine/src/dataset.rs:597` @ c85788f1 sha256:9518c3e1747f1c350624cc4a24706776d0376118000eb451ff6ca742b30545fe), so one file reached by two spellings (a junction, a mapped drive) gets two records.
  - A file replaced at one path keeps one record, and the header keeps the first file's observation (K5, above). This is ordinary use.
- **(d4) A failed record move.** The record stays unheld and the next save moves it. This is an IO failure, and item 63's comment names it.
- **(d5) A crash between the replace and the move.** A crash between `kernel/src/project/mod.rs:302` @ c85788f1 sha256:0537052b6c353203120555b2afe4d2f5443be38b72e73e46c85238382987a012 and `kernel/src/project/mod.rs:313` @ c85788f1 sha256:c7856f7650e0b79897ba3dbd5055cbf5e1f28a048d6d4f05739e290795d580a7 leaves C2's on-disk state. This needs crash timing.
- **(d6) Step 2, not reachable at 9398efc6.**
  - A reopen of A in a later run, after a crash left `sessions/<A hex>/`, fails `create_dir` at every save (`kernel/src/session_history.rs:443` @ c85788f1 sha256:a823bc686ba96974047e2e5a91f2cde8da092662fcd8993450e0d6138ba9925e). The ruled collision rule covers it (OPEN-S2-1 (c), `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:20` @ c85788f1 sha256:61b89605bdee3fdbe56961adda906f209282e7abdb7575748306c3fd2d5403f2; its words at `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:358-360` @ c85788f1 sha256:e32c83ec54fe593ef0af5dec2064838cb8a9ac1f0d20d32eed1fa2bfa730b0de).
  - A reopen of A in the same run continues A's record by path. That works under today's key.

## 2. The two dataset identities

**Where each is formed.**
- **H, the history's.** It is minted at each `record_step` (`kernel/src/session_history.rs:239-241` @ c85788f1 sha256:8126764754fb70a73dc90ff0f13ae8cd6c3fef1cb6b3c894b99a7d9652374304) and kept only when the step creates a record. It goes into the header's dataset entry, every step's `data.dataset` and the record's `locations.json` (`kernel/src/session_history.rs:385-394` @ c85788f1 sha256:196f1e9245752995a2b6cfbe5acc59f1a17065e138795f05710965fd419df3a2). The move leaves it as it is.
- **P_ds, the project file's.** It is minted at an open's first save (`kernel/src/project/mod.rs:251` @ c85788f1 sha256:b51425cb94089c9e7c12c3a9fa05246b075fe364b8be1d384f31f63a177c5db0) and kept for that open. It goes into `project.spatial`'s entry and `projects/<hex>/locations.json` (`kernel/src/project/mod.rs:274-290` @ c85788f1 sha256:e82e96f665af1a5f7d34e7067dba0e385d3aec97dfdefa54691a88c796bf8ee2).
- H and P_ds are never equal. Only the path links them, and it is spelled differently in the two files: the recorder writes it as given, and the save writes it made absolute (`kernel/src/project/mod.rs:287` @ c85788f1 sha256:e27702db7a9a86c7dfc9f9d20e941283ee13d05dedfd99b1dafb97d5d096f2f7).

**One file, two identities: yes.**
- Every saved file has both H and P_ds.
- A second open saved again mints a new P_ds, while H stays one per path and claims in the run.
- A new run mints a new H, and so does a change of claims or of spelling.

**Two files, one identity: yes, for H.** A file replaced at one path keeps H (K5).

**Against ADR-036.**
- §4 names one minting point, when a dataset first enters a project (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:72` @ c85788f1 sha256:88726c92f896356fa1b0073671ec62d526b6669a7eb5b72d77ead509f44e8632).
- §6 says a step's data goes through the reference (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:139` @ c85788f1 sha256:77289225abe1ef219bf971750d397fd71dc886443db1465f8ed17a04e3d03ed4).
- Amendment 1 item 4 has a lineage header carry the project file's entry for the same dataset (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:270` @ c85788f1 sha256:f26655a0fda68f313f7cfad2d770de0061cdc8fdf84c2d6c1ad3ea946e69a415).

**How this bears on which record a step belongs to.**
- No record is chosen by either URI: the key is the path and the claims.
- Recovery as drafted matches by path and claims too (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:305-306` @ c85788f1 sha256:2b0c642bda287c5f3534b1c89e0f2b2cb9718b890848f644c7a79680c9d11b00), so step 3 does not break on the URIs.
- What breaks is any reader that matches a step's `data.dataset` against `project.spatial`. A lineage written from the record would name H in its steps and P_ds in its header.
- Under today's key, using H as the project file's URI would give A and B one dataset URI. So the identity fix is coherent only with a record per open or per project (answer 4).
- This confirms the review's note (independent review, line 169).

## 3. What the lineage reader and the recovery offer would read

**The lineage reader (L1 to L4).**
- It reads the project file's `lineage` member, the folder's `lineage.jsonl` and `previous-lineage.jsonl` (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:654` @ c85788f1 sha256:4055da5f45cc3f24e394e047ee4ac35f7a8a1974624aba8a6effcac8105c1b21; `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:255-260` @ c85788f1 sha256:bdf81424823b0007b6eb873bc82f479664a3c46abda1cc0c0555a0cc62d857e9).
- 1c writes the member as `not-kept` and writes no lineage file (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:246-249` @ c85788f1 sha256:dfe9815359975ecdce556fad1c2ed1f0f7a158e6a730b434465db603de7d9355). Its tests run on hand-built files (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:202` @ c85788f1 sha256:9d2eed204e04142291ca52c3b06ca47aac1cf62c58d6a6169e670a09a17e03a8).
- **In every case (a) to (d) it reads no session record**, so it reads no wrong history: it finds the member `not-kept` and names any lineage file as from a different save.
- **Its exposure is twofold:**
  - It is a `pub(crate)` reader in `session_history.rs` that shares that file's shapes (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:82` @ c85788f1 sha256:8a6f1eff24e61d335fbfe53cdcb44864de04b54d4a35d0edbaa044cd0e007d92). An option that changes a header member or a line kind changes what it shares, and both edit the same file.
  - The first lineage writer, which is not placed, is what would read the record. With it, A's lineage takes B's steps in (b), B's in (d1), and stale filter values in (d2).

**The recovery offer (step 3, as drafted).** It lists `unsaved-` records at start and a project's record at that project's open, then restores the last values along the chain (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:296-307` @ c85788f1 sha256:27cd745395d3c65784d1071d443defc110a0772ee4a3b33e6ab499c92362ed37; `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:330-340` @ c85788f1 sha256:8d139fdda95cb29e3a35868a3d366a262dcc183f646541e99e221a2f112d18ae).
- **(a)** Correct. After a crash it offers `sessions/<P hex>/` at P's open, with the values at the crash.
- **(b) Wrong history.**
  - At A's open it offers A's record with B's steps, and restores B's values into A. The path-and-claims check passes, because it is the same file.
  - At B's open it offers nothing, so B's work after the save cannot be recovered.
- **(c) Wrong attribution.**
  - At start it offers the `unsaved-` record as a session that never saved, against ADR-036 §9 (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:206` @ c85788f1 sha256:e9e0f660bb17d9c9a8d22aae38109b9bbabb29f96bb5a0fb517780a54b9eb883). At P's open it offers nothing.
  - If the user accepts, the next save is a first save and mints a new identity.
- **(d1)** At B's open it restores A's steps into B.
- **(d2)** It restores the first open's filter, which the second open had cleared.
- **(d3)**
  - With two spellings, the file has two separate offers.
  - With a replaced file, the offer compares against the header's observation (the first file's), so it reports changed data even when the last steps were made on the current file.

## 4. The node's options

### O-1. Keep the code and state it

- **Decides:** the key stays path and claims for the run, and C2 stays as it is: the record moves at the next save.
- **Changes:** no code. It needs ADR text, item 63 kept, new KNOWN-LIMITATIONS items for C2 and (d1), and step 3's form deciding what to offer for a mixed record. A record holds no boundary between opens, so step 3 cannot separate them.
- **Leaves for ADR-036's text:** that a record may hold steps from opens saved to other projects; C2's order; the two identities.
- **When:** the text before step 3. Nothing to build.
- **Red lines:** ADR text and KNOWN-LIMITATIONS wording.
- (b), (c) and (d1) stay wrong histories for step 3. This works against docs/01 principle 1 (provenance) and ADR-006's command log for class 2 (`docs/01_Principles.md:7` @ c85788f1 sha256:c158bb04e862058b3ec30f57e51ea0d92bf3b26f8e6631719e90e7dc5cfe874d; `docs/adr/ADR-006-lineage-undo-side-effects.md:16` @ c85788f1 sha256:0e959bfb6a866370e9e2cc7fc02d4d19eacd932b6d0c9badcceadb9342fd053b).

### O-2. One record per open until a save binds the open to a project, then the project's record (recommended)

- **Decides:**
  - Before its first save, an open's steps go to that open's own `unsaved-` record.
  - A save binds the open to the project. The open's record moves under the project, or, if the open has no record yet, the first later step creates `sessions/<hex>/` directly, with `project` set to the URI. That second branch is C2, sub-choice (i).
  - After binding, every step of the open goes to the project's record.
  - (b), (c), (d1) and (d2) disappear.
- **Changes:**
  - **`kernel/src/session_history.rs`:** the record keyed by the open's handle and its binding; `adopt_project` takes the handle; creation under the project when the open is bound; `HeldByAnotherProject` removed, since it is left with no producer.
  - **`kernel/src/project/mod.rs`:** passes the handle; `Withheld::RecordHeldByAnotherProject` removed, with its docs (`kernel/src/project/mod.rs:146-158` @ c85788f1 sha256:edde453fc1a811387acf38a5ecb2b3f6a00144a3debd47e17e921e992f4ed140).
  - **`protocol/`:** docs only (`protocol/skp/src/v0/commands.rs:743-747` @ c85788f1 sha256:bc4247bf57609e494ccf396e3e4c1cfc457decd619c53389f76f5629dd592904; `protocol/skp/SKP-V0.md:1340` @ c85788f1 sha256:ee567d982f11bd98d361d9a7ac70e91eb4864d579b0e723494afc4239d753219; `protocol/skp/SKP-V0.md:1346` @ c85788f1 sha256:ede102ad8b63cc5baf8901eba2c82373a930c984a3ae9b7131b7957f9014d95a). The wire values do not change. The step-2 reasons Q4 (a) puts on the wire have one name fewer (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:44` @ c85788f1 sha256:771d33d32dd3994716fffb81cfb02032ce9ed2c22f156a7d49222e9603f4e4d7).
  - **Tests:**
    - K5 edited: an unbound reopen starts a new record. This is declared before code.
    - K-S15 reshaped: B's save is `Written`, and A's record is unchanged by B's step and by B's saves.
    - New tests: C2 (the record goes to `sessions/<P hex>/`, nothing goes to `unsaved-`, and `NoStepRecorded` is asserted, which closes the review's E1); (d1). Each has a mutation.
  - **Record format:** no change of shape. ADR-036 §6 already admits a project URI in the header (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:125` @ c85788f1 sha256:f2a30ed5309b43a2a1e2b70b0613c3442d3c5dcd8a66169e2849b9f8d0e4041f).
  - **KNOWN-LIMITATIONS:** item 63 is withdrawn. Item 43's bound per dataset per run becomes per record (`KNOWN-LIMITATIONS.md:436` @ c85788f1 sha256:c22c976f428e62d266bf47043a06e577a3dc7e77d07c4136a1aa34a97c1353eb).
  - Perf: one lookup per step, with no docs/08 claim.
- **Leaves for ADR-036's text:**
  - the key;
  - a project's record created without a move, which adds to Amendment 1 item 5 (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:272` @ c85788f1 sha256:0633a7e42fec99f5f6ea727e78961f0f9a4cf3c3d685564cc9e18621dcd8aa58);
  - a same-run reopen (OPEN-N4).
- **When:** settled before the lineage reader (item 3 (e)). Built before:
  - step 2's lineage-reader commit, since both edit `session_history.rs`;
  - step 2's protocol bump, for Q4 (a)'s reason names;
  - step 2's reopen orchestration, which interlocks with OPEN-S2-1 (c);
  - step 3.
  It does not touch the resolver, the store or the lock.
- **Red lines:**
  - ADR text;
  - scope changes to ruled items: 1b's OPEN-4 (A) rule, and 1c's OPEN-21-1 (b), whose case is gone;
  - KNOWN-LIMITATIONS items 63 and 43;
  - no P6 string changes;
  - no change to the format on disk.

### O-3. One record per open, always

- **Decides:** as O-2, but an open is never continued in another open's record.
- **Changes:** as O-2.
- **Leaves for ADR-036's text:** as O-2. In addition, a same-run reopen of a project collides with that project's record from this run, so every save of the reopen withholds its mark and shows S5. The approved Amendment 2 words cover another run's record only.
- **When:** as O-2.
- **Red lines:** as O-2, plus the scope of the approved OPEN-S2-1 (c) words.

### O-4. Keep the key and write a boundary mark at each new open

- **Decides:** recovery reads only the last open's part of the record.
- **Changes:** a new mark kind. That is a change of shape and so a version step (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:64` @ c85788f1 sha256:c1308d8b709dadcf4c9c01993cdffc4b5c2dbd633f92043bafaa8d206b1b6791, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:152` @ c85788f1 sha256:ab31e2feb64b3fc3d81bd6657b9ec8cce56c8a0a60a3fe6cf7db13950cb27c6d). It fixes neither the project attribution nor C2.
- **When:** before step 3.
- **Red lines:** the format on the user's machine, and ADR text.
- Not recommended.

### Dataset identity (decided alongside the record key)

- **I-a: keep two identities and state them.**
  - No code.
  - ADR §4's text names both identities and says which one a lineage step carries. A lineage writer would then rewrite `data.dataset`.
  - It can wait until the first lineage writer.
  - Red line: ADR text.
- **I-b: one identity per open.**
  - The save uses the open's record URI if it has one. Otherwise it mints a URI and gives it to the record created later.
  - Code: `kernel/src/project/mod.rs` and `kernel/src/session_history.rs`, through a `pub(crate)` accessor.
  - Seam test: `project.spatial`'s `logical_uri` equals the header's dataset URI and each step's `data.dataset`, with a save before any step included.
  - It needs O-2 or O-3, because under O-1 it gives A and B one URI.
  - Build it with O-2, before any lineage writer. Step 3 as drafted does not need it.
  - Red line: ADR text. The shape on disk does not change.

### Recommendation

O-2, with C2 handled by sub-choice (i), and I-b. Build them as one kernel PR, ahead of step 2's lineage-reader commit and protocol bump. Its ADR-036 note is the human's at this node, and item 63's withdrawal is in the human's words. The choice is the human's.

## OPEN items

- **OPEN-N1 (red line: ADR text; ruled scopes 1b OPEN-4 (A) and 1c OPEN-21-1 (b)).** The record key: O-1, O-2, O-3 or O-4. Recommend O-2.
- **OPEN-N2 (red line: ADR text).** C2:
  - (i) the first step after the save creates the project's record;
  - (ii) the save writes a project record with a header and no steps, which step 3 must then skip;
  - (iii) as today, with a KNOWN-LIMITATIONS item.
  Recommend (i).
- **OPEN-N3 (red line: ADR text).** Identity: I-a or I-b. Recommend I-b, with O-2.
- **OPEN-N4 (red line: the approved Amendment 2 words; the ruled OPEN-S2-1 (c)).** A same-run reopen (step 2) of a project whose record this run holds:
  - (a) the reopen is bound at the reopen and continues that record;
  - (b) the collision rule is extended to this run's record, so every save withholds the mark;
  - (c) as today's path-and-claims continuation.
  Recommend (a). Under O-2 it keeps one record per project per run.
- **OPEN-N5 (red line: KNOWN-LIMITATIONS wording).** Under O-2, item 63 is withdrawn and item 43's bound is reworded. Both are in the human's words.
- **OPEN-N6 (not a red line).** The order: the node's PR before step 2's lineage-reader commit and protocol bump, under rule (00) on `session_history.rs` and `project/mod.rs`. Recommend yes.

## Gate findings I see (not ruled)

- **G1 (Documentation, step 2's form).** The id K-S14 names two tests:
  - step 1's built test (`kernel/tests/project_save_skp.rs:318-326` @ c85788f1 sha256:1e7dcebac542c2f51495f58fe10ea07f76eead2ce0e0f464d18fe6c1a8be74ee);
  - the draft's conditional step-2 test (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:191` @ c85788f1 sha256:dcf6028d34af44ee2b0093257e7f9bdd8244752cba249c1cb056d350a4a3f25e).
  Item 5 (a) uses K-S14 for the reasons on the wire.
- **G2 (step 3's form).** The offer's data state for a record continued over a replaced file uses the header's observation (answer 3, d3). The draft does not say which observation it compares.
- **G3 (step 3's form; not ordinary use).** The recorder's `locations.json` writes the path as given (`kernel/src/session_history.rs:387` @ c85788f1 sha256:ccef94af9587e608f81cb29133f81cba5304039b49321e58e4638944abce8430). ADR-036 §9 calls it an absolute path (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:207` @ c85788f1 sha256:50acf7c1bdc1e0dd510c23d16c8cc35bba795ca253b33d35411f2e0ae0734342). The shell's picker gives absolute paths; a client that sends a relative path gets a relative one recorded.
- **G4 (Evidence, for whichever option lands).** No test covers:
  - a step after a save made before any step (the review's line 182);
  - (d1);
  - (d2).
- **G5 (Documentation).** The node `second-open-history-before-1c-step-3` in `governance/PLAN.yaml`, as I read it in the checkout, still has only the second-open subject in its title and summary. It lacks item 3 (c)'s added subject and item 3 (e)'s placement. The checkout holds staged changes to that file, which I cannot diff.
- **G6 (known, already assigned).** Item 63's comment still names code at a branch commit (`KNOWN-LIMITATIONS.md:508` @ c85788f1 sha256:c06a5c16b6ab7bd9d83651c6ec6a01e5747a27d96d3e6968b0d3d18f5be0d265). Item 3 (b) gives this to the docs lane.

## What I read

- `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`
- `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md`
- `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md` (line 20)
- `governance/PLAN.yaml` (the node)
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (§2.3 to §2.6, §2.10, §4, Amendments 21 to 26)
- `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md` (§2.3's record rule)
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`
- `docs/adr/ADR-006-lineage-undo-side-effects.md`
- `docs/01_Principles.md`
- `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect-attempt-2-completed.md`
- `state/consults/gates/2026-11-12-b2-piece-1c-save-and-reopen-gate1-reviewer-attempt-2-completed.md`
- `state/drafts/2026-11-11-platform-independent-review-pr-307.md`
- `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`
- `kernel/src/session_history.rs`
- `kernel/src/project/mod.rs`
- `kernel/src/project/store.rs`
- `kernel/src/dataset_ref.rs`
- `kernel/src/skp.rs` (`close_dataset`)
- `engine/src/dataset.rs` (`path`)
- `kernel/tests/session_history.rs` (K5, K6)
- `kernel/tests/project_save_skp.rs` (K-S14, K-S15)
- `frontends/shell/src-tauri/src/commands.rs`
- `frontends/shell/src-tauri/src/lib.rs`
- `frontends/shell/src/workspace/stepRecorder.ts`
- `frontends/shell/src/project/saveProject.ts`
- `frontends/shell/src/workspace/workspaceState.ts`
- `frontends/shell/src/App.tsx` (the close)
- `protocol/skp/src/v0/commands.rs`
- `protocol/skp/SKP-V0.md` (§11.2, §11.3)
- `KNOWN-LIMITATIONS.md` (items 43, 62, 63)

**Reuse index:** both lookups missed (rc 1, no prior art recorded). I looked for no prior art outside this repository. The options rest on the code alone.

## The packet's gaps

- The brief did not cite OPEN-S2-1 (c)'s ruling and its approved Amendment 2 words. I found them, and OPEN-N4 rests on them.
- No pointer to 1b's record rule (its form §2.3, OPEN-4 (A)) or to K5, which pin today's key.
- No pointer to the shell's rebind reset, `workspaceState.ts`, which case (d2) rests on.
- Which test item 5 (a)'s K-S14 means (G1).
- The checkout has staged changes to `PLAN.yaml`. I cannot confirm that the node's text matches c85788f1.
- No shell, so no hashes and no check of the brief's sha256.

**Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it.
