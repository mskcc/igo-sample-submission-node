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
        const { classes, handleGridClick, handleFilterClick, handleCheckDmp, grid, gridType } = this.props;
        let headline = gridType.toUpperCase() === 'UPLOAD' ? 'IGO Submissions' : `${gridType.toUpperCase()} Submissions`;
        return (
            <div className={classes.container}>
                <div className={classes.header}>
                    <Typography color='inherit' variant='h6'>
                        {headline}
                    </Typography>
                    <Button variant='contained' color='primary' onClick={() => handleCheckDmp('', 0, true)}>
                        Update DMP Status
                    </Button>
                </div>

                {gridType === 'dmp' && (
                    <ul>
                        <Typography color='inherit' variant='subtitle1'>
                            Tracking IDs for Testing
                        </Typography>
                        You can use any DMP ID not just the ones listed. Whatever the DMP returns will be translated into an IGO submission.
                        <br />
                        In the next update, only the samples with matching Investigator Sample ID will be translated. <br />
                        Compare result to the DMP output from this link:
                        <a target='_blank' href='http://plvpathhydra1.mskcc.org:8001/getCMOSampleRequestDetails?trackingId=[TRACKINGID]'>
                            {' '}
                            http://plvpathhydra1.mskcc.org:8001/getCMOSampleRequestDetails?trackingId=[TRACKINGID]
                        </a>
                        <li>'20200311JGA'</li>
                        <li>'20200515NS'</li>
                        <li>'20200507CI_gDNA'</li>
                        <li>'20191007BT_gDNA'</li>
                        <li>'20200518NS'</li>
                        <li>'20200311JGA_gDNA'</li>
                        <li>'20200601JS'</li>
                        <li>'20200529LM'</li>
                        <li>'20200528JC'</li>
                        <li>'20200619YJ'</li>
                        <li>'20200203DS_2'</li>
                        <li>'20200630AD'</li>
                        <li>'20200709MB'</li>
                        <li>'20200713AH'</li>
                        <li>'20200709NS'</li>
                        <li>'20200723KB'</li>
                        <li>'20191007BT_2'</li>
                        <li>'20200729YJ'</li>
                        <li>'20200709NS_gDNA'</li>
                        <li>'20200714JC'</li>
                    </ul>
                )}
                <ButtonGroup color='primary' size='small' aria-label='small outlined primary button group'>
                    <Button onClick={() => handleFilterClick('months', 1)}>Last Month</Button>
                    <Button onClick={() => handleFilterClick('months', 3)}>Last 3 Months</Button>
                    <Button onClick={() => handleFilterClick('years', 1)}>Last Year</Button>
                    <Button onClick={() => handleFilterClick('years', 2)}>Last 2 Years</Button>
                    <Button onClick={() => handleFilterClick('', 0, true)}>All</Button>
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
                    stretchH='all'
                    width='95%'
                    filters='true'
                    columnSorting='true'
                    fixedColumnsLeft='1'
                    dropdownMenu={['filter_by_value', 'filter_action_bar']}
                    // make actions clickable
                    afterOnCellMouseDown={(event, coords, TD) => {
                        if (coords.row !== -1 && coords.col !== -1) {
                            let actionElement = TD.firstElementChild || undefined;
                            if (actionElement) {
                                let submitted = actionElement.getAttribute('submitted') === 'true' || undefined;
                                let serviceId = actionElement.getAttribute('service-id') || undefined;
                                let mongoId = actionElement.getAttribute('submission-id') || undefined;
                                handleGridClick(coords, submitted, mongoId, serviceId);
                            }
                        }
                    }}
                    height={() => {
                        if (grid.rows.length >= 25) return '700';
                        // else if (grid.rows.length >= 900) return '100vh'
                        else if (grid.rows.length >= 20) return '510';
                        else if (grid.rows.length >= 15) return '650';
                        else if (grid.rows.length >= 10) return '550';
                        else if (grid.rows.length >= 5) return '450';
                        else if (grid.rows.length < 5) return '350';
                    }}
                />
            </div>
        );
    }
}

const styles = () => ({
    container: { width: '80vw', overflow: 'hidden' },
    header: { display: 'flex', width: '95%', justifyContent: 'space-between' },
});
export default withStyles(styles)(SubmissionsGrid);
