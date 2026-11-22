# The custodian's proposal for a draft: the two dev-dependencies of the property-testing trial, with their exact pins (the human's message of 2026-11-22, item 3)

*The custodian's proposal for a draft under the grant's item 4 (c). It is not the human's words and carries no id. The advisor checks each clause against the records below and issues it under an id (ADV-2026-11-22-01, item 1). It becomes the human's words only when the human types "approved" and that id. Nothing is added to any branch before that approval. Filed by the custodian on 2026-11-22.*

---

## The proposed draft

To the custodian, 2026-11-22. Two dev-dependencies for the property-testing trial.

1. What is added, as dev-dependencies only. Nothing ships in the app.
   (a) Rust: proptest at exactly 1.12.0, in protocol/data-plane's [dev-dependencies]: `proptest = { version = "=1.12.0", default-features = false, features = ["std"] }`.
   (b) The shell's TypeScript: fast-check at exactly 4.10.2, in frontends/shell's devDependencies, saved exact: `"fast-check": "4.10.2"`.
   (c) If the architect's chosen property sits in another workspace crate, that crate takes the same line. Any change to the delta below comes back to me before the merge.

2. How the pins were resolved, without touching the project.
   (a) npm: a copy of frontends/shell/package.json and package-lock.json in the custodian's scratch folder, with `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --save-dev --save-exact fast-check@4.10.2`. No node_modules folder was made and no lifecycle script ran.
   (b) Cargo: a copy of the workspace's manifests and crates at origin/main, taken by git archive into the scratch folder, with `cargo add --dev proptest@=1.12.0 -p spatial-data-plane --no-default-features --features std`. That resolves the lockfile only. Nothing was built, so no build script ran.
   (c) The project's own manifests and lockfiles are unchanged.

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
       - rand 0.10.2 gains getrandom 0.4.3, and getrandom 0.4.3 gains rand_core 0.10.1. These are optional dependencies that proptest's std feature turns on, through rand's std and sys_rng features. Under the workspace's resolver 2 they are built only when tests build.
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
   - They are dev-dependencies, compiled only for tests.
   - Neither addition enters NOTICE.txt. The shipped notice is built from the build manifests and from the shell crate's own lockfile, with dev-dependencies excluded (frontends/shell/scripts/generateNotice.mjs and rustCrateNotices.mjs).
   - CI installs them in the test jobs:
     - the shell job, by its npm ci;
     - the Rust workspace jobs, by their cargo build --workspace --tests and cargo test --workspace.
     That installation is what the grant's item 4 (c) reserves.

6. After this approval, the dependency lines and the lockfile changes go into the trial's piece. Its form is written and its architect's gate reads it now, and the tests merge after the tag (my message of 2026-11-22, item 3).

---

## What it rests on

Every block below is a tool's output, copied by script. The custodian's scratch folder is written `<scratch>`; nothing else is changed.

- **The copies.**
  - npm's copy is frontends/shell/package.json and package-lock.json, copied from the main checkout, whose two files equal origin/main's at 0a43f1ee and at 297ed3a0.
  - Cargo's copy is `git archive origin/main Cargo.toml Cargo.lock .cargo engine kernel protocol/data-plane protocol/skp renderer`, taken at 0a43f1ee and then extended with frontends/shell/src-tauri at 297ed3a0.
  - None of those manifests or lockfiles changed between 0a43f1ee and 297ed3a0, by `git diff --quiet`.
- **The licences and publication times.**
  - npm: from the npm registry, by `npm view <package>@<version> license` and `npm view <package> time --json`.
  - crates: from crates.io's API, one GET per version of https://crates.io/api/v1/crates/<crate>/<version>, reading license, created_at and yanked.
  - Both were read on 2026-11-22.
- **proptest's features.** From proptest's own source at its tag v1.12.0 on GitHub, read by `gh api` (the contents API) on 2026-11-22.

### P1. npm, in the copy of frontends/shell

The command, run in `<scratch>/dep-npm`:

```text
npm install --package-lock-only --ignore-scripts --no-audit --no-fund --save-dev --save-exact fast-check@4.10.2
```

Its output:

```text

up to date in 3s
```

The folder afterwards (no node_modules):

```text
npm.log
package-lock.json
package.json
```

package.json, the main checkout's against the copy's:

```diff
diff --git a/frontends/shell/package.json b/<scratch>/dep-npm/package.json
index 28fcd6c1..eeb9ef2c 100644
--- a/frontends/shell/package.json
+++ b/<scratch>/dep-npm/package.json
@@ -68,6 +68,7 @@
     "@types/react": "^18.3.12",
     "@types/react-dom": "^18.3.1",
     "@vitejs/plugin-react": "^4.3.4",
+    "fast-check": "4.10.2",
     "jsdom": "^25.0.1",
     "playwright-core": "^1.62.1",
     "typescript": "~5.6.2",
```

package-lock.json, the same:

```diff
diff --git a/frontends/shell/package-lock.json b/<scratch>/dep-npm/package-lock.json
index d53e1792..bbb08925 100644
--- a/frontends/shell/package-lock.json
+++ b/<scratch>/dep-npm/package-lock.json
@@ -23,6 +23,7 @@
         "@types/react": "^18.3.12",
         "@types/react-dom": "^18.3.1",
         "@vitejs/plugin-react": "^4.3.4",
+        "fast-check": "4.10.2",
         "jsdom": "^25.0.1",
         "playwright-core": "^1.62.1",
         "typescript": "~5.6.2",
@@ -2737,6 +2738,29 @@
         "node": ">=12.0.0"
       }
     },
+    "node_modules/fast-check": {
+      "version": "4.10.2",
+      "resolved": "https://registry.npmjs.org/fast-check/-/fast-check-4.10.2.tgz",
+      "integrity": "sha512-iK2f+YrcmoeGqk6fA0ea2bptcu/itMIm4NfEozq6N25+aG6h7s5HZbB/k1aV7b5w5sFLMCbbtRUsTVR+BgC3xw==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "individual",
+          "url": "https://github.com/sponsors/dubzzz"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/fast-check"
+        }
+      ],
+      "license": "MIT",
+      "dependencies": {
+        "pure-rand": "^8.0.0"
+      },
+      "engines": {
+        "node": ">=12.17.0"
+      }
+    },
     "node_modules/fdir": {
       "version": "6.5.0",
       "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
@@ -3546,6 +3570,23 @@
         "node": ">=6"
       }
     },
+    "node_modules/pure-rand": {
+      "version": "8.4.2",
+      "resolved": "https://registry.npmjs.org/pure-rand/-/pure-rand-8.4.2.tgz",
+      "integrity": "sha512-vvuOGgcuPJAirlHvuQw1TrOiw7ptaIXXmIbNuiNOY6lNGJJH49PQ1Kj4nd783nPdQhQdicgOjVI2yI/9BD6/Ng==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "individual",
+          "url": "https://github.com/sponsors/dubzzz"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/fast-check"
+        }
+      ],
+      "license": "MIT"
+    },
     "node_modules/react": {
       "version": "18.3.1",
       "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
```

### P2. Cargo, the std feature alone (proposed)

The command, run at the copy's root with CARGO_TARGET_DIR set to a folder in `<scratch>`:

```text
cargo add --dev proptest@=1.12.0 -p spatial-data-plane --no-default-features --features std
```

Its output:

```text
    Updating crates.io index
      Adding proptest =1.12.0 to dev-dependencies
             Features:
             + regex-syntax
             + std
             - alloc
             - atomic64bit
             - attr-macro
             - bit-set
             - default-code-coverage
             - f16
             - fork
             - handle-panics
             - hardware-rng
             - no_std
             - proptest-macro
             - rusty-fork
             - tempfile
             - timeout
             - unstable
             - x86
    Updating crates.io index
     Locking 6 packages to latest compatible versions
      Adding chacha20 v0.10.2
      Adding core_detect v1.0.0
      Adding cpufeatures v0.3.1
      Adding proptest v1.12.0
      Adding rand_xorshift v0.5.0
      Adding unarray v0.1.4
```

protocol/data-plane/Cargo.toml, the main checkout's against the copy's. The root, engine, kernel, protocol/skp and renderer manifests compare equal by `cmp`:

```diff
diff --git a/protocol/data-plane/Cargo.toml b/<scratch>/dep-cargo-std/protocol/data-plane/Cargo.toml
index 54a2b854..96d55c70 100644
--- a/protocol/data-plane/Cargo.toml
+++ b/<scratch>/dep-cargo-std/protocol/data-plane/Cargo.toml
@@ -23,3 +23,4 @@ hex = "0.4"
 tokio-tungstenite = "0.29"
 futures-util = "0.3"
 tokio = { workspace = true, features = ["rt-multi-thread", "macros", "net", "sync", "time"] }
+proptest = { version = "=1.12.0", default-features = false, features = ["std"] }
```

Cargo.lock, the same:

```diff
diff --git a/Cargo.lock b/<scratch>/dep-cargo-std/Cargo.lock
index a93f54e5..70e02b12 100644
--- a/Cargo.lock
+++ b/<scratch>/dep-cargo-std/Cargo.lock
@@ -381,6 +381,17 @@ version = "1.0.4"
 source = "registry+https://github.com/rust-lang/crates.io-index"
 checksum = "9330f8b2ff13f34540b44e946ef35111825727b38d33286ef986142615121801"
 
+[[package]]
+name = "chacha20"
+version = "0.10.2"
+source = "registry+https://github.com/rust-lang/crates.io-index"
+checksum = "65c35e4b699c7e15ccbe7ee35c005e4fc0a278d22238a2857e6ce2dadeda1b06"
+dependencies = [
+ "cfg-if",
+ "cpufeatures 0.3.1",
+ "rand_core 0.10.1",
+]
+
 [[package]]
 name = "chrono"
 version = "0.4.45"
@@ -429,6 +440,12 @@ version = "0.8.7"
 source = "registry+https://github.com/rust-lang/crates.io-index"
 checksum = "773648b94d0e5d620f64f280777445740e61fe701025087ec8b57f45c791888b"
 
+[[package]]
+name = "core_detect"
+version = "1.0.0"
+source = "registry+https://github.com/rust-lang/crates.io-index"
+checksum = "7f8f80099a98041a3d1622845c271458a2d73e688351bf3cb999266764b81d48"
+
 [[package]]
 name = "cpufeatures"
 version = "0.2.17"
@@ -438,6 +455,15 @@ dependencies = [
  "libc",
 ]
 
+[[package]]
+name = "cpufeatures"
+version = "0.3.1"
+source = "registry+https://github.com/rust-lang/crates.io-index"
+checksum = "5ca28b0ae3115b884660db4118d803791fd6756b6e88f39c0f3f7859060d7566"
+dependencies = [
+ "libc",
+]
+
 [[package]]
 name = "crc32fast"
 version = "1.5.0"
@@ -845,6 +871,7 @@ dependencies = [
  "cfg-if",
  "libc",
  "r-efi 6.0.0",
+ "rand_core 0.10.1",
 ]
 
 [[package]]
@@ -1447,6 +1474,22 @@ dependencies = [
  "unicode-ident",
 ]
 
+[[package]]
+name = "proptest"
+version = "1.12.0"
+source = "registry+https://github.com/rust-lang/crates.io-index"
+checksum = "b8530004ccb15eae51c7e40009fbe317f341f804db54dc033eec1c50be28cfa0"
+dependencies = [
+ "bitflags",
+ "chacha20",
+ "core_detect",
+ "num-traits",
+ "rand 0.10.2",
+ "rand_xorshift",
+ "regex-syntax",
+ "unarray",
+]
+
 [[package]]
 name = "quote"
 version = "1.0.47"
@@ -1484,6 +1527,7 @@ version = "0.10.2"
 source = "registry+https://github.com/rust-lang/crates.io-index"
 checksum = "c7f5fa3a058cd35567ef9bfa5e75732bee0f9e4c55fa90477bef2dfcdbc4be80"
 dependencies = [
+ "getrandom 0.4.3",
  "rand_core 0.10.1",
 ]
 
@@ -1521,6 +1565,15 @@ dependencies = [
  "rand_core 0.10.1",
 ]
 
+[[package]]
+name = "rand_xorshift"
+version = "0.5.0"
+source = "registry+https://github.com/rust-lang/crates.io-index"
+checksum = "60aa6af80be32871323012e02e6e65f8a7cc7890931ae421d217ad8fe0df2ccf"
+dependencies = [
+ "rand_core 0.10.1",
+]
+
 [[package]]
 name = "rayon"
 version = "1.12.0"
@@ -1783,7 +1836,7 @@ source = "registry+https://github.com/rust-lang/crates.io-index"
 checksum = "a978451301f4db1d02937a4ab3ccce137717b81826e79b7d49ffe3244a13c3b8"
 dependencies = [
  "cfg-if",
- "cpufeatures",
+ "cpufeatures 0.2.17",
  "digest",
 ]
 
@@ -1794,7 +1847,7 @@ source = "registry+https://github.com/rust-lang/crates.io-index"
 checksum = "a7507d819769d01a365ab707794a4084392c824f54a7a6a7862f8c3d0892b283"
 dependencies = [
  "cfg-if",
- "cpufeatures",
+ "cpufeatures 0.2.17",
  "digest",
 ]
 
@@ -1876,6 +1929,7 @@ dependencies = [
  "futures-util",
  "getrandom 0.3.4",
  "hex",
+ "proptest",
  "subtle",
  "tokio",
  "tokio-tungstenite",
@@ -2209,6 +2263,12 @@ version = "1.20.1"
 source = "registry+https://github.com/rust-lang/crates.io-index"
 checksum = "b6f5e870be6c3b371b77fe0ee0bafb859fa4964b4404c27de1d380043c4dda20"
 
+[[package]]
+name = "unarray"
+version = "0.1.4"
+source = "registry+https://github.com/rust-lang/crates.io-index"
+checksum = "eaea85b334db583fe3274d12b4cd1880032beab409c0d774be044d4480ab9a94"
+
 [[package]]
 name = "unicode-ident"
 version = "1.0.24"
```

The lockfile delta by package, from a script that compares the two lockfiles' [[package]] entries by name and version:

```text
ADD chacha20 0.10.2
ADD core_detect 1.0.0
ADD cpufeatures 0.3.1
ADD proptest 1.12.0
ADD rand_xorshift 0.5.0
ADD unarray 0.1.4
CHANGED-DEPS getrandom 0.4.3
CHANGED-DEPS rand 0.10.2
CHANGED-DEPS sha1 0.10.7
CHANGED-DEPS sha2 0.10.9
CHANGED-DEPS spatial-data-plane 0.0.0
```

### P3. Cargo, with proptest's default features (not proposed)

In a second copy, the same command without `--no-default-features --features std`:

```text
cargo add --dev proptest@=1.12.0 -p spatial-data-plane
```

Its output:

```text
    Updating crates.io index
      Adding proptest =1.12.0 to dev-dependencies
             Features:
             + bit-set
             + fork
             + regex-syntax
             + rusty-fork
             + std
             + tempfile
             + timeout
             - alloc
             - atomic64bit
             - attr-macro
             - default-code-coverage
             - f16
             - handle-panics
             - hardware-rng
             - no_std
             - proptest-macro
             - unstable
             - x86
    Updating crates.io index
     Locking 17 packages to latest compatible versions
      Adding bit-set v0.11.1
      Adding bit-vec v0.10.2
      Adding borsh v1.8.1
      Adding borsh-derive v1.8.1
      Adding cfg_aliases v0.2.2
      Adding chacha20 v0.10.2
      Adding core_detect v1.0.0
      Adding cpufeatures v0.3.1
      Adding fastrand v2.5.0
      Adding fnv v1.0.7
      Adding proptest v1.12.0
      Adding quick-error v1.2.3
      Adding rand_xorshift v0.5.0
      Adding rusty-fork v0.3.1
      Adding tempfile v3.27.0
      Adding unarray v0.1.4
      Adding wait-timeout v0.2.1
```

The lockfile delta by package, the same script:

```text
ADD bit-set 0.11.1
ADD bit-vec 0.10.2
ADD borsh 1.8.1
ADD borsh-derive 1.8.1
ADD cfg_aliases 0.2.2
ADD chacha20 0.10.2
ADD core_detect 1.0.0
ADD cpufeatures 0.3.1
ADD fastrand 2.5.0
ADD fnv 1.0.7
ADD proptest 1.12.0
ADD quick-error 1.2.3
ADD rand_xorshift 0.5.0
ADD rusty-fork 0.3.1
ADD tempfile 3.27.0
ADD unarray 0.1.4
ADD wait-timeout 0.2.1
CHANGED-DEPS getrandom 0.4.3
CHANGED-DEPS rand 0.10.2
CHANGED-DEPS sha1 0.10.7
CHANGED-DEPS sha2 0.10.9
CHANGED-DEPS spatial-data-plane 0.0.0
```

### P4. The shipped crate's own lockfile

frontends/shell/src-tauri at 297ed3a0, archived into the first copy beside the changed protocol/data-plane, and in it:

```text
cargo metadata --locked --format-version 1 > /dev/null   # rc=0
cmp Cargo.lock <main checkout>/frontends/shell/src-tauri/Cargo.lock   # equal
```

Its standard error:

```text
(empty)
```

### P5. Licences and publication times

From the npm registry:

```text
fast-check@4.10.2 license=MIT published=2026-09-19T19:34:54.991Z
pure-rand@8.4.2 license=MIT published=2026-07-10T07:55:10.896Z
fast-check@4.10.3 published=2026-11-18T12:33:37.248Z
fast-check@4.11.0 published=2026-11-21T22:44:30.307Z
fast-check latest=4.11.0
```

From crates.io's API:

```text
proptest 1.12.0 license=MIT OR Apache-2.0 published=2026-10-10T18:18:05.623491Z yanked=false
chacha20 0.10.2 license=MIT OR Apache-2.0 published=2026-08-27T17:51:13.045493Z yanked=false
core_detect 1.0.0 license=MIT/Apache-2.0 published=2021-05-09T16:36:07.524627Z yanked=false
cpufeatures 0.3.1 license=MIT OR Apache-2.0 published=2026-08-26T18:39:59.636708Z yanked=false
rand_xorshift 0.5.0 license=MIT OR Apache-2.0 published=2026-02-02T08:15:36.556285Z yanked=false
unarray 0.1.4 license=MIT OR Apache-2.0 published=2022-11-30T17:09:42.916530Z yanked=false
proptest max_stable_version=1.12.0
```

### P6. proptest's features and its failure persistence, at its tag v1.12.0

proptest/Cargo.toml, the four feature lines:

```text
22:default = ["std", "fork", "timeout", "bit-set"]
35:std = ["rand/std", "rand/sys_rng", "regex-syntax", "num-traits/std"]
50:fork = ["std", "rusty-fork", "tempfile"]
55:timeout = ["fork", "rusty-fork/timeout"]
```

proptest/src/test_runner/failure_persistence/mod.rs, its lines 14 to 24:

```rust
use core::str::FromStr;

#[cfg(feature = "std")]
#[cfg_attr(docsrs, doc(cfg(feature = "std")))]
mod file;
mod map;
mod noop;

#[cfg(feature = "std")]
pub use self::file::*;
pub use self::map::*;
```
