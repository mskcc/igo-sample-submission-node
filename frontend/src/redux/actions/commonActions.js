import axios from 'axios';

import { Config } from '../../config.js';

export const SERVER_ERROR = 'SERVER_ERROR';

export const REQUEST_CHECK_VERSION = 'REQUEST_CHECK_VERSION';
export const RECEIVE_CHECK_VERSION_SUCCESS = 'RECEIVE_CHECK_VERSION_SUCCESS';
export const RECEIVE_CHECK_VERSION_FAIL = 'RECEIVE_CHECK_VERSION_FAIL';
export const RECEIVE_SERVER_ERROR = 'RECEIVE_SERVER_ERROR';

export function checkVersion() {
  return (dispatch) => {
    dispatch({ type: REQUEST_CHECK_VERSION });
    return axios
      .get(Config.API_ROOT + '/checkVersion?', {
        params: {
          version: Config.VERSION,
        },
      })
      .then((response) => {
        return dispatch({
          type: RECEIVE_CHECK_VERSION_SUCCESS,
          data: response.data,
        });
      })

      .catch((error) => {
        if (error.response) {
          dispatch({
            type: SERVER_ERROR,
            serverError: true,
            error: error,
          });
        } else {
          dispatch({
            type: SERVER_ERROR,
            serverError: true,
          });
        }
      });
  };
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';

// Resets the currently visible error message.
export const setErrorMessage = () => ({
  type: SET_ERROR_MESSAGE,
});

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
});

export const RESET_MESSAGE = 'RESET_MESSAGE';
export const SET_MESSAGE = 'SET_MESSAGE';

// Resets the currently visible error message.
export const setMessage = () => ({
  type: SET_MESSAGE,
});

// Resets the currently visible error message.
export const resetMessage = () => ({
  type: RESET_MESSAGE,
});
