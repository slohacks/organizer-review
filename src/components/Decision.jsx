import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

class Decision extends Component {
  constructor(props) {
    super(props);
    this.getCSV = this.getCSV.bind(this);
  };

  getCSV = (status) => {
    const { applications } = this.props;
    let csvContent = 'data:text/csv;charset=utf-8, ';
    applications.forEach((application) => {
      if (application.status === status.target.innerHTML) {
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
              <Button variant="outlined" color="primary">
                <CircularProgress />
              </Button>
              <Button variant="outlined">
                <CircularProgress />
              </Button>
              <Button variant="outlined" color="secondary">
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
            <Button
              variant="outlined"
              color="primary"
              value="Accepted"
              onClick={e => this.getCSV(e)}
            >
              Accepted
            </Button>
            <Button
              variant="outlined"
              value="Waitlisted"
              onClick={e => this.getCSV(e)}
            >
              Waitlist
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              value="Rejected"
              onClick={e => this.getCSV(e)}
            >
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
  null,
)(Decision);
