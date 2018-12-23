import * as types from '../actions/types';

const INITIAL_STATE = {
  fetchingApplication: true,
  fetchingResume: true,
  data: null,
  resumeMetadata: null,
  resumeUrl: null,
  errorApplication: false,
  errorApplicationMessage: '',
  errorResume: false,
  errorResumeMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_GUCCI:
      return {
        ...state,
        data: action.data,
        fetchingApplication: false,
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
      };
    case types.RESUME_FAIL:
      return {
        ...state,
        errorResume: true,
        errorResumeMessage: action.error.message,
        fetchingResume: false,
      };
    default:
      return state;
  }
};
