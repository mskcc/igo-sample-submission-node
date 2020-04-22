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


//  to save a submission, first check wether header matches grid
//  then check wether submission exists
export const SAVE_PARTIAL_SUBMISSION = 'SAVE_PARTIAL_SUBMISSION'
export const SAVE_PARTIAL_SUBMISSION_CANCEL = 'SAVE_PARTIAL_SUBMISSION_CANCEL'
export const SAVE_PARTIAL_SUBMISSION_FAIL = 'SAVE_PARTIAL_SUBMISSION_FAIL'
export const SAVE_PARTIAL_SUBMISSION_SUCCESS = 'SAVE_PARTIAL_SUBMISSION_SUCCESS'
export const BUTTON_RESET = 'BUTTON_RESET'
export function savePartialSubmission(grid) {

  return (dispatch, getState) => {
    let user = getState().user
    let submissions = getState().submissions

    dispatch({ type: SAVE_PARTIAL_SUBMISSION })

    let match = util.checkGridAndForm(
      getState().upload.form.selected,
      getState().upload.grid.form
    )
    if (!match.success) {
      return swal.formGridMismatch(match)

    } else {
      if (submissions.submissionToEdit) {
        Swal.fire({
          title: 'Update this submission?',
          html:
            `Are you sure you want to update this submission?`,
          // footer:
          //   'If you need to split up a large request into multiple smaller ones, we recommend you select "I don\'t have an iLabs ID" to avoid the duplicate check on "Save Table" and fill in the correct ID on submission.',
          type: 'info',
          animation: 'false',

          showCancelButton: true,
          animation: false,
          confirmButtonColor: '#df4602',
          cancelButtonColor: '#007cba',
          confirmButtonText: 'Overwrite',
          cancelButtonText: 'Cancel',
        }).then(result => {
          if (result.value) {
            return axios
              .post(Config.NODE_API_ROOT + '/submission/save', {
                ...util.generateSubmitData(getState(), true),

              })
              .then(response => {
                console.log(response)
                dispatch({
                  type: SAVE_PARTIAL_SUBMISSION_SUCCESS,
                  message: 'Saved!',
                  payload: response.payload.submission
                })
                // used to reset saved! msg on button
                return setTimeout(() => {
                  dispatch({ type: BUTTON_RESET })
                }, 2000)
              })
              .catch(error => {
                console.log(error.status)
                dispatch({
                  type: SAVE_PARTIAL_SUBMISSION_FAIL,
                  error: error,
                })
                return error
              })
            // }


          } else if (result.dismiss === Swal.DismissReason.cancel) {
            return dispatch({
              type: SAVE_PARTIAL_SUBMISSION_CANCEL,
              message: 'Canceled!',
            })
          }
        })
      }
    }
  }
}

export const DELETE_SUBMISSION = 'DELETE_SUBMISSION'
export const DELETE_SUBMISSION_FAIL = 'DELETE_SUBMISSION_FAIL'
export const DELETE_SUBMISSION_SUCCESS = 'DELETE_SUBMISSION_SUCCESS'
export function deleteSubmission(id, props) {
  return dispatch => {
    dispatch({ type: DELETE_SUBMISSION })
    services.deleteSubmission(id)
      .then((resp) => {
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


