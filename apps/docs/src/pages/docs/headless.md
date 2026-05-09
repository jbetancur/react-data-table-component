---
layout: '../../layouts/DocsLayout.astro'
title: 'Headless hooks'
description: 'Use the logic layer of react-data-table-component without its default markup or styles.'
---

# Headless hooks

`react-data-table-component` ships four hooks that power `<DataTable />` internally. You can import them directly and compose them yourself when you need full control over markup and styles, without giving up sorting, pagination, selection, filtering, and column-drag logic.

This is the middle ground between using the styled `<DataTable />` as-is and rebuilding everything from scratch with a fully headless library.

---

## When to use this

- You have a design system and can't override the default styles far enough
- You're building inside a heavily customised UI (e.g. a design system component library)
- You want the table logic but need to render it inside something other than a standard `<table>` or flex layout
- You want to compose only some hooks (e.g. sorting + pagination) and handle the rest yourself

If the default `<DataTable />` with `customStyles` covers your needs, use that. It is less work.

---

## The four hooks

| Hook | What it does |
|---|---|
| `useColumns` | Manages column order and drag-to-reorder |
| `useTableState` | Sort, pagination, and row-selection state + dispatchers |
| `useTableData` | Sorts and paginates the raw data into renderable rows |
| `useColumnFilter` | Per-column filter values and client-side filter logic |

All four are pure: no JSX, no CSS, no hard dependency on the rendered component tree.

---

## Basic example

```tsx
import {
  useColumns,
  useTableState,
  useTableData,
  useColumnFilter,
} from 'react-data-table-component';

const columns = [
  { id: 1, name: 'Name',   selector: (row) => row.name,   sortable: true },
  { id: 2, name: 'Email',  selector: (row) => row.email },
  { id: 3, name: 'Role',   selector: (row) => row.role },
];

function MyTable({ data }) {
  // 1. Column order + drag state
  const { tableColumns, handleDragStart, handleDragEnd } = useColumns(
    columns,
    () => {},      // onColumnOrderChange
    null,          // defaultSortFieldId
    true,          // defaultSortAsc
  );

  // 2. Sort / page / selection state
  const {
    tableState,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSelectedRow,
    handleSelectAllRows,
  } = useTableState({
    data,
    keyField: 'id',
    defaultSortColumn: tableColumns[0],
    defaultSortDirection: 'asc',
    paginationDefaultPage: 1,
    paginationPerPage: 10,
    paginationServer: false,
    paginationServerOptions: {},
    paginationTotalRows: 0,
    pagination: true,
    selectableRowsSingle: false,
    selectableRowsVisibleOnly: false,
    selectableRowSelected: null,
    clearSelectedRows: false,
    paginationResetDefaultPage: false,
    onSelectedRowsChange: () => {},
    onSort: () => {},
    onChangePage: () => {},
    onChangeRowsPerPage: () => {},
  });

  const { selectedColumn, sortDirection, currentPage, rowsPerPage } = tableState;

  // 3. Sorted + paginated rows
  const { sortedData, tableRows } = useTableData({
    data,
    columns: tableColumns,
    selectedColumn,
    sortDirection,
    currentPage,
    rowsPerPage,
    pagination: true,
    paginationServer: false,
    sortServer: false,
    sortFunction: null,
    onSort: () => {},
  });

  // 4. Optional: per-column filtering
  const { filterValues, handleFilterChange, filteredData } = useColumnFilter(
    tableColumns,
    undefined,  // no controlled filter values
    undefined,  // no onFilterChange callback
  );

  const rows = filteredData(tableRows);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableColumns.map(col => (
              <th key={col.id} onClick={() => handleSort({ type: 'SORT_CHANGE', sortColumn: col, clearSelectedRows: false })}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {tableColumns.map(col => (
                <td key={col.id}>{col.selector?.(row, i)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## API reference

### `useColumns<T>`

```ts
function useColumns<T>(
  columns: TableColumn<T>[],
  onColumnOrderChange: (nextOrder: TableColumn<T>[]) => void,
  defaultSortFieldId: string | number | null | undefined,
  defaultSortAsc: boolean,
): ColumnsHook<T>
```

**Returns:**

| Property | Type | Description |
|---|---|---|
| `tableColumns` | `TableColumn<T>[]` | Decorated columns in current drag order |
| `draggingColumnId` | `string` | ID of the column being dragged, or `''` |
| `defaultSortColumn` | `TableColumn<T>` | The column matching `defaultSortFieldId` |
| `defaultSortDirection` | `SortOrder` | `'asc'` or `'desc'` from `defaultSortAsc` |
| `handleDragStart` | `DragEventHandler` | Attach to `onDragStart` on the header cell |
| `handleDragEnter` | `DragEventHandler` | Attach to `onDragEnter` on the header cell |
| `handleDragOver` | `DragEventHandler` | Attach to `onDragOver` on the header cell |
| `handleDragLeave` | `DragEventHandler` | Attach to `onDragLeave` on the header cell |
| `handleDragEnd` | `DragEventHandler` | Attach to `onDragEnd` on the header cell |

All five drag handlers must be attached for reordering to work correctly.

---

### `useTableState<T>`

```ts
function useTableState<T>(props: UseTableStateProps<T>): UseTableStateReturn<T>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `data` | `T[]` | Full dataset (used for selection total counts) |
| `keyField` | `string` | Unique row identifier field |
| `defaultSortColumn` | `TableColumn<T>` | Column active on first render |
| `defaultSortDirection` | `SortOrder` | `'asc'` \| `'desc'` |
| `pagination` | `boolean` | Enable pagination state |
| `paginationDefaultPage` | `number` | Starting page (1-based) |
| `paginationPerPage` | `number` | Rows per page |
| `paginationServer` | `boolean` | Skip internal page math |
| `paginationServerOptions` | `PaginationServerOptions` | `persistSelectedOnPageChange`, `persistSelectedOnSort` |
| `paginationTotalRows` | `number` | Total server rows (server mode only) |
| `paginationResetDefaultPage` | `boolean` | Toggle this value to reset to page 1 |
| `selectableRowsSingle` | `boolean` | Allow only one selected row |
| `selectableRowsVisibleOnly` | `boolean` | "Select all" acts on current page only |
| `selectableRowSelected` | `(row: T) => boolean \| null` | Pre-select matching rows |
| `clearSelectedRows` | `boolean` | Toggle to clear selection |
| `onSelectedRowsChange` | `(state) => void` | Fires on any selection change |
| `onSort` | `(col, dir, rows) => void` | Fires after sort state changes |
| `onChangePage` | `(page, total) => void` | Fires after page changes |
| `onChangeRowsPerPage` | `(perPage, page) => void` | Fires after rows-per-page changes |

**Returns:**

| Property | Type | Description |
|---|---|---|
| `tableState` | `TableState<T>` | Full state snapshot (see below) |
| `handleSort` | `(action: SortAction<T>) => void` | Dispatch a sort change |
| `handleSelectAllRows` | `(action: AllRowsAction<T>) => void` | Dispatch select/deselect all |
| `handleSelectedRow` | `(action: SingleRowAction<T>) => void` | Dispatch a single row toggle |
| `handleChangePage` | `(page: number) => void` | Dispatch a page change |
| `handleChangeRowsPerPage` | `(perPage, rowCount) => void` | Dispatch a per-page change |
| `handleClearSelectedRows` | `() => void` | Programmatically clear all selections |

**`TableState<T>` shape:**

| Field | Type |
|---|---|
| `currentPage` | `number` |
| `rowsPerPage` | `number` |
| `selectedColumn` | `TableColumn<T>` |
| `sortDirection` | `SortOrder` |
| `selectedRows` | `T[]` |
| `selectedCount` | `number` |
| `allSelected` | `boolean` |

---

### `useTableData<T>`

```ts
function useTableData<T>(props: UseTableDataProps<T>): UseTableDataReturn<T>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `data` | `T[]` | Source rows (pass full array for client-side; current-page array for server-side) |
| `columns` | `TableColumn<T>[]` | From `useColumns` |
| `selectedColumn` | `TableColumn<T>` | From `tableState.selectedColumn` |
| `sortDirection` | `SortOrder` | From `tableState.sortDirection` |
| `currentPage` | `number` | From `tableState.currentPage` |
| `rowsPerPage` | `number` | From `tableState.rowsPerPage` |
| `pagination` | `boolean` | Enable page slicing |
| `paginationServer` | `boolean` | Skip page slicing (server already paginated) |
| `sortServer` | `boolean` | Skip sorting (server already sorted) |
| `sortFunction` | `SortFunction<T> \| null` | Global custom sort comparator |
| `onSort` | `(col, dir, rows) => void` | Called after sort; receives sorted rows |

**Returns:**

| Property | Type | Description |
|---|---|---|
| `sortedData` | `T[]` | All rows after sorting (full dataset, pre-slice) |
| `tableRows` | `T[]` | Rows for the current page after sort + slice |

Pass `tableRows` (not `sortedData`) to `useColumnFilter.filteredData()` and then to your render.

---

### `useColumnFilter<T>`

```ts
function useColumnFilter<T>(
  columns: TableColumn<T>[],
  controlledFilterValues?: Record<string | number, string>,
  onFilterChange?: (columnId: string | number, value: string) => void,
): UseColumnFilterResult<T>
```

Omit both optional arguments to run in **uncontrolled** mode (internal state). Pass both to run in **controlled** mode (you own the state).

**Returns:**

| Property | Type | Description |
|---|---|---|
| `filterValues` | `Record<string \| number, string>` | Current filter string per column ID |
| `handleFilterChange` | `(columnId, value) => void` | Call from your filter input's `onChange` |
| `filteredData` | `(data: T[]) => T[]` | Apply active filters to a row array |

`filteredData` is a stable memoised function — safe to call in render without re-filtering on every keystroke.

Each column can define a custom `filterFunction: (row: T, filterValue: string) => boolean` to override the default case-insensitive substring match.

---

## How `useTableState` and `useTableData` relate

`useTableState` owns the sort/page/selection **state**. `useTableData` takes that state as inputs and returns the **derived rows** to render. They are intentionally separate so you can skip `useTableData` entirely if you're handling sorting and pagination server-side.

```ts
// Server-side: you manage the rows, just use useTableState for UI state
const { tableState, handleSort, handleChangePage } = useTableState({ ..., paginationServer: true });

// When tableState changes, fire your own API call. No useTableData needed
useEffect(() => {
  fetchPage(tableState.currentPage, tableState.rowsPerPage, tableState.sortDirection);
}, [tableState.currentPage, tableState.rowsPerPage, tableState.sortDirection]);
```

---

## What you're responsible for

When you use the hooks directly, you own:

- **Markup**: `<table>`, `<div>`, whatever fits your design system
- **Styles**: no CSS is injected; you apply your own classes
- **Accessibility**: `role`, `aria-sort`, `aria-selected`, screen-reader labels
- **Pagination UI**: the hooks give you `currentPage`, `rowsPerPage`, and `handleChangePage`; you render the controls
- **Selection UI**: `tableState.selectedRows`, `handleSelectedRow`, `handleSelectAllRows` give you the data; you render checkboxes

---

## Staying on the styled `<DataTable />`

None of these exports affect the default `<DataTable />`. It continues to work identically. The hooks are an additive unlocked door, not a replacement.

---

## Live demo

The table below is built entirely from the four hooks — no `<DataTable />` component.
It has sortable headers, per-column filter inputs, manual pagination controls, and striped rows,
all in custom markup with no injected CSS.
