// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! One error envelope for every SKP refusal (SKP-V0.md §5).
//!
//! `code` is `engine.<variant_snake_case>` for a refusal that came from `engine::EngineError`
//! (mapped exhaustively, with no wildcard arm, by `kernel/src/skp.rs::error_of`) or `skp.<name>` for
//! a protocol-level refusal minted here. `message` is always human-readable prose a UI may display
//! verbatim — for an engine refusal it is `EngineError`'s own `Display` output, unedited, because
//! that text *is* the refusal UX the shell exists to show. `fields` carries the refusal's own named
//! values as strings, so a client can build on them without parsing `message`.

use std::collections::BTreeMap;

#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SkpError {
    pub code: String,
    pub message: String,
    #[serde(default)]
    pub fields: BTreeMap<String, String>,
}

impl SkpError {
    /// Build a protocol-level (`skp.*`) error with no fields.
    pub fn protocol(name: &str, message: impl Into<String>) -> Self {
        Self {
            code: format!("skp.{name}"),
            message: message.into(),
            fields: BTreeMap::new(),
        }
    }

    /// Build a protocol-level (`skp.*`) error carrying named fields.
    pub fn protocol_with_fields(
        name: &str,
        message: impl Into<String>,
        fields: impl IntoIterator<Item = (&'static str, String)>,
    ) -> Self {
        Self {
            code: format!("skp.{name}"),
            message: message.into(),
            fields: fields
                .into_iter()
                .map(|(k, v)| (k.to_string(), v))
                .collect(),
        }
    }

    pub fn version_unsupported(got: &str) -> Self {
        Self::protocol_with_fields(
            "version_unsupported",
            format!(
                "unsupported skp version `{got}`; this host speaks `{}`",
                crate::v0::SKP_VERSION
            ),
            [
                ("got", got.to_string()),
                ("supported", crate::v0::SKP_VERSION.to_string()),
            ],
        )
    }

    pub fn unknown_dataset(handle: &str) -> Self {
        Self::protocol_with_fields(
            "unknown_dataset",
            format!(
                "no open dataset with handle `{handle}` (closed, or never opened this session)"
            ),
            [("handle", handle.to_string())],
        )
    }

    /// Reserved: not produced at `skp/0.x`, and nothing calls it (SKP-V0.md §5).
    pub fn unknown_handle(handle: &str) -> Self {
        Self::protocol_with_fields(
            "unknown_handle",
            format!("`{handle}` names no known stream or cancel key"),
            [("handle", handle.to_string())],
        )
    }

    /// Reserved: not produced at `skp/0.x`, and nothing calls it (SKP-V0.md §5).
    pub fn malformed_hex_f64(field: &str, got: &str) -> Self {
        Self::protocol_with_fields(
            "malformed_hex_f64",
            format!("`{field}` is not a valid HexF64 (16 lowercase hex digits): {got:?}"),
            [("field", field.to_string()), ("got", got.to_string())],
        )
    }

    /// Reserved: not produced at `skp/0.x`, and nothing calls it (SKP-V0.md §5).
    pub fn bbox_not_finite(field: &str) -> Self {
        Self::protocol_with_fields(
            "bbox_not_finite",
            format!("`{field}` decodes to a non-finite value; a NaN or infinite bbox edge selects nothing"),
            [("field", field.to_string())],
        )
    }

    /// `open_dataset` or `open_project`: the cancel key already names a live call of either, so
    /// this call is refused.
    pub fn cancel_key_in_use(key: &str) -> Self {
        Self::protocol_with_fields(
            "cancel_key_in_use",
            format!(
                "cancel key `{key}` already names a live `open_dataset` or `open_project` call"
            ),
            [("cancel_key", key.to_string())],
        )
    }

    pub fn too_many_pending_streams(limit: usize) -> Self {
        Self::protocol_with_fields(
            "too_many_pending_streams",
            format!("declared ceiling MAX_PENDING_TICKETS={limit} reached for this dataset"),
            [("limit", limit.to_string())],
        )
    }

    /// `record_step` (`skp/0.12`): the history could not be created (the shell's binding also
    /// returns this when no per-user data directory resolves), locked or written, or the step's
    /// line could not be built or breaks a rule the reader holds, so it is not written; `detail`
    /// says which. After a flush failure the bytes may be in the file, so the message does not say
    /// they are not.
    pub fn session_history_unwritable(detail: &str) -> Self {
        Self::protocol_with_fields(
            "session_history_unwritable",
            format!("this step could not be written and flushed to the session history: {detail}"),
            [("detail", detail.to_string())],
        )
    }

    /// `record_step`: the whole history would pass its ceiling. Nothing was written.
    pub fn session_history_full(limit: u64) -> Self {
        Self::protocol_with_fields(
            "session_history_full",
            format!("the session history is at its ceiling of {limit} bytes (MAX_SESSION_HISTORY_BYTES); this step was not written"),
            [("limit", limit.to_string())],
        )
    }

    /// `record_step`: an earlier write to this history failed.
    pub fn session_history_stopped() -> Self {
        Self::protocol(
            "session_history_stopped",
            "this session history takes no more steps: an earlier write to it failed",
        )
    }

    /// `record_step`: the step's line would pass its ceiling. Nothing was written.
    pub fn step_line_over_ceiling(saw: u64, limit: u64) -> Self {
        Self::protocol_with_fields(
            "step_line_over_ceiling",
            format!("this step's line would be {saw} bytes, over its ceiling of {limit} (MAX_STEP_LINE_BYTES); it was not written"),
            [("saw", saw.to_string()), ("limit", limit.to_string())],
        )
    }

    /// `record_step`: a `style.set` value the style model does not admit. Nothing was written.
    pub fn style_value_not_admitted(property: &str, detail: &str) -> Self {
        Self::protocol_with_fields(
            "style_value_not_admitted",
            format!("the value for `{property}` is not one the style model admits: {detail}"),
            [
                ("property", property.to_string()),
                ("detail", detail.to_string()),
            ],
        )
    }

    /// `save_project` (`skp/0.13`): the request's `folder` is `null` and no save of this open has
    /// chosen a folder, so the kernel has no project to save to. The message is the kernel's own
    /// text for this fact (`kernel/src/project/mod.rs`, `SaveFailure::FolderRequired`).
    pub fn project_folder_not_given() -> Self {
        Self::protocol(
            "project_folder_not_given",
            "no folder was given, and this open of the dataset has no project to save to",
        )
    }

    /// `save_project`: a first save into a folder that already holds `project.spatial`. Nothing
    /// was written.
    pub fn project_folder_holds_project(folder: &str) -> Self {
        Self::protocol_with_fields(
            "project_folder_holds_project",
            format!("{folder} already holds project.spatial"),
            [("folder", folder.to_string())],
        )
    }

    /// `save_project`: the project folder or a file of the save could not be read or written;
    /// `detail` says which and why. The project file is replaced whole or not at all, so a
    /// refusal leaves the previous one in place.
    pub fn project_file_unwritable(detail: &str) -> Self {
        Self::protocol_with_fields(
            "project_file_unwritable",
            format!("the project could not be written: {detail}"),
            [("detail", detail.to_string())],
        )
    }

    /// A member of a project file breaks a rule its reader holds, so the save is not made or the
    /// reopen is refused. `save_project`: the project file built from the workspace, or the one
    /// there now. `open_project`: the project file it reads, or the document a copy would write.
    /// `path` names the member and `rule` the rule. A file of this machine's store is
    /// [`SkpError::project_machine_record_refused`]'s, not this code's.
    pub fn project_file_refused(path: &str, rule: &str) -> Self {
        Self::protocol_with_fields(
            "project_file_refused",
            format!("the project file's reader refuses it: {path}: {rule}"),
            [("path", path.to_string()), ("rule", rule.to_string())],
        )
    }

    /// `save_project`: the project file there now records a lineage, which this version does not
    /// keep, and replacing it would break that lineage.
    pub fn project_lineage_not_kept_by_this_version() -> Self {
        Self::protocol(
            "project_lineage_not_kept_by_this_version",
            "project.spatial records a lineage, which this version of the application does not keep",
        )
    }

    /// `save_project`: a later save found that `project.spatial` in the open's folder names another
    /// project than the open's own. Nothing was written. `project` is the open's identity and
    /// `found` the identity the file names; neither is a path.
    pub fn project_file_names_another_project(project: &str, found: &str) -> Self {
        Self::protocol_with_fields(
            "project_file_names_another_project",
            format!(
                "the folder's project.spatial names another project, {found}, and was not replaced"
            ),
            [
                ("project", project.to_string()),
                ("found", found.to_string()),
            ],
        )
    }

    /// `open_project` (`skp/0.14`): `project.spatial` in the folder could not be read. `detail` is
    /// the operating system's error text alone.
    pub fn project_file_unreadable(detail: &str) -> Self {
        Self::protocol_with_fields(
            "project_file_unreadable",
            format!("project.spatial cannot be read: {detail}"),
            [("detail", detail.to_string())],
        )
    }

    /// `save_project` and `open_project`: a file of this machine's store for the project,
    /// `folders.json` or `locations.json`, breaks a rule its reader holds. `file` names the file
    /// and `rule` the rule.
    pub fn project_machine_record_refused(file: &str, rule: &str) -> Self {
        Self::protocol_with_fields(
            "project_machine_record_refused",
            format!("{file}: {rule}"),
            [("file", file.to_string()), ("rule", rule.to_string())],
        )
    }

    /// `open_project`: this machine's store already remembers `count` folders for `project`, and
    /// holds no more. Nothing was written.
    pub fn project_known_folders_full(project: &str, count: usize) -> Self {
        Self::protocol_with_fields(
            "project_known_folders_full",
            format!("{project} remembers {count} folders, and no more can be added"),
            [
                ("project", project.to_string()),
                ("count", count.to_string()),
            ],
        )
    }

    /// `open_project`: another open holds the project, in this process or in another, so the
    /// reopen took no lock. `project` is the identity.
    pub fn project_open_elsewhere(project: &str) -> Self {
        Self::protocol_with_fields(
            "project_open_elsewhere",
            format!("{project} is already open"),
            [("project", project.to_string())],
        )
    }

    /// `open_project`: this machine's store for the project (its folder, its lock or one of its
    /// two files) could not be used. `detail` is the file's fixed name, a colon and the error's
    /// text. The shell's binding also returns this when no per-user data directory resolves.
    pub fn project_machine_store_failed(detail: &str) -> Self {
        Self::protocol_with_fields(
            "project_machine_store_failed",
            format!("this machine's store for the project could not be used: {detail}"),
            [("detail", detail.to_string())],
        )
    }

    /// `open_project`: the project folder, as the request spelled it, cannot be resolved.
    pub fn project_target_folder_unresolvable(folder: &str) -> Self {
        Self::protocol_with_fields(
            "project_target_unresolvable",
            format!("{folder} cannot be resolved"),
            [("folder", folder.to_string())],
        )
    }

    /// `open_project`: a segment of the data's project-relative locator cannot be resolved, because
    /// it is missing or cannot be read. `locator` is the locator's JSON path in the project file
    /// and `segment` the name the file spells.
    pub fn project_target_segment_unresolvable(locator: &str, segment: &str) -> Self {
        Self::protocol_with_fields(
            "project_target_unresolvable",
            format!("{locator}: {segment} cannot be resolved"),
            [
                ("locator", locator.to_string()),
                ("segment", segment.to_string()),
            ],
        )
    }

    /// `open_project`: the data's locator is not in canonical form.
    pub fn project_target_not_canonical(locator: &str) -> Self {
        Self::protocol_with_fields(
            "project_target_unresolvable",
            format!("{locator}: not canonical"),
            [("locator", locator.to_string())],
        )
    }

    /// `open_project`: the project folder could not be resolved at the check of the locator.
    pub fn project_target_locator_folder_unresolvable(locator: &str) -> Self {
        Self::protocol_with_fields(
            "project_target_unresolvable",
            format!("{locator}: the folder cannot be resolved"),
            [("locator", locator.to_string())],
        )
    }

    /// `open_project`: the data's path is not valid Unicode. No field and no path crosses.
    pub fn project_target_path_not_unicode() -> Self {
        Self::protocol(
            "project_target_unresolvable",
            "the data's path is not valid Unicode",
        )
    }

    /// `open_project`: a segment of the data's locator is a link, which is not followed.
    pub fn project_target_through_link(locator: &str, segment: &str) -> Self {
        Self::protocol_with_fields(
            "project_target_through_link",
            format!("{locator}: {segment} is a link"),
            [
                ("locator", locator.to_string()),
                ("segment", segment.to_string()),
            ],
        )
    }

    /// `open_project`: a segment of the data's locator that must be a folder is not one.
    /// `expected` is `folder`.
    pub fn project_target_not_a_folder(locator: &str, segment: &str) -> Self {
        Self::protocol_with_fields(
            "project_target_wrong_kind",
            format!("{locator}: {segment} is not a folder"),
            [
                ("locator", locator.to_string()),
                ("segment", segment.to_string()),
                ("expected", "folder".to_string()),
            ],
        )
    }

    /// `open_project`: the last segment of the data's locator must be a regular file and is not
    /// one. `expected` is `file`.
    pub fn project_target_not_a_regular_file(locator: &str, segment: &str) -> Self {
        Self::protocol_with_fields(
            "project_target_wrong_kind",
            format!("{locator}: {segment} is not a regular file"),
            [
                ("locator", locator.to_string()),
                ("segment", segment.to_string()),
                ("expected", "file".to_string()),
            ],
        )
    }
}

impl std::fmt::Display for SkpError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} ({})", self.message, self.code)
    }
}

impl std::error::Error for SkpError {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn protocol_codes_are_prefixed_and_engine_codes_are_not_minted_here() {
        let e = SkpError::version_unsupported("skp/9");
        assert_eq!(e.code, "skp.version_unsupported");
        assert_eq!(e.fields.get("got").map(String::as_str), Some("skp/9"));
    }

    #[test]
    fn round_trips_through_json_with_deny_unknown_fields() {
        let e = SkpError::unknown_dataset("ds_deadbeef");
        let json = serde_json::to_string(&e).unwrap();
        let back: SkpError = serde_json::from_str(&json).unwrap();
        assert_eq!(back, e);

        let mut v: serde_json::Value = serde_json::from_str(&json).unwrap();
        v.as_object_mut()
            .unwrap()
            .insert("extra".into(), serde_json::Value::Bool(true));
        assert!(
            serde_json::from_value::<SkpError>(v).is_err(),
            "unknown field must be refused"
        );
    }

    #[test]
    fn fields_defaults_to_empty_when_absent() {
        let v = serde_json::json!({"code": "skp.unknown_handle", "message": "m"});
        let e: SkpError = serde_json::from_value(v).unwrap();
        assert!(e.fields.is_empty());
    }
}
