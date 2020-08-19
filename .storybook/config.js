import { configure, addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withA11y } from '@storybook/addon-a11y';
import './base.css';

const req = require.context('../stories', true, /\.stories\.(js|jsx)$/);

function loadStories() {
  req.keys().sort().forEach(filename => {
    req(filename);
  });
}

const optionsCallback = (options) => ({ panelExclude: [...options.panelExclude, /Warning/] });

addDecorator(withA11y);

addDecorator((storyFn, context) => withConsole(optionsCallback)(storyFn)(context));

configure(loadStories, module);
