import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import requireAuth from '../components/requireAuth';
import DecisionCard from '../components/statistics/DecisionCard';
import CountCard from '../components/statistics/CountCard';
import './Statistics.css';

class Statistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navAnchorEl: null,
    };

    this.handleNavClick = this.handleNavClick.bind(this);
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

  render() {
    const {
      navAnchorEl,
    } = this.state;

    const navOpen = Boolean(navAnchorEl);
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
          </Toolbar>
        </AppBar>
        <div className="sides">
          <section className="stats">
            <div className="rowStyle">
              <DecisionCard />
            </div>
            <div className="rowStyle">
              <CountCard applicationField="college" />
              <CountCard applicationField="major" />
              <CountCard applicationField="ethnicity" />
              <CountCard applicationField="gender" />
              <CountCard applicationField="diet" />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

Statistics.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default requireAuth(Statistics);
