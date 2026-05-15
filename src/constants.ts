export const STOP_PROP_TAG = 'allowRowEvents';

/**
 * Default width (in px) used for system columns (checkbox / expander) when
 * computing pinned-column sticky offsets. Mirrors the flex: 0 0 48px rule
 * in DataTable.css. Themes that override the checkbox/expander cell width
 * via customStyles.cellCheckbox / customStyles.cellExpander should also set
 * --rdt-system-col-width on the table root for pinning to remain aligned.
 */
export const SYSTEM_COL_WIDTH = 48;

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
