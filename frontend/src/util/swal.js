import Swal from 'sweetalert2';

export const genericMessage = (type, msg) => {
    Swal.fire({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        html: msg,
        icon: type,
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};

export const genericMessageWithTitle = (type, title, msg) => {
    Swal.fire({
        title: title,
        html: msg,
        icon: type,
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};

export const serviceIdDecision = (title, message) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            html: message,
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            animation: false,
            confirmButtonColor: '#006098',
            denyButtonColor: '#007cba',
            cancelButtonColor: '#f29934',
            confirmButtonText: 'Add Request Cohort',
            cancelButtonText: 'Cancel',
            denyButtonText: 'Edit Past Request',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            }
        }).then((result) => (resolve(result)));
    });
};

export const genericDecision = (title, message) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            html: message,
            icon: 'warning',
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
        icon: 'error',
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};


export const confirmGridOverwrite = (msg) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: 'Are you sure?',
            text: msg,
            icon: 'warning',
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
            icon: 'warning',
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
            icon: 'warning',
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
            icon: 'warning',
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
            icon: 'info',
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
        icon: 'error',
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};
export const emptyFieldsError = (emptyColumns) => {
    Swal.fire({
        title: 'Required Fields',
        html: [...emptyColumns].join('<br> '),
        icon: 'error',
        animation: false,
        confirmButtonText: 'Dismiss',
    });
};

export const submitSuccess = () => {
    Swal.fire({
        title: 'Submitted!',
        text: 'Download your Receipt under Submissions.',
        icon: 'success',
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
        icon: 'error',
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
            icon: 'info',
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
            icon: 'success',
            showCancelButton: true,
            animation: false,
            confirmButtonColor: '#007cba',
            cancelButtonColor: '#df4602',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel',
        }).then((result) => (result.value ? resolve(true) : resolve(false)));
    });
};

export const droppedSampleInfo = (droppedSampleInfo, depletedSampleInfo) => {
    console.log(`dropped: ${droppedSampleInfo}`);
    console.log(`depleted: ${depletedSampleInfo}`);
    let droppedSampleTitle = '';
    let droppedToText = '';
    let depletedSampleTitle = '';
    let depletedToText = '';
    if (droppedSampleInfo) {
        droppedSampleTitle = 'Dropped samples:';
        droppedSampleInfo.forEach(sample => {
            console.log(sample);
            droppedToText.concat(`<br>InvestigatorID: ${sample.investigatorId}, `);
            if (sample.dmpSampleId) {
                droppedToText.concat(`DMP Sample ID: ${sample.dmpSampleId}`);
            } else if (sample.accessionNumber) {
                droppedToText.concat(`Accession Number: ${sample.accessionNumber}`);
            }
        });
    }
    if (depletedSampleInfo) {
        depletedSampleTitle = 'Depleted samples:';
        depletedSampleInfo.forEach(sample => {
            depletedToText.concat(`<br>Investigator ID: ${sample.investigatorId}, `);
            if (sample.dmpSampleId) {
                depletedToText.concat(`DMP ID: ${sample.dmpSampleId}`);
            }
        });
    }
    Swal.fire({
        title: 'Sample Mismatch',
        html:
            `${droppedSampleTitle} ${droppedToText} <br><br>${depletedSampleTitle} ${depletedToText}`,
        icon: 'info',
        animation: false,
        confirmButtonText: 'OK',
    });
};
