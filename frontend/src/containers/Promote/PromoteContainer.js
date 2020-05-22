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
    let serviceId = rows[0].serviceId;
    rows.map(element => {
      bankedSampleIds.push(element.recordId);
    });
    console.log(bankedSampleIds);
    this.props.promoteDry(projectId, requestId, serviceId, bankedSampleIds);
  };
  handleLoad = (queryType, query) => {
    if (!query) {
      return swal.alertEmptyLoad(queryType);
    }
    this.props.loadBankedSamples(queryType, query);
  };

  showShiftMessage = () => {
    return this.props.showShiftMessage();
  };

  render() {
    return (
      <React.Fragment>
        {this.props.promote.initialFetched ? (
          <PromoteGrid
            promote={this.props.promote}
            handleLoad={this.handleLoad}
            promoteSamples={this.promoteSamples}
            showShiftMessage={this.showShiftMessage}
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
