import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';

type TableProps = React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean };

export default function Table({ disabled, className, style, ...rest }: TableProps): JSX.Element {
	const customStyles = useStyles();
	return (
		<div
			className={['rdt_table', disabled && 'rdt_tableDisabled', className].filter(Boolean).join(' ')}
			style={{ ...customStyles.table?.style, ...style }}
			{...rest}
		/>
	);
}
