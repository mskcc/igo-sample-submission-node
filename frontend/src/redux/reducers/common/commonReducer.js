import { swal } from '../../../util';

const initialState = {
    version: '2.0',
    error: false,
    message: '',
    serverError: false,
    loading: false,
};

// global errors and messages
function commonReducer(state = initialState, action) {
    const { error, message, loading } = action;
    // console.log(action);

    if (typeof loading !== 'undefined') {
        console.log('loading');

        state = {
            ...state,
            loading: loading,
        };
    } else {
        console.log('loading DONE');
        state = {
            ...state,
            loading: false,
        };
    }
    if (message) {
        state = {
            ...state,
            message: message === 'clear' ? '' : message,
        };
    } else if (error && error.payload) {
        console.log(error.payload);
        if (error.response.status === 400) {
            swal.apiValidationError(error.payload.message, error.payload.data);
            state = { ...state };
        }
        state = {
            ...state,
            message: error.payload.message,
        };
    } else if (error && error.message) {
        state = {
            ...state,
            message: error.message,
        };
    }
    return state;
}

export default commonReducer;
