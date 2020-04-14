import axios from 'axios'
import { Config } from '../../config.js'
import * as util from '../helpers'

export const GET_SUBMISSIONS = 'GET_SUBMISSIONS'
export const GET_SUBMISSIONS_FAIL = 'GET_SUBMISSIONS_FAIL'
export const GET_SUBMISSIONS_SUCCESS = 'GET_SUBMISSIONS_SUCCESS'
export function getSubmissions() {
  return dispatch => {
    dispatch({ type: GET_SUBMISSIONS })
    return axios
      .get(Config.NODE_API_ROOT + '/submissions/list', {})
      .then(response => {
        return dispatch({
          type: GET_SUBMISSIONS_SUCCESS,
          payload: {
            submissions: response.data.submissions,
            table: util.generateSubmissionsGrid(response.data),
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