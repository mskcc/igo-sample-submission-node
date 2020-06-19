import { services } from '../../../util';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';
export function logout() {
  return dispatch => {
    dispatch({ type: LOGOUT });
    return services
      .logout()
      .then(response => {
        return dispatch({
          type: LOGOUT_SUCCESS
        });
      })
      .catch(error => {
        return dispatch({
          type: LOGOUT_FAIL,
          error: error
        });
      });
  };
}
