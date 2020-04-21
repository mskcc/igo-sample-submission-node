import React, { Component } from 'react'

import { withLocalize } from 'react-localize-redux'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import { userActions, gridActions, submissionActions } from '../../redux/actions'
import { resetErrorMessage } from '../../redux/actions/commonActions'

import SubmissionsTable from '../../components/Submissions/SubmissionsTable'

export class SubmissionsPage extends Component {
  componentDidMount() {
    this.props.getSubmissions()
  }

  handleClick = (type, submissionId, serviceId = undefined) => {
    switch (type) {
      case 'edit': {
        return this.props.populateGridFromSubmission(submissionId, this.props)
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
    return this.props.submissions.grid.rows.length > 0 ? (
      <SubmissionsTable
        grid={this.props.submissions.grid}
        handleClick={this.handleClick}
      />
    ) : (
        'You have not submitted anything since the launch of V2!'
      )
  }
}

const mapStateToProps = state => ({
  submissions: state.submissions,
})

export default withLocalize(
  connect(
    mapStateToProps,
    {
      resetErrorMessage,
      ...gridActions,
      ...submissionActions
    }
  )(SubmissionsPage)
)
