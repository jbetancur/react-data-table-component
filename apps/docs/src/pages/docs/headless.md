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
