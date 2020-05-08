import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { PromoteGrid, } from '../../components'
import 'handsontable/dist/handsontable.full.css'

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
  handleLoad = (queryType, query) => {
    console.log(queryType)
    console.log(query)
      this.props.loadBankedSamples(queryType, query)
    
  }

  render() {
    return (
      <React.Fragment>
        {this.props.promote.initialFetched ? (
          <PromoteGrid promote={this.props.promote} handleLoad={this.handleLoad} />
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


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Promote)
