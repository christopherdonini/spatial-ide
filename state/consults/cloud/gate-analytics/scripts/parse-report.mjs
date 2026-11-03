// Finding extraction from one gate report under state/consults/gates/.
//
// A report is split into findings by the labels the gate agents themselves write. Two eras exist:
//   - from the proportional-gates direction (2026-10-05) most reports sort findings under
//     Correctness / Evidence / Documentation (AUTONOMY §22), labelled C<n>, E<n>, D<n> (also C-1, E-open-1, E1-r),
//     and a Documentation finding never fails a gate;
//   - before it, findings carry a severity label: B<n> (blocking), S1/S1-<n> (blocking), S2/S2-<n> (should fix),
//     F<n> (architect findings with a severity word), N<n> (nits/notes), S<n> under a "Suggestions" heading,
//     round-scoped labels such as G2-1 or G3-D1; and a documentation or record finding could fail a gate.
// A finding is a line that starts (after an optional list marker or heading marks) with such a label: bold, as a
// heading, or plain under a findings heading or lead-in. Its text runs to the next finding line or heading. Each
// label counts once per report (its first occurrence). Items that only report a check's outcome ("E2. Holds.",
// "B1 (X7): closed.", "S3 holds", "E1 to E8", "E4: ... rc 0") are not findings and are skipped.
//
// The class of a finding is STATED when it sits under a Correctness/Evidence/Documentation heading or bold lead-in,
// or carries a C/E/D label in a report sorted by those classes, or names its class in its own title. Otherwise the
// class is INFERRED by classify() below, a keyword rule whose agreement with the stated classes is measured by
// extract.mjs and printed in REPORT.md.
//
// The logged verdict (state/gate-log.json) is authoritative for whether a gate failed; the parser only says
// which findings, and of which class, a report carries.

export const PROPORTIONAL_FROM = '2026-10-05';

// Returns { ctx, blocking } for a heading or a bold lead-in's text.
export function headingContext(text) {
  const t = text.toLowerCase();
  const has = (re) => re.test(t);
  const notBlock = /non-?blocking|not blocking|no block|not a block|not a finding|does not block/.test(t);
  const blocking = /\bfail|\bblock(?!-on-sight)|blocking/.test(t) && !notBlock;
  if (has(/block-on-sight|blocks? on sight|§8|item by item|checklist|checks? \d|check results|what i checked|commands|exit codes|files read|state left|end state|^verdicts?\b|§22 verdicts/)) return { ctx: 'OTHER', blocking: false };
  const c = has(/correctness/), e = has(/\bevidence\b/), d = has(/documentation|record findings?|\brecord\b/);
  // "## Evidence (not a block)": the class's notes, not its findings.
  if (c + e + d >= 1 && notBlock && !d) return { ctx: 'NOTE', blocking: false };
  if (c + e + d === 1) {
    if (/\b(none|no findings?|pass(es)?|holds?)\b/.test(t) && !/must|blocking|fail|with notes|\(/.test(t)) return { ctx: 'NONE', blocking: false };
    return { ctx: c ? 'C' : e ? 'E' : 'D', blocking };
  }
  if (c + e + d > 1) return { ctx: 'F', blocking };
  if (has(/non-?blocking|not blocking|no action|no finding|not findings?|not a finding|checks? (that )?pass|passing|checked and passing/)) return { ctx: 'NOTE', blocking: false };
  if (has(/\bs1\b|blocking|^block\b|\bblocks?\b/)) return { ctx: 'BLOCK', blocking: true };
  if (has(/should.?fix|\bs2\b/)) return { ctx: 'SHOULD', blocking: false };
  if (has(/\bnits?\b|\bnotes?\b|suggestion|minor|observations?|for the human/)) return { ctx: 'NOTE', blocking: false };
  if (has(/findings?/)) return { ctx: 'F', blocking };
  return { ctx: 'OTHER', blocking: false };
}

const LABEL =
  '((?:C|E|D|B|F|S|N|Doc|DOC)(?:-open)?-?\\d+(?:[-.]\\d+)?[a-z]?(?:-r\\d*)?|S[12]|G\\d+-[A-Z]?\\d+|[A-Z]-open-\\d+)';
const END = '(?=[\\s.:,;)(—–\\-*]|$)';
const BOLD_LINE = new RegExp(`^\\s{0,3}(?:[-*]\\s+|\\d+\\.\\s+)?\\*\\*${LABEL}${END}`);
const HEAD_LINE = new RegExp(`^#{2,4}\\s+\\**${LABEL}${END}`);
const LIST_LINE = new RegExp(`^\\s{0,3}(?:[-*]\\s+|\\d+\\.\\s+)?${LABEL}(?=[.:)]|\\s\\(|\\s[—–-]\\s)`);
const LEADIN = /^\s{0,3}\*\*([^*]{2,200})\*\*/;
// Under a findings heading, any bold short label ("**X1. ...", "**W2 ...") opens a finding too.
const GENERIC_BOLD = /^\s{0,3}(?:[-*]\s+|\d+\.\s+)?\*\*([A-Z]{1,3}\d*-?\d+[a-z]?)(?=[.:)\s—–-])/;

// A title that only reports a check's outcome or a prior finding's closure.
const CLOSED_RE =
  /^[\w./-]+(?:\s*(?:\([^)]{0,60}\)|\/\s*[\w-]+))?\s*[.:,]?\s*(?:—\s*|-\s*)?(?:(?:is|was|are|now)\s+)?(?:holds?|closed|resolved|confirmed|discharged|passes|pass\b|passed|met\b|none\b|n\/a|ok\b|true\b|green|fixed|stands|satisfied|verified|correct\b|agreed|accepted|addressed|unchanged|carried|no finding|no change)/i;
const LIST_REF_RE = /^[\w-]+\s*(?:(?:to|and|,|–)\s*[A-Z]+-?\d+\w*\b|and\s|,\s*[A-Z]+-?\d+)/;
// A status line about an earlier item: "B8: open (B6 above).", "D-7 (...) is recorded as class 3 ... It carries forward."
const STATUS_RE = /^[\w./-]+(?:\s*\([^)]{0,60}\))?:?\s*(?:(?:still )?open(?=[.;,]|\s*\(|\s*$)|(?:is |was )?(?:recorded as|kept\b|carries forward|carried forward|in place|resolved at|disposed))|\bcarries forward\.?$|^(?:reviewer|architect|gate[- ]?\d)\s+[\w-]+:\s*(?:closed|resolved|open)\b/i;
// A title that reports a passing check ("E4: `node --test` ... rc 0: 527 tests", "C0: run ... completed success").
const CHECK_OK_RE = /\brc 0\b|\bholds?\b|\bpass(?:es|ed)?\b|\bgreen\b|\bmatch(?:es)?\b|as above|completed success|\bcleared\b|\bresolved\b|\bclosed\b/i;
const NEGATIVE_RE = /\b(?:not|no|never|fails?|failed|failing|missing|untrue|wrong|false|red|does not|doesn't|cannot|without|overclaims?|short of|stale|out of date|absent|unpinned|mismatch|lacks?)\b/i;
// A qualifier that says the item is not a gate-failing finding: a merge condition, a note, closed by this gate.
const NONBLOCKING_RE = /not blocking|non-?blocking|not failing|not a finding|not a defect|condition before the merge|merge condition|blocks the merge, not this|not a correction round|so not blocking|no action|advisory/i;

function normLabel(l) {
  return l.replace(/^DOC|^Doc/, 'D').replace(/-r\d*$/, '-r');
}

export function labelPrefix(label) {
  const l = normLabel(label);
  if (/^S1/.test(l)) return 'S1';
  if (/^S2/.test(l)) return 'S2';
  const g = /^G\d+-([A-Z])?/.exec(l);
  if (g) return g[1] && 'CED'.includes(g[1]) ? g[1] : 'G';
  return l[0];
}

// The label's own qualifier: "(low)", "— fails by name", "(blocks)", ": medium", "— the gate fails (record cap)".
function titleSeverity(title) {
  const q = /^[\w./-]+\s*(\([^)]{0,80}\)|[—–:-]\s*[^.]{0,50})/.exec(title);
  const head = (q ? q[1] : '').toLowerCase();
  if (NONBLOCKING_RE.test(head)) return 'NOTE';
  if (/\b(fails?|failure by name|blocks|blocking|block|high)\b/.test(head) && !/does not (block|fail)/.test(head)) return 'BLOCK';
  if (/\b(medium|should[- ]fix|must[- ]fix)\b/.test(head)) return 'SHOULD';
  if (/\((?:low|nit|info|suggestion|note|minor|pending)\b|\b(?:low|nit|note|info)\b\s*[—–-]?/.test(head)) return 'NOTE';
  return null;
}

const CTXS = ['C', 'E', 'D', 'BLOCK', 'SHOULD', 'NOTE', 'F'];

export function parseReport(text, { date = '', verdict = null } = {}) {
  const proportional = date >= PROPORTIONAL_FROM;
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let ctx = 'OTHER';
  let ctxBlocking = false;
  const findings = [];
  const fallback = [];
  // Unlabelled first-level items under a should-fix heading ("## S2" then "1. **...**"), kept per section and used
  // when that section has no labelled finding.
  let section = 0;
  const labelledIn = new Set();
  const unlabelled = [];
  const seen = new Set();
  let cur = null;
  const close = () => {
    if (cur) {
      cur.text = cur.text.join('\n').slice(0, 4000);
      findings.push(cur);
      cur = null;
    }
  };
  const reportUsesClasses =
    proportional ||
    lines.some((l) => /^#{1,4}\s.*(correctness|evidence|documentation)/i.test(l)) ||
    lines.some((l) => /^\s{0,3}\*\*(correctness|evidence|documentation)\b/i.test(l));
  let justSwitched = false;
  for (const line of lines) {
    // "**S2 (should fix)**" followed by "None." on its own line: the section is empty.
    if (justSwitched && line.trim()) {
      justSwitched = false;
      if (/^none\b/i.test(line.trim())) { ctx = 'NONE'; continue; }
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    let m = null;
    if (h) {
      const hm = HEAD_LINE.exec(line);
      // "## S1 (blocking)" / "## S2" are severity headings, not findings.
      if (!hm || (/^S[12]$/.test(hm[1]) && headingContext(h[2]).ctx !== 'OTHER')) {
        close();
        section++;
        ({ ctx, blocking: ctxBlocking } = headingContext(h[2]));
        justSwitched = true;
        continue;
      }
      // "## C1 (Correctness, for the human): ..." is a finding and also sets the class context.
      const own = headingContext(h[2].replace(/^\**[\w.-]+\s*/, ''));
      if (own.ctx !== 'OTHER') ({ ctx, blocking: ctxBlocking } = own);
      m = hm;
    }
    if (!m) m = BOLD_LINE.exec(line);
    if (m && /^S[12]$/.test(m[1])) {
      // "**S1:** none." / "**S2 (should fix)**" — a severity lead-in.
      close();
      section++;
      ctx = m[1] === 'S1' ? 'BLOCK' : 'SHOULD';
      ctxBlocking = m[1] === 'S1';
      if (/\bnone\b/i.test(line)) ctx = 'NONE';
      justSwitched = true;
      continue;
    }
    if (!m) {
      const li = LEADIN.exec(line);
      if (li) {
        const hc = headingContext(li[1]);
        // a whole-line bold lead-in ("**Judgments**") is a heading even when it names no class or severity
        if (hc.ctx === 'OTHER' && /^\s{0,3}\*\*[^*]+\*\*:?\s*$/.test(line) && !BOLD_LINE.test(line) && !GENERIC_BOLD.test(line)) {
          close();
          section++;
          ctx = 'OTHER';
          ctxBlocking = false;
          continue;
        }
        if (hc.ctx !== 'OTHER') {
          close();
          section++;
          justSwitched = true;
          ({ ctx, blocking: ctxBlocking } = hc);
          // "**Correctness: no findings.**" / "**Evidence:** none" — the class is empty.
          if (/\b(none|no findings?)\b/i.test(line.slice(0, 120)) && !/\b[CED]-?\d/.test(line.slice(0, 120))) ctx = 'NONE';
          continue;
        }
      }
    }
    if (!m && CTXS.includes(ctx)) m = LIST_LINE.exec(line) || GENERIC_BOLD.exec(line);
    if (m) {
      const label = normLabel(m[1]);
      const prefix = labelPrefix(label);
      const title = line
        .replace(/^\s*(?:[-*]\s+|\d+\.\s+|#{2,4}\s+)?/, '')
        .replace(/\*\*/g, '')
        .trim();
      const isCheckItem =
        CLOSED_RE.test(title) ||
        LIST_REF_RE.test(title) ||
        STATUS_RE.test(title) ||
        (CHECK_OK_RE.test(title.slice(0, 160)) && !NEGATIVE_RE.test(title.slice(0, 160)));
      const skip =
        isCheckItem ||
        ctx === 'NONE' ||
        // a test or step named N-3 inside a findings list
        (prefix === 'N' && /^N-/.test(label) && ['C', 'E', 'D', 'BLOCK'].includes(ctx)) ||
        // in a report sorted by class, a label under a check section is a check item, not a finding
        (reportUsesClasses && ctx === 'OTHER');
      if (!skip && !seen.has(label)) {
        close();
        seen.add(label);
        cur = { label, prefix, ctx, ctxBlocking, title: title.slice(0, 300), text: [line] };
        labelledIn.add(section);
        continue;
      }
    }
    // only a first-level item that opens with its own bold title ("1. **The gate-2 reviewer's S2-2 ...**")
    if (ctx === 'SHOULD' && !m && /^(?:[-*]|\d+\.)\s+\*\*\S/.test(line)) {
      const title = line.replace(/^(?:[-*]|\d+\.)\s+/, '').replace(/\*\*/g, '').trim();
      const ok = CLOSED_RE.test(title) || STATUS_RE.test(title) || (CHECK_OK_RE.test(title.slice(0, 160)) && !NEGATIVE_RE.test(title.slice(0, 160)));
      if (!/^none\b/i.test(title) && !ok) unlabelled.push({ section, ctx, title });
    }
    if ((['C', 'E', 'BLOCK'].includes(ctx) || (ctx === 'D' && ctxBlocking)) && /^(?:[-*]|\d+\.)\s+\S/.test(line)) {
      const title = line.replace(/^(?:[-*]|\d+\.)\s+/, '').replace(/\*\*/g, '').trim();
      if (!(CHECK_OK_RE.test(title.slice(0, 160)) && !NEGATIVE_RE.test(title.slice(0, 160)))) fallback.push({ ctx, title });
    }
    if (cur) cur.text.push(line);
  }
  close();
  unlabelled
    .filter((it) => !labelledIn.has(it.section))
    .forEach((it, i) => findings.push({ label: `s2-item${i + 1}`, prefix: 'S2', ctx: it.ctx, ctxBlocking: false, title: it.title.slice(0, 300), text: it.title }));
  for (const f of findings) {
    let cls = null, how = null;
    if (['C', 'E', 'D'].includes(f.ctx)) {
      cls = f.ctx; how = 'heading';
    } else if (['C', 'E', 'D'].includes(f.prefix) && reportUsesClasses) {
      cls = f.prefix; how = 'label';
    } else {
      const lead = /\((correctness|evidence|documentation)\b|\b(correctness|evidence|documentation)\s*(?:finding|:|—|\))/i.exec(f.title);
      if (lead) { cls = (lead[1] || lead[2])[0].toUpperCase(); how = 'title'; }
    }
    let severity = titleSeverity(f.title);
    f.sevDefault = false;
    if (!severity) {
      if (cls === 'C' || cls === 'E') severity = 'BLOCK';
      else if (cls === 'D') severity = !proportional && (f.ctxBlocking || verdict === 'FAIL') ? 'BLOCK' : 'MUSTFIX';
      else if (f.prefix === 'B' || f.prefix === 'S1' || f.prefix === 'G') severity = 'BLOCK';
      else if (f.prefix === 'S2') severity = 'SHOULD';
      else if (f.prefix === 'N') severity = 'NOTE';
      else {
        severity = f.ctx === 'BLOCK' || f.ctxBlocking ? 'BLOCK' : f.ctx === 'SHOULD' || f.ctx === 'F' ? 'SHOULD' : 'NOTE';
        // a label under a plain heading, with no severity word of its own
        f.sevDefault = ['OTHER', 'F'].includes(f.ctx) && f.prefix !== 'N' && f.prefix !== 'S2';
      }
    }
    // Under the proportional-gates rule a Documentation finding never blocks: it is a must-fix before the merge.
    if (cls === 'D' && proportional && (severity === 'BLOCK' || severity === 'SHOULD')) severity = 'MUSTFIX';
    f.cls = cls;
    f.how = how;
    f.severity = severity;
    // The logged verdict is authoritative: a gate that passed has no open blocking finding (§22: a Correctness or
    // Evidence FAIL blocks). A blocking-looking item in a passing report is a check item, a closure or a
    // non-failing note, and is counted as a note.
    if (verdict && verdict !== 'FAIL' && severity === 'BLOCK') {
      f.severity = 'NOTE';
      f.underPass = true;
    }
  }
  // A FAIL report with no blocking finding read so far: labelled findings under plain headings that carry no
  // severity word of their own are its blocking findings.
  if (verdict === 'FAIL' && !findings.some((f) => f.severity === 'BLOCK')) {
    for (const f of findings) if (f.sevDefault) f.severity = 'BLOCK';
  }
  // A FAIL report whose blocking findings carry no label we read: its list items under a Correctness, Evidence,
  // blocking or (before 2026-10-05) failing Documentation heading are taken as its findings (how = 'fallback').
  let fallbackUsed = false;
  if (verdict === 'FAIL' && !findings.some((f) => f.severity === 'BLOCK') && fallback.length) {
    fallbackUsed = true;
    fallback.forEach((it, i) => {
      const cls = ['C', 'E', 'D'].includes(it.ctx) ? it.ctx : null;
      findings.push({ label: `item${i + 1}`, prefix: '?', ctx: it.ctx, title: it.title.slice(0, 300), text: it.title, cls, how: cls ? 'heading' : null, severity: 'BLOCK', fallback: true });
    });
  }
  // Last resort for a FAIL report: the verdict line's own class words ("FAIL, on Documentation only (record)").
  let verdictLineUsed = false;
  if (verdict === 'FAIL' && !findings.some((f) => f.severity === 'BLOCK')) {
    const vc = verdictLineClasses(text);
    if (vc.size) {
      verdictLineUsed = true;
      for (const c of vc) findings.push({ label: `verdict-${c}`, prefix: '?', ctx: c, title: '(from the verdict line)', text: '', cls: c, how: 'verdict line', severity: 'BLOCK', fallback: true });
    }
  }
  return { findings, reportUsesClasses, fallbackUsed, verdictLineUsed };
}

// The verdict line's class words: "Verdict: BLOCK (Evidence, E1). Correctness: pass.", "FAIL, on Documentation only".
export function verdictLineClasses(text) {
  const head = text.split('\n').slice(0, 14).join(' ');
  const out = new Set();
  const v = /(?:verdict|\bFAIL\b|\bBLOCK\b)[^\n]{0,220}/i.exec(head);
  if (v) {
    const s = v[0];
    if (/\bcorrectness\b(?!:?\s*(?:pass|none|no\b))/i.test(s)) out.add('C');
    if (/\bevidence\b(?!:?\s*(?:pass|none|no\b))/i.test(s)) out.add('E');
    if (/\b(documentation|record)\b(?!:?\s*(?:pass|none|no\b))/i.test(s) && /\bonly\b|\bon documentation|\(record|record[- ]fidelity|record form|record cap/i.test(s)) out.add('D');
  }
  return out;
}

// ---------- the inferred-class rule ----------
// Applied only to findings with no stated class. Order matters, and follows AUTONOMY §22 and the proportional-gates
// paragraph: an untrue or unsupported claim is Correctness whatever text it sits in; then a missing run, test or
// observation is Evidence; then words, records and cites are Documentation; anything else is Correctness. Its
// agreement with the stated classes is measured on the findings whose class the report states, and printed in
// REPORT.md; it is not assumed.
const CLAIM_RE =
  /\buntrue\b|\bis false\b|claims? (?:a |more |an? )?(?:limit|guarantee|reading|consequence|refusal)|claims more than|(?:does not|do not|cannot) support|not supported|overclaim|over-claims?|states? a (?:limit|guarantee|consequence)|a guarantee .{0,30}(?:not|does)/i;
const EVIDENCE_RE =
  /\b(not (?:been )?run|never r[au]n|was not run|were not run|not re-?run|not made again|no (?:green )?run|no evidence|without evidence|not observed|never observed|unobserved|no observation|no ci\b|ci (?:is |was )?(?:red|failing|not)|red (?:at|on) |no record of (?:a |the )?run|not measured|unmeasured|no measurement|has no green|not reproduced|evidence (?:is )?(?:missing|owed)|owed evidence|(?:mutation|test)s? .{0,40}(?:not|never) (?:run|applied|observed)|was never made|not exercised|green at|suites?\b|no (?:asserting )?(?:test|e2e)\b|has no test|survives|not shown|does not cover|no test starts|not the one run|stand-in|mock)/i;
const DOC_RE =
  /\b(comment|wording|words?\b|sentence|readme|typo|record|amendment|cites?\b|cited|citation|stale|path:line|sha256|hash|pin(?:ned|s)?\b|quote|verbatim|paraphrase|header|doc(?:string| comment)?s?\b|known-limitations|pr body|closing|superseded|misstates|misnames|renumber|label|names? the wrong|title|says|reads|class \d|columns?\b|index|placeholder|points? to)/i;

export function classify(title, text) {
  const head = `${title}\n${String(text).split('\n').slice(0, 3).join('\n')}`;
  if (CLAIM_RE.test(title)) return 'C';
  if (EVIDENCE_RE.test(head)) return 'E';
  if (DOC_RE.test(title)) return 'D';
  return 'C';
}
