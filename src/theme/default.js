import merge from 'lodash/merge';

export const palette = {
  light: {
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    background: {
      default: 'transparent',
      context: '#e3f2fd',
    },
    divider: {
      default: 'rgba(0,0,0,.12)',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
      striped: 'rgba(0,0,0,.03)',
    },
  },
  dark: {
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    background: {
      default: '#3C3C46',
      context: '#E91E63',
    },
    divider: {
      default: 'rgba(255, 255, 255, 0.12)',
    },
    action: {
      button: '#FFFFFF',
      hover: 'rgba(60, 60, 70, .87)',
      disabled: 'rgba(0,0,0,.12)',
      striped: 'rgba(60, 60, 70, 0.95)',
    },
  },
};

export default (theme = 'light', customTheme) => {
  const themeType = palette[theme] ? theme : 'light';

  return merge({
    header: {
      style: {
        fontSize: '22px',
        color: palette[themeType].text.primary,
        backgroundColor: palette[themeType].background.default,
        minHeight: '56px',
        padding: '4px 8px 4px 16px',
      },
    },
    subHeader: {
      style: {
        backgroundColor: palette[themeType].background.default,
        minHeight: '52px',
      },
    },
    head: {
      style: {},
    },
    headRow: {
      style: {
        backgroundColor: palette[themeType].background.default,
        minHeight: '56px',
        borderBottomWidth: '1px',
        borderBottomColor: palette[themeType].divider.default,
        borderBottomStyle: 'solid',
      },
      denseStyle: {
        minHeight: '32px',
      },
    },
    headCells: {
      style: {
        backgroundColor: palette[themeType].background.default,
        fontSize: '12px',
        fontWeight: 500,
        color: palette[themeType].text.primary,
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      activeStyle: {
        color: palette[themeType].text.primary,
      },
    },
    contextMenu: {
      style: {
        backgroundColor: palette[themeType].background.context,
        fontSize: '18px',
        fontWeight: 400,
        color: palette[themeType].text.primary,
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
        color: palette[themeType].text.primary,
        backgroundColor: palette[themeType].background.default,
        minHeight: '48px',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: palette[themeType].divider.default,
        },
      },
      denseStyle: {
        minHeight: '32px',
      },
      highlightOnHoverStyle: {
        color: palette[themeType].text.primary,
        backgroundColor: palette[themeType].action.hover,
        transitionDuration: '0.15s',
        transitionProperty: 'background-color',
      },
      stripedStyle: {
        '&:nth-child(odd)': {
          backgroundColor: palette[themeType].action.striped,
        },
      },
    },
    expanderRow: {
      style: {
        color: palette[themeType].text.primary,
        backgroundColor: palette[themeType].background.default,
      },
    },
    expanderButton: {
      style: {
        color: palette[themeType].action.button,
        '&:hover:enabled': {
          cursor: 'pointer',
        },
        '&:disabled': {
          color: palette[themeType].action.disabled,
        },
        svg: {
          paddingLeft: '4px',
          paddingRight: '4px',
        },
      },
    },
    pagination: {
      style: {
        color: palette[themeType].text.secondary,
        fontSize: '13px',
        minHeight: '56px',
        backgroundColor: palette[themeType].background.default,
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: palette[themeType].divider.default,
      },
      pageButtonsStyle: {
        transition: '0.4s',
        color: palette[themeType].action.button,
        fill: palette[themeType].action.button,
        '&:disabled': {
          opacity: '0.4',
          cursor: 'unset',
          color: palette[themeType].action.disabled,
        },
        '&:hover:not(:disabled)': {
          backgroundColor: palette[themeType].action.hover,
        },
      },
    },
    noData: {
      style: {
        color: palette[themeType].text.primary,
        backgroundColor: palette[themeType].background.default,
      },
    },
    progress: {
      style: {
        color: palette[themeType].text.primary,
        backgroundColor: palette[themeType].background.default,
      },
    },
  }, customTheme);
};
