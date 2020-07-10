import { swal } from '../../../util';

const initialState = {
    version: '2.0',
    error: false,
    message: '',
    serverError: false,
    // loading: true,
};

// global errors and messages
function commonReducer(state = initialState, action) {
    const { type, error, message, serverError } = action;
    if (message) {
        if (message === 'clear') {
            return {
                ...state,
                message: '',
            };
        }
        return {
            ...state,
            message: message,
        };
    } else if (error && error.payload) {
        console.log('common error');
        console.log(error.payload);
        if (error.response.status === 400) {
            swal.apiValidationError(error.payload.message, error.payload.data);
            return { ...state };
        }
        return {
            ...state,
            message: error.payload.message,
        };
    } else if (error && error.message) {
        return {
            ...state,
            message: error.message,
        };
    } else {
        return { ...state };
    }
}

export default commonReducer;
