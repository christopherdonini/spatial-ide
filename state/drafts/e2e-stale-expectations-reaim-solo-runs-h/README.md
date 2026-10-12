# The e2e re-aim's solo runs at H, 2026-10-10 (the custodian, exclusive holds)

What this holds: the custodian's solo runs of `e2e-stale-expectations-reaim` under its form's item 7 and Amendment 3 item 7. They ran at `C:/dev/wt/reaim`, head ef1cc519c913a2bbc5d28a86530c579fae0f3ed6, with the exe built at H by worker report 2. Each suite ran on a fresh app, in exclusive holds with nothing else of this session running. The machine script read 684 lines with its recorded sha256 before the first hold, and the session's pin read 255.
- **Window A:** regression, admission and source-changed (the default route), one run each. Each exits 0, with no step failed, and the worktree is clean after each.
- **Window B:** the console suite five times, set in advance. All five exit 0, with GROUP′ and REGRESS′ PASS each time and the worktree clean after each. In all five, the step's window held one group of two or more rows, so the split path was not the one observed; the grouped path was observed five times.
- **Every run has its own log name.**
- **The bytes:** the hold outputs and logs are byte-identical to the runs', with CRLF stored as LF. The script copy has its scratch-folder path replaced by a placeholder.

The sha256 of each file as filed:

- `window-a-hold-output.txt`: 3000cf065629b64b0027688809f6e0bda32f43d4a23ba97f7f1a06ac0c830808
- `wa-regression-1.log.txt`: 1f96d297cba2fc6a2addaee8b4ee283b251a2567198bfa9203e55d92eefc7055
- `wa-admission-2.log.txt`: 52fd866d69ea997a2508674b96cafd0d589f74b4ea5014ab179302bb1ece5446
- `wa-source-changed-3.log.txt`: 3875957a1d4b5547c0a6c2b872688428a7b0be96816ae2ffd2f9265355a0f757
- `window-b-hold-output.txt`: 82b4b1c0dca92f3e41390d9b17e2e4692e50e742c7bcd98488721b9eaee1f8dd
- `wb-console-1.log.txt`: 7994925e83c5f945f2e8ac2800526914abd0ee1f86b7a0b9908e9a2fa124d917
- `wb-console-2.log.txt`: 82b5e4ee62273a4fe701c879f5241eec02e2770919173670dfc41398b422379d
- `wb-console-3.log.txt`: cf9d18d23a04022c037ab44e45361033b2dc6454bb256d6d8afe8cc7b6169d1d
- `wb-console-4.log.txt`: 95b9f214e3606a13085f6795a40d841b57ba113c657c12e4cc5d29d2edef60f4
- `wb-console-5.log.txt`: a3efbf2ba7acd820d0a1681a693d5c3c2b702fdf6cbceca2f2ab8dce5f6eff1c
- `reaim-solo-h.sh.txt`: dfc6c81f04ecf2a9da41481fbdf3adc9bd9380d4b181bd6c0874ebe40c684154
