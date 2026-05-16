import { renderHook, act } from '@testing-library/react';
import useWindowSize from '../hooks/useWindowSize';

test('returns the current window dimensions', () => {
	const { result } = renderHook(() => useWindowSize());

	expect(result.current.width).toBe(window.innerWidth);
	expect(result.current.height).toBe(window.innerHeight);
});

test('updates when the window is resized', () => {
	const { result } = renderHook(() => useWindowSize());

	act(() => {
		Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
		Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
		window.dispatchEvent(new Event('resize'));
	});

	expect(result.current.width).toBe(800);
	expect(result.current.height).toBe(600);
});
