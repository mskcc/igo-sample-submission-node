import React from 'react'
import { withStyles } from '@material-ui/core'
import { HotTable } from '@handsontable/react'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import swal from '@sweetalert/with-react'

class SubmissionsTable extends React.Component {
  constructor(props) {
    super(props)
    this.hotTableComponent = React.createRef()
  }

  getErrorMsg = () => {
    for (let i = 0; i < numberToAdd; i++) {}
  }
  showError = error => {
    console.log(error)
    swal(error)
  }

  render() {
    const { classes, handleClick, handleReceipt, handleDelete } = this.props
    return (
      <div>
        <div>
          <HotTable
            licenseKey="non-commercial-and-evaluation"
            id="hot"
            ref={this.hotTableComponent}
            data={this.props.user.submissionsTable.data}
            colHeaders={this.props.user.submissionsTable.columnHeaders}
            rowHeaders={true}
            readOnly
            className="htCenter"
            columns={this.props.user.submissionsTable.columnFeatures}
            stretchH="all"
            filters="true"
            columnSorting="true"
            dropdownMenu={['filter_by_value', 'filter_action_bar']}
            afterOnCellMouseDown={(event, coords, TD) => {
              if (coords.row != -1) {
                let service_id = 'test'
                if (coords.col == '9') {
                  let submitted = TD.firstElementChild.getAttribute('submitted')

                  if (submitted == 'false') {
                    let service_id = TD.firstElementChild.getAttribute(
                      'service-id'
                    )
                    let id = TD.firstElementChild.getAttribute('submission-id')
                    handleClick('edit', id, service_id)
                  }
                } else if (coords.col == '10') {
                  let submitted = TD.firstElementChild.getAttribute('submitted')

                  if (submitted == 'true') {
                    let service_id = TD.firstElementChild.getAttribute(
                      'service-id'
                    )
                    let id = TD.firstElementChild.getAttribute('submission-id')

                    handleClick('receipt', id, service_id)
                  }
                } else if (coords.col == '11') {
                  let submitted = TD.firstElementChild.getAttribute('submitted')

                  if (submitted == 'false') {
                    let service_id = TD.firstElementChild.getAttribute(
                      'service-id'
                    )
                    let id = TD.firstElementChild.getAttribute('submission-id')
                    handleClick('delete', id, service_id)
                  }
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
