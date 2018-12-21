import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authentication from './auth';
import signup from './signup';
import forgotPassword from './forgotPassword';
import application from './application';

const rootReducer = combineReducers({
  form: formReducer,
  auth: authentication,
  newUser: signup,
  lostPass: forgotPassword,
  app: application,
});

export default rootReducer;
