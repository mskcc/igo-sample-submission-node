import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { gridActions, submissionActions, userActions } from '../../redux/actions';

import { util, swal } from '../../util';
import { UploadGrid } from '../../components';

class UploadGridContainer extends Component {
    handleChange = (changes) => {
        const { registerGridChange } = this.props;
        return registerGridChange(changes);
    };
    handleMRN = (rowIndex) => {
        const { handleMRN } = this.props;
        return handleMRN(rowIndex);
    };
    handleIndex = (colIndex, rowIndex, newValue) => {
        const { handleIndex } = this.props;
        return handleIndex(colIndex, rowIndex, newValue);
    };
    handleAssay = (rowIndex, colIndex, oldValue, newValue) => {
        const { handleAssay } = this.props;
        return handleAssay(rowIndex, colIndex, oldValue, newValue);
    };

    handleTumorType = (rowIndex, colIndex, oldValue, newValue) => {
        const { handleTumorType } = this.props;
        return handleTumorType(rowIndex, colIndex, oldValue, newValue);
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
        let emptyColumns = util.checkEmptyColumns(grid.columnFeatures, grid.rows, grid.hiddenColumns);

        if (emptyColumns.size > 0) {
            swal.emptyFieldsError(emptyColumns);
            return;
        } else {
            if (grid.gridType === 'dmp') {
                if (user.role !== 'user') {
                    // TODO depends on backend ingo
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
        const { grid, gridType, user, submissionToEdit, preValidate, handlePatientId, pasteTooMany } = this.props;
        return grid.rows.length > 0 ? (
            <UploadGrid
                grid={grid}
                gridType={gridType}
                user={user}
                submissionToEdit={submissionToEdit}
                handleMRN={this.handleMRN}
                handleIndex={this.handleIndex}
                handleAssay={this.handleAssay}
                handleTumorType={this.handleTumorType}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                handleSave={this.handleSave}
                handleUpdate={this.handleUpdate}
                handleDownload={this.handleDownload}
                preValidate={preValidate}
                handlePatientId={handlePatientId}
                handleClear={this.handleClear}
                pasteTooMany={pasteTooMany}
            />
        ) : null;
    }
}

UploadGridContainer.propTypes = {
    createPartialSubmission: PropTypes.func,
    downloadGrid: PropTypes.func,
    grid: PropTypes.object,
    gridType: PropTypes.string,
    handleAssay: PropTypes.func,
    handleChange: PropTypes.func,
    handleClear: PropTypes.func,
    handleIndex: PropTypes.func,
    handleMRN: PropTypes.func,
    handlePatientId: PropTypes.func,
    handleSave: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleTumorType: PropTypes.func,
    pasteTooMany: PropTypes.func,
    preValidate: PropTypes.func,
    registerGridChange: PropTypes.func,
    submissionToEdit: PropTypes.object,
    submitDmpSubmission: PropTypes.func,
    submitSubmission: PropTypes.func,
    updatePartialSubmission: PropTypes.func,
    user: PropTypes.object,
};

UploadGridContainer.defaultProps = {
    grid: {},
    user: {},
    handleMRN: () => {},
    handleIndex: () => {},
    handleAssay: () => {},
    handleSubmit: () => {},
    handleChange: () => {},
    handleSave: () => {},
    preValidate: () => {},
    handlePatientId: () => {},
    handleClear: () => {},
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
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadGridContainer);
