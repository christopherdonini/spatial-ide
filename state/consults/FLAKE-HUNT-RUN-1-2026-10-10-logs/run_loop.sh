#!/usr/bin/env bash
# usage: run_loop.sh <condition-name> <count> [prefix command...]
# Each run's full output goes to /work/logs/<cond>-NN.log; one summary line per run to /work/logs/runs.tsv
cond=$1; n=$2; shift 2
cd /work/spatial-ide
for i in $(seq -w 1 "$n"); do
  log=/work/logs/${cond}-${i}.log
  start=$(date +%s)
  "$@" cargo test --workspace --locked > "$log" 2>&1
  rc=$?
  end=$(date +%s)
  fails=$(grep -cE '^test .* \.\.\. FAILED$' "$log")
  printf '%s\t%s\t%s\trc=%s\tsecs=%s\tfailed_tests=%s\t%s\n' "$(date -u +%FT%TZ)" "$cond" "$i" "$rc" "$((end-start))" "$fails" "$log" >> /work/logs/runs.tsv
done
echo done > /work/logs/${cond}.done
