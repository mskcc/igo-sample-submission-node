const validationPatterns = {
    userId: '^[A-Za-z0-9](?!.*__)[A-Za-z0-9\\,_-]{2}[A-Za-z0-9\\,_-]*$',
    patientId: '^[A-Za-z0-9][A-Za-z0-9\\,_-]*$',
    blockslidetube: '^.{1,25}$',
    number: '^[0-9.]*$',
    collectionYear: 'd{4}|^$',
    wellPosition: '[A-Za-z]+[0-9]+|^$',
    micronicTubeBarcode: '^[0-9]{10}$',
    alphanum: '[0-9a-zA-Z]',
    alphanumFour: '[0-9a-zA-Z]{4,}',
    alphanumdash: '^[A-Za-z0-9](?!.*__)[A-Za-z0-9\\,_-]{2}[A-Za-z0-9\\,_-]*$',
    cmoId: '^C[-|_].{6}$',
    dmpSampleId: '^P-[0-9]{7}-.{3}-.{3}$',
    dmpPatientId: '^P-[0-9]{7}$',
    mrn: '^[0-9]{8}$',
    groupingId: '[A-Za-z0-9\\,_-]{4,}',
    plateId: '^MSK-[A-Za-z0-9\\,_-]{10,}$',
};
export const deprecatedColumns = ['Index Position'];
export const formattingAdjustments = {
    'DMP Patient ID': {
        pattern: validationPatterns.dmpPatientId,
        columnHeader: 'DMP Patient ID',
        tooltip: 'The patient DMP ID or MRN.',
        error:
            'DMP ID is incorrectly formatted, please correct, or speak to a project manager if unsure. The usual DMP Patient ID format is P-0000000.',
        type: 'text',
    },
};
export const gridColumns = {
    'Tracking ID': {
        name: 'Tracking ID',
        columnHeader: 'Tracking ID',
        data: 'dmpTrackingId',
        pattern: validationPatterns.alphanumdash,
        error: 'Only letters, digits, - and _, please.',
        sendToDmp: true,
        hiddenFrom: 'user',
    },

    'DMP Sample ID': {
        name: 'DMP Sample ID',
        pattern: validationPatterns.alphanumdash,
        columnHeader: 'DMP Sample ID',
        data: 'dmpSampleId',
        error: 'Only valid DMP Sample IDs, e.g. P-0000000-T00-IM0.',
        sendToDmp: true,
    },

    'DMP Patient ID': {
        pattern: validationPatterns.dmpPatientId,
        data: 'patientId',
        columnHeader: 'DMP Patient ID',
        tooltip: 'The patient DMP ID.',
        error:
            'DMP ID is incorrectly formatted, please correct, or speak to a project manager if unsure. The usual DMP Patient ID format is P-0000000.',
        type: 'text',
    },

    'Investigator Sample ID': {
        columnHeader: 'Investigator Sample ID',
        data: 'userId',
        pattern: validationPatterns.alphanumdash,
        error: 'Only letters, digits, - and _, please.',
        hiddenFrom: 'user',
        uniqueError: 'Sample ID needs to be unique.',
        containsSampleError: 'Sample ID cannot contain the word "sample" or "IGO-.',
    },

    // Used by CMO PMs for WES requests
    'Investigator Provided Patient ID': {
        name: 'Investigator Provided Patient ID',
        columnHeader: 'Investigator Provided Patient ID',
        data: 'studySubjectIdentifier',
        pattern: validationPatterns.alphanumdash,
        error: 'Only letters, digits, - and _, please.',
    },

    'Investigator Provided Sample ID': {
        name: 'Investigator Provided Sample ID',
        columnHeader: 'Investigator Provided Sample ID',
        data: 'studySampleIdentifier',
        pattern: validationPatterns.userId,
        error: 'Only letters, digits, - and _, please.',
        uniqueError: 'Sample ID needs to be unique.',
        containsSampleError: 'Sample ID cannot contain the word "sample" or "IGO-.',
    },

    'Sample Type': {
        name: 'Sample Type',
        columnHeader: 'Sample Type',
        data: 'sampleType',
        type: 'autocomplete',
        strict: true,
        error: 'Only dropdown options are permitted as values',
        picklistName: 'DmpSampleTypes',
        sendToDmp: true,
    },

    'Project PI': {
        name: 'Project PI',
        columnHeader: 'Project PI',
        data: 'projectPi',
        sendToDmp: true,
    },

    'Project Title': {
        name: 'Project Title',
        columnHeader: 'Project Title',
        data: 'projectTitle',
        sendToDmp: true,
    },

    'DMP to Transfer': {
        name: 'DMP to Transfer',
        columnHeader: 'DMP to Transfer',
        data: 'dmpToTransfer',
        source: ['yes', 'no'],
        type: 'autocomplete',
        strict: true,
        error: 'Only dropdown options are permitted as values',
        hiddenFrom: 'user',
    },

    'Molecular Pathology Accession Number': {
        name: 'Molecular Pathology Accession Number',
        columnHeader: 'Molecular Pathology Accession Number',
        data: 'molecularPathologyAccessionNumber',
    },

    'Gene and Mutation': {
        name: 'Gene and Mutation',
        columnHeader: 'Gene and Mutation',
        data: 'geneAndMutation',
    },

    'Sample Approved by CMO': {
        name: 'Sample Approved by CMO',
        columnHeader: 'Sample Approved by CMO',
        data: 'sampleApprovedByCmo',
        type: 'autocomplete',
        strict: true,
        error: 'Only dropdown options are permitted as values',
        picklistName: 'DmpCmoSampleApproval',
        hiddenFrom: 'user',
        sendToDmp: true,
    },

    'Requested Coverage': {
        name: 'Requested Coverage',
        columnHeader: 'Requested Coverage',
        data: 'requestedCoverage',
        type: 'autocomplete',
        strict: true,
        error: 'Only dropdown options are permitted as values',
        picklistName: 'DmpCoverage',
        hiddenFrom: 'user',
    },

    'Amount Requested': {
        name: 'Amount Requested',
        columnHeader: 'Amount Requested (ng)',
        data: 'amountRequested',
        pattern: validationPatterns.number,
        hiddenFrom: 'user',
    },
    'Approved for DMP': {
        name: 'Approved for DMP',
        columnHeader: 'Approved for DMP',
        className: 'htCenter htMiddle',
        type: 'checkbox',
        data: 'isApproved',
        hiddenFrom: 'user',
    },
    'Normalized Patient ID': {
        name: 'Normalized Patient ID',
        columnHeader: 'Normalized Patient ID',
        data: 'normalizedPatientId',
        hiddenFrom: 'user',
        readOnly: true,
        tooltip: 'Normalized Patient Id that is sent to CMO service',
    },
    'CMO Patient ID': {
        name: 'CMO Patient ID',
        columnHeader: 'CMO Patient ID',
        data: 'cmoPatientId',
        hiddenFrom: 'user',
        readOnly: true,
        tooltip: 'CMO anonymized patient id',
    },
};
export const submissionColumns = {
    // 'Related IGO Submission ID': {
    //     name: 'Related IGO Submission ID',
    //     data: 'relatedIgoSubmission_id',
    //     readOnly: 'true',
    //     hiddenFrom: 'user'
    // },

    'Tracking ID': {
        name: 'Tracking ID',
        data: 'dmpTrackingId',
        readOnly: 'true',
    },

    'User ID': {
        name: 'User',
        data: 'username',
        readOnly: 'true',
    },

    'Sample Type': {
        name: 'Sample Type',
        data: 'sampleType',
        readOnly: 'true',
    },
    Application: {
        name: 'Application',
        data: 'application',
        readOnly: 'true',
    },

    '#Samples': {
        name: '#Samples',
        data: 'numberOfSamples',
        readOnly: 'true',
    },

    'Submitted to CMO PMs?': {
        name: 'Submitted to CMO PMs?',
        data: 'submitted',
        readOnly: 'true',
        renderer: 'html',
    },
    Approved: {
        name: 'Approved',
        data: 'samplesApproved',
        readOnly: 'true',
        renderer: 'html',
    },

    Reviewed: {
        name: 'Reviewed',
        data: 'reviewed',
        readOnly: 'true',
        renderer: 'html',
    },
    'Reviewed By': {
        name: 'Reviewed By',
        data: 'reviewedBy',
        readOnly: 'true',
    },

    'Transaction ID': {
        name: 'Transaction ID',
        data: 'transactionId',
        readOnly: 'true',
    },

    '# Revisions': {
        name: '# Revisions',
        data: 'revisions',
        readOnly: 'true',
    },
    Edit: {
        name: 'Edit',
        data: 'edit',
        renderer: 'html',
    },
    Review: {
        name: 'Review',
        data: 'review',
        renderer: 'html',
    },
    'Load From DMP': {
        name: 'Load From DMP',
        data: 'loadFromDmp',
        readOnly: 'true',
        renderer: 'html',
    },

    Unsubmit: {
        name: 'Unsubmit',
        data: 'unsubmit',
        renderer: 'html',
    },

    Receipt: {
        name: 'Receipt',
        data: 'receipt',
        renderer: 'html',
    },
    Delete: {
        name: 'Delete',
        data: 'delete',
        renderer: 'html',
    },
    'Date Reviewed': {
        name: 'Reviewed On',
        data: 'reviewedAt',
        readOnly: 'true',
    },

    'Date Created': {
        name: 'Created On',
        data: 'createdAt',
        readOnly: 'true',
    },

    'Date Submitted': {
        name: 'Submitted On',
        data: 'submittedAt',
        readOnly: 'true',
    },

    'Date Loaded From DMP': {
        name: 'Loaded From DMP',
        data: 'loadedFromDmpAt',
        readOnly: 'true',
    },
};
export const invalidCombinations = ['DNA Library+HumanWholeGenome'];

export const dmpIntakeForms = {
    'DNA+CustomCapture': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA+QC_Pickup': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA+ImmunoSeq': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA+HumanWholeGenome': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA+IMPACT505': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA+ddPCR': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Gene and Mutation', 'Optional'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA+WholeExomeSequencing': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Sample Approved by CMO', 'Optional'],
        ['Requested Coverage', 'Required'],
        ['Investigator Provided Patient ID', 'Required'],
        ['Investigator Provided Sample ID', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    // 'DNA Library+HumanWholeGenome': [
    //     ['Approved for DMP', 'Required'],
    //     ['Tracking ID', 'Required'],
    //     ['DMP Sample ID', 'Required'],
    //     ['Investigator Provided Patient ID', 'Required'],
    //     ['Investigator Provided Sample ID', 'Required'],
    //     ['Sample Type', 'Required'],
    //     ['Project PI', 'Required'],
    //     ['Project Title', 'Required'],
    //     ['DMP to Transfer', 'Required'],
    //     ['Molecular Pathology Accession Number', 'Optional'],
    //     ['Amount Requested', 'Optional'],
    // ],
    'DNA Library+IMPACT505': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA Library+ddPCR': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Gene and Mutation', 'Optional'],
        ['Molecular Pathology Accession Number', 'Optional'],
    ],
    'DNA Library+WholeExomeSequencing': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Sample Approved by CMO', 'Optional'],
        ['Requested Coverage', 'Required'],
        ['Investigator Provided Patient ID', 'Required'],
        ['Investigator Provided Sample ID', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA Library+CustomCapture': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA Library+QC_Pickup': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
    'DNA Library+ImmunoSeq': [
        ['Approved for DMP', 'Required'],
        ['DMP to Transfer', 'Required'],
        ['Tracking ID', 'Required'],
        ['DMP Sample ID', 'Required'],
        ['DMP Patient ID', 'Required'],
        ['CMO Patient ID', 'Required'],
        ['Normalized Patient ID', 'Required'],
        ['Investigator Sample ID', 'Required'],
        ['Sample Type', 'Required'],
        ['Project PI', 'Required'],
        ['Project Title', 'Required'],
        ['Molecular Pathology Accession Number', 'Optional'],
        ['Amount Requested', 'Optional'],
    ],
};
