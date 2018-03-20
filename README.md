[![Build Status](https://travis-ci.org/jbetancur/react-data-table-component.svg?branch=master)](https://travis-ci.org/jbetancur/react-data-table-component)

[React Data Table Component Demo](https://jbetancur.github.io/react-data-table-component)

# React Data Table Component

Why the long name? Well, there are A LOT of React table libraries out there! Creating yet another React table library came out of nescessity while developing a production application for a busy startup. I discovered that while there are great table libraries available, most required heavy customization, feature bloated/slow (I didn't need an Excel clone), lacked features, were "too" opinionated in their styling (overriding css and/or forced to use their flavor of ui library) or required a commercial license.

If you want to achieve balance with the force and want a simple, sortable, flexible table library, give React Data Table Component a shot. If you want an Excel clone, need to pivot large data sets or want to infinitely scroll millions of rows, then this is not the React table library you are looking for 👋
  
React Data Table Component is still under **Development**, but here are the initial features available:

* Declarative Configuration
* Sortable (client)
* Selectable Rows
* Expandable Rows
* Themeable via js config
* Data Aware (i.e. easily callback to a parent component get the DataTable state, e.g. `selectedRows`
* Responsive (via x-scroll)

## Roadmap
* Sortable (server)
* Pagination (client/server)
* Search (client/server)
* Fixed Headers
* Built in themes (Material, Boostrap)
* Mobile Responsive
* Accessibility

## API
### Data
`data` just needs to be an array of object data....

### Columns
Nothing new here - we are using an array of object literals and properties to describle the columns:

| Property | Type   | Required | Example                                                                                                       |
|----------|--------|----------|---------------------------------------------------------------------------------------------------------------|
| name     | string | no       | the display name of our Column e.g. 'Name'                                                                    |
| selector | string | yes      | the propery in the data set e.g.  `property1.nested1.nested2`                                                 |
| sortable | bool   | no       | if the column is sortable                                                                                    |
| number   | bool   | no       | if the field is a number: applies `text-align: right`                                                                |
| center   | bool   | no       | if the field should be centered: applies `text-align: center`                                                               |
| compact  | bool   | no       | removes any padding in the cell. useful for custom cells icons or buttons                                                 |
| format   | func   | no       | format the selector e.g. `row => moment(row.timestamp).format('lll')`                                         |
| cell     | func   | no       | for ultimate control use `cell` to render your own custom component! e.g `row => <h2>{row.title}</h2>`  **Negates  `format`** |


### DataTable Properties
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title | string or component | no |  | The Title displayed in the Table Header |
| columns | array<Columns> | yes | [] | The column configuration |
| data | array<Object> | no | [] | Table Data |
| keyField | string | no | 'id' | Your data should have a unique identifier. By default, React Data Table looks for an `id` property for each item in your data. You must match `keyField` to your identifier key, especially if you want to manage row state at a later time. If a unique `id` is not present, React Data Table will use the row index (not recommended) as the key value |
| progressPending | bool | no |  | Disables the table and displays a plain text Loading Indicator |
| progressComponent | component | no |  | allows you to use your own custom progress component |
| progressCentered | bool | no |  | absolutely position and center the progress over the table |
| selectableRows | bool | no | false | Whether to show selectable checkboxes |
| selectableRowsComponent | func | no |  | Override the default checkbox component - must be passed as a function (e.g. `Checkbox` not `<Checkbox />`) |
| selectableRowsComponentProps | object | no |  | Additional props you want to pass to `selectableRowsComponent` |
| expandableRows | bool | no | false | Whether to make a row expandable, if true it requires an `expandableRowsComponent` |
| expandableRowsComponent | string or component | no |  | A custom component to display in the expanded row. It will have the `data` prop composed  so that you may access the row data |
| noDataComponent | string or component | no |  | A custom component to display when there are no records to display
| sortIcon | component | no |  | Override the default sort icon - the icon must be a font or svg icon and it should be a "downward" icon  |
| striped | bool | no | false | stripe color the odd rows |
| highlightOnHover | bool | no | false | if rows are highlighted on hover |
| contextTitle | string | no |  | override the context menu title |
| contextActions | array of components | no |  | add context action as an array of components |
| onTableUpdate | func | no |  | callback to access the entire Data Table state ({ allSelected, selectedCount, selectedRows, sortColumn, sortDirection, rows, columns }) |
| clearSelectedRows | bool | no | false | set to true to trigger all rows to deselect - you can use this together with `onTableUpdate` manage the table state |
| defaultSortField | string | no |  | Setting this ensures the table data is presorted before it renders and the field(selector) is focused |
| defaultSortAsc | bool | no | true  | set this to false if you want the table data to be sorted in DESC order |
| className | string | no |  | override the className on the Table wrapper |
| style | object | no |  | override the style on the Table wrapper |
| overflowY | bool | no | false | if a table is responsive, items such as layovers and menus will be clipped on the last row(s) due to to [overflow-x-y behavior](https://www.brunildo.org/test/Overflowxy2.html) - setting this value ensures there is invisible space below the table to prevent "clipping". **The table parent element must have a fixed `height` or `height: 100%` for this to work** |
| overflowYOffset | string | no | 250px | used with overflowY to "fine tune" the offset |
| responsive | bool | no | true | makes the table horizontally scrollable on smaller screen widths |
| customTheme | object | no |  | Override the [default theme](https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/defaultTheme.js), by overriding specifc props. Your changes will be merged. [See Theming](#theming) for more information |

## Basic Table
The following declarative structure creates a sortable table of Arnold movie titles:

```
import DataTable from 'react-data-table-component`;

const data = [{ title: 'Conan the Barbarian', year: '1982' } ...];
const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    number: true,
  },
];

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
  />
);

```

## Selectable Rows
Let's make our rows selectable so we can access the selected results

```
...

const handleChange = (state) => {
  // You can use setState or dispatch with something like Redux so we can use the retrieved data
  console.log('Selected Rows: ', state.selectedRows);
};

...

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    selectableRows // add for checkbox selection
    onTableUpdate={handleChange}
  />
);
```

### Overriding with a 3rd Party Ui Component Library
You don't like those ugly html checkboxes? Let's override them with some [react-md](https://react-md.mlaursen.com) sexyiness. While we are at it we will also override the `sortIcon`

```
...
import { Checkbox, FontIcon } from 'react-md';
...

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    selectableRows
    selectableRowsComponent={Checkbox} // Pass the function only
    selectableRowsComponentProps={{ inkDisabled: true }} // optionally, pass some props to our react-md checkbox
    sortIcon={<FontIcon>arrow_downward</FontIcon>} // use a material icon for our sort icon
    onTableUpdate={handleChange}
  />
);
```

## Custom Cells
Let's give our Movie list a summary, but in the same cell as `Name`:
```
....

const data = [{ title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: bold }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    number: true,
  },
];

...

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    selectableRows
    selectableRowsComponent={Checkbox}
    selectableRowsComponentProps={{ inkDisabled: true }}
    sortIcon={<FontIcon>arrow_downward</FontIcon>}
    onTableUpdate={handleChange}
  />
);

```


## Expandable Rows
Let's make our rows expandable so we can view more details:
```
...

const data = [{ title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982', image: 'http://conan.image.png' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: 700 }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    number: true,
  },
];

...

// The row data is composed into your custom expandable component via the data prop
const ExpanableComponent = ({ data }) => <img src={data.image} />;

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    selectableRows
    selectableRowsComponent={Checkbox}
    selectableRowsComponentProps={{ inkDisabled: true }}
    sortIcon={<FontIcon>arrow_downward</FontIcon>}
    onTableUpdate={handleChange} 
    expandableRows
    expandableRowsComponent={<ExpanableComponent />}
  />
);

```

## Theming
Under Development

The curent default Theme is very "material". Near term plans are to have 3 built-in prop selectable themes (none, bootstrap, material).

You can override or replace the current theme using the `customTheme` prop

For Example:

```
// Override the row default height
const mySweetTheme = {
  rows: {
    height: '64px'
  }
}

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    customTheme={mySweetTheme}
  />
);
```

Refer to [Default Theme](https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/defaultTheme.js) for reference




### Theme Resources
* [SVG Encoder](https://codepen.io/yoksel/details/JDqvs)


# Development

## Setup

Install the latest [Node JS LTS](https://nodejs.org/) and [Yarn](https://yarnpkg.com) and simply run ```yarn``` or ```yarn install``` command in the root and stories directory.

## Installing Flow Types

Install flowtypes using the package script:
```sh
yarn flow-typed
```

> It is advised to run the script whenever NPM packages are installed.

## Local development

During development,
```sh
# watch and build new source changes
yarn start
# or serve *.stories.js files and manually test on the Storyboard app
yarn storyboard
```

## Including NPM packages

This project uses two package.json structure.

### Library dependencies -- <root_dir>/package.json

```sh
yarn add [package-name] --dev # for dev tools
yarn add [package-name] # for app
```

### Storybook dependencies -- <root_dir>/stories/package.json

```sh
cd stories/
yarn add [package-name]
```

## Static Types

```sh
yarn flow # performs type checking on files
```

## Lint

```sh
yarn lint # runs linter to detect any style issues (css & js)
yarn lint:css # lint only css
yarn lint:js # lint only js
yarn lint:js --fix # tries to fix js lint issues
```

## Test

```sh
yarn test # runs functional/unit tests using Jest
yarn test --coverage # with coverage
```

## Build

```sh
yarn build # builds sources at src/
```
