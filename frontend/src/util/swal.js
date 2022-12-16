import Swal from 'sweetalert2';

export const genericMessage = (type, msg) => {
    Swal.fire({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        html: msg,
        type: type,
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};

export const genericMessageWithTitle = (type, title, msg) => {
    Swal.fire({
        title: title,
        html: msg,
        type: type,
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};

export const serviceIdDecision = (title, message) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            html: message,
            type: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            animation: false,
            confirmButtonColor: '#006098',
            denyButtonColor: '#007cba',
            cancelButtonColor: '#f29934',
            confirmButtonText: 'Add Request Cohort',
            cancelButtonText: 'Cancel',
            denyButtonText: 'Edit Previous Request',
        }).then((result) => (resolve(result)));
    });
};

export const genericDecision = (title, message) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            html: message,
            type: 'warning',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#df4602',
            cancelButtonColor: '#007cba',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel',
        }).then((result) => (result.value ? resolve(true) : resolve(false)));
    });
};

export const formGridMismatch = (match) => {
    Swal.fire({
        title: 'Header does not match Grid',
        html:
            'Please make sure your current header values match the ones used to generate the table. <br>(Header value x Table value) <br>' +
            match.message,
        type: 'error',
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};


export const confirmGridOverwrite = (msg) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: 'Are you sure?',
            text: msg,
            type: 'warning',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#df4602',
            cancelButtonColor: '#007cba',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.value) {
                resolve(true);
            } else resolve(false);
        });
    });
};

export const confirmDelete = () => {
    return new Promise((resolve) => {
        Swal.fire({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#df4602',
            cancelButtonColor: '#007cba',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.value) {
                resolve(true);
            } else resolve(false);
        });
    });
};
export const confirmClear = () => {
    return new Promise((resolve) => {
        Swal.fire({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#df4602',
            cancelButtonColor: '#007cba',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.value) {
                resolve(true);
            } else resolve(false);
        });
    });
};
export const confirmGridClear = () => {
    return new Promise((resolve) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to revert this unless you have a saved partial submission.',
            type: 'warning',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#df4602',
            cancelButtonColor: '#007cba',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.value) {
                resolve(true);
            } else resolve(false);
        });
    });
};

export const confirmUpdate = () => {
    return new Promise((resolve) => {
        Swal.fire({
            title: 'Update?',
            html: 'You are editing an existing partial submission. Are you sure you want to update it?',
            type: 'info',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#df4602',
            cancelButtonColor: '#007cba',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.value) {
                resolve(true);
            } else resolve(false);
        });
    });
};

export const apiRequestValidationError = (msg, data) => {
    let errors = data || '';
    if (data) {
        errors = '';
        data.map((element) => {
            errors += `${element.param}: ${element.msg}\n`;
        });
    }
    Swal.fire({
        title: msg,
        html: errors,
        type: 'error',
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};
export const emptyFieldsError = (emptyColumns) => {
    Swal.fire({
        title: 'Required Fields',
        html: [...emptyColumns].join('<br> '),
        type: 'error',
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};

export const submitSuccess = () => {
    Swal.fire({
        title: 'Submitted!',
        text: 'Download your Receipt under Submissions.',
        type: 'success',
        animation: false,
        confirmButtonColor: '#007cba',
        confirmButtonText: 'Dismiss',
    });
};

//  PROMOTE
export const alertEmptyLoad = (queryType) => {
    Swal.fire({
        title: 'Required',
        text: `Please fill enter a value for ${queryType}.`,
        type: 'error',
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};


// Used to wait for user to react to SWAL message even if no actual decision needed
export const genericPromise = (title, message) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            html: message,
            type: 'info',
            showCancelButton: false,
            animation: false,
            confirmButtonColor: '#df4602',

            confirmButtonText: 'Dismiss',
        }).then((result) => (result.value ? resolve(true) : resolve(false)));
    });
};

export const dryRunSuccess = (message) => {
    return new Promise((resolve) => {
        Swal.fire({
            // title: 'Do you want to proceed?',
            html: `${message} <br> Do you want to proceed?`,
            type: 'success',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#007cba',
            cancelButtonColor: '#df4602',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel',
        }).then((result) => (result.value ? resolve(true) : resolve(false)));
    });
};

// PROMOTE END
