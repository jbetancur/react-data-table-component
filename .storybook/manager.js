import { create } from '@storybook/theming';
import { addons } from '@storybook/addons';

addons.setConfig({
	isFullscreen: false,
	showAddonsPanel: true,
	panelPosition: 'bottom',
	theme: create({
		base: 'light',
		brandTitle: 'React Data Table Component',
		brandUrl: 'https://github.com/jbetancur/react-data-table-component',
		gridCellSize: 12,
	}),
});
