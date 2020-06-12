import React, { Component } from 'react';

import { swal } from '../../util';
import { connect } from 'react-redux';
import { formActions, dmpFormActions } from '../../redux/actions/';

import { DmpForm, UploadForm } from '../../components';

export class UploadFormContainer extends React.Component {
  componentDidUpdate(prevProps, prevState) {}

  componentDidMount() {
    let isUploadForm = this.props.formType === 'upload';
    if (isUploadForm && !this.props.upload.form.initialFetched) {
      this.props.getInitialState();
    } else if (!isUploadForm && !this.props.dmp.form.initialFetched) {
      this.props.dmpGetInitialState();
    }
  }

  handleMaterialChange = selectedMaterial => {
    if (selectedMaterial) {
      // get possible applications for this material
      this.props.getApplicationsForMaterial(selectedMaterial);
    } else {
      this.props.clearMaterial();
    }
  };

  handleApplicationChange = selectedApplication => {
    if (selectedApplication) {
      // get possible ,materials for this application
      this.props.getMaterialsForApplication(selectedApplication);
    } else {
      this.props.clearApplication();
    }
  };

  handleSpeciesChange = selectedSpecies => {
    if (!selectedSpecies) this.props.clearSpecies();
  };
  handleInputChange = (id, value) => {
    let isUploadForm = this.props.formType === 'upload';

    if (value) {
      isUploadForm
        ? this.props.select(id, value)
        : this.props.dmpSelect(id, value);
    } else {
      isUploadForm ? this.props.clear(id) : this.props.dmpClear(id);
    }
  };

  handleClear = () => {
    swal.confirmClear().then(decision => {
      if (decision) {
        this.props.clearForm();
      }
    });
  };

  render() {
    const {
      upload,
      dmp,
      formType,
      handleSubmit,
      submitRowNumberUpdate
    } = this.props;
    return (
      <React.Fragment>
        {formType === 'upload' ? (
          upload.form && upload.form.allMaterials ? (
            <UploadForm
              form={upload.form}
              gridNumberOfSamples={upload.grid.form.numberOfSamples}
              gridIsLoading={upload.grid.gridIsLoading}
              nothingToChange={upload.form.nothingToChange}
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
        ) : (
          <DmpForm
            handleSubmit={handleSubmit}
            handleInputChange={this.handleInputChange}
            handleClear={this.handleClear}
            submitRowNumberUpdate={this.submitRowNumberUpdate}
            gridIsLoading={upload.grid.gridIsLoading}
            // gridIsLoading={dmp.grid.gridIsLoading}
            nothingToChange={upload.grid.nothingToChange}
            gridNumberOfSamples={upload.grid.form.numberOfSamples}
            form={dmp.form}
          />
        )}
      </React.Fragment>
    );
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
  handleClear: () => {}
};

const mapStateToProps = state => ({
  upload: state.upload,
  dmp: state.dmp
});

const mapDispatchToProps = {
  ...formActions,
  ...dmpFormActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFormContainer);
