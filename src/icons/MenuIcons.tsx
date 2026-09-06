import React from 'react';

type IconProps = {
	size?: number;
};

function icon(path: React.ReactNode) {
	const Icon: React.FC<IconProps> = ({ size = 14 }) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="currentColor"
			aria-hidden="true"
			role="presentation"
		>
			{path}
		</svg>
	);

	return Icon;
}

export const SortAscIcon = icon(<path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />);

export const SortDescIcon = icon(<path d="M3 6h6V4H3v2zm0 7h12v-2H3v2zm0 7h18v-2H3v2z" />);

export const ClearSortIcon = icon(
	<path d="M3 6v2h12V6H3zm0 7h8v-2H3v2zm0 7h8v-2H3v2zm16.6-6L17 15.6 14.4 13 13 14.4l2.6 2.6L13 19.6 14.4 21l2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6 2.6-2.6L19.6 13z" />,
);

export const PinLeftIcon = icon(<path d="M4 3h2v18H4V3zm5 8h8.2l-2.6-2.6L16 7l5 5-5 5-1.4-1.4 2.6-2.6H9v-2z" />);

export const PinRightIcon = icon(<path d="M18 3h2v18h-2V3zm-3 8H6.8l2.6-2.6L8 7l-5 5 5 5 1.4-1.4L6.8 13H15v-2z" />);

export const UnpinIcon = icon(
	<path d="M12 2a5 5 0 0 1 5 5v4l2 3v2h-5.2v6h-1.6v-6H6v-2l2-3V7a5 5 0 0 1 4-4.9V2zm0 2a3 3 0 0 0-3 3v4.6L7.9 13h8.2L15 11.6V7a3 3 0 0 0-3-3z" />,
);

export const HideColumnIcon = icon(
	<path d="M12 6c3.9 0 7.2 2.4 8.6 6-.5 1.3-1.3 2.4-2.3 3.3l1.4 1.4c1.4-1.3 2.5-2.9 3.1-4.7-1.6-4.1-5.6-7-10.3-7-1.3 0-2.5.2-3.6.6l1.6 1.6c.7-.1 1.3-.2 2-.2zM2.4 3.5 1 4.9l3 3C2.5 9 1.4 10.4.7 12c1.6 4.1 5.6 7 10.3 7 1.7 0 3.3-.4 4.7-1l3.1 3.1 1.4-1.4L2.4 3.5zM8.5 9.6l1.5 1.5c0 .1-.1.2-.1.4a2.1 2.1 0 0 0 2.1 2.1c.1 0 .3 0 .4-.1l1.5 1.5c-.6.3-1.2.5-1.9.5a4 4 0 0 1-4-4c0-.7.2-1.3.5-1.9z" />,
);

export const ResetIcon = icon(<path d="M12 5V2L8 6l4 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />);
