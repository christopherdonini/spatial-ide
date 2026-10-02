# Worker report 1 — workspace-rustfmt (2026-10-02)

*Custodian's filing note: the worker's hand-back on the brief for PLAN node `workspace-rustfmt` (form `WORKSPACE-RUSTFMT-PREREGISTRATION.md`, committed 7b45af8), recorded verbatim below with the harness's report indentation removed. Rooted `path:line` cites into lines that exist only on the branch or the probe are de-rooted at filing to their basename. These are the verify-mutation checklist entries and E2's probe lines, and nothing else in the text is changed.*

*The custodian's checks:*
- *branch `cut/workspace-rustfmt` at c6d1414 (C1 6371d92, C2 c6d1414), read from origin;*
- *C1 has one parent and 0 non-`.rs` paths, with 133 files changed, 11,828 insertions and 3,428 deletions;*
- *C2 is the two declared files, 81 insertions;*
- *`.git-blame-ignore-revs` names C1's full id;*
- *run 37005634673 is a push run on `probe/rust-fmt-red`, failure;*
- *the probe branch was deleted on origin by the custodian after reading it.*

---

workspace-rustfmt report. Model: claude-sonnet-5-5 (Sonnet 5.5), no override, no context handoff. Piece complete, no invalidator fired. No PR opened (not asked).

COMMITS (both pushed on cut/workspace-rustfmt, signed off, 1 parent each)
- C1 6371d925a7f66b56dd66bb57d6e27a44dcdc0b11 "style: one mechanical cargo fmt pass (workspace and frontends/shell/src-tauri)"
- C2 c6d1414dc063364ffb8e46428d739922d7bafbc7 "ci: Rust fmt check workflow and .git-blame-ignore-revs naming the pass commit"
- Probe (not on the piece's branch): branch probe/rust-fmt-red, one commit "probe: one whitespace defect per scope (E2, never merged)", cut from C2. Not deleted.

P2: git diff --quiet 01b5ba0 a0f0da7 -- '*.rs' '*Cargo.toml' exit 0.
F1 at base: workspace --check exit 1, 2029 "Diff in" lines over 126 files; src-tauri --check exit 1, 105 lines over 7 files. Both match §0.
F2: porcelain listed 133 entries, all " M *.rs", nothing else.
C1 numstat: 133 files, +11828 / -3428. Non-.rs paths in a0f0da7..C1: 0.
F3 at C1: both --check exit 0.

§6 ITEM 4 (script run on a0f0da7 and C1 over verify-cites' default file set, md plus code exts)
base: A=1241 B=32 C=994 D=0. C1: A=1241 B=32 C=994 D=0 (C compares spans at base vs C1; D uses each rev's file lengths).
Note: C is high because most rooted cites into F land past a reflowed line. Script source (not committed, kept in scratchpad):
```
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const R = process.argv[2]; const BASE = process.argv[3], C1 = process.argv[4];
const lib = await import(pathToFileURL(path.join(R, 'scripts/plan/verify-cites.mjs')).href);
const git = (...a) => execFileSync('git', a, { cwd: R, encoding: 'utf8', maxBuffer: 1 << 28 });
const F = new Set(git('diff', '--name-only', BASE, C1).split('\n').filter(Boolean));
const show = (rev, p) => git('show', `${rev}:${p}`);
const lines = (rev, p) => { const a = show(rev, p).split('\n'); if (a[a.length-1] === '') a.pop(); return a; };
function measure(rev) {
  const files = git('ls-tree', '-r', '--name-only', rev).split('\n').filter(Boolean);
  const set = new Set(files); const byBase = new Map();
  for (const f of files) { const b = f.slice(f.lastIndexOf('/') + 1); if (!byBase.has(b)) byBase.set(b, []); byBase.get(b).push(f); }
  const index = { files, set, byBase }; const top = lib.topDirsOf(index); const tokens = [];
  for (const rel of files) {
    const ext = rel.includes('.') ? rel.slice(rel.lastIndexOf('.') + 1) : '';
    if (!(ext === 'md' || lib.CODE_EXTS.has(ext))) continue;
    let text; try { text = show(rev, rel); } catch { continue; }
    for (const c of lib.extractCitations(text, { commentsOnly: lib.CODE_EXTS.has(ext) })) {
      if (lib.classifyPath(c.pathRaw, top) !== 'rooted') continue;
      const { exact } = lib.resolveRef(c.pathRaw, rel, index);
      const hit = exact.filter((e) => F.has(e)); if (!hit.length) continue;
      tokens.push({ rel, c, target: hit[0], text });
    }
  }
  return tokens;
}
function afterOnLine(t) { const ln = t.text.split('\n')[t.c.citeLine - 1] ?? ''; const i = ln.indexOf(t.c.raw); return i < 0 ? ln : ln.slice(i + t.c.raw.length); }
for (const [label, rev] of [['base', BASE], ['C1', C1]]) {
  const toks = measure(rev); const A = toks.length;
  const Bs = toks.filter((t) => /^\s*@\s*\S+\s+sha256:/.test(afterOnLine(t))); const B = Bs.length;
  const nonB = toks.filter((t) => !Bs.includes(t));
  const span = (r, t) => lines(r, t.target).slice(t.c.startL - 1, t.c.endL).join('\n');
  const Cn = nonB.filter((t) => { try { return span(BASE, t) !== span(C1, t); } catch { return true; } }).length;
  const D = toks.filter((t) => Math.max(t.c.startL, t.c.endL) > lines(rev, t.target).length).length;
  console.log(label, rev.slice(0, 8), { A, B, C: Cn, D });
}
```
Run as: node cost.mjs <worktree> a0f0da7 6371d92.

CHECKS on head c6d1414 (tool last-change commits: verify-cites 522e448, verify-quotes f9444a4, verify-test-claims 57c626f, verify-mutation 7d24ed1, verify 2607202; scripts/plan and scripts/hooks last changed 01b5ba0)
- node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs": exit 0, 366 pass / 0 fail
- verify-cites exit 0 (1073 files); verify-quotes exit 0 (113 checked, 0 hash-reference errors); verify-test-claims exit 0 (463 claimed tests)
- verify-mutation --base origin/main --head HEAD: exit 1, "9 of 13 new test(s) have no recorded mutation". This is the §4 checklist, not an observation of any mutation. Listed: predicate.rs:2730; predicate_admission.rs:312, 433; grant.rs:682, 788; publish.rs:334; skp_admission.rs:273, 460, 564 (in engine/src, engine/tests, kernel/src/permission and kernel/tests). Each is a re-laid-out declaration line, F4 is the reviewer's proof.
- verify.mjs (timeout 570): exit 0 PASS

VERSIONS: rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14); rustc 1.97.1 (8bab26f4f 2026-07-14); git 2.49.0.windows.1; node v24.18.1.

§7 COUNT: git diff --numstat 6371d92 c6d1414 -- . ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**' gives 2 files: .git-blame-ignore-revs 2/0 and .github/workflows/rust-fmt.yml 79/0, total 81 changed lines, under the 120/2 budget.

E2: run id 37005634673, workflow "Rust fmt", event push on probe/rust-fmt-red, conclusion failure. Steps: checkout success, toolchain success, "cargo fmt --version" success, "cargo fmt --all --check (root workspace)" FAILURE, "cargo fmt --check (frontends/shell/src-tauri)" FAILURE (the if: !cancelled() let it run). Files named: root step "Diff in engine/src/lib.rs (line 74)", src-tauri step "Diff in frontends/shell/src-tauri/src/lib.rs (line 15)". Each step named only its own probe file. Prediction held. The probe's local --check printed 1 diff for the root scope before pushing.

§8 SELF-CHECK
1 C1 has one parent, non-.rs paths 0; tree-vs-reproduction is the reviewer's F4. 2 No .rs change after C1 on the branch (the probe is on its own branch). 3 C2 touches only the two §7 files. 4 Workflow: no extra trigger/path/if beyond §2 item 5; permissions contents: read only, no secrets reference; two actions only, checkout@v4 and rust-toolchain@stable with components: rustfmt; no cache step; no continue-on-error or || true; no ${{ }} inside run:; only the two §7 check commands. (`${{ }}` appears in concurrency and the step `if`, as the form declares.) 5 No other workflow edited. 6 No config, manifest or lockfile change. 7 No cite rewritten, no record edited. 8 Blame id is C1's full 40-hex. 9 P1 is the custodian's to record. 10 No squash/rebase/force-push; probe commit not on the piece's branch. 11 No user-profile path in diff or messages. 12 No verify-mutation observation claim. 13 No §7 overrun, form unedited. 14 No record written.
Caller rule: no pub item, callback or option landed. Seam: workflow into cargo fmt CLI, proven by E2 red (E1 is the PR's own green run, not yet run since no PR is open). Four failure classes: no cross-module interface touched; completion claims point to run ids and exit codes above; the workflow step names state facts only; E2 reached its assertion (both steps failed, each naming its own file). Not run: cargo test (per instruction), E1/E3.

DEVIATIONS: none from the form. cargo fmt --check output was written to a temp file outside the repo and not tracked. The .git-blame-ignore-revs comment line names the form and node. Off-scope noticed, not done: none.

STATE: worktree C:/dev/wt/workspace-rustfmt on cut/workspace-rustfmt at c6d1414, git status --porcelain empty, pushed (origin/cut/workspace-rustfmt = c6d1414). Probe branch probe/rust-fmt-red on origin for the custodian to delete.
