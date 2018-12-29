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

const styles = {
  expand: {
    transform: 'rotate(0deg)',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
};

class Statistic extends Component {
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

  getCollegeCounts = (applications) => {
    const counts = [];
    const { name } = this.props;

    applications.forEach((application) => {
      const count = counts.find(el => el[name] === application[name]);

      if (count !== undefined) {
        count.count += 1;
      } else {
        counts.push({ [name]: application[name], count: 1 });
      }
    });

    return counts.sort((a, b) => b.count - a.count);
  }

  getCSV = () => {
    const { applications, name } = this.props;
    const counts = this.getCollegeCounts(applications);
    let csvContent = 'data:text/csv;charset=utf-8,Status,Count\r\n';

    counts.forEach((count) => {
      csvContent += `${count[name].replace(/,/g, '-').trim()},${count.count}\r\n`;
    });

    csvContent = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${name}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  render() {
    const { applications, name } = this.props;
    const { expanded } = this.state;
    const counts = this.getCollegeCounts(applications);
    const heading = name.charAt(name.length - 1) === 'y' ? name.replace(name.charAt(name.length - 1), 'ie') : name;
    const header = `${heading.replace(heading.charAt(0), heading.charAt(0).toUpperCase())}s`;

    return (
      <Card className="cardStyle">
        <CardContent>
          <h3 className="cardTitle">{header}</h3>
          <List>
            {counts.slice(0, 4).map(count => (
              <ListItem
                key={count[name]}
              >
                <ListItemText
                  primary={count[name]}
                  secondary={count.count}
                />
              </ListItem>
            ))}
            <Collapse
              in={expanded}
              timeout="auto"
              unmountOnExit
            >
              {counts.slice(4).map(count => (
                <ListItem
                  key={count[name]}
                >
                  <ListItemText
                    primary={count[name]}
                    secondary={count.count}
                  />
                </ListItem>
              ))}
            </Collapse>
          </List>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            onClick={this.getCSV}
          >
            Get CSV
          </Button>
          <IconButton
            style={expanded ? styles.expand : styles.expandOpen}
            onClick={this.handleExpansion}
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}
Statistic.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape({})),
  name: PropTypes.string.isRequired,
};
Statistic.defaultProps = {
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
)(Statistic);
