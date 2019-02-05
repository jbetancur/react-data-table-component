export default () => ({
  title: {
    fontSize: '22px',
    fontColor: 'rgba(0,0,0,.87)',
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: '12px',
    fontColor: 'rgba(0,0,0,.54)',
    backgroundColor: 'transparent',
    height: '48px',
  },
  contextMenu: {
    backgroundColor: '#e3f2fd',
    fontSize: '18px',
    fontColor: 'rgba(0,0,0,.64)',
    transitionTime: '225ms',
  },
  rows: {
    // default || spaced
    spacing: 'default',
    fontSize: '13px',
    fontColor: 'rgba(0,0,0,.87)',
    backgroundColor: 'transparent',
    borderWidth: '1px',
    borderColor: 'rgba(0,0,0,.12)',
    stripedColor: 'rgba(0,0,0,.03)',
    hoverFontColor: 'rgba(0,0,0,.87)',
    hoverBackgroundColor: 'rgba(0,0,0,.08)',
    height: '48px',
  },
  cells: {
    cellPadding: '48px',
  },
  expander: {
    fontColor: 'rgba(0,0,0,.87)',
    backgroundColor: 'transparent',
    collapsedButton: 'data:image/svg+xml,%3Csvg%20fill%3D%22%23757575%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M8.59%2016.34l4.58-4.59-4.58-4.59L10%205.75l6%206-6%206z%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M0-.25h24v24H0z%22%20fill%3D%22none%22/%3E%0A%3C/svg%3E',
    expandedButton: 'data:image/svg+xml,%3Csvg%20fill%3D%22%23757575%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M7.41%207.84L12%2012.42l4.59-4.58L18%209.25l-6%206-6-6z%22/%3E%0A%20%20%20%20%3Cpath%20d%3D%22M0-.75h24v24H0z%22%20fill%3D%22none%22/%3E%0A%3C/svg%3E',
  },
  pagination: {
    fontSize: '13px',
    fontColor: 'rgba(0,0,0,.54)',
    backgroundColor: 'transparent',
    buttonFontColor: 'rgba(0,0,0,.54)',
    buttonHoverBackground: 'rgba(0,0,0,.12)',
  },
});
