# Piece 1c: O0, the custodian's run of the committed probe on the O0 file (2026-11-10)

*The custodian's record, under item 1 of the human's message of 2026-11-10 at 16:40Z (`state/directives/2026-11-10-o0-run-now-1c-step-1-slot-1-then-pr-b-306-clicked-pan-anchor-open-1-a-diagnostic-node-closing-message-leads-with-slots.md`), which applies the terms of 2026-10-31, item 3, again. The O0 file's path is kept in the local evidence folder and goes into no record; no command printed it. Of the human's files under the profile, the custodian read the O0 file and nothing else; the probe's walk of its folder, part of the probe as the form's §3 names it, found one entry. Times are from `date -u` in the calls that ran.*

- **Before the probe, at 16:41:18Z:** the OneDrive client running, by its process name; the O0 file present. Its attributes were read without opening it, by PowerShell's `[System.IO.File]::GetAttributes`: 0x00501620, that is reparse point, sparse, offline, unpinned and recall-on-data-access, an online-only placeholder.
- **The probe:** `spikes/b2-1c-onedrive-probe/` at a88d01863f65eb1290f762f8a3f03db4b9e43a0c on `cut/b2-piece-1c-save-and-reopen`, unchanged at that branch's head 7109aeb2 (an empty diff). It was exported from that commit with `git archive`, its three files checked equal to the commit's blobs by `git hash-object`, built by `cargo build` into a scratch target (exit 0), and run with the O0 file and an absolute scratch folder outside OneDrive as its two arguments.
- **The hold:** one Bash call inside a shared hold for this project, granted and released; the build and the run ran inside it.
- **The run:** it started and ended at 16:41:58Z, with exit 0 and nothing on stderr; the junction's scratch folder was empty after it. Its output, byte for byte:

```
os=windows limit_s=120
file before anything opens it: is_symlink=false is_file=true is_dir=false len=43 attrs=0x00500020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=true pinned=false unpinned=true
file as the walk sees it: is_symlink=false is_file=true is_dir=false len=43 attrs=0x00500020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=true pinned=false unpinned=true
walk: entries=1 symlinks=0
file after the walk: is_symlink=false is_file=true is_dir=false len=43 attrs=0x00500020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=true pinned=false unpinned=true
walk_changed_metadata=false
open: ok after 238 ms
file after open: is_symlink=false is_file=true is_dir=false len=43 attrs=0x00000020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
read: bytes=43 after 0 ms
file after read: is_symlink=false is_file=true is_dir=false len=43 attrs=0x00000020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
junction: scratch_dir_made=true mklink_exit_ok=Ok(true)
junction: is_symlink=true is_file=false is_dir=false len=0 attrs=0x00000410 reparse_point=true offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
junction: link_removed=true target_kept=true dir_removed=true
junction after removal: error kind=NotFound os_error=Some(3)
done
```

- **After the probe, at 16:42:37Z:** the O0 file's attributes read 0x00000420 (reparse point and archive; the offline, unpinned and recall bits cleared): downloaded, no longer online-only. Its size is 43 bytes and its sha256 9d7d52435e9caef8408653cf9443d192c38fb4dae56488af587496d704775201, read by `Get-FileHash` after the probe's own read.
- **Against H1 (the form's §0.4):**
  - *Observed by the probe:* std reports the placeholder as not a symlink and as a regular file, before and during the walk; neither `symlink_metadata` nor the walk started the download (the recall-on-data-access bit still set after the walk, and `walk_changed_metadata=false`); the open by path started the download and completed, which cleared the bits, and the read returned the file's 43 bytes; the junction is reported as a link (`is_symlink=true`, with the reparse-point bit).
  - *Not observed by the probe:* that the placeholder is a reparse point, and what its tag is. In the probe's process the placeholder showed only recall-on-data-access and unpinned (0x00500020), with no reparse-point or offline bit, and after the read a plain 0x00000020; the custodian's reads outside the probe, before and after, showed the reparse-point bit. The probe reads no reparse tag.
  - *So,* by item 1 of the human's message: no placeholder was reported as a link, and the download completed. H1 is observed as far as the probe observes it.
- **H5:** the probe observes only that the open and the read completed. Whether the shell's liveness line and Cancel stay live during a download stays for OP1 to OP3 at the sitting, by item 1's last line.
- **Kept outside the repository** (the local evidence folder, under 2026-11-10/): the human's message as typed, the probe's output and its build log.
