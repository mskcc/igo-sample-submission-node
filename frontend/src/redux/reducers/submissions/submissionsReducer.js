import { submissionActions as ActionTypes } from '../../actions/';
import { gridActions as GridActionTypes } from '../../actions/';
import { formActions as FormActionTypes } from '../../actions/';
import { util } from '../../../util';
const initialState = {
    loading: false,
    saved: false,
    grid: { columnHeaders: [], rows: [], columnFeatures: [] },
    isSaving: false,
    submissionToEdit: undefined,
};

function submissionsReducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.GET_SUBMISSIONS:
            return {
                ...state,
                loading: true,
            };
        case ActionTypes.GET_SUBMISSIONS_FAIL:
            return { ...state, loading: false };

        case ActionTypes.GET_SUBMISSIONS_SUCCESS:
            return {
                ...state,
                grid: action.payload,
                loading: false,
            };

        case ActionTypes.GET_SUBMISSIONS_SINCE:
            return {
                ...state,
                loading: true,
            };
        case ActionTypes.GET_SUBMISSIONS_SINCE_FAIL:
            return { ...state, loading: false };

        case ActionTypes.GET_SUBMISSIONS_SINCE_SUCCESS:
            return {
                ...state,
                grid: action.payload,
                loading: false,
            };

        case ActionTypes.CREATE_PARTIAL_SUBMISSION:
            return {
                ...state,
                isSaving: true,
            };
        case ActionTypes.CREATE_PARTIAL_SUBMISSION_FAIL:
            return {
                ...state,
                isSaving: false,
                submissionToEdit: undefined,
            };

        case ActionTypes.CREATE_PARTIAL_SUBMISSION_SUCCESS:
            return {
                ...state,
                isSaving: false,
                saved: true,
                submissionToEdit: {
                    _id: action.payload._id,
                    gridType: action.payload.gridType,
                    serviceId: action.payload.formValues.serviceId,
                    dmpTrackingId: action.payload.dmpTrackingId,
                    material: action.payload.formValues.material,
                    application: action.payload.formValues.application,
                    numberOfSamples: action.payload.formValues.numberOfSamples,
                    container: action.payload.formValues.container,
                    username: action.payload.username,
                    createdAt: util.parseDate(action.payload.createdAt),
                    updatedAt: util.parseDate(action.payload.updatedAt),
                },
            };

        case ActionTypes.UPDATE_PARTIAL_SUBMISSION:
            return {
                ...state,
                isSaving: true,
            };
        case ActionTypes.UPDATE_PARTIAL_SUBMISSION_FAIL:
            return {
                ...state,
                isSaving: false,
            };

        case ActionTypes.UPDATE_PARTIAL_SUBMISSION_SUCCESS:
            return {
                ...state,
                isSaving: false,
                saved: true,
                submissionToEdit: {
                    _id: action.payload._id,
                    gridType: action.payload.gridType,
                    serviceId: action.payload.formValues.serviceId,
                    dmpTrackingId: action.payload.dmpTrackingId,
                    material: action.payload.formValues.material,
                    application: action.payload.formValues.application,
                    numberOfSamples: action.payload.formValues.numberOfSamples,
                    container: action.payload.formValues.container,
                    username: action.payload.username,
                    createdAt: util.parseDate(action.payload.createdAt),
                    updatedAt: util.parseDate(action.payload.updatedAt),
                },
            };

        case ActionTypes.SUBMIT:
        case ActionTypes.DMP_SUBMIT:
            return {
                ...state,
            };
        case ActionTypes.SUBMIT_FAIL:
        case ActionTypes.DMP_SUBMIT_FAIL:
            return {
                ...state,
            };
        case ActionTypes.SUBMIT_SUCCESS:
        case ActionTypes.DMP_SUBMIT_SUCCESS:
            return {
                ...initialState,
            };

        case ActionTypes.EDIT_SUBMISSION:
            return {
                ...state,
                // loading: true,
            };

        case ActionTypes.DELETE_SUBMISSION:
            return {
                ...state,
                isSaving: true,
            };
        case ActionTypes.DELETE_SUBMISSION_FAIL:
            return { ...state, isSaving: false };

        case ActionTypes.DELETE_SUBMISSION_SUCCESS:
            return {
                ...state,
                isSaving: false,
                saved: true,
            };

        case ActionTypes.BUTTON_RESET: {
            return { ...state, submitted: false, saved: false };
        }

        case ActionTypes.DOWNLOAD_RECEIPT:
            return {
                ...state,
            };

        case ActionTypes.DOWNLOAD_RECEIPT_FAIL:
            return {
                ...state,
            };
        case ActionTypes.DOWNLOAD_RECEIPT_SUCCESS:
            return {
                ...state,
            };

        //  STRANGER DANGER
        // These cases shouldn't be here and maybe one day they will be refactored to their forever homes
        //  If Clear Form is clicked, the submissionToEdit needs to be cleared, too
        case FormActionTypes.CLEAR_FORM: {
            return { ...state, submissionToEdit: undefined };
        }

        //  SO many grid dispatchers are involved when a Submission is called for edit
        case GridActionTypes.GET_SUBMISSION_TO_EDIT_FAIL:
            return { ...state, submissionToEdit: undefined };

        case GridActionTypes.GET_SUBMISSION_TO_EDIT_SUCCESS:
        case GridActionTypes.GET_DMP_SUBMISSION_TO_EDIT_SUCCESS:
        case GridActionTypes.LOAD_FROM_DMP_SUCCESS:
            return {
                ...state,
                submissionToEdit: {
                    _id: action.payload._id,
                    gridType: action.payload.gridType,
                    serviceId: action.payload.formValues.serviceId,
                    dmpTrackingId: action.payload.dmpTrackingId,
                    material: action.payload.formValues.material,
                    application: action.payload.formValues.application,
                    numberOfSamples: action.payload.formValues.numberOfSamples,
                    container: action.payload.formValues.container,
                    username: action.payload.username,
                    createdAt: util.parseDate(action.payload.createdAt),
                    updatedAt: util.parseDate(action.payload.updatedAt),
                },
            };

        default:
            return state;
    }
}

export default submissionsReducer;
