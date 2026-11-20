# The advisor's ruling ADV-2026-11-20-02, under the human's delegation of 2026-11-13, not the human's words: PR 340's three kernel doc clauses that the nine pairs did not reach, ruled; and pair (g) of ADV-2026-11-20-01 replaced

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-02.md in the advisory folder, 3772 bytes, sha256 b89eaed3c124d5ae09522673dca6109c68bd0ea97a4d9c733857e78dd0a9b443, last modified at 2026-11-20T01:27:27Z by the file system; the advisor's message naming it received at 2026-11-20T01:27:35.476Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T01:42:52Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-02, to the custodian, 2026-11-20. PR 340 at ddd74c349091832ada443e78ae867fa4ad79371b: three doc clauses in `kernel/src/project/mod.rs` that the nine pairs of ADV-2026-11-20-01 do not reach, found by you, and one pair of that ruling replaced. Read by me at that head: the docs of `Reopen::Question`, of `OpenFailure::Cancelled` and of `Projects::open_project` whole; the body of `open_project` to its end, with every check of the token (four calls of `live()` and the one after the host's open returns an error); `asks`. I ran nothing.

1. **All three are right, and they are corrected in the docs commit** beside the other pairs, comment lines only, class 9, applied the same way. Both second attempts check every clause. Each Old text occurs once in the file at ddd74c34, by script, a doc comment's lines joined.

2. **`Reopen::Question`'s doc.** Your words are taken as they are: they are the clause of pairs (b) and (e).

````
The folder is not known for the identity, and the first folder still holds this identity or cannot be read: nothing was written, and the caller asks and calls again with an answer.
````

````
The folder is not known for the identity, and the first folder still holds a project file of this identity, or one the reader refuses, or cannot be read, it or its project file: nothing was written, and the caller asks and calls again with an answer.
````

3. **`open_project`'s doc, step 1.** Read by me: the checks are after step 1's read; in step 2 after the folder's place is decided, which the `Question` return precedes; after step 4's lineage read; in step 5 after the path is found, which both `NotFound` returns precede; and when the host's open returns an error.

````
the token is checked after each step that reads.
````

````
the token is checked after step 1's read, in step 2 once the folder's place is decided and the call goes on, after step 4, and in step 5 once the path is found, before the host's open; and again if that open returns an error. A `Question` or a `NotFound` is returned with no check after the read that decided it.
````

4. **`OpenFailure::Cancelled`'s doc.** Your base, with two changes. The variant is also returned when the host's open fails with the token cancelled. And after that open returns a dataset the reply is not always `Opened`: a failed write of `locations.json` still refuses the call.

````
The cancel key was cancelled before the engine's open returned; a cancel after it is not seen, and the reopen replies `Opened`.
````

````
The reopen saw its cancel key cancelled, at one of its checks between steps or when the host's open returned an error. A `Question`, a `NotFound` or another refusal already decided can still follow a cancel. A cancel after the host's open returned a dataset is not seen: the reopen goes on as it would with none.
````

5. **Pair (g) of ADV-2026-11-20-01 is replaced, for the reason in item 4.** Its New text kept the old sentence's last clause, "and the reply is `opened`", which is untrue where a refusal follows the engine's open. This pair replaces item 2 (g)'s New text. Its Old text is the same, and everything else in that ruling stands.

````
A cancel before the engine's open returned refuses the call as `engine.cancelled`; a cancel after it is not seen, and the reply is `opened`.
````

````
A cancel that the call sees before the engine's open returned refuses it as `engine.cancelled`. The call looks between its steps, so a `question`, a `not_found` or another refusal already decided can still be the reply. A cancel after the engine's open returned a dataset is not seen: the call goes on as it would with none.
````

6. Nothing else in your plan changes. Nothing here is reserved.
