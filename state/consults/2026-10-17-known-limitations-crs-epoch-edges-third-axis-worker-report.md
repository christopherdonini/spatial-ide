*Custodian's filing note (2026-10-17): the worker's report for `known-limitations-crs-epoch-edges-third-axis` (item 44), in C:/dev/wt/kl44 from e555177c; the head 61c64a8f25dca9b5af012e237b5849513ead5070, pushed and checked by the custodian (porcelain empty; local equals origin; one commit, 4 lines in and 0 out; the three lines equal the form's §A lines byte for byte, the bracket aside; the source comment's 22 pins recomputed at their revs, none differing). The run 2026-10-17T07:32:37Z to 2026-10-17T07:52:50Z by its transcript (Bash 12, Read 1, Monitor 1, Write 1); its one SubagentHandback call, at 07:52:48Z. Extracted by script; 0 rooted path:line cite(s) de-rooted, each now `line N of <path> (on the branch)`; one final newline added; nothing else changed. The message's sha256 as handed back is 585557b4079c5e97143a7ad5477fbc5843381eb61ec239976743d497736d83db; this file's, from line 5 to the end, is 585557b4079c5e97143a7ad5477fbc5843381eb61ec239976743d497736d83db.*

---

KNOWN-LIMITATIONS item 44 is added on `cut/known-limitations-item-44` and pushed. The commit is 61c64a8f25dca9b5af012e237b5849513ead5070 on B = e555177c (confirmed as head, tree clean, `git fetch origin` rc=0). The push was a plain update, e555177c..61c64a8f, rc=0. `git status --porcelain --untracked-files=all` after the commit prints nothing.

**Change.** The script took §A's three lines byte for byte from the form at e555177c. Each occurred exactly once. It changed only the comment's bracket to `The human's wording, approved`, and inserted the lines after line 195 plus one empty line. The heading follows.
- `git diff --numstat` before commit showed `4 0 KNOWN-LIMITATIONS.md` and nothing else.
- `git diff --numstat e555177c...HEAD` (§21c's count) shows the same, 4 and 0, rc=0.

**Script.** Its full text is below. It is `kl44-apply.mjs`, standard library only, run once.
```js
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';
const die = (m) => { console.error('STOP: ' + m); process.exit(1); };
const form = execFileSync('git', ['show', 'e555177c:KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md'], { encoding: 'utf8', maxBuffer: 1 << 26 });
const lines = form.split('\n');
const pick = (pred, name) => { const h = lines.filter(pred); if (h.length !== 1) die(name + ' count ' + h.length); return h[0]; };
const col0 = pick((l) => l.startsWith('<!-- A line at column 0, so that item 44'), 'col0');
const item = pick((l) => l.startsWith('44. **'), 'item');
const brk = "[The human's wording, approved | The human's own words, given]";
let com = pick((l) => l.startsWith('    <!-- ' + brk), 'comment');
com = com.replace(brk, "The human's wording, approved");
const kl = fs.readFileSync('KNOWN-LIMITATIONS.md', 'utf8');
if (kl.includes('\r')) die('CR in KL');
const k = kl.split('\n');
if (!k[193].startsWith('    On main, fixed by')&&!k[193].startsWith('On main')) die('line 194: ' + k[193].slice(0, 40));
if (k[194] !== '') die('195 not empty');
if (k[195] !== '## On main since v0.1.0 — not in any release yet') die('196 heading');
const ins = [col0, item, com, ''];
k.splice(195, 0, ...ins);
fs.writeFileSync('KNOWN-LIMITATIONS.md', k.join('\n'));
for (const l of [col0, item, com]) console.log(crypto.createHash('sha256').update(l, 'utf8').digest('hex'));
const ns = execFileSync('git', ['diff', '--numstat'], { encoding: 'utf8' });
console.log(ns);
if (ns.trim() !== '4\t0\tKNOWN-LIMITATIONS.md') die('numstat');
```
Line 194 is indented four spaces and starts `On main, fixed by`. My check accepted that, and it matches item 42's on-main paragraph.

**sha256 of the inserted lines** (without newline):
- Column-0 line: 4dd93652df08cf31823ef4a6e446dc29662a420ab5c75fe503766dff6a0c33e7
- Item line, now at line 197: d9cf40f5d41edc62b6445f6eb785c8c90f98048a9ddaf82c9e54624a0db655df
- Source comment: 64cd495498c9dee78dfb2e2cc0b5e86e112c4ac37ea75688083a1bc71a98f821

**Number check (§D item 7).** Item 44 appears once at my head, at line 197. I searched `KNOWN-LIMITATIONS.md` at my head and in all 78 `origin/cut/*` branches, using `git show` and `grep -E '^ *(43|44)\. \*\*'`. Every branch counted 0, including `origin/cut/known-limitations-item-44`, which still held B's file when I searched. Item 43 is not claimed anywhere either. The list covers every `origin/cut/*` branch present after the fetch, from adr-032-staleness-docs to workspace-rustfmt.

**Verifiers** (each in the foreground, exit codes from a run not piped):

| Command | Exit code | Result |
|---|---|---|
| `verify.mjs` | 0 | PASS |
| `verify-cites.mjs` | 0 | PASS: 1958 files, 40 loose references advised |
| `verify-quotes.mjs` | 0 | PASS: 129 checked, 98 verified, 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | PASS: 570 tests |

`verify.mjs` had one failed run in the sequence: rc=124, hit my 600 s `timeout`. It was a rerun I made so the exit code would be captured unpiped. A solo rerun finished in 1m23s with rc=0, and an earlier piped run also passed. I did not find the cause.

I did not list verify-quotes' output for item 44's pins. The run had 0 hash-reference errors, but I did not check that each of the comment's pins was among those verified.

**Differences from the form or the brief.** None found. No heavy command ran, so no shared hold was used. I ran no `verify-mutation`.

**Model.** Sonnet 5.5, `claude-sonnet-5-5`, no override. I received and produced no context handoff.
