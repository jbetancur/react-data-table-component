# react-data-table-component — Refactoring Guide

## Goal

Modernize the library internals without breaking the public `TableProps<T>` contract more than necessary. The three main targets are:

1. **Remove styled-components** — replace with CSS custom properties + CSS Modules
2. **Replace Jest + snapshots** with Vitest + behavior tests
3. **Simplify the build** — replace 4 rollup configs with tsup

The public API surface (all props on `DataTable`, `createTheme`, column definitions) must stay largely intact. Where breaking changes are unavoidable, flag them clearly and provide a migration note.

---

## 1. Styling: Drop styled-components → CSS custom properties + CSS Modules

### Why

- styled-components is a heavy peer dep (~12 kB gzipped) that users must install themselves
- Generated class names make snapshot tests brittle and meaningless
- Runtime CSS injection blocks SSR and adds latency
- CSS custom properties give equivalent theming power with zero runtime cost

### Target architecture

**Theming via CSS variables on the root element**

The `createTheme()` API stays, but instead of building a styled-components theme object it returns a flat map of CSS variable assignments:

```ts
// Before (styled-components ThemeProvider)
createTheme('dark', { text: { primary: '#fff' } })

// After (CSS variable map)
createTheme('dark', { text: { primary: '#fff' } })
// → { '--rdt-color-text-primary': '#fff', ... }
```

The `<DataTable>` root element applies the active theme as `style={cssVarMap}`. No `ThemeProvider` wrapper needed.

**Component styles via CSS Modules**

Each component gets a `ComponentName.module.css` file. No styled-components, no template literals. Example:

```css
/* TableRow.module.css */
.row {
  display: flex;
  border-bottom: 1px solid var(--rdt-color-divider-default);
}
.row:hover { background: var(--rdt-color-highlight-on-hover); }
.selected { background: var(--rdt-color-selected-default); }
```

**customStyles prop migration**

`customStyles` currently accepts `CSSObject` (a styled-components type). Migrate it to accept `React.CSSProperties` instead. This is source-compatible for most users since `CSSObject` is a superset of `CSSProperties` for standard properties — but document the change.

**CSS variable naming convention**

```
--rdt-color-text-primary
--rdt-color-text-secondary
--rdt-color-bg-default
--rdt-color-divider-default
--rdt-color-selected-default
--rdt-color-selected-text
--rdt-color-highlight-on-hover
--rdt-color-striped-default
--rdt-color-context-background
--rdt-color-context-text
--rdt-color-button-default
--rdt-color-button-hover
--rdt-color-button-disabled
--rdt-font-size
--rdt-cell-padding
```

### What to remove

- `styled-components` and `jest-styled-components` from all dependencies
- `src/DataTable/styles.ts` (styled-components style objects) — replace with CSS Modules
- `ThemeProvider` import and usage in `DataTable.tsx`
- The `CSSObject` type import everywhere — replace with `React.CSSProperties`
- `Cell.ts` (base styled cell) — replace with a `Cell.module.css`

### Files that change most

- `src/DataTable/themes.ts` — output CSS variable maps instead of SC theme objects
- `src/DataTable/DataTable.tsx` — remove ThemeProvider, apply theme as inline style vars
- Every `*.tsx` component — remove `styled.*` wrappers, use `styles.className` from CSS Modules
- `src/DataTable/types.ts` — change `CSSObject` → `React.CSSProperties` in `TableStyles`

---

## 2. Testing: Replace Jest + snapshots → Vitest + behavior tests

### Why

- Vitest is a drop-in Jest replacement that's ~10× faster with no config overhead
- Snapshot tests here test styled-components class name churn, not actual behavior
- Behavior tests survive refactors; snapshots break on every styling change

### Migration steps

1. Replace `jest`, `ts-jest`, `jest-styled-components`, `jest-environment-jsdom` with `vitest`, `@vitest/coverage-v8`, `jsdom`
2. Add a `vite.config.ts` (or `vitest.config.ts`) with `test: { environment: 'jsdom' }`
3. Delete all `.snap` files — they test the wrong thing
4. Rewrite snapshot tests as behavior tests (see examples below)

### Test writing rules

**Never use `toMatchSnapshot()`**. Test what users observe:

```ts
// Bad — tests DOM structure and class names
expect(container).toMatchSnapshot()

// Good — tests observable behavior
it('renders correct number of rows', () => {
  render(<DataTable data={mockData} columns={columns} />)
  expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1) // +1 for header
})

it('calls onSort with column and direction', async () => {
  const onSort = vi.fn()
  render(<DataTable data={mockData} columns={sortableColumns} onSort={onSort} />)
  await userEvent.click(screen.getByText('Name'))
  expect(onSort).toHaveBeenCalledWith(expect.objectContaining({ id: 'name' }), 'asc', mockData)
})

it('disables select checkbox when selectableRowDisabled returns true', () => {
  render(<DataTable ... selectableRowDisabled={row => row.locked} />)
  const checkboxes = screen.getAllByRole('checkbox')
  expect(checkboxes[1]).toBeDisabled()
})
```

**Coverage targets**: keep the 80% floor but focus on branch coverage of `tableReducer.ts` and `util.ts` — those are the high-value units.

**Test file co-location**: keep `__tests__/` next to source, no change needed.

### vitest.config.ts baseline

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
  },
})
```

---

## 3. Build: Replace 4 rollup configs → tsup

### Why

- Four separate rollup configs (`dev`, `cjs`, `es`, `umd`) for what is one library is arcane
- tsup (esbuild-based) handles ESM + CJS + type declarations in a single config file
- Build time drops from ~30s to ~2s
- CSS Modules are handled by tsup's built-in esbuild loader

### Zero CSS import — non-negotiable

Users must never need to write `import 'react-data-table-component/dist/index.css'`. That breaks the "working table in 10 lines" promise and is the most-complained-about part of AG Grid's setup. TanStack avoids CSS entirely by being headless; we keep the batteries-included UX by auto-injecting styles.

Use tsup's `injectStyle: true`. This bundles CSS Modules into the JS output and injects a `<style>` tag automatically when the component first renders — identical zero-import experience to styled-components, no peer dep required.

SSR caveat: injected `<style>` tags don't exist until JS runs, same as styled-components without explicit SSR setup. No regression from current behavior.

### tsup.config.ts baseline

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: true, // bundles CSS into JS, auto-injects <style> at runtime — no user CSS import needed
})
```

UMD is rarely needed for a React component library. Drop it unless a specific consumer requires it. If needed, add `format: ['esm', 'cjs', 'iife']`.

### package.json changes

```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 4. React patterns: what to keep and what to improve

### Keep as-is (already good)

- `tableReducer.ts` + `useTableState` — the reducer pattern is correct here; state transitions are complex enough to warrant it
- `useTableData`, `useColumns`, `useDidUpdateEffect`, `useWindowSize` — well-scoped hooks
- `TableProps<T>` generic interface — the external API is the right shape

### Improve

**Split `DataTable.tsx`** (~400 lines). It currently assembles everything inline. Extract:
- `<TableContainer>` — root element with theme vars + aria-label
- `<TableHeader>` already exists but the title/actions block in DataTable.tsx can move there fully
- `<TableFooter>` — pagination + row count

**Use `useId`** (React 18) for stable ARIA IDs instead of manual counters. Particularly for checkbox `id`/`aria-labelledby` pairs.

**Avoid prop drilling through 4+ levels**. The `DataTable` already passes ~20 props down to `TableRow` → `TableCell`. Consider a `RowContext` for per-row data (row, rowIndex, selected, expanded) so cells don't need every prop threaded through.

**`conditionalRowStyles`** — the current implementation recalculates styles inline on every render. Memoize per row with `useMemo` keyed on the row reference.

**Replace `clearSelectedRows` toggle with an imperative handle** (confirmed bug source — issues #1214, #1277). The boolean-flip pattern causes subtle bugs with server-side pagination and onSelectedRowsChange firing unexpectedly. Replace with `forwardRef` + `useImperativeHandle`:

```ts
export interface DataTableHandle {
  clearSelectedRows: () => void
}
const DataTable = forwardRef(<T>(..., ref: Ref<DataTableHandle>) => {
  useImperativeHandle(ref, () => ({
    clearSelectedRows: () => dispatch({ type: 'CLEAR_SELECTED_ROWS' })
  }))
})
// Usage: tableRef.current?.clearSelectedRows()
```

Keep the old `clearSelectedRows` prop but mark it `@deprecated` for one major version.

**Fix the discriminated union in `Action<T>`** — current action types are not narrowed per branch, so TypeScript can't validate action payloads inside the reducer. Convert to a proper discriminated union in `types.ts`.

**Memoize `TableRow` with `React.memo`** — with 500+ rows, any parent state change re-renders every row. TableRow is a pure function of its props and is a strong candidate for memoization.

**Use `useTransition` for sort dispatch** (React 18) — wrapping the sort dispatch in `startTransition` keeps the UI responsive during large re-renders and gives a free `isPending` flag for a subtle loading indicator.

### Do NOT change

- The `selector` / `cell` / `format` column API — widely used, breaking this hurts real users
- The `onSelectedRowsChange` callback signature
- The `paginationComponentOptions` shape
- The `expandableRowsComponent` render prop pattern

---

## 5. Known bugs to fix during refactor

These are confirmed open issues that the refactor naturally resolves or should explicitly address.

### Resolved by removing styled-components (immediate wins)

- **#1287, #1281, #1280** — Props (`grow`, `minWidth`, `maxWidth`, `align`, `right`, `allowOverflow`) leaking to DOM and generating console warnings. Root cause: styled-components v6 requires `shouldForwardProp` or `$`-prefixed transient props. Removing SC eliminates the entire problem class.
- **#1156, #1203, #1161, #1185** — `sortActive`, `center`, `button` boolean props on DOM elements. Same root cause.

### Selection / checkbox bugs to address explicitly

- **#1277** — `selectableRowSelected` + `onSelectedRowsChange` causes an infinite loop. Fix: the `useEffect` that calls `onSelectedRowsChange` should gate on a stable identity, not the `toggleOnSelectedRowsChange` boolean flag.
- **#1266, #1246** — Select-all checkbox disappears with `paginationServerOptions` / `persistSelectedOnPageChange`. Fix during selection state refactor.
- **#1214** — `onSelectedRowsChange` doesn't fire when `clearSelectedRows` is toggled. Fixed naturally by the `useImperativeHandle` migration.
- **#1175** — `selectableRowsSingle` removes checkboxes. Regression to confirm and fix in reducer.

### TypeScript improvements

- **#1249** — `selector` return type is `Primitive` but users need to return JSX. Add an overload or generalize the type to `Primitive | React.ReactNode` where `cell` is not provided.
- **#1255, #1240, #1210** — Types are hard to import. Ensure all public types are re-exported from `src/index.ts` so `import type { TableColumn } from 'react-data-table-component'` works without reaching into `dist/src/DataTable/types`.
- **`Checkbox.tsx:18`** — `component?: any` should be `React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>`.

### Accessibility

- Sort column headers have no `aria-sort` attribute. Add `aria-sort="ascending" | "descending" | "none"` to sortable `<th>` elements.
- The title `<div role="heading" aria-level={1}>` is incorrect usage. Use semantic HTML or remove the role — this is not a landmark heading.

---

## 6. Breaking changes and migration notes

| Change | Impact | Migration |
|--------|--------|-----------|
| styled-components no longer a peer dep | Users who styled via SC theme can use CSS variables instead | Provide a `v8-migration.md` |
| `customStyles` values change from `CSSObject` to `CSSProperties` | Breaks any `customStyles` using SC-specific `&:hover` pseudo-selectors | Document `conditionalRowStyles` as the alternative |
| No `ThemeProvider` export | Anyone wrapping with a custom SC ThemeProvider switches to CSS variables | |
| `clearSelectedRows` prop deprecated | Replaced by `ref.current.clearSelectedRows()` | Prop still works for one major version, logs a deprecation warning |
| `.snap` files deleted | CI snapshot tests need rewriting | They were testing SC internals, not behavior |

---

## 7. Competitive positioning

### Where this library sits

| | TanStack Table | AG Grid Community | **react-data-table-component** | AG Grid Enterprise |
| --- | --- | --- | --- | --- |
| Setup | High (headless) | Medium | **Low** | Medium |
| Styling required | Yes | No | **No** | No |
| Built-in pagination | DIY | ✅ | **✅** | ✅ |
| Built-in sorting | DIY | ✅ | **✅** | ✅ |
| Column filtering | DIY | ✅ | ❌ | ✅ |
| Virtual scrolling | DIY | ✅ | ❌ | ✅ |
| Column resizing | DIY | ✅ | ❌ | ✅ |
| CSV export | DIY | ❌ | ❌ | ✅ |
| Price | Free | Free | **Free** | $999/license |

**Core positioning**: "Working table in 10 lines. No boilerplate, no styling work, no $999 license."

TanStack is powerful but you're building the whole UI. AG Grid Community is feature-rich but switching costs are high and the free tier is limited. This library is the right answer for CRUD dashboards, admin panels, and data management UIs that need to ship fast.

### Feature gaps worth closing (in priority order based on issue demand)

1. **Column auto-sizing / fit-content** — most-commented open issue (#981, 11 comments + 15 related). Redesign column width logic to support `width: 'auto'` and `width: 'fit-content'` without DOM hacks.
2. **Column filtering** — multiple requests (#1177, #1231). Currently delegated to user via `subHeaderComponent`. A first-class column filter API would close the biggest gap vs. competitors.
3. **Column resizing** (drag handles) — #1165, #1244. Highly visible feature that screenshots well.
4. **Column visibility toggle** — #1209. Commonly needed in dashboards.
5. **CSV export** — commonly bundled with data tables, low implementation cost.

---

## 8. Monetization roadmap

Current state: ~$20/month OpenCollective donations. This doesn't scale because it asks for charity.

### Phase 1 — Fix the foundation (this refactor)

Removing styled-components and fixing the open bugs establishes credibility and reduces churn. A clean v8 with no console warnings and proper TypeScript re-exports is table stakes for any paid offering.

### Phase 2 — GitHub Sponsors with real tiers

Replace OpenCollective with GitHub Sponsors (better discovery, one less platform). Tiers with concrete value:

- **$5/month** — supporter badge, name in README
- **$49/month** — company logo in README + priority issue response (48h SLA)
- **$199/month** — logo on docs site + private support channel

At 2.5k stars with even 0.5% conversion at the $49 tier, that's ~12 sponsors = ~$600/month.

### Phase 3 — Pro package (biggest lever)

Publish `react-data-table-component-pro` as a separate npm package with advanced features. Keep core MIT. Unlock Excel-like features in Pro:

- Column filtering (first-class API, not subHeader workaround)
- Column resizing (drag handles)
- Column visibility manager
- Column pinning (freeze left/right)
- CSV / Excel export
- Virtual scrolling (100k+ rows via `@tanstack/virtual`)

Pricing: **$149 one-time per project** or **$19/month per developer**.

At 2.5k stars and 1% conversion on the one-time tier: 25 customers = $3,750. Realistic within 6 months of launch given existing organic traffic.

Positioning line for Pro: *"Not an Excel clone — unless you need it to be."*

### What NOT to do

- Don't gate core features (sorting, pagination, selection) behind a paywall — that kills adoption
- Don't build a SaaS dashboard or hosted service — the leverage isn't there yet
- Don't chase consulting — it doesn't scale

---

## 9. Suggested refactoring order

Work in this sequence to keep the library functional at each step:

1. **Build first** — migrate to tsup, confirm output is equivalent, no user-visible change
2. **Tests second** — set up Vitest, port behavioral tests, delete snapshots; now you have a safety net
3. **Bug fixes third** — fix the open selection bugs, TypeScript re-exports, and aria-sort; these are small and build confidence
4. **Styling last** — extract CSS Modules one component at a time, starting with leaf components (`Checkbox`, `Select`, `ExpanderButton`) before tackling `TableRow` and `TableCell`; remove styled-components as the final step

Do not attempt styling and testing migrations in the same PR — the blast radius is too large to review.

---

## 10. Out of scope for this refactor

- React Server Components support (requires deeper architectural changes)
- Pro tier features — design the extension points but don't implement the features yet

---

## 11. React version support policy

**Minimum: React 18. Target: 18 and 19.**

React 17 is dropped in v8. It predates concurrent features entirely and its userbase has had 3+ years to migrate.

React 18 (March 2022) is the new floor. It provides everything we want:

- `useId` — use for all ARIA ID generation (checkboxes, caption linkage). Replaces manual counters.
- `useTransition` — wrap sort dispatch so large re-renders are non-blocking. Exposes `isPending` for a subtle loading indicator.
- `useDeferredValue` — useful in future filter work to keep input responsive while the row list re-renders.
- Automatic batching — multiple `dispatch` calls in async handlers now batch automatically.

React 19 (Dec 2024) — support it but do not require it. Enterprise and agency projects that make up the library's user base lag on upgrades. Two React 19 patterns worth noting:

- `ref` as prop (no `forwardRef` needed) — when implementing the `DataTableHandle` imperative ref, use `forwardRef` with a comment noting it can be simplified under React 19.
- `use(Context)` — cleaner than `useContext` but not worth a dependency on 19.

**package.json peer dep:**

```json
"peerDependencies": {
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```
