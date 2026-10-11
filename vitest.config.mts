import { defineConfig } from 'vitest/config';

export default defineConfig({
	// Use one tsconfig for every file. Otherwise Vite picks the nearest one, and docsCatalog.test.ts
	// imports from apps/docs, whose tsconfig extends a preset from the docs' own (uninstalled in CI) deps.
	tsconfig: './tsconfig.test.json',
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test-setup.ts'],
		typecheck: {
			tsconfig: './tsconfig.test.json',
		},
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/**/__tests__/**', 'src/index.ts', 'src/locales/**'],
			thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80,
			},
		},
	},
});
