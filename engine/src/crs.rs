// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! CRS as a **type**, and the admission policy for a source that does not carry one.
//!
//! `docs/05`: "CRS is part of the dataset's type and flows through every operation." A dataset that
//! reaches this module without a CRS does not become a dataset with a default CRS; it is refused.
//!
//! This answers the question ADR-013 explicitly hands to the engine's first cut ("the admission
//! policy for undeclared or mismatched source CRS belongs with the engine's first cut and is not
//! decided here"). The decision is recorded as **ADR-015 (Proposed)**. ADR-013 is Proposed, binds
//! nothing, and is deliberately **not** implemented here: nothing in this file is per-row
//! provenance, and the word `provenance` is avoided so the two are not conflated (ADR-013 §3 makes
//! provenance a per-row *column*; what is below is a dataset-level *envelope* fact).

use crate::error::{EngineError, Result};

/// The identifier used when a CRS definition carries no authority and code.
///
/// **It is a marker, not a name.** Every definition-only dataset shares this string, so it can
/// never be compared against anything to decide identity — the full definition travels alongside
/// it and is the only thing that identifies such a CRS. Named as a constant rather than written as
/// a literal so the places that must *refuse* to compare it are greppable.
pub const DEFINITION_ONLY: &str = "(definition-only)";

/// Where the dataset's CRS came from. A file fact and a caller's assertion are different things and
/// stay distinguishable all the way onto the wire.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CrsSource {
    /// Read from the file's own `geo` metadata.
    File,
    /// Supplied by the caller for a file that declares nothing. Recorded with who and when.
    CallerAsserted,
}

impl CrsSource {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::File => "file",
            Self::CallerAsserted => "caller_asserted",
        }
    }
}

/// A caller's assertion about a file that declares no CRS. Consulted **only** in that case.
#[derive(Clone, Debug)]
pub struct CrsAssertion {
    /// e.g. `EPSG:2056`.
    pub identifier: String,
    /// The full definition, if the caller has one. Passed through verbatim; never parsed into a
    /// belief about equivalence.
    pub definition_json: Option<String>,
    /// Who asserted it. A string, because there is no identity model in this slice (`docs/09`).
    pub by: String,
    /// When, as an RFC-3339-shaped string supplied by the caller.
    pub at: String,
}

/// Axis order as **established from the file**, never assumed.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AxisOrder {
    EastingNorthing,
    NorthingEasting,
    LongitudeLatitude,
    LatitudeLongitude,
}

impl AxisOrder {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::EastingNorthing => "easting,northing",
            Self::NorthingEasting => "northing,easting",
            Self::LongitudeLatitude => "longitude,latitude",
            Self::LatitudeLongitude => "latitude,longitude",
        }
    }

    /// The two orders this slice can emit without normalizing anything. Anything else is refused
    /// rather than reinterpreted — see `EngineError::AxisOrderUnsupported`.
    pub fn is_x_first(self) -> bool {
        matches!(self, Self::EastingNorthing | Self::LongitudeLatitude)
    }
}

/// The dataset's CRS type: identity, the definition as the file states it, where it came from, and
/// the axis order established from it.
///
/// Fields are private. The only constructors are the two admission paths below, so a `DatasetCrs`
/// cannot be assembled from a guess.
#[derive(Clone, Debug)]
pub struct DatasetCrs {
    identifier: String,
    definition_json: Option<String>,
    source: CrsSource,
    asserted_by: Option<String>,
    asserted_at: Option<String>,
    axis_order: AxisOrder,
}

impl DatasetCrs {
    /// Admission path 1 — the file declares a CRS. The file's own definition is authoritative and
    /// is passed through verbatim.
    pub(crate) fn from_file(
        identifier: String,
        definition_json: Option<String>,
        axis_order: AxisOrder,
    ) -> Self {
        Self {
            identifier,
            definition_json,
            source: CrsSource::File,
            asserted_by: None,
            asserted_at: None,
            axis_order,
        }
    }

    /// Admission path 2 — the file declares nothing and the caller asserted. The assertion must
    /// carry an axis order it establishes itself; this engine will not supply one.
    pub(crate) fn from_assertion(a: &CrsAssertion, axis_order: AxisOrder) -> Self {
        Self {
            identifier: a.identifier.clone(),
            definition_json: a.definition_json.clone(),
            source: CrsSource::CallerAsserted,
            asserted_by: Some(a.by.clone()),
            asserted_at: Some(a.at.clone()),
            axis_order,
        }
    }

    pub fn identifier(&self) -> &str {
        &self.identifier
    }
    pub fn definition_json(&self) -> Option<&str> {
        self.definition_json.as_deref()
    }
    pub fn source(&self) -> CrsSource {
        self.source
    }
    pub fn asserted_by(&self) -> Option<&str> {
        self.asserted_by.as_deref()
    }
    pub fn asserted_at(&self) -> Option<&str> {
        self.asserted_at.as_deref()
    }
    pub fn axis_order(&self) -> AxisOrder {
        self.axis_order
    }
}

/// Decide the dataset's CRS from what the file declared and what (if anything) the caller asserted.
///
/// The whole policy, in one function, so it can be read in one sitting:
///
/// | file declares | caller asserts | outcome |
/// |---|---|---|
/// | yes | no  | admitted, `crs_source = file` |
/// | yes | yes | **refused** — `CrsAssertionConflict` |
/// | no  | yes | admitted, `crs_source = caller_asserted` |
/// | no  | no  | **refused** — `CrsUndeclared` |
///
/// No name-string comparison is performed in the "yes/yes" row, and none is permitted: `docs/05`
/// decides CRS identity by definitional equivalence, which this slice does not implement because it
/// performs no transform. Refusing outright is what keeps that rule un-violated rather than
/// approximated.
pub(crate) fn admit(
    declared: Option<(String, Option<String>, AxisOrder)>,
    asserted: Option<&CrsAssertion>,
    asserted_axis_order: Option<AxisOrder>,
) -> Result<DatasetCrs> {
    match (declared, asserted) {
        (Some((id, def, axis)), None) => Ok(DatasetCrs::from_file(id, def, axis)),
        (Some((id, _, _)), Some(a)) => Err(EngineError::CrsAssertionConflict {
            declared: id,
            asserted: a.identifier.clone(),
        }),
        (None, Some(a)) => {
            let axis = asserted_axis_order.ok_or_else(|| EngineError::AxisOrderUnestablished {
                detail: "the caller's assertion carries no coordinate system to establish axis order from"
                    .to_string(),
            })?;
            Ok(DatasetCrs::from_assertion(a, axis))
        }
        (None, None) => Err(EngineError::CrsUndeclared {
            detail: "no `geo` metadata CRS on the primary geometry column".to_string(),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn assertion() -> CrsAssertion {
        CrsAssertion {
            identifier: "EPSG:2056".into(),
            definition_json: None,
            by: "test".into(),
            at: "2026-08-04T00:00:00Z".into(),
        }
    }

    #[test]
    fn file_declared_crs_is_admitted_as_a_file_fact() {
        let crs = admit(
            Some(("EPSG:2056".into(), None, AxisOrder::EastingNorthing)),
            None,
            None,
        )
        .unwrap();
        assert_eq!(crs.source(), CrsSource::File);
        assert_eq!(crs.identifier(), "EPSG:2056");
        assert!(crs.asserted_by().is_none());
    }

    #[test]
    fn an_assertion_over_a_declared_crs_is_refused_without_comparing_them() {
        // Deliberately identical strings: even agreement is refused, because deciding "these are
        // the same CRS" is a definitional-equivalence question (docs/05) this slice cannot answer.
        let e = admit(
            Some(("EPSG:2056".into(), None, AxisOrder::EastingNorthing)),
            Some(&assertion()),
            Some(AxisOrder::EastingNorthing),
        )
        .unwrap_err();
        assert!(matches!(e, EngineError::CrsAssertionConflict { .. }));
    }

    #[test]
    fn an_undeclared_crs_with_no_assertion_is_refused() {
        let e = admit(None, None, None).unwrap_err();
        assert!(matches!(e, EngineError::CrsUndeclared { .. }));
    }

    #[test]
    fn an_assertion_over_an_undeclared_crs_is_admitted_and_stays_marked() {
        let a = assertion();
        let crs = admit(None, Some(&a), Some(AxisOrder::EastingNorthing)).unwrap();
        assert_eq!(crs.source(), CrsSource::CallerAsserted);
        assert_eq!(crs.asserted_by(), Some("test"));
        assert_eq!(crs.asserted_at(), Some("2026-08-04T00:00:00Z"));
    }

    #[test]
    fn an_assertion_that_establishes_no_axis_order_is_refused() {
        let a = assertion();
        let e = admit(None, Some(&a), None).unwrap_err();
        assert!(matches!(e, EngineError::AxisOrderUnestablished { .. }));
    }
}
