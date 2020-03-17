import CacheService from "./cache";
import axios from "axios";
const { constants } = require("./constants");
const { columns } = require("./columns");
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

export const getPicklist = picklist => {
    return (
        cache
            .get(picklist + "-Picklist", () =>
                axios
                    .get(LIMS_URL + "/getPickListValues?list=" + picklist, {
                        auth: { ...LIMS_AUTH }
                    })
                    .then(response => {
                        return response.data;
                    })
                    .catch(error => {
                        // console.log(error);
                        return;
                    })
            )
            // return cache result or axios result/error
            .then(result => {
                // console.log(result)
                return result;
            })
    );
};

exports.getMaterials = recipe => {
    return cache
        .get(recipe + "-Materials", () =>
            axios
                .get(
                    LIMS_URL +
                        "/getIntakeTerms?recipe=" +
                        recipe.replace("/", "_PIPI_SLASH_"),
                    {
                        auth: { ...LIMS_AUTH }
                    }
                )
                .then(response => {
                    return response.data[0];
                })
                .catch(error => {
                    return;
                })
        )
        .then(result => {
            return result;
        });
};
exports.getApplications = material => {
    return cache
        .get(material + "-Applications", () =>
            axios
                .get(
                    LIMS_URL +
                        "/getIntakeTerms?type=" +
                        material.replace("/", "_PIPI_SLASH_"),
                    {
                        auth: { ...LIMS_AUTH }
                    }
                )
                .then(response => {
                    return response.data[0];
                })
                .catch(error => {
                    return;
                })
        )
        .then(result => {
            return result;
        });
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

exports.getColumns = (material, application) => {
    return axios
        .get(LIMS_URL + "/getIntakeTerms", {
            params: {
                type: material.replace("/", "_PIPI_SLASH_"),
                recipe: application.replace("/", "_PIPI_SLASH_")
            },

            auth: { ...LIMS_AUTH }
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return;
        });
};

exports.generateGrid = (limsColumnList, clientFormValues, userRole) => {
    console.log(userRole);
    let result = {
        columnFeatures: [],
        rowData: [],
        columnHeaders: [],
        hiddenColumns: { columns: [] }
    };
    limsColumnList
        .forEach(element => {
            if (element) {
                let colDef = columns[element[0]];
                if (colDef) {
                    if (colDef.picklistName && !colDef.source) {
                        getPicklist(colDef.picklistName).then(picklist => {
                            colDef.source = picklist;
                            result.columnFeatures.push(colDef);
                            result.columnHeaders.push(
                                "<span title='" +
                                    (colDef.tooltip ? colDef.tooltip : "") +
                                    "'>" +
                                    colDef.columnHeader +
                                    "</span>"
                            );
                        });
                    } else {
                        result.columnFeatures.push(colDef);
                        result.columnHeaders.push(
                            "<span title='" +
                                (colDef.tooltip ? colDef.tooltip : "") +
                                "'>" +
                                colDef.columnHeader +
                                "</span>"
                        );
                    }
                    console.log(colDef.hiddenFrom);
                    if (colDef.hiddenFrom && colDef.hiddenFrom === userRole) {
                        console.log(result.columnFeatures.length);
                        result.hiddenColumns.columns.push(
                            result.columnFeatures.length
                        );
                    }
                }
            }
        })
        .then(
            generateData(result.columnFeatures, clientFormValues).then(
                dataResult => {
                    result.rowData = dataResult;
                    return result;
                }
            )
        );
};

// Lots of autofilling happening here
const generateData = (columnFeatures, clientFormValues) => {
    let rowData = [];
    let numberOfRows = clientFormValues.numberOfSamples;
    // for each row, go through all columns to generate the correct object
    for (var i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < columnFeatures.length; j++) {
            if (
                columnFeatures[j].data == "species" ||
                columnFeatures[j].data == "organism"
            ) {
                rowData[i] = {
                    ...rowData[i],
                    organism: clientFormValues.species
                };
            }
            if (columnFeatures[j].data == "preservation") {
                if (clientFormValues.material == "Blood") {
                    rowData[i] = {
                        ...rowData[i],
                        preservation: "EDTA-Streck"
                    };
                } else if (clientFormValues.material == "Buffy Coat") {
                    rowData[i] = {
                        ...rowData[i],
                        preservation: "Frozen"
                    };
                }
            }
            if (columnFeatures[j].data == "sampleOrigin") {
                if (clientFormValues.material == "Blood") {
                    rowData[i] = {
                        ...rowData[i],
                        sampleOrigin: "Whole Blood"
                    };
                } else if (clientFormValues.material == "Buffy Coat") {
                    rowData[i] = {
                        ...rowData[i],
                        sampleOrigin: "Buffy Coat"
                    };
                }
            }
            if (columnFeatures[j].data == "specimenType") {
                if (
                    clientFormValues.material == "Blood" ||
                    clientFormValues.material == "Buffy Coat"
                ) {
                    rowData[i] = {
                        ...rowData[i],
                        specimenType: "Blood"
                    };
                }
            }
            if (
                columnFeatures[j].rowData == "patientId" &&
                columnFeatures[j].columnHeader == "Cell Line Name"
            ) {
                rowData[i] = { ...rowData[i], specimenType: "CellLine" };
            } else {
                rowData[i] = { ...rowData[i], [columnFeatures[j].rowData]: "" };
            }
        }
    }

    for (let j = 0; j < columnFeatures.length; j++) {
        if (columnFeatures[j].data == "wellPosition") {
            return setWellPos(rowData);
            // break
        }
    }
    console.log(rowData);
    return rowData;
};

// pre-filling WellPosition for a plate of 96 wells
// times = how many times bigger is the #samples than the plate rows (8 A-H) -
// how many columns will have to be filled, used as end condition
// i = counter indicating how often I stepped through A-H
// plateColIndex = plate column
const setWellPos = rows => {
    let plateRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    let plateColsLength = 12;

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

    return rows;
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
