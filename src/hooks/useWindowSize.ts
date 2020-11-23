// Credit: https://usehooks.com/useWindowSize/
import * as React from 'react';

type Hook = () => {
	width: number | undefined;
	height: number | undefined;
};

const useWindowSize: Hook = () => {
	const isClient = typeof window === 'object';

	function getSize() {
		return {
			width: isClient ? window.innerWidth : undefined,
			height: isClient ? window.innerHeight : undefined,
		};
	}

	const [windowSize, setWindowSize] = React.useState(getSize);

	React.useEffect(() => {
		if (!isClient) {
			return () => null;
		}

		function handleResize() {
			setWindowSize(getSize());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return windowSize;
};

export default useWindowSize;
