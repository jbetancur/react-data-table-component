import React, {  useState } from 'react';
import doc from './controlled.mdx';
import data from '../../constants/sampleMovieData';
import Button from '../../shared/Button';
import DataTable from '../../../src/index';

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

const Flex = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    { children}
  </div>
);

export const Controlled = () => {
  const [page, setPage] = useState(1);
  const reset = () => setPage(1);

  return (
    <Flex>
      <Button onClick={reset}>Go to Page 1</Button>
      <DataTable
        title="Movie List"
        columns={columns}
        data={data}
        pagination
        paginationPage={page}
        onChangePage={setPage}
      />
    </Flex>
  );
}

export default {
	title: 'Pagination/Controlled',
	component: Controlled,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
