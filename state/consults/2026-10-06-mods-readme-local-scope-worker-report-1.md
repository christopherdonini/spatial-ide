*Custodian's filing note (2026-10-06): `mods-readme-local-scope`'s worker report 1, by the worker (Sonnet 5.5, by its definition) on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 7c3fdca7f8306fa34060685ff4d33466e579bbba2711c3e2efd2695ecd695ad8. Write audit PASS: 14 Edit calls, every one on the two READMEs in the worktree `C:/dev/wt/readme-local`, and 1 Write, the commit message in the session's scratch folder; its 3 Bash calls staged and committed, ran the four checks, and published the branch; nothing was written in the main checkout or under the user's Claude folder. Tool calls Read 3, Grep 2, Edit 14, Write 1, Bash 3, SubagentHandback 1. Run window from the transcript: 2026-10-06T17:09:12.186Z to 2026-10-06T17:12:38.677Z. The custodian checked the commit 1eb82dba on origin: numstat 3/3 and 4/4, a clean worktree, and the trailers.*

---

Both READMEs are changed at local scope, committed as 1eb82dbae30354674ce51376e1a7812530be7560 and pushed to origin (74abee6c..1eb82dba, ordinary update). All four checks exit 0, and the worktree is clean.

**Numstat** against 74abee6c (14 changed lines of the 24 allowed):
- 3 insertions, 3 deletions: `tools/mods/spatial-evidence-recorder/README.md`
- 4 insertions, 4 deletions: `tools/mods/spatial-guardian/README.md`

**Changed lines**, byte-copied from `git diff -U0`:

Evidence Recorder:
```
-1. From a checkout on main, at user scope: `claude plugin install spatial-evidence-recorder@spatial-ide-mods --scope user`. The marketplace is the directory source at `tools/mods`; whether it needs a refresh first is the live row E0's to record.
+1. From a checkout on main, at local scope: `claude plugin install spatial-evidence-recorder@spatial-ide-mods --scope local`. The marketplace is the directory source at `tools/mods`; whether it needs a refresh first is the live row E0's to record.
-`claude plugin disable spatial-evidence-recorder --scope user`, or disable it in `/plugin`.
+`claude plugin disable spatial-evidence-recorder --scope local`, or disable it in `/plugin`.
-`claude plugin uninstall spatial-evidence-recorder`
+`claude plugin uninstall spatial-evidence-recorder --scope local`
```

Guardian:
```
-2. `claude plugin install spatial-guardian@spatial-ide-mods --scope user`
+2. `claude plugin install spatial-guardian@spatial-ide-mods --scope local`
-Install from a checkout on main, at user scope. Never use the `project` or `local` scope: a plugin enabled there would be declared by a repository file.
+Install from the main checkout, at local scope. Never use the `project` scope: a committed repository file would then declare the plugin. Local scope's enable record is `.claude/settings.local.json`, which git ignores.
-- Guardian alone: disable it in `/plugin`, or run `claude plugin disable spatial-guardian --scope user`.
+- Guardian alone: disable it in `/plugin`, or run `claude plugin disable spatial-guardian --scope local`.
-To remove it: `claude plugin uninstall spatial-guardian`.
+To remove it: `claude plugin uninstall spatial-guardian --scope local`.
```

**Checks**, each run from the worktree with a 300 s timeout:
- `verify-cites.mjs`: rc=0
- `verify-quotes.mjs`: rc=0
- `verify-test-claims.mjs`: rc=0
- `verify.mjs`: rc=0

**Noticed, not done:**
- Guardian's README step 1, `claude plugin marketplace add <repository>/tools/mods --scope user`, still says `--scope user`. The brief said the marketplace step is unchanged, so I left it. The reviewer may want to compare it against the install-row amendments.
- Evidence Recorder's step 1 still says "From a checkout on main", while Guardian's new sentence says "the main checkout". I kept the Evidence Recorder's wording as the brief directed.

I ran no `claude`, cargo or npm command, and I used no force flag, rebase, merge or PR. The commit message went through a scratch file with `git commit -s -F`.

I ran as Sonnet 5.5 with no model override. I received and produced no context handoff.
