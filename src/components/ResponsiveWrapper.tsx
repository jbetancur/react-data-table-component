import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

type ResponsiveWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
	$responsive: boolean;
	$fixedHeader?: boolean;
	$fixedHeaderScrollHeight?: string;
	$hiddenScrollbar?: boolean;
};

const ResponsiveWrapper = React.forwardRef<HTMLDivElement, ResponsiveWrapperProps>(function ResponsiveWrapper(
	{ $responsive, $fixedHeader, $fixedHeaderScrollHeight = '100vh', $hiddenScrollbar, className, style, ...rest },
	ref,
) {
	const customStyles = useStyles();
	const scrollClass = $responsive
		? $fixedHeader
			? 'rdt_responsiveWrapperFixed'
			: 'rdt_responsiveWrapperScroll'
		: undefined;
	return (
		<div
			ref={ref}
			className={[
				'rdt_responsiveWrapper',
				scrollClass,
				$hiddenScrollbar && 'rdt_responsiveWrapperHideScrollbar',
				className,
			]
				.filter(Boolean)
				.join(' ')}
			style={{
				...($fixedHeader && { maxHeight: $fixedHeaderScrollHeight }),
				...customStyles.responsiveWrapper?.style,
				...style,
			}}
			{...rest}
		/>
	);
});

export default ResponsiveWrapper;
