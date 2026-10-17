# publish-approval-unknown-attempt-under-load, step 1: the custodian's M1 run at the head

*The custodian's record (2026-10-17), under `frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md`, Amendment 3 item 4, on the human's ruling (`state/directives/2026-10-17-227-m1-watcher-visible-open-1-a-item-23-node-228-merged.md`, item 1). One run, in a scratch worktree detached at 6a00d6a843b951cd2ccfe42d60245dfdc718b90d (`C:/dev/wt/ua1-m1`, removed after), under the harness's approval; no hold (a plain Node test, light). The lines below are byte-copied from the run's output, by script.*

## The mutation, applied alone

M1 as `exportElapsed.test.mjs` line 5 records it: the verdict's comparison `u > t` replaced by `true`. The diff, 1 line in and 1 out in `frontends/shell/e2e/exportElapsed.mjs`:

```diff
-  if (u > t) return { status: "INCONCLUSIVE", message: `${what}; more than the TTL may have passed since the prepare was sent, so an expiry is not excluded (${figures})` };
+  if (true) return { status: "INCONCLUSIVE", message: `${what}; more than the TTL may have passed since the prepare was sent, so an expiry is not excluded (${figures})` };
```

## The runs, in `frontends/shell`, each `npm run test:export-elapsed`

1. **Before, unmutated:** exit code 0.

```text
✔ T1 the TTL read from the real publish.rs is 120000 ms (2.1606ms)
✔ T2 the E-EXPORT run line (U its printed duration) reads FAIL (0.7564ms)
✔ T2 the E-ASK-TWO run line (U its printed duration) reads FAIL (0.1723ms)
✔ T3 an unknown-attempt with U = T + 1 reads INCONCLUSIVE, with U = T reads FAIL (0.1223ms)
✔ T4 a success and a refused outcome, each with U = 10 T, give no verdict (0.1452ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0
```

2. **With M1:** exit code 1. The named test, T2's E-EXPORT line, fails; so do T2's E-ASK-TWO line and T3.

```text
✔ T1 the TTL read from the real publish.rs is 120000 ms (1.9241ms)
✖ T2 the E-EXPORT run line (U its printed duration) reads FAIL (2.4009ms)
✖ T2 the E-ASK-TWO run line (U its printed duration) reads FAIL (0.2461ms)
✖ T3 an unknown-attempt with U = T + 1 reads INCONCLUSIVE, with U = T reads FAIL (0.2099ms)
✔ T4 a success and a refused outcome, each with U = 10 T, give no verdict (0.1479ms)
ℹ tests 5
ℹ pass 2
ℹ fail 3
```

3. **Reverted** (`git checkout` of the file): `git status --porcelain --untracked-files=all` printed nothing; exit code 0.

```text
✔ T1 the TTL read from the real publish.rs is 120000 ms (1.8151ms)
✔ T2 the E-EXPORT run line (U its printed duration) reads FAIL (0.7792ms)
✔ T2 the E-ASK-TWO run line (U its printed duration) reads FAIL (0.1727ms)
✔ T3 an unknown-attempt with U = T + 1 reads INCONCLUSIVE, with U = T reads FAIL (0.1359ms)
✔ T4 a success and a refused outcome, each with U = 10 T, give no verdict (0.1528ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0
```

## Reading

M1 is observed as the worker recorded it at dcaed6ed: T2 for E-EXPORT fails, and T2 for E-ASK-TWO and T3 fail with it. The worker's observation remains the observation of record; this run agrees with it at the head.
