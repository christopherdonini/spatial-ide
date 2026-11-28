// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The recovery offer** (SKP-V0 §13 to §15), the unit tests of its private steps. The product
//! code of this module lands after them.

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
    use spatial_skp::v0::{OpenDatasetRequest, RecordStepRequest};

    use super::*;
    use crate::skp::{session_end_channel, StreamRegistry};
    use crate::Catalog;

    /// A watch arm that arms none, as `crate::skp`'s own `NoWatchArm`, which is private to that
    /// module, has it.
    struct ChecksOnly;

    impl spatial_engine::SourceWatchArm for ChecksOnly {
        fn arm(&self, _: &Path, _: spatial_engine::WatchSink) -> spatial_engine::ArmOutcome {
            spatial_engine::ArmOutcome::ChecksOnly {
                reason: "test fixture: no watch armed".to_string(),
            }
        }
    }

    /// A real host and recorder over one folder, with one step recorded against a small fixture,
    /// and that record's two files copied, as a crashed run leaves them, to a second folder of the
    /// same store: the recorder's own record is held (its lock is its own), the copy is not.
    struct Rig {
        dir: PathBuf,
        host: Arc<SkpHost>,
        recorder: StepRecorder,
        handle: DatasetHandle,
        copy: String,
    }

    impl Drop for Rig {
        fn drop(&mut self) {
            drop(std::fs::remove_dir_all(&self.dir));
        }
    }

    fn rig(test: &str) -> Rig {
        let dir = std::env::temp_dir()
            .join("spatial-ide-recovery-unit")
            .join(test);
        let _ = std::fs::remove_dir_all(&dir);
        let data = dir.join("data").join("parcels.parquet");
        let spec = FixtureSpec {
            features: 50,
            avg_vertices: 8,
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        };
        write_geoparquet(&data, &spec).expect("the fixture");
        let host = Arc::new(SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            Arc::new(ChecksOnly),
            session_end_channel().0,
        ));
        let recorder = StepRecorder::new(dir.join("sessions"), host.clone());
        let open = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: data.display().to_string(),
            cancel_key: "k".to_string(),
            crs_assertion: None,
            identity: None,
            set_aside_file_id: false,
        };
        let dataset = host.open_dataset(open).expect("open").dataset;
        let intent = StepIntent::StyleSet(StyleSetParams::FillOpacity { value: 0.5 });
        let step = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: dataset.clone(),
            intent,
        };
        recorder.record_step(step).expect("recorded");

        let copy = format!("unsaved-{}", "11".repeat(16));
        let (bytes, from) = {
            let state = lock(&recorder.state);
            let rec = &state.records[0];
            let bytes = read_through(&rec.history.out, MAX_SESSION_HISTORY_BYTES + 1);
            (bytes.expect("read through its own handle"), rec.dir.clone())
        };
        let made = dir.join("sessions").join(&copy);
        std::fs::create_dir(&made).expect("the copy's folder");
        std::fs::write(made.join(HISTORY), bytes).expect("the copy's history");
        std::fs::copy(from.join(LOCATIONS), made.join(LOCATIONS)).expect("the copy's places");
        Rig {
            dir,
            host,
            recorder,
            handle: dataset,
            copy,
        }
    }

    impl Rig {
        fn root(&self) -> PathBuf {
            self.dir.join("sessions")
        }

        fn held(&self) -> Vec<String> {
            held_names(&lock(&self.recorder.state))
        }
    }

    /// **K-C27.** The start's two private steps are called in the product's order: the walk, which
    /// takes and locks the `unsaved-` record and returns no folder names; then, after the test
    /// makes the record's twin `<hex>` folder with its history held by the test, the dedupe, which
    /// reads the names itself. The record is not listed.
    ///
    /// Mutation: the walk's first names passed to the dedupe and used for its `<hex>` side.
    /// Expected failure: this test, at the verdict on the record, which is then `Offer`.
    #[test]
    fn the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names() {
        let r = rig("k-c27");
        let root = r.root();
        let walked = walk(&root, &r.held());
        let taken: Vec<&str> = walked.taken.iter().map(|t| t.name.as_str()).collect();
        assert_eq!(
            taken,
            [r.copy.as_str()],
            "the walk takes the copy and not the held record"
        );
        assert!(!walked.more);

        // The project side appears only now, after the walk's locks are taken.
        let twin = root.join("2".repeat(32));
        std::fs::create_dir(&twin).expect("the twin's folder");
        let from = root.join(&r.copy);
        let places = std::fs::read(from.join(LOCATIONS)).expect("places");
        std::fs::write(twin.join(LOCATIONS), places).expect("the twin's places");
        let header = walked.taken[0]
            .seen
            .as_ref()
            .and_then(|s| s.recovered.lines.first().cloned())
            .expect("the copy's header");
        std::fs::write(twin.join(HISTORY), format!("{header}\n")).expect("the twin's history");
        let mut options = OpenOptions::new();
        let held = options
            .read(true)
            .write(true)
            .open(twin.join(HISTORY))
            .expect("open");
        held.try_lock().expect("the test holds the twin's history");

        let verdicts = dedupe(&root, &walked.taken);
        assert_eq!(verdicts, [Verdict::Locked]);
        drop(held);
    }

    /// **K-C42.** The private body that runs steps 4 to 6 for a null `dataset` is called with the
    /// history handle of a crashed `unsaved-` record that the test opened without write access and
    /// locked itself, so step 5's `set_len` refuses after step 4's real open through the test's own
    /// host. The refusal is `skp.session_history_unwritable`; the host's catalog holds no name; the
    /// history is as it was; and after the call a lock taken through a new handle succeeds.
    ///
    /// Mutation: the guard's close removed from the refusal exit, which leaves the open in the
    /// catalog. Expected failure: this test, at the catalog's names.
    #[test]
    fn a_refused_cut_after_the_open_closes_the_open_and_leaves_the_record() {
        let r = rig("k-c42");
        // The recorder's own open is closed first, so that the catalog is empty before the call.
        let (skp, dataset) = (SKP_VERSION.to_string(), r.handle.clone());
        r.host
            .close_dataset(CloseDatasetRequest { skp, dataset })
            .expect("closed");
        assert_eq!(r.host.catalog().names(), Vec::<String>::new());
        let dir = r.root().join(&r.copy);
        let before = std::fs::read(dir.join(HISTORY)).expect("the history");
        let recovered = recover_bytes(&before);
        let header = recovered.header.as_ref().expect("the header");
        let places = std::fs::read(dir.join(LOCATIONS)).expect("places");
        let place = store::read_locations(&places).expect("read").remove(0).path;
        let adopt = Adopt {
            record: r.copy.clone(),
            dir: dir.clone(),
            cancel_key: "recover".to_string(),
            reference: header.datasets[0].clone(),
            place,
            kept: before.len() as u64,
            replayed: replay(&recovered.lines).expect("replayed"),
        };
        let read_only = File::open(dir.join(HISTORY)).expect("opened without write access");
        read_only.try_lock().expect("the test locks it itself");

        let refused = r
            .recorder
            .adopt_new(&adopt, read_only)
            .expect_err("the cut is refused");
        assert_eq!(refused.code, "skp.session_history_unwritable");
        assert!(
            refused.fields["detail"].starts_with("set_len"),
            "{:?}",
            refused.fields
        );
        assert_eq!(
            r.host.catalog().names(),
            Vec::<String>::new(),
            "nothing is left open"
        );
        assert_eq!(
            std::fs::read(dir.join(HISTORY)).expect("the history"),
            before
        );
        let again = OpenOptions::new()
            .read(true)
            .write(true)
            .open(dir.join(HISTORY));
        again
            .expect("a new handle")
            .try_lock()
            .expect("the lock is free");
    }
}
