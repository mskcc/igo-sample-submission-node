import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withLocalize } from 'react-localize-redux'
import { connect } from 'react-redux'
import { gridActions, userActions } from '../../actions'
import { Redirect } from 'react-router-dom'

import { Dialog } from '../../components'
import UploadFormContainer from './UploadFormContainer'
import UploadGridContainer from './UploadGridContainer'

export class UploadPage extends Component {
  handleFormSubmit = formValues => {
    this.props.getColumns(formValues)
  }
  handleGridSubmit = formValues => {
    this.props.addGridToBankedSample(this.props)
  }

  componentDidMount() {
    // this.props.refreshToken()
  }

  render() {
    return (
      <React.Fragment>
        <UploadFormContainer
          handleSubmit={this.handleFormSubmit}
          gridIsLoading={this.props.grid.gridIsLoading}
          nothingToChange={this.props.grid.nothingToChange}
        />

        {this.props.grid.rows.length > 0 && (
          <UploadGridContainer handleSubmit={this.handleGridSubmit} />
        )}
      </React.Fragment>
    )
  }
}

UploadPage.defaultProps = {
  grid: {},
}

const mapStateToProps = state => ({
  grid: state.upload.grid,
})

export default withLocalize(
  connect(
    mapStateToProps,
    {
      ...gridActions,
      ...userActions,
    }
  )(UploadPage)
)
