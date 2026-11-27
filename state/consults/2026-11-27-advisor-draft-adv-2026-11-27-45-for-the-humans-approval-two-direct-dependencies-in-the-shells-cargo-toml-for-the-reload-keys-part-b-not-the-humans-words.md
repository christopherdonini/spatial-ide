# The advisor's draft ADV-2026-11-27-45, for the human's approval, not the human's words and not in force: two new direct dependencies in the shell's Cargo.toml (webview2-com 0.38, windows-core 0.61) for the reload keys' Part B, with the lockfile change cargo writes, on the condition that no crate is added, no version changes and no feature is added

*Filed by the custodian AS A DRAFT, as ADV-2026-11-26-22 item 1 orders (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-22-what-goes-to-the-human-is-one-draft-draft-d-taken-as-standing-rules-the-sittings-checkout-a-worktree-on-d.md`), and as ADV-2026-11-27-44 items 1 and 12 place it (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-44-the-reload-keys-form-open-1-to-open-9-the-form-files-now-with-the-custodians-amendment-1-the-humans-line-a-draft-of-its-own.md`). It is written in the human's voice for their approval. It is not their words, it is not approved, and nothing in it is acted on until the human approves it in the custodian's session. Until then no byte of the shell's Cargo.toml or Cargo.lock changes, and Part B's code does not land (ADV-2026-11-27-44 item 2). Source: PASTES/ADV-2026-11-27-45.md in the advisory folder, 1073 bytes, sha256 3303ffc9abf7c028d3e26513734673fc477838b24073f2cbe1e3629973720a68, last modified at 2026-11-27T23:37:53Z by the file system. It was named by a session message received before 2026-11-27T23:39:44Z (date -u, taken after it was copied):

Draft for Chris's approval.

To the custodian, 2026-11-27.

The piece `reload-asking-first-or-off-in-the-installed-build` switches the browser's reload keys off in the installed build. To reach that setting, the shell has to name two crates in its own `Cargo.toml`. Dependencies are mine (my message of 2026-11-13, item 4).

1. **I allow two new direct dependencies in `frontends/shell/src-tauri/Cargo.toml`: `webview2-com` 0.38 and `windows-core` 0.61,** and the change that `cargo` then writes to `frontends/shell/src-tauri/Cargo.lock`.

2. **What I know when I allow it.** Both crates are already in that lockfile, at 0.38.2 and 0.61.2, because tauri's own dependencies use them. The piece names them so that the shell's own code can call them.

3. **Conditions.**
   - No crate is added to the lockfile, and no crate in it changes its version. No Cargo feature is added.
   - The reviewer's gate reads the lockfile's diff and says so in so many words. If the diff shows anything else, that part of the piece stops and comes back to me.

4. This is for this piece only.
