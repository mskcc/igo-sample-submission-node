import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { gridActions, submissionActions } from '../../redux/actions';
import { resetErrorMessage } from '../../redux/actions/commonActions';

import { swal } from '../../util';

import { SubmissionsGrid } from '../../components/';
import { loadFromDmp } from '../../redux/actions/submission/submissionActions';

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
            this.handleLoadFromDmp(serviceId, mongoId);
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

    handleLoadFromDmp = (trackingId, mongoId) => {
        const { loadFromDmp } = this.props;
        return loadFromDmp(trackingId, mongoId);
    };

    handleUnsubmit = (submissionId) => {
        const { unsubmit, gridType } = this.props;
        return unsubmit(submissionId, gridType);
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
        const { submissions, gridType } = this.props;

        return submissions.grid.rows.length > 0 ? (
            <React.Fragment>
                <SubmissionsGrid
                    grid={submissions.grid}
                    gridType={gridType}
                    handleGridClick={this.handleGridClick}
                    handleFilterClick={this.handleFilterClick}
                    handleCheckDmp={this.handleCheckDmp}
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
});

export default withLocalize(
    connect(mapStateToProps, {
        resetErrorMessage,
        ...gridActions,
        ...submissionActions,
    })(SubmissionsPage)
);
