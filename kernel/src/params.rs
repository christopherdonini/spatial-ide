//! The one operation's parameters, as fixed-layout binary.
//!
//! These bytes are opaque to `protocol/data-plane` (it carries a blob) and are decoded here, which
//! is where both sides are known. Two rules shape the layout:
//!
//! - **Coordinates cross as IEEE-754 bit patterns**, not as JSON numbers. ADR-004 amendment 1
//!   measured 1-ULP drift on JSON floats crossing the webview boundary in 3/9 runs; a viewport
//!   whose edge moves by 1 ULP silently changes which features are selected.
//! - **The viewport names its own CRS.** The engine refuses a viewport in a CRS other than the
//!   dataset's, and it can only refuse what it is told (`docs/05`: mixing CRS without a declared
//!   transform is an error).
//!
//! The dataset is named, never pathed: a client-supplied filesystem path would be an
//! arbitrary-file-read primitive on a listening socket (`docs/09`). Names resolve against datasets
//! the host opened at startup.

/// `stream_features` — open → SQL filter → stream. The only operation this slice has.
pub const OPERATION: &str = "stream_features";

#[derive(Clone, Debug, PartialEq)]
pub struct StreamParams {
    pub dataset: String,
    /// `(xmin, ymin, xmax, ymax)` in `bbox_crs`.
    pub bbox: Option<[f64; 4]>,
    pub bbox_crs: Option<String>,
    pub limit: Option<u64>,
}

const FLAG_BBOX: u8 = 0b0000_0001;
const FLAG_LIMIT: u8 = 0b0000_0010;

impl StreamParams {
    pub fn encode(&self) -> Vec<u8> {
        let mut out = Vec::new();
        let mut flags = 0u8;
        if self.bbox.is_some() {
            flags |= FLAG_BBOX;
        }
        if self.limit.is_some() {
            flags |= FLAG_LIMIT;
        }
        out.push(flags);
        put_str(&mut out, &self.dataset);
        put_str(&mut out, self.bbox_crs.as_deref().unwrap_or(""));
        if let Some(b) = self.bbox {
            for v in b {
                // Bit pattern, big-endian. Not a decimal rendering, not a JSON number.
                out.extend_from_slice(&v.to_bits().to_be_bytes());
            }
        }
        if let Some(n) = self.limit {
            out.extend_from_slice(&n.to_be_bytes());
        }
        out
    }

    pub fn decode(b: &[u8]) -> Result<Self, String> {
        let mut at = 0usize;
        let flags = *b.first().ok_or("empty parameters")?;
        at += 1;
        let dataset = take_str(b, &mut at)?;
        let crs = take_str(b, &mut at)?;

        let bbox = if flags & FLAG_BBOX != 0 {
            let mut v = [0f64; 4];
            for slot in v.iter_mut() {
                let raw: [u8; 8] = b
                    .get(at..at + 8)
                    .ok_or("truncated bbox")?
                    .try_into()
                    .map_err(|_| "truncated bbox")?;
                *slot = f64::from_bits(u64::from_be_bytes(raw));
                at += 8;
            }
            Some(v)
        } else {
            None
        };

        let limit = if flags & FLAG_LIMIT != 0 {
            let raw: [u8; 8] = b
                .get(at..at + 8)
                .ok_or("truncated limit")?
                .try_into()
                .map_err(|_| "truncated limit")?;
            Some(u64::from_be_bytes(raw))
        } else {
            None
        };

        if bbox.is_some() && crs.is_empty() {
            return Err("a viewport must name the CRS it is expressed in".into());
        }

        Ok(Self {
            dataset,
            bbox,
            bbox_crs: if crs.is_empty() { None } else { Some(crs) },
            limit,
        })
    }
}

fn put_str(out: &mut Vec<u8>, s: &str) {
    out.extend_from_slice(&(s.len() as u16).to_be_bytes());
    out.extend_from_slice(s.as_bytes());
}

fn take_str(b: &[u8], at: &mut usize) -> Result<String, String> {
    let len = u16::from_be_bytes(
        b.get(*at..*at + 2).ok_or("truncated string length")?.try_into().map_err(|_| "bad length")?,
    ) as usize;
    *at += 2;
    let s = std::str::from_utf8(b.get(*at..*at + len).ok_or("truncated string")?)
        .map_err(|e| format!("not UTF-8: {e}"))?
        .to_string();
    *at += len;
    Ok(s)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parameters_round_trip() {
        let p = StreamParams {
            dataset: "parcels".into(),
            bbox: Some([2_600_000.5, 1_200_000.25, 2_601_000.75, 1_201_000.125]),
            bbox_crs: Some("EPSG:2056".into()),
            limit: Some(1000),
        };
        assert_eq!(StreamParams::decode(&p.encode()).unwrap(), p);

        let bare = StreamParams { dataset: "parcels".into(), bbox: None, bbox_crs: None, limit: None };
        assert_eq!(StreamParams::decode(&bare.encode()).unwrap(), bare);
    }

    #[test]
    fn viewport_edges_cross_as_exact_bit_patterns() {
        // A value whose decimal rendering is lossy at 17 significant digits, and its 1-ULP
        // neighbour: the pair ADR-004 amendment 1's finding is about.
        let x = 2_600_000.123_456_789_f64;
        let neighbour = f64::from_bits(x.to_bits() + 1);
        assert_ne!(x.to_bits(), neighbour.to_bits());

        let p = StreamParams {
            dataset: "d".into(),
            bbox: Some([x, neighbour, x, neighbour]),
            bbox_crs: Some("EPSG:2056".into()),
            limit: None,
        };
        let got = StreamParams::decode(&p.encode()).unwrap();
        let b = got.bbox.unwrap();
        assert_eq!(b[0].to_bits(), x.to_bits());
        assert_eq!(b[1].to_bits(), neighbour.to_bits());
    }

    #[test]
    fn a_viewport_without_a_crs_is_rejected_at_decode() {
        let mut raw = StreamParams {
            dataset: "d".into(),
            bbox: Some([0.0, 0.0, 1.0, 1.0]),
            bbox_crs: Some("EPSG:2056".into()),
            limit: None,
        }
        .encode();
        // Blank the CRS string in place: 1 flag byte + 2 len + 1 name char + 2 len …
        raw[1 + 2 + 1] = 0;
        raw[1 + 2 + 1 + 1] = 0;
        let e = StreamParams::decode(&raw).unwrap_err();
        assert!(e.contains("CRS"), "{e}");
    }

    #[test]
    fn truncated_parameters_do_not_half_parse() {
        let full = StreamParams {
            dataset: "parcels".into(),
            bbox: Some([1.0, 2.0, 3.0, 4.0]),
            bbox_crs: Some("EPSG:2056".into()),
            limit: None,
        }
        .encode();
        for cut in 1..full.len() {
            let _ = StreamParams::decode(&full[..cut]); // must not panic
        }
        assert!(StreamParams::decode(&full[..full.len() - 1]).is_err());
    }
}
