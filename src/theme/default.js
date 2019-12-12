import merge from 'lodash/merge';

const palette = {
  background: {
    light: 'transparent',
    dark: '#3C3C46',
  },
  border: {
    light: 'rgba(0,0,0,.12)',
    dark: 'rgba(255,255,255,.12)',
  },
  hover: {
    light: 'rgba(0,0,0,.08)',
    dark: 'rgba(60, 60, 70, .87)',
  },
  striped: {
    light: 'rgba(0,0,0,.03)',
    dark: '#666671',
  },
  contextMenu: {
    light: '#e3f2fd',
    dark: '#E91E63',
  },
  text: {
    light: 'rgba(0,0,0,.87)',
    dark: '#fff',
  },
  button: {
    light: 'rgba(0,0,0,.54)',
    dark: '#fff',
  },
  disabled: {
    light: 'rgba(0,0,0,.12)',
    dark: 'rgba(0,0,0,.12)',
  },
};

export default (theme = 'light', customTheme) => (
  merge({
    header: {
      style: {
        fontSize: '22px',
        color: palette.text[theme],
        backgroundColor: palette.background[theme],
        minHeight: '56px',
      },
    },
    subHeader: {
      style: {
        backgroundColor: palette.background[theme],
        minHeight: '52px',
      },
    },
    head: {
      style: {},
    },
    headRow: {
      style: {
        backgroundColor: palette.background[theme],
        minHeight: '56px',
        borderBottomWidth: '1px',
        borderBottomColor: palette.border[theme],
        borderBottomStyle: 'solid',
      },
      denseStyle: {
        minHeight: '32px',
      },
    },
    headCells: {
      style: {
        backgroundColor: palette.background[theme],
        fontSize: '12px',
        fontWeight: 500,
        color: palette.text[theme],
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      activeStyle: {
        color: palette.text[theme],
      },
    },
    contextMenu: {
      style: {
        backgroundColor: palette.contextMenu[theme],
        fontSize: '18px',
        fontWeight: 400,
        color: palette.text[theme],
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
        color: palette.text[theme],
        backgroundColor: palette.background[theme],
        minHeight: '48px',
        '&:not(:first-of-type)': {
          borderTopStyle: 'solid',
          borderTopWidth: '1px',
          borderTopColor: palette.border[theme],
        },
      },
      denseStyle: {
        minHeight: '32px',
      },
      highlightOnHoverStyle: {
        color: palette.text[theme],
        backgroundColor: palette.hover[theme],
        transitionDuration: '0.15s',
        transitionProperty: 'background-color',
      },
      stripedStyle: {
        '&:nth-child(odd)': {
          backgroundColor: palette.striped[theme],
        },
      },
    },
    expanderRow: {
      style: {
        color: palette.text[theme],
        backgroundColor: palette.background[theme],
      },
    },
    expanderButton: {
      style: {
        color: palette.text[theme],
        '&:hover:enabled': {
          cursor: 'pointer',
        },
        '&:disabled': {
          color: palette.disabled[theme],
        },
        svg: {
          color: palette.button[theme],
          paddingLeft: '4px',
          paddingRight: '4px',
        },
      },
    },
    pagination: {
      style: {
        color: palette.text[theme],
        fontSize: '13px',
        minHeight: '56px',
        backgroundColor: palette.background[theme],
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: palette.border[theme],
      },
      pageButtonsStyle: {
        transition: '0.4s',
        color: palette.text[theme],
        svg: {
          fill: palette.button[theme],
        },
        '&:disabled': {
          opacity: '0.4',
          cursor: 'unset',
        },
        '&:hover:not(:disabled)': {
          backgroundColor: palette.background[theme],
        },
      },
    },
    noData: {
      style: {
        color: palette.text[theme],
        backgroundColor: palette.background[theme],
      },
    },
    progress: {
      style: {
        color: palette.text[theme],
        backgroundColor: palette.background[theme],
      },
    },
  }, customTheme));
