import { promises as fs } from 'node:fs';

// Prepend "use client" to the built bundles so Next.js App Router can import
// <DataTable> directly from a Server Component file. Done as a post-build step
// because tsup's `banner: { js: '"use client";' }` gets stripped during the
// tree-shake pass.
const TARGETS = ['dist/index.js', 'dist/index.mjs'];
const DIRECTIVE = '"use client";\n';

await Promise.all(
	TARGETS.map(async file => {
		const contents = await fs.readFile(file, 'utf8');
		if (!contents.startsWith('"use client"')) {
			await fs.writeFile(file, DIRECTIVE + contents);
		}
	}),
);
