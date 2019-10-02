import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getProperty } from './util';

const ExportGroupStyle = styled.div`
  position: relative;
  float: right;
`;

const ExportButtonStyle = styled.button`
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  padding-bottom: 0.3rem;
  font-size: 0.86rem;
  border-radius: 0.25rem;
  cursor: pointer;
  outline: none;

  ::after {
    display: inline-block;
    margin-left: 0.5em;
    vertical-align: 0.16em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

const ExportDropdownStyle = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  float: left;
  min-width: 5.6rem;
  padding: 0.2rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  display: ${props => (props.show ? 'block' : 'none')};
`;

const ExportDropdownItemSyle = styled.a`
  display: block;
  padding: 0.4rem 0.9rem 0.4em 2.4rem;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  border: 0;
  text-decoration: none;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzElEQVQ4T+3TP1JCMRDH8Q/jBajtvIUlJZ2tBwBrG/6UlCoU1HgBWzs6oOMWdtZcgIFZJk8zmfcEx9ZtNtns75vNJmn5o7XO6Mc44Lkp7yfACE9JGOOXOkgTYIgeNknUwQLTElIHGKCPED0kwStWCTLLISXgBu/o4hOTlBz+Gkvc4aOC1FVwhX0mjGEFytdOKeduIa+g9iL+Ad9NvMUj7otOtdN8V8TfMMe2amI8muh4+EtsnfLXOSDefVlBEywqiI/2BYgjRPA3Fpttj1+6JBGSfdGFAAAAAElFTkSuQmCC);
  background-position: 0.6rem 0.4em;
  background-repeat: no-repeat;

  :hover {
    background-color: #f1f1f1;
  }
`;

export class ExportTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
    };

    this.ExportHelper = {
      fileName: ext => (props.exportFileName ? `${props.exportFileName}.${ext}` : `${document.title}.${ext}`),
      download: (content, type, fileName) => {
        const file = new Blob(['\ufeff', content], { type });
        const link = document.createElement('a');

        link.id = `_export_datatable_${fileName}`;
        link.download = fileName;
        link.href = window.URL.createObjectURL(file);

        document.body.appendChild(link);

        link.click();
        document.getElementById(link.id).remove();
      },
    };

    this.ExportFile = {
      csv: (data, header) => {
        const contentHeader = (header ? `${header.map(e => e.name).join(';')}\n` : '');
        const content = `${contentHeader}${data.map(e => e.join(';')).join('\n')}`;

        this.ExportHelper.download(content, 'text/csv', this.ExportHelper.fileName('csv'));
      },
      excel: (data, header) => {
        const contentHeader = (header ? `<thead><tr><td>${header.map(e => e.name).join('</td><td>')}</td><tr></thead>` : '');
        const contentBody = data.map(e => `<tr><td>${e.join('</td><td>')}</td></tr>`);
        const table = `<table>${contentHeader}<tbody>${contentBody.join('')}</tbody></table>`;

        this.ExportHelper.download(table, 'application/vnd.ms-excel', this.ExportHelper.fileName('xls'));
      },
    };
  }

  onExport(e, type) {
    const exportHeaderData = [];
    const exportDataKeys = [];
    const exportData = [];

    const { columns, data, exportHeader } = this.props;

    // column properties and select fields to export
    columns.forEach(element => {
      if (element.export !== false) {
        exportHeaderData.push(element);
        exportDataKeys.push(element.selector);
      }
    });

    // get and render data
    data.forEach(element => {
      const row = [];
      exportDataKeys.forEach((key, index) => {
        const header = exportHeaderData[index];

        // cell: render component and get innerText
        if (header.cell) {
          const div = document.createElement('div');

          render(header.cell(element), div);

          row.push(div.innerText);
        } else { // get property
          row.push(getProperty(element, header.selector, header.format));
        }
      });

      exportData.push(row);
    });

    // download file
    this.ExportFile[type](exportData, (exportHeader ? exportHeaderData : null));

    this.setState({ dropdown: false });
    e.preventDefault();
  }

  render() {
    const { dropdown } = this.state;
    return (
      <ExportGroupStyle>
        <ExportButtonStyle type="button" onClick={() => this.setState(prevState => ({ dropdown: !prevState.dropdown }))}>Export Table</ExportButtonStyle>
        <ExportDropdownStyle show={dropdown}>
          <ExportDropdownItemSyle href="#csv" onClick={e => this.onExport(e, 'csv')}>Csv File</ExportDropdownItemSyle>
          <ExportDropdownItemSyle href="#excel" onClick={e => this.onExport(e, 'excel')}>Excel File</ExportDropdownItemSyle>
        </ExportDropdownStyle>
      </ExportGroupStyle>
    );
  }
}

ExportTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  exportHeader: PropTypes.bool,
  exportFileName: PropTypes.string,
};

ExportTable.defaultProps = {
  columns: [],
  data: [],
  exportHeader: false,
  exportFileName: null,
};
