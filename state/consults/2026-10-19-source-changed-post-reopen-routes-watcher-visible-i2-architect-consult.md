*Custodian's filing note (2026-10-19): the architect's one consult on I2 for `source-changed-post-reopen-routes-watcher-visible`, under the human's ruling of 2026-10-19, item 1 (`state/directives/2026-10-19-229-merged-rotation-230-ready-watcher-visible-i2-a-one-consult-r2-a-unknown-attempt-cause-a.md`). The run 2026-10-19T16:16:32Z to 16:22:25Z by its transcript (Read 14, Grep 9, Glob 1; no write); its one SubagentHandback call, at 16:22:24Z; each file and line it cites was read in its transcript. Extracted by script; 1 rooted path:line cite(s) into the branch's driver de-rooted to the form line N of path (on the branch); one final newline added if absent; nothing else changed. Its [reading] claims are untested until the runs.*

---

Consulted: source-changed-post-reopen-routes-watcher-visible, I2, the one consult, at aa30f99f0cccc29a3df190e170d76b0eee40c5c6 (main 521fc031)
Reviewed: cut/source-changed-watcher-visible @ aa30f99f0cccc29a3df190e170d76b0eee40c5c6 (worktree C:/dev/wt/wv). The ruling, the runs record and Amendment 2 were read on main at 521fc031.
Outcome: IN PLACE

**How each claim is marked.** [code] means I read it in this transcript at the line cited. [doc] means documented Windows, Rust or Node behaviour, which I name but did not read here. [reading] means my own reading, not yet tested; the repeated runs test these.

**What causes the gap now.** `makeJunction` makes the change in two calls. It calls `unlinkSync` at line 274 of `frontends/shell/e2e/source-changed.mjs` (on the branch), then `symlinkSync` at `:278` [code]. Three callers reach it through `repoint` (`:299-305`): post S4 at `:581`, S3 at `:876` and R4 at `:1220` [code]. Both checks begin with `SourceDescriptor::of`, which calls `std::fs::metadata` at `engine/src/descriptor.rs:103-104` [code]:
- the pre-check maps the error at `descriptor.rs:331-336` [code];
- the post-check maps it at `engine/src/stream.rs:1737-1746` [code].

Every detail in the six runs is that metadata call failing with os error 3, ERROR_PATH_NOT_FOUND [doc]. The runs record shows it at lines 117-119, 135-137, 164, 172, 180 and 189.

## 1. Retarget in place

**(a) What window remains**
- **R1 [reading; one part is doc].** `FSCTL_SET_REPARSE_POINT` on a directory that already has `IO_REPARSE_TAG_MOUNT_POINT`, sent with a buffer of the same tag, replaces the reparse data in one operation.
  - [doc]: a buffer with a different tag fails with ERROR_REPARSE_TAG_MISMATCH.
  - [reading]: that replacement on a matching tag succeeds.
- **R2 [reading; no Microsoft document states atomicity].** The name `out/source-changed-link` is never deleted, and no `FSCTL_DELETE_REPARSE_POINT` is issued. So an open that passes through it reaches either `a` or `b`, never ERROR_PATH_NOT_FOUND. My reading is that NTFS serializes the FSCTL against opens of the same file.
- **The helper's own handle.** The helper opens the junction with FILE_SHARE_READ|WRITE|DELETE, so its handle cannot refuse an open that passes through [doc for share modes]. Whether such an open checks share access at all is [reading]; full sharing makes the question moot.
- **A residual that is not a gap.** `of` opens the path twice: `metadata` at `descriptor.rs:103` and `File::open` at `:122` [code].
  - A rewrite between the two gives `a`'s mtime with `b`'s bytes.
  - The copies are byte-equal (`source-changed.mjs:634-638`, `:314-317`).
  - So `refuse_if_changed` finds no difference and returns Ok (`descriptor.rs:310-318`) [code]. The check reads as one that ran before the repoint.
  - It can never carry the re-read detail.

**(b) How Node can make the call** (§8 items 4 and 12 are at the form's `:313` and `:321`)
- **M1: `symlinkSync(.., "junction")` over the existing junction. Not in place.** libuv creates the directory before it sets the reparse point, so an existing name gives EEXIST. That is why `makeJunction` unlinks first (`:274`). [reading of libuv's source, not read here]
- **M2: `renameSync` over the junction. Not one operation.** MoveFileExW's MOVEFILE_REPLACE_EXISTING cannot be used when either name is a directory [doc], and a junction is a directory.
- **M3: a native addon or FFI package (koffi, ffi-napi, a `.node` file). Breaks item 12.** As far as I know, Node 24 has no API that calls DeviceIoControl and no built-in FFI [reading].
- **M4: `cmd /c mklink /J`. Breaks item 4.** It is also remove-then-create.
- **M5: `New-Item -ItemType Junction -Force`, and `fsutil reparsepoint`. Out.** `New-Item -Force` is remove-then-create [reading]. `fsutil reparsepoint` only queries and deletes [doc].
- **M6 (chosen): a persistent Windows PowerShell 5.1 child.** PowerShell 5.1 ships with Windows 10.
  - **How it works:**
    - The driver spawns it once, after `layoutJunction` (`:628`), with `-NoProfile -NonInteractive -Command -`.
    - The child compiles one P/Invoke class with Add-Type. The class calls:
      - `CreateFileW(JUNCTION, GENERIC_WRITE, full share, OPEN_EXISTING, FILE_FLAG_OPEN_REPARSE_POINT|FILE_FLAG_BACKUP_SEMANTICS)`;
      - then `DeviceIoControl(FSCTL_SET_REPARSE_POINT)` with a mount-point `REPARSE_DATA_BUFFER`: SubstituteName `\??\<absolute target>`, PrintName `<absolute target>`.
    - It reads one target per line on stdin and answers one line per target: `ok`, or the Win32 error number.
  - **Item 4: kept.**
    - No elevation. The mount-point tag needs no privilege; SeCreateSymbolicLinkPrivilege applies to symbolic links [doc].
    - It is the same call with the same tag that libuv already makes unelevated in every run's layout and repoint [reading for libuv]. The runs record no I4 and P1 held [record].
    - No `mklink`, and no other link type.
  - **Item 12: kept.** I read it as no new dependency:
    - nothing is added to `package.json`, the lockfile or the tree;
    - PowerShell 5.1 and the compiler Add-Type uses are OS components;
    - the driver already spawns an OS tool, `wmic`, at `:352-355`.
    - It is a new runtime requirement, and I name it as one.
  - **Error mapping:** Win32 5 and 1314 go to the existing I4 message (`:303-304`). 4394, and anything else, is thrown by name.
  - **Cleanup:** the child is ended at the end of `main` and in the watchdog (`:609-615`).
  - **Layout is unchanged:** it keeps unlink+create (`:271-279`), which runs before anything is opened.
- **What the next brief must carry for M6.** These are worker or form texts, not the human's wording, plus one evidence item:
  - **The "in-process" wording.** Form `:386` (A.3) and the driver comment at `:258-259`, which says "no spawned tool", become untrue of the repoint and must be reworded.
  - **§2.2's "synchronously on the trigger" (form `:125`).**
    - The request is now written on the trigger, and its ack is awaited inside the async `repointOnFirstNewStreamIssued` (`:576`).
    - The trigger, the 5 ms poll, the ladder and the bounds are unchanged (§8 item 3, `:312`).
    - The rewrite now lands after a pipe round trip. In ADR-018's terms (`:33-34`) that delay can happen, but it is neither bounded nor measured.
    - §2.9's "the same race" (`:199`) still holds for the trigger but no longer for when the repoint lands. That is for S5d's amendment to state.
  - **The ack check is a new assertion,** so it needs a mutation under §4's rule.
  - **H3 and P6 (form `:71-73`, `:254`). This one is evidence, not wording.**
    - A rewrite does not change the junction's creation time [reading]. So `lstatSync`'s birthtime would read the layout instant, and P6 would fail in every run because of the mechanism, not the ordering.
    - The time that does move is the junction's change time, `ctime` [reading: NTFS updates ChangeTime when a reparse point is set].
    - Re-aim H3 to `ctime` by amendment before the runs. If `ctime` does not move, record H3 as unread.

**(c) Why the watcher stays blind**
- **Which directories it watches.**
  - The opened path is `out/source-changed-link/source-changed-scratch.parquet` (`:264`, `:266`).
  - `arm` canonicalizes it (`engine/src/watch.rs:604-605`) [code]. On Windows, Rust's `canonicalize` uses GetFinalPathNameByHandleW, which resolves the junction [doc].
  - The parent P is `…/source-changed-targets/a` (`watch.rs:613`, `:627`).
  - The grandparent G is `…/source-changed-targets` (`watch.rs:673-683`).
  - Neither read watches a subtree: the flag is 0 (`watch.rs:256-264`).
  - The junction is an entry of `out/`, which is above G, and no handle is opened on `out/` [code].
- **Which change classes the filters admit.** P's filter is FILE_NAME | SIZE | LAST_WRITE (`watch.rs:653-654`). G's filter is DIR_NAME (`watch.rs:699`) [code].
- **How names are compared.** Only the last name component is compared, folding case, against two sets [code]:
  - for P: `source-changed-scratch.parquet` and its 8.3 name;
  - for G: the parent's name and its 8.3 name.
  - Lines: `watch.rs:430-437`, `:639-642`, `:676-682`, `:145-173`.
- **What the rewrite touches.** Only `out/source-changed-link` changes. No entry in `a/`, `b/` or `source-changed-targets/` changes.
  - Any record NTFS raises for a reparse set [reading: an attribute or last-write record] is raised in `out/`, which nothing watches.
  - Even if `out/` were watched, `source-changed-link` matches neither name set.
- **The watch handles do not move.** They hold the directories opened by their canonical paths (`watch.rs:205-213`), so the rewrite does not move them [reading].
- **The runs corroborate this.** In the 12 unmutated runs, the current repoint removed and re-created this same entry in `out/`, and no capture held a watcher line (runs record, the table and the I1 row) [record].

## 2. Rename

Not reached, because 1 holds. For the record, no rename here is gap-free:
- Windows will not replace a directory in one rename [doc]. So any swap at the junction or container level takes two renames, with an instant between them where the name is missing.
- A file-level rename happens in P, under FILE_NAME, with the matching name (`watch.rs:653-654`, `:437-442`), so the watcher sees it.

## 3. Conclusion

**IN PLACE, by M6.** The watcher stays blind for the reasons in 1(c): the rewrite's only record lands in `out/`, a directory no handle watches, and its name matches no name set. No product change is needed. None of this is a timing claim (ADR-018).

**What the repeated runs test:**
- **R1:** the child's first ack confirms the rewrite works unelevated on the existing junction.
- **R2:** no run carries the re-read detail. If it reappears, that is I2 again under §5 (form `:272`).
- **ctime:** H3, if re-aimed by amendment as above.

**Optional probe before any app run:** a second Node process stats and opens `OPEN_PATH` in a loop while the child rewrites the junction back and forth between `a` and `b`. Any os error 3 disproves R2 without spending an app run.
