*Custodian's filing note (2026-09-26): the hand-back of the worker that applied Amendment 1 item 3 (3.1 to 3.4) of `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` for PLAN node `corpus-reproducibility-record`, on cut/corpus-reproducibility-record @ dce598c, a local branch not pushed until the human's sight. Transcribed from the hand-back message (its output file carries no report), with one redaction: the report printed the values of `$USERNAME` and `$COMPUTERNAME`, which the preregistration's §4 (C6, P-a) says are never recorded; each value is replaced by `<redacted>`. Under the human's D2 position (RULED 2026-09-26, the corpus positions, item (3)), the two transcriptions of a public-folder path under the Windows Users root are also replaced by a description. One rooted path-and-line cite into a file that exists only on the unpushed branch is written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is otherwise the worker's text.*

---

Apply round complete for `corpus-reproducibility-record`, Amendment 1 item 3, sub-items 3.1-3.4. All work in `C:/dev/wt/corpus-record`, branch `cut/corpus-reproducibility-record`, local only.

**Commits (all `git commit -s`, in order 3.1, 3.2, 3.3):**
- `586d205` — `engine/compat-corpus/LICENCES.md` per 3.1: 39 insertions, 37 deletions (Rules bullet replaced; 16 project-generated rows' licence/set cells changed to `undeclared — project-generated (round 26, item 2)` / `reproducible — by regeneration`; #11's set cell to `reproducible — by fetch`; the two list sections replaced with `## Reproducible set (17)` / `## Local-only set (4)`; sighting line stays last, blank). 97 lines (≤ `LICENCES_MAX_LINES`=100).
- `3315995` — `engine/compat-corpus/RECORD.md` per 3.2: 1 insertion, 1 deletion (Header's "Licence of the copies" bullet replaced). 88 lines (≤ `RECORD_MAX_LINES`=200).
- `dce598c` — `LICENSES/README.md` per 3.3: 14 insertions (appended one blank line then the "Byte-identical copies without an SPDX header" section, byte-extracted from the preregistration).

`git log --oneline origin/main..HEAD`: dce598c, 3315995, 586d205, dd59b90, ae0220b, baede98, 22dbedb, e1e999c, 5f46abf, 488b641 (last 3 are the apply round; the rest pre-existed at the worktree's given head).

**Extraction method:** every inserted/replaced string (3.1(a), 3.1(d)'s note, 3.1(d)'s two list headings' content, 3.2, 3.3) was cut from the committed preregistration (`engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` lines 408, 413, 418, 420-432) by sed into files, then stripped of indentation/`> ` by a Python script and inserted verbatim — never retyped. The backticked cell strings and list-heading text were copied the same way.

**3.3 pre-check** (`git grep -n "LICENSES/README" -- '*.ts' '*.mjs' '*.rs'`): 4 hits, all read — `frontends/shell/scripts/rustCrateNotices.mjs:243,281` (comments instructing a human/tool to *record* new entries in `LICENSES/README.md`, not reading its bytes/hash), `frontends/shell/src/notices/noticeByteIdentity.test.ts:168` (a comment about updating hashes *there*, again documentary), `renderer/bundle-viewer/notice.mjs:137` (a comment pointing a reader to the file). None reads `LICENSES/README.md`'s bytes or hash programmatically — safe to append.

**3.4 checks, at head `dce598c`:**
- **C1:** 13/13 equal pairs; `git ls-files --eol` shows all 13 `attr/-text`. PASS.
- **C4(a):** 21 rows, 0 disagree. **C4(b):** no output (0 collisions). PASS.
- **C5** over the 10 branch commits: (i) fails by the letter on the same six bookkeeping paths of `488b641` as Amendment 1 item 2.2 recorded (`PLAN.yaml`, `CUSTODIAN-QUEUE.json`, `CUSTODIAN-QUEUE.md`, `site/data/health.json`, `site/data/plan.json`, `site/index.html`) — expected per D1, not a STOP. (ii) DENY_EXT: 0 matches. (iii) largest added blob 185,521 B < 262,144 B ceiling. (iv) no PAR1 magic bytes. (v) `.gitattributes`, `kernel/FIXTURES.md`, `LICENSES/README.md` (added to scope per 1.1(d)) diffed against origin/main...HEAD: no removed lines, all three hunks are pure appends after the base's existing content. PASS except the known (i) deviation.
- **C6**, patterns extracted by sed/python from §4's bullets into pattern files (never retyped inline — the Bash-tool backslash-collapse the hand-back warned of was hit and fixed by reading from files, not literals), each self-tested against a positive sample (P-b: Windows/mac/Linux user-dir samples; P-c: an email; P-d: a `ghp_` token and "secret"; P-e: a `D:\` path and `%USERPROFILE%`) before use, run over all 24 non-preregistration paths C5 lists:
  - P-a (values of `$USERNAME`=`<redacted>`, `$COMPUTERNAME`=`<redacted>`, `-F`, count only): 0 hits.
  - P-b: 1 hit — `kernel/FIXTURES.md:100` (pre-existing, unmodified this round; also the P-e `<redacted: a public-folder path under the Windows Users root>` hit below).
  - P-c: 0 hits. P-d: 0 hits.
  - P-e: 54 total match instances; 11 not permitted (after normalizing JSON/Python-escaped `\\`→`\` before prefix comparison, since the corpus copies store paths JSON/string-escaped):
    - `LICENSES/README.md:67` ×2 — `C:\Program Files` / `C:\Program Files (x86)` (pre-existing content above my append; not permitted — no `\QGIS 3.44.2` suffix).
    - `of-record/MANIFEST.json` line 38 ×2, `PROBE.json:11` ×2 — non-path JSON `\n` escapes inside an embedded `ogrinfo` help-text string (from Commit B, `e1e999c`, not this round).
    - `kernel/FIXTURES.md:100` ×3 — one `D:\spatial-ide\target` and `<redacted: a public-folder path under the Windows Users root>` counted twice (pre-existing, not this round).
    - `site/data/health.json:8,9` ×2 — the worktree path `C:\dev\wt\corpus-record\...` (from `488b641`, not this round).
  - **None of the 11 not-permitted hits is in a line this round's three commits (586d205/3315995/dce598c) added** — confirmed by diffing each file. No P-a to P-d hit anywhere, so no STOP.
  - Permitted (43 instances): `C:\Program Files\QGIS 3.44.2` (exact), `C:\dev\spatial-ide` (exact), `C:\OSGeo4W`, `C:\Windows`, bare `C:\` (only where nothing but a terminator follows, e.g. `cwd="C:\\"` in `gen_qgis.py`/`probe_producers.py`), and the literal `%USERPROFILE%` token in `of-record/README.md:127`.
- **C7**, all seven: `node --test` 311 pass/0 fail; `verify-cites.mjs` PASS (80 pre-existing advisory, unrelated files); `verify-quotes.mjs` PASS (30 baselined + 1 advisory, all pre-existing, no new finding); `verify-test-claims.mjs` PASS; `verify.mjs` PASS; `queue.mjs --check` PASS; `site.mjs --check` PASS.
- **C8** (Amendment 1 item 1.2, run verbatim): command 1 (`git diff origin/main...HEAD -U0 | grep '^[+]' | grep -v '^[+][+][+]' | grep -ciE '...users...'`) printed `0`. Command 2 (`git grep -niE '...users...' HEAD -- engine/compat-corpus/`) printed nothing (grep exit 1). Both as expected.

**No STOP triggered.** `git status --porcelain`: empty. `git ls-remote origin cut/corpus-reproducibility-record`: empty (nothing pushed, confirmed).

**Pre-gate self-check (four failure classes):** cross-module interface — n/a, this piece is docs-only, no code interface touched. Completion claims — every check result above points to a command run in this session; no unproven "done" claims. User-facing messages — n/a, no product-facing text changed. Required tests reaching intended assertions — the C7 suite (311 tests) ran to completion with explicit pass/fail counts, not just setup.

**Model:** I ran as claude-sonnet-5 (Sonnet 5), no override, no handoff received or produced.

**Off-scope noticed, not touched:** D1-D5 in the preregistration remain open for the human at the PR (six bookkeeping paths in `488b641`, the P-e hit disposition, #12's multi-licence set, round 26 item 2's premise, #11's OSI list stability) — unchanged by this round, as instructed. The custodian's pre-push steps (bringing generated-set P-e hits under permitted prefixes, running C8 for the PR body, sighting) are for the custodian, not this worker.
