export const validationPatterns = {
    userId: '^[A-Za-z0-9](?!.*__)[A-Za-z0-9\\,_-]{2}[A-Za-z0-9\\,_-]*$',
    patientId: '^[A-Za-z0-9][A-Za-z0-9\\,_-]*$',
    blockslidetube: '^.{1,25}$',
    number: '^[0-9.]*$',
    collectionYear: '[0-9]{4}|^$',
    
    wellPosition: '[A-Za-z]+[0-9]+|^$',
    micronicTubeBarcode: '^[0-9]{10}$|^[0-9]{6} [0-9]{7} [0-9]{5}$',
    alphanum: '[0-9a-zA-Z]',
    alphanumFour: '[0-9a-zA-Z]{4,}',
    alphanumdash: '^[A-Za-z0-9](?!.*__)[A-Za-z0-9\\,_-]{2}[A-Za-z0-9\\,_-]*$',
    // alphanumdash: '^[a-zA-Z0-9-_]+$',
    cmoId: '^C[-|_].{6}$',
    dmpSampleId: '^P-[0-9]{7}-.{3}-.{3}$',
    dmpPatientId: '^P-[0-9]{7}$',
    mrn: '^[0-9]{8}$',
    groupingId: '[A-Za-z0-9\\,_-]{4,}',
    molecularAccessionNumber: '^(M([1-9]|[1-9][0-9]|100)-)?\\d{3,10}(\\.\\d+)?$'
    // plateId: '^MSK-[A-Za-z0-9\\,_-]{10,}$',
};

export const deprecatedColumns = ['Index Position', 'Sequencing Read Length','Nucleic Acid Type to Extract', 'Nucleic Acid Type to Extract', 'Index Sequence', 'Barcode Position', 'Index Sequence', 'Nucleic Acid Type to Extract'];
export const gridColumns = {
    'Service ID': {
        name: 'Service ID',
        columnHeader: 'Service ID',
        data: 'serviceId',
        pattern: validationPatterns.alphanumdash,
    },
    'Micronic Tube Barcode': {
        name: 'Micronic Tube Barcode',
        container: 'Micronic Barcoded Tubes',
        columnHeader: 'Micronic Tube Barcode',
        data: 'micronicTubeBarcode',
        pattern: validationPatterns.micronicTubeBarcode,
        error: 'Micronic tubes have either a 10-digit OR 6-7-5 digit barcode.',
        tooltip:
            'Micronic tubes have been provided to you in advance by the Sample and Project Management Team. The barcode can be found on the side of the tube or can be read by a reader on the bottom of the tube.',
    },
    'Block/Slide/TubeID': {
        name: 'Block/Slide/TubeID',
        container: 'Blocks/Slides/Tubes',
        columnHeader: 'Block/Slide/TubeID',
        data: 'tubeId',
        pattern: '^.{1,35}$',
        error: 'Only letters, digits and –, please.',
        tooltip:
            'The identifier on your tube, block or slide.  You can paste in directly from excel, and there are no formatting rules.  Please be as correct as possible, and ensure your tubes, blocks and slides are labeled clearly.',
    },
    'Plate ID': {
        name: 'Plate ID',
        columnHeader: 'Plate ID',
        data: 'plateId',
        container: 'Plates',
        // pattern: validationPatterns.plateId,
        // error:
        //   'Only letters, digits and –, please. Must begin with "MSK-" followed by 10 characters.',
        tooltip:
            'The Plate ID is the barcode on the side of your plate, and it begins with MSK-. Please scan or carefully type the barcode into this field for all samples on this plate.',
    },
    'Well Position': {
        name: 'Well Position',
        columnHeader: 'Well Position',
        data: 'wellPosition',
        readOnly: true,
        pattern: validationPatterns.wellPosition,
        tooltip: 'Fill Plate by Column. It must have at least one letter followed by a number',
        error: 'Well Position must have at least one letter followed by a number',
    },
    'Known Genetic Alterations': {
        name: 'Known Genetic Alterations',
        columnHeader: 'Known Genetic Alterations',
        data: 'knownGeneticAlteration',
        pattern: validationPatterns.alphanum,
    },
    'Sample ID': {
        name: 'Sample ID',
        columnHeader: 'Sample ID',
        data: 'userId',
        pattern: validationPatterns.userId,
        tooltip:
            'The Sample ID stays with your sample for its lifetime. Letters, numbers, dashes, and underscores only, three char min. You cannot have more than one underscore consecutively. Cannot contain "sample" or "IGO-". Cannot have preceding zeros.',
        error:
            'Letters, numbers, dashes, and underscores only, three char min. You cannot have more than one underscore consecutively. Cannot contain "sample" or "IGO-". Cannot have preceding zeros.',
        uniqueError: 'Sample ID needs to be unique.',
        containsSampleError: 'Sample ID cannot contain the word "sample" or "IGO-.',
        precedingZerosError: 'Sample ID cannot begin with zeros.',
    },
    Species: {
        name: 'Species',
        columnHeader: 'Species',
        data: 'species',
        readOnly: true,
        tooltip: 'If your species is not available, please contact IGO immediately',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Species',
    },
    'Nucleic Acid Type': {
        name: 'Nucleic Acid Type',
        columnHeader: 'Nucleic Acid Type',
        data: 'nucleicAcidType',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Exemplar+Sample+Types',
    },
    Preservation: {
        name: 'Preservation',
        columnHeader: 'Preservation',
        data: 'preservation',
        tooltip:
            'The preservation method of your material is critical to understanding how to process your samples and anticipate issues.  Please complete as accurately as possible. If your preservation is not listed, please contact IGO',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Preservation',
    },
    'Sample Origin': {
        name: 'Sample Origin',
        columnHeader: 'Sample Origin',
        data: 'sampleOrigin',
        tooltip: 'The sample origin is important for analysis.  Please complete as accurately as possible.',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Sample+Origins',
    },
    'Specimen Type': {
        name: 'Specimen Type',
        columnHeader: 'Specimen Type',
        data: 'specimenType',
        tooltip: 'The specimen type is important for analysis.  Please complete as accurately as possible.',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Specimen+Types',
    },
    // 'Sequencing Read Length': {
    //     name: 'Sequencing Read Length',
    //     columnHeader: 'Sequencing Read Length',
    //     data: 'sequencingReadLength',
    //     tooltip:
    //         'If you are unsure of what read length is needed, please contact your data analyst or IGO.  There are different read lengths for different applications and we are happy to suggest a length. If you do not see your read length listed, please contact IGO immediately',
    //     //  FIXME
    //     editableCellTemplate: 'ui-grid/dropdownEditor',
    //     type: 'autocomplete',
    //     error: 'Only dropdown options are permitted as values',
    //     strict: true,
    //     picklistName: 'Illumina+Sequencing+Run+Types',
    // },
    'Requested Reads': {
        name: 'Requested Reads',
        columnHeader: 'Requested Reads',
        data: 'requestedReads',
        tooltip: 'Please tell us how many reads you would us to generate per sample.',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Sequencing+Reads+Requested',
    },
    'Requested Coverage': {
        name: 'Requested Coverage',
        columnHeader: 'Requested Coverage',
        data: 'requestedCoverage',
        tooltip:
            'Please tell us how much coverage you would like.  If you are submitting pre-made libraries, you must request by lane.  If you are using a custom sequencing primer, you must request an entire flow cell. Please contact IGO if you have any questions',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Sequencing+Coverage+Requested',
    },
    Index: {
        name: 'Index',
        columnHeader: 'Index',
        data: 'index',
        picklistName: 'barcodes',
        pattern: validationPatterns.alphanum,
        error: 'Index ID is not known to IGO.',
        tooltip:
            'Please enter your barcode name or select it from the list, and the sequence will auto-populate in the adjacent field (NOTICE: if your i7 index sequence is taken directly from your reverse PCR primer, then the sequence will be reverse complemented in our database). Examples of valid entries include: TS1, N701-N501, UDI0001, SI-GA-A1, etc. If your barcode name is not in the dropdown, contact IGO to confirm your sequences and have them added to our database if necessary.',
    },
    'Barcode Position': {
        name: 'Barcode Position',
        columnHeader: 'Barcode Position',
        data: 'barcodePosition',
        tooltip:
            'Please let us know what position the barcode is expected to be found.  Standard Illumina Index barcodes are located in position 42-46',
    },
    'Index Sequence': {
        name: 'Index Sequence',
        columnHeader: 'Index Sequence',
        data: 'indexSequence',
        readOnly: true,
        tooltip: 'Actual barcode sequence based on tag you choose display only',
        enableCellEdit: 'false',
    },
 /*  'Nucleic Acid Type to Extract': {
        name: 'Nucleic Acid Type to Extract',
        columnHeader: 'Nucleic Acid Type to Extract',
        data: 'naToExtract',
        tooltip: 'For samples submitted for extraction, please tell us what we should extract out of the material.',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Nucleic+Acid+Type+to+Extract',
        width: 190,
    },  */ 
    'Cell Count': {
        name: 'Cell Count',
        columnHeader: 'Cell Count',
        data: 'cellCount',
        tooltip:
            'Please tell us the number of cells in your sorted population.  This number is important for us to provide you with the best extraction results.',
        pattern: validationPatterns.number,
        error: 'Numbers only, please.',
    },
    'Volume (uL)': {
        name: 'Volume (uL)',
        columnHeader: 'Volume (uL)',
        data: 'vol',
        pattern: validationPatterns.number,
        error: 'Numbers only, please.',
        tooltip:
            'Please provide us with the volume of sample in microliters.  Please note there are different requirements for each application, and if you have any questions, please contact IGO.',
    },
    'Concentration (ng/uL)': {
        name: 'Concentration (ng/uL)',
        columnHeader: 'Concentration (ng/uL)',
        data: 'concentration',
        pattern: validationPatterns.number,
        error: 'Numbers only, please.',
        tooltip: 'You must supply this in nanograms per microliter.  If you are unsure, please provide us with an approximation.',
    },
    Quantity: {
        name: 'Quantity of Tubes',
        columnHeader: 'Quantity of Tubes',
        data: 'numTubes',
        pattern: validationPatterns.number,
        error: 'Numbers only, please.',
        //  "type": "number",
        tooltip:
            'Number of Tubes per sample.  If you are submitting slides, please use this field to tell us how many slides per sample you will submit.',
    },
    'Quantity of Tubes': {
        name: 'Quantity of Tubes',
        columnHeader: 'Quantity of Tubes',
        data: 'numTubes',
        pattern: validationPatterns.number,
        error: 'Numbers only, please.',
        //  "type": "number",
        tooltip:
            'Number of Tubes per sample.  If you are submitting slides, please use this field to tell us how many slides per sample you will submit.',
    },
    'Assay(s)': {
        name: 'Assay(s)',
        columnHeader: 'Assay(s)',
        data: 'assay',
        type: 'dropdown',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        tooltip:
            'This field is multi-select.  If you are submitting one sample for multiple assays, please select the first, followed by the second, than the third, in the order of priority.',
        editableCellTemplate: 'uiMultiSelect',
        picklistName: 'ddPCR+Assay',
        allowInvalid: true,
        allowEmpty: true,
        transformPicklistValues: (values) => values.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    },
    Assay: {
        name: 'Assay(s)',
        columnHeader: 'Assay(s)',
        data: 'assay',
        type: 'dropdown',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        tooltip:
            'This field is multi-select.  If you are submitting one sample for multiple assays, please select the first, followed by the second, than the third, in the order of priority.',
        editableCellTemplate: 'uiMultiSelect',
        picklistName: 'ddPCR+Assay',
        allowInvalid: true,
        allowEmpty: true,
        transformPicklistValues: (values) => values.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    },
    'Estimated % Tumor': {
        name: 'Estimated % Tumor',
        columnHeader: 'Estimated % Tumor',
        data: 'estimatedPurity',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        //  editor select is a simpler version of type dropdown, dropdown needs source instead of selectOptions
        //  "editor": "select",
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        source: ['Normal', '1%', '5%', '10%', '15%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '95%', '100%'],
    },
    'Collection Year': {
        name: 'Collection Year',
        columnHeader: 'Collection Year',
        data: 'collectionYear',
        pattern: validationPatterns.collectionYear,
        error: 'Four digits, please.',
        //  "type": "number",
        tooltip: 'Years only, dates are PHI and are unacceptable',
    },
    'Tumor Type': {
        name: 'Tumor Type',
        columnHeader: 'Tumor Type',
        data: 'cancerType',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only OncoTree Tumor IDs or exact dropdown options are permitted.',
        strict: true,
        picklistName: 'tumorType',
        tooltip: 'Tumor types taken from http://oncotree.info/',
    },
    'Sample Class': {
        name: 'Sample Class',
        columnHeader: 'Sample Class',
        data: 'sampleClass',
        tooltip:
            'Please provide us with detailed information about the Tumor or Normal status, and please be as precise as possible.  This value is critical for data analysis.',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Sample+Class',
    },
    'Tissue Site': {
        name: 'Tissue Site',
        columnHeader: 'Tissue Site',
        data: 'tissueType',
        pattern: validationPatterns.alphanum,
        tooltip: 'Site where tumor removed. If unknown, leave blank.',
    },
    'Patient ID': {
        name: 'Patient ID',
        columnHeader: 'Patient ID',
        data: 'patientId',
        pattern: validationPatterns.alphanumdash,
        tooltip:
            'For non-MSKCC patient samples, mouse samples, or cell lines without patient origin, please use this field to provide us with group names i.e. compare this group (A) with this group (B). For CMO projects, fill out something unique and correspond with your PM for more information.',
    },
    'Normalized Patient Id': {
        name: 'Normalized Patient Id',
        columnHeader: 'Normalized Patient Id',
        data: 'normalizedPatientId',
        // hiddenFrom: 'user',
        readOnly: true,
        tooltip: 'Normalized Patient Id that is sent to CMO service',
    },
    'CMO Patient Id': {
        name: 'CMO Patient Id',
        columnHeader: 'CMO Patient Id',
        data: 'cmoPatientId',
        // hiddenFrom: 'user',
        readOnly: true,
        tooltip: 'CMO anonymized patient id',
    },
    Sex: {
        name: 'Sex',
        columnHeader: 'Sex',
        data: 'gender',
        tooltip:
            'Sex information is important for calling Copy-Number Variations on sex chromosome (X,Y) genes.  Without this information, you may miss important data during analysis.  If you have any questions, please contact Platform Informatics',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        type: 'autocomplete',
        error: 'Only dropdown options are permitted as values',
        strict: true,
        picklistName: 'Gender',
    },
    'Known Genetic Alteration': {
        name: 'Known Genetic Alteration',
        columnHeader: 'Known Genetic Alteration',
        data: 'geneticAlterations',
        pattern: validationPatterns.alphanum,
        tooltip: 'If known, otherwise leave blank.',
        width: 190,
    },
    'Clinical Info': {
        name: 'Clinical Info',
        columnHeader: 'Clinical Info',
        data: 'clinicalInfo',
    },
    'Sample Type': {
        name: 'Sample Type',
        columnHeader: 'Sample Type',
        picklistName: 'Exemplar+Sample+Types',
        type: 'autocomplete',
        data: 'sampleType',
        pattern: validationPatterns.alphanum,
    },
    Recipe: {
        name: 'Recipe',
        columnHeader: 'Recipe',
        picklistName: 'Recipe',
        type: 'autocomplete',
        // optional: "true",
        data: 'recipe',
        //pattern: validationPatterns.alphanum,
    },
    'CMO Sample Type': {
        name: 'CMO Sample Type',
        columnHeader: 'CMO Sample Type',
        // headerCellClass: "optional",
        // optional: "true",
        data: 'specimenType',
        pattern: validationPatterns.alphanum,
    },
    'Spike In Genes': {
        name: 'Spike In Genes',
        columnHeader: 'Spike In Genes',
        // headerCellClass: "optional",
        // optional: "true",
        data: 'spikeInGenes',
        pattern: validationPatterns.alphanum,
    },
    Platform: {
        name: 'Platform',
        columnHeader: 'Platform',
        // headerCellClass: "optional",
        // optional: "true",
        pattern: validationPatterns.alphanum,
        data: 'platform',
    },
    'Number of Amplicons': {
        name: 'Number of Amplicons',
        columnHeader: 'Number of Amplicons',
        pattern: validationPatterns.number,
        data: 'numberOfAmplicons',
        error: 'Numbers only, please.',
        tooltip: 'Please tell us how many amplicons you are requesting per sample.'
    },
    'Row Index': {
        name: 'Row Index',
        columnHeader: 'Row Index',
        data: 'rowIndex'
    },
    'Transaction ID': {
        name: 'Transaction ID',
        columnHeader: 'Transaction ID',
        data: 'transactionId'
    },
    'Capture Panel': {
        name: 'Capture Panel',
        columnHeader: 'Capture Panel',
        data: 'capturePanel'
    }
};

export const formattingAdjustments = {
    MRN: {
        pattern: validationPatterns.mrn,
        columnHeader: 'MRN',
        tooltip: 'The patient MRN.',
        error: 'MRN is incorrectly formatted, please correct, or speak to a project manager if unsure.',
        type: 'text',
    },
    'DMP Patient ID': {
        pattern: validationPatterns.dmpPatientId,
        columnHeader: 'DMP Patient ID',
        tooltip: 'The patient DMP ID.',
        error:
            'DMP ID is incorrectly formatted, please correct, or speak to a project manager if unsure. The usual DMP Patient ID format is P-0000000.',
        type: 'text',
    },
    'CMO Patient ID': {
        pattern: validationPatterns.cmoId,
        columnHeader: 'CMO Patient ID',
        tooltip: 'The patient CMO ID.',
        error:
            'CMO ID is incorrectly formatted, please correct, or speak to a project manager if unsure. A CMO ID looks like this C-A1B2C3.',
        type: 'text',
    },
    'Non-MSK Patients': {
        pattern: validationPatterns.alphanumdash,
        columnHeader: 'Patient ID',
        error:
            'Invalid format. Please use at least four alpha-numeric characters. Dashes and underscores are allowed. Every 8 digit ID is considered a MRN.',
    },
    'Cell Lines, not from Patients': {
        columnHeader: 'Cell Line Name',
        pattern: validationPatterns.alphanumdash,
        error:
            'Invalid format. Please use at least four alpha-numeric characters. Dashes and underscores are allowed. Every 8 digit ID is considered a MRN.',
    },
    'Strain or Line Name': {
        pattern: validationPatterns.userId, // alphanumFour,
        columnHeader: 'Strain or Line Name',
        error: 'Invalid format. Please use at least four alpha-numeric characters. Every 8 digit ID is considered a MRN.',
    },
    'Grouping ID': {
        pattern: validationPatterns.groupingId,
        columnHeader: 'Grouping ID',
        error: 'Invalid format. Please use at least four alpha-numeric characters. Every 8 digit ID is considered a MRN.',
    },
};
export const submissionColumns = {
    'Service ID': {
        name: 'Service ID',
        data: 'serviceId',
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
    'Submitted to IGO?': {
        name: 'Submitted to IGO?',
        data: 'submitted',
        readOnly: 'true',
        renderer: 'html',
    },
    // 'DMP Tracking ID': {
    //     name: 'DMP Tracking ID',
    //     data: 'dmpTrackingId',
    //     readOnly: 'true',
    // },
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
};
export const promoteSelect = {
    name: 'Select',
    columnHeader: '',
    className: 'htCenter htMiddle',
    readOnly: false,
    type: 'checkbox',
    data: 'select',
};
export const formColumns = {
    sharedWith: {
        data: 'sharedWith',
        columnHeader: 'Submission Shared With',
    },
    groupingChecked: {
        data: 'groupingChecked',
        columnHeader: 'Is Grouping',
    },
    application: {
        data: 'application',
        columnHeader: 'Application',
    },
    material: {
        data: 'material',
        columnHeader: 'Material',
    },
    serviceId: {
        data: 'serviceId',
        columnHeader: 'Service Id',
    },
    numberOfSamples: {
        data: 'numberOfSamples',
        columnHeader: '#Samples',
    },
    species: {
        data: 'species',
        columnHeader: 'Species',
    },
    container: {
        data: 'container',
        columnHeader: 'Container',
    },
    patientIdType: {
        data: 'patientIdType',
        columnHeader: 'Patient ID Type',
    },
    sequencingReadLength: {
        data: 'sequencingReadLength',
        columnHeader: 'Sequencing Read Length',
    },
    // altServiceId: {
    //     data: 'altServiceId',
    //     columnHeader: 'Alt. Service ID',
    // },
};

export const noShowColumns = ['_id', 'groupingChecked', 'cmoPatientId', 'normalizedPatientId'];

export const noShowEmptyColumns = ['patientIdType', 'sharedWith'];

