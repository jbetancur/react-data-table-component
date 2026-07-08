import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';
import type { ExpandableIcon, Localization } from '../types';
import type { NavCellProps } from '../context/RowContext';

type ExpandableRowsOptions = NonNullable<Localization['expandable']>;

type CellExpanderProps<T> = {
	disabled: boolean;
	expanded: boolean;
	expandableIcon: ExpandableIcon;
	expandableRowsOptions?: ExpandableRowsOptions;
	id: string | number;
	row: T;
	onToggled: (row: T) => void;
	nav?: NavCellProps;
};

function CellExpander<T>({
	row,
	expanded = false,
	expandableIcon,
	expandableRowsOptions,
	id,
	onToggled,
	disabled = false,
	nav,
}: CellExpanderProps<T>): JSX.Element {
	const customStyles = useStyles();

	return (
		<CellBase
			onClick={(e: React.MouseEvent) => e.stopPropagation()}
			className="rdt_cellExpander"
			$noPadding
			style={customStyles.expanderCell?.style as React.CSSProperties}
			role={nav ? 'gridcell' : undefined}
			tabIndex={nav ? -1 : undefined}
			data-nav-row={nav?.row}
			data-nav-col={nav?.col}
			data-nav-widget={nav ? 'true' : undefined}
		>
			<ExpanderButton
				id={id}
				row={row}
				expanded={expanded}
				expandableIcon={expandableIcon}
				expandableRowsOptions={expandableRowsOptions}
				disabled={disabled}
				onToggled={onToggled}
				tabIndex={nav ? (nav.active ? 0 : -1) : undefined}
			/>
		</CellBase>
	);
}

export default CellExpander;
