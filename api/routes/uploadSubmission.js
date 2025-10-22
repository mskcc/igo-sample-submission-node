var express = require('express');
const UploadSubmission= require('../models/UploadSubmissionModel');
const { naToExtractMapping } = require('../util/gridconstants');
//const UploadSubmissionController = require('../controllers/UploadSubmissionController');
var router = express.Router();





function buildMaterialQuery(material) {
    if (!material) return {};
    
    const materials = material.split(',').map(item => item.trim());
   
    const escapedMaterials = materials.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    return {
        Material: { 
            $regex: `\\b(${escapedMaterials.join('|')})\\b`, 
            $options: 'i' 
        }
    };
}



function buildApplicationQuery(application) {
    if (!application) return {};
    
    const specialApplication = "10X GEX, VDJ, FB/CH or Visium";
    
    if (application.trim() === specialApplication) {
        return { Application: specialApplication };
    }
    
    const applications = application.split(',').map(item => item.trim());
    return { Application: { $in: applications } };
}



router.get('/submissions', async (req, res) => {
    try {
        const submissions = await UploadSubmission.find().lean();
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching submissions: ' + err.message });
    }
});

// Routes for Applications 
router.get('/applications', async (req, res) => {
    const { material } = req.query;
    
    try {
        let query = {};
        
        
        if (material) {
            query = buildMaterialQuery(material);
        }
        
      
        const applications = await UploadSubmission.find(query, { Application: 1, _id: 0 }).lean();
        
        let allApplications = [];
        applications.forEach(app => {
            if (app.Application) {
                allApplications = allApplications.concat(
                    app.Application.split(",").map(item => item.trim())
                );
            }
        });
        
       
        if (material === "DNA") {
            const dnaApps = new Set([
                "Amplicon Sequencing", "ChIP Sequencing", "CMO-CH", "CRISPR Sequencing",
                "Custom Capture", "CUT&RUN Sequencing", "ddPCR", "DNA QC", "IGO R&D Use Only",
                "IMPACT", "IMPACT-Heme", "Metagenomic Sequencing", "Methylation Capture Sequencing",
                "Mouse IMPACT", "Mouse Whole Exome Sequencing", "MSK-ACCESS", "MSK-ACCESS-Heme",
                "Nanopore Adaptive Sampling", "Nanopore Long Read DNA Sequencing",
                "Nanopore Short Read DNA Sequencing", "Shallow Whole Genome Sequencing",
                "Single Cell CNV Sequencing", "Whole Exome Sequencing",
                "Whole Genome Methylation Sequencing", "Whole Genome Sequencing (deep or PCR-free)"
            ]);
            allApplications = allApplications.filter(app => dnaApps.has(app));
        } else if (material === "cDNA") {
            const cdnaApps = new Set([
                "10X 3' Feature Barcode/Hashtag Sequencing", "10X 3' scRNA-Seq",
                "10X 5' Feature Barcode/Hashtag Sequencing", "10X 5' scRNA-Seq",
                "10X scVDJ (BCR) Sequencing", "10X scVDJ (TCR) Sequencing",
                "Amplicon Sequencing", "DNA QC", "IGO R&D Use Only", "Custom Capture",
                "ddPCR", "Nanopore 10X cDNA Sequencing", "Nanopore cDNA Sequencing",
                "RNA Seq - Ribodepletion"
            ]);
            allApplications = allApplications.filter(app => cdnaApps.has(app));
        }
        
       
        if (allApplications.some(app => ["10X GEX", "VDJ", "FB/CH or Visium"].includes(app))) {
            allApplications.push("10X GEX, VDJ, FB/CH or Visium");
            allApplications = allApplications.filter(app => !["10X GEX", "VDJ", "FB/CH or Visium"].includes(app));
        }
        
        const uniqueApplications = Array.from(new Set(allApplications));
        res.status(200).json(uniqueApplications);
        
    } catch (err) {
        console.error("Error fetching Applications:", err);
        res.status(500).json({ message: 'Error fetching Applications: ' + err.message });
    }
});

// Routes for Materials

router.get('/materials', async (req, res) => {
    let { application } = req.query;
    
    try {
        let query = {};
       
        if (application) {
            query = buildApplicationQuery(application);
        }
        
       
        const materials = await UploadSubmission.find(query, { Material: 1, _id: 0 }).lean();
        
        let allMaterials = [];
        materials.forEach(mat => {
            if (mat.Material) {
                allMaterials = allMaterials.concat(
                    mat.Material.split(",").map(item => item.trim())
                );
            }
        });
        
        const uniqueMaterials = Array.from(new Set(allMaterials));
        res.status(200).json(uniqueMaterials);
        
    } catch (err) {
        console.error("Error fetching Materials:", err);
        res.status(500).json({ message: 'Error fetching Materials: ' + err.message });
    }
});


router.get('/species', async (req, res) => {
    try {
        let query = {};
        
        if (req.query.application) {
            query = buildApplicationQuery(req.query.application);
        }
        
        const species = await UploadSubmission.find(query, { Species: 1, _id: 0 }).lean();
        
        let uniqueSpecies = [];
        species.forEach(doc => {
            if (doc.Species) {
                const speciesArray = doc.Species.split(',').map(item => item.trim());
                uniqueSpecies = [...uniqueSpecies, ...speciesArray];
            }
        });
        
        const finalSpecies = Array.from(new Set(uniqueSpecies));
        res.status(200).json(finalSpecies);
        
    } catch (err) {
        console.error("Error fetching Species:", err);
        res.status(500).json({ message: 'Error fetching Species: ' + err.message });
    }
});
  

// Routes for Containers
router.get('/containers', async (req, res) => {
    try {
        let query = {};
        
        if (req.query.material) {
            Object.assign(query, buildMaterialQuery(req.query.material));
        }
        
        if (req.query.application) {
            Object.assign(query, buildApplicationQuery(req.query.application));
        }
        
        const containers = await UploadSubmission.find(query, { Containers: 1, _id: 0 }).lean();
        
        let uniqueContainers = new Set();
        containers.forEach(doc => {
            if (doc.Containers) {
                doc.Containers.split(',').map(item => item.trim()).forEach(container => {
                    uniqueContainers.add(container);
                });
            }
        });
        
        const finalContainers = Array.from(uniqueContainers);
        res.status(200).json(finalContainers);
        
    } catch (err) {
        console.error("Error fetching Containers:", err);
        res.status(500).json({ message: 'Error fetching Containers: ' + err.message });
    }
});
// Routes for ReadLength

router.get('/readlength', async (req, res) => {
    try {
        if (!req.query.application) {
            return res.status(200).json([]);
        }
        
        
        const query = buildApplicationQuery(req.query.application);
        
        
        const readLengths = await UploadSubmission.find(query, { ReadLength: 1, _id: 0 }).lean();
        
        let uniqueReadLengths = new Set();
        readLengths.forEach(doc => {
            if (doc.ReadLength) {
                doc.ReadLength.split(',').map(item => item.trim()).forEach(readLength => {
                    uniqueReadLengths.add(readLength);
                });
            }
        });
        
        const finalReadLengths = Array.from(uniqueReadLengths);
        res.status(200).json(finalReadLengths);
        
    } catch (err) {
        console.error("Error fetching ReadLength:", err);
        res.status(500).json({ message: 'Error fetching readlength: ' + err.message });
    }
});






 router.get('/nucleic-acid-types', async (req, res) => {
    try {
        const { material, application } = req.query;
        
        if (!material || !application) {
            return res.status(400).json({ 
                error: 'Both material and application parameters are required' 
            });
        }
        
        const materialTrimmed = material.trim();
        const applicationTrimmed = application.trim();
        
        console.log(`Looking for nucleic acid types for: ${materialTrimmed} + ${applicationTrimmed}`);
        
       
        let query = {};
        Object.assign(query, buildMaterialQuery(materialTrimmed));
        Object.assign(query, buildApplicationQuery(applicationTrimmed));
        
        
        const existsInDB = await UploadSubmission.findOne(query, { _id: 1 }).lean();
        
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
        
        const matchingMaterial = availableMaterials.find(mappedMaterial => 
            mappedMaterial.toLowerCase() === materialTrimmed.toLowerCase()
        ) 
        
        if (!matchingMaterial) {
            console.log(`Material "${materialTrimmed}" not found in nucleic acid JavaScript mapping for "${applicationTrimmed}"`);
            return res.status(200).json([]);
        }
        
        const nucleicTypes = applicationMapping[matchingMaterial] || [];
        console.log(`✅ Found nucleic acid types from JavaScript mapping for ${matchingMaterial} + ${applicationTrimmed}:`, nucleicTypes);
        res.status(200).json(nucleicTypes);
        
    } catch (err) {
        console.error("Error fetching Nucleic Acid Types:", err);
        res.status(500).json({ 
            message: 'Error fetching nucleic acid types: ' + err.message 
        });
    }
});

module.exports = router;
