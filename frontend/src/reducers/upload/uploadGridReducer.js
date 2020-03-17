import { uploadGridActions as ActionTypes } from '../../actions'
import { uploadFormActions as FormActionTypes } from '../../actions'
import { initialGridState } from './initialState'

export default function uploadGridReducer(state = initialGridState, action) {
  switch (action.type) {
    case ActionTypes.RESET_GRID_ERROR_MESSAGE:
      return {
        ...state,
        error: '',
      }
    case ActionTypes.REGISTER_GRID_CHANGE:
      return {
        ...state,
      }

    case ActionTypes.REGISTER_GRID_CHANGE_PRE_VALIDATE:
      return {
        ...state,
        gridIsLoading: true,
      }
    case ActionTypes.REGISTER_GRID_CHANGE_POST_VALIDATE:
      return {
        ...state,
        gridIsLoading: false,
        rows: action.payload.grid.rows,
      }

    case ActionTypes.GET_COLUMNS:
      return {
        ...state,
        gridIsLoading: true,
      }
    case ActionTypes.NO_CHANGE:
      return {
        ...state,
        gridIsLoading: false,
        nothingToChange: true,
      }
    case ActionTypes.NO_CHANGE_RESET:
      return {
        ...state,
        gridIsLoading: false,
        nothingToChange: false,
      }
    case ActionTypes.UPDATE_NUM_OF_ROWS:
      return {
        ...state,
        gridIsLoading: true,
      }
    case ActionTypes.UPDATE_NUM_OF_ROWS_SUCCESS:
      return {
        ...state,
        gridIsLoading: false,
        rows: action.rows,
        form: action.form,
      }
    case ActionTypes.GET_COLUMNS_FROM_CACHE:
      return {
        ...state,
        gridIsLoading: false,
      }

    case ActionTypes.GET_COLUMNS_SUCCESS:
      return {
        ...state,
        gridIsLoading: false,
        columnHeaders: action.columnHeaders,
        hiddenColumns: action.hiddenColumns,
        columnFeatures: action.columnFeatures,
        rows: action.rows,
        // rows: action.rows,
        form: action.form,
      }

    case ActionTypes.GET_COLUMNS_FAIL:
      return {
        ...state,
        gridIsLoading: false,
        error: action.error,
        // action.error.response.data +
        // ' ' +
        // action.material +
        // ' x ' +
        // action.application,
      }

    case ActionTypes.HANDLE_MRN_SUCCESS:
      return {
        ...state,
        rows: action.rows,
      }

    case ActionTypes.HANDLE_MRN_FAIL:
      return {
        ...state,
      }

    case ActionTypes.HANDLE_PATIENT_ID_SUCCESS:
      return {
        ...state,
        rows: action.rows,
      }

    case ActionTypes.UPDATE_CELLS:
      return {
        ...state,
        rows: action.rows,
      }
    case ActionTypes.HANDLE_ASSAY_SUCCESS:
      return {
        ...state,
        rows: action.rows,
      }
    case ActionTypes.HANDLE_INDEX_SUCCESS:
      return {
        ...state,
        rows: action.rows,
      }
    case ActionTypes.HANDLE_INDEX_FAIL:
      return {
        ...state,
        message: action.message,
      }

    case ActionTypes.HANDLE_CLEAR_SUCCESS:
      return {
        ...state,
        rows: action.rows,
      }

    case ActionTypes.ADD_VALIDATORS_SUCCESS:
      return {
        ...state,
        columnFeatures: action.columnFeatures,
      }

   

    case ActionTypes.EDIT_SUBMISSION_SUCCESS:
      return {
        ...state,
        rows: JSON.parse(action.payload.grid_values),
        form: JSON.parse(action.payload.form_values),
      }

    case ActionTypes.ADD_GRID_TO_BANKED_SAMPLE:
      return {
        ...state,
      }
    case ActionTypes.ADD_GRID_TO_BANKED_SAMPLE_FAIL:
      return {
        ...state,
      }
    case ActionTypes.ADD_GRID_TO_BANKED_SAMPLE_SUCCESS:
      return {
        ...initialGridState,
      }

    case FormActionTypes.CLEAR_FORM:
      return {
        ...initialGridState,
      }

    case FormActionTypes.SELECT:
      if (action.payload.id == 'service_id') {
        return {
          ...state,
          gridIsLoading: false,
          form: {
            ...state.form,
            service_id: 'IGO-' + action.payload.value,
          },
        }
      } else {
        return {
          gridIsLoading: false,
          ...state,
        }
      }

    default:
      return state
  }
}
