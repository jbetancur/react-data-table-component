import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';

type HeadProps = React.HTMLAttributes<HTMLDivElement> & { $fixedHeader?: boolean };

export default function Head({ $fixedHeader, className, style, ...rest }: HeadProps): JSX.Element {
	const customStyles = useStyles();
	return (
		<div
			className={['rdt_head', $fixedHeader && 'rdt_headFixed', className].filter(Boolean).join(' ')}
			style={{ ...customStyles.head?.style, ...style }}
			{...rest}
		/>
	);
}
