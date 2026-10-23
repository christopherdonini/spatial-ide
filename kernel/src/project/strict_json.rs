// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The strict reader** (ADR-036 §2; `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §2.3).
//!
//! One reader for every file this ADR defines: the project file, a steps file's lines, and the
//! machine store's files. It tokenizes over bytes, checks its bounds before it builds anything,
//! refuses a duplicate key, and gives back the document with its members in the order the file
//! lists them (`spatial_renderer::canonical::Json`, which keeps insertion order).
//!
//! - **Layout and spelling are the writer's.** [`read`] writes the parsed document again with the
//!   renderer's own functions (`to_canonical_string`, `to_line_oriented_string`) and refuses a file
//!   whose bytes differ, naming the first line that does. So the reader and the writer cannot drift,
//!   and a number is accepted only when its token is its canonical spelling.
//! - **Numbers** are parsed with std's correctly rounded `f64` parse; `serde_json` checks a token's
//!   grammar and decodes a string's escapes, and its `float_roundtrip` feature is not in question.
//! - **Member order** is the schema's, so it is checked where the schema is: [`closed_in_order`]
//!   for a typed reader, and [`member_order_difference`] against a document the writer produced.

use std::collections::HashSet;

use serde_json::Value;
use spatial_renderer::canonical::{to_canonical_string, to_line_oriented_string, Json};

/// What a reader bounds before it builds anything.
#[derive(Clone, Copy, Debug)]
pub struct Limits {
    pub max_bytes: usize,
    pub max_depth: usize,
    pub max_string_bytes: usize,
}

/// A document's byte form: one line with no whitespace (a steps file's line, the machine store's
/// files), or the project file's line-oriented layout followed by one LF.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Layout {
    Compact,
    LineOriented,
}

/// Why a document was refused. `line` is 1-based within the document.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StrictError {
    pub path: String,
    pub line: usize,
    pub rule: String,
}

impl std::fmt::Display for StrictError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} (line {}): {}", self.path, self.line, self.rule)
    }
}

impl std::error::Error for StrictError {}

/// Tokenize `bytes` into a document. Refuses anything that is not one JSON value, a duplicate key
/// (naming the object's path), and a document past `limits`.
pub fn parse(bytes: &[u8], limits: &Limits) -> Result<Json, StrictError> {
    let mut p = Parser {
        bytes,
        at: 0,
        limits,
    };
    if bytes.len() > limits.max_bytes {
        let rule = format!(
            "the document is {} bytes, over the ceiling of {}",
            bytes.len(),
            limits.max_bytes
        );
        return Err(p.refuse("$", rule));
    }
    let v = p.value("$", 0)?;
    p.skip_space();
    if p.at != bytes.len() {
        return Err(p.refuse("$", "bytes follow the document".to_string()));
    }
    Ok(v)
}

/// [`parse`], then the layout and spelling check: the document written again in `layout` must be
/// the bytes read, to the last byte.
pub fn read(bytes: &[u8], layout: Layout, limits: &Limits) -> Result<Json, StrictError> {
    let v = parse(bytes, limits)?;
    check_spelling(&v, bytes, layout)?;
    Ok(v)
}

/// The bytes the writer gives `v` in `layout`.
pub fn spelling(v: &Json, layout: Layout) -> Result<String, StrictError> {
    let spelled = match layout {
        Layout::Compact => to_canonical_string(v),
        Layout::LineOriented => to_line_oriented_string(v).map(|s| s + "\n"),
    };
    spelled.map_err(|e| StrictError {
        path: "$".to_string(),
        line: 1,
        rule: e.to_string(),
    })
}

/// Refuse `bytes` unless they are the writer's spelling of `v`, naming the first line that differs.
pub fn check_spelling(v: &Json, bytes: &[u8], layout: Layout) -> Result<(), StrictError> {
    let spelled = spelling(v, layout)?;
    same_bytes(
        bytes,
        spelled.as_bytes(),
        "the bytes are not the canonical spelling of the document they hold",
    )
}

/// `Ok` when `read` and `spelled` are the same bytes; otherwise the refusal names the first line
/// that differs, with `rule`.
pub fn same_bytes(read: &[u8], spelled: &[u8], rule: &str) -> Result<(), StrictError> {
    let first = read.iter().zip(spelled).position(|(a, b)| a != b);
    let Some(at) = first.or((read.len() != spelled.len()).then_some(read.len().min(spelled.len())))
    else {
        return Ok(());
    };
    Err(StrictError {
        path: "$".to_string(),
        line: 1 + read[..at].iter().filter(|b| **b == b'\n').count(),
        rule: rule.to_string(),
    })
}

/// The values of a closed object, in the order `keys` declares. A missing and an unknown member
/// are each refused by path, and so is a member list that holds `keys` in another order. The
/// refusal is the member's path and the rule.
pub fn closed_in_order<'a>(
    v: &'a Json,
    path: &str,
    keys: &[&str],
) -> Result<Vec<&'a Json>, (String, String)> {
    let Json::Obj(members) = v else {
        return Err((path.to_string(), "expected an object".to_string()));
    };
    if let Some((k, _)) = members.iter().find(|(k, _)| !keys.contains(&k.as_str())) {
        return Err((format!("{path}.{k}"), "an unknown member".to_string()));
    }
    if let Some(k) = keys.iter().find(|k| !members.iter().any(|(m, _)| m == **k)) {
        return Err((format!("{path}.{k}"), "a missing member".to_string()));
    }
    let listed: Vec<&str> = members.iter().map(|(k, _)| k.as_str()).collect();
    if listed != keys {
        let rule = format!(
            "the members are out of the declared order, which is {}",
            keys.join(", ")
        );
        return Err((path.to_string(), rule));
    }
    Ok(members.iter().map(|(_, v)| v).collect())
}

/// The first path at which `a` lists an object's members in another order than `b`, or holds other
/// members or another number of elements. Values at the leaves are not compared: `b` is a document
/// the writer produced from what the reader parsed, and a named state's basis may differ.
pub fn member_order_difference(a: &Json, b: &Json) -> Option<String> {
    fn walk(a: &Json, b: &Json, path: &str) -> Option<String> {
        match (a, b) {
            (Json::Obj(x), Json::Obj(y)) => {
                let keys =
                    |m: &[(String, Json)]| m.iter().map(|(k, _)| k.clone()).collect::<Vec<_>>();
                if keys(x) != keys(y) {
                    return Some(path.to_string());
                }
                x.iter()
                    .zip(y)
                    .find_map(|((k, p), (_, q))| walk(p, q, &format!("{path}.{k}")))
            }
            (Json::Arr(x), Json::Arr(y)) if x.len() == y.len() => x
                .iter()
                .zip(y)
                .enumerate()
                .find_map(|(i, (p, q))| walk(p, q, &format!("{path}[{i}]"))),
            (Json::Obj(_), _) | (_, Json::Obj(_)) | (Json::Arr(_), _) | (_, Json::Arr(_)) => {
                Some(path.to_string())
            }
            _ => None,
        }
    }
    walk(a, b, "$")
}

/// The document as the `serde_json` value the typed readers of `dataset_ref` and `session_history`
/// take. Their `Map` is ordered by key, so the order the file listed is checked on the `Json`.
pub fn to_value(v: &Json) -> Value {
    match v {
        Json::Null => Value::Null,
        Json::Bool(b) => Value::Bool(*b),
        Json::Int(i) => Value::from(*i),
        Json::UInt(u) => Value::from(*u),
        Json::Double(d) => Value::from(*d),
        Json::Str(s) => Value::String(s.clone()),
        Json::Arr(items) => Value::Array(items.iter().map(to_value).collect()),
        Json::Obj(members) => Value::Object(
            members
                .iter()
                .map(|(k, v)| (k.clone(), to_value(v)))
                .collect(),
        ),
    }
}

struct Parser<'a> {
    bytes: &'a [u8],
    at: usize,
    limits: &'a Limits,
}

impl Parser<'_> {
    fn refuse(&self, path: &str, rule: String) -> StrictError {
        let upto = self.at.min(self.bytes.len());
        StrictError {
            path: path.to_string(),
            line: 1 + self.bytes[..upto].iter().filter(|b| **b == b'\n').count(),
            rule,
        }
    }

    fn skip_space(&mut self) {
        while matches!(self.bytes.get(self.at), Some(b' ' | b'\t' | b'\n' | b'\r')) {
            self.at += 1;
        }
    }

    fn expect(&mut self, path: &str, byte: u8) -> Result<(), StrictError> {
        self.skip_space();
        if self.bytes.get(self.at) == Some(&byte) {
            self.at += 1;
            return Ok(());
        }
        Err(self.refuse(path, format!("expected `{}`", byte as char)))
    }

    fn value(&mut self, path: &str, depth: usize) -> Result<Json, StrictError> {
        self.skip_space();
        match self.bytes.get(self.at) {
            Some(b'{' | b'[') if depth >= self.limits.max_depth => {
                let rule = format!("nested deeper than {}", self.limits.max_depth);
                Err(self.refuse(path, rule))
            }
            Some(b'{') => self.object(path, depth),
            Some(b'[') => self.array(path, depth),
            Some(b'"') => self.string(path).map(Json::Str),
            Some(b'-' | b'0'..=b'9') => self.number(path),
            Some(_) => self.word(path),
            None => Err(self.refuse(path, "the document ends here".to_string())),
        }
    }

    fn word(&mut self, path: &str) -> Result<Json, StrictError> {
        for (text, value) in [
            ("true", Json::Bool(true)),
            ("false", Json::Bool(false)),
            ("null", Json::Null),
        ] {
            if self.bytes[self.at..].starts_with(text.as_bytes()) {
                self.at += text.len();
                return Ok(value);
            }
        }
        Err(self.refuse(path, "not a JSON value".to_string()))
    }

    fn object(&mut self, path: &str, depth: usize) -> Result<Json, StrictError> {
        self.at += 1;
        let (mut members, mut seen) = (Vec::new(), HashSet::new());
        self.skip_space();
        if self.bytes.get(self.at) == Some(&b'}') {
            self.at += 1;
            return Ok(Json::Obj(members));
        }
        loop {
            self.skip_space();
            if self.bytes.get(self.at) != Some(&b'"') {
                return Err(self.refuse(path, "expected a key".to_string()));
            }
            let key = self.string(path)?;
            if !seen.insert(key.clone()) {
                return Err(self.refuse(path, format!("a duplicate key `{key}`")));
            }
            self.expect(path, b':')?;
            let value = self.value(&format!("{path}.{key}"), depth + 1)?;
            members.push((key, value));
            self.skip_space();
            match self.bytes.get(self.at) {
                Some(b',') => self.at += 1,
                Some(b'}') => {
                    self.at += 1;
                    return Ok(Json::Obj(members));
                }
                _ => return Err(self.refuse(path, "expected `,` or `}`".to_string())),
            }
        }
    }

    fn array(&mut self, path: &str, depth: usize) -> Result<Json, StrictError> {
        self.at += 1;
        let mut items = Vec::new();
        self.skip_space();
        if self.bytes.get(self.at) == Some(&b']') {
            self.at += 1;
            return Ok(Json::Arr(items));
        }
        loop {
            items.push(self.value(&format!("{path}[{}]", items.len()), depth + 1)?);
            self.skip_space();
            match self.bytes.get(self.at) {
                Some(b',') => self.at += 1,
                Some(b']') => {
                    self.at += 1;
                    return Ok(Json::Arr(items));
                }
                _ => return Err(self.refuse(path, "expected `,` or `]`".to_string())),
            }
        }
    }

    /// A string, decoded. Its end is found and its length bounded before it is decoded, by
    /// `serde_json`'s string parser, which refuses a bad escape and a lone surrogate.
    fn string(&mut self, path: &str) -> Result<String, StrictError> {
        let (start, max) = (self.at, self.limits.max_string_bytes);
        self.at += 1;
        loop {
            match self.bytes.get(self.at) {
                None => return Err(self.refuse(path, "a string is not closed".to_string())),
                Some(b'"') => break,
                Some(0..=0x1f) => {
                    return Err(self.refuse(path, "a raw control character in a string".to_string()))
                }
                Some(b'\\') => self.at += 2,
                Some(_) => self.at += 1,
            }
            if self.at - start > 6 * max + 2 {
                return Err(self.refuse(path, format!("a string over {max} bytes")));
            }
        }
        self.at += 1;
        let decoded = serde_json::from_slice::<String>(&self.bytes[start..self.at])
            .map_err(|e| self.refuse(path, format!("not a JSON string: {e}")))?;
        if decoded.len() > max {
            return Err(self.refuse(path, format!("a string over {max} bytes")));
        }
        Ok(decoded)
    }

    /// A number token in JSON's grammar. An integer token becomes an integer and any other token an
    /// `f64`, so the spelling check can tell `1` from `1.0`, and `1.00` from either.
    fn number(&mut self, path: &str) -> Result<Json, StrictError> {
        let start = self.at;
        while matches!(
            self.bytes.get(self.at),
            Some(b'-' | b'+' | b'.' | b'e' | b'E' | b'0'..=b'9')
        ) {
            self.at += 1;
        }
        let token = std::str::from_utf8(&self.bytes[start..self.at]).unwrap_or_default();
        if serde_json::from_str::<serde_json::Number>(token).is_err() {
            return Err(self.refuse(path, format!("`{token}` is not a JSON number")));
        }
        if !token.contains(['.', 'e', 'E']) {
            if let Ok(i) = token.parse::<i64>() {
                return Ok(Json::Int(i));
            } else if let Ok(u) = token.parse::<u64>() {
                return Ok(Json::UInt(u));
            }
        }
        match token.parse::<f64>() {
            Ok(d) if d.is_finite() => Ok(Json::Double(d)),
            _ => Err(self.refuse(path, format!("`{token}` is not a finite number"))),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SMALL: Limits = Limits {
        max_bytes: 4_096,
        max_depth: 8,
        max_string_bytes: 64,
    };

    #[test]
    fn the_strict_reader_refuses_a_duplicate_key_naming_its_path() {
        for (text, path) in [
            (r#"{"k":1,"k":2}"#, "$"),
            (r#"{"a":{"b":1,"b":2}}"#, "$.a"),
            (r#"{"a":[{"x":1},{"y":1,"y":1}]}"#, "$.a[1]"),
            // Keys that decode equal are one key.
            (r#"{"a":1,"\u0061":2}"#, "$"),
        ] {
            let e = parse(text.as_bytes(), &SMALL).unwrap_err();
            assert_eq!(e.path, path, "{text}");
            assert!(e.rule.contains("duplicate key"), "{text}: {}", e.rule);
        }
        assert!(parse(br#"{"a":{"b":1},"b":2}"#, &SMALL).is_ok());
    }

    #[test]
    fn the_strict_reader_refuses_a_number_not_in_canonical_spelling() {
        let read_a = |token: &str| {
            let text = format!("{{\"a\":{token}}}");
            read(text.as_bytes(), Layout::Compact, &SMALL)
        };
        let canonical = ["1", "-1", "0", "1.0", "0.5", "2600000.125", "0.000001"];
        for ok in canonical.into_iter().chain(["18446744073709551615"]) {
            assert!(read_a(ok).is_ok(), "{ok}");
        }
        let not_canonical = [
            "1.00",
            "1.50",
            "1e2",
            "1E2",
            "1.0e0",
            "-0",
            "-0.0",
            "0.0000001",
            "100000000000000000000",
            "+1",
            ".5",
            "01",
            "1e400",
        ];
        for bad in not_canonical {
            let e = read_a(bad).unwrap_err();
            assert_eq!(e.line, 1, "{bad}: {e}");
        }
    }

    #[test]
    fn the_strict_reader_refuses_any_layout_but_the_line_oriented_form() {
        let doc = r#"{"a":1,"b":[],"c":{"d":"x"},"e":[1,2]}"#;
        let v = parse(doc.as_bytes(), &SMALL).unwrap();
        let exact = spelling(&v, Layout::LineOriented).unwrap();
        assert!(read(exact.as_bytes(), Layout::LineOriented, &SMALL).is_ok());
        let lines = exact.lines().count();
        let cases = [
            ("the compact form", format!("{doc}\n"), 1),
            ("CRLF line ends", exact.replace('\n', "\r\n"), 1),
            ("four spaces of indent", exact.replace("  ", "    "), 2),
            ("a tab for indent", exact.replace("  ", "\t"), 2),
            ("no final LF", exact.trim_end().to_string(), lines),
            ("two final LFs", format!("{exact}\n"), lines + 1),
            ("a blank line", exact.replacen("{\n", "{\n\n", 1), 2),
            ("trailing space", exact.replacen("1,\n", "1, \n", 1), 2),
            (
                "no space after a key",
                exact.replacen("\"a\": 1", "\"a\":1", 1),
                2,
            ),
        ];
        for (what, text, line) in cases {
            let e = read(text.as_bytes(), Layout::LineOriented, &SMALL).unwrap_err();
            assert_eq!(e.line, line, "{what}: {e}");
        }
    }
}
