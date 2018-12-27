import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class Decision extends Component {
  constructor(props) {
    super(props);
    this.getCSV = this.getCSV.bind(this);
  }

  getCSV = (event) => {
    const { applications } = this.props;
    let csvContent = 'data:text/csv;charset=utf-8,Email Address,First Name,Last Name\r\n';

    applications.forEach((application) => {
      if (application.status === event.currentTarget.value) {
        csvContent += `${application.email},${application.name.split(' ')[0]},${application.name.split(' ')[1]}\r\n`;
      }
    });

    csvContent = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${event.currentTarget.value}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  getStatusCounts = (applications) => {
    const counts = {
      accepted: 0,
      waitlisted: 0,
      rejected: 0,
      undecided: 0,
    };

    applications.forEach((application) => {
      switch (application.status) {
        case 'Accepted':
          counts.accepted += 1;
          break;
        case 'Waitlisted':
          counts.waitlisted += 1;
          break;
        case 'Rejected':
          counts.rejected += 1;
          break;
        default:
          counts.undecided += 1;
          break;
      }
    });

    return counts;
  }

  render() {
    const { applications } = this.props;
    const counts = this.getStatusCounts(applications);

    return (
      <Card>
        <CardContent>
          <h3 className="cardTitle">Decisions</h3>
          <List>
            <ListItem>
              <ListItemText
                primary="Accepted"
                secondary={counts.accepted}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Waitlisted"
                secondary={counts.waitlisted}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Rejected"
                secondary={counts.rejected}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Undecided"
                secondary={counts.undecided}
              />
            </ListItem>
          </List>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            value="Accepted"
            onClick={e => this.getCSV(e)}
          >
            Accepted
          </Button>
          <Button
            value="Waitlisted"
            onClick={e => this.getCSV(e)}
          >
            Waitlisted
          </Button>
          <Button
            color="secondary"
            value="Rejected"
            onClick={e => this.getCSV(e)}
          >
            Rejected
          </Button>
        </CardActions>
      </Card>
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
