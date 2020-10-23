import { addDecorator } from "@storybook/react";
import { withConsole } from "@storybook/addon-console";
import "./base.css";

const optionsCallback = (options) => ({
  panelExclude: [...options.panelExclude, /Warning/],
});

addDecorator((storyFn, context) =>
  withConsole(optionsCallback)(storyFn)(context)
);

export const parameters = {
  a11y: {
    element: "#root",
    config: {},
    options: {},
    manual: true,
  },
};
