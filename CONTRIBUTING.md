# Contributing

Thanks for your interest in contributing. Please read this before opening a PR.

## What gets merged

This is a focused, stable library. The bar for new features is high — complexity must be justified by broad utility. Most things that feel like features are better solved with a documentation example.

PRs that get merged quickly:

- Bug fixes with a clear reproduction
- TypeScript or accessibility improvements
- Documentation or example improvements

PRs that get closed:

- No linked issue or description
- Adds niche features better handled in userland
- Breaks existing API without strong justification
- Fails CI (lint, typecheck, tests, build)

## Before you open a PR

1. **Open an issue first** for anything non-trivial. Alignment before code saves everyone time.
2. **Keep the scope small.** One concern per PR.
3. **Check CI passes** locally before pushing: `npm run lint && npm run typecheck && npm test && npm run build`

## Development setup

```bash
npm install
npm test          # run tests
npm run typecheck # check types
npm run lint      # check lint
npm run build     # build the library
```

## Code style

- TypeScript, no `any`
- Prettier + ESLint enforced — run `npm run format` if needed
- No new dependencies without discussion

## Questions

Usage questions belong in [Discussions](https://github.com/jbetancur/react-data-table-component/discussions) or the [docs](https://reactdatatable.com), not issues or PRs.
