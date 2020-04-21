import { HotTable } from '@handsontable/react'
import { withStyles } from '@material-ui/core'
import swal from '@sweetalert/with-react'
import 'handsontable/dist/handsontable.full.css'
import React from 'react'

class SubmissionsTable extends React.Component {
  constructor(props) {
    super(props)
    this.hotTableComponent = React.createRef()
  }

  getErrorMsg = () => {
    for (let i = 0; i < numberToAdd; i++) { }
  }
  showError = error => {
    console.log(error)
    swal(error)
  }

  render() {
    const { classes, handleClick, handleReceipt, handleDelete, grid } = this.props
    console.log(grid)
    return (
      <div>
        <div>
          <HotTable
            licenseKey="non-commercial-and-evaluation"
            id="hot"
            ref={this.hotTableComponent}
            data={grid.rows}
            colHeaders={grid.columnHeaders}
            rowHeaders={true}
            readOnly
            className="htCenter"
            columns={grid.columnFeatures}
            stretchH="all"
            filters="true"
            columnSorting="true"
            dropdownMenu={['filter_by_value', 'filter_action_bar']}
            // make actions clickable
            afterOnCellMouseDown={(event, coords, TD) => {
              if (coords.row != -1 && ([9,10,11].indexOf(coords.col) > -1)) {
               
                let actionElement = TD.firstElementChild || undefined
                let submitted = actionElement ? actionElement.getAttribute('submitted') == "true" : undefined
                let service_id = actionElement ? actionElement.getAttribute('service-id') : undefined
                let id = actionElement ? actionElement.getAttribute('submission-id') : undefined
             
                if (coords.col === 9 && !submitted) {
                  handleClick('edit', id, service_id)
                } else if (coords.col === 10 && submitted) {
                  handleClick('receipt', id, service_id)
                } else if (coords.col === 11 && !submitted) {
                  handleClick('delete', id, service_id)
                }
              }
            }}
          />
        </div>
      </div>
    )
  }
}

const styles = theme => ({})

export default withStyles(styles)(SubmissionsTable)
