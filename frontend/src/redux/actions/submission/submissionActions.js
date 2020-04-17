import axios from 'axios'
import { Config } from '../../../config.js'
import * as util from '../helpers'
import * as swal from '../../swal'



export const GET_SUBMISSIONS = 'GET_SUBMISSIONS'
export const GET_SUBMISSIONS_FAIL = 'GET_SUBMISSIONS_FAIL'
export const GET_SUBMISSIONS_SUCCESS = 'GET_SUBMISSIONS_SUCCESS'
export function getSubmissions() {
  return dispatch => {
    dispatch({ type: GET_SUBMISSIONS })
    return axios
      .get(Config.NODE_API_ROOT + '/submission/list', {})
      .then(response => {
        if (response.payload.submissions.length == 0) {
          return dispatch({
            type: GET_SUBMISSIONS_FAIL,
            error: {
              message: "Nothing submitted yet."
            }
          })
        }
        return dispatch({
          type: GET_SUBMISSIONS_SUCCESS,
          payload: {
            submissions: response.payload.submissions,
            table: response.payload.table,
          },
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
export function savePartialSubmission(grid) {

  return (dispatch, getState) => {
    console.log(util.generateSubmitData(getState()))
    let user = getState().user
    let submissions = getState().submissions

    dispatch({ type: SAVE_PARTIAL_SUBMISSION })

    let match = util.checkGridAndForm(
      getState().upload.form.selected,
      getState().upload.grid.form
    )
    if (!match.success) {
      return swal.formGridMismatch()

    } else {
      // if (
      //   util.submissionExists(
      //     grid.form.service_id,
      //     grid.form.material,
      //     user.username,
      //     submissions.list
      //   )
      // ) {
      //   Swal.fire({
      //     title: 'Duplicate found',
      //     html:
      //       'A request for ' +
      //       grid.form.material +
      //       ' with this Service ID and your username already exists. Are you sure you want to overwrite it?',
      //     // footer:
      //     //   'If you need to split up a large request into multiple smaller ones, we recommend you select "I don\'t have an iLabs ID" to avoid the duplicate check on "Save Table" and fill in the correct ID on submission.',
      //     type: 'info',
      //     animation: 'false',

      //     showCancelButton: true,
      //     animation: false,
      //     confirmButtonColor: '#df4602',
      //     cancelButtonColor: '#007cba',
      //     confirmButtonText: 'Overwrite',
      //     cancelButtonText: 'Cancel',
      //   }).then(result => {
      //     if (result.value) {
      //       return axios
      //         .post(Config.NODE_API_ROOT + '/submission/savePartial', {
      //           data: {
      //             ...generateSubmitData(getState()),
      //             username: getState().user.username,
      //           },
      //         })
      //         .then(response => {
      //           // Handsontable binds to your data source (list of arrays or list of objects) by reference. Therefore, all the data entered in the grid will alter the original data source.
      //           dispatch({
      //             type: SAVE_PARTIAL_SUBMISSION_SUCCESS,
      //             payload: {
      //               submissions: response.data.submissions,
      //               table: generateSubmissionsGrid(response.data),
      //             },
      //             message: 'Saved!',
      //           })
      //           // used to reset saved! msg on button
      //           return setTimeout(() => {
      //             dispatch({ type: BUTTON_RESET })
      //           }, 2000)
      //         })
      //         .catch(error => {
      //           dispatch({
      //             type: SAVE_PARTIAL_SUBMISSION_FAIL,
      //             error: error,
      //           })
      //           return error
      //         })
      //     } else if (result.dismiss === Swal.DismissReason.cancel) {
      //       return dispatch({
      //         type: SAVE_PARTIAL_SUBMISSION_CANCEL,
      //         message: 'Canceled!',
      //       })
      //     }
      //   })
      // } else {
      // console.log(util.generateSubmitData(getState()))
      // console.log("SAVESSAVESSAVESSAVESSAVESSAVESSAVESSAVESSAVESSAVES")
      return axios
        .post(Config.NODE_API_ROOT + '/submission/savePartial', {
            ...util.generateSubmitData(getState()),
            username: getState().user.username,
        }, )
        .then(response => {
          // Handsontable binds to your data source (list of arrays or list of objects) by reference. Therefore, all the data entered in the grid will alter the original data source.
          dispatch({
            type: SAVE_PARTIAL_SUBMISSION_SUCCESS,
            payload: {
              submissions: response.payload.submissions,
              table: util.generateSubmissionsGrid(response.payload),
            },
            message: 'Saved!',
          })
          // used to reset saved! msg on button
          return setTimeout(() => {
            dispatch({ type: BUTTON_RESET })
          }, 2000)
        })
        .catch(error => {
          dispatch({
            type: SAVE_PARTIAL_SUBMISSION_FAIL,
            error: error,
          })
          return error
        })
      // }
    }
  }
}


