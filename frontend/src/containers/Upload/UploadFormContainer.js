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
            applications:[],
            species:[],
            containers:[],
            isloading:false,
            selectedMaterial:"",
            selectedApplication:"",
        };
    }
   componentDidMount() {
       const { formType, upload, dmp, getInitialState, dmpGetInitialState } = this.props;
        const isIgoForm = formType === 'upload';
        if (isIgoForm && !upload.form.initialFetched) return getInitialState();
        if (!isIgoForm && !dmp.form.initialFetched) return dmpGetInitialState(); 
        //return;    
        this.fetchMaterials(); 
        this.fetchApplications();
        this.fetchSpecies();
        this.fetchContainers();
    }
    fetchMaterials=async(application='')=>{
        this.setState({isloading:true});
        try{
            const response= await axios.get('http://localhost:4020/api/materials',{params:{application}});
            if(response.status===200)
            {
            this.setState({
                materials:response.data,
                isloading:false,
            });
        }
        } catch(error){
            console.log("Error fetching materials:",error);
            this.setState({isloading:false});
        }
    };

    fetchApplications=async(material='')=>{
        this.setState({isloading:true});
        try{
            const response= await axios.get('http://localhost:4020/api/applications',{params:{material}});
            if(response.status===200)
            {
            this.setState({
                applications:response.data,
                isloading:false,
            });
        }
        } catch(error){
            console.log("Error fetching application:",error);
            this.setState({isloading:false});
        }
    };

    handleMaterialChange = (selectedMaterial) => {
        console.log("Selected Material:", selectedMaterial);
        this.setState({selectedMaterial},()=>{
            //console.log("state after material change",this.state.material);
            this.fetchApplications(selectedMaterial);
            this.fetchSpecies(selectedMaterial,this.state.selectedApplication);
            this.fetchContainers(selectedMaterial,this.state.selectedApplication);
        });
        }; 
    
    
        handleApplicationChange = (selectedApplication) => {
            console.log("Selected Application:", selectedApplication);
            this.setState({selectedApplication},()=>{
               // console.log("state after application change",this.state.application);
               this.fetchMaterials(selectedApplication);
               this.fetchSpecies(selectedApplication,this.state.selectedMaterial);
               this.fetchContainers(selectedApplication,this.state.selectedApplication);
            });
            }; 

    /*fetchContainers=async(selectedMaterial,selectedApplication)=>{
        try{
           // this.setState({isloading:true});
            const response= await axios.get('http://localhost:4020/api/containers?materials=${selectedMaterial}&application=${selectedApplication}');
            if(response.status===200)
            {
            this.setState({
                containers:response.data,
                isloading:false,
            });
        }
        } catch(error){
            console.log("Error fetching containers:",error);
            this.setState({isloading:false});
        }
    };*/

    fetchSpecies=async(material,application)=>{
        console.log("Material:", material);
        console.log("Application:",application);
        const params={};
        if(material){
            params.material=material;
        }
        if(application){
            params.application=application;
        }
            try{
         const response=await axios.get('http://localhost:4020/api/species',{params});
                this.setState({
                    species:response.data,
                    isloading:false,
                });
        } catch(error){
            console.log("Error fetching species:",error);
            this.setState({isloading:false});
    }};




    fetchContainers=async(material,application)=>{
        console.log("Material:", material);
        console.log("Application:",application);
        const params={};
        if(material){
            params.material=material;
        }
        if(application){
            params.application=application;
        }
            try{
         const response=await axios.get('http://localhost:4020/api/containers',{params});
                this.setState({
                    containers:response.data,
                    isloading:false,
                });
        } catch(error){
            console.log("Error fetching container:",error);
            this.setState({isloading:false});
    }};



  /*handleMaterialChange = (selectedMaterial) => {
        const { getApplicationsForMaterial, clearMaterial } = this.props;
        console.log("Selected Material:", selectedMaterial);
        if (selectedMaterial) {
            // get possible applications for this material
            getApplicationsForMaterial(selectedMaterial);
        } else {
            clearMaterial();
        }
    };*/


 /*  handleApplicationChange = (selectedApplication) => {
        const { getMaterialsForApplication, clearApplication } = this.props;
        console.log("Selected Application:", selectedApplication);
        if (selectedApplication) {
            // get possible ,materials for this application
            getMaterialsForApplication(selectedApplication);
        } else {
            clearApplication();
        }
    };*/ 

    handleReadLengthChange = (selectedReadLength) => {
        const { clearReadLengths } = this.props;
        if (!selectedReadLength) clearReadLengths();
    }
 
    handleSpeciesChange = (selectedSpecies) => {
        const { clearSpecies } = this.props;
        if (!selectedSpecies) clearSpecies();
    };

    handleContainersChange = (selectedContainers) => {
        const { clearContainers } = this.props;
        if (!selectedContainers) clearContainers();
    };


    handleInputChange = (id, value) => {
        if(id==='material'){
            this.handleMaterialChange(value);
        }else if(id==='application'){
        this.handleApplicationChange(value);
        }
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
        const {materials, isloading,applications,containers,species}=this.state;
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
                            applications={this.state.applications}
                            containers={this.state.containers}
                            species={this.state.species}
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
