import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchApplicants } from '../actions/index';

class Decision extends Component {
  componentDidMount() {
    const { fetchApplicants: fetchApps, applications } = this.props;
    if (!applications) {
      fetchApps();
    }
  }

  getCSV = (status) => {
    const { applications } = this.props;
    let csvContent = 'data:text/csv;charset=utf-8, ';
    applications.forEach((application) => {
      if (application.status === status) {
        csvContent += `${application.email},${application.name.split(' ')[0]},${application.name.split(' ')[1]}\r\n`;
      }
    });
    window.open(encodeURI(csvContent));
  };

  renderContext() {
    const { applications } = this.props;
    if (!applications) {
      return (
        <Card>
          <CardContent>
            <h3 className="cardTitle">Decisions</h3>
            <List>
              <Button variant="outlined" color="primary" onClick={e => this.getCSV(e.target.value)} value="Accepted">
                <CircularProgress />
              </Button>
              <Button variant="outlined" onClick={e => this.getCSV(e.target.value)} value="Waitlisted">
                <CircularProgress />
              </Button>
              <Button variant="outlined" color="secondary" onClick={e => this.getCSV(e.target.value)} value="Rejected">
                <CircularProgress />
              </Button>
            </List>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardContent>
          <h3 className="cardTitle">Decisions</h3>
          <List>
            <Button variant="outlined" color="primary" onClick={e => this.getCSV(e.target.value)} value="Accepted">
              Accepted
            </Button>
            <Button variant="outlined" onClick={e => this.getCSV(e.target.value)} value="Waitlisted">
              Waitlist
            </Button>
            <Button variant="outlined" color="secondary" onClick={e => this.getCSV(e.target.value)} value="Rejected">
              Rejected
            </Button>
          </List>
        </CardContent>
      </Card>
    );
  }

  render() {
    return (
      this.renderContext()
    );
  }
}
Decision.propTypes = {
  fetchApplicants: PropTypes.func.isRequired,
  applications: PropTypes.arrayOf(PropTypes.shape({})),
};
Decision.defaultProps = {
  applications: [],
};
function mapStateToProps(state) {
  return {
    applications: state.apps.data,
  };
}
export default connect(
  mapStateToProps,
  { fetchApplicants },
)(Decision);
