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
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
});

class CountCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.handleExpansion = this.handleExpansion.bind(this);
    this.getCSV = this.getCSV.bind(this);
  }

  handleExpansion = () => {
    const { expanded } = this.state;
    this.setState(({ expanded: !expanded }));
  }

  getCounts = (applications) => {
    const counts = [];
    const { applicationField } = this.props;

    applications.forEach((application) => {
      const count = counts.find(el => el[applicationField] === application[applicationField]);

      if (count !== undefined) {
        count.count += 1;
      } else {
        counts.push({ [applicationField]: application[applicationField], count: 1 });
      }
    });

    return counts.sort((a, b) => b.count - a.count);
  }

  getCSV = () => {
    const { applications, applicationField } = this.props;
    const counts = this.getCounts(applications);
    let csvContent = 'data:text/csv;charset=utf-8,Status,Count\r\n';

    counts.forEach((count) => {
      if (count[applicationField] !== undefined) {
        csvContent += `${count[applicationField].replace(/,/g, '-').trim()},${count.count}\r\n`;
      }
    });

    csvContent = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${applicationField}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getPlural = (s) => { return s.charAt(s.length - 1) === 'y' ? `${s.substring(0, s.length - 1)}ies` : `${s}s`; };

  render() {
    const {
      applications,
      applicationField,
      classes,
      displayName,
    } = this.props;
    const { expanded } = this.state;
    const counts = this.getCounts(applications);
    const header = this.getPlural(displayName || applicationField).replace(/\b\w/g, l => l.toUpperCase());

    return (
      <Card className="cardStyle">
        <CardContent>
          <h3 className="cardTitle">{header}</h3>
          <List>
            {counts.slice(0, 4).map(count => (
              <ListItem
                key={count[applicationField]}
              >
                <ListItemText
                  primary={count[applicationField]}
                  secondary={count.count}
                />
              </ListItem>
            ))}
            {!expanded && counts.length > 4 && (
              <ListItem>
                <ListItemText
                  secondary={counts.length - 4 === 1
                    ? `and 1 more ${displayName || applicationField}...`
                    : `and ${counts.length - 4} more ${this.getPlural(displayName || applicationField)}...`
                  }
                />
              </ListItem>
            )}
            <Collapse
              in={expanded}
              timeout="auto"
              unmountOnExit
            >
              {counts.slice(4).map(count => (
                <ListItem
                  key={count[applicationField]}
                >
                  <ListItemText
                    primary={count[applicationField]}
                    secondary={count.count}
                  />
                </ListItem>
              ))}
            </Collapse>
          </List>
        </CardContent>
        <CardActions disableActionSpacing>
          <Button
            color="primary"
            onClick={this.getCSV}
          >
            Get CSV
          </Button>
          {counts.length > 4 && (
            <IconButton
              className={expanded ? classes.expandOpen : classes.expand}
              onClick={this.handleExpansion}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    );
  }
}

CountCard.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape({})),
  applicationField: PropTypes.string.isRequired,
  classes: PropTypes.shape().isRequired,
  displayName: PropTypes.string,
};

CountCard.defaultProps = {
  applications: [],
  displayName: null,
};

function mapStateToProps(state) {
  return {
    applications: state.apps.data,
  };
}

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(CountCard));
