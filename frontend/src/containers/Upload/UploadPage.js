import React, { Component } from 'react';
 
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { gridActions, userActions } from '../../redux/actions';
import { swal } from '../../util';
import UploadFormContainer from './UploadFormContainer';
import UploadGridContainer from './UploadGridContainer';

export class UploadPage extends Component {
    handleFormSubmit = (page, formValues) => {
        const { getColumns } = this.props;
        getColumns(page, formValues);
    };

    handleGridSubmit = () => {
        const { addGridToBankedSample } = this.props;
        addGridToBankedSample(this.props);
    };

    pasteTooMany = (newRowNumber) => {
        const { grid, increaseRowNumber } = this.props;
        const prevRowNumber = grid.form.numberOfSamples;
        increaseRowNumber(prevRowNumber, newRowNumber);
        swal.genericMessageWithTitle('warning', 'Pasting too many rows.', 'We adjusted the sample number for you now, please paste one more time. (Additional rows need to be added before pasting to apply all autofilling logic.)',);
    };

    submitRowNumberUpdate = () => {
        let newRowNumber;
        const { gridType, dmpForm, form, grid, decreaseRowNumber, increaseRowNumber } = this.props;
        if (gridType === 'dmp') {
            newRowNumber = dmpForm.selected.numberOfSamples;
        } else {
            newRowNumber = form.selected.numberOfSamples;
        }
        const prevRowNumber = grid.form.numberOfSamples;
        const change = newRowNumber - prevRowNumber;

        if (change < 0) {
            return decreaseRowNumber(change, newRowNumber);
        }
        if (change > 0) {
            return increaseRowNumber(prevRowNumber, newRowNumber);
        }
    };

    render() {
        const { gridType, grid } = this.props;
        return (
            <React.Fragment>
                <UploadFormContainer
                    formType={gridType}
                    handleSubmit={this.handleFormSubmit}
                    submitRowNumberUpdate={this.submitRowNumberUpdate}
                />

                {/* grid.gridType is the type used to generate this grid */}
                {/* {grid.rows.length > 0 && gridType === grid.gridType && (
                    <UploadGridContainer gridType={gridType} handleSubmit={this.handleGridSubmit} pasteTooMany={this.pasteTooMany} />
                )} */}
            </React.Fragment>
        );
    }
}


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
