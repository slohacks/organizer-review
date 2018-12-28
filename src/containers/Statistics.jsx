import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import requireAuth from '../components/requireAuth';
import Decision from '../components/statistics/Decision';
import Majors from '../components/statistics/Majors';
import Colleges from '../components/statistics/Colleges';
import Gender from '../components/statistics/Gender';
import Ethnicity from '../components/statistics/Ethnicity';
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
            <Colleges />
            <Majors />
            <Ethnicity />
            <Gender />
            <Decision />
          </div>
        </section>
      </div>
    </div>
  );
};

export default requireAuth(Statistics);
