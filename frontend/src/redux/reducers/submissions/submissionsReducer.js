
import FileSaver from 'file-saver'
import { submissionActions as ActionTypes } from "../../actions/"
import { gridActions as GridActionTypes } from "../../actions/"
import { formActions as FormActionTypes } from "../../actions/"
const initialState = {
    loading: false,
    saved: false,
    grid: { columnHeaders: [], rows: [], columnFeatures: [] },
    isSaving: false,
    submissionToEdit: undefined
}

function submissionsReducer(state = initialState, action) {

    switch (action.type) {

        case ActionTypes.GET_SUBMISSIONS:
            return {
                ...state,
                loading: true,
            }
        case ActionTypes.GET_SUBMISSIONS_FAIL:
            return { ...state, loading: false }

        case ActionTypes.GET_SUBMISSIONS_SUCCESS:
            return {
                ...state,
                grid: action.payload,
                loading: false,
            }

        case ActionTypes.CREATE_PARTIAL_SUBMISSION:
            return {
                ...state,
                isSaving: true,
            }
        case ActionTypes.CREATE_PARTIAL_SUBMISSION_FAIL:
            return {
                ...state, isSaving: false,
                submissionToEdit: undefined
            }

        case ActionTypes.CREATE_PARTIAL_SUBMISSION_SUCCESS:
            return {
                ...state,
                isSaving: false,
                saved: true,
                submissionToEdit: action.payload._id
            }

        case ActionTypes.UPDATE_PARTIAL_SUBMISSION:
            return {
                ...state,
                isSaving: true,
            }
        case ActionTypes.UPDATE_PARTIAL_SUBMISSION_FAIL:
            return {
                ...state, isSaving: false,
            }

        case ActionTypes.UPDATE_PARTIAL_SUBMISSION_SUCCESS:
            return {
                ...state,
                isSaving: false,
                saved: true,
                submissionToEdit: action.payload._id
            }

        case ActionTypes.SUBMIT:
            return {
                ...state,
            }
        case ActionTypes.SUBMIT_FAIL:
            return {
                ...state,
            }
        case ActionTypes.SUBMIT_SUCCESS:
            return {
                ...initialState,
            }



        case ActionTypes.EDIT_SUBMISSION:
            return {
                ...state,
                // loading: true,
            }

        case ActionTypes.DELETE_SUBMISSION:
            return {
                ...state,
                isSaving: true,
            }
        case ActionTypes.DELETE_SUBMISSION_FAIL:
            return { ...state, isSaving: false }

        case ActionTypes.DELETE_SUBMISSION_SUCCESS:
            return {
                ...state,
                isSaving: false,
                saved: true,
            }

        case ActionTypes.BUTTON_RESET: {
            return { ...state, submitted: false, saved: false }
        }



        case ActionTypes.DOWNLOAD_RECEIPT:
            return {
                ...state,
            }

        case ActionTypes.DOWNLOAD_RECEIPT_FAIL:
            return {
                ...state,
            }
        case ActionTypes.DOWNLOAD_RECEIPT_SUCCESS:
            // FileSaver.saveAs(
            //     new Blob([action.file], {
            //         // type:
            //         //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            //     }),
            //     action.filename + '.xlsx'
            // )

            return {
                ...state,
            }

        //  STRANGER DANGER
        // These cases shouldn't be here and maybe one day they will be refactored to their forever homes
        //  If Clear Form is clicked, the submissionToEdit needs to be cleared, too
        case FormActionTypes.CLEAR_FORM: {
            return { ...state, submissionToEdit: undefined }
        }

        //  SO many grid dispatchers are involved when a Submission is called for edit
        case GridActionTypes.GET_SUBMISSION_TO_EDIT_FAIL:
            return { ...state, submissionToEdit: undefined }

        case GridActionTypes.GET_SUBMISSION_TO_EDIT_SUCCESS:
            console.log('submissio  caught');
            return {
                ...state,
                submissionToEdit: action.payload._id
            }


        default:
            return state
    }
}

export default submissionsReducer
