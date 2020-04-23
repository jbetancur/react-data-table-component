import merge from 'deepmerge';

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
    button: {
      default: 'rgba(0,0,0,.54)',
      focus: 'rgba(0,0,0,.12)',
      hover: 'rgba(0,0,0,.12)',
      disabled: 'rgba(0, 0, 0, 0.54)',
    },
    sortFocus: {
      default: 'rgba(0, 0, 0, .54)',
    },
    selected: {
      default: '#e3f2fd',
      text: 'rgba(0, 0, 0, 0.87)',
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
    button: {
      default: '#FFFFFF',
      focus: 'rgba(255, 255, 255, .54)',
      hover: 'rgba(255, 255, 255, .12)',
      disabled: 'rgba(0,0,0,.12)',
    },
    sortFocus: {
      default: 'rgba(255, 255, 255, .54)',
    },
    selected: {
      default: 'rgba(0, 0, 0, .7)',
      text: '#FFFFFF',
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
  defaultThemes[name] = merge(defaultThemes.default, customTheme);

  return defaultThemes[name];
};
