// rules.mjs — the rule catalogue (from .claude/agents/*.md and governance/AUTONOMY.md) and the matcher that ties
// each gate finding to the rules its text says were broken. Writes data/rule-hits.json.
//
//   node state/consults/cloud/gate-analytics/scripts/rules.mjs
//
// Each rule carries:
//   source  where the rule is stated (file and section or paragraph; no line numbers, so nothing here goes stale)
//   rule    a one-line PARAPHRASE of the rule (not a quotation)
//   cite    the way a gate report names the rule explicitly (its round and item, its AUTONOMY section, its own name)
//   kw      keywords that describe a breach of the rule in a finding's own words
// A finding is matched on its title plus the start of its text, 400 characters in all (the statement of the defect,
// before the fix: a gate names rules in its fix instructions too, and those are not breaches). Only findings count (severity BLOCK, MUSTFIX or SHOULD); notes, nits and items under a passing verdict
// do not. A finding may match several rules. "explicit" = the cite pattern matched; "keyword" = only kw matched.
// The keyword tier is a heuristic: its precision on a hand-read sample is printed in REPORT.md.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { read, listDir, OUT } from './lib.mjs';
import { parseReport, classify } from './parse-report.mjs';

const A = '.claude/agents/architect.md';
const R = '.claude/agents/reviewer.md';
const W = '.claude/agents/worker.md';
const T = '.claude/agents/tester.md';
const AU = 'governance/AUTONOMY.md';
const TPL = 'docs/PREREGISTRATION-TEMPLATE.md';

export const RULES = [
  // ---- the human's standing rules carried in the architect, reviewer and worker definitions
  { id: 'seam-real-interface', source: `${A}, ${R} (checklist 8), ${W}: cross-module seams (round 4)`,
    rule: 'A cross-module seam is written against the interface the other side actually has and proven by one end-to-end test from the real shape; an imagined interface fails by name.',
    cite: /round 4\b|imagined interface|seam rule/i,
    kw: /\bseam\b.{0,80}(?:not|never|imagined|mock|wrong|untested|unproven)|real shape|end-to-end test from|interface the other side|mock(?:ed)? .{0,40}(?:interface|shape)/i },
  { id: 'caller-rule', source: `${A}, ${R} (checklist 8), ${W}: the caller rule (round 4; exemptions round 5 item 4, round 8)`,
    rule: 'No callback, option, code path or pub item lands without a product caller; a test-only caller does not count (instrument accessors and pre-committed producers excepted).',
    cite: /caller rule\b.{0,60}(?:no product caller|fails|breach|not met)|(?:breaks?|fails?) the caller rule|round 8\b.{0,60}(?:does not name|no consumer|not named)/i,
    kw: /product caller|test-only caller|no (?:product )?caller|callers? .{0,30}(?:only|all) in tests|caller grep|without a caller|dead code/i },
  { id: 'verbatim-quote', source: `${A}, ${R}, ${W}: verbatim quotes (round 10; round 11 floor and elisions)`,
    rule: 'A passage marked verbatim matches its named source byte for byte; an elision keeps every negation, condition and qualifier; a paraphrase presented as a quote fails by name.',
    cite: /\(round 1[01]\b[^)]{0,30}\)|verbatim[- ]quote rule/i,
    kw: /\bverbatim\b.{0,80}(?:not|differ|does not match|mismatch|paraphrase|drops?|dropped|misquot)|misquot|paraphrase (?:presented|marked|introduced|given) as|not byte[- ](?:for[- ]byte|identical|equal)|byte[- ]for[- ]byte.{0,40}(?:not|differ)|elision.{0,60}(?:drops?|removes?|loses?)|(?:quote|quotation) .{0,40}(?:does not match|differs|is not)|no longer matches its source|does not match its source|no elision mark|without an? elision mark|quoted .{0,40}not (?:whole|byte)/i },
  { id: 'ledger-by-round-item', source: `${A}, ${R}, ${W}: quote by reference (a) and (a′) (round 12; round 14)`,
    rule: 'Ledger rulings are cited by round and item (or by entry number), never by a line of DECISIONS-PENDING.md.',
    cite: /round 12,? (?:item )?\(a\)|\(a′\)|\(a'\)/i,
    kw: /DECISIONS-PENDING\.md:\d|line cite into the ledger|ledger (?:by|cited by) line|cites? the ledger by line/i },
  { id: 'pin-and-hash', source: `${A}, ${R}, ${W}: quote by reference (b) and its rider (round 12)`,
    rule: 'A passage that must be invoked is cited path:line with the span\'s sha256, the gate recomputes it; text is reproduced only when byte-copied by script and marked so.',
    cite: /round 12,? (?:item )?\(b\)/i,
    kw: /(?:no|without (?:a|its|the)) (?:sha256|hash)\b|hash(?:es)? (?:does|do) not recompute|does not recompute|recomputes? to a different|sha256 (?:mismatch|differs|is wrong)|wrong (?:hash|sha256)|reproduced (?:text|without|where)|not byte-copied|without (?:its|the) script mark|unpinned (?:cite|reference|path:line)/i },
  { id: 'correction-ceiling', source: `${A}, ${R}, ${W}: quote by reference (d) (round 12)`,
    rule: 'A correction is at most three sentences (the defect, the corrected reference, the proof) and never restates an earlier amendment\'s claim.',
    cite: /over round 12,? (?:item )?\(d\)'s ceiling|round 12,? (?:item )?\(d\)'s ceiling/i,
    kw: /more than three sentences|over (?:the )?(?:three-sentence )?ceiling|restates an earlier amendment/i },
  { id: 'superseded-index', source: `${A}, ${R}, ${W}: quote by reference (e) (round 12)`,
    rule: 'A correction round ends with a superseded index.',
    cite: /\(round 12,? (?:item )?\(e\)\)/i,
    kw: /superseded index .{0,40}(?:incomplete|does not name|missing|leaves out|omits|is false|wrong)|no superseded index|without (?:a|its) superseded index|has no superseded|nothing else is superseded/i },
  { id: 'self-line-and-pin-as-current', source: `${A}, ${R}, ${W}: the root-cause rule (round 14)`,
    rule: 'No bare :line into a file the same commit edits; a self-reference is by section, amendment and item; a pin read against a moved tree names which is authoritative.',
    cite: /\(round 14\b[^)]{0,40}\)|round 14 bars/i,
    kw: /bare (?:self-)?line|bare `?:line|self-line|self-reference by line|same commit edits|pin(?:ned)? .{0,40}read as current|which is authoritative|line cite into a file (?:the|its) (?:same )?commit/i },
  { id: 'untracked-authority', source: `${A}, ${R}, ${W}: the standing rule of round 14`,
    rule: 'Nothing tracked cites an untracked file as Authority.',
    cite: /untracked[- ]authority/i,
    kw: /\buntracked\b.{0,60}(?:authority|cite|cited|file)/i },
  { id: 'consult-summary-resolved', source: `${A}, ${R}, ${W}: round 15 (a)`,
    rule: 'A frozen, byte-copied consult block is resolved sentence by sentence against its steps and evidence before commit; stop on a mismatch.',
    cite: /round 15,? (?:item )?\(a\)/i,
    kw: /summary sentence.{0,60}(?:not|does not|unresolved|mismatch)/i },
  { id: 'tool-claim-names-commit', source: `${A}, ${R}, ${W}: round 15 (c)`,
    rule: 'A record statement about a tool\'s behaviour names the tool\'s commit.',
    cite: /round 15,? (?:item )?\(c\)/i,
    kw: /tool'?s commit|tool claim|names no tool commit|without the tool's commit|no tool commit/i },
  { id: 'contiguous-reference', source: `${A}, ${R}, ${W}: round 15 (d)`,
    rule: 'A path:line @ rev sha256 reference is written contiguous on one line.',
    cite: /round 15,? (?:item )?\(d\)/i,
    kw: /split across (?:two |a )?(?:lines|comment)|comment continuation|not contiguous/i },
  { id: 'hash-ref-at-main-commit', source: `${A}, ${R}, ${W}: round 15 (e)`,
    rule: 'A hash reference in an append-only record carries an explicit @ rev at a commit on main, never a branch commit or the HEAD default.',
    cite: /round 15,? (?:item )?\(e\)/i,
    kw: /(?:names|carries|with) no (?:revision|rev\b|@ ?rev)|no `?@ ?<?rev|without (?:an? )?(?:explicit )?(?:@ ?)?rev(?:ision)?\b|at a branch commit|not (?:a commit )?on main|HEAD default|pinned at (?:a|the) branch/i },
  { id: 'restore-bound', source: `${A}, ${R}, ${W}: round 15 (f)`,
    rule: 'A committed record byte is restored only to revert a forbidden in-place edit, on an unmerged branch, with the correction re-carried by an appended row.',
    cite: /round 15,? (?:item )?\(f\)/i,
    kw: /restor(?:e|ed|es) .{0,40}(?:outside|beyond) the bound/i },
  { id: 'record-cap', source: `${A}, ${R}, ${W}: the record cap (standing directive of 2026-09-18)`,
    rule: 'A piece\'s record is the smallest text a gate can verify: a closing amendment is references and hashes, never prose restating them; two record-correction rounds per piece.',
    cite: /record cap,? by name|(?:fails?|breaks?|against) the record cap|record cap\)?:? .{0,20}(?:fails|breach)/i,
    kw: /restates? (?:in prose|its own|an earlier|the (?:claim|span|pinned))|restatement|prose (?:that )?(?:restat|a reference could)|re-?carries .{0,40}(?:prose|restatement)|is prose\b/i },
  { id: 'discharge-claim-resolves', source: `${A}, ${R}, ${W}: discharge claims (round 7)`,
    rule: 'Every "discharged" or "done" clause names the test or line that proves it, and the gate resolves it; an unresolvable discharge claim fails by name.',
    cite: /\(round 7\b[^)]{0,30}\)|round 7 discharge|discharge (?:claim|rule)/i,
    kw: /discharge(?:d)?\b.{0,60}(?:not|no|does not resolve|unresolv|without)|unresolvable (?:discharge|claim)|"done".{0,40}(?:no|without|not)/i },
  { id: 'engine-facts-owner-consequences', source: `${A}, ${R}, ${W}: operator-visible text (round 7)`,
    rule: 'Engine messages state engine facts; owners state consequences (a module\'s message does not state another module\'s consequence).',
    cite: /engine facts|owners state consequences/i,
    kw: /states? (?:another|the owner'?s?|a kernel|a shell) (?:module'?s )?consequence|consequence .{0,40}(?:another module|the owner)/i },
  { id: 'class-8-budget-overrun', source: `${A}, ${R}, ${W}: round 25 item 2 (a); ${TPL} class 8`,
    rule: 'A full-form §7 overrun is recorded as class 8 with "budget overrun, §7 not edited"; the §7 line is never edited to match.',
    cite: /(?:not recorded as|lacks|without|no) class[- ]8|class[- ]8'?s? (?:required )?words|class 8.{0,20}(?:missing|absent|not recorded)/i,
    kw: /overrun .{0,40}(?:not recorded|unrecorded)|unrecorded overrun|§7 (?:line )?(?:is |was )?edited|(?:is|are) overrun|over (?:the |its |§7'?s? )?(?:line )?budget|exceeds? (?:the |its )?(?:§7|line budget|budget)/i },
  { id: 'class-9-scope-addition', source: `${A}, ${R}, ${W}: round 25 item 2 (a); ${TPL} class 9`,
    rule: 'A scope addition on a standing rule is recorded as class 9 and declared before any code of it.',
    cite: /class 9/i,
    kw: /scope addition/i },
  { id: 'mutation-observation-wording', source: `${A}, ${R}, ${W}: round 25 item 2 (c); ${TPL} mutation-observation wording`,
    rule: 'A verify-mutation run is never called an observation of a mutation; a mutation is observed by applying it, running the test, recording the failure by name with its commit, and reverting.',
    cite: /round 25,? item 2,? \(c\)|mutation[- ]observation/i,
    kw: /verify-mutation .{0,60}(?:observ|run)|(?:observation|observed) .{0,30}(?:never made|not made)|recorded mutation.{0,60}(?:no commit|names no commit|without (?:a|its) commit|not (?:in|on) )|mutation (?:was )?(?:never|not) (?:observed|applied|re-?observed)|not re-?observed|(?:were|was) not made again|re-observation .{0,40}(?:not|missing|was not)/i },
  { id: 'test-text-span-unmerged', source: `${A}, ${R}, ${W}: round 25 item 2 (d)`,
    rule: 'A test-text span that exists only on an unmerged branch is named by its commit in words, not pinned by hash at a branch commit; the merge keeps that commit reachable.',
    cite: /round 25,? item 2,? \(d\)/i,
    kw: /unmerged branch|only on (?:the|a) branch|not (?:in|reachable from) (?:main|the head'?s? history)|not an ancestor/i },
  { id: 'five-line-out-of-scope', source: `${A}, ${R}: round 25 item 2 (e); ${AU} §21d and §25 (e)`,
    rule: 'A five-line form\'s Out-of-scope line asserts that none of §21a\'s four categories is touched; otherwise the piece takes the full form and full gating from dispatch.',
    cite: /round 25,? item 2,? \(e\)|§21d|§25 ?\(e\)/i,
    kw: /out-of-scope line.{0,80}(?:false|untrue|names|touch)|full form (?:at|from) dispatch|takes the full form/i },
  // ---- the proportional-gates and wording-block paragraphs of the gate definitions; AUTONOMY §22 and §31
  { id: 'claims-true-of-code', source: `${A}, ${R}: proportional gates; ${AU} §22 (never documentation-only) and §31; ${W}: pre-gate self-check (messages)`,
    rule: 'A sentence the piece writes (comment, doc, README, record, PR body, message) is true of what it describes at the head; an unsupported claim of a guarantee, a limit or a measurement is Correctness, never documentation-only.',
    cite: /untrue claim of a (?:guarantee|limit|measurement)|claims? a (?:guarantee|limit) the code does not/i,
    kw: /\buntrue\b|\b(?:is|are|now|still) (?:false|wrong|inaccurate)\b|false (?:claim|statement|sentence|comment)|overclaims?|over-claims?|claims? more than|not supported by (?:the )?(?:code|evidence)|(?:claim|sentence|comment|text|readme|row|paragraph|summary|doc) .{0,40}(?:does not hold|is not true|contradicts|no longer (?:true|holds|describes))|says .{0,60}, but (?:the code|it)|misdescribes?|inaccurate|wrong reason|stale (?:comment|sentence|statement|text|row|readme|paragraph|summary|doc|pr body|wording|claim|assertion message|test name)|(?:comment|sentence|readme|pr body|row|summary|paragraph)s? (?:is|are|went|goes|becomes?) stale|contradicts? (?:the code|itself)|does not describe|no longer describes?|overstates?|\b(?:literally |now )?false\b|contradicts?\b|does not (?:fully )?match (?:the )?(?:code|evidence|what)|reads as (?:if|though)|(?:broader|narrower|wider) than|\bwrong\b|not true|misleading|drops (?:that|the|a) (?:scope|condition|qualifier)/i },
  // ---- the pre-gate self-checks the worker states (worker.md), and AUTONOMY §6a, §14, §22
  { id: 'completion-claim-evidence', source: `${W}: pre-gate self-check (completion claims); ${AU} §22 (missing required evidence blocks)`,
    rule: 'Every completion claim points to evidence that exists at the head (a run, a log, a test result); missing required evidence blocks.',
    cite: /missing required evidence/i,
    kw: /no (?:green )?run|(?:was|were|is|are) not (?:yet )?run|never run|not re-?run|no evidence|without evidence|no (?:log|record) of (?:a|the) run|has no green|no green (?:ci|run)|not observed at|evidence (?:is )?(?:missing|owed)|owed .{0,30}evidence|not shown|no observation|did not run|has no proof|no proof yet/i },
  { id: 'test-reaches-assertion', source: `${W}: pre-gate self-check (tests reach their assertion); ${AU} §14 (one mutation per new test)`,
    rule: 'Every required test reaches its intended assertion, not only its setup, and can fail: one recorded mutation per new test fails it by name.',
    cite: /§14\b|mutation per (?:new )?test/i,
    kw: /vacuous|never reaches|only (?:its )?setup|passes (?:at|on) (?:the )?base|would pass (?:without|at|on)|cannot fail|not shown able to fail|asserts? less than|does not assert|no (?:recorded )?mutation|mutation (?:is )?missing|without a (?:recorded )?mutation|mutation .{0,40}(?:does not fail|survives|passes)|survived/i },
  { id: 'cites-show-their-line', source: `${W}: before a gate, every path:line written shows the line its clause describes; ${AU} §6a item 1 (verify:cites)`,
    rule: 'Every path:line reference shows the line the clause describes (no stale, dangling or off-by-N cite).',
    cite: /stale cites?\b|cites? (?:is|are) stale/i,
    kw: /stale (?:cite|citation|reference|line|pin|path)|cites? .{0,40}(?:wrong line|stale|points? (?:to|at) (?:the )?wrong|off by)|off-by-(?:one|n)|dangling|(?:line|lines) \d+(?:-\d+)? (?:is|are) (?:now|not)|no longer (?:at|on) line|names? the (?:old|pre-move|wrong) (?:path|line|file)/i },
  { id: 'records-append-only', source: `${AU} §22 (record classes: immutable records are append-only)`,
    rule: 'Preregistration §§0–12 as filed, registered predictions, gate reports and every human ruling are append-only; nothing is edited in place.',
    cite: /not append-only|breaks? (?:the )?append-only|append-only .{0,30}(?:broken|violated|breach)/i,
    kw: /in-place (?:edit|rewrite|change)|(?:edited|rewritten|changed) in place|rewrit(?:es|ten|ing) (?:an? )?(?:filed|earlier|committed) (?:amendment|section|row|record|§)|an existing quoted span/i },
  { id: 'carry-forward-applicability', source: `${AU} §22 (carry forward only after a semantic applicability check)`,
    rule: 'A passed verdict carries to a later revision only after a semantic applicability check; evidence is never reused across a change without it.',
    cite: /applicability check|carry[- ]forward/i,
    kw: /carried forward .{0,40}(?:without|no)|evidence (?:reused|carried) .{0,40}(?:without|across)|at an? (?:older|earlier|different) (?:head|commit|revision)/i },
  { id: 'gating-route-and-size', source: `${AU} §21a to §21c (full gating categories; single gate; the size threshold)`,
    rule: 'A change touching an ADR, security posture, the wire or a guarantee, or over 150 lines or 8 files, takes full two-agent gating and the full form.',
    cite: /§21[abc]?\b(?!d)|full gating|size threshold/i,
    kw: /single[- ]gate route|five-line .{0,30}(?:route|threshold)|over (?:the )?150|more than 8 files|crosses? (?:§21c'?s? )?(?:threshold|bound)/i },
  { id: 'generated-files', source: `${AU} §22 (generated evidence is never hand-edited) and §23 (generated files regenerate on merge)`,
    rule: 'Generated files are regenerated by script from a named revision, never edited or conflict-resolved by hand.',
    cite: /§23\b/i,
    kw: /generated (?:file|row|index|rows|files|output)s? .{0,50}(?:by hand|hand-edit|edited|drift)|hand-edit|(?:queue|site|health|adrIndex)(?:\.mjs)? --check .{0,30}(?:fail|exit 1|rc 1)|index has drifted/i },
  { id: 'merge-commit-reachable', source: `${AU} §27 (merge: merge-commit); ${TPL} round 25 item 2 (d)`,
    rule: 'A piece whose records name branch commits merges by merge commit, so those commits stay reachable from main; never a squash or rebase merge.',
    cite: /§27\b.{0,60}merge|merge: merge-commit/i,
    kw: /squash would|(?:a|the) squash (?:merge )?(?:would )?orphan|keep (?:the )?(?:observation |commit X |named )?commits? (?:X )?reachable|not reachable from main/i },
  // ---- the worker's scope and red lines (worker.md); the architect's scope check
  { id: 'scope-exactly-the-piece', source: `${W}: the piece's text defines the scope, no improvisation past it; ${A}: scope creep`,
    rule: 'The diff does exactly what the piece\'s form declares (its files, tests, names and steps): nothing beyond it, and nothing short of it unless declared.',
    cite: /scope creep/i,
    kw: /out of scope|outside (?:the )?(?:scope|form'?s? scope|§2|its scope|declared scope)|beyond (?:the )?(?:form|scope|piece)|not (?:named )?in (?:the )?(?:scope|form)|unscoped|file outside|edits? a file (?:outside|not named)|not in §2|(?:the )?form does not declare|not as (?:the form|§\d+(?:\.\d+)?) declares|(?:as|than) (?:the form|§\d+(?:\.\d+)?|12\.\d) declares|undeclared|is not followed|(?:is|are) not met|are not in (?:this |the )?head|is not in (?:this |the )?head|is silent on/i },
  { id: 'record-what-happened', source: `${W}: externalize what a successor needs into the piece's named state file, and record class 8 and class 9 events; ${AU} §21b (a mid-piece overrun is recorded as an amendment) and §22 (the closing record lists every Documentation fix)`,
    rule: 'What happened in the piece (a deviation, an overrun, an observation, a fix) is recorded in the piece\'s record, by the amendment class that fits.',
    cite: /closing record (?:must|should|lists)/i,
    kw: /(?:record|amendment|closing record|closing amendment|report|form|pr body|body) .{0,50}(?:does not (?:say|record|name|state|give)|omits|leaves out|is silent|never (?:says|records))|not recorded|unrecorded|(?:records?|names?) neither|nothing records|without (?:a|its) record|needs a class \d row|must (?:name|record|say|carry) |does not name its (?:evidence|source|commit)|owed, not yet due/i },
  { id: 'red-lines', source: `${W}: never touch red-line items; ${A}, ${R}: red-line text keeps the human's words; ${AU} §21`,
    rule: 'Red-line items (ADR statuses and amendments, gate rulings, licensing, security posture) are the human\'s; no agent decides or rewords them.',
    cite: /red[- ]line/i,
    kw: /the human'?s (?:typed )?words .{0,40}(?:changed|reworded|altered)/i },
  { id: 'sign-off', source: `${W}: commits always git commit -s`,
    rule: 'Every commit is signed off.',
    cite: /\bDCO\b/i,
    kw: /unsigned|not signed[- ]off|no sign-?off|signed-off-by .{0,20}missing/i },
  // ---- the reviewer's checklist 1 to 7 (reviewer.md) and the tester's rules (tester.md)
  { id: 'error-handling', source: `${R}: checklist 1 (correctness and error handling; no unwrap on fallible paths)`,
    rule: 'No unwrap on a fallible path in non-spike code; failures are handled, not hidden.',
    cite: /checklist (?:item )?1\b/i,
    kw: /\bunwrap\b|\.expect\(|\bpanics?\b|swallow|silently (?:drop|ignore|discard|wrap)|error (?:is )?(?:lost|ignored|dropped)|unhandled/i },
  { id: 'never-block-cancellable', source: `${R}: checklist 2 (nothing synchronous on the canvas path; missing cancellation, docs/01 principle 7)`,
    rule: 'Nothing blocks the canvas or UI path, and every operation is cancellable.',
    cite: /principle 7\b/i,
    kw: /blocks? the (?:canvas|ui|ui thread|event loop)|synchronous .{0,30}(?:canvas|ui)|not cancell?able|cancell?ation (?:is )?(?:missing|lost|not (?:honou?red|observed|reached))|\bhangs?\b|deadlock/i },
  { id: 'no-json-on-data-path', source: `${R}: checklist 3 (ADR-004)`,
    rule: 'No JSON on a data path.',
    cite: /ADR-004/i,
    kw: /json on (?:a|the) data|serde_json .{0,40}(?:feature|data)/i },
  { id: 'crs-is-a-type', source: `${R}: checklist 4 (docs/01, docs/05)`,
    rule: 'CRS is handled as a type; no implicit reprojection or hardcoded EPSG:3857/4326 assumption.',
    cite: /CRS[- ]is[- ]a[- ]type/i,
    kw: /EPSG:(?:3857|4326).{0,40}(?:assum|hardcod)|implicit reprojection|silent (?:conversion|reprojection)/i },
  { id: 'perf-claims-measured', source: `${R}: checklist 5; ${T}: every perf claim gets a measured number (docs/08)`,
    rule: 'A performance claim carries a measured number with its method, per docs/08; no numbers, no claim.',
    cite: /docs\/08\b/i,
    kw: /unmeasured|perf(?:ormance)? claim|not measured|no measurement|measured number/i },
  { id: 'float-precision', source: `${R}: checklist 6 (ADR-003)`,
    rule: 'Projected coordinates do not reach float32 without offset-relative handling.',
    cite: /ADR-003/i,
    kw: /float32|\bf32\b.{0,40}(?:precision|coordinate)|offset-relative/i },
  { id: 'tests-for-non-spike-code', source: `${R}: checklist 7 (missing tests for non-spike code)`,
    rule: 'Non-spike code lands with tests.',
    cite: /checklist (?:item )?7\b/i,
    kw: /no test\b|missing tests?|untested|tests? (?:is |are )?missing|does not exist as a test|has no test|not tested|without a test|no (?:unit|integration|e2e|end-to-end) test/i },
];

export function matchRules(text) {
  const out = [];
  for (const r of RULES) {
    const explicit = r.cite.test(text);
    const keyword = r.kw.test(text);
    if (explicit || keyword) out.push({ id: r.id, how: explicit ? 'explicit' : 'keyword' });
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const entries = JSON.parse(read('state/consults/cloud/gate-analytics/data/entries.json'));
  const byReport = new Map(entries.filter((e) => e.report).map((e) => [e.report, e]));
  const hits = [];
  let considered = 0, matched = 0;
  for (const f of listDir('state/consults/gates').filter((x) => x.endsWith('.md')).sort()) {
    const e = byReport.get(f);
    const { findings } = parseReport(read(`state/consults/gates/${f}`), { date: f.slice(0, 10), verdict: e?.verdict ?? null });
    for (const x of findings) {
      if (!['BLOCK', 'MUSTFIX', 'SHOULD'].includes(x.severity)) continue;
      considered++;
      const body = String(x.text).split('\n').slice(1).join('\n');
      const text = `${x.title}\n${body}`.slice(0, 400);
      const m = matchRules(text);
      if (m.length) matched++;
      hits.push({ report: f, node: e?.node ?? null, gate: e?.gate ?? null, verdict: e?.verdict ?? null, label: x.label, severity: x.severity, cls: x.cls || classify(x.title, x.text), clsStated: !!x.cls, title: x.title.slice(0, 200), rules: m });
    }
  }
  writeFileSync(join(OUT, 'data', 'rule-hits.json'), `${JSON.stringify({ considered, matched, rules: RULES.map(({ id, source, rule }) => ({ id, source, rule })), hits }, null, 1)}\n`);
  console.log(JSON.stringify({ considered, matched }));
}
