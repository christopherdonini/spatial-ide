#!/usr/bin/env bash
# The slice test binary alone, alternating all-cores and taskset -c 0,1, N iterations each.
n=${1:-40}
bin=/work/spatial-ide/target/debug/deps/slice-f2f9711d36270b38
cd /work/spatial-ide/engine
for i in $(seq -w 1 "$n"); do
  for cond in alone-all alone-2core; do
    log=/work/logs/slicebin-${cond}-${i}.log
    if [ $cond = alone-2core ]; then taskset -c 0,1 "$bin" > "$log" 2>&1; else "$bin" > "$log" 2>&1; fi
    rc=$?
    printf '%s\t%s\t%s\trc=%s\t%s\n' "$(date -u +%FT%TZ)" "$cond" "$i" "$rc" "$(grep -E '^test .* FAILED$' "$log" | tr '\n' ' ')" >> /work/logs/slicebin.tsv
  done
done
echo done > /work/logs/slicebin.done
