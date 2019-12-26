import merge from 'deepmerge';
import { defaultThemes } from './themes';

export const defaultStyles = theme => ({
  table: {
    style: {
      color: theme.text.primary,
      backgroundColor: theme.background.default,
    },
  },
  header: {
    style: {
      fontSize: '22px',
      color: theme.text.primary,
      backgroundColor: theme.background.default,
      minHeight: '56px',
      padding: '4px 8px 4px 16px',
    },
  },
  subHeader: {
    style: {
      backgroundColor: theme.background.default,
      minHeight: '52px',
    },
  },
  head: {
    style: {},
  },
  headRow: {
    style: {
      backgroundColor: theme.background.default,
      minHeight: '56px',
      borderBottomWidth: '1px',
      borderBottomColor: theme.divider.default,
      borderBottomStyle: 'solid',
    },
    denseStyle: {
      minHeight: '32px',
    },
  },
  headCells: {
    style: {
      fontSize: '12px',
      fontWeight: 500,
      color: theme.text.primary,
      paddingLeft: '16px',
      paddingRight: '16px',
    },
    activeStyle: {
      color: theme.text.primary,
    },
  },
  contextMenu: {
    style: {
      backgroundColor: theme.context.background,
      fontSize: '18px',
      fontWeight: 400,
      color: theme.context.text,
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
      color: theme.text.primary,
      backgroundColor: theme.background.default,
      minHeight: '48px',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: theme.divider.default,
      },
    },
    denseStyle: {
      minHeight: '32px',
    },
    highlightOnHoverStyle: {
      color: theme.highlightOnHover.text,
      backgroundColor: theme.highlightOnHover.default,
      transitionDuration: '0.15s',
      transitionProperty: 'background-color',
      '&:not(:last-of-type)': {
        borderBottomColor: theme.background.default,
        outlineStyle: 'solid',
        outlineWidth: '1px',
        outlineColor: theme.background.default,
      },
    },
    stripedStyle: {
      '&:nth-child(odd)': {
        color: theme.striped.text,
        backgroundColor: theme.striped.default,
      },
    },
  },
  expanderRow: {
    style: {
      color: theme.text.primary,
      backgroundColor: theme.background.default,
    },
  },
  expanderButton: {
    style: {
      color: theme.action.button,
      '&:hover:enabled': {
        cursor: 'pointer',
      },
      '&:disabled': {
        color: theme.action.disabled,
      },
      svg: {
        paddingLeft: '4px',
        paddingRight: '4px',
      },
    },
  },
  pagination: {
    style: {
      color: theme.text.secondary,
      fontSize: '13px',
      minHeight: '56px',
      backgroundColor: theme.background.default,
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: theme.divider.default,
    },
    pageButtonsStyle: {
      transition: '0.4s',
      color: theme.action.button,
      fill: theme.action.button,
      '&:disabled': {
        opacity: '0.4',
        cursor: 'unset',
        color: theme.action.disabled,
      },
      '&:hover:not(:disabled)': {
        backgroundColor: theme.action.hover,
      },
    },
  },
  noData: {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.text.primary,
      backgroundColor: theme.background.default,
    },
  },
  progress: {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.text.primary,
      backgroundColor: theme.background.default,
    },
  },
});

export const createStyles = (customStyles = {}, theme = 'default') => {
  const themeType = defaultThemes[theme] ? theme : 'default';

  return merge(defaultStyles(defaultThemes[themeType]), customStyles);
};
