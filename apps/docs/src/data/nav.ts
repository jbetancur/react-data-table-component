// Single source for the docs sidebar, prev/next links, the recipes index, and /llms.txt.
// Every /docs/ link needs a `description`: it becomes the page's llms.txt line, so keep it
// factual and neutral (it is read by LLMs and crawlers, not just people).

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  group: string;
  links: NavLink[];
}

export const nav: NavGroup[] = [
  {
    group: 'Introduction',
    links: [
      { label: 'Getting Started', href: '/docs/getting-started', description: 'install and render a first table' },
      { label: 'Installation', href: '/docs/installation', description: 'package managers, CSS import, framework setup' },
      {
        label: 'Comparisons',
        href: '/docs/comparisons',
        description: 'how this compares to TanStack Table, AG Grid, MUI X Data Grid, and the plain MUI Table',
      },
      { label: 'Changelog', href: '/docs/changelog', description: 'release history' },
      { label: 'llms.txt', href: '/llms.txt' },
    ],
  },
  {
    group: 'Reference',
    links: [
      { label: 'API Reference', href: '/docs/api', description: 'all props and types' },
      { label: 'Migration Guide', href: '/docs/migration', description: 'upgrading from v7 to v8' },
    ],
  },
  {
    group: 'Columns',
    links: [
      { label: 'Overview', href: '/docs/columns', description: 'defining columns, selectors, formatting' },
      { label: 'Cell Rendering', href: '/docs/cells', description: 'custom cell components' },
      { label: 'Column Groups', href: '/docs/column-groups', description: 'spanning headers across columns' },
      { label: 'Column Visibility', href: '/docs/column-visibility', description: 'show and hide columns' },
      {
        label: 'Column Reordering',
        href: '/docs/column-reorder',
        description: 'drag to reorder, mouse or touch (press-and-hold on touch)',
      },
      {
        label: 'Column Resizing',
        href: '/docs/resizable',
        description: 'drag column edges by mouse or touch, persist widths',
      },
      { label: 'Column Pinning', href: '/docs/column-pinning', description: 'pin columns left or right' },
      {
        label: 'Column Separators',
        href: '/docs/column-separators',
        description: 'vertical divider lines between header and body columns',
      },
    ],
  },
  {
    group: 'Data',
    links: [
      { label: 'Sorting', href: '/docs/sorting', description: 'client-side and server-side sorting' },
      {
        label: 'Column Filtering',
        href: '/docs/filtering',
        description:
          'per-column text, number, date, time, and set filters with operators and AND/OR conditions, multi-value cells, and server-side filtering',
      },
      {
        label: 'Pagination',
        href: '/docs/pagination',
        description: 'built-in and custom pagination, server-side',
      },
      {
        label: 'Inline Editing',
        href: '/docs/inline-editing',
        description:
          'edit cells in place with built-in editor types, per-column validation, and optimistic server-save patterns',
      },
      { label: 'Export (CSV / JSON)', href: '/docs/export', description: 'CSV and JSON export' },
    ],
  },
  {
    group: 'Rows',
    links: [
      {
        label: 'Row Interactions',
        href: '/docs/row-interactions',
        description: 'click, double-click, hover handlers',
      },
      {
        label: 'Row Selection',
        href: '/docs/selection',
        description: 'checkbox multi-select, select all, controlled selection',
      },
      { label: 'Row Pinning', href: '/docs/row-pinning', description: 'pin rows to top' },
      { label: 'Expandable Rows', href: '/docs/expandable', description: 'detail panels with any component' },
    ],
  },
  {
    group: 'Layout',
    links: [
      {
        label: 'Fixed Header',
        href: '/docs/fixed-header',
        description: 'sticky header with scrollable body; when to disable the responsive scroll container',
      },
      { label: 'Footer', href: '/docs/footer', description: 'summary and pagination footers' },
      { label: 'Loading State', href: '/docs/loading', description: 'progress and skeleton states' },
      { label: 'Mobile', href: '/docs/mobile', description: 'responsive columns and layouts' },
    ],
  },
  {
    group: 'Interactivity',
    links: [
      {
        label: 'Context Menu',
        href: '/docs/context-menu',
        description:
          'right-click or menu-button menu with built-in header actions (sort, pin, hide, reset) and custom row actions',
      },
      {
        label: 'Keyboard Navigation',
        href: '/docs/keyboard-navigation',
        description: 'cellNavigation prop for spreadsheet-style ARIA grid keyboard navigation',
      },
      { label: 'Animations', href: '/docs/animations', description: 'row animations' },
    ],
  },
  {
    group: 'Accessibility & i18n',
    links: [
      { label: 'Accessibility', href: '/docs/accessibility', description: 'ARIA roles and screen reader support' },
      { label: 'Localization', href: '/docs/localization', description: 'translated labels and locales' },
      { label: 'RTL Support', href: '/docs/rtl', description: 'right-to-left layouts' },
    ],
  },
  {
    group: 'Styling',
    links: [
      { label: 'Themes', href: '/docs/themes', description: '5 built-in themes with dark mode, createTheme()' },
      { label: 'Custom Styles', href: '/docs/custom-styles', description: 'style every table region' },
      { label: 'Conditional Styles', href: '/docs/conditional-styles', description: 'style rows and cells by data' },
    ],
  },
  {
    group: 'Headless',
    links: [
      {
        label: 'Overview',
        href: '/docs/headless',
        description:
          'what the headless hooks are, the /headless entry, how the hooks fit together, and when to use them instead of the DataTable component',
      },
      {
        label: 'Hook Reference',
        href: '/docs/headless/reference',
        description: 'signatures, options, defaults, and return values for each headless hook and pinning helper',
      },
      {
        label: 'Tailwind Example',
        href: '/docs/headless/tailwind',
        description:
          'a sortable, filterable, selectable, paginated table built from the headless hooks and Tailwind utility classes, without the DataTable component or its stylesheet',
      },
    ],
  },
  {
    group: 'Advanced',
    links: [
      { label: 'TypeScript', href: '/docs/typescript', description: 'generic column and row typing' },
      { label: 'SSR', href: '/docs/ssr', description: 'Next.js App Router, Remix, Astro' },
      { label: 'Performance', href: '/docs/performance', description: 'large datasets, memoization' },
    ],
  },
  {
    group: 'Recipes',
    links: [
      {
        label: 'Approval workflow',
        href: '/docs/recipes/approval-workflow',
        description:
          "Bulk-approve or reject requests. Toolbar buttons adapt to the selected rows' status. Already-resolved rows are excluded automatically.",
      },
      {
        label: 'Server-side sort & filter',
        href: '/docs/recipes/server-side',
        description: 'Wire sorting, pagination, and column filters to your own API in a single useEffect.',
      },
      {
        label: 'URL-synced table state',
        href: '/docs/recipes/url-synced-state',
        description: 'Sync sort, filters, and pagination to the URL so links are shareable and state survives reload and back navigation.',
      },
      {
        label: 'Dashboard drill-down',
        href: '/docs/recipes/dashboard-drilldown',
        description: 'Department overview with expandable rows, health-status row tinting, and inline budget-spend bars.',
      },
      {
        label: 'Audit log viewer',
        href: '/docs/recipes/audit-log',
        description: 'Fixed header, severity row tinting, and multi-field live search.',
      },
      {
        label: 'Persist column widths',
        href: '/docs/recipes/persist-column-widths',
        description: 'Save and restore resizable column widths to localStorage or a back-end API.',
      },
      {
        label: 'Inline row actions',
        href: '/docs/recipes/inline-row-actions',
        description: 'Per-row ⋮ menu with edit, duplicate, and delete actions and confirmation modals.',
      },
      {
        label: 'Live-updating grid',
        href: '/docs/recipes/live-updates',
        description: 'Flash-on-change rows for a real-time price grid, using conditionalRowStyles and keyField.',
      },
      {
        label: 'Editable inventory grid',
        href: '/docs/recipes/inventory-editor',
        description: 'Spreadsheet-style inline editing with a derived total column and a running grand total.',
      },
      {
        label: 'Grouped rows with aggregates',
        href: '/docs/recipes/row-groups',
        description: 'Per-group totals and drill-down built with an array reduce instead of a groupBy API.',
      },
      {
        label: 'CSV import',
        href: '/docs/recipes/csv-import',
        description: 'Load a user-uploaded CSV file into the table with FileReader and a small parser.',
      },
    ],
  },
];

export const recipes = nav.find(({ group }) => group === 'Recipes')!.links;
