import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchApplications } from '../actions/index';

class Application extends Component {
  componentDidMount() {
    const {
      fetchApplications: fetchApps,
      match: { params: { uid } },
    } = this.props;

    fetchApps(uid);
  }

  render() {
    const { appData, errorMessage } = this.props;
    if (appData) {
      return (
        <div>
          {appData.name}
        </div>
      );
    }
    return (
      <div>
        {errorMessage}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appData: state.app.data,
    errorMessage: state.app.errorMessage,
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
};

Application.defaultProps = {
  errorMessage: null,
  appData: null,
};

export default connect(mapStateToProps, { fetchApplications })(Application);
