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
      "Plasma": ["cfDNA"]
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
    "TCR Sequencing": {
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

  