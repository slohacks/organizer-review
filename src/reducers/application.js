import * as types from '../actions/types';

const INITIAL_STATE = {
  fetchingResume: true,
  sendingStatus: 0,
  resumeMetadata: null,
  resumeUrl: null,
  errorResume: false,
  errorResumeMessage: '',
  errorStatus: false,
  errorStatusMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
    case types.CLEAR_APPLICATION:
      return INITIAL_STATE;
    default:
      return state;
  }
};
