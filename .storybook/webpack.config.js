module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.stories\.(jsx|js)?$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });
  
  return config;
}
