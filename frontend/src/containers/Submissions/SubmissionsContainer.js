import React, { Component } from 'react';

import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { swal } from '../../util';
import { gridActions, submissionActions } from '../../redux/actions';
import { resetErrorMessage } from '../../redux/actions/commonActions';

import SubmissionsGrid from '../../components/Submissions/SubmissionsGrid';

export class SubmissionsPage extends Component {
    componentDidMount() {
        this.props.getSubmissions(this.props.gridType);
        // TODO make submissionsSince default once subs are imported
    }

    handleFilterClick = (unit, time, all = false) => {
        if (all) {
            return this.props.getSubmissions(this.props.gridType);
        }
        this.props.getSubmissionsSince(unit, time, this.props.gridType);
    };

    handleGridClick = (coords, submitted, id, serviceId) => {
        let column = this.props.submissions.grid.columnFeatures[coords.col].data;
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
        return this.props.populateGridFromSubmission(submissionId, this.props);
    };

    handleUnsubmit = (submissionId) => {
        return this.props.unsubmit(submissionId, this.props.gridType);
    };

    handleReceipt = (submissionId, serviceId) => {
        return this.props.downloadReceipt(submissionId, serviceId, this.props.gridType);
    };
    handleDelete = (submissionId) => {
        swal.confirmDelete().then((decision) => {
            if (decision) {
                this.props.deleteSubmission(submissionId, this.props.gridType);
            }
        });
    };

    render() {
        return this.props.submissions.grid.rows.length > 0 ? (
            <SubmissionsGrid
                grid={this.props.submissions.grid}
                gridType={this.props.gridType}
                handleGridClick={this.handleGridClick}
                handleFilterClick={this.handleFilterClick}
            />
        ) : (
            'No submissions available.'
        );
    }
}

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
