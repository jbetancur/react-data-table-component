import type { APIRoute } from 'astro';
import { nav } from '../data/nav';

const header = `# react-data-table-component

> A fast, accessible React data table component with sorting, pagination, row selection, expandable rows, column filtering, and theming built in. Zero runtime dependencies, Apache-2.0 licensed, free with no paid tier. A working table takes about 10 lines of code.

Install: \`npm install react-data-table-component\`

Minimal usage:

\`\`\`tsx
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Role', selector: row => row.role },
];

<DataTable columns={columns} data={data} pagination />
\`\`\``;

const optional = `## Optional

- [Support & Sponsorship](https://reactdatatable.com/support): sponsor tiers, direct consulting and enterprise support
- [GitHub repository](https://github.com/jbetancur/react-data-table-component)
- [npm package](https://www.npmjs.com/package/react-data-table-component)`;

export const GET: APIRoute = ({ site }) => {
	const sections = nav.map(({ group, links }) => {
		const lines = links
			.filter(({ href }) => href.startsWith('/docs/'))
			.map(({ label, href, description }) => {
				if (!description) throw new Error(`nav.ts: ${href} needs a description for llms.txt`);
				return `- [${label}](${new URL(href, site)}): ${description}`;
			});
		return `## ${group}\n\n${lines.join('\n')}`;
	});

	return new Response([header, ...sections, optional].join('\n\n') + '\n', {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
