var express = require('express');
const UploadSubmission= require('../models/UploadSubmissionModel');
const { naToExtractMapping } = require('../util/gridconstants');
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
        if(material =="DNA"){
            allApplications = allApplications.filter(app => app === "Amplicon Sequencing"|| app==="ChIP Sequencing"|| app==="CMO-CH"|| app==="CRISPR Sequencing" || app==="Custom Capture"|| app==="CUT&RUN Sequencing"|| app==="ddPCR"|| app==="DNA QC"|| app==="IGO R&D Use Only"|| app==="IMPACT"|| app==="IMPACT-Heme"|| app==="Metagenomic Sequencing"|| app==="Methylation Capture Sequencing"|| app==="Mouse IMPACT"|| app==="Mouse Whole Exome Sequencing"|| app==="MSK-ACCESS"|| app==="Nanopore Adaptive Sampling"|| app==="Nanopore Long Read DNA Sequencing"|| app==="Nanopore Short Read DNA Sequencing"|| app==="Shallow Whole Genome Sequencing"|| app==="Single Cell CNV Sequencing"|| app==="Whole Exome Sequencing"|| app==="Whole Genome Methylation Sequencing"|| app==="Whole Genome Sequencing (deep or PCR-free)" || app==="MSK-ACCESS-Heme");
        }
        else if(material=="cDNA"){
            allApplications = allApplications.filter(app => app === "10X 3' Feature Barcode/Hashtag Sequencing"|| app==="10X 3' scRNA-Seq"|| app==="10X 5' Feature Barcode/Hashtag Sequencing"|| app==="10X 5' scRNA-Seq" || app==="10X scVDJ (BCR) Sequencing"|| app==="10X scVDJ (TCR) Sequencing"|| app==="Amplicon Sequencing"|| app==="DNA QC"|| app==="IGO R&D Use Only"|| app==="Custom Capture"|| app==="ddPCR"|| app==="Nanopore 10X cDNA Sequencing"|| app==="Nanopore cDNA Sequencing"|| app==="RNA Seq - Ribodepletion");
        }
        
        if(allApplications.some(app=>["10X GEX", "VDJ", "FB/CH or Visium"].includes(app))){
            allApplications.push("10X GEX, VDJ, FB/CH or Visium");
            allApplications=allApplications.filter(app=>!["10X GEX", "VDJ", "FB/CH or Visium"].includes(app));
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
        const materials = await
        UploadSubmission.find(query,{Material:1,_id:0});
        materials.forEach(mat=>{
            if(mat.Material){
                allMaterials=allMaterials.concat(mat.Material.split(",").map(item=>item.trim()));
            }
        });
        const uniqueMaterials=Array.from(new Set(allMaterials));
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
        const containers = await 
        UploadSubmission.find(query,{Containers:1,_id:0});
        let uniqueContainers=new Set();
        containers.forEach(doc=>{
            const plainDoc=doc.toObject();
            if(plainDoc.Containers){
                plainDoc.Containers.split(',').map(item=>item.trim()).forEach(container=>{
                    uniqueContainers.add(container);
                });

            }else{
                console.log("No containers field found in document");
            }});
            const finalContainers=Array.from(uniqueContainers);
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
        const readLengths = await
        UploadSubmission.find(query,{ReadLength:1,_id:0});
        let uniqueReadLengths=new Set();
        readLengths.forEach(doc=>{
            const plainDoc=doc.toObject();
            if(plainDoc.ReadLength){
                plainDoc.ReadLength.split(',').map(item=>item.trim()).forEach(readLength=>{
                    uniqueReadLengths.add(readLength);
                });
            }else{
                console.log("No readlength found in document");
            }});
        const finalReadLengths=Array.from(new Set(uniqueReadLengths));
                res.status(200).json(finalReadLengths);
    }catch(err){
        res.status(500).json({message:'Error fetching readlength'+ err.message});
    }
}); 






router.get('/nucleic-acid-types', async (req, res) => {
    try {
        const { material, application } = req.query;
        
        // Both parameters are required
        if (!material || !application) {
            return res.status(400).json({ 
                error: 'Both material and application parameters are required' 
            });
        }
        
        const materialTrimmed = material.trim();
        const applicationTrimmed = application.trim();
        
        console.log(`Looking for nucleic acid types for: ${materialTrimmed} + ${applicationTrimmed}`);
        
        // Step 1: Validate that this material + application combination exists in MongoDB
        let query = {};
        query.Material = { $regex: `\\b${materialTrimmed.replace(/\s+/g, '\\s+')}\\b`, $options: 'i' };
        
        // Handle special application case (same logic as your other routes)
        const specialApplication = "10X GEX, VDJ, FB/CH or Visium";
        if (applicationTrimmed === specialApplication) {
            query.Application = specialApplication;
        } else {
            query.Application = applicationTrimmed;
        }
        
        // Check if this combination exists in MongoDB
        const existsInDB = await UploadSubmission.findOne(query, { _id: 1 });
        
        if (!existsInDB) {
            console.log(`Combination ${materialTrimmed} + ${applicationTrimmed} not found in MongoDB`);
            return res.status(200).json([]);
        }
        
        
        if (!naToExtractMapping[applicationTrimmed]) {
            console.log(`Application "${applicationTrimmed}" not found in nucleic acid mapping`);
            return res.status(200).json([]);
        }
        
        const applicationMapping = naToExtractMapping[applicationTrimmed];
        const availableMaterials = Object.keys(applicationMapping);
        
        // Find matching material in the JavaScript mapping
        const matchingMaterial = availableMaterials.find(mappedMaterial => 
            mappedMaterial.toLowerCase() === materialTrimmed.toLowerCase()
        ) || availableMaterials.find(mappedMaterial => 
            mappedMaterial.toLowerCase().includes(materialTrimmed.toLowerCase()) ||
            materialTrimmed.toLowerCase().includes(mappedMaterial.toLowerCase())
        );
        
        if (!matchingMaterial) {
            console.log(`Material "${materialTrimmed}" not found in nucleic acid JavaScript mapping for "${applicationTrimmed}"`);
            return res.status(200).json([]);
        }
        
        // Get nucleic acid types from JavaScript mapping
        const nucleicTypes = applicationMapping[matchingMaterial] || [];
        
        console.log(`✅ Found nucleic acid types from JavaScript mapping for ${matchingMaterial} + ${applicationTrimmed}:`, nucleicTypes);
        
        res.status(200).json(nucleicTypes);
        
    } catch (err) {
        console.log("Error fetching Nucleic Acid Types", err);
        res.status(500).json({ 
            message: 'Error fetching nucleic acid types: ' + err.message 
        });
    }
});
module.exports = router;


