// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Producer-side process memory sampling (README §6).
//!
//! The metric is Windows `GetProcessMemoryInfo` -> `PROCESS_MEMORY_COUNTERS_EX.PrivateUsage`
//! (private commit), with `PeakWorkingSetSize` recorded alongside. Naming the exact counter matters:
//! private commit and working set answer different questions, and comparing one adapter's working
//! set against the other's commit would silently break the comparison.

#[derive(Clone, Copy, Debug, Default, serde::Serialize)]
pub struct MemorySample {
    pub private_usage_bytes: u64,
    pub working_set_bytes: u64,
    pub peak_working_set_bytes: u64,
}

#[cfg(windows)]
pub fn sample() -> MemorySample {
    use windows_sys::Win32::System::ProcessStatus::{
        GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS, PROCESS_MEMORY_COUNTERS_EX,
    };
    use windows_sys::Win32::System::Threading::GetCurrentProcess;

    unsafe {
        let mut c: PROCESS_MEMORY_COUNTERS_EX = std::mem::zeroed();
        c.cb = std::mem::size_of::<PROCESS_MEMORY_COUNTERS_EX>() as u32;
        let ok = GetProcessMemoryInfo(
            GetCurrentProcess(),
            &mut c as *mut PROCESS_MEMORY_COUNTERS_EX as *mut PROCESS_MEMORY_COUNTERS,
            c.cb,
        );
        if ok == 0 {
            return MemorySample::default();
        }
        MemorySample {
            private_usage_bytes: c.PrivateUsage as u64,
            working_set_bytes: c.WorkingSetSize as u64,
            peak_working_set_bytes: c.PeakWorkingSetSize as u64,
        }
    }
}

/// Non-Windows builds compile but return zeros. The reference profile is Windows (README §2) and
/// any run on another platform is out of scope rather than silently comparable — the harness
/// records the platform so a zeroed sample can never be mistaken for a measured one.
#[cfg(not(windows))]
pub fn sample() -> MemorySample {
    MemorySample::default()
}

/// A rolling peak tracker sampled on a fixed interval during a run.
#[derive(Default)]
pub struct PeakTracker {
    pub peak: MemorySample,
    pub samples: Vec<(u64, MemorySample)>,
}

impl PeakTracker {
    pub fn record(&mut self, elapsed_ms: u64) -> MemorySample {
        let s = sample();
        if s.private_usage_bytes > self.peak.private_usage_bytes {
            self.peak = s;
        }
        self.samples.push((elapsed_ms, s));
        s
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[cfg(windows)]
    fn sampling_returns_a_plausible_nonzero_reading() {
        let s = sample();
        assert!(
            s.private_usage_bytes > 0,
            "PrivateUsage must be readable on the Windows reference profile"
        );
        assert!(s.working_set_bytes > 0);
    }

    #[test]
    fn peak_tracker_is_monotonic() {
        let mut t = PeakTracker::default();
        for i in 0..5 {
            t.record(i * 50);
        }
        assert_eq!(t.samples.len(), 5);
        let max = t
            .samples
            .iter()
            .map(|(_, s)| s.private_usage_bytes)
            .max()
            .unwrap();
        assert_eq!(t.peak.private_usage_bytes, max);
    }
}
