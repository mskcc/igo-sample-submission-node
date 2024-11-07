export const initialFormStateMock = {
    allContainers: [],
    allApplications: [],
    allMaterials: [],
    allPatientIdFormats: [],
    filteredApplications: [],
    filteredContainers: [],
    formIsLoading: true,
    initialFetched: false,
    speciesList:[],
    

    filteredMaterials: [],
    picklists: {},

    allSpecies: [],
    filteredSpecies: [],

    selected: {
        application: '',
        material: '',
        service_id: '',
        number_of_samples: '',
        species: '',
        container: '',
        patient_id_type: '',
        grouping_checked: false,
        alt_service_id: false,
    },
};

export const initialGridStateMock = {
    columns: [],
    rows: [],
    error: '',
    form: [],
    gridIsLoading: false,
    nothingToChange: false,
};

export const filledGridStateMock = {
    upload: {
        grid: {
            columns: ['Block/Slide/TubeID', 'Sample ID'],
            rows: [
                { tubeId: '', userId: '' },
                { tubeId: '', userId: '' },
                { tubeId: '', userId: '' },
                { tubeId: '', userId: '' },
            ],
            error: '',
            form: {
                application: 'AmpliSeq',
                material: 'DNA',
                service_id: '898989',
                number_of_samples: '5',
                species: 'Mouse',
                container: 'Plates',
                patient_id_type: '',
                grouping_checked: false,
                alt_service_id: false,
            },
            gridIsLoading: false,
            nothingToChange: false,
            columnFeatures: [
                {
                    columnHeader: 'Block/Slide/TubeID',
                    data: 'tubeId',
                },
                {
                    columnHeader: 'Sample ID',
                    data: 'userId',
                },
            ],
        },
    },
};

export const initialFullStateMock = {
    upload: {
        form: {
            initialFetched: false,
            allContainers: [{ id: 'test', value: 'test' }],
            allApplications: [{ id: 'test', value: 'test' }],
            allMaterials: [{ id: 'test', value: 'test' }],
            allPatientIdFormats: [{ id: 'test', value: 'test' }],
            filteredApplications: [{ id: 'test', value: 'test' }],
            filteredMaterials: [{ id: 'test', value: 'test' }],
            formIsLoading: false,
            filteredContainers: [
                { id: 'Plates', value: 'Plates' },
                { id: 'Micronic Barcoded Tubes', value: 'Micronic Barcoded Tubes' },
            ],

            allSpecies: [{ id: 'test', value: 'test' }],
            filteredSpecies: [{ id: 'test', value: 'test' }],
            selected: {
                application: '',
                material: '',
                service_id: '',
                number_of_samples: '',
                species: '',
                container: '',
                patient_id_type: '',
                grouping_checked: false,
                alt_service_id: false,
            },
        },
        grid: {
            columns: [],
            rows: [],
            gridError: '',
            form: [],
            gridIsLoading: false,
            isSaving: false,
            nothingToChange: false,
        },
    },
    common: {
        version: '2.0',
        loggedIn: false,
        username: '',
        error: null,
        message: '',
        loading: true,
    },
    user: {
        submissions: {},
        username: '',
        loading: false,
        loggedIn: false,
        saved: false,
        submissionsTable: {},
        isSaving: false,
        role: '',
    },
};

export const filledFullStateMock = {
    upload: {
        form: {
            initialFetched: false,
            allContainers: [{ id: 'test', value: 'test' }],
            allApplications: [{ id: 'test', value: 'test' }],
            allMaterials: [{ id: 'test', value: 'test' }],
            allPatientIdFormats: [{ id: 'test', value: 'test' }],
            filteredApplications: [{ id: 'test', value: 'test' }],
            filteredMaterials: [{ id: 'test', value: 'test' }],
            formIsLoading: false,
            filteredContainers: [
                { id: 'Plates', value: 'Plates' },
                { id: 'Micronic Barcoded Tubes', value: 'Micronic Barcoded Tubes' },
            ],

            allSpecies: [{ id: 'test', value: 'test' }],
            filteredSpecies: [{ id: 'test', value: 'test' }],
            selected: {
                application: '',
                material: '',
                service_id: '',
                number_of_samples: '',
                species: '',
                container: '',
                patient_id_type: '',
                grouping_checked: false,
                alt_service_id: false,
            },
        },
        grid: {
            columns: ['Block/Slide/TubeID', 'Sample ID'],
            rows: [
                { tubeId: '', userId: '' },
                { tubeId: '', userId: '' },
            ],
            error: '',
            form: {
                material: 'Tissue',
                application: 'CustomCapture',
                service_id: '444444',
                number_of_samples: '4',
                species: 'Tuberculosis',
                container: 'Plates',
                patient_id_type: '',
            },
            gridIsLoading: false,
            nothingToChange: false,
            columnFeatures: [
                {
                    columnHeader: 'Block/Slide/TubeID',
                    data: 'tubeId',

                    name: 'Block/Slide/TubeID',
                },
                {
                    columnHeader: 'Sample ID',
                    data: 'userId',
                },
            ],
        },
    },
    common: {
        version: '2.0',
        loggedIn: false,
        username: '',
        error: null,
        message: '',
        loading: true,
    },

    user: {
        submissions: {},
        username: '',
        loading: false,
        loggedIn: false,
        role: '',
        saved: false,
        submissionsTable: {},
        isSaving: false,
    },
};

export const formValuesMock = {
    application: 'AmpliSeq',
    material: 'DNA',
    service_id: '898989',
    number_of_samples: '2',
    species: 'Mouse',
    container: 'Plates',
    patient_id_type: '',
    grouping_checked: false,
    alt_service_id: false,
};

export const columnDefsResponseMock = {
    columnDefs: [
        {
            columnHeader: 'Block/Slide/TubeID',
            data: 'tubeId',
            error: 'Invalid format.',
            editableCellTemplate:
                '<div><form name="inputForm"><input class="form-control inputheight" type="INPUT_TYPE" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-paste="grid.appScope.handleCellPaste($event)"></form></div>',
            headerCellClass: 'required',
            tooltip:
                'The identifier on your tube, block or slide.  You can paste in directly from excel, and there are no formatting rules.  Please be as correct as possible, and ensure your tubes, blocks and slides are labeled clearly.',
            name: 'Block/Slide/TubeID',
        },
        {
            columnHeader: 'Sample ID',
            data: 'userId',
            error: 'Invalid format.',
            editableCellTemplate:
                '<div><form name="inputForm"><input class="form-control inputheight" type="INPUT_TYPE" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-paste="grid.appScope.handleCellPaste($event)"></form></div>',
            headerCellClass: 'required',
            tooltip:
                'The Sample ID stays with your sample for its lifetime. Letters, numbers, dashes, and underscores only, three char min. You cannot have more than one underscore consecutively.',
            name: 'Sample ID',
        },
        {
            columnHeader: 'Species',
            allowInvalid: false,
            data: 'organism',
            error: 'Invalid format.',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            headerCellClass: 'required',
            tooltip: 'If your species is not available, please contact IGO immediately',
            name: 'Species',
            picklistName: 'Species',
            source: [
                { id: 'Human', value: 'Human' },
                { id: 'Mouse', value: 'Mouse' },
                { id: 'Mouse_GeneticallyModified', value: 'Mouse_GeneticallyModified' },
                { id: 'Drosophilia', value: 'Drosophilia' },
                { id: 'Zebrafish', value: 'Zebrafish' },
                { id: 'Chicken', value: 'Chicken' },
                { id: 'Bacteria', value: 'Bacteria' },
                { id: 'S.Cerevisae', value: 'S.Cerevisae' },
                { id: 'Tuberculosis', value: 'Tuberculosis' },
                { id: 'E.Coli ', value: 'E.Coli ' },
                { id: 'C.Elegans', value: 'C.Elegans' },
                { id: 'S.Pombe', value: 'S.Pombe' },
                { id: 'R.norvegicus', value: 'R.norvegicus' },
                { id: 'R.rattus', value: 'R.rattus' },
                { id: 'Plasmid', value: 'Plasmid' },
                { id: 'Archaea', value: 'Archaea' },
                { id: 'other', value: 'other' },
            ],
            type: 'dropdown',
            trimDropdown: false,
        },
    ],
};

export const gridMock = {
    // form: {
    //   application: 'AmpliSeq',
    //   material: 'DNA',
    //   service_id: '898989',
    //   number_of_samples: '10',
    //   species: 'Mouse',
    //   container: 'Plates',
    //   patient_id_type: '',
    //   grouping_checked: false,
    //   alt_service_id: false,
    // },
    hiddenColumns: [],
    columnFeatures: [
        {
            columnHeader: 'Block/Slide/TubeID',

            data: 'tubeId',
            error: 'Invalid format.',
            editableCellTemplate:
                '<div><form name="inputForm"><input class="form-control inputheight" type="INPUT_TYPE" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-paste="grid.appScope.handleCellPaste($event)"></form></div>',
            headerCellClass: 'required',
            tooltip:
                'The identifier on your tube, block or slide.  You can paste in directly from excel, and there are no formatting rules.  Please be as correct as possible, and ensure your tubes, blocks and slides are labeled clearly.',
            name: 'Block/Slide/TubeID',
        },
        {
            columnHeader: 'Sample ID',

            data: 'userId',
            error: 'Invalid format.',
            editableCellTemplate:
                '<div><form name="inputForm"><input class="form-control inputheight" type="INPUT_TYPE" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ng-paste="grid.appScope.handleCellPaste($event)"></form></div>',
            headerCellClass: 'required',
            tooltip:
                'The Sample ID stays with your sample for its lifetime. Letters, numbers, dashes, and underscores only, three char min. You cannot have more than one underscore consecutively.',
            name: 'Sample ID',
        },
        {
            columnHeader: 'Species',
            allowInvalid: false,
            allowInvalid: false,
            data: 'organism',
            error: 'Invalid format.',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            headerCellClass: 'required',
            tooltip: 'If your species is not available, please contact IGO immediately',
            name: 'Species',
            picklistName: 'Species',
            source: [
                'Human',
                'Mouse',
                'Mouse_GeneticallyModified',
                'Drosophilia',
                'Zebrafish',
                'Chicken',
                'Bacteria',
                'S.Cerevisae',
                'Tuberculosis',
                'E.Coli ',
                'C.Elegans',
                'S.Pombe',
                'R.norvegicus',
                'R.rattus',
                'Plasmid',
                'Archaea',
                'other',
            ],
            type: 'dropdown',
            trimDropdown: false,
        },
    ],
    columnHeaders: [
        '<span class="undefined" title="The identifier on your tube, block or slide.  You can paste in directly from excel, and there are no formatting rules.  Please be as correct as possible, and ensure your tubes, blocks and slides are labeled clearly.">Block/Slide/TubeID</span>',
        '<span class="undefined" title="The Sample ID stays with your sample for its lifetime. Letters, numbers, dashes, and underscores only, three char min. You cannot have more than one underscore consecutively.">Sample ID</span>',
        '<span class="undefined" title="If your species is not available, please contact IGO immediately">Species</span>',
    ],
    rows: [
        {
            tubeId: '',
            userId: '',
            organism: 'Mouse',
        },
        {
            tubeId: '',
            userId: '',
            organism: 'Mouse',
        },
    ],
};
