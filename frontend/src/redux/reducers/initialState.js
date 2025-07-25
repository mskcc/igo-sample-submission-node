export const initialFormState = {
    allContainers: [],
    allApplications: [],
    allMaterials: [],
    allPatientIdFormats: [],
    filteredApplications: [],
    filteredContainers: [],
    formIsLoading: false,
    initialFetched: false,
    filteredMaterials: [],
    patientIdTypes: [],
    patientIdTypesSpecified: [],
    readLengths: [],
    allSpecies: [],
    filteredSpecies: [],

    selected: {
        application: '',
        capturePanel: '',
        material: '',
        serviceId: '',
        numberOfSamples: '',
        species: '',
        container: '',
        patientIdType: '',
        patientIdTypeSpecified: '',
        groupingChecked: false,
        // altServiceId: false,
        isShared: false,
        sharedWith: '',
        sequencingReadLength: '',
        nucleicAcidTypeToExtract: '',
    },
    // selected: {
    //   application: 'MouseWholeGenome',
    //   material: 'DNA',
    //   serviceId: '898989',
    //   numberOfSamples: '10',
    //   species: 'Mouse',
    //   container: 'Plates',
    //   patientIdType: 'MSK Patients',
    //   groupingChecked: false,
    //   altServiceId: false,
    //   isShared: false,
    //   sharedWith: "",
    // },
    // selected: {
    //   application: 'AmpliSeq',
    //   material: 'DNA',
    //   serviceId: '898989',
    //   numberOfSamples: '10',
    //   species: 'Mouse',
    //   container: 'Plates',
    //   patientIdType: '',
    //   groupingChecked: false,
    //   altServiceId: false,
    // },
    // selected: {
    //   application: '',
    //   material: '',
    //   serviceId: '',
    //   numberOfSamples: '',
    //   species: '',
    //   container: '',
    //   patientIdType: '',
    //   groupingChecked: false,
    //   altServiceId: false,
    // },
};

export const initialGridState = {
    gridType: '',
    columnFeatures: [],
    columnHeaders: [],
    rows: [],
    gridError: '',
    form: [],
    gridIsLoading: false,
    isSaving: false,
    nothingToChange: false,
    validation: { message: [], affectedRows: [], emptyRows: [] },
};

export const initialPromoteState = {
    columnHeaders: [],
    rows: [],
    initialFetched: false,
};

export const initialDmpFormState = {
    applications: [],
    materials: [],
    formIsLoading: false,
    initialFetched: false,
    picklists: {},

    selected: {
        application: '',
        capturePanel: '',
        material: '',
        numberOfSamples: '',
        isShared: false,
        sharedWith: '',
        serviceId: '',
    },
};



