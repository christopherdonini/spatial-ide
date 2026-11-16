*Custodian's filing note (2026-11-15): the report of PR B's records worker on its correction under the advisor's ruling ADV-2026-11-15-20, from its second hand-back (1850 bytes, sha256 642dd9ed6094008c213497fed7cdacb0e03f08b1b1827aac94963c58b4659bb2), below the rule, byte for byte but in one path: the message file's place is written with `<S>` for the custodian's scratch folder. The worker resumed on the custodian's message of 2026-11-15T20:56:21Z (by file 2525 bytes, sha256 96b95c614299f74a5067e6f77770f5336d9ec8aee4e4664391de09eb22fc791c). The run 2026-11-15T20:56:22Z to 2026-11-15T20:59:11Z by its transcript, 11 calls (Bash 9, Write 1, SubagentHandback 1), no errored call, no hold, model claude-sonnet-5-5. Its opening line is the one its brief gave. Its report on the records commit is `state/consults/2026-11-15-b1-shell-half-pr-b-records-worker-report.md`.*

---

Built: PR B ADV-15-20 correction at 0cf05452ca1b57d597f49be422dbfae586658358

- Pre-checks: HEAD was 0fa941c079d66b7ea5731f07c69c6238a214674e with an empty porcelain. The apply script was 3319 bytes, sha256 f1bfb5d7bd77a70419bc68f68161756df1b5e76d78aabbe04759cb6bc9a8ec93.
- Apply script output (byte-copied): `APPLIED lines 513,514` (rc 0).
- Diff stat (byte-copied): ` KNOWN-LIMITATIONS.md | 4 ++--` and ` 1 file changed, 2 insertions(+), 2 deletions(-)`.
- Diff content: item 65's paragraph gains the last sentence "A feature in a batch that holds no values of the chosen column draws as Other, whatever its value, until that batch is replaced (item 51)." Its comment gains the advisor's-wording note citing ADV-2026-11-15-20 item 2, and the earlier "found untrue ... goes to the advisor" sentence is gone.
- Checks (each in its own call):
  - `profile-path-scan --staged`: rc 0, last line `profile-path-scan: clean`.
  - `verify-cites`: rc 0, last line `verify:cites PASS — every rooted (in-tree) path:line reference across 3111 file(s) resolves. (192 loose reference(s) advised above.)`.
  - `verify-test-claims`: rc 0, last line `verify:test-claims PASS — all 812 claimed test(s) across 268 file(s) exist or are planned, superseded or withdrawn (20 planned, 16 superseded, 17 withdrawn, advisory).`
- Commit: `0cf05452`, signed off with `-s`, message from `<S>/m4b-adv20-msg.txt`.
- Push (own call): `0fa941c0..0cf05452  cut/b1-shell-half-pr-b -> cut/b1-shell-half-pr-b`.
- ls-remote (byte-copied): `0cf05452ca1b57d597f49be422dbfae586658358	refs/heads/cut/b1-shell-half-pr-b`. This equals HEAD, and the porcelain is empty.
- I ran no hold, build or pan-anchor run, as ordered.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override.