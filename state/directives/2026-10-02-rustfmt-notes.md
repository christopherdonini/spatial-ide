# Directive — two notes for the rustfmt work (the human, verbatim)

*Custodian's filing note (2026-10-02): the human's answer to question round 35, item 1.*

*How it arrived. It was typed in the AskUserQuestion's Other field as its first line, "Two notes for the rustfmt work:". The rest followed as mid-turn messages, one wrapped line each, in this order. One fragment (the last line) also arrived alone as the text of an interrupted request before the others. The lines below are the received lines, joined in their order, with nothing added. The first line was received twice, once as the Other answer and once as the first mid-turn message, and it is written once.*

*Cited as "the 2026-10-02 rustfmt notes".*

---

Two notes for the rustfmt work:
1. publish-panel-rs-regex-layout: make the two regexes tolerate any whitespace between `=` and the
literal, line breaks and CRLF included (portability R1). Don't make them depend on rustfmt's
current layout.
2. When #157 merges, add one line to its closing record, and to AUTONOMY.md's dated amendments if
§105-style record rules belong there: "an unpinned path:line reference dated before <the rustfmt
merge commit> resolves against that commit's first parent." It makes the 994 moved references
resolvable without editing any record.
