// Single source of truth for DataTable prop reference tables.
//
// Both the API reference (/docs/api) and every feature page render their prop
// tables from this catalog via <PropsTable>. Add a prop once here, tag it with
// the feature pages it belongs on, and it appears everywhere with no drift.
//
// `description` is the canonical (fuller) copy shown on the API reference.
// `brief` is an optional shorter description shown on feature pages; when a
// feature page renders a prop with no `brief`, it falls back to `description`.
// All string fields are HTML (use <code>…</code>, &gt;, &lt;), matching how the
// <DocsTable> component renders cells via set:html.

export type PropFeature =
  | 'core'
  | 'layout'
  | 'theming'
  | 'sorting'
  | 'pagination'
  | 'footer'
  | 'selection'
  | 'expandable'
  | 'row-events'
  | 'keyboard'
  | 'resizable'
  | 'column-groups'
  | 'column-pinning'
  | 'filtering'
  | 'column-reorder'
  | 'context-menu'
  | 'localization'
  | 'cells'
  | 'inline-editing'
  | 'column-visibility'
  | 'rtl'
  | 'fixed-header'
  | 'loading';

// Which api.astro `###` subsection a prop renders under, in source order.
export type PropGroup =
  | 'Data'
  | 'Layout & appearance'
  | 'Theming & styling'
  | 'Sorting'
  | 'Pagination'
  | 'Footer'
  | 'Row selection'
  | 'Expandable rows'
  | 'Row events'
  | 'Keyboard navigation'
  | 'Column features'
  | 'Context menu'
  | 'Localization';

export interface PropDef {
  name: string;
  /** `true` = DataTable prop, `column` = TableColumn field, `ref` = imperative handle method. */
  on?: 'table' | 'column' | 'ref';
  type: string;
  default?: string;
  /** Canonical description, shown on the API reference. HTML. */
  description: string;
  /** Optional shorter description for feature pages. Falls back to `description`. HTML. */
  brief?: string;
  group: PropGroup;
  features: PropFeature[];
  deprecated?: boolean;
}

const c = (s: string) => `<code>${s}</code>`;

export const dataTableProps: PropDef[] = [
  // ── Data ─────────────────────────────────────────────────────────────────
  {
    name: 'data',
    type: c('T[]'),
    default: '-',
    description: `<strong>Required.</strong> Array of row objects.`,
    brief: 'Row data (required)',
    group: 'Data',
    features: ['core'],
  },
  {
    name: 'columns',
    type: c('TableColumn&lt;T&gt;[]'),
    default: '-',
    description: `<strong>Required.</strong> Column definitions.`,
    brief: 'Column definitions (required)',
    group: 'Data',
    features: ['core'],
  },
  {
    name: 'keyField',
    type: c('string'),
    default: c('"id"'),
    description: `Property on each row used as a stable React key.`,
    group: 'Data',
    features: ['core'],
  },
  {
    name: 'progressPending',
    type: c('boolean'),
    default: c('false'),
    description: `Show a loading state. On initial load (no data yet) renders shimmer skeleton rows. On re-fetch (data already loaded) dims the existing rows and overlays a centered spinner. The column header always stays visible.`,
    brief: 'Show a loading state (skeleton on first load, overlay spinner on re-fetch).',
    group: 'Data',
    features: ['loading'],
  },
  {
    name: 'progressComponent',
    type: c('ReactNode'),
    default: 'built-in spinner',
    description: `Custom loading indicator shown in the re-fetch overlay, and on initial load when ${c('progressSkeleton')} is ${c('false')}.`,
    group: 'Data',
    features: ['loading'],
  },
  {
    name: 'progressSkeleton',
    type: c('boolean'),
    default: c('true'),
    description: `Show shimmer skeleton rows on the initial load (no data yet). Set to ${c('false')} to show ${c('progressComponent')} on initial load instead.`,
    group: 'Data',
    features: ['loading'],
  },
  {
    name: 'noDataComponent',
    type: c('ReactNode'),
    default: 'built-in message',
    description: `Rendered when ${c('data')} is empty.`,
    group: 'Data',
    features: ['loading'],
  },

  // ── Layout & appearance ──────────────────────────────────────────────────
  {
    name: 'title',
    type: `${c('string')} | ${c('ReactNode')}`,
    default: '-',
    description: `Table title shown in the header bar.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'actions',
    type: `${c('ReactNode')} | ${c('ReactNode[]')}`,
    default: '-',
    description: `Content rendered on the right side of the header bar.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'subHeader',
    type: c('ReactNode'),
    default: '-',
    description: `Content for the sub-header bar. Providing any value shows the bar.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'subHeaderAlign',
    type: c('Alignment'),
    default: c('"right"'),
    description: `Alignment of sub-header content.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'subHeaderWrap',
    type: c('boolean'),
    default: c('true'),
    description: `Allow sub-header to wrap onto multiple lines.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'noHeader',
    type: c('boolean'),
    default: c('false'),
    description: `Force-hide the title/actions header bar. The bar otherwise renders only when a ${c('title')} or ${c('actions')} is provided, so you rarely need this.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'noTableHead',
    type: c('boolean'),
    default: c('false'),
    description: `Hide the column header row.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'persistTableHead',
    type: c('boolean'),
    default: c('false'),
    description: `Show the column header even when data is empty. The header always stays visible during ${c('progressPending')} regardless of this prop.`,
    group: 'Layout & appearance',
    features: ['layout', 'loading'],
  },
  {
    name: 'dense',
    type: c('boolean'),
    default: c('false'),
    description: `Reduce row height for a compact look.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'responsive',
    type: c('boolean'),
    default: c('true'),
    description: `Wrap the table in a horizontally scrollable container. Disable only when a parent element owns scrolling, see <a href="/docs/fixed-header#responsive-false">Turning the scroll container off</a>.`,
    group: 'Layout & appearance',
    features: ['layout', 'fixed-header'],
  },
  {
    name: 'fixedHeader',
    type: c('boolean'),
    default: c('false'),
    description: `Stick the column header at the top when scrolling.`,
    brief: 'Stick the column header at the top when scrolling.',
    group: 'Layout & appearance',
    features: ['fixed-header'],
  },
  {
    name: 'fixedHeaderScrollHeight',
    type: c('string'),
    default: c('"100vh"'),
    description: `Max height of the scrollable body when ${c('fixedHeader')} is on.`,
    brief: `Max height of the scrollable body when ${c('fixedHeader')} is on.`,
    group: 'Layout & appearance',
    features: ['fixed-header'],
  },
  {
    name: 'onScroll',
    type: c('(event) =&gt; void'),
    default: '-',
    description: `Called when the user scrolls the table body. Works with both ${c('fixedHeader')} enabled and disabled.`,
    brief: `Called when the user scrolls the table body. Works with ${c('fixedHeader')} on or off.`,
    group: 'Layout & appearance',
    features: ['fixed-header'],
  },
  {
    name: 'direction',
    type: c('Direction'),
    default: c('Direction.AUTO'),
    description: `Text direction (${c('ltr')}, ${c('rtl')}, ${c('auto')}).`,
    brief: `Text direction: ${c('"ltr"')}, ${c('"rtl"')}, or ${c('"auto"')}.`,
    group: 'Layout & appearance',
    features: ['layout', 'rtl'],
  },
  {
    name: 'className',
    type: c('string'),
    default: '-',
    description: `Extra CSS class on the root element.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'style',
    type: c('CSSProperties'),
    default: '-',
    description: `Inline styles on the root element.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'ariaLabel',
    type: c('string'),
    default: '-',
    description: `Value for the table's ${c('aria-label')}.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },
  {
    name: 'disabled',
    type: c('boolean'),
    default: c('false'),
    description: `Disable all interactive controls.`,
    group: 'Layout & appearance',
    features: ['layout'],
  },

  // ── Theming & styling ────────────────────────────────────────────────────
  {
    name: 'theme',
    type: c('ThemeProp'),
    default: c('"default"'),
    description: `Named built-in theme, a ${c('Theme')} object from ${c('createTheme()')}, or a raw CSS-variable map.`,
    brief: `Named theme (e.g. ${c('"material"')}, ${c('"catppuccin"')}, ${c('"crisp"')}).`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'colorMode',
    type: c('ColorMode'),
    default: c('"system"'),
    description: `Controls when the theme's dark-mode overrides apply. ${c('"system"')} follows ${c('localStorage')}, the ${c('html.dark')} class, then ${c('prefers-color-scheme')}. ${c('"light"')} / ${c('"dark"')} force a mode.`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'customStyles',
    type: c('TableStyles'),
    default: '-',
    description: `Fine-grained style overrides. See <a href="#tablestyles">TableStyles</a>.`,
    brief: `Fine-grained style overrides. See <a href="/docs/custom-styles">Custom styles</a>.`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'conditionalRowStyles',
    type: c('ConditionalStyles&lt;T&gt;[]'),
    default: '-',
    description: `Apply styles or class names to rows when a predicate matches.`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'striped',
    type: c('boolean'),
    default: c('false'),
    description: `Alternate row background colors.`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'highlightOnHover',
    type: c('boolean'),
    default: c('false'),
    description: `Highlight rows on mouse-over.`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'pointerOnHover',
    type: c('boolean'),
    default: c('false'),
    description: `Show a pointer cursor on row hover.`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'columnSeparator',
    type: `${c('boolean')} | ${c('"subtle"')} | ${c('"full"')}`,
    default: '-',
    description: `Vertical lines between body columns. ${c('true')}/${c('"subtle"')} = inset 60%-height line, ${c('"full"')} = full-height line.`,
    brief: 'Body column separators (headers always shown).',
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'headerSeparator',
    type: `${c('boolean')} | ${c('"subtle"')} | ${c('"full"')}`,
    default: c('true'),
    description: `Vertical lines between header cells. ${c('true')}/${c('"subtle"')} = inset line (default), ${c('"full"')} = full-height, ${c('false')} = none.`,
    group: 'Theming & styling',
    features: ['theming'],
  },
  {
    name: 'animateRows',
    type: c('boolean'),
    default: c('false'),
    description: `Staggered entrance and sort animations. Respects ${c('prefers-reduced-motion')}.`,
    brief: 'Staggered row entrance + sort animation.',
    group: 'Theming & styling',
    features: ['theming', 'expandable'],
  },

  // ── Sorting ──────────────────────────────────────────────────────────────
  {
    name: 'defaultSortFieldId',
    type: `${c('string')} | ${c('number')}`,
    default: '-',
    description: `Column ${c('id')} to sort by on initial render.`,
    brief: `Column ${c('id')} to sort by on first render.`,
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'defaultSortAsc',
    type: c('boolean'),
    default: c('true'),
    description: `Initial sort direction.`,
    brief: `Initial sort direction. ${c('false')} = descending.`,
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'sortServer',
    type: c('boolean'),
    default: c('false'),
    description: `Disable client-side sorting; fire ${c('onSort')} and let the server sort.`,
    brief: `Disable client-side sorting. Use with ${c('onSort')} to sort remotely.`,
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'sortMulti',
    type: c('boolean'),
    default: c('false'),
    description: `Enable multi-column sorting via Ctrl/⌘-click. Clicking still cycles asc → desc → off per column.`,
    brief: 'Enable multi-column sorting. Ctrl/⌘-click a header to add it to the existing sort.',
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'sortFunction',
    type: `${c('SortFunction&lt;T&gt;')} | ${c('null')}`,
    default: '-',
    description: `Global custom sort function applied to all sortable columns.`,
    brief: 'Table-level sort algorithm. Replaces the default sort for all columns.',
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'sortIcon',
    type: c('ReactNode'),
    default: 'built-in chevron',
    description: `Custom sort direction indicator.`,
    brief: 'Custom icon rendered inside sortable column headers.',
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'onSort',
    type: c('(column, direction, sortedRows, sortColumns) =&gt; void'),
    default: '-',
    description: `Called whenever the sort changes. ${c('sortColumns')} is the full sort config in priority order; an empty array means the sort was cleared.`,
    brief: `Called on every sort change with the primary column, its direction, the sorted rows, and the full ${c('sortColumns')} config in priority order. An empty ${c('sortColumns')} array means the sort was cleared.`,
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'column.sortable',
    on: 'column',
    type: c('boolean'),
    default: c('false'),
    description: `Enable sorting on this column.`,
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'column.sortFunction',
    on: 'column',
    type: c('(a, b) =&gt; number'),
    default: '-',
    description: `Per-column sort comparator. Takes priority over the table-level ${c('sortFunction')}.`,
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'column.sortField',
    on: 'column',
    type: c('string'),
    default: '-',
    description: `Backend field name passed to ${c('onSort')} when it differs from ${c('column.id')}.`,
    group: 'Sorting',
    features: ['sorting'],
  },
  {
    name: 'ref.clearSort()',
    on: 'ref',
    type: c('DataTableHandle'),
    default: '-',
    description: `Imperatively reset sort to the default state. See <a href="#datatablehandle-ref">DataTableHandle</a>.`,
    brief: `Imperatively reset sort to the default (${c('defaultSortFieldId')} / ${c('defaultSortAsc')}), or unsorted if no defaults are set. See <a href="/docs/api#datatablehandle-ref">DataTableHandle</a>.`,
    group: 'Sorting',
    features: ['sorting'],
  },

  // ── Pagination ───────────────────────────────────────────────────────────
  {
    name: 'pagination',
    type: c('boolean'),
    default: c('false'),
    description: `Enable built-in pagination controls.`,
    brief: 'Enable built-in pagination',
    group: 'Pagination',
    features: ['pagination', 'core'],
  },
  {
    name: 'paginationPerPage',
    type: c('number'),
    default: c('10'),
    description: `Rows shown per page.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationPosition',
    type: `${c("'top'")} | ${c("'bottom'")} | ${c("'both'")}`,
    default: c("'bottom'"),
    description: `Where the pagination bar renders. ${c("'both'")} shows it above and below the table simultaneously.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationRowsPerPageOptions',
    type: c('number[]'),
    default: c('[10,15,20,25,30]'),
    description: `Options in the rows-per-page dropdown.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationDefaultPage',
    type: c('number'),
    default: c('1'),
    description: `Initial active page.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationPage',
    type: c('number'),
    default: '-',
    description: `Controlled active page. When provided, the table navigates to this page whenever the value changes. Use together with ${c('onChangePage')} to keep them in sync.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationResetDefaultPage',
    type: c('boolean'),
    default: c('false'),
    description: `Toggle to reset to page 1 (e.g. after a filter change). Prefer ${c('paginationPage')} for new code.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationTotalRows',
    type: c('number'),
    default: '-',
    description: `Total row count for server-side pagination.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationServer',
    type: c('boolean'),
    default: c('false'),
    description: `Delegate page changes to ${c('onChangePage')} / ${c('onChangeRowsPerPage')}.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationServerOptions',
    type: c('PaginationServerOptions'),
    default: '-',
    description: `Selection-persistence options for server-side mode.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationComponentOptions',
    type: c('PaginationOptions'),
    default: '-',
    description: `Localisation and display options for the built-in paginator.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationComponent',
    type: c('React.ComponentType'),
    default: '-',
    description: `Replace the built-in pagination UI entirely.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'paginationIcons',
    type: c('PaginationIcons'),
    default: '-',
    description: `Override any or all pagination icons. Pass a partial object: ${c('{ next: &lt;MyIcon /&gt; }')}.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'onChangePage',
    type: c('(page, totalRows) =&gt; void'),
    default: '-',
    description: `Called when the active page changes.`,
    group: 'Pagination',
    features: ['pagination'],
  },
  {
    name: 'onChangeRowsPerPage',
    type: c('(rowsPerPage, page) =&gt; void'),
    default: '-',
    description: `Called when rows-per-page selection changes.`,
    group: 'Pagination',
    features: ['pagination'],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  {
    name: 'footerComponent',
    type: c('ComponentType&lt;FooterComponentProps&lt;T&gt;&gt;'),
    default: '-',
    description: `Replace the footer row with a custom component. Receives ${c('{ rows, columns }')}. Takes precedence over column-level ${c('footer')} fields.`,
    group: 'Footer',
    features: ['footer'],
  },
  {
    name: 'showFooter',
    type: c('boolean'),
    default: '-',
    description: `Force the footer row on or off. By default the footer renders when ${c('footerComponent')} is set or any visible column declares a ${c('footer')}. Set to ${c('false')} to suppress, ${c('true')} to render an empty footer row.`,
    group: 'Footer',
    features: ['footer'],
  },

  // ── Row selection ────────────────────────────────────────────────────────
  {
    name: 'selectableRows',
    type: c('boolean'),
    default: c('false'),
    description: `Show a checkbox column for row selection.`,
    brief: 'Enable row checkboxes',
    group: 'Row selection',
    features: ['selection', 'core'],
  },
  {
    name: 'selectableRowsSingle',
    type: c('boolean'),
    default: c('false'),
    description: `Allow only one row to be selected at a time.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowsNoSelectAll',
    type: c('boolean'),
    default: c('false'),
    description: `Hide the "select all" checkbox in the header.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowsVisibleOnly',
    type: c('boolean'),
    default: c('false'),
    description: `"Select all" only selects rows on the current page.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowsHighlight',
    type: c('boolean'),
    default: c('false'),
    description: `Highlight selected rows using the theme's selected color.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowsRange',
    type: c('boolean'),
    default: c('true'),
    description: `Enable Shift-click range selection. Disabled automatically in single-select mode.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowDisabled',
    type: c('(row: T) =&gt; boolean'),
    default: '-',
    description: `Disable selection for a specific row.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowSelected',
    type: c('(row: T) =&gt; boolean'),
    default: '-',
    description: `Pre-select rows that satisfy the predicate.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectedRows',
    type: c('T[]'),
    default: '-',
    description: `Controlled selection. When supplied, drives selection state from the outside; matched against ${c('keyField')}.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowsComponent',
    type: `${c('"input"')} | ${c('ReactNode')}`,
    default: 'built-in checkbox',
    description: `Custom checkbox component.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'selectableRowsComponentProps',
    type: c('object'),
    default: '-',
    description: `Extra props forwarded to the custom checkbox component. Function values are called with the checkbox's indeterminate state and their return value is passed instead.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'onSelectedRowsChange',
    type: c('(state) =&gt; void'),
    default: '-',
    description: `Called whenever selection changes. Receives ${c('{ allSelected, selectedCount, selectedRows }')}.`,
    group: 'Row selection',
    features: ['selection'],
  },
  {
    name: 'clearSelectedRows',
    type: c('boolean'),
    default: '-',
    description: `<strong>Deprecated.</strong> Toggle to clear selection. Use ${c('ref.current.clearSelectedRows()')} instead.`,
    group: 'Row selection',
    features: ['selection'],
    deprecated: true,
  },
  {
    name: 'ref.clearSelectedRows()',
    on: 'ref',
    type: c('DataTableHandle'),
    default: '-',
    description: `Imperatively deselect all selected rows. See <a href="#datatablehandle-ref">DataTableHandle</a>.`,
    group: 'Row selection',
    features: ['selection'],
  },

  // ── Expandable rows ──────────────────────────────────────────────────────
  {
    name: 'expandableRows',
    type: c('boolean'),
    default: c('false'),
    description: `Enable the expandable row feature.`,
    brief: 'Enable expandable row panels',
    group: 'Expandable rows',
    features: ['expandable', 'core'],
  },
  {
    name: 'expandableRowsComponent',
    type: c('React.ComponentType'),
    default: '-',
    description: `Component rendered in the expanded panel. Receives ${c('{ data: T }')}.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandableRowsComponentProps',
    type: c('object'),
    default: '-',
    description: `Extra props merged into ${c('expandableRowsComponent')}.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandableRowExpanded',
    type: c('(row: T) =&gt; boolean'),
    default: '-',
    description: `Control which rows start expanded.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandableRowDisabled',
    type: c('(row: T) =&gt; boolean'),
    default: '-',
    description: `Prevent specific rows from being expanded.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandableRowsHideExpander',
    type: c('boolean'),
    default: c('false'),
    description: `Hide the expander chevron column (use with ${c('expandOnRowClicked')}).`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandOnRowClicked',
    type: c('boolean'),
    default: c('false'),
    description: `Toggle expansion by clicking anywhere on the row.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandOnRowDoubleClicked',
    type: c('boolean'),
    default: c('false'),
    description: `Toggle expansion by double-clicking anywhere on the row.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandableInheritConditionalStyles',
    type: c('boolean'),
    default: c('false'),
    description: `Apply the parent row's conditional styles to the expanded panel.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'expandableIcon',
    type: c('{ collapsed, expanded }'),
    default: 'built-in chevron',
    description: `Custom expand/collapse icons.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },
  {
    name: 'onRowExpandToggled',
    type: c('(expanded, row) =&gt; void'),
    default: '-',
    description: `Called when a row is expanded or collapsed.`,
    group: 'Expandable rows',
    features: ['expandable'],
  },

  // ── Row events ───────────────────────────────────────────────────────────
  {
    name: 'onRowClicked',
    type: c('(row, event) =&gt; void'),
    description: `Called when a row is left-clicked.`,
    group: 'Row events',
    features: ['row-events'],
  },
  {
    name: 'onRowDoubleClicked',
    type: c('(row, event) =&gt; void'),
    description: `Called when a row is double-clicked.`,
    group: 'Row events',
    features: ['row-events'],
  },
  {
    name: 'onRowMiddleClicked',
    type: c('(row, event) =&gt; void'),
    description: `Called when a row is middle-clicked (scroll-click). Use with ${c('onRowClicked')} to implement open-in-new-tab behaviour.`,
    group: 'Row events',
    features: ['row-events'],
  },
  {
    name: 'onRowMouseEnter',
    type: c('(row, event) =&gt; void'),
    description: `Called when the pointer enters a row.`,
    group: 'Row events',
    features: ['row-events'],
  },
  {
    name: 'onRowMouseLeave',
    type: c('(row, event) =&gt; void'),
    description: `Called when the pointer leaves a row.`,
    group: 'Row events',
    features: ['row-events'],
  },

  // ── Keyboard navigation ──────────────────────────────────────────────────
  {
    name: 'cellNavigation',
    type: c('boolean'),
    default: c('false'),
    description: `Spreadsheet-style keyboard navigation using the WAI-ARIA grid pattern (${c('role="grid"')}, single Tab stop, roving tabindex). Arrow keys move between cells, including header, selection, and expander cells; ${c('Home')}/${c('End')} and ${c('Ctrl+Home')}/${c('Ctrl+End')} jump to row and grid edges; ${c('Enter')}/${c('F2')} open a cell editor; ${c('Enter')}/${c('Space')} sort from a header. See <a href="/docs/keyboard-navigation">Keyboard navigation</a>.`,
    brief: `Enable spreadsheet-style keyboard navigation (WAI-ARIA grid pattern: ${c("role='grid'")}, single Tab stop, roving tabindex). Defaults to ${c('false')}.`,
    group: 'Keyboard navigation',
    features: ['keyboard'],
  },

  // ── Column features ──────────────────────────────────────────────────────
  {
    name: 'resizable',
    type: c('boolean'),
    default: c('false'),
    description: `Show drag handles on column headers for resizing.`,
    brief: 'Show drag handles on column headers for resizing.',
    group: 'Column features',
    features: ['resizable'],
  },
  {
    name: 'initialColumnWidths',
    type: c('Record&lt;string | number, number&gt;'),
    default: '-',
    description: `Seed column widths (px) by column ${c('id')}, useful for hydrating persisted widths on mount. See <a href="/docs/recipes/persist-column-widths">Persist column widths</a>.`,
    brief: `Seed column widths (px) by column ${c('id')} on mount.`,
    group: 'Column features',
    features: ['resizable'],
  },
  {
    name: 'onColumnResize',
    type: c('(columnId, width, allWidths) =&gt; void'),
    default: '-',
    description: `Called after the user finishes resizing a column. Receives the column ${c('id')}, its final width (px), and the full widths map for persisting.`,
    brief: 'Called with the column id, final width (px), and full widths map after a resize.',
    group: 'Column features',
    features: ['resizable'],
  },
  {
    name: 'columnGroups',
    type: c('ColumnGroup[]'),
    default: '-',
    description: `Spanning group headers rendered above the column header row.`,
    group: 'Column features',
    features: ['column-groups'],
  },
  {
    name: 'filterValues',
    type: c('Record&lt;string | number, FilterState&gt;'),
    default: '-',
    description: `Controlled filter state. Omit to use internal state. See <a href="/docs/filtering">Filtering</a>.`,
    group: 'Column features',
    features: ['filtering'],
  },
  {
    name: 'onFilterChange',
    type: c('(columnId, filter: FilterState) =&gt; void'),
    default: '-',
    description: `Called when the user clicks Apply or Clear in a filter popup.`,
    group: 'Column features',
    features: ['filtering'],
  },
  {
    name: 'onColumnOrderChange',
    type: c('(columns: TableColumn&lt;T&gt;[]) =&gt; void'),
    default: '-',
    description: `Called after a drag-to-reorder column operation with the new column order.`,
    group: 'Column features',
    features: ['column-reorder'],
  },
  {
    name: 'onColumnGroupOrderChange',
    type: c('(groups: ColumnGroup[], columns: TableColumn&lt;T&gt;[]) =&gt; void'),
    default: '-',
    description: `Called after a group drag-reorder with the new group order and the matching updated column order.`,
    group: 'Column features',
    features: ['column-reorder', 'column-groups'],
  },
  {
    name: 'column.pinned',
    on: 'column',
    type: `${c("'left'")} | ${c("'right'")}`,
    default: '-',
    description: `Freeze the column to an edge during horizontal scroll. Only visible when the table overflows its container — give columns explicit widths. See <a href="/docs/column-pinning">Column pinning</a>.`,
    brief: `Freeze the column to an edge during horizontal scroll. Only visible when the table overflows its container — give columns explicit widths.`,
    group: 'Column features',
    features: ['column-pinning'],
  },

  // ── Context menu ─────────────────────────────────────────────────────────
  {
    name: 'contextMenu',
    type: `${c("boolean | { header?: boolean; row?: boolean; trigger?: 'right-click' | 'menu-button' | 'both'; menuPosition?: 'start' | 'end' }")}`,
    default: '-',
    description: `Enable the context menu. ${c('true')} enables header and row menus with the right-click trigger. The header menu has built-in sort/pin/hide/reset actions; the row menu only opens when ${c('contextMenuActions.row')} returns items. ${c('menuPosition')} sets which inline edge the row menu button sits on (default ${c("'end'")} — right in LTR). See <a href="/docs/context-menu">Context menu</a>.`,
    brief: `Enable the context menu. ${c('true')} enables header and row menus with the right-click trigger. The header menu has built-in sort/pin/hide/reset actions; the row menu only opens when ${c('contextMenuActions.row')} returns items.`,
    group: 'Context menu',
    features: ['context-menu'],
  },
  {
    name: 'contextMenuActions',
    type: c('{ header?: ContextMenuAction[] | (column) =&gt; ContextMenuAction[]; row?: (row, rowIndex) =&gt; ContextMenuAction[] }'),
    default: '-',
    description: `Custom menu items. Header items are appended after the built-ins; row items are the entire row menu.`,
    group: 'Context menu',
    features: ['context-menu'],
  },
  {
    name: 'onContextMenuAction',
    type: c('(action: ContextMenuAction, ctx: ContextMenuActionContext&lt;T&gt;) =&gt; void'),
    default: '-',
    description: `Called for every selected item, built-ins included (after their effect is applied). ${c('ctx')} is ${c("{ type: 'header', column }")} or ${c("{ type: 'row', row, rowIndex }")}.`,
    group: 'Context menu',
    features: ['context-menu'],
  },

  // ── Localization ─────────────────────────────────────────────────────────
  {
    name: 'localization',
    type: c('Localization'),
    default: '-',
    description: `Override every user-visible string and aria-label in the table. Pass a pre-built locale or build your own. See <a href="/docs/localization">Localization</a>.`,
    brief: `Override every user-visible string and aria-label in the table. Pass a pre-built locale or build your own.`,
    group: 'Localization',
    features: ['localization', 'expandable', 'pagination'],
  },
  {
    name: 'columnFilterOptions',
    type: c('ColumnFilterOptions'),
    default: '-',
    description: `<strong>Deprecated.</strong> Use ${c('localization={{ filter: { ... } }}')} instead. Will be removed in v9.`,
    group: 'Localization',
    features: ['localization'],
    deprecated: true,
  },
  {
    name: 'expandableRowsOptions',
    type: c('ExpandableRowsOptions'),
    default: '-',
    description: `<strong>Deprecated.</strong> Use ${c('localization={{ expandable: { ... } }}')} instead. Will be removed in v9.`,
    group: 'Localization',
    features: ['localization'],
    deprecated: true,
  },
];

export const propGroupOrder: PropGroup[] = [
  'Data',
  'Layout & appearance',
  'Theming & styling',
  'Sorting',
  'Pagination',
  'Footer',
  'Row selection',
  'Expandable rows',
  'Row events',
  'Keyboard navigation',
  'Column features',
  'Context menu',
  'Localization',
];
