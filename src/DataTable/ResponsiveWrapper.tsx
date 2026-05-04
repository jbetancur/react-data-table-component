import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';

type ResponsiveWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
	$responsive: boolean;
	$fixedHeader?: boolean;
	$fixedHeaderScrollHeight?: string;
};

export default function ResponsiveWrapper({
	$responsive,
	$fixedHeader,
	$fixedHeaderScrollHeight = '100vh',
	className,
	style,
	...rest
}: ResponsiveWrapperProps): JSX.Element {
	const customStyles = useStyles();
	const scrollClass = $responsive ? ($fixedHeader ? 'rdt_responsiveWrapperFixed' : 'rdt_responsiveWrapperScroll') : undefined;
	return (
		<div
			className={['rdt_responsiveWrapper', scrollClass, className].filter(Boolean).join(' ')}
			style={{
				...($fixedHeader && { maxHeight: $fixedHeaderScrollHeight }),
				...customStyles.responsiveWrapper?.style,
				...style,
			}}
			{...rest}
		/>
	);
}
