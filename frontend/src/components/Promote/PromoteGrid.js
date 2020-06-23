import React, { Component } from 'react';
import {
  withStyles,
  Divider,
  Paper,
  IconButton,
  InputBase,
  InputAdornment
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { HotTable } from '@handsontable/react';
import { GridButton, Input } from '../index.js';
import 'handsontable/dist/handsontable.full.css';
import { FormControl } from '@material-ui/core';

class PromoteGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceId: '',
      investigator: '',
      requestId: '',
      projectId: ''
    };
    this.hotTableComponent = React.createRef();
  }

  handleChange = event => {
    this.setState({
      ...this.state,
      [event.target.id]: event.target.value
    });
  };

  handleLoad = queryType => {
    let query = this.state[queryType];
    this.props.handleLoad(queryType, query);
  };

  promoteSelected = () => {
    var selected = this.hotTableComponent.current.hotInstance.getSelected();
    if (selected) {
      var selectedRows = [];
      this.props.promote.rows.map(row => {
        if (row.select) {
          selectedRows.push(row);
        }
      });

      this.props.promoteSamples(
        this.state.projectId,
        this.state.requestId,
        selectedRows
      );
    }
  };

  promoteAll = () => {
    this.props.promoteSamples(
      this.state.projectId,
      this.state.requestId,
      this.props.promote.rows
    );
  };

  render() {
    const { classes, promote } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.actions}>
          <div className={classes.load}>
            <Paper component="form" className={classes.loadPaper}>
              <InputBase
                className={classes.input}
                id="serviceId"
                value={this.state.serviceId}
                placeholder="Service ID"
                onChange={this.handleChange}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    this.handleLoad('serviceId');
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">IGO-</InputAdornment>
                }
              />
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton
                className={classes.iconButton}
                onClick={e => this.handleLoad('serviceId')}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            <Paper component="form" className={classes.loadPaper}>
              <InputBase
                className={classes.input}
                id="investigator"
                value={this.state.investigator}
                placeholder="Investigator"
                onChange={this.handleChange}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    this.handleLoad('investigator');
                  }
                }}
              />
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton
                className={classes.iconButton}
                onClick={e => this.handleLoad('investigator')}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>

          <div className={classes.submit}>
            <div>
              <FormControl component="fieldset">
                <Input
                  id="projectId"
                  value={this.state.projectId}
                  onChange={this.handleChange}
                  type="text"
                />
              </FormControl>
              <FormControl component="fieldset">
                <Input
                  id="requestId"
                  value={this.state.requestId}
                  onChange={this.handleChange}
                  type="text"
                />
              </FormControl>
            </div>
            <div>
              <GridButton
                id="promoteSelected"
                onClick={this.promoteSelected}
                isLoading={false}
                nothingToSubmit={false}
                color="secondary"
              />
              <GridButton
                id="promoteAll"
                onClick={this.promoteAll}
                isLoading={promote.promoteIsLoading}
                nothingToSubmit={false}
                color="primary"
              />
            </div>
          </div>
        </div>
        <div className={classes.grid}>
          {promote.rows && (
            <HotTable
              licenseKey="non-commercial-and-evaluation"
              id="hot"
              filters="true"
              columnSorting="true"
              dropdownMenu={['filter_by_value', 'filter_action_bar']}
              data={promote.rows}
              colHeaders={promote.columns}
              columns={promote.columnFeatures}
              rowHeaders={true}
              hiddenColumns={promote.hiddenColumns}
              headerTooltips={true}
              manualColumnResize={true}
              comments={true}
              ref={this.hotTableComponent}
              // width='95%'
              // stretchH='all'
              selectionMode="multiple"
              outsideClickDeselects={false}
              height={() => {
                if (promote.rows.length >= 25) return '700';
                else if (promote.rows.length >= 20) return '510';
                else if (promote.rows.length >= 15) return '650';
                else if (promote.rows.length >= 10) return '550';
                else if (promote.rows.length >= 5) return '450';
                else if (promote.rows.length < 5) return '350';
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'grid',
    gridTemplateAreas: '"actions" "grid"',
    marginLeft: theme.spacing(2),
    width: '95vw',
    overflow: 'hidden'
  },
  actions: {
    display: 'grid',
    gridTemplateAreas: '"load submit"'
  },
  load: {
    gridArea: 'load',
    alignSelf: 'center',
    justifySelf: 'center'
  },
  loadPaper: {
    display: 'flex',
    margin: '1em',
    height: 'min-content',
    width: 'max-content',
    border: '2px solid lightgray'
  },
  divider: {
    height: 50
  },
  iconButton: {
    padding: 10
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  submit: {
    borderLeft: '1px solid lightgray',
    display: 'grid',
    gridTemplateAreas: '"inputs buttons"',
    width: 'min-content',
    alignItems: 'center',
    gridColumnGap: '2em'
  },
  btn: {
    width: 350
  },

  tooltipCell: {
    fontSize: '.8em',
    color: 'black !important',
    backgroundColor: '#cfd8dc !important'
  }
});

export default withStyles(styles)(PromoteGrid);
