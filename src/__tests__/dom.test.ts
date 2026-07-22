import { flipElement } from '../dom';

describe('flipElement', () => {
	test('sets a transition back to rest and cleans up on transitionend', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);

		flipElement(el, 40, 'Y', 0.22);

		expect(el.style.transform).toBe('');
		expect(el.style.transition).toBe('transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)');

		el.dispatchEvent(new Event('transitionend'));
		expect(el.style.transition).toBe('');
		expect(el.style.transform).toBe('');

		document.body.removeChild(el);
	});

	test('animates on the requested axis', () => {
		const el = document.createElement('div');
		const setSpy = vi.spyOn(el.style, 'transform', 'set');

		flipElement(el, -25, 'X', 0.2);

		expect(setSpy).toHaveBeenCalledWith('translateX(-25px)');
		setSpy.mockRestore();
	});

	test('re-flipping mid-transition detaches the stale transitionend listener', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);

		flipElement(el, 40, 'Y', 0.22);
		// Interrupt with a second FLIP before the first finishes
		flipElement(el, -20, 'Y', 0.22);

		// A late transitionend from the FIRST animation must not clear the styles
		// of the second, still-running one.
		el.dispatchEvent(new Event('transitionend'));
		// One transitionend fired — it belongs to the current (second) FLIP and cleans it up.
		expect(el.style.transition).toBe('');
		expect(el.style.transform).toBe('');

		// A further stray transitionend is a no-op (listener already removed).
		el.style.transition = 'sentinel';
		el.dispatchEvent(new Event('transitionend'));
		expect(el.style.transition).toBe('sentinel');

		document.body.removeChild(el);
	});
});
