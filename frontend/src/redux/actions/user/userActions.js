import { services } from '../../../util';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAIL = 'FETCH_USER_FAIL';
export function fetchUser() {
    return (dispatch) => {
        dispatch({ type: FETCH_USER });
        return services
            .fetchUser()
            .then((response) => {
                return dispatch({
                    type: FETCH_USER_SUCCESS,
                    user: response.payload,
                });
            })
            .catch((error) => {
                return dispatch({
                    type: FETCH_USER_FAIL,
                    error: error,
                });
            });
    };
}

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';
export function logout() {
    return (dispatch) => {
        dispatch({ type: LOGOUT });
        return services
            .logout()
            .then(() => {
                return dispatch({
                    type: LOGOUT_SUCCESS,
                });
            })
            .catch((error) => {
                return dispatch({
                    type: LOGOUT_FAIL,
                    error: error,
                });
            });
    };
}
