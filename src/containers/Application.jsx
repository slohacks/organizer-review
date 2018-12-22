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

const handleUndefinedField = s => (s || 'Not stated');
const handleUndefinedFieldWithOther = (s, o) => (s || handleUndefinedField(o));

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
                      <ListItemText primary="Graduation Date" secondary={handleUndefinedField(appData.grad_date)} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Gender" secondary={handleUndefinedFieldWithOther(appData.gender, appData.other_gender)} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ethnicity" secondary={handleUndefinedFieldWithOther(appData.ethnicity, appData.other_ethnicity)} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Travel</h3>
                  <List>
                    <ListItem>
                      <ListItemText primary="College" secondary={handleUndefinedField(appData.college)} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="City" secondary={handleUndefinedField(appData.city)} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Contact</h3>
                  <List>
                    <ListItem button component="a" href={`mailto:${appData.email}`}>
                      <ListItemText primary="Email" secondary={handleUndefinedField(appData.email)} />
                    </ListItem>
                    <ListItem
                      button={appData.phoneNumber !== undefined}
                      component={appData.phoneNumber ? 'a' : 'li'}
                      href={appData.phoneNumber ? `tel:${appData.phoneNumber}` : ''}
                    >
                      <ListItemText primary="Phone" secondary={handleUndefinedField(appData.phoneNumber)} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Food</h3>
                  <List>
                    <ListItem>
                      <ListItemText primary="Diet" secondary={handleUndefinedField(appData.diet)} />
                    </ListItem>
                    <ListItemText primary="Allergies" secondary={handleUndefinedField(appData.allergies)} />
                  </List>
                </CardContent>
              </Card>
            </div>
          </section>
          <section>
            <h2>Experience</h2>
            <div className="rowStyle">
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Resume</h3>
                  <List>
                    <ListItem>
                      <ListItemText primary="Resume" secondary={handleUndefinedField(appData.resume)} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Sites</h3>
                  <List>
                    <ListItem
                      button={appData.github !== undefined}
                      component={appData.github ? 'a' : 'li'}
                      href={appData.github ? `https://github.com/${appData.github}` : ''}
                    >
                      <ListItemText primary="GitHub" secondary={handleUndefinedField(appData.github)} />
                    </ListItem>
                    <ListItem
                      button={appData.linkedin !== undefined}
                      component={appData.linkedin ? 'a' : 'li'}
                      href={appData.linkedin ? `https://www.linkedin.com/in/${appData.linkedin}` : ''}
                    >
                      <ListItemText primary="LinkedIn" secondary={handleUndefinedField(appData.linkedin)} />
                    </ListItem>
                    <ListItem
                      button={appData.website !== undefined}
                      component={appData.website ? 'a' : 'li'}
                      href={appData.website ? `${appData.website}` : ''}
                    >
                      <ListItemText primary="Personal Website" secondary={handleUndefinedField(appData.website)} />
                    </ListItem>
                    <ListItem
                      button={appData.other_link !== undefined}
                      component={appData.other_link ? 'a' : 'li'}
                      href={appData.other_link ? `${appData.other_link}` : ''}
                    >
                      <ListItemText primary="Other Link" secondary={handleUndefinedField(appData.other_link)} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </div>
          </section>
          <section>
            <h2>Short Answer</h2>
            <div className="rowStyle">
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Challenge</h3>
                  <p>
                    {handleUndefinedField(appData.challenge)}
                  </p>
                </CardContent>
              </Card>
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Project</h3>
                  <p>
                    {handleUndefinedField(appData.project)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          <section>
            <h2>Misc</h2>
            <div className="rowStyle">
              <Card className="cardStyle">
                <CardContent>
                  <h3 className="cardTitle">Other Comments</h3>
                  <p>
                    {handleUndefinedField(appData.misc)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
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
