import Swal from 'sweetalert2'

export const formGridMismatch = (match) => {
  Swal.fire({
    title: 'Header does not match grid',
    html:
      'Please make sure your current header values match the ones used to generate the table. <br>(Header value x Table value) <br>' +
      match.message,
    type: 'error',
    animation: false,
    confirmButtonText: 'Dismiss',
  })
}


export const altServiceIdNotice = () => {
  Swal.fire({
    title: 'Service Id',
    html: "Please make sure to get an ID through iLabs. For now, we will use a placeholder, please write it down (it will also be on your receipt once you submitted.).",
    type: 'info',
    animation: false,
    confirmButtonText: 'Dismiss',
  })
}

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
    }).then(result => {
      if (result.value) { resolve(true) }
      else resolve(false)
    })
  })
}


export const confirmUpdate = () => {
  return new Promise((resolve) => {
    Swal.fire({
      title: 'Update?',
      html: `You are editing an existing partial submission. Are you sure you want to update it?`,
      type: 'info',
      animation: 'false',
      showCancelButton: true,
      animation: false,
      confirmButtonColor: '#df4602',
      cancelButtonColor: '#007cba',
      confirmButtonText: 'Overwrite',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.value) { resolve(true) }
      else resolve(false)
    })
  })
}



export const apiValidationError = (msg, data) => {
  console.log(data)
  let errors = data || ""
  if (data) {
    errors = ""
    data.map(element => { errors += `${element.param}: ${element.msg}\n` })
  }
  Swal.fire({
    title: msg,
    html: errors,
    type: 'error',
    animation: false,
    confirmButtonText: 'Dismiss',
  })
}