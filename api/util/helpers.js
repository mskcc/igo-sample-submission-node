import CacheService from "./cache";
import axios from "axios";
const service = require("../services/services");
var _ = require('lodash');
const { constants } = require("./constants");
const { constantColumns } = require("./columns");
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
            let picklist = constantColumns[element[0]].picklistName

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
function fillColumns(limsColumnList, userRole, formValues, picklists) {
    return new Promise((resolve, reject) => {
        let result = {
            columnFeatures: [],
            rowData: [],
            columnHeaders: [],
            hiddenColumns: { columns: [] }
        };
        limsColumnList.forEach((element, index) => {
            let columnName = element[0]
            let optional = element[1] == "Optional"
            let colDef = constantColumns[columnName];

            if (colDef) {


                if (colDef.container && colDef.container !== formValues.container && formValues.application != 'Expanded_Genomics'
                ) {
                    colDef = overwriteContainer(formValues.container)
                }
                if (colDef.picklistName && !colDef.source) {

                    colDef.source = picklists[colDef.picklistName];
                    result.columnFeatures.push(colDef);
                    result.columnHeaders.push(
                        "<span title='" +
                        (colDef.tooltip ? colDef.tooltip : "") +
                        "'>" +
                        colDef.columnHeader +
                        "</span>"
                    );
                }

                else {
                    result.columnFeatures.push(colDef);
                    result.columnHeaders.push(
                        "<span title='" +
                        (colDef.tooltip ? colDef.tooltip : "") +
                        "'>" +
                        colDef.columnHeader +
                        "</span>"
                    );
                }

                if (colDef.hiddenFrom && colDef.hiddenFrom === userRole) {
                    result.hiddenColumns.columns.push(
                        result.columnFeatures.length
                    );
                }
            }
            if (index == limsColumnList.length - 1) {
                if (

                    result.columnFeatures[0].data == 'plateId' &&
                    result.columnFeatures[1].data != 'wellPosition'
                ) {
                    result.columnFeatures.unshift(constantColumns["Well Position"])
                }
                if (
                    formValues.container != 'Plates' &&
                    result.columnFeatures[1].data == 'wellPosition'
                ) {
                    result.columnFeatures[1] = result.columnFeatures[0]
                    result.columnFeatures.shift()
                }
                resolve(result)
            }
        })

    })
}


export function generateGrid(limsColumnList, userRole, formValues) {

    return new Promise((resolve, reject) => {

        cacheAllPicklists(limsColumnList)
            .then((picklists) => fillColumns(limsColumnList, userRole, formValues, picklists))
            // .then((columns) => overwriteContainer(columns, formValues))
            .then((columns) => fillData(columns, formValues)).catch((reasons) => reject(reasons))

            .then((columns) => {
                if (columns.columnFeatures.some((x) => x.data == "wellPosition")) {
                    resolve(setWellPos(columns))
                } else { resolve(columns) }
            })
            // .then((result) => resolve(result))
            .catch((reasons) => reject(reasons))
    })
}


// Lots of autofilling happening here
const fillData = (columns, formValues) => {

    return new Promise((resolve, reject) => {
        let rowData = [];
        let numberOfRows = formValues.numberOfSamples;
        for (var i = 0; i < numberOfRows; i++) {

            columns.columnFeatures.map((entry) => {
                // console.log(entry)
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

        // for each row, go through all columns to generate the correct object

        // for (let j = 0; j < columns.length; j++) {
        //     if (columns[j].data == "wellPosition") {
        //         return setWellPos(rowData);
        //         // break
        //     }
        // }

    })
}

// if lims returned a container type is different from the container the user indicated, chose the user one
const overwriteContainer = (userContainer) => {
    // const overwriteContainer = (columns, formValues) => {
    // return new Promise((resolve, reject) => {
    // find the index of the container with a mismatched value
    // let userContainer = formValues.container
    // let containerIndex = columns.columnFeatures.findIndex(x => (x.container && x.container !== formValues.container))
    // let limsContainer = columns.columnFeatures[containerIndex]

    // if (limsContainer) {
    let newContainer
    // console.log("mismatch lims" + limsContainer.container)
    switch (userContainer) {
        case 'Plates':
            newContainer = constantColumns["Plate ID"]
            break
        case 'Micronic Barcoded Tubes':
            newContainer = constantColumns["Micronic Tube Barcode"]
            break
        case 'Blocks/Slides/Tubes':
            newContainer = constantColumns["Block/Slide/TubeID"]
            break
        default:
            return ("Container not found")
    }

    return (newContainer)

    // columns.columnFeatures[containerIndex] = newContainer
    // columns.columnHeaders[containerIndex] = (
    //     "<span title='" +
    //     (newContainer.tooltip ? newContainer.tooltip : "") +
    //     "'>" +
    //     newContainer.columnHeader +
    //     "</span>"
    // );
    // console.log(userContainer, "OVERWRITE user")
    // console.log(newContainer, "OVERWRITE new")
    // resolve(newContainer)
    // reject(containerIndex = )
    // }
    // // console.log( columns.columnFeatures[containerIndex])
    // else {
    //     console.log(userContainer, "NO MISMATCH")
    //     resolve(limsContainer)
    // }
    // })

}


// pre-filling WellPosition for a plate of 96 wells
// times = how many times bigger is the #samples than the plate rows (8 A-H) -
// how many columns will have to be filled, used as end condition
// i = counter indicating how often I stepped through A-H
// plateColIndex = plate column
const setWellPos = columns => {
    // console.log(columns)
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

//   .then((connection) =>
// connection.query(selectQuery).then((rows) => {
//   return rows;
// })

// if (groups.includes(process.env.LAB_GROUP)) return "lab_member";
// if (groups.includes(process.env.PM_GROUP)) return "project_manager";
// else return "user";

// def get_picklist(listname):
//     if uwsgi.cache_exists(listname):
//         return pickle.loads(uwsgi.cache_get(listname))
//     else:
//         # three lists have special GETs but eventually they will be a picklist
//         if listname == "tumorType":
//             #            picklist_values['tumorType']={ "cache_date": time.time(), "values":cache_oncotree()}
//             uwsgi.cache_set(listname, pickle.dumps(cache_oncotree()), 900)
//         elif listname == "Tag":
//             #            picklist_values['Tag']={ "cache_date": time.time(), "values": cache_barcodes()}
//             uwsgi.cache_set(listname, pickle.dumps(cache_barcodes()), 900)
//             if uwsgi.cache_get(listname) == None:
//                 return cache_barcodes()
//         elif listname == "Reads+Coverage":
//             uwsgi.cache_set("Reads+Coverage", pickle.dumps(cache_reads_coverage()), 900)
//         else:
//             r = s.get(
//                 LIMS_API_ROOT + "/LimsRest/getPickListValues?list=%s" % listname,
//                 auth=(LIMS_USER, LIMS_PW),
//                 verify=False,
//             )
//             log_lims(r)
//             picklist = []
//             for value in json.loads(r.content.decode('utf-8')):
//                 picklist.append({"id": value, "value": value})
//             uwsgi.cache_set(listname, pickle.dumps(picklist), 900)
//         return pickle.loads(uwsgi.cache_get(listname))

