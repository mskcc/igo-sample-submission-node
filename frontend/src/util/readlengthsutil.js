/* eslint-disable quotes */
export const getReadLength = (application) => {
    if (application === "ATAC Sequencing" || application === "CCV WES Submissions (GLP)" || application === "CMO-CH" || application === "Custom Capture" || application === "ERIL Library Submissions" || application === "IMPACT" || application === "IMPACT-Heme" || application === "Metagenomic Sequencing" || application === "Methylation Capture Sequencing" || application === "Mouse IMPACT" || application === "Mouse Whole Exome Sequencing" || application === "MSK-ACCESS" || application === "MSK-ACCESS-Heme" || application === "RNA Seq - PolyA" || application === "RNA Seq - Ribodepletion" || application === "RNA Seq - SMARTer" || application === "Shallow Whole Genome Sequencing" || application === "SMARTer from Cells" || application === "SmartSeq (384-well)" || application === "Whole Exome Sequencing") {
        return 'PE100';
    } else if (application === "CCV RNA-Seq Submissions (GLP)" || application === "CRISPR Sequencing" || application === "DLP+" || application === "MissionBio" || application === "PED-PEG" || application === "Single Cell CNV Sequencing" || application === "TCR Sequencing" || application === "Whole Genome Methylation Sequencing" || application === "Whole Genome Sequencing (deep or PCR-free)") {
        return 'PE150';
    } else if (application === "10X 3' Feature Barcode/Hashtag Sequencing" || application === "10X 3' scRNA-Seq" || application === "10X 5' Feature Barcode/Hashtag Sequencing" || application === "10X 5' scRNA-Seq" || application === "10X GEX, VDJ, FB/CH or Visium" || application === "10X scVDJ (BCR) Sequencing" || application === "10X scVDJ (TCR) Sequencing" || application === "Visium") {
        return '28/10/10/88';
    } else if (application === "GeoMx") {
        return 'PE28';
    } else if (application === "Visium HD" || application === "Visium HD (Library)") {
        return '43/10/10/50';
    } else {
        return ; 
    }
};


export const getSpeciesForApplication = (application) => {
    if (application === "IMPACT" || 
        application === "IMPACT-Heme" || 
        application === "MSK-ACCESS" || 
        application === "MSK-ACCESS-Heme" || 
        application === "CCV RNA-Seq Submissions (GLP)" || 
        application === "CCV WES Submissions (GLP)" || 
        application === "CMO-CH" || 
        application === "Methylation Capture Sequencing" || 
        application === "PED-PEG" || 
        application === "Whole Exome Sequencing") {
        return 'Human';
    } else {
        return;
    }
};

