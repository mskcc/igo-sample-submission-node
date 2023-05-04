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
    let droppedSampleTitle = '';
    let droppedTable = '<table class="sample-drop-table">';
    let depletedSampleTitle = '';
    let depletedTable = '<table class="sample-drop-table">';
    if (droppedSampleInfo && droppedSampleInfo.length > 0) {
        droppedSampleTitle = 'Samples Dropped or Not Requested:';
        droppedTable = droppedTable.concat('<tr class="drop-sample-header"><td><b>Investigator ID</b></td>');
        if (droppedSampleInfo[0].dmpSampleId) {
            droppedTable = droppedTable.concat('<td><b>DMP Sample ID</b></td></tr>');
        } else if (droppedSampleInfo[0].accessionNumber) {
            droppedTable = droppedTable.concat('<td><b>Accession Number</b></td></tr>');
        }
        droppedSampleInfo.forEach((sample) => {
            if (sample.dmpSampleId) {
                //${sample.investigatorId}, ${sample.dmpSampleId}
                droppedTable = droppedTable.concat(`<tr><td>${sample.investigatorId}</td><td>${sample.dmpSampleId}</td></tr>`);

            } else if (sample.accessionNumber) {
                //${sample.accessionNumber}
                droppedTable = droppedTable.concat(`<tr><td>${sample.investigatorId}</td><td>${sample.accessionNumber}</td></tr>`);
            }
        });
        droppedTable = droppedTable.concat('</table>');
    }
    if (depletedSampleInfo && depletedSampleInfo.length > 0) {
        depletedSampleTitle = 'Depleted Samples:';
        depletedTable = depletedTable.concat('<tr class="drop-sample-header"><td><b>Investigator ID</b></td>');
        if (depletedSampleInfo[0].dmpSampleId) {
            depletedTable = depletedTable.concat('<td><b>DMP Sample ID</b></td></tr>');
        } else {
            // if no sample id, just end row
            depletedTable = depletedTable.concat('</tr>');
        }
        depletedSampleInfo.forEach((sample) => {
            depletedTable = depletedTable.concat(`<tr><td>${sample.investigatorId}</td>`);
            if (sample.dmpSampleId) {
                depletedTable = depletedTable.concat(`<td>${sample.dmpSampleId}</td></tr>`);
            } else {
                depletedTable = depletedTable.concat('</tr>');
            }
        });
        depletedTable = depletedTable.concat('</table>');
    }
    Swal.fire({
        title: 'Sample Attrition',
        html:
            `<b>${droppedSampleTitle}</b> ${droppedTable} <br><br><b>${depletedSampleTitle}</b> ${depletedTable}`,
        icon: 'info',
        animation: false,
        customClass: 'swal-wide',
        confirmButtonText: 'OK',
    });
};
