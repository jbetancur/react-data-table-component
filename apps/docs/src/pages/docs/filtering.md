---
layout: '../../layouts/DocsLayout.astro'
title: 'Filtering | react-data-table-component'
---

# Filtering

Built-in per-column filter popups with operator selection, two-condition AND/OR logic, and support for text, number, and date column types.

---

## Quick start

Enable filtering on a column by setting `filterable: true` and giving it an `id`:

```tsx
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
  id: number;
  name: string;
  age: number;
}

const columns: TableColumn<Row>[] = [
  { id: 'name', name: 'Name', selector: r => r.name, filterable: true },
  { id: 'age',  name: 'Age',  selector: r => r.age,  filterable: true, filterType: 'number' },
];

<DataTable columns={columns} data={data} />
```

A filter icon appears in each filterable column header. Clicking it opens a popup where the user picks an operator, enters a value, and clicks **Apply**. Filters across multiple columns combine with AND logic — a row must pass every active column filter to be shown.

---

## Filter types

Set `filterType` on a column to get the right operator set and input widget.

| `filterType` | Default operator | Input | Operators |
| --- | --- | --- | --- |
| `"text"` (default) | Contains | Text | Contains, Does not contain, Equals, Does not equal, Begins with, Ends with, Blank, Not blank |
| `"number"` | Equals | Number | Equals, Does not equal, Greater than, ≥, Less than, ≤, Between, Blank, Not blank |
| `"date"` | Equals | Date | Equals, Before, After, Between, Blank, Not blank |

```tsx
const columns: TableColumn<Row>[] = [
  { id: 'name',  name: 'Name',       selector: r => r.name,  filterable: true },
  { id: 'score', name: 'Score',      selector: r => r.score, filterable: true, filterType: 'number' },
  { id: 'dob',   name: 'Birth date', selector: r => r.dob,   filterable: true, filterType: 'date' },
];
```

For `"date"` filtering, the selector should return an ISO date string (`"2024-03-15"`) or any value parseable by `new Date()`.

**Blank / Not blank** operators match on the cell value being empty or non-empty and require no value input.

**Between** (number and date) shows two value inputs for the lower and upper bounds (inclusive).

---

## Two conditions per column

Each filter popup lets the user add a second condition. The two conditions combine with **AND** (both must match) or **OR** (either must match, defaulting to AND).

```
┌──────────────────────────────────────┐
│ [Begins with ▼] [J              ]    │
│ [AND] [OR]                           │
│ [Ends with   ▼] [smith         ] ✕   │
│ + Add condition                      │
│                       [Clear] [Apply]│
└──────────────────────────────────────┘
```

The full `FilterState` type that describes one column's filter:

```ts
import type { FilterState, FilterOperator } from 'react-data-table-component';

const filter: FilterState = {
  condition1: { operator: 'startsWith', value: 'J' },
  condition2: { operator: 'endsWith',   value: 'smith' },
  logic: 'AND',   // 'AND' | 'OR' — defaults to 'AND'
};
```

---

## Apply / Clear behaviour

Filters apply only when the user clicks **Apply** — typing into a filter input does not immediately re-filter the table. This avoids mid-keystroke filtering on large datasets and keeps the interaction predictable.

Clicking **Clear** resets the column's filter to its empty default state and applies immediately (no extra Apply click needed).

---

## FilterState type reference

```ts
import type {
  FilterState,
  FilterCondition,
  FilterOperator,
  FilterType,
} from 'react-data-table-component';

type FilterType = 'text' | 'number' | 'date';

type FilterOperator =
  | 'contains' | 'notContains'
  | 'equals'   | 'notEquals'
  | 'startsWith' | 'endsWith'
  | 'blank'    | 'notBlank'
  | 'gt' | 'gte' | 'lt' | 'lte' | 'between'   // number / date
  | 'before'   | 'after';                        // date only

type FilterCondition = {
  operator: FilterOperator;
  value?: string;   // absent for blank / notBlank
  value2?: string;  // second bound for between
};

type FilterState = {
  condition1: FilterCondition;
  condition2?: FilterCondition;
  logic?: 'AND' | 'OR';  // defaults to 'AND'
};
```

---

## Custom filter function

Override the built-in operator logic per column with `filterFunction`. It receives the full `FilterState` — both conditions and the logic flag — so you can implement any predicate you need:

```tsx
import type { TableColumn, FilterState } from 'react-data-table-component';

const columns: TableColumn<Row>[] = [
  {
    id: 'tags',
    name: 'Tags',
    selector: r => r.tags.join(', '),
    filterable: true,
    filterFunction: (row, filter) => {
      const term = (filter.condition1.value ?? '').toLowerCase();
      return row.tags.some(tag => tag.toLowerCase().includes(term));
    },
  },
];
```

When `filterFunction` is set, the built-in operator dropdown still appears for the user's interaction, but the actual matching is entirely delegated to your function. Both `condition1` and `condition2` are available in the `FilterState` argument — your function is responsible for combining them if needed.

---

## Controlled mode

By default, filter state is managed internally. To own the state yourself — for example to persist it in a URL or reset it programmatically — pass `filterValues` and `onFilterChange`:

```tsx
import { useState } from 'react';
import DataTable, { type FilterState, emptyFilterState } from 'react-data-table-component';

function App() {
  const [filterValues, setFilterValues] = useState<Record<string | number, FilterState>>({});

  function handleFilterChange(columnId: string | number, filter: FilterState) {
    setFilterValues(prev => ({ ...prev, [columnId]: filter }));
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
    />
  );
}
```

`onFilterChange` fires when the user clicks **Apply** or **Clear** in a filter popup. The `FilterState` passed to it always reflects the full condition state — use `isFilterActive(filter)` to check whether a filter is actually doing anything:

```ts
import { isFilterActive } from 'react-data-table-component';

const activeCount = Object.values(filterValues).filter(isFilterActive).length;
```

### Resetting filters

To reset all filters, set `filterValues` back to `{}`. To reset pagination when filters change, toggle `paginationResetDefaultPage`:

```tsx
function handleFilterChange(columnId: string | number, filter: FilterState) {
  setFilterValues(prev => ({ ...prev, [columnId]: filter }));
  setResetPage(v => !v);  // toggles the prop each time
}

<DataTable
  filterValues={filterValues}
  onFilterChange={handleFilterChange}
  paginationResetDefaultPage={resetPage}
/>
```

---

## Utility exports

Two helpers are exported for working with `FilterState` outside `<DataTable />`:

```ts
import { emptyFilterState, isFilterActive } from 'react-data-table-component';

// Create a default-empty FilterState for a given type
const blank = emptyFilterState('number');
// → { condition1: { operator: 'equals' } }

// Check whether a FilterState has an active filter condition
isFilterActive(blank);  // false

const active: FilterState = { condition1: { operator: 'contains', value: 'alice' } };
isFilterActive(active); // true
```

`emptyFilterState` is useful when initialising `filterValues` with sensible defaults, or when building a custom reset UI.

---

## Headless usage

Use `useColumnFilter` directly if you're building a custom table with the headless hooks:

```tsx
import {
  useColumnFilter,
  emptyFilterState,
  type FilterState,
} from 'react-data-table-component';

const { filterValues, handleFilterChange, filteredData } = useColumnFilter(columns);

// Build your own filter UI, call handleFilterChange on Apply:
function onApply(columnId: string | number, filter: FilterState) {
  handleFilterChange(columnId, filter);
}

// Apply filters to rows before rendering:
const rows = filteredData(tableRows);
```

See the [Headless hooks](/docs/headless) page for the full `useColumnFilter` API.
