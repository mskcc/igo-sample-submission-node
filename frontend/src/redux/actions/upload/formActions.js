//TODO ERROR HANDLING
import axios from 'axios';

import { Config } from '../../../config.js';
import { services } from '../../../util/index.js';

export const MESSAGE = 'MESSAGE';

export const REQUEST_MATERIALS_AND_APPLICATIONS = 'REQUEST_MATERIALS_AND_APPLICATIONS';

export const RECEIVE_MATERIALS_AND_APPLICATIONS_SUCCESS = 'RECEIVE_MATERIALS_AND_APPLICATIONS_SUCCESS';

export const RECEIVE_MATERIALS_AND_APPLICATIONS_FAIL = 'RECEIVE_MATERIALS_AND_APPLICATIONS_FAIL';

export const REQUEST_INITIAL_STATE = 'REQUEST_INITIAL_STATE';

export const RECEIVE_INITIAL_STATE_SUCCESS = 'RECEIVE_INITIAL_STATE_SUCCESS';

export const RECEIVE_INITIAL_STATE_FAIL = 'RECEIVE_INITIAL_STATE_FAIL';
export const INITIAL_STATE_RETRIEVED = 'INITIAL_STATE_RETRIEVED';

export function getInitialState() {
    return (dispatch, getState) => {
        if (getState().upload.form.initialFetched) return dispatch({ type: INITIAL_STATE_RETRIEVED });
        else {
            dispatch({ type: REQUEST_INITIAL_STATE });
            return services
                .getHeaderValues('upload')
                .then((response) => {
                    return dispatch({
                        type: RECEIVE_INITIAL_STATE_SUCCESS,
                        form_data: response.payload,
                    });
                })
                .catch((error) => {
                    return dispatch({
                        type: RECEIVE_INITIAL_STATE_FAIL,
                        error: error,
                    });
                });
        }
    };
}

// get materials that can be combined with application
export const REQUEST_DATA_FOR_APPLICATION = 'REQUEST_DATA_FOR_APPLICATION';

export const SELECT_APPLICATION = 'SELECT_APPLICATION';

export const RECEIVE_DATA_FOR_APPLICATION_SUCCESS = 'RECEIVE_DATA_FOR_APPLICATION_SUCCESS';

export const RECEIVE_DATA_FOR_APPLICATION_FAIL = 'RECEIVE_DATA_FOR_APPLICATION_FAIL';

export function getMaterialsForApplication(selectedApplication, checkForMismatch = true) {
    return (dispatch) => {
        dispatch({ type: SELECT_APPLICATION, selectedApplication });
        dispatch({ type: REQUEST_DATA_FOR_APPLICATION });
        checkForMismatch && dispatch(checkForChange('application', selectedApplication));
        axios
            .get(Config.NODE_API_ROOT + '/upload/materialsAndSpecies', {
                params: {
                    // weird, legacy slash workaround, has to be changed in /LimsRest/getIntakeTerms
                    recipe: selectedApplication,
                },
            })
            .then((response) => {
                return dispatch({
                    type: RECEIVE_DATA_FOR_APPLICATION_SUCCESS,
                    materials: response.payload.materials,
                    species: response.payload.species,
                });
            })
            .catch((error) => {
                return dispatch({
                    type: RECEIVE_DATA_FOR_APPLICATION_FAIL,
                    error: error,
                });
            });
    };
}

export const UPDATE_HEADER = 'UPDATE_HEADER';

export function updateHeader(formValues) {
    return (dispatch) => {
        dispatch(getApplicationsForMaterial(formValues.material, false));
        dispatch(getMaterialsForApplication(formValues.application, false));
    };
}

export const SELECT = 'SELECT';

export function select(id, value, checkForMismatch = true) {
    return (dispatch) => {
        if (id === 'species' || id === 'container' || id === 'patientIdType' || id === 'patientIdTypeSpecified') {
            checkForMismatch && dispatch(checkForChange(id, value));
            return dispatch({
                type: SELECT,
                payload: { id: id, value: value },
            });
        }
        if (id === 'service_id') {
            return dispatch({
                type: SELECT,
                payload: { id: id, value: value },
                message: 'Service Id updated.',
            });
        }

        if (id === 'number_of_samples') {
            if (value > 199) {
                return dispatch({
                    type: SELECT,
                    payload: { id: id, value: value },
                    message:
                        'A sample set this large might lead to performance issues. We recommend keeping it below 200 and submitting mutliple requests if necessary.',
                });
            }
        }
        if (value === 'Expanded_Genomics') {
            return dispatch({
                type: SELECT,
                payload: { id: id, value: value },
                message: 'Select any container in the dropdown, you’ll be able to specify multiple containers in the submission grid.',
            });
        } else {
            return dispatch({ type: SELECT, payload: { id: id, value: value } });
        }
    };
}

export const CLEAR = 'CLEAR';

export function clear(id) {
    return (dispatch) => {
        return dispatch({ type: CLEAR, payload: { id: id } });
    };
}
export const CLEAR_FORM = 'CLEAR_FORM';
export function clearForm() {
    return (dispatch) => {
        dispatch({ type: CLEAR_FORM });
        dispatch(getInitialState()).then(() => {
            window.location.reload();
        });
    };
}

export const SELECT_MATERIAL = 'SELECT_MATERIAL';

export const REQUEST_APPLICATIONS_FOR_MATERIAL = 'REQUEST_APPLICATIONS_FOR_MATERIAL';

export const RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS = 'RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS';

export const RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL = 'RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL';

// get applications that can be combined with material
// SelectedMaterial impacts applications and containers, containers are filtered in FormContainer
export function getApplicationsForMaterial(selectedMaterial, checkForMismatch = true) {
    return (dispatch) => {
        dispatch({ type: SELECT_MATERIAL, selectedMaterial });
        dispatch({ type: REQUEST_APPLICATIONS_FOR_MATERIAL });
        checkForMismatch && dispatch(checkForChange('material', selectedMaterial));
        return axios
            .get(Config.NODE_API_ROOT + '/upload/applicationsAndContainers', {
                params: {
                    material: selectedMaterial,
                },
            })
            .then((response) => {
                return dispatch({
                    type: RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS,
                    applications: response.payload.applications,
                    containers: response.payload.containers,
                });
            })
            .catch((error) => {
                return dispatch({
                    type: RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL,
                    error: error,
                });
            });
    };
}

export const CLEAR_SPECIES = 'CLEAR_SPECIES';

export const clearSpecies = () => {
    return { type: CLEAR_SPECIES };
};

export const CLEAR_MATERIAL = 'CLEAR_MATERIAL';

export const clearMaterial = () => {
    return [{ type: CLEAR_MATERIAL }, { type: CLEARED }];
};

export const CLEAR_APPLICATION = 'CLEAR_APPLICATION';

export const clearApplication = () => {
    return [{ type: CLEAR_APPLICATION }, { type: CLEARED }];
};

export const CLEARED = 'CLEARED';
// timeout for CLEARED to show user loading animation to indicate change
export const cleared = () => {
    return (dispatch) => {
        return setTimeout(() => {
            dispatch({ type: CLEARED });
        }, 500);
    };
};

export const checkForChange = (field, value) => {
    return (dispatch, getState) => {
        if (getState().upload.grid.form[field] && getState().upload.grid.form[field] !== value) {
            dispatch({
                type: MESSAGE,
                message: 'Make sure to re-generate your table to persist this change.',
            });
        }
    };
};
