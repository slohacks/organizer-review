import * as types from './types';
import { firebase } from '../config/firebase';

export const signUp = (values, callback) => (dispatch) => {
  dispatch({ type: types.SIGN_UP_ATTEMPT });
  firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
    .then((userCredential) => {
      firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
          dispatch({ type: types.SIGN_UP_GUCCI, userCredential });
          callback();
        }).catch(error => dispatch({ type: types.SIGN_UP_FAIL, error }));
    }).catch((error) => {
      dispatch({ type: types.SIGN_UP_FAIL, error });
    });
};

export const login = values => (dispatch) => {
  dispatch({ type: types.LOGIN_ATTEMPT });
  firebase.auth().signInWithEmailAndPassword(values.email, values.password)
    .then((userCredential) => {
      const {
        user: { emailVerified },
      } = userCredential;
      if (emailVerified) {
        dispatch({ type: types.LOGIN_GUCCI, userCredential });
      } else {
        dispatch({ type: types.LOGIN_FAIL, error: { message: 'Email not verified, please verify your email.' } });
      }
    }).catch((error) => {
      dispatch({ type: types.LOGIN_FAIL, error });
    });
};

export const forgotPassword = (values, callback) => (dispatch) => {
  dispatch({ type: types.FORGOT_PASS_ATTEMPT });
  firebase.auth().sendPasswordResetEmail(values.email)
    .then((userCredential) => {
      dispatch({ type: types.FORGOT_PASS_GUCCI, userCredential });
      callback();
    }).catch((error) => {
      dispatch({ type: types.FORGOT_PASS_FAIL, error });
    });
};

export const signout = () => (dispatch) => {
  firebase.auth().signOut()
    .then(() => {
      dispatch({ type: types.SIGN_OUT_GUCCI });
    })
    .catch((error) => {
      dispatch({ type: types.SIGN_OUT_FAIL, error });
    });
};
