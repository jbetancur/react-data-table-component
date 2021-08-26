import "./base.css";

export const parameters = {
  // controls: { expanded: true },
  viewMode: 'docs',
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Getting Started', ['Introduction', 'Installation', 'Basic Examples', 'Kitchen Sink',  'Code of Conduct', 'Features & Issues', '*'], 'API', ['Columns', 'Properties'], 'Columns', 'Sorting', 'Selectable', 'Expandable', 'Pagination', 'Headers', 'Loading', '*', 'Performance', ['Optimization', '*'], 'Contributing'],
    },
  },
  a11y: {
    element: "#root",
    config: {},
    options: {},
    manual: true,
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
  },
};