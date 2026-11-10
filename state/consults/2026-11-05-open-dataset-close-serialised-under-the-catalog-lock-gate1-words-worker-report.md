*Custodian's filing note (2026-11-05): gate 1's Documentation words for PR #280 (`open-dataset-close-serialised-under-the-catalog-lock`, filler 10), the architect's D1, D2 and D4, applied by a worker on `cut/open-dataset-close-serialised-under-the-catalog-lock` at bbb786e4, head cc126162, from the brief by path and sha256 (4b845b65), whose new texts the custodian's script built from the filed architect report's bytes; AUTONOMY section 31, no re-gate. The custodian's check by git: one commit, the two Scope files only (`kernel/src/skp.rs` 7/6, `protocol/skp/SKP-V0.md` 1/1), each file's sha256 at the head equal to the one the brief gives (c7759b25, f0c5ed84); one sign-off, by `git commit -s`. The run 15:38:43Z to 15:39:57Z by its transcript, each call counted once by its id: Bash 6, Read 4, Edit 6 (three refused because the files were not yet read, then the three edits), Write 1; one push of its branch, and no reset, rebase, amend, force, PR action or claude command. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is c5ed31c5bd776f0d9a6d07b0a2d50e870848fc73c8a8c89f2c70da68828af5bc.*

---

Built: open-dataset-close-serialised-under-the-catalog-lock words at cc126162eabb970e659080e37949b594d08f8e8a

Before editing: brief sha256 matched (4b845b65…d015). HEAD and origin/cut/... were both bbb786e42c39396647ab0e8f282ca7d1943b463d, porcelain empty, and the old texts of all three edits were present byte for byte.

Commit: "docs: open-dataset-close-serialised-under-the-catalog-lock, gate 1's Documentation words (the architect's D1, D2 and D4)", signed off with -s.
- Message file: one `@` outside the commit's own sign-off line, in the Co-Authored-By trailer. grep on the file showed only that line.

Hashes after the edits, both equal to the given ones:
- kernel/src/skp.rs c7759b25b271ea6380d0a72af078efdac049a1ce98be71ae9ebcf790ec642106
- protocol/skp/SKP-V0.md f0c5ed849cab4c9bbf52c20c6d21f7edf465090634fd5c4581e615d9e5fac593

numstat (exit 0): `7 6 kernel/src/skp.rs`, `1 1 protocol/skp/SKP-V0.md`, and no other file.

`cargo fmt --all -- --check`: exit 0.

Push: exit 0. Afterwards origin/cut/open-dataset-close-serialised-under-the-catalog-lock equals HEAD (cc126162…) and the porcelain is empty.

Text at my head:
SKP-V0.md line 55:
<!-- The refusal above is made in SkpHost::open_dataset's Watching and ChecksOnly arms, at one check under the catalog's read guard, held through the mint and the OpenRecord's insert; close_dataset holds the catalog's write guard across forget_dataset and the name's removal, so those two steps land wholly before the check or wholly after the insert. A close's earlier steps (its OpenRecord removal, its unknown_dataset check, begin_close and the ticket cancel) can run between the check and the insert; the OpenRecord removal after the name's removal drops a record inserted then. None of these interleavings is reachable in the shipped app: the handle is minted from the OS CSPRNG and returned only by this open, and Catalog::names has no product caller. -->

skp.rs lines 1194 to 1199:
        // a fully-admitted generation). Past the signal refusal each arm also holds the catalog's
        // read guard, from its check that the catalog holds the name through the mint and the
        // record's insert (lock order: latch, then the catalog's read guard, then generations or
        // `watches`), so `close_dataset`'s `forget_dataset` and removal of the name, under its
        // write guard, land wholly before the check or wholly after the insert; its earlier steps
        // can run in between, and its record removal after step 4 drops a record inserted then.

M-T2 line, now at line 5072 because Edit 2 added a line:
    /// RECORDED MUTATION (M-T2, not registered): delete step 0's `watches` removal. Applied at

Background shells left: none; I started none.
Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).
