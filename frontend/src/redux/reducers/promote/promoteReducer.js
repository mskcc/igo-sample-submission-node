import { promoteActions as ActionTypes } from '../../actions'
import { initialPromoteState } from '../initialState'

export default function uploadFormReducer(state = initialPromoteState, action) {
  switch (action.type) {
    case ActionTypes.REQUEST_INITIAL_STATE_PROMOTE:
      return {
        ...state,
      }

    case ActionTypes.RECEIVE_INITIAL_STATE_PROMOTE_SUCCESS:
      return {
        ...state,
        columns: action.grid.columnHeaders,
        hiddenColumns: action.grid.hiddenColumns,
        columnFeatures: action.grid.columnFeatures,
        promoteIsLoading: false,
        rows: action.grid.rows,
        initialFetched: true,
        // patientIdFormats: action.data.patientIdFormats,
      }
    case ActionTypes.RECEIVE_INITIAL_STATE_PROMOTE_FAIL:
      return { ...state, initialFetched: false }
    case ActionTypes.RECEIVE_BANKED_SAMPLES_SUCCESS:
      return {
        ...state,
        rows: action.rows,
        rowsBackup: action.rowsBackup,
        promoteIsLoading: false,
      }

    case ActionTypes.REQUEST_PROMOTE_DRYRUN:
      return { ...state, promoteIsLoading: true }
    case ActionTypes.REQUEST_PROMOTE_DRYRUN_SUCCESS:
      return { ...state, promoteIsLoading: false }
    case ActionTypes.RECEIVE_PROMOTE_DRYRUN_FAIL:
      return { ...state, promoteIsLoading: false }
 case ActionTypes.REQUEST_PROMOTE_FORREAL:
      return { ...state, promoteIsLoading: true }
    case ActionTypes.RECEIVE_PROMOTE_FORREAL_SUCCESS:
      return { ...state, promoteIsLoading: false }
    case ActionTypes.RECEIVE_PROMOTE_FORREAL_FAIL:
      return { ...state, promoteIsLoading: false }

    default:
      return state
  }
}
