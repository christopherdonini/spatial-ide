*Custodian's filing note (2026-11-05): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-05 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`, line 8, item 1); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-03/FIXTURE-DETERMINISM-LINUX-2026-11-03.md` (6224 bytes, sha256 a9bb43e28bca20f8fa3b6ce8160e13f7483fa717221ce4017bc4d18d254651ab), named in that folder's INDEX.md (sha256 ff6aa985a37ded9869e1dbc62580ee527d6e9a5d6a4b87ba0073c3073f944c73): session sesn_01F6D5QHK4bUVZ7unXgS4F7r, agent spatial-ide-flake-hunter (claude-opus-5-5, effort high), US$ 1.88, about 2083 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It worked at main 652752afa9bedb0172948869c9ab7f0b8ee08dd3; from it to main at ae55d424, 7 product, docs or KNOWN-LIMITATIONS files changed (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md, kernel/README.md, kernel/src/bundle/redaction.rs, kernel/src/permission/audit/normalize.rs, kernel/src/publish/viewer_assets.rs, kernel/tests/posix_backslash_in_shared_path_logic.rs, kernel/tests/redaction_hostname_off_windows.rs), so its readings of those files are read again before any node rests on them. The cloud filing of the same question is `state/consults/2026-11-03-cloud-fixtures-linux-report.md` (its branch on 6b67d44b). The custodian compared the two by script and by reading. They agree byte for byte on the Linux figures: G5 at 5,004,376,709 bytes, sha256 fd482403101dd9f1f4d7ff5a64087cb847f3e768def2096c0b4b6fc37bd2ed60, and S at 151,629,665 bytes, sha256 2cb1c6b10959279d40285cd80a0c3d6ce9a84b2d5eda286bdce4c173c9308049. Neither is the recorded Windows hash, and each repeat is identical. They also agree on the row-group counts (13 and 403). Both say the S entry point refuses off Windows, so each run wrote S another way: this run with a test file added in its local copy, the cloud run with its harness. They differ on the maths-library probe. This run checked 19,795 angles and found 32 sines and 11 cosines not exactly rounded; S was unchanged with exact values swapped in. The cloud run checked 80,197 angles (m from 3 to 400) and found 109 sines and 71 cosines 1 ULP off, 25 of them at the sizes S and G5 use; it attributes no cause. The timings and hosts differ. By the ruling (item 2), this is kernel node `fixture-determinism-off-windows-record`, filler entry 1c.*

---

# Fixture determinism on Linux, 2026-11-03

Provenance. An independent agent on the Claude Platform (claude-opus-5-5, effort high; agent `spatial-ide-flake-hunter`, system prompt overridden by the advisor for this task) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (652752afa9bedb0172948869c9ab7f0b8ee08dd3). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01F6D5QHK4bUVZ7unXgS4F7r) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 2083 s active, US$ 1.88. Nothing below this line is edited.

---

Build finished suspiciously fast; checking only the tail.

-----

Commit checked out: `652752afa9bedb0172948869c9ab7f0b8ee08dd3`

# Fixture determinism on Linux: G5 and S regenerated in this sandbox

Neither fixture reproduced its recorded hash on Linux. G5's size also differs, by 4 bytes. The S entry point refused to run on Linux, as its own doc comment says it does. So the S figures come from a test file I added only in my local copy, not from the entry point.

## Results compared with the recorded values

| Fixture | Recorded | This sandbox | Result |
|---|---|---|---|
| **G5** | 5,004,376,705 B, `5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788` | **5,004,376,709 B**, `fd482403101dd9f1f4d7ff5a64087cb847f3e768def2096c0b4b6fc37bd2ed60` | **size and hash both differ** |
| **S** | 151,629,665 B, `fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a` | 151,629,665 B, `2cb1c6b10959279d40285cd80a0c3d6ce9a84b2d5eda286bdce4c173c9308049` | **same size, hash differs** |

Where the recorded values are written:
- **G5 size:** `kernel/FIXTURES.md:20` @ 652752a.
- **G5 hash:** `kernel/FIXTURES.md:21` @ 652752a, and `engine/tests/import_layout_5gb_fixtures.rs:77` @ 652752a.
- **S size:** `kernel/FIXTURES.md:124` @ 652752a.
- **S hash:** `kernel/FIXTURES.md:125` @ 652752a, and `engine/tests/import_layout_fixtures.rs:79-80` @ 652752a.
- `engine/tests/import_layout_fixtures.rs` records no size for S.

## The runs

- **G5:** I checked free disk first: 30 GB was free and the release build took 1.4 GB, so G5 fit. I ran the entry point exactly as its doc comment says (`kernel/tests/regenerate_fixture.rs:70-73` @ 652752a).
  - It finished and printed `5004376709 B`.
  - This entry point never compares hashes and reports success whatever it writes (`kernel/tests/regenerate_fixture.rs:84-90` @ 652752a). The mismatch only showed when I checked the file with `sha256sum` against the recorded value.
- **S:** the entry point stopped with `no drive in /scratch/s: refusing` (`kernel/tests/regenerate_fixture_s.rs:12`, `:63` @ 652752a) and wrote nothing.
  - To get a Linux figure, I added a test file to my local copy only: `sandbox_regen_s_linux.rs`.
  - It uses `spec_s()` copied word for word from the entry point and calls the same writer.
  - It is included in the report's appendix and was removed from the copy afterwards. The maintainers may not want to count it as an S regeneration.
- **Repeat runs in this sandbox:** G5 was generated twice and S four times. Each gave identical bytes every time.
- **Structure matches the record:** both files have the recorded row-group counts, 13 and 403 (`kernel/RESULTS.md:2988`, `:3265` @ 652752a). G5's 345,507,850 vertices and 3,771,429 rings also match (`kernel/RESULTS.md:1641` @ 652752a).

## Parquet footers

I could not read the footers of the recorded files, because they are not in the repository (`kernel/FIXTURES.md:19`, `:123` @ 652752a). So I could not compare the two sides or locate the bytes that differ.

What the sandbox files show, read with pyarrow 26.0.1 in a pip venv:
- **`created_by`:** `parquet-rs version 58.4.0`.
- **Compression:** SNAPPY on every column chunk.
- **Column order:** `id`, `bbox.xmin`, `bbox.ymin`, `bbox.xmax`, `bbox.ymax`, `geometry`.

The report also lists, for whoever holds the original files to compare against:
- footer lengths
- the order of the key-value metadata
- per-row-group sizes for S

## Possible cause I checked: sine and cosine rounding

The generator places vertices using sine and cosine from the system maths library (`engine/src/fixture.rs:1545` @ 652752a).
- On the 19,795 angles the generator can produce, Linux's maths library (glibc 2.39) gives a slightly different last digit from the exactly rounded value on 32 sines and 11 cosines.
- As a temporary local change, since reverted, I swapped in exactly rounded values. S came out byte-identical.
- So small rounding differences there do not reach S's file, which makes them an unlikely cause for S.
- This was not run for G5, and it says nothing about what Windows' maths library returns.

## Why the cause is not pinned down

Every recorded match was produced on Windows, including a 2026-09-19 drill with rustc 1.97.1 and parquet/arrow 58.4.0 (`kernel/RESULTS.md:1638`, `:4687`, `:4703-4706` @ 652752a). This sandbox shares the crate versions but differs in OS and C runtime, Rust target, rustc patch level and CPU. None of these was isolated.

## This sandbox

- **Machine:** Ubuntu 24.04.5, Linux kernel 6.18.44, x86_64, 4 cores, 16,477,348 kB memory, glibc 2.39.
- **Toolchain:** `rustc 1.97.0 (2d8144b78 2026-07-07)`, already installed.
- **Crates:** parquet 58.4.0 (`Cargo.lock:1372-1373` @ 652752a), arrow 58.4.0 (`Cargo.lock:68-69` @ 652752a), snap 1.1.2.
- **Fixture feature:** switched on through the kernel's dev-dependency (`kernel/Cargo.toml:38` @ 652752a).

Durations, this sandbox only:

| Step | Time |
|---|---|
| Cold release build | 1,190 s |
| G5 entry point | 43.3 s |
| G5 second run | 41.7 s |
| `sha256sum` of G5 | 14.0 s |
| S writes (each) | 1.4–1.6 s |

## Gaps

- To find which bytes differ, someone needs to compare footers on a machine that has both the original and the regenerated file for each fixture.
- I tried only one toolchain and one set of crate versions.
- Nothing was pushed, opened or commented anywhere, and my copy of the repository has no local changes left.

Files are in `/mnt/session/outputs`:
- REPORT.md
- sandbox_regen_s_linux.rs

-----

