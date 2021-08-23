import React from 'react';
import Button from '../shared/Button';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function convertArrayOfObjectsToCSV(array) {
	let result;

	const columnDelimiter = ',';
	const lineDelimiter = '\n';
	const keys = Object.keys(data[0]);

	result = '';
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	array.forEach(item => {
		let ctr = 0;
		keys.forEach(key => {
			if (ctr > 0) result += columnDelimiter;

			result += item[key];
			// eslint-disable-next-line no-plusplus
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function downloadCSV(array) {
	const link = document.createElement('a');
	let csv = convertArrayOfObjectsToCSV(array);
	if (csv == null) return;

	const filename = 'export.csv';

	if (!csv.match(/^data:text\/csv/i)) {
		csv = `data:text/csv;charset=utf-8,${csv}`;
	}

	link.setAttribute('href', encodeURI(csv));
	link.setAttribute('download', filename);
	link.click();
}

// eslint-disable-next-line react/prop-types
const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export</Button>;

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

export const ExportCSV = () => {
	const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);

	return <DataTable title="Movie List" columns={columns} data={data} actions={actionsMemo} />;
};

export default {
	title: 'Examples/Export CSV',
	component: ExportCSV,
};
