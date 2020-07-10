import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  gridActions,
  submissionActions,
  userActions,
} from '../../redux/actions/';
import { util, swal } from '../../util';

import { UploadGrid } from '../../components';

class UploadGridContainer extends React.Component {
  handleChange = (changes) => {
    this.props.registerGridChange(changes);
  };
  handleMRN = (rowIndex) => {
    this.props.handleMRN(rowIndex);
  };
  handleIndex = (colIndex, rowIndex, newValue) => {
    this.props.handleIndex(colIndex, rowIndex, newValue);
  };
  handleAssay = (rowIndex, colIndex, oldValue, newValue) => {
    this.props.handleAssay(rowIndex, colIndex, oldValue, newValue);
  };

  handleTumorType = (rowIndex, colIndex, oldValue, newValue) => {
    this.props.handleTumorType(rowIndex, colIndex, oldValue, newValue);
  };

  handleClear = () => {
    swal.confirmGridClear().then((decision) => {
      decision && this.props.handleClear();
    });
  };

  handleSave = () => {
    // Check if current form was the one used to generate grid
    const gridType = this.props.grid.gridType;
    const formValues = this.props[gridType].form.selected;

    let match = util.checkGridAndForm(formValues, this.props.grid.form);
    if (!match.success) {
      return swal.formGridMismatch(match);
    }

    this.props.createPartialSubmission(this.props.grid);
  };

  handleUpdate = () => {
    // Check if current form was the one used to generate grid
    const gridType = this.props.grid.gridType;
    const formValues = this.props[gridType].form.selected;

    let match = util.checkGridAndForm(formValues, this.props.grid.form);
    if (!match.success) {
      return swal.formGridMismatch(match);
    }

    swal.confirmUpdate().then((decision) => {
      if (decision) {
        this.props.updatePartialSubmission(this.props.updatePartialSubmission);
      }
    });
  };

  handleSubmit = () => {
    const { columnFeatures, hiddenColumns, rows, gridType } = this.props.grid;
    // const gridType = this.props.grid.gridType;
    const formValues = this.props[gridType].form.selected;

    let match = util.checkGridAndForm(formValues, this.props.grid.form);
    if (!match.success) {
      return swal.formGridMismatch(match);
    }
    let emptyColumns = util.checkEmptyColumns(
      columnFeatures,
      rows,
      hiddenColumns
    );

    if (emptyColumns.size > 0) {
      swal.emptyFieldsError(emptyColumns);
      return;
    } else {
      if (gridType === 'dmp') {
        if (this.props.user.role !== 'user') {
          let reviewed = true;
          return swal
            .genericDecision(
              'Publish to DMP?',
              'Submitting publishes the approved samples to the DMP and you will not be able to edit this submission again. <br> If you are not ready to publish, made changes unrelated to approval or a fixing user errors, use the save button instead.'
            )
            .then(
              (decision) => decision && this.props.submitDmpSubmission(reviewed)
            );
        }
        return this.props.submitDmpSubmission();
      } else return this.props.submitSubmission();
    }
  };

  handleDownload = () => {
    return this.props.downloadGrid();
  };

  render() {
    const { grid, gridType, user, submissionToEdit } = this.props;
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
        preValidate={this.props.preValidate}
        handlePatientId={this.props.handlePatientId}
        handleClear={this.handleClear}
        pasteTooMany={this.props.pasteTooMany}
      />
    ) : null;
  }
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadGridContainer);
