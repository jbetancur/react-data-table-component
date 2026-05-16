import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { CellBase } from './Cell';

function ColumnExpander(): JSX.Element {
	const customStyles = useStyles();
	return (
		<CellBase
			className="rdt_columnExpander"
			$noPadding
			style={customStyles.expanderCell?.style as React.CSSProperties}
		/>
	);
}

export default ColumnExpander;
