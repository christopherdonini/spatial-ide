// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `spatial-skp` — SKP v0 wire types (docs/02, docs/10).
//!
//! **Zero dependency on `spatial-engine`, `spatial-data-plane` or `spatial-kernel`.** This crate
//! defines request/response shapes, handle types and the error envelope only; `kernel/src/skp.rs`
//! is where they meet the engine and the data plane. Collapsing that boundary is exactly what
//! `docs/02` warns against: "`protocol/` is a directory in its own right, not a subtree of
//! `kernel/`... collapsing it is how the SKP surface gets absorbed into the kernel and the ADR-004
//! control/data-plane split stops being structural."
//!
//! See `SKP-V0.md` (this crate's own directory) for the design note this module implements,
//! including the mandatory named-deferral list and the three brief corrections the architect review
//! made before any of this was written.

pub mod v0;
