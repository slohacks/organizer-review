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

class DecisionCard extends Component {
  constructor(props) {
    super(props);

    this.getCSV = this.getCSV.bind(this);
    this.getEmailCSV = this.getEmailCSV.bind(this);
  }

  getStatusCounts = (applications) => {
    const counts = [];

    applications.forEach((application) => {
      const count = counts.find(el => el.status === application.status);

      if (count !== undefined) {
        count.count += 1;
      } else {
        counts.push({ status: application.status, count: 1 });
      }
    });

    return counts.sort((a, b) => b.count - a.count);
  }

  getCSV = () => {
    const { applications } = this.props;
    const counts = this.getStatusCounts(applications);
    let csvContent = 'data:text/csv;charset=utf-8,Status,Count\r\n';

    counts.forEach((count) => {
      csvContent += `${count.status},${count.count}\r\n`;
    });

    csvContent = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'Decisions.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getEmailCSV = (event) => {
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

  render() {
    const { applications } = this.props;
    const counts = this.getStatusCounts(applications);

    return (
      <Card className="cardStyle">
        <CardContent>
          <h3 className="cardTitle">Decisions</h3>
          <List>
            {counts.map(count => (
              <ListItem
                key={count.status}
              >
                <ListItemText
                  primary={count.status}
                  secondary={count.count}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            onClick={this.getCSV}
          >
            Get CSV
          </Button>
          <Button
            value="Accepted"
            onClick={e => this.getEmailCSV(e)}
          >
            Accepted CSV
          </Button>
          <Button
            value="Waitlisted"
            onClick={e => this.getEmailCSV(e)}
          >
            Waitlisted CSV
          </Button>
          <Button
            value="Rejected"
            onClick={e => this.getEmailCSV(e)}
          >
            Rejected CSV
          </Button>
        </CardActions>
      </Card>
    );
  }
}
DecisionCard.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape({})),
};
DecisionCard.defaultProps = {
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
)(DecisionCard);
