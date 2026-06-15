# react-data-table-component — Claude instructions

## Project layout

- `src/` — library source (TypeScript). Built with `tsup` → `dist/`.
- `apps/docs/` — Astro docs site served at reactdatatable.com. Imports the library directly from `src/` in dev via a Vite alias.
- `CHANGELOG.md` — single source of truth for release notes. Feeds both the docs changelog page and GitHub Release bodies.

## Commands

```sh
npm run lint          # eslint src/
npm run typecheck     # tsc --noEmit
npm test              # vitest run
npm run build         # tsup (library only)
npm run docs          # tsup --watch + astro dev (concurrent)
npm run docs:build    # astro build + pagefind index
```

Always run `npm run lint && npm run typecheck && npm test` before considering a change complete.

---

## Adding a new feature

1. Implement in `src/`. Export any new public types from `src/index.ts`.
2. Add or update unit tests — reducer logic in `src/__tests__/tableReducer.test.ts`, util functions in `src/__tests__/util.test.ts`, component behaviour in `src/__tests__/DataTable.test.tsx`.
3. Update the docs (see below).
4. Add a changelog entry (see below).

---

## Updating the docs

The docs live in `apps/docs/src/pages/docs/`. Each feature has its own `.astro` page.

**Structure of a docs page:**

- Start with a plain-language explanation of what the feature does and when to use it.
- Show a live demo via a `<Demo>` component wrapping a `.tsx` island in `apps/docs/src/components/demos/`.
- Follow with reference code blocks for common patterns.
- End with a prop reference table.

**Demo components** (`apps/docs/src/components/demos/`):

- Import `DataTable` from `../ThemedDataTable` (not directly from the library) so the demo respects the docs theme switcher.
- Keep demo data self-contained in the file.
- Show a live readout of relevant state (e.g. current sort, selected rows) so the demo is self-explanatory without running it.

**When adding a new prop or changing an existing one:**

- Update the prop reference table on the relevant docs page.
- Update the type signature in the API reference at `apps/docs/src/pages/docs/api.md`.

**Nav and routing:**

- Add new pages to the sidebar in `apps/docs/src/layouts/DocsLayout.astro`.
- If removing a page, add a `[[redirects]]` entry in `netlify.toml` pointing the old URL to its replacement.

---

## Updating CHANGELOG.md

`CHANGELOG.md` at the repo root is the single source of truth. Do not edit `apps/docs/src/pages/docs/changelog.astro` — it just renders the root file.

**Format for a new release section** (add above the previous release, before the `---` divider):

```markdown
## X.Y.Z

### New features

- **Feature name** — one-sentence description. → [Relevant docs](/docs/page)

### Behavior changes

- Description of anything that changes existing behaviour, and what consumers need to do.

### Bug fixes

- Description of what was broken and what changed.

### Deprecations

- `propName` — what to use instead.

---
```

Rules:

- One `## X.Y.Z` heading per release. The release workflow's `awk` extractor keys on this exact format — `##` followed by the bare version number, nothing else on the line.
- Keep entries terse — one bullet per item. Link to the relevant docs page where useful.
- Add the section **before** triggering the release workflow. The workflow reads it at release time; if the section is missing the GitHub Release body will be empty.

---

## Release process

Releases are triggered manually via the **Release** GitHub Actions workflow (`workflow_dispatch`). Before triggering:

1. Make sure `CHANGELOG.md` has a `## X.Y.Z` section for the new version (the version the bump will produce — patch/minor/major of the current `package.json` version).
2. Ensure all changes are committed and CI is green on master.
3. Go to **Actions → Release → Run workflow**, choose the bump type (patch / minor / major), and run.

The workflow will:

- Lint, typecheck, test, and build the library.
- Bump `package.json` version.
- Build the library dist.
- Publish to npm.
- Commit `package.json` + `CHANGELOG.md` and push a version tag to master.
- Extract the matching `## X.Y.Z` section from `CHANGELOG.md` and post it as the GitHub Release body.
- The master push triggers Netlify, which rebuilds and redeploys the docs automatically.

**Common mistake:** triggering the release before writing the changelog entry. The workflow does not write changelog entries — that is always a human (or AI-assisted) step done on master beforehand.
