import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import EnhancedTableHead from './EnhancedTableHead';
import requireAuth from '../components/requireAuth';
import {
  fetchApplicants,
  updateQuerySearch,
  updateQueryButton,
  updateQueryCheck,
} from '../actions/index';

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class ListApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'time',
      page: 0,
      rowsPerPage: 4,
    };
  }

  componentDidMount() {
    const { fetchApplicants: fetchApps, applications } = this.props;
    if (!applications) {
      fetchApps();
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    const { orderBy: orderByFromState, order: orderFromState } = this.state;
    if (orderByFromState === property && orderFromState === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

    handleChangePage = (event, page) => {
      this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: event.target.value });
    };

    renderApplications(filteredApps) {
      const { history: { push }, classes } = this.props;
      const {
        order,
        orderBy,
        rowsPerPage,
        page,
      } = this.state;
      return stableSort(filteredApps, getSorting(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((n) => {
          return (
            <TableRow classes={{ hover: classes.hover }} hover onClick={() => push(`/application/${n.uid}`)} key={n.uid}>
              <TableCell align="left" component="th" scope="row">
                {n.name}
              </TableCell>
              <TableCell align="right">{n.college}</TableCell>
              <TableCell align="right">{n.major}</TableCell>
              <TableCell align="right">{n.ethnicity}</TableCell>
              <TableCell align="right">{n.gender}</TableCell>
              <TableCell align="right">{`${n.time.toDate().toDateString()}, ${n.time.toDate().toLocaleTimeString()}`}</TableCell>
              <TableCell align="right">{n.status}</TableCell>
            </TableRow>
          );
        });
    }

    render() {
      const {
        applications,
        errorMessage,
        fetching,
        classes,
        updateQuerySearch: querySearch,
        updateQueryButton: queryColumn,
        updateQueryCheck: queryChecked,
        querySearchString,
        queryColumnString,
        queryCheckedBool,
      } = this.props;
      const {
        order,
        orderBy,
        rowsPerPage,
        page,
      } = this.state;

      if (fetching) {
        return (
          <div className="loadingSpinnerWrapper">
            <CircularProgress />
          </div>
        );
      }

      if (applications) {
        let filteredApplications = querySearchString
          ? applications.filter(
            x => x[queryColumnString].toLowerCase().includes(querySearchString.toLowerCase()),
          )
          : applications;
        if (!queryCheckedBool) {
          filteredApplications = querySearchString
            ? applications.filter(
              x => !x[queryColumnString].toLowerCase().includes(querySearchString.toLowerCase()),
            )
            : applications;
        }
        return (
          <div className="sides">
            <h1>Applications Data Loaded</h1>
            <TextField
              helperText="Query"
              onChange={event => querySearch(event.target.value)}
              value={querySearchString}
            />
            <InputLabel>Select a column</InputLabel>
            <Select
              value={queryColumnString}
              onChange={event => queryColumn(event.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="college">College</MenuItem>
              <MenuItem value="major">Major</MenuItem>
              <MenuItem value="ethnicity">Ethnicity</MenuItem>
              <MenuItem value="gender">Gender</MenuItem>
            </Select>
            <FormControlLabel
              control={(
                <Switch
                  checked={queryCheckedBool}
                  onChange={event => queryChecked(event.target.checked)}
                  value="queryCheckedBool"
                  color="primary"
                />
              )}
              label="Match Query"
            />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {this.renderApplications(filteredApplications)}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[2, 4, 8, 16, 32, 64, 128, 256]}
                component="div"
                count={filteredApplications.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        );
      }

      return (
        <div>
          <h1>Error</h1>
          <p>{errorMessage}</p>
        </div>
      );
    }
}

ListApplications.propTypes = {
  fetchApplicants: PropTypes.func.isRequired,
  applications: PropTypes.arrayOf(PropTypes.shape({})),
  history: PropTypes.shape().isRequired,
  classes: PropTypes.shape().isRequired,
  querySearchString: PropTypes.string.isRequired,
  queryColumnString: PropTypes.string.isRequired,
  queryCheckedBool: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  updateQuerySearch: PropTypes.func.isRequired,
  updateQueryButton: PropTypes.func.isRequired,
  updateQueryCheck: PropTypes.func.isRequired,
};

ListApplications.defaultProps = {
  applications: [],
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  hover: {
    cursor: 'pointer',
  },
});


function mapStateToProps(state) {
  return {
    applications: state.apps.data,
    errorMessage: state.apps.errorMessage,
    fetching: state.apps.fetching,
    querySearchString: state.queryValues.querySearch,
    queryColumnString: state.queryValues.queryColumn,
    queryCheckedBool: state.queryValues.queryChecked,
  };
}

export default
connect(mapStateToProps,
  {
    fetchApplicants,
    updateQuerySearch,
    updateQueryButton,
    updateQueryCheck,
  })(requireAuth((withStyles(styles)(ListApplications))));
