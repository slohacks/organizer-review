import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import requireAuth from '../components/requireAuth';
import Decision from '../components/statistics/Decision';

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
        <section>
          <div className="rowStyle">
            <Decision />
          </div>
        </section>
      </div>
    </div>
  );
};

export default requireAuth(Statistics);
