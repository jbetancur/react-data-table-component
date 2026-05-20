import { defineConfig } from 'tsup';

export default defineConfig([
	// Main bundle — CSS is injected at runtime. Regular users need no CSS import.
	// onSuccess prepends "use client" so Next.js App Router can import <DataTable>
	// directly from a Server Component file.
	{
		entry: ['src/index.ts'],
		format: ['esm', 'cjs'],
		dts: true,
		sourcemap: true,
		clean: true,
		external: ['react', 'react-dom'],
		injectStyle: true,
		treeshake: true,
		minify: true,
		onSuccess: 'node scripts/use-client-banner.mjs',
	},
	// Locales bundle — pure data, no React, no CSS.
	{
		entry: { 'locales/index': 'src/locales/index.ts' },
		format: ['esm', 'cjs'],
		dts: true,
		sourcemap: true,
		external: ['react', 'react-dom'],
		treeshake: true,
		minify: true,
	},
	// CSS-only build — emits dist/DataTable.css for SSR consumers (e.g. Next.js App Router)
	// that need to import the stylesheet explicitly in a layout to avoid FOUC.
	{
		entry: { DataTable: 'src/index.ts' },
		format: ['esm'],
		external: ['react', 'react-dom'],
		injectStyle: false,
		treeshake: true,
		minify: true,
		// Only keep the emitted CSS file — the duplicate JS is not published.
		onSuccess: 'rm -f dist/DataTable.mjs dist/DataTable.mjs.map',
	},
]);
