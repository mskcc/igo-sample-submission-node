import axios from 'axios'
import { Config } from '../../../config.js'
import { util, swal, services, excel } from '../../../util'
import moment from 'moment'



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
          payload: response.payload,
          message: `Displaying all ${response.payload.rows.length} submissions.`
        })
      })
      .catch(error => {
        return dispatch({
          type: GET_SUBMISSIONS_FAIL,
          error: error,
        })
      })
  }
}



export const GET_SUBMISSIONS_SINCE = 'GET_SUBMISSIONS_SINCE'
export const GET_SUBMISSIONS_SINCE_FAIL = 'GET_SUBMISSIONS_SINCE_FAIL'
export const GET_SUBMISSIONS_SINCE_SUCCESS = 'GET_SUBMISSIONS_SINCE_SUCCESS'
export function getSubmissionsSince(unit, time) {
  return dispatch => {
    dispatch({ type: GET_SUBMISSIONS_SINCE })
    let limit = moment().subtract(unit, time).unix()
    services.getSubmissionsSince(limit)

      .then(response => {
        return dispatch({
          type: GET_SUBMISSIONS_SINCE_SUCCESS,
          payload: response.payload,
          message: `Displaying submissions created during last ${util.maybeSingularize(time, unit)}.`
        })
      })
      .catch(error => {
        return dispatch({
          type: GET_SUBMISSIONS_SINCE_FAIL,
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
    services.updateSubmission({ ...submitData, id: id })
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



export const UNSUBMIT = 'UNSUBMIT'
export const UNSUBMIT_FAIL = 'UNSUBMIT_FAIL'
export const UNSUBMIT_SUCCESS =
  'UNSUBMIT_SUCCESS'
export function unsubmit(id) {
  return (dispatch) => {
    dispatch({ type: UNSUBMIT })

    services.unsubmitSubmission(id)
      .then(() => {
        dispatch({
          type: UNSUBMIT_SUCCESS,
        })
        return location.reload()
      }).catch(error => {
        return dispatch({
          type: UNSUBMIT_FAIL,
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

    services.downloadSubmission(submissionId).then(response => {
      excel.downloadExcel(response.payload.excelData, response.payload.fileName)
      return dispatch({
        type: DOWNLOAD_RECEIPT_SUCCESS,
      })
    })
      .catch(error => {
        return dispatch({
          type: DOWNLOAD_RECEIPT_FAIL,
          error: error,
        })
      })
  }
}


export const SUBMIT = 'SUBMIT'
export const SUBMIT_FAIL = 'SUBMIT_FAIL'
export const SUBMIT_SUCCESS =
  'SUBMIT_SUCCESS'
export function submitSubmission() {
  return (dispatch, getState) => {
    dispatch({ type: SUBMIT, message: 'Submitting...' })

    let data = util.generateSubmitData(getState())
    services.submitSubmission(data)
      .then(() => {
        dispatch({
          type: SUBMIT_SUCCESS,
        })
        swal.submitSuccess().then((page) => {
          window.location.href = `/${page}`

        })
      }).catch(error => {
        dispatch({
          type: SUBMIT_FAIL,
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

