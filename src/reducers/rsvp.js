import * as types from '../actions/types';

const INITIAL_STATE = {
  error: false,
  errorMessage: '',
  fetching: true,
  data: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_RSVP_SUCCESS:
      return {
        ...state,
        data: action.data,
        fetching: false,
      };
    case types.FETCH_RSVP_FAIL:
      return {
        ...state,
        errorMessage: action.error.message,
        fetching: false,
      };
    default:
      return state;
  }
};
