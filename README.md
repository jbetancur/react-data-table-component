[![Netlify Status](https://api.netlify.com/api/v1/badges/26e0d16d-a986-46b1-9097-1a76c10d7cad/deploy-status)](https://app.netlify.com/sites/react-data-table-component/deploys) [![npm version](https://badge.fury.io/js/react-data-table-component.svg)](https://badge.fury.io/js/react-data-table-component) [![codecov](https://codecov.io/gh/jbetancur/react-data-table-component/branch/master/graph/badge.svg)](https://codecov.io/gh/jbetancur/react-data-table-component) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# React Data Table Component

[![GitHub release](https://img.shields.io/github/release/jbetancur/react-data-table-component.svg)](https://GitHub.com/jbetancur/react-data-table-component/releases/)

**A simple but flexible React data table — a working table in 10 lines.** Sorting, selection, pagination, expandable rows, and theming come built-in as opt-in props. No atomic HTML table knowledge required.

This library lives in the middle ground between "render everything yourself" headless toolkits and full "configure-the-grid" frameworks. It's for the cases where the table is a _means_, not the product — admin panels, dashboards, internal tools, MVPs. If you need an Excel clone or a 100k-row analytics grid, there are already some great table
libraries out there.

## Quick start

```tsx
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'Title', selector: row => row.title, sortable: true },
  { name: 'Year', selector: row => row.year, sortable: true },
  { name: 'Director', selector: row => row.director },
];

export default function Movies() {
  return <DataTable columns={columns} data={data} pagination />;
}
```

# Key Features

- Sorting, row selection, expandable rows, and pagination — all opt-in props
- Themeable via CSS variables; deeply customizable via `customStyles`
- Accessible (`role`, `aria-sort`, `aria-selected`, keyboard navigation)
- Responsive (x-scroll / flex)
- TypeScript types bundled
- SSR-safe; ships `"use client"` for Next.js App Router (import directly into a Server Component file)
- Headless hooks exported for full markup/style control when you outgrow the defaults

# Documentation Website

The documentation contains information about installation, usage and contributions.

[reactdatatable.com](https://reactdatatable.com)

# Supporting React Data Table Component

React Data Table Component is maintained by one person and downloaded ~200k times a week. If your team ships products with it, your support keeps it maintained, bug-free, and moving forward.

## Sponsor the project

Sponsoring puts your company logo in front of ~200k developers a week — on the README, the docs site, and in every release. It's the right move if your team depends on this library and you want it to keep improving.

| Tier | Price/month | Perk |
| --- | --- | --- |
| ☕ Supporter | $10 | Your name in the README supporters list |
| 🥉 Bronze | $100 | Small logo in README + docs site footer |
| 🥈 Silver | $500 | Larger logo in README + docs site sidebar |
| 🥇 Gold | $1,500 | Top logo placement in README + hero spot on reactdatatable.com. Limited to 3. |

[![Sponsor on GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-ea4aaa?logo=github)](https://github.com/sponsors/jbetancur)
[![Sponsor on OpenCollective](https://img.shields.io/badge/Sponsor-OpenCollective-blue?logo=opencollective)](https://opencollective.com/react-data-table-component)

## Priority support for teams

Need a guaranteed response SLA, help with a major version upgrade, or a direct line when something breaks in production? Priority support is a separate paid engagement — not a sponsorship tier.

| Plan | Price/month | What you get |
| --- | --- | --- |
| Standard | $500 | 48hr response SLA on reported issues, private email channel |
| Priority | $2,000 | 24hr SLA, monthly call, bug fixes prioritized for your use case |
| Consulting | $250/hr | One-off: integrations, performance debugging, custom features |

[Get in touch](mailto:johnnyazee@gmail.com) to discuss your team's needs.

## Sponsors

_Become a [Gold Sponsor](https://github.com/sponsors/jbetancur) and your logo goes here._

# Contributors

[![Contributors](https://contrib.rocks/image?repo=jbetancur/react-data-table-component)](https://github.com/jbetancur/react-data-table-component/graphs/contributors)
