import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends Component {
    createSortHandler = property => (event) => {
      const { onRequestSort } = this.props;
      onRequestSort(event, property);
    };

    renderTableHeadCells() {
      const tableHeads = ['name', 'college', 'major', 'ethnicity', 'gender', 'time', 'status'];
      const { order, orderBy } = this.props;
      return tableHeads.map((header) => {
        if (header === 'name') {
          return (
            <TableCell key={header} align="left" sortDirection={orderBy === header ? order : false}>
              <Tooltip title="sort" enterDelay={300}>
                <TableSortLabel
                  active={orderBy === header}
                  direction={order}
                  onClick={this.createSortHandler(header)}
                >
                  {header}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          );
        }
        return (
          <TableCell key={header} align="right" sortDirection={orderBy === header ? order : false}>
            <Tooltip title="Sort" enterDelay={300}>
              <TableSortLabel
                active={orderBy === header}
                direction={order}
                onClick={this.createSortHandler(header)}
              >
                {header}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        );
      });
    }

    render() {
      return (
        <TableHead>
          <TableRow>
            {this.renderTableHeadCells()}
          </TableRow>
        </TableHead>
      );
    }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default EnhancedTableHead;
