const validationPatterns = {
  userId: '^[A-Za-z0-9](?!.*__)[A-Za-z0-9\\,_-]{2}[A-Za-z0-9\\,_-]*$',
  patientId: '^[A-Za-z0-9][A-Za-z0-9\\,_-]*$',
  blockslidetube: '^.{1,25}$',
  number: '^[0-9.]*$',
  collectionYear: 'd{4}|^$',
  wellPosition: '[A-Za-z]+d+|^$',
  micronicTubeBarcode: '^[0-9]{10}$',
  alphanum: '[0-9a-zA-Z]',
  alphanumdash: '^[A-Za-z0-9](?!.*__)[A-Za-z0-9\\,_-]{2}[A-Za-z0-9\\,_-]*$',
  // "mskPatients": "d{8}",
  // "nonMSKPatients": "[0-9a-zA-Z]{4,}",
  // "bothMSKAndNonMSKPatients": "[0-9a-zA-Z]{4,}|d{8}",
};

export const deprecatedColumns = ['Index Position'];
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
    error: 'Micronic tubes have a ten digit barcode.',
    tooltip:
      'The Micronic Tube Barcode has been provided to you in advance by the sample receiving team.  If you cannot find it, the Micronic Tube Barcode is located on the side of the tube, and the 2D barcode can be scanned by a reade',
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
    pattern: validationPatterns.userId,
    error: 'Only letters, digits and –, please. 2 char minimum.',
    tooltip:
      'The plate ID is the barcode on your plate.  Please scan, or carefully type, the barcode ID into this field for all samples on the plate',
  },
  'Well Position': {
    name: 'Well Position',
    columnHeader: 'Well Position',
    data: 'wellPosition',
    readOnly: true,
    pattern: 'wellPosition',
    tooltip:
      'Fill Plate by Column. It must have at least one letter followed by a number',
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
      'The Sample ID stays with your sample for its lifetime. Letters, numbers, dashes, and underscores only, three char min. You cannot have more than one underscore consecutively.',
    error:
      'Letters, numbers, dashes, and underscores only, three char min. You cannot have more than one underscore consecutively.',
    uniqueError: 'Sample ID needs to be unique.',
    containsSampleError: 'Sample ID cannot contain the word "sample".',
  },
  Species: {
    name: 'Species',
    columnHeader: 'Species',
    data: 'organism',
    readOnly: true,
    tooltip: 'If your species is not available, please contact IGO immediately',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
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
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
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
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
    type: 'autocomplete',
    error: 'Only dropdown options are permitted as values',
    strict: true,
    picklistName: 'Preservation',
  },
  'Sample Origin': {
    name: 'Sample Origin',
    columnHeader: 'Sample Origin',
    data: 'sampleOrigin',
    tooltip:
      'The sample origin is important for analysis.  Please complete as accurately as possible.',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
    type: 'autocomplete',
    error: 'Only dropdown options are permitted as values',
    strict: true,
    picklistName: 'Sample+Origins',
  },
  'Specimen Type': {
    name: 'Specimen Type',
    columnHeader: 'Specimen Type',
    data: 'specimenType',
    tooltip:
      'The specimen type is important for analysis.  Please complete as accurately as possible.',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
    type: 'autocomplete',
    error: 'Only dropdown options are permitted as values',
    strict: true,
    picklistName: 'Specimen+Types',
  },
  'Sequencing Read Length': {
    name: 'Sequencing Read Length',
    columnHeader: 'Sequencing Read Length',
    data: 'sequencingReadLength',
    tooltip:
      'If you are unsure of what read length is needed, please contact your data analyst or IGO.  There are different read lengths for different applications and we are happy to suggest a length. If you do not see your read length listed, please contact IGO immediately',
    //  FIXME
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
    type: 'autocomplete',
    error: 'Only dropdown options are permitted as values',
    strict: true,
    picklistName: 'Illumina+Sequencing+Run+Types',
  },
  'Reads Requested/Coverage': {
    name: 'Reads Requested/Coverage',
    columnHeader: 'Reads Requested/Coverage',
    data: 'requestedReads',
    tooltip:
      'Please tell us how many reads you would us to generate per sample.  If you are submitting for custom capture or whole exome capture, please tell us how much coverage you would like.  If you are submitting pre-made libraries, you must request by lane.  If you are using a custom sequencing primer, you must request an entire flow cell. Please contact IGO if you have any questions',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
    type: 'autocomplete',
    error: 'Only dropdown options are permitted as values',
    strict: true,
    picklistName: 'Sequencing+Reads+Requested',
  },
  Index: {
    name: 'Index',
    columnHeader: 'Index',
    data: 'index',
    picklistName: 'barcodes',
    pattern: validationPatterns.alphanum,
    error: 'Index ID is not known to IGO.',
    tooltip:
      'This list represents barcodes that are already registered with IGO.  Please select from the list.  If you are submitting custom barcodes, you must pre-register them with IGO, and confirm your design and construct in advance.  Once you have identified the barcode by name, the sequence will appear in the adjacent field.  Please confirm that the sequence is expected based on your documentation.',
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
  'Nucleic Acid Type to Extract': {
    name: 'Nucleic Acid Type to Extract',
    columnHeader: 'Nucleic Acid Type to Extract',
    data: 'naToExtract',
    tooltip:
      'For samples submitted for extraction, please tell us what we should extract out of the material.',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
    type: 'autocomplete',
    error: 'Only dropdown options are permitted as values',
    strict: true,
    picklistName: 'Nucleic+Acid+Type+to+Extract',
    width: 190,
  },
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
    tooltip:
      'You must supply this in nanograms per microliter.  If you are unsure, please provide us with an approximation.',
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
    source: [
      'Normal',
      '1%',
      '5%',
      '10%',
      '15%',
      '20%',
      '30%',
      '40%',
      '50%',
      '60%',
      '70%',
      '80%',
      '90%',
      '95%',
      '100%',
    ],
  },
  'Collection Year': {
    name: 'Collection Year',
    columnHeader: 'Collection Year',
    data: 'collectionYear',
    pattern: 'collectionYear',
    error: 'Four digits, please.',
    //  "type": "number",
    tooltip: 'Years only, dates are PHI and are unacceptable',
  },
  'Tumor Type': {
    name: 'Tumor Type',
    columnHeader: 'Tumor Type',
    data: 'cancerType',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
    type: 'autocomplete',
    error: 'Only OncoTree Tumor IDs or exact dropdown options are permitted.',
    strict: true,
    picklistName: 'tumorType',
  },
  'Sample Class': {
    name: 'Sample Class',
    columnHeader: 'Sample Class',
    data: 'sampleClass',
    tooltip:
      'Please provide us with detailed information about the Tumor or Normal status, and please be as precise as possible.  This value is critical for data analysis.',
    editableCellTemplate: 'ui-grid/dropdownEditor',
    //  editor select is a simpler version of type dropdown
    //  "editor": "select",
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
    hiddenFrom: 'user',
    readOnly: true,
    tooltip: 'Normalized Patient Id that is sent to CMO service',
  },
  'CMO Patient Id': {
    name: 'CMO Patient Id',
    columnHeader: 'CMO Patient Id',
    data: 'cmoPatientId',
    hiddenFrom: 'user',
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
    pattern: validationPatterns.alphanum,
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
};

export const formattingAdjustments = {
  MRN: {
    pattern: '^[0-9]{8}$',
    columnHeader: 'MRN',
    tooltip: 'The patient MRN.',
    error:
      'MRN is incorrectly formatted, please correct, or speak to a project manager if unsure.',
    type: 'text',
  },
  'DMP ID': {
    pattern: '*',
    columnHeader: 'DMP ID',
    tooltip: 'The patient DMP ID.',
    error:
      'DMP ID is incorrectly formatted, please correct, or speak to a project manager if unsure. The usual DMP ID format is P-0000000-A00-ABC.',
    type: 'text',
  },
  'CMO ID': {
    pattern: '*',
    columnHeader: 'CMO ID',
    tooltip: 'The patient CMO ID.',
    error:
      'CMO ID is incorrectly formatted, please correct, or speak to a project manager if unsure. The usual DMP ID format is C-A1B2C3 or C-A1B2C3.',
    type: 'text',
  },
  'Non-MSK Patients': {
    pattern: '[A-Za-z0-9\\,_-]{4,}',
    columnHeader: 'Patient ID',
    error:
      'Invalid format. Please use at least four alpha-numeric characters. Dashes and underscores are allowed. Every 8 digit ID is considered a MRN.',
  },
  'Cell Lines, not from Patients': {
    columnHeader: 'Cell Line Name',
  },
  'Strain or Line Name': {
    pattern: '[0-9a-zA-Z]{4,}',
    columnHeader: 'Strain or Line Name',
    error:
      'Invalid format. Please use at least four alpha-numeric characters. Every 8 digit ID is considered a MRN.',
  },
  'Grouping ID': {
    pattern: '[A-Za-z0-9\\,_-]{4,}',
    columnHeader: 'Grouping ID',
    error:
      'Invalid format. Please use at least four alpha-numeric characters. Every 8 digit ID is considered a MRN.',
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
  altServiceId: {
    data: 'altServiceId',
    columnHeader: 'Alt. Service ID',
  },
};

export const noShowColumns = [
  'rowIndex',
  '_id',
  'altServiceId',
  'groupingChecked',
  'cmoPatientId',
  'normalizedPatientId',
];

export const noShowEmptyColumns = ['patientIdType', 'sharedWith'];

export const dmpColumns = {
  'Tracking ID': {
    name: 'Tracking ID',
    columnHeader: 'Tracking ID',
    data: 'dmpTrackingId',
    pattern: validationPatterns.alphanumdash,
  },
  'Molecular Pathology Accession Number': {
    name: 'Molecular Pathology Accession Number',
    columnHeader: 'Molecular Pathology Accession Number',
    data: 'molecularPathologyAccsessionNumber',
    pattern: validationPatterns.alphanumdash,
    error: 'Only letters, digits and –, please.',
  },
  'DMP Sample ID': {
    name: 'DMP Sample ID',
    columnHeader: 'DMP Sample ID',
    data: 'dmpSampleId',
    pattern: '^.{1,35}$',
    error: 'Must follow standard DMP nomenclature.',
    sendToDmp: true,
  },

  'Investigator Patient ID (Study Subject Identifier)': {
    name: 'Investigator Patient ID (Study Subject Identifier)',
    columnHeader: 'Investigator Patient ID (Study Subject Identifier)',
    data: 'studySubjectIdentifier',
    pattern: validationPatterns.alphanumdash,
    error: 'Only letters, digits and –, please.',
  },

  'Investigator Sample ID (Study Sample Identifier)': {
    name: 'Investigator Sample ID (Study Sample Identifier)',
    columnHeader: 'Investigator Sample ID (Study Sample Identifier)',
    data: 'userId',
    pattern: validationPatterns.alphanumdash,
    error: 'Only letters, digits and –, please.',
  },

  'Sample Type': {
    name: 'Sample Type',
    columnHeader: 'Sample Type',
    picklistName: 'DmpSampleTypes',
    type: 'autocomplete',
    data: 'sampleType',
    error: 'Only dropdown options are permitted as values',
    sendToDmp: true,
  },

  'Specimen Type': {
    name: 'Specimen Type',
    columnHeader: 'Specimen Type',
    picklistName: 'DmpSpecimenTypes',
    type: 'autocomplete',
    data: 'sampleType',
    error: 'Only dropdown options are permitted as values',
    sendToDmp: true,
  },
  'Project PI': {
    name: 'Project PI',
    columnHeader: 'Project PI',
    data: 'projectPi',
    pattern: validationPatterns.alphanum,
    error: 'Only letters, digits and –, please.',
    sendToDmp: true,
  },

  'Project Title': {
    name: 'Project Title',
    columnHeader: 'Project Title',
    data: 'projectTitle',
    pattern: validationPatterns.alphanum,
    error: 'Only letters, digits and –, please.',
    sendToDmp: true,
  },

  'Gene and Mutation': {
    name: 'Gene and Mutation',
    columnHeader: 'Gene and Mutation',
    data: 'projectTitle',
    pattern: validationPatterns.alphanum,
    error: 'Only letters, digits and –, please.',
  },

  'DMP to Transfer': {
    name: 'DMP to Transfer',
    columnHeader: 'DMP to Transfer',
    type: 'checkbox',
    data: 'dmpToTransfer',
    hiddenFrom: 'user',
    sendToDmp: true,
  },

  'Sample Approved by CMO': {
    name: 'Sample Approved by CMO',
    columnHeader: 'Sample Approved by CMO',
    picklistName: 'DmpCmoSampleApproval',
    type: 'autocomplete',
    data: 'sampleApprovedByCmo',
    error: 'Only dropdown options are permitted as values',
    hiddenFrom: 'user',
    sendToDmp: true,
  },

  'Variant Allele Frequency': {
    name: 'Variant Allele Frequency',
    columnHeader: 'Variant Allele Frequency',

    data: 'variantAlleleFrequency',
    hiddenFrom: 'user',
  },
  Coverage: {
    name: 'Coverage',
    columnHeader: 'Coverage',
    picklistName: 'DmpCmoSampleApproval',
    type: 'autocomplete',
    data: 'requestedReads',
    error: 'Only dropdown options are permitted as values',
    hiddenFrom: 'user',
  },

  'Investigator Patient ID (Investigator Provided Study Subject Identifier)': {
    name:
      'Investigator Patient ID (Investigator Provided Study Subject Identifier)',
    columnHeader:
      'Investigator Patient ID (Investigator Provided Study Subject Identifier)',
    data: 'patientId',
    pattern: validationPatterns.alphanumdash,
    error: 'Only letters, digits and –, please.',
  },

  'Investigator Sample ID (Investigator Provided Study Sample Identifier)': {
    name:
      'Investigator Sample ID (Investigator Provided Study Sample Identifier)',
    columnHeader:
      'Investigator Sample ID (Investigator Provided Study Sample Identifier)',
    data: 'userId',
    pattern: validationPatterns.alphanumdash,
    error: 'Only letters, digits and –, please.',
  },

  'Additional Info': {
    name: 'Additional Info',
    columnHeader: 'Additional Info',
    data: 'additionalInfo',
  },
};
