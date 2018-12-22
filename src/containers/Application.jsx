import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
            <div className="rowStyle">
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Demographics</h3>
                  <List>
                    <ListItem>
                      <ListItemText primary="Graduation Date" secondary={appData.grad_date} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Gender" secondary={appData.gender ? appData.gender : appData.other_gender} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ethnicity" secondary={appData.ethnicity ? appData.ethnicity : appData.other_ethnicity} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Travel</h3>
                  <List>
                    <ListItem>
                      <ListItemText primary="College" secondary={appData.college} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="City" secondary={appData.city} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Contact</h3>
                  <List>
                    <ListItem button component="a" href={`mailto:${appData.email}`}>
                      <ListItemText primary="Email" secondary={appData.email} />
                    </ListItem>
                    <ListItem
                      button={appData.phoneNumber}
                      component={appData.phoneNumber ? 'a' : 'li'}
                      href={appData.phoneNumber ? `tel:${appData.phoneNumber}` : ''}
                    >
                      <ListItemText primary="Phone" secondary={appData.phoneNumber ? appData.phoneNumber : 'Undefined'} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Food</h3>
                  <List>
                    <ListItem>
                      <ListItemText primary="Diet" secondary={appData.diet} />
                    </ListItem>
                    <ListItemText primary="Allergies" secondary={appData.allergies} />
                  </List>
                </CardContent>
              </Card>
            </div>
          </section>
          <h2>Experience</h2>
          <div className="rowStyle">
            <Card className="cardStyle">
              <CardContent>
                <h3 className="cardTitle">Resume</h3>
                <List>
                  <ListItem>
                    <ListItemText primary="Resume" secondary={appData.resume} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            <Card className="cardStyle">
              <CardContent>
                <h3 className="cardTitle">Sites</h3>
                <List>
                  <ListItem button component="a" href={`https://github.com/${appData.github}`}>
                    <ListItemText primary="GitHub" secondary={appData.github} />
                  </ListItem>
                  <ListItem button component="a" href={`https://www.linkedin.com/in/${appData.linkedin}`}>
                    <ListItemText primary="LinkedIn" secondary={appData.linkedin} />
                  </ListItem>
                  <ListItem button component="a" href={`https://${appData.website}`}>
                    <ListItemText primary="Personal Website" secondary={appData.website} />
                  </ListItem>
                  <ListItem button component="a" href={appData.other_link}>
                    <ListItemText primary="Other Link" secondary={appData.other_link} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </div>
          <h2>Short Answer</h2>
          <div className="rowStyle">
            <Card className="cardStyle">
              <CardContent>
                <h3 className="cardTitle">Challenge</h3>
                <List>
                  <ListItem>
                    <ListItemText primary="Challenge" secondary={appData.challenge} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            <Card className="cardStyle">
              <CardContent>
                <h3 className="cardTitle">Project</h3>
                <List>
                  <ListItem>
                    <ListItemText primary="Project" secondary={appData.project} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </div>
          <h2>Misc</h2>
          <div className="rowStyle">
            <Card className="cardStyle">
              <CardContent>
                <h3 className="cardTitle">Misc</h3>
                <List>
                  <ListItem>
                    <ListItemText primary="Misc" secondary={appData.misc} />
                  </ListItem>
                </List>
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
