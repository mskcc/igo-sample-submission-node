import { formActions as ActionTypes } from '../../actions/';
import { initialFormState } from '../initialState';
import { gridActions as GridActionTypes } from '../../actions/';

export default function formReducer(state = initialFormState, action) {
    switch (action.type) {
        case ActionTypes.REQUEST_INITIAL_STATE:
            return {
                ...state,
                formIsLoading: true,
            };

        case ActionTypes.RECEIVE_INITIAL_STATE_SUCCESS:
            return {
                ...state,
                formIsLoading: false,
                initialFetched: true,
                filteredMaterials: action.form_data.materials,
                filteredApplications: action.form_data.applications,
                allMaterials: action.form_data.materials,
                allApplications: action.form_data.applications,
                capturePanels: action.form_data.capturePanels,
                allSpecies: action.form_data.species,
                filteredSpecies: action.form_data.species,
                allContainers: action.form_data.containers,
                filteredContainers: action.form_data.containers,
                patientIdTypes: action.form_data.patientIdTypes,
                patientIdTypesSpecified: action.form_data.patientIdTypesSpecified,
                readLengths: action.form_data.readLengths,
                squareSizes: action.form_data.squareSizes,
            };

        case ActionTypes.RECEIVE_INITIAL_STATE_FAIL:
            return {
                ...state,
                initialFetched: false,
                error: action.error,
                formIsLoading: false,
            };

        case ActionTypes.INITIAL_STATE_RETRIEVED:
            return {
                ...state,
                formIsLoading: false,
            };

        case ActionTypes.REQUEST_MATERIALS_AND_APPLICATIONS:
            return {
                ...state,
                formIsLoading: true,
            };

        case ActionTypes.RECEIVE_MATERIALS_AND_APPLICATIONS_FAIL:
            return {
                ...state,
                error: action.error,
            };

        case ActionTypes.SELECT:
            return {
                ...state,
                formIsLoading: false,
                selected: {
                    ...state.selected,
                    [action.payload.id]: action.payload.value,
                },
            };
        case ActionTypes.CLEAR:
            if (action.payload.id === 'groupingChecked' || action.payload.id === 'isShared') {
                return {
                    ...state,
                    selected: {
                        ...state.selected,
                        [action.payload.id]: false,
                    },
                };
            } else {
                return {
                    ...state,
                    selected: {
                        ...state.selected,
                        [action.payload.id]: '',
                    },
                };
            }

        case ActionTypes.CLEAR_FORM:
            return {
                ...state,
                initialFetched: false,
                selected: { ...initialFormState.selected },
            };
        case ActionTypes.SELECT_MATERIAL:
            return {
                ...state,
                selected: { ...state.selected, material: action.selectedMaterial },
            };

        case ActionTypes.SELECT_APPLICATION:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    application: action.selectedApplication,
                },
            };

        case ActionTypes.REQUEST_DATA_FOR_APPLICATION:
            return {
                ...state,
                formIsLoading: true,
            };
        case ActionTypes.RECEIVE_DATA_FOR_APPLICATION_SUCCESS:
            return action.species.length > 0
                ? {
                      ...state,
                      formIsLoading: false,
                      filteredMaterials: action.materials,
                      filteredSpecies: action.species,
                      // does not update input value quite yet,so don't change to allow validation to pick it up
                      // selected: { ...state.selected, species: action.species[0].id },
                  }
                : {
                      ...state,
                      formIsLoading: false,
                      filteredMaterials: action.materials,
                      filteredSpecies: state.allSpecies,
                  };
        case ActionTypes.RECEIVE_DATA_FOR_APPLICATION_FAIL:
            return {
                ...state,
                formIsLoading: false,
                error: action.error,
            };

        case ActionTypes.REQUEST_APPLICATIONS_FOR_MATERIAL:
            return {
                ...state,
                formIsLoading: true,
            };
        case ActionTypes.RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS:
            return action.containers.length > 0
                ? {
                      ...state,
                      formIsLoading: false,
                      filteredApplications: action.applications,
                      filteredContainers: action.containers,
                      // does not update input value quite yet,so don't change to allow validation to pick it up
                      // selected: { ...state.selected, container: action.containers[0].id },
                  }
                : {
                      ...state,
                      formIsLoading: false,
                      filteredApplications: action.applications,
                      filteredContainers: state.allContainers,
                  };
        case ActionTypes.RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL:
            return {
                ...state,
                formIsLoading: false,
                error: action.error,
            };

        case ActionTypes.CLEAR_SPECIES:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    patientIdType: '',
                    patientIdTypesSpecified: '',
                },
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

                [action.listname]: action.picklist,
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

        case ActionTypes.CLEAR_MATERIAL:
            return {
                ...state,
                filteredApplications: state.allApplications,
                filteredContainers: state.allContainers,
                selected: { ...state.selected, material: '' },
                formIsLoading: true,
            };
        case ActionTypes.CLEAR_APPLICATION:
            return {
                ...state,
                filteredMaterials: state.allMaterials,
                filteredSpecies: state.allSpecies,
                selected: { ...state.selected, application: '' },
                formIsLoading: true,
            };
        case ActionTypes.CLEAR_SQUARE_SIZE:
            return {
                ...state,
                selected: { ...state.selected, squareSize: '' },
                formIsLoading: true,
            };
        case ActionTypes.CLEAR_READ_LENGTHS:
            return {
                ...state,
                selected: { ...state.selected, sequencingReadLength: '' },
                formIsLoading: true,
            };
        case ActionTypes.CLEARED:
            return {
                ...state,
                formIsLoading: false,
            };
        case GridActionTypes.INCREASE_ROW_NUMBER_SUCCESS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    numberOfSamples: action.rowNumber,
                },
            };
        case GridActionTypes.GET_SUBMISSION_TO_EDIT_SUCCESS:        
        case GridActionTypes.LOAD_FROM_DMP_SUCCESS:        
            let form = action.payload.formValues;
            return {
                ...state,
                selected: {
                    ...form,
                    serviceId: form.serviceId.replace('IGO-', ''),
                },
            };

        default:
            return state;
    }
}
