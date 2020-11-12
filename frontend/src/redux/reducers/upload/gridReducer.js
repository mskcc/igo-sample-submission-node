import { gridActions as ActionTypes } from '../../actions/';
import { formActions as FormActionTypes } from '../../actions/';
import { submissionActions as SubmissionActionTypes } from '../../actions/';
import { initialGridState } from '../initialState';

export default function gridReducer(state = initialGridState, action) {
    switch (action.type) {
        case ActionTypes.RESET_GRID_ERROR_MESSAGE:
            return {
                ...state,
                error: '',
            };
        case ActionTypes.REGISTER_GRID_CHANGE:
            return {
                ...state,
            };

        case ActionTypes.REGISTER_GRID_CHANGE_PRE_VALIDATE:
            return {
                ...state,
                gridIsLoading: true,
                validation: { message: [], affectedRows: [] },
            };

        case ActionTypes.REGISTER_GRID_CHANGE_POST_VALIDATE:
            return {
                ...state,
                gridIsLoading: false,
                rows: action.payload.grid.rows,
                validation: { message: action.payload.errorMessage, affectedRows: action.payload.affectedRows },
            };
        case ActionTypes.SET_VALIDATION_MESSAGE:
            console.log(action.payload);

            return {
                ...state,
                gridIsLoading: false,
                validation: { message: action.payload.errorMessage, affectedRows: action.payload.affectedRows },
            };

        case ActionTypes.CLEAR_EMPTY_IDS:
            return {
                ...state,
                gridIsLoading: false,
                rows: action.payload,
            };

        case ActionTypes.GET_COLUMNS:
            return {
                ...state,
                gridIsLoading: true,
                validation: { message: [], affectedRows: [] },
            };
        case ActionTypes.NO_CHANGE:
            return {
                ...state,
                gridIsLoading: false,
                nothingToChange: true,
            };
        case ActionTypes.NO_CHANGE_RESET:
            return {
                ...state,
                gridIsLoading: false,
                nothingToChange: false,
            };
        case ActionTypes.UPDATE_NUM_OF_ROWS:
            return {
                ...state,
                gridIsLoading: true,
                validation: { message: [], affectedRows: [] },
            };
        case ActionTypes.UPDATE_NUM_OF_ROWS_SUCCESS:
            return {
                ...state,
                gridIsLoading: false,
                rows: action.rows,
                form: action.form,
            };
        case ActionTypes.GET_COLUMNS_FROM_CACHE:
            return {
                ...state,
                gridIsLoading: false,
            };

        case ActionTypes.GET_COLUMNS_SUCCESS:
            return {
                ...state,
                gridType: action.gridType,
                gridIsLoading: false,
                columnHeaders: action.columnHeaders,
                hiddenColumns: action.hiddenColumns,
                columnFeatures: action.columnFeatures,
                rows: action.rows,
                form: action.form,
            };

        case ActionTypes.GET_COLUMNS_FAIL:
            return {
                ...initialGridState,
                gridIsLoading: false,
                error: action.error,
                // action.error.response.data +
                // ' ' +
                // action.material +
                // ' x ' +
                // action.application,
            };

        case ActionTypes.DECREASE_ROW_NUMBER_SUCCESS:
            return {
                ...state,
                rows: action.rows,
                form: {
                    ...state.form,
                    numberOfSamples: action.rowNumber,
                },
            };

        case ActionTypes.INCREASE_ROW_NUMBER_SUCCESS:
            return {
                ...state,
                rows: state.rows.concat(action.additionalRows),
                form: {
                    ...state.form,
                    numberOfSamples: action.rowNumber,
                },
            };

        case ActionTypes.HANDLE_PATIENT_IDS_SUCCESS:
            return {
                ...state,
                rows: action.rows,
                validation: action.validation,
            };

        case ActionTypes.HANDLE_PATIENT_IDS_FAIL:
            return {
                ...state,
                rows: action.rows,
            };

        case ActionTypes.UPDATE_CELLS:
            return {
                ...state,
                rows: action.rows,
            };
        case ActionTypes.HANDLE_ASSAY_SUCCESS:
            return {
                ...state,
                rows: action.rows,
            };
        case ActionTypes.HANDLE_INDEX_SUCCESS:
            return {
                ...state,
                rows: action.rows,
            };
        case ActionTypes.HANDLE_INDEX_FAIL:
            return {
                ...state,
                message: action.message,
            };

        case ActionTypes.HANDLE_CLEAR_SUCCESS:
            return {
                ...state,
                rows: action.rows,
            };

        case ActionTypes.GET_SUBMISSION_TO_EDIT_SUCCESS:
        case ActionTypes.GET_DMP_SUBMISSION_TO_EDIT_SUCCESS:
            return {
                ...state,
                rows: action.payload.gridValues,
                gridType: action.payload.gridType,
                form: action.payload.formValues,
                validation: { message: [], affectedRows: [] },
            };
        case ActionTypes.LOAD_FROM_DMP_SUCCESS:
            return {
                ...state,
                rows: action.payload.gridValues,
                gridType: action.payload.gridType,
                form: action.payload.formValues,
            };

        case FormActionTypes.CLEAR_FORM:
            return {
                ...initialGridState,
            };
        case SubmissionActionTypes.SUBMIT_SUCCESS:
        case SubmissionActionTypes.DMP_SUBMIT_SUCCESS:
            return {
                ...initialGridState,
            };

        case FormActionTypes.SELECT:
            if (action.payload.id === 'serviceId') {
                return {
                    ...state,
                    gridIsLoading: false,
                    form: {
                        ...state.form,
                        serviceId: 'IGO-' + action.payload.value,
                    },
                };
            } else {
                return {
                    gridIsLoading: false,
                    ...state,
                };
            }

        default:
            return state;
    }
}
