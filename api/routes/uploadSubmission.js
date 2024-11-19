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
        res.status(500).json({message:'Error fetching Materials'+ err.message});
    }
});

// Routes for Applications 
router.get('/applications',async(req,res)=>{
    const {material}=req.query;
    try{
        let query={};
        if(material){
            const materials=material.split(',').map(item=>item.trim());
           query.Material={$regex:materials.join('|'),$options:'i'};
        }
        const applications = await
        UploadSubmission.find(query,{Application:1,_id:0});
        let allApplications=[];
        applications.forEach(app=>{
            if(app.Application){
            allApplications=allApplications.concat(app.Application.split(",").map(item=>item.trim()));
            }
        });

        if(allApplications.some(app=>["10X GEX", "VDJ", "FB/CH", "or Visium"].includes(app))){
            allApplications.push("10X GEX, VDJ, FB/CH or Visium");
            allApplications=allApplications.filter(app=>!["10X GEX", "VDJ", "FB/CH", "or Visium"].includes(app));
        }
        const uniqueApplications=Array.from(new Set(allApplications));
        res.status(200).json(uniqueApplications);
    }catch(err){
        res.status(500).json({message:'Error fetching Application'  + err.message});
    }
}); 


// Routes for Materials

router.get('/materials',async(req,res)=>{
    let{application}=req.query;
    console.log("received application:",application);
    try{
        let query={};
        let allMaterials=[];
        const specialApplication="10X GEX, VDJ, FB/CH or Visium";
        if(application && application.trim()===specialApplication){

            query.Application=specialApplication;
        }
            else if(application){
                const applications=application.split(',').map(item=>item.trim());
                query.Application={$in:applications};
            }
           console.log("Query used for MongoDB:",query);
        const materials = await
        UploadSubmission.find(query,{Material:1,_id:0});
        console.log("Materials fetched:",materials);
        materials.forEach(mat=>{
            if(mat.Material){
                allMaterials=allMaterials.concat(mat.Material.split(",").map(item=>item.trim()));
            }
        });
        const uniqueMaterials=Array.from(new Set(allMaterials));
        console.log("Unique Materials fetched:",uniqueMaterials);
        res.status(200).json(uniqueMaterials);
    }catch(err){
        console.log("Error Fetching Materials",err)
        res.status(500).json({message:'Error fetching Materials'+ err.message});
    }
}); 


router.get('/species',async(req,res)=>{
    try{
        let query={};
        if(req.query.application){
            const application=req.query.application.trim();
            const specialApplication="10X GEX, VDJ, FB/CH or Visium";
           if(application===specialApplication){
            query.Application=specialApplication;
        }
        else{
            const applications=req.query.application.split(',').map(item=>item.trim());
            query.Application={$in:applications};
        }
        }
        const species = await 
        UploadSubmission.find(query,{Species:1,_id:0});
        console.log("Fetched Species",species);
        let uniqueSpecies=[];
        species.forEach(doc=>{
            if(doc.Species){
                const speciesArray=doc.Species.split(',').map(item=>item.trim());
                uniqueSpecies=[...uniqueSpecies,...speciesArray];
            }
        });
        const finalSpecies=Array.from(new Set(uniqueSpecies));
                res.status(200).json(finalSpecies);
    }catch(err){
        console.log("Error fetching Species",err);
        res.status(500).json({message:'Error fetching Species'+ err.message});
    }
}); 
  

// Routes for Containers
router.get('/containers',async(req,res)=>{
    try{
        let query={};
        if(req.query.material){
            const materials=req.query.material.split(',').map(item=>item.trim());
            query.Material={$regex:'\\b'+materials.join('\\b|\\b'),$options:'i'};
        }
        if(req.query.application){
            const application=req.query.application.trim();
            const specialApplication="10X GEX, VDJ, FB/CH or Visium";
           if(application===specialApplication){

            query.Application=specialApplication;
        }
        else{
            const applications=req.query.application.split(',').map(item=>item.trim());
            query.Application={$in:applications};
        }
        }
        console.log("Query used for MongoDB:",query);
        const containers = await 
        UploadSubmission.find(query,{Containers:1,_id:0});
        console.log("Fetched Containers",containers);

        let uniqueContainers=new Set();
        containers.forEach(doc=>{
            const plainDoc=doc.toObject();
            console.log("Plain document",plainDoc);
            if(plainDoc.Containers){
                console.log("Containers value:",plainDoc.Containers);
                plainDoc.Containers.split(',').map(item=>item.trim()).forEach(container=>{
                    uniqueContainers.add(container);
                });

            }else{
                console.log("No containers field found in document");
            }});
            const finalContainers=Array.from(uniqueContainers);
            console.log("Final Containers", finalContainers)
                res.status(200).json(finalContainers);
    }catch(err){
        console.log("Error fetching Containers",err);
        res.status(500).json({message:'Error fetching Containers'+ err.message});
    }
}); 

// Routes for ReadLength

router.get('/readlength',async(req,res)=>{
    try{
        let query={};
        if(req.query.application){
            const application=req.query.application.trim();
            const specialApplication="10X GEX, VDJ, FB/CH or Visium";
           if(application===specialApplication){

            query.Application=specialApplication;
        }
        else{
            const applications=req.query.application.split(',').map(item=>item.trim());
            query.Application={$in:applications};
        }
        }
        else{
            return res.status(200).json([]);
        }
        console.log("Query used for MongoDB:",query);
        const readLengths = await
        UploadSubmission.find(query,{ReadLength:1,_id:0});
        console.log("ReadLength fetched:",readLengths);

        let uniqueReadLengths=new Set();
        readLengths.forEach(doc=>{
            const plainDoc=doc.toObject();
            console.log("Plain document",plainDoc);
            if(plainDoc.ReadLength){
                console.log("ReadLength value:",plainDoc.ReadLength);
                plainDoc.ReadLength.split(',').map(item=>item.trim()).forEach(readLength=>{
                    uniqueReadLengths.add(readLength);
                });
            }else{
                console.log("No containers field found in document");
            }});
        const finalReadLengths=Array.from(new Set(uniqueReadLengths));
        console.log("Final ReadLengths fetched:",finalReadLengths);
                res.status(200).json(finalReadLengths);
    }catch(err){
        res.status(500).json({message:'Error fetching readlength'+ err.message});
    }
}); 

module.exports = router;



