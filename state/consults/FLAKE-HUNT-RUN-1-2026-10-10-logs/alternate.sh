#!/usr/bin/env bash
# Alternates ordinary and two-core (taskset -c 0,1) runs until /work/logs/STOP exists or counts reach 10 each.
cd /work/spatial-ide
# wait for the orphaned ordinary-02 run to finish, then record it
while pgrep -f 'cargo test --workspace' >/dev/null; do sleep 10; done
log=/work/logs/ordinary-02.log
rc=$(grep -q '^error: test failed' "$log" && echo 101 || echo 0)
secs=$(( $(stat -c %Y "$log") - $(stat -c %W "$log") ))
fails=$(grep -cE '^test .* \.\.\. FAILED$' "$log")
printf '%s\tordinary\t02\trc=%s(parsed)\tsecs=%s(from file times)\tfailed_tests=%s\t%s\n' "$(date -u +%FT%TZ)" "$rc" "$secs" "$fails" "$log" >> /work/logs/runs.tsv
o=3; t=1
run() { # cond idx prefix...
  local cond=$1 i=$(printf %02d "$2"); shift 2
  local log=/work/logs/${cond}-${i}.log start end rc fails
  start=$(date +%s)
  "$@" cargo test --workspace --locked > "$log" 2>&1
  rc=$?
  end=$(date +%s)
  fails=$(grep -cE '^test .* \.\.\. FAILED$' "$log")
  printf '%s\t%s\t%s\trc=%s\tsecs=%s\tfailed_tests=%s\t%s\n' "$(date -u +%FT%TZ)" "$cond" "$i" "$rc" "$((end-start))" "$fails" "$log" >> /work/logs/runs.tsv
}
while [ ! -e /work/logs/STOP ] && { [ $o -le 10 ] || [ $t -le 10 ]; }; do
  if [ $t -le 10 ]; then run twocore $t taskset -c 0,1; t=$((t+1)); fi
  [ -e /work/logs/STOP ] && break
  if [ $o -le 10 ]; then run ordinary $o env; o=$((o+1)); fi
done
echo done > /work/logs/alternate.done
