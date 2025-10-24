  export const naToExtractMapping = {
    "ATAC Sequencing": {
      "Cells": [],
      "Nuclei": []
    },
    "ddPCR": {
      "Blocks": ["DNA", "RNA", "DNA and RNA"],
      "Curls/Punches": ["DNA", "RNA", "DNA and RNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA", "RNA", "DNA and RNA", "hmwDNA"],
      "Buffy Coat": ["DNA", "RNA", "DNA and RNA", "hmwDNA"],
      "CSF": ["DNA", "RNA", "DNA and RNA", "hmwDNA"],
      "Nuclei": ["DNA", "RNA", "DNA and RNA", "hmwDNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Fingernails": ["DNA"],
      "Cells": ["DNA", "RNA", "DNA and RNA", "hmwDNA"],
      "Plasma": ["cfDNA", "DNA", "RNA", "DNA and RNA"],
      "Slides": ["DNA", "RNA", "DNA and RNA"],
      "Tissue": ["DNA", "RNA", "DNA and RNA", "hmwDNA"],
      "Whole Blood": ["DNA", "RNA", "hmwDNA"]
    },
    "cfDNA Extraction": {
      "Plasma": ["cfDNA"],
       "Urine": ["cfDNA"]
    },
    "DNA Extraction": {
      "Blocks": ["DNA", "hmwDNA"],
      "Curls/Punches": ["DNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA", "hmwDNA"],
      "Buffy Coat": ["DNA", "hmwDNA"],
      "CSF": ["DNA", "hmwDNA"],
      "Buccal Swab": ["DNA"],
      "Fingernails": ["DNA"],
      "Saliva": ["DNA"],
      "Cells": ["DNA", "hmwDNA"],
      "Nuclei": ["DNA", "hmwDNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA", "hmwDNA"],
      "Whole Blood": ["DNA", "hmwDNA"]
    },
    "Dual DNA/RNA Extraction": {
      "Blocks": ["DNA and RNA"],
      "Curls/Punches": ["DNA and RNA"],
      "Bone Marrow Biopsy": ["DNA and RNA"],
      "Buffy Coat": ["DNA and RNA"],
      "Cells": ["DNA and RNA"],
      "Slides": ["DNA and RNA"],
      "Tissue": ["DNA and RNA"],
      "Whole Blood": ["DNA and RNA"]
    },
    "RNA Extraction": {
      "Blocks": ["RNA"],
      "Curls/Punches": ["RNA"],
      "Bone Marrow Biopsy": ["RNA"],
      "Buffy Coat": ["RNA"],
      "CSF": ["RNA"],
      "Nuclei": ["RNA"],
      "Cells": ["RNA"],
      "Slides": ["RNA"],
      "Tissue": ["RNA"],
      "Whole Blood": ["RNA"]
    },
    "CCV RNA-Seq Submissions (GLP)": {
      "Tissue": ["RNA"]
    },
    "CCV WES Submissions (GLP)": {
      "Blocks": ["DNA"],
      "Whole Blood": ["DNA"]
    },
    "MSK-ACCESS": {
      "Buffy Coat": ["DNA"],
      "Plasma": ["DNA", "cfDNA"],
      "CSF": ["DNA", "cfDNA"],
      "Whole Blood": ["DNA"]
    },
    "MSK-ACCESS-Heme": {
      "Buffy Coat": ["DNA"],
      "CSF": ["DNA", "cfDNA"],
      "Plasma": ["DNA", "cfDNA"],
      "Whole Blood": ["DNA"]
    },
    "CMO-CH": {
      "Bone Marrow Biopsy": ["DNA"],
      "Buffy Coat": ["DNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Cells": ["DNA"],
      "CSF": ["DNA", "cfDNA"],
      "Plasma": ["DNA", "cfDNA"],
      "Curls/Punches": ["DNA"],
      "Blocks": ["DNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA"],
      "Whole Blood": ["DNA"]
    },
    "Custom Capture": {
      "Blocks": ["DNA", "hmwDNA"],
      "Curls/Punches": ["DNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA", "hmwDNA"],
      "Buffy Coat": ["DNA", "hmwDNA"],
      "CSF": ["DNA", "hmwDNA"],
      "Nuclei": ["DNA", "hmwDNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Fingernails": ["DNA"],
      "Cells": ["DNA", "hmwDNA"],
      "Plasma": ["cfDNA", "DNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA", "hmwDNA"],
      "Whole Blood": ["DNA", "hmwDNA"]
    },
    "IMPACT": {
      "Blocks": ["DNA"],
      "Curls/Punches": ["DNA"],
      "Bone Marrow Biopsy": ["DNA"],
      "Buffy Coat": ["DNA"],
      "CSF": ["DNA"],
      "Nuclei": ["DNA"],
      "Plasma": ["DNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Fingernails": ["DNA"],
      "Cells": ["DNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA"],
      "Whole Blood": ["DNA"]
    },
    "IMPACT-Heme": {
      "Blocks": ["DNA"],
      "Curls/Punches": ["DNA"],
      "Bone Marrow Biopsy": ["DNA"],
      "Buffy Coat": ["DNA"],
      "CSF": ["DNA"],
      "Nuclei": ["DNA"],
      "Plasma": ["DNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Fingernails": ["DNA"],
      "Cells": ["DNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA"],
      "Whole Blood": ["DNA"]
    },
    "Mouse IMPACT": {
      "Blocks": ["DNA"],
      "Curls/Punches": ["DNA"],
      "Bone Marrow Biopsy": ["DNA"],
      "Buffy Coat": ["DNA"],
      "CSF": ["DNA"],
      "Nuclei": ["DNA"],
      "Plasma": ["DNA"],
      "Cells": ["DNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA"],
      "Whole Blood": ["DNA"]
    },
    "Methylation Capture Sequencing": {
      "Blocks": ["DNA", "hmwDNA"],
      "Curls/Punches": ["DNA", "hmwDNA"],
      "Buffy Coat": ["DNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA", "hmwDNA"],
      "CSF": ["DNA", "hmwDNA"],
      "Nuclei": ["DNA", "hmwDNA"],
      "Cells": ["DNA", "hmwDNA"],
      "Plasma": ["DNA", "hmwDNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA", "hmwDNA"],
      "Whole Blood": ["DNA", "hmwDNA"]
    },
    "Whole Genome Methylation Sequencing": {
      "Blocks": ["DNA", "hmwDNA"],
      "Curls/Punches": ["DNA", "hmwDNA"],
      "Buffy Coat": ["DNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA", "hmwDNA"],
      "CSF": ["DNA", "hmwDNA"],
      "Nuclei": ["DNA", "hmwDNA"],
      "Cells": ["DNA", "hmwDNA"],
      "Plasma": ["DNA", "cfDNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA", "hmwDNA"],
      "Whole Blood": ["DNA", "hmwDNA"]
    },
    "Nanopore Adaptive Sampling": {
      "Buffy Coat": ["DNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA", "hmwDNA"],
      "CSF": ["DNA", "hmwDNA"],
      "Nuclei": ["DNA", "hmwDNA"],
      "Cells": ["DNA", "hmwDNA"],
      "Curls/Punches": ["DNA", "hmwDNA"],
      "Blocks": ["DNA", "hmwDNA"],
      "Plasma": ["DNA", "cfDNA"],
      "Tissue": ["DNA", "hmwDNA"],
      "Whole Blood": ["DNA", "hmwDNA"]
    },
    "Nanopore cDNA Sequencing": {
      "Buffy Coat": ["RNA"],
      "Cells": ["RNA"],
      "Curls/Punches": ["RNA"],
      "Blocks": ["RNA"],
      "Tissue": ["RNA"],
      "Whole Blood": ["RNA"]
    },
    "Nanopore Long Read DNA Sequencing": {
      "Buffy Coat": ["hmwDNA"],
      "Bone Marrow Biopsy": ["hmwDNA"],
      "Nuclei": ["hmwDNA"],
      "Cells": ["hmwDNA"],
      "Curls/Punches": ["hmwDNA"],
      "Tissue": ["hmwDNA"],
      "Whole Blood": ["hmwDNA"]
    },
    "Nanopore Direct RNA Sequencing": {
      "Cells": ["RNA"],
      "Curls/Punches": ["RNA"],
      "Tissue": ["RNA"],
      "Whole Blood": ["RNA"]
    },
    "Nanopore Short Read DNA Sequencing": {
      "Blocks": ["DNA"],
      "Curls/Punches": ["DNA"],
      "Buccal Swab": ["DNA"],
      "Fingernails": ["DNA"],
      "CSF": ["DNA", "cfDNA"],
      "Plasma": ["DNA", "cfDNA"]
    },
    "Optical Genome Mapping (Bionano)": {
      "Cells": ["uhmwDNA"],
      "Tissue": ["uhmwDNA"],
      "Whole Blood": ["uhmwDNA"]
    },
    "PED-PEG": {
      "Other": ["DNA", "RNA", "hmwDNA", "DNA and RNA"]
    },
    "IGO R&D Use Only": {
      "Blocks": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Buccal Swab": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Buffy Coat": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Cells": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "CSF": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Curls/Punches": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Fingernails": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Nuclei": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Other": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Plasma": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Slides": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Whole Blood": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Tissue": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"],
      "Saliva": ["DNA and RNA", "cfDNA", "RNA", "DNA", "hmwDNA"]
    },
    "RNA Capture": {
      "Blocks": ["RNA"],
      "Curls/Punches": ["RNA"],
      "Bone Marrow Biopsy": ["RNA"],
      "Buffy Coat": ["RNA"],
      "Cells": ["RNA"],
      "Slides": ["RNA"],
      "Tissue": ["RNA"],
      "Whole Blood": ["RNA"]
    },
    "RNA Seq - PolyA": {
      "Blocks": ["RNA"],
      "Curls/Punches": ["RNA"],
      "Bone Marrow Biopsy": ["RNA"],
      "Buffy Coat": ["RNA"],
      "Nuclei": ["RNA"],
      "Cells": ["RNA"],
      "Tissue": ["RNA"],
      "Whole Blood": ["RNA"]
    },
    "RNA Seq - Ribodepletion": {
      "Blocks": ["RNA"],
      "Curls/Punches": ["RNA"],
      "Bone Marrow Biopsy": ["RNA"],
      "Buffy Coat": ["RNA"],
      "Cells": ["RNA"],
      "Slides": ["RNA"],
      "Tissue": ["RNA"],
      "Whole Blood": ["RNA"]
    },
    "RNA Seq - SMARTer": {
      "Blocks": ["RNA"],
      "Curls/Punches": ["RNA"],
      "Buffy Coat": ["RNA"],
      "Bone Marrow Biopsy": ["RNA"],
      "Cells": ["RNA"],
      "Tissue": ["RNA"],
      "Whole Blood": ["RNA"]
    },
    "Human TCR Sequencing": {
      "Buffy Coat": ["RNA"],
      "Cells": ["RNA"],
      "Tissue": ["RNA"]
    },
    "Mouse TCR Sequencing": {
  "Buffy Coat": ["RNA"],
  "Cells": ["RNA"],
  "Tissue": ["RNA"]
},
    "Whole Exome Sequencing": {
      "Blocks": ["DNA"],
      "Curls/Punches": ["DNA"],
      "Bone Marrow Biopsy": ["DNA"],
      "Buffy Coat": ["DNA"],
      "CSF": ["DNA"],
      "Nuclei": ["DNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Fingernails": ["DNA"],
      "Cells": ["DNA"],
      "Plasma": ["DNA", "cfDNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA"],
      "Whole Blood": ["DNA"]
    },
    "Mouse Whole Exome Sequencing": {
      "Blocks": ["DNA"],
      "Curls/Punches": ["DNA"],
      "Bone Marrow Biopsy": ["DNA"],
      "Buffy Coat": ["DNA"],
      "CSF": ["DNA"],
      "Nuclei": ["DNA"],
      "Cells": ["DNA"],
      "Plasma": ["DNA", "cfDNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA"],
      "Whole Blood": ["DNA"]
    },
    "Whole Genome Sequencing (deep or PCR-free)": {
      "Blocks": ["DNA", "hmwDNA"],
      "Curls/Punches": ["DNA", "hmwDNA"],
      "Bone Marrow Biopsy": ["DNA", "hmwDNA"],
      "Buffy Coat": ["DNA", "hmwDNA"],
      "CSF": ["DNA", "hmwDNA"],
      "Nuclei": ["DNA", "hmwDNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Fingernails": ["DNA"],
      "Cells": ["DNA", "hmwDNA"],
      "Plasma": ["DNA", "cfDNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA", "hmwDNA"],
      "Whole Blood": ["DNA", "hmwDNA"]
    },
    "Shallow Whole Genome Sequencing": {
      "Blocks": ["DNA"],
      "Curls/Punches": ["DNA"],
      "Bone Marrow Biopsy": ["DNA"],
      "Buffy Coat": ["DNA"],
      "CSF": ["DNA"],
      "Plasma": ["DNA"],
      "Nuclei": ["DNA"],
      "Buccal Swab": ["DNA"],
      "Saliva": ["DNA"],
      "Fingernails": ["DNA"],
      "Cells": ["DNA"],
      "Slides": ["DNA"],
      "Tissue": ["DNA"],
      "Whole Blood": ["DNA"]
    }
  };

  




  


  export const sequencingMapping = {
    "ATAC Sequencing": {
      "PE100": ["40-50M", "50-60M", "60-80M", "80-100M"]
    },
    "Amplicon Sequencing": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "ChIP Sequencing": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "CRISPR Sequencing": {
      "PE150": []
    },
    "CUT&RUN Sequencing": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Single Cell CNV Sequencing": {
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "IGO R&D Use Only": {
      "50/8/16/50": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "Other": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE150": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE28": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "50/8/24/50": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "28/10/10/88": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "43/10/10/50": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"]
    },
    "RNA Seq - PolyA": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "RNA Seq - Ribodepletion": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "SMARTer from Cells": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "RNA Seq - SMARTer": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Amplicon Sequencing (Library)": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "ATAC Sequencing (Library)": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Post-Capture Sequencing": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "ChIP Sequencing (Library)": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "10X GEX, VDJ, FB/CH or Visium": {
      "28/10/10/88": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "10X scATAC Sequencing (Library)": {
      "50/8/24/50": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "50/8/16/50": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "CUT&RUN Sequencing (Library)": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "ERIL Library Submissions": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Methylation Sequencing": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "MissionBio": {
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "RNA Sequencing": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "shRNA Sequencing": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Single Cell CNV Sequencing (Library)": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Visium HD (Library)": {
      "43/10/10/50": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Whole Genome Bisulfite Sequencing": {
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Whole Genome Sequencing": {
      "PE50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE250": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE300": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR50": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR75": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR100": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "SR150": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "Other": ["750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
  }

  export const coverageMapping = {
    "Custom Capture": {
      "PE100": ["250X", "500X", "1000X"]
    },
    "Whole Genome Methylation Sequencing": {
      "PE150": ["1X", "10X", "30X", "40X", "80X", "150X"]
    },
    "Nanopore Long Read DNA Sequencing": {
      "": ["40X", "80X"]
    },
    "Nanopore cDNA Sequencing": {
      "": ["30-40M", "60-80M"]
    },
    "Whole Exome Sequencing": {
      "PE100": ["30X", "40X", "70X", "80X", "100X", "150X", "250X"]
    },
    "Mouse Whole Exome Sequencing": {
      "PE100": ["30X", "40X", "70X", "80X", "100X", "150X", "250X"]
    },
    "Whole Genome Sequencing (deep or PCR-free)": {
      "PE150": ["1X", "5X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "120X"]
    },
  }


  export const preservationMapping = {
  "Blocks": {
    "DNA": ["FFPE","OCT"],
    "DNA and RNA": ["FFPE","OCT"],
    "RNA": ["FFPE","OCT"],
    "hmwDNA": ["OCT"]
  },
  "Bone Marrow Biopsy": {
    "DNA": ["Frozen"],
    "DNA and RNA": ["Frozen"],
    "RNA": ["Frozen"],
    "hmwDNA": ["Frozen"]
  },
  "Buccal Swab": {
    "DNA": ["Fresh"]
  },
  "Buffy Coat": {
    "DNA": ["Frozen"],
    "DNA and RNA": ["Frozen"],
    "RNA": ["Frozen"],
    "hmwDNA": ["Frozen"]
  },
  "CSF": {
    "DNA": ["Frozen"],
    "DNA and RNA": ["Frozen"],
    "RNA": ["Frozen"],
    "cfDNA": ["Frozen"],
    "hmwDNA": ["Frozen"]
  },
  "Cells": {
    "DNA": ["Fixed Frozen","Frozen","RLT Buffer","RNALater","Viably Frozen"],
    "DNA and RNA": ["Fixed Frozen","Frozen","RLT Buffer","RNALater","Trizol","Trizol LS","Viably Frozen"],
    "RNA": ["Fixed Frozen","Frozen","RLT Buffer","RNALater","Trizol","Trizol LS","Viably Frozen"],
    "general": ["Fresh","Viably Frozen"],
    "hmwDNA": ["Frozen","Viably Frozen"],
    "uhmwDNA":["Viably Frozen"]
  },
  "Curls/Punches": {
    "DNA": ["FFPE","OCT"],
    "DNA and RNA": ["FFPE","OCT"],
    "RNA": ["FFPE","OCT"],
    "hmwDNA": ["OCT"]
  },
  "Fingernails": {
    "DNA": ["Fresh"]
  },
  "Nuclei": {
    "DNA": ["Frozen","Viably Frozen"],
    "DNA and RNA": ["Frozen"],
    "RNA": ["Frozen"],
    "general": ["Fresh","Viably Frozen"],
    "hmwDNA": ["Frozen","Viably Frozen"]
  },
  "Plasma": {
    "DNA": ["Frozen"],
    "DNA and RNA": ["Frozen"],
    "RNA": ["Frozen"],
    "cfDNA": ["Frozen"],
    "hmwDNA": ["Frozen"]
  },
   "Urine": {                    
    "cfDNA": ["Frozen"]
  },
  "Saliva": {
    "DNA": ["Fresh"]
  },
  "Slides": {
    "DNA": ["FFPE"],
    "DNA and RNA": ["FFPE"],
    "RNA": ["FFPE"]
  },
  "Tissue": {
    "DNA": ["Fixed Frozen","Frozen","OCT","RLT Buffer","RNALater"],
    "DNA and RNA": ["Fixed Frozen","Frozen","OCT","RLT Buffer","RNALater"],
    "RNA": ["Fixed Frozen","Frozen","OCT","RLT Buffer","RNALater","Trizol"],
    "hmwDNA": ["Frozen","OCT"],
    "uhmwDNA":['Frozen']
  },
  "Whole Blood": {
    "DNA": ["EDTA","Streck"],
    "DNA and RNA": ["PAXgene"],
    "RNA": ["PAXgene"],
    "hmwDNA": ["EDTA","Streck"]
  },
  "10X Genomics scRNA-Seq w/ On-Chip Multiplexing": {
      "Cells": ["Fresh"],
      "Nuclei": ["Fresh"]
    },
    "iCell8 scWGS": {
      "Cells": ["Fresh", "Viably Frozen"],
      "Nuclei": ["Fresh", "Viably Frozen"]
    },
    "DLP (User)": {
      "Pooled Library": ["Fresh", "Frozen"] 
    },
    "10X Flex scRNA-Seq": {
      "Blocks": ["FFPE", "Fixed Frozen"],
      "Slides": ["FFPE", "Fixed Frozen"],
      "Tissue": ["FFPE", "Fixed Frozen"]
},
  };


  export const specimenTypeMapping = {
                        "Human TCR Sequencing": {
                            "Buffy Coat": ["Blood or Buffy coats"],
                            "Cells": ["Sorted T cells", "Lymphoid tissue", "Non-lymphoid"],
                            "RNA": ["Sorted T cells", "Blood or Buffy coats", "Lymphoid tissue", "Non-lymphoid"],
                            "Tissue": ["Lymphoid tissue", "Non-lymphoid"]
                        },
                        "Mouse TCR Sequencing": {
    "Buffy Coat": ["Blood or Buffy coats"],
    "Cells": ["Sorted T cells", "Lymphoid tissue", "Non-lymphoid"],
    "RNA": ["Sorted T cells", "Blood or Buffy coats", "Lymphoid tissue", "Non-lymphoid"],
    "Tissue": ["Lymphoid tissue", "Non-lymphoid"]
}
                    };



