import React from 'react';
import styled from 'styled-components';
import { SortOrder } from '../DataTable/types';

const Icon = styled.span<{
	$sortactive: boolean;
	$sortDirection: SortOrder;
}>`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({ $sortactive }) => ($sortactive ? 'opacity: 1' : 'opacity: 0')};
	${({ $sortDirection }) => $sortDirection === 'desc' && 'transform: rotate(180deg)'};
`;

interface NativeSortIconProps {
	sortactive: boolean;
	sortDirection: SortOrder;
}

const NativeSortIcon: React.FC<NativeSortIconProps> = ({ sortactive, sortDirection }) => (
	<Icon $sortactive={sortactive} $sortDirection={sortDirection}>
		&#9650;
	</Icon>
);

export default NativeSortIcon;
