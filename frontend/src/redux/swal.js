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



export const apiValidationError = (msg, data) => {
  console.log(data)
  let errors = data || ""
  if (data)
  {errors = ""
  data.map(element => { errors += `${element.param}: ${element.msg}\n` })}
  Swal.fire({
    title: msg,
    html: errors,
    type: 'error',
    animation: false,
    confirmButtonText: 'Dismiss',
  })
}