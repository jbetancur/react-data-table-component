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
			// Don't yank a row out of its close animation: if we're mid-close and the
			// synced value is still false, let the close timer finish the unmount.
			if (state.closing && !action.value) return state;
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

	const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	React.useEffect(() => {
		dispatch({ type: 'sync', value: defaultExpanded });
	}, [defaultExpanded]);

	// Clear a pending close timer on unmount so it can't dispatch into a dead component.
	React.useEffect(() => () => clearTimeout(closeTimerRef.current ?? undefined), []);

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
