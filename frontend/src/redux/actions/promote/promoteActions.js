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

export function getInitialState() {
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
        let samples = response.payload.samples;
        let rows = samples.map(a => Object.assign({}, a));
        let rowsBackup = samples.map(a => Object.assign({}, a));
        dispatch({
          type: RECEIVE_BANKED_SAMPLES_SUCCESS,
          rows: rows,
          rowsBackup: rowsBackup
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

export const REQUEST_UPDATE_BANKED_SAMPLES = 'REQUEST_UPDATE_BANKED_SAMPLES';

export const RECEIVE_UPDATE_BANKED_SAMPLES_SUCCESS =
  'RECEIVE_UPDATE_BANKED_SAMPLES_SUCCESS';

export const RECEIVE_UPDATE_BANKED_SAMPLES_FAIL =
  'RECEIVE_UPDATE_BANKED_SAMPLES_FAIL';

export const REQUEST_PROMOTE_DRYRUN = 'REQUEST_PROMOTE_DRYRUN';

export const RECEIVE_PROMOTE_DRYRUN_SUCCESS = 'RECEIVE_PROMOTE_DRYRUN_SUCCESS';

export const RECEIVE_PROMOTE_DRYRUN_FAIL = 'RECEIVE_PROMOTE_DRYRUN_FAIL';
export const REQUEST_PROMOTE_FORREAL = 'REQUEST_PROMOTE_FORREAL';

export const RECEIVE_PROMOTE_FORREAL_SUCCESS =
  'RECEIVE_PROMOTE_FORREAL_SUCCESS';

export const RECEIVE_PROMOTE_FORREAL_FAIL = 'RECEIVE_PROMOTE_FORREAL_FAIL';

export function promoteSamples(projectId, requestId, rows, rowsBackup) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_PROMOTE_DRYRUN });
    if (!util.isEqual(rows, rowsBackup)) {
      axios
        .post(Config.API_ROOT + '/updateBankedSamples', {
          data: util.generateSubmitDataPromote(getState())
        })
        .then(response => {
          console.log(response);
          console.log(response.data);
          var rows = { ...response.data };
          var rowsBackup = { ...response.data };
          dispatch({
            type: RECEIVE_UPDATE_BANKED_SAMPLES_SUCCESS,
            rows: rows,
            rowsBackup: rowsBackup
          });

          return dispatch(promoteForReal(projectId, requestId));
        })
        .catch(error => {
          return dispatch({
            type: RECEIVE_PROMOTE_DRYRUN_FAIL,
            error: error
          });
        });
    } else {
      return dispatch(promoteForReal(projectId, requestId));
    }
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
        dispatch({ type: RECEIVE_PROMOTE_DRYRUN_SUCCESS });
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
            dispatch({ type: RECEIVE_PROMOTE_DRYRUN_SUCCESS });
          } else {
            console.log('dryrun false');
            dispatch({ type: REQUEST_PROMOTE_FORREAL });
            // it works!
            data.dryrun = false;
            // location.reload()
            axios
              .post(Config.API_ROOT + '/promoteBankedSample', {
                data: data
              })
              .then(response => {
                dispatch({ type: RECEIVE_PROMOTE_FORREAL_SUCCESS });
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
                  dispatch({ type: RECEIVE_PROMOTE_FORREAL_SUCCESS });
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
                  dispatch({ type: RECEIVE_PROMOTE_FORREAL_FAIL });
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
          type: RECEIVE_PROMOTE_DRYRUN_SUCCESS
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
          type: RECEIVE_PROMOTE_DRYRUN_FAIL
        });
      });
  };
}
