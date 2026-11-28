# The reload keys' form: an inventory of its line cites, the evidence-reader

*Filed by the custodian. The evidence-reader (sonnet by its definition, file inventory mode) read the draft's lines 15 to 321 in D:/wt/read-1127c at dda3521f80e62ed039db66885cfa737695f6426f, and the files it names there and in D:/wt/reload at 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645, read only. It wrote no file. By its completion notice it took 57461 ms and 3 tool uses. Its hand-back is below as received, with the harness indent removed: 7629 bytes, sha256 230b5bb8ee9eef017545ed6927912ee57a32b24046ff2cd61a87f05fb82f26fe. That hash is of the bytes as received. At filing, its rows 1 and 46 are shortened to their file names, as the form's Amendment 1 item 1 shortens the same two cites, so that main's cite check does not read them against main; nothing else is changed. It makes no judgment; the custodian's use of it is the form's Amendment 1 item 10.*

---

64 cites found; 7 UNRESOLVED (rows 10, 34, 35, 36, 37, 49, 59).

Method note: file existence and line counts came from Grep (pattern ^, count mode) on the named files, not from Glob or Read. Counts are Grep line counts. "R:" is D:/wt/reload and "main:" is D:/wt/read-1127c. For [M] cites the packet asked for the R check only on [R] or untagged cites, so R is given as information only. Crate cites were not checked (n/a).

Abbreviations:
- ADR = docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md
- LIB = frontends/shell/src-tauri/src/lib.rs
- RF = governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md
- SCT = frontends/shell/src-tauri/Cargo.toml

| # | Draft line | Cite as written | Tag | File | Range | R | main |
|---|---|---|---|---|---|---|---|
| 1 | 25 | ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:164-182 | R | ADR | 164-182 | exists, 193 lines, ok | file ABSENT |
| 2 | 36 | governance/PLAN.yaml:7985 | M | governance/PLAN.yaml | 7985 | (info) 7943 lines, 7985 exceeds | exists, 7994 lines, ok |
| 3 | 46 | wry-0.55.1/src/lib.rs:1687-1688 | crate | wry-0.55.1 src/lib.rs | 1687-1688 | n/a | n/a |
| 4 | 47 | wry-0.55.1/src/webview2/mod.rs:571 | crate | wry-0.55.1 src/webview2/mod.rs | 571 | n/a | n/a |
| 5 | 47 | :582-586 | crate | wry-0.55.1 src/webview2/mod.rs (from the same line) | 582-586 | n/a | n/a |
| 6 | 50 | governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md:58 | M | RF | 58 | (info) 731 lines, ok | exists, 934, ok |
| 7 | 51 | :59 ("the same form :59") | M | RF | 59 | (info) ok | ok |
| 8 | 52 | ADR-037:174 | R | ADR | 174 | exists, 193, ok | ABSENT |
| 9 | 52 | :178 | R | ADR | 178 | ok | ABSENT |
| 10 | 56 | tauri.conf.json:14-20 | R | UNRESOLVED (words: "[R] `tauri.conf.json:14-20` gives the one window no such key"; no directory given) | 14-20 | candidate frontends/shell/src-tauri/tauri.conf.json: exists, 46 lines | same candidate: exists, 46 lines |
| 11 | 57 | :60 ("the reload form :60") | M | RF | 60 | (info) ok | ok |
| 12 | 60 | :130 ("ADR-037 states the beforeunload absence at [R] :130") | R | ADR | 130 | ok (193) | ABSENT |
| 13 | 61 | frontends/shell/src/layout/StudioLayout.tsx:279-304 | R | same | 279-304 | exists, 463, ok | exists, 463, ok |
| 14 | 64 | tauri-2.11.5/src/webview/webview_window.rs:2369-2376 | crate | tauri-2.11.5 | 2369-2376 | n/a | n/a |
| 15 | 64 | tauri-2.11.5/src/webview/mod.rs:1666-1677 | crate | tauri-2.11.5 | 1666-1677 | n/a | n/a |
| 16 | 65 | tauri-2.11.5/Cargo.toml:84-91 | crate | tauri-2.11.5 Cargo.toml | 84-91 | n/a | n/a |
| 17 | 65 | frontends/shell/src-tauri/Cargo.toml:58 | R | SCT | 58 | exists, 107, ok | exists, 107, ok |
| 18 | 66 | tauri-2.11.5/src/webview/mod.rs:149-151 | crate | tauri-2.11.5 | 149-151 | n/a | n/a |
| 19 | 66 | :177-184 | crate | tauri-2.11.5 src/webview/mod.rs | 177-184 | n/a | n/a |
| 20 | 67 | tauri-runtime-wry-2.11.4/src/lib.rs:1618-1627 | crate | tauri-runtime-wry-2.11.4 | 1618-1627 | n/a | n/a |
| 21 | 67 | :3993 | crate | tauri-runtime-wry-2.11.4 src/lib.rs | 3993 | n/a | n/a |
| 22 | 71 | :9175 | crate | webview2-com-sys-0.38.2 src/bindings.rs | 9175 | n/a | n/a |
| 23 | 71 | :8920 | crate | same | 8920 | n/a | n/a |
| 24 | 72 | :1022 | crate | same | 1022 | n/a | n/a |
| 25 | 72 | :1021 | crate | same | 1021 | n/a | n/a |
| 26 | 73 | :35015-35026 | crate | same | 35015-35026 | n/a | n/a |
| 27 | 73 | :35003-35014 | crate | same | 35003-35014 | n/a | n/a |
| 28 | 73 | :34885 | crate | same | 34885 | n/a | n/a |
| 29 | 74 | :35672-35696 | crate | same | 35672-35696 | n/a | n/a |
| 30 | 74 | :35660-35671 | crate | same | 35660-35671 | n/a | n/a |
| 31 | 77 | tauri-2.11.5/src/lib.rs:179-184 | crate | tauri-2.11.5 | 179-184 | n/a | n/a |
| 32 | 77 | wry-0.55.1/src/lib.rs:377-415 | crate | wry-0.55.1 | 377-415 | n/a | n/a |
| 33 | 77 | webview2-com-0.38.2/src/lib.rs:2 | crate | webview2-com-0.38.2 | 2 | n/a | n/a |
| 34 | 82 | Cargo.lock:5615-5619 | R | UNRESOLVED (words: "[R] `Cargo.lock:5615-5619`"; two lockfiles exist, Cargo.lock 2622 lines and frontends/shell/src-tauri/Cargo.lock 6428 lines, in both checkouts) | 5615-5619 | root 2622 (exceeded); shell 6428 (ok) | same counts |
| 35 | 82 | :5703-5704 | R | UNRESOLVED (same as 34) | 5703-5704 | root exceeded; shell ok | same |
| 36 | 82 | Cargo.lock:5586-5597 | R | UNRESOLVED (same) | 5586-5597 | root exceeded; shell ok | same |
| 37 | 82 | :5690-5691 | R | UNRESOLVED (same) | 5690-5691 | root exceeded; shell ok | same |
| 38 | 85 | wry-0.55.1/src/lib.rs:1713 | crate | wry-0.55.1 | 1713 | n/a | n/a |
| 39 | 86 | :1716 | crate | wry-0.55.1 src/lib.rs | 1716 | n/a | n/a |
| 40 | 87 | :1723 | crate | wry-0.55.1 src/lib.rs | 1723 | n/a | n/a |
| 41 | 94 | frontends/shell/e2e/pan-anchor.mjs:64 | R | same | 64 | exists, 316, ok | exists, 316, ok |
| 42 | 94 | project.mjs:414 | R | frontends/shell/e2e/project.mjs (directory from the preceding path) | 414 | exists, 535, ok | exists, 500, ok |
| 43 | 94 | recentre-crossing.mjs:84 | R | frontends/shell/e2e/recentre-crossing.mjs (same) | 84 | exists, 347, ok | exists, 347, ok |
| 44 | 99 | :75 ("the reload form :75, :505") | M | RF | 75 | (info) ok | ok |
| 45 | 99 | :505 | M | RF | 505 | (info) 731, ok | 934, ok |
| 46 | 111 | lib.rs:607-612 | R | LIB | 607-612 | exists, 676, ok | exists, 610 lines; 612 EXCEEDS |
| 47 | 112 | :616-639 | none | LIB (from line 111) | 616-639 | 676, ok | 610, EXCEEDS |
| 48 | 113 | :391-392 | none | LIB (from line 111) | 391-392 | ok | ok |
| 49 | 156 | capabilities/default.json:1-11 | R | UNRESOLVED (words: "[R] `capabilities/default.json:1-11`"; no parent directory) | 1-11 | candidate frontends/shell/src-tauri/capabilities/default.json: exists, 11, ok | same: exists, 11, ok |
| 50 | 157 | lib.rs:616-639 | none | LIB (from line 111; bare "lib.rs") | 616-639 | 676, ok | 610, EXCEEDS |
| 51 | 158 | lib.rs:270-341 | none | LIB (same) | 270-341 | ok | ok |
| 52 | 161 | lib.rs:589-607 | none | LIB (same) | 589-607 | ok | 610, ok |
| 53 | 178 | (:607) | none | LIB (from the "setup()" and "lib.rs" context) | 607 | ok | ok |
| 54 | 178 | (:612) | none | LIB | 612 | ok | 610, EXCEEDS |
| 55 | 178 | (:533-536) | none | LIB | 533-536 | ok | ok |
| 56 | 181 | lib.rs:577-584 | none | LIB | 577-584 | ok | ok |
| 57 | 188 | :322 ("the reload form :322") | M | RF | 322 | (info) ok | ok |
| 58 | 189 | frontends/shell/e2e/source-watch-idle.mjs:131-153 | R | same | 131-153 | exists, 636, ok | exists, 636, ok |
| 59 | 272 | ADR-035:133 | M | UNRESOLVED (words: "A search of `docs/` on [M] for ... finds only ADR-035:133"; the full ADR-035 filename is not given and I did not search for it) | 133 | not checked | not checked |
| 60 | 279 | tauri-2.11.5/src/webview/webview_window.rs:2371 | crate | tauri-2.11.5 | 2371 | n/a | n/a |
| 61 | 280 | tauri-2.11.5/src/webview/mod.rs:180-184 | crate | tauri-2.11.5 | 180-184 | n/a | n/a |
| 62 | 305 | :10 ("ADR-037's Context ([R] :10)") | R | ADR | 10 | ok (193) | ABSENT |
| 63 | 308 | :144 ("[R] :144", ADR-037's Consequence) | R | ADR | 144 | ok (193) | ABSENT |
| 64 | 316 | ADR-037:175 | R | ADR | 175 | ok (193) | ABSENT |

Notes:
- Row 2: the [M] cite governance/PLAN.yaml:7985 is past the end of the file at D:/wt/reload (7943 lines). The packet did not ask for an R check on [M] cites.
- Rows 46, 47, 50 and 54: the cited line is past the end of LIB at main (610 lines). They fit at D:/wt/reload (676 lines).
- ADR-037 does not exist at the exact path in the draft at D:/wt/read-1127c (rows 1, 8, 9, 12, 62, 63, 64). I did not search main for another name.
