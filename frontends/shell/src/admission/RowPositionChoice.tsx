// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The words of the choice to open a file whose own `id` column cannot serve by row position, for this session only (`text-id-opens-for-the-session-by-row-position`, ADR-016
 * Amendment 3). Each is the advisor's wording under the human's delegation of 2026-11-13, from ADV-2026-11-23-36 item 3, copied from that ruling by script, and not the human's;
 * each is shown as the words commit set it. S-2 is true of the code as follows: "open it as a file with no id column opens" is the session tier, which a file with no `id` column
 * opens on; "the file's own id values are then not shown" is that a column named `id` is never projected (`engine/src/attributes.rs`); "a filter cannot use id" is the engine's
 * refusal of a predicate naming it as ambiguous (`FilterError::IdentityAliasAmbiguous`); "nothing of this choice is saved or published" is that neither the project file, the session
 * history nor a bundle records it (`kernel/tests/text_id_set_aside_not_saved_or_published.rs`); "opening the file again asks again" is that a reopen carries no choice
 * (`reopenRetryOptions` in `AdmissionPanel.tsx`; the project file records none); "checked across the whole file again first" is the engine's native scan, which a set-aside open
 * runs before it admits a column refused for its values.
 */
export const ROW_POSITION_LABEL = "Open for this session by row position";
export const ROW_POSITION_EXPLANATION =
  "This file's own id column cannot serve as its identity. You can open it as a file with no id column opens: features are identified by their position in the file, for this session only. The file's own id values are then not shown, and a filter cannot use id. Nothing of this choice is saved or published, and opening the file again asks again. If the column was refused for its values, it is checked across the whole file again first.";

/** S-5: the carried line of a remediation attempt that also carries the choice, shown beside the CRS block's own carried line for a declaration. */
export const ROW_POSITION_CARRIED_LINE = "This attempt will also open the file for this session by row position, as you chose.";

interface Props {
  disabled: boolean;
  onChoose: () => void;
}

/**
 * The choice itself. It renders only when `rowPositionOffer` (`AdmissionPanel.tsx`) gives an offer, and its click is the one act that sets `setAsideFileId`: nothing defaults it
 * and nothing infers it, and nothing of it is stored.
 */
export default function RowPositionChoice({ disabled, onChoose }: Props) {
  return (
    <div className="admission-row-position">
      <p className="admission-row-position-explanation">{ROW_POSITION_EXPLANATION}</p>
      <button type="button" className="admission-row-position-choose" disabled={disabled} onClick={onChoose}>
        {ROW_POSITION_LABEL}
      </button>
    </div>
  );
}
