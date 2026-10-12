#!/usr/bin/env bash
# usage: exp_loop.sh <phase> <count> ; slice binary alone under taskset -c 0,1
phase=$1; n=$2
bin=/work/spatial-ide/target/debug/deps/slice-f2f9711d36270b38
cd /work/spatial-ide/engine
for i in $(seq -w 1 "$n"); do
  log=/work/logs/exp-${phase}-${i}.log
  taskset -c 0,1 "$bin" > "$log" 2>&1
  rc=$?
  printf '%s\t%s\t%s\trc=%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$phase" "$i" "$rc" "$(grep -E '^test .* FAILED$' "$log" | tr '\n' ' ')" "$(grep -o 'EXPERIMENT-DIAG: no producer_cancelled; events=[0-9]* dropped=[0-9]* batches_generated=[0-9]* batches_after_cancel=[0-9]*' "$log")" >> /work/logs/exp.tsv
done
echo done > /work/logs/exp-${phase}.done
