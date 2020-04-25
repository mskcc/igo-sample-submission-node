import { HotTable } from '@handsontable/react'

import 'handsontable/dist/handsontable.full.css'
import React from 'react'
import { withStyles } from '@material-ui/core'

class SubmissionsGrid extends React.Component {
  constructor(props) {
    super(props)
    this.hotTableComponent = React.createRef()
  }

  render() {
    const { classes, handleClick, grid } = this.props
    return (
      <div className={classes.container} >
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
          // stretchH="all"
          width="95%"
          filters="true"
          columnSorting="true"
          dropdownMenu={['filter_by_value', 'filter_action_bar']}
          // make actions clickable
          afterOnCellMouseDown={(event, coords, TD) => {
            console.log(coords)
            if (coords.row != -1 && ([10, 11, 12, 13].indexOf(coords.col) > -1)) {
              console.log(coords)
              let actionElement = TD.firstElementChild || undefined
              let submitted = actionElement ? actionElement.getAttribute('submitted') == "true" : undefined
              let service_id = actionElement ? actionElement.getAttribute('service-id') : undefined
              let id = actionElement ? actionElement.getAttribute('submission-id') : undefined
              handleClick(coords, submitted, id, service_id)

            }
          }}
        />
      </div>
    )
  }
}



const styles = theme => ({
  // container: { width: '80vw' }

})
export default withStyles(styles)(SubmissionsGrid)
