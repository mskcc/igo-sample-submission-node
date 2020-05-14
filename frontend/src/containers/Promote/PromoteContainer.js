import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PromoteGrid } from '../../components';
import 'handsontable/dist/handsontable.full.css';
import { swal } from '../../util';
import { connect } from 'react-redux';
import { promoteActions } from '../../redux/actions';
import { isEqual } from '../../util/helpers';

class Promote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service_id: '',
      // investigator: '',
    };
    this.hotTableComponent = React.createRef();
  }
  componentDidMount() {
    // todo wait for token refresh!
    console.log(this.props);
    if (!this.props.promote.initialFetched) {
      this.props.getInitialState();
    }
  }

  // promoteSelected = (selectedRows) => {
  //   console.log(selectedRows)
  //   // this.props.promoteSelected(selectedRows)

  // }
  promoteSamples = (projectId, requestId, rows) => {
    // let rows = getState().promote.rows
    let rowsBackup = this.props.promote.rowsBackup;
    if (!isEqual(rows, rowsBackup)) {
      console.log('needs update first');
    } else {
      console.log('good to go');
    }
    // this.props.promote(projectId, requestId, rows)
  };

  // promoteAll = (projectId, requestId, rows) => {
  //   this.props.promote(projectId, requestId, rows)
  // }
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

const mapStateToProps = (state) => ({
  promote: state.promote,
});

const mapDispatchToProps = {
  ...promoteActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Promote);
