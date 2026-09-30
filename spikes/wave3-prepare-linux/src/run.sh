#!/usr/bin/env bash
# run.sh -- builds and runs every probe; raw outputs go to out/. Run from spikes/wave3-prepare-linux/.
# Probe files live in ./work (the worktree filesystem), /tmp/wave3-probe and /dev/shm/wave3-probe.
set -u
B=$PWD; W=$B/work; mkdir -p "$W" out /tmp/wave3-probe /dev/shm/wave3-probe
for p in probe1_lease probe2_clone probe3_changeattr probe4_torn; do gcc -O2 -Wall -o "$W/$p" "src/$p.c" || exit 1; done
DIRS="worktree-ext4:$W tmp-ext4:/tmp/wave3-probe devshm-tmpfs:/dev/shm/wave3-probe"

# environment
{
  for c in "uname -a" "cat /etc/os-release" "id" "grep Cap /proc/self/status" "capsh --print" \
           "cat /proc/sys/fs/leases-enable" "cat /proc/sys/fs/lease-break-time" \
           "cat /proc/sys/vm/dirty_expire_centisecs" "cat /proc/sys/vm/dirty_writeback_centisecs" \
           "cat /proc/filesystems" "gcc --version" "nproc" "free -m"; do
    echo "\$ $c"; $c 2>&1; echo "exit=$?"; done
  for s in $DIRS; do d=${s#*:}; echo "\$ stat -f -c %T $d"; stat -f -c %T "$d"; echo "\$ findmnt -T $d"; findmnt -T "$d"; done
  echo "\$ which mkfs.btrfs mkfs.xfs"; which mkfs.btrfs mkfs.xfs; echo "exit=$?"
  echo "# attempt: mount a btrfs and an xfs image on a loop device (kernel driver presence)"
  truncate -s 300M /tmp/wave3-probe/fsimg
  for t in btrfs xfs; do mkdir -p /tmp/wave3-probe/mnt-$t
    echo "\$ mount -t $t -o loop /tmp/wave3-probe/fsimg /tmp/wave3-probe/mnt-$t"
    mount -t $t -o loop /tmp/wave3-probe/fsimg /tmp/wave3-probe/mnt-$t 2>&1; echo "exit=$?"
    rmdir /tmp/wave3-probe/mnt-$t; done
  rm -f /tmp/wave3-probe/fsimg
} > out/env.txt 2>&1

# probe 1 (includes the 45 s "holder keeps the lease" case; the three directories in parallel)
for s in $DIRS; do n=${s%%:*}; d=${s#*:}
  ( echo "\$ probe1_lease $d c2"; "$W/probe1_lease" "$d" c2; echo "exit=$?" ) > "out/probe1_lease_$n.txt" 2>&1 &
done; wait

# probe 2
{ cp --version | head -1
  for s in $DIRS; do d=${s#*:}
    echo "## $d fs=$(stat -f -c %T "$d")"; echo "\$ probe2_clone $d"; "$W/probe2_clone" "$d"; echo "exit=$?"
    head -c 1048576 /dev/zero > "$d/cp_src.dat"; echo "\$ cp --reflink=always cp_src.dat cp_dst.dat  (in $d)"
    ( cd "$d" && cp --reflink=always cp_src.dat cp_dst.dat ) 2>&1; echo "exit=$?"
    rm -f "$d/cp_src.dat" "$d/cp_dst.dat"
  done
} > out/probe2_clone.txt 2>&1

# probe 3 (the three directories in parallel)
for s in $DIRS; do n=${s%%:*}; d=${s#*:}
  ( echo "\$ probe3_changeattr $d"; "$W/probe3_changeattr" "$d"; echo "exit=$?" ) > "out/probe3_changeattr_$n.txt" 2>&1 &
done; wait

# probe 4 (sequential, so trials do not compete with each other)
for s in $DIRS; do n=${s%%:*}; d=${s#*:}; for mode in inplace trunc; do for pause in 0 5000; do
  f=out/probe4_torn_${n}_${mode}_pause${pause}.txt
  ( echo "\$ probe4_torn $d 30 $mode 64 16 1 $pause"; "$W/probe4_torn" "$d" 30 $mode 64 16 1 $pause; echo "exit=$?" ) > "$f" 2>&1
done; done; done
