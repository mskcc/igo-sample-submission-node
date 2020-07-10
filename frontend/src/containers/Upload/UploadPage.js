import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { gridActions, userActions } from '../../redux/actions';
import { swal } from '../../util';
import UploadFormContainer from './UploadFormContainer';
import UploadGridContainer from './UploadGridContainer';

export class UploadPage extends Component {
    handleFormSubmit = (page, formValues) => {
        this.props.getColumns(page, formValues);
    };

    handleGridSubmit = (formValues) => {
        this.props.addGridToBankedSample(this.props);
    };

    pasteTooMany = (newRowNumber) => {
        const prevRowNumber = this.props.grid.form.numberOfSamples;
        this.props.increaseRowNumber(prevRowNumber, newRowNumber);
        swal.tooManyRowsPasteAlert();
    };

    submitRowNumberUpdate = () => {
        let newRowNumber;
        if (this.props.gridType === 'dmp') {
            newRowNumber = this.props.dmpForm.selected.numberOfSamples;
        } else {
            newRowNumber = this.props.form.selected.numberOfSamples;
        }
        const prevRowNumber = this.props.grid.form.numberOfSamples;
        const change = newRowNumber - prevRowNumber;

        if (change < 0) {
            return this.props.decreaseRowNumber(change, newRowNumber);
        }
        if (change > 0) {
            return this.props.increaseRowNumber(prevRowNumber, newRowNumber);
        }
    };

    render() {
        return (
            <React.Fragment>
                <UploadFormContainer
                    formType={this.props.gridType}
                    handleSubmit={this.handleFormSubmit}
                    submitRowNumberUpdate={this.submitRowNumberUpdate}
                />

                {this.props.grid.rows.length > 0 && this.props.gridType === this.props.grid.gridType && (
                    <UploadGridContainer
                        gridType={this.props.gridType}
                        handleSubmit={this.handleGridSubmit}
                        pasteTooMany={this.pasteTooMany}
                    />
                )}
            </React.Fragment>
        );
    }
}

UploadPage.defaultProps = {
    grid: {},
};

const mapStateToProps = (state) => ({
    grid: state.upload.grid,
    form: state.upload.form,
    // submissionToEdit: state.upload.submissions.submissionToEdit,
    dmpForm: state.dmp.form,
});

export default withLocalize(
    connect(mapStateToProps, {
        ...gridActions,
        ...userActions,
    })(UploadPage)
);
