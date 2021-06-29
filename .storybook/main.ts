module.exports = {
	stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
	typescript: {
    reactDocgen: 'none',
  },
	addons: [
		'@storybook/addon-actions',
		'@storybook/addon-storysource',
		'@storybook/addon-links',
		'@storybook/addon-a11y',
	],
};
