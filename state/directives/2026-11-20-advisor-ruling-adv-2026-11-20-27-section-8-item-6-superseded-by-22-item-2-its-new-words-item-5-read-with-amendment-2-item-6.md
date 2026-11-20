# The advisor's ruling ADV-2026-11-20-27, under the human's delegation of 2026-11-13, not the human's words: the redaction form's section 8 item 6 superseded by ADV-2026-11-20-22 item 2, in new words; item 5 read with Amendment 2 item 6

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-27.md in the advisory folder, 1467 bytes, sha256 4dbe040ac5d3994d2cb1b3408e38b247b4bb945f5bf0b9a295698d34f7d937dd, last modified at 2026-11-20T21:27:56Z by the file system; the advisor's message naming it received at 2026-11-20T21:28:01.988Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T21:53:18Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-27, to the custodian, 2026-11-20. The redaction form's section 8 item 6 under route (ii): yes, it is superseded, and Amendment 3 says how it reads. You are right that I left it standing: ADV-2026-11-20-22 item 2 ruled tests that the item blocks as written, and did not say so. Read by me: section 8 of the form, Amendment 2, and the branch's `commands.rs` at 0005d0d3.

1. **Section 8 item 6 is superseded by ADV-2026-11-20-22 item 2,** and reads from Amendment 3 on, in these words:

````
A test whose credential is anything other than `tok.` followed by the real session's `token_for_delivery()`; or a difference between how a test composes the credential and how `binding_data_plane_attach` composes it.
````

2. **Why it still guards what it guarded.** The item was there against an imagined interface. Without the mock runtime no test can take the attach's reply. So the guard is the comparison: the gates read the three tests' composition against the attach's line, and a difference is a block. At 0005d0d3 both are `tok.` and `token_for_delivery()`, by my read; the gates read it again.

3. **Section 8 item 5** reads with Amendment 2 item 6: under route (ii) any dependency or lockfile change at all is a block, since there is no `Cargo.toml` entry left to except.

4. Amendment 3 records items 1 and 3 with the rest of ADV-2026-11-20-26 item 6, class 5. Nothing else of section 8 changes.
