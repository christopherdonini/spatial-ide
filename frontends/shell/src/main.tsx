// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { installGlobalErrorHandlers, reportRecoveryPolicyNone } from "./diagnostics/errorHandlers";
import { logSessionEvent } from "./diagnostics/log";
import { setStallHandler, startWatchdog } from "./diagnostics/watchdog";

// ADR-010 rule 7: unconditional, and genuinely first. Nothing else in this file may execute before
// this line, and the rest of the application is loaded via a **dynamic** import specifically so
// that "first" is true in the sense that matters: ES modules evaluate every *statically* imported
// module's top-level code before the importing module's own top-level code runs, regardless of
// where the `import` statement is textually written. A static `import App from "./App"` here would
// let React/deck.gl's own module-graph evaluate before the handlers below are installed. This is
// the first long-lived rendering session this codebase ships, and rule 7 is the discipline the
// ADR-003 spike's M4 investigation paid for -- an application error must never present as a
// hardware hang, and that guarantee starts here or it does not exist.
installGlobalErrorHandlers();
reportRecoveryPolicyNone();
setStallHandler((phase, openMs) => {
  logSessionEvent("watchdog-stall", `phase "${phase}" open for ${Math.round(openMs)} ms`);
});
startWatchdog();

void import("./bootstrap").then(({ mount }) => mount());
