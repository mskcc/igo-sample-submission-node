const services = require('../services/services');
const crdbServices = require('../services/crdbServices');
const { logger } = require('../util/winston');
const { constants } = require('./constants');
const submitColumns = require('./columns');
import CacheService from './cache';
import { createLogger } from 'winston';
import { submission } from '../controllers/SubmissionController';
const dmpColumns = require('./dmpColumns');
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance

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
                logger.log('info', `Column '${columnName}' not found in possible columns.`);
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
                    reject('Could not cache picklists.');
                    return;
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
                logger.log('info', `Column '${columnName}' not found in possible columns.`);
                if (!allColumns.deprecatedColumns.includes(columnName)) {
                    logger.log('info', `Column '${columnName}' not found in possible or deprecated columns.`);
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

        let numberOfRows = formValues.numberOfSamples;
        for (var i = 0; i < numberOfRows; i++) {
            columns.columnFeatures.map((entry) => {
                rowData[i] = { ...rowData[i], [entry.data]: '' };
                if (entry.type === 'checkbox') {
                    rowData[i] = { ...rowData[i], [entry.data]: false };
                }
                if (entry.data === 'species' || entry.data === 'organism') {
                    rowData[i] = {
                        ...rowData[i],
                        organism: formValues.species,
                    };
                }
                if (entry.data === 'preservation') {
                    if (formValues.material === 'Blood') {
                        rowData[i] = {
                            ...rowData[i],
                            preservation: 'EDTA-Streck',
                        };
                    } else if (formValues.material === 'Buffy Coat') {
                        rowData[i] = {
                            ...rowData[i],
                            preservation: 'Frozen',
                        };
                    }
                }
                if (entry.data === 'sampleOrigin') {
                    if (formValues.material === 'Blood') {
                        rowData[i] = {
                            ...rowData[i],
                            sampleOrigin: 'Whole Blood',
                        };
                    } else if (formValues.material === 'Buffy Coat') {
                        rowData[i] = {
                            ...rowData[i],
                            sampleOrigin: 'Buffy Coat',
                        };
                    }
                }
                if (entry.data === 'specimenType') {
                    if (formValues.material === 'Blood' || formValues.material === 'Buffy Coat') {
                        rowData[i] = {
                            ...rowData[i],
                            specimenType: 'Blood',
                        };
                    }
                }
                if (entry.data === 'patientId' && entry.columnHeader === 'Cell Line Name') {
                    rowData[i] = { ...rowData[i], specimenType: 'CellLine' };
                }
            });
            if (rowData.length === parseInt(numberOfRows)) {
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

                let isSubmitted = submission.submitted;
                rows[i] = {
                    serviceId: serviceId,
                    transactionId: submission.transactionId,
                    username: submission.username,
                    sampleType: submission.formValues.material,
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

                if (submissionType === 'dmp') {
                    const samplesApproved = submission.gridValues.filter((element) => {
                        return element.isApproved;
                    });
                    let isReviewed = submission.reviewed;
                    rows[i].samplesApproved = `${samplesApproved.length}/${submission.formValues.numberOfSamples} samples`;
                    rows[i].reviewed = isReviewed ? 'yes' : 'no';
                    rows[i].reviewedAt = submission.reviewedAt ? parseDate(submission.reviewedAt) : '';
                    if (userRole !== 'user') {
                        rows[i].review = `<span  submitted=${isSubmitted && !isReviewed} service-id=${serviceId} submission-id=${
                            submission.id
                        } class="material-icons grid-action${isSubmitted && !isReviewed ? '' : '-disabled'}">assignmentturnedin</span>`;
                    }
                }

                if (userRole !== 'user') {
                    rows[i].unsubmit = !isSubmitted
                        ? `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action-disabled">undo</span>`
                        : `<span submitted=${isSubmitted} service-id=${serviceId} submission-id=${submission.id} class="material-icons grid-action">undo</span>`;
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
        let recipe = submission.formValues.application;
        let sampleType = submission.formValues.material;
        let samples = submission.gridValues;
        let submittedSamples = [];
        // prep banked sample record
        for (let i = 0; i < samples.length; i++) {
            let bankedSample = Object.assign({}, samples[i]);
            bankedSample.serviceId = serviceId;
            bankedSample.recipe = recipe;
            bankedSample.sampleType = sampleType;
            bankedSample.transactionId = transactionId;
            bankedSample.igoUser = user.username;
            bankedSample.investigator = submission.username;
            bankedSample.user = process.env.API_USER;
            bankedSample.concentrationUnits = 'ng/uL';

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
                    logger.log('info', `Submitted ${bankedSample.userId}.`);
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
            if (columnName === 'Reads Requested/Coverage') {
                promoteColFeature = Object.assign({}, submitColumns.gridColumns[columnName]);
                promoteColFeature.data = 'readSummary';
            } else if (columnName in submitColumns.gridColumns) {
                promoteColFeature = Object.assign({}, submitColumns.gridColumns[columnName]);
            } else {
                logger.log('info', `${columnName} not found`);
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
        let data = {
            transactionId: transactionId,
            requestId: requestId || 'NULL',
            projectId: projectId || 'NULL',
            serviceId: serviceId,
            materials: materials,
            bankedId: bankedSampleIds,
            igoUser: process.env.API_USER,
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
        const columns = dmpColumns.dmpIntakeForms[combination];
        if (columns) {
            resolve(columns);
        } else {
            reject(`Could not retrieve grid for '${material}' and '${application}'.`);
        }
    });
}
export function publishDmpData(submissions) {
    // cmorequests will be array of objects with each objects being on submission with an array of samples
    return new Promise((resolve, reject) => {
        let dmpData = {
            cmoRequests: [],
            cmoResponseId: getTransactionId(),
            dmpRequestId: getTransactionId(),
            requestTime: getTransactionId(),
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
        let filteredSubmissions = [];
        // for each request, get rid of unapproved samples
        requests.forEach(function (request, index) {
            const samples = request.gridValues;
            let filteredRequest = Object.assign({}, request);

            const approvedSamples = samples.filter((sample) => sample.isApproved);

            if (approvedSamples.length > 0) {
                filteredRequest.samples = approvedSamples;
                delete filteredRequest.gridValues;

                filteredDmpData.cmoRequests.push(filteredRequest);
            }
            if (index === requests.length - 1) {
                // filteredDmpData.cmoRequests = filteredDmpData.cmoRequests.filter((element) => element);
                resolve(filteredDmpData);
            }
        });
    });
}
function getTransactionId() {
    const now = Date.now();
    const transactionId = Math.floor(now / 1000);
    return transactionId;
}
