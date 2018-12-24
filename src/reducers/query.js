import * as types from '../actions/types';

const INITIAL_STATE = {
  querySearch: '',
  queryColumn: 'name',
  queryChecked: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_QUERY_STRING:
      return {
        ...state,
        querySearch: action.queryString,
      };
    case types.UPDATE_QUERY_COLUMN:
      return {
        ...state,
        queryColumn: action.queryColumn,
      };
    case types.UPDATE_QUERY_CHECKBOX:
      return {
        ...state,
        queryChecked: action.queryCheckBox,
      };
    default:
      return state;
  }
};
