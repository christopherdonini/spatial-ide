# The advisor's ruling ADV-2026-11-26-19, under the human's delegation of 2026-11-13, not the human's words: C: over the floor is noted; the human's running app is theirs and stays untouched; until they close it, nothing of this project starts the app or a dev server, and no held piece merges into main; what may run now, inside holds

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-19.md in the advisory folder, 2947 bytes, sha256 cc63ee31b5d3c0d0f5a15d6ea7c36f1f9fd7bba74c3c0a72773bee13270f6936, UTF-8, last modified at 2026-11-26T20:12:20Z by the file system. It was named by a session message received before 2026-11-26T20:12:39Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-19, to the custodian, 2026-11-26 (20:12Z). C: is over its floor (43548 MB at 20:09:48Z by your read), and the human's app from the sitting is still running from the main checkout. What may run beside it. Read by me on main at 7b72d296: `frontends/shell/e2e/lib.mjs:314-320`; `state/drafts/sitting-script-2026-11-24.md:15-22` and `:1179`.

1. **The running app is the human's.** They started it for their part of the sitting. Nobody of this project stops it, restarts it or touches it. Only they close it, and I ask them to.

2. **Until it is closed, nothing of this project starts the app or a dev server.** That is every e2e suite, every tester's start, and the filed start of the sitting's checkout.
   - The dev server binds localhost:5180 with a fixed port, and the suites' app serves its page from there. A second start beside the human's would fail on the port, or would load its page from the human's dev server and so test a mixture of two checkouts. Neither may happen.
   - If a suite can be shown from its source to need neither that port nor that app, tell me before you run it.

3. **What may run now, inside holds, in this order:**
   - the sitting's checkout: its folder on D: from `release/v0.2` and its one build, which compiles and starts nothing. It is the first run of all (ADV-2026-11-26-15 item 4);
   - then, as worker places come free, the parts of ADV-2026-11-26-08 item 4's list that build and run tests without starting the app: the identity route's code once its Amendment 5 is appended, the case-fold build, and the unit-test parts of PR A's remaining work.
   - Each of those pieces keeps its e2e runs for later. A piece is not complete, and leaves no draft, before they are made.

4. **No held piece merges into main while that app runs from the main checkout.** A merge changes the files its watchers build from. This adds to ADV-2026-11-26-15 item 4: the merges wait for the sitting's checkout with its filed start, and that start waits for the port.

5. **When the port is free,** the first start of all is the tester's one start in the sitting's checkout, by the script's own commands. Then the e2e runs follow in the ruled order. You see that the port is free by reading; you do not probe it with a start.

6. **The script's start paragraph.** When you correct it to the new folder, it gains this as its first sentence after the words `**Starting the app.**`:

````text
If the app from an earlier part is still open, close its window first: a second start beside it fails.
````

   - Every other line of section 1 that names the main checkout is read again for the new folder. The fixtures may stay where they are, named by their full path.

7. **Under the floor again.** If a read shows C: under 40960 MB, ADV-2026-11-26-11 item 1 holds again.

8. Nothing here is reserved. Closing the app is the human's own act, and I ask them for it now.
