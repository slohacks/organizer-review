import * as types from '../actions/types';

const INITIAL_STATE = {
  fetchingApplication: true,
  fetchingResume: true,
  sendingStatus: 0,
  data: null,
  appStatus: null,
  resumeMetadata: null,
  resumeUrl: null,
  errorApplication: false,
  errorApplicationMessage: '',
  errorResume: false,
  errorResumeMessage: '',
  errorStatus: false,
  errorStatusMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_GUCCI:
      return {
        ...state,
        data: action.data,
        appStatus: action.data.status,
        fetchingApplication: false,
        errorApplication: false,
        errorApplicationMessage: '',
      };
    case types.FETCH_FAIL:
      return {
        ...state,
        errorApplication: true,
        errorApplicationMessage: action.error.message,
        fetchingApplication: false,
      };
    case types.RESUME_GUCCI:
      return {
        ...state,
        resumeMetadata: action.metadata,
        resumeUrl: action.url,
        fetchingResume: false,
        errorResume: false,
        errorResumeMessage: '',
      };
    case types.RESUME_FAIL:
      return {
        ...state,
        errorResume: true,
        errorResumeMessage: action.error.message,
        fetchingResume: false,
      };
    case types.STATUS_ATTEMPT:
      return {
        ...state,
        sendingStatus: action.newStatus,
        errorStatus: false,
        errorStatusResume: '',
      };
    case types.STATUS_GUCCI:
      return {
        ...state,
        appStatus: action.status,
        sendingStatus: 0,
        errorStatus: false,
        errorStatusResume: '',
      };
    case types.STATUS_FAIL:
      return {
        ...state,
        sendingStatus: 0,
        errorStatus: true,
        errorStatusResume: action.error.message,
      };
    default:
      return state;
  }
};
