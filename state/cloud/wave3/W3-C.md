# Wave 3, W3-C (one batch: W3-A+W3-B+W3-C): the session's report

**Source:** session_01BrZYKUFM4c4oVeA27A2Yrd, the final assistant turn (the page's timestamp 2026-09-30T07:38:24Z). Copied at 2026-09-30T07:54:47Z (the saved copy's write time) with the message's own Copy action in claude.ai/code, and saved with LF line endings: 133 lines, sha256 9c301d86be9a59161c56abc7aa492ea1b0b1eeb244d41b90de93aa844d67abd0. Everything between the two rules below is the session's text, verbatim. The WAVE3 REPORT proper begins at `# WAVE3 REPORT`, and the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally at triage, after the batch ends, per `state/cloud/wave1-prompts.md` §3, carried into wave 3 by `state/cloud/wave3-prompts.md` §1. The saved text scans clean under the profile-path scanner's `--message` mode.

---

I confirmed the directive matches origin/main and that rm isn't needed since outputs get overwritten anyway. I'll write run.sh with the Write tool and run it without the removal step.

Outputs are clean: no profile paths, and the only nonzero exits are the expected ones (`which`/`mount` for btrfs/xfs, and `cp --reflink`). Next I'll run the DCO hook proof, then commit.

The hook rejected the unsigned commit (exit 1, HEAD unchanged). Now the signed commit and push.

# WAVE3 REPORT
## Worker fields
Item: C          Lens/purpose: Measure the Linux acquisition candidates in PORTABILITY-2026-09-30 §4 (read lease, FICLONE, change attribute) and the torn-capture case (A1 without A2) on this container's filesystems. Evidence only.
Baseline SHA: a02354677d6c03aaed4b2dbdf4d14b09621d5766 (confirmed by `git -C /tmp/wave3-baseline rev-parse HEAD` at start). At the end, the same command returns the probe commit 7b3025999ba2df3650648c841338a9de764d4e24, whose parent is the baseline.
Branch: cloud/wave3-C   Commits: 7b3025999ba2df3650648c841338a9de764d4e24 (signed off, pushed, no PR)
Environment:
- **System:** Linux vm 6.18.44-fc-v50 #1 SMP PREEMPT_DYNAMIC x86_64; Ubuntu 24.04.4 LTS.
- **Privileges:** uid=0 (root). CapEff=000001fffeffffff; `capsh` lists cap_lease in the bounding set; `Current: =ep cap_sys_resource-ep`.
- **Kernel settings:** `/proc/sys/fs/leases-enable`=1, lease-break-time=45, dirty_expire_centisecs=3000.
- **Tools:** gcc 13.3.0. rustc 1.94.1, cargo 1.94.1, node v22.22.2 and npm 10.9.7 are present but none were used.
- **Network:** git fetch and push to the repository only; no packages installed.
- **Filesystems probed** (`stat -f -c %T` / `findmnt -T`):

| Directory | stat -f | findmnt |
|---|---|---|
| Working directory `/tmp/wave3-baseline/spikes/wave3-prepare-linux/work` | ext2/ext3 | / on /dev/vda, ext4 |
| `/tmp/wave3-probe` | ext2/ext3 | same device, st_dev=65024 |
| `/dev/shm/wave3-probe` | tmpfs | tmpfs, st_dev=28 |

- **Could not create:** btrfs and xfs. `mount -t btrfs -o loop …` and `mount -t xfs -o loop …` both returned "unknown filesystem type" with exit 32. Neither appears in `/proc/filesystems`, there is no `/lib/modules` and no modprobe, and `mkfs.btrfs`/`mkfs.xfs` are absent (`out/env.txt`).
- **Directive source:** PORTABILITY-2026-09-30.md is not in the baseline. §4 was read with `git show origin/main:state/directives/PORTABILITY-2026-09-30.md` (introduced at cf86d60), as the human allowed mid-session.

Commands run (all probes are in `spikes/wave3-prepare-linux/src/`; `src/run.sh` rebuilds and regenerates every file in `out/`):
- `git worktree add /tmp/wave3-baseline a0235467…` → 0; `git -C /tmp/wave3-baseline rev-parse HEAD` → a0235467… (0).
- Earlier development runs of each probe (exits 0) gave the same results. They were overwritten by the final `bash src/run.sh` → 0, 2 min 12 s.
- Nonzero exits inside run.sh, all expected: `which mkfs.btrfs mkfs.xfs` → 1; both mount attempts → 32; `cp --reflink=always` → 1 on all three filesystems.
- Probe exits: all probe1/3/4 runs → exit=0.
- `git config core.hooksPath .githooks`; unsigned `git commit` → exit 1, with "error: commit has no Signed-off-by trailer (DCO 1.1 …)". HEAD stayed a0235467.
- `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s` → 0; `git push -u origin cloud/wave3-C` → 0.
- One `rm` of old outputs was blocked by the safety check and was not run. It wasn't needed, because run.sh overwrites the same file names.

Findings: 0 (this was a measurement task; the results are in Measurements below)

### Measurements
All of these are observations on this kernel and these filesystems only. "ext4 ×2" means the working directory and /tmp gave identical results.

**Probe 1 — read lease** (`probe1_lease <dir> c2`; `out/probe1_lease_*.txt`)

The three filesystems gave identical results once timings are masked: the md5 of the result lines was 8a3607a4… for all three.

| Case | ext4 ×2 | tmpfs |
|---|---|---|
| (a) O_RDONLY, no other opener | GRANTED (0), F_GETLEASE=F_RDLCK | same |
| (a′) the same process also holds an O_RDWR fd | REFUSED, errno=11 EAGAIN | same |
| (b) another process holds O_WRONLY | REFUSED, errno=11 EAGAIN. Granted again after that writer closed | same |
| (b2) another process holds O_RDONLY | GRANTED | same |
| (c1) lease held; another process opens O_WRONLY; holder releases 0.5 s after the signal | The holder got SIGRTMIN (set via F_SETSIG) with si_fd set to the lease fd, about 0.000 s after the fork. F_GETLEASE read F_UNLCK straight after the signal. The opener blocked and its open() returned after 0.500–0.501 s. The holder's attempt to re-take the lease was then REFUSED (EAGAIN) | same |
| (c1b) opener uses O_WRONLY\|O_NONBLOCK | The signal was still delivered, but open() returned −1 EAGAIN at once. After the holder released, it could take the lease again (GRANTED) | same |
| (c1c) opener uses O_RDONLY | No signal within 2 s; open() returned at 0.000 s; the lease stayed F_RDLCK | same |
| (c1d) opener uses O_RDWR\|O_TRUNC | Signal delivered; the opener blocked for 0.500–0.501 s until the holder released | same |
| (c2) the holder keeps the lease | Signal delivered; F_GETLEASE read F_UNLCK from then on. The opener stayed blocked until the kernel removed the lease at lease-break-time: open() returned after 45.049–45.052 s. Re-taking the lease afterwards was REFUSED (EAGAIN) | same |
| (d1) root (CAP_LEASE) on a file owned by uid 65534 | GRANTED | same |
| (d2) uid 65534 on its own file (control) | GRANTED | same |
| (d3) uid 65534, no CAP_LEASE, on a root-owned 0644 file | REFUSED, errno=13 EACCES | same |
| (e1) another process holds MAP_SHARED\|PROT_WRITE, fd still open | REFUSED, EAGAIN | same |
| (e2) another process holds MAP_SHARED\|PROT_WRITE, fd closed, mapping kept | REFUSED, EAGAIN | same |

**Probe 2 — clone** (`probe2_clone <dir>`; `cp --reflink=always`; `out/probe2_clone.txt`)

| Filesystem | ioctl(FICLONE) | cp --reflink=always |
|---|---|---|
| ext4 (working directory) | −1, errno=95 EOPNOTSUPP | "failed to clone … Operation not supported", exit 1 |
| ext4 (/tmp) | −1, errno=95 | same, exit 1 |
| tmpfs | −1, errno=95 | same, exit 1 |
| btrfs, xfs | not measurable here: the kernel has neither driver (mount returned "unknown filesystem type") | not measurable here |

**Probe 3 — change attributes** (`probe3_changeattr <dir>`; `out/probe3_changeattr_*.txt`)

- statx stx_mask=0x1fff. `STATX_CHANGE_COOKIE` is not defined in the userspace headers, so no change-cookie field could be requested.
- Size never changed in any step, because every write is the same size and in place.
- "Changed" in the table means mtime and ctime both changed.

| Step (writer is another process) | ext4 ×2 | tmpfs |
|---|---|---|
| (a) pwrite 4 B | changed | changed |
| (a) pwrite again straight after a stat, and again 10 ms later | changed each time | changed each time |
| (a-rep) 200 back-to-back pwrites with a statx after each | change visible 200/200 | 200/200 |
| (b1) mmap only | unchanged | unchanged |
| (b1) first store to page 0 | changed | changed |
| (b1) second store to page 0, 50 ms later | **unchanged** | **unchanged** |
| (b1) first store to page 1, 50 ms later | **unchanged** | changed |
| (b1) store to page 0 again, then a re-stat 2 s later | unchanged | unchanged |
| (b1) store to page 0 after 35 s with no msync (past dirty_expire) | changed | **unchanged** |
| (b1) munmap | unchanged | unchanged |
| (b2) first store to page 0 | changed | changed |
| (b2) second store, 50 ms later | unchanged | unchanged |
| (b2) msync(MS_SYNC) | unchanged | unchanged |
| (b2) store to page 0 after msync | changed | **unchanged** |
| (b2) next store, then msync, then munmap | unchanged | unchanged |

**Probe 4 — torn capture** (`probe4_torn <dir> 30 <inplace|trunc> 64 16 1 <pause_us>`; `out/probe4_torn_*.txt`)

Setup:
- The file is 64 MiB. The writer process rewrites it in 16 write() calls of 4 MiB each. The reader process copies it with 1 MiB read() calls. There is no lease and no lock.
- The reader's start is offset from the writer's start by a pseudo-random delay (seed 1) between −R and +W, where R and W are the calibrated reader-alone and writer-alone times.
- Every 4 KiB page carries a (version, page) tag, so each page of the copy can be classified as old, new, or mixed within the page.
- Calibration: reader alone 13.2–21.3 ms. Writer alone 12.7–36.8 ms back to back, or 91.9–118.8 ms with a 5 ms pause between write() calls.
- Row labels: "inplace" means the writer opens O_WRONLY and overwrites from offset 0. "trunc" means it opens O_WRONLY|O_TRUNC and writes the file again from empty.

| Filesystem | Mode | Pause | Old | New | Neither (of 30) | Detail of "neither" |
|---|---|---|---|---|---|---|
| ext4 (working directory) | inplace | 0 | 7 | 16 | 7 | full length, old and new pages mixed; 5 had pages mixed within a single 4 KiB page |
| ext4 (working directory) | inplace | 5 ms | 2 | 5 | 23 | mixed; 3 with mixed pages |
| ext4 (/tmp) | inplace | 0 | 8 | 14 | 8 | mixed; 6 with mixed pages |
| ext4 (/tmp) | inplace | 5 ms | 4 | 5 | 21 | mixed; 4 with mixed pages |
| tmpfs | inplace | 0 | 11 | 16 | 3 | mixed; 2 with mixed pages |
| tmpfs | inplace | 5 ms | 5 | 8 | 17 | mixed; 1 with mixed pages |
| ext4 (working directory) | trunc | 0 / 5 ms | 0 / 0 | 13 / 2 | 17 / 28 | short copies. Empty: 7 / 7. Old prefix only: 10 / 2. New prefix only: 0 / 19. Mixed prefix: 1 / 1 |
| ext4 (/tmp) | trunc | 0 / 5 ms | 0 / 0 | 8 / 3 | 22 / 27 | Empty: 8 / 7. Old prefix: 10 / 2. New prefix: 4 / 18. Mixed: 1 / 1 |
| tmpfs | trunc | 0 / 5 ms | 0 / 0 | 13 / 7 | 17 / 23 | Empty: 2 / 3. Old prefix: 12 / 3. New prefix: 3 / 17. Mixed: 1 / 1 |

Example trial (`tmp-ext4_inplace_pause5000`, trial 1): the writer ran over [0, 101.5] ms and the reader over [27.8, 55.5] ms. The copy had 10240 old pages and 6144 new pages, with new pages starting at page 0, so it matches neither version. Every "neither" copy was delivered by read() with no error.

### Unproven observations (not findings; at most five, one line each)
1. On ext4, the first store to page 1 did not change mtime after page 0 had been stored. Hypothesis (not examined): pages 0 and 1 share one large folio, so only one write fault occurs.
2. After any first store through a writable mapping, later stores changed no attribute until writeback (ext4) or ever (tmpfs, even after msync), so a before-and-after attribute check missed repeated mmap writes in every probed sequence.
3. After a lease break, F_GETLEASE read F_UNLCK even though the opener was still blocked. A holder that polls F_GETLEASE, rather than handling the signal, sees "no lease" for the whole break window.
4. With a 5 ms pause between writes, the torn fraction rose from 3–8/30 to 17–23/30 (inplace), which suggests the fraction depends on the writer's pace. That pace is not a property of the filesystem.
5. The lease cases in probe 1 used a 16-byte file, and the read lease was not combined with the 64 MiB torn-capture copy of probe 4. That combination was not measured.

### Stops (if any): none.

## Custodian fields (filled locally, never by the worker)
Session ID:    Model:    Launched/ended:
Spend:
Disposition per finding:    Final severity:    Reason:
Reproduced locally (Windows):

---

## Custodian fields (filled locally, never by the worker)

(Filled at triage, after the batch ends.)
