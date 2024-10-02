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



/*router.get('/applications',async(req,res)=>{
    try{
        const applications = await
        UploadSubmission.find({},{Application:1,_id:0});
                res.status(200).json(applications);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Application'+ err.message});
    }
}); 
*/

router.get('/applications',async(req,res)=>{
    const {material}=req.query;
    try{
        let query={};
        if(material){
            const materials=material.split(',').map(item=>item.trim());
           query.Material={$in:materials};
        }
        const applications = await
        UploadSubmission.find(query,{Application:1,_id:0});
        let allApplications=[];
        applications.forEach(app=>{
            if(app.Application){
            allApplications=allApplications.concat(app.Application.split(",").map(item=>item.trim()));
            }
        });
        const uniqueApplications=Array.from(new Set(allApplications));
        res.status(200).json(uniqueApplications);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Application'  + err.message});
    }
}); 

router.get('/materials',async(req,res)=>{
    let{application}=req.query;
    console.log("received application:",application);
    try{
        let query={};
        if(application){
            const applications=application.split(',').map(item=>item.trim());
           query.Application={$in:applications};
           console.log("Query used for MongoDB:",query);
        }
        const materials = await
        UploadSubmission.find(query,{Material:1,_id:0});
        console.log("Materials fetched:",materials);
        let allMaterials=[];
        materials.forEach(mat=>{
            if(mat.Material){
                allMaterials=allMaterials.concat(mat.Material.split(",").map(item=>item.trim()));
            }
        });
        const uniqueMaterials=Array.from(new Set(allMaterials));
        console.log("Unique Materials fetched:",uniqueMaterials);
        res.status(200).json(uniqueMaterials);
    }catch(err){
        res.status(500).json({messaage:'Error fetching Materials'+ err.message});
    }
}); 

router.get('/species',async(req,res)=>{
    try{
        let query={};
        if(req.query.material){
            const materials=req.query.material.split(',').map(item=>item.trim());
           query.Material={$in:materials};
        }
        if(req.query.application){
            const applications=req.query.application.split(',').map(item=>item.trim());
            query.Application={$in:applications};
        }
        const species = await 
        UploadSubmission.find(query,{Species:1,_id:0});
        console.log("Fetched Species",species);
        
            const allspecies=species.reduce((acc,item)=>{
                const SpeciesArray=item.Species.split(",").map(item=>item.trim());
                return acc.concat(SpeciesArray);
            },[]);
            const uniqueSpecies=Array.from(new Set(allspecies));
                res.status(200).json(uniqueSpecies);
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


