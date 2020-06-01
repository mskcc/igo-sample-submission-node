import React, { Component } from 'react';

import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { dmpFormActions } from '../../redux/actions';
import { swal } from '../../util';
import { DmpForm } from '../../components/index';
// import UploadGridContainer from './UploadGridContainer';

export class DmpPage extends Component {

  componentDidMount() {
    // todo wait for token refresh!
    if (!this.props.form.initialFetched) {
      this.props.getInitialState();
    }
  }
  handleFormSubmit = formValues => {
    this.props.getColumns(formValues);
  };

  handleGridSubmit = formValues => {
    this.props.addGridToBankedSample(this.props);
  };

  pasteTooMany = newRowNumber => {
    const prevRowNumber = this.props.grid.form.numberOfSamples;
    this.props.increaseRowNumber(prevRowNumber, newRowNumber);
    swal.tooManyRowsPasteAlert();
  };

  submitRowNumberUpdate = () => {
    const newRowNumber = this.props.form.selected.numberOfSamples;
    const prevRowNumber = this.props.grid.form.numberOfSamples;
    const change = newRowNumber - prevRowNumber;

    if (change < 0) {
      return this.props.decreaseRowNumber(change, newRowNumber);
    }
    if (change > 0) {
      return this.props.increaseRowNumber(prevRowNumber, newRowNumber);
    }
  };

  handleInputChange = (id, value) => {
    if (value) {
      this.props.select(id, value);
    } else this.props.clear(id);
  };

  handleClear = () => {
    swal.confirmClear().then((decision) => {
      if (decision) {
        this.props.clearForm();
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <DmpForm
          handleSubmit={this.handleFormSubmit}
          handleInputChange={this.handleInputChange}
          handleClear={this.handleClear}
          submitRowNumberUpdate={this.submitRowNumberUpdate}
          gridIsLoading={this.props.grid.gridIsLoading}
          nothingToChange={this.props.grid.nothingToChange}
          gridNumberOfSamples={this.props.grid.form.numberOfSamples}
          form={this.props.form}
        />

        {/* {this.props.grid.rows.length > 0 && (
          <UploadGridContainer
            handleSubmit={this.handleGridSubmit}
            pasteTooMany={this.pasteTooMany}
          />
        )} */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  form: state.dmp.form,
  grid: state.upload.grid
});

export default withLocalize(
  connect(mapStateToProps, {
    ...dmpFormActions
    // ...userActions
  })(DmpPage)
);
