import React from 'react';
import { SortOrder } from '../DataTable/types';

interface NativeSortIconProps {
	sortActive: boolean;
	sortDirection: SortOrder;
}

const NativeSortIcon: React.FC<NativeSortIconProps> = ({ sortActive, sortDirection }) => (
	<span
		style={{
			padding: '2px',
			color: 'inherit',
			flexGrow: 0,
			flexShrink: 0,
			opacity: sortActive ? 1 : 0,
			transform: sortDirection === SortOrder.DESC ? 'rotate(180deg)' : undefined,
		}}
	>
		&#9650;
	</span>
);

export default NativeSortIcon;
