import React, { Component } from 'react'
import { withStyles, Divider, Paper, IconButton, InputBase } from '@material-ui/core'
import SearchIcon from "@material-ui/icons/Search";
import { HotTable } from '@handsontable/react'
import {
    GridButton,
    Input,
} from '../index.js'
import 'handsontable/dist/handsontable.full.css'
import {
    FormControl
} from '@material-ui/core'

class PromoteGrid extends Component {
    constructor(props) {
        super(props)

        this.state = {
            serviceId: '',
            investigator: '',
        }
        this.hotTableComponent = React.createRef()
    }
    componentDidMount() {
        if (!this.props.promote.initialFetched) {
            this.props.getInitialState()
        }
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.id]: event.target.value,
        })
    }

    handleLoad = (queryType) => {
        let query = this.state[queryType]
        this.props.handleLoad(queryType, query)
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
        promoteAll(this.state.limsProjectId, this.state.limsRequestId)
    }
    // handleSubmit = () => {
    //     if (this.state.serviceId) {
    //         this.props.loadBankedSamples(this.state.serviceId)
    //     }
    // }

    render() {
        const { classes, promote } = this.props
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
                                    if (event.key === "Enter") {
                                        this.handleLoad("serviceId");
                                    }
                                }}
                            />
                            <Divider className={classes.divider} orientation="vertical" />
                            <IconButton
                                className={classes.iconButton}
                                onClick={e => this.handleLoad("serviceId")}
                                aria-label="search"
                            // disabled={!values.serviceId.length > 0}
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
                                    if (event.key === "Enter") {
                                        this.handleLoad("investigator");
                                    }
                                }}
                            />
                            <Divider className={classes.divider} orientation="vertical" />
                            <IconButton
                                className={classes.iconButton}
                                onClick={e => this.handleLoad("investigator")}
                                aria-label="search"
                            // disabled={!values.serviceId.length > 0}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </div>

                    <div className={classes.submit}>
                        <div>
                            <FormControl component="fieldset">
                                <Input
                                    id="limsProjectId"
                                    value={this.state.limsProjectId}
                                    onChange={this.handleChange}
                                    type="text"
                                />
                            </FormControl>
                            <FormControl component="fieldset">
                                <Input
                                    id="limsRequestId"
                                    value={this.state.limsRequestId}
                                    onChange={this.handleChange}
                                    type="text"
                                />
                            </FormControl>
                        </div>
                        <div>
                            <GridButton
                                id="promoteSelected"
                                onClick={e => alert('Im not ready!')}
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
                    <HotTable
                        licenseKey="non-commercial-and-evaluation"
                        id="hot"
                        data={promote.rows}
                        colHeaders={promote.columns}
                        columns={promote.columnFeatures}
                        rowHeaders={true}
                        hiddenColumns={promote.hiddenColumns}
                        headerTooltips={true}
                        manualColumnResize={true}
                        comments={true}
                        ref={this.hotTableComponent}
                        // width="95%"
                        // stretchH="all"
                        selectionMode="multiple"
                        outsideClickDeselects={false}
                        height={() => {
                            if (promote.rows.length >= 25) return '700'
                            else if (promote.rows.length >= 20) return '510'
                            else if (promote.rows.length >= 15) return '650'
                            else if (promote.rows.length >= 10) return '550'
                            else if (promote.rows.length >= 5) return '450'
                            else if (promote.rows.length < 5) return '350'
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
        gridTemplateAreas: "'actions' 'grid'",
        marginLeft: theme.spacing(2),
        width: '95vw',
        overflow: 'hidden',
    },
    actions: {
        display: 'grid',
        gridTemplateAreas: "'load submit'",
    },
    load: {
        gridArea: 'load',
        alignSelf: 'center',
        justifySelf: 'center',
    },
    loadPaper: {
        display: 'flex',
        margin: '1em',
        height: 'min-content',
        width: 'max-content',
        border: '2px solid lightgray',
    },
    divider: {
        height: 50,
    },
    iconButton: {
        padding: 10,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    submit: {
        borderLeft: '1px solid lightgray',
        display: 'grid',
        gridTemplateAreas: "'inputs buttons'",
        width: 'min-content',
        alignItems: 'center',
        gridColumnGap: '2em',
    },
    btn: {
        width: 350,
    },

    tooltipCell: {
        fontSize: '.8em',
        color: 'black !important',
        backgroundColor: '#cfd8dc !important',
    },

})

export default withStyles(styles)(PromoteGrid)
