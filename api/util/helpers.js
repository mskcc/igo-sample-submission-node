const services = require('../services/services');
const crdbServices = require('../services/crdbServices');
const { logger } = require('../util/winston');
const { constants } = require('./constants');
const submitColumns = require('./columns');
import CacheService from './cache';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Logform } from 'winston';
import { reverseReadableRecipesLib } from '../constants';

const fs = require('fs');

var _ = require('lodash');

const dmpColumns = require('./dmpColumns');
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance

//  * Use this to find where console.log statements are coming from
// ['log', 'warn', 'error'].forEach((methodName) => {
//     const originalMethod = console[methodName];
//     console[methodName] = (...args) => {
//         let initiator = 'unknown place';
//         try {
//             throw new Error();
//         } catch (e) {
//             if (typeof e.stack === 'string') {
//                 let isFirst = true;
//                 for (const line of e.stack.split('\n')) {
//                     const matches = line.match(/^\s+at\s+(.*)/);
//                     if (matches) {
//                         if (!isFirst) {
//                             // first line - current function
//                             // second line - caller (what we are looking for)
//                             initiator = matches[1];
//                             break;
//                         }
//                         isFirst = false;
//                     }
//                 }
//             }
//         }
//         originalMethod.apply(console, [...args, '\n', `  at ${initiator}`]);
//     };
// });

exports.createSharedString = (shared, username) => {
    let sharedSet = new Set();
    let sharedArray = shared.split(',');

    sharedSet.add(...sharedArray);
    sharedSet.add(`${username}@mskcc.org`);

    return Array.from(sharedSet).join(',');
};

exports.getContainers = (material) => {
    if (material in constants.containersByMaterial) {
        return constants.containersByMaterial[material];
    } else return [];
};

exports.getSpecies = (recipe) => {
    if (constants.humanApplications.includes(recipe.toLowerCase())) return ['Human'];
    if (constants.mouseApplications.includes(recipe.toLowerCase())) return ['Mouse'];
    if (constants.humanOrMouseApplications.includes(recipe.toLowerCase())) return ['Human', 'Mouse'];
    else {
        return [];
    }
};

const getColumnNamesFromLimsCols = (limsColumns) => {
    return limsColumns.map((element) => element[0]);
};

const cacheAllPicklists = (limsColumns, allColumns) => {
    return new Promise((resolve, reject) => {
        let picklistPromises = [];
        let picklists = {};
        limsColumns.map((columnName) => {
            if (!allColumns.gridColumns[columnName]) {
                logger.info(`Column '${columnName}' not found in possible columns.`);
                if (!allColumns.deprecatedColumns.includes(columnName)) {
                    reject(`Column '${columnName}' not found in possible or deprecated columns.`);
                }
            } else {
                let picklist = allColumns.gridColumns[columnName].picklistName;

                if (picklist !== undefined) {
                    picklists[picklist] = [];
                    if (picklist === 'barcodes') {
                        picklistPromises.push(cache.get(picklist + '-Picklist', () => services.getBarcodes()));
                    } else if (picklist === 'tumorType') {
                        picklistPromises.push(cache.get(picklist + '-Picklist', () => services.getOnco()));
                    } else {
                        picklistPromises.push(cache.get(picklist + '-Picklist', () => services.getPicklist(picklist)));
                    }
                }
            }
        });
        Promise.all(picklistPromises)
            .catch((error) => reject(error))
            .then((results) => {
                if (!results || results.some((x) => x.length === 0)) {
                    logger.error('Could not cache picklists.');
                }
                Object.keys(picklists).map((element, index) => {
                    picklists[element] = results[index];
                });
                resolve(picklists);
            });
    });
};

export function generateGrid(limsColumnList, userRole, formValues, type = 'upload') {
    let allColumns = submitColumns;
    if (type == 'dmp') {
        allColumns = dmpColumns;
    }
    return new Promise((resolve, reject) => {
        let columns = {
            columnFeatures: [],
            rowData: [],
            columnHeaders: [],
            hiddenColumns: [],
        };

        if (!limsColumnList) {
            reject('Invalid Combination.');
        }
        // combinations with no optional columns return an empty element we need to filter out
        limsColumnList = limsColumnList.filter((element) => element[0] !== '');

        let columnNamesOnly = getColumnNamesFromLimsCols(limsColumnList);

        cacheAllPicklists(columnNamesOnly, allColumns)
            .then((picklists) => fillColumns(columns, limsColumnList, formValues, picklists, allColumns))
            .then((columns) => hideColumns(columns, userRole))
            .then((columns) => fillData(columns, formValues))
            .then((columns) => {
                if (columns.columnFeatures.some((x) => x.data === 'wellPosition')) {
                    setWellPos(columns).then(resolve(columns));
                } else {
                    resolve(columns);
                }
            })
            .catch((reasons) => {
                reject(reasons);
                return;
            });
    });
}

function fillColumns(columns, limsColumnList, formValues = {}, picklists, allColumns) {
    return new Promise((resolve, reject) => {
        let requiredColumns = [];
        limsColumnList.map((item) => {
            if (item.includes('Required')) {
                requiredColumns.push(item[0]);
            }
        });
        limsColumnList.forEach((element, index) => {
            let columnName = element[0];

            let colDef = allColumns.gridColumns[columnName];
            if (!colDef) {
                logger.info(`Column '${columnName}' not found in possible columns.`);
                if (!allColumns.deprecatedColumns.includes(columnName)) {
                    logger.info(`Column '${columnName}' not found in possible or deprecated columns.`);
                    reject(`Column '${columnName}' not found in possible or deprecated columns.`);
                }
            } else {
                if (colDef.container && colDef.container !== formValues.container && formValues.application !== 'Expanded_Genomics') {
                    colDef = overwriteContainer(formValues.container, allColumns);
                }

                if (colDef.data === 'patientId') {
                    let formattingAdjustments = choosePatientIdValidator(
                        formValues.patientIdType,
                        formValues.patientIdTypeSpecified,
                        formValues.species,
                        formValues.groupingChecked,
                        allColumns
                    );
                    colDef = { ...colDef, ...formattingAdjustments };
                }
                if (colDef.picklistName && !colDef.source) {
                    if (colDef.data === 'index') {
                        colDef.barcodeHash = picklists[colDef.picklistName];
                    } else {
                        colDef.source = picklists[colDef.picklistName];
                    }
                }

                // filter requested reads based on sequencing read length
                if (colDef.picklistName === 'Sequencing+Reads+Requested') {
                    if (formValues.sequencingReadLength && formValues.sequencingReadLength.length > 0) {
                        const standardReads = ['PE100', 'PE150', '26/10/10/90', '28/10/10/88', '50/8/16/49', '50/8/24/49'];
                        const specialNonStandardReads = ['PE250', 'PE300'];
                        const specialPE250BlockOptions = ['1 million total reads', '20 million total reads', '100 million total reads', '800 million total reads'];
                        const specialPE300BlockOptions = ['20 million total reads', '100 million total reads'];
                        if (formValues.sequencingReadLength === 'Other') {
                            colDef.source = picklists[colDef.picklistName];
                        } else if (specialNonStandardReads.includes(formValues.sequencingReadLength)) {
                            const newList = formValues.sequencingReadLength === 'PE250' ? specialPE250BlockOptions : specialPE300BlockOptions;
                            colDef.source = newList;
                        } else if (!standardReads.includes(formValues.sequencingReadLength)) {
                            // all block options for non standard
                            const blockList = picklists[colDef.picklistName].filter(item => item.includes('total reads'));
                            colDef.source = blockList;
                        } else {
                            // filter out total reads options - this is default!
                            const standardList = picklists[colDef.picklistName].filter(item => !item.includes('total reads'));
                            colDef.source = standardList;
                        }
                    } else {
                        const standardList = picklists[colDef.picklistName].filter(item => !item.includes('total reads'));
                        colDef.source = standardList;
                    }
                } 

                colDef.error = colDef.error ? colDef.error : 'Invalid format.';
                columns.columnFeatures.push(colDef);
                colDef.optional = requiredColumns.includes(columnName) ? false : true;
                colDef.allowEmpty = colDef.optional;
                colDef.className = colDef.optional ? 'optional' : 'required';
            }

            if (index === limsColumnList.length - 1) {
                // if plate column present but not WellPos, add WellPos
                if (columns.columnFeatures[0].data === 'plateId' && columns.columnFeatures[1].data !== 'wellPosition') {
                    columns.columnFeatures.unshift(allColumns.gridColumns['Well Position']);
                }
                // if plate column not present but WellPos is, remove WellPos
                if (formValues.container !== 'Plates' && columns.columnFeatures[1].data === 'wellPosition') {
                    columns.columnFeatures[1] = columns.columnFeatures[0];
                    columns.columnFeatures.shift();
                }
                columns.columnHeaders = columns.columnFeatures.map(
                    (a) => `<span class='${a.className}' title='${a.tooltip}'>${a.columnHeader}</span>`
                );
                resolve(columns);
            }
        });
    });
}

// if lims returned a container type is different from the container the user indicated, chose the user one
const overwriteContainer = (userContainer, allColumns) => {
    let newContainer;
    switch (userContainer) {
        case 'Plates':
            newContainer = allColumns.gridColumns['Plate ID'];
            break;
        case 'Micronic Barcoded Tubes':
            newContainer = allColumns.gridColumns['Micronic Tube Barcode'];
            break;
        case 'Blocks/Slides/Tubes':
            newContainer = allColumns.gridColumns['Block/Slide/TubeID'];
            break;
        default:
            return `Container '${userContainer}' not found.`;
    }
    return newContainer;
};

// generate rows with same autofilled and consecutive wellPos values, only return the additional rows
export const hideColumns = (columns, userRole) => {
    return new Promise((resolve) => {
        columns.columnFeatures.map((element, index) => {
            if (element.hiddenFrom === userRole) {
                columns.hiddenColumns.push(index);
            }
        });
        resolve(columns);
    });
};
// generate rows with same autofilled and consecutive wellPos values, only return the additional rows
export const generateAdditionalRows = (columnFeatures, formValues, prevRowNumber, newRowNumber) => {
    return new Promise((resolve) => {
        // making sure the formValue sample number is the most recent one
        //  important for changing the row number on paste rather than through form select
        formValues.numberOfSamples = newRowNumber;
        let columns = { columnFeatures: columnFeatures, formValues: formValues };

        fillAdditionalRows(columns, formValues).then((columns) => {
            //delete all old rows
            prevRowNumber = parseInt(prevRowNumber);
            newRowNumber = parseInt(newRowNumber);
            for (let i = 0; i < prevRowNumber; i++) {
                columns.rowData.shift();
                if (i + 1 === prevRowNumber) {
                    resolve(columns.rowData);
                }
            }
        });
    });
};

const fillAdditionalRows = (columns, formValues) => {
    return new Promise((resolve) => {
        fillData(columns, formValues).then((columns) => {
            if (columns.columnFeatures.some((x) => x.data === 'wellPosition')) {
                columns = setWellPos(columns).then((columns) => {
                    resolve(columns);
                });
            } else resolve(columns);
        });
    });
};

// Lots of autofilling happening here
const fillData = (columns, formValues) => {
    return new Promise((resolve) => {
        let rowData = [];
        let { material, numberOfSamples, application, species } = formValues;

        for (var i = 0; i < numberOfSamples; i++) {
            columns.columnFeatures.map((colDef) => {
                let datafieldName = colDef.data;
                rowData[i] = { ...rowData[i], [datafieldName]: '' };
                if (colDef.type === 'checkbox') {
                    rowData[i] = { ...rowData[i], [datafieldName]: false };
                }
                if (datafieldName === 'species' || datafieldName === 'organism') {
                    rowData[i] = {
                        ...rowData[i],
                        species: species,
                    };
                }
                if (datafieldName === 'preservation') {
                    if (material === 'Blood') {
                        rowData[i] = {
                            ...rowData[i],
                            preservation: 'EDTA',
                        };
                    }
                    if (material === 'Buffy Coat') {
                        rowData[i] = {
                            ...rowData[i],
                            preservation: 'Frozen',
                        };
                    }
                    if ((material === 'Cells' || material === 'Nuclei') && application.toUpperCase().includes('SC')) {
                        rowData[i] = {
                            ...rowData[i],
                            preservation: 'Fresh',
                        };
                    }
                }
                if (datafieldName === 'sampleOrigin') {
                    if (material === 'Blood') {
                        rowData[i] = {
                            ...rowData[i],
                            sampleOrigin: 'Whole Blood',
                        };
                    } else if (material === 'Buffy Coat') {
                        rowData[i] = {
                            ...rowData[i],
                            sampleOrigin: 'Buffy Coat',
                        };
                    }
                }
                if (datafieldName === 'specimenType') {
                    if (material === 'Blood' || material === 'Buffy Coat') {
                        rowData[i] = {
                            ...rowData[i],
                            specimenType: 'Blood',
                        };
                    }
                }
                if (datafieldName === 'patientId' && colDef.columnHeader === 'Cell Line Name') {
                    rowData[i] = { ...rowData[i], specimenType: 'CellLine' };
                }
            });
            if (rowData.length === parseInt(numberOfSamples)) {
                columns.rowData = rowData;
                resolve(columns);
            }
        }
    });
};

// pre-filling WellPosition for a plate of 96 wells
// times = how many times bigger is the #samples than the plate rows (8 A-H) -
// how many columns will have to be filled, used as end condition
// i = counter indicating how often I stepped through A-H
// plateColIndex = plate column
const setWellPos = (columns) => {
    return new Promise((resolve) => {
        let rows = columns.rowData;
        let plateRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        let numPlates = Math.ceil(rows.length / plateRows.length);
        let i = 0;

        // multiply available plateRows by how many plates will be filled in this submission
        for (let k = 0; k < numPlates; k++) {
            plateRows = plateRows.concat(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
        }
        let plateColIndex = 1;
        let rowCounter = 0;
        //  step through as many plates as you have to
        while (i < numPlates) {
            // fill rows first
            for (let j = 0; j < plateRows.length; j++) {
                // if rows A-H have been filled, flip colIndex
                if (rowCounter === 8) {
                    rowCounter = 0;
                    plateColIndex += 1;
                }
                // if colIndes reaches 13, all wells have been filled, colIndex flips back to 1 and a new plate is filled
                if (plateColIndex === 13) {
                    plateColIndex = 1;
                }
                if (rows[j + plateRows.length * i]) {
                    // fill row at position plateRows * number of plates you did this with already
                    rows[j + plateRows.length * i].wellPosition = plateRows[j] + plateColIndex;
                } else {
                    break;
                }
                rowCounter++;
            }
            plateColIndex++;
            i++;
        }
        columns.rows = rows;
        resolve(columns);
    });
};

// patient id validation depends on user selected id type
function choosePatientIdValidator(patientIdType, patientIdTypeSpecified, species, groupingChecked, allColumns) {
    let formattingAdjustments = allColumns.formattingAdjustments;

    if (species === 'Mouse' || species === 'Mouse_GeneticallyModified') {
        if (groupingChecked) {
            return formattingAdjustments['Grouping ID'];
        } else {
            return formattingAdjustments['Strain or Line Name'];
        }
    } else {
        if (
            species === 'Human' &&
            (patientIdType === 'MSK-Patients (or derived from MSK Patients)' || patientIdType === 'Both MSK-Patients and Non-MSK Patients')
        ) {
            return formattingAdjustments[patientIdTypeSpecified];
        } else {
            return formattingAdjustments[patientIdType];
        }
    }
}

export function generateSubmissionGrid(submissions, userRole, submissionType) {
    return new Promise((resolve, reject) => {
        let gridColumns = submissionType === 'dmp' ? dmpColumns.submissionColumns : submitColumns.submissionColumns;

        fillSubmissionGrid(submissions, userRole, gridColumns, submissionType)
            .then((grid) => {
                if (submissionType === 'dmp') {
                    return addDmpColsToSubmissionGrid(submissions, grid, userRole)
                        .then((dmpGrid) => resolve(dmpGrid))
                        .catch((error) => reject(error));
                } else {
                    resolve(grid);
                }
            })
            .catch((error) => reject(error));
    });
}

export function fillSubmissionGrid(submissions, userRole, gridColumns, submissionType) {
    return new Promise((resolve, reject) => {
        try {
            let grid = { columnHeaders: [], rows: [], columnFeatures: [] };
            grid.columnHeaders = Object.keys(gridColumns).map((a) => gridColumns[a].name);
            grid.columnFeatures = Object.values(gridColumns);

            if (userRole === 'user') {
                grid.columnHeaders = grid.columnHeaders.filter((element) => {
                    return element !== 'Unsubmit' && element !== 'Review';
                });
                grid.columnFeatures = grid.columnFeatures.filter((element) => {
                    return element.name !== 'Unsubmit' && element.name !== 'Review';
                });
            }
            let rows = [];
            for (let i = 0; i < submissions.length; i++) {
                let submission = submissions[i];
                let serviceId = submission.formValues.serviceId;
                let cleanedFormValueMaterial = submission.formValues.material;
                if (submissionType === 'dmp') {
                    cleanedFormValueMaterial = cleanDMPFormValues(submission.formValues).material;
                }
                
                let isSubmitted = submission.submitted;
                rows[i] = {
                    serviceId: serviceId,
                    transactionId: submission.transactionId,
                    dmpTrackingId: serviceId,
                    username: submission.username,
                    sampleType: cleanedFormValueMaterial,
                    application: submission.formValues.application,
                    numberOfSamples: submission.formValues.numberOfSamples,
                    submitted: isSubmitted ? 'yes' : 'no',
                    revisions: submission.__v,
                    createdAt: parseDate(submission.createdAt),
                    submittedAt: submission.submittedAt ? parseDate(submission.submittedAt) : '',
                    // available actions depend on submitted status
                    edit: `<span  submitted=${isSubmitted} service-id=${serviceId} submission-id=${
                        submission.id
                    } class="material-icons grid-action${isSubmitted ? '-disabled' : ''}">edit</span>`,
                    receipt: `<span  submitted=${isSubmitted} service-id=${serviceId} submission-id=${
                        submission.id
                    } class="material-icons grid-action${isSubmitted ? '' : '-disabled'}">cloud_download</span>`,
                    delete: `<span  submitted=${isSubmitted} service-id=${serviceId} submission-id=${
                        submission.id
                    } class="material-icons grid-action${isSubmitted ? '-disabled' : ''}">delete</span>`,
                };

                if (userRole !== 'user') {
                    rows[i].unsubmit = `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${
                        submission.id
                    } class="material-icons grid-action${isSubmitted ? '' : '-disabled'}">undo</span>`;
                }

                if (rows.length === submissions.length) {
                    grid.rows = rows;
                    resolve(grid);
                }
            }
        } catch (err) {
            reject(err);
        }
    });
}

// queries DMP endpoint for past 2 months
// DMP results look like
// {
//     runDate: '05-27-2020',
//     result: 'Success',
//     content: {
//       'TrackingId List': [
//         '20200529LM',
//         '20200713AH',
//         '20200709NS'
//       ]
//     }
//   }
export function getAvailableProjectsFromDmp() {
    return new Promise((resolve, reject) => {
        const datesToFetch = getLast2MDates();
        
        // const datesToFetch = ['05-30-2021'];
        let promises = [];
        datesToFetch.forEach((date) => promises.push(services.getAvailableProjectsFromDmp(date)));
        Promise.all(promises)
            .then((results) => {
                try {
                    let dmpTrackingIds = new Set();
                    results.forEach((idList) => {
                        if (idList && idList.content) {
                            idList.content['TrackingId List'].forEach((id) => dmpTrackingIds.add(id));
                        }
                    });
                    resolve(dmpTrackingIds);
                } catch (error) {
                    reject(`Unexpected DMP result format. ${error}`);
                }
            })
            .catch((error) => reject(`Error retrieving data from the DMP. ${error}`));
    });
}

const getLast2MDates = () => {
    let currentDate = moment().format("MM-DD-YYYY");
    let dates = [currentDate];
    for (let i = 1; i < 60; i++) {
        dates.push(moment().subtract(i, 'days').format("MM-DD-YYYY"));
    }
    return dates;
}

// user can submit => if user not yet submitted or if unsubmitted
// pm can review => if user submitted and not yet reviewed
// pm can submit => if pm reviewed
// pm can unsubmit => if user submitted
// pm can load from DMP => if available from DMP (no additonal check for reviewed)
export function addDmpColsToSubmissionGrid(submissions, grid, userRole) {
    return new Promise((resolve) => {
        let dmpGrid = grid;
        let rows = dmpGrid.rows;
        for (let i = 0; i < submissions.length; i++) {
            let submission = submissions[i];

            let dmpTrackingId = submission.formValues.serviceId;
            let isSubmitted = submission.submitted;

            const samplesApproved = submission.gridValues.filter((element) => {
                return element.isApproved;
            });
            let isReviewed = submission.reviewed;
            rows[i].samplesApproved = `${samplesApproved.length}/${submission.formValues.numberOfSamples} samples`;
            rows[i].reviewed = isReviewed ? 'yes' : 'no';
            rows[i].reviewedAt = submission.reviewedAt ? parseDate(submission.reviewedAt) : '';
            rows[i].loadedFromDmpAt = submission.loadedFromDmpAt ? parseDate(submission.loadedFromDmpAt) : '';
            rows[i].reviewedBy = submission.reviewedBy ? submission.reviewedBy : '';
            rows[i].dmpTrackingId = dmpTrackingId;
            rows[i].relatedIgoSubmission_id = submission.relatedIgoSubmission_id;
            //  TODO: once DMP can pick up reviewed submissions, set this correctly
            let isAvailableAtDmp = submission.isAvailableAtDmp;
            // only loadable if exposed to DMP
            
            let loadButtonClass = 'grid-action';
            if (userRole === 'user' || !isAvailableAtDmp) {
                loadButtonClass = 'grid-action-disabled';
            }
            rows[
                i
            ].loadFromDmp = `<span submitted=${isAvailableAtDmp} service-id="${dmpTrackingId}" submission-id=${submission.id} class="material-icons ${loadButtonClass}">cloud_download</span>`;
            // only editable if unsubmitted
            let editButtonClass = 'grid-action';
            if (isSubmitted) editButtonClass = 'grid-action-disabled';
            rows[
                i
            ].edit = `<span  submitted=${isSubmitted} service-id="${dmpTrackingId}" submission-id=${submission.id} class="material-icons ${editButtonClass}">edit</span>`;

            if (userRole !== 'user') {
                // review is disabled if unsubmitted or already reviewed
                let reviewButtonClass = 'grid-action';
                if (!isSubmitted || isReviewed) reviewButtonClass = 'grid-action-disabled';
                rows[
                    i
                ].review = `<span submitted=${isSubmitted} service-id="${dmpTrackingId}" submission-id="${submission.id}" class="material-icons ${reviewButtonClass}">assignment_turned_in</span>`;

                // can only unsubmit prior to exposing to DMP
                let unsubmitButtonClass = 'grid-action';
                if (!isSubmitted) unsubmitButtonClass = 'grid-action-disabled';
                rows[
                    i
                ].unsubmit = `<span submitted=${isSubmitted} service-id="${dmpTrackingId}" submission-id="${submission.id}" class="material-icons ${unsubmitButtonClass}">undo</span>`;
            }

            if (rows.length === submissions.length) {
                grid.rows = rows;
                resolve(grid);
            }
        }
    });
}

function parseDate(mongooseDate) {
    let date = new Date(mongooseDate * 1000);
    let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let humanReadable = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} at ${date.getHours()}:${minutes}`;
    return humanReadable;
}

//  Submits submission to BankedSample. Returns array of created recordIds
export function submit(submission, user, transactionId) {
    return new Promise((resolve, reject) => {
        let serviceId = submission.formValues.serviceId;
        let recipe = reverseReadableRecipesLib[submission.formValues.application];
        let capturePanel = submission.formValues.capturePanel;
        let sampleType = submission.formValues.material;
        let seqReadLength = submission.formValues.sequencingReadLength || '';
        let samples = submission.gridValues;
        let submittedSamples = [];
        // prep banked sample record
        for (let i = 0; i < samples.length; i++) {
            let bankedSample = Object.assign({}, samples[i]);
            bankedSample.serviceId = serviceId;
            bankedSample.recipe = recipe;
            bankedSample.capturePanel = capturePanel;
            bankedSample.sampleType = sampleType;
            bankedSample.transactionId = transactionId;
            bankedSample.igoUser = user.username;
            bankedSample.investigator = submission.username;
            bankedSample.user = process.env.API_USER;
            bankedSample.concentrationUnits = 'ng/uL';
            bankedSample.sequencingReadLength = seqReadLength;

            if (recipe.includes('COVID')) {
                bankedSample.userId = `${bankedSample.userId}-${serviceId}`;
            }

            if ('wellPosition' in bankedSample) {
                var match = /([A-Za-z]+)(\d+)/.exec(bankedSample.wellPosition);
                if (!match) {
                    reject('Invalid Well Position.');
                } else {
                    bankedSample.rowPos = match[1];
                    bankedSample.colPos = match[2];
                    delete bankedSample.wellPosition;
                }
            }
            //  not needed in LIMS, only displayed for users' convenience
            if ('indexSequence' in bankedSample) {
                delete bankedSample.indexSequence;
            }

            // delete empty fields
            Object.keys(bankedSample).map((element) => {
                if (bankedSample[element] === '') {
                    delete bankedSample[element];
                }
            });

            services
                .submit(bankedSample)
                .then((response) => {
                    logger.info(`Submitted ${bankedSample.userId}.`);
                    submittedSamples.push(response);
                    if (submittedSamples.length === samples.length) {
                        resolve(submittedSamples);
                    }
                })
                .catch((err) => reject(`Submit failed at sample ${bankedSample.userId}, index ${bankedSample.rowIndex}. ${err}`));
        }
    });
}

// Generate excel from mongoose submission model.
// Replaces keys with column names and filters noShow columns.
export function generateSubmissionExcel(submission, role) {
    let isUser = role === 'user';
    let sheetData = [];
    let sheetFormData = {};
    // replace form keys with column names and filter out noShow columns
    Object.keys(submission.formValues).map((element) => {
        let colDef = submitColumns.formColumns[element] || '';
        let isNoShowCol = isUser && submitColumns.noShowColumns.includes(element);
        let isNoShowEmptyCol = isUser && submitColumns.noShowEmptyColumns.includes(element) && submission.formValues[element] === '';
        if (!isNoShowCol && !isNoShowEmptyCol) {
            let colName = colDef.columnHeader || element;
            sheetFormData[colName] = submission.formValues[element];
        }
    });

    submission.gridValues.map((element, index) => {
        let gridRow = submission.gridValues[index];
        let sheetGridRow = [];
        Object.keys(gridRow).map((element) => {
            let colDef = element;
            let isNoShowCol = isUser && submitColumns.noShowColumns.includes(element);
            // find columnHeader for this element in object of objects
            if (!isNoShowCol) {
                for (let key in submitColumns.gridColumns) {
                    if (submitColumns.gridColumns[key].data === element) {
                        colDef = submitColumns.gridColumns[key].columnHeader;
                        break;
                    }
                }
                sheetGridRow[colDef] = gridRow[element];
            }
        });
        sheetData.push({ ...sheetFormData, ...sheetGridRow });
    });
    return sheetData;
}

export function generateGridExcel(grid, role, type = 'submit') {
    let allColumns = submitColumns;
    if (type == 'dmp') {
        allColumns = dmpColumns;
    }
    let isUser = role === 'user';
    let sheetData = [];
    let sheetFormData = {};

    grid.map((element, index) => {
        let gridRow = grid[index];
        let sheetGridRow = [];
        Object.keys(gridRow).map((element) => {
            let colDef = element;
            let isNoShowCol = isUser && allColumns.noShowColumns.includes(element);
            // find columnHeader for this element in object of objects
            if (!isNoShowCol) {
                for (let key in allColumns.gridColumns) {
                    if (allColumns.gridColumns[key].data === element) {
                        colDef = allColumns.gridColumns[key].columnHeader;
                        break;
                    }
                }
                sheetGridRow[colDef] = gridRow[element];
            }
        });
        sheetData.push({ ...sheetFormData, ...sheetGridRow });
    });
    return sheetData;
}

// PROMOTE

export function generatePromoteGrid(limsColumnOrdering) {
    return new Promise((resolve) => {
        let grid = {
            columnFeatures: [],
            columnHeaders: [],
            rowData: [{}],
        };
        // lims returns these columns as ["Integer:String","Integer:String",...]
        limsColumnOrdering.map((element) => {
            let promoteColFeature = {};
            let columnName = element.split(':')[1];
            // If we recognize the column, attach the feature and add it to the list used for picklist generation
            if (columnName === 'Index') {
                promoteColFeature = Object.assign({}, submitColumns.gridColumns[columnName]);
                promoteColFeature.data = 'barcodeId';
            }
            // if (columnName === 'Reads Requested/Coverage') {
            //     promoteColFeature = Object.assign({}, submitColumns.gridColumns[columnName]);
            //     promoteColFeature.data = 'readSummary';
            // } 
            else if (columnName in submitColumns.gridColumns) {
                promoteColFeature = Object.assign({}, submitColumns.gridColumns[columnName]);
            } else {
                logger.info(`${columnName} not found`);
                promoteColFeature = {
                    name: columnName,
                    data: camelize(columnName),
                    columnHeader: columnName,
                };
            }
            grid.columnFeatures.push(promoteColFeature);
        });
        grid.columnFeatures.map((promoteColFeature) => {
            promoteColFeature.readOnly = true;
            promoteColFeature.error = promoteColFeature.error ? promoteColFeature.error : 'Invalid format.';
            grid.rowData[0][promoteColFeature.data] = '';
        });
        grid.columnHeaders = grid.columnFeatures.map((a) => `<span class='${a.className}' title='${a.tooltip}'>${a.columnHeader}</span>`);
        const selectCol = submitColumns.promoteSelect;
        grid.columnHeaders.unshift('<span class="material-icons select-col" title="check">check</span>');
        grid.columnFeatures.unshift(selectCol);
        grid.rowData[0][selectCol.data] = false;
        resolve(grid);
    });
}
function camelize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
}

export function loadBankedSamples(queryType, query) {
    return new Promise((resolve, reject) => {
        services
            .loadBankedSamples(queryType, query)
            .then((response) => {
                // TODO: Clean out some data like in old rex?
                resolve(response);
            })
            .catch((reasons) => reject(reasons));
    });
}

export function promote(transactionId, requestId, projectId, serviceId, materials, bankedSampleIds, user, dryrun) {
    return new Promise((resolve, reject) => {
        // remove cohort when promoting
        let formattedServiceId = serviceId;
        if (serviceId.includes('_')) {
            // only use the first 10 characters, i.e. IGO-123456
            formattedServiceId = serviceId.slice(0,10);
        }
        let data = {
            transactionId: transactionId,
            requestId: requestId || 'NULL',
            projectId: projectId || 'NULL',
            serviceId: formattedServiceId,
            materials: materials,
            bankedId: bankedSampleIds,
            igoUser: user,
            user: user,
            dryrun: dryrun,
        };
        services
            .promote(data)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// PROMOTE END

//  DMP
// DMP Patient IDs needs to be verified and anonymized
export function handleDmpId(dmpId) {
    return new Promise((resolve, reject) => {
        let result = {
            patientId: dmpId,
            cmoPatientId: '',
        };

        crdbServices
            .verifyDmpId(dmpId)
            .then((response) => {
                if (!response.CMO_ID) {
                    reject(`Could not verify ID ${dmpId}. If possible, enter MRN for this patient instead.`);
                }
                result.cmoPatientId = response.CMO_ID;
                resolve(result);
            })

            .catch((reasons) => reject(reasons));
    });
}

export function getDmpColumns(material, application) {
    return new Promise((resolve, reject) => {
        const combination = `${material}+${application}`;
        if (dmpColumns.invalidCombinations.includes(combination)) {
            if (material === 'DNA/cDNA Library' && application === 'WGS_Deep') {
                reject(`HumanWholeGenome requires DNA, please select DNA as the material. `);
            }
            if (material === 'DNA/cDNA Library' && application === 'CHPanel') {
                reject(`CHPanel requires DNA, please select DNA as the material. `);
            }
            reject(`We do not accept '${material}' for '${application}'.`);
        }
        const columns = dmpColumns.dmpIntakeForms[combination];
        if (columns) {
            resolve(columns);
        } else {
            reject(`Could not retrieve grid for '${material}' and '${application}'.`);
        }
    });
}

export function cleanDMPFormValues(formValues) {
    let cleanedFormValues = Object.assign({}, formValues);
    if (formValues.material === 'DNA (Molecular Accession Number only)' || formValues.material === 'DNA (DMP Sample ID only)' || formValues.material === 'DNA') {
        cleanedFormValues.material = 'DNA';
    } else {
        cleanedFormValues.material = 'DNA/cDNA Library';
    }
    return cleanedFormValues;
}

export function publishDmpData(submissions, dmpRequestId) {
    // cmorequests will be array of objects with each objects being on submission with an array of samples
    return new Promise((resolve, reject) => {
        let dmpData = {
            dmpRequestId: dmpRequestId,
            cmoResponseId: uuidv4(),
            requestTime: getTransactionIdForDmp(),
            cmoRequests: [],
        };

        filterForApprovedSamples(dmpData, submissions).then((dmpData) => resolve(dmpData));
        //     generateDmpIds(submissions).then((submissions) => formatDmpData(submissions).then((submissions) => resolve(submissions)))
        // );
    });
}

export function filterForApprovedSamples(dmpData, submissions) {
    return new Promise((resolve, reject) => {
        var filteredDmpData = dmpData;
        //  only add samples that were approved
        // let filteredSubmissions = Object.assign({}, submissions);
        let requests = submissions;
        // for each request, get rid of unapproved samples
        requests.forEach(function (request, index) {
            let filteredRequest = {};
            let material = getDmpSpecimenType(request.formValues.material);
            let igoId = request._id;

            const approvedSamples = getApprovedSamples(request);
            approvedSamples.forEach(function (sample) {
                sample.recordStatus = 'new';
                sample.specimenType = material;
                delete sample.molecularPathologyAccessionNumber;
                delete sample.rowIndex;
                delete sample.isApproved;
            });

            if (approvedSamples.length > 0) {
                filteredRequest.requestId = igoId;
                filteredRequest.samples = approvedSamples;
                filteredDmpData.cmoRequests.push(filteredRequest);
            } else return;
            if (index === requests.length - 1) {
                // filteredDmpData.cmoRequests = filteredDmpData.cmoRequests.filter((element) => element);
                resolve(filteredDmpData);
            }
        });
    });
}

function getApprovedSamples(submission) {
    const samples = submission.gridValues;
    return samples.filter((sample) => sample.isApproved);
}

export function parseDmpOutput(dmpOutput, submission) {
    return new Promise((resolve, reject) => {
        let dmpSamples = dmpOutput.content['CMO Sample Request Details'];
        let numReturnedSamples = Object.keys(dmpSamples).length;
        let numOriginalSamples = submission.gridValues.length;
        let droppedSamples = [];
        let depletedSamples = [];
        let promises = [];
        let username = submission.username;

        if (numReturnedSamples === 1) {
            if (dmpSamples[Object.keys(dmpSamples)[0]]['Well Position'] === '') {
                reject('DMP only returned one sample without a Well Position. Cannot load DMP output.');
                return;
            }
        }

        promises.push(cache.get('tumorType-Picklist', () => services.getOnco()));

        if (submission.formValues.material.includes('Library')) {
            promises.push(cache.get('barcodes-Picklist', () => services.getBarcodes()));
        } else {
            promises.push([]);
        }

        // get sample info for dropped/depleted samples
        if (numReturnedSamples < numOriginalSamples) {
            let dmpInvestigatorIds = [];

            //loop through both sample sets to get sample id info
            Object.entries(dmpSamples).forEach(entry => {
                const [key, value] = entry;
                dmpInvestigatorIds.push(key);

                if (!value['Volume (ul)'] || value['Volume (ul)'] === '0.00') {
                    const sampleInfo = {
                        investigatorId: key,
                        dmpSampleId: value['DMP ID']
                    }
                    depletedSamples.push(sampleInfo);
                }
            });
            submission.gridValues.forEach((sample) => {
                const investigatorId = sample.userId;
                if (!dmpInvestigatorIds.includes(investigatorId)) {
                    const originalSampleInfo = {
                        investigatorId: investigatorId,
                        dmpSampleId: sample.dmpSampleId,
                        accessionNumber: sample.molecularPathologyAccessionNumber
                    }
                    droppedSamples.push(originalSampleInfo);
                }
            });
        }


        // let sampleIdsToDeidentify = [];
        // deidentify orginal submission's IDs, not DMP
        // Do only if the original samples exist in the DMP submission
        // submission.gridValues.forEach((originalSample) => {
        //     const matchedDmpSample = Object.keys(dmpSamples).find(
        //         (element) => dmpSamples[element]['Investigator Sample ID'] === originalSample.userId
        //     );
        //     if (matchedDmpSample) {
        //         let id = originalSample.patientId;
        //         let idType = 'Standard';
        //         if (originalSample.patientId.includes('P-')) idType = 'DMP Patient ID';
        //         if (originalSample.patientId.match(/^[0-9]{8}$/)) idType = 'MRN';

        //         sampleIdsToDeidentify.push({ patientId: id, idType: idType });
        //     }
        // });
        // reject('done');

        // promises.push(handlePatientIds(sampleIdsToDeidentify, username));

        Promise.all(promises).then((results) => {
            let [oncoResult, indexResult] = results;

            let translatedSamples = translateDmpToBankedSample(dmpSamples, submission, oncoResult, indexResult);
            let { igoSamples, translationIssues } = translatedSamples;

            // let mergedSamplesResult = mergePatientIdsIntoSamples(igoSamples, patientIdResult);
            // let { mergedSamples, failedIdsMessage } = mergedSamplesResult;
            // translationIssues.push(failedIdsMessage);
            // igoSamples.sort(compareByWellPosition);

            igoSamples.sort(compareByWellPosition);

            let parsedSubmission = {
                username: submission.username,
                gridValues: igoSamples,
                submitted: false,
                transactionId: submission.transactionId,
                formValues: {
                    ...submission.formValues,
                    container: 'Plates',
                    groupingChecked: false,
                    patientIdType: 'MSK-Patients (or derived from MSK Patients)',
                    patientIdTypeSpecified: 'MRN',
                    serviceId: submission.formValues.serviceId ? submission.formValues.serviceId : '000000',
                    species: 'Human',
                    numberOfSamples: numReturnedSamples,
                },
            };
            delete parsedSubmission.formValues._id;
            // translationIssues.push({ sampleMatch: doSamplesMatch(dmpSamples, submission) });

            resolve({ parsedSubmission, translationIssues, droppedSamples, depletedSamples });
        });
    });
}

// Method to translate DMP sequence to IGO Index ID.
// Match the dual index sequence submitted by DMP with 'DUAL_IDT_LIB' dual barcode sequences at IGO.
// If match is found return IGO dual index ID.
function getDualIndex(dualSequence, indexEntries){
    let match = indexEntries.find(entry => entry[0].includes("DUAL_IDT_LIB_") && entry[1]===dualSequence);
  	return match ? match[0] : "";
}

// DNA Input Into Library: 250.0 | not needed,
// Tracking ID: 20200619YJ | not needed,
//      Sex: M | Gender/gender (to our great shame),
// Specimen Type (Resection , Biopsy or Blood): biopsy |Specimen Type/specimenType, if N/A = Biopsy, cytology = other (preservation = Frozen), if sampleClass = Normal = specimentType = Blood, catchall: same value, just capitalized
//      Sample Class (Primary , Met or Normal): Primary | SampleClass/sampleClass = sampleClass === Metastatic ? Metastasis : sampleClass ,
//      Index: IDT65 | if Library, BarcodeId = Index Sequence.replace('','DMP0'),
//      Nucleic Acid Type (Library or DNA): Library | Material from original submission,
// Tumor Type: Esophagus_Stomach:Esophageal Adenocarcinoma | Tumor Type/tumorType, simply fill and let grid translate,
//      Concentration (ng/ul): 45.88 | Concentration (ng/ul)/concentration ,
//      Well Position: D1 | wellPosition, If empty, skip
//      Preservation (FFPE or Blood): there are way more options than FFPE/Blood here but they were added later
// Study of Title: TRAP | not needed,
//      Collection Year: 2019 | CollectionYear/collectionYear,
// Sample Approved By CMO:  | not needed,
//      Volume (ul): 21.80 | Volumne (ul)/volume,
// Received DNA Mass (ng): 1000.18 | not needed,
//      Investigator Sample ID: P-0037409-T03-WES | UserSampleId/userId,
// PI Name: Yelena Janjigian | not needed,,
//      Barcode/Plate ID: 20200619YJ | PlateId, plateId,
// DMP ID: P-0037409-T03-IM6 | not needed,
// Index Sequence: TGGAACAA | not needed
//      Requested Reads | RequestedReads/requestedReads

// MRN = fill depending on DMP ID if possible
//      Organism = Human
//      Species = Human
// TransactionId = Originial TransactionId,
// Investigator = Original Submitter
// RequestedReads = Added By PM
// ServiceId = Added By PM
// TODO Refactor: Only do CRDB if PatientID needed in IGO. Same with ONCO.
function translateDmpToBankedSample(dmpSamples, submission, oncoResult, indexResult) {
    let igoSamples = [];
    let translationIssues = [];
    const hasIndex = submission.formValues.material.includes('Library');

    Object.keys(dmpSamples).forEach((element, index) => {
        let rowIssues = [];
        const dmpSample = dmpSamples[element];
        const dmpInvestigatorSampleId = dmpSample['Investigator Sample ID'];
        const dmpWellPosition = dmpSample['Well Position'];
        const dmpPreservation = dmpSample['Preservation (FFPE or Blood)'];
        const dmpSampleClass = dmpSample['Sample Class (Primary, Met or Normal)'];
        const dmpSpecimenType = dmpSample['Specimen Type (Resection, Biopsy or Blood)'];
        const dmpTumorType = dmpSample['Tumor Type'];

        //  values translated from dmp output
        //  coverage and patientIds are pulled from original sample
        let igoInvestigatorSampleId, igoWellPosition, igoPreservation, igoSampleOrigin, igoSampleClass, igoSpecimenType, igoTumorType;

        igoInvestigatorSampleId = dmpInvestigatorSampleId;
        igoWellPosition = dmpWellPosition;
        var wellPosMatch = /([A-Za-z]+)(\d+)/.exec(igoWellPosition);
        if (!wellPosMatch) {
            rowIssues.push(
                `Invalid Well Position ${igoWellPosition}, this will affect sorting and needs to be resolved prior to submission.`
            );
        }

        if (dmpWellPosition === '') {
            rowIssues.push(`No WellPosition received ${igoWellPosition}, sample skipped.`);
            return;
        }

        igoPreservation = dmpPreservation === 'Blood' ? 'EDTA' : dmpPreservation;
        igoSampleOrigin = dmpPreservation === 'FFPE' ? 'Tissue' : dmpPreservation;
        igoSampleClass = dmpSampleClass === 'Metastatic' ? 'Metastasis' : dmpSampleClass;

        if (dmpSpecimenType === 'N/A') {
            igoSpecimenType = 'other';
        } else if (dmpSpecimenType === 'Cytology') {
            igoSpecimenType = 'other';
            igoPreservation = 'Frozen';
        } else if (dmpSampleClass === 'Normal') {
            igoSpecimenType = 'Blood';
        } else {
            igoSpecimenType = dmpSpecimenType.charAt(0).toUpperCase() + dmpSpecimenType.slice(1);
        }

        let oncoMatch = findOncoMatch(dmpTumorType, dmpSampleClass, oncoResult);

        if (oncoMatch.status !== '') rowIssues.push(oncoMatch.status);
        igoTumorType = oncoMatch.tumorType;

        let igoSample = {
            vol: dmpSample['Volume (ul)'],
            concentration: dmpSample['Concentration (ng/ul)'],
            wellPosition: rowIssues.some((el) => el.includes('Well Pos')) ? `Invalid: ${igoWellPosition}` : igoWellPosition,
            plateId: dmpSample['Barcode/Plate ID'],
            // not called sex. unclear why.
            gender: dmpSample['Sex'],
            collectionYear: dmpSample['Collection Year'],
            species: 'Human',
            // not called tumorType. unclear why.
            cancerType: igoTumorType,
            preservation: igoPreservation,
            sampleOrigin: igoSampleOrigin,
            sampleClass: igoSampleClass,
            specimenType: igoSpecimenType,
            userId: igoInvestigatorSampleId,
        };

        if (hasIndex) {
            let igoIndex = dmpSample['Index'].replace('DMP0', '');
            let indexEntries = Object.entries(indexResult);
            // Rough logic for translating DMP Dual barcodes to IGO Barcodes
            let dmpSequence = dmpSample['Index Sequence'];
            let dualSequence = dmpSample['IndexTag I5'];
            let isDual = dmpSequence.split('-').length === 2 || (dualSequence);
            let fullSequence = dmpSequence;
            let indexMatch = "";
            if (isDual){
                if (dualSequence) {
                    fullSequence = `${dmpSequence}-${dualSequence}`;
                }
                const igoDualIndex = getDualIndex(fullSequence, indexEntries);
                if (igoDualIndex) {
                    igoIndex = igoDualIndex;
                    indexMatch = fullSequence;
                }
            } else {
                indexMatch = indexResult[igoIndex];
            }
    
            if (isDual && !indexMatch) {
                rowIssues.push(`${fullSequence} dual sequence is not known to IGO.`);
            }
            if (!isDual && !indexMatch){
                rowIssues.push(`${igoIndex} is not known to IGO.`);
            }
            igoSample = {
                ...igoSample,
                index: igoIndex,
                indexSequence: indexMatch || fullSequence,
            };
        }
        // ADD ORIGINAL SAMPLE VALUES
        const originalSample = submission.gridValues.find((element) => element.userId === dmpInvestigatorSampleId);

        if (!originalSample) {
            rowIssues.push(
                `No matching Sample ID found in original submission. Coverage and deidentified PatientIDs could not be pulled from original but can be entered here.`
            );
        } else {
            if ('requestedCoverage' in originalSample) {
                igoSample.requestedCoverage = originalSample.requestedCoverage;
            }
            igoSample.patientId = originalSample.patientId;
            igoSample.cmoPatientId = originalSample.cmoPatientId;
            igoSample.normalizedPatientId = originalSample.normalizedPatientId;
        }

        if (rowIssues.length > 0) {
            translationIssues[index] = `${igoInvestigatorSampleId}: ${rowIssues.join('–')}`;
        }
        igoSamples.push(igoSample);
    });
    return { igoSamples: igoSamples, translationIssues };
}

/**
 * Well Position A1,A2...A12,B1,B2...H12
 * Well Position Rows = A-H
 * Well Position Columns = 1-12
 * A1 < B1, A2 > B1 => compare numbers/cols first, then letters/rows
 * Eg. If 3 < 4 already sorted. if 4 > 3, compare letters to sort
 */
function compareByWellPosition(a, b) {
    let aRow = a.wellPosition[0];
    let aColumn = parseInt(a.wellPosition.slice(1));
    let bRow = b.wellPosition[0];
    let bColumn = parseInt(b.wellPosition.slice(1));

    if (a === b) {
        return 0;
    }
    // a is less than b by some ordering criterion
    if (aColumn < bColumn) {
        return -1;
    }
    // column is the same, compare row letter next
    if (aColumn === bColumn) {
        return aRow < bRow ? -1 : 1;
    }

    // else: a is greater than b by the ordering criterion
    return 1;
}

/**
 * Find closes match to DMP returned tumor type in OncoList.
 * DMP usually returns tumor types as "Esophagus_Stomach:Stomach Adenocarcinoma"
 * @param {string} tumorType
 * @param {array} oncoResult
 * @return {object} {tumorType: string, status: string}
 */
function findOncoMatch(tumorType, sampleClass, oncoResult) {
    let tumorTypeToMatch = tumorType.split(':')[1];
    if (tumorType.split(':')[0] === 'N/A') {
        return { status: '', tumorType: 'Normal' };
    }
    // if (tumorType.split(':')[0] === 'other' || tumorType.split(':')[0] === 'Other') {
    //     return { status: '', tumorType: 'Normal' };
    // }
    var match = oncoResult.find((a) => a.includes(tumorTypeToMatch));
    if (match) {
        let tumorId = match.split(': ')[1];

        return { status: `Closest match found for "${tumorType}" was "${tumorTypeToMatch}"`, tumorType: tumorId };
    } else {
        return { status: `No match found for: "${tumorType}"`, tumorType: tumorType };
    }
}

// All investigator entered patient IDs are sent to the CRDB for anonymization. This is done in batches of 10 parallel requests at a time.
// CRDB's oracle DB has a connection limit. To stay within it, we limited it to 10.
// ID's need to be normalized/redacted/handled based on their type.
// CMO IDs need to be sent to the CRDB without the C- that users enter.
// MRNs need to be redacted and return sex information as well as the patient ID
// DMP IDs only return a value if they were found in the CRDB. If they aren't, a message must be shown to the user recommending they enter a MRN instead.
export function handlePatientIds(ids, username) {
    return new Promise((resolve, reject) => {
        let patientIdPromises = [];
        const idsWithCrdbInputId = addCrdbInputId(ids, username);
        const idsByType = sortPatientIdsByType(idsWithCrdbInputId, username);

        // add crdb queries for each type of id, add empty promises if id type is not present on request so that Promise.all has reliable return value and order of dmp, cmo and standard ids
        if (!_.isEmpty(idsByType.standardPatientIds)) {
            let ids = [];
            idsByType.standardPatientIds.forEach((element) => ids.push(element.crdbInputId));
            patientIdPromises.push(crdbServices.getCrdbIds(ids));
            countIdRequests('STANDARD ID', username);
        }
        if (!_.isEmpty(idsByType.dmpPatientIds)) {
            let { query, bindValues } = generateCrdbDbStatement(idsByType.dmpPatientIds, 'dmp_id');
            patientIdPromises.push(crdbServices.crdbDbQuery(query, bindValues));
            countIdRequests('DMP ID', username);
        }
        if (!_.isEmpty(idsByType.cmoPatientIds)) {
            let { query, bindValues } = generateCrdbDbStatement(idsByType.cmoPatientIds, 'cmo_id');
            patientIdPromises.push(crdbServices.crdbDbQuery(query, bindValues));
            countIdRequests('CMO ID', username);
        }

        Promise.all(patientIdPromises)
            .then((result) => {
                let crdbResultIds = result.flat();
                let deIdentifiedIds = JSON.parse(JSON.stringify(idsWithCrdbInputId));

                deIdentifiedIds.forEach((idElement) => {
                    //  Patient ID originally entered by User
                    let userInputId = idElement.patientId;
                    // Patient ID sent to CRDB
                    let crdbInputId = idElement.crdbInputId;
                    // Match CRDB Result values to its original ID
                    let resultIdMatch = crdbResultIds.find(
                        (resultIdElement) =>
                            resultIdElement.crdbOutput === crdbInputId ||
                            resultIdElement.dmpId === crdbInputId ||
                            resultIdElement.mrn === crdbInputId
                    );

                    if (resultIdMatch) {
                        idElement.cmoPatientId = `C-${resultIdMatch.crdbOutput}`;

                        // finetuning
                        if (idElement.idType === 'CMO Patient ID') {
                            idElement.finalPatientId = idElement.cmoPatientId;
                            idElement.normalizedPatientId = idElement.cmoPatientId;
                        } else if (idElement.idType === 'MRN') {
                            idElement.finalPatientId = constants.mrnRedactedString;
                            idElement.normalizedPatientId = constants.mrnRedactedString;
                        } else if (idElement.idType === 'DMP Patient ID') {
                            idElement.finalPatientId = resultIdMatch.dmpId;
                            idElement.normalizedPatientId = resultIdMatch.dmpId;
                        } else {
                            // no type matched? CRDB Input ID already includes USERNAME_ or CELLLINE_
                            idElement.finalPatientId = userInputId;
                            idElement.normalizedPatientId = idElement.crdbInputId.toUpperCase();
                        }

                        if ('sex' in resultIdMatch) idElement.sex = resultIdMatch.sex;
                    } else {
                        if (idElement.idType === 'MRN') idElement.message = 'MRN(s) could not be de-identified or verified.';
                        else idElement.message = `${idElement.idType} ${userInputId} could not be de-identified or verified. `;
                        idElement.finalPatientId = '';
                        idElement.cmoPatientId = '';
                        idElement.normalizedPatientId = '';
                    }
                    delete idElement.mrn;
                    delete idElement.crdbInput;
                    delete idElement.patientId;
                    delete idElement.userInputId;
                });
                resolve(deIdentifiedIds);
            })
            .catch((reasons) => reject(reasons));
    });
}

// to import submissions, export json from table (using mysqlworkbench, for example)
// change first line to export const submissions = [...]
export function translateSqlSubmissions(sqlSubmissions) {
    let parsedSubmissions = [];
    for (let i = 0; i < sqlSubmissions.length; i++) {
        const submission = sqlSubmissions[i];

        try {
            let formValues = JSON.parse(submission.form_values);
            if (typeof formValues == 'string') {
                formValues = JSON.parse(formValues);
            }

            let gridValues = JSON.parse(submission.grid_values);
            if (typeof gridValues == 'string') {
                gridValues = JSON.parse(gridValues);
            }

            // formValues need to be converted to camelCase
            for (let element in formValues) {
                if (element.includes('_')) {
                    let camelKey = toCamel(element);
                    formValues[camelKey] = formValues[element];
                    delete formValues[element];
                }
            }
            if (formValues.patientIdType === 'MSK-Patients (or derived from MSK Patients)') {
                formValues.patientIdTypeSpecified = 'CMO Patient ID';
            }
            let transactionId = submission.transaction_id || null;
            let createdAt = submission.created_on || null;
            let updatedAt = submission.updated_on || null;

            let parsedSubmission = {
                ...submission,
                formValues: formValues,
                gridValues: gridValues,
                appVersion: APP_VERSION,
                transactionId: transactionId,
                createdAt: new Date(createdAt).valueOf() / 1000,
                updatedAt: new Date(updatedAt).valueOf() / 1000,
                submittedAt: transactionId,
            };
            delete parsedSubmission.form_values;
            delete parsedSubmission.grid_values;
            parsedSubmissions.push(parsedSubmission);
        } catch (error) {
            console.log(error);
            console.log(submission);
            console.log(typeof JSON.parse(submission.grid_values));
            return [];
        }
    }

    return parsedSubmissions;
}

//  UTIL
export function getTransactionIdForDmp() {
    const now = Date.now();
    const transactionId = Math.floor(now);
    return transactionId;
}
export function getTransactionIdForMongo() {
    const now = Date.now();
    const transactionId = Math.floor(now / 1000);
    return transactionId;
}

function getDmpSpecimenType(material) {
    let dmpMaterial = 'unknown';
    if (material === 'DNA/cDNA Library') dmpMaterial = 'Library';
    if (material === 'DNA') dmpMaterial = 'gDNA';
    return dmpMaterial;
}
function last7Days() {
    return '0123456'.split('').map(function (n) {
        var d = new Date();
        d.setDate(d.getDate() - n);

        return (function (day, month, year) {
            return [day < 10 ? '0' + day : day, month < 10 ? '0' + month : month, year].join('-');
        })(d.getDate(), d.getMonth(), d.getFullYear());
    });
}

function generateCrdbDbStatement(patientIds, table) {
    let bindPlaceholders = [];
    let bindValues = [];

    let i = 0;
    patientIds.forEach((element) => {
        if (!bindValues.includes(element.crdbInputId)) {
            bindPlaceholders.push(`:bv${i + 1}`);
            bindValues.push(element.crdbInputId);
            ++i;
        }
    });

    // Trusting NODE OraclDB bind to sanitize
    let query = `SELECT pt_mrn, cmo_id, dmp_id FROM crdb_cmo_loj_dmp_map WHERE ${table} IN (${bindPlaceholders})`;
    return { query, bindValues };
}

function addCrdbInputId(ids, username) {
    let result = [];
    ids.forEach((idElement) => {
        let idType = idElement.idType;
        let patientId = idElement.patientId;
        switch (idType) {
            case 'MRN':
            case 'DMP Patient ID':
                result.push({ ...idElement, crdbInputId: patientId });
                break;
            case 'CMO Patient ID':
                result.push({ ...idElement, crdbInputId: patientId.replace('C-', '') });
                break;
            case 'Cell Line Name':
                result.push({ ...idElement, crdbInputId: `CELLLINE_${patientId}` });
                break;
            default:
                result.push({ ...idElement, crdbInputId: `${username.toUpperCase()}_${patientId}` });
        }
    });
    return result;
}

function sortPatientIdsByType(ids, username) {
    let standardPatientIds = [];
    let dmpPatientIds = [];
    let cmoPatientIds = [];
    ids.forEach((idElement) => {
        let idType = idElement.idType;
        switch (idType) {
            case 'MRN':
            case 'Cell Line Name':
                standardPatientIds.push(idElement);
                break;
            case 'CMO Patient ID':
                cmoPatientIds.push(idElement);
                break;
            case 'DMP Patient ID':
                dmpPatientIds.push(idElement);
                break;
            default:
                standardPatientIds.push(idElement);
        }
    });
    return { standardPatientIds, dmpPatientIds, cmoPatientIds };
}

export const toCamel = (s) => {
    return s.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
};

const countIdRequests = (id, username) => {
    fs.appendFile('idTypeCounter.txt', `${id}, ${username}, ${new Date().toLocaleDateString()}\r\n`, function (err) {
        if (err) logger.error(err);
    });
};
