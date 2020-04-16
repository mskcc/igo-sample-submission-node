import Swal from 'sweetalert2'

export const formGridMismatch = () => {
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