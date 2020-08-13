import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { gridActions, submissionActions } from '../../redux/actions';
import { resetErrorMessage } from '../../redux/actions/commonActions';

import { swal } from '../../util';

import { SubmissionsGrid } from '../../components/';

export class SubmissionsPage extends Component {
    componentDidMount() {
        const { getSubmissions, gridType } = this.props;
        getSubmissions(gridType);
        // TODO make submissionsSince default once subs are imported
    }

    handleFilterClick = (unit, time, all = false) => {
        const { getSubmissions, getSubmissionsSince, gridType } = this.props;
        if (all) return getSubmissions(gridType);
        return getSubmissionsSince(unit, time, gridType);
    };

    handleGridClick = (coords, readyForAction, mongoId, serviceId) => {
        const { submissions } = this.props;
        console.log(mongoId);
        const column = submissions.grid.columnFeatures[coords.col].data;

        if (column === 'edit' && !readyForAction) {
            this.handleEdit(mongoId);
        } else if (column === 'review' && readyForAction) {
            this.handleEdit(mongoId);
        } else if (column === 'pullFromDmp' && readyForAction) {
            this.handleCheckDmp();
        } else if (column === 'loadFromDmp' && readyForAction) {
            const row = submissions.grid.rows[coords.row];
            this.handleLoadFromDmp(serviceId, mongoId, row);
        } else if (column === 'unsubmit' && readyForAction) {
            this.handleUnsubmit(mongoId);
        } else if (column === 'receipt' && readyForAction) {
            this.handleReceipt(mongoId, serviceId);
        } else if (column === 'delete' && !readyForAction) {
            this.handleDelete(mongoId);
        }
    };

    handleEdit = (submissionId) => {
        const { populateGridFromSubmission } = this.props;
        return populateGridFromSubmission(submissionId, this.props);
    };

    handleCheckDmp = (submissionId) => {
        const { checkDmp } = this.props;
        return checkDmp(submissionId, this.props);
    };

    handleLoadFromDmp = (trackingId, mongoId, row) => {
        const { loadFromDmp } = this.props;
        if (row.loadedFromDmpAt !== '') {
            swal.genericDecision(
                'Are you sure?',
                'This has been loaded from the DMP before. If you load it again, any edits you might have made in the related IGO Submission will be overwritten.'
            ).then((decision) => decision && loadFromDmp(trackingId, mongoId, this.props));
        } else loadFromDmp(trackingId, mongoId, this.props);
    };

    handleUnsubmit = (submissionId) => {
        const { unsubmit, gridType } = this.props;
        return unsubmit(submissionId, gridType);
    };

    handleImport = () => {
        const { importSqlSubmissions } = this.props;
        return importSqlSubmissions();
    };

    handleReceipt = (submissionId, serviceId) => {
        const { downloadReceipt, gridType } = this.props;
        return downloadReceipt(submissionId, serviceId, gridType);
    };

    handleDelete = (submissionId) => {
        const { deleteSubmission, gridType } = this.props;
        swal.confirmDelete().then((decision) => {
            if (decision) {
                deleteSubmission(submissionId, gridType);
            }
        });
    };

    render() {
        const { submissions, gridType, user } = this.props;

        return submissions.grid.rows.length > 0 ? (
            <React.Fragment>
                <SubmissionsGrid
                    grid={submissions.grid}
                    gridType={gridType}
                    handleGridClick={this.handleGridClick}
                    handleFilterClick={this.handleFilterClick}
                    handleImport={this.handleImport}
                    handleCheckDmp={this.handleCheckDmp}
                    user={user}
                />
            </React.Fragment>
        ) : (
            'No submissions available.'
        );
    }
}

SubmissionsPage.propTypes = {
    deleteSubmission: PropTypes.func,
    downloadReceipt: PropTypes.func,
    getSubmissions: PropTypes.func,
    getSubmissionsSince: PropTypes.func,
    gridType: PropTypes.string,
    populateGridFromSubmission: PropTypes.func,
    submissions: PropTypes.shape({
        grid: PropTypes.shape({
            columnFeatures: PropTypes.array,
            rows: PropTypes.array,
        }),
    }),
    unsubmit: PropTypes.func,
};

const mapStateToProps = (state) => ({
    submissions: state.submissions,
    user: state.user,
});

export default withLocalize(
    connect(mapStateToProps, {
        resetErrorMessage,
        ...gridActions,
        ...submissionActions,
    })(SubmissionsPage)
);
