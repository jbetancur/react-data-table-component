import { renderHook, act } from '@testing-library/react';
import useRowExpander from '../hooks/useRowExpander';

describe('useRowExpander', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	test('open mounts and expands immediately', () => {
		const { result } = renderHook(() => useRowExpander(false, true));
		act(() => result.current.openExpander());
		expect(result.current.expanded).toBe(true);
		expect(result.current.expanderMounted).toBe(true);
		expect(result.current.isClosing).toBe(false);
	});

	test('close keeps the expander mounted in a closing state until the animation finishes', () => {
		const { result } = renderHook(() => useRowExpander(true, true));
		act(() => result.current.closeExpander());
		// Still mounted, now closing
		expect(result.current.expanded).toBe(false);
		expect(result.current.expanderMounted).toBe(true);
		expect(result.current.isClosing).toBe(true);
		// After the animation duration it unmounts
		act(() => vi.advanceTimersByTime(220));
		expect(result.current.expanderMounted).toBe(false);
		expect(result.current.isClosing).toBe(false);
	});

	test('without animation, close unmounts immediately', () => {
		const { result } = renderHook(() => useRowExpander(true, false));
		act(() => result.current.closeExpander());
		expect(result.current.expanderMounted).toBe(false);
		expect(result.current.isClosing).toBe(false);
	});

	test('a re-sync to false during a close does not cut the close animation short', () => {
		let defaultExpanded = true;
		const { result, rerender } = renderHook(() => useRowExpander(defaultExpanded, true));
		act(() => result.current.closeExpander());
		expect(result.current.isClosing).toBe(true);

		// A render where the controlled value is already false must not force an unmount
		defaultExpanded = false;
		act(() => rerender());
		expect(result.current.expanderMounted).toBe(true);
		expect(result.current.isClosing).toBe(true);

		// The close timer still completes the unmount
		act(() => vi.advanceTimersByTime(220));
		expect(result.current.expanderMounted).toBe(false);
	});

	test('pending close timer is cleared on unmount (no dispatch after unmount)', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { result, unmount } = renderHook(() => useRowExpander(true, true));
		act(() => result.current.closeExpander());
		unmount();
		act(() => vi.advanceTimersByTime(220));
		// No "state update on unmounted component" warning
		expect(errorSpy).not.toHaveBeenCalled();
		errorSpy.mockRestore();
	});
});
