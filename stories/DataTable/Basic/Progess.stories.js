
import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Director',
    selector: 'director',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
  },
];

const ProgressPendingDefault = () => {
  const [pending, setPending] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      setPending(false);
    }, 2000);
  }, []);

  return (
    <DataTable
      title="Movie List"
      columns={columns}
      data={data}
      progressPending={pending}
    />
  );
};

storiesOf('Progress Indicator', module)
  .add('Default', () => <ProgressPendingDefault />);
