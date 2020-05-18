import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PromoteGrid } from '../../components';
import 'handsontable/dist/handsontable.full.css';
import { swal, util } from '../../util';
import { connect } from 'react-redux';
import { promoteActions } from '../../redux/actions';
import { isEqual } from '../../util/helpers';

class Promote extends Component {
  componentDidMount() {
    if (!this.props.promote.initialFetched) {
      this.props.getPromoteGrid();
    }
  }
  promoteSamples = (projectId, requestId, rows, indeces = undefined) => {
    let rowsBackup = this.props.promote.rowsBackup;
    let needsUpdate = false;
    if (indeces) {
      let i = 0;
      indeces.map(index => {
        if (!isEqual(rowsBackup[index], rows[i])) {
          return (needsUpdate = true);
        }
        i++;
      });
    } else {
      needsUpdate = !isEqual(rows, rowsBackup);
    }

    this.props.promoteAction(projectId, requestId, rows, needsUpdate);

    // this.props.promote(projectId, requestId, rows)
  };
  handleLoad = (queryType, query) => {
    if (!query) {
      return swal.alertEmptyLoad(queryType);
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
