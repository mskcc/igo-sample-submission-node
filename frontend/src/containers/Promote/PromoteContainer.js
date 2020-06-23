import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PromoteGrid } from '../../components';
import 'handsontable/dist/handsontable.full.css';
import { swal } from '../../util';
import { connect } from 'react-redux';
import { promoteActions } from '../../redux/actions';

class Promote extends Component {
  componentDidMount() {
    if (!this.props.promote.initialFetched) {
      this.props.getPromoteGrid();
    }
  }
  promoteSamples = (projectId, requestId, rows) => {
    let bankedSampleIds = [];
    let materials = new Set();
    let serviceId = rows[0].serviceId;
    rows.map(element => {
      bankedSampleIds.push(element.recordId);
      materials.add(element.sampleType);
    });

    materials = [...materials].join('_');
    this.props.promoteDry(
      projectId,
      requestId,
      serviceId,
      materials,
      bankedSampleIds
    );
  };
  handleLoad = (queryType, query) => {
    if (!query) {
      return swal.alertEmptyLoad(queryType);
    }
    if (queryType === 'serviceId') {
      query = `IGO-${query}`;
    }
    this.props.loadBankedSamples(queryType, query);
  };

  render() {
    return (
      <React.Fragment>
        {this.props.promote.initialFetched ? (
          <PromoteGrid
            promote={this.props.promote}
            handleLoad={this.handleLoad}
            promoteSamples={this.promoteSamples}
          />
        ) : (
          <CircularProgress color="secondary" size={35} />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  promote: state.promote
});

const mapDispatchToProps = {
  ...promoteActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Promote);
