import React from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import {
  FormControl,
  InputAdornment,
  Paper,
  withStyles
} from '@material-ui/core';

import { Button, Checkbox, Dropdown, Input } from '../index';

import { swal } from '../../util';

class UploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {
        ...this.props.form.selected
      },
      formValid: {
        material: true,
        application: true,
        serviceId: true,
        numberOfSamples: true,
        species: true,
        container: true,
        patientIdType: true,
        patientIdTypeSpecified: true,
        sharedWith: true
      }
    };
  }

  showGroupingCheckbox = () => {
    return (
      this.state.values.species === 'Mouse' ||
      this.state.values.species === 'Mouse_GeneticallyModified'
    );
  };
  showPatientIdTypeDropdown = () => {
    return this.state.values.species === 'Human';
  };
  showPatientIdTypeSpecDropdown = () => {
    return (
      this.state.values.species === 'Human' &&
      (this.state.values.patientIdType ===
        'MSK-Patients (or derived from MSK Patients)' ||
        this.state.values.patientIdType ===
          'Both MSK-Patients and Non-MSK Patients')
    );
  };
  handleDropdownChange = event => {
    this.setState({
      values: {
        ...this.state.values,
        [event.id]: event.value
      },
      formValid: { ...this.state.formValid, [event.id]: true }
    });
    this.props.handleInputChange(event.id, event.value);
  };

  handleChange = event => {
    this.setState({
      values: {
        ...this.state.values,
        [event.target.id]: event.target.value
      },
      formValid: { ...this.state.formValid, [event.target.id]: true }
    });
    this.props.handleInputChange(event.target.id, event.target.value);
  };

  handleServiceIdCheck = name => event => {
    var date = new Date();
    var timestamp = date.getTime();

    this.setState({
      values: {
        ...this.state.values,
        serviceId: timestamp,
        [name]: event.target.checked
      },

      formValid: { ...this.state.formValid, serviceId: true }
    });
    if (event.target.checked) {
      this.props.handleInputChange('serviceId', timestamp);
      this.props.handleInputChange('altServiceId', true);
      swal.altServiceIdNotice();
    } else {
      this.props.handleInputChange('serviceId', '');
      this.props.handleInputChange('altServiceId', false);
    }
  };
  handleCheckbox = name => event => {
    this.setState({
      values: { ...this.state.values, [name]: event.target.checked }
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

        serviceId: 'IGO-' + this.state.values.serviceId.toString()
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
          if (values.altServiceId) {
            formValid[value] = true;
          } else {
            formValid[value] =
              /\d{6}/g.test(values[value]) && values[value].length === 6;
          }
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
          isValidOption = this.props.form.filteredApplications.some(function(
            el
          ) {
            return el === values[value];
          });

          formValid[value] = isValidOption && values[value].length > 0;
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
            isValidOption = this.props.form.patientIdTypesSpecified.some(
              function(el) {
                return el === values[value];
              }
            );
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
            var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            for (var i = 0; i < emails.length; i++) {
              if (
                emails[i] === '' ||
                (!regex.test(emails[i].replace(/\s/g, '')) &&
                  !emails[i].includes('mskcc'))
              ) {
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
        ...formValid
      }
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
      this.state.formValid.sharedWith
    );
  }

  render() {
    const {
      classes,
      form,
      handleSubmit,
      handleApplicationChange,
      handleMaterialChange,
      handleSpeciesChange,
      gridIsLoading,
      nothingToChange,
      gridNumberOfSamples,
      submitRowNumberUpdate
    } = this.props;
    const { formValid, values } = this.state;

    return (
      <Translate>
        {({ translate }) => (
          <Paper className={classes.container} elevation={1}>
            <form
              id="upload-form"
              className={classes.form}
              onSubmit={e => this.handleSubmit(e, handleSubmit)}
            >
              <Dropdown
                id="material"
                error={!formValid.material}
                onSelect={handleMaterialChange}
                onChange={this.handleDropdownChange}
                autofocus={true}
                items={form.filteredMaterials.map(option => ({
                  value: option,
                  label: option
                }))}
                loading={form.formIsLoading}
                dynamic
                value={{
                  value: form.selected.material,
                  label: form.selected.material
                }}
              />

              <Dropdown
                id="application"
                error={!formValid.application}
                onSelect={handleApplicationChange}
                onChange={this.handleDropdownChange}
                items={form.filteredApplications.map(option => ({
                  value: option,
                  label: option
                }))}
                loading={form.formIsLoading}
                dynamic
                value={{
                  value: form.selected.application,
                  label: form.selected.application
                }}
              />
              <FormControl component="fieldset">
                <Dropdown
                  id="species"
                  error={!formValid.species}
                  onSelect={handleSpeciesChange}
                  onChange={this.handleDropdownChange}
                  dynamic
                  loading={form.formIsLoading}
                  items={form.filteredSpecies.map(option => ({
                    value: option,
                    label: option
                  }))}
                  value={{
                    value: form.selected.species,
                    label: form.selected.species
                  }}
                  ic
                />
                {this.showGroupingCheckbox() && (
                  <Checkbox
                    id="groupingCheckbox"
                    checked={form.selected.groupingChecked}
                    onChange={e => this.handleCheckbox('groupingChecked')}
                  />
                )}
              </FormControl>

              {this.showPatientIdTypeDropdown() && (
                <Dropdown
                  id="patientIdType"
                  error={!formValid.patientIdType}
                  onChange={this.handleDropdownChange}
                  items={form.patientIdTypes.map(option => ({
                    value: option,
                    label: option
                  }))}
                  value={{
                    value: form.selected.patientIdType,
                    label: form.selected.patientIdType
                  }}
                />
              )}
              {this.showPatientIdTypeSpecDropdown() && (
                <Dropdown
                  id="patientIdTypeSpecified"
                  error={!formValid.patientIdTypeSpecified}
                  onChange={this.handleDropdownChange}
                  items={form.patientIdTypesSpecified.map(option => ({
                    value: option,
                    label: option
                  }))}
                  value={{
                    value: form.selected.patientIdTypeSpecified,
                    label: form.selected.patientIdTypeSpecified
                  }}
                />
              )}

              <Dropdown
                id="container"
                error={!formValid.container}
                onChange={this.handleDropdownChange}
                items={form.filteredContainers.map(option => ({
                  value: option,
                  label: option
                }))}
                loading={form.formIsLoading}
                value={{
                  value: form.selected.container,
                  label: form.selected.container
                }}
              />

              <Input
                id="numberOfSamples"
                error={!formValid.numberOfSamples}
                onChange={this.handleChange}
                inputProps={{
                  inputProps: { min: 0 }
                }}
                value={form.selected.numberOfSamples}
              />
              <FormControl component="fieldset">
                <Input
                  id="serviceId"
                  value={form.selected.serviceId}
                  error={!formValid.serviceId}
                  onChange={this.handleChange}
                  inputProps={{
                    disabled: form.selected.altServiceId,
                    startAdornment: (
                      <InputAdornment position="start">IGO-</InputAdornment>
                    )
                  }}
                />
                {!form.selected.application.includes('COVID') && (
                  <Checkbox
                    id="altServiceId"
                    checked={form.selected.altServiceId}
                    onChange={this.handleServiceIdCheck}
                  />
                )}
              </FormControl>

              <FormControl component="fieldset" className={classes.lastItem}>
                <Checkbox
                  id="isShared"
                  checked={form.selected.isShared || false}
                  onChange={e => this.handleCheckbox('isShared')}
                />
                {form.selected.isShared && (
                  <Input
                    id="sharedWith"
                    value={form.selected.sharedWith}
                    error={!formValid.sharedWith}
                    type="text"
                    onChange={this.handleChange}
                  />
                )}
              </FormControl>
            </form>
            <div>
              {form.selected.numberOfSamples !== gridNumberOfSamples &&
                gridNumberOfSamples > 0 && (
                  <Button
                    color="secondary"
                    id="updateNumberOfRows"
                    onClick={submitRowNumberUpdate}
                    isLoading={false}
                    nothingToSubmit={false}
                  />
                )}

              <Button
                color="primary"
                id="formSubmit"
                formId="upload-form"
                isLoading={gridIsLoading}
                nothingToSubmit={nothingToChange}
              />
              <Button
                color="secondary"
                id="formClear"
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
      { id: 'Micronic Barcoded Tubes', value: 'Micronic Barcoded Tubes' }
    ],

    allSpecies: [{ id: 'test', value: 'test' }],
    selected: {
      application: '',
      material: '',
      serviceId: '',
      numberOfSamples: '',
      species: '',
      container: '',
      patientIdType: '',
      groupingChecked: false,
      altServiceId: false
    },

    handleSubmit: () => {},
    handleApplicationChange: () => {},
    handleMaterialChange: () => {},
    handleSpeciesChange: () => {},
    gridIsLoading: () => {},
    nothingToChange: () => {}
  }
};

UploadForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  handleApplicationChange: PropTypes.func,
  handleMaterialChange: PropTypes.func
};

const styles = theme => ({
  container: {
    // backgroundColor: "rgba(143, 199, 232, .1)",
    gridArea: 'form',
    display: 'grid',
    justifyItems: 'center',
    width: '80%',
    maxWidth: '1700px',
    margin: '2em auto',
    padding: '1em',
    marginBottom: '4em'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  lastItem: {
    flexBasis: '100%',
    marginTop: '2em',
    width: 310
  },

  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },

  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  nothingToChange: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -53,
    marginLeft: -65
  }
});

export default withStyles(styles)(UploadForm);
