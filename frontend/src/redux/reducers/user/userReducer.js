import {
  formActions as FormActionTypes,
  userActions as ActionTypes
} from '../../actions';
import FileSaver from 'file-saver';
const initialState = {
  submissions: {},
  username: '',
  loading: false,
  loggedIn: true,
  saved: false,
  submissionsTable: {},
  isSaving: false,
  role: ''
};

function userReducer(state = initialState, action) {
  const { error } = action;

  if (error && error.response && error.response.status === 401) {
    return {
      ...state,
      loggedIn: true
    };
  }
  switch (action.type) {
    case ActionTypes.REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ActionTypes.REFRESH_TOKEN_VALID:
      return {
        ...state,
        loggedIn: true,
        loading: false,
        isSaving: false,

        username: action.payload.username
        // message: 'Welcome back, ' + action.payload.username + '.',
      };

    case ActionTypes.REFRESH_TOKEN_INVALID:
      return {
        ...state,
        loggedIn: true,
        loading: false,
        username: ''
      };

    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loading: false,
        username: action.payload.username,
        role: action.payload.role,
        submissionsTable: action.table,
        submissions: action.payload.submissions
        // message: action.payload.message,
      };

    case ActionTypes.LOGIN_FAIL:
      return {
        ...state,
        loggedIn: true,
        loading: false
      };

    case ActionTypes.LOGOUT_SUCCESS:
      return {
        ...initialState
      };

    case ActionTypes.LOGOUT_FAIL:
      return {
        ...state,
        loggedIn: true
        // loading: false,
        // message: action.message,
      };

    case ActionTypes.BUTTON_RESET: {
      return { ...state, submitted: false, saved: false };
    }

    case ActionTypes.DOWNLOAD_RECEIPT:
      return {
        ...state
      };

    case ActionTypes.DOWNLOAD_RECEIPT_FAIL:
      return {
        ...state
      };
    case ActionTypes.DOWNLOAD_RECEIPT_SUCCESS:
      FileSaver.saveAs(
        new Blob([action.file], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }),
        action.filename + '.xlsx'
      );

      return {
        ...state
      };

    default:
      return state;
  }
}

export default userReducer;
