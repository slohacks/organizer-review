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

class RSVPCard extends Component {
  constructor(props) {
    super(props);

    this.getCSV = this.getCSV.bind(this);
  }

  getStatusCounts = (rsvps) => {
    const counts = [];

    rsvps.forEach((rsvp) => {
      const count = counts.find(el => el.attending === rsvp.attending);

      if (count !== undefined) {
        count.count += 1;
      } else {
        counts.push({ attending: rsvp.attending, count: 1 });
      }
    });

    return counts.sort((a, b) => b.count - a.count);
  }

  getCSV = () => {
    const { rsvps, applications } = this.props;
    const attendingEnum = {
      1: 'Yes',
      0: 'No',
    };
    const caliEnum = {
      1: 'Yes',
      2: 'No',
      3: 'SLO',
    };
    const shirtEnum = {
      0: 'S',
      1: 'M',
      2: 'L',
      3: 'XL',
      4: 'XXL',
    };
    let csvContent = 'data:text/csv;charset=utf-8,UID,Email,First Name,Last Name,College,Major,Attending,California,Bus,Stop,Flight,Shirt,Diet,Allergies,Misc\r\n';

    rsvps.forEach((rsvp) => {
      const application = applications.find(el => el.uid === rsvp.uid);
      csvContent += `${rsvp.uid},${application.email},${application.name.split(' ')[0]},${application.name.split(' ')[1] || ''},"${application.college}","${application.major}",${attendingEnum[rsvp.attending]},${caliEnum[rsvp.transportation]},${rsvp.buses || ''},"${rsvp.norcal || rsvp.socal || ''}","${rsvp.flight || ''}",${shirtEnum[rsvp.shirt]},"${application.diet}","${application.allergies}","${rsvp.misc || ''}"\r\n`;
    });

    csvContent = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'rsvps.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  render() {
    const { rsvps } = this.props;
    const counts = this.getStatusCounts(rsvps);

    return (
      <Card
        className="cardStyle"
        style={{
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <CardContent>
          <h3 className="cardTitle">RSVPs</h3>
          <List>
            {counts.map(count => (
              <ListItem
                key={count.attending ? 'Yes' : 'No'}
              >
                <ListItemText
                  primary={count.attending ? 'Yes' : 'No'}
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
        </CardActions>
      </Card>
    );
  }
}
RSVPCard.propTypes = {
  rsvps: PropTypes.arrayOf(PropTypes.shape({})),
  applications: PropTypes.arrayOf(PropTypes.shape({})),
};
RSVPCard.defaultProps = {
  rsvps: [],
  applications: [],
};
function mapStateToProps(state) {
  return {
    rsvps: state.rsvp.data,
    applications: state.apps.data,
  };
}
export default connect(
  mapStateToProps,
  null,
)(RSVPCard);
