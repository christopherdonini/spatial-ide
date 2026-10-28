# The human's message of 2026-10-28: rulings by lane (A, #266 and O1; B, the filler order; C, 8a; D; E, governance; F, slots 1 and 2; G, the docs lane's ADR-017 note in the human's words; H, Friday's window)

*Filed verbatim by the custodian from the session transcript (received 2026-10-28T13:40:33.801Z), its text unchanged; nothing in it names another project. The RULED block in DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---
To the custodian, 2026-10-28. Rulings ahead of the questions, by lane.

A. #266 (O1).
1. Amendment 5, T-B on M1: not an invalidator; the mechanism goes in the amendment. The MSVC path flags a product of magnitude exactly 2^63 as an overflow, and the only such product that fits is i64::MIN; T-e's i64::MIN product (−2^31 × 2^32: left high bits 0, right high bits 1, high_bits = 2^31, the mask's bit 31) is that case. A false error on the build being replaced, no wrong rows. If the o1-msvc target is still warm, the tester runs that one product once and the figure joins the amendment; otherwise the reading stands as inference, said so.
2. Amendment 6, 535 of 450 lines: accepted; the gates read all of it; no split.
3. W-2: port-2 is not merged, so the architect's words: "as the Linux build does, and as DuckDB's source has the macOS build do". OPEN-7 (A): #241 is merged, so engine/README.md:523 and the owner's-index pointer are in this PR. The CLAUDE.md line as applied.
4. The build-of-record sentence, final, my words, where the bundled DuckDB's build is recorded: "The Windows build of the bundled DuckDB is compiled with clang-cl (CXX_x86_64-pc-windows-msvc=clang-cl), with DuckDB's export decorations switched off for this static build (-DDUCKDB_STATIC_BUILD), because clang-cl rejects the exported deleted functions in DuckDB 1.5.5's variant_stats.hpp; in CI and on the development machine, so that DuckDB's int64 multiply takes the compiler's checked path, as the Linux build does, and as DuckDB's source has the macOS build do. An engine test pins it: in an admitted predicate, a BIGINT column holding 4000000000 squared ends in the fixed detail, and the products that fit in its cells return exactly the rows exact arithmetic selects."
5. Gate 1: Documentation findings are must-fix with no re-gate; Correctness or Evidence findings take correction rounds as the form has them; the words as §31 has them. The compiler-rt listings as ruled: none means one sentence in the ADR-030 record; any means a stop.
6. After the click: entry 9 heads the filler queue; the o1-probe, o1-clang and o1-msvc worktrees and their targets may go once the raw evidence is in the local evidence folder; the node is done; no KNOWN-LIMITATIONS item; O1 is in v0.2's scope, and the clang-cl installer is first exercised at v0.2's artifact walk (entry 137, OPEN-1 (a)); OPEN-8 is the platform node after port-2, as you have it. The upstream report is mine alone.
7. The v0.2 release-note line, my words: "Windows: a row filter multiplying two whole-number values that both lay between about 3.04 billion and 4.29 billion could return the wrong rows with no error, because the bundled database's Windows build skipped its overflow check for such products. That database is now compiled with clang-cl on Windows, so such an overflow ends in an error, as it does on macOS and Linux."

B. The filler queue, after 8a: 9 the moment O1 merges; then 5b, 4a, 4b, 7a, 7b, 7c, 7d, 8b, 8c, 10; 3 when 1c step 1 merges; 1 when port-2 merges. Entry 9's size: at or under 260 lines, my note under §21c sets 260 and it stays five-line; over 260, the full form with both gates, and it stays in the filler slot by this placement; its strings P6 placeholders, as entry 2's.

C. 8a. The partition is the smallest the mirror lists; if its observation lacks the bbox member, the next smallest, three at most; none with it is a stop, 8a held, and corpus-natural-earth-line-files is placed S3 after 8c. The licence cell as ruled; a difference between the rights holder's statement and the mirror's catalogue line is a stop with both texts to me. No network for the fetch: I place the file and the record says so.

D. 5b and 8b run as ruled; 8b's F-B waits for P-0's outcome; 8c's form questions when they arise.

E. Governance: VQ last; E1 after reading 1, which is mine (/context). verify-cites-past-end-bound's Draft B as committed.

F. Slots 1 and 2: PR B after 1c step 1; 1c step 1 after O0, which is mine; port-2 after 1c step 1.

G. The docs lane gains adr-017-note-product-redaction-gate after sitting-wording, before the v0.2 tag, a docs PR carrying my words below; the gate checks them clause by clause against the code and the form, and a clause it finds untrue comes back to me with the code span.

## Note 2026-10-28 — the product publish runs §13's scan (bundle-redaction-scan-not-in-product-publish)

*Appended under the human's ruling. The text above is unchanged, the Status block and Corrigendum 4 included.*

1. §13's guarantee is now asserted by the product, not only by the format suite. Every publish through `permission::boundary::execute`, the shell's and the `publish-bundle` tooling's, and every `publish_unguarded` call runs `bundle::redaction::scan` over every staged file as it lies on disk, after the last file is written and before the rename, with the same two declared strings the format suite declares: the viewer's copyright line and its corresponding-source address.
2. A match that is not operator-declared refuses the publish as `publish.redaction_finding`, audited as `refused` with `error_kind` `RedactionFinding`. The refusal names the file's bundle-relative path, the first match's class and byte offset, and the count of matches in that file, and never the matched text. No bundle exists under the destination name; the staging directory is removed as on every other failure, or reported by `StagingNotRemoved`.
3. A viewer file is skipped only when its sha256 equals the entry the viewer's build recorded for it in `viewer-asset-hashes.json`, which `scripts/scan-dist.mjs` writes only after the same scan passed over the built viewer against the reviewed rows of `redaction-reviewed.json`, matched by file, class and offset. A viewer file with no matching entry is scanned like any other.
4. Corrigendum 4's table gains a row: the scan of one staged file is a code-controlled quantity of at most that file's bytes, cancellation being checked before each file; its per-byte cost is unmeasured and not claimed. The window's sentence gains the term: one chunk's write, one `File::create`, one `sync_all`, or one file's read and scan — bounded in bytes exactly, and in time not at all.
5. `bundle_version` stays 1 and nothing in the format changes. KNOWN-LIMITATIONS item 47 records what the operator sees and what the scan cannot see.

H. Friday's window reports fillers merged and slots 1 and 2's waiting hours, O1's slot-1 hours included.
