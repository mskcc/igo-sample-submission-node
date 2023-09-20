import React from 'react';
import { Translate } from 'react-localize-redux';
 
import { FormControl, InputAdornment, Paper, withStyles, Typography } from '@material-ui/core';
import { guessMatch } from '../../util/helpers';

import { Button, Checkbox, Dropdown, Input } from '../index';

class DmpForm extends React.Component {
    constructor(props) {
        super(props);
        const { form } = this.props;
        this.state = {
            values: {
                ...form.selected,
            },
            formValid: {
                material: true,
                application: true,
                capturePanel: true,
                numberOfSamples: true,
                sharedWith: true,
                serviceId: true,
            },
        };
    }

    showCapturePanelDropdown = () => {
        return this.state.values.application === 'CustomCapture';
    };

    handleDropdownChange = (event) => {
        const { handleInputChange } = this.props;
        this.setState({
            values: {
                ...this.state.values,
                [event.id]: event.value,
            },
            formValid: { ...this.state.formValid, [event.id]: true },
        });
        handleInputChange(event.id, event.value);
    };

    handleChange = (event) => {
        const { handleInputChange } = this.props;

        this.setState({
            values: {
                ...this.state.values,
                [event.target.id]: event.target.value,
            },
            formValid: { ...this.state.formValid, [event.target.id]: true },
        });
        handleInputChange(event.target.id, event.target.value);
    };

    handleCheckbox = (name) => (event) => {
        const { handleInputChange } = this.props;
        console.log(event.target.checked);
        this.setState({
            values: { ...this.state.values, [name]: event.target.checked },
        });
        if (event.target.checked) {
            handleInputChange(name, event.target.checked);
        } else {
            handleInputChange(name, event.target.checked);
            handleInputChange('sharedWith', '');
        }
    };

    handleCheckbox = (name) => (event) => {
        this.setState({
            values: { ...this.state.values, [name]: event.target.checked },
        });
        if (event.target.checked) {
            this.props.handleInputChange(name, event.target.checked);
        } else {
            this.props.handleInputChange(name, event.target.checked);
            this.props.handleInputChange('sharedWith', '');
        }
    };

    handleSubmit = (e, handleParentSubmit) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.validate()) {
            handleParentSubmit('dmp', {
                ...this.state.values,

                serviceId: 'IGO-' + this.state.values.serviceId.toString(),
            });
        }
    };

    validate() {
        const { form } = this.props;
        let formValid = this.state.formValid;
        let isValidOption;
        let values = form.selected;
        for (let value in values) {
            switch (value) {
                case 'serviceId':
                    formValid[value] = (/\d{6}/g.test(values[value]) && values[value].length === 6) || (/\d{6}_\d{1}/g.test(values[value]) && values[value].length === 8);
                    break;
                case 'material':
                    isValidOption = form.materials.some(function(el) {
                        return el === values[value];
                    });
                    formValid[value] = isValidOption && values[value].length > 0;
                    break;
                case 'application':
                    isValidOption = form.applications.some(function(el) {
                        return el === values[value];
                    });
                    formValid[value] = isValidOption && values[value].length > 0;
                    break;
                // Investigators need to know the panel they're requesting. Case, underscores and spaces are normalized for matching.
                // The picklist is not public to avoid lab's requesting each other's custom panels without consent.
                case 'capturePanel':
                    if (!this.showCapturePanelDropdown()) {
                        formValid[value] = true;
                        values[value] = '';
                        break;
                    }
                    let findValidOption = guessMatch(values[value], form.capturePanels);
                    if (findValidOption) isValidOption = true;
                    else isValidOption = false;
                    formValid[value] = isValidOption && values[value].length > 0;
                    if (formValid[value]) values[value] = findValidOption;
                    break;
                case 'sharedWith':
                    if (values.isShared) {
                        if (values.sharedWith === '') {
                            formValid[value] = false;
                            break;
                        }
                        var emails = values[value].split(',');
                        var valid = true;
                        // email regex
                        // var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        for (var i = 0; i < emails.length; i++) {
                            if (emails[i] === '' || !emails[i].includes('@mskcc.org')) {
                                valid = false;
                            }
                        }
                        formValid[value] = valid;
                        break;
                    } else {
                        formValid[value] = true;
                        break;
                    }

                case 'numberOfSamples':
                    formValid[value] = values[value] > 0 && values[value] < 97;
                    break;
                default:
                    break;
            }
        }
        this.setState({
            formValid: {
                ...formValid,
            },
        });
        // checked all fields, now check form
        return this.validateForm();
    }

    validateForm() {
        return (
            this.state.formValid.serviceId &&
            this.state.formValid.material &&
            this.state.formValid.application &&
            this.state.formValid.capturePanel &&
            this.state.formValid.numberOfSamples &&
            this.state.formValid.sharedWith
        );
    }

    render() {
        const { classes, form, handleSubmit, gridIsLoading, nothingToChange, gridNumberOfSamples, submitRowNumberUpdate } = this.props;
        const { formValid, values } = this.state;
        return (
            <Translate>
                {({ translate }) => (
                    <Paper className={classes.container} elevation={1}>
                        <Typography className={classes.message} align='justify'>
                            Before beginning this request, please review the workflow for requesting leftover genomic material from the Diagnostic Molecular Pathology Lab, and the accompanying documentation required to support the request{' '}
                            <a href='https://cmo.mskcc.org/wp-content/uploads/2022/11/DMPSS_-Investigator-DMP-Request_V2-Process.docx' download='https://cmo.mskcc.org/wp-content/uploads/2022/11/DMPSS_-Investigator-DMP-Request_V2-Process.docx'>
                                here
                            </a>. 
                            <br></br>
                            <br></br>
                            Once you complete this request, you will need to complete and submit the required{' '}
                            <a href='https://redcap.mskcc.org/surveys/?s=3MDAEWTYXK' target='_blank'>
                                MSKCC Tumor Genomic Profiling Project Proposal Form
                            </a>
                            {' '} using the iLabs Service ID from this request.
                            <br></br>
                            <br></br>
                            Please see the following{' '}
                            <a href='https://cmo.mskcc.org/index.php/requesting-leftover-genetic-material/#Frequently_Asked_Questions' target='_blank'>
                                FAQ
                            </a>
                            {' '}for support on the{' '}
                            <a href='https://cmo.mskcc.org/index.php/requesting-leftover-genetic-material/#Leftover_Genomic_Materialnbspfromnbspthe_DMP' target='_blank'>
                                CMO website
                            </a>.
                            {' '}Please reach out to{' '}
                            <a href='mailto:skicmopm@mskcc.org' target='_blank'>
                                skicmopm@mskcc.org
                            </a>.
                            {' '}with any questions or concerns.
                            <br></br>
                            <br></br>
                            For requests exceeding 96 samples, please enter 96 samples at a time and differentiate each cohort by labeling the iLabs service ID sequentially with "_1," "_2," and so on.
                        </Typography>
                        <form id='dmp-upload-form' className={classes.form} onSubmit={(e) => this.handleSubmit(e, handleSubmit)}>
                            <Dropdown
                                id='material'
                                error={!formValid.material}
                                onChange={this.handleDropdownChange}
                                onSelect={this.handleDropdownChange}
                                autofocus={true}
                                items={form.materials.map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                                loading={form.formIsLoading}
                                value={{
                                    value: form.selected.material,
                                    label: form.selected.material,
                                }}
                            />

                            <Dropdown
                                id='application'
                                error={!formValid.application}
                                onChange={this.handleDropdownChange}
                                onSelect={this.handleDropdownChange}
                                items={form.applications.map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                                loading={form.formIsLoading}
                                value={{
                                    value: form.selected.application,
                                    label: form.selected.application,
                                }}
                            />

                            {this.showCapturePanelDropdown() && (
                                <Input
                                    id='capturePanel'
                                    type='text'
                                    error={!formValid.capturePanel}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        inputProps: { min: 0 },
                                    }}
                                    value={form.selected.capturePanel}
                                />
                            )}

                            <Input
                                id='numberOfSamples'
                                error={!formValid.numberOfSamples}
                                onChange={this.handleChange}
                                inputProps={{
                                    inputProps: { min: 0 },
                                }}
                                value={form.selected.numberOfSamples}
                                page='dmp'
                            />

                            <FormControl component='fieldset'>
                                <Input
                                    id='serviceId'
                                    value={form.selected.serviceId}
                                    error={!formValid.serviceId}
                                    type='text'
                                    onChange={this.handleChange}
                                    inputProps={{
                                        startAdornment: <InputAdornment position='start'>IGO-</InputAdornment>,
                                    }}
                                />
                            </FormControl>

                            <FormControl component='fieldset' className={classes.lastItem}>
                                <Checkbox
                                    id='isShared'
                                    checked={form.selected.isShared || false}
                                    onChange={(e) => this.handleCheckbox('isShared')}
                                />
                                {form.selected.isShared && (
                                    <Input
                                        id='sharedWith'
                                        value={form.selected.sharedWith}
                                        error={!formValid.sharedWith}
                                        type='text'
                                        onChange={this.handleChange}
                                    />
                                )}
                            </FormControl>
                        </form>
                        <div>
                            {form.selected.numberOfSamples !== gridNumberOfSamples && gridNumberOfSamples > 0 && (
                                <Button
                                    color='secondary'
                                    id='updateNumberOfRows'
                                    onClick={submitRowNumberUpdate}
                                    isLoading={false}
                                    nothingToSubmit={false}
                                />
                            )}

                            <Button
                                color='primary'
                                id='formSubmit'
                                formId='dmp-upload-form'
                                isLoading={gridIsLoading}
                                nothingToSubmit={nothingToChange}
                            />
                        </div>
                    </Paper>
                )}
            </Translate>
        );
    }
}

const styles = (theme) => ({
    container: {
        // backgroundColor: "rgba(143, 199, 232, .1)",
        gridArea: 'form',
        display: 'grid',
        justifyItems: 'center',
        width: '80%',
        maxWidth: '1700px',
        margin: 'auto',
        padding: '1em',
        marginBottom: '4em',
    },
    message:{
        width: '60%',
        marginBottom: '2em',

    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    lastItem: {
        // flexBasis: '100%',
        marginTop: '2em',
        width: 310,
    },

    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },

    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    nothingToChange: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -53,
        marginLeft: -65,
    },
});

export default withStyles(styles)(DmpForm);
