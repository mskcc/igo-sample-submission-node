import { util, swal, services } from '../../../util';

export const REQUEST_INITIAL_STATE_PROMOTE = 'REQUEST_INITIAL_STATE_PROMOTE';

export const RECEIVE_INITIAL_STATE_PROMOTE_SUCCESS = 'RECEIVE_INITIAL_STATE_PROMOTE_SUCCESS';

export const RECEIVE_INITIAL_STATE_PROMOTE_FAIL = 'RECEIVE_INITIAL_STATE_PROMOTE_FAIL';
export const INITIAL_STATE_PROMOTE_RETRIEVED = 'INITIAL_STATE_PROMOTE_RETRIEVED';

export function getPromoteGrid() {
    return (dispatch, getState) => {
        if (getState().promote.initialFetched) return dispatch({ type: INITIAL_STATE_PROMOTE_RETRIEVED });
        else {
            dispatch({ type: REQUEST_INITIAL_STATE_PROMOTE });
            services
                .promoteGrid()
                .then((response) => {
                    return dispatch({
                        type: RECEIVE_INITIAL_STATE_PROMOTE_SUCCESS,
                        grid: response.payload,
                    });
                })
                .catch((error) => {
                    return dispatch({
                        type: RECEIVE_INITIAL_STATE_PROMOTE_FAIL,
                        error: error,
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
            message: `Fetching Banked Samples for ${queryType}: ${query}...`,
        });

        services
            .loadBankedSamples(queryType, query)
            .then((response) => {
                // need to go with rowBackup and isEqual comparison to decide if changes happened because
                // handsontable changes do not trigger redux events
                let samples = response.payload.samples;
                let rows = samples.map((a) => Object.assign({}, a));
                // let rowsBackup = samples.map((a) => Object.assign({}, a));
                dispatch({
                    type: RECEIVE_BANKED_SAMPLES_SUCCESS,
                    // rows: util.rowsWithRowIndex(rows),
                    // we want the SPM team to see bankedSample.rowIndex while promoting
                    rows: rows,
                    // rowsBackup: util.rowsWithRowIndex(rowsBackup),
                    message: 'clear',
                });
                return response;
            })
            .catch((error) =>
                dispatch({
                    type: RECEIVE_BANKED_SAMPLES_FAIL,
                    error: error,
                })
            );
    };
}

export const PROMOTE_DRYRUN = 'PROMOTE_DRYRUN';

export const PROMOTE_DRYRUN_SUCCESS = 'PROMOTE_DRYRUN_SUCCESS';

export const PROMOTE_DRYRUN_FAIL = 'PROMOTE_DRYRUN_FAIL';

export function promoteDry(projectId, requestId, serviceId, materials, bankedSampleIds) {
    return (dispatch) => {
        dispatch({
            type: PROMOTE_DRYRUN,
            message: 'Determining promote method...',
        });
        let transactionId = util.getTransactionId();
        services
            .dryrun({
                projectId,
                requestId,
                serviceId,
                materials,
                bankedSampleIds: [bankedSampleIds[0]],
                dryrun: true,
                transactionId,
            })
            .then((response) => {
                dispatch({
                    type: PROMOTE_DRYRUN_SUCCESS,
                    message: 'clear',
                });
                swal.dryRunSuccess(response.payload.message).then((decision) => {
                    if (decision) {
                        dispatch(promoteForReal(projectId, requestId, serviceId, materials, bankedSampleIds, transactionId));
                    }
                });
            })
            .catch((error) => {
                return dispatch({
                    type: PROMOTE_DRYRUN_FAIL,
                    error: error,
                });
            });
    };
}
export const PROMOTE_FORREAL = 'PROMOTE_FORREAL';

export const PROMOTE_FORREAL_SUCCESS = 'PROMOTE_FORREAL_SUCCESS';

export const PROMOTE_FORREAL_FAIL = 'PROMOTE_FORREAL_FAIL';

export function promoteForReal(projectId, requestId, serviceId, materials, bankedSampleIds, transactionId) {
    return (dispatch) => {
        // let rows = getState().promote.rows
        dispatch({
            type: PROMOTE_FORREAL,
            message: 'Promoting...',
        });
        services
            .promote({
                projectId,
                requestId,
                serviceId,
                materials,
                bankedSampleIds: [bankedSampleIds],
                dryrun: false,
                transactionId,
            })
            .then((response) => {
                dispatch({ type: PROMOTE_FORREAL_SUCCESS, message: 'clear' });
                swal.genericMessage('success', response.payload.message);
            })
            .catch((error) => {
                dispatch({ type: PROMOTE_FORREAL_FAIL, message: 'clear' });

                let message = error.payload.message;
                if (message.includes('already been promoted')) {
                    message = message.replace('ERROR IN  PROMOTING BANKED SAMPLE: org.mskcc.limsrest.service.LimsException:', '');
                }
                swal.genericMessage('error', message);
            });
    };
}
