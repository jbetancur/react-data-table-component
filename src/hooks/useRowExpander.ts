import * as React from 'react';

const EXPAND_DURATION = 220;

type ExpanderState = { expanded: boolean; mounted: boolean; closing: boolean };
type ExpanderAction = { type: 'open' } | { type: 'close' } | { type: 'unmount' } | { type: 'sync'; value: boolean };

function expanderReducer(state: ExpanderState, action: ExpanderAction): ExpanderState {
	switch (action.type) {
		case 'open':
			return { expanded: true, mounted: true, closing: false };
		case 'close':
			return { ...state, expanded: false, closing: true };
		case 'unmount':
			return { expanded: false, mounted: false, closing: false };
		case 'sync':
			return { expanded: action.value, mounted: action.value, closing: false };
		default:
			return state;
	}
}

// Expander open/close with an optional exit animation: `close` keeps the expander
// mounted in a closing state until the animation finishes, then unmounts it.
export default function useRowExpander(defaultExpanded: boolean, animateRows: boolean) {
	const [state, dispatch] = React.useReducer(expanderReducer, {
		expanded: defaultExpanded,
		mounted: defaultExpanded,
		closing: false,
	});

	React.useEffect(() => {
		dispatch({ type: 'sync', value: defaultExpanded });
	}, [defaultExpanded]);

	const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const openExpander = React.useCallback(() => {
		if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
		dispatch({ type: 'open' });
	}, []);

	const closeExpander = React.useCallback(() => {
		if (animateRows) {
			dispatch({ type: 'close' });
			closeTimerRef.current = setTimeout(() => {
				dispatch({ type: 'unmount' });
			}, EXPAND_DURATION);
		} else {
			dispatch({ type: 'unmount' });
		}
	}, [animateRows]);

	return {
		expanded: state.expanded,
		expanderMounted: state.mounted,
		isClosing: state.closing,
		openExpander,
		closeExpander,
	};
}
