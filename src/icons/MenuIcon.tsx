import React from 'react';

type MenuIconProps = {
	size?: number;
};

const MenuIcon: React.FC<MenuIconProps> = ({ size = 14 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={size}
		height={size}
		fill="currentColor"
		aria-hidden="true"
		role="presentation"
	>
		<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
	</svg>
);

export default MenuIcon;
