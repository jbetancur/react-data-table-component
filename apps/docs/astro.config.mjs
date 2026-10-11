import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Fails the build when a page links to a site path that wasn't generated. Anchors aren't
// checked: most heading ids are assigned client-side by TableOfContents.
const checkInternalLinks = {
	name: 'check-internal-links',
	hooks: {
		'astro:build:done': async ({ dir, logger }) => {
			const root = fileURLToPath(dir);
			const pages = (await readdir(root, { recursive: true })).filter(f => f.endsWith('.html'));
			const broken = new Set();
			for (const page of pages) {
				const html = await readFile(join(root, page), 'utf8');
				for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
					// pagefind/ is generated after astro build
					if (href.startsWith('//') || href.startsWith('/pagefind/')) {
						continue;
					}
					const target = join(root, decodeURI(href));
					if (!existsSync(target) && !existsSync(`${target}.html`)) {
						broken.add(`${page} -> ${href}`);
					}
				}
			}
			if (broken.size) {
				throw new Error(`Broken internal links:\n${[...broken].join('\n')}`);
			}
			logger.info(`internal links OK across ${pages.length} pages`);
		},
	},
};

export default defineConfig({
	site: 'https://reactdatatable.com',
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	markdown: {
		shikiConfig: { theme: 'catppuccin-macchiato' },
	},
	integrations: [react(), sitemap(), checkInternalLinks],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				// In dev, resolve the library from local source so edits are instant
				'react-data-table-component': new URL('../../src/index.ts', import.meta.url).pathname,
				// Allow importing the root CHANGELOG.md as an Astro markdown module
				'~changelog': new URL('../../CHANGELOG.md', import.meta.url).pathname,
			},
		},
		server: {
			fs: {
				// Allow Vite to serve files from the monorepo root
				allow: [new URL('../..', import.meta.url).pathname],
			},
		},
	},
});
