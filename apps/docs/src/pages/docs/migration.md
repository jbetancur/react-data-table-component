---
layout: '../../layouts/DocsLayout.astro'
title: 'Migration guide | react-data-table-component'
description: 'Step-by-step upgrade instructions and breaking changes for each major version of react-data-table-component.'
---

# Migration guide

Breaking changes and upgrade steps for each major version of `react-data-table-component`.

## Upgrading to v8

### Breaking changes

#### React 18 required

v8 requires React 18 or later. If you are on React 17, upgrade React first:

```sh
npm install react@18 react-dom@18
```

#### `styled-components` is no longer a peer dependency

v7 and earlier used [styled-components](https://styled-components.com/). v8 replaces that with plain CSS injected at runtime, so:

- You can remove `styled-components` from your `package.json` if it was only there for this library.
- Themes are now driven by CSS variables. No `ThemeProvider` wrapping is required.
- Bundle size drops, SSR / React Server Components compatibility improves, and there's no CSS-in-JS runtime cost on every render.

```jsonc
// package.json (remove if you only had it for react-data-table-component
{
  "dependencies": {
-   "styled-components": "^5.x"
  }
}
```

For most apps (Vite, CRA, Remix, Next.js Pages Router, Pages directory in App Router) styles "just work". The component injects them when it first renders. No CSS import needed.

> **Next.js App Router users:** an explicit CSS import is _optionally_ available to avoid a flash of unstyled content during SSR. See the [installation page](/docs/installation/) for the `react-data-table-component/css` import pattern.

#### Why the move away from styled-components

- **Bundle size**: dropping `styled-components` saves ~12 KB gzipped.
- **SSR & React Server Components**: runtime-injected CSS works with the App Router; styled-components needed extra setup (`ServerStyleSheet`) to avoid hydration mismatches.
- **No provider**: CSS variables work wherever `<DataTable>` renders, no `ThemeProvider` wrapping.
- **Fewer peer deps**: one less version constraint to coordinate with the host app.

#### Selector must be a function: strings no longer accepted

`column.selector` is now strictly `(row: T, rowIndex?: number) => Primitive | React.ReactNode`. String selectors were deprecated in v7 with a runtime warning; v8 drops the warning. Passing a string will throw "selector is not a function" at runtime.

```ts
// Before (v6, string accessor)
{ selector: 'user.name' }

// After (v7+)
{ selector: row => row.user.name }
```

#### `paginationIcon*` props replaced by `paginationIcons`

The four individual pagination icon props are replaced by a single `paginationIcons` object, matching how `expandableIcon` works. Pass a partial object to override only the icons you need.

```tsx
// Before (v7)
<DataTable
  paginationIconFirstPage={<MyFirst />}
  paginationIconLastPage={<MyLast />}
  paginationIconNext={<MyNext />}
  paginationIconPrevious={<MyPrev />}
/>

// After (v8)
import { DEFAULT_PAGINATION_ICONS } from 'react-data-table-component';

// Override all
<DataTable paginationIcons={{ first: <MyFirst />, last: <MyLast />, next: <MyNext />, previous: <MyPrev /> }} />

// Override one, keep the rest
<DataTable paginationIcons={{ ...DEFAULT_PAGINATION_ICONS, next: <MyNext /> }} />
```

#### `subHeader` + `subHeaderComponent` merged into `subHeader`

Previously two props were needed: `subHeader` (boolean toggle) and `subHeaderComponent` (the content). In v8 `subHeader` is the content itself. Providing any value shows the bar.

```tsx
// Before (v7)
<DataTable subHeader subHeaderComponent={<SearchBar />} />

// After (v8)
<DataTable subHeader={<SearchBar />} />
```

#### `IDataTableProps` removed

The `IDataTableProps` type alias (deprecated in v7) is no longer exported. Use `TableProps<T>` directly.

```ts
// Before (v6/v7)
import type { IDataTableProps } from 'react-data-table-component';

// After (v8)
import type { TableProps } from 'react-data-table-component';
```

#### Filter API replaced with structured `FilterState`

The filter API now supports multiple operators, two conditions per column, and explicit Apply semantics. Three filter types are built-in: `text`, `number`, and `date`.

**`filterValues` and `onFilterChange` on `<DataTable>`**

The value type changed from `string` to `FilterState`:

```ts
// Before (v7)
filterValues?: Record<string | number, string>
onFilterChange?: (columnId: string | number, value: string) => void

// After (v8)
import type { FilterState } from 'react-data-table-component';

filterValues?: Record<string | number, FilterState>
onFilterChange?: (columnId: string | number, filter: FilterState) => void
```

**`filterFunction` on `TableColumn`**

The second argument changed from `string` to `FilterState` so you have access to both conditions and the AND/OR logic:

```ts
// Before (v7)
{
  filterable: true,
  filterFunction: (row, value) => row.name.startsWith(value),
}

// After (v8)
import type { FilterState } from 'react-data-table-component';

{
  filterable: true,
  filterType: 'text',
  filterFunction: (row, filter) => {
    const v = filter.condition1.value ?? '';
    return row.name.toLowerCase().startsWith(v.toLowerCase());
  },
}
```

**New `filterType` column prop**

Set `filterType` on each filterable column to get the appropriate operator set and input widget:

| Value | Operators available |
| --- | --- |
| `"text"` (default) | contains, not contains, equals, not equals, begins with, ends with, blank, not blank |
| `"number"` | equals, not equals, greater than, ≥, less than, ≤, between, blank, not blank |
| `"date"` | equals, before, after, between, blank, not blank |

```ts
const columns: TableColumn<Row>[] = [
  { id: 'name',  name: 'Name',  selector: r => r.name,  filterable: true },
  { id: 'age',   name: 'Age',   selector: r => r.age,   filterable: true, filterType: 'number' },
  { id: 'dob',   name: 'DOB',   selector: r => r.dob,   filterable: true, filterType: 'date' },
];
```

##### Two conditions and AND/OR logic

The filter panel now lets the user add a second condition and toggle AND/OR between them. The full shape of `FilterState`:

```ts
type FilterState = {
  condition1: { operator: FilterOperator; value?: string; value2?: string };
  condition2?: { operator: FilterOperator; value?: string; value2?: string };
  logic?: 'AND' | 'OR'; // defaults to 'AND'
};
```

##### Filters apply on explicit click, not on keystroke

Previously filters applied live as the user typed. In v8 the filter popup has an **Apply** button. `onFilterChange` (and internal re-filter) only fires when Apply is clicked. Clear still clears immediately.

##### Utilities exported for headless usage

```ts
import { emptyFilterState, isFilterActive } from 'react-data-table-component';

// Create a default empty FilterState for a given type
const state = emptyFilterState('number'); // { condition1: { operator: 'equals' } }

// Check whether a FilterState has an active filter
isFilterActive(state); // false
```

#### `column.hide` requires the `Media` enum

`TableColumn.hide` now requires the `Media` enum. Raw string literals are no longer accepted.

```ts
import { Media } from 'react-data-table-component';

// Before (v7)
{ hide: 'sm' }
{ hide: 'md' }
{ hide: 'lg' }

// After (v8)
{ hide: Media.SM }
{ hide: Media.MD }
{ hide: Media.LG }
```

### Deprecations

#### `clearSelectedRows` prop → use a ref

The boolean `clearSelectedRows` toggle prop is deprecated (still works in v8). Use a `ref` and call `ref.current.clearSelectedRows()` instead.

```tsx
// Before (v7, still works but deprecated in v8)
const [resetRows, setResetRows] = useState(false);

<DataTable
  clearSelectedRows={resetRows}
  onSelectedRowsChange={handleChange}
  ...
/>

// After (v8)
import { useRef } from 'react';
import DataTable, { type DataTableHandle } from 'react-data-table-component';

const ref = useRef<DataTableHandle>(null);

<button onClick={() => ref.current?.clearSelectedRows()}>Clear</button>
<DataTable ref={ref} onSelectedRowsChange={handleChange} ... />
```

### Behavioural fix: `createTheme` shape

If you were following old examples that wrapped theme tokens in a `colors` object, that wrapper was never a real API. Pass tokens at the top level:

```ts
// Before (incorrect pattern from old docs)
createTheme('brand', {
  colors: {                     // ← wrong
    text: { primary: '#111' },
  },
});

// After (v8)
createTheme('brand', {
  text: { primary: '#111', secondary: '#555', disabled: 'rgba(0,0,0,.38)' },
  background: { default: '#fff' },
});
```

Note that `ThemeText` requires all three fields (`primary`, `secondary`, and `disabled`) when overriding the `text` token.

### New features in v8 (non-breaking)

| Feature | API |
| --- | --- |
| Row entrance & sort animations | `animateRows` |
| Column separators | `columnSeparator` |
| Spanning column group headers | `columnGroups` |
| Drag-to-resize column handles | `resizable` |
| Column drag-to-reorder | `reorder` on `TableColumn` + `onColumnOrderChange` |
| Column filter popups (text / number / date) | `filterable` / `filterType` / `filterFunction` on `TableColumn`, `filterValues` / `onFilterChange` on `DataTable` |
| Programmatic selection clear | `useRef<DataTableHandle>` + `ref.current.clearSelectedRows()` |
| Headless hooks | `useTableState`, `useColumns`, `useTableData`, `useColumnFilter`. See [Headless hooks](/docs/headless/) |
| Next.js App Router support | Bundle ships with `"use client"`; import `<DataTable>` directly into a Server Component file |
| Optional CSS entry point | `import 'react-data-table-component/css'` for SSR / App Router consumers to avoid FOUC |
| Improved TypeScript types | `DataTableHandle` ref type, stricter `Selector<T>` |
| Built-in themes expanded | `slate`, `ocean`, `midnight`, `solarized` (in addition to `default`, `light`, `dark`, `material`) |

## Upgrading to v7

### `IDataTableProps` renamed → `TableProps`

The primary props type was renamed to `TableProps<T>`. Update any imports. The `IDataTableProps` alias is fully removed in v8.

```ts
// Before
import type { IDataTableProps } from 'react-data-table-component';

// After
import type { TableProps } from 'react-data-table-component';
```

### TypeScript generics on TableColumn

v7 introduced proper generics on `TableColumn<T>`. Untyped column arrays will now produce TypeScript errors if `selector` or `cell` reference unknown row fields.

```ts
// Before (v6, untyped)
const columns = [ ... ];

// After (v7+)
interface Row { id: number; name: string; }
const columns: TableColumn<Row>[] = [ ... ];
```

### onSort signature changed

The `onSort` callback now receives the full sorted rows array as a third argument. Update any existing handlers.

```tsx
// Before (v6)
onSort={(column, direction) => { ... }}

// After (v7+)
onSort={(column, direction, sortedRows) => { ... }}
```

### paginationRowsPerPageOptions default changed

The default options array changed from `[10, 20, 30, 40, 50]` to `[10, 15, 20, 25, 30]`. If your tests assert a specific default, pass the array explicitly.

## Upgrading to v6

### Deep imports no longer supported

```tsx
// Deep imports no longer supported (v6+)
// import DataTable from 'react-data-table-component/src/DataTable';

// Use the package root instead
import DataTable from 'react-data-table-component';
```

### Theme API introduced

v6 replaced the `customTheme` prop with the `createTheme()` function and the `theme` string prop.

```tsx
// Before (v5)
<DataTable customTheme={{ header: { ... }, rows: { ... } }} />

// After (v6+)
import { createTheme } from 'react-data-table-component';

createTheme('myTheme', {
  text: { primary: '#111', secondary: '#555', disabled: 'rgba(0,0,0,.38)' },
  background: { default: '#fff' },
});

<DataTable theme="myTheme" />
```
