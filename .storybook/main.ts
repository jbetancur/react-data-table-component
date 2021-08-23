const prettierConfig = require('../.prettierrc.js');

module.exports = {
	stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
	addons: [
    {
      name: '@storybook/addon-storysource',
      options: {
        loaderOptions: {
          prettierConfig: prettierConfig,
          injectStoryParameters: false,
        },
      },
    },
    {
      name: '@storybook/addon-docs',
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
    {
      name: "@storybook/addon-essentials",
      options: {}
    },
    {
        name: "@storybook/addon-a11y",
        options: {
            runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa"]
            }
        }
    },
	],
};
