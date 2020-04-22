import React, { Component } from 'react'

import { withLocalize } from 'react-localize-redux'
import { connect } from 'react-redux'
import { swal } from "../../util"
import { gridActions, submissionActions } from '../../redux/actions'
import { resetErrorMessage } from '../../redux/actions/commonActions'

import SubmissionsTable from '../../components/Submissions/SubmissionsTable'

export class SubmissionsPage extends Component {
  componentDidMount() {
    this.props.getSubmissions()
  }
  handleEdit = (submissionId) => {
    return this.props.populateGridFromSubmission(submissionId, this.props)
  }
  handleReceipt = (submissionId, serviceId) => {
    return this.props.downloadReceipt(submissionId, serviceId)
  }
  handleDelete = (submissionId) => {
    swal.confirmDelete().then((decision) => {
      if (decision) {
        this.props.deleteSubmission(submissionId)
      }
    })
  }

  render() {
    return this.props.submissions.grid.rows.length > 0 ? (
      <SubmissionsTable
        grid={this.props.submissions.grid}
        handleEdit={this.handleEdit}
        handleReceipt={this.handleReceipt}
        handleDelete={this.handleDelete}
      />
    ) : (
        'No submissions available.'
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
