import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import React from 'react';
import { ButtonGroup, Button, withStyles, Typography } from '@material-ui/core';

class SubmissionsGrid extends React.Component {
    constructor(props) {
        super(props);
        this.hotTableComponent = React.createRef();
    }

    render() {
        const { classes, handleGridClick, handleFilterClick, grid, gridType } = this.props;
        let headline = gridType.toUpperCase() === 'UPLOAD' ? 'IGO Submissions' : `${gridType.toUpperCase()} Submissions`;
        return (
            <div className={classes.container}>
                <Typography color='inherit' variant='h6'>
                    {headline}
                </Typography>
                <ButtonGroup color='primary' size='small' aria-label='small outlined primary button group'>
                    <Button onClick={() => handleFilterClick('months', 1)}>Last Month</Button>
                    <Button onClick={() => handleFilterClick('months', 3)}>Last 3 Months</Button>
                    <Button onClick={() => handleFilterClick('years', 1)}>Last Year</Button>
                    <Button onClick={() => handleFilterClick('years', 2)}>Last 2 Years</Button>
                    <Button onClick={() => handleFilterClick('', 0, true)}>All</Button>‰
                </ButtonGroup>

                <HotTable
                    licenseKey='non-commercial-and-evaluation'
                    id='hot'
                    ref={this.hotTableComponent}
                    data={grid.rows}
                    colHeaders={grid.columnHeaders}
                    rowHeaders={true}
                    readOnly
                    className='htCenter'
                    columns={grid.columnFeatures}
                    // stretchH="all"
                    width='95%'
                    filters='true'
                    columnSorting='true'
                    dropdownMenu={['filter_by_value', 'filter_action_bar']}
                    // make actions clickable
                    afterOnCellMouseDown={(event, coords, TD) => {
                        if (coords.row !== -1) {
                            let actionElement = TD.firstElementChild || undefined;
                            if (actionElement) {
                                let submitted = actionElement.getAttribute('submitted') === 'true' || undefined;
                                let service_id = actionElement.getAttribute('service-id') || undefined;
                                let id = actionElement.getAttribute('submission-id') || undefined;
                                handleGridClick(coords, submitted, id, service_id);
                            }
                        }
                    }}
                />
            </div>
        );
    }
}

const styles = (theme) => ({
    // container: { width: '80vw' }
});
export default withStyles(styles)(SubmissionsGrid);
