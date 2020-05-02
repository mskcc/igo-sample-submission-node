import React from 'react'
import { withStyles } from '@material-ui/core'
import { HotTable } from '@handsontable/react'
import 'handsontable/dist/handsontable.full.css'

import { GridButton } from '../index'

class UploadGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = { invalidCells: [] } 
    this.hotTableComponent = React.createRef()
  }

  getErrorMsg = () => {
    for (let i = 0; i < numberToAdd; i++) {}
  }
  showError = (error, row, prop) => {
    this.props.grid.rows[row].prop = ''
    if (error) {
      swal(error)
    }
  }

  

  render() {
    const {
      classes,
      grid,
      handleChange,
      pasteTooMany,
      user,
      handleAssay,
      handleTumorType,
      handlePatientId,
    } = this.props
    return (
      <div>
        <div className={classes.container}>
          <div className={classes.buttons}>
            <GridButton
              id="gridSubmit"
              onClick={this.props.handleSubmit}
              isLoading={false}
              nothingToSubmit={false}
              color="primary"
            />
            <GridButton
              id="gridSave"
              onClick={this.props.handleSave}
              isLoading={user.isSaving}
              done={user.saved}
              // msg={'Saved!'}
              color="primary"
            />{' '}
            <GridButton
              id="gridExport"
              onClick={this.props.handleDownload}
              isLoading={false}
              nothingToSubmit={false}
              color="primary"
            />
            <GridButton
              id="gridClear"
              onClick={this.props.handleClear}
              isLoading={false}
              nothingToSubmit={false}
              color="secondary"
            />
             
          </div>
          <HotTable
            licenseKey="non-commercial-and-evaluation"
            id="hot"
            data={grid.rows}
            colHeaders={grid.columnHeaders}
            columns={grid.columnFeatures}
            rowHeaders={true}
            hiddenColumns={{columns:grid.hiddenColumns}}
            headerTooltips={true}
            manualColumnResize={true}
            comments={true}
            ref={this.hotTableComponent}
            beforeChange={(changes, source) => {
              // only do something if rows can fit the changes/if
              // last changes[] element's row index is <= rows
              if (changes[changes.length - 1][0] + 1 > grid.rows.length) {
                let numOfPastedRows = changes[changes.length-1][0] + 1
                pasteTooMany(numOfPastedRows)
                return false
              }
              if (changes.length > 50) {
                this.props.preValidate()
              }
            }}
            afterChange={(changes, source) => {
              if (changes) {
                let i = 0
                if (source !== 'loadData') {
                  changes.forEach(([row, prop, oldValue, newValue]) => {
                    i++
                    let rowIndex = row
                    if (prop == 'patientId') {
                      handlePatientId(rowIndex)
                    }

                    if (prop == 'assay') {
                      if (newValue != oldValue && oldValue != undefined) {
                        let col = this.hotTableComponent.current.hotInstance.propToCol(
                          prop
                        )
                        handleAssay(rowIndex, col, oldValue, newValue)
                      }
                    }
                    if (prop == 'cancerType') {
                      if (newValue != oldValue && oldValue != undefined) {
                        let col = this.hotTableComponent.current.hotInstance.propToCol(
                          prop
                        )
                        handleTumorType(rowIndex, col, oldValue, newValue)
                      }
                    }
                  })
                  if (i == changes.length) {
                    handleChange(changes)
                  }
                }
              }
            }}
            width="95%"
            stretchH="all"
            // height="10%"
            height={() => {
              if (grid.rows.length >= 25) return '700'
              // else if (grid.rows.length >= 900) return '100vh'
              else if (grid.rows.length >= 20) return '510'
              else if (grid.rows.length >= 15) return '650'
              else if (grid.rows.length >= 10) return '550'
              else if (grid.rows.length >= 5) return '450'
              else if (grid.rows.length < 5) return '350'
            }}
          />
        </div>
      </div>
    )
  }
}

const styles = theme => ({
  container: {
    display: 'grid',
    justifyItems: 'center',
    marginLeft: theme.spacing(2),
    width: '95vw',
    overflow: 'hidden',
    marginBottom: '5em',
  },
  buttons: {},
  tooltipCell: {
    fontSize: '.8em',
    color: 'black !important',
    backgroundColor: '#cfd8dc !important',
  },
  submit: {
    width: '30px',
  },
})

export default withStyles(styles)(UploadGrid)
