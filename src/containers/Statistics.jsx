import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import requireAuth from '../components/requireAuth';
import DecisionCard from '../components/statistics/DecisionCard';
import CountCard from '../components/statistics/CountCard';
import './Statistics.css';

const Statistics = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" component="h1" className="grow">
              Statistics
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="sides">
        <section className="stats">
          <div className="rowStyle">
            <CountCard applicationField="college" />
            <CountCard applicationField="major" />
            <CountCard applicationField="ethnicity" />
            <CountCard applicationField="gender" />
            <DecisionCard />
          </div>
        </section>
      </div>
    </div>
  );
};

export default requireAuth(Statistics);
