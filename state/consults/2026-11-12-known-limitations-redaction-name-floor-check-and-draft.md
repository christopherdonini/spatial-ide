# KNOWN-LIMITATIONS and the redaction search's 3-byte name floor: the custodian's check (2026-11-12) and a draft item for the human's sight

*Custodian's filing note (2026-11-12): the check the human asked for in their message of 2026-11-12 (10:34Z) (`state/directives/2026-11-12-flake-hunt-report-kl-check-redaction-3-byte-name-floor-draft-for-sight-nothing-else-owed.md`), docs lane, and the draft item it asks for. The words are the custodian's. This is a draft for the human's sight and not Authority: nothing is written into KNOWN-LIMITATIONS.md until the human types their approval of the words. The two drafts below are byte-copied by script from the custodian's reply to the human, its record at 2026-11-12T10:35:15.783Z by the session transcript. The checks were re-run by script at main ebf8848c, where this was written.*

## The check

**Not declared.** Item 47 (`KNOWN-LIMITATIONS.md:447 @ ebf8848c`) says a publish is refused when the bundle would contain your login name or this computer's name, and it declares the search's other floor, a match seen only inside at least 12 consecutive printable ASCII characters (`KNOWN-LIMITATIONS.md:454 @ ebf8848c`). No line of KNOWN-LIMITATIONS.md names a floor of 3 bytes: a search of the whole file for "3 bytes", "3-byte" or "three bytes" finds none, the same search finding the floor in the source.

The floor is in `kernel/src/bundle/redaction.rs`, and it covers both names:

- **Login names:** `USERNAME`, `USER` and `LOGNAME`, each kept only when it is at least 3 bytes long (`kernel/src/bundle/redaction.rs:131 @ ebf8848c`).
- **Computer names:** `COMPUTERNAME` and `HOSTNAME` under the same floor (`kernel/src/bundle/redaction.rs:158 @ ebf8848c`), and the machine's own name, read only when neither variable gives one, trimmed, under the same floor (`kernel/src/bundle/redaction.rs:166 @ ebf8848c`). The doc comment above them states the floor (`kernel/src/bundle/redaction.rs:148-150 @ ebf8848c`).

## The draft

- **(A), the custodian's recommendation:** one sentence added to the end of item 47, after its 12-character sentence:
  > Your login name and this computer's name are searched for only when each is at least 3 bytes long, so a shorter one, such as a two-letter computer name, is never searched for, and a bundle that contains it is not refused.
- **(B):** a new item:
  > **A login name or computer name shorter than 3 bytes is not searched for when you publish.** The check takes your login name from the environment (`USERNAME`, `USER` or `LOGNAME`) and this computer's name from `COMPUTERNAME` or `HOSTNAME`, or else from the machine itself, and skips any that is under 3 bytes. A bundle containing such a name is not refused.

(A) is recommended because item 47 already holds the search's other floor, so both floors sit together.

## Not done

KNOWN-LIMITATIONS.md is not edited, and no PLAN node is placed: both wait for the human's typed word on (A) or (B), or on other words. Nothing else is owed on the flake hunt's report, as the human's message says; the report is filed as `state/consults/2026-11-12-platform-flake-hunt-run-2.md`.
