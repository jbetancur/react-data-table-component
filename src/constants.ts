export const STOP_PROP_TAG = 'allowRowEvents';

/**
 * Default width (in px) used for system columns (checkbox / expander) when
 * computing pinned-column sticky offsets. Mirrors the flex: 0 0 48px rule
 * in DataTable.css. Themes that override the checkbox/expander cell width
 * via customStyles.cellCheckbox / customStyles.cellExpander should also set
 * --rdt-system-col-width on the table root for pinning to remain aligned.
 */
export const SYSTEM_COL_WIDTH = 48;

/**
 * Duration (in ms) of the expander row open/close animation. The close handler
 * keeps the row mounted for this long so the exit animation can finish before
 * unmount. Mirrored in DataTable.css as --rdt-expand-duration, which drives the
 * rdt_expandIn / rdt_expandOut animations — keep the two in sync.
 */
export const EXPAND_DURATION = 220;

export enum Direction {
	LTR = 'ltr',
	RTL = 'rtl',
	AUTO = 'auto',
}

export enum Alignment {
	LEFT = 'left',
	RIGHT = 'right',
	CENTER = 'center',
}

export enum Media {
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
}
