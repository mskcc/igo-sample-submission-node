import axios from 'axios'
import { Config } from '../../../config.js'
import { util, swal, services } from '../../../util'

import Swal from 'sweetalert2'


export const GET_SUBMISSIONS = 'GET_SUBMISSIONS'
export const GET_SUBMISSIONS_FAIL = 'GET_SUBMISSIONS_FAIL'
export const GET_SUBMISSIONS_SUCCESS = 'GET_SUBMISSIONS_SUCCESS'
export function getSubmissions() {
  return dispatch => {
    dispatch({ type: GET_SUBMISSIONS })
    return axios
      .get(Config.NODE_API_ROOT + '/submission/grid')
      .then(response => {
        return dispatch({
          type: GET_SUBMISSIONS_SUCCESS,
          payload: response.payload
        })
      })
      .catch(error => {
        return dispatch({
          type: GET_SUBMISSIONS_FAIL,
          error: error,
        })
        return error
      })
  }
}


export const CREATE_PARTIAL_SUBMISSION = 'CREATE_PARTIAL_SUBMISSION'
export const CREATE_PARTIAL_SUBMISSION_FAIL = 'CREATE_PARTIAL_SUBMISSION_FAIL'
export const CREATE_PARTIAL_SUBMISSION_SUCCESS = 'CREATE_PARTIAL_SUBMISSION_SUCCESS'
export const BUTTON_RESET = 'BUTTON_RESET'
export function createPartialSubmission() {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_PARTIAL_SUBMISSION })
    let submitData = util.generateSubmitData(getState(), true)
    services.createSubmission(submitData)
      .then(response => {
        console.log(response)
        dispatch({
          type: CREATE_PARTIAL_SUBMISSION_SUCCESS,
          message: 'Saved!',
          payload: response.payload.submission
        })
        
        // used to reset saved! msg on button
        return setTimeout(() => {
          dispatch({ type: BUTTON_RESET })
        }, 2000)
      })
      .catch(error => {
        dispatch({
          type: CREATE_PARTIAL_SUBMISSION_FAIL,
          error: error,
        })
        return error
      })
  }
}
export const UPDATE_PARTIAL_SUBMISSION = 'UPDATE_PARTIAL_SUBMISSION'
export const UPDATE_PARTIAL_SUBMISSION_FAIL = 'UPDATE_PARTIAL_SUBMISSION_FAIL'
export const UPDATE_PARTIAL_SUBMISSION_SUCCESS = 'UPDATE_PARTIAL_SUBMISSION_SUCCESS'
export function updatePartialSubmission() {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_PARTIAL_SUBMISSION })
    let submitData = util.generateSubmitData(getState(), true)
    let id = getState().submissions.submissionToEdit
    services.updateSubmission({...submitData, id: id} )
      .then(response => {
        dispatch({
          type: UPDATE_PARTIAL_SUBMISSION_SUCCESS,
          message: 'Updated!',
          payload: response.payload.submission
        })
        // used to reset saved! msg on button
        return setTimeout(() => {
          dispatch({ type: BUTTON_RESET })
        }, 2000)
      })
      .catch(error => {
        dispatch({
          type: UPDATE_PARTIAL_SUBMISSION_FAIL,
          error: error,
        })
        return error
      })
  }
}

export const DELETE_SUBMISSION = 'DELETE_SUBMISSION'
export const DELETE_SUBMISSION_FAIL = 'DELETE_SUBMISSION_FAIL'
export const DELETE_SUBMISSION_SUCCESS = 'DELETE_SUBMISSION_SUCCESS'
export function deleteSubmission(id) {
  return dispatch => {
    dispatch({ type: DELETE_SUBMISSION })
    services.deleteSubmission(id)
      .then(() => {
        dispatch({
          type: DELETE_SUBMISSION_SUCCESS,
          message: 'Submission ' + id + ' successfully deleted.',
        })
        return dispatch(
          getSubmissions()
        )
      })
      .catch(error => {
        return dispatch({
          type: DELETE_SUBMISSION_FAIL,
          error: error,
        })
      })
  }
}

export const DOWNLOAD_RECEIPT = 'DOWNLOAD_RECEIPT'
export const DOWNLOAD_RECEIPT_FAIL = 'DOWNLOAD_RECEIPT_FAIL'
export const DOWNLOAD_RECEIPT_SUCCESS = 'DOWNLOAD_RECEIPT_SUCCESS'
export function downloadReceipt(submissionId, serviceId, username) {
  return dispatch => {
    dispatch({ type: DOWNLOAD_RECEIPT })
    return axios
      .get(Config.API_ROOT + '/downloadById', {
        params: { submissionId: submissionId },
        responseType: 'blob',
      })
      .then(response => {
        dispatch({
          type: DOWNLOAD_RECEIPT_SUCCESS,
          file: response.data,
          filename: 'Receipt-' + serviceId,
        })
      })
      .catch(error => {
        return dispatch({
          type: DOWNLOAD_RECEIPT_FAIL,
          error: error,
        })
        return error
      })
  }
}


