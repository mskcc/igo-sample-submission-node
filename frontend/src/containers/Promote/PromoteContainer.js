import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { promoteActions } from '../../redux/actions';

import CircularProgress from '@material-ui/core/CircularProgress';
import 'handsontable/dist/handsontable.full.css';

import { swal } from '../../util';

import { PromoteGrid } from '../../components';

class Promote extends Component {
    componentDidMount() {
        const { promote, getPromoteGrid } = this.props;
        if (!promote.initialFetched) return getPromoteGrid();
        return;
    }

    promoteSamples = (projectId, requestId, rows) => {
        const { promoteDry } = this.props;
        const bankedSampleIds = [];
        const { serviceId } = rows[0];
        let materials = new Set();
        rows.map((element) => {
            bankedSampleIds.push(element.recordId);
            materials.add(element.sampleType);
        });

        materials = [...materials].join('_');

        // if (rows[0].index != '') {
        //     materials += '_DNA Library';
        // }
        return promoteDry(projectId, requestId, serviceId, materials, bankedSampleIds);
    };

    handleLoad = (queryType, query) => {
        const { loadBankedSamples } = this.props;
        let queryString = query;

        if (!queryString) {
            return swal.alertEmptyLoad(queryType);
        }
        if (queryType === 'serviceId') {
            queryString = query.toLowerCase().includes('igo-') ? query : `IGO-${query}`;
        }
        return loadBankedSamples(queryType, queryString);
    };

    render() {
        const { promote } = this.props;

        return (
            <React.Fragment>
                {promote.initialFetched ? (
                    <PromoteGrid promote={promote} handleLoad={this.handleLoad} promoteSamples={this.promoteSamples} />
                ) : (
                    <CircularProgress color='secondary' size={35} />
                )}
            </React.Fragment>
        );
    }
}

Promote.propTypes = {
    getPromoteGrid: PropTypes.func,
    loadBankedSamples: PropTypes.func,
    promote: PropTypes.shape({
        initialFetched: PropTypes.any,
    }),
    promoteDry: PropTypes.func,
};

const mapStateToProps = (state) => ({
    promote: state.promote,
});

const mapDispatchToProps = {
    ...promoteActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Promote);
