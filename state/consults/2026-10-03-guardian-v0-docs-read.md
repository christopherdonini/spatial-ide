*Custodian's filing note (2026-10-03): guardian-v0's P0 supplement for the brief's §3 item 4 (install scope, and what keeps the mod out of cloud sessions), which P0 (`state/consults/2026-10-03-guardian-v0-p0-report.md`, section 4) could not settle from the build's own sources. Part 1 is the `claude-code-guide` agent's docs read; Part 2 is a `web-fetch` agent's check of its quotations against the pages. Both arrived as messages and are transcribed here from their hand-backs, with the harness's two-space indent removed. One harness line above Part 1's report, which flagged the report's settings-file wording as instruction-shaped, is the harness's and is left out. **Read with Part 2:** Part 1's quotations are confirmed there, 9 of 11 exact and 2 near (C1 lacks the final period; D2 has `next` for `next()`, and lacks the final period). **One of Part 1's own summary lines is wrong:** in section 4, "The tool call does not run" contradicts its own quotation from the events page, and P0's timeout probe (section 6). A hook that fails before calling `next` with no `.catch` is skipped, and the call runs. **A finding for the README:** `disableAllHooks` also stops the settings hooks (Part 2, the last line), the repository's Stop hook and round mirror among them, so it is not an off-switch to recommend for Guardian alone.*

---

## Part 1 — the docs read (`claude-code-guide`)

# Plugin Scope, Cloud Sessions, Mod Timeouts – Facts from Official Docs

## 1. Settings files by scope (where recorded; which committed)

**User scope** → `~/.claude/settings.json` (not committed)
**Project scope** → `.claude/settings.json` (committed to repo)
**Local scope** → `.claude/settings.local.json` (not committed)

*From https://code.claude.com/docs/en/plugins/install.md — "Choose an install scope" section:*
> "A plugin's install scope decides who gets the plugin and which settings file records it as enabled: **User scope**: the plugin is enabled for you in every project on this machine. The entry goes in `enabledPlugins` in `~/.claude/settings.json`. **Project scope**: the plugin is enabled for everyone who works in this repository. The entry goes in `.claude/settings.json`, which you commit. **Local scope**: the plugin is enabled for you in this repository only. The entry goes in `.claude/settings.local.json`."

---

## 2. Cloud session plugin loading

Cloud sessions do **NOT** load plugins declared in repository's `.claude/settings.json` or user-scope plugins installed on your machine. The documentation does not explicitly state what a cloud session DOES load via plugins; it only addresses what it does not load.

*From https://code.claude.com/docs/en/plugins/install.md — "Cloud session" tab:*
> "A [cloud session](/docs/en/claude-code-on-the-web), including [the browser at claude.ai/code](/docs/en/claude-code-on-the-web), has no plugin browser and doesn't load the plugins you installed on your own machine or the ones your repository's `.claude/settings.json` turns on."

*From https://code.claude.com/docs/en/plugins/loading.md:*
> "A cloud session doesn't add the marketplaces a repository lists under [`extraKnownMarketplaces`](/docs/en/settings-reference#extraknownmarketplaces), because that requires the workspace trust dialog, which a cloud session never shows."

---

## 3. Documented way to keep user-scope plugin from loading in particular session/environment

Three options are documented:

- **One session only**: start Claude Code with `--safe-mode`, which disables all mods (and other customizations)
- **Globally**: set `"disableAllHooks": true` in `~/.claude/settings.json`
- **Per-plugin**: disable it individually via `/plugin` panel or `claude plugin disable <name>`

There is **no documented way to selectively disable a specific user-scope plugin from loading in only a cloud session or remote environment** while keeping it active in local sessions. The `--safe-mode` flag disables all mods for one session and requires starting Claude Code with that flag.

*From https://code.claude.com/docs/en/plugins/mods/overview.md — "Turn mods on or off" section:*
> "To turn mods off, choose how many to stop, and for how long... **Every installed mod, for one session**: start Claude Code with [`--safe-mode`](/docs/en/cli-reference#cli-flags), which also disables your other customizations. **Every mod you installed, in every session**: set [`"disableAllHooks": true`](/docs/en/settings-reference#disableallhooks) in `~/.claude/settings.json`."

---

## 4. Mod hook time limit and `.catch` grace period; timeout behavior

**Hook time limit**: 10 seconds (excluding time in `next()` or mods API calls other than `$.clock.sleep`)
**`.catch` handler time limit**: 1 second

**When a hook throws or times out without `.catch`**:
- *Before calling `next()`*: Claude Code skips it; next handler in chain runs
- *After calling `next()` (result already resolved)*: that result stands; nothing runs a second time

**Tool call result on timeout**: The tool call does not run. The hook is skipped, and Claude Code's normal behavior (permission check, etc.) proceeds.

*From https://code.claude.com/docs/en/plugins/mods/reference.md — "Limits" table:*
> "| A hook's own execution time for one event, not counting time inside `next` or a mods API call other than `$.clock.sleep` | 10 seconds |
> | A `.catch` handler's execution time | 1 second |"

*From https://code.claude.com/docs/en/plugins/mods/events.md — "Handle a hook that fails" section:*
> "When a hook with no `.catch` handler throws, times out, or returns a result of the wrong shape, what happens next depends on whether it had called `next`: **It failed before calling `next()`**: Claude Code skips it, and the next handler runs in its place. **It failed after `next` resolved**: that result stands, and nothing runs a second time."

---

## 5. "Mods overview" and "React to events with a mod" pages – existence and URLs

**Both pages exist and are documented:**

- **"Mods overview"**: https://code.claude.com/docs/en/plugins/mods/overview.md
- **"React to events with a mod"**: https://code.claude.com/docs/en/plugins/mods/events.md

*From https://code.claude.com/docs/en/plugins/mods/overview.md (first line):*
> "# Mods overview — Add panes, commands, and tool call rules to Claude Code with a mod."

*From https://code.claude.com/docs/en/plugins/mods/events.md (first line):*
> "# React to events with a mod — Handle Claude Code events from a mod: observe, rewrite, or answer tool calls, prompts, and turns, filter which events a hook handles, and plan for other mods."

---

## Summary for your preregistration

For the `spatial-guardian` mod at `tools/mods/spatial-guardian/`:
- **User scope only** (via marketplace add + install with `--scope user`): lives in `~/.claude/settings.json`, never reaches cloud sessions
- **Project scope** (with `--scope project`): lives in `.claude/settings.json` (committed), also does not reach cloud sessions
- To prevent it loading in cloud or remote sessions: it already won't, per the documented behavior
- Hook timeouts: 10 s, `.catch` 1 s; refusing hooks that time out before `next()` don't prevent tool run (hook is skipped)

## Part 2 — the quotations checked against the pages (`web-fetch`)

*The custodian's brief named each passage by an id (A1 to A4 on install.md, B1 on loading.md, C1 and C2 on mods/overview.md, D1 and D2 on mods/events.md, E1 the Limits rows on mods/reference.md), and asked for EXACT, NEAR or ABSENT, ignoring only Markdown link syntax and bold markers. The answer, transcribed:*

A1, EXACT
A2, EXACT
A3, EXACT (on the page the same bullet goes on: "Committing that entry turns the plugin on for your collaborators but doesn't download it to their machines, ...")
A4, EXACT
B1, EXACT
C1, NEAR (the page has no final period): "Every installed mod, for one session: start Claude Code with `--safe-mode`, which also disables your other customizations"
C2, EXACT (on the page the same bullet goes on: "Your settings hooks and custom status line stop too. What your organization manages keeps running.")
D1, EXACT (on the page a colon follows `next`; the sentence before it is "A hook that fails doesn't break the session, and you can decide what happens instead.")
D2, NEAR (the page has `next` instead of `next()`, and no final period): "It failed before calling `next`: Claude Code skips it, and the next handler runs in its place"
E1, EXACT. The two rows read: "| A hook's own execution time for one event, not counting time inside `next` or a mods API call other than `$.clock.sleep` | 10 seconds |" and "| A `.catch` handler's execution time | 1 second |"
disableAllHooks, YES, on page C (overview), in the bullet "Every mod you installed, in every session": "Your settings hooks and custom status line stop too." Page D (events) does not mention `disableAllHooks`.
