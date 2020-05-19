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
    dispatch({ type: REQUEST_BANKED_SAMPLES });

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
export const PROMOTE_DRYRUN_AND_UPDATE = 'PROMOTE_DRYRUN_AND_UPDATE';

export const PROMOTE_DRYRUN_SUCCESS = 'PROMOTE_DRYRUN_SUCCESS';

export const PROMOTE_DRYRUN_FAIL = 'PROMOTE_DRYRUN_FAIL';
export const PROMOTE_FORREAL = 'PROMOTE_FORREAL';

export const PROMOTE_FORREAL_SUCCESS =
  'PROMOTE_FORREAL_SUCCESS';

export const PROMOTE_FORREAL_FAIL = 'PROMOTE_FORREAL_FAIL';

export function promoteAction(projectId, requestId, rows, needsUpdate) {
  return dispatch => {
    if (needsUpdate) {
      dispatch({
        type: PROMOTE_DRYRUN_AND_UPDATE,
        message: 'Updating samples and determining ProjectId...'
      });
    } else dispatch({ type: PROMOTE_DRYRUN, message: 'Determining ProjectId...' });
    let transactionId = util.getTransactionId();
    let samples = JSON.stringify(rows);
    services
      .promoteDry({ projectId, requestId, transactionId, samples, needsUpdate })

      .then(response => {
        console.log(response);
        console.log(response.data);
        var rows = { ...response.data };
        var rowsBackup = { ...response.data };
        dispatch({
          type: 'UPDATE_BANKED_SAMPLES_SUCCESS',
          rows: rows,
          rowsBackup: rowsBackup
        });

        return dispatch(promoteForReal(projectId, requestId));
      })
      .catch(error => {
        return dispatch({
          type: PROMOTE_DRYRUN_FAIL,
          error: error
        });
      });
    // } else {
    //   return dispatch(promoteForReal(projectId, requestId));
    // }
  };
}

export function promoteForReal(
  projectId = '',
  requestId = '',
  rows,
  serviceId
) {
  return (dispatch, getState) => {
    // let rows = getState().promote.rows
    let bankedId = [];
    bankedId = rows.map(elem => {
      return elem.recordId;
    });
    let data = {
      projectId: projectId,
      requestId: requestId,
      serviceId: serviceId,
      bankedId: bankedId,
      dryrun: true
    };
    axios
      .post(Config.API_ROOT + '/promoteBankedSample', {
        data: data
      })
      .then(response => {
        console.log(response);
        dispatch({ type: PROMOTE_DRYRUN_SUCCESS });
        Swal.fire({
          title: response.data + '?',
          type: 'info',
          animation: false,
          showCancelButton: true,
          confirmButtonText: 'Okay!',
          confirmButtonColor: '#df4602',
          cancelButtonColor: '#007cba'
          // customClass: { content: 'alert' },
        }).then(result => {
          if (!result.value) {
            dispatch({ type: PROMOTE_DRYRUN_SUCCESS });
          } else {
            console.log('dryrun false');
            dispatch({ type: PROMOTE_FORREAL });
            // it works!
            data.dryrun = false;
            // location.reload()
            axios
              .post(Config.API_ROOT + '/promoteBankedSample', {
                data: data
              })
              .then(response => {
                dispatch({ type: PROMOTE_FORREAL_SUCCESS });
                console.log(response);
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
                if (
                  error.response &&
                  error.response.data &&
                  error.response.data.message &&
                  error.response.data.message.includes('Invalid characters')
                ) {
                  dispatch({ type: PROMOTE_FORREAL_SUCCESS });
                  Swal.fire({
                    title: 'Promoted!',
                    // html: response.data,
                    // footer: 'To avoid mistakes, invalid cells are cleared immediately.',
                    type: 'success',
                    animation: false,
                    confirmButtonText: 'Dismiss'
                    // customClass: { content: 'alert' },
                  });
                } else {
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
                }
              });
          }
        });
        return dispatch({
          type: PROMOTE_DRYRUN_SUCCESS
        });
      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          html:
            'Something went wrong. Please tell Lisa or Anna to check the logs.',
          // footer: 'To avoid mistakes, invalid cells are cleared immediately.',
          type: 'error',
          animation: false,
          confirmButtonText: 'Dismiss'
          // customClass: { content: 'alert' },
        });
        return dispatch({
          type: PROMOTE_DRYRUN_FAIL
        });
      });
  };
}
