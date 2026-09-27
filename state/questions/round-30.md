Question round 30 — 2026-09-27 (custodian → human). One item, a RED LINE (public exposure): the last stop item of the exposure-profile-paths piece before its preregistration is committed. The revised draft is state/drafts/exposure-profile-paths-prereg.draft.md.

---

1. RED LINE — S7, your round 29 items 1 and 4 read together. Item 1 keeps the local profile always refused; item 4 allow-lists runner, user and root so CI and container paths pass. In a CI or container session the local profile is itself runner, user or root, so if the "always refused" override applied to those names, that session's hook would refuse exactly the paths item 4 lets through.
  (1) The override applies to the invented-name list only, never to the three machine accounts, since they name no person (Recommended).
  (2) The override applies to both lists: a session whose own profile is runner, user or root refuses its own machine-account paths.
