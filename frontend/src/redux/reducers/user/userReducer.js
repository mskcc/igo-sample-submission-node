import {
  formActions as FormActionTypes,
  userActions as ActionTypes,
} from '../../actions'
import FileSaver from 'file-saver'
const initialState = {
  submissions: {},
  username: '',
  loading: false,
  loggedIn: true,
  saved: false,
  submissionsTable: {},
  isSaving: false,
  role: '',
}

function userReducer(state = initialState, action) {
  const { error } = action

  if (error && error.response && error.response.status == 401) {
    return {
      ...state,
      loggedIn: true,
    }
  }
  switch (action.type) {
    case ActionTypes.REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.REFRESH_TOKEN_VALID:
      return {
        ...state,
        loggedIn: true,
        loading: false,
        isSaving: false,

        username: action.payload.username,
        // message: 'Welcome back, ' + action.payload.username + '.',
      }

    case ActionTypes.REFRESH_TOKEN_INVALID:
      return {
        ...state,
        loggedIn: true,
        loading: false,
        username: '',
      }

    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loading: false,
        username: action.payload.username,
        role: action.payload.role,
        submissionsTable: action.table,
        submissions: action.payload.submissions,
        // message: action.payload.message,
      }

    case ActionTypes.LOGIN_FAIL:
      return {
        ...state,
        loggedIn: true,
        loading: false,
      }

    case ActionTypes.LOGOUT_SUCCESS:
      return {
        ...initialState,
      }

    case ActionTypes.LOGOUT_FAIL:
      return {
        ...state,
        loggedIn: true,
        // loading: false,
        // message: action.message,
      }

    // case FormActionTypes.RECEIVE_INITIAL_STATE_SUCCESS:
    //   return {
    //     ...state,
    //     submissionsTable: action.user_data.table,
    //     submissions: action.user_data.submissions,
    //   }

    // case ActionTypes.GET_SUBMISSIONS:
    //   return {
    //     ...state,
    //     loading: true,
    //   }
    // case ActionTypes.GET_SUBMISSIONS_FAIL:
    //   return { ...state, loading: false, error: action.error }
   
    // case ActionTypes.GET_SUBMISSIONS_SUCCESS:
    //   return {
    //     ...state,
    //     submissionsTable: action.payload.table,
    //     submissions: action.payload.submissions,
    //     loading: false,
    //   }

    // case ActionTypes.SAVE_PARTIAL_SUBMISSION:
    //   return {
    //     ...state,
    //     isSaving: true,
    //   }
    // case ActionTypes.SAVE_PARTIAL_SUBMISSION_FAIL:
    //   return { ...state, isSaving: false }
    // case ActionTypes.SAVE_PARTIAL_SUBMISSION_CANCEL:
    //   return { ...state, isSaving: false }
    // case ActionTypes.SAVE_PARTIAL_SUBMISSION_SUCCESS:
    //   return {
    //     ...state,
    //     isSaving: false,
    //     saved: true,
    //     submissionsTable: action.payload.table,
    //     submissions: action.payload.submissions,
    //   }

    // case ActionTypes.EDIT_SUBMISSION:
    //   return {
    //     ...state,
    //     loading: true,
    //   }
    // case ActionTypes.GET_SUBMISSION_FAIL:
    //   return { ...state, loading: false }

    // case ActionTypes.GET_SUBMISSION_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //   }

    // case ActionTypes.DELETE_SUBMISSION:
    //   return {
    //     ...state,
    //     isSaving: true,
    //   }
    // case ActionTypes.DELETE_SUBMISSION_FAIL:
    //   return { ...state, isSaving: false }
    // case ActionTypes.DELETE_SUBMISSION_SUCCESS:
    //   return {
    //     ...state,
    //     isSaving: false,
    //     saved: true,

    //     submissionsTable: action.payload.table,
    //     submissions: action.payload.submissions,
    //   }

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

export default userReducer
