import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

type ResponsiveWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
	$responsive: boolean;
	$fixedHeader?: boolean;
	$fixedHeaderScrollHeight?: string;
	$hiddenScrollbar?: boolean;
	$animateRows?: boolean;
};

const ResponsiveWrapper = React.forwardRef<HTMLDivElement, ResponsiveWrapperProps>(function ResponsiveWrapper(
	{
		$responsive,
		$fixedHeader,
		$fixedHeaderScrollHeight = '100vh',
		$hiddenScrollbar,
		$animateRows,
		className,
		style,
		...rest
	},
	ref,
) {
	const customStyles = useStyles();
	// fixedHeader needs a scroll container even when responsive is off — maxHeight
	// without overflow lets rows spill over whatever renders below the table.
	const scrollClass = $fixedHeader
		? 'rdt_responsiveWrapperFixed'
		: $responsive
			? 'rdt_responsiveWrapperScroll'
			: undefined;
	return (
		<div
			ref={ref}
			className={[
				'rdt_responsiveWrapper',
				scrollClass,
				$hiddenScrollbar && 'rdt_responsiveWrapperHideScrollbar',
				// content-visibility virtualization estimates off-screen row positions,
				// which corrupts FLIP measurements — suppress it while rows animate.
				$animateRows && 'rdt_responsiveWrapperAnimated',
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
