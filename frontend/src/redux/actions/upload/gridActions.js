// actions should not have this much BL, will change once it gets too convoluted

import axios from 'axios';
import { updateHeader } from './formActions';
import { updateDmpHeader } from '../dmp/dmpFormActions';
import { util, swal, services, excel } from '../../../util';

import { Config } from '../../../config.js';

export const REGISTER_GRID_CHANGE = 'REGISTER_GRID_CHANGE';
export const REGISTER_GRID_CHANGE_PRE_VALIDATE = 'REGISTER_GRID_CHANGE_PRE_VALIDATE';

export const REGISTER_GRID_CHANGE_POST_VALIDATE = 'REGISTER_GRID_CHANGE_POST_VALIDATE';
export const RESET_MESSAGE = 'RESET_MESSAGE';
export const registerGridChange = (changes) => {
    return (dispatch, getState) => {
        let result = util.validateGrid(changes, getState().upload.grid);
        // dispatch({ type: RESET_MESSAGE })
        // would prefer to have this in reducer
        if (result.numErrors > 1) {
            swal.invalidValues(result.errorMessage);
            return dispatch({
                type: REGISTER_GRID_CHANGE_POST_VALIDATE,
                payload: result,
                message: 'reset',
            });
        } else {
            return dispatch({
                type: REGISTER_GRID_CHANGE_POST_VALIDATE,
                payload: result,
                message: result.errorMessage.replace(/<br>/g, ''),
            });
        }
    };
};

export const preValidate = () => {
    return (dispatch) => {
        dispatch({
            type: REGISTER_GRID_CHANGE_PRE_VALIDATE,
            message: 'Pasting large set, please be patient.',
        });
    };
};

export const GET_COLUMNS = 'GET_COLUMNS';
export const GET_INITIAL_COLUMNS = 'GET_INITIAL_COLUMNS';

export const NO_CHANGE = 'NO_CHANGE';
export const NO_CHANGE_RESET = 'NO_CHANGE_RESET';

export const UPDATE_NUM_OF_ROWS = 'UPDATE_NUM_OF_ROWS';
export const UPDATE_NUM_OF_ROWS_SUCCESS = 'UPDATE_NUM_OF_ROWS_SUCCESS';

export const GET_COLUMNS_FROM_CACHE = 'GET_COLUMNS_FROM_CACHE';
export const GET_COLUMNS_SUCCESS = 'GET_COLUMNS_SUCCESS';
// export const GET_COLUMNS_INVALID_COMBINATION = 'GET_COLUMNS_INVALID_COMBINATION'
export const GET_COLUMNS_FAIL = 'GET_COLUMNS_FAIL';

export function getColumns(page, formValues) {
    return (dispatch, getState) => {
        // let formValues = getState().upload.form.selected
        dispatch({ type: GET_COLUMNS });
        // no grid? get inital columns
        if (getState().upload.grid.columnFeatures.length === 0) {
            return dispatch(getInitialColumns(page, formValues, getState().user.role));
        } else {
            let grid = getState().upload.grid;
            let diffValues = util.diff(grid.form, formValues);
            if (!diffValues || Object.entries(diffValues).length === 0) {
                swal.nothingToChange();

                dispatch({ type: NO_CHANGE });
                return setTimeout(() => {
                    dispatch({ type: NO_CHANGE_RESET });
                }, 1000);
            }

            //#samples -> #number rows, rest same, only update rows number
            else if (Object.entries(diffValues).length === 1 && 'number_of_samples' in diffValues) {
                dispatch({ type: UPDATE_NUM_OF_ROWS });

                let rows = util.updateRows(formValues, grid);
                return dispatch({
                    type: UPDATE_NUM_OF_ROWS_SUCCESS,
                    message: 'Number of rows updated.',
                    rows: rows,
                    form: formValues,
                });
            } else {
                if (page !== grid.gridType) {
                    swal.genericDecision(
                        'Are you sure?',
                        'It looks like you have an open submission in another tab. If you generate this grid, the other grid will be cleared.'
                    ).then((decision) => {
                        if (decision) {
                            return dispatch(getInitialColumns(page, formValues, getState().user.role));
                        } else {
                            return dispatch({ type: NO_CHANGE_RESET });
                        }
                    });
                } else {
                    swal.genericDecision(
                        'Are you sure?',
                        'Changing Material, Application, Species, Patient ID Type or Container causes the grid to be cleared and re-generated.'
                    ).then((decision) => {
                        if (decision) {
                            return dispatch(getInitialColumns(page, formValues, getState().user.role));
                        } else {
                            return dispatch({ type: NO_CHANGE_RESET });
                        }
                    });
                }
            }
        }
    };
}

export function getInitialColumns(page, formValues, userRole) {
    return (dispatch) => {
        dispatch({ type: GET_INITIAL_COLUMNS });
        let material = formValues.material;
        let application = formValues.application;
        return axios
            .post(`${Config.NODE_API_ROOT}/${page}/grid`, {
                ...formValues,
            })
            .then((response) => {
                let data = response.payload;
                return dispatch({
                    type: GET_COLUMNS_SUCCESS,
                    gridType: page,
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
                    type: GET_COLUMNS_FAIL,
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
        let newRows = util.decreaseRowNumber(getState().upload.grid.rows, change);

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
        let columnFeatures = getState().upload.grid.columnFeatures;
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

export const EDIT_SUBMISSION = 'EDIT_SUBMISSION';
export const GET_SUBMISSION_TO_EDIT_FAIL = 'GET_SUBMISSION_TO_EDIT_FAIL';
export const GET_SUBMISSION_TO_EDIT_SUCCESS = 'GET_SUBMISSION_TO_EDIT_SUCCESS';
export const EDIT_DMP_SUBMISSION = 'EDIT_DMP_SUBMISSION';
export const GET_DMP_SUBMISSION_TO_EDIT_FAIL = 'GET_DMP_SUBMISSION_TO_EDIT_FAIL';
export const GET_DMP_SUBMISSION_TO_EDIT_SUCCESS = 'GET_DMP_SUBMISSION_TO_EDIT_SUCCESS';
export function populateGridFromSubmission(submissionId, ownProps) {
    return (dispatch, getState) => {
<<<<<<< HEAD
        let page = ownProps.gridType;
        dispatch({ type: 'EDIT_SUBMISSION', message: 'Loading...' });
        services
            .getSubmission(submissionId, page)
            .then((resp) => {
                let submission = resp.payload.submission;
                dispatch(getInitialColumns(page, submission.formValues), getState().user.role)
                    .then(() => {
                        if (page !== 'dmp') {
                            dispatch(updateHeader(submission.formValues));
                        }
                    })
                    .then(() => {
                        let type = page === 'dmp' ? GET_DMP_SUBMISSION_TO_EDIT_SUCCESS : GET_SUBMISSION_TO_EDIT_SUCCESS;
                        dispatch({
                            type: type,
                            payload: {
                                ...submission,
                                gridType: page,
                            },
                            message: 'Loaded!',
                        });
                        return ownProps.history.push(`/${page}`);
=======
        dispatch({ type: 'EDIT_SUBMISSION', message: 'Loading...' });
        services
            .getSubmission(submissionId)
            .then((resp) => {
                let submission = resp.payload.submission;

                dispatch(getInitialColumns('upload', submission.formValues), getState().user.role)
                    .then(dispatch(updateHeader(submission.formValues)))
                    .then(() => {
                        dispatch({
                            type: GET_SUBMISSION_TO_EDIT_SUCCESS,
                            payload: submission,
                            message: 'Loaded!',
                        });
                        return ownProps.history.push('upload');
>>>>>>> cf6d6f8f0e8e0615fff970429bf6e51a8c2cc483
                    });
            })
            .catch((error) => {
                return dispatch({
                    type: GET_SUBMISSION_TO_EDIT_FAIL,
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
        const patientId = getState().upload.grid.rows[rowIndex].patientId.trim();
        let rows = getState().upload.grid.rows;
        const patientIdType = getState().upload.grid.columnFeatures.find((element) => element.data === 'patientId');
        dispatch({ type: 'HANDLE_PATIENT_ID' });
        if (patientId === '') {
            return dispatch({
                type: HANDLE_PATIENT_ID_SUCCESS,
                rows: util.redactMRN(rows, rowIndex, '', '', ''),
            });
        }
        // simply handle as MRN whenever 8 digit id is entered
        if (/^[0-9]{8}$/.test(patientId.trim())) {
            return dispatch(handleMRN(patientId, patientIdType, rows, rowIndex));
        }
        // validation necessary because this action is triggered before any handsontable validation would be
        let regex = new RegExp(patientIdType.pattern);
        let isValidId = regex.test(patientId);
        if (!isValidId) {
            dispatch({
                type: HANDLE_PATIENT_ID_FAIL,
                message: `${patientIdType.columnHeader}: ${patientIdType.error}`,
                rows: util.redactMRN(rows, rowIndex, '', '', ''),
            });
        } else {
            switch (patientIdType.columnHeader) {
                case 'CMO ID':
                    return dispatch(handleCmoId(patientId, rows, rowIndex));
                case 'DMP ID':
                    return dispatch(handleDmpId(patientId, rows, rowIndex));
                case 'Cell Line Name':
                    return dispatch(anonymizeId(patientId, 'cellline', rows, rowIndex));
                case 'MRN':
                    // should never reach this because we check for MRN regex match first - just in case
                    return dispatch(handleMRN(patientId, patientIdType, rows, rowIndex));
                default:
                    return dispatch(anonymizeId(patientId, 'investigator', rows, rowIndex));
            }
        }
    };
}

function anonymizeId(patientId, type, rows, rowIndex) {
    return (dispatch) => {
        return services
            .patientIdToCid({
                patientId: patientId,
                type: type,
            })
            .then((response) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_SUCCESS,
                    rows: util.createPatientId(rows, rowIndex, response.payload.patientId, response.payload.normalizedPatientId),
                });
                dispatch({ type: REGISTER_GRID_CHANGE });
            })
            .catch((error) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_FAIL,
                    error: error,
                    rows: util.redactMRN(rows, rowIndex, '', '', ''),
                });
            });
    };
}

function handleCmoId(patientId, rows, rowIndex) {
    return (dispatch) => {
        // CMO IDs have a 'C-' prefix in the LIMS but not in CRDB, which we use to verify
        const cmoId = patientId.replace('C-', '');
        return services
            .verifyCmoId({
                cmoId: cmoId,
            })
            .then((response) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_SUCCESS,
                    rows: util.createPatientId(rows, rowIndex, response.payload.patientId, response.payload.normalizedPatientId),
                });
                dispatch({ type: REGISTER_GRID_CHANGE });
            })
            .catch((error) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_FAIL,
                    error: error,
                    rows: util.redactMRN(rows, rowIndex, '', '', ''),
                });
            });
    };
}

function handleMRN(patientId, patientIdType, rows, rowIndex) {
    return (dispatch) => {
        return services
            .mrnToCid({
                patientId: patientId,
            })
            .then((response) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_SUCCESS,
                    rows: util.redactMRN(rows, rowIndex, response.payload.patientId, 'MRN REDACTED', response.payload.sex),
                });
                dispatch({ type: REGISTER_GRID_CHANGE });
            })
            .catch((error) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_FAIL,
                    error: error,
                    rows: util.redactMRN(rows, rowIndex, '', '', ''),
                });
            });
    };
}

function handleDmpId(patientId, rows, rowIndex) {
    return (dispatch) => {
        return services
            .verifyDmpId({
                dmpId: patientId,
            })

            .then((response) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_SUCCESS,
                    rows: util.createPatientId(rows, rowIndex, response.payload.cmoPatientId, response.payload.normalizedPatientId),
                });
                dispatch({ type: REGISTER_GRID_CHANGE });
            })
            .catch((error) => {
                dispatch({
                    type: HANDLE_PATIENT_ID_FAIL,
                    error: error,
                    rows: util.redactMRN(rows, rowIndex, '', '', ''),
                });
            });
    };
}

export const HANDLE_ASSAY = 'HANDLE_ASSAY';
export const HANDLE_ASSAY_FAIL = 'HANDLE_ASSAY_FAIL';
export const HANDLE_ASSAY_SUCCESS = 'HANDLE_ASSAY_SUCCESS';
export function handleAssay(rowIndex, colIndex, oldValue, newValue) {
    return (dispatch, getState) => {
        return dispatch({
            type: HANDLE_ASSAY_SUCCESS,
            rows: util.appendAssay(
                getState().upload.grid.rows,
                rowIndex,
                oldValue,
                newValue,
                getState().upload.grid.columnFeatures[colIndex].source
            ),
        });
    };
}

export const HANDLE_TUMOR_TYPE = 'HANDLE_TUMOR_TYPE';
export const HANDLE_TUMOR_TYPE_FAIL = 'HANDLE_TUMOR_TYPE_FAIL';
export const HANDLE_TUMOR_TYPE_SUCCESS = 'HANDLE_TUMOR_TYPE_SUCCESS';
export function handleTumorType(rowIndex, colIndex, oldValue, newValue) {
    return (dispatch, getState) => {
        return dispatch({
            type: HANDLE_TUMOR_TYPE_SUCCESS,
            rows: util.translateTumorTypes(
                getState().upload.grid.rows,
                getState().upload.grid.columnFeatures[colIndex].source,
                rowIndex,
                oldValue,
                newValue
            ),
        });
    };
}

// export const HANDLE_CLEAR = 'HANDLE_CLEAR'
// export const HANDLE_CLEAR_FAIL = 'HANDLE_CLEAR_FAIL'
export const HANDLE_CLEAR_SUCCESS = 'HANDLE_CLEAR_SUCCESS';
export function handleClear() {
    return (dispatch, getState) => {
        return dispatch({
            type: HANDLE_CLEAR_SUCCESS,
            rows: util.generateRows(getState().upload.grid.columnFeatures, getState().upload.grid.form, getState().upload.grid.rows.length),
        });
    };
}

export const HANDLE_INDEX_SUCCESS = 'HANDLE_INDEX_SUCCESS';
export const HANDLE_INDEX_FAIL = 'HANDLE_INDEX_FAIL';
export function handleIndex(colIndex, rowIndex, newValue) {
    return (dispatch, getState) => {
        let indexSeq = util.findIndexSeq(getState().upload.grid, colIndex, rowIndex, newValue);
        if (indexSeq.success) {
            return dispatch({
                type: HANDLE_INDEX_SUCCESS,
                rows: indexSeq.rows,
            });
        } else {
            return dispatch({
                type: HANDLE_INDEX_FAIL,
                message: 'Index Sequence could not be found. Are you sure the Index ID is correct?',
            });
        }
    };
}

export const DOWNLOAD_GRID = 'DOWNLOAD_GRID';
export const DOWNLOAD_GRID_FAIL = 'DOWNLOAD_GRID_FAIL';
export const DOWNLOAD_GRID_SUCCESS = 'DOWNLOAD_GRID_SUCCESS';
export function downloadGrid() {
    return (dispatch, getState) => {
        dispatch({ type: DOWNLOAD_GRID });
        let rows = getState().upload.grid.rows;
        let columns = getState().upload.grid.columnFeatures;
        let material = getState().upload.grid.form.material;
        let application = getState().upload.grid.form.application;
        let data = {
            columns: columns,
            rows: rows,
            material: material,
            application: application,
        };
        excel.downloadExcelTest(data);
    };
}

export const RESET_GRID_ERROR_MESSAGE = 'RESET_GRID_ERROR_MESSAGE';

// Resets the currently visible error message.
export const resetGridErrorMessage = () => ({
    type: RESET_GRID_ERROR_MESSAGE,
});
