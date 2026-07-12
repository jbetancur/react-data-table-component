---
layout: '../../layouts/DocsLayout.astro'
title: 'API reference | react-data-table-component'
description: 'Complete prop, type, and export reference for react-data-table-component v8.'
---

# API reference

Complete reference for every prop, type, and export in `react-data-table-component` v8.

> **Looking for examples or recipes?** This page is the flat reference for "what does prop X do?". Each feature has its own page with examples. Start there if you're new:
>
> - [Columns](/docs/columns) · [Cell rendering](/docs/cells) · [Inline editing](/docs/inline-editing)
> - [Sorting](/docs/sorting) · [Pagination](/docs/pagination) · [Filtering](/docs/filtering)
> - [Selection](/docs/selection) · [Expandable rows](/docs/expandable)
> - [Resizable](/docs/resizable) · [Pinning](/docs/column-pinning) · [Groups](/docs/column-groups)
> - [Themes](/docs/themes) · [Custom styles](/docs/custom-styles) · [Performance](/docs/performance)
> - [TypeScript](/docs/typescript) · [Headless hooks](/docs/headless)

## DataTable props

`DataTable<T>` accepts the following props where `T` is the row data type. Only `columns` and `data` are required.

### Data

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `T[]` | - | **Required.** Array of row objects. |
| `columns` | `TableColumn<T>[]` | - | **Required.** Column definitions. |
| `keyField` | `string` | `"id"` | Property on each row used as a stable React key. |
| `progressPending` | `boolean` | `false` | Show a loading state. On initial load (no data yet) renders shimmer skeleton rows. On re-fetch (data already loaded) dims the existing rows and overlays a centered spinner. The column header always stays visible. |
| `progressComponent` | `ReactNode` | built-in spinner | Custom loading indicator. |
| `noDataComponent` | `ReactNode` | built-in message | Rendered when `data` is empty. |

### Layout & appearance

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string \| ReactNode` | - | Table title shown in the header bar. |
| `actions` | `ReactNode \| ReactNode[]` | - | Content rendered on the right side of the header bar. |
| `subHeader` | `ReactNode` | - | Content for the sub-header bar. Providing any value shows the bar. |
| `subHeaderAlign` | `Alignment` | `"right"` | Alignment of sub-header content. |
| `subHeaderWrap` | `boolean` | `true` | Allow sub-header to wrap onto multiple lines. |
| `noHeader` | `boolean` | `false` | Force-hide the title/actions header bar. The bar otherwise renders only when a `title` or `actions` is provided, so you rarely need this. |
| `noTableHead` | `boolean` | `false` | Hide the column header row. |
| `persistTableHead` | `boolean` | `false` | Show the column header even when data is empty. The header always stays visible during `progressPending` regardless of this prop. |
| `dense` | `boolean` | `false` | Reduce row height for a compact look. |
| `responsive` | `boolean` | `true` | Wrap the table in a horizontally scrollable container. Disable only when a parent element owns scrolling, see [Turning the scroll container off](/docs/fixed-header#responsive-false). |
| `fixedHeader` | `boolean` | `false` | Stick the column header at the top when scrolling. |
| `fixedHeaderScrollHeight` | `string` | `"100vh"` | Max height of the scrollable body when `fixedHeader` is on. |
| `onScroll` | `(event) => void` | - | Called when the user scrolls the table body. Works with both `fixedHeader` enabled and disabled. |
| `direction` | `Direction` | `"ltr"` | Text direction (`ltr`, `rtl`, `auto`). |
| `className` | `string` | - | Extra CSS class on the root element. |
| `style` | `CSSProperties` | - | Inline styles on the root element. |
| `ariaLabel` | `string` | - | Value for the table's `aria-label`. |
| `disabled` | `boolean` | `false` | Disable all interactive controls. |

### Theming & styling

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | `"default"` | Named theme registered with `createTheme()`. |
| `customStyles` | `TableStyles` | - | Fine-grained style overrides. See [TableStyles](#tablestyles). |
| `conditionalRowStyles` | `ConditionalStyles<T>[]` | - | Apply styles or class names to rows when a predicate matches. |
| `striped` | `boolean` | `false` | Alternate row background colors. |
| `highlightOnHover` | `boolean` | `false` | Highlight rows on mouse-over. |
| `pointerOnHover` | `boolean` | `false` | Show a pointer cursor on row hover. |
| `columnSeparator` | `boolean \| "subtle" \| "full"` | - | Vertical lines between body columns. `true`/`"subtle"` = inset 60%-height line, `"full"` = full-height line. |
| `headerSeparator` | `boolean \| "subtle" \| "full"` | `true` | Vertical lines between header cells. `true`/`"subtle"` = inset line (default), `"full"` = full-height, `false` = none. |
| `animateRows` | `boolean` | `false` | Staggered entrance and sort animations. Respects `prefers-reduced-motion`. |

### Sorting

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultSortFieldId` | `string \| number` | - | Column `id` to sort by on initial render. |
| `defaultSortAsc` | `boolean` | `true` | Initial sort direction. |
| `sortServer` | `boolean` | `false` | Disable client-side sorting; fire `onSort` and let the server sort. |
| `sortMulti` | `boolean` | `false` | Enable multi-column sorting via Ctrl/⌘-click. Clicking still cycles asc → desc → off per column. |
| `sortFunction` | `SortFunction<T> \| null` | - | Global custom sort function applied to all sortable columns. |
| `sortIcon` | `ReactNode` | built-in chevron | Custom sort direction indicator. |
| `onSort` | `(column, direction, sortedRows, sortColumns) => void` | - | Called whenever the sort changes. `sortColumns` is the full sort config in priority order; an empty array means the sort was cleared. |
| `ref.clearSort()` | `DataTableHandle` | - | Imperatively reset sort to the default state. See [DataTableHandle](#datatablehandle-ref). |

### Pagination

| Prop | Type | Default | Description |
|---|---|---|---|
| `pagination` | `boolean` | `false` | Enable built-in pagination controls. |
| `paginationPerPage` | `number` | `10` | Rows shown per page. |
| `paginationPosition` | `'top' \| 'bottom' \| 'both'` | `'bottom'` | Where the pagination bar renders. `'both'` shows it above and below the table simultaneously. |
| `paginationRowsPerPageOptions` | `number[]` | `[10,15,20,25,30]` | Options in the rows-per-page dropdown. |
| `paginationDefaultPage` | `number` | `1` | Initial active page. |
| `paginationPage` | `number` | - | Controlled active page. When provided, the table navigates to this page whenever the value changes. Use together with `onChangePage` to keep them in sync. |
| `paginationResetDefaultPage` | `boolean` | `false` | Toggle to reset to page 1 (e.g. after a filter change). Prefer `paginationPage` for new code. |
| `paginationTotalRows` | `number` | - | Total row count for server-side pagination. |
| `paginationServer` | `boolean` | `false` | Delegate page changes to `onChangePage` / `onChangeRowsPerPage`. |
| `paginationServerOptions` | `PaginationServerOptions` | - | Selection-persistence options for server-side mode. |
| `paginationComponentOptions` | `PaginationOptions` | - | Localisation and display options for the built-in paginator. |
| `paginationComponent` | `React.ComponentType` | - | Replace the built-in pagination UI entirely. |
| `paginationIcons` | `PaginationIcons` | - | Override any or all pagination icons. Pass a partial object: `{ next: <MyIcon /> }`. |
| `onChangePage` | `(page, totalRows) => void` | - | Called when the active page changes. |
| `onChangeRowsPerPage` | `(rowsPerPage, page) => void` | - | Called when rows-per-page selection changes. |

### Footer

| Prop | Type | Default | Description |
|---|---|---|---|
| `footerComponent` | `ComponentType<FooterComponentProps<T>>` | - | Replace the footer row with a custom component. Receives `{ rows, columns }`. Takes precedence over column-level `footer` fields. |
| `showFooter` | `boolean` | - | Force the footer row on or off. By default the footer renders when `footerComponent` is set or any visible column declares a `footer`. Set to `false` to suppress, `true` to render an empty footer row. |

Column-level footers live on each [`TableColumn<T>`](#tablecolumnt) as the `footer` field. See [Footer](/docs/footer) for the full walkthrough.

### Row selection

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectableRows` | `boolean` | `false` | Show a checkbox column for row selection. |
| `selectableRowsSingle` | `boolean` | `false` | Allow only one row to be selected at a time. |
| `selectableRowsNoSelectAll` | `boolean` | `false` | Hide the "select all" checkbox in the header. |
| `selectableRowsVisibleOnly` | `boolean` | `false` | "Select all" only selects rows on the current page. |
| `selectableRowsHighlight` | `boolean` | `false` | Highlight selected rows using the theme's selected color. |
| `selectableRowsRange` | `boolean` | `true` | Enable Shift-click range selection. Disabled automatically in single-select mode. |
| `selectableRowDisabled` | `(row: T) => boolean` | - | Disable selection for a specific row. |
| `selectableRowSelected` | `(row: T) => boolean` | - | Pre-select rows that satisfy the predicate. |
| `selectedRows` | `T[]` | - | Controlled selection. When supplied, drives selection state from the outside; matched against `keyField`. |
| `selectableRowsComponent` | `"input" \| ReactNode` | built-in checkbox | Custom checkbox component. |
| `selectableRowsComponentProps` | `object` | - | Extra props forwarded to the custom checkbox component. Function values are called with the checkbox's indeterminate state and their return value is passed instead. |
| `onSelectedRowsChange` | `(state) => void` | - | Called whenever selection changes. Receives `{ allSelected, selectedCount, selectedRows }`. |
| `clearSelectedRows` | `boolean` | - | **Deprecated.** Toggle to clear selection. Use `ref.current.clearSelectedRows()` instead. |
| `ref.clearSelectedRows()` | `DataTableHandle` | - | Imperatively deselect all selected rows. See [DataTableHandle](#datatablehandle-ref). |

### Expandable rows

| Prop | Type | Default | Description |
|---|---|---|---|
| `expandableRows` | `boolean` | `false` | Enable the expandable row feature. |
| `expandableRowsComponent` | `React.ComponentType` | - | Component rendered in the expanded panel. Receives `{ data: T }`. |
| `expandableRowsComponentProps` | `object` | - | Extra props merged into `expandableRowsComponent`. |
| `expandableRowExpanded` | `(row: T) => boolean` | - | Control which rows start expanded. |
| `expandableRowDisabled` | `(row: T) => boolean` | - | Prevent specific rows from being expanded. |
| `expandableRowsHideExpander` | `boolean` | `false` | Hide the expander chevron column (use with `expandOnRowClicked`). |
| `expandOnRowClicked` | `boolean` | `false` | Toggle expansion by clicking anywhere on the row. |
| `expandOnRowDoubleClicked` | `boolean` | `false` | Toggle expansion by double-clicking anywhere on the row. |
| `expandableInheritConditionalStyles` | `boolean` | `false` | Apply the parent row's conditional styles to the expanded panel. |
| `expandableIcon` | `{ collapsed, expanded }` | built-in chevron | Custom expand/collapse icons. |
| `onRowExpandToggled` | `(expanded, row) => void` | - | Called when a row is expanded or collapsed. |

### Row events

| Prop | Type | Description |
|---|---|---|
| `onRowClicked` | `(row, event) => void` | Called when a row is left-clicked. |
| `onRowDoubleClicked` | `(row, event) => void` | Called when a row is double-clicked. |
| `onRowMiddleClicked` | `(row, event) => void` | Called when a row is middle-clicked (scroll-click). Use with `onRowClicked` to implement open-in-new-tab behaviour. |
| `onRowMouseEnter` | `(row, event) => void` | Called when the pointer enters a row. |
| `onRowMouseLeave` | `(row, event) => void` | Called when the pointer leaves a row. |

### Keyboard navigation

| Prop | Type | Default | Description |
|---|---|---|---|
| `cellNavigation` | `boolean` | `false` | Spreadsheet-style keyboard navigation using the WAI-ARIA grid pattern (`role="grid"`, single Tab stop, roving tabindex). Arrow keys move between cells, including header, selection, and expander cells; `Home`/`End` and `Ctrl+Home`/`Ctrl+End` jump to row and grid edges; `Enter`/`F2` open a cell editor; `Enter`/`Space` sort from a header. See [Keyboard navigation](/docs/keyboard-navigation). |

### Column features

| Prop | Type | Default | Description |
|---|---|---|---|
| `resizable` | `boolean` | `false` | Show drag handles on column headers for resizing. |
| `columnGroups` | `ColumnGroup[]` | - | Spanning group headers rendered above the column header row. |
| `filterValues` | `Record<string \| number, FilterState>` | - | Controlled filter state. Omit to use internal state. See [Filtering](/docs/filtering). |
| `onFilterChange` | `(columnId, filter: FilterState) => void` | - | Called when the user clicks Apply or Clear in a filter popup. |
| `onColumnOrderChange` | `(columns: TableColumn<T>[]) => void` | - | Called after a drag-to-reorder column operation with the new column order. |
| `onColumnGroupOrderChange` | `(groups: ColumnGroup[], columns: TableColumn<T>[]) => void` | - | Called after a group drag-reorder with the new group order and the matching updated column order. |

### Context menu

| Prop | Type | Default | Description |
|---|---|---|---|
| `contextMenu` | `boolean \| { header?: boolean; row?: boolean; trigger?: 'right-click' \| 'menu-button' \| 'both'; menuPosition?: 'start' \| 'end' }` | - | Enable the context menu. `true` enables header and row menus with the right-click trigger. The header menu has built-in sort/pin/hide/reset actions; the row menu only opens when `contextMenuActions.row` returns items. `menuPosition` sets which inline edge the row menu button sits on (default `'end'` — right in LTR). See [Context menu](/docs/context-menu). |
| `contextMenuActions` | `{ header?: ContextMenuAction[] \| (column) => ContextMenuAction[]; row?: (row, rowIndex) => ContextMenuAction[] }` | - | Custom menu items. Header items are appended after the built-ins; row items are the entire row menu. |
| `onContextMenuAction` | `(action: ContextMenuAction, ctx: ContextMenuActionContext<T>) => void` | - | Called for every selected item, built-ins included (after their effect is applied). `ctx` is `{ type: 'header', column }` or `{ type: 'row', row, rowIndex }`. |

### Localization

| Prop | Type | Default | Description |
|---|---|---|---|
| `localization` | `Localization` | - | Override every user-visible string and aria-label in the table. Pass a pre-built locale or build your own. See [Localization](/docs/localization). |
| ~~`columnFilterOptions`~~ | `ColumnFilterOptions` | - | **Deprecated.** Use `localization={{ filter: { ... } }}` instead. Will be removed in v9. |
| ~~`expandableRowsOptions`~~ | `ExpandableRowsOptions` | - | **Deprecated.** Use `localization={{ expandable: { ... } }}` instead. Will be removed in v9. |

## ColumnGroup

Defines a spanning group header above one or more columns. Pass an array to the `columnGroups` prop.

```ts
import { type ColumnGroup } from 'react-data-table-component';

const columnGroups: ColumnGroup[] = [
  { name: 'Employee',     columnIds: ['first', 'last', 'dept'] },
  { name: 'Compensation', columnIds: ['base', 'bonus'], align: 'left' },
];
```

| Field | Type | Default | Description |
|---|---|---|---|
| `name` | `ReactNode` | - | **Required.** Group header label. Accepts JSX. |
| `columnIds` | `(string \| number)[]` | - | **Required.** Ids of columns under this group. Must match each column's `id` exactly. |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Horizontal alignment of the group label. |
| `reorder` | `boolean` | - | Allow drag-to-reorder for this group. Dragging moves all member columns as a block. Fires `onColumnGroupOrderChange`. |

Columns not listed in any group span the full group-row height with no label.

## TableColumn\<T\>

```ts
import { type TableColumn } from 'react-data-table-component';

const columns: TableColumn<MyRow>[] = [
  {
    id: 'name',
    name: 'Full name',
    selector: row => row.name,
    sortable: true,
    width: '200px',
  },
];
```

| Prop | Type | Description |
|---|---|---|
| `id` | `string \| number` | Stable identity used by `defaultSortFieldId`, `columnGroups`, and `filterValues`. |
| `name` | `ReactNode` | Column header label. |
| `selector` | `(row, index?) => Primitive \| ReactNode` | Data accessor. For sortable columns return a `Primitive` (`string \| number \| boolean \| bigint \| Date`). Rows whose selector returns `null` or `undefined` sort to the end. `bigint` displays as its decimal string; `Date` displays via `toLocaleString()`, which follows the viewer's locale and timezone. Use `format` when you need deterministic or SSR-stable output. |
| `cell` | `(row, index, column, id) => ReactNode` | Custom cell renderer. Overrides the `selector` display value. |
| `format` | `(row, index) => ReactNode` | Format the selector value for display without changing the sort key. |
| `sortable` | `boolean` | Enable sorting on this column. |
| `sortFunction` | `(a: T, b: T) => number` | Custom comparator for this column. |
| `sortField` | `string` | Field key passed to `onSort` for server-side sort identification. |
| `filterable` | `boolean` | Show a filter popup for this column. |
| `filterType` | `"text" \| "number" \| "date"` | Filter operator set and input widget. Defaults to `"text"`. See [Filtering](/docs/filtering). |
| `filterFunction` | `(row, filter: FilterState) => boolean` | Custom filter predicate. Overrides built-in operator logic. Receives the full `FilterState` including both conditions. |
| `width` | `string` | Fixed column width, e.g. `"120px"`. |
| `minWidth` | `string` | Minimum width. |
| `maxWidth` | `string` | Maximum width. |
| `grow` | `number` | Flex-grow factor (default `1`). Set to `0` to prevent growing. |
| `right` | `boolean` | Right-align cell content. |
| `center` | `boolean` | Center cell content. |
| `wrap` | `boolean` | Allow cell text to wrap. |
| `compact` | `boolean` | Remove cell padding. |
| `button` | `boolean` | Center content and suppress row click propagation. |
| `allowOverflow` | `boolean` | Allow cell content to overflow (useful for dropdowns and popovers). |
| `ignoreRowClick` | `boolean` | Prevent clicks in this cell from firing `onRowClicked`. |
| `hide` | `Media \| number` | Hide the column below the given breakpoint (`Media.SM` = 599px, `MD` = 959px, `LG` = 1280px) or a custom pixel value. |
| `omit` | `boolean` | Exclude the column entirely. Toggle this to show/hide a column. |
| `reorder` | `boolean` | Allow drag-to-reorder for this column (requires `reorder` on at least two columns). |
| `pinned` | `'left' \| 'right'` | Freeze the column to an edge during horizontal scroll. Only visible when the table overflows its container — give columns explicit widths. See [Column pinning](/docs/column-pinning). |
| `style` | `CSSProperties` | Inline styles applied to every cell in this column. |
| `conditionalCellStyles` | `ConditionalStyles<T>[]` | Per-cell conditional styles. |
| `footer` | `ReactNode \| (rows: T[]) => ReactNode` | Footer cell for this column. Static node or a function receiving the filtered+sorted rows (typically used to render aggregates like sums or averages). When any visible column has a `footer`, a footer row renders below the body. See [Footer](/docs/footer). |

### Inline editing

| Prop | Type | Description |
|---|---|---|
| `editable` | `boolean` | Shorthand for `editor: { type: 'text' }`. Ignored when `editor` is also set. |
| `editor` | `CellEditor` | Editor configuration. See [CellEditor](#celleditor) below. Takes precedence over `editable`. |
| `validate` | `(value, row, column) => true \| false \| string` | Gate the edit before `onCellEdit` fires. Return `true` to accept, `false` to reject silently, or a string error to keep the editor open with an inline tooltip. |
| `onCellEdit` | `CellEditCallback<T>` | Called when the user commits an edit. Receives `(row: T, value: string, column: TableColumn<T>)`. The `value` is always a string; parse it to the target type in your handler. |

See [Inline editing](/docs/inline-editing) for examples, CSS variables, and styling guidance.

## CellEditor

```ts
import { type CellEditor } from 'react-data-table-component';

type CellEditor<T = unknown> =
  | { type: 'text'; placeholder?: string }
  | { type: 'number'; placeholder?: string; min?: number; max?: number; step?: number }
  | { type: 'date'; min?: string; max?: string }
  | { type: 'checkbox' }
  | {
      type: 'select';
      options: Array<{ value: string; label: React.ReactNode }>;
      placeholder?: string;
    }
  | {
      type: 'custom';
      render: (ctx: CustomCellEditorContext<T>) => React.ReactNode;
    };

interface CustomCellEditorContext<T> {
  row: T;
  value: string;
  setValue: (next: string) => void;
  commit: (value?: string) => void;
  cancel: () => void;
  column: TableColumn<T>;
}
```

| Variant | Field | Type | Description |
| --- | --- | --- | --- |
| All | `type` | `"text" \| "number" \| "date" \| "checkbox" \| "select" \| "custom"` | Editor widget to render. |
| `text` / `number` / `select` | `placeholder` | `string` | Placeholder text. For `select`, shown as a disabled hidden option when the current value is empty. |
| `number` | `min` / `max` / `step` | `number` | Forwarded to the native `<input type="number">`. |
| `date` | `min` / `max` | `string` | Forwarded to the native `<input type="date">` as ISO dates. |
| `select` | `options` | `{ value: string; label: ReactNode }[]` | Dropdown options. The `value` is what gets committed; `label` is displayed (must be string or number inside native `<option>`). |
| `custom` | `render` | `(ctx) => ReactNode` | Render any editor. Call `ctx.commit(value)` to save, `ctx.cancel()` to discard. |

### Inline editing CSS classes

| Class | Applied to | Purpose |
|---|---|---|
| `rdt_cellEditable` | Cell container | Added on every cell that has an editor defined (idle state). |
| `rdt_cellEditing` | Cell container | Added while the editor is open. Removes padding and paints the focus ring. |
| `rdt_editInput` | `<input>` | Text editor control inside an editing cell. |
| `rdt_editSelect` | `<select>` | Dropdown editor control inside an editing cell. |

### Inline editing CSS variables

| Variable | Default | Purpose |
|---|---|---|
| `--rdt-color-cell-edit-bg` | 8% primary on bg | Background of the cell while editing. |
| `--rdt-color-cell-edit-hover` | 6% primary | Background of an editable cell on hover. |
| `--rdt-color-cell-edit-hover-border` | 40% primary | Dashed underline colour on editable cell hover. |

## ContextMenuAction

A single item in a context menu. Pass arrays of these via `contextMenuActions`; selections arrive in `onContextMenuAction`.

```ts
import { type ContextMenuAction } from 'react-data-table-component';

const rowActions = (row: MyRow): ContextMenuAction[] => [
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete', disabled: row.locked },
];
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Identifier passed to `onContextMenuAction`. The built-in header actions reserve `sort-asc`, `sort-desc`, `clear-sort`, `pin-left`, `pin-right`, `unpin`, `hide-column`, and `reset`. |
| `label` | `ReactNode` | Item content. |
| `disabled` | `boolean` | Render the item disabled. |
| `icon` | `ReactNode` | Optional icon rendered before the label. |

Related types: `ContextMenuConfig` (the object form of the `contextMenu` prop), `ContextMenuActions<T>` (the `contextMenuActions` prop shape), and `ContextMenuActionContext<T>` (the `ctx` argument of `onContextMenuAction`) are all exported. See [Context menu](/docs/context-menu).

## DataTableHandle (ref)

Attach a ref to `DataTable` to imperatively control it.

```tsx
import DataTable, { type DataTableHandle } from 'react-data-table-component';
import { useRef } from 'react';

function App() {
  const ref = useRef<DataTableHandle>(null);

  return (
    <>
      <button onClick={() => ref.current?.clearSelectedRows()}>Clear selection</button>
      <button onClick={() => ref.current?.clearSort()}>Reset sort</button>
      <DataTable ref={ref} columns={columns} data={data} selectableRows />
    </>
  );
}
```

| Method | Description |
|---|---|
| `clearSelectedRows()` | Deselect all currently selected rows. |
| `clearSort()` | Reset sort to the default (`defaultSortFieldId` / `defaultSortAsc`), or unsorted if no defaults are set. |

## TableStyles

Pass to `customStyles` to override styles for any part of `DataTable`. Each key accepts a `style` object (`React.CSSProperties`) and optional extra properties.

```tsx
import DataTable, { type TableStyles } from 'react-data-table-component';

const customStyles: TableStyles = {
  headRow: {
    style: {
      backgroundColor: '#f8fafc',
      borderBottomWidth: '2px',
    },
  },
  headCells: {
    style: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#374151',
    },
  },
  rows: {
    style: { minHeight: '56px' },
    highlightOnHoverStyle: {
      backgroundColor: '#f0f9ff',
      borderBottomColor: '#e0f2fe',
      outline: '1px solid #bae6fd',
    },
  },
};
```

| Key | Extra fields | Description |
|---|---|---|
| `table` | - | The outermost table element. |
| `tableWrapper` | - | Wrapper `<div>` around the table. |
| `responsiveWrapper` | - | Horizontal-scroll wrapper (only present when `responsive`). |
| `header` | `fontColor`, `fontSize` | Title / actions bar at the top. |
| `subHeader` | - | Sub-header bar. |
| `head` | - | The `<thead>` element. |
| `headRow` | `denseStyle` | Column header row. |
| `headCells` | `draggingStyle` | Individual header cells. |
| `cells` | `draggingStyle` | Body cells. |
| `rows` | `selectedHighlightStyle`, `denseStyle`, `highlightOnHoverStyle`, `stripedStyle` | Body rows. |
| `expanderRow` | - | The expanded content row. |
| `expanderCell` | - | Cell containing the expand/collapse button. |
| `expanderButton` | - | The expand/collapse button itself. |
| `pagination` | `pageButtonsStyle` | Pagination bar and page buttons. |
| `footer` | - | The footer row container. |
| `footerCells` | - | Individual footer cells. |
| `noData` | - | Empty-state container. |
| `progress` | - | Loading indicator container. |

## ConditionalStyles\<T\>

Used with `conditionalRowStyles` and `conditionalCellStyles` to apply styles or class names based on row data.

```tsx
const conditionalRowStyles = [
  {
    when: row => row.status === 'active',
    style: { backgroundColor: '#f0fdf4', color: '#166534' },
  },
  {
    when: row => row.salary > 100000,
    // style can also be a function:
    style: row => ({ fontWeight: row.salary > 150000 ? 700 : 400 }),
  },
  {
    when: row => row.flagged,
    classNames: ['flagged-row'],
  },
];
```

| Field | Type | Description |
|---|---|---|
| `when` | `(row: T) => boolean` | **Required.** Predicate that applies styles when this returns `true`. |
| `style` | `CSSProperties \| ((row: T) => CSSProperties)` | Inline styles to apply. |
| `classNames` | `string[]` | CSS class names to add. |

## createTheme()

Registers a custom named theme. Call this outside your component tree so it runs once.

```ts
import { createTheme } from 'react-data-table-component';

createTheme(
  'brand',       // name (pass to the theme prop)
  {
    text:             { primary: '#1a1a2e', secondary: '#4a4a6a', disabled: 'rgba(26,26,46,.38)' },
    background:       { default: '#f0f4ff' },
    divider:          { default: '#dde3f0' },
    button:           { default: '#6366f1', hover: '#4f46e5', focus: 'rgba(99,102,241,.25)', disabled: '#c7d2fe' },
    selected:         { default: '#ede9fe', text: '#3730a3' },
    highlightOnHover: { default: '#e0e7ff', text: '#1a1a2e' },
    striped:          { default: '#f5f3ff', text: '#1a1a2e' },
  },
  'default',     // optional: inherit from this theme
);
```

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Theme name to reference in the `theme` prop. |
| `overrides` | `Partial<Theme>` | Token overrides. Only the keys you provide are changed. |
| `inherit` | `string` | Optional name of a built-in or previously registered theme to inherit from. |

The `Theme` interface token keys:

| Token | Fields |
|---|---|
| `text` | `primary`, `secondary`, `disabled` |
| `background` | `default` |
| `context` | `background`, `text` |
| `divider` | `default` |
| `button` | `default`, `hover`, `focus`, `disabled` |
| `selected` | `default`, `text` |
| `highlightOnHover` | `default`, `text` |
| `striped` | `default`, `text` |
| `colorScheme` | `"light" \| "dark"`. Sets native form control rendering. |

## Pagination types

### PaginationOptions

Passed to `paginationComponentOptions`.

| Field | Type | Default | Description |
|---|---|---|---|
| `rowsPerPageText` | `string` | `"Rows per page:"` | Label for the rows-per-page select. |
| `rangeSeparatorText` | `string` | `"of"` | Separator between current range and total, e.g. "1–10 of 50". |
| `noRowsPerPage` | `boolean` | `false` | Hide the rows-per-page selector. |
| `selectAllRowsItem` | `boolean` | `false` | Add an "All" option to the rows-per-page selector. |
| `selectAllRowsItemText` | `string` | `"All"` | Label for the "All" option. |

### PaginationServerOptions

Passed to `paginationServerOptions` when using server-side pagination.

| Field | Type | Default | Description |
|---|---|---|---|
| `persistSelectedOnPageChange` | `boolean` | `false` | Keep the current selection when the page changes. |
| `persistSelectedOnSort` | `boolean` | `false` | Keep the current selection when the sort column or direction changes. |

### PaginationComponentProps

The props your custom `paginationComponent` will receive.

| Field | Type | Description |
|---|---|---|
| `rowsPerPage` | `number` | Currently selected rows-per-page value. |
| `rowCount` | `number` | Total row count. |
| `currentPage` | `number` | Current active page (1-based). |
| `onChangePage` | `(page, totalRows) => void` | Call this to change page. |
| `onChangeRowsPerPage` | `(rowsPerPage, page) => void` | Call this to change rows-per-page. |

## Enums & constants

All enums and constants are re-exported from the package root.

```ts
import { Media, Direction, Alignment, SortOrder } from 'react-data-table-component';
```

| Enum | Values | Description |
|---|---|---|
| `Media` | `SM = "sm"` (≤ 599px), `MD = "md"` (≤ 959px), `LG = "lg"` (≤ 1280px) | Breakpoints for the column `hide` prop. |
| `Direction` | `LTR = "ltr"`, `RTL = "rtl"`, `AUTO = "auto"` | Text direction for the `direction` prop. |
| `Alignment` | `LEFT = "left"`, `RIGHT = "right"`, `CENTER = "center"` | Alignment for `subHeaderAlign`. |
| `SortOrder` | `ASC = "asc"`, `DESC = "desc"` | Sort direction passed to `onSort` and `sortFunction`. |

## useColumnVisibility

Hook for managing column show/hide state outside of `DataTable`. Pairs with the `omit` column prop.

```tsx
import { useColumnVisibility, type TableColumn } from 'react-data-table-component';

const rawColumns: TableColumn<Row>[] = [
  { id: 'name', name: 'Name', selector: r => r.name },
  { id: 'dept', name: 'Department', selector: r => r.dept },
];

function App() {
  const { columns, visibility, toggle, setAll } = useColumnVisibility(rawColumns);

  return (
    <>
      {visibility.map(({ id, name, visible }) => (
        <label key={id}>
          <input type="checkbox" checked={visible} onChange={() => toggle(id)} />
          {name}
        </label>
      ))}
      <button onClick={() => setAll(true)}>Show all</button>
      <DataTable columns={columns} data={data} />
    </>
  );
}
```

### UseColumnVisibilityResult

| Field | Type | Description |
|---|---|---|
| `columns` | `TableColumn<T>[]` | Columns with `omit` set according to current visibility. Pass directly to `DataTable`. |
| `visibility` | `ColumnVisibilityEntry[]` | Current visibility state for every column. |
| `toggle` | `(id: string \| number) => void` | Toggle the visibility of a single column by id. |
| `setAll` | `(visible: boolean) => void` | Show or hide all columns at once. |

### ColumnVisibilityEntry

| Field | Type | Description |
|---|---|---|
| `id` | `string \| number` | Column id. |
| `name` | `ReactNode` | Column name (mirrors the `name` field from the column definition). |
| `visible` | `boolean` | Whether the column is currently visible. |

## useTableExport

Hook for generating CSV / JSON from your columns and rows, with download + clipboard helpers. See [Export (CSV / JSON)](/docs/export) for the full guide.

```tsx
import { useTableExport, type TableColumn } from 'react-data-table-component';

const columns: TableColumn<Row>[] = [
  { id: 'id', name: 'ID', selector: r => r.id },
  { id: 'name', name: 'Name', selector: r => r.name },
];

function App({ rows }: { rows: Row[] }) {
  const { download, copy, toCSV, toJSON } = useTableExport({ columns, rows });

  return (
    <>
      <button onClick={() => download('rows.csv')}>CSV</button>
      <button onClick={() => download('rows.json', 'json')}>JSON</button>
      <button onClick={() => copy()}>Copy CSV</button>
    </>
  );
}
```

### UseTableExportOptions

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumn<T>[]` | required | Same array you pass to DataTable. `omit: true` columns are skipped. |
| `rows` | `T[]` | required | Rows to export. |
| `valueSource` | `'selector' \| 'format'` | `'selector'` | `'selector'` exports raw values; `'format'` runs `column.format` first. |
| `headerOverrides` | `Record<string \| number, string>` | – | Replace header label per column id. |
| `columnOrder` | `(string \| number)[]` | – | Restrict and reorder columns by id. |

### UseTableExportResult

| Field | Type | Description |
| --- | --- | --- |
| `toCSV` | `() => string` | Build a CSV string. |
| `toJSON` | `() => string` | Build a pretty-printed JSON string. |
| `download` | `(filename: string, format?: 'csv' \| 'json') => void` | Trigger a browser download. SSR-safe (no-op when `document` is undefined). |
| `copy` | `(format?: 'csv' \| 'json') => Promise<void>` | Copy to clipboard via `navigator.clipboard`. Rejects when unavailable. |

## Package exports

```ts
// Default export
import DataTable from 'react-data-table-component';

// Named exports
import {
  createTheme,
  defaultThemes,
  Media,
  Direction,
  Alignment,
  SortOrder,
  // Default icon sets (useful when building custom pagination/expander UIs)
  DEFAULT_PAGINATION_ICONS,
  DEFAULT_EXPANDABLE_ICON,
  // Headless hooks
  useTableState,
  useColumns,
  useTableData,
  useColumnFilter,
  useColumnVisibility,
  useTableExport,
  // Filter utilities
  emptyFilterState,
  isFilterActive,
} from 'react-data-table-component';

// TypeScript types
import type {
  TableProps,
  TableColumn,
  ColumnGroup,
  TableRow,
  TableStyles,
  Theme,
  ThemeProp,
  ConditionalStyles,
  DataTableHandle,
  ExpanderComponentProps,
  PaginationComponentProps,
  PaginationOptions,
  PaginationServerOptions,
  PaginationIcons,
  SortFunction,
  Selector,
  // Column visibility hook types
  UseColumnVisibilityResult,
  ColumnVisibilityEntry,
  // Filter types
  FilterType,
  FilterOperator,
  FilterCondition,
  FilterState,
} from 'react-data-table-component';
```
