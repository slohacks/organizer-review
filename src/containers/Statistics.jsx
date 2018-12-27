import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import requireAuth from '../components/requireAuth';

class Statistics extends Component {
  getEthnicityNumbers = () => {
    const { applications } = this.props;
    const ethnicities = {};
    applications.forEach((app) => {
      if (!(app.ethnicity in ethnicities)) {
        ethnicities[app.ethnicity] = 1;
      } else {
        ethnicities[app.ethnicity] += 1;
      }
    });
    return ethnicities;
  }

  getGenderNumbers = () => {
    const { applications } = this.props;
    const genders = {};
    applications.forEach((app) => {
      if (!(app.gender in genders)) {
        genders[app.gender] = 1;
      } else {
        genders[app.gender] += 1;
      }
    });
    return genders;
  }

  getMajorsNumbers() {
    const { applications } = this.props;
    const majors = {};
    applications.forEach((app) => {
      if (!(app.major in majors)) {
        majors[app.major] = 1;
      } else {
        majors[app.major] += 1;
      }
    });
    return majors;
  }

  getCollegeNumbers() {
    const { applications } = this.props;
    const colleges = {};
    applications.forEach((app) => {
      if (!(app.college in colleges)) {
        colleges[app.college] = 1;
      } else {
        colleges[app.college] += 1;
      }
    });
    return colleges;
  }

  render() {
    const { applications } = this.props;
    if (applications) {
      return (
        <div>
          {console.log(this.getEthnicityNumbers())}
          {console.log(this.getGenderNumbers())}
          {console.log(this.getMajorsNumbers())}
          {console.log(this.getCollegeNumbers())}
          <h1>Hello World</h1>
        </div>
      );
    }
    return (
      <div>
        <h1>Error</h1>
        <h2>Something went wrong...</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    applications: state.apps.data,
    auth: state.auth.authenticated,
  };
}

Statistics.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape()),
};

Statistics.defaultProps = {
  applications: [],
};

export default connect(mapStateToProps, null)(requireAuth(Statistics));
