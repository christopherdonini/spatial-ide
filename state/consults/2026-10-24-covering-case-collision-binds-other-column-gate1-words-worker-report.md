*Custodian's filing note (2026-10-24): the worker's application of PR #252's gate 1 words at 3d599fb4. It discloses one write outside its folders, a push log redirected to C:/dev/wt and removed; the custodian found it gone. The run 15:36:09Z to 15:40:48Z by its transcript (Bash 6, Write 2). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 1c9a08a94e680583369374982e671a32b450d8b60b9a2700e76bec25a84bd0aa.*

---

Applied: #252's gate 1 words at 3d599fb47572fb72032daa73d035e4df8fe07a9b

Commit: `docs: covering-case-collision-binds-other-column, gate 1's words in KNOWN-LIMITATIONS items 9 and 53`, made with `git commit -s -F`. It changes only KNOWN-LIMITATIONS.md, 3 lines in and 3 out. The message file has no `@` outside its Co-Authored-By line (`grep -n '@'` printed only line 6). I wrote no Signed-off-by line and no email address.

Replacements, applied by script. The script refused unless the match count equalled the stated count; all three matched exactly:
1. Line 117, once. Before: "...more than one of the file's column names, or names a column the app reads under another name, the file is refused when it is opened instead (item 53)." After: "...more than one of the file's names, or names a column or a field the app reads under another name, the file is refused when it is opened instead, unless a path of that covering contains U+0000 (item 53)."
2. Twice (item 9's comment at line 118 and item 53's at line 423). Before: `Where the code does this, at 9fb3e4c3 on the piece's branch:`. After: `at 21fb02d9`.
3. Once, in item 53's comment. Before: "which the form's P0 is to show no ordinary file reaches". After: "which no row of the form's P0 reached (its Amendment 1, items 3 and 6)".

Checks, each with its exit code:
- `git diff --numstat 77bbbc63 HEAD` gave `3 3 KNOWN-LIMITATIONS.md`, rc=0.
- `git diff --numstat ccd408f7...HEAD -- KNOWN-LIMITATIONS.md` gave `6 0`, rc=0.
- `node scripts/plan/verify-cites.mjs` printed PASS, rc=0.
- `node scripts/plan/verify-quotes.mjs` printed PASS, rc=0.

Push: `git push origin cut/covering-case-collision-binds-other-column` returned rc=0 (77bbbc63..3d599fb4). `git ls-remote` shows origin's branch at 3d599fb47572fb72032daa73d035e4df8fe07a9b, equal to HEAD. `git status --porcelain` is empty.

One breach of the write rule: I redirected the push output to `C:/dev/wt/ccc-w-push.txt`, outside `C:/dev/wt/ccc` and my scratch folder. I read it and removed it (rm rc=0). It was never tracked.

Processes: every command ran in the foreground and exited. I started no background process. No heavy command was needed, so no machine hold was taken.

Model: claude-sonnet-5-5 (Sonnet 5.5), as the harness reports it. No override and no context handoff. Scratch files are `ccc-w-apply.mjs` and `ccc-w-msg.txt`, plus output files named `ccc-w-*`, in my scratch folder.
