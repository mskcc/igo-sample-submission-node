// actions should not have this much BL, will change once it gets too convoluted

import axios from 'axios';
import { util, swal, services, excel } from '../../../util';

import { Config } from '../../../config.js';

export const REGISTER_GRID_CHANGE = 'REGISTER_GRID_CHANGE';
export const REGISTER_GRID_CHANGE_PRE_VALIDATE = 'REGISTER_GRID_CHANGE_PRE_VALIDATE';
export const REGISTER_GRID_CHANGE_POST_VALIDATE = 'REGISTER_GRID_CHANGE_POST_VALIDATE';
export const handleGridChange = (changes) => {
    return (dispatch, getState) => {
        dispatch({ type: REGISTER_GRID_CHANGE_PRE_VALIDATE, message: 'Validating...' });
        let {
            upload: { grid },
            submissions,
            user,
        } = getState();

        util.validateGrid(changes, grid).then((validationResult) => {
            console.log('VALIDATION DONE');

            const includesPatientIdChange = changes.some((element) => element.includes('patientId'));

            if (includesPatientIdChange) {
                dispatch({ type: REGISTER_GRID_CHANGE_PRE_VALIDATE, message: 'De-identifying IDs...' });
                const patientIdType = grid.columnFeatures.find((element) => element.data === 'patientId');
                let newPatientIds = util.getPatientIdsFromChanges(changes, patientIdType);
                let emptyIds = newPatientIds.filter((element) => element.patientId === '');
                validationResult.grid.rows = util.clearIds(validationResult.grid.rows, emptyIds);
                // TODO REDACT empty ids from grid
                let nonEmptyIds = newPatientIds.filter((element) => element.patientId !== '');
                let username = submissions.submissionToEdit ? submissions.submissionToEdit.username : user.username;
                if (nonEmptyIds.length > 0) {
                    const containsMRNs = nonEmptyIds.some((element) => /^[0-9]{8}$/.test(element.patientId.trim()));
                    // Redact MRNs even before sending them off to be de-identified.
                    if (containsMRNs) {
                        validationResult.grid = util.redactMRNsFromGrid(validationResult.grid);
                    }

                    handlePatientIds(validationResult.grid, nonEmptyIds, emptyIds, username)
                        .then((patientIdResult) => {
                            validationResult = {
                                ...validationResult,
                                grid: { ...validationResult.grid, rows: patientIdResult.rows },
                                errorMessage: [...validationResult.errorMessage, ...patientIdResult.validationResult.message],
                                affectedRows: [...validationResult.affectedRows, ...patientIdResult.validationResult.affectedRows],
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
                            validationResult.grid.rows.map((element) => (element.patientId = ''));
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
                if (validationResult.errorMessage.length > 0) message = 'Validation Error. Check validation panel for more information.';
                return dispatch({
                    type: REGISTER_GRID_CHANGE_POST_VALIDATE,
                    payload: validationResult,
                    message: message,
                });
            }
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
        dispatch({ type: GET_INITIAL_COLUMNS, loading: true });
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
                dispatch({
                    type: GET_COLUMNS_FAIL,
                    error: error,
                    application: application,
                    material: material,
                });
                return error;
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
                let columnPromise = dispatch(getInitialColumns(page, submission.formValues), getState().user.role);
                Promise.all([columnPromise])
                    .then(() => {
                        console.log(submission.appVersion);
                        console.log(Config.APP_VERSION);

                        if (submission.appVersion !== Config.APP_VERSION) {
                            swal.genericMessage(
                                'Previous Version',
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
export function loadFromDmp(trackingId, dmpSubmissionId, ownProps) {
    return (dispatch, getState) => {
        dispatch({ type: LOAD_FROM_DMP, message: 'Loading and parsing submission from DMP...', loading: true });
        const data = { trackingId, dmpSubmissionId };

        services
            .loadFromDmp(data)
            .then((resp) => {
                let page = 'upload';
                let submission = resp.payload.submission;
                let columnPromise = dispatch(getInitialColumns(page, submission.formValues), getState().user.role);
                Promise.all([columnPromise])
                    .then(() => {
                        let type = GET_SUBMISSION_TO_EDIT_SUCCESS;
                        dispatch({
                            type: type,
                            payload: {
                                ...submission,
                                gridType: page,
                            },
                            message: 'Parsed!',
                        });
                        let summary = '';
                        let filtered = resp.payload.issues.filter((element) => element);
                        let sampleMatch = filtered.filter((element) => 'sampleMatch' in element)[0];
                        summary += sampleMatch.sampleMatch;
                        filtered.map((element) => {
                            let issues = '';
                            Object.keys(element).forEach((key) => {
                                if (key !== 'sample' && element && element[key]) {
                                    issues += `<strong>${key}:</strong> ${element[key]}<br/>`;
                                }
                            });
                            summary += `<ul style="text-align:left;">Sample ${element.sample}<br/>${issues}</ul>`;
                        });
                        swal.genericMessage('info', `Parsing Summary: ${summary}`);
                        return ownProps.history.push(`/${page}`);
                    })
                    .catch((error) => {
                        return dispatch({
                            type: GET_SUBMISSION_TO_EDIT_FAIL,
                            error: error,
                        });
                    });

                return ownProps.history.push(`/${page}`);
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
                console.log(response);
                let validationResult = { message: [], affectedRows: [] };

                response.payload.idResults.forEach((element) => {
                    if ('result' in element && 'message' in element.result) {
                        validationResult.message.push(element.result.message);
                        validationResult.affectedRows.push(element.gridRowIndex);
                        console.log(element);
                    }
                });

                if (validationResult.message.length !== 0) {
                    validationResult.message.push(
                        'Please try MRN instead. You can enter MRNs in the current ID column without generating a new grid.'
                    );
                }
                resolve({
                    rows: util.setPatientIds(rows, response.payload.idResults),
                    validationResult,
                });
            })
            .catch((error) => {
                reject({
                    error: error,
                    rows: util.redactMRNs(rows, ids),
                });
            });
    });
}
