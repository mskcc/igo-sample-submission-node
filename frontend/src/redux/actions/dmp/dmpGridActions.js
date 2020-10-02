// actions should not have this much BL, will change once it gets too convoluted
import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { util, swal, services, excel } from '../../../util';

import { Config } from '../../../config.js';

export const DMP_REGISTER_GRID_CHANGE = 'DMP_REGISTER_GRID_CHANGE';
export const DMP_REGISTER_GRID_CHANGE_PRE_VALIDATE = 'DMP_REGISTER_GRID_CHANGE_PRE_VALIDATE';

export const DMP_REGISTER_GRID_CHANGE_POST_VALIDATE = 'DMP_REGISTER_GRID_CHANGE_POST_VALIDATE';
export const RESET_MESSAGE = 'RESET_MESSAGE';
export const dmphandleGridChange = (changes) => {
    return (dispatch, getState) => {
        let result = validateGrid(changes, getState().dmp.grid);
        // dispatch({ type: RESET_MESSAGE })
        // would prefer to have this in reducer
        if (result.numErrors > 1) {

            return dispatch({
                type: DMP_REGISTER_GRID_CHANGE_POST_VALIDATE,
                payload: result,
                message: 'reset',
            });
        } else {
            return dispatch({
                type: DMP_REGISTER_GRID_CHANGE_POST_VALIDATE,
                payload: result,
                message: result.errorMessage.replace(/<br>/g, ''),
            });
        }
    };
};


export const DMP_GET_COLUMNS = 'DMP_GET_COLUMNS';
export const DMP_GET_INITIAL_COLUMNS = 'DMP_GET_INITIAL_COLUMNS';

export const DMP_NO_CHANGE = 'DMP_NO_CHANGE';
export const DMP_NO_CHANGE_RESET = 'DMP_NO_CHANGE_RESET';

export const DMP_UPDATE_NUM_OF_ROWS = 'DMP_UPDATE_NUM_OF_ROWS';
export const DMP_UPDATE_NUM_OF_ROWS_SUCCESS = 'DMP_UPDATE_NUM_OF_ROWS_SUCCESS';

export const DMP_GET_COLUMNS_FROM_CACHE = 'DMP_GET_COLUMNS_FROM_CACHE';
export const DMP_GET_COLUMNS_SUCCESS = 'DMP_GET_COLUMNS_SUCCESS';
// export const DMP_GET_COLUMNS_INVALID_COMBINATION = 'DMP_GET_COLUMNS_INVALID_COMBINATION'
export const DMP_GET_COLUMNS_FAIL = 'DMP_GET_COLUMNS_FAIL';

export function dmpGetColumns(formValues) {
    return (dispatch, getState) => {
        // let formValues = getState().upload.form.selected
        dispatch({ type: DMP_GET_COLUMNS });

        // no grid? get inital columns
        if (getState().dmp.grid.columnFeatures.length === 0) {
            return dispatch(getInitialColumns(formValues, getState().user.role));
        } else {
            let diffValues = util.diff(getState().dmp.grid.form, formValues);
            if (!diffValues || Object.entries(diffValues).length === 0) {
                swal.nothingToChange();

                dispatch({ type: DMP_NO_CHANGE });
                return setTimeout(() => {
                    dispatch({ type: DMP_NO_CHANGE_RESET });
                }, 1000);
            }

            //#samples -> #number rows, rest same, only update rows number
            else if (Object.entries(diffValues).length === 1 && 'number_of_samples' in diffValues) {
                dispatch({ type: DMP_UPDATE_NUM_OF_ROWS });

                let rows = util.updateRows(formValues, getState().dmp.grid);
                return dispatch({
                    type: DMP_UPDATE_NUM_OF_ROWS_SUCCESS,
                    message: 'Number of rows updated.',
                    rows: rows,
                    form: formValues,
                });
            } else {
                Swal.fire({
                    title: 'Are you sure?',
                    text:
                        'Changing Material, Application, Species, Patient ID Type or Container causes the grid to be cleared and re-generated.',
                    type: 'warning',
                    showCancelButton: true,
                    animation: false,
                    confirmButtonColor: '#df4602',
                    cancelButtonColor: '#007cba',
                    confirmButtonText: 'Yes, re-generate!',
                }).then((result) => {
                    if (result.value) {
                        return dispatch(getInitialColumns(formValues, getState().user.role));
                    } else {
                        return dispatch({ type: DMP_NO_CHANGE_RESET });
                    }
                });
            }
        }
    };
}

export function dmpGetInitialColumns(formValues, userRole) {
    return (dispatch) => {
        dispatch({ type: DMP_GET_INITIAL_COLUMNS });
        let material = formValues.material;
        let application = formValues.application;
        return axios
            .post(Config.NODE_API_ROOT + '/upload/grid', {
                ...formValues,
            })
            .then((response) => {
                let data = response.payload;
                return dispatch({
                    type: DMP_GET_COLUMNS_SUCCESS,
                    columnHeaders: data.columnHeaders,
                    columnFeatures: data.columnFeatures,
                    hiddenColumns: data.hiddenColumns,
                    rows: data.rowData,
                    form: formValues,
                    message: 'Grid generated for ' + material + ' for ' + application + '. Green columns are optional.',
                });
            })
            .catch((error) => {
                return dispatch({
                    type: DMP_GET_COLUMNS_FAIL,
                    error: error,
                    application: application,
                    material: material,
                });
            });
    };
}

export const DECREASE_ROW_NUMBER_SUCCESS = 'DECREASE_NUMBER_SUCCESS';
export function decreaseRowNumber(change, newRowNumber) {
    return (dispatch, getState) => {
        let newRows = util.decreaseRowNumber(getState().dmp.grid.rows, change);

        return dispatch({
            type: DECREASE_ROW_NUMBER_SUCCESS,
            rows: newRows,
            rowNumber: newRowNumber,
        });
    };
}

export const INCREASE_ROW_NUMBER_REQUEST = 'INCREASE_ROW_NUMBER_REQUEST';
export const INCREASE_ROW_NUMBER_FAIL = 'INCREASE_ROW_NUMBER_FAIL';
export const INCREASE_ROW_NUMBER_SUCCESS = 'INCREASE_ROW_NUMBER_SUCCESS';
export function increaseRowNumber(prevRowNumber, newRowNumber) {
    return (dispatch, getState) => {
        let columnFeatures = getState().dmp.grid.columnFeatures;
        let formValues = getState().upload.form.selected;
        let data = util.generateAdditionalRowData(columnFeatures, formValues, prevRowNumber, newRowNumber);
        services
            .getAdditionalRows(data)
            .then((resp) => {
                return dispatch({
                    type: INCREASE_ROW_NUMBER_SUCCESS,
                    additionalRows: resp.payload.additionalRows,
                    rowNumber: newRowNumber,
                    message: 'Loaded!',
                });
            })
            .catch((error) => {
                return dispatch({
                    type: INCREASE_ROW_NUMBER_FAIL,
                    error: error,
                });
            });
    };
}

export const HANDLE_PATIENT_ID = 'HANDLE_PATIENT_ID';
export const HANDLE_PATIENT_ID_FAIL = 'HANDLE_PATIENT_ID_FAIL';
export const HANDLE_PATIENT_ID_SUCCESS = 'HANDLE_PATIENT_ID_SUCCESS';
export function handlePatientId(rowIndex) {
    return (dispatch, getState) => {
        let patientId = getState().dmp.grid.rows[rowIndex].patientId;
        let normalizedPatientID = '';
        let rows = getState().dmp.grid.rows;
        let patientIdType = getState().dmp.grid.columnFeatures.find((element) => element.data === 'patientId');
        dispatch({ type: 'HANDLE_PATIENT_ID' });
        if (patientId === '') {
            return dispatch({
                type: HANDLE_PATIENT_ID_SUCCESS,
                rows: redactMRN(rows, rowIndex, '', '', ''),
            });
        }
        // handle as MRN whenever 8 digit id is entered
        // validation necessary because this fct is triggered before any handsontable validation would be
        let regex = new RegExp(patientIdType.pattern);
        let isValidId = regex.test(patientId);

        if (!isValidId) {
            dispatch({
                type: HANDLE_PATIENT_ID_FAIL,
                message: `${patientIdType.columnHeader}: ${patientIdType.error}`,
                rows: redactMRN(rows, rowIndex, '', '', ''),
            });
        } else {
            normalizedPatientID = util.normalizePatientId(patientId, patientIdType, getState().user.username);
            return services
                .mrnToCid({
                    patientId: normalizedPatientID,
                })

                .then((response) => {
                    dispatch({
                        type: HANDLE_PATIENT_ID_SUCCESS,
                        rows: util.createPatientId(rows, rowIndex, response.payload.patientId, normalizedPatientID),
                    });
                    dispatch({ type: DMP_REGISTER_GRID_CHANGE });
                })
                .catch((error) => {
                    dispatch({
                        type: HANDLE_PATIENT_ID_FAIL,
                        error: error,
                        rows: redactMRN(rows, rowIndex, '', '', ''),
                    });
                });
        }
    };
}


// export const HANDLE_CLEAR = 'HANDLE_CLEAR'
// export const HANDLE_CLEAR_FAIL = 'HANDLE_CLEAR_FAIL'
export const HANDLE_CLEAR_SUCCESS = 'HANDLE_CLEAR_SUCCESS';
export function handleClear() {
    return (dispatch, getState) => {
        return dispatch({
            type: HANDLE_CLEAR_SUCCESS,
            rows: generateRows(getState().dmp.grid.columnFeatures, getState().dmp.grid.form, getState().dmp.grid.rows.length),
        });
    };
}

export const DOWNLOAD_GRID = 'DOWNLOAD_GRID';
export const DOWNLOAD_GRID_FAIL = 'DOWNLOAD_GRID_FAIL';
export const DOWNLOAD_GRID_SUCCESS = 'DOWNLOAD_GRID_SUCCESS';
export function downloadGrid() {
    return (dispatch, getState) => {
        dispatch({ type: DOWNLOAD_GRID });
        let gridJson = JSON.stringify(getState().dmp.grid.rows);
        let material = getState().dmp.grid.form.material;
        let application = getState().dmp.grid.form.application;
        let data = {
            grid: gridJson,
            material: material,
            application: application,
        };
        services
            .downloadGrid(data)
            .then((response) => {
                excel.downloadExcel(response.payload.excelData, response.payload.fileName);
                return dispatch({
                    type: DOWNLOAD_GRID_SUCCESS,
                });
            })
            .catch((error) => {
                return dispatch({
                    type: DOWNLOAD_GRID_FAIL,
                    error: error,
                });
            });
    };
}

export const RESET_GRID_ERROR_MESSAGE = 'RESET_GRID_ERROR_MESSAGE';

// Resets the currently visible error message.
export const resetGridErrorMessage = () => ({
    type: RESET_GRID_ERROR_MESSAGE,
});
