import axios from 'axios';
import Swal from 'sweetalert2';
import { Config } from '../../../config.js';
import { util, swal, services, excel } from '../../../util';

export const REQUEST_INITIAL_STATE_PROMOTE = 'REQUEST_INITIAL_STATE_PROMOTE';

export const RECEIVE_INITIAL_STATE_PROMOTE_SUCCESS =
  'RECEIVE_INITIAL_STATE_PROMOTE_SUCCESS';

export const RECEIVE_INITIAL_STATE_PROMOTE_FAIL =
  'RECEIVE_INITIAL_STATE_PROMOTE_FAIL';
export const INITIAL_STATE_PROMOTE_RETRIEVED =
  'INITIAL_STATE_PROMOTE_RETRIEVED';

export function getPromoteGrid() {
  return (dispatch, getState) => {
    if (getState().promote.initialFetched)
      return dispatch({ type: INITIAL_STATE_PROMOTE_RETRIEVED });
    else {
      dispatch({ type: REQUEST_INITIAL_STATE_PROMOTE });
      services
        .promoteGrid()
        .then(response => {
          return dispatch({
            type: RECEIVE_INITIAL_STATE_PROMOTE_SUCCESS,
            grid: response.payload
          });
        })
        .catch(error => {
          return dispatch({
            type: RECEIVE_INITIAL_STATE_PROMOTE_FAIL,
            error: error
          });
        });
    }
  };
}

export const REQUEST_BANKED_SAMPLES = 'REQUEST_BANKED_SAMPLES';

export const RECEIVE_BANKED_SAMPLES_SUCCESS = 'RECEIVE_BANKED_SAMPLES_SUCCESS';

export const RECEIVE_BANKED_SAMPLES_FAIL = 'RECEIVE_BANKED_SAMPLES_FAIL';
export const BANKED_SAMPLES_RETRIEVED = 'BANKED_SAMPLES_RETRIEVED';

export function loadBankedSamples(queryType, query) {
  return (dispatch, getState) => {
    dispatch({
      type: REQUEST_BANKED_SAMPLES,
      message: `Fetching Banked Samples for ${queryType}: ${query}...`
    });

    services
      .loadBankedSamples(queryType, query)
      .then(response => {
        // need to go with rowBackup and isEqual comparison to decide if changes happened because
        // handsontable changes do not trigger redux events
        let samples = response.payload.samples;
        let rows = samples.map(a => Object.assign({}, a));
        let rowsBackup = samples.map(a => Object.assign({}, a));
        dispatch({
          type: RECEIVE_BANKED_SAMPLES_SUCCESS,
          rows: util.rowsWithRowIndex(rows),
          rowsBackup: util.rowsWithRowIndex(rowsBackup)
        });
        return response;
      })
      .catch(error =>
        dispatch({
          type: RECEIVE_BANKED_SAMPLES_FAIL,
          error: error
        })
      );
  };
}

export const PROMOTE_DRYRUN = 'PROMOTE_DRYRUN';

export const PROMOTE_DRYRUN_SUCCESS = 'PROMOTE_DRYRUN_SUCCESS';

export const PROMOTE_DRYRUN_FAIL = 'PROMOTE_DRYRUN_FAIL';

export function promoteDry(projectId, requestId, serviceId, bankedSampleIds) {
  return dispatch => {
    dispatch({
      type: PROMOTE_DRYRUN,
      message: 'Determining promote method...'
    });
    let transactionId = util.getTransactionId();

    services
      .promote({
        projectId,
        requestId,
        serviceId,
        transactionId,
        bankedSampleIds: bankedSampleIds,
        dryrun: true
      })

      .then(response => {
        var rows = { ...response.data };
        var rowsBackup = { ...response.data };
        dispatch({
          type: PROMOTE_DRYRUN_SUCCESS,
          rows: rows,
          rowsBackup: rowsBackup,
          message: ''
        });
        swal.dryRunSuccess(response.payload.message).then(decision => {
          if (decision) {
            dispatch(
              promoteForReal(
                projectId,
                requestId,
                serviceId,
                transactionId,
                bankedSampleIds
              )
            );
          }
        });
      })
      .catch(error => {
        return dispatch({
          type: PROMOTE_DRYRUN_FAIL,
          error: error
        });
      });
  };
}
export const PROMOTE_FORREAL = 'PROMOTE_FORREAL';

export const PROMOTE_FORREAL_SUCCESS = 'PROMOTE_FORREAL_SUCCESS';

export const PROMOTE_FORREAL_FAIL = 'PROMOTE_FORREAL_FAIL';

export function promoteForReal(
  projectId,
  requestId,
  serviceId,
  transactionId,
  bankedSampleIds
) {
  return dispatch => {
    // let rows = getState().promote.rows
    dispatch({
      type: PROMOTE_FORREAL,
      message: 'Promoting...'
    });
    services
      .promote({
        projectId,
        requestId,
        serviceId,
        transactionId,
        bankedSampleIds: JSON.stringify(bankedSampleIds),
        dryrun: false
      })
      .then(response => {
        console.log(response);

        dispatch({ type: PROMOTE_FORREAL_SUCCESS });
        Swal.fire({
          title: 'Promoted!',
          html: response.data,
          // footer: 'To avoid mistakes, invalid cells are cleared immediately.',
          type: 'success',
          animation: false,
          confirmButtonText: 'Dismiss'
          // customClass: { content: 'alert' },
        });
      })
      .catch(error => {
        dispatch({ type: PROMOTE_FORREAL_FAIL });
        console.log(error);
        Swal.fire({
          title: 'Error',
          html: error.response.data,
          // footer: 'To avoid mistakes, invalid cells are cleared immediately.',
          type: 'error',
          animation: false,
          confirmButtonText: 'Dismiss'
          // customClass: { content: 'alert' },
        });
      });
  };
}

export function showShiftMessage() {
  return dispatch => {
    dispatch({
      type: 'SHOW_SHIFT_MESSAGE',
      message:
        'Selecting only works using CMD+Click or CTRL+Click, not with SHIFT+CLICK.'
    });
  };
}
