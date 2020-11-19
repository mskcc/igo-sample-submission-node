import { userActions as ActionTypes } from '../../actions/';
const initialState = {
    username: undefined,
    role: 'user',
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.FETCH_USER_SUCCESS: {
            console.log(action.user);
            let role = action.user.payload.isLabMember ? 'lab_member' : 'user';
            return {
                ...state,
                username: action.user.payload.username,
                role: role,
            };
        }
        case ActionTypes.FETCH_USER_FAIL:
            return initialState;
        default:
            return state;
    }
}

export default userReducer;
