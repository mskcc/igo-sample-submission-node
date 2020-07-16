import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { gridActions, submissionActions } from '../../redux/actions';
import { resetErrorMessage } from '../../redux/actions/commonActions';

import { swal } from '../../util';

import SubmissionsGrid from '../../components/Submissions/SubmissionsGrid';

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

    handleGridClick = (coords, submitted, id, serviceId) => {
        const { submissions } = this.props;
        const column = submissions.grid.columnFeatures[coords.col].data;
        if (column === 'edit' && !submitted) {
            this.handleEdit(id);
        } else if (column === 'review' && submitted) {
            this.handleEdit(id);
        } else if (column === 'unsubmit' && submitted) {
            this.handleUnsubmit(id);
        } else if (column === 'receipt' && submitted) {
            this.handleReceipt(id, serviceId);
        } else if (column === 'delete' && !submitted) {
            this.handleDelete(id);
        }
    };

    handleEdit = (submissionId) => {
        const { populateGridFromSubmission } = this.props;
        return populateGridFromSubmission(submissionId, this.props);
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
            <SubmissionsGrid
                grid={submissions.grid}
                gridType={gridType}
                handleGridClick={this.handleGridClick}
                handleFilterClick={this.handleFilterClick}
            />
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
            columnFeatures: PropTypes.object,
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
