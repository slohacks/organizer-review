import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { fetchApplications } from '../actions/index';
import './Application.css';

class Application extends Component {
  componentDidMount() {
    const {
      fetchApplications: fetchApps,
      match: { params: { uid } },
    } = this.props;

    fetchApps(uid);
  }

  render() {
    const { appData, errorMessage, fetching } = this.props;

    if (fetching) {
      return (
        <div>
          <CircularProgress />
        </div>
      );
    }

    if (appData) {
      return (
        <div>
          <h1>{appData.name}</h1>
          <section>
            <h2>Personal Info</h2>
            <div clasName="rowstyle">
              <Card className="cardStyle">
                <CardContent>
                  <h3>Demographics</h3>
                  <p>
                    Graduation Date:
                    {` ${appData.grad_date}`}
                  </p>
                  <p>
                    Gender:
                    {` ${appData.gender ? appData.gender : appData.other_gender}`}
                  </p>
                  <p>
                    Ethnicity:
                    {` ${appData.ethnicity ? appData.ethnicity : appData.other_ethnicity}`}
                  </p>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3>Travel</h3>
                  <p>
                    College:
                    {` ${appData.college}`}
                  </p>
                  <p>
                    City:
                    {` ${appData.city}`}
                  </p>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3>Contact</h3>
                  <p>
                    Email:
                    {` ${appData.email}`}
                  </p>
                  <p>
                    Phone:
                    {` ${appData.phone}`}
                  </p>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3>Food</h3>
                  <p>
                    Diet:
                    {` ${appData.diet}`}
                  </p>
                  <p>
                    Allergies:
                    {` ${appData.allergies}`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          <h2>Experience</h2>
          <div className="rowStyle">
            <Card className="cardStyle">
              <CardContent>
                <h3>Resume</h3>
                <p>
                  Resume:
                  {` ${appData.resume}`}
                </p>
              </CardContent>
            </Card>
            <Card className="cardStyle">
              <CardContent>
                <h3>Sites</h3>
                <p>
                  GitHub:
                  {` ${appData.github}`}
                </p>
                <p>
                  LinkedIn:
                  {` ${appData.linkedin}`}
                </p>
                <p>
                  Personal Website:
                  {` ${appData.website}`}
                </p>
              </CardContent>
            </Card>
          </div>
          <h2>Short Answer</h2>
          <div className="rowStyle">
            <Card calssName="cardStyle">
              <CardContent>
                <h3>Challenge</h3>
                <p>
                  Challenge:
                  {` ${appData.challenge}`}
                </p>
              </CardContent>
            </Card>
            <Card className="cardStyle">
              <CardContent>
                <h3>Project</h3>
                <p>
                  Project:
                  {` ${appData.project}`}
                </p>
              </CardContent>
            </Card>
          </div>
          <h2>Misc</h2>
          <div className="rowStyle">
            <Card className="cardStyle">
              <CardContent>
                <h3>Misc</h3>
                <p>
                  Anything else:
                  {` ${appData.misc}`}
                </p>
              </CardContent>
            </Card>
          </div>
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

function mapStateToProps(state) {
  return {
    appData: state.app.data,
    errorMessage: state.app.errorMessage,
    fetching: state.app.fetching,
  };
}

Application.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  fetchApplications: PropTypes.func.isRequired,
  appData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  errorMessage: PropTypes.string,
  fetching: PropTypes.bool.isRequired,
};

Application.defaultProps = {
  errorMessage: null,
  appData: null,
};

export default connect(mapStateToProps, { fetchApplications })(Application);
