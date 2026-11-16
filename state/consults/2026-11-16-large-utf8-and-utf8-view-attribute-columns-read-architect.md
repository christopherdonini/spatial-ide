# large-utf8-and-utf8-view-attribute-columns: the architect's read-only read, the shell side (its own O3 at PR 327; ADV-2026-11-16-01 item 5 (a)); not a gate, no verdict

*Custodian's filing note (2026-11-16): the read-only read's report from its hand-back (9191 bytes, sha256 71efdce1ba0eae47e7d1997947508f299eb24bb70e3574a6a08ba874b5e3f707), below the rule, byte for byte except as listed here. Its brief, in the Agent call (2524 bytes), was dispatched at 2026-11-16T00:54:28Z; the run 2026-11-16T00:54:28Z to 2026-11-16T00:59:32Z by its transcript, 73 calls (Glob 4, Grep 38, Read 30, SubagentHandback 1), 3 errored, model claude-opus-5-5. It ran nothing. Changes: 1 cite de-rooted to the file name, because it names a line on a branch or an untracked file and verify-cites reads a rooted cite on main: `frontends/shell/node_modules/apache-arrow/package.json` at line 5, written `package.json:5`. The advisor's ruling ADV-2026-11-16-01, item 5, asked for this read (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-01-pr-327-the-two-p6-statements-one-colour-as-drafted-colour-by-one-clause-changed-the-node-added-not-placed-pr-326-lines-compared.md`).*

---

Read-only report, not a gate, and no verdict. Read at main `c1d6ee0538cb5b16c8f1cb8f60407e90392adccf` and at H, `cut/b1-shell-half-pr-b @ 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a`. I ran nothing. Everything below is my own paraphrase unless it is in quotation marks, and those are copied exactly from the file named.

# O3 shell-side read: LargeUtf8 and Utf8View attribute columns

## The facts the five places rest on

- **The engine admits both types and sends them as they are.** At H, `engine/src/attributes.rs:81-83` and `:94` admit them unchanged. A dictionary over either type is sent as the value type (`:101`, `:121-127`).
- **The kernel marks them projectable.** At H, `kernel/src/skp.rs:2040-2045` sets `projectable` from `admit_projection_column`. `arrow_type` is the file schema's own type as text (`:2035`).
- **The shell's Arrow library reads both types.** At H, the shell uses apache-arrow 21.2.0 (`package.json:5`). Its IPC reader builds both types (`ipc/metadata/message.mjs:394-395`) and loads Utf8View's extra buffers (`visitor/vectorloader.mjs:62-72`). So `tableFromIPC` should not throw on either type. I read that; I did not test it.
- **The shell's own reader accepts neither type.** `DataType.isUtf8` matches `Type.Utf8` only (`type.mjs:45`). Both types print as `LargeUtf8` and `Utf8View` (`type.mjs:258`, `:272`).
- **The shipped default is the tiled (candidate) arm.** The default is `true` in production (H `frontends/shell/src/App.tsx:1638-1644`). The baseline arm is reached only through a switch for development builds.

The answer is the same for both types at every place, so the table covers both.

## The five places

**1. The open (admission): shown rightly, nothing refused.**
- What the user sees: the open succeeds. The column is listed as projected.
- Why: `projectionFor` keeps every projectable column (main and H `frontends/shell/src/attributes/projection.ts:15-17`). Every query asks for those columns: main `App.tsx:1654, 1767`; H `App.tsx:1670, 1783`.
- The shell checks no attribute type at admission.

**2. The batch (decode and the canvas): the whole batch is refused, and the map stays empty.**
- **Decode refuses every batch.** `copyAttributes` throws on every batch that carries the column (main `frontends/shell/src/canvas/decodeBatch.ts:124-127`; H `:127-130`). The check is `isReadableAttributeType` (main and H `attributes/values.ts:34-35`). The text is `[P6 placeholder] attribute column "<name>" has type LargeUtf8, which the shell does not read`, or the same with `Utf8View`.
- **The throw becomes a failed stream.** It passes through `pushBatch` and `pushTileBatch`, which do not catch it (H `WorkingCanvas.tsx:1474-1481`, `:1710-1717`). The stream adapter catches it as a `SinkPoisoned` terminal, cancels the stream and closes it (main and H `streaming/adapterWs.ts:114-137`, `:67-91`).
- **Baseline arm (development only):**
  - The map shows a banner: `stream SinkPoisoned: [P6 placeholder] attribute column … which the shell does not read`.
  - Cites: H `App.tsx:1805-1811`; main `App.tsx:1794`. The message is the unprefixed path through H `formatTerminalRefusal.ts:44`.
  - No feature is drawn. Each new query refuses again at its first batch.
- **Tiled arm (shipped):**
  - The failure goes to the session log only. The first-look stream logs `candidate-untiled-terminal` and records a failure (H `residency/candidateArmSession.ts:1379-1387`).
  - With no batch taken in, the extent is null. `establishFrameFromExtent` then returns early (H `:1408-1409`, `:1213-1214`), so no grid frame is set.
  - A tile terminal is logged only; the code's own words are "has no dedicated UI wiring yet" (H `:1002-1006`).
  - What the user sees, by my reading: an empty map, no banner, and at most a "partial" residency status (H `:756`, `:779`). I did not read the status text.

**3. The column (the Table): refused with a message.**
- `TableSource.add` calls `decodeBatch` and does not catch it (main and H `table/tableSource.ts:217`). The adapter turns the throw into a `SinkPoisoned` terminal.
- `terminal()` then sets `phase = "refused"` and keeps the message (main `:252-253`; H `:251-254`).
- What the user sees: `RefusalBlock` shows the same placeholder text and zero rows (H `table/TableTab.tsx:145-146`).

**4. The Feature tab: nothing to pick. The column is listed, and no value is ever shown wrongly.**
- No batch is ever resident, so a click finds no feature and `readRow` is never reached (H `canvas/clickPick.ts:53`; main the same line).
- The Feature tab's projection summary lists the column as projected: main `App.tsx:2490`; H `App.tsx:2519`, through `projection.ts:36-45`.
- If decode ever accepted these types, `readCell` would throw on them (main and H `values.ts:42`, `:48`).

**5. Colour by and the column chooser.**
- **Main:** there is no Colour by and no chooser. The style panel never calls `admitsMatchKeyType` (I searched main `frontends/shell/src` and found no call).
- **H, the chooser:** it shows the column wrongly, as an offered match key.
  - The chooser's list is the projected columns with their `arrow_type` (H `App.tsx:857`).
  - `admitsMatchKeyType` accepts `'LargeUtf8'` and `'Utf8View'` (H `renderer/style-ts/src/style.ts:45-47`), and the panel filters on it (H `style/StylePanel.tsx:94`).
- **H, Apply:** refused with a message.
  - The first-scope wait runs on the Table's source. That source refuses (place 3), so the outcome is not-applied with reason `refused` (H `style/categoryCases.ts:44-52`).
  - The user sees the line `[P6 placeholder] The values could not be read, so nothing was applied.` (H `StylePanel.tsx:58`, `:192`).
- **H, drawing:** a second refusal sits behind the first.
  - `readColumn` returns `null` for anything but Utf8 (H `values.ts:99`).
  - `matchGroups.ts:31` (H) leaves such rows to the caller.
  - If decode alone were widened, a column the chooser offers could draw wrongly with no error raised. I did not read how `matchGroups` draws a `null`.

## Does a refusal at decode fail the open or the map as a whole?

By my reading, the open does not fail, but the map fails as a whole. One unreadable projected column refuses every batch of every stream: the canvas, every tile, the Table and Colour by's wait. In the shipped tiled arm, no banner tells the user why.

## What reading could not settle

1. **Whether `tableFromIPC` really decodes an engine-written Utf8View batch** (its extra buffer counts) before the shell's own check. If it throws first, the detail becomes Arrow's own message rather than the placeholder. The path still ends in `SinkPoisoned` and an empty map either way.
2. **What the shipped tiled arm shows.** I did not read:
   - the residency status text;
   - whether `hasPlanned` stays false;
   - whether any tile is ever planned without a frame.

   So "an empty map with no banner" is my reading, not something I saw.
3. **Whether arrow-rs's `Display` gives exactly `LargeUtf8` and `Utf8View` for `arrow_type`** in the engine's pinned arrow version. The doc at H `style.ts:40-43` says it does. I did not check that claim against the crate.
4. **Which shipped files make the engine send either type.** That is lead-data's side and is outside this read.

**Probes the custodian could run:**
- **(a) Shipped build.** Write a small GeoParquet whose attribute column is `large_string`, and another whose column is `string_view` (for example with pyarrow). Open each in a production build. Record the map, any banner, the residency status, the Table tab, and Colour by's chooser and Apply line. Read the session log for `candidate-untiled-terminal … SinkPoisoned` and its detail.
- **(b) Unit level.** Run a vitest that builds an IPC batch with a LargeUtf8 column and a Utf8View column through apache-arrow 21.2.0. Call `decodeBatch` on it, and record which error is thrown and where. `testUtils/attributeBatchIpc.ts` builds only `utf8` today (H `:10`, `:22`).
- **(c) Describe.** Run the kernel describe on those files and record `arrow_type` and `projectable`.

## Where a fix would sit (no fix proposed)

- **Shell:**
  - `frontends/shell/src/attributes/values.ts`: `isReadableAttributeType` (`:34-35`), `readCell` (`:42`), `readColumn` (`:99`), and the narrower doc at `:33`.
  - The type check in `copyAttributes` (H `decodeBatch.ts:127-130`).
  - The chooser's filter, `admitsMatchKeyType` (H `style.ts:45-47`), as used at H `StylePanel.tsx:94`.
- **Or the engine:** the emitted type returned at H `engine/src/attributes.rs:94` and `:101`.
- **Separately:** in the shipped tiled arm a failed stream reaches only the log. The code says so itself at H `candidateArmSession.ts:1002-1006`, and the user cannot see the refusal. That gap is wider than this node.

**Outside the question.** By my reading, a dictionary column has a mismatch in the other direction:
- `arrow_type` is the file's type (`Dictionary(…)`, H `kernel/src/skp.rs:2035`), but the batch carries the value type (H `engine/src/attributes.rs:101`).
- So a dictionary over Utf8 decodes, yet the chooser does not offer it.
- A dictionary over LargeUtf8 or Utf8View is refused the same way as above.

I did not probe either case.