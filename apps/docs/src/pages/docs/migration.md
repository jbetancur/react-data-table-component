---
layout: '../../layouts/DocsLayout.astro'
title: 'Migration guide — react-data-table-component'
---

# Migration guide

This page covers breaking changes and upgrade steps for each major version of `react-data-table-component`.

## Upgrading to v8

### React 18 required

v8 requires React 18 or later. If you are on React 17, upgrade React first:

```sh
npm install react@18 react-dom@18
```

### No CSS import needed

Previous versions required importing a CSS file. In v8 all styles are injected automatically — remove any explicit CSS import from your entry point.

```tsx
// Remove this — no longer needed in v8
import 'react-data-table-component/dist/react-data-table-component.css';
```

### clearSelectedRows prop deprecated → use a ref

The boolean `clearSelectedRows` toggle prop is deprecated. Use a `ref` and call `ref.current.clearSelectedRows()` instead.

```tsx
// Before (v7 — still works but deprecated in v8)
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

### IDataTableProps renamed to TableProps

The primary props type is now `TableProps<T>`. `IDataTableProps` is kept as an alias for backwards compatibility but will be removed in a future major version.

```ts
// Before
import type { IDataTableProps } from 'react-data-table-component';

// After
import type { TableProps } from 'react-data-table-component';
```

### column.hide requires the Media enum, not string literals

The `hide` property on `TableColumn` now requires the `Media` enum rather than raw string literals.

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

### createTheme — no colors wrapper

In some older examples the theme tokens were wrapped in a `colors` object. That wrapper does not exist. Pass tokens at the top level.

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

Also note that `ThemeText` requires all three fields — `primary`, `secondary`, and `disabled` — when overriding the `text` token.

### New features in v8 (non-breaking)

| Feature | Prop(s) |
|---|---|
| Row entrance & sort animations | `animateRows` |
| Column separators | `columnSeparator` |
| Spanning column group headers | `columnGroups` |
| Drag-to-resize column handles | `resizable` |
| Column drag-to-reorder | `reorder` on `TableColumn` + `onColumnOrderChange` |
| Column filter inputs | `filterable` / `filterFunction` on `TableColumn`, `filterValues` / `onFilterChange` on `DataTable` |
| Improved TypeScript types | `DataTableHandle`, stricter `Selector<T>` |
| Built-in themes expanded | `slate`, `slate-dark`, `ocean`, `ocean-dark`, `midnight`, `solarized` |

## Upgrading to v7

### TypeScript generics on TableColumn

v7 introduced proper generics on `TableColumn<T>`. Untyped column arrays will now produce TypeScript errors if `selector` or `cell` reference unknown row fields.

```ts
// Before (v6 — no generic)
const columns: IDataTableColumn[] = [ ... ];

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
