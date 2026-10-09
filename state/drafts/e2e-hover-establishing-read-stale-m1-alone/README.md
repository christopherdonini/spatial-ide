# The custodian's exclusive solo runs of 2026-10-09: e2e-hover-establishing-read-stale-m1-alone

What this holds: PR #196's M1 run alone twice (the architect gate's E1), at ac89e033, window height 801, each in an exclusive hold of the custodian's, with the hold output of both windows and the scripts that ran. Filed by the custodian. Each file is byte-identical to what the run wrote, except the script copies (`*.sh.txt`, `*.mjs.txt`), whose scratch-folder path is replaced by a placeholder. The sha256 of each file as filed:

- `window-1-hold-output.txt`: 041e9cbd09fb0be7f3083123954a5cf8e8c862f42d01870d8cfd4ada63a4546c (its 13 CRLF line endings stored as LF under the repository line-ending policy)
- `m1-alone-801-run1.log.txt` (the run wrote it as `m1-alone-801-run1.log`; renamed because the repository ignores *.log): d8b44bc33fa699b8a166f6edc72073774e46702dfc8fbb2c4c2ebb014ce9104a
- `window-2-hold-output.txt`: 9567bd3f4000aec0713acdbf5329991fd531164de0c2d67cd6acb59a32479a86 (its 9 CRLF line endings stored as LF under the repository line-ending policy)
- `m1-alone-801-run2.log.txt` (the run wrote it as `m1-alone-801-run2.log`; renamed because the repository ignores *.log): 08d167000638ad6a7a4d3159bef586ce165e6eda71f0978d9c4f9f60c38a91df
- `solo.sh.txt`: 317be92244453efb489d21e6edc5d98c689bb673c3446c1273ec6098b540a6e1
- `m1-only.sh.txt`: 9b7dc0a2577bb8e144cb0068b4ed321bbbbcd6c09a9163bd71e89c129eb7156d
- `m1-apply.mjs.txt`: 752cf5831ba6c74bd102386f01fd1ca166fe14f68eb09e509d3c4fc5d395e99c
