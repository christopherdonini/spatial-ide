*Custodian's filing note (2026-11-13): the architect's read-only consult on the options for pinning the Rust toolchain that CI installs, asked by the human's message of 2026-11-13 (06:43Z), item 8 (`state/directives/2026-11-13-advisor-session-from-advisor-live-human-clicks-until-then-publish-approval-answers-rust-ci-fix-filler-now-toolchain-consult.md`), read at main 3fe9f97d, from its hand-back (19715 bytes, sha256 1772d1df1e010d5d1b91a1bd09975c2d31d238ee006b87eeddb7a1097db56b93), below the rule. Each `sha256:<H>` is filled by script with the sha256 of the cited whole lines, each with its LF, at 3fe9f97d066f49168170f63c23b4c14c0bc843ae (51 of the 52 placeholders); the first, in the template the consult gives for its seven install lines, names no line and is left as written. A shorthand cite (`:N` in the same file at the same commit) is resolved to the file of the nearest full pin before it, checked by script against a map (7 cites). Two placeholders follow two cites each (:234 and :240; :227 and :230), and each is filled with one hash per cite, in the order cited, separated by a comma. A final newline is added; nothing else is changed. What CI installs stays the human's under their grant of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`), item 4 (c); nothing about the toolchain changes until the human answers (item 8).*

---

Consult: CI's Rust toolchain, the pinning options, architect, at 3fe9f97d
Reviewed: main @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae. I read the working tree. The session's git status showed HEAD at that commit with only untracked files, and I have no shell to confirm that the bytes match the commit.

Verdict: consult only. I changed no file and propose no file's wording. Every option below is the human's to choose (red lines, section 4).

## 1. What CI installs today

The same toolchain step appears in all seven install places, and that step installs whatever stable is current on the run day. It is the toolchain action at its `@stable` ref, with no `toolchain:` input. The `@stable` ref is a branch of a third-party action, so both the toolchain and the action's own code can change from one run to the next. The places are product-ci-rust.yml:205, product-ci-shell.yml:181, product-ci-viewer.yml:102, rust-fmt.yml:68, tauri-build.yml:46, adr-003-spike-ci-linux.yml:71 and adr-003-spike-ci-macos.yml:53, all `.github/workflows/<file>:<line> @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:<H>`. No other workflow calls cargo, rustc or rustup. I searched governance-ci, ported-notices, exposure-scan, pages and dco and found no match. The repository has no `rust-toolchain` or `rust-toolchain.toml` file, no `rust-version` key in any Cargo.toml, and no `clippy.toml` or `rustfmt.toml`.

| Workflow / job | Runner (floats?) | Components and targets | Cargo.lock | Cache |
|---|---|---|---|---|
| product-ci-rust `workspace`, Windows and Linux entries (.github/workflows/product-ci-rust.yml:194-198 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:75282a9ba5356294f940168bfdc532978ff992f50cc9ea9bc9970040ef94931d) | `windows-latest` floats. `ubuntu-24.04` pins the OS release only (.github/workflows/product-ci-rust.yml:37-39 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:13d05d0ae3309c0eb9e01a9dc05316f7b553056e0eed751329bc487939cdefa3) | none requested; host target | `--locked` on build, test and list (.github/workflows/product-ci-rust.yml:223 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:97a5219548748721db73b7bf7611fd25364acf80ce5fbcf24dfd0e7715413fd4, :234 and :240 in the same file at the same commit, each sha256:a9a5f7dfd80682cf7c1f55f66873911fb936d9a5379c813aa09d8e36cd73e74a,b12bdf5346649f3ae7b1f7e0bfe755a8a9b402d08bba8a996bfa5fc36a891940) | cache action `@v2` (a major tag, floats), key `<os>-workspace` (.github/workflows/product-ci-rust.yml:209-211 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:abee3629ad5ca14214b27fe08976dadadc27aceb11ec14f162357d3ca0a826cd) |
| product-ci-shell `shell` | `windows-latest` (.github/workflows/product-ci-shell.yml:170 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:8bd4e8be5f330210dba6b77b9cbea0bf9ea71a00b17a1930f4ce963b2f7978d2) | none | `--locked` on test and both release checks (.github/workflows/product-ci-shell.yml:217 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:411fccb786299e993e65ff409d90aa5d61362f6c0eaa425743b1866d4cfcfd49, :227 and :230 in the same file at the same commit, each sha256:09e73abace73f37644f88626d358c252ede7b63e1f3bae5a45dbd62d5f396628,1d94041252c0e380d82acb155cc788526dcb3e418b15dc0748f8043ed3da965b) | `@v2`, key `windows-latest-shell` (.github/workflows/product-ci-shell.yml:183-186 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:e2f39051014ae8d40995cb1908b7df40d7e840762f248981c1346a207c6c7d77) |
| tauri-build (reusable), called by shell's `tauri-build` job and by release-artifacts | `windows-latest` (.github/workflows/tauri-build.yml:29 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:8bd4e8be5f330210dba6b77b9cbea0bf9ea71a00b17a1930f4ce963b2f7978d2) | none | cargo is called through `npm run tauri build` (.github/workflows/tauri-build.yml:68 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:a4701de1d63665d9b18e30aebc2f8a54cf9b3224194ab92e7c7de118f0e1fc27). Whether that call passes `--locked` is not settled (section 5) | `@v2`, key `windows-latest-shell-tauri-build` (.github/workflows/tauri-build.yml:48-51 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:6bba5847d22f1c20202d6d8b3bd820a7ff0e3a10b90ec024435aab1b9675aa38) |
| release-artifacts (tag `v*` only) | through tauri-build (.github/workflows/release-artifacts.yml:38-41 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:61f0bc3cf47cbf36a62aebb2dbc04ffbcb815506e1265cc4def5045943f7df8c, .github/workflows/release-artifacts.yml:100 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:cded59222a7c63bfd5af4c5483a183b2c7781580ac8a9588f29d11bf5a97eb06) | the same | the same | the same |
| product-ci-viewer `viewer` | `ubuntu-latest` (.github/workflows/product-ci-viewer.yml:88 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:3337334aec0dcb24e40e3c20dc09d59af6743d027dbff50c1aca089747117670) | none. It runs bare rustc on redaction.rs (.github/workflows/product-ci-viewer.yml:50-54 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:75f73e2fda431d395378aecd7bbf5c3aea23f9465f2642f75343068e2dc5b93d) | not applicable | none |
| rust-fmt `fmt` | `ubuntu-latest` (.github/workflows/rust-fmt.yml:61 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:3337334aec0dcb24e40e3c20dc09d59af6743d027dbff50c1aca089747117670) | `components: rustfmt` (.github/workflows/rust-fmt.yml:69-70 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:31d6a5068ff183b61c4b9570a4dd1b61363afb95374c4e56db800a594fcd6ea3), and it prints its version (:72-73 in the same file at the same commit, sha256:cd1646ddfef1985e5e9046f17afa593f61dc86233e6e5ba1abd98d6f1c9e5b98) | not applicable | none |
| ADR-003 spike, Linux and macOS | `ubuntu-latest` and `macos-latest` (.github/workflows/adr-003-spike-ci-linux.yml:46 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:3337334aec0dcb24e40e3c20dc09d59af6743d027dbff50c1aca089747117670, .github/workflows/adr-003-spike-ci-macos.yml:46 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:065b1c995594364b1a912f244961037e01ad6268005422c4622b5a0fc4c31ca6) | none | no `--locked` (.github/workflows/adr-003-spike-ci-linux.yml:87 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:db77f6d879259ef75dd27769359b29e10b47e7c4dd9f67e93f375a788ad6f30c, :91 in the same file at the same commit, sha256:4601288f9203c9bd79f9dd781d3bc30184f3d40705902a9798c077ae63092dfc; .github/workflows/adr-003-spike-ci-macos.yml:69 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:db77f6d879259ef75dd27769359b29e10b47e7c4dd9f67e93f375a788ad6f30c, :73 in the same file at the same commit, sha256:4601288f9203c9bd79f9dd781d3bc30184f3d40705902a9798c077ae63092dfc) | none |

Other things that float or are fixed:
- **Fixed:** the lockfiles, but only where `--locked` is passed. The root lockfile is format version 4 (Cargo.lock:3 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:083791b01c1a67ae66aca99070c9ee48082d04307473d494376e6de7cf9a654a). By my reading, that format is the only version floor the tree implies.
- **Also floating:** the checkout, setup-node and upload-artifact actions at their `@v4` major tags; Node at `"24"`; and the images' clang-cl, which is not pinned (governance/forms/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md:64 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:e9c52091f291229ec976540e5f0afdc69b7b6b3a97d4d4873cc24bed9fc2a701). The Windows builds use clang-cl through .cargo/config.toml:3 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:1214d1dbbd9bbb1a8e1536c32d06f64215d90dc4585f5e9a13fc4546184ad06c.
- **Not installed anywhere:** clippy. No workflow runs it yet, and filler entry 12e adds it (state/FILLER-QUEUE.md:35 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:0fa8ad53391d08071b06172dc32d8fadf1932d37ae034ddbe3c9c75c26f8f96b).
- **The local machine** runs rustc 1.97.1. CI moved to 1.100.0 at 5560c7d5 by the brief's facts. That is three minor versions apart.
- **The v0.1.0 build:** RC2 was built on the development machine (governance/RELEASE-0.1.md:1223 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:85ff37314381f91691239b28280815bdbc41e132eae3c9c9f38d82635bf5e0a8). My search of RELEASE-0.1.md found no rustc version recorded. From v0.1.1 on, release artifacts are the tag's CI build (.github/workflows/tauri-build.yml:8-10 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:9d29377f28b630f0a2e7929d91dbd278678fc0c4785d83c9b6fd8351fb44b9a7), so the release compiler is whatever stable is current on the day the tag is pushed.

## 2. The options

Some behaviour of the actions and of rustup that the options depend on could not be checked here. Those statements are my reading and are marked "(unverified)".

**(a) Keep floating `stable`, as today.**
- **Files changed:** none, and nothing to maintain.
- **Release build:** compiled on whatever stable is current on the tag day. The version is recorded only in the run log.
- **Windows, Linux and macOS jobs:** each takes a new release on its first run after the release ships. Because of path filters, the first run may well be on main, as 5560c7d5 was.
- **`--locked`:** unaffected.
- **Cache:** by my reading, the cache action's key includes the rustc version (unverified). If so, every stable release, point releases included, forces a cold build on every key. The cold Windows build is recorded at 41 minutes (.github/workflows/product-ci-rust.yml:102 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:3a4839156ce9e27e7847298221eaaa201090efa555284a8a8e18fedcabebe344).
- **Clippy and rustfmt:** once 12e lands, `-D warnings` will redden whenever a release adds a lint. Under the human's rule of 2026-11-13 (state/directives/2026-11-13-advisor-session-from-advisor-live-human-clicks-until-then-publish-approval-answers-rust-ci-fix-filler-now-toolchain-consult.md:33 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:9187650404696bbfda88a9cbcd8d61e27ce2b587e84a963960520b19a16fead1), each such red takes the filler slot at once. Rustfmt output can also drift between releases.
- **Local machine at 1.97.1:** keeps drifting from CI. Local observations and clippy reads are made on a different compiler from CI's. The 12c form already records clippy readings at 1.97.1 (governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1094 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:e17a26c4eb11be97f4e0b303f47b083e445f33dc90263b46824ca03f790dc98b).
- **The human's builds:** unaffected.
- **Uptake:** automatic, about every six weeks plus point releases. Nobody bumps, and nothing shows a breakage before main.

**(b) An exact version in each install step.**
- **Files changed:** the seven install lines in seven workflow files. Either the action is given a version ref, or it takes a `toolchain: <x.y.z>` input.
- **Cost to keep:** seven lines that must move together, plus any entry added later in an existing job. For example, port-2's macOS entry would share :205. Nothing checks that the seven agree unless a guard is added, and a guard is new scope.
- **Release build:** compiled on a version named in the tree.
- **All three OS:** the same version everywhere.
- **`--locked`:** unaffected.
- **Cache:** goes cold only at a bump.
- **Clippy and rustfmt:** by my reading, the action installs a non-default toolchain with a minimal profile (unverified). If so, clippy is absent unless it is requested. That changes the premise of 12e's Q1 (b), which installs nothing (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md:353-357 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:fac5a28f639e81301e5c52e92a67aa06b1cf9e5f74a5ea8c67f1aa05f29f8d76). rust-fmt already requests rustfmt.
- **Local machine at 1.97.1:** unaffected, but it differs from CI unless the human installs the pinned version.
- **The human's builds:** unaffected.
- **Uptake:** a bump is a piece that edits the seven lines. Each workflow lists its own file in its paths, and product-ci-shell also lists tauri-build.yml. So the bump PR's own runs exercise every Rust workflow except release-artifacts, which runs on a tag only and whose build steps run through shell. Breakage therefore shows on the bump PR, not on main (.github/workflows/product-ci-rust.yml:150 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:6d7830cf15942cc4fdccecc23b38aa5ca41032351077306d3d572ab567a43e63, :178 in the same file at the same commit, sha256:6d7830cf15942cc4fdccecc23b38aa5ca41032351077306d3d572ab567a43e63; .github/workflows/product-ci-shell.yml:134-137 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:b20349300942b5da5d34b277e8c0b8748a558c675e3e1858995a2e1da2407dd5; .github/workflows/rust-fmt.yml:38 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:c766ba9d5f94cde1391bc42f40d58e8663059a4b0b561da519109aa3065411b0). Who bumps, and how often, is the human's to set (section 4).

**(c) A `rust-toolchain.toml` at the root.**
- **Files changed:** one new file, plus the install steps. The action's `@stable` install would otherwise go unused, because rustup prefers the file over the default it sets. Whether rustup then installs the file's toolchain without being asked depends on the runner's rustup version (unverified).
- **Path filters:** only rust-fmt triggers on the file (.github/workflows/rust-fmt.yml:36-37 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:87775971a9d6ef8f8c7f3e26a031d59a7b8dbd446d3cee48f50136e4309fc207, :45-46 in the same file at the same commit, sha256:87775971a9d6ef8f8c7f3e26a031d59a7b8dbd446d3cee48f50136e4309fc207). A bump that edits only the toml would run no suite on its PR, and the first suite run on the new compiler would be on main. Making (c) safe therefore also widens the path filters of product-ci-rust, product-ci-shell, product-ci-viewer and both spike workflows.
- **Scope:** the file governs every directory under the root. That includes the excluded crates: the transport bake-off crate, kept as pinned evidence (Cargo.toml:7-9 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:669d71439fbcb7f9e67d480a981a298d386943e4cfaf4ce92c3c693099ccf1d1), the spike and src-tauri (Cargo.toml:19-29 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:9eb689bc97bc5d0b69f4ba700735f908a7e9d4b693a46ea18ca4cfd9da6aeff2). It also covers the viewer's bare rustc call.
- **Release build:** pinned.
- **`--locked`:** unaffected.
- **Cache:** goes cold only at a bump.
- **Clippy and rustfmt:** the file lists them as components.
- **Local machine and the human's builds:** they change. Every cargo call in the checkout or a worktree switches to the file's version, which means a download on the human's machine. Each target directory then rebuilds in full, including the vendored DuckDB. The Environment line, which reads Rust stable (CLAUDE.md:29 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:998b4e5e13cfbbe48b33e0daf2e69c7feea90b321fff3663ce84b18e4459ecb9), and the toolchain floor in CONTRIBUTING.md (CONTRIBUTING.md:123 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:aa2db1e54497afff788479555c1625a29ba29380c19c1ec17b0b3fe9cae5b244) would then need updating. That wording is the human's, and I propose none.
- **What it buys:** local and CI on one compiler, so clippy reads and M-observations are made on CI's compiler.
- **Uptake:** a one-line bump, together with the widened filters.

**(d) A pin with a separate canary on `stable` that does not block a merge.**
- **Files changed:** the pin from (b) or (c), plus one new workflow or job on `stable`. It is not a required check, has its own cache key so it does not evict the pinned caches, and runs `build --tests --locked`, the suite and clippy once 12e exists. It would trigger on a schedule and `workflow_dispatch`, not on push. A canary red on a main push would meet the "red CI on main is fixed first" rule (directive line 33 above). Whether a scheduled run's red counts under that rule is not settled.
- **Cost:** runner minutes, which the human has treated as their decision before (state/directives/PORTABILITY-2026-09-30.md:137 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:088f366e6b68515c7ce8a06f3021c2bfde9df3f3e48e0debfa0d1844185bb9ab). Each new stable costs one cold build per canary OS. It also adds a new check name.
- **Uptake:** this is the only option that shows a release's breakage before anyone bumps, so that a bump piece's size is known before it is placed.

**(e) The action's own ref pinned by commit.**
- **Files changed:** the seven `uses:` lines carry a 40-hex commit. The toolchain then has to come from a `toolchain:` input, by my reading of the action (unverified). That input can still say `stable`, so (e) alone stops the action's code from floating, not the compiler.
- **Cost:** someone bumps the commit. Doing that with an automated updater would add a config file and a tool, which is new scope.
- **Extending it:** the same treatment could apply to the cache action and the `@v4` actions. Whether it does is a posture choice, not a toolchain one.
- **Effects on the release build, the OS jobs, the lockfile, the cache, the components and local builds:** none beyond what the chosen toolchain pin does.

**(f) Added options.**
- **(f1)** Pin to a minor version only (for example `1.100`), so that point releases still float. This can be combined with (b) or (c). It reduces bump work, but CI then still takes point releases without anyone's word.
- **(f2)** A `rust-version` floor in Cargo.toml, with an optional job at that floor. It declares a minimum and pins nothing, so it does not stop the 5560c7d5 class of break. It is a promise to contributors and a Cargo.toml change.
- **(f3)** A guard script asserting that every install line (and the toml, if (c)) names the same version. It is useful only with (b).
- **(f4)** A lagged channel through the action's relative-release syntax, which I recall but did not verify. It still floats, only later.

**Combinations:**
- (b) or (c) can each be combined with (d), (e), (f1) and (f3). (b) and (c) can be combined with each other only if the install steps name the toml's version, which is the (f3) guard's case.
- (a) can be combined with (e) and (f2).
- (d) is meaningless without (b) or (c).

## 3. Recommendation

(b) and (e) together, with (d) as a second piece. That is: the action pinned by commit, with an exact `toolchain:` version in all seven steps, and a scheduled, non-required canary on `stable`.

Reasons:
- It is the only route where a bump's breakage shows on the bump PR before main. Each workflow already triggers on its own file, and (c) lacks that until four filters are widened.
- It leaves the human's machine and every worktree untouched.
- It names the release compiler in the tree from v0.1.1.
- It stops a third-party branch ref from changing CI's code.

The cost is that local (1.97.1) and CI stay on different compilers. Closing that gap is a separate choice for the human: install the pinned version locally, or take (c) instead.

Order, as one node's scope:
1. Entry 15 merges first. The pin takes the rustc version that the first green main run after it logs, so the pin itself changes no compiler.
2. Sequence the work around the other pieces on the same file. Port-2 is unmerged and its form binds the toolchain action unchanged (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:79 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:64729d62fbfc3312b21a53a4d644b65b102e958f9b6d19ae1b2f76dd89d1cf3c). 12e is held on Q1 to Q4, and its Q2 is this same question (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md:358-362 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:4e92a4ce760d339aa7ea0c8579321330cf589fa443f4afb49c2a1c97c815cb2f). The human answers Q2 with this consult. The pin piece follows port-2 and comes before 12e.
3. Piece 1 changes the seven install lines and nothing else. No path filter, cache key or `--locked` change. Its evidence is its own PR's run of every Rust workflow, each logging the same rustc line.
4. Piece 2 adds the canary workflow, with its own cache key, on a schedule and `workflow_dispatch`, not required.
5. The bump procedure is the human's rule: who proposes a bump, on what signal (the canary green on a new stable, or a fixed cadence), and whether a bump needs their word each time.

## 4. Red lines each option touches

- **(a):** none newly. It does keep what CI installs changing with no one's word at every release, and the human may want to rule on that. 12e's Q2 stays open.
- **(b):** what CI installs, both at the pin and at every bump unless the human pre-rules a bump policy. Release records: the release compiler becomes a fact a release record should name. 12e's Q1, if clippy must be requested.
- **(c):** what CI installs. An install on the human's machine and in every worktree. CLAUDE.md and CONTRIBUTING.md text. The excluded evidence crate's compiler.
- **(d):** what CI installs (stable, on the canary). Runner minutes. A new check name, and whether it is ever required. Whether a canary red falls under the 2026-11-13 red-CI rule.
- **(e):** the security posture (the third-party action supply chain), and its reach if extended to every action.
- **(f2):** a Cargo.toml change and a public minimum-version promise.
- **All options:** the same items are red lines in the human's list (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38, the "dependencies and what CI installs" clause; governance/AI_DEVELOPMENT.md:48-51 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:4be06fafa5b70ca6db9e3aaa4b47c870d29b8054d7f3dde37eecee991c53d065). No option adds a crate or changes Cargo.lock.
- **The form route:** whether this piece runs on a five-line form, given that what CI installs is touched, waits for the human.

## 5. What is not settled, and what I could not read

- Whether the cache action's key includes the rustc version.
- Whether the toolchain action installs with a minimal profile.
- Which rustup the runners carry, and whether it installs a toml's toolchain on its own.
- Whether `npm run tauri build` passes `--locked`.
- Whether a scheduled run's red appears as main's commit status.
- Whether ADR-017's `software` field records rustc. Determinism across toolchains is not claimed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:474 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:2991d83efd10e41440aa36b840c72430e92ab4fc853ed41ffc8681bc36a9e90f).
- Which docs/08 results were taken at which rustc.
- The macOS runner's default target.
- I could not read the actions' or rustup's documentation, nor any CI log.

Packet gaps:
- Whether Product CI — Rust workspace (and shell, viewer, fmt) are required checks for merge.
- The rustc line logged by main's last green runs per workflow, and by tauri-build's last run.
- The rustup version on each runner image.
- Port-2's current diff to product-ci-rust.yml (its macOS entry's install line).
- Whether the human wants the release compiler recorded for v0.1.1.

Model: claude-opus-5-5
