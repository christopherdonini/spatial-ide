# The advisor's draft ADV-2026-11-26-21, for the human's approval, not the human's words and not in force: pull requests against release/v0.2 and the final merge; no hook, workflow or mod changed for the branch; security posture stays the human's; a dated note on ADR-020

*Filed by the custodian AS A DRAFT, as ADV-2026-11-26-22 item 1 orders (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-22-what-goes-to-the-human-is-one-draft-draft-d-taken-as-standing-rules-the-sittings-checkout-a-worktree-on-d.md`). It is written in the human's voice for their approval. It is not their words, it is not approved, and nothing in it is acted on until the human approves it in the custodian's session. Source: PASTES/ADV-2026-11-26-21.md in the advisory folder, 2579 bytes, sha256 1e3cd7949f446b8365df6d8df171d1849ef0083619c86c99679c35e123d96a97, last modified at 2026-11-26T20:22:17Z by the file system. It was named by a session message received before 2026-11-26T20:22:47Z (date -u, taken after it was copied). Filed byte for byte below. Nothing is changed.*

Draft for Chris's approval.

To the custodian, 2026-11-26. The advisor reads this as filed and places it. It follows the architect's read of what assumes main (`state/consults/2026-11-26-release-v0-2-what-assumes-main-scripts-hooks-workflows-architect-read.md`), which my second addition to ADV-2026-11-26-01 asked for.

1. **Pull requests against `release/v0.2`.** The advisor checks and merges them as it does for main. Where its standing instruction says that a pull request is based on `main`, it now also takes one based on `release/v0.2`, for what I named for that branch: the sitting's result logs and the docs-only piece that follows the sitting. Anything else needs my naming it.
   - Nothing is merged from main into such a pull request, and its gates read the range from `release/v0.2`.
   - It merges by a merge commit. Nobody pushes to `release/v0.2` any other way.

2. **The final merge.** After the tag, when I say so, the advisor merges `release/v0.2` into main after its check, by a merge commit, never squashed and never rebased. The branch stays on the remote.

3. **No hook, workflow or mod is changed for the branch.** The read found one gap: the message GitHub writes for a merge into `release/v0.2` is not read by the exposure scan until the final merge. I accept that. At its merge check the advisor reads the pull request's title and branch name for a profile path instead. The Pages deploy is never started on that branch.

4. **Security posture stays mine.** That is what `docs/09` covers, how the data plane admits a consumer (ADR-019, ADR-020), and what the page is allowed to call: the app's commands and the files under `capabilities/`. The advisor may rule that a piece changes none of this only when the piece's gates say so in so many words. Where a gate finds a change, or cannot say that there is none, the piece comes to me.

5. **ADR-020 gets a dated note,** appended at its end in the pull request that lands ADR-037, the fix for a reload of the window. Its text:

````text
## Note 2026-11-26 — the page-load closure has a second arm (ADR-037)

*The human's words, by their approval of ADV-2026-11-26-21. Nothing above this heading is changed.*

From the piece that lands ADR-037, the closure registered on `on_page_load` has a second arm, for `PageLoadEvent::Started`, which ADR-037 decides. The self-check of Amendment 1 is unchanged and still runs only on `Finished`. Where Amendment 1 says that the hook runs only on `Finished`, that is said of the self-check.
````

6. Everything else of my delegation of 2026-11-13 stands as it is.
