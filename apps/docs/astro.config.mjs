import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
	markdown: {
		shikiConfig: { theme: 'catppuccin-macchiato' },
	},
	integrations: [react(), tailwind({ applyBaseStyles: false })],
	vite: {
		resolve: {
			alias: {
				// In dev, resolve the library from local source so edits are instant
				'react-data-table-component': new URL('../../src/index.ts', import.meta.url).pathname,
			},
		},
	},
});
