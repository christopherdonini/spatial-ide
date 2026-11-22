# The advisor's draft ADV-2026-11-22-03, for the human's approval: the two dev-dependencies of the property-testing trial with their exact pins (the human's message of 2026-11-22, item 3). Not the human's words and not a ruling: it is reserved to the human under the grant's item 4 (c), so nothing in it is acted on until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-22: PASTES/ADV-2026-11-22-03.md in the advisory folder, 5336 bytes, sha256 84ffd88bd70f6c3a9c6b2f50ad77ed638bd92d4e6ba4b2d9dc8df6c3e13f739a, last modified at 2026-11-22T03:49:19Z by the file system; the advisor's message naming it received at 2026-11-22T03:49:50.250Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T03:51:22Z), equal. Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-22. Two dev-dependencies for the property-testing trial. This is the draft that item 3 of my message of 2026-11-22 asks for.

1. What is added, as dev-dependencies only. Nothing of them ships in the app.
   (a) Rust: proptest at exactly 1.12.0, in protocol/data-plane's [dev-dependencies]: `proptest = { version = "=1.12.0", default-features = false, features = ["std"] }`.
   (b) The shell's TypeScript: fast-check at exactly 4.10.2, in frontends/shell's devDependencies, saved exact: `"fast-check": "4.10.2"`.
   (c) Nothing else. If the architect's chosen property needs the line in another crate, or anything else changes the delta of item 3, the difference comes back to me before it is added.

2. How the pins were resolved, without touching the project.
   (a) npm: a copy of frontends/shell/package.json and package-lock.json in the custodian's scratch folder, with `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --save-dev --save-exact fast-check@4.10.2`. No node_modules folder was made and no lifecycle script ran.
   (b) Cargo: a copy of the workspace's manifests and crates at origin/main, taken by git archive into the scratch folder, with `cargo add --dev proptest@=1.12.0 -p spatial-data-plane --no-default-features --features std`. That resolves the lockfile only. Nothing was built, so no build script ran.
   (c) The project's own manifests and lockfiles are unchanged.
   (d) Not shown: that these versions compile and run with the project's pinned toolchain and TypeScript, because nothing was built. If one does not, it comes back to me. The toolchain is not changed for it.

3. The delta.
   (a) frontends/shell/package.json: devDependencies gains `"fast-check": "4.10.2"`. Nothing else changes.
   (b) frontends/shell/package-lock.json: two packages added, both dev and MIT. No package removed and no version changed.
     - fast-check 4.10.2, published 2026-09-19.
     - pure-rand 8.4.2, published 2026-07-10, fast-check's one dependency.
     - The root entry's devDependencies gains fast-check.
   (c) protocol/data-plane/Cargo.toml: the one line of 1 (a). No other manifest changes.
   (d) Cargo.lock: six packages added, none removed, no version changed.
     - proptest 1.12.0 (MIT OR Apache-2.0, published 2026-10-10).
     - chacha20 0.10.2 (MIT OR Apache-2.0, 2026-08-27).
     - cpufeatures 0.3.1 (MIT OR Apache-2.0, 2026-08-26), beside the 0.2.17 already locked.
     - rand_xorshift 0.5.0 (MIT OR Apache-2.0, 2026-02-02).
     - unarray 0.1.4 (MIT OR Apache-2.0, 2022-11-30).
     - core_detect 1.0.0 (MIT/Apache-2.0, 2021-05-09).
     - Five existing entries change their dependency lists:
       - rand 0.10.2 gains getrandom 0.4.3, and getrandom 0.4.3 gains rand_core 0.10.1. These are optional dependencies that proptest's std feature turns on, through rand's std and sys_rng features. The workspace uses resolver 2, under which a dev-dependency's features are turned on only when tests are built.
       - sha1 0.10.7 and sha2 0.10.9 name their cpufeatures by version, because two versions are now locked.
       - spatial-data-plane gains proptest.
     - proptest's other dependencies (bitflags, num-traits, rand, regex-syntax) were already locked.
   (e) frontends/shell/src-tauri/Cargo.lock, the shipped crate's own lockfile: unchanged. With the line of 1 (a) in place, `cargo metadata --locked` passes there.

4. Why these versions and features.
   - proptest 1.12.0 is its newest stable release, published 2026-10-10.
   - fast-check 4.10.2 is not the newest. 4.10.3 (published 2026-11-18) and 4.11.0 (2026-11-21) were under a week old when this was resolved. The newest release at least two weeks old is proposed. A newer pin is my word.
   - proptest's std feature alone is proposed in place of its defaults.
     - The defaults add fork, timeout and bit-set, and with them 11 more packages: bit-set, bit-vec, borsh, borsh-derive, cfg_aliases, fastrand, fnv, quick-error, rusty-fork, tempfile and wait-timeout, 17 in all.
     - The std feature keeps the failure-persistence files that the trial's seed and minimized input rest on.

5. Where they reach.
   - They are dev-dependencies. The Rust ones are compiled only for tests.
   - Neither addition enters NOTICE.txt. The shipped notice is built from the build manifests and from the crates linked into the shell crate, with dev-dependencies excluded (frontends/shell/scripts/generateNotice.mjs and rustCrateNotices.mjs).
   - CI installs them in these jobs. That installation is what item 4 (c) of my message of 2026-11-13 reserves.
     - The Rust workspace jobs, by their `cargo build --workspace --tests --locked` and `cargo test --workspace --locked`: the six crates.
     - The shell job, by its `npm ci` in frontends/shell: the two npm packages.
     - The tauri build job, by its `npm ci` in frontends/shell: the two npm packages. That job is also the one a tagged release build runs. They are installed there and not bundled, as long as no shipped source imports them. The trial's tests merge after the tag, so the build of v0.2.0 does not install them.

6. After this approval, the dependency lines and the lockfile changes go into the trial's piece. Its form is written and its architect's gate reads it now, and the tests merge after the tag.
