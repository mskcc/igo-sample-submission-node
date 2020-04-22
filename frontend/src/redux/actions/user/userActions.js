import axios from 'axios'
import Swal from 'sweetalert2'

import { Config } from '../../../config.js'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_FAIL = 'LOGIN_FAIL'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export function login(username, password) {
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST })
    return axios
      .post(Config.NODE_API_ROOT + '/auth/login', {
        username: username,
        password: password,
      })
      .then(response => {
        sessionStorage.setItem('access_token', response.payload.token)

        return dispatch({
          type: LOGIN_SUCCESS,
          message: 'Successfully logged in.',
          payload: response.payload,
        })
      })

      .catch(error => {
        return dispatch({
          type: LOGIN_FAIL,
          error: error,
        })
      })
  }
}




export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_FAIL = 'LOGOUT_FAIL'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export function logout() {
  return dispatch => {
    dispatch({ type: LOGOUT_REQUEST })
    sessionStorage.removeItem('persist:root')

    let access_token = sessionStorage.getItem('access_token')
    // let refresh_token = sessionStorage.getItem('refresh_token')

    if (access_token) {
      sessionStorage.removeItem('access_token')
      return dispatch({
        type: LOGOUT_SUCCESS,
      })
      // .get(Config.API_ROOT + '/logoutAccess', {})

      // axios
      //   .get(Config.API_ROOT + '/logout', {})
      //   // .get(Config.API_ROOT + '/logoutAccess', {})
      //   .then(response => {
      //     sessionStorage.removeItem('access_token')
      //   })
      //   .catch(error => {
      //     return dispatch({
      //       type: LOGOUT_FAIL,
      //       error: error,
      //     })
      //   })
    }
    // let token = sessionStorage.getItem('refresh_token')
    // if (refresh_token) {
    //   sessionStorage.removeItem('refresh_token')
    //   axios
    //     .get(
    //       Config.API_ROOT + '/logoutRefresh',
    //       { headers: { Authorization: `Bearer ${token}` } },
    //       {}
    //     )
    //     .then(response => {
    //       return dispatch({
    //         type: LOGOUT_SUCCESS,
    //       })
    //     })
    //     .catch(error => {
    //       return dispatch({
    //         type: LOGOUT_FAIL,
    //         message: error.response.data.message,
    //       })
    //     })
    // } else
    //   return dispatch({
    //     type: LOGOUT_SUCCESS,
    //   })
  }
}

// export const REFRESH_TOKEN_VALID = 'REFRESH_TOKEN_VALID'
// export const REFRESH_TOKEN_REQUEST = 'REFRESH_TOKEN_REQUEST'
// export const REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID'

// export function refreshToken() {
//   return dispatch => {
//     let token = sessionStorage.getItem('refresh_token')
//     if (token) {
//       dispatch({ type: REFRESH_TOKEN_REQUEST })

//       return axios
//         .get(
//           Config.API_ROOT + '/refresh',
//           { headers: { Authorization: `Bearer ${token}` } },
//           {}
//         )
//         .then(response => {
//           sessionStorage.setItem('access_token', response.data.access_token)
//           dispatch({
//             type: REFRESH_TOKEN_VALID,
//             message: '',
//             payload: response.data,
//           })
//         })

//         .catch(error => {
//           sessionStorage.removeItem('refresh_token')
//           sessionStorage.removeItem('access_token')
//           sessionStorage.removeItem('persist:root')

//           if (error.response) {
//             return dispatch({
//               type: REFRESH_TOKEN_INVALID,
//               error: error,
//             })
//           } else {
//             dispatch({
//               type: SERVER_ERROR,
//               error: error,
//             })
//           }
//         })
//     } else {
//       sessionStorage.removeItem('refresh_token')
//       sessionStorage.removeItem('access_token')
//       sessionStorage.removeItem('persist:root')
//       dispatch({
//         type: REFRESH_TOKEN_INVALID,
//         message: 'Your session expired. Please log in again.',
//       })
//     }
//   }
// }



export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
})
