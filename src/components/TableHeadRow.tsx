import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

type HeadRowProps = React.HTMLAttributes<HTMLDivElement> & { $dense?: boolean };

const HeadRow = React.forwardRef<HTMLDivElement, HeadRowProps>(function HeadRow(
	{ $dense, className, style, ...rest },
	ref,
) {
	const customStyles = useStyles();
	return (
		<div
			ref={ref}
			className={['rdt_headRow', $dense && 'rdt_headRowDense', className].filter(Boolean).join(' ')}
			style={{ ...customStyles.headRow?.style, ...($dense && customStyles.headRow?.denseStyle), ...style }}
			{...rest}
		/>
	);
});

export default HeadRow;
