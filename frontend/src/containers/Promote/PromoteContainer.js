import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { HotTable } from '@handsontable/react'
import {
  GridButton,
  Input,
} from '../../components/index.js'
import 'handsontable/dist/handsontable.full.css'
import {
  FormControl
} from '@material-ui/core'

import { connect } from 'react-redux'
import { promoteActions } from '../../redux/actions'

class Promote extends Component {
  constructor(props) {
    super(props)

    this.state = {
      service_id: '',
      // investigator: '',
    }
    this.hotTableComponent = React.createRef()
  }
  componentDidMount() {
    // todo wait for token refresh!
    console.log(this.props)
    if (!this.props.promote.initialFetched) {
      this.props.getInitialState()
    }
  }

  handleChange = () => {
    this.setState({
      ...this.state,
      [event.target.id]: event.target.value,
    })
  }

  promoteSelected = () => {
    var selected = this.hotTableComponent.current.hotInstance.getSelected()
    if (selected) {
      var data = []

      for (var i = 0; i < selected.length; i += 1) {
        var item = selected[i]

        data.push(
          this.hotTableComponent.current.hotInstance.getData.apply(
            this.hotTableComponent.current.hotInstance,
            item
          )
        )
      }

      console.log(data)
    }
  }

  promoteAll = () => {
    // if (!this.state.limsProjectId || this.state.limsRequestId) {
    //   Swal.fire({
    //     title: 'Required Fields',
    //     html: 'Please add a project or request id',
    //     // footer: 'To avoid mistakes, invalid cells are cleared immediately.',
    //     type: 'error',
    //     animation: false,
    //     confirmButtonText: 'Dismiss',
    //     // customClass: { content: 'alert' },
    //   })
    // }
    this.props.promoteAll(this.state.limsProjectId, this.state.limsRequestId)
  }
  handleSubmit = () => {
    if (this.state.service_id) {
      this.props.loadBankedSamples(this.state.service_id)
    }
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        {this.props.promote.initialFetched ? (
          <div className={classes.container}>
            <div className={classes.buttons}>
              <FormControl component="fieldset">
                <Input
                  id="serviceId"
                  value={this.state.service_id}
                  // error={!formValid.service_id}
                  onChange={this.handleChange}
                  type="text"
                />{' '}
              </FormControl>
              <GridButton
                id="loadBanked"
                onClick={this.handleSubmit}
                isLoading={false}
                nothingToSubmit={false}
                color="primary"
              />

              <FormControl component="fieldset">
                <Input
                  id="limsProjectId"
                  value={this.state.limsProjectId}
                  // error={!formValid.service_id}
                  onChange={this.handleChange}
                  type="text"
                />{' '}
              </FormControl>
              <FormControl component="fieldset">
                <Input
                  id="limsRequestId"
                  value={this.state.limsRequestId}
                  // error={!formValid.service_id}
                  onChange={this.handleChange}
                  type="text"
                />{' '}
              </FormControl>
              <GridButton
                id="promoteAll"
                onClick={this.promoteAll}
                isLoading={this.props.promote.promoteIsLoading}
                nothingToSubmit={false}
                color="primary"
              />
              <GridButton
                id="promoteSelected"
                onClick={e => alert('Im not ready!')}
                isLoading={false}
                nothingToSubmit={false}
                color="secondary"
              />
            </div>
            <HotTable
              licenseKey="non-commercial-and-evaluation"
              id="hot"
              data={this.props.promote.rows}
              colHeaders={this.props.promote.columns}
              columns={this.props.promote.columnFeatures}
              rowHeaders={true}
              hiddenColumns={this.props.promote.hiddenColumns}
              headerTooltips={true}
              manualColumnResize={true}
              comments={true}
              ref={this.hotTableComponent}
              // width="95%"
              // stretchH="all"
              selectionMode="multiple"
              outsideClickDeselects={false}
              
            />

          </div>
        ) : <CircularProgress color="secondary" size={35} />}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  promote: state.promote,
})

const mapDispatchToProps = {
  ...promoteActions,
}

const styles = theme => ({
  container: {
    // borderRight: '1px solid gray',
    display: 'grid',
    justifyItems: 'center',
    marginLeft: theme.spacing(2),
    width: '95vw',
    // maxHeight: 600,
    overflow: 'hidden',
    // marginBottom: '5em',
  },
  buttons: { width: '90vw' },
  tooltipCell: {
    fontSize: '.8em',
    color: 'black !important',
    backgroundColor: '#cfd8dc !important',
  },
  submit: {
    width: '30px',
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Promote))
