import * as types from './types';
import { firebase, applicationsRef } from '../config/firebase';

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

export const fetchApplicants = () => (dispatch) => {
  dispatch({ type: types.FETCH_ATTEMPT });
  let apps = [];
  applicationsRef.onSnapshot((snapshot) => {
    if (snapshot) {
      apps = [];
      snapshot.forEach((doc) => {
        const appData = { ...doc.data(), uid: doc.id };
        apps.push(appData);
      });
      dispatch({ type: types.FETCH_APPLICANTS_SUCCESS, data: apps });
    } else {
      dispatch({
        type: types.FETCH_APPLICANTS_FAIL,
        error: { message: 'Error fetching data.' },
      });
    }
  }, (error) => {
    dispatch({ type: types.FETCH_APPLICANTS_FAIL, error });
  });
};

export const updateQuerySearch = (searchString) => {
  return {
    type: types.UPDATE_QUERY_STRING,
    queryString: searchString,
  };
};

export const updateQueryButton = (columnString) => {
  return {
    type: types.UPDATE_QUERY_COLUMN,
    queryColumn: columnString,
  };
};

export const updateQueryCheck = (checked) => {
  return {
    type: types.UPDATE_QUERY_CHECKBOX,
    queryCheckBox: checked,
  };
};

export const fetchApplications = uid => (dispatch) => {
  dispatch({ type: types.FETCH_ATTEMPT });
  applicationsRef.doc(uid).get()
    .then((application) => {
      if (application.exists) {
        const applicationData = application.data();
        dispatch({ type: types.FETCH_GUCCI, data: applicationData });
      } else {
        dispatch({
          type: types.FETCH_FAIL,
          error: { message: 'Application does not exist.' },
        });
      }
    })
    .catch((error) => {
      dispatch({ type: types.FETCH_FAIL, error });
    });
};

export const getResume = uid => (dispatch) => {
  dispatch({ type: types.RESUME_ATTEMPT });
  firebase.storage().ref().child(`resumes/${uid}.pdf`).getMetadata()
    .then((metadata) => {
      firebase.storage().ref().child(`resumes/${uid}.pdf`).getDownloadURL()
        .then((url) => {
          dispatch({
            type: types.RESUME_GUCCI,
            metadata,
            url,
          });
        })
        .catch(error => dispatch({ type: types.RESUME_FAIL, error }));
    })
    .catch(error => dispatch({ type: types.RESUME_FAIL, error }));
};

export const updateAppStatus = (uid, newStatus) => (dispatch) => {
  dispatch({ type: types.STATUS_ATTEMPT, newStatus });
  applicationsRef.doc(uid).update({ status: newStatus })
    .then(() => {
      dispatch({ type: types.STATUS_GUCCI, status: newStatus });
    })
    .catch(error => dispatch({ type: types.STATUS_FAIL, error }));
};
