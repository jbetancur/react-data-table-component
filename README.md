[![Netlify Status](https://api.netlify.com/api/v1/badges/26e0d16d-a986-46b1-9097-1a76c10d7cad/deploy-status)](https://app.netlify.com/sites/react-data-table-component/deploys) [![npm version](https://badge.fury.io/js/react-data-table-component.svg)](https://badge.fury.io/js/react-data-table-component) [![codecov](https://codecov.io/gh/jbetancur/react-data-table-component/branch/master/graph/badge.svg)](https://codecov.io/gh/jbetancur/react-data-table-component) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# React Data Table Component

[![GitHub release](https://img.shields.io/github/release/jbetancur/react-data-table-component.svg)](https://GitHub.com/jbetancur/react-data-table-component/releases/) [![npm downloads](https://img.shields.io/npm/dm/react-data-table-component.svg)](https://www.npmjs.com/package/react-data-table-component) [![GitHub stars](https://img.shields.io/github/stars/jbetancur/react-data-table-component.svg)](https://github.com/jbetancur/react-data-table-component/stargazers) [![GitHub commit activity](https://img.shields.io/github/commit-activity/m/jbetancur/react-data-table-component.svg)](https://github.com/jbetancur/react-data-table-component/commits/master) [![Dependents](https://img.shields.io/librariesio/dependent-repos/npm/react-data-table-component.svg)](https://github.com/jbetancur/react-data-table-component/network/dependents)

**A simple but flexible React data table. Working table in 10 lines.** Sorting, selection, pagination, expandable rows, and theming are opt-in props. No atomic HTML table knowledge required.

`react-data-table-component` sits between "render everything yourself" headless toolkits and full "configure-the-grid" frameworks. It's for cases where the table is a means, not the product: admin panels, dashboards, internal tools, MVPs. If you need an Excel clone or a 100k-row analytics grid, there are better-suited libraries for that.

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

- Sorting, row selection, expandable rows, and pagination (all opt-in props)
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

React Data Table Component has been actively maintained since 2018 and is downloaded ~215k times a week. If your team ships products with it, your support keeps it maintained, bug-free, and moving forward.

## Sponsor the project

Sponsoring puts your company logo in front of ~215k developers a week: in the README, the docs site, and every release. It's the right move if your team depends on this library and you want it to keep improving.

| Tier | Price/month | Perk |
| --- | --- | --- |
| ☕ Supporter | $5 | Your name in the README supporters list |
| 🎗 Backer | $20 | Name + link in README + listed in the Backers section on reactdatatable.com |
| 🥉 Bronze | $100 | Priority issue triage + small logo in README + docs site footer |
| 🥈 Silver | $200 | Priority issue triage + medium logo in README + docs site sidebar |
| 🥇 Gold | $500 | Priority issue triage + direct maintainer line + large logo in README + hero spot on reactdatatable.com. Limited to 3. |

[![Sponsor on GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-ea4aaa?logo=github)](https://github.com/sponsors/jbetancur)
[![Sponsor on OpenCollective](https://img.shields.io/badge/Sponsor-OpenCollective-blue?logo=opencollective)](https://opencollective.com/react-data-table-component)

## Enterprise support

Available as part of the Tidelift Subscription.

The maintainer of react-data-table-component and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-react-data-table-component?utm_source=npm-react-data-table-component&utm_medium=referral&utm_campaign=readme)

<!-- TODO: replace the Tidelift link above with the exact referral URL from the dashboard's "Promote the Tidelift Subscription" marketing task. -->

## Need help?

Open a [GitHub issue](https://github.com/jbetancur/react-data-table-component/issues). Priority support is available for teams that [sponsor the project](https://github.com/sponsors/jbetancur).

## Sponsors

_Become a [Gold Sponsor](https://github.com/sponsors/jbetancur) and your logo goes here._

## Backers

Thank you to our recurring backers:

- Rich Tillman

# Contributors

[![Contributors](https://contrib.rocks/image?repo=jbetancur/react-data-table-component)](https://github.com/jbetancur/react-data-table-component/graphs/contributors)
