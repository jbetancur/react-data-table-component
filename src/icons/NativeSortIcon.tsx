import React from 'react';
import { SortOrder } from '../types';

interface NativeSortIconProps {
	sortActive: boolean;
	sortDirection: SortOrder;
}

const NativeSortIcon: React.FC<NativeSortIconProps> = ({ sortActive, sortDirection }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		role="presentation"
		style={{
			flexGrow: 0,
			flexShrink: 0,
			marginLeft: '2px',
			width: 'var(--rdt-sort-icon-size, 12px)',
			height: 'var(--rdt-sort-icon-size, 12px)',
			opacity: sortActive ? 1 : 0,
			transform: sortDirection === SortOrder.DESC ? 'rotate(180deg)' : undefined,
			transition: 'transform 0.15s ease, opacity 0.15s ease',
		}}
	>
		<path d="M12 19V5M6 11L12 5L18 11" />
	</svg>
);

export default NativeSortIcon;
