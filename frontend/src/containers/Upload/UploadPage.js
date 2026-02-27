import React, { Component } from 'react';
 
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { gridActions, userActions } from '../../redux/actions';
import { swal } from '../../util';
import { Config } from '../../config';
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

        // Block access to DMP page when submissions are paused
        if (gridType === 'dmp' && Config.DMP_PAUSED) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
                    <Paper
                        elevation={3}
                        style={{
                            backgroundColor: '#fff3e0',
                            border: '2px solid #e65100',
                            borderRadius: '8px',
                            padding: '32px 40px',
                            maxWidth: '800px',
                            width: '100%',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', gap: '12px' }}>
                            <WarningIcon style={{ color: '#e65100', fontSize: '2rem' }} />
                            <Typography variant='h5' style={{ color: '#e65100', fontWeight: 'bold' }}>
                                DMP Submissions Temporarily Paused
                            </Typography>
                            <WarningIcon style={{ color: '#e65100', fontSize: '2rem' }} />
                        </div>
                        <ul style={{ color: '#333', fontSize: '1rem', lineHeight: '2', paddingLeft: '24px', margin: 0 }}>
                            <li>
                                The Diagnostic Molecular Pathology (DMP) and CMO PM teams are <strong>temporarily unable to receive or process residual DNA or leftover library transfer requests</strong> due to staffing and system changes.
                            </li>
                            <li>
                                This pause also includes inquiries regarding the <strong>status of leftover material, QC data, and available volumes</strong>.
                            </li>
                            <li>
                                You may contact the CMO PM team (<a href='mailto:skicmopm@mskcc.org'>skicmopm@mskcc.org</a>) for closure updates in approximately <strong>4–6 weeks</strong>.
                            </li>
                            <li>
                                In the interim, please consider reaching out to the <strong>Biobank</strong> directly to explore available source material.
                            </li>
                        </ul>
                    </Paper>
                </div>
            );
        }

        return (
            <React.Fragment>
                <UploadFormContainer
                    formType={gridType}
                    handleSubmit={this.handleFormSubmit}
                    submitRowNumberUpdate={this.submitRowNumberUpdate}
                />

                {/* grid.gridType is the type used to generate this grid */}
                {grid.rows.length > 0 && gridType === grid.gridType && (
                    <UploadGridContainer gridType={gridType} handleSubmit={this.handleGridSubmit} pasteTooMany={this.pasteTooMany} />
                )}
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
