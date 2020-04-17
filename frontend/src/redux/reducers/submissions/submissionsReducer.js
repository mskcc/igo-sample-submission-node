
import FileSaver from 'file-saver'
import { submissionActions as ActionTypes } from "../../actions/"
const initialState = {
    list: {},
    loading: false,
    saved: false,
    table: {},
    isSaving: false,
}

function submissionsReducer(state = initialState, action) {

    switch (action.type) {

        case ActionTypes.GET_SUBMISSIONS:
            return {
                ...state,
                loading: true,
            }
        case ActionTypes.GET_SUBMISSIONS_FAIL:
            return { ...state, loading: false, error: action.error }

        case ActionTypes.GET_SUBMISSIONS_SUCCESS:
            return {
                ...state,
                table: action.payload.table,
                list: action.payload.submissions,
                loading: false,
            }

        case ActionTypes.SAVE_PARTIAL_SUBMISSION:
            return {
                ...state,
                isSaving: true,
            }
        case ActionTypes.SAVE_PARTIAL_SUBMISSION_FAIL:
            return { ...state, isSaving: false }
        case ActionTypes.SAVE_PARTIAL_SUBMISSION_CANCEL:
            return { ...state, isSaving: false }
        case ActionTypes.SAVE_PARTIAL_SUBMISSION_SUCCESS:
            return {
                ...state,
                isSaving: false,
                saved: true,
                table: action.payload.table,
                list: action.payload.submissions,
            }

        case ActionTypes.EDIT_SUBMISSION:
            return {
                ...state,
                loading: true,
            }
        case ActionTypes.EDIT_SUBMISSION_FAIL:
            return { ...state, loading: false }

        case ActionTypes.EDIT_SUBMISSION_SUCCESS:
            return {
                ...state,
                loading: false,
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

                table: action.payload.table,
                list: action.payload.submissions,
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
            FileSaver.saveAs(
                new Blob([action.file], {
                    type:
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }),
                action.filename + '.xlsx'
            )

            return {
                ...state,
            }

        default:
            return state
    }
}

export default submissionsReducer
