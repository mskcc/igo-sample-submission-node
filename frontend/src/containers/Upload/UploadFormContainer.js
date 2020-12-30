 import React, { Component } from 'react';

import { connect } from 'react-redux';
import { formActions, dmpFormActions } from '../../redux/actions';

import { swal } from '../../util';
import { DmpForm, UploadForm } from '../../components';

export class UploadFormContainer extends Component {
    componentDidMount() {
        const { formType, upload, dmp, getInitialState, dmpGetInitialState } = this.props;
        const isIgoForm = formType === 'upload';
        if (isIgoForm && !upload.form.initialFetched) return getInitialState();
        if (!isIgoForm && !dmp.form.initialFetched) return dmpGetInitialState();
        return;
    }

    handleMaterialChange = (selectedMaterial) => {
        const { getApplicationsForMaterial, clearMaterial } = this.props;
        if (selectedMaterial) {
            // get possible applications for this material
            getApplicationsForMaterial(selectedMaterial);
        } else {
            clearMaterial();
        }
    };

    handleApplicationChange = (selectedApplication) => {
        const { getMaterialsForApplication, clearApplication } = this.props;
        if (selectedApplication) {
            // get possible ,materials for this application
            getMaterialsForApplication(selectedApplication);
        } else {
            clearApplication();
        }
    };

    handleSpeciesChange = (selectedSpecies) => {
        const { clearSpecies } = this.props;
        if (!selectedSpecies) clearSpecies();
    };
    handleInputChange = (id, value) => {
        const { formType, select, dmpSelect, clear, dmpClear } = this.props;
        const isIgoForm = formType === 'upload';
        if (value) {
            isIgoForm ? select(id, value) : dmpSelect(id, value);
        } else {
            isIgoForm ? clear(id) : dmpClear(id);
        }
    };

    handleClear = () => {
        const { clearForm } = this.props;
        swal.confirmClear().then((decision) => {
            if (decision) clearForm();
        });
    };

    render() {
        const { upload, dmp, formType, handleSubmit, submitRowNumberUpdate } = this.props;
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
                        submitRowNumberUpdate={submitRowNumberUpdate}
                        gridIsLoading={upload.grid.gridIsLoading}
                        nothingToChange={upload.grid.nothingToChange}
                        gridNumberOfSamples={upload.grid.form.numberOfSamples}
                        form={dmp.form}
                    />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    upload: state.upload,
    dmp: state.dmp,
});

const mapDispatchToProps = {
    ...formActions,
    ...dmpFormActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFormContainer);
