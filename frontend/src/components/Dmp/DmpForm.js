import React from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import { FormControl, Paper, withStyles, Typography } from '@material-ui/core';

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
                numberOfSamples: true,
                sharedWith: true,
            },
        };
    }

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
            handleParentSubmit('dmp', this.state.values);
        }
    };

    validate() {
        const { form } = this.props;
        let formValid = this.state.formValid;
        let isValidOption;
        let values = form.selected;
        for (let value in values) {
            switch (value) {
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
                case 'sharedWith':
                    if (values.isShared) {
                        if (values.sharedWith === '') {
                            formValid[value] = false;
                            break;
                        }
                        var emails = values[value].split(',');
                        var valid = true;
                        var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        for (var i = 0; i < emails.length; i++) {
                            if (emails[i] === '' || (!regex.test(emails[i].replace(/\s/g, '')) && !emails[i].includes('mskcc'))) {
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
                    formValid[value] = values[value] > 0;
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
            this.state.formValid.material &&
            this.state.formValid.application &&
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
                            Please complete and submit the required{' '}
                            <a href='https://docs.google.com/forms/d/e/1FAIpQLSf2YyzR_MdGHuaT27TOJCxuy2wyL4MyrC2G2_TLlbymau6Qxg/viewform?usp=sf_link'>
                                MSKCC DMP Specimen Transfer Request Form
                            </a>
                            . You will need the 10 digit transaction ID generated from this DMP Sample Submission to complete the form.<br/>
                            If you do not have access to DMP Patient IDs, you can enter MRNs instead.
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

                            <Input
                                id='numberOfSamples'
                                error={!formValid.numberOfSamples}
                                onChange={this.handleChange}
                                inputProps={{
                                    inputProps: { min: 0 },
                                }}
                                value={form.selected.numberOfSamples}
                            />

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

DmpForm.propTypes = {
    classes: PropTypes.shape({
        container: PropTypes.any,
        form: PropTypes.any,
        lastItem: PropTypes.any,
    }),
    form: PropTypes.shape({
        applications: PropTypes.array,
        formIsLoading: PropTypes.any,
        materials: PropTypes.array,
        selected: PropTypes.shape({
            application: PropTypes.any,
            isShared: PropTypes.bool,
            material: PropTypes.any,
            numberOfSamples: PropTypes.any,
            sharedWith: PropTypes.string,
        }),
    }),
    gridIsLoading: PropTypes.any,
    gridNumberOfSamples: PropTypes.any,
    handleInputChange: PropTypes.func,
    handleSubmit: PropTypes.any,
    nothingToChange: PropTypes.any,
    submitRowNumberUpdate: PropTypes.any,
};

const styles = (theme) => ({
    container: {
        // backgroundColor: "rgba(143, 199, 232, .1)",
        gridArea: 'form',
        display: 'grid',
        justifyItems: 'center',
        width: '80%',
        maxWidth: '1700px',
        margin: '2em auto',
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
