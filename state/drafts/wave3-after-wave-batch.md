# Wave 3 — the after-wave batch for Fable (draft for the human to relay)

*Custodian's draft, 2026-09-30, on the wave-3 authorisation's item (d) (`state/directives/2026-09-30-wave3-authorisation.md`) and `state/cloud/wave3-prompts.md` §5. It is a summary with pointers: every result it names is in the verbatim reports under `state/cloud/wave3/`, each followed by its custodian fields, and in the ledger `state/cloud/wave3.md`. Nothing here is ruled. Paraphrase throughout; nothing below is a quotation.*

## 1. S1 candidates: none

The custodian's triage (wave 1 §4's rule, against main at 292f3f4) finds no S1 candidate. One S2 is sent for weighing:

- **A-2 (W3-A): redaction's hostname is invisible off Windows.** `MachineIdentifiers::from_environment` reads only COMPUTERNAME and HOSTNAME, and default Linux shells do not export HOSTNAME. So the machine-identifier class never reaches an audit record's residual classes there, and the property `kernel/PERMISSION-BOUNDARY.md:293-295` states silently weakens (PORTABILITY R1). Proven on Linux by a reproducer on `cloud/wave3-A` (8a2ba65); macOS is code-path-only.
  - The case for S2: no product runs off Windows today (KNOWN-LIMITATIONS 1), and Windows always sets COMPUTERNAME.
  - The case for S1: it is a permission-boundary property, which wave 1 §4 lists under S1.
  - Proposed node: `redaction-hostname-off-windows`.

## 2. W3-C's measurements (input to B2's preregistration, PORTABILITY §4)

`state/cloud/wave3/W3-C.md`: a Linux container (kernel 6.18.44, Ubuntu 24.04.4, root with CAP_LEASE), ext4 (two directories) and tmpfs. btrfs and xfs could not be created, so clones on a reflink filesystem were not measurable. Every result is an observation on this kernel and these filesystems only.

- **Probe 1, read lease** (for A1 and A2). Identical on all three filesystems.
  - Granted with no other opener.
  - Refused (EAGAIN) while another process holds the file open for writing, or holds a shared writable mapping, even with its descriptor closed.
  - A writer's open blocks until the holder releases, or until lease-break-time (45 s here) if the holder keeps the lease.
  - After a break, F_GETLEASE reads unlocked while the opener is still blocked.
  - Without CAP_LEASE, refused on a file the caller does not own.
- **Probe 2, clone.** FICLONE is unsupported (EOPNOTSUPP) on ext4 and tmpfs.
- **Probe 3, change attributes** (for the before-and-after check).
  - A write() changed mtime and ctime every time.
  - Through a shared writable mapping, a repeated store to a page already stored to changed no attribute.
  - ext4 changed again only after writeback: a store after 35 s, or after msync. tmpfs never did, even after msync.
  - A first store to a second page changed tmpfs's attributes but not ext4's.
  - The change-cookie field was not available.
- **Probe 4, a torn capture** (A1 without A2, no lease). A 64 MiB file rewritten in 16 writes while copied in 1 MiB reads, 30 trials per row:
  - in place, the copy matched neither version in 3 to 23 of 30;
  - truncate-and-rewrite, in 17 to 28 of 30, as short or mixed copies;
  - the fraction rose with the writer's pace, which is not a filesystem property;
  - every torn copy was delivered with no error.
- W3-C's five unproven observations are in its report. The lease was measured on a 16-byte file, and was not combined with the 64 MiB capture.

## 3. Routing (no cut during the wave)

- **Proposed nodes (unplaced):**
  - `posix-backslash-in-shared-path-logic` (A-1, S2);
  - `redaction-hostname-off-windows` (A-2, S2, above);
  - `windows-case-fold-non-ascii`: §1c-2's correction (b), the one item touching Windows. The fold there is ASCII-only while NTFS folds non-ASCII letters. S2, code-path-only.
- **Intake appended to the port nodes' summaries:**
  - port-1: W3-B's counts (777 passed, 0 failed, 54 ignored on Linux), the ignore-reason naming, WAVE3-1 and WAVE3-2;
  - port-2: A-3, the application-directory and case corrections;
  - port-3: the four WebKitGTK packages in order, and the disk figure.
- **The lesson for the next wave's baseline rule,** Fable's, is recorded in `state/cloud/wave3.md` with a pre-launch check: every path a prompt names is tested at the baseline with `git cat-file -e`.

## 4. Spend

The batch's single delta is recorded in `state/cloud/wave3.md` once the human reads the after-balance ($201 before).
