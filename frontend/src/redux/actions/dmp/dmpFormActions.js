//TODO ERROR HANDLING
import axios from 'axios';
import { Config } from '../../../config.js';
import { services } from '../../../util/index.js';
export const REQUEST_DMP_HEADER = 'REQUEST_DMP_HEADER';

export const DMP_HEADER_SUCCESS = 'DMP_HEADER_SUCCESS';

export const DMP_HEADER_FAIL = 'DMP_HEADER_FAIL';
export const DMP_HEADER_RETRIEVED = 'DMP_HEADER_RETRIEVED';

export function getInitialState() {
  return (dispatch, getState) => {
    if (getState().dmp.form.initialFetched)
      return dispatch({ type: DMP_HEADER_RETRIEVED });
    else {
      dispatch({ type: REQUEST_DMP_HEADER });
     return services
        .getHeaderValues('dmp')
        .then(response => {
          dispatch({
            type: DMP_HEADER_SUCCESS,
            materials: response.payload.materials,
            applications: response.payload.applications,
            user: response.payload.user
          });
          return response;
        })
        .catch(error =>
          dispatch({
            type: DMP_HEADER_FAIL,
            error: error
          })
        );
    }
  };
}

export const UPDATE_HEADER = 'UPDATE_HEADER';

export const SELECT = 'SELECT';

export function select(id, value) {
  return dispatch => {
    if (id === 'service_id') {
      return dispatch({
        type: SELECT,
        payload: { id: id, value: value },
        message: 'Service Id updated.'
      });
    }

    if (id === 'number_of_samples') {
      if (value > 199) {
        return dispatch({
          type: SELECT,
          payload: { id: id, value: value },
          message:
            'A sample set this large might lead to performance issues. We recommend keeping it below 200 and submitting mutliple requests if necessary.'
        });
      }
    } else {
      return dispatch({ type: SELECT, payload: { id: id, value: value } });
    }
  };
}

export const CLEAR = 'CLEAR';

export function clear(id) {
  return dispatch => {
    return dispatch({ type: CLEAR, payload: { id: id } });
  };
}
export const CLEAR_FORM = 'CLEAR_FORM';
export function clearForm() {
  return dispatch => {
    dispatch({ type: CLEAR_FORM });
    dispatch(getInitialState()).then(() => {
      window.location.reload();
    });
  };
}

export const SELECT_MATERIAL = 'SELECT_MATERIAL';

export const REQUEST_APPLICATIONS_FOR_MATERIAL =
  'REQUEST_APPLICATIONS_FOR_MATERIAL';

export const RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS =
  'RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS';

export const RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL =
  'RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL';

// get applications that can be combined with material
// SelectedMaterial impacts applications and containers, containers are filtered in FormContainer
export function getApplicationsForMaterial(
  selectedMaterial,
  checkForMismatch = true
) {
  return (dispatch, getState) => {
    dispatch({ type: SELECT_MATERIAL, selectedMaterial });
    dispatch({ type: REQUEST_APPLICATIONS_FOR_MATERIAL });
    checkForMismatch && dispatch(checkForChange('material', selectedMaterial));
    return axios
      .get(Config.NODE_API_ROOT + '/upload/applicationsAndContainers', {
        params: {
          material: selectedMaterial
        }
      })
      .then(response => {
        return dispatch({
          type: RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS,
          applications: response.payload.applications,
          containers: response.payload.containers
        });
      })
      .catch(error => {
        return dispatch({
          type: RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL,
          error: error
        });
      });
  };
}

export const REQUEST_PICKLIST = 'REQUEST_PICKLIST';
export const RECEIVE_PICKLIST_SUCCESS = 'RECEIVE_PICKLIST_SUCCESS';
export const RECEIVE_PICKLIST_FAIL = 'RECEIVE_PICKLIST_FAIL';

export function getPicklist(picklist) {
  return dispatch => {
    dispatch({ type: REQUEST_PICKLIST, picklist });
    return axios
      .get(Config.NODE_API_ROOT + '/upload/picklist?picklist=' + picklist)

      .then(response => {
        return dispatch({
          type: RECEIVE_PICKLIST_SUCCESS,
          picklist: response.data.data.picklist,
          listname: response.data.data.listname
        });
      })
      .catch(error => {
        return dispatch({
          type: RECEIVE_PICKLIST_FAIL,
          error: error
        });
      });
  };
}

export const CLEARED = 'CLEARED';
// timeout for CLEARED to show user loading animation to indicate change
export const cleared = () => {
  return dispatch => {
    return setTimeout(() => {
      dispatch({ type: CLEARED });
    }, 500);
  };
};

export const checkForChange = (field, value) => {
  return (dispatch, getState) => {
    if (
      getState().dmp.grid.form[field] &&
      getState().dmp.grid.form[field] !== value
    ) {
      dispatch({
        type: 'MESSAGE',
        message: 'Make sure to re-generate your table to persist this change.'
      });
    }
  };
};
