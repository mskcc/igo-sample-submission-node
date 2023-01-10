// actions should not have this much BL, will change once it gets too convoluted

import axios from 'axios';
import { util, swal, services, excel } from '../../../util';
import { getCohortServiceId } from '../../../util/helpers';

import { Config } from '../../../config.js';
import { dmpSelect } from '../dmp/dmpFormActions';

export const REGISTER_GRID_CHANGE = 'REGISTER_GRID_CHANGE';
export const REGISTER_GRID_CHANGE_PRE_VALIDATE = 'REGISTER_GRID_CHANGE_PRE_VALIDATE';
export const REGISTER_GRID_CHANGE_POST_VALIDATE = 'REGISTER_GRID_CHANGE_POST_VALIDATE';
export const SET_VALIDATION_MESSAGE = 'SET_VALIDATION_MESSAGE';
export const handleGridChange = (changes, gridType) => {
    return (dispatch, getState) => {
        dispatch({ type: REGISTER_GRID_CHANGE_PRE_VALIDATE, message: 'Validating...', loading: true });
        let {
            upload: { grid },
            submissions,
            user,
        } = getState();

        util.autoFillGridBasedOnInput(changes, grid).then((autofillResult) => {
            let autofilledChanges = autofillResult.autofilledChanges;
            let autofilledGrid = autofillResult.autofilledGrid;
            util.validateGrid(autofilledChanges, autofilledGrid).then((validationResult) => {
                console.log('VALIDATION DONE');
                let validatedGrid = validationResult.grid;

                const includesPatientIdChange = changes.some((element) => element.includes('patientId'));

                if (includesPatientIdChange) {
                    const patientIdType = grid.columnFeatures.find((element) => element.data === 'patientId');
                    let newPatientIds = util.getPatientIdsFromChanges(changes, patientIdType);
                    let emptyIds = newPatientIds.filter((element) => element.patientId === '');
                    validatedGrid.rows = util.clearIds(validatedGrid.rows, emptyIds);
                    // TODO REDACT empty ids from grid
                    let nonEmptyIds = newPatientIds.filter((element) => element.patientId !== '');
                    if (nonEmptyIds.length > 0) {
                        const containsMRNs = nonEmptyIds.some((element) => /^[0-9]{8}$/.test(element.patientId.trim()));
                        // Redact MRNs even before sending them off to be de-identified.
                        if (containsMRNs) {
                            validatedGrid = util.redactMRNsFromGrid(validationResult.grid);
                        }

                        dispatch({ type: REGISTER_GRID_CHANGE_PRE_VALIDATE, message: 'De-identifying IDs...', loading: true });

                        let username = submissions.submissionToEdit ? submissions.submissionToEdit.username : user.username;

                        handlePatientIds(validatedGrid, nonEmptyIds, emptyIds, username)
                            .then((patientIdResult) => {
                                validationResult = {
                                    ...validationResult,
                                    grid: { ...validatedGrid, rows: patientIdResult.rows },
                                    errorMessage: [...validationResult.errorMessage, ...patientIdResult.message],
                                    affectedRows: [...validationResult.affectedRows, ...patientIdResult.affectedRows],
                                };
                                let message = 'clear';
                                if (validationResult.errorMessage.length > 0)
                                    message = 'Validation Error. Check validation panel for more information.';
                                return dispatch({
                                    type: REGISTER_GRID_CHANGE_POST_VALIDATE,
                                    payload: validationResult,
                                    message: message,
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                validatedGrid.rows.map((element) => (element.patientId = ''));
                                dispatch({
                                    type: REGISTER_GRID_CHANGE_POST_VALIDATE,
                                    payload: validationResult,
                                    message: 'Error while de-identifying. Please try again or reach out to zzPDL_SKI_IGO_DATA@mskcc.org.',
                                });
                            });
                    } else {
                        return dispatch({
                            type: REGISTER_GRID_CHANGE_POST_VALIDATE,
                            payload: validationResult,
                            message: 'clear',
                        });
                    }
                } else {
                    let message = 'clear';
                    if (validationResult.errorMessage.length > 0)
                        message = 'Validation Error. Check validation panel for more information.';
                    return dispatch({
                        type: REGISTER_GRID_CHANGE_POST_VALIDATE,
                        payload: validationResult,
                        message: message,
                    });
                }
            });
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
export const GET_COLUMNS_FAIL = 'GET_COLUMNS_FAIL';

export function getColumns(page, formValues) {
    return (dispatch, getState) => {
        // let formValues = getState().upload.form.selected
        dispatch({ type: GET_COLUMNS });
        // no grid? get inital columns
        if (getState().upload.grid.columnFeatures.length === 0) {
            return dispatch(getInitialColumns(page, formValues));
        //check for dmp grid too
        } else if (getState().dmp.grid.columnFeatures.length === 0) {
            return dispatch(getInitialColumns(page, formValues));
        } else {
            let grid = getState().upload.grid;
            let diffValues = util.diff(grid.form, formValues);
            if (!diffValues || Object.entries(diffValues).length === 0) {
                swal.genericMessage('info', 'Nothing to change.');
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
                            return dispatch(getInitialColumns(page, formValues));
                        } else {
                            return dispatch({ type: NO_CHANGE_RESET });
                        }
                    });
                } else {
                    let message = 'Changing Material, Application, Species, Patient ID Type or Container causes the grid to be cleared and re-generated.';
                    if (grid.gridType === 'dmp') {
                        message = 'Changing Material, Application or iLabs Service ID causes the grid to be cleared and re-generated.';
                    }
                    swal.genericDecision(
                        'Are you sure?',
                        message
                    ).then((decision) => {
                        if (decision) {
                            return dispatch(getInitialColumns(page, formValues));
                        } else {
                            return dispatch({ type: NO_CHANGE_RESET });
                        }
                    });
                }
            }
        }
    };
}

export function getInitialColumns(page, formValues, adjustedMaterial) {
    return (dispatch) => {
        dispatch({ type: GET_INITIAL_COLUMNS, loading: true });
        let updatedFormValues = Object.assign({}, formValues);
        if (adjustedMaterial && adjustedMaterial !== '') {
            updatedFormValues.material = adjustedMaterial;
        } else {
            updatedFormValues.material = formValues.material;
        }
        let material = updatedFormValues.material;
        let application = updatedFormValues.application;
        let serviceId = updatedFormValues.serviceId;
        return axios
            .post(`${Config.NODE_API_ROOT}/${page}/grid`, {
                ...updatedFormValues,
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
                dispatch({
                    type: GET_COLUMNS_FAIL,
                    error: error,
                    application: application,
                    material: material,
                    serviceId: serviceId,
                });
                // NOTE this should only be hit on DMP submissions!
                if (error.payload && error.payload.message && error.payload.message.includes('already exists')) {
                    return swal
                                .serviceIdDecision(
                                    'iLabs Service ID Already Used',
                                    `The Service ID ${serviceId} has already been used. Please choose if you'd like to edit a past request, or create an additional request cohort. Cancel if you'd like to enter a different serviceId.`
                                )
                                .then((decision) => {
                                    // swal is a bit weird with 3 buttons
                                    // isConfirmed === request cohort
                                    if (decision.isConfirmed) {
                                        // Need to adjust serviceId for cohorts before creating submission
                                        const newServiceId = getCohortServiceId(serviceId);
                                        const newFormValues = {
                                            ...updatedFormValues,
                                            serviceId: newServiceId
                                        };
                                        return dispatch(handleDMPCohort(newFormValues));
                                    // isDenied === edit past submission
                                    } else if (decision.isDenied) {
                                        return window.location = 'https://igo.mskcc.org/sample-submission/#/sample-submission/submissions/dmp';
                                    }
                                });
                } else {
                    return error;
                }
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
        let page = ownProps.gridType;
        dispatch({ type: 'EDIT_SUBMISSION', loading: true });
        services
            .getSubmission(submissionId, page)
            .then((resp) => {
                let submission = resp.payload.submission;
                let formValues = submission.formValues;

                // adjust material for DMP DNA -> DNA (Sample Id only), etc
                let adjustedMaterial;
                if (page === 'dmp' && formValues.material === 'DNA') {
                    if (submission.gridValues[0].molecularPathologyAccessionNumber && submission.gridValues[0].molecularPathologyAccessionNumber !== '') {
                        adjustedMaterial = 'DNA (Molecular Accession Number only)';
                    } else {
                        adjustedMaterial = 'DNA (DMP Sample ID only)';
                    }
                }

                let columnPromise = dispatch(getInitialColumns(page, formValues, adjustedMaterial), getState().user.role);
                Promise.all([columnPromise])
                    .then(() => {
                        if (submission.appVersion !== Config.APP_VERSION) {
                            swal.genericMessage(
                                'Version Mismatch',
                                'The submission you are editing was created with an older version of this site. If you run into any issues, please reach out to <a href="mailto:zzPDL_SKI_IGO_Sample_and_Project_Management@mskcc.org?subject=SampleSubmission Version Issue">the IGO Sample and Project Management Team.</a>'
                            );
                        }
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
                    })
                    .catch((error) => {
                        return dispatch({
                            type: GET_SUBMISSION_TO_EDIT_FAIL,
                            error: error,
                        });
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

// TODO: Refactor, remove service calls from this and edit action to their own actions. merge the popolate tasks.
export const LOAD_FROM_DMP = 'LOAD_FROM_DMP';
export const LOAD_FROM_DMP_FAIL = 'LOAD_FROM_DMP_FAIL';
export const LOAD_FROM_DMP_SUCCESS = 'LOAD_FROM_DMP_SUCCESS';

export function loadFromDmp(dmpTrackingId, dmpSubmissionId, ownProps) {
    return (dispatch, getState) => {
        dispatch({ type: LOAD_FROM_DMP, message: 'Loading and parsing submission from DMP...', loading: true });
        const data = { dmpTrackingId, dmpSubmissionId };

        services
            .loadFromDmp(data)
            .then((resp) => {
                let page = 'upload';
                let submission = resp.payload.submission;
                let columnPromise = dispatch(getInitialColumns(page, submission.formValues), getState().user.role);
                Promise.all([columnPromise])
                    .then(() => {
                        dispatch({
                            type: LOAD_FROM_DMP_SUCCESS,
                            payload: {
                                ...submission,
                                gridType: page,
                            },
                            message: 'Parsed!',
                        });
                        dispatch({
                            type: SET_VALIDATION_MESSAGE,
                            payload: { errorMessage: resp.payload.issues, affectedRows: [] },
                            message: 'Parsed!',
                        });

                        return ownProps.history.push(`/${page}`);
                    })
                    .catch((error) => {
                        console.log(error);
                        return dispatch({
                            type: LOAD_FROM_DMP_FAIL,
                            error: error,
                        });
                    });
            })
            .catch((error) => {
                dispatch({
                    type: LOAD_FROM_DMP_FAIL,
                    error: error,
                });
                return error;
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

export const DOWNLOAD_GRID = 'DOWNLOAD_GRID';
export const DOWNLOAD_GRID_FAIL = 'DOWNLOAD_GRID_FAIL';
export const DOWNLOAD_GRID_SUCCESS = 'DOWNLOAD_GRID_SUCCESS';
export function downloadGrid() {
    return (dispatch, getState) => {
        dispatch({ type: DOWNLOAD_GRID });

        // clean material for DMP DNA options
        let material = getState().upload.grid.form.material;
        if (material === 'DNA (Molecular Accession Number only)' || material === 'DNA (DMP Sample ID only)') {
            material = 'DNA';
        }

        let rows = getState().upload.grid.rows;
        let columns = getState().upload.grid.columnFeatures;
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

export function handlePatientIds(grid, ids, emptyIds, username) {
    return new Promise((resolve, reject) => {
        let updatedGrid = JSON.parse(JSON.stringify(grid));
        let rows = updatedGrid.rows;
        rows = util.clearIds(rows, emptyIds);
        const data = { ids: JSON.stringify(ids), username: username };
        if (ids.length === 0) {
            resolve({ rows: rows });
        }
        return services
            .handlePatientIds(data)
            .then((response) => {
                let message = new Set([]);
                let affectedRows = [];
                let failedIds = response.payload.idResults.filter((element) => element.message);
                if (failedIds && failedIds.length > 0) {
                    failedIds.forEach((element) => {
                        message.add(element.message);
                        affectedRows.push(element.gridRowIndex);
                    });
                    message.add('You can use MRNs as Patient IDs for any Patient ID Type.');
                }
                message = Array.from(message);
                let result = { rows: util.setPatientIds(rows, response.payload.idResults), message, affectedRows };

                resolve(result);
            })
            .catch((error) => {
                reject({
                    error: error,
                    rows: util.redactMRNs(rows, ids),
                });
            });
    });
}

export function handleDMPCohort(formValues) {
    return (dispatch, getState) => {
        const newServiceId = formValues.serviceId;
        const newServiceIdNum = newServiceId.split('-')[1];
        dispatch(dmpSelect('serviceId', newServiceIdNum));
        dispatch(getColumns('dmp', formValues));
    };
}
