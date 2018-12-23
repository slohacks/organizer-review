import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { fetchApplications, getResume } from '../actions/index';
import './Application.css';

const handleUndefinedField = s => (s || 'Not stated');
const handleUndefinedFieldWithOther = (s, o) => {
  if (s && s === 'Other') return o || s;
  return handleUndefinedField(s);
};
const parseGradDate = (date) => {
  if (date === undefined) return handleUndefinedField(date);

  const months = ['Janurary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateArr = date.split('-');

  return `${months[parseInt(dateArr[1], 10) - 1]} ${dateArr[0]}`;
};

class Application extends Component {
  componentDidMount() {
    const {
      fetchApplications: fetchApps,
      getResume: fetchResume,
      match: { params: { uid } },
    } = this.props;

    fetchApps(uid);
    fetchResume(uid);
  }

  render() {
    const {
      fetchingApplication,
      fetchingResume,
      appData,
      resumeMetadata,
      resumeUrl,
      errorApplication,
      errorApplicationMessage,
      errorResume,
      errorResumeMessage,
    } = this.props;

    if (fetchingApplication || fetchingResume) {
      return (
        <div className="appBarPageWrapper">
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" className="leftButton">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" color="inherit" component="h1" className="grow">
                Loading Application
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="loadingSpinnerWrapper">
            <CircularProgress />
          </div>
        </div>
      );
    }

    if (appData && (!errorApplication || !errorResume)) {
      return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" className="leftButton">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" color="inherit" component="h1" className="grow">
                {appData.name}
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="sides">
            <section>
              <h2>Personal Info</h2>
              <div className="rowStyle">
                <Card className="cardStyle">
                  <CardContent>
                    <h3 className="cardTitle">Demographics</h3>
                    <List>
                      <ListItem>
                        <ListItemText primary="Graduation Date" secondary={parseGradDate(appData.grad_date)} />
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
                      <ListItem
                        button={appData.city !== undefined}
                        component={appData.city ? 'a' : 'li'}
                        href={appData.city ? `https://www.google.com/maps/place/${appData.city}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
                        <ListItemText primary="Name" secondary={appData.resume || 'N/A'} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Size"
                          secondary={resumeMetadata && resumeMetadata.size
                            ? `${(parseInt(resumeMetadata.size, 10) / 1024 / 1024).toFixed(2)} mb`
                            : 'N/A'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      disabled={!resumeMetadata}
                      component="a"
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
                <Card className="cardStyle">
                  <CardContent>
                    <h3 className="cardTitle">Sites</h3>
                    <List>
                      <ListItem
                        button={appData.github !== undefined}
                        component={appData.github ? 'a' : 'li'}
                        href={appData.github ? `https://github.com/${appData.github}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ListItemText primary="GitHub" secondary={handleUndefinedField(appData.github)} />
                      </ListItem>
                      <ListItem
                        button={appData.linkedin !== undefined}
                        component={appData.linkedin ? 'a' : 'li'}
                        href={appData.linkedin ? `https://www.linkedin.com/in/${appData.linkedin}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ListItemText primary="LinkedIn" secondary={handleUndefinedField(appData.linkedin)} />
                      </ListItem>
                      <ListItem
                        button={appData.website !== undefined}
                        component={appData.website ? 'a' : 'li'}
                        href={appData.website ? `${appData.website}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ListItemText primary="Personal Website" secondary={handleUndefinedField(appData.website)} />
                      </ListItem>
                      <ListItem
                        button={appData.other_link !== undefined}
                        component={appData.other_link ? 'a' : 'li'}
                        href={appData.other_link ? `${appData.other_link}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
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
        </div>
      );
    }

    return (
      <div className="appBarPageWrapper">
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" className="leftButton">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" color="inherit" component="h1" className="grow">
              Application Error
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="sides">
          {errorApplication
            ? `<p>${errorApplicationMessage}</p>`
            : ''}
          {errorResume
            ? `<p>${errorResumeMessage}</p>`
            : ''}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fetchingApplication: state.app.fetchingApplication,
    fetchingResume: state.app.fetchingResume,
    appData: state.app.data,
    resumeMetadata: state.app.resumeMetadata,
    resumeUrl: state.app.resumeUrl,
    errorApplication: state.app.errorApplication,
    errorResume: state.app.errorResume,
    errorApplicationMessage: state.app.errorApplicationMessage,
    errorResumeMessage: state.app.errorResumeMessage,
  };
}

Application.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  fetchApplications: PropTypes.func.isRequired,
  getResume: PropTypes.func.isRequired,
  appData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  resumeMetadata: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  resumeUrl: PropTypes.string,
  fetchingApplication: PropTypes.bool.isRequired,
  fetchingResume: PropTypes.bool.isRequired,
  errorApplication: PropTypes.bool.isRequired,
  errorApplicationMessage: PropTypes.string,
  errorResume: PropTypes.bool.isRequired,
  errorResumeMessage: PropTypes.string,
};

Application.defaultProps = {
  appData: null,
  resumeMetadata: null,
  resumeUrl: null,
  errorApplicationMessage: null,
  errorResumeMessage: null,
};

export default connect(
  mapStateToProps,
  { fetchApplications, getResume },
)(Application);
