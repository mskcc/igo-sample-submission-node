/* eslint-disable no-unused-vars */
import React from 'react';
import { Translate } from 'react-localize-redux';

import { FormControl, InputAdornment, Paper, withStyles } from '@material-ui/core';
import { Button, Checkbox, Dropdown, Input } from '../index';
import { guessMatch } from '../../util/helpers';
import { readableRecipesLib } from '../../util/constants';
import { reverseReadableRecipesLib } from '../../util/constants';

class UploadForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {
                ...this.props.form.selected,
            },
            formValid: {
                material: true,
                application: true,
                capturePanel: true,
                serviceId: true,
                numberOfSamples: true,
                species: true,
                container: true,
                patientIdType: true,
                patientIdTypeSpecified: true,
                sharedWith: true,
                sequencingReadLength: true,
            },
           materials:[],
            isLoading:false,
        };
    }


    showGroupingCheckbox = () => {
        return this.state.values.species === 'Mouse' || this.state.values.species === 'Mouse_GeneticallyModified';
    };
    showPatientIdTypeDropdown = () => {
        return this.state.values.species === 'Human';
    };

    showCapturePanelDropdown = () => {
        return this.state.values.application === 'HC_Custom' &&
            this.state.values.material !== 'Pooled Library';
    };
    showPatientIdTypeSpecDropdown = () => {
        return (
            this.state.values.species === 'Human' &&
            (this.state.values.patientIdType === 'MSK-Patients (or derived from MSK Patients)' ||
                this.state.values.patientIdType === 'Both MSK-Patients and Non-MSK Patients')
        );
    };
  /*  showReadLengthDropdown = () => {
        // dont show anything until they select application
        if (this.state.values.application.length === 0) return false;

        const isAmpliconSeqApplication = reverseReadableRecipesLib[this.state.values.application] === 'DNA_Amplicon' || reverseReadableRecipesLib[this.state.values.application] === 'User_Amplicon' ;
        const isCDnaLibrary = this.state.values.material === 'DNA/cDNA Library' && reverseReadableRecipesLib[this.state.values.application] !== 'QC_Library';
        const isPooledLibrary = this.state.values.material === 'Pooled Library' && reverseReadableRecipesLib[this.state.values.application] !== 'ST_GeoMx';
        const isDNALibrary = this.state.values.material === 'DNA/cDNA Library' && reverseReadableRecipesLib[this.state.values.application] !== 'QC_Library';
        const readLengthNotNeededApplications = [
            'HC_IMPACT-Heme',
            'QC_DNA',
            'QC_Library',
            'QC_RNA',
            'HC_ACCESS',
            'DNA_SingleCellCNV',
            'User_SingleCellCNV',
            'FA_CLA',
            'FA_Fingerprint',
            'WGS_Shallow',
            'ddPCR',
            'WES_Human',
            'WES_Mouse',
            'QC_Discard',
            'HC_IMPACT',
            'HC_Custom',
            'HC_IMPACT-Mouse',
            'HemePACT_v4'
        ];
        return isAmpliconSeqApplication || isCDnaLibrary || isPooledLibrary || (isDNALibrary && !readLengthNotNeededApplications.includes(reverseReadableRecipesLib[this.state.values.application]));
    */ 


        showReadLengthDropdown = () => {
            // dont show anything until they select application
           return this.props.readLengths&& this.props.readLengths.length>0;
        };


        




    handleDropdownChange = (event) => {
        this.setState({
            values: {
                ...this.state.values,
                [event.id]: event.value,
            },
            formValid: { ...this.state.formValid, [event.id]: true },
        });
        this.props.handleInputChange(event.id, event.value);
    };

    handleChange = (event) => {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.id]: event.target.value,
            },
            formValid: { ...this.state.formValid, [event.target.id]: true },
        });
        this.props.handleInputChange(event.target.id, event.target.value);
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
            handleParentSubmit('upload', {
                ...this.state.values,

                serviceId: 'IGO-' + this.state.values.serviceId.toString(),
            });
        }
    };

    validate() {
        let formValid = this.state.formValid;
        let isValidOption;
        let values = this.props.form.selected;
        for (let value in values) {
            switch (value) {
                case 'serviceId':
                    // if (values.altServiceId) {
                    //     formValid[value] = true;
                    // } else {
                    formValid[value] = (/\d{6}/g.test(values[value]) || /\d{6}_\d{1}/g.test(values[value])) && (values[value].length === 6 || values[value].length === 8);
                    // }
                    break;
                case 'material':
                    // validate whether selected value in dynamic fields is in controlled options
                    // (could fail if user was extremely quick to select
                    // invalid material/app combination)
                    isValidOption = this.props.form.filteredMaterials.some(function(el) {
                        return el === values[value];
                    });

                    formValid[value] = isValidOption && values[value].length > 0;
                    break;

                case 'application':
                    isValidOption = this.props.form.filteredApplications.some(function(el) {
                        return el === reverseReadableRecipesLib[values[value]];
                    });

                    formValid[value] = isValidOption && values[value].length > 0;
                    break;

                case 'sequencingReadLength':
                    if (!this.showReadLengthDropdown()) {
                        formValid[value] = true;
                        values[value] = '';
                        break;
                    }
                    isValidOption = this.props.form.readLengths.some(function(el) {
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
                    let findValidOption = guessMatch(values[value], this.props.form.capturePanels);
                    if (findValidOption) isValidOption = true;
                    else isValidOption = false;
                    formValid[value] = isValidOption && values[value].length > 0;
                    if (formValid[value]) values[value] = findValidOption;
                    break;

                case 'container':
                    isValidOption = this.props.form.filteredContainers.some(function(el) {
                        return el === values[value];
                    });
                    formValid[value] = isValidOption && values[value].length > 0;
                    break;

                case 'species':
                    isValidOption = this.props.form.filteredSpecies.some(function(el) {
                        return el === values[value];
                    });
                    formValid[value] = isValidOption && values[value].length > 0;
                    break;

                case 'patientIdType':
                    // only validate if species mandates a format, else value will be disregarded anyway
                    if (this.showPatientIdTypeDropdown()) {
                        isValidOption = this.props.form.patientIdTypes.some(function(el) {
                            return el === values[value];
                        });
                        formValid[value] = isValidOption && values[value].length > 0;
                        break;
                    } else {
                        formValid[value] = true;
                        break;
                    }
                case 'patientIdTypeSpecified':
                    // only validate if species mandates a format, else value will be disregarded anyway
                    if (this.showPatientIdTypeSpecDropdown()) {
                        isValidOption = this.props.form.patientIdTypesSpecified.some(function(el) {
                            return el === values[value];
                        });
                        formValid[value] = isValidOption && values[value].length > 0;
                        break;
                    } else {
                        formValid[value] = true;
                        break;
                    }

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
            this.state.formValid.serviceId &&
            this.state.formValid.material &&
            this.state.formValid.application &&
            this.state.formValid.serviceId &&
            this.state.formValid.numberOfSamples &&
            this.state.formValid.species &&
            this.state.formValid.container &&
            this.state.formValid.patientIdType &&
            this.state.formValid.patientIdTypeSpecified &&
            this.state.formValid.capturePanel &&
            this.state.formValid.sharedWith &&
            this.state.formValid.sequencingReadLength
        );
    }



    componentDidUpdate(prevProps){
        if(prevProps.materials!==this.props.materials){
            console.log('Updated Materials',this.props.materials);
        }
    }

    render() {
        const {
            classes,
            form,
            handleSubmit,
            handleApplicationChange,
            handleMaterialChange,
            handleSpeciesChange,
            handleReadLengthChange,
            gridIsLoading,
            nothingToChange,
            gridNumberOfSamples,
            submitRowNumberUpdate,
            materials,
            applications,
            species,
            containers,
            isloading
        } = this.props;
        const { formValid, value} = this.state;

        console.log('Material in UploadForm',materials);

        return (
            <Translate>
                {({ translate }) => (
                    <Paper className={classes.container} elevation={1}>
                        <form id='upload-form' className={classes.form} onSubmit={(e) => this.handleSubmit(e, handleSubmit)}>
                            <Dropdown
                                id='material'
                                error={!formValid.material}
                                onSelect={handleMaterialChange}
                                onChange={this.handleDropdownChange}
                                autofocus={true}
                                items={materials.map((option) => ({
                                    value: option,
                                    label: option,
                                }))
                                .sort((a, b) => a.label.localeCompare(b.label)) 
                                }
                              loading={isloading}
                                //loading={form.formIsLoading}
                                dynamic
                                value={{
                                    value: form.selected.material,
                                    label: form.selected.material,
                                }}
                            />

                            <Dropdown
                                id='application'
                                error={!formValid.application}
                                onSelect={handleApplicationChange}
                                onChange={this.handleDropdownChange}
                                items={applications.map((option) => ({
                                    value: option,
                                    label: option,
                                }))
                                .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically by label
                                }
                                loading={form.formIsLoading}
                                dynamic
                                value={{
                                    value: form.selected.application,
                                    label: readableRecipesLib[form.selected.application],
                                }}
                            />
                            {this.showReadLengthDropdown() && (<Dropdown
                                id='sequencingReadLength'
                                error={!formValid.sequencingReadLength}
                                onSelect={handleReadLengthChange}
                                onChange={this.handleDropdownChange}
                                items={this.props.readLengths.map((option) => ({
                                    value: option,
                                    label: option,
                                }))
                                .sort((a, b) => a.label.localeCompare(b.label)) 
                                }
                                loading={form.formIsLoading}
                                dynamic
                                value={{
                                    value: form.selected.sequencingReadLength,
                                    label: form.selected.sequencingReadLength,
                                }}
                            />)}

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
                                // <Dropdown
                                //     id='capturePanel'
                                //     error={!formValid.capturePanel}
                                //     onChange={this.handleDropdownChange}
                                //     items={form.capturePanels.map((option) => ({
                                //         value: option,
                                //         label: option,
                                //     }))}
                                //     value={{
                                //         value: form.selected.capturePanel,
                                //         label: form.selected.capturePanel,
                                //     }}
                                // />
                            )}
                            <FormControl component='fieldset'>
                                <Dropdown
                                    id='species'
                                    error={!formValid.species}
                                    onSelect={handleSpeciesChange}
                                    onChange={this.handleDropdownChange}
                                    dynamic
                                    loading={form.formIsLoading}
                                    items={species.map((option) => ({
                                    value: option,
                                    label: option,
                                }))
                                .sort((a, b) => a.label.localeCompare(b.label)) 
                                }
                                    value={{
                                        value: form.selected.species,
                                        label: form.selected.species,
                                    }}
                                    ic
                                    disabled={!species}
                                />
                                {this.showGroupingCheckbox() && (
                                    <Checkbox
                                        id='groupingCheckbox'
                                        checked={form.selected.groupingChecked}
                                        onChange={(e) => this.handleCheckbox('groupingChecked')}
                                    />
                                )}
                            </FormControl>

                            {this.showPatientIdTypeDropdown() && (
                                <Dropdown
                                    id='patientIdType'
                                    error={!formValid.patientIdType}
                                    onChange={this.handleDropdownChange}
                                    items={form.patientIdTypes.map((option) => ({
                                        value: option,
                                        label: option,
                                    }))}
                                    value={{
                                        value: form.selected.patientIdType,
                                        label: form.selected.patientIdType,
                                    }}
                                />
                            )}
                            {this.showPatientIdTypeSpecDropdown() && (
                                <Dropdown
                                    id='patientIdTypeSpecified'
                                    error={!formValid.patientIdTypeSpecified}
                                    onChange={this.handleDropdownChange}
                                    items={form.patientIdTypesSpecified.map((option) => ({
                                        value: option,
                                        label: option,
                                    }))}
                                    value={{
                                        value: form.selected.patientIdTypeSpecified,
                                        label: form.selected.patientIdTypeSpecified,
                                    }}
                                />
                            )}

                            <Dropdown
                                id='container'
                                error={!formValid.container}
                                onChange={this.handleDropdownChange}
                                items={containers.map((option) => ({
                                    value: option,
                                    label: option,
                                }))
                                .sort((a, b) => a.label.localeCompare(b.label)) 
                                }
                                loading={form.formIsLoading}
                                value={{
                                    value: form.selected.container,
                                    label: form.selected.container,
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
                            <FormControl component='fieldset'>
                                <Input
                                    id='serviceId'
                                    value={form.selected.serviceId}
                                    error={!formValid.serviceId}
                                    type='text'
                                    onChange={this.handleChange}
                                    inputProps={{
                                        // disabled: form.selected.altServiceId,
                                        startAdornment: <InputAdornment position='start'>IGO-</InputAdornment>,
                                    }}
                                />
                                {/* {!form.selected.application.includes('COVID') && (
                                    <Checkbox id='altServiceId' checked={form.selected.altServiceId} onChange={this.handleServiceIdCheck} />
                                )} */}
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
                                formId='upload-form'
                                // isLoading={gridIsLoading}
                                nothingToSubmit={nothingToChange}
                            />
                            <Button
                                color='secondary'
                                id='formClear'
                                onClick={this.props.handleClear}
                                isLoading={false}
                                nothingToSubmit={false}
                            />
                        </div>
                    </Paper>
                )}
            </Translate>
        );
    }
}

UploadForm.defaultProps = {
    form: {
        initialFetched: false,
        allContainers: [{ id: 'test', value: 'test' }],
        allApplications: [{ id: 'test', value: 'test' }],
        allMaterials: [{ id: 'test', value: 'test' }],
        allPatientIdFormats: [{ id: 'test', value: 'test' }],
        filteredApplications: [{ id: 'test', value: 'test' }],
        filteredSpecies: [{ id: 'test', value: 'test' }],
        filteredMaterials: [{ id: 'test', value: 'test' }],
        formIsLoading: false,
        filteredContainers: [
            { id: 'Plates', value: 'Plates' },
            { id: 'Micronic Barcoded Tubes', value: 'Micronic Barcoded Tubes' },
        ],

        allSpecies: [{ id: 'test', value: 'test' }],
        readLengths: [{ id: 'test', value: 'test' }],
        selected: {
            application: '',
            material: '',
            serviceId: '',
            numberOfSamples: '',
            species: '',
            container: '',
            patientIdType: '',
            groupingChecked: false,
            sequencingReadLength: '',
            // altServiceId: false,
        },

        handleSubmit: () => {},
        handleApplicationChange: () => {},
        handleMaterialChange: () => {},
        handleSpeciesChange: () => {},
        gridIsLoading: () => {},
        nothingToChange: () => {},
    },
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

export default withStyles(styles)(UploadForm);