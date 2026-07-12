// Single source of truth for Backer-tier ($20/mo) sponsors and above.
// Rendered on both /support and the homepage sponsors section.
// Add names here as they sign on — keep README.md's "## Backers" list in sync by hand.
export interface Backer {
  name: string;
  url?: string;
}

export const backers: Backer[] = [{ name: 'Rich Tillman', url: 'https://opencollective.com/rich-tillman' }];
