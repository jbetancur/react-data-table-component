import * as React from 'react';

type Hook = (fn: () => void, inputs: unknown[]) => void;

const useFirstUpdate: Hook = (fn, inputs) => {
	const firstUpdate = React.useRef(true);

	React.useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}

		fn();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, inputs);
};

export default useFirstUpdate;
