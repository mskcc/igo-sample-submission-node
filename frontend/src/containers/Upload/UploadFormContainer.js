/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { formActions, dmpFormActions } from '../../redux/actions';
import { getReadLength,getSpeciesForApplication } from '../../util/readlengthsutil';
import { swal } from '../../util';
import { Config } from '../../config';
import axios from 'axios';
import { DmpForm, UploadForm } from '../../components';
import { clearSpecies, select , fetchSpecies,fetchReadLength} from '../../redux/actions/upload/formActions';
export class UploadFormContainer extends Component {
    constructor(props){
        super(props);
        this.state={
            materials:[],
            applications:[],
            species:[],
            containers:[],
            readLengths:[],
            isloading:false,
            selectedMaterial:"",
            selectedApplication:"",
            isSpeciesDisabled:false,
            speciesList:[],
        };
    }
   componentDidMount() {
       const { formType, upload, dmp, getInitialState, dmpGetInitialState } = this.props;
        const isIgoForm = formType === 'upload';
        if (isIgoForm && !upload.form.initialFetched) {
             getInitialState().then(()=>{
                this.fetchMaterials(); 
                this.fetchApplications();
                this.fetchSpecies();
                this.fetchContainers();
             });
            }
            else{
                this.fetchMaterials(); 
                this.fetchApplications();
                this.fetchSpecies();
                this.fetchContainers();
            }
        if (!isIgoForm && !dmp.form.initialFetched) return dmpGetInitialState(); 
        //return;    
    }
    componentDidUpdate(prevProps,prevState){
        const{selectedMaterial,selectedApplication}=this.state;
        if(prevState.materials !== this.state.materials){
            //console.log("Materials updated:",this.state.materials);
        }
        if(prevState.selectedMaterial!== this.state.selectedMaterial)
        {
           // console.log("Selected material",this.state.selectedMaterial);
        }
        if(
        (prevState.selectedApplication!==selectedApplication)&&selectedApplication)
        {
            this.fetchSpecies(selectedApplication);
        }

        if(prevState.species !==this.state.species){
            console.log("Species updated in container",this.state.species);
        }
    if(
        (prevState.selectedMaterial!==selectedMaterial)
    || (prevState.selectedApplication!==selectedApplication)&&selectedApplication &&selectedMaterial)
    {
        this.fetchContainers(selectedMaterial,selectedApplication);
    }
}




/*autoFillSpecies = (application) => {
    const speciesToAutoFill = ['IMPACT', 'IMPACT-Heme', 'CCV WES Submissions (GLP)', 'CMO-CH', 'Methylation Capture Sequencing', 'MSK-ACCESS', 'MSK-ACCESS-Heme', 'Whole Exome Sequencing'];
    if (speciesToAutoFill.includes(application)) {
        this.handleSpeciesChange('Human');
    }
};*/






    
    fetchMaterials=async(application='')=>{
        this.setState({isloading:true});
        try{
            const response= await axios.get(`${Config.NODE_API_ROOT}/materials`,{params:{application}});
            if(response.status===200)
            {
            this.setState({
                materials:response.data,
                isloading:false,
            });
        
                this.handleMaterialChange(selectedMaterial);
        }
        } catch(error){
            console.log("Error fetching materials:",error);
            this.setState({isloading:false});
        }
    };

    fetchApplications=async(material='')=>{
        this.setState({isloading:true});
        try{
            const response= await axios.get(`${Config.NODE_API_ROOT}/applications`,{params:{material}});
            if(response.status===200)
            {
            this.setState({
                applications:response.data,
                isloading:false,
            });

                this.handleApplicationChange(selectedApplication);

        }
        } catch(error){
            console.log("Error fetching application:",error);
            this.setState({isloading:false});
        }
    };

    handleMaterialChange = (selectedMaterial) => {
       // console.log("Selected Material:", selectedMaterial);
        this.setState({selectedMaterial},()=>{
            this.fetchApplications(selectedMaterial);
            //this.fetchSpecies(selectedMaterial,this.state.selectedApplication);
            //this.fetchContainers(selectedMaterial,this.state.selectedApplication);
        }); 
        }; 
    

handleApplicationChange = (selectedApplication) => {
    console.log("Selected Application:", selectedApplication);
    const species = getSpeciesForApplication(selectedApplication);
    this.setState({ selectedApplication , selectedSpecies:species}, () => {
        console.log("Selected Application after application change :", this.state);
        if(species)
            {
                console.log("Selected species from handle application change :", species);
                this.handleSpeciesChange(species);
            }       
        this.fetchMaterials(selectedApplication);
        this.fetchReadLength(selectedApplication);
        this.fetchSpecies(selectedApplication);
       
    });
};

            fetchSpecies = async (application) => {
                console.log("Application for species:", application);
                const params = {};
                if (application) {
                    params.application = application;
                }
                try {
                    const response = await axios.get(`${Config.NODE_API_ROOT}/species`, { params });
                    if (response.status === 200) {
                        const fetchedspecies = response.data;
                        this.setState({
                            species:fetchedspecies,
                            isloading: false,
                        }, ()=>{
                            console.log("Species updated in state",fetchedspecies);
                        });
                    } 
                } catch (error) {
                    console.log("Error fetching species:", error);
                    this.setState({ isloading: false });
                }
            };


   


    fetchContainers=async(material,application)=>{
       // console.log("Material:", material);
        //console.log("Application:",application);
        const params={};
        if(material){
            params.material=material;
        }
        if(application){
            params.application=application;
        }
            try{
         const response=await axios.get(`${Config.NODE_API_ROOT}/containers`,{params});
                this.setState({
                    containers:response.data,
                    isloading:false,
                });
        if (material === "Blocks" && application === "CosMx") {
            this.handleContainersChange("Blocks/Slides/Tubes");
        }}catch(error){
            console.log("Error fetching container:",error);
            this.setState({isloading:false});
    }};
    



fetchReadLength=async(application)=>{
      //  console.log("Application:",application);
        const params={};
        if(application){
            params.application=application;
            const readLength = getReadLength(application); 
            this.handleReadLengthChange(readLength);
        }
        try{
         const response=await axios.get(`${Config.NODE_API_ROOT}/readlength`,{params});
         if(response.status===200){
            const readLengths=response.data;
                this.setState({
                    readLengths,isloading:false,
                });
             } else{
            this.setState({readLengths:[],isloading:false});
        } }
        catch(error){
            console.log("Error fetching readlengths for autofill:",error);
            this.setState({isloading:false});
    }};


    handleReadLengthChange = (selectedReadLength) => {
        const { clearReadLengths } = this.props;
        if (!selectedReadLength) {clearReadLengths();
    } 
    const {select} =this.props;
    if(select) {
        select("sequencingReadLength",selectedReadLength);
        this.setState((prevState) => ({
            values:{
                ...prevState.values,
                sequencingReadLength:selectedReadLength,},
        }),
        () => console.log("State updated read length:",selectedReadLength) );
    }
    };


handleSpeciesChange = (selectedSpecies) => {
    console.log("Species changed to :",selectedSpecies);
    const { clearSpecies } = this.props;
    if (!selectedSpecies) {clearSpecies();
} 
const {select} =this.props;
if(select) {
    select("species",selectedSpecies);
    this.setState((prevState) => ({
        selectedSpecies,
        values:{
            ...prevState.values,
            species:selectedSpecies,},
    }),
    () => console.log("State updated species:",selectedSpecies));
}
};


    handleContainersChange = (selectedContainers) => {
        const { clearContainers } = this.props;
        if (!selectedContainers) clearContainers();
        const {select} =this.props;
    }
    


    handleInputChange = (id, value) => {
        if(id==='material'){
            this.handleMaterialChange(value);
        }else if(id==='application'){
        this.handleApplicationChange(value);
        }else if (
            id ==='sequencingReadLength'
        ){
            this.handleReadLengthChange(value);
        }else if (
            id ==='species'
        ){
            this.handleSpeciesChange(value);
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
        const {materials, isloading,applications,containers,species,readLengths}=this.state;
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
                            readLengths={this.state.readLengths}
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
    select,
});

const mapDispatchToProps = {
    ...formActions,
    ...dmpFormActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFormContainer);

