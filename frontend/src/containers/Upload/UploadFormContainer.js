import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

import { connect } from 'react-redux'
import { formActions } from '../../actions'

import { UploadForm } from '../../components'

export class UploadFormContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps, prevState) {}

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
    if (value) {
      this.props.select(id, value)
    } else this.props.clear(id)
  }

  handleClear = () => {
    Swal.fire({
      title: 'Are you sure?',

      type: 'warning',
      showCancelButton: true,
      animation: false,
      confirmButtonColor: '#df4602',
      cancelButtonColor: '#007cba',
      confirmButtonText: 'Yes, clear it!',
    }).then(result => {
      if (result.value) {
        this.props.clearForm()
        // it works!
        location.reload()
      }
    })
  }

  render() {
    const {
      classes,
      form,
      handleSubmit,
      gridIsLoading,
      nothingToChange,
    } = this.props
    return form && form.allMaterials ? (
      <UploadForm
        form={form}
        gridIsLoading={gridIsLoading}
        nothingToChange={nothingToChange}
        handleSubmit={handleSubmit}
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
  getInitialState: () => {},
  form: {},
  gridIsLoading: false,
  nothingToChange: false,
  handleSubmit: () => {},
  handleMaterialChange: () => {},
  handleApplicationChange: () => {},
  handleSpeciesChange: () => {},
  handleInputChange: () => {},
  handleClear: () => {},
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
