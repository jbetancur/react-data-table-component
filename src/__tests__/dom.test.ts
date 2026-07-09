import { flipElement } from '../dom';

describe('flipElement', () => {
	test('sets a transition back to rest and cleans up on transitionend', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);

		flipElement(el, 40, 'Y', 0.22);

		expect(el.style.transform).toBe('');
		expect(el.style.transition).toBe('transform 0.22s cubic-bezier(0.2, 0, 0, 1)');

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
});
