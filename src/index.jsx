import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ReduxThunk from 'redux-thunk';

import reducers from './reducers';
import Application from './containers/Application';
import ListApplications from './containers/ListApplications';
import SignUp from './containers/SignUp';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import NotFound from './containers/NotFound';

import './index.css';

const createStoreWithMiddleware = createStore(
  reducers,
  {},
  applyMiddleware(ReduxThunk),
);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware}>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/application/:uid" component={Application} />
        <Route path="/applications/" component={ListApplications} />
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.querySelector('.app'),
);
