import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ToggleOff from '@material-ui/icons/ToggleOff';
import ToggleOn from '@material-ui/icons/ToggleOn';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/icons/List';
import Menu from '@material-ui/core/Menu';
import EnhancedTableHead from './EnhancedTableHead';
import requireAuth from '../components/requireAuth';
import {
  fetchApplicants,
  updateQuerySearch,
  updateQueryButton,
  updateQueryCheck,
} from '../actions/index';
import './ListApplications.css';

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
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
    marginRight: 24,
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

const matchIconButton = queryChecked => (
  <Tooltip title="Match filter">
    <IconButton
      aria-label="Toggle filter"
      onClick={() => queryChecked(false)}
      color="inherit"
    >
      <ToggleOn />
    </IconButton>
  </Tooltip>
);

const notMatchIconButton = queryChecked => (
  <Tooltip title="Exclude filter">
    <IconButton
      aria-label="Toggle filter"
      onClick={() => queryChecked(true)}
      color="inherit"
    >
      <ToggleOff />
    </IconButton>
  </Tooltip>
);

class ListApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'time',
      page: 0,
      rowsPerPage: 4,
      anchorEl: null,
    };
    this.queryCheckedFalse = this.queryCheckedFalse.bind(this);
    this.queryCheckedTrue = this.queryCheckedTrue.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidMount() {
    const { fetchApplicants: fetchApps, applications } = this.props;
    if (!applications) {
      fetchApps();
    }
  }

  parseAppStatus = (status) => {
    if (!status) return 'Undecided';

    const statusEnum = ['Undecided', 'Accepted', 'Waitlisted', 'Rejected'];
    return statusEnum[status];
  };

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

    handleMenu = (event) => {
      this.setState({ anchorEl: event.currentTarget });
    };

    handleCloseMenu = () => {
      this.setState({ anchorEl: null });
    };

    handleMenuClick = (event) => {
      const { updateQueryButton: queryColumn } = this.props;
      queryColumn(event.target.getAttribute('value'));
      this.setState({ anchorEl: null });
    }

    queryCheckedTrue() {
      const { updateQueryCheck: queryChecked } = this.props;
      queryChecked(true);
    }

    queryCheckedFalse() {
      const { updateQueryCheck: queryChecked } = this.props;
      queryChecked(false);
    }

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
              <TableCell align="right">{this.parseAppStatus(n.status)}</TableCell>
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
        querySearchString,
        queryColumnString,
        queryCheckedBool,
      } = this.props;
      const {
        order,
        orderBy,
        rowsPerPage,
        page,
        anchorEl,
      } = this.state;

      const menuOpen = Boolean(anchorEl);

      if (fetching) {
        return (
          <div className="appBarPageWrapper">
            <AppBar position="static">
              <Toolbar>
                <Typography
                  variant="h6"
                  color="inherit"
                  component="h1"
                  className="grow"
                  noWrap
                >
                  Loading Applications
                </Typography>
              </Toolbar>
            </AppBar>
            <div className="loadingSpinnerWrapper">
              <CircularProgress />
            </div>
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
          <div>
            <AppBar position="static">
              <Toolbar>
                <Typography
                  variant="h6"
                  color="inherit"
                  component="h1"
                  className={classes.title}
                >
                  Applications
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder={`Filter ${queryColumnString}…`}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange={event => querySearch(event.target.value)}
                    value={querySearchString}
                  />
                </div>
                <div>
                  <Tooltip title="Choose column">
                    <IconButton
                      aria-owns={menuOpen ? 'menu-appbar' : undefined}
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <List />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={menuOpen}
                    onClose={this.handleCloseMenu}
                  >
                    <MenuItem value="name" onClick={event => this.handleMenuClick(event)}>Name</MenuItem>
                    <MenuItem value="college" onClick={event => this.handleMenuClick(event)}>College</MenuItem>
                    <MenuItem value="major" onClick={event => this.handleMenuClick(event)}>Major</MenuItem>
                    <MenuItem value="ethnicity" onClick={event => this.handleMenuClick(event)}>Ethnicity</MenuItem>
                    <MenuItem value="gender" onClick={event => this.handleMenuClick(event)}>Gender</MenuItem>
                  </Menu>
                </div>
                {queryCheckedBool
                  ? matchIconButton(this.queryCheckedFalse)
                  : notMatchIconButton(this.queryCheckedTrue)}
              </Toolbar>
            </AppBar>
            <div className="sidesTable">
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
          </div>
        );
      }

      return (
        <div className="appBarPageWrapper">
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                color="inherit"
                component="h1"
                className="grow"
              >
                Applications Error
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="sides">
            <h1>Error</h1>
            <p>{errorMessage}</p>
          </div>
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
