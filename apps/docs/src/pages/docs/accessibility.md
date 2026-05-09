---
layout: '../../layouts/DocsLayout.astro'
title: 'Accessibility | react-data-table-component'
---

# Accessibility

`react-data-table-component` is built with keyboard and screen-reader users in mind. This page documents the ARIA semantics, keyboard interactions, and known considerations for each interactive region.

---

## Table structure

The outer table uses semantic `role="table"` with child `role="rowgroup"` and `role="row"` elements, giving screen readers a navigable grid structure.

| Element | Role / attribute |
| --- | --- |
| Table wrapper | `role="table"` |
| Header section | `role="rowgroup"` |
| Body section | `role="rowgroup"` |
| Header row | `role="row"` |
| Data row | `role="row"` |
| Data cell | `role="cell"` |

---

## Sorting

Sortable column headers expose `aria-sort` so screen readers announce the current sort direction.

| State | `aria-sort` value |
| --- | --- |
| Not sorted | `"none"` |
| Sorted A → Z / low → high | `"ascending"` |
| Sorted Z → A / high → low | `"descending"` |
| Column not sortable | attribute omitted |

**Keyboard**: sortable headers receive `tabIndex={0}`. Press **Enter** to toggle the sort direction. Non-sortable headers are removed from the tab order (`tabIndex={-1}`).

---

## Column filters

Each filterable column header contains a filter toggle button. The popup that opens is a `role="dialog"`.

### Filter toggle button

| Attribute | Value |
| --- | --- |
| `aria-label` | `"Filter active"` when a filter is applied, `"Filter column"` otherwise |
| `aria-pressed` | `true` while the popup is open, `false` when closed |

### Filter panel (popup)

| Attribute | Value |
| --- | --- |
| `role` | `"dialog"` |
| `aria-label` | `"Column filter"` |

**Keyboard interactions inside the panel:**

| Key | Action |
| --- | --- |
| **Escape** | Close the panel and return focus to the filter toggle button |
| **Tab / Shift+Tab** | Move between operator select, value inputs, and action buttons |

Focus moves automatically to the first focusable element (the operator `<select>`) when the panel opens.

### Inputs and controls

| Control | `aria-label` |
| --- | --- |
| Operator `<select>` | `"Filter operator"` |
| Primary value `<input>` | `"Filter value"` |
| Secondary value `<input>` (Between) | `"Filter second value"` |
| AND toggle button | `aria-pressed` reflects active state |
| OR toggle button | `aria-pressed` reflects active state |
| Add condition button | `"Add a second filter condition"` |
| Remove condition button | `"Remove condition"` |

---

## Row selection

Selectable rows render a checkbox per row. The select-all checkbox in the header checks or unchecks the visible page. Screen readers announce individual row checkboxes via the row's content.

---

## Expandable rows

The expand toggle is a button. Its `aria-label` describes the expand/collapse action. Expanded content is rendered inline beneath the row and is announced naturally as part of the document flow.

---

## Resize handles

Column resize handles are `aria-hidden="true"` — they are drag-only affordances with no keyboard equivalent, so they are hidden from the accessibility tree.

---

## Tips for consumers

- **Always provide `id` on filterable columns.** The filter state is keyed by `column.id`; omitting it silently disables filtering and breaks `aria-label` associations.
- **Use descriptive `name` values.** Column `name` is the visible label announced by screen readers for sortable headers and filter dialogs.
- **Avoid icon-only column names without labels.** If `column.name` is a React node (e.g. an icon), ensure it includes an accessible label (`aria-label` or `<span className="sr-only">`).
- **Test with a keyboard.** Tab through the header row, sort with Enter, open a filter panel with Enter or Space, navigate inputs with Tab, and close with Escape.
