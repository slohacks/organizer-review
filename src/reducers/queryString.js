import * as types from '../actions/types';

const INITIAL_STATE = {
  queryValue: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_QUERY:
      return {
        queryValue: action.queryString,
      };
    default:
      return state;
  }
};
