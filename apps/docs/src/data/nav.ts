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
      {
        label: 'Column Filtering',
        href: '/docs/filtering',
        description:
          "per-column text, number, date, datetime, and time-of-day filters with operator selection and two-condition AND/OR logic, plus set filters that pick from a checklist of a column's distinct values or a supplied list, optionally splitting cells that hold several values, and a filterServer option for backend filtering",
      },
      { label: 'Sorting', href: '/docs/sorting', description: 'client-side and server-side sorting' },
    ],
  },
  {
    group: 'Editing',
    links: [
      {
        label: 'Inline Editing',
        href: '/docs/inline-editing',
        description:
          'edit cells in place with built-in editor types, per-column validation, and optimistic server-save patterns',
      },
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
      { label: 'Conditional Styles', href: '/docs/conditional-styles', description: 'style rows and cells by data' },
      {
        label: 'Fixed Header',
        href: '/docs/fixed-header',
        description: 'sticky header with scrollable body; when to disable the responsive scroll container',
      },
      {
        label: 'Pagination',
        href: '/docs/pagination',
        description: 'built-in and custom pagination, server-side',
      },
      { label: 'Footer', href: '/docs/footer', description: 'summary and pagination footers' },
      { label: 'Loading State', href: '/docs/loading', description: 'progress and skeleton states' },
    ],
  },
  {
    group: 'Interactivity',
    links: [
      { label: 'Animations', href: '/docs/animations', description: 'row animations' },
      { label: 'Accessibility', href: '/docs/accessibility', description: 'ARIA roles and screen reader support' },
      {
        label: 'Keyboard Navigation',
        href: '/docs/keyboard-navigation',
        description: 'cellNavigation prop for spreadsheet-style ARIA grid keyboard navigation',
      },
      {
        label: 'Context Menu',
        href: '/docs/context-menu',
        description:
          'right-click or menu-button menu with built-in header actions (sort, pin, hide, reset) and custom row actions',
      },
      { label: 'Localization', href: '/docs/localization', description: 'translated labels and locales' },
      { label: 'RTL Support', href: '/docs/rtl', description: 'right-to-left layouts' },
      { label: 'Mobile', href: '/docs/mobile', description: 'responsive columns and layouts' },
    ],
  },
  {
    group: 'Styling',
    links: [
      { label: 'Themes', href: '/docs/themes', description: '5 built-in themes with dark mode, createTheme()' },
      { label: 'Custom Styles', href: '/docs/custom-styles', description: 'style every table region' },
    ],
  },
  {
    group: 'Import / Export',
    links: [{ label: 'Export (CSV / JSON)', href: '/docs/export', description: 'CSV and JSON export' }],
  },
  {
    group: 'Advanced',
    links: [
      { label: 'Headless Hooks', href: '/docs/headless', description: 'use the logic without the UI' },
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
        description: 'Sync sort, filters, and pagination to the URL: shareable links, reload-safe, back button works.',
      },
      {
        label: 'Dashboard drill-down',
        href: '/docs/recipes/dashboard-drilldown',
        description: 'Department overview with expandable rows, health-status row tinting, and inline budget-spend bars.',
      },
      {
        label: 'Audit log viewer',
        href: '/docs/recipes/audit-log',
        description: 'Fixed header, severity row tinting, and multi-field live search, all wired together.',
      },
      {
        label: 'Persist column widths',
        href: '/docs/recipes/persist-column-widths',
        description: 'Save and restore resizable column widths to localStorage or a back-end API.',
      },
      {
        label: 'Inline row actions',
        href: '/docs/recipes/inline-row-actions',
        description: 'Per-row ⋮ menu with edit, duplicate, and delete, with confirmation modals included.',
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
        description: 'Per-group totals and drill-down built from a plain array reduce, no groupBy API needed.',
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
