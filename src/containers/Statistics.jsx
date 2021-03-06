import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import ExitToApp from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import requireAuth from '../components/requireAuth';
import DecisionCard from '../components/statistics/DecisionCard';
import RSVPCard from '../components/statistics/RSVPCard';
import CountCard from '../components/statistics/CountCard';
import { fetchRSVP, signout } from '../actions/index';
import './Statistics.css';

class Statistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navAnchorEl: null,
    };

    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    const { fetchRSVP: fetchR, rsvps } = this.props;
    if (!rsvps) {
      fetchR();
    }
  }

  handleNav = (event) => {
    this.setState({ navAnchorEl: event.currentTarget });
  };

  handleNavClose = () => {
    this.setState({ navAnchorEl: null });
  };

  handleNavClick = (event) => {
    const { history: { push } } = this.props;
    push(`/${event.currentTarget.getAttribute('value')}/`);
    this.handleNavClose();
  }

  handleSignOut() {
    const { signout: signoutActionCreator } = this.props;
    signoutActionCreator();
  }

  render() {
    const {
      fetching,
      errorMessage,
      rsvps,
    } = this.props;
    const {
      navAnchorEl,
    } = this.state;

    const navOpen = Boolean(navAnchorEl);

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
                Loading Statistics
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="loadingSpinnerWrapper">
            <CircularProgress />
          </div>
        </div>
      );
    }

    if (rsvps) {
      return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Tooltip title="Navigation">
                <IconButton
                  aria-owns={navOpen ? 'appbar-nav' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleNav}
                  color="inherit"
                  className="leftButton"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="appbar-nav"
                anchorEl={navAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={navOpen}
                onClose={this.handleNavClose}
              >
                <MenuItem value="applications" onClick={event => this.handleNavClick(event)}>Applications</MenuItem>
                <MenuItem value="statistics" onClick={event => this.handleNavClick(event)}>Statistics</MenuItem>
              </Menu>
              <Typography variant="h6" color="inherit" component="h1" className="grow">
                  Statistics
              </Typography>
              <Tooltip title="Sign Out">
                <IconButton
                  onClick={this.handleSignOut}
                  color="inherit"
                >
                  <ExitToApp />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <div className="sides">
            <section className="stats">
              <div className="rowStyle">
                <DecisionCard />
              </div>
              <div className="rowStyle">
                <RSVPCard />
              </div>
              <div className="rowStyle">
                <CountCard applicationField="college" />
                <CountCard applicationField="major" />
                <CountCard applicationField="ethnicity" />
                <CountCard applicationField="gender" />
                <CountCard
                  displayName="dietary preference"
                  applicationField="diet"
                />
                <CountCard
                  displayName="allergy"
                  applicationField="allergies"
                />
              </div>
            </section>
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
              Statistics Error
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

Statistics.propTypes = {
  history: PropTypes.shape().isRequired,
  signout: PropTypes.func.isRequired,
  fetchRSVP: PropTypes.func.isRequired,
  rsvps: PropTypes.arrayOf(PropTypes.shape({})),
  fetching: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
};


Statistics.defaultProps = {
  rsvps: [],
};

function mapStateToProps(state) {
  return {
    rsvps: state.rsvp.data,
    errorMessage: state.rsvp.errorMessage,
    fetching: state.rsvp.fetching,
  };
}

export default connect(
  mapStateToProps,
  { signout, fetchRSVP },
)(requireAuth(Statistics));
