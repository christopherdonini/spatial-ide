Reviewed: PR #314 at b6924acea0ee757f679551442d09d1353b595d3b (base d5598e2a) (the custodian's filing note, 2026-11-13: the gate, the architect, attempt 1, dispatched beside the reviewer, both gates from dispatch, PLAN node publish-approval-columns-line, slot 2; its brief by file (8271 bytes, sha256 38089cdf544f6191a03603053f0bde88c03ccf2601c5641ead9aca001909027f); the run 16:47:09Z to 16:54:49Z by its transcript, 71 calls (Read 43, Grep 27, SubagentHandback 1), none errored, model claude-opus-5-5; below, the hand-back byte for byte (with one final newline, 18238 bytes, sha256 d7b8b092ce8db85fea100a05267fd1132b00e5443da71f9729702de2286b6182), save 57 of its 60 sha256:<H> placeholders, each filled by script with the sha256 of its cited whole lines at its cited commit (git show, LF-joined, a final newline), where H is the gated head and M is main 8fb2835a, as its opening lines say, and a bare file name or a bare :line is read as the file its own sentence names. Three are left as written, since none names one line range: the report's own sentence about them, a pin over a path through two files, and a pin over a whole file. Nothing else is changed.)

Reviewed: PR #314 at b6924acea0ee757f679551442d09d1353b595d3b (base d5598e2a), gate, architect
Branch: cut/publish-approval-columns-line @ b6924acea0ee757f679551442d09d1353b595d3b
Verdict: PASS WITH NOTES

I have no shell. I could not run `gh pr checks 314`, `git`, numstat or any hash, so CI at H is unread by me. I left no background shell. Every `sha256:<H>` below is for the custodian to fill by script. "H" means b6924acea0ee757f679551442d09d1353b595d3b, and "M" means main 8fb2835a4648148f4c5178e4356475f7b687bc2c.

## Findings by class

**Correctness: none. Evidence: none.**

**Documentation. Each must be fixed before the merge and does not block (the 2026-10-05 direction, section 2).**

**D1. The composer's source comment does not name the comma ambiguity that the ruled OPEN-2 (a) requires.**
- Requirement:
  - OPEN-2 (a), as the draft words it, includes naming the ambiguity in the composer's source comment (`state/consults/2026-11-13-publish-approval-columns-line-form-architect-draft.md:286 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:d39d9c97693599d6d190237384424d5414d0ebe10ab6eab419dfc15b2107bfe2`).
  - It was ruled in the human's message of 2026-11-13, item 7 (`state/directives/2026-11-13-advisor-session-from-advisor-live-human-clicks-until-then-publish-approval-answers-rust-ci-fix-filler-now-toolchain-consult.md:31 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:a75f5c2a85433fbb080d18aaece4d2b996f1cf6e75026202c272fee32b3cdb4a`).
  - The form records it (`governance/forms/frontends/PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md:275 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:9006b1069d139d40b645a041e5f84c53123995315b051db5df7b5b2c4e5f1752` and `governance/forms/frontends/PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md:97 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:ca4f881fe6fe88bb96df774d2f341e5135fa049c9fcf11ea4da820acda2d8faf`).
- Evidence: the comment says only that there is no quoting. It does not say that a name containing `, ` reads as more than one name (`frontends/shell/src-tauri/src/publish.rs:316-319 @ b6924acea0ee757f679551442d09d1353b595d3b sha256:f7c33e2dfb9c54b94cfb0d33a7964fd4e82783a9478abf9a11750ea89d81848d`).
- Closure: append these words after `publish.rs:319`, as two comment lines.
  > `/// A name is inserted as it is (OPEN-2 (a)), so a column whose own name contains `, ` reads as`
  > `/// more than one name in the line; the shipped build reaches that only through a style whose match column has such a name.`
  - Clause check:
    - "inserted as it is": `format!` over `attributes.join(", ")` with no escaping (`publish.rs:324-327 @ H sha256:f2bf6e3ce66e4252fce156b54732aab5e9b610f55c50f005bc8fea939bc44b2d`).
    - "reads as more than one name": the separator is `, ` (`publish.rs:326 @ H sha256:05c8eb1daf2b7b8ee3a09e9e21958bd3ac56af9a9a0c1f7792e45b307b15014b`), so a name `a, b` renders the same as the two names `a` and `b`.
    - "only through a style whose match column": `style_attributes` returns the match column or nothing (`frontends/shell/src-tauri/src/publish.rs:1297-1305 @ H sha256:344ffb2c470af3efcb1b1b3f1bbf31992c7278d33ae7706e14cd2ea073530c4d`). Admission matches names exactly, so the shown name is the file's own column name (`engine/src/attributes.rs:563-569 @ H sha256:2d352919427667733c8ef4fb305ec0b114eb9d8c565de3276cc772271c6af5bf`).
  - These are not the human's words. They are the worker's comment, so the worker applies them with no re-gate and the PR body lists them.
  - publish.rs goes from 128 to about 130 lines, under its ceiling of 140.

**D2. The doc comment on the `prepared_prompt` test helper is untrue in two clauses.**
- Requirement: Part 1, item 1 (every added comment is clause-checked against the code).
- Evidence (`frontends/shell/src-tauri/src/publish.rs:1906 @ H sha256:c7eafa681f2ecfbb4346e69641e8a57054319f57b40755c1eb9d5dad4b94b71b`):
  - "As `prepared_with`": `prepared_with` takes the caller's dataset, viewer and licence (`publish.rs:1843-1849 @ H sha256:98c31839f2accb37c84c32eee29ade501c5f7eb99f89f87ce1aaee7e0a82c9c4`). The helper fixes those to `fixture(d, 50)`, `viewer()` and `viewer_license()` (`publish.rs:1917-1923 @ H sha256:81f3d2039ef03a98825718d612142e6a4ef407c0322a20486cf3cc73e38a111c`), which is `prepared`'s shape (`publish.rs:1838-1840 @ H sha256:b036f4fc792808829914f79239800c442d63910c833f3b275e7d3596541921f0`).
  - "returning the prompt as well": it returns the prompt instead of the phrase (`publish.rs:1930 @ H sha256:f559f5c4000e4c6d5df8123c54f9983a4177a96ed61cb0a4afda24fe6f2433ca`).
- Closure: replace the line with:
  > `/// As [`prepared`] over the caller's style source, returning the prompt in place of the phrase.`
  - Clause check:
    - The same fixture, viewer, licence, destination, name, scope and timestamp as `prepared`/`prepared_with`: `publish.rs:1850-1865` against `:1914-1926 @ H sha256:ee3fb7967686a7e2bdf31ed0d43de7399f0661949fa32525f410bb109b45356c`.
    - The style comes from the caller: `:1919`.
    - The return tuple ends in `PublishPromptData`: `:1911`.
  - These are the worker's words, applied with no re-gate.

**D3 (a record on main, outside H's diff). The form's §2.3 cites a PR B item that does not exist.**
- Evidence:
  - The form cites "Amendment 13 item 13" of PR B's form (`governance/forms/frontends/PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md:108 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:57ab998c6f682e724e9b97f8e985964837c556533f1524df55091a84dbc61920` and `:112`, same pin form).
  - PR B's Amendment 13 has four items (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1868-1875 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:e10c8ccebc4344d072c1e5a171780aa717522aedbf968a2cf565b6014f653e2d`).
  - The I1 sentence the form means is Amendment 12, item 13 (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1768 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:2be7348647194c5d731e43720e2907a353b254066f3e2dec9f23b1411e46abb1`).
- Closure: a class 3 correction, references only, in this form's closing amendment before the merge. At most three sentences: the defect, the corrected reference, the proof.

**Notes. These are preferences, not acceptance conditions.**
- **N1.** The ADR-024 note has no line saying where its words come from (check 6). The PR body should name the form's Amendment 1, item 4, and the directive's item 7 as the note's authority.
- **N2.** The E1 comment says the manifest publishes exactly `id` and the geometry (`frontends/shell/e2e/publish.mjs:379 @ H sha256:f0eb4f07ed639ca989b25a5107a75acb88f65dc804f7a7f0555dd22a037d2248`). That is true of the code (ADR-017:118). The assertion itself checks only the length (2) and that entry 0 is `id` (`:381`), as §4 prescribed.

## Checks

**1. Section 21a (`governance/AUTONOMY.md:315-332 @ 8fb2835a4648148f4c5178e4356475f7b687bc2c sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3`)**
- **ADR.** Touched, by one appended note under OPEN-6 (A) (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:310-312 @ H sha256:b0e2f1b1d8dd30195e121c9c2004787b0abdc146b8c35c2837ac8e14fefd5b7e`). The Status line still reads Proposed (`:3 @ H sha256:b5255d2ce8e43b999e889d2bf0b40b5765d4e1759f47ce1f214030211e8d3a3d`). No other ADR line changes.
- **Security posture.** Not touched. Nothing in the diff is governed by ADR-020, ADR-009 or ADR-021. The class-3 machinery is unchanged (check 2).
- **Wire.** Not touched. Nothing is under `protocol/`, SKP or MCP. The field is a member of the binding-local Tauri payload (`frontends/shell/src/publish/types.ts:4-11 @ H sha256:29d306bcaefc9c616e5cab655d7edb68eedf17469d13dcb4e13a4220b33c9217`).
- **Guarantee or invariant.** No existing one changes. One property is added and put under test (U1 to U3, D3, E1).
- **Other areas.**
  - No dependency or lockfile is in the diff (11 paths, all in §7's table).
  - KNOWN-LIMITATIONS and the release records are not touched.
- §1 and §8 item 1 hold.

**2. §9's architect list**
- **docs/01.**
  - Principle 7 and the never-block rule: the composer is a join over at most 32 names with no IO, inside the existing `spawn_blocking` prepare.
  - Principle 8: the line makes the publish more inspectable.
  - The derived rule that side effects are approval-gated (`docs/01_Principles.md:25 @ M sha256:7caf034eacb03745213cfafcecab1e3085fd032ed793c06e9dae823d6b922401`) is met. The approval is unchanged and only better informed.
  - Nothing is violated.
- **ADR-006 class 3 unchanged.**
  - The grant: `publish.rs:646-680 @ H sha256:5281037f7d8bbecfb1fa4c159cd38ec9480633ecde5cd6c490ae302fb510a145`.
  - The typed phrase is compared in Rust, in `boundary::execute`. `execute_with_progress` is untouched (`:777-801 @ H sha256:6093cb270703d44ae19d068650e0665437c41c10229a664db50c4c02a7cd298d`).
  - The audit pair and the TTL: no line of either is in the diff.
- **docs/02 and docs/10.**
  - Control plane only (`docs/10_SKP_Protocol.md:16-17 @ M sha256:7808f9f9036e83e0f99bf40b92848b09448731fe5cbd1c06583a64e73e5707a3`; `docs/02_Architecture.md:14 @ M sha256:d78222a885250ca9102446a309352f5691cfb2abde2775c702b557f737d3bbc1`).
  - It is one JSON string over Tauri IPC with at most 32 names (`engine/src/attributes.rs:70 @ H sha256:ae7144e04e15ebb0bf4a5ed09def61186b7f11c5aa1d94b6d745c30092f168f5`; `:542-547`), so it is never bulk data.
  - It adds no binding command, so ADR-027's console classes are unaffected.
- **§8, item by item. All 12 are met.**
  1. Only §7's paths are in the diff.
  2. The field's source is met (check 3).
  3. The page renders `{prompt.published_columns}` only (`frontends/shell/src/publish/PublishDialog.tsx:264 @ H sha256:5b15080b9cc8fe1e4772b5dbae8ddf8af97d68dd53f68db8cf6d6757fd2173da`).
  4. The bytes are W-N or the W-A fill (`publish.rs:322`, `:325-326 @ H sha256:2a46a5192a0123ab38eca3dd3b6681c2777ba32882530c3a5d7cc40691e0c881`).
  5. The only new `pub` is the field §2.1 names. Its product caller is serde, then the dialog. The composer is private, and its product caller is `:695`. `prepared_prompt` is test-module only.
  6. Met (check 5).
  7. The `RECORDED MUTATION:` lines' words match §4. The worker reports no `verify-mutation` run. The reviewer reads the runs.
  8. The four consult findings are untouched:
     - ADR-024 `:88` (TTL) is unchanged;
     - `PublishDialog.tsx`'s report pointer is not in the diff;
     - G3's JUDGE question is byte-unchanged in the diff;
     - PR B's form is not in the diff.
  9. KNOWN-LIMITATIONS is not edited.
  10. Met (check 6).
  11. No path outside §7 is edited.
  12. The new tests carry no sleep, retry or timeout.
- **The seams, with the code path read and the test that crosses each.**
  - **(i) Kernel projection to the request.**
    - Path: `publish.rs:590` binds `attributes` → `:595` puts it in the request → `:608` `publish::preflight` → `kernel/src/publish/mod.rs:530 @ H sha256:8e775cffb978c5e52993a868d0a207ed323a313da83bd3e34009922a5d6ae4e8` resolves the projection from `req.attributes` → `:709` stashes it → `:793` sends it at execute (all `@ H sha256:<H>`).
    - Test: U1 compares the prompt line with the manifest the kernel wrote, `schema[2..]` (`publish.rs:1935-1969 @ H sha256:971ee0b9acdc1acd66614f462d207932beaddde984d231669b9410ccf176ff2d`).
  - **(ii) Rust to TS.**
    - Path: `#[derive(serde::Serialize)]` with no rename (`publish.rs:266 @ H sha256:380c048fce0ae58843555b1c92646d0049c416a912bc701d1d59b4441b5a2406`); the field at `:310`; the TS member `published_columns: string` (`types.ts:51 @ H sha256:a8003471469b421d049abe4dca42ae96722cb3e81e84f00a4c3897af46283df2`).
    - Test: E1 reads the member off the payload the shipped `prepare_with_progress` serialized, through the dev seam (`frontends/shell/src-tauri/src/commands.rs:621 @ H sha256:054600dc3ec0f3c65602a08e97a189fac1407aea4396a662f16a9f97dae45433`; `frontends/shell/e2e/publish.mjs:367 @ H sha256:abbba05e565acbfac27bd82ba95ae268d0e827806173db895bf1b3786d245ff3`).
  - **(iii) TS to the dialog.**
    - Path: `PublishDialog.tsx:261-264 @ H sha256:2ce420473a0755af86d9814378c10ca3d266d4b23e52e8a97cf25ff54d3c3198`.
    - Test: D3, over the real component (`frontends/shell/src/publish/PublishDialog.test.ts:221-226 @ H sha256:77a96e10b6990ae71ce1833f7af56f9fc57b3b4e1401e3b41210356bd576d62b`).
    - There is no host-to-DOM e2e, by OPEN-7 (A).
- **The human's words** (`state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:20 @ M sha256:2e05b7610c5865dc8798c45bec193cfa13b0de5bcb6cf46c913f23da802445e6`).
  - W-N matches `publish.rs:322` byte for byte.
  - W-A's fixed text before the placeholder and its final period match `:325`.
  - The placeholder is filled with names joined by `, ` (OPEN-1 (a)).
  - One name gives `Columns published: id, the geometry, and zone.` (U1, `:1943-1946`).
  - Many names follow `and ` as typed: `… and b, a, c.` (U3, `:1999-2004`; OPEN-3 (a)).

**3. The composer's source (all `frontends/shell/src-tauri/src/publish.rs @ H sha256:<H>`)**
- The vector is bound at `:590` (the base's `:565`).
- It goes into the request at `:595` (`attributes.clone()`).
- It passes preflight at `:608`.
- The line is composed at `:695` with `compose_published_columns(&attributes)`.
- It is stashed at `:709` and sent at execute at `:793`.
- The vector §2.1 calls `:439` is now `:464`, in `prepare_with_progress`. The field is not composed from it.
- There is no other `style_attributes` call (Grep: only `:464`, `:590` and the definition at `:1297`). Nothing JS sends feeds it.

**4. The added comments, clause by clause**
- **The field doc (`publish.rs:304-309`).**
  - Its three things are present and true: where it is composed; `id`, the geometry and the attributes in declared order; at most one name, with the many-name case reached only by the named U3, which exists at `:1999`.
  - "Passes preflight and is sent at execute" is true (check 3).
- **The composer's comment (`:313-319`).** The pin is contiguous on one line and at a main commit. "The kernel refuses duplicates, `id` and more than 32" is true (`engine/src/attributes.rs:542-547`, `:557-562`, `:588-592 @ H sha256:2f9ff44c430dce5308e73857a998c16e1675304ffc15dc7ed436efd07b608e79`, through `mod.rs:530`). The unreachable many-name case is named. The OPEN-2 clause is missing (D1).
- **U1 to U3 and D3: names and comments true.** Except the helper's doc (D2).
- **The `RECORDED MUTATION:` lines (`publish.rs:1933`, `:1971`, `:1997`; `PublishDialog.test.ts:220`; `publish.mjs:366 @ H sha256:2daf28b2cc43045d00a1cc813a4d249cf8a20c3f28dc9397ec50dd1a7875c7a5`).**
  - Each names the §4 mutation and the failure §4 predicts, at full 40-hex commits: 08ac45cc… for M-U1 to M-D3, and 1d45189b… for M-E1.
  - M-E1 says it was observed in the e2e itself.
- **`publish.mjs:363-365` and `:379`.** True. The shell's style document has no match variant (`frontends/shell/src/style/document.ts:18-19 @ H sha256:c63307798d1d66eae687df72c7a138ff99112ddf0d71b2a121999c61a4cdfb87`).
- **`PublishDialog.tsx:263` and `types.ts:48-50`.** True.
- **Replacement words:** D1 and D2 above.

**5. The tests at their boundaries**
- **U1.**
  - It goes through `prepare` to the shipped `prepare_with_progress` and `prepare_with_query`, then through `execute` to `execute_with_progress`.
  - It reads `manifest.json` from the `bundle_path` the kernel wrote.
  - Stubs: a test dataset (`fixture`), the test viewer and licence, and a temporary `AUDIT_LOG_ENV` under `env_lock()`.
- **D3.**
  - `PROMPT` is typed `PublishPromptData`, imported from `./types` (`PublishDialog.test.ts:19`, `:39 @ H sha256:2df7b81e7335e3a8c31d37a40455b9b0a1d44d92a4a30d901d6238d5fca871e0`).
  - The callbacks unrelated to rendering are `vi.fn()` (`:173-175`).
- **E1.**
  - It reads `published_columns`, the serde name of the Rust field, and `bundle_path` on `ExecuteOutcome::Success`. FILTERED' already reads `bundle_path` the same way.
  - Stub: only the dev-only destination seam in place of the native picker, as ADR-024 names it (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:119-130 @ H sha256:f498d3701307b8c4c6550e8deba6469b646b31633c3af36e955386a07171c1a1`).

**6. The records**
- **G3 (`frontends/shell/MANUAL-WALKTHROUGH.md:333 @ H sha256:1846956eda1a2ec577857411a57f68209b7e3356bc3560ba5fddfbb23b071218`; question 3).** True clause by clause:
  - "directly after [Row scope], with no label of its own": a `<dd>` with no `<dt>`, in block layout (`frontends/shell/src/styles.css:911-914 @ H sha256:84a57762ffc114e1b93fb73fcfb3efed5b773108518c48d0f17adbed6fa10a2c`);
  - the W-N string with G1's literal style: true;
  - "composed host-side by `compose_published_columns`": true;
  - the dated pointer naming the piece: present.
- **The APPROVED' row (`MANUAL-WALKTHROUGH.md:398 @ H sha256:d8f0221534a98c2f8c479254b20cbee849ba26ba73809dac68a9270e292bf9cd`).** It matches `publish.mjs:367` and `:381`.
- **The README passage (`frontends/shell/e2e/README.md:190-200 @ H sha256:ad9d7c9015b35eb09650d31cdb14bfcd8cf508ab0b2a31a37c2fa29c5846d74b`; question 4).**
  - It is true, and its order matches the code: the prompt check, then the manifest check before verify-bundle.
  - 8 of 8 is at the ceiling, not over it. No class 8 and no finding.
- **ADR-024's note.**
  - Its block (`ADR-024…:312 @ H`) reads, by my comparison, the same as the form's Amendment 1, item 4 block (`PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md:284 @ M`), with `<date>` filled as 2026-11-13. A script hash comparison is due from the reviewer or custodian.
  - The worker's script copies the block from the form and fills the date with `date -u +%F` (the scratch file `pac-s5-adr-append.mjs`).
  - Every clause of the note is true:
    - "renders": `PublishDialog.tsx:264`;
    - "host-composed": `publish.rs:695`;
    - "each attribute column the pending attempt publishes": check 3 (i);
    - "declared order": U3, and admission keeps the declared order;
    - "beside `row_scope` in the field list": `PublishDialog.tsx:262-264`;
    - "stays Proposed": `:3`.
  - So nothing goes to the advisor.
- **Question 1, the heading.**
  - §2.3 requires the 2026-11-06 heading pattern (`PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md:106 @ M sha256:2eb6a72899bc46acfdeaeed18e392cabefd2e4647d789a3c3ea198dde48bcb6c`).
  - Without a heading, the note would sit under the 2026-11-06 italic line, which says the note below it is from a different directive. That would misattribute the words.
  - My reading is that the heading is structure required by §2.3, not words added to the note. Amendment 1, item 4's "nothing else" governs the note's words and is met.
  - Leaving out the provenance line is consistent with item 4 and has a precedent: the 2026-10-20 note has none (`ADR-024…:300-302 @ H`).
  - §8 item 10 is met. No finding; see N1.

**7. Packet questions 2 and 5**
- **R1 and R2: not a finding.**
  - §4 requires the commit at which each mutation was observed. A commit cannot name its own id, so the lines must land after the test's commit.
  - R1 and R2 touch only §7 paths and add only comment lines. That is no scope addition (not class 9) and no overrun (not class 8).
- **`--show-cites` exit 1: not a finding of this piece, in any class.**
  - The quoted line is byte-identical at the base (`frontends/shell/src-tauri/src/publish.rs:909 @ d5598e2a46df486f2b53fe396922a5c368940261 sha256:30f0e993820adc16626aa5adc39580072847f20deb9b7f62006961cebf4f925d`) and at H (`:935 @ H sha256:30f0e993820adc16626aa5adc39580072847f20deb9b7f62006961cebf4f925d`). The diff only shifted it.
  - The scoped log (the scratch file `pac-s6-showcites.log`) also lists 30 baseline entries as unmatched, which shows that a one-file scope changes how the baseline matches.
  - CI runs the unscoped command (`.github/workflows/governance-ci.yml:158 @ H sha256:cb04397ab89f982168cceced5f44f24bed00a739d224c59305400cf30e158849`). The worker's unscoped log reports PASS.
  - The cite H adds (`publish.rs:315`) shows `[hash: PASS]` in the scoped log. That is the worker's run, not mine.

**8. Main after H merges**
- ADR-024's out-of-scope line on attribute-projection UI stays true: the line shows the columns, and no UI lets anyone choose them (`ADR-024…:283-285 @ H sha256:487174c0b3851d6f71db83ba70320e598773de923827a0ead4dc80ec3edd9d4f`).
- Item 59 agrees with W-N (`KNOWN-LIMITATIONS.md:490-491 @ H sha256:32917fd12588262e2f720ed2d79c84708dd164a83f91f3816058a0bc294340a5`).
- PR B's PB-E2 and operator row 5 read as written (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:526`, `:682 @ M sha256:24e4c694e97788aca94daa5d09619ad93652340d1c1a86150f26305bc2b8ab70`), and PR B's Amendment 12, item 7 still names item 59's edit (`:1689 @ M`). The cite defect is D3.
- G8 says the alert sits below Row scope (`MANUAL-WALKTHROUGH.md:338 @ H sha256:55991d5c70f0538a84d14f6ca810ffd24d15b0a5294279739f2fb267e368ebf2`). That stays true, now with the columns line between them.
- docs/02's ADR-024 line names no field list.
- Nothing else reads differently.

## For the advisor
None. Every clause of the note is true, and W-A and W-N are applied as ruled.

## The packet's gaps
- The commit date of b6924ace, which the note's `<date>` must equal (Amendment 1, item 4). I relied on the worker's log; the reviewer can confirm it with git.
- PR #314's body: whether it names the note's authority and will list D1 and D2.
- Whether the default `verify-quotes` scan covers `.rs` files, and so the new hash reference at `publish.rs:315`.
- The target of "Amendment 13 item 13" (D3).
