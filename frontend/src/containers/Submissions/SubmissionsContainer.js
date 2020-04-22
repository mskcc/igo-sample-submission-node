import React, { Component } from 'react'

import { withLocalize } from 'react-localize-redux'
import { connect } from 'react-redux'
import {swal} from "../../util"
import { gridActions, submissionActions } from '../../redux/actions'
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
        swal.confirmDelete().then((decision) => {
          if (decision) {
            this.props.deleteSubmission(submissionId, this.props)
            // return this.props.getSubmissions()
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
