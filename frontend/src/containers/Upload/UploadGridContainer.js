import React, { Component } from 'react';

import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import { connect } from 'react-redux';
import {
  gridActions,
  submissionActions,
  userActions
} from '../../redux/actions/';
import { util, swal } from '../../util';
import CircularProgress from '@material-ui/core/CircularProgress';

import { UploadGrid } from '../../components';

class UploadGridContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = changes => {
    this.props.registerGridChange(changes);
  };
  handleMRN = rowIndex => {
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
    swal.confirmGridClear().then(decision => {
      decision && this.props.handleClear();
    });
  };

  handleSave = () => {
    // Check if current form was the one used to generate grid
    const gridType = this.props.grid.gridType;
    console.log(gridType);
    console.log(this.props);
    const formValues = this.props[gridType].form.selected;

    console.log(formValues);
    let match = util.checkGridAndForm(formValues, this.props.grid.form);
    if (!match.success) {
      return swal.formGridMismatch(match);
    }

    let submissionToEdit = this.props.submissions.submissionToEdit;
    
    
    if (submissionToEdit === undefined) {
      this.props.createPartialSubmission(this.props.grid);
    } else {
      swal.confirmUpdate().then(decision => {
        if (decision) {
          this.props.updatePartialSubmission(
            this.props.updatePartialSubmission
          );
        }
      });
    }
  };

  handleSubmit = () => {
    const { columnFeatures, hiddenColumns, rows } = this.props.grid;
    const gridType = this.props.grid.gridType;
    const formValues = this.props[gridType].form.selected;

    console.log(formValues);
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
      this.props.submitSubmission();
    }
  };

  handleDownload = () => {
    return this.props.downloadGrid();
  };

  render() {
    const { grid, user } = this.props;

    return grid.rows.length > 0 ? (
      <UploadGrid
        grid={grid}
        user={user}
        handleMRN={this.handleMRN}
        handleIndex={this.handleIndex}
        handleAssay={this.handleAssay}
        handleTumorType={this.handleTumorType}
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        handleSave={this.handleSave}
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
  handleClear: () => {}
};

const mapStateToProps = state => ({
  grid: state.upload.grid,
  form: state.upload.form,
  upload: state.upload,
  dmp: state.dmp,

  submissions: state.submissions,
  user: state.user
});

const mapDispatchToProps = {
  ...gridActions,
  ...submissionActions,
  ...userActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadGridContainer);
