# The custodian's exclusive solo runs of 2026-10-09: e2e-stale-expectations-reaim-console-alone

What this holds: the e2e console suite run alone, unmodified, on the shipped default arm at window height 800, at ac89e033 (whose frontends/shell/src and e2e/console.mjs are identical to main's), for the e2e re-aim's form. Filed by the custodian. Each file is byte-identical to what the run wrote, except the script copies (`*.sh.txt`, `*.mjs.txt`), whose scratch-folder path is replaced by a placeholder. The sha256 of each file as filed:

- `console-alone-800.log.txt` (the run wrote it as `console-alone-800.log`; renamed because the repository ignores *.log): cbbee23e66a965ff8adc540415f4dea7cbc1d1398afcb0fcf582be29c760f0a4
