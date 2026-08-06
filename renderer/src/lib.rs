//! # `renderer` — the renderer module (docs/02, docs/06)
//!
//! `docs/02` scopes this module to "GPU map rendering, labels, **style compilation**". This first
//! cut implements **style compilation and nothing else**; the GPU renderer and the label engine are
//! not here and are not claimed. The module's other half is `renderer/bundle-viewer/`, the
//! TypeScript viewer that ships inside a published bundle.
//!
//! ## What is here
//!
//! - [`canonical`] — the declared canonical-JSON subset and **the one number grammar in this
//!   repository**. The style document and the bundle manifest both use it, deliberately, so there
//!   is one grammar to specify and to re-implement rather than two that can drift.
//! - [`style`] — the style v0 **document**: schema, refusals, canonical form.
//! - [`compiled`] — compiling a document against a dataset schema and a published projection, and
//!   the deterministic resolution of a feature's draw parameters.
//!
//! ## What is deliberately absent
//!
//! - **No GPU code, no scene graph, no labels.** Naming this directory does not conjure the module;
//!   `docs/07`'s method is vertical slices, and this slice needs style compilation and a bundle
//!   viewer, not a renderer.
//! - **No dependency on `engine/`.** The style compiler validates a match column against a dataset
//!   schema, and it takes that schema as `arrow::datatypes::DataType` — a third-party type — rather
//!   than by depending on `spatial-engine`. `renderer -> engine` would invert `docs/02`'s module map
//!   and the kernel's stated role as the only module that knows two others.
//! - **No promoted probe code.** `frontends/canvas-probe` is an *instrument*, not a predecessor
//!   implementation, and nothing here is copied from it. See `README.md`.
//!
//! ## Declared recovery policy (ADR-010 rule 7)
//!
//! **`none` — fail visibly and terminate with a typed, surfaced error.** Everything in this crate
//! is a pure function; there is no long-lived session to restart, so there is no watchdog and rule 7
//! requires none. The viewer declares its own policy in its own README, because it *is* a
//! long-lived session.

/// This crate's version, for a manifest's software block. **A recorded version, not a build
/// identity** — ADR-005's Exact grade wants pinned software, and a crate version is not that.
pub const CRATE_VERSION: &str = env!("CARGO_PKG_VERSION");

pub mod canonical;
pub mod compiled;
pub mod style;

pub use canonical::{canonical_and_hash, sha256_hex, CanonicalError, Json};
pub use compiled::{compile, CompiledStyle, DrawParameters, LegendEntry, LegendKind};
pub use style::{CategoricalMatch, Rgb, StyleDocument, StyleError, Value, STYLE_VERSION};
