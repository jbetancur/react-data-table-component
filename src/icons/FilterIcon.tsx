import React from 'react';

type FilterIconProps = {
	size?: number;
};

const FilterIcon: React.FC<FilterIconProps> = ({ size = 14 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={size}
		height={size}
		fill="currentColor"
		aria-hidden="true"
		role="presentation"
	>
		<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
	</svg>
);

export default FilterIcon;
