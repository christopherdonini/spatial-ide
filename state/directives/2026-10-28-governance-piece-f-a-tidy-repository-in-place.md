# The human's message of 2026-10-28: governance piece F, a tidy repository, in place

*Filed verbatim by the custodian from the session transcript (received 2026-10-28T22:37:55.788Z), its text unchanged; nothing in it names another project. The message was the paste alone; its wrapper is not filed. The RULED block in DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---
Governance piece F: a tidy repository, in place. The repository stays the memory: nothing leaves it, no history is rewritten, and its visibility does not change. Governance lane, placed next, before E1, while E1 waits on reading 1; it never holds slot 1. Full form, both gates, and my click to merge.

The goal:
- The root holds only what a visitor or a tool needs: README.md, LICENSE, CONTRIBUTING.md, DCO, CLAUDE.md (Claude Code reads it from the root), Cargo.toml, Cargo.lock, QUICKSTART.md, KNOWN-LIMITATIONS.md, DEPENDENCY-LICENSES.md and the dotfiles. The top-level folders stay as they are, plus one new folder: governance/.
- Everything about how the work is run moves into governance/: AUTONOMY, AI_DEVELOPMENT, PRECEDENTS, DECISIONS-PENDING, PLAN.yaml, the generated queue, the root-level forms, the audits and checklists, and the release records.
- The preregistration forms (176 by git ls-files today; the form counts them at its base) leave the code folders for governance/forms/<module>/, the root ones under one folder of their own. The code folders keep their code and their READMEs.
- state/, docs/, .claude/, .github/, LICENSES/ and site/ stay where they are.

1. The mapping first. Before any move, the form carries a table giving every root file and every form one entry: its new path or "stays", with a one-line reason. A file that a reader or contributor needs stays at the root or goes to docs/; a file about the process goes to governance/. I approve the table in the form.
2. The move:
   - One commit holds only the moves, made with git mv, and no content change. git diff --name-status -M100% against its parent shows R100 on every line and nothing else, so every blob id is unchanged and git log --follow carries each file's history.
   - A second commit updates the paths the tooling hard-codes: the scripts under scripts/, the hooks, the workflows and their path filters, the ruling set, .ignore, CLAUDE.md's layout section, the agent definitions, and PLAN.yaml's gate paths (by script). The Guardian needs no change: G3 recognises a filed preregistration by its filename suffix, wherever it sits; its tests say so after the move.
3. Citations, with no record edited:
   - A move map, governance/MOVED.tsv, lists each old path, its new path and the move commit. It is generated from the move commit by script and never edited by hand.
   - An unpinned citation to an old path resolves through the move map to the new path at HEAD; the move changed no line, and later amendments live at the new path.
   - A citation to an old path written after the move fails by name. The citing line's date is the file's first commit for a record filed once, and git blame of the line for an append-only file; verify-cites asks only for cites that went through the move map. Pinned citations are unchanged.
   - Negative tests, each with a mutation, for all three cases.
4. Proof:
   - Every check gives the same results before and after the move: verify, verify-cites, verify-quotes, verify-test-claims, the hooks' tests and the Guardian's tests.
   - The Stop, PreCompact and SessionStart hooks pass after the move.
   - The queue and the site regenerate with only their paths changed.
   - measure-reads gives the same routine and corpus bytes.
   - A new governance-ci check: no *PREREGISTRATION*.md outside governance/forms/ and state/. It catches a form a branch created at an old location before the move, at that branch's merge, and keeps the layout from decaying.
5. Timing: the move lands in a quiet window. Rule (00) is set aside for the move commit alone, by this ruling, because it changes no content; the form lists the PRs open at that moment, and afterwards each merges main, where git's rename detection carries its edits. The second commit gets no exception: its files are disjoint from every piece in flight, which means the governance lane otherwise empty.
6. The README: its opening says what Spatial IDE is and what works today, then gives a short map of where things are, and points to governance/README.md for how the work is run. The architect drafts it from the existing text, checking each clause against the code, and I approve the words in the PR.
7. Measurement: entries at the root, and markdown files in the code folders, before and after; and the Rust CI runs started by form-only commits to main in the week before and the week after, since product-ci-rust.yml triggers on engine/**, kernel/** and renderer/** today.

Out of scope: a second repository, any change of visibility, any history rewrite, moving state/ or docs/, and the CI-built site.
