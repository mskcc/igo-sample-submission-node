/* eslint-disable quotes */
/* eslint-disable no-undef */
//TODO ERROR HANDLING
import axios from 'axios';

import { Config } from '../../../config.js';
import { services } from '../../../util/index.js';

import { reverseReadableRecipesLib } from '../../../util/constants';

export const MESSAGE = 'MESSAGE';

export const REQUEST_MATERIALS_AND_APPLICATIONS = 'REQUEST_MATERIALS_AND_APPLICATIONS';

export const REQUEST_READ_LENGTH = 'REQUEST_READ_LENGTH';

export const RECEIVE_READ_LENGTH_SUCCESS = 'RECEIVE_READ_LENGTH_SUCCESS';

export const RECEIVE_READ_LENGTH_FAIL = 'RECEIVE_READ_LENGTH_FAIL';


export const RECEIVE_MATERIALS_AND_APPLICATIONS_SUCCESS = 'RECEIVE_MATERIALS_AND_APPLICATIONS_SUCCESS';

export const RECEIVE_MATERIALS_AND_APPLICATIONS_FAIL = 'RECEIVE_MATERIALS_AND_APPLICATIONS_FAIL';

export const REQUEST_INITIAL_STATE = 'REQUEST_INITIAL_STATE';

export const RECEIVE_INITIAL_STATE_SUCCESS = 'RECEIVE_INITIAL_STATE_SUCCESS';

export const RECEIVE_INITIAL_STATE_FAIL = 'RECEIVE_INITIAL_STATE_FAIL';
export const INITIAL_STATE_RETRIEVED = 'INITIAL_STATE_RETRIEVED';
export const REQUEST_SPECIES= 'REQUEST_SPECIES';
export const RECEIVE_SPECIES_SUCCESS ='RECEIVE_SPECIES_SUCCESS';
export const REQUEST_NUCLEIC_ACID_TYPES = 'REQUEST_NUCLEIC_ACID_TYPES';
export const RECEIVE_NUCLEIC_ACID_TYPES_SUCCESS = 'RECEIVE_NUCLEIC_ACID_TYPES_SUCCESS';
export const RECEIVE_NUCLEIC_ACID_TYPES_FAIL = 'RECEIVE_NUCLEIC_ACID_TYPES_FAIL';
export const CLEAR_NUCLEIC_ACID_TYPES = 'CLEAR_NUCLEIC_ACID_TYPES';


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
                    recipe: reverseReadableRecipesLib[selectedApplication],
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

export const SELECT = 'SELECT';

export function select(id, value, checkForMismatch = true) {
    return (dispatch) => {
        if (id === 'species' || id === 'container' || id === 'patientIdType' || id === 'patientIdTypeSpecified' || id === 'sequencingReadLength') {
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
            if (value > 96) {
                return dispatch({
                    type: SELECT,
                    payload: { id: id, value: value },
                    message:
                        'A sample set this large might lead to performance issues. We recommend keeping it below 100 and submitting mutliple requests if necessary.',
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
        if (id === 'application') {
            dispatch({ type: CLEAR, payload: { id: 'capturePanel' } });
        }
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


export function fetchSpecies(application){
    return (dispatch) =>{
        dispatch ({ type :'REQUEST_SPECIES'});
        axios.get(`$ {Config.Node_API_ROOT}/species`,{params:{application}})
        .then((response)=>
        {
            dispatch({type: 'RECEIVE_SPECIES_SUCCESS',species:response.data,
                application:application
            });
            if (response.data.length===1)
            {
                dispatch(select('species',response.data[0]));
            }
        })
        .catch((error)=>{
            dispatch({
                type :'RECEIVE_SPECIES_FAIL',
                error:error
            });
        });
    };
}

export function handleApplicationChange(selectedApplication){
    return (dispatch) =>{
        dispatch ({ type :'SELECT_APPLICATION',selectedApplication});
        dispatch (fetchSpecies(selectedApplication));
        dispatch (fetchReadLength(selectedApplication));
    };
}


export function fetchNucleicAcidTypes(material, application) {
    return (dispatch) => {
        dispatch({ type: REQUEST_NUCLEIC_ACID_TYPES });
        
        return axios.get(`${Config.NODE_API_ROOT}/nucleic-acid-types`, {
            params: { material, application }
        })
        .then((response) => {
            const nucleicAcidTypes = response.data;
            console.log("✅ Redux: Received nucleic acid types from JS mapping:", nucleicAcidTypes);
            
            dispatch({
                type: RECEIVE_NUCLEIC_ACID_TYPES_SUCCESS,
                nucleicAcidTypes,
                material,
                application
            });
            
            // Auto-select if only one option
            if (nucleicAcidTypes && nucleicAcidTypes.length === 1) {
                dispatch(select('nucleicAcidTypeToExtract', nucleicAcidTypes[0]));
            }
        })
        .catch((error) => {
            dispatch({
                type: RECEIVE_NUCLEIC_ACID_TYPES_FAIL,
                error: error
            });
        });
    };
}

export const clearNucleicAcidTypes = () => {
    return { type: CLEAR_NUCLEIC_ACID_TYPES };
};

export function  fetchReadLength(application){
    return (dispatch) =>{
        dispatch ({ type :'REQUEST_READ_LENGTHS'});
        return axios.get(`${Config.NODE_API_ROOT}/readlength`,{params :{application}})
        .then((response) =>{
            const readLengths=response.data;
            dispatch({
                type :'RECEIVE_READ_LENGTHS_SUCCESS',
                readLengths
            });
            //auto fill 
            if(readLengths && readLengths.length ===1){
                dispatch(select('sequencingReadLength',readLengths[0]));
            }
        }
    ).catch((error)=>{
        dispatch({
            type:'RECEIVE_READ_LENGTHS_FAIL',
            error
        });
    });
    };
}



export const CLEAR_SPECIES = 'CLEAR_SPECIES';

export const clearSpecies = () => {
    return { type: CLEAR_SPECIES };
};

export const CLEAR_READ_LENGTHS = 'CLEAR_READ_LENGTHS';

export const clearReadLengths = () => {
    return [{ type: CLEAR_READ_LENGTHS }, { type: CLEARED }];;
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
        if (!getState().upload.grid.form[field] || getState().upload.grid.form[field] !== value) {
            dispatch({
                type: MESSAGE,
                message: 'Make sure to re-generate your table to persist this change.',
            });
        }
    };
};


