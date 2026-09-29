import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

export default function NoDataWrapper({ style, ...rest }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	const customStyles = useStyles();
	// A table may only own rows, so the message sits in a single-cell row.
	return (
		<div role="row" className="rdt_noData" style={{ ...customStyles.noData?.style, ...style }}>
			<div role="cell">
				<div role="status" {...rest} />
			</div>
		</div>
	);
}
