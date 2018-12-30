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
import Tooltip from '@material-ui/core/Tooltip';
import ExitToApp from '@material-ui/icons/ExitToApp';
import requireAuth from '../components/requireAuth';
import {
  getResume,
  updateAppStatus,
  clearApplication,
  signout,
} from '../actions/index';
import './Application.css';

const handleUndefinedField = s => (s || 'Not stated');
const handleUndefinedFieldWithOther = (s, o) => {
  if (s && s === 'Other') return o || s;
  return handleUndefinedField(s);
};
const parseGradDate = (date) => {
  if (date === undefined) return handleUndefinedField(date);

  const months = ['Janurary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (date.indexOf('-') !== -1) {
    const dateArr = date.split('-');
    return `${months[parseInt(dateArr[1], 10) - 1]} ${dateArr[0]}`;
  }

  if (date.indexOf('/') !== -1) {
    const dateArr = date.split('/');
    return `${months[parseInt(dateArr[0], 10) - 1]} ${dateArr[2]}`;
  }
  return date;
};

class Application extends Component {
  constructor(props) {
    super(props);
    this.acceptApp = this.acceptApp.bind(this);
    this.waitlistApp = this.waitlistApp.bind(this);
    this.rejectApp = this.rejectApp.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    const {
      getResume: fetchResume,
      match: { params: { uid } },
    } = this.props;

    fetchResume(uid);
  }

  componentWillUnmount() {
    const { clearApplication: clear } = this.props;
    clear();
  }

  acceptApp() {
    const { match: { params: { uid } }, updateAppStatus: uas } = this.props;
    uas(uid, 1);
  }

  waitlistApp() {
    const { match: { params: { uid } }, updateAppStatus: uas } = this.props;
    uas(uid, 2);
  }

  rejectApp() {
    const { match: { params: { uid } }, updateAppStatus: uas } = this.props;
    uas(uid, 3);
  }

  handleBackButton() {
    const { history: { push } } = this.props;
    push('/applications/');
  }

  handleSignOut() {
    const { signout: signoutActionCreator } = this.props;
    signoutActionCreator();
  }

  render() {
    const {
      fetchingResume,
      sendingStatus,
      match: { params: { uid } },
      applications,
      resumeMetadata,
      resumeUrl,
      errorResume,
      errorResumeMessage,
    } = this.props;

    const appData = applications.find(app => app.uid === uid);

    if (fetchingResume) {
      return (
        <div className="appBarPageWrapper">
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleBackButton} className="leftButton">
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

    if (appData) {
      return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleBackButton} className="leftButton">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" color="inherit" component="h1" className="grow">
                {appData.name}
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
                    {errorResume
                      ? <p>{errorResumeMessage}</p>
                      : (
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
                      )}
                  </CardContent>
                  <CardActions>
                    {!errorResume && (
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
                    )}
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
                        href={appData.website ? `https://${appData.website}` : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ListItemText primary="Personal Website" secondary={handleUndefinedField(appData.website)} />
                      </ListItem>
                      <ListItem
                        button={appData.other_link !== undefined}
                        component={appData.other_link ? 'a' : 'li'}
                        href={appData.other_link ? `https://${appData.other_link}` : ''}
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
                    <h3 className="cardTitle">What&apos;s a challenging situation you&apos;ve run into, and how did you go about solving it?</h3>
                    <p className="cardParagraph">
                      {handleUndefinedField(appData.challenge)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="cardStyle">
                  <CardContent>
                    <h3 className="cardTitle">Tell us about one of the projects you&apos;re most proud of.</h3>
                    <p className="cardParagraph">
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
                    <h3 className="cardTitle">Anything else we should know?</h3>
                    <p className="cardParagraph">
                      {handleUndefinedField(appData.misc)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="cardStyle">
                  <CardContent>
                    <h3 className="cardTitle">Application Decision</h3>
                    <ListItem>
                      <ListItemText primary="Status" secondary={appData.status} />
                    </ListItem>
                  </CardContent>
                  <CardActions>
                    <div className="buttonProgressWrapper">
                      <Button
                        size="small"
                        color="primary"
                        variant={appData.status === 'Accepted' ? 'contained' : 'text'}
                        onClick={this.acceptApp}
                      >
                        Accept
                      </Button>
                      {sendingStatus === 1 && <CircularProgress size={24} color="primary" className="buttonProgress" />}
                    </div>
                    <div className="buttonProgressWrapper">
                      <Button
                        size="small"
                        variant={appData.status === 'Waitlisted' ? 'contained' : 'text'}
                        onClick={this.waitlistApp}
                      >
                        Waitlist
                      </Button>
                      {sendingStatus === 2 && <CircularProgress size={24} color="inherit" className="buttonProgress" />}
                    </div>
                    <div className="buttonProgressWrapper">
                      <Button
                        size="small"
                        color="secondary"
                        variant={appData.status === 'Rejected' ? 'contained' : 'text'}
                        onClick={this.rejectApp}
                      >
                        Reject
                      </Button>
                      {sendingStatus === 3 && <CircularProgress size={24} color="secondary" className="buttonProgress" />}
                    </div>
                  </CardActions>
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
            <IconButton color="inherit" onClick={this.handleBackButton} className="leftButton">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" color="inherit" component="h1" className="grow">
              Application Error
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="sides">
          {appData
            ? <p>Application not found.</p>
            : ''}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fetchingResume: state.app.fetchingResume,
    sendingStatus: state.app.sendingStatus,
    applications: state.apps.data,
    resumeMetadata: state.app.resumeMetadata,
    resumeUrl: state.app.resumeUrl,
    errorResume: state.app.errorResume,
    errorResumeMessage: state.app.errorResumeMessage,
  };
}

Application.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  applications: PropTypes.arrayOf(PropTypes.shape({})),
  clearApplication: PropTypes.func.isRequired,
  getResume: PropTypes.func.isRequired,
  updateAppStatus: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired,
  resumeMetadata: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  resumeUrl: PropTypes.string,
  fetchingResume: PropTypes.bool.isRequired,
  sendingStatus: PropTypes.number.isRequired,
  errorResume: PropTypes.bool.isRequired,
  errorResumeMessage: PropTypes.string,
  history: PropTypes.shape().isRequired,
};

Application.defaultProps = {
  applications: null,
  resumeMetadata: null,
  resumeUrl: null,
  errorResumeMessage: null,
};

export default connect(
  mapStateToProps,
  {
    getResume,
    updateAppStatus,
    clearApplication,
    signout,
  },
)(requireAuth(Application));
