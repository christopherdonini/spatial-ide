Question round 57 — 2026-10-05 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. OPEN-1 — RED LINE (security posture: where Guardian's new rules reach; type your ruling via Other). guardian-v1 (form: tools/mods/GUARDIAN-V1-PREREGISTRATION.md, §3 of the draft). G7 (merges and history rewrites) and G9 (wholesale target cleaning) enforce this repository's rules, but the mod is installed at user scope, so as the brief words them they would apply in every repository you open. The P0 found three git rebases in another project of yours in the last two weeks, which G7 would refuse. (a) As the brief words it: G7 and G9 apply everywhere; G9's 'main checkout' is whichever repository the session is in. (b) RECOMMENDED: G7 and G9 apply only when the session's repository is this one (checked by one $.fs.stat for Guardian's own plugin.json at the repo root, no new call); G1 to G8 stay everywhere. What waits: G7 and G9's code only; the G1 fix, the log and G8 proceed either way.
  (1) Hold — Keep OPEN-1 open; no G7 or G9 code lands. The G1 fix, the log and G8 may be built meanwhile.
  (2) Hold for Fable's read — Keep OPEN-1 open until Fable has read the form; no G7 or G9 code meanwhile.

---

2. OPEN-2 and OPEN-3 — RED LINE (each adds a refusal beyond the brief's rows; type your ruling for both via Other, for example 'OPEN-2 (b); OPEN-3 (b)'). OPEN-2, merges through the API: your line 2 says G7 refuses every agent pull-request merge, but the brief's row names only 'gh pr merge'. (a) The row only; the README says 'gh api' merges and MCP merge tools are not read. (b) RECOMMENDED: also refuse a 'gh api' call whose words hold a pulls/<n>/merge path. The P0 found no legitimate one in two weeks. OPEN-3, the user-level .claude.json: it holds user-scope MCP servers and sits outside the Claude folder G8 guards. (a) The brief's folder list only. (b) RECOMMENDED: also refuse a tool write to .claude.json in your profile; without it a Write does what G8 refuses as 'claude mcp add'. No such writes in two weeks. What waits: one G7 spelling and one G8 path, each with its fixtures, entered as class 9 before their code.
  (1) Hold — Keep OPEN-2 and OPEN-3 open; the form's defaults (a) stand and neither addition lands.
  (2) Hold for Fable's read — Keep both open until Fable has read the form.

---

3. OPEN-4 — RED LINE (what G9 protects; type your ruling via Other). G9 refuses wholesale cleaning of the main checkout's target and data folders. (a) Literal operands only: target, target/slice-evidence and target/fixtures. Under (a), 'rm -rf <the main checkout>' or a folder above it passes G9. (b) RECOMMENDED: also refuse an operand that contains them (the main checkout itself, or any folder above it), and anything under a data folder. The P0 saw no such shape used legitimately. Still allowed either way: removing target/debug, target/release, the shell's src-tauri target, and anything in a worktree's own target. What waits: G9's protected set, its fixtures and its README line (class 9 for (b)).
  (1) Hold — Keep OPEN-4 open; G9 is not built until it is ruled.
  (2) Hold for Fable's read — Keep OPEN-4 open until Fable has read the form.

---

4. OPEN-5 — RED LINE (an over-refusal kept or narrowed now; type your ruling via Other). Guardian refuses a Write of a new file whose folder does not exist yet ('the path cannot be placed'): three such refusals in two days, all harmless false alarms. (a) RECOMMENDED: v1's README lists it, and it is narrowed later through the usual process, with the new refusal log's count at a window. Creating the folder first is a one-call workaround. (b) v1 places such a path on its nearest existing folder, up to a declared depth, and the write rules judge it there (class 9, more code in v1). What waits: nothing beyond one README line under (a). ALSO FOR YOU TO SEE, NOT ASKED: the form proposes a live check E11 beyond the brief's E7 to E10, which you may leave unnamed at the merge approval; as the brief words G8, it will refuse a settings edit you ask the custodian to make through a tool, so you would make such edits yourself; and G9 fails closed on a bare 'cargo clean' and on a relative 'rm -rf target' with no leading 'cd <absolute dir> &&', even inside a worktree.
  (1) Hold — Keep OPEN-5 open; the README line waits.
  (2) Hold for Fable's read — Keep OPEN-5 open until Fable has read the form.
