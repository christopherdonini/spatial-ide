# The identity scan refuses a null by name: the reviewer's narrow read of the D3 correction at 73f95dd8 (node:identity-scan-refuses-a-null-by-name@d3-narrow-read): PASS

*Filed by the custodian. The reviewer (Opus) read D:/wt/nullname at 73f95dd82070c6f50ecf4c3831e0b4a02b49de37, read only, built nothing and wrote no file. By the facts script its records run from 2026-11-28T01:31:48Z to 2026-11-28T01:50:59Z, and 1 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 1151189 ms and 7 tool uses. Its hand-back is below as received, with the harness indent removed: 4042 bytes, sha256 6453ce5ddccc91f68fc906ea54148ad4b9ba21de04f754f4275966b0d5d709e0. The push run it names as still in progress, 46093509154, was read by the custodian after it, by gh run view: completed, success, at 73f95dd8.*

---

PASS — cut/identity-scan-refuses-a-null-by-name @ 73f95dd82070c6f50ecf4c3831e0b4a02b49de37 (narrow read of the D3 correction on 6e5a0b834ca37a2bb9ad20073fe20511b760558e)

The correction is right. One CI run on the push event was still running when my 20-minute limit ran out (check 5). It does not block this narrow read, but you need to read it before you rely on push CI.

**1. Head, parent, tree, remote** (`git -C D:/wt/nullname rev-parse HEAD HEAD^`, `status --porcelain`, `ls-remote origin <branch>`)
- HEAD is 73f95dd82070c6f50ecf4c3831e0b4a02b49de37 and its parent is 6e5a0b834ca37a2bb9ad20073fe20511b760558e.
- The branch is cut/identity-scan-refuses-a-null-by-name.
- The tree is clean: porcelain printed nothing, both at the start and again at the end.
- The remote head is `73f95dd82070c6f50ecf4c3831e0b4a02b49de37	refs/heads/cut/identity-scan-refuses-a-null-by-name`.

**2. The diff** (`git diff --stat` and `git diff 6e5a0b83..73f95dd8`)
- The stat reads `engine/src/dataset.rs | 2 +-`, `1 file changed, 1 insertion(+), 1 deletion(-)`. The hunk is `@@ -2125,7 +2125,7 @@ fn admit_identity(`.
- The line out, verbatim: `-    // nulls: the two counts differ by the nulls, which are refused by name below.`
- The line in, verbatim: `+    // nulls: `count(*)` and `count(c)` differ by the nulls, which are refused by name below.`
- After the four-space indent and the `// ` marker, both lines match the brief's Old and New byte for byte. The indent and the marker are unchanged, and nothing else changes.

**3. Comment only, behaviour unchanged, the New's clauses checked against the code at 73f95dd8** (read with `sed -n 2100,2200p engine/src/dataset.rs`)
- The changed line is a `//` comment. The diff touches no code token.
- "`count(*)`" is the row count. The query reads `SELECT count(*), count(DISTINCT "{c}"), min("{c}"), max("{c}"), count("{c}")`, and the columns go into `let (rows, distinct, min, max, present) = scan?;` in that order. So `count(*)` lands in `rows`: true.
- "`count(c)`" counts the present values. The fifth column lands in `present`, so `count(c)` is the non-null count: true.
- "differ by the nulls" matches `let nulls = rows - present;`: true.
- "refused by name below" matches `if nulls > 0 { ... return Err(EngineError::IdentityUnusable { ... detail ... }) }`. That block comes after the scan and the negative check, and its detail begins "the column is null in {nulls} of {rows} rows": true.

**4. `cargo fmt --all -- --check` in D:/wt/nullname**
- Exit 0, as `fmt rc=0`. I built nothing and ran no test.

**5. CI at 73f95dd8** (`gh run list --branch cut/identity-scan-refuses-a-null-by-name`, filtered to this head)
- First read about 01:31Z, last read 2026-11-28T01:50:42Z. Between them a background loop re-read the list every 60 s; I took the state from the final direct read.

| Workflow | pull_request | push |
|---|---|---|
| Governance CI — plan, queue, site | success (46093515088) | success (46093509080) |
| Product CI — shell | success (46093515031) | success (46093509114) |
| Product CI — Rust workspace | success (46093515070) | **still in progress** at 01:50:42Z (46093509154) |
| DCO sign-off | success (46093515119) | no run |
| Ported notices | success (46093514978) | success (46093509171) |
| Exposure scan | success (46093515035) | no run |
| Rust fmt | success (46093514981) | success (46093509111) |

- The push run of Product CI — Rust workspace (46093509154) had not finished when the time limit ran out. Its result needs a read before any merge check that depends on push CI.

**Findings**
- Correctness: none.
- Evidence: none against the correction. The one open item is run 46093509154 above.
- Documentation: none. The New names the two counts, which matches the code.

No hook refused any tool call. I wrote no file, made no change in D:/wt/nullname, changed no pull request, and read nothing under C:/dev/spatial-ide. I also did not open the background poll's output file under the temp folder; the CI state comes from a direct `gh run list` read instead.
