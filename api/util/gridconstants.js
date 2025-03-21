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
    "Methyl Capture Sequencing": {
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
    "Optical Genome Mapping (OGM)": {
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

  export const preservationMapping = {
    "ATAC Sequencing": {
      "Cells": ["Fresh", "Viably Frozen"],
      "Nuclei": ["Fresh", "Viably Frozen"]
    },
    "ddPCR": {
      "Blocks": ["FFPE"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Cells": ["Fixed Frozen", "RLT Buffer", "RNALater", "Viably Frozen", "Frozen", "Trizol", "Trizol LS"],
      "Plasma": ["Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Frozen", "OCT", "Fixed Frozen", "RLT Buffer", "RNALater", "Trizol"],
      "Whole Blood": ["EDTA", "Streck", "PAXgene"]
    },
    "cfDNA Extraction": {
      "Plasma": ["Frozen"]
    },
    "DNA Extraction": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Saliva": ["Fresh"],
      "Cells": ["Fixed Frozen", "RLT Buffer", "RNALater", "Frozen", "Viably Frozen"],
      "Nuclei": ["Frozen", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "RLT Buffer", "RNALater", "Frozen", "OCT"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Dual DNA/RNA Extraction": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer", "RNALater"],
      "Whole Blood": ["PAXgene"]
    },
    "RNA Extraction": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer", "RNALater", "Trizol"],
      "Whole Blood": ["PAXgene"]
    },
    "CCV RNA-Seq Submissions (GLP)": {
      "Tissue": ["Frozen"]
    },
    "CCV WES Submissions (GLP)": {
      "Blocks": ["FFPE"],
      "Whole Blood": ["EDTA"]
    },
    "MSK-ACCESS": {
      "Buffy Coat": ["Frozen"],
      "Plasma": ["Frozen"],
      "CSF": ["Frozen"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "MSK-ACCESS-Heme": {
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Plasma": ["Frozen"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "CMO-CH": {
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Viably Frozen"],
      "CSF": ["Frozen"],
      "Plasma": ["Frozen"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Blocks": ["FFPE", "OCT"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Custom Capture": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Cells": ["Fixed Frozen", "RLT Buffer", "Frozen", "Viably Frozen"],
      "Plasma": ["Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "RLT Buffer", "Frozen", "OCT"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "IMPACT": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Plasma": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "IMPACT-Heme": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Plasma": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Mouse IMPACT": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Plasma": ["Frozen"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Methyl Capture Sequencing": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Buffy Coat": ["Frozen"],
      "Bone Marrow Biopsy": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Cells": ["Frozen", "Viably Frozen", "Fixed Frozen", "RLT Buffer", "RNALater"],
      "Plasma": ["Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Frozen", "OCT", "Fixed Frozen", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Whole Genome Methylation Sequencing": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Buffy Coat": ["Frozen"],
      "Bone Marrow Biopsy": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Cells": ["Frozen", "Viably Frozen", "Fixed Frozen", "RLT Buffer", "RNALater"],
      "Plasma": ["Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Frozen", "OCT", "Fixed Frozen", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Nanopore Adaptive Sampling": {
      "Buffy Coat": ["Frozen"],
      "Bone Marrow Biopsy": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Cells": ["Frozen", "Viably Frozen"],
      "Curls/Punches": ["OCT"],
      "Blocks": ["OCT"],
      "Plasma": ["Frozen"],
      "Tissue": ["Frozen", "OCT"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Nanopore cDNA Sequencing": {
      "Buffy Coat": ["Frozen"],
      "Cells": ["Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS", "Viably Frozen"],
      "Curls/Punches": ["OCT"],
      "Blocks": ["OCT"],
      "Tissue": ["Frozen", "OCT", "RLT Buffer", "RNALater", "Trizol"],
      "Whole Blood": ["PAXgene"]
    },
    "Nanopore Long Read DNA Sequencing": {
      "Buffy Coat": ["Frozen"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Cells": ["Frozen", "RLT Buffer", "Viably Frozen"],
      "Curls/Punches": ["OCT"],
      "Tissue": ["Frozen", "OCT"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Nanopore Direct RNA Sequencing": {
      "Cells": ["Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS"],
      "Curls/Punches": ["OCT"],
      "Tissue": ["Frozen", "OCT", "RLT Buffer", "RNALater", "Trizol"],
      "Whole Blood": ["PAXgene"]
    },
    "Nanopore Short Read DNA Sequencing": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Buccal Swab": ["Fresh"],
      "Fingernails": ["Fresh"],
      "CSF": ["Frozen"],
      "Plasma": ["Frozen"]
    },
    "Optical Genome Mapping (OGM)": {
      "Cells": ["Viably Frozen"],
      "Tissue": ["Frozen"],
      "Whole Blood": ["EDTA"]
    },
    "PED-PEG": {
      "Other": ["EDTA", "FFPE", "Frozen", "OCT", "PAXgene", "Fresh", "Streck"]
    },
    "IGO R&D Use Only": {
      "Blocks": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Bone Marrow Biopsy": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Buccal Swab": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Buffy Coat": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "cDNA": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Cells": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "cfDNA": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "CSF": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Curls/Punches": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "DNA": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "DNA/cDNA Library": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Fingernails": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "hmwDNA": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Nuclei": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Other": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Plasma": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Pooled Library": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "RNA": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Slides": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Whole Blood": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Tissue": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"],
      "Saliva": ["EDTA", "FFPE", "Fixed Frozen", "Fresh", "Frozen", "OCT", "PAXgene", "RLT Buffer", "RNALater", "Viably Frozen", "Trizol LS", "Trizol", "Streck"]
    },
    "RNA Capture": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer", "RNALater"],
      "Whole Blood": ["PAXgene"]
    },
    "RNA Seq - PolyA": {
      "Blocks": ["OCT"],
      "Curls/Punches": ["OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Cells": ["Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS"],
      "Tissue": ["Frozen", "OCT", "RLT Buffer", "RNALater", "Trizol"],
      "Whole Blood": ["PAXgene"]
    },
    "RNA Seq - Ribodepletion": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer", "RNALater", "Trizol"],
      "Whole Blood": ["PAXgene"]
    },
    "SMARTer from Cells": {
      "Cells": ["Frozen"]
    },
    "RNA Seq - SMARTer": {
      "Blocks": ["OCT"],
      "Curls/Punches": ["OCT"],
      "Buffy Coat": ["Frozen"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Cells": ["Frozen", "RNALater", "Trizol", "Trizol LS", "RLT Buffer", "Viably Frozen"],
      "Tissue": ["Frozen", "OCT", "RLT Buffer", "RNALater", "Trizol"],
      "Whole Blood": ["PAXgene"]
    },
    "10X Flex scRNA-Seq": {
      "Blocks": ["FFPE", "Fixed Frozen"],
      "Slides": ["FFPE", "Fixed Frozen"],
      "Tissue": ["FFPE", "Fixed Frozen"]
    },
    "10X 3' scRNA-Seq": {
      "Cells": ["Fresh"],
      "Nuclei": ["Fresh"]
    },
    "10X 5' scRNA-Seq": {
      "Nuclei": ["Fresh"],
      "Cells": ["Fresh"]
    },
    "10X Multiome": {
      "Nuclei": ["Fresh"]
    },
    "DLP+": {
      "Nuclei": ["Fresh", "Viably Frozen"],
      "Cells": ["Fresh", "Viably Frozen"]
    },
    "SmartSeq (384-well)": {
      "Cells": ["Frozen"]
    },
    "CosMx": {
      "Blocks": ["FFPE", "Fixed Frozen", "Frozen"],
      "Slides": ["FFPE", "Fixed Frozen", "Frozen"],
      "Tissue": ["FFPE", "Fixed Frozen", "Frozen"]
    },
    "GeoMx": {
      "Blocks": ["FFPE", "Fixed Frozen", "Frozen"],
      "Slides": ["FFPE", "Fixed Frozen", "Frozen"]
    },
    "Visium": {
      "Blocks": ["FFPE", "Fixed Frozen", "Frozen"],
      "Slides": ["FFPE", "Fixed Frozen", "Frozen"],
      "Curls/Punches": ["FFPE", "Fixed Frozen", "Frozen"]
    },
    "Visium HD": {
      "Blocks": ["FFPE"],
      "Curls/Punches": ["FFPE"]
    },
    "Xenium": {
      "Blocks": ["FFPE", "Fixed Frozen", "Frozen"],
      "Slides": ["FFPE", "Fixed Frozen", "Frozen"],
      "Curls/Punches": ["FFPE", "Fixed Frozen", "Frozen"]
    },
    "TCR Sequencing": {
      "Buffy Coat": ["Frozen"],
      "Cells": ["Frozen", "RLT Buffer", "RNALater", "Trizol", "Trizol LS", "Viably Frozen"],
      "Tissue": ["Frozen", "OCT", "RLT Buffer", "RNALater", "Trizol"]
    },
    "Whole Exome Sequencing": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Viably Frozen"],
      "Plasma": ["Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Mouse Whole Exome Sequencing": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Viably Frozen"],
      "Plasma": ["Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Whole Genome Sequencing (deep or PCR-free)": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Cells": ["Fixed Frozen", "RLT Buffer", "RNALater", "Frozen", "Viably Frozen"],
      "Plasma": ["Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Frozen", "OCT", "Fixed Frozen", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
    },
    "Shallow Whole Genome Sequencing": {
      "Blocks": ["FFPE", "OCT"],
      "Curls/Punches": ["FFPE", "OCT"],
      "Bone Marrow Biopsy": ["Frozen"],
      "Buffy Coat": ["Frozen"],
      "CSF": ["Frozen"],
      "Plasma": ["Frozen"],
      "Nuclei": ["Frozen"],
      "Buccal Swab": ["Fresh"],
      "Saliva": ["Fresh"],
      "Fingernails": ["Fresh"],
      "Cells": ["Fixed Frozen", "Frozen", "RLT Buffer", "RNALater", "Viably Frozen"],
      "Slides": ["FFPE"],
      "Tissue": ["Fixed Frozen", "Frozen", "OCT", "RLT Buffer"],
      "Whole Blood": ["EDTA", "Streck"]
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
    "Custom Capture": {
      "PE100": ["250X", "500X", "1000X"]
    },
    "Whole Genome Methylation Sequencing": {
      "PE150": ["1X", "10X", "30X", "40X", "80X", "150X"]
    },
    "Nanopore cDNA Sequencing": {
      "": ["30-40M", "60-80M"]
    },
    "Nanopore Long Read DNA Sequencing": {
      "": ["40X", "80X"]
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
      "PE28/88": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"],
      "PE43/50": ["1X", "10X", "30X", "40X", "50X", "60X", "70X", "80X", "100X", "150X", "250X", "500X", "1000X", "5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M", "750K-1M total", "3-4M total", "10-20M total", "80-100M total", "350-400M total", "1.4-1.8B total", "3.6-3.8B total", "10-11B total"]
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
    "Amplicon Sequencing (User)": {
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
    "ATAC Sequencing (User)": {
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
    "ChIP Sequencing (User)": {
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
    "10X GEX, VDJ, FB/CH, or Visium": {
      "PE28/88": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "10X scATAC Sequencing (User)": {
      "50/8/24/50": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "50/8/16/50": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "CUT&RUN Sequencing (User)": {
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
    "Single Cell CNV Sequencing (User)": {
      "PE100": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"],
      "PE150": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
    },
    "Visium HD (User)": {
      "PE43/50": ["5-10M", "10-20M", "20-30M", "30-40M", "40-50M", "50-60M", "60-80M", "80-100M", "100-120M", "120-140M", "140-160M", "160-180M", "180-200M", ">200M"]
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