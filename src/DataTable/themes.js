import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

export const defaultThemes = {
  default: {
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    background: {
      default: '#FFFFFF',
    },
    context: {
      background: '#e3f2fd',
      text: 'rgba(0, 0, 0, 0.87)',
    },
    divider: {
      default: 'rgba(0,0,0,.12)',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
    highlightOnHover: {
      default: '#EEEEEE',
      text: 'rgba(0, 0, 0, 0.87)',
    },
    striped: {
      default: '#FAFAFA',
      text: 'rgba(0, 0, 0, 0.87)',
    },
  },
  dark: {
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(0,0,0,.12)',
    },
    background: {
      default: '#424242',
    },
    context: {
      background: '#E91E63',
      text: '#FFFFFF',
    },
    divider: {
      default: 'rgba(81, 81, 81, 1)',
    },
    action: {
      button: '#FFFFFF',
      hover: 'rgba(255, 255, 255, .12)',
      disabled: 'rgba(0,0,0,.12)',
    },
    highlightOnHover: {
      default: 'rgba(0, 0, 0, .7)',
      text: '#FFFFFF',
    },
    striped: {
      default: 'rgba(0, 0, 0, .87)',
      text: '#FFFFFF',
    },
  },
};

export const createTheme = (name, customTheme = {}) => {
  defaultThemes[name] = merge(cloneDeep(defaultThemes.default), customTheme);

  return defaultThemes[name];
};
