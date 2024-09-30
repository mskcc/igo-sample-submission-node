 import React, { Component } from 'react';

import { connect } from 'react-redux';
import { formActions, dmpFormActions } from '../../redux/actions';

import { swal } from '../../util';
import axios from 'axios';
import { DmpForm, UploadForm } from '../../components';
export class UploadFormContainer extends Component {
    constructor(props){
        super(props);
        this.state={
            materials:[],
            isloading:false,
        };
    }
     componentDidMount() {
       const { formType, upload, dmp, getInitialState, dmpGetInitialState } = this.props;
        const isIgoForm = formType === 'upload';
        if (isIgoForm && !upload.form.initialFetched) return getInitialState();
        if (!isIgoForm && !dmp.form.initialFetched) return dmpGetInitialState(); 
        //return;    
console.log("fetching Materials");
this.fetchMaterials(); 
    }
    fetchMaterials=async()=>{
        try{
            this.setState({isloading:true});
            const response= await axios.get('http://localhost:4020/api/materials');
            console.log("Fetch materials from API:",response.data);
            this.setState=({
                materials:response.data,
                isloading:false,
            });
        } catch(error){
            console.log('Error fetching materials:',error);
            this.setState({isloading:false});
        }
    };
    handleMaterialChange = (selectedMaterial) => {
        const { getApplicationsForMaterial, clearMaterial } = this.props;
        if (selectedMaterial) {
            // get possible applications for this material
            getApplicationsForMaterial(selectedMaterial);
        } else {
            clearMaterial();
        }
    };


// Handle Material Selection change 
/*handleMaterialChange =async(e)=>{
    const selectedMaterial=e.target.value;
    this.setState({selectedMaterial,selectedSpecies:'',selectedConatiner:''});
    await this.fetchSpeciesAndContainers({material:selectedMaterial});
};

// Handle Application selection change 
handleApplicationChange=async(e)=>{
    const selectedApplication=e.target.value;
    this.setState({selectedApplication,selectedSpecies:'',selectedContainer:''});
    await this.fetchSpeciesAndContainers({application:selectedApplication});
}; 
*/ 
    handleApplicationChange = (selectedApplication) => {
        const { getMaterialsForApplication, clearApplication } = this.props;
        if (selectedApplication) {
            // get possible ,materials for this application
            getMaterialsForApplication(selectedApplication);
        } else {
            clearApplication();
        }
    };

    handleReadLengthChange = (selectedReadLength) => {
        const { clearReadLengths } = this.props;
        if (!selectedReadLength) clearReadLengths();
    }

    handleSpeciesChange = (selectedSpecies) => {
        const { clearSpecies } = this.props;
        if (!selectedSpecies) clearSpecies();
    };
    handleInputChange = (id, value) => {
        const { formType, select, dmpSelect, clear, dmpClear } = this.props;
        const isIgoForm = formType === 'upload';
        if (value) {
            isIgoForm ? select(id, value) : dmpSelect(id, value);
        } else {
            isIgoForm ? clear(id) : dmpClear(id);
        }
    };

    handleClear = () => {
        const { clearForm } = this.props;
        swal.confirmClear().then((decision) => {
            if (decision) clearForm();
        });
    };

    render() {
        const { upload, dmp, formType, handleSubmit, submitRowNumberUpdate } = this.props;
        const {materials, isloading}=this.state;
        return (
            <React.Fragment>
                {formType === 'upload' ? (
                    upload.form && upload.form.allMaterials ? (
                        <UploadForm
                            form={upload.form}
                            gridNumberOfSamples={upload.grid.form.numberOfSamples}
                            gridIsLoading={upload.grid.gridIsLoading}
                            nothingToChange={upload.form.nothingToChange}
                            handleSubmit={handleSubmit}
                            submitRowNumberUpdate={submitRowNumberUpdate}
                            handleMaterialChange={this.handleMaterialChange}
                            handleApplicationChange={this.handleApplicationChange}
                            handleSpeciesChange={this.handleSpeciesChange}
                            handleReadLengthChange={this.handleReadLengthChange}
                            handleInputChange={this.handleInputChange}
                            handleClear={this.handleClear}
                            materials={this.state.materials}
                            isloading={this.state.isloading}
                        />
                    ) : (
                        <div />
                    )
                ) : (
                    <DmpForm
                        handleSubmit={handleSubmit}
                        handleInputChange={this.handleInputChange}
                        submitRowNumberUpdate={submitRowNumberUpdate}
                        gridIsLoading={upload.grid.gridIsLoading}
                        nothingToChange={upload.grid.nothingToChange}
                        gridNumberOfSamples={upload.grid.form.numberOfSamples}
                        form={dmp.form}
                    />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    upload: state.upload,
    dmp: state.dmp,
});

const mapDispatchToProps = {
    ...formActions,
    ...dmpFormActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFormContainer);
