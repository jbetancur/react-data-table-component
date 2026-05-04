import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';

type HeadRowProps = React.HTMLAttributes<HTMLDivElement> & { $dense?: boolean };

export default function HeadRow({ $dense, className, style, ...rest }: HeadRowProps): JSX.Element {
	const customStyles = useStyles();
	return (
		<div
			className={['rdt_headRow', $dense && 'rdt_headRowDense', className].filter(Boolean).join(' ')}
			style={{ ...customStyles.headRow?.style, ...($dense && customStyles.headRow?.denseStyle), ...style }}
			{...rest}
		/>
	);
}
