// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/** Bounds the open command list's height (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 7): the list then scrolls inside. CSS px, declared, not measured (ADR-010 rule 6). */
export const COMMAND_LIST_MAX_HEIGHT_PX = 320;

/** Bounds the field options listed at once after an `@` in `/filter` (section 7): above it the list says so and asks for more letters. A count of options, declared, not measured (ADR-010 rule 6). */
export const FIELD_COMPLETION_MAX_OPTIONS = 200;
