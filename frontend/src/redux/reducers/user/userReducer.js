const initialState = {
    username: '',
    loading: false,
    loggedIn: true,
    saved: false,
    submissionsTable: {},
    isSaving: false,
    role: '',
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export default userReducer;
