import { dmpFormActions as ActionTypes } from '../../actions';
import { initialDmpFormState } from '../initialState';
import { gridActions as GridActionTypes } from '../../actions/';

export default function dmpFormReducer(state = initialDmpFormState, action) {
    switch (action.type) {
        case ActionTypes.REQUEST_DMP_HEADER:
            return {
                ...state,
                formIsLoading: true,
            };

        case ActionTypes.DMP_HEADER_SUCCESS:
            return {
                ...state,
                formIsLoading: false,
                initialFetched: true,
                materials: action.materials,
                applications: action.applications,
                capturePanels: action.capturePanels,
            };

        case ActionTypes.DMP_HEADER_FAIL:
            return {
                ...state,
                initialFetched: false,
                error: action.error,
                formIsLoading: false,
            };

        case ActionTypes.DMP_HEADER_RETRIEVED:
            return {
                ...state,
                formIsLoading: false,
            };

        case ActionTypes.REQUEST_MATERIALS_AND_APPLICATIONS:
            return {
                ...state,
                formIsLoading: true,
            };

        case ActionTypes.DMP_SELECT:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    [action.payload.id]: action.payload.value,
                },
            };
        case ActionTypes.DMP_CLEAR:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    [action.payload.id]: '',
                },
            };

        case ActionTypes.DMP_CLEAR_FORM:
            return {
                ...state,
                initialFetched: false,
                selected: { ...initialDmpFormState.selected },
            };

        case ActionTypes.REQUEST_PICKLIST:
            return {
                ...state,
                formIsLoading: true,
            };
        case ActionTypes.RECEIVE_PICKLIST_SUCCESS:
            return {
                ...state,
                formIsLoading: false,
                picklists: {
                    ...state.picklists,
                    [action.listname]: action.picklist,
                },
            };

        case ActionTypes.RECEIVE_PICKLIST_FAIL:
            return {
                ...state,
                formIsLoading: false,
                error: action.error,
            };

        case ActionTypes.REQUEST_COLUMNS:
            return {
                ...state,
                formIsLoading: true,
            };
        case ActionTypes.RECEIVE_COLUMNS_SUCCESS:
            return {
                ...state,
                formIsLoading: false,
                columns: {
                    ...state.columns,

                    ...[action.columns],
                },
            };

        case ActionTypes.RECEIVE_COLUMNS_FAIL:
            return {
                ...state,
                formIsLoading: false,
                error: action.error,
            };

        case ActionTypes.CLEARED:
            return {
                ...state,
                formIsLoading: false,
            };
        // case GridActionTypes.INCREASE_ROW_NUMBER_SUCCESS:
        //   return {
        //     ...state,
        //     selected: {
        //       ...state.selected,
        //       numberOfSamples: action.rowNumber
        //     }
        //   };
        case GridActionTypes.GET_DMP_SUBMISSION_TO_EDIT_SUCCESS:
            let form = action.payload.formValues;
            return {
                ...state,
                selected: {
                    ...form,
                    serviceId: form.serviceId ? form.serviceId.replace('IGO-', '') : ''
                },
            };

        default:
            return state;
    }
}
