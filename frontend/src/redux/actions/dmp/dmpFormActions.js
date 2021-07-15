//TODO ERROR HANDLING
import axios from 'axios';
import { Config } from '../../../config.js';
import { services } from '../../../util/index.js';
export const REQUEST_DMP_HEADER = 'REQUEST_DMP_HEADER';

export const DMP_HEADER_SUCCESS = 'DMP_HEADER_SUCCESS';

export const DMP_HEADER_FAIL = 'DMP_HEADER_FAIL';
export const DMP_HEADER_RETRIEVED = 'DMP_HEADER_RETRIEVED';

export function dmpGetInitialState() {
    return (dispatch, getState) => {
        if (getState().dmp.form.initialFetched) return dispatch({ type: DMP_HEADER_RETRIEVED });
        else {
            dispatch({ type: REQUEST_DMP_HEADER });
            return services
                .getHeaderValues('dmp')
                .then((response) => {
                    dispatch({
                        type: DMP_HEADER_SUCCESS,
                        materials: response.payload.materials,
                        applications: response.payload.applications,
                        user: response.payload.user,
                    });
                    return response;
                })
                .catch((error) =>
                    dispatch({
                        type: DMP_HEADER_FAIL,
                        error: error,
                    })
                );
        }
    };
}

export const DMP_SELECT = 'DMP_SELECT';

export function dmpSelect(id, value) {
    return (dispatch) => {
        if (id === 'service_id') {
            return dispatch({
                type: DMP_SELECT,
                payload: { id: id, value: value },
                message: 'Service Id updated.',
            });
        }

        if (id === 'application' && value === 'WholeExomeSequencing') {
            return dispatch({
                type: DMP_SELECT,
                payload: { id: id, value: value },
                // message: 'Library message TBD.',
            });
        }
        if (id === 'material' && value === 'DNA') {
            return dispatch({
                type: DMP_SELECT,
                payload: { id: id, value: value },
                message:
                    'Please note that when requesting samples for transfer, the standard process is to first request sequenced libraries; gDNA can be requested after libraries are confirmed as depleted in the DMP.',
            });
        }
        // this is not working
        if (id === 'number_of_samples') {
            if (value > 199) {
                return dispatch({
                    type: DMP_SELECT,
                    payload: { id: id, value: value },
                    message:
                        'A sample set this large might lead to performance issues. We recommend keeping it below 200 and submitting mutliple requests if necessary.',
                });
            }
        } else {
            return dispatch({ type: DMP_SELECT, payload: { id: id, value: value } });
        }
    };
}

export const DMP_CLEAR = 'DMP_CLEAR';

export function dmpClear(id) {
    return (dispatch) => {
        return dispatch({ type: DMP_CLEAR, payload: { id: id } });
    };
}
export const DMP_CLEAR_FORM = 'DMP_CLEAR_FORM';
export function dmpClearForm() {
    return (dispatch) => {
        dispatch({ type: DMP_CLEAR_FORM });
        dispatch(dmpGetInitialState()).then(() => {
            window.location.reload();
        });
    };
}

export const DMP_CLEARED = 'DMP_CLEARED';
// timeout for CLEARED to show user loading animation to indicate change
export const cleared = () => {
    return (dispatch) => {
        return setTimeout(() => {
            dispatch({ type: DMP_CLEARED });
        }, 500);
    };
};

export const dmpCheckForChange = (field, value) => {
    return (dispatch, getState) => {
        if (getState().dmp.grid.form[field] && getState().dmp.grid.form[field] !== value) {
            dispatch({
                type: 'MESSAGE',
                message: 'Make sure to re-generate your table to persist this change.',
            });
        }
    };
};
