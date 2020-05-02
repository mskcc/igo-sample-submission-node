import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withLocalize } from 'react-localize-redux'
import { connect } from 'react-redux'
import { gridActions, userActions } from "../../redux/actions/"
import { swal } from "../../util"
import UploadFormContainer from './UploadFormContainer'
import UploadGridContainer from './UploadGridContainer'

export class UploadPage extends Component {
  handleFormSubmit = formValues => {
    this.props.getColumns(formValues)
  }
  handleGridSubmit = formValues => {
    this.props.addGridToBankedSample(this.props)
  }


  pasteTooMany = newRowNumber => {
    let prevRowNumber = this.props.grid.form.numberOfSamples
    this.props.increaseRowNumber(prevRowNumber, newRowNumber)
    swal.tooManyRowsPasteAlert()
  }
  submitRowNumberUpdate = () => {
    let newRowNumber = this.props.form.selected.numberOfSamples
    let prevRowNumber = this.props.grid.form.numberOfSamples
    let change = (newRowNumber - prevRowNumber)
    if (change < 0)
    {return this.props.decreaseRowNumber(change, newRowNumber)}
    if (change > 0){
      return this.props.increaseRowNumber(prevRowNumber, newRowNumber)
    }
  }

  render() {
    return (
      <React.Fragment>
        <UploadFormContainer
          handleSubmit={this.handleFormSubmit}
          submitRowNumberUpdate={this.submitRowNumberUpdate}
          gridIsLoading={this.props.grid.gridIsLoading}
          nothingToChange={this.props.grid.nothingToChange}
          gridNumberOfSamples={this.props.grid.form.numberOfSamples}
        />

        {this.props.grid.rows.length > 0 && (
          <UploadGridContainer handleSubmit={this.handleGridSubmit} pasteTooMany={this.pasteTooMany}/>
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
  form: state.upload.form,
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
