import axios from 'axios'

import { Config } from '../../config.js'

axios.defaults.withCredentials = true;

// Add a request interceptor
// axios.interceptors.request.use(
//   config => {
//     // config.withCredentials= true    
//     return config
//   }
// )
// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    
    console.log("intercepted")
    // Do something with response data
    if (response.data.data) {
      response.payload = response.data.data
      console.log(response.payload)
    }
    return response
  },
  function (error) {
    console.log("error.response")
    if (error.response) {
      error.payload = error.response.data 
      // console(error.payload)
      if (error.response.status === 401) {
      //   console.log("intercepted 401")
        // Automatically redirect client to the login page
        window.location.href = `${Config.LOGIN_PAGE_URL}/${Config.HOME_PAGE_PATH}`;
      // } else {
         
        }
    }
    // Do something with response error
    return Promise.reject(error)
  }
)


export const SERVER_ERROR = 'SERVER_ERROR'

export const REQUEST_CHECK_VERSION = 'REQUEST_CHECK_VERSION'
export const RECEIVE_CHECK_VERSION_SUCCESS = 'RECEIVE_CHECK_VERSION_SUCCESS'
export const RECEIVE_CHECK_VERSION_FAIL = 'RECEIVE_CHECK_VERSION_FAIL'
export const RECEIVE_SERVER_ERROR = 'RECEIVE_SERVER_ERROR'

export function checkVersion() {
  return dispatch => {
    dispatch({ type: REQUEST_CHECK_VERSION })
    return axios
      .get(Config.API_ROOT + '/checkVersion?', {
        params: {
          version: Config.VERSION,
        },
      })
      .then(response => {
        return dispatch({
          type: RECEIVE_CHECK_VERSION_SUCCESS,
          data: response.data,
        })
      })

      .catch(error => {
        if (error.response) {
          dispatch({
            type: SERVER_ERROR,
            serverError: true,
            error: error,
          })
        } else {
          dispatch({
            type: SERVER_ERROR,
            serverError: true,
          })
        }
      })
  }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const setErrorMessage = () => ({
  type: SET_ERROR_MESSAGE,
})

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
})

export const RESET_MESSAGE = 'RESET_MESSAGE'
export const SET_MESSAGE = 'SET_MESSAGE'

// Resets the currently visible error message.
export const setMessage = () => ({
  type: SET_MESSAGE,
})

// Resets the currently visible error message.
export const resetMessage = () => ({
  type: RESET_MESSAGE,
})
