*Custodian's filing note (2026-10-19): the worker's report for `known-limitations-item-23-watcher-idle-end` (PR #230), in C:/dev/wt/kl23 from 71d16a11; the head f4db87382d031d2f9a24329ac7752e1d02e48bde, pushed. The run 2026-10-18T12:10:05Z to 12:14:59Z by its transcript (Read 1, Bash 10, Write 1); its one SubagentHandback call, at 12:14:59Z. Held in scratch while main was frozen, from (b) to PR #229's click. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed. Before the gate the custodian rebuilt the new lines from the form by script, byte for byte, and recomputed the 25 pins.*

---

Item 23 is replaced and pushed; every check passed.

**Head and commit:** the branch cut/known-limitations-item-23 started at B = 71d16a1170c6f44ec96b3692b416278df8d00f8c with a clean porcelain. The commit is f4db87382d031d2f9a24329ac7752e1d02e48bde, a single `docs:` commit with `-s`. The push to origin was ordinary and not forced, upstream set, exit 0.

**What changed:** lines 278-286 of KNOWN-LIMITATIONS.md (eight item lines plus the comment line) became the form's 14 item lines plus one comment line. The item lines lost their four-space indent. The comment line was kept with its four leading spaces. Its bracket became `The human's wording, approved`, and `Revised <date>:` became `Revised 2026-10-18:`, from `date -u +%F`. The numstat is 15 inserted and 9 deleted for KNOWN-LIMITATIONS.md and nothing else. `git diff --numstat 71d16a11...HEAD` gives the same, which is the §21c count.

**Script:** `kl23-apply.mjs` in my scratch folder. It is standard-library only, ran once, and exited 0. In full:
```
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';
const die = (m) => { console.error('STOP: ' + m); process.exit(2); };
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 28 });
const B = '71d16a11';
const form = git('show', B + ':KNOWN-LIMITATIONS-ITEM-23-WATCHER-IDLE-END-PREREGISTRATION.md').split('\n');
const date = execFileSync('date', ['-u', '+%F'], { encoding: 'utf8' }).trim();
const s1 = '    23. **Where the advisory watch';
const s2 = "    <!-- [The human's wording, approved |";
const i1 = form.map((l, i) => l.startsWith(s1) ? i : -1).filter((i) => i >= 0);
const i2 = form.map((l, i) => l.startsWith(s2) ? i : -1).filter((i) => i >= 0);
if (i1.length !== 1 || i2.length !== 1) die('start occurrences ' + i1.length + ' ' + i2.length);
let end = i1[0]; while (form[end] !== '') end++;
let item = form.slice(i1[0], end);
if (item.length !== 14) die('item lines ' + item.length);
item = item.map((l) => { if (!l.startsWith('    ')) die('no indent'); return l.slice(4); });
let c = form[i2[0]];
const br = "[The human's wording, approved | The human's own words, given | Drafted by the architect; accepted as it stands]";
const cnt = (s, t) => s.split(t).length - 1;
if (cnt(c, br) !== 1 || cnt(c, 'Revised <date>:') !== 1) die('bracket/date count');
c = c.replace(br, "The human's wording, approved").replace('Revised <date>:', 'Revised ' + date + ':');
const kl = git('show', B + ':KNOWN-LIMITATIONS.md').split('\n');
if (!kl[277].startsWith('23. **For a change the detector (item 19) can see,')) die('278');
if (!kl[285].startsWith('    <!-- frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:954')) die('286');
if (kl[286] !== '') die('287');
if (!kl[287].startsWith('24. ')) die('288');
const ins = [...item, c];
const out = [...kl.slice(0, 277), ...ins, ...kl.slice(286)];
if (out.some((l) => l.includes('\r'))) die('CR present');
fs.writeFileSync('KNOWN-LIMITATIONS.md', out.join('\n'));
console.log('date', date);
ins.forEach((l, i) => console.log(i + 1, crypto.createHash('sha256').update(l, 'utf8').digest('hex')));
const ns = git('diff', '--numstat').trim();
console.log(ns);
if (ns !== '15\t9\tKNOWN-LIMITATIONS.md') die('numstat');
```

**Date used:** 2026-10-18.

**sha256 of the 15 inserted lines**, each without its newline (lines 1-14 are the item, line 15 is the comment):
1. eabe2baae3d12ac216ecb6b2181656a59c17a5508096ef07b7c8339e818946ff
2. 9c92d1499248b169520aa79d27ce9eb5d0cad9facebe8c8996eb49acce6c51b8
3. 686c2ead781778ff4d5a7608fa854fabc21abea044008efae78b78733cc88854
4. d09ac9ceb4133901f469e9334d16a4397bdceb324bfb8f32f847f62391f37ac0
5. 18abf47040168fb0ec577cc5389a9f19c13da416f015fb23286f80c68e67ea79
6. d1cee2e8c4ab6b08d41131840c40e1459997a814303ab5bac623ba66d5992a4f
7. 1f11e6caa7e0a42c8ab12166e96478767219cae7e98ba87546a5c75b60cf005e
8. 499fed2bbd145b5a853408cab305494232f77c0554f9d80b61ba85e247917850
9. fb69c09aa1a967df0368564dc5a19fd2340017c91c21f276a2eab3e5c31a8049
10. 32e49a31c1f1d2fcfad099e634e3e4639afda591efe82b5c0f14cf896f147094
11. 5dfc703c103359d4c42cddd2bce02d0f95f832c9af47ac85de37040af4d797e8
12. 0ed0418fd35cd4318796cc1783d6c8b6cc28c0fbc7716386b37bf32bd9c3f39e
13. 77ef808f6bfb3521a01847c64f6ad99d48a967880093efa1fe44893ae678ab0b
14. 312ac37528f144766d70a82efcc16a2b3b4baf065057abfbab5881be8c01470a
15. 8df405e2f0ef8acc8f7ca6d4581272724a215d92c420986b6ebf3e10ba0a395d

**Outside-the-span comparison:** a script (`kl23-cmp.mjs`, exit 0) compared the file at B with the file at my head. Lines 1-277 and the lines from old 287 on are identical. The file went from 396 to 402 lines, which is 396 − 9 + 15.

**Commands and exit codes:**
- `git fetch origin`: 0
- `node kl23-apply.mjs`: 0
- `node kl23-cmp.mjs`: 0
- `scripts/plan/verify.mjs`: 0, PASS
- `verify-cites.mjs`: 0, PASS
- `verify-quotes.mjs`: 0, PASS, with 0 hash-reference errors
- `verify-test-claims.mjs`: 0, PASS
- `verify-quotes.mjs --show-cites KNOWN-LIMITATIONS.md`: 0
- `git commit -s -F`: 0
- `git push -u origin cut/known-limitations-item-23`: 0

**verify-quotes and the comment's pins:** the tool's output never names the comment's pins. The full run printed no KNOWN-LIMITATIONS.md line about them, and the `--show-cites` run printed 0 hash references. So I did not get the "verifies each pin" the brief asks for from the tool. I recomputed them myself: `kl23-pins.mjs` found 25 `path:line @ rev sha256` pins on the comment line, now line 292. I took each file's lines from `git show <rev>:<path>`, added an LF per line, and hashed. All 25 matched, 0 mismatches.

**Porcelain:** before the commit it was ` M KNOWN-LIMITATIONS.md` only; after the commit it printed nothing. The temp files are all in scratch.

**Differences from the form or the brief:** none. Every start occurred exactly once, and the line-278/286/287/288 assertions held. The only wrinkle is the verify-quotes one above.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it.
