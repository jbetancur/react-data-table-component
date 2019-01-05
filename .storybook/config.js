import { configure, addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import './base.css';

const req = require.context('../stories', true, /\.stories\.(js|jsx)$/);

function loadStories() {
  req.keys().forEach(filename => {
    req(filename);
  });
}

const optionsCallback = (options) => ({ panelExclude: [...options.panelExclude, /Warning/] });
addDecorator((storyFn, context) => withConsole(optionsCallback)(storyFn)(context));

configure(loadStories, module);
