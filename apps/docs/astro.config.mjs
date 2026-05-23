import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://reactdatatable.com',
	markdown: {
		shikiConfig: { theme: 'catppuccin-macchiato' },
	},
	integrations: [react(), tailwind({ applyBaseStyles: false }), sitemap()],
	vite: {
		resolve: {
			alias: {
				// In dev, resolve the library from local source so edits are instant
				'react-data-table-component': new URL('../../src/index.ts', import.meta.url).pathname,
			},
		},
	},
});
