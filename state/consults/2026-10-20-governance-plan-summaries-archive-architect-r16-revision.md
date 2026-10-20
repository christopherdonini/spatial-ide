*Custodian's filing note (2026-10-20): the architect's revision of R16 and MR16 in governance D's draft, on the custodian's request that no mutation need an edit of `.claude/settings.json`; its second SubagentHandback, at 20:55:52Z, in the same transcript. Applied to the committed form by script, the before line found once. Extracted by script; one final newline added if absent; nothing else changed.*

---

R16 and MR16 are redrafted below. MR16 now changes only the path R16 reads: it points R16 at a copy the test writes in its own temp directory, with one SessionStart entry added. R16 itself reads the real `.claude/settings.json` without writing to it. The reader is a function inside the test file, not an export of the script.

One other line of the form names R16's settings check: the B (iii) row of the clause-check table in §2 item 7. It needs no change, because it does not say how the settings are read.

**1. The R16 bullet in §4 (MR16 is in it)**

before:
```
- R16 `rotate-plan-summaries: no hook in .claude/settings.json runs the script`. **MR16:** a SessionStart entry running it.
```

after:
```
- R16 `rotate-plan-summaries: no hook in .claude/settings.json runs the script`. The test's reader, a function inside the test file and not an export of the script, takes a settings file's path, parses that file, and returns every hook command that names `rotate-plan-summaries.mjs`. R16 calls it on the real `.claude/settings.json`, read only, and asserts an empty list; the test never writes that file. **MR16:** R16's path switched to a copy that the test writes in its own temporary directory, the real settings' content with one SessionStart entry running the script added; R16 then fails by name. The mutation is applied to that copy only; the real `.claude/settings.json` is never edited.
```

**2. The B (iii) row of the clause-check table in §2 item 7: no change**

before:
```
| B (iii) | `isDue` through the glob; the nothing-to-move branch; settings | R7, R12, R16 |
```

after: unchanged, byte for byte.

No other line of the form names MR16.
