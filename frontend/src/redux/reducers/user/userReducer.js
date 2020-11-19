import { userActions as ActionTypes } from '../../actions/';
const initialState = {
    username: undefined,
    role: 'user',
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.FETCH_USER_SUCCESS: {
            console.log(action.user);

            return {
                ...state,
                username: action.user.username,
                role: action.user.role,
            };
        }
        case ActionTypes.FETCH_USER_FAIL:
            return initialState;
        default:
            return state;
    }
}

export default userReducer;
