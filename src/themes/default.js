export default () => ({
	title: {
		fontSize: '22px',
		fontColor: 'rgba(0,0,0,.87)',
		backgroundColor: 'transparent',
		height: '56px',
	},
	header: {
		fontSize: '14px',
		fontWeight: 'normal',
		fontColor: 'rgba(0,0,0,.54)',
		fontColorActive: 'rgba(0,0,0,.87)',
		backgroundColor: 'transparent',
		height: '48px',
		borderTop: '1px solid #eee',
	},
	contextMenu: {
		backgroundColor: '#e3f2fd',
		fontSize: '18px',
		fontColor: 'rgba(0,0,0,.87)',
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
		height: 'auto',
		selectedRowBackgroundColor: '#ebf2fb',
		selectedRowColor: '#202020',
	},
	cells: {
		cellPadding: '48px',
	},
	expander: {
		fontColor: 'rgba(0,0,0,.87)',
		expanderColor: 'rgba(0,0,0,.54)',
		expanderColorDisabled: 'rgba(0,0,0,.12)',
		backgroundColor: 'transparent',
	},
	pagination: {
		fontSize: '13px',
		fontColor: 'rgba(0,0,0,.54)',
		backgroundColor: 'transparent',
		buttonFontColor: 'rgba(0,0,0,.54)',
		buttonHoverBackground: 'rgba(0,0,0,.12)',
	},
});
