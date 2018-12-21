import * as types from '../actions/types';

const INITIAL_STATE = {
  error: false,
  errorMessage: '',
  data: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_ATTEMPT:
      return {
        ...state,
        errorMessage: '',
      };
    case types.FETCH_GUCCI:
      return {
        ...state,
        data: action.data,
      };
    case types.FETCH_FAIL:
      return {
        ...state,
        errorMessage: action.error.message,
      };
    default:
      return state;
  }
};
