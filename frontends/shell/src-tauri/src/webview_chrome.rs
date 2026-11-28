// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The main webview's browser chrome (ADR-037, the first bullet of "What this ADR does not decide";
//! the reload keys' form, Part A): in a build without `debug_assertions`, `setup()` switches WebView2's
//! default context menus off; in a build with them, both browser settings are set to WebView2's own
//! default, on. One session-log line states what was read back, or that the settings were not reached.

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) struct Chrome {
    context_menus: bool,
    accelerator_keys: bool,
}

pub(crate) fn chrome_for(_debug_build: bool) -> Chrome {
    Chrome {
        context_menus: true,
        accelerator_keys: true,
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Value {
    On,
    Off,
    Unread,
}

#[derive(Debug, PartialEq, Eq)]
pub(crate) struct Readback {
    context_menus: Value,
    accelerator_keys: Value,
}

pub(crate) enum Outcome {
    NotReached,
    Reached(Readback),
}

#[derive(Debug)]
struct ChromeError;

trait ChromeSettings {
    fn set_context_menus(&mut self, on: bool) -> Result<(), ChromeError>;
    fn context_menus(&mut self) -> Result<bool, ChromeError>;
    fn set_accelerator_keys(&mut self, on: bool) -> Result<(), ChromeError>;
    fn accelerator_keys(&mut self) -> Result<bool, ChromeError>;
}

fn apply(_settings: &mut impl ChromeSettings, _chrome: Chrome) -> Readback {
    Readback {
        context_menus: Value::Unread,
        accelerator_keys: Value::Unread,
    }
}

fn readback_line(_readback: &Readback) -> String {
    String::new()
}

pub(crate) fn log_entry(_outcome: &Outcome) -> (&'static str, String) {
    ("info", String::new())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Clone, Copy)]
    enum Read {
        Stored,
        Is(bool),
        Fails,
    }

    /// The test fake: WebView2's settings start on, a setter stores its value, and a getter returns
    /// the stored value, a fixed one, or an error, as the test says.
    struct Fake {
        menus: bool,
        keys: bool,
        calls: Vec<(&'static str, bool)>,
        menu_set_fails: bool,
        menu_read: Read,
        key_read: Read,
    }

    impl Fake {
        fn new() -> Self {
            Self {
                menus: true,
                keys: true,
                calls: Vec::new(),
                menu_set_fails: false,
                menu_read: Read::Stored,
                key_read: Read::Stored,
            }
        }
    }

    fn read(how: Read, stored: bool) -> Result<bool, ChromeError> {
        match how {
            Read::Stored => Ok(stored),
            Read::Is(value) => Ok(value),
            Read::Fails => Err(ChromeError),
        }
    }

    impl ChromeSettings for Fake {
        fn set_context_menus(&mut self, on: bool) -> Result<(), ChromeError> {
            self.calls.push(("context_menus", on));
            if self.menu_set_fails {
                return Err(ChromeError);
            }
            self.menus = on;
            Ok(())
        }
        fn context_menus(&mut self) -> Result<bool, ChromeError> {
            read(self.menu_read, self.menus)
        }
        fn set_accelerator_keys(&mut self, on: bool) -> Result<(), ChromeError> {
            self.calls.push(("accelerator_keys", on));
            self.keys = on;
            Ok(())
        }
        fn accelerator_keys(&mut self) -> Result<bool, ChromeError> {
            read(self.key_read, self.keys)
        }
    }

    #[test]
    fn chrome_for_decides_both_off_without_debug_assertions_and_both_on_with_them() {
        assert_eq!(
            chrome_for(false),
            Chrome {
                context_menus: false,
                accelerator_keys: false
            }
        );
        assert_eq!(
            chrome_for(true),
            Chrome {
                context_menus: true,
                accelerator_keys: true
            }
        );
    }

    #[test]
    fn apply_sets_each_setting_to_the_decided_value() {
        let mut fake = Fake::new();
        apply(&mut fake, chrome_for(false));
        assert_eq!(fake.calls.len(), 2);
        assert!(fake.calls.contains(&("context_menus", false)));
        assert!(fake.calls.contains(&("accelerator_keys", false)));
    }

    #[test]
    fn a_failed_setting_does_not_skip_the_other_or_panic() {
        let mut fake = Fake::new();
        fake.menu_set_fails = true;
        let readback = apply(&mut fake, chrome_for(false));
        assert!(
            fake.calls.contains(&("accelerator_keys", false)),
            "the key setter was not called after the menu setter failed: {:?}",
            fake.calls
        );
        // The menu's read succeeded (it still reads the stored on), so it is read, not unread.
        assert_eq!(readback.context_menus, Value::On);
        assert_eq!(readback.accelerator_keys, Value::Off);
    }

    #[test]
    fn the_line_states_the_values_read_back_not_the_decision() {
        let mut fake = Fake::new();
        fake.menu_read = Read::Is(true);
        fake.key_read = Read::Is(false);
        // The decision is off for both; the getters answer on and off.
        let line = readback_line(&apply(&mut fake, chrome_for(false)));
        assert_eq!(line, "webview-chrome context_menus=on accelerator_keys=off");
    }

    #[test]
    fn a_line_for_settings_not_reached_is_not_applied_at_error() {
        assert_eq!(
            log_entry(&Outcome::NotReached),
            ("error", "webview-chrome not-applied".to_string())
        );
        let readback = apply(&mut Fake::new(), chrome_for(false));
        let (level, line) = log_entry(&Outcome::Reached(readback));
        assert_eq!(level, "info");
        assert_eq!(line, "webview-chrome context_menus=off accelerator_keys=off");
    }

    #[test]
    fn a_failed_read_reads_unread() {
        let mut fake = Fake::new();
        fake.menu_read = Read::Fails;
        fake.key_read = Read::Is(true);
        let line = readback_line(&apply(&mut fake, chrome_for(false)));
        assert_eq!(line, "webview-chrome context_menus=unread accelerator_keys=on");
    }
}
