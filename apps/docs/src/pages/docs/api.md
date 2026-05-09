---
layout: '../../layouts/DocsLayout.astro'
title: 'API reference | react-data-table-component'
---

# API reference

Complete reference for every prop, type, and export in `react-data-table-component` v8.

## DataTable props

`DataTable<T>` accepts the following props where `T` is the row data type. Only `columns` and `data` are required.

### Data

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `T[]` | - | **Required.** Array of row objects. |
| `columns` | `TableColumn<T>[]` | - | **Required.** Column definitions. |
| `keyField` | `string` | `"id"` | Property on each row used as a stable React key. |
| `progressPending` | `boolean` | `false` | Show a loading indicator instead of rows. |
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
| `noHeader` | `boolean` | `false` | Hide the title/actions header bar entirely. |
| `noTableHead` | `boolean` | `false` | Hide the column header row. |
| `persistTableHead` | `boolean` | `false` | Show the column header even when `progressPending` or data is empty. |
| `dense` | `boolean` | `false` | Reduce row height for a compact look. |
| `responsive` | `boolean` | `true` | Wrap the table in a horizontally scrollable container. |
| `fixedHeader` | `boolean` | `false` | Stick the column header at the top when scrolling. |
| `fixedHeaderScrollHeight` | `string` | `"100vh"` | Max height of the scrollable body when `fixedHeader` is on. |
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
| `columnSeparator` | `boolean \| "subtle" \| "full"` | - | Vertical lines between body columns. Headers always show separators. `true`/`"subtle"` = inset line, `"full"` = full-height. |
| `animateRows` | `boolean` | `false` | Staggered entrance and sort animations. Respects `prefers-reduced-motion`. |

### Sorting

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultSortFieldId` | `string \| number` | - | Column `id` to sort by on initial render. |
| `defaultSortAsc` | `boolean` | `true` | Initial sort direction. |
| `sortServer` | `boolean` | `false` | Disable client-side sorting; fire `onSort` and let the server sort. |
| `sortFunction` | `SortFunction<T> \| null` | - | Global custom sort function applied to all sortable columns. |
| `sortIcon` | `ReactNode` | built-in chevron | Custom sort direction indicator. |
| `onSort` | `(column, direction, sortedRows) => void` | - | Called whenever the sort column or direction changes. |

### Pagination

| Prop | Type | Default | Description |
|---|---|---|---|
| `pagination` | `boolean` | `false` | Enable built-in pagination controls. |
| `paginationPerPage` | `number` | `10` | Rows shown per page. |
| `paginationRowsPerPageOptions` | `number[]` | `[10,15,20,25,30]` | Options in the rows-per-page dropdown. |
| `paginationDefaultPage` | `number` | `1` | Initial active page. |
| `paginationResetDefaultPage` | `boolean` | `false` | Toggle to reset to page 1 (e.g. after a filter change). |
| `paginationTotalRows` | `number` | - | Total row count for server-side pagination. |
| `paginationServer` | `boolean` | `false` | Delegate page changes to `onChangePage` / `onChangeRowsPerPage`. |
| `paginationServerOptions` | `PaginationServerOptions` | - | Selection-persistence options for server-side mode. |
| `paginationComponentOptions` | `PaginationOptions` | - | Localisation and display options for the built-in paginator. |
| `paginationComponent` | `React.ComponentType` | - | Replace the built-in pagination UI entirely. |
| `paginationIcons` | `PaginationIcons` | - | Override any or all pagination icons. Pass a partial object: `{ next: <MyIcon /> }`. |
| `onChangePage` | `(page, totalRows) => void` | - | Called when the active page changes. |
| `onChangeRowsPerPage` | `(rowsPerPage, page) => void` | - | Called when rows-per-page selection changes. |

### Row selection

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectableRows` | `boolean` | `false` | Show a checkbox column for row selection. |
| `selectableRowsSingle` | `boolean` | `false` | Allow only one row to be selected at a time. |
| `selectableRowsNoSelectAll` | `boolean` | `false` | Hide the "select all" checkbox in the header. |
| `selectableRowsVisibleOnly` | `boolean` | `false` | "Select all" only selects rows on the current page. |
| `selectableRowsHighlight` | `boolean` | `false` | Highlight selected rows using the theme's selected color. |
| `selectableRowDisabled` | `(row: T) => boolean` | - | Disable selection for a specific row. |
| `selectableRowSelected` | `(row: T) => boolean` | - | Pre-select rows that satisfy the predicate. |
| `selectableRowsComponent` | `"input" \| ReactNode` | built-in checkbox | Custom checkbox component. |
| `selectableRowsComponentProps` | `object` | - | Extra props forwarded to the custom checkbox component. |
| `onSelectedRowsChange` | `(state) => void` | - | Called whenever selection changes. Receives `{ allSelected, selectedCount, selectedRows }`. |
| `clearSelectedRows` | `boolean` | - | **Deprecated.** Toggle to clear selection. Use `ref.current.clearSelectedRows()` instead. |

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
| `onRowClicked` | `(row, event) => void` | Called when a row is clicked. |
| `onRowDoubleClicked` | `(row, event) => void` | Called when a row is double-clicked. |
| `onRowMouseEnter` | `(row, event) => void` | Called when the pointer enters a row. |
| `onRowMouseLeave` | `(row, event) => void` | Called when the pointer leaves a row. |

### Column features

| Prop | Type | Default | Description |
|---|---|---|---|
| `resizable` | `boolean` | `false` | Show drag handles on column headers for resizing. |
| `columnGroups` | `ColumnGroup[]` | - | Spanning group headers rendered above the column header row. |
| `filterValues` | `Record<string \| number, string>` | - | Controlled filter state. Omit to use internal state. |
| `onFilterChange` | `(columnId, value) => void` | - | Called when a column filter input changes. |
| `onColumnOrderChange` | `(columns) => void` | - | Called after a drag-to-reorder column operation. |

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
| `name` | `ReactNode` | — | **Required.** Group header label. Accepts JSX. |
| `columnIds` | `(string \| number)[]` | — | **Required.** Ids of columns under this group. Must match each column's `id` exactly. |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Horizontal alignment of the group label. |

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
| `selector` | `(row, index?) => Primitive \| ReactNode` | Data accessor. For sortable columns return a `Primitive` (`string \| number \| boolean`). |
| `cell` | `(row, index, column, id) => ReactNode` | Custom cell renderer. Overrides the `selector` display value. |
| `format` | `(row, index) => ReactNode` | Format the selector value for display without changing the sort key. |
| `sortable` | `boolean` | Enable sorting on this column. |
| `sortFunction` | `(a: T, b: T) => number` | Custom comparator for this column. |
| `sortField` | `string` | Field key passed to `onSort` for server-side sort identification. |
| `filterable` | `boolean` | Show a text filter input below the column header. |
| `filterFunction` | `(row, value) => boolean` | Custom filter predicate. Defaults to a case-insensitive substring match on the selector value. |
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
| `style` | `CSSProperties` | Inline styles applied to every cell in this column. |
| `conditionalCellStyles` | `ConditionalStyles<T>[]` | Per-cell conditional styles. |

## DataTableHandle (ref)

Attach a ref to `DataTable` to imperatively control it.

```tsx
import DataTable, { type DataTableHandle } from 'react-data-table-component';
import { useRef } from 'react';

function App() {
  const ref = useRef<DataTableHandle>(null);

  return (
    <>
      <button onClick={() => ref.current?.clearSelectedRows()}>
        Clear selection
      </button>
      <DataTable ref={ref} columns={columns} data={data} selectableRows />
    </>
  );
}
```

| Method | Description |
|---|---|
| `clearSelectedRows()` | Deselect all currently selected rows. |

## TableStyles

Pass to `customStyles` to override styles for any part of the table. Each key accepts a `style` object (`React.CSSProperties`) and optional extra properties.

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

Registers a custom named theme globally. Call this outside your component tree (at module level) so it runs once.

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
  SortFunction,
  Selector,
} from 'react-data-table-component';
```
