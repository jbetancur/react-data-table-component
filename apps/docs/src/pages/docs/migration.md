---
layout: '../../layouts/DocsLayout.astro'
title: 'Migration guide | react-data-table-component'
---

# Migration guide

This page covers breaking changes and upgrade steps for each major version of `react-data-table-component`.

## Upgrading to v8

### Breaking changes

#### React 18 required

v8 requires React 18 or later. If you are on React 17, upgrade React first:

```sh
npm install react@18 react-dom@18
```

#### `styled-components` is no longer a peer dependency

v7 and earlier styled the table via [styled-components](https://styled-components.com/). v8 replaces that with plain CSS injected at runtime, so:

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

- **Bundle size**: dropping the `styled-components` runtime saves ~12 KB gzipped from consumer bundles.
- **SSR & React Server Components**: runtime-injected CSS plays cleanly with the App Router; styled-components needed extra setup (`ServerStyleSheet`) to avoid hydration mismatches.
- **No theme provider plumbing**: CSS variables work everywhere a `<DataTable>` is rendered, with no provider wrapping required.
- **Peer-dependency surface**: one less version constraint to coordinate with the host app.

#### Selector must be a function: strings no longer accepted

`column.selector` is now strictly typed as `(row: T, rowIndex?: number) => Primitive | React.ReactNode`. String selectors were deprecated in v7 and emitted a runtime warning; in v8 the warning is removed. JS-only callers passing a string will hit a "selector is not a function" runtime error.

```ts
// Before (v6, string accessor)
{ selector: 'user.name' }

// After (v7+)
{ selector: row => row.user.name }
```

#### `column.hide` requires the `Media` enum

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
|---|---|
| Row entrance & sort animations | `animateRows` |
| Column separators | `columnSeparator` |
| Spanning column group headers | `columnGroups` |
| Drag-to-resize column handles | `resizable` |
| Column drag-to-reorder | `reorder` on `TableColumn` + `onColumnOrderChange` |
| Column filter inputs | `filterable` / `filterFunction` on `TableColumn`, `filterValues` / `onFilterChange` on `DataTable` |
| Programmatic selection clear | `useRef<DataTableHandle>` + `ref.current.clearSelectedRows()` |
| Headless hooks | `useTableState`, `useColumns`, `useTableData`, `useColumnFilter`. See [Headless hooks](/docs/headless/) |
| Next.js App Router support | Bundle ships with `"use client"`; import `<DataTable>` directly into a Server Component file |
| Optional CSS entry point | `import 'react-data-table-component/css'` for SSR / App Router consumers to avoid FOUC |
| Improved TypeScript types | `DataTableHandle` ref type, stricter `Selector<T>` |
| Built-in themes expanded | `slate`, `ocean`, `midnight`, `solarized` (in addition to `default`, `light`, `dark`, `material`) |

## Upgrading to v7

### `IDataTableProps` renamed → `TableProps`

The primary props type was renamed to `TableProps<T>`. `IDataTableProps` is still exported as a type alias for backwards compatibility (and continues to work in v8) but will be removed in a future major version.

```ts
// Before
import type { IDataTableProps } from 'react-data-table-component';

// After
import type { TableProps } from 'react-data-table-component';
```

### TypeScript generics on TableColumn

v7 introduced proper generics on `TableColumn<T>`. Untyped column arrays will now produce TypeScript errors if `selector` or `cell` reference unknown row fields.

```ts
// Before (v6, no generic)
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
