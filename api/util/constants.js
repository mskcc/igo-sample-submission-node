export const constants = {
    containers: ['Plates', 'Micronic Barcoded Tubes', 'Blocks/Slides/Tubes'],
    headerPicklists: ['Recipe', 'Exemplar+Sample+Types', 'Species', 'PatientIDTypes', 'PatientIdTypesSpecified', 'Bait+Selection+Choices'],
    containersByMaterial: {
        Tissue: ['Blocks/Slides/Tubes'],
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
    },

    deprecatedApplications: ['nanostring'],

    humanApplications: ['expanded_genomics', 'msk-access', 'hemepact', 'archer', 'impact4', 'humanwholegenome', 'methylcaptureseq'],

    mouseApplications: ['mousewholegenome ', 'm-impact_v1'],

    humanOrMouseApplications: ['wholeexomesequencing'],

    logger: 'sample-sub',
};
export const emailConfig = {
    cmoPmEmailApplications: [
        'HemePACT_v4',
        'HumanWholeGenome',
        'IMPACT410',
        'IMPACT505',
        'IMPACT468',
        'MSK-ACCESS_v1',
        'WholeExomeSequencing',
    ],
    notificationRecipients: 'zzPDL_SKI_IGO_Sample_and_Project_Management@mskcc.org, wagnerl@mskcc.org',
    notificationSender: 'igoski@mskcc.org',
    cmoPmEmail: 'skicmopm@mskcc.org',
    // #skicmopm@mskcc.org
    subject: '[TEST IGO Submission]',
    footer:
        '<br><br><br>Thank you, <br><br><a href="http://cmo.mskcc.org/cmo/igo/">Integrated Genomics Operation</a><br><a href="https://www.mskcc.org">Memorial Sloan Kettering Cancer Center</a><br>T 646.888.3765<br>Follow us on <a href="https://www.instagram.com/genomics212/?hl=en">Instagram</a> and <a href="https://twitter.com/genomics212?lang=en">Twitter</a>!<br>',
};
