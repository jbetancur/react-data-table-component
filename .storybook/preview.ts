import "./base.css";

export const parameters = {
  // controls: { expanded: true },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Getting Started', ['Introduction', 'Installation', 'Basic Examples'], 'API', ['Columns', 'Properties'], '*', 'Performance', ['Optimization', '*'], 'Contributing'],
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