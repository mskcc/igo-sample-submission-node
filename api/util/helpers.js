import CacheService from "./cache";
import axios from "axios";
const service = require("../services/services");
var _ = require('lodash');
const { constants } = require("./constants");
const { gridColumns, submissionColumns } = require("./columns");
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance
const LIMS_AUTH = {
    username: process.env.LIMS_USER,
    password: process.env.LIMS_PASSWORD
};
const LIMS_URL = process.env.LIMS_URL;

exports.determineRole = groups => {
    if (groups.includes(process.env.LAB_GROUP)) return "lab_member";
    if (groups.includes(process.env.PM_GROUP)) return "project_manager";
    else return "user";
};

exports.createSharedString = (shared, username) => {
    let sharedSet = new Set()
    let sharedArray = shared.split(",")
  
    sharedSet.add(...sharedArray)
    sharedSet.add(`${username}@mskcc.org`)
  
    return Array.from(sharedSet).join(",")

  
}

exports.getContainers = material => {
    if (material in constants.containersByMaterial) {
        return constants.containersByMaterial[material];
    } else return [];
};

exports.getSpecies = recipe => {
    if (constants.humanApplications.includes(recipe.toLowerCase()))
        return ["Human"];
    if (constants.mouseApplications.includes(recipe.toLowerCase()))
        return ["Mouse"];
    if (constants.humanOrMouseApplications.includes(recipe.toLowerCase()))
        return ["Human", "Mouse"];
    else {
        return [];
    }
};

function cacheAllPicklists(limsColumns) {
    return new Promise((resolve, reject) => {
        let picklistPromises = []
        let picklists = {}
        limsColumns.map((element) => {
            if (!gridColumns[element[0]]) {
                reject(`Column '${element[0]}' not found.`)
            }
            let picklist = gridColumns[element[0]].picklistName

            if (picklist != undefined) {
                picklists[picklist] = []
                if (picklist === "tumorType") {
                    picklistPromises.push(cache.get(picklist + "-Picklist", () => service.getOnco()))

                } else { picklistPromises.push(cache.get(picklist + "-Picklist", () => service.getPicklist(picklist))) }
            }
        })
        Promise.all(picklistPromises).then((results) => {
            if (results.some(x => x.length == 0)) {
                reject(`Could not cache picklists.`)
            }
            Object.keys(picklists).map((element, index) => { picklists[element] = results[index] })
            resolve(picklists)
        })
    })

}


export function generateGrid(limsColumnList, userRole, formValues) {

    return new Promise((resolve, reject) => {

        cacheAllPicklists(limsColumnList)
            .then((picklists) => fillColumns(limsColumnList, userRole, formValues, picklists))
            .then((columns) => fillData(columns, formValues)).catch((reasons) => reject(reasons))
            .then((columns) => {
                if (columns.columnFeatures.some((x) => x.data == "wellPosition")) {
                    resolve(setWellPos(columns))
                } else { resolve(columns) }
            })
            .catch((reasons) => reject(reasons))
    })
}

function fillColumns(limsColumnList, userRole, formValues, picklists) {
    return new Promise((resolve, reject) => {
        let result = {
            columnFeatures: [],
            rowData: [],
            columnHeaders: [],
            hiddenColumns: []
        };
        limsColumnList.forEach((element, index) => {
            let columnName = element[0]
            let colDef = gridColumns[columnName];
            if (!colDef) {
                reject(`Column '${columnName}' not found.`)
            }
            if (colDef.container && colDef.container !== formValues.container && formValues.application != 'Expanded_Genomics'
            ) {
                colDef = overwriteContainer(formValues.container)
            }

            if (colDef.data == 'patientId') {
                let formattingAdjustments = choosePatientIdValidator(
                    formValues.patientIdType,
                    formValues.species,
                    formValues.groupingChecked
                )
                colDef = { ...colDef, ...formattingAdjustments }
            }
            if (colDef.picklistName && !colDef.source) {
                colDef.source = picklists[colDef.picklistName];
            }

            colDef.error = colDef.error ? colDef.error : 'Invalid format.'
            result.columnFeatures.push(colDef);
            if (colDef.hiddenFrom && colDef.hiddenFrom === userRole) {
                result.hiddenColumns.push(
                    result.columnFeatures.length
                );
            }

            if (index == limsColumnList.length - 1) {
                // if plate column present but not WellPos, add WellPos
                if (
                    result.columnFeatures[0].data == 'plateId' &&
                    result.columnFeatures[1].data != 'wellPosition'
                ) {
                    result.columnFeatures.unshift(gridColumns["Well Position"])
                }
                // if plate column not present but WellPos is, remove WellPos
                if (
                    formValues.container != 'Plates' &&
                    result.columnFeatures[1].data == 'wellPosition'
                ) {
                    result.columnFeatures[1] = result.columnFeatures[0]
                    result.columnFeatures.shift()
                }
                result.columnHeaders = result.columnFeatures.map(
                    a =>
                        '<span class="' +
                        a.className +
                        '" title="' +
                        a.tooltip +
                        '">' +
                        a.columnHeader +
                        '</span>'
                )
                resolve(result)
            }
        })

    })
}


// if lims returned a container type is different from the container the user indicated, chose the user one
const overwriteContainer = (userContainer) => {
    let newContainer
    switch (userContainer) {
        case 'Plates':
            newContainer = gridColumns["Plate ID"]
            break
        case 'Micronic Barcoded Tubes':
            newContainer = gridColumns["Micronic Tube Barcode"]
            break
        case 'Blocks/Slides/Tubes':
            newContainer = gridColumns["Block/Slide/TubeID"]
            break
        default:
            return (`Container '${userContainer}' not found.`)
    }
    return (newContainer)
}



// Lots of autofilling happening here
const fillData = (columns, formValues) => {

    return new Promise((resolve, reject) => {
        let rowData = [];
        let numberOfRows = formValues.numberOfSamples;
        for (var i = 0; i < numberOfRows; i++) {

            columns.columnFeatures.map((entry) => {
                rowData[i] = { ...rowData[i], [entry.data]: "" };
                if (
                    entry.data == "species" ||
                    entry.data == "organism"
                ) {
                    rowData[i] = {
                        ...rowData[i],
                        organism: formValues.species
                    };
                }
                if (entry.data == "preservation") {
                    if (formValues.material == "Blood") {
                        rowData[i] = {
                            ...rowData[i],
                            preservation: "EDTA-Streck"
                        };
                    } else if (formValues.material == "Buffy Coat") {
                        rowData[i] = {
                            ...rowData[i],
                            preservation: "Frozen"
                        };
                    }
                }
                if (entry.data == "sampleOrigin") {
                    if (formValues.material == "Blood") {
                        rowData[i] = {
                            ...rowData[i],
                            sampleOrigin: "Whole Blood"
                        };
                    } else if (formValues.material == "Buffy Coat") {
                        rowData[i] = {
                            ...rowData[i],
                            sampleOrigin: "Buffy Coat"
                        };
                    }
                }
                if (entry.data == "specimenType") {
                    if (
                        formValues.material == "Blood" ||
                        formValues.material == "Buffy Coat"
                    ) {
                        rowData[i] = {
                            ...rowData[i],
                            specimenType: "Blood"
                        };
                    }
                }
                if (
                    entry.rowData == "patientId" &&
                    entry.columnHeader == "Cell Line Name"
                ) {
                    rowData[i] = { ...rowData[i], specimenType: "CellLine" };
                }
            })
            if (rowData.length == numberOfRows) {
                columns.rowData = rowData
                resolve(columns);
            }
        }
    })
}

// pre-filling WellPosition for a plate of 96 wells
// times = how many times bigger is the #samples than the plate rows (8 A-H) -
// how many columns will have to be filled, used as end condition
// i = counter indicating how often I stepped through A-H
// plateColIndex = plate column
const setWellPos = columns => {
    let rows = columns.rowData
    let plateRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    let numPlates = Math.ceil(rows.length / plateRows.length);
    let i = 0;

    // multiply available plateRows by how many plates will be filled in this submission
    for (let k = 0; k < numPlates; k++) {
        plateRows = plateRows.concat(["A", "B", "C", "D", "E", "F", "G", "H"]);
    }
    let plateColIndex = 1;
    let rowCounter = 0;
    //  step through as many plates as you have to
    while (i < numPlates) {
        // fill rows first
        for (let j = 0; j < plateRows.length; j++) {
            // if rows A-H have been filled, flip colIndex
            if (rowCounter == 8) {
                rowCounter = 0;
                plateColIndex += 1;
            }
            // if colIndes reaches 13, all wells have been filled, colIndex flips back to 1 and a new plate is filled
            if (plateColIndex == 13) {
                plateColIndex = 1;
            }
            if (rows[j + plateRows.length * i]) {
                // fill row at position plateRows * number of plates you did this with already
                rows[j + plateRows.length * i].wellPosition =
                    plateRows[j] + plateColIndex;
            } else {
                break;
            }
            rowCounter++;
        }
        plateColIndex++;
        i++;
    }
    columns.rows = rows
    return columns;
};



// patient id validation depends on user selected id type
function choosePatientIdValidator(patientIDType, species, groupingChecked) {
    if (species == 'Mouse' || species == 'Mouse_GeneticallyModified') {
        if (groupingChecked) {
            return {
                pattern: '[A-Za-z0-9\\,_-]{4,}',
                columnHeader: 'Grouping ID',
                error:
                    'Invalid format. Please use at least four alpha-numeric characters. Every 8 digit ID is considered a MRN.',
            }
        } else {
            return {
                pattern: '[0-9a-zA-Z]{4,}',
                columnHeader: 'Strain or Line Name',
                error:
                    'Invalid format. Please use at least four alpha-numeric characters. Every 8 digit ID is considered a MRN.',
            }
        }
    } else {
        switch (patientIDType) {
            case 'MSK-Patients (or derived from MSK Patients)':
                return {
                    pattern: '^[0-9]{8}$',
                    columnHeader: 'MRN',
                    tooltip: "The patient's MRN.",
                    error:
                        'MRN is incorrectly formatted, please correct, or speak to a project manager if unsure.',
                    type: 'text',
                }
            case 'Non-MSK Patients':
                return {
                    pattern: '[A-Za-z0-9\\,_-]{4,}',
                    columnHeader: 'Patient ID',
                    error:
                        'Invalid format. Please use at least four alpha-numeric characters. Dashes and underscores are allowed. Every 8 digit ID is considered a MRN.',
                }
            case 'Cell Lines, not from Patients':
                return { columnHeader: 'Cell Line Name' }
            case 'Both MSK-Patients and Non-MSK Patients':
                return {
                    pattern: '[A-Za-z0-9\\,_-]{4,}|^[0-9]{8}$',
                    columnHeader: 'Patient ID',
                    error:
                        'Invalid format. Please use at least four alpha-numeric characters. Dashes and underscores are allowed. Every 8 digit ID is considered a MRN.',
                }
            default:
                return { pattern: 'formatter not found' }
        }
    }
}




export function generateSubmissionGrid(submissions) {

    return new Promise((resolve, reject) => {
        try {
            let grid = { columnHeaders: [], rows: [], columnFeatures: [] }
            grid.columnHeaders = Object.keys(submissionColumns).map(a  => submissionColumns[a].name)
            grid.columnFeatures = Object.values(submissionColumns)
            let rows = []
            for (let i = 0; i < submissions.length; i++) {
                let submission = submissions[i]
                let serviceId = submission.formValues.serviceId
            
                let isSubmitted = submission.submitted
                rows[i] = {
                    serviceId: serviceId,
                    transactionId: submission.transactionId,
                    username: submission.username,
                    sampleType: submission.formValues.material,
                    application: submission.formValues.application,
                    numberOfSamples: submission.formValues.numberOfSamples,
                    submitted: isSubmitted ? 'yes' : 'no',
                    createdAt: parseDate(submission.createdAt),
                    submittedAt: submission.submittedAt ? parseDate(submission.submittedAt)  : "",
                    // available actions depend on submitted status
                    edit: isSubmitted
                        ? `<span  submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action-disabled">edit</span>`
                        : `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action">edit</span>`,
                    receipt: isSubmitted
                        ? `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action grid-action">cloud_download</span>`
                        : `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action-disabled">cloud_download</span>`,
                    delete: isSubmitted
                        ? `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action-disabled">delete</span>`
                        : `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action">delete</span>`,
                }
                if (rows.length == submissions.length) {
                    grid.rows = rows
                    resolve(grid);
                }

            }

        } catch (err) {
            reject(err)
        }
    })
}

function parseDate(mongooseDate){
    let date = new Date(mongooseDate*1000)
    let humanReadable = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`
    return humanReadable

}
