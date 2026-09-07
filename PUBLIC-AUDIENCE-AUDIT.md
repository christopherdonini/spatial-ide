# Public-audience audit — the flip-to-now window

**Date of audit:** 2026-09-07. **Read-only.** Nothing outside this file was modified; no git write
was made; no finding was remediated. Every item below is **queued for the human** (the project's
own rule: no unqueued remediation).

**The fact audited against:** the repository has been public on GitHub since
**2026-08-03T18:06:23Z** — a single `PublicEvent` in GitHub's events API, verified by the custodian
on 2026-09-07 and recorded in ADR-009's appended corrigendum (`docs/adr/ADR-009-license-and-open-core-boundary.md:90-105`),
`PRE-PUBLIC-CHECKLIST.md:3-13`, `docs/07_Roadmap.md:26`, `docs/14_Governance_and_Licensing.md:5`,
`docs/README.md:27`, `AI_DEVELOPMENT.md` (red-lines list) and `DECISIONS-PENDING.md` entries 12–15
(all in commit `914ef9f`, 2026-09-07 01:09:27 +0200). This audit did not re-query the API; it takes
the date as given and audits the consequence.

> **Scope clarification (2026-09-07, custodian, per the human's direction):** the window is the WHOLE
> public period, 2026-08-03T18:06Z → the audit date — which is what `git log --since=2026-08-03`
> below already covers (405 commits). The 2026-08-07 and 2026-08-18 pre-public checklist sweeps
> remain valid evidence for the credential / personal-data / third-party classes (they ran against
> this same history and found nothing), so the class this audit HAD to add is the
> assumed-private-audience content class (§1's F-3, F-12 and kin); its re-sweep of the earlier
> classes is corroboration, not a requirement. One further fact of the same period is recorded in
> ADR-009's corrigendum addendum: the repository carried NO license file from the flip until
> `65dde47` (2026-08-07T08:18Z) — 77 commits, ~3.6 days, public under default all-rights-reserved.

**Window and tree audited:** `git log --since=2026-08-03 HEAD` at HEAD **`914ef9f`** =
**405 commits** (401 of them after the flip instant; the four earlier same-day commits `3f6e94a`,
`3b730a8`, `56df8e8`, `73e9935` were swept too), plus the full tracked tree at `914ef9f`. The brief
estimated "roughly 230"; the actual count is 405 — the 2026-08-18 delta sweep covered commits up to
`8a69260` (239 total at that time), so roughly 170 of the 405 have never been swept before.

**Method** (the 2026-08-18 pass's proportionality: pattern-based, not a blob-by-blob re-read):
`git grep` with fixed strings and regexes at HEAD for every class; `git log --since=2026-08-03
-S<term>` pickaxe over the window; a robust `git log --since=2026-08-03 -p | grep` over every added
and removed line for the path/identifier forms (this is what caught the doubled-backslash JS string
the pickaxe missed); `git log --format='%an <%ae>' / '%cn <%ce>'` for identities; commit subjects and
bodies grepped for paths, emails and personal terms; the three files deleted inside the window read
at their pre-deletion revision; every hit read in context before classification. Citation
discipline: every excerpt below is text actually read at `914ef9f` (or at the named commit);
paraphrases are labelled.

**Severity vocabulary, used without inflation:**
- **leak** — information a public reader should not have and could not otherwise obtain (a
  credential, a private address, health/location detail). **None found.**
- **sensitivity-class match** — a hit in a class the project's own 2026-08-07 / 2026-08-18 sweeps
  defined and swept for (username-bearing paths, machine names, personal emails, remote-access
  detail, third-party data terms, personal circumstances). Reportable; impact stated per item.
- **hygiene** — a stale statement, a non-portable path, a working-tree stray; no audience harm.
- **none** — recorded for completeness (public commit identities; the custodian process being
  public is by design and is **not** flagged).

---

## 1. Findings

Counts: **leak 0 · sensitivity-class match 8 · hygiene 7 · none 2** (17 rows).

| id | class | location (HEAD `914ef9f` unless noted) | excerpt (verbatim unless marked *paraphrase*) | severity | proposed remediation — queued, none applied |
|---|---|---|---|---|---|
| **F-1** | 1 + 5 — username-bearing absolute path, tool-internal job path | `spikes/residency-debt-fix-live-probe/probe-thrash.mjs:9`; introduced `fc0b49f` (2026-09-06 16:36 +0200, `chris <chrys92d@gmail.com>`) — 34 days after the flip, in public history | `const OUT = "C:\\Users\\Christopher\\.claude\\jobs\\53e23d1b\\tmp\\probe-thrash.json";` | **sensitivity-class match** — the first and only hit ever in the class both prior sweeps defined ("username-bearing absolute paths") and found empty. Impact low: the Windows account name equals the author's first name, already public in every SPDX header and commit identity; the incremental disclosure is "account name = first name" plus a Claude Code job-directory layout and one job id. Not a credential. The human may reasonably call it a minor leak; the label is not inflated here. | Fix forward: replace the constant with a relative/derived path (e.g. next to the script or under `target/`); record as note 6 in `PRE-PUBLIC-CHECKLIST.md` §6 that the string stays in public history (a history rewrite is a named red line). |
| **F-2** | 5 — tool-internal worktree path | same file, line 5 | `import { attachOrLaunch } from "file:///C:/dev/spatial-ide/.claude/worktrees/residency-debt-fix/frontends/shell/e2e/lib.mjs";` | **hygiene** — a `.claude/worktrees/<name>` absolute import; the script cannot run from a clean clone. No username, no machine name. | Make the import relative (`../../frontends/shell/e2e/lib.mjs`); same fix-forward commit as F-1. |
| **F-3** | 6 — private-audience statement **baked into product output** | `frontends/shell/src-tauri/src/publish.rs:810-817`; introduced `3bd479b` (2026-08-16), 13 days after the flip | comment: `// WrittenOffer, not a URL: this repository is not yet public (ADR-009 item 1's gate;` … string written into every shell-published bundle's `viewer_license.corresponding_source`: `"Corresponding source is available from Christopher Donini on written request; this repository is not yet public."` | **hygiene** (record correctness in a distributed artifact) — not a leak, but the highest-priority correction here: every bundle the shell publishes asserts a falsehood in its license notice, and the reason given for choosing the written-offer route (no durable public location) has not held since 2026-08-03. ADR-009-adjacent (AGPL corresponding-source route), so red-lined to the human. Mitigating fact, from ADR-017:828-831 (dated 2026-08-07): bundles live under git-ignored `target/` and "no bundle has been distributed outside this repository" — the affected population may be empty. | Human rules: (a) switch to `CorrespondingSourceKind::Url` naming the public repository (ADR-017 Corrigendum 3's durable route), or (b) keep `WrittenOffer` and delete the "not yet public" clause. Either way the writer comment, the string and any tests change together (ADR-017's two-sided discipline). |
| **F-4** | 6 — stale private-status statement in an accepted (immutable) ADR | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:833-834` (text dated "As of 2026-08-07" at :828) | `The repository is not public — ADR-009's pre-public checklist gates that, and this corrigendum is item 3 of it.` | **hygiene** — false when written (four days after the flip). `914ef9f` corrected ADR-009, docs/07, docs/14, docs/README, CLAUDE.md, AI_DEVELOPMENT.md, PRE-PUBLIC-CHECKLIST and DECISIONS-PENDING but did not touch ADR-017. The corrigendum's empty-population argument rests on bundles never leaving the machine, not on repository privacy, so the *decision* is unaffected; only the sentence is wrong. | Append a dated correction note to ADR-017 in the same form as ADR-009's corrigendum (append-only; never edit the accepted text). |
| **F-5** | 6 — stale private-status instruction | `MACOS-BRINGUP.md:53` | `5. **Git access to the private repo.** This repository is private — either:` | **hygiene** — false since 2026-08-03; the step tells the operator to set up auth for a clone that needs none (auth is still needed to push). | Dated correction: "public; auth needed only to push". |
| **F-6** | 6 — self-contradiction inside the 2026-09-07 correction itself | `docs/README.md:27` (one very long line) | the ADR-009 parenthetical now reads `*dated correction 2026-09-07: the repository was already public when this was accepted … see the ADR's corrigendum*` and, later in the same parenthetical, still: `**its pre-public checklist still gates the repository going public**` | **hygiene** — the correction and the sentence it corrects sit in one parenthetical, and the uncorrected clause comes last. | Mark the trailing clause historical or strike it with a dated note (house style). |
| **F-7** | 1 — real OS account name in a test fixture | `kernel/src/permission/audit/reader.rs:331` and `:334`; introduced `cd3cf1c` (2026-08-17) | fixture JSONL lines contain `"grantor_kind":"os-user","grantor_name":"Christopher"` (twice) | **sensitivity-class match** (username), low — same first name as the public copyright line; the sibling fixtures in `normalize.rs` use `someone`. | Rename the fixture grantor to a neutral name (`someone`); tests only, no behaviour change. |
| **F-8** | 1 — real OS account name in a code comment | `frontends/shell/e2e/admission-remediation.mjs:245`; introduced `77aa1e2` (2026-08-18) | `// live (2026-08-18): "os-user Christopher" broke a \`(\S+)\` capture that assumed no spaces.` | **sensitivity-class match** (username), low — documents a real observed audit-log value. | Reword to `"os-user <name>"`. |
| **F-9** | 1 — real name in a doc-comment example (previously reviewed) | `kernel/src/permission/audit/normalize.rs:142`; introduced `55c7683` (2026-08-07) | `/// The boundary condition is what stops \`C:/Users/Christopher2\` becoming \`<user-home>2\`: a prefix` | **sensitivity-class match**, judged **not a leak on 2026-08-18** (`.cut-archive/CUT-STATE-adr009-checklist.md:66-69`: "the real username is the natural illustrative example for its own design note … Left as-is"). Listed so the class is complete; the same file's test at `:232` uses `someone2`. | Optional: use `someone2` for consistency. No action required. |
| **F-10** | 8 — scaffold artifact carrying the first name (not named by either prior review) | `spikes/adr-003-crs-rendering/app/src-tauri/tauri.conf.json:5`; introduced `d8470c5` (2026-08-01, pre-flip, public since the flip) | `"identifier": "com.christopher.app",` | **sensitivity-class match**, trivial — a `create-tauri-app` default identifier built from the login name; the same scaffold's `Cargo.toml:4-5` still reads `description = "A Tauri App"` / `authors = ["you"]` (PRE-PUBLIC-CHECKLIST §6 note 2). Throwaway spike. | None required; optionally normalise to `dev.spatialide.spike` when the spike is next touched. |
| **F-11** | 4 — remote-access operational detail | `frontends/shell/e2e/rustdesk-guard/{README.md, arm-rustdesk-guard.ps1, disarm-rustdesk-guard.ps1, restore-rustdesk.ps1, rustdesk-watchdog.ps1, check-display-session.ps1, .gitignore}` (added for the 2026-09-04 dry-run), plus RustDesk mentions in `AI_DEVELOPMENT.md:23`, `DECISIONS-PENDING.md` (17 lines), `frontends/shell/MANUAL-WALKTHROUGH.md` (19), `frontends/shell/RESULTS.md` (14), `RESIDENCY-PREREGISTRATION.md` (5), `RESIDENCY-DEBT-1B.md`, `ADR-017:1115`, `spikes/entry40-producer-hang-diagnosis/{README,PASS-PREREGISTRATION}.md`, `spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md` — 17 tracked files | Disclosed, verbatim: `Get-Service -Name RustDesk` (`restore-rustdesk.ps1:17`); `$exe = "C:\Program Files\RustDesk\rustdesk.exe"` (`:26`); `[string]$TaskName = "RustDeskRestoreBackstop"` and `[string]$StateDir = "$env:TEMP\rustdesk-guard"` (`arm-rustdesk-guard.ps1:23-24`); a SYSTEM scheduled task (`:45` `-UserId "SYSTEM" -RunLevel Highest`); `AI_DEVELOPMENT.md:23` `The human operates remotely (phone → RustDesk → this machine) for extended periods.`; `AI_DEVELOPMENT.md:156-157` `Windows Update auto-restart must stay disabled during remote periods`; `README.md:61-62` `On this machine monitor-timeout-ac was already 0 before arming.` **Independently confirmed absent** (tree grep + window pickaxe, terms in §2): RustDesk ID, permanent password, relay/rendezvous server, `RustDesk2.toml`/config paths, API server, any 9-digit number near "rustdesk". | **sensitivity-class match** (operational detail), low; **no credential**. Assessment: a reader learns that one developer's Windows machine runs RustDesk as an inbound service, is left unattended for long windows with remote access up, has automatic updates' restart disabled, and has a named SYSTEM task that re-enables the service. Connecting to a RustDesk endpoint still requires its ID plus password (or a live accept); neither the ID, a password, a relay nor an IP is anywhere in the tree or window history. The service/task names would help only an attacker who already has code execution on the machine — who no longer needs help. Residual: targeting/phishing context (which remote-access product the operator relies on). The 2026-08-18 pass reached the same reading for the then-existing mentions ("operational method disclosure … not a secret or personal-data leak"). | Human decides: (a) accept as public-by-design custodian process (recommended reading), and/or (b) parameterise `-ServiceName`/`-ExePath` in the scripts and drop `README.md:61-62`'s "On this machine" sentence — cosmetic, since the product name is in 17 files and all history. Consider whether `AI_DEVELOPMENT.md:156-157` (updates' auto-restart disabled) should be generalised. |
| **F-12** | 6 — personal-circumstance prose | (a) `AI_DEVELOPMENT.md:23` and `:149`; (b) `PRE-PUBLIC-CHECKLIST.md:40`, `:326`, `:344`, `:416`, `LICENSES/README.md:35-36`, `frontends/shell/CANCELLATION-FACTS.md:179`; (c) `DECISIONS-PENDING.md:1056`; (d) `kernel/FIXTURES.md:74`, `DECISIONS-PENDING.md:359`, `MACOS-BRINGUP.md:3` | (a) `phone → RustDesk → this machine` / `The human reads it from a phone; brevity is a feature.` (b) `the operator was on a metered connection: no installs, no fetches, no toolchain or browser downloads` (LICENSES/README.md:35-36; the same clause at PRE-PUBLIC-CHECKLIST.md:40); `⚠ Bandwidth, read first:` (CANCELLATION-FACTS.md:179). (c) `scheduled to run only after tonight's sitting closes` (a dated 2026-09-02 entry). (d) `a diskmgmt check found ONE physical disk (512 GB NVMe), only C:, no external/removable volume — so no second PHYSICAL location exists to copy to` (FIXTURES.md:74); `the human, sitting at the 2019 MacBook Pro 13"` (MACOS-BRINGUP.md:3). | **sensitivity-class match** (personal circumstances), low. None is health, home address, or availability schedule — the brief's example terms (sick, hospital, holiday, home address, session times as personal schedule) returned zero hits. (d) is the one worth a look: it states the machine has a single disk and the 5 GB fixture has no backup — a data-loss-posture disclosure, not needed for reproducibility (the measurement profile itself — i9-9980HK, 63.7 GiB, UHD 630/GTX 1650 — is docs/08-required and by design). | Acknowledge as custodian-process context (recommended), optionally generalising "metered connection" → "bandwidth-constrained", "from a phone" → "on a mobile device", and the single-disk/no-backup sentence → "no second physical location available". |
| **F-13** | 5 — working-tree stray (not a leak) | repo root, **untracked and ignored**: `C:UsersCHRIST~1AppDataLocalTempclaudeC--dev-spatial-ide919296df-bbc7-4854-a110-bb7af4112d4escratchpadphase8-console.log` and `…phase8-console-2.log` (2026-08-13 09:02/09:05; the leading `C:` is U+F03A, a flattened path separator) | *paraphrase:* two files whose **names** are a flattened Claude Code scratchpad path carrying the 8.3 profile short name `CHRIST~1` and a session UUID. `git ls-files` → not tracked; `git check-ignore -v` → `.gitignore:21:*.log`; never added in any window commit (`git log --since=2026-08-03 --diff-filter=A` for `*.log` → none). | **hygiene** — never left the machine. | Delete the two files. No repository action; `.gitignore` already covers them. |
| **F-14** | 1 (non-personal variant) — absolute checkout paths | 18 tracked files, e.g. `frontends/shell/e2e/regression.mjs:31-36`, `frontends/shell/e2e/admission-remediation.mjs:50-56`, `frontends/shell/e2e/residency-field-sequence-identity-gate-evidence.json` (`"fixturePath"` ×7), `frontends/shell/MANUAL-WALKTHROUGH.md` (18 lines) | e.g. `const FIXTURE_100K = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";` | **hygiene** — `C:\dev\spatial-ide` names a checkout location, not a user directory or machine; meets the 2026-08-07 standard ("No path names a user directory or this machine"). Portability already acknowledged (`MACOS-BRINGUP.md:128` tells the Mac operator to translate them). | None for audience. Portability is a separate, already-known item. |
| **F-15** | 8 — third-party scaffold files, second instance | `frontends/shell/src-tauri/icons/{128x128.png, 128x128@2x.png, 32x32.png, icon.icns, icon.ico}`; added `f827be0` (2026-08-09) | *paraphrase:* all five blobs are hash-identical to the spike's `create-tauri-app` default icons (`git rev-parse HEAD:<path>` compared pairwise — identical). | **none** — the same note as PRE-PUBLIC-CHECKLIST §6 note 2 (Tauri templates are MIT/Apache-2.0), now also in the product tree. | Replace with project icons before any release build; no audience action. |
| **F-16** | 7 — third-party data terms (EPSG), second copy | `engine/src/crs-catalog.json` (added `6b80e95`, 2026-08-18); compiled in via `engine/src/crs_catalog.rs:31` `include_str!("crs-catalog.json")` | *paraphrase:* the catalog's single entry (`"id": "epsg-2056"`, `"authority": "EPSG"`, `"code": 2056`, `"name": "CH1903+ / LV95"`) embeds the same PROJJSON definition as `engine/tests/data/epsg2056.projjson`, which PRE-PUBLIC-CHECKLIST §6 note 3 flagged for "one look" under the IOGP terms. | **sensitivity-class match** (third-party data terms, as the prior review named the class) — not personal data. New fact: the definition now ships in the product, not only in a test. No datasets are tracked (see §2). | The already-queued EPSG/IOGP "one look" now covers a shipped artifact; add EPSG attribution to the catalog if the terms require it. Counsel per ADR-009's Caveat. |
| **F-17** | 3 — commit identities and their appearance in text | window authors: `Christopher Donini <donini.christopher@gmail.com>` 219, `chris <chrys92d@gmail.com>` 176, `christopherdonini <donini.christopher@gmail.com>` 9 (GitHub web merges, committer `GitHub <noreply@github.com>` 9). In tracked text: `DECISIONS-PENDING.md:230-261` (entry 41/39 remediation-commit record), `:790`; `PRE-PUBLIC-CHECKLIST.md:234`. In subjects: `dbcc161` and `536ceb9` (`DCO Remediation Commit for … <email>`, the DCO convention). | e.g. `PRE-PUBLIC-CHECKLIST.md:234`: `` `donini.christopher@gmail.com` (172 commit/committer records) and `chrys92d@gmail.com` (12). `` | **none** — public commit identities (DECISIONS-PENDING entry 14, resolved 2026-09-07: "both identities have been public commit authors for over a month; acknowledged"). All commit timestamps carry `+0200` — inherent to git. | None. |

**Three most important, one line each:**
1. **F-3** — the shell's publish path writes `this repository is not yet public` and a written-offer
   source route into every bundle's license notice; false since the flip and ADR-009-adjacent — the
   human's ruling on the route, then a two-sided fix.
2. **F-1** — `probe-thrash.mjs:9` carries `C:\Users\Christopher\.claude\jobs\…` — the first hit ever
   in the username-path class the prior sweeps defined, committed 2026-09-06 to an already-public
   repository; fix forward, no rewrite.
3. **F-11** — the RustDesk guard scripts and notes disclose the remote-access product, its
   service/task names and the unattended-operation pattern; no ID, password, relay or IP anywhere
   (confirmed by tree grep and window pickaxe) — accept as process or parameterise, the human's call.

---

## 2. Cleared — classes searched, nothing found (search terms given for reproduction)

All commands run at HEAD `914ef9f`, window `--since=2026-08-03`.

- **Machine names / hostnames.** `git grep -n -i 'DESKTOP-'` → exactly two hits, both
  `"$schema": "../gen/schemas/desktop-schema.json"` (`frontends/shell/src-tauri/capabilities/default.json:2`,
  `spikes/adr-003-crs-rendering/app/src-tauri/capabilities/default.json:2`) — Tauri schema
  filenames, not hostnames; this accounts for the brief's "2 tracked files match `DESKTOP-`".
  `git grep -n -E 'Dell-XPS|XPS-15|COMPUTERNAME|hostname'` → only the redaction scanner reading
  the `COMPUTERNAME`/`HOSTNAME` env keys (`kernel/src/bundle/redaction.rs:127`) and prose about
  scanning for hostnames. Pickaxe `-S'DESKTOP-'`, `-S'Dell-XPS'` over the window → zero. IP
  regex `\b([0-9]{1,3}\.){3}[0-9]{1,3}\b` → only `150.0.0.0`/`151.0.0.0` (Edge version strings such
  as `150.0.4078.105`), no real address. UNC paths `\\\\<host>\` → none (only escaped-string tests).
- **Username-bearing paths beyond F-1/F-7/F-8/F-9.** `git grep -n -I -i -E
  'C:[\\/]+Users[\\/]|/c/Users/|CHRIST~1|%USERPROFILE%|\$env:USERPROFILE'` → remaining hits are
  fixtures/placeholders (`someone`, `someuser`, `José`, `<you>`) in `kernel/src/permission/audit/normalize.rs`,
  `kernel/src/bundle/redaction.rs:417`, `frontends/shell/MANUAL-WALKTHROUGH.md:309`,
  `kernel/PERMISSION-BOUNDARY.md:190`, `kernel/src/permission/audit/log.rs:9`. Pickaxe:
  `-S'Users/Christopher'` → `55c7683` only (F-9); `-S'Users\\Christopher'` (escaped form) →
  `fc0b49f` only (F-1); `-S'CHRIST~1'` → zero; `-S'USERPROFILE'` → `55c7683`, `9dd3915` (the env-var
  *name* in `normalize.rs`, never a resolved path). Full-window `git log -p` grep of added/removed
  lines for `C:\Users|C:/Users|/c/Users|CHRIST~1|DESKTOP-|\.claude[\\/]+jobs|AppData\Local\Temp\claude|\.claude[\\/]+worktrees|USERPROFILE`
  → only F-1/F-2, F-9, the `<you>` placeholder in the walkthrough's G6 row (`066a3cd`, `29005d4`),
  and `.claude/worktrees` mentions in `AI_DEVELOPMENT.md` (`0ffbbb7`), a preregistration table
  (`cc753af`) and a `Cargo.toml` comment (`fbe1f96`). **Nothing was introduced and later removed**
  in this class.
- **Tool-internal temp/job/scratchpad paths.** `git grep -n -I -i -E
  '\.claude[\\/]jobs|AppData[\\/]+Local[\\/]+Temp|Temp[\\/]+claude|scratchpad|\.claude[\\/]projects|claude-code-scratch'`
  → F-1 plus the redaction/normalize needle strings (`AppData\Local\Temp` as a *class*). Pickaxe
  `-S'.claude/jobs'`, `-S'.claude\\jobs'`, `-S'Temp\\claude'`, `-S'scratchpad'` → zero except F-1's
  commit. `git grep -E 'session_01[A-Za-z0-9]{20,}|claude\.ai/code/session'` (tree) → zero.
- **Credentials.** Tree: `git grep -n -I -i -E 'api[_-]?key|secret[_-]?key|access[_-]?token|Bearer [A-Za-z0-9]'`
  over `*.rs *.ts *.tsx *.mjs *.ps1 *.toml *.json *.yml` → every hit is the redaction scanner's own
  needle list or its tests (`kernel/src/bundle/redaction.rs:147-148,152,416,469`,
  `kernel/tests/permission_boundary.rs:724,732`, `kernel/tests/scale_pass.rs:868-873`,
  `frontends/shell/e2e/publish.mjs:78-79`). Window pickaxe: `BEGIN PRIVATE KEY`, `BEGIN OPENSSH`,
  `AKIA`, `ghp_`, `github_pat_`, `sk-ant`, `sk-proj`, `xoxb-`, `AIza` → zero; `BEGIN RSA` → `8a1f3ea`
  only, which adds `("BEGIN RSA", "credential"),` to the needle list (read); `password`/`passwd` →
  nine commits, all in the redaction/permission-boundary/scale-pass family — the HEAD sites were
  read and are needle lists, tests and prose about them; the nine per-commit diffs were not each
  re-read. Credential-named tracked files: `git ls-files | grep -i -E '(^|/)\.env|\.(pem|key|p12|pfx|jks|kdbx)$|id_rsa|id_ed25519|credentials|\.netrc|\.npmrc|\.pypirc'`
  → **one**, `frontends/shell/.env.measure` (added `37af344`, 2026-08-31): a Vite `--mode measure`
  file whose only assignment is `VITE_MEASURE_BUILD=1` under an SPDX header and an explanatory
  comment — a build flag, not a secret. Noted because the 2026-08-07 review stated "No `.env` …
  has ever existed"; that sentence is now literally false but the file is harmless.
- **RustDesk configuration.** Tree and window pickaxe for `rendezvous`, `relay-server`, `hbbs`,
  `hbbr`, `RustDesk2.toml`, `RustDesk.toml`, `rustdesk_id`, `permanent-password`, `api-server` →
  zero; `git grep -i -E 'rustdesk.{0,80}\b[0-9]{9}\b|\b[0-9]{9}\b.{0,80}rustdesk'` → zero;
  window `-p` grep for RustDesk lines containing `id|password|relay|rendezvous|hbbs|hbbr|key=|.toml|config|[0-9]{9}`
  → only a walkthrough row (`J2`) that says Notepad "reaches the desktop fine". The guard's runtime
  log is gitignored (`frontends/shell/e2e/rustdesk-guard/.gitignore:3` `rustdesk-guard.log`) and
  was never added (`--diff-filter=A` for `*.log|heartbeat|rustdesk-guard.log|e2e/out/|harness-[0-9]`
  → none).
- **Personal emails.** Tree regex `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}` → the two
  identities (F-17), `you@example.com`/`jane@example.com` (`CONTRIBUTING.md:24,40-41`),
  `git@github.com` (`MACOS-BRINGUP.md:65` clone URL) and `128x128@2x.png` (a filename). The same
  regex over every added/removed line in the window → the same set. **No third personal address.**
- **Personal-life vocabulary** (`*.md`, `*.txt`, case-insensitive, word-bounded):
  `laptop|metered|tonight|tomorrow|sick|ill|tired|bed|asleep|sleeping|wife|husband|partner|family|kids?|child|children|birthday|hospital|doctor|holiday|vacation|abroad|flight|travel(l)?ing|commut(e|ing)|day job|at work|from work|the office|my office|weekend|phone|mobile|wifi|hotspot|bandwidth|timezone|CET|CEST|jet ?lag|dinner|lunch|breakfast|coffee|gym|apartment|flat|house|living room|bedroom`
  → every hit read; all technical ("in-flight", "data doctor", "family of tests", "flat" memory,
  the AGPL text's "personal, family" clause, "birthday-style coincidence" as a statistics idiom)
  except F-12's items and `laptop` at `frontends/shell/MANUAL-WALKTHROUGH.md:956,966` ("the
  operator re-tested at the laptop directly" — the reference machine itself, an H-series mobile
  CPU; not flagged). `home` (word) → all "home of record"/user-home. `hours`/time-of-day framings →
  durations and process ("hung 16 hours … a night of wall clock", `AI_DEVELOPMENT.md:188-189`).
  `away|unavailable|overnight|asleep|back at the machine|human's return` → the away-mode evidence
  rule (`AI_DEVELOPMENT.md:139-144`) and "session spanned an overnight pause"
  (`MANUAL-WALKTHROUGH.md:1011`) — process, by design. **Zero** hits for health, home address,
  travel, or a personal schedule.
- **Commit messages in the window** (`%s` and `%b`), grepped for `C:\Users|C:/Users|/c/Users|CHRIST~1|DESKTOP-|@gmail|\.claude[\\/]jobs|AppData|Temp\\claude|rustdesk|laptop|metered|tonight|tomorrow|sick|home\b|hospital|doctor|holiday|vacation|birthday|phone`
  → only `Signed-off-by:`/DCO-remediation identity lines and `Co-Authored-By: Claude …` trailers.
  Subjects mentioning public/private: `914ef9f`, `8a69260`, `875e1e0`, `4705d99`, `69786ef` — all
  about the checklist itself.
- **Files deleted inside the window** (still in public history): `NEXT-CUT.md` (read at `bc69648^`,
  183 lines), `protocol/transport-bakeoff/scripts/verify-phase3.mjs` (`673a1c3^`, 328 lines),
  `docs/adr/PROPOSED-amendment-3-to-ADR-028-partial-covering-eviction-withdrawn.md` (`6f86e87^`,
  86 lines) — each grepped for `C:\Users|C:/Users|CHRIST~1|DESKTOP-|rustdesk|phone|laptop|metered|tonight|@gmail|\.claude[\\/]jobs`
  → zero.
- **Datasets / third-party data files.** `git ls-files | grep -i -E '\.(parquet|geojson|gpkg|shp|osm|pbf|csv|jsonl|log|arrow|feather|sqlite|db)$'`
  → none; `.gitignore` covers `spikes/**/data/`, `*.arrow`, `*.parquet`, `*.log`. Window
  `--diff-filter=A` for artifact-like extensions → only lockfiles, license texts, Tauri config,
  SKP/renderer test JSON, 24 `protocol/transport-bakeoff/results/**/bakeoff-report-*.json`, one
  residency evidence JSON and `probe-thrash.json` (113,608 B). The 24 bake-off reports, the evidence
  JSON and `probe-thrash.json` were grepped for `Users|hostname|"host"|"user"|DESKTOP|Christopher|C:\`
  → only the evidence file's `fixturePath` values (F-14). `kernel/FIXTURES.md` names generators and
  hashes only; `engine/src/fixture.rs` attributions are `"(c) Example Cadastre"`.
- **`.claude/` tracked content.** Only `.claude/agents/{architect,reviewer,tester,worker}.md`;
  grepped for `phone|rustdesk|remote|human|christopher|laptop` → nothing personal.
  `.claude/settings.local.json`, `.claude/worktrees/`, `.cut-archive/`, `CUSTODIAN-LEASE` are all
  ignored (`.gitignore`), the last named there as carrying "a session id, never committed".
- **Stale private-status statements other than F-3/F-4/F-5/F-6.** `git grep -n -i -E 'before (the )?(repo(sitory)? )?(goes|going|is made|becomes|becoming) public|not (yet )?public|still private|pre-public|once public|going public|flip(ping)? (the repo(sitory)? )?public|public flip'`
  → the rest are either corrected by `914ef9f` with dated notes (ADR-009, docs/07, docs/14,
  docs/README, PRE-PUBLIC-CHECKLIST, DECISIONS-PENDING 12–15, CLAUDE.md's red line in
  AI_DEVELOPMENT.md) or historical references to "the pre-public checklist" by name
  (`.github/workflows/dco.yml:4`, `.github/workflows/product-ci-rust.yml:68`, `DEPENDENCY-LICENSES.md:5,75`,
  `LICENSES/README.md:6-7,72-73`, `scripts/audit-dependency-licenses.mjs:6,121,182,433`,
  `kernel/PERMISSION-BOUNDARY.md:467`) — accurate as history. `kernel/tests/scale_pass.rs:72` "are
  not public" is Rust visibility.
- **Measurement-profile hardware** (`kernel/RESULTS.md:17` et al.: `Intel Core i9-9980HK @ 2.40 GHz
  · 8 cores / 16 threads · 63.7 GiB RAM · Windows 10 Pro 22H2 build 19045`; UHD 630 / GTX 1650) —
  docs/08 requires a defined machine; by design, not flagged. The operator's first name in the
  walkthrough result logs (`the human (Christopher)`, 8 sites) and the operator's verbatim words
  are the process's evidence class — not flagged.

---

## 3. Not in scope / cannot determine

- **External copies.** Whether forks, clones, search-engine caches or archive crawlers captured
  any of the above between 2026-08-03 and now. Any fix-forward removes content from HEAD, not from
  public history or third-party mirrors; this audit cannot see those.
- **`Claude-Session:` trailers.** 172 of the 405 window commits carry
  `Claude-Session: https://claude.ai/code/session_…` trailers (tool-generated attribution). Whether
  such a URL resolves for anyone other than the account owner is not determinable from the
  repository; no action proposed.
- **GitHub-side, non-git content.** Actions run logs (e.g. the runs cited in
  `PRE-PUBLIC-CHECKLIST.md`), PR descriptions and PR comments (#3–#23, including the human's
  retroactive DCO certifications on #16 and #22), issues, wiki, discussions — public with the
  repository, not in the tree, **not audited**.
- **Not a blob-by-blob re-read.** The 405 commits were swept by pickaxe and by a full-window
  `-p` grep for the named patterns — the same proportionality the 2026-08-18 delta sweep used. A
  personal detail phrased in words outside the term lists in §2 would not have been caught.
- **`protocol/transport-bakeoff/web` dependency audit gap** — ADR-009 item 4 territory, unchanged,
  not an audience question.
- **Whether the RustDesk product name should be redacted going forward** (F-11 option b) and
  **whether the operator's first name should appear in result logs** — preferences for the human,
  not leaks.

---

## 4. Proposed `DECISIONS-PENDING.md` entry (draft; not applied)

**49. [Public-audience audit of the 2026-08-03→2026-09-07 window: 0 leaks, 8 sensitivity-class
matches, 7 hygiene items — three need your ruling, the rest are fix-forward on your word.]**
`PUBLIC-AUDIENCE-AUDIT.md` swept 405 commits (`914ef9f`) and the tracked tree for the classes the
2026-08-07/08-18 pre-public sweeps defined, plus private-audience prose. No credential, no
third-party personal data, no RustDesk ID/password/relay anywhere in tree or history. Rulings
needed: **(1) F-3** — `frontends/shell/src-tauri/src/publish.rs:810-817` writes `"…this repository is
not yet public."` and a written-offer corresponding-source route into every shell-published
bundle's license notice — switch to the `Url` kind naming the public repository, or keep
`WrittenOffer` and drop the clause? (ADR-009-adjacent; writer + tests change together.) **(2) F-11**
— the `rustdesk-guard` scripts and 12 notes files name the remote-access product, its service
(`RustDesk`), the SYSTEM task (`RustDeskRestoreBackstop`) and the unattended-operation pattern —
accept as public-by-design process, or parameterise the names? **(3) F-12(d)** — keep or generalise
the single-disk/no-backup sentence (`kernel/FIXTURES.md:74`, `DECISIONS-PENDING.md:359`) and the
"metered connection"/"from a phone" wording? Fix-forward on your word, no rewrite (red line): **F-1/F-2**
`spikes/residency-debt-fix-live-probe/probe-thrash.mjs:5,9` (`C:\Users\Christopher\.claude\jobs\…`
output path and a `.claude/worktrees` import — relative paths; PRE-PUBLIC-CHECKLIST §6 note 6 for
the history copy); **F-7/F-8** neutral fixture/comment names in `kernel/src/permission/audit/reader.rs:331,334`
and `frontends/shell/e2e/admission-remediation.mjs:245`; **F-4/F-5/F-6** dated correction notes in
ADR-017:833 (append-only), `MACOS-BRINGUP.md:53`, `docs/README.md:27` (the corrected parenthetical
still ends "still gates the repository going public"); **F-16** the EPSG/IOGP "one look" now covers
a shipped artifact (`engine/src/crs-catalog.json`). Recommendation: (1) `Url` route to the public
repository — the durable location ADR-017 C3 wanted now exists; (2) accept, optionally
parameterise; (3) generalise the three sentences. Touches, once ruled: the files named above; no
ADR text edited (ADR-017 gets an appended note only); no history rewrite.

---

*Audit performed read-only against HEAD `914ef9f` on 2026-09-07. The two prior sweeps this one
models itself on: `PRE-PUBLIC-CHECKLIST.md` §6 (2026-08-07, 632 blobs / 92 commits) and
`.cut-archive/CUT-STATE-adr009-checklist.md` (2026-08-18, delta re-sweep to 239 commits).*
