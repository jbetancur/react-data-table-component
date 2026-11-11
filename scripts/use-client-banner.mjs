import { promises as fs } from 'node:fs';

// Prepend "use client" to the built bundles so Next.js App Router can import
// <DataTable> directly from a Server Component file. The headless bundle gets it
// too: its exports are hooks, which only run in Client Components. Done as a post-build step
// because tsup's `banner: { js: '"use client";' }` gets stripped during the
// tree-shake pass.
// Each tsup config passes its own outputs: the configs build in parallel, so one
// config's onSuccess cannot assume another's files exist yet.
const TARGETS = process.argv.slice(2);
const DIRECTIVE = '"use client";\n';

await Promise.all(
	TARGETS.map(async file => {
		const contents = await fs.readFile(file, 'utf8');
		if (!contents.startsWith('"use client"')) {
			await fs.writeFile(file, DIRECTIVE + contents);
		}
	}),
);
