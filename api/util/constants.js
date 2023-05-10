export const constants = {
    containers: ['Plates', 'Micronic Barcoded Tubes', 'Blocks/Slides/Tubes'],
    headerPicklists: ['Recipe', 'Exemplar+Sample+Types', 'Species', 'PatientIDTypes', 'PatientIdTypesSpecified', 'Bait+Selection+Choices', 'Illumina+Sequencing+Run+Types'],
    containersByMaterial: {
        Tissue: ['Blocks/Slides/Tubes', 'Micronic Barcoded Tubes'],
        Cells: ['Plates', 'Blocks/Slides/Tubes'],
        'Blocks/Slides': ['Blocks/Slides/Tubes'],
        Blood: ['Blocks/Slides/Tubes'],
        'Buffy Coat': ['Micronic Barcoded Tubes', 'Blocks/Slides/Tubes'],
        RNA: ['Plates'],
        DNA: ['Plates', 'Micronic Barcoded Tubes'],
        cfDNA: ['Plates', 'Micronic Barcoded Tubes'],
        'DNA Library': ['Plates', 'Micronic Barcoded Tubes'],
        'Pooled Library': ['Micronic Barcoded Tubes'],
        cDNA: ['Plates'],
        'cDNA Library': ['Plates'],
        other: ['Plates', 'Micronic Barcoded Tubes', 'Blocks/Slides/Tubes'],
        Nuclei: ['Blocks/Slides/Tubes'],
    },

    deprecatedApplications: ['nanostring'],

    humanApplications: ['expanded_genomics', 'msk-access', 'hemepact', 'archer', 'impact4', 'humanwholegenome', 'methylcaptureseq'],

    mouseApplications: ['mousewholegenome ', 'm-impact_v1'],

    humanOrMouseApplications: ['wholeexomesequencing'],

    logger: 'sampleSubmission',
    mrnRedactedString: 'MRN_REDACTED',
};
export const emailConfig = {
    cmoPmEmailApplications: ['HemePACT_v4', 'IMPACT410', 'IMPACT505', 'IMPACT468', 'MSK-ACCESS_v1', 'WholeExomeSequencing'],
    singleCellEmailApplications: [
        'DLP',
        'MissionBio-Custom',
        'MissionBio-Heme',
        'MissionBio-Myeloid',
        'MissionBio-THS',
        '10X_Genomics_Multiome',
        '10X_Genomics_VDJ',
        '10X_Genomics_GeneExpression-3',
        '10X_Genomics_GeneExpression-5',
        '10X_Genomics_ATAC',
        '10X_Genomics_FeatureBarcoding-3',
        '10X_Genomics_FeatureBarcoding-5',
    ],
    notificationRecipients: 'zzPDL_SKI_IGO_Sample_and_Project_Management@mskcc.org, zzPDL_SKI_IGO_DATA@mskcc.org',
    notificationDMPRecipients: 'skicmopm@mskcc.org, zzPDL_SKI_IGO_Sample_and_Project_Management@mskcc.org, zzPDL_SKI_IGO_DATA@mskcc.org',
    notificationSender: 'igoski@mskcc.org',
    cmoPmEmail: 'skicmopm@mskcc.org',
    // #skicmopm@mskcc.org
    singleCellTeamEmail: 'zzPDL_SKI_IGO_SingleCell@mskcc.org',
    subject: '[IGO Submission]',
    DMPsubject: '[DMP Submission]',
    footer: '<br><br><br>Thank you, <br><br><a href="https://genomics.mskcc.org/">Integrated Genomics Operation</a><br><a href="https://www.mskcc.org">Memorial Sloan Kettering Cancer Center</a><br>T 646.888.3765<br>Follow us on <a href="https://www.instagram.com/genomics212/?hl=en">Instagram</a> and <a href="https://twitter.com/genomics212?lang=en">Twitter</a>!<br><br>Please rate your submission experience <a href="https://genomics.mskcc.org/feedback/sample-submission">here</a>',
};
