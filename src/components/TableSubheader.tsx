import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

type AlignItems = 'center' | 'left' | 'right';

const alignClass: Record<AlignItems, string> = {
	left: 'rdt_subheaderLeft',
	right: 'rdt_subheaderRight',
	center: 'rdt_subheaderCenter',
};

type SubheaderProps = {
	align?: AlignItems;
	wrapContent?: boolean;
	children?: React.ReactNode;
};

export default function Subheader({ align = 'right', wrapContent = true, children }: SubheaderProps): JSX.Element {
	const customStyles = useStyles();
	return (
		<header
			className={['rdt_subheader', alignClass[align], wrapContent && 'rdt_subheaderWrap'].filter(Boolean).join(' ')}
			style={customStyles.subHeader?.style}
		>
			{children}
		</header>
	);
}
