import merge from 'lodash/merge';

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
      default: 'rgba(0,0,0,.08)',
      text: 'rgba(0, 0, 0, 0.87)',
    },
    striped: {
      default: 'rgba(0, 0, 0, .87)',
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
  defaultThemes[name] = merge(JSON.parse(JSON.stringify(defaultThemes.default)), customTheme);
};

export const generateStyles = (customStyles = {}, theme = 'default') => {
  const p = JSON.parse(JSON.stringify(defaultThemes));
  const themeType = p[theme] ? theme : 'default';

  return merge({
    header: {
      style: {
        fontSize: '22px',
        color: p[themeType].text.primary,
        backgroundColor: p[themeType].background.default,
        minHeight: '56px',
        padding: '4px 8px 4px 16px',
      },
    },
    subHeader: {
      style: {
        backgroundColor: p[themeType].background.default,
        minHeight: '52px',
      },
    },
    head: {
      style: {},
    },
    headRow: {
      style: {
        backgroundColor: p[themeType].background.default,
        minHeight: '56px',
        borderBottomWidth: '1px',
        borderBottomColor: p[themeType].divider.default,
        borderBottomStyle: 'solid',
      },
      denseStyle: {
        minHeight: '32px',
      },
    },
    headCells: {
      style: {
        backgroundColor: p[themeType].background.default,
        fontSize: '12px',
        fontWeight: 500,
        color: p[themeType].text.primary,
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      activeStyle: {
        color: p[themeType].text.primary,
      },
    },
    contextMenu: {
      style: {
        backgroundColor: p[themeType].context.background,
        fontSize: '18px',
        fontWeight: 400,
        color: p[themeType].context.text,
        padding: '16px 16px 16px 24px',
        transform: 'translate3d(0, -100%, 0)',
        transitionDuration: '225ms',
        transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        willChange: 'transform',
      },
      activeStyle: {
        transform: 'translate3d(0, 0, 0)',
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    rows: {
      style: {
        fontSize: '13px',
        color: p[themeType].text.primary,
        backgroundColor: p[themeType].background.default,
        minHeight: '48px',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: p[themeType].divider.default,
        },
      },
      denseStyle: {
        minHeight: '32px',
      },
      highlightOnHoverStyle: {
        color: p[themeType].highlightOnHover.text,
        backgroundColor: p[themeType].highlightOnHover.default,
        transitionDuration: '0.15s',
        transitionProperty: 'background-color',
        '&:not(:last-of-type)': {
          borderBottomColor: p[themeType].background.default,
          outlineStyle: 'solid',
          outlineWidth: '1px',
          outlineColor: p[themeType].background.default,
        },
      },
      stripedStyle: {
        '&:nth-child(odd)': {
          color: p[themeType].striped.text,
          backgroundColor: p[themeType].striped.default,
        },
      },
    },
    expanderRow: {
      style: {
        color: p[themeType].text.primary,
        backgroundColor: p[themeType].background.default,
      },
    },
    expanderButton: {
      style: {
        color: p[themeType].action.button,
        '&:hover:enabled': {
          cursor: 'pointer',
        },
        '&:disabled': {
          color: p[themeType].action.disabled,
        },
        svg: {
          paddingLeft: '4px',
          paddingRight: '4px',
        },
      },
    },
    pagination: {
      style: {
        color: p[themeType].text.secondary,
        fontSize: '13px',
        minHeight: '56px',
        backgroundColor: p[themeType].background.default,
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: p[themeType].divider.default,
      },
      pageButtonsStyle: {
        transition: '0.4s',
        color: p[themeType].action.button,
        fill: p[themeType].action.button,
        '&:disabled': {
          opacity: '0.4',
          cursor: 'unset',
          color: p[themeType].action.disabled,
        },
        '&:hover:not(:disabled)': {
          backgroundColor: p[themeType].action.hover,
        },
      },
    },
    noData: {
      style: {
        color: p[themeType].text.primary,
        backgroundColor: p[themeType].background.default,
      },
    },
    progress: {
      style: {
        color: p[themeType].text.primary,
        backgroundColor: p[themeType].background.default,
      },
    },
  }, customStyles);
};
