var express = require('express');
const UploadSubmission= require('../models/UploadSubmissionModel');
//const UploadSubmissionController = require('../controllers/UploadSubmissionController');
var router = express.Router();

router.get('/submissions',async(req,res)=>{
    try{
        const submissions=await
        UploadSubmission.find();
                res.json(submissions);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Materials'+ err.message});
    }
});

router.get('/applications',async(req,res)=>{
    try{
        const applications = await
        UploadSubmission.find({},{Application:1,_id:0});
                res.status(200).json(applications);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Application'+ err.message});
    }
}); 

router.get('/materials',async(req,res)=>{
    try{
        const materials = await
        UploadSubmission.find({},{Material:1,_id:0});
                res.status(200).json(materials);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Materials'+ err.message});
    }
}); 

router.get('/species',async(req,res)=>{
    const{materials,applications}= req.query;
    try{
        let species = await 
        UploadSubmission.find({},{Species:1,Material:1,Application:1,_id:0});
        console.log("Fetched Species",species);
        if(materials){
            //filteredSpecies=species.filter(s=>s.materials.include(materials));
        
            species=species.filter(s=>s.Material&&s.Material.includes(materials));
        }
        if(applications){
            //filteredSpecies=species.filter(s=>s.materials.include(materials));
        
            species=species.filter(s=>s.Application&&s.Application.includes(applications));
        }
                res.status(200).json(species);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Species'+ err.message});
    }
}); 


router.get('/containers',async(req,res)=>{
    const{materials,applications,species}= req.query;
    try{
        let containers = await
        UploadSubmission.find({},{Containers:1,Species:1,Material:1,Application:1,_id:0});
        console.log("Fetched Containers",containers);
        if(materials){
            //filteredSpecies=species.filter(s=>s.materials.include(materials));
        
            containers=containers.filter(s=>s.Material&&s.Material.includes(materials));
        }
        if(applications){
            //filteredSpecies=species.filter(s=>s.materials.include(materials));
        
            containers=containers.filter(s=>s.Application&&s.Application.includes(applications));
        }
                res.status(200).json(containers);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Containers'+ err.message});
    }
}); 

router.get('/readlength',async(req,res)=>{
    try{
        const readlength = await
        UploadSubmission.find({},{ReadLength:1,_id:0});
                res.status(200).json(readlength);
    }catch(err){
        res.status(500).json({messaage:'Error fetching readlength'+ err.message});
    }
}); 

module.exports = router;


