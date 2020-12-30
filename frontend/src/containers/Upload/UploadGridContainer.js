 import React, { Component } from 'react';

import { connect } from 'react-redux';
import { gridActions, submissionActions, userActions, commonActions } from '../../redux/actions';

import { util, swal } from '../../util';
import { UploadGrid } from '../../components';

class UploadGridContainer extends Component {
    handleChange = (changes, source) => {
        const { handleGridChange } = this.props;        
        handleGridChange(changes);
    };

    handleClear = () => {
        const { handleClear } = this.props;
        swal.confirmGridClear().then((decision) => {
            decision && handleClear();
        });
    };

    handleSave = () => {
        // Check if current form was the one used to generate grid
        const { grid, createPartialSubmission } = this.props;
        // grid.gridType is the type used to generate this grid
        const gridType = grid.gridType;
        const formValues = this.props[gridType].form.selected;

        const match = util.checkGridAndForm(formValues, grid.form);
        if (!match.success) {            
            return swal.formGridMismatch(match);
        }

        return createPartialSubmission(gridType);
    };

    handleUpdate = () => {
        const { grid, updatePartialSubmission } = this.props;
        // Check if current form was the one used to generate grid
        const gridType = grid.gridType;
        const formValues = this.props[gridType].form.selected;

        const match = util.checkGridAndForm(formValues, grid.form);
        if (!match.success) {
            return swal.formGridMismatch(match);
        }

        swal.confirmUpdate().then((decision) => {
            if (decision) {
                return updatePartialSubmission(gridType);
            }
        });
    };

    handleSubmit = () => {
        const { grid, user, submitSubmission, submitDmpSubmission } = this.props;
        const formValues = this.props[grid.gridType].form.selected;

        const match = util.checkGridAndForm(formValues, grid.form);
        if (!match.success) {
            return swal.formGridMismatch(match);
        }
        let emptyColumns = util.getEmptyColumns(grid.columnFeatures, grid.rows, grid.hiddenColumns);

        if (emptyColumns.size > 0) {
            swal.emptyFieldsError(emptyColumns);
            return;
        } else {
            if (grid.gridType === 'dmp') {
                if (user.role !== 'user') {
                    // TODO depends on backend info
                    let reviewed = true;
                    return swal
                        .genericDecision(
                            'Publish to DMP?',
                            'Submitting publishes the approved samples to the DMP and you will not be able to edit this submission again. <br> If you are not ready to publish, made changes unrelated to approval or fixing user errors, use the save button instead.'
                        )
                        .then((decision) => decision && submitDmpSubmission(reviewed));
                }
                return submitDmpSubmission();
            } else return submitSubmission();
        }
    };

    handleDownload = () => {
        const { downloadGrid } = this.props;
        return downloadGrid();
    };

    render() {
        const { grid, gridType, user, submissionToEdit, pasteTooMany } = this.props;
        return grid.rows.length > 0 ? (
            <UploadGrid
                grid={grid}
                gridType={gridType}
                user={user}
                submissionToEdit={submissionToEdit}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                handleSave={this.handleSave}
                handleUpdate={this.handleUpdate}
                handleDownload={this.handleDownload}
                handleClear={this.handleClear}
                pasteTooMany={pasteTooMany}
            />
        ) : null;
    }
}


UploadGridContainer.defaultProps = {
    grid: {},
    user: {},
    handleSubmit: () => {},
    handleChange: () => {},
    handleSave: () => {},
    handleClear: () => {},
    showLoader: () => {},
};

const mapStateToProps = (state) => ({
    grid: state.upload.grid,
    form: state.upload.form,
    upload: state.upload,
    dmp: state.dmp,

    submissionToEdit: state.submissions.submissionToEdit,
    user: state.user,
});

const mapDispatchToProps = {
    ...gridActions,
    ...submissionActions,
    ...userActions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadGridContainer);
