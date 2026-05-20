import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';
import type { ExpandableIcon, Localization } from '../types';

type ExpandableRowsOptions = NonNullable<Localization['expandable']>;

type CellExpanderProps<T> = {
	disabled: boolean;
	expanded: boolean;
	expandableIcon: ExpandableIcon;
	expandableRowsOptions?: ExpandableRowsOptions;
	id: string | number;
	row: T;
	onToggled: (row: T) => void;
};

function CellExpander<T>({
	row,
	expanded = false,
	expandableIcon,
	expandableRowsOptions,
	id,
	onToggled,
	disabled = false,
}: CellExpanderProps<T>): JSX.Element {
	const customStyles = useStyles();

	return (
		<CellBase
			onClick={(e: React.MouseEvent) => e.stopPropagation()}
			className="rdt_cellExpander"
			$noPadding
			style={customStyles.expanderCell?.style as React.CSSProperties}
		>
			<ExpanderButton
				id={id}
				row={row}
				expanded={expanded}
				expandableIcon={expandableIcon}
				expandableRowsOptions={expandableRowsOptions}
				disabled={disabled}
				onToggled={onToggled}
			/>
		</CellBase>
	);
}

export default CellExpander;
