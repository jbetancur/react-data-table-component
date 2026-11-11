// @vitest-environment node
import ts from 'typescript';

describe('headless entry', () => {
	// The whole point of the entry: importing it must not pull in a component or
	// DataTable.css. Walk the runtime import graph from src/headless.ts and check.
	test('imports no component and no stylesheet', () => {
		const srcDir = new URL('../', import.meta.url);
		const seen = new Set<string>();
		const queue = [new URL('headless.ts', srcDir).href];

		const resolve = (from: string, spec: string): string | undefined =>
			['.ts', '.tsx', '/index.ts']
				.map(ext => new URL(spec + ext, from))
				.find(candidate => ts.sys.fileExists(decodeURIComponent(candidate.pathname)))?.href;

		while (queue.length > 0) {
			const file = queue.pop() as string;
			if (seen.has(file)) {
				continue;
			}
			seen.add(file);

			const source = ts.sys.readFile(decodeURIComponent(new URL(file).pathname)) ?? '';
			// Runtime imports/re-exports only: `import type` / `export type` are erased.
			const specs = source.matchAll(/^(?:import|export)\s+(?!type\b)[^;]*?from\s+'(\.[^']+)'|^import\s+'(\.[^']+)'/gm);

			for (const match of specs) {
				const spec = match[1] ?? match[2];
				expect(spec.endsWith('.css')).toBe(false);
				const resolved = resolve(file, spec);
				if (resolved) {
					queue.push(resolved);
				}
			}
		}

		const visited = [...seen].map(file => file.slice(srcDir.href.length));
		expect(visited).toContain('hooks/useTableState.ts');
		expect(visited.filter(file => file.startsWith('components/'))).toEqual([]);
	});
});
