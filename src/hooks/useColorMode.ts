import { useState, useEffect } from 'react';
import type { ColorMode } from '../types';

function detectDark(): boolean {
	if (typeof window === 'undefined') return false;
	// Explicit user preference (written by the site's theme toggle) wins
	const stored = localStorage.getItem('theme');
	if (stored) return stored === 'dark';
	// Otherwise, trust the class (set at load time) or the OS preference
	return (
		document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches
	);
}

/**
 * Resolves a ColorMode to 'light' | 'dark'.
 * When mode is 'system', watches the prefers-color-scheme media query,
 * the html.dark class, and localStorage so the table reacts to theme
 * changes without a page reload.
 */
export function useColorMode(mode: ColorMode = 'light'): 'light' | 'dark' {
	const [resolved, setResolved] = useState<'light' | 'dark'>(() => {
		if (mode !== 'system') return mode;
		return detectDark() ? 'dark' : 'light';
	});

	useEffect(() => {
		if (mode !== 'system') {
			setResolved(mode);
			return;
		}

		const update = () => setResolved(detectDark() ? 'dark' : 'light');
		update();

		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		mq.addEventListener('change', update);

		const obs = new MutationObserver(update);
		obs.observe(document.documentElement, { attributeFilter: ['class'] });

		window.addEventListener('storage', update);

		return () => {
			mq.removeEventListener('change', update);
			obs.disconnect();
			window.removeEventListener('storage', update);
		};
	}, [mode]);

	return resolved;
}
