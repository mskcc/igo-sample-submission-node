import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withLocalize } from 'react-localize-redux'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import { userActions, gridActions, submissionActions } from '../../redux/actions'
import { resetErrorMessage } from '../../redux/actions/commonActions'

import SubmissionsTable from '../../components/Submissions/SubmissionsTable'
import { Dialog } from '../../components'

export class SubmissionsPage extends Component {
  componentDidMount() {
    this.props.getSubmissions()
  }

  handleClick = (type, submissionId, serviceId) => {
    switch (type) {
      case 'edit': {
        console.log('edit')
        return this.props.editSubmission(submissionId, this.props)
      }
      case 'receipt': {
        return this.props.downloadReceipt(submissionId, serviceId)
      }
      case 'delete': {
        Swal.fire({
          title: 'Are you sure?',

          type: 'warning',
          showCancelButton: true,
          animation: false,
          confirmButtonColor: '#df4602',
          cancelButtonColor: '#007cba',
          confirmButtonText: 'Delete',
        }).then(result => {
          if (result.value) {
            this.props.deleteSubmission(submissionId, serviceId)
            return this.props.history.push('submissions')
          }
        })
      }
      default:
        return null
    }
  }

  render() {
    console.log(this.props.submissions.grid)
    return this.props.submissions.grid.rows.length > 0 ? (
      <SubmissionsTable grid={this.props.submissions.grid} user={this.props.user} handleClick={this.handleClick} />
    ) : (
      'You have not submitted anything since the launch of V2!'
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  submissions: state.submissions,
  loggedIn: state.user.loggedIn,
  loading: state.user.loading,
})

export default withLocalize(
  connect(
    mapStateToProps,
    {
      resetErrorMessage,
      ...userActions,
      ...gridActions,
      ...submissionActions
    }
  )(SubmissionsPage)
)
