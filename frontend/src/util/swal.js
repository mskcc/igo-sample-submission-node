import Swal from 'sweetalert2';

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

export const invalidValues = (msg) => {
  Swal.fire({
    title: 'Invalid Values',
    html: msg,
    footer: 'To avoid mistakes, invalid cells are cleared immediately.',
    type: 'error',
    animation: false,
    confirmButtonText: 'Dismiss',
    confirmButtonColor: '#007cba',
    customClass: { content: 'alert' },
  });
};
export const nothingToChange = () => {
  Swal.fire({
    title: 'Nothing to change.',
    type: 'info',
    animation: false,
    confirmButtonColor: '#007cba',
    confirmButtonText: 'Dismiss',
  });
};
export const altServiceIdNotice = () => {
  Swal.fire({
    title: 'Service Id',
    html:
      'Please make sure to get an ID through iLabs. For now, we will use a placeholder, please write it down (it will also be on your receipt once you submitted.).',
    type: 'info',
    animation: false,
    confirmButtonText: 'Dismiss',
  });
};

export const tooManyRowsPasteAlert = () => {
  Swal.fire({
    title: 'Too many rows.',
    html:
      'We adjusted the grid for you now, please paste one more time. (Additional rows need to be added before pasting to apply all autofilling logic.)',
    type: 'warning',
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
      text:
        'You will not be able to revert this unless you have a saved partial submission.',
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
      html:
        'You are editing an existing partial submission. Are you sure you want to update it?',
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

export const apiValidationError = (msg, data) => {
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

export const genericMessage = (type, msg) => {
  Swal.fire({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    text: msg,
    type: type,
    animation: false,
    confirmButtonText: 'Dismiss',
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
