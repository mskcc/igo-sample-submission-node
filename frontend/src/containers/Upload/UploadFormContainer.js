import React, { Component } from 'react'

import { swal } from '../../util'
import { connect } from 'react-redux'
import { formActions } from "../../redux/actions/"

import { UploadForm } from '../../components'

export class UploadFormContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps, prevState) { }

  componentDidMount() {
    // todo wait for token refresh!
    if (!this.props.form.initialFetched) {
      this.props.getInitialState()
    }
  }

  handleMaterialChange = selectedMaterial => {
    if (selectedMaterial) {
      // get possible applications for this material
      this.props.getApplicationsForMaterial(selectedMaterial)
    } else {
      this.props.clearMaterial()
    }
  }

  handleApplicationChange = selectedApplication => {
    if (selectedApplication) {
      // get possible ,materials for this application
      this.props.getMaterialsForApplication(selectedApplication)
    } else {
      this.props.clearApplication()
    }
  }

  handleSpeciesChange = selectedSpecies => {
    if (selectedSpecies) {
      this.props.getFormatterForSpecies(selectedSpecies)
    } else this.props.clearSpecies()
  }
  handleInputChange = (id, value) => {
    console.log(id);
    console.log(value);
    if (value) {
      this.props.select(id, value)
    } else this.props.clear(id)
  }

  handleClear = () => {
    swal.confirmClear().then((decision) => {
      if (decision) {
        this.props.clearForm()
      }
    })
  }





  render() {
    const {
      classes,
      form,
      handleSubmit,
      submitRowNumberUpdate,
      gridIsLoading,
      nothingToChange,
      gridNumberOfSamples
    } = this.props
    return form && form.allMaterials ? (
      <UploadForm
        form={form}
        gridNumberOfSamples={gridNumberOfSamples}
        gridIsLoading={gridIsLoading}
        nothingToChange={nothingToChange}
        handleSubmit={handleSubmit}
        submitRowNumberUpdate={submitRowNumberUpdate}
        handleMaterialChange={this.handleMaterialChange}
        handleApplicationChange={this.handleApplicationChange}
        handleSpeciesChange={this.handleSpeciesChange}
        handleInputChange={this.handleInputChange}
        handleClear={this.handleClear}
      />
    ) : (
        <div />
      )
  }
}

UploadFormContainer.defaultProps = {
  getInitialState: () => { },
  form: {},
  gridIsLoading: false,
  nothingToChange: false,
  handleSubmit: () => { },
  handleMaterialChange: () => { },
  handleApplicationChange: () => { },
  handleSpeciesChange: () => { },
  handleInputChange: () => { },
  handleClear: () => { },
}

const mapStateToProps = state => ({
  form: state.upload.form,
})

const mapDispatchToProps = {
  ...formActions,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFormContainer)
